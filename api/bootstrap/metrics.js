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
  require('../hooks/metrics/setup').startCollectors(sails);
};
