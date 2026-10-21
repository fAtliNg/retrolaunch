import { Link } from 'react-router-dom'
import Disc from '../components/Disc'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  return (
    <section className={`container ${styles.page}`}>
      <Disc className={styles.disc} label="404" sublabel="диск не найден" />
      <div className={styles.text}>
        <h1 className={styles.title}>Вставьте диск</h1>
        <p className={styles.lead}>Такой страницы нет. Возможно, игру переименовали или ссылка устарела.</p>
        <Link to="/" className="button button-primary">
          Перейти в каталог
        </Link>
      </div>
    </section>
  )
}
