export interface LoanPageConfig {
  type: 'personal' | 'auto' | 'student' | 'credit-card' | 'guide'
  amount?: number
  termMonths?: number
  apr?: number
  guideSlug?: string
  guideTitle?: string
}

const PERSONAL_AMOUNTS = [
  1000, 2000, 3000, 5000, 7500, 10000, 12500, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
]
const PERSONAL_TERMS = [24, 36, 48, 60, 72]

const AUTO_AMOUNTS = [
  10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 80000,
]
const AUTO_TERMS = [36, 48, 60, 72, 84]

const STUDENT_AMOUNTS = [
  10000, 20000, 30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000,
]

const CC_BALANCES = [
  1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 50000,
]
const CC_APRS = [15.99, 19.99, 24.99, 29.99]

const GUIDE_SLUGS: { slug: string; title: string }[] = [
  { slug: 'personal-loan-rates-guide', title: 'Personal Loan Rates Guide 2025' },
  { slug: 'auto-loan-guide', title: 'Auto Loan Guide: Rates, Terms & How to Save' },
  { slug: 'student-loan-guide', title: 'Student Loan Guide: Federal vs Private' },
  { slug: 'debt-consolidation-guide', title: 'Debt Consolidation: How It Works & When It Makes Sense' },
  { slug: 'credit-card-payoff-guide', title: 'Credit Card Payoff Strategies That Work' },
  { slug: 'bad-credit-loan-guide', title: 'How to Get a Loan with Bad Credit' },
  { slug: 'debt-avalanche-vs-snowball', title: 'Debt Avalanche vs Snowball: Which Pays Off Faster?' },
  { slug: 'loan-amortization-explained', title: 'Loan Amortization Explained: How Your Payments Work' },
  { slug: 'apr-vs-interest-rate-guide', title: 'APR vs Interest Rate: Key Differences' },
]

// Build all slugs
const personalSlugs: string[] = []
for (const amount of PERSONAL_AMOUNTS) {
  for (const term of PERSONAL_TERMS) {
    personalSlugs.push(`personal-loan-${amount}-${term}-months`)
  }
}

const autoSlugs: string[] = []
for (const amount of AUTO_AMOUNTS) {
  for (const term of AUTO_TERMS) {
    autoSlugs.push(`auto-loan-${amount}-${term}-months`)
  }
}

const studentSlugs: string[] = STUDENT_AMOUNTS.map(a => `student-loan-${a}`)

const creditCardSlugs: string[] = []
for (const balance of CC_BALANCES) {
  for (const apr of CC_APRS) {
    const aprStr = apr.toFixed(2).replace('.', '-')
    creditCardSlugs.push(`credit-card-payoff-${balance}-${aprStr}`)
  }
}

const guideSlugs: string[] = GUIDE_SLUGS.map(g => g.slug)

export const LOAN_PAGE_SLUGS: string[] = [
  ...personalSlugs,
  ...autoSlugs,
  ...studentSlugs,
  ...creditCardSlugs,
  ...guideSlugs,
]

export function parseLoanSlug(slug: string): LoanPageConfig | null {
  // Guide
  const guide = GUIDE_SLUGS.find(g => g.slug === slug)
  if (guide) {
    return { type: 'guide', guideSlug: guide.slug, guideTitle: guide.title }
  }

  // personal-loan-15000-60-months
  const personalMatch = slug.match(/^personal-loan-(\d+)-(\d+)-months$/)
  if (personalMatch) {
    const amount = parseInt(personalMatch[1], 10)
    const termMonths = parseInt(personalMatch[2], 10)
    if (PERSONAL_AMOUNTS.includes(amount) && PERSONAL_TERMS.includes(termMonths)) {
      return { type: 'personal', amount, termMonths }
    }
  }

  // auto-loan-25000-60-months
  const autoMatch = slug.match(/^auto-loan-(\d+)-(\d+)-months$/)
  if (autoMatch) {
    const amount = parseInt(autoMatch[1], 10)
    const termMonths = parseInt(autoMatch[2], 10)
    if (AUTO_AMOUNTS.includes(amount) && AUTO_TERMS.includes(termMonths)) {
      return { type: 'auto', amount, termMonths }
    }
  }

  // student-loan-50000
  const studentMatch = slug.match(/^student-loan-(\d+)$/)
  if (studentMatch) {
    const amount = parseInt(studentMatch[1], 10)
    if (STUDENT_AMOUNTS.includes(amount)) {
      return { type: 'student', amount }
    }
  }

  // credit-card-payoff-10000-24-99
  const ccMatch = slug.match(/^credit-card-payoff-(\d+)-(\d+)-(\d+)$/)
  if (ccMatch) {
    const balance = parseInt(ccMatch[1], 10)
    const aprWhole = parseInt(ccMatch[2], 10)
    const aprDecimal = parseInt(ccMatch[3], 10)
    const apr = parseFloat(`${aprWhole}.${aprDecimal}`)
    if (CC_BALANCES.includes(balance) && CC_APRS.some(a => Math.abs(a - apr) < 0.01)) {
      return { type: 'credit-card', amount: balance, apr }
    }
  }

  return null
}

export { PERSONAL_AMOUNTS, PERSONAL_TERMS, AUTO_AMOUNTS, AUTO_TERMS, STUDENT_AMOUNTS, CC_BALANCES, CC_APRS }
