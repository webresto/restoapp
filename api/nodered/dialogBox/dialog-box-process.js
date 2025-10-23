module.exports = function(RED) {
  function DialogBoxProcessNode(config) {
      RED.nodes.createNode(this,config);
      let node = this;
      node.on('input', async function(msg) {
          if (!msg.payload || !msg.payload.askId || !msg.payload.answerId) {
              node.error('Required fields "askId" and "answerId" are missing in msg.payload');
              return;
          }

          DialogBox.answerProcess(msg.payload.askId, msg.payload.answerId);
          node.send(msg);
      });
  }
  RED.nodes.registerType("dialog-box-process", DialogBoxProcessNode);
}
