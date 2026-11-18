import type { Accessory } from '../types'
import { FILTER_MAP } from './constants'

export type EffectCategory = 'Colors' | 'Distort' | 'Mirror' | 'Art' | 'Retro' | 'Light' | 'X-Ray' | 'Stickers'

export type EffectDef = {
  id: string
  name: string
  category: EffectCategory
  hint: string
}

export const EFFECT_CATEGORIES: EffectCategory[] = ['Colors', 'Distort', 'Mirror', 'Art', 'Retro', 'Light', 'X-Ray', 'Stickers']

export const EFFECTS: EffectDef[] = [
  { id: 'original', name: 'Original', category: 'Colors', hint: 'No effect' },
  { id: 'bw', name: 'B&W', category: 'Colors', hint: 'Classic mono' },
  { id: 'vintage', name: 'Vintage', category: 'Colors', hint: 'Warm faded film' },
  { id: 'sepia', name: 'Sepia', category: 'Colors', hint: 'Old photo tone' },
  { id: 'cool', name: 'Cool', category: 'Colors', hint: 'Blue cast' },
  { id: 'warm', name: 'Warm', category: 'Colors', hint: 'Golden hour' },
  { id: 'glam', name: 'Glam', category: 'Colors', hint: 'Soft studio' },
  { id: 'noir', name: 'Noir', category: 'Colors', hint: 'High contrast mono' },
  { id: 'mint', name: 'Mint', category: 'Colors', hint: 'Fresh green' },
  { id: 'citrus', name: 'Citrus', category: 'Colors', hint: 'Punchy orange' },
  { id: 'hotpink', name: 'Hot Pink', category: 'Colors', hint: 'Neon pink' },
  { id: 'trueblue', name: 'True Blue', category: 'Colors', hint: 'Deep blue' },
  { id: 'zinc', name: 'Zinc', category: 'Colors', hint: 'Soft grey' },
  { id: 'xpro', name: 'X-Pro', category: 'Colors', hint: 'Cross processed' },
  { id: 'lomo', name: 'Lomo', category: 'Colors', hint: 'Vignette + punch' },
  { id: 'retro', name: 'Retro', category: 'Colors', hint: '70s film' },
  { id: 'neon', name: 'Neon', category: 'Colors', hint: 'Electric colour' },

  { id: 'bulge', name: 'Bulge', category: 'Distort', hint: 'Magnify centre' },
  { id: 'pinch', name: 'Pinch', category: 'Distort', hint: 'Shrink centre' },
  { id: 'fisheye', name: 'Fisheye', category: 'Distort', hint: 'Wide lens' },
  { id: 'twist', name: 'Twist', category: 'Distort', hint: 'Swirl' },
  { id: 'ripple', name: 'Ripple', category: 'Distort', hint: 'Water waves' },
  { id: 'stretch', name: 'Stretch', category: 'Distort', hint: 'Vertical pull' },
  { id: 'tunnel', name: 'Tunnel', category: 'Distort', hint: 'Zoom tunnel' },
  { id: 'spiral', name: 'Spiral', category: 'Distort', hint: 'Spiral swirl' },

  { id: 'mirror-top', name: 'Top Mirror', category: 'Mirror', hint: 'Reflect downward' },
  { id: 'mirror-bottom', name: 'Bottom Mirror', category: 'Mirror', hint: 'Reflect upward' },
  { id: 'mirror-left', name: 'Left Mirror', category: 'Mirror', hint: 'Reflect right' },
  { id: 'mirror-right', name: 'Right Mirror', category: 'Mirror', hint: 'Reflect left' },
  { id: 'mirror-quad', name: 'Quad Mirror', category: 'Mirror', hint: 'Four reflections' },
  { id: 'split', name: 'Split Screen', category: 'Mirror', hint: 'Two halves' },
  { id: 'quadcam', name: 'Quad Cam', category: 'Mirror', hint: 'Four cameras' },
  { id: 'upside-down', name: 'Upside Down', category: 'Mirror', hint: 'Flip 180°' },

  { id: 'sketch', name: 'Sketch', category: 'Art', hint: 'Pencil lines' },
  { id: 'outline', name: 'Outline', category: 'Art', hint: 'Edge drawing' },
  { id: 'cartoon', name: 'Cartoon', category: 'Art', hint: 'Flat colours' },
  { id: 'popart', name: 'Pop Art', category: 'Art', hint: 'Bold poster' },
  { id: 'posterize', name: 'Posterize', category: 'Art', hint: 'Reduced tones' },
  { id: 'crosshatch', name: 'Crosshatch', category: 'Art', hint: 'Pen shading' },

  { id: 'oldmovie', name: 'Old Movie', category: 'Retro', hint: 'Grainy reels' },
  { id: 'glitch', name: 'Glitch', category: 'Retro', hint: 'Signal break' },
  { id: 'spycam', name: 'Spy Cam', category: 'Retro', hint: 'Surveillance' },
  { id: 'comic', name: 'Comic Book', category: 'Retro', hint: 'Ink + dots' },

  { id: 'bloom', name: 'Bloom', category: 'Light', hint: 'Soft glow' },
  { id: 'bokeh', name: 'Bokeh', category: 'Light', hint: 'Blur circles' },
  { id: 'flare', name: 'Flare', category: 'Light', hint: 'Lens streak' },
  { id: 'sparkle', name: 'Sparkle', category: 'Light', hint: 'Twinkles' },
  { id: 'smoke', name: 'Smoke', category: 'Light', hint: 'Drifting haze' },
  { id: 'snow', name: 'Snow', category: 'Light', hint: 'Falling flakes' },
  { id: 'halo', name: 'Halo', category: 'Light', hint: 'Angel glow' },

  { id: 'thermal', name: 'Thermal', category: 'X-Ray', hint: 'Heat map' },
  { id: 'xray', name: 'X-Ray', category: 'X-Ray', hint: 'See-through' },
  { id: 'nightvision', name: 'Night Vision', category: 'X-Ray', hint: 'Green scope' },
  { id: 'spectrum', name: 'Spectrum', category: 'X-Ray', hint: 'Rainbow bands' },

  { id: 'stickers', name: 'Try-ons', category: 'Stickers', hint: 'Hats, ears & emojis' },
]

export const EFFECT_MAP: Record<string, string> = Object.fromEntries(
  EFFECTS.filter((e) => ['bw', 'vintage', 'sepia', 'cool', 'warm', 'glam', 'noir', 'mint', 'citrus', 'hotpink', 'trueblue', 'zinc', 'xpro'].includes(e.id))
    .map((e) => [e.id, e.id]),
)

const EXTRA_FILTERS: Record<string, string> = {
  neon: 'saturate(1.8) contrast(1.2) hue-rotate(15deg)',
  lomo: 'contrast(1.3) saturate(1.5) brightness(0.95)',
  retro: 'sepia(0.35) contrast(1.1) brightness(1.05)',
}

export type RenderOptions = {
  effectId: string
  filter: string
  brightness: number
  contrast: number
  saturation: number
  mirror: boolean
  accessories: Accessory[]
  time: number
}

const sourceCache = new Map<string, HTMLCanvasElement>()

function sourceCanvas(w: number, h: number): HTMLCanvasElement {
  const key = `${w}x${h}`
  let canvas = sourceCache.get(key)
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    sourceCache.set(key, canvas)
  }
  return canvas
}

function coverCrop(video: HTMLVideoElement) {
  const boxW = video.clientWidth || video.videoWidth
  const boxH = video.clientHeight || video.videoHeight
  const vAspect = video.videoWidth / video.videoHeight
  const bAspect = boxW / boxH
  if (vAspect > bAspect) {
    const sw = video.videoHeight * bAspect
    return { sx: (video.videoWidth - sw) / 2, sy: 0, sw, sh: video.videoHeight }
  }
  const sh = video.videoWidth / bAspect
  return { sx: 0, sy: (video.videoHeight - sh) / 2, sw: video.videoWidth, sh }
}

/** Draws the video frame (mirrored + adjusted) into a reusable source canvas. */
function drawSource(video: HTMLVideoElement | null, opts: RenderOptions, w: number, h: number): HTMLCanvasElement {
  const canvas = sourceCanvas(w, h)
  const ctx = canvas.getContext('2d')!
  ctx.save()
  ctx.clearRect(0, 0, w, h)
  if (opts.mirror) {
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
  }
  const legacy = EXTRA_FILTERS[opts.effectId]
    ?? (EFFECT_MAP[opts.effectId] ? FILTER_MAP[opts.effectId] ?? 'none' : FILTER_MAP[opts.filter] ?? 'none')
  ctx.filter = `${legacy === 'none' ? '' : legacy + ' '}brightness(${opts.brightness}%) contrast(${opts.contrast}%) saturate(${opts.saturation}%)`.trim()
  if (video?.videoWidth && video.videoHeight) {
    const crop = coverCrop(video)
    ctx.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, w, h)
  } else {
    drawDemoFrame(ctx, w, h, opts.time)
  }
  ctx.restore()
  return canvas
}

function drawDisplacement(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  w: number,
  h: number,
  cols: number,
  rows: number,
  fn: (u: number, v: number) => [number, number],
) {
  const tw = w / cols
  const th = h / rows
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const u = (x + 0.5) / cols
      const v = (y + 0.5) / rows
      const [su, sv] = fn(u, v)
      const sx = Math.max(0, Math.min(w - tw, su * w - tw / 2))
      const sy = Math.max(0, Math.min(h - th, sv * h - th / 2))
      ctx.drawImage(src, sx, sy, tw, th, x * tw, y * th, tw + 1, th + 1)
    }
  }
}

function pixelEffect(
  ctx: CanvasRenderingContext2D,
  src: HTMLCanvasElement,
  w: number,
  h: number,
  fn: (d: Uint8ClampedArray, x: number, y: number, w: number) => void,
  scale = 0.5,
) {
  const sw = Math.max(1, Math.round(w * scale))
  const sh = Math.max(1, Math.round(h * scale))
  const small = sourceCanvas(sw, sh)
  const sctx = small.getContext('2d')!
  sctx.clearRect(0, 0, sw, sh)
  sctx.drawImage(src, 0, 0, sw, sh)
  const data = sctx.getImageData(0, 0, sw, sh)
  const d = data.data
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) fn(d, x, y, sw)
  }
  sctx.putImageData(data, 0, 0)
  ctx.drawImage(small, 0, 0, w, h)
}

const gray = (d: Uint8ClampedArray, i: number) => d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114

function applyEffect(ctx: CanvasRenderingContext2D, src: HTMLCanvasElement, opts: RenderOptions, w: number, h: number) {
  const id = opts.effectId
  const t = opts.time / 1000

  // --- Filters that need only a subtle overlay ---
  if (['original', 'bw', 'vintage', 'sepia', 'cool', 'warm', 'glam', 'noir', 'mint', 'citrus', 'hotpink', 'trueblue', 'zinc', 'xpro', 'neon', 'lomo', 'retro', 'stickers'].includes(id)) {
    ctx.drawImage(src, 0, 0)
    if (id === 'lomo' || id === 'retro') {
      const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, h * 0.75)
      g.addColorStop(0, 'rgba(0,0,0,0)')
      g.addColorStop(1, 'rgba(0,0,0,.55)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
    }
    return
  }

  // --- Distortion ---
  if (['bulge', 'pinch', 'fisheye', 'twist', 'ripple', 'stretch', 'tunnel', 'spiral'].includes(id)) {
    drawDisplacement(ctx, src, w, h, 28, 20, (u, v) => {
      const dx = u - 0.5
      const dy = v - 0.5
      const r = Math.sqrt(dx * dx + dy * dy)
      if (id === 'ripple') return [u + 0.035 * Math.sin(v * 20 + t * 3), v]
      if (id === 'stretch') return [u, 0.5 + dy * (0.4 + Math.abs(dx) * 1.6)]
      if (id === 'twist' || id === 'spiral') {
        const a = (1 - Math.min(1, r * 2)) * (id === 'spiral' ? 2.6 : 1.9)
        const c = Math.cos(a)
        const s = Math.sin(a)
        const rx = dx * c - dy * s
        const ry = dx * s + dy * c
        const f = id === 'spiral' ? 1 - 0.35 * r : 1
        return [0.5 + rx * f, 0.5 + ry * f]
      }
      let f = 1
      if (id === 'bulge') f = 1 - 0.45 * Math.exp(-r * r * 14)
      if (id === 'pinch') f = 1 + 0.45 * Math.exp(-r * r * 14)
      if (id === 'fisheye') f = 1 - 0.55 * (1 - Math.min(1, r * 1.8))
      if (id === 'tunnel') f = Math.max(0.25, 1 - 0.9 * r)
      return [0.5 + dx * f, 0.5 + dy * f]
    })
    return
  }

  // --- Mirrors / multi-view ---
  if (id === 'mirror-top') {
    ctx.drawImage(src, 0, 0)
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); ctx.drawImage(src, 0, 0, w, h / 2, 0, 0, w, h / 2); ctx.restore()
    return
  }
  if (id === 'mirror-bottom') {
    ctx.drawImage(src, 0, 0)
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); ctx.drawImage(src, 0, h / 2, w, h / 2, 0, h / 2, w, h / 2); ctx.restore()
    return
  }
  if (id === 'mirror-left') {
    ctx.drawImage(src, 0, 0)
    ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1); ctx.drawImage(src, 0, 0, w / 2, h, 0, 0, w / 2, h); ctx.restore()
    return
  }
  if (id === 'mirror-right') {
    ctx.drawImage(src, 0, 0)
    ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1); ctx.drawImage(src, w / 2, 0, w / 2, h, 0, 0, w / 2, h); ctx.restore()
    return
  }
  if (id === 'mirror-quad') {
    const hw = w / 2
    const hh = h / 2
    ctx.drawImage(src, 0, 0, hw, hh, 0, 0, hw, hh)
    ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1); ctx.drawImage(src, hw, 0, hw, hh, 0, 0, hw, hh); ctx.restore()
    ctx.save(); ctx.translate(0, h); ctx.scale(1, -1); ctx.drawImage(src, 0, hh, hw, hh, 0, 0, hw, hh); ctx.restore()
    ctx.save(); ctx.translate(w, h); ctx.scale(-1, -1); ctx.drawImage(src, hw, hh, hw, hh, 0, 0, hw, hh); ctx.restore()
    return
  }
  if (id === 'split') {
    ctx.drawImage(src, 0, 0, w / 2, h, 0, 0, w / 2, h)
    ctx.save(); ctx.translate(w, 0); ctx.scale(-1, 1); ctx.drawImage(src, 0, 0, w / 2, h, 0, 0, w / 2, h); ctx.restore()
    return
  }
  if (id === 'quadcam') {
    const hw = w / 2
    const hh = h / 2
    for (let i = 0; i < 4; i++) ctx.drawImage(src, (i % 2) * hw, Math.floor(i / 2) * hh, hw, hh)
    return
  }
  if (id === 'upside-down') {
    ctx.save(); ctx.translate(w, h); ctx.rotate(Math.PI); ctx.drawImage(src, 0, 0); ctx.restore()
    return
  }

  // --- Light / procedural ---
  if (id === 'bloom') {
    ctx.drawImage(src, 0, 0)
    ctx.save()
    ctx.globalCompositeOperation = 'lighter'
    ctx.globalAlpha = 0.55
    ctx.filter = 'blur(14px) brightness(1.5)'
    ctx.drawImage(src, 0, 0)
    ctx.restore()
    return
  }
  if (id === 'flare') {
    ctx.drawImage(src, 0, 0)
    const g = ctx.createRadialGradient(w * 0.78, h * 0.2, 0, w * 0.78, h * 0.2, h * 0.7)
    g.addColorStop(0, 'rgba(255,250,210,.75)')
    g.addColorStop(0.35, 'rgba(255,180,90,.28)')
    g.addColorStop(1, 'rgba(255,120,40,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    return
  }
  if (id === 'halo') {
    ctx.drawImage(src, 0, 0)
    const g = ctx.createRadialGradient(w / 2, h * 0.18, h * 0.04, w / 2, h * 0.18, h * 0.34)
    g.addColorStop(0, 'rgba(255,238,150,.85)')
    g.addColorStop(0.55, 'rgba(255,225,120,.25)')
    g.addColorStop(1, 'rgba(255,220,100,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    return
  }
  if (id === 'bokeh' || id === 'sparkle' || id === 'smoke' || id === 'snow') {
    ctx.drawImage(src, 0, 0)
    const count = id === 'snow' ? 80 : id === 'sparkle' ? 40 : 24
    for (let i = 0; i < count; i++) {
      const seed = i * 97.13
      const px = ((seed * 7.7 + (id === 'smoke' || id === 'snow' ? t * (id === 'snow' ? 28 : 12) : 0)) % (w + 120)) - 60
      const py = ((seed * 3.1 + (id === 'snow' ? t * 45 : id === 'smoke' ? -t * 9 : 0)) % (h + 120)) - 60
      const size = id === 'sparkle' ? 3 + (i % 4) : 10 + (i % 7) * 6
      ctx.save()
      if (id === 'bokeh' || id === 'smoke') {
        const g = ctx.createRadialGradient(px, py, 0, px, py, size)
        g.addColorStop(0, id === 'smoke' ? 'rgba(220,220,235,.16)' : `rgba(255,255,255,${0.12 + (i % 3) * 0.05})`)
        g.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(px, py, size, 0, Math.PI * 2); ctx.fill()
      } else if (id === 'snow') {
        ctx.fillStyle = 'rgba(255,255,255,.85)'
        ctx.beginPath(); ctx.arc(px, py, size / 8, 0, Math.PI * 2); ctx.fill()
      } else {
        ctx.globalAlpha = 0.5 + 0.5 * Math.abs(Math.sin(t * 3 + i))
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 1.5
        ctx.beginPath(); ctx.moveTo(px - size, py); ctx.lineTo(px + size, py); ctx.moveTo(px, py - size); ctx.lineTo(px, py + size); ctx.stroke()
      }
      ctx.restore()
    }
    return
  }
  if (id === 'spectrum') {
    for (let i = 0; i < 24; i++) {
      ctx.save()
      ctx.filter = `hue-rotate(${i * 15}deg) saturate(1.5)`
      ctx.drawImage(src, (i * w) / 24, 0, w / 24 + 1, h, (i * w) / 24, 0, w / 24 + 1, h)
      ctx.restore()
    }
    return
  }
  if (id === 'glitch') {
    ctx.drawImage(src, 0, 0)
    for (let i = 0; i < 12; i++) {
      const sy = (i * h) / 12
      const offset = Math.sin(t * 6 + i * 2.3) * 18
      ctx.drawImage(src, 0, sy, w, h / 12, offset, sy, w, h / 12)
    }
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = 0.35
    ctx.filter = 'sepia(1) hue-rotate(280deg) saturate(4)'
    ctx.drawImage(src, -6, 0)
    ctx.restore()
    return
  }

  // --- Pixel / art effects ---
  if (id === 'sketch' || id === 'outline') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const sh = d.length / 4 / sw
      const i = (y * sw + x) * 4
      const at = (xx: number, yy: number) => {
        const cx = Math.max(0, Math.min(sw - 1, xx))
        const cy = Math.max(0, Math.min(sh - 1, yy))
        return gray(d, (cy * sw + cx) * 4)
      }
      const g = gray(d, i)
      const edge = Math.abs(g - at(x + 1, y)) + Math.abs(g - at(x, y + 1)) + Math.abs(g - at(x + 1, y + 1))
      const v = id === 'sketch' ? 255 - Math.min(255, edge * 1.6) : edge > 70 ? 20 : 255
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 255
    }, 0.4)
    return
  }
  if (id === 'cartoon' || id === 'popart' || id === 'posterize' || id === 'comic') {
    const levels = id === 'popart' ? 2 : id === 'comic' ? 3 : 4
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const idx = (y * sw + x) * 4
      for (let c = 0; c < 3; c++) {
        const step = 255 / (levels - 1)
        d[idx + c] = Math.min(255, Math.round(d[idx + c] / step) * step)
      }
    }, 0.6)
    return
  }
  if (id === 'crosshatch') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const i = (y * sw + x) * 4
      const g = gray(d, i)
      const dark = g < 150 ? 30 : 255
      const hatch = (x + y) % 9 < 2 || (x - y + sw * 2) % 9 < 2
      const v = g < 90 || (g < 200 && hatch) ? dark : 255
      d[i] = d[i + 1] = d[i + 2] = v
      d[i + 3] = 255
    }, 0.55)
    return
  }
  if (id === 'thermal') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const i = (y * sw + x) * 4
      const g = gray(d, i) / 255
      const stops: [number, number, number][] = [[0, 0, 90], [120, 0, 200], [255, 60, 30], [255, 210, 40], [255, 255, 255]]
      const p = Math.min(0.999, g) * (stops.length - 1)
      const a = stops[Math.floor(p)]
      const b = stops[Math.floor(p) + 1]
      const f = p - Math.floor(p)
      d[i] = a[0] + (b[0] - a[0]) * f
      d[i + 1] = a[1] + (b[1] - a[1]) * f
      d[i + 2] = a[2] + (b[2] - a[2]) * f
    }, 0.5)
    return
  }
  if (id === 'xray') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const i = (y * sw + x) * 4
      const g = 255 - gray(d, i)
      const v = Math.min(255, Math.max(0, (g - 60) * 1.8))
      d[i] = v * 0.55
      d[i + 1] = v * 0.8
      d[i + 2] = v
    }, 0.5)
    return
  }
  if (id === 'nightvision') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const i = (y * sw + x) * 4
      const g = Math.min(255, gray(d, i) * 1.6 + (Math.random() - 0.5) * 22)
      d[i] = g * 0.15
      d[i + 1] = g
      d[i + 2] = g * 0.25
    }, 0.5)
    return
  }
  if (id === 'oldmovie' || id === 'spycam') {
    pixelEffect(ctx, src, w, h, (d, x, y, sw) => {
      const i = (y * sw + x) * 4
      const noise = (Math.random() - 0.5) * 24
      const g = Math.min(255, Math.max(0, gray(d, i) * (id === 'spycam' ? 1.35 : 1) + noise))
      if (id === 'spycam') {
        d[i] = g * 0.2; d[i + 1] = g; d[i + 2] = g * 0.3
      } else {
        d[i] = Math.min(255, g * 1.15 + 18); d[i + 1] = g * 0.95; d[i + 2] = g * 0.7
      }
    }, 0.6)
    const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.2, w / 2, h / 2, h * 0.8)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(1, 'rgba(0,0,0,.5)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    if (id === 'spycam') {
      ctx.fillStyle = 'rgba(180,255,180,.85)'
      ctx.font = `${Math.round(h * 0.045)}px monospace`
      ctx.fillText(new Date().toLocaleString(), w * 0.04, h * 0.92)
    }
    return
  }

  ctx.drawImage(src, 0, 0)
}

const accessoryImages = new Map<string, HTMLImageElement>()

export function preloadAccessories(accessories: Accessory[]) {
  accessories.forEach((acc) => {
    if (acc.kind === 'emoji' || accessoryImages.has(acc.source)) return
    const img = new Image()
    img.onload = () => accessoryImages.set(acc.source, img)
    img.src = acc.source
  })
}

/** Draws try-on stickers/emoji onto a canvas at the same normalized positions as the preview. */
export function drawAccessories(ctx: CanvasRenderingContext2D, accessories: Accessory[], w: number, h: number) {
  accessories.forEach((acc) => {
    ctx.save()
    ctx.translate(acc.x * w, acc.y * h)
    ctx.rotate((acc.rotation * Math.PI) / 180)
    if (acc.kind === 'emoji') {
      ctx.font = `${Math.round(acc.size * w)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(acc.source, 0, 0)
    } else {
      const img = accessoryImages.get(acc.source)
      if (img) {
        const iw = acc.size * w
        const ih = iw * (img.height / img.width)
        ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih)
      }
    }
    ctx.restore()
  })
}

/** Main renderer — one pipeline for both the live viewfinder and captured photos. */
export function renderFrame(ctx: CanvasRenderingContext2D, video: HTMLVideoElement | null, opts: RenderOptions, w: number, h: number) {
  const src = drawSource(video, opts, w, h)
  applyEffect(ctx, src, opts, w, h)
  drawAccessories(ctx, opts.accessories, w, h)
}

/** Animated stand-in used when no camera is available. */
export function drawDemoFrame(ctx: CanvasRenderingContext2D, w: number, h: number, time: number) {
  const t = time / 1000
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, `hsl(${(200 + t * 12) % 360}, 65%, 52%)`)
  g.addColorStop(1, `hsl(${(280 + t * 12) % 360}, 70%, 24%)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.globalAlpha = 0.16
  ctx.fillStyle = '#fff'
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.arc((i * w) / 7, h * 0.35 + Math.sin(t + i) * h * 0.12, h * 0.12 + (i % 3) * h * 0.04, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.textAlign = 'center'
  ctx.fillStyle = 'rgba(255,255,255,.95)'
  ctx.font = `700 ${Math.round(h * 0.1)}px Geist, sans-serif`
  ctx.fillText('SNAPGRID', w / 2, h * 0.54)
  ctx.font = `500 ${Math.round(h * 0.035)}px monospace`
  ctx.fillText('DEMO MODE · ALLOW CAMERA FOR LIVE', w / 2, h * 0.62)
}
