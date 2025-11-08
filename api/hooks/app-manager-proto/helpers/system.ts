import ModuleHelper from "./moduleHelper";

const fs = require("fs");
import * as path from "path";

// Helper function to recursively copy files and directories
export function copyRecursiveSync(source: string, target: string) {
  const files = fs.readdirSync(source);
  files.forEach(function (file: string) {
    const curSource = path.join(source, file);
    const curTarget = path.join(target, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      fs.mkdirSync(curTarget);
      copyRecursiveSync(curSource, curTarget);
    } else {
      fs.copyFileSync(curSource, curTarget);
    }
  });
}

// function for updating "hooks" section in .sailsrc due to modules "enable" field in database
export async function updateSailsRC(): Promise<"hasUpdated" | "noChanges"> {
  return Promise.resolve('noChanges')
  // Modules only work through manual editing of sailsRC
  let modules = await Module.find({isDeleted: false});
  let systemModuleList = ModuleHelper.getSystemModuleList();

  let currentModuleHooks = modules.reduce((hooks: {[key:string]: boolean}, module) => {
    // skip system modules
    if (!systemModuleList.includes(module.appId)) {
      hooks[module.hookName] = module.enable; // using hookName for .sailsrc instead of appId
    }
    return hooks;
  }, {});

  let result: "hasUpdated" | "noChanges" = "noChanges";
  let sailsRc = JSON.parse(fs.readFileSync(`${process.cwd()}/.sailsrc`, {encoding: "utf-8", flag: "r"}));
  for (let moduleHook in currentModuleHooks) {
    // module is enabled but presents in .sailsrc with "false" flag
    if (currentModuleHooks[moduleHook] === true && sailsRc.hooks[moduleHook] !== undefined && sailsRc.hooks[moduleHook] === false) {
      delete sailsRc.hooks[moduleHook];
      result = "hasUpdated";
    }

    if (currentModuleHooks[moduleHook] === false && sailsRc.hooks[moduleHook] !== false) {
      sailsRc.hooks[moduleHook] = false;
      result = "hasUpdated";
    }
  }

  if (result === "hasUpdated") {
    fs.writeFileSync(`${process.cwd()}/.sailsrc`, JSON.stringify(sailsRc, null, 2), 'utf8');
  }

  return result;
}
