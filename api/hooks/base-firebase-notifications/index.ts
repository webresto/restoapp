import { tryInitFCM } from "./initialize";

// Settings manifests
import "./settings/fcm_enabled.json";
import "./settings/fcm_service_account_key.json";
import "./settings/fcm_web_config.json";

module.exports = function (sails: any) {
  return {
    initialize: async function (cb: (err?: Error) => void) {
      try {
        await tryInitFCM();
        cb();
      } catch (e) {
        sails.log.error("[FCM hook] Initialization error:", e);
        cb();
      }
    },
  };
};
