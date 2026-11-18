function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** Builds a ping-pong (forward then reversed) webm from captured frames. */
export async function buildBoomerang(frames: string[], width = 480, height = 360): Promise<{ url: string; blob: Blob; mime: string; poster: string }> {
  if (!frames.length) throw new Error('No frames to build a boomerang')
  const images = await Promise.all(frames.map((f) => loadImage(f).catch(() => null)))
  const valid = images.filter((i): i is HTMLImageElement => i !== null)
  if (!valid.length) throw new Error('Could not decode frames')

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  let index = 0
  let forward = true
  const drawFrame = () => {
    const img = valid[Math.min(index, valid.length - 1)]
    ctx.fillStyle = '#0a0d14'
    ctx.fillRect(0, 0, width, height)
    const ratio = Math.max(width / img.width, height / img.height)
    const sw = width / ratio
    const sh = height / ratio
    ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, width, height)
  }
  drawFrame()

  const stream = canvas.captureStream(20)
  const mime = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    .find((m) => MediaRecorder.isTypeSupported(m)) ?? ''
  const recorder = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 2_500_000 } : undefined)
  const chunks: BlobPart[] = []
  recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data)

  const done = new Promise<void>((resolve) => { recorder.onstop = () => resolve() })
  recorder.start()
  const stepMs = 90
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < valid.length; i++) {
      index = forward ? i : valid.length - 1 - i
      drawFrame()
      await new Promise<void>((r) => window.setTimeout(r, stepMs))
      if (recorder.state !== 'recording') break
    }
    forward = !forward
  }
  if (recorder.state === 'recording') recorder.stop()
  await done
  stream.getTracks().forEach((t) => t.stop())

  const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' })
  return { url: URL.createObjectURL(blob), blob, mime: recorder.mimeType || 'video/webm', poster: canvas.toDataURL('image/jpeg', 0.9) }
}
