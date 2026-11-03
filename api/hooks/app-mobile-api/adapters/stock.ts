import type { StockItem, StockPort } from "../apps/dishes";

/**
 * «Блюда» on the functions of the web Stock Manager in core.
 *
 * Reading is the public function of core the web page calls as well — `lib/menu/stock-items`, where
 * task C4 moved it out of the panel's controller folder. Writing is `DishPlace.upsertForPlace`, as in
 * `update-stock.ts` / `update-dish-place-enable.ts`. The only Waterline queries of our own are the
 * page of the catalog (core's function has a limit but no offset or order) and the group titles.
 */

declare const Dish: any;
declare const DishPlace: any;
declare const Group: any;

const CORE = "@webresto/core";
const stockFunctions = () => require(`${CORE}/lib/menu/stock-items`);
const balanceFunctions = () => require(`${CORE}/lib/menu/dish-place-balance`);

/** Upper bound of products with a limit at one point; the list of the web shows 50. */
const LIMITED_MAX = 2000;

async function groupTitles(productIds: string[]): Promise<Map<string, string>> {
  if (!productIds.length) return new Map();
  const products = await Dish.find({ where: { id: { in: productIds } } });
  const groupIds = [...new Set(products.map((product: any) => product.parentGroup).filter(Boolean).map(String))];
  const groups = groupIds.length ? await Group.find({ where: { id: { in: groupIds } } }) : [];
  const groupName = new Map(groups.map((group: any) => [String(group.id), group.name ?? ""]));
  return new Map(products.map((product: any) => [String(product.id), groupName.get(String(product.parentGroup)) ?? ""]));
}

async function toItems(results: any[], mode: string): Promise<StockItem[]> {
  const titles = await groupTitles(results.map((product) => String(product.id)));
  return results.map((product) => ({
    id: String(product.id),
    name: product.name ?? "",
    code: product.code ?? null,
    price: typeof product.price === "number" ? product.price : null,
    enable: product.enable !== false,
    balance: product.balance,
    localBalance: product.localBalance ?? null,
    rmsBalance: product.rmsBalance ?? null,
    placeEnable: product.placeEnable !== false,
    groupTitle: titles.get(String(product.id)) ?? "",
    mode,
  }));
}

async function productExists(id: string): Promise<boolean> {
  return Boolean(await Dish.findOne({ id }));
}

export function coreStock(): StockPort {
  return {
    async listLimited(placeId) {
      const { results, mode } = await stockFunctions().getLimitedStockProducts(placeId, LIMITED_MAX);
      return toItems(results, mode);
    },

    async listCatalog(placeId, { q, offset, limit }) {
      // The where of the web search (search.ts): not deleted, name or code contains q.
      const where: any = { isDeleted: false };
      if (q) where.or = [{ name: { contains: q } }, { code: { contains: q } }];
      const [page, total] = await Promise.all([
        Dish.find({ where, sort: [{ parentGroup: "ASC" }, { name: "ASC" }, { id: "ASC" }], skip: offset, limit }),
        Dish.count(where),
      ]);
      const ids = page.map((product: any) => String(product.id));
      if (!ids.length) return { items: [], total };
      const { results, mode } = await stockFunctions().getStockProducts(placeId, { id: { in: ids } }, ids.length);
      const byId = new Map(results.map((product: any) => [String(product.id), product]));
      return { items: await toItems(ids.map((id: string) => byId.get(id)).filter(Boolean), mode), total };
    },

    async countCatalog() {
      return Dish.count({ isDeleted: false });
    },

    async get(placeId, id) {
      const { results, mode } = await stockFunctions().getStockProducts(placeId, { id }, 1);
      if (!results.length) return null;
      return (await toItems(results, mode))[0];
    },

    async setLocalBalance(placeId, id, balance) {
      if (balance < balanceFunctions().UNLIMITED_BALANCE || !(await productExists(id))) return false;
      await DishPlace.upsertForPlace(id, placeId, { localBalance: balance });
      return true;
    },

    async setPlaceEnable(placeId, id, enable) {
      if (!(await productExists(id))) return false;
      await DishPlace.upsertForPlace(id, placeId, { enable });
      return true;
    },
  };
}
