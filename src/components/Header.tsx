import { Link, NavLink } from 'react-router-dom'
import { AUTHOR } from '../config'
import styles from './Header.module.css'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Retrolaunch, на главную">
          <span className={styles.logoDisc} aria-hidden="true" />
          <span className={styles.logoText}>retrolaunch</span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : undefined)}>
            Каталог
          </NavLink>
          <a href={AUTHOR.url} target="_blank" rel="noopener">
            Автор
          </a>
        </nav>
      </div>
    </header>
  )
}
