import {
  FEDERAL_BRACKETS_2025,
  STANDARD_DEDUCTION_2025,
  CAPITAL_GAINS_RATES_2025,
  SE_TAX_RATE,
  SE_DEDUCTIBLE_RATE,
  SS_WAGE_BASE_2025,
  SS_EMPLOYEE_RATE,
  MEDICARE_EMPLOYEE_RATE,
  ADDITIONAL_MEDICARE_RATE,
  FILING_STATUS_LABELS,
  calcFederalTax,
  calcBracketBreakdown,
  getMarginalRate,
  fmt,
  fmtPct,
  type FilingStatus,
  type BracketContribution,
} from './data'
import { STATES, getStateBySlug } from '@/lib/salary/states'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TaxPage {
  h1: string
  metaTitle: string
  metaDesc: string
  taxBreakdown: TaxBreakdown
  effectiveRate: number
  marginalRate: number
  comparisonTable: FilingStatusRow[]
  nearbyAmounts: NearbyAmountRow[]
  keyFacts: string[]
  relatedLinks: RelatedLink[]
}

export interface TaxBreakdown {
  grossIncome: number
  standardDeduction: number
  taxableIncome: number
  totalFederalTax: number
  bracketContributions: BracketContribution[]
  ficaSocialSecurity: number
  ficaMedicare: number
  netIncome: number
  filing: FilingStatus
}

export interface FilingStatusRow {
  filing: FilingStatus
  label: string
  taxableIncome: number
  federalTax: number
  effectiveRate: number
  takeHome: number
}

export interface NearbyAmountRow {
  amount: number
  federalTax: number
  effectiveRate: number
  takeHome: number
  slug: string
}

export interface CapGainsTaxPage {
  h1: string
  metaTitle: string
  metaDesc: string
  gainAmount: number
  holdingPeriod: 'long-term' | 'short-term'
  taxBreakdown: CapGainsBreakdown
  comparisonTable: CapGainsFilingRow[]
  nearbyAmounts: NearbyCapGainsRow[]
  keyFacts: string[]
  relatedLinks: RelatedLink[]
}

export interface CapGainsBreakdown {
  gainAmount: number
  longTermRate: number
  taxOwed: number
  netProceeds: number
  shortTermComparison: number
  isLongTerm: boolean
}

export interface CapGainsFilingRow {
  filing: FilingStatus
  label: string
  rate: number
  taxOwed: number
  netProceeds: number
}

export interface NearbyCapGainsRow {
  amount: number
  rate: number
  taxOwed: number
  slug: string
}

export interface SETaxPage {
  h1: string
  metaTitle: string
  metaDesc: string
  netEarnings: number
  taxBreakdown: SETaxBreakdown
  nearbyAmounts: NearbyAmountRow[]
  keyFacts: string[]
  relatedLinks: RelatedLink[]
}

export interface SETaxBreakdown {
  netEarnings: number
  seTaxableAmount: number
  selfEmploymentTax: number
  deductibleHalf: number
  adjustedGrossIncome: number
  federalIncomeTax: number
  totalTax: number
  effectiveRate: number
  takeHome: number
  socialSecurityPortion: number
  medicarePortion: number
}

export interface StateTaxPage {
  h1: string
  metaTitle: string
  metaDesc: string
  grossIncome: number
  stateName: string
  stateSlug: string
  hasStateTax: boolean
  stateTaxBreakdown: StateTaxBreakdown
  comparisonTable: FilingStatusRow[]
  nearbyAmounts: NearbyAmountRow[]
  keyFacts: string[]
  relatedLinks: RelatedLink[]
}

export interface StateTaxBreakdown {
  grossIncome: number
  federalTax: number
  stateTax: number
  ficaSocialSecurity: number
  ficaMedicare: number
  totalTax: number
  effectiveRate: number
  takeHome: number
  stateEffectiveRate: number
}

export interface TaxGuidePage {
  h1: string
  metaTitle: string
  metaDesc: string
  sections: GuideSection[]
  faq: { q: string; a: string }[]
  relatedLinks: RelatedLink[]
  jsonLdFaq: { q: string; a: string }[]
}

export interface GuideSection {
  heading: string
  body: string
  table?: { headers: string[]; rows: string[][] }
}

export interface RelatedLink {
  title: string
  href: string
  icon: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function stdRelatedLinks(extras: RelatedLink[] = []): RelatedLink[] {
  const base: RelatedLink[] = [
    { title: 'Federal Income Tax Calculator', href: '/calculator/federal-income-tax-calculator', icon: '🏛️' },
    { title: 'Paycheck Calculator', href: '/calculator/paycheck-calculator', icon: '💵' },
    { title: 'Take-Home Pay Calculator', href: '/calculator/take-home-pay-calculator', icon: '🏠' },
  ]
  return [...base, ...extras].slice(0, 6)
}

function calcFICA(grossIncome: number, filing: FilingStatus): { ss: number; medicare: number } {
  const ssTaxable = Math.min(grossIncome, SS_WAGE_BASE_2025)
  const ss = ssTaxable * SS_EMPLOYEE_RATE
  const medicareBase = grossIncome * MEDICARE_EMPLOYEE_RATE
  const additionalThreshold = filing === 'married_jointly' ? 250000 : 200000
  const additionalMedicare = Math.max(0, grossIncome - additionalThreshold) * ADDITIONAL_MEDICARE_RATE
  return { ss, medicare: medicareBase + additionalMedicare }
}

function buildTaxBreakdown(grossIncome: number, filing: FilingStatus): TaxBreakdown {
  const standardDeduction = STANDARD_DEDUCTION_2025[filing]
  const taxableIncome = Math.max(0, grossIncome - standardDeduction)
  const totalFederalTax = calcFederalTax(taxableIncome, filing)
  const bracketContributions = calcBracketBreakdown(taxableIncome, filing)
  const { ss, medicare } = calcFICA(grossIncome, filing)
  return {
    grossIncome,
    standardDeduction,
    taxableIncome,
    totalFederalTax,
    bracketContributions,
    ficaSocialSecurity: ss,
    ficaMedicare: medicare,
    netIncome: grossIncome - totalFederalTax - ss - medicare,
    filing,
  }
}

function buildFilingComparison(grossIncome: number): FilingStatusRow[] {
  const statuses: FilingStatus[] = ['single', 'married_jointly', 'married_separately', 'head_of_household']
  return statuses.map(filing => {
    const std = STANDARD_DEDUCTION_2025[filing]
    const taxable = Math.max(0, grossIncome - std)
    const federalTax = calcFederalTax(taxable, filing)
    const effectiveRate = grossIncome > 0 ? federalTax / grossIncome : 0
    return {
      filing,
      label: FILING_STATUS_LABELS[filing],
      taxableIncome: taxable,
      federalTax,
      effectiveRate,
      takeHome: grossIncome - federalTax,
    }
  })
}

function buildNearbyAmounts(amount: number, slugBuilder: (a: number) => string): NearbyAmountRow[] {
  const offsets = [-50000, -25000, -10000, 10000, 25000, 50000]
  return offsets
    .map(o => amount + o)
    .filter(a => a > 0)
    .map(a => {
      const taxable = Math.max(0, a - STANDARD_DEDUCTION_2025.single)
      const federalTax = calcFederalTax(taxable, 'single')
      return {
        amount: a,
        federalTax,
        effectiveRate: a > 0 ? federalTax / a : 0,
        takeHome: a - federalTax,
        slug: slugBuilder(a),
      }
    })
}

// ─── Federal Income Tax Page ─────────────────────────────────────────────────

export function generateFederalTaxPage(amount: number, filingSlug: string): TaxPage {
  const filingMap: Record<string, FilingStatus> = {
    single: 'single',
    'married-jointly': 'married_jointly',
    'married-separately': 'married_separately',
    'head-of-household': 'head_of_household',
  }
  const filing = filingMap[filingSlug] ?? 'single'
  const label = FILING_STATUS_LABELS[filing]

  const breakdown = buildTaxBreakdown(amount, filing)
  const effectiveRate = amount > 0 ? breakdown.totalFederalTax / amount : 0
  const marginalRate = getMarginalRate(breakdown.taxableIncome, filing)

  const formattedAmount = fmt(amount)
  const formattedTax = fmt(breakdown.totalFederalTax)
  const formattedTakeHome = fmt(breakdown.netIncome)
  const effectivePct = fmtPct(effectiveRate)
  const marginalPct = fmtPct(marginalRate)

  const h1 = `Federal Income Tax on ${formattedAmount} (${label}, 2025)`
  const metaTitle = `How Much Federal Tax on ${formattedAmount}? ${label} 2025 | Calchive`
  const metaDesc = `A ${label.toLowerCase()} filer earning ${formattedAmount} in 2025 pays ${formattedTax} in federal income tax — ${effectivePct} effective rate, ${marginalPct} marginal rate. Take-home: ${formattedTakeHome}.`

  const keyFacts: string[] = [
    `Your marginal rate is ${marginalPct} — the next dollar earned is taxed at ${marginalPct}.`,
    `The standard deduction of ${fmt(breakdown.standardDeduction)} reduces your taxable income from ${formattedAmount} to ${fmt(breakdown.taxableIncome)}.`,
    `After federal income tax, Social Security (${fmt(breakdown.ficaSocialSecurity)}), and Medicare (${fmt(breakdown.ficaMedicare)}), take-home is ${formattedTakeHome} — ${fmtPct(1 - (breakdown.totalFederalTax + breakdown.ficaSocialSecurity + breakdown.ficaMedicare) / amount)} of gross pay.`,
    `Married filing jointly at ${formattedAmount} pays only ${fmt(calcFederalTax(Math.max(0, amount - 30000), 'married_jointly'))} in federal tax due to the $30,000 standard deduction.`,
  ]

  const relatedLinks = stdRelatedLinks([
    { title: 'Capital Gains Tax Calculator', href: `/tax/capital-gains-tax-${amount}-long-term`, icon: '📈' },
    { title: 'Self-Employment Tax', href: `/tax/self-employment-tax-${amount}`, icon: '🧾' },
    { title: 'Salary After Tax', href: `/salary/california/${amount}`, icon: '💰' },
  ])

  return {
    h1,
    metaTitle,
    metaDesc,
    taxBreakdown: breakdown,
    effectiveRate,
    marginalRate,
    comparisonTable: buildFilingComparison(amount),
    nearbyAmounts: buildNearbyAmounts(amount, a => `federal-tax-${a}-${filingSlug}`),
    keyFacts,
    relatedLinks,
  }
}

// ─── Capital Gains Tax Page ───────────────────────────────────────────────────

export function generateCapitalGainsPage(amount: number, holdingPeriod: string): CapGainsTaxPage {
  const isLongTerm = holdingPeriod === 'long-term'
  const thresholds = CAPITAL_GAINS_RATES_2025.single

  // Long-term capital gains rate for single filer at this income level
  let longTermRate = 0.20
  if (amount <= thresholds.rate0) longTermRate = 0
  else if (amount <= thresholds.rate15) longTermRate = 0.15

  // Short-term gains taxed as ordinary income (single, $0 other income assumed)
  const shortTermTaxable = Math.max(0, amount - STANDARD_DEDUCTION_2025.single)
  const shortTermTax = calcFederalTax(shortTermTaxable, 'single')

  const longTermTax = amount * longTermRate
  const taxOwed = isLongTerm ? longTermTax : shortTermTax

  const formattedAmount = fmt(amount)
  const formattedTax = fmt(taxOwed)
  const netProceeds = amount - taxOwed

  const h1 = `Capital Gains Tax on ${formattedAmount} (${isLongTerm ? 'Long-Term' : 'Short-Term'}, 2025)`
  const metaTitle = `${isLongTerm ? 'Long' : 'Short'}-Term Capital Gains Tax on ${formattedAmount} (2025) | Calchive`
  const metaDesc = `A ${isLongTerm ? 'long-term' : 'short-term'} capital gain of ${formattedAmount} in 2025 triggers ${formattedTax} in federal tax — ${isLongTerm ? `${fmtPct(longTermRate)} long-term rate` : `${fmtPct(shortTermTax / amount)} effective rate`}. Net proceeds: ${fmt(netProceeds)}.`

  const allFilings: FilingStatus[] = ['single', 'married_jointly', 'married_separately', 'head_of_household']
  const comparisonTable: CapGainsFilingRow[] = allFilings.map(filing => {
    const t = CAPITAL_GAINS_RATES_2025[filing]
    let rate = 0.20
    if (amount <= t.rate0) rate = 0
    else if (amount <= t.rate15) rate = 0.15
    const tax = isLongTerm ? amount * rate : calcFederalTax(Math.max(0, amount - STANDARD_DEDUCTION_2025[filing]), filing)
    return {
      filing,
      label: FILING_STATUS_LABELS[filing],
      rate: isLongTerm ? rate : tax / amount,
      taxOwed: tax,
      netProceeds: amount - tax,
    }
  })

  const amounts = [5000, 10000, 25000, 50000, 75000, 100000, 200000, 500000]
  const nearbyAmounts: NearbyCapGainsRow[] = amounts
    .filter(a => a !== amount)
    .slice(0, 6)
    .map(a => {
      const t = CAPITAL_GAINS_RATES_2025.single
      let r = 0.20
      if (a <= t.rate0) r = 0
      else if (a <= t.rate15) r = 0.15
      const tax = isLongTerm ? a * r : calcFederalTax(Math.max(0, a - STANDARD_DEDUCTION_2025.single), 'single')
      return { amount: a, rate: isLongTerm ? r : tax / a, taxOwed: tax, slug: `capital-gains-tax-${a}-${holdingPeriod}` }
    })

  const keyFacts: string[] = [
    isLongTerm
      ? `Long-term gains (assets held over 12 months) qualify for a preferential ${fmtPct(longTermRate)} rate versus ordinary income rates up to 37%.`
      : `Short-term gains (assets held 12 months or less) are taxed as ordinary income — at this amount, the effective rate is ${fmtPct(shortTermTax / amount)}.`,
    `At ${formattedAmount} in capital gains, a single filer with no other income pays ${formattedTax}, keeping ${fmt(netProceeds)}.`,
    isLongTerm
      ? `The same gain taxed short-term would cost ${fmt(shortTermTax)} — ${fmt(shortTermTax - longTermTax)} more.`
      : `The same gain held over a year would qualify for long-term rates — saving ${fmt(shortTermTax - longTermTax)}.`,
    `Married filing jointly filers stay at the 0% rate until gains exceed $94,050 in 2025.`,
  ]

  return {
    h1,
    metaTitle,
    metaDesc,
    gainAmount: amount,
    holdingPeriod: isLongTerm ? 'long-term' : 'short-term',
    taxBreakdown: {
      gainAmount: amount,
      longTermRate,
      taxOwed: longTermTax,
      netProceeds: amount - longTermTax,
      shortTermComparison: shortTermTax,
      isLongTerm,
    },
    comparisonTable,
    nearbyAmounts,
    keyFacts,
    relatedLinks: stdRelatedLinks([
      { title: 'Federal Income Tax', href: `/tax/federal-tax-${amount}-single`, icon: '🏛️' },
      { title: 'Capital Gains Tax Guide', href: '/tax/capital-gains-rates-2025', icon: '📋' },
    ]),
  }
}

// ─── Self-Employment Tax Page ────────────────────────────────────────────────

export function generateSETaxPage(amount: number): SETaxPage {
  const seTaxableAmount = amount * SE_DEDUCTIBLE_RATE

  // SS capped at wage base
  const ssTaxable = Math.min(seTaxableAmount, SS_WAGE_BASE_2025)
  const socialSecurityPortion = ssTaxable * 0.124
  const medicarePortion = seTaxableAmount * 0.029
  const selfEmploymentTax = socialSecurityPortion + medicarePortion

  // Deduct half of SE tax from income before federal income tax
  const deductibleHalf = selfEmploymentTax / 2
  const adjustedGrossIncome = amount - deductibleHalf
  const taxableIncome = Math.max(0, adjustedGrossIncome - STANDARD_DEDUCTION_2025.single)
  const federalIncomeTax = calcFederalTax(taxableIncome, 'single')

  const totalTax = selfEmploymentTax + federalIncomeTax
  const takeHome = amount - totalTax
  const effectiveRate = amount > 0 ? totalTax / amount : 0

  const formattedAmount = fmt(amount)
  const formattedTotal = fmt(totalTax)
  const formattedSE = fmt(selfEmploymentTax)

  const h1 = `Self-Employment Tax on ${formattedAmount} Net Earnings (2025)`
  const metaTitle = `Self-Employment Tax on ${formattedAmount} (2025) — Full Breakdown | Calchive`
  const metaDesc = `A self-employed person with ${formattedAmount} in net earnings owes ${formattedSE} in self-employment tax plus ${fmt(federalIncomeTax)} in federal income tax — ${fmtPct(effectiveRate)} combined effective rate.`

  const keyFacts: string[] = [
    `Self-employment tax covers both the employee and employer share of FICA — 12.4% Social Security + 2.9% Medicare = 15.3% total.`,
    `Only 92.35% of net earnings (${fmt(seTaxableAmount)}) are subject to SE tax; IRS allows this reduction to account for the employer half.`,
    `You can deduct half the SE tax (${fmt(deductibleHalf)}) from your gross income, reducing federal income tax.`,
    `Total tax of ${formattedTotal} on ${formattedAmount} leaves a take-home of ${fmt(takeHome)} — ${fmtPct(takeHome / amount)} of net earnings.`,
  ]

  const nearbyAmounts: NearbyAmountRow[] = buildNearbyAmounts(amount, a => `self-employment-tax-${a}`)

  return {
    h1,
    metaTitle,
    metaDesc,
    netEarnings: amount,
    taxBreakdown: {
      netEarnings: amount,
      seTaxableAmount,
      selfEmploymentTax,
      deductibleHalf,
      adjustedGrossIncome,
      federalIncomeTax,
      totalTax,
      effectiveRate,
      takeHome,
      socialSecurityPortion,
      medicarePortion,
    },
    nearbyAmounts,
    keyFacts,
    relatedLinks: stdRelatedLinks([
      { title: 'Self-Employment Tax Guide', href: '/tax/self-employment-tax-guide', icon: '📋' },
      { title: 'Quarterly Estimated Taxes', href: '/tax/quarterly-estimated-taxes-guide', icon: '📅' },
      { title: '1099 vs W-2 Guide', href: '/tax/w2-vs-1099-guide', icon: '📄' },
    ]),
  }
}

// ─── State Income Tax Page ────────────────────────────────────────────────────

export function generateStateTaxPage(stateSlug: string, amount: number): StateTaxPage {
  const stateData = getStateBySlug(stateSlug)

  // Default for states not in our database
  const stateName = stateData?.name ?? stateSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const hasStateTax = stateData?.hasIncomeTax ?? false

  // Calculate state tax
  let stateTax = 0
  if (stateData && stateData.hasIncomeTax && stateData.incomeTaxBrackets.length > 0) {
    for (const bracket of stateData.incomeTaxBrackets) {
      if (amount <= bracket.min) break
      const taxable = Math.min(amount, bracket.max) - bracket.min
      stateTax += taxable * bracket.rate
    }
  }

  const stdDeduction = STANDARD_DEDUCTION_2025.single
  const taxableIncome = Math.max(0, amount - stdDeduction)
  const federalTax = calcFederalTax(taxableIncome, 'single')
  const { ss, medicare } = calcFICA(amount, 'single')

  const totalTax = federalTax + stateTax + ss + medicare
  const takeHome = amount - totalTax
  const effectiveRate = amount > 0 ? totalTax / amount : 0
  const stateEffectiveRate = amount > 0 ? stateTax / amount : 0

  const formattedAmount = fmt(amount)

  const h1 = hasStateTax
    ? `${stateName} Income Tax on ${formattedAmount} (2025)`
    : `${stateName} Income Tax on ${formattedAmount} — No State Income Tax (2025)`

  const metaTitle = `${stateName} Income Tax on ${formattedAmount} (2025) | Calchive`
  const metaDesc = hasStateTax
    ? `A ${formattedAmount} earner in ${stateName} pays ${fmt(stateTax)} in state income tax and ${fmt(federalTax)} federal — ${fmtPct(effectiveRate)} total effective rate. Take-home: ${fmt(takeHome)}.`
    : `${stateName} has no state income tax. At ${formattedAmount}, you pay only federal taxes — ${fmt(federalTax)} — keeping ${fmt(takeHome)} after all taxes.`

  const keyFacts: string[] = hasStateTax
    ? [
        `${stateName} state income tax on ${formattedAmount} is ${fmt(stateTax)} — ${fmtPct(stateEffectiveRate)} of gross income.`,
        `Combined with federal taxes and FICA, total tax burden is ${fmt(totalTax)} (${fmtPct(effectiveRate)}).`,
        `Take-home pay is ${fmt(takeHome)}, or ${fmt(takeHome / 12)} per month.`,
        stateData?.localTaxNote ?? `See your county or city for any local income taxes that may apply.`,
      ]
    : [
        `${stateName} levies no state income tax on wages — one of nine US states with this advantage.`,
        `At ${formattedAmount}, federal income tax is ${fmt(federalTax)} (${fmtPct(federalTax / amount)} effective rate).`,
        `FICA adds ${fmt(ss + medicare)} (Social Security + Medicare), bringing total tax to ${fmt(federalTax + ss + medicare)}.`,
        `Take-home is ${fmt(takeHome)} — ${fmtPct(takeHome / amount)} of gross pay.`,
      ]

  const comparisonTable: FilingStatusRow[] = buildFilingComparison(amount)

  const nearbyAmounts: NearbyAmountRow[] = buildNearbyAmounts(amount, a => `${stateSlug}-income-tax-${a}`)

  return {
    h1,
    metaTitle,
    metaDesc,
    grossIncome: amount,
    stateName,
    stateSlug,
    hasStateTax,
    stateTaxBreakdown: {
      grossIncome: amount,
      federalTax,
      stateTax,
      ficaSocialSecurity: ss,
      ficaMedicare: medicare,
      totalTax,
      effectiveRate,
      takeHome,
      stateEffectiveRate,
    },
    comparisonTable,
    nearbyAmounts,
    keyFacts,
    relatedLinks: stdRelatedLinks([
      { title: `${stateName} Salary Calculator`, href: `/salary/${stateSlug}/100000`, icon: '💰' },
      { title: 'Federal Tax Breakdown', href: `/tax/federal-tax-${amount}-single`, icon: '🏛️' },
    ]),
  }
}

// ─── Tax Guide Pages ──────────────────────────────────────────────────────────

export function generateTaxGuidePage(topic: string): TaxGuidePage {
  const guides: Record<string, TaxGuidePage> = {
    'tax-brackets-2025': {
      h1: '2025 Federal Income Tax Brackets — Rates by Filing Status',
      metaTitle: '2025 Federal Tax Brackets: Rates, Thresholds & How They Work | Calchive',
      metaDesc: 'The 2025 federal income tax brackets run from 10% to 37%. Single filers hit the 22% bracket at $48,475. See full tables for all four filing statuses.',
      sections: [
        {
          heading: 'How Tax Brackets Work',
          body: 'The US uses a progressive tax system — each bracket rate applies only to income within that bracket\'s range, not to all income. A single filer earning $80,000 in 2025 pays 10% on the first $11,925, 12% on the next $36,550, and 22% on the remaining $18,075 above $48,475. The result: $13,561 in federal income tax, not 22% × $80,000.',
        },
        {
          heading: '2025 Tax Brackets — Single Filers',
          body: 'Single filers face seven brackets in 2025. The 22% bracket covers taxable income from $48,475 to $103,350 — the range most median-income Americans occupy.',
          table: {
            headers: ['Tax Rate', 'Taxable Income', 'Tax on This Bracket'],
            rows: FEDERAL_BRACKETS_2025.single.map(b => [
              fmtPct(b.rate, 0),
              b.max === Infinity ? `Over $${b.min.toLocaleString()}` : `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}`,
              b.max === Infinity ? `${fmtPct(b.rate, 0)} of amount over $${b.min.toLocaleString()}` : `Up to $${((b.max - b.min) * b.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            ]),
          },
        },
        {
          heading: '2025 Tax Brackets — Married Filing Jointly',
          body: 'MFJ brackets are roughly double the single brackets, with the top 37% bracket starting at $751,600.',
          table: {
            headers: ['Tax Rate', 'Taxable Income'],
            rows: FEDERAL_BRACKETS_2025.married_jointly.map(b => [
              fmtPct(b.rate, 0),
              b.max === Infinity ? `Over $${b.min.toLocaleString()}` : `$${b.min.toLocaleString()} – $${b.max.toLocaleString()}`,
            ]),
          },
        },
      ],
      faq: [
        { q: 'What is the standard deduction for 2025?', a: 'The 2025 standard deduction is $15,000 for single filers and $30,000 for married filing jointly. Head of household filers deduct $22,500.' },
        { q: 'What bracket am I in if I earn $75,000 single?', a: 'At $75,000 gross income, your taxable income after the $15,000 standard deduction is $60,000. That puts you in the 22% bracket ($48,475–$103,350). Your actual federal income tax is about $9,381 — an effective rate of 12.5%.' },
        { q: 'Does earning more money put all my income in a higher bracket?', a: 'No. Only the income above each bracket threshold moves to the higher rate. This is a common misconception. A raise that pushes you into the 24% bracket means only the portion above $103,350 (single) faces 24% — the rest stays at the lower rates.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Standard Deduction 2025', href: '/tax/standard-deduction-2025', icon: '📋' },
        { title: 'Capital Gains Rates 2025', href: '/tax/capital-gains-rates-2025', icon: '📈' },
      ]),
    },
    'standard-deduction-2025': {
      h1: '2025 Standard Deduction — Amounts by Filing Status',
      metaTitle: '2025 Standard Deduction: $15,000 Single, $30,000 Married | Calchive',
      metaDesc: 'The 2025 standard deduction is $15,000 for single filers, $30,000 for married filing jointly, and $22,500 for head of household. See when itemizing beats the standard deduction.',
      sections: [
        {
          heading: '2025 Standard Deduction by Filing Status',
          body: 'The IRS adjusts the standard deduction annually for inflation. In 2025, the amounts increased from 2024 levels.',
          table: {
            headers: ['Filing Status', '2025 Standard Deduction', '2024 Amount', 'Change'],
            rows: [
              ['Single', '$15,000', '$14,600', '+$400'],
              ['Married Filing Jointly', '$30,000', '$29,200', '+$800'],
              ['Married Filing Separately', '$15,000', '$14,600', '+$400'],
              ['Head of Household', '$22,500', '$21,900', '+$600'],
            ],
          },
        },
        {
          heading: 'Standard Deduction vs Itemizing',
          body: 'The standard deduction makes sense for most filers. You should itemize only if your deductible expenses — mortgage interest, state/local taxes (SALT, capped at $10,000), charitable contributions, and qualified medical expenses above 7.5% of AGI — exceed your standard deduction amount. For a married couple with a $400,000 mortgage at 6.5% interest (~$25,000 in year-one interest + $10,000 SALT cap), itemizing totals $35,000 — $5,000 more than the standard deduction.',
        },
      ],
      faq: [
        { q: 'Can I claim the standard deduction and some itemized deductions?', a: 'No — you must choose one or the other. You claim the larger amount. Most taxpayers (about 90%) use the standard deduction since the TCJA nearly doubled it in 2018.' },
        { q: 'Does the standard deduction change if I\'m over 65?', a: 'Yes. Taxpayers 65 or older add an extra $2,000 (single) or $1,600 per qualifying spouse (married) to their standard deduction in 2025.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: '2025 Tax Brackets', href: '/tax/tax-brackets-2025', icon: '📊' },
        { title: 'Tax Deductions Guide', href: '/tax/tax-deductions-guide', icon: '📋' },
      ]),
    },
    'capital-gains-rates-2025': {
      h1: '2025 Capital Gains Tax Rates — Long-Term and Short-Term',
      metaTitle: '2025 Capital Gains Tax Rates: 0%, 15%, 20% Thresholds | Calchive',
      metaDesc: 'Long-term capital gains in 2025 are taxed at 0%, 15%, or 20% depending on income. Single filers pay 0% up to $47,025 in gains. Full thresholds and examples inside.',
      sections: [
        {
          heading: 'Long-Term Capital Gains Rates (2025)',
          body: 'Assets held over 12 months qualify for preferential long-term rates — 0%, 15%, or 20% based on taxable income. These rates apply to the capital gain itself, not total income.',
          table: {
            headers: ['Rate', 'Single Filer Income', 'Married Filing Jointly Income'],
            rows: [
              ['0%', 'Up to $47,025', 'Up to $94,050'],
              ['15%', '$47,025 – $518,900', '$94,050 – $583,750'],
              ['20%', 'Over $518,900', 'Over $583,750'],
            ],
          },
        },
        {
          heading: 'Short-Term Capital Gains',
          body: 'Gains on assets held 12 months or less are taxed as ordinary income — the same rates as your W-2 wages, from 10% to 37%. A single filer with $100,000 in short-term gains (and no other income) pays about $17,400 in federal tax versus $7,500 for the same gain held long-term.',
        },
        {
          heading: 'Net Investment Income Tax (NIIT)',
          body: 'High earners also face the 3.8% Net Investment Income Tax on top of capital gains rates. The NIIT applies to investment income for taxpayers with modified AGI above $200,000 (single) or $250,000 (married jointly). This can push the effective rate on capital gains to 23.8% for high earners.',
        },
      ],
      faq: [
        { q: 'What counts as a long-term capital gain?', a: 'Any asset held for more than 12 months before selling qualifies for long-term treatment. This includes stocks, bonds, real estate, and cryptocurrency.' },
        { q: 'Are home sale gains subject to capital gains tax?', a: 'Usually not in full. The IRS allows single filers to exclude up to $250,000 in home sale gains ($500,000 for married couples) if the home was your primary residence for at least 2 of the last 5 years.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Capital Gains Calculator', href: '/tax/capital-gains-tax-50000-long-term', icon: '📈' },
        { title: '2025 Tax Brackets', href: '/tax/tax-brackets-2025', icon: '📊' },
      ]),
    },
    'self-employment-tax-guide': {
      h1: 'Self-Employment Tax Guide 2025 — Rates, Deductions & Calculator',
      metaTitle: 'Self-Employment Tax 2025: 15.3% Rate, Deductions & How to Pay | Calchive',
      metaDesc: 'Self-employed workers pay 15.3% self-employment tax (12.4% Social Security + 2.9% Medicare) on 92.35% of net earnings. Deduct half and pay quarterly to avoid penalties.',
      sections: [
        {
          heading: 'Self-Employment Tax Rate and Calculation',
          body: 'Self-employed individuals pay both the employee and employer halves of FICA taxes. The 2025 rate is 15.3%: 12.4% for Social Security (on income up to $176,100) and 2.9% for Medicare (no cap). However, you apply this rate to only 92.35% of net earnings — the IRS reduction approximates the employer\'s deduction on their half.',
        },
        {
          heading: 'Deducting Half of SE Tax',
          body: 'The IRS lets you deduct 50% of self-employment tax from gross income when calculating adjusted gross income (AGI). This deduction reduces your federal income tax but not the SE tax itself. On $80,000 in net earnings, SE tax is ~$11,304. You deduct ~$5,652, reducing your federal taxable income to ~$59,348 after the standard deduction.',
        },
        {
          heading: 'Quarterly Estimated Tax Payments',
          body: 'Self-employed workers must pay quarterly estimated taxes or face underpayment penalties. Due dates: April 15, June 16, September 15, and January 15 (following year). Use Form 1040-ES to calculate and pay.',
        },
      ],
      faq: [
        { q: 'Do I pay self-employment tax on every dollar I earn?', a: 'No. SE tax applies only to 92.35% of net self-employment income. The Social Security portion (12.4%) also caps out once net earnings exceed $176,100 (2025 wage base).' },
        { q: 'Can I avoid SE tax with an S-corp?', a: 'Partially. S-corp owners pay themselves a "reasonable salary" subject to FICA, then take remaining profits as distributions not subject to SE tax. The IRS scrutinizes below-market salaries.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'SE Tax Calculator $60k', href: '/tax/self-employment-tax-60000', icon: '🧾' },
        { title: 'Quarterly Taxes Guide', href: '/tax/quarterly-estimated-taxes-guide', icon: '📅' },
        { title: 'W-2 vs 1099', href: '/tax/w2-vs-1099-guide', icon: '📄' },
      ]),
    },
    'fica-tax-2025': {
      h1: 'FICA Tax 2025 — Social Security and Medicare Rates',
      metaTitle: 'FICA Tax 2025: Social Security 6.2% + Medicare 1.45% | Calchive',
      metaDesc: 'FICA tax in 2025 is 7.65% total: 6.2% Social Security (wage base $176,100) and 1.45% Medicare. High earners add 0.9% Additional Medicare Tax. See full breakdown.',
      sections: [
        {
          heading: '2025 FICA Tax Rates',
          body: 'FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare. Both employer and employee each pay half — 7.65% each, for a combined 15.3%.',
          table: {
            headers: ['Tax', 'Employee Rate', 'Employer Rate', '2025 Wage Base'],
            rows: [
              ['Social Security', '6.2%', '6.2%', '$176,100'],
              ['Medicare', '1.45%', '1.45%', 'No limit'],
              ['Additional Medicare', '0.9%', 'None', 'Over $200k (single)'],
            ],
          },
        },
        {
          heading: 'Additional Medicare Tax',
          body: 'Single filers earning over $200,000 and married filers over $250,000 pay an extra 0.9% on wages above those thresholds. Employers don\'t match this — the full 0.9% is the employee\'s responsibility.',
        },
      ],
      faq: [
        { q: 'What is the FICA wage base for 2025?', a: 'The Social Security wage base is $176,100 for 2025 — meaning no Social Security tax on wages above that amount. Medicare has no wage base cap.' },
        { q: 'Do self-employed people pay FICA?', a: 'Yes, through the self-employment tax at the combined 15.3% rate (both halves). They pay this on 92.35% of net earnings, and can deduct half as a business expense.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Self-Employment Tax', href: '/tax/self-employment-tax-guide', icon: '🧾' },
        { title: '2025 Tax Brackets', href: '/tax/tax-brackets-2025', icon: '📊' },
      ]),
    },
    'tax-filing-deadlines-2025': {
      h1: '2025 Tax Filing Deadlines — Key Dates for Individuals and Businesses',
      metaTitle: '2025 Tax Deadlines: April 15, Extension Dates & Quarterly Due Dates | Calchive',
      metaDesc: 'The 2025 individual tax return deadline is April 15, 2026. Quarterly estimated tax payments are due April 15, June 16, September 15, and January 15. Extensions push the deadline to October 15.',
      sections: [
        {
          heading: '2025 Tax Year Filing Deadlines',
          body: 'The 2025 tax year runs January 1 – December 31, 2025. Returns are due in 2026.',
          table: {
            headers: ['Deadline', 'Date', 'What\'s Due'],
            rows: [
              ['Q4 2024 Estimated Tax', 'January 15, 2025', 'Final quarterly estimated payment for 2024'],
              ['Individual Return', 'April 15, 2026', 'Form 1040 (or extension Form 4868)'],
              ['Q1 2025 Estimated Tax', 'April 15, 2025', 'First quarter estimated payment'],
              ['Q2 2025 Estimated Tax', 'June 16, 2025', 'Second quarter estimated payment'],
              ['Q3 2025 Estimated Tax', 'September 15, 2025', 'Third quarter estimated payment'],
              ['Q4 2025 Estimated Tax', 'January 15, 2026', 'Fourth quarter estimated payment'],
              ['Extended Individual Return', 'October 15, 2026', 'If Form 4868 filed by April 15'],
            ],
          },
        },
      ],
      faq: [
        { q: 'Does filing an extension give me more time to pay?', a: 'No. An extension gives you 6 more months to file the paperwork, but taxes owed are still due by April 15. Paying late triggers interest and penalties on the unpaid balance.' },
        { q: 'What if April 15 falls on a weekend?', a: 'The deadline shifts to the next business day. If April 15 is a Saturday, the deadline becomes April 17 (Monday). Emancipation Day in Washington DC can also push the deadline a day.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Quarterly Taxes Guide', href: '/tax/quarterly-estimated-taxes-guide', icon: '📅' },
        { title: 'Self-Employment Tax', href: '/tax/self-employment-tax-guide', icon: '🧾' },
      ]),
    },
    'w2-vs-1099-guide': {
      h1: 'W-2 vs 1099: Tax Differences, Self-Employment Tax & Take-Home Pay',
      metaTitle: 'W-2 vs 1099 Tax Comparison 2025 — What You Actually Take Home | Calchive',
      metaDesc: 'A 1099 worker earning $80,000 pays ~$11,304 more in self-employment tax than a W-2 employee at the same gross. See the full tax cost comparison and break-even rate.',
      sections: [
        {
          heading: 'The Core Tax Difference',
          body: 'W-2 employees split FICA taxes 50/50 with their employer — each pays 7.65%. A 1099 contractor covers both halves: 15.3% self-employment tax on 92.35% of net earnings. On $80,000, that\'s $11,304 in extra tax that a W-2 worker doesn\'t pay directly.',
        },
        {
          heading: 'Break-Even Contractor Rate',
          body: 'To match the after-tax income of a $80,000 W-2 salary, a 1099 contractor needs roughly $87,000–$92,000 in gross billings (depending on business expenses). Most financial advisors suggest contractors charge 20–30% above equivalent W-2 rates to account for self-employment tax, lack of benefits, and retirement savings.',
        },
        {
          heading: '1099 Tax Advantages',
          body: 'Contractors can deduct legitimate business expenses before calculating SE tax: home office, equipment, health insurance premiums (self-employed health insurance deduction), and contributions to SEP-IRA or Solo 401(k) — up to $69,000 in 2025.',
        },
      ],
      faq: [
        { q: 'Do I have to pay estimated taxes as a 1099 worker?', a: 'Yes, if you expect to owe $1,000 or more in federal taxes for the year. Pay quarterly using Form 1040-ES to avoid underpayment penalties.' },
        { q: 'Can I deduct my health insurance as a 1099 contractor?', a: 'Yes — self-employed individuals can deduct 100% of health, dental, and vision insurance premiums for themselves and their families. This reduces AGI but not self-employment tax.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Self-Employment Tax $80k', href: '/tax/self-employment-tax-80000', icon: '🧾' },
        { title: 'SE Tax Guide', href: '/tax/self-employment-tax-guide', icon: '📋' },
      ]),
    },
    'quarterly-estimated-taxes-guide': {
      h1: 'Quarterly Estimated Taxes 2025 — How to Calculate and Pay',
      metaTitle: 'Quarterly Estimated Tax Payments 2025: Dates, Amounts & How to Pay | Calchive',
      metaDesc: 'Self-employed workers and investors must make quarterly estimated tax payments in 2025. Due April 15, June 16, September 15, and January 15. Learn how to calculate the right amount.',
      sections: [
        {
          heading: 'Who Must Pay Estimated Taxes',
          body: 'You generally must make quarterly payments if you expect to owe at least $1,000 in federal taxes for the year and your withholding won\'t cover at least 90% of your current-year tax or 100% of last year\'s tax (110% if AGI exceeded $150,000).',
        },
        {
          heading: 'How to Calculate Each Payment',
          body: 'The simplest safe-harbor method: pay 25% of last year\'s total tax liability each quarter. If your 2024 federal tax was $12,000, pay $3,000 per quarter in 2025. Alternatively, estimate your 2025 income, calculate the expected tax, and divide by four.',
        },
        {
          heading: 'How to Pay',
          body: 'Pay online at IRS Direct Pay (free), EFTPS (free, requires enrollment), or by check with Form 1040-ES. Direct Pay allows same-day payments. EFTPS supports scheduled future payments.',
        },
      ],
      faq: [
        { q: 'What happens if I miss a quarterly payment?', a: 'The IRS charges an underpayment penalty — typically the federal short-term rate + 3 percentage points, applied to the underpayment amount for the days late. In 2025, that\'s around 8% annualized.' },
        { q: 'Do I need to make quarterly payments if I have a W-2 job and side income?', a: 'Only if withholding from your W-2 doesn\'t cover the total tax on all income. You can also increase W-2 withholding (Form W-4) to cover the side income instead of making separate quarterly payments.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Self-Employment Tax', href: '/tax/self-employment-tax-guide', icon: '🧾' },
        { title: 'W-2 vs 1099 Guide', href: '/tax/w2-vs-1099-guide', icon: '📄' },
        { title: 'Tax Filing Deadlines', href: '/tax/tax-filing-deadlines-2025', icon: '📅' },
      ]),
    },
    'tax-deductions-guide': {
      h1: '2025 Tax Deductions — Biggest Write-Offs for Individuals',
      metaTitle: 'Tax Deductions 2025: Standard, Itemized & Above-the-Line | Calchive',
      metaDesc: 'The 2025 standard deduction is $15,000 (single) or $30,000 (married). Above-the-line deductions include student loan interest, IRA contributions, and SE health insurance. See what you can claim.',
      sections: [
        {
          heading: 'Above-the-Line Deductions (Anyone Can Claim)',
          body: 'These deductions reduce AGI regardless of whether you itemize or take the standard deduction.',
          table: {
            headers: ['Deduction', '2025 Limit'],
            rows: [
              ['Traditional IRA contribution', '$7,000 ($8,000 if 50+)'],
              ['HSA contribution (individual)', '$4,300'],
              ['HSA contribution (family)', '$8,550'],
              ['Student loan interest', '$2,500 (phases out above $85k AGI single)'],
              ['Self-employed health insurance', '100% of premiums'],
              ['Self-employment tax deduction', '50% of SE tax paid'],
              ['SEP-IRA contribution', 'Up to $69,000 (25% of net earnings)'],
            ],
          },
        },
        {
          heading: 'Common Itemized Deductions',
          body: 'Itemizing makes sense only if total deductions exceed your standard deduction. The SALT deduction (state and local taxes) is capped at $10,000 — a major limitation for high-tax state residents.',
        },
      ],
      faq: [
        { q: 'Can I deduct my home office?', a: 'Self-employed workers using a dedicated space regularly and exclusively for business can deduct home office expenses — either actual costs or $5 per square foot (up to 300 sq ft) using the simplified method.' },
        { q: 'Are 401(k) contributions tax deductible?', a: 'Traditional 401(k) contributions reduce your taxable income dollar-for-dollar. The 2025 employee contribution limit is $23,500 ($31,000 if 50+). Roth 401(k) contributions use after-tax dollars and are not deductible.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'HSA Tax Benefits', href: '/tax/hsa-tax-benefits-guide', icon: '🏥' },
        { title: '401(k) Tax Benefits', href: '/tax/401k-tax-benefits-guide', icon: '📈' },
        { title: 'Standard Deduction 2025', href: '/tax/standard-deduction-2025', icon: '📋' },
      ]),
    },
    'tax-credits-guide': {
      h1: '2025 Tax Credits — Biggest Dollar-for-Dollar Tax Reducers',
      metaTitle: '2025 Tax Credits: Child Tax Credit, EITC & Education Credits | Calchive',
      metaDesc: 'Tax credits reduce your tax bill dollar-for-dollar — more valuable than deductions. The 2025 Child Tax Credit is $2,000 per child. EITC reaches up to $7,830 for families.',
      sections: [
        {
          heading: 'High-Value Tax Credits for 2025',
          body: 'Unlike deductions that reduce taxable income, credits directly reduce the tax owed.',
          table: {
            headers: ['Credit', '2025 Maximum', 'Refundable?'],
            rows: [
              ['Child Tax Credit', '$2,000/child', 'Partially (up to $1,700)'],
              ['Earned Income Tax Credit (4+ children)', '$7,830', 'Yes'],
              ['Child and Dependent Care', '$3,000/$6,000', 'No'],
              ['American Opportunity Credit', '$2,500', 'Partially (40%)'],
              ['Lifetime Learning Credit', '$2,000', 'No'],
              ['Retirement Savings (Saver\'s Credit)', '$2,000', 'No'],
              ['EV Tax Credit', '$7,500', 'No (transferable)'],
            ],
          },
        },
      ],
      faq: [
        { q: 'What is the difference between a refundable and non-refundable credit?', a: 'A non-refundable credit can only reduce your tax to zero — any excess is lost. A refundable credit can generate a refund even if you owe no tax. Partially refundable credits (like the Child Tax Credit) allow a portion to be refunded.' },
        { q: 'Who qualifies for the Earned Income Tax Credit?', a: 'Workers with earned income below certain thresholds. In 2025, the income limit is $59,899 (single, 3+ children). The credit is zero for investment income above $11,600.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Tax Deductions Guide', href: '/tax/tax-deductions-guide', icon: '📋' },
        { title: '2025 Tax Brackets', href: '/tax/tax-brackets-2025', icon: '📊' },
      ]),
    },
    'backdoor-roth-guide': {
      h1: 'Backdoor Roth IRA 2025 — How It Works, Limits & Tax Impact',
      metaTitle: 'Backdoor Roth IRA 2025: Steps, Limits & Pro-Rata Rule Explained | Calchive',
      metaDesc: 'High earners above $165,000 (single) or $246,000 (married) can\'t contribute directly to a Roth IRA. The backdoor Roth allows after-tax Traditional IRA contributions followed by a Roth conversion.',
      sections: [
        {
          heading: 'What Is the Backdoor Roth?',
          body: 'A backdoor Roth IRA is a two-step process: (1) contribute to a Traditional IRA using after-tax dollars (no deduction taken), then (2) convert that balance to a Roth IRA. Since no tax deduction was claimed, the conversion is generally tax-free — unless you have existing pre-tax IRA balances triggering the pro-rata rule.',
        },
        {
          heading: '2025 Income Limits and Contribution Limits',
          body: 'Direct Roth IRA contributions phase out at $150,000–$165,000 AGI (single) and $236,000–$246,000 (married jointly). The 2025 IRA contribution limit is $7,000 ($8,000 if 50+). Through the backdoor method, high earners can still get the full $7,000 into a Roth.',
        },
        {
          heading: 'The Pro-Rata Rule',
          body: 'If you have any existing pre-tax IRA balances (rollover IRAs, SEP-IRAs, SIMPLE IRAs), the IRS calculates the taxable portion of your conversion proportionally. If you have $93,000 pre-tax and $7,000 after-tax, converting $7,000 means only 7% is tax-free.',
        },
      ],
      faq: [
        { q: 'Is the backdoor Roth legal?', a: 'Yes — Congress has acknowledged and not prohibited the strategy, and the IRS has provided guidance on reporting it on Form 8606.' },
        { q: 'When should I convert after contributing?', a: 'Convert as soon as possible after the contribution to minimize potential investment gains, which would be taxable at conversion.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: '401(k) Tax Benefits', href: '/tax/401k-tax-benefits-guide', icon: '📈' },
        { title: 'HSA Tax Benefits', href: '/tax/hsa-tax-benefits-guide', icon: '🏥' },
        { title: 'Tax Deductions Guide', href: '/tax/tax-deductions-guide', icon: '📋' },
      ]),
    },
    '401k-tax-benefits-guide': {
      h1: '401(k) Tax Benefits 2025 — Contribution Limits & Tax Savings',
      metaTitle: '401(k) Tax Benefits 2025: $23,500 Limit, Roth vs Traditional | Calchive',
      metaDesc: 'A 401(k) contribution of $23,500 saves $5,170 in federal taxes for a 22% bracket earner. 2025 limits: $23,500 employee, $70,000 total. Roth vs Traditional comparison inside.',
      sections: [
        {
          heading: '2025 401(k) Contribution Limits',
          body: 'The IRS increased the 401(k) contribution limit for 2025.',
          table: {
            headers: ['Contribution Type', '2025 Limit', '2024 Limit'],
            rows: [
              ['Employee contribution (under 50)', '$23,500', '$23,000'],
              ['Catch-up contribution (50–59, 64+)', '+$7,500', '+$7,500'],
              ['Catch-up contribution (60–63)', '+$11,250', '+$7,500'],
              ['Total (employer + employee)', '$70,000', '$69,000'],
            ],
          },
        },
        {
          heading: 'Tax Savings by Bracket',
          body: 'Traditional 401(k) contributions reduce your taxable income. A $23,500 contribution saves different amounts depending on your marginal rate.',
          table: {
            headers: ['Tax Bracket', 'Federal Tax Saved on $23,500'],
            rows: [
              ['22%', '$5,170'],
              ['24%', '$5,640'],
              ['32%', '$7,520'],
              ['35%', '$8,225'],
              ['37%', '$8,695'],
            ],
          },
        },
      ],
      faq: [
        { q: 'Should I choose Traditional or Roth 401(k)?', a: 'If you expect to be in a higher tax bracket in retirement than now, Roth is better — pay tax now at a lower rate. If you\'re in a high bracket now and expect lower income in retirement, Traditional saves more.' },
        { q: 'What happens if I contribute too much to my 401(k)?', a: 'Excess contributions are taxed twice — once when contributed and again when withdrawn. Remove excess contributions (plus earnings) before April 15 to avoid the double tax.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'Backdoor Roth Guide', href: '/tax/backdoor-roth-guide', icon: '🔄' },
        { title: 'HSA Tax Benefits', href: '/tax/hsa-tax-benefits-guide', icon: '🏥' },
        { title: 'Tax Deductions Guide', href: '/tax/tax-deductions-guide', icon: '📋' },
      ]),
    },
    'hsa-tax-benefits-guide': {
      h1: 'HSA Tax Benefits 2025 — Triple Tax Advantage Explained',
      metaTitle: 'HSA Tax Benefits 2025: $4,300 Limit, Triple Tax Advantage | Calchive',
      metaDesc: 'HSAs offer a triple tax advantage: contributions are pre-tax, growth is tax-free, and withdrawals for medical expenses are tax-free. 2025 limits: $4,300 (individual), $8,550 (family).',
      sections: [
        {
          heading: '2025 HSA Contribution Limits',
          body: 'To contribute to an HSA, you must be enrolled in a High Deductible Health Plan (HDHP). The 2025 HDHP minimum deductible is $1,650 (individual) or $3,300 (family).',
          table: {
            headers: ['Coverage', '2025 Limit', '2024 Limit'],
            rows: [
              ['Individual (self-only)', '$4,300', '$4,150'],
              ['Family', '$8,550', '$8,300'],
              ['Catch-up (55+)', '+$1,000', '+$1,000'],
            ],
          },
        },
        {
          heading: 'Triple Tax Advantage',
          body: 'No other account offers three layers of tax benefit: (1) contributions are deductible — or pre-tax via payroll — (2) investment growth is tax-free, and (3) withdrawals for qualified medical expenses are completely tax-free. After age 65, you can withdraw for any purpose (taxed as ordinary income, like a Traditional IRA) without penalty.',
        },
      ],
      faq: [
        { q: 'Can I invest my HSA balance?', a: 'Yes, once your balance exceeds a threshold (typically $1,000–$2,000 depending on the provider), you can invest in mutual funds, ETFs, and other securities. The growth compounds tax-free.' },
        { q: 'What happens to unused HSA funds?', a: 'Unlike FSAs, HSA funds roll over indefinitely. There\'s no "use it or lose it" — you can accumulate a substantial balance for future medical expenses or retirement.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: '401(k) Tax Benefits', href: '/tax/401k-tax-benefits-guide', icon: '📈' },
        { title: 'Tax Deductions Guide', href: '/tax/tax-deductions-guide', icon: '📋' },
        { title: 'Tax Credits Guide', href: '/tax/tax-credits-guide', icon: '🎯' },
      ]),
    },
    'llc-tax-guide': {
      h1: 'LLC Taxes 2025 — How Single-Member and Multi-Member LLCs Are Taxed',
      metaTitle: 'LLC Tax Guide 2025: Single-Member, Partnership & S-Corp Election | Calchive',
      metaDesc: 'Single-member LLCs are taxed as sole proprietors (Schedule C) — all profits subject to 15.3% self-employment tax. Multi-member LLCs file as partnerships. S-corp election can reduce SE tax.',
      sections: [
        {
          heading: 'Default LLC Tax Treatment',
          body: 'The IRS ignores single-member LLCs for tax purposes — all income and expenses flow to your Schedule C. Every dollar of profit faces self-employment tax at 15.3% (on 92.35% of net earnings) plus ordinary income tax. Multi-member LLCs are taxed as partnerships by default, filing Form 1065.',
        },
        {
          heading: 'S-Corp Election to Reduce SE Tax',
          body: 'An LLC can elect S-corp tax treatment (Form 2553). The owner pays themselves a "reasonable salary" — subject to FICA at 15.3% combined — then takes remaining profits as distributions not subject to SE tax. On $150,000 net profit with a $90,000 reasonable salary, the S-corp saves roughly $9,180 in SE tax versus no election.',
        },
      ],
      faq: [
        { q: 'When does an S-corp election make sense for my LLC?', a: 'Generally when net profit consistently exceeds $40,000–$50,000 after paying yourself a market-rate salary. Below that, S-corp setup costs (payroll, extra tax filings) often exceed the savings.' },
        { q: 'Can my LLC deduct health insurance premiums?', a: 'Yes — sole proprietors and S-corp shareholders owning more than 2% can deduct health insurance premiums as an above-the-line deduction, reducing AGI.' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'S-Corp vs LLC Guide', href: '/tax/s-corp-vs-llc-taxes', icon: '🏢' },
        { title: 'Self-Employment Tax', href: '/tax/self-employment-tax-guide', icon: '🧾' },
        { title: 'Quarterly Taxes Guide', href: '/tax/quarterly-estimated-taxes-guide', icon: '📅' },
      ]),
    },
    's-corp-vs-llc-taxes': {
      h1: 'S-Corp vs LLC Taxes 2025 — Which Structure Saves More?',
      metaTitle: 'S-Corp vs LLC Tax Comparison 2025 — SE Tax Savings Calculator | Calchive',
      metaDesc: 'Comparing S-corp vs LLC taxes: an LLC owner earning $120,000 profit pays $16,956 in SE tax; an S-corp with $70,000 salary saves $7,650. S-corps win above ~$50k profit.',
      sections: [
        {
          heading: 'Side-by-Side Tax Comparison',
          body: 'Example: $120,000 net business profit for a single owner.',
          table: {
            headers: ['Item', 'LLC (Sole Prop)', 'LLC + S-Corp Election'],
            rows: [
              ['Net profit', '$120,000', '$120,000'],
              ['Owner salary', 'N/A', '$70,000'],
              ['FICA on salary (employer + employee)', 'N/A', '$10,710'],
              ['SE tax on full profit', '$16,956', 'N/A'],
              ['Remaining distributions', 'N/A', '$50,000 (no FICA)'],
              ['Annual FICA/SE tax saving', '—', '~$6,246'],
              ['Estimated additional S-corp costs', '—', '$1,500–$2,500/yr'],
              ['Net annual saving', '—', '~$3,750–$4,750'],
            ],
          },
        },
        {
          heading: 'When LLC Wins',
          body: 'Below $40,000 in net profit, S-corp costs (payroll processing, additional state filings, quarterly payroll taxes) often exceed the SE tax savings. The LLC simplicity also matters for businesses with irregular income or multiple owners.',
        },
      ],
      faq: [
        { q: 'What is a "reasonable salary" for S-corp purposes?', a: 'The IRS requires S-corp owners who provide services to pay themselves a salary comparable to what they\'d pay a non-owner employee doing the same work. The Bureau of Labor Statistics wage data for your occupation is often used as a benchmark.' },
        { q: 'Does an S-corp election affect my state taxes?', a: 'It varies by state. Some states don\'t recognize S-corp status and tax LLC income differently. California, for example, imposes an additional 1.5% S-corp franchise tax (minimum $800/year).' },
      ],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks([
        { title: 'LLC Tax Guide', href: '/tax/llc-tax-guide', icon: '🏢' },
        { title: 'Self-Employment Tax', href: '/tax/self-employment-tax-guide', icon: '🧾' },
        { title: 'SE Tax Calculator', href: '/tax/self-employment-tax-120000', icon: '🧮' },
      ]),
    },
  }

  const guide = guides[topic]
  if (!guide) {
    // Fallback for missing guides
    return {
      h1: `${topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — Tax Guide 2025`,
      metaTitle: `${topic.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} (2025) | Calchive`,
      metaDesc: `Complete guide to ${topic.replace(/-/g, ' ')} for 2025.`,
      sections: [],
      faq: [],
      jsonLdFaq: [],
      relatedLinks: stdRelatedLinks(),
    }
  }

  // Build jsonLdFaq from faq
  guide.jsonLdFaq = guide.faq
  return guide
}
