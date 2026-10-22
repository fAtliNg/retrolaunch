import { Link, NavLink } from 'react-router-dom'
import { AUTHOR } from '../config'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Retrolaunch, на главную">
          <svg className={styles.mark} viewBox="0 0 64 64" aria-hidden="true">
            <rect width="64" height="64" rx="16" />
            <path d="M25 19.5v25L45 32z" />
          </svg>
          <span className={styles.wordmark}>retrolaunch</span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Каталог
          </NavLink>
          <a href={AUTHOR.url} target="_blank" rel="noopener">
            Автор
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 16L16 8M9 8h7v7" />
            </svg>
          </a>
        </nav>
      </div>
    </header>
  )
}
