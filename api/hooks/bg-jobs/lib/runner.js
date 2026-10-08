'use strict';

const semver = require('semver');
const { getCoreVersion } = require('./coreVersion');

const TABLE = 'bgjobs';

// Kept in sync with migrations/20260902120000-bgjobs-registry.js; IF NOT EXISTS
// makes the hook self-sufficient in dev, where the CI migration collector does
// not run.
const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS "${TABLE}" (
  "id" text PRIMARY KEY,
  "description" text,
  "versionGate" text,
  "requires" text,
  "status" text NOT NULL DEFAULT 'pending',
  "attempts" integer NOT NULL DEFAULT 0,
  "coreVersion" text,
  "result" text,
  "error" text,
  "progress" text,
  "registeredAt" bigint,
  "startedAt" bigint,
  "finishedAt" bigint
)`;

/**
 * A job "gate is behind" when the current core version no longer satisfies the
 * job's range AND is above it — i.e. the only versions the job may run on are
 * in the past. That job can never complete on this deployment, which is
 * exactly the data-loss situation the guard exists for.
 */
function gateIsBehind(version, range) {
  if (!version || !range || !semver.validRange(range)) return false;
  return !semver.satisfies(version, range) && semver.gtr(version, range);
}

module.exports = function createRunner(sails) {
  const jobs = new Map();
  let started = false;
  let startPromise = null;

  function getSql() {
    const datastore = typeof sails.getDatastore === 'function' ? sails.getDatastore() : null;
    if (!datastore || typeof datastore.sendNativeQuery !== 'function') return null;
    // sails-disk and friends have no native SQL; bg-jobs only makes sense on postgres.
    if (!datastore.config || datastore.config.adapter !== 'sails-postgresql') return null;
    return (query, values) => datastore.sendNativeQuery(query, values || []);
  }

  function register(job) {
    if (!job || typeof job !== 'object') throw new Error('bg-jobs: job must be an object');
    if (!job.id || typeof job.id !== 'string') throw new Error('bg-jobs: job.id is required');
    if (typeof job.run !== 'function') throw new Error(`bg-jobs: job "${job.id}" has no run()`);
    if (!job.coreVersion || !semver.validRange(job.coreVersion)) {
      throw new Error(`bg-jobs: job "${job.id}" has no valid coreVersion semver range`);
    }
    if (job.requires && !Array.isArray(job.requires)) {
      throw new Error(`bg-jobs: job "${job.id}" requires must be an array of job ids`);
    }
    if (jobs.has(job.id)) {
      throw new Error(`bg-jobs: job "${job.id}" is already registered (two modules claim the same id)`);
    }
    jobs.set(job.id, job);

    // Late registration (a module enabled at runtime): run it right away, the
    // startup pass is already over.
    if (started) {
      runPass().catch((err) => sails.log.error('bg-jobs > late run failed:', err));
    }
    return job.id;
  }

  async function getStatus() {
    const sql = getSql();
    if (!sql) return [];
    const res = await sql(`SELECT * FROM "${TABLE}" ORDER BY "id"`);
    return res.rows;
  }

  function start() {
    if (!startPromise) {
      startPromise = run().catch((err) => {
        sails.log.error('bg-jobs > startup pass failed:', err);
        throw err;
      });
    }
    return startPromise;
  }

  async function run() {
    const sql = getSql();
    if (!sql) {
      sails.log.warn('bg-jobs > datastore is not postgres, background jobs are disabled');
      return;
    }

    await sql(CREATE_TABLE_SQL);
    // Tables created before the progress column existed.
    await sql(`ALTER TABLE "${TABLE}" ADD COLUMN IF NOT EXISTS "progress" text`);

    // A row stuck in `running` means a previous process died mid-job.
    await sql(
      `UPDATE "${TABLE}" SET "status" = 'failed', "error" = 'interrupted: process died while the job was running' WHERE "status" = 'running'`
    );

    await syncRegistrations(sql);

    const blocked = await guard(sql);
    if (blocked.length) {
      return die(blocked);
    }

    started = true;
    await runPass();
  }

  // Persist every registration so the pre-migrate guard of the NEXT deploy can
  // judge unfinished jobs without loading any application code.
  async function syncRegistrations(sql) {
    const now = Date.now();
    for (const job of jobs.values()) {
      await sql(
        `INSERT INTO "${TABLE}" ("id", "description", "versionGate", "requires", "status", "registeredAt")
         VALUES ($1, $2, $3, $4, 'pending', $5)
         ON CONFLICT ("id") DO UPDATE SET
           "description" = EXCLUDED."description",
           "versionGate" = EXCLUDED."versionGate",
           "requires"    = EXCLUDED."requires"`,
        [job.id, job.description || null, job.coreVersion, JSON.stringify(job.requires || []), now]
      );
    }
  }

  /**
   * Collect unfinished jobs that can never run on the current core version:
   * both persisted rows (jobs known from previous boots, even if their code is
   * gone) and fresh registrations without a row (the version jumped over the
   * gate entirely, so the job never even got recorded).
   */
  async function guard(sql) {
    const version = getCoreVersion();
    if (!version) {
      sails.log.warn('bg-jobs > cannot determine @webresto/core version, version guard skipped');
      return [];
    }

    const rows = (await sql(
      `SELECT "id", "status", "versionGate", "error" FROM "${TABLE}" WHERE "status" <> 'success'`
    )).rows;

    return rows
      .filter((row) => gateIsBehind(version, row.versionGate))
      .map((row) => ({ id: row.id, status: row.status, gate: row.versionGate, error: row.error }));
  }

  function die(blocked) {
    const version = getCoreVersion();
    sails.log.error('bg-jobs > ================================================================');
    sails.log.error(`bg-jobs > core ${version} is ahead of ${blocked.length} unfinished background job(s):`);
    for (const job of blocked) {
      sails.log.error(`bg-jobs >   - ${job.id} [${job.status}] must run on core ${job.gate}${job.error ? ` (last error: ${job.error})` : ''}`);
    }
    sails.log.error('bg-jobs > Running this core version now could destroy user data these jobs');
    sails.log.error('bg-jobs > were meant to preserve. Deploy a core version matching the gates,');
    sails.log.error('bg-jobs > let the jobs finish, then upgrade (BackgroundJob-style upgrade stop).');
    sails.log.error('bg-jobs > Override at your own risk: BGJOBS_UNSAFE_IGNORE=YES');
    sails.log.error('bg-jobs > ================================================================');

    if (process.env.BGJOBS_UNSAFE_IGNORE === 'YES') {
      sails.log.error('bg-jobs > BGJOBS_UNSAFE_IGNORE=YES set, continuing anyway');
      started = true;
      return runPass();
    }

    sails.lower(() => process.exit(1));
    // If lower() hangs (an open handle somewhere), still make sure we go down.
    setTimeout(() => process.exit(1), 15000).unref();
  }

  /**
   * One pass over all registered jobs: run every job whose version gate matches
   * and whose `requires` are all successful. Looping lets dependents run in the
   * same pass right after their prerequisites. Each job is attempted at most
   * once per pass; a failed job stays `failed` and is retried on next startup.
   */
  async function runPass() {
    const sql = getSql();
    if (!sql) return;
    const version = getCoreVersion();
    const attempted = new Set();

    let progressed = true;
    while (progressed) {
      progressed = false;
      for (const job of jobs.values()) {
        if (attempted.has(job.id)) continue;
        if (version && !semver.satisfies(version, job.coreVersion)) continue;

        const row = (await sql(`SELECT "status" FROM "${TABLE}" WHERE "id" = $1`, [job.id])).rows[0];
        if (row && (row.status === 'success' || row.status === 'running')) continue;

        const requires = job.requires || [];
        let unmet = false;
        for (const dep of requires) {
          const depRow = (await sql(`SELECT "status" FROM "${TABLE}" WHERE "id" = $1`, [dep])).rows[0];
          if (!depRow || depRow.status !== 'success') { unmet = true; break; }
        }
        if (unmet) continue;

        attempted.add(job.id);
        await runJob(sql, job, version);
        progressed = true;
      }
    }
  }

  async function runJob(sql, job, version) {
    // Compare-and-set on status so two processes sharing one database never run
    // the same job twice. `progress` survives the claim: an interrupted or
    // failed job resumes from its last checkpoint, not from scratch.
    const claimed = await sql(
      `UPDATE "${TABLE}" SET "status" = 'running', "attempts" = "attempts" + 1,
         "coreVersion" = $2, "startedAt" = $3, "finishedAt" = NULL, "error" = NULL
       WHERE "id" = $1 AND "status" NOT IN ('running', 'success')
       RETURNING "id", "progress"`,
      [job.id, version || null, Date.now()]
    );
    if (!claimed.rows.length) return;

    let checkpoint = null;
    try {
      checkpoint = claimed.rows[0].progress ? JSON.parse(claimed.rows[0].progress) : null;
    } catch (e) {
      sails.log.warn(`bg-jobs > ${job.id}: unreadable progress checkpoint, starting over`);
    }

    // Batched jobs call this between batches; on restart the value comes back
    // as `checkpoint` so work continues where it stopped.
    const saveProgress = (value) => sql(
      `UPDATE "${TABLE}" SET "progress" = $2 WHERE "id" = $1`,
      [job.id, JSON.stringify(value === undefined ? null : value)]
    );

    sails.log.info(`bg-jobs > running ${job.id} (core ${version}, gate ${job.coreVersion})${checkpoint ? ' resuming from checkpoint' : ''}`);
    try {
      const result = await job.run({ sails, sql, log: sails.log, checkpoint, saveProgress });
      await sql(
        `UPDATE "${TABLE}" SET "status" = 'success', "result" = $2, "finishedAt" = $3, "progress" = NULL WHERE "id" = $1`,
        [job.id, JSON.stringify(result === undefined ? null : result), Date.now()]
      );
      sails.log.info(`bg-jobs > ${job.id} finished:`, result);
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      await sql(
        `UPDATE "${TABLE}" SET "status" = 'failed', "error" = $2, "finishedAt" = $3 WHERE "id" = $1`,
        [job.id, message, Date.now()]
      );
      sails.log.error(`bg-jobs > ${job.id} failed (will retry on next startup):`, err);
    }
  }

  return { register, start, getStatus };
};
