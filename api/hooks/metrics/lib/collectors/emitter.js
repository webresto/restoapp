'use strict';

/**
 * Business counters, fed from the core AwaitEmitter.
 *
 * Nothing in @webresto/core is patched: every number here comes from events the
 * core already emits, so a core upgrade cannot break the app and, at worst,
 * makes a counter go flat.
 *
 * All handlers are synchronous on purpose — AwaitEmitter runs a handler that
 * returns a promise in parallel and applies its timeout bookkeeping to it, so a
 * metrics subscriber must never return one.
 */

/** Subscriber id: re-subscribing with the same id replaces, never duplicates. */
const SUBSCRIBER_ID = 'metrics';

/** Bounded label sanitiser for values that originate outside our code. */
const SAFE_LABEL = /^[A-Za-z0-9_.:-]{1,40}$/;
function safeLabel(value, fallback = 'other') {
  const raw = value === null || value === undefined ? '' : String(value);
  return SAFE_LABEL.test(raw) ? raw : fallback;
}

/**
 * Order log messages are written as "<operation>: <what happened>" all over the
 * core ("check: failed", "countCart: promotion failed", "order: RMS error"), so
 * the prefix is a ready-made label telling you *where* an order broke.
 *
 * @param {string} message
 * @returns {string} operation slug, or "other"
 */
function operationFromMessage(message) {
  const raw = String(message || '');
  // The money-in/order-not-placed line has no prefix and is its own alert.
  if (/CRITICAL: MONEY-IN/i.test(raw)) return 'money_in_no_order';
  const prefix = raw.split(':')[0].trim();
  return SAFE_LABEL.test(prefix) ? prefix : 'other';
}

/**
 * Last known state per order, so `core:order-after-update` can be turned into
 * from → to transitions. Bounded FIFO: only orders currently being worked on
 * matter, and a miss just means one transition is labelled from="unknown".
 */
const MAX_TRACKED_ORDERS = 2000;
const lastState = new Map();

function rememberState(orderId, state) {
  if (lastState.has(orderId)) lastState.delete(orderId);
  lastState.set(orderId, state);
  if (lastState.size > MAX_TRACKED_ORDERS) {
    lastState.delete(lastState.keys().next().value);
  }
}

/**
 * Wire every subscription. Safe to call more than once.
 *
 * @param {Object} metrics
 * @param {Sails} sails
 */
function subscribe(metrics, sails) {
  const emitter = global.emitter;

  // ── Order funnel ────────────────────────────────────────────────────────
  emitter.on('core:order-after-create', SUBSCRIBER_ID, function (order) {
    metrics.ordersCreated.inc();
    if (order && order.id) rememberState(order.id, order.state || 'NEW');
  });

  emitter.on('core:order-init-checkout', SUBSCRIBER_ID, function () {
    metrics.ordersCheckout.inc();
  });

  emitter.on('core:order-after-order', SUBSCRIBER_ID, function (order) {
    // orderedOnPlatform is the sales-channel signal carried by the order itself
    // (SalesChannel.platforms maps these values onto a configured channel).
    const platform = safeLabel(order && order.orderedOnPlatform, 'unknown');
    metrics.ordersPlaced.inc({ self_service: order && order.selfService ? 'true' : 'false', platform });
    const total = order && Number(order.total);
    if (Number.isFinite(total) && total > 0) metrics.ordersAmount.inc({ platform }, total);
  });

  // The core does not publish the previous state, so it is tracked here.
  // This is what makes "orders are stuck in ORDER/COOKING" visible as a rate.
  emitter.on('core:order-after-update', SUBSCRIBER_ID, function (order) {
    if (!order || !order.id || !order.state) return;
    const previous = lastState.get(order.id);
    if (previous === order.state) return;
    rememberState(order.id, order.state);
    metrics.orderTransitions.inc({ from: safeLabel(previous, 'unknown'), to: safeLabel(order.state) });
  });

  // Every failure the core records against an order passes through here: failed
  // checkout, failed countCart, RMS refusing the order, payment registration
  // errors. This is the "how many orders are failing" number.
  emitter.on('core:order-log', SUBSCRIBER_ID, function (order, entry) {
    if (!entry) return;
    const level = safeLabel(entry.level, 'unknown');
    const module = safeLabel(entry.module, 'unknown');
    metrics.orderLog.inc({ level, module });
    if (level === 'error' || level === 'warn') {
      metrics.orderErrors.inc({ level, module, op: operationFromMessage(entry.message) });
    }
  });

  // Refusals the core handles without throwing: they never reach a log line,
  // but a customer just failed to change their cart.
  const rejects = {
    'core:order-add-dish-reject-amount': 'add_dish_amount',
    'core:order-set-count-reject-amount': 'set_count_amount',
    'core:order-remove-dish-reject-no-orderdish': 'remove_dish_missing',
    'core:order-set-count-reject-no-orderdish': 'set_count_missing',
    'core:order-set-comment-reject-no-orderdish': 'set_comment_missing',
  };
  for (const [event, reason] of Object.entries(rejects)) {
    emitter.on(event, SUBSCRIBER_ID, () => metrics.orderRejects.inc({ reason }));
  }

  // Money in, order not placed — the one failure the core itself calls critical.
  emitter.on('core:order-after-dopaid-error', SUBSCRIBER_ID, function () {
    metrics.orderRejects.inc({ reason: 'dopaid_failed' });
  });

  // ── Payments ────────────────────────────────────────────────────────────
  emitter.on('core:payment-document-before-create', SUBSCRIBER_ID, function () {
    metrics.paymentsInitiated.inc();
  });

  emitter.on('core:payment-document-check', SUBSCRIBER_ID, function () {
    metrics.paymentsChecked.inc();
  });

  emitter.on('core:payment-document-checked-document', SUBSCRIBER_ID, function (document) {
    if (document && (document.status === 'PAID' || document.paid === true)) metrics.paymentsPaid.inc();
  });

  emitter.on('core:payment-document-canceled', SUBSCRIBER_ID, function () {
    metrics.paymentsCancelled.inc();
  });

  // ── RMS sync (iiko) ─────────────────────────────────────────────────────
  // The adapter emits one event per item and one when the run ends, so the run
  // size and duration are reconstructed from that pair.
  const runs = {
    products: { items: 0, startedAt: null },
    out_of_stocks: { items: 0, startedAt: null },
  };

  const beginItem = (type) => {
    const run = runs[type];
    if (run.startedAt === null) run.startedAt = Date.now();
    run.items += 1;
  };

  const finishRun = (type) => {
    const run = runs[type];
    const now = Date.now();
    metrics.rmsSyncTotal.inc({ type });
    metrics.rmsSyncItems.set({ type }, run.items);
    metrics.rmsSyncLastSuccess.set({ type }, now / 1000);
    metrics.rmsSyncDuration.set({ type }, run.startedAt ? (now - run.startedAt) / 1000 : 0);
    run.items = 0;
    run.startedAt = null;
  };

  emitter.on('rms-sync:before-each-product-item', SUBSCRIBER_ID, () => beginItem('products'));
  emitter.on('rms-sync:after-sync-products', SUBSCRIBER_ID, () => finishRun('products'));
  emitter.on('rms-sync:out-of-stocks-before-each-product-item', SUBSCRIBER_ID, () => beginItem('out_of_stocks'));
  emitter.on('rms-sync:after-sync-out-of-stocks', SUBSCRIBER_ID, () => finishRun('out_of_stocks'));

  // ── Notifications ───────────────────────────────────────────────────────
  emitter.on('core:notification-created', SUBSCRIBER_ID, function (notification) {
    metrics.notificationsCreated.inc({
      type: safeLabel(notification && notification.notificationTypeKey, 'unknown'),
    });
  });

  // Delivery waterfall trace: level="error" here is a channel that refused the
  // message (SMS gateway 400, FCM "no channel", …).
  emitter.on('core:notification-log', SUBSCRIBER_ID, function (notification, entry) {
    if (!entry) return;
    metrics.notificationLog.inc({
      level: safeLabel(entry.level, 'unknown'),
      module: safeLabel(entry.module, 'unknown'),
    });
  });

  // ── Maintenance ─────────────────────────────────────────────────────────
  emitter.on('core:maintenance-enabled', SUBSCRIBER_ID, () => metrics.maintenanceEnabled.set(1));
  emitter.on('core:maintenance-disabled', SUBSCRIBER_ID, () => metrics.maintenanceEnabled.set(0));

  sails.log.info('Metrics > subscribed to core emitter events');
}

/**
 * global.emitter is created by the core hook's own initialize, which may run
 * after this hook. Wait for it instead of guessing the load order.
 *
 * @param {Sails} sails
 * @param {Object} metrics
 * @returns {Function} stop function
 */
function start(sails, metrics) {
  let attempts = 0;
  let timer = null;

  const trySubscribe = () => {
    if (global.emitter && typeof global.emitter.on === 'function') {
      try {
        subscribe(metrics, sails);
      } catch (error) {
        metrics.collectorErrors.inc({ collector: 'emitter' });
        sails.log.error('Metrics > failed to subscribe to core emitter:', error);
      }
      return true;
    }
    return false;
  };

  if (!trySubscribe()) {
    timer = setInterval(() => {
      attempts += 1;
      if (trySubscribe() || attempts > 30) {
        clearInterval(timer);
        timer = null;
        if (attempts > 30) {
          metrics.collectorErrors.inc({ collector: 'emitter' });
          sails.log.warn('Metrics > core emitter never appeared; business metrics stay at zero');
        }
      }
    }, 2000);
    timer.unref();
  }

  return () => { if (timer) clearInterval(timer); };
}

module.exports = { start, subscribe, operationFromMessage };
