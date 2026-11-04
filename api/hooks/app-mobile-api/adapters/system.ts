import axios from "axios";
import * as fs from "fs";
import * as path from "path";
import * as semver from "semver";
import type { CatalogItem, JobRefusal, ModuleCard, ModuleItem, ModuleJob, ServerState, SystemPort } from "../apps/system";
import type { ModuleInfo, ModulesPort, ServerFacts } from "../lib/types";
import { serverFacts } from "./facts";

/**
 * The programs of this server for «Система» and for the declaration: the only file of the mobile API
 * that knows Waterline and `sails.hooks['app-manager-proto']` (`system.plan.md`, C38).
 *
 * Why it reads two places at once. The admin panel's "Extensions" page lists the rows of `Module` —
 * what the database knows: the version, `enable`, the migrations, the directory, whether it is
 * deleted. Everything else a card shows lives only in the memory of the manager
 * (`types/RuntimeModule.d.ts`, filled by `loadHelper`): the description, the author, the licence, the
 * keywords, the hook name, `modulemanager.forbidDelete`. The declaration used to be built from the
 * memory alone, so a module installed by another worker or softly removed was shown wrongly until a
 * restart. Here the two are joined on `appId`: the database says which programs there are, the
 * memory says what they are, and a row the memory has not got is honestly marked «не загружена».
 *
 * Three things are deliberate:
 *
 * - **The list is cached for a few seconds.** `computeRevision` reads it on *every* call of the API,
 *   so a Waterline query per request is not affordable; a change of a module reaches the clients
 *   within `LIST_TTL_MS`, and a job that installs or removes one calls `invalidate()`.
 * - **The marketplace is never asked while a declaration is built**, only by `system.modules` and
 *   `system.module`, in parallel and with a cache: the web page asks `getModuleDetails` once per
 *   module per page view, ten modules being ten requests of eight seconds each — a phone opens that
 *   list far more often than anybody opens the page.
 * - **The licence travels as `token`.** `upgrade.js` and the catalog call it `token`, the versions
 *   page calls it `license`, and one of the two names the registry does not know — so an update of a
 *   paid module was probably never offered at all (C38). One name here, and the page is corrected
 *   to match.
 */

declare const Module: any;
declare const Settings: any;

/** The rows of `Module` joined with the memory of the manager; `computeRevision` reads it per call. */
const LIST_TTL_MS = 10 * 1000;
/** A version answered by the registry is good for ten minutes; a failure is not retried for a minute. */
const LATEST_TTL_MS = 10 * 60 * 1000;
const LATEST_FAILURE_TTL_MS = 60 * 1000;
/** The page of the panel waits eight seconds per module; a phone request dies at fifteen altogether. */
const REGISTRY_TIMEOUT_MS = 5000;
/** The catalog: the panel's own timeout, and a minute of memory so typing a search does not ask the registry per letter. */
const MARKETPLACE_TTL_MS = 60 * 1000;
const MARKETPLACE_TIMEOUT_MS = 12000;

/** The successful text `migrationsHelper` writes into `Module.migrationsResult`; anything else is a failure. */
const MIGRATIONS_OK = "Migrations 'up' method was run successfully";

interface Row {
  appId: string;
  name: string;
  version: string | null;
  hookName: string;
  enable: boolean;
  isSystem: boolean;
  loaded: boolean;
  directoryName: string;
  repository: string;
  description: string;
  author: string;
  license: string;
  keywords: string[];
  forbidDelete: boolean;
  dependencies: string[];
  migrationsCount: number | null;
  migrationsResult: string;
  modulePath: string | null;
}

export interface SystemAdapter extends SystemPort, ModulesPort {
  /** Called after a job installed, updated or removed a module: the next read is fresh. */
  invalidate(): void;
}

function channelOf(): string {
  const explicit = process.env.WR_MODULES_CHANNEL;
  const staging = ["1", "true", "yes"].includes(String(process.env.STAGING || "").toLowerCase());
  return ["main", "staging", "any"].includes(explicit || "") ? (explicit as string) : staging ? "any" : "main";
}

function registryUrl(sails: any): string {
  const config = sails.config?.modulemanager ?? {};
  const configured = Array.isArray(config.repositories)
    ? config.repositories.find((repository: any) => repository?.type === "storage" && repository?.link)
    : null;
  return String(
    process.env.MODULE_STORAGE_URL || process.env.WEBRESTO_REGISTRY || configured?.link || "https://marketplace.restoapp.org",
  ).replace(/\/+$/, "");
}

/**
 * The modules the installation itself is built of: `MM_SYSTEM_MODULES`, read exactly as
 * `ModuleHelper.getSystemModuleList` reads it, so the two lists cannot name different things.
 */
function systemModules(sails: any): Map<string, { appId: string; path: string; info: any }> {
  const found = new Map<string, { appId: string; path: string; info: any }>();
  for (const modulePath of (process.env.MM_SYSTEM_MODULES ?? "").split(";").filter(Boolean)) {
    try {
      const info = JSON.parse(fs.readFileSync(path.join(modulePath, "package.json"), "utf8"));
      const appId = info.appId || String(info.name).replace(/^(@.+?[/\\])?(sails-hook-)?/, "");
      found.set(appId, { appId, path: modulePath, info });
    } catch (error) {
      // A path that is not there is not a module of this server; the manager logs the same.
      sails.log?.warn?.(`mobile API: ${modulePath} is named a system module but cannot be read`, error);
    }
  }
  return found;
}

/** `migrations/` of a module, counted the way `ModuleHelper.getMigrationsCount` counts it. */
function migrationFiles(modulePath: string | null): number {
  if (!modulePath) return 0;
  try {
    const dir = path.join(modulePath, "migrations");
    return fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
  } catch {
    return 0;
  }
}

function text(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

let shared: { sails: any; adapter: SystemAdapter } | null = null;

/**
 * One adapter per worker: the declaration, the home card and the list of programs share its cache of
 * rows and its answers of the marketplace, so opening «Программы» does not ask the registry again
 * about what `describe` has just asked.
 */
export function systemAdapter(sails: any): SystemAdapter {
  if (!shared || shared.sails !== sails) shared = { sails, adapter: coreSystem(sails, () => serverFacts(sails)) };
  return shared.adapter;
}

export function coreSystem(sails: any, facts: () => Promise<ServerFacts>): SystemAdapter {
  let rows: { at: number; value: Promise<Row[]> } | null = null;
  const latest = new Map<string, { at: number; version: string | null }>();
  let marketplace: { at: number; value: any[] } | null = null;

  function invalidate(): void {
    rows = null;
    latest.clear();
    marketplace = null;
  }

  const manager = () => sails.hooks?.["app-manager-proto"];

  /**
   * The memory of the manager in this worker: everything a `package.json` says about a module.
   *
   * `sails.hooks['app-manager-proto'].getModules` is asked first, and it is **undefined** today:
   * `index.js` takes `.getModules` off the module namespace of a TypeScript file whose only export
   * is `default`, and even bound it would lose its `this` (the method is static and reads
   * `this.loadedModules`). So the manager's memory has never been readable from outside the hook,
   * and the module list of the declaration was in fact always empty. Written down as C48 of the
   * plan, with the question; until it is answered this reads `ModuleHelper` itself — the very
   * class the manager's own pages read, by its own path, so there is one registry and not two.
   */
  function runtime(): Record<string, any> {
    try {
      const fromHook = manager()?.getModules?.();
      if (fromHook && Object.keys(fromHook).length) return fromHook;
      return managerModule<any>("helpers/moduleHelper")?.default?.getModules?.() ?? {};
    } catch (error) {
      sails.log?.warn?.("mobile API: the module manager does not answer with its modules", error);
      return {};
    }
  }

  /**
   * The restart state and the install wizard live in the manager's own files. They are required by
   * path rather than through the hook object, because the hook exposes only `getModules()`; Node
   * caches by path, so this is the very instance the admin panel's pages use, not a second one.
   * Slice B (C36) moves the restart state into the database, where a cluster can share it.
   */
  function managerModule<T>(file: string): T | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require(`../../app-manager-proto/${file}`) as T;
    } catch (error) {
      sails.log?.warn?.(`mobile API: ${file} of the module manager is not available`, error);
      return null;
    }
  }

  /** The restart of the application: the manager's own scheduler, the one the web page uses. */
  const restartScheduler = () =>
    managerModule<{
      getState(): { scheduled: boolean; scheduledFor: string | null; restarting: boolean };
      scheduleRestart(): unknown;
      restartNow(): unknown;
    }>("helpers/restartScheduler");

  function migrationsSupported(): boolean {
    try {
      return sails.getDatastore().config.adapter === "sails-postgresql";
    } catch {
      return false;
    }
  }

  async function readRows(): Promise<Row[]> {
    const system = systemModules(sails);
    const loaded = runtime();
    const modulesPath = sails.config?.modulemanager?.modulesPath ?? path.join(process.cwd(), "modules");

    let managed: any[] = [];
    try {
      // `dependencies` populated, because that collection — not the npm dependencies of the
      // package — is what the manager means by a relation, and what `remove.js` refuses over.
      managed = (await Module.find({ where: { isDeleted: { "!=": true } }, sort: "name ASC" }).populate("dependencies")) ?? [];
    } catch (error) {
      // No table yet, or the ORM is not up: the memory of the manager is still the truth about what
      // is running, and a declaration without modules is better than a declaration that fails.
      sails.log?.warn?.("mobile API: the Module table is not available, the modules are read from memory", error);
      managed = Object.entries(loaded).map(([appId, value]: [string, any]) => ({
        appId: value?.module?.appId ?? appId,
        name: value?.module?.name ?? appId,
        version: value?.module?.version ?? null,
        hookName: value?.module?.sails?.hookName ?? "",
        enable: value?.enable ?? true,
        directoryName: value?.dirName ?? "",
        repository: value?.repository ?? "",
        migrationsCount: null,
        migrationsResult: "",
      }));
    }

    const known = new Set(managed.map((row: any) => String(row.appId)));
    // A system module the database has no row for is still a module of this server: the declaration
    // has always named core and graphql, and it must keep naming them.
    for (const [appId, module] of system) {
      if (!known.has(appId)) {
        managed.push({
          appId,
          name: module.info.name ?? appId,
          version: module.info.version ?? null,
          hookName: module.info.sails?.hookName ?? "",
          enable: true,
          directoryName: path.basename(module.path),
          repository: "",
          migrationsCount: null,
          migrationsResult: "",
        });
      }
    }

    return managed.map((row: any): Row => {
      const appId = String(row.appId);
      const memory = loaded[appId]?.module ?? {};
      const isSystem = system.has(appId);
      const modulePath = isSystem
        ? (system.get(appId) as { path: string }).path
        : path.join(modulesPath, row.directoryName || appId);
      return {
        appId,
        // The package name, as the «Extensions» page shows it: `appName` is no help, because
        // `loadHelper` writes the appId into it whenever a module does not declare one.
        name: text(row.name || memory.name || appId),
        version: row.version ?? memory.version ?? null,
        hookName: text(row.hookName || memory.sails?.hookName),
        // A system module is enabled by definition: `loadHelper` writes `enable: true` for it.
        enable: isSystem ? true : Boolean(row.enable),
        isSystem,
        loaded: Boolean(loaded[appId]),
        directoryName: text(row.directoryName),
        repository: text(row.repository),
        description: text(memory.description || (isSystem ? system.get(appId)?.info?.description : "")),
        author: text(typeof memory.author === "object" ? memory.author?.name : memory.author),
        license: text(memory.license),
        keywords: Array.isArray(memory.keywords) ? memory.keywords.map(String) : [],
        forbidDelete: Boolean(memory.modulemanager?.forbidDelete),
        dependencies: Array.isArray(row.dependencies)
          ? row.dependencies.map((dependency: any) => String(dependency?.appId ?? dependency))
          : Object.keys(memory.mmDependencies ?? {}),
        migrationsCount: row.migrationsCount ?? null,
        migrationsResult: text(row.migrationsResult),
        modulePath,
      };
    });
  }

  function list(): Promise<Row[]> {
    if (!rows || Date.now() - rows.at > LIST_TTL_MS) {
      rows = {
        at: Date.now(),
        value: readRows().catch((error) => {
          rows = null;
          throw error;
        }),
      };
    }
    return rows.value;
  }

  /**
   * The newest version of a module the registry offers, cached. Without a licence nothing is asked
   * at all — exactly what the page does, and what makes a stand with no licence answer instantly.
   */
  async function latestVersion(appId: string): Promise<string | null> {
    const license = process.env.WEBRESTO_LICENSE || "";
    if (!license) return null;
    const kept = latest.get(appId);
    if (kept && Date.now() - kept.at < (kept.version ? LATEST_TTL_MS : LATEST_FAILURE_TTL_MS)) return kept.version;
    try {
      const response = await axios.get(`${registryUrl(sails)}/getModuleDetails`, {
        params: { appId, token: license, channel: channelOf() },
        timeout: REGISTRY_TIMEOUT_MS,
      });
      const version = text(response?.data?.latestVersion) || null;
      latest.set(appId, { at: Date.now(), version });
      return version;
    } catch (error) {
      sails.log?.warn?.(`mobile API: the marketplace did not answer about ${appId}`);
      latest.set(appId, { at: Date.now(), version: null });
      return null;
    }
  }

  /** The list of the marketplace; null — it did not answer, and that is said rather than shown as empty. */
  async function readMarketplace(): Promise<any[] | null> {
    if (marketplace && Date.now() - marketplace.at < MARKETPLACE_TTL_MS) return marketplace.value;
    try {
      const response = await axios.get(`${registryUrl(sails)}/getRecommendedModules`, {
        params: { token: process.env.WEBRESTO_LICENSE || "", channel: channelOf() },
        timeout: MARKETPLACE_TIMEOUT_MS,
      });
      const value = (Array.isArray(response?.data) ? response.data : []).filter((item: any) => item?.id);
      marketplace = { at: Date.now(), value };
      return value;
    } catch (error) {
      sails.log?.warn?.("mobile API: the marketplace did not answer with its catalog", error);
      return null;
    }
  }

  function catalogItemOf(item: any, installed: boolean): CatalogItem {
    return {
      id: String(item.id),
      appId: String(item.id),
      name: text(item.name) || String(item.id),
      teaser: text(item.teaser),
      description: text(item.description),
      author: text(item.author),
      tags: (Array.isArray(item.tags) ? item.tags : []).join(", "),
      latestVersion: text(item.latestVersion),
      block: installed ? "installed" : item.purchased === false ? "license" : item.isReadyForDownload === false ? "download" : null,
    };
  }

  function updateAvailable(current: string | null, newest: string | null): boolean {
    if (!newest || !current) return false;
    return semver.valid(newest) && semver.valid(current) ? semver.gt(newest, current) : newest !== current;
  }

  /** Worst first: what a person has to act on before anything else. */
  function stateOf(row: Row, hasUpdate: boolean, migrationsPending: boolean): string {
    if (migrationsPending) return "migrations";
    if (!row.enable) return "disabled";
    if (!row.loaded) return "not-loaded";
    if (hasUpdate) return "update";
    if (row.isSystem) return "system";
    return "ok";
  }

  /**
   * Whether the migrations of the module are behind. The manager compares the *number of files* in
   * `migrations/` with the number the row remembers, and it runs them on postgres only — so on any
   * other datastore nothing is pending, because nothing is ever run.
   */
  function pendingMigrations(row: Row, supported: boolean): boolean {
    if (!supported || row.isSystem) return false;
    const files = migrationFiles(row.modulePath);
    if (files === 0) return false;
    if (row.migrationsResult && row.migrationsResult !== MIGRATIONS_OK) return true;
    return (row.migrationsCount ?? 0) !== files;
  }

  async function itemOf(row: Row, supported: boolean): Promise<ModuleItem> {
    const newest = await latestVersion(row.appId);
    const hasUpdate = updateAvailable(row.version, newest);
    return {
      id: row.appId,
      name: row.name,
      appId: row.appId,
      version: row.version,
      latestVersion: newest,
      updateAvailable: hasUpdate,
      kind: row.isSystem ? "system" : "installed",
      enable: row.enable,
      loaded: row.loaded,
      state: stateOf(row, hasUpdate, pendingMigrations(row, supported)),
      description: row.description,
    };
  }

  /**
   * Required settings of the module with neither a value nor a default — what `changeState` turns
   * into the steps of the install wizard. It is counted here rather than taken from the manager's
   * `hasUnfilledSettings`, because that flag is never set anywhere (see C46 of the plan): both
   * places that should write it are dead code, so reading it would always answer «всё заполнено».
   */
  async function unfilledSettings(appId: string): Promise<number> {
    try {
      const settings = (await Settings.find({ module: appId })) ?? [];
      return settings.filter((row: any) => row.value === null && row.defaultValue === null && row.isRequired === true).length;
    } catch {
      return 0;
    }
  }

  /** The wizard that holds the admin panel, if any: the same choice `bindInstallStepper` makes. */
  function activeWizard(): { total: number; left: number; current: string | null; renderer: string | null } | null {
    const stepper = managerModule<any>("lib/installStepper/installStepper")?.InstallStepper;
    if (!stepper) return null;
    try {
      const active = (stepper.instances ?? []).find((candidate: any) => candidate.hasUnprocessedSteps?.() || candidate.hasUnfinalizedSteps?.());
      if (!active) return null;
      const steps = active.getSteps?.() ?? [];
      const left = steps.filter((step: any) => !step.isProcessed && !step.isSkipped);
      // `getNextUnprocessedStep()` is not asked: it adds a finalize step and starts a timer, and
      // reading the state of the server must change nothing.
      return {
        total: steps.length,
        left: left.length,
        current: left[0]?.title ?? null,
        renderer: left[0]?.renderer ?? null,
      };
    } catch (error) {
      sails.log?.warn?.("mobile API: the state of the install wizard is not available", error);
      return null;
    }
  }

  return {
    invalidate,

    /**
     * The modules of the declaration: the same rows, so the app and the declaration cannot disagree
     * about what is installed. Nothing here needs a right — a module list is what the server is.
     */
    async list(): Promise<ModuleInfo[]> {
      try {
        return (await list()).map((row) => ({
          id: row.appId,
          version: row.version,
          kind: row.isSystem ? "system" : "installed",
          title: row.description || row.name || null,
        }));
      } catch (error) {
        sails.log?.warn?.("mobile API: the module list is not available", error);
        return [];
      }
    },

    async server(): Promise<ServerState> {
      const all = await list();
      const fact = await facts();
      const supported = migrationsSupported();
      const restart = restartScheduler()?.getState?.() ?? { scheduled: false, scheduledFor: null, restarting: false };
      const wizard = activeWizard();
      const version = fact.version ?? null;
      const zone = fact.timezone ?? null;
      return {
        id: "server",
        title: fact.name,
        subtitle: [version, zone].filter(Boolean).join(" · "),
        version,
        timezone: zone,
        currency: fact.currency ?? null,
        systemCount: all.filter((row) => row.isSystem).length,
        installedCount: all.filter((row) => !row.isSystem).length,
        disabledCount: all.filter((row) => !row.enable).length,
        updatesCount: (await Promise.all(all.map(async (row) => updateAvailable(row.version, await latestVersion(row.appId))))).filter(
          Boolean,
        ).length,
        migrationsPending: all.filter((row) => pendingMigrations(row, supported)).length,
        restartScheduled: Boolean(restart.scheduled),
        restartAt: restart.scheduledFor ? Date.parse(restart.scheduledFor) : null,
        restarting: Boolean(restart.restarting),
        wizardActive: wizard !== null,
        wizardTotal: wizard?.total ?? 0,
        wizardLeft: wizard?.left ?? 0,
        wizardCurrent: wizard?.current ?? null,
        wizardRenderer: wizard?.renderer ?? null,
        licensed: Boolean(process.env.WEBRESTO_LICENSE),
      };
    },

    async restart(when: "midnight" | "now") {
      const scheduler = restartScheduler();
      if (!scheduler) throw new Error("the restart scheduler of the module manager is not available");
      if (when === "now") scheduler.restartNow();
      else scheduler.scheduleRestart();
    },

    async catalog(query: { q?: string; appId?: string; tags?: string }) {
      const all = await readMarketplace();
      if (!all) return null;
      const installed = new Set((await list()).map((row) => row.appId));
      const needle = query.q?.toLowerCase();
      // The rule of the panel's catalog (`modulesVersions.ts`): a module has every tag that was asked.
      const asked = (query.tags ?? "").split(/[;,]/).map((tag) => tag.trim().toLowerCase()).filter(Boolean);
      return all
        .filter((item) => !installed.has(item.id) && !item.disabled && !item.isDeleted)
        .filter((item) => !query.appId || item.id === query.appId)
        .filter((item) => {
          const own = (Array.isArray(item.tags) ? item.tags : []).map((tag: unknown) => String(tag).toLowerCase());
          return asked.every((tag) => own.includes(tag));
        })
        .filter((item) => {
          if (!needle) return true;
          // What the panel's catalog searches over: the registry has no category field to add to it.
          const tags = Array.isArray(item.tags) ? item.tags : [];
          return [item.id, item.name, item.teaser, item.description, ...tags].filter(Boolean).join(" ").toLowerCase().includes(needle);
        })
        .map((item) => catalogItemOf(item, false))
        .sort((a, b) => a.name.localeCompare(b.name));
    },

    async catalogItem(appId: string) {
      const found = (await readMarketplace())?.find((item) => item.id === appId);
      if (!found) return null;
      return catalogItemOf(found, (await list()).some((row) => row.appId === appId));
    },

    async startJob(kind: ModuleJob["kind"], appId: string) {
      const jobs = managerModule<any>("helpers/moduleJobs");
      if (!jobs) throw new Error("the jobs of the module manager are not available");
      let job: any;
      try {
        job = await jobs[kind](appId);
      } catch (error: any) {
        if (error instanceof jobs.ModuleRefusal) {
          const refusal: JobRefusal = { refusal: true, reason: (error as any).reason, message: error.message, details: (error as any).details };
          throw refusal;
        }
        throw error;
      }
      // The next read of the programs and of the marketplace is fresh, whichever way it ended.
      void job.finished.then(invalidate);
      invalidate();
      return jobs.view(job) as ModuleJob;
    },

    async job(id: string) {
      const jobs = managerModule<any>("helpers/moduleJobs");
      const job = jobs?.get(id);
      return job ? (jobs.view(job) as ModuleJob) : null;
    },

    async modules(query: { q?: string; kind?: string }) {
      const all = await list();
      const supported = migrationsSupported();
      const items = await Promise.all(all.map((row) => itemOf(row, supported)));
      const counts = {
        all: items.length,
        installed: items.filter((item) => item.kind === "installed").length,
        system: items.filter((item) => item.kind === "system").length,
        disabled: items.filter((item) => !item.enable).length,
      };
      const needle = query.q?.toLowerCase();
      const byId = new Map(all.map((candidate) => [candidate.appId, candidate]));
      const filtered = items.filter((item) => {
        if (query.kind === "installed" && item.kind !== "installed") return false;
        if (query.kind === "system" && item.kind !== "system") return false;
        if (query.kind === "disabled" && item.enable) return false;
        if (!needle) return true;
        // The search of the panel's catalog, over what is installed: the name, the id, the
        // description and the keywords — the keywords are how a module is found in the marketplace
        // too, so the same word finds it in both places.
        const keywords = byId.get(item.appId)?.keywords ?? [];
        return [item.name, item.appId, item.description, ...keywords].filter(Boolean).join(" ").toLowerCase().includes(needle);
      });
      return { items: filtered, counts };
    },

    async module(appId: string): Promise<ModuleCard | null> {
      const all = await list();
      const row = all.find((candidate) => candidate.appId === appId);
      if (!row) return null;
      const supported = migrationsSupported();
      const item = await itemOf(row, supported);
      // Who depends on this module is counted the way `remove.js` counts it — over the dependencies
      // of every other row — so the card and the refusal of the web cannot disagree.
      const dependents = all.filter((other) => other.appId !== appId && other.dependencies.includes(appId)).map((other) => other.appId);
      const files = migrationFiles(row.modulePath);
      return {
        ...item,
        hookName: row.hookName,
        directoryName: row.directoryName,
        author: row.author,
        license: row.license,
        keywords: row.keywords.join(", "),
        repository: row.repository,
        dependencies: row.dependencies.join(", "),
        dependents: dependents.join(", "),
        dependentsList: dependents,
        migrationsFiles: files,
        migrationsProcessed: row.migrationsCount,
        migrationsResult: row.migrationsResult === MIGRATIONS_OK ? "" : row.migrationsResult,
        migrationsPending: pendingMigrations(row, supported),
        migrationsSupported: supported,
        unfilledSettings: await unfilledSettings(appId),
        removeBlock: row.isSystem ? "system" : row.forbidDelete ? "forbidden" : dependents.length ? "dependents" : null,
      };
    },
  };
}
