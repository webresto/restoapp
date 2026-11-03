import { createHash } from "crypto";
import type { AccessPort, PanelUser, PlaceInfo, PlacesPort, ServerFacts } from "./types";
import { availableApps, isAvailable, placesFor } from "./access";
import { MethodContext, MobileApiRegistry, PROTOCOL_VERSION } from "./registry";
import type { Translator } from "./i18n";

const HOOK_VERSION: string = require("../package.json").version;
const CACHE_LIMIT = 500;

export interface DescribeDeps {
  registry: MobileApiRegistry;
  access: AccessPort;
  places: PlacesPort;
  facts(): Promise<ServerFacts>;
  translator: Translator;
}

/** Group grants in a stable form: string tokens and contextual `{tokenId, rights}` alike, sorted. */
function canonicalGrants(user: PanelUser): unknown {
  const groups = (user.groups ?? []).map((group) => ({
    name: group.name,
    tokens: (group.tokens ?? [])
      .map((token: any) =>
        typeof token === "string"
          ? token
          : token && typeof token === "object"
            ? `${String(token.tokenId).toLowerCase()}=${[...(token.rights ?? [])].map(String).sort().join(",")}`
            : String(token),
      )
      .sort(),
  }));
  return groups.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Revision of the declaration of one user, cheap enough for every response: everything a
 * declaration is built from that may change while the server runs — the user's groups and their
 * grants with points, the administrator flag, the enabled points, the server facts — plus the
 * protocol, the hook version and the registry. A client seeing another revision in
 * `X-Mobile-Revision` re-reads `describe`.
 */
export async function computeRevision(deps: DescribeDeps, user: PanelUser): Promise<string> {
  const places = (await deps.places.list())
    .map((place) => [place.id, place.title, place.address, place.isCookingPoint, place.isPickupPoint])
    .sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  const material = {
    protocol: PROTOCOL_VERSION,
    hook: HOOK_VERSION,
    registry: deps.registry.fingerprint(),
    user: { id: user.id, login: user.login, fullName: user.fullName ?? null, admin: Boolean(user.isAdministrator) },
    grants: canonicalGrants(user),
    places,
    facts: await deps.facts(),
  };
  return createHash("sha256").update(JSON.stringify(material)).digest("hex").slice(0, 32);
}

function placeView(place: PlaceInfo, translator: Translator, lang: string) {
  // Titles of real points are data and never go through the translator; the title of an option the
  // app shows as a point — «Без кухни» — is a key of the app's own locales.
  return { id: String(place.id), title: place.virtual ? translator.t(place.title, lang) : place.title, address: place.address };
}

/**
 * Declarations are cached per process by (revision, language). That is safe in a pm2 cluster:
 * the revision depends only on what every worker reads from the database anyway.
 */
export class DeclarationBuilder {
  private readonly cache = new Map<string, unknown>();

  constructor(private readonly deps: DescribeDeps) {}

  async build(user: PanelUser, lang: string, revision: string, baseCtx: MethodContext): Promise<unknown> {
    const key = `${revision}\n${lang}`;
    const cached = this.cache.get(key);
    if (cached) return cached;

    const { registry, access } = this.deps;
    const facts = await this.deps.facts();
    const allPlaces = new Map<string, PlaceInfo>();
    const apps = [];

    for (const app of await availableApps(access, registry, user)) {
      // The points of this app first: a method whose input names one of them — «Назначить кухню» —
      // is personalised with exactly the list the declaration will carry.
      const appPlaces = app.scope === "place" ? await placesFor(access, this.deps.places, user, app) : [];
      const ctx: MethodContext = { ...baseCtx, appPlaces: async () => appPlaces };

      const methods = [];
      for (const method of registry.methodsOf(app.id)) {
        if (!(await isAvailable(access, user, method))) continue;
        const personal = method.describe ? await method.describe(ctx) : undefined;
        methods.push({
          name: method.name,
          kind: method.kind,
          title: method.title,
          input: personal?.input ?? method.input,
          ...(method.model ? { model: method.model } : {}),
          ...(method.ui ? { ui: method.ui } : {}),
        });
      }

      const declared: Record<string, unknown> = {
        id: app.id,
        version: app.version,
        title: app.title,
        ...(app.icon ? { icon: app.icon } : {}),
        ...(app.category ? { category: app.category } : {}),
        home: app.home,
        scope: app.scope ?? "server",
        ...(app.models ? { models: app.models } : {}),
        ...(app.client ? { client: app.client } : {}),
        methods,
      };
      if (app.scope === "place") {
        for (const place of appPlaces) allPlaces.set(String(place.id), place);
        declared.places = appPlaces.map((place) => String(place.id));
      }
      apps.push(declared);
    }

    const declaration = this.deps.translator.localize(
      {
        protocolVersion: PROTOCOL_VERSION,
        revision,
        server: facts,
        user: {
          id: user.id,
          login: user.login,
          fullName: user.fullName ?? null,
          isAdministrator: Boolean(user.isAdministrator),
        },
        places: [],
        apps,
      },
      lang,
    );
    // Data, not keys: the server name and place titles must not go through the translator.
    (declaration as any).server = facts;
    (declaration as any).places = [...allPlaces.values()]
      .map((place) => placeView(place, this.deps.translator, lang))
      .sort((a, b) => a.title.localeCompare(b.title));

    if (this.cache.size >= CACHE_LIMIT) this.cache.delete(this.cache.keys().next().value as string);
    this.cache.set(key, declaration);
    return declaration;
  }
}
