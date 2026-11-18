import type { FrameStyle } from '../types'

/** Shared frame geometry — the live camera preview and the final collage use the same numbers. */
export function frameInsets(frame: FrameStyle) {
  const v = frame === 'polaroid'
    ? { t: 0.045, x: 0.045, b: 0.16 }
    : frame === 'none'
      ? { t: 0, x: 0, b: 0 }
      : { t: 0.025, x: 0.025, b: 0.025 }

  return {
    /** CSS `inset` shorthand: top, left/right, bottom. */
    css: `${v.t * 100}% ${v.x * 100}% ${v.b * 100}%`,
    /** Fractions of the cell height. */
    top: v.t,
    bottom: v.b,
    /** Fractions of the cell width. */
    left: v.x,
    right: v.x,
  }
}

export function framePaper(frame: FrameStyle): string {
  switch (frame) {
    case 'classic': return '#ffffff'
    case 'polaroid': return 'linear-gradient(135deg, #ffffff 0%, #f4f2ed 100%)'
    case 'gradient': return 'linear-gradient(135deg, #ffffff 0%, #9cc6ff 100%)'
    case 'neon': return '#0a0d14'
    case 'none':
    default: return '#0a0d14'
  }
}

export function frameAccent(frame: FrameStyle): string | null {
  if (frame === 'neon') return '#3d8bff'
  if (frame === 'gradient') return '#9cc6ff'
  return null
}
