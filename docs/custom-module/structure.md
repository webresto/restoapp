# Module File Structure

[← Back](./index.md)

---

## Minimal layout

```
modules/
└── my-module/
    ├── index.js              ← entry point (required)
    ├── defaults.js           ← default sails config values (required)
    ├── package.json          ← module identity (required)
    ├── config/
    │   └── bootstrap.js      ← startup code (optional but common)
    ├── models/
    │   └── MyModel.js        ← Waterline model (optional)
    └── src/
        └── initialize.js     ← main logic called from index.js
```

## Full layout (TypeScript module)

```
modules/
└── my-module/
    ├── index.js              ← compiled entry point
    ├── defaults.js
    ├── package.json
    ├── tsconfig.json
    ├── config/
    │   ├── bootstrap.ts      ← source
    │   └── bootstrap.js      ← compiled (loaded by the app)
    ├── models/
    │   ├── MyModel.ts
    │   └── MyModel.js        ← compiled
    ├── src/
    │   ├── initialize.ts
    │   ├── initialize.js
    │   ├── hook/
    │   │   └── afterHook.ts  ← runs after required hooks are ready
    │   └── lib/
    │       └── bindAdminpanelconfig.ts
    ├── types/
    │   ├── globalTypes.d.ts
    │   ├── ModuleHook.d.ts
    │   └── ModuleConfig.d.ts
    └── locales/
        └── en.json           ← i18n strings (optional)
```

---

## Required files

### `index.js`

Entry point. Sails calls `initialize(cb)` when loading the hook.

```js
'use strict';
module.exports = function (sails) {
  const module = require('./src/initialize');

  return {
    defaults: require('./defaults'),
    initialize: function (cb) {
      module.default(sails, cb);
    },
  };
};
```

---

### `defaults.js`

Default configuration values merged into `sails.config`.
The top-level key must match `hookName` from `package.json`.

```js
module.exports['my-module'] = {
  // default config values for this module
  // accessible as sails.config['my-module'].*
};
```

---

### `package.json`

Three fields are mandatory for the module system:

```json
{
  "name": "my-module",
  "version": "1.0.0",
  "main": "index.js",
  "appName": "My Module",
  "appId": "my-module",
  "webresto": {
    "moduleSpecificationVersion": "1.0"
  },
  "sails": {
    "isHook": true,
    "hookName": "my-module"
  }
}
```

| Field | Purpose |
|-------|---------|
| `sails.isHook` | Tells Sails to treat this package as a hook |
| `sails.hookName` | Key used in `sails.hooks.*` and `defaults.js` |
| `appId` | Unique identifier used by the module marketplace |
| `webresto.moduleSpecificationVersion` | Must be `"1.0"` |
