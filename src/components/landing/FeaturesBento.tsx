import type { LucideIcon } from 'lucide-react'
import {
  Download,
  Grid3X3,
  Images,
  LayoutTemplate,
  Repeat2,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Timer,
  Wand2,
} from 'lucide-react'

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  className?: string
  delay?: string
}

const features: Feature[] = [
  {
    title: 'Grid builder up to 10×10',
    description: 'Dial in exactly the layout you want — from a single shot to a hundred-tile mosaic. Live preview, perfect spacing, every time.',
    icon: Grid3X3,
    className: 'sm:col-span-2 lg:row-span-2',
    delay: 'reveal-delay-1',
  },
  {
    title: 'Countdown & beeps',
    description: 'A clear 3…2…1 with optional sounds and flash so everyone knows when to smile.',
    icon: Timer,
    delay: 'reveal-delay-1',
  },
  {
    title: 'Filters & adjustments',
    description: 'Eight film-inspired looks plus brightness, contrast and saturation controls.',
    icon: SlidersHorizontal,
    delay: 'reveal-delay-2',
  },
  {
    title: 'Frames, text & stickers',
    description: 'Layer event titles, captions, dates and emoji stickers onto every strip.',
    icon: Wand2,
    delay: 'reveal-delay-2',
  },
  {
    title: 'Try-on effects & emojis',
    description: 'Sombreros, caps, cat ears, crowns, sunglasses and dozens more — drag them onto the preview and let each shot wear its own look.',
    icon: Sparkles,
    delay: 'reveal-delay-3',
  },
  {
    title: 'Templates & backdrops',
    description: 'Grid, strip, filmstrip, mosaic or scattered polaroids. Add ten themed backgrounds and make every collage one of a kind.',
    icon: LayoutTemplate,
    delay: 'reveal-delay-3',
  },
  {
    title: 'Gallery saved locally',
    description: 'Every keepsake lands in an on-device gallery you can revisit anytime.',
    icon: Images,
    delay: 'reveal-delay-3',
  },
  {
    title: 'Download PNG, ZIP, QR & print',
    description: 'Share instantly: save a single image, a full ZIP, a scannable QR code, or send it straight to the printer.',
    icon: Download,
    className: 'sm:col-span-2',
    delay: 'reveal-delay-3',
  },
  {
    title: 'Privacy by default',
    description: 'Photos never leave your device. No uploads, no accounts, no tracking.',
    icon: ShieldCheck,
    delay: 'reveal-delay-4',
  },
  {
    title: 'Four capture modes',
    description: 'Photo, Grid, Video and Boomerang — one booth, endless ways to play.',
    icon: Repeat2,
    delay: 'reveal-delay-4',
  },
]

const mosaic = [
  'linear-gradient(140deg,#ffb199,#ff0844)',
  'linear-gradient(140deg,#a1c4fd,#5b86e5)',
  'linear-gradient(140deg,#fbc2eb,#a18cd1)',
  'linear-gradient(140deg,#84fab0,#8fd3f4)',
  'linear-gradient(140deg,#f6d365,#fda085)',
  'linear-gradient(140deg,#c2e9fb,#81a4fd)',
  'linear-gradient(140deg,#ffecd2,#fcb69f)',
  'linear-gradient(140deg,#a8edea,#fed6e3)',
  'linear-gradient(140deg,#d4fc79,#96e6a1)',
]

export default function FeaturesBento() {
  return (
    <section id="features" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="reveal mb-12 max-w-2xl">
          <span className="mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Everything you need
          </span>
          <h2 className="wordmark mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight text-[var(--ink)]">
            A booth that bends to <span className="text-shine">your imagination</span>
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-[var(--muted)]">
            Powerful under the hood, effortless in the moment. Every detail is tuned for the shot you’re actually
            trying to get.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isBuilder = index === 0
            return (
              <article
                key={feature.title}
                className={`card card-hover reveal ${feature.delay ?? ''} flex flex-col rounded-[20px] p-6 ${feature.className ?? ''}`}
              >
                <div className="grid h-11 w-11 place-items-center rounded-[13px] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Icon size={21} strokeWidth={2} />
                </div>
                <h3 className={`mt-5 font-semibold tracking-tight text-[var(--ink)] ${isBuilder ? 'text-xl' : 'text-[15px]'}`}>
                  {feature.title}
                </h3>
                <p className={`mt-2 leading-relaxed text-[var(--muted)] ${isBuilder ? 'text-[15px]' : 'text-[13px]'}`}>
                  {feature.description}
                </p>

                {isBuilder && (
                  <div className="relative mt-auto flex flex-1 items-center justify-center pt-8">
                    <div className="grid w-full max-w-[300px] grid-cols-5 gap-1.5 rounded-2xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
                      {mosaic.map((grad, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-md shadow-sm"
                          style={{ background: grad }}
                        />
                      ))}
                    </div>
                    <span className="mono absolute bottom-2 right-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-2.5 py-1 text-[10px] font-semibold text-[var(--accent)] shadow-[var(--shadow-pill)]">
                      10 × 10
                    </span>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
