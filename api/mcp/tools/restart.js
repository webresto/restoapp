'use strict';

/**
 * Protected tool — requires admin key.
 *
 * Restarts the server by exiting the process. Relies on the process
 * manager (pm2 / systemd / docker restart policy) to bring it back up.
 *
 * Register via: mcp.registerTool(...)
 */
module.exports = function register(mcp) {
  mcp.registerTool({
    name: 'restart',
    description: 'Restarts the server by terminating the process (process.exit(0)). The process manager is expected to start it again. Returns immediately before exiting.',
    mode: 'protected',
    schema: {
      type: 'object',
      properties: {
        delayMs: {
          type: 'integer',
          description: 'Delay in milliseconds before the process exits, allowing the HTTP response to be flushed first.',
          example: 500,
        },
      },
    },
    handler: async (params) => {
      const delayMs = Number.isFinite(params.delayMs) && params.delayMs >= 0
        ? params.delayMs
        : 500;

      if (typeof sails !== 'undefined' && sails.log) {
        sails.log.warn(`MCP: restart requested — process will exit in ${delayMs}ms`);
      }

      // Schedule the exit after the response has been sent.
      setTimeout(() => {
        process.exit(0);
      }, delayMs).unref();

      return {
        status: 'restarting',
        exitCode: 0,
        delayMs,
        timestamp: new Date().toISOString(),
      };
    },
  });
};
