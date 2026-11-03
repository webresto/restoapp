import { expect } from "chai";
import * as path from "path";
import { liftWithAdminpanel, Stand, STAND_PASSWORD } from "./support/liftWithAdminpanel";
import { solve } from "./support/mobileApiFakes";

const { syncOrderStops } = require("@webresto/core/lib/order/order-stops");

/**
 * app-mobile-api in a lifted Sails with the admin panel: the real adapters — adminizer users, groups
 * and contextual rights, Waterline stores, core's web stock functions, the middleware order.
 */
describe("app-mobile-api in Sails", function () {
  this.timeout(240000);

  let stand: Stand;

  before(async () => {
    stand = await liftWithAdminpanel({
      env: { MOBILE_API_ENABLED: "true", MOBILE_API_SECRET: "stand-secret", CAPTCHA_POW_DIFFICULTY: "20", ENABLE_ADMIN_CAPTCHA: "true" },
      hooks: { "app-mobile-api": require(path.resolve(__dirname, "../api/hooks/app-mobile-api")) },
    });
    const Dish = stand.sails.models.dish;
    const Group = stand.sails.models.group;
    const soups = await Group.create({ id: "stand-soups", name: "Супы" }).fetch();
    await Dish.create({ id: "stand-borsch", name: "Борщ", price: 300, parentGroup: soups.id }).fetch();
    await Dish.create({ id: "stand-mors", name: "Морс", price: 120 }).fetch();
  });

  after(async () => {
    await stand?.lower();
  });

  async function request(method: string, url: string, options: { token?: string; body?: unknown } = {}) {
    const response = await fetch(`${stand.url}${url}`, {
      method,
      headers: {
        ...(options.body !== undefined ? { "content-type": "application/json" } : {}),
        ...(options.token ? { authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
    const text = await response.text();
    let body: any = text;
    try {
      body = JSON.parse(text);
    } catch {
      // not JSON: left as text for the assertion message
    }
    return { status: response.status, headers: response.headers, body };
  }

  async function login(login: string) {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    expect(challenge.status, JSON.stringify(challenge.body)).to.equal(200);
    const captchaSolution = await solve(challenge.body.result.task);
    return request("POST", "/api/mobile/auth/login", {
      body: { login, password: STAND_PASSWORD, captchaSolution, device: { name: "stand", platform: "test" } },
    });
  }

  const call = (token: string, method: string, body: unknown) => request("POST", `/api/mobile/call/${method}`, { token, body });

  /**
   * A signed-in token per user, kept for the whole file: the login limit is ten attempts a minute
   * per address, and every test here comes from 127.0.0.1.
   */
  const tokens = new Map<string, string>();
  async function signIn(name: string): Promise<string> {
    if (!tokens.has(name)) {
      const response = await login(name);
      expect(response.status, JSON.stringify(response.body)).to.equal(200);
      tokens.set(name, response.body.result.token);
    }
    return tokens.get(name)!;
  }

  it("stands before bodyParser and keeps the rest of Sails untouched", async () => {
    const order: string[] = stand.sails.config.http.middleware.order;
    expect(order.indexOf("mobileApi")).to.be.lessThan(order.indexOf("bodyParser"));
    const outside = await request("GET", "/api/not-mobile");
    expect(outside.body?.error?.code).to.not.equal("not_found");
  });

  it("registers no Sails session for a mobile request", async () => {
    const response = await request("GET", "/api/mobile/auth/challenge");
    expect(response.headers.get("set-cookie")).to.equal(null);
  });

  it("signs a Stock Manager in through adminizer's users and gives «Блюда» on both points", async () => {
    const signedIn = await login("stand-stock");
    expect(signedIn.status, JSON.stringify(signedIn.body)).to.equal(200);
    const token = signedIn.body.result.token;

    const describe = await request("GET", "/api/mobile/describe?lang=ru", { token });
    expect(describe.status, JSON.stringify(describe.body)).to.equal(200);
    const declaration = describe.body.result;
    expect(declaration.apps.map((app: any) => app.id)).to.deep.equal(["dishes"]);
    expect(declaration.apps[0].places.sort()).to.deep.equal(["stand-a", "stand-b"]);
  });

  it("writes stock at one point through core, as the web stock reads it", async () => {
    const token = (await login("stand-stock")).body.result.token;
    const set = await call(token, "dishes.setBalance", { params: { id: "stand-borsch", balance: 7 }, place: "stand-a" });
    expect(set.status, JSON.stringify(set.body)).to.equal(200);
    expect(set.body.result.item).to.include({ id: "stand-borsch", balance: 7, localBalance: 7, groupTitle: "Супы" });

    const row = await stand.sails.models.dishplace.findOne({ dish: "stand-borsch", place: "stand-a" });
    expect(row.localBalance).to.equal(7);
    const { getStockProducts } = require("@webresto/core/lib/menu/stock-items");
    const web = await getStockProducts("stand-a", { id: "stand-borsch" }, 1);
    expect(web.results[0].balance).to.equal(7);

    const a = (await call(token, "dishes.list", { params: {}, place: "stand-a" })).body.result;
    expect(a.items.map((item: any) => item.id)).to.deep.equal(["stand-borsch"]);
    const b = (await call(token, "dishes.list", { params: {}, place: "stand-b" })).body.result;
    expect(b.items).to.deep.equal([]);

    const all = (await call(token, "dishes.list", { params: { filter: "all" }, place: "stand-b" })).body.result;
    expect(all.total).to.equal(2);
    expect(all.items.map((item: any) => item.balance)).to.deep.equal([-1, -1]);
  });

  it("takes a point away on the next request when the group loses it", async () => {
    const token = (await login("stand-stock")).body.result.token;
    const before = await call(token, "dishes.list", { params: {}, place: "stand-b" });
    expect(before.status).to.equal(200);
    await stand.sails.models.groupap.updateOne({ name: "Stock Manager" }, {
      tokens: ["access-to-adminpanel", { tokenId: "stock-manager", rights: [stand.places!.a.id] }],
    });
    const after = await call(token, "dishes.list", { params: {}, place: "stand-b" });
    expect(after.body.error?.code).to.equal("place_forbidden");
    expect(after.headers.get("x-mobile-revision")).to.not.equal(before.headers.get("x-mobile-revision"));
  });

  it("gives an Operator «Заказы» and no «Блюда», a panel-only user nothing, the administrator both", async () => {
    const operator = await signIn("stand-operator");
    const operatorApps = (await request("GET", "/api/mobile/describe", { token: operator })).body.result.apps;
    expect(operatorApps.map((app: any) => app.id)).to.deep.equal(["orders"]);
    expect(operatorApps[0].places).to.deep.equal(["stand-a", "no-kitchen"]);

    const panelOnly = await signIn("stand-panel");
    expect((await request("GET", "/api/mobile/describe", { token: panelOnly })).body.result.apps).to.deep.equal([]);

    const admin = await signIn("stand-admin");
    const declaration = (await request("GET", "/api/mobile/describe", { token: admin })).body.result;
    expect(declaration.apps.map((app: any) => app.id)).to.deep.equal(["dishes", "orders", "clients", "pos"]);
    expect(declaration.apps[0].places.sort()).to.deep.equal(["stand-a", "stand-b"]);
    // «Заказы» take pickup points too, and «Без кухни» is always among the administrator's.
    expect(declaration.apps[1].places.sort()).to.deep.equal(["no-kitchen", "stand-a", "stand-b", "stand-p"]);
    // The POS is read at a kitchen, so its points are the cooking ones; and it says that the client
    // draws it, which is the only thing that makes it different from the three above.
    const pos = declaration.apps[3];
    expect(pos.client).to.deep.equal({ native: "pos", min: 1 });
    expect(pos.places.sort()).to.deep.equal(["stand-a", "stand-b"]);
  });

  it("takes a draft of the POS through core: a cart of the point, and the customers of the panel", async () => {
    const admin = await signIn("stand-admin");
    const place = stand.places!.a.id;

    const started = (await call(admin, "pos.start", { params: {}, place })).body.result.order;
    // A cart of core, counted by core: the state, the point and the zero totals are its answer.
    expect(started.state).to.be.oneOf(["NEW", "CART"]);
    expect(started).to.include({ placeId: place, total: 0, dishesCount: 0 });
    const cart = await stand.sails.models.order.findOne({ id: started.id });
    expect(cart.id).to.equal(started.id);
    // The point it is taken at is where it is collected from, and that is how core reads its menu.
    expect(String(cart.pickupPoint ?? "")).to.equal(started.serviceType === "delivery" ? "" : place);

    const drafts = (await call(admin, "pos.order", { params: {}, place })).body.result.drafts;
    expect(drafts.map((order: any) => order.id)).to.deep.equal([started.id]);

    // A customer made through the panel's model is the same account core's own guest factory makes.
    const created = (await call(admin, "clients.create", { params: { name: "Иван Петров", phone: "+7 999 000 00 01" } })).body.result.item;
    const again = (await call(admin, "clients.create", { params: { name: "Иван", phone: "+7 999 000 00 01" } })).body.result.item;
    expect(again.id).to.equal(created.id);
    const found = (await call(admin, "clients.list", { params: { q: "0001" } })).body.result;
    expect(found.items.map((item: any) => item.id)).to.deep.equal([created.id]);

    // The card reads the real tables: a saved location of core and the customer's placed orders.
    await stand.sails.models.userlocation.create({ user: created.id, formatted: "ул. Ленина, 5, кв. 12", city: "Город" }).fetch();
    const card = (await call(admin, "clients.get", { params: { id: created.id } })).body.result.item;
    expect(card.addresses).to.deep.equal(["ул. Ленина, 5, кв. 12"]);
    expect(card.orders).to.deep.equal([]);
    expect((await call(admin, "clients.get", { params: { id: "nobody" } })).body.error.code).to.equal("not_found");

    const withClient = (await call(admin, "pos.start", { params: { clientId: created.id }, place })).body.result.order;
    expect(withClient.clientId).to.equal(created.id);
    expect(withClient.customerName).to.equal("Иван Петров");

    expect((await call(admin, "pos.cancel", { params: { id: started.id }, place })).body.result).to.deep.equal({ ok: true });
    expect((await call(admin, "pos.order", { params: { id: started.id }, place })).body.error.code).to.equal("not_found");
    // The cart itself is core's to keep or clean: dropping a draft does not destroy an order.
    expect(await stand.sails.models.order.findOne({ id: started.id })).to.not.equal(undefined);
  });

  /**
   * An order placed at a point, as core's own tests place one — with its stops written by hand,
   * because this does not go through `Order.order` (core C2: a point's board selects by them).
   */
  async function placed(values: Record<string, unknown>): Promise<string> {
    const Order = stand.sails.models.order;
    const order = await Order.create({}).fetch();
    await Order.update({ id: order.id }, {
      state: "ORDER",
      orderedAt: Math.floor(Date.now() / 1000),
      customer: { name: "Иван", phone: { code: "7", number: "9000000001", additionalNumber: "" } },
      total: 1200,
      ...values,
    }).fetch();
    await syncOrderStops({ id: order.id });
    return order.id;
  }

  it("walks an order of one point ORDER → COOKING → ON_THE_WAY → DONE, and the database agrees", async () => {
    const mine = await placed({ serviceType: "delivery", cookingPoints: ["stand-a"], address: { formatted: "ул. Ленина, 5", home: "5" } });
    const theirs = await placed({ serviceType: "delivery", cookingPoints: ["stand-b"] });
    const token = await signIn("stand-operator");

    const active = (await call(token, "orders.list", { params: {}, place: "stand-a" })).body.result;
    expect(active.items.map((item: any) => item.id)).to.deep.equal([mine]);
    expect(active.items[0]).to.include({ state: "ORDER", total: 1200, address: "ул. Ленина, 5" });
    expect(active.counts.active).to.equal(1);

    for (const to of ["COOKING", "ON_THE_WAY", "DONE"]) {
      const response = await call(token, "orders.setState", { params: { id: mine, to }, place: "stand-a" });
      expect(response.status, JSON.stringify(response.body)).to.equal(200);
      expect(response.body.result.item.state).to.equal(to);
    }

    // The same order as the web board reads it, finished through core's doFinalize.
    const stored = await stand.sails.models.order.findOne({ id: mine });
    expect(stored.state).to.equal("DONE");
    expect(stored.completedAt).to.be.a("number");
    const logs = await stand.sails.models.order.getLogs({ id: mine });
    expect(logs.some((log: any) => log.message === "mobile-api: state changed")).to.equal(true);

    // The order of point B is invisible and immovable, by list and by direct id.
    expect((await call(token, "orders.list", { params: {}, place: "stand-b" })).body.error.code).to.equal("place_forbidden");
    expect((await call(token, "orders.get", { params: { id: theirs }, place: "stand-a" })).body.error.code).to.equal("not_found");
    expect((await call(token, "orders.setState", { params: { id: theirs, to: "COOKING" }, place: "stand-a" })).body.error.code)
      .to.equal("not_found");
    expect((await stand.sails.models.order.findOne({ id: theirs })).state).to.equal("ORDER");
  });

  it("hands an order that arrived without a kitchen one of the operator's, through core", async () => {
    const waiting = await placed({ serviceType: "delivery", cookingPoints: [] });
    const token = await signIn("stand-operator");

    const list = (await call(token, "orders.list", { params: {}, place: "no-kitchen" })).body.result;
    expect(list.items.map((item: any) => item.id)).to.contain(waiting);
    const actions = list.items.find((item: any) => item.id === waiting)._actions.map((action: any) => action.method);
    expect(actions).to.contain("orders.assignKitchen");

    const assigned = await call(token, "orders.assignKitchen", { params: { id: waiting, place: "stand-a" }, place: "no-kitchen" });
    expect(assigned.status, JSON.stringify(assigned.body)).to.equal(200);
    expect((await stand.sails.models.order.findOne({ id: waiting })).cookingPoints).to.deep.equal(["stand-a"]);
    expect((await call(token, "orders.list", { params: {}, place: "no-kitchen" })).body.result.items.map((item: any) => item.id))
      .to.not.contain(waiting);
  });

  it("never shows a basket among the orders of a point", async () => {
    const Order = stand.sails.models.order;
    const basket = await Order.create({}).fetch();
    await Order.update({ id: basket.id }, { state: "CART", serviceType: "delivery", cookingPoints: ["stand-a"] }).fetch();
    await syncOrderStops({ id: basket.id });
    const token = await signIn("stand-operator");

    const { items } = (await call(token, "orders.list", { params: {}, place: "stand-a" })).body.result;
    expect(items.map((item: any) => item.id)).to.not.contain(basket.id);
  });

  it("keeps the device in the database and signs it out after a password change", async () => {
    const token = (await login("stand-operator")).body.result.token;
    const devices = await stand.sails.models.mobiledevice.find({ user: stand.users!.operator.id });
    expect(devices.length).to.be.greaterThan(0);
    expect(devices[0].tokenHash).to.not.equal(token);

    const passwordHash = require("password-hash");
    await stand.sails.models.userap.updateOne({ id: stand.users!.operator.id }, { passwordHashed: passwordHash.generate("changed") });
    expect((await request("GET", "/api/mobile/describe", { token })).status).to.equal(401);
  });

  it("refuses a solved task the second time, whichever worker asks", async () => {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const captchaSolution = await solve(challenge.body.result.task);
    const body = { login: "stand-admin", password: STAND_PASSWORD, captchaSolution, device: { name: "x", platform: "y" } };
    expect((await request("POST", "/api/mobile/auth/login", { body })).status).to.equal(200);
    const replay = await request("POST", "/api/mobile/auth/login", { body });
    expect(replay.body.error.code).to.equal("captcha_invalid");
  });

  it("registers the Stock Manager group's token and the MobileDevice model in the admin panel", () => {
    const adminizer = stand.sails.hooks.adminpanel.adminizer;
    expect(adminizer.accessRightsHelper.getToken("stock-manager")).to.exist;
    expect(stand.sails.config.adminpanel.models.mobiledevice).to.include({ model: "mobiledevice", userAccessRelation: "user" });
  });
});
