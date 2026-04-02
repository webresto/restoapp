# Admin Panel Integration

[← Back](./index.md)

---

## Overview

Modules can add their models as managed resources in the admin panel by merging
configuration into `sails.config.adminpanel` at startup.

This is done inside `afterHook` (which runs after the `adminpanel` hook is ready)
via a helper function — typically `src/lib/bindAdminpanelconfig.js`.

---

## Registering a model

```js
// src/lib/bindAdminpanelconfig.js
'use strict';

module.exports.default = function bindAdminpanelconfig() {
  const config = {
    models: {
      // Key = model identity (lowercase model name)
      mymodel: {
        title: 'My Model',   // label shown in the sidebar
        model: 'mymodel',    // must match the Waterline model identity
        icon: 'box',         // icon name from the admin panel icon set
        fields: {
          id: false,         // hide the id field from the list view
        },
      },
    },
  };

  if (sails.config.adminpanel && config) {
    sails.config.adminpanel.models = {
      ...sails.config.adminpanel.models,
      ...config.models,
    };
  }
};
```

Call it from `afterHook`:

```js
// src/hook/afterHook.js
import bindAdminpanelconfig from '../lib/bindAdminpanelconfig';

export default async function () {
  bindAdminpanelconfig();
}
```

And make sure `afterHook` runs after `adminpanel` is ready:

```js
// src/initialize.js
HookTools.default.waitForHooks('my-module', ['adminpanel', 'restocore'], afterHook);
```

---

## Field configuration

```js
fields: {
  id:        false,            // hide field entirely
  title:     { title: 'Name' },// rename the column label
  amount:    { title: 'Qty' },
  createdAt: false,
  updatedAt: false,
},
```

---

## Registering multiple models

```js
const config = {
  models: {
    mymodel: {
      title: 'My Model',
      model: 'mymodel',
      icon: 'box',
      fields: { id: false },
    },
    myothermodel: {
      title: 'Other Model',
      model: 'myothermodel',
      icon: 'list',
      fields: { id: false, createdAt: false },
    },
  },
};
```
