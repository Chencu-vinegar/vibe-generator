import type { CSSProperties } from 'react'

export type MoodId = 'still' | 'light' | 'tired' | 'spark' | 'tender'
export type WeatherId = 'clear' | 'rain' | 'mist' | 'snow' | 'night'
export type ParticleKind = 'rain' | 'mist' | 'snow' | 'dust' | 'ember'

export interface MoodOption {
  id: MoodId
  char: string
  label: string
  en: string
  note: string
}

export interface WeatherOption {
  id: WeatherId
  char: string
  label: string
  en: string
  icon: 'clear' | 'rain' | 'mist' | 'snow' | 'night'
}

export interface VibeInput {
  mood: MoodId
  weather: WeatherId
  keywords: string[]
}

export interface PaletteColor {
  hex: string
  name: string
}

export interface Palette {
  mode: 'dark' | 'light'
  colors: PaletteColor[]
  accent: string
}

export interface Listening {
  genre: string
  bpm: string
  textures: string[]
  scene: string
  note: string
}

export interface ParticleSpec {
  kind: ParticleKind
  density: number
  speed: number
}

export interface GradientSpec {
  angle: number
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface KeywordInfo {
  label: string
  color: string
  preset: boolean
}

export interface VibeReasoning {
  weather: string
  mood: string
  palette: string
  motion: string
  words: string
}

export interface Vibe {
  id: string
  number: string
  input: VibeInput
  seed: number
  createdAt: number
  kicker: string
  title: string
  line: string
  footnote: string
  signature: string
  palette: Palette
  listening: Listening
  particle: ParticleSpec
  gradient: GradientSpec
  keywords: KeywordInfo[]
  mood: MoodOption
  weather: WeatherOption
  reasoning: VibeReasoning
}

export interface HistoryEntry {
  id: string
  seed: number
  input: VibeInput
  createdAt: number
}

export interface SharedVibe {
  input: VibeInput
  seed: number
}

export type WeatherSource = 'geo' | 'ip'
export type WeatherProvider = 'wttr.in' | 'Open-Meteo'

export interface WeatherSnapshot {
  weather: WeatherId
  condition: string
  temperature: number
  feelsLike: number
  isDay: boolean
  location: string
  source: WeatherSource
  provider: WeatherProvider
  updatedAt: number
}

export type SceneStyle = CSSProperties & Record<`--${string}`, string>
