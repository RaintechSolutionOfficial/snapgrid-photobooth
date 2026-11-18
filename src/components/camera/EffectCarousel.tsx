import { useEffect, useRef, useState, type RefObject } from 'react'
import { Sparkles, ChevronDown } from 'lucide-react'
import type { Settings } from '../../types'
import { EFFECTS, EFFECT_CATEGORIES, renderFrame, type EffectCategory } from '../../utils/videoEffects'

type Props = {
  videoRef: RefObject<HTMLVideoElement>
  cameraReady: boolean
  settings: Settings
  onSelect: (id: string) => void
}

const THUMB_W = 104
const THUMB_H = 78

export function EffectCarousel({ videoRef, cameraReady, settings, onSelect }: Props) {
  const [category, setCategory] = useState<EffectCategory>('Colors')
  const [expanded, setExpanded] = useState(false)
  const canvases = useRef(new Map<string, HTMLCanvasElement>())
  const optsRef = useRef(settings)

  useEffect(() => { optsRef.current = settings }, [settings])

  const visible = EFFECTS.filter((e) => e.category === category)
  const shown = expanded ? visible : visible.slice(0, 9)

  // Refresh the live thumbnails at a gentle cadence so the picker stays responsive.
  useEffect(() => {
    if (!cameraReady) return
    const paint = () => {
      const s = optsRef.current
      EFFECTS.filter((e) => e.category === category).slice(0, expanded ? undefined : 9).forEach((effect) => {
        const canvas = canvases.current.get(effect.id)
        const ctx = canvas?.getContext('2d')
        if (!ctx) return
        renderFrame(ctx, videoRef.current, {
          effectId: effect.id,
          filter: s.filter,
          brightness: s.brightness,
          contrast: s.contrast,
          saturation: s.saturation,
          mirror: s.mirror,
          accessories: [],
          time: performance.now(),
        }, THUMB_W, THUMB_H)
      })
    }
    paint()
    const timer = window.setInterval(paint, 700)
    return () => window.clearInterval(timer)
  }, [cameraReady, category, expanded, videoRef])

  const current = EFFECTS.find((e) => e.id === settings.effectId)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="label !mb-0 flex items-center gap-1.5"><Sparkles size={12} /> Live effects</span>
        <span className="mono text-[10px] text-[var(--muted)]">{current?.name ?? 'Original'}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {EFFECT_CATEGORIES.map((c) => (
          <button key={c} className="chip" data-active={category === c} onClick={() => { setCategory(c); setExpanded(false) }}>{c}</button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {shown.map((effect) => (
          <button
            key={effect.id}
            className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-300 text-left ${settings.effectId === effect.id ? 'border-[var(--accent)] shadow-[0_4px_14px_rgba(10,108,255,.22)]' : 'border-transparent hover:border-[var(--line-2)]'}`}
            onClick={() => onSelect(effect.id)}
            title={effect.hint}
          >
            <canvas
              ref={(node) => {
                if (!node) return
                if (!canvases.current.has(effect.id)) {
                  node.width = THUMB_W
                  node.height = THUMB_H
                  canvases.current.set(effect.id, node)
                }
              }}
              className="block w-full aspect-[4/3] bg-[#0a0d14] object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 px-1.5 py-1 bg-gradient-to-t from-black/80 to-transparent">
              <span className="block text-[10px] font-semibold text-white leading-tight truncate">{effect.name}</span>
            </span>
            {settings.effectId === effect.id && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            )}
          </button>
        ))}
      </div>

      {visible.length > 9 && (
        <button className="btn btn-sm btn-ghost w-full" onClick={() => setExpanded(!expanded)}>
          <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          {expanded ? 'Show fewer' : `More ${category.toLowerCase()} effects (${visible.length - 9})`}
        </button>
      )}

      {!cameraReady && <p className="text-[10px] text-[var(--muted)]">Enable the camera to see live effect previews.</p>}
    </div>
  )
}
