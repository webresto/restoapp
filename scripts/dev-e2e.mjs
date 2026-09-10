/**
 * `npm run dev:e2e` — стенд для сквозных сценариев Playwright.
 *
 * Стенд с пересозданием демо-сида (`MULTI_KITCHEN_DEMO_SEED=recreate`) плюс
 * две переменные, без которых спеки не проходят:
 *
 *   ENABLE_ADMIN_CAPTCHA=false   PoW-капча на входе в админку выключается,
 *                                иначе в форму входа не попасть скриптом;
 *   ADMIN_FRONTEND_RECIPE={}     оба шага мастера установки от модуля
 *                                admin-frontend отсеиваются своим check().
 *                                Иначе последний из них заказывает сборку
 *                                витрины канала main на внешней фабрике
 *                                (FDS), ждёт её минуты и кладёт результат
 *                                поверх views/index.ejs. Сценарии тестируют
 *                                локальный ng serve из base_layouts, а не её.
 *
 * Отдельный файл, а не префикс переменных в самом скрипте: на Windows npm
 * запускает скрипты через cmd, и форма `VAR=value npm run …` там не работает.
 *
 * Подробности — dev-docs/Сквозной-сценарий/Как-прогонять.md.
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
