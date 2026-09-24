/**
 * `npm run dev:e2e` — the stand for the Playwright end-to-end scenarios.
 *
 * The stand recreates the demo seed (`MULTI_KITCHEN_DEMO_SEED=recreate`) and
 * adds two variables the specs cannot pass without:
 *
 *   ENABLE_ADMIN_CAPTCHA=false   turns off the PoW captcha on the admin login,
 *                                otherwise a script cannot reach the form;
 *   ADMIN_FRONTEND_RECIPE={}     makes both install-wizard steps of the
 *                                admin-frontend module drop out in their own
 *                                check(). Otherwise the last one orders a build
 *                                of the main channel storefront from an
 *                                external factory (FDS), waits minutes for it
 *                                and writes the result over views/index.ejs.
 *                                The scenarios test the local ng serve from
 *                                base_layouts, not that build.
 *
 * A separate file rather than a variable prefix inside the script itself: on
 * Windows npm runs scripts through cmd, where `VAR=value npm run …` does not
 * work.
 *
 * Details — dev-docs/Сквозной-сценарий/Как-прогонять.md.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const child = spawn(process.execPath, ['--import', 'tsx', path.join(root, 'restoapp.js')], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    MULTI_KITCHEN_DEMO_SEED: 'recreate',
    ENABLE_ADMIN_CAPTCHA: 'false',
    ADMIN_FRONTEND_RECIPE: '{}',
  },
})

child.on('exit', code => process.exit(code ?? 0))
