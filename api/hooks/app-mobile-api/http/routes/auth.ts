import { Router, Request, Response } from "express";
import type { MobileApiRuntime } from "../app";
import { fail } from "../../lib/errors";
import { contractValidator } from "../../lib/contract";
import { PROTOCOL_VERSION } from "../../lib/registry";
import { authenticate } from "../../lib/auth/device";
import { ipLabel, login, LoginRequest } from "../../lib/auth/login";

const validLogin = contractValidator("loginRequest");

/** `req.ip` under the "trust proxy" of Sails; never the first hop of X-Forwarded-For, which the client writes. */
export function clientIp(req: Request): string {
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export default function authRoutes(runtime: MobileApiRuntime): Router {
  const router = Router();

  router.get("/challenge", async (req: Request, res: Response) => {
    if (!runtime.settings.captchaEnabled()) return res.json({ result: { task: null } });
    if (!runtime.settings.secret()) fail("unavailable", "The server has no secret to sign a CAPTCHA");
    const task = await runtime.challenge.getJob(ipLabel(clientIp(req)));
    return res.json({ result: { task } });
  });

  router.post("/login", async (req: Request, res: Response) => {
    if (!validLogin(req.body)) fail("invalid", "Expected {login, password, captchaSolution, device: {name, platform}}", { details: validLogin.errors });
    if (runtime.settings.captchaEnabled() && !runtime.settings.secret()) fail("unavailable", "The server has no secret to check a CAPTCHA");
    const { token, user } = await login(
      {
        users: runtime.users,
        access: runtime.access,
        devices: runtime.devices,
        attempts: runtime.attempts,
        challenge: runtime.challenge,
        captchaEnabled: () => runtime.settings.captchaEnabled(),
        now: runtime.now,
      },
      req.body as LoginRequest,
      clientIp(req),
    );
    return res.json({
      result: {
        token,
        user: { id: user.id, login: user.login, fullName: user.fullName ?? null },
        protocolVersion: PROTOCOL_VERSION,
      },
    });
  });

  router.post("/logout", async (req: Request, res: Response) => {
    const session = await authenticate(runtime, req.get("authorization"));
    await runtime.devices.revoke(session.device.id);
    return res.json({ result: { ok: true } });
  });

  return router;
}
