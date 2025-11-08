import Settings from "../../models/Settings";
import SettingsStep, {SettingsStepInit} from "./settingsStep";
import Module from "../../models/Module";
import {Generate, JsonSchema, UISchemaElement} from "@jsonforms/core";
import ModuleHelper from "../../helpers/moduleHelper";
import { InstallStepper } from "../installStepper/installStepper";

export interface SinglePayload {
	type: "single";
	data: Settings;
}

export interface MultiPayload {
	type: "multi";
	data: Settings[];
	uiSchema: UISchemaElement;
	jsonSchema: JsonSchema;
}

// Debounce decorator implementation
function debounce(delay: number) {
    return function (target: any, propertyKey: string, descriptor?: PropertyDescriptor) {
        let originalMethod;
        if (descriptor) {
            originalMethod = descriptor.value;
        } else {
            originalMethod = target[propertyKey];
        }
        let timeoutId: NodeJS.Timeout;
        const debounced = function (...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                originalMethod.apply(this, args);
            }, delay);
        };
        if (descriptor) {
            descriptor.value = debounced;
            return descriptor;
        } else {
            target[propertyKey] = debounced;
        }
    };
}

export default class SettingsStepGenerator {
	protected static settings: Settings[] = [];

	/** 'module' field should be populated when giving 'setting' param */
	static addSetting(setting: Settings, debounce: boolean = true, stepperId: string = "project") {

		this.settings.push(setting);

		if (debounce) {
			this.newStepWithDebounce(stepperId);
		} else {
			// TODO with such approach there will be only 1 setting per step
			// for instantly create step
			this.newStep(stepperId);
		}
	}

	/** 'module' field should be populated when giving 'settings' params */
	static addSettings(settings: Settings[], debounce: boolean = true, stepperId: string = "project") {
		for (let setting of settings) {
			this.addSetting(setting, debounce, stepperId);
		}
	}

	@debounce(3000)
	static newStepWithDebounce(stepperId: string = "project") {
		this.newStep(stepperId);
	}

	static newStep(stepperId: string = "project") {
		const installStepper = ensureInstallStepper(stepperId);
		const coveredSettingsKeys = installStepper.getCoveredSettingsKeys();

		// Filter out settings that are already covered by custom steps
		const uncoveredSettings = this.settings.filter(setting =>
			!coveredSettingsKeys.includes(setting.key)
		);

		const nonSkippablePlainSettings = [];
		const skippablePlainSettings = [];

		let systemModuleList = ModuleHelper.getSystemModuleList();
		for (let setting of uncoveredSettings) {
			let settingModule = setting.module as Module;

			if (setting.jsonSchema) {
				if (!setting.uiSchema) {
					setting.uiSchema = Generate.uiSchema(setting.jsonSchema);
				}

				// add step using UI schema
				let settingsStepInit: SettingsStepInit = {
					canBeSkipped: !systemModuleList.includes(settingModule.appId),
					description: setting.description,
					sortOrder: 0,
					groupSortOrder: systemModuleList.includes(settingModule.appId) ? 0 : 1,
					title: setting.name ?? setting.key,
					badge: settingModule.appId,
					payload: {type: "single", data: setting} as SinglePayload,
					settingsKeys: [setting.key]
				};

				let settingsStep = new SettingsStep(settingsStepInit);
				const installStepper = ensureInstallStepper(stepperId);
				installStepper.addStep(settingsStep);

			} else {
				// presence in systemModuleList means that setting is unskippable
				if (systemModuleList.includes(settingModule?.appId)) {
					nonSkippablePlainSettings.push(setting)
				} else {
					skippablePlainSettings.push(setting)
				}
			}
		}

		// process non skippable settings first to create more convenient form for user
		generateStepFromSettings(nonSkippablePlainSettings, 0, false, stepperId);
		generateStepFromSettings(skippablePlainSettings, 1, true, stepperId);

		// clear only the settings that were actually used in generated steps
		const usedSettingsKeys = new Set<string>();
		installStepper.getSteps().forEach(step => {
			if (step.settingsKeys) {
				step.settingsKeys.forEach(key => usedSettingsKeys.add(key));
			}
		});

		this.settings = this.settings.filter(setting => !usedSettingsKeys.has(setting.key));
	}
}

function ensureInstallStepper(stepperId: string = "project"): InstallStepper {
	return InstallStepper.ensureStepper(stepperId, stepperId !== "project");
}

function generateStepFromSettings(settingsList: Settings[], groupSortOrder: number, canBeSkipped: boolean, stepperId: string = "project") {
	if (!settingsList || !settingsList.length) return

	// group settings by its moduleAppId
	let specificModuleSettings: { [key: string]: Settings[] } = {};
	settingsList.forEach(setting => {
		const module = setting.module as Module;
		if (module) {
			specificModuleSettings[module.appId] = specificModuleSettings[module.appId] || [];
			specificModuleSettings[module.appId].push(setting);
		}
	});

	// create particular step for every module, but every step should contain not more than 15 settings
	for (const moduleAppId in specificModuleSettings) {
		const moduleSettingsList = specificModuleSettings[moduleAppId];

		// divide moduleSettingsList to chunks that contains maximum 15 elements
		const chunkSize = 15;
		const chunkedSettingsList: Settings[][] = [];
		for (let i = 0; i < moduleSettingsList.length; i += chunkSize) {
			chunkedSettingsList.push(moduleSettingsList.slice(i, i + chunkSize));
		}

		// create step for every chunk of any module
		for (let i = 0; i < chunkedSettingsList.length; i++) {
			const currentChunk = chunkedSettingsList[i];

			const jsonSchema = genJSONSchema(currentChunk);
			const uiSchema = Generate.uiSchema(jsonSchema);

			let settingsStepInit: SettingsStepInit = {
				canBeSkipped: canBeSkipped,
				description: `Set of ${canBeSkipped === true ? "skippable" : "unskippable"} settings for ${canBeSkipped === true ? "" : "system"} module '${moduleAppId}'`,
				sortOrder: 0,
				groupSortOrder: groupSortOrder,
				title: `Settings for module '${moduleAppId}'${canBeSkipped !== true ? " (can not be skipped, this is a system module)" : ""}:`,
				badge: null,
				payload: {type: "multi", data: currentChunk, uiSchema: uiSchema, jsonSchema: jsonSchema} as MultiPayload,
				settingsKeys: currentChunk.map((item) => item.key)
			};

			let settingsStep = new SettingsStep(settingsStepInit);
			sails.log.silly("SETTING STEP for module", moduleAppId, "Chunk", i + 1, settingsStep);

			const installStepper = ensureInstallStepper(stepperId);
			installStepper.addStep(settingsStep);
		}
	}
}

// custom function to build JSON schema from an array of Settings
function genJSONSchema(settings: Settings[]): JsonSchema {
	const jsonSchema: JsonSchema = {
		type: "object",
		properties: {},
	};

	for (let setting of settings) {
		jsonSchema.properties[setting.key] = {
			type: setting.type,
			description: setting.description,
			// tooltip: setting.tooltip
		}
	}

	return jsonSchema;
}
