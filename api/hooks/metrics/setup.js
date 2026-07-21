'use strict';

/**
 * Wiring entry points for the metrics hook.
 *
 * Why this exists instead of relying on the sails hook loader: the release
 * image ships `.sailsrc.default` with `paths.hooks = "modules"`, and sails
 * scans exactly one hooks directory — so `api/hooks/*` is never auto-loaded in
 * a deployed container, and `index.js` initialize() would never run. The
 * dependable path is the same one the MCP server uses: a middleware referenced
 * from `config/http.js` plus a file in `api/bootstrap/`.
 *
 *   config/http.js        → middleware()      HTTP instrumentation + /metrics
 *   api/bootstrap/metrics.js → startCollectors()  runtime/emitter/database
 *
 * Both entry points share one lazily built instance, and index.js keeps working
 * if someone does point `paths.hooks` at `api/hooks` — the mount guard below
 * makes sure the middleware is never installed twice.
 */

const { getConfig } = require('./lib/config');
const { getRegistry } = require('./lib/registry');
const { DeviceActivity } = require('./lib/deviceActivity');
const endpoint = require('./lib/endpoint');
const httpMetrics = require('./lib/httpMetrics');
const runtimeCollector = require('./lib/collectors/runtime');
const emitterCollector = require('./lib/collectors/emitter');
const databaseCollector = require('./lib/collectors/database');

const INSTANCE_KEY = '__restoappMetricsInstance';
const MOUNTED_KEY = '__restoappMetricsMounted';

/**
 * Build (once) the config, registry and device tracker shared by both entry
 * points. Lazy on purpose: `config/http.js` is evaluated before the `sails`
 * global exists, so nothing may touch sails.config at require time.
 *
 * @param {Sails} [sailsInstance]
 * @returns {{enabled: boolean, config: Object, metrics: Object|null, deviceActivity: Object|null}}
 */
function getInstance(sailsInstance) {
  if (global[INSTANCE_KEY]) return global[INSTANCE_KEY];

  const app = sailsInstance || global.sails;
  if (!app || !app.config) {
    // Too early to decide anything; stay uninitialised and retry next call.
    return { enabled: false, pending: true, config: null, metrics: null, deviceActivity: null };
  }

  const config = getConfig(app);
  const instance = {
    enabled: config.enabled,
    config,
    metrics: config.enabled ? getRegistry(config) : null,
    deviceActivity: config.enabled ? new DeviceActivity() : null,
  };

  global[INSTANCE_KEY] = instance;
  return instance;
}

/**
 * Express middleware for `sails.config.http.middleware`.
 *
 * Returned eagerly (the config file needs a function at load time) but wired
 * lazily on the first request, when `sails` is up and the token is known.
 *
 * @returns {Function}
 */
function middleware() {
  // Marks the exporter as wired the moment config/http.js builds the chain —
  // before any hook initializes, so index.js can see it and skip mounting a
  // second, double-counting copy.
  global[MOUNTED_KEY] = true;

  let chain = null;

  return function metricsMiddleware(req, res, next) {
    if (chain === null) {
      const instance = getInstance();
      if (instance.pending) return next();

      if (!instance.enabled) {
        chain = [];
      } else {
        chain = [
          // Endpoint first: a scrape then never reaches the instrumentation
          // and cannot inflate the traffic it is measuring.
          endpoint.middleware(instance.config, instance.metrics),
          httpMetrics.middleware(instance.config, instance.metrics, instance.deviceActivity),
        ];
      }
    }

    if (chain.length === 0) return next();

    let index = 0;
    const run = (err) => {
      if (err) return next(err);
      const layer = chain[index++];
      if (!layer) return next();
      return layer(req, res, run);
    };
    return run();
  };
}

/**
 * Start the collectors. Called from api/bootstrap/metrics.js, i.e. after the
 * ORM is up and the model globals exist.
 *
 * @param {Sails} sailsInstance
 * @returns {boolean} whether metrics are running
 */
function startCollectors(sailsInstance) {
  const app = sailsInstance || global.sails;
  const instance = getInstance(app);

  if (!instance.enabled) {
    const reason = instance.config ? instance.config.disabledReason : 'sails is not ready';
    app.log.info(`Metrics > disabled: ${reason}. ` +
      'Set METRICS_TOKEN to a high-entropy secret (openssl rand -hex 32) to enable it.');
    return false;
  }

  if (global.__restoappMetricsCollectorsStarted) return true;
  global.__restoappMetricsCollectorsStarted = true;

  const { config, metrics, deviceActivity } = instance;

  runtimeCollector.start(app, metrics, config, deviceActivity);
  emitterCollector.start(app, metrics);
  databaseCollector.start(app, metrics, config);
  metrics.bootstrapCompleted.set(1);

  if (isMounted()) {
    app.log.info(`Metrics > collectors running; exposition on ${config.path} (bearer token required)`);
  } else {
    // Collectors without an endpoint: something removed the 'metrics' entry
    // from sails.config.http.middleware, so nothing can scrape them.
    app.log.warn("Metrics > collectors running but no endpoint is mounted — check the 'metrics' entry in config/http.js");
  }
  return true;
}

/**
 * True once the middleware has been installed from config/http.js — index.js
 * uses it to avoid mounting a second, double-counting copy.
 *
 * @returns {boolean}
 */
function isMounted() {
  return Boolean(global[MOUNTED_KEY]);
}

module.exports = { middleware, startCollectors, getInstance, isMounted };
