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
import _modulesVersions from '../actions/modulesVersions';
const _upgrade = require('../actions/upgrade');
const _exit = require('../actions/exit');
const _restart = require('../actions/restart');
import multer from 'multer';

function normalizeHandlers(bound: any): any[] {
    return Array.isArray(bound) ? bound : [bound];
}

function makeAdminizerBinder(adminizer: any): (action: any) => any[] {
    const hasMiddlewareManager =
        adminizer.middlewareManager &&
        typeof adminizer.middlewareManager.bindMiddlewares === 'function';

    if (hasMiddlewareManager) {
        const middlewares = adminizer.config.middlewares ?? [];
        return (action: any) => normalizeHandlers(adminizer.middlewareManager.bindMiddlewares(middlewares, action));
    }

    const policies = adminizer.config.policies;
    return (action: any) => normalizeHandlers(adminizer.policyManager.bindPolicies(policies, action));
}

export default function bindRoutes(sails: any) {
      const adminizer = sails.hooks.adminpanel.adminizer;
      adminizer.emitter.on('adminizer:loaded', function () {
        const routePrefix = adminizer.config.routePrefix;
        const bind = makeAdminizerBinder(adminizer);

        // Configure multer for file uploads
        const upload = multer({
            dest: 'installStepper/uploadedImages/',
            limits: {
                fileSize: 100000000 // 100MB limit
            }
        });

        // Register routes with proper adminizer middlewares (including CSRF) and file upload support
        adminizer.app.all(
            `${routePrefix}/install/:id`,
            upload.any(), // Handle any files
            ...bind(_processInstallStep)
        );

        adminizer.app.all(
            `${routePrefix}/install/:id/finalize`,
            ...bind(_processInstallFinalize)
        );

        // Upgrade route for WebResto modules
        adminizer.app.get(
            `${routePrefix}/modules/upgrade`,
            ...bind(_upgrade)
        );

        // Exit/reboot route
        adminizer.app.get(
            `${routePrefix}/modules/exit`,
            ...bind(_exit)
        );

        adminizer.app.get(
            `${routePrefix}/modules/restart`,
            ...bind(_restart)
        );

        // Managed extensions versions page
        adminizer.app.get(
            `${routePrefix}/modules/versions`,
            ...bind(_modulesVersions)
        );

        adminizer.app.get(
            `${routePrefix}/modules/catalog`,
            ...bind(_modulesVersions)
        );

        if (!adminizer.config.navbar) {
            adminizer.config.navbar = {};
        }

        if (!Array.isArray(adminizer.config.navbar.additionalLinks)) {
            adminizer.config.navbar.additionalLinks = [];
        }

        if (!adminizer.config.navbar.additionalLinks.some((item: any) => item.id === 'app-manager-proto-modules-versions')) {
            adminizer.config.navbar.additionalLinks.push({
                id: 'app-manager-proto-modules-versions',
                title: 'Extensions',
                link: `${routePrefix}/modules/versions`,
                icon: 'extension',
                section: 'Store'
            });
        }
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
