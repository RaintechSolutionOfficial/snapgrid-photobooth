import { Minus, Plus, Grid3X3 } from 'lucide-react'
import { GRID_PRESETS, TEMPLATES } from '../../utils/constants'
import type { TemplateId } from '../../types'

type Props = {
  rows: number
  cols: number
  template?: TemplateId
  onChange: (rows: number, cols: number) => void
  onTemplateChange?: (template: TemplateId) => void
  disabled?: boolean
}

function Stepper({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="min-w-0">
      <span className="label">{label}</span>
      <div className="flex items-center justify-between gap-1 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] p-1">
        <button className="btn btn-icon btn-ghost btn-sm flex-none" disabled={disabled || value <= 1} onClick={() => onChange(Math.max(1, value - 1))} aria-label={`Decrease ${label}`}>
          <Minus size={14} />
        </button>
        <span className="mono text-lg font-semibold text-[var(--ink)] flex-1 text-center min-w-0">{value}</span>
        <button className="btn btn-icon btn-ghost btn-sm flex-none" disabled={disabled || value >= 10} onClick={() => onChange(Math.min(10, value + 1))} aria-label={`Increase ${label}`}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

/** Miniature live preview of the selected collage template. */
function LayoutPreview({ rows, cols, template }: { rows: number; cols: number; template: TemplateId }) {
  const count = rows * cols
  if (template === 'strip' || template === 'filmstrip') {
    const horizontal = template === 'filmstrip'
    return (
      <div
        className={`grid gap-0.5 ${horizontal ? 'h-9' : 'w-9'}`}
        style={{
          gridTemplateRows: horizontal ? '1fr' : `repeat(${count}, 1fr)`,
          gridTemplateColumns: horizontal ? `repeat(${count}, 1fr)` : '1fr',
        }}
      >
        {Array.from({ length: count }).map((_, i) => <span key={i} className="rounded-[2px] bg-[var(--accent)] opacity-70" />)}
      </div>
    )
  }
  if (template === 'mosaic') {
    return (
      <div className="grid grid-cols-3 gap-0.5 h-12" style={{ gridTemplateRows: '1.4fr 1fr' }}>
        <span className="col-span-3 rounded-[2px] bg-[var(--accent)] opacity-80" />
        {Array.from({ length: Math.min(count - 1, 6) }).map((_, i) => <span key={i} className="rounded-[2px] bg-[var(--accent)] opacity-60" />)}
      </div>
    )
  }
  return (
    <div
      className="grid gap-0.5 h-12"
      style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="rounded-[2px] bg-[var(--accent)] opacity-70"
          style={template === 'polaroid' ? { transform: `rotate(${((i * 37) % 7) - 3}deg)` } : undefined}
        />
      ))}
    </div>
  )
}

export function GridBuilder({ rows, cols, template = 'grid', onChange, onTemplateChange, disabled }: Props) {
  const count = rows * cols
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Stepper label="Rows" value={rows} onChange={(v) => onChange(v, cols)} disabled={disabled} />
        <Stepper label="Columns" value={cols} onChange={(v) => onChange(rows, v)} disabled={disabled} />
      </div>

      <div>
        <span className="label">Presets</span>
        <div className="grid grid-cols-3 gap-1.5">
          {GRID_PRESETS.map((p) => (
            <button
              key={p.label}
              className="chip justify-center !px-2"
              data-active={rows === p.rows && cols === p.cols}
              disabled={disabled}
              onClick={() => onChange(p.rows, p.cols)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="label">Layout</span>
        <div className="grid grid-cols-2 gap-1.5">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`text-left p-2 rounded-xl border transition-colors ${template === t.id ? 'border-[var(--accent)] bg-[var(--accent-soft)]' : 'border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--line-2)]'}`}
              onClick={() => onTemplateChange?.(t.id)}
              title={t.hint}
            >
              <span className={`text-[11px] font-semibold ${template === t.id ? 'text-[var(--accent)]' : 'text-[var(--ink)]'}`}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)] min-w-0">
        <div className="flex-none w-12 flex items-center justify-center"><LayoutPreview rows={rows} cols={cols} template={template} /></div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-1.5"><Grid3X3 size={14} className="text-[var(--accent)] flex-none" /> {count} frames</p>
          <p className="text-[11px] text-[var(--muted)]">{rows} rows × {cols} columns · {TEMPLATES.find((t) => t.id === template)?.name}</p>
        </div>
      </div>
    </div>
  )
}
