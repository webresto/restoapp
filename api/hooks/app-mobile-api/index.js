'use strict';

/**
 * app-mobile-api: the API of the RestoApp mobile admin app on /api/mobile/*.
 * See docs.md. Wired in restoapp.js: api/hooks is not scanned by Sails (paths.hooks = modules).
 */
module.exports = function appMobileApiHook(sails) {
  const hook = require('./lib/hook').default(sails);
  return {
    configure: hook.configure,
    initialize: hook.initialize,
    registry: hook.registry,
    translator: hook.translator,
  };
};
