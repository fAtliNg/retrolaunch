export type Platform = 'windows-9x' | 'dos'

export type GameStatus = 'playable' | 'coming-soon'

export interface GameControl {
  keys: string[]
  action: string
}

/** Цвета для обложки, которую рисуем CSS-ом, пока нет своих картинок. */
export interface GameCoverTheme {
  sky: [string, string, string]
  sun: string
  road: string
  stripe: string
  lights: [string, string]
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
  cover: GameCoverTheme
}

export const platformLabels: Record<Platform, string> = {
  'windows-9x': 'Windows 95/98',
  dos: 'MS-DOS',
}

export const statusLabels: Record<GameStatus, string> = {
  playable: 'Можно играть',
  'coming-soon': 'Скоро',
}
