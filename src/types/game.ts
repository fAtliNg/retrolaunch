/** web — игры, которые работают через собственный браузерный порт, а не через эмулятор */
export type Platform = 'windows-9x' | 'dos' | 'web'

export type GameStatus = 'playable' | 'coming-soon'

export interface GameControl {
  keys: string[]
  action: string
}

/** Цвета для обложки, которую рисуем кодом, когда у игры нет картинки. */
export interface GameCoverTheme {
  sky: [string, string, string]
  sun: string
  road: string
  stripe: string
  lights: [string, string]
}

/** Настоящая обложка. Пути — относительно корня сайта (папка public). */
export interface GameArtwork {
  /** Вертикальная обложка 3:4, ~720 px по ширине: карточки, постер, фоновые подложки */
  card: string
  /** Большая картинка для окна игры (4:3), может быть другим кадром */
  full: string
  alt: string
  /** object-position для кадрирования в широкие рамки, например «50% 30%» */
  focus?: string
}

interface EmulatorBase {
  /**
   * Файлы лежат только на компьютере разработчика в папке local-games/ и не публикуются:
   * так можно проверять игры со своих дисков. В production-сборке игра показывается как «скоро».
   */
  localOnly?: boolean
}

/** DOS и Windows 9x через js-dos */
export interface JsDosEmulator extends EmulatorBase {
  engine: 'js-dos'
  /** Пакет .jsdos (zip с файлами игры и dosbox.conf), путь относительно корня сайта */
  bundle: string
  /** dosbox — для DOS-игр, dosboxX — для Windows 9x и 3dfx */
  backend: 'dosbox' | 'dosboxX'
  /** Эмуляция 3dfx Voodoo через WebGL (только dosboxX). Нужен OffscreenCanvas в браузере. */
  voodoo?: boolean
}

/** Готовая веб-сборка движка (Micropolis, ScummVM и т. п.) в своей странице внутри iframe */
export interface FrameEmulator extends EmulatorBase {
  engine: 'iframe'
  /** Страница сборки, путь относительно корня сайта, например engines/micropolis/index.html */
  src: string
  /** Если окно игры на странице меньше, плеер разворачивается на всё окно браузера */
  minWidth?: number
  minHeight?: number
}

/** Как запускать игру в браузере */
export type GameEmulator = JsDosEmulator | FrameEmulator

/** Условия, на которых игра выложена, и ссылки на исходники (обязательны для GPL) */
export interface GameLicense {
  summary: string
  links: { label: string; url: string }[]
}

export interface Game {
  slug: string
  title: string
  shortTitle: string
  year: number
  developer: string
  publisher: string
  platform: Platform
  genres: string[]
  status: GameStatus
  tagline: string
  description: string[]
  features: string[]
  controls: GameControl[]
  requirements: {
    original: string
    browser: string
  }
  /** Фирменный цвет игры: подсветка карточки, свечение вокруг окна игры. */
  accent: string
  license?: GameLicense
  /** Нет эмулятора — в окне игры показываем заглушку «скоро» */
  emulator?: GameEmulator
  /** Если картинки нет, обложка рисуется кодом: сцена по цветам из cover или название игры */
  art?: GameArtwork
  cover?: GameCoverTheme
}

export const platformLabels: Record<Platform, string> = {
  'windows-9x': 'Windows 95/98',
  dos: 'MS-DOS',
  web: 'Порт для браузера',
}

export const statusLabels: Record<GameStatus, string> = {
  playable: 'Можно играть',
  'coming-soon': 'Скоро',
}
