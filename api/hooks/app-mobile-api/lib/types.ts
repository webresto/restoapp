/**
 * Everything the mobile API needs from the outside world, as plain interfaces.
 *
 * The Express application (`http/app.ts`) and the logic under `lib/` see only these. The one place
 * that knows Sails, adminizer and Waterline is `adapters/sails.ts`, which builds them; tests build
 * them from memory. Moving the API into a separate service or into adminizer means another adapter.
 */

/** An adminizer user with its groups, as adminizer itself loads it for the web. */
export interface PanelUser {
  id: string | number;
  login: string;
  fullName?: string | null;
  isAdministrator?: boolean;
  isActive?: boolean | null;
  isDeleted?: boolean | null;
  isConfirmed?: boolean | null;
  expires?: string | null;
  passwordHashed?: string | null;
  groups?: Array<{ name: string; tokens?: unknown[] | null }>;
}

export interface PlaceInfo {
  id: string;
  title: string;
  address: string | null;
  isCookingPoint: boolean;
  isPickupPoint: boolean;
  /**
   * Not a `Place` of the server but an option of the app's token that the app treats as a point —
   * «Без кухни» of «Заказы» (`places.options`). Its `title` is a translation key, not data.
   */
  virtual?: boolean;
}

export interface ServerFacts {
  name: string;
  version: string | null;
  currency: string | null;
  timezone: string | null;
  locale: string | null;
}

export interface UsersPort {
  findByLogin(login: string): Promise<PanelUser | null>;
  /** Fresh from the database with groups, on every request. */
  findById(id: string | number): Promise<PanelUser | null>;
  /** Exactly the check of the web login. */
  verifyPassword(user: PanelUser, login: string, password: string): boolean;
  confirmationRequired(): boolean;
}

/** adminizer's access rights helper: the only source of truth about rights. */
export interface AccessPort {
  checkPermission(token: string, user: PanelUser, context?: Record<string, unknown>): Promise<boolean>;
  /** Option ids a contextual token grants through the user's groups; null — all of them (administrator). */
  getPermissionRights(token: string, user: PanelUser): string[] | null;
}

export interface PlacesPort {
  /** Enabled points, cached by the adapter. */
  list(): Promise<PlaceInfo[]>;
}

export interface DeviceRecord {
  id: string;
  tokenHash: string;
  user: string | number;
  name: string;
  platform: string;
  passwordFingerprint: string;
  createdAt: number;
  lastSeenAt: number;
  expiresAt: number;
  revoked: boolean;
}

export interface DeviceStore {
  create(record: Omit<DeviceRecord, "createdAt">): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<DeviceRecord | null>;
  /** Not revoked, oldest first. */
  listActive(user: string | number): Promise<DeviceRecord[]>;
  touch(id: string, at: number): Promise<void>;
  revoke(id: string): Promise<void>;
}

export interface PowUseStore {
  /** false — the task was used already (a replay). */
  markUsed(id: string, label: string, expiresAt: number): Promise<boolean>;
}

export interface AttemptStore {
  record(label: string, ok: boolean, at: number): Promise<void>;
  count(label: string, since: number, onlyFailures?: boolean): Promise<number>;
}

export interface PuzzlePort {
  /** crypto-puzzle 5: the archive the client has to solve to get `message` back. */
  generate(message: string, durationMs: number): Promise<Uint8Array>;
}

export interface AuditEvent {
  method: string;
  user: string | number;
  device: string;
  place: string | null;
  record: string | null;
  params: Record<string, unknown>;
  ip: string | null;
  ok: boolean;
  error?: string;
}

export interface Logger {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

export interface MobileApiSettings {
  /** MOBILE_API_ENABLED: routes and login answer `unavailable` while off. */
  enabled(): boolean;
  /** Secret of captcha signatures; shared by all workers. undefined — login is unavailable. */
  secret(): string | undefined;
  requireHttps(): boolean;
  captchaEnabled(): boolean;
  captchaBaseDifficultyMs(): number;
  /** Express "trust proxy" — the same value as Sails, see config/http.js. */
  trustProxy: unknown;
}
