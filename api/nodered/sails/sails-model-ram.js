module.exports = function(RED) {
  function SailsModelRamNode(config) {
      RED.nodes.createNode(this, config);
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

              fetchData()  
              if (afterCreate) {
                  afterCreate(values, cb);
              } else {
                  cb();
              }
          };

          let afterUpdate = sails.models[modelname].afterUpdate
          sails.models[modelname].afterUpdate = async function (values, cb) {

              fetchData()
              if (afterUpdate) {
                afterUpdate(values, cb);
              } else {
                  cb();
              }
          };


          let afterDestroy = sails.models[modelname].afterUpdate
          sails.models[modelname].afterDestroy = async function (values, cb) {

              fetchData()
              if (afterDestroy) {
                afterDestroy(values, cb);
              } else {
                  cb();
              }
          };

          return; // Exit the function if the model is not defined
      }

      let dataFromModel = [];

      function fetchData() {
        try {
            // Retrieve data from the model
            dataFromModel = sails.models[config.model].find().limit(300).exec((err, _dataFromModel)=>{
              if (err) {
                node.error(err);
              }
              dataFromModel = _dataFromModel;
            });;
        } catch (error) {
            node.error(`Error retrieving data from model ${config.model}: ${error}`);
            return; // Exit the function if an error occurs
        }
      }
      fetchData();

      // Handle incoming messages
      node.on('input', function(msg) {
          // Check if node is defined
          if (!node) {
              console.error("Node is not defined.");
              return;
          }
          // Set msg.payload to the data retrieved from the model
          msg.payload = dataFromModel;
          // Send the message
          node.send(msg);
      });
  }
  RED.nodes.registerType("sails-model-ram", SailsModelRamNode);
}
