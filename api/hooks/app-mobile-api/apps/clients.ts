import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Клиенты» — the Customers of the admin panel, on the phone: who is calling, what they ordered,
 * where they live.
 *
 * The model is core's `user`, which the panel binds as «Customers»
 * (`core/lib/adminpanel/models/bind.ts`), so the rights are the model rights of adminizer and
 * nothing of our own: `read-customer-model` to look, `create-customer-model` to add. A member of
 * staff who may not read customers in the web may not read them here either.
 *
 * Search by number goes through `AuthIdentity` (`provider: "phone"`, `externalId` — the normalized
 * digits), because that is where a phone lives now; `user.phone` is a json projection its own model
 * calls deprecated and would not be searchable anyway. Creating goes through
 * `AuthService.materializeUser` — the one factory core itself uses for a guest at `DONE` — so the
 * same number never makes a second profile.
 */

export interface ClientItem {
  id: string;
  /** Full name, or the number when there is no name yet — never empty, it is the row's title. */
  title: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  /** The phone identity is proven: the person passed an OTP with it. */
  verified: boolean;
  orderCount: number;
  /** Epoch milliseconds. */
  createdAt: number;
  /** With `read-order-model` only: what their placed, not rejected orders came to. */
  spent?: number;
  averageCheck?: number;
  /** Epoch milliseconds of the last such order. */
  lastOrderAt?: number;
}

export interface ClientCard extends ClientItem {
  /** Saved addresses, one line each (`UserLocation.formatted`). */
  addresses: string[];
  /** Recent orders, newest first: "№1234 · 12.05 · 1 200 ₽ · Доставлен". */
  orders: string[];
  /** The same recent orders as data: what the `list` block of the card is made of. */
  recent: ClientOrder[];
}

/** An order of the customer, for the card. */
export interface ClientOrder {
  id: string;
  number: string;
  /** Epoch milliseconds: when it was placed. */
  at: number;
  total: number;
  state: string;
  /** The point that leads it (`no-kitchen` while it has none): where `orders.get` opens it. */
  placeId: string;
}

/** The money of a customer: their placed orders that were not rejected. */
export interface ClientMoney {
  spent: number;
  count: number;
  /** Epoch milliseconds of the last of them; null — none. */
  lastOrderAt: number | null;
}

export interface ClientsPort {
  /** Newest first; `q` — digits of a number or part of a name. */
  list(options: { q?: string }): Promise<ClientItem[]>;
  get(id: string): Promise<ClientCard | null>;
  /** The money of these customers; a customer without orders is absent or zero. */
  money(ids: string[]): Promise<Map<string, ClientMoney>>;
  /** Finds by number or creates; the same number always answers with the same person. */
  create(input: { name: string; phone: string; email?: string }): Promise<ClientItem>;
}

export const PAGE_SIZE = 50;

/**
 * The model rights of adminizer for the resource core binds as «Customers» — `Customer` in
 * `config.adminpanel.models`, whose underlying model is `user`. Adminizer makes one token per
 * resource name and lowercases it (`registerModelTokens`, `registerToken`), so the ids are
 * `read-customer-model` and `create-customer-model` — the same ones the group form shows under
 * «Model Customer», and the same ones the web list of customers is checked against.
 */
const read = { token: "read-customer-model" };
/**
 * The money of a customer is the money of their orders: whoever may not read an order in the panel does not see
 * what a customer spent either. The same right «Маркетинг» counts its money by (`read-order-model`).
 */
const MONEY_TOKEN = "read-order-model";
const money = { token: MONEY_TOKEN };
const create = { tokens: ["read-customer-model", "create-customer-model"] };

/** Material Symbols "person", 24×24. */
const ICON =
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";

const FIELDS = [
  { name: "phone", title: "mobile.clients.field.phone", format: "phone", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "email", title: "mobile.clients.field.email", format: "text", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "verified", title: "mobile.clients.field.verified", format: "boolean", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "orderCount", title: "mobile.clients.field.orderCount", format: "number", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "createdAt", title: "mobile.clients.field.createdAt", format: "datetime", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "spent", title: "mobile.clients.field.spent", format: "money", readonly: true, section: "mobile.clients.section.money", access: money },
  { name: "averageCheck", title: "mobile.clients.field.averageCheck", format: "money", readonly: true, section: "mobile.clients.section.money", access: money },
  { name: "lastOrderAt", title: "mobile.clients.field.lastOrderAt", format: "datetime", readonly: true, section: "mobile.clients.section.money", access: money },
  { name: "addresses", title: "mobile.clients.field.addresses", format: "text", readonly: true, section: "mobile.clients.section.addresses" },
  { name: "orders", title: "mobile.clients.field.orders", format: "text", readonly: true, section: "mobile.clients.section.orders" },
];

/** P7: the numbers over the card; a block of a field the record does not carry (no money right) is not drawn. */
const CARD_SUMMARY = [
  { type: "metric", field: "orderCount", format: "number" },
  { type: "metric", field: "spent", format: "money" },
  { type: "metric", field: "averageCheck", format: "money" },
  { type: "list", field: "recentOrders", title: "mobile.clients.summary.orders" },
];

/** The money of these records, for whoever may see it: `spent`, `averageCheck`, `lastOrderAt`. */
async function withMoney<T extends ClientItem>(rows: T[], clients: ClientsPort, ctx: MethodContext): Promise<T[]> {
  if (!rows.length || !(await ctx.can(MONEY_TOKEN))) return rows;
  const byId = await clients.money(rows.map((row) => row.id));
  return rows.map((row) => {
    const counted = byId.get(row.id) ?? { spent: 0, count: 0, lastOrderAt: null };
    return {
      ...row,
      spent: counted.spent,
      averageCheck: counted.count ? Math.round(counted.spent / counted.count) : 0,
      ...(counted.lastOrderAt ? { lastOrderAt: counted.lastOrderAt } : {}),
    };
  });
}

/** «18 ноя» in the person's language, the day of the server. */
function shortDay(at: number, lang: string): string {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "short" }).format(new Date(at)).replace(".", "");
}

/**
 * The recent orders as lines of the card: «№ 1323 · 18 ноя» and the total — the total only for whoever may see
 * money, the way into the order only for whoever may open it at its point.
 */
async function recentLines(card: ClientCard, ctx: MethodContext): Promise<Array<Record<string, unknown>>> {
  const seesMoney = await ctx.can(MONEY_TOKEN);
  const lines: Array<Record<string, unknown>> = [];
  for (const order of card.recent) {
    const line: Record<string, unknown> = { title: `№ ${order.number} · ${shortDay(order.at, ctx.lang)}` };
    if (seesMoney) Object.assign(line, { value: order.total, format: "money" });
    if (await ctx.canOpen("orders.get", order.placeId)) {
      line._open = { app: "orders", method: "orders.get", params: { id: order.id }, place: order.placeId };
    }
    lines.push(line);
  }
  return lines;
}

/** A number as typed: digits, a leading plus, spaces, dashes and brackets of a printed form. */
const PHONE_PATTERN = "^[+]?[0-9 ()-]{5,20}$";

export function registerClients(registry: MobileApiRegistry, clients: ClientsPort): void {
  registry.registerApp({
    id: "clients",
    version: "1.0.0",
    title: "mobile.app.clients.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "clients.list",
    scope: "server",
    models: { client: { fields: FIELDS } },
  });

  registry.registerMethod({
    name: "clients.list",
    app: "clients",
    kind: "query",
    title: "mobile.clients.list.title",
    access: read,
    model: "client",
    input: {
      type: "object",
      properties: {
        q: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "title", subtitle: "phone", meta: "createdAt", value: "orderCount" },
      search: "q",
      open: "clients.get",
      empty: "mobile.clients.empty",
      columns: [
        { field: "phone" },
        { field: "email", width: "wide" },
        { field: "orderCount", align: "end", width: "narrow" },
        { field: "createdAt", align: "end" },
      ],
    },
    handler: async (params: { q?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const rows = await clients.list({ q: params.q?.trim() || undefined });
      const listed = page(rows, offset, PAGE_SIZE);
      // The money of the page only: a search answers with up to 200 people, the screen shows 50.
      return { ...listed, items: await withMoney(listed.items, clients, ctx) };
    },
  });

  registry.registerMethod({
    name: "clients.get",
    app: "clients",
    kind: "query",
    title: "mobile.clients.get.title",
    access: read,
    model: "client",
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    ui: { view: "detail", item: { title: "title", subtitle: "phone" }, summary: CARD_SUMMARY },
    handler: async ({ id }: { id: string }, ctx) => {
      const card = await clients.get(id);
      if (!card) return ctx.fail("not_found", "No such customer");
      const { recent, ...item } = card;
      const [counted] = await withMoney([item as ClientItem], clients, ctx);
      return { item: { ...counted, recentOrders: await recentLines(card, ctx) } };
    },
  });

  registry.registerMethod({
    name: "clients.create",
    app: "clients",
    kind: "mutation",
    title: "mobile.clients.create.title",
    access: create,
    input: {
      type: "object",
      required: ["name", "phone"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 100, title: "mobile.clients.input.name" },
        phone: { type: "string", pattern: PHONE_PATTERN, title: "mobile.clients.input.phone", "x-format": "phone" },
        email: { type: "string", maxLength: 200, title: "mobile.clients.input.email" },
      },
    },
    // On the list screen, not on a row: it makes a customer rather than changing one.
    ui: { view: "action", on: "list", placement: ["list"], control: { type: "form" } },
    handler: async (params: { name: string; phone: string; email?: string }, ctx: MethodContext) => {
      const item = await clients.create({ name: params.name.trim(), phone: params.phone, email: params.email?.trim() || undefined });
      if (!item) return ctx.fail("internal", "The customer was not created");
      return { item };
    },
    // The number is the person: it is in the journal of the order anyway, but not in the audit.
    audit: (_params, result: { item?: ClientItem }) => ({ record: result?.item?.id ?? null, params: {} }),
  });
}
