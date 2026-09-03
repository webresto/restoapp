'use strict';

/**
 * DevRmsStubController
 *
 * Hand-driven RMS stop list sync, for checking per-place balances without a
 * real RMS. The fake adapter behind it is registered by
 * api/bootstrap/dev-rms-stub.js and only exists when RMS_DEV_STUB=1, so both
 * actions answer 404 on any normal install — including production, where the
 * stub is never registered.
 */

const {
  getEffectiveBalance,
  getDishPlaceBalanceMode,
} = require('@webresto/core/lib/dish-place-balance');

function stub(res) {
  if (!sails.devRmsStub) {
    res.status(404).json({ error: 'dev RMS stub is not registered; start the app with RMS_DEV_STUB=1' });
    return null;
  }
  return sails.devRmsStub;
}

/** Every stored balance, with the names needed to read it without a DB client. */
async function currentRows(placeId) {
  const rows = await DishPlace.find(placeId ? { where: { place: placeId } } : {});
  const mode = await getDishPlaceBalanceMode();

  const dishes = await Dish.find({ id: rows.map((row) => row.dish) });
  const dishById = new Map(dishes.map((dish) => [String(dish.id), dish]));
  const places = await Place.find({ id: rows.map((row) => row.place) });
  const placeById = new Map(places.map((place) => [String(place.id), place]));

  return {
    mode,
    rows: rows.map((row) => ({
      dish: String(row.dish),
      dishName: dishById.get(String(row.dish))?.name ?? null,
      dishRmsId: dishById.get(String(row.dish))?.rmsId ?? null,
      place: String(row.place),
      placeTitle: placeById.get(String(row.place))?.title ?? null,
      placeRmsId: placeById.get(String(row.place))?.rmsId ?? null,
      localBalance: row.localBalance,
      rmsBalance: row.rmsBalance,
      enable: row.enable !== false,
      effective: getEffectiveBalance({
        localBalance: row.localBalance,
        rmsBalance: row.rmsBalance,
        enable: row.enable !== false,
        mode,
      }),
    })),
  };
}

module.exports = {
  /**
   * Fills `rmsId` on products and points, the way a real RMS sync would.
   *
   * Without it a fresh development database has nothing a stop list could
   * address: snapshots name products by `Dish.rmsId` and terminals by
   * `Place.rmsId`, and the seeded catalog carries neither.
   *
   * Body: `{dishes: [{id, rmsId}], places: [{id, rmsId}]}`.
   */
  map: async function (req, res) {
    if (!stub(res)) return;

    const body = req.body || {};
    const dishes = Array.isArray(body.dishes) ? body.dishes : [];
    const places = Array.isArray(body.places) ? body.places : [];
    if (!dishes.length && !places.length) {
      return res.status(400).json({ error: 'expected {dishes: [{id, rmsId}], places: [{id, rmsId}]}' });
    }

    const updated = { dishes: [], places: [] };
    for (const dish of dishes) {
      const rows = await Dish.update({ id: dish.id }, { rmsId: String(dish.rmsId) }).fetch();
      updated.dishes.push({ id: dish.id, rmsId: String(dish.rmsId), found: rows.length > 0 });
    }
    for (const place of places) {
      const rows = await Place.update({ id: place.id }, { rmsId: String(place.rmsId) }).fetch();
      updated.places.push({ id: place.id, rmsId: String(place.rmsId), found: rows.length > 0 });
    }
    return res.json(updated);
  },

  /**
   * Hands the adapter a snapshot and runs the sync immediately.
   *
   * Body is either a global snapshot — an array of `{rmsId, balance}`, or the
   * same array under `items` — or a per-terminal one: `{places: [{placeRmsId,
   * items}]}`. The per-terminal form also turns `supportsPlaceBalances` on, so
   * the reset stays inside the points the snapshot names.
   */
  push: async function (req, res) {
    const adapter = stub(res);
    if (!adapter) return;

    const body = req.body;
    const payload = Array.isArray(body) ? { items: body } : (body || {});
    if (!Array.isArray(payload.items) && !Array.isArray(payload.places)) {
      return res.status(400).json({
        error: 'expected an array of {rmsId, balance}, or {items: [...]}, or {places: [{placeRmsId, items: [...]}]}',
      });
    }

    adapter.setSnapshot(payload);
    await adapter.syncOutOfStocks();

    return res.json({
      applied: {
        supportsPlaceBalances: adapter.supportsPlaceBalances,
        places: adapter.snapshotsByPlace ? adapter.snapshotsByPlace.length : null,
        items: adapter.snapshotsByPlace
          ? adapter.snapshotsByPlace.reduce((sum, snapshot) => sum + (snapshot.items || []).length, 0)
          : adapter.stopList.length,
      },
      ...(await currentRows()),
    });
  },

  /** The stored balances, optionally narrowed to one point with `?placeId=`. */
  state: async function (req, res) {
    if (!stub(res)) return;
    return res.json(await currentRows(req.query.placeId));
  },
};
