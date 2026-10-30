import { expect } from "chai";
import { PassThrough } from "stream";

const BROWSER_NAVIGATION = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
const RESOURCE_FETCH = "*/*";

type FrontendRoutes = (req: any, res: any, next: (error?: unknown) => void) => void;

// The middleware asks storefront:get-renderer once and keeps the answer, so every answer of the emitter needs a fresh copy
// of config/http.js. The answers are those of AwaitEmitter.emit: { id, state, result }.
function frontendRoutesWith(answers: any[], asked: { count: number } = { count: 0 }): FrontendRoutes {
  (global as any).sails = { config: { port: 1337 }, log: { error() {} } };
  (global as any).emitter = {
    emit: async (name: string) => {
      expect(name).to.equal("storefront:get-renderer");
      asked.count++;
      return answers;
    },
  };
  delete require.cache[require.resolve("../config/http.js")];
  return require("../config/http.js").http.middleware.frontendRoutes;
}

/** How the middleware answered: view:<name>, next, or the page a renderer wrote (ssr:<status> <body>). */
function route(frontendRoutes: FrontendRoutes, method: string, url: string, accept?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req: any = {
      method,
      url,
      originalUrl: url,
      path: url.split("?")[0],
      protocol: "http",
      headers: accept ? { accept, host: "site.test" } : { host: "site.test" },
      isSocket: false,
      get: (name: string) => req.headers[name.toLowerCase()],
    };
    const res: any = new PassThrough();
    const chunks: Buffer[] = [];
    res.headers = {} as Record<string, unknown>;
    res.view = (name: string) => resolve(`view:${name}`);
    res.status = (code: number) => { res.statusCode = code; return res; };
    res.setHeader = (name: string, value: unknown) => { res.headers[name.toLowerCase()] = value; };
    res.append = (name: string, value: unknown) => { res.headers[name.toLowerCase()] = value; };
    res.on("data", (chunk: Buffer) => chunks.push(chunk));
    res.on("finish", () => resolve(`ssr:${res.statusCode} ${Buffer.concat(chunks).toString()}`));
    frontendRoutes(req, res, (error) => (error ? reject(error) : resolve("next")));
  });
}

const spa = () => frontendRoutesWith([]);

describe("frontendRoutes", () => {
  // the globals the stubs replace, as other test files of the run left them
  const globals = { sails: (global as any).sails, emitter: (global as any).emitter };
  after(() => Object.assign(global, globals));

  it("serves the storefront for its pages, from a browser or a plain client", async () => {
    const frontendRoutes = spa();
    for (const url of ["/", "/menu", "/dish/borsch", "/cart?step=2", "/cabinet/order-history", "/stocks/1f0c"]) {
      expect(await route(frontendRoutes, "GET", url, BROWSER_NAVIGATION), url).to.equal("view:index");
      expect(await route(frontendRoutes, "GET", url), url).to.equal("view:index");
    }
  });

  it("serves the storefront on HEAD like on GET", async () => {
    expect(await route(spa(), "HEAD", "/menu")).to.equal("view:index");
  });

  it("lets a missing file fall through to 404 instead of the storefront", async () => {
    const frontendRoutes = spa();
    for (const url of ["/site.webmanifest", "/logo.png", "/favicon-32x32.png", "/assets/i18n/en.json"]) {
      expect(await route(frontendRoutes, "GET", url, RESOURCE_FETCH), url).to.equal("next");
    }
  });

  it("still serves a page whose slug has a dot when the browser navigates to it", async () => {
    expect(await route(spa(), "GET", "/articles/akciya-1.10", BROWSER_NAVIGATION)).to.equal("view:index");
  });

  it("never serves the storefront for an unknown backend path, even to a browser", async () => {
    const frontendRoutes = spa();
    for (const url of ["/admin", "/admin/orders", "/admin/modules", "/api/0.5/nothing", "/graphql/nothing", "/assets/nothing"]) {
      expect(await route(frontendRoutes, "GET", url, BROWSER_NAVIGATION), url).to.equal("next");
    }
  });

  it("does not treat a page that only starts like a backend prefix as backend", async () => {
    const frontendRoutes = spa();
    expect(await route(frontendRoutes, "GET", "/administration", BROWSER_NAVIGATION)).to.equal("view:index");
    expect(await route(frontendRoutes, "GET", "/apiary", BROWSER_NAVIGATION)).to.equal("view:index");
  });

  it("leaves non-page methods alone", async () => {
    expect(await route(spa(), "POST", "/menu", BROWSER_NAVIGATION)).to.equal("next");
  });

  it("renders a page on the server through the renderer the module gave, with Sails itself as the API", async () => {
    const calls: { url: string; method: string; accept: string | null; apiBase: string }[] = [];
    const renderer = {
      mode: "ssr",
      handle: async (request: Request, { apiBase }: { apiBase: string }) => {
        calls.push({ url: request.url, method: request.method, accept: request.headers.get("accept"), apiBase });
        return new Response("<main>menu</main>", { status: 200, headers: { "content-type": "text/html" } });
      },
    };
    const frontendRoutes = frontendRoutesWith([{ id: "admin-frontend", state: "success", result: renderer }]);
    expect(await route(frontendRoutes, "GET", "/menu?group=pizza", BROWSER_NAVIGATION)).to.equal("ssr:200 <main>menu</main>");
    expect(calls).to.deep.equal([{ url: "http://site.test/menu?group=pizza", method: "GET", accept: BROWSER_NAVIGATION, apiBase: "http://127.0.0.1:1337" }]);
  });

  it("follows the mode the module sets after the first answer, asking only once", async () => {
    const asked = { count: 0 };
    const renderer: any = { mode: "spa", handle: null };
    const frontendRoutes = frontendRoutesWith([{ id: "admin-frontend", state: "success", result: renderer }], asked);
    expect(await route(frontendRoutes, "GET", "/menu")).to.equal("view:index");
    renderer.handle = async () => new Response("server", { status: 404 });
    renderer.mode = "ssr";
    expect(await route(frontendRoutes, "GET", "/nope")).to.equal("ssr:404 server");
    expect(asked.count).to.equal(1);
  });

  it("stays static when two modules answer", async () => {
    const ssr = { mode: "ssr", handle: async () => new Response("server") };
    const frontendRoutes = frontendRoutesWith([
      { id: "admin-frontend", state: "success", result: ssr },
      { id: "another", state: "success", result: ssr },
    ]);
    expect(await route(frontendRoutes, "GET", "/menu")).to.equal("view:index");
  });
});
