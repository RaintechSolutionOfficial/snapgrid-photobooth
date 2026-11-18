import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

const phrase = 'OPEN THE BOOTH  ✦  EVERY MOMENT, PERFECTLY FRAMED  ✦  '

function MarqueeGroup() {
  return (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className="whitespace-pre px-2 text-[clamp(1.4rem,3vw,2.4rem)] font-extrabold uppercase tracking-tight text-white/25">
          {phrase}
        </span>
      ))}
    </span>
  )
}

export default function CTABand() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20" style={{ background: 'var(--grad)' }}>
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" />

      <div className="marquee-track pointer-events-none absolute inset-y-0 flex items-center">
        <MarqueeGroup />
        <MarqueeGroup />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-5 text-center sm:px-8 lg:px-12">
        <span className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white/90">
          <Sparkles size={14} /> Your booth is ready
        </span>
        <h2 className="wordmark max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-white drop-shadow-sm">
          Let’s make something worth remembering
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/85">
          No signup, no setup. Open the studio and your camera becomes a photobooth in one click.
        </p>
        <Link
          to="/studio"
          className="btn magnetic mt-8 px-8 py-4 text-[16px] font-bold shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
          style={{ background: '#ffffff', color: 'var(--accent)' }}
        >
          Open the booth <ArrowRight size={19} />
        </Link>
      </div>
    </section>
  )
}
