import type { CalcConfig } from './types'
import { financeCalcs } from './calcs-finance'
import { taxCalcs } from './calcs-tax'
import { mortgageCalcs } from './calcs-mortgage'
import { loanCalcs } from './calcs-loan'
import { salaryCalcs } from './calcs-salary'
import { healthCalcs } from './calcs-health'
import { mathCalcs } from './calcs-math'
import { businessCalcs } from './calcs-business'
import { retirementCalcs } from './calcs-retirement'

export const ALL_CALCULATORS: CalcConfig[] = [
  ...financeCalcs,
  ...taxCalcs,
  ...mortgageCalcs,
  ...loanCalcs,
  ...salaryCalcs,
  ...healthCalcs,
  ...mathCalcs,
  ...businessCalcs,
  ...retirementCalcs,
]

export function getCalcBySlug(slug: string): CalcConfig | undefined {
  return ALL_CALCULATORS.find((c) => c.slug === slug)
}

export interface CalcCategory {
  slug: string
  name: string
  icon: string
  desc: string
}

export const CALC_CATEGORIES: CalcCategory[] = [
  {
    slug: 'finance',
    name: 'Finance & Investment',
    icon: '📈',
    desc: 'Compound interest, ROI, NPV, IRR, crypto, and portfolio calculators.',
  },
  {
    slug: 'tax',
    name: 'Tax',
    icon: '🧾',
    desc: 'Federal income tax, capital gains, self-employment, and deduction calculators.',
  },
  {
    slug: 'mortgage',
    name: 'Mortgage & Real Estate',
    icon: '🏠',
    desc: 'Mortgage payments, affordability, refinance, rent vs buy, and rental yield.',
  },
  {
    slug: 'loan',
    name: 'Loans & Debt',
    icon: '💳',
    desc: 'Personal, auto, student loan, credit card payoff, and debt consolidation.',
  },
  {
    slug: 'salary',
    name: 'Salary & Paycheck',
    icon: '💼',
    desc: 'Paycheck, take-home pay, overtime, raise, 401(k), and benefits calculators.',
  },
  {
    slug: 'health',
    name: 'Health & Fitness',
    icon: '❤️',
    desc: 'BMI, BMR, TDEE, calorie deficit, body fat, heart rate zones, and more.',
  },
  {
    slug: 'math',
    name: 'Math & Conversion',
    icon: '🔢',
    desc: 'Percentage, statistics, geometry, unit conversions, and algebra calculators.',
  },
  {
    slug: 'business',
    name: 'Business & SaaS',
    icon: '🏢',
    desc: 'CAC, LTV, MRR, burn rate, ROAS, conversion rate, and ecommerce metrics.',
  },
  {
    slug: 'retirement',
    name: 'Retirement',
    icon: '🏦',
    desc: 'IRA, 401(k), FIRE, Social Security, RMD, and safe withdrawal calculators.',
  },
]
