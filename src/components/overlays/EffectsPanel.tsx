import { useState } from 'react'
import { Sparkles, X, RotateCcw, Shuffle, Layers3, ScanFace, Crown, Ear, Smile, PartyPopper, type LucideIcon } from 'lucide-react'
import type { Settings } from '../../types'
import { EFFECTS, EFFECT_CATEGORIES, makeAccessory, type EffectCategory } from '../../utils/effects'
import { EFFECT_MODES } from '../../utils/constants'
import { Slider } from '../studio/Slider'

type Props = {
  settings: Settings
  update: (patch: Partial<Settings>) => void
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const categoryIcons: Record<EffectCategory, LucideIcon> = {
  Hats: Crown,
  'Ears & horns': Ear,
  Face: Smile,
  Fun: PartyPopper,
}

export function EffectsPanel({ settings, update, selectedId, onSelect }: Props) {
  const [category, setCategory] = useState<EffectCategory>('Hats')
  const setSelectedId = onSelect

  const visible = EFFECTS.filter((e) => e.category === category)

  const add = (def: (typeof EFFECTS)[number]) => {
    const acc = makeAccessory(def)
    update({ accessories: [...settings.accessories, acc] })
    setSelectedId(acc.id)
  }

  const edit = (id: string, patch: Partial<(typeof settings.accessories)[number]>) => {
    update({ accessories: settings.accessories.map((a) => (a.id === id ? { ...a, ...patch } : a)) })
  }

  const remove = (id: string) => {
    update({ accessories: settings.accessories.filter((a) => a.id !== id) })
    if (selectedId === id) setSelectedId(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <span className="label flex items-center gap-1.5"><Sparkles size={12} /> Try-on effects</span>
        <label className="flex items-center justify-between gap-2 p-2.5 mb-3 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] cursor-pointer">
          <span className="flex items-center gap-2">
            <ScanFace size={14} className="text-[var(--accent)]" />
            <span>
              <span className="block text-[12px] font-semibold text-[var(--ink)]">Follow my face</span>
              <span className="block text-[10px] text-[var(--muted)]">Auto-place hats & face effects</span>
            </span>
          </span>
          <button className="switch" data-on={settings.faceAutoPlace} onClick={() => update({ faceAutoPlace: !settings.faceAutoPlace })} aria-label="Toggle face tracking" />
        </label>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {EFFECT_CATEGORIES.map((c) => {
            const Icon = categoryIcons[c]
            return (
              <button key={c} className="chip" data-active={category === c} onClick={() => setCategory(c)}>
                <Icon size={12} /> {c}
              </button>
            )
          })}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {visible.map((def) => (
            <button
              key={def.id}
              className="group relative flex flex-col items-center gap-1 p-2 rounded-xl border border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] transition-all"
              onClick={() => add(def)}
              title={`Add ${def.name}`}
            >
              <span className="w-11 h-11 flex items-center justify-center text-3xl leading-none">
                {def.kind === 'emoji' ? def.source : <img src={def.source} alt="" className="w-10 h-10 object-contain" />}
              </span>
              {def.kind === 'emoji' && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center">
                  <Smile size={9} />
                </span>
              )}
              <span className="text-[9px] text-[var(--muted)] group-hover:text-[var(--accent)] text-center leading-tight">{def.name}</span>
            </button>
          ))}
        </div>
        {visible.some((e) => e.kind === 'svg') && (
          <p className="text-[10px] text-[var(--muted)] mt-2">Tap an effect to place it on your shots. Drag it on the preview to reposition.</p>
        )}
      </div>

      {settings.accessories.length > 0 && (
        <>
          <div className="divider" />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label !mb-0 flex items-center gap-1.5"><Layers3 size={12} /> Active effects ({settings.accessories.length})</span>
              <button className="text-[11px] font-semibold text-[var(--danger)]" onClick={() => { update({ accessories: [] }); setSelectedId(null) }}>Clear</button>
            </div>
            <div className="space-y-2">
              {settings.accessories.map((acc) => (
                <div key={acc.id} className={`p-2.5 rounded-xl border transition-colors ${selectedId === acc.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] bg-[var(--surface-2)]'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <button className="w-8 h-8 flex items-center justify-center text-2xl flex-none" onClick={() => setSelectedId(acc.id)}>
                      {acc.kind === 'emoji' ? acc.source : <img src={acc.source} alt="" className="w-7 h-7 object-contain" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-[var(--ink)] truncate">{acc.name}</p>
                      <p className="mono text-[9px] text-[var(--muted)]">{Math.round(acc.x * 100)}% · {Math.round(acc.y * 100)}%</p>
                    </div>
                    <button className="btn btn-icon btn-ghost btn-sm !w-7 !h-7" onClick={() => remove(acc.id)} aria-label={`Remove ${acc.name}`}><X size={13} /></button>
                  </div>
                  {selectedId === acc.id && (
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
                      <Slider label="X" value={Math.round(acc.x * 100)} min={0} max={100} unit="%" onChange={(v) => edit(acc.id, { x: v / 100 })} />
                      <Slider label="Y" value={Math.round(acc.y * 100)} min={0} max={100} unit="%" onChange={(v) => edit(acc.id, { y: v / 100 })} />
                      <Slider label="Size" value={Math.round(acc.size * 100)} min={3} max={60} unit="%" onChange={(v) => edit(acc.id, { size: v / 100 })} />
                      <Slider label="Tilt" value={acc.rotation} min={-45} max={45} unit="°" onChange={(v) => edit(acc.id, { rotation: v })} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          <div>
            <span className="label flex items-center gap-1.5"><Shuffle size={12} /> Per-shot assignment</span>
            <div className="space-y-1.5">
              {EFFECT_MODES.map((m) => (
                <button key={m.id} className={`w-full text-left p-2.5 rounded-xl border transition-colors ${settings.effectMode === m.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] bg-[var(--surface-2)]'}`} onClick={() => update({ effectMode: m.id })}>
                  <p className={`text-[12px] font-semibold ${settings.effectMode === m.id ? 'text-[var(--accent)]' : 'text-[var(--ink)]'}`}>{m.name}</p>
                  <p className="text-[10px] text-[var(--muted)]">{m.hint}</p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[var(--muted)] mt-2 flex items-center gap-1"><RotateCcw size={10} /> Effects are baked into every shot before the collage is built.</p>
          </div>
        </>
      )}
    </div>
  )
}
