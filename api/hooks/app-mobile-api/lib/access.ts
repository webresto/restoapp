import type { AccessPort, PanelUser, PlaceInfo, PlacesPort } from "./types";
import type { AccessRule, AppDefinition, MobileApiRegistry, RegisteredMethod } from "./registry";

/** The token every mobile session needs, as for the web: access to the panel = access to the app. */
export const PANEL_TOKEN = "access-to-adminpanel";

export function ruleTokens(rule: AccessRule): string[] {
  if ("public" in rule) return [];
  if ("tokens" in rule) return rule.tokens;
  return [typeof rule.token === "string" ? rule.token : rule.token.id];
}

/**
 * The one access decision, used both to build the declaration and to admit a call: a method a user
 * does not see in the declaration cannot be called either. Every token goes through adminizer's
 * `checkPermission` — the frozen `hasPermission` denies contextual tokens such as `stock-manager`.
 */
export async function isAvailable(access: AccessPort, user: PanelUser | null, method: RegisteredMethod): Promise<boolean> {
  if ("public" in method.access) return true;
  if (!user) return false;
  for (const token of ruleTokens(method.access)) {
    if (!(await access.checkPermission(token, user))) return false;
  }
  return true;
}

function kindMatches(kind: "cooking" | "pickup" | "any", place: PlaceInfo): boolean {
  if (kind === "cooking") return place.isCookingPoint;
  if (kind === "pickup") return place.isPickupPoint;
  return place.isCookingPoint || place.isPickupPoint;
}

/**
 * Points of a scope:"place" app for this user: enabled points of the app's kind, narrowed to the
 * options the user's groups grant for the app's token — exactly the list of the web Stock Manager.
 */
export async function placesFor(access: AccessPort, places: PlacesPort, user: PanelUser, app: AppDefinition): Promise<PlaceInfo[]> {
  if (app.scope !== "place" || !app.places) return [];
  const { token, kind, options = [] } = app.places;
  const candidates = (await places.list()).filter((place) => kindMatches(kind, place));
  const virtual = options.map(asVirtualPlace);
  const rights = access.getPermissionRights(token, user);
  if (rights === null) return [...candidates, ...virtual];
  const granted = new Set(rights.map(String));
  return [...candidates, ...virtual].filter((place) => granted.has(String(place.id)));
}

/** An option of the token the app shows among its points: «Без кухни» is not a `Place`. */
function asVirtualPlace(option: { id: string; title: string }): PlaceInfo {
  return { id: option.id, title: option.title, address: null, isCookingPoint: false, isPickupPoint: false, virtual: true };
}

/**
 * The point of one call. It has to be enabled, of the app's kind and granted by the token with the
 * point as context — the same `checkPermission(token, user, {placeId})` the web stock asks.
 * Re-checked on every call: removing a point from a group takes effect on the next request.
 */
export async function checkPlace(
  access: AccessPort,
  places: PlacesPort,
  user: PanelUser,
  app: AppDefinition,
  placeId: string,
): Promise<PlaceInfo | null> {
  if (app.scope !== "place" || !app.places) return null;
  const option = app.places.options?.find((candidate) => candidate.id === placeId);
  const place = option
    ? asVirtualPlace(option)
    : (await places.list()).find((candidate) => String(candidate.id) === placeId);
  if (!place || (!option && !kindMatches(app.places.kind, place))) return null;
  if (!(await access.checkPermission(app.places.token, user, { placeId: place.id }))) return null;
  return place;
}

/** Apps the user sees: those whose home method is available to them. */
export async function availableApps(access: AccessPort, registry: MobileApiRegistry, user: PanelUser): Promise<AppDefinition[]> {
  const result: AppDefinition[] = [];
  for (const app of registry.listApps()) {
    const home = registry.getMethod(app.home);
    if (home && home.app === app.id && (await isAvailable(access, user, home))) result.push(app);
  }
  return result;
}
