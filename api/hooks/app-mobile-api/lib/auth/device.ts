import { createHash, randomBytes, randomUUID } from "crypto";
import type { AccessPort, DeviceRecord, DeviceStore, PanelUser, UsersPort } from "../types";
import { PANEL_TOKEN } from "../access";
import { fail } from "../errors";

const DAY = 24 * 60 * 60 * 1000;
/** Unused for 30 days — gone. */
export const DEVICE_IDLE_MS = 30 * DAY;
/** Whatever the use — gone after 90 days. */
export const DEVICE_LIFETIME_MS = 90 * DAY;
export const DEVICES_PER_USER = 10;
/** lastSeenAt is written at most once a minute. */
const TOUCH_EVERY_MS = 60 * 1000;

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * A fingerprint of the password hash at the moment of issue. A changed password changes it, so every
 * device of the user stops working without a hook in adminizer; the hash itself is not copied.
 */
export function passwordFingerprint(user: PanelUser): string {
  return createHash("sha256").update(`mobile-api:${user.passwordHashed ?? ""}`).digest("hex");
}

export interface Session {
  user: PanelUser;
  device: DeviceRecord;
}

export interface DeviceDeps {
  devices: DeviceStore;
  users: UsersPort;
  access: AccessPort;
  now(): number;
}

/** Why a user may not be in, or null: the checks of the web login, repeated on every request. */
export async function accountProblem(deps: Pick<DeviceDeps, "users" | "access" | "now">, user: PanelUser): Promise<string | null> {
  if (user.isDeleted === true) return "Profile is deleted";
  if (user.isActive === false) return "Profile is disabled, contact the administrator";
  if (deps.users.confirmationRequired() && !user.isConfirmed && !user.isAdministrator) {
    return "Profile is not confirmed, please contact to administrator";
  }
  if (user.expires && deps.now() > Date.parse(user.expires)) return "Profile expired, contact the administrator";
  if (!(await deps.access.checkPermission(PANEL_TOKEN, user))) {
    return "The user is not allowed to enter, please contact the administrator";
  }
  return null;
}

/** Issues a token for a new device; beyond 10 devices the oldest one is revoked. */
export async function issueDevice(
  deps: DeviceDeps,
  user: PanelUser,
  device: { name: string; platform: string },
): Promise<{ token: string; device: Omit<DeviceRecord, "createdAt"> }> {
  const token = randomBytes(32).toString("base64url");
  const now = deps.now();
  const record = {
    id: randomUUID(),
    tokenHash: hashToken(token),
    user: user.id,
    name: device.name,
    platform: device.platform,
    passwordFingerprint: passwordFingerprint(user),
    lastSeenAt: now,
    expiresAt: now + DEVICE_LIFETIME_MS,
    revoked: false,
  };
  await deps.devices.create(record);

  const active = await deps.devices.listActive(user.id);
  for (const stale of active.slice(0, Math.max(0, active.length - DEVICES_PER_USER))) {
    await deps.devices.revoke(stale.id);
  }
  return { token, device: record };
}

export function bearerToken(header: unknown): string | null {
  if (typeof header !== "string") return null;
  const match = /^Bearer\s+([A-Za-z0-9_-]{20,200})$/.exec(header.trim());
  return match ? match[1] : null;
}

/**
 * Bearer → device → user, re-checked on every request: the device is not revoked or expired, the
 * user is still active and may enter the panel, the password has not changed. Any failure is a 401 —
 * the client goes to the login screen.
 */
export async function authenticate(deps: DeviceDeps, authorization: unknown): Promise<Session> {
  const token = bearerToken(authorization);
  if (!token) fail("unauthorized", "No token");

  const device = await deps.devices.findByTokenHash(hashToken(token));
  if (!device || device.revoked) fail("unauthorized", "Device is signed out");

  const now = deps.now();
  if (now > device.expiresAt || now - device.lastSeenAt > DEVICE_IDLE_MS) fail("unauthorized", "Session expired");

  const user = await deps.users.findById(device.user);
  if (!user) fail("unauthorized", "User not found");
  if (passwordFingerprint(user) !== device.passwordFingerprint) {
    await deps.devices.revoke(device.id);
    fail("unauthorized", "Password was changed");
  }
  const problem = await accountProblem(deps, user);
  if (problem) fail("unauthorized", problem);

  if (now - device.lastSeenAt >= TOUCH_EVERY_MS) {
    await deps.devices.touch(device.id, now);
    device.lastSeenAt = now;
  }
  return { user, device };
}
