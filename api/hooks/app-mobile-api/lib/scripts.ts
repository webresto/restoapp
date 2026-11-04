import { createHash } from "crypto";
import * as fs from "fs";

/**
 * Apps whose code comes from the server as one JS file (`script-apps.plan.md`, D12).
 *
 * A module that owns such an app registers it with `script: { file }` — the built bundle inside the
 * module, exactly as `simple-navigation` hands the admin panel its `assets/adminizer/NavigationManager.js`
 * through adminizer's `ctx.asset()`. The hook reads that file, hashes it, and the declaration carries a
 * **link** and the hash, never the code:
 *
 *   script: { url: "/api/mobile/app-assets/navigation/<sha256>.js", sha256, size, min }
 *
 * The hash is in the URL on purpose: the client keeps what it downloaded under that name, a new build
 * is a new URL, and `immutable` caching is then safe. A script that changes also changes the registry
 * fingerprint, so the declaration revision moves with it and clients re-read `describe` by themselves.
 *
 * The file is looked at again on every declaration (`rereadScript`), so a build that happens while the
 * server runs reaches the clients without a lift.
 */
export const SCRIPT_ROUTE = "/app-assets";

/** What an app registers: the file, and the oldest client that may run it. */
export interface ScriptSource {
  file: string;
  min?: number;
}

/** The file as the hook last saw it: another size or another mtime is another build. */
export interface ScriptStamp {
  size: number;
  mtimeMs: number;
}

/** What the declaration carries and the route serves. */
export interface ScriptAsset {
  app: string;
  file: string;
  url: string;
  sha256: string;
  size: number;
  min: number;
  body: Buffer;
  /** The file at the moment it was read; `rereadScript` compares it with the file on disk. */
  stamp: ScriptStamp | null;
}

export class ScriptError extends Error {}

/** Reads and hashes the bundle of one app. Throws when the file is missing or empty — at start, not in a client. */
export function readScript(app: string, source: ScriptSource, basePath = "/api/mobile"): ScriptAsset {
  let body: Buffer;
  try {
    body = fs.readFileSync(source.file);
  } catch (error) {
    throw new ScriptError(`script of app "${app}" is not readable: ${source.file} (${(error as Error).message})`);
  }
  if (!body.length) throw new ScriptError(`script of app "${app}" is empty: ${source.file}`);
  const sha256 = createHash("sha256").update(body).digest("hex");
  return {
    app,
    file: source.file,
    url: `${basePath}${SCRIPT_ROUTE}/${app}/${sha256}.js`,
    sha256,
    size: body.length,
    min: source.min ?? 1,
    body,
    stamp: stampOf(source.file),
  };
}

function stampOf(file: string): ScriptStamp | null {
  try {
    const stat = fs.statSync(file);
    return { size: stat.size, mtimeMs: stat.mtimeMs };
  } catch {
    return null;
  }
}

function sameStamp(a: ScriptStamp | null, b: ScriptStamp | null): boolean {
  return !!a && !!b && a.size === b.size && a.mtimeMs === b.mtimeMs;
}

/**
 * The bundle read again when the file changed since last time, otherwise the asset given.
 *
 * A module is built while the server runs — `npm run build:mobile` on a stand, an update of the module
 * on a server — and the declaration has to follow the file: a new body is a new hash, a new URL and a
 * new fingerprint, so clients re-read `describe` and download the new code without a lift. A file
 * caught half-written is not taken: esbuild writes in place, so the stamp is read once more after the
 * body, and a file that moved meanwhile keeps the asset that works until the next look.
 */
export function rereadScript(asset: ScriptAsset, basePath?: string): ScriptAsset {
  if (sameStamp(stampOf(asset.file), asset.stamp)) return asset;
  let next: ScriptAsset;
  try {
    next = readScript(asset.app, { file: asset.file, min: asset.min }, basePath);
  } catch {
    return asset;
  }
  return sameStamp(stampOf(asset.file), next.stamp) ? next : asset;
}

/** What the declaration shows of a script: the link and the hash, without the code. */
export function scriptRef(asset: ScriptAsset): { url: string; sha256: string; size: number; min: number } {
  return { url: asset.url, sha256: asset.sha256, size: asset.size, min: asset.min };
}
