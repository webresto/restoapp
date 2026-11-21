'use strict';

/**
 * Protected tools: install, update and remove a marketplace module.
 *
 * They start the same jobs as the module page of the admin panel and the «Programs» of the
 * mobile app (`api/hooks/app-manager-proto/helpers/moduleJobs.js`): one lock, the same
 * refusals, the channel of WR_MODULES_CHANNEL. A finished job plans a restart at midnight, as
 * the page does; the new code of a module is loaded only by a restart. `restart: true` restarts
 * right after a successful job instead.
 *
 * A job keeps running after the answer: `wait` (seconds, up to 120) holds the answer until it
 * ends, `modules-job` reads it later. A restart forgets the jobs.
 */

const MAX_WAIT_SECONDS = 120;

function defaultDeps() {
  return {
    jobs: () => require('../../hooks/app-manager-proto/helpers/moduleJobs'),
    scheduler: () => require('../../hooks/app-manager-proto/helpers/restartScheduler'),
  };
}

function waitFor(job, seconds) {
  if (!seconds) return Promise.resolve();
  return Promise.race([
    job.finished,
    new Promise((resolve) => setTimeout(resolve, seconds * 1000).unref?.()),
  ]);
}

function waitSeconds(value) {
  const seconds = Number(value);
  if (!Number.isFinite(seconds) || seconds <= 0) return 0;
  return Math.min(seconds, MAX_WAIT_SECONDS);
}

const APP_ID = { type: 'string', description: 'appId of the module, as in modules-info or the marketplace.', example: 'admin-frontend' };
const WAIT = { type: 'integer', description: `Seconds to wait for the end of the job before answering (0 — answer at once, max ${MAX_WAIT_SECONDS}). npm install of a module takes a minute or more.`, example: 90 };
const RESTART = { type: 'boolean', description: 'Restart the server right after the job succeeds, instead of the planned restart at midnight. Needs wait long enough for the job to end; otherwise call modules-job and then restart.', example: true };

module.exports = function register(mcp, deps = defaultDeps()) {
  /** Starts a job and answers with it, or with the refusal of the manager. */
  async function start(kind, params) {
    const jobs = deps.jobs();
    let job;
    try {
      job = await jobs[kind](typeof params.appId === 'string' ? params.appId.trim() : '');
    } catch (error) {
      if (error instanceof jobs.ModuleRefusal) {
        return { refused: true, reason: error.reason, message: error.message, details: error.details ?? null };
      }
      throw error;
    }

    await waitFor(job, waitSeconds(params.wait));

    let restarting = false;
    if (params.restart === true && job.state === 'done') {
      // the answer goes out first: the scheduler exits a second later
      deps.scheduler().restartNow();
      restarting = true;
    }
    return { job: jobs.view(job), restarting, restartPlan: deps.scheduler().getState() };
  }

  mcp.registerTool({
    name: 'modules-install',
    description: 'CHANGES: installs a module from the marketplace (channel of WR_MODULES_CHANNEL), with its npm dependencies and migrations. Its code works after a restart: planned at midnight, or at once with restart: true. Answers with the job; refused when another module job is running or the license does not cover the module.',
    mode: 'protected',
    schema: { type: 'object', required: ['appId'], properties: { appId: APP_ID, wait: WAIT, restart: RESTART } },
    handler: (params) => start('install', params),
  });

  mcp.registerTool({
    name: 'modules-update',
    description: 'CHANGES: updates an installed module to the latest version of the marketplace channel (WR_MODULES_CHANNEL). The new code works after a restart: planned at midnight, or at once with restart: true. Answers with the job.',
    mode: 'protected',
    schema: { type: 'object', required: ['appId'], properties: { appId: APP_ID, wait: WAIT, restart: RESTART } },
    handler: (params) => start('update', params),
  });

  mcp.registerTool({
    name: 'modules-remove',
    description: 'DELETES: removes an installed module: its directory, its line in the modules list, its sales channels. System modules, modules that forbid their removal and modules other modules depend on are refused. Needs confirm: true. Answers with the job.',
    mode: 'protected',
    schema: {
      type: 'object',
      required: ['appId', 'confirm'],
      properties: {
        appId: APP_ID,
        confirm: { type: 'boolean', description: 'Must be true: the removal cannot be undone (install the module again to get it back, its data may be gone).', example: true },
        wait: WAIT,
        restart: RESTART,
      },
    },
    handler: async (params) => {
      if (params.confirm !== true) {
        return { refused: true, reason: 'confirm', message: 'Removing a module needs confirm: true', details: null };
      }
      return start('remove', params);
    },
  });

  mcp.registerTool({
    name: 'modules-job',
    description: 'Reads a module job by id (from modules-install / -update / -remove): state running | done | failed, step, log, error, and the restart plan. A restart forgets the jobs.',
    mode: 'protected',
    schema: { type: 'object', required: ['id'], properties: { id: { type: 'string', description: 'Job id.' }, wait: WAIT } },
    handler: async (params) => {
      const jobs = deps.jobs();
      const job = jobs.get(String(params.id || ''));
      if (!job) return { found: false, message: 'No such job (a restart forgets the jobs)' };
      await waitFor(job, waitSeconds(params.wait));
      return { found: true, job: jobs.view(job), restartPlan: deps.scheduler().getState() };
    },
  });
};
