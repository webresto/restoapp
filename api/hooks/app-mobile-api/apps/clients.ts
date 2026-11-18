import type { MethodContext, MobileApiRegistry } from "../lib/registry";
import { decodeCursor, page } from "../lib/cursor";

/**
 * «Клиенты» — the Customers of the admin panel, on the phone: who is calling, what they ordered,
 * where they live.
 *
 * The model is core's `user`, which the panel binds as «Customers»
 * (`core/lib/adminpanel/models/bind.ts`), so the rights are the model rights of adminizer and
 * nothing of our own: `read-customer-model` to look, `create-customer-model` to add. A member of
 * staff who may not read customers in the web may not read them here either.
 *
 * Search by number goes through `AuthIdentity` (`provider: "phone"`, `externalId` — the normalized
 * digits), because that is where a phone lives now; `user.phone` is a json projection its own model
 * calls deprecated and would not be searchable anyway. Creating goes through
 * `AuthService.materializeUser` — the one factory core itself uses for a guest at `DONE` — so the
 * same number never makes a second profile.
 */

export interface ClientItem {
  id: string;
  /** Full name, or the number when there is no name yet — never empty, it is the row's title. */
  title: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  /** The phone identity is proven: the person passed an OTP with it. */
  verified: boolean;
  orderCount: number;
  /** Epoch milliseconds. */
  createdAt: number;
}

export interface ClientCard extends ClientItem {
  /** Saved addresses, one line each (`UserLocation.formatted`). */
  addresses: string[];
  /** Recent orders, newest first: "№1234 · 12.05 · 1 200 ₽ · Доставлен". */
  orders: string[];
}

export interface ClientsPort {
  /** Newest first; `q` — digits of a number or part of a name. */
  list(options: { q?: string }): Promise<ClientItem[]>;
  get(id: string): Promise<ClientCard | null>;
  /** Finds by number or creates; the same number always answers with the same person. */
  create(input: { name: string; phone: string; email?: string }): Promise<ClientItem>;
}

export const PAGE_SIZE = 50;

/**
 * The model rights of adminizer for the resource core binds as «Customers» — `Customer` in
 * `config.adminpanel.models`, whose underlying model is `user`. Adminizer makes one token per
 * resource name and lowercases it (`registerModelTokens`, `registerToken`), so the ids are
 * `read-customer-model` and `create-customer-model` — the same ones the group form shows under
 * «Model Customer», and the same ones the web list of customers is checked against.
 */
const read = { token: "read-customer-model" };
const create = { tokens: ["read-customer-model", "create-customer-model"] };

/** Material Symbols "person", 24×24. */
const ICON =
  "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";

const FIELDS = [
  { name: "phone", title: "mobile.clients.field.phone", format: "phone", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "email", title: "mobile.clients.field.email", format: "text", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "verified", title: "mobile.clients.field.verified", format: "boolean", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "orderCount", title: "mobile.clients.field.orderCount", format: "number", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "createdAt", title: "mobile.clients.field.createdAt", format: "datetime", readonly: true, section: "mobile.clients.section.contacts" },
  { name: "addresses", title: "mobile.clients.field.addresses", format: "text", readonly: true, section: "mobile.clients.section.addresses" },
  { name: "orders", title: "mobile.clients.field.orders", format: "text", readonly: true, section: "mobile.clients.section.orders" },
];

/** A number as typed: digits, a leading plus, spaces, dashes and brackets of a printed form. */
const PHONE_PATTERN = "^[+]?[0-9 ()-]{5,20}$";

export function registerClients(registry: MobileApiRegistry, clients: ClientsPort): void {
  registry.registerApp({
    id: "clients",
    version: "1.0.0",
    title: "mobile.app.clients.title",
    icon: { path: ICON },
    category: "mobile.category.restaurant",
    home: "clients.list",
    scope: "server",
    models: { client: { fields: FIELDS } },
  });

  registry.registerMethod({
    name: "clients.list",
    app: "clients",
    kind: "query",
    title: "mobile.clients.list.title",
    access: read,
    model: "client",
    input: {
      type: "object",
      properties: {
        q: { type: "string", maxLength: 100 },
        cursor: { type: "string", maxLength: 200 },
      },
    },
    ui: {
      view: "list",
      item: { title: "title", subtitle: "phone", meta: "createdAt", value: "orderCount" },
      search: "q",
      open: "clients.get",
      empty: "mobile.clients.empty",
    },
    handler: async (params: { q?: string; cursor?: string }, ctx) => {
      const offset = decodeCursor(params.cursor, ctx);
      const rows = await clients.list({ q: params.q?.trim() || undefined });
      return page(rows, offset, PAGE_SIZE);
    },
  });

  registry.registerMethod({
    name: "clients.get",
    app: "clients",
    kind: "query",
    title: "mobile.clients.get.title",
    access: read,
    model: "client",
    input: { type: "object", required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 100 } } },
    ui: { view: "detail", item: { title: "title", subtitle: "phone" } },
    handler: async ({ id }: { id: string }, ctx) => {
      const item = await clients.get(id);
      if (!item) return ctx.fail("not_found", "No such customer");
      return { item };
    },
  });

  registry.registerMethod({
    name: "clients.create",
    app: "clients",
    kind: "mutation",
    title: "mobile.clients.create.title",
    access: create,
    input: {
      type: "object",
      required: ["name", "phone"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 100, title: "mobile.clients.input.name" },
        phone: { type: "string", pattern: PHONE_PATTERN, title: "mobile.clients.input.phone", "x-format": "phone" },
        email: { type: "string", maxLength: 200, title: "mobile.clients.input.email" },
      },
    },
    // On the list screen, not on a row: it makes a customer rather than changing one.
    ui: { view: "action", on: "list", placement: ["list"], control: { type: "form" } },
    handler: async (params: { name: string; phone: string; email?: string }, ctx: MethodContext) => {
      const item = await clients.create({ name: params.name.trim(), phone: params.phone, email: params.email?.trim() || undefined });
      if (!item) return ctx.fail("internal", "The customer was not created");
      return { item };
    },
    // The number is the person: it is in the journal of the order anyway, but not in the audit.
    audit: (_params, result: { item?: ClientItem }) => ({ record: result?.item?.id ?? null, params: {} }),
  });
}
