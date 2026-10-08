'use strict';

var dbm;
var type;
var seed;

exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

/**
 * Registry of one-shot background jobs (api/hooks/bg-jobs). One row = one job;
 * .ci/bootstrap consults this table BEFORE running migrations to refuse an
 * upgrade past a version with unfinished jobs (BackgroundJob-style upgrade stop).
 *
 * The hook also creates this table with IF NOT EXISTS at startup, so dev
 * environments that never run collected migrations still work.
 */
exports.up = function (db, callback) {
  db.runSql(
    `CREATE TABLE IF NOT EXISTS "bgjobs" (
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
    )`,
    callback
  );
};

exports.down = function (db, callback) {
  db.dropTable('bgjobs', { ifExists: true }, callback);
};

exports._meta = {
  "version": 1
};
