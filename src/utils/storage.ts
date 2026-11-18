import type { CaptureItem, Settings } from '../types'
import { DEFAULT_SETTINGS } from './constants'

const CAPTURES_KEY = 'snapgrid.captures.v1'
const SETTINGS_KEY = 'snapgrid.settings.v1'
export const MAX_CAPTURES = 60

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback
  try {
    const value = JSON.parse(raw)
    return value ?? fallback
  } catch {
    return fallback
  }
}

export function loadCaptures(): CaptureItem[] {
  const items = safeParse<CaptureItem[]>(localStorage.getItem(CAPTURES_KEY), [])
  return Array.isArray(items) ? items.slice(0, MAX_CAPTURES) : []
}

export function saveCaptures(items: CaptureItem[]): boolean {
  const capped = items.slice(0, MAX_CAPTURES)
  let list = capped
  // localStorage is ~5MB. If we hit the quota, progressively drop the oldest
  // captures until the history fits — newest memories always survive.
  for (let attempt = 0; attempt < 12; attempt++) {
    try {
      localStorage.setItem(CAPTURES_KEY, JSON.stringify(list))
      return true
    } catch {
      if (list.length === 0) return false
      list = list.slice(0, Math.max(1, Math.floor(list.length * 0.7)))
    }
  }
  return false
}

export function loadSettings(): Settings {
  const saved = safeParse<Partial<Settings>>(localStorage.getItem(SETTINGS_KEY), {})
  return { ...DEFAULT_SETTINGS, ...saved, stickers: Array.isArray(saved.stickers) ? saved.stickers : [] }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch {
    /* settings are tiny; ignore impossible quota errors */
  }
}

export function clearCaptures(): void {
  localStorage.removeItem(CAPTURES_KEY)
}

/** Downscales a data URL so history fits in localStorage (full-res stays in the session for downloads). */
export function compressForStorage(dataUrl: string, maxWidth = 1000, quality = 0.72): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const w = Math.max(1, Math.round(img.width * scale))
      const h = Math.max(1, Math.round(img.height * scale))
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      if (!ctx) return resolve(dataUrl)
      ctx.drawImage(img, 0, 0, w, h)
      try {
        resolve(canvas.toDataURL('image/jpeg', quality))
      } catch {
        resolve(dataUrl)
      }
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function storageUsage(): number {
  let total = 0
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) total += (localStorage.getItem(key)?.length ?? 0) * 2
    }
  } catch { /* noop */ }
  return total
}
