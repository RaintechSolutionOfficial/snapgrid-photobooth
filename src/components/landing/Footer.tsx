import { Link } from 'react-router-dom'
import { ArrowUp, Camera } from 'lucide-react'

const productLinks = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#faq', label: 'FAQ' },
]

const resourceLinks = [
  { to: '/studio', label: 'Launch Studio' },
  { href: '#faq', label: 'Privacy & data' },
  { href: '#how', label: 'Getting started' },
]

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--surface)] pt-16">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Snapgrid home">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--grad)] text-white">
                <Camera size={18} strokeWidth={2.4} />
              </span>
              <span className="wordmark text-[19px] text-[var(--ink)]">
                snap<span className="text-[var(--accent)]">grid</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-[var(--muted)]">
              Every moment, perfectly framed. A private, playful photobooth studio that lives right in your browser.
            </p>
          </div>

          <div>
            <h3 className="mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">Product</h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[14px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink)]">Resources</h3>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((link) =>
                link.to ? (
                  <li key={link.label}>
                    <Link to={link.to} className="text-[14px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a href={link.href} className="text-[14px] text-[var(--muted)] transition-colors hover:text-[var(--accent)]">
                      {link.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 overflow-hidden border-t border-[var(--line)] pt-8">
          <div className="wordmark select-none text-[clamp(3.5rem,17vw,13rem)] leading-[0.8] tracking-[-0.07em] text-[var(--wash-1)]">
            snapgrid
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-[var(--line)] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[var(--muted)]">
            © {new Date().getFullYear()} Snapgrid. Built with the BrewedOps Motion Library design language.
          </p>
          <button type="button" onClick={scrollToTop} className="btn btn-ghost btn-sm self-start">
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}
