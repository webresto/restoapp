'use strict';

module.exports.adminpanel = {
  models: {
  },
  auth: true,
  translation: {
    locales: [
    "en",
    "es",
    "zh",
    "hi",
    "ar",
    "ru",
    "fr",
    "ua"
    ],
    path: `config/locales`,
    defaultLocale: 'en'
  },
  dashboard: {
    autoloadWidgetsPath1: "api/dashboard",
    defaultWidgets: [
      // TODO: after mogration to adminizer need update these widgets
      // 'dish-count',
      // 'order-count'
    ]
  },
  mediamanager: false,
  policies: [],
  aiAssistant: {
    enabled: (process.env.ENABLE_AI_ASSISTANT ?? "true") === 'true' && Boolean(process.env.OPENAI_API_KEY || process.env.ADMINIZER_OPENAI_KEY),
    defaultModel: 'openai-data',
    models: ['openai-data'],
  },
};
