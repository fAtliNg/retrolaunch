import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Game } from '../types/game'
import { platformLabels, statusLabels } from '../types/game'
import GameArt from './GameArt'
import styles from './GameCard.module.css'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.slug}`}
      viewTransition
      className={`${styles.card} cover-host`}
      style={{ '--game-accent': game.accent } as CSSProperties}
    >
      <div className={styles.media} style={{ viewTransitionName: `game-${game.slug}` }}>
        <GameArt game={game} variant="card" className={styles.art} />
        <span className={`chip chip-${game.status} ${styles.status}`}>{statusLabels[game.status]}</span>
      </div>

      <div className={styles.meta}>
        <h3 className={styles.title}>{game.title}</h3>
        <p className={styles.details}>
          {game.year} · {platformLabels[game.platform]} · {game.genres[0]}
        </p>
      </div>
    </Link>
  )
}
