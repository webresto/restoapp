const restartScheduler = require('../helpers/restartScheduler');

module.exports = async function restart(req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    }
    if (!req.adminizer.accessRightsHelper.hasPermission('modules-process-upgrade', req.user)) {
        return res.sendStatus(403);
    }

    res.send('Application is restarting...');
    restartScheduler.restartNow();
};
