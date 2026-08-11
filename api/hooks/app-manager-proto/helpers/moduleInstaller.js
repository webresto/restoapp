const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const tar = require('tar');

const DEFAULT_REGISTRY_URL = 'https://marketplace.restoapp.org';

function resolveModulesListFile(config = {}) {
    return path.resolve(
        process.env.WEBRESTO_MODULES_LISTFILE
        || config.modulesListFile
        || path.join(process.cwd(), 'webresto-modules.list')
    );
}

function resolveRegistryUrl(config = {}) {
    const configuredRepository = Array.isArray(config.repositories)
        ? config.repositories.find((repository) => repository?.type === 'storage' && repository?.link)
        : null;
    return String(
        process.env.MODULE_STORAGE_URL
        || process.env.WEBRESTO_REGISTRY
        || configuredRepository?.link
        || DEFAULT_REGISTRY_URL
    ).replace(/\/+$/, '');
}

function isPathInside(parent, candidate) {
    const relative = path.relative(path.resolve(parent), path.resolve(candidate));
    return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

function assertSafeArchiveEntry(entry) {
    const entryPath = String(entry.path || '').replace(/\\/g, '/');
    const normalized = path.posix.normalize(entryPath);
    if (!entryPath || path.posix.isAbsolute(normalized) || normalized === '..' || normalized.startsWith('../')) {
        throw new Error(`Unsafe path in module archive: ${entryPath}`);
    }

    if (entry.linkpath) {
        const linkPath = String(entry.linkpath).replace(/\\/g, '/');
        const normalizedLink = path.posix.normalize(linkPath);
        if (path.posix.isAbsolute(normalizedLink) || normalizedLink === '..' || normalizedLink.startsWith('../')) {
            throw new Error(`Unsafe link in module archive: ${entryPath}`);
        }
    }
}

async function inspectArchive(archivePath) {
    let archiveError = null;
    await tar.t({
        file: archivePath,
        strict: true,
        onentry(entry) {
            if (archiveError) return;
            try {
                assertSafeArchiveEntry(entry);
            } catch (error) {
                archiveError = error;
            }
        }
    });
    if (archiveError) throw archiveError;
}

function findExtractedModuleRoot(extractRoot) {
    if (fs.existsSync(path.join(extractRoot, 'package.json'))) return extractRoot;

    const directories = fs.readdirSync(extractRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory());
    if (directories.length === 1) {
        const nestedRoot = path.join(extractRoot, directories[0].name);
        if (fs.existsSync(path.join(nestedRoot, 'package.json'))) return nestedRoot;
    }

    throw new Error('Downloaded module archive does not contain package.json');
}

function getPackageAppId(packageInfo) {
    return packageInfo.appId || String(packageInfo.name || '').replace(/^(@.+?[\/\\])?(sails-hook-)?/, '');
}

function runNpmInstall(modulePath, onOutput = () => {}) {
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    return new Promise((resolve, reject) => {
        const child = spawn(command, ['install', '--omit=dev', '--force'], {
            cwd: modulePath,
            env: process.env,
            windowsHide: true,
            // Windows cannot execute npm.cmd directly with shell:false.
            // Arguments are fixed constants, so no request data reaches the shell.
            shell: process.platform === 'win32'
        });

        child.stdout.on('data', (data) => onOutput(data.toString()));
        child.stderr.on('data', (data) => onOutput(data.toString()));
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) return resolve();
            reject(new Error(`npm install failed with exit code ${code}`));
        });
    });
}

async function installMarketplaceModule(options) {
    const {
        appId,
        channel = 'main',
        license = '',
        modulesPath,
        registryUrl = DEFAULT_REGISTRY_URL,
        directoryName = appId,
        httpClient = axios,
        installDependencies = runNpmInstall,
        validateModule = async () => {},
        onOutput = () => {}
    } = options;

    if (!appId || !/^[a-zA-Z0-9._-]+$/.test(appId)) throw new Error('A valid appId is required');

    const modulesRoot = path.resolve(modulesPath);
    fs.mkdirSync(modulesRoot, { recursive: true });
    const stagingRoot = fs.mkdtempSync(path.join(modulesRoot, `.install-${appId}-`));
    const archivePath = path.join(stagingRoot, 'module.tar');
    const extractRoot = path.join(stagingRoot, 'extract');
    const destination = path.resolve(modulesRoot, directoryName);
    const backup = path.join(stagingRoot, 'previous');

    if (!isPathInside(modulesRoot, destination)) {
        fs.rmSync(stagingRoot, { recursive: true, force: true });
        throw new Error('Module destination is outside of the modules path');
    }

    let previousMoved = false;
    try {
        onOutput(`Downloading ${appId} from ${registryUrl}\n`);
        const response = await httpClient.get(`${registryUrl.replace(/\/+$/, '')}/downloadModule/`, {
            params: {
                appId,
                version: 'latest',
                channel,
                ...(license ? { token: license } : {})
            },
            responseType: 'arraybuffer',
            timeout: 120000,
            maxContentLength: 250 * 1024 * 1024,
            maxBodyLength: 250 * 1024 * 1024
        });
        fs.writeFileSync(archivePath, Buffer.from(response.data));
        await inspectArchive(archivePath);

        fs.mkdirSync(extractRoot);
        await tar.x({ file: archivePath, cwd: extractRoot, strict: true, preservePaths: false });
        const moduleRoot = findExtractedModuleRoot(extractRoot);
        const packageInfo = JSON.parse(fs.readFileSync(path.join(moduleRoot, 'package.json'), 'utf8'));
        if (getPackageAppId(packageInfo) !== appId) {
            throw new Error(`Downloaded module appId does not match ${appId}`);
        }

        await validateModule(moduleRoot, packageInfo);
        onOutput(`Installing dependencies for ${appId}\n`);
        await installDependencies(moduleRoot, onOutput);

        if (fs.existsSync(destination)) {
            fs.renameSync(destination, backup);
            previousMoved = true;
        }
        fs.renameSync(moduleRoot, destination);
        if (previousMoved) {
            fs.rmSync(backup, { recursive: true, force: true });
            previousMoved = false;
        }

        return { modulePath: destination, directoryName, packageInfo };
    } catch (error) {
        if (previousMoved && !fs.existsSync(destination) && fs.existsSync(backup)) {
            fs.renameSync(backup, destination);
            previousMoved = false;
        }
        throw error;
    } finally {
        fs.rmSync(stagingRoot, { recursive: true, force: true });
    }
}

function readModulesList(listFile) {
    return fs.existsSync(listFile) ? fs.readFileSync(listFile, 'utf8') : '';
}

function addModuleToList(listFile, appId) {
    const current = readModulesList(listFile);
    const entries = current.split(/\r?\n/).map((line) => line.trim());
    if (entries.includes(appId)) return false;

    fs.mkdirSync(path.dirname(listFile), { recursive: true });
    const separator = current && !current.endsWith('\n') ? '\n' : '';
    fs.appendFileSync(listFile, `${separator}${appId}\n`, 'utf8');
    return true;
}

function removeModuleFromList(listFile, appId) {
    if (!fs.existsSync(listFile)) return false;
    const keptLines = readModulesList(listFile).split(/\r?\n/)
        .filter((line) => line.trim() !== appId);
    const body = keptLines.join('\n').replace(/\n+$/, '');
    fs.writeFileSync(listFile, body ? `${body}\n` : '', 'utf8');
    return true;
}

module.exports = {
    addModuleToList,
    assertSafeArchiveEntry,
    installMarketplaceModule,
    isPathInside,
    removeModuleFromList,
    resolveModulesListFile,
    resolveRegistryUrl,
    runNpmInstall
};
