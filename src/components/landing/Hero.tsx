import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Droplets, Leaf, Play, Sparkles, Sun, type LucideIcon } from 'lucide-react'

const tiles: { grad: string; icon: LucideIcon; label: string }[] = [
  { grad: 'linear-gradient(140deg,#ffb199,#ff0844)', icon: Sun, label: 'Golden hour' },
  { grad: 'linear-gradient(140deg,#a1c4fd,#5b86e5)', icon: Droplets, label: 'Blue hour' },
  { grad: 'linear-gradient(140deg,#fbc2eb,#a18cd1)', icon: Sparkles, label: 'Soft glow' },
  { grad: 'linear-gradient(140deg,#84fab0,#8fd3f4)', icon: Leaf, label: 'Fresh cut' },
]

const quickStats = [
  ['4', 'capture modes'],
  ['10×10', 'max grid'],
  ['100%', 'on-device'],
]

export default function Hero() {
  return (
    <section className="mesh-bg relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28 lg:pt-40 lg:pb-32">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -top-40 left-1/3 h-80 w-80 rounded-full bg-[var(--wash-0)] opacity-40 blur-[100px]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12">
        <div className="max-w-2xl">
          <div className="reveal is-visible glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-[var(--accent-ink)] shadow-[var(--shadow-pill)]">
            <Sparkles size={14} className="text-[var(--accent)]" />
            The photobooth studio
            <span className="h-1 w-1 rounded-full bg-[var(--line-2)]" />
            <span className="mono text-[var(--muted)]">v1.0</span>
          </div>

          <h1 className="wordmark text-[clamp(2.7rem,7vw,5.4rem)] leading-[0.96] text-[var(--ink)]">
            <span className="line-mask">
              <span className="line-inner" style={{ animationDelay: '80ms' }}>
                Every moment,
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner text-[var(--accent)]" style={{ animationDelay: '200ms' }}>
                perfectly framed.
              </span>
            </span>
          </h1>

          <p className="line-mask mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--muted)] sm:text-lg">
            <span className="line-inner" style={{ animationDelay: '320ms' }}>
              Snapgrid turns your camera into a beautiful, fully customizable photobooth — build any grid,
              add filters and frames, and walk away with keepsakes in seconds.
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link to="/studio" className="btn btn-primary btn-shine px-6 py-3 text-[15px]">
              Launch Studio <ArrowRight size={17} />
            </Link>
            <a href="#how" className="btn btn-ghost px-6 py-3 text-[15px]">
              <Play size={15} fill="currentColor" /> See how it works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
            {quickStats.map(([value, label]) => (
              <div key={label} className="flex items-center gap-2">
                <span className="mono text-sm font-semibold text-[var(--ink)]">{value}</span>
                <span className="text-[13px] text-[var(--muted)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md justify-center py-6 sm:py-10">
          <div className="absolute inset-6 rounded-[36px] bg-[var(--grad)] opacity-20 blur-[70px]" />

          <div className="float relative w-[248px] rotate-[-2deg] rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card-hover)] sm:w-[272px]">
            <div className="mb-2.5 flex items-center justify-between px-1.5 pt-1">
              <span className="mono text-[10px] font-semibold tracking-[0.18em] text-[var(--muted)]">SNAPGRID</span>
              <span className="mono text-[10px] text-[var(--muted)]">04 SHOTS</span>
            </div>

            <div className="flex flex-col gap-2">
              {tiles.map((tile) => (
                <div
                  key={tile.label}
                  className="relative flex h-[86px] items-center justify-center overflow-hidden rounded-[14px] sm:h-[96px]"
                  style={{ background: tile.grad }}
                >
                  <tile.icon size={30} className="text-white drop-shadow-sm" strokeWidth={1.8} />
                  <span className="absolute bottom-1.5 left-2 rounded-full bg-black/20 px-2 py-0.5 text-[9px] font-medium text-white backdrop-blur-sm">
                    {tile.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between px-1.5 pb-1">
              <span className="wordmark text-[11px] text-[var(--ink-2)]">say cheese!</span>
              <span className="chip px-2.5 py-1 text-[10px]">1×1 → 10×10</span>
            </div>

            <div className="absolute -right-12 top-16 sm:-right-16">
              <span className="pulse-ring absolute inset-0 rounded-full bg-[var(--wash-0)]" />
              <div className="glass relative flex items-center gap-1.5 rounded-full px-3.5 py-2 shadow-[var(--shadow-pill)]">
                <Camera size={14} className="text-[var(--accent)]" />
                <span className="mono text-[12px] font-semibold text-[var(--ink)]">3…2…1</span>
              </div>
            </div>
          </div>

          <div className="float-slow absolute bottom-2 left-0 sm:bottom-4 sm:left-2">
            <div className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-[var(--shadow-pill)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
              <span className="text-[12px] font-semibold text-[var(--ink-2)]">Ready when you are</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
