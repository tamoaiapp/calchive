'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { label: 'Calculators', href: '/calculator' },
  { label: 'Tools', href: '/tool' },
  { label: 'Salary', href: '/salary' },
  { label: 'Tax', href: '/tax' },
  { label: 'Mortgage', href: '/mortgage' },
  { label: 'Health', href: '/health' },
  { label: 'Careers', href: '/career' },
]

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 15, 30, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '-0.5px',
            background: 'var(--brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            flexShrink: 0,
          }}
        >
          Calchive
        </Link>

        {/* Desktop Nav */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--muted)',
                transition: 'color 0.15s, background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--muted)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Hamburger button — mobile only */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: 5,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 8,
          }}
          id="hamburger-btn"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: 22,
                height: 2,
                background: 'var(--text)',
                borderRadius: 2,
                transition: 'transform 0.2s, opacity 0.2s',
                transformOrigin: 'center',
                transform:
                  open && i === 0
                    ? 'translateY(7px) rotate(45deg)'
                    : open && i === 2
                    ? 'translateY(-7px) rotate(-45deg)'
                    : open && i === 1
                    ? 'scaleX(0)'
                    : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile Nav Drawer */}
      {open && (
        <nav
          style={{
            background: 'var(--bg2)',
            borderTop: '1px solid var(--line)',
            padding: '12px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 500,
                color: 'var(--muted)',
                display: 'block',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Responsive styles via a style tag */}
      <style>{`
        @media (max-width: 768px) {
          nav[aria-label="Main navigation"] {
            display: none !important;
          }
          #hamburger-btn {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  )
}
