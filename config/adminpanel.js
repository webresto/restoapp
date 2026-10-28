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
        'user-filters',
      ],
      ensureTokens: [
        'user-filters',
        'globaly-operator-can-create',
        'globaly-operator-can-view',
        'globaly-operator-can-write',
        'globaly-operator-can-delete',
      ],
    },
    {
      // A group that exists already keeps its rights: on a running server they are ticked in the group's form.
      name: 'Marketer',
      description: 'Manages promotions, promo codes, the site\'s menus, pages and banners, the sign-in methods, scheduled maintenance, sees the orders report',
      tokens: [
        'access-to-adminpanel',
        'widgets',
        'widget-promotions-count',
        'widget-promotion-codes-count',
        'widget-promotion-code-orders-today',
        'widget-promotion-orders-today',
        'widget-banners-count',
        'widget-site-link',
        'promocodes-manager',
        'promotions-manager',
        'orders-report',
        'maintenance-manager',
        'navigation-manager',
        'pages-manager',
        'banners-manager',
        'auth-methods',
        'globaly-marketer-can-create',
        'globaly-marketer-can-view',
        'globaly-marketer-can-write',
        'globaly-marketer-can-delete',
      ],
      ensureTokens: [
        'globaly-marketer-can-create',
        'globaly-marketer-can-view',
        'globaly-marketer-can-write',
        'globaly-marketer-can-delete',
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
  // the menu under the brand, after «Админ-панель»: the storefront, in a new tab
  sections: [{ id: 'site', title: 'Site', link: '/', type: 'blank', icon: 'storefront' }],
  aiAssistant: {
    // This must be enabled before Adminizer starts, otherwise it never creates
    // aiAssistantHandler for model registration.
    // enabled: (process.env.ENABLE_AI_ASSISTANT ?? "true") === 'true',
    enabled: false,
    defaultModel: 'openharness',
    models: ['openharness'],
  },
};
