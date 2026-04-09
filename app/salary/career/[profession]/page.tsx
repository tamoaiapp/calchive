import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { PROFESSIONS, getProfessionBySlug } from '@/lib/salary/professions'
import { generateProfessionPage } from '@/lib/salary/generator'
import { formatCurrency } from '@/lib/salary/calculator'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return PROFESSIONS.slice(0, 80).map(p => ({ profession: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>
}): Promise<Metadata> {
  const { profession: slug } = await params
  const prof = getProfessionBySlug(slug)
  if (!prof) return { title: 'Profession Not Found' }
  const page = generateProfessionPage(prof)
  return {
    title: page.metaTitle,
    description: page.metaDesc,
    alternates: { canonical: `/salary/career/${slug}` },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDesc,
      type: 'website',
    },
  }
}

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
}

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '10px 14px',
  color: 'var(--muted)',
  fontWeight: 600,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid var(--line)',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 14px',
  color: 'var(--text)',
  borderBottom: '1px solid var(--line)',
}

const tdNum: React.CSSProperties = {
  ...tdStyle,
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.5rem',
  marginBottom: '1.5rem',
  overflowX: 'auto',
}

const statBadge: React.CSSProperties = {
  display: 'inline-block',
  padding: '3px 10px',
  borderRadius: 16,
  fontSize: 12,
  fontWeight: 700,
  background: 'rgba(59,130,246,0.13)',
  color: '#60a5fa',
}

export default async function ProfessionPage({
  params,
}: {
  params: Promise<{ profession: string }>
}) {
  const { profession: slug } = await params
  const prof = getProfessionBySlug(slug)
  if (!prof) notFound()

  const page = generateProfessionPage(prof)

  // Growth styling
  const growthPositive = prof.jobGrowth > 0
  const growthColor = growthPositive ? 'var(--green)' : '#f87171'

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}
      >
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/salary" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Salary</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/salary/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{prof.title}</span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={statBadge}>{prof.category}</span>
          <span
            style={{
              ...statBadge,
              background: growthPositive ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
              color: growthColor,
            }}
          >
            {growthPositive ? '+' : ''}{prof.jobGrowth}% job growth
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.5rem', lineHeight: 1.15 }}>
          {page.h1}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
          National median: <strong style={{ color: 'var(--text)' }}>{formatCurrency(prof.medianSalary)}/year</strong>.
          After federal taxes (single filer), that&apos;s{' '}
          <strong style={{ color: 'var(--green)' }}>
            {formatCurrency(page.salaryTable.find(r => r.level === 'Median')?.afterTaxNational ?? 0)}/year
          </strong>{' '}
          take-home — {page.salaryTable.find(r => r.level === 'Median')?.effectiveRate} effective rate.
        </p>
      </header>

      {/* Quick stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
        gap: 12,
        marginBottom: '1.5rem',
      }}>
        {[
          { label: 'Entry Level', value: formatCurrency(prof.entryLevel) },
          { label: 'Median Salary', value: formatCurrency(prof.medianSalary) },
          { label: '75th %ile', value: formatCurrency(prof.p75Salary) },
          { label: 'Senior Level', value: formatCurrency(prof.seniorLevel) },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              padding: '0.9rem 1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {label}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Top Ad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot slot="8901234567" format="leaderboard" />
      </div>

      {/* Salary by experience table */}
      <div style={card}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800 }}>
          {prof.title} Salary After Federal Tax by Experience Level
        </h2>
        <p style={{ margin: '0 0 1rem', color: 'var(--dim)', fontSize: 12 }}>
          Take-home calculated for single filer, federal taxes only (no state income tax baseline).
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Level</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Gross Salary</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home / Year</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
            </tr>
          </thead>
          <tbody>
            {page.salaryTable.map(row => (
              <tr key={row.level} style={row.level === 'Median' ? { background: 'rgba(59,130,246,0.06)' } : {}}>
                <td style={{ ...tdStyle, fontWeight: row.level === 'Median' ? 700 : 400 }}>
                  {row.level}
                  {row.level === 'Median' && (
                    <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase' }}>
                      BLS Median
                    </span>
                  )}
                </td>
                <td style={tdNum}>{formatCurrency(row.salary)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{formatCurrency(row.afterTaxNational)}</td>
                <td style={tdNum}>{formatCurrency(row.afterTaxNational / 12)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{row.effectiveRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* By state table */}
      {page.byStateTable.length > 0 && (
        <div style={card}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800 }}>
            {prof.title} Take-Home Pay by State
          </h2>
          <p style={{ margin: '0 0 1rem', color: 'var(--dim)', fontSize: 12 }}>
            Salary figures adjusted for state cost of living and local market rates. Single filer.
          </p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>State</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Est. Salary</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home / Year</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
              </tr>
            </thead>
            <tbody>
              {page.byStateTable.map(row => (
                <tr key={row.stateSlug}>
                  <td style={tdStyle}>
                    <Link
                      href={`/salary/${row.stateSlug}/${row.salary}`}
                      style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
                    >
                      {row.stateName}
                    </Link>
                  </td>
                  <td style={tdNum}>{formatCurrency(row.salary)}</td>
                  <td style={{ ...tdNum, color: 'var(--green)' }}>{formatCurrency(row.afterTax)}</td>
                  <td style={tdNum}>{formatCurrency(row.afterTax / 12)}</td>
                  <td style={{ ...tdNum, color: 'var(--muted)' }}>{row.effectiveRate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mid Ad */}
      <div style={{ margin: '1.5rem 0' }}>
        <AdSlot slot="9012345678" format="rectangle" />
      </div>

      {/* Career description */}
      <div style={{ ...card, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 800 }}>
          About This Career
        </h2>
        <p style={{ margin: '0 0 0.75rem', color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {page.careerPath}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: '0.75rem' }}>
          <span style={{ fontSize: 12, color: 'var(--dim)' }}>
            <strong style={{ color: 'var(--muted)' }}>Education:</strong> {prof.education}
          </span>
        </div>
        {prof.topCities.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--dim)' }}>
              <strong style={{ color: 'var(--muted)' }}>Top Cities:</strong> {prof.topCities.join(', ')}
            </span>
          </div>
        )}
      </div>

      {/* FAQ */}
      <section style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
          Frequently Asked Questions
        </h2>
        {page.faq.map((item, i) => (
          <details
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 12,
              marginBottom: 8,
              padding: '1rem 1.25rem',
            }}
          >
            <summary
              style={{
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: 'var(--text)',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              {item.q}
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginLeft: 8 }}>+</span>
            </summary>
            <p style={{ margin: '0.75rem 0 0', color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
              {item.a}
            </p>
          </details>
        ))}
      </section>

      {/* Schema.org FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: page.faq.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: { '@type': 'Answer', text: item.a },
            })),
          }),
        }}
      />

      {/* State deep-links */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>
          Calculate {prof.title} Take-Home by State
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {page.byStateTable.map(row => (
            <Link
              key={row.stateSlug}
              href={`/salary/${row.stateSlug}/${row.salary}`}
              style={{
                padding: '6px 14px',
                background: 'var(--card)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                fontSize: 13,
                color: 'var(--muted)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {row.stateName}
            </Link>
          ))}
        </div>
      </div>

      {/* Related links */}
      <RelatedLinks links={page.relatedLinks} title="Related Calculators & Tools" />

      {/* Bottom Ad */}
      <div style={{ marginTop: '2.5rem' }}>
        <AdSlot slot="0123456789" format="leaderboard" />
      </div>
    </div>
  )
}
