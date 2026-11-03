# app-mobile-api — API of the RestoApp mobile admin app

`/api/mobile/*`: sign in with login, password and PoW CAPTCHA; get a declaration of the apps and
methods this user may use; call them. The client has no screens of its own — it draws lists, cards
and actions from the declaration. Plan: `server-apps-and-rights.plan.md` of restoapp-mobile-admin.

## Switches

| Variable | Default | What |
|---|---|---|
| `MOBILE_API_ENABLED` | `false` | Off: every `/api/mobile/*` answers `503 unavailable`. Tokens are registered in the admin panel either way |
| `MOBILE_API_SECRET` | `JWT_SECRET` | Signs CAPTCHA tasks; must be the same in every worker. Neither set — login answers 503 |
| `MOBILE_API_REQUIRE_HTTPS` | on when `NODE_ENV=production` | Plain http → `403 https_required`. Behind a proxy it reads `X-Forwarded-Proto` through `TRUST_PROXY` |
| `ENABLE_ADMIN_CAPTCHA` | `true` | The switch of the web login; the app follows it |
| `CAPTCHA_POW_DIFFICULTY` | `3000` | Base duration of the puzzle, ms |
| `TRUST_PROXY` | `1` | Express "trust proxy" of Sails (`config/http.js`): hops in front of Sails |

Tables come from `migrations/` (collected by `.ci/bootstrap` in the image, by `npm run dev:pg`
locally). If they are missing the hook logs how to get them and answers 503 — the rest of the
server runs.

## Protocol 1

Every answer is JSON with `Cache-Control: no-store` and `X-Mobile-Protocol: 1`. Success is
`{result}`, failure `{error: {code, message, retryable, details?}}`. The contract —
`schema/declaration.schema.json` — is shared with the client's tests.

| Route | Body → result |
|---|---|
| `GET /api/mobile/auth/challenge` | → `{task: number[] \| null}` — a crypto-puzzle 5 archive for the label `login:<ip>`; `null` with the CAPTCHA off |
| `POST /api/mobile/auth/login` | `{login, password, captchaSolution, device: {name, platform}}` → `{token, user, protocolVersion}` |
| `POST /api/mobile/auth/logout` | Bearer → `{ok: true}`, the device is revoked |
| `GET /api/mobile/describe?lang=ru` | Bearer → the declaration; `X-Mobile-Revision` |
| `POST /api/mobile/call/:method` | `{params, place?}` → the method's result; `X-Mobile-Revision` when signed in |

`server.about` is answered without a token: `{name, version}` — what the client shows before login.

| Code | HTTP | Retry | When |
|---|---|---|---|
| `unauthorized` | 401 | no | no token, revoked or expired device, password changed, user disabled or lost `access-to-adminpanel` |
| `invalid_credentials` | 401 | no | wrong login or password — one answer for both |
| `forbidden` | 403 | no | method not available to this user (re-read the declaration); at login — account cannot enter |
| `place_forbidden` | 403 | no | the point is not granted, disabled or of the wrong kind |
| `https_required` | 403 | no | plain http where HTTPS is required |
| `invalid` | 400 | no | body or params do not match the schema; `details` from ajv |
| `captcha_invalid` | 400 | no | wrong, foreign, expired or reused CAPTCHA solution — ask for a new task |
| `not_found` | 404 | no | no such record or endpoint |
| `conflict` | 409 | no | the state changed under the action |
| `too_large` | 413 | no | body over 64 KB |
| `rate_limited` | 429 | yes, `Retry-After` | more than 10 login attempts a minute per IP or per login |
| `internal` | 500 | no | a bug; logged |
| `unavailable` | 503 | yes | API off, tables missing, admin panel not loaded |

### Login

The checks of adminizer's web login, without its process memory: CAPTCHA, user, password
(`login + password + AP_PASSWORD_SALT`), then confirmation, `isActive`, `isDeleted`, `expires` and
`checkPermission('access-to-adminpanel')`. Access to the panel = access to the app.

- **CAPTCHA without state.** The puzzle hides `<id>:<label>:<exp>:<sig>`, `sig = HMAC-SHA256(secret,
  "<id>:<label>:<exp>")`: any worker checks it, the id goes to `mobile_pow_use` (primary key) — a
  solved task works once. Difficulty × (1 + ⌊failed logins with the label in 30 min / 7⌋), counted in
  `mobile_auth_attempt`. The same shape is proposed for adminizer's `POWCaptcha` upstream; until it is
  released the hook keeps `lib/auth/challenge.ts`.
- **Device token**: 32 random bytes; the table keeps only the sha256. Expires after 30 days without
  use, 90 days at most; 10 devices per user, the 11th revokes the oldest. Every request re-reads the
  user with groups and re-checks everything above; a changed password (fingerprint of
  `passwordHashed`) revokes the device.
- In the admin panel: model **Mobile devices** — own devices for everyone (`userAccessRelation`), all
  for the administrator; "Revoked" or delete signs the phone out.

### Declaration and revision

`describe` returns the apps whose home method the user may call, their methods with input schemas
and `ui` hints, fields of their models, and the points of apps by points. Titles are translated
(`locales/`). The revision is a hash of the user's groups with their grants and points, the
administrator flag, the enabled points, the server facts, the protocol, this hook's version and the
registry; it is sent with every call, so a client seeing a new one re-reads `describe`. Declarations
are cached per worker by (revision, language).

### Points

An app with `scope: "place"` works on one point at a time; every call carries `place`. The points are
those of a contextual adminizer token — for «Блюда» `stock-manager`, the same points the group form
ticks for the web Stock Manager; the administrator gets all enabled points. Each call is checked by
`checkPermission(token, user, {placeId})`, the point must be enabled and of the app's kind.

## Registering an app

`global.mobileApi` (also `sails.hooks['app-mobile-api'].registry`; `mobile-api:ready` is emitted with
it):

```ts
mobileApi.registerApp({
  id: "dishes", version: "1.0.0", title: "mobile.app.dishes.title", icon: { path: "M…" },
  category: "mobile.category.restaurant", home: "dishes.list",
  scope: "place", places: { token: "stock-manager", kind: "cooking" },
  models: { dish: { fields: [{ name: "balance", title: "…", format: "number", readonly: true }] } },
});
mobileApi.registerMethod({
  name: "dishes.setBalance", app: "dishes", kind: "mutation", title: "…",
  access: { token: "stock-manager" },
  input: { type: "object", required: ["id", "balance"], properties: { id: { type: "string" }, balance: { type: "integer", minimum: -1 } } },
  ui: { view: "action", on: "dish", placement: ["row", "detail"], control: { type: "stepper", param: "balance", bind: "localBalance" } },
  handler: async ({ id, balance }, ctx) => { /* ctx.place, ctx.user, ctx.fail(code) */ },
});
```

- A registration is checked against the contract at start: an unknown `view`, `control`, format or
  `ui` key, a method without `access`, an input schema ajv cannot compile strictly — an error.
- `access`: `{token: "<existing>"}`, `{tokens: [...]}` (all of them), `{token: {id: "mobile-app-…",
  name}}` (registered by the hook in the "Mobile app" department) or `{public: true}` for queries of
  apps without points.
- A query with `model` gets `_actions` on every record: the available mutations with `ui.on` equal to
  the model, each narrowed or dropped by its `describeItem(ctx, record)`. A mutation answers
  `{item}` and gets them too. `describe(ctx)` narrows a method's input for the user, both in the
  declaration and in validation.
- Every mutation goes to core's audit log, scope `mobile-api`: user, device, point, record, params
  (or what `audit(params, result)` returns), `req.ip` under "trust proxy".

## Layout

- `http/app.ts` — `createMobileApi(deps)`, Express 5, no Sails; `http/mount.ts` — the middleware Sails
  gets, before `bodyParser`.
- `lib/` — registry, access, declaration, call, login, devices, CAPTCHA; only interfaces of `lib/types.ts`.
- `adapters/sails.ts` — the only place with Sails, adminizer and Waterline; `adapters/stock.ts` — core's
  web stock functions (from the controllers folder until core task C4 moves them to `lib/menu/`).
- `apps/dishes.ts` — «Блюда».

## Tests

- `tests/mobile-api.test.ts` — the Express application on fake deps with adminizer's real
  `AccessRightsHelper` and core's `stock-manager` check; also in the test stage of the Dockerfile.
- `tests/mobile-api.sails.test.ts` — Sails with the admin panel on sails-disk
  (`tests/support/liftWithAdminpanel.ts`): adminizer users and groups, Waterline stores, core's stock.
