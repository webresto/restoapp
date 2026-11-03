import type {
  PosActor,
  PosCatalog,
  PosChosenOption,
  PosGroup,
  PosLine,
  PosMessage,
  PosOptionGroup,
  PosOptionsView,
  PosOrder,
  PosPaymentOption,
  PosPort,
  PosProduct,
  PosServiceOption,
  PosStep,
  PosTimeOptions,
} from "../apps/pos";

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
declare const OrderDish: any;
declare const Dish: any;
declare const Group: any;
declare const Place: any;
declare const City: any;
declare const User: any;
declare const UserLocation: any;
declare const PaymentMethod: any;
declare const Settings: any;
declare const Adapter: any;
declare const MobileOrderDraft: any;

/** States a draft can still be in; anything else is an order and leaves the drafts. */
const DRAFT_STATES = ["NEW", "CART", "CHECKOUT"];
/** How many drafts one person sees at a point. */
const DRAFTS_LIMIT = 50;

const { v4: uuid } = require("uuid");

const CORE = "@webresto/core";
const authService = () => require(`${CORE}/lib/AuthService`).default ?? require(`${CORE}/lib/AuthService`);
const splitPhone = (raw: string) => require(`${CORE}/lib/phone`).splitPhone(raw);
/** What a refusal of `Order.check` means — core's table, shared with the storefront (C8). */
const orderCheckFailure = (error: unknown, order?: unknown) => require(`${CORE}/lib/order/order-errors`).orderCheckFailure(error, order);
const effectiveBalance = (id: string, context: any) =>
  require(`${CORE}/lib/menu/product-availability`).getEffectiveBalanceAcross(id, context);
const orderHelper = () => require(`${CORE}/lib/order/OrderHelper`).OrderHelper;
/** core's own reading of the modifier rules of a dish: the defaults it would fill in. */
const modifiersOf = (groups: unknown[]) => new (require(`${CORE}/lib/ProductModifier`).ProductModifier)(groups ?? []);

/** The channel an order taken here comes from: the `staff` type core registers for this app. */
const CHANNEL = "mobile-pos";

const INFO = "info";
const DANGER = "danger";
const SUCCESS = "success";

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
    // `Order.populate` puts the modifier's own product on each entry, so the line can be read out
    // by name — «Пицца 35 см · Сыр чеддер ×2» — and not by id.
    options: ((orderDish.modifiers ?? []) as any[]).map((chosen) => ({
      id: String(chosen.id),
      name: chosen.dish?.name ?? String(chosen.id),
      amount: Number(chosen.amount) || 1,
    })),
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
    // What the operator may do now — the server's answer, not a rule the screen keeps: an empty
    // basket or a customer without a phone cannot be checked, and only a checked order is placed.
    canCheck: Number(full.dishesCount) > 0 && Boolean(customer?.phone?.number),
    canPlace: full.state === "CHECKOUT",
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

    // ---- the catalog ----

    async catalog(place, id, { group, q, offset, limit }) {
      const order = await Order.findOne({ id });
      // The menu of *this* order: core reads it at the kitchens the order has, and hides what they
      // cannot cook — the same answer the storefront gets for the same basket.
      const context = await (await Adapter.get("menu")).resolveContext({ order });
      const lines = await OrderDish.find({ order: id });
      const inOrder = new Map<string, number>();
      for (const line of lines) {
        const dishId = String(typeof line.dish === "object" ? line.dish?.id : line.dish);
        inOrder.set(dishId, (inOrder.get(dishId) ?? 0) + (Number(line.amount) || 0));
      }

      const products = q
        ? await Dish.getDishes({ or: [{ name: { contains: q } }, { code: { contains: q } }], modifier: false }, context)
        : group
          ? await Dish.getDishes({ parentGroup: group, modifier: false }, context)
          : [];
      const items = await Promise.all(products.map((product: any) => toProduct(product, context, inOrder)));

      const groups = q ? [] : await groupsOf(group);
      return {
        path: await pathTo(group),
        groups,
        items: items.slice(offset, offset + limit),
        nextCursor: offset + limit < items.length ? String(offset + limit) : null,
        total: items.length,
      } as PosCatalog;
    },

    // ---- the lines ----

    addProduct(place, id, dishId, amount, modifiers) {
      return change(place, id, async () => {
        // The chooser was used — even when it was closed with nothing ticked: a group that
        // requires a choice is refused here rather than filled in behind the operator's back.
        const chose = modifiers !== undefined;
        const chosen = modifiers ?? [];
        let groups: any[] = [];
        if (chose) {
          const read = await productOf(id, dishId);
          if (!read) return { key: "mobile.pos.error.noProduct", tone: DANGER };
          groups = read.product.modifiers ?? [];
          const refusal = refuseChosen(groups, chosen);
          if (refusal) return refusal;
        }
        // `user`, exactly as the storefront adds a product: `countCart` sums only the lines a
        // person put in the basket (`addedBy === "user"`), so anything else would be free. The
        // consequence is core's own rule: with REQUIRE_AUTH_FOR_CART on, the operator has to pick
        // the customer before the first product, and core says so in the message.
        await Order.addDish({ id }, dishId, amount, orderModifiers(groups, chosen), "", "user");
        if (chose) await keepChosen(id, dishId, null, groups, chosen);
        return null;
      });
    },

    setLineAmount(place, id, lineId, amount) {
      return change(place, id, async () => {
        const line = await lineRow(id, lineId);
        if (!line) return { key: "mobile.pos.error.noLine", tone: DANGER };
        if (amount <= 0) await Order.removeDish({ id }, line, Number(line.amount) || 1, false);
        else await Order.setCount({ id }, line, amount);
        return null;
      });
    },

    setLineComment(place, id, lineId, comment) {
      return change(place, id, async () => {
        const line = await lineRow(id, lineId);
        if (!line) return { key: "mobile.pos.error.noLine", tone: DANGER };
        await Order.setComment({ id }, line, comment);
        await Order.countCart({ id });
        return null;
      });
    },

    // ---- what goes with a dish ----

    /**
     * The modifier groups of a dish, as this order may buy them: core reads the menu at the
     * order's kitchens, so an option the kitchen has stopped is not in the list at all
     * (`Dish.getDishModifiers` drops it). Asked for a line, the amounts are that line's; asked for
     * a product, they are the defaults core would fill in.
     */
    async options(place, id, { dishId, lineId }) {
      const line = lineId !== undefined ? await lineRow(id, lineId) : null;
      if (lineId !== undefined && !line) return null;
      const productId = line ? String(line.dish?.id ?? line.dish) : dishId;
      if (!productId) return null;
      const read = await productOf(id, productId);
      if (!read) return null;
      const { product, context } = read;

      const groups: any[] = product.modifiers ?? [];
      const chosen = line
        ? ((line.modifiers ?? []) as any[]).map((entry) => ({
            id: String(entry.id),
            groupId: String(entry.groupId ?? groupOf(groups, String(entry.id)) ?? ""),
            amount: Number(entry.amount) || 1,
          }))
        // What core itself would put on the line: its defaults, and enough of them for the groups
        // that require a choice. The chooser opens at core's own answer, not at an empty form.
        : (modifiersOf(groups).ensureMinDefaults(modifiersOf(groups).fillDefault([])) as PosChosenOption[]);

      return {
        dishId: String(product.id),
        name: product.name ?? "",
        price: Number(product.price) || 0,
        lineId: line ? Number(line.id) : null,
        amount: line ? Number(line.amount) || 1 : 1,
        groups: await Promise.all(groups.map((group) => optionGroup(group, chosen, context))),
      } as PosOptionsView;
    },

    setLineOptions(place, id, lineId, modifiers) {
      return change(place, id, async () => {
        const line = await lineRow(id, lineId);
        if (!line) return { key: "mobile.pos.error.noLine", tone: DANGER };
        const dishId = String(line.dish?.id ?? line.dish);
        const read = await productOf(id, dishId);
        if (!read) return { key: "mobile.pos.error.noProduct", tone: DANGER };
        const groups: any[] = read.product.modifiers ?? [];
        const refusal = refuseChosen(groups, modifiers);
        if (refusal) return refusal;
        // The same line, rewritten: `replace` with its own id keeps the amount and the comment on
        // the receipt where they were, and core recounts the money.
        await Order.addDish(
          { id },
          dishId,
          Number(line.amount) || 1,
          orderModifiers(groups, modifiers),
          line.comment ?? "",
          "user",
          true,
          Number(line.id),
        );
        await keepChosen(id, dishId, Number(line.id), groups, modifiers);
        return null;
      });
    },

    // ---- how the food is handed over ----

    async serviceOptions(place) {
      const point = await Place.findOne({ id: place });
      return [
        { id: "delivery", available: true, reason: null },
        { id: "pickup", available: Boolean(point?.isPickupPoint), reason: point?.isPickupPoint ? null : "mobile.pos.service.noCounter" },
        { id: "dine-in", available: Boolean(point?.hasDiningArea), reason: point?.hasDiningArea ? null : "mobile.pos.service.noRoom" },
      ] as PosServiceOption[];
    },

    setService(place, id, serviceType, table) {
      return change(place, id, async () => {
        const options = await this.serviceOptions(place);
        if (!options.find((option) => option.id === serviceType)?.available) {
          return { key: "mobile.pos.error.serviceUnavailable", tone: DANGER };
        }
        await Order.setServiceType({ id }, serviceType);
        await Order.update(
          { id },
          {
            // Pickup and dine-in are cooked and collected at the point of the terminal; a delivery
            // has none, and its kitchen is the address's (core's `resolveCookingPlace`).
            pickupPoint: serviceType === "delivery" ? null : String(place),
            table: serviceType === "dine-in" ? table ?? null : null,
          },
        ).fetch();
        await Order.countCart({ id });
        return null;
      });
    },

    setTable(place, id, table) {
      return change(place, id, async () => {
        const order = await Order.findOne({ id });
        if (order?.serviceType !== "dine-in") return { key: "mobile.pos.error.tableNotDineIn", tone: DANGER };
        await Order.update({ id }, { table }).fetch();
        return null;
      });
    },

    setAddress(place, id, address) {
      return change(place, id, async () => {
        const line = [address.street, address.home].filter(Boolean).join(", ");
        await Order.update(
          { id },
          {
            address: {
              city: address.city ?? null,
              node: address.node ?? null,
              formatted: address.formatted ?? line,
              ...(address.home ? { home: address.home } : {}),
              ...(address.housing ? { housing: address.housing } : {}),
              ...(address.apartment ? { apartment: address.apartment } : {}),
              ...(address.entrance ? { entrance: address.entrance } : {}),
              ...(address.floor ? { floor: address.floor } : {}),
              ...(address.doorphone ? { doorphone: address.doorphone } : {}),
              ...(address.comment ? { comment: address.comment } : {}),
            },
          },
        ).fetch();
        // The address decides the kitchen and the price of the delivery: both are counted here.
        await Order.countCart({ id });
        return null;
      });
    },

    async addressSearch(city, parent, q) {
      const nodes = await (await Adapter.get("geo")).search({ city, parent, query: q });
      return (nodes ?? []).map((node: any) => ({ id: String(node.id), name: node.name ?? "", type: node.type ?? null }));
    },

    async cities() {
      const rows = await City.find({ where: { isDeleted: false }, sort: "name ASC" }).catch(() => []);
      return rows.map((city: any) => ({ id: String(city.id), name: city.name ?? String(city.id) }));
    },

    async clientAddresses(clientId) {
      const rows = await UserLocation.find({ where: { user: String(clientId) }, sort: "createdAt DESC" }).catch(() => []);
      return rows.map((row: any) => ({ id: String(row.id), formatted: row.formatted ?? "" }));
    },

    // ---- who it is for ----

    setCustomer(place, id, { name, phone, createClient }) {
      return change(place, id, async () => {
        const parts = splitPhone(phone);
        const patch: Record<string, unknown> = { customer: { name, phone: parts } };
        if (createClient) {
          // The one factory core uses for a guest at DONE: the same number never makes a second
          // profile, and the order is that person's from now on.
          const { user } = await authService().materializeUser({ firstName: name, phone: parts });
          patch.user = String(user.id);
        }
        await Order.update({ id }, patch).fetch();
        return null;
      });
    },

    setClient(place, id, clientId) {
      return change(place, id, async () => {
        const client = await User.findOne({ id: clientId });
        if (!client || client.isDeleted) return { key: "mobile.pos.error.noClient", tone: DANGER };
        const name = [client.firstName, client.lastName].filter(Boolean).join(" ").trim();
        await Order.update({ id }, { user: String(client.id), customer: { name, phone: client.phone ?? null } }).fetch();
        return null;
      });
    },

    // ---- when ----

    async timeOptions(place, id) {
      const populated = await Order.populate({ id });
      const init = await orderHelper().initCheckout(populated);
      return {
        asap: Boolean(init?.allowSoonAsPossible),
        // core answers in unix seconds; the client works in milliseconds, as everywhere else here.
        slots: (init?.worktimeIntervals ?? []).map((pair: number[]) => [pair[0] * 1000, pair[1] * 1000]),
        minCookingMinutes: Number(init?.minCookingTimeInMinutes) || 0,
      } as PosTimeOptions;
    },

    setTime(place, id, input) {
      return change(place, id, async () => {
        if (input.mode === "time" && !input.date) return { key: "mobile.pos.error.noTime", tone: DANGER };
        if (input.mode === "maxWait" && !input.maxWaitMinutes) return { key: "mobile.pos.error.noWait", tone: DANGER };
        await Order.update(
          { id },
          {
            // The two are mutually exclusive: core refuses an order carrying both (code 20).
            date: input.mode === "time" ? await wallClock(input.date as number) : null,
            maxWaitMinutes: input.mode === "maxWait" ? input.maxWaitMinutes : null,
          },
        ).fetch();
        await Order.countCart({ id });
        return null;
      });
    },

    // ---- what it is paid with ----

    async payments(place, id) {
      const methods = await PaymentMethod.getAvailable();
      const options: PosPaymentOption[] = [];
      for (const method of methods) {
        const isPromise = await PaymentMethod.isPaymentPromise(String(method.id));
        options.push({
          id: String(method.id),
          title: method.title ?? String(method.id),
          isPromise,
          // Online payment ends in a redirect, and a terminal has nowhere to send it (slice D).
          available: isPromise,
        });
      }
      return options;
    },

    setPayment(place, id, paymentMethodId, trifleFrom) {
      return change(place, id, async () => {
        const method = await PaymentMethod.findOne({ id: paymentMethodId });
        if (!method) return { key: "mobile.pos.error.noPayment", tone: DANGER };
        if (!(await PaymentMethod.isPaymentPromise(paymentMethodId))) {
          return { key: "mobile.pos.error.onlinePayment", tone: DANGER };
        }
        await Order.update(
          { id },
          {
            paymentMethod: paymentMethodId,
            paymentMethodTitle: method.title ?? null,
            isPaymentPromise: true,
            ...(trifleFrom === undefined ? {} : { trifleFrom }),
          },
        ).fetch();
        await Order.countCart({ id });
        return null;
      });
    },

    setDetails(place, id, input) {
      return change(place, id, async () => {
        const order = await Order.findOne({ id });
        const customData = { ...(order?.customData ?? {}) };
        if (input.callback !== undefined) customData.callback = input.callback;
        await Order.update(
          { id },
          {
            ...(input.comment === undefined ? {} : { comment: input.comment }),
            ...(input.personsCount === undefined ? {} : { personsCount: String(input.personsCount) }),
            customData,
          },
        ).fetch();
        await Order.countCart({ id });
        return null;
      });
    },

    promocode(place, id, code) {
      return change(place, id, async () => {
        await Order.applyPromotionCode({ id }, code);
        const order = await Order.findOne({ id });
        if (!code) return { key: "mobile.pos.promocode.off", tone: INFO };
        // core does not throw for a code that is not one: the order says whether it took it.
        const taken = order?.promotionCode !== null && order?.promotionCode !== undefined && order?.promotionCode !== "";
        if (taken) return { text: order.promotionCodeDescription || "", key: order.promotionCodeDescription ? undefined : "mobile.pos.promocode.on", tone: SUCCESS };
        return { key: "mobile.pos.promocode.invalid", tone: DANGER };
      });
    },

    // ---- the end ----

    async check(place, id, actor) {
      const before = await Order.findOne({ id });
      if (!before) return { order: null, message: null, ok: false };
      try {
        const order = await Order.populate({ id });
        await Order.check(
          { id },
          order.customer,
          order.serviceType,
          order.serviceType === "delivery" ? order.address : null,
          order.paymentMethod ? String(order.paymentMethod.id ?? order.paymentMethod) : undefined,
          order.user ? String(order.user.id ?? order.user) : null,
          null,
          CHANNEL,
        );
        await Order.log({ id }, "info", "mobile-api", "order entry: checked", { place, panelUser: actor.userId, device: actor.device });
        const checked = await serialize(place, id);
        return {
          order: checked,
          message: checked?.message ? { text: checked.message, tone: INFO } : { key: "mobile.pos.ready", tone: SUCCESS },
          ok: checked?.state === "CHECKOUT",
        };
      } catch (error: any) {
        const failure = orderCheckFailure(error, await Order.findOne({ id }));
        await Order.log({ id }, "warn", "mobile-api", "order entry: check refused", { code: failure.code, panelUser: actor.userId });
        return {
          order: await serialize(place, id),
          message: { key: failure.key, arg: failure.arg, tone: DANGER },
          ok: false,
        };
      }
    },

    async place(place, id, actor) {
      const row = await draftRow(place, actor.userId, id);
      if (!row) return { order: null, message: null, ok: false };
      const order = await Order.findOne({ id });
      if (order?.state !== "CHECKOUT") {
        return { order: await serialize(place, id), message: { key: "mobile.pos.error.checkFirst", tone: DANGER }, ok: false };
      }
      try {
        await Order.order({ id });
      } catch (error: any) {
        await Order.log({ id }, "error", "mobile-api", "order entry: placing failed", { error: String(error?.message ?? error) });
        return { order: await serialize(place, id), message: { key: "mobile.pos.error.notPlaced", tone: DANGER }, ok: false };
      }
      // Placed: it is an order now, and an order is the board's business, not the drafts'.
      await MobileOrderDraft.destroy({ id: row.id });
      await Order.log({ id }, "info", "mobile-api", "order entry: placed", { place, panelUser: actor.userId, device: actor.device });
      const placed = await serialize(place, id);
      return { order: placed, message: { key: "mobile.pos.placed", arg: placed?.number, tone: SUCCESS }, ok: true };
    },
  };

  /**
   * One step of the order: do it, let core recount, and answer with the whole order.
   *
   * A throw of core is a word for the operator, not a 500: «this product is out of stock» is the
   * next thing they will say out loud, so it comes back as a message and the receipt stays.
   */
  async function change(place: string, id: string, run: () => Promise<PosMessage | null | void>): Promise<PosStep> {
    const order = await Order.findOne({ id });
    if (!order) return { order: null, message: null, ok: false };
    let message: PosMessage | null = null;
    try {
      message = (await run()) ?? null;
    } catch (error: any) {
      // A refusal core numbered is said in the words of the table it shares with the storefront;
      // anything else — a plain throw of a model — is passed through as it came.
      if (typeof error?.code === "number") {
        const failure = orderCheckFailure(error, await Order.findOne({ id }));
        return { order: await serialize(place, id), message: { key: failure.key, arg: failure.arg, tone: DANGER }, ok: false };
      }
      const text = String(error?.error ?? error?.body ?? error?.message ?? error);
      return { order: await serialize(place, id), message: { text, tone: DANGER }, ok: false };
    }
    const updated = await serialize(place, id);
    // core writes what its recount did — a product it dropped, a delivery it could not price.
    const note = updated?.message ? { text: updated.message, tone: INFO } : null;
    return { order: updated, message: message ?? note, ok: message === null || message.tone !== DANGER };
  }
}

/** The line of this order, or null — a line of another order is not this caller's business. */
async function lineRow(orderId: string, lineId: number): Promise<any | null> {
  const line = await OrderDish.findOne({ id: lineId }).populate("dish");
  if (!line) return null;
  const owner = String(typeof line.order === "object" ? line.order?.id : line.order);
  return owner === String(orderId) ? line : null;
}

/** A number of core's rules as a number, with nothing set meaning none. */
function count(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

/** A ceiling of core's rules: null when the rule does not set one. */
function ceiling(value: unknown): number | null {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

/**
 * The product as *this order* may buy it, with its modifier groups popularized — the group's name,
 * each option's own product — and read at the order's kitchens, which is what decides what is in
 * the menu at all.
 */
async function productOf(orderId: string, dishId: string): Promise<{ product: any; context: any } | null> {
  const order = await Order.findOne({ id: orderId });
  const context = await (await Adapter.get("menu")).resolveContext({ order });
  const found = await Dish.getDishes({ id: dishId }, context);
  return found[0] ? { product: found[0], context } : null;
}

/** Which group an option belongs to — for a line written before `groupId` was carried. */
function groupOf(groups: any[], optionId: string): string | null {
  for (const group of groups) {
    if ((group.childModifiers ?? []).some((child: any) => String(child.id) === optionId)) return String(group.id);
  }
  return null;
}

/** One group of a dish, with what is chosen of it now and what the kitchen has left of each option. */
async function optionGroup(group: any, chosen: PosChosenOption[], context: any): Promise<PosOptionGroup> {
  const minAmount = count(group.minAmount);
  const maxAmount = ceiling(group.maxAmount);
  const options = await Promise.all(
    (group.childModifiers ?? []).map(async (child: any) => {
      // The id a group keeps may be the product's `rmsId` — core accepts both on a line and
      // resolves them the same way (`Dish.getDishModifiers`), so it is passed back as it came;
      // the stock, though, is the product's own.
      const id = String(child.id);
      const dish = child.dish ?? {};
      const defaultAmount = count(child.defaultAmount);
      return {
        id,
        name: dish.name ?? id,
        price: Number(dish.price) || 0,
        balance: await effectiveBalance(String(dish.id ?? id), context),
        amount: chosen.filter((entry) => String(entry.id) === id).reduce((sum, entry) => sum + count(entry.amount), 0),
        minAmount: count(child.minAmount),
        maxAmount: ceiling(child.maxAmount),
        freeAmount: count(child.freeOfChargeAmount),
        defaultAmount,
      };
    }),
  );
  return {
    id: String(group.id),
    name: group.group?.name ?? group.name ?? "",
    required: Boolean(group.required) || minAmount > 0,
    minAmount,
    maxAmount,
    // One of the group at most: a choice, not a counter.
    single: maxAmount === 1,
    options,
  };
}

/**
 * What the operator chose, checked against the rules of the dish — in words, not in codes.
 *
 * core does not check: `ProductModifier.validate` exists and `addDish` has the call to it
 * commented out, so a group that needs a sauce would otherwise go to the kitchen without one.
 */
function refuseChosen(groups: any[], chosen: PosChosenOption[]): PosMessage | null {
  const taken = chosen.filter((entry) => count(entry.amount) > 0);
  const known = new Set<string>();
  for (const group of groups) for (const child of group.childModifiers ?? []) known.add(String(child.id));
  const unknown = taken.find((entry) => !known.has(String(entry.id)));
  if (unknown) return { key: "mobile.pos.error.optionUnknown", tone: DANGER };

  for (const group of groups) {
    const children: any[] = group.childModifiers ?? [];
    const ids = new Set(children.map((child) => String(child.id)));
    const inGroup = taken.filter((entry) => ids.has(String(entry.id)));
    const sum = inGroup.reduce((total, entry) => total + count(entry.amount), 0);
    const name = group.group?.name ?? group.name ?? "";
    if (sum < count(group.minAmount)) return { key: "mobile.pos.error.optionMin", arg: name, tone: DANGER };
    const max = ceiling(group.maxAmount);
    if (max !== null && sum > max) return { key: "mobile.pos.error.optionMax", arg: name, tone: DANGER };
    for (const child of children) {
      const own = ceiling(child.maxAmount);
      const amount = inGroup.filter((entry) => String(entry.id) === String(child.id)).reduce((total, entry) => total + count(entry.amount), 0);
      if (own !== null && amount > own) return { key: "mobile.pos.error.optionMax", arg: child.dish?.name ?? name, tone: DANGER };
    }
  }
  return null;
}

/**
 * The chosen options as core keeps them on a line: `OrderModifier`, nothing of ours.
 *
 * The option's own product goes along with it, as the storefront's menu objects carry it: core
 * reads the «so many free of charge» rule off `modifier.dish.rmsId` and charges for all of them
 * when it is not there (`countCart`, «Find original obj modifiers»). The price itself is always
 * looked up afresh, so the copy on the line cannot go stale into the money.
 */
function orderModifiers(groups: any[], chosen: PosChosenOption[]): Array<Record<string, unknown>> {
  const children = new Map<string, any>();
  for (const group of groups) for (const child of group.childModifiers ?? []) children.set(String(child.id), child);
  return chosen
    .filter((entry) => count(entry.amount) > 0)
    .map((entry) => {
      const option = children.get(String(entry.id));
      return {
        id: String(entry.id),
        groupId: String(entry.groupId),
        amount: count(entry.amount),
        ...(option?.dish ? { dish: option.dish } : {}),
      };
    });
}

/**
 * The line keeps exactly what was chosen.
 *
 * `addDish` fills in every option that has a `defaultAmount` whether or not the group already had a
 * choice — that is core's tested behaviour and the storefront's, so it is not touched here; it does
 * mean that «Средний» comes back onto a line the operator switched to «Большой». The POS has a
 * person in front of the guest, and what they chose is what goes to the kitchen: the chosen set is
 * written back and core recounts the money from it.
 */
async function keepChosen(orderId: string, dishId: string, lineId: number | null, groups: any[], chosen: PosChosenOption[]): Promise<void> {
  const wanted = orderModifiers(groups, chosen);
  const line = lineId !== null
    ? await OrderDish.findOne({ id: lineId })
    // A line with modifiers is never merged into another (`addDish` only merges plain lines), so
    // the newest line of this product is the one just written.
    : (await OrderDish.find({ where: { order: orderId, dish: dishId }, sort: "id DESC", limit: 1 }))[0];
  if (!line) return;
  const written = ((line.modifiers ?? []) as any[]).map((entry) => `${entry.id}:${count(entry.amount)}`).sort().join(",");
  const asked = wanted.map((entry) => `${entry.id}:${entry.amount}`).sort().join(",");
  if (written === asked) return;
  await OrderDish.update({ id: line.id }, { modifiers: wanted }).fetch();
  await Order.countCart({ id: orderId });
}

/** The groups one level down: the top of the menu, or the children of the open group. */
async function groupsOf(group?: string): Promise<PosGroup[]> {
  const rows = group
    ? await Group.find({ where: { parentGroup: group, isDeleted: false, enable: true }, sort: "sortOrder ASC" })
    : await Group.getMenuGroups();
  return rows.map((row: any) => ({ id: String(row.id), name: row.name ?? "", imageUrl: imageOf(row) }));
}

/** The groups from the top down to this one: the breadcrumbs of the catalog. */
async function pathTo(group?: string): Promise<PosGroup[]> {
  const path: PosGroup[] = [];
  let current = group;
  while (current) {
    const row = await Group.findOne({ id: current });
    if (!row) break;
    path.unshift({ id: String(row.id), name: row.name ?? "", imageUrl: imageOf(row) });
    current = row.parentGroup ? String(row.parentGroup.id ?? row.parentGroup) : undefined;
  }
  return path;
}

/** The first image of a product or a group as a URL the client can ask for. */
function imageOf(record: any): string | null {
  const image = (record?.images ?? [])[0];
  const variants = image?.variant ?? {};
  const path = variants.small ?? variants.medium ?? variants.origin ?? Object.values(variants)[0];
  if (typeof path !== "string" || !path) return null;
  // The uploads are served statically by the same server the API is on.
  const index = path.indexOf("/uploads/");
  return index === -1 ? null : path.slice(index);
}

/** A product of the catalog: the promotion's price and the stock core counted for this context. */
async function toProduct(product: any, context: any, inOrder: Map<string, number>): Promise<PosProduct> {
  const shown = await promotionView(product);
  return {
    id: String(product.id),
    name: product.name ?? "",
    code: product.code ?? null,
    groupId: product.parentGroup ? String(product.parentGroup.id ?? product.parentGroup) : null,
    price: Number(product.price) || 0,
    salePrice: typeof shown?.salePrice === "number" && shown.salePrice !== product.price ? shown.salePrice : null,
    balance: await effectiveBalance(String(product.id), context),
    weight: typeof product.weight === "number" ? product.weight : null,
    imageUrl: imageOf(product),
    hasOptions: Array.isArray(product.modifiers) && product.modifiers.length > 0,
    inOrder: inOrder.get(String(product.id)) ?? 0,
  };
}

/** What the promotions make of a product, as the storefront shows it. */
async function promotionView(product: any): Promise<any> {
  try {
    return (await Adapter.getPromotionAdapter()).displayDish({ ...product });
  } catch {
    // An installation without a promotion adapter sells at the price on the product.
    return null;
  }
}

/** Epoch milliseconds as core keeps a date: "YYYY-MM-DD HH:mm:ss" in the server's own zone. */
async function wallClock(millis: number): Promise<string> {
  const setting = await Settings.get("TZ");
  const timeZone = typeof setting === "string" && setting.trim() ? setting.trim() : process.env.TZ;
  const date = new Date(millis);
  if (!timeZone) return date.toISOString().replace("T", " ").slice(0, 19);
  // sv-SE gives "YYYY-MM-DD HH:mm:ss" — the shape core parses.
  return date.toLocaleString("sv-SE", { timeZone, hourCycle: "h23" });
}
