const maintenanceSeed = [
  {
    id: "maintenance",
    title: "Site is temporarily down",
    description: "<div>\r\n<p>Due to technical reasons delivery is not available at the moment.</p>\r\n</div>",
    enable: false,
    startDate: new Date(),
    stopDate: "2099-12-31T23:59:00.000Z",
  },
];

const paymentMethodSeed = [
  {
    externalId: "cash",
    title: "Cash",
    type: "promise",
    isCash: true,
    adapter: "no-adapter-cash",
    sortOrder: 0,
    description: "",
    enable: true,
    customData: {}
  }
]

const fs = require("fs");
const path = require("path");

module.exports.bootstrap = async function (cb) {
  sails.config.paths.app = process.cwd();

  if(process.env.NODE_RED_TOKEN !== undefined) {
    const RED = require("node-red");
    const { getNodeRedAuth, NodeRedToken } = require("../lib/bindNodeRed")

    const tokenCheck = NodeRedToken.gate();
    if (!tokenCheck.ok) {
      sails.log.error(`Nodered NOT started: ${tokenCheck.reason}. Set a strong NODE_RED_TOKEN to enable Node-RED (and its MCP tools).`);
      return cb();
    }

    let flowNamespace = process.env.NODE_RED_NAMESPACE
    let flowsFile = "restoapp.json"
    if(flowNamespace) {
      flowsFile = `flows-${flowNamespace}.json`
    }
    const settings = {
      flowFile: flowsFile,
      httpAdminRoot:"/red",
      httpNodeRoot: "/red/api/",
      userDir:`${process.cwd()}/.tmp/nodered/`,
      functionGlobalContext: {
        process: process,
        sails: sails,
        emitter: emitter,
        DialogBox: DialogBox,
        Adapter: Adapter,
        NotificationManager: NotificationManager
       },
      ...(process.env.NODE_ENV === "production" || process.env.NODE_RED_TOKEN) && {adminAuth: getNodeRedAuth()}
    }


    try {
      var express = require("express");
      var app = express();
      var http = require("http");
      const httpRedServer = http.createServer(app);
      RED.init(httpRedServer,settings);

      app.use(settings.httpAdminRoot,RED.httpAdmin);  
      app.use(settings.httpNodeRoot,RED.httpNode);
      RED.start();
      const RED_PORT = process.env.RED_PORT !== undefined && isNaN(parseInt(process.env.RED_PORT)) !== true ? parseInt(process.env.RED_PORT) : 42881; 
      httpRedServer.listen(RED_PORT);
      
    } catch (error) {
      sails.log.error("Nodered init error:",error);
    }
  }
  
  ////////////////////////////////////////////////////////////////////////////

  /**
   * # Bootsrap webresto modules loader
   * async call bootsrap config modules from %MODULE_PATH%/config/bootstrap.js
   */

  let modules = fs.readdirSync(sails.config.paths.hooks).filter(function (file) {
    return fs.statSync(sails.config.paths.hooks + "/" + file).isDirectory();
  });

  for await (let module of modules) {
    let bootstrap_js = sails.config.paths.hooks + "/" + module + "/config/bootstrap.js";
    if (fs.existsSync(bootstrap_js)) {
      try {
        let bootstrap_module_config = require(bootstrap_js);
        await bootstrap_module_config.default(sails);
      } catch (error) {
        sails.log.error(`Module bootstrap failed: [${module}]: `, error)
      }
    }
  }

  // Load bootstrap files from directory
  let bootsrapPath = sails.config.paths.app+"/api/bootstrap";
  if (fs.existsSync(bootsrapPath)) {
    let bootsrapFiles = fs.readdirSync(bootsrapPath).filter((file) => {
      return path.extname(file).toLowerCase() === '.js';
    });

    for await (let file of bootsrapFiles) {
      try {
        let bootstrap_file = require(bootsrapPath+"/"+file);
        await bootstrap_file.default(sails);
      } catch (error) {
        sails.log.error(`File bootstrap failed: [${file}]: `, error)
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////

  /**
   * # Bootsrap seeds from seeds folder
   * Magic: filename.json where filename is model name
   */
  if (sails.config.models.migrate === "drop" || process.env.FORCE_SEED === "TRUE") {

    sails.log.info("Seeding 🌱 process start")
    try {
      let seedsDir = process.env.SEED_PATH ? process.env.SEED_PATH : __dirname + "/../seeds/";

      // load JSON data
      let seeds = fs.readdirSync(seedsDir).filter(function (file) {
        return path.extname(file).toLowerCase() === ".json";
      });

      for await (let seed of seeds) {
        try {
          let seedFile = seedsDir + seed;
          let model = seed.split(".")[0].toLowerCase();
          let json_seed_data = require(seedFile);

          sails.log.info("🌱 Bootstrap > Seed for model: ", model);

          if (sails.models[model]) {
            await sails.models[model].destroy({}).fetch();

            if (Array.isArray(json_seed_data)) {
              for await (seed_item of json_seed_data) {
                cleanSeedItem(seed_item, model);
                try {
                  // if (seed_item[sails.models[model].primaryKey] !== undefined) {
                  //   let criteria = {}; criteria[sails.models[model].primaryKey] = seed_item[sails.models[model].primaryKey]
                  //   await sails.models[model].findOrCreate(criteria,seed_item);
                  // }
                  await sails.models[model].create(seed_item).fetch();
                } catch (error) {
                  sails.log.error(`🌱❌ Seeding item [${seed}] error:`, seed_item, error);
                }
              }
              sails.log.debug(`🌱 Bootstrap seed ${model}: > count: ${json_seed_data.length}`);
            } else {
              sails.log.warn(`🌱⚠️Bootstrap seed model: Only array allowed`);
            }
            sails.emit(`seeding:${model}:done`)
            sails.log.info(`Bootstrap seed model: > ${model} was seeded, count: ${json_seed_data.length}`);
          } else {
            sails.log.warn(`Bootstrap seed model: > ${model} SKIPED (model not present in sails)`);
          }
        } catch (error) {
          sails.log.error(`🌱❌ Seeding [${seed}] error:`, error);
        }
      }


      // Load JS files
      seeds = fs.readdirSync(seedsDir).filter((file) => {
        return path.extname(file).toLowerCase() === '.js';
      });

      /**
       * If file .queue exist then sort seedqueue by this file
       */

      if (fs.existsSync(seedsDir + '.queue')) {
        var queuelist = fs
          .readFileSync(seedsDir + '.queue')
          .toString()
          .split('\n')
          .filter(v => v);
        let _seeds = [...seeds];
        seeds = [];

        // Build head loadlist of js seeds files
        queuelist.forEach((qItem) => {
          _seeds.forEach((sItem) => {
            if (sItem.includes(qItem)) {
              seeds.push(sItem);
            }
          });
        });

        // Build foot
        seeds = [...seeds, ..._seeds.filter((n) => !seeds.includes(n))];
      }

      for await (let seed of seeds) {
        let model = seed.split('.')[0].toLowerCase();
        sails.log.info('🌱⚙️ Bootstrap > Seed for model: ', model);

        let seedFile = seedsDir + seed;
        if (sails.models[model]) {
          await sails.models[model].destroy({}).fetch();
          if (fs.existsSync(seedFile)) {
            let bootstrapModelSeed = require(seedFile);
            await bootstrapModelSeed.default(sails);
            sails.log.debug(`🌱⚙️ Bootstrap seed ${model}`);
          }
          sails.log.info(`Bootstrap seed model: > ${model} was seeded from .js file`);
        } else {
          sails.log.warn(`Bootstrap seed model: > ${model} SKIPED (model not present in sails)`);
        }
      }
    } catch (error) {
      console.error("🌱⚙️❌ Bootstrap seeds error: > ", error);
    }
  }
  //////////////////////////////////////////////////////////

  try {
    if ((await Maintenance.count()) === 0) {
      sails.log.verbose("BOOTSTRAP > Start Import Maintenance seed");
      await Maintenance.createEach(maintenanceSeed).fetch();
    }
  
    if ((await PaymentMethod.count()) === 0) {
      sails.log.verbose("BOOTSTRAP > Start Import Payment method seed");
      await PaymentMethod.createEach(paymentMethodSeed).fetch();
    }    
  } catch (error) {
    sails.log.error(error);
  }

  process.env.TZ = (await Settings.use("timezone")) ? await Settings.use("timezone") : process.env.TZ;
  cb();
};

function cleanSeedItem(item, model) {
  if(typeof item.id === "number") delete(item.id)

  if(item.createdAt) delete(item.createdAt)
  if(item.updatedAt) delete(item.updatedAt)

  for (const [key, value] of Object.entries(item)) {
    if (value === null || value === undefined)  {
      delete(item[key])
    } else {
      try {
        let json_value = JSON.parse(value);
        item[key] = json_value
      } catch (e) {
      }
    }
  }
}