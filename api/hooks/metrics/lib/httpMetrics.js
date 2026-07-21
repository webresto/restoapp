'use strict';

/**
 * HTTP request instrumentation.
 *
 * Mounted at the root of the express app during initialize, i.e. in front of
 * the whole `sails.config.http.middleware.order` chain, so the recorded
 * duration is what the client actually waited for — including body parsing,
 * session lookup and the SPA catch-all.
 *
 * The `route` label is a closed set of route classes, never the raw URL: raw
 * paths carry order ids, slugs and tokens, which would both explode cardinality
 * and copy customer data into the metrics endpoint.
 */

/** Paths that are never worth a series of their own. */
const STATIC_EXT = /\.(js|mjs|css|map|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|txt|json|wasm)$/i;

/**
 * @param {string} url request URL without query string
 * @returns {string} bounded route class
 */
function classifyRoute(url) {
  if (url === '/healthz' || url === '/readyz') return 'health';
  if (url === '/graphql' || url.startsWith('/graphql')) return 'graphql';
  if (url === '/mcp' || url.startsWith('/mcp/')) return 'mcp';
  if (url.startsWith('/red')) return 'nodered';
  if (url.startsWith('/admin/api/') || url.startsWith('/admin/model/')) return 'admin-api';
  if (url.startsWith('/admin')) return 'admin';
  if (url.startsWith('/restocore/assets') || url.startsWith('/openharness-ui/assets')) return 'static';
  if (STATIC_EXT.test(url)) return 'static';
  if (url === '/') return 'spa';
  return 'other';
}

/** GraphQL operation names are client-supplied — accept only sane identifiers. */
const OPERATION_NAME = /^[A-Za-z_][A-Za-z0-9_]{0,39}$/;

/**
 * Keeps the operation label bounded: the first N distinct names seen get their
 * own series, everything after that collapses into "other".
 */
function makeOperationLabeller(limit) {
  const seen = new Set();
  return function operationLabel(req) {
    const body = req.body;
    const raw = body && typeof body === 'object' ? body.operationName : null;
    if (!raw || typeof raw !== 'string') return 'anonymous';
    if (!OPERATION_NAME.test(raw)) return 'other';
    if (seen.has(raw)) return raw;
    if (seen.size >= limit) return 'other';
    seen.add(raw);
    return raw;
  };
}

/**
 * Bytes actually written, when the framework announced a length. Streamed and
 * chunked responses report nothing, which is why this is a counter and not a
 * histogram: an approximate bytes/s per route is useful, a wrong percentile
 * would not be.
 *
 * @param {Object} res
 * @returns {number}
 */
function responseBytes(res) {
  const header = typeof res.getHeader === 'function' ? res.getHeader('content-length') : null;
  const length = Number(header);
  return Number.isFinite(length) && length > 0 ? length : 0;
}

/**
 * @param {Object} config
 * @param {Object} metrics
 * @param {Object} deviceActivity tracker from lib/deviceActivity.js
 * @returns {Function} express middleware
 */
function middleware(config, metrics, deviceActivity) {
  const operationLabel = makeOperationLabeller(config.maxGraphqlOperations);

  return function httpMetricsMiddleware(req, res, next) {
    const url = String(req.url || '').split('?')[0];

    // Scrapes must not inflate the traffic they are measuring.
    if (url === config.path) return next();

    const route = classifyRoute(url);
    const method = String(req.method || 'GET').toUpperCase();
    const startedAt = process.hrtime.bigint();

    // Site load per unique device. The header is what the storefront sends on
    // every call; requests without it are guests, bots and server-to-server.
    if (deviceActivity && deviceActivity.track(req.headers['x-device-id'] || req.headers['X-Device-Id'])) {
      metrics.deviceRequests.inc({ route });
    } else {
      metrics.anonymousRequests.inc({ route });
    }

    metrics.httpInFlight.inc({ route });

    let finished = false;
    const record = () => {
      if (finished) return;
      finished = true;

      const seconds = Number(process.hrtime.bigint() - startedAt) / 1e9;
      const status = String(res.statusCode || 0);

      metrics.httpInFlight.dec({ route });
      metrics.httpRequests.inc({ route, method, status });
      metrics.httpDuration.observe({ route, method }, seconds);

      const bytes = responseBytes(res);
      if (bytes) metrics.httpResponseBytes.inc({ route }, bytes);

      // Server errors get their own counter: "how many server errors" must
      // be one expression, not a filter over the traffic counter.
      if (res.statusCode >= 500) metrics.httpServerErrors.inc({ route, status });

      // The response never completed — client timeout, closed tab, dropped
      // mobile connection. A spike here is a latency problem seen from outside.
      if (!res.writableEnded) metrics.httpClientDisconnects.inc({ route });

      // By the time the response finishes the body parser downstream has
      // populated req.body, so the GraphQL operation name is readable here
      // without buffering the request ourselves.
      if (route === 'graphql' && method === 'POST') {
        const operation = operationLabel(req);
        metrics.graphqlOperations.inc({ operation, status });
        metrics.graphqlDuration.observe({ operation }, seconds);
      }
    };

    // 'close' covers clients that hang up mid-response (mobile app on a bad
    // connection) — without it the in-flight gauge would drift upwards forever.
    res.on('finish', record);
    res.on('close', record);

    return next();
  };
}

module.exports = { middleware, classifyRoute };
