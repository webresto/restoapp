'use strict';

/**
 * MCP Server — Model Context Protocol handler
 *
 * Registers tools of two types:
 *   - public    — accessible without a key
 *   - protected — require global MCP_ADMIN_KEY
 *
 * Tools are organized into GROUPS so that clients can discover capabilities
 * progressively instead of receiving every tool schema at once:
 *
 *   GET  /mcp                — server info + list of groups (short view).
 *                              Each group lists its tools by name + short
 *                              description + a call hint — but NOT full schemas.
 *   GET  /mcp/group/:group   — full details of the tools in one group
 *                              (JSON Schema + call docs).
 *   POST /mcp/call/:tool     — invoke a tool.
 *
 * Backward compatibility:
 *   - Tools registered without a `group` are auto-assigned to a group derived
 *     from their source file (the module that called registerTool).
 *   - GET /mcp?flat=1 returns the legacy flat list of all tools with schemas.
 *
 * Usage:
 *   const mcp = require('./McpServer');
 *   mcp.registerGroup({ name, description });                // optional
 *   mcp.registerTool({ name, group, description, shortDescription, mode, schema, handler });
 *
 * Mounted as Express middleware: mcp.middleware()
 */

const path = require('path');

const MCP_PATH = '/mcp';

/** Group tools land in when no group is given and no source could be inferred. */
const DEFAULT_GROUP = 'general';

/** @type {Map<string, McpTool>} */
const tools = new Map();

/** @type {Map<string, McpGroup>} */
const groups = new Map();

/**
 * @typedef {Object} McpTool
 * @property {string} name
 * @property {string} description        Full description (params, notes, examples).
 * @property {string} [shortDescription] One-line summary shown in the group listing.
 * @property {string} [group]            Group name this tool belongs to.
 * @property {'public'|'protected'} mode
 * @property {Object} [schema]           JSON Schema for input parameters (optional)
 * @property {Function} handler          async (params, ctx) => result
 */

/**
 * @typedef {Object} McpGroup
 * @property {string} name
 * @property {string} description  What the group of tools can do.
 * @property {boolean} [auto]      True if the group was auto-generated (legacy).
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
 * Derive a one-line short description from a fuller description string.
 * Takes the first sentence / first line and trims it.
 * @param {string} description
 * @returns {string}
 */
function deriveShortDescription(description) {
  if (!description) return '';
  const firstLine = String(description).split('\n')[0].trim();
  const firstSentence = firstLine.split(/(?<=[.!?])\s/)[0].trim();
  const short = firstSentence || firstLine;
  return short.length > 140 ? short.slice(0, 137) + '...' : short;
}

/**
 * Infer the source group for a legacy tool that did not declare a `group`.
 * Walks the call stack to find the first frame outside this file and uses its
 * file basename (without extension) as the group name — e.g. a tool registered
 * from `api/mcp/tools/menu.js` or `hook/mcp/dishes.ts` lands in group `menu`
 * or `dishes` respectively.
 * @returns {string}
 */
function inferSourceGroup() {
  const orig = Error.prepareStackTrace;
  try {
    Error.prepareStackTrace = (_err, stack) => stack;
    const err = new Error();
    const stack = err.stack || [];
    const selfFile = __filename;
    for (const frame of stack) {
      const file = typeof frame.getFileName === 'function' ? frame.getFileName() : null;
      if (!file || file === selfFile) continue;
      if (file.startsWith('node:') || file.includes('node_modules')) continue;
      const base = path.basename(file).replace(/\.[jt]s$/i, '');
      if (base && base !== 'McpServer') return base;
    }
  } catch (_e) {
    // fall through to default
  } finally {
    Error.prepareStackTrace = orig;
  }
  return DEFAULT_GROUP;
}

/**
 * Register a group. Idempotent: re-registering an explicit group upgrades a
 * previously auto-generated one and refreshes its description.
 * @param {McpGroup} group
 */
function registerGroup(group) {
  if (!group || !group.name) {
    throw new Error('MCP: group must have a name');
  }
  const existing = groups.get(group.name);
  if (existing && !existing.auto) {
    // Already explicitly registered — keep the first explicit definition.
    return groups.get(group.name);
  }
  const entry = {
    name: group.name,
    description: group.description || (existing && existing.description) || '',
    auto: group.auto === true,
  };
  groups.set(group.name, entry);
  return entry;
}

/**
 * Ensure a group exists for the given name; auto-create it if missing.
 * @param {string} name
 * @returns {McpGroup}
 */
function ensureGroup(name) {
  let group = groups.get(name);
  if (!group) {
    group = { name, description: '', auto: true };
    groups.set(name, group);
  }
  return group;
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

  // Resolve the group: explicit `group`, else inferred from the source file.
  const groupName = tool.group || inferSourceGroup();
  ensureGroup(groupName);

  const stored = {
    ...tool,
    group: groupName,
    shortDescription: tool.shortDescription || deriveShortDescription(tool.description),
  };
  tools.set(tool.name, stored);
  return stored;
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
 * Return the tools visible to the caller, optionally filtered by group.
 * @param {Object} req
 * @param {string} [groupName]
 * @returns {McpTool[]}
 */
function visibleTools(req, groupName) {
  const isAdmin = checkAdminKey(req);
  const result = [];
  for (const [, tool] of tools) {
    if (tool.mode !== 'public' && !isAdmin) continue;
    if (groupName && tool.group !== groupName) continue;
    result.push(tool);
  }
  return result;
}

/**
 * Build the full, self-contained call documentation for one tool.
 * @param {McpTool} tool
 * @returns {Object}
 */
function toolDetail(tool) {
  const exampleParams = buildExampleParams(tool.schema);
  const exampleBody = JSON.stringify(exampleParams);
  const authNote = tool.mode === 'protected'
    ? 'Required — pass X-Mcp-Key header or ?mcp_key= query param'
    : 'None';
  const curlAuth = tool.mode === 'protected'
    ? ' -H "X-Mcp-Key: <admin-key>"'
    : '';

  return {
    name: tool.name,
    group: tool.group,
    description: tool.description,
    shortDescription: tool.shortDescription,
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
  };
}

/**
 * Build the compact per-tool entry shown inside a group listing.
 * No schema — just enough to decide whether to drill in.
 * @param {McpTool} tool
 * @returns {Object}
 */
function toolSummary(tool) {
  return {
    name: tool.name,
    mode: tool.mode,
    description: tool.shortDescription || deriveShortDescription(tool.description),
    call: `POST /mcp/call/${tool.name}`,
  };
}

/**
 * Build the group catalogue visible to the caller.
 * Each group carries its description and a compact list of its tools.
 * Groups with no visible tools for this caller are omitted.
 * @param {Object} req
 * @param {string} baseUrl
 * @returns {Array}
 */
function groupList(req, baseUrl) {
  const byGroup = new Map();
  for (const tool of visibleTools(req)) {
    if (!byGroup.has(tool.group)) byGroup.set(tool.group, []);
    byGroup.get(tool.group).push(tool);
  }

  const result = [];
  for (const [name, groupTools] of byGroup) {
    const meta = groups.get(name) || { name, description: '', auto: true };
    result.push({
      name,
      description: meta.description || `Tools: ${groupTools.map(t => t.name).join(', ')}.`,
      auto: meta.auto === true,
      toolCount: groupTools.length,
      // Compact tool list — names + one-liners, no schemas.
      tools: groupTools.map(toolSummary),
      // How to fetch full schemas for this group.
      details: {
        method: 'GET',
        path: `${MCP_PATH}/group/${name}`,
        example: `curl ${baseUrl}${MCP_PATH}/group/${name}`,
      },
    });
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

/**
 * Legacy flat tool list — every visible tool with full schema + call docs.
 * Kept for backward compatibility (GET /mcp?flat=1).
 * @param {Object} req
 * @returns {Array}
 */
function toolList(req) {
  return visibleTools(req).map(toolDetail);
}

/**
 * Returns an Express-compatible middleware function.
 * Mount it in sails.config.http.middleware before 'router'.
 */
function middleware() {
  return async function mcpMiddleware(req, res, next) {
    if (process.env.NODE_ENV !== 'test' && process.env.MCP_ENABLED !== 'true') return next();

    const url = req.url.split('?')[0];
    const isAdmin = checkAdminKey(req);
    const baseUrl = `${req.protocol}://${req.headers.host}`;

    // GET /mcp — server info + group catalogue (or legacy flat list with ?flat=1)
    if (req.method === 'GET' && url === MCP_PATH) {
      const flat = req.query && (req.query.flat === '1' || req.query.flat === 'true' || req.query.all === '1');

      const base = {
        protocol: 'mcp',
        version: '1.1',

        info: {
          title: 'RestoApp MCP Server',
          description: 'MCP-compatible server for RestoApp. Tools are organized into groups: fetch the group catalogue here, then GET /mcp/group/:group for full schemas. Exposes tools in two access modes: public (no auth) and protected (admin key required).',
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
          groups: {
            method: 'GET',
            path: '/mcp',
            description: 'Returns server info and the catalogue of tool GROUPS available to the caller. Each group lists its tools by name + short description (no schemas). Unauthenticated callers see only groups containing public tools.',
            example: `curl ${baseUrl}/mcp`,
          },
          group: {
            method: 'GET',
            path: '/mcp/group/:group',
            description: 'Returns full details (JSON Schema + call docs) for every tool in one group. Use this after picking a group from the catalogue to avoid loading all tool schemas at once.',
            example: `curl ${baseUrl}/mcp/group/<group>`,
          },
          call: {
            method: 'POST',
            path: '/mcp/call/:toolName',
            description: 'Invoke a tool by name. Parameters are passed as a JSON body. Each tool detail includes its own call.example.',
            headers: { 'Content-Type': 'application/json' },
            example: `curl -X POST ${baseUrl}/mcp/call/health -H "Content-Type: application/json" -d '{}'`,
            response: {
              success: { tool: '<toolName>', result: '<any>' },
              error:   { error: '<message>' },
            },
          },
          flat: {
            method: 'GET',
            path: '/mcp?flat=1',
            description: 'Legacy: returns the full flat list of all tools with schemas, ungrouped. Prefer the grouped catalogue for large tool sets.',
            example: `curl ${baseUrl}/mcp?flat=1`,
          },
        },
      };

      if (flat) {
        return res.json({ ...base, tools: toolList(req) });
      }
      return res.json({ ...base, groups: groupList(req, baseUrl) });
    }

    // GET /mcp/group/:group — full tool details for one group
    if (req.method === 'GET' && url.startsWith(MCP_PATH + '/group/')) {
      const groupName = decodeURIComponent(url.slice((MCP_PATH + '/group/').length));
      const meta = groups.get(groupName);
      const groupTools = visibleTools(req, groupName);

      if (!meta && groupTools.length === 0) {
        return res.status(404).json({ error: `Group '${groupName}' not found` });
      }

      return res.json({
        protocol: 'mcp',
        version: '1.1',
        group: {
          name: groupName,
          description: (meta && meta.description) || `Tools: ${groupTools.map(t => t.name).join(', ')}.`,
          auto: meta ? meta.auto === true : true,
          toolCount: groupTools.length,
        },
        tools: groupTools.map(toolDetail),
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

/**
 * Call a tool internally (in-process), bypassing HTTP and admin-key checks.
 * Intended for trusted server-side callers (e.g. AI agent for admin users).
 * @param {string} toolName
 * @param {Object} [params={}]
 * @param {Object} [ctx={}]  optional context ({ req, res } or empty)
 * @returns {Promise<any>}
 */
async function callTool(toolName, params = {}, ctx = {}) {
  const tool = tools.get(toolName);
  if (!tool) {
    throw new Error(`MCP: tool '${toolName}' not found`);
  }
  return tool.handler(params, ctx);
}

/**
 * List tools visible at a given access level.
 * @param {'public'|'all'} level
 * @param {string} [groupName] optional group filter
 * @returns {Array<{name: string, group: string, description: string, mode: string, schema: Object}>}
 */
function listTools(level = 'all', groupName) {
  const result = [];
  for (const [, tool] of tools) {
    if (level !== 'all' && tool.mode !== 'public') continue;
    if (groupName && tool.group !== groupName) continue;
    result.push({
      name: tool.name,
      group: tool.group,
      description: tool.description,
      shortDescription: tool.shortDescription,
      mode: tool.mode,
      schema: tool.schema || { type: 'object', properties: {} },
    });
  }
  return result;
}

/**
 * List registered groups.
 * @returns {Array<McpGroup>}
 */
function listGroups() {
  return Array.from(groups.values()).map(g => ({ ...g }));
}

module.exports = {
  registerTool,
  registerGroup,
  middleware,
  tools,
  groups,
  callTool,
  listTools,
  listGroups,
};

// Expose as a global so any module can call mcp.registerTool(...)
// without needing a require() path — same pattern as the sails global.
global.mcp = module.exports;
