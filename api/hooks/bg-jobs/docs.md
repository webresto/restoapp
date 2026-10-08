# bg-jobs — deferred background jobs gated by the core version

BackgroundJob-style "background migrations": a regular schema migration cannot say
"run me later, once the deployment has stood on version X". This hook can. A
job declares a semver range of `@webresto/core` versions it must run on and is
executed exactly once per database; the outcome is recorded in the `bgjobs`
table.

## Why (the auth v2 case)

Core migration `20260901120000-auth-v2-attempt-registry-identity.js` was going
to drop `user.login` (which holds the phone number) and the legacy
`authstate` / `onetimepassword` / `authprovider` tables. Every delete in that
migration is commented out; instead:

| job | gate | what it does |
|---|---|---|
| `auth-v2-phone-transfer` | `>=2.6.0` | transfers `login` → `authidentity` (provider `phone`, proof `legacy-login`) and `user.primaryPhone`; **deletes nothing** |
| `auth-v2-password-purge` | `>=2.6.0` | nulls `user.passwordHash` / `lastPasswordChange` — on 2.5 they held a bcrypt of the last OTP, and 2.6 has no password at all (`.ai-notes/auth/remove-password.md`); the columns themselves stay until the field cleanup |

The transfer reads the live `user.login` column, which survives the migration
precisely because the deletes are commented out. Nothing is copied to a
backup table first: the deferral itself is what protects the data. The actual
field/table deletes are a separate cleanup planned for the next core version,
once the transfer has proven itself — do not uncomment them in
`20260901120000` while `auth-v2-phone-transfer` still has databases to run on.

The transfer runs gently: keyset pagination over `user.id` in batches of
`BGJOBS_BATCH_SIZE` (default 500) with a `BGJOBS_BATCH_PAUSE_MS` pause
(default 300 ms) between batches — tens of thousands of rows never produce a
single heavy statement and never starve the event loop or the database. After
every batch the position is checkpointed into `bgjobs.progress`; an
interrupted job resumes from the last batch.

## The `bgjobs` table

`id` (pk), `description`, `versionGate` (semver range), `requires` (json array
of job ids), `status` (`pending`/`running`/`success`/`failed`), `attempts`,
`coreVersion` (the version the job last ran on), `result` (json), `error`,
`progress` (json checkpoint for batched jobs, NULL after success),
`registeredAt`/`startedAt`/`finishedAt`.

Created by `migrations/20260902120000-bgjobs-registry.js` (picked up by the
migration collector in `.ci/bootstrap`) and duplicated as
`CREATE TABLE IF NOT EXISTS` inside the hook — for dev environments.

## Registering jobs from modules

```js
// from another hook's/module's initialize, or from config/bootstrap.js
sails.hooks['bg-jobs'].register({
  id: 'my-module-transfer-x',           // globally unique
  description: 'what and why',
  coreVersion: '>=2.6.0 <2.7.0',        // core versions the job must run on
  requires: ['some-earlier-job-id'],     // optional: prerequisite jobs
  async run({ sails, sql, log, checkpoint, saveProgress }) {
    // sql(query, values) => sendNativeQuery; return value -> result column (json).
    // The work MUST be idempotent. Long jobs: process in batches with pauses
    // and call saveProgress(state) after every batch — on restart the state
    // comes back as `checkpoint`, and the job continues where it stopped.
  },
});

// or, without depending on hook load order:
sails.emit('bg-jobs:register', job);
```

Register before `lifted` (a hook's configure/initialize or bootstrap). Jobs run
after the app has fully lifted; a failed job stays `failed` and is retried on
the next startup. `sails.hooks['bg-jobs'].getStatus()` returns the table
contents.

## Guard against upgrading past unfinished jobs

The rule: you have to *stand* on a version until its jobs are done. Two
layers enforce it:

1. **Before migrations** — `.ci/bootstrap` runs
   `scripts/premigrate-guard.js` before `npm run migrate`. If `bgjobs` holds
   unfinished jobs whose gate is behind the core version being deployed, the
   migrations are refused and the container does not start. The script fails
   open on its own problems (no table / no connection — it skips), so a guard
   bug can never brick a deploy.
2. **At runtime** — after lift, `lib/runner.js` re-checks the same thing, but
   with the jobs registered by modules included (the pre-migrate script cannot
   know about those — including the "jumped over a version, no row in the
   table at all" case). On violation: a loud log and `sails.lower()` +
   `process.exit(1)`.

Bypass (at your own risk, user data may be lost): `BGJOBS_UNSAFE_IGNORE=YES`.

The proper way out of a block: roll back to a core version inside the gate,
let the job finish (`status = success` in the table), then upgrade. Last
resort — manually set the row to `status = 'success'` if the data has been
transferred some other way.

## Wiring

`api/hooks` is not scanned by sails (`.sailsrc` → `paths.hooks`); the hook is
wired explicitly in `restoapp.js`, like `app-manager-proto`.
