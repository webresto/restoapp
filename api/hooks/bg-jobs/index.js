'use strict';

/**
 * bg-jobs: one-shot background jobs gated by the running @webresto/core version
 * (BackgroundJob-style background migrations).
 *
 * Why it exists: a schema migration cannot say "run me later, once the operator
 * has passed through version X". This hook can. A job declares a semver range of
 * core versions it must run on (`coreVersion`) and, optionally, jobs that must
 * have succeeded before it (`requires`). The runner executes each job exactly
 * once per database and records the outcome in the `bgjobs` table.
 *
 * The rule this enforces: you have to *stand* on a version long enough
 * for its jobs to finish before upgrading past it. Two layers guard that:
 *   1. .ci/bootstrap runs scripts/premigrate-guard.js BEFORE `npm run migrate`:
 *      if the `bgjobs` table holds unfinished jobs whose version gate is behind
 *      the core version being deployed, migrations are refused and the
 *      container does not start.
 *   2. lib/runner.js re-checks at runtime (it also sees jobs registered by
 *      modules, which the pre-migrate script cannot know about) and lowers the
 *      process if an unfinished job can never run again on this core version.
 * Both layers can be bypassed with BGJOBS_UNSAFE_IGNORE=YES — at the operator's
 * own risk.
 *
 * Modules register their own jobs either directly:
 *   sails.hooks['bg-jobs'].register({ id, description, coreVersion, requires, run })
 * or, to avoid depending on hook load order:
 *   sails.emit('bg-jobs:register', job)
 * Registration must happen before `lifted` (i.e. in a hook's configure/
 * initialize or in bootstrap); later registrations still run, but miss the
 * startup guard pass.
 *
 * NOTE: api/hooks is not scanned by sails (.sailsrc points paths.hooks
 * elsewhere); this hook is wired explicitly in restoapp.js, like
 * app-manager-proto.
 */

const createRunner = require('./lib/runner');

module.exports = function bgJobsHook(sails) {
  const runner = createRunner(sails);

  // Jobs owned by the project itself. The auth v2 transfer is the deferred half
  // of core migration 20260901120000-auth-v2-attempt-registry-identity.js: the
  // data moves on 2.6, the actual field deletes wait for the next core version.
  runner.register(require('./jobs/auth-v2-phone-transfer'));
  // The password subsystem is gone in 2.6; what its column holds is a bcrypt of the last OTP
  // (.ai-notes/auth/remove-password.md §4.2) — nulled here, the column dropped by the cleanup.
  runner.register(require('./jobs/auth-v2-password-purge'));

  return {
    register: runner.register,
    getStatus: runner.getStatus,

    initialize: function (cb) {
      sails.on('bg-jobs:register', (job) => {
        try {
          runner.register(job);
        } catch (err) {
          sails.log.error('bg-jobs > bad registration via event:', err.message);
        }
      });

      // Run after every hook and config/bootstrap.js had their chance to
      // register jobs. `after` fires immediately if the event already passed.
      sails.after('lifted', () => {
        runner.start().catch((err) => {
          sails.log.error('bg-jobs > runner crashed:', err);
        });
      });

      return cb();
    },
  };
};
