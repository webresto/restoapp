import { Request, Response } from "express";
import type { MobileApiRuntime } from "../app";
import { authenticate } from "../../lib/auth/device";
import { MobileError } from "../../lib/errors";

/**
 * GET /api/mobile/app-assets/:app/:file — the JS bundle of an app that comes as a script.
 *
 * The same shape adminizer serves its app assets with (`/admin/app-assets/<app>/<id>/<file>`,
 * `AssetHandler`), with two differences: the file is named by its sha256, and a device token is
 * required. The hash in the name is what makes the long cache safe — a new build is a new URL, and
 * a hash the registry does not know is 404 rather than some older file.
 */
export default function scriptRoute(runtime: MobileApiRuntime) {
  return async (req: Request, res: Response) => {
    await authenticate(runtime, req.get("authorization"));
    const file = String(req.params.file ?? "");
    const hash = file.endsWith(".js") ? file.slice(0, -3) : "";
    const asset = /^[0-9a-f]{64}$/.test(hash) ? runtime.registry.scriptByHash(String(req.params.app), hash) : undefined;
    if (!asset) throw new MobileError("not_found", "No such script");
    res.set("Content-Type", "application/javascript; charset=utf-8");
    res.set("Cache-Control", "private, max-age=31536000, immutable");
    res.set("ETag", `"${asset.sha256}"`);
    res.set("X-Mobile-Script-Sha256", asset.sha256);
    return res.send(asset.body);
  };
}
