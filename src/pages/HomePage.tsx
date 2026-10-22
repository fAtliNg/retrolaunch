import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useGetGamesQuery } from '../services/gamesApi'
import type { Platform } from '../types/game'
import { platformLabels, statusLabels } from '../types/game'
import { plural } from '../utils/plural'
import GameCard from '../components/GameCard'
import GameArt from '../components/GameArt'
import styles from './HomePage.module.css'

type PlatformFilter = Platform | 'all'

const filters: { value: PlatformFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'windows-9x', label: platformLabels['windows-9x'] },
  { value: 'dos', label: platformLabels.dos },
  { value: 'web', label: 'Браузер' },
]

export default function HomePage() {
  const { data: games = [], isLoading, isError, refetch } = useGetGamesQuery()
  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState<PlatformFilter>('all')
  const searchRef = useRef<HTMLInputElement>(null)

  // В центре внимания — первая игра, в которую уже можно играть
  const featured = games.find((game) => game.status === 'playable') ?? games[0]

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

  // «/» или ⌘K фокусируют поиск, как в привычных приложениях
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const typing = target.closest('input, textarea, [contenteditable="true"]')
      const isSlash = event.key === '/' && !typing
      const isCmdK = event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)
      if (isSlash || isCmdK) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const resetFilters = () => {
    setQuery('')
    setPlatform('all')
  }

  return (
    <>
      <section className={`container ${styles.intro}`}>
        <h1 className={styles.title}>
          Классика ПК.
          <br />
          <span className={styles.titleDim}>Прямо в браузере.</span>
        </h1>
        <p className={styles.lead}>
          Игры, в которые рубились в компьютерных клубах конца 90-х. Ничего не нужно
          устанавливать: открываете страницу и играете.
        </p>
      </section>

      <section className="container" aria-label="В центре внимания">
        {featured ? (
          <div
            className={`${styles.spotlight} cover-host`}
            style={{ '--game-accent': featured.accent } as CSSProperties}
          >
            {/* Размытая обложка — фон баннера, чёткая — постер справа */}
            <GameArt game={featured} variant="card" className={styles.spotlightBackdrop} decorative />
            <div className={styles.spotlightBody}>
              <span className="eyebrow">
                <span className={`chip chip-${featured.status}`}>{statusLabels[featured.status]}</span>
                В центре внимания
              </span>
              <h2 className={styles.spotlightTitle}>{featured.title}</h2>
              <p className={styles.spotlightText}>{featured.tagline}</p>
              <p className={styles.spotlightMeta}>
                {featured.year} · {platformLabels[featured.platform]} · {featured.genres.join(', ')}
              </p>
              <div className={styles.actions}>
                <Link to={`/games/${featured.slug}`} viewTransition className="button button-primary">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
                  </svg>
                  Открыть игру
                </Link>
                <a href="#catalog" className="button button-ghost">
                  Весь каталог
                </a>
              </div>
            </div>
            <Link
              to={`/games/${featured.slug}`}
              viewTransition
              className={styles.poster}
              tabIndex={-1}
              aria-hidden="true"
            >
              <GameArt game={featured} variant="card" decorative priority />
            </Link>
          </div>
        ) : (
          <div className={`${styles.spotlight} ${styles.spotlightEmpty}`} aria-busy={isLoading} />
        )}
      </section>

      <section id="catalog" className={`container ${styles.catalog}`} aria-labelledby="catalog-title">
        <div className={styles.catalogHead}>
          <div>
            <h2 id="catalog-title" className={styles.catalogTitle}>
              Каталог
            </h2>
            {!isLoading && !isError && (
              <p className={styles.count}>
                {games.length} {plural(games.length, ['игра', 'игры', 'игр'])}, будет больше
              </p>
            )}
          </div>

          <div className={styles.controls}>
            <label className={styles.search}>
              <span className="visually-hidden">Поиск по названию</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                ref={searchRef}
                type="search"
                placeholder="Найти игру"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <kbd className={styles.shortcut} aria-hidden="true">
                /
              </kbd>
            </label>

            <div className={styles.segmented} role="group" aria-label="Платформа">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={styles.segment}
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
            {Array.from({ length: 4 }, (_, i) => (
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
              <div className={styles.upcomingInner}>
                <span className={styles.upcomingPlus}>+</span>
                <span>Новые игры скоро</span>
              </div>
            </li>
          </ul>
        )}
      </section>
    </>
  )
}
