import type { Metadata } from 'next'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Federal Income Tax Calculator 2026 | Tax Brackets & Rates | USA-Calc',
  description:
    'Calculate federal income tax, capital gains tax, self-employment tax, and state income taxes for 2026. Real IRS brackets, exact math, all filing statuses.',
  alternates: { canonical: '/tax' },
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 20,
  padding: '1.5rem',
  marginBottom: '1.25rem',
}

const sectionTitle: React.CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 800,
  color: 'var(--text)',
  marginBottom: '0.75rem',
  marginTop: 0,
}

const pill: React.CSSProperties = {
  display: 'inline-block',
  padding: '5px 14px',
  background: 'rgba(59,130,246,0.08)',
  border: '1px solid rgba(59,130,246,0.18)',
  borderRadius: 20,
  fontSize: 13,
  color: 'var(--muted)',
  textDecoration: 'none',
  fontWeight: 500,
  margin: '4px',
  transition: 'all 0.15s',
}

const categories = [
  {
    title: 'Federal Income Tax',
    icon: '🏛️',
    count: 120,
    desc: 'Exact federal tax on any income from $25k to $1.5M across all four filing statuses.',
    links: [
      { label: '$80,000 Single', href: '/tax/federal-tax-80000-single' },
      { label: '$100,000 Married', href: '/tax/federal-tax-100000-married-jointly' },
      { label: '$150,000 Single', href: '/tax/federal-tax-150000-single' },
      { label: '$200,000 Head of HH', href: '/tax/federal-tax-200000-head-of-household' },
      { label: '$250,000 MFJ', href: '/tax/federal-tax-250000-married-jointly' },
      { label: '$500,000 Single', href: '/tax/federal-tax-500000-single' },
    ],
  },
  {
    title: 'Capital Gains Tax',
    icon: '📈',
    count: 40,
    desc: 'Long-term and short-term capital gains tax on proceeds from $5k to $5M.',
    links: [
      { label: '$50k Long-Term', href: '/tax/capital-gains-tax-50000-long-term' },
      { label: '$100k Long-Term', href: '/tax/capital-gains-tax-100000-long-term' },
      { label: '$50k Short-Term', href: '/tax/capital-gains-tax-50000-short-term' },
      { label: '$250k Long-Term', href: '/tax/capital-gains-tax-250000-long-term' },
      { label: '$1M Long-Term', href: '/tax/capital-gains-tax-1000000-long-term' },
    ],
  },
  {
    title: 'Self-Employment Tax',
    icon: '🧾',
    count: 20,
    desc: '15.3% SE tax calculation including deductible half and federal income tax.',
    links: [
      { label: '$60,000 Net', href: '/tax/self-employment-tax-60000' },
      { label: '$80,000 Net', href: '/tax/self-employment-tax-80000' },
      { label: '$100,000 Net', href: '/tax/self-employment-tax-100000' },
      { label: '$150,000 Net', href: '/tax/self-employment-tax-150000' },
    ],
  },
  {
    title: 'State Income Tax',
    icon: '🗺️',
    count: 150,
    desc: 'State-by-state income tax pages for 15 key states at 10 income levels.',
    links: [
      { label: 'California $100k', href: '/tax/california-income-tax-100000' },
      { label: 'New York $100k', href: '/tax/new-york-income-tax-100000' },
      { label: 'Texas $100k', href: '/tax/texas-income-tax-100000' },
      { label: 'Florida $100k', href: '/tax/florida-income-tax-100000' },
      { label: 'New Jersey $150k', href: '/tax/new-jersey-income-tax-150000' },
    ],
  },
  {
    title: 'Tax Guides',
    icon: '📋',
    count: 15,
    desc: 'In-depth guides on tax brackets, deductions, credits, and business structures.',
    links: [
      { label: 'Tax Brackets 2025', href: '/tax/tax-brackets-2025' },
      { label: 'Capital Gains Rates', href: '/tax/capital-gains-rates-2025' },
      { label: 'Standard Deduction', href: '/tax/standard-deduction-2025' },
      { label: 'SE Tax Guide', href: '/tax/self-employment-tax-guide' },
      { label: 'W-2 vs 1099', href: '/tax/w2-vs-1099-guide' },
      { label: '401(k) Tax Benefits', href: '/tax/401k-tax-benefits-guide' },
    ],
  },
]

const popularSearches = [
  { label: 'Federal tax on $80,000 single', href: '/tax/federal-tax-80000-single' },
  { label: 'Federal tax on $120,000 married', href: '/tax/federal-tax-120000-married-jointly' },
  { label: 'Capital gains tax on $50,000 profit', href: '/tax/capital-gains-tax-50000-long-term' },
  { label: 'Self-employment tax $60,000', href: '/tax/self-employment-tax-60000' },
  { label: 'California income tax $100,000', href: '/tax/california-income-tax-100000' },
  { label: 'New York income tax $150,000', href: '/tax/new-york-income-tax-150000' },
  { label: '2025 tax brackets', href: '/tax/tax-brackets-2025' },
  { label: 'SE tax vs W-2 guide', href: '/tax/w2-vs-1099-guide' },
]

export default function TaxIndexPage() {
  return (
    <div
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 900,
            background: 'var(--brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 0.75rem',
          }}
        >
          Federal Income Tax Calculator 2025
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, margin: 0 }}>
          Real 2025 IRS brackets. Exact math on federal income tax, capital gains,
          self-employment tax, and 15 state income taxes — across all filing statuses and income levels.
        </p>
      </div>

      {/* Top Ad */}
      <div style={{ marginBottom: '2rem' }}>
        <AdSlot slot="1234567890" format="leaderboard" />
      </div>

      {/* Quick stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
          marginBottom: '2rem',
        }}
      >
        {[
          { label: 'Total Tax Pages', value: '345+' },
          { label: 'Tax Year', value: '2025' },
          { label: 'Filing Statuses', value: '4' },
          { label: 'States Covered', value: '15' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 16,
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      {categories.map(cat => (
        <div key={cat.title} style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.5rem' }}>
            <span style={{ fontSize: 22 }}>{cat.icon}</span>
            <h2 style={{ ...sectionTitle, marginBottom: 0 }}>{cat.title}</h2>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: 12,
                color: 'var(--dim)',
                background: 'var(--bg)',
                padding: '2px 10px',
                borderRadius: 12,
              }}
            >
              {cat.count} pages
            </span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>{cat.desc}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0 }}>
            {cat.links.map(link => (
              <Link key={link.href} href={link.href} style={pill}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Mid Ad */}
      <div style={{ margin: '1.5rem 0' }}>
        <AdSlot slot="2345678901" format="rectangle" />
      </div>

      {/* Popular searches */}
      <div style={card}>
        <h2 style={sectionTitle}>Popular Tax Questions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 8 }}>
          {popularSearches.map(s => (
            <Link
              key={s.href}
              href={s.href}
              style={{
                display: 'block',
                padding: '10px 14px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                fontSize: 13,
                color: 'var(--muted)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 2025 bracket quick reference */}
      <div style={{ ...card, marginTop: '1rem' }}>
        <h2 style={sectionTitle}>2025 Federal Tax Brackets — Quick Reference (Single)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Rate', 'Taxable Income Range', 'Tax on This Bracket'].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    color: 'var(--muted)',
                    fontWeight: 600,
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    borderBottom: '1px solid var(--line)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['10%', '$0 – $11,925', 'Up to $1,193'],
              ['12%', '$11,925 – $48,475', 'Up to $4,386'],
              ['22%', '$48,475 – $103,350', 'Up to $12,073'],
              ['24%', '$103,350 – $197,300', 'Up to $22,548'],
              ['32%', '$197,300 – $250,525', 'Up to $17,024'],
              ['35%', '$250,525 – $626,350', 'Up to $131,576'],
              ['37%', 'Over $626,350', '37¢ per dollar'],
            ].map(([rate, range, tax]) => (
              <tr key={rate}>
                {[rate, range, tax].map((cell, i) => (
                  <td
                    key={i}
                    style={{
                      padding: '9px 12px',
                      color: i === 0 ? 'var(--accent)' : 'var(--text)',
                      borderBottom: '1px solid var(--line)',
                      fontWeight: i === 0 ? 700 : 400,
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: '0.75rem 0 0', fontSize: 12, color: 'var(--dim)' }}>
          Applies to taxable income (gross minus $15,000 standard deduction). Married filing jointly thresholds are roughly double.
        </p>
      </div>

      {/* Bottom Ad */}
      <div style={{ marginTop: '2rem' }}>
        <AdSlot slot="3456789012" format="leaderboard" />
      </div>
    </div>
  )
}
