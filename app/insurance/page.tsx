import type { Metadata } from 'next'
import Link from 'next/link'
import { NATIONAL_AUTO_AVG, AUTO_INSURANCE_BY_STATE } from '@/lib/insurance/data'

export const metadata: Metadata = {
  title: 'Insurance Guides & Cost Estimators 2025 | Calchive',
  description:
    'Real insurance cost data for all 50 states. Auto insurance rates, life insurance premiums by age, health insurance plans, and home insurance averages — no estimates, actual 2025 data.',
  alternates: { canonical: '/insurance' },
  openGraph: {
    title: 'Insurance Guides & Cost Estimators 2025 | Calchive',
    description: 'Auto, home, life, and health insurance costs for every US state — real 2025 data.',
    type: 'website',
  },
}

const TOP_AUTO_STATES = [
  { slug: 'michigan', name: 'Michigan', rate: 3200 },
  { slug: 'florida', name: 'Florida', rate: 2900 },
  { slug: 'louisiana', name: 'Louisiana', rate: 2800 },
  { slug: 'new-york', name: 'New York', rate: 2500 },
  { slug: 'nevada', name: 'Nevada', rate: 2400 },
  { slug: 'texas', name: 'Texas', rate: 1800 },
  { slug: 'california', name: 'California', rate: 1900 },
  { slug: 'ohio', name: 'Ohio', rate: 1400 },
]

const LIFE_AGES = [25, 30, 35, 40, 45, 50, 55, 60]

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

export default function InsurancePage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Hero */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badge}>Insurance Data 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          Real Insurance Costs for Every State
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          National average auto insurance: <strong style={{ color: 'var(--text)' }}>${NATIONAL_AUTO_AVG.toLocaleString()}/year</strong>.
          Michigan pays 83% more than that. See the full picture for your state.
        </p>
      </header>

      {/* Auto Insurance by State */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Auto Insurance by State
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          Average annual full-coverage premiums, 2025.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {TOP_AUTO_STATES.map(s => {
            const pct = Math.round(((s.rate - NATIONAL_AUTO_AVG) / NATIONAL_AUTO_AVG) * 100)
            return (
              <Link
                key={s.slug}
                href={`/insurance/auto-insurance-${s.slug}`}
                style={{ ...card, textDecoration: 'none', display: 'block' }}
              >
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.name}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--accent)' }}>
                  ${s.rate.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: pct > 0 ? '#f87171' : '#34d399', marginTop: 2 }}>
                  {pct > 0 ? `+${pct}%` : `${pct}%`} vs national avg
                </div>
              </Link>
            )
          })}
        </div>
        <div style={{ marginTop: 12 }}>
          <Link
            href="/insurance/auto-insurance-california"
            style={{ fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}
          >
            See all 50 states →
          </Link>
        </div>
      </section>

      {/* Life Insurance by Age */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Life Insurance Rates by Age
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          Monthly premium for $500,000 20-year term policy, healthy non-smoker.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {LIFE_AGES.map(age => (
            <Link
              key={age}
              href={`/insurance/life-insurance-age-${age}`}
              style={{ ...card, textDecoration: 'none', display: 'block' }}
            >
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Age {age}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>→</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>See rates</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Driver-type pages */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Auto Insurance for Specific Drivers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {[
            { label: 'Teen Drivers', slug: 'teen-driver', extra: '75–150% surcharge' },
            { label: 'New Drivers', slug: 'new-driver', extra: 'First 3 years highest risk' },
            { label: 'Senior Drivers (65+)', slug: 'senior-driver', extra: 'Rates rise after 70' },
            { label: 'Bad Credit', slug: 'bad-credit-driver', extra: '+61% avg surcharge' },
            { label: 'High-Risk / DUI', slug: 'high-risk-driver', extra: '+80–100% surcharge' },
            { label: 'Rideshare (Uber/Lyft)', slug: 'rideshare-driver', extra: 'Gap coverage essential' },
            { label: 'Commercial', slug: 'commercial-driver', extra: '$1,200–$2,400/year' },
          ].map(d => (
            <Link
              key={d.slug}
              href={`/insurance/auto-insurance-for-${d.slug}`}
              style={{ ...card, textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{d.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{d.extra}</div>
              </div>
              <span style={{ color: 'var(--accent)', fontSize: 16 }}>→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Health Insurance */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Health Insurance
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          ACA marketplace 2025 premiums before subsidies: individual silver plan averages $519/month nationally.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            'aca-marketplace-guide', 'medicare-guide', 'medicaid-guide',
            'hmo-vs-ppo-vs-epo', 'health-insurance-for-self-employed',
            'cobra-insurance-guide',
          ].map(slug => (
            <Link
              key={slug}
              href={`/insurance/${slug}`}
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
              {slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                .replace('Aca', 'ACA').replace('Hmo', 'HMO').replace('Ppo', 'PPO').replace('Epo', 'EPO')} →
            </Link>
          ))}
        </div>
      </section>

      {/* Other guides */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Specialty Insurance Guides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
          {[
            { label: 'Renters Insurance', slug: 'renters-insurance-guide' },
            { label: 'Pet Insurance', slug: 'pet-insurance-guide' },
            { label: 'Travel Insurance', slug: 'travel-insurance-guide' },
            { label: 'Umbrella Insurance', slug: 'umbrella-insurance-guide' },
            { label: 'Short-Term Disability', slug: 'short-term-disability-guide' },
            { label: 'Long-Term Disability', slug: 'long-term-disability-guide' },
          ].map(g => (
            <Link
              key={g.slug}
              href={`/insurance/${g.slug}`}
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
