export interface LoanBreakdown {
  principal: number
  interestRate: number
  termMonths: number
  monthlyPayment: number
  totalPaid: number
  totalInterest: number
  effectiveAPR: number
  payoffDate: string
  amortizationMilestones: { month: number; balance: number; totalPaid: number }[]
}

export function calculateLoan(
  principal: number,
  annualRate: number,
  termMonths: number
): LoanBreakdown {
  const r = annualRate / 100 / 12
  let monthlyPayment: number

  if (r === 0) {
    monthlyPayment = principal / termMonths
  } else {
    monthlyPayment = principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1)
  }

  const totalPaid = monthlyPayment * termMonths
  const totalInterest = totalPaid - principal

  // Payoff date
  const now = new Date(2025, 0, 1)
  now.setMonth(now.getMonth() + termMonths)
  const payoffDate = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  // Amortization milestones — every 12 months + midpoint + end
  const milestoneMonths = new Set<number>()
  for (let m = 12; m <= termMonths; m += 12) {
    milestoneMonths.add(m)
  }
  milestoneMonths.add(Math.floor(termMonths / 2))
  milestoneMonths.add(termMonths)

  const sortedMonths = Array.from(milestoneMonths).filter(m => m > 0 && m <= termMonths).sort((a, b) => a - b)

  const amortizationMilestones = sortedMonths.map(month => {
    let balance: number
    if (r === 0) {
      balance = Math.max(0, principal - monthlyPayment * month)
    } else {
      balance = principal * Math.pow(1 + r, month) - monthlyPayment * (Math.pow(1 + r, month) - 1) / r
    }
    return {
      month,
      balance: Math.max(0, balance),
      totalPaid: monthlyPayment * month,
    }
  })

  return {
    principal,
    interestRate: annualRate,
    termMonths,
    monthlyPayment,
    totalPaid,
    totalInterest,
    effectiveAPR: annualRate,
    payoffDate,
    amortizationMilestones,
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
