import type { Metadata } from 'next'
import Link from 'next/link'
import { LOAN_RATES_2025 } from '@/lib/loan/data'
import { PERSONAL_AMOUNTS, PERSONAL_TERMS, AUTO_AMOUNTS, AUTO_TERMS, STUDENT_AMOUNTS } from '@/lib/loan/pages-manifest'

export const metadata: Metadata = {
  title: 'Loan Payment Calculator — Personal, Auto & Student | Calchive',
  description:
    'Calculate monthly payments for personal loans, auto loans, student loans, and credit card payoff. Real 2025 interest rates by credit score. Full amortization breakdowns.',
  alternates: { canonical: '/loan' },
  openGraph: {
    title: 'Loan Payment Calculator — Personal, Auto & Student | Calchive',
    description: 'Monthly payments for any loan amount and term — real 2025 interest rate data by credit score.',
    type: 'website',
  },
}

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

function formatAmount(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `$${n}`
}

const POPULAR_PERSONAL = [
  { amount: 5000, term: 36 },
  { amount: 10000, term: 60 },
  { amount: 15000, term: 60 },
  { amount: 25000, term: 60 },
  { amount: 50000, term: 72 },
]

const POPULAR_AUTO = [
  { amount: 20000, term: 60 },
  { amount: 25000, term: 60 },
  { amount: 35000, term: 72 },
  { amount: 50000, term: 72 },
]

export default function LoanIndexPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Hero */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badgeStyle}>Loan Calculator 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          Monthly Loan Payment Calculator
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 2rem', lineHeight: 1.6 }}>
          See the exact monthly payment for any loan — personal, auto, student, or credit card.
          Rates shown by credit score tier using real 2025 lender data.
        </p>
      </header>

      {/* Current rates snapshot */}
      <section style={{ ...card, marginBottom: '2.5rem', background: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>
          Average Loan Rates by Credit Score — 2025
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Personal Loan', excellent: `${LOAN_RATES_2025.personal.excellent}%`, bad: `${LOAN_RATES_2025.personal.bad}%` },
            { label: 'New Auto Loan', excellent: `${LOAN_RATES_2025.auto_new.excellent}%`, bad: `${LOAN_RATES_2025.auto_new.bad}%` },
            { label: 'Student (Federal)', excellent: `${LOAN_RATES_2025.student_federal_undergrad}%`, bad: '—' },
          ].map(({ label, excellent, bad }) => (
            <div key={label} style={{ background: 'var(--bg2)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8, fontWeight: 600 }}>{label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ color: '#34d399' }}>Excellent: {excellent}</span>
                <span style={{ color: '#f87171' }}>Poor: {bad}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Personal loans */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Personal Loans</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
          Rates range from {LOAN_RATES_2025.personal.excellent}% (excellent credit) to {LOAN_RATES_2025.personal.bad}% (poor credit) for unsecured personal loans.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {POPULAR_PERSONAL.map(({ amount, term }) => (
            <Link
              key={`${amount}-${term}`}
              href={`/loan/personal-loan-${amount}-${term}-months`}
              style={{
                padding: '14px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 18 }}>{formatAmount(amount)}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{term}-month loan →</div>
            </Link>
          ))}
        </div>
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
            All personal loan amounts &amp; terms
          </summary>
          <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {PERSONAL_AMOUNTS.slice(0, 10).map(amount =>
              PERSONAL_TERMS.map(term => (
                <Link
                  key={`${amount}-${term}`}
                  href={`/loan/personal-loan-${amount}-${term}-months`}
                  style={{
                    padding: '8px 12px',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    fontSize: 13,
                    color: 'var(--muted)',
                    textDecoration: 'none',
                  }}
                >
                  {formatAmount(amount)} / {term} mo
                </Link>
              ))
            )}
          </div>
        </details>
      </section>

      {/* Auto loans */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Auto Loans</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
          New car rates from {LOAN_RATES_2025.auto_new.excellent}% to {LOAN_RATES_2025.auto_new.bad}%.
          Used car rates from {LOAN_RATES_2025.auto_used.excellent}% to {LOAN_RATES_2025.auto_used.bad}%.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {POPULAR_AUTO.map(({ amount, term }) => (
            <Link
              key={`${amount}-${term}`}
              href={`/loan/auto-loan-${amount}-${term}-months`}
              style={{
                padding: '14px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 18 }}>{formatAmount(amount)}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{term}-month auto loan →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Student loans */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Student Loans</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
          Federal undergraduate rate: {LOAN_RATES_2025.student_federal_undergrad}%.
          Federal graduate rate: {LOAN_RATES_2025.student_federal_grad}%.
          Standard repayment term: 10 years.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {STUDENT_AMOUNTS.map(amount => (
            <Link
              key={amount}
              href={`/loan/student-loan-${amount}`}
              style={{
                padding: '14px 16px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                textDecoration: 'none',
              }}
            >
              <div style={{ fontWeight: 800, color: 'var(--text)', fontSize: 18 }}>{formatAmount(amount)}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>student loan →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Credit card payoff */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 8 }}>Credit Card Payoff</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16 }}>
          How long will it take to pay off your credit card balance? Calculate by balance and APR.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { balance: 5000, apr: 19.99 },
            { balance: 10000, apr: 24.99 },
            { balance: 15000, apr: 19.99 },
            { balance: 20000, apr: 24.99 },
            { balance: 25000, apr: 29.99 },
            { balance: 50000, apr: 24.99 },
          ].map(({ balance, apr }) => {
            const aprStr = apr.toFixed(2).replace('.', '-')
            return (
              <Link
                key={`${balance}-${apr}`}
                href={`/loan/credit-card-payoff-${balance}-${aprStr}`}
                style={{
                  padding: '12px 16px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontSize: 14,
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text)' }}>{formatAmount(balance)}</span> at {apr}% APR →
              </Link>
            )
          })}
        </div>
      </section>

      {/* Guides */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>Loan Guides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
          {[
            { title: 'Personal Loan Rates Guide 2025', href: '/loan/personal-loan-rates-guide' },
            { title: 'Auto Loan Guide', href: '/loan/auto-loan-guide' },
            { title: 'Student Loan Guide', href: '/loan/student-loan-guide' },
            { title: 'Debt Consolidation Guide', href: '/loan/debt-consolidation-guide' },
            { title: 'Debt Avalanche vs Snowball', href: '/loan/debt-avalanche-vs-snowball' },
            { title: 'APR vs Interest Rate', href: '/loan/apr-vs-interest-rate-guide' },
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
