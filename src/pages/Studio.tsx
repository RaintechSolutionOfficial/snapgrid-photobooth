import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, Camera, Grid3X3, Video, Repeat2, Timer, Settings2, Images, Download,
  QrCode, Printer, Trash2, Sparkles, SwitchCamera, Play, Square, Keyboard, Maximize,
  Sun, Moon, RotateCcw, FileArchive, Wand2, SlidersHorizontal, Layers, Check, Info,
} from 'lucide-react'
import type { Mode } from '../types'
import { MODES, FRAMES, BACKGROUND_THEMES } from '../utils/constants'
import { stageAspect } from '../utils/composite'
import { useTheme } from '../hooks/useTheme'
import { useCamera } from '../hooks/useCamera'
import { useFaceBox } from '../hooks/useFaceBox'
import { resolveAccessories } from '../utils/effects'
import { preloadAccessories } from '../utils/videoEffects'
import { EffectCarousel } from '../components/camera/EffectCarousel'
import { useCapture, type CapturePhase } from '../hooks/useCapture'
import { usePhotoboothStore } from '../store/photoboothStore'
import { CameraView } from '../components/camera/CameraView'
import { FilterStrip } from '../components/camera/FilterStrip'
import { GridBuilder } from '../components/grid/GridBuilder'
import { OverlayControls } from '../components/overlays/OverlayControls'
import { EffectsPanel } from '../components/overlays/EffectsPanel'
import { Slider } from '../components/studio/Slider'
import { Gallery } from '../components/gallery/Gallery'
import { ResultModal } from '../components/studio/ResultModal'
import { downloadDataUrl, stamp, printImage } from '../utils/download'
import { downloadZip } from '../utils/zip'
import { generateQr, shareUrl } from '../utils/qr'

type Panel = 'settings' | 'look' | 'overlay' | 'effects'

const modeIcons: Record<Mode, typeof Camera> = { photo: Camera, grid: Grid3X3, video: Video, boomerang: Repeat2 }

export function Studio() {
  const { theme, toggleTheme } = useTheme()
  const settings = usePhotoboothStore((s) => s.settings)
  const updateSettings = usePhotoboothStore((s) => s.updateSettings)
  const resetSettings = usePhotoboothStore((s) => s.resetSettings)
  const session = usePhotoboothStore((s) => s.session)
  const resetSession = usePhotoboothStore((s) => s.resetSession)
  const captures = usePhotoboothStore((s) => s.captures)

  const [mode, setMode] = useState<Mode>('grid')
  const [panel, setPanel] = useState<Panel>('settings')
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [flash, setFlash] = useState(false)
  const [qr, setQr] = useState<string | null>(null)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [accessoryFocus, setAccessoryFocus] = useState<string | null>(null)
  const [resultOpen, setResultOpen] = useState(false)

  const cam = useCamera()
  const faceTrackingOn = settings.faceAutoPlace && settings.accessories.length > 0 && cam.state === 'ready'
  const { faceBox } = useFaceBox(cam.videoRef, faceTrackingOn, settings.mirror && cam.facingMode === 'user')
  const resolvedAccessories = useMemo(
    () => resolveAccessories(settings.accessories, settings.faceAutoPlace ? faceBox : null),
    [settings.accessories, settings.faceAutoPlace, faceBox],
  )
  const faceTracked = Boolean(faceBox && settings.faceAutoPlace)

  useEffect(() => {
    preloadAccessories(resolvedAccessories)
  }, [resolvedAccessories])

  const triggerFlash = useCallback(() => {
    setFlash(true)
    window.setTimeout(() => setFlash(false), 450)
  }, [])
  const handleCaptureError = useCallback((msg: string) => toast.error(msg), [])

  const capture = useCapture({
    videoRef: cam.videoRef,
    cameraReady: cam.state === 'ready',
    settings,
    accessories: resolvedAccessories,
    onFlash: () => { if (settings.flash) triggerFlash() },
    onError: handleCaptureError,
  })

  const showToast = (msg: string, kind: 'success' | 'error' = 'success') =>
    kind === 'success' ? toast.success(msg) : toast.error(msg)

  // This is a live booth — never fall back to synthetic demo frames.
  const startCapture = () => {
    if (cam.state !== 'ready') {
      toast.error(cam.state === 'denied'
        ? 'Camera permission denied — enable it in your browser.'
        : 'Camera is not ready yet — please wait.')
      return
    }
    void capture.start(mode)
  }

  const isBusy = capture.phase !== 'idle'
  const prevPhase = useRef<CapturePhase>(capture.phase)

  // Show the finished capture automatically when a capture sequence completes.
  useEffect(() => {
    if (prevPhase.current !== 'idle' && capture.phase === 'idle' && session.composite) setResultOpen(true)
    prevPhase.current = capture.phase
  }, [capture.phase, session.composite])

  // Auto-select 1×1 when switching to single-shot modes; restore 2×2 for grid.
  const switchMode = (next: Mode) => {
    if (isBusy) return
    setMode(next)
    setQr(null)
    if (next === 'grid' && settings.rows === 1 && settings.cols === 1) updateSettings({ rows: 2, cols: 2 })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.code === 'Space') {
        e.preventDefault()
        if (!isBusy) startCapture()
      } else if (e.key === 'Escape') {
        if (isBusy) capture.cancel()
      } else if (e.key.toLowerCase() === 'g') setGalleryOpen(true)
      else if (e.key.toLowerCase() === 'f') {
        if (!document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => undefined)
        else void document.exitFullscreen().catch(() => undefined)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [mode, isBusy, startCapture, capture.cancel])

  // Read shared capture id from URL (from QR share)
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('capture')
    if (id) {
      const found = captures.find((c) => c.id === id)
      if (found) showToast('Shared capture link — open the Gallery to view it.')
      else setNotice('This shared capture belongs to another device and is not stored here.')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const previewImage = session.composite ?? session.shots[0] ?? null

  const handleDownloadPng = () => {
    if (!previewImage) return showToast('Capture something first', 'error')
    downloadDataUrl(previewImage, `snapgrid-${stamp()}.png`)
    showToast('PNG downloaded')
  }

  const handleDownloadZip = async () => {
    if (!previewImage) return showToast('Capture something first', 'error')
    const item = captures[0] ?? {
      id: 'current', createdAt: Date.now(), mode, rows: settings.rows, cols: settings.cols,
      frameCount: session.shots.length || 1, image: previewImage, filter: settings.filter, eventTitle: settings.eventTitle,
    }
    await downloadZip(item, previewImage)
    showToast('ZIP downloaded')
  }

  const handleQr = async () => {
    if (!captures[0]) return showToast('Save a capture first', 'error')
    setQr(await generateQr(shareUrl(captures[0].id)))
  }

  const handlePrint = () => {
    if (!previewImage) return showToast('Capture something first', 'error')
    if (!printImage(previewImage, 'Snapgrid Print')) showToast('Allow pop-ups to print', 'error')
  }

  const handleRetake = () => {
    if (isBusy) return
    resetSession()
    setQr(null)
    showToast('Ready for a new session')
  }

  const busyLabel: Record<CapturePhase, string> = {
    idle: '', countdown: 'Get ready…', capturing: 'Capturing…', recording: 'Recording…', finishing: 'Building collage…',
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 glass border-b border-[var(--line)]">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 h-14 flex items-center gap-2 sm:gap-3">
          <Link to="/" className="btn btn-icon btn-ghost" aria-label="Back to home"><ArrowLeft size={17} /></Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--grad)] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(10,108,255,.3)] flex-none"><Camera size={16} /></div>
            <span className="wordmark text-base sm:text-lg hidden sm:inline">snapgrid<span className="text-[var(--accent)]">.</span></span>
            <span className="hidden lg:inline mono text-[10px] text-[var(--muted)] px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--line)]">STUDIO</span>
          </div>
          <div className="flex-1" />
          <button className="btn btn-sm btn-ghost hidden lg:inline-flex" onClick={() => setShortcutsOpen(true)}><Keyboard size={14} /> Shortcuts</button>
          <button className="btn btn-icon btn-ghost" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button>
          <button className="btn btn-sm btn-primary !px-2.5 sm:!px-4" onClick={() => setGalleryOpen(true)}><Images size={15} /> <span className="hidden sm:inline">Gallery</span> <span className="mono opacity-80">{captures.length}</span></button>
        </div>
      </header>

      {notice && (
        <div className="max-w-[1600px] mx-auto px-4 pt-3">
          <div className="flex items-center gap-2 text-[12px] p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-300">
            <Info size={14} /> {notice}
            <button className="ml-auto" onClick={() => setNotice(null)}><Trash2 size={13} /></button>
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[240px_minmax(0,1fr)_300px] gap-3 sm:gap-4 items-start">
        {/* LEFT RAIL */}
        <aside className="space-y-4 order-2 md:order-3 xl:order-1 min-w-0">
          <section className="card p-4">
            <span className="label">Capture mode</span>
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => {
                const Icon = modeIcons[m.id]
                const active = mode === m.id
                return (
                  <button key={m.id} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-300 ${active ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-[0_4px_14px_rgba(10,108,255,.15)]' : 'border-[var(--line)] bg-[var(--surface-2)] hover:border-[var(--line-2)]'}`} onClick={() => switchMode(m.id)} disabled={isBusy}>
                    <Icon size={18} className={active ? 'text-[var(--accent)]' : 'text-[var(--muted)]'} />
                    <span className={`text-[12px] font-semibold ${active ? 'text-[var(--accent)]' : 'text-[var(--ink-2)]'}`}>{m.name}</span>
                    <span className="text-[9px] text-[var(--muted)]">{m.hint}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {mode === 'grid' && (
            <section className="card p-4 reveal is-visible">
              <span className="label">Grid builder</span>
              <GridBuilder
                rows={settings.rows}
                cols={settings.cols}
                template={settings.template}
                onChange={(rows, cols) => updateSettings({ rows, cols })}
                onTemplateChange={(template) => updateSettings({ template })}
                disabled={isBusy}
              />
            </section>
          )}

          <section className="card p-4">
            <span className="label">Timer & interval</span>
            <div className="space-y-4">
              <div>
                <span className="text-[12px] text-[var(--ink-2)] mb-2 block">Countdown</span>
                <div className="flex gap-1.5">
                  {[0, 3, 5, 10].map((s) => (
                    <button key={s} className="chip flex-1 justify-center" data-active={settings.countdown === s} disabled={isBusy} onClick={() => updateSettings({ countdown: s })}>{s === 0 ? 'Off' : `${s}s`}</button>
                  ))}
                </div>
              </div>
              {mode === 'grid' && settings.rows * settings.cols > 1 && (
                <Slider label="Interval between shots" value={settings.interval} min={0} max={5} unit="s" onChange={(v) => updateSettings({ interval: v })} />
              )}
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--ink-2)] flex items-center gap-1.5"><Sparkles size={12} /> Screen flash</span>
                <button className="switch" data-on={settings.flash} onClick={() => updateSettings({ flash: !settings.flash })} aria-label="Toggle flash" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--ink-2)] flex items-center gap-1.5"><Timer size={12} /> Shutter sounds</span>
                <button className="switch" data-on={settings.sound} onClick={() => updateSettings({ sound: !settings.sound })} aria-label="Toggle sound" />
              </div>
            </div>
          </section>
        </aside>

        {/* CENTER: CAMERA */}
        <main className="order-1 md:order-1 xl:order-2 min-w-0 space-y-4">
          <div
            className="relative w-full"
            style={{ aspectRatio: mode === 'grid' ? stageAspect(settings.template, settings.rows, settings.cols, settings.rows * settings.cols) : 4 / 3 }}
          >
            <CameraView
              videoRef={cam.videoRef}
              cameraState={cam.state}
              error={cam.error}
              settings={settings}
              accessories={resolvedAccessories}
              focusedId={accessoryFocus}
              faceTracked={faceTracked}
              facingMode={cam.facingMode}
              onSwitchCamera={cam.switchFacing}
              onRetry={() => void cam.start()}
              phase={capture.phase}
              countdown={capture.countdown}
              currentIndex={capture.currentIndex}
              total={capture.total}
              recordedSeconds={capture.recordedSeconds}
              flash={flash}
              gridShots={session.shots}
              activeMode={mode}
              onAccessoryMove={(id, x, y) => updateSettings({ accessories: settings.accessories.map((a) => (a.id === id ? { ...a, x, y } : a)) })}
              onAccessorySelect={setAccessoryFocus}
            />
          </div>

          {/* Capture controls */}
          <div className="card p-4 flex items-center justify-center gap-3 flex-wrap">
            {isBusy ? (
              <>
                <div className="flex items-center gap-2 text-[var(--accent)] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  {busyLabel[capture.phase]}
                </div>
                <button className="btn btn-sm btn-danger" onClick={capture.cancel}><Square size={13} /> Cancel</button>
              </>
            ) : (
              <>
                <button className="btn btn-ghost" onClick={cam.switchFacing}><SwitchCamera size={16} /> <span className="hidden sm:inline">Flip camera</span></button>
                <button
                  className="btn btn-primary !px-8 !py-3.5 text-base btn-shine magnetic"
                  onClick={startCapture}
                  disabled={cam.state !== 'ready'}
                  title={cam.state === 'ready' ? undefined : 'Camera must be ready before capturing'}
                >
                  <Play size={18} fill="currentColor" />
                  {mode === 'photo' ? 'Take photo' : mode === 'grid' ? `Capture ${settings.rows * settings.cols} shots` : mode === 'video' ? 'Record video' : 'Record boomerang'}
                </button>
                <button className="btn btn-ghost" onClick={handleRetake} disabled={!previewImage}><RotateCcw size={16} /> <span className="hidden sm:inline">Retake</span></button>
              </>
            )}
            <span className="mono text-[10px] text-[var(--muted)] w-full text-center">SPACE to capture · ESC to cancel · G for gallery · F for fullscreen</span>
          </div>

          {/* Result + quick actions */}
          <section className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-[var(--ink)]">Current session</h2>
                <p className="text-[11px] text-[var(--muted)]">{previewImage ? `${mode} · ${session.shots.length || 1} frame(s)` : 'No capture yet — the result will appear here'}</p>
              </div>
              {previewImage && <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500"><Check size={13} /> Ready</span>}
            </div>

            {previewImage ? (
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-4">
                <div className="rounded-xl overflow-hidden bg-[var(--surface-2)] border border-[var(--line)] flex items-center justify-center min-h-[180px] max-h-[360px]">
                  {session.videoUrl ? (
                    <video src={session.videoUrl} controls autoPlay loop className="max-h-[340px] w-full object-contain" />
                  ) : (
                    <img src={previewImage} alt="Current capture" className="max-h-[340px] w-full object-contain" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 content-start">
                  <button className="btn btn-sm btn-primary col-span-2" onClick={handleDownloadPng}><Download size={14} /> Download PNG</button>
                  <button className="btn btn-sm btn-ghost" onClick={() => void handleDownloadZip()}><FileArchive size={14} /> ZIP</button>
                  <button className="btn btn-sm btn-ghost" onClick={handlePrint}><Printer size={14} /> Print</button>
                  <button className="btn btn-sm btn-soft col-span-2" onClick={() => void handleQr()}><QrCode size={14} /> Share via QR</button>
                  {qr && <div className="col-span-2 text-center p-2 bg-white rounded-xl border border-[var(--line)]"><img src={qr} alt="QR" className="w-24 mx-auto" /><p className="mono text-[9px] text-gray-500 mt-1 break-all">{shareUrl(captures[0]?.id ?? '')}</p></div>}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--line-2)] min-h-[120px] flex flex-col items-center justify-center text-center text-[var(--muted)]">
                <Wand2 size={22} className="mb-2 opacity-60" />
                <p className="text-[12px]">Your collage and download options will show up here</p>
              </div>
            )}
          </section>

          {/* Recent saves strip */}
          {captures.length > 0 && (
            <section className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2"><Images size={15} className="text-[var(--accent)]" /> Recently saved</h2>
                <button className="text-[11px] font-semibold text-[var(--accent)]" onClick={() => setGalleryOpen(true)}>View all ({captures.length}) →</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {captures.slice(0, 8).map((item) => (
                  <button key={item.id} className="relative w-24 h-20 rounded-lg overflow-hidden border border-[var(--line)] flex-none hover:border-[var(--accent)] transition-colors" onClick={() => setGalleryOpen(true)} title={new Date(item.createdAt).toLocaleString()}>
                    <img src={item.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span className="absolute bottom-1 left-1 mono text-[8px] text-white bg-black/60 px-1 rounded">{item.mode}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* RIGHT RAIL — settings */}
        <aside className="order-3 md:order-2 xl:order-3 space-y-4 min-w-0">
          <div className="card overflow-hidden">
            <div className="grid grid-cols-4 border-b border-[var(--line)]">
              {([
                ['settings', Settings2, 'Setup'],
                ['look', SlidersHorizontal, 'Look'],
                ['overlay', Layers, 'Text'],
                ['effects', Sparkles, 'FX'],
              ] as const).map(([id, Icon, label]) => (
                <button key={id} className={`py-3 text-[11px] font-semibold flex flex-col items-center gap-1 transition-colors ${panel === id ? 'text-[var(--accent)] bg-[var(--accent-soft)]' : 'text-[var(--muted)] hover:text-[var(--ink)]'}`} onClick={() => setPanel(id)}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
            <div className="p-4">
              {panel === 'settings' && (
                <div className="space-y-5">
                  <div>
                    <span className="label">Camera</span>
                    <select className="select" value={settings.cameraDeviceId} onChange={(e) => { updateSettings({ cameraDeviceId: e.target.value }); cam.selectDevice(e.target.value) }}>
                      <option value="">Default camera</option>
                      {cam.devices.map((d, i) => <option key={d.deviceId || i} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>)}
                    </select>
                    {cam.state === 'denied' && <p className="text-[11px] text-[var(--danger)] mt-2">Permission denied — enable it in your browser.</p>}
                    {cam.state === 'unsupported' && <p className="text-[11px] text-[var(--muted)] mt-2">Use localhost or HTTPS to enable the camera.</p>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--ink-2)] flex items-center gap-1.5"><Camera size={12} /> Mirror preview</span>
                    <button className="switch" data-on={settings.mirror} onClick={() => updateSettings({ mirror: !settings.mirror })} aria-label="Toggle mirror" />
                  </div>
                  <div className="divider" />
                  <div>
                    <span className="label">Frame style</span>
                    <div className="flex flex-wrap gap-1.5">
                      {FRAMES.map((f) => <button key={f.id} className="chip" data-active={settings.frame === f.id} onClick={() => updateSettings({ frame: f.id })}>{f.name}</button>)}
                    </div>
                  </div>
                  <div>
                    <span className="label">Background theme</span>
                    <div className="grid grid-cols-5 gap-2">
                      {BACKGROUND_THEMES.map((t) => (
                        <button
                          key={t.id}
                          className={`h-9 rounded-lg border-2 transition-transform hover:scale-105 ${settings.backgroundTheme === t.id ? 'border-[var(--accent)] scale-105' : 'border-[var(--line-2)]'}`}
                          style={{ background: t.id === 'custom' ? settings.background : `linear-gradient(135deg, ${t.from}, ${t.to})` }}
                          onClick={() => updateSettings({ backgroundTheme: t.id })}
                          title={t.name}
                          aria-label={`Background ${t.name}`}
                        />
                      ))}
                    </div>
                    {settings.backgroundTheme === 'custom' && (
                      <input type="color" className="mt-2 w-full h-9 rounded-lg border border-[var(--line-2)] cursor-pointer bg-transparent" value={settings.background} onChange={(e) => updateSettings({ background: e.target.value })} aria-label="Custom background color" />
                    )}
                    <p className="text-[10px] text-[var(--muted)] mt-1.5">{BACKGROUND_THEMES.find((t) => t.id === settings.backgroundTheme)?.name} background</p>
                  </div>
                  <div className="divider" />
                  <button className="btn btn-sm btn-ghost w-full" onClick={() => { resetSettings(); showToast('Settings reset') }}><RotateCcw size={13} /> Reset all settings</button>
                  <p className="text-[10px] text-[var(--muted)] leading-relaxed">Settings and saved captures persist in this browser's local storage. Nothing is uploaded to a server.</p>
                </div>
              )}

              {panel === 'look' && (
                <div className="space-y-5">
                  <FilterStrip value={settings.filter} onChange={(filter) => updateSettings({ filter })} />
                  <div className="divider" />
                  <Slider label="Brightness" value={settings.brightness} min={50} max={150} unit="%" onChange={(brightness) => updateSettings({ brightness })} />
                  <Slider label="Contrast" value={settings.contrast} min={50} max={150} unit="%" onChange={(contrast) => updateSettings({ contrast })} />
                  <Slider label="Saturation" value={settings.saturation} min={0} max={200} unit="%" onChange={(saturation) => updateSettings({ saturation })} />
                  <button className="btn btn-sm btn-ghost w-full" onClick={() => updateSettings({ brightness: 100, contrast: 100, saturation: 100 })}><RotateCcw size={13} /> Reset adjustments</button>
                </div>
              )}

              {panel === 'overlay' && <OverlayControls settings={settings} update={updateSettings} />}
              {panel === 'effects' && (
                <div className="space-y-5">
                  <EffectCarousel
                    videoRef={cam.videoRef}
                    cameraReady={cam.state === 'ready'}
                    settings={settings}
                    onSelect={(effectId) => updateSettings({ effectId })}
                  />
                  <div className="divider" />
                  <EffectsPanel
                    settings={settings}
                    update={updateSettings}
                    selectedId={accessoryFocus}
                    onSelect={setAccessoryFocus}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="card p-4 bg-[var(--grad)] !border-transparent text-white">
            <div className="flex items-center gap-2 mb-1"><Maximize size={15} /> Kiosk mode</div>
            <p className="text-[11px] text-white/80 mb-3">Go fullscreen for a clean, distraction-free booth experience.</p>
            <button className="btn btn-sm !bg-white/20 !text-white hover:!bg-white/30" onClick={() => { if (!document.fullscreenElement) void document.documentElement.requestFullscreen().catch(() => undefined); else void document.exitFullscreen().catch(() => undefined) }}>Toggle fullscreen</button>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2 text-[var(--ink)] font-semibold text-[13px] mb-1.5"><Info size={14} className="text-[var(--accent)]" /> Privacy first</div>
            <p className="text-[11px] text-[var(--muted)] leading-relaxed">Camera frames and photos never leave your device. Your gallery is stored in local storage on this browser only.</p>
          </div>
        </aside>
      </div>

      {/* Gallery */}
      <Gallery open={galleryOpen} onClose={() => setGalleryOpen(false)} />

      <ResultModal
        open={resultOpen && !galleryOpen}
        onClose={() => setResultOpen(false)}
        session={session}
        settings={settings}
        latest={captures[0]}
        onRetake={handleRetake}
        onToast={showToast}
      />

      {/* Shortcuts modal */}
      {shortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShortcutsOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative card w-full max-w-sm p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold flex items-center gap-2"><Keyboard size={17} /> Keyboard shortcuts</h3><button className="btn btn-icon btn-ghost btn-sm" onClick={() => setShortcutsOpen(false)}><Trash2 size={14} /></button></div>
            <div className="space-y-2 text-[13px]">
              {[['Space', 'Start capture'], ['Esc', 'Cancel capture / close'], ['G', 'Open gallery'], ['F', 'Toggle fullscreen']].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2 rounded-lg bg-[var(--surface-2)]"><span className="text-[var(--ink-2)]">{v}</span><kbd className="mono text-[11px] px-2 py-1 rounded-md bg-[var(--surface)] border border-[var(--line)]">{k}</kbd></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
