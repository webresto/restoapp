import {v4 as uuid} from "uuid";
import {SinglePayload, MultiPayload} from "./settingsStepGenerator";
import Ajv from 'ajv';
import InstallStepAbstract from "../installStepper/InstallStepAbstract";

type Payload = SinglePayload | MultiPayload;
export interface SettingsStepInit {
    canBeSkipped: boolean
    description: string
    sortOrder: number
    groupSortOrder: number
    title: string
    badge: string
    payload: Payload
    settingsKeys: string[]
}

export default class SettingsStep extends InstallStepAbstract {
    canBeSkipped: boolean;
    description: string;
    ejsPath: string;
    id: string;
    scriptsUrl: string;
    sortOrder: number;
    groupSortOrder: number;
    stylesUrl: string;
    title: string;
    badge: string;
    isSkipped: boolean = false;
    settingsKeys: string[]; // settings unique names list
    renderer: "jsonforms" = "jsonforms";

    constructor(settingsStepInit: SettingsStepInit) {
        super();
        this.canBeSkipped = settingsStepInit.canBeSkipped;
        this.description = settingsStepInit.description;
        this.sortOrder = settingsStepInit.sortOrder;
        this.groupSortOrder = settingsStepInit.groupSortOrder;
        this.title = settingsStepInit.title;
        this.badge = settingsStepInit.badge;
        this.payload = settingsStepInit.payload;
        this.id = uuid();
        this.settingsKeys = settingsStepInit.settingsKeys;
    }

    async check(): Promise<boolean> {
        if (this.canBeSkipped && this.isSkipped) {
            return true
        }

        let settingsToCheck = await Settings.find({key: {in: this.settingsKeys}});
        for (let setting of settingsToCheck) {
            if (setting.value === null && setting.defaultValue === null) {
                return false
            }
        }

        return true;
    }

    async process(data: any): Promise<void> {
        for (let key in data) {
			let setting = await Settings.findOne({ key: key });

			// validate values if !ALLOW_UNSAFE_SETTINGS
			if (!(await Settings.get("ALLOW_UNSAFE_SETTINGS"))) {
				// json schema is required for json type and optional for string and number type
				if (setting.jsonSchema) {
					const ajv = new Ajv();
					const validate = ajv.compile(setting.jsonSchema);

					if (!validate(data[key])) {
						throw `AJV Validation Error: Value does not match the JSON schema: ${JSON.stringify(validate.errors, null, 2)}`;
					}

				} else {
					switch (setting.type) {
						case "string":
							if (typeof data[key] !== "string") {
								throw `Validation Error: Value for key '${key}' should be a string`;
							}
							break;
						case "number":
							if (typeof data[key] !== "number") {
								throw `Validation Error: Value for key '${key}' should be a number`;
							}
							break;
						case "boolean":
							if (typeof data[key] !== "boolean") {
								throw `Validation Error: Value for key '${key}' should be a boolean`;
							}
							break;
					}
				}
			}

			let result = await Settings.update({ key: key }, { key: key, value: data[key] }).fetch();
            sails.log.debug("PROCESS STEP RESULT", result);
		}

	}

    protected skip(): Promise<void> {
        if (this.canBeSkipped) {
            this.isSkipped = true;
        }

        return Promise.resolve(undefined);
    }

}
