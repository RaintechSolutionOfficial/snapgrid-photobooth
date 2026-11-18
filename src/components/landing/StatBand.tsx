import { useEffect, useRef, useState } from 'react'

type CountUpProps = {
  value: number
  start: boolean
  duration?: number
}

function CountUp({ value, start, duration = 1400 }: CountUpProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!start) return
    let frame = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, start, duration])

  return <>{current}</>
}

const stats: { value: number; suffix: string; label: string; infinity?: boolean }[] = [
  { value: 100, suffix: '', label: 'grid combinations' },
  { value: 4, suffix: '', label: 'capture modes' },
  { value: 25, suffix: '+', label: 'creative features' },
  { value: 0, suffix: '', label: 'moments captured', infinity: true },
]

export default function StatBand() {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (!('IntersectionObserver' in window)) {
      setStarted(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)]">
      <div ref={ref} className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-8 px-5 py-12 sm:px-8 lg:grid-cols-4 lg:px-12 lg:py-14">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="reveal flex flex-col items-center text-center lg:border-l lg:border-[var(--line)] lg:first:border-l-0"
          >
            <div className="mono text-[clamp(2.2rem,5vw,3.2rem)] font-semibold leading-none tracking-tight text-[var(--ink)]">
              {stat.infinity ? (
                <span className="text-[var(--accent)]">∞</span>
              ) : (
                <>
                  <CountUp value={stat.value} start={started} />
                  {stat.suffix}
                </>
              )}
            </div>
            <div className="mt-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
