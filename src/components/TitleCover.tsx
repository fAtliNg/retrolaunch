import type { CSSProperties } from 'react'
import type { Game } from '../types/game'
import { platformLabels } from '../types/game'
import styles from './TitleCover.module.css'

interface TitleCoverProps {
  game: Pick<Game, 'title' | 'year' | 'platform' | 'accent'>
  className?: string
}

/** Запасная обложка для игр без картинки: название на градиенте цвета игры. */
export default function TitleCover({ game, className }: TitleCoverProps) {
  return (
    <div
      className={`${styles.cover} ${className ?? ''}`}
      style={{ '--cover-accent': game.accent } as CSSProperties}
      aria-hidden="true"
    >
      <span className={styles.meta}>
        {game.year} · {platformLabels[game.platform]}
      </span>
      <span className={styles.title}>{game.title}</span>
    </div>
  )
}
