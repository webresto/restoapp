# TODO: Runtime Access Rights for RestoApp Modules

## Context

RestoApp currently gives default admin rights through `config/adminpanel.js`.

Examples:

- `Operator` receives order-related tokens.
- `Marketer` receives catalog, promotion, notification, sales-channel, and report tokens.
- Some tokens are placed in `ensureTokens` so existing groups receive them on boot.

This works for core-owned modules, but it does not scale well for reusable modules. A module can register its access-right token, but it cannot declare "by default, give this token to the Marketer group" without editing RestoApp bootstrap code.

## Desired Direction

Move default role grants into an Adminizer runtime mechanism.

Adminizer should provide an app/module API similar to:

```ts
ctx.accessRight({
  id: "my-module-campaigns-view",
  name: "View campaigns",
  description: "Access to campaign screens",
  department: "Marketing",
});

ctx.defaultGroupGrant({
  role: "marketer",
  tokens: ["my-module-campaigns-view"],
  mode: "seed",
});
```

RestoApp should define the business roles and let modules target those roles:

```ts
accessRights: {
  roleAliases: {
    marketer: "Marketer",
    operator: "Operator",
  },
}
```

That lets modules stay reusable while this project decides what the actual group names are.

## RestoApp-Specific Roles

Initial roles to support:

- `operator` -> `Operator`
- `marketer` -> `Marketer`

Initial generic role tokens already introduced in this project can remain as coarse-grained compatibility tokens:

- `globaly-operator-can-create`
- `globaly-operator-can-view`
- `globaly-operator-can-write`
- `globaly-operator-can-delete`
- `globaly-marketer-can-create`
- `globaly-marketer-can-view`
- `globaly-marketer-can-write`
- `globaly-marketer-can-delete`

These are broad "role capability" tokens. Module-specific tokens should still be preferred when a module owns a concrete feature.

## Proposed RestoApp Migration Plan

1. Keep current `config/adminpanel.js` defaults for compatibility.
2. Add an Adminizer-level default grant API upstream.
3. In RestoApp core modules, replace hard-coded group mutations with runtime grants.
4. Keep `ensureTokens` only for platform-critical defaults.
5. Use `seed` for most module-provided defaults so administrators can later remove permissions.
6. Use `ensure` only when the host really wants a token restored on every boot.
7. Add tests proving existing groups are not overwritten and repeated boots are idempotent.

## Example Module Shape

```ts
ctx.accessRight({
  id: "reviews-manager",
  name: "Reviews manager",
  description: "Access to reviews moderation",
  department: "Marketing",
});

ctx.defaultGroupGrant({
  role: "marketer",
  tokens: ["reviews-manager"],
  mode: "seed",
});
```

If a module needs operator access:

```ts
ctx.accessRight({
  id: "kitchen-queue-view",
  name: "Kitchen queue",
  description: "View kitchen queue screen",
  department: "Orders",
});

ctx.defaultGroupGrant({
  role: "operator",
  tokens: ["kitchen-queue-view"],
  mode: "seed",
});
```

## Important Behavior

- Module default grants must be additive.
- They must not remove tokens from groups.
- They must not overwrite group descriptions, users, or manually edited tokens.
- Missing groups should probably warn, not auto-create, unless RestoApp explicitly opts in.
- Unknown tokens should be reported because `hasPermission()` rejects unregistered token ids.
- The runtime grant applier should run after module tokens are registered.

## Follow-Up Tasks

- Add the Adminizer runtime API and grant registry.
- Add RestoApp role alias config for `operator` and `marketer`.
- Migrate core module permissions to the new API.
- Decide which existing defaults stay in `ensureTokens`.
- Add docs for module authors under `docs/custom-module/adminpanel.md`.
- Add integration tests with an existing `Marketer` group where an admin removed a seeded module token.
