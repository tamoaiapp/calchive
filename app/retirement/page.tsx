import type { Metadata } from 'next'
import Link from 'next/link'
import { SS_CLAIMING_BENEFIT, K401_BENCHMARK_MULTIPLIER } from '@/lib/retirement/pages-manifest'

export const metadata: Metadata = {
  title: 'Retirement Planning: Can You Retire? Social Security & 401k | USA-Calc',
  description:
    'Can you retire at 62 with $1 million? How much should you have in your 401k at 50? Real retirement benchmarks, Social Security claiming data, and income projections.',
  alternates: { canonical: '/retirement' },
  openGraph: {
    title: 'Retirement Planning Guides & Calculators 2026 | USA-Calc',
    description: 'Retire-at pages, Social Security claiming analysis, 401k benchmarks — all with real data.',
    type: 'website',
  },
}

const POPULAR_RETIRE = [
  { age: 62, amount: 1000000 },
  { age: 65, amount: 1000000 },
  { age: 67, amount: 1500000 },
  { age: 62, amount: 500000 },
  { age: 65, amount: 2000000 },
  { age: 60, amount: 2000000 },
]

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

function fmtAmount(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 500000 === 0 ? 0 : 1)}M`
  return `$${(n / 1000).toFixed(0)}k`
}

function amountToSlug(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    return m === Math.floor(m) ? `${m}m` : `${m.toFixed(1).replace('.', '-')}m`
  }
  return `${n / 1000}k`
}

export default function RetirementPage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badge}>Retirement Planning 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          Can You Retire? Let&apos;s Run the Numbers.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          The 4% rule says $1 million generates $40,000/year in retirement.
          Social Security at 62 pays 30% less than waiting until 67.
          The math matters — here it is.
        </p>
      </header>

      {/* Popular retire-at pages */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Can I Retire at [Age] With [Amount]?
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          4% rule annual income shown. The 4% rule assumes a 30-year retirement with 50/50 stock/bond portfolio.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {POPULAR_RETIRE.map(({ age, amount }) => (
            <Link
              key={`${age}-${amount}`}
              href={`/retirement/retire-at-${age}-with-${amountToSlug(amount)}`}
              style={{ ...card, textDecoration: 'none', display: 'block' }}
            >
              <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 4 }}>
                Retire at {age} with
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text)' }}>{fmtAmount(amount)}</div>
              <div style={{ fontSize: 14, color: '#10b981', fontWeight: 700, marginTop: 4 }}>
                ${((amount * 0.04) / 1000).toFixed(0)}k/year
              </div>
              <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 2 }}>via 4% rule</div>
            </Link>
          ))}
        </div>
        <details style={{ marginTop: 16 }}>
          <summary style={{ cursor: 'pointer', color: 'var(--muted)', fontSize: 14, fontWeight: 600 }}>
            See all retirement scenarios
          </summary>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {[55, 60, 62, 65, 67, 70].flatMap(age =>
              [250000, 500000, 750000, 1000000, 1500000, 2000000].map(amt => (
                <Link
                  key={`${age}-${amt}`}
                  href={`/retirement/retire-at-${age}-with-${amountToSlug(amt)}`}
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
                  Age {age} · {fmtAmount(amt)}
                </Link>
              ))
            )}
          </div>
        </details>
      </section>

      {/* Social Security */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Social Security Claiming Ages
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          Full Retirement Age is 67 for those born after 1960. Claiming early permanently reduces your benefit.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
          {Object.entries(SS_CLAIMING_BENEFIT).map(([age, pct]) => (
            <Link
              key={age}
              href={`/retirement/social-security-at-age-${age}`}
              style={{ ...card, textDecoration: 'none', display: 'block' }}
            >
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Claim at {age}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: Number(age) >= 67 ? '#10b981' : Number(age) <= 63 ? '#f87171' : 'var(--text)' }}>
                {pct}%
              </div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>of full benefit</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 401k benchmarks */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          401k Benchmarks by Age
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1rem' }}>
          Fidelity recommends saving a multiple of your annual salary by each age milestone.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {Object.entries(K401_BENCHMARK_MULTIPLIER).map(([age, mult]) => (
            <Link
              key={age}
              href={`/retirement/401k-at-age-${age}`}
              style={{ ...card, textDecoration: 'none', display: 'block' }}
            >
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>By age {age}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--accent)' }}>{mult}x</div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>of annual salary</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Guides */}
      <section>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>
          Retirement Guides
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
          {[
            { label: 'When to Claim Social Security', slug: 'when-to-claim-social-security' },
            { label: 'Backdoor Roth IRA Guide', slug: 'backdoor-roth-ira-guide' },
            { label: 'Required Minimum Distributions', slug: 'required-minimum-distributions-guide' },
            { label: 'Medicare Enrollment Guide', slug: 'medicare-enrollment-guide' },
            { label: 'Inherited IRA Guide', slug: 'inherited-ira-guide' },
            { label: 'Social Security for Married Couples', slug: 'social-security-for-married-couples' },
          ].map(g => (
            <Link
              key={g.slug}
              href={`/retirement/${g.slug}`}
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
