const axios = require('axios');
const fs = require('fs');
const restartScheduler = require('../helpers/restartScheduler');
const { checkModule, loadModule } = require('../helpers/loadHelper');
const ModuleHelper = require('../helpers/moduleHelper').default;
const SettingsHelper = require('../helpers/settingsHelper').default;
const {
    addModuleToList,
    installMarketplaceModule,
    resolveModulesListFile,
    resolveRegistryUrl
} = require('../helpers/moduleInstaller');

let activeUpdate = null;

function resolveChannel() {
    const explicitChannel = process.env.WR_MODULES_CHANNEL;
    const staging = ['1', 'true', 'yes'].includes(String(process.env.STAGING || '').toLowerCase());
    return ['main', 'staging', 'any'].includes(explicitChannel)
        ? explicitChannel
        : (staging ? 'any' : 'main');
}

module.exports = async function (req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }
    if (!req.adminizer.accessRightsHelper.hasPermission('modules-process-upgrade', req.user)) {
        return res.sendStatus(403);
    }

    const appId = typeof req.query.appId === 'string' ? req.query.appId.trim() : '';
    const isInstall = req.query.action === 'install';
    if (!appId || !/^[a-zA-Z0-9._-]+$/.test(appId)) {
        return res.status(400).send('A valid appId is required');
    }

    const managedModule = await Module.findOne({ appId, isDeleted: { '!=': true } });
    if (!isInstall && !managedModule) return res.status(404).send('Managed module not found');
    if (isInstall && managedModule) return res.status(409).send('Module is already installed');
    if (activeUpdate) return res.status(409).send(`Module ${activeUpdate} is already being updated`);

    const moduleManagerConfig = sails.config.modulemanager || {};
    const modulesPath = moduleManagerConfig.modulesPath;
    const modulesListFile = resolveModulesListFile(moduleManagerConfig);
    const registryUrl = resolveRegistryUrl(moduleManagerConfig);
    const channel = resolveChannel();
    const license = process.env.WEBRESTO_LICENSE || '';
    const existingRecord = await Module.findOne({ appId });
    const directoryName = existingRecord?.directoryName || appId;

    activeUpdate = appId;
    try {
        if (isInstall) {
            const marketplaceResponse = await axios.get(`${registryUrl}/getModuleDetails`, {
                params: { appId, token: license, channel },
                timeout: 12000
            });
            if (!marketplaceResponse.data || marketplaceResponse.data.id !== appId || marketplaceResponse.data.purchased === false) {
                return res.status(403).send('Module is not available for this license');
            }
        }

        const output = [];
        const installed = await installMarketplaceModule({
            appId,
            channel,
            license,
            modulesPath,
            registryUrl,
            directoryName,
            validateModule: async (modulePath) => checkModule(modulePath),
            onOutput: (line) => output.push(line)
        });

        try {
            await loadModule(installed.modulePath, 'webresto-registry');
            await Module.update({ appId }, { isDeleted: false, enable: true }).fetch();
            const runtimeModule = ModuleHelper.getModules()[appId];
            if (runtimeModule) {
                runtimeModule.enable = true;
                ModuleHelper.addModule(appId, runtimeModule);
            }
            await SettingsHelper.processSettings(appId);
            addModuleToList(modulesListFile, appId);
        } catch (error) {
            ModuleHelper.deleteModule(appId);
            const record = await Module.findOne({ appId });
            if (record) await Module.update({ appId }, { isDeleted: true, enable: false }).fetch();
            if (fs.existsSync(installed.modulePath)) fs.rmSync(installed.modulePath, { recursive: true, force: true });
            throw error;
        }

        restartScheduler.scheduleRestart();
        return res.status(200).send([
            `Module ${appId} ${isInstall ? 'installed' : 'updated'} successfully`,
            `Modules list: ${modulesListFile}`,
            `Target path: ${modulesPath}`,
            ...output
        ].join('\n'));
    } catch (error) {
        sails.log.error(`MM: could not ${isInstall ? 'install' : 'update'} module ${appId}`, error);
        const message = error?.response?.data?.message || error?.message || String(error);
        return res.status(500).send(message);
    } finally {
        activeUpdate = null;
    }
};
