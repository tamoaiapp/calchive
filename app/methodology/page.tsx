import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Calculation Methodology — How USA-Calc Numbers Are Built',
  description:
    'Formulas, rounding rules, data sources, and edge-case handling for every calculator on USA-Calc. Updated as rates and brackets change.',
  alternates: { canonical: '/methodology' },
}

const s: React.CSSProperties = { maxWidth: 820, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.75rem' }
const h2s: React.CSSProperties = { fontSize: '1.25rem', fontWeight: 800, marginTop: '2.5rem', marginBottom: '0.5rem' }
const h3s: React.CSSProperties = { fontSize: '1rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.3rem', color: 'var(--accent)' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1rem' }
const code: React.CSSProperties = {
  background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 8,
  padding: '0.75rem 1rem', fontFamily: 'ui-monospace, SFMono-Regular, monospace',
  fontSize: '0.85rem', color: 'var(--text)', overflowX: 'auto', margin: '0.5rem 0 1rem',
  whiteSpace: 'pre' as const,
}

export default function MethodologyPage() {
  return (
    <div style={s}>
      <h1 style={h1s}>Calculation Methodology</h1>
      <p style={ps}>
        This page documents the formulas, data sources, rounding conventions, and edge-case rules behind every
        calculator on USA-Calc. We publish it because the math behind a financial decision should never be a
        black box — and because the difference between a "good enough" calculator and an accurate one is
        usually about three lines of unglamorous code.
      </p>

      <h2 style={h2s}>Federal Income Tax</h2>
      <p style={ps}>
        Federal tax is computed using the marginal bracket method published in IRS Revenue Procedure 2024-40 (for
        tax year 2025). Income is reduced by the standard deduction for the chosen filing status before brackets
        are applied. We do not assume itemized deductions, foreign earned income exclusion, or alternative
        minimum tax — these require user input we do not collect.
      </p>
      <pre style={code}>{`taxable_income = max(0, gross_income - standard_deduction[filing_status])
federal_tax = sum over brackets:
  bracket_income × bracket_rate
where bracket_income = min(taxable_income, bracket_top) - bracket_bottom`}</pre>

      <h2 style={h2s}>FICA (Social Security + Medicare)</h2>
      <p style={ps}>
        Social Security tax is 6.2% on wages up to the annual cap ($176,100 in 2025). Medicare tax is 1.45%
        with no cap, plus an Additional Medicare Tax of 0.9% on wages above $200,000 (single) or $250,000
        (married filing jointly). We apply both employee-side rates only — employer match is excluded from
        take-home calculations because it never reaches the employee.
      </p>

      <h2 style={h2s}>State Income Tax</h2>
      <p style={ps}>
        State tax uses the official tax tables from each state's department of revenue for the current tax year.
        Nine states have no broad-based income tax (Alaska, Florida, Nevada, New Hampshire, South Dakota,
        Tennessee, Texas, Washington, Wyoming) and return $0 in state tax. Flat-rate states (Colorado, Illinois,
        Michigan, Indiana, etc.) apply a single rate. Progressive states use marginal bracket calculations
        identical to the federal method.
      </p>
      <p style={ps}>
        Local taxes (NYC residency tax, Yonkers tax, Pennsylvania local income tax, Ohio municipal taxes) are
        not included. These vary by exact address and are user-specific.
      </p>

      <h2 style={h2s}>Loan & Refinance Calculations</h2>
      <p style={ps}>
        Monthly payments on amortizing loans use the standard formula:
      </p>
      <pre style={code}>{`monthly_payment = P × r / (1 - (1 + r)^-n)

P = principal
r = monthly interest rate = APR / 12
n = total number of monthly payments`}</pre>
      <p style={ps}>
        Total interest paid is monthly_payment × n − P. Refinance savings = (original total interest) − (new
        total interest). We do not adjust for closing costs, points, or origination fees on refinance comparisons
        unless explicitly added as inputs — most modern student loan refis charge $0.
      </p>

      <h2 style={h2s}>Mortgage Calculations</h2>
      <p style={ps}>
        Mortgage payments include four components (PITI): principal, interest, property tax, and homeowners
        insurance. PMI is added when the down payment is below 20% and removed automatically once amortization
        crosses the 20% equity threshold. Property tax defaults to each state's median effective rate per
        Census Bureau data; insurance defaults to $1,800/year unless overridden.
      </p>

      <h2 style={h2s}>Credit Score Pages</h2>
      <p style={ps}>
        Credit-score range categorization follows the official FICO Score classification: 300–579 Poor, 580–669
        Fair, 670–739 Good, 740–799 Very Good, 800–850 Exceptional. Lender-approval probability tables on each
        score page reference Experian's 2024–2025 consumer-credit data and are not specific to any single
        lender — actual approval depends on the full underwriting profile.
      </p>

      <h2 style={h2s}>Per Diem</h2>
      <p style={ps}>
        Per diem calculations apply GSA-published lodging and M&IE rates by destination. Our simplified formula
        treats every travel day as a full day; for IRS-exact substantiation, manually reduce the first and last
        days of travel to 75% of the daily M&IE rate.
      </p>

      <h2 style={h2s}>LTV / CAC / ROAS (Business Metrics)</h2>
      <p style={ps}>
        Lifetime value uses the steady-state SaaS formula:
      </p>
      <pre style={code}>{`LTV = ARPU × gross_margin / churn_rate

ARPU = average revenue per user (annualized)
churn_rate = annual customer churn (monthly × 12 if monthly churn given)`}</pre>
      <p style={ps}>
        This is the standard textbook formula; it assumes constant ARPU and churn, ignores expansion revenue
        (NRR &gt; 100%), and produces a conservative estimate. Real LTV for SaaS with expansion can exceed this
        formula by 2–4x.
      </p>

      <h2 style={h2s}>Rounding & Display</h2>
      <p style={ps}>
        Internal calculations are full-precision IEEE 754 double. Display values are rounded only at the final
        step, using banker's rounding (round-half-to-even) for currency to match IRS publication conventions.
        Percentages display to two decimal places; dollar values display to whole dollars on amounts above
        $1,000 and to cents below.
      </p>

      <h2 style={h2s}>Update Cadence</h2>
      <p style={ps}>
        Federal tax brackets and standard deductions update annually within 48 hours of IRS release (usually
        late October for the following tax year). State rates update on a rolling basis as each state's revenue
        department publishes for the new year. Mortgage rate assumptions refresh weekly from Freddie Mac PMMS.
        BLS salary medians refresh annually after the May OEWS data release.
      </p>

      <h2 style={h2s}>What This Page Does Not Cover</h2>
      <p style={ps}>
        Edge cases requiring professional judgment: AMT, NIIT, foreign tax credit, qualified business income
        deduction interactions, multi-state apportionment, and state-specific retirement income exclusions.
        For these, consult a CPA or Enrolled Agent. Read about <Link href="/about" style={{ color: 'var(--accent)' }}>our editorial team</Link>.
      </p>
    </div>
  )
}
