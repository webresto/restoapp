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
        'globaly-operator-can-create',
        'globaly-operator-can-view',
        'globaly-operator-can-write',
        'globaly-operator-can-delete',
        'read-order-model',
        'update-order-model',
      ],
      ensureTokens: [
        'globaly-operator-can-create',
        'globaly-operator-can-view',
        'globaly-operator-can-write',
        'globaly-operator-can-delete',
      ],
    },
    {
      name: 'Marketer',
      description: 'Manages the product catalog, promotions, notifications, and reports',
      tokens: [
        'access-to-adminpanel',
        'widgets',
        'catalog-products',
        'notifications-manager-view',
        'promocodes-manager',
        'promotions-manager',
        'sales-channels-view',
        'orders-report',
        'globaly-marketer-can-create',
        'globaly-marketer-can-view',
        'globaly-marketer-can-write',
        'globaly-marketer-can-delete',
        'read-promotion-model',
        'create-promotion-model',
        'update-promotion-model',
        'read-promotioncode-model',
        'create-promotioncode-model',
        'update-promotioncode-model',
      ],
      ensureTokens: [
        'notifications-manager-view',
        'sales-channels-view',
        'globaly-marketer-can-create',
        'globaly-marketer-can-view',
        'globaly-marketer-can-write',
        'globaly-marketer-can-delete',
      ],
      removeTokens: [
        'notifications-manager',
        'sales-channels-manager',
      ],
    },
  ],
  showVersion: {
    text: process.env.CONTAINER_VERSION || process.env.APP_VERSION || process.env.VERSION,
  },
  mediamanager: {
    fileStoragePath: '.tmp/public',
    allowMIME: ['image/*'],
    maxByteSize: 5 * 1024 * 1024,
  },
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
    // This must be enabled before Adminizer starts, otherwise it never creates
    // aiAssistantHandler for model registration.
    enabled: (process.env.ENABLE_AI_ASSISTANT ?? "true") === 'true',
    defaultModel: 'openharness',
    models: ['openharness'],
  },
};
