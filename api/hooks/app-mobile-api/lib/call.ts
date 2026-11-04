import type { AccessPort, AuditEvent, PlacesPort } from "./types";
import { checkPlace, isAvailable, placesFor } from "./access";
import { fail, MobileError } from "./errors";
import type { Session } from "./auth/device";
import type { MethodContext, MobileApiRegistry, RegisteredMethod } from "./registry";
import type { Translator } from "./i18n";

export interface CallDeps {
  registry: MobileApiRegistry;
  access: AccessPort;
  places: PlacesPort;
  translator: Translator;
  audit(event: AuditEvent): void;
}

export interface CallRequest {
  method: string;
  params: unknown;
  place: unknown;
  lang: string;
  ip: string | null;
}

/**
 * The context of one call, and of one method of a declaration being built.
 *
 * `can` and `canOpen` are how a handler keeps a value or a link out of an answer it should not carry: the rights
 * are adminizer's, asked through the same `checkPermission` the availability of a method goes through, so a field
 * only some may see and a link only some may follow are decided by one source of truth.
 */
export function makeContext(
  deps: Pick<CallDeps, "translator" | "registry" | "access" | "places">,
  session: Session | null,
  lang: string,
): MethodContext {
  const user = session?.user ?? null;
  return {
    user,
    device: session?.device ?? null,
    lang,
    place: null,
    appPlaces: async () => [],
    t: (key) => deps.translator.t(key, lang),
    fail: (code, message, extra) => fail(code, message, extra),
    can: async (token) => (user ? deps.access.checkPermission(token, user) : false),
    canOpen: async (name, placeId) => {
      const method = deps.registry.getMethod(name);
      if (!method) return false;
      if (!(await isAvailable(deps.access, user, method))) return false;
      const app = deps.registry.getApp(method.app);
      if (!app || app.scope !== "place") return true;
      if (!user || !placeId) return false;
      return Boolean(await checkPlace(deps.access, deps.places, user, app, placeId));
    },
  };
}

/** Actions of one record: the available actions on its model, each narrowed or dropped by describeItem. */
async function actionsFor(deps: CallDeps, ctx: MethodContext, actions: RegisteredMethod[], record: any) {
  const result = [];
  for (const action of actions) {
    const override = action.describeItem ? await action.describeItem(ctx, record) : undefined;
    if (override === false) continue;
    // A narrowed input travels with the record and not in the declaration, so it is translated
    // here: the titles of the transitions a client draws its buttons from are in it.
    const input = override?.input ? deps.translator.localize(override.input, ctx.lang) : undefined;
    result.push(input ? { method: action.name, input } : { method: action.name });
  }
  return result;
}

async function attachActions(deps: CallDeps, ctx: MethodContext, method: RegisteredMethod, result: any): Promise<any> {
  // A query names the model of its records; an action answers with the record it acted on.
  const model = method.model ?? (method.kind === "mutation" && method.ui?.on !== "list" ? method.ui?.on : undefined);
  if (!model || !result || typeof result !== "object") return result;
  const actions = [];
  for (const candidate of deps.registry.methodsOf(method.app)) {
    if (candidate.kind === "mutation" && candidate.ui?.on === model && (await isAvailable(deps.access, ctx.user, candidate))) {
      actions.push(candidate);
    }
  }
  if (Array.isArray(result.items)) {
    for (const item of result.items) item._actions = await actionsFor(deps, ctx, actions, item);
  }
  if (result.item && typeof result.item === "object") {
    result.item._actions = await actionsFor(deps, ctx, actions, result.item);
  }
  return result;
}

function auditSummary(method: RegisteredMethod, params: any, result: any) {
  if (method.audit) return method.audit(params, result);
  return { record: params && typeof params.id === "string" ? params.id : null, params };
}

/**
 * One call: availability → point → input → handler → `_actions`. The availability check is the
 * function the declaration was built with; a method missing from the declaration is `forbidden`
 * whether it exists or not.
 */
export async function invoke(deps: CallDeps, session: Session | null, request: CallRequest): Promise<unknown> {
  const method = deps.registry.getMethod(request.method);
  const user = session?.user ?? null;
  if (!method) fail(session ? "forbidden" : "unauthorized", "Method is not available");
  if (!("public" in method.access) && !session) fail("unauthorized");
  if (!(await isAvailable(deps.access, user, method))) fail("forbidden", "Method is not available");

  const app = deps.registry.getApp(method.app)!;
  const ctx = makeContext(deps, session, request.lang);

  if (app.scope === "place") {
    if (typeof request.place !== "string" || !request.place) fail("invalid", "This method needs a point: {params, place}");
    const place = await checkPlace(deps.access, deps.places, user!, app, request.place);
    if (!place) fail("place_forbidden");
    ctx.place = place;
    ctx.appPlaces = () => placesFor(deps.access, deps.places, user!, app);
  } else if (request.place !== undefined) {
    fail("invalid", "This method does not take a point");
  }

  const personal = method.describe ? await method.describe(ctx) : undefined;
  const validate = deps.registry.validatorFor(method, personal?.input as Record<string, unknown> | undefined);
  const params = request.params === undefined ? {} : request.params;
  if (params === null || typeof params !== "object" || Array.isArray(params)) fail("invalid", "params must be an object");
  // ajv applies defaults in place: the handler gets a copy, never the request body.
  const input = structuredClone(params);
  if (!validate(input)) fail("invalid", "Parameters do not match the method schema", { details: validate.errors });

  if (method.kind !== "mutation") {
    return attachActions(deps, ctx, method, await method.handler(input, ctx));
  }

  const summary = { method: method.name, user: user!.id, device: session!.device.id, place: ctx.place ? String(ctx.place.id) : null, ip: request.ip };
  try {
    const result = await method.handler(input, ctx);
    const { record = null, params: audited = {} } = auditSummary(method, input, result);
    deps.audit({ ...summary, record, params: audited, ok: true });
    return attachActions(deps, ctx, method, result);
  } catch (error) {
    const { record = null, params: audited = {} } = auditSummary(method, input, undefined);
    deps.audit({ ...summary, record, params: audited, ok: false, error: error instanceof MobileError ? error.code : "internal" });
    throw error;
  }
}
