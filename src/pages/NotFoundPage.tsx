import { Link } from 'react-router-dom'
import { useGetGamesQuery } from '../services/gamesApi'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const { data: games = [] } = useGetGamesQuery()
  const randomGame = games.length > 0 ? games[Math.floor(Math.random() * games.length)] : undefined

  return (
    <section className={`container ${styles.page}`}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>Такой страницы нет</h1>
      <p className={styles.lead}>Возможно, игру переименовали или ссылка устарела.</p>
      <div className={styles.actions}>
        <Link to="/" viewTransition className="button button-primary">
          В каталог
        </Link>
        {randomGame && (
          <Link to={`/games/${randomGame.slug}`} viewTransition className="button button-ghost">
            Случайная игра
          </Link>
        )}
      </div>
    </section>
  )
}
