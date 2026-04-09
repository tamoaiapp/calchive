import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { MORTGAGE_PAGE_SLUGS, parseMortgageSlug } from '@/lib/mortgage/pages-manifest'
import { calculateMortgage, formatUSD, formatPct } from '@/lib/mortgage/calculator'
import { MORTGAGE_RATES_2025, STATE_PROPERTY_TAX } from '@/lib/mortgage/data'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return MORTGAGE_PAGE_SLUGS.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = parseMortgageSlug(slug)
  if (!config) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  if (config.type === 'state-price') {
    const rate = MORTGAGE_RATES_2025.rate30Fixed
    const data = calculateMortgage(config.homePrice!, 20, rate, 30, config.stateSlug!)
    const propTaxRate = STATE_PROPERTY_TAX[config.stateSlug!] ?? 0.011
    const vi = (config.stateSlug!.charCodeAt(0) + Math.floor(config.homePrice! / 100000)) % 4
    const titleVariants = [
      `Mortgage on a ${formatUSD(config.homePrice!)} Home in ${config.stateName}: Monthly Payment`,
      `${formatUSD(config.homePrice!)} Home in ${config.stateName} — Monthly Mortgage Payment (2025)`,
      `${config.stateName} Mortgage: ${formatUSD(config.homePrice!)} Home, ${formatUSD(data.totalMonthlyPayment)}/mo`,
      `Monthly Cost of a ${formatUSD(config.homePrice!)} Home in ${config.stateName}`,
    ]
    const descVariants = [
      `Monthly mortgage payment on a ${formatUSD(config.homePrice!)} home in ${config.stateName}: ${formatUSD(data.totalMonthlyPayment)}/mo total (${formatUSD(data.monthlyPrincipalInterest)} P&I + property tax + insurance). Full 30-year and 15-year breakdown.`,
      `At ${rate}% (30-year fixed, 20% down), a ${formatUSD(config.homePrice!)} home in ${config.stateName} costs ${formatUSD(data.totalMonthlyPayment)}/month all-in. Includes ${formatUSD(data.monthlyPropertyTax)}/mo in property taxes.`,
      `${config.stateName} property tax rate: ${formatPct(propTaxRate * 100, 2)}. On a ${formatUSD(config.homePrice!)} purchase with 20% down, total monthly payment is ${formatUSD(data.totalMonthlyPayment)} — P&I, taxes, and insurance included.`,
      `Buying a ${formatUSD(config.homePrice!)} home in ${config.stateName}? Expect ${formatUSD(data.totalMonthlyPayment)}/month at ${rate}% on a 30-year loan. See 15-year costs, PMI scenarios, and income required.`,
    ]
    title = titleVariants[vi]
    description = descVariants[vi]
  } else if (config.type === 'rate-scenario') {
    title = `Mortgage Payment at ${config.rate}% on a ${formatUSD(config.homePrice!)} Home`
    description = `What is the monthly mortgage payment at ${config.rate}% interest on a ${formatUSD(config.homePrice!)} home? Full amortization breakdown for 30-year and 15-year terms.`
  } else if (config.type === 'refinance') {
    title = `Refinance ${config.currentRate}% to ${config.newRate}% on ${formatUSD(config.balance!)} Balance`
    description = `Should you refinance from ${config.currentRate}% to ${config.newRate}% on a ${formatUSD(config.balance!)} mortgage? Monthly savings, break-even point, and total interest comparison.`
  } else if (config.type === 'guide') {
    title = `${config.guideTitle} | Calchive`
    description = `Complete guide to ${config.guideTitle?.toLowerCase()}. Real 2025 data, calculations, and expert tips.`
  }

  return {
    title,
    description,
    alternates: { canonical: `/mortgage/${slug}` },
    openGraph: { title, description, type: 'website' },
  }
}

// Shared styles
const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.5rem',
  marginBottom: '1.5rem',
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

const highlightNum: React.CSSProperties = {
  fontSize: 'clamp(2rem, 6vw, 3rem)',
  fontWeight: 900,
  color: 'var(--accent)',
  lineHeight: 1,
}

// ————————————————————————————————————————
// State+Price Page
// ————————————————————————————————————————
function StatePricePage({ stateSlug, stateName, homePrice }: { stateSlug: string; stateName: string; homePrice: number }) {
  const rate30 = MORTGAGE_RATES_2025.rate30Fixed
  const rate15 = MORTGAGE_RATES_2025.rate15Fixed

  const data30 = calculateMortgage(homePrice, 20, rate30, 30, stateSlug)
  const data15 = calculateMortgage(homePrice, 20, rate15, 15, stateSlug)
  const data30pmi = calculateMortgage(homePrice, 10, rate30, 30, stateSlug) // 10% down with PMI

  const propTaxRate = STATE_PROPERTY_TAX[stateSlug] ?? 0.011
  const incomeNeeded = data30.totalMonthlyPayment / 0.28 * 12

  // Rate sensitivity table
  const rateOffsets = [-2, -1, 0, 1, 2]

  // Rotate intro paragraph — deterministic variant from state slug + price bucket
  const variantIdx = (stateSlug.charCodeAt(0) + Math.floor(homePrice / 100000)) % 4
  const h1Variants = [
    `Mortgage on a ${formatUSD(homePrice)} Home in ${stateName}: Monthly Payment & Full Breakdown`,
    `${formatUSD(homePrice)} Home in ${stateName}: What's the Monthly Mortgage Payment?`,
    `${stateName} Mortgage Calculator — ${formatUSD(homePrice)} Home Price`,
    `Monthly Cost of a ${formatUSD(homePrice)} Home in ${stateName} (2025 Rates)`,
  ]
  const introVariants = [
    <>With 20% down and a {rate30}% 30-year fixed rate, the total monthly payment on a {formatUSD(homePrice)} home in {stateName} is{' '}
      <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalMonthlyPayment)}</strong> — including principal, interest, property tax, and insurance.
      {' '}{stateName}&apos;s effective property tax rate is {formatPct(propTaxRate * 100, 2)}, which adds {formatUSD(data30.monthlyPropertyTax)}/month.</>,
    <>A {formatUSD(homePrice)} home in {stateName} at {rate30}% (30-year fixed, 20% down) runs{' '}
      <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalMonthlyPayment)}/month</strong> all-in.
      {' '}That includes {formatUSD(data30.monthlyPrincipalInterest)} P&amp;I, {formatUSD(data30.monthlyPropertyTax)} in property taxes, and {formatUSD(data30.monthlyInsurance)} in home insurance.</>,
    <>{stateName}&apos;s {formatPct(propTaxRate * 100, 2)} property tax rate adds {formatUSD(data30.monthlyPropertyTax)}/month on a {formatUSD(homePrice)} home.
      {' '}At current 30-year rates ({rate30}%), total monthly housing cost reaches{' '}
      <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalMonthlyPayment)}</strong> with 20% down.</>,
    <>Buying a {formatUSD(homePrice)} home in {stateName}? At {rate30}% on a 30-year loan with 20% down, expect to pay{' '}
      <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalMonthlyPayment)}/month</strong> — or {formatUSD(data15.totalMonthlyPayment)}/month on a 15-year term.
      {' '}Income needed to qualify: ~{formatUSD(incomeNeeded)}/year.</>,
  ]

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/mortgage" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mortgage</Link>
        {' › '}
        {stateName}
        {' › '}
        {formatUSD(homePrice)}
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        {h1Variants[variantIdx]}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        {introVariants[variantIdx]}
      </p>

      <AdSlot slot="2001" format="leaderboard" />

      {/* Primary breakdown */}
      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: '1.25rem' }}>
          Monthly Payment Breakdown (30-Year, 20% Down)
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={highlightNum}>{formatUSD(data30.monthlyPrincipalInterest)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Principal &amp; Interest</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...highlightNum, color: 'var(--text)', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>{formatUSD(data30.monthlyPropertyTax)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Property Tax/mo</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...highlightNum, color: 'var(--text)', fontSize: 'clamp(1.4rem, 4vw, 2rem)' }}>{formatUSD(data30.monthlyInsurance)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Home Insurance/mo</div>
          </div>
          <div style={{ textAlign: 'center', background: 'rgba(59,130,246,0.07)', borderRadius: 12, padding: '12px 8px' }}>
            <div style={{ ...highlightNum, fontSize: 'clamp(1.6rem, 5vw, 2.4rem)' }}>{formatUSD(data30.totalMonthlyPayment)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontWeight: 700 }}>Total Monthly</div>
          </div>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Component</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Annual</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Principal &amp; Interest ({rate30}%)</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPrincipalInterest)}</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPrincipalInterest * 12)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Property Tax ({formatPct(propTaxRate * 100, 2)} rate)</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPropertyTax)}</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPropertyTax * 12)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Homeowner&apos;s Insurance</td>
              <td style={tdNum}>{formatUSD(data30.monthlyInsurance)}</td>
              <td style={tdNum}>{formatUSD(data30.monthlyInsurance * 12)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>PMI (with 20% down)</td>
              <td style={tdNum}>$0</td>
              <td style={tdNum}>$0</td>
            </tr>
            <tr style={{ background: 'rgba(59,130,246,0.05)' }}>
              <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--text)' }}>Total Monthly Payment</td>
              <td style={{ ...tdNum, color: 'var(--accent)' }}>{formatUSD(data30.totalMonthlyPayment)}</td>
              <td style={{ ...tdNum, color: 'var(--accent)' }}>{formatUSD(data30.totalMonthlyPayment * 12)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 10% down with PMI */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          With 10% Down (PMI Required)
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12 }}>
          A 10% down payment on {formatUSD(homePrice)} means a {formatUSD(data30pmi.downPayment)} down payment
          and a {formatUSD(data30pmi.loanAmount)} loan. PMI adds {formatUSD(data30pmi.monthlyPMI)}/month
          until you reach 20% equity (estimated: {data30pmi.pmiEndDate}).
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Component</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Principal &amp; Interest</td>
              <td style={tdNum}>{formatUSD(data30pmi.monthlyPrincipalInterest)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Property Tax</td>
              <td style={tdNum}>{formatUSD(data30pmi.monthlyPropertyTax)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Insurance</td>
              <td style={tdNum}>{formatUSD(data30pmi.monthlyInsurance)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>PMI (~0.5%/year)</td>
              <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(data30pmi.monthlyPMI)}</td>
            </tr>
            <tr style={{ background: 'rgba(59,130,246,0.05)' }}>
              <td style={{ ...tdStyle, fontWeight: 700 }}>Total</td>
              <td style={{ ...tdNum, color: 'var(--accent)' }}>{formatUSD(data30pmi.totalMonthlyPayment)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 30 vs 15 year */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          30-Year vs 15-Year Mortgage
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Metric</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>30-Year ({rate30}%)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>15-Year ({rate15}%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Monthly P&amp;I</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPrincipalInterest)}</td>
              <td style={tdNum}>{formatUSD(data15.monthlyPrincipalInterest)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Total Monthly</td>
              <td style={tdNum}>{formatUSD(data30.totalMonthlyPayment)}</td>
              <td style={tdNum}>{formatUSD(data15.totalMonthlyPayment)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Total Interest Paid</td>
              <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(data30.totalInterestPaid)}</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(data15.totalInterestPaid)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Total Cost</td>
              <td style={tdNum}>{formatUSD(data30.totalPaid)}</td>
              <td style={tdNum}>{formatUSD(data15.totalPaid)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Interest Saved (15yr)</td>
              <td style={tdNum}>—</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(data30.totalInterestPaid - data15.totalInterestPaid)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <AdSlot slot="2002" format="rectangle" />

      {/* Amortization highlights */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Equity Growth Over Time
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          {[
            { label: 'At Purchase', balance: data30.loanAmount, equity: data30.downPaymentPct },
            { label: 'After 5 Years', balance: data30.amortizationYear5.balance, equity: data30.amortizationYear5.equityPct },
            { label: 'After 10 Years', balance: data30.amortizationYear10.balance, equity: data30.amortizationYear10.equityPct },
            { label: 'Loan Paid Off', balance: 0, equity: 100 },
          ].map(({ label, balance, equity }) => (
            <div key={label} style={{ background: 'var(--bg2)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{formatPct(equity, 1)} equity</div>
              <div style={{ fontSize: 13, color: 'var(--dim)', marginTop: 3 }}>Balance: {formatUSD(balance)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Income needed */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '0.75rem' }}>
          What Income Do You Need?
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          Lenders typically require housing costs to stay at or below 28% of gross monthly income.
          To comfortably afford a {formatUSD(data30.totalMonthlyPayment)}/month payment, you need a gross income
          of at least <strong style={{ color: 'var(--text)', fontSize: 16 }}>{formatUSD(incomeNeeded)}/year</strong>{' '}
          ({formatUSD(incomeNeeded / 12)}/month before taxes).
          With a front-end ratio of 36% (common for conventional loans), you&apos;d need{' '}
          <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalMonthlyPayment / 0.36 * 12)}/year</strong>.
        </p>
      </div>

      {/* Rate sensitivity */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Payment at Different Interest Rates
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Interest Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly P&amp;I</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {rateOffsets.map(offset => {
              const r = Math.max(1, rate30 + offset)
              const d = calculateMortgage(homePrice, 20, r, 30, stateSlug)
              const isCurrentRate = offset === 0
              return (
                <tr key={offset} style={isCurrentRate ? { background: 'rgba(59,130,246,0.07)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrentRate ? 700 : 400 }}>
                    {formatPct(r)} {isCurrentRate && <span style={{ fontSize: 11, color: 'var(--accent)', marginLeft: 6 }}>current</span>}
                  </td>
                  <td style={{ ...tdNum, fontWeight: isCurrentRate ? 700 : 400 }}>{formatUSD(d.monthlyPrincipalInterest)}</td>
                  <td style={{ ...tdNum, color: isCurrentRate ? 'var(--accent)' : 'var(--text)', fontWeight: isCurrentRate ? 700 : 400 }}>{formatUSD(d.totalMonthlyPayment)}</td>
                  <td style={tdNum}>{formatUSD(d.totalInterestPaid)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Salary After Tax Calculator', href: '/salary', icon: '💰' },
          { title: 'Home Affordability Guide', href: '/mortgage/how-much-house-can-i-afford', icon: '🏠' },
          { title: 'PMI Explained', href: '/mortgage/pmi-explained', icon: '📋' },
          { title: '15 vs 30 Year Mortgage', href: '/mortgage/15-vs-30-year-mortgage', icon: '📊' },
          { title: 'Mortgage Rates Guide', href: '/mortgage/arm-vs-fixed-rate', icon: '📈' },
          { title: 'Personal Loan Calculator', href: '/loan', icon: '🏦' },
        ]}
      />

      <AdSlot slot="2003" format="auto" />
    </div>
  )
}

// ————————————————————————————————————————
// Rate Scenario Page
// ————————————————————————————————————————
function RateScenarioPage({ rate, homePrice }: { rate: number; homePrice: number }) {
  const data30 = calculateMortgage(homePrice, 20, rate, 30, 'texas')
  const data15 = calculateMortgage(homePrice, 20, rate * 0.92, 15, 'texas')

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/mortgage" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mortgage</Link>
        {' › '} Rate Scenarios
      </nav>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        Mortgage Payment at {rate}% on a {formatUSD(homePrice)} Home
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        At a {rate}% fixed rate, the monthly principal and interest payment on a {formatUSD(homePrice)} home
        (with 20% down) is <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.monthlyPrincipalInterest)}</strong>.
        Total cost over 30 years: <strong style={{ color: 'var(--text)' }}>{formatUSD(data30.totalPaid)}</strong>{' '}
        ({formatUSD(data30.totalInterestPaid)} in interest).
      </p>

      <AdSlot slot="2004" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>30-Year Fixed at {rate}%</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: '1.5rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={highlightNum}>{formatUSD(data30.monthlyPrincipalInterest)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Monthly P&amp;I</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...highlightNum, fontSize: '2rem', color: 'var(--text)' }}>{formatUSD(data30.totalInterestPaid)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Total Interest</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ ...highlightNum, fontSize: '2rem', color: 'var(--text)' }}>{formatUSD(data30.loanAmount)}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Loan Amount (20% down)</div>
          </div>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--muted)' }}>By Down Payment</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Down Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Loan Amount</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly P&amp;I</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {[5, 10, 20, 25, 30].map(dp => {
              const d = calculateMortgage(homePrice, dp, rate, 30, 'texas')
              return (
                <tr key={dp} style={dp === 20 ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: dp === 20 ? 700 : 400 }}>{dp}% ({formatUSD(d.downPayment)})</td>
                  <td style={tdNum}>{formatUSD(d.loanAmount)}</td>
                  <td style={{ ...tdNum, fontWeight: dp === 20 ? 700 : 400 }}>{formatUSD(d.monthlyPrincipalInterest)}</td>
                  <td style={tdNum}>{formatUSD(d.totalInterestPaid)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>30-Year vs 15-Year at {rate}%</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Term</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly P&amp;I</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>30-Year Fixed</td>
              <td style={tdNum}>{formatPct(rate)}</td>
              <td style={tdNum}>{formatUSD(data30.monthlyPrincipalInterest)}</td>
              <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(data30.totalInterestPaid)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>15-Year Fixed</td>
              <td style={tdNum}>{formatPct(data15.interestRate)}</td>
              <td style={tdNum}>{formatUSD(data15.monthlyPrincipalInterest)}</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(data15.totalInterestPaid)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Texas $' + (homePrice / 1000).toFixed(0) + 'k Mortgage', href: `/mortgage/texas-${homePrice}`, icon: '🏠' },
          { title: 'California $' + (homePrice / 1000).toFixed(0) + 'k Mortgage', href: `/mortgage/california-${homePrice}`, icon: '🏠' },
          { title: 'ARM vs Fixed Rate', href: '/mortgage/arm-vs-fixed-rate', icon: '📈' },
          { title: 'Mortgage Payment Calculator', href: '/mortgage', icon: '🔢' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Refinance Page
// ————————————————————————————————————————
function RefinancePage({ currentRate, newRate, balance }: { currentRate: number; newRate: number; balance: number }) {
  const currentData = calculateMortgage(balance, 100, currentRate, 30, 'texas', 0)
  const newData = calculateMortgage(balance, 100, newRate, 30, 'texas', 0)
  // Patch: use loan amount = balance directly
  const oldMonthly = currentData.monthlyPrincipalInterest
  const newMonthly = newData.monthlyPrincipalInterest
  const monthlySavings = oldMonthly - newMonthly
  const closingCosts = balance * 0.02 // typical 2%
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : 0

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/mortgage" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mortgage</Link>
        {' › '} Refinance Calculator
      </nav>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        Refinancing {formatUSD(balance)} from {currentRate}% to {newRate}%: Monthly Savings &amp; Break-Even
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        Dropping from {currentRate}% to {newRate}% on a {formatUSD(balance)} mortgage balance saves{' '}
        <strong style={{ color: 'var(--text)' }}>{formatUSD(monthlySavings)}/month</strong>.
        At estimated closing costs of {formatUSD(closingCosts)} (2%), you break even in{' '}
        <strong style={{ color: 'var(--text)' }}>{breakEvenMonths} months</strong>.
      </p>

      <AdSlot slot="2005" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>Refinance Comparison</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Metric</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Current ({currentRate}%)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>New ({newRate}%)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Savings</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Monthly Payment</td>
              <td style={tdNum}>{formatUSD(oldMonthly)}</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(newMonthly)}</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(monthlySavings)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Annual Savings</td>
              <td style={tdNum}>—</td>
              <td style={tdNum}>—</td>
              <td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(monthlySavings * 12)}</td>
            </tr>
            <tr>
              <td style={tdStyle}>Closing Costs (~2%)</td>
              <td style={tdNum}>{formatUSD(closingCosts)}</td>
              <td style={tdNum}>—</td>
              <td style={tdNum}>—</td>
            </tr>
            <tr>
              <td style={tdStyle}>Break-Even Point</td>
              <td style={tdNum}>—</td>
              <td style={tdNum}>—</td>
              <td style={tdNum}>{breakEvenMonths} months</td>
            </tr>
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Mortgage Payment Calculator', href: '/mortgage', icon: '🏠' },
          { title: 'ARM vs Fixed Rate Guide', href: '/mortgage/arm-vs-fixed-rate', icon: '📈' },
          { title: 'Mortgage Closing Costs', href: '/mortgage/mortgage-closing-costs-guide', icon: '📋' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Guide Page
// ————————————————————————————————————————
function GuidePage({ guideSlug, guideTitle }: { guideSlug: string; guideTitle: string }) {
  const guideContent: Record<string, React.ReactNode> = {
    'how-much-house-can-i-afford': (
      <>
        <p>The standard rule: keep your total housing payment (principal, interest, taxes, insurance) at or below <strong>28% of your gross monthly income</strong>. Some lenders allow up to 36%.</p>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>Quick Affordability Estimates</h2>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Annual Income</th><th style={{ ...thStyle, textAlign: 'right' }}>Max Monthly Payment (28%)</th><th style={{ ...thStyle, textAlign: 'right' }}>Approx Home Price</th></tr></thead>
          <tbody>
            {[50000, 75000, 100000, 125000, 150000, 200000].map(income => (
              <tr key={income}>
                <td style={tdStyle}>{formatUSD(income)}/yr</td>
                <td style={tdNum}>{formatUSD(income / 12 * 0.28)}</td>
                <td style={tdNum}>{formatUSD(income * 3.5)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 12 }}>Home price estimate assumes 20% down and a 6.85% 30-year rate.</p>
      </>
    ),
    'pmi-explained': (
      <>
        <p>Private Mortgage Insurance (PMI) is required when your down payment is less than 20%. It typically costs <strong>0.5%–1.5% of the loan amount per year</strong>.</p>
        <h2 style={{ fontSize: 18, fontWeight: 700, margin: '1.5rem 0 0.75rem' }}>PMI Cost by Loan Amount</h2>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Loan Amount</th><th style={{ ...thStyle, textAlign: 'right' }}>PMI/Month (0.5%)</th><th style={{ ...thStyle, textAlign: 'right' }}>PMI/Month (1.0%)</th></tr></thead>
          <tbody>
            {[150000, 200000, 300000, 400000, 500000].map(loan => (
              <tr key={loan}>
                <td style={tdStyle}>{formatUSD(loan)}</td>
                <td style={tdNum}>{formatUSD(loan * 0.005 / 12)}</td>
                <td style={tdNum}>{formatUSD(loan * 0.01 / 12)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>PMI cancels automatically when you reach 22% equity (by payment history) or you can request removal at 20%.</p>
      </>
    ),
    'fha-vs-conventional': (
      <>
        <p>FHA loans require as little as 3.5% down and accept credit scores as low as 580. Conventional loans typically need 620+ credit and 3%+ down.</p>
        <table style={tableStyle}>
          <thead><tr><th style={thStyle}>Feature</th><th style={{ ...thStyle, textAlign: 'right' }}>FHA</th><th style={{ ...thStyle, textAlign: 'right' }}>Conventional</th></tr></thead>
          <tbody>
            {[
              ['Min. Down Payment', '3.5%', '3%'],
              ['Min. Credit Score', '580 (500 with 10% down)', '620'],
              ['Mortgage Insurance', 'Required all loans under 10% down; life of loan if &lt;10%', 'PMI until 20% equity (removable)'],
              ['Loan Limit (2025)', '$524,225 (standard)', '$806,500'],
              ['Current Rate', '6.65%', '6.85%'],
            ].map(([feature, fha, conv]) => (
              <tr key={String(feature)}>
                <td style={tdStyle}>{feature}</td>
                <td style={tdNum}>{fha}</td>
                <td style={tdNum}>{conv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    ),
    '15-vs-30-year-mortgage': (
      <>
        <p>A 15-year mortgage saves tens of thousands in interest but requires a higher monthly payment. At a $350,000 home with 20% down:</p>
        {(() => {
          const d30 = calculateMortgage(350000, 20, MORTGAGE_RATES_2025.rate30Fixed, 30, 'texas')
          const d15 = calculateMortgage(350000, 20, MORTGAGE_RATES_2025.rate15Fixed, 15, 'texas')
          return (
            <table style={tableStyle}>
              <thead><tr><th style={thStyle}>Metric</th><th style={{ ...thStyle, textAlign: 'right' }}>30-Year</th><th style={{ ...thStyle, textAlign: 'right' }}>15-Year</th></tr></thead>
              <tbody>
                <tr><td style={tdStyle}>Rate</td><td style={tdNum}>{MORTGAGE_RATES_2025.rate30Fixed}%</td><td style={tdNum}>{MORTGAGE_RATES_2025.rate15Fixed}%</td></tr>
                <tr><td style={tdStyle}>Monthly P&I</td><td style={tdNum}>{formatUSD(d30.monthlyPrincipalInterest)}</td><td style={tdNum}>{formatUSD(d15.monthlyPrincipalInterest)}</td></tr>
                <tr><td style={tdStyle}>Total Interest</td><td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(d30.totalInterestPaid)}</td><td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(d15.totalInterestPaid)}</td></tr>
                <tr><td style={tdStyle}>Interest Saved</td><td style={tdNum}>—</td><td style={{ ...tdNum, color: '#34d399' }}>{formatUSD(d30.totalInterestPaid - d15.totalInterestPaid)}</td></tr>
              </tbody>
            </table>
          )
        })()}
      </>
    ),
  }

  const content = guideContent[guideSlug] ?? (
    <p style={{ color: 'var(--muted)' }}>Comprehensive guide coming soon. Browse mortgage calculators below.</p>
  )

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/mortgage" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Mortgage</Link>
        {' › '} Guide
      </nav>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem' }}>
        {guideTitle}
      </h1>

      <AdSlot slot="2006" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem', fontSize: 15, lineHeight: 1.7, color: 'var(--muted)' }}>
        {content}
      </div>

      <RelatedLinks
        links={[
          { title: 'Texas $350k Mortgage', href: '/mortgage/texas-350000', icon: '🏠' },
          { title: 'California $500k Mortgage', href: '/mortgage/california-500000', icon: '🏠' },
          { title: 'Florida $300k Mortgage', href: '/mortgage/florida-300000', icon: '🏠' },
          { title: 'Mortgage Index', href: '/mortgage', icon: '🔢' },
          { title: 'Loan Calculator', href: '/loan', icon: '🏦' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Main export
// ————————————————————————————————————————
export default async function MortgagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = parseMortgageSlug(slug)
  if (!config) notFound()

  const pageUrl = `https://calchive.com/mortgage/${slug}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: pageUrl,
    name: config.type === 'state-price'
      ? `Mortgage on a ${formatUSD(config.homePrice!)} Home in ${config.stateName}`
      : config.type === 'guide'
        ? config.guideTitle
        : `Mortgage Calculator`,
    description: 'Free mortgage calculator with property tax, PMI, and insurance. Monthly payment breakdown for US home buyers.',
    isPartOf: { '@type': 'WebSite', name: 'Calchive', url: 'https://calchive.com' },
  }

  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )

  if (config.type === 'state-price') {
    return <>{jsonLd}<StatePricePage stateSlug={config.stateSlug!} stateName={config.stateName!} homePrice={config.homePrice!} /></>
  }
  if (config.type === 'rate-scenario') {
    return <>{jsonLd}<RateScenarioPage rate={config.rate!} homePrice={config.homePrice!} /></>
  }
  if (config.type === 'refinance') {
    return <>{jsonLd}<RefinancePage currentRate={config.currentRate!} newRate={config.newRate!} balance={config.balance!} /></>
  }
  if (config.type === 'guide') {
    return <>{jsonLd}<GuidePage guideSlug={config.guideSlug!} guideTitle={config.guideTitle!} /></>
  }

  notFound()
}
