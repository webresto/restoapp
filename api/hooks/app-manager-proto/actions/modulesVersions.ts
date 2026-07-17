import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import semver from 'semver';
import ModuleHelper from '../helpers/moduleHelper';
const restartScheduler = require('../helpers/restartScheduler');

export default async function modulesVersions(req: any, res: any) {
    const { config } = req.adminizer || {};
    const routePrefix = config?.routePrefix || '/admin';
    const availableLocales: string[] =
        config?.translation?.locales ||
        sails.config?.i18n?.locales ||
        [];

    const normalizeLocale = (value: string): string => {
        if (!value) return value;
        const clean = value.replace('_', '-');
        return clean.split('-')[0];
    };

    const requestedLocale = req?.user?.locale || req?.locale || req?.getLocale?.() || '';
    const normalizedLocale = normalizeLocale(requestedLocale);
    const locale = availableLocales.includes(requestedLocale)
        ? requestedLocale
        : availableLocales.includes(normalizedLocale)
            ? normalizedLocale
            : (config?.translation?.defaultLocale || sails.config?.i18n?.defaultLocale || 'en');

    if (req?.i18n?.setLocale) {
        req.i18n.setLocale(locale);
    }

    const loadModuleLocaleMessages = (value: string): Record<string, string> => {
        const messagesDir = path.resolve(__dirname, '../locales');
        const candidates = [value, normalizeLocale(value), 'en'].filter(Boolean);

        for (const candidate of candidates) {
            const localeFile = path.resolve(messagesDir, `${candidate}.json`);
            if (!fs.existsSync(localeFile)) continue;
            try {
                const fileContent = fs.readFileSync(localeFile, 'utf8');
                return JSON.parse(fileContent);
            } catch (_error) {
                // Ignore malformed locale file and continue fallback chain
            }
        }

        return {};
    };

    const moduleLocaleMessages = loadModuleLocaleMessages(locale);
    const t = (key: string) => {
        if (Object.prototype.hasOwnProperty.call(moduleLocaleMessages, key)) {
            return moduleLocaleMessages[key];
        }
        return req?.i18n?.__ ? req.i18n.__(key) : key;
    };

    if (config?.auth?.enable && !req.user) {
        if (req.Inertia?.redirect) {
            return req.Inertia.redirect(`${routePrefix}/model/userap/login`);
        }
        return res.redirect(`${routePrefix}/model/userap/login`);
    }

    try {
        const isCatalog = /\/modules\/catalog\/?$/.test(req.path || req.url || '');
        const modulesFromDb = await Module.find({
            where: {
                isDeleted: {
                    '!=': true
                }
            },
            sort: 'name ASC'
        });

        const explicitChannel = process.env.WR_MODULES_CHANNEL;
        const staging = ['1', 'true', 'yes'].includes(String(process.env.STAGING || '').toLowerCase());
        const channel = ['main', 'staging', 'any'].includes(explicitChannel || '')
            ? explicitChannel
            : (staging ? 'any' : 'main');
        const license = process.env.WEBRESTO_LICENSE || '';

        if (isCatalog) {
            let catalog: any[] = [];
            let catalogError = '';
            let availableGroups: string[] = [];
            let availableTags: string[] = [];
            const queryValue = (value: any): string => typeof value === 'string' ? value.trim().slice(0, 200) : '';
            const search = queryValue(req.query?.search);
            const group = queryValue(req.query?.group);
            const tags = queryValue(req.query?.tags);
            const requestedTags = tags.split(/[;,]/).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
            try {
                const response = await axios.get('https://marketplace.restoapp.org/getRecommendedModules', {
                    params: { token: license, channel },
                    timeout: 12000
                });
                const installed = new Set((modulesFromDb || []).map((item: any) => item.appId));
                const recommended = (Array.isArray(response.data) ? response.data : [])
                    .filter((item: any) => item?.id && !installed.has(item.id) && !item.disabled && !item.isDeleted);

                availableGroups = Array.from(new Set(recommended.map((item: any) => item.category).filter(Boolean))).sort();
                availableTags = Array.from(new Set(recommended.flatMap((item: any) => Array.isArray(item.tags) ? item.tags : []).filter(Boolean))).sort();

                const normalizedSearch = search.toLowerCase();
                catalog = recommended
                    .filter((item: any) => {
                        const itemTags = (Array.isArray(item.tags) ? item.tags : []).map((tag: any) => String(tag).toLowerCase());
                        const matchesSearch = !normalizedSearch || [
                            item.id, item.name, item.teaser, item.description, item.category, ...itemTags
                        ].filter(Boolean).join(' ').toLowerCase().includes(normalizedSearch);
                        const matchesGroup = !group || String(item.category || '').toLowerCase() === group.toLowerCase();
                        const matchesTags = !requestedTags.length || requestedTags.every((tag) => itemTags.includes(tag));
                        return matchesSearch && matchesGroup && matchesTags;
                    })
                    .map((item: any) => ({
                        appId: item.id,
                        name: item.name || item.id,
                        teaser: item.teaser || '',
                        group: item.category || '',
                        tags: Array.isArray(item.tags) ? item.tags : [],
                        latestVersion: item.latestVersion || '',
                        canInstall: item.purchased !== false
                    }))
                    .sort((a: any, b: any) => a.name.localeCompare(b.name))
                    .slice(0, 10);
            } catch (error) {
                catalogError = t('Failed to load marketplace catalog');
                sails.log.warn('MM: could not load marketplace catalog', error);
            }

            return req.Inertia.render({
                component: 'module',
                props: {
                    moduleComponent: `${routePrefix}/modules/assets/modules-versions.js`,
                    data: {
                        view: 'catalog',
                        catalog,
                        catalogError,
                        filters: { search, group, tags, availableGroups, availableTags },
                        translations: {
                            catalogTitle: t('Add module'),
                            catalogSubtitle: t('Choose a module from marketplace'),
                            back: t('Back to installed modules'),
                            install: t('Install'),
                            installing: t('Installing...'),
                            unavailable: t('Unavailable for this license'),
                            emptyCatalog: t('No modules are available for installation'),
                            installFailed: t('Module installation failed'),
                            installed: t('Installed'),
                            restartScheduled: t('Restart is scheduled for 00:00 server time.'),
                            restartNow: t('Restart now'),
                            restartingNow: t('Restarting...'),
                            restartFailed: t('Failed to restart'),
                            search: t('Search'),
                            searchPlaceholder: t('Search by name or description'),
                            group: t('Group'),
                            allGroups: t('All groups'),
                            tags: t('Tags'),
                            tagsPlaceholder: t('Tags separated by commas'),
                            applyFilters: t('Apply filters')
                        }
                    },
                    versionsUrl: `${routePrefix}/modules/versions`,
                    catalogUrl: `${routePrefix}/modules/catalog`,
                    updateUrl: `${routePrefix}/modules/upgrade`,
                    restartUrl: `${routePrefix}/modules/restart`,
                    restartNotice: restartScheduler.getState()
                }
            });
        }

        const systemModuleList = ModuleHelper.getSystemModuleList();
        const modules = await Promise.all((modulesFromDb || []).map(async (item: any) => {
            const currentVersion = item.version || '';
            let latestVersion = '';
            let updateAvailable = false;

            if (item.appId && license) {
                try {
                    const response = await axios.get('https://marketplace.restoapp.org/getModuleDetails', {
                        params: { appId: item.appId, license, channel },
                        timeout: 8000
                    });
                    latestVersion = response?.data?.latestVersion || '';
                    updateAvailable = Boolean(
                        latestVersion &&
                        currentVersion &&
                        (semver.valid(latestVersion) && semver.valid(currentVersion)
                            ? semver.gt(latestVersion, currentVersion)
                            : latestVersion !== currentVersion)
                    );
                } catch (error) {
                    sails.log.warn(`MM: could not check marketplace version for ${item.appId}`);
                }
            }

            return {
                name: item.name || item.appId || t('unknown'),
                appId: item.appId || '',
                version: currentVersion || t('unknown'),
                latestVersion,
                updateAvailable,
                canRemove: !systemModuleList.includes(item.appId)
            };
        }));

        return req.Inertia.render({
            component: 'module',
            props: {
                moduleComponent: `${routePrefix}/modules/assets/modules-versions.js`,
                data: {
                    modules,
                    translations: {
                        title: t('Installed Extensions'),
                        subtitle: t('Name and installed version'),
                        empty: t('No managed extensions were found'),
                        unknown: t('unknown'),
                        update: t('Update'),
                        updating: t('Updating...'),
                        available: t('Version {{version}} is available'),
                        updateFailed: t('Module update failed'),
                        updated: t('Updated'),
                        restartScheduled: t('Restart is scheduled for 00:00 server time.'),
                        restartNow: t('Restart now'),
                        restartingNow: t('Restarting...'),
                        restartFailed: t('Failed to restart'),
                        addModule: t('Install module'),
                        remove: t('Remove'),
                        removing: t('Removing...'),
                        removed: t('Removed'),
                        removeFailed: t('Module removal failed'),
                        removeConfirm: t('Remove module {{name}}? Its files and settings will be deleted.')
                    }
                },
                catalogUrl: `${routePrefix}/modules/catalog`,
                updateUrl: `${routePrefix}/modules/upgrade`,
                removeUrl: `${routePrefix}/modules/remove`,
                restartUrl: `${routePrefix}/modules/restart`,
                restartNotice: restartScheduler.getState()
            }
        });
    } catch (error) {
        sails.log.error('MM: modulesVersions action error', error);
        return res.status(500).send(t('Failed to load installed extensions list'));
    }
}
