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
    // The apps of the hook itself. A module may bring one of its own — «Навигация» of
    // simple-navigation when that module is installed into `modules/` (D12) — and then it is here too.
    const own = declaration.apps.map((app: any) => app.id).filter((id: string) => id !== "navigation");
    expect(own).to.deep.equal(["dishes", "orders", "clients", "pos", "marketing", "channels", "settings", "system"]);
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

  it("takes an order from the catalog to the board: the basket, the guest, the check, the placing", async () => {
    const admin = await signIn("stand-admin");
    const Dish = stand.sails.models.dish;
    const Group = stand.sails.models.group;
    const Order = stand.sails.models.order;
    // A point of its own: an order really placed here would otherwise turn up among the orders the
    // board's tests count at «Ленина, 5».
    const place = (await stand.sails.models.place.create({
      id: "stand-pos", title: "Касса", enable: true, isCookingPoint: true, isPickupPoint: true,
    }).fetch()).id;

    const group = await Group.create({ id: "stand-g1", name: "Пицца", enable: true, isDeleted: false }).fetch();
    const pizza = await Dish.create({ id: "stand-d1", name: "Пепперони", code: "P1", price: 590, parentGroup: group.id, enable: true, isDeleted: false, modifier: false }).fetch();
    await Dish.create({ id: "stand-d2", name: "Маргарита", code: "P2", price: 490, parentGroup: group.id, enable: true, isDeleted: false, modifier: false }).fetch();

    const draft = (await call(admin, "pos.start", { params: {}, place })).body.result.order;

    // The catalog is the menu of this order: the group's products, with the price core quotes.
    const catalog = (await call(admin, "pos.catalog", { params: { id: draft.id, group: group.id }, place })).body.result;
    expect(catalog.items.map((item: any) => item.id)).to.have.members(["stand-d1", "stand-d2"]);
    expect(catalog.items.find((item: any) => item.id === "stand-d1")).to.include({ price: 590, inOrder: 0 });
    expect(catalog.path.map((group: any) => group.id)).to.deep.equal(["stand-g1"]);

    // «+» twice, then three of them: every answer is the whole receipt as core counted it.
    await call(admin, "pos.add", { params: { id: draft.id, dishId: pizza.id }, place });
    const added = (await call(admin, "pos.add", { params: { id: draft.id, dishId: pizza.id }, place })).body.result;
    expect(added.order.lines).to.have.length(1);
    expect(added.order.lines[0]).to.include({ name: "Пепперони", amount: 2 });
    expect(added.order.total).to.equal(1180);
    const three = (await call(admin, "pos.setLine", { params: { id: draft.id, lineId: added.order.lines[0].lineId, amount: 3 }, place })).body.result;
    expect(three.order.lines[0].amount).to.equal(3);
    expect(three.order.total).to.equal(1770);
    expect(three.order.canCheck, "no guest yet").to.equal(false);

    // The point of this stand hands food over but has no room to eat in, and says so.
    const options = (await call(admin, "pos.serviceOptions", { params: {}, place })).body.result.options;
    expect(options.find((option: any) => option.id === "pickup").available).to.equal(true);
    expect(options.find((option: any) => option.id === "dine-in").available).to.equal(false);
    const pickup = (await call(admin, "pos.setService", { params: { id: draft.id, serviceType: "pickup" }, place })).body.result;
    expect(pickup.order.serviceType).to.equal("pickup");

    const withGuest = (await call(admin, "pos.setCustomer", {
      params: { id: draft.id, name: "Сергей Крылов", phone: "+7 999 123-45-67", createClient: true },
      place,
    })).body.result;
    expect(withGuest.order.customerName).to.equal("Сергей Крылов");
    expect(withGuest.order.clientId, "createClient made an account and bound it").to.be.a("string");
    expect(withGuest.order.canCheck).to.equal(true);

    const checked = (await call(admin, "pos.check", { params: { id: draft.id }, place })).body.result;
    expect(checked.ok, JSON.stringify(checked.message)).to.equal(true);
    expect(checked.order.state).to.equal("CHECKOUT");
    expect(checked.order.canPlace).to.equal(true);

    const placed = (await call(admin, "pos.place", { params: { id: draft.id }, place })).body.result;
    expect(placed.ok, JSON.stringify(placed.message)).to.equal(true);
    expect(placed.order.state).to.equal("ORDER");
    expect(placed.message.text).to.contain("accepted");

    // The order as core keeps it: at the point, from this channel, for the account just made.
    const stored = await Order.findOne({ id: draft.id });
    expect(stored.state).to.equal("ORDER");
    expect(String(stored.pickupPoint)).to.equal(place);
    expect(stored.orderedOnPlatform).to.equal("mobile-pos");
    expect(stored.total).to.equal(1770);
    expect(String(stored.user)).to.equal(withGuest.order.clientId);

    // It is an order now: out of the drafts, and on the board of its point.
    const drafts = (await call(admin, "pos.order", { params: {}, place })).body.result.drafts;
    expect(drafts.map((order: any) => order.id)).to.not.include(draft.id);
    const board = (await call(admin, "orders.list", { params: {}, place })).body.result;
    expect(board.items.map((item: any) => item.id)).to.include(draft.id);
  });

  it("chooses the modifiers of a dish through core: the line keeps what was chosen, and the price with it", async () => {
    const admin = await signIn("stand-admin");
    const Dish = stand.sails.models.dish;
    const Group = stand.sails.models.group;
    const OrderDish = stand.sails.models.orderdish;
    const place = (await stand.sails.models.place.create({
      id: "stand-mods", title: "Касса с добавками", enable: true, isCookingPoint: true, isPickupPoint: true,
    }).fetch()).id;

    // The modifiers are products of the menu like any other, gathered into groups by the dish.
    const sauces = await Group.create({ id: "stand-g-sauce", name: "Соусы", enable: true, isDeleted: false }).fetch();
    const extras = await Group.create({ id: "stand-g-extra", name: "Добавки", enable: true, isDeleted: false }).fetch();
    const sour = await Dish.create({ id: "stand-m-sour", name: "Сметана", price: 0, modifier: true, enable: true, isDeleted: false, parentGroup: sauces.id }).fetch();
    const hot = await Dish.create({ id: "stand-m-hot", name: "Острый соус", price: 60, modifier: true, enable: true, isDeleted: false, parentGroup: sauces.id }).fetch();
    // The free-of-charge rule of core is found by the product's `rmsId` (`countCart`, «Find
    // original obj modifiers»), so a group that gives one away names its option by that id — which
    // is how an RMS-imported menu names them anyway.
    const cheese = await Dish.create({
      id: "stand-m-cheese", rmsId: "rms-cheese", name: "Сыр", price: 40, modifier: true, enable: true, isDeleted: false, parentGroup: extras.id,
    }).fetch();
    const pilaf = await Dish.create({
      id: "stand-d-pilaf", name: "Плов", price: 450, enable: true, isDeleted: false, modifier: false,
      modifiers: [
        { id: sauces.id, required: true, minAmount: 1, maxAmount: 1, childModifiers: [{ id: sour.id, defaultAmount: 1 }, { id: hot.id }] },
        { id: extras.id, minAmount: 0, maxAmount: 3, childModifiers: [{ id: cheese.rmsId, freeOfChargeAmount: 1 }] },
      ],
    }).fetch();

    const draft = (await call(admin, "pos.start", { params: {}, place })).body.result.order;

    // The catalog says the dish has something to choose, so the «+» opens the chooser.
    const catalog = (await call(admin, "pos.catalog", { params: { id: draft.id, q: "Плов" }, place })).body.result;
    expect(catalog.items.find((item: any) => item.id === pilaf.id).hasOptions).to.equal(true);

    // The chooser opens at core's own answer: the group's names, and the default sauce chosen.
    const chooser = (await call(admin, "pos.options", { params: { id: draft.id, dishId: pilaf.id }, place })).body.result;
    expect(chooser.groups.map((group: any) => [group.name, group.single, group.required])).to.deep.equal([
      ["Соусы", true, true],
      ["Добавки", false, false],
    ]);
    expect(chooser.groups[0].options.map((option: any) => [option.name, option.price, option.amount])).to.deep.equal([
      ["Сметана", 0, 1],
      ["Острый соус", 60, 0],
    ]);
    expect(chooser.groups[1].options[0]).to.include({ name: "Сыр", price: 40, freeAmount: 1, amount: 0 });

    // A required group left empty: core would have filled it, the POS asks instead.
    const empty = (await call(admin, "pos.add", { params: { id: draft.id, dishId: pilaf.id, modifiers: [] }, place })).body.result;
    expect(empty.order.lines).to.deep.equal([]);

    // The hot sauce instead of the default, and two of the cheese with one of them free.
    const added = (await call(admin, "pos.add", {
      params: {
        id: draft.id,
        dishId: pilaf.id,
        modifiers: [{ id: hot.id, groupId: sauces.id, amount: 1 }, { id: cheese.rmsId, groupId: extras.id, amount: 2 }],
      },
      place,
    })).body.result;
    expect(added.ok, JSON.stringify(added.message)).to.equal(true);
    expect(added.order.lines).to.have.length(1);
    const line = added.order.lines[0];
    expect(line.options.map((option: any) => [option.name, option.amount])).to.deep.equal([["Острый соус", 1], ["Сыр", 2]]);
    // core's arithmetic: 450 of the dish, 60 of the sauce, 40 of the second cheese — the first free.
    expect(added.order.total).to.equal(550);

    // What core keeps on the line is what was chosen — the default sauce is not back on it.
    const stored = await OrderDish.findOne({ id: line.lineId });
    expect(stored.modifiers.map((modifier: any) => String(modifier.id))).to.deep.equal([hot.id, cheese.rmsId]);

    // The same chooser on the line, and the choice changed on it: the line stays, the money moves.
    const onLine = (await call(admin, "pos.options", { params: { id: draft.id, lineId: line.lineId }, place })).body.result;
    expect(onLine.lineId).to.equal(line.lineId);
    expect(onLine.groups[0].options.map((option: any) => option.amount)).to.deep.equal([0, 1]);

    const changed = (await call(admin, "pos.setLineOptions", {
      params: { id: draft.id, lineId: line.lineId, modifiers: [{ id: sour.id, groupId: sauces.id, amount: 1 }] },
      place,
    })).body.result;
    expect(changed.ok, JSON.stringify(changed.message)).to.equal(true);
    expect(changed.order.lines).to.have.length(1);
    expect(changed.order.lines[0].lineId).to.equal(line.lineId);
    expect(changed.order.lines[0].options.map((option: any) => option.name)).to.deep.equal(["Сметана"]);
    expect(changed.order.total).to.equal(450);

    // Two of the sauce in a group that takes one: a refusal in words, and the line is untouched.
    const tooMany = (await call(admin, "pos.setLineOptions", {
      params: {
        id: draft.id,
        lineId: line.lineId,
        modifiers: [{ id: sour.id, groupId: sauces.id, amount: 1 }, { id: hot.id, groupId: sauces.id, amount: 1 }],
      },
      place,
    })).body.result;
    expect(tooMany.ok).to.equal(false);
    expect(tooMany.message.text).to.contain("Соусы");
    expect(tooMany.order.total).to.equal(450);

    // A line with options is its own line: the same dish with another sauce does not merge into it.
    const second = (await call(admin, "pos.add", {
      params: { id: draft.id, dishId: pilaf.id, modifiers: [{ id: hot.id, groupId: sauces.id, amount: 1 }] },
      place,
    })).body.result;
    expect(second.order.lines).to.have.length(2);
    expect(second.order.total).to.equal(960);
  });
  it("finds a client by the search, takes their saved address to a delivery, and shows the order on the card", async () => {
    const admin = await signIn("stand-admin");
    const Dish = stand.sails.models.dish;
    const Order = stand.sails.models.order;
    const UserLocation = stand.sails.models.userlocation;
    // A point of its own: an order really placed here would otherwise turn up among the orders the
    // board's tests count at «Ленина, 5».
    const place = (await stand.sails.models.place.create({
      id: "stand-delivery", title: "Касса доставки", enable: true, isCookingPoint: true, isPickupPoint: true,
      // A kitchen with a point on the map: that is how core's chain finds one for a delivery
      // («nearest-geo»), and the address below carries its own coordinate, so nothing is geocoded.
      coordinate: { lat: 55.75, lon: 37.62 },
    }).fetch()).id;
    const roll = await Dish.create({ id: "stand-d-roll", name: "Ролл", code: "R1", price: 350, enable: true, isDeleted: false, modifier: false }).fetch();

    // The person exists before the order: made through «Клиенты», with an address of their own.
    const client = (await call(admin, "clients.create", { params: { name: "Ольга Белова", phone: "+7 999 000 00 07" } })).body.result.item;
    const home = await UserLocation.create({
      user: client.id, formatted: "ул. Мира, 3", home: "3", apartment: "7", entrance: "2", comment: "код 1234",
      coordinate: { lat: 55.752, lon: 37.615 },
    }).fetch();

    const draft = (await call(admin, "pos.start", { params: {}, place })).body.result.order;
    await call(admin, "pos.add", { params: { id: draft.id, dishId: roll.id }, place });

    // The guest sheet of the POS searches the same people «Клиенты» do, by the last digits.
    const found = (await call(admin, "pos.clients", { params: { q: "0007" }, place })).body.result;
    expect(found.items.map((item: any) => item.id)).to.deep.equal([client.id]);
    expect(found.items[0].title).to.equal("Ольга Белова");

    const bound = (await call(admin, "pos.setClient", { params: { id: draft.id, clientId: client.id }, place })).body.result;
    expect(bound.order.clientId).to.equal(client.id);
    expect(bound.order.customerName).to.equal("Ольга Белова");
    // The chosen person is the one to call: their number is on the order, and core may be asked.
    expect(bound.order.customerPhone, "the client's number went onto the order").to.be.a("string");
    expect(bound.order.canCheck).to.equal(true);

    // Their saved addresses — what the address sheet offers above the search.
    const addresses = (await call(admin, "pos.clientAddresses", { params: { clientId: client.id }, place })).body.result.items;
    expect(addresses.map((address: any) => address.formatted)).to.deep.equal(["ул. Мира, 3"]);
    expect(addresses[0].id).to.equal(home.id);

    // The stand carries no seeded settings, so the chain that finds a kitchen for a delivery is
    // empty here and core would refuse the order with its NO_KITCHEN; a deployment has the default
    // of the descriptor (`core/settings/kitchen_resolve_chain.json`), and a json setting is only
    // accepted with its schema.
    await (global as any).Settings.set("KITCHEN_RESOLVE_CHAIN", {
      value: ["nearest-geo", "single-point"],
      type: "json",
      jsonSchema: { type: "array", items: { type: "string", enum: ["delivery-zone", "rms", "nearest-geo", "single-point"] }, uniqueItems: true },
    });
    // A zone is the only tariff of a delivery: without one core refuses the order even with soft
    // calculation on («Delivery not allowed», its code 11). Points are [lon, lat].
    await stand.sails.models.deliveryzone.create({
      id: "stand-zone", name: "Центр", enable: true, sortOrder: 0, minDeliveryTime: 60, deliveryCost: 150,
      polygon: [[37.60, 55.73], [37.65, 55.73], [37.65, 55.77], [37.60, 55.77]],
    }).fetch();

    const delivery = (await call(admin, "pos.setService", { params: { id: draft.id, serviceType: "delivery" }, place })).body.result;
    expect(delivery.order.serviceType).to.equal("delivery");
    // A saved address goes in by its id: core wants the house number, and only the saved record
    // has it — a formatted line alone is refused with its code 6.
    const addressed = (await call(admin, "pos.setAddress", { params: { id: draft.id, savedId: home.id }, place })).body.result;
    expect(addressed.ok, JSON.stringify(addressed.message)).to.equal(true);
    expect(addressed.order.address).to.contain("ул. Мира, 3");

    // Another customer's saved address is not this order's to take.
    const stranger = (await call(admin, "clients.create", { params: { name: "Пётр Чужой", phone: "+7 999 000 00 08" } })).body.result.item;
    const theirs = await UserLocation.create({ user: stranger.id, formatted: "ул. Чужая, 1", home: "1" }).fetch();
    const refused = (await request("POST", "/api/mobile/call/pos.setAddress?lang=ru", {
      token: admin, body: { params: { id: draft.id, savedId: theirs.id }, place },
    })).body.result;
    expect(refused.ok).to.equal(false);
    expect(refused.message.text).to.equal("Этого адреса у клиента нет");
    expect(refused.order.address).to.contain("ул. Мира, 3");

    // Typed by hand without the house number: a word for the operator, not an error of the protocol.
    const noHouse = (await request("POST", "/api/mobile/call/pos.setAddress?lang=ru", {
      token: admin, body: { params: { id: draft.id, city: "Город", street: "ул. Мира" }, place },
    })).body.result;
    expect(noHouse.ok).to.equal(false);
    expect(noHouse.message.text).to.equal("Укажите улицу и номер дома");

    const checked = (await call(admin, "pos.check", { params: { id: draft.id }, place })).body.result;
    expect(checked.ok, JSON.stringify(checked.message)).to.equal(true);
    const placed = (await call(admin, "pos.place", { params: { id: draft.id }, place })).body.result;
    expect(placed.ok, JSON.stringify(placed.message)).to.equal(true);

    // The order as core keeps it: a delivery of that account, to that address, with no pickup point.
    const stored = await Order.findOne({ id: draft.id });
    expect(stored.state).to.equal("ORDER");
    expect(stored.serviceType).to.equal("delivery");
    expect(String(stored.user)).to.equal(client.id);
    expect(stored.address.formatted).to.contain("ул. Мира, 3");
    // Everything the saved record knew is on the order, not only the line: that is what a courier reads.
    expect(stored.address).to.include({ home: "3", apartment: "7", entrance: "2", comment: "код 1234" });
    expect(stored.pickupPoint ?? null).to.equal(null);

    // And the loop closes: the card of «Клиенты» lists the order just placed, and the address stayed.
    const card = (await call(admin, "clients.get", { params: { id: client.id } })).body.result.item;
    expect(card.orders.join("\n")).to.contain(`№${stored.shortId}`);
    expect(card.addresses).to.deep.equal(["ул. Мира, 3"]);
  });

  it("serves a table in the dining room, and keeps it on the order", async () => {
    const admin = await signIn("stand-admin");
    const Place = stand.sails.models.place;
    const Dish = stand.sails.models.dish;
    const Order = stand.sails.models.order;
    const hall = await Place.create({ id: "stand-hall", title: "Зал", enable: true, isCookingPoint: true, isPickupPoint: false, hasDiningArea: true }).fetch();
    const soup = await Dish.create({ id: "stand-d3", name: "Том ям", price: 420, enable: true, isDeleted: false, modifier: false }).fetch();

    const draft = (await call(admin, "pos.start", { params: {}, place: hall.id })).body.result.order;
    // A point with a room to eat in starts the order there, without being asked.
    expect(draft.serviceType).to.equal("dine-in");

    await call(admin, "pos.add", { params: { id: draft.id, dishId: soup.id }, place: hall.id });
    const seated = (await call(admin, "pos.setService", { params: { id: draft.id, serviceType: "dine-in", table: "12" }, place: hall.id })).body.result;
    expect(seated.order.table).to.equal("12");
    const moved = (await call(admin, "pos.setTable", { params: { id: draft.id, table: "У окна" }, place: hall.id })).body.result;
    expect(moved.order.table).to.equal("У окна");

    await call(admin, "pos.setCustomer", { params: { id: draft.id, name: "Гость зала", phone: "+7 999 000-00-12" }, place: hall.id });
    const checked = (await call(admin, "pos.check", { params: { id: draft.id }, place: hall.id })).body.result;
    expect(checked.ok, JSON.stringify(checked.message)).to.equal(true);
    const placed = (await call(admin, "pos.place", { params: { id: draft.id }, place: hall.id })).body.result;
    expect(placed.ok, JSON.stringify(placed.message)).to.equal(true);

    // The table is a field of the order now (core C12a), so the board and the kitchen see it.
    const stored = await Order.findOne({ id: draft.id });
    expect(stored.table).to.equal("У окна");
    expect(stored.state).to.equal("ORDER");
  });

  it("says what core refuses, and keeps the receipt where it was", async () => {
    const admin = await signIn("stand-admin");
    const place = stand.places!.a.id;
    const draft = (await call(admin, "pos.start", { params: {}, place })).body.result.order;

    // An empty basket: core's code 13, in the operator's language, and no error of the protocol.
    const empty = await request("POST", "/api/mobile/call/pos.check?lang=ru", { token: admin, body: { params: { id: draft.id }, place } });
    expect(empty.status).to.equal(200);
    expect(empty.body.result.ok).to.equal(false);
    expect(empty.body.result.message.text).to.equal("В заказе пусто");
    expect(empty.body.result.order.state).to.be.oneOf(["NEW", "CART"]);

    // Placing before checking is refused by us, not by a crash of core.
    const early = (await request("POST", "/api/mobile/call/pos.place?lang=ru", { token: admin, body: { params: { id: draft.id }, place } })).body.result;
    expect(early.ok).to.equal(false);
    expect(early.message.text).to.equal("Сначала проверьте заказ");

    // A dining table at a point with no room for one.
    const table = (await request("POST", "/api/mobile/call/pos.setService?lang=ru", {
      token: admin,
      body: { params: { id: draft.id, serviceType: "dine-in", table: "3" }, place },
    })).body.result;
    expect(table.ok).to.equal(false);
    expect(table.message.text).to.equal("Этот способ получения на точке недоступен");
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

  it("shows a routed order at both kitchens, each its own part, and only the leading one moves it", async () => {
    const routed = await placed({ serviceType: "delivery", cookingPoints: ["stand-a", "stand-b"] });
    const Dish = stand.sails.models.dish;
    const OrderDish = stand.sails.models.orderdish;
    const borsch = await Dish.create({ id: "routed-d1", name: "Борщ рут", price: 300, enable: true }).fetch();
    const plov = await Dish.create({ id: "routed-d2", name: "Плов рут", price: 450, enable: true }).fetch();
    // A route planner gives each line its own kitchen; a line without one is the leading point's.
    await OrderDish.create({ order: routed, dish: borsch.id, amount: 1, cookingPoint: "stand-a" }).fetch();
    await OrderDish.create({ order: routed, dish: plov.id, amount: 2, cookingPoint: "stand-b" }).fetch();
    const admin = await signIn("stand-admin");

    const atA = (await call(admin, "orders.list", { params: {}, place: "stand-a" })).body.result;
    const atB = (await call(admin, "orders.list", { params: {}, place: "stand-b" })).body.result;
    expect(atA.items.map((item: any) => item.id), "the leading kitchen has it").to.contain(routed);
    expect(atB.items.map((item: any) => item.id), "and so does the second one").to.contain(routed);

    const cardA = (await call(admin, "orders.get", { params: { id: routed }, place: "stand-a" })).body.result.item;
    const cardB = (await call(admin, "orders.get", { params: { id: routed }, place: "stand-b" })).body.result.item;
    expect(cardA.contents, "each kitchen sees what it has to make").to.equal("1 × Борщ рут");
    expect(cardB.contents).to.equal("2 × Плов рут");

    const fromSecond = await call(admin, "orders.setState", { params: { id: routed, to: "COOKING" }, place: "stand-b" });
    expect(fromSecond.status, JSON.stringify(fromSecond.body)).to.equal(409);
    expect((await stand.sails.models.order.findOne({ id: routed })).state).to.equal("ORDER");

    const fromLeading = await call(admin, "orders.setState", { params: { id: routed, to: "COOKING" }, place: "stand-a" });
    expect(fromLeading.status, JSON.stringify(fromLeading.body)).to.equal(200);
    expect(fromLeading.body.result.item.state).to.equal("COOKING");
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
  /**
   * «Маркетинг» against core itself: the codes, the promotions and the applications are core's own records, read
   * through its marketing layer (plan C18-C20), and the rights are adminizer's two tokens of the section.
   */
  describe("«Маркетинг»", function () {
    let codeId: string;
    let deadCodeId: string;

    before(async () => {
      const Promotion = stand.sails.models.promotion;
      const PromotionCode = stand.sails.models.promotioncode;
      const promotion = async (id: string, values: Record<string, unknown>, discount: Record<string, unknown> = {}) => {
        await (global as any).Promotion.createOrUpdate({
          id, name: id, badge: "configured-promotion", description: `Description of ${id}`, externalId: id,
          isJoint: true, isPublic: true, createdByUser: true, concept: ["origin"],
          configDiscount: { discountType: "percentage", discountAmount: 10, dishes: [], groups: [], excludeModifiers: true, ...discount },
        } as any);
        await Promotion.update({ id }, { sortOrder: 0, ...values }).fetch();
      };

      await promotion("stand-summer", { enable: true, onlyByCode: true });
      await promotion("stand-self", { enable: true, onlyByCode: false }, { discountType: "flat", discountAmount: 150 });
      await promotion("stand-off", { enable: false });

      codeId = (await PromotionCode.create({ code: "LETO10", description: "Лето на стенде" }).fetch()).id;
      deadCodeId = (await PromotionCode.create({ code: "DEAD", description: "Код без рабочих акций" }).fetch()).id;
      const soon = await PromotionCode.create({ code: "SOON", description: "Позже", startDate: "2099-01-01" }).fetch();
      await PromotionCode.addToCollection(codeId, "promotion", "stand-summer");
      await PromotionCode.addToCollection(deadCodeId, "promotion", "stand-off");
      await PromotionCode.addToCollection(soon.id, "promotion", "stand-self");

      // Two orders that carry a code: one that took it, one that did not. The applications are read from these.
      const Order = stand.sails.models.order;
      const applied = await Order.create({}).fetch();
      await Order.update({ id: applied.id }, { state: "DONE", shortId: "7001", promotionCodeString: "LETO10", promotionCode: codeId, discountTotal: 30.5 }).fetch();
      const refused = await Order.create({}).fetch();
      await Order.update({ id: refused.id }, { state: "CART", shortId: "7002", promotionCodeString: "NOBODYS" }).fetch();

      // The login limit is ten a minute per address, and every test of this file comes from 127.0.0.1: the
      // attempts of the tests before are forgotten, and the three people of the section sign in once.
      await stand.sails.models.mobileauthattempt.destroy({}).fetch();
      for (const login of ["stand-marketer", "stand-coder", "stand-promoter"]) await signIn(login);
    });

    it("gives the section to either right, and its numbers to the right that may see them", async () => {
      const marketer = await signIn("stand-marketer");
      const declaration = (await request("GET", "/api/mobile/describe?lang=ru", { token: marketer })).body.result;
      const app = declaration.apps.find((candidate: any) => candidate.id === "marketing");
      expect(app, JSON.stringify(declaration.apps.map((a: any) => a.id))).to.not.equal(undefined);
      expect(app).to.include({ title: "Маркетинг", home: "marketing.home" });

      const summary = (await call(marketer, "marketing.home", { params: {} })).body.result.item;
      expect(summary.codesTotal).to.equal(3);
      expect(summary.promotionsTotal).to.be.at.least(3);
      expect(summary.promotionsByCodeOnly).to.be.at.least(1);
      expect(summary._links.map((link: any) => link.open.method)).to.contain("marketing.applications");

      const promoter = await signIn("stand-promoter");
      const theirs = (await call(promoter, "marketing.home", { params: {} })).body.result.item;
      expect(theirs.codesTotal, "the promotions alone: nothing about the codes").to.equal(undefined);
      expect((await call(promoter, "marketing.promocodes", { params: {} })).body.error.code).to.equal("forbidden");

      const outsider = await signIn("stand-stock");
      const without = (await request("GET", "/api/mobile/describe", { token: outsider })).body.result;
      expect(without.apps.map((candidate: any) => candidate.id)).to.not.contain("marketing");
    });

    it("reads the codes as the web reads them: the status, the hours and what they give", async () => {
      const token = await signIn("stand-coder");
      // In Russian: the words of a term, of the hours and of what a code gives are core's catalogs.
      const { items, counts } = (await request("POST", "/api/mobile/call/marketing.promocodes?lang=ru", { token, body: { params: {} } })).body.result;
      const byCode = new Map(items.map((item: any) => [item.code, item]));
      expect([...byCode.keys()].sort()).to.deep.equal(["DEAD", "LETO10", "SOON"]);
      expect(byCode.get("LETO10")).to.include({ status: "active", worksNow: true, period: "без ограничения", schedule: "круглосуточно" });
      expect(byCode.get("LETO10")!.gives).to.equal("−10% на всю корзину");
      expect(byCode.get("SOON")).to.include({ status: "scheduled", worksNow: false, period: "с 01.01.2099" });
      // Its only promotion is switched off: since C22 the code gives nothing, and says so.
      expect(byCode.get("DEAD")!.gives).to.equal("все акции кода выключены — код ничего не даёт");
      expect(counts).to.include({ all: 3, scheduled: 1 });

      const found = (await call(token, "marketing.promocodes", { params: { q: "stand-summer" } })).body.result;
      expect(found.items.map((item: any) => item.code), "searched by the name of a promotion of it").to.deep.equal(["LETO10"]);
    });

    it("switches a code off in the database, and core stops taking it", async () => {
      const token = await signIn("stand-coder");
      const off = await call(token, "marketing.setCodeEnabled", { params: { id: codeId, enable: false } });
      expect(off.status, JSON.stringify(off.body)).to.equal(200);
      expect(off.body.result.item).to.include({ enable: false, status: "disabled", worksNow: false });
      expect((await stand.sails.models.promotioncode.findOne({ id: codeId })).enable).to.equal(false);
      expect(await (global as any).PromotionCode.getValidPromotionCode("LETO10")).to.equal(null);

      await call(token, "marketing.setCodeEnabled", { params: { id: codeId, enable: true } });
      expect(await (global as any).PromotionCode.getValidPromotionCode("LETO10")).to.not.equal(null);
    });

    it("both switches of a promotion are written, and the storefront follows at once", async () => {
      const token = await signIn("stand-promoter");
      const automatic = () => (global as any).Promotion.getAllByConcept(["origin"]).map((promotion: any) => promotion.id);
      expect(automatic(), "«только по коду» applies by itself nowhere").to.not.contain("stand-summer");
      expect(automatic()).to.contain("stand-self");

      const byCode = await call(token, "marketing.setPromotionOnlyByCode", { params: { id: "stand-self", onlyByCode: true } });
      expect(byCode.body.result.item).to.include({ appliesNow: "code-only", onlyByCode: true });
      expect(automatic(), "and it leaves the menu as soon as it is marked").to.not.contain("stand-self");

      await call(token, "marketing.setPromotionOnlyByCode", { params: { id: "stand-self", onlyByCode: false } });
      const off = await call(token, "marketing.setPromotionEnabled", { params: { id: "stand-self", enable: false } });
      expect(off.body.result.item).to.include({ appliesNow: "disabled" });
      expect(automatic()).to.not.contain("stand-self");
      await call(token, "marketing.setPromotionEnabled", { params: { id: "stand-self", enable: true } });
      expect(automatic()).to.contain("stand-self");
    });

    it("sets a promotion up from the phone, and the web reads the same record", async () => {
      const token = await signIn("stand-promoter");
      const saved = await call(token, "marketing.savePromotion", {
        params: {
          name: "Осенняя",
          description: "−15% на борщ по коду",
          enable: true,
          onlyByCode: true,
          isJoint: true,
          sortOrder: 3,
          configDiscount: { discountType: "percentage", discountAmount: 15, dishes: ["stand-borsch"], groups: [], serviceType: ["delivery"], minBasketTotal: 500 },
        },
      });
      expect(saved.status, JSON.stringify(saved.body)).to.equal(200);
      const item = saved.body.result.item;
      expect(item).to.include({ name: "Осенняя", appliesNow: "code-only", discountPercent: 15, dishesCount: 1, sortOrder: 3 });

      const { promotionView } = require("@webresto/core/lib/marketing/promotions");
      const web = promotionView(await stand.sails.models.promotion.findOne({ id: item.id }));
      expect(web).to.include({ name: "Осенняя", enable: true, onlyByCode: true, createdByUser: true });
      expect(web.configDiscount).to.include({ discountType: "percentage", discountAmount: 15, minBasketTotal: 500 });
      // The adapter of core holds it: a promotion saved from a phone applies without a restart.
      expect(item.runtimeActive).to.equal(true);
    });

    it("refuses a gift product the guest could buy, in core's own words", async () => {
      const token = await signIn("stand-promoter");
      const refused = await call(token, "marketing.savePromotion", {
        params: { name: "Подарок", description: "Подарок к заказу", configDiscount: { gift: { minBasketTotal: 1000, dishes: [{ dishId: "stand-borsch", amount: 1 }] } } },
      });
      expect(refused.status).to.equal(400);
      expect(refused.body.error.message).to.contain("notForSale");
    });

    it("creates a code from the phone, refuses one that is taken, and links the promotion chosen", async () => {
      const token = await signIn("stand-coder");
      const made = await call(token, "marketing.saveCode", { params: { code: "zima30", description: "Зима", promotionId: "stand-summer" } });
      expect(made.status, JSON.stringify(made.body)).to.equal(200);
      expect(made.body.result.item).to.include({ code: "ZIMA30", promotionsCount: 1 });
      const row = await stand.sails.models.promotioncode.findOne({ code: "ZIMA30" }).populate("promotion");
      expect(row.promotion.map((promotion: any) => promotion.id)).to.deep.equal(["stand-summer"]);

      const again = await call(token, "marketing.saveCode", { params: { code: "ZIMA30", description: "Ещё раз" } });
      expect(again.status).to.equal(409);
      expect(again.body.error.code).to.equal("conflict");
    });

    it("shows where a code was typed, and refuses the applications to whoever may not read an order", async () => {
      const marketer = await signIn("stand-marketer");
      const { items, counts } = (await call(marketer, "marketing.applications", { params: {} })).body.result;
      const byTitle = new Map(items.map((item: any) => [item.title, item]));
      expect(byTitle.get("№7001")).to.include({ code: "LETO10", status: "applied", discount: 30.5 });
      expect(byTitle.get("№7002")).to.include({ code: "NOBODYS", status: "invalid" });
      expect(byTitle.get("№7002")!.why).to.equal("the code is not valid or has expired");
      expect(counts.all).to.be.at.least(2);

      // The words are core's catalogs, in the language the call was made in.
      const inRussian = await request("POST", "/api/mobile/call/marketing.applications?lang=ru", { token: marketer, body: { params: {} } });
      const refused = inRussian.body.result.items.find((item: any) => item.title === "№7002");
      expect(refused.why).to.equal("код не подошёл или истёк");

      const card = (await call(marketer, "marketing.application", { params: { id: byTitle.get("№7001")!.id } })).body.result.item;
      expect(card).to.include({ code: "LETO10", status: "applied" });

      // The codes without the orders: the applications are not theirs to see.
      expect((await call(await signIn("stand-coder"), "marketing.applications", { params: {} })).body.error.code).to.equal("forbidden");
    });

    it("the catalog of the editor is the real one, and says which product may be a gift", async () => {
      const catalog = (await call(await signIn("stand-promoter"), "marketing.catalog", { params: {} })).body.result;
      expect(catalog.groups.map((group: any) => group.id)).to.contain("stand-soups");
      expect(catalog.items.map((item: any) => item.id)).to.contain("stand-borsch");
      expect(catalog.items.find((item: any) => item.id === "stand-borsch")).to.include({ notForSale: false, price: 300 });
    });
  });
});
