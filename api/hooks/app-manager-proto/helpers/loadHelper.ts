import ModuleHelper from "./moduleHelper";
const fs = require("fs");
let config: any = {};
const defaults = require("../lib/defaults");
import * as path from "path";
import * as semver from "semver";
import RuntimeModule from "../types/RuntimeModule";

declare const sails: any;


export default async function loadHelper(): Promise<void> {
  // merge defaults and config if sails.config.modulemanager is late to define
  if (!sails.config.modulemanager) {
    sails.config.modulemanager = defaults.modulemanager;
  } else {
    sails.config.modulemanager = {...defaults.modulemanager, ...sails.config.modulemanager};
  }
  config = sails.config.modulemanager;

  // Early diagnostics about modules path
  sails.log.info(`MM: loadHelper: modulesPath=${config.modulesPath}`);
  sails.log.info(`MM: loadHelper: modulesPathExists=${fs.existsSync(config.modulesPath)}`);

  if (!fs.existsSync(config.modulesPath)) {
    throw new Error("No modules found");
  }

  // load modules from config.modulesPath
  let modulesDir = fs.readdirSync(config.modulesPath);
  sails.log.info(`MM: loadHelper: modulesDirCount=${modulesDir.length}`);
  // convert relative module paths to absolute paths
  modulesDir = modulesDir.map((dir: string) => `${config.modulesPath}/${dir}`);

  // add system modules from process.env to loading, system modules should be loaded first
  let systemModules = process.env.MM_SYSTEM_MODULES ? process.env.MM_SYSTEM_MODULES.split(";") : [];
  modulesDir = systemModules.concat(modulesDir);

  for (let modulePath of modulesDir) {
    sails.log.info(`MM: loadHelper: processing module path ${modulePath}`);
    
    // Skip if not a directory
    if (!fs.existsSync(modulePath) || !fs.lstatSync(modulePath).isDirectory()) {
      sails.log.info(`MM: loadHelper: skipping ${modulePath} - not a directory`);
      continue;
    }
    
    try {
      checkModule(modulePath);
      sails.log.info(`MM: loadHelper: invoking loadModule for ${modulePath}`);
      await loadModule(modulePath);
    } catch (e) {
      let logTag = "error";
      if (e.code === "3") {
        sails.config.hooks[e.hookName] = false;
      } else if (e.code === "1" || e.code === "4") {
        logTag = "warn"
      }

      sails.log[logTag](`MM: loadHelper error [${modulePath}]`, e.message);
      if (logTag === "error") {
        sails.log.error(`MM: loadHelper error [${modulePath}]`, e.stack);
      }
    }
  }
}


export async function loadModule(modulePath: string, repository?: string): Promise<void> {
  sails.log.info(`MM: loadModule: start modulePath=${modulePath}`);
  
  // Debug info
  const moduleBaseName = require('path').basename(modulePath);
  sails.log.info(`MM: loadModule: processing module ${moduleBaseName}`);
  let module = fs.readdirSync(modulePath);
  let moduleInfo = JSON.parse(fs.readFileSync(`${modulePath}/package.json`, {encoding: "utf-8", flag: "r"}));
  let validModule: RuntimeModule = {} as unknown as RuntimeModule;

  let appId: string;
  let hookName: string;

  if (moduleInfo.appId) {
    appId = moduleInfo.appId;
  } else {
    appId = moduleInfo.name.replace(/^(@.+?[\/\\])?(sails-hook-)?/, "");
    moduleInfo.appId = appId;
  }

  if (moduleInfo.sails?.hookName) {
    hookName = moduleInfo.sails?.hookName
  } else {
    hookName = moduleInfo.name.split("/").shift()
  }

  if (!moduleInfo.appName) {
    moduleInfo.appName = appId;
  }

  if (config.modules[appId] === false) {
    throw {message: `${appId}: Module ${appId} was skipped by config`, code: "4"};
  }

  if (!semver.valid(moduleInfo.version)) {
    throw {message: `${appId}: Following version is not valid: ${moduleInfo.version}`};
  }

	validModule["module"] = moduleInfo;
  validModule["dirName"] = path.basename(modulePath);

  validModule["config"] = {};
  validModule["config"]["settings"] = {};
  if (fs.existsSync(`${modulePath}/settings`)) {
    sails.log.info(`MM: Checking settings directory: ${modulePath}/settings`);
    let settingsFiles = fs.readdirSync(`${modulePath}/settings`);
    sails.log.info(`MM: Found ${settingsFiles.length} settings file(s) in ${modulePath}/settings`);
    for (let settingFile of settingsFiles) {
      try {
        if (path.extname(settingFile).toLowerCase() === '.json') {
          const settingsFilePath = `${modulePath}/settings/${settingFile}`;
          sails.log.silly(`MM: Reading settings file: ${settingsFilePath}`);
          // Read and parse JSON explicitly to avoid require() caching issues and improve errors
          const raw = fs.readFileSync(settingsFilePath, { encoding: 'utf-8', flag: 'r' });
          let setting: Partial<Settings>;
          try {
            // Strip BOM if present, then parse
            const text = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
            setting = JSON.parse(text);
          } catch (e) {
            throw new Error(`Invalid JSON in settings file ${settingsFilePath}: ${e.message}`);
          }

					let settingKey = setting.key as keyof SettingList
          if (!settingKey) {
            sails.log.warn(`Skipping setting without a key field: ${settingsFilePath}`);
          } else {
            validModule["config"]["settings"][settingKey] = setting;
            sails.log.silly(`MM: Loaded setting '${String(settingKey)}' from ${settingsFilePath}`);
          }

        } else {
          sails.log.warn(`Skipping non-JSON file while processing settings: ${modulePath}/settings/${settingFile}`);
        }
      } catch (error) {
        throw error
      }
    }
  } else {
    sails.log.info(`MM: Settings directory not found for module: ${modulePath}/settings`);
  }

  validModule["config"]["installSteps"] = [];
  sails.log.debug(`MM: loadModule: checking installSteps for ${modulePath}`);
  if (fs.existsSync(`${modulePath}/installSteps`)) {
    let installStepsFiles = fs.readdirSync(`${modulePath}/installSteps`);
    sails.log.debug(`MM: Found installSteps directory for ${modulePath} with ${installStepsFiles.length} files: ${installStepsFiles.join(', ')}`);
    for (let installStepFile of installStepsFiles) {
      try {
        if (path.extname(installStepFile).toLowerCase() === '.js') {
          sails.log.debug(`MM: Loading install step: ${modulePath}/installSteps/${installStepFile}`);
          let installStepClass = require(`${modulePath}/installSteps/${installStepFile}`).default;
          let installStep = new installStepClass();
          if (!installStep.ejsPath || !fs.existsSync(installStep.ejsPath)) {
            sails.log.warn(`Skipping install step because field [ejsPath] does not exist or invalid: ${modulePath}/installSteps/${installStepFile}`);
          } else {
            sails.log.debug(`MM: Successfully added install step ${installStep.id} from ${installStepFile}`);
            validModule["config"]["installSteps"].push(installStep);
          }

        } else if (path.extname(installStepFile).toLowerCase() !== '.ts') {
          sails.log.warn(`Skipping non-JS file while processing install step: ${modulePath}/installSteps/${installStepFile}`);
        } else {
          sails.log.debug(`Skipping TS file while processing install step: ${modulePath}/installSteps/${installStepFile}`);
        }
      } catch (error) {
        sails.log.error(`MM: Error loading install step ${installStepFile}:`, error);
        throw error
      }
    }
  }

  if (module.includes("icon.svg")) {
    validModule["module"]["icon"] = fs.readFileSync(`${modulePath}/icon.svg`);
  }

  if (fs.existsSync(`${modulePath}/migrations`)) {
    validModule["hasMigrations"] = true
  }

  // get mmDependencies from package.json to create connections
  let mmDependencies = moduleInfo.mmDependencies || {};
  let systemModuleList = ModuleHelper.getSystemModuleList();
  validModule["isSystemModule"] = systemModuleList.includes(appId);

  // write data in Module model
  let moduleFromDB = await Module.findOne({appId: appId}).populate("settings");
  if (!moduleFromDB) {
    // creating record for installed module or database drop
    let modulesToEnable = process.env.INIT_MODULES_TO_ENABLE ? process.env.INIT_MODULES_TO_ENABLE.split(";") : [];
    moduleFromDB = await Module.create({
      appId: appId, name: moduleInfo.name, version: moduleInfo.version,
      enable: modulesToEnable.includes(appId) || systemModuleList.includes(appId), hookName: hookName,
      directoryName: path.basename(modulePath), dependencies: Object.keys(mmDependencies)
    }).fetch();
  } else {
    // updating record for updated module
    await Module.update({appId: appId}, {
      name: moduleInfo.name, version: moduleInfo.version,
      directoryName: path.basename(modulePath), dependencies: Object.keys(mmDependencies), hookName: hookName,
      ...systemModuleList.includes(appId) && {enable: true}
    }).fetch();
    moduleFromDB = await Module.findOne({appId: appId}).populate("settings");
  }

  let moduleSettings = moduleFromDB.settings as Settings[];
  let hasUnfilledSettings = moduleSettings && moduleSettings.find(item => item.value === null && item.defaultValue === null && item.isRequired === true);
  if (hasUnfilledSettings) {
    validModule["hasUnfilledSettings"] = true;
  }

  // check migrations count and disable module if needed (only for postgres)
  let datastore = sails.getDatastore();
  if (datastore.config.adapter === 'sails-postgresql') {
    let migrationsCount = ModuleHelper.getMigrationsCount(modulePath);
    if (moduleFromDB.enable && !systemModuleList.includes(appId) && moduleFromDB.migrationsCount !== migrationsCount) {
      sails.log.warn(`Module ${appId} was disabled due to unprocessed migrations`)
      await Module.update({appId: appId}, {enable: false}).fetch();
			moduleFromDB = await Module.findOne({appId: appId}).populate("settings");
    }
  }

	validModule["enable"] = moduleFromDB.enable || false;
	validModule["repository"] = repository || moduleFromDB.repository;
  ModuleHelper.addModule(appId, validModule);
}


export function checkModule(modulePath: string) {
  if (!fs.lstatSync(`${modulePath}`).isDirectory() && !fs.lstatSync(`${modulePath}`).isSymbolicLink()) {
    throw {message: modulePath + " is not a directory or a symbolic link to a directory", code: "1"};
  }

  let module = fs.readdirSync(`${modulePath}`);
  if (!module.includes("package.json")) {
    throw {message: modulePath + ": No package.json file found", code: "2"};
  } else {
    let moduleInfo = JSON.parse(fs.readFileSync(`${modulePath}/package.json`, {encoding: "utf-8", flag: "r"}));
    if (!moduleInfo.name || !moduleInfo.version || !moduleInfo.description) {
      let hookName = moduleInfo.name.replace(/^(@.+?[\/\\])?(sails-hook-)?/, "");
      throw {message: moduleInfo.appId + ": Missed one or more required field", hookName: hookName, code: "3"};
    }

    // check if module can be installed
    let projectPackageJSON = require(`${process.cwd()}/package.json`);
    let currentDependencies = projectPackageJSON.appDependencies;
    let requiredDependencies = moduleInfo.appDependencies;
    let canBeInstalled = ModuleHelper.canBeInstalled(requiredDependencies, currentDependencies);

    if (canBeInstalled.response === false) {
      throw {
        message: moduleInfo.appId + ": Can not be installed due to missing dependencies",
        errors: canBeInstalled.errors,
        code: "5"
      }
    }
  }
}


// install module dependencies
export async function installModuleDeps(modulePath: string): Promise<void> {
  sails.log.warn("MM: automatic module dependency installation is currently disabled. This disables automatic 'npm install' for module dependencies and may cause modules to not work until dependencies are installed.");
  sails.log.warn(`MM: Module path: ${modulePath}`);
  sails.log.warn(`MM: To install dependencies manually, run: cd ${modulePath} && npm install`);
  console.warn(`MM: automatic module dependency installation is disabled for ${modulePath}. Run 'cd ${modulePath} && npm install' to restore dependencies.`);
  // try {
	// 	const packageJsonPath = `${modulePath}/package.json`;
	// 	if (!fs.existsSync(packageJsonPath)) {
	// 		throw new Error(`File '${packageJsonPath}' not found.`);
	// 	}

	// 	const moduleInfo = JSON.parse(fs.readFileSync(packageJsonPath, { encoding: "utf-8", flag: "r" }));

	// 	if (!moduleInfo.dependencies || Object.keys(moduleInfo.dependencies).length === 0) {
	// 		sails.log.warn("No dependencies found in package.json");
	// 		return;
	// 	}

	// 	process.chdir(modulePath);
	// 	const dependencies: string[] = [];
	// 	for (let key in moduleInfo.dependencies) {
	// 		dependencies.push(`${key}@${moduleInfo.dependencies[key]}`)
	// 	}

	// 	await new Promise<void>((resolve, reject) => {
	// 		npm.load({
	// 			loaded: false
	// 		}, (err: Error) => {
	// 			if (err) {
	// 				reject(err);
	// 			} else {
	// 				npm.commands.install(dependencies, (err: Error, data: any) => {
	// 					if (err) {
	// 						reject(err);
	// 					} else {
	// 						resolve();
	// 					}
	// 				});
	// 				npm.on("log", (message: string) => {
	// 					sails.log.debug(message);
	// 				});
	// 			}
	// 		});
	// 	});
	// } catch (error) {
	// 	sails.log.error("Error during dependency installation:", error);
	// 	throw error;
	// }
}
