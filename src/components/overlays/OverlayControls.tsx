import { useState } from 'react'
import { Type, Sticker as StickerIcon, CalendarDays, X } from 'lucide-react'
import type { Settings, Sticker } from '../../types'
import { EMOJIS } from '../../utils/constants'
import { Slider } from '../studio/Slider'

type Props = {
  settings: Settings
  update: (patch: Partial<Settings>) => void
}

export function OverlayControls({ settings, update }: Props) {
  const [emojiTab, setEmojiTab] = useState(false)
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null)

  const addSticker = (emoji: string) => {
    const sticker: Sticker = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji,
      x: 0.3 + Math.random() * 0.4,
      y: 0.3 + Math.random() * 0.4,
      size: 0.08,
    }
    update({ stickers: [...settings.stickers, sticker] })
    setSelectedSticker(sticker.id)
  }

  const updateSticker = (id: string, patch: Partial<Sticker>) => {
    update({ stickers: settings.stickers.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  }

  const removeSticker = (id: string) => {
    update({ stickers: settings.stickers.filter((s) => s.id !== id) })
    setSelectedSticker(null)
  }

  return (
    <div className="space-y-5">
      {/* Text */}
      <div>
        <span className="label flex items-center gap-1.5"><Type size={12} /> Text overlay</span>
        <div className="space-y-2.5">
          <input
            className="input"
            value={settings.eventTitle}
            onChange={(e) => update({ eventTitle: e.target.value })}
            placeholder="Event title"
            maxLength={40}
          />
          <input
            className="input"
            value={settings.caption}
            onChange={(e) => update({ caption: e.target.value })}
            placeholder="Caption"
            maxLength={60}
          />
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[12px] text-[var(--ink-2)] flex items-center gap-1.5"><CalendarDays size={12} /> Show date</span>
            <button className="switch" data-on={settings.showDate} onClick={() => update({ showDate: !settings.showDate })} aria-label="Toggle date" />
          </label>
        </div>
      </div>

      <div className="divider" />

      {/* Stickers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0 flex items-center gap-1.5"><StickerIcon size={12} /> Stickers</span>
          <button className="text-[11px] font-semibold text-[var(--accent)]" onClick={() => setEmojiTab(!emojiTab)}>
            {emojiTab ? 'Done' : '+ Add'}
          </button>
        </div>

        {emojiTab && (
          <div className="grid grid-cols-8 gap-1 p-2 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] mb-3">
            {EMOJIS.map((e) => (
              <button key={e} className="text-lg rounded-lg p-1 hover:bg-[var(--accent-soft)] transition-colors" onClick={() => addSticker(e)}>{e}</button>
            ))}
          </div>
        )}

        {settings.stickers.length === 0 ? (
          <p className="text-[11px] text-[var(--muted)]">Add emojis that appear on your final collage.</p>
        ) : (
          <div className="space-y-2">
            {settings.stickers.map((s) => (
              <div key={s.id} className={`flex items-center gap-2 p-2 rounded-xl border transition-colors ${selectedSticker === s.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] bg-[var(--surface-2)]'}`}>
                <button className="text-xl w-8 text-center" onClick={() => setSelectedSticker(s.id)}>{s.emoji}</button>
                <div className="flex-1 min-w-0">
                  <Slider label="Size" value={Math.round(s.size * 100)} min={4} max={22} unit="%" onChange={(v) => updateSticker(s.id, { size: v / 100 })} />
                  {selectedSticker === s.id && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Slider label="X" value={Math.round(s.x * 100)} min={0} max={100} unit="%" onChange={(v) => updateSticker(s.id, { x: v / 100 })} />
                      <Slider label="Y" value={Math.round(s.y * 100)} min={0} max={100} unit="%" onChange={(v) => updateSticker(s.id, { y: v / 100 })} />
                    </div>
                  )}
                </div>
                <button className="btn btn-icon btn-ghost btn-sm !w-7 !h-7" onClick={() => removeSticker(s.id)} aria-label="Remove sticker"><X size={13} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
