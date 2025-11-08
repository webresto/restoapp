import * as path from "path";
import * as fs from "fs";
import { loadModuleTranslations } from "../helpers/translationHelper";

export default async function () {
  const config = sails.config.modulemanager;
  if (!sails.hooks.i18n) {
    throw "sails hook i18n was not loaded, modulemanager bindTranslation exited by throw"
  }

  let modules = fs.readdirSync(config.modulesPath);
  for (let module of modules) {
    try {
      let moduleDir = path.resolve(`${config.modulesPath}/${module}`);
      loadModuleTranslations(moduleDir)
    } catch (e) {
      sails.log.error("Adminpanel > Error when loading translations", e);
    }
  }
}
