import * as DBMigrate from 'db-migrate';
import ModuleHelper from "./moduleHelper";

export default class MigrationsHelper {

    private static runMigrations(dbmigrate: DBMigrate.DBMigrateInstance, action: string) {
        return new Promise((resolve, reject) => {
            // possible solution for custom migrations without return
            // let runMigrationsTimeout = parseInt(process.env.RUN_MIGRATIONS_TIMEOUT) || 3000;
            // setTimeout(() => reject(`Exited by timeout after ${runMigrationsTimeout}`), runMigrationsTimeout)
            if (action === "up") {
                dbmigrate.up()
                    .then(resolve).catch(reject)
            } else if (action === "down") {
                dbmigrate.down()
                    .then(resolve).catch(reject)
            } else {
                reject("MigrationsHelper: Invalid migration action")
            }
        })
    }

    // auto-migrations method
    public static async processMigrations(): Promise<void> {
        let datastore = sails.getDatastore();
        if (datastore.config.adapter !== 'sails-postgresql') {
            return
        }

        let modules = ModuleHelper.getModules();
        for (let moduleAppId in modules) {
            if (modules[moduleAppId].enable) {
                await this.processSpecificModuleMigrations(moduleAppId);
            }
        }
    }

    /**
     * Process module migrations - dbmigrate.up()
     * */
    public static async processSpecificModuleMigrations(appId: string): Promise<void> {
        let datastore = sails.getDatastore();
        if (datastore.config.adapter !== 'sails-postgresql') {
            sails.log.info(`Skip processing migrations with current datastore: ${datastore}`);
            return;
        }

        let moduleFromDB = await Module.findOne({appId: appId});
        if (!moduleFromDB) {
            sails.log.error(`Migrations helper: ${appId} not found in database`);
            throw `Migrations helper: ${appId} not found in database`;
        }

        let modules = ModuleHelper.getModules();
        let migrationsCount = ModuleHelper.getMigrationsCount(`${sails.config.modulemanager.modulesPath}/${moduleFromDB.directoryName}`);
        if (!migrationsCount) {
            sails.log.info(`Migrations helper: ${appId} has no migrations`);
            if (moduleFromDB.migrationsCount) {
                await Module.update({appId: appId}, {migrationsCount: 0}).fetch();
            }
            return;

        } else {
            if (migrationsCount === moduleFromDB.migrationsCount) {
                sails.log.info(`Migrations helper: ${appId} has no unprocessed migrations`);
                return;

            } else {
                let dbmigrate = DBMigrate.getInstance(true, {
                    cwd: `${sails.config.modulemanager.modulesPath}/${moduleFromDB.directoryName}`,
                    config: sails.config.modulemanager.migrationsConfigPath, // database.json with migrations config
                    env: process.env.NODE_ENV === "production" ? "prod" : "dev"
                });

                try {
                    let result = await this.runMigrations(dbmigrate, "up");
                    // sails.log.debug(`Result for ${appId}: ${JSON.stringify(result, null, 2)}`);
                    // !TODO Problem: to calculate success migrations num, we should rewrite code for one by one processing migrations
                    await Module.update({appId: appId}, {migrationsCount: migrationsCount, migrationsResult: `Migrations 'up' method was run successfully`}).fetch();
                    sails.config.modulemanager.state.restartRequired = true;

                    ModuleHelper.addModule(appId, modules[appId]);
                    sails.log.info(`Migrations helper: All migrations processed successfully for module ${appId}`);
                    return;

                } catch (e) {
                    sails.log.error(`Error trying to run migrations in module ${appId}`);
                    sails.log.error(e);
                    // !TODO Problem: to calculate success migrations num, we should rewrite code for one by one processing migrations
                    await Module.update({appId: appId}, {migrationsResult: `Got an error while processing migrations up method: ${JSON.stringify(e)}`}).fetch();
                    ModuleHelper.addModule(appId, modules[appId]);
                    throw `Got an error while processing migrations up method: ${JSON.stringify(e)}`
                }
            }
        }
    }
}
