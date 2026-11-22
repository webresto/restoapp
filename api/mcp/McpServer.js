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
 * Compact views (a client that pays for every byte it reads — an LLM):
 *   GET  /mcp?view=compact              — groups with the NAMES of their tools.
 *   GET  /mcp/group/:group?view=compact — one line + parameter names per tool.
 *   GET  /mcp/tool/:name[,:name...]     — full description + JSON Schema of
 *                                         the named tools only.
 *   MCP_DEFAULT_VIEW=compact makes the compact view the default one;
 *   ?view=full then brings the full view back.
 *   In-process: mcp.catalog(), mcp.describeGroup(), mcp.describeTools(),
 *   mcp.suggestTools().
 *
 * Backward compatibility:
 *   - Tools registered without a `group` are auto-assigned to a group derived
 *     from their source file (the module that called registerTool).
 *   - GET /mcp?flat=1 returns the legacy flat list of all tools with schemas.
 *   - The compact views are derived from what tools already declare: nothing
 *     changes in registerTool / registerGroup, and listTools / listGroups keep
 *     their shape.
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

  // `req` may be a bare/virtual request object: neither headers nor query are
  // guaranteed. On top of that, this middleware is mounted before Sails' router,
  // so `req.query` is not necessarily initialized yet — the raw URL is parsed as
  // a fallback so the documented `?mcp_key=` form works at this point in the
  // pipeline.
  const headers = (req && req.headers) || {};
  const query = (req && req.query) || {};
  const rawQuery = req && typeof req.url === 'string' && req.url.split('?')[1];
  const urlKey = rawQuery && new URLSearchParams(rawQuery).get('mcp_key');
  const provided = headers['x-mcp-key'] || query['mcp_key'] || urlKey;
  return provided === adminKey;
}

/**
 * Protected MCP access is granted either by the global admin key or by an
 * authenticated Adminpanel administrator session.
 * @param {Object} req
 * @returns {boolean}
 */
function hasProtectedAccess(req) {
  if (checkAdminKey(req)) return true;
  return Boolean(req && req.user && req.user.isAdministrator === true);
}

/**
 * Return the tools visible to the caller, optionally filtered by group.
 * @param {Object} req
 * @param {string} [groupName]
 * @returns {McpTool[]}
 */
function visibleTools(req, groupName) {
  const isAdmin = hasProtectedAccess(req);
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
    ? 'Required for external clients — pass X-Mcp-Key header or ?mcp_key= query param. Adminpanel administrators may call it without a key.'
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

// ---------------------------------------------------------------------------
// Compact views — progressive disclosure in three steps, each one carrying only
// what the next step needs:
//   1. catalogue  — groups with the NAMES of their tools
//   2. group      — one line per tool + the names of its parameters
//   3. tool       — full description + JSON Schema of the tools asked for
// The registration contract (registerTool / registerGroup) is not involved:
// everything here is derived from what tools already declare.
// ---------------------------------------------------------------------------

/**
 * Parameter names of a tool as one string; a required one carries `*`.
 * @param {Object} [schema]
 * @returns {string}
 */
function paramSignature(schema) {
  if (!schema || !schema.properties) return '';
  const required = new Set(Array.isArray(schema.required) ? schema.required : []);
  return Object.keys(schema.properties)
    .map(key => (required.has(key) ? `${key}*` : key))
    .join(', ');
}

/**
 * Tools visible at an access level (the in-process counterpart of visibleTools).
 * @param {'public'|'all'} level
 * @returns {McpTool[]}
 */
function toolsAtLevel(level) {
  return Array.from(tools.values()).filter(tool => level === 'all' || tool.mode === 'public');
}

/**
 * Step 1: groups with the names of their tools — no descriptions of tools, no schemas.
 * @param {McpTool[]} list
 * @returns {{groupCount: number, toolCount: number, groups: Array}}
 */
function compactCatalog(list) {
  const byGroup = new Map();
  for (const tool of list) {
    if (!byGroup.has(tool.group)) byGroup.set(tool.group, []);
    byGroup.get(tool.group).push(tool.name);
  }
  const result = [];
  for (const [name, names] of byGroup) {
    const meta = groups.get(name);
    const entry = { name };
    if (meta && meta.description) entry.description = meta.description;
    entry.tools = names;
    result.push(entry);
  }
  result.sort((a, b) => a.name.localeCompare(b.name));
  return { groupCount: result.length, toolCount: list.length, groups: result };
}

/**
 * Step 2: the tools of one group — a one-liner and the parameter names of each.
 * @param {McpTool[]} list  tools visible to the caller
 * @param {string} groupName
 * @returns {Object|null}  null when the caller sees no such group
 */
function compactGroup(list, groupName) {
  const groupTools = list.filter(tool => tool.group === groupName);
  if (groupTools.length === 0) return null;
  const meta = groups.get(groupName);
  const result = { group: groupName };
  if (meta && meta.description) result.description = meta.description;
  result.toolCount = groupTools.length;
  result.paramsNote = 'params: names of the parameters, * marks a required one';
  result.tools = groupTools.map(tool => {
    const entry = {
      name: tool.name,
      mode: tool.mode,
      description: tool.shortDescription || deriveShortDescription(tool.description),
    };
    const params = paramSignature(tool.schema);
    if (params) entry.params = params;
    return entry;
  });
  return result;
}

/**
 * Names of the tools closest to a name that was not found: the same words in
 * another order (`create-promotion` → `promotion-create`), a part of the name,
 * a typo.
 * @param {McpTool[]} list
 * @param {string} name
 * @param {number} [limit=5]
 * @returns {string[]}
 */
function similarToolNames(list, name, limit = 5) {
  const wanted = String(name || '').toLowerCase();
  const words = wanted.split(/[^a-z0-9]+/).filter(Boolean);
  if (words.length === 0) return [];
  const scored = [];
  for (const tool of list) {
    const candidate = tool.name.toLowerCase();
    const candidateWords = candidate.split(/[^a-z0-9]+/).filter(Boolean);
    let score = 0;
    for (const word of words) {
      if (candidateWords.includes(word)) score += 3;
      else if (word.length >= 3 && candidateWords.some(w => w.startsWith(word) || word.startsWith(w))) score += 2;
      else if (word.length >= 3 && candidate.includes(word)) score += 1;
    }
    if (tool.group && words.includes(String(tool.group).toLowerCase())) score += 1;
    if (score > 0) scored.push({ name: tool.name, score });
  }
  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, limit).map(entry => entry.name);
}

/**
 * Step 3: full description + JSON Schema of the named tools only.
 * @param {McpTool[]} list  tools visible to the caller
 * @param {string[]} names
 * @returns {{tools: Array, notFound?: Array<{name: string, similar: string[]}>}}
 */
function describeAmong(list, names) {
  const byName = new Map(list.map(tool => [tool.name, tool]));
  const found = [];
  const notFound = [];
  for (const name of Array.from(new Set(names || []))) {
    const tool = byName.get(name);
    if (tool) {
      found.push({
        name: tool.name,
        group: tool.group,
        mode: tool.mode,
        description: tool.description,
        schema: tool.schema || { type: 'object', properties: {} },
      });
    } else {
      notFound.push({ name, similar: similarToolNames(list, name) });
    }
  }
  const result = { tools: found };
  if (notFound.length) result.notFound = notFound;
  return result;
}

/**
 * How to go on from a compact response — said once per response instead of a
 * `call` block inside every tool.
 * @param {string} view  the view the caller is in: its links keep it
 * @returns {Object}
 */
function compactUsage(view) {
  const suffix = view === 'compact' && defaultView() !== 'compact' ? '?view=compact' : '';
  return {
    catalogue: `GET ${MCP_PATH}${suffix} — groups with the names of their tools`,
    group: `GET ${MCP_PATH}/group/<group>${suffix} — the tools of a group with the names of their parameters`,
    tool: `GET ${MCP_PATH}/tool/<name>[,<name>...] — full description and JSON Schema of the named tools`,
    call: `POST ${MCP_PATH}/call/<name> with Content-Type: application/json, the body is the object of parameters; answers {"tool","result"} or {"error"}`,
    auth: 'protected tools: X-Mcp-Key header or ?mcp_key= query param',
  };
}

/**
 * The view GET /mcp and GET /mcp/group/:group answer with when the request
 * names none. `full` (the default) is the catalogue as it has always been;
 * MCP_DEFAULT_VIEW=compact switches a server over without a release.
 * @returns {'full'|'compact'}
 */
function defaultView() {
  return process.env.MCP_DEFAULT_VIEW === 'compact' ? 'compact' : 'full';
}

/**
 * The view a request asks for: ?view=compact | ?view=full, else the default.
 * `req.query` may not be initialized this early in the pipeline — the raw URL
 * is the fallback, as for the admin key.
 * @param {Object} req
 * @returns {'full'|'compact'}
 */
function requestedView(req) {
  const query = (req && req.query) || {};
  const rawQuery = req && typeof req.url === 'string' && req.url.split('?')[1];
  const asked = query.view || (rawQuery && new URLSearchParams(rawQuery).get('view'));
  if (asked === 'compact' || asked === 'full') return asked;
  return defaultView();
}

/**
 * Returns an Express-compatible middleware function.
 * Mount it in sails.config.http.middleware before 'router'.
 */
function middleware() {
  const handle = async function (req, res, next) {
    if (process.env.NODE_ENV !== 'test' && process.env.MCP_ENABLED !== 'true') return next();

    const url = (req.url || '').split('?')[0];
    // Everything below is MCP-only. Bail out before touching `req` any further so
    // that unrelated routes (/admin/login & co) never depend on this middleware.
    if (url !== MCP_PATH && !url.startsWith(MCP_PATH + '/')) return next();

    const isAdmin = hasProtectedAccess(req);
    const baseUrl = `${req.protocol}://${req.headers && req.headers.host}`;

    // GET /mcp — server info + group catalogue (or legacy flat list with ?flat=1)
    if (req.method === 'GET' && url === MCP_PATH) {
      const flat = req.query && (req.query.flat === '1' || req.query.flat === 'true' || req.query.all === '1');

      // Compact catalogue: groups + tool names, the way to go on said once.
      if (!flat && requestedView(req) === 'compact') {
        return res.json({
          protocol: 'mcp',
          version: '1.1',
          view: 'compact',
          auth: isAdmin ? 'authenticated' : 'unauthenticated',
          usage: compactUsage('compact'),
          ...compactCatalog(visibleTools(req)),
        });
      }

      const base = {
        protocol: 'mcp',
        version: '1.1',

        info: {
          title: 'RestoApp MCP Server',
          description: 'MCP-compatible server for RestoApp. Tools are organized into groups: fetch the group catalogue here, then GET /mcp/group/:group for full schemas. Exposes tools in two access modes: public (no auth) and protected (admin key required).',
          auth: {
            type: 'api-key',
            description: 'External clients can access protected tools with the admin key. Logged-in Adminpanel administrators can access them without a key.',
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

      if (requestedView(req) === 'compact') {
        const compact = compactGroup(groupTools, groupName)
          || { group: groupName, ...(meta.description ? { description: meta.description } : {}), toolCount: 0, tools: [] };
        return res.json({
          protocol: 'mcp',
          version: '1.1',
          view: 'compact',
          usage: compactUsage('compact'),
          ...compact,
        });
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

    // GET /mcp/tool/:name[,:name...] — full description + schema of the named tools
    if (req.method === 'GET' && url.startsWith(MCP_PATH + '/tool/')) {
      const names = decodeURIComponent(url.slice((MCP_PATH + '/tool/').length))
        .split(',').map(name => name.trim()).filter(Boolean);
      // A protected tool the caller has no access to is reported as not found,
      // the same way the catalogue does not show it.
      const described = describeAmong(visibleTools(req), names);

      if (described.tools.length === 0) {
        return res.status(404).json({
          error: names.length ? `Tool '${names.join("', '")}' not found` : 'Tool name is required',
          ...(described.notFound ? { notFound: described.notFound } : {}),
        });
      }

      return res.json({
        protocol: 'mcp',
        version: '1.1',
        usage: compactUsage(requestedView(req)),
        ...described,
      });
    }

    // POST /mcp/call/:tool — invoke
    if (req.method === 'POST' && url.startsWith(MCP_PATH + '/call/')) {
      const toolName = url.slice((MCP_PATH + '/call/').length);
      const tool = tools.get(toolName);

      if (!tool) {
        const similar = similarToolNames(visibleTools(req), toolName);
        return res.status(404).json({
          error: `Tool '${toolName}' not found`,
          ...(similar.length ? { similar } : {}),
        });
      }

      if (tool.mode === 'protected' && !hasProtectedAccess(req)) {
        return res.status(401).json({ error: 'Admin access required for this tool' });
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

  // Express does not await middleware, so a rejected promise would leave the
  // request hanging forever (proxy 504) instead of erroring out. Funnel it to next().
  return function mcpMiddleware(req, res, next) {
    Promise.resolve(handle(req, res, next)).catch(next);
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

/**
 * Compact catalogue for in-process callers: groups with the names of their tools.
 * @param {'public'|'all'} [level='all']
 * @returns {{groupCount: number, toolCount: number, groups: Array<{name: string, description?: string, tools: string[]}>}}
 */
function catalog(level = 'all') {
  return compactCatalog(toolsAtLevel(level));
}

/**
 * The tools of one group for in-process callers: a one-liner and the parameter
 * names of each. Null when there is no such group at this level.
 * @param {string} groupName
 * @param {'public'|'all'} [level='all']
 * @returns {Object|null}
 */
function describeGroup(groupName, level = 'all') {
  return compactGroup(toolsAtLevel(level), groupName);
}

/**
 * Full description + JSON Schema of the named tools for in-process callers.
 * A name that is not registered comes back in `notFound` with similar names.
 * @param {string[]} names
 * @param {'public'|'all'} [level='all']
 * @returns {{tools: Array, notFound?: Array<{name: string, similar: string[]}>}}
 */
function describeTools(names, level = 'all') {
  return describeAmong(toolsAtLevel(level), names);
}

/**
 * Names of the registered tools closest to a name that was not found.
 * @param {string} name
 * @param {'public'|'all'} [level='all']
 * @returns {string[]}
 */
function suggestTools(name, level = 'all') {
  return similarToolNames(toolsAtLevel(level), name);
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
  catalog,
  describeGroup,
  describeTools,
  suggestTools,
};

// Expose as a global so any module can call mcp.registerTool(...)
// without needing a require() path — same pattern as the sails global.
global.mcp = module.exports;
