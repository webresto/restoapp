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

      // Try a simple query to verify database connectivity
      try {
        await datastore.sendNativeQuery('SELECT 1');
      } catch (dbError) {
        return res.status(503).json({
          status: 'not ready',
          reason: 'Database connection failed',
          error: dbError.message
        });
      }

      // All checks passed
      return res.status(200).json({
        status: 'ready',
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
