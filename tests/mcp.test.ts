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
      expect(res._body.error).to.match(/Admin access required/);
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

// ---------- compact views ----------

describe("McpServer — compact views", function () {
  let mcp: any;
  let handle: Function;

  beforeEach(function () {
    delete process.env.MCP_DEFAULT_VIEW;
    mcp = requireFreshMcp();
    mcp.registerGroup({ name: "promotions", description: "Promotions and discounts." });
    mcp.registerTool({
      name: "promotion-create",
      group: "promotions",
      description: "Create a promotion. A long text about every field that only the tool view carries.",
      shortDescription: "Create a promotion.",
      mode: "protected",
      schema: {
        type: "object",
        properties: { name: { type: "string" }, discount: { type: "number" }, enable: { type: "boolean" } },
        required: ["name", "discount"],
      },
      handler: async () => "created",
    });
    mcp.registerTool({
      name: "promotion-list",
      group: "promotions",
      description: "List promotions.",
      mode: "public",
      handler: async () => [],
    });
    mcp.registerTool({
      name: "health",
      group: "health",
      description: "Liveness.",
      mode: "public",
      handler: async () => "ok",
    });
    handle = mcp.middleware();
  });

  afterEach(function () {
    delete process.env.MCP_DEFAULT_VIEW;
    delete process.env.MCP_ADMIN_KEY;
  });

  async function get(url: string, headers: Record<string, string> = {}) {
    const query = Object.fromEntries(new URLSearchParams(url.split("?")[1] ?? ""));
    const res = makeRes();
    await handle(makeReq({ method: "GET", url, query, headers }), res, () => { throw new Error("next() should not be called"); });
    return res;
  }

  it("catalog() lists groups with the names of their tools only", function () {
    const catalog = mcp.catalog("all");
    expect(catalog.groupCount).to.equal(2);
    expect(catalog.toolCount).to.equal(3);
    expect(catalog.groups).to.deep.equal([
      { name: "health", tools: ["health"] },
      { name: "promotions", description: "Promotions and discounts.", tools: ["promotion-create", "promotion-list"] },
    ]);
  });

  it("catalog('public') leaves protected tools out", function () {
    const names = mcp.catalog("public").groups.flatMap((g: any) => g.tools);
    expect(names).to.have.members(["promotion-list", "health"]);
  });

  it("describeGroup() gives a one-liner and the parameter names, no schema", function () {
    const group = mcp.describeGroup("promotions");
    expect(group.toolCount).to.equal(2);
    expect(group.tools[0]).to.deep.equal({
      name: "promotion-create",
      mode: "protected",
      description: "Create a promotion.",
      params: "name*, discount*, enable",
    });
    expect(group.tools[1]).to.not.have.property("params");
    expect(mcp.describeGroup("nope")).to.equal(null);
  });

  it("describeTools() gives the schema of the named tools and similar names for the rest", function () {
    const described = mcp.describeTools(["promotion-create", "create-promotion"]);
    expect(described.tools).to.have.length(1);
    expect(described.tools[0].schema.required).to.deep.equal(["name", "discount"]);
    expect(described.tools[0].description).to.contain("A long text");
    expect(described.tools[0]).to.not.have.property("call");
    expect(described.notFound).to.deep.equal([{ name: "create-promotion", similar: ["promotion-create", "promotion-list"] }]);
  });

  it("listTools() and listGroups() keep their shape", function () {
    const tool = mcp.listTools("all", "promotions")[0];
    expect(tool).to.have.keys(["name", "group", "description", "shortDescription", "mode", "schema"]);
    expect(mcp.listGroups().map((g: any) => g.name)).to.include("promotions");
  });

  it("GET /mcp stays the full catalogue by default", async function () {
    const res = await get("/mcp");
    expect(res._body).to.have.property("endpoints");
    expect(res._body).to.not.have.property("view");
    expect(res._body.groups.find((g: any) => g.name === "health").tools[0]).to.have.property("call");
  });

  it("GET /mcp?view=compact answers with groups and tool names", async function () {
    const res = await get("/mcp?view=compact");
    expect(res._body.view).to.equal("compact");
    expect(res._body.auth).to.equal("unauthenticated");
    expect(res._body).to.not.have.property("endpoints");
    expect(res._body.usage.group).to.contain("?view=compact");
    expect(res._body.groups).to.deep.equal([
      { name: "health", tools: ["health"] },
      { name: "promotions", description: "Promotions and discounts.", tools: ["promotion-list"] },
    ]);
  });

  it("MCP_DEFAULT_VIEW=compact switches the default, ?view=full and ?flat=1 bring the old answers", async function () {
    process.env.MCP_DEFAULT_VIEW = "compact";
    expect((await get("/mcp"))._body.view).to.equal("compact");
    expect((await get("/mcp"))._body.usage.group).to.not.contain("view=");
    expect((await get("/mcp?view=full"))._body).to.have.property("endpoints");
    expect((await get("/mcp?flat=1"))._body.tools[0]).to.have.property("call");
    expect((await get("/mcp/group/promotions"))._body.view).to.equal("compact");
    expect((await get("/mcp/group/promotions?view=full"))._body.tools[0]).to.have.property("schema");
  });

  it("GET /mcp/group/:group?view=compact hides protected tools and schemas", async function () {
    const res = await get("/mcp/group/promotions?view=compact");
    expect(res._body.group).to.equal("promotions");
    expect(res._body.tools).to.deep.equal([{ name: "promotion-list", mode: "public", description: "List promotions." }]);
  });

  it("GET /mcp/tool/:names answers with schemas, a protected tool needs the key", async function () {
    process.env.MCP_ADMIN_KEY = "test-secret";
    const anonymous = await get("/mcp/tool/promotion-create");
    expect(anonymous._status).to.equal(404);

    const res = await get("/mcp/tool/promotion-create,promotion-list,nope", { "x-mcp-key": "test-secret" });
    expect(res._status).to.equal(200);
    expect(res._body.tools.map((t: any) => t.name)).to.deep.equal(["promotion-create", "promotion-list"]);
    expect(res._body.tools[0].schema.properties).to.have.property("discount");
    expect(res._body.notFound[0].name).to.equal("nope");
    expect(res._body.usage.call).to.contain("POST /mcp/call/");
  });

  it("POST /mcp/call of an unknown tool names similar ones", async function () {
    const res = makeRes();
    await handle(makeReq({ method: "POST", url: "/mcp/call/promotion-lst" }), res, () => {});
    expect(res._status).to.equal(404);
    expect(res._body.similar).to.deep.equal(["promotion-list"]);
  });
});
