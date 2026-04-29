'use strict';

module.exports.adminpanel = {
  models: {
  },
  auth: true,
  translation: {
    locales: [
    "en",
    "ru",
    "es",
    "fr",
    "de",
    "ko",
    "ua",
    "uz",
    "pt",
    "ar",
    "cn",
    "jp",
    "vi"
    ],
    defaultLocale: 'en'
  },
  dashboard: {
    // Widgets are initialized and configured in local_modules/core/lib/adminpanel/widgets
    // defaultWidgets will be populated by core module
  },
  showVersion: {
    text: process.env.CONTAINER_VERSION || process.env.APP_VERSION || process.env.VERSION,
  },
  mediamanager: false,
  policies: [],
  brand: {
    link: {
        id: "0",
        type: 'blank',
        title: 'RestoApp',
        link: 'https://restoapp.org',
    }
  },
  sections: [],
  aiAssistant: {
    enabled: (process.env.ENABLE_AI_ASSISTANT ?? "true") === 'true' && Boolean(process.env.OPENAI_API_KEY || process.env.ADMINIZER_OPENAI_KEY),
    defaultModel: 'openai-data',
    models: ['openai-data'],
  },
};
