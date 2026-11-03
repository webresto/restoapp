import type { MethodContext, MobileApiRegistry } from "../lib/registry";

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
  /** The product has modifier groups: slice D lets the operator choose, core fills defaults for now. */
  hasOptions: boolean;
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
  /** Epoch milliseconds. */
  createdAt: number;
  updatedAt: number;
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
}

function placeOf(ctx: MethodContext): string {
  // Unreachable without a point: the call layer refuses a scope:"place" call that has none.
  return String(ctx.place?.id ?? ctx.fail("invalid", "No point"));
}

function actorOf(ctx: MethodContext): PosActor {
  return { user: ctx.user, userId: String(ctx.user?.id ?? ctx.fail("unauthorized")), device: ctx.device?.id ?? null };
}

export function registerPos(registry: MobileApiRegistry, pos: PosPort): void {
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
