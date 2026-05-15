import type { Metadata } from 'next'
import Link from 'next/link'
import { AUTHORS } from '@/lib/authors'

export const metadata: Metadata = {
  title: 'About USA-Calc — Editorial Team, Methodology & Data Sources',
  description:
    'USA-Calc is a free financial calculator platform written and reviewed by credentialed analysts. Meet the team, see our data sources, and read our editorial standards.',
  alternates: { canonical: '/about' },
}

const s: React.CSSProperties = { maxWidth: 820, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.75rem' }
const h2s: React.CSSProperties = { fontSize: '1.2rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '0.5rem' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1rem' }
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16, margin: '1.5rem 0' }
const card: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: '1.25rem' }

export default function AboutPage() {
  const sections = [
    { icon: '💰', title: 'Salary After Tax', desc: 'Take-home pay for all 50 states across 25 income levels — federal + state + FICA.', href: '/salary' },
    { icon: '🏛️', title: 'Tax Calculators', desc: 'Federal income tax, capital gains, self-employment, and state income tax.', href: '/tax' },
    { icon: '🏠', title: 'Mortgage', desc: 'Monthly payment breakdowns by state and home price, including PMI and amortization.', href: '/mortgage' },
    { icon: '📊', title: 'Loan Calculators', desc: 'Personal, auto, student, and credit card payoff calculators with amortization.', href: '/loan' },
    { icon: '🏥', title: 'Health Tools', desc: 'BMI, calorie deficit, TDEE, heart rate zones, and weight loss timelines.', href: '/health' },
    { icon: '💼', title: 'Career & Salary', desc: 'Salary data by profession from entry level to senior, plus career guides.', href: '/career' },
  ]

  return (
    <div style={s}>
      <h1 style={h1s}>About USA-Calc</h1>
      <p style={ps}>
        USA-Calc is a free financial calculator platform built for people living and working in the United States.
        Every calculator uses real data — IRS tax brackets, BLS salary data, Freddie Mac mortgage rates — so the
        numbers you see reflect what you'd actually pay or earn, not estimates.
      </p>

      <h2 style={h2s}>What We Cover</h2>
      <div style={grid}>
        {sections.map(sec => (
          <Link key={sec.href} href={sec.href} style={{ textDecoration: 'none' }}>
            <div style={card}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{sec.icon}</div>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{sec.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{sec.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Editorial team — surfaces E-E-A-T author signals to Google */}
      <h2 style={h2s}>Editorial Team</h2>
      <p style={ps}>
        Every guide and calculator on USA-Calc is bylined by a domain analyst with at least seven years in
        their field. Our authors review their own pages every quarter to catch IRS bracket changes, rate
        shifts, and new regulations.
      </p>

      <div style={{ display: 'grid', gap: 14, margin: '1.25rem 0 1.5rem' }}>
        {Object.values(AUTHORS).map(a => (
          <div
            key={a.slug}
            id={`author-${a.slug}`}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 14,
              padding: '1.1rem 1.3rem',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>
              {a.name}
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {a.title} · {a.yearsExperience}+ years
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)', margin: '0 0 0.6rem', lineHeight: 1.65 }}>
              {a.bio}
            </p>
            <div style={{ fontSize: '0.78rem', color: 'var(--dim)', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
              Areas of expertise
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {a.expertise.map(e => (
                <span key={e} style={{ fontSize: '0.78rem', background: 'var(--bg2)', border: '1px solid var(--line)', padding: '0.18rem 0.55rem', borderRadius: 6, color: 'var(--muted)' }}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 style={h2s}>Our Data Sources</h2>
      <p style={ps}>
        Tax calculations use official <a href="https://www.irs.gov" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>IRS</a> publication
        data for federal income tax brackets, standard deductions, FICA rates, and capital gains thresholds. State income tax
        rates come from individual state revenue department publications. Salary data is sourced from the{' '}
        <a href="https://www.bls.gov/oes/" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Bureau of Labor Statistics (BLS)</a>{' '}
        Occupational Employment and Wage Statistics program. Mortgage rate assumptions reference{' '}
        <a href="https://www.freddiemac.com/pmms" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>Freddie Mac Primary Mortgage Market Survey</a>{' '}
        data. Per diem rates use the <a href="https://www.gsa.gov/travel/plan-book/per-diem-rates" target="_blank" rel="noopener" style={{ color: 'var(--accent)' }}>GSA</a> CONUS/OCONUS schedules.
      </p>

      <h2 style={h2s}>Editorial Standards</h2>
      <p style={ps}>
        We do not accept payment for inclusion in any guide, calculator, or comparison table. Affiliate links,
        when used, never influence rankings or ratings — they only appear on pages where the comparison would
        exist regardless of revenue. Every authored page is reviewed at minimum quarterly and updated within
        48 hours when IRS or major federal rates change.
      </p>
      <p style={ps}>
        Read our full <Link href="/methodology" style={{ color: 'var(--accent)' }}>calculation methodology</Link> for
        formulas, rounding rules, and how we handle edge cases.
      </p>

      <h2 style={h2s}>Accuracy & Disclaimer</h2>
      <p style={ps}>
        USA-Calc calculations are for informational and educational purposes only. Results are estimates based on
        general tax rules and may not reflect your specific situation. Tax laws change, and individual circumstances
        vary. Always consult a qualified tax professional or financial advisor before making financial decisions.
      </p>

      <h2 style={h2s}>No Sign-Up Required</h2>
      <p style={ps}>
        All calculators work instantly — no account, no email, no personal data collected. Calculations run in
        your browser. We never see what you type into any calculator.
      </p>

      <h2 style={h2s}>Contact</h2>
      <p style={ps}>
        Questions, corrections, or suggestions? We welcome feedback.{' '}
        <Link href="/contact" style={{ color: 'var(--accent)' }}>Contact us here</Link> or email{' '}
        <a href="mailto:hello@usa-calc.com" style={{ color: 'var(--accent)' }}>hello@usa-calc.com</a>.
      </p>
    </div>
  )
}
