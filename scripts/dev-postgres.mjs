/**
 * `npm run dev:pg` — restoapp on a local PostgreSQL, started the way the image
 * starts it with DATASTORE=postgres (`.ci/bootstrap`): the public schema, the
 * migration files collected into one folder, the bg-jobs guard,
 * `db-migrate up:all --env prod`, then the app.
 *
 *   npm run dev:pg -- --db <name>                start on that database, migrations first
 *   npm run dev:pg -- --db <name> --fresh        drop it and start from an empty database,
 *                                                as a new server does
 *   npm run dev:pg -- --db <name> --restore <p>  replace it with a server backup, then start;
 *                                                <p> is a plain pg_dump (.sql or .sql.gz) or the
 *                                                folder of a server stack: the newest dump of its
 *                                                backup/ and the files of its tmp/public
 *   --port <n>                                   of the app, 42890 by default: the storefront
 *                                                stand (`dev:showcase`, 42880) can run at once
 *
 * The database server is the container restoapp-pg14 on port 5433 — the image of
 * the compose of a server, postgres:14:
 *
 *   docker run -d --name restoapp-pg14 --restart unless-stopped -e POSTGRES_PASSWORD=postgres
 *     -p 5433:5432 -v restoapp-pg14:/var/lib/postgresql/data postgres:14
 *
 * The dump goes through psql of the container: it has meta-commands (`\restrict`)
 * and COPY FROM stdin. The files of tmp/public are copied into .tmp/public next
 * to those of the other stands, an existing file is kept: the names of images are
 * uuids of their content.
 *
 * Migrations: the same folders in the same order as in `.ci/bootstrap`, the first
 * file of a name wins (`cp -n` there). The folder is .tmp/pg-migrations/<db>,
 * collected anew on every start; database.json has no port for prod, so PGPORT
 * gives it to db-migrate.
 *
 * After a restore the database is made local: the admin `admin` gets the
 * password `admin` (Adminizer hashes login + password + AP_PASSWORD_SALT, the
 * same expression is used here), and the storefront auto-update of
 * admin-frontend is switched off — it would order a build from the fds of the
 * server every five minutes and install it into the shared .tmp/frontend.
 *
 * The rest is what the other dev scripts set: Russian, no captcha on the admin
 * login, the fixed login code DEFAULT_OTP. RESTOCORE_URL and the checkout and
 * order pages of the server are replaced with the local address: env goes
 * before the database (Settings.use).
 */
import { execFileSync, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'
import { createRequire } from 'node:module'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)

const CONTAINER = 'restoapp-pg14'
const PG_PORT = '5433'

const args = process.argv.slice(2)
const option = name => {
  const i = args.indexOf(name)
  return i === -1 ? undefined : args[i + 1]
}
const db = option('--db')
const port = option('--port') ?? '42890'
const restore = option('--restore')
const fresh = args.includes('--fresh')
if (!db || !/^[a-z_][a-z0-9_]*$/.test(db)) {
  console.error('usage: npm run dev:pg -- --db <name> [--fresh | --restore <dump or stack folder>] [--port <n>]')
  process.exit(2)
}

const step = text => console.log(`\n[dev:pg] ${text}`)
const psql = (sql, database = db) =>
  execFileSync('docker', ['exec', CONTAINER, 'psql', '-U', 'postgres', '-d', database, '-v', 'ON_ERROR_STOP=1', '-tAc', sql]).toString().trim()

const recreateDatabase = () => {
  psql(`DROP DATABASE IF EXISTS "${db}" WITH (FORCE)`, 'postgres')
  psql(`CREATE DATABASE "${db}"`, 'postgres')
}

// the dump and the public files of a restore
let dump
let publicFiles
if (restore) {
  if (fs.statSync(restore).isDirectory()) {
    const backups = path.join(restore, 'backup')
    const newest = fs.readdirSync(backups).filter(name => /\.sql(\.gz)?$/.test(name)).sort().pop()
    if (!newest) throw new Error(`no .sql or .sql.gz dump in ${backups}`)
    dump = path.join(backups, newest)
    publicFiles = path.join(restore, 'tmp', 'public')
  } else {
    dump = restore
  }
}

if (fresh) {
  step(`database ${db}: dropped, created empty`)
  recreateDatabase()
} else if (dump) {
  step(`database ${db}: dropped, restored from ${dump}`)
  recreateDatabase()
  const input = fs.readFileSync(dump)
  execFileSync('docker', ['exec', '-i', CONTAINER, 'psql', '-U', 'postgres', '-d', db, '-v', 'ON_ERROR_STOP=1', '-q'], {
    input: dump.endsWith('.gz') ? zlib.gunzipSync(input) : input,
    stdio: ['pipe', 'ignore', 'inherit'],
    maxBuffer: 1024 * 1024 * 1024,
  })
  const { generate } = require('password-hash')
  const hash = generate('admin' + 'admin' + process.env.AP_PASSWORD_SALT)
  const admins = psql(`UPDATE userap SET "passwordHashed" = '${hash}' WHERE login = 'admin' RETURNING id`)
  if (!admins) console.warn('[dev:pg] no admin with the login `admin` in the dump, passwords are as on the server')
  psql(`UPDATE settings SET value = jsonb_set(value::jsonb, '{autoUpdate,enabled}', 'false')::json WHERE key = 'ADMIN_FRONTEND_FDS' AND value::jsonb ? 'autoUpdate'`)
  if (publicFiles && fs.existsSync(publicFiles)) {
    step(`files: ${publicFiles} -> .tmp/public, existing files kept`)
    fs.cpSync(publicFiles, path.join(root, '.tmp', 'public'), { recursive: true, force: false })
  }
} else if (!psql(`SELECT 1 FROM pg_database WHERE datname = '${db}'`, 'postgres')) {
  step(`database ${db}: created empty`)
  psql(`CREATE DATABASE "${db}"`, 'postgres')
}

const env = {
  ...process.env,
  DATASTORE: 'postgres',
  DB_MIGRATE: 'safe',
  PG_HOST: '127.0.0.1',
  PG_PORT,
  PGPORT: PG_PORT,
  PG_USER: 'postgres',
  PG_PASSWORD: 'postgres',
  PG_DATABASE: db,
}

step('public schema, search_path')
psql(`CREATE SCHEMA IF NOT EXISTS public AUTHORIZATION postgres; ALTER DATABASE "${db}" SET search_path TO public;`)

// the order of MIGRATIONS_PATH in .ci/bootstrap; `**` there is one level, bash has no globstar
const migrationsDir = path.join(root, '.tmp', 'pg-migrations', db)
fs.rmSync(migrationsDir, { recursive: true, force: true })
fs.mkdirSync(migrationsDir, { recursive: true })
const subfolders = dir => (fs.existsSync(dir) ? fs.readdirSync(dir).sort().map(name => path.join(dir, name, 'migrations')) : [])
const sources = [
  path.join(root, 'node_modules', 'sails-adminpanel', 'migrations'),
  ...subfolders(path.join(root, 'local_modules')),
  ...subfolders(path.join(root, 'modules')),
  ...subfolders(path.join(root, 'api', 'hooks')),
  ...subfolders(path.join(root, 'node_modules', '@webresto')),
]
let collected = 0
for (const source of sources) {
  if (!fs.existsSync(source)) continue
  for (const name of fs.readdirSync(source).filter(name => name.endsWith('.js')).sort()) {
    const target = path.join(migrationsDir, name)
    if (fs.existsSync(target)) continue
    fs.copyFileSync(path.join(source, name), target)
    collected++
  }
}
step(`migrations: ${collected} files -> ${path.relative(root, migrationsDir)}`)

step('bg-jobs guard')
execFileSync(process.execPath, [path.join(root, 'api', 'hooks', 'bg-jobs', 'scripts', 'premigrate-guard.js')], { cwd: root, env, stdio: 'inherit' })

step('db-migrate up:all --env prod')
execFileSync(process.execPath, [path.join(root, 'node_modules', 'db-migrate', 'bin', 'db-migrate'), 'up:all', '--env', 'prod', '--migrations-dir', migrationsDir], { cwd: root, env, stdio: 'inherit' })

const local = `http://localhost:${port}`
step(`restoapp on ${local}, database ${db}`)
const child = spawn(process.execPath, ['--import', 'tsx', path.join(root, 'restoapp.js')], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...env,
    PORT: port,
    SAILS_DEFAULT_LOCALE: 'ru',
    DEFAULT_OTP: '123456',
    ENABLE_ADMIN_CAPTCHA: 'false',
    RESTOCORE_URL: local,
    FRONTEND_CHECKOUT_PAGE: `${local}/checkout`,
    FRONTEND_ORDER_PAGE: `${local}/order`,
  },
})

child.on('exit', code => process.exit(code ?? 0))
