import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Camera, Check, Grid3X3, Play, Repeat2, Video } from 'lucide-react'
import type { Mode } from '../../types'

type ModeInfo = {
  id: Mode
  name: string
  Icon: LucideIcon
  title: string
  description: string
  points: string[]
}

const modes: ModeInfo[] = [
  {
    id: 'photo',
    name: 'Photo',
    Icon: Camera,
    title: 'One perfect shot',
    description: 'The classic. Frame it, count down, and capture a single high-quality still with all your styling applied.',
    points: ['Instant countdown', 'Filters & adjustments', 'Frames, text & stickers'],
  },
  {
    id: 'grid',
    name: 'Grid',
    Icon: Grid3X3,
    title: 'A strip of memories',
    description: 'Chain shots together into a custom grid — from a tidy 2×2 to a wall of 100 tiny moments.',
    points: ['Any size from 1×1 to 10×10', 'Adjustable interval between shots', 'Exports as one composite image'],
  },
  {
    id: 'video',
    name: 'Video',
    Icon: Video,
    title: 'Motion, captured',
    description: 'Record a short clip with the exact look you configured, ready to download and relive.',
    points: ['Short-form recording', 'Same filters as photo mode', 'One-click download'],
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    Icon: Repeat2,
    title: 'Play it forward, then back',
    description: 'Capture a burst and watch it ping-pong in a loop — the crowd-pleaser for any celebration.',
    points: ['Burst capture', 'Automatic ping-pong loop', 'Endless replay value'],
  },
]

const miniGradients = [
  'linear-gradient(140deg,#ffb199,#ff0844)',
  'linear-gradient(140deg,#a1c4fd,#5b86e5)',
  'linear-gradient(140deg,#fbc2eb,#a18cd1)',
  'linear-gradient(140deg,#84fab0,#8fd3f4)',
  'linear-gradient(140deg,#f6d365,#fda085)',
  'linear-gradient(140deg,#a8edea,#fed6e3)',
  'linear-gradient(140deg,#ffecd2,#fcb69f)',
  'linear-gradient(140deg,#d4fc79,#96e6a1)',
  'linear-gradient(140deg,#c2e9fb,#81a4fd)',
]

function Preview({ mode }: { mode: Mode }) {
  if (mode === 'grid') {
    return (
      <div className="grid h-full w-full max-w-[300px] grid-cols-3 gap-1.5 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
        {miniGradients.map((grad, i) => (
          <div key={i} className="rounded-lg shadow-sm" style={{ background: grad }} />
        ))}
      </div>
    )
  }
  if (mode === 'video') {
    return (
      <div
        className="relative grid h-[220px] w-full max-w-[300px] place-items-center overflow-hidden rounded-2xl border border-[var(--line)]"
        style={{ background: miniGradients[1] }}
      >
        <span className="grid h-14 w-14 place-items-center rounded-full bg-black/30 text-white backdrop-blur">
          <Play size={24} fill="currentColor" />
        </span>
        <span className="mono absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> REC
        </span>
        <span className="mono absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white">00:08</span>
      </div>
    )
  }
  if (mode === 'boomerang') {
    return (
      <div className="relative grid h-[220px] w-full max-w-[300px] place-items-center">
        <div
          className="absolute h-[170px] w-[180px] rotate-[8deg] rounded-2xl border border-[var(--line)] opacity-70 shadow-[var(--shadow-card)]"
          style={{ background: miniGradients[2] }}
        />
        <div
          className="relative grid h-[170px] w-[180px] place-items-center rounded-2xl border border-[var(--line)] shadow-[var(--shadow-card-hover)]"
          style={{ background: miniGradients[4] }}
        >
          <Repeat2 size={30} className="text-white drop-shadow" />
        </div>
        <span className="absolute bottom-0 inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[10px] font-semibold text-[var(--accent)] shadow-[var(--shadow-pill)]">
          <Repeat2 size={11} /> loop
        </span>
      </div>
    )
  }
  return (
    <div
      className="relative grid h-[220px] w-full max-w-[300px] place-items-center overflow-hidden rounded-2xl border border-[var(--line)] shadow-[var(--shadow-card)]"
      style={{ background: miniGradients[0] }}
    >
      <Camera size={56} className="text-white drop-shadow-sm" strokeWidth={1.6} />
      <span className="mono absolute left-3 top-3 rounded-full bg-black/35 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
        1 / 1
      </span>
    </div>
  )
}

export default function ModeShowcase() {
  const [active, setActive] = useState(0)
  const current = modes[active]

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="reveal mb-10 max-w-2xl">
          <span className="mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Four ways to play
          </span>
          <h2 className="wordmark mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight text-[var(--ink)]">
            Pick a mode, make it yours
          </h2>
        </div>

        <div className="reveal card overflow-hidden rounded-[24px]">
          <div className="relative grid grid-cols-4 rounded-none border-b border-[var(--line)] bg-[var(--surface-2)] p-1">
            <span
              className="absolute bottom-1 top-1 rounded-full bg-[var(--surface)] shadow-[var(--shadow-pill)] transition-all duration-500 ease-[var(--spring)]"
              style={{ left: `calc(${active} * 25% + 4px)`, width: 'calc(25% - 8px)' }}
            />
            {modes.map((mode, index) => {
              const Icon = mode.Icon
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={active === index}
                  aria-label={`${mode.name} mode`}
                  className={`relative z-10 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors duration-300 sm:text-[14px] ${
                    active === index ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink-2)]'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{mode.name}</span>
                </button>
              )
            })}
          </div>

          <div className="grid items-center gap-8 p-7 sm:p-10 md:grid-cols-2 md:gap-12">
            <div key={current.id} className="count-pop flex min-h-[240px] items-center justify-center rounded-[20px] bg-[var(--surface-2)] p-6">
              <Preview mode={current.id} />
            </div>

            <div key={`${current.id}-copy`} className="count-pop">
              <span className="mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                {current.name} mode
              </span>
              <h3 className="wordmark mt-2 text-[28px] leading-tight text-[var(--ink)] sm:text-[32px]">{current.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">{current.description}</p>
              <ul className="mt-6 space-y-3">
                {current.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-[14px] text-[var(--ink-2)]">
                    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
