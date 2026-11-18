import type { Accessory, AccessoryAnchor, FaceBox, Settings } from '../types'

export type EffectCategory = 'Hats' | 'Ears & horns' | 'Face' | 'Fun'
export type EffectDef = {
  id: string
  name: string
  category: EffectCategory
  kind: 'emoji' | 'svg'
  source: string
  x: number
  y: number
  size: number
  rotation?: number
  anchor?: AccessoryAnchor
}

const svg = (body: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`)}`

const HATS: EffectDef[] = [
  {
    id: 'sombrero', name: 'Sombrero', category: 'Hats', kind: 'svg', x: 0.5, y: 0.16, size: 0.46,
    source: svg(`<ellipse cx="50" cy="76" rx="47" ry="11" fill="#d9ad3a" stroke="#8a6a18" stroke-width="2"/><path d="M27 74 Q31 20 50 20 Q69 20 73 74 Z" fill="#e8bf49" stroke="#8a6a18" stroke-width="2"/><path d="M29 62 Q50 50 71 62" stroke="#2563a8" stroke-width="5" fill="none"/><path d="M30 54 Q50 44 70 54" stroke="#e5484d" stroke-width="3" fill="none"/>`),
  },
  {
    id: 'cap', name: 'Baseball cap', category: 'Hats', kind: 'svg', x: 0.5, y: 0.2, size: 0.42,
    source: svg(`<path d="M17 62 Q22 32 50 32 Q78 32 83 62 Z" fill="#e5484d" stroke="#a3262b" stroke-width="2"/><path d="M17 62 Q50 80 83 62 Q90 78 62 80 L18 74 Z" fill="#b83036"/><circle cx="50" cy="33" r="4" fill="#fca5a5"/>`),
  },
  {
    id: 'cowboy', name: 'Cowboy', category: 'Hats', kind: 'svg', x: 0.5, y: 0.18, size: 0.5,
    source: svg(`<ellipse cx="50" cy="72" rx="46" ry="10" fill="#8b5a2b" stroke="#5c3a17" stroke-width="2"/><path d="M29 70 Q31 36 50 36 Q69 36 71 70 Z" fill="#a76b32" stroke="#5c3a17" stroke-width="2"/><path d="M30 60 Q50 52 70 60" stroke="#3a2a1a" stroke-width="5" fill="none"/>`),
  },
  {
    id: 'graduation', name: 'Grad cap', category: 'Hats', kind: 'svg', x: 0.5, y: 0.18, size: 0.46, rotation: -8,
    source: svg(`<path d="M10 55 L50 38 L90 55 L50 72 Z" fill="#1f2937"/><path d="M32 63 L32 82 Q50 88 68 82 L68 63 Z" fill="#374151"/><path d="M84 56 L84 82" stroke="#facc15" stroke-width="2"/><circle cx="84" cy="84" r="3" fill="#facc15"/>`),
  },
  {
    id: 'crown', name: 'Crown', category: 'Hats', kind: 'svg', x: 0.5, y: 0.16, size: 0.38,
    source: svg(`<path d="M12 74 L18 30 L36 50 L50 22 L64 50 L82 30 L88 74 Z" fill="#ffd54a" stroke="#c9a227" stroke-width="2"/><rect x="14" y="70" width="72" height="9" rx="3" fill="#e6b525"/><circle cx="50" cy="60" r="5" fill="#e5484d"/><circle cx="28" cy="62" r="3" fill="#3d8bff"/><circle cx="72" cy="62" r="3" fill="#10a37f"/>`),
  },
  {
    id: 'party', name: 'Party hat', category: 'Hats', kind: 'svg', x: 0.5, y: 0.16, size: 0.4, rotation: 8,
    source: svg(`<path d="M50 12 L80 76 L20 76 Z" fill="#7c3aed"/><path d="M38 40 L62 40 M32 56 L68 56" stroke="#f472b6" stroke-width="6"/><circle cx="50" cy="11" r="7" fill="#facc15"/>`),
  },
  {
    id: 'wizard', name: 'Wizard hat', category: 'Hats', kind: 'svg', x: 0.5, y: 0.15, size: 0.46, rotation: -6,
    source: svg(`<path d="M50 8 Q56 52 84 68 L16 68 Q44 52 50 8 Z" fill="#5b21b6"/><ellipse cx="50" cy="70" rx="38" ry="8" fill="#4c1d95"/><path d="M48 24 l3 6 6 1 -4.5 4.5 1 6.5 -5.5 -3 -5.5 3 1 -6.5 -4.5 -4.5 6 -1 Z" fill="#facc15"/><circle cx="66" cy="50" r="2.5" fill="#facc15"/>`),
  },
  {
    id: 'pirate', name: 'Pirate hat', category: 'Hats', kind: 'svg', x: 0.5, y: 0.18, size: 0.48,
    source: svg(`<path d="M10 66 Q50 16 90 66 Q50 50 10 66 Z" fill="#111827"/><path d="M16 64 Q50 30 84 64" stroke="#374151" stroke-width="3" fill="none"/><circle cx="50" cy="52" r="9" fill="#f8fafc"/><circle cx="46" cy="50" r="2" fill="#111827"/><circle cx="54" cy="50" r="2" fill="#111827"/><path d="M44 57 Q50 61 56 57" stroke="#111827" stroke-width="2" fill="none"/>`),
  },
  {
    id: 'santa', name: 'Santa hat', category: 'Hats', kind: 'svg', x: 0.46, y: 0.16, size: 0.42, rotation: -12,
    source: svg(`<path d="M22 64 Q30 24 58 22 Q80 22 76 44 Q70 62 52 66 Z" fill="#e5484d"/><rect x="18" y="60" width="56" height="14" rx="6" fill="#f8fafc"/><circle cx="77" cy="27" r="10" fill="#f8fafc"/>`),
  },
]

const EARS: EffectDef[] = [
  {
    id: 'cat', name: 'Cat ears', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.14, size: 0.4,
    source: svg(`<path d="M12 62 L22 10 L50 44 Z" fill="#2f2f38"/><path d="M88 62 L78 10 L50 44 Z" fill="#2f2f38"/><path d="M22 50 L27 22 L42 42 Z" fill="#f19bb2"/><path d="M78 50 L73 22 L58 42 Z" fill="#f19bb2"/>`),
  },
  {
    id: 'bunny', name: 'Bunny ears', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.1, size: 0.44,
    source: svg(`<ellipse cx="34" cy="30" rx="10" ry="28" fill="#fdfdfd" stroke="#d8d8e0" stroke-width="2"/><ellipse cx="66" cy="30" rx="10" ry="28" fill="#fdfdfd" stroke="#d8d8e0" stroke-width="2"/><ellipse cx="34" cy="30" rx="4.5" ry="20" fill="#f3a6bd"/><ellipse cx="66" cy="30" rx="4.5" ry="20" fill="#f3a6bd"/>`),
  },
  {
    id: 'devil', name: 'Devil horns', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.16, size: 0.4,
    source: svg(`<path d="M22 60 Q8 28 30 12 Q28 36 44 48 Z" fill="#d92d2d"/><path d="M78 60 Q92 28 70 12 Q72 36 56 48 Z" fill="#d92d2d"/>`),
  },
  {
    id: 'halo', name: 'Angel halo', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.08, size: 0.42,
    source: svg(`<ellipse cx="50" cy="50" rx="34" ry="11" fill="none" stroke="#facc15" stroke-width="7"/><ellipse cx="50" cy="48" rx="34" ry="11" fill="none" stroke="#fff3b0" stroke-width="2"/>`),
  },
  {
    id: 'flowers', name: 'Flower crown', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.14, size: 0.46,
    source: svg(`<path d="M12 60 Q50 30 88 60" stroke="#16a34a" stroke-width="4" fill="none"/>${([[20, 54, '#f472b6'], [36, 42, '#fbbf24'], [52, 38, '#f87171'], [68, 42, '#c084fc'], [82, 54, '#f472b6']] as [number, number, string][]).map(([x, y, c]) => `${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 6}" rx="4" ry="7" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('')}<circle cx="${x}" cy="${y}" r="4" fill="#facc15"/>`).join('')}`),
  },
  {
    id: 'headphones', name: 'Headphones', category: 'Ears & horns', kind: 'svg', x: 0.5, y: 0.24, size: 0.46,
    source: svg(`<path d="M18 62 A32 32 0 0 1 82 62" stroke="#1f2937" stroke-width="8" fill="none"/><rect x="10" y="56" width="18" height="30" rx="8" fill="#3d8bff"/><rect x="72" y="56" width="18" height="30" rx="8" fill="#3d8bff"/>`),
  },
]

const FACE: EffectDef[] = [
  {
    id: 'sunglasses', name: 'Sunglasses', category: 'Face', kind: 'svg', x: 0.5, y: 0.43, size: 0.52,
    source: svg(`<path d="M14 44 h30 v14 q0 10 -12 10 h-8 q-10 0 -10 -10 Z" fill="#111827"/><path d="M56 44 h30 v14 q0 10 -10 10 h-8 q-12 0 -12 -10 Z" fill="#111827"/><path d="M44 48 q6 -5 12 0" stroke="#111827" stroke-width="5" fill="none"/><path d="M18 47 l8 -3 M60 47 l8 -3" stroke="#ffffff" stroke-width="2.5" opacity=".7"/>`),
  },
  {
    id: 'mustache', name: 'Mustache', category: 'Face', kind: 'svg', x: 0.5, y: 0.56, size: 0.42,
    source: svg(`<path d="M50 58 Q38 44 20 52 Q30 68 50 60 Q70 68 80 52 Q62 44 50 58 Z" fill="#2f2f38"/>`),
  },
  {
    id: 'clownnose', name: 'Clown nose', category: 'Face', kind: 'svg', x: 0.5, y: 0.52, size: 0.13,
    source: svg(`<circle cx="50" cy="50" r="34" fill="#ef4444"/><circle cx="40" cy="38" r="8" fill="#fca5a5" opacity=".8"/>`),
  },
  {
    id: 'beard', name: 'Beard', category: 'Face', kind: 'svg', x: 0.5, y: 0.63, size: 0.5,
    source: svg(`<path d="M20 40 Q20 88 50 90 Q80 88 80 40 Q74 68 50 68 Q26 68 20 40 Z" fill="#5b3a1e"/>`),
  },
  {
    id: 'blush', name: 'Blush', category: 'Face', kind: 'svg', x: 0.5, y: 0.5, size: 0.4,
    source: svg(`<ellipse cx="26" cy="55" rx="14" ry="8" fill="#f9a8bb" opacity=".75"/><ellipse cx="74" cy="55" rx="14" ry="8" fill="#f9a8bb" opacity=".75"/>`),
  },
  {
    id: 'eyepatch', name: 'Eye patch', category: 'Face', kind: 'svg', x: 0.5, y: 0.42, size: 0.4,
    source: svg(`<path d="M14 34 Q86 26 88 34" stroke="#111827" stroke-width="4" fill="none"/><ellipse cx="36" cy="52" rx="15" ry="12" fill="#111827" transform="rotate(-18 36 52)"/>`),
  },
]

const FUN_EMOJIS: EffectDef[] = [
  { id: 'e-glasses', name: 'Cool glasses', category: 'Fun', kind: 'emoji', source: '🕶️', x: 0.5, y: 0.43, size: 0.32, anchor: 'face' },
  { id: 'e-crown', name: 'Crown', category: 'Fun', kind: 'emoji', source: '👑', x: 0.5, y: 0.14, size: 0.28, anchor: 'head' },
  { id: 'e-cat', name: 'Cat', category: 'Fun', kind: 'emoji', source: '🐱', x: 0.78, y: 0.3, size: 0.24 },
  { id: 'e-unicorn', name: 'Unicorn', category: 'Fun', kind: 'emoji', source: '🦄', x: 0.78, y: 0.26, size: 0.26 },
  { id: 'e-party', name: 'Party', category: 'Fun', kind: 'emoji', source: '🎉', x: 0.8, y: 0.24, size: 0.24, rotation: -18 },
  { id: 'e-heart', name: 'Heart', category: 'Fun', kind: 'emoji', source: '💖', x: 0.24, y: 0.3, size: 0.22 },
  { id: 'e-star', name: 'Star', category: 'Fun', kind: 'emoji', source: '⭐', x: 0.74, y: 0.24, size: 0.22 },
  { id: 'e-fire', name: 'Fire', category: 'Fun', kind: 'emoji', source: '🔥', x: 0.25, y: 0.28, size: 0.22, rotation: -12 },
  { id: 'e-bow', name: 'Bow', category: 'Fun', kind: 'emoji', source: '🎀', x: 0.72, y: 0.2, size: 0.24, anchor: 'head' },
  { id: 'e-disco', name: 'Disco', category: 'Fun', kind: 'emoji', source: '🪩', x: 0.5, y: 0.12, size: 0.26, anchor: 'head' },
  { id: 'e-trophy', name: 'Winner', category: 'Fun', kind: 'emoji', source: '🏆', x: 0.5, y: 0.15, size: 0.26, anchor: 'head' },
  { id: 'e-alien', name: 'Alien', category: 'Fun', kind: 'emoji', source: '👽', x: 0.78, y: 0.28, size: 0.24, anchor: 'face' },
]

export const EFFECTS: EffectDef[] = [...HATS, ...EARS, ...FACE, ...FUN_EMOJIS]

export const EFFECT_CATEGORIES: EffectCategory[] = ['Hats', 'Ears & horns', 'Face', 'Fun']

function categoryAnchor(category: EffectCategory): AccessoryAnchor {
  if (category === 'Hats' || category === 'Ears & horns') return 'head'
  if (category === 'Face') return 'face'
  return 'free'
}

export function makeAccessory(def: EffectDef): Accessory {
  return {
    id: `${def.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: def.name,
    kind: def.kind,
    source: def.source,
    x: def.x,
    y: def.y,
    size: def.size,
    rotation: def.rotation ?? 0,
    anchor: def.anchor ?? categoryAnchor(def.category),
  }
}

/** Repositions face/head accessories using a detected face box, normalized to the frame. */
export function resolveAccessories(accessories: Accessory[], faceBox: FaceBox | null): Accessory[] {
  if (!faceBox) return accessories
  return accessories.map((acc) => {
    if (acc.anchor === 'free') return acc
    if (acc.anchor === 'head') {
      return {
        ...acc,
        x: Math.min(1, Math.max(0, faceBox.x + faceBox.w / 2)),
        y: Math.min(1, Math.max(0, faceBox.y + faceBox.w * 0.04)),
      }
    }
    return {
      ...acc,
      x: Math.min(1, Math.max(0, faceBox.x + faceBox.w / 2)),
      y: Math.min(1, Math.max(0, faceBox.y + faceBox.h * 0.46)),
    }
  })
}

const imageCache = new Map<string, Promise<HTMLImageElement>>()

export function effectImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return cached
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
  imageCache.set(src, promise)
  return promise
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Bakes the given accessories (emoji + SVG effects) into an image data URL. */
export async function applyAccessories(dataUrl: string, accessories: Accessory[]): Promise<string> {
  if (!accessories.length) return dataUrl
  const base = await loadImage(dataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = base.width
  canvas.height = base.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl
  ctx.drawImage(base, 0, 0)

  for (const acc of accessories) {
    ctx.save()
    ctx.translate(acc.x * canvas.width, acc.y * canvas.height)
    ctx.rotate((acc.rotation * Math.PI) / 180)
    if (acc.kind === 'emoji') {
      ctx.font = `${Math.round(acc.size * canvas.width)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(acc.source, 0, 0)
    } else {
      try {
        const img = await effectImage(acc.source)
        const w = acc.size * canvas.width
        const h = w * (img.height / img.width)
        ctx.drawImage(img, -w / 2, -h / 2, w, h)
      } catch {
        // skip effects that fail to decode
      }
    }
    ctx.restore()
  }
  return canvas.toDataURL('image/jpeg', 0.92)
}

/** Chooses which accessories apply to a given shot index. */
export function accessoriesForShot(index: number, settings: Settings, override?: Accessory[]): Accessory[] {
  const list = override ?? settings.accessories
  if (!list.length) return []
  if (settings.effectMode === 'all') return list
  if (settings.effectMode === 'rotate') return [list[index % list.length]]
  return [list[Math.floor(Math.random() * list.length)]]
}
