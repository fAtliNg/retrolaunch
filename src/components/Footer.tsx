import { AUTHOR } from '../config'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.note}>
          <span className={styles.brand}>retrolaunch</span> — некоммерческий проект о старых
          компьютерных играх. Если вы правообладатель и хотите, чтобы игру убрали с сайта, напишите
          автору.
        </p>

        <a className={styles.author} href={AUTHOR.url} target="_blank" rel="noopener">
          <span className={styles.authorLabel}>Сделал {AUTHOR.name}</span>
          <span className={styles.authorUrl}>{AUTHOR.label}</span>
        </a>
      </div>
    </footer>
  )
}
