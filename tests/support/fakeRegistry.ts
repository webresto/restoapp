import * as fs from "fs";
import * as http from "http";
import * as net from "net";
import * as os from "os";
import * as path from "path";
import type { AddressInfo } from "net";

const tar = require("tar");

/**
 * The marketplace, faked: the same three paths the module manager asks, the same fields the real
 * registry answers with, and real tar archives. Nothing that uses it can reach the real marketplace
 * or the owner's server. Used by the tests and by the stand (`tools/real-server`).
 *
 * `stand-hello` — free, quick. `stand-slow` — free, its download waits `slowMs`. `stand-paid` — the
 * licence does not cover it. `stand-future` — needs a core this server has not got. `stand-locked` —
 * forbids its own removal. `stand-child` — depends on `stand-hello`. `stand-gone` — is listed and
 * cannot be downloaded.
 */

interface Published {
  name: string;
  teaser: string;
  description: string;
  tags: string[];
  version: string;
  purchased?: boolean;
  packageExtra?: Record<string, unknown>;
  slow?: boolean;
  broken?: boolean;
}

const seed = (): Record<string, Published> => ({
  "stand-hello": { name: "Приветствие", teaser: "Здоровается с гостем", description: "Пример программы: ничего не делает, только здоровается.", tags: ["demo", "greeting"], version: "1.0.0" },
  "stand-slow": { name: "Долгая установка", teaser: "Скачивается дольше таймаута телефона", description: "Проверяет, что установка переживает запрос.", tags: ["demo"], version: "1.0.0", slow: true },
  "stand-paid": { name: "Платная программа", teaser: "Не входит в лицензию", description: "Лицензия этого сервера её не покрывает.", tags: ["demo"], version: "2.0.0", purchased: false },
  "stand-future": { name: "Программа из будущего", teaser: "Нужна новая версия ядра", description: "Этому серверу не подходит.", tags: ["demo"], version: "1.0.0", packageExtra: { appDependencies: { "@webresto/core": "99.0.0" } } },
  "stand-locked": { name: "Неудаляемая программа", teaser: "Запрещает своё удаление", description: "Объявляет о себе forbidDelete.", tags: ["demo"], version: "1.0.0", packageExtra: { modulemanager: { forbidDelete: true } } },
  "stand-child": { name: "Зависимая программа", teaser: "Зависит от Приветствия", description: "Пока она стоит, Приветствие удалить нельзя.", tags: ["demo"], version: "1.0.0", packageExtra: { mmDependencies: { "stand-hello": "*" } } },
  "stand-gone": { name: "Пропавший архив", teaser: "Есть в каталоге, но не скачивается", description: "Реестр отвечает на скачивание ошибкой.", tags: ["demo"], version: "1.0.0", broken: true },
});

export interface FakeRegistry {
  url: string;
  /** A new version of a module appears in the marketplace. */
  publish(appId: string, version: string): void;
  /** Back to the list above, and answering. */
  reset(): void;
  /** The marketplace stops answering altogether. */
  setDown(down: boolean): void;
  close(): Promise<void>;
}

async function archiveOf(appId: string, published: Published): Promise<Buffer> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `fake-registry-${appId}-`));
  try {
    fs.writeFileSync(
      path.join(dir, "package.json"),
      JSON.stringify({
        name: appId,
        appId,
        version: published.version,
        description: published.description,
        sails: { isHook: true, hookName: appId },
        ...published.packageExtra,
      }),
    );
    fs.writeFileSync(path.join(dir, "index.js"), "module.exports = function () { return {}; };\n");
    const file = path.join(dir, "module.tar");
    await tar.c({ cwd: dir, file }, ["package.json", "index.js"]);
    return fs.readFileSync(file);
  } finally {
    setImmediate(() => fs.rmSync(dir, { recursive: true, force: true }));
  }
}

export async function startFakeRegistry(options: { slowMs?: number } = {}): Promise<FakeRegistry> {
  const slowMs = options.slowMs ?? 20000;
  let modules = seed();
  let down = false;

  const describe = (appId: string, published: Published) => ({
    id: appId,
    name: published.name,
    teaser: published.teaser,
    description: published.description,
    tags: published.tags,
    author: "webresto",
    latestVersion: published.version,
    purchased: published.purchased !== false,
    isReadyForDownload: true,
    disabled: false,
    isDeleted: false,
  });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? "/", "http://registry");
    const answer = (status: number, value: unknown) => {
      res.statusCode = status;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(value));
    };
    if (down) return answer(503, { message: "the marketplace is down" });
    if (url.pathname === "/getRecommendedModules") {
      return answer(200, Object.entries(modules).map(([appId, published]) => describe(appId, published)));
    }
    const appId = url.searchParams.get("appId") ?? "";
    const published = modules[appId];
    if (!published) return answer(404, { message: "no such module" });
    if (url.pathname === "/getModuleDetails") return answer(200, describe(appId, published));
    if (url.pathname === "/downloadModule/" || url.pathname === "/downloadModule") {
      if (published.broken) return answer(500, { message: "the archive is lost" });
      if (published.slow) await new Promise((resolve) => setTimeout(resolve, slowMs));
      res.statusCode = 200;
      res.setHeader("content-type", "application/x-tar");
      return res.end(await archiveOf(appId, published));
    }
    return answer(404, { message: "unknown path" });
  });

  // Through `net`: tests/graphql.middleware.test.ts fakes `http.Server.prototype.listen` for the whole mocha process.
  await new Promise<void>((resolve) => (net.Server.prototype.listen as any).call(server, 0, "127.0.0.1", resolve));
  return {
    url: `http://127.0.0.1:${(server.address() as AddressInfo).port}`,
    publish(appId, version) {
      modules[appId].version = version;
    },
    reset() {
      modules = seed();
      down = false;
    },
    setDown(value) {
      down = value;
    },
    close: () => new Promise((resolve) => {
      server.closeAllConnections?.();
      server.close(() => resolve());
    }),
  };
}
