import { expect } from "chai";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { FakeRegistry, startFakeRegistry } from "./support/fakeRegistry";
import { liftWithAdminpanel, Stand, STAND_PASSWORD } from "./support/liftWithAdminpanel";
import { solve } from "./support/mobileApiFakes";

/**
 * The manager of extensions from end to end: a lifted Sails with the real module manager and the
 * mobile API, real tar archives from a fake marketplace, a temporary modules directory, and only
 * `process.exit` replaced. Nothing here can reach the real marketplace or a real server.
 */
describe("«Система»: installing, updating and removing, on the real module manager", function () {
  this.timeout(240000);

  const SLOW_MS = 16000;
  const CLIENT_TIMEOUT_MS = 15000;

  let stand: Stand;
  let registry: FakeRegistry;
  let modulesPath: string;
  let listFile: string;
  let token: string;
  const realExit = process.exit;
  const exits: unknown[] = [];

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
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }

  async function signIn(login: string): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const answer = await request("POST", "/api/mobile/auth/login", {
      body: { login, password: STAND_PASSWORD, captchaSolution: await solve(challenge.body.result.task), device: { name: "stand", platform: "test" } },
    });
    expect(answer.status, JSON.stringify(answer.body)).to.equal(200);
    return answer.body.result.token;
  }

  const call = (method: string, params: unknown = {}, as: string = token) =>
    request("POST", `/api/mobile/call/${method}?lang=ru`, { token: as, body: { params } });

  /** What a phone does: polls the job until it is over. */
  async function finished(jobId: string) {
    for (;;) {
      const answer = await call("system.job", { id: jobId });
      expect(answer.status, JSON.stringify(answer.body)).to.equal(200);
      if (answer.body.result.item.state !== "running") return answer.body.result.item;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  async function runJob(method: string, appId: string) {
    const started = await call(method, { appId });
    expect(started.status, JSON.stringify(started.body)).to.equal(200);
    return finished(started.body.result.item.jobId);
  }

  const installedVersion = (appId: string) => JSON.parse(fs.readFileSync(path.join(modulesPath, appId, "package.json"), "utf8")).version;
  const actionsOf = (item: any) => item._actions.map((action: any) => action.method);
  const card = async (appId: string) => (await call("system.module", { id: appId })).body.result.item;
  const catalogIds = async () => (await call("system.catalog")).body.result.items.map((item: any) => item.id);
  const forgetTheCache = () => require("../api/hooks/app-mobile-api/adapters/system").systemAdapter(stand.sails).invalidate();

  before(async () => {
    (process as any).exit = (code: unknown) => exits.push(code);
    registry = await startFakeRegistry({ slowMs: SLOW_MS });
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "system-install-"));
    modulesPath = path.join(root, "modules");
    listFile = path.join(root, "modules.list");
    fs.mkdirSync(modulesPath);
    stand = await liftWithAdminpanel({
      env: {
        MOBILE_API_ENABLED: "true",
        MOBILE_API_SECRET: "stand-secret",
        CAPTCHA_POW_DIFFICULTY: "20",
        ENABLE_ADMIN_CAPTCHA: "true",
        MODULE_STORAGE_URL: registry.url,
        WEBRESTO_LICENSE: "stand-license",
        WEBRESTO_MODULES_LISTFILE: listFile,
        MM_SYSTEM_MODULES: fs.realpathSync(path.resolve("node_modules/@webresto/core")),
      },
      hooks: {
        "app-manager-proto": require(path.resolve(__dirname, "../api/hooks/app-manager-proto")),
        "app-mobile-api": require(path.resolve(__dirname, "../api/hooks/app-mobile-api")),
      },
    });
    stand.sails.config.modulemanager.modulesPath = modulesPath;
    token = await signIn("stand-admin");
  });

  after(async () => {
    // A plan for midnight is a timer in the process of the tests: an order overrules it.
    const scheduler = require("../api/hooks/app-manager-proto/helpers/restartScheduler");
    scheduler.restartNow();
    await new Promise((resolve) => setTimeout(resolve, 1100));
    (process as any).exit = realExit;
    delete require.cache[require.resolve("../api/hooks/app-manager-proto/helpers/restartScheduler")];
    await stand?.lower();
    await registry?.close();
    delete process.env.MODULE_STORAGE_URL;
    delete process.env.WEBRESTO_LICENSE;
    delete process.env.WEBRESTO_MODULES_LISTFILE;
    process.env.MM_SYSTEM_MODULES = path.resolve("node_modules/@webresto/core");
    fs.rmSync(path.dirname(modulesPath), { recursive: true, force: true });
  });

  it("the whole way: the marketplace, installing, updating, removing, and the request to restart", async () => {
    // The door on the home screen.
    const home = (await call("system.home")).body.result.item;
    expect(home._links.map((link: any) => link.title)).to.include("Маркетплейс");
    expect(home.restartText).to.equal(undefined);

    // The marketplace: a word finds it, and its card has the button.
    expect(await catalogIds()).to.include("stand-hello");
    const found = (await call("system.catalog", { q: "здоровается" })).body.result.items;
    expect(found.map((item: any) => item.id)).to.deep.equal(["stand-hello"]);
    // And by a tag, the way «Каналы продаж» leads here: the real filter over the tags of the registry.
    const tagged = (await call("system.catalog", { tags: "DEMO" })).body.result.items;
    expect(tagged.map((item: any) => item.id)).to.include("stand-hello");
    expect((await call("system.catalog", { tags: "demo, no-such-tag" })).body.result.items).to.deep.equal([]);
    const offered = (await call("system.catalogItem", { id: "stand-hello" })).body.result.item;
    expect(actionsOf(offered)).to.deep.equal(["system.install"]);

    // Installing: the job ends, and asks for a restart in words.
    const installed = await runJob("system.install", "stand-hello");
    expect(installed.state, JSON.stringify(installed)).to.equal("done");
    expect(installed.doneText).to.equal("Программа установлена");
    expect(installed.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");
    expect(installed.log).to.include("Module stand-hello installed successfully");

    // It really is there: the files, the list file, the table, the list of programs.
    expect(installedVersion("stand-hello")).to.equal("1.0.0");
    expect(fs.readFileSync(listFile, "utf8")).to.include("stand-hello");
    expect(await stand.sails.models.module.findOne({ appId: "stand-hello" })).to.include({ version: "1.0.0", enable: true });
    const programs = (await call("system.modules")).body.result.items;
    expect(programs.map((item: any) => item.id)).to.include("stand-hello");

    // The marketplace does not offer it any more, and the card it was opened from says so.
    expect(await catalogIds()).to.not.include("stand-hello");
    const closed = (await call("system.install", { appId: "stand-hello", job: installed.id })).body.result.item;
    expect(closed.stateText).to.equal("Установлена");
    expect(closed.jobId).to.equal(undefined);
    expect(actionsOf(closed)).to.deep.equal([]);
    expect((await call("system.home")).body.result.item.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");

    // No update yet, so no button for one.
    expect(actionsOf(await card("stand-hello"))).to.not.include("system.update");

    // A new version appears: the card says so and offers it.
    registry.publish("stand-hello", "1.1.0");
    forgetTheCache();
    const outdated = await card("stand-hello");
    expect(outdated.stateText).to.equal("Обновление 1.1.0");
    expect(actionsOf(outdated)).to.include("system.update");

    // Updating.
    const updated = await runJob("system.update", "stand-hello");
    expect(updated.state, JSON.stringify(updated)).to.equal("done");
    expect(updated.doneText).to.equal("Программа обновлена");
    expect(updated.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");
    expect(installedVersion("stand-hello")).to.equal("1.1.0");
    const fresh = await card("stand-hello");
    expect(fresh.version).to.equal("1.1.0");
    expect(actionsOf(fresh)).to.not.include("system.update");

    // Removing.
    expect(actionsOf(fresh)).to.include("system.remove");
    const removed = await runJob("system.remove", "stand-hello");
    expect(removed.state, JSON.stringify(removed)).to.equal("done");
    expect(removed.doneText).to.equal("Программа удалена");
    expect(removed.restartText).to.equal("Перезагрузка запланирована на 00:00 по времени сервера.");
    expect(fs.existsSync(path.join(modulesPath, "stand-hello"))).to.equal(false);
    expect(fs.readFileSync(listFile, "utf8")).to.not.include("stand-hello");
    expect((await call("system.module", { id: "stand-hello" })).status).to.equal(404);
    const gone = (await call("system.remove", { appId: "stand-hello", job: removed.id })).body.result.item;
    expect(gone.stateText).to.equal("Удалена");
    expect(actionsOf(gone)).to.deep.equal([]);
    expect(await catalogIds()).to.include("stand-hello");
    registry.reset();
  });

  it("a job lives longer than the phone waits for an answer, and is refused a second one", async () => {
    expect((await runJob("system.install", "stand-hello")).state).to.equal("done");
    const before = Date.now();
    const started = await call("system.install", { appId: "stand-slow" });
    expect(Date.now() - before, "the answer does not wait for the job").to.be.lessThan(3000);
    const { jobId } = started.body.result.item;

    const running = (await call("system.job", { id: jobId })).body.result.item;
    expect(running).to.deep.include({ state: "running", stepText: "Скачиваем из маркетплейса" });

    // The second press of the same button is coming back to the same job.
    expect((await call("system.install", { appId: "stand-slow" })).body.result.item.jobId).to.equal(jobId);

    // One job at a time, whatever it is, and the refusal names what is going on.
    for (const [method, appId] of [["system.install", "stand-locked"], ["system.update", "restocore"], ["system.remove", "stand-hello"]]) {
      const refused = await call(method, { appId });
      expect(refused.status, method).to.equal(409);
      expect(refused.body.error, method).to.deep.include({ code: "conflict", message: "Сейчас идёт другое задание, дождитесь его конца: stand-slow" });
    }

    const done = await finished(jobId);
    expect(Date.now() - before, "it outlived the client's timeout").to.be.greaterThan(CLIENT_TIMEOUT_MS);
    expect(done.state, JSON.stringify(done)).to.equal("done");
    expect(installedVersion("stand-slow")).to.equal("1.0.0");
    await finished((await call("system.remove", { appId: "stand-slow" })).body.result.item.jobId);
    await finished((await call("system.remove", { appId: "stand-hello" })).body.result.item.jobId);
  });

  it("says why it did not install, in words, and leaves nothing behind", async () => {
    const paid = await runJob("system.install", "stand-paid");
    expect(paid).to.deep.include({ state: "failed", errorText: "Программа недоступна по вашей лицензии" });

    const future = await runJob("system.install", "stand-future");
    expect(future).to.deep.include({
      state: "failed",
      errorText: "Программа не подходит этому серверу. Нет того, что ей нужно: @webresto/core",
    });

    const lost = await runJob("system.install", "stand-gone");
    expect(lost).to.deep.include({ state: "failed", errorText: "Маркетплейс не отдал программу, попробуйте позже" });

    for (const job of [paid, future, lost]) expect(job.restartText, job.appId).to.equal(undefined);
    expect(fs.readdirSync(modulesPath).filter((name) => name !== ".gitkeep")).to.deep.equal([]);
  });

  it("says why it will not remove, in words, on the card and on the call", async () => {
    // A system module.
    const core = await card("restocore");
    expect(core.removeText).to.equal("Системную программу удалить нельзя");
    expect(actionsOf(core)).to.not.include("system.remove");
    expect((await call("system.remove", { appId: "restocore" })).body.error).to.deep.include({
      code: "conflict",
      message: "Системную программу удалить нельзя",
    });

    // One that forbids it about itself (C44).
    expect((await runJob("system.install", "stand-locked")).state).to.equal("done");
    const locked = await card("stand-locked");
    expect(locked.removeText).to.equal("Программа запрещает своё удаление");
    expect(actionsOf(locked)).to.not.include("system.remove");
    expect((await call("system.remove", { appId: "stand-locked" })).body.error.message).to.equal("Программа запрещает своё удаление");
    expect(fs.existsSync(path.join(modulesPath, "stand-locked"))).to.equal(true);

    // One others depend on.
    expect((await runJob("system.install", "stand-hello")).state).to.equal("done");
    expect((await runJob("system.install", "stand-child")).state).to.equal("done");
    const needed = await card("stand-hello");
    expect(needed.removeText).to.equal("Удалить нельзя, от неё зависят: stand-child");
    expect(actionsOf(needed)).to.not.include("system.remove");
    expect((await call("system.remove", { appId: "stand-hello" })).body.error.message).to.equal("Удалить нельзя, от неё зависят: stand-child");

    // And when the dependent goes, it can go too.
    expect((await runJob("system.remove", "stand-child")).state).to.equal("done");
    expect((await runJob("system.remove", "stand-hello")).state).to.equal("done");
  });

  it("says that an installed program is installed, and that an absent one is absent", async () => {
    expect((await call("system.install", { appId: "stand-locked" })).body.error.message).to.equal("Эта программа уже установлена");
    expect((await call("system.update", { appId: "stand-absent" })).body.error).to.deep.include({
      code: "not_found",
      message: "Такой программы на сервере нет",
    });
  });

  it("says in words that the marketplace is down", async () => {
    forgetTheCache();
    registry.setDown(true);
    const answer = await call("system.catalog");
    registry.setDown(false);
    expect(answer.body.error).to.deep.include({ code: "unavailable", message: "Не удалось загрузить каталог маркетплейса" });
  });

  it("keeps the web page working on the same functions and the same refusals", async () => {
    const upgrade = require("../api/hooks/app-manager-proto/actions/upgrade");
    const remove = require("../api/hooks/app-manager-proto/actions/remove");
    const web = (handler: any, query: Record<string, string>) =>
      new Promise<{ status: number; text: string }>((resolve) => {
        let status = 200;
        const res = {
          status(code: number) { status = code; return res; },
          send(text: string) { resolve({ status, text }); },
          sendStatus(code: number) { resolve({ status: code, text: "" }); },
        };
        handler({ query, adminizer: { config: {}, accessRightsHelper: { hasPermission: () => true } } }, res);
      });
    const installed = await web(upgrade, { appId: "stand-hello", action: "install" });
    expect(installed.status, installed.text).to.equal(200);
    expect(installed.text).to.include("Module stand-hello installed successfully");
    expect(await web(upgrade, { appId: "stand-hello", action: "install" })).to.deep.equal({ status: 409, text: "Module is already installed" });
    expect((await web(remove, { appId: "restocore" }))).to.deep.equal({ status: 403, text: "System module can not be removed" });
    expect((await web(remove, { appId: "stand-locked" }))).to.deep.equal({ status: 403, text: "Module forbids its own removal" });
    expect((await web(remove, { appId: "stand-hello" })).status).to.equal(200);
    expect(fs.existsSync(path.join(modulesPath, "stand-hello"))).to.equal(false);
  });

  it("closes all of it to somebody without the right", async () => {
    const stock = await signIn("stand-stock");
    for (const [method, params] of [
      ["system.catalog", {}],
      ["system.install", { appId: "stand-hello" }],
      ["system.remove", { appId: "stand-locked" }],
    ] as const) {
      expect((await call(method, params, stock)).body.error.code, method).to.equal("forbidden");
    }
    expect(fs.existsSync(path.join(modulesPath, "stand-hello"))).to.equal(false);
  });

  it("the request to restart: pressed now, it prints and exits, and the card says so", async () => {
    const answer = await call("system.restart", { when: "now" });
    expect(answer.body.result.item.restartText).to.equal("Сервер перезапускается");
    expect(answer.body.result.item._actions.map((action: any) => action.method)).to.not.include("system.restart");
    expect(exits, "the answer goes out first").to.deep.equal([]);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    expect(exits).to.deep.equal([0]);
  });
});
