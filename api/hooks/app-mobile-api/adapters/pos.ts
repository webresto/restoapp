import type { PosActor, PosLine, PosOrder, PosPort } from "../apps/pos";

/**
 * The POS on core's own models.
 *
 * A draft is a cart of core and nothing else: `Order.create` makes it, the storefront's resolvers
 * make theirs the same way (`local_modules/graphql/src/resolvers/order.ts`), and every number on the
 * receipt is read back from the order core counted — never computed here. `mobile_order_draft`
 * remembers only whose cart it is and at which point, because a cart of core carries neither.
 *
 * The point is how the order is tied to a kitchen: for pickup and dine-in it is the order's
 * `pickupPoint`, which is what core's kitchen resolution answers with for those two service types.
 * A delivery is left to the address, as on the site — `resolveCookingPlace` names the kitchen, and
 * the receipt shows which one it chose.
 */

declare const Order: any;
declare const Place: any;
declare const User: any;
declare const MobileOrderDraft: any;

/** States a draft can still be in; anything else is an order and leaves the drafts. */
const DRAFT_STATES = ["NEW", "CART", "CHECKOUT"];
/** How many drafts one person sees at a point. */
const DRAFTS_LIMIT = 50;

const { v4: uuid } = require("uuid");

function phoneString(phone: any): string | null {
  if (!phone || typeof phone !== "object") return null;
  const code = String(phone.code ?? "").trim();
  const number = String(phone.number ?? "").trim();
  if (!number) return null;
  return code ? `${code.startsWith("+") ? "" : "+"}${code} ${number}` : number;
}

function lineOf(orderDish: any): PosLine {
  const dish = orderDish.dish ?? {};
  const before = Number(orderDish.itemTotalBeforeDiscount) || 0;
  const total = Number(orderDish.itemTotal) || 0;
  const amount = Number(orderDish.amount) || 0;
  return {
    lineId: Number(orderDish.id),
    dishId: String(dish.id ?? ""),
    name: dish.name ?? "",
    amount,
    price: Number(orderDish.itemPrice) || 0,
    total,
    // Only when a promotion actually took the line: otherwise the two are equal and there is
    // nothing to cross out.
    oldPrice: before && before !== total ? before : null,
    comment: orderDish.comment || null,
    hasOptions: Array.isArray(dish.modifiers) && dish.modifiers.length > 0,
  };
}

async function placeTitle(id: string | null): Promise<string | null> {
  if (!id) return null;
  const place = await Place.findOne({ id });
  return place?.title || id;
}

/** The order as the receipt shows it. Every number is core's. */
async function toPosOrder(full: any, placeId: string): Promise<PosOrder> {
  const cooking = Array.isArray(full.cookingPoints) && full.cookingPoints.length ? String(full.cookingPoints[0]) : null;
  const customer = full.customer ?? {};
  const user = full.user && typeof full.user === "object" ? full.user : null;
  const date = full.date ? Date.parse(String(full.date).replace(" ", "T")) : NaN;
  return {
    id: String(full.id),
    number: full.rmsOrderNumber || full.shortId || String(full.id).slice(0, 8),
    state: full.state,
    serviceType: full.serviceType ?? "delivery",
    placeId,
    cookingPlaceId: cooking,
    cookingPlaceTitle: await placeTitle(cooking),
    table: full.table || null,
    customerName: customer.name || null,
    customerPhone: phoneString(customer.phone),
    clientId: user ? String(user.id) : full.user ? String(full.user) : null,
    address: full.address?.formatted || null,
    comment: full.comment || null,
    personsCount: Number(full.personsCount) || null,
    date: Number.isFinite(date) ? date : null,
    maxWaitMinutes: full.maxWaitMinutes ?? null,
    paymentMethodId: full.paymentMethod ? String(full.paymentMethod.id ?? full.paymentMethod) : null,
    paymentMethodTitle: full.paymentMethodTitle || null,
    promotionCode: full.promotionCodeString || null,
    lines: (full.dishes ?? []).map(lineOf),
    dishesCount: Number(full.dishesCount) || 0,
    basketTotal: Number(full.basketTotal) || 0,
    discountTotal: Number(full.discountTotal) || 0,
    deliveryCost: Number(full.delivery?.cost) || 0,
    bonusesTotal: Number(full.bonusesTotal) || 0,
    total: Number(full.total) || 0,
    message: full.message || null,
    createdAt: Number(full.createdAt) || 0,
    updatedAt: Number(full.updatedAt) || 0,
  };
}

/** The draft row of this order, when it is this person's at this point. */
async function draftRow(place: string, userId: string, orderId: string): Promise<any | null> {
  const row = await MobileOrderDraft.findOne({ order: orderId, user: userId, place });
  return row ?? null;
}

export function corePos(): PosPort {
  async function serialize(place: string, orderId: string): Promise<PosOrder | null> {
    const full = await Order.populate({ id: orderId });
    if (!full?.id) return null;
    return toPosOrder(full, place);
  }

  return {
    async drafts(place, userId) {
      const rows = await MobileOrderDraft.find({ where: { user: userId, place }, sort: "createdAt DESC", limit: DRAFTS_LIMIT });
      const orders: PosOrder[] = [];
      for (const row of rows) {
        const order = await Order.findOne({ id: row.order });
        // Placed or gone: the row has nothing left to point at, so it goes with it.
        if (!order || !DRAFT_STATES.includes(order.state)) {
          await MobileOrderDraft.destroy({ id: row.id });
          continue;
        }
        const view = await serialize(place, row.order);
        if (view) orders.push(view);
      }
      return orders;
    },

    async get(place, userId, id) {
      if (!(await draftRow(place, userId, id))) return null;
      return serialize(place, id);
    },

    async start(place, actor, clientId) {
      const point = await Place.findOne({ id: place });
      if (!point) return Promise.reject(new Error(`no such place ${place}`));

      // What this point can do decides how the order starts: a room to eat in means dine-in, a
      // counter means pickup, and a kitchen that does neither only delivers.
      const serviceType = point.hasDiningArea ? "dine-in" : point.isPickupPoint ? "pickup" : "delivery";

      const init: Record<string, unknown> = {};
      if (clientId) {
        const client = await User.findOne({ id: clientId });
        if (client) {
          init.user = String(client.id);
          const name = [client.firstName, client.lastName].filter(Boolean).join(" ").trim();
          if (name || client.phone) init.customer = { name, phone: client.phone ?? null };
        }
      }
      const order = await Order.create(init).fetch();
      // Not in the `create`: `beforeCreate` of core writes `serviceType: "delivery"` over whatever
      // was passed, so the type is set afterwards and through the model's own method. Pickup and
      // dine-in are cooked at the point they are collected from, which is also how core reads the
      // menu of the order (`resolveCookingPlace`, the pickup-point strategy).
      if (serviceType !== "delivery") {
        await Order.setServiceType({ id: order.id }, serviceType);
        await Order.update({ id: order.id }, { pickupPoint: String(place) }).fetch();
      }
      await MobileOrderDraft.create({
        id: uuid(),
        order: String(order.id),
        user: actor.userId,
        device: actor.device,
        place: String(place),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      await Order.log({ id: order.id }, "info", "mobile-api", "order entry: draft started", {
        place: String(place),
        panelUser: actor.userId,
        device: actor.device,
        serviceType,
        clientId: clientId ?? null,
      });
      return (await serialize(place, String(order.id))) as PosOrder;
    },

    async cancel(place, userId, id) {
      const row = await draftRow(place, userId, id);
      if (!row) return false;
      await MobileOrderDraft.destroy({ id: row.id });
      await Order.log({ id }, "info", "mobile-api", "order entry: draft dropped", { place, panelUser: userId });
      return true;
    },
  };
}
