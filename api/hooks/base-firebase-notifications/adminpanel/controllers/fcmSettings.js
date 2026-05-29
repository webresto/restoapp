"use strict";

const fs = require("fs");
const path = require("path");
const { tryInitFCM } = require("../../initialize");
const { isFirebaseAdminInitialized } = require("../../firebaseAdmin");

const LOCALES_DIR = path.resolve(__dirname, "../../locales");
const MESSAGES_CACHE = {};

const SERVICE_ACCOUNT_SCHEMA = {
  type: "object",
  required: ["project_id", "private_key", "client_email"],
  additionalProperties: true,
  properties: {
    type: { type: "string" },
    project_id: { type: "string", minLength: 1 },
    private_key_id: { type: "string" },
    private_key: { type: "string", minLength: 1 },
    client_email: { type: "string", minLength: 1 },
    client_id: { type: "string" },
    auth_uri: { type: "string" },
    token_uri: { type: "string" },
  },
};

const WEB_CONFIG_SCHEMA = {
  type: "object",
  required: ["apiKey", "projectId", "messagingSenderId", "appId", "vapidKey"],
  additionalProperties: true,
  properties: {
    apiKey: { type: "string", minLength: 1 },
    authDomain: { type: "string" },
    projectId: { type: "string", minLength: 1 },
    storageBucket: { type: "string" },
    messagingSenderId: { type: "string", minLength: 1 },
    appId: { type: "string", minLength: 1 },
    measurementId: { type: "string" },
    vapidKey: { type: "string", minLength: 1 },
  },
};

function t(req, key) {
  return req && req.i18n && req.i18n.__ ? req.i18n.__(key) : key;
}

function isAdmin(req) {
  return req.user && req.user.isAdministrator === true;
}

function getAdminPrefix(req) {
  return (req.adminizer && req.adminizer.config && req.adminizer.config.routePrefix) || "/admin";
}

function normalizeLocale(rawLocale) {
  const value = String(rawLocale || "").trim().toLowerCase().replace(/_/g, "-");
  if (!value) return "en";
  const base = value.split("-")[0];
  if (base === "uk") return "ua";
  return base || value;
}

function loadMessages(locale) {
  const normalized = normalizeLocale(locale);
  if (MESSAGES_CACHE[normalized]) return MESSAGES_CACHE[normalized];

  const filePath = path.resolve(LOCALES_DIR, `${normalized}.json`);
  if (!fs.existsSync(filePath)) {
    MESSAGES_CACHE[normalized] = {};
    return MESSAGES_CACHE[normalized];
  }

  try {
    MESSAGES_CACHE[normalized] = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    sails.log.error(`[FCM admin] Failed to parse locale ${filePath}`, error);
    MESSAGES_CACHE[normalized] = {};
  }

  return MESSAGES_CACHE[normalized];
}

function getLocaleAndMessages(req) {
  const locale = normalizeLocale(
    req?.user?.locale ||
    req?.user?.language ||
    req?.headers?.["x-locale"] ||
    req?.i18n?.getLocale?.() ||
    req?.getLocale?.() ||
    req?.locale ||
    req?.adminizer?.config?.translation?.defaultLocale ||
    sails.config.i18n?.defaultLocale
  );
  if (req?.i18n?.setLocale) req.i18n.setLocale(locale);
  return {
    locale,
    messages: {
      ...loadMessages("en"),
      ...loadMessages(locale),
    },
  };
}

function serviceAccountSummary(value) {
  if (!value || typeof value !== "object") return null;
  return {
    projectId: value.project_id || null,
    clientEmail: value.client_email || null,
    privateKeyId: value.private_key_id || null,
  };
}

function validateServiceAccount(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return "Service account JSON must be an object.";
  }

  for (const key of ["project_id", "client_email", "private_key"]) {
    if (!value[key] || typeof value[key] !== "string") {
      return `Service account JSON must contain ${key}.`;
    }
  }

  return null;
}

function validateWebConfig(value) {
  if (value == null) return null;
  if (typeof value !== "object" || Array.isArray(value)) {
    return "Web config JSON must be an object.";
  }

  for (const key of ["apiKey", "projectId", "messagingSenderId", "appId", "vapidKey"]) {
    if (!value[key] || typeof value[key] !== "string") {
      return `Web config must contain ${key}.`;
    }
  }

  return null;
}

function serverErrorResponse(req, res, context, error) {
  const diagnosticId = `fcm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  sails.log.error(`[FCM admin] ${context} [${diagnosticId}]`, error);
  return res.status(500).json({
    error: t(req, "Internal server error"),
    details: {
      diagnosticId,
      message: error && error.message ? error.message : String(error),
    },
  });
}

async function readValue(key) {
  const record = await Settings.findOne({ key });
  return record && record.value !== undefined && record.value !== null
    ? record.value
    : record && record.defaultValue !== undefined
      ? record.defaultValue
      : null;
}

async function renderFcmSettingsPage(req, res) {
  const routePrefix = getAdminPrefix(req);
  const config = (req.adminizer && req.adminizer.config) || {};
  const { locale, messages } = getLocaleAndMessages(req);
  const assetPath = path.resolve(__dirname, "../assets/fcm-settings.js");
  const assetVersion = fs.existsSync(assetPath)
    ? Math.round(fs.statSync(assetPath).mtimeMs)
    : Date.now();

  if (config.auth && config.auth.enable && !req.user) {
    return res.redirect(`${routePrefix}/model/userap/login`);
  }
  if (!isAdmin(req)) return res.sendStatus(403);

  return req.Inertia.render({
    component: "module",
    props: {
      moduleComponent: `${routePrefix}/firebase-notifications/assets/fcm-settings.js?v=${assetVersion}`,
      locale,
      messages,
    },
  });
}

async function getFcmSettings(req, res) {
  if (!isAdmin(req)) return res.sendStatus(403);

  try {
    const mobileEnabled = await readValue("FCM_MOBILE_ENABLED");
    const webEnabled = await readValue("FCM_WEB_ENABLED");
    const mobileApnsUploaded = await readValue("FCM_MOBILE_APNS_UPLOADED");
    const serviceAccountKey = await readValue("FCM_SERVICE_ACCOUNT_KEY");
    const webConfig = await readValue("FCM_WEB_CONFIG");

    return res.json({
      mobileEnabled: mobileEnabled === true,
      webEnabled: webEnabled === true,
      mobileApnsUploaded: mobileApnsUploaded === true,
      hasServiceAccountKey: !!serviceAccountKey,
      serviceAccountSummary: serviceAccountSummary(serviceAccountKey),
      webConfig: webConfig || {},
      initialized: isFirebaseAdminInitialized(),
    });
  } catch (error) {
    return serverErrorResponse(req, res, "Failed to read settings", error);
  }
}

async function saveFcmSettings(req, res) {
  if (!isAdmin(req)) return res.sendStatus(403);

  const body = req.body || {};
  const mobileEnabled = body.mobileEnabled === true;
  const webEnabled = body.webEnabled === true;
  const mobileApnsUploaded = body.mobileApnsUploaded === true;
  const webConfig = body.webConfig && Object.keys(body.webConfig).length > 0 ? body.webConfig : null;
  const serviceAccountKey = body.serviceAccountKey || null;
  const clearServiceAccountKey = body.clearServiceAccountKey === true;

  if (webEnabled) {
    if (!webConfig) {
      return res.status(400).json({ error: t(req, "Fill web config before enabling web push.") });
    }
    const webConfigError = validateWebConfig(webConfig);
    if (webConfigError) return res.status(400).json({ error: t(req, webConfigError) });
  }

  if (serviceAccountKey) {
    const serviceAccountError = validateServiceAccount(serviceAccountKey);
    if (serviceAccountError) return res.status(400).json({ error: t(req, serviceAccountError) });
  }

  if (mobileEnabled || webEnabled) {
    const existingServiceAccountKey = await readValue("FCM_SERVICE_ACCOUNT_KEY");
    if (!serviceAccountKey && (clearServiceAccountKey || !existingServiceAccountKey)) {
      return res.status(400).json({ error: t(req, "Upload Firebase service account JSON before enabling FCM.") });
    }
  }

  try {
    await Settings.set("FCM_MOBILE_ENABLED", {
      key: "FCM_MOBILE_ENABLED",
      type: "boolean",
      value: mobileEnabled,
      defaultValue: false,
      name: "FCM Mobile Enabled",
      description: "Enable Firebase Cloud Messaging push notifications for iOS/Android.",
      appId: "base-firebase-notifications",
    });

    await Settings.set("FCM_WEB_ENABLED", {
      key: "FCM_WEB_ENABLED",
      type: "boolean",
      value: webEnabled,
      defaultValue: false,
      name: "FCM Web Enabled",
      description: "Enable Firebase Cloud Messaging web push notifications.",
      appId: "base-firebase-notifications",
    });

    await Settings.set("FCM_MOBILE_APNS_UPLOADED", {
      key: "FCM_MOBILE_APNS_UPLOADED",
      type: "boolean",
      value: mobileApnsUploaded,
      defaultValue: false,
      name: "FCM Mobile APNs Uploaded",
      description: "Optional user confirmation that APNs key or certificate was uploaded to Firebase for iOS push delivery.",
      appId: "base-firebase-notifications",
    });

    await Settings.set("FCM_WEB_CONFIG", {
      key: "FCM_WEB_CONFIG",
      type: "json",
      value: webConfig,
      defaultValue: null,
      jsonSchema: webEnabled ? WEB_CONFIG_SCHEMA : undefined,
      name: "FCM Web Config",
      description: "Public Firebase config for browser push notifications.",
      appId: "base-firebase-notifications",
    });

    if (clearServiceAccountKey) {
      await Settings.set("FCM_SERVICE_ACCOUNT_KEY", {
        key: "FCM_SERVICE_ACCOUNT_KEY",
        type: "json",
        value: null,
        defaultValue: null,
        name: "FCM Service Account Key",
        description: "Firebase Admin SDK service account JSON key.",
        appId: "base-firebase-notifications",
      });
    } else if (serviceAccountKey) {
      await Settings.set("FCM_SERVICE_ACCOUNT_KEY", {
        key: "FCM_SERVICE_ACCOUNT_KEY",
        type: "json",
        value: serviceAccountKey,
        defaultValue: null,
        jsonSchema: SERVICE_ACCOUNT_SCHEMA,
        name: "FCM Service Account Key",
        description: "Firebase Admin SDK service account JSON key.",
        appId: "base-firebase-notifications",
      });
    }

    if (mobileEnabled || webEnabled) {
      await tryInitFCM();
    }

    return getFcmSettings(req, res);
  } catch (error) {
    return serverErrorResponse(req, res, "Failed to save settings", error);
  }
}

module.exports = {
  renderFcmSettingsPage,
  getFcmSettings,
  saveFcmSettings,
};
