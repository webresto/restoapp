module.exports = function (RED) {
    function EmitterEmitNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.on('input', async function (msg) {
            var args = [config.event].concat(msg.payload);
            let result = await emitter.emit.apply(emitter, args);
            // console.log("AFTER EMIT WAIT:", args[1],"IN RESULTs:", result[0].result)
        });
    }
    RED.nodes.registerType("emitter-emit", EmitterEmitNode);
}