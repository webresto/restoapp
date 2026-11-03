import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { NO_KITCHEN } from "../api/hooks/app-mobile-api/apps/orders";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Заказы» of slice 2: the orders of one point on the phone.
 *
 * The rows are in memory (`FakeOrders`), but every decision around them is the real one — the
 * declaration and the call go through the adminizer AccessRightsHelper with core's contextual
 * `order-kanban` check, and the transitions a role may choose come from core's `OrderStateFlow`.
 *
 * Four orders: AAAA1111 and the finished CCCC3333 at «Ленина, 5» (p1), BBBB2222 at «Мира, 3» (p2),
 * DDDD4444 waiting at «Без кухни». `operator` holds p1 and p3, `dispatcher` holds p1, p2 and «Без
 * кухни», `watcher` may read p1 but not write, `stock` has no orders at all.
 */
describe("app-mobile-api «Заказы»", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };

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
    return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null };
  }

  async function login(name: string): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const response = await request("POST", "/api/mobile/auth/login", {
      body: {
        login: name,
        password: PASSWORD,
        captchaSolution: await solve(challenge.body.result.task),
        device: { name: "Pixel", platform: "android" },
      },
    });
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    return response.body.result.token;
  }

  const call = (token: string | undefined, method: string, body: unknown) =>
    request("POST", `/api/mobile/call/${method}`, { token, body });

  const list = async (token: string, place: string, params: Record<string, unknown> = {}) =>
    (await call(token, "orders.list", { params, place })).body;

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("declaration", () => {
    it("describes «Заказы» by the contract, in Russian, with «Без кухни» among the points", async () => {
      const token = await login("dispatcher");
      const response = await request("GET", "/api/mobile/describe?lang=ru", { token });
      const declaration = response.body.result;

      expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      const orders = declaration.apps.find((app: any) => app.id === "orders");
      expect(orders).to.include({ title: "Заказы", scope: "place", home: "orders.list" });
      expect(orders.places).to.deep.equal(["p1", "p2", NO_KITCHEN]);
      expect(orders.methods.map((method: any) => method.name))
        .to.deep.equal(["orders.list", "orders.get", "orders.setState", "orders.assignKitchen"]);
      expect(declaration.places.find((place: any) => place.id === NO_KITCHEN))
        .to.deep.equal({ id: NO_KITCHEN, title: "Без кухни", address: null });
    });

    it("tells the client how to draw the list, the chips and the buttons", async () => {
      const token = await login("operator");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
      const orders = declaration.apps[0];
      const [listMethod, , setState, assignKitchen] = orders.methods;

      expect(listMethod.ui).to.deep.include({ view: "list", search: "q", chips: "tab", open: "orders.get" });
      expect(listMethod.ui.item).to.deep.equal({ title: "title", subtitle: "summary", meta: "createdAt", value: "total", badge: "state" });
      expect(listMethod.input.properties.tab["x-titles"]).to.deep.equal({ active: "Активные", done: "Завершённые" });
      expect(setState.ui.control).to.deep.equal({ type: "buttons", param: "to", tones: { DONE: "success", REJECT: "danger" } });
      expect(setState.ui.confirm).to.equal("Отклонить заказ? Клиент получит уведомление.");
      expect(setState.input.properties.to["x-titles"].REJECT).to.equal("Отклонить");
      expect(orders.models.order.fields[0].specials).to.deep.include({ value: "COOKING", title: "Готовится", tone: "warning" });
      // No «Без кухни» among this operator's points, so no kitchen to offer either.
      expect(assignKitchen.input.properties.place.enum).to.deep.equal(["p1"]);
    });

    it("offers the kitchens of the person to «Назначить кухню»", async () => {
      const token = await login("dispatcher");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
      const assignKitchen = declaration.apps[0].methods[3];

      expect(assignKitchen.input.properties.place.enum).to.deep.equal(["p1", "p2"]);
      expect(assignKitchen.input.properties.place["x-titles"]).to.deep.equal({ p1: "Ленина, 5", p2: "Мира, 3" });
    });

    it("gives a stock manager no «Заказы», and someone outside the panel no way in at all", async () => {
      const stock = await login("stock");
      expect((await request("GET", "/api/mobile/describe", { token: stock })).body.result.apps.map((app: any) => app.id))
        .to.deep.equal(["dishes"]);
      expect((await call(stock, "orders.list", { params: {}, place: "p1" })).body.error.code).to.equal("forbidden");

      const refused = await request("POST", "/api/mobile/auth/login", {
        body: { login: "outsider", password: PASSWORD, captchaSolution: await solve((await request("GET", "/api/mobile/auth/challenge")).body.result.task), device: { name: "Pixel", platform: "android" } },
      });
      expect(refused.status).to.equal(403);
    });

    it("hides the moves from someone who may read orders but not write them", async () => {
      const token = await login("watcher");
      const declaration = (await request("GET", "/api/mobile/describe", { token })).body.result;

      expect(declaration.apps[0].methods.map((method: any) => method.name)).to.deep.equal(["orders.list", "orders.get"]);
      expect((await call(token, "orders.setState", { params: { id: "o1", to: "COOKING" }, place: "p1" })).body.error.code)
        .to.equal("forbidden");
      // A record of a read-only user carries no actions at all.
      expect((await list(token, "p1")).result.items[0]._actions).to.deep.equal([]);
    });
  });

  describe("the orders of a point", () => {
    it("lists the active orders of the point with the counts of both tabs", async () => {
      const token = await login("operator");
      const { result } = await list(token, "p1");

      expect(result.items.map((item: any) => item.number)).to.deep.equal(["AAAA1111"]);
      expect(result.counts).to.deep.equal({ active: 1, done: 1 });
      expect(result.total).to.equal(1);
      expect(result.nextCursor).to.equal(null);
      expect(result.items[0]).to.include({ title: "№ AAAA1111", summary: "Иван · delivery", state: "ORDER", total: 1200 });
    });

    it("lists the finished orders of the other tab", async () => {
      const token = await login("operator");
      const { result } = await list(token, "p1", { tab: "done" });

      expect(result.items.map((item: any) => item.number)).to.deep.equal(["CCCC3333"]);
    });

    it("shows nothing of another point, and refuses a point the operator does not hold", async () => {
      const token = await login("operator");

      expect((await list(token, "p1")).result.items.map((item: any) => item.number)).to.not.include("BBBB2222");
      expect((await call(token, "orders.list", { params: {}, place: "p2" })).body.error.code).to.equal("place_forbidden");
      expect((await call(token, "orders.get", { params: { id: "o2" }, place: "p1" })).body.error.code).to.equal("not_found");
      expect((await call(token, "orders.setState", { params: { id: "o2", to: "COOKING" }, place: "p1" })).body.error.code)
        .to.equal("not_found");
    });

    it("asks for a point, and only one", async () => {
      const token = await login("operator");

      expect((await call(token, "orders.list", { params: {} })).body.error.code).to.equal("invalid");
      expect((await call(token, "orders.list", { params: {}, place: "nowhere" })).body.error.code).to.equal("place_forbidden");
    });

    it("opens the card of an order with its lines and its sections", async () => {
      const token = await login("operator");
      const { result } = (await call(token, "orders.get", { params: { id: "o1" }, place: "p1" })).body;

      expect(result.item).to.include({
        number: "AAAA1111",
        customerName: "Иван",
        customerPhone: "+70000000001",
        method: "delivery",
        address: "ул. Ленина, 5",
        comment: "Домофон 12",
        deliveryCost: 200,
        total: 1200,
        paid: false,
      });
      expect(result.item.contents).to.equal("1 × Борщ\n2 × Плов");
    });

    it("finds an order by number, phone and customer, and nothing by a stranger's name", async () => {
      const token = await login("operator");

      expect((await list(token, "p1", { q: "aaaa" })).result.items).to.have.length(1);
      expect((await list(token, "p1", { q: "Иван" })).result.items).to.have.length(1);
      expect((await list(token, "p1", { q: "+70000000001" })).result.items).to.have.length(1);
      expect((await list(token, "p1", { q: "Пётр" })).result.items).to.have.length(0);
      // The counts are of the point, not of the search: the chips must not jump while typing.
      expect((await list(token, "p1", { q: "Пётр" })).result.counts).to.deep.equal({ active: 1, done: 1 });
    });

    it("answers only what changed since the moment the client knows", async () => {
      const token = await login("operator");
      const before = (await list(token, "p1")).result.items[0].updatedAt;

      expect((await list(token, "p1", { since: before + 1 })).result.items).to.have.length(0);

      await call(token, "orders.setState", { params: { id: "o1", to: "COOKING" }, place: "p1" });
      const changed = (await list(token, "p1", { since: before + 1 })).result.items;

      expect(changed.map((item: any) => item.number)).to.deep.equal(["AAAA1111"]);
      expect(changed[0].state).to.equal("COOKING");
    });

    it("refuses a cursor it did not write", async () => {
      const token = await login("operator");
      expect((await call(token, "orders.list", { params: { cursor: "nope" }, place: "p1" })).body.error.code).to.equal("invalid");
    });
  });

  describe("moving an order", () => {
    it("walks ORDER → COOKING → ON_THE_WAY → DONE from the phone", async () => {
      const token = await login("operator");

      for (const to of ["COOKING", "ON_THE_WAY", "DONE"]) {
        const response = await call(token, "orders.setState", { params: { id: "o1", to }, place: "p1" });
        expect(response.status, JSON.stringify(response.body)).to.equal(200);
        expect(response.body.result.item.state).to.equal(to);
      }

      expect(fakes.orders.moves.map((move) => move.to)).to.deep.equal(["COOKING", "ON_THE_WAY", "DONE"]);
      expect((await list(token, "p1")).result.counts).to.deep.equal({ active: 0, done: 2 });
    });

    it("rejects an order, and will not move it afterwards", async () => {
      const token = await login("operator");

      expect((await call(token, "orders.setState", { params: { id: "o1", to: "REJECT" }, place: "p1" })).body.result.item.state)
        .to.equal("REJECT");
      const again = await call(token, "orders.setState", { params: { id: "o1", to: "COOKING" }, place: "p1" });
      expect(again.status).to.equal(409);
      expect(again.body.error.code).to.equal("conflict");
    });

    it("offers on every record exactly the moves its state allows", async () => {
      const token = await login("operator");
      const active = (await list(token, "p1")).result.items[0];

      expect(active._actions).to.have.length(1);
      expect(active._actions[0].method).to.equal("orders.setState");
      expect(active._actions[0].input.properties.to.enum).to.deep.equal(["COOKING", "ON_THE_WAY", "DONE", "REJECT"]);
      // The server's own locale is Russian, so an answer without `lang` speaks it.
      expect(active._actions[0].input.properties.to["x-titles"].COOKING).to.equal("Готовить");

      await call(token, "orders.setState", { params: { id: "o1", to: "ON_THE_WAY" }, place: "p1" });
      const onTheWay = (await call(token, "orders.get", { params: { id: "o1" }, place: "p1" })).body.result.item;
      expect(onTheWay._actions[0].input.properties.to.enum).to.deep.equal(["DONE", "REJECT"]);

      // A finished order has nowhere to go, so it carries no actions and is read-only.
      const done = (await list(token, "p1", { tab: "done" })).result.items[0];
      expect(done._actions).to.deep.equal([]);
    });

    it("translates the titles of the buttons it sends with a record", async () => {
      const token = await login("operator");
      const titles = async (lang: string) =>
        (await request("POST", `/api/mobile/call/orders.list?lang=${lang}`, { token, body: { params: {}, place: "p1" } }))
          .body.result.items[0]._actions[0].input.properties.to["x-titles"];

      expect(await titles("ru")).to.deep.equal({ COOKING: "Готовить", ON_THE_WAY: "Отправить", DONE: "Выполнен", REJECT: "Отклонить" });
      expect(await titles("en")).to.deep.equal({ COOKING: "Start cooking", ON_THE_WAY: "Send out", DONE: "Done", REJECT: "Reject" });
    });

    it("refuses a state outside the flow and a state that is not a state", async () => {
      const token = await login("operator");

      expect((await call(token, "orders.setState", { params: { id: "o1", to: "CART" }, place: "p1" })).body.error.code)
        .to.equal("invalid");
      expect((await call(token, "orders.setState", { params: { id: "o1", to: "nope" }, place: "p1" })).body.error.code)
        .to.equal("invalid");
    });

    it("writes the move to the audit with the point, the record and the device", async () => {
      const token = await login("operator");
      await call(token, "orders.setState", { params: { id: "o1", to: "COOKING" }, place: "p1" });

      const [event] = fakes.audits;
      expect(event).to.include({ method: "orders.setState", place: "p1", record: "o1", ok: true });
      expect(event.params).to.deep.equal({ to: "COOKING" });
      expect(fakes.orders.moves[0].device).to.equal(event.device);
    });
  });

  describe("«Без кухни»", () => {
    it("keeps the orders with no kitchen in their own point", async () => {
      const token = await login("dispatcher");

      expect((await list(token, NO_KITCHEN)).result.items.map((item: any) => item.number)).to.deep.equal(["DDDD4444"]);
      expect((await list(token, "p1")).result.items.map((item: any) => item.number)).to.deep.equal(["AAAA1111"]);
    });

    it("hands such an order a kitchen, and it leaves «Без кухни» for it", async () => {
      const token = await login("dispatcher");
      const response = await call(token, "orders.assignKitchen", { params: { id: "o4", place: "p2" }, place: NO_KITCHEN });

      expect(response.status, JSON.stringify(response.body)).to.equal(200);
      expect(response.body.result.item.placeId).to.equal("p2");
      expect((await list(token, NO_KITCHEN)).result.items).to.deep.equal([]);
      expect((await list(token, "p2")).result.items.map((item: any) => item.number)).to.contain("DDDD4444");
    });

    it("offers «Назначить кухню» only on an order that has none, and only there", async () => {
      const token = await login("dispatcher");
      const waiting = (await list(token, NO_KITCHEN)).result.items[0];
      expect(waiting._actions.map((action: any) => action.method))
        .to.deep.equal(["orders.setState", "orders.assignKitchen"]);
      expect(waiting._actions[1].input.properties.place.enum).to.deep.equal(["p1", "p2"]);

      const assigned = (await list(token, "p1")).result.items[0];
      expect(assigned._actions.map((action: any) => action.method)).to.deep.equal(["orders.setState"]);
    });

    it("refuses a kitchen the person does not hold, and «Без кухни» to someone without it", async () => {
      // The kitchen is a value of the narrowed schema, so a point of someone else is not even a
      // valid parameter — the client could not have offered it.
      const dispatcher = await login("dispatcher");
      expect((await call(dispatcher, "orders.assignKitchen", { params: { id: "o4", place: "p3" }, place: NO_KITCHEN })).body.error.code)
        .to.equal("invalid");

      const operator = await login("operator");
      expect((await call(operator, "orders.assignKitchen", { params: { id: "o4", place: "p1" }, place: NO_KITCHEN })).body.error.code)
        .to.equal("place_forbidden");
    });
  });
});
