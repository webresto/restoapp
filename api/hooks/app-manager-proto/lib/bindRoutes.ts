// let _myModules = require('../actions/myModules');
// let _updates = require('../actions/updates');
// let _market = require('../actions/market');
// let _changeModuleState = require('../actions/changeModuleState');
// let _addNewModule = require('../actions/addNewModule');
// let _installModule = require('../actions/installModule');
// let _exit = require('../actions/exit');
// let _moduleDetails = require('../actions/moduleDetails');
// let _deleteModule = require('../actions/deleteModule');
// let _getTranslations = require('../actions/getTranslations');
// let _getMaxCompatibleVersion = require('../actions/getMaxCompatibleVersion');

// import bindPolicies from "sails-adminpanel/lib/bindPolicies";

import _processInstallStep from '../actions/processInstallStep';
import _processInstallFinalize from '../actions/processInstallFinalize';
const _upgrade = require('../actions/upgrade');
const _exit = require('../actions/exit');
import multer from 'multer';

export default function bindRoutes(sails: any) {
      const adminizer = sails.hooks.adminpanel.adminizer;
      adminizer.emitter.on('adminizer:loaded', function () {
        // Adminizer is already loaded when this function is called
        const policies = adminizer.config.policies;
        const routePrefix = adminizer.config.routePrefix;
        
        // Configure multer for file uploads
        const upload = multer({ 
            dest: 'installStepper/uploadedImages/',
            limits: {
                fileSize: 100000000 // 100MB limit
            }
        });
        
        // Register routes with proper adminizer policies (including CSRF) and file upload support
        adminizer.app.all(
            `${routePrefix}/install/:id`,
            upload.any(), // Handle any files
            adminizer.policyManager.bindPolicies(policies, _processInstallStep)
        );
        
        adminizer.app.all(
            `${routePrefix}/install/:id/finalize`,
            adminizer.policyManager.bindPolicies(policies, _processInstallFinalize)
        );
        
        // Upgrade route for WebResto modules
        adminizer.app.get(
            `${routePrefix}/modules/upgrade`,
            adminizer.policyManager.bindPolicies(policies, _upgrade)
        );
        
        // Exit/reboot route
        adminizer.app.get(
            `${routePrefix}/modules/exit`,
            adminizer.policyManager.bindPolicies(policies, _exit)
        );
      });
  // Disable other routes due upgrade to latest sails-adminpanel  
  return
    // const policies = sails.config.adminpanel.policies
    // require(`${sails.config.adminpanel.rootPath}/lib/bindResView`);

    // //Create a base instance route
    // let baseRoute = sails.config.adminpanel.routePrefix;
    // //sails.log.debug("BaseRoute: ", baseRoute);

    // // redirect to /my from /modules
    // sails.router.bind(`${baseRoute}/modules`, `${baseRoute}/modules/my`);

    // // marketplace route
    // let market = bindPolicies(policies, _market)
    // sails.router.bind(`${baseRoute}/modules/market`, market);

    // // module details route
    // sails.router.bind(`${baseRoute}/modules/moduleDetails`, bindPolicies(policies,_moduleDetails));

    // // my modules route
    // sails.router.bind(`${baseRoute}/modules/my`, bindPolicies(policies,_myModules));

    // // add new module route
    // sails.router.bind(`${baseRoute}/modules/addNewModule`, bindPolicies(policies,_addNewModule), "POST", {csrf: false});

    // // install module route
    // sails.router.bind(`${baseRoute}/modules/installModule`, bindPolicies(policies,_installModule));

    // // delete module route
    // sails.router.bind(`${baseRoute}/modules/deleteModule`, bindPolicies(policies,_deleteModule));

    // // exit app route
    // sails.router.bind(`${baseRoute}/modules/exit`, bindPolicies(policies,_exit));

    // // updates route
    // sails.router.bind(`${baseRoute}/modules/updates`, bindPolicies(policies,_updates));

    // // module changing state route
    // sails.router.bind(`${baseRoute}/module/:appId/changeModuleState`, bindPolicies(policies,_changeModuleState));

    // // module get translations route
    // sails.router.bind(`${baseRoute}/module/:appId/getTranslations`, bindPolicies(policies,_getTranslations));

    // // module get max compatible version route
    // sails.router.bind(`${baseRoute}/module/:appId/getMaxCompatibleVersion`, bindPolicies(policies,_getMaxCompatibleVersion));

    // // fileupload route
    // let _upload = require(`${sails.config.adminpanel.rootPath}/controllers/upload`);
    // sails.router.bind(`${baseRoute}/module/:instance/upload`, bindPolicies(policies,_upload));

    // // add link to adminpanel sections
    // sails.config.adminpanel.sections.push({
		// id: 'modules',
    //     title: 'Modules',
    //     link: `${baseRoute}/modules/my`,
    //     icon: `box`,
		// 		accessRightsToken: "module-manager-access"
    // })
};
