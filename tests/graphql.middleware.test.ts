import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import type { RequestHandler } from "express";
import { Readable } from "stream";

const http = require("http");
const rc = require("rc");
const SailsFactory = require("sails").Sails;

const GRAPHQL_HEALTHCHECK_QUERY = "{ _root }";
const GRAPHQL_READY_TIMEOUT = Number(process.env.GRAPHQL_READY_TIMEOUT ?? 120000);
const POLL_INTERVAL = 250;
const TEST_PORT = Number(process.env.TEST_HTTP_PORT ?? 42772);

patchHttpListen(TEST_PORT);

describe("GraphQL middleware", function () {
  this.timeout(180000);

  let sailsApp: any;
  let graphqlModule: any;
  let graphqlRouter: RequestHandler | undefined;

  before(async function () {
    sailsApp = await liftSailsApp();
    const graphqlPath = path.resolve(__dirname, "../node_modules/@webresto/graphql/src/graphql.js");
    graphqlModule = require(graphqlPath).default;
    await waitForGraphqlServer(() => graphqlModule.getServer?.());
    graphqlRouter = getGraphqlRouterHandle(sailsApp);
    expect(graphqlRouter, "GraphQL middleware should be registered on /graphql").to.exist;
  });

  after(async function () {
    if (sailsApp) {
      await lowerSailsApp(sailsApp);
      sailsApp = undefined;
    }
  });

  it("starts GraphQL server and exposes /graphql route", async function () {
    const apolloServer = graphqlModule.getServer();
    expect(apolloServer, "Apollo server should be initialized").to.exist;

    const executorResult = await apolloServer.executeOperation({
      query: GRAPHQL_HEALTHCHECK_QUERY,
    });

    expect(executorResult.errors).to.be.undefined;
    expect(executorResult.data).to.have.property("_root");

    const routeResponse = await invokeGraphqlRoute(
      graphqlRouter!,
      GRAPHQL_HEALTHCHECK_QUERY
    );

    expect(routeResponse.errors).to.be.undefined;
    expect(routeResponse.data).to.have.property("_root");
  });
});

async function liftSailsApp(): Promise<any> {
  configureRuntimeEnvironment();
  const config = rc("sails");

  config.environment = "test";
  config.port = TEST_PORT;
  config.host = "127.0.0.1";
  config.explicitHost = "127.0.0.1";
  config.log = { ...(config.log || {}), level: "error" };
  config.hooks = { ...(config.hooks || {}), grunt: false, adminpanel: false };
  config.datastores = config.datastores || {};
  config.datastores.default = config.datastores.default || { adapter: "sails-disk" };
  config.hooks["app-manager-proto"] =
    config.hooks["app-manager-proto"] || require(path.resolve(__dirname, "../api/hooks/app-manager-proto"));

  return new Promise((resolve, reject) => {
    SailsFactory().lift(config, (err: Error, liftedApp: any) => {
      if (err) {
        return reject(err);
      }
      return resolve(liftedApp);
    });
  });
}

async function lowerSailsApp(app: any): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    app.lower((err: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

function configureRuntimeEnvironment(): void {
  const projectRoot = process.cwd();
  process.env.NODE_ENV = process.env.NODE_ENV ?? "test";
  process.env.LOG_LEVEL = process.env.LOG_LEVEL ?? "error";
  process.env.ADMINPANEL_LAZY_GEN_ADMIN_DISABLE =
    process.env.ADMINPANEL_LAZY_GEN_ADMIN_DISABLE ?? "1";
  process.env.WEBRESTO_MODULES_PATH = process.env.WEBRESTO_MODULES_PATH ?? path.join(projectRoot, "modules");
  process.env.MM_SETTINGS_MODEL_DENY = process.env.MM_SETTINGS_MODEL_DENY ?? "1";

  if (!process.env.MM_SYSTEM_MODULES) {
    const systemModules = [
      path.join(projectRoot, "node_modules/@webresto/core"),
      path.join(projectRoot, "node_modules/@webresto/graphql"),
    ].filter((modulePath) => fs.existsSync(modulePath));
    process.env.MM_SYSTEM_MODULES = systemModules.join(";");
  }
}

async function waitForGraphqlServer(getServer: () => any): Promise<any> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < GRAPHQL_READY_TIMEOUT) {
    const server = getServer();
    if (server) {
      return server;
    }
    await delay(POLL_INTERVAL);
  }
  throw new Error("GraphQL server failed to initialize before timeout");
}

function getGraphqlRouterHandle(app: any): RequestHandler | undefined {
  const stack = app?.hooks?.http?.app?._router?.stack ?? [];
  for (const layer of stack) {
    if (!layer || !Array.isArray(layer.handle?.stack)) continue;
    const containsGraphql = layer.handle.stack.some((nestedLayer: any) => {
      if (!nestedLayer) return false;
      if (nestedLayer?.route?.path === "/graphql") {
        return true;
      }
      if (nestedLayer?.regexp && typeof nestedLayer.regexp.test === "function") {
        nestedLayer.regexp.lastIndex = 0;
        return nestedLayer.regexp.test("/graphql");
      }
      if (typeof nestedLayer?.regexp?.toString === "function") {
        return nestedLayer.regexp.toString().includes("\\/graphql");
      }
      return false;
    });
    if (containsGraphql && typeof layer.handle === "function") {
      return layer.handle;
    }
  }
  return undefined;
}

async function invokeGraphqlRoute(router: RequestHandler, query: string) {
  return new Promise<any>((resolve, reject) => {
    const req = createMockRequest({ query });
    const res = createMockResponse(resolve);
    router(req as any, res as any, (err?: Error) => {
      if (err) {
        return reject(err);
      }
      return reject(new Error("GraphQL middleware delegated to next() without responding"));
    });
  });
}

function createMockRequest(body: any) {
  const rawBody = JSON.stringify(body);
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(rawBody).toString(),
    host: "127.0.0.1",
  };
  const rawHeaders = Object.entries(headers).flat();
  const socket = createMockSocket();
  let consumed = false;
  const req = new Readable({
    read() {
      if (consumed) return;
      this.push(Buffer.from(rawBody));
      this.push(null);
      consumed = true;
    },
  }) as Readable & {
    headers: Record<string, string>;
    rawHeaders: string[];
    method: string;
    url: string;
    query: Record<string, unknown>;
    socket: any;
    connection: any;
    body?: any;
    get: (header: string) => string | undefined;
  };

  req.headers = headers;
  req.rawHeaders = rawHeaders;
  req.method = "POST";
  req.url = "/graphql";
  req.query = {};
  req.socket = socket;
  req.connection = socket;
  req.get = (header: string) => headers[header.toLowerCase()];

  return req;
}

function createMockSocket() {
  return {
    encrypted: false,
    remoteAddress: "127.0.0.1",
    remotePort: TEST_PORT,
    setTimeout() {
      return this;
    },
    setNoDelay() {
      return this;
    },
    setKeepAlive() {
      return this;
    },
    on() {
      return this;
    },
  };
}

function createMockResponse(resolve: (payload: any) => void) {
  return {
    headers: {} as Record<string, string>,
    statusCode: 200,
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    },
    getHeader(name: string) {
      return this.headers[name.toLowerCase()];
    },
    send(payload: any) {
      resolve(parsePayload(payload));
    },
    end(payload: any) {
      resolve(parsePayload(payload));
    },
  };
}

function parsePayload(payload: any) {
  if (payload === undefined || payload === null) {
    return payload;
  }

  if (typeof payload === "string") {
    try {
      return JSON.parse(payload);
    } catch {
      return payload;
    }
  }

  return payload;
}

function patchHttpListen(fakePort: number) {
  if ((http.Server.prototype as any).__graphqlPatched) {
    return;
  }

  const originalAddress = http.Server.prototype.address;

  http.Server.prototype.listen = function (...args: any[]) {
    this.__fakeAddress = {
      address: "127.0.0.1",
      family: "IPv4",
      port: fakePort,
    };
    const lastArg = args[args.length - 1];
    const callback = typeof lastArg === "function" ? args.pop() : undefined;
    setImmediate(() => {
      this.emit("listening");
      if (callback) {
        callback();
      }
    });
    return this;
  };

  http.Server.prototype.address = function () {
    if (this.__fakeAddress) {
      return this.__fakeAddress;
    }
    return originalAddress ? originalAddress.call(this) : null;
  };

  (http.Server.prototype as any).__graphqlPatched = true;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
