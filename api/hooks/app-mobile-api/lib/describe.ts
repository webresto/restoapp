import { createHash } from "crypto";
import type { AccessPort, ModuleInfo, ModulesPort, PanelUser, PlaceInfo, PlacesPort, ServerFacts } from "./types";
import { allows, availableApps, isAvailable, placesFor } from "./access";
import type { FieldDefinition } from "./registry";
import { MethodContext, MobileApiRegistry, PROTOCOL_VERSION } from "./registry";
import type { Translator } from "./i18n";

const HOOK_VERSION: string = require("../package.json").version;
const CACHE_LIMIT = 500;

export interface DescribeDeps {
  registry: MobileApiRegistry;
  access: AccessPort;
  places: PlacesPort;
  /** Absent in a stand that has no module manager: then the declaration carries no modules. */
  modules?: ModulesPort;
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
    // A module installed, updated or removed changes the declaration: its apps and scripts come with it.
    modules: (await modulesOf(deps)).map((module) => [module.id, module.version, module.kind]),
  };
  return createHash("sha256").update(JSON.stringify(material)).digest("hex").slice(0, 32);
}

/** The modules of the server, sorted by id; an empty list when the stand has no module manager. */
async function modulesOf(deps: DescribeDeps): Promise<ModuleInfo[]> {
  if (!deps.modules) return [];
  const modules = await deps.modules.list();
  return [...modules].sort((a, b) => a.id.localeCompare(b.id));
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

  /**
   * The models of an app as this user may see them: a field with an `access` the user does not pass is not in the
   * declaration, and the client's own rule does the rest — "a field that is not declared is not shown". Without it
   * the summary of «Маркетинг» would show somebody who only leads the promotions a «—» where the codes are counted.
   */
  private async modelsFor(
    user: PanelUser,
    models: Record<string, { fields: FieldDefinition[] }>,
  ): Promise<Record<string, { fields: FieldDefinition[] }>> {
    const result: Record<string, { fields: FieldDefinition[] }> = {};
    for (const [name, model] of Object.entries(models)) {
      const fields: FieldDefinition[] = [];
      for (const field of model.fields) {
        if (field.access && !(await allows(this.deps.access, user, field.access))) continue;
        // `access` is the server's own business: the client has no use for it and never sees it.
        const { access: _access, ...declaredField } = field;
        fields.push(declaredField as FieldDefinition);
      }
      result[name] = { fields };
    }
    return result;
  }

  /**
   * The modules of the server, and for a module that brought a mobile app — that app's id and the link
   * to its JS. Only apps this user may open are named: the list tells what the server has, the link is
   * there for what the user is allowed to run.
   */
  private async modules(user: PanelUser): Promise<unknown[]> {
    const { registry, access } = this.deps;
    const visible = new Set((await availableApps(access, registry, user)).map((app) => app.id));
    const byModule = new Map<string, { app: string; script?: unknown }>();
    for (const app of registry.listApps()) {
      if (!app.module || !visible.has(app.id)) continue;
      const script = registry.scriptOf(app.id);
      byModule.set(app.module, { app: app.id, ...(script ? { script } : {}) });
    }
    const modules = await modulesOf(this.deps);
    const known = new Set(modules.map((module) => module.id));
    // A module that registered an app but which the module manager does not list (a hook of the
    // installation itself, say) is still a module of this server as far as the app is concerned.
    const extra = [...byModule.keys()].filter((id) => !known.has(id)).sort();
    return [
      ...modules.map((module) => ({ ...module, ...(byModule.get(module.id) ?? {}) })),
      ...extra.map((id) => ({ id, version: null, kind: "installed" as const, ...byModule.get(id)! })),
    ];
  }

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
        ...(app.models ? { models: await this.modelsFor(user, app.models) } : {}),
        ...(app.client ? { client: app.client } : {}),
        // The link to the bundle and its hash — never the code: the client downloads it itself.
        ...(registry.scriptOf(app.id) ? { script: registry.scriptOf(app.id) } : {}),
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
        modules: await this.modules(user),
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
