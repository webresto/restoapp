import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import { decodeCursor, encodeCursor } from "../lib/cursor";

/**
 * «Блюда» — the web Stock Manager of one point, on the phone.
 *
 * Access and points are those of the web: the contextual `stock-manager` token, its points chosen in
 * the group form. Reading and writing go through the functions of the web stock in core (via
 * `StockPort`): the manual `localBalance` and the point stop `enable` of `DishPlace`, never
 * `rmsBalance`, never the catalog-wide `Dish.enable`. The effective balance is core's.
 */

export interface StockItem {
  id: string;
  name: string;
  code: string | null;
  price: number | null;
  /** Catalog-wide switch, read-only here. */
  enable: boolean;
  /** Effective stock at the point: -1 unlimited, 0 stop. */
  balance: number;
  localBalance: number | null;
  rmsBalance: number | null;
  /** Point stop: false — not sold at this point. */
  placeEnable: boolean;
  groupTitle: string;
  mode: string;
}

export interface StockPort {
  /** Every product with a limit or a stop at the point (effective balance ≠ -1). */
  listLimited(placeId: string): Promise<StockItem[]>;
  /** The catalog, one page, groups together. */
  listCatalog(placeId: string, options: { q?: string; offset: number; limit: number }): Promise<{ items: StockItem[]; total: number }>;
  countCatalog(): Promise<number>;
  get(placeId: string, id: string): Promise<StockItem | null>;
  /** false — no such product. */
  setLocalBalance(placeId: string, id: string, balance: number): Promise<boolean>;
  setPlaceEnable(placeId: string, id: string, enable: boolean): Promise<boolean>;
}

export const PAGE_SIZE = 50;
const STOCK_TOKEN = "stock-manager";
const access = { token: STOCK_TOKEN };

/** Material Symbols "restaurant", 24×24. */
const ICON = "M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z";

const BALANCE_SPECIALS = [
  { value: -1, title: "mobile.dishes.unlimited" },
  { value: 0, title: "mobile.dishes.outOfStock", tone: "danger" },
];

function matches(item: StockItem, q: string): boolean {
  const needle = q.toLowerCase();
  return item.name.toLowerCase().includes(needle) || (item.code ?? "").toLowerCase().includes(needle);
}

function byGroupThenName(a: StockItem, b: StockItem): number {
  return a.groupTitle.localeCompare(b.groupTitle) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
}

function placeOf(ctx: MethodContext): string {
  // Unreachable without a point: the call layer refuses a scope:"place" call that has none.
  return String(ctx.place?.id ?? ctx.fail("invalid", "No point"));
}

export function registerDishes(registry: MobileApiRegistry, stock: StockPort): void {
  registry.registerApp({
    id: "dishes",
    version: "1.0.0",
    title: "mobile.app.dishes.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "dishes.list",
    scope: "place",
    places: { token: STOCK_TOKEN, kind: "cooking" },
    models: {
      dish: {
        fields: [
          { name: "name", title: "mobile.dishes.field.name", format: "text", readonly: true },
          { name: "balance", title: "mobile.dishes.field.balance", format: "number", readonly: true, specials: BALANCE_SPECIALS, section: "mobile.dishes.section.point" },
          { name: "localBalance", title: "mobile.dishes.field.localBalance", format: "number", readonly: true, specials: BALANCE_SPECIALS, section: "mobile.dishes.section.point" },
          { name: "rmsBalance", title: "mobile.dishes.field.rmsBalance", format: "number", readonly: true, specials: BALANCE_SPECIALS, section: "mobile.dishes.section.point" },
          { name: "placeEnable", title: "mobile.dishes.field.placeEnable", format: "boolean", readonly: true, section: "mobile.dishes.section.point" },
          {
            name: "mode", title: "mobile.dishes.field.mode", format: "enum", readonly: true, section: "mobile.dishes.section.point",
            "x-titles": { "local-only": "mobile.dishes.mode.local-only", "rms-only": "mobile.dishes.mode.rms-only", minimum: "mobile.dishes.mode.minimum" },
          },
          { name: "groupTitle", title: "mobile.dishes.field.group", format: "text", readonly: true, section: "mobile.dishes.section.catalog" },
          { name: "code", title: "mobile.dishes.field.code", format: "text", readonly: true, section: "mobile.dishes.section.catalog" },
          { name: "price", title: "mobile.dishes.field.price", format: "money", readonly: true, section: "mobile.dishes.section.catalog" },
          { name: "enable", title: "mobile.dishes.field.enable", format: "boolean", readonly: true, section: "mobile.dishes.section.catalog" },
        ],
      },
    },
  });

  registry.registerMethod({
    name: "dishes.list",
    app: "dishes",
    kind: "query",
    title: "mobile.dishes.list.title",
    access,
    model: "dish",
    input: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          enum: ["limited", "stop", "all"],
          default: "limited",
          "x-titles": { limited: "mobile.dishes.filter.limited", stop: "mobile.dishes.filter.stop", all: "mobile.dishes.filter.all" },
        },
        q: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "name", subtitle: "groupTitle", value: "balance" },
      groupBy: "groupTitle",
      search: "q",
      chips: "filter",
      open: "dishes.get",
      empty: "mobile.dishes.empty",
    },
    handler: async (params: { filter: "limited" | "stop" | "all"; q?: string; cursor?: string }, ctx) => {
      const placeId = placeOf(ctx);
      const offset = decodeCursor(params.cursor, ctx);
      const q = params.q?.trim() || undefined;

      const limited = await stock.listLimited(placeId);
      const stopped = limited.filter((item) => item.balance === 0);
      const counts = { limited: limited.length, stop: stopped.length, all: await stock.countCatalog() };

      if (params.filter === "all") {
        const page = await stock.listCatalog(placeId, { q, offset, limit: PAGE_SIZE });
        const next = offset + page.items.length;
        return { items: page.items, nextCursor: next < page.total ? encodeCursor(next) : null, counts, total: page.total };
      }

      const chosen = (params.filter === "stop" ? stopped : limited).filter((item) => !q || matches(item, q)).sort(byGroupThenName);
      const items = chosen.slice(offset, offset + PAGE_SIZE);
      const next = offset + items.length;
      return { items, nextCursor: next < chosen.length ? encodeCursor(next) : null, counts, total: chosen.length };
    },
  });

  registry.registerMethod({
    name: "dishes.get",
    app: "dishes",
    kind: "query",
    title: "mobile.dishes.get.title",
    access,
    model: "dish",
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    ui: { view: "detail", item: { title: "name", subtitle: "groupTitle", value: "balance" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await stock.get(placeOf(ctx), id);
      if (!item) ctx.fail("not_found", "No such product");
      return { item };
    },
  });

  registry.registerMethod({
    name: "dishes.setBalance",
    app: "dishes",
    kind: "mutation",
    title: "mobile.dishes.setBalance.title",
    access,
    input: {
      type: "object",
      required: ["id", "balance"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        balance: { type: "integer", minimum: -1, maximum: 100000 },
      },
    },
    ui: {
      view: "action",
      on: "dish",
      placement: ["row", "detail"],
      control: { type: "stepper", param: "balance", bind: "localBalance", specials: BALANCE_SPECIALS },
    },
    handler: async ({ id, balance }: { id: string; balance: number }, ctx) => {
      const placeId = placeOf(ctx);
      if (!(await stock.setLocalBalance(placeId, id, balance))) ctx.fail("not_found", "No such product");
      return { item: await stock.get(placeId, id) };
    },
    audit: ({ id, balance }) => ({ record: id, params: { balance } }),
  });

  registry.registerMethod({
    name: "dishes.setEnabled",
    app: "dishes",
    kind: "mutation",
    title: "mobile.dishes.setEnabled.title",
    access,
    input: {
      type: "object",
      required: ["id", "enable"],
      properties: { id: { type: "string", minLength: 1, maxLength: 100 }, enable: { type: "boolean" } },
    },
    ui: { view: "action", on: "dish", placement: ["row", "detail"], control: { type: "toggle", param: "enable", bind: "placeEnable" } },
    handler: async ({ id, enable }: { id: string; enable: boolean }, ctx) => {
      const placeId = placeOf(ctx);
      if (!(await stock.setPlaceEnable(placeId, id, enable))) ctx.fail("not_found", "No such product");
      return { item: await stock.get(placeId, id) };
    },
    audit: ({ id, enable }) => ({ record: id, params: { enable } }),
  });
}
