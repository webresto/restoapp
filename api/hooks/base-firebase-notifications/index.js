"use strict";

const { tryInitFCM } = require("./initialize");
const { bindFirebaseNotificationsAdminpanel } = require("./adminpanel/bindAdminpanel");
const registerSnippet = require("./registerSnippet");

module.exports = function (sails) {
  return {
    initialize: function (cb) {
      sails.on("hook:orm:loaded", async function () {
        try {
          await tryInitFCM();
        } catch (e) {
          sails.log.error("[FCM hook] Initialization error:", e);
        }
      });
      bindFirebaseNotificationsAdminpanel(sails);
      registerSnippet();
      cb();
    },
  };
};
