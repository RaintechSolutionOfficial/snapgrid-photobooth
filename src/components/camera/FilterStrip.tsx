import { FILTERS } from '../../utils/constants'

type Props = {
  value: string
  onChange: (id: string) => void
}

export function FilterStrip({ value, onChange }: Props) {
  return (
    <div>
      <span className="label">Filter preset</span>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className="group flex flex-col items-center gap-1.5 flex-none"
            onClick={() => onChange(f.id)}
            title={f.name}
          >
            <span
              className={`w-14 h-14 rounded-xl border-2 transition-all duration-300 ${value === f.id ? 'border-[var(--accent)] scale-105 shadow-[0_4px_14px_rgba(10,108,255,.25)]' : 'border-transparent hover:border-[var(--line-2)]'}`}
              style={{
                background: 'linear-gradient(135deg,#f0a97a 0%,#6b8fd6 45%,#2b3a55 100%)',
                filter: f.css === 'none' ? undefined : f.css,
              }}
            />
            <span className={`text-[10px] font-medium ${value === f.id ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}>{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
