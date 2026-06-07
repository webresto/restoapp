function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function firstValue() {
  for (let i = 0; i < arguments.length; i++) {
    if (hasValue(arguments[i])) {
      return arguments[i];
    }
  }
  return undefined;
}

function parseJson(value, fieldName, node) {
  if (!hasValue(value)) {
    return undefined;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    throw new Error(`Invalid JSON in ${fieldName}: ${error.message}`);
  }
}

function pickPayload(msg) {
  return msg && msg.payload && typeof msg.payload === "object" && !Array.isArray(msg.payload)
    ? msg.payload
    : {};
}

function orderIdentifierCriteria(orderId) {
  const value = String(orderId).trim();
  return {
    where: {
      or: [
        { id: value },
        { shortId: value.toUpperCase() },
      ],
    },
  };
}

module.exports = function(RED) {
  function OrderLogNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async function(msg, send, done) {
      send = send || function() { node.send.apply(node, arguments); };
      const payload = pickPayload(msg);

      try {
        const criteriaFromConfig = parseJson(config.criteria, "criteria", node);
        const criteria = firstValue(payload.criteria, msg.criteria, criteriaFromConfig);
        const orderId = firstValue(payload.orderId, payload.id, payload.order && payload.order.id, msg.orderId, config.orderId);
        const orderCriteria = criteria || (orderId ? orderIdentifierCriteria(orderId) : undefined);

        if (!orderCriteria) {
          throw new Error("Order criteria is required. Set orderId or criteria in node config, msg, or msg.payload.");
        }

        const level = firstValue(payload.level, msg.level, config.level, "info");
        const moduleName = firstValue(payload.module, msg.module, config.module, "node-red");
        const message = firstValue(payload.message, msg.message, config.message, msg.topic, "Node-RED log");
        const dataFromConfig = parseJson(config.data, "data", node);
        const data = firstValue(payload.data, msg.data, dataFromConfig);

        if (data === undefined) {
          await Order.log(orderCriteria, level, moduleName, message);
        } else {
          await Order.log(orderCriteria, level, moduleName, message, data);
        }

        send(msg);
        if (done) done();
      } catch (error) {
        node.error(error.message || error, msg);
        if (done) done(error);
      }
    });
  }

  RED.nodes.registerType("order-log", OrderLogNode);
};
