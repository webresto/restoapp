import type {
  AssignKitchenOutcome,
  OrderItem,
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

/** The lines of an order, newest order of creation: "2 × Борщ". */
async function contentsOf(orderId: string): Promise<string> {
  const lines = await OrderDish.find({ where: { order: orderId } }).populate("dish").sort("createdAt ASC");
  return lines
    .map((line: any) => {
      const name = line.dish?.name ?? line.dish?.title ?? line.dish?.id ?? "—";
      const amount = typeof line.amount === "number" ? line.amount : 1;
      return `${amount} × ${name}`;
    })
    .join("\n");
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
  const { NO_KITCHEN, countOrdersOfPlace, orderPlaceKey, ordersOfPlace: selectOrders } = ordersOfPlace();
  const { isOperatorUser, getAllowedOrderTransitionsByRole } = stateFlow();

  /**
   * One order as the protocol has it. `summary` is the second line of a row: who and how.
   *
   * The lines of the order are read only when the card asks for them: a list of fifty orders does
   * not show them, and reading them would be fifty queries for nothing.
   */
  async function toItem(order: any, user: unknown, withContents = false): Promise<OrderItem> {
    const number = order.shortId || String(order.id).slice(-8);
    const customerName = order?.customer?.name || "";
    const method = order.serviceType || "delivery";
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
      contents: withContents ? await contentsOf(String(order.id)) : "",
      deliveryCost: typeof order?.delivery?.cost === "number" ? order.delivery.cost : 0,
      total: typeof order.total === "number" ? order.total : 0,
      paid: Boolean(order.paid),
      allowedTransitions: getAllowedOrderTransitionsByRole(order.state || "NEW", isOperatorUser(user)),
      placeId: orderPlaceKey(order),
    };
  }

  /** The order, but only if it is led by this point: by direct id, as in the list. */
  async function ofPlace(place: string, id: string): Promise<any | null> {
    const order = await Order.findOne({ id });
    if (!order || orderPlaceKey(order) !== place) return null;
    return order;
  }

  return {
    async list(place, { tab, since, user }) {
      const rows = await selectOrders(place, { tab, since });
      return Promise.all(rows.map((order: any) => toItem(order, user)));
    },

    async counts(place) {
      return countOrdersOfPlace(place);
    },

    async get(place, id, user) {
      const order = await ofPlace(place, id);
      return order ? toItem(order, user, true) : null;
    },

    async setState(place, id, to, { user, device }): Promise<SetStateOutcome> {
      if (!(await ofPlace(place, id))) return { ok: false, reason: "not_found" };
      const result = await transitions().transitionOrder({ id }, to, {
        user,
        source: "mobile-api",
        ...(device ? { data: { device } } : {}),
      });
      if (result.ok) return { ok: true, item: await toItem(result.order, user, true) };
      if (result.reason === "not_found") return { ok: false, reason: "not_found" };
      if (result.reason === "forbidden") return { ok: false, reason: "forbidden", allowed: result.allowedTransitions };
      if (result.reason === "invalid_state") return { ok: false, reason: "failed", message: `Unknown state ${to}` };
      return { ok: false, reason: "failed", message: result.message };
    },

    async assignKitchen(place, id, kitchen, { user, device }): Promise<AssignKitchenOutcome> {
      // Only from «Без кухни»: that is the point such an order is led by until it has a kitchen.
      if (place !== NO_KITCHEN || !(await ofPlace(place, id))) return { ok: false, reason: "not_found" };
      const result = await kitchens().assignOrderKitchen({ id }, kitchen, {
        user,
        source: "mobile-api",
        ...(device ? { data: { device } } : {}),
      });
      if (result.ok) return { ok: true, item: await toItem(result.order, user, true) };
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
