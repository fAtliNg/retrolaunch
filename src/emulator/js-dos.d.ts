// Минимальные типы для глобального Dos() из js-dos 8: только то, что использует сайт.
// Полный список опций: https://js-dos.com/player-api.html

declare const __JSDOS_VERSION__: string

type DosEvent = 'emu-ready' | 'bnd-play' | 'ci-ready' | 'fullscreen-change' | 'open-key'

interface DosOptions {
  url: string
  pathPrefix: string
  backend: 'dosbox' | 'dosboxX'
  backendLocked: boolean
  theme: string
  lang: 'en' | 'ru'
  kiosk: boolean
  autoStart: boolean
  autoSave: boolean
  workerThread: boolean
  offscreenCanvas: boolean
  renderBackend: 'webgl' | 'canvas'
  renderAspect: 'AsIs' | '1/1' | '5/4' | '4/3' | '16/10' | '16/9' | 'Fit'
  imageRendering: 'pixelated' | 'smooth'
  volume: number
  onEvent: (event: DosEvent, arg?: unknown) => void
}

interface DosProps {
  setVolume(volume: number): void
  setPaused(paused: boolean): void
  save(): Promise<boolean>
  stop(): Promise<void>
}

type DosFn = (element: HTMLElement, options: Partial<DosOptions>) => DosProps

interface Window {
  Dos?: DosFn
}
