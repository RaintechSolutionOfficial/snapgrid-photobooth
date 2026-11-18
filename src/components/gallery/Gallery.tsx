import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  Images, X, Download, Trash2, QrCode, Printer, CalendarClock, Grid3X3,
  Video, Camera, Expand, FileArchive, HardDrive, RefreshCw, Search, CheckCircle2,
} from 'lucide-react'
import type { CaptureItem } from '../../types'
import { usePhotoboothStore } from '../../store/photoboothStore'
import { downloadDataUrl, stamp } from '../../utils/download'
import { downloadZip } from '../../utils/zip'
import { generateQr, shareUrl } from '../../utils/qr'
import { formatBytes, storageUsage } from '../../utils/storage'
import { printImage } from '../../utils/download'

type Props = { open: boolean; onClose: () => void }

function modeIcon(mode: CaptureItem['mode']) {
  if (mode === 'grid') return <Grid3X3 size={12} />
  if (mode === 'video') return <Video size={12} />
  if (mode === 'boomerang') return <RefreshCw size={12} />
  return <Camera size={12} />
}

export function Gallery({ open, onClose }: Props) {
  const captures = usePhotoboothStore((s) => s.captures)
  const removeCapture = usePhotoboothStore((s) => s.removeCapture)
  const clearAllCaptures = usePhotoboothStore((s) => s.clearAllCaptures)
  const [selected, setSelected] = useState<CaptureItem | null>(null)
  const [qr, setQr] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [usage, setUsage] = useState(0)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    if (open) setUsage(storageUsage())
  }, [open, captures])

  useEffect(() => {
    if (!open) {
      setSelected(null)
      setQr(null)
      setConfirmClear(false)
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selected) { setSelected(null); setQr(null) }
        else onClose()
      }
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, selected, onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return captures
    return captures.filter((c) => `${c.mode} ${c.eventTitle} ${c.rows}x${c.cols}`.toLowerCase().includes(q))
  }, [captures, query])

  if (!open) return null

  const openQr = async (item: CaptureItem) => {
    const url = shareUrl(item.id)
    const data = await generateQr(url)
    setQr(data)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm animate-[fadeIn_.2s_ease]" onClick={onClose} />
      <div className="relative w-full max-w-6xl h-[88vh] rounded-[24px] bg-[var(--surface)] border border-[var(--line-2)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--line)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] shrink-0"><Images size={19} /></div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
                Saved Gallery <span className="mono text-[11px] font-normal text-[var(--muted)]">({captures.length})</span>
              </h2>
              <p className="text-[11px] text-[var(--muted)] truncate">Your captures are stored locally in this browser</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[var(--muted)] mono px-2.5 py-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--line)]">
              <HardDrive size={12} /> {formatBytes(usage)}
            </div>
            <button className="btn btn-icon btn-ghost" onClick={onClose} aria-label="Close gallery"><X size={18} /></button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[var(--line)] shrink-0 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input className="input !pl-9" placeholder="Search saved…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex-1" />
          {confirmClear ? (
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-[var(--danger)]">Delete all {captures.length}?</span>
              <button className="btn btn-sm btn-danger" onClick={() => { clearAllCaptures(); setConfirmClear(false) }}>Yes, clear</button>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfirmClear(false)}>Cancel</button>
            </div>
          ) : (
            <button className="btn btn-sm btn-danger" disabled={!captures.length} onClick={() => setConfirmClear(true)}>
              <Trash2 size={13} /> Clear all
            </button>
          )}
        </div>

        {/* Grid of saved captures */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-2)] flex items-center justify-center text-[var(--muted)] mb-4"><Images size={26} /></div>
              <h3 className="font-semibold text-[var(--ink)] mb-1">{captures.length ? 'No matches' : 'Nothing saved yet'}</h3>
              <p className="text-[13px] text-[var(--muted)] max-w-xs">
                {captures.length ? 'Try a different search.' : 'Your captured photos and collages will appear here automatically, saved on this device.'}
              </p>
            </div>
          ) : (
            <div className="thumb-grid">
              {filtered.map((item) => (
                <div key={item.id} className="group card overflow-hidden !rounded-2xl">
                  <button className="relative block w-full aspect-[4/3] overflow-hidden bg-[var(--surface-2)]" onClick={() => setSelected(item)}>
                    <img src={item.image} alt={item.eventTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold capitalize backdrop-blur">
                      {modeIcon(item.mode)} {item.mode}
                    </span>
                    <span className="absolute bottom-2 right-2 mono text-[10px] text-white bg-black/60 px-2 py-1 rounded-full backdrop-blur">
                      {item.rows}×{item.cols}
                    </span>
                    <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <Expand size={22} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </span>
                  </button>
                  <div className="p-3 flex items-center justify-between gap-1">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[var(--ink)] truncate">{item.eventTitle || 'Untitled'}</p>
                      <p className="mono text-[10px] text-[var(--muted)] flex items-center gap-1 mt-0.5"><CalendarClock size={10} /> {new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <button className="btn btn-icon btn-ghost btn-sm !w-7 !h-7 text-[var(--danger)]" onClick={() => removeCapture(item.id)} aria-label="Delete capture"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / detail */}
      {selected && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row rounded-[22px] overflow-hidden bg-[var(--surface)] border border-[var(--line-2)] shadow-2xl">
            <button className="absolute top-3 right-3 z-20 btn btn-icon btn-ghost !bg-black/40 !text-white !border-white/10" onClick={() => { setSelected(null); setQr(null) }} aria-label="Close preview"><X size={18} /></button>
            <div className="flex-1 bg-[#0a0d14] flex items-center justify-center min-h-[280px]">
              <img src={selected.image} alt={selected.eventTitle} className="max-h-[70vh] w-auto object-contain" />
            </div>
            <div className="w-full md:w-72 p-5 flex flex-col gap-4 overflow-y-auto">
              <div>
                <p className="label">Capture details</p>
                <h3 className="font-bold text-[var(--ink)] text-lg leading-tight">{selected.eventTitle || 'Untitled'}</h3>
                <div className="mt-3 space-y-1.5 text-[12px] text-[var(--ink-2)]">
                  <p className="flex justify-between"><span className="text-[var(--muted)]">Mode</span><span className="font-semibold capitalize">{selected.mode}</span></p>
                  <p className="flex justify-between"><span className="text-[var(--muted)]">Grid</span><span className="mono">{selected.rows}×{selected.cols}</span></p>
                  <p className="flex justify-between"><span className="text-[var(--muted)]">Frames</span><span className="mono">{selected.frameCount}</span></p>
                  <p className="flex justify-between"><span className="text-[var(--muted)]">Filter</span><span className="capitalize">{selected.filter}</span></p>
                  <p className="flex justify-between"><span className="text-[var(--muted)]">Saved</span><span className="text-right">{new Date(selected.createdAt).toLocaleDateString()}</span></p>
                </div>
              </div>

              {qr && (
                <div className="text-center p-3 rounded-xl bg-white border border-[var(--line)]">
                  <img src={qr} alt="Share QR code" className="w-28 h-28 mx-auto" />
                  <p className="text-[10px] text-gray-500 mt-1.5 break-all">{shareUrl(selected.id)}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-auto">
                <button className="btn btn-sm btn-primary col-span-2" onClick={() => downloadDataUrl(selected.image, `snapgrid-${stamp()}.png`)}><Download size={14} /> Download</button>
                <button className="btn btn-sm btn-ghost" onClick={() => void downloadZip(selected)}><FileArchive size={14} /> ZIP</button>
                <button className="btn btn-sm btn-ghost" onClick={() => { if (!printImage(selected.image, 'Snapgrid')) toast.error('Please allow pop-ups to print.') }}><Printer size={14} /> Print</button>
                <button className="btn btn-sm btn-soft col-span-2" onClick={() => void openQr(selected)}><QrCode size={14} /> Share via QR</button>
                <button className="btn btn-sm btn-danger col-span-2" onClick={() => { removeCapture(selected.id); setSelected(null); setQr(null) }}><Trash2 size={14} /> Delete from history</button>
              </div>
              <p className="text-[10px] text-[var(--muted)] flex items-center gap-1 justify-center"><CheckCircle2 size={11} className="text-emerald-500" /> Stored on this device</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
