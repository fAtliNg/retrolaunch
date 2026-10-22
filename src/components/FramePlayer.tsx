import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { FrameEmulator } from '../types/game'
import styles from './DosPlayer.module.css'

interface FramePlayerProps {
  emulator: FrameEmulator
  title: string
  onExit: () => void
}

/**
 * Готовая веб-сборка игры в iframe. Своя страница изолирует глобальные переменные,
 * хранилище и заголовки движка от сайта. Панель — как у DosPlayer.
 */
export default function FramePlayer({ emulator, title, onExit }: FramePlayerProps) {
  const placeholderRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  // null — ещё не измерили окно; iframe появляется только после выбора режима, чтобы не перезагружаться
  const [theater, setTheater] = useState<boolean | null>(null)

  // Интерфейсу некоторых портов тесно в окне 4:3 — тогда показываем игру поверх страницы
  useLayoutEffect(() => {
    const placeholder = placeholderRef.current
    if (!placeholder) return
    const { width, height } = placeholder.getBoundingClientRect()
    setTheater(width < (emulator.minWidth ?? 0) || height < (emulator.minHeight ?? 0))
  }, [emulator.minWidth, emulator.minHeight])

  useEffect(() => {
    if (!theater) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onExit()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [theater, onExit])

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void rootRef.current?.requestFullscreen()
  }

  const exit = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    onExit()
  }

  if (theater === null) {
    return <div ref={placeholderRef} className={styles.root} />
  }

  const player = (
    <div ref={rootRef} className={`${styles.root} ${theater ? styles.theater : ''}`}>
      <iframe
        className={styles.frame}
        src={`${import.meta.env.BASE_URL}${emulator.src}`}
        title={title}
        allow="fullscreen; autoplay; gamepad"
        onLoad={() => setLoaded(true)}
      />

      {!loaded && (
        <div className={styles.overlay} role="status">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Запускаем {title}…</p>
        </div>
      )}

      <div className={styles.toolbar} aria-label="Управление игрой" role="toolbar">
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

  // Окно игры лежит в блоке с isolation: isolate, поэтому поверх шапки его можно вывести только порталом
  return theater ? createPortal(player, document.body) : player
}
