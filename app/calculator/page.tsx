import type { Metadata } from 'next'
import Link from 'next/link'
import { ALL_CALCULATORS, CALC_CATEGORIES } from '@/lib/calculators'

export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Free Online Calculators — Finance, Tax, Mortgage, Health & More',
  description:
    'Browse 300+ free online calculators for finance, tax, mortgage, salary, health, math, business, and retirement. No signup required.',
  openGraph: {
    title: 'Free Online Calculators | USA-Calc',
    description: '300+ free calculators for finance, tax, mortgage, health, and more.',
  },
}

export default function CalculatorListPage() {
  const byCategory = CALC_CATEGORIES.map((cat) => ({
    ...cat,
    calcs: ALL_CALCULATORS.filter((c) => c.cat === cat.slug),
  }))

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, margin: '0 0 0.75rem' }}>
          Free Online Calculators
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 1.5rem' }}>
          {ALL_CALCULATORS.length}+ calculators for finance, tax, mortgage, salary, health, and more. Free, instant, no account needed.
        </p>
        {/* Category jump links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {CALC_CATEGORIES.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug.toLowerCase()}`}
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
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </section>

      {/* Category sections */}
      {byCategory.map((cat) => (
        <section
          key={cat.slug}
          id={cat.slug.toLowerCase()}
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

          {/* Calculator grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.75rem',
              marginTop: '1rem',
            }}
          >
            {cat.calcs.map((calc) => (
              <Link
                key={calc.slug}
                href={`/calculator/${calc.slug}`}
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
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{calc.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', lineHeight: 1.3 }}>
                      {calc.title}
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
                      {calc.desc}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
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
          All {ALL_CALCULATORS.length} calculators are free and work directly in your browser — no data is sent to any server.
        </p>
      </div>
    </div>
  )
}
