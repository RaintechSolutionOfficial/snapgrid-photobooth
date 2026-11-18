import type { FrameStyle, Settings, Sticker, TemplateId } from '../types'
import { BACKGROUND_THEMES } from './constants'
import { frameInsets } from './frame'

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function isLight(hex: string): boolean {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return true
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 145
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ratio = Math.max(w / img.width, h / img.height)
  const sw = w / ratio
  const sh = h / ratio
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h)
}

export type Cell = { x: number; y: number; w: number; h: number; rotation: number }

/** Computes cell rectangles + canvas size for a given collage template. */
export function layoutCells(
  template: TemplateId,
  rows: number,
  cols: number,
  count: number,
  topBand: number,
  bottomBand: number,
  padding: number,
): { cells: Cell[]; width: number; height: number } {
  const gap = Math.max(8, Math.round(300 / Math.max(rows, cols, count)))
  const n = Math.max(1, count)
  const cells: Cell[] = []
  let contentW = 0
  let contentH = 0

  if (template === 'strip') {
    const w = Math.min(760, Math.max(420, Math.round(2000 / Math.sqrt(n))))
    const h = Math.round(w * 0.7)
    contentW = w
    contentH = n * h + (n - 1) * gap
    for (let i = 0; i < n; i++) cells.push({ x: 0, y: i * (h + gap), w, h, rotation: 0 })
  } else if (template === 'filmstrip') {
    let w = Math.min(420, Math.max(180, Math.round(2400 / n)))
    let h = Math.round(w * 0.75)
    if (n * w + (n - 1) * gap > 2400) {
      w = Math.floor((2400 - (n - 1) * gap) / n)
      h = Math.round(w * 0.75)
    }
    contentW = n * w + (n - 1) * gap
    contentH = h
    for (let i = 0; i < n; i++) cells.push({ x: i * (w + gap), y: 0, w, h, rotation: 0 })
  } else if (template === 'mosaic') {
    contentW = Math.min(2000, Math.max(900, cols * 460))
    const heroH = Math.round(contentW * 0.3)
    const rest = Math.max(1, n - 1)
    const perRow = Math.max(1, Math.min(cols, 3))
    const restRows = Math.ceil(rest / perRow)
    const smallW = Math.floor((contentW - gap * (perRow - 1)) / perRow)
    const smallH = Math.max(120, Math.floor((contentW * 0.7 - gap * (restRows - 1)) / restRows))
    contentH = heroH + gap + restRows * smallH + (restRows - 1) * gap
    if (n >= 1) cells.push({ x: 0, y: 0, w: contentW, h: heroH, rotation: 0 })
    for (let i = 1; i < n; i++) {
      const k = i - 1
      const r = Math.floor(k / perRow)
      const c = k % perRow
      cells.push({ x: c * (smallW + gap), y: heroH + gap + r * (smallH + gap), w: smallW, h: smallH, rotation: 0 })
    }
  } else {
    // grid + polaroid
    const rCount = template === 'polaroid' ? rows : rows
    const cCount = cols
    let cw = Math.min(560, Math.floor((2200 - gap * (cCount - 1)) / cCount))
    let ch = Math.round(cw * 0.75)
    const maxH = 1500
    if (rCount * ch + (rCount - 1) * gap > maxH) {
      ch = Math.max(60, Math.floor((maxH - (rCount - 1) * gap) / rCount))
      cw = Math.round(ch / 0.75)
    }
    contentW = cCount * cw + (cCount - 1) * gap
    contentH = rCount * ch + (rCount - 1) * gap
    for (let i = 0; i < rCount * cCount; i++) {
      const r = Math.floor(i / cCount)
      const c = i % cCount
      const jitter = template === 'polaroid' ? ((i * 37) % 11 - 5) * 0.7 : 0
      cells.push({ x: c * (cw + gap) + jitter, y: r * (ch + gap) + jitter * 0.6, w: cw, h: ch, rotation: template === 'polaroid' ? jitter * 0.45 : 0 })
    }
  }

  return {
    cells,
    width: Math.round(contentW + padding * 2),
    height: Math.round(topBand + contentH + bottomBand),
  }
}

export type LayoutCell = { x: number; y: number; w: number; h: number; rotation: number }
export type Layout = { cells: LayoutCell[]; aspect: number }

/** Normalized (0-1) cell geometry shared by the live camera preview and the final collage. */
export function computeLayout(template: TemplateId, rows: number, cols: number, count: number): Layout {
  const { cells, width, height } = layoutCells(template, rows, cols, count, 0, 0, 0)
  return {
    cells: cells.map((c) => ({
      x: c.x / width,
      y: c.y / height,
      w: c.w / width,
      h: c.h / height,
      rotation: c.rotation,
    })),
    aspect: width / height,
  }
}

/** Keeps template previews usable: tall strips and long filmstrips are clamped. */
export function stageAspect(template: TemplateId, rows: number, cols: number, count: number): number {
  return Math.min(2.1, Math.max(0.85, computeLayout(template, rows, cols, count).aspect))
}

export type CompositeOptions = {
  rows: number
  cols: number
  background: string
  backgroundTheme: string
  template: TemplateId
  frame: FrameStyle
  eventTitle: string
  caption: string
  showDate: boolean
  stickers: Sticker[]
}

export async function buildComposite(shots: string[], opts: CompositeOptions): Promise<string> {
  const { rows, cols, background, backgroundTheme, template, frame, eventTitle, caption, showDate, stickers } = opts
  const padding = frame === 'polaroid' ? 46 : frame === 'none' ? 18 : 30
  const topBand = eventTitle ? 96 : 24
  const bottomBand = caption || showDate ? 76 : 24
  const count = shots.length || 1

  const { cells, width, height } = layoutCells(template, rows, cols, count, topBand, bottomBand, padding)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is not available')

  // Background (theme gradient + subtle pattern)
  const theme = BACKGROUND_THEMES.find((t) => t.id === backgroundTheme) ?? BACKGROUND_THEMES[0]
  const from = theme.id === 'custom' ? background : theme.from
  const to = theme.id === 'custom' ? background : theme.to
  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, from)
  grad.addColorStop(1, frame === 'gradient' ? '#0a6cff' : to)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  if (theme.pattern === 'dots' || theme.pattern === 'grid') {
    ctx.save()
    ctx.strokeStyle = theme.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'
    ctx.fillStyle = ctx.strokeStyle
    ctx.lineWidth = 2
    const step = 42
    if (theme.pattern === 'dots') {
      for (let x = step; x < width; x += step) {
        for (let y = step; y < height; y += step) {
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    } else {
      for (let x = 0; x < width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke() }
      for (let y = 0; y < height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke() }
    }
    ctx.restore()
  }

  const light = theme.id === 'custom' ? isLight(background) : !theme.dark
  const inkColor = light ? '#111827' : '#f8fafc'
  const subColor = light ? 'rgba(17,24,39,.58)' : 'rgba(248,250,252,.62)'

  // Header
  if (eventTitle) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = inkColor
    ctx.font = `800 ${Math.max(18, Math.min(46, Math.round(width / 26)))}px Montserrat, Geist, sans-serif`
    ctx.fillText(eventTitle.toUpperCase(), width / 2, 60)
  }
  if (showDate) {
    ctx.fillStyle = subColor
    ctx.font = `500 ${Math.max(12, Math.round(width / 70))}px Geist Mono, monospace`
    ctx.fillText(new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), width / 2, eventTitle ? 84 : 44)
  }

  const images = await Promise.all(shots.map((src) => loadImage(src).catch(() => null)))

  cells.forEach((cell, i) => {
    const x = padding + cell.x
    const y = topBand + cell.y
    const { w, h } = cell
    const geo = frameInsets(frame)
    const insetX = Math.round(w * geo.left)
    const insetTop = Math.round(h * geo.top)
    const insetBottom = Math.round(h * geo.bottom)
    const winX = x + insetX
    const winY = y + insetTop
    const winW = Math.max(1, w - insetX * 2)
    const winH = Math.max(1, h - insetTop - insetBottom)

    ctx.save()
    // Instant prints get a gentle deterministic tilt, like loose photos on a table.
    const tilt = frame === 'polaroid' && template !== 'polaroid'
      ? (i % 2 === 0 ? 1 : -1) * (1 + (i % 3) * 0.5)
      : 0
    const rotation = cell.rotation + tilt
    if (rotation) {
      ctx.translate(x + w / 2, y + h / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-(x + w / 2), -(y + h / 2))
    }

    // Paper backing
    if (frame === 'polaroid' || frame === 'classic' || template === 'polaroid') {
      if (frame === 'polaroid') {
        const paper = ctx.createLinearGradient(x, y, x + w, y + h)
        paper.addColorStop(0, '#ffffff')
        paper.addColorStop(1, '#f4f2ed')
        ctx.fillStyle = paper
      } else {
        ctx.fillStyle = '#ffffff'
      }
      ctx.shadowColor = 'rgba(0,0,0,.28)'
      ctx.shadowBlur = frame === 'polaroid' ? 22 : template === 'polaroid' ? 16 : 0
      ctx.shadowOffsetY = frame === 'polaroid' ? 9 : template === 'polaroid' ? 6 : 0
      roundRect(ctx, x, y, w, h, 6)
      ctx.fill()
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0
      ctx.shadowOffsetY = 0
    }

    // Photo window — same geometry as the live camera preview
    const img = images[i]
    ctx.save()
    roundRect(ctx, winX, winY, winW, winH, frame === 'polaroid' ? 3 : 4)
    ctx.clip()
    if (img) {
      drawCover(ctx, img, winX, winY, winW, winH)
    } else {
      ctx.fillStyle = light ? '#e6e9ef' : '#1f2735'
      ctx.fillRect(winX, winY, winW, winH)
    }
    ctx.restore()

    // Thin inner line gives the print depth
    if (frame === 'polaroid' || frame === 'classic') {
      ctx.strokeStyle = frame === 'polaroid' ? 'rgba(0,0,0,.14)' : 'rgba(0,0,0,.08)'
      ctx.lineWidth = 2
      roundRect(ctx, winX + 1, winY + 1, Math.max(1, winW - 2), Math.max(1, winH - 2), frame === 'polaroid' ? 3 : 4)
      ctx.stroke()
    }

    // Handwritten-style caption on the thick polaroid chin
    if (frame === 'polaroid') {
      const label = eventTitle || caption || 'snapgrid'
      const fs = Math.max(14, Math.min(36, Math.round(w * 0.062)))
      ctx.fillStyle = '#2b2f38'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `italic 600 ${fs}px Geist, "Segoe UI", sans-serif`
      ctx.save()
      ctx.translate(x + w / 2, y + h - insetBottom / 2)
      ctx.rotate((-1.5 * Math.PI) / 180)
      ctx.fillText(label, 0, 0)
      ctx.restore()
    }

    if (frame === 'neon') {
      ctx.save()
      ctx.strokeStyle = '#3d8bff'
      ctx.lineWidth = 4
      ctx.shadowColor = '#3d8bff'
      ctx.shadowBlur = 18
      roundRect(ctx, winX, winY, winW, winH, 6)
      ctx.stroke()
      ctx.restore()
    } else if (frame === 'gradient') {
      const g = ctx.createLinearGradient(winX, winY, winX + winW, winY + winH)
      g.addColorStop(0, '#ffffff')
      g.addColorStop(1, '#9cc6ff')
      ctx.strokeStyle = g
      ctx.lineWidth = 3
      roundRect(ctx, winX, winY, winW, winH, 6)
      ctx.stroke()
    }
    ctx.restore()
  })

  stickers.forEach((s) => {
    ctx.font = `${Math.round(s.size * width)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(s.emoji, s.x * width, s.y * height)
  })

  if (caption) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = inkColor
    ctx.font = `600 ${Math.max(14, Math.min(30, Math.round(width / 45)))}px Geist, sans-serif`
    ctx.fillText(caption, width / 2, height - 32)
  }

  return canvas.toDataURL('image/png')
}

export function settingsToComposite(s: Settings): CompositeOptions {
  return {
    rows: s.rows,
    cols: s.cols,
    background: s.background,
    backgroundTheme: s.backgroundTheme,
    template: s.template,
    frame: s.frame,
    eventTitle: s.eventTitle,
    caption: s.caption,
    showDate: s.showDate,
    stickers: s.stickers,
  }
}
