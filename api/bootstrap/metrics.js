'use strict';

/**
 * Bootstrap: Prometheus metrics collectors.
 *
 * The HTTP side (instrumentation + /metrics) is wired in config/http.js; this
 * file only starts the collectors, because they need the ORM and the model
 * globals, which exist by the time bootstrap runs.
 *
 * Environment variables: METRICS_TOKEN enables everything (see
 * api/hooks/metrics/docs.md); without it the exporter stays off.
 */

module.exports.default = async function (sails) {
  // Default the `stack` label to the PROJECT_NAME core setting, so a fleet of
  // identically-imaged containers (no STACK_NAME env set) still shows up as
  // distinct series in Prometheus. STACK_NAME env, when present, still wins
  // (see api/hooks/metrics/lib/config.js).
  try {
    const projectName = (await Settings.get('PROJECT_NAME'));
    if (projectName) {
      sails.config.metrics = Object.assign({}, sails.config.metrics, { stack: projectName });
    }
  } catch (error) {
    sails.log.warn('Metrics > could not read PROJECT_NAME setting for the stack label:', error.message);
  }

  require('../hooks/metrics/setup').startCollectors(sails);
};
