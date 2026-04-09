import { getScoreCategory, getScoreLabel, getScoreColor } from './data'

// ─── Credit score pages: 500–850 in 10-point steps ───────────────────────────
function generateCreditScoreSlugs(): string[] {
  const slugs: string[] = []
  for (let s = 500; s <= 850; s += 10) {
    slugs.push(`credit-score-${s}`)
  }
  return slugs
}

const IMPROVE_POINTS = ['10', '25', '50', '100']
const IMPROVE_SLUGS = IMPROVE_POINTS.map(p => `how-to-improve-credit-score-by-${p}-points`)

// ─── Credit card interest pages: APR × balance combinations ──────────────────
const CC_APRS = [15.99, 19.99, 22.99, 24.99, 29.99]
const CC_BALANCES = [1000, 2000, 5000, 10000]

function generateCCInterestSlugs(): string[] {
  const slugs: string[] = []
  for (const apr of CC_APRS) {
    const aprStr = apr.toFixed(2).replace('.', '-')
    for (const bal of CC_BALANCES) {
      slugs.push(`credit-card-interest-${aprStr}-${bal}`)
    }
  }
  return slugs
}

const CC_GUIDE_SLUGS = [
  'best-credit-cards-for-beginners',
  'how-to-get-approved-for-credit-card',
  'credit-card-balance-transfer-guide',
  'credit-card-rewards-guide',
  'secured-credit-cards-guide',
  'business-credit-cards-guide',
  'credit-card-churning-guide',
  'how-to-dispute-credit-card-charges',
]

// ─── Debt payoff pages: balance × months ─────────────────────────────────────
const DEBT_BALANCES = [5000, 10000, 15000, 20000, 30000, 50000]
const DEBT_MONTHS = [12, 24, 36, 48, 60]

function generateDebtPayoffSlugs(): string[] {
  const slugs: string[] = []
  for (const bal of DEBT_BALANCES) {
    for (const mo of DEBT_MONTHS) {
      slugs.push(`debt-payoff-${bal}-${mo}-months`)
    }
  }
  return slugs
}

const DEBT_GUIDE_SLUGS = [
  'debt-consolidation-guide',
  'bankruptcy-guide-chapter-7',
  'bankruptcy-guide-chapter-13',
  'debt-settlement-guide',
  'debt-collection-rights-guide',
  'how-to-handle-debt-collectors',
  'medical-debt-guide',
  'student-loan-debt-guide',
]

export const CREDIT_PAGE_SLUGS: string[] = [
  ...generateCreditScoreSlugs(),
  ...IMPROVE_SLUGS,
  ...generateCCInterestSlugs(),
  ...CC_GUIDE_SLUGS,
  ...generateDebtPayoffSlugs(),
  ...DEBT_GUIDE_SLUGS,
]

// ─── Config types ─────────────────────────────────────────────────────────────
export type CreditPageType =
  | 'credit-score'
  | 'improve-score'
  | 'cc-interest'
  | 'cc-guide'
  | 'debt-payoff'
  | 'debt-guide'

export interface CreditPageConfig {
  type: CreditPageType
  slug: string
  score?: number
  scoreLabel?: string
  scoreColor?: string
  scoreCategory?: string
  improvePoints?: number
  apr?: number
  balance?: number
  months?: number
  debtBalance?: number
  debtMonths?: number
}

export function parseCreditSlug(slug: string): CreditPageConfig | null {
  // credit-score-[score]
  const scoreMatch = slug.match(/^credit-score-(\d+)$/)
  if (scoreMatch) {
    const score = parseInt(scoreMatch[1])
    if (score >= 300 && score <= 850) {
      return {
        type: 'credit-score',
        slug,
        score,
        scoreLabel: getScoreLabel(score),
        scoreColor: getScoreColor(score),
        scoreCategory: getScoreCategory(score),
      }
    }
  }

  // how-to-improve-credit-score-by-[points]-points
  const improveMatch = slug.match(/^how-to-improve-credit-score-by-(\d+)-points$/)
  if (improveMatch) {
    return { type: 'improve-score', slug, improvePoints: parseInt(improveMatch[1]) }
  }

  // credit-card-interest-[apr]-[balance]
  // apr stored as 15-99 → 15.99
  const ccMatch = slug.match(/^credit-card-interest-(\d+)-(\d+)-(\d+)$/)
  if (ccMatch) {
    const apr = parseFloat(`${ccMatch[1]}.${ccMatch[2]}`)
    const balance = parseInt(ccMatch[3])
    if (CC_APRS.includes(apr) && CC_BALANCES.includes(balance)) {
      return { type: 'cc-interest', slug, apr, balance }
    }
  }

  if (CC_GUIDE_SLUGS.includes(slug)) {
    return { type: 'cc-guide', slug }
  }

  // debt-payoff-[balance]-[months]-months
  const debtMatch = slug.match(/^debt-payoff-(\d+)-(\d+)-months$/)
  if (debtMatch) {
    const bal = parseInt(debtMatch[1])
    const mo = parseInt(debtMatch[2])
    if (DEBT_BALANCES.includes(bal) && DEBT_MONTHS.includes(mo)) {
      return { type: 'debt-payoff', slug, debtBalance: bal, debtMonths: mo }
    }
  }

  if (DEBT_GUIDE_SLUGS.includes(slug)) {
    return { type: 'debt-guide', slug }
  }

  return null
}
