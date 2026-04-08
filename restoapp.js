/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modules deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */
try {
  require("dotenv").config();
} catch (error) {
  console.error("Failed to load .env via dotenv", error);
}

const fs = require('fs');

Error.stackTraceLimit = 50;

const localSystemModules = [
  `${process.cwd()}/local_modules/core`,
  `${process.cwd()}/local_modules/graphql`,
].filter((modulePath) => fs.existsSync(modulePath));

const legacySystemModules = [
  `${process.cwd()}/@webresto/core`,
  `${process.cwd()}/@webresto/graphql`,
].filter((modulePath) => fs.existsSync(modulePath));

// Prefer workspace-local modules while developing; fallback to legacy @webresto/* paths.
process.env.MM_SYSTEM_MODULES = [...localSystemModules, ...legacySystemModules].join(";");

process.env.ADMINPANEL_LAZY_GEN_ADMIN_DISABLE="1"

// process.env.PROJECT_NAME = process.env.PROJECT_NAME ? process.env.PROJECT_NAME :
//   process.env.COMPOSE_PROJECT_NAME ? process.env.COMPOSE_PROJECT_NAME :
//     process.env.APP_NAME ? process.env.APP_NAME :
//       process.env.HOSTNAME ? process.env.HOSTNAME :
//         process.env.RESTOCORE_URL ? process.env.RESTOCORE_URL.replace(/^https?:\/\//, '').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase() : "";

process.env.LOKI_LABEL_APP_NAME = process.env.LOKI_LABEL_APP_NAME ? process.env.LOKI_LABEL_APP_NAME : `restocore-${process.env.PROJECT_NAME}-${process.env.NODE_ENV}`
process.env.LOKI_LABEL_SOURCE = "restocore";
process.env.LOKI_LABEL_RESTOAPP = process.env.LOKI_LABEL_RESTOAPP ? process.env.LOKI_LABEL_RESTOAPP : `restoapp-${process.env.PROJECT_NAME}-${process.env.NODE_ENV}-${process.env.STAGING}-${(new Date).toISOString().split('T')[0]}`

// if (process.env.NODE_ENV !== "production") {
//   process.env.DEV = process.env.DEV !== undefined? process.env.DEV:"TRUE"
// }
process.env.WEBRESTO_MODULES_PATH = process.env.WEBRESTO_MODULES_PATH === undefined ? __dirname + "/modules" : process.env.WEBRESTO_MODULES_PATH;
process.env.MM_SETTINGS_MODEL_DENY=1



process.env.WEB3_SERVER_URL = process.env.WEB3_SERVER_URL ?? "https://marketplace.restoapp.org"
process.env.WEB3_PROJECT_ID = process.env.WEB3_PROJECT_ID ?? '7b82121f38234ad9b9c817cb32b06ea0';
process.env.WEB3_CONFIG_CHAIN = process.env.WEB3_CONFIG_CHAIN ?? 'mainnet';

/**
 * Modules need to know which branch the code was taken from.
 * if we don’t know, then we assume that this is main
 */
const mainBranches = ['main', 'production', 'master', 'latest']
if(mainBranches.includes(process.env.BRANCH)) process.env.BRANCH = 'main'




// wrap for modulemanager
// Ensure we're in the project directory, so cwd-relative paths work as expected
// no matter where we actually lift from.
// > Note: This is not required in order to lift, but it is a convenient default.

process.chdir(__dirname);

// Attempt to import `sails`.
var sails;
try {
  sails = require("sails");
} catch (e) {
  console.error(e);
  return;
}

// --•
// Try to get `rc` dependency (for loading `.sailsrc` files).
var rc;
try {
  rc = require("rc");
} catch (e0) {
  try {
    rc = require("sails/node_modules/rc");
  } catch (e1) {
    console.error("Could not find dependency: `rc`.");
    console.error("Your `.sailsrc` file(s) will be ignored.");
    console.error("To resolve this, run:");
    console.error("npm install rc --save");
    rc = function () {
      return {};
    };
  }
}

process.on('uncaughtException', (error) => {
  console.error('TODO: send to logger', error);

});


// Start server
try {
  var config = rc("sails");
  config.hooks = config.hooks || {};
  config.hooks['app-manager-proto'] = require('./api/hooks/app-manager-proto/index.js')
  sails.lift(config);
} catch (error) {
  console.log.error(error);
}
