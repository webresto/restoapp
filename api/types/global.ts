/// <reference path="../../node_modules/@webresto/core/interfaces/globalTypes.ts" />

import sails from "@42pub/typed-sails";

type sailsConfig = typeof sails.config;

declare global {

    interface Sails extends sails.Sails {
        helpers: any;
        models: any;
        services: any;
        config: _sailsConfig;
        log: any;
        adminpanel: any;
    }
    interface _sailsConfig extends sailsConfig {
        [key:string]: any | object;
    }
}
