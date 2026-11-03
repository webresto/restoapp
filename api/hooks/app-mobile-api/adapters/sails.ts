import * as fs from "fs";
import * as path from "path";
import { pathToFileURL } from "url";
import type { MobileApiDeps } from "../http/app";
import type {
  AttemptStore,
  DeviceRecord,
  DeviceStore,
  MobileApiSettings,
  PanelUser,
  PlaceInfo,
  PowUseStore,
  PuzzlePort,
  ServerFacts,
} from "../lib/types";
import { MobileError } from "../lib/errors";
import type { MobileApiRegistry } from "../lib/registry";
import type { Translator } from "../lib/i18n";
import { coreAudit } from "./audit";

/**
 * The only place that knows Sails, adminizer and Waterline: builds the deps of the Express
 * application from them. Moving the API out of Sails means writing another one of these.
 */

declare const MobileDevice: any;
declare const MobilePowUse: any;
declare const MobileAuthAttempt: any;
declare const Place: any;
declare const Settings: any;
declare const emitter: any;

/** Points and server facts are read at most once a minute per worker, and at once after a change here. */
const CACHE_MS = 60 * 1000;

function flag(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return !["false", "0", "no", "off"].includes(value.trim().toLowerCase());
}

export function readSettings(sails: any): MobileApiSettings {
  return {
    enabled: () => flag(process.env.MOBILE_API_ENABLED, false),
    // Read on use: core mirrors JWT_SECRET from the database into the environment after start,
    // and the database is what all workers of the cluster share.
    secret: () => process.env.MOBILE_API_SECRET || process.env.JWT_SECRET || undefined,
    requireHttps: () => flag(process.env.MOBILE_API_REQUIRE_HTTPS, process.env.NODE_ENV === "production"),
    // The switch of the web login (config/adminpanel.js): only an explicit "false" turns it off.
    captchaEnabled: () => (process.env.ENABLE_ADMIN_CAPTCHA ?? "true").toLowerCase() !== "false",
    captchaBaseDifficultyMs: () => Number(process.env.CAPTCHA_POW_DIFFICULTY) || 3000,
    trustProxy: sails.config.http?.trustProxy ?? false,
  };
}

function adminizerOf(sails: any): any {
  const adminizer = sails.hooks.adminpanel?.adminizer;
  if (!adminizer) throw new MobileError("unavailable", "Admin panel is not loaded");
  return adminizer;
}

/** A module the way adminizer itself resolves it, so the web and the app use the same copy. */
function resolveFromAdminizer(name: string): string {
  const adminizerDir = path.dirname(require.resolve("adminizer"));
  return require.resolve(name, { paths: [adminizerDir] });
}

/**
 * crypto-puzzle 5 — the generator of adminizer's web CAPTCHA. The root of node_modules may hold
 * version 4 (core's dependency, another format), so it is taken from where adminizer finds it.
 */
export function cryptoPuzzle(): PuzzlePort {
  let loaded: Promise<any> | null = null;
  const load = () => {
    loaded ??= (async () => {
      const entry = resolveFromAdminizer("crypto-puzzle");
      let dir = path.dirname(entry);
      while (!fs.existsSync(path.join(dir, "package.json"))) dir = path.dirname(dir);
      const { version } = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf8"));
      if (Number(String(version).split(".")[0]) < 5) throw new Error(`crypto-puzzle ${version} found, 5.x expected`);
      return (await import(pathToFileURL(entry).href)).default;
    })();
    return loaded;
  };
  return {
    async generate(message, durationMs) {
      const Puzzle = await load();
      return Puzzle.generate({ message, duration: durationMs });
    },
  };
}

function toDevice(row: any): DeviceRecord {
  return {
    id: row.id,
    tokenHash: row.tokenHash,
    user: typeof row.user === "object" && row.user !== null ? row.user.id : row.user,
    name: row.name ?? "",
    platform: row.platform ?? "",
    passwordFingerprint: row.passwordFingerprint,
    createdAt: Number(row.createdAt),
    lastSeenAt: Number(row.lastSeenAt),
    expiresAt: Number(row.expiresAt),
    revoked: Boolean(row.revoked),
  };
}

export const waterlineDevices: DeviceStore = {
  async create(record) {
    await MobileDevice.create(record);
  },
  async findByTokenHash(tokenHash) {
    const row = await MobileDevice.findOne({ tokenHash });
    return row ? toDevice(row) : null;
  },
  async listActive(user) {
    const rows = await MobileDevice.find({ where: { user, revoked: false }, sort: "createdAt ASC" });
    return rows.map(toDevice);
  },
  async touch(id, at) {
    await MobileDevice.updateOne({ id }, { lastSeenAt: at });
  },
  async revoke(id) {
    await MobileDevice.updateOne({ id }, { revoked: true });
  },
};

export const waterlinePowUses: PowUseStore = {
  async markUsed(id, label, expiresAt) {
    try {
      await MobilePowUse.create({ id, label, expiresAt });
      return true;
    } catch (error: any) {
      if (error?.code === "E_UNIQUE") return false;
      throw error;
    }
  },
};

export const waterlineAttempts: AttemptStore = {
  async record(label, ok, at) {
    await MobileAuthAttempt.create({ label, ok, at });
  },
  async count(label, since, onlyFailures = false) {
    return MobileAuthAttempt.count({ label, at: { ">=": since }, ...(onlyFailures ? { ok: false } : {}) });
  },
};

/** Deletes what nobody will ask for again; runs in the primary worker only. */
export async function cleanup(now: number): Promise<void> {
  await MobilePowUse.destroy({ expiresAt: { "<": now } });
  await MobileAuthAttempt.destroy({ at: { "<": now - 24 * 60 * 60 * 1000 } });
  await MobileDevice.destroy({ expiresAt: { "<": now - 30 * 24 * 60 * 60 * 1000 } });
}

function cached<T>(load: () => Promise<T>): { get(): Promise<T>; reset(): void } {
  let value: Promise<T> | null = null;
  let at = 0;
  return {
    get() {
      if (!value || Date.now() - at > CACHE_MS) {
        at = Date.now();
        value = load().catch((error) => {
          value = null;
          throw error;
        });
      }
      return value;
    },
    reset() {
      value = null;
    },
  };
}

export function createSailsDeps(sails: any, registry: MobileApiRegistry, translator: Translator): MobileApiDeps {
  const userModel = () => adminizerOf(sails).modelHandler.internal("auth").get("User");
  const passwordHash = () => require(resolveFromAdminizer("password-hash"));

  const places = cached<PlaceInfo[]>(async () => {
    const rows = await Place.find({ where: { enable: true }, sort: "title ASC" });
    return rows.map((place: any) => ({
      id: String(place.id),
      title: place.title || String(place.id),
      address: place.address || null,
      isCookingPoint: Boolean(place.isCookingPoint),
      isPickupPoint: Boolean(place.isPickupPoint),
    }));
  });
  // Only the worker where the point changed hears it; the others re-read within a minute.
  try {
    emitter.on("core:place-changed", "app-mobile-api", () => places.reset());
  } catch (error) {
    sails.log.warn("mobile API: cannot follow core:place-changed, points refresh once a minute", error);
  }

  const facts = cached<ServerFacts>(async () => {
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
  });

  return {
    settings: readSettings(sails),
    registry,
    translator,
    users: {
      findByLogin: async (login) => (await userModel().findOne({ where: { login } })) as PanelUser | null,
      findById: async (id) => (await userModel().findOne({ where: { id } })) as PanelUser | null,
      verifyPassword: (user, login, password) =>
        passwordHash().verify(login + password + process.env.AP_PASSWORD_SALT, user.passwordHashed),
      confirmationRequired: () => Boolean(adminizerOf(sails).config.registration?.confirmationRequired),
    },
    access: {
      checkPermission: (token, user, context) => adminizerOf(sails).accessRightsHelper.checkPermission(token, user, context),
      getPermissionRights: (token, user) => adminizerOf(sails).accessRightsHelper.getPermissionRights(token, user),
    },
    places: { list: () => places.get() },
    facts: () => facts.get(),
    devices: waterlineDevices,
    powUses: waterlinePowUses,
    attempts: waterlineAttempts,
    puzzle: cryptoPuzzle(),
    audit: coreAudit,
    log: sails.log,
    now: () => Date.now(),
  };
}
