const { ModuleRefusal, install, update } = require('../helpers/moduleJobs');

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
    try {
        const job = await (isInstall ? install(appId) : update(appId));
        await job.finished;
        if (job.state === 'failed') return res.status(job.error.status).send(job.error.message);
        return res.status(200).send(job.log.join('\n'));
    } catch (error) {
        if (error instanceof ModuleRefusal) return res.status(error.status).send(error.message);
        sails.log.error(`MM: could not ${isInstall ? 'install' : 'update'} module ${appId}`, error);
        return res.status(500).send(error?.message || String(error));
    }
};
