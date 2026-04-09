import type { Metadata } from 'next'
import Link from 'next/link'
import { GUIDE_SLUGS, GUIDE_CATEGORIES } from '@/lib/guides/manifest'

export const metadata: Metadata = {
  title: 'Financial Guides: Budgeting, Investing, Crypto, Business & More | Calchive',
  description:
    'Practical guides on budgeting, investing, crypto, small business, real estate, and side hustles. Data-driven, no fluff. Updated for 2025.',
  alternates: { canonical: '/guide' },
  openGraph: {
    title: 'Financial Guides 2025 | Calchive',
    description: 'Budgeting, investing, crypto, small business, and more — practical guides with real numbers.',
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

const CATEGORY_ICONS: Record<string, string> = {
  'Budgeting': '💰',
  'Banking': '🏦',
  'Investing': '📈',
  'Crypto': '₿',
  'Small Business': '🏢',
  'Real Estate': '🏠',
  'Legal & Estate': '📋',
  'Insurance': '🛡️',
  'Kids & Family': '👨‍👩‍👧',
  'Side Hustles': '💼',
}

function slugToLabel(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\bVs\b/g, 'vs')
    .replace(/\bLlc\b/g, 'LLC')
    .replace(/\bEtf\b/g, 'ETF')
    .replace(/\bCd\b/g, 'CD')
    .replace(/\bAch\b/g, 'ACH')
    .replace(/\bIra\b/g, 'IRA')
    .replace(/\bNft\b/g, 'NFT')
    .replace(/\bDefi\b/g, 'DeFi')
    .replace(/\bFafsa\b/g, 'FAFSA')
    .replace(/\b529\b/, '529')
    .replace(/\bAirbnb\b/g, 'Airbnb')
}

export default function GuidePage() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={badge}>Financial Guides 2025</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.15 }}>
          {GUIDE_SLUGS.length} Practical Finance Guides
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          No filler, no affiliate fluff. Each guide leads with the number that matters most, then explains the strategy.
        </p>
      </header>

      {Object.entries(GUIDE_CATEGORIES).map(([category, slugs]) => (
        <section key={category} style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{CATEGORY_ICONS[category] ?? '📄'}</span>
            {category}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {slugs.map(slug => (
              <Link
                key={slug}
                href={`/guide/${slug}`}
                style={{
                  padding: '14px 16px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  color: 'var(--text)',
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{slugToLabel(slug)}</span>
                <span style={{ color: 'var(--accent)', flexShrink: 0, marginLeft: 8 }}>→</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Quick links to other sections */}
      <section style={{ ...card, marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
          More Guides by Topic
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            { label: 'Insurance Guides', href: '/insurance' },
            { label: 'Credit & Debt', href: '/credit' },
            { label: 'Retirement Planning', href: '/retirement' },
            { label: 'Salary After Tax', href: '/salary' },
            { label: 'Mortgage Guides', href: '/mortgage' },
            { label: 'Health Calculators', href: '/health' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '8px 16px',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 20,
                color: 'var(--accent)',
                fontSize: 14,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
