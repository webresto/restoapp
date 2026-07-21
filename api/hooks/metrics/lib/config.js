'use strict';

/**
 * Configuration for the metrics hook.
 *
 * Resolution order: env var -> sails.config.metrics -> built-in default.
 * Everything is read once at initialize() and frozen, so a running process
 * always exports what it announced at boot.
 */

/**
 * Shannon entropy of a string, scaled by length, in bits.
 * Same rule as the Node-RED admin token (see lib/bindNodeRed.js): a scrape
 * token is a long-lived secret sitting on a publicly reachable path, so a
 * guessable value is treated as "no token at all".
 *
 * @param {string} str
 * @returns {number} estimated bits of entropy
 */
function entropyBits(str) {
  if (!str) return 0;
  const freq = new Map();
  for (const ch of str) freq.set(ch, (freq.get(ch) || 0) + 1);
  let perChar = 0;
  for (const count of freq.values()) {
    const p = count / str.length;
    perChar -= p * Math.log2(p);
  }
  return perChar * str.length;
}

// Minimum entropy required of METRICS_TOKEN. 64 bits ≈ 16 random hex chars.
const MIN_ENTROPY_BITS = 64;

/**
 * @param {string|undefined} token
 * @returns {{ ok: boolean, reason?: string, bits?: number }}
 */
function validateToken(token) {
  if (token === undefined || token === null || String(token).trim() === '') {
    return { ok: false, reason: 'METRICS_TOKEN is not set' };
  }
  const bits = entropyBits(String(token));
  if (bits < MIN_ENTROPY_BITS) {
    return {
      ok: false,
      bits,
      reason: `METRICS_TOKEN has low entropy (${bits.toFixed(1)} bits, min ${MIN_ENTROPY_BITS})`,
    };
  }
  return { ok: true, bits };
}

function envNumber(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
}

function envBool(name, fallback) {
  const raw = process.env[name];
  if (raw === undefined || raw === '') return fallback;
  return raw === 'true' || raw === '1';
}

/**
 * Build the effective configuration.
 *
 * @param {Sails} sails
 * @returns {Object} frozen config
 */
function getConfig(sails) {
  const fromSails = (sails && sails.config && sails.config.metrics) || {};
  const tokenCheck = validateToken(process.env.METRICS_TOKEN || fromSails.token);

  // The endpoint is reachable through nginx (`location /` proxies everything to
  // the app), so it stays off until a strong token exists. METRICS_ENABLED=false
  // is an explicit kill switch on top of that.
  const wanted = envBool('METRICS_ENABLED', fromSails.enabled !== false);

  const config = {
    enabled: wanted && tokenCheck.ok,
    /** Why the endpoint is off, for the boot log. */
    disabledReason: !wanted ? 'METRICS_ENABLED=false' : (tokenCheck.ok ? null : tokenCheck.reason),
    token: process.env.METRICS_TOKEN || fromSails.token || null,
    path: process.env.METRICS_PATH || fromSails.path || '/metrics',
    /** Logged-in adminpanel administrators may open the page in a browser. */
    allowAdminSession: envBool('METRICS_ALLOW_ADMIN', fromSails.allowAdminSession !== false),
    /** Node/V8 metrics (heap, GC, event loop lag) — the OOM early warning. */
    collectDefaultMetrics: envBool('METRICS_DEFAULT_METRICS', fromSails.collectDefaultMetrics !== false),
    /** Seconds between DB gauge refreshes; 0 disables the DB collector. */
    dbIntervalSeconds: envNumber('METRICS_DB_INTERVAL', fromSails.dbIntervalSeconds || 30),
    /** Seconds between cheap in-process gauge refreshes (heap ratio, disk). */
    runtimeIntervalSeconds: envNumber('METRICS_RUNTIME_INTERVAL', fromSails.runtimeIntervalSeconds || 15),
    /** Rolling window for order/payment/notification gauges, in hours. */
    windowHours: envNumber('METRICS_WINDOW_HOURS', fromSails.windowHours || 24),
    /** Filesystems to report free space for (disk-full incidents). */
    diskPaths: String(process.env.METRICS_DISK_PATHS || (fromSails.diskPaths || []).join(',') || process.cwd())
      .split(',').map((p) => p.trim()).filter(Boolean),
    /** Cap on distinct GraphQL operation names; the rest collapse to "other". */
    maxGraphqlOperations: envNumber('METRICS_MAX_GRAPHQL_OPERATIONS', fromSails.maxGraphqlOperations || 60),
    /** Static labels added to every series — one Prometheus, many stacks. */
    defaultLabels: {
      stack: process.env.STACK_NAME || fromSails.stack || 'unknown',
      env: process.env.NODE_ENV || 'development',
    },
    buildInfo: {
      version: process.env.CONTAINER_VERSION || '',
      commit: (process.env.COMMIT_HASH || '').slice(0, 12),
      branch: process.env.BRANCH || '',
      node: process.version,
      staging: process.env.STAGING === '1' ? '1' : '0',
    },
  };

  return Object.freeze(config);
}

module.exports = { getConfig, validateToken, entropyBits, MIN_ENTROPY_BITS };
