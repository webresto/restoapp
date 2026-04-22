// import path = require("path");
// import * as fs from "fs";
import * as path from "path";
import * as fs from "fs";
import InstallStepAbstract from "../lib/installStepper/InstallStepAbstract";
let i18nFactory = require('i18n-2');

export function loadModuleTranslations(moduleDir: string): void {

  if (!sails.hooks.i18n) {
    sails.log.warn(`sails hook i18n was not loaded for (${moduleDir}), loadModuleTranslations exited`)
    return
  }

  try {
    if (!fs.existsSync(`${moduleDir}/locales`)) {
      sails.log.warn(`Translations dir not found ${moduleDir}/locales`)
      return;
    }

    const translations = fs.readdirSync(`${moduleDir}/locales`).filter(function (file) {
      return path.extname(file).toLowerCase() === ".json";
    });

		if (sails.config.adminpanel.translation !== false) {
			if (!sails.config.adminpanel.translation.locales.length) {
				sails.log.warn('Config adminpanel translations.locales not defined')
			}

			for (let locale of sails.config.adminpanel.translation.locales) {
				if (translations.includes(`${locale}.json`)) {
					try {
						let jsonData = require(`${moduleDir}/locales/${locale}.json`);
						sails.hooks.i18n.appendLocale(locale, jsonData);
					} catch (error) {
						sails.log.error(`Adminpanel > Error when reading ${locale}.json: ${error}`);
					}
				} else {
					sails.log.silly(`Adminpanel > Cannot find ${locale} locale in translations directory`);
				}
			}
		} else {
			sails.log.warn(`Translations are disables in adminpanel config`);
		}

  } catch (e) {
    sails.log.error("Adminpanel > Error when loading translations", e);
  }
}



export class TranslationHelper {
    public static loadTranslations(translationsPath: string): void {
        let translationsConfig = sails.config.adminpanel.translation;

        if ( typeof translationsConfig === "boolean") {
            if(translationsConfig as boolean === true) {
                sails.log.warn("sails.config.adminpanel.translation is TRUE, is not mater")
            }
            return
        }

        try {
            let translationsDirectoryPath = path.resolve(translationsPath);
            let translations = fs.readdirSync(translationsDirectoryPath).filter(function (file) {
                    return path.extname(file).toLowerCase() === ".json";
                });

            let localesList = translationsConfig.locales;
            let defaultLocale = translationsConfig.locales.includes(translationsConfig.defaultLocale) ?
                translationsConfig.defaultLocale : translationsConfig.locales[0];
            for (let locale of localesList) {
                if (translations.includes(`${locale}.json`)) {
                    try {
                        let jsonData = require(`${translationsDirectoryPath}/${locale}.json`);
                        sails.hooks.i18n.appendLocale(locale, jsonData);
                        // sails.hooks.i18n.defaultLocale = defaultLocale;
                    } catch (error) {
                        sails.log.error(`Adminpanel > Error when reading ${locale}.json: ${error}`);
                    }
                } else {
                    sails.log.debug(`Adminpanel > Cannot find ${locale} locale in translations directory`)
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading translations", e)
        }
    }

    public static loadAdminizerTranslations(adminizer: any, translationsPath: string): void {
        if (!adminizer?.i18n?.appendLocale) {
            sails.log.warn("Adminizer i18n.appendLocale is not available, skipping app-manager-proto translations");
            return;
        }

        try {
            const translationsDirectoryPath = path.resolve(translationsPath);
            if (!fs.existsSync(translationsDirectoryPath)) {
                sails.log.warn(`Adminpanel module translations directory not found: ${translationsDirectoryPath}`);
                return;
            }

            const localesList = sails.config.i18n?.locales ?? [];
            for (const locale of localesList) {
                const localeFile = path.resolve(translationsDirectoryPath, `${locale}.json`);
                if (!fs.existsSync(localeFile)) {
                    sails.log.debug(`Adminpanel module translations: locale file not found for ${locale}`);
                    continue;
                }

                try {
                    const fileContent = fs.readFileSync(localeFile, "utf8");
                    const jsonData = JSON.parse(fileContent);
                    adminizer.i18n.appendLocale(locale, jsonData);
                } catch (error) {
                    sails.log.error(`Adminpanel module translations > Error when reading ${locale}.json:`, error);
                }
            }
        } catch (e) {
            sails.log.error("Adminpanel > Error when loading adminizer translations", e);
        }
    }

    public static translateProperties(object: any, locale: string, fields: string[]): any {
        const i18n = this.getI18nInstance(locale);

        const translateObject = (obj: any) => {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }

            Object.keys(obj).forEach((key) => {
                const value = obj[key];

                if (fields.includes(key) && typeof value !== 'object') {
                    obj[key] = i18n.__(value);
                } else {
                    obj[key] = translateObject(value);
                }
            });

            return obj;
        };

        return translateObject(object);
    }

    private static getI18nInstance(locale: string): any {
        if(typeof sails.config.adminpanel.translation === "boolean") {
            throw `Transaltion is disabled`
        }

        const i18n = new i18nFactory({...sails.config.i18n, directory: sails.config.i18n.localesDirectory, extension: ".json"})
        i18n.setLocale(locale);
        return i18n;
    }
}
