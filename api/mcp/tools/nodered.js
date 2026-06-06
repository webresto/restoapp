'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const DEFAULT_RED_PORT = 42881;
const MAX_FIND_LIMIT = 100;
const DEFAULT_LOG_FILE = 'app.log';
const MAX_LOG_LINES = 2000;
const DEFAULT_LOG_LINES = 200;

// Node-RED v2 Admin API: GET/POST /flows return and accept { rev, flows }.
// Sending this header is required for `rev`-based optimistic locking to work.
const NODE_RED_API_VERSION = 'v2';

function getNodeRedConfig() {
  const appRoot = process.cwd();
  const userDir = path.join(appRoot, '.tmp', 'nodered');
  const namespace = process.env.NODE_RED_NAMESPACE;
  const flowFile = namespace ? `flows-${namespace}.json` : 'restoapp.json';
  const port = Number.parseInt(process.env.RED_PORT || '', 10) || DEFAULT_RED_PORT;

  return {
    appRoot,
    userDir,
    flowFile,
    flowPath: path.join(userDir, flowFile),
    baseUrl: `http://127.0.0.1:${port}/red`,
    port,
    tokenConfigured: Boolean(process.env.NODE_RED_TOKEN),
  };
}

function getAuthHeaders() {
  if (!process.env.NODE_RED_TOKEN) return {};
  return { Authorization: `Bearer ${process.env.NODE_RED_TOKEN}` };
}

function withToken(url) {
  if (!process.env.NODE_RED_TOKEN) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}access_token=${encodeURIComponent(process.env.NODE_RED_TOKEN)}`;
}

async function redRequest(method, route, body, extraHeaders = {}) {
  const config = getNodeRedConfig();
  const response = await axios({
    method,
    url: withToken(`${config.baseUrl}${route}`),
    data: body,
    headers: {
      ...getAuthHeaders(),
      'Node-RED-API-Version': NODE_RED_API_VERSION,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...extraHeaders,
    },
    timeout: 5000,
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300) {
    const detail = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    throw new Error(`Node-RED API ${method.toUpperCase()} ${route} failed: ${response.status} ${detail}`);
  }

  return response.data;
}

async function getRuntimeFlows() {
  const data = await redRequest('get', '/flows');
  if (Array.isArray(data)) return { rev: null, flows: data, source: 'api' };
  return { rev: data.rev || null, flows: data.flows || [], source: 'api' };
}

function readFlowFile() {
  const config = getNodeRedConfig();
  if (!fs.existsSync(config.flowPath)) {
    throw new Error(`Node-RED flow file not found: ${config.flowPath}`);
  }

  const raw = fs.readFileSync(config.flowPath, 'utf8');
  const data = JSON.parse(raw || '[]');
  if (Array.isArray(data)) return { rev: null, flows: data, source: 'file' };
  return { rev: data.rev || null, flows: data.flows || [], source: 'file' };
}

async function loadFlows(preferApi = true) {
  if (preferApi) {
    try {
      return await getRuntimeFlows();
    } catch (error) {
      const fileResult = readFlowFile();
      return { ...fileResult, apiError: error.message };
    }
  }
  return readFlowFile();
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function writeSnapshot(kind, payload) {
  const config = getNodeRedConfig();
  const dir = path.join(config.userDir, kind);
  ensureDir(dir);

  const filePath = path.join(dir, `${kind}-${timestamp()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2));
  return filePath;
}

// Lists backup snapshots written by writeSnapshot('backups', ...),
// newest first (file names are ISO timestamps, so lexical sort == chronological).
function listBackups() {
  const config = getNodeRedConfig();
  const dir = path.join(config.userDir, 'backups');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .reverse()
    .map(name => ({ name, path: path.join(dir, name) }));
}

// Resolves a backup file by name, guarding against path traversal.
function resolveBackupFile(name) {
  const config = getNodeRedConfig();
  const dir = path.resolve(path.join(config.userDir, 'backups'));
  const resolved = path.resolve(dir, name);
  if (!resolved.startsWith(dir + path.sep)) {
    throw new Error(`backupFile must be inside ${dir}`);
  }
  if (!fs.existsSync(resolved)) {
    throw new Error(`Backup not found: ${name}`);
  }
  return resolved;
}

// Reads the tail of a log file inside logs/. Guards against path traversal.
function readLogTail(fileName, lines) {
  const logsDir = path.resolve(path.join(getNodeRedConfig().appRoot, 'logs'));
  const resolved = path.resolve(logsDir, fileName);
  if (!resolved.startsWith(logsDir + path.sep)) {
    throw new Error(`logFile must be inside ${logsDir}`);
  }
  if (!fs.existsSync(resolved)) {
    throw new Error(`Log file not found: ${resolved}`);
  }
  const limit = Math.min(Math.max(Number.parseInt(lines, 10) || DEFAULT_LOG_LINES, 1), MAX_LOG_LINES);
  const all = fs.readFileSync(resolved, 'utf8').split(/\r?\n/);
  // Drop trailing empty line produced by a final newline.
  if (all.length && all[all.length - 1] === '') all.pop();
  return { path: resolved, totalLines: all.length, lines: all.slice(-limit) };
}

function summarizeNode(node) {
  if (!node) return null;
  return {
    id: node.id,
    type: node.type,
    name: node.name || '',
    z: node.z || null,
    wires: node.wires || [],
  };
}

function findTab(flows, tabId) {
  return flows.find(node => node.id === tabId && ['tab', 'subflow'].includes(node.type)) || null;
}

function findIncoming(flows, id) {
  return flows.filter(node => {
    if (!Array.isArray(node.wires)) return false;
    return node.wires.some(group => Array.isArray(group) && group.includes(id));
  });
}

function findOutgoing(flows, node) {
  const ids = [];
  for (const group of node.wires || []) {
    if (!Array.isArray(group)) continue;
    ids.push(...group);
  }
  return ids.map(id => flows.find(candidate => candidate.id === id)).filter(Boolean);
}

function textMatches(value, query) {
  if (!query) return true;
  return JSON.stringify(value).toLowerCase().includes(query.toLowerCase());
}

function validateFlows(flows) {
  const errors = [];
  const warnings = [];
  const ids = new Map();
  const tabIds = new Set(flows.filter(node => ['tab', 'subflow'].includes(node.type)).map(node => node.id));

  for (const node of flows) {
    if (!node || typeof node !== 'object') {
      errors.push({ code: 'invalid-node', message: 'Flow entry is not an object', node });
      continue;
    }

    if (!node.id) errors.push({ code: 'missing-id', message: 'Node has no id', node: summarizeNode(node) });
    if (!node.type) errors.push({ code: 'missing-type', message: 'Node has no type', node: summarizeNode(node) });

    if (node.id) {
      if (ids.has(node.id)) {
        errors.push({ code: 'duplicate-id', message: `Duplicate node id: ${node.id}`, node: summarizeNode(node) });
      }
      ids.set(node.id, node);
    }
  }

  for (const node of flows) {
    if (!node || typeof node !== 'object') continue;

    if (node.z && !tabIds.has(node.z) && !String(node.z).startsWith('subflow:')) {
      errors.push({
        code: 'missing-tab',
        message: `Node ${node.id} references missing tab/subflow ${node.z}`,
        node: summarizeNode(node),
      });
    }

    if (node.wires !== undefined && !Array.isArray(node.wires)) {
      errors.push({ code: 'invalid-wires', message: `Node ${node.id} wires must be an array`, node: summarizeNode(node) });
    }

    if (Array.isArray(node.wires)) {
      node.wires.forEach((group, outputIndex) => {
        if (!Array.isArray(group)) {
          errors.push({
            code: 'invalid-wire-group',
            message: `Node ${node.id} output ${outputIndex} is not an array`,
            node: summarizeNode(node),
          });
          return;
        }

        for (const targetId of group) {
          if (!ids.has(targetId)) {
            errors.push({
              code: 'missing-wire-target',
              message: `Node ${node.id} output ${outputIndex} targets missing node ${targetId}`,
              node: summarizeNode(node),
              targetId,
            });
          }
        }
      });
    }

    if (node.type === 'function') {
      try {
        // Node-RED function bodies are plain JavaScript function bodies.
        // eslint-disable-next-line no-new-func
        new Function('msg', 'send', 'done', node.func || '');
      } catch (error) {
        errors.push({
          code: 'function-syntax',
          message: `Function node ${node.id} has invalid JavaScript: ${error.message}`,
          node: summarizeNode(node),
        });
      }
    }

    if (node.type !== 'tab' && node.type !== 'subflow' && Array.isArray(node.wires) && node.wires.length === 0) {
      warnings.push({ code: 'no-outputs', message: `Node ${node.id} has no outputs`, node: summarizeNode(node) });
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

function removeNodeAndWires(flows, id) {
  const next = flows.filter(node => node.id !== id);
  for (const node of next) {
    if (!Array.isArray(node.wires)) continue;
    node.wires = node.wires.map(group => Array.isArray(group) ? group.filter(target => target !== id) : group);
  }
  return next;
}

function getRequired(value, key, operationType) {
  if (value[key] === undefined || value[key] === null || value[key] === '') {
    throw new Error(`Operation ${operationType} requires '${key}'`);
  }
  return value[key];
}

function applyOperations(flows, operations) {
  if (!Array.isArray(operations) || operations.length === 0) {
    throw new Error('operations must be a non-empty array');
  }

  let next = flows.map(node => ({ ...node, wires: Array.isArray(node.wires) ? node.wires.map(group => [...group]) : node.wires }));

  for (const operation of operations) {
    const type = operation.type;
    if (!type) throw new Error('Every operation requires type');

    if (type === 'update_node') {
      const id = getRequired(operation, 'id', type);
      const node = next.find(candidate => candidate.id === id);
      if (!node) throw new Error(`Node not found: ${id}`);
      Object.assign(node, operation.properties || {});
      node.id = id;
      continue;
    }

    if (type === 'add_node') {
      const node = operation.node;
      if (!node || typeof node !== 'object') throw new Error('Operation add_node requires node object');
      if (!node.id || !node.type) throw new Error('Added node requires id and type');
      if (next.some(candidate => candidate.id === node.id)) throw new Error(`Node already exists: ${node.id}`);
      next.push({ ...node });
      continue;
    }

    if (type === 'remove_node') {
      const id = getRequired(operation, 'id', type);
      if (!next.some(candidate => candidate.id === id)) throw new Error(`Node not found: ${id}`);
      next = removeNodeAndWires(next, id);
      continue;
    }

    if (type === 'connect' || type === 'disconnect') {
      const from = getRequired(operation, 'from', type);
      const to = getRequired(operation, 'to', type);
      const output = Number.isInteger(operation.output) ? operation.output : 0;
      const node = next.find(candidate => candidate.id === from);
      if (!node) throw new Error(`Source node not found: ${from}`);
      if (!next.some(candidate => candidate.id === to)) throw new Error(`Target node not found: ${to}`);
      if (!Array.isArray(node.wires)) node.wires = [];
      while (node.wires.length <= output) node.wires.push([]);
      if (type === 'connect' && !node.wires[output].includes(to)) node.wires[output].push(to);
      if (type === 'disconnect') node.wires[output] = node.wires[output].filter(target => target !== to);
      continue;
    }

    if (type === 'rename_node') {
      const id = getRequired(operation, 'id', type);
      const name = getRequired(operation, 'name', type);
      const node = next.find(candidate => candidate.id === id);
      if (!node) throw new Error(`Node not found: ${id}`);
      node.name = name;
      continue;
    }

    if (type === 'replace_function_code') {
      const id = getRequired(operation, 'id', type);
      const code = getRequired(operation, 'code', type);
      const node = next.find(candidate => candidate.id === id);
      if (!node) throw new Error(`Node not found: ${id}`);
      if (node.type !== 'function') throw new Error(`Node ${id} is not a function node`);
      node.func = code;
      continue;
    }

    throw new Error(`Unsupported operation type: ${type}`);
  }

  return next;
}

function resolvePatchFile(patchFile) {
  const config = getNodeRedConfig();
  const patchesDir = path.resolve(path.join(config.userDir, 'patches'));
  const resolved = path.resolve(patchFile);
  if (!resolved.startsWith(patchesDir + path.sep)) {
    throw new Error(`patchFile must be inside ${patchesDir}`);
  }
  return resolved;
}

async function deployFlows(flows, rev, deploymentType) {
  // Node-RED v2 Admin API deploys via POST /flows with the deployment-type header.
  const body = rev ? { rev, flows } : { flows };
  try {
    return await redRequest('post', '/flows', body, {
      'Node-RED-Deployment-Type': deploymentType || 'full',
    });
  } catch (error) {
    // A stale `rev` yields HTTP 409. Retry once without rev to force deploy,
    // matching the original fall-back behaviour.
    if (rev) {
      return await redRequest('post', '/flows', { flows }, {
        'Node-RED-Deployment-Type': deploymentType || 'full',
      });
    }
    throw error;
  }
}

module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'nodered_status',
    description: 'Returns Node-RED runtime and flow-file status. Admin only.',
    mode: 'protected',
    schema: { type: 'object', properties: {} },
    handler: async () => {
      const config = getNodeRedConfig();
      let api = { reachable: false, error: null };
      try {
        const runtime = await getRuntimeFlows();
        api = { reachable: true, rev: runtime.rev, flowCount: runtime.flows.length, error: null };
      } catch (error) {
        api = { reachable: false, error: error.message };
      }

      let file = { exists: fs.existsSync(config.flowPath), path: config.flowPath };
      if (file.exists) {
        try {
          const data = readFlowFile();
          file = { ...file, flowCount: data.flows.length, readable: true };
        } catch (error) {
          file = { ...file, readable: false, error: error.message };
        }
      }

      return {
        enabled: process.env.NODE_RED_TOKEN !== undefined,
        port: config.port,
        baseUrl: config.baseUrl,
        flowFile: config.flowFile,
        userDir: config.userDir,
        tokenConfigured: config.tokenConfigured,
        api,
        file,
      };
    },
  });

  mcp.registerTool({
    name: 'nodered_get_flows',
    description: 'Returns the current Node-RED flows from Admin API, falling back to the flow file. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        preferApi: { type: 'boolean', description: 'Try Node-RED Admin API first.', example: true },
      },
    },
    handler: async ({ preferApi = true }) => {
      const result = await loadFlows(preferApi);
      return { rev: result.rev, source: result.source, apiError: result.apiError || null, count: result.flows.length, flows: result.flows };
    },
  });

  mcp.registerTool({
    name: 'nodered_find_nodes',
    description: 'Searches Node-RED nodes by id, type, name, tab id, or text inside node JSON. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Case-insensitive text search in full node JSON.', example: 'checkout' },
        id: { type: 'string', description: 'Exact node id.', example: 'node-id' },
        type: { type: 'string', description: 'Exact Node-RED node type.', example: 'function' },
        name: { type: 'string', description: 'Case-insensitive substring of node name.', example: 'validate' },
        tabId: { type: 'string', description: 'Tab/subflow id from node.z.', example: 'tab-id' },
        limit: { type: 'integer', description: 'Maximum number of results.', example: 25 },
      },
    },
    handler: async (params) => {
      const { flows, source, apiError } = await loadFlows(true);
      const limit = Math.min(Number.parseInt(params.limit || MAX_FIND_LIMIT, 10) || MAX_FIND_LIMIT, MAX_FIND_LIMIT);
      const matches = flows.filter(node => {
        if (params.id && node.id !== params.id) return false;
        if (params.type && node.type !== params.type) return false;
        if (params.tabId && node.z !== params.tabId) return false;
        if (params.name && !String(node.name || '').toLowerCase().includes(String(params.name).toLowerCase())) return false;
        if (params.query && !textMatches(node, params.query)) return false;
        return true;
      }).slice(0, limit);

      return { source, apiError: apiError || null, count: matches.length, nodes: matches.map(summarizeNode) };
    },
  });

  mcp.registerTool({
    name: 'nodered_get_node_context',
    description: 'Returns one Node-RED node with its tab, incoming nodes, and outgoing nodes. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Node id.', example: 'node-id' },
      },
      required: ['id'],
    },
    handler: async ({ id }) => {
      if (!id) throw new Error('id is required');
      const { flows, source, apiError } = await loadFlows(true);
      const node = flows.find(candidate => candidate.id === id);
      if (!node) throw new Error(`Node not found: ${id}`);

      return {
        source,
        apiError: apiError || null,
        node,
        tab: findTab(flows, node.z),
        incoming: findIncoming(flows, id).map(summarizeNode),
        outgoing: findOutgoing(flows, node).map(summarizeNode),
      };
    },
  });

  mcp.registerTool({
    name: 'nodered_validate_flows',
    description: 'Runs static validation for broken wires, duplicate ids, missing tabs, and function syntax. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        preferApi: { type: 'boolean', description: 'Try Node-RED Admin API first.', example: true },
      },
    },
    handler: async ({ preferApi = true }) => {
      const { flows, source, apiError } = await loadFlows(preferApi);
      return { source, apiError: apiError || null, ...validateFlows(flows) };
    },
  });

  mcp.registerTool({
    name: 'nodered_backup_flows',
    description: 'Writes a timestamped backup of the current Node-RED flows. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        preferApi: { type: 'boolean', description: 'Try Node-RED Admin API first.', example: true },
      },
    },
    handler: async ({ preferApi = true }) => {
      const result = await loadFlows(preferApi);
      const backupFile = writeSnapshot('backups', { rev: result.rev, flows: result.flows });
      return { source: result.source, apiError: result.apiError || null, backupFile, count: result.flows.length };
    },
  });

  mcp.registerTool({
    name: 'nodered_patch_flows',
    description: 'Applies limited flow edit operations to a draft patch file. Does not deploy by itself. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        operations: { type: 'array', description: 'Patch operations: update_node, add_node, remove_node, connect, disconnect, rename_node, replace_function_code.', example: [] },
        preferApi: { type: 'boolean', description: 'Try Node-RED Admin API first.', example: true },
        backup: { type: 'boolean', description: 'Create a backup before patching.', example: true },
        validate: { type: 'boolean', description: 'Validate patched flows before writing draft.', example: true },
      },
      required: ['operations'],
    },
    handler: async ({ operations, preferApi = true, backup = true, validate = true }) => {
      const current = await loadFlows(preferApi);
      const backupFile = backup ? writeSnapshot('backups', { rev: current.rev, flows: current.flows }) : null;
      const flows = applyOperations(current.flows, operations);
      const validation = validateFlows(flows);
      if (validate && !validation.valid) {
        return { patched: false, source: current.source, apiError: current.apiError || null, backupFile, validation };
      }

      const patchFile = writeSnapshot('patches', { rev: current.rev, flows });
      return {
        patched: true,
        source: current.source,
        apiError: current.apiError || null,
        backupFile,
        patchFile,
        count: flows.length,
        validation,
      };
    },
  });

  mcp.registerTool({
    name: 'nodered_deploy_flows',
    description: 'Deploys a patch file or explicit flows to the Node-RED runtime after validation and backup. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        patchFile: { type: 'string', description: 'Patch file returned by nodered_patch_flows.', example: 'C:\\prj\\restoapp\\.tmp\\nodered\\patches\\patches-2026-01-01T00-00-00-000Z.json' },
        flows: { type: 'array', description: 'Explicit flows array. Prefer patchFile.', example: [] },
        rev: { type: 'string', description: 'Expected Node-RED revision.', example: 'rev-id' },
        deploymentType: { type: 'string', description: 'Node-RED deployment type.', enum: ['full', 'nodes', 'flows', 'reload'], example: 'full' },
        backup: { type: 'boolean', description: 'Create runtime backup before deploy.', example: true },
      },
    },
    handler: async ({ patchFile, flows, rev, deploymentType = 'full', backup = true }) => {
      let deployPayload;
      if (patchFile) {
        const resolved = resolvePatchFile(patchFile);
        deployPayload = JSON.parse(fs.readFileSync(resolved, 'utf8'));
      } else if (Array.isArray(flows)) {
        deployPayload = { rev: rev || null, flows };
      } else {
        throw new Error('patchFile or flows is required');
      }

      const validation = validateFlows(deployPayload.flows || []);
      if (!validation.valid) return { deployed: false, validation };

      const current = await getRuntimeFlows();
      const backupFile = backup ? writeSnapshot('backups', { rev: current.rev, flows: current.flows }) : null;
      const result = await deployFlows(deployPayload.flows, deployPayload.rev || current.rev, deploymentType);

      return {
        deployed: true,
        backupFile,
        deploymentType,
        validation,
        result,
      };
    },
  });

  mcp.registerTool({
    name: 'nodered_health',
    description: 'Cheap liveness/auth check for the Node-RED runtime via GET /settings. Admin only.',
    mode: 'protected',
    schema: { type: 'object', properties: {} },
    handler: async () => {
      const config = getNodeRedConfig();
      try {
        const settings = await redRequest('get', '/settings');
        return {
          ok: true,
          runtime: {
            reachable: true,
            version: settings.version || null,
            adminRoot: settings.httpNodeRoot ? '/red' : null,
            nodeRoot: settings.httpNodeRoot || null,
          },
          baseUrl: config.baseUrl,
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          ok: false,
          runtime: { reachable: false, error: error.message },
          baseUrl: config.baseUrl,
          timestamp: new Date().toISOString(),
        };
      }
    },
  });

  mcp.registerTool({
    name: 'nodered_nodes_catalog',
    description: 'Lists installed Node-RED node modules and the node types they provide, including custom restoapp nodes. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        enabledOnly: { type: 'boolean', description: 'Return only enabled node sets.', example: false },
      },
    },
    handler: async ({ enabledOnly = false } = {}) => {
      const data = await redRequest('get', '/nodes');
      const sets = Array.isArray(data) ? data : [];
      const filtered = enabledOnly ? sets.filter(set => set.enabled !== false) : sets;
      const types = [];
      for (const set of filtered) {
        for (const type of set.types || []) {
          types.push({ type, module: set.module, version: set.version || null, enabled: set.enabled !== false });
        }
      }
      return { count: types.length, setCount: filtered.length, nodes: types };
    },
  });

  mcp.registerTool({
    name: 'nodered_logs_tail',
    description: 'Returns the tail of an application log file from the logs/ directory (default app.log). Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        logFile: { type: 'string', description: 'Log file name inside logs/.', example: 'app.log' },
        lines: { type: 'integer', description: `Number of trailing lines (max ${MAX_LOG_LINES}).`, example: 200 },
      },
    },
    handler: async ({ logFile = DEFAULT_LOG_FILE, lines = DEFAULT_LOG_LINES } = {}) => {
      const result = readLogTail(logFile, lines);
      return { source: result.path, totalLines: result.totalLines, count: result.lines.length, lines: result.lines };
    },
  });

  mcp.registerTool({
    name: 'nodered_rollback',
    description: 'Restores Node-RED flows from a backup snapshot (latest by default) and redeploys. Admin only.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        backupFile: { type: 'string', description: 'Backup file name inside .tmp/nodered/backups. Defaults to the latest.', example: 'backups-2026-01-01T00-00-00-000Z.json' },
        deploymentType: { type: 'string', description: 'Node-RED deployment type.', enum: ['full', 'nodes', 'flows', 'reload'], example: 'full' },
        dryRun: { type: 'boolean', description: 'Validate and report without deploying.', example: false },
      },
    },
    handler: async ({ backupFile, deploymentType = 'full', dryRun = false } = {}) => {
      const backups = listBackups();
      const target = backupFile
        ? { name: backupFile, path: resolveBackupFile(backupFile) }
        : backups[0];
      if (!target) throw new Error('No backups available to roll back to');

      const payload = JSON.parse(fs.readFileSync(target.path, 'utf8'));
      const flows = payload.flows || [];
      const validation = validateFlows(flows);
      if (!validation.valid) return { rolledBack: false, backupFile: target.name, validation };
      if (dryRun) return { rolledBack: false, dryRun: true, backupFile: target.name, count: flows.length, validation };

      // Take a safety backup of the live state before overwriting it.
      const current = await getRuntimeFlows();
      const safetyBackup = writeSnapshot('backups', { rev: current.rev, flows: current.flows });
      const result = await deployFlows(flows, current.rev, deploymentType);

      return {
        rolledBack: true,
        backupFile: target.name,
        safetyBackup,
        deploymentType,
        count: flows.length,
        result,
      };
    },
  });
};
