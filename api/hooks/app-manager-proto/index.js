require('./adminpanel-libs-hook.mjs');
module.exports = function (sails) {
    return {
        defaults: require('./lib/defaults'),
        configure: require('./lib/configure').default(sails),
        initialize: require('./lib/initialize').default(sails),
        getModules: require('./helpers/moduleHelper').getModules,
    };
};

