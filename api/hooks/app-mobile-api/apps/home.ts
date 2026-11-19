import type { MethodContext, MobileApiRegistry } from "../lib/registry";

/**
 * «Главная» — the day of a point at a glance, the first screen of the RestoApp touch app
 * (`restoapp-mobile-admin/_plan/07-prototype-1to1.md`). The client draws it itself (`client.native: "home"`);
 * a client that has no such screen shows its tiles, as before.
 *
 * One query, `home.summary`, and the record carries only what the person may see — a key that is not there is
 * a block the client does not draw:
 * - the money of the day (revenue, by hour, the average check and their change against the same weekday a week
 *   ago) — with the right to the orders report of the panel, `orders-report`;
 * - the orders and the kitchen — with the orders of this point (`orders.list` opens there for them);
 * - the stop list and what sells — with the stock of this point (`dishes.list` opens there for them).
 *
 * The points are those of the orders and of the stock together (`places.anyOf`): a stock manager has the home of
 * their kitchens, an operator of theirs. Nothing is computed here that the web does not already decide: the orders
 * of a point are core's `ordersOfPlace`, the balances are the web Stock Manager's.
 */

/** An order of the day as the summary needs it. */
export interface HomeOrder {
  id: string;
  number: string;
  state: string;
  /** Epoch milliseconds. */
  createdAt: number;
  total: number;
  customerName: string;
  /** `delivery` / `pickup` / `dine-in`. */
  method: string;
}

export interface HomeLine {
  /** The dish, or the name when the dish is gone. */
  id: string;
  title: string;
  group: string | null;
  amount: number;
}

export interface HomePort {
  /** Every order of the point placed in [from, to), rejected ones included. */
  orders(place: string, from: number, to: number): Promise<HomeOrder[]>;
  /** The lines of these orders this point makes. */
  lines(place: string, orderIds: string[]): Promise<HomeLine[]>;
  /** The balances of the dishes with a limit at the point: `null` — no limit. */
  balances(place: string): Promise<Array<number | null>>;
}

export const ACTIVE_STATES = ["ORDER", "COOKING", "ON_THE_WAY"];
const REJECTED = "REJECT";
const REVENUE_TOKEN = "orders-report";

const STATE_TITLES: Record<string, string> = {
  ORDER: "mobile.orders.state.ORDER",
  COOKING: "mobile.orders.state.COOKING",
  ON_THE_WAY: "mobile.orders.state.ON_THE_WAY",
  DONE: "mobile.orders.state.DONE",
  REJECT: "mobile.orders.state.REJECT",
};
const STATE_TONES: Record<string, string> = { ORDER: "info", COOKING: "warning", ON_THE_WAY: "success", DONE: "success", REJECT: "muted" };

const DAY = 24 * 3_600_000;
const WEEK = 7 * DAY;
/** «Мало»: a balance this small is about to stop. */
const LOW = 5;

/** Lucide "house", 24×24. */
const ICON = "M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z";

/** Midnight of the server's day (TZ of the server, as the reports of the panel count days). */
export function startOfDay(now: number): number {
  const day = new Date(now);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

/** The change in per cent, rounded; null when there is nothing honest to compare with. */
function deltaOf(now: number, before: number): number | null {
  if (before <= 0) return null;
  return Math.round(((now - before) / before) * 100);
}

function placeOf(ctx: MethodContext): string {
  return String(ctx.place?.id ?? ctx.fail("invalid", "No point"));
}

export function registerHome(registry: MobileApiRegistry, home: HomePort, clock: () => number = Date.now): void {
  registry.registerApp({
    id: "home",
    version: "1.0.0",
    title: "mobile.app.home.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "home.summary",
    scope: "place",
    places: { anyOf: ["order-kanban", "stock-manager"], kind: "any" },
    models: {
      summary: {
        fields: [
          { name: "revenue", title: "mobile.home.field.revenue", format: "money", readonly: true, access: { token: REVENUE_TOKEN } },
          { name: "averageCheck", title: "mobile.home.field.averageCheck", format: "money", readonly: true, access: { token: REVENUE_TOKEN } },
          { name: "orders", title: "mobile.home.field.orders", format: "number", readonly: true },
          { name: "stop", title: "mobile.home.field.stop", format: "number", readonly: true },
        ],
      },
    },
    client: { native: "home", min: 1 },
  });

  registry.registerMethod({
    name: "home.summary",
    app: "home",
    kind: "query",
    title: "mobile.home.summary.title",
    access: { anyOf: ["order-kanban", "stock-manager"] },
    model: "summary",
    input: { type: "object", properties: {} },
    ui: { view: "detail" },
    handler: async (_params: Record<string, never>, ctx) => {
      const place = placeOf(ctx);
      const now = clock();
      const from = startOfDay(now);
      const [money, seesOrders, seesStock] = await Promise.all([
        ctx.can(REVENUE_TOKEN),
        ctx.canOpen("orders.list", place),
        ctx.canOpen("dishes.list", place),
      ]);

      const item: Record<string, unknown> = {};
      // The orders of the day are read once, for whichever block needs them.
      const today = money || seesOrders || seesStock ? await home.orders(place, from, now + 1) : [];
      const sold = today.filter((order) => order.state !== REJECTED);

      if (money) {
        const revenue = sold.reduce((sum, order) => sum + order.total, 0);
        const average = sold.length ? Math.round(revenue / sold.length) : 0;
        // A week ago, up to the same minute: the same weekday, the same part of the day.
        const before = (await home.orders(place, from - WEEK, now - WEEK + 1)).filter((order) => order.state !== REJECTED);
        const revenueBefore = before.reduce((sum, order) => sum + order.total, 0);
        const averageBefore = before.length ? Math.round(revenueBefore / before.length) : 0;
        item.revenue = revenue;
        const revenueDelta = deltaOf(revenue, revenueBefore);
        if (revenueDelta !== null) item.revenueDelta = revenueDelta;
        item.averageCheck = average;
        const averageDelta = deltaOf(average, averageBefore);
        if (averageDelta !== null) item.averageCheckDelta = averageDelta;
        // The hours of the day that had an order, and the ones between them: a chart without gaps.
        const byHour = new Map<number, number>();
        for (const order of sold) {
          const hour = new Date(order.createdAt).getHours();
          byHour.set(hour, (byHour.get(hour) ?? 0) + order.total);
        }
        const hours = [...byHour.keys()].sort((a, b) => a - b);
        const series: Array<{ x: string; y: number }> = [];
        if (hours.length) {
          for (let hour = hours[0]; hour <= hours[hours.length - 1]; hour += 1) {
            series.push({ x: `${String(hour).padStart(2, "0")}:00`, y: byHour.get(hour) ?? 0 });
          }
        }
        item.revenueByHour = series;
      }

      if (seesOrders) {
        const active = today.filter((order) => ACTIVE_STATES.includes(order.state));
        item.orders = today.length;
        item.ordersActive = active.length;
        item.kitchen = ACTIVE_STATES.map((state) => ({
          state,
          title: ctx.t(STATE_TITLES[state]),
          tone: STATE_TONES[state],
          count: active.filter((order) => order.state === state).length,
        }));
        item.active = [...active]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 6)
          .map((order) => ({
            id: order.id,
            title: `№ ${order.number}`,
            state: order.state,
            stateTitle: ctx.t(STATE_TITLES[order.state] ?? order.state),
            tone: STATE_TONES[order.state] ?? "info",
            method: order.method,
            summary: [order.customerName, ctx.t(`mobile.orders.method.${order.method}`)].filter(Boolean).join(" · "),
            minutes: Math.max(0, Math.floor((now - order.createdAt) / 60_000)),
            total: order.total,
            _open: { app: "orders", method: "orders.get", params: { id: order.id }, place },
          }));
      }

      if (seesStock) {
        const balances = await home.balances(place);
        item.stop = balances.filter((balance) => balance !== null && balance <= 0).length;
        item.low = balances.filter((balance) => balance !== null && balance > 0 && balance <= LOW).length;
        const lines = sold.length ? await home.lines(place, sold.map((order) => order.id)) : [];
        const byDish = new Map<string, HomeLine>();
        for (const line of lines) {
          const kept = byDish.get(line.id);
          if (kept) kept.amount += line.amount;
          else byDish.set(line.id, { ...line });
        }
        item.popular = [...byDish.values()]
          .sort((a, b) => b.amount - a.amount || a.title.localeCompare(b.title))
          .slice(0, 6)
          .map((line) => ({ id: line.id, title: line.title, ...(line.group ? { group: line.group } : {}), sold: line.amount }));
      }

      return { item };
    },
  });
}
