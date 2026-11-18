import QRCode from 'qrcode'

export async function generateQr(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    width: 320,
    margin: 1,
    color: { dark: '#0a0e17', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
}

export function shareUrl(id: string): string {
  const base = `${window.location.origin}${window.location.pathname}`
  return `${base}?capture=${encodeURIComponent(id)}`
}
