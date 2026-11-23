import { useEffect, useMemo, useRef, useState } from 'react'
import type { HistoryEntry } from '../types'
import { generateVibe } from '../lib/generator'
import { formatArchiveTime } from '../lib/format'
import { CloseIcon, SparkIcon, TrashIcon } from './Icons'

interface HistoryDrawerProps {
  open: boolean
  history: HistoryEntry[]
  onClose: () => void
  onRestore: (entry: HistoryEntry) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export function HistoryDrawer({
  open,
  history,
  onClose,
  onRestore,
  onDelete,
  onClear,
}: HistoryDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const clearTimer = useRef<number | null>(null)
  const [clearArmed, setClearArmed] = useState(false)

  const previews = useMemo(
    () =>
      history.map((entry) => ({
        entry,
        vibe: generateVibe(entry.input, entry.seed, entry.createdAt),
      })),
    [history],
  )

  useEffect(() => {
    if (!open) {
      setClearArmed(false)
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.setTimeout(() => closeButtonRef.current?.focus(), 40)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  useEffect(() => {
    return () => {
      if (clearTimer.current) window.clearTimeout(clearTimer.current)
    }
  }, [])

  if (!open) return null

  const handleClear = () => {
    if (!clearArmed) {
      setClearArmed(true)
      clearTimer.current = window.setTimeout(() => setClearArmed(false), 3200)
      return
    }
    if (clearTimer.current) window.clearTimeout(clearTimer.current)
    setClearArmed(false)
    onClear()
  }

  return (
    <div
      className="history-layer"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <aside
        className="history-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
      >
        <header className="drawer-head">
          <div>
            <span className="panel-eyebrow">LOCAL ARCHIVE</span>
            <h2 id="history-title">
              今日档案
              <sup>{String(history.length).padStart(2, '0')}</sup>
            </h2>
          </div>
          <button
            className="drawer-close"
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="关闭档案"
          >
            <CloseIcon size={19} />
          </button>
        </header>

        <p className="drawer-intro">
          每一次生成都会自动留在这里。点开任意一天，可以找回当时的心情。
        </p>

        {previews.length === 0 ? (
          <div className="archive-empty">
            <span className="archive-empty__mark">
              <SparkIcon size={26} />
            </span>
            <h3>档案还是空的</h3>
            <p>先为自己生成一个今天。</p>
            <button type="button" onClick={onClose}>
              去选一种氛围
            </button>
          </div>
        ) : (
          <div className="history-list">
            {previews.map(({ entry, vibe }) => (
              <article className="history-item" key={entry.id}>
                <button
                  className="history-item__open"
                  type="button"
                  onClick={() => onRestore(entry)}
                >
                  <span
                    className="history-thumb"
                    style={{
                      background: `linear-gradient(135deg, ${vibe.palette.colors[0].hex}, ${vibe.palette.colors[1].hex} 55%, ${vibe.palette.colors[2].hex})`,
                    }}
                  >
                    <span style={{ color: vibe.palette.colors[4].hex }}>
                      {vibe.number}
                    </span>
                  </span>
                  <span className="history-item__body">
                    <span className="history-item__title">
                      {vibe.title.replace('\n', ' ')}
                    </span>
                    <span className="history-item__meta">
                      {vibe.weather.label} · {vibe.mood.label} ·{' '}
                      {formatArchiveTime(entry.createdAt)}
                    </span>
                  </span>
                  <span className="history-item__seed">#{entry.seed}</span>
                </button>
                <button
                  className="history-item__delete"
                  type="button"
                  aria-label={`删除 ${vibe.title.replace('\n', ' ')}`}
                  onClick={() => onDelete(entry.id)}
                >
                  <TrashIcon size={15} />
                </button>
              </article>
            ))}
          </div>
        )}

        <footer className="drawer-foot">
          <p>仅保存在此浏览器 · 不会上传到任何服务器</p>
          <button
            className={clearArmed ? 'is-armed' : ''}
            type="button"
            disabled={history.length === 0}
            onClick={handleClear}
          >
            {clearArmed ? '再点一次确认' : '清空档案'}
          </button>
        </footer>
      </aside>
    </div>
  )
}
