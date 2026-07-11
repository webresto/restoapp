import { expect } from "chai";

// Reset module registry between runs so each test suite gets a fresh McpServer state
function requireFreshMcp() {
  delete require.cache[require.resolve("../api/mcp/McpServer")];
  return require("../api/mcp/McpServer");
}

// ---------- helpers ----------

function makeReq(opts: {
  method?: string;
  url?: string;
  body?: any;
  headers?: Record<string, string>;
  query?: Record<string, string>;
}) {
  return {
    method: opts.method ?? "GET",
    url: opts.url ?? "/mcp",
    body: opts.body ?? {},
    headers: { host: "localhost:1337", ...(opts.headers ?? {}) },
    query: opts.query ?? {},
    protocol: "http",
  };
}

// Flatten all tool names out of the grouped catalogue returned by GET /mcp.
function groupedToolNames(body: any): string[] {
  return (body.groups ?? []).flatMap((g: any) => (g.tools ?? []).map((t: any) => t.name));
}

function makeRes() {
  const res: any = {
    _status: 200,
    _body: undefined as any,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: any) {
      this._body = body;
      return this;
    },
  };
  return res;
}

// ---------- McpServer unit tests ----------

describe("McpServer — registerTool", function () {
  let mcp: any;

  beforeEach(function () {
    mcp = requireFreshMcp();
  });

  it("registers a public tool", function () {
    mcp.registerTool({
      name: "ping",
      description: "ping",
      mode: "public",
      handler: async () => "pong",
    });
    expect(mcp.tools.has("ping")).to.be.true;
    expect(mcp.tools.get("ping").mode).to.equal("public");
  });

  it("registers a protected tool", function () {
    mcp.registerTool({
      name: "secret",
      description: "secret",
      mode: "protected",
      handler: async () => "ok",
    });
    expect(mcp.tools.get("secret").mode).to.equal("protected");
  });

  it("throws on duplicate tool name", function () {
    mcp.registerTool({ name: "dup", description: "", mode: "public", handler: async () => null });
    expect(() =>
      mcp.registerTool({ name: "dup", description: "", mode: "public", handler: async () => null })
    ).to.throw(/already registered/);
  });

  it("throws on invalid mode", function () {
    expect(() =>
      mcp.registerTool({ name: "bad", description: "", mode: "admin" as any, handler: async () => null })
    ).to.throw(/mode must be/);
  });

  it("throws when handler is missing", function () {
    expect(() =>
      mcp.registerTool({ name: "nohandler", description: "", mode: "public" } as any)
    ).to.throw(/name and handler/);
  });
});

// ---------- middleware — GET /mcp ----------

describe("McpServer middleware — GET /mcp", function () {
  let mcp: any;
  let handle: Function;

  beforeEach(function () {
    mcp = requireFreshMcp();
    mcp.registerTool({ name: "pub", description: "public tool", mode: "public", handler: async () => null });
    mcp.registerTool({ name: "priv", description: "protected tool", mode: "protected", handler: async () => null });
    handle = mcp.middleware();
  });

  it("returns protocol, version, info, endpoints and tools fields", async function () {
    const req = makeReq({ method: "GET", url: "/mcp" });
    const res = makeRes();
    await handle(req, res, () => { throw new Error("next() should not be called"); });

    expect(res._status).to.equal(200);
    expect(res._body).to.have.property("protocol", "mcp");
    expect(res._body).to.have.property("version");
    expect(res._body).to.have.property("info");
    expect(res._body).to.have.property("endpoints");
    expect(res._body).to.have.property("groups");
  });

  it("unauthenticated request sees only public tools", async function () {
    const req = makeReq({ method: "GET", url: "/mcp" });
    const res = makeRes();
    await handle(req, res, () => {});

    const names = groupedToolNames(res._body);
    expect(names).to.include("pub");
    expect(names).to.not.include("priv");
  });

  it("authenticated request (header) sees all tools", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    try {
      const req = makeReq({ method: "GET", url: "/mcp", headers: { "x-mcp-key": "test-secret" } });
      const res = makeRes();
      await handle(req, res, () => {});

      const names = groupedToolNames(res._body);
      expect(names).to.include("pub");
      expect(names).to.include("priv");
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("authenticated request (query param) sees all tools", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    try {
      const req = makeReq({ method: "GET", url: "/mcp?mcp_key=test-secret", query: { mcp_key: "test-secret" } });
      const res = makeRes();
      await handle(req, res, () => {});

      const names = groupedToolNames(res._body);
      expect(names).to.include("priv");
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("each tool entry contains call documentation", async function () {
    const req = makeReq({ method: "GET", url: "/mcp?flat=1", query: { flat: "1" } });
    const res = makeRes();
    await handle(req, res, () => {});

    const tool = res._body.tools.find((t: any) => t.name === "pub");
    expect(tool).to.have.property("call");
    expect(tool.call).to.have.property("method", "POST");
    expect(tool.call).to.have.property("path", "/mcp/call/pub");
    expect(tool.call).to.have.property("auth");
    expect(tool.call).to.have.property("example");
    expect(tool.call).to.have.property("response");
  });

  it("auth status is 'unauthenticated' without key", async function () {
    const req = makeReq({ method: "GET", url: "/mcp" });
    const res = makeRes();
    await handle(req, res, () => {});

    expect(res._body.info.auth.status).to.equal("unauthenticated");
  });

  it("auth status is 'authenticated' with correct key", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    try {
      const req = makeReq({ method: "GET", url: "/mcp", headers: { "x-mcp-key": "test-secret" } });
      const res = makeRes();
      await handle(req, res, () => {});

      expect(res._body.info.auth.status).to.equal("authenticated");
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("wrong key still yields 'unauthenticated'", async function () {
    process.env.MCP_ADMIN_KEY = "real-secret";
    try {
      const req = makeReq({ method: "GET", url: "/mcp", headers: { "x-mcp-key": "wrong" } });
      const res = makeRes();
      await handle(req, res, () => {});

      expect(res._body.info.auth.status).to.equal("unauthenticated");
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("passes non-MCP requests to next()", async function () {
    const req = makeReq({ method: "GET", url: "/something-else" });
    const res = makeRes();
    let nextCalled = false;
    await handle(req, res, () => { nextCalled = true; });
    expect(nextCalled).to.be.true;
  });
});

// ---------- middleware — POST /mcp/call/:tool ----------

describe("McpServer middleware — POST /mcp/call", function () {
  let mcp: any;
  let handle: Function;

  beforeEach(function () {
    mcp = requireFreshMcp();
    mcp.registerTool({
      name: "echo",
      description: "echoes params",
      mode: "public",
      handler: async (params: any) => params,
    });
    mcp.registerTool({
      name: "secret-echo",
      description: "protected echo",
      mode: "protected",
      handler: async (params: any) => params,
    });
    mcp.registerTool({
      name: "boom",
      description: "always throws",
      mode: "public",
      handler: async () => { throw new Error("kaboom"); },
    });
    handle = mcp.middleware();
  });

  it("calls a public tool and returns result", async function () {
    const req = makeReq({ method: "POST", url: "/mcp/call/echo", body: { msg: "hello" } });
    const res = makeRes();
    await handle(req, res, () => {});

    expect(res._status).to.equal(200);
    expect(res._body.tool).to.equal("echo");
    expect(res._body.result).to.deep.equal({ msg: "hello" });
  });

  it("returns 404 for unknown tool", async function () {
    const req = makeReq({ method: "POST", url: "/mcp/call/nonexistent", body: {} });
    const res = makeRes();
    await handle(req, res, () => {});

    expect(res._status).to.equal(404);
    expect(res._body).to.have.property("error");
  });

  it("returns 401 for protected tool without key", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    try {
      const req = makeReq({ method: "POST", url: "/mcp/call/secret-echo", body: {} });
      const res = makeRes();
      await handle(req, res, () => {});

      expect(res._status).to.equal(401);
      expect(res._body.error).to.match(/Admin key required/);
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("calls protected tool with correct key", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    try {
      const req = makeReq({
        method: "POST",
        url: "/mcp/call/secret-echo",
        body: { x: 1 },
        headers: { "x-mcp-key": "test-secret" },
      });
      const res = makeRes();
      await handle(req, res, () => {});

      expect(res._status).to.equal(200);
      expect(res._body.result).to.deep.equal({ x: 1 });
    } finally {
      delete process.env.MCP_ADMIN_KEY;
    }
  });

  it("returns 500 when tool throws", async function () {
    const req = makeReq({ method: "POST", url: "/mcp/call/boom", body: {} });
    const res = makeRes();
    await handle(req, res, () => {});

    expect(res._status).to.equal(500);
    expect(res._body.error).to.equal("kaboom");
  });
});

// ---------- buildExampleParams via schema in tool list ----------

describe("McpServer — schema example generation", function () {
  let mcp: any;
  let handle: Function;

  beforeEach(function () {
    mcp = requireFreshMcp();
    mcp.registerTool({
      name: "typed",
      description: "typed params",
      mode: "public",
      schema: {
        type: "object",
        properties: {
          name:    { type: "string" },
          count:   { type: "integer" },
          active:  { type: "boolean" },
          tags:    { type: "array" },
          meta:    { type: "object" },
          custom:  { type: "string", example: "my-example" },
          status:  { type: "string", enum: ["a", "b"] },
        },
      },
      handler: async () => null,
    });
    handle = mcp.middleware();
  });

  it("generates example params from JSON Schema", async function () {
    const req = makeReq({ method: "GET", url: "/mcp?flat=1", query: { flat: "1" } });
    const res = makeRes();
    await handle(req, res, () => {});

    const tool = res._body.tools.find((t: any) => t.name === "typed");
    const body = tool.call.body;

    expect(body.name).to.equal("<name>");
    expect(body.count).to.equal(0);
    expect(body.active).to.equal(true);
    expect(body.tags).to.deep.equal([]);
    expect(body.meta).to.deep.equal({});
    expect(body.custom).to.equal("my-example");
    expect(body.status).to.equal("a");
  });

  it("curl example contains the tool name", async function () {
    const req = makeReq({ method: "GET", url: "/mcp?flat=1", query: { flat: "1" } });
    const res = makeRes();
    await handle(req, res, () => {});

    const tool = res._body.tools.find((t: any) => t.name === "typed");
    expect(tool.call.example).to.include("/mcp/call/typed");
  });
});
