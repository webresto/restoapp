'use strict';

module.exports.adminpanel = {
  models: {
  },
  filters: {
    enabled: true
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
  defaultGroups: [
    {
      name: 'Operator',
      description: 'Processes and updates current orders',
      tokens: [
        'access-to-adminpanel',
        'widgets',
        'order-kanban',
        'read-order-model',
        'update-order-model',
      ],
    },
    {
      name: 'Marketer',
      description: 'Manages the product catalog, promotions, notifications, and reports',
      tokens: [
        'access-to-adminpanel',
        'widgets',
        'catalog-products',
        'notifications-manager',
        'orders-report',
        'read-promotion-model',
        'create-promotion-model',
        'update-promotion-model',
        'read-promotioncode-model',
        'create-promotioncode-model',
        'update-promotioncode-model',
      ],
    },
  ],
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
