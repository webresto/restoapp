'use strict';

/**
 * The /metrics endpoint.
 *
 * Threat model: nginx inside the container proxies `location /` to the app, so
 * whatever path this middleware answers on is reachable from the internet. The
 * exposition contains order volume, revenue, notification cost and the running
 * commit — nothing that may be served anonymously.
 *
 * Therefore:
 *   - the endpoint does not exist at all until METRICS_TOKEN passes the entropy
 *     gate (see lib/config.js);
 *   - the token is only accepted in a header, never in a query string: query
 *     strings land in the nginx access log and in every proxy in between;
 *   - the comparison is timing-safe;
 *   - an unauthenticated caller gets a bare 401 with no body — no version, no
 *     stack name, nothing to fingerprint.
 */

const crypto = require('crypto');

/**
 * Constant-time string comparison over SHA-256 digests, so unequal lengths do
 * not leak through timingSafeEqual's length check.
 *
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/**
 * @param {Object} req
 * @param {Object} config
 * @returns {boolean}
 */
function authorize(req, config) {
  if (!config.token) return false;

  const header = req.headers['authorization'];
  const bearer = typeof header === 'string' && /^Bearer\s+/i.test(header)
    ? header.replace(/^Bearer\s+/i, '').trim()
    : null;
  const provided = bearer || req.headers['x-metrics-key'];

  if (!provided || typeof provided !== 'string') return false;
  return safeEqual(provided, config.token);
}

/**
 * Express middleware serving the exposition. Mount it before the request
 * instrumentation so scrapes do not show up in the HTTP metrics themselves.
 *
 * @param {Object} config
 * @param {Object} metrics
 * @returns {Function}
 */
function middleware(config, metrics) {
  return async function metricsEndpoint(req, res, next) {
    const url = String(req.url || '').split('?')[0];
    if (url !== config.path) return next();
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();

    if (!authorize(req, config)) {
      res.statusCode = 401;
      res.setHeader('WWW-Authenticate', 'Bearer realm="metrics"');
      res.setHeader('Cache-Control', 'no-store');
      return res.end();
    }

    try {
      const body = await metrics.registry.metrics();
      res.statusCode = 200;
      res.setHeader('Content-Type', metrics.registry.contentType);
      res.setHeader('Cache-Control', 'no-store');
      return res.end(req.method === 'HEAD' ? undefined : body);
    } catch (error) {
      sails.log.error('Metrics > failed to render exposition:', error);
      res.statusCode = 500;
      return res.end();
    }
  };
}

module.exports = { middleware, authorize, safeEqual };
