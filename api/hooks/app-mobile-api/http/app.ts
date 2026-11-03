import express, { NextFunction, Request, Response } from "express";
import type {
  AccessPort,
  AttemptStore,
  AuditEvent,
  DeviceStore,
  Logger,
  MobileApiSettings,
  PlacesPort,
  PowUseStore,
  PuzzlePort,
  ServerFacts,
  UsersPort,
} from "../lib/types";
import { MobileError } from "../lib/errors";
import { MobileApiRegistry, PROTOCOL_VERSION } from "../lib/registry";
import { Translator } from "../lib/i18n";
import { PowChallenge } from "../lib/auth/challenge";
import { DeclarationBuilder } from "../lib/describe";
import authRoutes from "./routes/auth";
import describeRoute from "./routes/describe";
import callRoute from "./routes/call";

export const BASE_PATH = "/api/mobile";
export const BODY_LIMIT = 64 * 1024;

/** Everything the application needs; built by `adapters/sails.ts` or by a test. */
export interface MobileApiDeps {
  settings: MobileApiSettings;
  registry: MobileApiRegistry;
  users: UsersPort;
  access: AccessPort;
  places: PlacesPort;
  facts(): Promise<ServerFacts>;
  devices: DeviceStore;
  powUses: PowUseStore;
  attempts: AttemptStore;
  puzzle: PuzzlePort;
  audit(event: AuditEvent): void;
  log: Logger;
  now(): number;
  translator?: Translator;
}

/** What the routes share: the deps and the objects built from them once. */
export interface MobileApiRuntime extends MobileApiDeps {
  translator: Translator;
  challenge: PowChallenge;
  declarations: DeclarationBuilder;
  /** `?lang=`, then Accept-Language, then the server locale, then English. */
  lang(req: Request): Promise<string>;
}

export function sendError(res: Response, error: MobileError): void {
  if (error.retryAfter !== undefined) res.set("Retry-After", String(Math.ceil(error.retryAfter)));
  res.status(error.status).json(error.toBody());
}

/**
 * The mobile API as a plain Express 5 application that knows nothing about Sails.
 *
 * It answers every request under `/api/mobile` itself, 404 included, and never hands a request back:
 * Express replaces the prototypes of `req`/`res` on entry, so a request that went through here must
 * not continue into the Express 4 stack of Sails.
 */
export function createMobileApi(deps: MobileApiDeps): express.Express {
  const translator = deps.translator ?? new Translator();
  const runtime: MobileApiRuntime = {
    ...deps,
    translator,
    challenge: new PowChallenge({
      secret: () => deps.settings.secret(),
      puzzle: deps.puzzle,
      used: deps.powUses,
      attempts: deps.attempts,
      baseDifficultyMs: () => deps.settings.captchaBaseDifficultyMs(),
      now: deps.now,
    }),
    declarations: new DeclarationBuilder({ registry: deps.registry, access: deps.access, places: deps.places, facts: deps.facts, translator }),
    async lang(req: Request) {
      const query = typeof req.query.lang === "string" ? req.query.lang : null;
      return translator.pick(query, req.get("accept-language"), (await deps.facts()).locale) ?? "en";
    },
  };

  const app = express();
  app.disable("x-powered-by");
  app.set("etag", false);
  // Express reads "trust proxy" from the application handling the request; called as a middleware
  // it does not inherit the setting of Sails, so it is set here from the same value.
  app.set("trust proxy", deps.settings.trustProxy ?? false);

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.set("Cache-Control", "no-store");
    res.set("X-Mobile-Protocol", String(PROTOCOL_VERSION));
    if (!deps.settings.enabled()) return sendError(res, new MobileError("unavailable", "Mobile API is turned off"));
    if (deps.settings.requireHttps() && !req.secure) return sendError(res, new MobileError("https_required"));
    const length = Number(req.get("content-length") ?? 0);
    if (length > BODY_LIMIT) return sendError(res, new MobileError("too_large"));
    next();
  });
  app.use(express.json({ limit: BODY_LIMIT, strict: true }));

  app.use(`${BASE_PATH}/auth`, authRoutes(runtime));
  app.get(`${BASE_PATH}/describe`, describeRoute(runtime));
  app.post(`${BASE_PATH}/call/:method`, callRoute(runtime));

  app.use((_req: Request, res: Response) => sendError(res, new MobileError("not_found", "No such endpoint")));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof MobileError) return sendError(res, error);
    if (error?.type === "entity.too.large") return sendError(res, new MobileError("too_large"));
    if (error?.type === "entity.parse.failed" || error?.status === 400) return sendError(res, new MobileError("invalid", "Body is not valid JSON"));
    deps.log.error("mobile API: unexpected error", error);
    return sendError(res, new MobileError("internal"));
  });

  return app;
}
