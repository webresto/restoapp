'use strict';

/**
 * MCP Server — Model Context Protocol handler
 *
 * Registers tools of two types:
 *   - public    — accessible without a key
 *   - protected — require global MCP_ADMIN_KEY
 *
 * Usage:
 *   const mcp = require('./McpServer');
 *   mcp.registerTool({ name, description, mode, schema, handler });
 *
 * Mounted as Express middleware: mcp.middleware()
 *
 * Endpoints:
 *   GET  /mcp            — server info + list of available tools
 *   POST /mcp/call/:tool — invoke a tool
 */

const MCP_PATH = '/mcp';

/** @type {Map<string, McpTool>} */
const tools = new Map();

/**
 * @typedef {Object} McpTool
 * @property {string} name
 * @property {string} description
 * @property {'public'|'protected'} mode
 * @property {Object} [schema]   JSON Schema for input parameters (optional)
 * @property {Function} handler  async (params, ctx) => result
 */

/**
 * Build an example params object from JSON Schema properties.
 * Uses the `example` field if provided on each property, otherwise
 * falls back to a sensible placeholder based on the type.
 * @param {Object} schema
 * @returns {Object}
 */
function buildExampleParams(schema) {
  if (!schema || !schema.properties) return {};
  const example = {};
  for (const [key, def] of Object.entries(schema.properties)) {
    if (def.example !== undefined) {
      example[key] = def.example;
    } else if (def.type === 'string') {
      example[key] = def.enum ? def.enum[0] : `<${key}>`;
    } else if (def.type === 'number' || def.type === 'integer') {
      example[key] = 0;
    } else if (def.type === 'boolean') {
      example[key] = true;
    } else if (def.type === 'array') {
      example[key] = [];
    } else if (def.type === 'object') {
      example[key] = {};
    } else {
      example[key] = null;
    }
  }
  return example;
}

/**
 * Register a tool.
 * @param {McpTool} tool
 */
function registerTool(tool) {
  if (!tool.name || typeof tool.handler !== 'function') {
    throw new Error('MCP: tool must have name and handler');
  }
  if (!['public', 'protected'].includes(tool.mode)) {
    throw new Error(`MCP: tool mode must be 'public' or 'protected', got '${tool.mode}'`);
  }
  if (tools.has(tool.name)) {
    throw new Error(`MCP: tool '${tool.name}' is already registered`);
  }
  tools.set(tool.name, tool);
}

/**
 * Validate the global admin key from the request.
 * Key can be passed via header X-Mcp-Key or query param mcp_key.
 * @param {Object} req
 * @returns {boolean}
 */
function checkAdminKey(req) {
  const adminKey = process.env.MCP_ADMIN_KEY;
  if (!adminKey) return false;

  const provided = req.headers['x-mcp-key'] || req.query['mcp_key'];
  return provided === adminKey;
}

/**
 * Build the tool list visible to the caller.
 * Unauthenticated callers see only public tools.
 * Admin callers see all tools.
 * Each tool entry includes self-contained call documentation.
 * @param {Object} req
 * @returns {Array}
 */
function toolList(req) {
  const isAdmin = checkAdminKey(req);
  const result = [];

  for (const [, tool] of tools) {
    if (tool.mode !== 'public' && !isAdmin) continue;

    const exampleParams = buildExampleParams(tool.schema);
    const exampleBody = JSON.stringify(exampleParams);
    const authNote = tool.mode === 'protected'
      ? 'Required — pass X-Mcp-Key header or ?mcp_key= query param'
      : 'None';
    const curlAuth = tool.mode === 'protected'
      ? ' -H "X-Mcp-Key: <admin-key>"'
      : '';

    result.push({
      name: tool.name,
      description: tool.description,
      mode: tool.mode,

      // Input schema (JSON Schema) — describes accepted parameters
      schema: tool.schema || { type: 'object', properties: {} },

      // How to call this tool
      call: {
        method: 'POST',
        path: `/mcp/call/${tool.name}`,
        headers: {
          'Content-Type': 'application/json',
          ...(tool.mode === 'protected' ? { 'X-Mcp-Key': '<admin-key>' } : {}),
        },
        auth: authNote,
        body: exampleParams,
        example: `curl -X POST <host>/mcp/call/${tool.name}${curlAuth} -H "Content-Type: application/json" -d '${exampleBody}'`,
        response: {
          success: { tool: tool.name, result: '<any>' },
          error:   { error: '<message>' },
        },
      },
    });
  }

  return result;
}

/**
 * Returns an Express-compatible middleware function.
 * Mount it in sails.config.http.middleware before 'router'.
 */
function middleware() {
  return async function mcpMiddleware(req, res, next) {
    const url = req.url.split('?')[0];

    // GET /mcp — server info + tool catalogue
    if (req.method === 'GET' && url === MCP_PATH) {
      const isAdmin = checkAdminKey(req);
      const baseUrl = `${req.protocol}://${req.headers.host}`;

      return res.json({
        protocol: 'mcp',
        version: '1.0',

        info: {
          title: 'RestoApp MCP Server',
          description: 'MCP-compatible server for RestoApp. Exposes tools in two access modes: public (no auth) and protected (admin key required).',
          auth: {
            type: 'api-key',
            description: 'To access protected tools, pass the admin key using one of the methods below.',
            methods: [
              { type: 'header', name: 'X-Mcp-Key', example: 'X-Mcp-Key: <your-admin-key>' },
              { type: 'query',  name: 'mcp_key',   example: `${baseUrl}/mcp?mcp_key=<your-admin-key>` },
            ],
            status: isAdmin ? 'authenticated' : 'unauthenticated',
          },
        },

        endpoints: {
          list: {
            method: 'GET',
            path: '/mcp',
            description: 'Returns server info and the list of tools available to the caller. Unauthenticated callers see only public tools.',
            example: `curl ${baseUrl}/mcp`,
          },
          call: {
            method: 'POST',
            path: '/mcp/call/:toolName',
            description: 'Invoke a tool by name. Parameters are passed as a JSON body. Each tool in the list includes its own call.example.',
            headers: { 'Content-Type': 'application/json' },
            example: `curl -X POST ${baseUrl}/mcp/call/health -H "Content-Type: application/json" -d '{}'`,
            response: {
              success: { tool: '<toolName>', result: '<any>' },
              error:   { error: '<message>' },
            },
          },
        },

        tools: toolList(req),
      });
    }

    // POST /mcp/call/:tool — invoke
    if (req.method === 'POST' && url.startsWith(MCP_PATH + '/call/')) {
      const toolName = url.slice((MCP_PATH + '/call/').length);
      const tool = tools.get(toolName);

      if (!tool) {
        return res.status(404).json({ error: `Tool '${toolName}' not found` });
      }

      if (tool.mode === 'protected' && !checkAdminKey(req)) {
        return res.status(401).json({ error: 'Admin key required for this tool' });
      }

      try {
        const params = req.body || {};
        const result = await tool.handler(params, { req, res });
        return res.json({ tool: toolName, result });
      } catch (err) {
        return res.status(500).json({ error: err.message || 'Tool execution failed' });
      }
    }

    return next();
  };
}

module.exports = { registerTool, middleware, tools };
