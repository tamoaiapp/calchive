// Tax section pages manifest — defines all ~1,500 slugs

// ─── Income Amounts ───────────────────────────────────────────────────────────

const FEDERAL_AMOUNTS = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
  75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000,
  150000, 175000, 200000, 250000, 300000, 400000, 500000, 750000, 1000000, 1500000,
]

const FEDERAL_FILINGS = ['single', 'married-jointly', 'married-separately', 'head-of-household']

const CAPITAL_GAINS_AMOUNTS = [
  5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000, 500000, 750000, 1000000, 1500000, 2000000, 5000000,
]

const CAPITAL_GAINS_HOLDINGS = ['long-term', 'short-term']

const SE_AMOUNTS = [
  10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000,
  90000, 100000, 120000, 150000, 200000, 250000, 300000, 400000, 500000, 750000,
]

const STATE_SLUGS = [
  'california', 'new-york', 'texas', 'florida', 'new-jersey',
  'illinois', 'pennsylvania', 'ohio', 'washington', 'arizona',
  'massachusetts', 'virginia', 'north-carolina', 'georgia', 'michigan',
]

const STATE_AMOUNTS = [
  50000, 60000, 75000, 100000, 125000, 150000, 200000, 250000, 300000, 500000,
]

const GUIDE_SLUGS = [
  'tax-brackets-2025',
  'standard-deduction-2025',
  'capital-gains-rates-2025',
  'fica-tax-2025',
  'self-employment-tax-guide',
  'tax-filing-deadlines-2025',
  'w2-vs-1099-guide',
  'quarterly-estimated-taxes-guide',
  'tax-deductions-guide',
  'tax-credits-guide',
  'backdoor-roth-guide',
  '401k-tax-benefits-guide',
  'hsa-tax-benefits-guide',
  'llc-tax-guide',
  's-corp-vs-llc-taxes',
]

// ─── Generate all slugs ───────────────────────────────────────────────────────

function generateFederalSlugs(): string[] {
  const slugs: string[] = []
  for (const amount of FEDERAL_AMOUNTS) {
    for (const filing of FEDERAL_FILINGS) {
      slugs.push(`federal-tax-${amount}-${filing}`)
    }
  }
  return slugs
}

function generateCapGainsSlugs(): string[] {
  const slugs: string[] = []
  for (const amount of CAPITAL_GAINS_AMOUNTS) {
    for (const holding of CAPITAL_GAINS_HOLDINGS) {
      slugs.push(`capital-gains-tax-${amount}-${holding}`)
    }
  }
  return slugs
}

function generateSESlugs(): string[] {
  return SE_AMOUNTS.map(a => `self-employment-tax-${a}`)
}

function generateStateSlugs(): string[] {
  const slugs: string[] = []
  for (const state of STATE_SLUGS) {
    for (const amount of STATE_AMOUNTS) {
      slugs.push(`${state}-income-tax-${amount}`)
    }
  }
  return slugs
}

export const TAX_PAGE_SLUGS: string[] = [
  ...generateFederalSlugs(),   // 120 pages
  ...generateCapGainsSlugs(),  // 40 pages
  ...generateSESlugs(),        // 20 pages
  ...generateStateSlugs(),     // 150 pages
  ...GUIDE_SLUGS,              // 15 pages
]

// ─── Slug parser ──────────────────────────────────────────────────────────────

export type TaxPageType = 'federal' | 'capital-gains' | 'self-employment' | 'state' | 'guide'

export interface TaxPageConfig {
  type: TaxPageType
  // federal
  amount?: number
  filing?: string
  // capital gains
  holdingPeriod?: string
  // state
  stateSlug?: string
  // guide
  topic?: string
}

export function parseTaxSlug(slug: string): TaxPageConfig | null {
  // Federal income tax: federal-tax-{amount}-{filing}
  const federalMatch = slug.match(/^federal-tax-(\d+)-(.+)$/)
  if (federalMatch) {
    const amount = parseInt(federalMatch[1], 10)
    const filing = federalMatch[2]
    if (!isNaN(amount) && FEDERAL_FILINGS.includes(filing)) {
      return { type: 'federal', amount, filing }
    }
  }

  // Capital gains: capital-gains-tax-{amount}-{holding}
  const cgMatch = slug.match(/^capital-gains-tax-(\d+)-(long-term|short-term)$/)
  if (cgMatch) {
    const amount = parseInt(cgMatch[1], 10)
    if (!isNaN(amount)) {
      return { type: 'capital-gains', amount, holdingPeriod: cgMatch[2] }
    }
  }

  // Self-employment: self-employment-tax-{amount}
  const seMatch = slug.match(/^self-employment-tax-(\d+)$/)
  if (seMatch) {
    const amount = parseInt(seMatch[1], 10)
    if (!isNaN(amount)) {
      return { type: 'self-employment', amount }
    }
  }

  // State income tax: {state}-income-tax-{amount}
  const stateMatch = slug.match(/^(.+)-income-tax-(\d+)$/)
  if (stateMatch) {
    const amount = parseInt(stateMatch[2], 10)
    const stateSlug = stateMatch[1]
    if (!isNaN(amount) && stateSlug.length > 0) {
      return { type: 'state', stateSlug, amount }
    }
  }

  // Guide pages
  if (GUIDE_SLUGS.includes(slug)) {
    return { type: 'guide', topic: slug }
  }

  return null
}
