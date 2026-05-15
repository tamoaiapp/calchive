'use client'

import { useEffect, useRef } from 'react'
import AdsterraBanner from './AdsterraBanner'
import AdsterraNative from './AdsterraNative'

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

/**
 * Dual-network ad slot: renders AdSense (Google) AND Adsterra side-by-side
 * for every call site. Different networks, different revenue streams,
 * one component to edit.
 *
 * Format mapping:
 *   leaderboard / auto -> AdSense 728x90 + Adsterra 728x90 (desktop) / 320x50 (mobile)
 *   rectangle          -> AdSense 336x280 + Adsterra 300x250
 */
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
  const isRect = format === 'rectangle'

  const adsenseBlock = isDev ? (
    <div
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
        AdSense · {format}
      </span>
      <span style={{ fontSize: 10, color: 'var(--dim)' }}>slot: {slot}</span>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
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

  return (
    <div className={className} style={{ width: '100%' }}>
      {adsenseBlock}
      {isRect ? (
        <AdsterraBanner size="300x250" />
      ) : (
        <>
          <AdsterraBanner size="728x90" showOn="desktop" />
          <AdsterraBanner size="320x50" showOn="mobile" />
        </>
      )}
    </div>
  )
}
