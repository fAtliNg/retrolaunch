import { useEffect, useRef, useState } from 'react'
import type { JsDosEmulator } from '../types/game'
import { jsDosBase, loadJsDos } from '../emulator/loadJsDos'
import styles from './DosPlayer.module.css'

interface DosPlayerProps {
  emulator: JsDosEmulator
  title: string
  onExit: () => void
}

type Status = 'loading' | 'running' | 'error' | 'missing'

/** Эмулятор js-dos внутри окна игры со своей панелью: звук, полный экран, выход. */
export default function DosPlayer({ emulator, title, onExit }: DosPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const dosRef = useRef<DosProps | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [attempt, setAttempt] = useState(0)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')

    const bundleUrl = `${import.meta.env.BASE_URL}${emulator.bundle}`

    // Локальный пакет мог ещё не появиться в local-games/ — подскажем, куда его положить
    const bundleCheck = emulator.localOnly
      ? fetch(bundleUrl, { method: 'HEAD' }).then((response) => response.ok)
      : Promise.resolve(true)

    Promise.all([loadJsDos(), bundleCheck])
      .then(([Dos, bundleExists]) => {
        if (cancelled || !screenRef.current) return
        if (!bundleExists) {
          setStatus('missing')
          return
        }
        dosRef.current = Dos(screenRef.current, {
          url: bundleUrl,
          pathPrefix: `${jsDosBase}emulators/`,
          backend: emulator.backend,
          backendLocked: true,
          theme: 'dark',
          lang: 'ru',
          kiosk: true,
          autoStart: true,
          autoSave: true,
          renderAspect: '4/3',
          imageRendering: 'pixelated',
          // Voodoo рисуется через WebGL, и DOSBox-X получает контекст только из OffscreenCanvas
          ...(emulator.voodoo && { offscreenCanvas: true, renderBackend: 'webgl' as const, workerThread: true }),
          onEvent: (event) => {
            if (event === 'ci-ready' && !cancelled) setStatus('running')
          },
        })
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      void dosRef.current?.stop()
      dosRef.current = null
    }
  }, [emulator, attempt])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleSound = () => {
    dosRef.current?.setVolume(muted ? 1 : 0)
    setMuted(!muted)
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void rootRef.current?.requestFullscreen()
  }

  const exit = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    onExit()
  }

  return (
    <div ref={rootRef} className={styles.root}>
      <div ref={screenRef} className={styles.screen} />

      {status === 'loading' && (
        <div className={styles.overlay} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Запускаем {title}…</p>
          <p className={styles.hint}>Первый запуск может занять несколько секунд</p>
        </div>
      )}

      {status === 'missing' && (
        <div className={styles.overlay} role="alert">
          <p>Пакет игры не найден</p>
          <p className={styles.hint}>
            Положите файл в <code>{emulator.bundle}</code> и перезапустите. Как его собрать — в
            docs/windows-games.md
          </p>
          <div className={styles.overlayActions}>
            <button type="button" className="button button-primary" onClick={() => setAttempt(attempt + 1)}>
              Проверить снова
            </button>
            <button type="button" className="button button-ghost" onClick={exit}>
              Закрыть
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.overlay} role="alert">
          <p>Не удалось запустить эмулятор. Проверьте подключение к интернету.</p>
          <div className={styles.overlayActions}>
            <button type="button" className="button button-primary" onClick={() => setAttempt(attempt + 1)}>
              Попробовать снова
            </button>
            <button type="button" className="button button-ghost" onClick={exit}>
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className={styles.toolbar} aria-label="Управление эмулятором" role="toolbar">
        <button
          type="button"
          className={styles.tool}
          onClick={toggleSound}
          aria-pressed={muted}
          title={muted ? 'Включить звук' : 'Выключить звук'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9z" />
            {muted ? <path d="M17 9l5 6M22 9l-5 6" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
          </svg>
          <span className="visually-hidden">{muted ? 'Включить звук' : 'Выключить звук'}</span>
        </button>
        <button
          type="button"
          className={styles.tool}
          onClick={toggleFullscreen}
          title={fullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {fullscreen ? (
              <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
            ) : (
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            )}
          </svg>
          <span className="visually-hidden">{fullscreen ? 'Выйти из полноэкранного режима' : 'На весь экран'}</span>
        </button>
        <button type="button" className={styles.tool} onClick={exit} title="Выйти из игры">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
          <span className="visually-hidden">Выйти из игры</span>
        </button>
      </div>
    </div>
  )
}
