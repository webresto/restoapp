"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryInitFCM = tryInitFCM;

const { NotificationManager } = require("@webresto/core/libs/NotificationManager");
const { initFirebaseAdmin } = require("./firebaseAdmin");
const { FCMMobileChannel } = require("./channels/FCMMobileChannel");
const { FCMWebChannel } = require("./channels/FCMWebChannel");

async function tryInitFCM() {
  // Channels are always registered so they appear in the admin channels list,
  // even when not yet configured. isReady()/isConfigured() reflect actual state.
  if (!NotificationManager.isChannelExist("fcm-mobile")) {
    NotificationManager.registerChannel(new FCMMobileChannel());
  }
  if (!NotificationManager.isChannelExist("fcm-web")) {
    NotificationManager.registerChannel(new FCMWebChannel());
  }

  const key = await Settings.get("FCM_SERVICE_ACCOUNT_KEY");
  if (!key) return;

  try {
    initFirebaseAdmin(key);
  } catch (e) {
    sails.log.error("[FCM] firebase-admin init failed:", e);
  }
}
