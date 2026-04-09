import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { TAX_PAGE_SLUGS, parseTaxSlug } from '@/lib/tax/pages-manifest'
import {
  generateFederalTaxPage,
  generateCapitalGainsPage,
  generateSETaxPage,
  generateStateTaxPage,
  generateTaxGuidePage,
  type TaxPage,
  type CapGainsTaxPage,
  type SETaxPage,
  type StateTaxPage,
  type TaxGuidePage,
} from '@/lib/tax/generator'
import { FILING_STATUS_LABELS, fmt, fmtPct } from '@/lib/tax/data'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return TAX_PAGE_SLUGS.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = parseTaxSlug(slug)
  if (!config) return { title: 'Tax Page Not Found' }

  let title = ''
  let description = ''

  if (config.type === 'federal' && config.amount !== undefined && config.filing) {
    const page = generateFederalTaxPage(config.amount, config.filing)
    title = page.metaTitle
    description = page.metaDesc
  } else if (config.type === 'capital-gains' && config.amount !== undefined && config.holdingPeriod) {
    const page = generateCapitalGainsPage(config.amount, config.holdingPeriod)
    title = page.metaTitle
    description = page.metaDesc
  } else if (config.type === 'self-employment' && config.amount !== undefined) {
    const page = generateSETaxPage(config.amount)
    title = page.metaTitle
    description = page.metaDesc
  } else if (config.type === 'state' && config.stateSlug && config.amount !== undefined) {
    const page = generateStateTaxPage(config.stateSlug, config.amount)
    title = page.metaTitle
    description = page.metaDesc
  } else if (config.type === 'guide' && config.topic) {
    const page = generateTaxGuidePage(config.topic)
    title = page.metaTitle
    description = page.metaDesc
  }

  return {
    title,
    description,
    alternates: { canonical: `/tax/${slug}` },
    openGraph: { title, description, type: 'website' },
  }
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 20,
  padding: '1.5rem',
  marginBottom: '1.25rem',
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
  fontSize: 11,
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

const h2Style: React.CSSProperties = {
  margin: '0 0 1rem',
  fontSize: '1.05rem',
  fontWeight: 800,
}

// ─── Key Facts Strip ──────────────────────────────────────────────────────────

function KeyFactsStrip({ facts }: { facts: string[] }) {
  return (
    <div style={{ ...card, background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.18)' }}>
      <h2 style={{ ...h2Style, fontSize: '0.95rem', color: 'var(--muted)' }}>Key Facts</h2>
      <ul style={{ margin: 0, padding: '0 0 0 1.25rem', listStyle: 'disc' }}>
        {facts.map((f, i) => (
          <li key={i} style={{ color: 'var(--text)', lineHeight: 1.7, marginBottom: '0.35rem', fontSize: '0.95rem' }}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Federal Tax Page ─────────────────────────────────────────────────────────

function FederalTaxView({ page, slug }: { page: TaxPage; slug: string }) {
  const bd = page.taxBreakdown
  return (
    <>
      {/* Summary strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'Gross Income', value: fmt(bd.grossIncome), color: 'var(--text)' },
          { label: 'Federal Income Tax', value: fmt(bd.totalFederalTax), color: '#ef4444' },
          { label: 'FICA (SS + Medicare)', value: fmt(bd.ficaSocialSecurity + bd.ficaMedicare), color: '#f59e0b' },
          { label: 'Take-Home Pay', value: fmt(bd.netIncome), color: 'var(--green)' },
          { label: 'Effective Rate', value: fmtPct(page.effectiveRate), color: 'var(--muted)' },
          { label: 'Marginal Rate', value: fmtPct(page.marginalRate), color: 'var(--muted)' },
        ].map(s => (
          <div
            key={s.label}
            style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '1rem' }}
          >
            <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <KeyFactsStrip facts={page.keyFacts} />

      {/* Bracket breakdown */}
      <div style={card}>
        <h2 style={h2Style}>Federal Tax Bracket Breakdown ({FILING_STATUS_LABELS[bd.filing]})</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Bracket</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Taxable in Bracket</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tax Paid</th>
            </tr>
          </thead>
          <tbody>
            {bd.bracketContributions.map((b, i) => (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--accent)' }}>{fmtPct(b.rate, 0)}</td>
                <td style={tdNum}>{fmt(b.taxableAmount)}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(b.taxPaid)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...tdStyle, fontWeight: 800 }}>Federal Income Tax</td>
              <td style={tdNum}>{fmt(bd.taxableIncome)}</td>
              <td style={{ ...tdNum, fontWeight: 800, color: '#ef4444' }}>{fmt(bd.totalFederalTax)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Social Security (6.2%)</td>
              <td style={tdNum}>{fmt(Math.min(bd.grossIncome, 176100))}</td>
              <td style={{ ...tdNum, color: '#f59e0b' }}>{fmt(bd.ficaSocialSecurity)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Medicare (1.45%+)</td>
              <td style={tdNum}>{fmt(bd.grossIncome)}</td>
              <td style={{ ...tdNum, color: '#f59e0b' }}>{fmt(bd.ficaMedicare)}</td>
            </tr>
            <tr>
              <td style={{ ...tdStyle, fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>Take-Home Pay</td>
              <td style={tdNum} />
              <td style={{ ...tdNum, color: 'var(--green)', fontWeight: 800, fontSize: 15 }}>{fmt(bd.netIncome)}</td>
            </tr>
          </tbody>
        </table>
        <p style={{ margin: '0.75rem 0 0', fontSize: 12, color: 'var(--dim)' }}>
          Standard deduction of {fmt(bd.standardDeduction)} applied. Taxable income: {fmt(bd.taxableIncome)}.
        </p>
      </div>

      {/* Filing comparison */}
      <div style={card}>
        <h2 style={h2Style}>{fmt(bd.grossIncome)} Federal Tax — All Filing Statuses</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Filing Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Taxable Income</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Federal Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home</th>
            </tr>
          </thead>
          <tbody>
            {page.comparisonTable.map(row => (
              <tr key={row.filing}>
                <td style={{ ...tdStyle, fontWeight: row.filing === bd.filing ? 700 : 400 }}>
                  {row.label}
                </td>
                <td style={tdNum}>{fmt(row.taxableIncome)}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(row.federalTax)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(row.effectiveRate)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(row.takeHome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot slot="4567890123" format="rectangle" />

      {/* Nearby amounts */}
      <div style={{ ...card, marginTop: '1.25rem' }}>
        <h2 style={h2Style}>Nearby Income Amounts (Single Filer)</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Gross Income</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Federal Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home</th>
            </tr>
          </thead>
          <tbody>
            {page.nearbyAmounts.map(row => (
              <tr key={row.amount}>
                <td style={tdStyle}>
                  <Link href={`/tax/${row.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    {fmt(row.amount)}
                  </Link>
                </td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(row.federalTax)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(row.effectiveRate)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(row.takeHome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `How much federal tax do I pay on ${fmt(bd.grossIncome)}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `A ${FILING_STATUS_LABELS[bd.filing].toLowerCase()} filer earning ${fmt(bd.grossIncome)} pays ${fmt(bd.totalFederalTax)} in federal income tax — an effective rate of ${fmtPct(page.effectiveRate)}. The marginal rate is ${fmtPct(page.marginalRate)}.`,
                },
              },
              {
                '@type': 'Question',
                name: `What is the take-home pay on ${fmt(bd.grossIncome)}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `After federal income tax and FICA (Social Security and Medicare), take-home pay is ${fmt(bd.netIncome)} per year.`,
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}

// ─── Capital Gains Page ───────────────────────────────────────────────────────

function CapGainsView({ page }: { page: CapGainsTaxPage }) {
  const bd = page.taxBreakdown
  return (
    <>
      {/* Summary strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'Gain Amount', value: fmt(page.gainAmount), color: 'var(--text)' },
          { label: bd.isLongTerm ? 'Long-Term Rate' : 'Short-Term Rate', value: fmtPct(bd.isLongTerm ? bd.longTermRate : bd.taxOwed / page.gainAmount), color: '#ef4444' },
          { label: 'Tax Owed', value: fmt(bd.taxOwed), color: '#ef4444' },
          { label: 'Net Proceeds', value: fmt(bd.netProceeds), color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <KeyFactsStrip facts={page.keyFacts} />

      {/* Filing status comparison */}
      <div style={card}>
        <h2 style={h2Style}>{fmt(page.gainAmount)} {bd.isLongTerm ? 'Long-Term' : 'Short-Term'} Gain — All Filing Statuses</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Filing Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tax Owed</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Net Proceeds</th>
            </tr>
          </thead>
          <tbody>
            {page.comparisonTable.map(row => (
              <tr key={row.filing}>
                <td style={tdStyle}>{row.label}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmtPct(row.rate)}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(row.taxOwed)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(row.netProceeds)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Long vs short comparison */}
      <div style={{ ...card, background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.18)' }}>
        <h2 style={{ ...h2Style, fontSize: '0.95rem' }}>Long-Term vs Short-Term Comparison ({fmt(page.gainAmount)})</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Type</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Tax Owed</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Net Proceeds</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Long-Term (&gt;12 months)</td>
              <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(bd.taxOwed)}</td>
              <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(bd.netProceeds)}</td>
              <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(bd.shortTermComparison - bd.taxOwed)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Short-Term (≤12 months)</td>
              <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(bd.shortTermComparison)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmt(page.gainAmount - bd.shortTermComparison)}</td>
              <td style={{ ...tdNum, color: 'var(--dim)' }}>—</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdSlot slot="5678901234" format="rectangle" />

      {/* Nearby amounts */}
      <div style={{ ...card, marginTop: '1.25rem' }}>
        <h2 style={h2Style}>Other Capital Gain Amounts</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {page.nearbyAmounts.map(row => (
            <Link
              key={row.amount}
              href={`/tax/${row.slug}`}
              style={{
                padding: '6px 14px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                fontSize: 13,
                color: 'var(--muted)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {fmt(row.amount)}
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `How much capital gains tax on ${fmt(page.gainAmount)}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `A ${bd.isLongTerm ? 'long-term' : 'short-term'} capital gain of ${fmt(page.gainAmount)} triggers ${fmt(bd.taxOwed)} in federal tax for a single filer with no other income. Net proceeds after tax: ${fmt(bd.netProceeds)}.`,
                },
              },
              {
                '@type': 'Question',
                name: `Is it better to hold investments long-term for tax purposes?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Long-term capital gains (assets held over 1 year) are taxed at 0%, 15%, or 20% depending on income — significantly lower than short-term gains, which are taxed as ordinary income up to 37%. On ${fmt(page.gainAmount)}, the tax difference between long-term and short-term treatment is ${fmt(bd.shortTermComparison - bd.taxOwed)}.`,
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}

// ─── Self-Employment Tax Page ─────────────────────────────────────────────────

function SETaxView({ page }: { page: SETaxPage }) {
  const bd = page.taxBreakdown
  return (
    <>
      {/* Summary strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'Net Earnings', value: fmt(bd.netEarnings), color: 'var(--text)' },
          { label: 'SE Tax (15.3%)', value: fmt(bd.selfEmploymentTax), color: '#f59e0b' },
          { label: 'Federal Income Tax', value: fmt(bd.federalIncomeTax), color: '#ef4444' },
          { label: 'Total Tax', value: fmt(bd.totalTax), color: '#ef4444' },
          { label: 'Effective Rate', value: fmtPct(bd.effectiveRate), color: 'var(--muted)' },
          { label: 'Take-Home', value: fmt(bd.takeHome), color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <KeyFactsStrip facts={page.keyFacts} />

      {/* SE Tax breakdown */}
      <div style={card}>
        <h2 style={h2Style}>Self-Employment Tax Breakdown ({fmt(bd.netEarnings)} Net Earnings)</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Net self-employment earnings', value: bd.netEarnings, color: 'var(--text)' },
              { label: 'SE taxable amount (92.35%)', value: bd.seTaxableAmount, color: 'var(--text)' },
              { label: 'Social Security (12.4% of SE taxable)', value: bd.socialSecurityPortion, color: '#f59e0b' },
              { label: 'Medicare (2.9% of SE taxable)', value: bd.medicarePortion, color: '#f59e0b' },
              { label: 'Self-Employment Tax Total', value: bd.selfEmploymentTax, color: '#f59e0b' },
              { label: 'Deductible half of SE tax', value: -bd.deductibleHalf, color: 'var(--green)' },
              { label: 'Adjusted Gross Income', value: bd.adjustedGrossIncome, color: 'var(--text)' },
              { label: 'Federal Income Tax (after std. deduction)', value: bd.federalIncomeTax, color: '#ef4444' },
              { label: 'Total Tax Burden', value: bd.totalTax, color: '#ef4444' },
              { label: 'Take-Home Pay', value: bd.takeHome, color: 'var(--green)' },
            ].map(row => (
              <tr key={row.label}>
                <td style={tdStyle}>{row.label}</td>
                <td style={{ ...tdNum, color: row.color, fontWeight: row.label.includes('Total') || row.label.includes('Take-Home') ? 800 : 400 }}>
                  {row.value < 0 ? `(${fmt(-row.value)})` : fmt(row.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot slot="6789012345" format="rectangle" />

      {/* Nearby amounts */}
      <div style={{ ...card, marginTop: '1.25rem' }}>
        <h2 style={h2Style}>SE Tax at Other Income Levels</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Net Earnings</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>SE Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home</th>
            </tr>
          </thead>
          <tbody>
            {page.nearbyAmounts.filter(r => r.amount > 0).map(row => (
              <tr key={row.amount}>
                <td style={tdStyle}>
                  <Link href={`/tax/${row.slug}`} style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
                    {fmt(row.amount)}
                  </Link>
                </td>
                <td style={{ ...tdNum, color: '#f59e0b' }}>{fmt(row.federalTax * 0.6)}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(row.federalTax)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(row.takeHome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `How much self-employment tax on ${fmt(bd.netEarnings)}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Self-employment tax on ${fmt(bd.netEarnings)} in net earnings is ${fmt(bd.selfEmploymentTax)} (15.3% on 92.35% of net earnings). Combined with federal income tax, total tax is ${fmt(bd.totalTax)} — a ${fmtPct(bd.effectiveRate)} effective rate. Take-home: ${fmt(bd.takeHome)}.`,
                },
              },
              {
                '@type': 'Question',
                name: `Can I deduct self-employment tax from my income?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes. The IRS allows you to deduct 50% of self-employment tax from gross income when calculating federal income tax. On ${fmt(bd.netEarnings)} in net earnings, that deduction is ${fmt(bd.selfEmploymentTax * 0.5)}, reducing your taxable income before federal brackets apply.`,
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}

// ─── State Tax Page ───────────────────────────────────────────────────────────

function StateTaxView({ page }: { page: StateTaxPage }) {
  const bd = page.stateTaxBreakdown
  return (
    <>
      {/* Summary strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: '1.25rem',
        }}
      >
        {[
          { label: 'Gross Income', value: fmt(bd.grossIncome), color: 'var(--text)' },
          { label: 'Federal Income Tax', value: fmt(bd.federalTax), color: '#ef4444' },
          { label: `${page.stateName} State Tax`, value: fmt(bd.stateTax), color: page.hasStateTax ? '#f59e0b' : 'var(--green)' },
          { label: 'FICA', value: fmt(bd.ficaSocialSecurity + bd.ficaMedicare), color: '#f59e0b' },
          { label: 'Total Effective Rate', value: fmtPct(bd.effectiveRate), color: 'var(--muted)' },
          { label: 'Take-Home Pay', value: fmt(bd.takeHome), color: 'var(--green)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '1rem' }}>
            <div style={{ fontSize: 11, color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <KeyFactsStrip facts={page.keyFacts} />

      {/* Full breakdown table */}
      <div style={card}>
        <h2 style={h2Style}>{fmt(bd.grossIncome)} Income Tax Breakdown in {page.stateName}</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Federal Income Tax', value: bd.federalTax, rate: bd.federalTax / bd.grossIncome, color: '#ef4444' },
              { label: `${page.stateName} State Income Tax`, value: bd.stateTax, rate: bd.stateEffectiveRate, color: page.hasStateTax ? '#f59e0b' : 'var(--green)' },
              { label: 'Social Security (6.2%)', value: bd.ficaSocialSecurity, rate: bd.ficaSocialSecurity / bd.grossIncome, color: '#f59e0b' },
              { label: 'Medicare (1.45%+)', value: bd.ficaMedicare, rate: bd.ficaMedicare / bd.grossIncome, color: '#f59e0b' },
            ].map(row => (
              <tr key={row.label}>
                <td style={tdStyle}>{row.label}</td>
                <td style={{ ...tdNum, color: row.color }}>{page.hasStateTax || row.label !== `${page.stateName} State Income Tax` ? fmt(row.value) : '$0'}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(row.rate)}</td>
              </tr>
            ))}
            <tr>
              <td style={{ ...tdStyle, fontWeight: 800 }}>Total Tax</td>
              <td style={{ ...tdNum, fontWeight: 800, color: '#ef4444' }}>{fmt(bd.totalTax)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(bd.effectiveRate)}</td>
            </tr>
            <tr>
              <td style={{ ...tdStyle, fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>Take-Home Pay</td>
              <td style={{ ...tdNum, fontWeight: 800, color: 'var(--green)', fontSize: 15 }}>{fmt(bd.takeHome)}</td>
              <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(bd.takeHome / bd.grossIncome)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Federal comparison by filing status */}
      <div style={card}>
        <h2 style={h2Style}>{fmt(bd.grossIncome)} Federal Tax — Filing Status Comparison</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Filing Status</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Federal Tax</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Eff. Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Take-Home (fed only)</th>
            </tr>
          </thead>
          <tbody>
            {page.comparisonTable.map(row => (
              <tr key={row.filing}>
                <td style={tdStyle}>{row.label}</td>
                <td style={{ ...tdNum, color: '#ef4444' }}>{fmt(row.federalTax)}</td>
                <td style={{ ...tdNum, color: 'var(--muted)' }}>{fmtPct(row.effectiveRate)}</td>
                <td style={{ ...tdNum, color: 'var(--green)' }}>{fmt(row.takeHome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot slot="7890123456" format="rectangle" />

      {/* Nearby amounts */}
      <div style={{ ...card, marginTop: '1.25rem' }}>
        <h2 style={h2Style}>Other Income Levels in {page.stateName}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {page.nearbyAmounts.filter(r => r.amount > 0).map(row => (
            <Link
              key={row.amount}
              href={`/tax/${row.slug}`}
              style={{
                padding: '6px 14px',
                background: 'var(--bg)',
                border: '1px solid var(--line)',
                borderRadius: 16,
                fontSize: 13,
                color: 'var(--muted)',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              {fmt(row.amount)}
            </Link>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `How much is ${page.stateName} income tax on ${fmt(bd.grossIncome)}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: page.hasStateTax
                    ? `${page.stateName} income tax on ${fmt(bd.grossIncome)} is ${fmt(bd.stateTax)} — a ${fmtPct(bd.stateEffectiveRate)} effective state rate. Combined with federal taxes and FICA, total tax is ${fmt(bd.totalTax)}, leaving take-home pay of ${fmt(bd.takeHome)}.`
                    : `${page.stateName} has no state income tax. At ${fmt(bd.grossIncome)}, you pay only federal taxes of ${fmt(bd.federalTax + bd.ficaSocialSecurity + bd.ficaMedicare)}, keeping ${fmt(bd.takeHome)}.`,
                },
              },
              {
                '@type': 'Question',
                name: `What is the total tax burden on ${fmt(bd.grossIncome)} in ${page.stateName}?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `On ${fmt(bd.grossIncome)} gross income in ${page.stateName}, total taxes equal ${fmt(bd.totalTax)} — a ${fmtPct(bd.effectiveRate)} combined effective rate. This includes federal income tax (${fmt(bd.federalTax)}), ${page.hasStateTax ? `${page.stateName} state income tax (${fmt(bd.stateTax)}), ` : 'no state income tax, '}Social Security (${fmt(bd.ficaSocialSecurity)}), and Medicare (${fmt(bd.ficaMedicare)}).`,
                },
              },
            ],
          }),
        }}
      />
    </>
  )
}

// ─── Tax Guide Page ───────────────────────────────────────────────────────────

function TaxGuideView({ page }: { page: TaxGuidePage }) {
  return (
    <>
      {/* Sections */}
      {page.sections.map((section, i) => (
        <div key={i} style={card}>
          <h2 style={h2Style}>{section.heading}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 1rem', fontSize: '0.95rem' }}>
            {section.body}
          </p>
          {section.table && (
            <table style={tableStyle}>
              <thead>
                <tr>
                  {section.table.headers.map(h => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{ ...tdStyle, fontWeight: ci === 0 ? 600 : 400, color: ci === 0 ? 'var(--accent)' : 'var(--text)' }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {i === 1 && <AdSlot slot="8901234567" format="rectangle" />}
        </div>
      ))}

      {/* FAQ */}
      {page.faq.length > 0 && (
        <div style={card}>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          {page.faq.map((item, i) => (
            <div key={i} style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
                {item.q}
              </h3>
              <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* FAQ Schema */}
      {page.jsonLdFaq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: page.jsonLdFaq.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }),
          }}
        />
      )}
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default async function TaxSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = parseTaxSlug(slug)
  if (!config) notFound()

  let content: React.ReactNode = null
  let h1 = ''
  let breadcrumbLabel = ''
  let relatedLinks: { title: string; href: string; icon: string }[] = []

  if (config.type === 'federal' && config.amount !== undefined && config.filing) {
    const page = generateFederalTaxPage(config.amount, config.filing)
    h1 = page.h1
    relatedLinks = page.relatedLinks
    breadcrumbLabel = 'Federal Income Tax'
    content = <FederalTaxView page={page} slug={slug} />
  } else if (config.type === 'capital-gains' && config.amount !== undefined && config.holdingPeriod) {
    const page = generateCapitalGainsPage(config.amount, config.holdingPeriod)
    h1 = page.h1
    relatedLinks = page.relatedLinks
    breadcrumbLabel = 'Capital Gains Tax'
    content = <CapGainsView page={page} />
  } else if (config.type === 'self-employment' && config.amount !== undefined) {
    const page = generateSETaxPage(config.amount)
    h1 = page.h1
    relatedLinks = page.relatedLinks
    breadcrumbLabel = 'Self-Employment Tax'
    content = <SETaxView page={page} />
  } else if (config.type === 'state' && config.stateSlug && config.amount !== undefined) {
    const page = generateStateTaxPage(config.stateSlug, config.amount)
    h1 = page.h1
    relatedLinks = page.relatedLinks
    breadcrumbLabel = 'State Income Tax'
    content = <StateTaxView page={page} />
  } else if (config.type === 'guide' && config.topic) {
    const page = generateTaxGuidePage(config.topic)
    h1 = page.h1
    relatedLinks = page.relatedLinks
    breadcrumbLabel = 'Tax Guide'
    content = <TaxGuideView page={page} />
  } else {
    notFound()
  }

  return (
    <div
      style={{
        maxWidth: 860,
        margin: '0 auto',
        padding: '2rem 1rem 4rem',
      }}
    >
      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: 'var(--dim)', marginBottom: '1rem' }}>
        <Link href="/" style={{ color: 'var(--dim)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <Link href="/tax" style={{ color: 'var(--dim)', textDecoration: 'none' }}>Tax</Link>
        {' / '}
        <span style={{ color: 'var(--muted)' }}>{breadcrumbLabel}</span>
      </nav>

      {/* H1 */}
      <h1
        style={{
          fontSize: 'clamp(1.4rem, 3.5vw, 2rem)',
          fontWeight: 900,
          color: 'var(--text)',
          margin: '0 0 0.5rem',
          lineHeight: 1.25,
        }}
      >
        {h1}
      </h1>

      <p style={{ color: 'var(--dim)', fontSize: 13, marginBottom: '1.5rem' }}>
        2025 IRS data — updated for current tax year
      </p>

      {/* Top Ad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot slot="9012345678" format="leaderboard" />
      </div>

      {/* Page content */}
      {content}

      {/* Related links */}
      <RelatedLinks links={relatedLinks} title="Related Calculators & Tax Tools" />

      {/* Bottom Ad */}
      <div style={{ marginTop: '2.5rem' }}>
        <AdSlot slot="0123456789" format="leaderboard" />
      </div>
    </div>
  )
}
