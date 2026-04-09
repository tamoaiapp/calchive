import type { Metadata } from 'next'
import Link from 'next/link'
import { CREDIT_SCORE_RANGES } from '@/lib/credit/data'

export const metadata: Metadata = {
  title: 'Credit Score Guides, Card Interest & Debt Calculators 2025 | USA-Calc',
  description:
    'What does your credit score mean? See what you qualify for at every FICO score from 500–850, credit card interest costs, and debt payoff plans. Real 2025 data.',
  alternates: { canonical: '/credit' },
  openGraph: {
    title: 'Credit Score Guides & Debt Calculators 2025 | USA-Calc',
    description: 'Credit scores 500–850 explained — what you qualify for, interest rates, and how to improve.',
    type: 'website',
  },
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.25rem 1.5rem',
}

const badge: React.CSSProperties = {
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

const POPULAR_SCORES = [580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820]

export default function CreditPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badge}>Credit Guide 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          What Does Your Credit Score Mean?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 620, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          The average US FICO score is 716 — Good tier. A 760+ score unlocks the best mortgage rates.
          A 620 score costs $200+/month more on a $300k mortgage.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {POPULAR_SCORES.map(score => (
            <Link
              key={score}
              href={`/credit/credit-score-${score}`}
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
              {score}
            </Link>
          ))}
        </div>
      </header>

      {/* Score ranges */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          FICO Score Ranges
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CREDIT_SCORE_RANGES.map(range => (
            <div key={range.label} style={{ ...card, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%', background: range.color, flexShrink: 0,
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: 'var(--text)', fontSize: 15 }}>{range.label}</span>
                  <span style={{ fontWeight: 700, color: range.color, fontSize: 14 }}>
                    {range.min}–{range.max}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{range.description}</div>
              </div>
              <Link
                href={`/credit/credit-score-${range.min}`}
                style={{ fontSize: 13, color: 'var(--accent)', textDecoration: 'none', flexShrink: 0 }}
              >
                See details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Credit card interest */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Credit Card Interest Costs
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          How much carrying a balance actually costs you.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { apr: 19.99, balance: 5000, label: '$5,000 at 19.99% APR' },
            { apr: 24.99, balance: 10000, label: '$10,000 at 24.99% APR' },
            { apr: 22.99, balance: 2000, label: '$2,000 at 22.99% APR' },
            { apr: 29.99, balance: 5000, label: '$5,000 at 29.99% APR' },
          ].map(item => {
            const aprStr = item.apr.toFixed(2).replace('.', '-')
            return (
              <Link
                key={`${item.apr}-${item.balance}`}
                href={`/credit/credit-card-interest-${aprStr}-${item.balance}`}
                style={{ ...card, textDecoration: 'none', display: 'block' }}
              >
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                  See monthly payment & true cost
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Debt payoff */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Debt Payoff Plans
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { balance: 10000, months: 24 },
            { balance: 20000, months: 36 },
            { balance: 50000, months: 60 },
            { balance: 15000, months: 36 },
          ].map(item => (
            <Link
              key={`${item.balance}-${item.months}`}
              href={`/credit/debt-payoff-${item.balance}-${item.months}-months`}
              style={{ ...card, textDecoration: 'none', display: 'block' }}
            >
              <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>
                ${item.balance.toLocaleString()}
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                Paid off in {item.months} months
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Credit & Debt Guides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
          {[
            { label: 'Improve Credit Score by 100 Points', slug: 'how-to-improve-credit-score-by-100-points' },
            { label: 'Debt Consolidation Guide', slug: 'debt-consolidation-guide' },
            { label: 'Best Cards for Beginners', slug: 'best-credit-cards-for-beginners' },
            { label: 'Balance Transfer Guide', slug: 'credit-card-balance-transfer-guide' },
            { label: 'Bankruptcy Chapter 7 Guide', slug: 'bankruptcy-guide-chapter-7' },
            { label: 'Student Loan Debt Guide', slug: 'student-loan-debt-guide' },
          ].map(g => (
            <Link
              key={g.slug}
              href={`/credit/${g.slug}`}
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
              {g.label} →
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
