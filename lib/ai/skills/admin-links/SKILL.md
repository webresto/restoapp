---
name: admin-links
description: Build admin panel links to model records and app pages. Use whenever the user should open a record or page in the admin panel, e.g. right after a record was created or found.
---

# Admin panel links

Use the `generate_admin_link` tool to build URLs into the Restoapp admin panel.
Never construct admin URLs by hand — routes may be overridden per model or app.

## Usage

- Record edit page: `generate_admin_link({ type: "model", model: "dish", id: "<record id>" })`
- Model list page: `generate_admin_link({ type: "model", model: "dish" })`
- App page: `generate_admin_link({ type: "app", model: "order-kanban" })` — here `model` is an admin page id (stock-manager, order-kanban, notifications-manager, promotions-manager, orders-report, …). The `generate_admin_link` description lists the pages this user may open; admin pages are single views, so `id` is ignored for them.

Typical flow: create or look up a record (e.g. via `query_model_records` or an MCP tool), take its `id`, call `generate_admin_link`, and give the user the link.

## Rules

- Present the result as a markdown link with a human-readable label, e.g. `[Open the dish](<link>)`.
- Include the link in the SAME reply where you mention the record — do not wait for the user to ask for it.
- For several records of the same model, call the tool once and reuse the returned link, replacing only the id segment.
- Links are relative to the admin host. Do not prepend a domain and do not invent absolute URLs.
- If the tool returns an error, say the link cannot be generated for that target instead of guessing.
