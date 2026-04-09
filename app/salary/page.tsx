import type { Metadata } from 'next'
import Link from 'next/link'
import { STATES_ALL } from '@/lib/salary/states'
import { PROFESSIONS, PROFESSION_CATEGORIES } from '@/lib/salary/professions'

export const metadata: Metadata = {
  title: 'Salary After Tax Calculator by State | Calchive',
  description:
    'Calculate your take-home pay for any salary in all 50 US states. Real 2025 federal and state tax data. See monthly, weekly, and hourly breakdowns.',
  alternates: { canonical: '/salary' },
  openGraph: {
    title: 'Salary After Tax Calculator by State | Calchive',
    description: 'Calculate take-home pay for any salary in all 50 US states — real 2025 tax data.',
    type: 'website',
  },
}

const POPULAR_AMOUNTS = [30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000, 250000]

const TOP_STATES = STATES_ALL.filter(s =>
  ['california', 'texas', 'new-york', 'florida', 'washington', 'illinois',
    'pennsylvania', 'ohio', 'georgia', 'north-carolina', 'colorado', 'massachusetts'].includes(s.slug)
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

export default function SalaryIndexPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Hero */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badgeStyle}>Salary After Tax 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          What&apos;s Your Real Take-Home Pay?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 620, margin: '0 auto 2rem', lineHeight: 1.6 }}>
          Enter any salary and state to get an exact after-tax breakdown — federal, state, FICA, and
          more. Real 2025 brackets, not estimates.
        </p>

        {/* Quick salary links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: '1rem' }}>
          {POPULAR_AMOUNTS.map(amount => (
            <Link
              key={amount}
              href={`/salary/texas/${amount}`}
              style={{
                padding: '8px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 20,
                color: 'var(--muted)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              ${(amount / 1000).toFixed(0)}k
            </Link>
          ))}
        </div>
      </header>

      {/* By State Grid */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Salary After Tax by State
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {TOP_STATES.map(state => (
            <div key={state.slug} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <strong style={{ fontSize: 15, color: 'var(--text)' }}>{state.name}</strong>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                  background: state.hasIncomeTax ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
                  color: state.hasIncomeTax ? '#f87171' : '#34d399',
                }}>
                  {state.hasIncomeTax ? `${(state.incomeTaxRate * 100).toFixed(1)}%` : 'No Tax'}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[50000, 75000, 100000].map(amount => (
                  <Link
                    key={amount}
                    href={`/salary/${state.slug}/${amount}`}
                    style={{
                      fontSize: 13,
                      color: 'var(--accent)',
                      textDecoration: 'none',
                    }}
                  >
                    ${(amount / 1000).toFixed(0)}k salary →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <details>
            <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
              Show all {STATES_ALL.length} states
            </summary>
            <div
              style={{
                marginTop: 12,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 8,
              }}
            >
              {STATES_ALL.map(state => (
                <Link
                  key={state.slug}
                  href={`/salary/${state.slug}/75000`}
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
        </div>
      </section>

      {/* By Profession */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Salary After Tax by Career
        </h2>
        {PROFESSION_CATEGORIES.map(category => {
          const profs = PROFESSIONS.filter(p => p.category === category).slice(0, 8)
          return (
            <div key={category} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {category}
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: 10,
                }}
              >
                {profs.map(p => (
                  <Link
                    key={p.slug}
                    href={`/salary/career/${p.slug}`}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                      borderRadius: 12,
                      textDecoration: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 500 }}>{p.title}</span>
                    <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>
                      ${(p.medianSalary / 1000).toFixed(0)}k
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
        <Link
          href="/salary/career"
          style={{
            display: 'inline-block',
            marginTop: 8,
            padding: '10px 20px',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          View All {PROFESSIONS.length} Careers →
        </Link>
      </section>
    </div>
  )
}
