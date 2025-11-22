import RuntimeModule from "../types/RuntimeModule";
import ModuleHelper from "./moduleHelper";
import type Settings from "../models/Settings";
import { InstallStepper } from "../lib/installStepper/installStepper";

export default class SettingsHelper {
	private static declaredSettings: string[] = ["MODULE_STORAGE_LICENSE", "ALLOW_UNSAFE_SETTINGS"];

	public static setDeclaredSetting(key: string): void {
		this.declaredSettings.push(key);
	}

	public static getDeclaredSettings(): string[] {
		return this.declaredSettings;
	}

	public static isInDeclaredSettings(key: string): boolean {
		return this.declaredSettings.includes(key);
	}

	public static async processSettings(appId: string) {
		const modules = ModuleHelper.getModules();
		const module = modules[appId]
		if (!module) {
			return
		}

		// write data in Settings model
		if (module["config"] && typeof module["config"]["settings"] === "object") {
			for (const _settingKey of Object.keys(module["config"]["settings"])) {
				let settingKey = _settingKey as keyof SettingList;
				let settingFields = module["config"]["settings"][settingKey];

				let settingsSetInput = {
					appId: appId,
					key: settingKey,
					type: settingFields.type,
					jsonSchema: settingFields.jsonSchema,
					name: settingFields.name,
					description: settingFields.description,
					tooltip: settingFields.tooltip,
					value: settingFields.value,
					defaultValue: settingFields.defaultValue,
					uiSchema: settingFields.uiSchema,
					readOnly: settingFields.readOnly,
					isRequired: settingFields.isRequired
				}

				// If exist value we should check in Model
				// Data from database is origin and we should not rewrite them even if type was changed, because the priority is to keep data safe
				if (settingsSetInput.value !== undefined) {
					let origSetting = await Settings.findOne({key: settingKey});
					if (origSetting && origSetting.value !== undefined) {

						// here we made unvalid value by schema if setting not match
						// we really need more checks, because user settings are important
						delete (settingsSetInput.value)

						Object.assign(origSetting, settingsSetInput)
						//@ts-ignore
						settingsSetInput = origSetting;
					}
				} else {
					// delete key for value if value is undefined to prevent rewriting in Settings.set
					delete settingsSetInput.value
				}

				// TODO: test > 'Check that the data will be updated after it has been updated in the module'
				await Settings.set(settingKey, settingsSetInput);
				// save declared file settings in settingsHelper if it was set without mistakes (added to database)
				let declaredSetting = await Settings.findOne({ key: settingKey });
				if (declaredSetting) {
					SettingsHelper.setDeclaredSetting(declaredSetting.key);
				}
			}

			// create runtime hasUnfilledSettings for all modules if needed
			let moduleFromDB = await Module.findOne({appId: appId});
			let moduleSettings: Settings[] = [];
			let hasUnfilledSettings = false;
			if (hasUnfilledSettings) {
				let updatedModule = {...module, hasUnfilledSettings: true};
				ModuleHelper.addModule(appId, updatedModule)
			}

		} else if (!module["module"]) {
			sails.log.warn(`Module ${appId} is not in loaded modules list | modules[appId]["module"] not defined`);
		} else if (!module["config"]) {
			sails.log.info(`Module ${appId} does not have config`);
		}
	}

	public static async processCustomInstallSteps(modules: {[p: string]: RuntimeModule}, stepperId: string = "project"): Promise<string[]> {
		let settingsProcessedInCustomSteps: string[] = [];
		for (const appId of Object.keys(modules)) {
			// write data in Settings model
			if (modules[appId] && modules[appId]["config"] && modules[appId]["config"]["installSteps"].length) {
				for (const installStep of modules[appId]["config"]["installSteps"]) {
					// Always run the check() method to determine if step should be shown
					if (!(await installStep.check())) {
						sails.log.debug(`Settings to be filled in custom step for module ${appId}: ${installStep.settingsKeys}`);
						sails.log.silly(`CUSTOM SETTING STEP (${appId})`, installStep);
					const installStepper = InstallStepper.ensureStepper(stepperId, stepperId !== "project");
					installStepper.addStep(installStep);

					} else {
						sails.log.debug(`Custom step for ${appId} was skipped because of check function`)
					}
					settingsProcessedInCustomSteps.push(...installStep.settingsKeys)
				}
			}
		}

		return settingsProcessedInCustomSteps;
	}

	public static parseBoolean(value: string | undefined): boolean | undefined {
		if (value === undefined || value === null || value === '') {
			return undefined;
		}
		const trueValues = ["yes", "YES", "Yes", "1", "true", "TRUE", "True"];
		const falseValues = ["no", "NO", "No", "0", "false", "FALSE", "False"];
		if (trueValues.includes(value)) {
			return true;
		}
		if (falseValues.includes(value)) {
			return false;
		}
		// по умолчанию false, если не пустое но не соответствует
		return false;
	}
}
