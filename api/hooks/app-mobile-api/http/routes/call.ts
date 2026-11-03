import { Request, Response } from "express";
import type { MobileApiRuntime } from "../app";
import { fail } from "../../lib/errors";
import { authenticate, Session } from "../../lib/auth/device";
import { computeRevision } from "../../lib/describe";
import { invoke } from "../../lib/call";
import { contractValidator } from "../../lib/contract";
import { clientIp } from "./auth";

const validCall = contractValidator("callRequest");

/** Methods every server answers without a token: what the client asks before the login screen. */
async function builtIn(runtime: MobileApiRuntime, method: string): Promise<{ result: unknown } | null> {
  if (method !== "server.about") return null;
  const facts = await runtime.facts();
  return { result: { name: facts.name, version: facts.version } };
}

/** POST /api/mobile/call/:method {params, place?} → {result} | {error}; every answer carries X-Mobile-Revision. */
export default function callRoute(runtime: MobileApiRuntime) {
  return async (req: Request, res: Response) => {
    const method = String(req.params.method);
    const body = (req.body ?? {}) as { params?: unknown; place?: unknown };
    if (!validCall(body)) fail("invalid", "Expected {params, place?}", { details: validCall.errors });

    const answer = await builtIn(runtime, method);
    if (answer) return res.json(answer);

    const authorization = req.get("authorization");
    const session: Session | null = authorization ? await authenticate(runtime, authorization) : null;
    const lang = await runtime.lang(req);
    if (session) res.set("X-Mobile-Revision", await computeRevision(runtime, session.user));

    const result = await invoke(runtime, session, {
      method,
      params: body.params,
      place: body.place,
      lang,
      ip: clientIp(req),
    });
    return res.json({ result });
  };
}
