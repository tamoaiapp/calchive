// ─── Retirement savings pages ─────────────────────────────────────────────────
const RETIRE_AGES = [55, 60, 62, 65, 67, 70]
const RETIRE_AMOUNTS = [250000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000]

function formatAmountSlug(n: number): string {
  if (n >= 1000000) {
    const m = n / 1000000
    return m === Math.floor(m) ? `${m}m` : `${m.toFixed(1).replace('.', '-')}m`
  }
  return `${n / 1000}k`
}

function generateRetireSlugs(): string[] {
  const slugs: string[] = []
  for (const age of RETIRE_AGES) {
    for (const amt of RETIRE_AMOUNTS) {
      slugs.push(`retire-at-${age}-with-${formatAmountSlug(amt)}`)
    }
  }
  return slugs
}

const K401_AGES = [30, 35, 40, 45, 50, 55, 60]
const ROTH_AGES = [30, 35, 40, 45, 50, 55, 60]

const K401_SLUGS = K401_AGES.map(a => `401k-at-age-${a}`)
const ROTH_IRA_SLUGS = ROTH_AGES.map(a => `roth-ira-age-${a}`)

// ─── Social Security pages ────────────────────────────────────────────────────
const SS_CLAIM_AGES = [62, 63, 64, 65, 66, 67, 68, 69, 70]
const SS_INCOMES = [30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000]

const SS_AGE_SLUGS = SS_CLAIM_AGES.map(a => `social-security-at-age-${a}`)
const SS_INCOME_SLUGS = SS_INCOMES.map(i => `social-security-for-income-${i}`)

const SS_GUIDE_SLUGS = [
  'when-to-claim-social-security',
  'social-security-for-married-couples',
  'social-security-for-divorced-spouses',
  'social-security-survivor-benefits',
  'social-security-disability-guide',
  'medicare-enrollment-guide',
  'required-minimum-distributions-guide',
  'inherited-ira-guide',
  'spousal-ira-guide',
  'backdoor-roth-ira-guide',
]

export const RETIREMENT_PAGE_SLUGS: string[] = [
  ...generateRetireSlugs(),
  ...K401_SLUGS,
  ...ROTH_IRA_SLUGS,
  ...SS_AGE_SLUGS,
  ...SS_INCOME_SLUGS,
  ...SS_GUIDE_SLUGS,
]

// ─── Social Security claiming age benefit percentages (real SSA data) ─────────
// Based on Full Retirement Age of 67 (born 1960+)
export const SS_CLAIMING_BENEFIT: Record<number, number> = {
  62: 70.0,
  63: 75.0,
  64: 80.0,
  65: 86.7,
  66: 93.3,
  67: 100.0,
  68: 108.0,
  69: 116.0,
  70: 124.0,
}

// ─── 401k benchmarks by age (Fidelity 2025 guidance) ─────────────────────────
// Multiples of annual salary
export const K401_BENCHMARK_MULTIPLIER: Record<number, number> = {
  30: 1.0,
  35: 2.0,
  40: 3.0,
  45: 4.0,
  50: 6.0,
  55: 7.0,
  60: 8.0,
}

// ─── Config types ─────────────────────────────────────────────────────────────
export type RetirementPageType =
  | 'retire-at'
  | '401k-age'
  | 'roth-ira'
  | 'ss-age'
  | 'ss-income'
  | 'ss-guide'

export interface RetirementPageConfig {
  type: RetirementPageType
  slug: string
  age?: number
  amount?: number
  income?: number
  ssPercent?: number
  k401Multiplier?: number
  annualWithdrawal4pct?: number
}

export function parseRetirementSlug(slug: string): RetirementPageConfig | null {
  // retire-at-[age]-with-[amount]
  const retireMatch = slug.match(/^retire-at-(\d+)-with-(.+)$/)
  if (retireMatch) {
    const age = parseInt(retireMatch[1])
    const amtStr = retireMatch[2]
    let amount = 0
    if (amtStr.endsWith('m')) {
      const raw = amtStr.replace('m', '').replace('-', '.')
      amount = parseFloat(raw) * 1000000
    } else if (amtStr.endsWith('k')) {
      amount = parseInt(amtStr.replace('k', '')) * 1000
    }
    if (amount > 0 && RETIRE_AGES.includes(age)) {
      return {
        type: 'retire-at',
        slug,
        age,
        amount,
        annualWithdrawal4pct: amount * 0.04,
      }
    }
  }

  // 401k-at-age-[age]
  const k401Match = slug.match(/^401k-at-age-(\d+)$/)
  if (k401Match) {
    const age = parseInt(k401Match[1])
    if (K401_AGES.includes(age)) {
      return {
        type: '401k-age',
        slug,
        age,
        k401Multiplier: K401_BENCHMARK_MULTIPLIER[age],
      }
    }
  }

  // roth-ira-age-[age]
  const rothMatch = slug.match(/^roth-ira-age-(\d+)$/)
  if (rothMatch) {
    const age = parseInt(rothMatch[1])
    if (ROTH_AGES.includes(age)) {
      return { type: 'roth-ira', slug, age }
    }
  }

  // social-security-at-age-[age]
  const ssAgeMatch = slug.match(/^social-security-at-age-(\d+)$/)
  if (ssAgeMatch) {
    const age = parseInt(ssAgeMatch[1])
    if (SS_CLAIM_AGES.includes(age)) {
      return {
        type: 'ss-age',
        slug,
        age,
        ssPercent: SS_CLAIMING_BENEFIT[age],
      }
    }
  }

  // social-security-for-income-[income]
  const ssIncomeMatch = slug.match(/^social-security-for-income-(\d+)$/)
  if (ssIncomeMatch) {
    const income = parseInt(ssIncomeMatch[1])
    if (SS_INCOMES.includes(income)) {
      return { type: 'ss-income', slug, income }
    }
  }

  if (SS_GUIDE_SLUGS.includes(slug)) {
    return { type: 'ss-guide', slug }
  }

  return null
}
