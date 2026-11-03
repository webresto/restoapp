import { expect } from "chai";
import * as path from "path";
import { liftWithAdminpanel, Stand, STAND_PASSWORD } from "./support/liftWithAdminpanel";
import { solve } from "./support/mobileApiFakes";

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
    const { getStockProducts } = require("@webresto/core/lib/adminpanel/src/controller/stock-place-items");
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
      tokens: ["access-to-adminpanel", { tokenId: "stock-manager", rights: [stand.places.a.id] }],
    });
    const after = await call(token, "dishes.list", { params: {}, place: "stand-b" });
    expect(after.body.error?.code).to.equal("place_forbidden");
    expect(after.headers.get("x-mobile-revision")).to.not.equal(before.headers.get("x-mobile-revision"));
  });

  it("gives an Operator and a panel-only user no «Блюда», the administrator every cooking point", async () => {
    for (const login_ of ["stand-operator", "stand-panel"]) {
      const token = (await login(login_)).body.result.token;
      expect((await request("GET", "/api/mobile/describe", { token })).body.result.apps).to.deep.equal([]);
    }
    const admin = (await login("stand-admin")).body.result.token;
    const declaration = (await request("GET", "/api/mobile/describe", { token: admin })).body.result;
    expect(declaration.apps[0].places.sort()).to.deep.equal(["stand-a", "stand-b"]);
  });

  it("keeps the device in the database and signs it out after a password change", async () => {
    const token = (await login("stand-operator")).body.result.token;
    const devices = await stand.sails.models.mobiledevice.find({ user: stand.users.operator.id });
    expect(devices.length).to.be.greaterThan(0);
    expect(devices[0].tokenHash).to.not.equal(token);

    const passwordHash = require("password-hash");
    await stand.sails.models.userap.updateOne({ id: stand.users.operator.id }, { passwordHashed: passwordHash.generate("changed") });
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
