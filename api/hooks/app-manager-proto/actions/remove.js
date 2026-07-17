const fs = require('fs');
const path = require('path');
const restartScheduler = require('../helpers/restartScheduler');
const ModuleHelper = require('../helpers/moduleHelper').default;
let activeRemoval = null;

module.exports = async function (req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    } else if (!req.adminizer.accessRightsHelper.hasPermission(`modules-process-upgrade`, req.user)) {
        return res.sendStatus(403);
    }

    const WEBRESTO_MODULES_LISTFILE = process.env.WEBRESTO_MODULES_LISTFILE || '';
    const modulesPath = sails.config.modulemanager.modulesPath || '/app/modules';
    const appId = typeof req.query.appId === 'string' ? req.query.appId.trim() : '';

    if (!appId || !/^[a-zA-Z0-9._-]+$/.test(appId)) {
        return res.status(400).send('A valid appId is required');
    }

    if (activeRemoval) {
        return res.status(409).send(`Module ${activeRemoval} is already being removed`);
    }

    if (!WEBRESTO_MODULES_LISTFILE) {
        return res.status(400).send('WEBRESTO_MODULES_LISTFILE environment variable is not set');
    }

    const managedModule = await Module.findOne({ appId, isDeleted: { '!=': true } });
    if (!managedModule) {
        return res.status(404).send('Managed module not found');
    }

    // System modules are provided by the image, not by the modules list file.
    if (ModuleHelper.getSystemModuleList().includes(appId)) {
        return res.status(403).send('System module can not be removed');
    }

    // Refuse while other installed modules still declare this one as a dependency.
    const blockingDependents = (await Module.find({ isDeleted: { '!=': true } }).populate('dependencies'))
        .filter((item) => item.appId !== appId
            && (item.dependencies || []).some((dependency) => dependency.appId === appId))
        .map((item) => item.appId);

    if (blockingDependents.length) {
        return res.status(409).send(`Module is required by: ${blockingDependents.join(', ')}`);
    }

    activeRemoval = appId;

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write(`=== Starting WebResto module removal ===\n\n`);
    res.write(`Modules list: ${WEBRESTO_MODULES_LISTFILE}\n`);
    res.write(`Target path: ${modulesPath}\n`);
    res.write(`Module: ${appId}\n\n`);
    res.write('===========================================\n\n');

    try {
        // Drop the module from the list file so the installer stops restoring it.
        if (fs.existsSync(WEBRESTO_MODULES_LISTFILE)) {
            const listContent = fs.readFileSync(WEBRESTO_MODULES_LISTFILE, 'utf8');
            const keptLines = listContent.split(/\r?\n/).filter((line) => line.trim() !== appId);
            const body = keptLines.join('\n').replace(/\n+$/, '');
            const nextContent = body ? `${body}\n` : '';
            fs.writeFileSync(WEBRESTO_MODULES_LISTFILE, nextContent, 'utf8');
            res.write(`Removed ${appId} from modules list\n`);
        } else {
            res.write(`Modules list file not found - nothing to clean up there\n`);
        }

        // Remove module files.
        const directoryName = managedModule.directoryName || appId;
        const moduleDir = path.resolve(modulesPath, directoryName);
        const modulesRoot = path.resolve(modulesPath);
        if (moduleDir !== modulesRoot && moduleDir.startsWith(`${modulesRoot}${path.sep}`)) {
            if (fs.existsSync(moduleDir)) {
                fs.rmSync(moduleDir, { recursive: true, force: true });
                res.write(`Removed directory ${moduleDir}\n`);
            } else {
                res.write(`Directory ${moduleDir} does not exist - skipping\n`);
            }
        } else {
            res.write(`[ERROR] Refusing to remove suspicious path ${moduleDir}\n`);
            throw new Error('Module directory is outside of the modules path');
        }

        // Mark as deleted and disabled, drop it from the runtime registry.
        await Module.update({ appId }, { isDeleted: true, enable: false }).fetch();
        ModuleHelper.deleteModule(appId);
        res.write(`Module ${appId} marked as deleted\n`);

        res.write(`\n\n===========================================\n`);
        res.write(`✓ Removal completed successfully\n`);
        res.write('===========================================\n');
        restartScheduler.scheduleRestart();
    } catch (error) {
        sails.log.error(`MM: could not remove module ${appId}`, error);
        res.write(`\n\n[FATAL ERROR] ${error.message}\n`);
    } finally {
        activeRemoval = null;
        res.end();
    }
};
