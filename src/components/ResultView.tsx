import type { Vibe } from '../types'
import { formatDateTime } from '../lib/format'
import { textOn } from '../lib/color'
import {
  ArrowLeft,
  DownloadIcon,
  RefreshIcon,
  ShareIcon,
} from './Icons'

interface ResultViewProps {
  vibe: Vibe
  archived: boolean
  downloading: boolean
  onReroll: () => void
  onShare: () => void
  onDownload: () => void
  onEdit: () => void
  onCopyColor: (hex: string) => void
}

export function ResultView({
  vibe,
  archived,
  downloading,
  onReroll,
  onShare,
  onDownload,
  onEdit,
  onCopyColor,
}: ResultViewProps) {
  return (
    <main className="result-shell">
      <section className="result-hero" aria-labelledby="vibe-title">
        <div className="result-kicker">
          <span className="result-kicker__dot" />
          <span>VIBE NO. {vibe.number}</span>
          <span className="result-kicker__line" />
          <span>{vibe.kicker}</span>
        </div>

        <h1 className="result-title" id="vibe-title">
          {vibe.title.split('\n').map((line, index) => (
            <span key={`${line}-${index}`}>{line}</span>
          ))}
        </h1>

        <p className="result-line">{vibe.line}</p>

        <div className="result-meta">
          <p className="result-signature">{vibe.signature}</p>
          <ul className="result-keywords" aria-label="今日关键词">
            {vibe.keywords.map((keyword) => (
              <li key={keyword.label}>
                <span style={{ background: keyword.color }} />
                {keyword.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <aside className="vibe-panel" aria-label="今日 Vibe 配方">
        <header className="vibe-panel__head">
          <div>
            <span className="panel-eyebrow">TODAY&apos;S RECIPE</span>
            <h2>今日配方</h2>
          </div>
          <span className="panel-seed">SEED {vibe.seed}</span>
        </header>

        <section className="panel-section">
          <div className="panel-section__label">
            <span>01 / 色彩</span>
            <small>点击复制色值</small>
          </div>
          <div className="palette-strip">
            {vibe.palette.colors.map((color) => (
              <button
                className="swatch"
                type="button"
                key={color.hex}
                style={{ background: color.hex, color: textOn(color.hex) }}
                title={`复制 ${color.hex}`}
                aria-label={`复制 ${color.name} ${color.hex}`}
                onClick={() => onCopyColor(color.hex)}
              >
                <span className="swatch__name">{color.name}</span>
                <span className="swatch__hex">{color.hex.replace('#', '')}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel-section panel-section--listening">
          <div className="panel-section__label">
            <span>02 / 听觉气质</span>
            <small>{vibe.listening.bpm}</small>
          </div>

          <div className="listening-row">
            <div>
              <p className="listening-genre">{vibe.listening.genre}</p>
              <p className="listening-note">{vibe.listening.note}</p>
            </div>
            <span className="equalizer" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          </div>

          <ul className="texture-list" aria-label="声音配方">
            {vibe.listening.textures.map((texture) => (
              <li key={texture}>{texture}</li>
            ))}
          </ul>

          <p className="listening-scene">{vibe.listening.scene}</p>
        </section>

        <p className="panel-footnote">
          <span>NOTE</span>
          {vibe.footnote}
        </p>

        <div className="panel-actions">
          <button className="primary-action" type="button" onClick={onReroll}>
            <RefreshIcon size={17} />
            再抽一次
          </button>
          <button
            className="icon-action"
            type="button"
            onClick={onShare}
            aria-label="复制分享链接"
            title="复制分享链接"
          >
            <ShareIcon size={18} />
          </button>
          <button
            className="icon-action"
            type="button"
            onClick={onDownload}
            disabled={downloading}
            aria-label="下载氛围卡"
            title="下载 1080 × 1440 氛围卡"
          >
            {downloading ? <span className="spinner" /> : <DownloadIcon size={18} />}
          </button>
        </div>

        <div className="panel-subactions">
          <span className={`archive-status ${archived ? '' : 'is-off'}`}>
            <i />
            {archived ? '已存入本机档案' : '未存入档案'}
          </span>
          <button className="edit-link" type="button" onClick={onEdit}>
            <ArrowLeft size={14} />
            调整输入
          </button>
        </div>
      </aside>

      <footer className="result-footer">
        <span>{formatDateTime(vibe.createdAt)}</span>
        <span className="result-footer__center">
          {vibe.weather.label} / {vibe.mood.label}
        </span>
        <span>VIBE GENERATOR / LOCAL ARCHIVE</span>
      </footer>
    </main>
  )
}
