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
 *   MCP_ENABLED=true   — enable MCP server (disabled by default)
 *   MCP_ADMIN_KEY=...  — global admin key for protected tools
 */
module.exports.default = async function (sails) {
  if (process.env.MCP_ENABLED !== 'true') {
    sails.log.debug('Bootstrap > MCP Server disabled (set MCP_ENABLED=true to enable)');
    return;
  }

  sails.log.info('Bootstrap > MCP Server starting...');

  // global.mcp is set by api/mcp/McpServer.js which is always loaded via config/http.js
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
    sails.log.warn('Bootstrap > MCP: MCP_ADMIN_KEY is not set — protected tools are inaccessible');
  }

  // Signal that mcp is ready — modules should listen to this event instead of
  // hook:<name>:loaded, because mcp global is guaranteed to exist at this point.
  sails.emit('mcp:ready');
};
