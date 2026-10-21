import { useId } from 'react'
import type { GameCoverTheme } from '../types/game'
import styles from './GameCover.module.css'

interface GameCoverProps {
  theme: GameCoverTheme
  /** Мигалки полиции. На карточках выключены, на странице игры — включены. */
  animated?: boolean
  className?: string
}

/**
 * Обложка, нарисованная кодом: закатное небо, трасса в перспективе и мигалки.
 * Свои картинки для каждой игры можно будет добавить позже.
 */
export default function GameCover({ theme, animated = false, className }: GameCoverProps) {
  const id = useId().replace(/:/g, '')
  const [skyTop, skyMid, skyLow] = theme.sky
  const [red, blue] = theme.lights

  return (
    <svg
      className={`${styles.cover} ${animated ? styles.animated : ''} ${className ?? ''}`}
      viewBox="0 0 400 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.55" stopColor={skyMid} />
          <stop offset="1" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={`road-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={theme.road} stopOpacity="0.85" />
          <stop offset="1" stopColor={theme.road} />
        </linearGradient>
        <radialGradient id={`red-${id}`}>
          <stop offset="0" stopColor={red} stopOpacity="0.9" />
          <stop offset="1" stopColor={red} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`blue-${id}`}>
          <stop offset="0" stopColor={blue} stopOpacity="0.9" />
          <stop offset="1" stopColor={blue} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="230" fill={`url(#sky-${id})`} />
      <circle cx="200" cy="212" r="78" fill={theme.sun} opacity="0.95" />

      {/* Горы на горизонте */}
      <path
        d="M0 230 L0 190 L48 168 L92 192 L140 150 L190 186 L236 160 L280 184 L330 146 L372 176 L400 164 L400 230 Z"
        fill={skyTop}
        opacity="0.92"
      />

      {/* Земля и трасса */}
      <rect y="230" width="400" height="170" fill={theme.road} />
      <path d="M186 230 L214 230 L400 400 L0 400 Z" fill={`url(#road-${id})`} />
      <path d="M186 230 L176 230 L0 380 L0 400 Z" fill={theme.stripe} opacity="0.55" />
      <path d="M214 230 L224 230 L400 380 L400 400 Z" fill={theme.stripe} opacity="0.55" />

      {/* Разметка */}
      <g fill={theme.stripe}>
        <path d="M199 236 L201 236 L202 248 L198 248 Z" />
        <path d="M198 262 L202 262 L204 284 L196 284 Z" />
        <path d="M196 304 L204 304 L208 340 L192 340 Z" />
        <path d="M193 362 L207 362 L212 400 L188 400 Z" />
      </g>

      {/* Мигалки */}
      <circle className={styles.red} cx="40" cy="372" r="90" fill={`url(#red-${id})`} />
      <circle className={styles.blue} cx="360" cy="372" r="90" fill={`url(#blue-${id})`} />
    </svg>
  )
}
