'use client'

import { useEffect, useRef } from 'react'

interface AdSlotProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'leaderboard'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdSlot({ slot, format = 'auto', className }: AdSlotProps) {
  const isDev = process.env.NODE_ENV !== 'production'
  const insRef = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (isDev || pushed.current) return
    try {
      pushed.current = true
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded
    }
  }, [isDev])

  const dimensions: Record<string, { width: number; height: number }> = {
    auto: { width: 728, height: 90 },
    rectangle: { width: 336, height: 280 },
    leaderboard: { width: 728, height: 90 },
  }

  const dim = dimensions[format]

  if (isDev) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          maxWidth: dim.width,
          height: dim.height,
          background: 'var(--card)',
          border: '1px dashed var(--dim)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          margin: '0 auto',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ad Space
        </span>
        <span style={{ fontSize: 10, color: 'var(--dim)' }}>
          {format} — slot: {slot}
        </span>
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
    >
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6916421107498737"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
