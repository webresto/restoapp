'use strict';

/**
 * In-process gauges and error counters.
 *
 * Everything here is cheap (no I/O except a statfs) and answers the questions
 * the operations journal keeps asking after an incident:
 *   - "did it crash on its own or was it killed?" → heap_used_ratio + process_start_time
 *   - "why is MaxListenersExceededWarning in the log?" → emitter_subscribers, process_warnings_total
 *   - "is the disk full again?"                   → disk_free_bytes
 *   - "broken migration or dead postgres again?"  → db_errors_total{kind}
 */

const fs = require('fs');
const v8 = require('v8');

/** Log lines that mean the database, not the code, is the problem. */
const DB_ERROR_PATTERNS = [
  [/column .* does not exist|errormissingcolumn/i, 'missing_column'],
  [/relation .* does not exist|errormissingtable/i, 'missing_relation'],
  [/eai_again|econnrefused|badconnection|connection terminated|server closed the connection/i, 'connection'],
  [/deadlock detected/i, 'deadlock'],
  [/(query|statement) timeout|canceling statement due to/i, 'timeout'],
  [/no space left on device/i, 'disk_full'],
];

/**
 * @param {string} text
 * @returns {string|null} classification, or null when it is not a DB error
 */
function classifyDbError(text) {
  for (const [pattern, kind] of DB_ERROR_PATTERNS) {
    if (pattern.test(text)) return kind;
  }
  return null;
}

/**
 * Which subsystem an error came from. First match wins, so the list is ordered
 * from the most specific marker to the most generic word.
 *
 * This is what turns "the log is full of errors" into "the errors are pouring
 * out of iiko" during an investigation, without putting a free-form message
 * into a label.
 */
const ERROR_SOURCE_PATTERNS = [
  [/graphql/i, 'graphql'],
  [/iiko|rms|out-?of-?stock|sync/i, 'rms'],
  [/notification|fcm|firebase|apns|sms|push/i, 'notification'],
  [/payment|paymentdocument|acquir/i, 'payment'],
  [/order|cart|orderdish|checkout/i, 'order'],
  [/promotion|promocode/i, 'promotion'],
  [/adminpanel|adminizer|admin panel/i, 'admin'],
  [/node-?red/i, 'nodered'],
  [/openharness|llm|assistant/i, 'openharness'],
  [/\bmcp\b/i, 'mcp'],
  [/waterline|adapter|postgres|datastore|orm/i, 'database'],
  [/hook|bootstrap|initialize/i, 'bootstrap'],
];

/**
 * @param {string} text
 * @returns {string} subsystem slug, "other" when nothing matched
 */
function classifyErrorSource(text) {
  for (const [pattern, source] of ERROR_SOURCE_PATTERNS) {
    if (pattern.test(text)) return source;
  }
  return 'other';
}

/**
 * Flatten log arguments into a bounded string for pattern matching. Only the
 * first 2 KB is inspected — stack traces are long and the marker is at the top.
 *
 * @param {Array} args
 * @returns {string}
 */
function argsToText(args) {
  let out = '';
  for (const arg of args) {
    if (out.length > 2048) break;
    if (arg instanceof Error) out += ` ${arg.message}`;
    else if (typeof arg === 'string') out += ` ${arg}`;
    else if (arg && typeof arg === 'object') out += ` ${arg.message || arg.code || ''}`;
  }
  return out.slice(0, 2048);
}

/**
 * Wrap sails.log so error/warn volume becomes a metric. A crash loop, a broken
 * migration and a dead datastore all show up here long before anyone opens the
 * container log.
 *
 * @param {Sails} sails
 * @param {Object} metrics
 */
function instrumentLogger(sails, metrics) {
  if (!sails.log || sails.log.__metricsWrapped) return;

  for (const level of ['error', 'warn']) {
    const original = sails.log[level];
    if (typeof original !== 'function') continue;

    sails.log[level] = function wrappedLog(...args) {
      try {
        metrics.logMessages.inc({ level });
        const text = argsToText(args);

        const kind = classifyDbError(text);
        if (kind) metrics.dbErrors.inc({ kind });

        if (level === 'error') {
          const source = classifyErrorSource(text);
          metrics.logErrors.inc({ source });
          metrics.lastErrorTimestamp.set({ source }, Date.now() / 1000);
        }
      } catch (_) {
        // A metrics failure must never swallow a log line.
      }
      return original.apply(this, args);
    };
  }

  sails.log.__metricsWrapped = true;
}

/**
 * Count subscribers per core emitter event. A steadily growing number for one
 * event is a listener leak — the shape that preceded the 2026-07-18 heap OOM.
 *
 * @param {Object} metrics
 */
function collectEmitterSubscribers(metrics) {
  const emitter = global.emitter;
  if (!emitter || !Array.isArray(emitter.events)) return;

  for (const event of emitter.events) {
    if (!event || !Array.isArray(event.subscribers)) continue;
    if (event.subscribers.length === 0) continue;
    metrics.emitterSubscribers.set({ event: String(event.name) }, event.subscribers.length);
  }
}

/**
 * @param {Object} config
 * @param {Object} metrics
 */
function collectDisk(config, metrics) {
  if (typeof fs.statfsSync !== 'function') return;

  for (const path of config.diskPaths) {
    try {
      const stat = fs.statfsSync(path);
      metrics.diskFreeBytes.set({ path }, stat.bavail * stat.bsize);
      metrics.diskTotalBytes.set({ path }, stat.blocks * stat.bsize);
    } catch (_) {
      // A path that does not exist in this container is not worth a log line
      // on every tick; the missing series is the signal.
    }
  }
}

/**
 * @param {Sails} sails
 * @param {Object} metrics
 */
function collectConnections(sails, metrics) {
  const server = sails.hooks && sails.hooks.http && sails.hooks.http.server;
  if (!server || typeof server.getConnections !== 'function') return;

  server.getConnections((err, count) => {
    if (!err) metrics.openConnections.set(count);
  });
}

/**
 * @param {Sails} sails
 * @param {Object} metrics
 * @param {Object} config
 * @param {Object} [deviceActivity] tracker from lib/deviceActivity.js
 * @returns {Function} stop function
 */
function start(sails, metrics, config, deviceActivity) {
  instrumentLogger(sails, metrics);

  // Process listeners are registered once per process: the hook can initialize
  // again (in-process restart via app-manager) and duplicated listeners would
  // both double-count and creep towards MaxListenersExceededWarning.
  if (!global.__restoappMetricsProcessHooks) {
    global.__restoappMetricsProcessHooks = true;

    const safeInc = (metric, labels) => {
      try { metric.inc(labels); } catch (_) { /* never break the process path */ }
    };

    process.on('warning', (warning) => {
      safeInc(metrics.processWarnings, { name: (warning && warning.name) ? String(warning.name) : 'Warning' });
    });
    process.on('unhandledRejection', () => safeInc(metrics.unhandledErrors, { kind: 'rejection' }));
    // 'uncaughtExceptionMonitor' observes without suppressing the default crash:
    // a plain 'uncaughtException' listener would stop Node from exiting and turn
    // a fatal error into a zombie process under pm2.
    process.on('uncaughtExceptionMonitor', () => safeInc(metrics.unhandledErrors, { kind: 'exception' }));
  }

  const tick = () => {
    const startedAt = process.hrtime.bigint();
    try {
      const heap = v8.getHeapStatistics();
      metrics.heapLimitBytes.set(heap.heap_size_limit);
      metrics.heapUsedRatio.set(heap.heap_size_limit ? heap.used_heap_size / heap.heap_size_limit : 0);

      collectEmitterSubscribers(metrics);
      collectDisk(config, metrics);
      collectConnections(sails, metrics);

      if (deviceActivity) {
        for (const { label, count } of deviceActivity.snapshot()) {
          metrics.activeDevices.set({ window: label }, count);
        }
      }
    } catch (error) {
      metrics.collectorErrors.inc({ collector: 'runtime' });
      sails.log.debug('Metrics > runtime collector failed:', error);
    }
    metrics.collectorDuration.set({ collector: 'runtime' }, Number(process.hrtime.bigint() - startedAt) / 1e9);
  };

  tick();
  const timer = setInterval(tick, Math.max(5, config.runtimeIntervalSeconds) * 1000);
  timer.unref();

  return () => clearInterval(timer);
}

module.exports = { start, classifyDbError, classifyErrorSource, instrumentLogger };
