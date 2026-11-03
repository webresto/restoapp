import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { MobileApiRegistry, RegistrationError } from "../api/hooks/app-mobile-api/lib/registry";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");
const posContract = require("../api/hooks/app-mobile-api/schema/pos.schema.json");

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

    it("gives an operator «Заказы» on their points and no «Блюда»", async () => {
      const token = await login("operator");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps.map((app: any) => app.id)).to.deep.equal(["orders"]);
      expect(declaration.apps[0].places).to.deep.equal(["p1", "p3"]);
      expect(declaration.places.map((place: any) => place.id)).to.have.members(["p1", "p3"]);
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

  describe("«Клиенты»", () => {
    it("gives the app by the model rights of the panel, and no POS without order-entry", async () => {
      const token = await login("reader");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
      expect(declaration.apps.map((app: any) => app.id)).to.deep.equal(["clients"]);
      const [clients] = declaration.apps;
      expect(clients).to.include({ id: "clients", title: "Клиенты", scope: "server", home: "clients.list" });
      // Reading is allowed, adding is not: the method is simply not in the declaration.
      expect(clients.methods.map((method: any) => method.name)).to.deep.equal(["clients.list", "clients.get"]);
      expect((await call(token, "clients.create", { params: { name: "Гость", phone: "+7 999 000 00 09" } })).body.error.code).to.equal("forbidden");
    });

    it("translates the words of the form it sends with the method", async () => {
      const token = await login("taker");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
      const create = declaration.apps.find((app: any) => app.id === "clients").methods.find((method: any) => method.name === "clients.create");
      // The client draws the form from this schema, so its words have to be the person's language.
      expect(create.ui.control).to.deep.equal({ type: "form" });
      expect(create.input.properties.name.title).to.equal("Имя");
      expect(create.input.properties.phone["x-format"]).to.equal("phone");
      const english = (await request("GET", "/api/mobile/describe?lang=en", { token })).body.result;
      const en = english.apps.find((app: any) => app.id === "clients").methods.find((method: any) => method.name === "clients.create");
      expect(en.input.properties.name.title).to.equal("Name");
    });

    it("finds a customer by the last digits of the number and by name", async () => {
      const token = await login("taker");
      const byDigits = (await call(token, "clients.list", { params: { q: "0033" } })).body.result;
      expect(byDigits.items.map((item: any) => item.id)).to.deep.equal(["u3"]);
      const byName = (await call(token, "clients.list", { params: { q: "Петров" } })).body.result;
      expect(byName.items.map((item: any) => item.id)).to.deep.equal(["u1"]);
      const all = (await call(token, "clients.list", { params: {} })).body.result;
      expect(all.items.map((item: any) => item.id)).to.deep.equal(["u3", "u2", "u1"]);
      expect(all.items[2]._actions).to.deep.equal([]);
    });

    it("shows a card with addresses and recent orders, and 404s an unknown one", async () => {
      const token = await login("taker");
      const card = (await call(token, "clients.get", { params: { id: "u1" } })).body.result.item;
      expect(card.addresses).to.deep.equal(["ул. Ленина, 5, кв. 12"]);
      expect(card.orders).to.have.length(1);
      expect((await call(token, "clients.get", { params: { id: "nope" } })).body.error.code).to.equal("not_found");
    });

    it("does not fork a second profile for a number that is already somebody's", async () => {
      const token = await login("taker");
      const created = (await call(token, "clients.create", { params: { name: "Новый", phone: "+7 999 555 00 33" } })).body.result.item;
      expect(created.id).to.equal("u3");
      expect(fakes.clients.rows).to.have.length(3);
      const fresh = (await call(token, "clients.create", { params: { name: "Сергей", phone: "+7 912 000 11 22" } })).body.result.item;
      expect(fresh.title).to.equal("Сергей");
      expect(fakes.clients.rows).to.have.length(4);
      // The audit keeps the record, never the number.
      const event = fakes.audits.filter((candidate) => candidate.method === "clients.create").pop();
      expect(event).to.include({ record: fresh.id });
      expect(event!.params).to.deep.equal({});
    });

    it("refuses a number that is not one", async () => {
      const token = await login("taker");
      const answer = await call(token, "clients.create", { params: { name: "Гость", phone: "не телефон" } });
      expect(answer.status).to.equal(400);
      expect(answer.body.error.code).to.equal("invalid");
    });
  });

  describe("POS", () => {
    // The answers of a native app are its own shape; this file is that shape, and the client keeps
    // a copy of it in its test resources.
    const posSchema = (definition: string) => {
      const ajv = new Ajv({ strict: false, allErrors: true });
      ajv.addSchema(posContract);
      return ajv.getSchema(`${posContract.$id}#/definitions/${definition}`)!;
    };
    const validAnswer = posSchema("posOrderAnswer");
    const validStep = posSchema("posStep");
    const validCatalog = posSchema("posCatalog");

    it("answers by its own contract, both the list of drafts and one draft", async () => {
      const token = await login("taker");
      const started = (await call(token, "pos.start", { params: {}, place: "p1" })).body.result;
      expect(validAnswer(started), JSON.stringify(validAnswer.errors)).to.equal(true);
      const drafts = (await call(token, "pos.order", { params: {}, place: "p1" })).body.result;
      expect(validAnswer(drafts), JSON.stringify(validAnswer.errors)).to.equal(true);
      const one = (await call(token, "pos.order", { params: { id: started.order.id }, place: "p1" })).body.result;
      expect(validAnswer(one), JSON.stringify(validAnswer.errors)).to.equal(true);
    });

    it("declares itself as drawn by the client, on the points of order-entry", async () => {
      const token = await login("taker");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
      expect(declaration.apps.map((app: any) => app.id)).to.have.members(["clients", "pos"]);
      const pos = declaration.apps.find((app: any) => app.id === "pos");
      expect(pos).to.include({ title: "Касса", scope: "place", home: "pos.order" });
      expect(pos.client).to.deep.equal({ native: "pos", min: 1 });
      expect(pos.places).to.deep.equal(["p1"]);
      // A native app declares no screens: its methods carry schemas and nothing else.
      expect(pos.methods.every((method: any) => method.ui === undefined)).to.equal(true);
    });

    it("walks the whole order on fake deps: catalog, basket, guest, check, place", async () => {
      const token = await login("taker");
      const place = "p1";
      const draft = (await call(token, "pos.start", { params: {}, place })).body.result.order;

      const catalog = (await call(token, "pos.catalog", { params: { id: draft.id }, place })).body.result;
      expect(validCatalog(catalog), JSON.stringify(validCatalog.errors)).to.equal(true);
      expect(catalog.groups.map((group: any) => group.id)).to.deep.equal(["g1"]);

      const added = (await call(token, "pos.add", { params: { id: draft.id, dishId: "d1", amount: 2 }, place })).body.result;
      expect(validStep(added), JSON.stringify(validStep.errors)).to.equal(true);
      expect(added.order.lines[0]).to.include({ name: "Борщ", amount: 2, total: 600 });
      expect(added.order.canCheck, "no guest yet").to.equal(false);

      // Checking an order with no guest is a refusal in words, not an error of the protocol.
      const noGuest = await call(token, "pos.check", { params: { id: draft.id }, place });
      expect(noGuest.status).to.equal(200);
      expect(noGuest.body.result.ok).to.equal(false);
      expect(noGuest.body.result.message.text).to.equal("Укажите телефон гостя");

      await call(token, "pos.setService", { params: { id: draft.id, serviceType: "dine-in", table: "7" }, place });
      const guest = (await call(token, "pos.setCustomer", { params: { id: draft.id, name: "Гость", phone: "+7 999 000-00-01" }, place })).body.result;
      expect(guest.order).to.include({ table: "7", customerName: "Гость", canCheck: true });

      const promo = (await call(token, "pos.promocode", { params: { id: draft.id, code: "НЕТ" }, place })).body.result;
      expect(promo.ok).to.equal(false);
      expect(promo.message.text).to.equal("Промокод не действует");

      const paid = (await call(token, "pos.setPayment", { params: { id: draft.id, paymentMethodId: "cash" }, place })).body.result;
      expect(paid.order.paymentMethodTitle).to.equal("Наличные");
      const online = (await call(token, "pos.setPayment", { params: { id: draft.id, paymentMethodId: "online" }, place })).body.result;
      expect(online.ok, "online payment is not taken on a terminal yet").to.equal(false);

      const checked = (await call(token, "pos.check", { params: { id: draft.id }, place })).body.result;
      expect(checked.ok).to.equal(true);
      expect(checked.order).to.include({ state: "CHECKOUT", canPlace: true });

      const placed = (await call(token, "pos.place", { params: { id: draft.id }, place })).body.result;
      expect(placed.ok).to.equal(true);
      expect(placed.message.text).to.contain(draft.number);
      expect((await call(token, "pos.order", { params: {}, place })).body.result.drafts).to.deep.equal([]);
    });

    it("refuses a step of somebody without order-entry, whatever the step", async () => {
      const operator = await login("operator");
      const steps: Array<[string, Record<string, unknown>]> = [
        ["pos.catalog", { id: "draft1" }],
        ["pos.add", { id: "draft1", dishId: "d1" }],
        ["pos.setLine", { id: "draft1", lineId: 1, amount: 1 }],
        ["pos.setService", { id: "draft1", serviceType: "pickup" }],
        ["pos.setCustomer", { id: "draft1", name: "Гость", phone: "+7 999 000-00-01" }],
        ["pos.check", { id: "draft1" }],
        ["pos.place", { id: "draft1" }],
      ];
      for (const [method, params] of steps) {
        const answer = await call(operator, method, { params, place: "p1" });
        expect(answer.body.error?.code, method).to.equal("forbidden");
      }
    });

    it("refuses what the schemas refuse: an unknown service type, a number that is not one", async () => {
      const token = await login("taker");
      const draft = (await call(token, "pos.start", { params: {}, place: "p1" })).body.result.order;

      const service = await call(token, "pos.setService", { params: { id: draft.id, serviceType: "teleport" }, place: "p1" });
      expect(service.status).to.equal(400);
      expect(service.body.error.code).to.equal("invalid");

      const phone = await call(token, "pos.setCustomer", { params: { id: draft.id, name: "Гость", phone: "не телефон" }, place: "p1" });
      expect(phone.status).to.equal(400);

      const amount = await call(token, "pos.setLine", { params: { id: draft.id, lineId: 1, amount: -5 }, place: "p1" });
      expect(amount.status).to.equal(400);

      // The point of the call is checked before anything else, as for every app by points.
      const other = await call(token, "pos.add", { params: { id: draft.id, dishId: "d1" }, place: "p2" });
      expect(other.body.error.code).to.equal("place_forbidden");
    });

    it("tells the terminal what the point can do and when the order can be had", async () => {
      const token = await login("taker");
      const draft = (await call(token, "pos.start", { params: {}, place: "p1" })).body.result.order;
      const options = (await call(token, "pos.serviceOptions", { params: {}, place: "p1" })).body.result.options;
      expect(options.map((option: any) => option.id)).to.deep.equal(["delivery", "pickup", "dine-in"]);

      const when = (await call(token, "pos.timeOptions", { params: { id: draft.id }, place: "p1" })).body.result;
      expect(when.asap).to.equal(true);
      expect(when.slots[0]).to.have.length(2);

      const payments = (await call(token, "pos.payments", { params: { id: draft.id }, place: "p1" })).body.result.items;
      expect(payments.find((item: any) => item.id === "online").available).to.equal(false);

      const cities = (await call(token, "pos.cities", { params: {}, place: "p1" })).body.result.items;
      expect(cities.map((city: any) => city.name)).to.deep.equal(["Город"]);
    });

    it("keeps the drafts of one person at one point", async () => {
      const mine = await login("taker");
      const theirs = await login("taker2");
      const started = (await call(mine, "pos.start", { params: {}, place: "p1" })).body.result.order;
      expect(started).to.include({ state: "CART", placeId: "p1", serviceType: "dine-in", total: 0 });

      const drafts = (await call(mine, "pos.order", { params: {}, place: "p1" })).body.result;
      expect(drafts.order).to.equal(null);
      expect(drafts.drafts.map((order: any) => order.id)).to.deep.equal([started.id]);

      // Another point, another person: neither the list nor the direct id.
      expect((await call(theirs, "pos.order", { params: {}, place: "p2" })).body.result.drafts).to.deep.equal([]);
      expect((await call(theirs, "pos.order", { params: { id: started.id }, place: "p2" })).body.error.code).to.equal("not_found");
      expect((await call(theirs, "pos.order", { params: { id: started.id }, place: "p1" })).body.error.code).to.equal("place_forbidden");

      expect((await call(mine, "pos.order", { params: { id: started.id }, place: "p1" })).body.result.order.id).to.equal(started.id);
      expect((await call(mine, "pos.cancel", { params: { id: started.id }, place: "p1" })).body.result).to.deep.equal({ ok: true });
      expect((await call(mine, "pos.order", { params: {}, place: "p1" })).body.result.drafts).to.deep.equal([]);
      expect((await call(mine, "pos.cancel", { params: { id: started.id }, place: "p1" })).body.error.code).to.equal("not_found");
    });

    it("starts a draft for a chosen customer, and demands a point", async () => {
      const token = await login("taker");
      const order = (await call(token, "pos.start", { params: { clientId: "u1" }, place: "p1" })).body.result.order;
      expect(order.clientId).to.equal("u1");
      const noPlace = await call(token, "pos.start", { params: {} });
      expect(noPlace.status).to.equal(400);
      expect(noPlace.body.error.code).to.equal("invalid");
    });

    it("is not there for somebody without order-entry", async () => {
      const token = await login("operator");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;
      expect(declaration.apps.map((app: any) => app.id)).to.not.include("pos");
      expect((await call(token, "pos.order", { params: {}, place: "p1" })).body.error.code).to.equal("forbidden");
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
