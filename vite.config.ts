import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// Версия js-dos нужна в коде, чтобы грузить плеер из public/vendor/js-dos/<версия>
const jsDosVersion: string = JSON.parse(
  readFileSync(new URL('./node_modules/js-dos/package.json', import.meta.url), 'utf8'),
).version

// local-games может содержать целые сборки эмуляторов со своей страницей
const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.wasm': 'application/wasm',
  '.json': 'application/json',
  '.zip': 'application/zip',
}

/**
 * Игры со своих дисков лежат в local-games/ и отдаются только dev-сервером.
 * В public/ их класть нельзя: оттуда всё попадает в сборку и на сайт.
 */
function localGames(): Plugin {
  const root = fileURLToPath(new URL('./local-games', import.meta.url))
  return {
    name: 'retrolaunch-local-games',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/local-games/', (req, res, next) => {
        const relative = decodeURIComponent((req.url ?? '').split('?')[0])
        const file = normalize(join(root, relative))
        if (!file.startsWith(root + sep) && file !== root) return next()
        if (!existsSync(file) || !statSync(file).isFile()) {
          res.statusCode = 404
          res.end()
          return
        }
        res.setHeader('Content-Type', contentTypes[extname(file).toLowerCase()] ?? 'application/octet-stream')
        res.setHeader('Content-Length', statSync(file).size)
        res.setHeader('Cache-Control', 'no-cache')
        // Многопоточным эмуляторам (Boxedwine MultiThreaded) нужен SharedArrayBuffer
        res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
        res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp')
        res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
        if (req.method === 'HEAD') {
          res.end()
          return
        }
        createReadStream(file).pipe(res)
      })
    },
  }
}

/**
 * Порты с потоками (UQM) требуют SharedArrayBuffer, а он доступен только изолированной странице.
 * Изолирован должен быть весь сайт, иначе iframe с игрой изоляцию не получит.
 * credentialless, в отличие от require-corp, не ломает шрифты Google и прочие сторонние ресурсы.
 * На хостинге нужны те же заголовки.
 */
const isolationHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'credentialless',
}

export default defineConfig({
  plugins: [react(), localGames()],
  server: { headers: isolationHeaders },
  preview: { headers: isolationHeaders },
  define: {
    __JSDOS_VERSION__: JSON.stringify(jsDosVersion),
  },
})
