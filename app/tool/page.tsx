import type { Metadata } from 'next'
import Link from 'next/link'
import { ALL_TOOLS, TOOL_CATEGORIES } from '@/lib/tools'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Free Online Tools — Converters, Calculators, Generators & References | Calchive',
  description:
    'Browse 300+ free online tools: unit converters, tax reference tables, password generators, real estate guides, career tools, and lifestyle utilities. No signup required.',
  openGraph: {
    title: 'Free Online Tools | Calchive',
    description: '300+ free tools — converters, generators, checkers, and reference tables.',
  },
  alternates: {
    canonical: '/tool',
  },
}

export default function ToolListPage() {
  const byCategory = TOOL_CATEGORIES.map((cat) => ({
    ...cat,
    tools: ALL_TOOLS.filter((t) => t.cat === cat.slug),
  }))

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
          Free Online Tools
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 1.5rem' }}>
          {ALL_TOOLS.length}+ tools — converters, reference tables, generators, estimators, and checkers. Free, instant, no account needed.
        </p>
        {/* Category jump links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {TOOL_CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: 99,
                background: 'var(--card)',
                border: '1px solid var(--line)',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: 'background 0.15s',
              }}
            >
              {cat.icon} {cat.name} ({ALL_TOOLS.filter((t) => t.cat === cat.slug).length})
            </a>
          ))}
        </div>
      </section>

      {/* Category sections */}
      {byCategory.map((cat) => (
        <section
          key={cat.slug}
          id={cat.slug}
          style={{ marginBottom: '3rem' }}
        >
          {/* Section header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>{cat.name}</h2>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem' }}>{cat.desc}</p>
            </div>
          </div>

          {/* Tool grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            {cat.tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tool/${tool.slug}`}
                style={{
                  display: 'block',
                  padding: '1rem 1.1rem',
                  borderRadius: 14,
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{tool.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}>
                      {tool.title}
                    </div>
                    <div
                      style={{
                        color: 'var(--muted)',
                        fontSize: '0.8rem',
                        marginTop: '0.25rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {tool.desc}
                    </div>
                    <div
                      style={{
                        marginTop: '0.4rem',
                        fontSize: '0.72rem',
                        color: 'var(--accent)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {tool.toolType}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom note */}
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'var(--card)',
          borderRadius: 18,
          border: '1px solid var(--line)',
          marginTop: '2rem',
        }}
      >
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem' }}>
          All {ALL_TOOLS.length} tools run entirely in your browser — no data is stored or sent to any server.
        </p>
      </div>
    </div>
  )
}
