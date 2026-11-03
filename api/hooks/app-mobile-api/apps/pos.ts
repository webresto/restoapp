import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import type { ClientsPort } from "./clients";
import { decodeCursor, page } from "../lib/cursor";

/**
 * POS — the order a member of staff takes on a terminal (`order-entry.plan.md`).
 *
 * The one app the client draws itself: a receipt with a catalog behind a «+» is not a list with
 * actions on a record, so no declaration describes it (`client: {native: "pos"}`). Everything else
 * is as for every other app — the server owns the rights, the points and the arithmetic: a draft is
 * an ordinary cart of core, every step calls core's own model methods in the order the storefront's
 * resolvers call them, and the answer is always the whole order as the server counted it. Nothing is
 * added up on the device, not even a line total.
 *
 * This slice (A) is the skeleton that proves the path: rights, the point, drafts and the serialized
 * order. The catalog, the lines, receiving, the check and the placing are slice B — their methods
 * land in this file next to `pos.order`.
 */

const POS_TOKEN = "order-entry";
const access = { token: POS_TOKEN };

/** One page of the catalog and of the customers; the client asks for more by cursor. */
export const PAGE_SIZE = 50;

/** core's `SERVICE_TYPES`; the schema of a step names them so ajv refuses a fourth. */
const SERVICE_TYPES = ["delivery", "pickup", "dine-in"];

/** The chosen modifiers as a call carries them; ajv refuses anything else. */
const CHOSEN_OPTIONS = {
  type: "array",
  maxItems: 50,
  items: {
    type: "object",
    required: ["id", "groupId", "amount"],
    properties: {
      id: { type: "string", minLength: 1, maxLength: 100 },
      groupId: { type: "string", minLength: 1, maxLength: 100 },
      amount: { type: "integer", minimum: 0, maximum: 99 },
    },
  },
} as const;

/** A number as typed: digits, a leading plus, the spaces and brackets of a printed form. */
const PHONE_PATTERN = "^[+]?[0-9 ()-]{5,20}$";

/** Material Symbols "point_of_sale", 24×24. */
const ICON =
  "M19 3H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 6H5V5h14v4zM3 21h18v-2H3v2z" +
  "M19 13H5c-1.1 0-2 .9-2 2v2h18v-2c0-1.1-.9-2-2-2zm-7 2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z";

/** A line of the receipt. */
export interface PosLine {
  /** `orderdish.id` — the line, not the product. */
  lineId: number;
  dishId: string;
  name: string;
  amount: number;
  /** What one costs after promotions, and what the line costs. */
  price: number;
  total: number;
  /** Set when a promotion took the line: the price before it. */
  oldPrice: number | null;
  comment: string | null;
  /** The product has modifier groups: `pos.options` says what they are. */
  hasOptions: boolean;
  /** What was chosen of them — what the kitchen will read off this line. */
  options: PosLineOption[];
}

/** One chosen modifier, as the line shows it. */
export interface PosLineOption {
  id: string;
  name: string;
  amount: number;
}

/** The order as the receipt shows it: the server's numbers, the server's state. */
export interface PosOrder {
  id: string;
  /** `shortId` — what staff call it before the RMS gives it a number. */
  number: string;
  state: string;
  /** `delivery` / `pickup` / `dine-in`. */
  serviceType: string;
  /** The point the order is taken for. */
  placeId: string;
  /** Where it is cooked, when core has decided — it may differ from `placeId` for a delivery. */
  cookingPlaceId: string | null;
  cookingPlaceTitle: string | null;
  /** Dine-in: the table, as the venue calls it. Slice B (core task C12a). */
  table: string | null;
  customerName: string | null;
  customerPhone: string | null;
  /** The account the order belongs to, when one was picked or created; a guest order has none. */
  clientId: string | null;
  address: string | null;
  comment: string | null;
  personsCount: number | null;
  /** Epoch milliseconds, or null for «as soon as possible». */
  date: number | null;
  maxWaitMinutes: number | null;
  paymentMethodId: string | null;
  paymentMethodTitle: string | null;
  promotionCode: string | null;
  lines: PosLine[];
  dishesCount: number;
  basketTotal: number;
  discountTotal: number;
  deliveryCost: number;
  bonusesTotal: number;
  total: number;
  /** What core said about the last recount — shown under the receipt, verbatim. */
  message: string | null;
  /** The basket is not empty and the customer has a phone: `pos.check` has something to check. */
  canCheck: boolean;
  /** Checked and not placed yet: `pos.place` will take it. */
  canPlace: boolean;
  /** Epoch milliseconds. */
  createdAt: number;
  updatedAt: number;
}

/** A product as the catalog shows it: the price and the stock core counted for this order. */
export interface PosProduct {
  id: string;
  name: string;
  code: string | null;
  groupId: string | null;
  price: number;
  /** The price after a promotion, when one takes it; null when none does. */
  salePrice: number | null;
  /** Effective stock at the order's kitchens: -1 unlimited, 0 stopped. */
  balance: number;
  weight: number | null;
  imageUrl: string | null;
  /** Has modifier groups: the «+» opens the chooser instead of adding at once. */
  hasOptions: boolean;
  /** How many of it are already in the receipt. */
  inOrder: number;
}

/** A group of the menu, as a tile of the catalog. */
export interface PosGroup {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface PosCatalog {
  /** Where we are: the groups from the top down to the open one. */
  path: PosGroup[];
  groups: PosGroup[];
  items: PosProduct[];
  nextCursor: string | null;
  total: number;
}

/**
 * One option of a modifier group: a product of the menu that is sold with the dish.
 *
 * The numbers are the rules core keeps on the dish (`GroupModifier.childModifiers`), passed through
 * rather than interpreted: the chooser draws them, and the server is the one that checks them.
 */
export interface PosOption {
  /** The modifier's own product id — what goes into `OrderDish.modifiers`. */
  id: string;
  name: string;
  /** What one of it costs on top of the dish. */
  price: number;
  /** Stock at this order's kitchens: -1 unlimited, 0 stopped — the same number a product has. */
  balance: number;
  /** How many are chosen now: the defaults core would fill, or what the line already has. */
  amount: number;
  minAmount: number;
  /** null — the group's own ceiling is the only one. */
  maxAmount: number | null;
  /** How many of it are not charged for (`freeOfChargeAmount`). */
  freeAmount: number;
  defaultAmount: number;
}

/** A group of modifiers of one dish: «Соус», «Размер» — with how many of it may be taken. */
export interface PosOptionGroup {
  id: string;
  name: string;
  required: boolean;
  minAmount: number;
  maxAmount: number | null;
  /** At most one of the group: the chooser draws a choice rather than steppers. */
  single: boolean;
  options: PosOption[];
}

/** What the operator chose, as the client sends it back: core's `OrderModifier`, nothing more. */
export interface PosChosenOption {
  id: string;
  groupId: string;
  amount: number;
}

/**
 * `pos.options`: the dish and what may be chosen with it.
 *
 * No total: what the dish with these options costs is core's arithmetic, and it is read off the
 * receipt after the line is written — the chooser shows what each option adds, nothing summed.
 */
export interface PosOptionsView {
  dishId: string;
  name: string;
  price: number;
  /** The line being edited, when the chooser was opened from the receipt; null — a new line. */
  lineId: number | null;
  amount: number;
  groups: PosOptionGroup[];
}

/** One way of handing the food over, as this point can do it. */
export interface PosServiceOption {
  id: string;
  available: boolean;
  /** Why not, when it is not: the point has no room to eat in, no counter. */
  reason: string | null;
}

/** When the order can be had: what `initCheckout` of core answers, in epoch milliseconds. */
export interface PosTimeOptions {
  asap: boolean;
  /** Pairs [from, to] the order may be timed to. */
  slots: Array<[number, number]>;
  minCookingMinutes: number;
}

export interface PosPaymentOption {
  id: string;
  title: string;
  /** A promise of payment — cash, card on delivery: the only ones the POS can place in v1. */
  isPromise: boolean;
  /** false — the method exists but cannot be taken on a terminal yet (online). */
  available: boolean;
}

/**
 * The server's word about a step: a key of the hook's dictionaries (core's refusals come as
 * `order.error.<code>`), or a text core wrote itself — a delivery adapter's message, a promotion's
 * description. `arg` fills the `%s` of a key.
 */
export interface PosMessage {
  key?: string;
  text?: string;
  arg?: string | number;
  tone: string;
}

/** A step that changed the order, and what the server has to say about it. */
export interface PosStep {
  order: PosOrder | null;
  message: PosMessage | null;
  /** false — core refused; the receipt stays and the message says why. */
  ok: boolean;
}

export interface PosActor {
  user: unknown;
  /** Panel user id — whose draft it is. */
  userId: string;
  device: string | null;
}

export interface PosPort {
  /** The drafts this person has open at this point, newest first. */
  drafts(place: string, userId: string): Promise<PosOrder[]>;
  /** The draft by id, when it is this person's at this point. */
  get(place: string, userId: string, id: string): Promise<PosOrder | null>;
  /** A new cart of this point; `clientId` binds an account at once. */
  start(place: string, actor: PosActor, clientId?: string): Promise<PosOrder>;
  /** Drop a draft: the row goes, the cart stays a cart. false — not this person's draft. */
  cancel(place: string, userId: string, id: string): Promise<boolean>;

  // ---- what goes into the receipt ----

  /** The menu as this order may buy it: core reads it at the order's kitchens. */
  catalog(place: string, id: string, options: { group?: string; q?: string; offset: number; limit: number }): Promise<PosCatalog>;
  /** «+» on a tile: adds the product, or adds one more of it. */
  addProduct(place: string, id: string, dishId: string, amount: number, modifiers?: PosChosenOption[]): Promise<PosStep>;
  /** − / + / «убрать» in the receipt; 0 removes the line. */
  setLineAmount(place: string, id: string, lineId: number, amount: number): Promise<PosStep>;
  setLineComment(place: string, id: string, lineId: number, comment: string): Promise<PosStep>;
  /** What may be chosen with a dish, and what is chosen now — for a new line or for one in the receipt. */
  options(place: string, id: string, input: { dishId?: string; lineId?: number }): Promise<PosOptionsView | null>;
  /** Writes the chosen modifiers onto a line that is already in the receipt. */
  setLineOptions(place: string, id: string, lineId: number, modifiers: PosChosenOption[]): Promise<PosStep>;

  // ---- how it is received ----

  /** What this point can do: a room to eat in, a counter, delivery. */
  serviceOptions(place: string): Promise<PosServiceOption[]>;
  setService(place: string, id: string, serviceType: string, table?: string): Promise<PosStep>;
  setTable(place: string, id: string, table: string): Promise<PosStep>;
  setAddress(place: string, id: string, address: Record<string, unknown>): Promise<PosStep>;
  /** Suggestions of the geo adapter, as the storefront's address form asks for them. */
  addressSearch(city: string, parent: string | undefined, q: string): Promise<Array<{ id: string; name: string; type: string | null }>>;
  /** The cities this installation delivers in. */
  cities(): Promise<Array<{ id: string; name: string }>>;
  /** The addresses the customer has saved. */
  clientAddresses(clientId: string): Promise<Array<{ id: string; formatted: string }>>;

  // ---- who it is for ----

  setCustomer(place: string, id: string, input: { name: string; phone: string; createClient?: boolean }): Promise<PosStep>;
  setClient(place: string, id: string, clientId: string): Promise<PosStep>;

  // ---- when, and what for ----

  timeOptions(place: string, id: string): Promise<PosTimeOptions>;
  setTime(place: string, id: string, input: { mode: string; date?: number; maxWaitMinutes?: number }): Promise<PosStep>;
  payments(place: string, id: string): Promise<PosPaymentOption[]>;
  setPayment(place: string, id: string, paymentMethodId: string, trifleFrom?: number): Promise<PosStep>;
  setDetails(place: string, id: string, input: { comment?: string; personsCount?: number; callback?: boolean }): Promise<PosStep>;
  promocode(place: string, id: string, code: string | null): Promise<PosStep>;

  // ---- the end ----

  /** `Order.check` of core: the order becomes CHECKOUT, or the refusal is said in words. */
  check(place: string, id: string, actor: PosActor): Promise<PosStep>;
  /** `Order.order` of core: the order is placed and leaves the drafts. */
  place(place: string, id: string, actor: PosActor): Promise<PosStep>;
}

function placeOf(ctx: MethodContext): string {
  // Unreachable without a point: the call layer refuses a scope:"place" call that has none.
  return String(ctx.place?.id ?? ctx.fail("invalid", "No point"));
}

function actorOf(ctx: MethodContext): PosActor {
  return { user: ctx.user, userId: String(ctx.user?.id ?? ctx.fail("unauthorized")), device: ctx.device?.id ?? null };
}

/**
 * One step of the order: the port does it, and the answer is the whole order as the server counted
 * it, plus the word the server has about it. A step that found no draft is `not_found`; a step core
 * refused is **not** an error of the protocol — the receipt stays on the screen and the refusal is
 * read out, because «телефон не указан» is the operator's next move, not a failure of the call.
 */
async function step(ctx: MethodContext, run: () => Promise<PosStep>): Promise<{ order: PosOrder | null; message: { text: string; tone: string } | null; ok: boolean }> {
  const outcome = await run();
  if (!outcome.order && !outcome.message) return ctx.fail("not_found", "No such draft");
  return { order: outcome.order, message: say(ctx, outcome.message), ok: outcome.ok };
}

/** A message as the person reads it: the key translated, `%s` filled, or core's own text. */
function say(ctx: MethodContext, message: PosMessage | null): { text: string; tone: string } | null {
  if (!message) return null;
  const text = message.key ? ctx.t(message.key) : message.text ?? "";
  return { text: message.arg === undefined ? text : text.replace("%s", String(message.arg)), tone: message.tone };
}

export function registerPos(registry: MobileApiRegistry, pos: PosPort, clients: ClientsPort): void {
  registry.registerApp({
    id: "pos",
    version: "1.0.0",
    title: "mobile.app.pos.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "pos.order",
    scope: "place",
    // The point is chosen before anything else and every call carries it: the menu of an order is
    // read at a kitchen, so the points are the enabled cooking points the group ticked.
    places: { token: POS_TOKEN, kind: "cooking" },
    client: { native: "pos", min: 1 },
  });

  registry.registerMethod({
    name: "pos.order",
    app: "pos",
    kind: "query",
    title: "mobile.pos.order.title",
    access,
    input: {
      type: "object",
      properties: { id: { type: "string", minLength: 1, maxLength: 100 } },
    },
    handler: async (params: { id?: string }, ctx) => {
      const place = placeOf(ctx);
      const { userId } = actorOf(ctx);
      if (!params.id) return { order: null, drafts: await pos.drafts(place, userId) };
      const order = await pos.get(place, userId, params.id);
      if (!order) return ctx.fail("not_found", "No such draft");
      return { order };
    },
  });

  registry.registerMethod({
    name: "pos.start",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.start.title",
    access,
    input: {
      type: "object",
      properties: { clientId: { type: "string", minLength: 1, maxLength: 100 } },
    },
    handler: async (params: { clientId?: string }, ctx) => {
      const order = await pos.start(placeOf(ctx), actorOf(ctx), params.clientId);
      return { order };
    },
    audit: (_params, result: { order?: PosOrder }) => ({ record: result?.order?.id ?? null, params: {} }),
  });

  // ---- the catalog and the lines ----

  registry.registerMethod({
    name: "pos.catalog",
    app: "pos",
    kind: "query",
    title: "mobile.pos.catalog.title",
    access,
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        group: { type: "string", minLength: 1, maxLength: 100 },
        q: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
      },
    },
    handler: async (params: { id: string; group?: string; q?: string; cursor?: string }, ctx) => {
      const place = placeOf(ctx);
      const { userId } = actorOf(ctx);
      if (!(await pos.get(place, userId, params.id))) return ctx.fail("not_found", "No such draft");
      const offset = decodeCursor(params.cursor, ctx);
      return pos.catalog(place, params.id, { group: params.group, q: params.q?.trim() || undefined, offset, limit: PAGE_SIZE });
    },
  });

  registry.registerMethod({
    name: "pos.add",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.add.title",
    access,
    input: {
      type: "object",
      required: ["id", "dishId"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        dishId: { type: "string", minLength: 1, maxLength: 100 },
        amount: { type: "integer", minimum: 1, maximum: 999, default: 1 },
        modifiers: CHOSEN_OPTIONS,
      },
    },
    handler: (params: { id: string; dishId: string; amount: number; modifiers?: PosChosenOption[] }, ctx) =>
      step(ctx, () => pos.addProduct(placeOf(ctx), params.id, params.dishId, params.amount, params.modifiers)),
    audit: ({ id, dishId, amount, modifiers }) => ({ record: id, params: { dishId, amount, modifiers: modifiers ?? [] } }),
  });

  /**
   * What may be chosen with a dish. A query, because choosing changes nothing until it is added:
   * the operator may back out of the chooser and the receipt is as it was.
   */
  registry.registerMethod({
    name: "pos.options",
    app: "pos",
    kind: "query",
    title: "mobile.pos.options.title",
    access,
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        dishId: { type: "string", minLength: 1, maxLength: 100 },
        lineId: { type: "integer", minimum: 1 },
      },
    },
    handler: async (params: { id: string; dishId?: string; lineId?: number }, ctx) => {
      const place = placeOf(ctx);
      const { userId } = actorOf(ctx);
      if (!(await pos.get(place, userId, params.id))) return ctx.fail("not_found", "No such draft");
      const view = await pos.options(place, params.id, { dishId: params.dishId, lineId: params.lineId });
      if (!view) return ctx.fail("not_found", "No such product");
      return view;
    },
  });

  registry.registerMethod({
    name: "pos.setLineOptions",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setLineOptions.title",
    access,
    input: {
      type: "object",
      required: ["id", "lineId", "modifiers"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        lineId: { type: "integer", minimum: 1 },
        modifiers: CHOSEN_OPTIONS,
      },
    },
    handler: (params: { id: string; lineId: number; modifiers: PosChosenOption[] }, ctx) =>
      step(ctx, () => pos.setLineOptions(placeOf(ctx), params.id, params.lineId, params.modifiers)),
    audit: ({ id, lineId, modifiers }) => ({ record: id, params: { lineId, modifiers } }),
  });

  registry.registerMethod({
    name: "pos.setLine",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setLine.title",
    access,
    input: {
      type: "object",
      required: ["id", "lineId", "amount"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        lineId: { type: "integer", minimum: 1 },
        amount: { type: "integer", minimum: 0, maximum: 999 },
      },
    },
    handler: (params: { id: string; lineId: number; amount: number }, ctx) =>
      step(ctx, () => pos.setLineAmount(placeOf(ctx), params.id, params.lineId, params.amount)),
    audit: ({ id, lineId, amount }) => ({ record: id, params: { lineId, amount } }),
  });

  registry.registerMethod({
    name: "pos.setLineComment",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setLineComment.title",
    access,
    input: {
      type: "object",
      required: ["id", "lineId", "comment"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        lineId: { type: "integer", minimum: 1 },
        comment: { type: "string", maxLength: 500 },
      },
    },
    handler: (params: { id: string; lineId: number; comment: string }, ctx) =>
      step(ctx, () => pos.setLineComment(placeOf(ctx), params.id, params.lineId, params.comment)),
    audit: ({ id, lineId }) => ({ record: id, params: { lineId } }),
  });

  // ---- how the food is handed over ----

  registry.registerMethod({
    name: "pos.serviceOptions",
    app: "pos",
    kind: "query",
    title: "mobile.pos.serviceOptions.title",
    access,
    input: { type: "object", properties: {} },
    handler: async (_params: Record<string, never>, ctx) => ({ options: await pos.serviceOptions(placeOf(ctx)) }),
  });

  registry.registerMethod({
    name: "pos.setService",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setService.title",
    access,
    input: {
      type: "object",
      required: ["id", "serviceType"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        serviceType: { type: "string", enum: SERVICE_TYPES },
        table: { type: "string", maxLength: 100 },
      },
    },
    handler: (params: { id: string; serviceType: string; table?: string }, ctx) =>
      step(ctx, () => pos.setService(placeOf(ctx), params.id, params.serviceType, params.table)),
    audit: ({ id, serviceType, table }) => ({ record: id, params: { serviceType, table } }),
  });

  registry.registerMethod({
    name: "pos.setTable",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setTable.title",
    access,
    input: {
      type: "object",
      required: ["id", "table"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        table: { type: "string", maxLength: 100 },
      },
    },
    handler: (params: { id: string; table: string }, ctx) => step(ctx, () => pos.setTable(placeOf(ctx), params.id, params.table)),
    audit: ({ id, table }) => ({ record: id, params: { table } }),
  });

  registry.registerMethod({
    name: "pos.cities",
    app: "pos",
    kind: "query",
    title: "mobile.pos.cities.title",
    access,
    input: { type: "object", properties: {} },
    handler: async () => ({ items: await pos.cities() }),
  });

  registry.registerMethod({
    name: "pos.addressSearch",
    app: "pos",
    kind: "query",
    title: "mobile.pos.addressSearch.title",
    access,
    input: {
      type: "object",
      required: ["city", "q"],
      properties: {
        city: { type: "string", minLength: 1, maxLength: 100 },
        parent: { type: "string", minLength: 1, maxLength: 100 },
        q: { type: "string", minLength: 1, maxLength: 200 },
      },
    },
    handler: async (params: { city: string; parent?: string; q: string }) => ({
      items: await pos.addressSearch(params.city, params.parent, params.q),
    }),
  });

  registry.registerMethod({
    name: "pos.setAddress",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setAddress.title",
    access,
    input: {
      type: "object",
      required: ["id", "city", "street", "home"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        city: { type: "string", minLength: 1, maxLength: 100 },
        street: { type: "string", minLength: 1, maxLength: 200 },
        home: { type: "string", minLength: 1, maxLength: 50 },
        /** The node of the geo catalog the street came from, when it came from one. */
        node: { type: "string", maxLength: 100 },
        housing: { type: "string", maxLength: 50 },
        entrance: { type: "string", maxLength: 50 },
        floor: { type: "string", maxLength: 50 },
        apartment: { type: "string", maxLength: 50 },
        doorphone: { type: "string", maxLength: 50 },
        comment: { type: "string", maxLength: 500 },
      },
    },
    handler: (params: Record<string, unknown>, ctx) => {
      const { id, ...address } = params as { id: string } & Record<string, unknown>;
      return step(ctx, () => pos.setAddress(placeOf(ctx), id, address));
    },
    // The address of a customer is not written into the audit; the order keeps it.
    audit: (params: any) => ({ record: params.id, params: {} }),
  });

  registry.registerMethod({
    name: "pos.clientAddresses",
    app: "pos",
    kind: "query",
    title: "mobile.pos.clientAddresses.title",
    access,
    input: {
      type: "object",
      required: ["clientId"],
      properties: { clientId: { type: "string", minLength: 1, maxLength: 100 } },
    },
    handler: async (params: { clientId: string }) => ({ items: await pos.clientAddresses(params.clientId) }),
  });

  // ---- who the order is for ----

  registry.registerMethod({
    name: "pos.clients",
    app: "pos",
    kind: "query",
    title: "mobile.pos.clients.title",
    access,
    input: {
      type: "object",
      properties: { q: { type: "string", maxLength: 100 }, cursor: { type: "string", maxLength: 200 } },
    },
    handler: async (params: { q?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const rows = await clients.list({ q: params.q?.trim() || undefined });
      return page(rows, offset, PAGE_SIZE);
    },
  });

  registry.registerMethod({
    name: "pos.setCustomer",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setCustomer.title",
    access,
    input: {
      type: "object",
      required: ["id", "name", "phone"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        name: { type: "string", minLength: 1, maxLength: 100 },
        phone: { type: "string", pattern: PHONE_PATTERN },
        /** Make an account for this number at once, instead of leaving the order a guest's. */
        createClient: { type: "boolean", default: false },
      },
    },
    handler: (params: { id: string; name: string; phone: string; createClient: boolean }, ctx) =>
      step(ctx, () => pos.setCustomer(placeOf(ctx), params.id, { name: params.name.trim(), phone: params.phone, createClient: params.createClient })),
    // The name and the number live on the order; the audit keeps neither.
    audit: ({ id, createClient }) => ({ record: id, params: { createClient } }),
  });

  registry.registerMethod({
    name: "pos.setClient",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setClient.title",
    access,
    input: {
      type: "object",
      required: ["id", "clientId"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        clientId: { type: "string", minLength: 1, maxLength: 100 },
      },
    },
    handler: (params: { id: string; clientId: string }, ctx) => step(ctx, () => pos.setClient(placeOf(ctx), params.id, params.clientId)),
    audit: ({ id, clientId }) => ({ record: id, params: { clientId } }),
  });

  // ---- when, and what for ----

  registry.registerMethod({
    name: "pos.timeOptions",
    app: "pos",
    kind: "query",
    title: "mobile.pos.timeOptions.title",
    access,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    handler: async (params: { id: string }, ctx) => {
      const place = placeOf(ctx);
      const { userId } = actorOf(ctx);
      if (!(await pos.get(place, userId, params.id))) return ctx.fail("not_found", "No such draft");
      return pos.timeOptions(place, params.id);
    },
  });

  registry.registerMethod({
    name: "pos.setTime",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setTime.title",
    access,
    input: {
      type: "object",
      required: ["id", "mode"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        mode: { type: "string", enum: ["asap", "time", "maxWait"] },
        /** Epoch milliseconds of the chosen slot; `mode: "time"` only. */
        date: { type: "integer", minimum: 0 },
        maxWaitMinutes: { type: "integer", minimum: 5, maximum: 600 },
      },
    },
    handler: (params: { id: string; mode: string; date?: number; maxWaitMinutes?: number }, ctx) =>
      step(ctx, () => pos.setTime(placeOf(ctx), params.id, params)),
    audit: ({ id, mode, date, maxWaitMinutes }) => ({ record: id, params: { mode, date, maxWaitMinutes } }),
  });

  registry.registerMethod({
    name: "pos.payments",
    app: "pos",
    kind: "query",
    title: "mobile.pos.payments.title",
    access,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    handler: async (params: { id: string }, ctx) => ({ items: await pos.payments(placeOf(ctx), params.id) }),
  });

  registry.registerMethod({
    name: "pos.setPayment",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setPayment.title",
    access,
    input: {
      type: "object",
      required: ["id", "paymentMethodId"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        paymentMethodId: { type: "string", minLength: 1, maxLength: 100 },
        /** «Сдача с»: the note the customer pays cash with. */
        trifleFrom: { type: "integer", minimum: 0, maximum: 1000000 },
      },
    },
    handler: (params: { id: string; paymentMethodId: string; trifleFrom?: number }, ctx) =>
      step(ctx, () => pos.setPayment(placeOf(ctx), params.id, params.paymentMethodId, params.trifleFrom)),
    audit: ({ id, paymentMethodId, trifleFrom }) => ({ record: id, params: { paymentMethodId, trifleFrom } }),
  });

  registry.registerMethod({
    name: "pos.setDetails",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.setDetails.title",
    access,
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        comment: { type: "string", maxLength: 1000 },
        personsCount: { type: "integer", minimum: 1, maximum: 100 },
        /** «Перезвонить для уточнения» — `customData.callback` of the storefront. */
        callback: { type: "boolean" },
      },
    },
    handler: (params: { id: string; comment?: string; personsCount?: number; callback?: boolean }, ctx) =>
      step(ctx, () => pos.setDetails(placeOf(ctx), params.id, params)),
    audit: ({ id, personsCount, callback }) => ({ record: id, params: { personsCount, callback } }),
  });

  registry.registerMethod({
    name: "pos.promocode",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.promocode.title",
    access,
    input: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        /** Empty or missing — the code is taken off the order. */
        code: { type: "string", maxLength: 100 },
      },
    },
    handler: (params: { id: string; code?: string }, ctx) =>
      step(ctx, () => pos.promocode(placeOf(ctx), params.id, params.code?.trim() || null)),
    audit: ({ id, code }) => ({ record: id, params: { code } }),
  });

  // ---- the end ----

  registry.registerMethod({
    name: "pos.check",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.check.title",
    access,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    handler: (params: { id: string }, ctx) => step(ctx, () => pos.check(placeOf(ctx), params.id, actorOf(ctx))),
    audit: ({ id }) => ({ record: id, params: {} }),
  });

  registry.registerMethod({
    name: "pos.place",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.place.title",
    access,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    handler: (params: { id: string }, ctx) => step(ctx, () => pos.place(placeOf(ctx), params.id, actorOf(ctx))),
    audit: ({ id }) => ({ record: id, params: {} }),
  });

  registry.registerMethod({
    name: "pos.cancel",
    app: "pos",
    kind: "mutation",
    title: "mobile.pos.cancel.title",
    access,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    handler: async ({ id }: { id: string }, ctx) => {
      const { userId } = actorOf(ctx);
      if (!(await pos.cancel(placeOf(ctx), userId, id))) return ctx.fail("not_found", "No such draft");
      return { ok: true };
    },
    audit: ({ id }) => ({ record: id, params: {} }),
  });
}
