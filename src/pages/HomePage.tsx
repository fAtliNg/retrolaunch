import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetGamesQuery } from '../services/gamesApi'
import type { Platform } from '../types/game'
import { platformLabels } from '../types/game'
import GameCard from '../components/GameCard'
import Disc from '../components/Disc'
import styles from './HomePage.module.css'

type PlatformFilter = Platform | 'all'

const filters: { value: PlatformFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'windows-9x', label: platformLabels['windows-9x'] },
  { value: 'dos', label: platformLabels.dos },
]

export default function HomePage() {
  const { data: games = [], isLoading, isError, refetch } = useGetGamesQuery()
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState<PlatformFilter>('all')

  const featured = games[0]

  const visibleGames = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return games.filter((game) => {
      const matchesPlatform = platform === 'all' || game.platform === platform
      const matchesQuery =
        !normalized ||
        game.title.toLowerCase().includes(normalized) ||
        game.shortTitle.toLowerCase().includes(normalized)
      return matchesPlatform && matchesQuery
    })
  }, [games, query, platform])

  const resetFilters = () => {
    setQuery('')
    setPlatform('all')
  }

  return (
    <>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>Игры из компьютерного клуба. Прямо в браузере.</h1>
          <p className={styles.lead}>
            Ничего не нужно устанавливать: открываете страницу игры и играете. Начинаем с Need for
            Speed III, дальше будет больше.
          </p>
          <div className={styles.actions}>
            {featured && (
              <Link to={`/games/${featured.slug}`} className="button button-primary">
                Открыть {featured.shortTitle}
              </Link>
            )}
            <a href="#catalog" className="button button-ghost">
              Смотреть каталог
            </a>
          </div>
        </div>

        <div className={styles.heroArt}>
          <div className={styles.glow} aria-hidden="true" />
          <Disc
            className={styles.heroDisc}
            label={featured?.shortTitle ?? 'retro'}
            sublabel={featured ? `${featured.year}` : undefined}
          />
        </div>
      </section>

      <section id="catalog" className={`container ${styles.catalog}`} aria-labelledby="catalog-title">
        <div className={styles.catalogHead}>
          <h2 id="catalog-title" className={styles.catalogTitle}>
            Каталог
          </h2>

          <div className={styles.controls}>
            <label className={styles.search}>
              <span className="visually-hidden">Поиск по названию</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Найти игру"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>

            <div className={styles.filters} role="group" aria-label="Платформа">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={styles.filter}
                  aria-pressed={platform === filter.value}
                  onClick={() => setPlatform(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div className={styles.grid} aria-busy="true">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        )}

        {isError && (
          <div className={styles.message}>
            <p>Не удалось загрузить каталог. Проверьте подключение к интернету.</p>
            <button type="button" className="button button-ghost" onClick={() => refetch()}>
              Загрузить снова
            </button>
          </div>
        )}

        {!isLoading && !isError && visibleGames.length === 0 && (
          <div className={styles.message}>
            <p>По такому запросу игр нет. Попробуйте другое название или другую платформу.</p>
            <button type="button" className="button button-ghost" onClick={resetFilters}>
              Сбросить фильтры
            </button>
          </div>
        )}

        {visibleGames.length > 0 && (
          <ul className={styles.grid}>
            {visibleGames.map((game) => (
              <li key={game.slug}>
                <GameCard game={game} />
              </li>
            ))}
            <li className={styles.upcoming} aria-hidden="true">
              <div className={styles.upcomingCase}>
                <span>Новые игры появятся здесь</span>
              </div>
            </li>
          </ul>
        )}
      </section>
    </>
  )
}
