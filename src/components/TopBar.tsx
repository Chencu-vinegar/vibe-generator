import { formatToday } from '../lib/format'
import { ArrowLeft, HistoryIcon } from './Icons'

interface TopBarProps {
  stage: 'compose' | 'result'
  historyCount: number
  onHome: () => void
  onHistory: () => void
  onEdit: () => void
}

export function TopBar({
  stage,
  historyCount,
  onHome,
  onHistory,
  onEdit,
}: TopBarProps) {
  return (
    <header className="topbar">
      <button className="brand" type="button" onClick={onHome} aria-label="回到首页">
        <span className="brand__orb" aria-hidden="true">
          <span />
        </span>
        <span className="brand__type">
          VIBE
          <small>今日氛围生成器</small>
        </span>
      </button>

      <p className="topbar__note">
        A GENERATOR FOR FEELINGS
        <span>/</span>
        {stage === 'compose' ? 'INPUT' : 'OUTPUT'}
      </p>

      <div className="topbar__right">
        <span className="topbar__date">{formatToday()}</span>
        {stage === 'result' && (
          <button className="topbar__edit" type="button" onClick={onEdit}>
            <ArrowLeft size={14} />
            调整输入
          </button>
        )}
        <button className="archive-button" type="button" onClick={onHistory}>
          <HistoryIcon size={15} />
          <span>档案</span>
          <sup>{String(historyCount).padStart(2, '0')}</sup>
        </button>
      </div>
    </header>
  )
}
