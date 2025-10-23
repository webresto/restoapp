module.exports.routes = {
  // Health check endpoints
  'GET /healthz': 'HealthController.healthz',
  'GET /readyz': 'HealthController.readyz',
};
