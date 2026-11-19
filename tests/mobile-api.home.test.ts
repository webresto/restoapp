import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { registerHome, startOfDay, type HomeLine, type HomeOrder, type HomePort } from "../api/hooks/app-mobile-api/apps/home";
import { Fakes, PASSWORD, listen, makeFakes, makeUser, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** The orders and balances of the points, in memory: what core would answer. */
class FakeHome implements HomePort {
  rows: Array<HomeOrder & { place: string; lines: HomeLine[] }> = [];
  balancesOf: Record<string, Array<number | null>> = { p1: [0, 3, 12, null], p2: [0, 0], p3: [] };

  async orders(place: string, from: number, to: number) {
    return this.rows.filter((row) => row.place === place && row.createdAt >= from && row.createdAt < to);
  }

  async lines(place: string, ids: string[]) {
    return this.rows.filter((row) => row.place === place && ids.includes(row.id)).flatMap((row) => row.lines.map((line) => ({ ...line })));
  }

  async balances(place: string) {
    return this.balancesOf[place] ?? [];
  }
}

/**
 * «Главная» (`apps/home.ts`): one query, and the record carries only the blocks the person may see — the money
 * with the orders report, the orders and the kitchen with the orders of the point, the stop list and what sells
 * with its stock. The points are those of either right.
 */
describe("app-mobile-api: «Главная»", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let home: FakeHome;
  let server: { url: string; close(): Promise<void> };

  const ajv = new Ajv({ strict: false, allErrors: true });
  ajv.addSchema(contract);
  const validDeclaration = ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
  const validItem = ajv.getSchema(`${contract.$id}#/definitions/itemResult`)!;

  // A Wednesday, 15:30 of the server's day.
  const now = new Date(2026, 10, 18, 15, 30).getTime();
  const today = startOfDay(now);

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

  const summary = (token: string, place: string) => request("POST", "/api/mobile/call/home.summary", { token, body: { params: {}, place } });
  const declarationOf = async (token: string) => (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
  const homeOf = (declaration: any) => declaration.apps.find((app: any) => app.id === "home");

  const order = (id: string, place: string, state: string, hoursAgo: number, total: number, lines: HomeLine[] = []) =>
    ({ id, number: id.toUpperCase(), place, state, createdAt: now - hoursAgo * HOUR, total, customerName: "Иван", method: "delivery", lines });
  const borscht = (amount: number): HomeLine => ({ id: "d1", title: "Борщ", group: "Супы", amount });
  const plov = (amount: number): HomeLine => ({ id: "d2", title: "Плов", group: null, amount });

  beforeEach(async () => {
    fakes = await makeFakes();
    fakes.clock.now = now;
    (fakes.deps.access as any).registerToken({ id: "orders-report", name: "Orders Report", description: "Reports", department: "Reports" });
    const grant = (tokenId: string, ...rights: string[]) => ({ tokenId, rights });
    // The orders report and the orders of p1: the money, the orders, and no stock.
    fakes.users.set("manager", makeUser(30, "manager", [{ name: "Manager", tokens: ["access-to-adminpanel", "orders-report", grant("order-kanban", "p1"), "read-order-model"] }]));
    home = new FakeHome();
    home.rows = [
      order("a1", "p1", "ORDER", 0.2, 1000, [borscht(2)]),
      order("a2", "p1", "COOKING", 1.5, 2000, [borscht(1), plov(3)]),
      order("a3", "p1", "DONE", 3, 600, [plov(1)]),
      order("a4", "p1", "REJECT", 2, 9999, [plov(9)]),
      // Yesterday: not of the day.
      order("y1", "p1", "DONE", 20, 5000),
      // A week ago, before 15:30 and after it: only the first is compared with.
      order("w1", "p1", "DONE", 7 * 24 + 2, 2400),
      order("w2", "p1", "DONE", 7 * 24 - 1, 7000),
      order("b1", "p2", "ON_THE_WAY", 1, 700, [borscht(1)]),
    ];
    registerHome(fakes.deps.registry, home, () => now);
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  it("is the client's own screen, of the points of the orders and of the stock, and matches the contract", async () => {
    const admin = await declarationOf(await login("admin"));
    expect(validDeclaration(admin), JSON.stringify(validDeclaration.errors)).to.equal(true);
    const app = homeOf(admin);
    expect(app.client).to.deep.equal({ native: "home", min: 1 });
    expect(app.places).to.have.members(["p1", "p2", "p3"]);
    expect(app.methods.map((method: any) => method.name)).to.deep.equal(["home.summary"]);

    expect(homeOf(await declarationOf(await login("operator"))).places).to.have.members(["p1", "p3"]);
    expect(homeOf(await declarationOf(await login("stock"))).places).to.have.members(["p1", "p2"]);
    expect(homeOf(await declarationOf(await login("reader")))).to.equal(undefined);
  });

  it("gives the administrator the whole day of the point", async () => {
    const response = await summary(await login("admin"), "p1");
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    expect(validItem(response.body.result), JSON.stringify(validItem.errors)).to.equal(true);
    const item = response.body.result.item;

    // The money: the orders of today that were not rejected — 1000 + 2000 + 600.
    expect(item.revenue).to.equal(3600);
    expect(item.averageCheck).to.equal(1200);
    // A week ago up to the same minute: one order of 2400 → +50 %, and the check halves.
    expect(item.revenueDelta).to.equal(50);
    expect(item.averageCheckDelta).to.equal(-50);
    expect(item.revenueByHour.map((point: any) => point.x)).to.deep.equal(["12:00", "13:00", "14:00", "15:00"]);
    expect(item.revenueByHour.reduce((sum: number, point: any) => sum + point.y, 0)).to.equal(3600);

    // The orders: four today (the rejected one too), two under way, by the stages of the kitchen.
    expect(item.orders).to.equal(4);
    expect(item.ordersActive).to.equal(2);
    expect(item.kitchen.map((stage: any) => [stage.state, stage.count])).to.deep.equal([["ORDER", 1], ["COOKING", 1], ["ON_THE_WAY", 0]]);
    expect(item.kitchen[1].title).to.equal("Готовится");
    expect(item.active.map((row: any) => row.id)).to.deep.equal(["a1", "a2"]);
    expect(item.active[0]).to.include({ title: "№ A1", state: "ORDER", minutes: 12, total: 1000 });
    expect(item.active[0]._open).to.deep.equal({ app: "orders", method: "orders.get", params: { id: "a1" }, place: "p1" });

    // The stock: one dish stopped, one running low; what sold, the rejected order not counted.
    expect(item.stop).to.equal(1);
    expect(item.low).to.equal(1);
    expect(item.popular).to.deep.equal([
      { id: "d2", title: "Плов", sold: 4 },
      { id: "d1", title: "Борщ", group: "Супы", sold: 3 },
    ]);
  });

  it("tells an operator the orders and the kitchen, and no money and no stock", async () => {
    const token = await login("operator");
    const app = homeOf(await declarationOf(token));
    const fields = app.models.summary.fields.map((field: any) => field.name);
    expect(fields).to.not.include.members(["revenue", "averageCheck"]);

    const item = (await summary(token, "p1")).body.result.item;
    expect(item).to.include.keys("orders", "ordersActive", "kitchen", "active");
    expect(item).to.not.have.any.keys("revenue", "revenueDelta", "averageCheck", "averageCheckDelta", "revenueByHour", "stop", "low", "popular");
  });

  it("tells a stock manager the stop list and what sells, and nothing of the orders or the money", async () => {
    const token = await login("stock");
    const item = (await summary(token, "p2")).body.result.item;
    expect(item.stop).to.equal(2);
    expect(item.low).to.equal(0);
    expect(item.popular).to.deep.equal([{ id: "d1", title: "Борщ", group: "Супы", sold: 1 }]);
    expect(item).to.not.have.any.keys("revenue", "averageCheck", "orders", "kitchen", "active");
  });

  it("gives the money with the orders report, and nothing of a point the person does not hold", async () => {
    const token = await login("manager");
    const item = (await summary(token, "p1")).body.result.item;
    expect(item.revenue).to.equal(3600);
    expect(item.orders).to.equal(4);
    expect(item).to.not.have.any.keys("stop", "popular");

    const refused = await summary(token, "p2");
    expect(refused.status).to.equal(403);
    expect(refused.body.error.code).to.equal("place_forbidden");
  });

  it("gives no delta where there is nothing to compare with, and an empty day is zeros, not gaps", async () => {
    home.rows = [];
    const item = (await summary(await login("admin"), "p1")).body.result.item;
    expect(item.revenue).to.equal(0);
    expect(item.averageCheck).to.equal(0);
    expect(item).to.not.have.any.keys("revenueDelta", "averageCheckDelta");
    expect(item.revenueByHour).to.deep.equal([]);
    expect(item.orders).to.equal(0);
    expect(item.active).to.deep.equal([]);
    expect(item.popular).to.deep.equal([]);
    expect(today).to.be.below(now);
  });
});
