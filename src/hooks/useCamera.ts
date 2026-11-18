import { useCallback, useEffect, useRef, useState } from 'react'

export type CameraState = 'idle' | 'loading' | 'ready' | 'denied' | 'error' | 'unsupported'

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [state, setState] = useState<CameraState>('idle')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [deviceId, setDeviceId] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  const refreshDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      setDevices(all.filter((d) => d.kind === 'videoinput'))
    } catch { /* noop */ }
  }, [])

  const start = useCallback(async (preferredId?: string, facing: 'user' | 'environment' = 'user') => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unsupported')
      setError('Camera API is not available. Use a browser with webcam support over HTTPS or localhost.')
      return
    }
    stop()
    setState('loading')
    setError('')
    try {
      const constraints: MediaStreamConstraints = {
        video: preferredId
          ? { deviceId: { exact: preferredId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
          : { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play().catch(() => undefined)
      }
      const track = stream.getVideoTracks()[0]
      const settings = track.getSettings()
      if (settings.deviceId) setDeviceId(settings.deviceId)
      setState('ready')
      void refreshDevices()
    } catch (err) {
      const name = (err as DOMException)?.name
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setState('denied')
        setError('Camera permission was denied. Allow access in your browser settings and try again.')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setState('error')
        setError('No camera was found on this device.')
      } else {
        setState('error')
        setError(`Could not start the camera: ${(err as Error)?.message ?? 'unknown error'}`)
      }
    }
  }, [stop, refreshDevices])

  const switchFacing = useCallback(() => {
    const next = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(next)
    void start('', next)
  }, [facingMode, start])

  const selectDevice = useCallback((id: string) => {
    setDeviceId(id)
    void start(id)
  }, [start])

  useEffect(() => {
    void start()
    void refreshDevices()
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    videoRef,
    streamRef,
    state,
    devices,
    deviceId,
    error,
    facingMode,
    start,
    stop,
    switchFacing,
    selectDevice,
  }
}

/** Draws the current video frame to a canvas with mirror + CSS filter applied. */
export function grabFrame(
  video: HTMLVideoElement,
  opts: { filter: string; brightness: number; contrast: number; saturation: number; mirror: boolean; maxWidth?: number },
): string | null {
  if (!video.videoWidth || !video.videoHeight) return null
  const maxWidth = opts.maxWidth ?? 1600
  const scale = Math.min(1, maxWidth / video.videoWidth)
  const w = Math.round(video.videoWidth * scale)
  const h = Math.round(video.videoHeight * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.save()
  if (opts.mirror) {
    ctx.translate(w, 0)
    ctx.scale(-1, 1)
  }
  const preset = opts.filter === 'none' ? 'none' : opts.filter
  ctx.filter = `${preset === 'none' ? '' : preset + ' '}brightness(${opts.brightness}%) contrast(${opts.contrast}%) saturate(${opts.saturation}%)`
  ctx.drawImage(video, 0, 0, w, h)
  ctx.restore()
  return canvas.toDataURL('image/jpeg', 0.92)
}
