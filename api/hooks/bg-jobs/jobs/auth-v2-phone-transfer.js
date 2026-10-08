'use strict';

/**
 * Auth v2, step 2 of 2 — the deferred data transfer (runs on core >=2.6).
 *
 * Moves the phone number out of the killed login field into the auth v2 world:
 *   user.login → authidentity(provider='phone', externalId=normalized digits)
 *   that identity's id → user.primaryPhone (a FK to authidentity, NOT the
 *   phone text — see User.ts primaryPhone / AuthService.syncUserProjections)
 *
 * Deletes NOTHING. Dropping user.login, authidentity.lastLoginAt, the legacy
 * authstate/onetimepassword/authprovider tables and the dead settings keys
 * (all commented out in core migration 20260901120000) is a separate field
 * cleanup planned for the next core version, once the transfer has proven
 * itself in production.
 *
 * Runs gently: keyset pagination over user.id in batches of BGJOBS_BATCH_SIZE
 * (default 500) with a BGJOBS_BATCH_PAUSE_MS pause between batches (default
 * 300ms), so a table with tens of thousands of users never produces one huge
 * statement or starves the event loop / other queries. After every batch the
 * position is checkpointed via saveProgress(); an interrupted run resumes from
 * the last batch, not from scratch.
 *
 * Source: the live user.login column. It survives onto 2.6 exactly because the
 * deletes in that migration are commented out, and dropping it waits for the
 * next-version field cleanup — this job is the only reader of the phone numbers
 * and nothing copies them anywhere else. If the column is already gone there is
 * nothing left to transfer and the job succeeds with source:'none'.
 *
 * Idempotent: ON CONFLICT (provider, externalId) DO NOTHING against the
 * authidentity_provider_externalid_uidx unique index; primaryPhone is only
 * filled where it is still NULL.
 *
 * The migrated proof is marked method='legacy-login' / adapter='core-migration':
 * the old login WAS the proven credential (OTP logins ran against it), but 2.6
 * code can tell these rows from proofs produced by a real AuthAttempt.
 *
 * PHONE LOGINS ONLY. 2.5 could key an account by an email address
 * (CORE_LOGIN_FIELD=email); 2.6 cannot — the core has no way to prove an
 * address, so email is a profile attribute and never an identity (review3
 * §1.2). A login that normalizes to no digits is therefore not transferred,
 * and such an account has no way in until somebody attaches a number to it.
 * That is a real outcome, so it is counted and logged as a warning rather than
 * skipped in silence (review3 §5.3).
 */

const BATCH_SIZE = Math.max(1, parseInt(process.env.BGJOBS_BATCH_SIZE || '500', 10) || 500);
const BATCH_PAUSE_MS = Math.max(0, parseInt(process.env.BGJOBS_BATCH_PAUSE_MS || '300', 10) || 0);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = {
  id: 'auth-v2-phone-transfer',
  description: 'Transfer user.login (phone) into authidentity + user.primaryPhone in gentle batches; no deletes',
  coreVersion: '>=2.6.0',
  requires: [],

  async run({ sql, log, checkpoint, saveProgress }) {
    const now = Date.now();
    const proof = JSON.stringify({ at: now, method: 'legacy-login', adapter: 'core-migration', purpose: 'login' });
    const linkedVia = 'bg-jobs:auth-v2-phone-transfer';

    async function exists(relation) {
      const res = await sql('SELECT to_regclass($1) AS rel', ['public.' + relation]);
      return Boolean(res.rows[0] && res.rows[0].rel);
    }

    if (!(await exists('authidentity'))) {
      throw new Error('authidentity table does not exist - is this really core >=2.6?');
    }

    const liveColumn = await sql(
      `SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'user' AND column_name = 'login'`
    );

    if (!liveColumn.rows.length) {
      // Fresh install on the new schema, or the field cleanup already ran here:
      // nothing to transfer is a valid outcome.
      return { source: 'none', identities: 0, primaryPhones: 0, batches: 0 };
    }

    // Must yield: uid, login, phone (text).
    const sourceName = 'user.login';
    const source = `SELECT "id" AS uid, "login" AS login, "phone"::text AS phone FROM "user" WHERE "login" IS NOT NULL`;

    // Resume from the checkpoint of an interrupted run ('' sorts before any
    // non-empty text id, so the first batch starts at the beginning).
    const progress = checkpoint && checkpoint.source === sourceName
      ? checkpoint
      : { source: sourceName, lastId: '', identities: 0, primaryPhones: 0, untransferable: 0, batches: 0 };
    // A checkpoint written before this counter existed has no field for it.
    if (typeof progress.untransferable !== 'number') progress.untransferable = 0;

    for (;;) {
      const batch = await sql(
        `SELECT s.uid FROM (${source}) s WHERE s.uid > $1 ORDER BY s.uid LIMIT ${BATCH_SIZE}`,
        [progress.lastId]
      );
      if (!batch.rows.length) break;
      const uids = batch.rows.map((row) => row.uid);

      const identities = await sql(
        `INSERT INTO "authidentity"
           ("id", "provider", "externalId", "user", "phone", "proof", "linkedAt", "linkedVia", "createdAt", "updatedAt")
         SELECT gen_random_uuid()::text, 'phone', regexp_replace(s.login, '\\D', '', 'g'),
                s.uid, s.phone, $2, $3, $4, $3, $3
         FROM (${source}) s
         WHERE s.uid = ANY($1::text[]) AND regexp_replace(s.login, '\\D', '', 'g') <> ''
         ON CONFLICT ("provider", "externalId") DO NOTHING`,
        [uids, proof, now, linkedVia]
      );

      // Join through authidentity so a user whose duplicate number lost the
      // ON CONFLICT race (the identity belongs to someone else) keeps NULL
      // instead of pointing at another account's identity.
      const primaryPhones = await sql(
        `UPDATE "user" u SET "primaryPhone" = ai."id"
         FROM (${source}) s
         JOIN "authidentity" ai
           ON ai."provider" = 'phone'
          AND ai."externalId" = regexp_replace(s.login, '\\D', '', 'g')
          AND ai."user" = s.uid
         WHERE u."id" = s.uid AND s.uid = ANY($1::text[]) AND u."primaryPhone" IS NULL`,
        [uids]
      );

      // Everything in this batch the INSERT above could not take: no digits in
      // the login, i.e. an email-keyed account (or a login of pure punctuation).
      const untransferable = await sql(
        `SELECT count(*)::int AS n FROM (${source}) s
         WHERE s.uid = ANY($1::text[]) AND regexp_replace(s.login, '\\D', '', 'g') = ''`,
        [uids]
      );

      progress.lastId = uids[uids.length - 1];
      progress.identities += identities.rowCount || 0;
      progress.untransferable += (untransferable.rows[0] && untransferable.rows[0].n) || 0;
      progress.primaryPhones += primaryPhones.rowCount || 0;
      progress.batches += 1;
      await saveProgress(progress);

      if (progress.batches % 20 === 0) {
        log.info(`bg-jobs > auth-v2-phone-transfer: ${progress.batches} batches done, ${progress.identities} identities so far`);
      }
      if (batch.rows.length < BATCH_SIZE) break;
      if (BATCH_PAUSE_MS) await sleep(BATCH_PAUSE_MS);
    }

    if (progress.untransferable) {
      log.warn(
        `bg-jobs > auth-v2-phone-transfer: ${progress.untransferable} account(s) had a login with no phone number in it ` +
        `(email-keyed installations, CORE_LOGIN_FIELD=email). They were NOT transferred and cannot sign in until a number ` +
        `is attached — user.login is still there to recover them from (review3 §5.3).`
      );
    }

    return {
      source: sourceName,
      identities: progress.identities,
      primaryPhones: progress.primaryPhones,
      untransferable: progress.untransferable,
      batches: progress.batches,
      batchSize: BATCH_SIZE,
      pauseMs: BATCH_PAUSE_MS,
    };
  },
};
