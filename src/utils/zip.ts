import JSZip from 'jszip'
import { downloadBlob, stamp } from './download'
import type { CaptureItem } from '../types'

export async function downloadZip(item: CaptureItem, composite?: string | null) {
  const zip = new JSZip()
  const folder = zip.folder(`snapgrid-${item.id}`)!
  if (composite) {
    folder.file('collage.png', composite.split(',')[1], { base64: true })
  }
  folder.file('README.txt', [
    `Snapgrid Photobooth capture`,
    `Date: ${new Date(item.createdAt).toLocaleString()}`,
    `Mode: ${item.mode}`,
    `Grid: ${item.rows}x${item.cols} (${item.frameCount} frames)`,
    `Filter: ${item.filter}`,
    ``,
    `All images are stored locally in your browser.`,
  ].join('\n'))
  const blob = await zip.generateAsync({ type: 'blob' })
  downloadBlob(blob, `snapgrid-${stamp()}.zip`)
}
