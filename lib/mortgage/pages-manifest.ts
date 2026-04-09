import { STATES_ALL } from '@/lib/salary/states'

export interface MortgagePageConfig {
  type: 'state-price' | 'rate-scenario' | 'refinance' | 'guide'
  // state-price
  stateSlug?: string
  stateName?: string
  homePrice?: number
  // rate-scenario
  rate?: number
  // refinance
  currentRate?: number
  newRate?: number
  balance?: number
  // guide
  guideSlug?: string
  guideTitle?: string
}

const HOME_PRICES = [
  150000, 175000, 200000, 225000, 250000, 275000, 300000, 325000, 350000,
  375000, 400000, 425000, 450000, 475000, 500000, 550000, 600000, 650000,
  700000, 750000, 800000, 900000, 1000000, 1200000, 1500000,
]

const RATE_SCENARIO_RATES = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0]
const RATE_SCENARIO_PRICES = [200000, 300000, 400000, 500000]

const REFINANCE_SCENARIOS: { currentRate: number; newRate: number; balance: number }[] = [
  { currentRate: 7.5, newRate: 6.5, balance: 300000 },
  { currentRate: 7.5, newRate: 6.0, balance: 300000 },
  { currentRate: 7.0, newRate: 6.0, balance: 250000 },
  { currentRate: 7.0, newRate: 5.5, balance: 250000 },
  { currentRate: 8.0, newRate: 6.5, balance: 400000 },
  { currentRate: 8.0, newRate: 6.0, balance: 400000 },
  { currentRate: 7.5, newRate: 6.5, balance: 500000 },
  { currentRate: 7.0, newRate: 6.5, balance: 350000 },
  { currentRate: 6.5, newRate: 5.5, balance: 300000 },
  { currentRate: 7.5, newRate: 6.0, balance: 450000 },
  { currentRate: 8.0, newRate: 7.0, balance: 200000 },
  { currentRate: 7.0, newRate: 6.0, balance: 600000 },
  { currentRate: 7.5, newRate: 5.5, balance: 350000 },
  { currentRate: 6.5, newRate: 6.0, balance: 400000 },
  { currentRate: 8.0, newRate: 6.5, balance: 250000 },
  { currentRate: 7.0, newRate: 5.5, balance: 500000 },
  { currentRate: 6.5, newRate: 5.5, balance: 450000 },
  { currentRate: 8.0, newRate: 7.0, balance: 350000 },
  { currentRate: 7.5, newRate: 7.0, balance: 300000 },
  { currentRate: 8.0, newRate: 5.5, balance: 400000 },
]

const GUIDE_SLUGS: { slug: string; title: string }[] = [
  { slug: 'how-much-house-can-i-afford', title: 'How Much House Can I Afford?' },
  { slug: 'mortgage-points-explained', title: 'Mortgage Points Explained' },
  { slug: 'pmi-explained', title: 'What Is PMI and When Can You Remove It?' },
  { slug: 'fha-vs-conventional', title: 'FHA vs Conventional Loans: Full Comparison' },
  { slug: 'va-loan-guide', title: 'VA Loan Guide: Benefits, Eligibility & Rates' },
  { slug: 'arm-vs-fixed-rate', title: 'ARM vs Fixed-Rate Mortgage: Which Is Better?' },
  { slug: '15-vs-30-year-mortgage', title: '15 vs 30 Year Mortgage: Costs & Trade-offs' },
  { slug: 'mortgage-closing-costs-guide', title: 'Mortgage Closing Costs: What to Expect' },
  { slug: 'first-time-homebuyer-guide', title: 'First-Time Homebuyer Guide 2025' },
  { slug: 'mortgage-pre-approval-guide', title: 'How to Get Mortgage Pre-Approval' },
  { slug: 'home-inspection-guide', title: 'Home Inspection Guide: What to Look For' },
  { slug: 'escrow-explained', title: 'Escrow Explained: Taxes, Insurance & Payments' },
]

// Build all slugs
const statePriceSlugs: string[] = []
for (const state of STATES_ALL) {
  for (const price of HOME_PRICES) {
    statePriceSlugs.push(`${state.slug}-${price}`)
  }
}

const rateScenarioSlugs: string[] = []
for (const rate of RATE_SCENARIO_RATES) {
  for (const price of RATE_SCENARIO_PRICES) {
    const rateStr = rate.toFixed(1).replace('.', '-')
    rateScenarioSlugs.push(`mortgage-rate-${rateStr}-${price}`)
  }
}

const refinanceSlugs: string[] = REFINANCE_SCENARIOS.map(s => {
  const cr = s.currentRate.toFixed(1).replace('.', '-')
  const nr = s.newRate.toFixed(1).replace('.', '-')
  return `refinance-${cr}-to-${nr}-${s.balance}`
})

const guideSlugs: string[] = GUIDE_SLUGS.map(g => g.slug)

export const MORTGAGE_PAGE_SLUGS: string[] = [
  ...statePriceSlugs,
  ...rateScenarioSlugs,
  ...refinanceSlugs,
  ...guideSlugs,
]

export function parseMortgageSlug(slug: string): MortgagePageConfig | null {
  // Guide pages
  const guide = GUIDE_SLUGS.find(g => g.slug === slug)
  if (guide) {
    return { type: 'guide', guideSlug: guide.slug, guideTitle: guide.title }
  }

  // Refinance pages: refinance-7-5-to-6-5-300000
  if (slug.startsWith('refinance-')) {
    const toIdx = slug.indexOf('-to-')
    if (toIdx === -1) return null
    const afterRefinance = slug.slice('refinance-'.length)
    const toIdx2 = afterRefinance.indexOf('-to-')
    const currentRatePart = afterRefinance.slice(0, toIdx2)
    const rest = afterRefinance.slice(toIdx2 + 4)
    // rest is like "6-5-300000"
    // balance is the last numeric segment
    const parts = rest.split('-')
    const balance = parseInt(parts[parts.length - 1], 10)
    const newRatePart = parts.slice(0, parts.length - 1).join('-')
    const currentRate = parseFloat(currentRatePart.replace('-', '.'))
    const newRate = parseFloat(newRatePart.replace('-', '.'))
    if (isNaN(currentRate) || isNaN(newRate) || isNaN(balance)) return null
    return { type: 'refinance', currentRate, newRate, balance }
  }

  // Rate scenario pages: mortgage-rate-6-5-300000
  if (slug.startsWith('mortgage-rate-')) {
    const rest = slug.slice('mortgage-rate-'.length)
    const parts = rest.split('-')
    // last part is price, second-to-last is decimal, third-to-last is whole
    // e.g. "6-5-300000" → rate=6.5, price=300000
    const price = parseInt(parts[parts.length - 1], 10)
    const ratePart = parts.slice(0, parts.length - 1).join('.')
    // ratePart might be "6.5" or "4.0"
    const rate = parseFloat(parts.slice(0, parts.length - 1).join('-').replace('-', '.').replace(/-(\d)$/, '.$1'))
    // More robust: join with dot between last two
    const rateFixed = parseFloat(parts.slice(0, 2).join('.'))
    if (isNaN(rateFixed) || isNaN(price)) return null
    return { type: 'rate-scenario', rate: rateFixed, homePrice: price }
  }

  // State-price pages: california-500000 or new-york-350000
  // Price is always at the end (pure digits)
  const priceMatch = slug.match(/^(.+)-(\d+)$/)
  if (priceMatch) {
    const stateSlug = priceMatch[1]
    const price = parseInt(priceMatch[2], 10)
    const state = STATES_ALL.find(s => s.slug === stateSlug)
    if (state && HOME_PRICES.includes(price)) {
      return { type: 'state-price', stateSlug: state.slug, stateName: state.name, homePrice: price }
    }
  }

  return null
}
