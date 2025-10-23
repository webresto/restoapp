/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */


module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //  connection: process.env.DB_DRIVER === undefined ? "disk" : process.env.DB_DRIVER
  // },
  blueprints: {
    shortcuts: false,
  },
  port: process.env.PORT === undefined ? 42880 : process.env.PORT,
  log: {
    level: process.env.LOG_LEVEL === undefined ? 'debug' : process.env.LOG_LEVEL
  }
};
