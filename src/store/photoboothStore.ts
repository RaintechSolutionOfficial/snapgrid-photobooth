import { create } from 'zustand'
import type { CaptureItem, SessionState, Settings } from '../types'
import { DEFAULT_SETTINGS } from '../utils/constants'
import { clearCaptures, loadCaptures, loadSettings, saveCaptures, saveSettings } from '../utils/storage'

const emptySession: SessionState = { shots: [], composite: null, videoUrl: null, isCapturing: false }

type PhotoboothStore = {
  settings: Settings
  captures: CaptureItem[]
  session: SessionState
  updateSettings: (patch: Partial<Settings>) => void
  resetSettings: () => void
  addCapture: (item: CaptureItem) => boolean
  removeCapture: (id: string) => void
  clearAllCaptures: () => void
  setSession: (patch: Partial<SessionState>) => void
  resetSession: () => void
}

export const usePhotoboothStore = create<PhotoboothStore>((set, get) => ({
  settings: loadSettings(),
  captures: loadCaptures(),
  session: emptySession,

  updateSettings: (patch) => {
    const settings = { ...get().settings, ...patch }
    saveSettings(settings)
    set({ settings })
  },

  resetSettings: () => {
    saveSettings(DEFAULT_SETTINGS)
    set({ settings: DEFAULT_SETTINGS })
  },

  addCapture: (item) => {
    const captures = [item, ...get().captures].slice(0, 60)
    const ok = saveCaptures(captures)
    if (ok) set({ captures })
    return ok
  },

  removeCapture: (id) => {
    const captures = get().captures.filter((c) => c.id !== id)
    saveCaptures(captures)
    set({ captures })
  },

  clearAllCaptures: () => {
    clearCaptures()
    set({ captures: [] })
  },

  setSession: (patch) => set((state) => ({ session: { ...state.session, ...patch } })),

  resetSession: () => set({ session: { ...emptySession } }),
}))
