import { useState, type CSSProperties, type FormEvent, type KeyboardEvent } from 'react'
import {
  KEYWORD_CHOICES,
  KEYWORD_MAP,
  MOODS,
  MOOD_MAP,
  WEATHERS,
  WEATHER_MAP,
} from '../data/vibes'
import type { VibeInput } from '../types'
import { formatToday } from '../lib/format'
import { ArrowUpRight, PlusIcon, RefreshIcon, SparkIcon, WeatherIcon } from './Icons'

interface ComposerProps {
  input: VibeInput
  onChange: (input: VibeInput) => void
  onGenerate: (input: VibeInput) => void
  onRandom: () => void
  onNotice: (message: string) => void
}

export function Composer({
  input,
  onChange,
  onGenerate,
  onRandom,
  onNotice,
}: ComposerProps) {
  const [customKeyword, setCustomKeyword] = useState('')
  const selectedMood = MOOD_MAP[input.mood]
  const selectedWeather = WEATHER_MAP[input.weather]
  const atLimit = input.keywords.length >= 3
  const selectedPresetLabels = new Set(input.keywords)

  const customSelected = input.keywords
    .filter((keyword) => !(keyword in KEYWORD_MAP))
    .map((label) => ({ label, color: 'var(--accent)' }))
  const keywordChoices = [...KEYWORD_CHOICES, ...customSelected]

  const toggleKeyword = (label: string) => {
    if (selectedPresetLabels.has(label)) {
      onChange({
        ...input,
        keywords: input.keywords.filter((keyword) => keyword !== label),
      })
      return
    }
    if (atLimit) {
      onNotice('最多留下 3 个关键词')
      return
    }
    onChange({ ...input, keywords: [...input.keywords, label] })
  }

  const commitCustomKeyword = () => {
    const label = customKeyword.trim().replace(/\s+/g, ' ').slice(0, 12)
    if (!label) return
    if (input.keywords.some((keyword) => keyword === label)) {
      onNotice('这个词已经在里面了')
      setCustomKeyword('')
      return
    }
    if (atLimit) {
      onNotice('最多留下 3 个关键词')
      return
    }
    onChange({ ...input, keywords: [...input.keywords, label] })
    setCustomKeyword('')
  }

  const handleCustomKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commitCustomKeyword()
      return
    }
    if (event.key === 'Backspace' && !customKeyword && input.keywords.length > 0) {
      onChange({ ...input, keywords: input.keywords.slice(0, -1) })
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const label = customKeyword.trim().replace(/\s+/g, ' ').slice(0, 12)
    let nextInput = input

    if (label && !input.keywords.includes(label) && input.keywords.length < 3) {
      nextInput = { ...input, keywords: [...input.keywords, label] }
      onChange(nextInput)
      setCustomKeyword('')
    }

    onGenerate(nextInput)
  }

  return (
    <main className="composer-shell">
      <div className="composer-rail" aria-hidden="true">
        <span>DAILY ATMOSPHERE</span>
        <i />
        <span>EST. 2026</span>
      </div>

      <section className="composer-intro" aria-labelledby="composer-title">
        <div className="eyebrow">
          <span className="eyebrow__dot" />
          DAILY ATMOSPHERE
          <span className="eyebrow__slash">/</span>
          {formatToday()}
        </div>

        <h1 className="composer-title" id="composer-title">
          今天，
          <br />
          想活在
          <br />
          <span className="composer-title__accent">哪种氛围</span>里？
        </h1>

        <p className="composer-lede">
          选一种心情、一种天气，再留下几个词。
          <br />
          把它翻译成今天的颜色、声音和一句话。
        </p>

        <div className="composer-signature">
          <span className="composer-signature__rule" />
          <p>
            PROCEDURAL VIBE ENGINE
            <small>SEED-BASED · LOCAL-FIRST · NO API</small>
          </p>
        </div>
      </section>

      <section className="composer-form-wrap" aria-label="生成你的今日氛围">
        <form className="composer-card" onSubmit={handleSubmit}>
          <div className="composer-card__head">
            <span className="card-index">NO. 01 / COMPOSE</span>
            <button className="shuffle-button" type="button" onClick={onRandom}>
              <RefreshIcon size={14} />
              随机一天
            </button>
          </div>

          <div className="field">
            <div className="field__label">
              <span className="field__number">01</span>
              <span>现在的心情</span>
              <small>MOOD</small>
              <em>{selectedMood.note}</em>
            </div>
            <div className="mood-grid">
              {MOODS.map((mood) => {
                const selected = input.mood === mood.id
                return (
                  <button
                    className={`mood-option ${selected ? 'is-selected' : ''}`}
                    type="button"
                    key={mood.id}
                    aria-pressed={selected}
                    onClick={() => onChange({ ...input, mood: mood.id })}
                  >
                    <span className="mood-option__char">{mood.char}</span>
                    <span className="mood-option__label">{mood.label}</span>
                    <span className="mood-option__en">{mood.en}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="field">
            <div className="field__label">
              <span className="field__number">02</span>
              <span>窗外的天气</span>
              <small>WEATHER</small>
              <em>{selectedWeather.en}</em>
            </div>
            <div className="weather-grid">
              {WEATHERS.map((weather) => {
                const selected = input.weather === weather.id
                return (
                  <button
                    className={`weather-option ${selected ? 'is-selected' : ''}`}
                    type="button"
                    key={weather.id}
                    aria-pressed={selected}
                    onClick={() => onChange({ ...input, weather: weather.id })}
                  >
                    <WeatherIcon kind={weather.icon} size={21} />
                    <span>{weather.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="field field--keywords">
            <div className="field__label">
              <span className="field__number">03</span>
              <span>留下几个词</span>
              <small>KEYWORDS</small>
              <em>{input.keywords.length}/3</em>
            </div>

            <div className="keyword-cloud">
              {keywordChoices.map(({ label, color }) => {
                const selected = selectedPresetLabels.has(label)
                return (
                  <button
                    className={`keyword-chip ${selected ? 'is-selected' : ''}`}
                    type="button"
                    key={label}
                    aria-pressed={selected}
                    disabled={!selected && atLimit}
                    onClick={() => toggleKeyword(label)}
                    style={{ '--tag-color': color } as CSSProperties}
                  >
                    <span className="keyword-chip__dot" />
                    {label}
                  </button>
                )
              })}
            </div>

            <div className={`custom-keyword ${atLimit ? 'is-disabled' : ''}`}>
              <input
                type="text"
                value={customKeyword}
                maxLength={12}
                disabled={atLimit}
                placeholder={atLimit ? '已经留下 3 个词了' : '写一个自己的词…'}
                aria-label="添加自定义关键词"
                onChange={(event) => setCustomKeyword(event.target.value)}
                onKeyDown={handleCustomKeyDown}
              />
              <button
                type="button"
                aria-label="添加关键词"
                disabled={!customKeyword.trim() || atLimit}
                onClick={commitCustomKeyword}
              >
                <PlusIcon size={17} />
              </button>
            </div>
          </div>

          <button className="generate-button" type="submit">
            <span className="generate-button__icon">
              <SparkIcon size={18} />
            </span>
            <span>
              生成今天的 Vibe
              <small>PRESS ENTER</small>
            </span>
            <span className="generate-button__arrow">
              <ArrowUpRight size={19} />
            </span>
          </button>

          <p className="composer-card__footnote">
            同样的输入 + 种子，会得到同一个 vibe。生成结果会自动存入本机档案。
          </p>
        </form>

        <p className="composer-side-note">
          <span>01</span>
          选择，然后交给一点点偶然。
        </p>
      </section>

      <footer className="composer-footer" aria-hidden="true">
        <span>VIBE GENERATOR / V1.0</span>
        <span>ONE DAY, ONE VIBE</span>
        <span>LOCAL-FIRST</span>
      </footer>
    </main>
  )
}
