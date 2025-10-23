var emitterRay = {}
module.exports = function(RED) { 
  function EmitterOnNode(config) {
      RED.nodes.createNode(this, config);
      let node = this;

      // Function to handle node removal
      function handleNodeRemoval() {
          emitter.off(config.event, config.name);
      }
      
      // Subscribe to node removal event
      node.on('close', handleNodeRemoval);

      emitter.on(config.event, config.name, async (...args) => {
        var msg = { payload: args, emitterRayId: RED.util.generateId() };
        node.send(msg);
    
        let a = new Promise((resolve, reject) => {
            emitterRay[msg.emitterRayId] = { fn: null, throw: null };
    
            emitterRay[msg.emitterRayId].fn = function (_args) {
                for (let i = 0; i < args.length; i++) {
                    if (typeof args[i] === 'object' && args[i] !== null) {
                        Object.assign(args[i], _args[i]); 
                    } else {
                        args[i] = _args[i];
                    }
                }
                resolve(_args);
            };
    
            emitterRay[msg.emitterRayId].throw = function (error) {
                reject(error);
            };
        });
    
        return await a;
    });
  }
  RED.nodes.registerType("emitter-on", EmitterOnNode);

  function EmitterEndNode(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    this.on('input', async function(msg) {
        if (msg.emitterRayId && emitterRay[msg.emitterRayId]) {
            setImmediate(async () => {
                try {
                    await emitterRay[msg.emitterRayId].fn(msg.payload);
                    delete emitterRay[msg.emitterRayId];
                } catch (error) {
                    node.error("Error in emitter-end execution", error);
                }
                node.send(msg);
            });
        } else {
            node.error("Invalid or missing emitterRayId in message");
            node.send(msg);
        }
    });
}

  RED.nodes.registerType("emitter-end", EmitterEndNode);

  function EmitterThrowNode(config) {
    RED.nodes.createNode(this, config);
    let node = this;
    this.on('input',  async function(msg) {
      if (msg.emitterRayId && emitterRay[msg.emitterRayId]) {
        // console.log("ENDpayload",msg.payload)
        await emitterRay[msg.emitterRayId].throw(msg.payload);
        delete emitterRay[msg.emitterRayId];
      } else {
        node.error("Invalid or missing emitterRayId in message");
      }
      node.send(msg);
    });
  }
  RED.nodes.registerType("emitter-throw", EmitterThrowNode);
}
