import type { ServerFacts } from "../lib/types";

/**
 * What server this is: the name, the version, the currency, the time zone and the locale.
 *
 * Its own file because three places read it and all three have to agree: the declaration
 * (`describe.ts`, where it is part of the revision), the home card of «Система» (`apps/system.ts`)
 * and whatever asks later. Cached per worker for a minute, like the points — these are settings of
 * the server, and a phone re-reads the declaration anyway when the revision moves.
 */

declare const Settings: any;

const CACHE_MS = 60 * 1000;

let pending: Promise<ServerFacts> | null = null;
let readAt = 0;

async function read(): Promise<ServerFacts> {
  const setting = async (key: string) => {
    const value = await Settings.get(key);
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };
  return {
    name: (await setting("PROJECT_NAME")) ?? "RestoApp",
    version: process.env.CONTAINER_VERSION || process.env.APP_VERSION || process.env.VERSION || null,
    currency: await setting("DEFAULT_CURRENCY_ISO"),
    timezone: (await setting("TZ")) ?? process.env.TZ ?? null,
    locale: await setting("DEFAULT_LOCALE"),
  };
}

export function serverFacts(_sails?: any): Promise<ServerFacts> {
  if (!pending || Date.now() - readAt > CACHE_MS) {
    readAt = Date.now();
    pending = read().catch((error) => {
      pending = null;
      throw error;
    });
  }
  return pending;
}
