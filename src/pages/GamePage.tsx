import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetGameBySlugQuery } from '../services/gamesApi'
import { platformLabels, statusLabels } from '../types/game'
import GameCover from '../components/GameCover'
import NotFoundPage from './NotFoundPage'
import styles from './GamePage.module.css'

export default function GamePage() {
  const { slug = '' } = useParams()
  const { data: game, isLoading, isError, refetch } = useGetGameBySlugQuery(slug)
  const [launched, setLaunched] = useState(false)

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

  const facts = [
    { label: 'Год', value: String(game.year) },
    { label: 'Платформа', value: platformLabels[game.platform] },
    { label: 'Жанр', value: game.genres.join(', ') },
    { label: 'Разработчик', value: game.developer },
    { label: 'Издатель', value: game.publisher },
  ]

  return (
    <article className={`container ${styles.page}`}>
      <Link to="/" className={styles.back}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
        Каталог
      </Link>

      <div className={styles.top}>
        {/* Экран, в котором позже будет работать эмулятор */}
        <div className={styles.monitor}>
          <div className={styles.screen}>
            {!launched ? (
              <>
                <GameCover theme={game.cover} animated className={styles.screenCover} />
                <div className={styles.screenOverlay}>
                  <button
                    type="button"
                    className={`button button-primary ${styles.play}`}
                    onClick={() => setLaunched(true)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M7 4.5v15l13-7.5z" />
                    </svg>
                    Запустить игру
                  </button>
                </div>
              </>
            ) : (
              <div className={styles.boot} role="status">
                <p className={styles.bootLine}>Загрузка Windows 98…</p>
                <p className={styles.bootText}>
                  Эмулятор пока в разработке. Когда {game.shortTitle} заработает, игра запустится
                  прямо в этом окне.
                </p>
                <button type="button" className="button button-ghost" onClick={() => setLaunched(false)}>
                  Закрыть
                </button>
              </div>
            )}
          </div>
        </div>

        <header className={styles.info}>
          <span className={`${styles.status} ${styles[game.status]}`}>{statusLabels[game.status]}</span>
          <h1 className={styles.title}>{game.title}</h1>
          <p className={styles.tagline}>{game.tagline}</p>

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
          <section aria-labelledby="controls-title">
            <h2 id="controls-title" className={styles.sectionTitle}>
              Управление
            </h2>
            <ul className={styles.controls}>
              {game.controls.map((control) => (
                <li key={control.action}>
                  <span className={styles.keys}>
                    {control.keys.map((key) => (
                      <kbd key={key}>{key}</kbd>
                    ))}
                  </span>
                  <span>{control.action}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="req-title">
            <h2 id="req-title" className={styles.sectionTitle}>
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
        </aside>
      </div>
    </article>
  )
}
