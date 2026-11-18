const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const restartScheduler = require('./restartScheduler');
const { checkModule, loadModule } = require('./loadHelper');
const ModuleHelper = require('./moduleHelper').default;
const SettingsHelper = require('./settingsHelper').default;
const MigrationsHelper = require('./migrationsHelper').default;
const {
    addModuleToList,
    installMarketplaceModule,
    isPathInside,
    removeModuleFromList,
    resolveModulesListFile,
    resolveRegistryUrl,
    runNpmInstall
} = require('./moduleInstaller');

/**
 * Installing, updating and removing a module, as a job that outlives the request: a phone waits 15
 * seconds for an answer, and `npm install` does not (C34). The web page and the phone call the same
 * functions, so they have one lock and one set of refusals.
 *
 * The jobs and the lock live in the memory of this process, like the restart scheduler beside it.
 * A restart forgets them, and that is the truth: nothing is running any more.
 */

const KEPT_JOBS = 20;
const KEPT_LOG_LINES = 200;
const VALID_APP_ID = /^[a-zA-Z0-9._-]+$/;

const jobs = new Map();
let active = null;

/** Why a job was not started. `reason` is for words on a phone, `message` and `status` are what the web page always answered. */
class ModuleRefusal extends Error {
    constructor(reason, status, message, details = null) {
        super(message);
        this.reason = reason;
        this.status = status;
        this.details = details;
    }
}

function resolveChannel() {
    const explicitChannel = process.env.WR_MODULES_CHANNEL;
    const staging = ['1', 'true', 'yes'].includes(String(process.env.STAGING || '').toLowerCase());
    return ['main', 'staging', 'any'].includes(explicitChannel)
        ? explicitChannel
        : (staging ? 'any' : 'main');
}

function assertValidAppId(appId) {
    if (!appId || typeof appId !== 'string' || !VALID_APP_ID.test(appId)) {
        throw new ModuleRefusal('invalid', 400, 'A valid appId is required');
    }
}

function assertNotBusy() {
    if (active) {
        throw new ModuleRefusal('busy', 409, `Module ${active.appId} is already being ${active.kind === 'remove' ? 'removed' : 'updated'}`, { appId: active.appId, kind: active.kind });
    }
}

function managedModuleOf(appId) {
    return Module.findOne({ appId, isDeleted: { '!=': true } });
}

/** What went wrong inside a job, in the terms a person can be told about. */
function failureOf(error) {
    if (error instanceof ModuleRefusal) {
        return { reason: error.reason, status: error.status, message: error.message, details: error.details };
    }
    const message = error?.response?.data?.message || error?.message || String(error);
    if (error?.code === '5') return { reason: 'incompatible', status: 500, message, details: error.errors ?? null };
    if (error?.isAxiosError) return { reason: 'registry', status: 500, message, details: null };
    return { reason: 'failed', status: 500, message, details: null };
}

function run(kind, appId, work) {
    const job = {
        id: crypto.randomUUID(),
        kind,
        appId,
        state: 'running',
        step: 'start',
        log: [],
        error: null,
        restartScheduled: false,
        startedAt: Date.now(),
        finishedAt: null,
        finished: null
    };
    const write = (text) => {
        job.log.push(...String(text).split(/\r?\n/).filter(Boolean));
        if (job.log.length > KEPT_LOG_LINES) job.log.splice(0, job.log.length - KEPT_LOG_LINES);
    };
    active = job;
    jobs.set(job.id, job);
    for (const id of jobs.keys()) {
        if (jobs.size <= KEPT_JOBS) break;
        if (jobs.get(id) !== active) jobs.delete(id);
    }
    // Never rejects: the outcome of a job is on the job, and whoever waits reads it from there.
    job.finished = Promise.resolve()
        .then(() => work(job, write))
        .then(() => {
            restartScheduler.scheduleRestart();
            job.restartScheduled = true;
            job.state = 'done';
        })
        .catch((error) => {
            sails.log.error(`MM: the ${kind} of module ${appId} failed`, error);
            job.error = failureOf(error);
            job.state = 'failed';
        })
        .then(() => {
            job.finishedAt = Date.now();
            active = null;
        });
    return job;
}

async function installWork(job, write, isInstall) {
    const { appId } = job;
    const moduleManagerConfig = sails.config.modulemanager || {};
    const modulesPath = moduleManagerConfig.modulesPath;
    const modulesListFile = resolveModulesListFile(moduleManagerConfig);
    const registryUrl = resolveRegistryUrl(moduleManagerConfig);
    const channel = resolveChannel();
    const license = process.env.WEBRESTO_LICENSE || '';
    const existingRecord = await Module.findOne({ appId });
    const directoryName = existingRecord?.directoryName || appId;

    if (isInstall) {
        job.step = 'license';
        const marketplaceResponse = await axios.get(`${registryUrl}/getModuleDetails`, {
            params: { appId, token: license, channel },
            timeout: 12000
        });
        if (!marketplaceResponse.data || marketplaceResponse.data.id !== appId || marketplaceResponse.data.purchased === false) {
            throw new ModuleRefusal('license', 403, 'Module is not available for this license');
        }
    }

    job.step = 'download';
    const installed = await installMarketplaceModule({
        appId,
        channel,
        license,
        modulesPath,
        registryUrl,
        directoryName,
        validateModule: async (modulePath) => {
            job.step = 'check';
            return checkModule(modulePath);
        },
        installDependencies: (modulePath, onOutput) => {
            job.step = 'dependencies';
            return runNpmInstall(modulePath, onOutput);
        },
        onOutput: write
    });

    job.step = 'load';
    try {
        await loadModule(installed.modulePath, 'webresto-registry');
        await Module.update({ appId }, { isDeleted: false, enable: true }).fetch();
        const runtimeModule = ModuleHelper.getModules()[appId];
        if (runtimeModule) {
            runtimeModule.enable = true;
            ModuleHelper.addModule(appId, runtimeModule);
        }
        await SettingsHelper.processSettings(appId);
        // the module's migrations now: at the start the manager turns an enabled module off while its migrations
        // are not processed, and processes only the enabled ones
        await MigrationsHelper.processSpecificModuleMigrations(appId);
        addModuleToList(modulesListFile, appId);
    } catch (error) {
        ModuleHelper.deleteModule(appId);
        const record = await Module.findOne({ appId });
        if (record) await Module.update({ appId }, { isDeleted: true, enable: false }).fetch();
        if (fs.existsSync(installed.modulePath)) fs.rmSync(installed.modulePath, { recursive: true, force: true });
        throw error;
    }

    write(`Module ${appId} ${isInstall ? 'installed' : 'updated'} successfully`);
    write(`Modules list: ${modulesListFile}`);
    write(`Target path: ${modulesPath}`);
}

async function startInstall(kind, appId) {
    assertValidAppId(appId);
    const isInstall = kind === 'install';
    const managedModule = await managedModuleOf(appId);
    if (!isInstall && !managedModule) throw new ModuleRefusal('not_found', 404, 'Managed module not found');
    if (isInstall && managedModule) throw new ModuleRefusal('installed', 409, 'Module is already installed');
    // Pressing again what is already going is coming back to it, not a refusal.
    if (active && active.appId === appId && active.kind === kind) return active;
    assertNotBusy();
    return run(kind, appId, (job, write) => installWork(job, write, isInstall));
}

async function removeWork(job, write, moduleDir, modulesListFile) {
    const { appId } = job;
    job.step = 'remove';
    if (fs.existsSync(moduleDir)) fs.rmSync(moduleDir, { recursive: true, force: true });
    await Module.update({ appId }, { isDeleted: true, enable: false }).fetch();
    // Sales channels of this provider go with it (core decides which ones). Called before
    // the restart, while the provider's channel adapter is still loaded. Older cores lack it.
    if (typeof SalesChannel !== 'undefined' && typeof SalesChannel.removeProviderChannels === 'function') {
        try {
            await SalesChannel.removeProviderChannels(appId);
        } catch (error) {
            sails.log.warn(`MM: could not clean up sales channels of ${appId}`, error);
        }
    }
    ModuleHelper.deleteModule(appId);
    removeModuleFromList(modulesListFile, appId);

    write(`Module ${appId} removed successfully`);
    write(`Modules list: ${modulesListFile}`);
    write(`Removed directory: ${moduleDir}`);
}

async function startRemove(appId) {
    assertValidAppId(appId);
    const moduleManagerConfig = sails.config.modulemanager || {};
    const modulesListFile = resolveModulesListFile(moduleManagerConfig);
    const modulesRoot = path.resolve(moduleManagerConfig.modulesPath);
    const managedModule = await managedModuleOf(appId);
    if (!managedModule) throw new ModuleRefusal('not_found', 404, 'Managed module not found');
    if (ModuleHelper.getSystemModuleList().includes(appId)) {
        throw new ModuleRefusal('system', 403, 'System module can not be removed');
    }
    // A module may declare about itself that it stays: `modulemanager.forbidDelete` of its package.json (C44).
    if (ModuleHelper.getModules()[appId]?.module?.modulemanager?.forbidDelete === true) {
        throw new ModuleRefusal('forbidden', 403, 'Module forbids its own removal');
    }

    const blockingDependents = (await Module.find({ isDeleted: { '!=': true } }).populate('dependencies'))
        .filter((item) => item.appId !== appId
            && (item.dependencies || []).some((dependency) => dependency.appId === appId))
        .map((item) => item.appId);
    if (blockingDependents.length) {
        throw new ModuleRefusal('dependents', 409, `Module is required by: ${blockingDependents.join(', ')}`, { dependents: blockingDependents });
    }

    const directoryName = managedModule.directoryName || appId;
    const moduleDir = path.resolve(modulesRoot, directoryName);
    if (!isPathInside(modulesRoot, moduleDir)) {
        throw new ModuleRefusal('outside', 400, 'Module directory is outside of the modules path');
    }

    if (active && active.appId === appId && active.kind === 'remove') return active;
    assertNotBusy();
    return run('remove', appId, (job, write) => removeWork(job, write, moduleDir, modulesListFile));
}

/** A job as an answer: everything but the promise. */
function view(job) {
    const { finished, ...plain } = job;
    return { ...plain, log: [...job.log] };
}

module.exports = {
    ModuleRefusal,
    /** Each answers at once with the job, or throws a `ModuleRefusal`; `job.finished` resolves when it is over. */
    install: (appId) => startInstall('install', appId),
    update: (appId) => startInstall('update', appId),
    remove: startRemove,
    get: (id) => jobs.get(id) ?? null,
    view
};
