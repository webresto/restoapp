'use strict';

var async = require('async');
var dbm;
var type;
var seed;

/**
 * Tables of the app-mobile-api hook (api/hooks/app-mobile-api/models).
 *
 * Collected like every hook migration: .ci/bootstrap copies api/hooks/<hook>/migrations/*.js into
 * /app/migrations, `npm run dev:pg` into .tmp/pg-migrations/<db>.
 *
 * Column types follow core's 20261103120000-epoch-columns-not-real: createdAt/updatedAt are `bigint`,
 * any other epoch millisecond `double precision` (`real` rounds them to two minutes).
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

const timestamps = {
  createdAt: { type: 'bigint' },
  updatedAt: { type: 'bigint' },
};

exports.up = function (db, callback) {
  async.series([
    (cb) => db.createTable('mobile_device', {
      columns: {
        id: { type: 'text', primaryKey: true },
        tokenHash: { type: 'text', notNull: true, unique: true },
        user: { type: 'int', notNull: true },
        name: { type: 'text' },
        platform: { type: 'text' },
        passwordFingerprint: { type: 'text', notNull: true },
        lastSeenAt: { type: 'double precision' },
        expiresAt: { type: 'double precision' },
        revoked: { type: 'boolean', defaultValue: false },
        ...timestamps,
      },
      ifNotExists: true,
    }, cb),
    (cb) => db.addIndex('mobile_device', 'mobile_device_user', ['user'], false, cb),

    (cb) => db.createTable('mobile_pow_use', {
      columns: {
        id: { type: 'text', primaryKey: true },
        label: { type: 'text' },
        expiresAt: { type: 'double precision' },
        ...timestamps,
      },
      ifNotExists: true,
    }, cb),
    (cb) => db.addIndex('mobile_pow_use', 'mobile_pow_use_expires_at', ['expiresAt'], false, cb),

    (cb) => db.createTable('mobile_auth_attempt', {
      columns: {
        id: { type: 'serial', primaryKey: true, autoIncrement: true },
        label: { type: 'text', notNull: true },
        at: { type: 'double precision', notNull: true },
        ok: { type: 'boolean', defaultValue: false },
        ...timestamps,
      },
      ifNotExists: true,
    }, cb),
    (cb) => db.addIndex('mobile_auth_attempt', 'mobile_auth_attempt_label_at', ['label', 'at'], false, cb),
  ], callback);
};

exports.down = function (db, callback) {
  async.series([
    (cb) => db.dropTable('mobile_auth_attempt', { ifExists: true }, cb),
    (cb) => db.dropTable('mobile_pow_use', { ifExists: true }, cb),
    (cb) => db.dropTable('mobile_device', { ifExists: true }, cb),
  ], callback);
};

exports._meta = {
  version: 1,
};
