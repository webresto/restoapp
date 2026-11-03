import * as http from "http";
import * as net from "net";
import * as path from "path";
import { pathToFileURL } from "url";
import type { AddressInfo } from "net";
import type { Server } from "http";
import type { MobileApiDeps } from "../../api/hooks/app-mobile-api/http/app";
import type {
  AttemptStore,
  AuditEvent,
  DeviceRecord,
  DeviceStore,
  PanelUser,
  PlaceInfo,
  PowUseStore,
} from "../../api/hooks/app-mobile-api/lib/types";
import type { StockItem, StockPort } from "../../api/hooks/app-mobile-api/apps/dishes";
import { MobileApiRegistry } from "../../api/hooks/app-mobile-api/lib/registry";
import { registerDishes } from "../../api/hooks/app-mobile-api/apps/dishes";
import { cryptoPuzzle } from "../../api/hooks/app-mobile-api/adapters/sails";

const passwordHash = require("password-hash");

export const SALT = "test-salt";
export const PASSWORD = "secret-password";

/** Stores of the database tables, shared by every "worker" built from the same Fakes. */
export class MemoryDevices implements DeviceStore {
  rows = new Map<string, DeviceRecord>();
  private seq = 0;
  async create(record: Omit<DeviceRecord, "createdAt">) {
    this.rows.set(record.id, { ...record, createdAt: Date.now() + this.seq++ });
  }
  async findByTokenHash(tokenHash: string) {
    return [...this.rows.values()].find((row) => row.tokenHash === tokenHash) ?? null;
  }
  async listActive(user: string | number) {
    return [...this.rows.values()].filter((row) => row.user === user && !row.revoked).sort((a, b) => a.createdAt - b.createdAt);
  }
  async touch(id: string, at: number) {
    const row = this.rows.get(id);
    if (row) row.lastSeenAt = at;
  }
  async revoke(id: string) {
    const row = this.rows.get(id);
    if (row) row.revoked = true;
  }
}

export class MemoryPowUses implements PowUseStore {
  used = new Set<string>();
  async markUsed(id: string) {
    if (this.used.has(id)) return false;
    this.used.add(id);
    return true;
  }
}

export class MemoryAttempts implements AttemptStore {
  rows: Array<{ label: string; ok: boolean; at: number }> = [];
  async record(label: string, ok: boolean, at: number) {
    this.rows.push({ label, ok, at });
  }
  async count(label: string, since: number, onlyFailures = false) {
    return this.rows.filter((row) => row.label === label && row.at >= since && (!onlyFailures || !row.ok)).length;
  }
}

export function makeUser(id: number, login: string, groups: PanelUser["groups"], extra: Partial<PanelUser> = {}): PanelUser {
  return {
    id,
    login,
    fullName: login,
    isAdministrator: false,
    isActive: true,
    isConfirmed: true,
    passwordHashed: passwordHash.generate(login + PASSWORD + SALT),
    groups,
    ...extra,
  };
}

/** The real AccessRightsHelper of the installed adminizer, with core's stock-manager token. */
export async function realAccessRights(): Promise<any> {
  const adminizerDir = path.dirname(require.resolve("adminizer"));
  // require, not import(): under mocha only the CJS hook of tsx is on, and adminizer's own imports
  // need its resolution (directory imports) — as in the running server, which lifts under tsx.
  const { AccessRightsHelper } = require(path.join(adminizerDir, "helpers/accessRightsHelper.js"));
  const { checkStockManagerToken } = require("@webresto/core/lib/adminpanel/stock-manager-rights");
  const helper = new AccessRightsHelper({ config: { auth: { enable: true } } });
  helper.registerTokens([
    { id: "access-to-adminpanel", name: "Access", description: "Access to the panel", department: "General" },
    { id: "stock-manager", name: "Stock Manager", description: "Stock", department: "Catalog", check: checkStockManagerToken },
    { id: "order-kanban", name: "Current Orders", description: "Orders", department: "Orders" },
  ]);
  return helper;
}

/** A catalog of three dishes and balances per point, with core's effective balance. */
export class FakeStock implements StockPort {
  dishes = [
    { id: "d1", name: "Борщ", code: "B1", price: 300, group: "Супы" },
    { id: "d2", name: "Плов", code: "P1", price: 450, group: "Горячее" },
    { id: "d3", name: "Морс", code: "M1", price: 120, group: "Напитки" },
  ];
  /** placeId → dishId → row of DishPlace */
  rows = new Map<string, Map<string, { localBalance: number | null; enable: boolean }>>();

  private item(placeId: string, dish: (typeof this.dishes)[number]): StockItem {
    const { getEffectiveBalance } = require("@webresto/core/lib/menu/dish-place-balance");
    const row = this.rows.get(placeId)?.get(dish.id);
    const placeEnable = row?.enable !== false;
    return {
      id: dish.id,
      name: dish.name,
      code: dish.code,
      price: dish.price,
      enable: true,
      localBalance: row?.localBalance ?? null,
      rmsBalance: null,
      placeEnable,
      balance: getEffectiveBalance({ localBalance: row?.localBalance, rmsBalance: null, enable: placeEnable, mode: "minimum" }),
      groupTitle: dish.group,
      mode: "minimum",
    };
  }
  private row(placeId: string, id: string) {
    if (!this.rows.has(placeId)) this.rows.set(placeId, new Map());
    const rows = this.rows.get(placeId)!;
    if (!rows.has(id)) rows.set(id, { localBalance: null, enable: true });
    return rows.get(id)!;
  }
  async listLimited(placeId: string) {
    return this.dishes.map((dish) => this.item(placeId, dish)).filter((item) => item.balance !== -1);
  }
  async listCatalog(placeId: string, { q, offset, limit }: { q?: string; offset: number; limit: number }) {
    const all = this.dishes.filter((dish) => !q || dish.name.includes(q)).map((dish) => this.item(placeId, dish));
    return { items: all.slice(offset, offset + limit), total: all.length };
  }
  async countCatalog() {
    return this.dishes.length;
  }
  async get(placeId: string, id: string) {
    const dish = this.dishes.find((candidate) => candidate.id === id);
    return dish ? this.item(placeId, dish) : null;
  }
  async setLocalBalance(placeId: string, id: string, balance: number) {
    if (!this.dishes.some((dish) => dish.id === id)) return false;
    this.row(placeId, id).localBalance = balance;
    return true;
  }
  async setPlaceEnable(placeId: string, id: string, enable: boolean) {
    if (!this.dishes.some((dish) => dish.id === id)) return false;
    this.row(placeId, id).enable = enable;
    return true;
  }
}

export interface Fakes {
  deps: MobileApiDeps;
  users: Map<string, PanelUser>;
  places: PlaceInfo[];
  stock: FakeStock;
  devices: MemoryDevices;
  attempts: MemoryAttempts;
  powUses: MemoryPowUses;
  audits: AuditEvent[];
  env: { enabled: boolean; captcha: boolean; https: boolean; secret: string | undefined };
  clock: { now: number };
}

export async function makeFakes(): Promise<Fakes> {
  process.env.AP_PASSWORD_SALT = SALT;
  const access = await realAccessRights();
  const stockGrant = (...places: string[]) => ({ tokenId: "stock-manager", rights: places });

  const usersList = [
    makeUser(1, "admin", [], { isAdministrator: true }),
    makeUser(2, "stock", [{ name: "Stock Manager", tokens: ["access-to-adminpanel", stockGrant("p1", "p2")] }]),
    makeUser(3, "operator", [{ name: "Operator", tokens: ["access-to-adminpanel", "order-kanban"] }]),
    makeUser(4, "nopoints", [{ name: "Stock Manager", tokens: ["access-to-adminpanel", "stock-manager"] }]),
    makeUser(5, "outsider", [{ name: "Nobody", tokens: [] }]),
  ];
  const users = new Map(usersList.map((user) => [user.login, user]));
  const places: PlaceInfo[] = [
    { id: "p1", title: "Ленина, 5", address: "ул. Ленина, 5", isCookingPoint: true, isPickupPoint: true },
    { id: "p2", title: "Мира, 3", address: "пр. Мира, 3", isCookingPoint: true, isPickupPoint: false },
    { id: "p3", title: "Выдача", address: null, isCookingPoint: false, isPickupPoint: true },
  ];

  const registry = new MobileApiRegistry();
  const stock = new FakeStock();
  registerDishes(registry, stock);

  const env = { enabled: true, captcha: true, https: false, secret: "s3cret" as string | undefined };
  const clock = { now: Date.now() };
  const devices = new MemoryDevices();
  const attempts = new MemoryAttempts();
  const powUses = new MemoryPowUses();
  const audits: AuditEvent[] = [];
  const clone = <T>(value: T): T => (value ? structuredClone(value) : value);

  const deps: MobileApiDeps = {
    settings: {
      enabled: () => env.enabled,
      secret: () => env.secret,
      requireHttps: () => env.https,
      captchaEnabled: () => env.captcha,
      captchaBaseDifficultyMs: () => 20,
      trustProxy: 1,
    },
    registry,
    users: {
      findByLogin: async (login) => clone(users.get(login) ?? null),
      findById: async (id) => clone([...users.values()].find((user) => user.id === id) ?? null),
      verifyPassword: (user, login, password) => passwordHash.verify(login + password + SALT, user.passwordHashed),
      confirmationRequired: () => false,
    },
    access,
    places: { list: async () => places.filter((place) => (place as any).enable !== false) },
    facts: async () => ({ name: "Test server", version: "1.2.3", currency: "RUB", timezone: "Europe/Moscow", locale: "ru" }),
    devices,
    powUses,
    attempts,
    puzzle: cryptoPuzzle(),
    audit: (event) => audits.push(event),
    log: { info() {}, warn() {}, error() {} },
    now: () => clock.now,
  };

  return { deps, users, places, stock, devices, attempts, powUses, audits, env, clock };
}

/**
 * The application on an ephemeral port; requests through global fetch. `listen` and `address` are
 * net.Server's own: tests/graphql.middleware.test.ts replaces them on http.Server.prototype for the
 * whole mocha process with a fake that never binds.
 */
export async function listen(app: any): Promise<{ url: string; close(): Promise<void> }> {
  const server: Server = http.createServer(app);
  await new Promise<void>((resolve) => (net.Server.prototype.listen as any).call(server, 0, "127.0.0.1", () => resolve()));
  const { port } = net.Server.prototype.address.call(server) as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(() => resolve())),
  };
}

export async function solve(task: number[]): Promise<string> {
  const adminizerDir = path.dirname(require.resolve("adminizer"));
  const entry = require.resolve("crypto-puzzle", { paths: [adminizerDir] });
  const Puzzle = (await import(pathToFileURL(entry).href)).default;
  return Puzzle.solve(Uint8Array.from(task));
}
