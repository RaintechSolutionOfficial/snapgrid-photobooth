import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Is my camera footage private?',
    a: 'Completely. Everything happens in your browser — photos and video never leave your device. There are no uploads, no servers storing your shots, and no accounts to sign in to.',
  },
  {
    q: 'Where are my photos saved?',
    a: 'Your captures are kept in an on-device gallery powered by local storage, so they’re there when you come back. You can revisit, download or remove them at any time from the studio.',
  },
  {
    q: 'How big can I make a grid?',
    a: 'Anywhere from a single 1×1 shot up to a 10×10 mosaic — 100 tiles in one composite. Pick a preset or set rows and columns by hand, and preview the layout live before you shoot.',
  },
  {
    q: 'What can I download?',
    a: 'Save an individual PNG, export the whole session as a ZIP, generate a QR code for instant sharing, or send the strip straight to a printer. It’s your moment — take it however you like.',
  },
  {
    q: 'Which capture modes are available?',
    a: 'Four: Photo for a single styled still, Grid for multi-shot composites, Video for a short clip, and Boomerang for a fun ping-pong loop. All of them share the same filters and styling controls.',
  },
  {
    q: 'Do I need to sign up?',
    a: 'No. Snapgrid works the moment you open it. No account, no setup wizard, no waiting — just launch the studio and start capturing.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-24 bg-[var(--surface-2)] py-20 sm:py-28">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8">
        <div className="reveal mb-12 text-center">
          <span className="mono text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Good to know
          </span>
          <h2 className="wordmark mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight text-[var(--ink)]">
            Questions, answered
          </h2>
        </div>

        <div className="card overflow-hidden rounded-[20px] p-2 sm:p-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index
            return (
              <div key={faq.q} className="reveal border-b border-[var(--line)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-4 py-5 text-left transition-colors hover:bg-[var(--surface-2)] sm:px-5"
                >
                  <span className="text-[15px] font-semibold text-[var(--ink)] sm:text-[16px]">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[var(--accent)] transition-transform duration-300 ease-[var(--spring)] ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div className="accordion-body" data-open={isOpen}>
                  <div>
                    <p className="px-4 pb-5 text-[14px] leading-relaxed text-[var(--muted)] sm:px-5 sm:text-[15px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
