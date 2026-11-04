import { createHash } from "crypto";
import Ajv, { ValidateFunction } from "ajv";
import type { DeviceRecord, PanelUser, PlaceInfo } from "./types";
import { readScript, rereadScript, scriptRef, type ScriptAsset, type ScriptSource } from "./scripts";
import type { ErrorCode } from "./errors";

const contract = require("../schema/declaration.schema.json");

export const PROTOCOL_VERSION = 1;

/** `x-*` keywords a method input may carry: hints for the client, no effect on validation. */
const INPUT_HINT_KEYWORDS = ["x-titles", "x-format"];

export type AccessRule =
  | { public: true }
  | { token: string | { id: string; name: string; description?: string } }
  /** Every one of them. */
  | { tokens: string[] }
  /** Any one of them: the two rights of the Marketing section, either of which opens its summary. */
  | { anyOf: string[] };

export interface AppDefinition {
  id: string;
  version: string;
  title: string;
  icon?: { path: string };
  category?: string;
  home: string;
  /** "place": every call carries exactly one point the user holds for `places.token`. */
  scope?: "server" | "place";
  places?: {
    token: string;
    kind: "cooking" | "pickup" | "any";
    /**
     * Options of the same token that are not points of the server but which the app shows among
     * them — «Без кухни» of «Заказы»: the orders no kitchen was resolved for. Granted exactly like
     * a point, and the titles are translation keys.
     */
    options?: Array<{ id: string; title: string }>;
  };
  /** Fields of the records the app shows, for apps whose data is not an adminizer model. */
  models?: Record<string, { fields: FieldDefinition[] }>;
  /**
   * The client draws this app itself — the POS of `order-entry.plan.md`, whose receipt and catalog
   * no declaration describes. The server still owns the app: rights, points, methods and their
   * schemas are the same as for any other, and a client that does not know this `native` (or is
   * older than `min`) shows the «Needs a newer version» tile rather than a broken screen.
   */
  client?: { native: string; min?: number };
  /**
   * The app comes as one JS file from the server (`scripts.ts`): `file` is the built bundle inside the
   * module that owns the app. The declaration carries a link to that file and its hash, never the code,
   * and a client that cannot run scripts shows the «Needs a newer version» tile — the mechanism of
   * `client.native`.
   */
  script?: ScriptSource;
  /** The module this app came from (`appId` of the module manager); absent for the apps of the core. */
  module?: string;
}

export interface FieldDefinition {
  name: string;
  title: string;
  format: string;
  readonly?: boolean;
  section?: string;
  specials?: Array<{ value: unknown; title: string; tone?: string }>;
  "x-titles"?: Record<string, string>;
  /**
   * Who may see the field. Without it — everybody the app is available to; with it, the declaration of the rest
   * does not carry it at all, so a number they may not see is not shown as «—» either. The values are the
   * handler's own business: it asks `ctx.can` for the same token and leaves the field out.
   */
  access?: AccessRule;
}

/** Where a tap leads: a method of this app with its params, or one of another app. */
export interface OpenTarget {
  app?: string;
  /** A method to open — or, instead of it, a [url]: exactly one of the two is given. */
  method?: string;
  params?: Record<string, unknown>;
  place?: string;
  title?: string;
  /** An address outside the apps, opened in the browser of the system; a path is of this server. */
  url?: string;
}

/** A line of a card that leads somewhere: «Применения · 12 →». */
export interface RecordLink {
  title: string;
  meta?: string;
  open: OpenTarget;
}

export interface MethodContext {
  /** null only in a public method called without a token. */
  user: PanelUser | null;
  device: DeviceRecord | null;
  lang: string;
  /** The checked point of a scope:"place" app; null otherwise. Handlers of such apps must filter by it. */
  place: PlaceInfo | null;
  /**
   * Every point of this app the user holds — the `places` of their declaration. Empty for an app
   * that is not by points. For a method whose input names a point of its own: «Назначить кухню»
   * offers the kitchens of the person, not of the server.
   */
  appPlaces(): Promise<PlaceInfo[]>;
  t(key: string): string;
  /**
   * Refuse the call. `details` travels in the error body (`{error: {code, message, details}}`): the refusal of
   * a channel rule carries the `settingsUrl` of its provider and the `marketplaceAppId` to install, so the
   * phone can offer the next step instead of only naming the problem (`sales-channels.plan.md`, C31).
   */
  fail(code: ErrorCode, message?: string, extra?: { details?: unknown }): never;
  /** Whether the user holds the token — what a handler asks before computing a value only some may see. */
  can(token: string): Promise<boolean>;
  /**
   * Whether this user could call the method now: it is registered, available to them, and - for an app by points -
   * they hold `placeId` for it. A server builds no link it knows will not open (`client-lookup.plan.md`); an unknown
   * method answers false, so a link into an app that does not exist yet simply does not appear.
   */
  canOpen(method: string, placeId?: string): Promise<boolean>;
}

export interface ActionOverride {
  /** Input narrowed for this user or this record, e.g. only the transitions allowed from the current state. */
  input?: Record<string, unknown>;
}

export interface MethodDefinition<P = any, R = any> {
  name: string;
  app: string;
  kind: "query" | "mutation";
  title: string;
  access: AccessRule;
  input: Record<string, any>;
  /** Model of the records a query returns; each of them gets `_actions`. */
  model?: string;
  ui?: Record<string, any>;
  /** Personal schema: narrows `input` for this user. Used for the declaration and for validation. */
  describe?(ctx: MethodContext): Promise<ActionOverride | void> | ActionOverride | void;
  /** Per record: false — the action is not available on it; an override — narrowed input. */
  describeItem?(ctx: MethodContext, record: any): Promise<ActionOverride | false | void> | ActionOverride | false | void;
  handler(params: P, ctx: MethodContext): Promise<R> | R;
  /** What a mutation writes to the audit: the record id and params without personal data. Default: `id` and all params. */
  audit?(params: P, result: R): { record?: string | null; params?: Record<string, unknown> };
}

export interface RegisteredMethod extends MethodDefinition {
  validate: ValidateFunction;
}

export interface OwnToken {
  id: string;
  name: string;
  description: string;
  department: string;
}

export class RegistrationError extends Error {
  constructor(message: string, readonly details?: unknown) {
    super(message);
    this.name = "RegistrationError";
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** The JSON part of a registration, i.e. what the contract schema checks and the fingerprint covers. */
function jsonPart<T extends object>(definition: T): Partial<T> {
  return Object.fromEntries(Object.entries(definition).filter(([, value]) => typeof value !== "function")) as Partial<T>;
}

/**
 * `global.mobileApi`: the apps and methods the server offers to the mobile client.
 *
 * Like `global.mcp` (`api/mcp/McpServer.js`), but every method carries a schema, screen hints and an
 * access rule, and nothing is open by accident: a registration without `access`, with an unknown
 * `ui` key or with an input schema ajv cannot compile in strict mode fails at start, not in the client.
 */
export class MobileApiRegistry {
  private readonly apps = new Map<string, AppDefinition>();
  /** Bundles of the apps that come as JS: hashed at registration, and again when the file changes. */
  private readonly scripts = new Map<string, ScriptAsset>();
  private readonly methods = new Map<string, RegisteredMethod>();
  private readonly ownTokens = new Map<string, OwnToken>();
  private tokenListener: ((token: OwnToken) => void) | null = null;
  private cachedFingerprint: string | null = null;

  /** Validates params: strict, defaults applied, no coercion. */
  readonly ajv: Ajv;
  private readonly checkApp: ValidateFunction;
  private readonly checkMethod: ValidateFunction;
  private readonly narrowedValidators = new Map<string, ValidateFunction>();

  constructor() {
    this.ajv = new Ajv({ strict: true, allErrors: true, useDefaults: true, coerceTypes: false });
    for (const keyword of INPUT_HINT_KEYWORDS) this.ajv.addKeyword({ keyword });

    const contractAjv = new Ajv({ strict: false, allErrors: true });
    contractAjv.addSchema(contract);
    this.checkApp = contractAjv.getSchema(`${contract.$id}#/definitions/appRegistration`)!;
    this.checkMethod = contractAjv.getSchema(`${contract.$id}#/definitions/methodRegistration`)!;
  }

  registerApp(definition: AppDefinition): void {
    if (!this.checkApp(jsonPart(definition))) {
      throw new RegistrationError(`mobileApi: app "${(definition as any)?.id}" does not match the contract`, this.checkApp.errors);
    }
    if (this.apps.has(definition.id)) throw new RegistrationError(`mobileApi: app "${definition.id}" is registered twice`);
    if (definition.script) {
      try {
        this.scripts.set(definition.id, readScript(definition.id, definition.script));
      } catch (error) {
        throw new RegistrationError(`mobileApi: app "${definition.id}": ${(error as Error).message}`);
      }
    }
    this.apps.set(definition.id, { scope: "server", ...definition });
    this.cachedFingerprint = null;
  }

  registerMethod(definition: MethodDefinition): void {
    const name = (definition as any)?.name;
    if (!this.checkMethod(jsonPart(definition))) {
      throw new RegistrationError(`mobileApi: method "${name}" does not match the contract`, this.checkMethod.errors);
    }
    if (typeof definition.handler !== "function") throw new RegistrationError(`mobileApi: method "${name}" has no handler`);
    for (const key of ["describe", "describeItem", "audit"] as const) {
      if (definition[key] !== undefined && typeof definition[key] !== "function") {
        throw new RegistrationError(`mobileApi: method "${name}": ${key} must be a function`);
      }
    }
    if (!this.apps.has(definition.app)) throw new RegistrationError(`mobileApi: method "${name}" names unknown app "${definition.app}"`);
    if (!name.startsWith(`${definition.app}.`)) throw new RegistrationError(`mobileApi: method "${name}" must start with "${definition.app}."`);
    if (this.methods.has(name)) throw new RegistrationError(`mobileApi: method "${name}" is registered twice`);
    if ("public" in definition.access && definition.kind !== "query") {
      throw new RegistrationError(`mobileApi: method "${name}": only a query may be public`);
    }
    if ("public" in definition.access && this.apps.get(definition.app)!.scope === "place") {
      throw new RegistrationError(`mobileApi: method "${name}": a method of an app by points needs a user, it cannot be public`);
    }

    const input = { additionalProperties: false, ...definition.input };
    let validate: ValidateFunction;
    try {
      validate = this.ajv.compile(input);
    } catch (error) {
      throw new RegistrationError(`mobileApi: method "${name}": input schema does not compile: ${(error as Error).message}`);
    }

    const token = "token" in definition.access ? definition.access.token : null;
    if (token && typeof token === "object") {
      const own: OwnToken = {
        id: token.id,
        name: token.name,
        description: token.description ?? token.name,
        department: "Mobile app",
      };
      this.ownTokens.set(own.id, own);
      this.tokenListener?.(own);
    }

    this.methods.set(name, { ...definition, input, validate });
    this.cachedFingerprint = null;
  }

  getApp(id: string): AppDefinition | undefined {
    return this.apps.get(id);
  }

  getMethod(name: string): RegisteredMethod | undefined {
    return this.methods.get(name);
  }

  /**
   * The bundle of an app that comes as JS, as its file is now.
   *
   * A build that happened while the server runs is picked up here, and a new hash drops the cached
   * fingerprint — so the declaration revision moves, clients re-read `describe` and download the new
   * code without a lift of the server (`scripts.ts`, `rereadScript`).
   */
  script(appId: string): ScriptAsset | undefined {
    const kept = this.scripts.get(appId);
    if (!kept) return undefined;
    const now = rereadScript(kept);
    if (now !== kept) {
      this.scripts.set(appId, now);
      this.cachedFingerprint = null;
    }
    return now;
  }

  /** What the declaration tells about that bundle: the link and the hash. */
  scriptOf(appId: string): ReturnType<typeof scriptRef> | undefined {
    const asset = this.script(appId);
    return asset ? scriptRef(asset) : undefined;
  }

  /** The route serves a bundle only by the hash the declaration gave: another hash is 404, never a stale file. */
  scriptByHash(appId: string, sha256: string): ScriptAsset | undefined {
    const asset = this.script(appId);
    return asset && asset.sha256 === sha256 ? asset : undefined;
  }

  listApps(): AppDefinition[] {
    return [...this.apps.values()];
  }

  methodsOf(appId: string): RegisteredMethod[] {
    return [...this.methods.values()].filter((method) => method.app === appId);
  }

  /** Validator for an input narrowed by describe / describeItem, compiled once per distinct schema. */
  validatorFor(method: RegisteredMethod, input: Record<string, unknown> | undefined): ValidateFunction {
    if (!input) return method.validate;
    const key = `${method.name}\n${JSON.stringify(input)}`;
    let validate = this.narrowedValidators.get(key);
    if (!validate) {
      validate = this.ajv.compile({ additionalProperties: false, ...input });
      if (this.narrowedValidators.size > 1000) this.narrowedValidators.clear();
      this.narrowedValidators.set(key, validate);
    }
    return validate;
  }

  /** Tokens of `access.token: {id, name}`; the hook registers them in adminizer. */
  listOwnTokens(): OwnToken[] {
    return [...this.ownTokens.values()];
  }

  /** Called for tokens registered after adminizer is up. */
  onOwnToken(listener: (token: OwnToken) => void): void {
    this.tokenListener = listener;
  }

  /** Changes when any registration changes: part of every declaration revision. */
  fingerprint(): string {
    // The files first: a bundle rebuilt since the last declaration has to move the revision, and
    // looking at it is what drops the fingerprint kept here.
    for (const app of [...this.scripts.keys()]) this.script(app);
    if (!this.cachedFingerprint) {
      const apps = this.listApps().map((app) => ({
        app: jsonPart(app),
        // A new build of a script is a new declaration: the revision moves and clients re-read describe.
        script: this.scripts.get(app.id)?.sha256 ?? null,
        methods: this.methodsOf(app.id).map(({ validate, ...method }) => jsonPart(method)),
      }));
      this.cachedFingerprint = sha256(JSON.stringify(apps));
    }
    return this.cachedFingerprint;
  }

  /** Inconsistencies that need every registration to be in: logged once the server is lifted. */
  problems(): string[] {
    const problems: string[] = [];
    for (const app of this.listApps()) {
      const home = this.methods.get(app.home);
      if (!home) problems.push(`app "${app.id}": home method "${app.home}" is not registered`);
      else if (home.app !== app.id) problems.push(`app "${app.id}": home method "${app.home}" belongs to another app`);
    }
    for (const method of this.methods.values()) {
      const open = method.ui?.open;
      if (open && !this.methods.has(open)) problems.push(`method "${method.name}": ui.open "${open}" is not registered`);
      const on = method.ui?.on;
      const app = this.apps.get(method.app)!;
      if (on && on !== "list" && !app.models?.[on] && !this.methodsOf(app.id).some((other) => other.model === on)) {
        problems.push(`method "${method.name}": ui.on "${on}" names no model of app "${app.id}"`);
      }
    }
    return problems;
  }
}
