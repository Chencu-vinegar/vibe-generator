import type { HistoryEntry, Vibe, VibeInput } from '../types'
import { isMoodId, isWeatherId, normalizeInput } from './generator'

const HISTORY_KEY = 'vibe-generator:v1:history'
const LAST_INPUT_KEY = 'vibe-generator:v1:last-input'
const MAX_HISTORY = 24

interface StoredHistory {
  version: 1
  items: HistoryEntry[]
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== 'object') return false
  const entry = value as Partial<HistoryEntry>
  return (
    typeof entry.id === 'string' &&
    typeof entry.seed === 'number' &&
    Number.isFinite(entry.seed) &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt) &&
    !!entry.input &&
    typeof entry.input === 'object' &&
    isMoodId(entry.input.mood) &&
    isWeatherId(entry.input.weather) &&
    Array.isArray(entry.input.keywords)
  )
}

function readStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null
    return window.localStorage
  } catch {
    return null
  }
}

export function loadHistory(): HistoryEntry[] {
  const storage = readStorage()
  if (!storage) return []

  try {
    const raw = storage.getItem(HISTORY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return []
    const data = parsed as Partial<StoredHistory>
    if (data.version !== 1 || !Array.isArray(data.items)) return []
    return data.items
      .filter(isHistoryEntry)
      .map((entry) => ({
        ...entry,
        input: normalizeInput(entry.input),
      }))
      .slice(0, MAX_HISTORY)
  } catch {
    return []
  }
}

function persist(items: HistoryEntry[]): HistoryEntry[] {
  const storage = readStorage()
  if (!storage) return items

  try {
    const data: StoredHistory = { version: 1, items }
    storage.setItem(HISTORY_KEY, JSON.stringify(data))
  } catch {
    // Private mode or quota exceeded: the app still works for this session.
  }
  return items
}

export function saveVibeToHistory(vibe: Vibe): HistoryEntry[] {
  const entry: HistoryEntry = {
    id: vibe.id,
    seed: vibe.seed,
    input: vibe.input,
    createdAt: vibe.createdAt,
  }
  const next = [entry, ...loadHistory().filter((item) => item.id !== entry.id)].slice(
    0,
    MAX_HISTORY,
  )
  return persist(next)
}

export function removeVibeFromHistory(id: string): HistoryEntry[] {
  return persist(loadHistory().filter((item) => item.id !== id))
}

export function clearVibeHistory(): HistoryEntry[] {
  return persist([])
}

export function loadLastInput(): VibeInput | null {
  const storage = readStorage()
  if (!storage) return null

  try {
    const raw = storage.getItem(LAST_INPUT_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return normalizeInput(parsed as Partial<VibeInput>)
  } catch {
    return null
  }
}

export function saveLastInput(input: VibeInput): void {
  const storage = readStorage()
  if (!storage) return

  try {
    storage.setItem(LAST_INPUT_KEY, JSON.stringify(input))
  } catch {
    // Ignore storage failures.
  }
}
