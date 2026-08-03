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
process.env.OPENHARNESS_BROKER_TOKEN = process.env.OPENHARNESS_BROKER_TOKEN ?? "0131ebb2c6739d6b310ab0d2b5e20b1ba0f210c035c6865075a334a2da3d8315"
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
        if (!adminizer.config.aiAssistant?.enabled) return;
        const prefix = adminizer.config.routePrefix;

        const navbarEntry = {
          id: 'openharness-agent',
          title: 'RestoApp Assistant',
          link: `${prefix}/openharness-agent`,
          icon: 'smart_toy',
          accessRightsToken: 'ai-assistant-openharness',
          section: 'Tools',
        };

        const existingLink = adminizer.config.navbar.additionalLinks
          .find((link) => link && link.id === 'openharness-agent');
        if (!existingLink) {
          adminizer.config.navbar.additionalLinks.push(navbarEntry);
        }

        // Provide this page to anything building links into the admin router.
        // Answered live over the emitter, so load order does not matter.
        try {
          const { AdminLinkProvider } = require('./AdminLinkProvider');
          AdminLinkProvider.provide('openharness-ui', () => ([{
            type: 'app',
            name: navbarEntry.id,
            link: navbarEntry.link,
            title: navbarEntry.title,
            section: navbarEntry.section,
            accessRightsToken: navbarEntry.accessRightsToken,
          }]));
        } catch (e) {
          sails.log.debug('OpenHarness admin link provider registration skipped', e);
        }

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
