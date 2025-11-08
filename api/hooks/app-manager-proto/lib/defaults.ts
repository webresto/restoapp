'use strict';
const sailsRoot: string = process.cwd();

module.exports = {
    modulemanager: {
        // define module manager status object
        state: {
            restartRequired: false,
            unknownError: false,
            notAvailableMarket: false,
            noModulesFound: false,
            addNewModule: false,
            installStepperPolicyBound: false
        },
        modules: {},
        modulesPath: process.env.MODULES_PATH ? process.env.MODULES_PATH : `${sailsRoot}/modules`,
        tempDirPath: process.env.TEMP_DIR_PATH ? process.env.TEMP_DIR_PATH : `${sailsRoot}/.tmp`,
        migrationsConfigPath: process.env.MIGRATIONS_CONFIG_PATH ? process.env.MIGRATIONS_CONFIG_PATH : `${sailsRoot}/database.json`,
        navbar: [
            {
                id: "1",
                name: "My modules",
                link: `/${getAdminPrefix()}/modules/my`,
                icon: "home"
            },
            // {
            //     id: "2",
            //     name: "Updates",
            //     link: `/${getAdminPrefix()}/modules/updates`,
            //     icon: "cloud-download-alt"
            // },
            // {
            //     id: "3",
            //     name: "Marketplace",
            //     link: `/${getAdminPrefix()}/modules/market`,
            //     icon: "shopping-cart"
            // }
        ]
    }
};

function getAdminPrefix() {
    if (typeof sails !== "undefined" && sails.config.adminpanel) {
        let adminRoutePrefix = sails.config.adminpanel.routePrefix ? sails.config.adminpanel.routePrefix : "admin";
        return adminRoutePrefix.replace(/\//g, '');
    } else {
        return "admin"
    }
}
