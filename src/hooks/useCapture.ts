import { useCallback, useRef, useState, type RefObject } from 'react'
import type { Accessory, CaptureItem, Mode, Settings } from '../types'
import { usePhotoboothStore } from '../store/photoboothStore'
import { buildComposite, settingsToComposite } from '../utils/composite'
import { playCountdownTick, playShutter, playSuccess } from '../utils/audio'
import { buildBoomerang } from '../utils/boomerang'
import { accessoriesForShot } from '../utils/effects'
import { renderFrame } from '../utils/videoEffects'
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
  onError: (msg: string) => void
}

export function useCapture({ videoRef, cameraReady, settings, accessories, onFlash, onError }: Args) {
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
    // Live booth: a frame can only come from the real camera, never a synthetic demo.
    if (!cameraReady || !videoRef.current?.videoWidth) return null
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 960
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    renderFrame(ctx, videoRef.current, {
      effectId: settings.effectId,
      filter: settings.filter,
      brightness: settings.brightness,
      contrast: settings.contrast,
      saturation: settings.saturation,
      mirror: settings.mirror,
      accessories: accessoriesForShot(index, settings, activeAccessories),
      time: performance.now(),
    }, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.94)
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
    if (!ok) onError('Local storage is full — delete a few old captures from the gallery and try again.')
    success()
    return item
  }, [addCapture, settings, success, onError])

  const captureStill = useCallback(async () => {
    if (!(await runCountdown(settings.countdown))) return
    setPhase('capturing')
    onFlash()
    shutter()
    await sleep(120)
    const frame = await takeFrame(0)
    if (!frame) {
      setPhase('idle')
      onError('Camera unavailable — capture cancelled.')
      return
    }
    setSession({ shots: [frame], composite: frame, videoUrl: null })
    persist('photo', [frame], frame)
    setPhase('idle')
  }, [runCountdown, settings.countdown, onFlash, shutter, takeFrame, setSession, persist, onError])

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
      const frame = await takeFrame(i)
      if (!frame) {
        setPhase('idle')
        setCurrentIndex(0)
        onError('Camera unavailable — capture cancelled.')
        return
      }
      shots.push(frame)
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
  }, [settings, runCountdown, onFlash, shutter, takeFrame, setSession, persist, onError])

  const captureVideo = useCallback(async (mode: 'video' | 'boomerang') => {
    const duration = mode === 'video' ? 6 : 3
    if (!cameraReady || !videoRef.current?.videoWidth) {
      onError('Camera unavailable — capture cancelled.')
      return
    }
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
      setRecordedSeconds(Math.min(duration, Math.floor((performance.now() - started) / 1000)))
      const video = videoRef.current
      if (cameraReady && video?.videoWidth) {
        renderFrame(ctx, video, {
          effectId: settings.effectId,
          filter: settings.filter,
          brightness: settings.brightness,
          contrast: settings.contrast,
          saturation: settings.saturation,
          mirror: settings.mirror,
          accessories: activeAccessories,
          time: performance.now(),
        }, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = '#0a0d14'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
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

    if (mode === 'boomerang') {
      setPhase('finishing')
      try {
        const result = await buildBoomerang(collectedFrames)
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
  }, [settings, runCountdown, cameraReady, videoRef, setSession, persist, activeAccessories, onError])

  const startMode = useCallback(async (activeMode: Mode) => {
    if (phase !== 'idle') return
    cancelled.current = false
    if (activeMode === 'photo') await captureStill()
    else if (activeMode === 'grid') await captureGrid()
    else await captureVideo(activeMode)
  }, [phase, captureStill, captureGrid, captureVideo])

  return { start: startMode, cancel, phase, countdown, currentIndex, total, recordedSeconds }
}
