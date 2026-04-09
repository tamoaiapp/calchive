import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About USA-Calc | Free Online Calculators for Finance, Tax & Salary',
  description: 'USA-Calc provides free, accurate financial calculators for salary after tax, federal income tax, mortgage payments, loan estimates, and more — built for US residents.',
  alternates: { canonical: '/about' },
}

const s: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.75rem' }
const h2s: React.CSSProperties = { fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem', marginBottom: '0.4rem' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1rem' }
const grid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, margin: '1.5rem 0' }
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

      <h2 style={h2s}>Our Data Sources</h2>
      <p style={ps}>
        Tax calculations use official IRS publication data for federal income tax brackets, standard deductions,
        FICA rates, and capital gains thresholds. State income tax rates come from individual state revenue
        department publications. Salary data is sourced from the Bureau of Labor Statistics (BLS) Occupational
        Employment and Wage Statistics program. Mortgage rate assumptions reference Freddie Mac Primary Mortgage
        Market Survey data.
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
