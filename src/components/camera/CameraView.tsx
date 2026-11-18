import { useEffect, useRef, useState, type RefObject, type PointerEvent as ReactPointerEvent } from 'react'
import { Camera, CameraOff, RotateCcw, Maximize, Minimize, SwitchCamera, Sparkles, Loader2 } from 'lucide-react'
import type { CameraState } from '../../hooks/useCamera'
import type { Settings } from '../../types'
import { FILTER_MAP } from '../../utils/constants'
import { CountdownRing } from './CountdownRing'
import type { CapturePhase } from '../../hooks/useCapture'

type Props = {
  videoRef: RefObject<HTMLVideoElement>
  cameraState: CameraState
  error: string
  settings: Settings
  facingMode: 'user' | 'environment'
  onSwitchCamera: () => void
  onRetry: () => void
  phase: CapturePhase
  countdown: number | null
  currentIndex: number
  total: number
  recordedSeconds: number
  flash: boolean
  gridShots: string[]
  activeMode: string
  onAccessoryMove: (id: string, x: number, y: number) => void
  onAccessorySelect: (id: string) => void
}

export function CameraView({
  videoRef,
  cameraState,
  error,
  settings,
  facingMode,
  onSwitchCamera,
  onRetry,
  phase,
  countdown,
  currentIndex,
  total,
  recordedSeconds,
  flash,
  gridShots,
  activeMode,
  onAccessoryMove,
  onAccessorySelect,
}: Props) {
  const [fullscreen, setFullscreen] = useState(false)
  const [demoTick, setDemoTick] = useState(0)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<string | null>(null)

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation()
    dragRef.current = id
    e.currentTarget.setPointerCapture(e.pointerId)
    onAccessorySelect(id)
  }
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    onAccessoryMove(dragRef.current, x, y)
  }
  const handlePointerUp = () => { dragRef.current = null }

  useEffect(() => {
    const timer = window.setInterval(() => setDemoTick((n) => n + 1), 1200)
    return () => window.clearInterval(timer)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => undefined)
      setFullscreen(true)
    } else {
      void document.exitFullscreen().catch(() => undefined)
      setFullscreen(false)
    }
  }

  const filterCss = `${settings.filter === 'none' ? '' : (FILTER_MAP[settings.filter] ?? '') + ' '}brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`
  const ready = cameraState === 'ready'
  const recording = phase === 'recording'
  const showGridOverlay = activeMode === 'grid' && settings.rows > 1
  const demo = !ready

  return (
    <div ref={stageRef} className="camera-stage relative w-full h-full min-h-[320px] rounded-[22px] border border-[var(--line-2)] shadow-[var(--shadow-card)] overflow-hidden [container-type:inline-size]">
      {/* Live video */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        className="camera-video absolute inset-0"
        style={{
          filter: filterCss,
          transform: settings.mirror && facingMode === 'user' ? 'scaleX(-1)' : undefined,
          opacity: ready ? 1 : 0,
        }}
      />

      {/* Demo placeholder when camera unavailable */}
      {demo && cameraState !== 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center dot-grid" style={{ opacity: 1 }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, rgba(61,139,255,.22), transparent 62%)' }} />
          <div className="relative text-center px-6">
            <div className="mx-auto w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
              <CameraOff size={26} className="text-white/70" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {cameraState === 'denied' ? 'Camera access needed' : cameraState === 'unsupported' ? 'Camera not supported' : 'Demo mode'}
            </h3>
            <p className="text-white/55 text-sm max-w-xs mx-auto mb-4 leading-relaxed">
              {error || 'Allow camera access for live photos — or explore every feature using generated demo frames.'}
            </p>
            <button className="btn btn-sm btn-primary mx-auto" onClick={onRetry}>
              <RotateCcw size={14} /> Try again
            </button>
            <p className="mono text-[10px] text-white/35 mt-3 tracking-widest">DEMO FRAME #{demoTick}</p>
          </div>
        </div>
      )}

      {cameraState === 'loading' && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0d14]/70">
          <div className="text-center text-white/80">
            <Loader2 size={30} className="animate-spin mx-auto mb-3 text-[var(--accent-2)]" />
            <p className="text-sm">Starting camera…</p>
          </div>
        </div>
      )}

      {/* Scanline texture */}
      <div className="scanline absolute inset-0 pointer-events-none opacity-60" />

      {/* Grid overlay guide */}
      {showGridOverlay && ready && (
        <div
          className="absolute pointer-events-none"
          style={{
            inset: '6%',
            display: 'grid',
            gridTemplateRows: `repeat(${settings.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${settings.cols}, 1fr)`,
            gap: 4,
          }}
        >
          {Array.from({ length: settings.rows * settings.cols }).map((_, i) => (
            <div key={i} className="border border-white/20 rounded-sm relative">
              {i < gridShots.length && (
                <img src={gridShots[i]} alt="" className="absolute inset-0 w-full h-full object-cover rounded-sm" />
              )}
              {i === gridShots.length && phase !== 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white/80 pulse-ring" />
                </div>
              )}
              <span className="absolute top-1 left-1.5 mono text-[9px] text-white/70 drop-shadow">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* Draggable effect / accessory layer */}
      {settings.accessories.map((acc) => (
        <div
          key={acc.id}
          className="absolute cursor-move select-none z-10"
          style={{
            left: `${acc.x * 100}%`,
            top: `${acc.y * 100}%`,
            width: `${acc.size * 100}%`,
            transform: `translate(-50%, -50%) rotate(${acc.rotation}deg)`,
          }}
          onPointerDown={(e) => handlePointerDown(e, acc.id)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          title={`Drag to reposition ${acc.name}`}
        >
          {acc.kind === 'emoji' ? (
            <span className="block w-full text-center leading-none" style={{ fontSize: `calc(${acc.size} * 100cqw)` }}>
              {acc.source}
            </span>
          ) : (
            <img src={acc.source} alt={acc.name} className="w-full h-auto drop-shadow-lg pointer-events-none" draggable={false} />
          )}
        </div>
      ))}

      {/* Countdown */}
      {countdown !== null && <CountdownRing value={countdown} />}

      {/* Recording indicator */}
      {recording && (
        <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          REC {String(recordedSeconds).padStart(2, '0')}s
        </div>
      )}

      {/* Capturing indicator */}
      {phase === 'capturing' && total > 0 && (
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold mono">
          SHOT {currentIndex} / {total}
        </div>
      )}

      {/* Flash */}
      {flash && <div key={String(Date.now())} className="flash-overlay absolute inset-0 bg-white pointer-events-none z-20" />}

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-30">
        <button className="btn btn-icon btn-ghost !bg-black/40 !text-white/85 !border-white/10 hover:!bg-black/60" onClick={onSwitchCamera} title="Switch camera" aria-label="Switch camera">
          <SwitchCamera size={17} />
        </button>
        <button className="btn btn-icon btn-ghost !bg-black/40 !text-white/85 !border-white/10 hover:!bg-black/60" onClick={toggleFullscreen} title="Fullscreen" aria-label="Toggle fullscreen">
          {fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
        </button>
      </div>

      {/* Bottom status bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 flex items-end justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur ${ready ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
            <Camera size={12} /> {ready ? 'LIVE' : demo ? 'DEMO' : 'OFFLINE'}
          </span>
          <span className="mono text-[10px] text-white/45 px-2 py-1 rounded-full bg-black/30 backdrop-blur">
            {settings.rows}×{settings.cols} · {settings.filter.toUpperCase()}
          </span>
        </div>
        <span className="flex items-center gap-1.5 mono text-[10px] text-white/45 px-2 py-1 rounded-full bg-black/30 backdrop-blur">
          <Sparkles size={11} /> SNAPGRID
        </span>
      </div>
    </div>
  )
}
