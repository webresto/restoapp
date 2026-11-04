import type { FieldDefinition, MethodContext, MobileApiRegistry, OpenTarget, RecordLink } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Система» — the administrator's central place on the phone: which server this is, what it is built
 * of, what was installed into it, and the doors into «Настройки» and «Каналы продаж» (`system.plan.md`,
 * Q57). In the admin panel the same matter is spread over three pages of the left menu — "Settings",
 * "Extensions" and "Sales Channels" — and the phone has no left menu, so the home screen of this app
 * is that menu: the card of the server with links out of it.
 *
 * What is here: the home screen, reading the programs, the restart, the marketplace, and installing,
 * updating and removing as jobs a phone can watch (`module-progress`, plan C). The switch, the
 * migrations and the wizard are the slices after it; what is not there yet is simply not declared,
 * so a client never draws a button that answers 501.
 *
 * Entry is `anyOf` of the four tokens the three places already use (Q58), so «Система» is visible to
 * anybody who leads any one of them, and each link is checked on its own with `ctx.canOpen` — no
 * right, no line; no app, no line either (the home screen promises only what opens).
 *
 * Everything this app knows about a module comes from `adapters/system.ts` — the only file that
 * knows Waterline and `sails.hooks['app-manager-proto']`. The adapter counts and reads; the words
 * are the app's own, as in «Маркетинг»: a badge of a row is composed here from a state code and a
 * version, because the client translates only the keys of a declaration, never data.
 */

// ---- what the screens show ----

/** The card of the server: the home screen of «Система» (one record, model `serverCard`). */
export interface ServerState {
  id: string;
  /** Data, not a key: the name of this server and its version line. */
  title: string;
  subtitle: string;
  version: string | null;
  timezone: string | null;
  currency: string | null;
  /** What the installation is built of (`MM_SYSTEM_MODULES`) and what was installed into it. */
  systemCount: number;
  installedCount: number;
  disabledCount: number;
  updatesCount: number;
  /** Modules whose migrations on disk are not the migrations the database has processed. */
  migrationsPending: number;
  /** The restart of the application, as the worker that answered knows it. */
  restartScheduled: boolean;
  restartAt: number | null;
  /** A restart was ordered and the processes are going down: the server is about to not answer. */
  restarting: boolean;
  /** An install wizard holds the admin panel; `/api/mobile` is outside its policy (C39, Q59). */
  wizardActive: boolean;
  wizardTotal: number;
  wizardLeft: number;
  wizardCurrent: string | null;
  wizardRenderer: string | null;
  /** Without `WEBRESTO_LICENSE` the marketplace answers nothing and no version is checked. */
  licensed: boolean;
  /** Composed by the app from the facts above: the lines a person reads on the card. */
  restartText?: string;
  migrationsText?: string;
  wizardText?: string;
  marketplaceText?: string;
}

/** A program of this server, as a row of the list (model `module`). */
export interface ModuleItem {
  /** `appId` — the primary key of `Module` and the id a row opens with. */
  id: string;
  name: string;
  appId: string;
  version: string | null;
  latestVersion: string | null;
  updateAvailable: boolean;
  kind: "system" | "installed";
  enable: boolean;
  /** Loaded in the process that answered: a module installed by another worker is not, until a restart. */
  loaded: boolean;
  /**
   * One word for the row, worst first: `migrations` (broken), `disabled`, `not-loaded`, `update`,
   * `system`, `ok`. The app turns it into the badge, because «Обновление 1.8.3» carries data.
   */
  state: string;
  stateText?: string;
  description: string;
}

/** The card of a program: everything the manager knows about it without asking the marketplace. */
export interface ModuleCard extends ModuleItem {
  hookName: string;
  directoryName: string;
  author: string;
  license: string;
  keywords: string;
  repository: string;
  /** Words, as the card shows them: "simple-navigation, @webresto/core". */
  dependencies: string;
  dependents: string;
  dependentsList: string[];
  /** Files in `migrations/` of the module against `Module.migrationsCount` the database holds. */
  migrationsFiles: number;
  migrationsProcessed: number | null;
  migrationsResult: string;
  migrationsPending: boolean;
  /** false on anything but postgres: the manager runs no migration there at all. */
  migrationsSupported: boolean;
  /** Required settings of the module with neither a value nor a default: what blocks the wizard. */
  unfilledSettings: number;
  /** Why this program cannot be removed: `system`, `forbidden` (its own `forbidDelete`), `dependents`. */
  removeBlock: string | null;
  migrationsText?: string;
  settingsText?: string;
  removeText?: string;
}

/** A module of the marketplace, as the catalog and its card show it. */
export interface CatalogItem {
  /** `appId`: the id a row opens with, and what the install is asked for. */
  id: string;
  appId: string;
  name: string;
  teaser: string;
  description: string;
  author: string;
  tags: string;
  latestVersion: string;
  /** The word for why it cannot be installed: `installed`, `license`, `download`; null — it can. */
  block: "installed" | "license" | "download" | null;
  stateText?: string;
}

/** What the manager says about a job: `helpers/moduleJobs.js`. */
export interface ModuleJob {
  id: string;
  kind: "install" | "update" | "remove";
  appId: string;
  state: "running" | "done" | "failed";
  step: string;
  log: string[];
  error: { reason: string; message: string; details: any } | null;
  restartScheduled: boolean;
}

/** Why a job was not started; thrown by the port, turned into words here. */
export interface JobRefusal {
  refusal: true;
  reason: string;
  message: string;
  details: any;
}

export interface SystemPort {
  /** The facts of the server and the counts of its programs. */
  server(): Promise<ServerState>;
  modules(query: { q?: string; kind?: string }): Promise<{ items: ModuleItem[]; counts: Record<string, number> }>;
  module(appId: string): Promise<ModuleCard | null>;
  /** Plans the restart for the midnight of the server, or orders it at once; planning twice is planning once. */
  restart(when: "midnight" | "now"): Promise<void>;
  /** The marketplace without what is installed; null — it did not answer. */
  catalog(query: { q?: string; appId?: string; tags?: string }): Promise<CatalogItem[] | null>;
  catalogItem(appId: string): Promise<CatalogItem | null>;
  /** Starts the job, or comes back to the one going for this module; throws a `JobRefusal`. */
  startJob(kind: ModuleJob["kind"], appId: string): Promise<ModuleJob>;
  job(id: string): Promise<ModuleJob | null>;
}

export const PAGE_SIZE = 50;

/** The right of the "Extensions" page: the list, the catalog, the jobs and the restart (Q58). */
export const MODULES_TOKEN = "modules-process-upgrade";
/** The rights of the two neighbours; neither app exists yet, and the links check them one by one. */
export const SETTINGS_TOKEN = "settings-manager";
export const CHANNELS_VIEW_TOKEN = "sales-channels-view";
export const CHANNELS_MANAGE_TOKEN = "sales-channels-manage";

/** The home screen is open to whoever leads any one of the three places it leads to. */
const home = { anyOf: [MODULES_TOKEN, SETTINGS_TOKEN, CHANNELS_VIEW_TOKEN, CHANNELS_MANAGE_TOKEN] };
const programs = { token: MODULES_TOKEN };

/** Material Symbols "dns", 24×24: the server itself. */
const ICON =
  "M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z";

const STATE_SPECIALS = [
  { value: "ok", title: "mobile.system.state.ok", tone: "success" },
  { value: "system", title: "mobile.system.state.system", tone: "info" },
  { value: "update", title: "mobile.system.state.update", tone: "warning" },
  { value: "not-loaded", title: "mobile.system.state.not-loaded", tone: "warning" },
  { value: "disabled", title: "mobile.system.state.disabled", tone: "danger" },
  { value: "migrations", title: "mobile.system.state.migrations", tone: "danger" },
];

const SERVER_FIELDS: FieldDefinition[] = [
  { name: "version", title: "mobile.system.field.version", format: "text", readonly: true, section: "mobile.system.section.server" },
  { name: "timezone", title: "mobile.system.field.timezone", format: "text", readonly: true, section: "mobile.system.section.server" },
  { name: "currency", title: "mobile.system.field.currency", format: "text", readonly: true, section: "mobile.system.section.server" },
  { name: "systemCount", title: "mobile.system.field.systemCount", format: "number", readonly: true, section: "mobile.system.section.programs", access: programs },
  { name: "installedCount", title: "mobile.system.field.installedCount", format: "number", readonly: true, section: "mobile.system.section.programs", access: programs },
  { name: "disabledCount", title: "mobile.system.field.disabledCount", format: "number", readonly: true, section: "mobile.system.section.programs", access: programs },
  { name: "updatesCount", title: "mobile.system.field.updatesCount", format: "number", readonly: true, section: "mobile.system.section.programs", access: programs },
  // The state of the server in words: a line a record has not got is not drawn at all, so a server
  // with nothing scheduled, no wizard and no pending migration shows none of them.
  { name: "restartText", title: "mobile.system.field.restart", format: "text", readonly: true, section: "mobile.system.section.state", access: programs },
  { name: "migrationsText", title: "mobile.system.field.migrations", format: "text", readonly: true, section: "mobile.system.section.state", access: programs },
  { name: "wizardText", title: "mobile.system.field.wizard", format: "text", readonly: true, section: "mobile.system.section.state", access: programs },
  { name: "marketplaceText", title: "mobile.system.field.marketplace", format: "text", readonly: true, section: "mobile.system.section.state", access: programs },
];

const MODULE_FIELDS: FieldDefinition[] = [
  { name: "state", title: "mobile.system.field.state", format: "enum", readonly: true, specials: STATE_SPECIALS },
  { name: "description", title: "mobile.system.field.description", format: "text", readonly: true },
  { name: "version", title: "mobile.system.field.version", format: "text", readonly: true, section: "mobile.system.section.version" },
  { name: "latestVersion", title: "mobile.system.field.latestVersion", format: "text", readonly: true, section: "mobile.system.section.version" },
  {
    name: "kind", title: "mobile.system.field.kind", format: "enum", readonly: true, section: "mobile.system.section.version",
    "x-titles": { system: "mobile.system.kind.system", installed: "mobile.system.kind.installed" },
  },
  { name: "enable", title: "mobile.system.field.enable", format: "boolean", readonly: true, section: "mobile.system.section.version" },
  { name: "loaded", title: "mobile.system.field.loaded", format: "boolean", readonly: true, section: "mobile.system.section.version" },
  { name: "migrationsText", title: "mobile.system.field.migrations", format: "text", readonly: true, section: "mobile.system.section.migrations" },
  { name: "settingsText", title: "mobile.system.field.settings", format: "text", readonly: true, section: "mobile.system.section.migrations" },
  { name: "author", title: "mobile.system.field.author", format: "text", readonly: true, section: "mobile.system.section.about" },
  { name: "license", title: "mobile.system.field.license", format: "text", readonly: true, section: "mobile.system.section.about" },
  { name: "keywords", title: "mobile.system.field.keywords", format: "text", readonly: true, section: "mobile.system.section.about" },
  { name: "dependencies", title: "mobile.system.field.dependencies", format: "text", readonly: true, section: "mobile.system.section.links" },
  { name: "dependents", title: "mobile.system.field.dependents", format: "text", readonly: true, section: "mobile.system.section.links" },
  { name: "removeText", title: "mobile.system.field.removeBlock", format: "text", readonly: true, section: "mobile.system.section.links" },
  { name: "hookName", title: "mobile.system.field.hookName", format: "text", readonly: true, section: "mobile.system.section.details" },
  { name: "directoryName", title: "mobile.system.field.directoryName", format: "text", readonly: true, section: "mobile.system.section.details" },
  { name: "repository", title: "mobile.system.field.repository", format: "text", readonly: true, section: "mobile.system.section.details" },
];

/** The chips of the list and the keys of its counts; «Все» is not a filter but the whole list. */
const KIND = {
  type: "string",
  enum: ["all", "installed", "system", "disabled"],
  default: "all",
  "x-titles": {
    all: "mobile.system.filter.all",
    installed: "mobile.system.filter.installed",
    system: "mobile.system.filter.system",
    disabled: "mobile.system.filter.disabled",
  },
};

const APP_ID = { type: "string", minLength: 1, maxLength: 100 };

/** A job's action: `job` given starts nothing, it asks for the record as that job left it — what the screen closes on. */
const JOB_INPUT = {
  type: "object",
  required: ["appId"],
  properties: { appId: APP_ID, job: { type: "string", maxLength: 100 } },
};

const CATALOG_FIELDS: FieldDefinition[] = [
  { name: "name", title: "mobile.system.field.name", format: "text", readonly: true },
  { name: "appId", title: "mobile.system.field.appId", format: "text", readonly: true },
  { name: "stateText", title: "mobile.system.field.state", format: "text", readonly: true },
  { name: "latestVersion", title: "mobile.system.field.latestVersion", format: "text", readonly: true },
  { name: "author", title: "mobile.system.field.author", format: "text", readonly: true },
  { name: "tags", title: "mobile.system.field.tags", format: "text", readonly: true },
  { name: "teaser", title: "mobile.system.field.teaser", format: "text", readonly: true },
  { name: "description", title: "mobile.system.field.description", format: "text", readonly: true },
];

function link(title: string, open: OpenTarget, meta?: string): RecordLink {
  return meta ? { title, meta, open } : { title, open };
}

/** "Программы · 4" — a count belongs in the title of a link, which is data and is not translated. */
function counted(title: string, count: number): string {
  return `${title} · ${count}`;
}

/**
 * The two things the restart can be asked to do. A string and not the `now: boolean` of the plan
 * (C49): the client draws the buttons of an action from the `enum` of one parameter, and a button
 * sends the *string* it was drawn from.
 */
const WHEN = {
  type: "string",
  enum: ["midnight", "now"],
  "x-titles": { midnight: "mobile.system.restart.midnight", now: "mobile.system.restart.now" },
};

function restartInput(whens: string[] = ["midnight", "now"]): Record<string, any> {
  return {
    type: "object",
    required: ["when"],
    properties: { when: { ...WHEN, enum: whens } },
  };
}

export function registerSystem(registry: MobileApiRegistry, system: SystemPort): void {
  registry.registerApp({
    id: "system",
    version: "1.0.0",
    title: "mobile.app.system.title",
    icon: { path: ICON },
    category: "mobile.category.system",
    home: "system.home",
    scope: "server",
    models: {
      serverCard: { fields: SERVER_FIELDS },
      module: { fields: MODULE_FIELDS },
      catalogItem: { fields: CATALOG_FIELDS },
    },
  });

  // ---- the home screen: which server this is and where to go from here ----

  registry.registerMethod({
    name: "system.home",
    app: "system",
    kind: "query",
    title: "mobile.system.home.title",
    access: home,
    model: "serverCard",
    input: { type: "object", properties: {} },
    // No badge: the card of a server has no one word for its state — what is going on with it is
    // said by the lines of «Что сейчас», and a badge with nothing in it draws «—».
    ui: { view: "detail", item: { title: "title", subtitle: "subtitle" } },
    handler: async (_params: Record<string, never>, ctx: MethodContext) => ({ item: await serverCard(ctx) }),
  });

  /** The card of the server as this person may read it: the home screen, and the answer of the restart. */
  async function serverCard(ctx: MethodContext) {
      const item = await system.server();
      const mayPrograms = await ctx.can(MODULES_TOKEN);
      // The state of the server is the business of whoever may change it: a person who only leads
      // the settings is not told that a restart is scheduled, because they cannot act on it.
      if (mayPrograms) {
        if (item.restarting) item.restartText = ctx.t("mobile.system.restart.restarting");
        else if (item.restartScheduled) item.restartText = ctx.t("mobile.system.restart.scheduled");
        if (item.migrationsPending > 0) {
          item.migrationsText = `${ctx.t("mobile.system.migrations.pending")} · ${item.migrationsPending}`;
        }
        if (item.wizardActive) {
          // Slice A tells the truth and nothing more (Q59): the admin panel is locked by a wizard,
          // and walking its steps from the phone is slice E.
          item.wizardText = `${ctx.t("mobile.system.wizard.active")} · ${item.wizardLeft}`;
        }
        if (!item.licensed) item.marketplaceText = ctx.t("mobile.system.marketplace.noLicense");
      }
      return { ...item, _links: await homeLinks(ctx, item, mayPrograms) };
  }

  /**
   * The three doors of the central place. Each is built only after `ctx.canOpen` says this person
   * could walk through it: the method has to be registered — so an app this server does not have
   * leaves no dead line on the screen — and available to them.
   */
  async function homeLinks(ctx: MethodContext, item: ServerState, mayPrograms: boolean): Promise<RecordLink[]> {
    const links: RecordLink[] = [];
    if (mayPrograms && (await ctx.canOpen("system.modules"))) {
      links.push(link(counted(ctx.t("mobile.system.link.modules"), item.systemCount + item.installedCount), { method: "system.modules" }));
    }
    if (mayPrograms && (await ctx.canOpen("system.catalog"))) {
      links.push(link(ctx.t("mobile.system.link.catalog"), { method: "system.catalog" }));
    }
    if (await ctx.canOpen("settings.list")) {
      links.push(link(ctx.t("mobile.system.link.settings"), { app: "settings", method: "settings.list" }));
    }
    if (await ctx.canOpen("channels.list")) {
      links.push(link(ctx.t("mobile.system.link.channels"), { app: "channels", method: "channels.list" }));
    }
    return links;
  }

  // ---- the restart: «Перезапуск запланирован» → «Перезапустить сейчас» ----

  registry.registerMethod({
    name: "system.restart",
    app: "system",
    kind: "mutation",
    title: "mobile.system.restart.title",
    access: programs,
    input: restartInput(),
    ui: {
      view: "action",
      on: "serverCard",
      placement: ["detail"],
      // The client asks «you sure?» before a button of a `danger` tone, and only before that one:
      // planning for the night is harmless, restarting now drops the connection of everybody.
      control: { type: "buttons", param: "when", tones: { now: "danger" } },
      confirm: "mobile.system.restart.confirm",
    },
    // A restart that is planned is not planned again, and one that is going cannot be ordered twice:
    // the card offers what can still be done, and the same schema is what the call is validated against.
    describeItem: (_ctx, record: ServerState) => {
      if (record?.restarting) return false;
      if (record?.restartScheduled) return { input: restartInput(["now"]) };
      return undefined;
    },
    handler: async ({ when }: { when: "midnight" | "now" }, ctx) => {
      await system.restart(when);
      return { item: await serverCard(ctx) };
    },
    audit: ({ when }) => ({ record: "server", params: { when } }),
  });

  // ---- the programs of this server ----

  registry.registerMethod({
    name: "system.modules",
    app: "system",
    kind: "query",
    title: "mobile.system.modules.title",
    access: programs,
    model: "module",
    input: {
      type: "object",
      properties: { q: { type: "string", maxLength: 100 }, kind: KIND, cursor: { type: "string", maxLength: 200 } },
    },
    ui: {
      view: "list",
      item: { title: "name", subtitle: "appId", value: "version", badge: "stateText" },
      search: "q",
      chips: "kind",
      open: "system.module",
      empty: "mobile.system.modules.empty",
    },
    handler: async (params: { q?: string; kind: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const { items, counts } = await system.modules({
        q: params.q?.trim() || undefined,
        kind: params.kind === "all" ? undefined : params.kind,
      });
      return { ...page(items.map((item) => withState(ctx, item)), offset, PAGE_SIZE), counts };
    },
  });

  registry.registerMethod({
    name: "system.module",
    app: "system",
    kind: "query",
    title: "mobile.system.module.title",
    access: programs,
    model: "module",
    input: { type: "object", required: ["id"], properties: { id: APP_ID } },
    ui: { view: "detail", item: { title: "name", subtitle: "appId", badge: "stateText" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await system.module(id);
      if (!item) return ctx.fail("not_found", "No such module");
      return { item: withCardWords(ctx, item) };
    },
  });

  // ---- the marketplace ----

  registry.registerMethod({
    name: "system.catalog",
    app: "system",
    kind: "query",
    title: "mobile.system.catalog.title",
    access: programs,
    model: "catalogItem",
    input: {
      type: "object",
      // `appId` and `tags` are how another app leads here: «Каналы продаж» opens the catalog on one
      // provider, on the tag of a channel type, or on every channel there is.
      properties: { q: { type: "string", maxLength: 100 }, appId: APP_ID, tags: { type: "string", maxLength: 200 }, cursor: { type: "string", maxLength: 200 } },
    },
    ui: {
      view: "list",
      item: { title: "name", subtitle: "teaser", value: "latestVersion", badge: "stateText" },
      search: "q",
      open: "system.catalogItem",
      empty: "mobile.system.catalog.empty",
    },
    handler: async (params: { q?: string; appId?: string; tags?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const items = await system.catalog({ q: params.q?.trim() || undefined, appId: params.appId, tags: params.tags });
      if (!items) return ctx.fail("unavailable", ctx.t("mobile.system.catalog.failed"));
      return page(items.map((item) => catalogWords(ctx, item)), offset, PAGE_SIZE);
    },
  });

  registry.registerMethod({
    name: "system.catalogItem",
    app: "system",
    kind: "query",
    title: "mobile.system.catalogItem.title",
    access: programs,
    model: "catalogItem",
    input: { type: "object", required: ["id"], properties: { id: APP_ID } },
    ui: { view: "detail", item: { title: "name", subtitle: "appId", badge: "stateText" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await system.catalogItem(id);
      if (!item) return ctx.fail("not_found", ctx.t("mobile.system.catalog.gone"));
      return { item: catalogWords(ctx, item) };
    },
  });

  function catalogWords(ctx: MethodContext, item: CatalogItem): CatalogItem {
    // A word for every row: a badge with nothing in it draws «—».
    return known({ ...item, stateText: ctx.t(`mobile.system.catalog.block.${item.block ?? "none"}`) });
  }

  // ---- the jobs: install, update, remove ----

  /** The record a job's action answers with: it starts the job, and the screen closes on it again. */
  async function recordOf(kind: ModuleJob["kind"], appId: string, ctx: MethodContext): Promise<Record<string, any>> {
    if (kind === "install") {
      const item = await system.catalogItem(appId);
      return item ? catalogWords(ctx, item) : { id: appId, appId, name: appId };
    }
    const card = await system.module(appId);
    if (card) return withCardWords(ctx, card);
    return { id: appId, appId, name: appId, state: "removed", stateText: ctx.t("mobile.system.state.removed") };
  }

  function refused(ctx: MethodContext, refusal: JobRefusal): never {
    const words: Record<string, string> = {
      busy: `${ctx.t("mobile.system.refused.busy")}: ${refusal.details?.appId}`,
      installed: ctx.t("mobile.system.refused.installed"),
      not_found: ctx.t("mobile.system.refused.notFound"),
      system: ctx.t("mobile.system.remove.system"),
      forbidden: ctx.t("mobile.system.remove.forbidden"),
      dependents: `${ctx.t("mobile.system.remove.dependents")}: ${(refusal.details?.dependents ?? []).join(", ")}`,
    };
    return ctx.fail(refusal.reason === "not_found" ? "not_found" : "conflict", words[refusal.reason] ?? refusal.message);
  }

  function registerJobAction(
    kind: ModuleJob["kind"],
    on: "catalogItem" | "module",
    describeItem: (record: any) => false | undefined,
    confirm?: string,
  ) {
    registry.registerMethod({
      name: `system.${kind}`,
      app: "system",
      kind: "mutation",
      title: `mobile.system.${kind}.title`,
      access: programs,
      input: JOB_INPUT,
      ui: {
        view: "action",
        on,
        placement: ["detail"],
        control: { type: "native", screen: "module-progress" },
        ...(confirm ? { confirm } : {}),
      },
      describeItem: (_ctx, record) => describeItem(record),
      handler: async ({ appId, job }: { appId: string; job?: string }, ctx) => {
        if (job) return { item: await recordOf(kind, appId, ctx) };
        let started: ModuleJob;
        try {
          started = await system.startJob(kind, appId);
        } catch (error: any) {
          if (error?.refusal === true) return refused(ctx, error);
          throw error;
        }
        return { item: { ...(await recordOf(kind, appId, ctx)), jobId: started.id } };
      },
      // The params of a job and not its log: who put what on the server is what the journal is for.
      audit: ({ appId, job }) => ({ record: appId, params: job ? { job } : {} }),
    });
  }

  registerJobAction("install", "catalogItem", (record) => (record?.block ? false : undefined));
  registerJobAction("update", "module", (record) => (record?.state === "update" ? undefined : false));
  registerJobAction(
    "remove",
    "module",
    (record) => (record?.kind !== "installed" || record?.removeBlock || record?.state === "removed" ? false : undefined),
    "mobile.system.remove.confirm",
  );

  function incompatibleText(ctx: MethodContext, details: any): string {
    const parts: string[] = [];
    if (details?.missingModules?.length) parts.push(`${ctx.t("mobile.system.job.missing")}: ${details.missingModules.join(", ")}`);
    for (const old of details?.outdatedModules ?? []) {
      parts.push(`${ctx.t("mobile.system.job.needs")} ${old.module} ≥ ${old.requiredVersion}, ${ctx.t("mobile.system.job.has")} ${old.currentVersion}`);
    }
    return [ctx.t("mobile.system.job.incompatible"), ...parts].join(" ");
  }

  function jobErrorText(ctx: MethodContext, error: NonNullable<ModuleJob["error"]>): string {
    if (error.reason === "license") return ctx.t("mobile.system.job.license");
    if (error.reason === "registry") return ctx.t("mobile.system.job.registry");
    if (error.reason === "incompatible") return incompatibleText(ctx, error.details);
    // The server's own text: it is the only place this failure is ever named.
    return `${ctx.t("mobile.system.job.failed")}: ${error.message}`;
  }

  registry.registerMethod({
    name: "system.job",
    app: "system",
    kind: "query",
    title: "mobile.system.job.title",
    access: programs,
    input: { type: "object", required: ["id"], properties: { id: { type: "string", maxLength: 100 } } },
    handler: async ({ id }: { id: string }, ctx) => {
      const job = await system.job(id);
      // Jobs live in the memory of the process: a server that restarted does not remember this one.
      if (!job) return ctx.fail("not_found", ctx.t("mobile.system.job.gone"));
      return {
        item: {
          id: job.id,
          kind: job.kind,
          appId: job.appId,
          state: job.state,
          title: `${ctx.t(`mobile.system.job.kind.${job.kind}`)}: ${job.appId}`,
          stepText: ctx.t(`mobile.system.job.step.${job.step}`),
          log: job.log.slice(-20).join("\n"),
          ...(job.state === "done" ? { doneText: ctx.t(`mobile.system.job.done.${job.kind}`) } : {}),
          ...(job.error ? { errorText: jobErrorText(ctx, job.error) } : {}),
          // The request for a restart: new code is not running until the process comes back.
          ...(job.restartScheduled
            ? { restartText: ctx.t("mobile.system.restart.scheduled"), restartConfirm: ctx.t("mobile.system.restart.confirm") }
            : {}),
        },
      };
    },
  });

  /** The badge of a row: the state as a word, and the version an update would bring. */
  function withState<T extends ModuleItem>(ctx: MethodContext, item: T): T {
    const text =
      item.state === "update" && item.latestVersion
        ? `${ctx.t("mobile.system.state.update")} ${item.latestVersion}`
        : ctx.t(`mobile.system.state.${item.state}`);
    return { ...item, stateText: text };
  }

  /**
   * A card without the lines nobody can fill in: a key the record does not carry at all is not drawn,
   * and an empty «Зависит от» says less than nothing (the renderer's own rule, `Screens.kt`).
   */
  function known<T extends Record<string, any>>(record: T): T {
    return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== "")) as T;
  }

  /** The lines of a card that are sentences rather than values: migrations, settings, the refusal to remove. */
  function withCardWords(ctx: MethodContext, card: ModuleCard): ModuleCard {
    const item = withState(ctx, card);
    if (!item.migrationsSupported) {
      if (item.migrationsFiles > 0) item.migrationsText = ctx.t("mobile.system.migrations.unsupported");
    } else if (item.migrationsPending) {
      item.migrationsText = `${ctx.t("mobile.system.migrations.pending")}: ${item.migrationsProcessed ?? 0} / ${item.migrationsFiles}`;
    } else if (item.migrationsFiles > 0) {
      item.migrationsText = `${ctx.t("mobile.system.migrations.done")}: ${item.migrationsFiles}`;
    }
    // The text of the last run is the server's own: it is shown as it is, because it is the only
    // place a failed migration of a module is ever named.
    if (item.migrationsResult) item.migrationsText = [item.migrationsText, item.migrationsResult].filter(Boolean).join(" — ");
    if (item.unfilledSettings > 0) {
      item.settingsText = `${ctx.t("mobile.system.settings.unfilled")} · ${item.unfilledSettings}`;
    }
    // Why removal is refused is told on the card before any button exists (C44 is slice C): a person
    // who cannot remove a program should read why, not meet a 409 later.
    if (item.removeBlock === "system") item.removeText = ctx.t("mobile.system.remove.system");
    if (item.removeBlock === "forbidden") item.removeText = ctx.t("mobile.system.remove.forbidden");
    if (item.removeBlock === "dependents") {
      item.removeText = `${ctx.t("mobile.system.remove.dependents")}: ${item.dependents}`;
    }
    return known(item);
  }
}
