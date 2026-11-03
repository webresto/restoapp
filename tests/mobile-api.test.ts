import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { MobileApiRegistry, RegistrationError } from "../api/hooks/app-mobile-api/lib/registry";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * The mobile API as an Express application on fake deps — no Sails. Access decisions are made by the
 * real AccessRightsHelper of the installed adminizer with core's stock-manager check.
 */
describe("app-mobile-api", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };

  async function request(method: string, path: string, options: { token?: string; body?: unknown; headers?: Record<string, string> } = {}) {
    const response = await fetch(`${server.url}${path}`, {
      method,
      headers: {
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
        ...(options.headers ?? {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null };
  }

  async function captcha(): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    expect(challenge.status).to.equal(200);
    return solve(challenge.body.result.task);
  }

  async function login(name: string, password = PASSWORD): Promise<string> {
    const response = await request("POST", "/api/mobile/auth/login", {
      body: { login: name, password, captchaSolution: await captcha(), device: { name: "Pixel", platform: "android" } },
    });
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    return response.body.result.token;
  }

  const call = (token: string | undefined, method: string, body: unknown) => request("POST", `/api/mobile/call/${method}`, { token, body });

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("transport", () => {
    it("answers 503 while MOBILE_API_ENABLED is off", async () => {
      fakes.env.enabled = false;
      const response = await request("GET", "/api/mobile/describe");
      expect(response.status).to.equal(503);
      expect(response.body.error).to.include({ code: "unavailable", retryable: true });
    });

    it("answers 404 in JSON inside the prefix, with no-store and the protocol header", async () => {
      const response = await request("GET", "/api/mobile/nothing");
      expect(response.status).to.equal(404);
      expect(response.body.error.code).to.equal("not_found");
      expect(response.headers.get("cache-control")).to.equal("no-store");
      expect(response.headers.get("x-mobile-protocol")).to.equal("1");
    });

    it("refuses plain http when HTTPS is required and trusts X-Forwarded-Proto of one proxy hop", async () => {
      fakes.env.https = true;
      expect((await request("GET", "/api/mobile/auth/challenge")).body.error.code).to.equal("https_required");
      const behindTls = await request("GET", "/api/mobile/auth/challenge", { headers: { "x-forwarded-proto": "https" } });
      expect(behindTls.status).to.equal(200);
    });

    it("refuses a body over 64 KB and a body that is not JSON", async () => {
      const big = await call(undefined, "dishes.list", { params: { q: "x".repeat(70 * 1024) } });
      expect(big.status).to.equal(413);
      expect(big.body.error.code).to.equal("too_large");
      const response = await fetch(`${server.url}/api/mobile/call/dishes.list`, { method: "POST", headers: { "content-type": "application/json" }, body: "{" });
      expect(response.status).to.equal(400);
      expect((await response.json()).error.code).to.equal("invalid");
    });

    it("tells its name and version without a token (server.about)", async () => {
      const response = await call(undefined, "server.about", {});
      expect(response.status).to.equal(200);
      expect(response.body.result).to.deep.equal({ name: "Test server", version: "1.2.3" });
    });
  });

  describe("login", () => {
    it("signs in with a solved CAPTCHA and refuses the same solution twice", async () => {
      const solution = await captcha();
      const body = { login: "stock", password: PASSWORD, captchaSolution: solution, device: { name: "Pixel", platform: "android" } };
      const first = await request("POST", "/api/mobile/auth/login", { body });
      expect(first.status).to.equal(200);
      expect(first.body.result).to.include({ protocolVersion: 1 });
      expect(first.body.result.user).to.deep.equal({ id: 2, login: "stock", fullName: "stock" });
      expect(first.body.result.token).to.match(/^[A-Za-z0-9_-]{43}$/);

      const replay = await request("POST", "/api/mobile/auth/login", { body });
      expect(replay.status).to.equal(400);
      expect(replay.body.error.code).to.equal("captcha_invalid");
    });

    it("accepts a task issued by one worker in another one (the cluster has no shared memory)", async () => {
      const solution = await captcha();
      const otherWorker = await listen(createMobileApi(fakes.deps));
      try {
        const response = await fetch(`${otherWorker.url}/api/mobile/auth/login`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ login: "stock", password: PASSWORD, captchaSolution: solution, device: { name: "Pixel", platform: "android" } }),
        });
        expect(response.status).to.equal(200);
      } finally {
        await otherWorker.close();
      }
    });

    it("refuses a forged, foreign or expired solution", async () => {
      const solution = await captcha();
      const [id, label, ip, exp, sig] = solution.split(":");
      const send = (captchaSolution: string) =>
        request("POST", "/api/mobile/auth/login", { body: { login: "stock", password: PASSWORD, captchaSolution, device: { name: "a", platform: "b" } } });
      expect((await send(`${id}:${label}:${ip}:${Number(exp) + 3600}:${sig}`)).body.error.code).to.equal("captcha_invalid");
      expect((await send(`${id}:${label}:10.0.0.1:${exp}:${sig}`)).body.error.code).to.equal("captcha_invalid");
      fakes.clock.now += 31 * 60 * 1000;
      expect((await send(solution)).body.error.code).to.equal("captcha_invalid");
    });

    it("gives one answer to a wrong login and a wrong password", async () => {
      fakes.env.captcha = false;
      const send = (login: string, password: string) =>
        request("POST", "/api/mobile/auth/login", { body: { login, password, device: { name: "a", platform: "b" } } });
      const wrongLogin = await send("nobody", PASSWORD);
      const wrongPassword = await send("stock", "wrong");
      expect(wrongLogin.status).to.equal(401);
      expect(wrongLogin.body).to.deep.equal(wrongPassword.body);
      expect(wrongLogin.body.error.code).to.equal("invalid_credentials");
    });

    it("lets in only those who may enter the admin panel", async () => {
      fakes.env.captcha = false;
      const response = await request("POST", "/api/mobile/auth/login", {
        body: { login: "outsider", password: PASSWORD, device: { name: "a", platform: "b" } },
      });
      expect(response.status).to.equal(403);
      expect(response.body.error.code).to.equal("forbidden");
    });

    it("limits attempts per IP and login and says when to come back", async () => {
      fakes.env.captcha = false;
      for (let i = 0; i < 10; i++) {
        await request("POST", "/api/mobile/auth/login", { body: { login: "stock", password: "wrong", device: { name: "a", platform: "b" } } });
      }
      const limited = await request("POST", "/api/mobile/auth/login", { body: { login: "stock", password: PASSWORD, device: { name: "a", platform: "b" } } });
      expect(limited.status).to.equal(429);
      expect(limited.body.error).to.include({ code: "rate_limited", retryable: true });
      expect(limited.headers.get("retry-after")).to.equal("60");
    });

    it("makes the CAPTCHA harder after failures with the label", async () => {
      fakes.env.captcha = false;
      for (let i = 0; i < 7; i++) {
        await request("POST", "/api/mobile/auth/login", { body: { login: `user${i}`, password: "wrong", device: { name: "a", platform: "b" } } });
      }
      fakes.clock.now += 2 * 60 * 1000;
      const { PowChallenge } = require("../api/hooks/app-mobile-api/lib/auth/challenge");
      const challenge = new PowChallenge({ ...fakes.deps, used: fakes.powUses, secret: () => "s", baseDifficultyMs: () => 20 });
      expect(await challenge.difficultyMs("login:127.0.0.1")).to.equal(40);
    });

    it("signs a device out on logout, on password change and when the user is disabled", async () => {
      const token = await login("stock");
      expect((await request("GET", "/api/mobile/describe", { token })).status).to.equal(200);
      expect((await request("POST", "/api/mobile/auth/logout", { token })).status).to.equal(200);
      expect((await request("GET", "/api/mobile/describe", { token })).body.error.code).to.equal("unauthorized");

      const second = await login("stock");
      fakes.users.get("stock")!.passwordHashed = require("password-hash").generate("stock-new");
      expect((await request("GET", "/api/mobile/describe", { token: second })).status).to.equal(401);

      fakes.users.get("operator")!.isActive = true;
      const third = await login("operator");
      fakes.users.get("operator")!.isActive = false;
      expect((await request("GET", "/api/mobile/describe", { token: third })).status).to.equal(401);
    });

    it("keeps at most 10 devices per user: the 11th signs the oldest out", async () => {
      fakes.env.captcha = false;
      const tokens: string[] = [];
      for (let i = 0; i < 11; i++) {
        const response = await request("POST", "/api/mobile/auth/login", { body: { login: "admin", password: PASSWORD, device: { name: `d${i}`, platform: "ios" } } });
        tokens.push(response.body.result.token);
        fakes.clock.now += 1000;
        fakes.attempts.rows.length = 0;
      }
      expect((await request("GET", "/api/mobile/describe", { token: tokens[0] })).status).to.equal(401);
      expect((await request("GET", "/api/mobile/describe", { token: tokens[10] })).status).to.equal(200);
    });

    it("expires a device unused for 30 days", async () => {
      const token = await login("stock");
      fakes.clock.now += 31 * 24 * 60 * 60 * 1000;
      expect((await request("GET", "/api/mobile/describe", { token })).status).to.equal(401);
    });
  });

  describe("declaration", () => {
    const validDeclaration = (() => {
      const ajv = new Ajv({ strict: false, allErrors: true });
      ajv.addSchema(contract);
      return ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
    })();

    it("gives a stock manager «Блюда» on their points, in Russian, by the contract", async () => {
      const token = await login("stock");
      const response = await request("GET", "/api/mobile/describe?lang=ru", { token });
      const declaration = response.body.result;
      expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      expect(response.headers.get("x-mobile-revision")).to.equal(declaration.revision);
      expect(declaration.places.map((place: any) => place.id)).to.deep.equal(["p1", "p2"]);
      expect(declaration.apps).to.have.length(1);
      const [dishes] = declaration.apps;
      expect(dishes).to.include({ id: "dishes", title: "Блюда", scope: "place", home: "dishes.list" });
      expect(dishes.places).to.deep.equal(["p1", "p2"]);
      expect(dishes.methods.map((method: any) => method.name)).to.deep.equal(["dishes.list", "dishes.get", "dishes.setBalance", "dishes.setEnabled"]);
      expect(dishes.methods[0].input.properties.filter["x-titles"].stop).to.equal("На стопе");
      expect(dishes.models.dish.fields[1].specials[0]).to.deep.equal({ value: -1, title: "Безлимит" });
    });

    it("gives an operator no «Блюда»", async () => {
      const token = await login("operator");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps).to.deep.equal([]);
      expect(declaration.places).to.deep.equal([]);
    });

    it("shows «Блюда» without points to a group that has the token but no points ticked", async () => {
      const token = await login("nopoints");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps.map((app: any) => [app.id, app.places])).to.deep.equal([["dishes", []]]);
    });

    it("lets the administrator choose among all enabled cooking points", async () => {
      const token = await login("admin");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps[0].places).to.deep.equal(["p1", "p2"]);
    });

    it("changes the revision when a point is taken from the group, and the point stops working", async () => {
      const token = await login("stock");
      const before = await request("GET", "/api/mobile/describe", { token });
      fakes.users.get("stock")!.groups![0].tokens = ["access-to-adminpanel", { tokenId: "stock-manager", rights: ["p1"] }];
      const after = await call(token, "dishes.list", { params: {}, place: "p2" });
      expect(after.status).to.equal(403);
      expect(after.body.error.code).to.equal("place_forbidden");
      expect(after.headers.get("x-mobile-revision")).to.not.equal(before.headers.get("x-mobile-revision"));
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps[0].places).to.deep.equal(["p1"]);
    });

    it("drops the app when stock-manager is taken away", async () => {
      const token = await login("stock");
      fakes.users.get("stock")!.groups![0].tokens = ["access-to-adminpanel"];
      expect((await request("GET", "/api/mobile/describe", { token })).body.result.apps).to.deep.equal([]);
      expect((await call(token, "dishes.list", { params: {}, place: "p1" })).body.error.code).to.equal("forbidden");
    });

    it("forgets a disabled point", async () => {
      const token = await login("admin");
      (fakes.places[1] as any).enable = false;
      expect((await request("GET", "/api/mobile/describe", { token })).body.result.apps[0].places).to.deep.equal(["p1"]);
      expect((await call(token, "dishes.list", { params: {}, place: "p2" })).body.error.code).to.equal("place_forbidden");
    });
  });

  describe("«Блюда»", () => {
    it("lists the limited dishes of one point only, with chips and actions", async () => {
      const token = await login("stock");
      expect((await call(token, "dishes.setBalance", { params: { id: "d1", balance: 5 }, place: "p1" })).status).to.equal(200);
      expect((await call(token, "dishes.setEnabled", { params: { id: "d2", enable: false }, place: "p1" })).status).to.equal(200);

      const p1 = (await call(token, "dishes.list", { params: {}, place: "p1" })).body.result;
      expect(p1.items.map((item: any) => [item.id, item.balance])).to.deep.equal([["d2", 0], ["d1", 5]]);
      expect(p1.counts).to.deep.equal({ limited: 2, stop: 1, all: 3 });
      expect(p1.nextCursor).to.equal(null);
      expect(p1.items[0]._actions).to.deep.equal([{ method: "dishes.setBalance" }, { method: "dishes.setEnabled" }]);

      const stop = (await call(token, "dishes.list", { params: { filter: "stop" }, place: "p1" })).body.result;
      expect(stop.items.map((item: any) => item.id)).to.deep.equal(["d2"]);

      const p2 = (await call(token, "dishes.list", { params: {}, place: "p2" })).body.result;
      expect(p2.items).to.deep.equal([]);
      expect(p2.counts).to.deep.equal({ limited: 0, stop: 0, all: 3 });
    });

    it("answers a change with the updated record and writes the audit", async () => {
      const token = await login("stock");
      const response = await call(token, "dishes.setBalance", { params: { id: "d3", balance: -1 }, place: "p2" });
      expect(response.body.result.item).to.include({ id: "d3", balance: -1, localBalance: -1 });
      expect(response.body.result.item._actions).to.have.length(2);
      expect(fakes.audits).to.have.length(1);
      expect(fakes.audits[0]).to.include({ method: "dishes.setBalance", user: 2, place: "p2", record: "d3", ok: true });
      expect(fakes.audits[0].params).to.deep.equal({ balance: -1 });
    });

    it("validates params and the point", async () => {
      const token = await login("stock");
      const noPlace = await call(token, "dishes.list", { params: {} });
      expect(noPlace.body.error.code).to.equal("invalid");
      const extra = await call(token, "dishes.list", { params: { sort: "name" }, place: "p1" });
      expect(extra.body.error.code).to.equal("invalid");
      expect(extra.body.error.details).to.be.an("array");
      const wrongType = await call(token, "dishes.setBalance", { params: { id: "d1", balance: -2 }, place: "p1" });
      expect(wrongType.body.error.code).to.equal("invalid");
      const pickupOnly = await call(token, "dishes.list", { params: {}, place: "p3" });
      expect(pickupOnly.body.error.code).to.equal("place_forbidden");
      const missing = await call(token, "dishes.get", { params: { id: "zzz" }, place: "p1" });
      expect(missing.status).to.equal(404);
      expect(fakes.audits.filter((event) => event.ok)).to.have.length(0);
    });

    it("pages the catalog with an opaque cursor", async () => {
      const token = await login("stock");
      const all = (await call(token, "dishes.list", { params: { filter: "all" }, place: "p1" })).body.result;
      expect(all.total).to.equal(3);
      expect(all.items).to.have.length(3);
      const bad = await call(token, "dishes.list", { params: { filter: "all", cursor: "nope" }, place: "p1" });
      expect(bad.body.error.code).to.equal("invalid");
    });

    it("hides methods from a user without the token whatever the method", async () => {
      const token = await login("operator");
      expect((await call(token, "dishes.setBalance", { params: { id: "d1", balance: 1 }, place: "p1" })).body.error.code).to.equal("forbidden");
      expect((await call(token, "nothing.here", { params: {} })).body.error.code).to.equal("forbidden");
      expect((await call(undefined, "dishes.list", { params: {}, place: "p1" })).status).to.equal(401);
    });
  });

  describe("registry", () => {
    const app = { id: "demo", version: "1.0.0", title: "Demo", home: "demo.list" };
    const method = { name: "demo.list", app: "demo", kind: "query" as const, title: "List", access: { token: "x" }, input: { type: "object" }, handler: async () => ({}) };

    it("refuses an unknown ui key, view or control", () => {
      const registry = new MobileApiRegistry();
      registry.registerApp(app);
      expect(() => registry.registerMethod({ ...method, ui: { view: "list", colour: "red" } })).to.throw(RegistrationError);
      expect(() => registry.registerMethod({ ...method, ui: { view: "grid" } })).to.throw(RegistrationError);
      expect(() => registry.registerMethod({ ...method, ui: { view: "action", control: { type: "slider" } } })).to.throw(RegistrationError);
    });

    it("refuses a method without access and an open mutation", () => {
      const registry = new MobileApiRegistry();
      registry.registerApp(app);
      const { access, ...withoutAccess } = method;
      expect(() => registry.registerMethod(withoutAccess as any)).to.throw(RegistrationError);
      expect(() => registry.registerMethod({ ...method, kind: "mutation", access: { public: true } })).to.throw(RegistrationError);
    });

    it("refuses an input schema ajv cannot compile strictly", () => {
      const registry = new MobileApiRegistry();
      registry.registerApp(app);
      expect(() => registry.registerMethod({ ...method, input: { type: "object", properties: { q: { maxLenght: 3 } } } })).to.throw(RegistrationError);
    });

    it("refuses a place app without a token for its points, and a script", () => {
      const registry = new MobileApiRegistry();
      expect(() => registry.registerApp({ ...app, scope: "place" })).to.throw(RegistrationError);
      expect(() => registry.registerApp({ ...app, script: "x" } as any)).to.throw(RegistrationError);
    });

    it("registers an own token in the Mobile app department", () => {
      const registry = new MobileApiRegistry();
      registry.registerApp(app);
      registry.registerMethod({ ...method, access: { token: { id: "mobile-app-demo", name: "Demo" } } });
      expect(registry.listOwnTokens()).to.deep.equal([{ id: "mobile-app-demo", name: "Demo", description: "Demo", department: "Mobile app" }]);
      expect(registry.problems()).to.deep.equal([]);
    });

    it("reports a home method that never came", () => {
      const registry = new MobileApiRegistry();
      registry.registerApp(app);
      expect(registry.problems()).to.deep.equal(['app "demo": home method "demo.list" is not registered']);
    });
  });
});
