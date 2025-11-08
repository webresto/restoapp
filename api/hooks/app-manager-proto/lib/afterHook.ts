'use strict';
import bindRoutes from "./bindRoutes";
import {updateSailsRC} from "../helpers/system";


export default async function () {
  console.log("MM")
  sails.config.modulemanager.navbarHelper = require('../helpers/navbarHelper');

  // check that .sailsrc file is up-to-date for current modules
  // let updateSailsRCResult = await updateSailsRC();
  // if (updateSailsRCResult === "hasUpdated") {
  //   sails.log.info("Restart will be executed due to .sailsrc update");
  //   process.exit(0);
  // }

  return
};


