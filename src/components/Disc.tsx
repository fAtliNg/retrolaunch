import styles from './Disc.module.css'

interface DiscProps {
  label: string
  sublabel?: string
  className?: string
}

/** Компакт-диск с переливающейся поверхностью и подписью маркером. */
export default function Disc({ label, sublabel, className }: DiscProps) {
  return (
    <div className={`${styles.disc} ${className ?? ''}`} aria-hidden="true">
      <div className={styles.surface} />
      <div className={styles.label}>
        <span className={styles.labelMain}>{label}</span>
        {sublabel && <span className={styles.labelSub}>{sublabel}</span>}
      </div>
      <div className={styles.hub} />
    </div>
  )
}
