import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Заказы» — the orders board of one point, on the phone.
 *
 * Access and points are those of the web board: the contextual `order-kanban` token with the points
 * ticked in the group form, plus reading and writing the `order` model. The data and every move come
 * from the same functions of core the board calls (`ordersOfPlace`, `transitionOrder`,
 * `assignOrderKitchen` — plan C1, C5, C6), so the board and the phone can never answer differently
 * about the same order.
 *
 * One point at a time, «Без кухни» among them: that is where an order no kitchen was resolved for
 * waits, and whoever holds that option hands it a kitchen.
 */

/** The point of the orders no kitchen has been resolved for; core's own id for it. */
export const NO_KITCHEN = "no-kitchen";

export interface OrderItem {
  id: string;
  /** `shortId` — what staff and the customer call the order. */
  number: string;
  title: string;
  /** Customer and how they get it: the second line of a row. */
  summary: string;
  state: string;
  /** Epoch milliseconds. */
  createdAt: number;
  updatedAt: number;
  customerName: string;
  customerPhone: string;
  /** `delivery` / `pickup` / `dine-in`, as `Order.serviceType`. */
  method: string;
  address: string | null;
  comment: string | null;
  /** The lines of the order, one per line: "2 × Борщ". */
  contents: string;
  deliveryCost: number;
  total: number;
  paid: boolean;
  /** States this user may move the order to from where it is — the buttons of the card. */
  allowedTransitions: string[];
  /** The point it is led by, or `no-kitchen`. */
  placeId: string;
  /** How many portions this point makes of the order: the sum of the amounts of its lines. */
  itemsCount: number;
  /** The table of a dine-in order, as the venue calls it; null for the others or when none was given. */
  table: string | null;
  /** The account the order is of (`Order.user`); null for a guest nobody was made for. */
  customerId: string | null;
  /** The basket before the discount; 0 when core did not count one. */
  basketTotal: number;
  /** What a promotion or a code took off the order, a positive number; 0 — nothing. */
  discount: number;
  /** The promo code that was taken (not merely typed); null without one. */
  promoCode: string | null;
  /** «−10%» when every promotion of that code takes the same percentage off; null otherwise. */
  promoLabel: string | null;
  /** The lines of the order this point makes, only on the card (`get`). */
  lines?: OrderLine[];
}

/** One line of the card: «Пепперони 30 см», 2, «Тонкое тесто · Томатный соус», 1180. */
export interface OrderLine {
  title: string;
  amount: number;
  /** The modifiers and the comment of the line, through « · »; absent when it has none. */
  note?: string;
  /** Money of the line, the amount included. */
  value: number;
}

export interface OrdersActor {
  /** The panel user, for the role and the journal. */
  user: unknown;
  device: string | null;
}

export type SetStateOutcome =
  | { ok: true; item: OrderItem }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "forbidden"; allowed: string[] }
  | { ok: false; reason: "failed"; message: string };

export type AssignKitchenOutcome =
  | { ok: true; item: OrderItem }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "no_such_place" }
  | { ok: false; reason: "conflict"; message: string };

export interface OrdersPort {
  /** The orders of the point, newest first; `since` — only those changed at or after that moment. */
  list(place: string, options: { tab: "active" | "done"; since?: number | null; user: unknown }): Promise<OrderItem[]>;
  /** How many orders each tab of the point holds: the numbers on the chips. */
  counts(place: string, user: unknown): Promise<{ active: number; done: number }>;
  get(place: string, id: string, user: unknown): Promise<OrderItem | null>;
  /** How many orders of the point were placed at or after `from` (epoch ms), rejected ones included. */
  countSince(place: string, from: number): Promise<number>;
  setState(place: string, id: string, to: string, actor: OrdersActor): Promise<SetStateOutcome>;
  assignKitchen(place: string, id: string, kitchen: string, actor: OrdersActor): Promise<AssignKitchenOutcome>;
}

export const PAGE_SIZE = 50;
const ORDERS_TOKEN = "order-kanban";
/** Reading and writing the `order` model, as the web operator has it (`config/adminpanel.js`). */
const read = { tokens: [ORDERS_TOKEN, "read-order-model"] };
const write = { tokens: [ORDERS_TOKEN, "update-order-model"] };

/** Material Symbols "receipt_long", 24×24. */
const ICON =
  "M19.5 3.5 18 2l-1.5 1.5L15 2l-1.5 1.5L12 2l-1.5 1.5L9 2 7.5 3.5 6 2v14H3v3c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V2l-1.5 1.5z" +
  "M19 19c0 .55-.45 1-1 1s-1-.45-1-1v-3H8V5h11v14zM9 7h6v2H9zm7 0h2v2h-2zm-7 3h6v2H9zm7 0h2v2h-2z";

/** The states an order of a point can be in, with the tone of its badge. */
const STATE_SPECIALS = [
  { value: "ORDER", title: "mobile.orders.state.ORDER", tone: "info" },
  { value: "COOKING", title: "mobile.orders.state.COOKING", tone: "warning" },
  { value: "ON_THE_WAY", title: "mobile.orders.state.ON_THE_WAY", tone: "info" },
  { value: "DONE", title: "mobile.orders.state.DONE", tone: "success" },
  { value: "REJECT", title: "mobile.orders.state.REJECT", tone: "danger" },
];

/**
 * P2: the tone of each state wherever the client shows it — a badge, a dot, a column of the board. The same as
 * the tones of `specials`, but a finished order is `muted`: done is not news (`specials` keeps the four tones an
 * older client knows).
 */
const STATE_TONES = { ORDER: "info", COOKING: "warning", ON_THE_WAY: "info", DONE: "muted", REJECT: "danger" };

/** The titles of the states as the board heads its columns (`x-titles`); the words of `specials`. */
const STATE_TITLES = Object.fromEntries(STATE_SPECIALS.map((special) => [special.value, special.title]));

/**
 * P6: the columns of the board, in the way an order goes — the active ones and then where it ends. A rejected
 * order is not a step of the way, so it is on no column (it is in the «Завершённые» tab of the list).
 */
const BOARD_ORDER = ["ORDER", "COOKING", "ON_THE_WAY", "DONE"];

/** Every state a member of staff may move an order to; a role narrows it, a record narrows it more. */
const TARGETS = ["COOKING", "ON_THE_WAY", "DONE", "REJECT"];

/** What the button that moves an order there says. */
const ACTION_TITLES: Record<string, string> = {
  ORDER: "mobile.orders.action.ORDER",
  COOKING: "mobile.orders.action.COOKING",
  ON_THE_WAY: "mobile.orders.action.ON_THE_WAY",
  DONE: "mobile.orders.action.DONE",
  REJECT: "mobile.orders.action.REJECT",
};

/** Only a `danger` value is confirmed by the client, so «Готовить» asks nothing and «Отклонить» does. */
const TONES = { DONE: "success", REJECT: "danger" };

function stateInput(targets: string[]): Record<string, unknown> {
  return {
    type: "object",
    required: ["id", "to"],
    properties: {
      id: { type: "string", minLength: 1, maxLength: 100 },
      to: {
        type: "string",
        enum: targets,
        "x-titles": Object.fromEntries(targets.map((state) => [state, ACTION_TITLES[state] ?? state])),
      },
    },
  };
}

/**
 * The kitchens offered as buttons. Without a list — the bare registration, before any user is known
 * — the parameter is a plain string: an empty `enum` is not a schema. The handler checks the point
 * against the person's kitchens in either case.
 */
function kitchenInput(kitchens: Array<{ id: string; title: string }>): Record<string, unknown> {
  const place = kitchens.length
    ? {
        type: "string",
        enum: kitchens.map((kitchen) => kitchen.id),
        "x-titles": Object.fromEntries(kitchens.map((kitchen) => [kitchen.id, kitchen.title])),
      }
    : { type: "string", minLength: 1, maxLength: 100 };
  return {
    type: "object",
    required: ["id", "place"],
    properties: { id: { type: "string", minLength: 1, maxLength: 100 }, place },
  };
}

function placeOf(ctx: MethodContext): string {
  // Unreachable without a point: the call layer refuses a scope:"place" call that has none.
  return String(ctx.place?.id ?? ctx.fail("invalid", "No point"));
}

/** Kitchens the person may hand an order to: their own points, «Без кухни» excluded. */
async function kitchensOf(ctx: MethodContext): Promise<Array<{ id: string; title: string }>> {
  const places = await ctx.appPlaces();
  return places.filter((place) => !place.virtual && place.isCookingPoint).map((place) => ({ id: place.id, title: place.title }));
}

/**
 * A phrase with a number in the person's language: `{base}.one` / `.few` / `.many` / `.other` by the plural
 * rules of that language, `{n}` replaced. A form a language does not have falls back to `.other`.
 */
export function counted(ctx: MethodContext, base: string, n: number): string {
  const category = new Intl.PluralRules(ctx.lang).select(n);
  const key = `${base}.${category}`;
  const phrase = ctx.t(key);
  return (phrase === key ? ctx.t(`${base}.other`) : phrase).replace("{n}", String(n));
}

function methodTitle(method: string, ctx: MethodContext): string {
  const key = `mobile.orders.method.${method}`;
  const title = ctx.t(key);
  return title === key ? method : title;
}

/**
 * Where the order goes, one line: the address of a delivery, «Самовывоз», the table of the dining room
 * («Стол 5») or «В зале» when no table was named.
 */
function whereOf(item: OrderItem, ctx: MethodContext): string {
  if (item.method === "delivery") return item.address || methodTitle(item.method, ctx);
  if (item.method === "dine-in" && item.table) return ctx.t("mobile.orders.where.table").replace("{table}", item.table);
  return methodTitle(item.method, ctx);
}

/**
 * The words of a row in the person's language: the second line «Иван · Самовывоз», not the code of the
 * method; `where` — the third line (`ui.item.detail`); `itemsText` — «6 поз.» (`ui.item.note`).
 */
function worded(item: OrderItem, ctx: MethodContext): OrderItem & { where: string; itemsText: string } {
  return {
    ...item,
    summary: [item.customerName, methodTitle(item.method, ctx)].filter(Boolean).join(" · "),
    where: whereOf(item, ctx),
    itemsText: counted(ctx, "mobile.orders.itemsText", item.itemsCount),
  };
}

/** A line of the totals of the card (a `list` block): money, and how to draw it. */
interface TotalLine {
  title: string;
  value: number;
  format: "money";
  tone?: string;
  strong?: boolean;
}

/**
 * The totals under the lines: the dishes, the delivery when it costs something, the discount when there was
 * one (the code by its name), and what the customer pays.
 */
function totalsOf(item: OrderItem, ctx: MethodContext): TotalLine[] {
  const dishes = item.basketTotal > 0 ? item.basketTotal : (item.lines ?? []).reduce((sum, line) => sum + line.value, 0);
  const totals: TotalLine[] = [{ title: ctx.t("mobile.orders.totals.dishes"), value: dishes, format: "money" }];
  if (item.deliveryCost > 0) totals.push({ title: ctx.t("mobile.orders.totals.delivery"), value: item.deliveryCost, format: "money" });
  if (item.discount > 0) {
    const title = item.promoCode
      ? [ctx.t("mobile.orders.totals.promo").replace("{code}", item.promoCode), item.promoLabel].filter(Boolean).join(" · ")
      : ctx.t("mobile.orders.totals.discount");
    totals.push({ title, value: -item.discount, format: "money", tone: "success" });
  }
  totals.push({ title: ctx.t("mobile.orders.totals.total"), value: item.total, format: "money", strong: true });
  return totals;
}

/** The card of an order: its words, the lines and totals of the summary, and the door to the customer's card. */
async function card(item: OrderItem, ctx: MethodContext): Promise<Record<string, unknown>> {
  const lines = (item.lines ?? []).map((line) => ({ ...line, format: "money" }));
  const record: Record<string, unknown> = { ...worded(item, ctx), lines, totals: totalsOf(item, ctx) };
  if (item.customerId && (await ctx.canOpen("clients.get"))) {
    const open = { app: "clients", method: "clients.get", params: { id: item.customerId } };
    record._links = [{ title: ctx.t("mobile.orders.link.client"), ...(item.customerName ? { meta: item.customerName } : {}), open }];
  }
  return record;
}

/** «Ленина, 5 · сегодня 14 заказов, 9 в работе» — the line over the list of a point. */
async function descriptionOf(place: string, active: number, orders: OrdersPort, ctx: MethodContext, now: number): Promise<string> {
  const title = ctx.place?.virtual ? ctx.t(ctx.place.title) : ctx.place?.title ?? place;
  const day = new Date(now);
  day.setHours(0, 0, 0, 0);
  const today = await orders.countSince(place, day.getTime());
  return `${title} · ${counted(ctx, "mobile.orders.description.today", today)}, ${counted(ctx, "mobile.orders.description.active", active)}`;
}

function matches(item: OrderItem, q: string): boolean {
  const needle = q.toLowerCase();
  return [item.number, item.customerName, item.customerPhone, item.comment ?? "", item.id]
    .some((field) => field.toLowerCase().includes(needle));
}

export function registerOrders(registry: MobileApiRegistry, orders: OrdersPort, clock: () => number = Date.now): void {
  registry.registerApp({
    id: "orders",
    version: "1.0.0",
    title: "mobile.app.orders.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "orders.list",
    badge: "orders.badge",
    scope: "place",
    places: { token: ORDERS_TOKEN, kind: "any", options: [{ id: NO_KITCHEN, title: "mobile.orders.place.noKitchen" }] },
    models: {
      order: {
        fields: [
          {
            name: "state", title: "mobile.orders.field.state", format: "enum", readonly: true, specials: STATE_SPECIALS,
            "x-titles": STATE_TITLES, "x-tones": STATE_TONES,
          },
          { name: "createdAt", title: "mobile.orders.field.createdAt", format: "relative", readonly: true },
          { name: "customerName", title: "mobile.orders.field.customerName", format: "text", readonly: true, section: "mobile.orders.section.customer" },
          { name: "customerPhone", title: "mobile.orders.field.customerPhone", format: "phone", readonly: true, section: "mobile.orders.section.customer" },
          {
            name: "method", title: "mobile.orders.field.method", format: "enum", readonly: true, section: "mobile.orders.section.receiving",
            "x-titles": {
              delivery: "mobile.orders.method.delivery",
              pickup: "mobile.orders.method.pickup",
              "dine-in": "mobile.orders.method.dine-in",
            },
          },
          { name: "address", title: "mobile.orders.field.address", format: "text", readonly: true, section: "mobile.orders.section.receiving" },
          { name: "comment", title: "mobile.orders.field.comment", format: "text", readonly: true, section: "mobile.orders.section.receiving" },
          { name: "where", title: "mobile.orders.field.where", format: "text", readonly: true, section: "mobile.orders.section.receiving" },
          { name: "contents", title: "mobile.orders.field.contents", format: "text", readonly: true, section: "mobile.orders.section.contents" },
          { name: "itemsCount", title: "mobile.orders.field.itemsCount", format: "number", readonly: true, section: "mobile.orders.section.contents" },
          { name: "itemsText", title: "mobile.orders.field.itemsText", format: "text", readonly: true, section: "mobile.orders.section.contents" },
          { name: "deliveryCost", title: "mobile.orders.field.deliveryCost", format: "money", readonly: true, section: "mobile.orders.section.contents" },
          { name: "total", title: "mobile.orders.field.total", format: "money", readonly: true, section: "mobile.orders.section.contents" },
          { name: "paid", title: "mobile.orders.field.paid", format: "boolean", readonly: true, section: "mobile.orders.section.contents" },
        ],
      },
    },
  });

  registry.registerMethod({
    name: "orders.list",
    app: "orders",
    kind: "query",
    title: "mobile.orders.list.title",
    access: read,
    model: "order",
    input: {
      type: "object",
      properties: {
        tab: {
          type: "string",
          enum: ["active", "done"],
          default: "active",
          "x-titles": { active: "mobile.orders.tab.active", done: "mobile.orders.tab.done" },
        },
        q: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
        // Polling while the screen is open: epoch milliseconds of the last change the client knows.
        since: { type: "integer", minimum: 0 },
      },
    },
    ui: {
      view: "list",
      // `detail` — the third line, with the icon of the method; `note` — bottom left of the row.
      item: { title: "title", subtitle: "summary", meta: "createdAt", value: "total", badge: "state", detail: "where", note: "itemsText" },
      search: "q",
      chips: "tab",
      open: "orders.get",
      empty: "mobile.orders.empty",
      columns: [
        { field: "state" },
        { field: "customerName", width: "wide" },
        { field: "method" },
        { field: "createdAt", align: "end" },
        { field: "total", align: "end", width: "narrow" },
      ],
      board: { field: "state", order: BOARD_ORDER },
    },
    handler: async (params: { tab: "active" | "done"; q?: string; cursor?: string; since?: number }, ctx) => {
      const place = placeOf(ctx);
      const offset = decodeCursor(params.cursor, ctx);
      const q = params.q?.trim() || undefined;

      const rows = await orders.list(place, { tab: params.tab, since: params.since ?? null, user: ctx.user });
      const chosen = q ? rows.filter((item) => matches(item, q)) : rows;
      const counts = await orders.counts(place, ctx.user);
      const listed = page(chosen, offset, PAGE_SIZE);
      const description = await descriptionOf(place, counts.active, orders, ctx, clock());
      return { ...listed, items: listed.items.map((item) => worded(item, ctx)), counts, description };
    },
  });

  registry.registerMethod({
    name: "orders.get",
    app: "orders",
    kind: "query",
    title: "mobile.orders.get.title",
    access: read,
    model: "order",
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    ui: {
      view: "detail",
      item: { title: "title", subtitle: "summary", badge: "state" },
      // P7: the lines of the order with the totals under them (`totals` — the field of those).
      summary: [{ type: "list", field: "lines", title: "mobile.orders.summary.lines", totals: "totals" }],
    },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await orders.get(placeOf(ctx), id, ctx.user);
      if (!item) return ctx.fail("not_found", "No such order");
      return { item: await card(item, ctx) };
    },
  });

  registry.registerMethod({
    name: "orders.setState",
    app: "orders",
    kind: "mutation",
    title: "mobile.orders.setState.title",
    access: write,
    input: stateInput(TARGETS),
    ui: {
      view: "action",
      on: "order",
      placement: ["detail"],
      control: { type: "buttons", param: "to", tones: TONES },
      confirm: "mobile.orders.setState.confirm",
      // P3: the main button of the card. Its first value is the main one, and the way forward comes first in
      // core's transitions («Готовить» before «Отклонить»).
      primary: true,
    },
    // The states this order can go to from where it is, for this role: the card shows those buttons
    // and no others, and the same schema is what the call is validated against.
    describeItem: (_ctx, item: OrderItem) => {
      const allowed = (item.allowedTransitions ?? []).filter((state) => TARGETS.includes(state));
      if (!allowed.length) return false;
      return { input: stateInput(allowed) };
    },
    handler: async ({ id, to }: { id: string; to: string }, ctx) => {
      const outcome = await orders.setState(placeOf(ctx), id, to, { user: ctx.user, device: ctx.device?.id ?? null });
      if (outcome.ok) return { item: await card(outcome.item, ctx) };
      if (outcome.reason === "not_found") return ctx.fail("not_found", "No such order");
      if (outcome.reason === "forbidden") return ctx.fail("conflict", `The order cannot go to ${to} from where it is`);
      return ctx.fail("conflict", outcome.message);
    },
    audit: ({ id, to }) => ({ record: id, params: { to } }),
  });

  registry.registerMethod({
    name: "orders.assignKitchen",
    app: "orders",
    kind: "mutation",
    title: "mobile.orders.assignKitchen.title",
    access: write,
    input: kitchenInput([]),
    ui: {
      view: "action",
      on: "order",
      placement: ["detail"],
      control: { type: "buttons", param: "place" },
    },
    // The kitchens of this person, in the declaration and in every call.
    describe: async (ctx) => ({ input: kitchenInput(await kitchensOf(ctx)) }),
    // Only an order that has none, and only while looking at «Без кухни» — where such orders are.
    describeItem: async (ctx, item: OrderItem) => {
      if (item.placeId !== NO_KITCHEN || ctx.place?.id !== NO_KITCHEN) return false;
      const kitchens = await kitchensOf(ctx);
      if (!kitchens.length) return false;
      return { input: kitchenInput(kitchens) };
    },
    handler: async ({ id, place }: { id: string; place: string }, ctx) => {
      const kitchens = await kitchensOf(ctx);
      if (!kitchens.some((kitchen) => kitchen.id === place)) return ctx.fail("place_forbidden");
      const outcome = await orders.assignKitchen(placeOf(ctx), id, place, { user: ctx.user, device: ctx.device?.id ?? null });
      if (outcome.ok) return { item: await card(outcome.item, ctx) };
      if (outcome.reason === "not_found") return ctx.fail("not_found", "No such order");
      if (outcome.reason === "no_such_place") return ctx.fail("invalid", "No such cooking point");
      return ctx.fail("conflict", outcome.message);
    },
    audit: ({ id, place }) => ({ record: id, params: { place } }),
  });

  // P4: how many orders of the point are under way — «Заказы · 8» in the menu. The point and the rights are the
  // list's (the call layer checks the point), and the number is the «Активные» chip of the same list.
  registry.registerMethod({
    name: "orders.badge",
    app: "orders",
    kind: "query",
    title: "mobile.orders.badge.title",
    access: read,
    input: { type: "object", properties: {} },
    handler: async (_params: Record<string, never>, ctx) => (await orders.counts(placeOf(ctx), ctx.user)).active,
  });
}
