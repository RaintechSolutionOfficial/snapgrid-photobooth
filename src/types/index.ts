export type Mode = 'photo' | 'grid' | 'video' | 'boomerang'

export type FilterPreset = {
  id: string
  name: string
  css: string
}

export type FrameStyle = 'none' | 'classic' | 'polaroid' | 'neon' | 'gradient'

export type TemplateId = 'grid' | 'strip' | 'filmstrip' | 'mosaic' | 'polaroid'

export type EffectMode = 'all' | 'rotate' | 'random'

export type Sticker = {
  id: string
  emoji: string
  x: number
  y: number
  size: number
}

/** An emoji or drawn effect placed on a shot. Coordinates/size are normalized (0-1 of frame width). */
export type Accessory = {
  id: string
  name: string
  kind: 'emoji' | 'svg'
  source: string
  x: number
  y: number
  size: number
  rotation: number
}

export type Settings = {
  theme: 'light' | 'dark'
  rows: number
  cols: number
  countdown: number
  interval: number
  filter: string
  brightness: number
  contrast: number
  saturation: number
  mirror: boolean
  sound: boolean
  flash: boolean
  frame: FrameStyle
  template: TemplateId
  background: string
  backgroundTheme: string
  eventTitle: string
  caption: string
  showDate: boolean
  stickers: Sticker[]
  accessories: Accessory[]
  effectMode: EffectMode
  cameraDeviceId: string
}

export type CaptureItem = {
  id: string
  createdAt: number
  mode: Mode
  rows: number
  cols: number
  frameCount: number
  image: string
  filter: string
  eventTitle: string
  duration?: number
}

export type SessionState = {
  shots: string[]
  composite: string | null
  videoUrl: string | null
  isCapturing: boolean
}
