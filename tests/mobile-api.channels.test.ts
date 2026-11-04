import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Каналы продаж» through the mobile API: the Sales Channels page of the admin panel on the phone
 * (`sales-channels.plan.md`), with the rights of the page itself — `sales-channels-view` opens it,
 * `sales-channels-manage` adds the actions, and the legacy `sales-channels-manager` is both (Q52).
 *
 * What is checked here above all is **the words**: every refusal a person can meet has to arrive as a
 * sentence in their language, not as "409". The sentences are core's own (`refusalText` over the
 * dictionary of the admin panel, C31), so the page and the phone say the same thing.
 *
 * Users: `channeler` (both rights), `channelview` (read-only), `channellegacy` (the legacy token),
 * `stock` (nothing of the channels at all).
 */
describe("app-mobile-api: «Каналы продаж»", function () {
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
  const declarationOf = async (token: string, lang = "ru") => (await request("GET", `/api/mobile/describe?lang=${lang}`, { token })).body.result;
  const appOf = async (token: string, lang = "ru") => (await declarationOf(token, lang)).apps.find((app: any) => app.id === "channels");
  const rowOf = (body: any, id: string) => body.result.items.find((item: any) => item.id === id);
  const actionsOf = (record: any) => (record._actions ?? []).map((action: any) => action.method);
  /** The rows that are channels: the last one of the whole list is the way to the catalog of types. */
  const keysOf = (body: any) => body.result.items.filter((item: any) => item.key).map((item: any) => item.key);
  const linesOf = (record: any) => (record._links ?? []).map((line: any) => [line.title, line.open]);

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("the app and its two levels of right", () => {
    it("opens for the view right, and the declaration matches the contract", async () => {
      const declaration = await declarationOf(await login("channeler"));
      expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      const channels = declaration.apps.find((app: any) => app.id === "channels");
      expect(channels).to.include({ title: "Каналы продаж", home: "channels.list", scope: "server", category: "Система" });
      expect(channels.methods.map((method: any) => method.name)).to.have.members([
        "channels.list",
        "channels.get",
        "channels.toggle",
        "channels.delete",
        "channels.types",
        "channels.type",
      ]);
    });

    it("the legacy token is full access, and read-only is read-only", async () => {
      const legacy = await appOf(await login("channellegacy"));
      expect(legacy.methods.map((method: any) => method.name)).to.include.members(["channels.toggle", "channels.delete"]);

      const viewer = await appOf(await login("channelview"));
      expect(viewer.methods.map((method: any) => method.name)).to.deep.equal(["channels.list", "channels.get", "channels.types", "channels.type"]);
    });

    it("without either right there is no app and no method, even by name", async () => {
      const token = await login("stock");
      expect((await declarationOf(token)).apps.map((app: any) => app.id)).to.not.include("channels");
      expect((await call(token, "channels.list")).status).to.equal(403);
      expect((await call(token, "channels.toggle", { id: "ch-web", enabled: false })).status).to.equal(403);
    });

    it("a reader is offered no action at all, and no page of a provider to go to", async () => {
      const list = await call(await login("channelview"), "channels.list");
      expect(list.status).to.equal(200);
      for (const item of list.body.result.items.filter((row: any) => row.key)) {
        expect(actionsOf(item), `${item.key} offers actions to a reader`).to.deep.equal([]);
        expect(item.settingsUrl, `${item.key} shows a reader the provider's settings`).to.equal(null);
      }
      // Not even as a word anywhere in the answer: the address of an admin page is not for a reader.
      expect(JSON.stringify(list.body)).to.not.contain("/admin/");

      const card = await call(await login("channelview"), "channels.get", { id: "ch-web" });
      expect(card.body.result.item.settingsUrl).to.equal(null);
      expect(actionsOf(card.body.result.item)).to.deep.equal([]);

      // A manager gets both: the actions of the row and the page of the provider.
      const managed = await call(await login("channeler"), "channels.get", { id: "ch-web" });
      expect(managed.body.result.item.settingsUrl).to.equal("/admin/frontend/setup?channel=ch-web");
      expect(actionsOf(managed.body.result.item)).to.include("channels.toggle");
    });

    it("the record carries no settings of a provider and never its secrets", async () => {
      const token = await login("channeler");
      const list = await call(token, "channels.list");
      const card = await call(token, "channels.get", { id: "ch-web" });
      const toggled = await call(token, "channels.toggle", { id: "ch-web", enabled: false });

      for (const body of [list.body, card.body, toggled.body]) {
        const text = JSON.stringify(body);
        expect(text).to.not.contain("secretsRef");
        expect(text).to.not.contain("vault://");
        expect(text).to.not.contain("settings\":{");
      }
      // And nothing of it reaches the journal either.
      expect(JSON.stringify(fakes.audits)).to.not.contain("vault://");
    });
  });

  describe("the list: the channels of the server, and why they do or do not work", () => {
    it("shows every channel in its own order, with the status and the reason as words", async () => {
      const list = await call(await login("channeler"), "channels.list");
      expect(validList(list.body.result), JSON.stringify(validList.errors)).to.equal(true);
      expect(keysOf(list.body)).to.deep.equal(["web-main", "tg-main", "kiosk-hall", "shop-bot", "old-site"]);

      const web = rowOf(list.body, "ch-web");
      expect(web).to.include({ title: "Основной сайт", subtitle: "web-main · Website", status: "ready" });
      expect(web.providerText).to.equal("admin-frontend · Модуль установлен");
      expect(web.conceptsText).to.equal("Все концепции");
      expect(web.platformsText).to.equal("web · pwa-ios");

      // A bot whose provider is alive but not set up: what the provider said, in the request's language.
      const bot = rowOf(list.body, "ch-tg");
      expect(bot.status).to.equal("needs_setup");
      expect(bot.providerText).to.equal("sales-channel-telegram · Модуль установлен");
      expect(bot.statusMessage).to.equal("Bot token is not set");

      // A channel without a live provider says nothing of its own: the reason is the notice, once.
      expect(rowOf(list.body, "ch-kiosk").statusMessage).to.equal(undefined);
      expect(rowOf(list.body, "ch-kiosk").url).to.equal(undefined);

      // A provider module that is not installed: the channel is in error, and the appId is named.
      const kiosk = rowOf(list.body, "ch-kiosk");
      expect(kiosk.status).to.equal("error");
      expect(kiosk.providerText).to.equal("Не работает: провайдер не установлен (sales-channel-kiosk)");

      // A type that has no provider at all yet.
      expect(rowOf(list.body, "ch-old").providerText).to.equal("Тип канала скоро появится");
    });

    it("the badge names the five states in the language of the request", async () => {
      const app = await appOf(await login("channeler"));
      const status = app.models.channel.fields.find((field: any) => field.name === "status");
      expect(status.specials).to.deep.equal([
        { value: "ready", title: "Работает", tone: "success" },
        { value: "needs_setup", title: "Требует настройки", tone: "warning" },
        { value: "draft", title: "Черновик", tone: "info" },
        { value: "disabled", title: "Выключен", tone: "info" },
        { value: "error", title: "Ошибка", tone: "danger" },
      ]);

      const english = await appOf(await login("channeler"), "en");
      expect(english.models.channel.fields.find((field: any) => field.name === "status").specials[0].title).to.equal("Working");
    });

    it("searches by title, key and type, and counts the chips of the states", async () => {
      const token = await login("channeler");
      expect((await call(token, "channels.list", { q: "Бот" })).body.result.items.map((item: any) => item.key)).to.deep.equal(["tg-main", "shop-bot"]);
      expect((await call(token, "channels.list", { q: "web-main" })).body.result.items.map((item: any) => item.key)).to.deep.equal(["web-main"]);
      expect((await call(token, "channels.list", { q: "kiosk" })).body.result.items.map((item: any) => item.key)).to.deep.equal(["kiosk-hall"]);

      const all = await call(token, "channels.list");
      expect(all.body.result.counts).to.deep.equal({ all: 5, active: 1, off: 4, needs_setup: 1, error: 2 });
      expect((await call(token, "channels.list", { state: "active" })).body.result.items.map((item: any) => item.key)).to.deep.equal(["web-main"]);
      expect((await call(token, "channels.list", { state: "error" })).body.result.items.map((item: any) => item.key)).to.deep.equal(["kiosk-hall", "old-site"]);
    });

    it("the list is not polled: it declares no `since`, so no provider is asked every ten seconds", async () => {
      const app = await appOf(await login("channeler"));
      const list = app.methods.find((method: any) => method.name === "channels.list");
      expect(Object.keys(list.input.properties)).to.not.include("since");
    });

    it("a card is one channel, with the sections of the page", async () => {
      const card = await call(await login("channeler"), "channels.get", { id: "ch-tg" });
      expect(validItem(card.body.result), JSON.stringify(validItem.errors)).to.equal(true);
      expect(card.body.result.item).to.include({ title: "Бот доставки", subtitle: "tg-main · Telegram bot", statusMessage: "Bot token is not set" });

      const fields = (await appOf(await login("channeler"))).models.channel.fields;
      expect(fields.map((field: any) => field.name)).to.deep.equal([
        "status", "statusMessage", "providerText", "providerHint", "enabledText",
        "conceptsText", "countriesText", "platformsText",
        "typeTitle", "category", "capabilitiesText", "url", "updatedAt",
      ]);
      expect(fields.find((field: any) => field.name === "providerText").title).to.equal("Провайдер");
      expect(fields.find((field: any) => field.name === "conceptsText").section).to.equal("Привязка концепций");
    });

    it("a channel that is not there is not found", async () => {
      const answer = await call(await login("channeler"), "channels.get", { id: "no-such" });
      expect(answer.status).to.equal(404);
      expect(answer.body.error.code).to.equal("not_found");
    });
  });

  describe("the switch, and every refusal in words", () => {
    it("switches a working channel off and on again", async () => {
      const token = await login("channeler");
      const off = await call(token, "channels.toggle", { id: "ch-web", enabled: false });
      expect(off.status).to.equal(200);
      expect(off.body.result.item).to.include({ enabled: false, enabledText: false });

      const on = await call(token, "channels.toggle", { id: "ch-web", enabled: true });
      expect(on.body.result.item).to.include({ enabled: true, enabledText: true });
      // The journal keeps what was done, by whom, to what.
      const written = fakes.audits.filter((event) => event.method === "channels.toggle");
      expect(written.map((event) => event.params)).to.deep.equal([{ enabled: false }, { enabled: true }]);
      expect(written.every((event) => event.record === "ch-web" && event.ok)).to.equal(true);
    });

    it("refuses to switch on a channel whose provider says it is not set up, and says what the provider said", async () => {
      const answer = await call(await login("channeler"), "channels.toggle", { id: "ch-tg", enabled: true });
      expect(answer.status).to.equal(409);
      expect(answer.body.error.code).to.equal("conflict");
      expect(answer.body.error.message).to.equal("Сначала настройте канал — Bot token is not set");
      // Where to go next travels with the refusal, not in the sentence.
      expect(answer.body.error.details).to.deep.equal({
        settingsUrl: "/admin/telegram/setup?channel=ch-tg",
        providerMessage: "Bot token is not set",
      });
      // Refused means refused: the switch did not move.
      expect((await call(await login("channeler"), "channels.get", { id: "ch-tg" })).body.result.item.enabled).to.equal(false);
    });

    it("a channel whose provider is not installed is not even offered the switch", async () => {
      const token = await login("channeler");
      const list = await call(token, "channels.list");
      expect(actionsOf(rowOf(list.body, "ch-kiosk"))).to.deep.equal(["channels.delete"]);
      expect(actionsOf(rowOf(list.body, "ch-web"))).to.include("channels.toggle");

      // And if it is called anyway, the refusal names the module to install.
      const answer = await call(token, "channels.toggle", { id: "ch-kiosk", enabled: true });
      expect(answer.status).to.equal(409);
      expect(answer.body.error.message).to.equal("Сначала установите модуль-провайдер");
      expect(answer.body.error.details).to.deep.equal({ marketplaceAppId: "sales-channel-kiosk" });
    });

    it("English is English: the same refusal in the other language", async () => {
      const token = await login("channeler");
      const answer = await request("POST", "/api/mobile/call/channels.toggle", { token, body: { params: { id: "ch-tg", enabled: true } } });
      expect(answer.body.error.message).to.equal("Сначала настройте канал — Bot token is not set");

      // The language travels with the request — `describe?lang=en` and the header of the call.
      const english = await fetch(`${server.url}/api/mobile/call/channels.toggle`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${token}`, "accept-language": "en" },
        body: JSON.stringify({ params: { id: "ch-tg", enabled: true } }),
      });
      expect((await english.json()).error.message).to.equal("Finish setup first — Bot token is not set");
    });
  });

  describe("deleting, with the question asked first", () => {
    it("asks before deleting, in the words of the page", async () => {
      const app = await appOf(await login("channeler"));
      const remove = app.methods.find((method: any) => method.name === "channels.delete");
      expect(remove.ui.confirm).to.equal("Удалить канал? Существующие заказы сохранят источник для отчётов.");
      expect(remove.ui.control).to.deep.equal({ type: "buttons" });
      expect(remove.ui.placement).to.deep.equal(["detail"]);
    });

    it("deletes an operator's channel and keeps the key in the journal", async () => {
      const token = await login("channeler");
      const answer = await call(token, "channels.delete", { id: "ch-old" });
      expect(answer.status).to.equal(200);
      expect(fakes.channels.removed).to.deep.equal(["old-site"]);
      expect((await call(token, "channels.list")).body.result.items.map((item: any) => item.key)).to.not.include("old-site");

      const written = fakes.audits.filter((event) => event.method === "channels.delete");
      expect(written).to.have.length(1);
      expect(written[0]).to.include({ record: "ch-old", ok: true });
      expect(written[0].params).to.deep.equal({ id: "ch-old", key: "old-site" });
    });

    it("refuses to delete a channel of an installed provider — and does not offer it at all", async () => {
      const token = await login("channeler");
      const list = await call(token, "channels.list");
      expect(actionsOf(rowOf(list.body, "ch-shop"))).to.not.include("channels.delete");

      const answer = await call(token, "channels.delete", { id: "ch-shop" });
      expect(answer.status).to.equal(409);
      expect(answer.body.error.message).to.equal("Канал принадлежит установленному модулю-провайдеру: его можно только выключить");
      expect((await call(token, "channels.list")).body.result.items.map((item: any) => item.key)).to.include("shop-bot");
    });

    it("a reader cannot delete and cannot switch, whatever they call", async () => {
      const token = await login("channelview");
      expect((await call(token, "channels.delete", { id: "ch-old" })).status).to.equal(403);
      expect((await call(token, "channels.toggle", { id: "ch-web", enabled: false })).status).to.equal(403);
      expect(fakes.channels.removed).to.deep.equal([]);
    });
  });

  describe("the lines of a card: where the next step of this channel happens", () => {
    it("the page's «Настройки» for a working channel, «Настроить» for one that is not, and «Открыть»", async () => {
      const token = await login("channeler");
      const web = (await call(token, "channels.get", { id: "ch-web" })).body;
      expect(validItem(web.result), JSON.stringify(validItem.errors)).to.equal(true);
      expect(linesOf(web.result.item)).to.deep.equal([
        ["Настройки", { url: "/admin/frontend/setup?channel=ch-web" }],
        ["Открыть", { url: "https://example.org" }],
      ]);

      const bot = (await call(token, "channels.get", { id: "ch-tg" })).body;
      expect(linesOf(bot.result.item)).to.deep.equal([["Настроить", { url: "/admin/telegram/setup?channel=ch-tg" }]]);
    });

    it("a reader may open the channel and not the page of its provider", async () => {
      const card = (await call(await login("channelview"), "channels.get", { id: "ch-web" })).body;
      expect(linesOf(card.result.item)).to.deep.equal([["Открыть", { url: "https://example.org" }]]);
    });

    it("a switched channel keeps its lines, and they follow its state", async () => {
      const token = await login("channeler");
      const off = (await call(token, "channels.toggle", { id: "ch-web", enabled: false })).body;
      expect(linesOf(off.result.item).map(([title]: string[]) => title)).to.deep.equal(["Настройки", "Открыть"]);
    });

    it("an address a phone cannot open is not a line", async () => {
      fakes.channels.rows.find((row) => row.id === "ch-web")!.url = "example.org";
      const card = (await call(await login("channeler"), "channels.get", { id: "ch-web" })).body;
      expect(linesOf(card.result.item).map(([title]: string[]) => title)).to.deep.equal(["Настройки"]);
      // The address itself is still shown, as it was written.
      expect(card.result.item.url).to.equal("example.org");
    });

    it("says what to do about a provider that is not installed", async () => {
      const card = (await call(await login("admin"), "channels.get", { id: "ch-kiosk" })).body;
      expect(card.result.item.providerHint).to.equal("Установите модуль-провайдер, чтобы канал заработал.");
      // A type coming soon has nothing to install, so nothing to say about it.
      const old = (await call(await login("admin"), "channels.get", { id: "ch-old" })).body;
      expect(old.result.item.providerHint).to.equal(undefined);
    });

    it("«Установить провайдера» leads to the catalog of «Система», for whoever may install", async () => {
      const card = (await call(await login("channelinstall"), "channels.get", { id: "ch-kiosk" })).body;
      expect(validItem(card.result), JSON.stringify(validItem.errors)).to.equal(true);
      expect(linesOf(card.result.item)).to.deep.equal([
        ["Установить провайдера", { app: "system", method: "system.catalog", params: { appId: "sales-channel-kiosk" } }],
      ]);

      // The catalog is not theirs and neither is installing: the same rule as the page's button.
      const manager = (await call(await login("channeler"), "channels.get", { id: "ch-kiosk" })).body;
      expect(linesOf(manager.result.item)).to.deep.equal([]);
    });

    it("the last row of the whole list leads to the catalog of types, and it is not a channel", async () => {
      const token = await login("channeler");
      const list = (await call(token, "channels.list")).body;
      expect(validList(list.result), JSON.stringify(validList.errors)).to.equal(true);
      const last = list.result.items[list.result.items.length - 1];
      expect(last).to.include({ id: "channel-types", title: "Типы каналов", subtitle: "Что можно подключить" });
      expect(last._open).to.deep.equal({ method: "channels.types" });
      expect(actionsOf(last)).to.deep.equal([]);
      // Neither the counts of the chips nor the total know about it.
      expect(list.result.counts.all).to.equal(5);
      expect(list.result.total).to.equal(5);
    });

    it("that row is not under a filter or a search: an empty answer stays empty", async () => {
      const token = await login("channeler");
      expect((await call(token, "channels.list", { q: "нет такого" })).body.result.items).to.deep.equal([]);
      const active = (await call(token, "channels.list", { state: "active" })).body.result.items;
      expect(active.map((item: any) => item.id)).to.deep.equal(["ch-web"]);
    });

    it("with no channel at all it says where they come from", async () => {
      fakes.channels.rows = [];
      const items = (await call(await login("channeler"), "channels.list")).body.result.items;
      expect(items.map((item: any) => item.id)).to.deep.equal(["channel-types"]);
      expect(items[0].subtitle).to.contain("модуль-провайдер");
    });
  });

  describe("the catalog of types", () => {
    const { SalesChannelRegistry } = require("@webresto/core/lib/SalesChannelRegistry");

    it("opens on what is recommended for the country of the project, without what is already here", async () => {
      const token = await login("channeler");
      const list = (await call(token, "channels.types")).body;
      expect(validList(list.result), JSON.stringify(validList.errors)).to.equal(true);
      const present = fakes.channels.rows.map((row) => row.type);
      const expected = SalesChannelRegistry.recommendForCountry("RU").filter((type: string) => !present.includes(type));
      expect(expected).to.not.deep.equal([]);
      expect(list.result.items.map((item: any) => item.id)).to.deep.equal(expected);
      expect(list.result.counts).to.deep.equal({ recommended: expected.length, all: 14 });
    });

    it("another country recommends another thing", async () => {
      const token = await login("channeler");
      const russian = (await call(token, "channels.types")).body.result.items.map((item: any) => item.id);
      fakes.channels.country = "TH";
      const thai = (await call(token, "channels.types")).body.result.items.map((item: any) => item.id);
      expect(thai).to.include("line-oa");
      expect(thai).to.not.deep.equal(russian);
    });

    it("«Все» is all fourteen, and the chips are declared with their words", async () => {
      const token = await login("channeler");
      const all = (await call(token, "channels.types", { kind: "all" })).body.result;
      expect(all.items.length).to.equal(14);
      const method = (await appOf(token)).methods.find((candidate: any) => candidate.name === "channels.types");
      expect(method.ui).to.include({ chips: "kind", open: "channels.type" });
      expect(method.input.properties.kind["x-titles"]).to.deep.equal({ recommended: "Рекомендуем", all: "Все" });
      expect(method.input.properties.kind.default).to.equal("recommended");
    });

    it("a type coming soon says so by its badge alone; one that exists says where its provider stands", async () => {
      const token = await login("channeler");
      const rows = (await call(token, "channels.types", { kind: "all" })).body.result.items;
      const bot = rows.find((row: any) => row.id === "telegram-bot");
      expect(bot.availability).to.equal("coming_soon");
      expect(bot.stateText).to.equal(undefined);
      expect(rows.find((row: any) => row.id === "web-storefront").stateText).to.equal("Модуль установлен");

      fakes.channels.installedModules = new Set();
      const missing = (await call(token, "channels.type", { id: "web-storefront" })).body.result.item;
      expect(missing.stateText).to.equal("Модуль не установлен");

      fakes.channels.installedModules = new Set(["admin-frontend"]);
      fakes.channels.aliveTypes = new Set();
      const stale = (await call(token, "channels.type", { id: "web-storefront" })).body.result.item;
      expect(stale.stateText).to.contain("перезапустите");
    });

    it("the card of a type carries its category, its abilities and its provider", async () => {
      const card = (await call(await login("channeler"), "channels.type", { id: "telegram-bot" })).body;
      expect(validItem(card.result), JSON.stringify(validItem.errors)).to.equal(true);
      expect(card.result.item).to.include({ title: "Telegram bot", category: "messenger", providerText: "sales-channel-telegram", countriesText: "RU · BY · KZ" });
      expect(card.result.item.capabilitiesText).to.contain("orders:create");
    });

    it("a reader sees the type and not its module, and has no line to follow", async () => {
      const card = (await call(await login("channelview"), "channels.type", { id: "web-storefront" })).body.result.item;
      expect(card.providerText).to.equal(undefined);
      expect(card.settingsUrl).to.equal(null);
      expect(linesOf(card)).to.deep.equal([]);
    });

    it("without the right to the catalog there is no line into it; a type with a live provider leads to its settings", async () => {
      const token = await login("channeler");
      expect(linesOf((await call(token, "channels.type", { id: "telegram-bot" })).body.result.item)).to.deep.equal([]);
      const rows = (await call(token, "channels.types", { kind: "all" })).body.result.items;
      expect(rows.map((row: any) => row.id)).to.not.include("marketplace");
      expect(linesOf((await call(token, "channels.type", { id: "web-storefront" })).body.result.item)).to.deep.equal([
        ["Настройки", { url: "/admin/frontend/setup" }],
      ]);
    });

    it("a search by the tag of the type, and an install by the right to install", async () => {
      const installer = await login("channelinstall");
      expect(linesOf((await call(installer, "channels.type", { id: "telegram-bot" })).body.result.item)).to.deep.equal([
        ["Искать в маркетплейсе", { app: "system", method: "system.catalog", params: { tags: "sales-channel:telegram-bot" } }],
      ]);
      // `custom` has no provider by design, so there is nothing to search for.
      expect(linesOf((await call(installer, "channels.type", { id: "custom" })).body.result.item)).to.deep.equal([]);

      fakes.channels.installedModules = new Set();
      expect(linesOf((await call(installer, "channels.type", { id: "web-storefront" })).body.result.item)).to.deep.equal([
        ["Установить из маркетплейса", { app: "system", method: "system.catalog", params: { appId: "admin-frontend" } }],
      ]);
      const manager = await login("channeler");
      expect(linesOf((await call(manager, "channels.type", { id: "web-storefront" })).body.result.item)).to.deep.equal([]);
    });

    it("«Все каналы продаж в маркетплейсе» is the last row, for whoever may install", async () => {
      const rows = (await call(await login("channelinstall"), "channels.types")).body.result;
      expect(validList(rows), JSON.stringify(validList.errors)).to.equal(true);
      const last = rows.items[rows.items.length - 1];
      expect(last).to.include({ id: "marketplace", title: "Все каналы продаж в маркетплейсе" });
      expect(last._open).to.deep.equal({ app: "system", method: "system.catalog", params: { tags: "sales-channel" } });
      expect(rows.total).to.equal(rows.counts.recommended);

      const manager = await login("channeler");
      expect((await call(manager, "channels.types")).body.result.items.map((row: any) => row.id)).to.not.include("marketplace");
    });

    it("what a line sends, the catalog of «Система» takes: the tag of a type, every channel, one module", async () => {
      const row = (id: string, tags: string) => ({ id, appId: id, name: id, teaser: "", description: "", author: "", tags, latestVersion: "1.0.0", block: null });
      fakes.system.marketplace = [
        row("bot-telegram", "sales-channel, sales-channel:telegram-bot"),
        row("sales-channel-kiosk", "sales-channel, sales-channel:kiosk"),
        row("stand-hello", "demo, greeting"),
      ];
      const token = await login("channelinstall");
      const follow = async (open: any) => {
        const response = await call(token, open.method, open.params);
        expect(response.status, JSON.stringify(response.body)).to.equal(200);
        return response.body.result.items.map((item: any) => item.id);
      };

      const [[, search]] = linesOf((await call(token, "channels.type", { id: "telegram-bot" })).body.result.item);
      expect(await follow(search)).to.deep.equal(["bot-telegram"]);

      const types = (await call(token, "channels.types")).body.result.items;
      expect(await follow(types[types.length - 1]._open)).to.deep.equal(["bot-telegram", "sales-channel-kiosk"]);

      const [[, install]] = linesOf((await call(token, "channels.get", { id: "ch-kiosk" })).body.result.item);
      expect(await follow(install)).to.deep.equal(["sales-channel-kiosk"]);
    });

    it("a type that does not exist is not found, in words", async () => {
      const response = await call(await login("channeler"), "channels.type", { id: "no-such-type" });
      expect(response.status).to.equal(404);
      expect(response.body.error.code).to.equal("not_found");
    });

    it("the contract: `open` is a method or an address, and an address is http(s) or a path", () => {
      const ajv = new Ajv({ strict: false, allErrors: true });
      ajv.addSchema(contract);
      const validOpen = ajv.getSchema(`${contract.$id}#/definitions/open`)!;
      expect(validOpen({ method: "channels.types" })).to.equal(true);
      expect(validOpen({ url: "/admin/frontend/setup?channel=1" })).to.equal(true);
      expect(validOpen({ url: "https://example.org" })).to.equal(true);
      expect(validOpen({})).to.equal(false);
      expect(validOpen({ method: "channels.types", url: "/admin" })).to.equal(false);
      expect(validOpen({ url: "javascript:alert(1)" })).to.equal(false);
      expect(validOpen({ url: "example.org" })).to.equal(false);
    });
  });
});
