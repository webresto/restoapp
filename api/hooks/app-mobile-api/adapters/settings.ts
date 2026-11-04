import type { SettingsPort, SettingRow } from "../apps/settings";

/**
 * «Настройки» on core's `Settings`: one door more onto the same library the admin panel's own
 * settings page uses — `@webresto/core/lib/settings/view` (C23, C24).
 *
 * Nothing about what may be shown is decided here: the effective value of a setting pinned by the
 * environment, the secret that stays in the database, the sentence that says which rule a value
 * broke — all of it comes from there, so the phone and the web answer the same by construction. The
 * only thing this adapter owns is the language: core's complaints are translated by core's own
 * translator, the same one the panel passes in as `req.i18n.__`.
 */

declare const Settings: any;

const CORE = "@webresto/core";

const view = () => require(`${CORE}/lib/settings/view`);
const translator = (lang: string) => require(`${CORE}/lib/i18n/translator`).getTranslatorFor(lang);

export function coreSettings(): SettingsPort {
  return {
    list: () => view().listSettings(),
    get: async (key: string) => {
      const setting = await Settings.findOne({ key });
      return setting ? (view().describeSetting(setting) as SettingRow) : null;
    },
    update: (key, value, lang) => view().applySetting(key, value, translator(lang)),
    dump: () => view().dumpSettings(),
    diff: (entries) => view().diffImport(entries),
    apply: (entries, keys, lang) => view().applyImport(entries, keys, translator(lang)),
    boot: () => require(`${CORE}/lib/settings/boot`).bootId(),
  };
}
