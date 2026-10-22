import type { Game, GameEmulator } from '../types/game'

/** Эмулятор, который можно запустить в текущей сборке. Локальные игры доступны только в dev. */
export function availableEmulator(game: Pick<Game, 'emulator'>): GameEmulator | undefined {
  const { emulator } = game
  if (!emulator) return undefined
  if (emulator.localOnly && !import.meta.env.DEV) return undefined
  return emulator
}
