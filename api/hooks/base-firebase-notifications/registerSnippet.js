"use strict";

const EVENT = "admin-frontend:collect-snippets";
const SUBSCRIBER_ID = "base-firebase-notifications";

/**
 * Register Firebase Web config as an env snippet for the frontend recipe.
 *
 * The snippet exposes the public Firebase configuration (apiKey, authDomain,
 * projectId, messagingSenderId, appId, vapidKey) so that client-side code can
 * initialize Firebase SDK and web push without duplicating secrets.
 */
function registerSnippet() {
  if (typeof emitter === "undefined" || !emitter || typeof emitter.on !== "function") {
    sails.log.warn("[FCM hook] emitter not available — env snippet not registered");
    return;
  }

  emitter.on(EVENT, SUBSCRIBER_ID, async () => {
    const webConfig = await Settings.get("FCM_WEB_CONFIG");
    const channelsState = await Settings.get("NOTIFICATION_CHANNELS_STATE");
    const webChannelState = channelsState && typeof channelsState === "object"
      ? channelsState["fcm-web"]
      : null;

    if (!webConfig || !webConfig.apiKey) {
      // No config yet — return nothing so the snippet doesn't appear in recipe
      return null;
    }

    if (webChannelState && webChannelState.enabled === false) {
      // Respect the admin notifications manager toggle: disabled web push should not
      // leak Firebase config into the frontend recipe because the channel is off.
      return null;
    }

    return {
      module: "base-firebase-notifications",
      key: "firebase-web-config",
      name: "Firebase Web Config (env)",
      // Nested under `firebase` on purpose: admin-frontend deep-merges env-snippet JSON
      // into recipe.environment, so this lands at recipe.environment.firebase — exactly the
      // shape the frontend reads (Environment.firebase). Only the six fields the frontend
      // actually uses; storageBucket/measurementId are not part of that contract.
      content: JSON.stringify({
        firebase: {
          apiKey: webConfig.apiKey,
          authDomain: webConfig.authDomain,
          projectId: webConfig.projectId,
          messagingSenderId: webConfig.messagingSenderId,
          appId: webConfig.appId,
          vapidKey: webConfig.vapidKey,
        },
      }),
      placement: "env",
      enabledByDefault: true,
    };
  });
}

module.exports = registerSnippet;
