import { useEffect, useRef } from 'react'
import type { Vibe } from '../types'
import { CloseIcon } from './Icons'

type ReasoningKey = keyof Vibe['reasoning']

const ROWS: Array<{ key: ReasoningKey; label: string; en: string }> = [
  { key: 'weather', label: '天气输入', en: 'WEATHER' },
  { key: 'mood', label: '心情调色', en: 'MOOD' },
  { key: 'palette', label: '色板选择', en: 'PALETTE' },
  { key: 'motion', label: '粒子参数', en: 'MOTION' },
  { key: 'words', label: '文案来源', en: 'WORDS' },
]

interface ReasoningSheetProps {
  vibe: Vibe
  open: boolean
  onClose: () => void
}

export function ReasoningSheet({ vibe, open, onClose }: ReasoningSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 40)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div
      className="reasoning-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="reasoning-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reasoning-title"
      >
        <header className="reasoning-head">
          <div>
            <span className="panel-eyebrow">WHY THIS VIBE</span>
            <h2 id="reasoning-title">
              生成手记
              <sup>NO. {vibe.number}</sup>
            </h2>
          </div>
          <button
            className="drawer-close"
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="关闭生成手记"
          >
            <CloseIcon size={19} />
          </button>
        </header>

        <p className="reasoning-intro">
          这不是一堆随机参数。下面是这一次从天气、心情到视觉和文字的因果链。
        </p>

        <dl className="reasoning-list">
          {ROWS.map((row, index) => (
            <div className="reasoning-row" key={row.key}>
              <dt>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {row.label}
                <small>{row.en}</small>
              </dt>
              <dd>{vibe.reasoning[row.key]}</dd>
            </div>
          ))}
        </dl>

        <div className="reasoning-seed">
          <span>SEED</span>
          <strong>{vibe.seed}</strong>
          <i />
          <span>GRADIENT {vibe.gradient.angle}°</span>
          <i />
          <span>{vibe.palette.mode === 'dark' ? 'DARK' : 'LIGHT'} ROOM</span>
        </div>

        <footer className="reasoning-foot">
          <p>实时天气只在生成时参与映射，不会保存城市、温度或坐标。</p>
          <p>同样的输入 + seed，会回到同一张卡。</p>
        </footer>
      </section>
    </div>
  )
}
