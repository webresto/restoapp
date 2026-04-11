# EffectiveBalance — Idea and Implementation Plan

## Overview

Currently, dish stock availability is controlled by a single `balance` field — written by both RMS synchronization (stoplists) and the admin panel manually. This means RMS overwrites manual adjustments on every sync, and there is no way to distinguish the source of a balance change.

The goal is to **separate these two sources of truth**:

- `balance` — set manually by administrators via the admin panel. Never touched by RMS sync.
- `rmsBalance` — set exclusively by RMS stoplist synchronization. Never touched by the admin panel.

To determine actual dish availability, an **effective balance** is computed from both fields at runtime. This value is what gets used for order validation, filtering, and display — not the raw `balance` alone.

The admin panel Stock Manager should show:
- The **effective balance** as the primary value on the balance page
- An additional **RMS badge** on each dish card when `rmsBalance` differs from -1, so admins can see what the RMS system is reporting independently of their manual setting

Writing from the admin panel always goes to `balance` only — never to `rmsBalance`.

## Open Question: Per-Terminal Balance

The current model does not account for the fact that in a multi-terminal setup, **each terminal (place/point-of-sale) may have its own independent balance** for a dish. The RMS system typically tracks stock per terminal, not globally.

This means a dish could be available at terminal A but stopped at terminal B — and a flat global `rmsBalance` cannot represent this.

### What would be needed

Each dish would need a relation to a per-place balance record, something like:

```
Dish → PlaceBalance[] → { place, balance, rmsBalance }
```

The effective balance for a given order would then be resolved at request time based on which terminal/place the order is placed at.

### Two approaches

**1. On-the-fly (runtime resolution)**
Compute effective balance per place at query time by joining dish with its PlaceBalance records. Always fresh, but adds DB query overhead on every dish fetch.

**2. Baked (denormalized)**
After each RMS sync, compute and write the effective balance per place into a flat field or JSON column on the dish. Faster reads, but requires a rebuild step after every sync and introduces staleness risk.

### Current state

This is not modeled at all right now. The `balance` and `rmsBalance` fields (even in this proposal) are global — they do not account for which terminal is serving the order. This is a deeper architectural question that goes beyond the scope of the `EffectiveBalance` feature and should be addressed separately, likely as part of a broader multi-terminal / multi-place support initiative.

---

## Developer Decision

**Implementation rejected.**

Waterline (Sails ORM) does not support VIRTUAL fields with getters — unlike Sequelize, where you can declare a field with `type: DataTypes.VIRTUAL` and a native `get()` that works as a property on the instance. In Waterline, attributes are just a DB schema definition — no prototype, no getters.

Due to this limitation, `effectiveBalance` cannot be a true getter on the model. The alternatives were:
- Add a static method `Dish.getEffectiveBalance(dish)` (not a getter — must be called manually everywhere)
- Use an `afterFind` lifecycle hook (mutates the object after every query — hidden side effect)

Neither approach is a "getter" in the proper sense. On top of that, the number of places in the codebase that would need updating turned out to be too large (20+ locations across 6 files), including Waterline criteria inside `populate()` calls that cannot be replaced by a getter at all — only by post-query filtering.

**This is not a priority right now.** The idea remains valid for the future — to be revisited when we migrate to Sequelize.

---

## Idea

Add an `rmsBalance` field to the `Dish` model to store the balance from RMS stoplists separately from the manual `balance` (which is managed via the admin panel). RMS sync writes only to `rmsBalance`; the admin panel writes only to `balance`. For display and validation, an **effective balance** is derived by combining both values.

### getEffectiveBalance logic

```
- If both are -1 → return -1 (infinite)
- If only one differs from -1 → use that one
- If both differ from -1 → use the lesser (more restrictive) value
```

### How it would look in Sequelize

```ts
effectiveBalance: {
  type: DataTypes.VIRTUAL,
  get() {
    const b = this.balance ?? -1;
    const r = this.rmsBalance ?? -1;
    if (b !== -1 && r !== -1) return Math.min(b, r);
    if (b !== -1) return b;
    if (r !== -1) return r;
    return -1;
  }
}
```

`dish.effectiveBalance` — works as a native property, no DB column is created, automatically included in `toJSON()`.

---

## What Was Implemented (and Reverted)

### Dish.ts / Dish.js model
- Added field `rmsBalance: { type: "number", defaultsTo: -1 }`
- Added static method `Dish.getEffectiveBalance(dish)`
- Added post-query filtering by `effectiveBalance === 0` in `getDishes()`
- Updated `declare global` for typing

### RMSAdapter.ts
- `syncOutOfStocks()` now writes to `rmsBalance` instead of `balance`
- Reset to `-1` is now done against `rmsBalance: { '!=': -1 }` instead of `balance`

### Migration
- `20260411120000-add-rms-balance-to-dish.js` — adds column `rmsbalance INT DEFAULT -1`

### get-stock-items.ts
- Query extended: `or: [balance != -1, rmsBalance != -1]`
- Response includes `rmsBalance` and `effectiveBalance`

### DishCard.jsx
- Displays `effectiveBalance` as the primary balance value
- Shows an orange `RMS: X` badge when `rmsBalance !== -1`

### stock-manager.jsx
- `balances` map populated from `effectiveBalance ?? balance`

---

## Places NOT Fixed (Regressions)

### Critical — stopped dish can still be ordered

| File | Lines | Issue |
|------|-------|-------|
| `models/Order.ts` | 486–488 | `addDish()`: `dishObj.balance > 0` — passes through if `balance=-1, rmsBalance=0` |
| `models/Order.ts` | 684–685 | `setCount()`: same issue |
| `models/Order.ts` | 1475–1476 | order validation: same issue |

### Medium — modifiers and recommendations not filtered by RMS

| File | Lines | Issue |
|------|-------|-------|
| `models/Dish.ts` | 465 | `getDishModifiers`: `balance === 0` does not account for `rmsBalance` |
| `models/Dish.ts` | 525, 541, 551 | `getRecommended`: Waterline criteria — cannot be replaced by a getter |
| `models/Group.ts` | 514, 537 | `getRecommendedDishes`: same |
| `graphql/additionalResolvers.js` | 61, 82, 83, 101, 102 | modifiers in GraphQL |
| `graphql/recommended.js` | 26, 83 | recommendations in GraphQL |
| `graphql/graphqlHelper.js` | 337 | default dish where clause |

### Low — UI / widgets

| File | Lines | Issue |
|------|-------|-------|
| `widgets/DishesOnStop.ts` | 9 | counts stops only by `balance` |
| `controller/search.ts` | 33 | `rmsBalance`/`effectiveBalance` not returned in response |
| `controller/get-dishes-by-group.ts` | 31 | same |

---

## Conclusion

Implementing this correctly requires updating 20+ locations across 6 files. Some of those (Waterline criteria inside `populate()`) cannot be replaced with a getter at all — they require rewriting queries to use post-query filtering instead of DB-level filtering, which has performance implications.

**When we migrate to Sequelize**, all of this collapses into a single VIRTUAL field. All existing queries start working correctly automatically, with no additional modifications needed.
