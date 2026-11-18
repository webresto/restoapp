import { expect } from "chai";
import Ajv from "ajv";
import { createMobileApi } from "../api/hooks/app-mobile-api/http/app";
import { Fakes, PASSWORD, listen, makeFakes, solve } from "./support/mobileApiFakes";

const contract = require("../api/hooks/app-mobile-api/schema/declaration.schema.json");

/**
 * «Настройки» through the mobile API: the Settings page of the admin panel, one to one
 * (`settings.plan.md`).
 *
 * What is checked here is the app, not core: the list sorted by key, the search over key, name and
 * module, the chips of the state, the words of a value, the secret that never leaves the database,
 * the action that is not offered for a setting the application owns or the environment pins, and the
 * refusal that comes back as a sentence rather than a code. The rules behind those answers are core's
 * (`lib/settings/view.ts`) and are checked against a real server by `tools/real-server/walk.ts`.
 *
 * Users: `owner` (the token `settings-manager`, and only it), `stock` (anything but it).
 */
describe("app-mobile-api: «Настройки»", function () {
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
    return { status: response.status, body: text ? JSON.parse(text) : null };
  }

  async function login(name: string): Promise<string> {
    const challenge = await request("GET", "/api/mobile/auth/challenge");
    const response = await request("POST", "/api/mobile/auth/login", {
      body: { login: name, password: PASSWORD, captchaSolution: await solve(challenge.body.result.task), device: { name: "Pixel", platform: "android" } },
    });
    expect(response.status, JSON.stringify(response.body)).to.equal(200);
    return response.body.result.token;
  }

  const call = (token: string, method: string, params: unknown = {}) =>
    request("POST", `/api/mobile/call/${method}?lang=ru`, { token, body: { params } });
  const declarationOf = async (token: string) => (await request("GET", "/api/mobile/describe?lang=ru", { token })).body.result;
  const rowOf = (items: any[], key: string) => items.find((item: any) => item.key === key);

  beforeEach(async () => {
    fakes = await makeFakes();
    server = await listen(createMobileApi(fakes.deps));
  });

  afterEach(async () => {
    await server.close();
  });

  it("is declared to whoever holds the token of the web page, and to nobody else", async () => {
    const declaration = await declarationOf(await login("owner"));
    expect(validDeclaration(declaration), JSON.stringify(validDeclaration.errors)).to.equal(true);
    const app = declaration.apps.find((app: any) => app.id === "settings");
    expect(app, "«Настройки» is there").to.not.equal(undefined);
    expect(app.title).to.equal("Настройки");
    expect(app.category).to.equal("Система");
    expect(app.home).to.equal("settings.list");
    expect(app.scope).to.equal("server");

    const barred = await declarationOf(await login("stock"));
    expect(barred.apps.map((app: any) => app.id)).to.not.include("settings");
    expect((await call(await login("stock"), "settings.list")).body.error.code).to.equal("forbidden");
  });

  it("lists every setting by key, with its value and its state in words", async () => {
    const token = await login("owner");
    const result = (await call(token, "settings.list")).body.result;
    expect(result.items.map((item: any) => item.key)).to.deep.equal([...result.items.map((item: any) => item.key)].sort());
    expect(result.total).to.equal(9);

    expect(rowOf(result.items, "PROJECT_NAME").valueText).to.equal("resto-stand");
    expect(rowOf(result.items, "ALLOW_BONUS_SPENDING").valueText).to.equal("Нет");
    // Nothing of its own and no default either: that one really is empty.
    expect(rowOf(result.items, "CURRENCY_SIGN").valueText).to.equal("—");
    // A setting working off what it was declared with says so, which a single line of value cannot.
    expect(rowOf(result.items, "DEFAULT_LOCALE").valueText).to.equal("ru");
    expect(rowOf(result.items, "DEFAULT_LOCALE").state).to.contain("Значение по умолчанию");
    expect(rowOf(result.items, "TZ").state).to.contain("Из окружения");
    expect(rowOf(result.items, "RMS_LAST_SYNC_AT").state).to.contain("Только чтение");
    expect(rowOf(result.items, "OTP_TTL_SECONDS").state).to.contain("Нужен перезапуск");
    // The module that declared it, where there is one.
    expect(rowOf(result.items, "JWT_SECRET").state).to.contain("graphql");
    // A row is opened by its key: `restoapp://app/settings/PROJECT_NAME` is the link of the web's `#KEY`.
    expect(rowOf(result.items, "PROJECT_NAME").id).to.equal("PROJECT_NAME");
  });

  it("says the same in English when English is asked for", async () => {
    const token = await login("owner");
    const answer = await request("POST", "/api/mobile/call/settings.list?lang=en", { token, body: { params: {} } });
    expect(rowOf(answer.body.result.items, "ALLOW_BONUS_SPENDING").valueText).to.equal("No");
    expect(rowOf(answer.body.result.items, "TZ").state).to.contain("From the environment");
  });

  it("searches by key, by name and by module, and counts the states on its chips", async () => {
    const token = await login("owner");
    expect((await call(token, "settings.list", { q: "project" })).body.result.items.map((i: any) => i.key)).to.deep.equal(["PROJECT_NAME"]);
    expect((await call(token, "settings.list", { q: "bonus spending" })).body.result.items.map((i: any) => i.key)).to.deep.equal(["ALLOW_BONUS_SPENDING"]);
    expect((await call(token, "settings.list", { q: "graphql" })).body.result.items.map((i: any) => i.key)).to.deep.equal(["JWT_SECRET"]);

    const all = (await call(token, "settings.list")).body.result;
    expect(all.counts).to.deep.equal({ all: 9, changed: 6, env: 1, restart: 1 });
    const pinned = (await call(token, "settings.list", { kind: "env" })).body.result;
    expect(pinned.items.map((item: any) => item.key)).to.deep.equal(["TZ"]);
    // The chips count what the search found, so the numbers answer «and of these, how many».
    expect((await call(token, "settings.list", { q: "TZ" })).body.result.counts.all).to.equal(1);
  });

  it("sends the schema of a setting with the setting, and never in the list", async () => {
    const token = await login("owner");
    const listed = rowOf((await call(token, "settings.list")).body.result.items, "WORK_TIME");
    expect(listed.jsonSchema, "a list of 107 settings does not carry 107 schemas").to.equal(undefined);

    const card = (await call(token, "settings.get", { id: "WORK_TIME" })).body.result.item;
    expect(card.jsonSchema.items.required).to.deep.equal(["start"]);
    expect(card.boot, "which run of the server this is").to.equal("boot-1");
    const named = (await call(token, "settings.get", { id: "PROJECT_NAME" })).body.result.item;
    expect(named.patternHint, "the rule in words, never the raw expression").to.equal("lowercase latin letters, digits and hyphens");
    expect((await call(token, "settings.get", { id: "NO_SUCH" })).body.error.code).to.equal("not_found");
  });

  it("keeps a secret in the database: not in the list, not in the card, not in the export", async () => {
    const token = await login("owner");
    const listed = rowOf((await call(token, "settings.list")).body.result.items, "JWT_SECRET");
    expect(listed.valueText).to.equal("••••••••");
    expect(JSON.stringify(listed)).to.not.contain("a-very-long-secret-value");

    const card = (await call(token, "settings.get", { id: "JWT_SECRET" })).body.result.item;
    expect(card.value).to.equal(null);
    expect(card.hasValue, "only that it is set").to.equal(true);
    expect(card.state).to.contain("Секрет");

    const dump = (await call(token, "settings.dump")).body.result;
    expect(dump.settings.map((row: any) => row.key)).to.not.include("JWT_SECRET");
    expect(JSON.stringify(dump)).to.not.contain("a-very-long-secret-value");
  });

  it("offers «Изменить значение» only where a value may be written", async () => {
    const token = await login("owner");
    const actionsOf = async (key: string) =>
      ((await call(token, "settings.get", { id: key })).body.result.item._actions ?? []).map((action: any) => action.method);
    expect(await actionsOf("PROJECT_NAME")).to.deep.equal(["settings.update"]);
    // The environment pins it and the application owns it: the web disables its editor, and here the
    // action is not in the record at all — the renderer then draws no button.
    expect(await actionsOf("TZ")).to.deep.equal([]);
    expect(await actionsOf("RMS_LAST_SYNC_AT")).to.deep.equal([]);
    // The native screen the client draws for it is named in the declaration, not guessed at.
    const app = (await declarationOf(token)).apps.find((app: any) => app.id === "settings");
    const update = app.methods.find((method: any) => method.name === "settings.update");
    expect(update.ui.control).to.deep.equal({ type: "native", screen: "setting-editor" });
    expect(update.ui.on).to.equal("setting");
    const transfer = app.methods.find((method: any) => method.name === "settings.transfer");
    expect(transfer.ui.control).to.deep.equal({ type: "native", screen: "setting-transfer" });
    expect(transfer.ui.on, "the transfer is an action of the list itself").to.equal("list");
  });

  it("writes a value, and refuses one in words rather than in a code", async () => {
    const token = await login("owner");
    const written = await call(token, "settings.update", { id: "PROJECT_NAME", value: "another-stand" });
    expect(written.body.result.item.valueText).to.equal("another-stand");
    expect(fakes.settings.rows.find((row) => row.key === "PROJECT_NAME")!.value).to.equal("another-stand");

    const refused = await call(token, "settings.update", { id: "PROJECT_NAME", value: "Another Stand!" });
    expect(refused.status).to.equal(400);
    expect(refused.body.error.code).to.equal("invalid");
    expect(refused.body.error.message).to.contain("lowercase latin letters");

    expect((await call(token, "settings.update", { id: "TZ", value: "Europe/Berlin" })).body.error.code).to.equal("forbidden");
    expect((await call(token, "settings.update", { id: "RMS_LAST_SYNC_AT", value: "now" })).body.error.code).to.equal("forbidden");
    expect((await call(token, "settings.update", { id: "NO_SUCH", value: 1 })).body.error.code).to.equal("not_found");
    // A composite value goes whole, and a whole number is still a number.
    expect((await call(token, "settings.update", { id: "WORK_TIME", value: [{ start: "09:00" }] })).body.result.item.valueText)
      .to.equal("элементов: 1");
    expect((await call(token, "settings.update", { id: "OTP_TTL_SECONDS", value: 30 })).body.error.message).to.contain("60");
  });

  it("writes the key to the journal, and the value only when it is not a secret", async () => {
    const token = await login("owner");
    await call(token, "settings.update", { id: "CURRENCY_SIGN", value: "₽" });
    const plain = fakes.audits.at(-1)!;
    expect(plain.record).to.equal("CURRENCY_SIGN");
    expect(plain.params).to.deep.equal({ value: "₽" });

    await call(token, "settings.update", { id: "JWT_SECRET", value: "another-very-long-secret-0123456789ab" });
    const secret = fakes.audits.at(-1)!;
    expect(secret.record).to.equal("JWT_SECRET");
    expect(secret.params, "a secret is not written down anywhere").to.deep.equal({});
    expect(JSON.stringify(fakes.audits)).to.not.contain("another-very-long-secret");
  });

  it("previews what an import would change, and applies only what was ticked", async () => {
    const token = await login("owner");
    const file = [
      { key: "PROJECT_NAME", value: "from-the-file" },
      { key: "ALLOW_BONUS_SPENDING", value: false },
      { key: "TZ", value: "Europe/Berlin" },
      { key: "NO_SUCH_SETTING", value: 1 },
    ];
    const preview = (await call(token, "settings.transfer", { settings: file, preview: true })).body.result.diff;
    expect(preview.map((row: any) => row.status)).to.deep.equal(["changed", "unchanged", "changed", "not_found"]);
    expect(preview[2].envOverride).to.equal(true);
    expect(fakes.audits.at(-1)!.params, "a preview is a read and writes nothing down").to.deep.equal({});

    const results = (await call(token, "settings.transfer", { settings: file, keys: ["PROJECT_NAME", "TZ", "NO_SUCH_SETTING"] })).body.result.results;
    expect(results.map((row: any) => `${row.key}:${row.status}`)).to.deep.equal([
      "PROJECT_NAME:applied", "TZ:skipped", "NO_SUCH_SETTING:skipped",
    ]);
    expect(results[1].error).to.contain("окружения");
    expect(fakes.settings.rows.find((row) => row.key === "PROJECT_NAME")!.value).to.equal("from-the-file");
    expect(fakes.audits.at(-1)!.params).to.deep.equal({ keys: ["PROJECT_NAME", "TZ", "NO_SUCH_SETTING"] });
    expect((await call(token, "settings.transfer", { settings: file, keys: [] })).body.error.code).to.equal("invalid");
  });
});
