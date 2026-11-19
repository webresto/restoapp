import type {
  AssignKitchenOutcome,
  OrderItem,
  OrderLine,
  OrdersActor,
  OrdersPort,
  SetStateOutcome,
} from "../apps/orders";

/**
 * «Заказы» on the functions of core (plan C1, C5, C6).
 *
 * Nothing here decides anything: which orders belong to a point, what a role may move an order to
 * and what assigning a kitchen means are core's, shared with the web board. This turns core's
 * records into the records of the protocol and core's answers into the protocol's outcomes.
 */

declare const Order: any;
declare const OrderDish: any;

const CORE = "@webresto/core";
const ordersOfPlace = () => require(`${CORE}/lib/order/orders-of-place`);
const transitions = () => require(`${CORE}/lib/order/transitionOrder`);
const kitchens = () => require(`${CORE}/lib/order/assignKitchen`);
const stateFlow = () => require(`${CORE}/lib/order/OrderStateFlow`);

declare const Dish: any;
declare const PromotionCode: any;

/** Whether this point makes the line: its own kitchen, or — without one — the leading point. */
function lineIsOurs(line: any, place: string, leading: boolean): boolean {
  const at = line.cookingPoint && typeof line.cookingPoint === "object" ? line.cookingPoint.id : line.cookingPoint;
  return at ? String(at) === place : leading;
}

function amountOf(line: any): number {
  return typeof line.amount === "number" ? line.amount : 1;
}

/**
 * The lines of the order this point has to make, in the order they were added.
 *
 * A line names its own kitchen only when a route planner gave it one; a line without one is cooked
 * at the leading point. So a kitchen that is not the leading one sees only what it was given — the
 * plan's «состав — строки этой точки» — and everyone else sees the whole order.
 *
 * The note of a line is its modifiers («Тонкое тесто · 2 × Сыр») and its comment; the value is what core
 * counted for the line (`itemTotal`), or the price times the amount when it counted nothing.
 */
async function linesOf(orderId: string, place: string, leading: boolean): Promise<OrderLine[]> {
  const rows = await OrderDish.find({ where: { order: orderId } }).populate("dish").sort("createdAt ASC");
  const ours = rows.filter((line: any) => lineIsOurs(line, place, leading));
  const modifierIds = [...new Set(ours.flatMap((line: any) => (Array.isArray(line.modifiers) ? line.modifiers : []).map((modifier: any) => String(modifier?.id ?? ""))).filter(Boolean))];
  const modifiers = modifierIds.length ? await Dish.find({ where: { id: { in: modifierIds } } }) : [];
  const modifierName = new Map(modifiers.map((dish: any) => [String(dish.id), dish.name ?? String(dish.id)]));
  return ours.map((line: any) => {
    const amount = amountOf(line);
    const named = (Array.isArray(line.modifiers) ? line.modifiers : []).map((modifier: any) => {
      const name = modifier?.dish?.name ?? modifierName.get(String(modifier?.id)) ?? null;
      if (!name) return null;
      const times = typeof modifier.amount === "number" ? modifier.amount : 1;
      return times > 1 ? `${times} × ${name}` : name;
    });
    const note = [...named, line.comment || null].filter(Boolean).join(" · ");
    // A line core has not counted yet carries zeros: the price of the dish is then the honest number.
    const price = typeof line.itemPrice === "number" && line.itemPrice > 0 ? line.itemPrice : typeof line.dish?.price === "number" ? line.dish.price : 0;
    const value = typeof line.itemTotal === "number" && line.itemTotal > 0 ? line.itemTotal : price * amount;
    return {
      title: line.dish?.name ?? line.dish?.title ?? line.name ?? line.dish?.id ?? "—",
      amount,
      ...(note ? { note } : {}),
      value: Math.round(value * 100) / 100,
    };
  });
}

/** "2 × Борщ", one line each — the text field the card had before it had lines. */
function contentsText(lines: OrderLine[]): string {
  return lines.map((line) => `${line.amount} × ${line.title}`).join("\n");
}

/**
 * How many portions each of these orders has at this point, in one query: the number on a row of the list.
 */
async function portionsOf(orders: any[], place: string, orderPlaceKey: (order: any) => string): Promise<Map<string, number>> {
  const ids = orders.map((order) => String(order.id));
  const result = new Map<string, number>(ids.map((id) => [id, 0]));
  if (!ids.length) return result;
  const leading = new Map(orders.map((order) => [String(order.id), orderPlaceKey(order) === place]));
  const rows = await OrderDish.find({ where: { order: { in: ids } } });
  for (const line of rows) {
    const id = String(typeof line.order === "object" ? line.order?.id : line.order);
    if (!result.has(id) || !lineIsOurs(line, place, leading.get(id) ?? false)) continue;
    result.set(id, (result.get(id) ?? 0) + amountOf(line));
  }
  return result;
}

/**
 * «−10%» for a code all of whose promotions take the same percentage off — the words of the totals line.
 * A flat discount or a mix of promotions says nothing: the line already carries the money.
 */
async function promoLabelOf(code: unknown): Promise<string | null> {
  if (!code) return null;
  try {
    const id = typeof code === "object" ? (code as any).id : code;
    const row = await PromotionCode.findOne({ id: String(id) }).populate("promotion");
    const percents = new Set(
      (row?.promotion ?? []).map((promotion: any) => {
        const config = promotion?.configDiscount ?? {};
        return config.discountType === "percentage" && Number(config.discountAmount) > 0 ? Number(config.discountAmount) : NaN;
      }),
    );
    if (percents.size !== 1) return null;
    const [percent] = [...percents] as number[];
    return Number.isFinite(percent) ? `−${percent}%` : null;
  } catch {
    return null;
  }
}

/** The code that was taken, as typed; null when none was or it was refused (`promotionCode` is empty then). */
function promoCodeOf(order: any): string | null {
  const taken = order?.promotionCode !== null && order?.promotionCode !== undefined && order?.promotionCode !== "";
  return taken && order.promotionCodeString ? String(order.promotionCodeString) : null;
}

function numberOr(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function phoneOf(order: any): string {
  const phone = order?.customer?.phone;
  if (!phone || typeof phone !== "object") return "";
  return `${phone.code ?? ""}${phone.number ?? ""}${phone.additionalNumber ?? ""}`;
}

/** Epoch milliseconds out of what Waterline hands over: a number, a Date or an ISO string. */
function millis(value: unknown): number {
  if (typeof value === "number") return value;
  const parsed = new Date(value as any).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * What an operator and a courier read: the line the geo adapter rebuilt (`formatted`), then what
 * only the recipient knows — flat, entrance, floor — and the customer's note about getting there.
 */
function addressOf(order: any): string | null {
  const address = order?.address;
  if (!address || typeof address !== "object") return null;
  const tail = [
    address.housing ? `к. ${address.housing}` : "",
    address.apartment ? `кв. ${address.apartment}` : "",
    address.entrance ? `под. ${address.entrance}` : "",
    address.floor ? `эт. ${address.floor}` : "",
    address.comment || "",
  ].filter(Boolean);
  const line = [address.formatted || "", ...tail].filter(Boolean).join(", ");
  return line || null;
}

export function coreOrders(): OrdersPort {
  const { NO_KITCHEN, countOrdersOfPlace, orderIsAtPlace, orderPlaceKey, ordersOfPlace: selectOrders } = ordersOfPlace();
  const { isOperatorUser, getAllowedOrderTransitionsByRole } = stateFlow();

  /**
   * One order as the protocol has it. `summary` is the second line of a row: who and how.
   *
   * The lines of the order are read only when the card asks for them (`place` given): a list of fifty orders
   * does not show them — it shows how many portions there are, which `list` counts in one query for all rows.
   */
  async function toItem(order: any, user: unknown, place: string | null = null, portions: number | null = null): Promise<OrderItem> {
    const number = order.shortId || String(order.id).slice(-8);
    const customerName = order?.customer?.name || "";
    const method = order.serviceType || "delivery";
    const lines = place ? await linesOf(String(order.id), place, orderPlaceKey(order) === place) : null;
    const discountTotal = numberOr(order.discountTotal);
    const promoCode = promoCodeOf(order);
    const owner = order.user && typeof order.user === "object" ? order.user.id : order.user;
    return {
      id: String(order.id),
      number,
      title: `№ ${number}`,
      summary: [customerName, method].filter(Boolean).join(" · "),
      state: order.state || "NEW",
      createdAt: order.orderedAt ? order.orderedAt * 1000 : millis(order.createdAt),
      updatedAt: millis(order.updatedAt),
      customerName,
      customerPhone: phoneOf(order),
      method,
      address: addressOf(order),
      comment: order.comment || null,
      contents: lines ? contentsText(lines) : "",
      deliveryCost: typeof order?.delivery?.cost === "number" ? order.delivery.cost : 0,
      total: typeof order.total === "number" ? order.total : 0,
      paid: Boolean(order.paid),
      allowedTransitions: getAllowedOrderTransitionsByRole(order.state || "NEW", isOperatorUser(user)),
      placeId: orderPlaceKey(order),
      itemsCount: lines ? lines.reduce((sum, line) => sum + line.amount, 0) : portions ?? 0,
      table: method === "dine-in" && order.table ? String(order.table) : null,
      customerId: owner ? String(owner) : null,
      basketTotal: numberOr(order.basketTotal),
      discount: discountTotal > 0 ? discountTotal : numberOr(order.promotionFlatDiscount),
      promoCode,
      promoLabel: lines && promoCode ? await promoLabelOf(order.promotionCode) : null,
      ...(lines ? { lines } : {}),
    };
  }

  /**
   * The order, but only if this point has a stop of it — the same rule the list follows, so what a
   * row shows can always be opened. A kitchen that is not the leading one of a routed order is such
   * a point: it reads the order and the part it has to make, and it does not move it.
   */
  async function atPlace(place: string, id: string): Promise<any | null> {
    const order = await Order.findOne({ id });
    if (!order || !(await orderIsAtPlace(id, place))) return null;
    return order;
  }

  return {
    async list(place, { tab, since, user }) {
      const rows = await selectOrders(place, { tab, since });
      const portions = await portionsOf(rows, place, orderPlaceKey);
      return Promise.all(rows.map((order: any) => toItem(order, user, null, portions.get(String(order.id)) ?? 0)));
    },

    async countSince(place, from) {
      // The board's own selection: what is under way, and what ended within its window — a day is inside both.
      const [active, done] = await Promise.all([selectOrders(place, { tab: "active" }), selectOrders(place, { tab: "done" })]);
      const seen = new Set<string>();
      for (const order of [...active, ...done]) {
        const at = order.orderedAt ? order.orderedAt * 1000 : millis(order.createdAt);
        if (at >= from) seen.add(String(order.id));
      }
      return seen.size;
    },

    async counts(place) {
      return countOrdersOfPlace(place);
    },

    async get(place, id, user) {
      const order = await atPlace(place, id);
      return order ? toItem(order, user, place) : null;
    },

    async setState(place, id, to, { user, device }): Promise<SetStateOutcome> {
      const order = await atPlace(place, id);
      if (!order) return { ok: false, reason: "not_found" };
      // The state of the whole order is the leading point's to change: a second kitchen of a routed
      // order reads it and makes its part (plan, section 3 and C3).
      if (orderPlaceKey(order) !== place) {
        return { ok: false, reason: "failed", message: "This order is led by another point" };
      }
      const result = await transitions().transitionOrder({ id }, to, {
        user,
        source: "mobile-api",
        ...(device ? { data: { device } } : {}),
      });
      if (result.ok) return { ok: true, item: await toItem(result.order, user, place) };
      if (result.reason === "not_found") return { ok: false, reason: "not_found" };
      if (result.reason === "forbidden") return { ok: false, reason: "forbidden", allowed: result.allowedTransitions };
      if (result.reason === "invalid_state") return { ok: false, reason: "failed", message: `Unknown state ${to}` };
      return { ok: false, reason: "failed", message: result.message };
    },

    async assignKitchen(place, id, kitchen, { user, device }): Promise<AssignKitchenOutcome> {
      // Only from «Без кухни»: that is the point such an order is led by until it has a kitchen.
      if (place !== NO_KITCHEN || !(await atPlace(place, id))) return { ok: false, reason: "not_found" };
      const result = await kitchens().assignOrderKitchen({ id }, kitchen, {
        user,
        source: "mobile-api",
        ...(device ? { data: { device } } : {}),
      });
      if (result.ok) return { ok: true, item: await toItem(result.order, user, place) };
      if (result.reason === "not_found") return { ok: false, reason: "not_found" };
      if (result.reason === "no_such_place") return { ok: false, reason: "no_such_place" };
      if (result.reason === "not_assignable") {
        return { ok: false, reason: "conflict", message: "This order is collected at the point the customer chose" };
      }
      return { ok: false, reason: "conflict", message: "The order already has a kitchen" };
    },
  };
}

export type { OrdersActor };
