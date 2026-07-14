'use strict';

/**
 * OpenHarness agent admin UI.
 *
 * Serves the prebuilt React bundle (ui-src -> assets, `npm run
 * build:openharness-ui`) and registers the admin panel page + navbar link.
 * The agent API endpoints live in api/bootstrap/openharness-sse.js.
 */

const path = require('path');
const serveStatic = require('serve-static');

module.exports = function openharnessUiHook(sails) {
  return {
    initialize: function (cb) {
      // Static assets must be mounted on the root express app; mounting after
      // the frontendRoutes catch-all would make it unreachable (see
      // docs/journal/2026-07-06-gfcafe-admin-module-assets-shadowed.md).
      sails.after('hook:http:loaded', () => {
        sails.hooks.http.app.use(
          '/openharness-ui/assets',
          serveStatic(path.join(__dirname, 'assets')),
        );
      });

      sails.on('Adminpanel:loaded', () => {
        const adminizer = sails.hooks.adminpanel?.adminizer;
        if (!adminizer) return;
        const prefix = adminizer.config.routePrefix;

        adminizer.config.navbar.additionalLinks.push({
          id: 'openharness-agent',
          title: 'OpenHarness Agent',
          link: `${prefix}/openharness-agent`,
          icon: 'smart_toy',
          accessRightsToken: 'ai-assistant-openharness',
          section: 'Tools',
        });

        adminizer.app.get(`${prefix}/openharness-agent`, (req, res) => {
          const config = req.adminizer?.config;
          if (config?.auth?.enable && !req.user) {
            return res.redirect(`${config.routePrefix}/model/userap/login`);
          }
          if (!req.adminizer?.accessRightsHelper?.hasPermission('ai-assistant-openharness', req.user)) {
            return res.sendStatus(403);
          }
          return req.Inertia.render({
            component: 'module',
            props: { moduleComponent: '/openharness-ui/assets/OpenHarnessAgent.js' },
          });
        });
      });

      return cb();
    },
  };
};
