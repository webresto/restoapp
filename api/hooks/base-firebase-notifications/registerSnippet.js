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

    if (!webConfig || !webConfig.apiKey) {
      // No config yet — return nothing so the snippet doesn't appear in recipe
      return null;
    }

    return {
      module: "base-firebase-notifications",
      key: "firebase-web-config",
      name: "Firebase Web Config (env)",
      content: JSON.stringify({
        apiKey: webConfig.apiKey,
        authDomain: webConfig.authDomain,
        projectId: webConfig.projectId,
        messagingSenderId: webConfig.messagingSenderId,
        appId: webConfig.appId,
        vapidKey: webConfig.vapidKey,
        storageBucket: webConfig.storageBucket,
        measurementId: webConfig.measurementId,
      }),
      placement: "env",
      enabledByDefault: true,
    };
  });
}

module.exports = registerSnippet;
