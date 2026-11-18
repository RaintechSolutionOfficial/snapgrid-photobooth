import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Camera, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How it works' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#faq', label: 'FAQ' },
]

export default function Nav() {
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled ? 'glass shadow-[0_8px_30px_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link to="/" onClick={close} className="group flex items-center gap-2.5" aria-label="Snapgrid home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--grad)] text-white shadow-[0_4px_14px_rgba(10,108,255,0.32)] transition-transform duration-300 group-hover:rotate-6">
            <Camera size={18} strokeWidth={2.4} />
          </span>
          <span className="wordmark text-[19px] text-[var(--ink)]">
            snap<span className="text-[var(--accent)]">grid</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[13px] font-medium text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="btn btn-icon btn-ghost"
          >
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
          <Link to="/studio" className="btn btn-primary btn-sm btn-shine hidden sm:inline-flex">
            Launch Studio <ArrowRight size={15} />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="btn btn-icon btn-ghost md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <div className="accordion-body md:hidden" data-open={open}>
        <div>
          <div className="mx-4 mb-3 rounded-2xl border border-[var(--line)] bg-[var(--glass)] p-2 backdrop-blur-xl">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="block rounded-xl px-4 py-3 text-sm font-medium text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
              >
                {link.label}
              </a>
            ))}
            <Link to="/studio" onClick={close} className="btn btn-primary mt-1 w-full">
              Launch Studio <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
