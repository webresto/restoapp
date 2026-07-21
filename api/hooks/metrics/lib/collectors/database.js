'use strict';

/**
 * Periodic gauges read from the database.
 *
 * These are the "state of the restaurant right now" numbers that counters
 * cannot answer: how many orders are stuck in COOKING, how old the oldest
 * unpaid payment is, whether the menu still has visible dishes after a sync.
 *
 * Everything runs as one native aggregate per topic (never a per-row scan from
 * Waterline), each query is isolated so one failure cannot silence the rest,
 * and the whole cycle is skipped while a previous one is still in flight.
 */

/** Kept in sync with OrderStateFlow.ORDER_STATE_TRANSITIONS in @webresto/core. */
const ORDER_STATES = ['NEW', 'CART', 'CHECKOUT', 'PAYMENT', 'ORDER', 'COOKING', 'ON_THE_WAY', 'DONE', 'REJECT'];

/** Non-terminal states where an order sitting too long means someone must act. */
const ACTIVE_ORDER_STATES = ['CHECKOUT', 'PAYMENT', 'ORDER', 'COOKING', 'ON_THE_WAY'];

/** Payment statuses that are still waiting for money to arrive. */
const PENDING_PAYMENT_STATUSES = ['NEW', 'REGISTERED'];

const NOTIFICATION_STATUSES = ['pending', 'processing', 'sent', 'failed', 'read', 'cancelled'];

/** One warning per broken query, not one per tick. */
const warned = new Set();

/**
 * @param {Sails} sails
 * @param {Object} metrics
 * @param {string} name query id, used as the label of the error counter
 * @param {Function} fn
 */
async function guard(sails, metrics, name, fn) {
  try {
    await fn();
  } catch (error) {
    metrics.collectorErrors.inc({ collector: `db:${name}` });
    if (!warned.has(name)) {
      warned.add(name);
      sails.log.warn(`Metrics > db collector query '${name}' failed (further failures are counted, not logged):`, error && error.message ? error.message : error);
    }
  }
}

/** node-pg returns bigint/numeric as strings — normalise before .set(). */
function num(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * @param {Sails} sails
 * @param {Object} metrics
 * @param {Object} config
 */
async function collect(sails, metrics, config) {
  const datastore = sails.getDatastore();
  const since = Date.now() - config.windowHours * 3600 * 1000;
  const nowSeconds = Date.now() / 1000;

  // ── Datastore reachability ─────────────────────────────────────────────
  const pingStarted = process.hrtime.bigint();
  try {
    await datastore.sendNativeQuery('SELECT 1');
    metrics.dbUp.set(1);
  } catch (error) {
    metrics.dbUp.set(0);
    metrics.collectorErrors.inc({ collector: 'db:ping' });
    // Nothing else can succeed if this failed.
    metrics.dbPingDuration.set(Number(process.hrtime.bigint() - pingStarted) / 1e9);
    return;
  }
  metrics.dbPingDuration.set(Number(process.hrtime.bigint() - pingStarted) / 1e9);

  // ── Orders: how many, and how long the oldest has been waiting ─────────
  await guard(sails, metrics, 'orders_by_state', async () => {
    const result = await datastore.sendNativeQuery(
      'SELECT state, count(*)::int AS cnt, min("createdAt") AS oldest FROM "order" WHERE "createdAt" >= $1 GROUP BY state',
      [since],
    );
    const rows = new Map((result.rows || []).map((row) => [row.state, row]));

    for (const state of ORDER_STATES) {
      const row = rows.get(state);
      metrics.ordersInState.set({ state }, row ? num(row.cnt) : 0);

      if (!ACTIVE_ORDER_STATES.includes(state)) continue;
      const oldest = row ? num(row.oldest) : 0;
      metrics.ordersOldestAge.set({ state }, oldest ? nowSeconds - oldest / 1000 : 0);
    }
  });

  // "no orders are coming in" is the alert nobody wants to hear about from
  // a customer first: a timestamp survives low traffic where rate() reads zero.
  await guard(sails, metrics, 'last_order', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT max("createdAt") AS t FROM "order" WHERE state IN ('ORDER','COOKING','ON_THE_WAY','DONE')`,
    );
    const value = num(result.rows && result.rows[0] && result.rows[0].t);
    metrics.lastOrderPlaced.set(value ? value / 1000 : 0);
  });

  // ── Sales channels ─────────────────────────────────────────────────────
  // Orders carry `orderedOnPlatform`; a SalesChannel owns that value either as
  // its `key` or inside its `platforms` list. The mapping is rebuilt each cycle
  // (the table has a handful of rows) so a newly configured channel shows up
  // without a restart, and platforms nobody claimed stay visible as
  // channel="unmapped" instead of silently disappearing.
  await guard(sails, metrics, 'orders_by_channel', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT coalesce("orderedOnPlatform", 'unknown') AS platform,
              count(*)::int AS cnt,
              count(*) FILTER (WHERE state IN ('ORDER','COOKING','ON_THE_WAY','DONE')) AS placed
         FROM "order" WHERE "createdAt" >= $1 GROUP BY 1`,
      [since],
    );

    const channels = await SalesChannel.find({});
    const byPlatform = new Map();
    for (const channel of channels) {
      const key = String(channel.key || channel.id);
      byPlatform.set(key, key);
      for (const platform of Array.isArray(channel.platforms) ? channel.platforms : []) {
        byPlatform.set(String(platform), key);
      }
    }

    const totals = new Map();
    for (const row of result.rows || []) {
      const platform = String(row.platform);
      metrics.ordersByPlatform.set({ platform }, num(row.cnt));

      const channel = byPlatform.get(platform) || (platform === 'unknown' ? 'unknown' : 'unmapped');
      const current = totals.get(channel) || { all: 0, placed: 0 };
      current.all += num(row.cnt);
      current.placed += num(row.placed);
      totals.set(channel, current);
    }
    for (const [channel, counts] of totals) {
      metrics.ordersByChannel.set({ channel, placed: 'false' }, counts.all);
      metrics.ordersByChannel.set({ channel, placed: 'true' }, counts.placed);
    }
  });

  await guard(sails, metrics, 'sales_channels', async () => {
    const channels = await SalesChannel.find({});
    const counts = new Map();
    for (const channel of channels) {
      const key = `${channel.status || 'draft'}|${channel.enabled ? 'true' : 'false'}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    for (const [key, count] of counts) {
      const [status, enabled] = key.split('|');
      metrics.salesChannels.set({ status, enabled }, count);
    }
  });

  // ── Devices ────────────────────────────────────────────────────────────
  // NB: UserDevice.lastActivity is only written on login and session checks, so
  // this counts live sessions, not traffic. Raw load per unique device comes
  // from restoapp_active_devices, which counts X-Device-Id on live requests.
  await guard(sails, metrics, 'devices', async () => {
    // userdevice.lastActivity is a `real` column (see the init migration), and
    // float4 only holds ~7 significant digits — at epoch-ms scale that is a
    // rounding error of minutes. Anything shorter than an hour would be noise,
    // so short windows are left to restoapp_active_devices.
    const result = await datastore.sendNativeQuery(
      `SELECT count(*)::int AS total,
              count(*) FILTER (WHERE "isLoggedIn" = true)  AS logged_in,
              count(*) FILTER (WHERE "lastActivity" >= $1) AS active_1h,
              count(*) FILTER (WHERE "lastActivity" >= $2) AS active_24h
         FROM userdevice`,
      [Date.now() - 3600 * 1000, Date.now() - 24 * 3600 * 1000],
    );
    const row = (result.rows && result.rows[0]) || {};
    metrics.devicesTotal.set(num(row.total));
    metrics.devicesLoggedIn.set(num(row.logged_in));
    metrics.devicesActive.set({ window: '1h' }, num(row.active_1h));
    metrics.devicesActive.set({ window: '24h' }, num(row.active_24h));
  });

  await guard(sails, metrics, 'devices_push', async () => {
    // notificationToken was added as a text column, so it cannot be queried
    // with the json operators — the platform is pulled out with a regex.
    const result = await datastore.sendNativeQuery(
      `SELECT coalesce(substring("notificationToken" from '"platform"[^"]*"([a-z]+)"'), 'unknown') AS platform,
              count(*)::int AS cnt
         FROM userdevice
        WHERE "notificationToken" IS NOT NULL
          AND "notificationToken" LIKE '%"token"%'
        GROUP BY 1`,
    );
    for (const row of result.rows || []) {
      metrics.devicesWithPushToken.set({ platform: String(row.platform) }, num(row.cnt));
    }
  });

  // ── Payments ───────────────────────────────────────────────────────────
  await guard(sails, metrics, 'payments_by_status', async () => {
    const result = await datastore.sendNativeQuery(
      'SELECT status, count(*)::int AS cnt FROM paymentdocument WHERE "createdAt" >= $1 GROUP BY status',
      [since],
    );
    const rows = new Map((result.rows || []).map((row) => [row.status, num(row.cnt)]));
    for (const [status, count] of rows) metrics.paymentsInStatus.set({ status: String(status) }, count);
    for (const status of PENDING_PAYMENT_STATUSES) {
      if (!rows.has(status)) metrics.paymentsInStatus.set({ status }, 0);
    }
  });

  await guard(sails, metrics, 'payments_pending_oldest', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT min("createdAt") AS t FROM paymentdocument WHERE paid = false AND status IN ('NEW','REGISTERED') AND "createdAt" >= $1`,
      [since],
    );
    const value = num(result.rows && result.rows[0] && result.rows[0].t);
    metrics.paymentsPendingOldest.set(value ? nowSeconds - value / 1000 : 0);
  });

  // ── Notifications: failures and what they cost ─────────────────────────
  await guard(sails, metrics, 'notifications', async () => {
    const result = await datastore.sendNativeQuery(
      'SELECT status, count(*)::int AS cnt, coalesce(sum("spentCost"), 0) AS cost FROM notification WHERE "createdAt" >= $1 GROUP BY status',
      [since],
    );
    const rows = new Map((result.rows || []).map((row) => [row.status, row]));
    let cost = 0;
    for (const status of NOTIFICATION_STATUSES) {
      const row = rows.get(status);
      metrics.notificationsInStatus.set({ status }, row ? num(row.cnt) : 0);
      if (row) cost += num(row.cost);
    }
    metrics.notificationsCost.set(cost);
  });

  // ── Menu: a sync that wipes the catalogue must be visible immediately ──
  await guard(sails, metrics, 'menu', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT
         count(*) FILTER (WHERE "isDeleted" = false)                                       AS total,
         count(*) FILTER (WHERE "isDeleted" = false AND visible = true)                    AS visible,
         count(*) FILTER (WHERE "isDeleted" = false AND visible = true AND balance = 0)    AS out_of_stock
       FROM dish
       WHERE coalesce(modifier, false) = false`,
    );
    const row = (result.rows && result.rows[0]) || {};
    metrics.menuDishes.set({ state: 'total' }, num(row.total));
    metrics.menuDishes.set({ state: 'visible' }, num(row.visible));
    metrics.menuDishes.set({ state: 'out_of_stock' }, num(row.out_of_stock));
  });

  await guard(sails, metrics, 'menu_groups', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT count(*)::int AS cnt FROM "group" WHERE "isDeleted" = false AND visible = true`,
    );
    metrics.menuGroups.set(num(result.rows && result.rows[0] && result.rows[0].cnt));
  });

  // ── Database itself ────────────────────────────────────────────────────
  await guard(sails, metrics, 'db_size', async () => {
    const result = await datastore.sendNativeQuery('SELECT pg_database_size(current_database()) AS size');
    metrics.dbSizeBytes.set(num(result.rows && result.rows[0] && result.rows[0].size));
  });

  await guard(sails, metrics, 'db_connections', async () => {
    const result = await datastore.sendNativeQuery(
      `SELECT coalesce(state, 'unknown') AS state, count(*)::int AS cnt
         FROM pg_stat_activity WHERE datname = current_database() GROUP BY state`,
    );
    for (const row of result.rows || []) {
      metrics.dbConnections.set({ state: String(row.state) }, num(row.cnt));
    }
  });

  // ── Readiness, mirroring HealthController.readyz ───────────────────────
  await guard(sails, metrics, 'ready', async () => {
    const enabledSalesChannels = await SalesChannel.count({ enabled: true });
    metrics.ready.set(enabledSalesChannels >= 1 ? 1 : 0);
  });

  await guard(sails, metrics, 'maintenance', async () => {
    const active = await Maintenance.count({ enable: true });
    metrics.maintenanceEnabled.set(active > 0 ? 1 : 0);
  });
}

/**
 * @param {Sails} sails
 * @param {Object} metrics
 * @param {Object} config
 * @returns {Function} stop function
 */
function start(sails, metrics, config) {
  if (!config.dbIntervalSeconds) {
    sails.log.info('Metrics > db collector disabled (METRICS_DB_INTERVAL=0)');
    return () => {};
  }

  let inFlight = false;

  const tick = async () => {
    if (inFlight) return; // a slow database must not queue up cycles
    inFlight = true;
    const startedAt = process.hrtime.bigint();
    try {
      await collect(sails, metrics, config);
    } catch (error) {
      metrics.collectorErrors.inc({ collector: 'db' });
      sails.log.warn('Metrics > db collector failed:', error && error.message ? error.message : error);
    } finally {
      metrics.collectorDuration.set({ collector: 'db' }, Number(process.hrtime.bigint() - startedAt) / 1e9);
      inFlight = false;
    }
  };

  void tick();
  const timer = setInterval(() => void tick(), Math.max(10, config.dbIntervalSeconds) * 1000);
  timer.unref();

  return () => clearInterval(timer);
}

module.exports = { start, collect, ORDER_STATES };
