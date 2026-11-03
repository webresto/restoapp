import type { MethodContext } from "./registry";

/**
 * The cursor of a list method: an offset, opaque to the client.
 *
 * An offset and not a keyset, because both lists it serves are read whole and paged in memory —
 * the catalog of a point changes rarely, and the orders of a point are a bounded read until core
 * task C2 gives an order its stops. A keyset cursor belongs with that query, not before it.
 */
export function encodeCursor(offset: number): string {
  return Buffer.from(JSON.stringify({ o: offset })).toString("base64url");
}

export function decodeCursor(cursor: string | undefined, ctx: MethodContext): number {
  if (!cursor) return 0;
  try {
    const offset = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")).o;
    if (Number.isInteger(offset) && offset >= 0) return offset;
  } catch {
    // falls through
  }
  return ctx.fail("invalid", "Bad cursor");
}

/** One page of a list already read and ordered: the items and the cursor of the next page. */
export function page<T>(items: T[], offset: number, size: number): { items: T[]; nextCursor: string | null; total: number } {
  const shown = items.slice(offset, offset + size);
  const next = offset + shown.length;
  return { items: shown, nextCursor: next < items.length ? encodeCursor(next) : null, total: items.length };
}
