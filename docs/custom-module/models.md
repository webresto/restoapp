# Defining Models

[← Back](./index.md)

---

## Overview

Place model files in `models/`. The framework automatically binds them to the
Waterline ORM via `HookTools.bindModels()` — no manual registration.

---

## Binding models in `src/initialize.js`

```js
// src/initialize.js
import { HookTools } from '@webresto/core';
import { resolve } from 'path';

export default async function (sails, cb) {
  await HookTools.default.bindModels(resolve(__dirname, '../models'));
  cb();
}
```

Call `bindModels` **before** `cb()` so models are available to other hooks.

---

## Model file (TypeScript)

```ts
// models/MyModel.ts
import ORM from '@webresto/core/interfaces/ORM';
import ORMModel from '@webresto/core/interfaces/ORMModel';
import { RequiredField, OptionalAll } from '@webresto/core/interfaces/toolsTS';
import { v4 as uuid } from 'uuid';

let attributes = {
  id:    'string',
  title: 'string',
  slug:  'string',
  amount: 'number' as unknown as number,
};

type attributes = typeof attributes;
interface MyModel extends RequiredField<OptionalAll<attributes>, 'id'>, ORM {}
export default MyModel;

let Model = {
  async beforeCreate(init: MyModel, proceed: any) {
    if (!init.id) init.id = uuid();
    return proceed();
  },
};

module.exports = {
  primaryKey: 'id',
  attributes,
  ...Model,
};

// Makes `MyModel` available globally (same as core models like Dish, Group)
declare global {
  const MyModel: typeof Model & ORMModel<MyModel>;
}
```

---

## Model file (plain JavaScript)

```js
// models/MyModel.js
const { v4: uuid } = require('uuid');

module.exports = {
  primaryKey: 'id',
  attributes: {
    id:    { type: 'string' },
    title: { type: 'string', required: true },
    slug:  { type: 'string' },
    amount:{ type: 'number', defaultsTo: 0 },
  },

  async beforeCreate(init, proceed) {
    if (!init.id) init.id = uuid();
    return proceed();
  },
};
```

---

## Using your model

After binding, the model is available globally (just like `Dish`, `Group`, etc.):

```js
// anywhere in your module after bootstrap
const items = await MyModel.find({ amount: { '>': 0 } });
const item  = await MyModel.findOne({ slug: 'something' });
await MyModel.create({ title: 'New item' }).fetch();
await MyModel.update({ id: '...' }, { amount: 5 }).fetch();
await MyModel.destroy({ id: '...' });
```

---

## Migrations

Models follow the global migration strategy set in `config/models.js`
(`safe` / `alter` / `drop`). No separate migration config is needed.
