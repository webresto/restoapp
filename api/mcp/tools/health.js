'use strict';

/**
 * Public tool — accessible without a key.
 * Register via: mcp.registerTool(...)
 */
module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'health',
    description: 'Returns application health status: uptime, memory usage, and current timestamp.',
    mode: 'public',
    schema: {
      type: 'object',
      properties: {},
    },
    handler: async (_params) => {
      return {
        status: 'ok',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
      };
    },
  });
};
