import { useEffect } from 'react'
import { X, Download, FileArchive, Printer, QrCode, RotateCcw, Check, Sparkles, Images } from 'lucide-react'
import type { SessionState, Settings } from '../../types'
import { downloadDataUrl, printImage, stamp } from '../../utils/download'
import { downloadZip } from '../../utils/zip'
import { generateQr, shareUrl } from '../../utils/qr'
import type { CaptureItem } from '../../types'

type Props = {
  open: boolean
  onClose: () => void
  session: SessionState
  settings: Settings
  latest: CaptureItem | undefined
  onRetake: () => void
  onToast: (msg: string) => void
}

export function ResultModal({ open, onClose, session, settings, latest, onRetake, onToast }: Props) {
  const image = session.composite ?? session.shots[0] ?? null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !image) return null

  const item: CaptureItem = latest ?? {
    id: 'current', createdAt: Date.now(), mode: 'photo', rows: 1, cols: 1,
    frameCount: 1, image, filter: settings.filter, eventTitle: settings.eventTitle,
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-[#050810]/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl max-h-[94vh] rounded-[24px] overflow-hidden bg-[var(--surface)] border border-[var(--line-2)] shadow-2xl flex flex-col animate-[fadeIn_.25s_ease]">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-[var(--line)] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center flex-none"><Sparkles size={17} /></div>
            <div className="min-w-0">
              <h2 className="text-[15px] font-bold text-[var(--ink)] flex items-center gap-2">Your shot is ready <Check size={14} className="text-emerald-500" /></h2>
              <p className="text-[11px] text-[var(--muted)] truncate">{settings.eventTitle} · {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
          <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close result"><X size={18} /></button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] overflow-hidden">
          <div className="bg-[#080b12] flex items-center justify-center p-4 min-h-[260px]">
            {session.videoUrl ? (
              <video src={session.videoUrl} controls autoPlay loop className="max-h-[62vh] w-auto max-w-full object-contain rounded-lg shadow-2xl" />
            ) : (
              <img src={image} alt="Your capture" className="max-h-[62vh] w-auto max-w-full object-contain rounded-lg shadow-2xl" />
            )}
          </div>
          <div className="p-4 border-t lg:border-t-0 lg:border-l border-[var(--line)] overflow-y-auto flex flex-col gap-3">
            <div className="space-y-1 text-[12px]">
              <div className="flex justify-between"><span className="text-[var(--muted)]">Frames</span><span className="mono font-semibold">{session.shots.length || 1}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Layout</span><span className="font-semibold capitalize">{settings.template}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Background</span><span className="font-semibold capitalize">{settings.backgroundTheme}</span></div>
              <div className="flex justify-between"><span className="text-[var(--muted)]">Effects</span><span className="mono font-semibold">{settings.accessories.length}</span></div>
            </div>
            <div className="divider" />
            <button className="btn btn-sm btn-primary w-full" onClick={() => { downloadDataUrl(image, `snapgrid-${stamp()}.png`); onToast('PNG downloaded') }}><Download size={14} /> Download PNG</button>
            <button className="btn btn-sm btn-ghost w-full" onClick={() => { void downloadZip(item, image); onToast('ZIP downloaded') }}><FileArchive size={14} /> Download ZIP</button>
            <button className="btn btn-sm btn-ghost w-full" onClick={() => { if (!printImage(image, 'Snapgrid Print')) onToast('Allow pop-ups to print') }}><Printer size={14} /> Print</button>
            <button className="btn btn-sm btn-soft w-full" onClick={() => { void (async () => { const qr = await generateQr(shareUrl(item.id)); const w = window.open('', '_blank', 'width=420,height=520'); if (!w) return onToast('Allow pop-ups to share'); w.document.write(`<body style="margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font:14px system-ui;gap:12px"><img src="${qr}" style="width:240px"/><p style="color:#555">${shareUrl(item.id)}</p></body>`); w.document.close() })() }}><QrCode size={14} /> Share via QR</button>
            <div className="flex-1" />
            <button className="btn btn-sm btn-ghost w-full" onClick={() => { onRetake(); onClose() }}><RotateCcw size={14} /> Take another</button>
            <button className="btn btn-sm btn-ghost w-full" onClick={onClose}><Images size={14} /> Gallery & more</button>
            <p className="text-[10px] text-[var(--muted)] text-center">Saved to this browser automatically</p>
          </div>
        </div>
      </div>
    </div>
  )
}
