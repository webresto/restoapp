'use strict';

/**
 * Prometheus metrics hook.
 *
 * Exposes GET /metrics (token-protected, see lib/endpoint.js) with three
 * families of series:
 *   - runtime health of the Node process (heap, GC, event loop, emitter
 *     subscribers, log error rate, free disk);
 *   - HTTP/GraphQL traffic, latency and status codes;
 *   - the business state the operator actually reacts to: order funnel, stuck
 *     orders, payments, RMS sync freshness, notification failures.
 *
 * Nothing in @webresto/core is patched — the business numbers come from events
 * the core already emits and from read-only aggregate queries.
 *
 * Configuration lives in lib/config.js; the metric catalogue in docs.md.
 */

const { getConfig } = require('./lib/config');
const { getRegistry } = require('./lib/registry');
const endpoint = require('./lib/endpoint');
const httpMetrics = require('./lib/httpMetrics');
const { DeviceActivity } = require('./lib/deviceActivity');
const runtimeCollector = require('./lib/collectors/runtime');
const emitterCollector = require('./lib/collectors/emitter');
const databaseCollector = require('./lib/collectors/database');

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
      const config = getConfig(sails);

      if (!config.enabled) {
        sails.log.info(`Metrics > endpoint disabled: ${config.disabledReason}. ` +
          'Set METRICS_TOKEN to a high-entropy secret (openssl rand -hex 32) to enable it.');
        return cb();
      }

      const metrics = getRegistry(config);
      // Shared between the request middleware (which sees device ids) and the
      // runtime collector (which publishes the windowed counts).
      const deviceActivity = new DeviceActivity();

      // Both middlewares are mounted synchronously here on purpose: express
      // runs middleware in registration order, and anything mounted later (from
      // an event handler) lands behind the `frontendRoutes` catch-all in
      // config/http.js and never runs — see the infra journal entry
      // 2026-07-06-gfcafe-admin-module-assets-shadowed.md.
      const mount = () => {
        const app = sails.hooks.http && sails.hooks.http.app;
        if (!app) {
          sails.log.error('Metrics > express app unavailable, /metrics not mounted');
          return;
        }
        // Endpoint first: a scrape then never reaches the instrumentation and
        // cannot inflate the traffic it is measuring.
        app.use(endpoint.middleware(config, metrics));
        app.use(httpMetrics.middleware(config, metrics, deviceActivity));
        sails.log.info(`Metrics > exposing ${config.path} (bearer token required)`);
      };

      if (sails.hooks.http && sails.hooks.http.app) {
        mount();
      } else {
        sails.after('hook:http:loaded', mount);
      }

      runtimeCollector.start(sails, metrics, config, deviceActivity);
      emitterCollector.start(sails, metrics);

      // Model globals (SalesChannel, Maintenance) and the datastore only exist
      // once the ORM is up.
      sails.after('hook:orm:loaded', () => {
        databaseCollector.start(sails, metrics, config);
      });

      metrics.bootstrapCompleted.set(1);
      return cb();
    },
  };
};
