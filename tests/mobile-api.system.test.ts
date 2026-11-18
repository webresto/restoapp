import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Система» through the mobile API: the central place of an administrator — which server this is,
 * what it is built of, what was installed into it, and the doors into «Настройки» and «Каналы
 * продаж» (`system.plan.md`, slice A).
 *
 * The rights are the real ones of adminizer: `modules-process-upgrade` is the right of the
 * "Extensions" page, and the home screen opens to anybody who holds any one of the three places it
 * leads to (Q58). Users: `admin` (everything), `sysop` (the modules alone), `settler` (the settings
 * alone), `stock` (a stock manager: in the panel, and none of the three).
 *
 * Installing, updating, removing, the switch and the wizard are the slices after this one: what is
 * not there is not declared, and the test says so — a client cannot draw a button for a method the
 * declaration does not carry.
 */
describe("app-mobile-api: «Система»", function () {
  this.timeout(30000);

  let fakes: Fakes;
  let server: { url: string; close(): Promise<void> };

  const validator = (definition: string) => {
    const ajv = new Ajv({ strict: false, allErrors: true });
    ajv.addSchema(contract);
    return ajv.getSchema(`${contract.$id}#/definitions/${definition}`)!;
  };
  const validDeclaration = validator("declaration");
  const validList = validator("listResult");
  const validItem = validator("itemResult");

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

  const call = (token: string, method: string, params: unknown = {}) =>
    request("POST", `/api/mobile/call/${method}`, { token, body: { params } });
  const declarationOf = async (token: string) => (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
  const appOf = async (token: string) => (await declarationOf(token)).apps.find((app: any) => app.id === "system");
  const linksOf = async (token: string) => ((await call(token, "system.home")).body.result.item._links ?? []).map((link: any) => link.title);

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  describe("the app and its rights", () => {
    it("declares «Система» with the methods of these slices, and matches the contract", async () => {
      const declaration = await declarationOf(await login("admin"));
      expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
      const system = declaration.apps.find((app: any) => app.id === "system");
      expect(system).to.include({ title: "Система", home: "system.home", scope: "server", category: "Система" });
      expect(system.methods.map((method: any) => method.name)).to.have.members(["system.home", "system.restart", "system.modules", "system.module", "system.catalog", "system.catalogItem", "system.install", "system.update", "system.remove", "system.job"]);
      // What the next slices bring is not declared yet, so no client draws it.
      expect(system.methods.map((method: any) => method.name)).to.not.include.members(["system.setEnabled", "system.migrate", "system.wizard"]);
    });

    it("opens the home screen to the right of the Extensions page", async () => {
      const system = await appOf(await login("sysop"));
      expect(system.methods.map((method: any) => method.name)).to.have.members(["system.home", "system.restart", "system.modules", "system.module", "system.catalog", "system.catalogItem", "system.install", "system.update", "system.remove", "system.job"]);
    });

    it("opens the home screen to somebody who only leads the settings — and no programs with it", async () => {
      const token = await login("settler");
      const system = await appOf(token);
      expect(system).to.not.equal(undefined);
      // The right closes the method: it is not in the declaration, and the call is refused.
      expect(system.methods.map((method: any) => method.name)).to.deep.equal(["system.home"]);
      expect((await call(token, "system.modules")).body.error.code).to.equal("forbidden");
      expect((await call(token, "system.module", { id: "simple-navigation" })).body.error.code).to.equal("forbidden");
    });

    it("shows nothing of «Система» to somebody with none of the three rights", async () => {
      // Somebody who works in the panel every day — a stock manager — and holds none of the three.
      const token = await login("stock");
      expect((await declarationOf(token)).apps.map((app: any) => app.id)).to.not.include("system");
      expect((await call(token, "system.home")).body.error.code).to.equal("forbidden");
      expect((await call(token, "system.modules")).body.error.code).to.equal("forbidden");
    });

    it("counts the programs only for whoever may change them: the fields follow the right", async () => {
      const fieldsOf = async (name: string) =>
        (await appOf(await login(name))).models.serverCard.fields.map((field: any) => field.name);

      expect(await fieldsOf("sysop")).to.include.members(["systemCount", "installedCount", "disabledCount", "updatesCount", "restartText"]);
      // The settings alone: the version of the server, and not a word about its modules.
      expect(await fieldsOf("settler")).to.deep.equal(["version", "timezone", "currency"]);
      // `access` is the server's own business and never travels.
      const fields = (await appOf(await login("sysop"))).models.serverCard.fields;
      expect(fields.every((field: any) => field.access === undefined)).to.equal(true);
    });
  });

  describe("the home screen", () => {
    it("wears no badge: a server has no one word for its state", async () => {
      const home = (await appOf(await login("sysop"))).methods.find((method: any) => method.name === "system.home");
      expect(home.ui).to.deep.equal({ view: "detail", item: { title: "title", subtitle: "subtitle" } });
    });

    it("tells which server this is and counts its programs", async () => {
      const answer = await call(await login("sysop"), "system.home");
      expect(validItem(answer.body.result), JSON.stringify(validItem.errors)).to.equal(true);
      const item = answer.body.result.item;
      expect(item).to.include({
        title: "Resto Demo",
        subtitle: "5.2.0-build.33 · Europe/Moscow",
        version: "5.2.0-build.33",
        timezone: "Europe/Moscow",
        currency: "RUB",
        systemCount: 2,
        installedCount: 4,
        disabledCount: 1,
        updatesCount: 1,
        migrationsPending: 1,
      });
    });

    it("leads to the programs, and to no app this person could not open", async () => {
      // A link is built only after `ctx.canOpen` says yes, so the home screen promises nothing.
      expect(await linksOf(await login("sysop"))).to.deep.equal(["Программы · 6", "Маркетплейс"]);
    });

    it("leads to a neighbour app only for whoever holds its right", async () => {
      expect(await linksOf(await login("settler"))).to.deep.equal(["Настройки"]);
      expect(await linksOf(await login("channeler"))).to.deep.equal(["Каналы продаж"]);
      // The Extensions right is not the settings right: the line is not drawn for somebody who
      // would be refused behind it.
      expect(await linksOf(await login("sysop"))).to.deep.equal(["Программы · 6", "Маркетплейс"]);
      expect(await linksOf(await login("admin"))).to.deep.equal(["Программы · 6", "Маркетплейс", "Настройки", "Каналы продаж"]);
    });

    it("says in words that a restart is scheduled, that a wizard waits and that there is no licence", async () => {
      fakes.system.restartScheduled = true;
      fakes.system.restartAt = Date.parse("2026-11-05T00:00:00+03:00");
      fakes.system.wizard = { total: 3, left: 2, current: "TZ", renderer: "jsonforms" };
      const item = (await call(await login("sysop"), "system.home")).body.result.item;
      expect(item.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");
      expect(item.wizardText).to.equal("Сервер ждёт мастер установки, осталось шагов · 2");
      expect(item.migrationsText).to.equal("Миграции не пройдены · 1");
      // Without a licence the marketplace answers nothing and no version is checked: the card says so.
      expect(item.marketplaceText).to.equal("Лицензия не задана: версии в маркетплейсе не проверяются");
    });

    it("keeps the state of the server away from somebody who cannot act on it", async () => {
      fakes.system.restartScheduled = true;
      fakes.system.wizard = { total: 3, left: 2, current: "TZ", renderer: "jsonforms" };
      const item = (await call(await login("settler"), "system.home")).body.result.item;
      expect(item.restartText).to.equal(undefined);
      expect(item.wizardText).to.equal(undefined);
      expect(item.marketplaceText).to.equal(undefined);
    });

    it("says nothing about a restart, a wizard or migrations when there is nothing to say", async () => {
      fakes.system.licensed = true;
      fakes.system.cards = fakes.system.cards.filter((card) => !card.migrationsPending);
      const item = (await call(await login("sysop"), "system.home")).body.result.item;
      expect(item.restartText).to.equal(undefined);
      expect(item.wizardText).to.equal(undefined);
      expect(item.migrationsText).to.equal(undefined);
      expect(item.marketplaceText).to.equal(undefined);
    });
  });

  describe("the restart", () => {
    const restartOf = (item: any) => item._actions.find((action: any) => action.method === "system.restart");
    const restart = (token: string, when: unknown) => call(token, "system.restart", { when });

    it("the right closes the method: without it the button is not declared, and the call is refused in words", async () => {
      for (const name of ["settler", "stock"]) {
        const token = await login(name);
        const system = await appOf(token);
        expect((system?.methods ?? []).map((method: any) => method.name)).to.not.include("system.restart");
        const refused = await restart(token, "now");
        expect(refused.body.error.code, name).to.equal("forbidden");
        expect(refused.body.error.message, name).to.be.a("string").and.not.equal("");
      }
      expect(fakes.system.restartCalls, "nothing reached the server").to.deep.equal([]);
      const home = (await call(await login("settler"), "system.home")).body.result.item;
      expect(home._actions).to.deep.equal([]);
    });

    it("is drawn as two buttons on the card of the server, and asks before the dangerous one in words", async () => {
      const system = await appOf(await login("sysop"));
      const method = system.methods.find((candidate: any) => candidate.name === "system.restart");
      expect(method.kind).to.equal("mutation");
      expect(method.input.properties.when.enum).to.deep.equal(["midnight", "now"]);
      expect(method.input.properties.when["x-titles"]).to.deep.equal({ midnight: "Перезапустить в полночь", now: "Перезапустить сейчас" });
      expect(method.ui).to.deep.include({ view: "action", on: "serverCard" });
      expect(method.ui.control).to.deep.include({ type: "buttons", param: "when" });
      expect(method.ui.control.tones).to.deep.equal({ now: "danger" });
      expect(method.ui.confirm).to.equal(
        "Перезапустить сервер сейчас? Приложение на несколько секунд перестанет отвечать, а заказы, которые оформляются в эту минуту, могут не пройти.",
      );
    });

    it("offers both on a server with nothing going on", async () => {
      const home = (await call(await login("sysop"), "system.home")).body.result.item;
      expect(restartOf(home)).to.deep.equal({ method: "system.restart" });
      expect(home.restartText).to.equal(undefined);
    });

    it("plans for the night: the card says so at once, and only «now» is left to press", async () => {
      const token = await login("sysop");
      const answer = await restart(token, "midnight");
      expect(answer.status, JSON.stringify(answer.body)).to.equal(200);
      const item = answer.body.result.item;
      expect(fakes.system.restartCalls).to.deep.equal(["midnight"]);
      expect(item.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");
      expect(restartOf(item).input.properties.when.enum).to.deep.equal(["now"]);
      expect(restartOf(item).input.properties.when["x-titles"].now).to.equal("Перезапустить сейчас");
      // And it is the same from any later look at the home screen.
      const home = (await call(token, "system.home")).body.result.item;
      expect(home.restartText).to.equal(item.restartText);
      expect(restartOf(home).input.properties.when.enum).to.deep.equal(["now"]);
    });

    it("restarting now: the card says the server is going down and offers nothing more", async () => {
      const token = await login("sysop");
      await restart(token, "midnight");
      const item = (await restart(token, "now")).body.result.item;
      expect(fakes.system.restartCalls).to.deep.equal(["midnight", "now"]);
      expect(item.restartText).to.equal("Сервер перезапускается");
      expect(restartOf(item)).to.equal(undefined);
      expect((await call(token, "system.home")).body.result.item.restartText).to.equal("Сервер перезапускается");
    });

    it("says it in the language of the phone", async () => {
      const token = await login("sysop");
      const answer = await request("POST", "/api/mobile/call/system.restart?lang=en", { token, body: { params: { when: "now" } } });
      expect(answer.body.result.item.restartText).to.equal("The server is restarting");
    });

    it("refuses anything but the two words, and nothing reaches the server", async () => {
      const token = await login("sysop");
      for (const when of ["tomorrow", true, undefined]) {
        const refused = await restart(token, when);
        expect(refused.body.error.code, String(when)).to.equal("invalid");
        expect(refused.body.error.message, String(when)).to.equal("Parameters do not match the method schema");
      }
      expect(fakes.system.restartCalls).to.deep.equal([]);
    });

    it("writes who asked for it and what into the audit, and an administrator may too", async () => {
      await restart(await login("admin"), "midnight");
      expect(fakes.audits.at(-1)).to.include({ method: "system.restart", record: "server", ok: true });
      expect(fakes.audits.at(-1)!.params).to.deep.equal({ when: "midnight" });
    });
  });

  describe("the marketplace and its jobs", () => {
    it("the right closes all of it: not declared, and refused", async () => {
      const token = await login("stock");
      for (const [method, params] of [
        ["system.catalog", {}],
        ["system.catalogItem", { id: "stand-hello" }],
        ["system.install", { appId: "stand-hello" }],
        ["system.update", { appId: "stand-hello" }],
        ["system.remove", { appId: "stand-hello" }],
        ["system.job", { id: "job-1" }],
      ] as const) {
        expect((await call(token, method, params)).body.error.code, method).to.equal("forbidden");
      }
      expect(fakes.system.startedJobs).to.deep.equal([]);
      const settler = await appOf(await login("settler"));
      expect(settler.methods.map((method: any) => method.name)).to.deep.equal(["system.home"]);
    });

    it("lists what can be installed, finds by a word, and opens a card with the button", async () => {
      const token = await login("sysop");
      const all = (await call(token, "system.catalog")).body;
      expect(validList(all.result), JSON.stringify(validList.errors)).to.equal(true);
      expect(all.result.items.map((item: any) => item.id)).to.deep.equal(["stand-hello", "stand-paid"]);
      expect((await call(token, "system.catalog", { q: "здоровает" })).body.result.items.map((item: any) => item.id)).to.deep.equal(["stand-hello"]);
      const card = (await call(token, "system.catalogItem", { id: "stand-hello" })).body.result.item;
      expect(card.stateText).to.equal("Доступна");
      expect(card._actions.map((action: any) => action.method)).to.deep.equal(["system.install"]);
    });

    it("narrows by tags as the panel's catalog does: every tag asked, whatever the case and the separator", async () => {
      const token = await login("sysop");
      const ids = async (tags: string) => (await call(token, "system.catalog", { tags })).body.result.items.map((item: any) => item.id);
      expect(await ids("demo")).to.deep.equal(["stand-hello"]);
      expect(await ids("DEMO; greeting")).to.deep.equal(["stand-hello"]);
      expect(await ids("demo, no-such-tag")).to.deep.equal([]);
    });

    it("says in words what a licence does not cover, and offers no button for it", async () => {
      const card = (await call(await login("sysop"), "system.catalogItem", { id: "stand-paid" })).body.result.item;
      expect(card.stateText).to.equal("Недоступна по лицензии");
      expect(card._actions).to.deep.equal([]);
    });

    it("says in words that the marketplace did not answer, rather than showing it empty", async () => {
      fakes.system.marketplace = null;
      const answer = await call(await login("sysop"), "system.catalog");
      expect(answer.body.error.code).to.equal("unavailable");
      expect(answer.body.error.message).to.equal("Не удалось загрузить каталог маркетплейса");
    });

    it("starts a job and answers at once with its id; with the id it starts nothing", async () => {
      const token = await login("sysop");
      const started = (await call(token, "system.install", { appId: "stand-hello" })).body.result.item;
      expect(started.jobId).to.equal("job-1");
      expect(fakes.audits.at(-1)).to.include({ method: "system.install", record: "stand-hello", ok: true });
      const closed = (await call(token, "system.install", { appId: "stand-hello", job: "job-1" })).body.result.item;
      expect(closed.jobId).to.equal(undefined);
      expect(fakes.system.startedJobs).to.deep.equal(["install stand-hello"]);
    });

    it("says every refusal of the manager in words", async () => {
      const token = await login("sysop");
      const cases: [string, any, string, string][] = [
        ["busy", { appId: "stand-slow", kind: "install" }, "conflict", "Сейчас идёт другое задание, дождитесь его конца: stand-slow"],
        ["installed", null, "conflict", "Эта программа уже установлена"],
        ["not_found", null, "not_found", "Такой программы на сервере нет"],
        ["system", null, "conflict", "Системную программу удалить нельзя"],
        ["forbidden", null, "conflict", "Программа запрещает своё удаление"],
        ["dependents", { dependents: ["stand-child", "other"] }, "conflict", "Удалить нельзя, от неё зависят: stand-child, other"],
        ["outside", null, "conflict", "the manager's own text"],
      ];
      for (const [reason, details, code, words] of cases) {
        fakes.system.refusal = { refusal: true, reason, message: "the manager's own text", details };
        const refused = await call(token, "system.remove", { appId: "simple-navigation" });
        expect(refused.body.error.code, reason).to.equal(code);
        expect(refused.body.error.message, reason).to.equal(words);
      }
    });

    it("tells the job as it goes, as it ends and why it failed, each in words", async () => {
      const token = await login("sysop");
      const { jobId } = (await call(token, "system.install", { appId: "stand-hello" })).body.result.item;
      const job = fakes.system.jobs.get(jobId)!;
      const look = async () => (await call(token, "system.job", { id: jobId })).body.result.item;

      expect(await look()).to.deep.include({ state: "running", stepText: "Скачиваем из маркетплейса", title: "Установка: stand-hello" });

      job.state = "done";
      job.restartScheduled = true;
      job.log = ["line one", "line two"];
      expect(await look()).to.deep.include({
        state: "done",
        doneText: "Программа установлена",
        restartText: "Перезагрузка запланирована на 00:00 по времени сервера.",
        log: "line one\nline two",
      });

      job.state = "failed";
      job.restartScheduled = false;
      const failures: [any, string][] = [
        [{ reason: "license", message: "x", details: null }, "Программа недоступна по вашей лицензии"],
        [{ reason: "registry", message: "x", details: null }, "Маркетплейс не отдал программу, попробуйте позже"],
        [
          { reason: "incompatible", message: "x", details: { missingModules: ["a"], outdatedModules: [{ module: "@webresto/core", currentVersion: "2.6.0", requiredVersion: "2.7.0" }] } },
          "Программа не подходит этому серверу. Нет того, что ей нужно: a Нужен @webresto/core ≥ 2.7.0, установлен 2.6.0",
        ],
        [{ reason: "failed", message: "disk is full", details: null }, "Не получилось: disk is full"],
      ];
      for (const [error, words] of failures) {
        job.error = error;
        const shown = await look();
        expect(shown.errorText, error.reason).to.equal(words);
        expect(shown.restartText, error.reason).to.equal(undefined);
      }
    });

    it("says a job is forgotten when the server has restarted", async () => {
      const answer = await call(await login("sysop"), "system.job", { id: "nobody-knows" });
      expect(answer.body.error.code).to.equal("not_found");
      expect(answer.body.error.message).to.equal("Сервер не помнит это задание: скорее всего, он перезапустился. Проверьте список программ.");
    });

    it("offers an update only where there is one", async () => {
      const token = await login("sysop");
      const items = (await call(token, "system.modules")).body.result.items;
      for (const item of items) {
        const offered = item._actions.map((action: any) => action.method).includes("system.update");
        expect(offered, item.id).to.equal(item.state === "update");
      }
    });
  });

  describe("the programs", () => {
    it("lists them with the badge each state deserves", async () => {
      const answer = await call(await login("sysop"), "system.modules");
      expect(validList(answer.body.result), JSON.stringify(validList.errors)).to.equal(true);
      const badges = Object.fromEntries(answer.body.result.items.map((item: any) => [item.appId, item.stateText]));
      expect(badges).to.deep.equal({
        "@webresto/core": "Системная",
        "@webresto/graphql": "Системная",
        // The version an update would bring is in the badge, as "Доступна версия X" is in the web.
        "simple-navigation": "Обновление 1.8.3",
        "shop-front": "Работает",
        "old-module": "Выключена",
        "broken-module": "Миграции не прошли",
      });
      expect(answer.body.result.counts).to.deep.equal({ all: 6, installed: 4, system: 2, disabled: 1 });
    });

    it("carries the chips and the search in the declaration, and opens a row on the card", async () => {
      const method = (await appOf(await login("sysop"))).methods.find((item: any) => item.name === "system.modules");
      expect(method.ui).to.deep.include({ view: "list", search: "q", chips: "kind", open: "system.module" });
      expect(method.ui.item).to.deep.equal({ title: "name", subtitle: "appId", value: "version", badge: "stateText" });
      expect(method.input.properties.kind.enum).to.deep.equal(["all", "installed", "system", "disabled"]);
      expect(method.input.properties.kind["x-titles"]).to.deep.equal({
        all: "Все",
        installed: "Свои",
        system: "Системные",
        disabled: "Выключенные",
      });
      // The list is not polled: nothing of it changes by itself until the jobs of slice C arrive.
      expect(method.input.properties.since).to.equal(undefined);
    });

    it("finds a program by its name, its appId, its description and its keywords", async () => {
      const token = await login("sysop");
      const found = async (q: string) =>
        (await call(token, "system.modules", { q })).body.result.items.map((item: any) => item.appId);

      expect(await found("навиг")).to.deep.equal(["simple-navigation"]);
      expect(await found("simple-nav")).to.deep.equal(["simple-navigation"]);
      expect(await found("меню витрины")).to.deep.equal(["simple-navigation"]);
      // The keywords are how the module is found in the marketplace, so the same word finds it here.
      expect(await found("navigation")).to.deep.equal(["simple-navigation"]);
      expect(await found("ничего такого")).to.deep.equal([]);
    });

    it("narrows the list by the chips", async () => {
      const token = await login("sysop");
      const kindOf = async (kind: string) =>
        (await call(token, "system.modules", { kind })).body.result.items.map((item: any) => item.appId);

      expect(await kindOf("system")).to.deep.equal(["@webresto/core", "@webresto/graphql"]);
      expect(await kindOf("disabled")).to.deep.equal(["old-module"]);
      expect(await kindOf("installed")).to.have.members(["simple-navigation", "shop-front", "old-module", "broken-module"]);
      expect((await call(token, "system.modules", { kind: "whatever" })).body.error.code).to.equal("invalid");
    });
  });

  describe("the card of a program", () => {
    const cardOf = async (token: string, id: string) => (await call(token, "system.module", { id })).body.result.item;

    it("shows the version, the hook, the directory and what the package says about itself", async () => {
      const token = await login("sysop");
      const card = await cardOf(token, "simple-navigation");
      expect(card).to.include({
        name: "Навигация",
        appId: "simple-navigation",
        version: "1.8.2",
        latestVersion: "1.8.3",
        kind: "installed",
        enable: true,
        loaded: true,
        hookName: "simplenavigation",
        directoryName: "simple-navigation",
        author: "WebResto",
        license: "MIT",
        keywords: "navigation, menu",
        dependents: "shop-front",
      });
    });

    it("says why a program cannot be removed, before any button to remove it exists", async () => {
      const token = await login("sysop");
      // The three refusals of the web and of C44, each in words: a person who cannot remove a
      // program reads why, instead of meeting a 409 later.
      expect((await cardOf(token, "@webresto/core")).removeText).to.equal("Системную программу удалить нельзя");
      expect((await cardOf(token, "shop-front")).removeText).to.equal("Программа запрещает своё удаление");
      expect((await cardOf(token, "simple-navigation")).removeText).to.equal("Удалить нельзя, от неё зависят: shop-front");
      expect((await cardOf(token, "old-module")).removeText).to.equal(undefined);
    });

    it("tells the state of the migrations, the text of the last run and the settings nobody filled in", async () => {
      const token = await login("sysop");
      const broken = await cardOf(token, "broken-module");
      expect(broken.migrationsText).to.equal('Миграции не пройдены: 1 / 3 — ERROR: relation "menu" already exists');
      expect((await cardOf(token, "simple-navigation")).migrationsText).to.equal("Миграции пройдены: 2");
      expect((await cardOf(token, "shop-front")).settingsText).to.equal("Не заполнены обязательные настройки · 2");
      expect((await cardOf(token, "old-module")).migrationsText).to.equal(undefined);
    });

    it("does not promise migrations on a server that runs none", async () => {
      fakes.system.migrationsSupported = false;
      const card = await cardOf(await login("sysop"), "broken-module");
      expect(card.migrationsText).to.contain("Миграции на этом сервере не выполняются: база не postgres");
    });

    it("answers not_found for a program this server has not got", async () => {
      const answer = await call(await login("sysop"), "system.module", { id: "nothing-like-this" });
      expect(answer.status).to.equal(404);
      expect(answer.body.error.code).to.equal("not_found");
    });

    it("sends no line a program cannot fill: an empty «Зависит от» says less than nothing", async () => {
      // A key the record does not carry is not drawn at all; an empty string would be drawn as a
      // blank line, which is worse than the line not being there.
      const card = await cardOf(await login("sysop"), "@webresto/core");
      expect(card.dependencies).to.equal(undefined);
      expect(card.dependents).to.equal(undefined);
      expect(card.author).to.equal(undefined);
      expect(card.hookName).to.equal(undefined);
    });

    it("offers to remove a program it can remove, and asks first in words", async () => {
      const token = await login("admin");
      const card = await cardOf(token, "old-module");
      expect(card._actions.map((action: any) => action.method)).to.include("system.remove");
      const remove = (await appOf(token)).methods.find((method: any) => method.name === "system.remove");
      expect(remove.ui.control).to.deep.include({ type: "native", screen: "module-progress" });
      expect(remove.ui.confirm).to.equal("Удалить программу? Её файлы и настройки будут удалены.");
    });

    it("offers no removal of what cannot be removed: the card says why instead", async () => {
      const card = await cardOf(await login("admin"), "@webresto/core");
      expect(card._actions.map((action: any) => action.method)).to.not.include("system.remove");
      expect(card.removeText).to.equal("Системную программу удалить нельзя");
    });
  });
});
