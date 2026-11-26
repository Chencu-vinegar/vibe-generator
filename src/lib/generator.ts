import {
  DEFAULT_INPUT,
  KEYWORD_MAP,
  LISTENING,
  MOOD_COPY,
  MOOD_LISTENING,
  MOOD_MAP,
  MOODS,
  PALETTES,
  PARTICLES,
  WEATHER_COPY,
  WEATHER_MAP,
  WEATHERS,
  type PaletteSeed,
} from '../data/vibes'
import type {
  KeywordInfo,
  MoodId,
  Palette,
  SceneStyle,
  Vibe,
  VibeInput,
  WeatherId,
} from '../types'
import { adjustHex, withAlpha } from './color'
import { clamp, hashString, mulberry32, pick } from './random'

const MOOD_TUNING: Record<
  MoodId,
  { saturation: number; lightness: number; hue: number }
> = {
  still: { saturation: -0.06, lightness: 0.01, hue: 0 },
  light: { saturation: 0.05, lightness: 0.025, hue: 2 },
  tired: { saturation: -0.09, lightness: -0.02, hue: -2 },
  spark: { saturation: 0.12, lightness: 0.015, hue: 6 },
  tender: { saturation: -0.02, lightness: 0.035, hue: -5 },
}

const MOOD_PARTICLE_TUNING: Record<MoodId, { density: number; speed: number }> = {
  still: { density: -0.05, speed: -0.1 },
  light: { density: 0.05, speed: 0.08 },
  tired: { density: -0.1, speed: -0.15 },
  spark: { density: 0.18, speed: 0.22 },
  tender: { density: 0, speed: -0.05 },
}

const PARTICLE_LABELS: Record<Vibe['particle']['kind'], string> = {
  rain: '斜雨',
  mist: '雾团',
  snow: '雪点',
  dust: '尘埃光点',
  ember: '上升余烬',
}

function signedPercent(value: number): string {
  const percent = Math.round(value * 100)
  return `${percent > 0 ? '+' : ''}${percent}%`
}

function signedDegrees(value: number): string {
  const degrees = Math.round(value)
  return `${degrees > 0 ? '+' : ''}${degrees}°`
}

function tunePalette(base: PaletteSeed, mood: MoodId, jitter: number): Palette {
  const tuning = MOOD_TUNING[mood]
  const colors = base.colors.map((color, index) => {
    if (index === 0 || index === 4) return color
    return {
      ...color,
      hex: adjustHex(color.hex, {
        hue: tuning.hue + jitter,
        saturation: tuning.saturation,
        lightness: tuning.lightness,
      }),
    }
  })

  return {
    mode: base.mode,
    accent: adjustHex(base.accent, {
      hue: tuning.hue * 0.5 + jitter,
      saturation: tuning.saturation * 0.5,
      lightness: tuning.lightness * 0.5,
    }),
    colors,
  }
}

export function isMoodId(value: unknown): value is MoodId {
  return typeof value === 'string' && MOODS.some((mood) => mood.id === value)
}

export function isWeatherId(value: unknown): value is WeatherId {
  return typeof value === 'string' && WEATHERS.some((weather) => weather.id === value)
}

export function normalizeInput(input: Partial<VibeInput> | null | undefined): VibeInput {
  const mood = isMoodId(input?.mood) ? input.mood : DEFAULT_INPUT.mood
  const weather = isWeatherId(input?.weather) ? input.weather : DEFAULT_INPUT.weather
  const keywords = Array.isArray(input?.keywords)
    ? input.keywords
        .filter((keyword): keyword is string => typeof keyword === 'string')
        .map((keyword) => keyword.trim().slice(0, 12))
        .filter(Boolean)
    : []

  return {
    mood,
    weather,
    keywords: [...new Set(keywords)].slice(0, 3),
  }
}

export function generateVibe(
  rawInput: Partial<VibeInput>,
  seed: number,
  createdAt = Date.now(),
): Vibe {
  const input = normalizeInput(rawInput)
  const cleanSeed = Math.abs(Math.floor(seed)) || 1
  const inputKey = `${input.mood}|${input.weather}|${input.keywords.join(',')}`
  const rng = mulberry32((hashString(inputKey) ^ cleanSeed) >>> 0)
  const paletteOptions = PALETTES[input.weather]
  const paletteIndex = Math.floor(rng() * paletteOptions.length)
  const paletteBase = paletteOptions[paletteIndex] ?? paletteOptions[0]
  const palette = tunePalette(paletteBase, input.mood, (rng() - 0.5) * 4)
  const title = pick(WEATHER_COPY[input.weather].titles, rng)
  const line = pick(MOOD_COPY[input.mood], rng)
  const footnote = pick(WEATHER_COPY[input.weather].footnotes, rng)
  const listeningBase = LISTENING[input.weather]
  const listeningMood = MOOD_LISTENING[input.mood]
  const lowBpm = Math.max(42, listeningBase.bpm[0] + listeningMood.delta)
  const highBpm = Math.max(lowBpm + 8, listeningBase.bpm[1] + listeningMood.delta)
  const particleBase = PARTICLES[input.weather]
  const particleMood = MOOD_PARTICLE_TUNING[input.mood]

  const keywordInfo: KeywordInfo[] = input.keywords.map((label) => ({
    label,
    color: KEYWORD_MAP[label] ?? palette.accent,
    preset: label in KEYWORD_MAP,
  }))

  const number = String(100 + (hashString(`${inputKey}:${cleanSeed}`) % 900))
  const signature =
    keywordInfo.length > 0
      ? `带一点 ${keywordInfo.map((keyword) => keyword.label).join(' · ')} 的气味。`
      : '没有关键词，也是一种留白。'
  const particle = {
    kind: particleBase.kind,
    density: clamp(
      particleBase.density + particleMood.density + (rng() - 0.5) * 0.08,
      0.35,
      1.45,
    ),
    speed: clamp(
      particleBase.speed + particleMood.speed + (rng() - 0.5) * 0.1,
      0.18,
      1.5,
    ),
  }
  const gradient = {
    angle: Math.round(105 + rng() * 95),
    x1: Math.round(8 + rng() * 58),
    y1: Math.round(6 + rng() * 54),
    x2: Math.round(44 + rng() * 48),
    y2: Math.round(44 + rng() * 48),
  }
  const tuning = MOOD_TUNING[input.mood]

  return {
    // Stable across reloads and share links: seed + input identify the vibe.
    id: `${cleanSeed.toString(36)}-${hashString(inputKey).toString(36)}`,
    number,
    input,
    seed: cleanSeed,
    createdAt,
    kicker: `${WEATHER_MAP[input.weather].en} / ${MOOD_MAP[input.mood].en}`,
    title,
    line,
    footnote,
    signature,
    palette,
    keywords: keywordInfo,
    mood: MOOD_MAP[input.mood],
    weather: WEATHER_MAP[input.weather],
    listening: {
      genre: listeningBase.genre,
      bpm: `${lowBpm}–${highBpm} BPM`,
      textures: [
        listeningBase.textures[0],
        listeningBase.textures[1],
        listeningMood.texture,
      ],
      scene: listeningBase.scene,
      note: listeningMood.note,
    },
    particle,
    gradient,
    reasoning: {
      weather: `${WEATHER_MAP[input.weather].label} → ${paletteBase.colors[0].name}色板`,
      mood: `${MOOD_MAP[input.mood].char} · 饱和度 ${signedPercent(
        tuning.saturation,
      )} / 明度 ${signedPercent(tuning.lightness)} / 色相 ${signedDegrees(tuning.hue)}`,
      palette: `第 ${paletteIndex + 1} / ${paletteOptions.length} 组 · ${
        paletteBase.colors[0].name
      } → ${palette.colors[4].name}`,
      motion: `${PARTICLE_LABELS[particle.kind]} · 密度 ${particle.density.toFixed(
        2,
      )} / 速度 ${particle.speed.toFixed(2)}`,
      words: `${title.replace('\n', ' ')} · 来自手写词库`,
    },
  }
}

export function buildSceneStyle(vibe: Vibe): SceneStyle {
  const { palette, gradient } = vibe
  const ink = palette.colors[4].hex
  const background = palette.colors[0].hex
  const isDark = palette.mode === 'dark'

  return {
    '--bg-0': background,
    '--bg-1': palette.colors[1].hex,
    '--bg-2': palette.colors[2].hex,
    '--ink': ink,
    '--muted': withAlpha(ink, isDark ? 0.66 : 0.68),
    '--faint': withAlpha(ink, 0.45),
    '--line': withAlpha(ink, isDark ? 0.16 : 0.14),
    '--line-strong': withAlpha(ink, isDark ? 0.28 : 0.24),
    '--panel': isDark ? 'rgba(255, 255, 255, 0.065)' : 'rgba(255, 255, 255, 0.42)',
    '--panel-strong': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.58)',
    '--accent': palette.accent,
    '--accent-soft': withAlpha(palette.accent, isDark ? 0.5 : 0.28),
    '--glow-a': withAlpha(
      palette.accent,
      isDark ? 0.42 : 0.18,
    ),
    '--glow-b': withAlpha(
      palette.colors[2].hex,
      isDark ? 0.4 : 0.26,
    ),
    '--angle': `${gradient.angle}deg`,
    '--gx': `${gradient.x1}%`,
    '--gy': `${gradient.y1}%`,
    '--gx2': `${gradient.x2}%`,
    '--gy2': `${gradient.y2}%`,
    '--shadow': isDark ? 'rgba(0, 0, 0, 0.38)' : 'rgba(58, 48, 38, 0.14)',
  }
}
