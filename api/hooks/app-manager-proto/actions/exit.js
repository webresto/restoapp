module.exports = async function (req, res) {
    const { config } = req.adminizer;
    if (config.auth?.enable && !req.user) {
        return res.redirect(`${sails.config.adminpanel.routePrefix}/model/userap/login`);
    } else if (!req.adminizer.accessRightsHelper.hasPermission(`modules-process-exit`, req.user)) {
        console.log("No access to admin-frontend-module");
        console.log(req.user, req.adminizer.accessRightsHelper.hasPermission(`modules-process-exit`, req.user));
        return res.sendStatus(403);
    }
    setTimeout(() => {
        process.exit();
    }, 3000);
    return res.send('exiting in 3 seconds...');
};
