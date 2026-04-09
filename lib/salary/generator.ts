import type { StateData } from './states'
import type { ProfessionData } from './professions'
import {
  calculateTakeHome,
  formatCurrency,
  formatPct,
  type TaxBreakdown,
  type FilingStatus,
} from './calculator'

export interface SalaryStateAmountRow {
  amount: number
  breakdown: TaxBreakdown
}

export interface FilingStatusRow {
  status: FilingStatus
  label: string
  breakdown: TaxBreakdown
}

export interface SalaryStatePage {
  h1: string
  metaTitle: string
  metaDesc: string
  breakdown: TaxBreakdown
  alsoCheck: TaxBreakdown
  tableByAmount: SalaryStateAmountRow[]
  tableByFilingStatus: FilingStatusRow[]
  stateContext: string
  relatedLinks: { title: string; href: string; icon: string }[]
}

export interface ProfessionLevelRow {
  level: string
  salary: number
  afterTaxNational: number
  effectiveRate: string
}

export interface ProfessionStateRow {
  stateName: string
  stateSlug: string
  salary: number
  afterTax: number
  effectiveRate: string
}

export interface SalaryProfessionPage {
  h1: string
  metaTitle: string
  metaDesc: string
  salaryTable: ProfessionLevelRow[]
  byStateTable: ProfessionStateRow[]
  careerPath: string
  faq: { q: string; a: string }[]
  relatedLinks: { title: string; href: string; icon: string }[]
}

// Dummy "national" state for profession pages — use Texas (no state tax) as neutral base
// for listing, then show state breakdown separately
import { STATES_ALL, getStateBySlug } from './states'

const NATIONAL_STATE: StateData = {
  slug: 'national',
  name: 'United States (National Average)',
  abbr: 'US',
  incomeTaxRate: 0,
  incomeTaxBrackets: [],
  hasIncomeTax: false,
  costOfLivingIndex: 100,
  medianHousehold: 77719,
}

function buildStateContext(state: StateData): string {
  if (!state.hasIncomeTax) {
    return `${state.name} levies no state income tax on wages, putting it among 9 states that leave that portion of the tax burden entirely to the federal government. That makes ${state.abbr} especially attractive to high earners — a $150,000 salary keeps roughly $8,000 more annually than a comparable earner in a 5% flat-rate state. ${state.localTaxNote ? state.localTaxNote + '.' : 'No local income taxes apply in most jurisdictions.'}`
  }
  if (state.incomeTaxBrackets.length === 1) {
    const rate = (state.incomeTaxRate * 100).toFixed(2)
    return `${state.name} uses a flat ${rate}% income tax rate applied to all taxable income, regardless of earnings level. The simplicity means a $50,000 earner and a $200,000 earner pay the exact same marginal rate — a design that favors higher earners compared to graduated bracket systems. ${state.localTaxNote ? state.localTaxNote + '.' : ''}`
  }
  const topRate = (state.incomeTaxRate * 100).toFixed(1)
  if (state.slug === 'california') {
    return `California's 13.3% top marginal rate is the highest in the nation, applying to income over $1 million. Even moderate earners face meaningful state tax burden: a single filer at $75,000 hits the 9.3% bracket. The state also levies SDI (State Disability Insurance) at 0.9% on all wages with no cap in 2025. ${state.localTaxNote ? state.localTaxNote + '.' : ''}`
  }
  if (state.slug === 'new-york') {
    return `New York's top rate of 10.9% applies above $25 million, but most six-figure earners sit in the 6.85% bracket. ${state.localTaxNote ? state.localTaxNote + '.' : ''} The combination of state and city taxes makes New York City one of the highest-tax jurisdictions in the US for wage earners.`
  }
  return `${state.name} applies a top marginal income tax rate of ${topRate}% on the highest earners. The graduated bracket structure means most middle-income earners face effective state rates well below the headline number. ${state.localTaxNote ? state.localTaxNote + '.' : ''}`
}

const NEARBY_OFFSETS = [-25000, -10000, 10000, 25000, 50000]

export function generateStatePage(state: StateData, amount: number): SalaryStatePage {
  const singleBreakdown = calculateTakeHome(amount, state, 'single')
  const marriedBreakdown = calculateTakeHome(amount, state, 'married_jointly')

  const nearbyAmounts = NEARBY_OFFSETS.map(offset => amount + offset).filter(a => a > 0)
  const tableByAmount: SalaryStateAmountRow[] = nearbyAmounts.map(a => ({
    amount: a,
    breakdown: calculateTakeHome(a, state, 'single'),
  }))

  const filingStatuses: { status: FilingStatus; label: string }[] = [
    { status: 'single', label: 'Single' },
    { status: 'married_jointly', label: 'Married Filing Jointly' },
    { status: 'married_separately', label: 'Married Filing Separately' },
    { status: 'head_of_household', label: 'Head of Household' },
  ]

  const tableByFilingStatus: FilingStatusRow[] = filingStatuses.map(({ status, label }) => ({
    status,
    label,
    breakdown: calculateTakeHome(amount, state, status),
  }))

  const formattedGross = formatCurrency(amount)
  const formattedNet = formatCurrency(singleBreakdown.netAnnual)
  const effectivePct = formatPct(singleBreakdown.effectiveRate)
  const year = new Date().getFullYear()

  // Rotate templates so pages with different state+amount combos have distinct prose.
  // Variant index: derived from (first char of state slug + amount) — deterministic, no randomness.
  const variantIdx = (state.slug.charCodeAt(0) + Math.floor(amount / 10000)) % 4

  const h1Variants = state.hasIncomeTax
    ? [
        `What is ${formattedGross} After Taxes in ${state.name}?`,
        `${formattedGross} Salary in ${state.name}: Take-Home Pay After Tax`,
        `${state.name} Take-Home on ${formattedGross} — Tax Breakdown (${year})`,
        `How Much of ${formattedGross} Do You Keep in ${state.name}?`,
      ]
    : [
        `${formattedGross} Salary After Taxes in ${state.name} (No State Income Tax)`,
        `${state.name} Has No Income Tax — Here's What ${formattedGross} Takes Home`,
        `${formattedGross} After Tax in ${state.name}: No State Tax Advantage`,
        `Take-Home on ${formattedGross} in ${state.name} — Federal Tax Only`,
      ]

  const metaTitleVariants = [
    `${formattedGross} After Tax in ${state.name} (${year}) | Calchive`,
    `${state.name} Take-Home on ${formattedGross} (${year}) | Calchive`,
    `${formattedGross} Salary — ${state.name} Tax Breakdown ${year} | Calchive`,
    `What Does ${formattedGross} Take Home in ${state.name}? (${year}) | Calchive`,
  ]

  const metaDescVariants = state.hasIncomeTax
    ? [
        `A ${formattedGross} salary in ${state.name} takes home ${formattedNet} per year after federal and state taxes — ${effectivePct} effective rate. See monthly, biweekly, weekly, and hourly breakdowns.`,
        `Earning ${formattedGross} in ${state.name}? After federal income tax, state tax, and FICA, take-home pay is ${formattedNet}/year (${effectivePct} effective rate). Full paycheck breakdown included.`,
        `${state.name} workers on a ${formattedGross} salary net ${formattedNet} after all taxes — a ${effectivePct} effective rate. Monthly take-home: ${formatCurrency(singleBreakdown.netMonthly)}. See the complete breakdown.`,
        `At ${formattedGross} in ${state.name}, total taxes reduce your paycheck to ${formattedNet} annually (${effectivePct} effective rate). Includes federal, state, Social Security, and Medicare.`,
      ]
    : [
        `With no state income tax, a ${formattedGross} salary in ${state.name} takes home ${formattedNet} after federal taxes — ${effectivePct} effective rate. See full monthly and hourly breakdowns.`,
        `${state.name} levies no state income tax. A ${formattedGross} earner keeps ${formattedNet} after federal income tax and FICA — ${effectivePct} combined effective rate.`,
        `No state tax in ${state.name} means a ${formattedGross} salary nets ${formattedNet} — only federal income tax and FICA apply. ${effectivePct} overall effective rate.`,
        `${formattedGross} in ${state.name}: take-home is ${formattedNet} (${effectivePct} effective rate). State income tax is $0 — federal income tax and FICA are the only deductions.`,
      ]

  const h1 = h1Variants[variantIdx]
  const metaTitle = metaTitleVariants[variantIdx]
  const metaDesc = metaDescVariants[variantIdx]

  const relatedLinks = [
    { title: 'Paycheck Calculator', href: '/calculator/paycheck-calculator', icon: '💵' },
    { title: 'Federal Income Tax Calculator', href: '/calculator/federal-income-tax-calculator', icon: '🏛️' },
    { title: 'Take-Home Pay Calculator', href: '/calculator/take-home-pay-calculator', icon: '🏠' },
    { title: 'Hourly to Salary Calculator', href: '/calculator/hourly-to-salary-calculator', icon: '⏰' },
    { title: 'Budget Calculator', href: '/calculator/budget-calculator', icon: '📊' },
    { title: 'Salary Comparison', href: '/salary', icon: '📋' },
  ]

  return {
    h1,
    metaTitle,
    metaDesc,
    breakdown: singleBreakdown,
    alsoCheck: marriedBreakdown,
    tableByAmount,
    tableByFilingStatus,
    stateContext: buildStateContext(state),
    relatedLinks,
  }
}

export function generateProfessionPage(profession: ProfessionData): SalaryProfessionPage {
  const levels: { level: string; salary: number }[] = [
    { level: 'Entry Level', salary: profession.entryLevel },
    { level: '25th Percentile', salary: profession.p25Salary },
    { level: 'Median', salary: profession.medianSalary },
    { level: '75th Percentile', salary: profession.p75Salary },
    { level: '90th Percentile', salary: profession.p90Salary },
    { level: 'Senior Level', salary: profession.seniorLevel },
  ]

  const salaryTable: ProfessionLevelRow[] = levels.map(({ level, salary }) => {
    const bd = calculateTakeHome(salary, NATIONAL_STATE, 'single')
    return {
      level,
      salary,
      afterTaxNational: bd.netAnnual,
      effectiveRate: formatPct(bd.effectiveRate),
    }
  })

  const topStateObjects = profession.topStates
    .map(slug => getStateBySlug(slug))
    .filter((s): s is StateData => s !== undefined)
    .slice(0, 5)

  const byStateTable: ProfessionStateRow[] = topStateObjects.map(state => {
    // Profession median salary adjusted slightly for state cost of living (±10%)
    const adjustedSalary = Math.round(
      profession.medianSalary * (0.85 + (state.costOfLivingIndex / 100) * 0.25)
    )
    const bd = calculateTakeHome(adjustedSalary, state, 'single')
    return {
      stateName: state.name,
      stateSlug: state.slug,
      salary: adjustedSalary,
      afterTax: bd.netAnnual,
      effectiveRate: formatPct(bd.effectiveRate),
    }
  })

  const faq: { q: string; a: string }[] = [
    {
      q: `What is the average ${profession.title} salary in the US?`,
      a: `The national median ${profession.title} salary is ${formatCurrency(profession.medianSalary)} per year as of 2025. The middle 50% of earners fall between ${formatCurrency(profession.p25Salary)} and ${formatCurrency(profession.p75Salary)}, while the top 10% earn over ${formatCurrency(profession.p90Salary)}.`,
    },
    {
      q: `How much does a ${profession.title} take home after taxes?`,
      a: `A ${profession.title} earning the median ${formatCurrency(profession.medianSalary)} takes home approximately ${formatCurrency(calculateTakeHome(profession.medianSalary, NATIONAL_STATE, 'single').netAnnual)} after federal taxes (single filer, assuming no state income tax). Add state taxes to get a more precise figure for your location.`,
    },
    {
      q: `Where do ${profession.title}s earn the most?`,
      a: `The highest-paying states for ${profession.title}s are ${profession.topStates.slice(0, 3).map(slug => getStateBySlug(slug)?.name ?? slug).join(', ')}. Top cities include ${profession.topCities.join(', ')}, where salaries can exceed ${formatCurrency(profession.p75Salary)} for experienced professionals.`,
    },
  ]

  const relatedLinks = [
    { title: 'Salary After Tax Calculator', href: '/salary', icon: '💰' },
    { title: 'Federal Income Tax Calculator', href: '/calculator/federal-income-tax-calculator', icon: '🏛️' },
    { title: 'Paycheck Calculator', href: '/calculator/paycheck-calculator', icon: '💵' },
    { title: 'Career Salary Comparison', href: '/salary/career', icon: '📊' },
    { title: 'Take-Home Pay Calculator', href: '/calculator/take-home-pay-calculator', icon: '🏠' },
  ]

  // Rotate H1 and meta across 4 variants keyed by profession slug
  const profVariant = profession.slug.charCodeAt(0) % 4
  const profYear = new Date().getFullYear()
  const medNetStr = formatCurrency(calculateTakeHome(profession.medianSalary, NATIONAL_STATE, 'single').netAnnual)

  const h1 = [
    `${profession.title} Salary: What You Actually Take Home`,
    `How Much Does a ${profession.title} Earn After Taxes?`,
    `${profession.title} Pay: Median, Entry-Level & Senior Salaries`,
    `${profession.title} Salary Breakdown — Gross vs. Take-Home`,
  ][profVariant]

  const metaTitle = [
    `${profession.title} Salary After Tax (${profYear}) — Median, Entry & Senior Pay | Calchive`,
    `${profession.title} Take-Home Pay (${profYear}) — What You Keep After Taxes | Calchive`,
    `${profession.title} Salary: ${formatCurrency(profession.medianSalary)} Median — After-Tax Breakdown (${profYear}) | Calchive`,
    `${profession.title} Income After Tax (${profYear}) — Entry to Senior Levels | Calchive`,
  ][profVariant]

  const metaDesc = [
    `${profession.title} median salary is ${formatCurrency(profession.medianSalary)}/year. After federal taxes, the take-home is around ${medNetStr}. See entry, mid, and senior pay with full tax breakdown.`,
    `The median ${profession.title} earns ${formatCurrency(profession.medianSalary)}/year — about ${medNetStr} after federal taxes. Compare entry, senior, and top-10% pay in this full breakdown.`,
    `${profession.title} salaries range from ${formatCurrency(profession.entryLevel)} (entry) to ${formatCurrency(profession.p90Salary)} (top 10%). Median take-home after tax: ~${medNetStr}. See the full picture.`,
    `Median ${profession.title} pay is ${formatCurrency(profession.medianSalary)} gross — ${medNetStr} after federal taxes. Includes salary by experience level and top states for ${profession.title}s.`,
  ][profVariant]

  return {
    h1,
    metaTitle,
    metaDesc,
    salaryTable,
    byStateTable,
    careerPath: profession.desc,
    faq,
    relatedLinks,
  }
}

export { formatCurrency, formatPct }
