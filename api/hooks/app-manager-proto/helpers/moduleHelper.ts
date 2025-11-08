import axios from "axios";
import Application from "../types/Application"
import * as fs from "fs";
import * as path from 'path';
import RuntimeModule from "../types/RuntimeModule";
import debounceByParam from "../decorators/debounceByParam";
import * as semver from "semver";
import SettingsHelper from "./settingsHelper";
import SettingsStepGenerator from "../lib/settingsInstallStepper/settingsStepGenerator";
import EnableModuleStep from "../lib/settingsInstallStepper/enableModuleStep";
import { InstallStepper } from "../lib/installStepper/installStepper";

export default class ModuleHelper {
  private static loadedModules: { [key: string]: RuntimeModule } = {};


  public static addModule(appId: string, module: RuntimeModule) {
    this.loadedModules[appId] = module;
  }

  public static deleteModule(appId: string) {
    delete this.loadedModules[appId]
  }

  public static getModules() {
    return this.loadedModules;
  }

  public static getMigrationsCount(modulePath: string): number {
    if (!fs.existsSync(`${modulePath}/migrations`)) {
      return 0
    } else {
      let migrationsDir = fs.readdirSync(`${modulePath}/migrations`);
      return migrationsDir.length;
    }
  }

  public static async changeState(appId: string) {
    let modules = this.getModules();
    if (!modules[appId]) {
      sails.log.error(`Module helper: ${appId} was not found`)
    }

    let moduleFromDB = await Module.findOne({appId: appId});

    // turning module on
    if (!moduleFromDB.enable) {
      if (modules[appId].hasUnfilledSettings) {
        InstallStepper.ensureStepper("module", true);

        // add custom steps to installStepper
        let settingsProcessedInCustomSteps = await SettingsHelper.processCustomInstallSteps({[appId]: modules[appId]}, "module");

        // add settings to installStepper
        let allModuleSettings = await Settings.find({module: appId, key: {'nin': settingsProcessedInCustomSteps}});
        if (allModuleSettings && allModuleSettings.length) {
          let settingsToBeFilled = [];
          for await (const item of allModuleSettings) {
            // Check for settings that need to be filled
            if (item.value === null && item.defaultValue === null && item.isRequired === true) {
              sails.log.debug(`Setting to be filled for module ${appId}`, item.key);
              settingsToBeFilled.push(item);
            }
          }

          sails.log.debug(`settingsToBeFilled for module ${appId} length: `, settingsToBeFilled.length);
          SettingsStepGenerator.addSettings(settingsToBeFilled, false, "module");
          sails.log.silly(`SETTINGS TO BE FILLED OR CORRUPTED FOR MODULE ${appId}`, settingsToBeFilled);
        }
      }

      // run migrations if not all migrations processed
      let enableModuleStep: EnableModuleStep;
      let migrationsCount = ModuleHelper.getMigrationsCount(`${sails.config.modulemanager.modulesPath}/${moduleFromDB.directoryName}`);
      if (moduleFromDB.migrationsCount !== migrationsCount) {
        sails.log.debug(`Migrations count for module ${appId} is not equal to database value: ${migrationsCount} !== ${moduleFromDB.migrationsCount}`)
        enableModuleStep = new EnableModuleStep(appId, true);
      } else {
        enableModuleStep = new EnableModuleStep(appId, false);
      }

      let installStepper = InstallStepper.ensureStepper("module", true);

      installStepper.addStep(enableModuleStep);

    } else {
      // turning module off (in db and runtime)
      await Module.update({appId: appId}, {enable: false}).fetch();
      modules[appId].enable = false;
      ModuleHelper.addModule(appId, modules[appId]);
    }
  }

  @debounceByParam(2000)
  public static async checkSettings(appId: string) {
    let moduleSettings = await Settings.find({module: appId});
    let hasUnfilledSettings = moduleSettings.find(item => item.value === null && item.defaultValue === null);
    if (hasUnfilledSettings) {
      this.loadedModules[appId].hasUnfilledSettings = true
    } else {
      this.loadedModules[appId].hasUnfilledSettings = false;
    }
  }

  public static async findSpecific(appId: string): Promise<Application> {
    let app;

    try {
      app = await axios.post(process.env.MODULE_REGISTER + '/specificModule', {
        appId: appId
      });
      return app.data;
    } catch (err) {
      return err;
    }

  }

  public static async findMy(apiKey: string): Promise<Application[]> {
    let apps;

    try {
      apps = await axios.post(process.env.MODULE_REGISTER + '/myModules', {
        apiKey: apiKey
      });
      return apps.data;
    } catch (err) {
      return err;
    }

  }

  public static async findAll(): Promise<Application[]> {
    let apps;

    try {
      apps = await axios.post(process.env.MODULE_REGISTER + '/allModules');
      sails.config.modulemanager.state.notAvailableMarket = false
      return apps.data;
    } catch (err) {
      sails.config.modulemanager.state.notAvailableMarket = true
      return err;
    }

  }

  public static getSystemModuleList(): string[] {
    let systemModuleList: string[] = [];

    if (process.env.MM_SYSTEM_MODULES) {
      const modulePaths = process.env.MM_SYSTEM_MODULES.split(';');

      modulePaths.forEach(modulePath => {
        try {
          const packageJsonPath = path.join(modulePath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            if (packageJson.appId) {
              systemModuleList.push(packageJson.appId);
            } else {
              systemModuleList.push(packageJson.name.replace(/^(@.+?[\/\\])?(sails-hook-)?/, ""));
            }
          }
        } catch (error) {
          sails.log.error(`Error reading package.json from ${modulePath}:`, error);
        }
      });
    }

    return systemModuleList;
  }

  /**
   * Check that specific version of module (latest by default) can be installed with current dependencies
   * @param requiredDependencies - dependencies needed to install module (can be taken from module-storage [getModuleVersion])
   * @param currentDependencies - current dependencies that module has in package.json
   * */
  public static canBeInstalled(requiredDependencies: { [key: string]: string }, currentDependencies: {
    [key: string]: string
  }): { response: boolean, errors: any } {
    if (requiredDependencies && Object.keys(requiredDependencies).length && !currentDependencies) {
      return {response: false, errors: {missingModules: Object.keys(requiredDependencies), outdatedModules: []}};
    }

    const missingModules = [];
    const outdatedModules = [];
    for (let dependency in requiredDependencies) {
      let requiredVersion = requiredDependencies[dependency];
      let currentVersion = currentDependencies[dependency];

      if (!currentVersion) {
        missingModules.push(dependency);
      } else if (semver.lt(currentVersion, requiredVersion)) {
        outdatedModules.push({module: dependency, currentVersion, requiredVersion});
      }
    }

    if (missingModules.length > 0 || outdatedModules.length > 0) {
      return {response: false, errors: {missingModules: missingModules, outdatedModules: outdatedModules}};

    } else {
      return {response: true, errors: null} // "All dependencies are up-to-date for this module"
    }
  }
}
