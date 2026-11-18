import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Маркетинг» through the mobile API: the section of the admin panel as one app whose home screen is the summary
 * (`marketing.plan.md`, Q39). The rights are the real ones of adminizer — `promocodes-manager` and
 * `promotions-manager`, either of which opens the section — and what is behind them is checked method by method,
 * field by field and link by link.
 *
 * Users: `marketer` (both rights and `read-order-model`), `coder` (the codes alone), `promoter` (the promotions
 * alone), `stock` (neither).
 */
describe("app-mobile-api: «Маркетинг»", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };

  const validDeclaration = (() => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    return ajv.getSchema(`${contract.$id}#/definitions/declaration`)!;
  })();
  const validList = (() => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    return ajv.getSchema(`${contract.$id}#/definitions/listResult`)!;
  })();
  const validItem = (() => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    return ajv.getSchema(`${contract.$id}#/definitions/itemResult`)!;
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
      body: { login: name, password: PASSWORD, captchaSolution: await solve(challenge.body.result.task), device: { name: "Pixel", platform: "android" } },
    });
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    return response.body.result.token;
  }

  const call = (token: string, method: string, params: unknown = {}) => request("POST", `/api/mobile/call/${method}`, { token, body: { params } });
  const declarationOf = async (token: string) => (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
  const appOf = async (token: string) => (await declarationOf(token)).apps.find((app: any) => app.id === "marketing");

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("the section and its rights", () => {
    it("either right of the section opens it, and the declaration matches the contract", async () => {
      const declaration = await declarationOf(await login("marketer"));
      expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      const marketing = declaration.apps.find((app: any) => app.id === "marketing");
      expect(marketing).to.include({ title: "Маркетинг", home: "marketing.home", scope: "server" });
      expect(marketing.methods.map((method: any) => method.name)).to.include.members([
        "marketing.home",
        "marketing.promocodes",
        "marketing.promocode",
        "marketing.promotions",
        "marketing.promotion",
        "marketing.setCodeEnabled",
        "marketing.setPromotionEnabled",
        "marketing.setPromotionOnlyByCode",
        "marketing.applications",
        "marketing.application",
        "marketing.savePromotion",
        "marketing.saveCode",
        "marketing.catalog",
      ]);
    });

    it("the person with one right sees the section, with only the methods of that right", async () => {
      const codes = await appOf(await login("coder"));
      expect(codes.methods.map((method: any) => method.name)).to.include("marketing.promocodes");
      expect(codes.methods.map((method: any) => method.name)).to.not.include("marketing.promotions");

      const promotions = await appOf(await login("promoter"));
      expect(promotions.methods.map((method: any) => method.name)).to.include("marketing.promotions");
      expect(promotions.methods.map((method: any) => method.name)).to.not.include("marketing.promocodes");
    });

    it("the numbers of the summary are fields by right: what they may not see is not declared", async () => {
      const fieldsOf = async (name: string) => (await appOf(await login(name))).models.summary.fields.map((field: any) => field.name);

      expect(await fieldsOf("marketer")).to.deep.equal([
        "codesTotal", "codesActive", "promotionsTotal", "promotionsSelf", "promotionsByCodeOnly",
        "applications", "totalDiscount", "avgDiscount", "capped",
      ]);
      // The codes alone, and no right to read an order: no money either.
      expect(await fieldsOf("coder")).to.deep.equal(["codesTotal", "codesActive"]);
      expect(await fieldsOf("promoter")).to.deep.equal(["promotionsTotal", "promotionsSelf", "promotionsByCodeOnly"]);
      // `access` is the server's own business and never travels.
      const fields = (await appOf(await login("marketer"))).models.summary.fields;
      expect(fields.every((field: any) => field.access === undefined)).to.equal(true);
    });

    it("somebody without either right does not see the section at all, and its methods are forbidden", async () => {
      const token = await login("stock");
      expect((await declarationOf(token)).apps.map((app: any) => app.id)).to.not.include("marketing");
      expect((await call(token, "marketing.home")).body.error.code).to.equal("forbidden");
      expect((await call(token, "marketing.promocodes")).body.error.code).to.equal("forbidden");
    });

    it("a method of the right somebody has not got is forbidden, section or no section", async () => {
      expect((await call(await login("promoter"), "marketing.promocodes")).body.error.code).to.equal("forbidden");
      expect((await call(await login("coder"), "marketing.promotions")).body.error.code).to.equal("forbidden");
      // The applications are read from the orders: the codes alone are not enough.
      expect((await call(await login("coder"), "marketing.applications")).body.error.code).to.equal("forbidden");
    });
  });

  describe("the summary", () => {
    it("counts the codes, the promotions and the money, and links on by right", async () => {
      const answer = await call(await login("marketer"), "marketing.home");
      expect(validItem(answer.body.result), JSON.stringify(validItem.errors)).to.equal(true);
      const item = answer.body.result.item;
      expect(item).to.include({ title: "Маркетинг", codesTotal: 3, codesActive: 2, promotionsTotal: 4, promotionsSelf: 2, promotionsByCodeOnly: 1 });
      expect(item.applications).to.equal(3);
      expect(item._links.map((link: any) => link.open.method)).to.deep.equal([
        "marketing.promocodes",
        "marketing.promotions",
        "marketing.applications",
      ]);
      expect(item._links[0].title).to.equal("Промокоды · 3");
    });

    it("the person who only leads the promotions is told nothing about the codes — no number, no link", async () => {
      const item = (await call(await login("promoter"), "marketing.home")).body.result.item;
      expect(item.codesTotal).to.equal(undefined);
      expect(item.applications).to.equal(undefined);
      expect(item._links.map((link: any) => link.open.method)).to.deep.equal(["marketing.promotions"]);
    });

    it("the days of the chips reach the money", async () => {
      const month = (await call(await login("marketer"), "marketing.home", { days: "30" })).body.result.item;
      const week = (await call(await login("marketer"), "marketing.home", { days: "7" })).body.result.item;
      expect(month.applications).to.equal(3);
      expect(week.applications).to.equal(1);
      expect((await call(await login("marketer"), "marketing.home", { days: "1" })).body.error.code).to.equal("invalid");
    });
  });

  describe("the promo codes", () => {
    it("lists them with the status, whether they act now, and what they give", async () => {
      const answer = await call(await login("coder"), "marketing.promocodes");
      expect(validList(answer.body.result), JSON.stringify(validList.errors)).to.equal(true);
      const { items, counts } = answer.body.result;
      expect(items.map((item: any) => [item.code, item.status, item.worksNow])).to.deep.equal([
        ["LETO10", "active", true],
        ["SOON", "scheduled", false],
        ["DEAD", "active", true],
      ]);
      expect(counts).to.include({ all: 3, active: 2, scheduled: 1 });
      expect(items[0].gives).to.equal("−10% на всю корзину");
      // A code whose every promotion is switched off says so instead of showing a discount.
      expect(items[2].gives).to.equal("все акции кода выключены — код ничего не даёт");
    });

    it("is searched by the code, by the description and by the name of a promotion of it", async () => {
      const token = await login("coder");
      const found = async (q: string) => (await call(token, "marketing.promocodes", { q })).body.result.items.map((item: any) => item.code);
      expect(await found("leto")).to.deep.equal(["LETO10"]);
      expect(await found("Летняя")).to.deep.equal(["LETO10"]);
      expect(await found("позже")).to.deep.equal(["SOON"]);
      expect(await found("ничего такого")).to.deep.equal([]);
    });

    it("the chips filter by the status core computes", async () => {
      const token = await login("coder");
      const chosen = async (status: string) => (await call(token, "marketing.promocodes", { status })).body.result.items.map((item: any) => item.code);
      expect(await chosen("scheduled")).to.deep.equal(["SOON"]);
      expect(await chosen("expired")).to.deep.equal([]);
      expect(await chosen("all")).to.have.length(3);
    });

    it("a card leads on: to where the code was typed, and to its promotions", async () => {
      const item = (await call(await login("marketer"), "marketing.promocode", { id: "code-leto" })).body.result.item;
      expect(item).to.include({ code: "LETO10", period: "с 22.10.2026 по 31.10.2026", schedule: "круглосуточно", promotions: "Летняя скидка" });
      expect(item._links.map((link: any) => [link.open.method, link.open.params])).to.deep.equal([
        ["marketing.applications", { code: "LETO10" }],
        ["marketing.promotions", { code: "LETO10" }],
      ]);
      expect((await call(await login("marketer"), "marketing.promocode", { id: "nobody" })).body.error.code).to.equal("not_found");
    });

    it("the card of somebody who may not read the orders carries no link to the applications", async () => {
      const item = (await call(await login("coder"), "marketing.promocode", { id: "code-leto" })).body.result.item;
      expect(item._links.map((link: any) => link.open.method)).to.deep.equal([]);
    });

    it("switches a code off from a row, and the switch is on the record and in the journal", async () => {
      const token = await login("coder");
      const item = (await call(token, "marketing.promocodes")).body.result.items[0];
      const toggle = item._actions.find((action: any) => action.method === "marketing.setCodeEnabled");
      expect(toggle, JSON.stringify(item._actions)).to.not.equal(undefined);

      const off = await call(token, "marketing.setCodeEnabled", { id: "code-leto", enable: false });
      expect(off.body.result.item).to.include({ enable: false, status: "disabled", worksNow: false });
      expect(fakes.audits.at(-1)).to.include({ method: "marketing.setCodeEnabled", record: "code-leto", ok: true });
      expect(fakes.audits.at(-1)!.params).to.deep.equal({ enable: false });
    });

    it("the toggle is not there for somebody without the right, on a row or on a card", async () => {
      const token = await login("promoter");
      expect((await call(token, "marketing.setCodeEnabled", { id: "code-leto", enable: false })).body.error.code).to.equal("forbidden");
      const app = await appOf(token);
      expect(app.methods.map((method: any) => method.name)).to.not.include("marketing.setCodeEnabled");
    });

    it("a new code is a form whose promotions are the server's own, and a taken code is refused", async () => {
      const token = await login("coder");
      const app = await appOf(token);
      const form = app.methods.find((method: any) => method.name === "marketing.saveCode");
      expect(form.ui.control).to.deep.equal({ type: "form" });
      expect(form.input.properties.promotionId.enum).to.deep.equal(["pr-summer", "pr-happy", "pr-gift"]);
      expect(form.input.properties.promotionId["x-titles"]["pr-summer"]).to.equal("Летняя скидка");

      const made = await call(token, "marketing.saveCode", { code: "osen20", description: "Осень", promotionId: "pr-summer" });
      expect(made.body.result.item).to.include({ code: "OSEN20", description: "Осень" });
      expect(made.body.result.item.promotionsCount).to.equal(1);

      const again = await call(token, "marketing.saveCode", { code: "OSEN20", description: "Второй раз" });
      expect(again.status).to.equal(409);
      expect(again.body.error).to.include({ code: "conflict" });
      expect(again.body.error.message).to.equal("Такой промокод уже есть");
    });
  });

  describe("the promotions", () => {
    it("says where each of them stands, in one word", async () => {
      const { items, counts } = (await call(await login("promoter"), "marketing.promotions")).body.result;
      expect(items.map((item: any) => [item.name, item.appliesNow])).to.deep.equal([
        ["Летняя скидка", "code-only"],
        ["Счастливые часы", "self"],
        ["Подарок к заказу", "self"],
        ["Старая акция", "disabled"],
      ]);
      expect(counts).to.deep.equal({ all: 4, self: 2, "code-only": 1, off: 1, configured: 3 });
    });

    it("a percentage and a flat amount are different fields: neither is read as the other", async () => {
      const items = (await call(await login("promoter"), "marketing.promotions")).body.result.items;
      const percentage = items.find((item: any) => item.id === "pr-summer");
      const flat = items.find((item: any) => item.id === "pr-happy");
      expect(percentage).to.include({ discountType: "percentage", discountPercent: 10 });
      expect(percentage.discountFlat).to.equal(undefined);
      expect(flat).to.include({ discountType: "flat", discountFlat: 150 });
      expect(flat.discountPercent).to.equal(undefined);

      const app = await appOf(await login("promoter"));
      const fields = app.models.promotion.fields;
      expect(fields.find((field: any) => field.name === "discountPercent").format).to.equal("percent");
      expect(fields.find((field: any) => field.name === "discountFlat").format).to.equal("money");
    });

    it("the chips filter by where it stands and by who wrote it", async () => {
      const token = await login("promoter");
      const chosen = async (filter: string) => (await call(token, "marketing.promotions", { filter })).body.result.items.map((item: any) => item.id);
      expect(await chosen("code-only")).to.deep.equal(["pr-summer"]);
      expect(await chosen("off")).to.deep.equal(["pr-off"]);
      expect(await chosen("configured")).to.deep.equal(["pr-summer", "pr-happy", "pr-gift"]);
    });

    it("the promotions of one code, where the card of a code leads", async () => {
      const items = (await call(await login("promoter"), "marketing.promotions", { code: "LETO10" })).body.result.items;
      expect(items.map((item: any) => item.id)).to.deep.equal(["pr-summer"]);
    });

    it("both switches work, and «только по коду» is not offered for a promotion that is off", async () => {
      const token = await login("promoter");
      const off = await call(token, "marketing.setPromotionEnabled", { id: "pr-happy", enable: false });
      expect(off.body.result.item).to.include({ enable: false, appliesNow: "disabled" });
      // A switched-off promotion applies nowhere: there is nothing to say about "by itself" any more.
      expect(off.body.result.item._actions.map((action: any) => action.method)).to.not.include("marketing.setPromotionOnlyByCode");

      await call(token, "marketing.setPromotionEnabled", { id: "pr-happy", enable: true });
      const byCode = await call(token, "marketing.setPromotionOnlyByCode", { id: "pr-happy", onlyByCode: true });
      expect(byCode.body.result.item).to.include({ enable: true, onlyByCode: true, appliesNow: "code-only" });
      expect(fakes.audits.at(-1)).to.include({ method: "marketing.setPromotionOnlyByCode", record: "pr-happy" });
    });

    it("a card leads to the codes the promotion works through", async () => {
      const item = (await call(await login("promoter"), "marketing.promotion", { id: "pr-summer" })).body.result.item;
      expect(item.promotionCodes).to.equal("LETO10");
      // The codes are the other right: this person has not got it, so there is no link.
      expect(item._links).to.deep.equal([]);

      const asMarketer = (await call(await login("marketer"), "marketing.promotion", { id: "pr-summer" })).body.result.item;
      expect(asMarketer._links.map((link: any) => [link.open.method, link.meta])).to.deep.equal([["marketing.promocodes", "LETO10"]]);
    });
  });

  describe("the editor of a promotion", () => {
    it("is an action the client draws itself, and not on a promotion a module wrote", async () => {
      const token = await login("promoter");
      const app = await appOf(token);
      const editor = app.methods.find((method: any) => method.name === "marketing.savePromotion");
      expect(editor.ui.control).to.deep.equal({ type: "native", screen: "promotion-editor" });

      const configured = (await call(token, "marketing.promotion", { id: "pr-summer" })).body.result.item;
      expect(configured._actions.map((action: any) => action.method)).to.include("marketing.savePromotion");
      const programmed = (await call(token, "marketing.promotion", { id: "pr-off" })).body.result.item;
      expect(programmed._actions.map((action: any) => action.method)).to.not.include("marketing.savePromotion");
    });

    it("saves the whole promotion, and refuses what core refuses", async () => {
      const token = await login("promoter");
      const saved = await call(token, "marketing.savePromotion", {
        name: "Осенняя",
        description: "−15% на всё",
        enable: true,
        onlyByCode: true,
        isJoint: true,
        configDiscount: { discountType: "percentage", discountAmount: 15, dishes: ["d1"], groups: [], serviceType: ["delivery"], minBasketTotal: 500 },
      });
      expect(saved.body.result.item).to.include({ name: "Осенняя", appliesNow: "code-only", discountPercent: 15 });
      expect(fakes.marketing.saved.at(-1)!.configDiscount.serviceType).to.deep.equal(["delivery"]);

      const forSale = await call(token, "marketing.savePromotion", {
        name: "Подарок",
        description: "Подарок к заказу",
        configDiscount: { gift: { minBasketTotal: 1000, dishes: [{ dishId: "d1", amount: 1 }] } },
      });
      expect(forSale.status).to.equal(400);
      expect(forSale.body.error.message).to.contain("notForSale");

      const gift = await call(token, "marketing.savePromotion", {
        name: "Подарок",
        description: "Подарок к заказу",
        configDiscount: { gift: { minBasketTotal: 1000, dishes: [{ dishId: "magnet", amount: 2 }] } },
      });
      expect(gift.body.result.item.gift).to.equal("Подарок: 2 шт.");

      const programmed = await call(token, "marketing.savePromotion", { id: "pr-off", name: "Старая акция", description: "нет" });
      expect(programmed.status).to.equal(403);
    });

    it("refuses what the schema refuses: a percentage over a hundred has no business reaching core", async () => {
      const token = await login("promoter");
      const broken = await call(token, "marketing.savePromotion", { name: "Х", description: "Х", configDiscount: { discountAmount: -5 } });
      expect(broken.status).to.equal(400);
      expect(broken.body.error.code).to.equal("invalid");
    });

    it("gives the editor the catalog it chooses products in", async () => {
      const token = await login("promoter");
      const catalog = (await call(token, "marketing.catalog")).body.result;
      expect(catalog.groups.map((group: any) => group.id)).to.deep.equal(["g1"]);
      expect(catalog.items.map((item: any) => item.id)).to.deep.equal(["d1", "d2", "magnet"]);
      const found = (await call(token, "marketing.catalog", { q: "плов" })).body.result;
      expect(found.items.map((item: any) => item.id)).to.deep.equal(["d2"]);
      // A gift product must be one the guest cannot add himself: the editor can see which.
      expect(catalog.items.find((item: any) => item.id === "magnet")).to.include({ notForSale: true });
    });
  });

  describe("the applications", () => {
    it("tells where a code was typed and why it gave nothing", async () => {
      const answer = await call(await login("marketer"), "marketing.applications");
      expect(validList(answer.body.result), JSON.stringify(validList.errors)).to.equal(true);
      const { items, counts } = answer.body.result;
      expect(items.map((item: any) => [item.title, item.code, item.status])).to.deep.equal([
        ["№1001", "LETO10", "applied"],
        ["№1002", "LETO10", "invalid"],
        ["№1003", "DEAD", "invalid"],
      ]);
      expect(counts).to.deep.equal({ all: 3, applied: 1, invalid: 2 });
      expect(items[1].why).to.equal("корзина меньше 1 449 ₽");
      expect(items[0].discount).to.equal(111.3);
    });

    it("the applications of one code, and the chips of the outcome", async () => {
      const token = await login("marketer");
      const ofCode = (await call(token, "marketing.applications", { code: "DEAD" })).body.result.items;
      expect(ofCode.map((item: any) => item.title)).to.deep.equal(["№1003"]);
      const invalid = (await call(token, "marketing.applications", { status: "invalid" })).body.result.items;
      expect(invalid).to.have.length(2);
    });

    it("a card shows the promo part of the order, and links to the order only where that can open", async () => {
      const item = (await call(await login("marketer"), "marketing.application", { id: "o-2" })).body.result.item;
      expect(item).to.include({ title: "№1002", code: "LETO10", status: "invalid", why: "корзина меньше 1 449 ₽" });
      // «Клиенты» have no card of an order yet (`client-lookup.plan.md`), so no link pretends they have.
      expect(item._links.map((link: any) => link.open.method)).to.deep.equal(["marketing.promocodes"]);
      expect((await call(await login("marketer"), "marketing.application", { id: "nobody" })).body.error.code).to.equal("not_found");
    });
  });
});
