import type { HomeLine, HomeOrder, HomePort } from "../apps/home";

/**
 * «Главная» on the functions of core: the orders of a point are core's `ordersOfPlace` — the board's and the
 * phone's «Заказы» — and the balances are those of the web Stock Manager (`lib/menu/stock-items`). The summary
 * counts on top of them and decides nothing about which order is whose.
 */

declare const OrderDish: any;
declare const Group: any;

const CORE = "@webresto/core";
const ordersOfPlace = () => require(`${CORE}/lib/order/orders-of-place`);
const stockFunctions = () => require(`${CORE}/lib/menu/stock-items`);
const balanceFunctions = () => require(`${CORE}/lib/menu/dish-place-balance`);

const LIMITED_MAX = 2000;

function millis(value: unknown): number {
  if (typeof value === "number") return value;
  const parsed = new Date(value as any).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function toOrder(order: any): HomeOrder {
  return {
    id: String(order.id),
    number: order.shortId || String(order.id).slice(-8),
    state: order.state || "NEW",
    createdAt: order.orderedAt ? order.orderedAt * 1000 : millis(order.createdAt),
    total: typeof order.total === "number" ? order.total : 0,
    customerName: order?.customer?.name || "",
    method: order.serviceType || "delivery",
  };
}

export function coreHome(): HomePort {
  return {
    async orders(place, from, to) {
      const { ordersOfPlace: select } = ordersOfPlace();
      // What is under way now, and what ended in the week before `to`: a day of a point is inside both.
      const [active, done] = await Promise.all([select(place, { tab: "active" }), select(place, { tab: "done", now: to })]);
      const seen = new Set<string>();
      const result: HomeOrder[] = [];
      for (const row of [...active, ...done]) {
        const order = toOrder(row);
        if (seen.has(order.id) || order.createdAt < from || order.createdAt >= to) continue;
        seen.add(order.id);
        result.push(order);
      }
      return result;
    },

    async lines(place, orderIds): Promise<HomeLine[]> {
      if (!orderIds.length) return [];
      const { orderPlaceKey } = ordersOfPlace();
      const rows = await OrderDish.find({ where: { order: { in: orderIds } } }).populate("dish").populate("order");
      // A routed order: a kitchen counts what it makes; the leading point — also the lines without a kitchen.
      const ours = rows.filter((line: any) => {
        const at = line.cookingPoint && typeof line.cookingPoint === "object" ? line.cookingPoint.id : line.cookingPoint;
        return at ? String(at) === place : orderPlaceKey(line.order) === place;
      });
      const groupIds = [...new Set(ours.map((line: any) => line.dish?.parentGroup).filter(Boolean).map(String))];
      const groups = groupIds.length ? await Group.find({ where: { id: { in: groupIds } } }) : [];
      const groupName = new Map(groups.map((group: any) => [String(group.id), group.name ?? null]));
      return ours.map((line: any) => ({
        id: String(line.dish?.id ?? line.dish ?? line.name),
        title: line.dish?.name ?? line.name ?? "—",
        group: groupName.get(String(line.dish?.parentGroup)) ?? null,
        amount: typeof line.amount === "number" ? line.amount : 1,
      }));
    },

    async balances(place) {
      const { results } = await stockFunctions().getLimitedStockProducts(place, LIMITED_MAX);
      const unlimited = balanceFunctions().UNLIMITED_BALANCE;
      return results.map((product: any) => {
        if (product.placeEnable === false) return 0;
        const balance = product.balance;
        return typeof balance === "number" && balance !== unlimited ? balance : null;
      });
    },
  };
}
