# Bootstrap & Hook Lifecycle

[← Back](./index.md)

---

## Execution order

```
Sails lift
  │
  ├─ loads all hooks from modules/
  │    └─ calls initialize(cb) for each  ← src/initialize.js
  │
  ├─ config/bootstrap.js of each module  ← runs after all hooks loaded
  │
  └─ app is ready
```

There are two entry points for startup code:

| File | When it runs | Use for |
|------|-------------|---------|
| `src/initialize.js` | During hook load (early) | Binding models, registering routes |
| `config/bootstrap.js` | After all hooks loaded | Anything that needs other hooks (adminpanel, restocore, MCP) |

---

## `src/initialize.js`

Called by `index.js`. Must invoke `cb()` when done.

```js
// src/initialize.js
import { HookTools } from '@webresto/core';
import { resolve } from 'path';
import afterHook from './hook/afterHook';

const requiredHooks = ['adminpanel', 'restocore'];

export default async function (sails, cb) {
  // 1. Bind models first
  await HookTools.default.bindModels(resolve(__dirname, '../models'));

  // 2. Schedule code that runs after required hooks are ready
  HookTools.default.waitForHooks('my-module', requiredHooks, afterHook);

  // 3. Signal that this hook finished initialising
  cb();
}
```

---

## Waiting for other hooks — `afterHook.js`

`waitForHooks` calls your function once all listed hooks have emitted their
`loaded` events. This is the right place for anything that needs models from
`restocore` or the admin panel to be ready.

```js
// src/hook/afterHook.js
import bindAdminpanelconfig from '../lib/bindAdminpanelconfig';

export default async function () {
  // Safe to use sails.hooks.adminpanel, Dish, Group, etc. here
  bindAdminpanelconfig();
}
```

---

## `config/bootstrap.js`

Runs after **all** hooks in the app are loaded. Follows the same convention as
`api/bootstrap/` files — export a `default` async function that receives `sails`.

```js
// config/bootstrap.js
'use strict';

module.exports.default = async function (sails) {
  sails.log.info('my-module > bootstrap running');

  // Example: register an MCP tool (see docs/mcp-modules.md)
  if (process.env.MCP_ENABLED === 'true') {
    const mcp = require('../../api/mcp/McpServer');
    mcp.registerTool({
      name: 'my-module-status',
      description: 'Returns my-module status.',
      mode: 'public',
      schema: { type: 'object', properties: {} },
      handler: async () => ({ ok: true }),
    });
  }
};
```

---

## Listening to Sails events

Use `sails.on(event, fn)` to react to specific moments in the lifecycle:

```js
module.exports.default = async function (sails) {
  // After the ORM is ready
  sails.on('hook:orm:loaded', () => {
    sails.log.debug('my-module > ORM is ready');
  });

  // After a specific hook
  sails.on('hook:restocore:loaded', async () => {
    const count = await Dish.count();
    sails.log.info(`my-module > ${count} dishes in the database`);
  });
};
```

Common events:

| Event | Fires when |
|-------|-----------|
| `hook:orm:loaded` | Waterline ORM and all models are ready |
| `hook:restocore:loaded` | `@webresto/core` finished loading |
| `hook:adminpanel:loaded` | Admin panel hook is ready |
| `Adminpanel:loaded` | Admin panel fully configured (use for UI registration) |
| `ready` | All hooks loaded, app accepting requests |
