'use strict';

var async = require('async');
var dbm;
var type;
var seed;

/**
 * The drafts of the POS (api/hooks/app-mobile-api/models/MobileOrderDraft.js).
 *
 * Column types as in the hook's first migration: createdAt/updatedAt are `bigint`, the rest text.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  async.series([
    (cb) => db.createTable('mobile_order_draft', {
      columns: {
        id: { type: 'text', primaryKey: true },
        order: { type: 'text', notNull: true, unique: true },
        user: { type: 'text', notNull: true },
        device: { type: 'text' },
        place: { type: 'text', notNull: true },
        createdAt: { type: 'bigint' },
        updatedAt: { type: 'bigint' },
      },
      ifNotExists: true,
    }, cb),
    // «My drafts at this point» is the only query there is.
    (cb) => db.addIndex('mobile_order_draft', 'mobile_order_draft_user_place', ['user', 'place'], false, cb),
  ], callback);
};

exports.down = function (db, callback) {
  db.dropTable('mobile_order_draft', { ifExists: true }, callback);
};

exports._meta = { version: 1 };
