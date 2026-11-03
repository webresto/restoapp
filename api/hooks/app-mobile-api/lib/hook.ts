import * as path from "path";
import { MobileApiRegistry } from "./registry";
import { Translator } from "./i18n";
import { createMount, MobileApiMount } from "../http/mount";
import { createMobileApi } from "../http/app";
import { cleanup, createSailsDeps, readSettings } from "../adapters/sails";
import { coreStock } from "../adapters/stock";
import { registerDishes } from "../apps/dishes";
import { deviceModelConfig } from "./adminpanelConfig";

declare const MobileDevice: any;

const buildDictionary = require("sails-build-dictionary");

const CLEANUP_EVERY_MS = 60 * 60 * 1000;

/** The Stock Manager group of the plan: created once, by name, the points are ticked by the administrator. */
const DEFAULT_GROUPS = [
  {
    name: "Stock Manager",
    description: "Changes stock and stops at the cooking points ticked for Stock Manager in this group",
    tokens: ["access-to-adminpanel", "stock-manager"],
  },
];

function isPrimaryWorker(): boolean {
  try {
    return require("@webresto/core/lib/cluster").isPrimaryWorker();
  } catch {
    return (process.env.NODE_APP_INSTANCE ?? "0") === "0";
  }
}

function bindModels(sails: any): Promise<void> {
  return new Promise((resolve, reject) => {
    buildDictionary.optional(
      { dirname: path.resolve(__dirname, "../models"), filter: /^([^.]+)\.(js)$/, replaceExpr: /^.*\//, flattenDirectories: true },
      (error: unknown, models: Record<string, unknown>) => {
        if (error) return reject(error);
        sails.models = Object.assign(sails.models || {}, models);
        resolve();
      },
    );
  });
}

/**
 * The app-mobile-api hook. Wired in restoapp.js, like app-manager-proto: api/hooks is not scanned.
 *
 * configure  — `global.mobileApi`, the middleware in front of `bodyParser`, the MobileDevice model in
 *              the admin panel config.
 * initialize — models; built-in apps; tokens on `Adminpanel:loaded` in every worker (always, even with
 *              the API off: saving a group keeps only the tokens registered at that moment); the
 *              Stock Manager group in the primary worker; the Express application once the ORM is up.
 */
export default function createHook(sails: any) {
  const registry = new MobileApiRegistry();
  const translator = new Translator();
  const mount: MobileApiMount = createMount();
  let cleanupTimer: NodeJS.Timeout | null = null;

  return {
    registry,
    translator,

    configure() {
      (global as any).mobileApi = registry;

      const middleware = sails.config.http.middleware;
      middleware.mobileApi = mount;
      const order: string[] = middleware.order;
      if (Array.isArray(order) && !order.includes("mobileApi")) {
        const before = order.indexOf("bodyParser");
        order.splice(before === -1 ? 0 : before, 0, "mobileApi");
      }

      if (sails.config.adminpanel?.models && !sails.config.adminpanel.models.mobiledevice) {
        sails.config.adminpanel.models.mobiledevice = deviceModelConfig;
      }
    },

    async initialize(cb: (error?: Error) => void) {
      try {
        if (sails.config.hooks?.adminpanel === false) {
          sails.log.warn("mobile API: the admin panel is off, /api/mobile stays unavailable");
          return cb();
        }

        await bindModels(sails);
        registerDishes(registry, coreStock());
        // Other modules may register their apps from their own hooks, now or later.
        sails.emit("mobile-api:ready", registry);

        sails.on("Adminpanel:loaded", async () => {
          const adminizer = sails.hooks.adminpanel?.adminizer;
          if (!adminizer) return;
          const helper = adminizer.accessRightsHelper;
          helper.registerTokens(registry.listOwnTokens());
          registry.onOwnToken((token) => helper.registerToken(token));

          if (readSettings(sails).enabled() && isPrimaryWorker()) {
            try {
              const { ensureDefaultGroups } = require("@webresto/core/lib/adminpanel/ensureDefaultGroups");
              await ensureDefaultGroups(adminizer, DEFAULT_GROUPS);
            } catch (error) {
              sails.log.error("mobile API: the Stock Manager group was not created", error);
            }
          }
        });

        sails.after("hook:orm:loaded", async () => {
          const settings = readSettings(sails);
          let tablesReady = true;
          if (settings.enabled()) {
            try {
              await MobileDevice.count({});
            } catch (error) {
              tablesReady = false;
              sails.log.error(
                "mobile API: its tables are missing, /api/mobile answers 503. Run the hook migrations: " +
                  "in the image they are collected by .ci/bootstrap (COLLECT_MIGRATIONS, AUTO_MIGRATION), " +
                  "locally by `npm run dev:pg`.",
                error,
              );
            }
          }

          const deps = createSailsDeps(sails, registry, translator);
          const enabled = deps.settings.enabled;
          deps.settings.enabled = () => tablesReady && enabled();
          mount.attach(createMobileApi(deps));

          if (tablesReady && settings.enabled() && isPrimaryWorker()) {
            cleanupTimer = setInterval(() => {
              cleanup(Date.now()).catch((error) => sails.log.warn("mobile API: cleanup failed", error));
            }, CLEANUP_EVERY_MS);
            cleanupTimer.unref();
          }
        });

        sails.on("lifted", () => {
          for (const problem of registry.problems()) sails.log.error(`mobile API: ${problem}`);
        });
        sails.on("lower", () => {
          if (cleanupTimer) clearInterval(cleanupTimer);
        });
      } catch (error) {
        sails.log.error("mobile API: initialization failed, /api/mobile stays unavailable", error);
      }
      return cb();
    },
  };
}
