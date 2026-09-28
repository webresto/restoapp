/**
 * `npm run dev:hmr` — the app plus a Vite dev server for the adminizer JSX
 * modules of @webresto/core (local_modules/core/lib/adminpanel/src).
 *
 * Adminizer loads those modules in the browser with a plain `import(url)`, so
 * with RESTOCORE_HMR=1 the core hook hands out dev-server URLs instead of the
 * prebuilt files under /restocore/assets/core-adminizer-assets. Editing a .jsx
 * then updates the open admin page without `npm run build:adminizer`.
 *
 * Nothing in adminizer itself is patched or served from Vite — ADMINIZER_ENV
 * stays untouched on purpose, that flag switches adminizer's own dev server on
 * and it needs adminizer's sources, which we don't ship.
 *
 * Env:
 *   RESTOCORE_HMR_PORT    dev server port (default 5174)
 *   RESTOCORE_HMR_ORIGIN  origin the browser uses (default http://127.0.0.1:<port>)
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteConfig = path.join(root, 'local_modules/core/lib/adminpanel/vite.config.js')
const port = process.env.RESTOCORE_HMR_PORT || '5174'

const env = {
  ...process.env,
  RESTOCORE_HMR: '1',
  RESTOCORE_HMR_PORT: port,
}

const children = []
let shuttingDown = false

function run(name, args) {
  const child = spawn(process.execPath, args, { cwd: root, env, stdio: 'inherit' })
  children.push(child)
  child.on('exit', (code, signal) => {
    if (shuttingDown) return
    console.error(`[dev:hmr] ${name} exited (${signal || code}), stopping`)
    shutdown(typeof code === 'number' ? code : 1)
  })
  child.on('error', (err) => {
    console.error(`[dev:hmr] failed to start ${name}:`, err)
    shutdown(1)
  })
  return child
}

function shutdown(code) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) child.kill()
  }
  process.exitCode = code
}

console.log(`[dev:hmr] adminizer modules served from http://127.0.0.1:${port} (HMR on)`)

run('vite', [path.join(root, 'node_modules/vite/bin/vite.js'), '--config', viteConfig])
run('app', [path.join(root, 'node_modules/tsx/dist/cli.mjs'), path.join(root, 'restoapp.js')])

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => shutdown(0))
}
