import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { STATES_ALL, getStateBySlug } from '@/lib/salary/states'
import { generateStatePage } from '@/lib/salary/generator'
import { formatCurrency, formatPct } from '@/lib/salary/calculator'

export const dynamic = 'force-static'
export const dynamicParams = true

const TOP_STATE_SLUGS = [
  'california', 'texas', 'new-york', 'florida', 'washington',
  'illinois', 'pennsylvania', 'ohio', 'georgia', 'north-carolina',
]
const AMOUNTS = [30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000]

export async function generateStaticParams() {
  const params: { state: string; amount: string }[] = []
  for (const slug of TOP_STATE_SLUGS) {
    for (const amount of AMOUNTS) {
      params.push({ state: slug, amount: String(amount) })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; amount: string }>
}): Promise<Metadata> {
  const { state: stateSlug, amount: amountStr } = await params
  const state = getStateBySlug(stateSlug)
  const amount = parseInt(amountStr, 10)
  if (!state || isNaN(amount) || amount <= 0) return { title: 'Salary Not Found' }

  const page = generateStatePage(state, amount)
  return {
    title: page.metaTitle,
    description: page.metaDesc,
    alternates: { canonical: `/salary/${stateSlug}/${amountStr}` },
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

const bigNumStyle: React.CSSProperties = {
  fontSize: 'clamp(2rem, 5vw, 3rem)',
  fontWeight: 900,
  color: 'var(--green)',
  letterSpacing: '-0.02em',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'var(--muted)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: 4,
}

const metricGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: 16,
  marginTop: '1.5rem',
}

const metricCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid var(--line)',
  borderRadius: 12,
  padding: '1rem',
}

export default async function SalaryStatePage({
  params,
}: {
  params: Promise<{ state: string; amount: string }>
}) {
  const { state: stateSlug, amount: amountStr } = await params
  const state = getStateBySlug(stateSlug)
  const amount = parseInt(amountStr, 10)

  if (!state || isNaN(amount) || amount <= 0 || amount > 5000000) notFound()

  const page = generateStatePage(state, amount)
  const bd = page.breakdown
  const formattedGross = formatCurrency(amount)

  // Build breadcrumb label
  const amountLabel = amount >= 1000 ? `$${(amount / 1000).toFixed(0)}k` : formattedGross

  // Rotate intro paragraph — same deterministic variant as generator
  const variantIdx = (stateSlug.charCodeAt(0) + Math.floor(amount / 10000)) % 4
  const introVariants = state.hasIncomeTax
    ? [
        `A ${formattedGross} salary in ${state.name} takes home ${formatCurrency(bd.netAnnual)} after federal income tax, state income tax, and FICA — a ${formatPct(bd.effectiveRate)} effective tax rate.`,
        `Earning ${formattedGross} in ${state.name} leaves you with ${formatCurrency(bd.netAnnual)} after all taxes. Federal income tax, ${state.abbr} state tax, and FICA together claim ${formatPct(bd.effectiveRate)} of gross pay.`,
        `${state.name} workers taking home ${formattedGross} gross keep ${formatCurrency(bd.netAnnual)} after federal, state, and FICA deductions — ${formatPct(bd.effectiveRate)} combined effective rate.`,
        `After federal income tax, ${state.abbr} state income tax, and FICA, a ${formattedGross} ${state.name} salary nets ${formatCurrency(bd.netAnnual)} — or ${formatCurrency(bd.netMonthly)}/month.`,
      ]
    : [
        `${state.name} has no state income tax. A ${formattedGross} salary takes home ${formatCurrency(bd.netAnnual)} after federal income tax and FICA — ${formatPct(bd.effectiveRate)} effective rate.`,
        `${state.name} levies no state income tax, so a ${formattedGross} salary nets ${formatCurrency(bd.netAnnual)} — only federal income tax and FICA apply. Combined effective rate: ${formatPct(bd.effectiveRate)}.`,
        `No state income tax in ${state.name}: a ${formattedGross} gross salary takes home ${formatCurrency(bd.netAnnual)} after federal taxes and FICA (${formatPct(bd.effectiveRate)} effective rate).`,
        `At ${formattedGross} in ${state.name}, you keep ${formatCurrency(bd.netAnnual)} after federal income tax and FICA — state tax is $0. That's ${formatCurrency(bd.netMonthly)}/month.`,
      ]
  const introText = introVariants[variantIdx]

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
        <Link href={`/salary/${stateSlug}/75000`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{state.name}</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{amountLabel}</span>
      </nav>

      {/* H1 */}
      <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.1rem)', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.2 }}>
        {page.h1}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        {introText}
      </p>

      {/* Top Ad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot slot="5678901234" format="leaderboard" />
      </div>

      {/* Hero breakdown */}
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={labelStyle}>Annual Take-Home Pay</div>
        <div style={bigNumStyle}>{formatCurrency(bd.netAnnual)}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
          after {formatCurrency(bd.totalTax)} in total taxes ({formatPct(bd.effectiveRate)} effective rate)
        </div>
        <div style={metricGrid}>
          {[
            { label: 'Monthly', value: formatCurrency(bd.netMonthly) },
            { label: 'Bi-Weekly', value: formatCurrency(bd.netBiweekly) },
            { label: 'Weekly', value: formatCurrency(bd.netWeekly) },
            { label: 'Hourly', value: formatCurrency(bd.netHourly) },
          ].map(({ label, value }) => (
            <div key={label} style={metricCard}>
              <div style={labelStyle}>{label}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax breakdown table */}
      <div style={card}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800 }}>
          Full Tax Breakdown — {formattedGross} in {state.name} (Single Filer)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tax Item</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Gross Salary</td>
              <td style={tdNum}>{formatCurrency(bd.grossAnnual)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>—</td>
            </tr>
            <tr>
              <td style={tdStyle}>Federal Income Tax</td>
              <td style={{ ...tdNum, color: '#f87171' }}>− {formatCurrency(bd.federalIncomeTax)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.federalIncomeTax / bd.grossAnnual)}</td>
            </tr>
            {bd.stateIncomeTax > 0 && (
              <tr>
                <td style={tdStyle}>{state.abbr} State Income Tax</td>
                <td style={{ ...tdNum, color: '#f87171' }}>− {formatCurrency(bd.stateIncomeTax)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.stateIncomeTax / bd.grossAnnual)}</td>
              </tr>
            )}
            {bd.stateSDI > 0 && (
              <tr>
                <td style={tdStyle}>{state.abbr} SDI</td>
                <td style={{ ...tdNum, color: '#f87171' }}>− {formatCurrency(bd.stateSDI)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.stateSDI / bd.grossAnnual)}</td>
              </tr>
            )}
            <tr>
              <td style={tdStyle}>Social Security (6.2%)</td>
              <td style={{ ...tdNum, color: '#f87171' }}>− {formatCurrency(bd.socialSecurity)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.socialSecurity / bd.grossAnnual)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Medicare (1.45%+)</td>
              <td style={{ ...tdNum, color: '#f87171' }}>− {formatCurrency(bd.medicare)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.medicare / bd.grossAnnual)}</td>
            </tr>
            <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
              <td style={{ ...tdStyle, fontWeight: 700 }}>Total Taxes</td>
              <td style={{ ...tdNum, color: '#f87171', fontWeight: 700 }}>− {formatCurrency(bd.totalTax)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)', fontWeight: 700 }}>{formatPct(bd.effectiveRate)}</td>
            </tr>
            <tr>
              <td style={{ ...tdStyle, fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>Take-Home Pay</td>
              <td style={{ ...tdNum, color: 'var(--green)', fontWeight: 800, fontSize: 15 }}>{formatCurrency(bd.netAnnual)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(bd.netAnnual / bd.grossAnnual)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Filing status comparison */}
      <div style={card}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800 }}>
          {formattedGross} After Tax by Filing Status in {state.name}
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Filing Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Federal Tax</th>
              {state.hasIncomeTax && <th style={{ ...thStyle, textAlign: 'right' }}>State Tax</th>}
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
            </tr>
          </thead>
          <tbody>
            {page.tableByFilingStatus.map(row => (
              <tr key={row.status}>
                <td style={tdStyle}>{row.label}</td>
                <td style={tdNum}>{formatCurrency(row.breakdown.federalIncomeTax)}</td>
                {state.hasIncomeTax && <td style={tdNum}>{formatCurrency(row.breakdown.stateIncomeTax)}</td>}
                <td style={tdNum}>{formatCurrency(row.breakdown.totalTax)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{formatCurrency(row.breakdown.netAnnual)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(row.breakdown.effectiveRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ margin: '0.75rem 0 0', fontSize: 12, color: 'var(--dim)' }}>
          Married filing jointly adds a standard deduction of $30,000 vs $15,000 for single filers (2025).
        </p>
      </div>

      {/* Mid Ad */}
      <div style={{ margin: '1.5rem 0' }}>
        <AdSlot slot="6789012345" format="rectangle" />
      </div>

      {/* Salary range comparison */}
      <div style={card}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800 }}>
          Nearby Salary Comparisons in {state.name} (Single)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Gross Salary</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home / Year</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Hourly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
            </tr>
          </thead>
          <tbody>
            {page.tableByAmount.map(row => (
              <tr key={row.amount}>
                <td style={tdStyle}>
                  <Link
                    href={`/salary/${stateSlug}/${row.amount}`}
                    style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}
                  >
                    {formatCurrency(row.amount)}
                  </Link>
                </td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{formatCurrency(row.breakdown.netAnnual)}</td>
                <td style={tdNum}>{formatCurrency(row.breakdown.netMonthly)}</td>
                <td style={tdNum}>{formatCurrency(row.breakdown.netHourly)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{formatPct(row.breakdown.effectiveRate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* State context */}
      <div style={{ ...card, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 800 }}>
          {state.name} Tax Overview
        </h2>
        <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {page.stateContext}
        </p>
        {state.localTaxNote && (
          <p style={{ margin: '0.5rem 0 0', color: 'var(--dim)', fontSize: '0.85rem' }}>
            <strong>Note:</strong> {state.localTaxNote}
          </p>
        )}
      </div>

      {/* Also check — married filing jointly */}
      <div style={{ ...card, marginBottom: '0.5rem' }}>
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 800 }}>
          Married Filing Jointly at {formattedGross} in {state.name}
        </h2>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Filing jointly, take-home rises to{' '}
          <strong style={{ color: 'var(--green)' }}>{formatCurrency(page.alsoCheck.netAnnual)}</strong>
          {' '}({formatCurrency(page.alsoCheck.netMonthly)}/month) — saving{' '}
          <strong>{formatCurrency(bd.totalTax - page.alsoCheck.totalTax)}</strong> in total taxes
          versus single filing due to the higher $30,000 standard deduction.
        </p>
      </div>

      {/* State salary links */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>
          Other Salaries in {state.name}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000].filter(a => a !== amount).map(a => (
            <Link
              key={a}
              href={`/salary/${stateSlug}/${a}`}
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
              {formatCurrency(a)}
            </Link>
          ))}
        </div>
      </div>

      {/* State comparisons for same salary */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 10 }}>
          {formattedGross} in Other States
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATES_ALL.filter(s => s.slug !== stateSlug).slice(0, 12).map(s => (
            <Link
              key={s.slug}
              href={`/salary/${s.slug}/${amount}`}
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
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `What is ${formattedGross} after taxes in ${state.name}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `A ${formattedGross} salary in ${state.name} takes home ${formatCurrency(bd.netAnnual)} per year after federal and state taxes, for a ${formatPct(bd.effectiveRate)} effective tax rate. Monthly take-home is ${formatCurrency(bd.netMonthly)}.`,
                },
              },
            ],
          }),
        }}
      />

      {/* Related links */}
      <RelatedLinks links={page.relatedLinks} title="Related Calculators & Tools" />

      {/* Bottom Ad */}
      <div style={{ marginTop: '2.5rem' }}>
        <AdSlot slot="7890123456" format="leaderboard" />
      </div>
    </div>
  )
}
