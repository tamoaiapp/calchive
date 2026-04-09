import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { CREDIT_PAGE_SLUGS, parseCreditSlug } from '@/lib/credit/pages-manifest'
import { CREDIT_SCORE_RANGES, CC_RATES_BY_SCORE, AUTO_LOAN_RATES_BY_SCORE, MORTGAGE_RATE_ADJUSTMENT_BPS } from '@/lib/credit/data'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return CREDIT_PAGE_SLUGS.slice(0, 80).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cfg = parseCreditSlug(slug)
  if (!cfg) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  switch (cfg.type) {
    case 'credit-score':
      title = `Credit Score ${cfg.score}: ${cfg.scoreLabel} — What You Qualify For`
      description = `A ${cfg.score} FICO score is ${cfg.scoreLabel}. See what mortgage rates, car loans, and credit cards you qualify for — plus how long to reach the next tier.`
      break
    case 'improve-score':
      title = `How to Improve Your Credit Score by ${cfg.improvePoints} Points`
      description = `Adding ${cfg.improvePoints} points to your credit score can unlock better rates and new products. Here's what moves the needle fastest.`
      break
    case 'cc-interest':
      title = `Credit Card Interest: $${cfg.balance?.toLocaleString()} Balance at ${cfg.apr}% APR`
      description = `Carrying $${cfg.balance?.toLocaleString()} at ${cfg.apr}% APR costs $${Math.round((cfg.balance! * cfg.apr!) / 100 / 12).toLocaleString()}/month in interest alone. See minimum payment, payoff timeline, and true total cost.`
      break
    case 'debt-payoff':
      title = `Pay Off $${cfg.debtBalance?.toLocaleString()} in ${cfg.debtMonths} Months: Payment Plan`
      description = `Paying off $${cfg.debtBalance?.toLocaleString()} in ${cfg.debtMonths} months requires specific monthly payments depending on interest rate. See exact breakdown and strategies.`
      break
    default:
      title = `${slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Calchive`
      description = `Complete guide to ${slug.replace(/-/g, ' ')} — facts, strategies, and tools for ${new Date().getFullYear()}.`
  }

  return {
    title: `${title} | Calchive`,
    description,
    alternates: { canonical: `/credit/${slug}` },
    openGraph: { title, description, type: 'article' },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sh: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 800,
  margin: '2rem 0 0.75rem',
  color: 'var(--text)',
}

const statCard: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.5rem',
  marginBottom: '1.5rem',
}

// ─── Credit Score Page ────────────────────────────────────────────────────────
function CreditScorePage({ score, scoreLabel, scoreColor, scoreCategory }: {
  score: number; scoreLabel: string; scoreColor: string; scoreCategory: string
}) {
  const ccRate = CC_RATES_BY_SCORE[scoreCategory]
  const autoRates = AUTO_LOAN_RATES_BY_SCORE[scoreCategory]

  // Find which mortgage rate tier applies
  const mortgageTierKey = (() => {
    if (score >= 760) return '760-850'
    if (score >= 740) return '740-759'
    if (score >= 720) return '720-739'
    if (score >= 700) return '700-719'
    if (score >= 680) return '680-699'
    if (score >= 660) return '660-679'
    if (score >= 640) return '640-659'
    if (score >= 620) return '620-639'
    return '580-619'
  })()
  const mortgageBps = MORTGAGE_RATE_ADJUSTMENT_BPS[mortgageTierKey]
  const baseMortgageRate = 6.8 // 2025 30-year fixed
  const adjustedRate = (baseMortgageRate + mortgageBps / 100).toFixed(2)

  // Monthly payment difference vs best rate on $300k mortgage
  const calcMonthlyPayment = (rate: number, principal: number, years: number): number => {
    const r = rate / 100 / 12
    const n = years * 12
    return Math.round((principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
  }
  const bestPayment = calcMonthlyPayment(baseMortgageRate, 300000, 30)
  const thisPayment = calcMonthlyPayment(parseFloat(adjustedRate), 300000, 30)
  const extraMonthly = thisPayment - bestPayment

  const range = CREDIT_SCORE_RANGES.find(r => score >= r.min && score <= r.max)
  const nextTier = CREDIT_SCORE_RANGES.find(r => r.min > (range?.max ?? 850))

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{
            fontSize: 48, fontWeight: 900, color: scoreColor,
          }}>{score}</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: scoreColor }}>{scoreLabel}</div>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>
              {range?.min}–{range?.max} range
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Avg CC APR</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{ccRate}%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Auto Loan (new)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{autoRates.new}%</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Mortgage Rate Est.</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)' }}>{adjustedRate}%</div>
          </div>
          {extraMonthly > 0 && (
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Extra/mo vs 760+ score</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#f87171' }}>+${extraMonthly}</div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>on $300k mortgage</div>
            </div>
          )}
        </div>
      </div>

      <h2 style={sh}>What a {score} Score Means for Your Finances</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        {range?.description}. At {score}, you{scoreCategory === 'exceptional' || scoreCategory === 'very_good'
          ? '\'ll qualify for the best rates on mortgages, auto loans, and credit cards'
          : scoreCategory === 'good'
            ? '\'ll qualify for most loans but won\'t receive the best available rates'
            : scoreCategory === 'fair'
              ? ' face limited options and significantly higher interest rates than prime borrowers'
              : '\'ll find most mainstream credit products unavailable; secured cards and credit-builder loans are the path forward'
        }.
      </p>

      {nextTier && (
        <>
          <h2 style={sh}>How to Reach {nextTier.label} ({nextTier.min}+)</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            You need {nextTier.min - score} more points to enter the {nextTier.label} tier. The fastest levers:
            paying down credit card balances (utilization), making 100% on-time payments for 6+ months, and
            disputing any errors on your credit report. Realistic timeline: 3–12 months depending on starting point.
          </p>
        </>
      )}

      <h2 style={sh}>Browse Other Credit Scores</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[580, 600, 620, 640, 660, 680, 700, 720, 740, 760, 780, 800, 820, 840].map(s => (
          <Link
            key={s}
            href={`/credit/credit-score-${s}`}
            style={{
              padding: '8px 14px',
              background: s === score ? 'rgba(59,130,246,0.15)' : 'var(--card)',
              border: `1px solid ${s === score ? 'rgba(59,130,246,0.4)' : 'var(--line)'}`,
              borderRadius: 20,
              fontSize: 14,
              fontWeight: s === score ? 700 : 500,
              color: s === score ? 'var(--accent)' : 'var(--muted)',
              textDecoration: 'none',
            }}
          >
            {s}
          </Link>
        ))}
      </div>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Mortgage Calculator', href: '/mortgage/texas-300000', icon: '🏠' },
          { title: 'Loan Calculator', href: '/calculator/loan-calculator', icon: '🏦' },
          { title: 'Debt Payoff Calculator', href: '/calculator/debt-payoff-calculator', icon: '💳' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
        ]}
      />
    </>
  )
}

// ─── CC Interest Page ─────────────────────────────────────────────────────────
function CCInterestPage({ apr, balance }: { apr: number; balance: number }) {
  const monthlyInterest = (balance * apr) / 100 / 12
  const minPayment = Math.max(balance * 0.02, 25)
  const monthsMinOnly = Math.ceil(Math.log(minPayment / (minPayment - balance * apr / 100 / 12)) / Math.log(1 + apr / 100 / 12))
  const totalMinOnly = minPayment * monthsMinOnly
  const totalInterestMinOnly = totalMinOnly - balance

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Balance</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>${balance.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>APR</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f87171' }}>{apr}%</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Monthly Interest</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f87171' }}>${Math.round(monthlyInterest)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Total Interest (min pmts)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f87171' }}>${Math.round(totalInterestMinOnly).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <h2 style={sh}>The True Cost of Carrying This Balance</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        At ${balance.toLocaleString()} and {apr}% APR, you&apos;re paying ${Math.round(monthlyInterest).toLocaleString()} in interest
        every month — money that reduces your principal by exactly $0. Paying only the minimum payment of
        approximately ${Math.round(minPayment).toLocaleString()}/month means this debt takes
        {monthsMinOnly > 600 ? ' decades' : ` ${Math.floor(monthsMinOnly / 12)} years`} to pay off,
        costing ${Math.round(totalInterestMinOnly).toLocaleString()} in interest total.
      </p>

      <h2 style={sh}>Payoff Scenarios</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {[12, 24, 36, 48, 60].map(months => {
          const r = apr / 100 / 12
          const pmt = Math.round((balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
          const total = pmt * months
          const interest = total - balance
          return (
            <div key={months} style={statCard}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Pay off in {months} months</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>${pmt}/mo</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                Total interest: ${interest.toLocaleString()}
              </div>
            </div>
          )
        })}
      </div>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Debt Payoff Calculator', href: '/calculator/debt-payoff-calculator', icon: '💳' },
          { title: 'Credit Score 700', href: '/credit/credit-score-700', icon: '📊' },
          { title: 'Debt Consolidation Guide', href: '/credit/debt-consolidation-guide', icon: '🏦' },
        ]}
      />
    </>
  )
}

// ─── Debt Payoff Page ─────────────────────────────────────────────────────────
function DebtPayoffPage({ balance, months }: { balance: number; months: number }) {
  const rates = [0, 6, 12, 18, 24, 29.99]

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Debt Balance</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }}>${balance.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Payoff Target</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }}>{months} months</div>
          </div>
        </div>
      </div>

      <h2 style={sh}>Required Monthly Payment by Interest Rate</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {rates.map(rate => {
          let pmt: number
          let totalInterest: number
          if (rate === 0) {
            pmt = Math.round(balance / months)
            totalInterest = 0
          } else {
            const r = rate / 100 / 12
            pmt = Math.round((balance * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1))
            totalInterest = pmt * months - balance
          }
          return (
            <div key={rate} style={statCard}>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{rate === 0 ? '0% (no interest)' : `${rate}% APR`}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', marginTop: 4 }}>${pmt.toLocaleString()}/mo</div>
              {totalInterest > 0 && (
                <div style={{ fontSize: 12, color: '#f87171' }}>
                  +${totalInterest.toLocaleString()} interest
                </div>
              )}
            </div>
          )
        })}
      </div>

      <h2 style={sh}>Debt Payoff Strategies</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        <strong style={{ color: 'var(--text)' }}>Avalanche method</strong>: pay minimums on all debts, throw extra money
        at the highest-rate debt first. Mathematically optimal — saves the most interest. <strong style={{ color: 'var(--text)' }}>Snowball method</strong>:
        pay off smallest balances first for psychological wins. Research shows snowball leads to better follow-through
        for most people despite costing slightly more in interest.
      </p>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Debt Payoff Calculator', href: '/calculator/debt-payoff-calculator', icon: '💳' },
          { title: 'Debt Consolidation Guide', href: '/credit/debt-consolidation-guide', icon: '🏦' },
          { title: 'Credit Score 700', href: '/credit/credit-score-700', icon: '📊' },
        ]}
      />
    </>
  )
}

// ─── Guide Page ───────────────────────────────────────────────────────────────
function CreditGuidePage({ slug }: { slug: string }) {
  const titleMap: Record<string, string> = {
    'debt-consolidation-guide': 'Debt Consolidation: When It Helps and When It Hurts',
    'bankruptcy-guide-chapter-7': 'Chapter 7 Bankruptcy: Complete 2025 Guide',
    'bankruptcy-guide-chapter-13': 'Chapter 13 Bankruptcy: Reorganization vs Liquidation',
    'debt-settlement-guide': 'Debt Settlement: The Hidden Costs Explained',
    'debt-collection-rights-guide': 'Debt Collector Rights: What They Can and Cannot Do',
    'how-to-handle-debt-collectors': 'How to Handle Debt Collectors: FDCPA Rights',
    'medical-debt-guide': 'Medical Debt: Negotiation, Forgiveness, and Credit Impact',
    'student-loan-debt-guide': 'Student Loan Debt: Repayment, Forgiveness, and Refinancing',
    'best-credit-cards-for-beginners': 'Best Credit Cards for Beginners (2025)',
    'how-to-get-approved-for-credit-card': 'How to Get Approved for a Credit Card',
    'credit-card-balance-transfer-guide': 'Balance Transfer Cards: How 0% APR Offers Work',
    'credit-card-rewards-guide': 'Credit Card Rewards: Points, Miles, and Cash Back Explained',
    'secured-credit-cards-guide': 'Secured Credit Cards: Building Credit from Scratch',
    'business-credit-cards-guide': 'Business Credit Cards: Separating Business and Personal',
    'credit-card-churning-guide': 'Credit Card Churning: Risks and Rewards',
    'how-to-dispute-credit-card-charges': 'How to Dispute a Credit Card Charge (Chargeback Guide)',
  }
  const title = titleMap[slug] ?? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const bodyMap: Record<string, string> = {
    'debt-consolidation-guide': 'Debt consolidation combines multiple debts into one loan, ideally at a lower interest rate. It works best when you have good enough credit (670+) to qualify for a personal loan below your current average rate. Common methods: personal loans (8–22% APR, 2–7 year term), balance transfer cards (0% intro APR, 3% transfer fee), home equity loans (6–9% APR, but your home is collateral), and debt management plans through nonprofit credit counselors. Consolidation does not reduce what you owe — it restructures it. If the behavior that created the debt doesn\'t change, consolidated debt often gets supplemented by new balances.',
    'bankruptcy-guide-chapter-7': 'Chapter 7 bankruptcy liquidates non-exempt assets to pay creditors and discharges remaining unsecured debt in 3–6 months. The means test requires your income to be below your state\'s median (or pass a formula test). Exempt property varies by state — most states protect your home (up to limits), car (up to $4,000), retirement accounts, and basic household items. The bankruptcy stays on your credit report for 10 years, but many people see credit scores improve within 12–18 months as the debt burden is gone. Filing fee: $338. You can refile Chapter 7 after 8 years.',
    'credit-card-balance-transfer-guide': 'Balance transfer cards offer 0% APR for 12–21 months, letting you attack debt without interest accruing. The transfer fee is typically 3–5% of the balance transferred ($30–$50 per $1,000). Example: transfer $8,000 at 3% fee = $240 cost, but saves $1,400 in interest at 21% APR over 18 months. Requirements: good credit (670+), enough credit limit, and a plan to pay it off before the promo period ends. After the promo period, the rate jumps to 19–29% — often higher than where you started.',
    'medical-debt-guide': 'Medical debt has unique properties: hospitals are required to have financial assistance programs (charity care) for low-income patients — ask for the application before paying anything. Medical billing is notoriously error-prone; 80% of bills contain errors according to the Medical Billing Advocates of America. Always request an itemized bill and dispute charges you don\'t recognize. As of 2025, medical debt under $500 no longer appears on credit reports (CFPB rule), and the major bureaus removed medical debt under $500 in 2023. Negotiate: hospitals routinely accept 40–60% of billed charges for self-pay patients.',
  }
  const defaultBody = `Understanding ${title.toLowerCase()} is essential before making major financial decisions. The facts and strategies in this guide apply specifically to 2025 US financial regulations and market conditions.`

  return (
    <>
      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {bodyMap[slug] ?? defaultBody}
      </p>
      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Debt Payoff Calculator', href: '/calculator/debt-payoff-calculator', icon: '💳' },
          { title: 'Credit Score 700', href: '/credit/credit-score-700', icon: '📊' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
        ]}
      />
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default async function CreditSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cfg = parseCreditSlug(slug)
  if (!cfg) notFound()

  const getTitle = (): string => {
    switch (cfg.type) {
      case 'credit-score':
        return `Credit Score ${cfg.score}: ${cfg.scoreLabel} — What You Qualify For`
      case 'improve-score':
        return `How to Improve Your Credit Score by ${cfg.improvePoints} Points`
      case 'cc-interest':
        return `Credit Card Interest: $${cfg.balance?.toLocaleString()} at ${cfg.apr}% APR`
      case 'debt-payoff':
        return `Payoff Plan: $${cfg.debtBalance?.toLocaleString()} in ${cfg.debtMonths} Months`
      default: {
        const titleMap: Record<string, string> = {
          'debt-consolidation-guide': 'Debt Consolidation Guide 2025',
          'bankruptcy-guide-chapter-7': 'Chapter 7 Bankruptcy Guide 2025',
          'student-loan-debt-guide': 'Student Loan Debt: Repayment & Forgiveness',
        }
        return titleMap[slug] ?? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/credit" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Credit
        </Link>
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.2 }}>
        {getTitle()}
      </h1>

      <AdSlot slot="3344556677" format="leaderboard" />

      {cfg.type === 'credit-score' && (
        <CreditScorePage
          score={cfg.score!}
          scoreLabel={cfg.scoreLabel!}
          scoreColor={cfg.scoreColor!}
          scoreCategory={cfg.scoreCategory!}
        />
      )}
      {cfg.type === 'cc-interest' && <CCInterestPage apr={cfg.apr!} balance={cfg.balance!} />}
      {cfg.type === 'debt-payoff' && <DebtPayoffPage balance={cfg.debtBalance!} months={cfg.debtMonths!} />}
      {(cfg.type === 'improve-score' || cfg.type === 'cc-guide' || cfg.type === 'debt-guide') && (
        <CreditGuidePage slug={slug} />
      )}

      <AdSlot slot="4455667788" format="rectangle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: `https://calchive.com/credit/${slug}`,
            name: getTitle(),
            description: 'Credit score information, interest calculators, and debt payoff guides.',
            isPartOf: { '@type': 'WebSite', name: 'Calchive', url: 'https://calchive.com' },
          }),
        }}
      />
    </div>
  )
}
