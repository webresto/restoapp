'use strict';

/**
 * Protected tool — requires MCP_ADMIN_KEY.
 * Register via: mcp.registerTool(...)
 */
module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'admin-info',
    description: 'Returns internal application info: environment, version, Node.js version, and process ID.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {},
    },
    handler: async (_params) => {
      return {
        env: process.env.NODE_ENV,
        version: require('../../../package.json').version,
        node: process.version,
        pid: process.pid,
      };
    },
  });
};
