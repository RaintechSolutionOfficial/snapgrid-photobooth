import { Images } from 'lucide-react'
import { usePhotoboothStore } from '../../store/photoboothStore'

type Tile = {
  key: string
  grad: string
  emoji: string
  label: string
  image?: string
}

const samples: Tile[] = [
  { key: 's1', grad: 'linear-gradient(140deg,#ff9a9e,#fad0c4)', emoji: '🎈', label: 'Birthday bash' },
  { key: 's2', grad: 'linear-gradient(140deg,#a18cd1,#fbc2eb)', emoji: '✨', label: 'Neon nights' },
  { key: 's3', grad: 'linear-gradient(140deg,#84fab0,#8fd3f4)', emoji: '🌿', label: 'Garden party' },
  { key: 's4', grad: 'linear-gradient(140deg,#f6d365,#fda085)', emoji: '🌅', label: 'Golden hour' },
  { key: 's5', grad: 'linear-gradient(140deg,#ffecd2,#fcb69f)', emoji: '💛', label: 'Sunset crew' },
  { key: 's6', grad: 'linear-gradient(140deg,#a1c4fd,#c2e9fb)', emoji: '💙', label: 'Blue hour' },
  { key: 's7', grad: 'linear-gradient(140deg,#fbc2eb,#a6c1ee)', emoji: '🎉', label: 'Celebrate' },
  { key: 's8', grad: 'linear-gradient(140deg,#d4fc79,#96e6a1)', emoji: '🥳', label: 'Good vibes' },
]

function PhotoTile({ tile }: { tile: Tile }) {
  return (
    <div className="relative h-[150px] w-[210px] shrink-0 overflow-hidden rounded-2xl border border-[var(--line)] shadow-[var(--shadow-card)] sm:h-[168px] sm:w-[240px]">
      {tile.image ? (
        <img src={tile.image} alt={tile.label} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ background: tile.grad }}>
          <span className="text-[44px] drop-shadow-sm">{tile.emoji}</span>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-3 pb-2.5 pt-8">
        <span className="text-[12px] font-semibold text-white">{tile.label}</span>
      </div>
    </div>
  )
}

function MarqueeRow({ tiles, reverse }: { tiles: Tile[]; reverse?: boolean }) {
  const loop = [...tiles, ...tiles]
  return (
    <div className={reverse ? 'marquee-reverse overflow-hidden' : 'overflow-hidden'}>
      <div className="marquee-track gap-4 py-2">
        {loop.map((tile, index) => (
          <PhotoTile key={`${tile.key}-${index}`} tile={tile} />
        ))}
      </div>
    </div>
  )
}

export default function GalleryMarquee() {
  const captures = usePhotoboothStore((s) => s.captures)

  const realTiles: Tile[] = captures.slice(0, 4).map((capture, index) => ({
    key: `real-${capture.id ?? index}`,
    grad: 'linear-gradient(140deg,#a1c4fd,#c2e9fb)',
    emoji: '📸',
    label: capture.eventTitle || 'Your capture',
    image: capture.image,
  }))

  const rowOne = [...realTiles, ...samples]
  const rowTwo = [...samples.slice().reverse(), ...realTiles]

  return (
    <section id="gallery" className="scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div className="mx-auto mb-12 w-full max-w-7xl px-5 text-center sm:px-8 lg:px-12">
        <div className="reveal">
          <span className="mono inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            <Images size={14} /> The gallery
          </span>
          <h2 className="wordmark mt-3 text-[clamp(2rem,4.5vw,3.25rem)] leading-tight text-[var(--ink)]">
            Made for the moments worth keeping
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--muted)]">
            A little inspiration — and, once you start shooting, your own captures right here.
          </p>
        </div>
      </div>

      <div className="reveal space-y-4">
        <MarqueeRow tiles={rowOne} />
        <MarqueeRow tiles={rowTwo} reverse />
      </div>
    </section>
  )
}
