import type { ChannelItem, ChannelTypeItem, ChannelsPort, RemovedChannel, ToggledChannel } from "../apps/channels";

/**
 * «Каналы продаж» on core's own sales-channel layer.
 *
 * Nothing is decided here. Which channels there are, whether a provider is installed and alive, what its
 * readiness is now, why a channel may not be switched on or deleted — all of it is core's answer
 * (`lib/SalesChannelProviders.ts`, `lib/sales-channels/view.ts`, plan C29–C32), the same answer the admin
 * page and the MCP tools get. This adapter only turns it into the records of the declaration.
 *
 * The words come from core as well: the view and the refusals are English phrases that are the i18n keys of
 * the admin panel, and the dictionary of the panel translates them for the language of the request (C31) —
 * the hook's own locales translate five keys of `ui` and nothing else, so a refusal must arrive in words.
 */

declare const SalesChannel: any;
declare const Settings: any;

const CORE = "@webresto/core";

const providersLib = () => require(`${CORE}/lib/SalesChannelProviders`);
const viewLib = () => require(`${CORE}/lib/sales-channels/view`);
const registryLib = () => require(`${CORE}/lib/SalesChannelRegistry`);
const messagesLib = () => require(`${CORE}/lib/adminpanel/src/controller/i18n-messages`);

const dictionaries = new Map<string, Record<string, string>>();

/** The dictionary of the admin panel for this language; the English phrase itself when there is none. */
function words(lang: string): (key: string) => string {
  let dictionary = dictionaries.get(lang);
  if (!dictionary) {
    try {
      const { getAdminpanelMessages, resolveAdminpanelLocale } = messagesLib();
      dictionary = getAdminpanelMessages(resolveAdminpanelLocale(lang)) as Record<string, string>;
    } catch (error) {
      sails.log.warn("«Каналы продаж»: the admin panel dictionary is unavailable, the words stay English", error);
      dictionary = {};
    }
    dictionaries.set(lang, dictionary);
  }
  return (key: string) => dictionary![key] ?? key;
}

function item(view: any): ChannelItem {
  const capabilitiesText = (view.capabilities || []).join(" · ");
  return {
    id: String(view.id),
    key: view.key,
    title: view.title,
    subtitle: view.subtitle,
    type: view.type,
    typeTitle: view.typeTitle,
    category: view.category,
    ...(capabilitiesText ? { capabilitiesText } : {}),
    status: view.status,
    // What the provider said — and only while it is here to say it: for a channel whose provider is
    // not loaded core puts the reason into `statusMessage` as well, and the page shows that reason
    // once, as the notice. Twice on one card would be two lines saying the same thing.
    ...(view.providerAlive && view.statusMessage ? { statusMessage: view.statusMessage } : {}),
    providerText: view.providerText,
    ...(view.providerHint ? { providerHint: view.providerHint } : {}),
    // The switch as the page shows it: a channel without a live provider is shown off, and the stored
    // flag is left exactly as it is.
    enabledText: view.providerAlive ? view.enabled : false,
    conceptsText: view.conceptsText,
    ...(view.countriesText ? { countriesText: view.countriesText } : {}),
    ...(view.platformsText ? { platformsText: view.platformsText } : {}),
    ...(view.url ? { url: view.url } : {}),
    updatedAt: typeof view.updatedAt === "number" ? view.updatedAt : null,
    enabled: view.enabled,
    providerInstalled: view.providerInstalled,
    providerAlive: view.providerAlive,
    typeComingSoon: view.typeComingSoon,
    marketplaceAppId: view.marketplaceAppId,
    settingsUrl: view.settingsUrl,
    canDelete: view.canDelete,
    concepts: view.concepts,
    countries: view.countries,
    platforms: view.platforms,
    defaultConcept: view.defaultConcept,
    allowConceptSwitch: view.allowConceptSwitch,
  };
}

function typeItem(view: any): ChannelTypeItem {
  const capabilitiesText = (view.capabilities || []).join(" · ");
  const countriesText = (view.countries || []).join(" · ");
  return {
    id: view.type,
    title: view.title,
    ...(view.stateText ? { stateText: view.stateText } : {}),
    ...(view.available ? {} : { availability: "coming_soon" as const }),
    category: view.category,
    ...(capabilitiesText ? { capabilitiesText } : {}),
    ...(countriesText ? { countriesText } : {}),
    ...(view.providerModule ? { providerText: view.providerModule } : {}),
    available: view.available,
    installed: view.installed,
    alive: view.alive,
    settingsUrl: view.settingsUrl ?? null,
    marketplaceAppId: view.marketplaceAppId ?? null,
    marketplaceTag: view.marketplaceTag,
  };
}

/** The country of the project, as the page reads it: a hint, so a setting that fails is simply no country. */
async function projectCountry(): Promise<string> {
  try {
    const value = await Settings.get("COUNTRY_ISO");
    return value ? String(value).trim() : "";
  } catch {
    return "";
  }
}

/**
 * A refused rule in words: the human phrase of the page, and after it what the provider itself said —
 * "Finish setup first — Storefront is not built yet". What to do next travels in `details`.
 */
function refused(refusal: any, t: (key: string) => string): { ok: false; message: string; details?: Record<string, unknown> } {
  const { refusalText } = providersLib();
  const extra = refusal?.extra || {};
  const providerMessage = typeof extra.message === "string" && extra.message ? t(extra.message) : null;
  const details: Record<string, unknown> = {};
  if (extra.settingsUrl) details.settingsUrl = extra.settingsUrl;
  if (extra.marketplaceAppId) details.marketplaceAppId = extra.marketplaceAppId;
  if (providerMessage) details.providerMessage = providerMessage;
  return {
    ok: false,
    message: [refusalText(refusal, t), providerMessage].filter(Boolean).join(" — "),
    ...(Object.keys(details).length ? { details } : {}),
  };
}

function matches(item: ChannelItem, state: string | undefined): boolean {
  switch (state) {
    case "active":
      // Working for real: switched on, provider alive and reporting ready.
      return item.enabled && item.providerAlive && item.status === "ready";
    case "off":
      return !item.enabled;
    case "needs_setup":
      return item.status === "needs_setup";
    case "error":
      return item.status === "error";
    default:
      return true;
  }
}

function found(item: ChannelItem, q: string): boolean {
  const needle = q.toLowerCase();
  return [item.title, item.key, item.type, item.typeTitle].some((value) => String(value || "").toLowerCase().includes(needle));
}

export function coreChannels(): ChannelsPort {
  async function describeAll(options: { canManage: boolean; lang: string }): Promise<ChannelItem[]> {
    const { describeChannel } = viewLib();
    const { getInstalledProviderAppIds } = providersLib();
    const rows = await SalesChannel.find({}).sort("sortOrder ASC");
    const installed = await getInstalledProviderAppIds();
    const t = words(options.lang);
    // The list shows the STORED readiness: a polled list that asks every provider is exactly what C32
    // is about, and the card of a channel asks for a fresh one anyway.
    return rows.map((row: any) => item(describeChannel(row, { canManage: options.canManage, installed, t })));
  }

  return {
    async list(query) {
      const items = await describeAll({ canManage: query.canManage, lang: query.lang });
      const counts: Record<string, number> = { all: items.length, active: 0, off: 0, needs_setup: 0, error: 0 };
      for (const state of ["active", "off", "needs_setup", "error"]) {
        counts[state] = items.filter((candidate) => matches(candidate, state)).length;
      }
      const q = query.q?.trim();
      return {
        items: items.filter((candidate) => matches(candidate, query.state) && (!q || found(candidate, q))),
        counts,
      };
    },

    async get(id, options) {
      const { describeChannel } = viewLib();
      const { getInstalledProviderAppIds } = providersLib();
      const channel = await SalesChannel.findOne({ id });
      if (!channel) return null;
      const [installed, computed] = await Promise.all([getInstalledProviderAppIds(), SalesChannel.channelStatus(channel)]);
      return item(describeChannel(channel, { canManage: options.canManage, installed, computed, t: words(options.lang) }));
    },

    async setEnabled(id, enabled, options): Promise<ToggledChannel> {
      const { describeChannel } = viewLib();
      const { checkCanEnable, getInstalledProviderAppIds } = providersLib();
      const existing = await SalesChannel.findOne({ id });
      if (!existing) return { ok: false, notFound: true };

      const t = words(options.lang);
      const installed = await getInstalledProviderAppIds();
      let computed = null;
      if (enabled) {
        // Switching on asks the provider right now: the stored readiness is not trusted (core's rule).
        const check = await checkCanEnable(existing, installed);
        if (check.refusal) return refused(check.refusal, t);
        computed = check.computed;
      }
      const saved = (await SalesChannel.update({ id }, { enabled }).fetch())[0];
      return { ok: true, item: item(describeChannel(saved, { canManage: true, installed, computed, t })) };
    },

    async remove(id, lang): Promise<RemovedChannel> {
      const { checkCanDelete, getInstalledProviderAppIds } = providersLib();
      const existing = await SalesChannel.findOne({ id });
      if (!existing) return { ok: false, notFound: true };

      const refusal = checkCanDelete(existing, await getInstalledProviderAppIds());
      if (refusal) return refused(refusal, words(lang));

      // The provider cleans up its own side first; existing orders keep their source for reports.
      await SalesChannel.destroyChannel(existing);
      return { ok: true, id: String(existing.id), key: existing.key };
    },

    async types(query) {
      const { describeChannelType } = viewLib();
      const { getInstalledProviderAppIds } = providersLib();
      const { SalesChannelRegistry } = registryLib();
      const [installed, country, rows] = await Promise.all([getInstalledProviderAppIds(), projectCountry(), SalesChannel.find({})]);
      const present = new Set(rows.map((row: any) => row.type));
      const all = SalesChannelRegistry.listTypes();
      // As on the page: a type a channel of which is already here is no longer a recommendation.
      const recommended = SalesChannelRegistry.recommendedTypesForCountry(country).filter((def: any) => !present.has(def.type));
      const t = words(query.lang);
      return {
        items: (query.kind === "all" ? all : recommended).map((def: any) => typeItem(describeChannelType(def, { installed, canManage: query.canManage, t }))),
        counts: { recommended: recommended.length, all: all.length },
      };
    },

    async type(id, options) {
      const { describeChannelType } = viewLib();
      const { getInstalledProviderAppIds } = providersLib();
      const def = registryLib().SalesChannelRegistry.getType(id);
      if (!def) return null;
      return typeItem(describeChannelType(def, { installed: await getInstalledProviderAppIds(), canManage: options.canManage, t: words(options.lang) }));
    },
  };
}
