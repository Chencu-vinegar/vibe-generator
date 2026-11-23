import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Composer } from './components/Composer'
import { HistoryDrawer } from './components/HistoryDrawer'
import { ParticleField } from './components/ParticleField'
import { ResultView } from './components/ResultView'
import { Toast } from './components/Toast'
import { TopBar } from './components/TopBar'
import { DEFAULT_INPUT, KEYWORD_CHOICES, MOODS } from './data/vibes'
import { buildSceneStyle, generateVibe, normalizeInput } from './lib/generator'
import { copyText } from './lib/clipboard'
import { downloadVibePoster } from './lib/export'
import { pick, randomSeed } from './lib/random'
import {
  clearVibeHistory,
  loadHistory,
  loadLastInput,
  removeVibeFromHistory,
  saveLastInput,
  saveVibeToHistory,
} from './lib/storage'
import {
  clearShareParams,
  createShareUrl,
  readShareParams,
  writeShareParams,
} from './lib/url'
import type { HistoryEntry, Vibe, VibeInput } from './types'

type Stage = 'compose' | 'result'

export default function App() {
  const [initial] = useState(() => {
    const share = readShareParams(window.location.search)
    const input = share?.input ?? loadLastInput() ?? DEFAULT_INPUT
    const vibe = share ? generateVibe(share.input, share.seed) : null
    return { share, input, vibe }
  })

  const [input, setInput] = useState<VibeInput>(initial.input)
  const [vibe, setVibe] = useState<Vibe | null>(initial.vibe)
  const [stage, setStage] = useState<Stage>(initial.vibe ? 'result' : 'compose')
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  const toastTimer = useRef<number | null>(null)
  const didStoreInitial = useRef(false)

  const previewVibe = useMemo(() => generateVibe(input, 17, 0), [input])
  const activeVibe = stage === 'result' && vibe ? vibe : previewVibe
  const sceneStyle = useMemo(() => buildSceneStyle(activeVibe), [activeVibe])

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = window.setTimeout(() => setToast(null), 3000)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  useEffect(() => {
    saveLastInput(input)
  }, [input])

  useEffect(() => {
    if (didStoreInitial.current || !initial.share || !initial.vibe) return
    didStoreInitial.current = true
    setHistory(saveVibeToHistory(initial.vibe))
    saveLastInput(initial.vibe.input)
  }, [initial])

  useEffect(() => {
    document.documentElement.style.colorScheme = activeVibe.palette.mode
    const themeColor = document.querySelector('meta[name="theme-color"]')
    themeColor?.setAttribute('content', activeVibe.palette.colors[0].hex)
  }, [activeVibe])

  const handleInputChange = useCallback((next: VibeInput) => {
    setInput(normalizeInput(next))
  }, [])

  const handleGenerate = useCallback(
    (nextInput: VibeInput) => {
      const next = generateVibe(nextInput, randomSeed())
      setInput(next.input)
      setVibe(next)
      setStage('result')
      setHistory(saveVibeToHistory(next))
      saveLastInput(next.input)
      writeShareParams(next)
      showToast('今天的氛围已生成')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [showToast],
  )

  const handleReroll = useCallback(() => {
    if (!vibe) return
    const next = generateVibe(vibe.input, randomSeed())
    setVibe(next)
    setHistory(saveVibeToHistory(next))
    saveLastInput(next.input)
    writeShareParams(next)
    showToast('又抽到一种可能')
  }, [showToast, vibe])

  const handleShare = useCallback(async () => {
    if (!vibe) return
    try {
      await copyText(createShareUrl(vibe))
      showToast('分享链接已复制')
    } catch {
      showToast('复制失败，请手动复制地址栏链接')
    }
  }, [showToast, vibe])

  const handleCopyColor = useCallback(
    async (hex: string) => {
      try {
        await copyText(hex.toUpperCase())
        showToast(`${hex.toUpperCase()} 已复制`)
      } catch {
        showToast('色值复制失败')
      }
    },
    [showToast],
  )

  const handleDownload = useCallback(async () => {
    if (!vibe || downloading) return
    setDownloading(true)
    try {
      await downloadVibePoster(vibe)
      showToast('氛围卡已保存')
    } catch {
      showToast('海报生成失败，请再试一次')
    } finally {
      setDownloading(false)
    }
  }, [downloading, showToast, vibe])

  const handleEdit = useCallback(() => {
    setStage('compose')
    setVibe(null)
    clearShareParams()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleHome = useCallback(() => {
    setStage('compose')
    setVibe(null)
    setDrawerOpen(false)
    clearShareParams()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const handleRandom = useCallback(() => {
    const mood = pick(MOODS, Math.random)
    const shuffled = [...KEYWORD_CHOICES].sort(() => Math.random() - 0.5)
    const count = Math.random() > 0.45 ? 1 + Math.floor(Math.random() * 2) : 0
    setInput((previous) => ({
      mood: mood.id,
      weather: previous.weather,
      keywords: shuffled.slice(0, count).map((keyword) => keyword.label),
    }))
    showToast('换了一种今天')
  }, [showToast])

  const handleRestore = useCallback(
    (entry: HistoryEntry) => {
      const next = generateVibe(entry.input, entry.seed, entry.createdAt)
      setInput(next.input)
      setVibe(next)
      setStage('result')
      setHistory(saveVibeToHistory(next))
      writeShareParams(next)
      setDrawerOpen(false)
      showToast('已找回这一天')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [showToast],
  )

  const handleDelete = useCallback(
    (id: string) => {
      setHistory(removeVibeFromHistory(id))
      showToast('已从档案中移除')
    },
    [showToast],
  )

  const handleClear = useCallback(() => {
    setHistory(clearVibeHistory())
    showToast('档案已清空')
  }, [showToast])

  const closeDrawer = useCallback(() => setDrawerOpen(false), [])

  return (
    <div
      className="app"
      style={sceneStyle}
      data-mode={activeVibe.palette.mode}
      data-stage={stage}
    >
      <div className="scene" aria-hidden="true">
        <div className="scene__base" />
        <div className="scene__glow scene__glow--a" />
        <div className="scene__glow scene__glow--b" />
        <div className="scene__grid" />
        <ParticleField vibe={activeVibe} />
        <div className="scene__vignette" />
        <div className="scene__grain" />
      </div>

      <div className="page-edge" aria-hidden="true" />

      <TopBar
        stage={stage}
        historyCount={history.length}
        onHome={handleHome}
        onHistory={() => setDrawerOpen(true)}
        onEdit={handleEdit}
      />

      {stage === 'result' && vibe ? (
        <ResultView
          vibe={vibe}
          archived={history.some((entry) => entry.id === vibe.id)}
          downloading={downloading}
          onReroll={handleReroll}
          onShare={handleShare}
          onDownload={handleDownload}
          onEdit={handleEdit}
          onCopyColor={handleCopyColor}
        />
      ) : (
        <Composer
          input={input}
          onChange={handleInputChange}
          onGenerate={handleGenerate}
          onRandom={handleRandom}
          onNotice={showToast}
        />
      )}

      <HistoryDrawer
        open={drawerOpen}
        history={history}
        onClose={closeDrawer}
        onRestore={handleRestore}
        onDelete={handleDelete}
        onClear={handleClear}
      />

      <Toast message={toast} />
    </div>
  )
}
