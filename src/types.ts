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

export type SceneStyle = CSSProperties & Record<`--${string}`, string>
