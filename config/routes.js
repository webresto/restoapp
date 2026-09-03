module.exports.routes = {
  // Health check endpoints
  'GET /healthz': 'HealthController.healthz',
  'GET /readyz': 'HealthController.readyz',

  // Hand-driven RMS stop list sync. Every action answers 404 unless the app
  // was started with RMS_DEV_STUB=1, which is what registers the fake adapter
  // behind them (api/bootstrap/dev-rms-stub.js).
  //
  // `csrf: false` because these are driven by curl, not by a browser: there is
  // no session to ride, and a token would only make the tool unusable.
  'POST /dev/rms/map': { controller: 'DevRmsStubController', action: 'map', csrf: false },
  'POST /dev/rms/stoplist': { controller: 'DevRmsStubController', action: 'push', csrf: false },
  'GET /dev/rms/stock': 'DevRmsStubController.state',
};
