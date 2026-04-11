"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryInitFCM = tryInitFCM;

const { NotificationManager } = require("@webresto/core/libs/NotificationManager");
const { initFirebaseAdmin } = require("./firebaseAdmin");
const { FCMMobileChannel } = require("./channels/FCMMobileChannel");
const { FCMWebChannel } = require("./channels/FCMWebChannel");

async function tryInitFCM() {
  const enabled = await Settings.get("FCM_ENABLED");
  if (!enabled) return;

  const key = await Settings.get("FCM_SERVICE_ACCOUNT_KEY");
  if (!key) {
    sails.log.warn("[FCM] FCM_ENABLED=true but FCM_SERVICE_ACCOUNT_KEY not set");
    return;
  }

  try {
    initFirebaseAdmin(key);
    NotificationManager.registerChannel(new FCMMobileChannel());
    NotificationManager.registerChannel(new FCMWebChannel());
    sails.log.info("[FCM] Channels registered (mobile + web)");
  } catch (e) {
    sails.log.error("[FCM] Init failed:", e);
  }
}
