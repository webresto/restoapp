'use strict';

module.exports.adminpanel = {
  models: {
  },
  filters: {
    enabled: true
  },
  auth: {
    enable: true,
    // PoW CAPTCHA on the admin login form. Solving it in the browser needs
    // `crypto.subtle`, which exists only in a secure context (https or
    // localhost), so over plain http on an IP/hostname login is impossible.
    // Set ENABLE_ADMIN_CAPTCHA=false to turn it off. See Readme "Admin panel CAPTCHA".
    // Only an explicit "false" disables it, so a typo cannot silently drop the
    // brute-force protection.
    captcha: (process.env.ENABLE_ADMIN_CAPTCHA ?? "true").toLowerCase() !== 'false',
  },
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
  // sails-adminpanel 5 always enables NavigationApp, and its constructor has no
  // defaults for these keys — without the block `setup()` throws on
  // `config.items.map(...)`, which aborts hook init before the admin middleware
  // is mounted (i.e. /admin silently falls through to the frontend SPA).
  navigation: {
    items: [],
    groupField: [],
    sections: [],
    movingGroupsRootOnly: false,
  },
  middlewares: [],
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
