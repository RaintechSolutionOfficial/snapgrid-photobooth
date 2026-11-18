import { Minus, Plus, Grid3X3 } from 'lucide-react'
import { GRID_PRESETS } from '../../utils/constants'

type Props = {
  rows: number
  cols: number
  onChange: (rows: number, cols: number) => void
  disabled?: boolean
}

function Stepper({ label, value, onChange, disabled }: { label: string; value: number; onChange: (v: number) => void; disabled?: boolean }) {
  return (
    <div className="flex-1">
      <span className="label">{label}</span>
      <div className="flex items-center gap-2">
        <button className="btn btn-icon btn-ghost btn-sm" disabled={disabled || value <= 1} onClick={() => onChange(Math.max(1, value - 1))} aria-label={`Decrease ${label}`}>
          <Minus size={14} />
        </button>
        <span className="mono text-lg font-semibold text-[var(--ink)] w-8 text-center">{value}</span>
        <button className="btn btn-icon btn-ghost btn-sm" disabled={disabled || value >= 10} onClick={() => onChange(Math.min(10, value + 1))} aria-label={`Increase ${label}`}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  )
}

export function GridBuilder({ rows, cols, onChange, disabled }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Stepper label="Rows" value={rows} onChange={(v) => onChange(v, cols)} disabled={disabled} />
        <div className="w-px bg-[var(--line)]" />
        <Stepper label="Columns" value={cols} onChange={(v) => onChange(rows, v)} disabled={disabled} />
      </div>

      <div>
        <span className="label">Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {GRID_PRESETS.map((p) => (
            <button
              key={p.label}
              className="chip"
              data-active={rows === p.rows && cols === p.cols}
              disabled={disabled}
              onClick={() => onChange(p.rows, p.cols)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
        <div
          className="grid gap-0.5 flex-none"
          style={{ gridTemplateRows: `repeat(${rows}, 1fr)`, gridTemplateColumns: `repeat(${cols}, 1fr)`, width: 44, height: 44 }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => (
            <div key={i} className="rounded-[2px] bg-[var(--accent)]/70" />
          ))}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[var(--ink)] flex items-center gap-1.5"><Grid3X3 size={14} className="text-[var(--accent)]" /> {rows * cols} frames</p>
          <p className="text-[11px] text-[var(--muted)]">{rows} rows × {cols} columns per session</p>
        </div>
      </div>
    </div>
  )
}
