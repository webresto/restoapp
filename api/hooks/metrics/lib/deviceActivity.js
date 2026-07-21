'use strict';

/**
 * Live count of unique devices hitting the app.
 *
 * The frontend sends `X-Device-Id` on every request (the same id the GraphQL
 * context and websocket handshake read). UserDevice.lastActivity in the
 * database is NOT a substitute: it is only written on login and session checks,
 * so it measures logged-in customers, not load. This tracker measures traffic.
 *
 * Memory is bounded twice over: entries older than the widest window are pruned
 * on every read, and the map is hard-capped — at the cap the least recently
 * seen ids are dropped, so the count degrades into an undercount instead of
 * growing without limit.
 */

/** Windows exported as the `window` label. Must be sorted ascending. */
const WINDOWS = [
  { label: '5m', ms: 5 * 60 * 1000 },
  { label: '1h', ms: 60 * 60 * 1000 },
];

const WIDEST_MS = WINDOWS[WINDOWS.length - 1].ms;

/** ~50k devices ≈ a few MB; well past the busiest stack's real traffic. */
const MAX_DEVICES = 50000;

/** Device ids are client-supplied: accept only uuid-ish opaque strings. */
const DEVICE_ID = /^[A-Za-z0-9_-]{8,64}$/;

class DeviceActivity {
  constructor() {
    /** @type {Map<string, number>} device id → last seen (ms). Insertion order = LRU. */
    this.seen = new Map();
    this.dropped = 0;
  }

  /**
   * @param {string} deviceId raw header value
   * @returns {boolean} whether it was counted
   */
  track(deviceId) {
    if (!deviceId || typeof deviceId !== 'string' || !DEVICE_ID.test(deviceId)) return false;

    // delete + set moves the id to the tail, keeping the map ordered by recency.
    if (this.seen.has(deviceId)) this.seen.delete(deviceId);
    this.seen.set(deviceId, Date.now());

    if (this.seen.size > MAX_DEVICES) {
      this.seen.delete(this.seen.keys().next().value);
      this.dropped += 1;
    }
    return true;
  }

  /**
   * Prune expired entries and count the live ones per window.
   *
   * @returns {Array<{label: string, count: number}>}
   */
  snapshot() {
    const now = Date.now();

    for (const [deviceId, lastSeen] of this.seen) {
      // Insertion order is recency order, so the first live entry ends the scan.
      if (now - lastSeen <= WIDEST_MS) break;
      this.seen.delete(deviceId);
    }

    return WINDOWS.map((window) => {
      let count = 0;
      for (const lastSeen of this.seen.values()) {
        if (now - lastSeen <= window.ms) count += 1;
      }
      return { label: window.label, count };
    });
  }
}

module.exports = { DeviceActivity, WINDOWS, MAX_DEVICES };
