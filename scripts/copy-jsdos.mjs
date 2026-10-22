// Копирует плеер js-dos из node_modules в public/vendor, чтобы эмулятор грузился с нашего сайта,
// а не с CDN js-dos. Запускается перед dev и build (см. package.json).
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkgDir = join(root, 'node_modules', 'js-dos')
const { version } = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const target = join(root, 'public', 'vendor', 'js-dos', version)

if (existsSync(join(target, 'js-dos.js'))) process.exit(0)

rmSync(join(root, 'public', 'vendor', 'js-dos'), { recursive: true, force: true })
mkdirSync(join(target, 'emulators'), { recursive: true })

for (const file of ['js-dos.js', 'js-dos.css']) {
  cpSync(join(pkgDir, 'dist', file), join(target, file))
}

// Карты исходников, отладочная сборка и символы на сайте не нужны
const skip = (name) => /\.(map|symbols)$/.test(name) || name.includes('-dbg') || name === 'types'
for (const name of readdirSync(join(pkgDir, 'dist', 'emulators'))) {
  if (skip(name)) continue
  cpSync(join(pkgDir, 'dist', 'emulators', name), join(target, 'emulators', name), { recursive: true })
}

console.log(`js-dos ${version} → public/vendor/js-dos/${version}`)
