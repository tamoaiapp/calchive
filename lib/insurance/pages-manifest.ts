import { AUTO_INSURANCE_BY_STATE, LIFE_INSURANCE_RATES, HOME_INSURANCE_BY_STATE, STATE_MIN_COVERAGE } from './data'

// ─── All 50 states + DC slugs ─────────────────────────────────────────────────
const ALL_STATES = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'district-of-columbia', 'florida', 'georgia',
  'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
  'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire',
  'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota',
  'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina',
  'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia',
  'washington', 'west-virginia', 'wisconsin', 'wyoming',
]

const DRIVER_TYPES = [
  'new-driver', 'teen-driver', 'senior-driver', 'bad-credit-driver',
  'high-risk-driver', 'rideshare-driver', 'commercial-driver',
]

const LIFE_AGES = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
const LIFE_COVERAGES = ['250k', '500k', '750k', '1m', '1-5m', '2m']

const TOP_HEALTH_STATES = [
  'california', 'texas', 'florida', 'new-york', 'illinois', 'pennsylvania',
  'ohio', 'georgia', 'north-carolina', 'michigan', 'new-jersey', 'virginia',
  'washington', 'arizona', 'massachusetts', 'indiana', 'tennessee', 'missouri',
  'maryland', 'colorado',
]

// ─── Slug arrays ──────────────────────────────────────────────────────────────
const AUTO_STATE_SLUGS = ALL_STATES.map(s => `auto-insurance-${s}`)
const AUTO_DRIVER_SLUGS = DRIVER_TYPES.map(d => `auto-insurance-for-${d}`)
const HOME_STATE_SLUGS = ALL_STATES.map(s => `homeowners-insurance-${s}`)
const HOME_GUIDE_SLUGS = [
  'homeowners-insurance-guide', 'flood-insurance-guide',
  'earthquake-insurance-guide', 'renters-insurance-guide',
]
const LIFE_AGE_SLUGS = LIFE_AGES.map(a => `life-insurance-age-${a}`)
const LIFE_COVERAGE_SLUGS = LIFE_COVERAGES.map(c => `life-insurance-${c}`)
const LIFE_GUIDE_SLUGS = [
  'term-vs-whole-life-insurance', 'how-much-life-insurance-do-i-need',
  'life-insurance-for-seniors', 'life-insurance-for-smokers',
  'life-insurance-with-pre-existing-conditions', 'life-insurance-for-small-business',
  'group-life-insurance-guide', 'burial-insurance-guide',
]
const HEALTH_STATE_SLUGS = TOP_HEALTH_STATES.map(s => `health-insurance-${s}`)
const HEALTH_GUIDE_SLUGS = [
  'aca-marketplace-guide', 'cobra-insurance-guide', 'medicare-guide',
  'medicaid-guide', 'hmo-vs-ppo-vs-epo', 'health-insurance-for-self-employed',
  'short-term-health-insurance', 'health-insurance-deductible-explained',
]
const OTHER_SLUGS = [
  'short-term-disability-guide', 'long-term-disability-guide',
  'umbrella-insurance-guide', 'pet-insurance-guide', 'travel-insurance-guide',
  'motorcycle-insurance-guide', 'boat-insurance-guide', 'rv-insurance-guide',
  'business-insurance-guide', 'workers-comp-insurance-guide',
]

export const INSURANCE_PAGE_SLUGS: string[] = [
  ...AUTO_STATE_SLUGS,
  ...AUTO_DRIVER_SLUGS,
  ...HOME_STATE_SLUGS,
  ...HOME_GUIDE_SLUGS,
  ...LIFE_AGE_SLUGS,
  ...LIFE_COVERAGE_SLUGS,
  ...LIFE_GUIDE_SLUGS,
  ...HEALTH_STATE_SLUGS,
  ...HEALTH_GUIDE_SLUGS,
  ...OTHER_SLUGS,
]

// ─── Config types ─────────────────────────────────────────────────────────────
export type InsuranceType =
  | 'auto-state'
  | 'auto-driver'
  | 'home-state'
  | 'home-guide'
  | 'life-age'
  | 'life-coverage'
  | 'life-guide'
  | 'health-state'
  | 'health-guide'
  | 'other-guide'

export interface InsurancePageConfig {
  type: InsuranceType
  slug: string
  state?: string
  stateName?: string
  driverType?: string
  age?: number
  coverage?: string
  annualPremium?: number
  homePremium?: number
  stateMin?: { bodily: string; property: string; notes?: string }
  lifeMale?: number
  lifeFemale?: number
}

function stateSlugToName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    .replace('Of', 'of')
}

export function parseInsuranceSlug(slug: string): InsurancePageConfig | null {
  // auto-insurance-[state]
  for (const s of ALL_STATES) {
    if (slug === `auto-insurance-${s}`) {
      return {
        type: 'auto-state',
        slug,
        state: s,
        stateName: stateSlugToName(s),
        annualPremium: AUTO_INSURANCE_BY_STATE[s] ?? 1750,
        stateMin: STATE_MIN_COVERAGE[s],
      }
    }
  }

  // auto-insurance-for-[driver]
  for (const d of DRIVER_TYPES) {
    if (slug === `auto-insurance-for-${d}`) {
      return { type: 'auto-driver', slug, driverType: d }
    }
  }

  // homeowners-insurance-[state]
  for (const s of ALL_STATES) {
    if (slug === `homeowners-insurance-${s}`) {
      return {
        type: 'home-state',
        slug,
        state: s,
        stateName: stateSlugToName(s),
        homePremium: HOME_INSURANCE_BY_STATE[s] ?? 2270,
      }
    }
  }

  // home guides
  if (HOME_GUIDE_SLUGS.includes(slug)) {
    return { type: 'home-guide', slug }
  }

  // life-insurance-age-[age]
  for (const a of LIFE_AGES) {
    if (slug === `life-insurance-age-${a}`) {
      return {
        type: 'life-age',
        slug,
        age: a,
        lifeMale: LIFE_INSURANCE_RATES.male[String(a)],
        lifeFemale: LIFE_INSURANCE_RATES.female[String(a)],
      }
    }
  }

  // life-insurance-[coverage]
  for (const c of LIFE_COVERAGES) {
    if (slug === `life-insurance-${c}`) {
      return { type: 'life-coverage', slug, coverage: c }
    }
  }

  // life guides
  if (LIFE_GUIDE_SLUGS.includes(slug)) {
    return { type: 'life-guide', slug }
  }

  // health-insurance-[state]
  for (const s of TOP_HEALTH_STATES) {
    if (slug === `health-insurance-${s}`) {
      return { type: 'health-state', slug, state: s, stateName: stateSlugToName(s) }
    }
  }

  // health guides
  if (HEALTH_GUIDE_SLUGS.includes(slug)) {
    return { type: 'health-guide', slug }
  }

  // other guides
  if (OTHER_SLUGS.includes(slug)) {
    return { type: 'other-guide', slug }
  }

  return null
}
