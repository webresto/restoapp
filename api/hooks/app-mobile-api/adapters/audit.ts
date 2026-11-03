import type { AuditEvent } from "../lib/types";

/**
 * Every mutation through core's audit log, scope `mobile-api`. The actor is built here and not by
 * core's `getAuditActor`: that one takes the first hop of X-Forwarded-For, which the client writes;
 * `ip` here is `req.ip` under the "trust proxy" of Sails.
 */
export function coreAudit(event: AuditEvent): void {
  const { logAuditEvent } = require("@webresto/core/lib/auditLog");
  logAuditEvent("mobile-api", event.ok ? event.method : `${event.method}:failed`, {
    actor: { adminUserId: event.user, device: event.device, ip: event.ip },
    place: event.place,
    record: event.record,
    params: event.params,
    ...(event.error ? { error: event.error } : {}),
  });
}
