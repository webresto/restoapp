function setDatastore(datastore) {
  switch (datastore) {
    ///////////////////////////////////////////////////
    case "postgres":

      // define VARs
      var PG_PORT = process.env.PG_PORT === undefined ? 5432 : process.env.PG_PORT;
      var PG_DATABASE = process.env.PG_DATABASE === undefined ? "postgres" : process.env.PG_DATABASE;
      var PG_HOST = process.env.PG_HOST === undefined ? "postgres" : process.env.PG_HOST;

      var PGLINK; if (process.env.PGLINK === undefined) PGLINK = process.env.PGLINK;
      if (!PGLINK) {
        if(process.env.PG_USER){
          PGLINK = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
        }else{
          PGLINK = `postgresql://postgres:postgres@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;
        }
      }

      return {
        adapter: 'sails-postgresql',
        url: PGLINK
      }

    ///////////////////////////////////////////////////
    default:
      return {}
  }

}


// SAILS_DISK_DIR keeps a second development database next to the default one:
// the storefront demo (`npm run dev:showcase`) must not share rows with the
// end-to-end stand, which recreates its own Yekaterinburg.
let datastores = {
  default: { adapter: 'sails-disk', ...(process.env.SAILS_DISK_DIR ? { dir: process.env.SAILS_DISK_DIR } : {}) }
}
if (process.env.DATASTORE){
  datastores["default"] = setDatastore(process.env.DATASTORE)
}
if(process.env.DATASTORE !== "postgres") {
  process.env.ALLOW_UNSAFE_SETTINGS = "YES"
}

module.exports.datastores =  datastores 
