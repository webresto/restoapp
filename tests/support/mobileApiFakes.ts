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
import type { PosActor, PosChosenOption, PosMessage, PosOptionGroup, PosOrder, PosPort, PosStep } from "../../api/hooks/app-mobile-api/apps/pos";
import type { ApplicationItem, CatalogDish, CodeItem, MarketingPort, PromotionItem } from "../../api/hooks/app-mobile-api/apps/marketing";
import type { ChannelItem, ChannelTypeItem, ChannelsPort, RemovedChannel, ToggledChannel } from "../../api/hooks/app-mobile-api/apps/channels";
import type { CatalogItem, JobRefusal, ModuleJob, ModuleCard, ModuleItem, ServerState, SystemPort } from "../../api/hooks/app-mobile-api/apps/system";
import { MobileApiRegistry } from "../../api/hooks/app-mobile-api/lib/registry";
import { registerDishes } from "../../api/hooks/app-mobile-api/apps/dishes";
import { NO_KITCHEN, registerOrders } from "../../api/hooks/app-mobile-api/apps/orders";
import { registerClients } from "../../api/hooks/app-mobile-api/apps/clients";
import { registerPos } from "../../api/hooks/app-mobile-api/apps/pos";
import { registerMarketing } from "../../api/hooks/app-mobile-api/apps/marketing";
import { registerChannels } from "../../api/hooks/app-mobile-api/apps/channels";
import { registerSettings, type SettingsPort, type SettingRow, type TransferEntry } from "../../api/hooks/app-mobile-api/apps/settings";
import { registerSystem } from "../../api/hooks/app-mobile-api/apps/system";
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
    { id: "promocodes-manager", name: "Promo codes", description: "Promo codes", department: "Marketing" },
    { id: "promotions-manager", name: "Promotions", description: "Promotions", department: "Marketing" },
    // «Каналы продаж»: the legacy token of the page and the two levels that replaced it (core's manifest).
    { id: "sales-channels-manager", name: "Sales Channels", description: "Legacy full access", department: "Store" },
    { id: "sales-channels-view", name: "Sales Channels view", description: "Read-only", department: "Store" },
    { id: "sales-channels-manage", name: "Sales Channels manage", description: "Write", department: "Store" },
    // Core's own token of the Settings page (`lib/adminpanel/manifest.ts`): one right to look and to write.
    { id: "settings-manager", name: "Settings", description: "Settings", department: "System" },
    // The right of the Extensions page: the programs and the restart of «Система», the install of a channel's provider.
    { id: "modules-process-upgrade", name: "Extensions", description: "The modules and the restart", department: "Store" },
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
      canCheck: false,
      canPlace: false,
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

  // ---- the rest of the flow, in memory: enough for the access and the schemas, no core ----

  /** The three dishes of {@link FakeStock}, as a one-group catalog. */
  async catalog(place: string, id: string, { group, q, offset, limit }: { group?: string; q?: string; offset: number; limit: number }) {
    const order = this.rows.find((row) => row.id === id);
    const products = new FakeStock().dishes
      .filter((dish) => !q || dish.name.toLowerCase().includes(q.toLowerCase()))
      .map((dish) => ({
        id: dish.id,
        name: dish.name,
        code: dish.code,
        groupId: "g1",
        price: dish.price,
        salePrice: null,
        balance: -1,
        weight: null,
        imageUrl: null,
        hasOptions: FakePos.GROUPS.length > 0 && dish.id === FakePos.WITH_OPTIONS,
        inOrder: order?.lines.filter((line) => line.dishId === dish.id).reduce((sum, line) => sum + line.amount, 0) ?? 0,
      }));
    return {
      path: group ? [{ id: "g1", name: "Меню", imageUrl: null }] : [],
      groups: group ? [] : [{ id: "g1", name: "Меню", imageUrl: null }],
      items: products.slice(offset, offset + limit),
      nextCursor: null,
      total: products.length,
    };
  }

  private step(id: string, change?: (order: PosOrder) => PosMessage | null): PosStep {
    const order = this.rows.find((row) => row.id === id);
    if (!order) return { order: null, message: null, ok: false };
    const message = change ? change(order) : null;
    order.basketTotal = order.lines.reduce((sum, line) => sum + line.total, 0);
    order.total = order.basketTotal;
    order.dishesCount = order.lines.reduce((sum, line) => sum + line.amount, 0);
    order.canCheck = order.dishesCount > 0 && Boolean(order.customerPhone);
    order.canPlace = order.state === "CHECKOUT";
    const { userId: _owner, ...view } = order;
    return { order: view, message, ok: message === null || message.tone !== "danger" };
  }

  async addProduct(place: string, id: string, dishId: string, amount: number, modifiers?: PosChosenOption[]) {
    const chosen = modifiers ?? [];
    const refusal = chosen.length ? FakePos.refuse(dishId, chosen) : null;
    if (refusal) return this.step(id, () => refusal);
    return this.step(id, (order) => {
      const dish = new FakeStock().dishes.find((candidate) => candidate.id === dishId);
      if (!dish) return { key: "mobile.pos.error.noLine", tone: "danger" };
      // A line with options is its own line: two guests want different sauces on the same dish.
      const line = chosen.length ? undefined : order.lines.find((candidate) => candidate.dishId === dishId);
      if (line) {
        line.amount += amount;
        line.total = line.amount * line.price;
      } else {
        const price = dish.price + FakePos.extra(chosen);
        order.lines.push({
          lineId: order.lines.length + 1,
          dishId,
          name: dish.name,
          amount,
          price,
          total: price * amount,
          oldPrice: null,
          comment: null,
          hasOptions: dishId === FakePos.WITH_OPTIONS,
          options: FakePos.named(chosen),
        });
      }
      return null;
    });
  }

  async options(place: string, id: string, { dishId, lineId }: { dishId?: string; lineId?: number }) {
    const order = this.rows.find((row) => row.id === id);
    const line = lineId !== undefined ? order?.lines.find((candidate) => candidate.lineId === lineId) : undefined;
    if (lineId !== undefined && !line) return null;
    const productId = line ? line.dishId : dishId;
    const dish = new FakeStock().dishes.find((candidate) => candidate.id === productId);
    if (!dish) return null;
    const taken = new Map((line?.options ?? []).map((option) => [option.id, option.amount]));
    return {
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      lineId: line ? line.lineId : null,
      amount: line ? line.amount : 1,
      groups: (dish.id === FakePos.WITH_OPTIONS ? FakePos.GROUPS : []).map((group) => ({
        ...group,
        options: group.options.map((option) => ({
          ...option,
          // A line's own choice, or the default core would have filled in.
          amount: line ? taken.get(option.id) ?? 0 : option.defaultAmount,
        })),
      })),
    };
  }

  async setLineOptions(place: string, id: string, lineId: number, modifiers: PosChosenOption[]) {
    const order = this.rows.find((row) => row.id === id);
    const line = order?.lines.find((candidate) => candidate.lineId === lineId);
    if (!line) return this.step(id, () => ({ key: "mobile.pos.error.noLine", tone: "danger" }));
    const refusal = FakePos.refuse(line.dishId, modifiers);
    if (refusal) return this.step(id, () => refusal);
    return this.step(id, () => {
      const dish = new FakeStock().dishes.find((candidate) => candidate.id === line.dishId);
      line.options = FakePos.named(modifiers);
      line.price = (dish?.price ?? 0) + FakePos.extra(modifiers);
      line.total = line.price * line.amount;
      return null;
    });
  }

  async setLineAmount(place: string, id: string, lineId: number, amount: number) {
    return this.step(id, (order) => {
      const line = order.lines.find((candidate) => candidate.lineId === lineId);
      if (!line) return { key: "mobile.pos.error.noLine", tone: "danger" };
      if (amount <= 0) order.lines = order.lines.filter((candidate) => candidate.lineId !== lineId);
      else {
        line.amount = amount;
        line.total = line.price * amount;
      }
      return null;
    });
  }

  async setLineComment(place: string, id: string, lineId: number, comment: string) {
    return this.step(id, (order) => {
      const line = order.lines.find((candidate) => candidate.lineId === lineId);
      if (!line) return { key: "mobile.pos.error.noLine", tone: "danger" };
      line.comment = comment;
      return null;
    });
  }

  async serviceOptions(place: string) {
    return [
      { id: "delivery", available: true, reason: null },
      { id: "pickup", available: place === "p1", reason: place === "p1" ? null : "mobile.pos.service.noCounter" },
      { id: "dine-in", available: place === "p1", reason: place === "p1" ? null : "mobile.pos.service.noRoom" },
    ];
  }

  async setService(place: string, id: string, serviceType: string, table?: string) {
    const options = await this.serviceOptions(place);
    return this.step(id, (order) => {
      if (!options.find((option) => option.id === serviceType)?.available) {
        return { key: "mobile.pos.error.serviceUnavailable", tone: "danger" };
      }
      order.serviceType = serviceType;
      order.table = serviceType === "dine-in" ? table ?? null : null;
      return null;
    });
  }

  async setTable(place: string, id: string, table: string) {
    return this.step(id, (order) => {
      if (order.serviceType !== "dine-in") return { key: "mobile.pos.error.tableNotDineIn", tone: "danger" };
      order.table = table;
      return null;
    });
  }

  async setAddress(place: string, id: string, address: Record<string, unknown>) {
    return this.step(id, (order) => {
      order.address = [address.street, address.home].filter(Boolean).join(", ");
      return null;
    });
  }

  async addressSearch(city: string, parent: string | undefined, q: string) {
    return [{ id: "node-1", name: `${q} улица`, type: "street" }];
  }

  async cities() {
    return [{ id: "c1", name: "Город" }];
  }

  async clientAddresses(clientId: string) {
    return clientId === "u1" ? [{ id: "loc-1", formatted: "ул. Ленина, 5, кв. 12" }] : [];
  }

  async setCustomer(place: string, id: string, input: { name: string; phone: string; createClient?: boolean }) {
    return this.step(id, (order) => {
      order.customerName = input.name;
      order.customerPhone = input.phone;
      if (input.createClient) order.clientId = "u-new";
      return null;
    });
  }

  async setClient(place: string, id: string, clientId: string) {
    return this.step(id, (order) => {
      if (clientId !== "u1") return { key: "mobile.pos.error.noClient", tone: "danger" };
      order.clientId = clientId;
      order.customerName = "Иван Петров";
      order.customerPhone = "+7 9990000001";
      return null;
    });
  }

  async timeOptions() {
    return { asap: true, slots: [[1_700_000_000_000, 1_700_003_600_000]] as Array<[number, number]>, minCookingMinutes: 20 };
  }

  async setTime(place: string, id: string, input: { mode: string; date?: number; maxWaitMinutes?: number }) {
    return this.step(id, (order) => {
      if (input.mode === "time" && !input.date) return { key: "mobile.pos.error.noTime", tone: "danger" };
      order.date = input.mode === "time" ? input.date ?? null : null;
      order.maxWaitMinutes = input.mode === "maxWait" ? input.maxWaitMinutes ?? null : null;
      return null;
    });
  }

  async payments() {
    return [
      { id: "cash", title: "Наличные", isPromise: true, available: true },
      { id: "online", title: "Онлайн", isPromise: false, available: false },
    ];
  }

  async setPayment(place: string, id: string, paymentMethodId: string) {
    return this.step(id, (order) => {
      if (paymentMethodId === "online") return { key: "mobile.pos.error.onlinePayment", tone: "danger" };
      if (paymentMethodId !== "cash") return { key: "mobile.pos.error.noPayment", tone: "danger" };
      order.paymentMethodId = "cash";
      order.paymentMethodTitle = "Наличные";
      return null;
    });
  }

  async setDetails(place: string, id: string, input: { comment?: string; personsCount?: number }) {
    return this.step(id, (order) => {
      if (input.comment !== undefined) order.comment = input.comment;
      if (input.personsCount !== undefined) order.personsCount = input.personsCount;
      return null;
    });
  }

  async promocode(place: string, id: string, code: string | null) {
    return this.step(id, (order) => {
      order.promotionCode = code;
      if (!code) return { key: "mobile.pos.promocode.off", tone: "info" };
      return code === "LETO20"
        ? { key: "mobile.pos.promocode.on", tone: "success" }
        : { key: "mobile.pos.promocode.invalid", tone: "danger" };
    });
  }

  async check(place: string, id: string) {
    const order = this.rows.find((row) => row.id === id);
    if (!order) return { order: null, message: null, ok: false };
    if (!order.lines.length) return { ...this.step(id), message: { key: "order.error.13", tone: "danger" }, ok: false };
    if (!order.customerPhone) return { ...this.step(id), message: { key: "order.error.2", tone: "danger" }, ok: false };
    order.state = "CHECKOUT";
    return { ...this.step(id), message: { key: "mobile.pos.ready", tone: "success" }, ok: true };
  }

  async place(place: string, id: string) {
    const order = this.rows.find((row) => row.id === id && row.placeId === place);
    if (!order) return { order: null, message: null, ok: false };
    if (order.state !== "CHECKOUT") return { ...this.step(id), message: { key: "mobile.pos.error.checkFirst", tone: "danger" }, ok: false };
    order.state = "ORDER";
    const placed = this.step(id);
    this.rows = this.rows.filter((row) => row.id !== id);
    return { ...placed, message: { key: "mobile.pos.placed", arg: order.number, tone: "success" }, ok: true };
  }

  // ---- the options of the one dish that has them ----

  /** «Плов» of {@link FakeStock}: a sauce that must be chosen, and extras that need not be. */
  static readonly WITH_OPTIONS = "d2";

  static readonly GROUPS: PosOptionGroup[] = [
    {
      id: "sauce",
      name: "Соус",
      required: true,
      minAmount: 1,
      maxAmount: 1,
      single: true,
      options: [
        { id: "m1", name: "Сметана", price: 0, balance: -1, amount: 0, minAmount: 0, maxAmount: 1, freeAmount: 0, defaultAmount: 1 },
        { id: "m2", name: "Острый", price: 50, balance: -1, amount: 0, minAmount: 0, maxAmount: 1, freeAmount: 0, defaultAmount: 0 },
      ],
    },
    {
      id: "extra",
      name: "Добавки",
      required: false,
      minAmount: 0,
      maxAmount: 3,
      single: false,
      options: [
        { id: "m3", name: "Зелень", price: 30, balance: -1, amount: 0, minAmount: 0, maxAmount: 3, freeAmount: 1, defaultAmount: 0 },
      ],
    },
  ];

  /** The rules of the groups, as the real adapter checks them: a refusal in words. */
  static refuse(dishId: string, chosen: PosChosenOption[]): PosMessage | null {
    const groups = dishId === FakePos.WITH_OPTIONS ? FakePos.GROUPS : [];
    const taken = chosen.filter((entry) => entry.amount > 0);
    const known = new Set(groups.flatMap((group) => group.options.map((option) => option.id)));
    if (taken.some((entry) => !known.has(entry.id))) return { key: "mobile.pos.error.optionUnknown", tone: "danger" };
    for (const group of groups) {
      const ids = new Set(group.options.map((option) => option.id));
      const sum = taken.filter((entry) => ids.has(entry.id)).reduce((total, entry) => total + entry.amount, 0);
      if (sum < group.minAmount) return { key: "mobile.pos.error.optionMin", arg: group.name, tone: "danger" };
      if (group.maxAmount !== null && sum > group.maxAmount) return { key: "mobile.pos.error.optionMax", arg: group.name, tone: "danger" };
    }
    return null;
  }

  /** What the options add to one dish, the free ones not charged — core's own arithmetic. */
  static extra(chosen: PosChosenOption[]): number {
    const flat = FakePos.GROUPS.flatMap((group) => group.options);
    return chosen.reduce((sum, entry) => {
      const option = flat.find((candidate) => candidate.id === entry.id);
      if (!option) return sum;
      return sum + Math.max(0, entry.amount - option.freeAmount) * option.price;
    }, 0);
  }

  static named(chosen: PosChosenOption[]): Array<{ id: string; name: string; amount: number }> {
    const flat = FakePos.GROUPS.flatMap((group) => group.options);
    return chosen
      .filter((entry) => entry.amount > 0)
      .map((entry) => ({ id: entry.id, name: flat.find((option) => option.id === entry.id)?.name ?? entry.id, amount: entry.amount }));
  }
}

/**
 * «Маркетинг» in memory: three codes and four promotions, and the applications of them, with the words a screen
 * shows already built — the shape core's marketing layer answers, without core.
 *
 *   LETO10  active, 10% off the basket by «Летняя скидка» (only by code)
 *   SOON    scheduled for next year, linked to «Счастливые часы»
 *   DEAD    active, and gives nothing: its only promotion is switched off
 */
export class FakeMarketing implements MarketingPort {
  promotionRows = [
    { id: "pr-summer", name: "Летняя скидка", enable: true, onlyByCode: true, createdByUser: true, percent: 10, flat: 0, codes: ["LETO10"], gift: "" },
    { id: "pr-happy", name: "Счастливые часы", enable: true, onlyByCode: false, createdByUser: true, percent: 0, flat: 150, codes: ["SOON"], gift: "" },
    { id: "pr-gift", name: "Подарок к заказу", enable: true, onlyByCode: false, createdByUser: true, percent: 0, flat: 0, codes: [] as string[], gift: "Подарок: 2 шт. от 1 449 ₽" },
    { id: "pr-off", name: "Старая акция", enable: false, onlyByCode: false, createdByUser: false, percent: 5, flat: 0, codes: ["DEAD"], gift: "" },
  ];

  codeRows = [
    { id: "code-leto", code: "LETO10", status: "active", worksNow: true, description: "Лето 2026", period: "с 22.10.2026 по 31.10.2026", schedule: "круглосуточно", enable: true },
    { id: "code-soon", code: "SOON", status: "scheduled", worksNow: false, description: "Откроется позже", period: "с 01.01.2027", schedule: "круглосуточно", enable: true },
    { id: "code-dead", code: "DEAD", status: "active", worksNow: true, description: "Код без рабочих акций", period: "без ограничения", schedule: "круглосуточно", enable: true },
  ];

  applicationRows = [
    { id: "o-1", shortId: "1001", code: "LETO10", status: "applied", discount: 111.3, createdAt: 1_762_000_000_000, why: "", orderState: "DONE" },
    { id: "o-2", shortId: "1002", code: "LETO10", status: "invalid", discount: 0, createdAt: 1_762_100_000_000, why: "корзина меньше 1 449 ₽", orderState: "CART" },
    { id: "o-3", shortId: "1003", code: "DEAD", status: "invalid", discount: 0, createdAt: 1_762_200_000_000, why: "все акции кода выключены — код ничего не даёт", orderState: "CART" },
  ];

  dishes: CatalogDish[] = [
    { id: "d1", name: "Борщ", code: "B1", parentGroup: "g1", price: 300, notForSale: false, promo: false },
    { id: "d2", name: "Плов", code: "P1", parentGroup: "g1", price: 450, notForSale: false, promo: false },
    { id: "magnet", name: "Магнит", code: "M9", parentGroup: "g1", price: 0, notForSale: true, promo: false },
  ];

  saved: Array<Record<string, any>> = [];

  private promotionsOf(code: string) {
    return this.promotionRows.filter((promotion) => promotion.codes.includes(code));
  }

  private givesOf(promotion: (typeof this.promotionRows)[number]): string {
    if (promotion.gift) return promotion.gift;
    if (promotion.percent) return `−${promotion.percent}% на всю корзину`;
    if (promotion.flat) return `−${promotion.flat} ₽ на всю корзину`;
    return "ничего";
  }

  private codeItem(row: (typeof this.codeRows)[number]): CodeItem {
    const linked = this.promotionsOf(row.code);
    const working = linked.filter((promotion) => promotion.enable);
    return {
      id: row.id,
      code: row.code,
      status: row.enable ? row.status : "disabled",
      worksNow: row.enable && row.worksNow,
      description: row.description,
      gives: !linked.length
        ? "к коду не привязана ни одна акция"
        : !working.length
          ? "все акции кода выключены — код ничего не даёт"
          : working.map((promotion) => this.givesOf(promotion)).join("; "),
      promotions: linked.map((promotion) => promotion.name).join(", "),
      promotionsCount: linked.length,
      period: row.period,
      schedule: row.schedule,
      enable: row.enable,
      type: "static",
      prefix: "",
      externalId: "",
    };
  }

  private promotionItem(row: (typeof this.promotionRows)[number]): PromotionItem {
    const applies = !row.enable ? "disabled" : row.onlyByCode ? "code-only" : "self";
    return {
      id: row.id,
      name: row.name,
      badge: row.createdByUser ? "configured-promotion" : "module",
      enable: row.enable,
      onlyByCode: row.onlyByCode,
      appliesNow: applies,
      kind: row.createdByUser ? "configured" : "programmed",
      gives: this.givesOf(row),
      discountType: row.percent ? "percentage" : "flat",
      ...(row.percent ? { discountPercent: row.percent } : {}),
      ...(row.flat ? { discountFlat: row.flat } : {}),
      scope: "all",
      dishesCount: 0,
      groupsCount: 0,
      minBasketTotal: row.gift ? 1449 : 0,
      serviceTypes: "",
      gift: row.gift,
      isJoint: "joint",
      isPublic: !row.onlyByCode,
      sortOrder: 0,
      concept: "origin",
      schedule: "круглосуточно",
      promotionCodes: row.codes.join(", "),
      runtimeActive: row.enable,
      config: {
        description: `Описание ${row.name}`,
        concept: ["origin"],
        discountType: row.flat ? "flat" : "percentage",
        discountAmount: row.flat || row.percent,
        dishes: [],
        groups: [],
        excludeDishes: [],
        excludeGroups: [],
        serviceType: [],
        minBasketTotal: row.gift ? 1449 : 0,
        gift: row.gift ? { minBasketTotal: 1449, dishes: [{ dishId: "magnet", amount: 2 }] } : null,
        worktime: [],
      },
    };
  }

  private applicationItem(row: (typeof this.applicationRows)[number]): ApplicationItem {
    return {
      id: row.id,
      title: `№${row.shortId}`,
      code: row.code,
      status: row.status,
      discount: row.discount,
      createdAt: row.createdAt,
      why: row.why,
      orderState: row.orderState,
    };
  }

  async summary({ days, codes, promotions, money }: { days: number; codes: boolean; promotions: boolean; money: boolean }) {
    const item: Record<string, any> = { id: "summary", title: "", subtitle: "" };
    if (codes) {
      item.codesTotal = this.codeRows.length;
      item.codesActive = this.codeRows.filter((row) => row.enable && row.status === "active").length;
    }
    if (promotions) {
      item.promotionsTotal = this.promotionRows.length;
      item.promotionsSelf = this.promotionRows.filter((row) => row.enable && !row.onlyByCode).length;
      item.promotionsByCodeOnly = this.promotionRows.filter((row) => row.enable && row.onlyByCode).length;
    }
    if (money) {
      // The range is honoured, so a test can see the chips do something: the newest application only.
      const since = days <= 7 ? 1_762_150_000_000 : 0;
      const shown = this.applicationRows.filter((row) => row.createdAt >= since);
      item.applications = shown.length;
      item.totalDiscount = shown.reduce((sum, row) => sum + row.discount, 0);
      item.avgDiscount = shown.length ? item.totalDiscount / shown.length : 0;
      item.capped = false;
    }
    return item as any;
  }

  async codes({ q, status }: { q?: string; status?: string }) {
    const items = this.codeRows.map((row) => this.codeItem(row));
    const counts: Record<string, number> = { all: items.length, active: 0, scheduled: 0, expired: 0, disabled: 0 };
    for (const item of items) counts[item.status] = (counts[item.status] ?? 0) + 1;
    const needle = q?.toLowerCase();
    const found = items.filter((item) =>
      !needle || [item.code, item.description, item.promotions].join(" ").toLowerCase().includes(needle));
    return { items: status ? found.filter((item) => item.status === status) : found, counts, capped: false };
  }

  async code(id: string) {
    const row = this.codeRows.find((candidate) => candidate.id === id);
    return row ? this.codeItem(row) : null;
  }

  async setCodeEnabled(id: string, enable: boolean) {
    const row = this.codeRows.find((candidate) => candidate.id === id);
    if (!row) return null;
    row.enable = enable;
    return this.codeItem(row);
  }

  async saveCode(input: { id?: string; code: string; description: string; promotionId?: string }) {
    const taken = this.codeRows.find((row) => row.code === input.code.toUpperCase() && row.id !== input.id);
    if (taken) return { ok: false, reason: "taken" as const };
    const row = {
      id: input.id ?? `code-${this.codeRows.length + 1}`,
      code: input.code.toUpperCase(),
      status: "active",
      worksNow: true,
      description: input.description,
      period: "без ограничения",
      schedule: "круглосуточно",
      enable: true,
    };
    this.codeRows.push(row);
    const promotion = this.promotionRows.find((candidate) => candidate.id === input.promotionId);
    if (promotion) promotion.codes.push(row.code);
    return { ok: true, item: this.codeItem(row) };
  }

  async promotions({ q, filter, code }: { q?: string; filter?: string; code?: string }) {
    const items = this.promotionRows.map((row) => this.promotionItem(row));
    const counts: Record<string, number> = {
      all: items.length,
      self: items.filter((item) => item.appliesNow === "self").length,
      "code-only": items.filter((item) => item.appliesNow === "code-only").length,
      off: items.filter((item) => item.appliesNow === "disabled").length,
      configured: items.filter((item) => item.kind === "configured").length,
    };
    const needle = q?.toLowerCase();
    let chosen = items.filter((item) => !needle || item.name.toLowerCase().includes(needle));
    if (filter === "self") chosen = chosen.filter((item) => item.appliesNow === "self");
    if (filter === "code-only") chosen = chosen.filter((item) => item.appliesNow === "code-only");
    if (filter === "off") chosen = chosen.filter((item) => item.appliesNow === "disabled");
    if (filter === "configured") chosen = chosen.filter((item) => item.kind === "configured");
    if (code) chosen = chosen.filter((item) => item.promotionCodes.split(", ").includes(code));
    return { items: chosen, counts };
  }

  async promotion(id: string) {
    const row = this.promotionRows.find((candidate) => candidate.id === id);
    return row ? this.promotionItem(row) : null;
  }

  async setPromotionEnabled(id: string, enable: boolean) {
    const row = this.promotionRows.find((candidate) => candidate.id === id);
    if (!row) return null;
    row.enable = enable;
    return this.promotionItem(row);
  }

  async setPromotionOnlyByCode(id: string, onlyByCode: boolean) {
    const row = this.promotionRows.find((candidate) => candidate.id === id);
    if (!row) return null;
    row.onlyByCode = onlyByCode;
    return this.promotionItem(row);
  }

  async savePromotion(input: Record<string, any>) {
    const existing = input.id ? this.promotionRows.find((row) => row.id === input.id) : null;
    if (input.id && !existing) return { ok: false, reason: "not_found" as const };
    if (existing && !existing.createdByUser) return { ok: false, reason: "forbidden" as const, message: "Programmed promotions cannot be edited" };
    const gift = input.configDiscount?.gift;
    const giftDish = gift?.dishes?.[0]?.dishId;
    if (giftDish) {
      const dish = this.dishes.find((candidate) => candidate.id === giftDish);
      if (!dish) return { ok: false, reason: "invalid" as const, message: `Gift dish [${giftDish}] not found` };
      if (!dish.notForSale && !dish.promo) return { ok: false, reason: "invalid" as const, message: `Gift dish [${dish.name}] must be notForSale or promo` };
    }
    this.saved.push(input);
    const row = existing ?? {
      id: input.id ?? `pr-${this.promotionRows.length + 1}`,
      name: input.name,
      enable: input.enable !== false,
      onlyByCode: input.onlyByCode === true,
      createdByUser: true,
      percent: 0,
      flat: 0,
      codes: [] as string[],
      gift: "",
    };
    row.name = input.name;
    row.enable = input.enable !== false;
    row.onlyByCode = input.onlyByCode === true;
    row.percent = input.configDiscount?.discountType === "flat" ? 0 : Number(input.configDiscount?.discountAmount ?? 0);
    row.flat = input.configDiscount?.discountType === "flat" ? Number(input.configDiscount?.discountAmount ?? 0) : 0;
    row.gift = giftDish ? `Подарок: ${gift.dishes[0].amount} шт.` : "";
    if (!existing) this.promotionRows.push(row);
    return { ok: true, item: this.promotionItem(row) };
  }

  async catalog({ q, group, ids }: { q?: string; group?: string; ids?: string[] }) {
    const items = this.dishes.filter((dish) =>
      ids?.length ? ids.includes(dish.id) : q ? dish.name.toLowerCase().includes(q.toLowerCase()) : !group || dish.parentGroup === group);
    return { groups: q || ids?.length ? [] : [{ id: "g1", name: "Меню", parentGroup: null }], items };
  }

  async applications({ code, status }: { code?: string; status?: string }) {
    const items = this.applicationRows.filter((row) => !code || row.code === code).map((row) => this.applicationItem(row));
    const counts = {
      all: items.length,
      applied: items.filter((item) => item.status === "applied").length,
      invalid: items.filter((item) => item.status === "invalid").length,
    };
    return { items: status ? items.filter((item) => item.status === status) : items, counts, capped: false };
  }

  async application(orderId: string) {
    const row = this.applicationRows.find((candidate) => candidate.id === orderId);
    return row ? this.applicationItem(row) : null;
  }

  async promotionOptions() {
    return this.promotionRows.filter((row) => row.enable).map((row) => ({ id: row.id, name: row.name }));
  }
}

/**
 * «Каналы продаж» in memory — the answers core's sales-channel layer gives, without a database.
 *
 * The *words* are not faked: the texts of a view and of a refusal are core's own pure functions
 * (`lib/sales-channels/view.ts`, `refusalText`) over core's own admin dictionary, exactly as
 * `adapters/channels.ts` builds them on a real server. So what this fake stands in for is the
 * Waterline reading, not the language — a test that invented its own phrases would prove nothing
 * about the refusal a person actually reads.
 *
 *   web-main    website, provider installed and alive, ready and switched on — the channel that works
 *   tg-main     a bot whose provider is alive but says it is not set up: switching on is refused
 *   kiosk-hall  a type whose provider module is not installed at all: the switch is not even offered
 *   shop-bot    a provider's own channel, its module installed: it can only be switched off
 *   old-site    an operator's channel of a type that is coming soon: deletable, never switchable
 */
export class FakeChannels implements ChannelsPort {
  rows = [
    {
      id: "ch-web", key: "web-main", title: "Основной сайт", type: "web-storefront", typeTitle: "Website", category: "storefront",
      capabilities: ["orders:create", "menu:browse"], providerModule: "admin-frontend", marketplaceAppId: null as string | null,
      managedBy: "provider", enabled: true, status: "ready", statusMessage: null as string | null,
      providerInstalled: true, providerAlive: true, typeComingSoon: false, settingsUrl: "/admin/frontend/setup?channel=ch-web",
      countries: ["RU"], concepts: [] as string[], platforms: ["web", "pwa-ios"], defaultConcept: null as string | null,
      allowConceptSwitch: true, url: "https://example.org", sortOrder: 0, updatedAt: 1_762_000_000_000,
      settings: { theme: "light" } as Record<string, unknown>, secretsRef: { token: "vault://web-main-token" },
    },
    {
      id: "ch-tg", key: "tg-main", title: "Бот доставки", type: "telegram-bot", typeTitle: "Telegram bot", category: "messenger",
      capabilities: ["orders:create", "customers:identify"], providerModule: "sales-channel-telegram", marketplaceAppId: null,
      managedBy: "provider", enabled: false, status: "needs_setup", statusMessage: "Bot token is not set",
      providerInstalled: true, providerAlive: true, typeComingSoon: false, settingsUrl: "/admin/telegram/setup?channel=ch-tg",
      countries: ["RU"], concepts: ["origin"], platforms: ["telegram"], defaultConcept: "origin",
      allowConceptSwitch: false, url: "", sortOrder: 1, updatedAt: 1_762_100_000_000,
      settings: {}, secretsRef: { token: "vault://tg-token" },
    },
    {
      id: "ch-kiosk", key: "kiosk-hall", title: "Киоск в зале", type: "kiosk", typeTitle: "Self-order kiosk", category: "kiosk",
      capabilities: ["orders:create"], providerModule: "sales-channel-kiosk", marketplaceAppId: "sales-channel-kiosk",
      managedBy: "operator", enabled: false, status: "needs_setup", statusMessage: null,
      providerInstalled: false, providerAlive: false, typeComingSoon: false, settingsUrl: null,
      countries: [], concepts: [], platforms: ["kiosk-hall"], defaultConcept: null,
      allowConceptSwitch: true, url: "", sortOrder: 2, updatedAt: 1_762_200_000_000,
      settings: {}, secretsRef: null,
    },
    {
      id: "ch-shop", key: "shop-bot", title: "Бот магазина", type: "max-bot", typeTitle: "MAX bot", category: "messenger",
      capabilities: ["orders:create"], providerModule: "sales-channel-max", marketplaceAppId: null,
      managedBy: "provider", enabled: false, status: "ready", statusMessage: null,
      providerInstalled: true, providerAlive: true, typeComingSoon: false, settingsUrl: "/admin/max/setup?channel=ch-shop",
      countries: [], concepts: [], platforms: ["max"], defaultConcept: null,
      allowConceptSwitch: true, url: "", sortOrder: 3, updatedAt: 1_762_300_000_000,
      settings: {}, secretsRef: null,
    },
    {
      id: "ch-old", key: "old-site", title: "Старый сайт", type: "custom", typeTitle: "Custom channel", category: "custom",
      capabilities: ["orders:create"], providerModule: null, marketplaceAppId: null,
      managedBy: "operator", enabled: false, status: "draft", statusMessage: null,
      providerInstalled: false, providerAlive: false, typeComingSoon: true, settingsUrl: null,
      countries: [], concepts: [], platforms: [], defaultConcept: null,
      allowConceptSwitch: true, url: "http://old.example.org", sortOrder: 4, updatedAt: 1_762_400_000_000,
      settings: {}, secretsRef: null,
    },
  ];

  removed: string[] = [];

  /** `Settings.get("COUNTRY_ISO")`, and what is installed and alive for the catalog of types. */
  country = "RU";
  installedModules = new Set<string>(["admin-frontend"]);
  aliveTypes = new Set<string>(["web-storefront"]);

  /** core's own dictionary of the admin panel, the one `adapters/channels.ts` reads (C31). */
  private words(lang: string): (key: string) => string {
    const { getAdminpanelMessages, resolveAdminpanelLocale } = require("@webresto/core/lib/adminpanel/src/controller/i18n-messages");
    const dictionary = getAdminpanelMessages(resolveAdminpanelLocale(lang));
    return (key: string) => dictionary[key] ?? key;
  }

  /** The fourteen types of core, as `describeChannelType` sees them with this fake's modules. */
  private registry() {
    const { SalesChannelRegistry } = require("@webresto/core/lib/SalesChannelRegistry");
    if (!SalesChannelRegistry.getType("web-storefront")) SalesChannelRegistry.registerCoreDefaults();
    return SalesChannelRegistry;
  }

  private typeItem(def: any, options: { canManage: boolean; lang: string }): ChannelTypeItem {
    const { channelTypeStateText } = require("@webresto/core/lib/sales-channels/view");
    const { channelTypeTag, isProviderInstalled, isTypeAvailable } = require("@webresto/core/lib/SalesChannelProviders");
    const flags = {
      installed: isProviderInstalled(def.providerModule, this.installedModules) !== false,
      alive: this.aliveTypes.has(def.type),
      available: isTypeAvailable(def),
    };
    const stateText = channelTypeStateText(flags, this.words(options.lang));
    const capabilitiesText = (def.capabilities || []).join(" · ");
    const countriesText = (def.countries || []).join(" · ");
    return {
      id: def.type,
      title: def.title,
      ...(stateText ? { stateText } : {}),
      ...(flags.available ? {} : { availability: "coming_soon" as const }),
      category: def.category,
      ...(capabilitiesText ? { capabilitiesText } : {}),
      ...(countriesText ? { countriesText } : {}),
      ...(options.canManage && def.providerModule ? { providerText: def.providerModule } : {}),
      ...flags,
      settingsUrl: options.canManage ? def.settingsUrl ?? null : null,
      marketplaceAppId: def.marketplaceAppId ?? null,
      marketplaceTag: channelTypeTag(def.type),
    };
  }

  async types(query: { kind: string; canManage: boolean; lang: string }) {
    const registry = this.registry();
    const present = new Set(this.rows.map((row) => row.type));
    const all = registry.listTypes();
    const recommended = registry.recommendedTypesForCountry(this.country).filter((def: any) => !present.has(def.type));
    return {
      items: (query.kind === "all" ? all : recommended).map((def: any) => this.typeItem(def, query)),
      counts: { recommended: recommended.length, all: all.length },
    };
  }

  async type(id: string, options: { canManage: boolean; lang: string }) {
    const def = this.registry().getType(id);
    return def ? this.typeItem(def, options) : null;
  }

  private item(row: (typeof FakeChannels.prototype.rows)[number], options: { canManage: boolean; lang: string }): ChannelItem {
    const { channelProviderHint, channelProviderText, conceptsText } = require("@webresto/core/lib/sales-channels/view");
    const t = this.words(options.lang);
    // No live provider: the readiness of the record means nothing — core says error and why.
    const status = row.providerAlive ? row.status : "error";
    const canDelete = row.managedBy !== "provider" || row.providerInstalled === false;
    const capabilitiesText = row.capabilities.join(" · ");
    return {
      id: row.id,
      key: row.key,
      title: row.title,
      subtitle: `${row.key} · ${row.typeTitle}`,
      type: row.type,
      typeTitle: row.typeTitle,
      category: row.category,
      ...(capabilitiesText ? { capabilitiesText } : {}),
      status,
      // A field a record does not carry is not drawn: an empty «Провайдер сказал» says nothing.
      ...(row.providerAlive && row.statusMessage ? { statusMessage: t(row.statusMessage) } : {}),
      providerText: channelProviderText(
        { providerAlive: row.providerAlive, providerInstalled: row.providerInstalled, typeComingSoon: row.typeComingSoon, marketplaceAppId: row.marketplaceAppId },
        row.providerModule,
        t,
      ),
      ...(channelProviderHint(row, t) ? { providerHint: channelProviderHint(row, t) } : {}),
      enabledText: row.providerAlive ? row.enabled : false,
      conceptsText: conceptsText(row.concepts, t),
      ...(row.countries.length ? { countriesText: row.countries.join(" · ") } : {}),
      ...(row.platforms.length ? { platformsText: row.platforms.join(" · ") } : {}),
      ...(row.url ? { url: row.url } : {}),
      updatedAt: row.updatedAt,
      enabled: row.enabled,
      providerInstalled: row.providerInstalled,
      providerAlive: row.providerAlive,
      typeComingSoon: row.typeComingSoon,
      marketplaceAppId: row.marketplaceAppId,
      settingsUrl: options.canManage ? row.settingsUrl : null,
      canDelete,
      concepts: row.concepts,
      countries: row.countries,
      platforms: row.platforms,
      defaultConcept: row.defaultConcept,
      allowConceptSwitch: row.allowConceptSwitch,
      // `settings` and `publicConfig` of a channel belong to its provider and have no editor
      // anywhere (Q55), so no record of the phone carries them — nor, ever, `secretsRef`.
    };
  }

  /** The refusal of a rule as `adapters/channels.ts` hands it over: words first, next step in `details`. */
  private refused(refusal: { status: number; error: string; params?: Record<string, string>; extra?: Record<string, unknown> }, lang: string) {
    const { refusalText } = require("@webresto/core/lib/SalesChannelProviders");
    const t = this.words(lang);
    const extra = refusal.extra || {};
    const providerMessage = typeof extra.message === "string" && extra.message ? t(extra.message) : null;
    const details: Record<string, unknown> = {};
    if (extra.settingsUrl) details.settingsUrl = extra.settingsUrl;
    if (extra.marketplaceAppId) details.marketplaceAppId = extra.marketplaceAppId;
    if (providerMessage) details.providerMessage = providerMessage;
    return {
      ok: false as const,
      message: [refusalText(refusal, t), providerMessage].filter(Boolean).join(" — "),
      ...(Object.keys(details).length ? { details } : {}),
    };
  }

  private state(item: ChannelItem, state: string | undefined): boolean {
    if (state === "active") return item.enabled && item.providerAlive && item.status === "ready";
    if (state === "off") return !item.enabled;
    if (state === "needs_setup") return item.status === "needs_setup";
    if (state === "error") return item.status === "error";
    return true;
  }

  async list(query: { q?: string; state?: string; canManage: boolean; lang: string }) {
    const items = this.rows
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((row) => this.item(row, { canManage: query.canManage, lang: query.lang }));
    const counts: Record<string, number> = { all: items.length, active: 0, off: 0, needs_setup: 0, error: 0 };
    for (const state of ["active", "off", "needs_setup", "error"]) counts[state] = items.filter((item) => this.state(item, state)).length;
    const needle = query.q?.trim().toLowerCase();
    return {
      items: items.filter(
        (item) =>
          this.state(item, query.state) &&
          (!needle || [item.title, item.key, item.type, item.typeTitle].some((value) => String(value).toLowerCase().includes(needle))),
      ),
      counts,
    };
  }

  async get(id: string, options: { canManage: boolean; lang: string }) {
    const row = this.rows.find((candidate) => candidate.id === id);
    return row ? this.item(row, options) : null;
  }

  async setEnabled(id: string, enabled: boolean, options: { canManage: boolean; lang: string }): Promise<ToggledChannel> {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) return { ok: false, notFound: true };
    if (enabled) {
      // core's rule: only a live provider that answers `ready` right now lets a channel be switched on.
      if (!row.providerAlive) {
        return this.refused(
          {
            status: 409,
            error: row.providerInstalled === false || !row.providerModule ? "Install the provider first" : "Provider did not load",
            extra: { marketplaceAppId: row.marketplaceAppId },
          },
          options.lang,
        );
      }
      if (row.status !== "ready") {
        return this.refused({ status: 409, error: "Finish setup first", extra: { settingsUrl: row.settingsUrl, message: row.statusMessage } }, options.lang);
      }
    }
    row.enabled = enabled;
    return { ok: true, item: this.item(row, { canManage: true, lang: options.lang }) };
  }

  async remove(id: string, lang: string): Promise<RemovedChannel> {
    const row = this.rows.find((candidate) => candidate.id === id);
    if (!row) return { ok: false, notFound: true };
    if (row.managedBy === "provider" && row.providerInstalled !== false) {
      return this.refused({ status: 409, error: "This channel belongs to an installed provider module: disable it instead" }, lang);
    }
    this.rows = this.rows.filter((candidate) => candidate.id !== id);
    this.removed.push(row.key);
    return { ok: true, id: row.id, key: row.key };
  }
}

/**
 * The settings of a server, in miniature: one of every shape «Настройки» has to draw, and the rules
 * core puts on them — the environment outranks the database, a secret is write-only, a value is
 * checked by its schema before it is written.
 *
 * Core's own `lib/settings/view.ts` is what the hook talks to in a running server; this is the same
 * contract on nine settings, so the tests of the app can say what the app does without lifting Sails.
 */
export class FakeSettings implements SettingsPort {
  bootId = "boot-1";

  rows: SettingRow[] = [
    this.row({ key: "PROJECT_NAME", type: "string", name: "Project ID", value: "resto-stand", isRequired: true,
      jsonSchema: { type: "string", pattern: "^[a-z0-9\\-]+$", minLength: 3 },
      patternHint: "lowercase latin letters, digits and hyphens" }),
    this.row({ key: "CURRENCY_SIGN", type: "string", name: "Currency sign" }),
    this.row({ key: "DEFAULT_LOCALE", type: "string", name: "Default locale", defaultValue: "ru",
      jsonSchema: { type: "string", enum: ["en", "ru", "fr", "de"] } }),
    this.row({ key: "ALLOW_BONUS_SPENDING", type: "boolean", name: "Allow bonus spending", value: false }),
    this.row({ key: "OTP_TTL_SECONDS", type: "number", name: "OTP TTL", value: 1800, restartRequired: true,
      jsonSchema: { type: "integer", minimum: 60 } }),
    this.row({ key: "WORK_TIME", type: "json", name: "Work time",
      jsonSchema: { type: "array", items: { type: "object", required: ["start"], properties: { start: { type: "string", pattern: "^\\d{2}:\\d{2}$" } } } } }),
    this.row({ key: "JWT_SECRET", type: "string", name: "JWT Secret", secret: true, value: "a-very-long-secret-value-0123456789", module: "graphql",
      jsonSchema: { type: "string", minLength: 36 } }),
    this.row({ key: "TZ", type: "string", name: "TZ", env: { valid: true }, value: "Europe/Moscow" }),
    this.row({ key: "RMS_LAST_SYNC_AT", type: "string", name: "Last sync", readOnly: true, value: "2026-11-04" }),
  ];

  private row(input: Partial<SettingRow> & { key: string; type: string; env?: { valid: boolean } }): SettingRow {
    return {
      id: 0, name: null, description: null, tooltip: null, secret: false, hasValue: input.value !== undefined && input.value !== null,
      value: null, defaultValue: null, jsonSchema: null, patternHint: null, uiSchema: null, readOnly: false, isRequired: false,
      restartRequired: false, module: null, envOverride: input.env ?? null, ...input,
    } as SettingRow;
  }

  private find(key: string): SettingRow | undefined {
    return this.rows.find((row) => row.key === key);
  }

  async list(): Promise<SettingRow[]> {
    return [...this.rows].sort((a, b) => a.key.localeCompare(b.key));
  }

  async get(key: string): Promise<SettingRow | null> {
    return this.find(key) ?? null;
  }

  async update(key: string, value: unknown): Promise<{ ok: boolean; item?: SettingRow; reason?: any; message?: string }> {
    const row = this.find(key);
    if (!row) return { ok: false, reason: "not_found", message: "Настройка не найдена" };
    if (row.readOnly) return { ok: false, reason: "read_only", message: "Значение ведёт приложение" };
    if (row.envOverride) return { ok: false, reason: "env", message: "Значение задано переменной окружения" };
    const problem = this.check(row, value);
    if (problem) return { ok: false, reason: "invalid", message: problem };
    row.value = value as any;
    row.hasValue = value !== null && value !== undefined;
    return { ok: true, item: row };
  }

  /** The two rules the tests lean on, said the way core says them. */
  private check(row: SettingRow, value: unknown): string | null {
    const schema: any = row.jsonSchema;
    if (!schema) return null;
    if (schema.type === "string" && typeof value === "string") {
      if (schema.minLength && value.length < schema.minLength) return `Значение не короче ${schema.minLength} символов`;
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) {
        return `Значение должно содержать только: ${row.patternHint ?? schema.pattern}`;
      }
      if (schema.enum && !schema.enum.includes(value)) return `Значение должно быть одним из: ${schema.enum.join(", ")}`;
    }
    if (schema.type === "integer" && typeof value === "number" && schema.minimum !== undefined && value < schema.minimum) {
      return `Значение ${schema.minimum} или больше`;
    }
    return null;
  }

  async dump() {
    const settings = this.rows.filter((row) => !row.secret).map((row) => ({ key: row.key, name: row.name, type: row.type, value: row.value }));
    return { exportedAt: "2026-11-04T00:00:00.000Z", count: settings.length, settings };
  }

  async diff(entries: TransferEntry[]) {
    return entries.map((entry) => {
      const row = this.find(entry.key);
      if (!row) return { key: entry.key, status: "not_found", importValue: entry.value };
      const locked = row.readOnly || Boolean(row.envOverride);
      const current = row.envOverride ? row.value : (row.value ?? row.defaultValue);
      const incoming = entry.value ?? row.defaultValue;
      return {
        key: entry.key,
        status: JSON.stringify(current ?? null) === JSON.stringify(incoming ?? null) ? "unchanged" : "changed",
        currentValue: row.secret ? null : current,
        importValue: entry.value,
        readOnly: locked,
        envOverride: Boolean(row.envOverride),
        secret: row.secret,
      };
    });
  }

  async apply(entries: TransferEntry[], keys: string[]) {
    const results = [];
    for (const entry of entries) {
      if (!keys.includes(entry.key)) continue;
      const applied = await this.update(entry.key, entry.value);
      if (applied.ok) results.push({ key: entry.key, status: "applied" });
      else results.push({ key: entry.key, status: applied.reason === "invalid" ? "error" : "skipped", error: applied.message });
    }
    return results;
  }

  boot(): string {
    return this.bootId;
  }
}

/**
 * The programs of a server, as «Система» reads them: two system modules, four installed, and every
 * state a badge has to name — an update, a module switched off, migrations that did not pass, a
 * module that forbids its own removal and one that others depend on.
 *
 * The filtering and the counts are done here the way `adapters/system.ts` does them, so the test
 * exercises the wiring of the methods; whether the real adapter reads `Module` and the manager's
 * memory correctly is what the live walk against a lifted server answers.
 */
export class FakeSystem implements SystemPort {
  restartScheduled = false;
  restartAt: number | null = null;
  restarting = false;
  /** What the restart was asked to do, in order: the fake of the scheduler of the module manager. */
  restartCalls: string[] = [];
  wizard: { total: number; left: number; current: string; renderer: string } | null = null;
  licensed = false;
  migrationsSupported = true;

  cards: ModuleCard[] = [
    this.card({ appId: "@webresto/core", name: "@webresto/core", version: "5.2.0", kind: "system", description: "The core of the server", state: "system", removeBlock: "system" }),
    this.card({ appId: "@webresto/graphql", name: "@webresto/graphql", version: "5.2.0", kind: "system", description: "The GraphQL API", state: "system", removeBlock: "system" }),
    this.card({
      appId: "simple-navigation", name: "Навигация", version: "1.8.2", latestVersion: "1.8.3", updateAvailable: true, state: "update",
      description: "Меню витрины", keywords: "navigation, menu", author: "WebResto", license: "MIT", hookName: "simplenavigation",
      directoryName: "simple-navigation", dependents: "shop-front", dependentsList: ["shop-front"], removeBlock: "dependents",
      migrationsFiles: 2, migrationsProcessed: 2,
    }),
    this.card({
      appId: "shop-front", name: "Витрина", version: "2.0.0", description: "Витрина магазина", dependencies: "simple-navigation",
      removeBlock: "forbidden", state: "ok", unfilledSettings: 2,
    }),
    this.card({ appId: "old-module", name: "Старый модуль", version: "1.0.0", description: "Ещё работает", enable: false, loaded: false, state: "disabled" }),
    this.card({
      appId: "broken-module", name: "Сломанный модуль", version: "1.1.0", description: "Миграции не прошли", state: "migrations",
      migrationsFiles: 3, migrationsProcessed: 1, migrationsPending: true, migrationsResult: "ERROR: relation \"menu\" already exists",
    }),
  ];

  private card(partial: Partial<ModuleCard> & { appId: string }): ModuleCard {
    return {
      id: partial.appId,
      name: partial.appId,
      appId: partial.appId,
      version: null,
      latestVersion: null,
      updateAvailable: false,
      kind: "installed",
      enable: true,
      loaded: true,
      state: "ok",
      description: "",
      hookName: "",
      directoryName: partial.appId,
      author: "",
      license: "",
      keywords: "",
      repository: "webresto-registry",
      dependencies: "",
      dependents: "",
      dependentsList: [],
      migrationsFiles: 0,
      migrationsProcessed: 0,
      migrationsResult: "",
      migrationsPending: false,
      migrationsSupported: true,
      unfilledSettings: 0,
      removeBlock: null,
      ...partial,
    };
  }

  async server(): Promise<ServerState> {
    return {
      id: "server",
      title: "Resto Demo",
      subtitle: "5.2.0-build.33 · Europe/Moscow",
      version: "5.2.0-build.33",
      timezone: "Europe/Moscow",
      currency: "RUB",
      systemCount: this.cards.filter((card) => card.kind === "system").length,
      installedCount: this.cards.filter((card) => card.kind === "installed").length,
      disabledCount: this.cards.filter((card) => !card.enable).length,
      updatesCount: this.cards.filter((card) => card.updateAvailable).length,
      migrationsPending: this.cards.filter((card) => card.migrationsPending).length,
      restartScheduled: this.restartScheduled,
      restartAt: this.restartAt,
      restarting: this.restarting,
      wizardActive: this.wizard !== null,
      wizardTotal: this.wizard?.total ?? 0,
      wizardLeft: this.wizard?.left ?? 0,
      wizardCurrent: this.wizard?.current ?? null,
      wizardRenderer: this.wizard?.renderer ?? null,
      licensed: this.licensed,
    };
  }

  async modules(query: { q?: string; kind?: string }) {
    const counts = {
      all: this.cards.length,
      installed: this.cards.filter((card) => card.kind === "installed").length,
      system: this.cards.filter((card) => card.kind === "system").length,
      disabled: this.cards.filter((card) => !card.enable).length,
    };
    const needle = query.q?.toLowerCase();
    const items: ModuleItem[] = this.cards
      .filter((card) => {
        if (query.kind === "installed" && card.kind !== "installed") return false;
        if (query.kind === "system" && card.kind !== "system") return false;
        if (query.kind === "disabled" && card.enable) return false;
        if (!needle) return true;
        return [card.name, card.appId, card.description, card.keywords].join(" ").toLowerCase().includes(needle);
      })
      .map(({ ...card }) => ({
        id: card.id, name: card.name, appId: card.appId, version: card.version, latestVersion: card.latestVersion,
        updateAvailable: card.updateAvailable, kind: card.kind, enable: card.enable, loaded: card.loaded,
        state: card.state, description: card.description,
      }));
    return { items, counts };
  }

  /** The marketplace of the fake: null makes it not answer at all. */
  marketplace: CatalogItem[] | null = [
    { id: "stand-hello", appId: "stand-hello", name: "Hello", teaser: "Здоровается", description: "Для примера", author: "webresto", tags: "demo, greeting", latestVersion: "1.0.0", block: null },
    { id: "stand-paid", appId: "stand-paid", name: "Paid", teaser: "Платная", description: "", author: "webresto", tags: "", latestVersion: "2.0.0", block: "license" },
  ];
  /** What the next job refuses with, as the manager throws it. */
  refusal: JobRefusal | null = null;
  jobs = new Map<string, ModuleJob>();
  startedJobs: string[] = [];

  async catalog(query: { q?: string; appId?: string; tags?: string }) {
    if (!this.marketplace) return null;
    const needle = query.q?.toLowerCase();
    const asked = (query.tags ?? "").split(/[;,]/).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    return this.marketplace
      .filter((item) => !query.appId || item.id === query.appId)
      .filter((item) => asked.every((tag) => item.tags.toLowerCase().split(/,\s*/).includes(tag)))
      .filter((item) => !needle || [item.id, item.name, item.teaser, item.description, item.tags].join(" ").toLowerCase().includes(needle));
  }

  async catalogItem(appId: string) {
    return this.marketplace?.find((item) => item.id === appId) ?? null;
  }

  async startJob(kind: ModuleJob["kind"], appId: string) {
    if (this.refusal) throw this.refusal;
    this.startedJobs.push(`${kind} ${appId}`);
    const job: ModuleJob = { id: `job-${this.startedJobs.length}`, kind, appId, state: "running", step: "download", log: [], error: null, restartScheduled: false };
    this.jobs.set(job.id, job);
    return job;
  }

  async job(id: string) {
    return this.jobs.get(id) ?? null;
  }

  async restart(when: "midnight" | "now") {
    this.restartCalls.push(when);
    // The same rules as the real scheduler: planning twice is planning once, and an order beats a plan.
    if (when === "now") {
      this.restarting = true;
      this.restartScheduled = false;
    } else if (!this.restarting && !this.restartScheduled) {
      this.restartScheduled = true;
      this.restartAt = Date.parse("2026-11-05T00:00:00+03:00");
    }
  }

  async module(appId: string): Promise<ModuleCard | null> {
    const card = this.cards.find((candidate) => candidate.appId === appId);
    return card ? { ...card, migrationsSupported: this.migrationsSupported } : null;
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
  marketing: FakeMarketing;
  channels: FakeChannels;
  settings: FakeSettings;
  system: FakeSystem;
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
    // The section of marketing: both rights of it, and the orders — so the applications are there too.
    makeUser(11, "marketer", [{ name: "Marketer", tokens: ["access-to-adminpanel", "promocodes-manager", "promotions-manager", "read-order-model"] }]),
    // The codes alone, and no right to read an order: no applications, no money on the summary.
    makeUser(12, "coder", [{ name: "Promo codes", tokens: ["access-to-adminpanel", "promocodes-manager"] }]),
    // The promotions alone: the summary without a number or a link about the codes.
    makeUser(13, "promoter", [{ name: "Promotions", tokens: ["access-to-adminpanel", "promotions-manager"] }]),
    // «Каналы продаж», the two levels of its right and the legacy token that is both (Q52).
    makeUser(14, "channeler", [{ name: "Sales channels", tokens: ["access-to-adminpanel", "sales-channels-view", "sales-channels-manage"] }]),
    makeUser(15, "channelview", [{ name: "Sales channels read-only", tokens: ["access-to-adminpanel", "sales-channels-view"] }]),
    makeUser(16, "channellegacy", [{ name: "Sales channels legacy", tokens: ["access-to-adminpanel", "sales-channels-manager"] }]),
    // Manages the channels and may install their providers: the only one with «Установить провайдера».
    makeUser(17, "channelinstall", [{ name: "Sales channels install", tokens: ["access-to-adminpanel", "sales-channels-manage", "modules-process-upgrade"] }]),
    // The Settings page of the panel, and nothing else: the one token «Настройки» is behind.
    makeUser(18, "owner", [{ name: "System", tokens: ["access-to-adminpanel", "settings-manager"] }]),
    // The Extensions page of the panel: the programs, the catalog, the jobs and the restart.
    makeUser(19, "sysop", [{ name: "Extensions", tokens: ["access-to-adminpanel", "modules-process-upgrade"] }]),
    // Only the settings: «Система» opens, its programs do not.
    makeUser(20, "settler", [{ name: "Settings", tokens: ["access-to-adminpanel", "settings-manager"] }]),
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
  const marketing = new FakeMarketing();
  const channels = new FakeChannels();
  const settings = new FakeSettings();
  const system = new FakeSystem();
  registerDishes(registry, stock);
  registerOrders(registry, orders);
  registerClients(registry, clients);
  registerPos(registry, pos, clients);
  registerMarketing(registry, marketing);
  registerChannels(registry, channels);
  registerSettings(registry, settings);
  registerSystem(registry, system);

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

  return { deps, users, places, stock, orders, clients, pos, marketing, channels, settings, system, devices, attempts, powUses, audits, env, clock };
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
