import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calchive — Free Online Calculators for Finance, Salary, Tax & More',
  description:
    'Free online calculators and tools for US finance, salary, federal tax, mortgage payments, BMI, retirement, and more. Fast, accurate, no sign-up.',
}

const categories = [
  {
    icon: '🧮',
    label: 'Calculators',
    href: '/calculator',
    desc: 'Compound interest, ROI, percentage, tip, and more.',
  },
  {
    icon: '🔧',
    label: 'Tools',
    href: '/tool',
    desc: 'Unit converters, date calculators, and utilities.',
  },
  {
    icon: '💵',
    label: 'Salary',
    href: '/salary',
    desc: 'Hourly to annual, take-home pay, and pay raise.',
  },
  {
    icon: '🏛️',
    label: 'Tax',
    href: '/tax',
    desc: 'Federal income tax, self-employment, and W-4.',
  },
  {
    icon: '🏠',
    label: 'Mortgage',
    href: '/mortgage',
    desc: 'Monthly payment, affordability, and amortization.',
  },
  {
    icon: '💳',
    label: 'Loans',
    href: '/loan',
    desc: 'Auto loans, personal loans, and student debt.',
  },
  {
    icon: '❤️',
    label: 'Health',
    href: '/health',
    desc: 'BMI, calorie, ideal weight, and body fat.',
  },
  {
    icon: '👔',
    label: 'Careers',
    href: '/career',
    desc: 'Raise negotiation, net worth, and job offer compare.',
  },
]

const popular = [
  { label: 'Salary Calculator', href: '/salary/salary-calculator', icon: '💵' },
  { label: 'Tax Calculator', href: '/tax/tax-calculator', icon: '🏛️' },
  { label: 'Mortgage Calculator', href: '/mortgage/mortgage-calculator', icon: '🏠' },
  { label: 'BMI Calculator', href: '/health/bmi-calculator', icon: '❤️' },
  { label: 'Compound Interest', href: '/calculator/compound-interest-calculator', icon: '📈' },
  { label: 'Loan Calculator', href: '/loan/loan-calculator', icon: '💳' },
]

const mostSearchedCalcs = [
  { label: 'Retirement Calculator', href: '/calculator/retirement-calculator', icon: '🏦' },
  { label: 'ROI Calculator', href: '/calculator/roi-calculator', icon: '📊' },
  { label: 'Percentage Calculator', href: '/calculator/percentage-calculator', icon: '🔢' },
  { label: 'Auto Loan Calculator', href: '/calculator/auto-loan-calculator', icon: '🚗' },
  { label: 'Inflation Calculator', href: '/calculator/inflation-calculator', icon: '📉' },
  { label: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💼' },
  { label: 'Debt Payoff Calculator', href: '/calculator/debt-payoff-calculator', icon: '💰' },
  { label: 'Tip Calculator', href: '/calculator/tip-calculator', icon: '🧾' },
  { label: 'Interest Rate Calculator', href: '/calculator/interest-rate-calculator', icon: '🏧' },
  { label: '401k Calculator', href: '/calculator/401k-calculator', icon: '📋' },
  { label: 'Paycheck Calculator', href: '/calculator/paycheck-calculator', icon: '💵' },
  { label: 'Savings Calculator', href: '/calculator/savings-calculator', icon: '🏛️' },
]

const popularSalaryPages = [
  { label: 'Software Engineer Salary', href: '/salary/career/software-engineer-career-guide', icon: '💻' },
  { label: 'Registered Nurse Salary', href: '/salary/career/registered-nurse-career-guide', icon: '🏥' },
  { label: 'Teacher Salary', href: '/salary/career/teacher-career-guide', icon: '📚' },
  { label: '$75,000 in California', href: '/salary/california/75000', icon: '🌴' },
  { label: '$100,000 in Texas', href: '/salary/texas/100000', icon: '⭐' },
  { label: '$60,000 in New York', href: '/salary/new-york/60000', icon: '🗽' },
]

const popularTaxPages = [
  { label: 'Federal Tax on $75,000', href: '/tax/federal-tax-75000-single', icon: '🏛️' },
  { label: 'Federal Tax on $100,000', href: '/tax/federal-tax-100000-single', icon: '📊' },
  { label: 'Capital Gains Tax 2025', href: '/tax/capital-gains-rates-2025', icon: '📈' },
  { label: 'Self-Employment Tax Guide', href: '/tax/self-employment-tax-guide', icon: '💼' },
]

const latestGuides = [
  { label: 'How to Build an Emergency Fund', href: '/guide/how-to-build-emergency-fund', icon: '🏦' },
  { label: 'Investing for Beginners', href: '/guide/investing-for-beginners', icon: '📈' },
  { label: 'How to Pay Off Debt Fast', href: '/guide/how-to-pay-off-debt-fast', icon: '💳' },
  { label: 'Buying vs Renting a Home', href: '/guide/buying-vs-renting', icon: '🏠' },
  { label: 'Retirement Planning at 40', href: '/guide/retirement-planning-by-age', icon: '🎯' },
  { label: 'How to Negotiate Your Salary', href: '/guide/salary-negotiation-guide', icon: '🤝' },
]

export default function HomePage() {
  return (
    <>
      <style>{`
        .hero-btn-primary {
          padding: 13px 28px;
          background: var(--brand);
          border-radius: var(--radius-btn);
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          display: inline-block;
          transition: opacity 0.15s;
        }
        .hero-btn-primary:hover { opacity: 0.88; }

        .hero-btn-secondary {
          padding: 13px 28px;
          background: transparent;
          border: 1px solid var(--line);
          border-radius: var(--radius-btn);
          color: var(--muted);
          font-weight: 600;
          font-size: 15px;
          display: inline-block;
          transition: border-color 0.15s, color 0.15s;
        }
        .hero-btn-secondary:hover {
          border-color: rgba(99,102,241,0.4);
          color: var(--text);
        }

        .category-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-card-lg);
          transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
          text-decoration: none;
        }
        .category-card:hover {
          border-color: rgba(99,102,241,0.35);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }

        .popular-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: var(--radius-card);
          transition: border-color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .popular-card:hover {
          border-color: rgba(59,130,246,0.35);
          background: rgba(59,130,246,0.06);
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: 'var(--bg)',
          padding: '80px 24px 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle radial glow */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '5px 14px',
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.25)',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              color: '#818cf8',
              marginBottom: 24,
              letterSpacing: '0.03em',
            }}
          >
            100% Free — No Sign-Up Required
          </span>

          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: 20,
              color: 'var(--text)',
            }}
          >
            Free Online{' '}
            <span
              style={{
                background: 'var(--brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Calculators
            </span>{' '}
            &amp; Tools
          </h1>

          <p
            style={{
              fontSize: 18,
              color: 'var(--muted)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 36px',
            }}
          >
            Finance, salary, federal tax, mortgage, health, and more — built for the US &amp; UK market.
            Fast, accurate, and easy to use.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/calculator" className="hero-btn-primary">
              Browse Calculators
            </Link>
            <Link href="/salary/salary-calculator" className="hero-btn-secondary">
              Salary Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        style={{
          background: 'var(--bg2)',
          padding: '64px 24px',
          borderTop: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}
          >
            Browse by Category
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--muted)',
              marginBottom: 40,
              fontSize: 16,
            }}
          >
            Find the right calculator for your needs
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {categories.map((cat) => (
              <Link key={cat.href} href={cat.href} className="category-card">
                <span style={{ fontSize: 32 }}>{cat.icon}</span>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      color: 'var(--text)',
                      fontSize: 16,
                      marginBottom: 4,
                    }}
                  >
                    {cat.label}
                  </p>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular */}
      <section style={{ padding: '64px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              marginBottom: 8,
              letterSpacing: '-0.5px',
            }}
          >
            Most Popular
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 16 }}>
            The calculators Americans use most
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 14,
            }}
          >
            {popular.map((item) => (
              <Link key={item.href} href={item.href} className="popular-card">
                <span
                  style={{
                    fontSize: 24,
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(99,102,241,0.1)',
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 15 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 1 }}>
                    Free &amp; instant
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: 'auto',
                    color: 'var(--dim)',
                    fontSize: 18,
                    flexShrink: 0,
                  }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Searched Calculators */}
      <section style={{ padding: '64px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Most Searched Calculators
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
            Quick access to the tools Americans search for most
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
            {mostSearchedCalcs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  textDecoration: 'none',
                  color: 'var(--muted)',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'border-color 0.15s',
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Salary & Tax */}
      <section style={{ padding: '64px 24px', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 48 }}>
          {/* Salary */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>
              Popular Salary Pages
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>
              After-tax take-home pay by state and career
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {popularSalaryPages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 14px',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: 'var(--muted)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Tax */}
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, letterSpacing: '-0.5px' }}>
              Popular Tax Questions
            </h2>
            <p style={{ color: 'var(--muted)', marginBottom: 20, fontSize: 14 }}>
              Federal income tax, capital gains, and self-employment
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {popularTaxPages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 14px',
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: 'var(--muted)',
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Guides */}
      <section style={{ padding: '64px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Financial Guides
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
            Practical, data-backed guides for US personal finance
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {latestGuides.map((item) => (
              <Link key={item.href} href={item.href} className="popular-card">
                <span
                  style={{
                    fontSize: 22,
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(99,102,241,0.1)',
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14 }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Free guide</p>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--dim)', fontSize: 16, flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section
        style={{
          borderTop: '1px solid var(--line)',
          padding: '40px 24px',
          background: 'var(--bg)',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 40,
          }}
        >
          {[
            { icon: '⚡', label: 'Instant Results', sub: 'No waiting, no loading' },
            { icon: '🔒', label: 'Private', sub: 'Nothing stored or tracked' },
            { icon: '📱', label: 'Mobile Friendly', sub: 'Works on any device' },
            { icon: '✅', label: 'Always Free', sub: 'No subscriptions' },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center', minWidth: 140 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 15 }}>{item.label}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 3 }}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
