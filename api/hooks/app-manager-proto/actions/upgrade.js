const { spawn } = require('child_process');
const fs = require('fs');
const axios = require('axios');
const restartScheduler = require('../helpers/restartScheduler');
let activeUpdate = null;

module.exports = async function (req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    } else if (!req.adminizer.accessRightsHelper.hasPermission(`modules-process-upgrade`, req.user)) {
        console.log("No access to admin-frontend-module");
        console.log(req.user, req.adminizer.accessRightsHelper.hasPermission(`modules-process-upgrade`, req.user));
        return res.sendStatus(403);
    }


    // Get environment variables
    const WEBRESTO_MODULES_LISTFILE = process.env.WEBRESTO_MODULES_LISTFILE || '';
    const WEBRESTO_LICENSE = process.env.WEBRESTO_LICENSE || '';
    const modulesPath = '/app/modules';
    const scriptPath = '/app/.ci/utils/install_webresto_dependencies';
    const appId = typeof req.query.appId === 'string' ? req.query.appId.trim() : '';
    const isInstall = req.query.action === 'install';

    if (!appId || !/^[a-zA-Z0-9._-]+$/.test(appId)) {
        return res.status(400).send('A valid appId is required');
    }

    const managedModule = await Module.findOne({ appId, isDeleted: { '!=': true } });
    if (!isInstall && !managedModule) {
        return res.status(404).send('Managed module not found');
    }
    if (isInstall && managedModule) {
        return res.status(409).send('Module is already installed');
    }

    if (activeUpdate) {
        return res.status(409).send(`Module ${activeUpdate} is already being updated`);
    }

    if (!WEBRESTO_MODULES_LISTFILE) {
        return res.status(400).send('WEBRESTO_MODULES_LISTFILE environment variable is not set');
    }

    if (isInstall) {
        try {
            const explicitChannel = process.env.WR_MODULES_CHANNEL;
            const staging = ['1', 'true', 'yes'].includes(String(process.env.STAGING || '').toLowerCase());
            const channel = ['main', 'staging', 'any'].includes(explicitChannel)
                ? explicitChannel
                : (staging ? 'any' : 'main');
            const marketplaceResponse = await axios.get('https://marketplace.restoapp.org/getModuleDetails', {
                params: { appId, token: WEBRESTO_LICENSE, channel },
                timeout: 12000
            });
            if (!marketplaceResponse.data || marketplaceResponse.data.id !== appId || marketplaceResponse.data.purchased === false) {
                return res.status(403).send('Module is not available for this license');
            }

            const listContent = fs.existsSync(WEBRESTO_MODULES_LISTFILE)
                ? fs.readFileSync(WEBRESTO_MODULES_LISTFILE, 'utf8')
                : '';
            const entries = listContent.split(/\r?\n/).map((line) => line.trim());
            if (!entries.includes(appId)) {
                const separator = listContent && !listContent.endsWith('\n') ? '\n' : '';
                fs.appendFileSync(WEBRESTO_MODULES_LISTFILE, `${separator}${appId}\n`, 'utf8');
            }
        } catch (error) {
            sails.log.warn(`MM: could not validate marketplace module ${appId}`, error);
            return res.status(502).send('Could not validate marketplace module');
        }
    }

    // Set headers for text streaming
    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    res.write(`=== Starting WebResto module ${isInstall ? 'installation' : 'upgrade'} ===\n\n`);
    res.write(`Script: ${scriptPath}\n`);
    res.write(`Modules list: ${WEBRESTO_MODULES_LISTFILE}\n`);
    res.write(`Target path: ${modulesPath}\n`);
    res.write(`License: ${WEBRESTO_LICENSE ? '***' : 'not set'}\n\n`);
    res.write(`Module: ${appId}\n\n`);
    res.write('===========================================\n\n');

    // Spawn the installation script with update flag
    activeUpdate = appId;
    const child = spawn('bash', [
        scriptPath,
        WEBRESTO_MODULES_LISTFILE,
        modulesPath,
        WEBRESTO_LICENSE,
        '--update' // Force update flag
    ], {
        env: {
            ...process.env,
            FORCE_UPDATE: 'true',
            WR_UPDATE_MODULE: appId
        }
    });

    // Stream stdout
    child.stdout.on('data', (data) => {
        res.write(data.toString());
    });

    // Stream stderr
    child.stderr.on('data', (data) => {
        res.write(`[ERROR] ${data.toString()}`);
    });

    // Handle process completion
    child.on('close', (code) => {
        activeUpdate = null;
        res.write(`\n\n===========================================\n`);
        if (code === 0) {
            res.write(`✓ Upgrade completed successfully (exit code: ${code})\n`);
            restartScheduler.scheduleRestart();
        } else {
            res.write(`✗ Upgrade failed with exit code: ${code}\n`);
        }
        res.write('===========================================\n');
        res.end();
    });

    // Handle errors
    child.on('error', (error) => {
        activeUpdate = null;
        res.write(`\n\n[FATAL ERROR] ${error.message}\n`);
        res.end();
    });

    // Stop the installer only when the client disconnects before a response is complete.
    req.on('aborted', () => {
        if (!child.killed) {
            child.kill();
        }
    });
};
