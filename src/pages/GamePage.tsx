import { useRef, useState, type CSSProperties } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetGameBySlugQuery } from '../services/gamesApi'
import { platformLabels, statusLabels } from '../types/game'
import GameArt from '../components/GameArt'
import DosPlayer from '../components/DosPlayer'
import FramePlayer from '../components/FramePlayer'
import { availableEmulator } from '../emulator/availability'
import NotFoundPage from './NotFoundPage'
import styles from './GamePage.module.css'

export default function GamePage() {
  const { slug = '' } = useParams()
  const { data: game, isLoading, isError, refetch } = useGetGameBySlugQuery(slug)
  const [launched, setLaunched] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)

  if (isLoading) {
    return (
      <div className={`container ${styles.page}`} aria-busy="true">
        <div className={styles.skeleton} />
      </div>
    )
  }

  if (isError) {
    return (
      <div className={`container ${styles.page}`}>
        <div className={styles.error}>
          <p>Не удалось загрузить страницу игры. Проверьте подключение к интернету.</p>
          <button type="button" className="button button-ghost" onClick={() => refetch()}>
            Загрузить снова
          </button>
        </div>
      </div>
    )
  }

  if (!game) {
    return <NotFoundPage />
  }

  const emulator = availableEmulator(game)

  const launch = () => {
    setLaunched(true)
    playerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const facts = [
    { label: 'Год', value: String(game.year) },
    { label: 'Платформа', value: platformLabels[game.platform] },
    { label: 'Жанр', value: game.genres.join(', ') },
    { label: 'Разработчик', value: game.developer },
    { label: 'Издатель', value: game.publisher },
  ]

  return (
    <article
      className={`container ${styles.page}`}
      style={{ '--game-accent': game.accent } as CSSProperties}
    >
      <Link to="/" viewTransition className={styles.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Каталог
      </Link>

      <div className={styles.top}>
        <div className={styles.stage}>
          {/* Размытая копия обложки — мягкое свечение цветом игры вокруг окна */}
          <div className={styles.ambient} aria-hidden="true">
            <GameArt game={game} variant="card" decorative />
          </div>

          {/* Окно, в котором позже будет работать эмулятор. Ретро живёт только здесь. */}
          <div
            ref={playerRef}
            className={styles.player}
            style={{ viewTransitionName: `game-${game.slug}` }}
          >
            {!launched ? (
              <>
                <GameArt
                  game={game}
                  variant="full"
                  className={styles.playerCover}
                  focused
                  animated
                  priority
                />
                <button type="button" className={styles.play} onClick={launch}>
                  <span className={styles.playIcon} aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className={styles.playLabel}>Запустить игру</span>
                </button>
              </>
            ) : emulator?.engine === 'js-dos' ? (
              <DosPlayer emulator={emulator} title={game.shortTitle} onExit={() => setLaunched(false)} />
            ) : emulator?.engine === 'iframe' ? (
              <FramePlayer emulator={emulator} title={game.shortTitle} onExit={() => setLaunched(false)} />
            ) : (
              <div className={styles.desktop} role="status">
                <div className={styles.window}>
                  <div className={styles.windowTitle}>
                    <span>{game.shortTitle}</span>
                    <span className={styles.windowClose} aria-hidden="true">
                      ×
                    </span>
                  </div>
                  <div className={styles.windowBody}>
                    <p className={styles.windowHeading}>Загрузка Windows 98…</p>
                    <div className={styles.progress} aria-hidden="true">
                      <span />
                    </div>
                    <p>
                      Эмулятор пока в разработке. Когда {game.shortTitle} заработает, игра
                      запустится прямо в этом окне.
                    </p>
                    <button
                      type="button"
                      className={styles.windowButton}
                      onClick={() => setLaunched(false)}
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <header className={styles.info}>
          <span className={`chip chip-${game.status}`}>{statusLabels[game.status]}</span>
          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.tagline}>{game.tagline}</p>

          <button type="button" className={`button button-primary ${styles.cta}`} onClick={launch}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
            </svg>
            Играть в браузере
          </button>

          <dl className={styles.facts}>
            {facts.map((fact) => (
              <div key={fact.label} className={styles.fact}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>
      </div>

      <div className={styles.details}>
        <section className={styles.about} aria-labelledby="about-title">
          <h2 id="about-title" className={styles.sectionTitle}>
            Об игре
          </h2>
          {game.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <ul className={styles.features}>
            {game.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>

        <aside className={styles.side}>
          <section className={styles.panel} aria-labelledby="controls-title">
            <h2 id="controls-title" className={styles.panelTitle}>
              Управление
            </h2>
            <ul className={styles.controls}>
              {game.controls.map((control) => (
                <li key={control.action}>
                  <span>{control.action}</span>
                  <span className={styles.keys}>
                    {control.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.panel} aria-labelledby="req-title">
            <h2 id="req-title" className={styles.panelTitle}>
              Что нужно
            </h2>
            <dl className={styles.requirements}>
              <div>
                <dt>Для игры в браузере</dt>
                <dd>{game.requirements.browser}</dd>
              </div>
              <div>
                <dt>Оригинальные требования</dt>
                <dd>{game.requirements.original}</dd>
              </div>
            </dl>
          </section>

          {game.license && (
            <section className={styles.panel} aria-labelledby="license-title">
              <h2 id="license-title" className={styles.panelTitle}>
                Лицензия
              </h2>
              <p className={styles.license}>{game.license.summary}</p>
              <ul className={styles.licenseLinks}>
                {game.license.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  )
}
