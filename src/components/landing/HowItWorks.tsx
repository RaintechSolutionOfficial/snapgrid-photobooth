import type { LucideIcon } from 'lucide-react'
import { Camera, Download, Grid3X3 } from 'lucide-react'

type Step = {
  number: string
  title: string
  description: string
  icon: LucideIcon
  delay: string
}

const steps: Step[] = [
  {
    number: '01',
    title: 'Pick your grid',
    description: 'Choose a mode, set rows and columns, and style the strip with filters, frames and text.',
    icon: Grid3X3,
    delay: 'reveal-delay-1',
  },
  {
    number: '02',
    title: 'Countdown & capture',
    description: 'Hit start, watch the countdown, and let the booth fire off every shot with perfect timing.',
    icon: Camera,
    delay: 'reveal-delay-2',
  },
  {
    number: '03',
    title: 'Download & share',
    description: 'Grab a PNG or ZIP, generate a QR code, or print the strip — straight from the gallery.',
    icon: Download,
    delay: 'reveal-delay-3',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 bg-[var(--surface-2)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="reveal mb-14 text-center">
          <span className="mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Three steps
          </span>
          <h2 className="wordmark mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight text-[var(--ink)]">
            From setup to smile in seconds
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--muted)]">
            No learning curve. No fuss. Just a few taps between you and the perfect strip.
          </p>
        </div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-7 hidden h-px bg-[var(--line-2)] md:block" />

          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className={`reveal ${step.delay} relative flex flex-col items-center text-center`}>
                <div className="relative z-10 grid h-14 w-14 place-items-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-card)]">
                  <Icon size={23} strokeWidth={2} />
                  <span className="mono absolute -right-3 -top-3 grid h-7 w-7 place-items-center rounded-full bg-[var(--grad)] text-[10px] font-bold text-white shadow-[0_4px_12px_rgba(10,108,255,0.3)]">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
                <p className="mt-2 max-w-xs text-[14px] leading-relaxed text-[var(--muted)]">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
