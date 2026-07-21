'use strict';

/**
 * Prometheus metrics hook.
 *
 * Exposes GET /metrics (token-protected, see lib/endpoint.js) with three
 * families of series:
 *   - runtime health of the Node process (heap, GC, event loop, emitter
 *     subscribers, log error rate, free disk);
 *   - HTTP/GraphQL traffic, latency, status codes and unique devices;
 *   - the business state the operator actually reacts to: order funnel, order
 *     failures, stuck orders, payments, sales channels, RMS sync freshness,
 *     notification failures.
 *
 * Nothing in @webresto/core is patched — the business numbers come from events
 * the core already emits and from read-only aggregate queries.
 *
 * NOTE: in a deployed container this file is normally NOT executed. The release
 * image sets `paths.hooks = "modules"` in .sailsrc, so sails never scans
 * api/hooks, and the exporter is wired through config/http.js +
 * api/bootstrap/metrics.js instead (see setup.js). This hook definition is kept
 * for installations that do point paths.hooks at api/hooks; it delegates to the
 * very same setup module and refuses to mount a second middleware copy.
 *
 * Configuration lives in lib/config.js; the metric catalogue in docs.md.
 */

const setup = require('./setup');

module.exports = function metricsHook(sails) {
  return {
    defaults: {
      metrics: {
        enabled: true,
        path: '/metrics',
        dbIntervalSeconds: 30,
        runtimeIntervalSeconds: 15,
        windowHours: 24,
      },
    },

    initialize: function (cb) {
      const instance = setup.getInstance(sails);

      if (!instance.enabled) {
        sails.log.info(`Metrics > endpoint disabled: ${instance.config ? instance.config.disabledReason : 'sails is not ready'}`);
        return cb();
      }

      // config/http.js already installed the middleware in the configured
      // chain; mounting again here would double-count every request.
      if (!setup.isMounted()) {
        // Mounted synchronously on purpose: express runs middleware in
        // registration order, and anything mounted later (from an event
        // handler) lands behind the `frontendRoutes` catch-all in
        // config/http.js and never runs — see the infra journal entry
        // 2026-07-06-gfcafe-admin-module-assets-shadowed.md.
        const mount = () => {
          const app = sails.hooks.http && sails.hooks.http.app;
          if (!app) {
            sails.log.error('Metrics > express app unavailable, /metrics not mounted');
            return;
          }
          app.use(setup.middleware());
          sails.log.info(`Metrics > exposing ${instance.config.path} (bearer token required)`);
        };

        if (sails.hooks.http && sails.hooks.http.app) mount();
        else sails.after('hook:http:loaded', mount);
      }

      // Model globals and the datastore only exist once the ORM is up.
      sails.after('hook:orm:loaded', () => setup.startCollectors(sails));

      return cb();
    },
  };
};
