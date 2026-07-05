/**
 * HealthController
 *
 * @description :: Server-side actions for handling health check requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  /**
   * Readiness probe - checks if the application is ready to accept traffic
   * Returns 200 if the app is ready, 503 if not
   */
  readyz: async function (req, res) {
    try {
      // Check database connection
      if (!sails.hooks.orm) {
        return res.status(503).json({
          status: 'not ready',
          reason: 'ORM hook not available'
        });
      }

      // Check if default datastore is accessible
      const datastore = sails.getDatastore();
      if (!datastore) {
        return res.status(503).json({
          status: 'not ready',
          reason: 'Datastore not available'
        });
      }

      // A deployed store must have at least one enabled sales channel, otherwise
      // orders have no known source and traffic should not be accepted yet.
      if (typeof SalesChannel === 'undefined' || !SalesChannel.count) {
        return res.status(503).json({
          status: 'not ready',
          reason: 'SalesChannel model not available'
        });
      }

      const enabledSalesChannels = await SalesChannel.count({ enabled: true });
      if (enabledSalesChannels < 1) {
        return res.status(503).json({
          status: 'not ready',
          reason: 'At least one enabled sales channel is required',
          checks: {
            enabledSalesChannels
          }
        });
      }

      // All checks passed
      return res.status(200).json({
        status: 'ready',
        checks: {
          enabledSalesChannels
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      sails.log.error('Readiness probe error:', error);
      return res.status(503).json({
        status: 'not ready',
        reason: 'Internal error',
        error: error.message
      });
    }
  },

  /**
   * Liveness probe - checks if the application is alive
   * Returns 200 if the app is running, 503 if not
   */
  healthz: async function (req, res) {
    try {
      // Basic health check - if we got here, the server is alive
      // You can add more checks here if needed
      
      return res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        memory: process.memoryUsage()
      });

    } catch (error) {
      sails.log.error('Health probe error:', error);
      return res.status(503).json({
        status: 'unhealthy',
        error: error.message
      });
    }
  }
};
