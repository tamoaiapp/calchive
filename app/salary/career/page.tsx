import type { Metadata } from 'next'
import Link from 'next/link'
import { PROFESSIONS, PROFESSION_CATEGORIES } from '@/lib/salary/professions'
import { calculateTakeHome } from '@/lib/salary/calculator'
import { formatCurrency } from '@/lib/salary/generator'

// Texas = no state tax, used for "national" take-home reference
import { getStateBySlug } from '@/lib/salary/states'

export const metadata: Metadata = {
  title: 'Career Salary After Tax — All Professions | Calchive',
  description:
    'See take-home pay for 200+ careers and professions. Real 2025 BLS salary data with federal tax breakdowns for every occupation.',
  alternates: { canonical: '/salary/career' },
}

export default function CareerIndexPage() {
  const texas = getStateBySlug('texas')!

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}
      >
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/salary" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Salary</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>Careers</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, marginBottom: '0.5rem' }}>
        Career Salary After Tax
      </h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6, maxWidth: 640 }}>
        Real 2025 BLS salary data for {PROFESSIONS.length}+ professions. Take-home calculated at
        federal rates for a single filer (no state tax baseline). Click any career for a full
        breakdown by experience level and state.
      </p>

      {PROFESSION_CATEGORIES.map(category => {
        const profs = PROFESSIONS.filter(p => p.category === category)
        return (
          <section key={category} style={{ marginBottom: '2.5rem' }}>
            <h2 style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid var(--line)',
            }}>
              {category}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 10,
            }}>
              {profs.map(p => {
                const bd = calculateTakeHome(p.medianSalary, texas, 'single')
                return (
                  <Link
                    key={p.slug}
                    href={`/salary/career/${p.slug}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '14px 16px',
                      background: 'var(--card)',
                      border: '1px solid var(--line)',
                      borderRadius: 12,
                      textDecoration: 'none',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>
                        {p.title}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--green)', flexShrink: 0, marginLeft: 8 }}>
                        {formatCurrency(p.medianSalary)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: 'var(--dim)' }}>Take-home:</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>
                        {formatCurrency(bd.netAnnual)}/yr
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
