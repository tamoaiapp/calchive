import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { LOAN_PAGE_SLUGS, parseLoanSlug } from '@/lib/loan/pages-manifest'
import { calculateLoan, formatUSD, formatUSDCents } from '@/lib/loan/calculator'
import { LOAN_RATES_2025, CREDIT_TIERS, type CreditTier } from '@/lib/loan/data'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return LOAN_PAGE_SLUGS.slice(0, 80).map(slug => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = parseLoanSlug(slug)
  if (!config) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  if (config.type === 'personal') {
    const d = calculateLoan(config.amount!, LOAN_RATES_2025.personal.good, config.termMonths!)
    title = `$${config.amount!.toLocaleString()} Personal Loan: Monthly Payment for ${config.termMonths} Months`
    description = `Monthly payment on a $${config.amount!.toLocaleString()} personal loan over ${config.termMonths} months: ${formatUSDCents(d.monthlyPayment)}/mo at ${LOAN_RATES_2025.personal.good}% (good credit). Full rate comparison by credit score.`
  } else if (config.type === 'auto') {
    const d = calculateLoan(config.amount!, LOAN_RATES_2025.auto_new.good, config.termMonths!)
    title = `$${config.amount!.toLocaleString()} Auto Loan: Monthly Payment for ${config.termMonths} Months`
    description = `Monthly payment on a $${config.amount!.toLocaleString()} car loan over ${config.termMonths} months: ${formatUSDCents(d.monthlyPayment)}/mo at ${LOAN_RATES_2025.auto_new.good}% (good credit). New and used car rate comparison.`
  } else if (config.type === 'student') {
    const d = calculateLoan(config.amount!, LOAN_RATES_2025.student_federal_undergrad, 120)
    title = `$${config.amount!.toLocaleString()} Student Loan: Monthly Payment & Total Cost`
    description = `Monthly payment on $${config.amount!.toLocaleString()} in student loans at ${LOAN_RATES_2025.student_federal_undergrad}% federal rate: ${formatUSDCents(d.monthlyPayment)}/mo over 10 years. Federal vs private rate comparison.`
  } else if (config.type === 'credit-card') {
    const d = calculateLoan(config.amount!, config.apr!, 60)
    title = `Pay Off $${config.amount!.toLocaleString()} Credit Card Balance at ${config.apr}% APR`
    description = `How to pay off $${config.amount!.toLocaleString()} in credit card debt at ${config.apr}% APR. Monthly payment options and total interest at different payoff speeds.`
  } else if (config.type === 'guide') {
    title = `${config.guideTitle} | USA-Calc`
    description = `Complete guide: ${config.guideTitle?.toLowerCase()}. Real 2025 interest rate data and strategies.`
  }

  return {
    title,
    description,
    alternates: { canonical: `/loan/${slug}` },
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

const TIER_COLORS: Record<CreditTier, string> = {
  excellent: '#34d399',
  good: '#60a5fa',
  fair: '#fbbf24',
  bad: '#f87171',
}

// ————————————————————————————————————————
// Personal Loan Page
// ————————————————————————————————————————
function PersonalLoanPage({ amount, termMonths }: { amount: number; termMonths: number }) {
  const rates = LOAN_RATES_2025.personal
  const tiers: CreditTier[] = ['excellent', 'good', 'fair', 'bad']

  const primaryData = calculateLoan(amount, rates.good, termMonths)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/loan" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Loans</Link>
        {' › '} Personal Loans
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        ${amount.toLocaleString()} Personal Loan: Monthly Payment for {termMonths} Months
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        With good credit ({rates.good}% APR), the monthly payment on a ${amount.toLocaleString()} personal loan
        over {termMonths} months is{' '}
        <strong style={{ color: 'var(--text)' }}>{formatUSDCents(primaryData.monthlyPayment)}</strong>.
        Total interest paid: <strong style={{ color: 'var(--text)' }}>{formatUSD(primaryData.totalInterest)}</strong>.
        Payoff date: <strong style={{ color: 'var(--text)' }}>{primaryData.payoffDate}</strong>.
      </p>

      <AdSlot slot="3001" format="leaderboard" />

      {/* Rate by credit score */}
      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: '1.25rem' }}>
          Monthly Payment by Credit Score
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Credit Tier</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate (APR)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map(tier => {
              const rate = rates[tier]
              const d = calculateLoan(amount, rate, termMonths)
              return (
                <tr key={tier} style={tier === 'good' ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    <span style={{ color: TIER_COLORS[tier] }}>●</span>{' '}
                    {CREDIT_TIERS[tier].label}
                  </td>
                  <td style={tdNum}>{rate}%</td>
                  <td style={{ ...tdNum, color: TIER_COLORS[tier] }}>{formatUSDCents(d.monthlyPayment)}</td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                  <td style={tdNum}>{formatUSD(d.totalPaid)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
          Rates based on 2025 average APR from major US lenders. Your rate may vary.
        </p>
      </div>

      {/* Compare terms */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Payment by Loan Term (at {rates.good}% APR)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Term</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {[24, 36, 48, 60, 72].map(term => {
              const d = calculateLoan(amount, rates.good, term)
              const isCurrent = term === termMonths
              return (
                <tr key={term} style={isCurrent ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrent ? 700 : 400 }}>
                    {term} months {isCurrent && <span style={{ fontSize: 11, color: 'var(--accent)' }}>current</span>}
                  </td>
                  <td style={{ ...tdNum, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>
                    {formatUSDCents(d.monthlyPayment)}
                  </td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                  <td style={tdNum}>{formatUSD(d.totalPaid)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AdSlot slot="3002" format="rectangle" />

      {/* Amortization milestones */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Balance Over Time (at {rates.good}% APR)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Remaining Balance</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Paid</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>% Paid Off</th>
            </tr>
          </thead>
          <tbody>
            {primaryData.amortizationMilestones.map(({ month, balance, totalPaid }) => (
              <tr key={month}>
                <td style={tdStyle}>Month {month}</td>
                <td style={tdNum}>{formatUSD(balance)}</td>
                <td style={tdNum}>{formatUSD(totalPaid)}</td>
                <td style={tdNum}>{((1 - balance / amount) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* How to qualify */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '0.75rem' }}>How to Qualify</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          For a ${amount.toLocaleString()} personal loan, most lenders look for a credit score of 620+
          and a debt-to-income ratio below 40%. With excellent credit (750+), you can qualify for rates
          near {rates.excellent}%. With scores below 640, expect APRs of {rates.fair}%–{rates.bad}%
          from subprime lenders. Credit unions typically offer lower rates than online lenders for
          members with fair credit.
        </p>
      </div>

      <RelatedLinks
        links={[
          { title: `$${amount.toLocaleString()} / 36 months`, href: `/loan/personal-loan-${amount}-36-months`, icon: '💰' },
          { title: `$${amount.toLocaleString()} / 48 months`, href: `/loan/personal-loan-${amount}-48-months`, icon: '💰' },
          { title: 'Debt Consolidation Guide', href: '/loan/debt-consolidation-guide', icon: '📋' },
          { title: 'APR vs Interest Rate', href: '/loan/apr-vs-interest-rate-guide', icon: '📊' },
          { title: 'Loan Amortization Explained', href: '/loan/loan-amortization-explained', icon: '📈' },
          { title: 'Mortgage Calculator', href: '/mortgage', icon: '🏠' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Auto Loan Page
// ————————————————————————————————————————
function AutoLoanPage({ amount, termMonths }: { amount: number; termMonths: number }) {
  const ratesNew = LOAN_RATES_2025.auto_new
  const ratesUsed = LOAN_RATES_2025.auto_used
  const tiers: CreditTier[] = ['excellent', 'good', 'fair', 'bad']

  const primaryData = calculateLoan(amount, ratesNew.good, termMonths)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/loan" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Loans</Link>
        {' › '} Auto Loans
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        ${amount.toLocaleString()} Auto Loan: Monthly Payment for {termMonths} Months
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        With good credit, the monthly payment on a ${amount.toLocaleString()} new car loan over {termMonths} months is{' '}
        <strong style={{ color: 'var(--text)' }}>{formatUSDCents(primaryData.monthlyPayment)}</strong> at {ratesNew.good}% APR.
        Total interest: <strong style={{ color: 'var(--text)' }}>{formatUSD(primaryData.totalInterest)}</strong>.
        Payoff date: <strong style={{ color: 'var(--text)' }}>{primaryData.payoffDate}</strong>.
      </p>

      <AdSlot slot="3003" format="leaderboard" />

      {/* New car rates by credit score */}
      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          New Car: Monthly Payment by Credit Score
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Credit Tier</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate (APR)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map(tier => {
              const d = calculateLoan(amount, ratesNew[tier], termMonths)
              return (
                <tr key={tier} style={tier === 'good' ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    <span style={{ color: TIER_COLORS[tier] }}>●</span>{' '}
                    {CREDIT_TIERS[tier].label}
                  </td>
                  <td style={tdNum}>{ratesNew[tier]}%</td>
                  <td style={{ ...tdNum, color: TIER_COLORS[tier] }}>{formatUSDCents(d.monthlyPayment)}</td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Used car comparison */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          New vs Used Car Rates (Good Credit)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Loan Type</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'New Car', rate: ratesNew.good },
              { label: 'Used Car', rate: ratesUsed.good },
            ].map(({ label, rate }) => {
              const d = calculateLoan(amount, rate, termMonths)
              return (
                <tr key={label}>
                  <td style={tdStyle}>{label}</td>
                  <td style={tdNum}>{rate}%</td>
                  <td style={tdNum}>{formatUSDCents(d.monthlyPayment)}</td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Term comparison */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Payment by Loan Term (Good Credit, New Car)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Term</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {[36, 48, 60, 72, 84].map(term => {
              const d = calculateLoan(amount, ratesNew.good, term)
              const isCurrent = term === termMonths
              return (
                <tr key={term} style={isCurrent ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrent ? 700 : 400 }}>
                    {term} months {isCurrent && <span style={{ fontSize: 11, color: 'var(--accent)' }}>current</span>}
                  </td>
                  <td style={{ ...tdNum, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>
                    {formatUSDCents(d.monthlyPayment)}
                  </td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Auto Loan Guide', href: '/loan/auto-loan-guide', icon: '🚗' },
          { title: 'Personal Loan Calculator', href: '/loan', icon: '💰' },
          { title: 'Loan Amortization Explained', href: '/loan/loan-amortization-explained', icon: '📈' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Student Loan Page
// ————————————————————————————————————————
function StudentLoanPage({ amount }: { amount: number }) {
  const fedUndergrad = LOAN_RATES_2025.student_federal_undergrad
  const fedGrad = LOAN_RATES_2025.student_federal_grad
  const fedPlus = LOAN_RATES_2025.student_federal_plus
  const privateRates = LOAN_RATES_2025.student_private

  const primaryData = calculateLoan(amount, fedUndergrad, 120)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/loan" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Loans</Link>
        {' › '} Student Loans
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        ${amount.toLocaleString()} Student Loan: Monthly Payment &amp; Total Cost
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        At the 2025 federal undergraduate rate of {fedUndergrad}%, the standard 10-year monthly payment
        on ${amount.toLocaleString()} in student loans is{' '}
        <strong style={{ color: 'var(--text)' }}>{formatUSDCents(primaryData.monthlyPayment)}</strong>.
        Total interest paid: <strong style={{ color: 'var(--text)' }}>{formatUSD(primaryData.totalInterest)}</strong>.
      </p>

      <AdSlot slot="3004" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Federal vs Private Student Loan Rates
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Loan Type</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Rate</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly (10yr)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Federal Undergrad (Direct)', rate: fedUndergrad },
              { label: 'Federal Graduate (Direct)', rate: fedGrad },
              { label: 'Federal PLUS', rate: fedPlus },
              { label: 'Private — Excellent Credit', rate: privateRates.excellent },
              { label: 'Private — Good Credit', rate: privateRates.good },
              { label: 'Private — Fair Credit', rate: privateRates.fair },
            ].map(({ label, rate }) => {
              const d = calculateLoan(amount, rate, 120)
              const isFedUndergrad = rate === fedUndergrad
              return (
                <tr key={label} style={isFedUndergrad ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isFedUndergrad ? 700 : 400 }}>{label}</td>
                  <td style={tdNum}>{rate}%</td>
                  <td style={{ ...tdNum, fontWeight: isFedUndergrad ? 700 : 400, color: isFedUndergrad ? 'var(--accent)' : 'var(--text)' }}>
                    {formatUSDCents(d.monthlyPayment)}
                  </td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Repayment terms */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Extended Repayment Options (Federal Rate {fedUndergrad}%)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Term</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {[60, 120, 180, 240].map(term => {
              const d = calculateLoan(amount, fedUndergrad, term)
              const isCurrent = term === 120
              return (
                <tr key={term} style={isCurrent ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrent ? 700 : 400 }}>
                    {term / 12} years {isCurrent && <span style={{ fontSize: 11, color: 'var(--accent)' }}>standard</span>}
                  </td>
                  <td style={{ ...tdNum, fontWeight: isCurrent ? 700 : 400, color: isCurrent ? 'var(--accent)' : 'var(--text)' }}>
                    {formatUSDCents(d.monthlyPayment)}
                  </td>
                  <td style={tdNum}>{formatUSD(d.totalInterest)}</td>
                  <td style={tdNum}>{formatUSD(d.totalPaid)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Student Loan Guide', href: '/loan/student-loan-guide', icon: '🎓' },
          { title: 'Debt Avalanche vs Snowball', href: '/loan/debt-avalanche-vs-snowball', icon: '📊' },
          { title: 'Personal Loan Calculator', href: '/loan', icon: '💰' },
          { title: 'Salary After Tax Calculator', href: '/salary', icon: '💵' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Credit Card Payoff Page
// ————————————————————————————————————————
function CreditCardPayoffPage({ balance, apr }: { balance: number; apr: number }) {
  // Calculate for multiple monthly payment scenarios
  const minPayment = Math.max(25, balance * 0.02) // typical minimum: 2%

  const scenarios = [
    { label: 'Minimum (2%)', payment: minPayment },
    { label: `$${Math.round(balance * 0.03).toLocaleString()}/mo (3%)`, payment: balance * 0.03 },
    { label: `Pay in 3 years`, payment: calculateLoan(balance, apr, 36).monthlyPayment },
    { label: `Pay in 5 years`, payment: calculateLoan(balance, apr, 60).monthlyPayment },
  ]

  const primaryData = calculateLoan(balance, apr, 60)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/loan" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Loans</Link>
        {' › '} Credit Card Payoff
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '0.75rem' }}>
        Pay Off ${balance.toLocaleString()} Credit Card Balance at {apr}% APR
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        To pay off ${balance.toLocaleString()} in credit card debt at {apr}% APR in 5 years,
        you need to pay{' '}
        <strong style={{ color: 'var(--text)' }}>{formatUSDCents(primaryData.monthlyPayment)}/month</strong>.
        Total interest over 5 years: <strong style={{ color: '#f87171' }}>{formatUSD(primaryData.totalInterest)}</strong>.
      </p>

      <AdSlot slot="3005" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Payoff Scenarios at {apr}% APR
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Strategy</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {[36, 60, 72].map(term => {
              const d = calculateLoan(balance, apr, term)
              const isCurrent = term === 60
              return (
                <tr key={term} style={isCurrent ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrent ? 700 : 400 }}>Pay off in {term / 12} years</td>
                  <td style={{ ...tdNum, color: isCurrent ? 'var(--accent)' : 'var(--text)', fontWeight: isCurrent ? 700 : 400 }}>
                    {formatUSDCents(d.monthlyPayment)}
                  </td>
                  <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(d.totalInterest)}</td>
                  <td style={tdNum}>{formatUSD(d.totalPaid)}</td>
                </tr>
              )
            })}
            <tr>
              <td style={tdStyle}>Minimum payment (~2%/mo)</td>
              <td style={{ ...tdNum, color: '#f87171' }}>{formatUSDCents(minPayment)}</td>
              <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(balance * (apr / 100) * 15)}</td>
              <td style={tdNum}>~{(balance / minPayment / 12 * 1.8).toFixed(0)}+ years</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* APR comparison */}
      <div style={card}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
          Same Balance, Different APR (5-Year Payoff)
        </h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>APR</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly Payment</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest</th>
            </tr>
          </thead>
          <tbody>
            {[15.99, 19.99, 24.99, 29.99].map(a => {
              const d = calculateLoan(balance, a, 60)
              const isCurrent = Math.abs(a - apr) < 0.01
              return (
                <tr key={a} style={isCurrent ? { background: 'rgba(59,130,246,0.05)' } : {}}>
                  <td style={{ ...tdStyle, fontWeight: isCurrent ? 700 : 400 }}>
                    {a}% {isCurrent && <span style={{ fontSize: 11, color: 'var(--accent)' }}>current</span>}
                  </td>
                  <td style={tdNum}>{formatUSDCents(d.monthlyPayment)}</td>
                  <td style={{ ...tdNum, color: '#f87171' }}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RelatedLinks
        links={[
          { title: 'Credit Card Payoff Guide', href: '/loan/credit-card-payoff-guide', icon: '💳' },
          { title: 'Debt Avalanche vs Snowball', href: '/loan/debt-avalanche-vs-snowball', icon: '📊' },
          { title: 'Debt Consolidation Guide', href: '/loan/debt-consolidation-guide', icon: '🔄' },
          { title: 'Personal Loan (Consolidate)', href: '/loan', icon: '💰' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Guide Page
// ————————————————————————————————————————
function GuidePage({ guideSlug, guideTitle }: { guideSlug: string; guideTitle: string }) {
  const tableStyleLocal: React.CSSProperties = { ...tableStyle, marginTop: 16 }

  const guideContent: Record<string, React.ReactNode> = {
    'debt-avalanche-vs-snowball': (
      <>
        <p>The <strong>avalanche method</strong> pays the highest-rate debt first, minimizing total interest. The <strong>snowball method</strong> pays the smallest balance first for psychological momentum.</p>
        <p style={{ marginTop: 12 }}>Example: $10,000 at 24.99% + $5,000 at 15.99%:</p>
        <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: 24, marginTop: 8 }}>
          <li>Avalanche: attack the 24.99% balance first → saves more interest</li>
          <li>Snowball: clear the $5,000 first → faster early wins</li>
          <li>Both work — choose the one you&apos;ll stick with</li>
        </ul>
      </>
    ),
    'loan-amortization-explained': (
      <>
        <p>Every loan payment splits into two parts: interest (what the lender earns) and principal (what reduces your balance). Early payments are mostly interest.</p>
        <p style={{ marginTop: 12 }}>On a $20,000 loan at 14.5% for 60 months ({formatUSDCents(calculateLoan(20000, 14.5, 60).monthlyPayment)}/mo):</p>
        <table style={tableStyleLocal}>
          <thead>
            <tr>
              <th style={thStyle}>Month</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Balance Remaining</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Interest Portion</th>
            </tr>
          </thead>
          <tbody>
            {[1, 12, 24, 36, 48, 60].map(month => {
              const r = 14.5 / 100 / 12
              const n = 60
              const P = 20000
              const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
              const balance = Math.max(0, P * Math.pow(1 + r, month) - payment * (Math.pow(1 + r, month) - 1) / r)
              const prevBalance = month === 1 ? P : Math.max(0, P * Math.pow(1 + r, month - 1) - payment * (Math.pow(1 + r, month - 1) - 1) / r)
              const interest = prevBalance * r
              return (
                <tr key={month}>
                  <td style={tdStyle}>Month {month}</td>
                  <td style={tdNum}>{formatUSD(balance)}</td>
                  <td style={tdNum}>{formatUSD(interest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    ),
    'apr-vs-interest-rate-guide': (
      <>
        <p>The <strong>interest rate</strong> is the cost of borrowing the principal. The <strong>APR</strong> (Annual Percentage Rate) includes the interest rate plus fees (origination, points, etc.) — giving you the true cost of a loan.</p>
        <p style={{ marginTop: 12 }}>A personal loan advertised at 12% with a 3% origination fee has an effective APR closer to 14–15%. Always compare APRs, not just rates.</p>
      </>
    ),
    'debt-consolidation-guide': (
      <>
        <p>Debt consolidation rolls multiple debts into one loan, ideally at a lower rate. It makes sense when your new rate beats your weighted average existing rate.</p>
        <p style={{ marginTop: 12 }}>Example: $15,000 at 24.99% APR consolidated into a personal loan at 14.5% saves approximately:</p>
        <table style={tableStyleLocal}>
          <thead>
            <tr>
              <th style={thStyle}>Option</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Monthly</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Total Interest (5yr)</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: 'Credit card (24.99%)', rate: 24.99 },
              { label: 'Personal loan (14.5%)', rate: 14.5 },
              { label: 'Excellent credit (10.5%)', rate: 10.5 },
            ].map(({ label, rate }) => {
              const d = calculateLoan(15000, rate, 60)
              return (
                <tr key={label}>
                  <td style={tdStyle}>{label}</td>
                  <td style={tdNum}>{formatUSDCents(d.monthlyPayment)}</td>
                  <td style={{ ...tdNum, color: rate > 14 ? '#f87171' : '#34d399' }}>{formatUSD(d.totalInterest)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </>
    ),
  }

  const content = guideContent[guideSlug] ?? (
    <p style={{ color: 'var(--muted)' }}>Comprehensive guide content. Browse our loan calculators below for specific payment scenarios.</p>
  )

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        <Link href="/loan" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Loans</Link>
        {' › '} Guide
      </nav>
      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '1.5rem' }}>
        {guideTitle}
      </h1>

      <AdSlot slot="3006" format="leaderboard" />

      <div style={{ ...card, marginTop: '1.5rem', fontSize: 15, lineHeight: 1.7, color: 'var(--muted)' }}>
        {content}
      </div>

      <RelatedLinks
        links={[
          { title: '$15,000 Personal Loan / 60 months', href: '/loan/personal-loan-15000-60-months', icon: '💰' },
          { title: '$25,000 Auto Loan / 60 months', href: '/loan/auto-loan-25000-60-months', icon: '🚗' },
          { title: '$50,000 Student Loan', href: '/loan/student-loan-50000', icon: '🎓' },
          { title: 'Credit Card Payoff', href: '/loan/credit-card-payoff-10000-24-99', icon: '💳' },
          { title: 'Mortgage Calculator', href: '/mortgage', icon: '🏠' },
        ]}
      />
    </div>
  )
}

// ————————————————————————————————————————
// Main export
// ————————————————————————————————————————
export default async function LoanPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = parseLoanSlug(slug)
  if (!config) notFound()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: config.type === 'guide' ? config.guideTitle : 'Loan Calculator',
    url: `https://usa-calc.com/loan/${slug}`,
    description: 'Free loan calculator — monthly payments, total interest, and amortization schedule.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )

  if (config.type === 'personal') {
    return <>{jsonLd}<PersonalLoanPage amount={config.amount!} termMonths={config.termMonths!} /></>
  }
  if (config.type === 'auto') {
    return <>{jsonLd}<AutoLoanPage amount={config.amount!} termMonths={config.termMonths!} /></>
  }
  if (config.type === 'student') {
    return <>{jsonLd}<StudentLoanPage amount={config.amount!} /></>
  }
  if (config.type === 'credit-card') {
    return <>{jsonLd}<CreditCardPayoffPage balance={config.amount!} apr={config.apr!} /></>
  }
  if (config.type === 'guide') {
    return <>{jsonLd}<GuidePage guideSlug={config.guideSlug!} guideTitle={config.guideTitle!} /></>
  }

  notFound()
}
