import type { Express } from "express";
import { BASE_PATH } from "./app";

type Handler = (req: any, res: any, next: (error?: unknown) => void) => void;

export interface MobileApiMount extends Handler {
  /** Set once the hook has its dependencies; until then the prefix answers 503. */
  attach(app: Express): void;
}

function isMobilePath(url: string | undefined): boolean {
  const path = (url ?? "").split("?")[0];
  return path === BASE_PATH || path.startsWith(`${BASE_PATH}/`);
}

/**
 * The middleware Sails gets: anything outside `/api/mobile` goes on (`next()`); anything inside is
 * handed whole to the mobile Express application and never comes back — like adminizer's
 * `getMiddleware()` and the MCP middleware. It stands before `bodyParser`, so skipper never buffers
 * a mobile body: the application reads it itself, with its 64 KB limit.
 */
export function createMount(): MobileApiMount {
  let app: Express | null = null;

  const mount = ((req, res, next) => {
    if (!isMobilePath(req.url)) return next();
    if (!app) {
      res.statusCode = 503;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.end(JSON.stringify({ error: { code: "unavailable", message: "Mobile API is starting", retryable: true } }));
      return;
    }
    app(req, res);
  }) as MobileApiMount;

  mount.attach = (application) => {
    app = application;
  };
  return mount;
}
