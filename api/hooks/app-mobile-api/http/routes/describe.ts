import { Request, Response } from "express";
import type { MobileApiRuntime } from "../app";
import { authenticate } from "../../lib/auth/device";
import { computeRevision } from "../../lib/describe";
import { makeContext } from "../../lib/call";

/** GET /api/mobile/describe?lang=ru — the apps, methods, schemas and points of this user. */
export default function describeRoute(runtime: MobileApiRuntime) {
  return async (req: Request, res: Response) => {
    const session = await authenticate(runtime, req.get("authorization"));
    const lang = await runtime.lang(req);
    const revision = await computeRevision(runtime, session.user);
    const declaration = await runtime.declarations.build(session.user, lang, revision, makeContext(runtime, session, lang));
    res.set("X-Mobile-Revision", revision);
    return res.json({ result: declaration });
  };
}
