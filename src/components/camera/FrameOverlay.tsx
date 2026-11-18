import type { ReactNode, RefObject } from 'react'
import type { FrameStyle } from '../../types'
import { frameAccent, frameInsets, framePaper } from '../../utils/frame'

type Props = {
  frame: FrameStyle
  caption?: string
  /** The live photo window needs pointer events so effects stay draggable. */
  interactive?: boolean
  windowRef?: RefObject<HTMLDivElement>
  children?: ReactNode
}

/** Wraps the live viewfinder / a captured shot in the selected paper frame. */
export function FrameOverlay({ frame, caption, interactive = false, windowRef, children }: Props) {
  const geo = frameInsets(frame)

  if (frame === 'none') {
    return <div className={`absolute inset-0 ${interactive ? '' : 'pointer-events-none'}`} ref={windowRef}>{children}</div>
  }

  const accent = frameAccent(frame)
  const isPolaroid = frame === 'polaroid'

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden [container-type:inline-size]"
      style={{
        background: framePaper(frame),
        borderRadius: isPolaroid ? 5 : frame === 'classic' ? 6 : 8,
        boxShadow: isPolaroid
          ? '0 10px 26px rgba(0,0,0,.32), inset 0 0 0 1px rgba(0,0,0,.05)'
          : frame === 'classic'
            ? 'inset 0 0 0 1px rgba(0,0,0,.06)'
            : undefined,
      }}
    >
      <div
        ref={windowRef}
        className={`absolute overflow-hidden ${interactive ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          inset: geo.css,
          borderRadius: isPolaroid ? 3 : 6,
          border: accent ? `3px solid ${accent}` : undefined,
          boxShadow: frame === 'neon' ? `0 0 16px ${accent}, inset 0 0 14px ${accent}80` : undefined,
        }}
      >
        {children}
      </div>

      {isPolaroid && (
        <span
          className="absolute inset-x-0 bottom-0 flex items-center justify-center px-2 text-center italic"
          style={{
            height: `${geo.bottom * 100}%`,
            fontSize: 'clamp(9px, 3.6cqw, 30px)',
            fontWeight: 600,
            color: '#2b2f38',
            letterSpacing: '0.02em',
            transform: 'rotate(-1.5deg)',
          }}
        >
          {caption || 'snapgrid'}
        </span>
      )}
    </div>
  )
}
