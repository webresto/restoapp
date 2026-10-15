/**
 * `npm run dev:showcase` — the stand for the storefront demo: Yekaterinburg
 * as the storefront mock-up shows it (points, zones, menu with photos,
 * banners, pages), seeded by `modules/dev-demo-seed` in its `showcase` mode.
 *
 * It lives in its own database, SAILS_DISK_DIR=.tmp/showcaseDb, so the
 * end-to-end stand (`npm run dev:e2e`, the default `.tmp/localDiskDb`) keeps
 * its own Yekaterinburg and the two never overwrite each other. The seed adds
 * what is missing on every start; `-- --fresh` drops the database first and
 * builds the demo from nothing.
 *
 * The rest is what `dev:e2e` sets and why: Russian as the store's language,
 * no captcha on the admin login, and ADMIN_FRONTEND_RECIPE={} so the
 * admin-frontend install wizard does not order a storefront build.
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dbDir = path.join(root, '.tmp', 'showcaseDb')

if (process.argv.includes('--fresh')) {
  fs.rmSync(dbDir, { recursive: true, force: true })
}

const child = spawn(process.execPath, ['--import', 'tsx', path.join(root, 'restoapp.js')], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    SAILS_DISK_DIR: dbDir,
    MULTI_KITCHEN_DEMO_SEED: 'showcase',
    SAILS_DEFAULT_LOCALE: 'ru',
    ENABLE_ADMIN_CAPTCHA: 'false',
    ADMIN_FRONTEND_RECIPE: '{}',
  },
})

child.on('exit', code => process.exit(code ?? 0))
