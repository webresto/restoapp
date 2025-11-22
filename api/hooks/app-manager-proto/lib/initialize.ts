"use strict";
import afterHook from "./afterHook";
import { resolve } from "path";
import bindAssets from "./bindAssets";
import loadHelper from "../helpers/loadHelper";
import * as fs from "fs";
import bindTranslations from "./bindTranslations";
import ModuleHelper from "../helpers/moduleHelper";
import bindAccessRights from "./bindAccessRights";
import MigrationsHelper from "../helpers/migrationsHelper";
import SettingsStepGenerator from "./settingsInstallStepper/settingsStepGenerator";
import SettingsHelper from "../helpers/settingsHelper";
import Ajv from "ajv";
import bindAdminpanelConfig from "./bindAdminpanelConfig";
import bindInstallStepper from "./bindInstallStepper";
import bindRoutes from "./bindRoutes";
import HookTools from "./hookTools";

let path = require("path");

process.env.CORE_MODELS_TO_SKIP = "settings";

export default function ToInitialize(sails: any) {
	/**
	 * List of hooks that required for adminpanel to work
	 */

	let requiredHooks = ["orm"];
	console.log("MM: initialize: start");
	return async function initialize(cb: (err?: Error)=>void) {
		// sails.config.paths.hooks = sails.config.modulemanager.modulesPath;
		try {
			// sails.on("adminpanel:viewadmin:loaded", function () {

			// });

			
			sails.on('Adminpanel:afterHook:loaded', function () {
				try {
					bindRoutes(sails);
				} catch (error) {
					console.log(error)
				}
			});

			afterHook();
			bindAccessRights();
			bindAdminpanelConfig()
			bindInstallStepper();

			// sails.after(eventsToWaitFor, require('../lib/afterHooksLoaded')(sails));

			// sails.on("lifted", function() {
			//     afterHook()
			// });

			// Load models
			let modelsToSkip = process.env.MM_MODELS_TO_SKIP !== undefined ? process.env.MM_MODELS_TO_SKIP.split(";") : [];
			await HookTools.bindModels(resolve(__dirname, "../models"), modelsToSkip);

			// add custom views path
			sails.config.modulemanager.modulesViewsPath = path.join(__dirname, "../views/");

			let modulesPath = sails.config.modulemanager.modulesPath;
			if (!fs.existsSync(modulesPath)) {
				fs.mkdirSync(modulesPath);
			}

			if (sails.hooks.i18n && sails.hooks.i18n.appendLocale) {
				sails.after(["hook:i18n:loaded"], () => {
					bindTranslations();
				});
			} else {
				sails.log.warn("sails hook i18n was not loaded, modulemanager bindTranslation skipped");
			}

			// store defaults values config
			sails.after(["hook:orm:loaded"], async () => {
				sails.log.info("MM: initialize: orm loaded; entering modulemanager bootstrap");
				
				// check and load modules
				try {
					sails.log.info("MM: loadHelper: start");
					await loadHelper();
					sails.log.info("MM: loadHelper: done");
				} catch (e) {
					sails.log.error(e);
				}

				if (process.env.DISABLE_AUTO_MIGRATIONS === undefined) {
					await MigrationsHelper.processMigrations();
				}

				const modules = ModuleHelper.getModules();

				// check that modules is not empty
				if (!Object.keys(modules).length) {
					sails.config.modulemanager.state.noModulesFound = true;
				}

				// process declared settings
				for (const appId of Object.keys(modules)) {
					await SettingsHelper.processSettings(appId);
				}

				// process custom install steps
				let settingsProcessedInCustomSteps = await SettingsHelper.processCustomInstallSteps(modules);

				/**
				 * Add settings to the installation stepper:
				 * 	1. Settings that need to be filled (null values) - applicable only to system modules and enabled modules.
				 * 	2. Corrupted settings (failed JSON schema validation) - applicable only to system modules and enabled modules.
				 * */
				//@ts-ignore
				let allSettings = await Settings.find({ key: { 'nin': settingsProcessedInCustomSteps } });
				if (allSettings && allSettings.length) {
					let settingsToBeFilled = [];
					for await (const item of allSettings) {
						// item.module is now a string (appId), not a Module object
						let moduleAppId = item.module as string;
						if (!moduleAppId) {
							continue;
						}

						// Find the module by appId
						//@ts-ignore - Module is a global Sails model
						let itemModule = await Module.findOne({ appId: moduleAppId });
						if (!itemModule) {
							continue;
						}

						// Check if the setting belongs to a system module or is enabled
						let systemModuleList = ModuleHelper.getSystemModuleList();
						if (systemModuleList.includes(itemModule.appId) || itemModule.enable === true) {

							// Check for settings that need to be filled
							if (item.value === null && item.defaultValue === null && item.isRequired === true) {
								sails.log.debug("Setting to be filled in initialize", item.key);
								settingsToBeFilled.push(item);
								continue;
							}

							// Check for corrupted settings
							if (false && item.jsonSchema !== null && !Settings.env("ALLOW_UNSAFE_SETTINGS")) {
								const ajv = new Ajv();
								const validate = ajv.compile(item.jsonSchema);

								if (!validate(item.value) && item.isRequired && !item.defaultValue) {
									if (item.value !== null) {
										sails.log.warn(`Settings value is corrupted for key [${item.key}]`);

										settingsToBeFilled.push(item);

									} else {
										sails.log.warn(`111 222 AJV Validation Error for setting ${item.key}: Value or defaultValue does not match the schema`);
										settingsToBeFilled.push(item);
									}
									sails.log.debug(`Setting`, item, "\nErrors", JSON.stringify(validate.errors, null, 2));
								} else if (!validate(item.value)) {
									sails.log.silly(`Settings value is corrupted for key [${item.key}]. Skipped creating install step because setting is not required`);
								}
							}
						}
					}

					sails.log.debug("settingsToBeFilled length: ", settingsToBeFilled.length);
					SettingsStepGenerator.addSettings(settingsToBeFilled);
					sails.log.silly("SETTINGS TO BE FILLED OR CORRUPTED IN INITIALIZE", settingsToBeFilled);
				}
				sails.emit('modulemanager:loadmodules:finish')
			}); // On Event finish
			// Bind assets
			await bindAssets(sails);
		} catch (e) {
			sails.log.error("Error when initializing module-manager", e);
		} finally {
			cb();
		}
	};
}
