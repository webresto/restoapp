import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { MobileApiRegistry, RegistrationError } from "../api/hooks/app-mobile-api/lib/registry";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * The optional UI hints of protocol 1 (`04-protocol.md`, P1–P7): columns, x-tones, primary, the badge of an app,
 * sections, the board and the summary — in the contract, in the declaration of the shipped apps, and in what the
 * methods answer.
 */
describe("app-mobile-api: the optional UI hints (P1–P7)", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };

  const ajv = new Ajv({ strict: false, allErrors: true });
  ajv.addSchema(contract);
  const validDeclaration = ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
  const validUi = ajv.getSchema(`${contract.$id}#/definitions/ui`)!;
  const validField = ajv.getSchema(`${contract.$id}#/definitions/field`)!;
  const validItem = ajv.getSchema(`${contract.$id}#/definitions/itemResult`)!;

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
    for (let attempt = 0; ; attempt += 1) {
      const challenge = await request("GET", "/api/mobile/auth/challenge");
      let solution: string;
      try {
        solution = await solve(challenge.body.result.task);
      } catch (error) {
        // crypto-puzzle refuses about one task in 256 (see the orders test): ask for another one.
        if (attempt >= 10) throw error;
        continue;
      }
      const response = await request("POST", "/api/mobile/auth/login", {
        body: { login: name, password: PASSWORD, captchaSolution: solution, device: { name: "Pixel", platform: "android" } },
      });
      expect(response.status, JSON.stringify(response.body)).to.equal(200);
      return response.body.result.token;
    }
  }

  const call = (token: string, method: string, params: unknown = {}, place?: string) =>
    request("POST", `/api/mobile/call/${method}`, { token, body: place ? { params, place } : { params } });
  const declarationOf = async (token: string, lang = "ru") => (await request("GET", `/api/mobile/describe?lang=${lang}`, { token })).body.result;
  const appIn = (declaration: any, id: string) => declaration.apps.find((app: any) => app.id === id);
  const methodIn = (app: any, name: string) => app.methods.find((method: any) => method.name === name);

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("the contract", () => {
    it("takes every new key and refuses a value outside its closed set", () => {
      const ok = (ui: unknown) => validUi(ui);
      expect(ok({ view: "list", columns: [{ field: "a", align: "end", width: "narrow" }], board: { field: "s", order: ["A", "B"] }, section: "S" })).to.equal(true);
      expect(ok({ view: "list", columns: [{ field: "a", align: "right" }] })).to.equal(false);
      expect(ok({ view: "list", columns: [{ field: "a", width: "huge" }] })).to.equal(false);
      expect(ok({ view: "list", board: { field: "s" } })).to.equal(false);
      expect(ok({ view: "action", primary: true })).to.equal(true);
      expect(ok({ view: "action", primary: "yes" })).to.equal(false);
      expect(ok({
        view: "detail",
        summary: [
          { type: "metric", field: "n", format: "money", delta: "nDelta" },
          { type: "series", field: "s", title: "T" },
          { type: "list", field: "l" },
          { type: "share", field: "p" },
        ],
      })).to.equal(true);
      expect(ok({ view: "detail", summary: [{ type: "pie", field: "p" }] })).to.equal(false);
      expect(ok({ view: "detail", summary: [{ type: "list", field: "l", delta: "x" }] })).to.equal(false);
    });

    it("has `muted` only in x-tones: specials and control tones keep the four an older client knows", () => {
      expect(validField({ name: "s", title: "S", format: "enum", "x-tones": { DONE: "muted", NEW: "info" } })).to.equal(true);
      expect(validField({ name: "s", title: "S", format: "enum", "x-tones": { DONE: "grey" } })).to.equal(false);
      expect(validField({ name: "s", title: "S", format: "enum", specials: [{ value: "x", title: "X", tone: "muted" }] })).to.equal(false);
      expect(validUi({ view: "action", control: { type: "buttons", tones: { DONE: "muted" } } })).to.equal(false);
    });

    it("the registry refuses a hint outside the contract and logs one that names nothing", () => {
      const registry = new MobileApiRegistry();
      const app = { id: "demo", version: "1.0.0", title: "Demo", home: "demo.list", badge: "demo.count", models: { row: { fields: [{ name: "state", title: "S", format: "enum" }, { name: "n", title: "N", format: "number" }] } } };
      registry.registerApp(app);
      const list = { name: "demo.list", app: "demo", kind: "query" as const, title: "List", access: { public: true as const }, model: "row", input: { type: "object" }, handler: () => ({ items: [], nextCursor: null }) };
      expect(() => registry.registerMethod({ ...list, ui: { view: "list", board: { field: "state", order: [] } } })).to.throw(RegistrationError);
      registry.registerMethod({ ...list, ui: { view: "list", columns: [{ field: "nope" }], board: { field: "n", order: ["1"] } } });
      expect(registry.problems()).to.deep.equal([
        'app "demo": badge method "demo.count" is not registered',
        'method "demo.list": ui.columns names "nope", not a field of "row"',
        'method "demo.list": ui.board.field "n" is not an enum field of "row"',
      ]);
    });

    it("the shipped apps have no problems", () => {
      expect(fakes.deps.registry.problems()).to.deep.equal([]);
    });
  });

  describe("the declaration", () => {
    it("of the administrator carries every hint and still matches the contract, in both languages", async () => {
      const token = await login("admin");
      for (const lang of ["ru", "en"]) {
        const declaration = await declarationOf(token, lang);
        expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      }
      const declaration = await declarationOf(token, "ru");

      // P1: the columns of the lists, and every one of them a declared field, the title column never among them.
      for (const [appId, methodName] of [
        ["orders", "orders.list"], ["dishes", "dishes.list"], ["clients", "clients.list"], ["marketing", "marketing.promocodes"],
        ["marketing", "marketing.promotions"], ["marketing", "marketing.applications"], ["settings", "settings.list"], ["system", "system.modules"],
      ]) {
        const app = appIn(declaration, appId);
        const method = methodIn(app, methodName);
        const fields = app.models[method.model].fields.map((field: any) => field.name);
        expect(method.ui.columns, methodName).to.be.an("array").that.is.not.empty;
        for (const column of method.ui.columns) {
          expect(fields, `${methodName}: ${column.field}`).to.include(column.field);
          expect(column.field, methodName).to.not.equal(method.ui.item.title);
        }
      }

      // P2: the tones of the statuses, `muted` for what is done or off.
      const toneOf = (appId: string, model: string, field: string) =>
        appIn(declaration, appId).models[model].fields.find((candidate: any) => candidate.name === field)["x-tones"];
      expect(toneOf("orders", "order", "state")).to.deep.equal({ ORDER: "info", COOKING: "warning", ON_THE_WAY: "info", DONE: "muted", REJECT: "danger" });
      expect(toneOf("marketing", "promocode", "status")).to.include({ active: "success", disabled: "muted" });
      expect(toneOf("marketing", "promotion", "appliesNow")).to.include({ self: "success", disabled: "muted" });
      expect(toneOf("system", "module", "state")).to.include({ ok: "success", disabled: "muted", migrations: "danger" });
      expect(toneOf("channels", "channel", "status")).to.include({ ready: "success", disabled: "muted", error: "danger" });

      // P3: the main button of an order, and of a program.
      const orders = appIn(declaration, "orders");
      expect(methodIn(orders, "orders.setState").ui.primary).to.equal(true);
      expect(methodIn(orders, "orders.assignKitchen").ui.primary).to.equal(undefined);
      expect(methodIn(appIn(declaration, "system"), "system.update").ui.primary).to.equal(true);
      expect(methodIn(appIn(declaration, "system"), "system.remove").ui.primary).to.equal(undefined);

      // P4: the badge of «Заказы».
      expect(orders.badge).to.equal("orders.badge");
      expect(methodIn(orders, "orders.badge")).to.include({ kind: "query" });

      // P5: the sections, in the order of the methods, the first one the home screen; translated.
      const sections = (app: any) => app.methods.filter((method: any) => method.ui?.section).map((method: any) => [method.name, method.ui.section]);
      expect(sections(appIn(declaration, "marketing"))).to.deep.equal([
        ["marketing.home", "Сводка"],
        ["marketing.promotions", "Акции"],
        ["marketing.promocodes", "Промокоды"],
        ["marketing.applications", "Применения"],
      ]);
      expect(sections(appIn(declaration, "system"))).to.deep.equal([
        ["system.home", "Сервер"],
        ["system.modules", "Модули"],
        ["system.catalog", "Маркетплейс"],
      ]);
      expect(sections(appIn(await declarationOf(token, "en"), "system")).map(([, title]: string[]) => title))
        .to.deep.equal(["Server", "Modules", "Marketplace"]);

      // P6: the board of the orders, on the enum field with titles and tones for every column.
      const board = methodIn(orders, "orders.list").ui.board;
      expect(board).to.deep.equal({ field: "state", order: ["ORDER", "COOKING", "ON_THE_WAY", "DONE"] });
      const state = orders.models.order.fields.find((field: any) => field.name === "state");
      expect(state.format).to.equal("enum");
      for (const value of board.order) {
        expect(state["x-titles"][value], value).to.be.a("string").and.not.match(/^mobile\./);
        expect(state["x-tones"][value], value).to.be.a("string");
      }
      expect(state["x-titles"].COOKING).to.equal("Готовится");

      // P7: the blocks of the summary; the arrays and the deltas are in no model.
      const home = methodIn(appIn(declaration, "marketing"), "marketing.home");
      expect(home.ui.summary.map((block: any) => block.type)).to.include.members(["metric", "series", "share", "list"]);
      expect(home.ui.summary.find((block: any) => block.type === "series").title).to.equal("Применения по дням");
      const declared = appIn(declaration, "marketing").models.summary.fields.map((field: any) => field.name);
      for (const block of home.ui.summary) {
        if (block.type === "metric") {
          expect(declared, block.field).to.include(block.field);
          if (block.delta) expect(declared, block.delta).to.not.include(block.delta);
        } else {
          expect(declared, block.field).to.not.include(block.field);
        }
      }
    });

    it("names the badge only to whoever may call it", async () => {
      const operator = appIn(await declarationOf(await login("operator")), "orders");
      expect(operator.badge).to.equal("orders.badge");
      const declaration = await declarationOf(await login("stock"));
      expect(appIn(declaration, "orders")).to.equal(undefined);
    });

    it("a person with one part of «Система» gets no sections there: one is no sections", async () => {
      const system = appIn(await declarationOf(await login("settler")), "system");
      expect(system.methods.filter((method: any) => method.ui?.section).map((method: any) => method.name)).to.deep.equal(["system.home"]);
    });
  });

  describe("the badge of «Заказы»", () => {
    it("is a number: the orders under way at the point, as the «Активные» chip counts them", async () => {
      const token = await login("dispatcher");
      const badge = await call(token, "orders.badge", {}, "p1");
      expect(badge.status, JSON.stringify(badge.body)).to.equal(200);
      expect(badge.body.result).to.be.a("number").and.equal(1);
      const listed = await call(token, "orders.list", {}, "p1");
      expect(badge.body.result).to.equal(listed.body.result.counts.active);
      expect((await call(token, "orders.badge", {}, "p2")).body.result).to.equal(1);
    });

    it("is checked like the list: by the point and by the right", async () => {
      expect((await call(await login("operator"), "orders.badge", {}, "p2")).body.error.code).to.equal("place_forbidden");
      expect((await call(await login("dispatcher"), "orders.badge")).body.error.code).to.equal("invalid");
      expect((await call(await login("stock"), "orders.badge", {}, "p1")).body.error.code).to.equal("forbidden");
    });

    it("drops to zero when the orders are done", async () => {
      const token = await login("dispatcher");
      for (const row of fakes.orders.rows) row.state = "DONE";
      expect((await call(token, "orders.badge", {}, "p1")).body.result).to.equal(0);
    });
  });

  describe("the summary of «Маркетинг»", () => {
    it("carries the arrays of its blocks and the deltas, none of them declared", async () => {
      const answer = await call(await login("marketer"), "marketing.home", { days: "90" });
      expect(validItem(answer.body.result), JSON.stringify(validItem.errors)).to.equal(true);
      const item = answer.body.result.item;
      // Three applications, 111.3 of discount, against two and 100 the range before.
      expect(item).to.include({ applications: 3, applicationsDelta: 50, totalDiscountDelta: 11.3 });
      expect(item.avgDiscountDelta).to.equal(-25.8);
      expect(item.applicationsByDay).to.be.an("array").with.length(3);
      for (const point of item.applicationsByDay) {
        expect(point.x).to.match(/^\d{4}-\d{2}-\d{2}$/);
        expect(point.y).to.be.a("number");
      }
      expect(item.codesShare).to.deep.equal([{ title: "LETO10", value: 2 }, { title: "DEAD", value: 1 }]);
      expect(item.codesDiscount).to.deep.equal([
        { title: "LETO10", value: 111.3, format: "money" },
        { title: "DEAD", value: 0, format: "money" },
      ]);
      // What they were made of does not travel.
      expect(item).to.not.have.any.keys("byDay", "topCodes", "previous");
    });

    it("gives no delta where there is nothing honest to compare with", async () => {
      fakes.marketing.previousRange = null;
      const item = (await call(await login("marketer"), "marketing.home")).body.result.item;
      expect(item).to.not.have.any.keys("applicationsDelta", "totalDiscountDelta", "avgDiscountDelta");
      expect(item.applicationsByDay).to.be.an("array");

      fakes.marketing.previousRange = { applications: 0, totalDiscount: 0 };
      const empty = (await call(await login("marketer"), "marketing.home")).body.result.item;
      expect(empty).to.not.have.any.keys("applicationsDelta", "totalDiscountDelta", "avgDiscountDelta");
    });

    it("tells nobody the money they may not see: no arrays without the right", async () => {
      const item = (await call(await login("promoter"), "marketing.home")).body.result.item;
      expect(item).to.not.have.any.keys("applications", "applicationsDelta", "applicationsByDay", "codesShare", "codesDiscount");
      expect(item.promotionsSelf).to.equal(2);
    });
  });
});
