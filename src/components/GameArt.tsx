import type { Game } from '../types/game'
import GameCover from './GameCover'
import TitleCover from './TitleCover'
import styles from './GameArt.module.css'

interface GameArtProps {
  game: Pick<Game, 'art' | 'cover' | 'title' | 'year' | 'platform' | 'accent'>
  /** card — вертикальная обложка 3:4, full — большая картинка для окна игры */
  variant: 'card' | 'full'
  /** Подстраивать кадр под широкую рамку по art.focus */
  focused?: boolean
  /** Мигалки на рисованной обложке. На картинку не влияет. */
  animated?: boolean
  /** Только фон: скрыть от скринридеров */
  decorative?: boolean
  priority?: boolean
  className?: string
}

/** Обложка игры: настоящая картинка, если есть, иначе нарисованная кодом. */
export default function GameArt({
  game,
  variant,
  focused = false,
  animated = false,
  decorative = false,
  priority = false,
  className,
}: GameArtProps) {
  if (!game.art) {
    return game.cover ? (
      <GameCover theme={game.cover} animated={animated} className={className} />
    ) : (
      <TitleCover game={game} className={className} />
    )
  }

  const { alt, focus } = game.art

  return (
    <img
      className={`${styles.art} ${className ?? ''}`}
      src={`${import.meta.env.BASE_URL}${game.art[variant]}`}
      alt={decorative ? '' : alt}
      aria-hidden={decorative || undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={focused && focus ? { objectPosition: focus } : undefined}
    />
  )
}
