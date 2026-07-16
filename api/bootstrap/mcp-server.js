'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Bootstrap: MCP Server
 *
 * Loads all tools from api/mcp/tools/ and mounts the MCP middleware
 * into sails.config.http.middleware before 'router'.
 *
 * Environment variables:
 *   MCP_ENABLED=true   — enable public HTTP MCP server (disabled by default)
 *   MCP_INTERNAL_ENABLED=true — load tools for trusted in-process callers
 *   MCP_ADMIN_KEY=...  — global admin key for protected tools
 */
module.exports.default = async function (sails) {
  if (process.env.MCP_ENABLED !== 'true' && process.env.MCP_INTERNAL_ENABLED !== 'true') {
    sails.log.debug('Bootstrap > MCP Server disabled (set MCP_ENABLED=true or MCP_INTERNAL_ENABLED=true to enable)');
    return;
  }

  sails.log.info(`Bootstrap > MCP Server starting (${process.env.MCP_ENABLED === 'true' ? 'HTTP + internal' : 'internal only'})...`);

  // global.mcp is set by api/mcp/McpServer.js which is always loaded via config/http.js

  // Describe the groups the api/mcp/tools/*.js tools belong to. The group name
  // for each tool is inferred from its source file basename (e.g. tools in
  // nodered.js land in group 'nodered'), so these names must match the files.
  // registerGroup is idempotent — safe to call before the tools are loaded.
  const TOOL_GROUPS = {
    'health':       'Application health and liveness checks.',
    'admin-info':   'Admin and instance metadata: versions, environment info.',
    'modules-info': 'Installed modules / packages and their metadata.',
    'menu':         'Public menu catalogue: browse groups, dishes and single items.',
    'restart':      'Process control: restart the application.',
    'upload-image': 'Upload images to the media library.',
    'nodered':      'Node-RED flow management: status, flows, nodes, validate, backup, patch, deploy, rollback, logs.',
  };
  for (const [name, description] of Object.entries(TOOL_GROUPS)) {
    if (typeof mcp.registerGroup === 'function') mcp.registerGroup({ name, description });
  }

  const toolsDir = path.join(sails.config.paths.app, 'api/mcp/tools');

  // Auto-load all tools from api/mcp/tools/*.js
  if (fs.existsSync(toolsDir)) {
    const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.js'));
    for (const file of toolFiles) {
      try {
        const register = require(path.join(toolsDir, file));
        register(mcp);
        sails.log.debug(`Bootstrap > MCP: registered tool from ${file}`);
      } catch (err) {
        sails.log.error(`Bootstrap > MCP: failed to load tool '${file}':`, err);
      }
    }
  }

  sails.log.info(`Bootstrap > MCP Server ready. Tools: ${mcp.tools.size}. Endpoint: GET /mcp`);

  if (!process.env.MCP_ADMIN_KEY) {
    sails.log.warn('Bootstrap > MCP: MCP_ADMIN_KEY is not set — protected tools are unavailable to external clients, but Adminpanel administrators still have access');
  }

  // Signal that mcp is ready — modules should listen to this event instead of
  // hook:<name>:loaded, because mcp global is guaranteed to exist at this point.
  sails.emit('mcp:ready');
};
