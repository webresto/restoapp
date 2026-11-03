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
import type { OrderItem, OrdersActor, OrdersPort } from "../../api/hooks/app-mobile-api/apps/orders";
import type { ClientCard, ClientItem, ClientsPort } from "../../api/hooks/app-mobile-api/apps/clients";
import type { PosActor, PosOrder, PosPort } from "../../api/hooks/app-mobile-api/apps/pos";
import { MobileApiRegistry } from "../../api/hooks/app-mobile-api/lib/registry";
import { registerDishes } from "../../api/hooks/app-mobile-api/apps/dishes";
import { NO_KITCHEN, registerOrders } from "../../api/hooks/app-mobile-api/apps/orders";
import { registerClients } from "../../api/hooks/app-mobile-api/apps/clients";
import { registerPos } from "../../api/hooks/app-mobile-api/apps/pos";
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

/** The real AccessRightsHelper of the installed adminizer, with core's own contextual checks. */
export async function realAccessRights(): Promise<any> {
  const adminizerDir = path.dirname(require.resolve("adminizer"));
  // require, not import(): under mocha only the CJS hook of tsx is on, and adminizer's own imports
  // need its resolution (directory imports) — as in the running server, which lifts under tsx.
  const { AccessRightsHelper } = require(path.join(adminizerDir, "helpers/accessRightsHelper.js"));
  const { checkStockManagerToken } = require("@webresto/core/lib/adminpanel/stock-manager-rights");
  const { checkOrderKanbanToken } = require("@webresto/core/lib/adminpanel/order-kanban-rights");
  const { checkOrderEntryToken } = require("@webresto/core/lib/adminpanel/order-entry-rights");
  const helper = new AccessRightsHelper({ config: { auth: { enable: true } } });
  helper.registerTokens([
    { id: "access-to-adminpanel", name: "Access", description: "Access to the panel", department: "General" },
    { id: "stock-manager", name: "Stock Manager", description: "Stock", department: "Catalog", check: checkStockManagerToken },
    { id: "order-kanban", name: "Current Orders", description: "Orders", department: "Orders", check: checkOrderKanbanToken },
    { id: "order-entry", name: "Order entry", description: "Takes orders", department: "Orders", check: checkOrderEntryToken },
  ]);
  // The model rights of the web operator (`config/adminpanel.js`), registered as adminizer does:
  // one set per resource of `config.adminpanel.models` — `order` and `Customer` (core's `user`).
  helper.registerModelTokens("order");
  helper.registerModelTokens("Customer");
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


/**
 * Four orders at three points, moved by core's own state flow: the rows are in memory, the rules
 * are not. One order waits at «Без кухни», as one that reached the staff without one does.
 */
export class FakeOrders implements OrdersPort {
  rows = [
    { id: "o1", number: "AAAA1111", place: "p1", state: "ORDER", customerName: "Иван", phone: "+70000000001", method: "delivery", address: "ул. Ленина, 5", comment: "Домофон 12", total: 1200, deliveryCost: 200, paid: false, createdAt: 1000, updatedAt: 1000 },
    { id: "o2", number: "BBBB2222", place: "p2", state: "ORDER", customerName: "Пётр", phone: "+70000000002", method: "pickup", address: null as string | null, comment: null as string | null, total: 540, deliveryCost: 0, paid: true, createdAt: 2000, updatedAt: 2000 },
    { id: "o3", number: "CCCC3333", place: "p1", state: "DONE", customerName: "Анна", phone: "+70000000003", method: "delivery", address: "пр. Мира, 3", comment: null as string | null, total: 800, deliveryCost: 150, paid: true, createdAt: 3000, updatedAt: 3000 },
    { id: "o4", number: "DDDD4444", place: NO_KITCHEN, state: "ORDER", customerName: "Ольга", phone: "+70000000004", method: "delivery", address: "ул. Садовая, 1", comment: null as string | null, total: 300, deliveryCost: 100, paid: false, createdAt: 4000, updatedAt: 4000 },
  ];
  /** Every move that went through, as the journal of core would have it. */
  moves: Array<{ id: string; to: string; device: string | null }> = [];
  now = 5000;

  private flow() {
    return require("@webresto/core/lib/order/OrderStateFlow");
  }

  private item(row: (typeof this.rows)[number], user: unknown, withContents = false): OrderItem {
    const { getAllowedOrderTransitionsByRole, isOperatorUser } = this.flow();
    return {
      id: row.id,
      number: row.number,
      title: `№ ${row.number}`,
      summary: [row.customerName, row.method].filter(Boolean).join(" · "),
      state: row.state,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      customerName: row.customerName,
      customerPhone: row.phone,
      method: row.method,
      address: row.address,
      comment: row.comment,
      contents: withContents ? `1 × Борщ\n2 × Плов` : "",
      deliveryCost: row.deliveryCost,
      total: row.total,
      paid: row.paid,
      allowedTransitions: getAllowedOrderTransitionsByRole(row.state, isOperatorUser(user)),
      placeId: row.place,
    };
  }

  private of(place: string, id: string) {
    return this.rows.find((row) => row.id === id && row.place === place) ?? null;
  }

  private tabOf(row: (typeof this.rows)[number]): "active" | "done" {
    return ["DONE", "REJECT"].includes(row.state) ? "done" : "active";
  }

  async list(place: string, { tab, since, user }: { tab: "active" | "done"; since?: number | null; user: unknown }) {
    return this.rows
      .filter((row) => row.place === place && this.tabOf(row) === tab)
      .filter((row) => typeof since !== "number" || row.updatedAt >= since)
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((row) => this.item(row, user));
  }

  async counts(place: string) {
    const mine = this.rows.filter((row) => row.place === place);
    return {
      active: mine.filter((row) => this.tabOf(row) === "active").length,
      done: mine.filter((row) => this.tabOf(row) === "done").length,
    };
  }

  async get(place: string, id: string, user: unknown) {
    const row = this.of(place, id);
    return row ? this.item(row, user, true) : null;
  }

  async setState(place: string, id: string, to: string, { user, device }: OrdersActor) {
    const row = this.of(place, id);
    if (!row) return { ok: false as const, reason: "not_found" as const };
    const { getAllowedOrderTransitionsByRole, isOperatorUser } = this.flow();
    const allowed = getAllowedOrderTransitionsByRole(row.state, isOperatorUser(user));
    if (!allowed.includes(to)) return { ok: false as const, reason: "forbidden" as const, allowed };
    row.state = to;
    row.updatedAt = ++this.now;
    if (to === "DONE") row.paid = true;
    this.moves.push({ id, to, device });
    return { ok: true as const, item: this.item(row, user, true) };
  }

  async assignKitchen(place: string, id: string, kitchen: string, { user, device }: OrdersActor) {
    const row = this.of(place, id);
    if (!row || place !== NO_KITCHEN) return { ok: false as const, reason: "not_found" as const };
    if (row.method !== "delivery") {
      return { ok: false as const, reason: "conflict" as const, message: "This order is collected at the point the customer chose" };
    }
    row.place = kitchen;
    row.updatedAt = ++this.now;
    this.moves.push({ id, to: `kitchen:${kitchen}`, device });
    return { ok: true as const, item: this.item(row, user, true) };
  }
}

/** Three customers, one of them already known by number — the one a search is supposed to find. */
export class FakeClients implements ClientsPort {
  rows: ClientItem[] = [
    { id: "u1", title: "Иван Петров", firstName: "Иван", lastName: "Петров", phone: "+7 9990000001", email: null, verified: true, orderCount: 3, createdAt: 1000 },
    { id: "u2", title: "Анна", firstName: "Анна", lastName: null, phone: "+7 9990000002", email: "anna@example.com", verified: false, orderCount: 0, createdAt: 2000 },
    { id: "u3", title: "+7 9995550033", firstName: null, lastName: null, phone: "+7 9995550033", email: null, verified: false, orderCount: 1, createdAt: 3000 },
  ];
  private seq = 3;

  async list({ q }: { q?: string }) {
    if (!q) return [...this.rows].sort((a, b) => b.createdAt - a.createdAt);
    const digits = q.replace(/\D/g, "");
    const needle = q.toLowerCase();
    return this.rows.filter((row) =>
      (digits.length >= 3 && (row.phone ?? "").replace(/\D/g, "").includes(digits)) ||
      row.title.toLowerCase().includes(needle) ||
      (row.email ?? "").toLowerCase().includes(needle));
  }

  async get(id: string) {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) return null;
    const card: ClientCard = { ...row, addresses: row.id === "u1" ? ["ул. Ленина, 5, кв. 12"] : [], orders: row.id === "u1" ? ["№1001 · 2026-05-12 · 1200 · DONE"] : [] };
    return card;
  }

  /** As `materializeUser` is: the same number answers with the person who already has it. */
  async create({ name, phone, email }: { name: string; phone: string; email?: string }) {
    const digits = phone.replace(/\D/g, "");
    const existing = this.rows.find((row) => (row.phone ?? "").replace(/\D/g, "") === digits);
    if (existing) return existing;
    const created: ClientItem = {
      id: `u${++this.seq}`,
      title: name,
      firstName: name,
      lastName: null,
      phone,
      email: email ?? null,
      verified: false,
      orderCount: 0,
      createdAt: 4000,
    };
    this.rows.push(created);
    return created;
  }
}

/** Drafts in memory: whose cart it is and at which point — the questions the table answers. */
export class FakePos implements PosPort {
  rows: Array<PosOrder & { userId: string }> = [];
  private seq = 0;

  private blank(place: string, id: string, clientId?: string): PosOrder {
    return {
      id,
      number: id.toUpperCase(),
      state: "CART",
      serviceType: place === "p2" ? "pickup" : "dine-in",
      placeId: place,
      cookingPlaceId: place,
      cookingPlaceTitle: place,
      table: null,
      customerName: null,
      customerPhone: null,
      clientId: clientId ?? null,
      address: null,
      comment: null,
      personsCount: null,
      date: null,
      maxWaitMinutes: null,
      paymentMethodId: null,
      paymentMethodTitle: null,
      promotionCode: null,
      lines: [],
      dishesCount: 0,
      basketTotal: 0,
      discountTotal: 0,
      deliveryCost: 0,
      bonusesTotal: 0,
      total: 0,
      message: null,
      createdAt: 1000 + this.seq,
      updatedAt: 1000 + this.seq,
    };
  }

  async drafts(place: string, userId: string) {
    return this.rows
      .filter((row) => row.placeId === place && row.userId === userId)
      .map(({ userId: _owner, ...order }) => order)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async get(place: string, userId: string, id: string) {
    const row = this.rows.find((candidate) => candidate.id === id && candidate.placeId === place && candidate.userId === userId);
    if (!row) return null;
    const { userId: _owner, ...order } = row;
    return order;
  }

  async start(place: string, actor: PosActor, clientId?: string) {
    const order = this.blank(place, `draft${++this.seq}`, clientId);
    this.rows.push({ ...order, userId: actor.userId });
    return order;
  }

  async cancel(place: string, userId: string, id: string) {
    const index = this.rows.findIndex((row) => row.id === id && row.placeId === place && row.userId === userId);
    if (index === -1) return false;
    this.rows.splice(index, 1);
    return true;
  }
}

export interface Fakes {
  deps: MobileApiDeps;
  users: Map<string, PanelUser>;
  places: PlaceInfo[];
  stock: FakeStock;
  orders: FakeOrders;
  clients: FakeClients;
  pos: FakePos;
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
  const ordersGrant = (...places: string[]) => ({ tokenId: "order-kanban", rights: places });
  const entryGrant = (...places: string[]) => ({ tokenId: "order-entry", rights: places });
  const ORDER_MODEL = ["read-order-model", "update-order-model"];
  const CUSTOMER_MODEL = ["read-customer-model", "create-customer-model"];

  const usersList = [
    makeUser(1, "admin", [], { isAdministrator: true }),
    makeUser(2, "stock", [{ name: "Stock Manager", tokens: ["access-to-adminpanel", stockGrant("p1", "p2")] }]),
    makeUser(3, "operator", [{ name: "Operator", tokens: ["access-to-adminpanel", ordersGrant("p1", "p3"), ...ORDER_MODEL] }]),
    makeUser(4, "nopoints", [{ name: "Stock Manager", tokens: ["access-to-adminpanel", "stock-manager"] }]),
    makeUser(5, "outsider", [{ name: "Nobody", tokens: [] }]),
    // Hands orders that arrived without a kitchen to one: «Без кухни» plus the kitchens themselves.
    makeUser(6, "dispatcher", [{ name: "Operator", tokens: ["access-to-adminpanel", ordersGrant("p1", "p2", NO_KITCHEN), ...ORDER_MODEL] }]),
    // Reads orders of a point but may not write them: no `update-order-model`.
    makeUser(7, "watcher", [{ name: "Operator", tokens: ["access-to-adminpanel", ordersGrant("p1"), "read-order-model"] }]),
    // Takes orders at one point and sees the customers: the terminal of «Ленина, 5».
    makeUser(8, "taker", [{ name: "Order Taker", tokens: ["access-to-adminpanel", entryGrant("p1"), ...CUSTOMER_MODEL] }]),
    // Takes orders at the other point: the same app, nothing of the first one's drafts.
    makeUser(9, "taker2", [{ name: "Order Taker", tokens: ["access-to-adminpanel", entryGrant("p2"), ...CUSTOMER_MODEL] }]),
    // May look customers up but not add them: only `read-customer-model`.
    makeUser(10, "reader", [{ name: "Reader", tokens: ["access-to-adminpanel", "read-customer-model"] }]),
  ];
  const users = new Map(usersList.map((user) => [user.login, user]));
  const places: PlaceInfo[] = [
    { id: "p1", title: "Ленина, 5", address: "ул. Ленина, 5", isCookingPoint: true, isPickupPoint: true },
    { id: "p2", title: "Мира, 3", address: "пр. Мира, 3", isCookingPoint: true, isPickupPoint: false },
    { id: "p3", title: "Выдача", address: null, isCookingPoint: false, isPickupPoint: true },
  ];

  const registry = new MobileApiRegistry();
  const stock = new FakeStock();
  const orders = new FakeOrders();
  const clients = new FakeClients();
  const pos = new FakePos();
  registerDishes(registry, stock);
  registerOrders(registry, orders);
  registerClients(registry, clients);
  registerPos(registry, pos);

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

  return { deps, users, places, stock, orders, clients, pos, devices, attempts, powUses, audits, env, clock };
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
