import { useEffect, useRef, useState, type RefObject } from 'react'
import type { FaceBox } from '../types'
import { coverSourceRect } from './useCamera'

type DetectedFace = { boundingBox: { x: number; y: number; width: number; height: number } }
type Detector = { detect: (source: HTMLVideoElement) => Promise<DetectedFace[]> }
type DetectorCtor = new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => Detector

type FaceDetectorWindow = Window & { FaceDetector?: DetectorCtor }

/** Uses the browser's FaceDetector (where available) to track the main face in the viewfinder. */
export function useFaceBox(videoRef: RefObject<HTMLVideoElement>, enabled: boolean, mirror = false, intervalMs = 500) {
  const [faceBox, setFaceBox] = useState<FaceBox | null>(null)
  const [supported, setSupported] = useState(false)
  const detectorRef = useRef<Detector | null>(null)
  const activeRef = useRef(false)

  useEffect(() => {
    const Ctor = (window as FaceDetectorWindow).FaceDetector
    setSupported(Boolean(Ctor))
    if (!Ctor) return
    try {
      detectorRef.current = new Ctor({ fastMode: true, maxDetectedFaces: 1 })
    } catch {
      detectorRef.current = null
    }
  }, [])

  useEffect(() => {
    activeRef.current = enabled && Boolean(detectorRef.current)
    if (!activeRef.current) {
      setFaceBox(null)
      return
    }
    let cancelled = false
    const tick = async () => {
      if (cancelled || !activeRef.current) return
      const video = videoRef.current
      const detector = detectorRef.current
      if (video && detector && video.readyState >= 2 && video.videoWidth) {
        try {
          const faces = await detector.detect(video)
          if (cancelled || !faces.length) {
            if (!faces.length) setFaceBox(null)
            return
          }
          const b = faces[0].boundingBox
          const boxW = video.clientWidth || video.videoWidth
          const boxH = video.clientHeight || video.videoHeight
          const crop = coverSourceRect(video, boxW, boxH)
          const fx = (b.x - crop.sx) / crop.sw
          const fw = b.width / crop.sw
          setFaceBox({
            x: mirror ? 1 - fx - fw : fx,
            y: (b.y - crop.sy) / crop.sh,
            w: fw,
            h: b.height / crop.sh,
          })
        } catch {
          setFaceBox(null)
        }
      }
    }
    void tick()
    const timer = window.setInterval(() => void tick(), intervalMs)
    return () => { cancelled = true; window.clearInterval(timer) }
  }, [enabled, intervalMs, videoRef, mirror])

  return { faceBox, supported }
}
