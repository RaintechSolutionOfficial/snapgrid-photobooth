import type { EffectMode, FilterPreset, FrameStyle, Mode, Settings, TemplateId } from '../types'

export const FILTERS: FilterPreset[] = [
  { id: 'none', name: 'Original', css: 'none' },
  { id: 'vintage', name: 'Vintage', css: 'sepia(0.35) contrast(1.05) saturate(0.85) brightness(1.04)' },
  { id: 'bw', name: 'B&W', css: 'grayscale(1) contrast(1.12)' },
  { id: 'sepia', name: 'Sepia', css: 'sepia(0.7) contrast(1.05)' },
  { id: 'cool', name: 'Cool', css: 'hue-rotate(12deg) saturate(1.18) contrast(1.05)' },
  { id: 'warm', name: 'Warm', css: 'sepia(0.18) saturate(1.3) brightness(1.06)' },
  { id: 'glam', name: 'Glam', css: 'contrast(1.15) saturate(0.9) brightness(1.08)' },
  { id: 'noir', name: 'Noir', css: 'grayscale(1) contrast(1.4) brightness(0.92)' },
]

export const FRAMES: { id: FrameStyle; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'classic', name: 'Classic' },
  { id: 'polaroid', name: 'Polaroid' },
  { id: 'neon', name: 'Neon' },
  { id: 'gradient', name: 'Gradient' },
]

export const TEMPLATES: { id: TemplateId; name: string; hint: string }[] = [
  { id: 'grid', name: 'Grid', hint: 'Even rows & columns' },
  { id: 'strip', name: 'Strip', hint: 'Vertical photo strip' },
  { id: 'filmstrip', name: 'Filmstrip', hint: 'One long row' },
  { id: 'mosaic', name: 'Mosaic', hint: 'One hero + tiles' },
  { id: 'polaroid', name: 'Polaroid', hint: 'Scattered prints' },
]

export type BackgroundTheme = { id: string; name: string; from: string; to: string; dark: boolean; pattern?: 'dots' | 'grid' | 'none' }

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  { id: 'studio', name: 'Studio', from: '#f8fafc', to: '#dfe7f2', dark: false, pattern: 'none' },
  { id: 'midnight', name: 'Midnight', from: '#0f172a', to: '#1e3a8a', dark: true, pattern: 'dots' },
  { id: 'sunset', name: 'Sunset', from: '#ff9a9e', to: '#fad0c4', dark: false, pattern: 'none' },
  { id: 'candy', name: 'Candy', from: '#ffdee9', to: '#b5fffc', dark: false, pattern: 'none' },
  { id: 'neon', name: 'Neon', from: '#0a0e17', to: '#6d28d9', dark: true, pattern: 'grid' },
  { id: 'mint', name: 'Mint', from: '#d4fc79', to: '#96e6a1', dark: false, pattern: 'none' },
  { id: 'coffee', name: 'Coffee', from: '#f3e8dc', to: '#c9a27e', dark: false, pattern: 'none' },
  { id: 'ocean', name: 'Ocean', from: '#a1c4fd', to: '#c2e9fb', dark: false, pattern: 'none' },
  { id: 'grape', name: 'Grape', from: '#667eea', to: '#764ba2', dark: true, pattern: 'none' },
  { id: 'custom', name: 'Custom', from: '#ffffff', to: '#ffffff', dark: false, pattern: 'none' },
]

export const MODES: { id: Mode; name: string; hint: string }[] = [
  { id: 'photo', name: 'Photo', hint: 'Single shot' },
  { id: 'grid', name: 'Grid', hint: 'Up to 10×10' },
  { id: 'video', name: 'Video', hint: 'Short clip' },
  { id: 'boomerang', name: 'Boomerang', hint: 'Ping-pong loop' },
]

export const GRID_PRESETS = [
  { label: 'Single', rows: 1, cols: 1 },
  { label: '2 × 2', rows: 2, cols: 2 },
  { label: '3 × 3', rows: 3, cols: 3 },
  { label: 'Strip', rows: 1, cols: 4 },
  { label: '4 × 5', rows: 4, cols: 5 },
  { label: '10 × 10', rows: 10, cols: 10 },
]

export const EMOJIS = ['❤️', '✨', '🎉', '⭐', '📸', '🥳', '😎', '🌈', '🔥', '💖', '🎈', '👑', '🍾', '💫', '🎊', '🕶️', '🐱', '🐶', '🦄', '🍕', '🍩', '🎸', '⚽', '🏆']

export const EFFECT_MODES: { id: EffectMode; name: string; hint: string }[] = [
  { id: 'all', name: 'All shots', hint: 'Every effect on every shot' },
  { id: 'rotate', name: 'Rotate', hint: 'Cycle effects across shots' },
  { id: 'random', name: 'Random', hint: 'Surprise me per shot' },
]

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  rows: 2,
  cols: 2,
  countdown: 3,
  interval: 1,
  filter: 'none',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  mirror: true,
  sound: true,
  flash: true,
  frame: 'classic',
  template: 'grid',
  background: '#ffffff',
  backgroundTheme: 'studio',
  eventTitle: 'SNAPGRID PHOTOBOOTH',
  caption: 'Say cheese!',
  showDate: true,
  stickers: [],
  accessories: [],
  effectMode: 'rotate',
  cameraDeviceId: '',
}

export const FILTER_MAP = Object.fromEntries(FILTERS.map((f) => [f.id, f.css])) as Record<string, string>
