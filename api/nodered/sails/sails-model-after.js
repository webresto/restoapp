module.exports = function(RED) {
  function SailsModelAfterNode(config) {
      RED.nodes.createNode(this,config);
      let node = this;

      // Check if config.model is defined
      if (!config.model) {
          node.error(`config.model not defined: ${JSON.stringify(config)}`);
          return; // Exit the function if config.model is not defined
      }

      // Check if sails.models[config.model] is undefined
      if (!sails.models || !sails.models[config.model]) {
          node.error(`Model ${config.model} is not defined.`);


          const modelname = config.model;
          let afterCreate = sails.models[modelname].afterCreate
          sails.models[modelname].afterCreate = async function (values, cb) {

              emitData(values)  
              if (afterCreate) {
                  afterCreate(values, cb);
              } else {
                  cb();
              }
          };

          let afterUpdate = sails.models[modelname].afterUpdate
          sails.models[modelname].afterUpdate = async function (values, cb) {

              emitData(values)
              if (afterUpdate) {
                afterUpdate(values, cb);
              } else {
                  cb();
              }
          };


          let afterDestroy = sails.models[modelname].afterUpdate
          sails.models[modelname].afterDestroy = async function (values, cb) {
              emitData(values)
              if (afterDestroy) {
                afterDestroy(values, cb);
              } else {
                  cb();
              }
          };

          function emitData(values) {
            msg.payload = values;
            node.send(msg);
          }

          return;
      }
  }
  RED.nodes.registerType("sails-model-after", SailsModelAfterNode);
}
