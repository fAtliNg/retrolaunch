import { Link } from 'react-router-dom'
import type { Game } from '../types/game'
import { platformLabels, statusLabels } from '../types/game'
import GameCover from './GameCover'
import Disc from './Disc'
import styles from './GameCard.module.css'

interface GameCardProps {
  game: Game
}

/** Карточка в виде коробки от диска: при наведении диск выезжает из коробки. */
export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.slug}`} className={styles.card}>
      <div className={styles.stage}>
        <Disc className={styles.disc} label={game.shortTitle} sublabel={String(game.year)} />
        <div className={styles.case}>
          <span className={styles.spine}>{game.shortTitle}</span>
          <div className={styles.art}>
            <GameCover theme={game.cover} />
          </div>
        </div>
      </div>

      <div className={styles.meta}>
        <h3 className={styles.title}>{game.title}</h3>
        <p className={styles.details}>
          {game.year}, {platformLabels[game.platform]}
        </p>
        <span className={`${styles.status} ${styles[game.status]}`}>{statusLabels[game.status]}</span>
      </div>
    </Link>
  )
}
