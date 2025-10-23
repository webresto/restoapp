module.exports = function(RED) {
  function DialogBoxNode(config) {
      RED.nodes.createNode(this,config);
      let node = this;
      node.on('input', async function(msg) {
          msg.payload = msg.payload;

          if(!msg.payload || !msg.payload.dialog || !msg.payload.deviceId) {
            node.error(`Payload not defined: ${JSON.stringify(msg.payload)}`);
            return;
          }
          // console.log(msg.payload)
          try {
            let result = await DialogBox.ask(msg.payload.dialog, msg.payload.deviceId);
            msg.payload = result;
            node.send(msg);
          } catch (err) {
            node.error(err);
          }
      });
  }
  RED.nodes.registerType("dialog-box", DialogBoxNode);
}
