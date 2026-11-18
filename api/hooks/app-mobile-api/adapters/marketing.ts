import type {
  ApplicationItem,
  CodeItem,
  MarketingPort,
  MarketingSummary,
  PromotionItem,
  SavedCode,
  SavedPromotion,
} from "../apps/marketing";

/**
 * «Маркетинг» on core's own marketing layer (`lib/marketing/*`, plan C18-C20).
 *
 * Nothing is read or judged here: which codes there are, where a promotion stands, what it gives and why a code
 * gave nothing are core's answers, and the words of them are core's too — in the language of the request, from its
 * catalogs. This adapter turns those answers into the records of the declaration, which is all the phone needs.
 *
 * Money in a word ("Подарок: 2 шт. от 1 449 ₽") is formatted with the sign of the server's own currency
 * (`CURRENCY_SIGN`); money in a *field* is a number, and the client formats it in the currency the declaration
 * carries.
 */

declare const Dish: any;
declare const Group: any;
declare const Promotion: any;
declare const PromotionCode: any;
declare const Settings: any;

const CORE = "@webresto/core";

const codesLib = () => require(`${CORE}/lib/marketing/promotion-codes`);
const promotionsLib = () => require(`${CORE}/lib/marketing/promotions`);
const applicationsLib = () => require(`${CORE}/lib/marketing/applications`);
const translator = (lang: string) => require(`${CORE}/lib/i18n/translator`).getTranslatorFor(lang);

/** The words of the answer: core's translator for this language, and money with the sign of the restaurant. */
async function words(lang: string): Promise<{ t: (phrase: string) => string; money: (amount: number) => string }> {
  const sign = await currencySign();
  const number = (amount: number) =>
    String(Math.round(amount * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return { t: translator(lang), money: (amount: number) => `${number(amount)} ${sign}` };
}

let cachedSign: string | null = null;

async function currencySign(): Promise<string> {
  if (cachedSign !== null) return cachedSign;
  try {
    cachedSign = String((await Settings.get("CURRENCY_SIGN")) ?? "") || "₽";
  } catch {
    cachedSign = "₽";
  }
  return cachedSign;
}

function joined(values: Array<string | null | undefined>): string {
  return values.filter((value) => value !== null && value !== undefined && value !== "").join(", ");
}

function codeItem(view: any, said: any): CodeItem {
  return {
    id: String(view.id),
    code: view.code,
    status: view.status,
    worksNow: view.worksNow,
    description: view.description,
    gives: said.gives,
    promotions: joined(view.promotion.map((promotion: any) => promotion.name)),
    promotionsCount: view.promotion.length,
    period: said.period,
    schedule: said.schedule,
    enable: view.enable,
    type: view.type,
    prefix: view.prefix,
    externalId: view.externalId,
  };
}

/** The editable shape of a promotion, for the native editor of the client (Q43). */
function promotionConfig(view: any): PromotionConfig {
  const config = view.configDiscount ?? {};
  return {
    description: view.description ?? "",
    concept: view.concept ?? [],
    discountType: config.discountType === "flat" ? "flat" : "percentage",
    discountAmount: config.discountAmount ?? 0,
    dishes: config.dishes ?? [],
    groups: config.groups ?? [],
    excludeDishes: config.exclude?.dishes ?? [],
    excludeGroups: config.exclude?.groups ?? [],
    serviceType: config.serviceType ?? [],
    minBasketTotal: config.minBasketTotal ?? 0,
    gift: config.gift ?? null,
    worktime: Array.isArray(view.worktime) ? view.worktime : [],
  };
}

function promotionItem(view: any, said: any, withConfig = false): PromotionItem {
  const percentage = view.discount.type === "percentage";
  return {
    ...(withConfig ? { config: promotionConfig(view) } : {}),
    id: String(view.id),
    name: view.name,
    badge: view.badge,
    enable: view.enable,
    onlyByCode: view.onlyByCode,
    appliesNow: view.applies,
    kind: view.createdByUser ? "configured" : "programmed",
    gives: said.gives,
    discountType: view.discount.type ?? "percentage",
    // One of the two, never both: a percentage read as money, or money read as a percentage, would be a lie, and
    // a field a record does not carry is not drawn at all.
    ...(view.discount.amount ? (percentage ? { discountPercent: view.discount.amount } : { discountFlat: view.discount.amount }) : {}),
    scope: view.discount.scope,
    dishesCount: view.discount.dishesCount,
    groupsCount: view.discount.groupsCount,
    minBasketTotal: view.discount.giftMinBasketTotal || view.discount.minBasketTotal,
    serviceTypes: said.serviceTypes,
    gift: said.gift,
    isJoint: view.isJoint ? "joint" : "exclusive",
    isPublic: view.isPublic,
    sortOrder: view.sortOrder,
    concept: joined(view.concept),
    schedule: said.schedule,
    promotionCodes: joined((view.promotionCode ?? []).map((link: any) => link.code)),
    runtimeActive: view.runtimeActive === true,
  };
}

function applicationItem(view: any, why: string): ApplicationItem {
  return {
    id: String(view.orderId),
    title: view.shortId ? `№${view.shortId}` : String(view.orderId).slice(0, 8),
    code: view.code,
    status: view.status,
    discount: view.discount,
    createdAt: view.createdAt === null ? null : Number(view.createdAt),
    why,
    orderState: view.orderState,
  };
}

export function coreMarketing(): MarketingPort {
  /** One code, read and said. */
  async function readCode(id: string, lang: string): Promise<CodeItem | null> {
    const said = await words(lang);
    const view = await codesLib().getPromotionCode(id);
    return view ? codeItem(view, codesLib().promotionCodeWords(view, said)) : null;
  }

  async function readPromotion(id: string, lang: string): Promise<PromotionItem | null> {
    const said = await words(lang);
    const view = await promotionsLib().getPromotion(id);
    return view ? promotionItem(view, promotionsLib().promotionWords(view, said), true) : null;
  }

  return {
    async summary({ days, codes, promotions, money, lang }) {
      const item: MarketingSummary = { id: "summary", title: "", subtitle: "" };
      if (codes) {
        const counts = await codesLib().promotionCodeCounts();
        item.codesTotal = counts.total;
        item.codesActive = counts.active;
        if (counts.capped) item.capped = true;
      }
      if (promotions) {
        const counts = await promotionsLib().promotionCounts();
        item.promotionsTotal = counts.total;
        item.promotionsSelf = counts.self;
        item.promotionsByCodeOnly = counts.codeOnly;
      }
      if (money) {
        const stats = await applicationsLib().promotionCodeStats({ days });
        item.applications = stats.applications;
        item.totalDiscount = Math.round(stats.totalDiscount * 100) / 100;
        item.avgDiscount = Math.round(stats.avgDiscount * 100) / 100;
        if (stats.capped) item.capped = true;
      }
      return item;
    },

    async codes({ q, status, lang }) {
      const said = await words(lang);
      const library = codesLib();
      // The whole selection is read for the counts of the chips, and the status is a filter over it: a code is
      // cheap to read and nothing is indexed by a status core computes.
      const { items, capped } = await library.listPromotionCodes({ q });
      const counts: Record<string, number> = { all: items.length, active: 0, scheduled: 0, expired: 0, disabled: 0 };
      for (const view of items) counts[view.status] = (counts[view.status] ?? 0) + 1;
      const chosen = status ? items.filter((view: any) => view.status === status) : items;
      return { items: chosen.map((view: any) => codeItem(view, library.promotionCodeWords(view, said))), counts, capped };
    },

    code: (id, lang) => readCode(id, lang),

    async setCodeEnabled(id, enable, lang) {
      const existing = await PromotionCode.findOne({ id });
      if (!existing) return null;
      await PromotionCode.update({ id }, { enable }).fetch();
      return readCode(id, lang);
    },

    async saveCode(input, lang) {
      const library = codesLib();
      const id = input.id?.trim() || undefined;
      if (await library.promotionCodeTaken(input.code, id)) return { ok: false, reason: "taken" } as SavedCode;
      const values = {
        code: input.code.trim().toUpperCase(),
        description: input.description.trim(),
        type: "static",
        enable: input.enable !== false,
        // `startDate` / `stopDate` are plain strings in the model, and an empty one is "no bound".
        startDate: input.startDate ?? "",
        stopDate: input.stopDate ?? "",
      };
      let recordId = id;
      if (id) {
        if (!(await PromotionCode.findOne({ id }))) return { ok: false, reason: "not_found" } as SavedCode;
        await PromotionCode.update({ id }, values).fetch();
      } else {
        recordId = (await PromotionCode.create(values).fetch()).id;
      }
      if (input.promotionId) await PromotionCode.replaceCollection(recordId, "promotion").members([input.promotionId]);
      const item = await readCode(String(recordId), lang);
      return item ? { ok: true, item } : { ok: false, reason: "not_found" };
    },

    async promotions({ q, filter, code, lang }) {
      const said = await words(lang);
      const library = promotionsLib();
      const all = await library.listPromotions({ q });
      const counts: Record<string, number> = {
        all: all.length,
        self: all.filter((view: any) => view.applies === "self" || view.applies === "out-of-hours").length,
        "code-only": all.filter((view: any) => view.applies === "code-only").length,
        off: all.filter((view: any) => view.applies === "disabled").length,
        configured: all.filter((view: any) => view.createdByUser).length,
      };
      let chosen = all;
      if (filter === "self") chosen = all.filter((view: any) => view.applies === "self" || view.applies === "out-of-hours");
      if (filter === "code-only") chosen = all.filter((view: any) => view.applies === "code-only");
      if (filter === "off") chosen = all.filter((view: any) => view.applies === "disabled");
      if (filter === "configured") chosen = all.filter((view: any) => view.createdByUser);
      if (code) {
        // The promotions of one code: asked of the code, which holds the link.
        const linked = await PromotionCode.findOne({ code: String(code).trim().toUpperCase() }).populate("promotion");
        const ids = new Set((linked?.promotion ?? []).map((promotion: any) => String(promotion?.id ?? promotion)));
        chosen = chosen.filter((view: any) => ids.has(String(view.id)));
      }
      // A list is a list: the codes of each promotion are read for the card, not for every row.
      return { items: chosen.map((view: any) => promotionItem(view, library.promotionWords(view, said))), counts };
    },

    promotion: (id, lang) => readPromotion(id, lang),

    async setPromotionEnabled(id, enable, lang) {
      if (!(await Promotion.findOne({ id }))) return null;
      await Promotion.update({ id }, { enable }).fetch();
      return readPromotion(id, lang);
    },

    async setPromotionOnlyByCode(id, onlyByCode, lang) {
      if (!(await Promotion.findOne({ id }))) return null;
      await Promotion.update({ id }, { onlyByCode }).fetch();
      return readPromotion(id, lang);
    },

    async savePromotion(input, lang) {
      const existing = input.id ? await Promotion.findOne({ id: input.id }) : null;
      if (input.id && !existing) return { ok: false, reason: "not_found" } as SavedPromotion;
      // A promotion a module wrote is not edited here, exactly as it is not in the web.
      if (existing && !existing.createdByUser) {
        return { ok: false, reason: "forbidden", message: translator(lang)("Programmed promotions cannot be edited") };
      }

      const given = input.configDiscount ?? {};
      const configDiscount: Record<string, any> = {
        discountType: given.discountType === "flat" ? "flat" : "percentage",
        discountAmount: Number(given.discountAmount ?? 0),
        dishes: Array.isArray(given.dishes) ? given.dishes : [],
        groups: Array.isArray(given.groups) ? given.groups : [],
      };
      if (configDiscount.discountType === "percentage" && configDiscount.discountAmount > 100) {
        return { ok: false, reason: "invalid", message: translator(lang)("Percentage discount cannot exceed 100") };
      }
      if (Array.isArray(given.serviceType) && given.serviceType.length) configDiscount.serviceType = given.serviceType;
      if (given.excludeModifiers) configDiscount.excludeModifiers = true;
      const excluded = { dishes: given.exclude?.dishes ?? [], groups: given.exclude?.groups ?? [] };
      if (excluded.dishes.length || excluded.groups.length) configDiscount.exclude = excluded;
      if (Number(given.minBasketTotal ?? 0) > 0) configDiscount.minBasketTotal = Number(given.minBasketTotal);
      if (given.gift && Array.isArray(given.gift.dishes) && given.gift.dishes.length) {
        configDiscount.gift = { minBasketTotal: Number(given.gift.minBasketTotal ?? 0), dishes: given.gift.dishes };
        // The one rule about a gift core keeps for itself: it must be a product the guest cannot add.
        const refusal = await Promotion.validateGift(configDiscount);
        if (refusal) return { ok: false, reason: "invalid", message: translator(lang)(refusal) };
      }

      const { v4: uuid } = require("uuid");
      const saved = await Promotion.createOrUpdate({
        ...(existing ? { id: existing.id } : {}),
        name: String(input.name).trim(),
        description: String(input.description).trim(),
        badge: input.badge?.trim() || "configured-promotion",
        concept: Array.isArray(input.concept) && input.concept.length ? input.concept : ["origin"],
        isJoint: input.isJoint !== false,
        isPublic: input.isPublic === true,
        createdByUser: true,
        configDiscount,
        externalId: existing?.externalId || `configured-${uuid()}`,
      });
      // `createOrUpdate` strips the fields of the user's own space: they are written after it, as the web does.
      await Promotion.update(
        { id: saved.id },
        {
          enable: input.enable !== false,
          onlyByCode: input.onlyByCode === true,
          sortOrder: Number(input.sortOrder ?? existing?.sortOrder ?? 0),
          worktime: input.worktime ?? existing?.worktime ?? null,
          isDeleted: false,
        },
      ).fetch();

      const item = await readPromotion(String(saved.id), lang);
      return item ? { ok: true, item } : { ok: false, reason: "not_found" };
    },

    async catalog({ q, group, ids }) {
      const where: any = ids?.length ? { id: ids } : { isDeleted: false };
      if (!ids?.length && group) where.parentGroup = group;
      else if (!ids?.length && q) where.or = [{ name: { contains: q } }, { code: { contains: q } }];
      const [groups, dishes] = await Promise.all([
        ids?.length || q ? [] : Group.find({ where: { isDeleted: false } }).sort("name ASC"),
        Dish.find({ where, limit: 100 }).sort("name ASC"),
      ]);
      return {
        groups: (groups as any[]).map((row: any) => ({ id: String(row.id), name: row.name || String(row.id), parentGroup: row.parentGroup ? String(row.parentGroup) : null })),
        items: (dishes as any[]).map((row: any) => ({
          id: String(row.id),
          name: row.name || String(row.id),
          code: row.code || "",
          parentGroup: row.parentGroup ? String(row.parentGroup) : null,
          price: Number(row.price) || 0,
          notForSale: Boolean(row.notForSale),
          promo: Boolean(row.promo),
        })),
      };
    },

    async applications({ code, status, from, to, lang }) {
      const said = await words(lang);
      const library = applicationsLib();
      const { items, capped } = await library.promotionCodeApplications({ code, from, to });
      const counts: Record<string, number> = {
        all: items.length,
        applied: items.filter((view: any) => view.status === "applied").length,
        invalid: items.filter((view: any) => view.status === "invalid").length,
      };
      const chosen = status ? items.filter((view: any) => view.status === status) : items;
      return { items: chosen.map((view: any) => applicationItem(view, library.applicationWords(view, said).why)), counts, capped };
    },

    async application(orderId, lang) {
      const said = await words(lang);
      const library = applicationsLib();
      const view = await library.promotionCodeApplication(orderId);
      return view ? applicationItem(view, library.applicationWords(view, said).why) : null;
    },

    async promotionOptions() {
      const views = await promotionsLib().listPromotions({ withRuntime: false });
      return views
        .filter((view: any) => view.enable)
        .map((view: any) => ({ id: String(view.id), name: view.name || String(view.id) }));
    },
  };
}
