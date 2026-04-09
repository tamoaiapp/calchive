// 2025 IRS Federal Tax Data — real brackets and rates

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household'

export interface TaxBracket {
  min: number
  max: number
  rate: number
}

export const FEDERAL_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
  married_jointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23850, max: 96950, rate: 0.12 },
    { min: 96950, max: 206700, rate: 0.22 },
    { min: 206700, max: 394600, rate: 0.24 },
    { min: 394600, max: 501050, rate: 0.32 },
    { min: 501050, max: 751600, rate: 0.35 },
    { min: 751600, max: Infinity, rate: 0.37 },
  ],
  married_separately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11925, max: 48475, rate: 0.12 },
    { min: 48475, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250525, rate: 0.32 },
    { min: 250525, max: 375800, rate: 0.35 },
    { min: 375800, max: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17000, max: 64850, rate: 0.12 },
    { min: 64850, max: 103350, rate: 0.22 },
    { min: 103350, max: 197300, rate: 0.24 },
    { min: 197300, max: 250500, rate: 0.32 },
    { min: 250500, max: 626350, rate: 0.35 },
    { min: 626350, max: Infinity, rate: 0.37 },
  ],
}

export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  married_jointly: 30000,
  married_separately: 15000,
  head_of_household: 22500,
}

export interface CapitalGainsThresholds {
  rate0: number
  rate15: number
  rate20: number
}

export const CAPITAL_GAINS_RATES_2025: Record<string, CapitalGainsThresholds> = {
  single: { rate0: 47025, rate15: 518900, rate20: Infinity },
  married_jointly: { rate0: 94050, rate15: 583750, rate20: Infinity },
  married_separately: { rate0: 47025, rate15: 291850, rate20: Infinity },
  head_of_household: { rate0: 63000, rate15: 551350, rate20: Infinity },
}

// Self-employment tax constants
export const SE_TAX_RATE = 0.1530          // 15.3% total (12.4% SS + 2.9% Medicare)
export const SE_DEDUCTIBLE_RATE = 0.9235   // 92.35% of net earnings subject to SE tax
export const SS_WAGE_BASE_2025 = 176100    // Social Security wage base
export const ADDITIONAL_MEDICARE_RATE = 0.009  // 0.9% above $200k (single) / $250k (MFJ)

// FICA rates (employee share)
export const SS_EMPLOYEE_RATE = 0.062
export const MEDICARE_EMPLOYEE_RATE = 0.0145

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
  single: 'Single',
  married_jointly: 'Married Filing Jointly',
  married_separately: 'Married Filing Separately',
  head_of_household: 'Head of Household',
}

export const FILING_STATUS_SLUGS: Record<string, FilingStatus> = {
  single: 'single',
  'married-jointly': 'married_jointly',
  'married-separately': 'married_separately',
  'head-of-household': 'head_of_household',
}

// Core progressive tax calculator
export function calcFederalTax(taxableIncome: number, filing: FilingStatus): number {
  if (taxableIncome <= 0) return 0
  const brackets = FEDERAL_BRACKETS_2025[filing]
  let tax = 0
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min
    tax += taxable * bracket.rate
  }
  return tax
}

// Returns each bracket's contribution for breakdown display
export interface BracketContribution {
  rate: number
  taxableAmount: number
  taxPaid: number
  bracketMin: number
  bracketMax: number
}

export function calcBracketBreakdown(taxableIncome: number, filing: FilingStatus): BracketContribution[] {
  const brackets = FEDERAL_BRACKETS_2025[filing]
  const result: BracketContribution[] = []
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break
    const taxableAmount = Math.min(taxableIncome, bracket.max) - bracket.min
    result.push({
      rate: bracket.rate,
      taxableAmount,
      taxPaid: taxableAmount * bracket.rate,
      bracketMin: bracket.min,
      bracketMax: bracket.max,
    })
  }
  return result
}

export function getMarginalRate(taxableIncome: number, filing: FilingStatus): number {
  if (taxableIncome <= 0) return 0.10
  const brackets = FEDERAL_BRACKETS_2025[filing]
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > brackets[i].min) return brackets[i].rate
  }
  return 0.10
}

// Currency formatter
export function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

export function fmtPct(n: number, decimals = 2): string {
  return (n * 100).toFixed(decimals) + '%'
}

export function fmtNum(n: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(n))
}
