import { createEmitterCollector } from "@webresto/core/libs/EmitterCollector";

/**
 * What a module returns from the `admin-panel:collect-links` event.
 * Self-describing: every field needed to resolve and gate the link is explicit.
 */
export interface ProvidedAdminLink {
  /** Provider module name. Defaults to the emitter subscriber id. */
  module?: string;
  /** Link kind. `app` = a standalone admin page. */
  type: "app" | string;
  /** Stable id within the type, e.g. `stock-manager`. */
  name: string;
  /** Path relative to the admin host, e.g. `/adminizer/stock-manager`. */
  link: string;
  /** Human-readable title, shown to operators and matched against loosely. */
  title?: string;
  /** Navbar section the page belongs to. */
  section?: string;
  /** Token the user needs to open the page. Absent = public. */
  accessRightsToken?: string;
}

export interface ResolvedAdminLink extends ProvidedAdminLink {
  module: string;
  title: string;
}

declare global {
  interface IAwaitEmitter {
    /** Subscribers return ProvidedAdminLink | ProvidedAdminLink[]. */
    "admin-panel:collect-links": [];
  }
}

/**
 * String contract with the providers, so they stay decoupled from this file.
 * Core declares the same event in @webresto/core libs/AwaitEmitter.ts.
 */
const EVENT = "admin-panel:collect-links";

const collector = createEmitterCollector<ResolvedAdminLink>({
  event: EVENT,
  description: "Modules provide admin panel page links (used to build links into the admin router)",
  idOf: (item) => `${item.type}:${slug(item.name)}`,
  normalize: (raw: any, subscriberId: string): ResolvedAdminLink | null => {
    if (!raw || typeof raw !== "object") return null;
    const type = String(raw.type || "").trim();
    const name = String(raw.name || "").trim();
    const link = String(raw.link || "").trim();
    if (!type || !name || !link) return null;
    const module = String(raw.module || subscriberId || "").trim() || "unknown";
    return {
      module,
      type,
      name,
      link,
      title: raw.title != null && String(raw.title).trim() ? String(raw.title).trim() : name,
      section: raw.section != null ? String(raw.section) : undefined,
      accessRightsToken: raw.accessRightsToken != null ? String(raw.accessRightsToken) : undefined,
    };
  },
});

/** Tolerates spacing/underscore/hyphen differences so loosely-typed names still match. */
function slug(value: string): string {
  return String(value ?? "").trim().toLowerCase().replace(/[\s_-]+/g, "-");
}

/**
 * Registry of admin panel page links, collected live from modules over the
 * emitter. Modules never import this class — they just answer the event:
 *
 *   emitter.on('admin-panel:collect-links', 'my-module', () => ([
 *     { type: 'app', name: 'my-page', link: `${prefix}/my-page`, title: 'My page' }
 *   ]));
 *
 * Because the list is pulled at read time, it does not matter whether the module
 * loaded before or after whoever consumes the links.
 */
export class AdminLinkProvider {
  /** Convenience wrapper for providers that would rather not touch the emitter. */
  static provide(subscriberId: string, handler: () => ProvidedAdminLink[] | Promise<ProvidedAdminLink[]>): void {
    collector.provide(subscriberId, handler as any);
  }

  /** Declare the event up front so it is listed even before the first read. */
  static declare(): void {
    collector.declare();
  }

  /** Every link modules currently provide. */
  static async collect(): Promise<ResolvedAdminLink[]> {
    return collector.collect();
  }

  /**
   * Links of one type the user may open. `canAccess` mirrors how the navbar
   * filters entries (no token = public); omit it to skip gating entirely.
   */
  static async list(type: string, canAccess?: (token: string) => boolean): Promise<ResolvedAdminLink[]> {
    const wanted = slug(type);
    const links = await this.collect();
    return links.filter(
      (item) =>
        slug(item.type) === wanted &&
        (!item.accessRightsToken || !canAccess || canAccess(item.accessRightsToken)),
    );
  }

  /** Resolve one link by type + name (or title). Returns undefined when absent or not permitted. */
  static async resolve(
    type: string,
    name: string,
    canAccess?: (token: string) => boolean,
  ): Promise<ResolvedAdminLink | undefined> {
    const wanted = slug(name);
    const links = await this.list(type, canAccess);
    return links.find((item) => slug(item.name) === wanted || slug(item.title) === wanted);
  }
}
