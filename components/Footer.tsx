import Link from 'next/link'

const categories = [
  { label: 'Finance', href: '/calculator' },
  { label: 'Salary & Pay', href: '/salary' },
  { label: 'Tax', href: '/tax' },
  { label: 'Mortgage & Loans', href: '/mortgage' },
  { label: 'Health & Fitness', href: '/health' },
  { label: 'Career Tools', href: '/career' },
]

const popularCalcs = [
  { label: 'Salary Calculator', href: '/salary/salary-calculator' },
  { label: 'Tax Calculator', href: '/tax/tax-calculator' },
  { label: 'Mortgage Calculator', href: '/mortgage/mortgage-calculator' },
  { label: 'BMI Calculator', href: '/health/bmi-calculator' },
  { label: 'Compound Interest', href: '/calculator/compound-interest-calculator' },
  { label: 'Loan Calculator', href: '/loan/loan-calculator' },
]

const resources = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Contact', href: '/contact' },
]

const colHeader: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'var(--dim)',
  marginBottom: 16,
}

const colLink: React.CSSProperties = {
  display: 'block',
  color: 'var(--muted)',
  fontSize: 14,
  marginBottom: 10,
  transition: 'color 0.15s',
}

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--line)',
        marginTop: 'auto',
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '56px 24px 40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 40,
        }}
      >
        {/* Brand column */}
        <div style={{ gridColumn: 'span 1' }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: 'var(--brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 12,
            }}
          >
            Calchive
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 240 }}>
            Free online calculators and tools for finance, salary, tax, mortgage, health, and more.
          </p>
        </div>

        {/* Categories */}
        <div>
          <p style={colHeader}>Categories</p>
          {categories.map((c) => (
            <Link key={c.href} href={c.href} style={colLink}>
              {c.label}
            </Link>
          ))}
        </div>

        {/* Popular Calculators */}
        <div>
          <p style={colHeader}>Popular Calculators</p>
          {popularCalcs.map((c) => (
            <Link key={c.href} href={c.href} style={colLink}>
              {c.label}
            </Link>
          ))}
        </div>

        {/* Resources */}
        <div>
          <p style={colHeader}>Resources</p>
          {resources.map((r) => (
            <Link key={r.href} href={r.href} style={colLink}>
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid var(--line)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <p
          style={{
            fontSize: 13,
            color: 'var(--dim)',
            textAlign: 'center',
          }}
        >
          &copy; 2025 Calchive. All rights reserved. Results are for informational purposes only.
        </p>
      </div>
    </footer>
  )
}
