"use strict";

const fs = require("fs");
const path = require("path");
const { renderFcmSettingsPage, getFcmSettings, saveFcmSettings } = require("./controllers/fcmSettings");

function normalizeHandlers(bound) {
  return Array.isArray(bound) ? bound : [bound];
}

function makeAdminizerBinder(adminizer) {
  if (
    adminizer.middlewareManager &&
    typeof adminizer.middlewareManager.bindMiddlewares === "function"
  ) {
    const middlewares = adminizer.config.middlewares || [];
    return (action) => normalizeHandlers(adminizer.middlewareManager.bindMiddlewares(middlewares, action));
  }

  if (adminizer.policyManager && typeof adminizer.policyManager.bindPolicies === "function") {
    return (action) => normalizeHandlers(adminizer.policyManager.bindPolicies(adminizer.config.policies, action));
  }

  return (action) => [action];
}

function bindFirebaseNotificationsAdminpanel(sails) {
  let bound = false;

  function appendTranslations(adminizer) {
    const translationsDir = path.resolve(__dirname, "../locales");
    if (!fs.existsSync(translationsDir)) return;

    const locales = sails.config.i18n?.locales || [];
    for (const locale of locales) {
      const localeFile = path.resolve(translationsDir, `${locale}.json`);
      if (!fs.existsSync(localeFile)) continue;

      try {
        const jsonData = JSON.parse(fs.readFileSync(localeFile, "utf8"));
        if (sails.hooks.i18n?.appendLocale) sails.hooks.i18n.appendLocale(locale, jsonData);
        if (adminizer?.i18n?.appendLocale) adminizer.i18n.appendLocale(locale, jsonData);
      } catch (error) {
        sails.log.error(`[FCM admin] Failed to load locale ${localeFile}`, error);
      }
    }
  }

  function register() {
    if (bound) return;
    const adminizer = sails.hooks.adminpanel && sails.hooks.adminpanel.adminizer;
    if (!adminizer || !adminizer.app || !adminizer.config) return;

    const routePrefix = adminizer.config.routePrefix || "/admin";
    const bind = makeAdminizerBinder(adminizer);
    const assetPath = path.resolve(__dirname, "assets/fcm-settings.js");
    bound = true;
    appendTranslations(adminizer);

    adminizer.app.get(
      `${routePrefix}/firebase-notifications/assets/fcm-settings.js`,
      function (_req, res) {
        res.type("application/javascript");
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");
        return res.sendFile(assetPath);
      }
    );

    adminizer.app.get(
      `${routePrefix}/firebase-notifications/mobile`,
      ...bind(renderFcmSettingsPage)
    );

    adminizer.app.get(
      `${routePrefix}/firebase-notifications/web`,
      ...bind(renderFcmSettingsPage)
    );

    adminizer.app.get(
      `${routePrefix}/firebase-notifications`,
      function (_req, res) {
        return res.redirect(`${routePrefix}/firebase-notifications/mobile`);
      }
    );

    adminizer.app.get(
      `${routePrefix}/core/firebase-notifications/settings`,
      ...bind(getFcmSettings)
    );

    adminizer.app.post(
      `${routePrefix}/core/firebase-notifications/settings`,
      ...bind(saveFcmSettings)
    );
  }

  const adminizer = sails.hooks.adminpanel && sails.hooks.adminpanel.adminizer;
  if (adminizer && adminizer.emitter) {
    adminizer.emitter.on("adminizer:loaded", register);
    register();
    return;
  }

  sails.on("Adminpanel:afterHook:loaded", function () {
    const loadedAdminizer = sails.hooks.adminpanel && sails.hooks.adminpanel.adminizer;
    if (loadedAdminizer && loadedAdminizer.emitter) {
      loadedAdminizer.emitter.on("adminizer:loaded", register);
    }
    register();
  });
}

module.exports = { bindFirebaseNotificationsAdminpanel };
