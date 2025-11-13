let attributes = {
    id: {
        type: "number",
        autoIncrement: true,
    },
    name: {
        type: "string",
        required: true
    },
    appId: {
        type: "string",
        required: true,
        unique: true
    },
    hookName: "string",
    version: "string",
    enable: "boolean",
    migrationsCount: "number", // process migrations if this field was changed
    migrationsResult: "string",
    isDeleted: "boolean",
    directoryName: "string",
    repository: "string", // repository id where module was downloaded
    dependents: {
        collection: "module",
        via: "dependencies"
    },
    dependencies: {
        collection: "module",
        via: "dependents"
    }
};
let model = {
    beforeCreate: function (record, cb) {
        // for modules loaded from seeds
        if (!record.repository) {
            record.repository = 'webresto-registry';
        }
        cb();
    },
    afterCreate: async function (record, cb) {
        // let updateSailsRCResult = await updateSailsRC();
        // if (updateSailsRCResult === "hasUpdated") {
        //   sails.log.info("Restart is required due to .sailsrc update");
        //   sails.config.modulemanager.state.restartRequired = true;
        // }
        cb();
    },
    afterUpdate: async function (record, cb) {
        // let updateSailsRCResult = await updateSailsRC();
        // if (updateSailsRCResult === "hasUpdated") {
        //   sails.log.info("Restart is required due to .sailsrc update");
        //   sails.config.modulemanager.state.restartRequired = true;
        // }
        cb();
    },
    // beforeDestroy: async function (record: Module, cb: (err?: string) => void) {
    //   // cb("BeforeDestroy Error: Can not delete Module record");
    // },
};
module.exports = {
    primaryKey: "appId",
    attributes: attributes,
    ...model,
};
