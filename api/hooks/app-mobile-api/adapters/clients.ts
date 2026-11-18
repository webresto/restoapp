import type { ClientCard, ClientItem, ClientsPort } from "../apps/clients";

/**
 * «Клиенты» on core's own models and functions.
 *
 * A number is searched in `AuthIdentity` — `provider: "phone"`, `externalId` the normalized digits,
 * the logical unique key of a person — and a name in `user`. Creating goes through
 * `AuthService.materializeUser`, the single factory core uses for a guest at `DONE`
 * (`models/Order.ts`), so a number that is already somebody's answers with that somebody instead of
 * forking a second profile. Nothing here writes a proof: a number typed by an operator is a claim,
 * exactly as a number typed into a checkout form is.
 */

declare const User: any;
declare const AuthIdentity: any;
declare const UserLocation: any;
declare const Order: any;

const CORE = "@webresto/core";
const authService = () => require(`${CORE}/lib/AuthService`).default ?? require(`${CORE}/lib/AuthService`);
/** The one place that turns a typed number into `{code, number}` — shared with the auth providers. */
const splitPhone = (raw: string) => require(`${CORE}/lib/phone`).splitPhone(raw);

/** As many as a search answers with; the client pages what it gets. */
const SEARCH_LIMIT = 200;
/** Recent orders shown on a card. */
const ORDERS_ON_CARD = 10;

function digitsOf(value: string): string {
  return value.replace(/\D/g, "");
}

function phoneString(user: any): string | null {
  const phone = user?.phone;
  if (!phone || typeof phone !== "object") return null;
  const code = String(phone.code ?? "").trim();
  const number = String(phone.number ?? "").trim();
  if (!number) return null;
  return code ? `${code.startsWith("+") ? "" : "+"}${code} ${number}` : number;
}

function nameOf(user: any): string {
  return [user?.firstName, user?.lastName].filter((part) => typeof part === "string" && part.trim()).join(" ").trim();
}

function toItem(user: any): ClientItem {
  const phone = phoneString(user);
  return {
    id: String(user.id),
    title: nameOf(user) || phone || String(user.id),
    firstName: user.firstName || null,
    lastName: user.lastName || null,
    phone,
    email: user.email || null,
    verified: Boolean(user.verified),
    orderCount: Number(user.orderCount) || 0,
    createdAt: Number(user.createdAt) || 0,
  };
}

/** "№1234 · 12.05.2026 · 1 200 · Доставлен" — one line per order, as the card lists them. */
function orderLine(order: any): string {
  const number = order.rmsOrderNumber || order.shortId || String(order.id).slice(0, 8);
  const at = Number(order.orderedAt) ? new Date(Number(order.orderedAt) * 1000) : new Date(Number(order.createdAt) || 0);
  const date = Number.isFinite(at.getTime()) ? at.toISOString().slice(0, 10) : "";
  return [`№${number}`, date, order.total ?? 0, order.state].filter((part) => part !== "" && part !== null).join(" · ");
}

export function coreClients(): ClientsPort {
  return {
    async list({ q }) {
      const where: any = { isDeleted: false };
      if (q) {
        const digits = digitsOf(q);
        const byName = [{ firstName: { contains: q } }, { lastName: { contains: q } }, { email: { contains: q } }];
        if (digits.length >= 3) {
          // The number is the identity, not the json projection on `user`: the identity holds the
          // digits and is the only searchable form of a phone (`models/AuthIdentity.ts`).
          const identities = await AuthIdentity.find({
            where: { provider: "phone", externalId: { contains: digits } },
            limit: SEARCH_LIMIT,
          });
          const owners = identities.map((identity: any) => String(identity.user)).filter(Boolean);
          if (owners.length) where.or = [...byName, { id: { in: owners } }];
          else where.or = byName;
        } else {
          where.or = byName;
        }
      }
      const rows = await User.find({ where, sort: "createdAt DESC", limit: SEARCH_LIMIT });
      return rows.map(toItem);
    },

    async get(id) {
      const user = await User.findOne({ id });
      if (!user || user.isDeleted) return null;
      const [locations, orders] = await Promise.all([
        UserLocation.find({ where: { user: String(user.id) }, sort: "createdAt DESC" }).catch(() => []),
        Order.find({ where: { user: String(user.id), state: { "!=": ["NEW", "CART", "CHECKOUT"] } }, sort: "createdAt DESC", limit: ORDERS_ON_CARD }).catch(() => []),
      ]);
      const card: ClientCard = {
        ...toItem(user),
        addresses: locations.map((location: any) => location.formatted).filter(Boolean),
        orders: orders.map(orderLine),
      };
      return card;
    },

    async create({ name, phone, email }) {
      const { user } = await authService().materializeUser({
        firstName: name,
        phone: splitPhone(phone),
        ...(email ? { email } : {}),
      });
      return toItem(await User.findOne({ id: user.id }));
    },
  };
}
