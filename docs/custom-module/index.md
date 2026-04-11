# Custom Module Development

- [Overview](#overview)
- [File Structure](./structure.md)
- [Models](./models.md)
- [Bootstrap & Lifecycle](./bootstrap.md)
- [Admin Panel Integration](./adminpanel.md)
- [MCP Tools](./mcp-tools.md)
- [Updating Modules to v2.4](./how-to-update-modules-for-v2.4.md)

---

## Overview

A RestoApp module is a self-contained Sails.js hook installed under the `modules/` directory. The framework discovers and loads all folders there automatically — no registration needed.

Modules can:
- Define their own **Waterline models** (automatically bound to the ORM)
- Run code at **startup** via `config/bootstrap.js`
- Extend the **admin panel** with new model views
- Register **GraphQL resolvers** (via `@webresto/graphql`)
- Register **MCP tools** (via `api/mcp/McpServer`)
- Wait for other hooks before initialising

The `demo-mode` module in `modules/demo-mode/` is the canonical reference implementation — all patterns shown here are taken from it.

---

## Quick start

```bash
# Copy the demo-mode scaffold
cp -r modules/demo-mode modules/my-module

# Edit identity
# → modules/my-module/package.json  (name, appId, hookName)
# → modules/my-module/defaults.js   (default config key)
```

Restart the app — your module loads automatically.

---

## Next steps

| Topic | File |
|-------|------|
| Directory layout and required files | [structure.md](./structure.md) |
| Defining Waterline models | [models.md](./models.md) |
| Startup code and hook lifecycle | [bootstrap.md](./bootstrap.md) |
| Adding pages to the admin panel | [adminpanel.md](./adminpanel.md) |
| Registering MCP tools | [mcp-tools.md](./mcp-tools.md) |
| Updating modules to v2.4 | [how-to-update-modules-for-v2.4.md](./how-to-update-modules-for-v2.4.md) |
