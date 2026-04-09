import type { Metadata } from 'next'
import Link from 'next/link'
import { STATES_ALL } from '@/lib/salary/states'
import { MORTGAGE_RATES_2025 } from '@/lib/mortgage/data'

export const metadata: Metadata = {
  title: 'Mortgage Payment Calculator by State & Price | USA-Calc',
  description:
    'Calculate your exact monthly mortgage payment for any home price in all 50 US states. Includes property tax, insurance, PMI, and 30-year vs 15-year comparison.',
  alternates: { canonical: '/mortgage' },
  openGraph: {
    title: 'Mortgage Payment Calculator by State & Price | USA-Calc',
    description: 'Monthly mortgage payment for any home price in all 50 US states — real 2025 rates and tax data.',
    type: 'website',
  },
}

const POPULAR_PRICES = [200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 750000, 1000000]

const TOP_STATES = STATES_ALL.filter(s =>
  ['california', 'texas', 'new-york', 'florida', 'washington', 'illinois',
    'pennsylvania', 'ohio', 'georgia', 'north-carolina', 'colorado', 'arizona'].includes(s.slug)
)

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.25rem 1.5rem',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 10px',
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.04em',
  background: 'rgba(59,130,246,0.13)',
  color: '#60a5fa',
  textTransform: 'uppercase',
  marginBottom: 10,
}

function formatPrice(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`
  return `$${(n / 1000).toFixed(0)}k`
}

export default function MortgageIndexPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Hero */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badgeStyle}>Mortgage Calculator 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          What&apos;s the Monthly Payment on Your Mortgage?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Real payment breakdowns for any home price in all 50 states — principal, property tax,
          insurance, and PMI. Current 30-year rate: <strong style={{ color: 'var(--text)' }}>{MORTGAGE_RATES_2025.rate30Fixed}%</strong>.
        </p>

        {/* Price quick links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: '1rem' }}>
          {POPULAR_PRICES.map(price => (
            <Link
              key={price}
              href={`/mortgage/texas-${price}`}
              style={{
                padding: '8px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                color: 'var(--muted)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {formatPrice(price)}
            </Link>
          ))}
        </div>
      </header>

      {/* Current rates banner */}
      <section style={{ ...card, marginBottom: '2.5rem', background: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>
          Average Mortgage Rates — April 2025
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {[
            { label: '30-Year Fixed', rate: MORTGAGE_RATES_2025.rate30Fixed },
            { label: '15-Year Fixed', rate: MORTGAGE_RATES_2025.rate15Fixed },
            { label: '5/1 ARM', rate: MORTGAGE_RATES_2025.rate5ARM },
            { label: 'FHA 30-Year', rate: MORTGAGE_RATES_2025.fhaRate30 },
            { label: 'VA 30-Year', rate: MORTGAGE_RATES_2025.vaRate30 },
            { label: 'Jumbo 30-Year', rate: MORTGAGE_RATES_2025.jumboRate30 },
          ].map(({ label, rate }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>{rate}%</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* By State Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Mortgage Payments by State
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: 12,
          }}
        >
          {TOP_STATES.map(state => (
            <div key={state.slug} style={card}>
              <strong style={{ fontSize: 15, color: 'var(--text)', display: 'block', marginBottom: 8 }}>
                {state.name}
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[250000, 350000, 500000].map(price => (
                  <Link
                    key={price}
                    href={`/mortgage/${state.slug}-${price}`}
                    style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    {formatPrice(price)} home →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
            Show all {STATES_ALL.length} states
          </summary>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {STATES_ALL.map(state => (
              <Link
                key={state.slug}
                href={`/mortgage/${state.slug}-350000`}
                style={{
                  padding: '8px 12px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 10,
                  fontSize: 13,
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{state.name}</span>
                <span style={{ color: 'var(--dim)' }}>{state.abbr}</span>
              </Link>
            ))}
          </div>
        </details>
      </section>

      {/* Popular searches */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Most Popular Mortgage Calculations
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {[
            { label: '$350,000 home in Texas', href: '/mortgage/texas-350000' },
            { label: '$500,000 home in California', href: '/mortgage/california-500000' },
            { label: '$300,000 home in Florida', href: '/mortgage/florida-300000' },
            { label: '$400,000 home in New York', href: '/mortgage/new-york-400000' },
            { label: '$250,000 home in Ohio', href: '/mortgage/ohio-250000' },
            { label: '$600,000 home in Washington', href: '/mortgage/washington-600000' },
            { label: '$450,000 home in Georgia', href: '/mortgage/georgia-450000' },
            { label: '$750,000 home in Colorado', href: '/mortgage/colorado-750000' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '12px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                color: 'var(--muted)',
                fontSize: 14,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ color: 'var(--accent)' }}>🏠</span>
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Rate scenarios */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Mortgage Payment at Different Rates
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[4.0, 5.0, 6.0, 6.5, 7.0, 7.5, 8.0].map(rate => {
            const rateStr = rate.toFixed(1).replace('.', '-')
            return (
              <Link
                key={rate}
                href={`/mortgage/mortgage-rate-${rateStr}-300000`}
                style={{
                  padding: '12px 16px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  color: 'var(--muted)',
                  fontSize: 14,
                  textDecoration: 'none',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 18 }}>{rate}%</div>
                <div style={{ fontSize: 12, marginTop: 2 }}>rate on $300k home →</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Guides */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Mortgage Guides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
          {[
            { title: 'How Much House Can I Afford?', href: '/mortgage/how-much-house-can-i-afford' },
            { title: 'FHA vs Conventional Loans', href: '/mortgage/fha-vs-conventional' },
            { title: 'What Is PMI?', href: '/mortgage/pmi-explained' },
            { title: '15 vs 30 Year Mortgage', href: '/mortgage/15-vs-30-year-mortgage' },
            { title: 'VA Loan Guide', href: '/mortgage/va-loan-guide' },
            { title: 'ARM vs Fixed-Rate', href: '/mortgage/arm-vs-fixed-rate' },
          ].map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                padding: '14px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                color: 'var(--text)',
                fontSize: 14,
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              {title} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
