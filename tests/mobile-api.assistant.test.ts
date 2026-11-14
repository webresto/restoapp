import { expect } from "chai";
import Ajv from "ajv";
import jwt from "jsonwebtoken";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { registerAssistant } from "../api/hooks/app-mobile-api/apps/assistant";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Ассистент» through the mobile API: the app of the RestoApp touch client that talks to the assistant of this
 * panel (adminizer's AI panel) — declared to whoever holds the panel's right `ai-assistant-openharness`, drawn by the
 * client (`client.native`), and its one method gives the address of the panel's agent and a short web session of
 * the same account. The same contract as Resto Cloud's (cloud-panel, layers/app-mobile-api/lib/assistant.ts).
 */
describe("app-mobile-api: «Ассистент»", function () {
  this.timeout(30000);

  const SECRET = "jwt-secret";
  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };
  let model: { id: string; title: string } | null;

  const validDeclaration = (() => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    return ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
  })();

  async function request(method: string, path: string, options: { token?: string; body?: unknown } = {}) {
    const response = await fetch(`${server.url}${path}`, {
      method,
      headers: {
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }

  async function login(name: string): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const response = await request("POST", "/api/mobile/auth/login", {
      body: { login: name, password: PASSWORD, captchaSolution: await solve(challenge.body.result.task), device: { name: "Pixel", platform: "android" } },
    });
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    return response.body.result.token;
  }

  const call = (token: string, method: string, params: unknown = {}) =>
    request("POST", `/api/mobile/call/${method}?lang=ru`, { token, body: { params } });

  beforeEach(async () => {
    fakes = await makeFakes();
    model = { id: "openharness", title: "RestoApp Assistant" };
    registerAssistant(fakes.deps.registry, {
      model: () => model,
      routePrefix: () => "/admin",
      sign: (user, ttl) => jwt.sign({ id: user.id, login: user.login, isAdministrator: Boolean(user.isAdministrator) }, SECRET, { expiresIn: ttl }),
    }, "openharness");
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  it("is declared as a native app to whom the panel's right allows, and gives a session of the panel", async () => {
    const admin = await login("admin");
    const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token: admin })).body.result;
    expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
    const app = declaration.apps.find((a: any) => a.id === "assistant");
    expect(app).to.deep.include({ title: "Ассистент", category: "Помощь", home: "assistant.session", scope: "server" });
    expect(app.client).to.deep.equal({ native: "assistant", min: 1 });
    expect(app.methods.map((m: any) => m.name)).to.deep.equal(["assistant.session"]);

    const session = (await call(admin, "assistant.session")).body.result;
    expect(session).to.deep.include({ transport: "adminizer-agent", model: "openharness", title: "RestoApp Assistant", base: "/admin/api/ai-assistant/agent/openharness" });
    expect(session.csrf).to.deep.equal({ cookie: "XSRF-TOKEN", header: "X-XSRF-TOKEN" });
    expect(session.cookie.name).to.equal("adminizer_jwt");
    const payload: any = jwt.verify(session.cookie.value, SECRET);
    expect(payload).to.deep.include({ id: 1, login: "admin", isAdministrator: true });
    expect(payload.exp - payload.iat).to.equal(3600);
  });

  it("is not there for whom the panel does not let in, and answers unavailable while the panel has no assistant", async () => {
    const stock = await login("stock");
    const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token: stock })).body.result;
    expect(declaration.apps.map((a: any) => a.id)).to.not.include("assistant");
    expect((await call(stock, "assistant.session")).body.error.code).to.equal("forbidden");

    model = null;
    const admin = await login("admin");
    expect((await call(admin, "assistant.session")).body.error.code).to.equal("unavailable");
  });
});
