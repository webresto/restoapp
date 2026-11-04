import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Настройки» — the Settings page of the admin panel, on the phone: the 107 settings of this
 * server, their types, their schemas and their values.
 *
 * One to one with `/admin/settings-manager`, which is core's own page: the same list sorted by key,
 * the same search over key, name and module, the same editor per type, the same `enum` as a list of
 * choices, the same sentence when a value breaks a rule, the same refusal to touch a setting the
 * application owns or the environment pins, the same secret that is written and never read, the
 * same "restart to apply" reminder. The words and the rules all come from
 * `@webresto/core/lib/settings/view` (C24), so the two doors cannot drift apart.
 *
 * The one thing a declaration cannot describe is the editor of the value itself: every setting
 * carries a JSON Schema of its own, and a form over a schema that arrives *with the record* is not
 * something `ui` can spell. So the list and the card are a declaration, as everywhere else, and the
 * editor is a screen the client draws — `control: {type: "native", screen: "setting-editor"}`, the
 * way the editor of a promotion is done («Маркетинг», Q43). The record carries its schema along
 * with its value, and the native screen reads the record whole, so the contract needs nothing new.
 *
 * Two things the list sends as words rather than as values: `valueText` and `state`. A row of a list
 * has one badge and a field has one format for the whole model, while the value of a setting is a
 * flag here, a number there and an array of objects next door. The words are counted where the
 * rules are, which is the only place that knows them — and `value` itself travels along, for the
 * editor.
 */

/** One setting as core's `describeSetting` reports it — the shape `lib/settings/view.ts` owns. */
export interface SettingRow {
  id: number;
  key: string;
  name: string | null;
  description: string | null;
  tooltip: string | null;
  type: string;
  secret: boolean;
  hasValue: boolean;
  value: unknown;
  defaultValue: unknown;
  jsonSchema: unknown;
  patternHint: string | null;
  uiSchema: unknown;
  readOnly: boolean;
  isRequired: boolean;
  restartRequired: boolean;
  module: string | null;
  envOverride: { valid: boolean } | null;
}

export interface ApplyAnswer {
  ok: boolean;
  item?: SettingRow;
  reason?: "not_found" | "read_only" | "env" | "invalid";
  message?: string;
}

export interface TransferEntry {
  key: string;
  value: unknown;
}

export interface SettingsPort {
  /** Every setting, by key ascending. */
  list(): Promise<SettingRow[]>;
  get(key: string): Promise<SettingRow | null>;
  /** The schema has the last word, and its complaint comes back as a sentence in `lang`. */
  update(key: string, value: unknown, lang: string): Promise<ApplyAnswer>;
  dump(): Promise<{ exportedAt: string; count: number; settings: Array<Record<string, unknown>> }>;
  diff(entries: TransferEntry[]): Promise<Array<Record<string, unknown>>>;
  apply(entries: TransferEntry[], keys: string[], lang: string): Promise<Array<Record<string, unknown>>>;
  /** This run of the server: a "restart to apply" reminder of another run is stale. */
  boot(): string;
}

export const PAGE_SIZE = 50;

/** One token for looking and for writing, the same one the web page is behind (`manifest.ts:556`). */
const access = { token: "settings-manager" };

/** Material Symbols "settings", 24×24. */
const ICON =
  "M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z";

const TYPE_TITLES = {
  string: "mobile.settings.type.string",
  number: "mobile.settings.type.number",
  boolean: "mobile.settings.type.boolean",
  json: "mobile.settings.type.json",
};

const FIELDS = [
  { name: "type", title: "mobile.settings.field.type", format: "enum", readonly: true, "x-titles": TYPE_TITLES },
  { name: "valueText", title: "mobile.settings.field.value", format: "text", readonly: true },
  { name: "defaultText", title: "mobile.settings.field.default", format: "text", readonly: true },
  { name: "state", title: "mobile.settings.field.state", format: "text", readonly: true },
  { name: "module", title: "mobile.settings.field.module", format: "text", readonly: true },
  { name: "description", title: "mobile.settings.field.description", format: "text", readonly: true, section: "mobile.settings.section.about" },
  { name: "tooltip", title: "mobile.settings.field.tooltip", format: "text", readonly: true, section: "mobile.settings.section.about" },
];

const KIND = {
  type: "string",
  enum: ["all", "changed", "env", "restart"],
  default: "all",
  "x-titles": {
    all: "mobile.settings.filter.all",
    changed: "mobile.settings.filter.changed",
    env: "mobile.settings.filter.env",
    restart: "mobile.settings.filter.restart",
  },
};

/** How much of a composite value is worth putting in a row of a list before it stops being read. */
const VALUE_TEXT_LIMIT = 40;

const same = (a: unknown, b: unknown) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * The value this server actually reads: `Settings.get` falls back to the default, so a setting
 * whose own value was never set is not empty — it works off its default, and a list that said «—»
 * about it would be lying.
 */
function effective(row: SettingRow): unknown {
  return row.value === null || row.value === undefined ? row.defaultValue : row.value;
}

/** Whether an operator has moved this setting off what it was declared with. */
function isChanged(row: SettingRow): boolean {
  if (row.secret) return row.hasValue;
  if (!row.hasValue) return false;
  return row.defaultValue === null || row.defaultValue === undefined ? true : !same(row.value, row.defaultValue);
}

/**
 * A value as one line of words.
 *
 * `boolean` is «Да» / «Нет», as the two radio buttons of the web are; a secret is dots, because its
 * value never left the database; an array of short scalars reads better written out («RU, KZ») than
 * counted, and anything bigger is counted, because a row of a list is one line.
 */
function valueText(value: unknown, row: SettingRow, t: (key: string) => string): string {
  if (row.secret) return row.hasValue ? "••••••••" : t("mobile.settings.value.empty");
  if (value === null || value === undefined || value === "") return t("mobile.settings.value.empty");
  if (typeof value === "boolean") return t(value ? "mobile.settings.value.yes" : "mobile.settings.value.no");
  if (typeof value === "number" || typeof value === "string") return String(value);
  if (Array.isArray(value)) {
    if (!value.length) return t("mobile.settings.value.empty");
    const scalars = value.every((item) => item === null || ["string", "number", "boolean"].includes(typeof item));
    const written = scalars ? value.join(", ") : "";
    if (written && written.length <= VALUE_TEXT_LIMIT) return written;
    return `${t("mobile.settings.value.items")}: ${value.length}`;
  }
  const keys = Object.keys(value as object);
  return `${t("mobile.settings.value.fields")}: ${keys.length}`;
}

/**
 * The states of a setting in one line: what the web says with a row of badges.
 *
 * A phone row has one badge and it carries the type, so the rest is a line of its own — and the
 * order is the order of what it means for the operator: what they cannot change comes first.
 */
function stateText(row: SettingRow, t: (key: string) => string): string {
  const parts: string[] = [];
  if (row.readOnly) parts.push(t("mobile.settings.state.readOnly"));
  // Not a state of the web's row of badges, but the one thing a single line of value cannot say:
  // whether what is shown was chosen by an operator or is what the setting was declared with.
  if (!row.secret && !row.hasValue && row.defaultValue !== null && row.defaultValue !== undefined) {
    parts.push(t("mobile.settings.state.fromDefault"));
  }
  if (row.envOverride) parts.push(t(row.envOverride.valid ? "mobile.settings.state.env" : "mobile.settings.state.envInvalid"));
  if (row.secret) parts.push(t("mobile.settings.state.secret"));
  if (row.restartRequired) parts.push(t("mobile.settings.state.restart"));
  if (row.isRequired) parts.push(t("mobile.settings.state.required"));
  if (row.module) parts.push(row.module);
  return parts.join(" · ");
}

/** What the renderer shows in a row and in a card: words, and nothing a schema would blow up. */
function item(row: SettingRow, t: (key: string) => string) {
  return {
    id: row.key,
    key: row.key,
    name: row.name,
    type: row.type,
    valueText: valueText(effective(row), row, t),
    defaultText: row.secret ? "" : valueText(row.defaultValue, { ...row, secret: false }, t),
    state: stateText(row, t),
    module: row.module,
    description: row.description,
    // The tooltip of a setting repeats its description more often than not; saying it twice in one
    // card is noise, so it is shown only when it adds something.
    tooltip: row.tooltip && row.tooltip !== row.description ? row.tooltip : null,
  };
}

/**
 * The card: the words of the row, and everything the native editor needs — the value itself, its
 * schema, the human wording of its `pattern`, and the three states that decide whether it may be
 * written at all. None of it is a declared field, so the renderer shows none of it; the editor
 * reads the record whole.
 */
function card(row: SettingRow, boot: string, t: (key: string) => string) {
  return {
    ...item(row, t),
    value: row.secret ? null : row.value,
    defaultValue: row.secret ? null : row.defaultValue,
    jsonSchema: row.jsonSchema,
    patternHint: row.patternHint,
    secret: row.secret,
    hasValue: row.hasValue,
    readOnly: row.readOnly,
    isRequired: row.isRequired,
    restartRequired: row.restartRequired,
    envOverride: row.envOverride,
    boot,
  };
}

const matches = (row: SettingRow, q: string) =>
  [row.key, row.name ?? "", row.module ?? ""].some((text) => text.toLowerCase().includes(q));

const ofKind = (row: SettingRow, kind: string) => {
  switch (kind) {
    case "changed": return isChanged(row);
    case "env": return Boolean(row.envOverride);
    case "restart": return row.restartRequired;
    default: return true;
  }
};

export function registerSettings(registry: MobileApiRegistry, settings: SettingsPort): void {
  registry.registerApp({
    id: "settings",
    version: "1.0.0",
    title: "mobile.app.settings.title",
    icon: { path: ICON },
    category: "mobile.category.system",
    home: "settings.list",
    scope: "server",
    models: { setting: { fields: FIELDS } },
  });

  registry.registerMethod({
    name: "settings.list",
    app: "settings",
    kind: "query",
    title: "mobile.settings.list.title",
    access,
    model: "setting",
    input: {
      type: "object",
      properties: {
        q: { type: "string", maxLength: 100 },
        kind: KIND,
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "key", subtitle: "name", meta: "state", value: "valueText", badge: "type" },
      search: "q",
      chips: "kind",
      open: "settings.get",
      empty: "mobile.settings.empty",
    },
    handler: async (params: { q?: string; kind: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const q = params.q?.trim().toLowerCase();
      // The search runs over key, name and module, without case — `settings-manager.jsx:712`.
      const found = (await settings.list()).filter((row) => !q || matches(row, q));
      // The chips count what the search found, so the numbers answer "and of these, how many".
      const counts = {
        all: found.length,
        changed: found.filter((row) => ofKind(row, "changed")).length,
        env: found.filter((row) => ofKind(row, "env")).length,
        restart: found.filter((row) => ofKind(row, "restart")).length,
      };
      const rows = found.filter((row) => ofKind(row, params.kind)).map((row) => item(row, ctx.t));
      return { ...page(rows, offset, PAGE_SIZE), counts };
    },
  });

  registry.registerMethod({
    name: "settings.get",
    app: "settings",
    kind: "query",
    title: "mobile.settings.get.title",
    access,
    model: "setting",
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    ui: { view: "detail", item: { title: "key", subtitle: "name", badge: "type" } },
    handler: async ({ id }: { id: string }, ctx: MethodContext) => {
      const row = await settings.get(id);
      if (!row) return ctx.fail("not_found", "No such setting");
      return { item: card(row, settings.boot(), ctx.t) };
    },
  });

  registry.registerMethod({
    name: "settings.update",
    app: "settings",
    kind: "mutation",
    title: "mobile.settings.update.title",
    access,
    input: {
      type: "object",
      required: ["id", "value"],
      properties: {
        id: { type: "string", minLength: 1, maxLength: 100 },
        // Any JSON: the shape of a value is the setting's own schema, and the schema has the last
        // word on the server (core's Ajv), never this one.
        value: {},
      },
    },
    ui: { view: "action", on: "setting", placement: ["detail"], control: { type: "native", screen: "setting-editor" } },
    // A setting the application owns, or one the environment pins, has no action at all — the same
    // answer the web gives by disabling its editor, and the server refuses such a write anyway.
    describeItem: (_ctx, record: { readOnly?: boolean; envOverride?: unknown }) =>
      record?.readOnly || record?.envOverride ? false : undefined,
    handler: async ({ id, value }: { id: string; value: unknown }, ctx: MethodContext) => {
      const applied = await settings.update(id, value, ctx.lang);
      if (!applied.ok) {
        if (applied.reason === "not_found") return ctx.fail("not_found", applied.message);
        if (applied.reason === "invalid") return ctx.fail("invalid", applied.message);
        return ctx.fail("forbidden", applied.message);
      }
      return { item: card(applied.item!, settings.boot(), ctx.t) };
    },
    // The key is worth remembering; the value of a secret is not, and neither is a value of the size
    // of `TZ`'s list — the journal keeps what was touched, the row keeps what it now is.
    audit: (params: { id: string; value: unknown }, result: { item?: { secret?: boolean } }) => ({
      record: params?.id ?? null,
      params: result?.item?.secret ? {} : { value: params?.value },
    }),
  });

  registry.registerMethod({
    name: "settings.dump",
    app: "settings",
    kind: "query",
    title: "mobile.settings.dump.title",
    access,
    input: { type: "object", properties: {} },
    // No `ui`: an action can only be a mutation (`Screens.kt:92`), and this is a read. The transfer
    // screen calls it itself.
    handler: () => settings.dump(),
  });

  registry.registerMethod({
    name: "settings.transfer",
    app: "settings",
    kind: "mutation",
    title: "mobile.settings.transfer.title",
    access,
    input: {
      type: "object",
      required: ["settings"],
      properties: {
        settings: {
          type: "array",
          maxItems: 500,
          items: {
            type: "object",
            additionalProperties: false,
            required: ["key"],
            properties: { key: { type: "string", minLength: 1, maxLength: 100 }, value: {} },
          },
        },
        keys: { type: "array", maxItems: 500, items: { type: "string", minLength: 1, maxLength: 100 } },
        /** Reading, dressed as a mutation: an action can only be a mutation. */
        preview: { type: "boolean", default: false },
      },
    },
    ui: { view: "action", on: "list", placement: ["list"], control: { type: "native", screen: "setting-transfer" } },
    handler: async (params: { settings: TransferEntry[]; keys?: string[]; preview: boolean }, ctx: MethodContext) => {
      if (params.preview) return { diff: await settings.diff(params.settings) };
      const keys = params.keys ?? [];
      if (!keys.length) return ctx.fail("invalid", "No keys selected for import");
      return { results: await settings.apply(params.settings, keys, ctx.lang) };
    },
    // What came in the file is not the journal's business; which keys were applied is.
    audit: (params: { keys?: string[]; preview?: boolean }) => ({
      record: null,
      params: params?.preview ? {} : { keys: params?.keys ?? [] },
    }),
  });
}
