'use strict';

const path = require('path');

/**
 * Version of @webresto/core the running process is built against.
 * Returns null when it cannot be determined (the runner then skips version
 * gating rather than guessing).
 */
function getCoreVersion() {
  try {
    return require('@webresto/core/package.json').version;
  } catch (e) { /* not resolvable as a package — fall through */ }
  try {
    return require(path.join(process.cwd(), 'local_modules', 'core', 'package.json')).version;
  } catch (e) {
    return null;
  }
}

module.exports = { getCoreVersion };
