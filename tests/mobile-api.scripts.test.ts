import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { MobileApiRegistry, RegistrationError } from "../api/hooks/app-mobile-api/lib/registry";
import type { ModulesPort } from "../api/hooks/app-mobile-api/lib/types";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/** The records of the fixture module's app, in memory. */
class Notes {
  rows = new Map<string, string>([["n1", "Первая"]]);
  async list() {
    return [...this.rows].map(([id, text]) => ({ id, text }));
  }
  async save(id: string, text: string) {
    if (!this.rows.has(id)) return null;
    this.rows.set(id, text);
    return { id, text };
  }
}

/**
 * The app of a module, as a module registers it (docs.md, «Apps a module brings as JS»): `module`
 * names the module, `script` names its built bundle, and the right is the module's own. Nothing of a
 * real module is here — this is the protocol, held by the hook alone.
 */
function registerNotes(registry: MobileApiRegistry, notes: Notes, scriptFile: string): void {
  registry.registerApp({
    id: "notes",
    version: "1.2.3",
    title: "Notes",
    home: "notes.list",
    module: "fixture-module",
    script: { file: scriptFile, min: 1 },
    models: { note: { fields: [{ name: "text", title: "Text", format: "text" }] } },
  });

  registry.registerMethod({
    name: "notes.list",
    app: "notes",
    kind: "query",
    title: "Notes",
    access: { token: "notes-manager" },
    model: "note",
    input: { type: "object", properties: {} },
    handler: async () => ({ items: await notes.list() }),
  });

  registry.registerMethod({
    name: "notes.save",
    app: "notes",
    kind: "mutation",
    title: "Save",
    access: { token: "notes-manager" },
    input: {
      type: "object",
      required: ["id", "text"],
      properties: { id: { type: "string", minLength: 1, maxLength: 64 }, text: { type: "string", minLength: 1, maxLength: 200 } },
    },
    handler: async (params: { id: string; text: string }, ctx) => {
      const item = await notes.save(params.id, params.text);
      if (!item) ctx.fail("not_found", "No such note");
      return { item };
    },
  });
}

/**
 * An app whose code comes from the server (script-apps.plan.md, D12): the declaration carries a link
 * to the JS and its hash, the hook serves that file by the hash, and the modules of the server are in
 * the declaration next to it.
 */
describe("app-mobile-api scripts", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };
  let dir: string;
  let scriptFile: string;
  const BUNDLE = "app({ id: 'notes', routes: {} });\n";

  const modules: ModulesPort = {
    list: async () => [
      { id: "@webresto/core", version: "2.3.4", kind: "system", title: "RestoApp core" },
      { id: "fixture-module", version: "1.2.3", kind: "installed", title: "Fixture module" },
    ],
  };

  async function request(method: string, url: string, options: { token?: string; body?: unknown } = {}) {
    const response = await fetch(url.startsWith("http") ? url : `${server.url}${url}`, {
      method,
      headers: {
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    let body: any = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    return { status: response.status, headers: response.headers, body };
  }

  async function login(name: string): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const solution = await solve(challenge.body.result.task);
    const answer = await request("POST", "/api/mobile/auth/login", {
      body: { login: name, password: PASSWORD, captchaSolution: solution, device: { name: "Test", platform: "desktop" } },
    });
    expect(answer.status, JSON.stringify(answer.body)).to.equal(200);
    return answer.body.result.token;
  }

  async function declaration(token: string) {
    const answer = await request("GET", "/api/mobile/describe?lang=ru", { token });
    expect(answer.status, JSON.stringify(answer.body)).to.equal(200);
    return { declaration: answer.body.result, revision: answer.headers.get("x-mobile-revision") };
  }

  beforeEach(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "mobile-scripts-"));
    scriptFile = path.join(dir, "notes.js");
    fs.writeFileSync(scriptFile, BUNDLE);
    fakes = await makeFakes();
    fakes.deps.modules = modules;
    // The right of the module's own page, registered in adminizer the way the module registers it,
    // and a person who holds nothing else: the app is theirs, «Блюда» is not.
    (fakes.deps.access as any).registerToken({
      id: "notes-manager",
      name: "Notes",
      description: "The records of the fixture module",
      department: "Marketing",
    });
    fakes.users.get("reader")!.groups = [{ name: "Marketer", tokens: ["access-to-adminpanel", "notes-manager"] }] as any;
    registerNotes(fakes.deps.registry, new Notes(), scriptFile);
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("declares the app with a link to its JS and the hash, never the code", async () => {
    const token = await login("admin");
    const { declaration: declared } = await declaration(token);

    const app = declared.apps.find((candidate: any) => candidate.id === "notes");
    expect(app, "the app a module brought").to.exist;
    expect(app.script.url).to.equal(`/api/mobile/app-assets/notes/${app.script.sha256}.js`);
    expect(app.script.size).to.equal(Buffer.byteLength(BUNDLE));
    expect(app.script.min).to.equal(1);
    expect(JSON.stringify(app)).to.not.contain("routes");

    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    const check = ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
    expect(check(declared), JSON.stringify(check.errors)).to.equal(true);
  });

  it("lists the modules of the server, and the script next to the one that brought an app", async () => {
    const token = await login("admin");
    const { declaration: declared } = await declaration(token);

    expect(declared.modules.map((module: any) => module.id)).to.deep.equal(["@webresto/core", "fixture-module"]);
    const system = declared.modules[0];
    expect(system.kind).to.equal("system");
    expect(system.app).to.equal(undefined);
    const module = declared.modules[1];
    expect(module.kind).to.equal("installed");
    expect(module.version).to.equal("1.2.3");
    expect(module.app).to.equal("notes");
    expect(module.script.url).to.contain("/api/mobile/app-assets/notes/");
  });

  it("serves the bundle by its hash, to a signed-in device, cacheable forever", async () => {
    const token = await login("admin");
    const { declaration: declared } = await declaration(token);
    const script = declared.apps.find((app: any) => app.id === "notes").script;

    const answer = await request("GET", script.url, { token });
    expect(answer.status).to.equal(200);
    expect(answer.body).to.equal(BUNDLE);
    expect(answer.headers.get("content-type")).to.contain("application/javascript");
    expect(answer.headers.get("cache-control")).to.contain("immutable");
    expect(answer.headers.get("x-mobile-script-sha256")).to.equal(script.sha256);
  });

  it("refuses a hash it never gave, an unknown app and a device without a token", async () => {
    const token = await login("admin");
    const other = "0".repeat(64);

    expect((await request("GET", `/api/mobile/app-assets/notes/${other}.js`, { token })).status).to.equal(404);
    expect((await request("GET", "/api/mobile/app-assets/notes/whatever.js", { token })).status).to.equal(404);
    expect((await request("GET", `/api/mobile/app-assets/dishes/${other}.js`, { token })).status).to.equal(404);

    const { declaration: declared } = await declaration(token);
    const script = declared.apps.find((app: any) => app.id === "notes").script;
    expect((await request("GET", script.url)).status).to.equal(401);
  });

  it("gives a new link and a new revision for a new build", async () => {
    const token = await login("admin");
    const first = await declaration(token);
    const firstScript = first.declaration.apps.find((app: any) => app.id === "notes").script;

    const rebuilt = await makeFakes();
    rebuilt.deps.modules = modules;
    const other = path.join(dir, "notes.2.js");
    fs.writeFileSync(other, `${BUNDLE}// one more line\n`);
    registerNotes(rebuilt.deps.registry, new Notes(), other);
    const next = await listen(createMobileApi(rebuilt.deps));
    try {
      const challenge = await fetch(`${next.url}/api/mobile/auth/challenge`).then((response) => response.json());
      const solution = await solve((challenge as any).result.task);
      const answer = await fetch(`${next.url}/api/mobile/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ login: "admin", password: PASSWORD, captchaSolution: solution, device: { name: "Test", platform: "desktop" } }),
      }).then((response) => response.json());
      const secondToken = (answer as any).result.token;
      const described = await fetch(`${next.url}/api/mobile/describe?lang=ru`, { headers: { authorization: `Bearer ${secondToken}` } });
      const body = await described.json();
      const secondScript = (body as any).result.apps.find((app: any) => app.id === "notes").script;

      expect(secondScript.sha256).to.not.equal(firstScript.sha256);
      expect(secondScript.url).to.not.equal(firstScript.url);
      expect(described.headers.get("x-mobile-revision")).to.not.equal(first.revision);
    } finally {
      await next.close();
    }
  });

  it("picks up a build that happened while it runs, without a lift", async () => {
    const token = await login("admin");
    const first = await declaration(token);
    const before = first.declaration.apps.find((app: any) => app.id === "notes").script;

    // `npm run build:mobile` of the module, on a server that is already up.
    const rebuilt = `${BUNDLE}// one more line\n`;
    fs.writeFileSync(scriptFile, rebuilt);
    fs.utimesSync(scriptFile, new Date(), new Date(Date.now() + 2000));

    const second = await declaration(token);
    const after = second.declaration.apps.find((app: any) => app.id === "notes").script;
    expect(after.sha256, "a new build is a new hash").to.not.equal(before.sha256);
    expect(after.url).to.equal(`/api/mobile/app-assets/notes/${after.sha256}.js`);
    expect(after.size).to.equal(Buffer.byteLength(rebuilt));
    expect(second.revision, "the revision moves, so the client re-reads describe").to.not.equal(first.revision);
    expect(second.declaration.modules[1].script.sha256).to.equal(after.sha256);

    const fresh = await request("GET", after.url, { token });
    expect(fresh.status).to.equal(200);
    expect(fresh.body).to.equal(rebuilt);
    // The link of the previous build is gone: a client with a stale declaration gets 404 and reads
    // describe again, instead of running code the server no longer has.
    expect((await request("GET", before.url, { token })).status).to.equal(404);
  });

  it("keeps the bundle that works while the file is being written", async () => {
    const token = await login("admin");
    const before = (await declaration(token)).declaration.apps.find((app: any) => app.id === "notes").script;

    // esbuild writes in place: for a moment the file is empty, and that moment must not reach a client.
    fs.writeFileSync(scriptFile, "");

    const during = await declaration(token);
    const kept = during.declaration.apps.find((app: any) => app.id === "notes").script;
    expect(kept.sha256).to.equal(before.sha256);
    const answer = await request("GET", kept.url, { token });
    expect(answer.status).to.equal(200);
    expect(answer.body).to.equal(BUNDLE);

    fs.rmSync(scriptFile);
    const gone = await declaration(token);
    expect(gone.declaration.apps.find((app: any) => app.id === "notes").script.sha256).to.equal(before.sha256);
  });

  it("refuses a registration whose bundle is not there, at start and not in a client", async () => {
    expect(() => registerNotes(new MobileApiRegistry(), new Notes(), path.join(dir, "missing.js"))).to.throw(RegistrationError, "is not readable");

    const empty = path.join(dir, "empty.js");
    fs.writeFileSync(empty, "");
    expect(() => registerNotes(new MobileApiRegistry(), new Notes(), empty)).to.throw(RegistrationError, "is empty");
  });

  it("calls the app of the module by the right of the module's own page", async () => {
    const token = await login("reader");
    const call = (method: string, params: unknown) => request("POST", `/api/mobile/call/${method}`, { token, body: { params } });

    const list = await call("notes.list", {});
    expect(list.status, JSON.stringify(list.body)).to.equal(200);
    expect(list.body.result.items[0]).to.include({ id: "n1", text: "Первая" });

    const saved = await call("notes.save", { id: "n1", text: "Вторая" });
    expect(saved.status, JSON.stringify(saved.body)).to.equal(200);
    expect(saved.body.result.item).to.include({ text: "Вторая" });
    expect(fakes.audits.map((event) => event.method)).to.contain("notes.save");

    expect((await call("notes.save", { id: "nope", text: "Третья" })).status).to.equal(404);
  });

  it("gives the app to whoever holds the right of the page, and nothing else", async () => {
    const token = await login("reader");
    const { declaration: declared } = await declaration(token);
    expect(declared.apps.map((app: any) => app.id)).to.deep.equal(["notes"]);
    expect(declared.modules.find((module: any) => module.id === "fixture-module").app).to.equal("notes");
  });

  it("is not there for a user without the right of the page", async () => {
    const token = await login("stock");
    const { declaration: declared } = await declaration(token);
    expect(declared.apps.map((app: any) => app.id)).to.not.contain("notes");
    expect(declared.modules.find((module: any) => module.id === "fixture-module").app).to.equal(undefined);
    expect((await request("POST", "/api/mobile/call/notes.list", { token, body: { params: {} } })).status).to.equal(403);
  });
});
