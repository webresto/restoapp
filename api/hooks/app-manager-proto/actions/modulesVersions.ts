export default async function modulesVersions(req: any, res: any) {
    const { config } = req.adminizer || {};
    const routePrefix = config?.routePrefix || '/admin';

    if (config?.auth?.enable && !req.user) {
        if (req.Inertia?.redirect) {
            return req.Inertia.redirect(`${routePrefix}/model/userap/login`);
        }
        return res.redirect(`${routePrefix}/model/userap/login`);
    }

    try {
        const modulesFromDb = await Module.find({
            where: {
                isDeleted: {
                    '!=': true
                }
            },
            sort: 'name ASC'
        });

        const modules = (modulesFromDb || []).map((item: any) => ({
            name: item.name || item.appId || 'unknown',
            appId: item.appId || '',
            version: item.version || 'unknown'
        }));

        return req.Inertia.render({
            component: 'module',
            props: {
                moduleComponent: `${routePrefix}/modules/assets/modules-versions.js`,
                data: {
                    modules
                }
            }
        });
    } catch (error) {
        sails.log.error('MM: modulesVersions action error', error);
        return res.status(500).send('Failed to load installed extensions list');
    }
}
