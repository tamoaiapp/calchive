import type { StateData } from './states'

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household'

export interface TaxBreakdown {
  grossAnnual: number
  federalIncomeTax: number
  stateIncomeTax: number
  socialSecurity: number
  medicare: number
  stateSDI: number
  totalTax: number
  effectiveRate: number
  netAnnual: number
  netMonthly: number
  netBiweekly: number
  netWeekly: number
  netHourly: number
  stateHasNoTax: boolean
  filingStatus: FilingStatus
}

// 2025 Federal Tax Brackets
const FEDERAL_BRACKETS: Record<FilingStatus, { max: number; rate: number }[]> = {
  single: [
    { max: 11925, rate: 0.10 },
    { max: 48475, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { max: 23850, rate: 0.10 },
    { max: 96950, rate: 0.12 },
    { max: 206700, rate: 0.22 },
    { max: 394600, rate: 0.24 },
    { max: 501050, rate: 0.32 },
    { max: 751600, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { max: 11925, rate: 0.10 },
    { max: 48475, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250525, rate: 0.32 },
    { max: 375800, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { max: 17000, rate: 0.10 },
    { max: 64850, rate: 0.12 },
    { max: 103350, rate: 0.22 },
    { max: 197300, rate: 0.24 },
    { max: 250500, rate: 0.32 },
    { max: 626350, rate: 0.35 },
    { max: Infinity, rate: 0.37 },
  ],
}

// 2025 Standard Deductions
const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 15000,
  married_jointly: 30000,
  married_separately: 15000,
  head_of_household: 22500,
}

// Social Security wage base 2025
const SS_WAGE_BASE = 176100

function calcProgressiveTax(
  income: number,
  brackets: { min: number; max: number; rate: number }[],
): number {
  let tax = 0
  for (const bracket of brackets) {
    if (income <= bracket.min) break
    const taxable = Math.min(income, bracket.max) - bracket.min
    tax += taxable * bracket.rate
  }
  return tax
}

function calcFederalBrackets(
  taxableIncome: number,
  filingStatus: FilingStatus,
): number {
  if (taxableIncome <= 0) return 0
  const brackets = FEDERAL_BRACKETS[filingStatus]
  let tax = 0
  let prev = 0
  for (const { max, rate } of brackets) {
    if (taxableIncome <= prev) break
    const taxable = Math.min(taxableIncome, max) - prev
    tax += taxable * rate
    prev = max
  }
  return tax
}

function calcStateTax(income: number, state: StateData): number {
  if (!state.hasIncomeTax || state.incomeTaxBrackets.length === 0) return 0
  // Normalize brackets to min/max format
  const brackets = state.incomeTaxBrackets
  return calcProgressiveTax(income, brackets)
}

export function calculateTakeHome(
  grossAnnual: number,
  state: StateData,
  filingStatus: FilingStatus,
): TaxBreakdown {
  // Federal income tax
  const standardDeduction = STANDARD_DEDUCTIONS[filingStatus]
  const federalTaxableIncome = Math.max(0, grossAnnual - standardDeduction)
  const federalIncomeTax = calcFederalBrackets(federalTaxableIncome, filingStatus)

  // State income tax (most states use gross or state-adjusted income; we simplify to gross)
  const stateIncomeTax = calcStateTax(grossAnnual, state)

  // FICA
  const ssTaxable = Math.min(grossAnnual, SS_WAGE_BASE)
  const socialSecurity = ssTaxable * 0.062
  const medicareBase = grossAnnual * 0.0145
  const medicareAdditional =
    filingStatus === 'married_jointly'
      ? Math.max(0, grossAnnual - 250000) * 0.009
      : Math.max(0, grossAnnual - 200000) * 0.009
  const medicare = medicareBase + medicareAdditional

  // State SDI (e.g., California)
  const stateSDI = state.stateSDI ? grossAnnual * state.stateSDI : 0

  const totalTax = federalIncomeTax + stateIncomeTax + socialSecurity + medicare + stateSDI
  const netAnnual = grossAnnual - totalTax
  const effectiveRate = grossAnnual > 0 ? totalTax / grossAnnual : 0

  return {
    grossAnnual,
    federalIncomeTax,
    stateIncomeTax,
    socialSecurity,
    medicare,
    stateSDI,
    totalTax,
    effectiveRate,
    netAnnual,
    netMonthly: netAnnual / 12,
    netBiweekly: netAnnual / 26,
    netWeekly: netAnnual / 52,
    netHourly: netAnnual / 2080,
    stateHasNoTax: !state.hasIncomeTax,
    filingStatus,
  }
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatPct(n: number): string {
  return (n * 100).toFixed(1) + '%'
}
