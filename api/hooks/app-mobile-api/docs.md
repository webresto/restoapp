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
| `GET /api/mobile/app-assets/:app/:sha256.js` | Bearer → the JS bundle of an app that comes as a script; `immutable`, 404 for any other hash |

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

An app may also show among its points options of the same token that are not `Place` rows at all:
`places.options: [{id, title}]`. «Заказы» declare one — «Без кухни» (`no-kitchen`), where an order
waits while no kitchen has been resolved for it. Such an option is granted exactly like a point (it
is one of the token's options in the group form), its title is a translation key rather than data,
and `ctx.place.id` is its id in the handler. `ctx.appPlaces()` answers with every point of the app
this user holds — for a method whose own input names one, as «Назначить кухню» does.

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
- `access`: `{token: "<existing>"}`, `{tokens: [...]}` (all of them), `{anyOf: [...]}` (any one of
  them — the two rights of «Маркетинг», either of which opens its summary), `{token: {id:
  "mobile-app-…", name}}` (registered by the hook in the "Mobile app" department) or
  `{public: true}` for queries of apps without points.
- A **field** may carry an `access` of its own: it is then dropped from the declaration of everybody
  else, so a number they may not see is not shown as «—» either. The values are the handler's own
  business — it asks `ctx.can(token)` and leaves the field out.
- **Where a tap leads.** A record may carry `_open` (a row leads there instead of the list's
  `ui.open`) and a card `_links: [{title, meta?, open}]` — the lines at the bottom of it. Both are
  built by the server after `ctx.canOpen(method, placeId?)` says the person could call it: no right,
  no line. A link is a hint and not a permission — the call it leads to is checked like any other.
  The client keeps a stack of frames, so a link opens one more screen and «Назад» closes it.
- **A screen of the client for one action**: `control: {type: "native", screen: "promotion-editor"}`
  — the editor of a promotion (`marketing.plan.md`, Q43). A client that does not have the screen
  draws no button, as it already does for a control it does not know.
- A query with `model` gets `_actions` on every record: the available mutations with `ui.on` equal to
  the model, each narrowed or dropped by its `describeItem(ctx, record)`. A mutation answers
  `{item}` and gets them too. `describe(ctx)` narrows a method's input for the user, both in the
  declaration and in validation.
- Every mutation goes to core's audit log, scope `mobile-api`: user, device, point, record, params
  (or what `audit(params, result)` returns), `req.ip` under "trust proxy".

## The apps it ships

| App | Scope | Access | What |
|---|---|---|---|
| «Блюда» (`dishes`) | a cooking point | `stock-manager` (contextual) | The web Stock Manager of one point, through core's `lib/menu/stock-items` (C4) |
| «Заказы» (`orders`) | a point, «Без кухни» among them | `order-kanban` + the `order` model rights | The orders board of one point: the two tabs with their counts, the card, the flow by buttons, «Назначить кухню» |
| «Клиенты» (`clients`) | the server | the `Customer` model rights of the panel (`read-customer-model`, `create-customer-model`) | The customers: search by number or name, a card with addresses and recent orders, a new one through `AuthService.materializeUser` |
| POS (`pos`) | a cooking point | `order-entry` (contextual) | Taking an order on a terminal, from the catalog to the placing. **Drawn by the client itself** — `client: {native: "pos", min: 1}`; the server owns the rights, the points and every number |
| «Маркетинг» (`marketing`) | the server | `anyOf: [promocodes-manager, promotions-manager]` | The Marketing section of the panel: the summary, the promo codes, the promotions and the applications of a code. The editor of a promotion is the client's own screen |
| «Каналы продаж» (`channels`) | the server | `anyOf: [sales-channels-manager, sales-channels-view, sales-channels-manage]` to read, the first and the last to write | The Sales Channels page of the panel: what may create orders, whether it works and why not — core's `lib/sales-channels/` answers, words included |
| «Настройки» (`settings`) | the server | `settings-manager` | The Settings page of the panel, one to one: every setting of the server by key, the search, the chips of the state, the value and the state in words. The value is edited on a screen of the client's own — the form is built from the JSON Schema that comes **with the record**, and every setting has one of its own. Export and import are one more such screen, on the list |
| «Система» (`system`) | the server | `anyOf: [modules-process-upgrade, settings-manager, sales-channels-view, sales-channels-manage]`; the programs — `modules-process-upgrade` | The central place of an administrator: which server this is, what it is built of and what was installed into it, and the doors into «Настройки» and «Каналы продаж». Reading, the restart of the server, the marketplace, and installing, updating and removing as jobs (`system.plan.md`, slices A, B and C) |

### «Каналы продаж», screen by screen

A channel exists only together with its provider module, so the screen is about **why** a channel
does not work and **what to do next**, not about fields (`sales-channels.plan.md`):

```
channels.list (list, chips «Все / Работают / Выключены / Нужна настройка / Ошибка», search)
├─ channels.get (detail)
│  ├─ channels.toggle   the operator's switch        sales-channels-manage
│  ├─ channels.delete   with the question first      sales-channels-manage
│  └─ _links            «Настроить» / «Настройки» / «Открыть» — addresses; «Установить провайдера» — «Система»
└─ channels.types (list, chips «Рекомендуем / Все»; the last row of the whole list above leads here)
   └─ channels.type (detail)
      └─ _links         «Искать в маркетплейсе» / «Установить из маркетплейса» — «Система»; «Настройки» — an address
```

- **The words are core's.** `describeChannel()` (`lib/sales-channels/view.ts`, C29) answers the
  flags *and* the sentences — "admin-frontend · Provider installed", "Not working: provider is not
  installed (sales-channel-kiosk)" — the same ones the page shows, translated by the dictionary of
  the admin panel for the language of the request (C31). A refusal of a rule arrives as a
  `conflict` whose `message` is that sentence plus what the provider itself said, with the
  `settingsUrl` and the `marketplaceAppId` in `details`.
- **The two levels of the right** work by themselves: without `manage` a record carries no
  `settingsUrl` and `describeItem` offers no action. `settings`, `publicConfig` and `secretsRef` of
  a channel are its provider's and are in no record at all (Q55).
- **No `since`.** A polled list would ask every provider of the server every ten seconds, each with
  a 3 s timeout; the list answers the stored readiness and the card asks for a fresh one, which core
  caches for a few seconds (C32).
- **The switch is not offered without a live provider** — the page shows it locked, and a locked
  switch is a switch that is not there; a provider's own channel cannot be deleted while its module
  is installed, and `describeItem` takes that action away too.
- **A line of a card is an address or «Система».** `open: {url}` is what the system browser opens;
  a path is of this server, and the client resolves it against the address it is connected by. A
  line into «Система» appears only when `ctx.canOpen("system.catalog")` says yes, and an install
  also needs `modules-process-upgrade`, as the page's button does: whoever may not open the catalog
  has no such line. A list has no line of its own, so «Типы каналов» and «Все каналы продаж в
  маркетплейсе» are the last row of a whole list, each with an `_open` of its own.

### «Маркетинг», screen by screen

The home screen is the **summary** — the one screen everybody with either right of the section sees;
everything else opens from it by a link the server built (`marketing.plan.md`, Q39):

```
marketing.home (detail, chips «7 / 30 / 90 дней»)
├─ marketing.promocodes → marketing.promocode   promocodes-manager
│  └─ marketing.applications {code}             + read-order-model
├─ marketing.promotions  → marketing.promotion  promotions-manager
│  └─ marketing.savePromotion                   a native screen of the client
└─ marketing.applications → marketing.application
```

- What a code is, where a promotion stands, what it gives and why a code gave nothing are **core's**
  answers (`lib/marketing/*`, plan C18–C20), words included: the panel reads the same functions, so
  the web and the phone cannot disagree about a status, a term or «что даёт».
- The numbers of the summary are fields with an `access`: the codes to `promocodes-manager`, the
  promotions to `promotions-manager`, the money of the applications to both plus `read-order-model`.
- **Two switches of a promotion** (core C22): `enable` is "works at all" — off, it applies nowhere, a
  promo code included — and `onlyByCode` is "does not apply by itself". `setPromotionOnlyByCode` is
  not offered on a promotion that is switched off, and `savePromotion` is not offered on one a module
  wrote, as neither is in the web.

### The POS, step by step

A draft is a cart of core; every method calls core's own model in the order the storefront's
resolvers call it, and answers `{order, message, ok}` — the whole order as core counted it, and one
word about the step. `ok: false` is a refusal of core (an empty basket, a guest with no phone, a
point with no dining room), **not** an error of the protocol: the receipt stays on the terminal and
the message says what to do. The words of a refusal come from core's own table
(`lib/order/order-errors.ts`), so the site and the terminal say the same thing.

| Method | What it calls |
|---|---|
| `pos.order`, `pos.start`, `pos.cancel` | the drafts of this person at this point; `Order.create`; the row of `mobile_order_draft` |
| `pos.catalog` | `Dish.getDishes` in the order's menu context — the price a promotion makes, the stock of its kitchens, and how many of a product the receipt has |
| `pos.add`, `pos.setLine`, `pos.setLineComment` | `Order.addDish` (`addedBy: "user"`, as the site: `countCart` sums only those lines), `setCount`, `removeDish`, `setComment` |
| `pos.options`, `pos.setLineOptions` | the modifier groups of the dish as `Dish.getDishModifiers` reads them at this order's kitchens, with core's own defaults ticked; the chosen set goes into `OrderDish.modifiers` and `countCart` prices it |
| `pos.serviceOptions`, `pos.setService`, `pos.setTable` | the flags of the point; `Order.setServiceType`, `pickupPoint`, `Order.table` |
| `pos.clients`, `pos.setClient`, `pos.setCustomer` | the search of «Клиенты»; `order.user` and `order.customer`; `AuthService.materializeUser` when an account is asked for |
| `pos.cities`, `pos.addressSearch`, `pos.setAddress`, `pos.clientAddresses` | the geo adapter and `UserLocation`; the address is priced by `countCart` |
| `pos.timeOptions`, `pos.setTime` | `OrderHelper.initCheckout`; a slot or a maximum wait, never both (core's code 20) |
| `pos.payments`, `pos.setPayment` | `PaymentMethod.getAvailable`; only a promise of payment is taken on a terminal |
| `pos.promocode`, `pos.setDetails` | `Order.applyPromotionCode`; the comment, the guests, «перезвонить» |
| `pos.check`, `pos.place` | `Order.check` and `Order.order`; the placed order leaves the drafts and turns up on the board of its point, with `orderedOnPlatform: "mobile-pos"` |

Two things about the options are worth knowing, because both are core's and neither is obvious.
`Order.addDish` fills in every option that has a `defaultAmount` even when the group already has a
choice (`ProductModifier.fillDefault`, and core's tests say so), so «Средний» would come back onto a
line switched to «Большой»: the POS writes the chosen set back onto the line and lets core recount,
rather than changing a library the storefront is built on. And the «so many free of charge» rule is
found by the option's own product (`countCart` matches `modifier.dish.rmsId`), so the chosen options
carry that product along, exactly as the storefront's menu objects do — without it a free first
portion is charged for.

«Заказы» decide nothing of their own: which orders a point leads, what a role may move an order to
and what assigning a kitchen means are core's `ordersOfPlace`, `transitionOrder` and
`assignOrderKitchen` — the very functions the web board calls, so the board and the phone can never
answer differently about one order. The selection itself is an indexed query over `order_stop` (core
C2): one row per point with work to do, written by core at every transition. Baskets are never among
them. `orders.list` takes `since`, epoch
milliseconds: the answer is then only the rows of that tab changed at or after that moment, which is
what the client polls with every ten seconds while the screen is open (there is no SSE).

## Apps a module brings as JS

An app may come to the client as **code**, not as a declaration of screens (`script-apps.plan.md`,
D12): the registration names a built bundle, `script: {file}`, and the declaration carries a link to
it with its hash — `script: {url, sha256, size, min}`. The link is `app-assets/<app>/<sha256>.js`, so
a new build is a new URL, the client may keep what it downloaded forever, and a hash the registry
never gave is a 404 rather than some older file. The same shape adminizer serves its own app assets
with (`/admin/app-assets/…`, its `AssetHandler`), with a device token added.

The bundle is read and hashed at registration: a missing or empty file stops the server at start, not
a phone later. Its hash is part of the registry fingerprint, hence of every declaration revision — a
new build is rolled out, and clients re-read `describe` by themselves.

The file is looked at again whenever a declaration is built (`lib/scripts.ts`, `rereadScript`): size
and mtime against what was read last time, and a changed file is hashed anew. So `npm run
build:mobile` in the module, or an update of the module on a server, reaches the clients without a
lift — the hash moves, the revision with it, and the client downloads the new code. A file caught
half-written or removed keeps the bundle that works: it is stamped again after the body is read, and
a file that moved meanwhile is taken at the next look, not served broken.

The declaration also lists the **modules** of the server: `modules: [{id, version, kind, title, app?,
script?}]`, `system` for what the installation is built of (`MM_SYSTEM_MODULES`) and `installed` for
what the module manager loaded out of `modules/`. The module that brought an app names it in `app`
and carries the same link in `script` — but only when the user may open that app.

**How a module registers one.** The hook knows no modules: it emits `mobile-api:ready` at the end of
its `initialize` and a module registers itself. In the module's hook:

```js
// `after`, not `on`: the event is sticky in Sails, so the order of the hooks does not matter, and a
// server without the mobile API simply never fires it.
sails.after("mobile-api:ready", () => {
  const api = sails.hooks["app-mobile-api"];            // `registry` and `translator`
  for (const [lang, strings] of Object.entries(mine)) api.translator.extend(lang, strings);
  api.registry.registerApp({ id: "navigation", module: "simple-navigation", script: { file, min: 1 }, … });
  api.registry.registerMethod({ name: "navigation.menus", app: "navigation", … });
});
```

The bundle lives in the module (`assets/mobile/<appId>.js`, built from its own source the way its
admin page is built), `module` is the `appId` of the module manager, and the titles are translation
keys the module adds to the hook's translator with `extend` — the hook ships no strings of anybody
else's app.

«Навигация» of `simple-navigation` 1.8 is the first such app: the same menus and the same right as its
admin page (`navigation-manager`), registered in `src/mobile/NavigationMobileApp.ts` there, drawn by
`assets/mobile/navigation.js` there. Nothing of it is in this hook.

A declaration may carry `client: {native, min}`: the client draws that app with a screen of its own
instead of the universal renderer, because a POS receipt with a catalog is not a list with actions on
a record (`order-entry.plan.md`). A client that does not know the `native` shows a «needs a newer
version» tile — the mechanism of the reserved `script` field — so a server may declare it to anybody.
The methods of such an app carry no `ui`, only their input schemas, and their answers are their own
shape; nothing else about them is different.

The POS keeps its drafts in `mobile_order_draft`: an order of core in NEW / CART / CHECKOUT, with
whose it is and which point it was taken at — a cart of core carries neither. Rows go when the order
is placed or dropped, and the hourly cleanup removes what nobody came back to within a day.

## Layout

- `http/app.ts` — `createMobileApi(deps)`, Express 5, no Sails; `http/mount.ts` — the middleware Sails
  gets, before `bodyParser`.
- `lib/` — registry, access, declaration, call, login, devices, CAPTCHA; only interfaces of `lib/types.ts`.
- `adapters/sails.ts` — the only place with Sails, adminizer and Waterline; `adapters/stock.ts` — core's
  web stock functions (from the controllers folder until core task C4 moves them to `lib/menu/`).
- `apps/dishes.ts` — «Блюда»; `apps/orders.ts` — «Заказы»; `apps/clients.ts` — «Клиенты»;
  `apps/pos.ts` — the POS; `apps/marketing.ts` — «Маркетинг»; `apps/channels.ts` — «Каналы продаж»;
  `apps/settings.ts` — «Настройки»; `apps/system.ts` — «Система». Their adapters are
  `adapters/stock.ts`, `adapters/orders.ts`, `adapters/clients.ts`, `adapters/pos.ts`,
  `adapters/marketing.ts`, `adapters/channels.ts`, `adapters/settings.ts` and `adapters/system.ts`:
  the only files that know Waterline and core. The apps of modules live in the modules.
- `adapters/system.ts` is also the only file that knows the module manager
  (`sails.hooks['app-manager-proto']`): the rows of `Module` joined with the manager's memory, with
  the marketplace asked at most once per module per ten minutes and never while a declaration is
  built. `adapters/modules.ts` — the modules of the server for the declaration — is the same
  function, so the declaration and «Система» cannot disagree; `adapters/facts.ts` — the name, the
  version, the currency and the time zone of this server, read once a minute for both.
- `lib/scripts.ts` — bundles of script apps: read, hashed, served by hash (`http/routes/script.ts`);
  `adapters/modules.ts` — the modules of the server for the declaration.

## Tests

- `tests/mobile-api.test.ts` — the Express application on fake deps with adminizer's real
  `AccessRightsHelper` and core's `stock-manager` check; also in the test stage of the Dockerfile.
- `tests/mobile-api.marketing.test.ts` — «Маркетинг» on the fake deps: the rights of the section,
  the links of a record, the two switches, the editor's action and the applications.
- `tests/mobile-api.system.test.ts` — «Система» on the fake deps: the right of the Extensions page
  closing the programs while the home screen stays open to the settings alone, the links the home
  screen does not promise before an app exists, the badge of every state, the search over what is
  installed, the three refusals of a removal in words, and the restart: closed by the right, asking
  before «now», planning once.
- `tests/mobile-api.system.install.test.ts` — the manager of extensions from end to end: a lifted
  Sails, the real module manager, real archives from `tests/support/fakeRegistry.ts`, and only
  `process.exit` replaced.
- `tests/app-manager-restart.test.ts` — the scheduler of the module manager: a line in the log and
  `process.exit(0)` after the answer has gone out.
- `tests/mobile-api.scripts.test.ts` — an app that comes as JS, on a bundle of its own: the link and
  the hash in the declaration, the bundle served only by that hash and only to a signed-in device, a
  new build as a new link and a new revision, the modules of the server next to it, and the rights.
- `tests/mobile-api.module-navigation.test.ts` — the app of an installed module through this hook:
  `modules/simple-navigation` registers «Навигация» itself, and its menus are edited over the API.
- `tests/mobile-api.sails.test.ts` — Sails with the admin panel on sails-disk
  (`tests/support/liftWithAdminpanel.ts`): adminizer users and groups, Waterline stores, core's stock,
  and «Маркетинг» against core's own promotions and codes.
