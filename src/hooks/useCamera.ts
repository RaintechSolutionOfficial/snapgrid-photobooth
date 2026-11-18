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

/** Source rectangle that reproduces CSS `object-fit: cover` for a given display box. */
export function coverSourceRect(video: HTMLVideoElement, boxW: number, boxH: number) {
  const vw = video.videoWidth
  const vh = video.videoHeight
  const boxAspect = boxW / boxH
  const videoAspect = vw / vh
  if (videoAspect > boxAspect) {
    const sw = vh * boxAspect
    return { sx: (vw - sw) / 2, sy: 0, sw, sh: vh }
  }
  const sh = vw / boxAspect
  return { sx: 0, sy: (vh - sh) / 2, sw: vw, sh }
}

/** Draws only the visible (cover-cropped) part of the video onto a canvas. */
export function drawVideoCover(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  w: number,
  h: number,
) {
  const boxW = video.clientWidth || video.videoWidth
  const boxH = video.clientHeight || video.videoHeight
  const { sx, sy, sw, sh } = coverSourceRect(video, boxW, boxH)
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h)
}

/** Draws the current video frame to a canvas with mirror + CSS filter applied.
 *  The captured frame matches exactly what the user sees in the viewfinder. */
export function grabFrame(
  video: HTMLVideoElement,
  opts: { filter: string; brightness: number; contrast: number; saturation: number; mirror: boolean; maxWidth?: number },
): string | null {
  if (!video.videoWidth || !video.videoHeight) return null
  const boxW = video.clientWidth || video.videoWidth
  const boxH = video.clientHeight || video.videoHeight
  const { sw, sh } = coverSourceRect(video, boxW, boxH)
  const maxWidth = opts.maxWidth ?? 1600
  const scale = Math.min(1, maxWidth / sw)
  const w = Math.max(1, Math.round(sw * scale))
  const h = Math.max(1, Math.round(sh * scale))
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
  const preset = opts.filter === 'none' ? '' : opts.filter
  ctx.filter = `${preset} brightness(${opts.brightness}%) contrast(${opts.contrast}%) saturate(${opts.saturation}%)`.trim()
  drawVideoCover(ctx, video, w, h)
  ctx.restore()
  return canvas.toDataURL('image/jpeg', 0.94)
}
