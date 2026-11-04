import type { FieldDefinition, MethodContext, MobileApiRegistry, OpenTarget, RecordLink } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Маркетинг» — the Marketing section of the admin panel on the phone: the promo codes and the promotions, by
 * `marketing.plan.md`.
 *
 * One app with the summary as its home screen (the owner's decision, Q39): it is the only screen everybody with
 * either right of the section sees, and the lists of codes, of promotions and of applications open from it by
 * links the server builds — no right, no line. Entry is `anyOf` of the two tokens the panel already has
 * (`promocodes-manager`, `promotions-manager`), so the `Marketer` group gets the section without a new tick
 * anywhere; inside, every method is checked on its own, and the numbers of the summary are fields with an
 * `access` of their own, so a person who only leads the promotions is not shown a «—» where the codes are counted.
 *
 * What a code is, what a promotion gives and whether either acts now is answered by core
 * (`lib/marketing/*`, plan C18-C20) — the same answers the web reads, so the phone and the panel cannot drift
 * apart on a status, on a term or on «что даёт».
 */

// ---- what the screens show ----

export interface MarketingSummary {
  id: string;
  title: string;
  subtitle: string;
  /** `promocodes-manager`. */
  codesTotal?: number;
  codesActive?: number;
  /** `promotions-manager`. */
  promotionsTotal?: number;
  promotionsSelf?: number;
  promotionsByCodeOnly?: number;
  /** `promocodes-manager` and `read-order-model` (slice C). */
  applications?: number;
  totalDiscount?: number;
  avgDiscount?: number;
  /** A selection was cut by its limit: the screen says so instead of quietly showing a part. */
  capped?: boolean;
}

export interface CodeItem {
  id: string;
  code: string;
  /** `active` / `scheduled` / `expired` / `disabled` — core's own status of a code. */
  status: string;
  /** The status *and* the hours: a code active from 10:00 does nothing at nine. */
  worksNow: boolean;
  description: string;
  /** "−10% на всю корзину", "Все акции кода выключены — код ничего не даёт". */
  gives: string;
  promotions: string;
  promotionsCount: number;
  /** "с 22.10.2026 по 31.10.2026" — days, never a date and time. */
  period: string;
  schedule: string;
  enable: boolean;
  type: string;
  prefix: string;
  externalId: string;
}

export interface PromotionItem {
  id: string;
  name: string;
  badge: string;
  enable: boolean;
  onlyByCode: boolean;
  /** `self` / `code-only` / `disabled` / `out-of-hours` — one word for the row. */
  appliesNow: string;
  /** `configured` — set up in the panel; `programmed` — written by a module. */
  kind: string;
  gives: string;
  discountType: string;
  /** Exactly one of the two is sent: a percentage is not money, and money is not a percentage. */
  discountPercent?: number;
  discountFlat?: number;
  scope: string;
  dishesCount: number;
  groupsCount: number;
  minBasketTotal: number;
  serviceTypes: string;
  gift: string;
  isJoint: string;
  isPublic: boolean;
  sortOrder: number;
  concept: string;
  schedule: string;
  promotionCodes: string;
  runtimeActive: boolean;
  /**
   * The promotion as its editor has to read it back — the description, the ids of the products and groups it
   * chose, the gift and the hours. No declared field shows any of this: the editor is a screen of the client's
   * own (Q43), and the universal card has no use for a list of ids. Only a card carries it, never a row.
   */
  config?: PromotionConfig;
}

/** The editable shape of a promotion: what the editor reads and what `savePromotion` takes back. */
export interface PromotionConfig {
  description: string;
  concept: string[];
  discountType: "percentage" | "flat";
  discountAmount: number;
  dishes: string[];
  groups: string[];
  excludeDishes: string[];
  excludeGroups: string[];
  serviceType: string[];
  minBasketTotal: number;
  gift: { minBasketTotal: number; dishes: Array<{ dishId: string; amount: number }> } | null;
  worktime: Array<{ dayOfWeek: string[]; start: string; stop: string; break?: string }>;
}

export interface ApplicationItem {
  /** The order the code was typed on. */
  id: string;
  title: string;
  code: string;
  /** `applied` — the order holds the code; `invalid` — it was typed and refused. */
  status: string;
  discount: number;
  createdAt: number | null;
  /** "корзина меньше 1 449 ₽", "акция выключена" — from the order's `promotionState`. */
  why: string;
  orderState: string;
}

/** A group and a product of the catalog, for the editor of a promotion (slice D). */
export interface CatalogGroup {
  id: string;
  name: string;
  parentGroup: string | null;
}

export interface CatalogDish {
  id: string;
  name: string;
  code: string;
  parentGroup: string | null;
  price: number;
  /** A gift product must be one of these two, as core demands (`Promotion.validateGift`). */
  notForSale: boolean;
  promo: boolean;
}

export interface SavedPromotion {
  ok: boolean;
  item?: PromotionItem;
  /** Why it was refused, in words core gave: a gift product that is for sale, a programmed promotion. */
  message?: string;
  reason?: "not_found" | "forbidden" | "invalid";
}

export interface SavedCode {
  ok: boolean;
  item?: CodeItem;
  reason?: "taken" | "not_found";
}

export interface MarketingPort {
  summary(query: { days: number; codes: boolean; promotions: boolean; money: boolean; lang: string }): Promise<MarketingSummary>;
  codes(query: { q?: string; status?: string; lang: string }): Promise<{ items: CodeItem[]; counts: Record<string, number>; capped: boolean }>;
  code(id: string, lang: string): Promise<CodeItem | null>;
  setCodeEnabled(id: string, enable: boolean, lang: string): Promise<CodeItem | null>;
  saveCode(input: { id?: string; code: string; description: string; startDate?: string; stopDate?: string; promotionId?: string; enable?: boolean }, lang: string): Promise<SavedCode>;
  promotions(query: { q?: string; filter?: string; code?: string; lang: string }): Promise<{ items: PromotionItem[]; counts: Record<string, number> }>;
  promotion(id: string, lang: string): Promise<PromotionItem | null>;
  setPromotionEnabled(id: string, enable: boolean, lang: string): Promise<PromotionItem | null>;
  setPromotionOnlyByCode(id: string, onlyByCode: boolean, lang: string): Promise<PromotionItem | null>;
  savePromotion(input: Record<string, any>, lang: string): Promise<SavedPromotion>;
  catalog(query: { q?: string; group?: string; ids?: string[] }): Promise<{ groups: CatalogGroup[]; items: CatalogDish[] }>;
  applications(query: { code?: string; status?: string; from?: string; to?: string; lang: string }): Promise<{ items: ApplicationItem[]; counts: Record<string, number>; capped: boolean }>;
  /** The promo part of one order; the whole order is «Клиенты»' card, linked to when that app and right are there. */
  application(orderId: string, lang: string): Promise<ApplicationItem | null>;
  /** The promotions a code may be linked to, for the form of a new code. */
  promotionOptions(): Promise<Array<{ id: string; name: string }>>;
}

export const PAGE_SIZE = 50;

const CODES = "promocodes-manager";
const PROMOTIONS = "promotions-manager";
const ORDERS = "read-order-model";

/** Either right of the section opens the summary; everything behind it is checked on its own. */
const section = { anyOf: [CODES, PROMOTIONS] };
const codes = { token: CODES };
const promotions = { token: PROMOTIONS };
/** The applications are read from the orders: without the model right there are none (slice C). */
const applications = { tokens: [CODES, ORDERS] };

/** Material Symbols "local_activity", 24×24. */
const ICON =
  "M20 12c0-1.1.9-2 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c1.1 0 2 .9 2 2s-.9 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2zm-9 4.5h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2z";

const STATUS_SPECIALS = [
  { value: "active", title: "mobile.marketing.status.active", tone: "success" },
  { value: "scheduled", title: "mobile.marketing.status.scheduled", tone: "warning" },
  { value: "expired", title: "mobile.marketing.status.expired", tone: "warning" },
  { value: "disabled", title: "mobile.marketing.status.disabled", tone: "danger" },
];

const APPLIES_SPECIALS = [
  { value: "self", title: "mobile.marketing.applies.self", tone: "success" },
  { value: "code-only", title: "mobile.marketing.applies.code-only", tone: "info" },
  { value: "out-of-hours", title: "mobile.marketing.applies.out-of-hours", tone: "warning" },
  { value: "disabled", title: "mobile.marketing.applies.disabled", tone: "danger" },
];

const APPLICATION_SPECIALS = [
  { value: "applied", title: "mobile.marketing.application.applied", tone: "success" },
  { value: "invalid", title: "mobile.marketing.application.invalid", tone: "warning" },
];

const SUMMARY_FIELDS: FieldDefinition[] = [
  { name: "codesTotal", title: "mobile.marketing.field.codesTotal", format: "number", readonly: true, section: "mobile.marketing.section.codes", access: codes },
  { name: "codesActive", title: "mobile.marketing.field.codesActive", format: "number", readonly: true, section: "mobile.marketing.section.codes", access: codes },
  { name: "promotionsTotal", title: "mobile.marketing.field.promotionsTotal", format: "number", readonly: true, section: "mobile.marketing.section.promotions", access: promotions },
  { name: "promotionsSelf", title: "mobile.marketing.field.promotionsSelf", format: "number", readonly: true, section: "mobile.marketing.section.promotions", access: promotions },
  { name: "promotionsByCodeOnly", title: "mobile.marketing.field.promotionsByCodeOnly", format: "number", readonly: true, section: "mobile.marketing.section.promotions", access: promotions },
  { name: "applications", title: "mobile.marketing.field.applications", format: "number", readonly: true, section: "mobile.marketing.section.money", access: applications },
  { name: "totalDiscount", title: "mobile.marketing.field.totalDiscount", format: "money", readonly: true, section: "mobile.marketing.section.money", access: applications },
  { name: "avgDiscount", title: "mobile.marketing.field.avgDiscount", format: "money", readonly: true, section: "mobile.marketing.section.money", access: applications },
  { name: "capped", title: "mobile.marketing.field.capped", format: "boolean", readonly: true, section: "mobile.marketing.section.money", access: applications },
];

const CODE_FIELDS: FieldDefinition[] = [
  { name: "status", title: "mobile.marketing.field.status", format: "enum", readonly: true, specials: STATUS_SPECIALS },
  { name: "worksNow", title: "mobile.marketing.field.worksNow", format: "boolean", readonly: true },
  { name: "description", title: "mobile.marketing.field.description", format: "text", readonly: true },
  { name: "gives", title: "mobile.marketing.field.gives", format: "text", readonly: true, section: "mobile.marketing.section.gives" },
  { name: "promotions", title: "mobile.marketing.field.promotions", format: "text", readonly: true, section: "mobile.marketing.section.gives" },
  { name: "period", title: "mobile.marketing.field.period", format: "text", readonly: true, section: "mobile.marketing.section.term" },
  { name: "schedule", title: "mobile.marketing.field.schedule", format: "text", readonly: true, section: "mobile.marketing.section.term" },
  { name: "enable", title: "mobile.marketing.field.codeEnable", format: "boolean", readonly: true, section: "mobile.marketing.section.term" },
  {
    name: "type", title: "mobile.marketing.field.type", format: "enum", readonly: true, section: "mobile.marketing.section.details",
    "x-titles": { static: "mobile.marketing.type.static" },
  },
  { name: "prefix", title: "mobile.marketing.field.prefix", format: "text", readonly: true, section: "mobile.marketing.section.details" },
  { name: "externalId", title: "mobile.marketing.field.externalId", format: "text", readonly: true, section: "mobile.marketing.section.details" },
];

const PROMOTION_FIELDS: FieldDefinition[] = [
  { name: "appliesNow", title: "mobile.marketing.field.appliesNow", format: "enum", readonly: true, specials: APPLIES_SPECIALS },
  { name: "badge", title: "mobile.marketing.field.badge", format: "text", readonly: true },
  { name: "enable", title: "mobile.marketing.field.promotionEnable", format: "boolean", readonly: true },
  { name: "onlyByCode", title: "mobile.marketing.field.onlyByCode", format: "boolean", readonly: true },
  {
    name: "kind", title: "mobile.marketing.field.kind", format: "enum", readonly: true,
    "x-titles": { configured: "mobile.marketing.kind.configured", programmed: "mobile.marketing.kind.programmed" },
  },
  {
    name: "discountType", title: "mobile.marketing.field.discountType", format: "enum", readonly: true, section: "mobile.marketing.section.discount",
    "x-titles": { percentage: "mobile.marketing.discountType.percentage", flat: "mobile.marketing.discountType.flat" },
  },
  // One of the two carries the value; the other is not in the record at all, and a field a record has
  // not got is not drawn (`client-lookup.plan.md` — a percentage shown as money would be a lie).
  { name: "discountPercent", title: "mobile.marketing.field.discountAmount", format: "percent", readonly: true, section: "mobile.marketing.section.discount" },
  { name: "discountFlat", title: "mobile.marketing.field.discountAmount", format: "money", readonly: true, section: "mobile.marketing.section.discount" },
  {
    name: "scope", title: "mobile.marketing.field.scope", format: "enum", readonly: true, section: "mobile.marketing.section.discount",
    "x-titles": {
      all: "mobile.marketing.scope.all",
      dishes: "mobile.marketing.scope.dishes",
      groups: "mobile.marketing.scope.groups",
      mixed: "mobile.marketing.scope.mixed",
      none: "mobile.marketing.scope.all",
    },
  },
  { name: "dishesCount", title: "mobile.marketing.field.dishesCount", format: "number", readonly: true, section: "mobile.marketing.section.discount" },
  { name: "groupsCount", title: "mobile.marketing.field.groupsCount", format: "number", readonly: true, section: "mobile.marketing.section.discount" },
  { name: "minBasketTotal", title: "mobile.marketing.field.minBasketTotal", format: "money", readonly: true, section: "mobile.marketing.section.discount" },
  { name: "serviceTypes", title: "mobile.marketing.field.serviceTypes", format: "text", readonly: true, section: "mobile.marketing.section.discount" },
  { name: "gift", title: "mobile.marketing.field.gift", format: "text", readonly: true, section: "mobile.marketing.section.gift" },
  {
    name: "isJoint", title: "mobile.marketing.field.isJoint", format: "enum", readonly: true, section: "mobile.marketing.section.behaviour",
    "x-titles": { joint: "mobile.marketing.isJoint.joint", exclusive: "mobile.marketing.isJoint.exclusive" },
  },
  { name: "isPublic", title: "mobile.marketing.field.isPublic", format: "boolean", readonly: true, section: "mobile.marketing.section.behaviour" },
  { name: "sortOrder", title: "mobile.marketing.field.sortOrder", format: "number", readonly: true, section: "mobile.marketing.section.behaviour" },
  { name: "concept", title: "mobile.marketing.field.concept", format: "text", readonly: true, section: "mobile.marketing.section.behaviour" },
  { name: "schedule", title: "mobile.marketing.field.schedule", format: "text", readonly: true, section: "mobile.marketing.section.term" },
  { name: "promotionCodes", title: "mobile.marketing.field.promotionCodes", format: "text", readonly: true, section: "mobile.marketing.section.term" },
  { name: "runtimeActive", title: "mobile.marketing.field.runtimeActive", format: "boolean", readonly: true, section: "mobile.marketing.section.details" },
];

const APPLICATION_FIELDS: FieldDefinition[] = [
  { name: "status", title: "mobile.marketing.field.applicationStatus", format: "enum", readonly: true, specials: APPLICATION_SPECIALS },
  { name: "code", title: "mobile.marketing.field.code", format: "text", readonly: true },
  { name: "why", title: "mobile.marketing.field.why", format: "text", readonly: true },
  { name: "discount", title: "mobile.marketing.field.discount", format: "money", readonly: true, section: "mobile.marketing.section.order" },
  { name: "createdAt", title: "mobile.marketing.field.createdAt", format: "datetime", readonly: true, section: "mobile.marketing.section.order" },
  { name: "orderState", title: "mobile.marketing.field.orderState", format: "text", readonly: true, section: "mobile.marketing.section.order" },
];

const DAYS = {
  type: "string",
  enum: ["7", "30", "90"],
  default: "30",
  "x-titles": { "7": "mobile.marketing.days.7", "30": "mobile.marketing.days.30", "90": "mobile.marketing.days.90" },
};

const CODE_STATUS = {
  type: "string",
  enum: ["all", "active", "scheduled", "expired", "disabled"],
  default: "all",
  "x-titles": {
    all: "mobile.marketing.filter.all",
    active: "mobile.marketing.status.active",
    scheduled: "mobile.marketing.status.scheduled",
    expired: "mobile.marketing.status.expired",
    disabled: "mobile.marketing.status.disabled",
  },
};

const PROMOTION_FILTER = {
  type: "string",
  enum: ["all", "self", "code-only", "off", "configured"],
  default: "all",
  "x-titles": {
    all: "mobile.marketing.filter.all",
    self: "mobile.marketing.applies.self",
    "code-only": "mobile.marketing.applies.code-only",
    off: "mobile.marketing.applies.disabled",
    configured: "mobile.marketing.kind.configured",
  },
};

const APPLICATION_STATUS = {
  type: "string",
  enum: ["all", "applied", "invalid"],
  default: "all",
  "x-titles": {
    all: "mobile.marketing.filter.all",
    applied: "mobile.marketing.application.applied",
    invalid: "mobile.marketing.application.invalid",
  },
};

const ID = { type: "string", minLength: 1, maxLength: 100 };
const DAY = { type: "string", pattern: "^(\\d{4}-\\d{2}-\\d{2})?$", maxLength: 10 };

/**
 * The form of a new code. The promotion to link it to is a choice of the server's own promotions, so the schema is
 * built per user and per moment (`describe`) rather than frozen into the registration; with no promotion to choose
 * from the parameter is a plain string, because an empty `enum` is not a schema ajv compiles.
 */
function saveCodeInput(options: Array<{ id: string; name: string }> = []): Record<string, any> {
  return {
    type: "object",
    required: ["code", "description"],
    properties: {
      id: ID,
      code: { type: "string", minLength: 1, maxLength: 100, title: "mobile.marketing.input.code" },
      description: { type: "string", minLength: 1, maxLength: 500, title: "mobile.marketing.input.description" },
      startDate: { ...DAY, title: "mobile.marketing.input.startDate" },
      stopDate: { ...DAY, title: "mobile.marketing.input.stopDate" },
      promotionId: {
        type: "string",
        maxLength: 100,
        title: "mobile.marketing.input.promotion",
        ...(options.length
          ? {
              enum: options.map((option) => option.id),
              "x-titles": Object.fromEntries(options.map((option) => [option.id, option.name])),
            }
          : {}),
      },
    },
  };
}

function link(title: string, open: OpenTarget, meta?: string): RecordLink {
  return meta ? { title, meta, open } : { title, open };
}

/** "Применения · 12" — a count belongs in the title of a link, which is data and is not translated. */
function counted(title: string, count: number): string {
  return `${title} · ${count}`;
}

export function registerMarketing(registry: MobileApiRegistry, marketing: MarketingPort): void {
  registry.registerApp({
    id: "marketing",
    version: "1.0.0",
    title: "mobile.app.marketing.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "marketing.home",
    scope: "server",
    models: {
      summary: { fields: SUMMARY_FIELDS },
      promocode: { fields: CODE_FIELDS },
      promotion: { fields: PROMOTION_FIELDS },
      application: { fields: APPLICATION_FIELDS },
    },
  });

  // ---- the summary: the home screen of the section ----

  registry.registerMethod({
    name: "marketing.home",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.home.title",
    access: section,
    model: "summary",
    input: { type: "object", properties: { days: DAYS } },
    ui: { view: "detail", item: { title: "title", subtitle: "subtitle" }, chips: "days" },
    handler: async ({ days }: { days: string }, ctx: MethodContext) => {
      const [mayCodes, mayPromotions, mayOrders] = await Promise.all([ctx.can(CODES), ctx.can(PROMOTIONS), ctx.can(ORDERS)]);
      const item = await marketing.summary({
        days: Number(days),
        codes: mayCodes,
        promotions: mayPromotions,
        money: mayCodes && mayOrders,
        lang: ctx.lang,
      });
      // The words of the card are the app's own keys, not data: the adapter counts, the app names.
      item.title = ctx.t("mobile.marketing.summary.title");
      item.subtitle = ctx.t("mobile.marketing.summary.subtitle");
      const links: RecordLink[] = [];
      if (await ctx.canOpen("marketing.promocodes")) {
        links.push(link(counted(ctx.t("mobile.marketing.link.codes"), item.codesTotal ?? 0), { method: "marketing.promocodes" }));
      }
      if (await ctx.canOpen("marketing.promotions")) {
        links.push(link(counted(ctx.t("mobile.marketing.link.promotions"), item.promotionsTotal ?? 0), { method: "marketing.promotions" }));
      }
      if (await ctx.canOpen("marketing.applications")) {
        links.push(link(counted(ctx.t("mobile.marketing.link.applications"), item.applications ?? 0), { method: "marketing.applications" }));
      }
      return { item: { ...item, _links: links } };
    },
  });

  // ---- the promo codes ----

  registry.registerMethod({
    name: "marketing.promocodes",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.promocodes.title",
    access: codes,
    model: "promocode",
    input: {
      type: "object",
      properties: { q: { type: "string", maxLength: 100 }, status: CODE_STATUS, cursor: { type: "string", maxLength: 200 } },
    },
    ui: {
      view: "list",
      item: { title: "code", subtitle: "description", meta: "period", value: "promotionsCount", badge: "status" },
      search: "q",
      chips: "status",
      open: "marketing.promocode",
      empty: "mobile.marketing.promocodes.empty",
    },
    handler: async (params: { q?: string; status: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const { items, counts, capped } = await marketing.codes({
        q: params.q?.trim() || undefined,
        status: params.status === "all" ? undefined : params.status,
        lang: ctx.lang,
      });
      return { ...page(items, offset, PAGE_SIZE), counts, capped };
    },
  });

  registry.registerMethod({
    name: "marketing.promocode",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.promocode.title",
    access: codes,
    model: "promocode",
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: { view: "detail", item: { title: "code", subtitle: "description", badge: "status" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await marketing.code(id, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such promo code");
      return { item: { ...item, _links: await codeLinks(ctx, item) } };
    },
  });

  /** The links of a code's card: into each promotion of it, and into its applications. */
  async function codeLinks(ctx: MethodContext, item: CodeItem): Promise<RecordLink[]> {
    const links: RecordLink[] = [];
    if (await ctx.canOpen("marketing.applications")) {
      links.push(link(ctx.t("mobile.marketing.link.codeApplications"), { method: "marketing.applications", params: { code: item.code } }));
    }
    if (item.promotionsCount > 0 && (await ctx.canOpen("marketing.promotions"))) {
      links.push(link(counted(ctx.t("mobile.marketing.link.promotions"), item.promotionsCount), { method: "marketing.promotions", params: { code: item.code } }));
    }
    return links;
  }

  registry.registerMethod({
    name: "marketing.setCodeEnabled",
    app: "marketing",
    kind: "mutation",
    title: "mobile.marketing.setCodeEnabled.title",
    access: codes,
    input: { type: "object", required: ["id", "enable"], properties: { id: ID, enable: { type: "boolean" } } },
    ui: {
      view: "action",
      on: "promocode",
      placement: ["row", "detail"],
      control: { type: "toggle", param: "enable", bind: "enable" },
      confirm: "mobile.marketing.setCodeEnabled.confirm",
    },
    handler: async ({ id, enable }: { id: string; enable: boolean }, ctx) => {
      const item = await marketing.setCodeEnabled(id, enable, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such promo code");
      return { item: { ...item, _links: await codeLinks(ctx, item) } };
    },
    audit: ({ id, enable }) => ({ record: id, params: { enable } }),
  });

  registry.registerMethod({
    name: "marketing.saveCode",
    app: "marketing",
    kind: "mutation",
    title: "mobile.marketing.saveCode.title",
    access: codes,
    input: saveCodeInput(),
    ui: { view: "action", on: "list", placement: ["list"], control: { type: "form" } },
    /** The promotions to choose from are the server's own: read now, not frozen into the contract. */
    describe: async () => ({ input: saveCodeInput(await marketing.promotionOptions()) }),
    handler: async (params: { id?: string; code: string; description: string; startDate?: string; stopDate?: string; promotionId?: string }, ctx) => {
      const saved = await marketing.saveCode(params, ctx.lang);
      if (!saved.ok || !saved.item) {
        if (saved.reason === "taken") return ctx.fail("conflict", ctx.t("mobile.marketing.error.codeTaken"));
        return ctx.fail("not_found", "No such promo code");
      }
      return { item: { ...saved.item, _links: await codeLinks(ctx, saved.item) } };
    },
    audit: (params, result: { item?: CodeItem }) => ({ record: result?.item?.id ?? null, params: { code: params.code } }),
  });

  // ---- the promotions ----

  registry.registerMethod({
    name: "marketing.promotions",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.promotions.title",
    access: promotions,
    model: "promotion",
    input: {
      type: "object",
      properties: {
        q: { type: "string", maxLength: 100 },
        filter: PROMOTION_FILTER,
        /** The promotions of one code: where the card of a code leads. */
        code: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "name", subtitle: "gives", meta: "schedule", badge: "appliesNow" },
      search: "q",
      chips: "filter",
      open: "marketing.promotion",
      empty: "mobile.marketing.promotions.empty",
    },
    handler: async (params: { q?: string; filter: string; code?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const { items, counts } = await marketing.promotions({
        q: params.q?.trim() || undefined,
        filter: params.filter === "all" ? undefined : params.filter,
        code: params.code?.trim() || undefined,
        lang: ctx.lang,
      });
      return { ...page(items, offset, PAGE_SIZE), counts };
    },
  });

  registry.registerMethod({
    name: "marketing.promotion",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.promotion.title",
    access: promotions,
    model: "promotion",
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: { view: "detail", item: { title: "name", subtitle: "gives", badge: "appliesNow" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await marketing.promotion(id, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such promotion");
      return { item: { ...item, _links: await promotionLinks(ctx, item) } };
    },
  });

  /** The links of a promotion's card: the codes it works through. */
  async function promotionLinks(ctx: MethodContext, item: PromotionItem): Promise<RecordLink[]> {
    if (!item.promotionCodes || !(await ctx.canOpen("marketing.promocodes"))) return [];
    return [link(ctx.t("mobile.marketing.link.codesOfPromotion"), { method: "marketing.promocodes", params: { q: item.name } }, item.promotionCodes)];
  }

  registry.registerMethod({
    name: "marketing.setPromotionEnabled",
    app: "marketing",
    kind: "mutation",
    title: "mobile.marketing.setPromotionEnabled.title",
    access: promotions,
    input: { type: "object", required: ["id", "enable"], properties: { id: ID, enable: { type: "boolean" } } },
    ui: {
      view: "action",
      on: "promotion",
      placement: ["row", "detail"],
      control: { type: "toggle", param: "enable", bind: "enable" },
      confirm: "mobile.marketing.setPromotionEnabled.confirm",
    },
    handler: async ({ id, enable }: { id: string; enable: boolean }, ctx) => {
      const item = await marketing.setPromotionEnabled(id, enable, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such promotion");
      return { item: { ...item, _links: await promotionLinks(ctx, item) } };
    },
    audit: ({ id, enable }) => ({ record: id, params: { enable } }),
  });

  registry.registerMethod({
    name: "marketing.setPromotionOnlyByCode",
    app: "marketing",
    kind: "mutation",
    title: "mobile.marketing.setPromotionOnlyByCode.title",
    access: promotions,
    input: { type: "object", required: ["id", "onlyByCode"], properties: { id: ID, onlyByCode: { type: "boolean" } } },
    ui: { view: "action", on: "promotion", placement: ["detail"], control: { type: "toggle", param: "onlyByCode", bind: "onlyByCode" } },
    // A promotion that is switched off applies nowhere, so "only by code" is nothing to say about it.
    describeItem: (_ctx, record: PromotionItem) => (record?.enable === false ? false : undefined),
    handler: async ({ id, onlyByCode }: { id: string; onlyByCode: boolean }, ctx) => {
      const item = await marketing.setPromotionOnlyByCode(id, onlyByCode, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such promotion");
      return { item: { ...item, _links: await promotionLinks(ctx, item) } };
    },
    audit: ({ id, onlyByCode }) => ({ record: id, params: { onlyByCode } }),
  });

  // ---- the editor of a promotion: a screen the client draws itself (Q43) ----

  registry.registerMethod({
    name: "marketing.savePromotion",
    app: "marketing",
    kind: "mutation",
    title: "mobile.marketing.savePromotion.title",
    access: promotions,
    input: {
      type: "object",
      required: ["name", "description"],
      properties: {
        id: ID,
        name: { type: "string", minLength: 1, maxLength: 200 },
        description: { type: "string", minLength: 1, maxLength: 1000 },
        badge: { type: "string", maxLength: 200 },
        concept: { type: "array", maxItems: 20, items: { type: "string", maxLength: 100 } },
        isJoint: { type: "boolean" },
        isPublic: { type: "boolean" },
        enable: { type: "boolean" },
        onlyByCode: { type: "boolean" },
        sortOrder: { type: "integer", minimum: -1000, maximum: 1000 },
        worktime: {
          type: "array",
          maxItems: 7,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["dayOfWeek", "start", "stop"],
            properties: {
              dayOfWeek: { type: "array", minItems: 1, maxItems: 7, items: { type: "string", maxLength: 20 } },
              start: { type: "string", maxLength: 5 },
              stop: { type: "string", maxLength: 5 },
              break: { type: "string", maxLength: 11 },
            },
          },
        },
        configDiscount: {
          type: "object",
          additionalProperties: false,
          properties: {
            discountType: { type: "string", enum: ["percentage", "flat"] },
            discountAmount: { type: "number", minimum: 0, maximum: 1000000 },
            dishes: { type: "array", maxItems: 500, items: { type: "string", maxLength: 100 } },
            groups: { type: "array", maxItems: 200, items: { type: "string", maxLength: 100 } },
            serviceType: { type: "array", maxItems: 3, items: { type: "string", enum: ["delivery", "pickup", "dine-in"] } },
            excludeModifiers: { type: "boolean" },
            exclude: {
              type: "object",
              additionalProperties: false,
              properties: {
                dishes: { type: "array", maxItems: 500, items: { type: "string", maxLength: 100 } },
                groups: { type: "array", maxItems: 200, items: { type: "string", maxLength: 100 } },
              },
            },
            minBasketTotal: { type: "number", minimum: 0, maximum: 1000000 },
            gift: {
              type: "object",
              additionalProperties: false,
              required: ["dishes"],
              properties: {
                minBasketTotal: { type: "number", minimum: 0, maximum: 1000000 },
                dishes: {
                  type: "array",
                  maxItems: 20,
                  items: {
                    type: "object",
                    additionalProperties: false,
                    required: ["dishId", "amount"],
                    properties: { dishId: { type: "string", minLength: 1, maxLength: 100 }, amount: { type: "integer", minimum: 1, maximum: 99 } },
                  },
                },
              },
            },
          },
        },
      },
    },
    // The universal renderer cannot draw this: products and groups chosen from a catalog, a gift, hours. The
    // client has a screen of its own for it, and one that has not got it draws no action at all.
    ui: { view: "action", on: "promotion", placement: ["detail", "list"], control: { type: "native", screen: "promotion-editor" } },
    // A promotion a module wrote is not edited here, as it is not in the web: only its switches and its order.
    describeItem: (_ctx, record: PromotionItem) => (record?.kind === "programmed" ? false : undefined),
    handler: async (params: Record<string, any>, ctx) => {
      const saved = await marketing.savePromotion(params, ctx.lang);
      if (!saved.ok || !saved.item) {
        if (saved.reason === "not_found") return ctx.fail("not_found", "No such promotion");
        if (saved.reason === "forbidden") return ctx.fail("forbidden", saved.message ?? "This promotion cannot be edited");
        return ctx.fail("invalid", saved.message ?? "The promotion was not saved");
      }
      return { item: { ...saved.item, _links: await promotionLinks(ctx, saved.item) } };
    },
    audit: (params, result: { item?: PromotionItem }) => ({ record: result?.item?.id ?? params?.id ?? null, params: { name: params?.name } }),
  });

  registry.registerMethod({
    name: "marketing.catalog",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.catalog.title",
    access: promotions,
    input: {
      type: "object",
      properties: {
        q: { type: "string", maxLength: 100 },
        group: { type: "string", maxLength: 100 },
        ids: { type: "array", maxItems: 100, items: { type: "string", maxLength: 100 } },
      },
    },
    handler: (params: { q?: string; group?: string; ids?: string[] }) =>
      marketing.catalog({ q: params.q?.trim() || undefined, group: params.group || undefined, ids: params.ids }),
  });

  // ---- the applications: where a code was typed (slice C) ----

  registry.registerMethod({
    name: "marketing.applications",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.applications.title",
    access: applications,
    model: "application",
    input: {
      type: "object",
      properties: {
        code: { type: "string", maxLength: 100 },
        status: APPLICATION_STATUS,
        from: DAY,
        to: DAY,
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "title", subtitle: "why", meta: "createdAt", value: "discount", badge: "status" },
      chips: "status",
      open: "marketing.application",
      empty: "mobile.marketing.applications.empty",
    },
    handler: async (params: { code?: string; status: string; from?: string; to?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const { items, counts, capped } = await marketing.applications({
        code: params.code?.trim() || undefined,
        status: params.status === "all" ? undefined : params.status,
        from: params.from || undefined,
        to: params.to || undefined,
        lang: ctx.lang,
      });
      return { ...page(items, offset, PAGE_SIZE), counts, capped };
    },
  });

  registry.registerMethod({
    name: "marketing.application",
    app: "marketing",
    kind: "query",
    title: "mobile.marketing.application.title",
    access: applications,
    model: "application",
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: { view: "detail", item: { title: "title", subtitle: "why", badge: "status" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await marketing.application(id, ctx.lang);
      if (!item) return ctx.fail("not_found", "No such application");
      const links: RecordLink[] = [];
      // The whole order is the card of «Клиенты» (`client-lookup.plan.md`); while that method is not there, or
      // the person may not read an order, the promo part of it is what they get — and no door that will not open.
      if (await ctx.canOpen("clients.order")) {
        links.push(link(ctx.t("mobile.marketing.link.order"), { app: "clients", method: "clients.order", params: { id: item.id } }));
      }
      if (item.code && (await ctx.canOpen("marketing.promocodes"))) {
        links.push(link(ctx.t("mobile.marketing.link.code"), { method: "marketing.promocodes", params: { q: item.code } }, item.code));
      }
      return { item: { ...item, _links: links } };
    },
  });
}
