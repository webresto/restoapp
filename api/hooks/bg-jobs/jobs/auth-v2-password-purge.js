'use strict';

/**
 * Auth v2 — the password subsystem is gone (.ai-notes/auth/remove-password.md).
 *
 * What `user.passwordHash` holds on every installation that ran core 2.5: a bcrypt of the LAST
 * ONE-TIME CODE, not of a password. 2.5 defaulted PASSWORD_POLICY to 'from_otp' and User.login()
 * re-hashed each OTP into the column on every sign-in. Six digits under bcrypt are minutes of
 * offline work once a dump leaks — so the column is a liability, not data, and nothing in 2.6
 * reads it. Null it here; dropping the columns themselves waits for the next-version field
 * cleanup like every other delete of the auth-v2 migration (20260901120000).
 *
 * Same gentle batching as auth-v2-phone-transfer: keyset over user.id, BGJOBS_BATCH_SIZE rows
 * per statement, BGJOBS_BATCH_PAUSE_MS between them, progress checkpointed after every batch.
 * Idempotent by construction — a second run finds no rows with a hash left.
 *
 * Rollback to 2.5 after this ran: login(login, password) fails bcrypt against NULL for purged
 * users, but nobody walked that path ('from_otp' was the default), and the first OTP sign-in on
 * 2.5 writes a hash again. Acceptable (remove-password.md §4.2).
 */

const BATCH_SIZE = Math.max(1, parseInt(process.env.BGJOBS_BATCH_SIZE || '500', 10) || 500);
const BATCH_PAUSE_MS = Math.max(0, parseInt(process.env.BGJOBS_BATCH_PAUSE_MS || '300', 10) || 0);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  id: 'auth-v2-password-purge',
  description: 'Null user.passwordHash / lastPasswordChange (bcrypt of the last OTP, no reader in 2.6) in gentle batches; columns stay until the field cleanup',
  coreVersion: '>=2.6.0',
  requires: [],

  async run({ sql, log, checkpoint, saveProgress }) {
    const column = await sql(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'user'
         AND column_name IN ('passwordHash', 'lastPasswordChange')`
    );
    const present = new Set(column.rows.map((row) => row.column_name));
    if (!present.has('passwordHash')) {
      // The field cleanup already ran here, or this is a fresh 2.6 install: nothing to purge.
      return { source: 'none', purged: 0, batches: 0 };
    }
    const clearLastChange = present.has('lastPasswordChange');

    const progress = checkpoint && checkpoint.source === 'user.passwordHash'
      ? checkpoint
      : { source: 'user.passwordHash', lastId: '', purged: 0, batches: 0 };

    for (;;) {
      const batch = await sql(
        `SELECT "id" FROM "user" WHERE "id" > $1 AND "passwordHash" IS NOT NULL ORDER BY "id" LIMIT ${BATCH_SIZE}`,
        [progress.lastId]
      );
      if (!batch.rows.length) break;
      const ids = batch.rows.map((row) => row.id);

      const purged = await sql(
        `UPDATE "user" SET "passwordHash" = NULL${clearLastChange ? ', "lastPasswordChange" = NULL' : ''}
         WHERE "id" = ANY($1::text[])`,
        [ids]
      );

      progress.lastId = ids[ids.length - 1];
      progress.purged += purged.rowCount || 0;
      progress.batches += 1;
      await saveProgress(progress);

      if (progress.batches % 20 === 0) {
        log.info(`bg-jobs > auth-v2-password-purge: ${progress.batches} batches done, ${progress.purged} rows purged so far`);
      }
      if (batch.rows.length < BATCH_SIZE) break;
      if (BATCH_PAUSE_MS) await sleep(BATCH_PAUSE_MS);
    }

    return {
      source: progress.source,
      purged: progress.purged,
      batches: progress.batches,
      batchSize: BATCH_SIZE,
      pauseMs: BATCH_PAUSE_MS,
    };
  },
};
