#!/usr/bin/env node
'use strict';

/**
 * Pre-migration guard, run by .ci/bootstrap BEFORE `npm run migrate`.
 *
 * Reads the `bgjobs` table (see api/hooks/bg-jobs) and blocks the deploy —
 * exit code 1, bootstrap then refuses to migrate and start the app — when it
 * finds unfinished jobs whose core-version gate is behind the core version
 * being deployed. Such jobs can never complete on this version, and the
 * migrations of the new version may destroy the data those jobs were meant to
 * preserve (BackgroundJob-style "you must stand on version X" upgrade stop).
 *
 * Deliberately fails open (exit 0) on its own problems — missing table, no
 * connection, missing deps — so a guard bug cannot brick deploys; the runtime
 * guard in api/hooks/bg-jobs/lib/runner.js is the second layer.
 *
 * Override at your own risk: BGJOBS_UNSAFE_IGNORE=YES.
 */

const path = require('path');

function log(message) { console.log('[bg-jobs guard] ' + message); }
function fail(message) { console.error('[bg-jobs guard] ' + message); }

function getCoreVersion() {
  const candidates = [
    '@webresto/core/package.json',
    '/app/local_modules/core/package.json',
    path.join(__dirname, '..', '..', '..', '..', 'local_modules', 'core', 'package.json'),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate).version;
    } catch (e) { /* try next */ }
  }
  return null;
}

// Same connection resolution as config/datastores.js.
function getConnectionString() {
  if (process.env.PGLINK) return process.env.PGLINK;
  const port = process.env.PG_PORT === undefined ? 5432 : process.env.PG_PORT;
  const database = process.env.PG_DATABASE === undefined ? 'postgres' : process.env.PG_DATABASE;
  const host = process.env.PG_HOST === undefined ? 'postgres' : process.env.PG_HOST;
  if (process.env.PG_USER) {
    return `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${host}:${port}/${database}`;
  }
  return `postgresql://postgres:postgres@${host}:${port}/${database}`;
}

async function main() {
  if (process.env.BGJOBS_UNSAFE_IGNORE === 'YES') {
    fail('BGJOBS_UNSAFE_IGNORE=YES set - guard skipped, user data is on you');
    return 0;
  }
  if (process.env.DATASTORE !== 'postgres') {
    log('DATASTORE is not postgres - nothing to guard');
    return 0;
  }

  let pg, semver;
  try {
    pg = require('pg');
    semver = require('semver');
  } catch (e) {
    fail('pg/semver not resolvable (' + e.message + ') - guard skipped');
    return 0;
  }

  const coreVersion = getCoreVersion();
  if (!coreVersion) {
    fail('cannot determine @webresto/core version - guard skipped');
    return 0;
  }

  const client = new pg.Client({ connectionString: getConnectionString() });
  try {
    await client.connect();
  } catch (e) {
    fail('cannot connect to postgres (' + e.message + ') - guard skipped');
    return 0;
  }

  try {
    const rel = await client.query("SELECT to_regclass('public.bgjobs') AS rel");
    if (!rel.rows[0].rel) {
      log('bgjobs table does not exist yet - nothing to guard');
      return 0;
    }

    const unfinished = (await client.query(
      `SELECT "id", "status", "versionGate", "error" FROM "bgjobs" WHERE "status" <> 'success'`
    )).rows;

    const blocked = unfinished.filter((row) =>
      row.versionGate &&
      semver.validRange(row.versionGate) &&
      !semver.satisfies(coreVersion, row.versionGate) &&
      semver.gtr(coreVersion, row.versionGate)
    );

    if (!blocked.length) {
      log(`core ${coreVersion}: no unfinished background jobs block this deploy`);
      return 0;
    }

    fail('================================================================');
    fail(`core ${coreVersion} is ahead of ${blocked.length} unfinished background job(s):`);
    for (const row of blocked) {
      fail(`  - ${row.id} [${row.status}] must run on core ${row.versionGate}` + (row.error ? ` (last error: ${row.error})` : ''));
    }
    fail('Migrating and starting now could destroy user data these jobs were');
    fail('meant to preserve. Deploy a core version matching the gates above,');
    fail('let the jobs finish (see the bgjobs table), then upgrade.');
    fail('Override at your own risk: BGJOBS_UNSAFE_IGNORE=YES');
    fail('================================================================');
    return 1;
  } finally {
    await client.end().catch(() => {});
  }
}

main().then(
  (code) => process.exit(code),
  (err) => {
    fail('guard crashed (' + (err && err.message) + ') - guard skipped');
    process.exit(0);
  }
);
