export function dataUrlToBlob(dataUrl: string): Blob {
  const [header, payload] = dataUrl.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png'
  const binary = atob(payload)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  downloadBlob(dataUrlToBlob(dataUrl), filename)
}

export function stamp(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
}

export function printImage(dataUrl: string, title: string) {
  const win = window.open('', '_blank', 'width=900,height=1100')
  if (!win) return false
  win.document.write(`<!doctype html><html><head><title>${title}</title><style>
    @page { size: A4 portrait; margin: 12mm; }
    body { margin:0; display:flex; align-items:center; justify-content:center; min-height:100vh; font-family:system-ui,sans-serif; }
    img { max-width:100%; max-height:96vh; object-fit:contain; }
    @media print { body { min-height:auto; } }
  </style></head><body><img src="${dataUrl}" onload="setTimeout(function(){window.focus();window.print()},250)"/></body></html>`)
  win.document.close()
  return true
}
