import { useEffect, useMemo, useRef, useState, type CSSProperties, type RefObject, type PointerEvent as ReactPointerEvent } from 'react'
import { Camera, CameraOff, RotateCcw, Maximize, Minimize, SwitchCamera, Sparkles, Loader2, Check, ScanFace, Images } from 'lucide-react'
import type { Accessory, Settings } from '../../types'
import type { CameraState } from '../../hooks/useCamera'
import { drawDemoFrame, renderFrame } from '../../utils/videoEffects'
import { computeLayout } from '../../utils/composite'
import { CountdownRing } from './CountdownRing'
import { FrameOverlay } from './FrameOverlay'
import type { CapturePhase } from '../../hooks/useCapture'

type Props = {
  videoRef: RefObject<HTMLVideoElement>
  cameraState: CameraState
  error: string
  settings: Settings
  accessories: Accessory[]
  focusedId: string | null
  faceTracked: boolean
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
  accessories,
  focusedId,
  faceTracked,
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
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const dragRef = useRef<string | null>(null)
  const renderOpts = useRef({
    effectId: settings.effectId,
    filter: settings.filter,
    brightness: settings.brightness,
    contrast: settings.contrast,
    saturation: settings.saturation,
    mirror: settings.mirror && facingMode === 'user',
  })
  renderOpts.current = {
    effectId: settings.effectId,
    filter: settings.filter,
    brightness: settings.brightness,
    contrast: settings.contrast,
    saturation: settings.saturation,
    mirror: settings.mirror && facingMode === 'user',
  }

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>, id: string) => {
    if (faceTracked) return
    e.stopPropagation()
    dragRef.current = id
    e.currentTarget.setPointerCapture(e.pointerId)
    onAccessorySelect(id)
  }
  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current || !viewportRef.current || faceTracked) return
    const rect = viewportRef.current.getBoundingClientRect()
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    const y = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
    onAccessoryMove(dragRef.current, x, y)
  }
  const handlePointerUp = () => { dragRef.current = null }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen().catch(() => undefined)
      setFullscreen(true)
    } else {
      void document.exitFullscreen().catch(() => undefined)
      setFullscreen(false)
    }
  }

  // One render loop drives the live viewfinder. Capture reuses the same renderer.
  useEffect(() => {
    let raf = 0
    const loop = (time: number) => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (ctx && canvas) {
        const o = renderOpts.current
        if (cameraState === 'ready' && videoRef.current?.videoWidth) {
          renderFrame(ctx, videoRef.current, { ...o, accessories: [], time }, canvas.width, canvas.height)
        } else {
          drawDemoFrame(ctx, canvas.width, canvas.height, time)
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [cameraState, videoRef])

  const ready = cameraState === 'ready'
  const recording = phase === 'recording'
  const gridMode = activeMode === 'grid' && settings.rows > 1

  // The camera uses the same normalized layout as the final collage, so every
  // template (strip, filmstrip, mosaic, polaroid…) is visible while shooting.
  const layout = useMemo(
    () => gridMode
      ? computeLayout(settings.template, settings.rows, settings.cols, settings.rows * settings.cols)
      : { cells: [{ x: 0, y: 0, w: 1, h: 1, rotation: 0 }], aspect: 4 / 3 },
    [gridMode, settings.template, settings.rows, settings.cols],
  )
  const gridCount = layout.cells.length
  const captured = Math.min(gridShots.length, gridCount)
  // Follow the shot being taken; at rest the preview sits in the first cell.
  const activeCell = phase === 'idle' ? 0 : Math.min(currentIndex, gridCount - 1)
  const activeRect = layout.cells[activeCell] ?? layout.cells[0]
  const cellStyle = (c: { x: number; y: number; w: number; h: number; rotation: number }): CSSProperties => ({
    left: `${c.x * 100}%`,
    top: `${c.y * 100}%`,
    width: `${c.w * 100}%`,
    height: `${c.h * 100}%`,
    transform: c.rotation ? `rotate(${c.rotation}deg)` : undefined,
  })
  const frameCaption = settings.eventTitle || settings.caption || 'snapgrid'

  return (
    <div className="camera-stage relative w-full h-full min-h-[320px] rounded-[24px] border border-[var(--line-2)] shadow-[var(--shadow-card)] overflow-hidden [container-type:inline-size]">
      {/* Template layout: normalized cells from the same function that builds the final collage. */}
      <div className="absolute" style={{ inset: gridMode ? '3.5%' : 0 }}>
        {/* Live camera + effects, wrapped in the selected paper frame */}
        <div
          className={`absolute ${gridMode ? 'rounded-lg' : ''}`}
          style={{ ...cellStyle(activeRect), zIndex: 5 }}
        >
          <FrameOverlay frame={settings.frame} caption={frameCaption} interactive windowRef={viewportRef}>
            <div className="absolute inset-0 [container-type:inline-size] bg-[#0a0d14]">
              {/* Hidden source — the visible canvas is the single rendered pipeline */}
              <video ref={videoRef} playsInline muted autoPlay className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" />
              <canvas ref={canvasRef} width={1280} height={960} className="camera-video absolute inset-0" />

              {/* Soft vignette + top gradient so controls stay readable */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,.42) 0%, transparent 22%, transparent 72%, rgba(0,0,0,.55) 100%)' }} />

              {/* Live system only — no generated demo frames when the camera is unavailable */}
              {!ready && cameraState !== 'loading' && (
                gridMode ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-center text-white/70" title={error}>
                    <CameraOff size={18} />
                    <span className="mono text-[9px] tracking-widest">CAMERA OFF</span>
                    <button className="btn btn-sm btn-primary !py-1 !px-2" onClick={onRetry}><RotateCcw size={11} /> Retry</button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center dot-grid">
                    <div className="relative text-center px-6">
                      <div className="mx-auto w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
                        <CameraOff size={26} className="text-white/70" />
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">
                        {cameraState === 'denied' ? 'Camera access needed' : cameraState === 'unsupported' ? 'Camera not supported' : 'Camera unavailable'}
                      </h3>
                      <p className="text-white/60 text-sm max-w-xs mx-auto mb-4 leading-relaxed">
                        {error || 'Enable camera access to use the live booth.'}
                      </p>
                      <button className="btn btn-sm btn-primary mx-auto" onClick={onRetry}>
                        <RotateCcw size={14} /> Try again
                      </button>
                    </div>
                  </div>
                )
              )}

              {cameraState === 'loading' && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0d14]/75">
                  <Loader2 size={gridMode ? 20 : 30} className="animate-spin text-[var(--accent-2)]" />
                </div>
              )}

              {/* Effect layer — same positions are baked into the captured frame */}
              {accessories.map((acc) => (
                <div
                  key={acc.id}
                  className={`absolute z-10 ${faceTracked && acc.anchor !== 'free' ? 'pointer-events-none' : 'cursor-move'} select-none`}
                  style={{
                    left: `${acc.x * 100}%`,
                    top: `${acc.y * 100}%`,
                    width: `${acc.size * 100}%`,
                    transform: `translate(-50%, -50%) rotate(${acc.rotation}deg)`,
                    filter: focusedId === acc.id ? 'drop-shadow(0 0 6px rgba(79,163,255,.9))' : undefined,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, acc.id)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  title={faceTracked && acc.anchor !== 'free' ? `${acc.name} follows your face` : `Drag to reposition ${acc.name}`}
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

              <div className="scanline absolute inset-0 pointer-events-none opacity-40" />
            </div>
          </FrameOverlay>
        </div>

        {/* Per-shot grid guide — shows captured shots and highlights the next one */}
        {gridMode && ready && layout.cells.map((cell, i) => {
          const shot = gridShots[i]
          const isNext = i === captured && phase !== 'idle'
          const isDone = Boolean(shot)
          const isActive = i === activeCell
          const tone = isDone
            ? 'border-2 border-emerald-400/80 shadow-[0_0_0_1px_rgba(0,0,0,.2)]'
            : isNext
              ? 'border-2 border-[var(--accent-2)] bg-white/5 shadow-[0_0_22px_rgba(79,163,255,.35)]'
              : isActive
                ? 'border border-white/20'
                : 'border border-white/25 bg-black/10'
          return (
            <div
              key={i}
              className={`absolute rounded-lg overflow-hidden transition-all duration-300 pointer-events-none z-[6] ${tone}`}
              style={cellStyle(cell)}
            >
              {shot ? (
                <FrameOverlay frame={settings.frame} caption={frameCaption}>
                  <img src={shot} alt={`Shot ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </FrameOverlay>
              ) : (
                <span className={`absolute top-1.5 left-2 mono text-[10px] font-semibold drop-shadow ${isNext ? 'text-white' : 'text-white/70'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              {isDone && (
                <span className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow">
                  <Check size={12} className="text-white" strokeWidth={3} />
                </span>
              )}
              {isNext && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-white/90 pulse-ring" />
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Progress pill */}
      {gridMode && ready && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[68px] z-[7] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold shadow-lg">
          <Images size={12} /> {captured} / {gridCount} shots
          <span className="w-16 h-1 rounded-full bg-white/20 overflow-hidden">
            <span className="block h-full bg-[var(--accent-2)] rounded-full transition-all duration-300" style={{ width: `${(captured / gridCount) * 100}%` }} />
          </span>
        </div>
      )}

      {/* Face tracking indicator */}
      {faceTracked && ready && accessories.some((a) => a.anchor !== 'free') && (
        <div className="absolute top-4 left-4 z-[8] flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-[10px] font-semibold backdrop-blur border border-emerald-400/20">
          <ScanFace size={12} /> Face tracked
        </div>
      )}

      {countdown !== null && <CountdownRing value={countdown} />}

      {recording && (
        <div className="absolute top-4 left-4 z-[8] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          REC {String(recordedSeconds).padStart(2, '0')}s
        </div>
      )}

      {phase === 'capturing' && total > 0 && (
        <div className="absolute top-4 left-4 z-[8] px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold mono">
          CAPTURING SHOT {currentIndex} / {total}
        </div>
      )}

      {phase === 'finishing' && (
        <div className="absolute top-4 left-4 z-[8] px-3 py-1.5 rounded-full bg-black/55 backdrop-blur text-white text-xs font-semibold flex items-center gap-2">
          <Loader2 size={12} className="animate-spin" /> Building your collage…
        </div>
      )}

      {flash && <div key={String(Date.now())} className="flash-overlay absolute inset-0 bg-white pointer-events-none z-20" />}

      <div className="absolute top-3 right-3 flex gap-2 z-30">
        <button className="btn btn-icon btn-ghost !bg-black/45 !text-white/90 !border-white/10 hover:!bg-black/65" onClick={onSwitchCamera} title="Switch camera" aria-label="Switch camera">
          <SwitchCamera size={17} />
        </button>
        <button className="btn btn-icon btn-ghost !bg-black/45 !text-white/90 !border-white/10 hover:!bg-black/65" onClick={toggleFullscreen} title="Fullscreen" aria-label="Toggle fullscreen">
          {fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 z-20 p-3 sm:p-4 flex items-end justify-between pointer-events-none gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur ${ready ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-white/60'}`}>
            <Camera size={12} /> {ready ? 'LIVE' : cameraState === 'loading' ? 'STARTING' : 'OFFLINE'}
          </span>
          <span className="mono text-[10px] text-white/60 px-2 py-1 rounded-full bg-black/40 backdrop-blur">
            {settings.rows}×{settings.cols} · {settings.effectId.replace(/-/g, ' ').toUpperCase()}
            {gridMode && ` · ${settings.template.toUpperCase()}`}
            {settings.frame !== 'none' && ` · ${settings.frame.toUpperCase()}`}
          </span>
          {accessories.length > 0 && (
            <span className="flex items-center gap-1.5 mono text-[10px] text-white/60 px-2 py-1 rounded-full bg-black/40 backdrop-blur">
              <Sparkles size={11} /> {accessories.length} FX
            </span>
          )}
        </div>
        <span className="flex items-center gap-1.5 mono text-[10px] text-white/50 px-2 py-1 rounded-full bg-black/40 backdrop-blur flex-none">
          <Sparkles size={11} /> SNAPGRID
        </span>
      </div>
    </div>
  )
}
