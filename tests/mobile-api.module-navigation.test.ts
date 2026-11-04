import * as fs from "fs";
import * as path from "path";
import { expect } from "chai";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { Translator } from "../api/hooks/app-mobile-api/lib/i18n";
import type { ModulesPort } from "../api/hooks/app-mobile-api/lib/types";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

/**
 * «Навигация» as it really arrives: the module registers it itself. The hook has nothing of it —
 * `modules/simple-navigation` 1.8 brings the app, its methods, its strings and the built JS
 * (`src/mobile/NavigationMobileApp.ts` there), and this test calls that code through the hook's
 * Express application, over menus in memory instead of Waterline.
 *
 * Skipped when the module is not installed: the hook stands without it.
 */
const MODULE = path.resolve(__dirname, "../modules/simple-navigation");
const ENTRY = path.join(MODULE, "src/mobile/NavigationMobileApp.ts");
const BUNDLE = path.join(MODULE, "assets/mobile/navigation.js");
const installed = fs.existsSync(ENTRY) && fs.existsSync(BUNDLE);

/** The `Navigation` rows as Waterline hands them over, enough for the module's `menus.ts`. */
function memoryMenus() {
  const rows = new Map<string, any>([
    ["m1", { id: "m1", name: "Шапка", mnemonicId: "header", navigation_menu: [{ label: "Меню", link: "/menu", active: true, visible: true }] }],
  ]);
  let next = 2;
  const sorted = () => [...rows.values()].sort((one, other) => String(one.name).localeCompare(String(other.name)));
  return {
    rows,
    find() {
      const deferred: any = Promise.resolve(sorted());
      deferred.sort = () => deferred;
      return deferred;
    },
    async findOne({ id }: { id: string }) {
      return rows.get(id) ?? null;
    },
    create(values: any) {
      return {
        async fetch() {
          const made = { ...values, id: `m${next++}` };
          rows.set(made.id, made);
          return made;
        },
      };
    },
    updateOne({ id }: { id: string }) {
      return {
        async set(values: any) {
          const row = rows.get(id);
          if (!row) return null;
          Object.assign(row, values);
          return row;
        },
      };
    },
    async destroyOne({ id }: { id: string }) {
      const row = rows.get(id);
      rows.delete(id);
      return row ?? null;
    },
  };
}

(installed ? describe : describe.skip)("app-mobile-api with simple-navigation", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };
  let menus: ReturnType<typeof memoryMenus>;

  const modules: ModulesPort = {
    list: async () => [
      { id: "@webresto/core", version: "2.3.4", kind: "system", title: "RestoApp core" },
      { id: "simple-navigation", version: require(path.join(MODULE, "package.json")).version, kind: "installed", title: "simple-navigation" },
    ],
  };

  async function request(method: string, url: string, options: { token?: string; body?: unknown } = {}) {
    const response = await fetch(`${server.url}${url}`, {
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
    return answer.body.result;
  }

  beforeEach(async () => {
    fakes = await makeFakes();
    fakes.deps.modules = modules;
    fakes.deps.translator = new Translator();
    // The right of the module's own admin page, as the module registers it in adminizer, and a
    // marketer who holds nothing else.
    (fakes.deps.access as any).registerToken({ id: "navigation-manager", name: "Navigation", description: "The site's menus", department: "Marketing" });
    fakes.users.get("reader")!.groups = [{ name: "Marketer", tokens: ["access-to-adminpanel", "navigation-manager"] }] as any;

    menus = memoryMenus();
    const registerMobile = require(ENTRY).default;
    registerMobile({
      models: { navigation: menus },
      hooks: { "app-mobile-api": { registry: fakes.deps.registry, translator: fakes.deps.translator } },
      log: { error() {}, verbose() {} },
    });

    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  it("declares the app of the module, in Russian, with a link to the JS the module ships", async () => {
    const declared = await declaration(await login("reader"));

    const app = declared.apps.find((candidate: any) => candidate.id === "navigation");
    expect(app, "the app the module registered").to.exist;
    expect(app.title).to.equal("Навигация");
    expect(app.script.url).to.equal(`/api/mobile/app-assets/navigation/${app.script.sha256}.js`);
    expect(app.script.size).to.equal(fs.statSync(BUNDLE).size);
    // The strings are the module's: it added them to the hook's translator.
    expect(app.methods.find((method: any) => method.name === "navigation.menus").title).to.equal("Меню сайта");
    expect(app.models.menu.fields[0].title).to.equal("Название");

    // The app is named on the module, not on the app: that is where the declaration keeps the link.
    const module = declared.modules.find((candidate: any) => candidate.id === "simple-navigation");
    expect(module.app).to.equal("navigation");
    expect(module.version).to.equal(require(path.join(MODULE, "package.json")).version);
    expect(module.script.sha256).to.equal(app.script.sha256);
  });

  it("serves exactly the bundle that lies in the module", async () => {
    const token = await login("reader");
    const app = (await declaration(token)).apps.find((candidate: any) => candidate.id === "navigation");

    const answer = await request("GET", app.script.url, { token });
    expect(answer.status).to.equal(200);
    expect(answer.body).to.equal(fs.readFileSync(BUNDLE, "utf8"));
  });

  it("edits the menus of the module through the mobile API, by the right of its own page", async () => {
    const token = await login("reader");
    const call = (method: string, params: unknown) => request("POST", `/api/mobile/call/${method}`, { token, body: { params } });

    const list = await call("navigation.menus", {});
    expect(list.status, JSON.stringify(list.body)).to.equal(200);
    expect(list.body.result.items[0]).to.include({ id: "m1", name: "Шапка", mnemonicId: "header", count: 1 });
    expect(list.body.result.links[0].link).to.equal("/menu");

    const added = await call("navigation.create", { name: "Подвал", mnemonicId: "footer" });
    expect(added.status, JSON.stringify(added.body)).to.equal(200);
    const id = added.body.result.item.id;
    expect((await call("navigation.create", { name: "Ещё", mnemonicId: "footer" })).status).to.equal(409);

    const saved = await call("navigation.save", {
      id,
      name: "Подвал сайта",
      items: [
        { label: "Доставка", link: "/static/delivery", visible: true, icon: "local_shipping" },
        { label: "Акции", link: "/stocks", visible: false },
      ],
    });
    expect(saved.status, JSON.stringify(saved.body)).to.equal(200);
    expect(saved.body.result.item).to.include({ name: "Подвал сайта", count: 2 });
    expect(fakes.audits.map((event) => event.method)).to.contain("navigation.save");

    // Written the way the storefronts read it: one switch, both flags; the icon kept, no empty icon.
    const stored = menus.rows.get(id).navigation_menu;
    expect(stored[0]).to.deep.equal({ label: "Доставка", link: "/static/delivery", visible: true, active: true, icon: "local_shipping" });
    expect(stored[1]).to.deep.equal({ label: "Акции", link: "/stocks", visible: false, active: false });

    const read = await call("navigation.menu", { id });
    expect(read.body.result.item.items[0].label).to.equal("Доставка");
    expect((await call("navigation.menu", { id: "nope" })).status).to.equal(404);

    expect((await call("navigation.remove", { id })).status).to.equal(200);
    expect((await call("navigation.remove", { id })).status).to.equal(404);
    expect(menus.rows.has(id)).to.equal(false);
  });

  it("is not there for a user without the right of the module's page", async () => {
    const declared = await declaration(await login("stock"));
    expect(declared.apps.map((app: any) => app.id)).to.not.contain("navigation");
    expect(declared.modules.find((candidate: any) => candidate.id === "simple-navigation").app).to.equal(undefined);
  });

  it("registers nothing on a server without the mobile API", async () => {
    const registerMobile = require(ENTRY).default;
    expect(() => registerMobile({ models: {}, hooks: {}, log: { error() {}, verbose() {} } })).to.not.throw();
  });
});
