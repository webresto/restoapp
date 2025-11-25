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
    // Widgets are initialized and configured in local_modules/core/lib/adminpanel/widgets
    // defaultWidgets will be populated by core module
  },
  mediamanager: false,
  policies: [],
  aiAssistant: {
    enabled: (process.env.ENABLE_AI_ASSISTANT ?? "true") === 'true' && Boolean(process.env.OPENAI_API_KEY || process.env.ADMINIZER_OPENAI_KEY),
    defaultModel: 'openai-data',
    models: ['openai-data'],
  },
};
