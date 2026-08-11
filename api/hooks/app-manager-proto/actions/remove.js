const fs = require('fs');
const path = require('path');
const restartScheduler = require('../helpers/restartScheduler');
const ModuleHelper = require('../helpers/moduleHelper').default;
const {
    isPathInside,
    removeModuleFromList,
    resolveModulesListFile
} = require('../helpers/moduleInstaller');

let activeRemoval = null;

module.exports = async function (req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }
    if (!req.adminizer.accessRightsHelper.hasPermission('modules-process-upgrade', req.user)) {
        return res.sendStatus(403);
    }

    const appId = typeof req.query.appId === 'string' ? req.query.appId.trim() : '';
    if (!appId || !/^[a-zA-Z0-9._-]+$/.test(appId)) {
        return res.status(400).send('A valid appId is required');
    }
    if (activeRemoval) return res.status(409).send(`Module ${activeRemoval} is already being removed`);

    const moduleManagerConfig = sails.config.modulemanager || {};
    const modulesListFile = resolveModulesListFile(moduleManagerConfig);
    const modulesRoot = path.resolve(moduleManagerConfig.modulesPath);
    const managedModule = await Module.findOne({ appId, isDeleted: { '!=': true } });
    if (!managedModule) return res.status(404).send('Managed module not found');
    if (ModuleHelper.getSystemModuleList().includes(appId)) {
        return res.status(403).send('System module can not be removed');
    }

    const blockingDependents = (await Module.find({ isDeleted: { '!=': true } }).populate('dependencies'))
        .filter((item) => item.appId !== appId
            && (item.dependencies || []).some((dependency) => dependency.appId === appId))
        .map((item) => item.appId);
    if (blockingDependents.length) {
        return res.status(409).send(`Module is required by: ${blockingDependents.join(', ')}`);
    }

    const directoryName = managedModule.directoryName || appId;
    const moduleDir = path.resolve(modulesRoot, directoryName);
    if (!isPathInside(modulesRoot, moduleDir)) {
        return res.status(400).send('Module directory is outside of the modules path');
    }

    activeRemoval = appId;
    try {
        if (fs.existsSync(moduleDir)) fs.rmSync(moduleDir, { recursive: true, force: true });
        await Module.update({ appId }, { isDeleted: true, enable: false }).fetch();
        ModuleHelper.deleteModule(appId);
        removeModuleFromList(modulesListFile, appId);
        restartScheduler.scheduleRestart();

        return res.status(200).send([
            `Module ${appId} removed successfully`,
            `Modules list: ${modulesListFile}`,
            `Removed directory: ${moduleDir}`
        ].join('\n'));
    } catch (error) {
        sails.log.error(`MM: could not remove module ${appId}`, error);
        return res.status(500).send(error?.message || String(error));
    } finally {
        activeRemoval = null;
    }
};
