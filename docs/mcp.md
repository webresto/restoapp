# MCP Server

RestoApp includes a built-in HTTP server compatible with the [Model Context Protocol](https://modelcontextprotocol.io/).
It exposes the application as a set of **tools** that an AI agent or bot can call over HTTP —
no special SDK required, plain `curl` works fine.

---

## Table of contents

- [How it works](#how-it-works)
- [Endpoints](#endpoints)
- [Authentication](#authentication)
- [Enabling the server](#enabling-the-server)
- [Built-in tools](#built-in-tools)
- [Adding a built-in tool](#adding-a-built-in-tool)
- [Adding a tool from a module](#adding-a-tool-from-a-module)
- [Tool reference](#tool-reference)
- [Testing](#testing)
- [Security notes](#security-notes)

---

## How it works

```
config/http.js
  └─ mounts McpServer.middleware()      ← sets global.mcp, handles /mcp routes

api/bootstrap/mcp-server.js
  └─ auto-loads api/mcp/tools/*.js      ← built-in tools

modules/<name>/config/bootstrap.js
  └─ calls mcp.registerTool(...)        ← module tools
```

1. `api/mcp/McpServer.js` is `require()`-d by `config/http.js` at Sails start.
   It sets `global.mcp` and mounts the Express middleware on `/mcp`.
2. During Sails lift, `api/bootstrap/mcp-server.js` runs and loads every `*.js`
   file found in `api/mcp/tools/`.
3. Modules register their own tools from their own `config/bootstrap.js`.

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/mcp` | Server info + catalogue of all tools visible to the caller |
| `POST` | `/mcp/call/:toolName` | Invoke a tool |

### GET /mcp

Returns JSON with three top-level keys:

```jsonc
{
  "protocol": "mcp",
  "version": "1.0",
  "info": { /* auth status, description */ },
  "endpoints": { /* self-documenting call examples */ },
  "tools": [ /* array of tool descriptors */ ]
}
```

Each tool descriptor includes a ready-to-copy `curl` example under `call.example`.

### POST /mcp/call/:toolName

Request body: JSON object with tool parameters.

```
POST /mcp/call/menu
Content-Type: application/json

{"concept": "origin"}
```

Success response (`200`):

```json
{ "tool": "menu", "result": [ ... ] }
```

Error responses:

| Status | Body | Reason |
|--------|------|--------|
| `404` | `{ "error": "Tool 'x' not found" }` | Unknown tool name |
| `401` | `{ "error": "Admin key required..." }` | Protected tool, no valid key |
| `500` | `{ "error": "<message>" }` | Handler threw an error |

---

## Authentication

Two access modes exist:

| Mode | Who can call | Key required |
|------|-------------|--------------|
| `public` | Anyone | No |
| `protected` | Admin only | `MCP_ADMIN_KEY` |

Pass the admin key in one of two ways:

```bash
# HTTP header
curl /mcp/call/admin-info -H "X-Mcp-Key: <key>"

# Query parameter
curl "/mcp?mcp_key=<key>"
```

Unauthenticated `GET /mcp` shows only public tools.
Authenticated `GET /mcp` shows all tools.

---

## Enabling the server

The MCP server is **disabled by default**. Set environment variables to enable:

```bash
MCP_ENABLED=true        # required — without this no tools are loaded
MCP_ADMIN_KEY=<secret>  # required to access protected tools
```

In development, add them to `.env` or pass inline:

```bash
MCP_ENABLED=true MCP_ADMIN_KEY=dev-secret node restoapp.js
```

Without `MCP_ADMIN_KEY`, protected tools are registered but always return `401`.

---

## Built-in tools

Built-in tools live in `api/mcp/tools/`. They are auto-loaded at startup.

| Tool | Mode | Description |
|------|------|-------------|
| `health` | public | Uptime, memory, timestamp |
| `menu` | public | Top-level menu groups |
| `group` | public | Single group with children and dishes |
| `dishes` | public | Dishes in a group |
| `dish` | public | Single dish by ID or slug |
| `admin-info` | protected | Env, version, Node.js, PID |
| `modules-info` | protected | Installed modules list |
| `upload-image` | protected | Upload image to `assets/uploads/` |

---

## Adding a built-in tool

Built-in tools belong to the core app (not a module). Add them to `api/mcp/tools/`.

### 1. Create the file

```
api/mcp/tools/
└── my-tool.js     ← one file per logical group of tools
```

### 2. Export a register function

Every tool file must export a single function that receives `mcp` and calls
`mcp.registerTool()` for each tool it defines:

```js
// api/mcp/tools/my-tool.js
'use strict';

module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'my-tool',
    description: 'One-line description shown in GET /mcp.',
    mode: 'public',           // or 'protected'
    schema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query.',
          example: 'pizza',   // used in auto-generated curl snippet
        },
      },
      required: ['query'],
    },
    handler: async ({ query }) => {
      // return any JSON-serialisable value
      return await SomeModel.find({ name: { contains: query } });
    },
  });
};
```

The file is picked up automatically on the next app start — no registration needed.

### 3. registerTool fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | yes | Unique tool identifier. Used in the URL: `/mcp/call/<name>` |
| `description` | `string` | yes | Human-readable description shown in `GET /mcp` |
| `mode` | `'public'\|'protected'` | yes | Access control |
| `schema` | JSON Schema object | no | Describes accepted parameters |
| `handler` | `async (params, ctx) => any` | yes | Tool logic |

### 4. Handler signature

```js
handler: async (params, ctx) => {
  // params — parsed request body (plain object)
  // ctx    — { req, res } Express objects (rarely needed)
  return <any serialisable value>;
}
```

- **Return value** is wrapped in `{ tool, result }` and sent as JSON.
- **Throw an Error** to return `500` with `{ error: "<message>" }`.
- Errors are caught automatically — no need to wrap in try/catch unless you
  want to log or transform them.

### 5. Schema and example values

`schema` is a standard [JSON Schema](https://json-schema.org/) object.
It is returned in `GET /mcp` so clients know what to send.

Add `example` to each property — it becomes the body in the auto-generated
`curl` snippet:

```js
schema: {
  type: 'object',
  properties: {
    id:     { type: 'string',  description: 'Record ID.',   example: 'abc123' },
    limit:  { type: 'integer', description: 'Max results.', example: 10 },
    active: { type: 'boolean', description: 'Filter.',      example: true },
  },
  required: ['id'],
},
```

Fallback placeholders when `example` is omitted:

| JSON Schema type | Placeholder |
|-----------------|-------------|
| `string` | `"<fieldName>"` |
| `string` + `enum` | first enum value |
| `integer` / `number` | `0` |
| `boolean` | `true` |
| `array` | `[]` |
| `object` | `{}` |

### 6. Multiple tools in one file

One file can register multiple tools — useful when they share a data domain:

```js
module.exports = function register(mcp) {
  mcp.registerTool({ name: 'orders-list',   mode: 'protected', /* ... */ });
  mcp.registerTool({ name: 'orders-update', mode: 'protected', /* ... */ });
};
```

### 7. Accessing Sails models and globals

Inside a handler, all Sails globals are available (`sails`, model names, `_`, etc.)
exactly as in any controller or service:

```js
handler: async ({ groupId }) => {
  return await Dish.find({ parentGroup: groupId, enable: true });
},
```

Log errors with `sails.log`:

```js
handler: async (params) => {
  try {
    return await SomeModel.doSomething(params);
  } catch (err) {
    sails.log.error('MCP > [my-tool]', err);
    throw err;
  }
},
```

---

## Adding a tool from a module

Module tools are registered from the module's own bootstrap. See
[custom-module/mcp-tools.md](./custom-module/mcp-tools.md) for the full guide.

Short version:

```js
// modules/my-module/config/bootstrap.js
module.exports.default = async function (sails) {
  if (process.env.MCP_ENABLED !== 'true') return;

  mcp.registerTool({
    name: 'my-module-status',
    description: 'Returns status from my-module.',
    mode: 'public',
    schema: { type: 'object', properties: {} },
    handler: async () => ({ ok: true }),
  });
};
```

`mcp` is a global — no `require()` needed.

---

## Tool reference

### Calling tools

```bash
# Public tool — no key needed
curl -X POST http://localhost:1337/mcp/call/menu \
  -H "Content-Type: application/json" \
  -d '{"concept": "origin"}'

# Protected tool — pass key in header
curl -X POST http://localhost:1337/mcp/call/admin-info \
  -H "Content-Type: application/json" \
  -H "X-Mcp-Key: your-admin-key"

# Protected tool — pass key in query
curl -X POST "http://localhost:1337/mcp/call/admin-info?mcp_key=your-admin-key" \
  -H "Content-Type: application/json"

# List all tools (public only without key)
curl http://localhost:1337/mcp

# List all tools (including protected)
curl "http://localhost:1337/mcp?mcp_key=your-admin-key"
```

### Menu upload and group assignment (important)

When importing or mass-updating menu data via MCP:

- For dishes, canonical storage field is `parentGroup`.
- `dish-update` accepts all aliases: `group`, `groupId`, `parentGroup`.
- `dish-list` accepts `groupId` or `parentGroup` filters.
- For groups, parent category field is `parentGroup`.

Preferred payload for moving a dish:

```json
{ "id": "dish-id", "parentGroup": "target-group-id" }
```

Recommended safe flow for bulk menu load:

1. Resolve target group IDs first (`group-list` / `group-get`).
2. Apply updates with `dish-update` using `parentGroup` (or legacy aliases).
3. Verify each batch:
   - `dish-get` for spot checks (`result.parentGroup` must match target group id).
   - `dish-list` with `groupId=<target-group-id>` (or `parentGroup=<target-group-id>`) to confirm dish appears in the expected category.
4. Re-query ungrouped dishes and rerun only for unresolved rows.

### Internal calls (server-side)

Invoke a tool from server-side code without going through HTTP:

```js
const result = await mcp.callTool('menu', { concept: 'origin' });
```

`callTool` bypasses HTTP and admin-key checks — intended for trusted server-side
callers such as an AI agent acting on behalf of an admin user.

### Listing tools programmatically

```js
const publicTools  = mcp.listTools('public');
const allTools     = mcp.listTools('all');
```

---

## Testing

Tests live in `tests/mcp.test.ts`. Run them with:

```bash
npm test
```

### What is tested

- `registerTool` — validation (duplicate name, invalid mode, missing handler)
- `GET /mcp` — response shape, public/protected visibility, auth status
- `POST /mcp/call/:tool` — success, 404, 401, 500
- Schema example generation — all JSON Schema types and `example` override

### Writing tests for a new tool

Use the helpers already in `tests/mcp.test.ts`:

```ts
import { expect } from 'chai';

function requireFreshMcp() {
  delete require.cache[require.resolve('../api/mcp/McpServer')];
  return require('../api/mcp/McpServer');
}

describe('my-tool', function () {
  let mcp: any;

  beforeEach(function () {
    mcp = requireFreshMcp();
    // register only the tools you need for this suite
    require('../api/mcp/tools/my-tool')(mcp);
  });

  it('returns expected result', async function () {
    const result = await mcp.callTool('my-tool', { query: 'test' });
    expect(result).to.be.an('array');
  });
});
```

`requireFreshMcp()` clears the module cache so each suite gets an empty tool
registry — tests do not bleed into each other.

---

## Security notes

- **Never expose `MCP_ADMIN_KEY` in client-side code or public repositories.**
- Protected tools should be used for anything that reads sensitive data or
  triggers side effects (writes, uploads, restarts).
- The key is checked on every request — there is no session or token refresh.
- If `MCP_ADMIN_KEY` is not set, protected tools are registered but always
  return `401`. Set it explicitly in production.
- `MCP_ENABLED` defaults to `false` — the server is opt-in.
