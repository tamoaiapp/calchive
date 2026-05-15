'use client'

import { useEffect, useRef } from 'react'

type Size = '320x50' | '468x60' | '728x90' | '300x250' | '160x300' | '160x600'

const KEYS: Record<Size, string> = {
  '320x50':  '874c44a77e48f52d4047ae712d7729eb',
  '468x60':  '273bf241835331635f154d0c1a34dbcd',
  '728x90':  'c9584f4b27ddb25756fe496389e45efb',
  '300x250': 'e4320d9f0f7e930d310ac6b51b301c92',
  '160x300': '71dd9a499dadec029a04ffddaa8f656c',
  '160x600': '02257b8019028629f0c44333ad4612b2',
}

const DIMS: Record<Size, { w: number; h: number }> = {
  '320x50':  { w: 320, h: 50 },
  '468x60':  { w: 468, h: 60 },
  '728x90':  { w: 728, h: 90 },
  '300x250': { w: 300, h: 250 },
  '160x300': { w: 160, h: 300 },
  '160x600': { w: 160, h: 600 },
}

interface Props {
  size: Size
  /** "desktop" hides on mobile (≤768px). "mobile" hides on desktop. */
  showOn?: 'all' | 'desktop' | 'mobile'
  className?: string
}

/**
 * Each banner is sandboxed in its own iframe to keep the global `atOptions`
 * from clobbering siblings when multiple banners share a page.
 */
export default function AdsterraBanner({ size, showOn = 'all', className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { w, h } = DIMS[size]
  const key = KEYS[size]

  useEffect(() => {
    if (!iframeRef.current) return
    const doc = iframeRef.current.contentDocument
    if (!doc) return
    doc.open()
    doc.write(
      `<!doctype html><html><head><style>html,body{margin:0;padding:0;background:transparent;}</style></head><body>` +
      `<script>var atOptions={'key':'${key}','format':'iframe','height':${h},'width':${w},'params':{}};</script>` +
      `<script src="https://www.highperformanceformat.com/${key}/invoke.js"></script>` +
      `</body></html>`,
    )
    doc.close()
  }, [key, w, h])

  const wrapperClass =
    showOn === 'desktop' ? 'ad-desktop-only'
    : showOn === 'mobile' ? 'ad-mobile-only'
    : ''

  return (
    <div
      className={[wrapperClass, className].filter(Boolean).join(' ')}
      style={{
        margin: '1.5rem auto',
        textAlign: 'center',
        display: 'block',
        minHeight: h,
      }}
      aria-label="Advertisement"
    >
      <iframe
        ref={iframeRef}
        width={w}
        height={h}
        style={{ border: 0, display: 'inline-block', maxWidth: '100%' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  )
}
