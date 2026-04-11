# Adding MCP Tools from External Modules

[← Back](./index.md)

RestoApp modules (installed under `modules/`) can register their own MCP tools
at startup. The `mcp` object is a **global** — available everywhere without any
`require()`, just like `sails` or `_`.

---

## How it works

1. `api/mcp/McpServer.js` is loaded by `config/http.js` at Sails start and sets
   `global.mcp` — this happens before any bootstrap runs.
2. The MCP bootstrap (`api/bootstrap/mcp-server.js`) runs during Sails lift and
   auto-loads built-in tools from `api/mcp/tools/`.
3. Each module has a `config/bootstrap.js` that is executed automatically by
   `config/bootstrap.js` of the host app.
4. Inside that file a module calls `mcp.registerTool(...)` using the global.
5. From that point the tool is live at `POST /mcp/call/<name>`.

No changes to core files are needed — just add a `config/bootstrap.js` to
your module.

---

## Step-by-step

### 1. Create `config/bootstrap.js` in your module

```
modules/
└── my-module/
    ├── index.js
    ├── package.json
    └── config/
        └── bootstrap.js   ← add this
```

```js
// modules/my-module/config/bootstrap.js
'use strict';

module.exports.default = async function (sails) {
  // Guard: only run when MCP is enabled
  if (process.env.MCP_ENABLED !== 'true') return;

  // mcp is a global — no require() needed
  mcp.registerTool({
    name: 'my-module-hello',
    description: 'Says hello from my-module.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name to greet.', example: 'World' },
      },
      required: ['name'],
    },
    handler: async ({ name }) => {
      return { message: `Hello, ${name}!` };
    },
  });
};
```

That's all. The tool will appear in `GET /mcp` on the next app start.

---

### 2. Tool modes

| `mode`        | Who can call it         | Admin key required |
|---------------|-------------------------|--------------------|
| `'public'`    | Anyone                  | No                 |
| `'protected'` | Admin only              | Yes — `MCP_ADMIN_KEY` env var |

Use `'protected'` for tools that expose sensitive data or trigger side effects.

```js
mcp.registerTool({
  name: 'my-module-stats',
  description: 'Returns internal stats (admin only).',
  mode: 'protected',          // ← requires X-Mcp-Key header or ?mcp_key=
  schema: { type: 'object', properties: {} },
  handler: async () => {
    return await MyModel.count();
  },
});
```

---

### 3. Schema — document your parameters

The `schema` field is a standard [JSON Schema](https://json-schema.org/) object.
It is returned inside `GET /mcp` so MCP clients know what to send.

Add an `example` field to each property — it will be used to generate the
curl snippet in the tool documentation automatically:

```js
schema: {
  type: 'object',
  properties: {
    groupId: {
      type: 'string',
      description: 'Parent group ID.',
      example: 'abc123',       // ← shown in the curl example
    },
    limit: {
      type: 'integer',
      description: 'Max results to return.',
      example: 10,
    },
  },
  required: ['groupId'],
},
```

Supported JSON Schema types and their auto-generated placeholders:

| type      | placeholder when no `example` |
|-----------|-------------------------------|
| `string`  | `"<fieldName>"`               |
| `string` + `enum` | first enum value      |
| `integer` / `number` | `0`              |
| `boolean` | `true`                        |
| `array`   | `[]`                          |
| `object`  | `{}`                          |

---

### 4. Handler signature

```js
handler: async (params, ctx) => {
  // params — parsed request body (object)
  // ctx    — { req, res } Express objects (rarely needed)
  return <any serialisable value>;
}
```

- **Return value** is JSON-serialised and sent as `{ tool: "<name>", result: <value> }`.
- **Throw an Error** to return a 500 with `{ error: "<message>" }`.
- The handler runs inside a try/catch — uncaught errors are caught automatically.

---

### 5. Waiting for Sails hooks (optional)

If your tool depends on a model or another hook being ready, wait for it inside
the bootstrap using `sails.on(...)` or `HookTools.waitForHooks`:

```js
module.exports.default = async function (sails) {
  if (process.env.MCP_ENABLED !== 'true') return;

  // Wait until restocore models are available
  sails.on('hook:restocore:loaded', () => {
    mcp.registerTool({
      name: 'my-module-dishes',
      description: 'Returns dishes from my module context.',
      mode: 'public',
      schema: {
        type: 'object',
        properties: {
          concept: { type: 'string', example: 'origin' },
        },
      },
      handler: async ({ concept }) => {
        return await Dish.getDishes({ concept: concept || 'origin' });
      },
    });
  });
};
```

---

### 6. TypeScript modules

If your module is written in TypeScript, use the same approach in
`config/bootstrap.ts` (compiled to `config/bootstrap.js`):

```ts
// config/bootstrap.ts
declare const mcp: any; // global — set by api/mcp/McpServer.js

export default async function (sails: any): Promise<void> {
  if (process.env.MCP_ENABLED !== 'true') return;

  mcp.registerTool({
    name: 'my-ts-tool',
    description: 'A tool from a TypeScript module.',
    mode: 'public',
    schema: { type: 'object', properties: {} },
    handler: async (_params: Record<string, unknown>) => {
      return { ok: true };
    },
  });
}
```

---

## Complete example: module with two tools

```
modules/
└── loyalty/
    ├── index.js
    ├── package.json
    └── config/
        └── bootstrap.js
```

```js
// modules/loyalty/config/bootstrap.js
'use strict';

module.exports.default = async function (sails) {
  if (process.env.MCP_ENABLED !== 'true') return;

  // Public: check bonus balance for a phone number
  mcp.registerTool({
    name: 'loyalty-balance',
    description: 'Returns bonus balance for a customer phone number.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', description: 'Customer phone.', example: '+71234567890' },
      },
      required: ['phone'],
    },
    handler: async ({ phone }) => {
      const user = await User.findOne({ phone });
      if (!user) return { balance: 0 };
      return { balance: user.bonusBalance ?? 0 };
    },
  });

  // Protected: full customer profile (admin only)
  mcp.registerTool({
    name: 'loyalty-profile',
    description: 'Returns full customer profile including order history. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        phone: { type: 'string', description: 'Customer phone.', example: '+71234567890' },
      },
      required: ['phone'],
    },
    handler: async ({ phone }) => {
      const user = await User.findOne({ phone });
      if (!user) return null;
      const orders = await Order.find({ user: user.id }).sort('createdAt DESC').limit(10);
      return { user, orders };
    },
  });
};
```

---

## Environment variables

| Variable        | Required | Description |
|-----------------|----------|-------------|
| `MCP_ENABLED`   | Yes (`true`) | Enables the MCP server. Without it no tools are loaded. |
| `MCP_ADMIN_KEY` | For protected tools | Global admin key. Pass as `X-Mcp-Key` header or `?mcp_key=`. |

---

## Calling your tool

```bash
# Public tool
curl -X POST http://localhost:1337/mcp/call/loyalty-balance \
  -H "Content-Type: application/json" \
  -d '{"phone": "+71234567890"}'

# Protected tool
curl -X POST http://localhost:1337/mcp/call/loyalty-profile \
  -H "Content-Type: application/json" \
  -H "X-Mcp-Key: your-admin-key" \
  -d '{"phone": "+71234567890"}'

# List all available tools (shows only public without key)
curl http://localhost:1337/mcp
curl http://localhost:1337/mcp?mcp_key=your-admin-key
```

Response shape:
```json
{ "tool": "loyalty-balance", "result": { "balance": 120 } }
```

Error shape:
```json
{ "error": "description of what went wrong" }
```
