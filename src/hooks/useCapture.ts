import { useCallback, useRef, useState, type RefObject } from 'react'
import type { Accessory, CaptureItem, Mode, Settings } from '../types'
import { usePhotoboothStore } from '../store/photoboothStore'
import { drawVideoCover, grabFrame } from './useCamera'
import { buildComposite, createDemoFrame, settingsToComposite } from '../utils/composite'
import { playCountdownTick, playShutter, playSuccess } from '../utils/audio'
import { buildBoomerang } from '../utils/boomerang'
import { accessoriesForShot, applyAccessories } from '../utils/effects'
import { stamp } from '../utils/download'
import { compressForStorage } from '../utils/storage'

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms))

export type CapturePhase = 'idle' | 'countdown' | 'capturing' | 'recording' | 'finishing'

type Args = {
  videoRef: RefObject<HTMLVideoElement>
  cameraReady: boolean
  settings: Settings
  accessories?: Accessory[]
  onFlash: () => void
}

export function useCapture({ videoRef, cameraReady, settings, accessories, onFlash }: Args) {
  const addCapture = usePhotoboothStore((s) => s.addCapture)
  const setSession = usePhotoboothStore((s) => s.setSession)

  const [phase, setPhase] = useState<CapturePhase>('idle')
  const [countdown, setCountdown] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [total, setTotal] = useState(0)
  const [recordedSeconds, setRecordedSeconds] = useState(0)
  const cancelled = useRef(false)
  const recorderRef = useRef<MediaRecorder | null>(null)

  const activeAccessories = accessories ?? settings.accessories
  const sound = settings.sound
  const tick = useCallback((final = false) => { if (sound) playCountdownTick(final) }, [sound])
  const shutter = useCallback(() => { if (sound) playShutter() }, [sound])
  const success = useCallback(() => { if (sound) playSuccess() }, [sound])

  const cancel = useCallback(() => {
    cancelled.current = true
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    setPhase('idle')
    setCountdown(null)
  }, [])

  const runCountdown = useCallback(async (seconds: number) => {
    setPhase('countdown')
    for (let i = seconds; i > 0; i--) {
      if (cancelled.current) return false
      setCountdown(i)
      tick(i === 1)
      await sleep(1000)
    }
    setCountdown(null)
    return !cancelled.current
  }, [tick])

  const takeFrame = useCallback(async (index: number) => {
    const raw = cameraReady && videoRef.current
      ? grabFrame(videoRef.current, {
          filter: settings.filter,
          brightness: settings.brightness,
          contrast: settings.contrast,
          saturation: settings.saturation,
          mirror: settings.mirror,
        }) ?? createDemoFrame(index, settings.filter)
      : createDemoFrame(index, settings.filter)
    return applyAccessories(raw, accessoriesForShot(index, settings, activeAccessories))
  }, [cameraReady, videoRef, settings, activeAccessories])

  const persist = useCallback(async (mode: Mode, shots: string[], composite: string | null, duration?: number) => {
    const fullImage = composite ?? shots[0] ?? ''
    const item: CaptureItem = {
      id: `${stamp()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: Date.now(),
      mode,
      rows: mode === 'grid' ? settings.rows : 1,
      cols: mode === 'grid' ? settings.cols : 1,
      frameCount: shots.length || 1,
      image: fullImage ? await compressForStorage(fullImage) : '',
      filter: settings.filter,
      eventTitle: settings.eventTitle,
      duration,
    }
    const ok = addCapture(item)
    if (!ok) window.alert('Local storage is full — please delete a few old captures from the gallery and try again.')
    success()
    return item
  }, [addCapture, settings, success])

  const captureStill = useCallback(async () => {
    if (!(await runCountdown(settings.countdown))) return
    setPhase('capturing')
    onFlash()
    shutter()
    await sleep(120)
    const frame = await takeFrame(0)
    setSession({ shots: [frame], composite: frame, videoUrl: null })
    persist('photo', [frame], frame)
    setPhase('idle')
  }, [runCountdown, settings.countdown, onFlash, shutter, takeFrame, setSession, persist])

  const captureGrid = useCallback(async () => {
    const shots: string[] = []
    const count = settings.rows * settings.cols
    setTotal(count)
    setCurrentIndex(0)
    for (let i = 0; i < count; i++) {
      if (!(await runCountdown(settings.countdown))) return
      setPhase('capturing')
      onFlash()
      shutter()
      await sleep(110)
      shots.push(await takeFrame(i))
      setCurrentIndex(i + 1)
      setSession({ shots: [...shots], composite: null })
      if (i < count - 1 && settings.interval > 0) {
        setPhase('countdown')
        await sleep(settings.interval * 1000)
      }
    }
    setPhase('finishing')
    const composite = await buildComposite(shots, settingsToComposite(settings))
    setSession({ shots, composite, videoUrl: null })
    persist('grid', shots, composite)
    setPhase('idle')
    setCurrentIndex(0)
  }, [settings, runCountdown, onFlash, shutter, takeFrame, setSession, persist])

  const captureVideo = useCallback(async (mode: 'video' | 'boomerang') => {
    const duration = mode === 'video' ? 6 : 3
    if (!(await runCountdown(settings.countdown))) return
    setPhase('recording')

    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480
    const ctx = canvas.getContext('2d')!
    const stream = canvas.captureStream(30)
    const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
      .find((m) => MediaRecorder.isTypeSupported(m)) ?? ''
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 2_500_000 } : undefined)
    recorderRef.current = recorder
    const chunks: BlobPart[] = []
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)

    let raf = 0
    let lastSample = 0
    const collectedFrames: string[] = []
    const started = performance.now()
    const draw = () => {
      const ratio = Math.min(1, (performance.now() - started) / (duration * 1000))
      setRecordedSeconds(Math.min(duration, Math.floor((performance.now() - started) / 1000)))
      ctx.save()
      if (settings.mirror) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
      }
      const preset = settings.filter === 'none' ? '' : settings.filter + ' '
      ctx.filter = `${preset}brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`
      const video = videoRef.current
      if (cameraReady && video?.videoWidth) {
        drawVideoCover(ctx, video, canvas.width, canvas.height)
      } else {
        const g = ctx.createLinearGradient(0, 0, 640, 480)
        g.addColorStop(0, `hsl(${200 + ratio * 120}, 70%, 45%)`)
        g.addColorStop(1, '#101827')
        ctx.fillStyle = g
        ctx.fillRect(0, 0, 640, 480)
        ctx.fillStyle = '#fff'
        ctx.textAlign = 'center'
        ctx.font = '700 34px Geist, sans-serif'
        ctx.fillText(mode === 'video' ? 'RECORDING' : 'BOOMERANG', 320, 250)
      }
      ctx.restore()
      if (mode === 'boomerang' && performance.now() - lastSample > 110) {
        lastSample = performance.now()
        collectedFrames.push(canvas.toDataURL('image/jpeg', 0.82))
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    const done = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
    })
    recorder.start()
    await sleep(duration * 1000)
    if (recorder.state === 'recording') recorder.stop()
    await done
    cancelAnimationFrame(raf)
    stream.getTracks().forEach((t) => t.stop())

    if (cancelled.current) {
      setPhase('idle')
      return
    }

    let url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || 'video/webm' }))
    let poster = canvas.toDataURL('image/jpeg', 0.9)

    if (activeAccessories.length) {
      poster = await applyAccessories(poster, activeAccessories)
    }

    if (mode === 'boomerang') {
      setPhase('finishing')
      try {
        const decorated = await Promise.all(
          collectedFrames.map((f, i) => applyAccessories(f, accessoriesForShot(i, settings, activeAccessories))),
        )
        const result = await buildBoomerang(decorated)
        url = result.url
        poster = result.poster
      } catch {
        // fall back to the plain recording if frame stitching fails
      }
    }

    setSession({ shots: [], composite: poster, videoUrl: url })
    persist(mode, [poster], poster, duration)
    setRecordedSeconds(0)
    setPhase('idle')
  }, [settings, runCountdown, cameraReady, videoRef, setSession, persist, activeAccessories])

  const startMode = useCallback(async (activeMode: Mode) => {
    if (phase !== 'idle') return
    cancelled.current = false
    if (activeMode === 'photo') await captureStill()
    else if (activeMode === 'grid') await captureGrid()
    else await captureVideo(activeMode)
  }, [phase, captureStill, captureGrid, captureVideo])

  return { start: startMode, cancel, phase, countdown, currentIndex, total, recordedSeconds }
}
