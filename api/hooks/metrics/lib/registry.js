'use strict';

/**
 * Prometheus registry and the full metric catalogue of RestoApp.
 *
 * The instance is kept on `global` for the same reason getEmitter() does it
 * (see @webresto/core libs/getEmitter.ts): under tsx the same file can be
 * instantiated twice and a module-scoped singleton would silently split — the
 * collectors would then write into one registry while /metrics renders the
 * other, and every business metric would read as zero.
 *
 * Cardinality rules for anything added here:
 *   - never label with an id (order id, user id, device id, phone) — that is
 *     both unbounded and PII in a metrics endpoint;
 *   - keep label values from a closed set (order states, channel names, status
 *     codes) or map them through a whitelist.
 */

const promClient = require('prom-client');

const GLOBAL_KEY = '__restoappMetrics';
const PREFIX = 'restoapp_';

/** Latency buckets tuned for a Sails app behind nginx: 25ms … 30s. */
const HTTP_BUCKETS = [0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 30];

/**
 * @param {Object} config from lib/config.js
 * @returns {Object} the metrics facade: { registry, ...metrics }
 */
function getRegistry(config) {
  const g = global;
  if (g[GLOBAL_KEY]) return g[GLOBAL_KEY];

  const registry = new promClient.Registry();
  registry.setDefaultLabels(config.defaultLabels);

  if (config.collectDefaultMetrics) {
    // process_* and nodejs_* — heap, RSS, GC pauses, event loop lag, handles.
    // nodejs_heap_size_used_bytes + nodejs_gc_duration_seconds are what turn
    // "the app restarted out of nowhere" into a graph you can read.
    promClient.collectDefaultMetrics({ register: registry });
  }

  const counter = (name, help, labelNames = []) =>
    new promClient.Counter({ name: PREFIX + name, help, labelNames, registers: [registry] });
  const gauge = (name, help, labelNames = []) =>
    new promClient.Gauge({ name: PREFIX + name, help, labelNames, registers: [registry] });
  const histogram = (name, help, labelNames = [], buckets = HTTP_BUCKETS) =>
    new promClient.Histogram({ name: PREFIX + name, help, labelNames, buckets, registers: [registry] });

  const metrics = {
    registry,
    promClient,

    // ─── Build / liveness ────────────────────────────────────────────────
    buildInfo: gauge('build_info', 'Always 1; labels carry the running build.',
      ['version', 'commit', 'branch', 'node', 'staging']),
    ready: gauge('ready', '1 when the app passes the /readyz checks, 0 otherwise.'),
    maintenanceEnabled: gauge('maintenance_enabled', '1 while a maintenance window is active.'),
    bootstrapCompleted: gauge('bootstrap_completed', '1 once the metrics hook finished wiring collectors.'),

    // ─── Node runtime health (OOM / leak detection) ──────────────────────
    heapUsedRatio: gauge('heap_used_ratio', 'V8 heap used / heap size limit (1.0 = OOM kill).'),
    heapLimitBytes: gauge('heap_limit_bytes', 'V8 heap size limit in bytes.'),
    openConnections: gauge('http_open_connections', 'Open TCP connections on the app HTTP server (keep-alive + websockets).'),
    emitterSubscribers: gauge('emitter_subscribers', 'Subscribers registered per core emitter event — a growing value is a listener leak.', ['event']),
    processWarnings: counter('process_warnings_total', 'process "warning" events by name (e.g. MaxListenersExceededWarning).', ['name']),
    unhandledErrors: counter('unhandled_errors_total', 'Unhandled rejections and uncaught exceptions.', ['kind']),
    logMessages: counter('log_messages_total', 'Messages written through sails.log, by level.', ['level']),
    dbErrors: counter('db_errors_total', 'Database-shaped errors seen in the log, classified.', ['kind']),

    // ─── Server errors, by where they came from ──────────────────────────
    logErrors: counter('log_errors_total', 'sails.log.error calls attributed to a subsystem.', ['source']),
    lastErrorTimestamp: gauge('last_error_timestamp_seconds', 'Unix time of the last logged error per subsystem.', ['source']),
    httpServerErrors: counter('http_server_errors_total', 'Responses with a 5xx status, by route class.', ['route', 'status']),

    // ─── Storage ─────────────────────────────────────────────────────────
    diskFreeBytes: gauge('disk_free_bytes', 'Free space on a filesystem the app writes to.', ['path']),
    diskTotalBytes: gauge('disk_total_bytes', 'Total size of a filesystem the app writes to.', ['path']),

    // ─── HTTP ────────────────────────────────────────────────────────────
    httpRequests: counter('http_requests_total', 'HTTP requests served, by route class.', ['route', 'method', 'status']),
    httpDuration: histogram('http_request_duration_seconds', 'HTTP request duration by route class.', ['route', 'method']),
    httpInFlight: gauge('http_requests_in_flight', 'HTTP requests currently being served.', ['route']),
    httpResponseBytes: counter('http_response_bytes_total', 'Bytes returned to clients, by route class.', ['route']),
    httpClientDisconnects: counter('http_client_disconnects_total', 'Clients that hung up before the response finished.', ['route']),

    // ─── Traffic by device (site load) ───────────────────────────────────
    activeDevices: gauge('active_devices', 'Unique X-Device-Id values seen in live traffic within the window.', ['window']),
    deviceRequests: counter('device_requests_total', 'Requests that carried an X-Device-Id header, by route class.', ['route']),
    anonymousRequests: counter('anonymous_requests_total', 'Requests without a usable X-Device-Id header, by route class.', ['route']),

    // ─── GraphQL (the public storefront API) ─────────────────────────────
    graphqlOperations: counter('graphql_operations_total', 'GraphQL operations by name and HTTP status.', ['operation', 'status']),
    graphqlDuration: histogram('graphql_operation_duration_seconds', 'GraphQL operation duration.', ['operation']),

    // ─── Order funnel (event-driven counters) ────────────────────────────
    ordersCreated: counter('orders_created_total', 'Carts created.'),
    ordersCreatedToday: gauge('orders_created_today', 'Carts created since local server midnight.'),
    ordersCheckout: counter('orders_checkout_total', 'Checkouts initiated (core:order-init-checkout).'),
    ordersCheckoutToday: gauge('orders_checkout_today', 'Checkouts initiated since local server midnight.'),
    ordersPlaced: counter('orders_placed_total', 'Orders successfully placed.', ['self_service', 'platform']),
    ordersPlacedToday: gauge('orders_placed_today', 'Orders successfully placed since local server midnight.', ['self_service', 'platform']),
    ordersAmount: counter('orders_amount_total', 'Sum of order totals at placement, in store currency.', ['platform']),
    ordersAmountToday: gauge('orders_amount_today', 'Sum of order totals at placement since local server midnight, in store currency.', ['platform']),
    orderTransitions: counter('order_state_transitions_total', 'Order state transitions observed.', ['from', 'to']),
    orderLog: counter('order_log_total', 'Entries written to the per-order log, by level and module.', ['level', 'module']),

    // ─── Order failures (what to actually react to) ──────────────────────
    orderErrors: counter('order_errors_total', 'Error/warning entries in order logs, by the operation that failed.', ['level', 'module', 'op']),
    orderErrorsToday: gauge('order_errors_today', 'Error/warning entries in order logs since local server midnight.', ['level', 'module', 'op']),
    orderRejects: counter('order_rejects_total', 'Cart operations the core refused, by reason.', ['reason']),
    orderRejectsToday: gauge('order_rejects_today', 'Cart operations the core refused since local server midnight, by reason.', ['reason']),

    // ─── Order gauges (from the database) ────────────────────────────────
    ordersInState: gauge('orders_in_state', 'Orders per state inside the metrics window.', ['state']),
    ordersOldestAge: gauge('orders_oldest_age_seconds', 'Age of the oldest order still sitting in a non-terminal state.', ['state']),
    lastOrderPlaced: gauge('last_order_placed_timestamp_seconds', 'Unix time of the most recent placed order (0 = none in window).'),

    // ─── Sales channels ──────────────────────────────────────────────────
    ordersByChannel: gauge('orders_by_channel', 'Orders inside the window per resolved sales channel.', ['channel', 'placed']),
    ordersByPlatform: gauge('orders_by_platform', 'Orders inside the window per raw orderedOnPlatform value.', ['platform']),
    salesChannels: gauge('sales_channels', 'Configured sales channels by status.', ['status', 'enabled']),

    // ─── Devices (from the database) ─────────────────────────────────────
    devicesTotal: gauge('devices_total', 'Registered user devices.'),
    devicesActive: gauge('devices_active', 'Devices whose lastActivity falls inside the window (login/session traffic).', ['window']),
    devicesLoggedIn: gauge('devices_logged_in', 'Devices currently marked as logged in.'),
    devicesWithPushToken: gauge('devices_with_push_token', 'Devices holding a push token, by platform.', ['platform']),

    // ─── Payments ────────────────────────────────────────────────────────
    paymentsInitiated: counter('payments_initiated_total', 'Payment documents registered.'),
    paymentsChecked: counter('payments_checked_total', 'Payment status checks performed.'),
    paymentsPaid: counter('payments_paid_total', 'Payment documents that reached PAID.'),
    paymentsCancelled: counter('payments_cancelled_total', 'Payment documents cancelled.'),
    paymentsInStatus: gauge('payments_in_status', 'Payment documents per status inside the metrics window.', ['status']),
    paymentsPendingOldest: gauge('payments_pending_oldest_seconds', 'Age of the oldest unpaid, non-final payment document.'),

    // ─── RMS sync (iiko) ─────────────────────────────────────────────────
    rmsSyncTotal: counter('rms_sync_total', 'Completed RMS sync runs.', ['type']),
    rmsSyncItems: gauge('rms_sync_items', 'Items processed by the last RMS sync run.', ['type']),
    rmsSyncLastSuccess: gauge('rms_sync_last_success_timestamp_seconds', 'Unix time of the last completed RMS sync.', ['type']),
    rmsSyncDuration: gauge('rms_sync_last_duration_seconds', 'Duration of the last RMS sync run.', ['type']),

    // ─── Menu ────────────────────────────────────────────────────────────
    menuDishes: gauge('menu_dishes', 'Dishes in the catalogue by availability.', ['state']),
    menuGroups: gauge('menu_groups', 'Visible menu groups.'),

    // ─── Notifications ───────────────────────────────────────────────────
    notificationsCreated: counter('notifications_created_total', 'Notifications created, by type.', ['type']),
    notificationsCreatedByEvent: counter('notifications_created_by_event_total', 'Notifications created, by type and business trigger.', ['type', 'event']),
    notificationsCreatedToday: gauge('notifications_created_today', 'Notifications created since local server midnight, by type and business trigger.', ['type', 'event']),
    notificationDeliveryAttempts: counter('notification_delivery_attempts_total', 'Notification channel send attempts by result.', ['type', 'event', 'channel', 'result']),
    notificationDeliveryAttemptsToday: gauge('notification_delivery_attempts_today', 'Notification channel send attempts since local server midnight, by result.', ['type', 'event', 'channel', 'result']),
    notificationLog: counter('notification_log_total', 'Entries written to the per-notification delivery log, by level.', ['level', 'module']),
    notificationLogToday: gauge('notification_log_today', 'Entries written to the per-notification delivery log since local server midnight.', ['level', 'module']),
    notificationsInStatus: gauge('notifications_in_status', 'Notifications per status inside the metrics window.', ['status']),
    notificationsCost: gauge('notifications_cost_window', 'Sum of spentCost for notifications inside the metrics window.'),

    // ─── Database ────────────────────────────────────────────────────────
    dbUp: gauge('db_up', '1 when a trivial query against the default datastore succeeds.'),
    dbPingDuration: gauge('db_ping_duration_seconds', 'Duration of the datastore health query.'),
    dbSizeBytes: gauge('db_size_bytes', 'Size of the application database.'),
    dbConnections: gauge('db_connections', 'Backends connected to the application database, by state.', ['state']),

    // ─── Self-monitoring ─────────────────────────────────────────────────
    collectorDuration: gauge('collector_duration_seconds', 'Duration of the last run of a metrics collector.', ['collector']),
    collectorErrors: counter('collector_errors_total', 'Failures inside a metrics collector.', ['collector']),
  };

  metrics.buildInfo.set(config.buildInfo, 1);

  g[GLOBAL_KEY] = metrics;
  return metrics;
}

/** @returns {Object|null} the registry if it was already built. */
function peekRegistry() {
  return global[GLOBAL_KEY] || null;
}

module.exports = { getRegistry, peekRegistry, PREFIX, HTTP_BUCKETS };
