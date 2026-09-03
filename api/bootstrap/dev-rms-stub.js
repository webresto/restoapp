'use strict';

/**
 * Bootstrap: a fake RMS adapter, so RMS stop lists can be tried out by hand.
 *
 * RMS synchronization is a pull: the app asks the adapter for a snapshot on a
 * timer, so there is no endpoint a stop list could be posted to. This registers
 * an adapter that answers with whatever was handed to it over HTTP, which is
 * what makes `POST /dev/rms/stoplist` work — see
 * api/controllers/DevRmsStubController.js.
 *
 * Off unless RMS_DEV_STUB=1, and never registered in production: the endpoint
 * writes RMS balances, so it must not exist on a real install. When it is off,
 * `Adapter.getRMSAdapter()` behaves exactly as before (no adapter installed).
 */

const RMSAdapter = require('@webresto/core/adapters/rms/RMSAdapter').default;
const { Adapter } = require('@webresto/core/adapters');

class DevRmsStub extends RMSAdapter {
  constructor() {
    super({});

    /** The global snapshot, used while `snapshotsByPlace` is null. */
    this.stopList = [];

    /** Per-terminal snapshots; `null` means this RMS has no terminals. */
    this.snapshotsByPlace = null;

    // `readonly` is a TypeScript notion; the base class only assigns a plain
    // property, so the capability can be flipped per request from the endpoint.
    this.supportsPlaceBalances = false;
  }

  /**
   * `{ items }` sets a global snapshot, `{ places }` a per-terminal one. The
   * capability follows the payload, so both branches of the sync are reachable
   * without restarting the app.
   */
  setSnapshot({ items, places }) {
    if (Array.isArray(places)) {
      this.snapshotsByPlace = places;
      this.stopList = [];
      this.supportsPlaceBalances = true;
    } else {
      this.snapshotsByPlace = null;
      this.stopList = Array.isArray(items) ? items : [];
      this.supportsPlaceBalances = false;
    }
  }

  async customInitialize() {}

  async initialized() {}

  /**
   * Always `false`, so the catalog is never touched. This stub exists for stop
   * lists; a menu sync from it would return an empty nomenclature and mark
   * every group and product as deleted.
   */
  async nomenclatureHasUpdated() {
    return false;
  }

  loadNomenclatureTree() {
    // Reachable only through syncProducts(force = true). Throwing keeps the
    // catalog intact: the sync wipes groups *after* this call, and it logs and
    // swallows the error instead of failing the tick.
    throw new Error('dev RMS stub has no catalog: it serves stop lists only');
  }

  loadProductsByGroup() {
    throw new Error('dev RMS stub has no catalog: it serves stop lists only');
  }

  async loadOutOfStocksDishes() {
    return this.stopList;
  }

  async loadOutOfStocksDishesByPlace() {
    return this.snapshotsByPlace;
  }

  createOrder() {
    throw new Error('dev RMS stub cannot create orders');
  }

  checkOrder() {
    throw new Error('dev RMS stub cannot check orders');
  }

  api() {
    throw new Error('dev RMS stub has no API');
  }
}

module.exports.default = async function (sails) {
  if (process.env.RMS_DEV_STUB !== '1') return;

  if (process.env.NODE_ENV === 'production') {
    sails.log.warn('[dev-rms-stub] RMS_DEV_STUB is set in production and was ignored');
    return;
  }

  const stub = new DevRmsStub();
  await Adapter.getRMSAdapter(stub);

  // The base class arms two timers while it initializes. Both are dropped: a
  // tick with an empty stop list would reset every RMS balance in the database
  // ten minutes after boot, which is not what "I posted one snapshot" means.
  await stub.wait();
  clearInterval(RMSAdapter.syncProductsInterval);
  clearInterval(RMSAdapter.syncOutOfStocksInterval);

  sails.devRmsStub = stub;
  sails.log.warn('[dev-rms-stub] fake RMS adapter registered: POST /dev/rms/stoplist is live');
};
