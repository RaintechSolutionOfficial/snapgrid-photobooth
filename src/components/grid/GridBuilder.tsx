import { Minus, Plus, Grid3X3 } from 'lucide-react'
import { GRID_PRESETS, TEMPLATES } from '../../utils/constants'
import type { TemplateId } from '../../types'
import { computeLayout } from '../../utils/composite'

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

/** Miniature preview driven by the exact same layout as the camera and final collage. */
function LayoutPreview({ rows, cols, template }: { rows: number; cols: number; template: TemplateId }) {
  const count = rows * cols
  const { cells, aspect } = computeLayout(template, rows, cols, count)
  return (
    <div className="relative w-12" style={{ aspectRatio: Math.min(2.1, Math.max(0.85, aspect)) }}>
      {cells.slice(0, count).map((cell, i) => (
        <span
          key={i}
          className="absolute rounded-[2px] bg-[var(--accent)]"
          style={{
            left: `${cell.x * 100}%`,
            top: `${cell.y * 100}%`,
            width: `${cell.w * 100}%`,
            height: `${cell.h * 100}%`,
            opacity: i === 0 ? 0.85 : 0.6,
            transform: cell.rotation ? `rotate(${cell.rotation}deg)` : undefined,
          }}
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
