import * as fs from "fs";
import * as http from "http";
import * as net from "net";
import * as os from "os";
import * as path from "path";
import type { AddressInfo } from "net";

const rc = require("rc");
const SailsFactory = require("sails").Sails;
const passwordHash = require("password-hash");

/**
 * Sails with the admin panel on, on sails-disk in a temporary directory — the stand for tests that
 * need adminizer's real rights, users and groups (plan, section 0.5).
 *
 * Requests go through `sails.hooks.http.app` — the full Express stack of Sails, middleware order
 * included — served by our own server: tests/graphql.middleware.test.ts fakes
 * http.Server.prototype.listen for the whole mocha process, so Sails' own port may never bind.
 */

export const STAND_SALT = "stand-salt";
export const STAND_PASSWORD = "stand-password";

export interface Stand {
  sails: any;
  url: string;
  /** The directory of the sails-disk datastore, removed by `lower`. */
  dir: string;
  /** Four users of the plan: administrator, Operator, Stock Manager, panel access without apps. */
  users: { admin: any; operator: any; stock: any; panelOnly: any } | null;
  places: { a: any; b: any; pickup: any } | null;
  lower(): Promise<void>;
}

export interface StandOptions {
  env?: Record<string, string>;
  /** Extra hooks by name, e.g. app-mobile-api. */
  hooks?: Record<string, unknown>;
  /** The four users, three places — off for a stand that makes its own (tools/real-server). */
  fixtures?: boolean;
}

function configureEnvironment(env: Record<string, string>): void {
  const root = process.cwd();
  const defaults: Record<string, string> = {
    NODE_ENV: "test",
    ADMINPANEL_LAZY_GEN_ADMIN_DISABLE: "1",
    WEBRESTO_MODULES_PATH: path.join(root, "modules"),
    MM_SETTINGS_MODEL_DENY: "1",
    AP_PASSWORD_SALT: STAND_SALT,
    MM_SYSTEM_MODULES: path.join(root, "node_modules/@webresto/core"),
  };
  for (const [key, value] of Object.entries({ ...defaults, ...env })) process.env[key] = value;
}

async function fixtures(sails: any): Promise<Pick<Stand, "users" | "places">> {
  const Group = sails.models.groupap;
  const User = sails.models.userap;
  const Place = sails.models.place;

  const [a, b, pickup] = [
    await Place.create({ id: "stand-a", title: "Ленина, 5", address: "ул. Ленина, 5", enable: true, isCookingPoint: true, isPickupPoint: true }).fetch(),
    await Place.create({ id: "stand-b", title: "Мира, 3", address: "пр. Мира, 3", enable: true, isCookingPoint: true, isPickupPoint: false }).fetch(),
    await Place.create({ id: "stand-p", title: "Выдача", enable: true, isCookingPoint: false, isPickupPoint: true }).fetch(),
  ];

  const group = async (name: string, tokens: unknown[]) =>
    (await Group.findOne({ name })) ? Group.updateOne({ name }, { tokens }) : Group.create({ name, tokens }).fetch();
  const operator = await group("Operator", ["access-to-adminpanel", "order-kanban", "read-order-model"]);
  const stock = await group("Stock Manager", ["access-to-adminpanel", { tokenId: "stock-manager", rights: [a.id, b.id] }]);
  const panel = await group("Panel only", ["access-to-adminpanel"]);

  const user = async (login: string, groups: any[], extra: Record<string, unknown> = {}) =>
    User.create({
      login,
      fullName: login,
      passwordHashed: passwordHash.generate(login + STAND_PASSWORD + STAND_SALT),
      isActive: true,
      isConfirmed: true,
      isAdministrator: false,
      groups: groups.map((g) => g.id),
      ...extra,
    }).fetch();

  return {
    users: {
      admin: await user("stand-admin", [], { isAdministrator: true }),
      operator: await user("stand-operator", [operator]),
      stock: await user("stand-stock", [stock]),
      panelOnly: await user("stand-panel", [panel]),
    },
    places: { a, b, pickup },
  };
}

let esmLoaderRegistered = false;

/**
 * adminizer is ESM with directory imports, which only the ESM loader of tsx resolves — the server
 * runs under it (`tsx restoapp.js`), mocha only with `-r tsx/cjs`. Registered here once, so the
 * stand works from a plain `npm test`.
 */
function registerEsmLoader(): void {
  if (esmLoaderRegistered) return;
  require("tsx/esm/api").register();
  esmLoaderRegistered = true;
}

export async function liftWithAdminpanel(options: StandOptions = {}): Promise<Stand> {
  registerEsmLoader();
  configureEnvironment(options.env ?? {});
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "restoapp-stand-"));

  const config = rc("sails");
  config.environment = "test";
  // Sails' own server: a free port it is allowed to bind (0 means "default 1337" to Sails).
  config.port = 42000 + Math.floor(Math.random() * 2000);
  config.log = { ...(config.log || {}), level: process.env.STAND_LOG_LEVEL ?? "error" };
  config.hooks = {
    ...(config.hooks || {}),
    grunt: false,
    // @webresto/graphql, an installable hook: the stand needs no GraphQL, and the module halts the
    // whole process when its schema fails to build (as in tests/graphql.middleware.test.ts here).
    restographql: false,
    "app-manager-proto": require(path.resolve(__dirname, "../../api/hooks/app-manager-proto")),
    ...(options.hooks ?? {}),
  };
  config.datastores = { default: { adapter: "sails-disk", dir } };

  const sails: any = await new Promise((resolve, reject) => {
    SailsFactory().lift(config, (error: Error, lifted: any) => (error ? reject(error) : resolve(lifted)));
  });
  await new Promise<void>((resolve) => {
    if (sails.hooks.adminpanel?.adminizer?.accessRightsHelper?.getTokens().length) return resolve();
    sails.on("Adminpanel:loaded", () => setImmediate(resolve));
  });

  const server = http.createServer(sails.hooks.http.app);
  await new Promise<void>((resolve) => (net.Server.prototype.listen as any).call(server, 0, "127.0.0.1", () => resolve()));
  const { port } = net.Server.prototype.address.call(server) as AddressInfo;

  return {
    sails,
    url: `http://127.0.0.1:${port}`,
    dir,
    ...(options.fixtures === false ? { users: null, places: null } : await fixtures(sails)),
    async lower() {
      await new Promise<void>((resolve) => server.close(() => resolve()));
      await new Promise<void>((resolve) => sails.lower(() => resolve()));
      fs.rmSync(dir, { recursive: true, force: true });
    },
  };
}
