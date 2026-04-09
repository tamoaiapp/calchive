import { CONFORMING_LIMIT_2025, getPropertyTaxRate, getHomeInsurance } from './data'

export interface MortgageBreakdown {
  homePrice: number
  downPayment: number
  downPaymentPct: number
  loanAmount: number
  interestRate: number
  termYears: number
  monthlyPrincipalInterest: number
  monthlyPropertyTax: number
  monthlyInsurance: number
  monthlyPMI: number
  monthlyHOA: number
  totalMonthlyPayment: number
  totalPaid: number
  totalInterestPaid: number
  amortizationYear5: { balance: number; equityPct: number }
  amortizationYear10: { balance: number; equityPct: number }
  loanType: string
  isJumbo: boolean
  pmiEndDate: string
}

function monthlyPaymentFormula(principal: number, annualRate: number, termYears: number): number {
  if (annualRate === 0) return principal / (termYears * 12)
  const r = annualRate / 100 / 12
  const n = termYears * 12
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function getBalanceAtMonth(
  principal: number,
  annualRate: number,
  termYears: number,
  month: number
): number {
  if (annualRate === 0) {
    const monthlyPayment = principal / (termYears * 12)
    return Math.max(0, principal - monthlyPayment * month)
  }
  const r = annualRate / 100 / 12
  const n = termYears * 12
  const payment = monthlyPaymentFormula(principal, annualRate, termYears)
  return principal * Math.pow(1 + r, month) - payment * (Math.pow(1 + r, month) - 1) / r
}

function getPMIEndMonth(
  loanAmount: number,
  homePrice: number,
  annualRate: number,
  termYears: number
): number {
  const targetBalance = homePrice * 0.80
  for (let m = 1; m <= termYears * 12; m++) {
    if (getBalanceAtMonth(loanAmount, annualRate, termYears, m) <= targetBalance) {
      return m
    }
  }
  return termYears * 12
}

function formatPMIEndDate(startYear: number, monthOffset: number): string {
  const date = new Date(startYear, 0, 1)
  date.setMonth(date.getMonth() + monthOffset)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function calculateMortgage(
  homePrice: number,
  downPaymentPct: number,
  interestRate: number,
  termYears: number,
  state: string,
  monthlyHOA = 0
): MortgageBreakdown {
  const downPayment = homePrice * (downPaymentPct / 100)
  const loanAmount = homePrice - downPayment

  const isJumbo = loanAmount > CONFORMING_LIMIT_2025
  let loanType = 'Conventional'
  if (isJumbo) loanType = 'Jumbo'
  else if (downPaymentPct < 3.5) loanType = 'VA'
  else if (downPaymentPct < 20) loanType = 'Conventional'

  const monthlyPI = monthlyPaymentFormula(loanAmount, interestRate, termYears)

  const propTaxRate = getPropertyTaxRate(state)
  const monthlyPropertyTax = (homePrice * propTaxRate) / 12

  const annualInsurance = getHomeInsurance(state)
  const monthlyInsurance = annualInsurance / 12

  // PMI: ~0.5% of loan per year if down < 20%
  const hasPMI = downPaymentPct < 20
  const monthlyPMI = hasPMI ? (loanAmount * 0.005) / 12 : 0

  const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA

  const totalPaid = monthlyPI * termYears * 12
  const totalInterestPaid = totalPaid - loanAmount

  const balance5 = getBalanceAtMonth(loanAmount, interestRate, termYears, 60)
  const balance10 = getBalanceAtMonth(loanAmount, interestRate, termYears, 120)

  const pmiEndMonth = hasPMI ? getPMIEndMonth(loanAmount, homePrice, interestRate, termYears) : 0
  const pmiEndDate = hasPMI ? formatPMIEndDate(2025, pmiEndMonth) : 'N/A'

  return {
    homePrice,
    downPayment,
    downPaymentPct,
    loanAmount,
    interestRate,
    termYears,
    monthlyPrincipalInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyPMI,
    monthlyHOA,
    totalMonthlyPayment,
    totalPaid,
    totalInterestPaid,
    amortizationYear5: {
      balance: Math.max(0, balance5),
      equityPct: Math.min(100, ((homePrice - Math.max(0, balance5)) / homePrice) * 100),
    },
    amortizationYear10: {
      balance: Math.max(0, balance10),
      equityPct: Math.min(100, ((homePrice - Math.max(0, balance10)) / homePrice) * 100),
    },
    loanType,
    isJumbo,
    pmiEndDate,
  }
}

export function formatUSD(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

export function formatUSDCents(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

export function formatPct(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`
}
