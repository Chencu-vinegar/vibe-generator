import type { SharedVibe, Vibe } from '../types'
import { isMoodId, isWeatherId, normalizeInput } from './generator'

export function readShareParams(search: string): SharedVibe | null {
  const params = new URLSearchParams(search)
  const mood = params.get('mood')
  const weather = params.get('weather')
  const rawSeed = params.get('seed')
  const seed = rawSeed ? Number(rawSeed) : Number.NaN

  if (!isMoodId(mood) || !isWeatherId(weather)) return null
  if (!Number.isInteger(seed) || seed <= 0) return null

  return {
    input: normalizeInput({
      mood,
      weather,
      keywords: params.getAll('kw').slice(0, 3),
    }),
    seed,
  }
}

export function createShareUrl(vibe: Vibe, currentUrl = window.location.href): string {
  const url = new URL(currentUrl)
  const params = new URLSearchParams()
  params.set('mood', vibe.input.mood)
  params.set('weather', vibe.input.weather)
  vibe.keywords.forEach((keyword) => params.append('kw', keyword.label))
  params.set('seed', String(vibe.seed))
  url.search = params.toString()
  url.hash = ''
  return url.toString()
}

export function writeShareParams(vibe: Vibe): void {
  window.history.replaceState({}, '', createShareUrl(vibe))
}

export function clearShareParams(): void {
  const url = new URL(window.location.href)
  url.search = ''
  url.hash = ''
  window.history.replaceState({}, '', url)
}
