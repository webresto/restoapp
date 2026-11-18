import type { FieldDefinition, MethodContext, MobileApiRegistry, OpenTarget, RecordLink } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Каналы продаж» — the Sales Channels page of the admin panel on the phone, by `sales-channels.plan.md`.
 *
 * A sales channel is an entry point that may create orders: a website, a bot, a kiosk, the POS. The rule the
 * whole screen is built around is core's: **a channel exists only together with its provider module**. So this
 * is not a CRUD over a table — it is a screen that has to say *why* a channel does not work and *what to do
 * next*: install the provider (that is «Система»), finish its setup, switch the channel on.
 *
 * Every rule and every word is core's, through `lib/sales-channels/view.ts` and `lib/sales-channels/apply.ts`
 * (plan C29–C31): the page, the MCP tools and this app answer the same thing about the same channel, in the
 * language of the request. The flags travel next to the words — for `describeItem` and for the editor.
 *
 * `channels.list` declares no `since` on purpose: a polled list would ask every provider of the server every
 * ten seconds, and each of them has a 3 s timeout (C32).
 */

// ---- what the screens show ----

export interface ChannelItem {
  id: string;
  key: string;
  title: string;
  /** "web-main · Website" — the second line of the row and of the card, as on the page. */
  subtitle: string;
  type: string;
  typeTitle: string;
  category: string;
  /** `ready` / `needs_setup` / `draft` / `disabled` / `error` — the badge; the tone comes from `specials`. */
  status: string;
  /**
   * What the provider said, already in the language of the request ("Storefront is not built yet").
   * Absent when it said nothing — a field a record does not carry is not drawn at all, and an empty
   * «Провайдер сказал» on a card is a line that says nothing.
   */
  statusMessage?: string;
  /** Why the channel works or does not: "admin-frontend · Provider installed", "Not working: provider is not installed (admin-frontend)". */
  providerText: string;
  /** What to do about a provider that is not installed; absent when there is nothing to do. */
  providerHint?: string;
  /**
   * The operator's switch as the screen must show it: a channel whose provider is not in this process is
   * shown off whatever is stored, exactly as the page shows it — the stored flag is `enabled`, below.
   */
  enabledText: boolean;
  conceptsText: string;
  /** Absent when the channel is bound to no country / no platform of its own. */
  countriesText?: string;
  platformsText?: string;
  /** The public address of the channel; absent when it has none. */
  url?: string;
  capabilitiesText?: string;
  updatedAt: number | null;
  /**
   * The flags of the record: no declared field shows them, `describeItem` and the editor of a channel read
   * them. `settingsUrl` and `settings` are only here for somebody who may manage the channels.
   */
  enabled: boolean;
  providerInstalled: boolean | null;
  providerAlive: boolean;
  typeComingSoon: boolean;
  marketplaceAppId: string | null;
  settingsUrl: string | null;
  canDelete: boolean;
  concepts: string[];
  countries: string[];
  platforms: string[];
  defaultConcept: string | null;
  allowConceptSwitch: boolean;
}

/** One type of the catalog: `describeChannelType` of core, for the list of types and for its card. */
export interface ChannelTypeItem {
  /** The slug of the type: "telegram-bot". */
  id: string;
  title: string;
  /** "Provider installed", "Provider not installed", …; absent when the type is coming soon. */
  stateText?: string;
  /** Present only as `coming_soon`: the one badge a type card has on the page. */
  availability?: "coming_soon";
  category: string;
  capabilitiesText?: string;
  countriesText?: string;
  /** The provider module: only for somebody who may manage the channels. */
  providerText?: string;
  available: boolean;
  installed: boolean;
  alive: boolean;
  settingsUrl: string | null;
  marketplaceAppId: string | null;
  marketplaceTag: string;
}

/** A refusal of a rule, in the words core gave: the phone shows `message`, never a code. */
export interface ChannelRefusal {
  ok: false;
  message: string;
  /** `settingsUrl` of the provider and the `marketplaceAppId` to install — the phone's next step. */
  details?: Record<string, unknown>;
}

export type ToggledChannel = { ok: true; item: ChannelItem } | ChannelRefusal | { ok: false; notFound: true };
export type RemovedChannel = { ok: true; id: string; key: string } | ChannelRefusal | { ok: false; notFound: true };

export interface ChannelsPort {
  list(query: { q?: string; state?: string; canManage: boolean; lang: string }): Promise<{ items: ChannelItem[]; counts: Record<string, number> }>;
  get(id: string, options: { canManage: boolean; lang: string }): Promise<ChannelItem | null>;
  setEnabled(id: string, enabled: boolean, options: { canManage: boolean; lang: string }): Promise<ToggledChannel>;
  remove(id: string, lang: string): Promise<RemovedChannel>;
  /** The catalog of types; `recommended` is by the country of the project, without what is already here. */
  types(query: { kind: string; canManage: boolean; lang: string }): Promise<{ items: ChannelTypeItem[]; counts: Record<string, number> }>;
  type(id: string, options: { canManage: boolean; lang: string }): Promise<ChannelTypeItem | null>;
}

export const PAGE_SIZE = 50;

/** The three rights of the web page: `view` opens the app, `manage` adds the actions (Q52). */
const LEGACY = "sales-channels-manager";
const VIEW = "sales-channels-view";
const MANAGE = "sales-channels-manage";

const section = { anyOf: [LEGACY, VIEW, MANAGE] };
const manage = { anyOf: [LEGACY, MANAGE] };

/** The right the module manager checks before installing: the page shows «Install provider» by it. */
const INSTALL = "modules-process-upgrade";
/** The catalog of «Система». Whoever may not open it — `ctx.canOpen` says no — has no line leading there. */
const CATALOG = { app: "system", method: "system.catalog" };

/** Material "store", 24×24: a shop front, the icon of the page. */
const ICON = "M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z";

const STATUS_SPECIALS = [
  { value: "ready", title: "mobile.channels.status.ready", tone: "success" },
  { value: "needs_setup", title: "mobile.channels.status.needs_setup", tone: "warning" },
  { value: "draft", title: "mobile.channels.status.draft", tone: "info" },
  { value: "disabled", title: "mobile.channels.status.disabled", tone: "info" },
  { value: "error", title: "mobile.channels.status.error", tone: "danger" },
];

const CHANNEL_FIELDS: FieldDefinition[] = [
  { name: "status", title: "mobile.channels.field.status", format: "enum", readonly: true, specials: STATUS_SPECIALS },
  { name: "statusMessage", title: "mobile.channels.field.statusMessage", format: "text", readonly: true },
  { name: "providerText", title: "mobile.channels.field.provider", format: "text", readonly: true },
  { name: "providerHint", title: "mobile.channels.field.nextStep", format: "text", readonly: true },
  { name: "enabledText", title: "mobile.channels.field.enabled", format: "boolean", readonly: true },
  { name: "conceptsText", title: "mobile.channels.field.concepts", format: "text", readonly: true, section: "mobile.channels.section.binding" },
  { name: "countriesText", title: "mobile.channels.field.countries", format: "text", readonly: true, section: "mobile.channels.section.binding" },
  { name: "platformsText", title: "mobile.channels.field.platforms", format: "text", readonly: true, section: "mobile.channels.section.binding" },
  { name: "typeTitle", title: "mobile.channels.field.type", format: "text", readonly: true, section: "mobile.channels.section.type" },
  { name: "category", title: "mobile.channels.field.category", format: "text", readonly: true, section: "mobile.channels.section.type" },
  { name: "capabilitiesText", title: "mobile.channels.field.capabilities", format: "text", readonly: true, section: "mobile.channels.section.type" },
  { name: "url", title: "mobile.channels.field.url", format: "text", readonly: true, section: "mobile.channels.section.links" },
  { name: "updatedAt", title: "mobile.channels.field.updatedAt", format: "relative", readonly: true, section: "mobile.channels.section.links" },
];

const TYPE_FIELDS: FieldDefinition[] = [
  {
    name: "availability",
    title: "mobile.channels.field.status",
    format: "enum",
    readonly: true,
    specials: [{ value: "coming_soon", title: "mobile.channels.availability.coming_soon", tone: "info" }],
  },
  { name: "stateText", title: "mobile.channels.field.provider", format: "text", readonly: true },
  { name: "providerText", title: "mobile.channels.field.module", format: "text", readonly: true },
  { name: "category", title: "mobile.channels.field.category", format: "text", readonly: true },
  { name: "capabilitiesText", title: "mobile.channels.field.capabilities", format: "text", readonly: true },
  { name: "countriesText", title: "mobile.channels.field.countries", format: "text", readonly: true },
];

const CHANNEL_STATE = {
  type: "string",
  enum: ["all", "active", "off", "needs_setup", "error"],
  default: "all",
  "x-titles": {
    all: "mobile.channels.filter.all",
    active: "mobile.channels.filter.active",
    off: "mobile.channels.filter.off",
    needs_setup: "mobile.channels.status.needs_setup",
    error: "mobile.channels.status.error",
  },
};

const TYPE_KIND = {
  type: "string",
  enum: ["recommended", "all"],
  default: "recommended",
  "x-titles": { recommended: "mobile.channels.kind.recommended", all: "mobile.channels.filter.all" },
};

const ID = { type: "string", minLength: 1, maxLength: 100 };

/**
 * What a phone can open: http(s), or a path of this very server. A channel's `url` is whatever an operator
 * typed; a line that can only answer «не удалось открыть» is better not drawn.
 */
const OPENABLE = /^(https?:\/\/|\/)/i;

function link(title: string, open: OpenTarget, meta?: string): RecordLink {
  return meta ? { title, meta, open } : { title, open };
}

export function registerChannels(registry: MobileApiRegistry, channels: ChannelsPort): void {
  registry.registerApp({
    id: "channels",
    version: "1.0.0",
    title: "mobile.app.channels.title",
    icon: { path: ICON },
    category: "mobile.category.system",
    home: "channels.list",
    scope: "server",
    models: { channel: { fields: CHANNEL_FIELDS }, channelType: { fields: TYPE_FIELDS } },
  });

  const mayManage = (ctx: MethodContext) => Promise.all([ctx.can(LEGACY), ctx.can(MANAGE)]).then(([legacy, write]) => legacy || write);

  /** The catalog of «Система» opens to look at; installing from it is the right the page asks for. */
  const mayInstall = async (ctx: MethodContext) => (await ctx.canOpen(CATALOG.method)) && ctx.can(INSTALL);

  /**
   * The lines at the bottom of a card — the buttons of the page: «Настроить» until the provider says ready
   * and «Настройки» after, both to `settingsUrl`, which only somebody who may manage carries; «Открыть» for
   * everybody, the public address of the channel; «Установить провайдера» for whoever may install.
   */
  async function channelLinks(ctx: MethodContext, item: ChannelItem): Promise<RecordLink[]> {
    const links: RecordLink[] = [];
    if (item.settingsUrl) {
      links.push(link(ctx.t(item.status === "ready" ? "mobile.channels.link.settings" : "mobile.channels.link.setup"), { url: item.settingsUrl }));
    }
    if (item.url && OPENABLE.test(item.url)) links.push(link(ctx.t("mobile.channels.link.open"), { url: item.url }));
    if (item.marketplaceAppId && !item.providerAlive && (await mayInstall(ctx))) {
      links.push(link(ctx.t("mobile.channels.link.install"), { ...CATALOG, params: { appId: item.marketplaceAppId } }));
    }
    return links;
  }

  /** `TypeActions` of the page: nothing without `manage`, and one next step by the state of the type. */
  async function typeLinks(ctx: MethodContext, type: ChannelTypeItem, canManage: boolean): Promise<RecordLink[]> {
    if (!canManage) return [];
    if (!type.available) {
      if (type.id === "custom" || !(await ctx.canOpen(CATALOG.method))) return [];
      return [link(ctx.t("mobile.channels.link.search"), { ...CATALOG, params: { tags: type.marketplaceTag } })];
    }
    if (!type.installed) {
      if (!type.marketplaceAppId || !(await mayInstall(ctx))) return [];
      return [link(ctx.t("mobile.channels.link.installFromMarketplace"), { ...CATALOG, params: { appId: type.marketplaceAppId } })];
    }
    if (!type.alive || !type.settingsUrl) return [];
    return [link(ctx.t("mobile.channels.link.settings"), { url: type.settingsUrl })];
  }

  registry.registerMethod({
    name: "channels.list",
    app: "channels",
    kind: "query",
    title: "mobile.channels.list.title",
    access: section,
    model: "channel",
    input: {
      type: "object",
      properties: { q: { type: "string", maxLength: 100 }, state: CHANNEL_STATE, cursor: { type: "string", maxLength: 200 } },
    },
    ui: {
      view: "list",
      item: { title: "title", subtitle: "subtitle", meta: "providerText", badge: "status" },
      search: "q",
      chips: "state",
      open: "channels.get",
      empty: "mobile.channels.list.empty",
    },
    handler: async (params: { q?: string; state: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const q = params.q?.trim() || undefined;
      const { items, counts } = await channels.list({
        q,
        state: params.state === "all" ? undefined : params.state,
        canManage: await mayManage(ctx),
        lang: ctx.lang,
      });
      const result = page(items, offset, PAGE_SIZE);
      // The way to the catalog of types: a list has no line of its own, so it is the last row, with a link
      // of its own. On the whole list only — under a filter or a search it would answer a question nobody
      // asked, and it would hide the empty state. With no channel at all it says where they come from.
      if (q || params.state !== "all" || result.nextCursor) return { ...result, counts };
      const row = {
        id: "channel-types",
        title: ctx.t("mobile.channels.types.title"),
        subtitle: ctx.t(items.length ? "mobile.channels.types.hint" : "mobile.channels.list.emptyHint"),
        _open: { method: "channels.types" },
      };
      return { ...result, items: [...result.items, row], counts };
    },
  });

  registry.registerMethod({
    name: "channels.get",
    app: "channels",
    kind: "query",
    title: "mobile.channels.get.title",
    access: section,
    model: "channel",
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: { view: "detail", item: { title: "title", subtitle: "subtitle", badge: "status" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await channels.get(id, { canManage: await mayManage(ctx), lang: ctx.lang });
      if (!item) return ctx.fail("not_found", "No such sales channel");
      return { item: { ...item, _links: await channelLinks(ctx, item) } };
    },
  });

  registry.registerMethod({
    name: "channels.toggle",
    app: "channels",
    kind: "mutation",
    title: "mobile.channels.toggle.title",
    access: manage,
    input: { type: "object", required: ["id", "enabled"], properties: { id: ID, enabled: { type: "boolean" } } },
    ui: {
      view: "action",
      on: "channel",
      placement: ["row", "detail"],
      control: { type: "toggle", param: "enabled", bind: "enabledText" },
    },
    /**
     * No live provider, no switch: the page shows it off and locked, and a locked switch is a switch that
     * is not there. The card still says what is stored (`enabledText`) and why (`providerText`).
     */
    describeItem: (_ctx, record: ChannelItem) => (record?.providerAlive === true ? undefined : false),
    handler: async ({ id, enabled }: { id: string; enabled: boolean }, ctx) => {
      const result = await channels.setEnabled(id, enabled, { canManage: true, lang: ctx.lang });
      if (!result.ok) {
        if ("notFound" in result) return ctx.fail("not_found", "No such sales channel");
        // The refusal of the rule, in words — "Finish setup first" plus what the provider itself said.
        return ctx.fail("conflict", result.message, { details: result.details });
      }
      return { item: { ...result.item, _links: await channelLinks(ctx, result.item) } };
    },
    audit: ({ id, enabled }) => ({ record: id, params: { enabled } }),
  });

  registry.registerMethod({
    name: "channels.delete",
    app: "channels",
    kind: "mutation",
    title: "mobile.channels.delete.title",
    access: manage,
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: {
      view: "action",
      on: "channel",
      placement: ["detail"],
      control: { type: "buttons" },
      confirm: "mobile.channels.delete.confirm",
    },
    /** A provider's channel is only switched off while its module is installed (core's rule). */
    describeItem: (_ctx, record: ChannelItem) => (record?.canDelete === true ? undefined : false),
    handler: async ({ id }: { id: string }, ctx) => {
      const result = await channels.remove(id, ctx.lang);
      if (!result.ok) {
        if ("notFound" in result) return ctx.fail("not_found", "No such sales channel");
        return ctx.fail("conflict", result.message, { details: result.details });
      }
      // The key of what is gone travels back: it is what the journal names the record by.
      return { ok: true, id: result.id, key: result.key };
    },
    /** What is gone has to be nameable afterwards: the id and the key, never the provider's secrets. */
    audit: (params, result: { id?: string; key?: string }) => ({ record: params.id, params: { id: params.id, key: result?.key ?? null } }),
  });

  registry.registerMethod({
    name: "channels.types",
    app: "channels",
    kind: "query",
    title: "mobile.channels.types.title",
    access: section,
    model: "channelType",
    input: { type: "object", properties: { kind: TYPE_KIND, cursor: { type: "string", maxLength: 200 } } },
    ui: {
      view: "list",
      item: { title: "title", subtitle: "stateText", badge: "availability" },
      chips: "kind",
      open: "channels.type",
      empty: "mobile.channels.types.empty",
    },
    handler: async (params: { kind: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const canManage = await mayManage(ctx);
      const { items, counts } = await channels.types({ kind: params.kind, canManage, lang: ctx.lang });
      const result = page(items, offset, PAGE_SIZE);
      // «Все каналы продаж в маркетплейсе»: the page has it as a button of its header, a list has rows.
      if (result.nextCursor || !canManage || !(await mayInstall(ctx))) return { ...result, counts };
      const row = {
        id: "marketplace",
        title: ctx.t("mobile.channels.link.marketplace"),
        _open: { ...CATALOG, params: { tags: "sales-channel" } },
      };
      return { ...result, items: [...result.items, row], counts };
    },
  });

  registry.registerMethod({
    name: "channels.type",
    app: "channels",
    kind: "query",
    title: "mobile.channels.type.title",
    access: section,
    model: "channelType",
    input: { type: "object", required: ["id"], properties: { id: ID } },
    ui: { view: "detail", item: { title: "title", badge: "availability" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const canManage = await mayManage(ctx);
      const type = await channels.type(id, { canManage, lang: ctx.lang });
      if (!type) return ctx.fail("not_found", "No such channel type");
      return { item: { ...type, _links: await typeLinks(ctx, type, canManage) } };
    },
  });
}
