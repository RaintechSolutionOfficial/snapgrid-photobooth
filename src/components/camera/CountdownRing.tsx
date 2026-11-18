import { useEffect, useState } from 'react'

export function CountdownRing({ value }: { value: number }) {
  const [progress, setProgress] = useState(1)

  useEffect(() => {
    setProgress(1)
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const remaining = Math.max(0, 1 - (now - start) / 1000)
      setProgress(remaining)
      if (remaining > 0) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  const circumference = 2 * Math.PI * 54

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="5" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#4fa3ff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 80ms linear' }}
          />
        </svg>
        <span key={value} className="count-pop text-white text-6xl font-bold wordmark">{value}</span>
      </div>
      <p className="absolute bottom-[28%] text-white/70 text-xs font-medium tracking-[0.2em] uppercase">Get ready</p>
    </div>
  )
}
