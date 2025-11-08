import * as path from "path";
import MigrationsHelper from "../../helpers/migrationsHelper";
import ModuleHelper from "../../helpers/moduleHelper";
import InstallStepAbstract from "../installStepper/InstallStepAbstract";

export default class EnableModuleStep extends InstallStepAbstract {
    constructor(appId: string, runMigrations: boolean) {
        super();
        this.appId = appId;
        this.runMigrations = runMigrations;
    }

    canBeSkipped = false;
    description = '';
    ejsPath = path.resolve(__dirname, '../../views/stepper/enableModule.ejs');
    id = 'enable-module';
    scriptsUrl = '';
    sortOrder = 5000000;
    groupSortOrder = 5000000;
    stylesUrl = '';
    title = 'Enable module Step';
    badge = '';
    isSkipped = false;
    settingsKeys: string[] = [];
    renderer: "ejs" = "ejs";
    isProcessed = false;
    appId: string;
    runMigrations: boolean;

    async check() {
        return this.isProcessed;
    }

    async process() {
        return;
    }

    async skip() {
        return;
    }

    finally(): Promise<void> {
        return;
    }

    toFinally() {
        return;
    }

    async onInit(): Promise<void> {
        // execute migrations if needed and turn module on before showing step to user
        if (this.runMigrations) {
            try {
                await MigrationsHelper.processSpecificModuleMigrations(this.appId);
            } catch (e) {
                throw new Error(`Error trying to process migrations up: ${e}`);
            }
        }

        // turn module on (in db and runtime)
        await Module.update({appId: this.appId}, {enable: true}).fetch();
        let modules = ModuleHelper.getModules();
        modules[this.appId].enable = true;
        ModuleHelper.addModule(this.appId, modules[this.appId]);
    }
}
