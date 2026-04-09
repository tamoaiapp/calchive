import type { CalcConfig } from './types'

export const retirementCalcs: CalcConfig[] = [
  {
    slug: 'retirement-savings-calculator',
    title: 'Retirement Savings Calculator',
    desc: 'Project how much you\'ll have at retirement based on current savings and contributions.',
    cat: 'retirement', icon: '🏦',
    fields: [
      { k: 'current', l: 'Current Savings ($)', t: 'num', p: '50000', min: 0 },
      { k: 'monthly', l: 'Monthly Contribution ($)', t: 'num', p: '500', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 30 },
      { k: 'years', l: 'Years Until Retirement', t: 'num', p: '30', min: 1, max: 50 },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const fv = v.current * Math.pow(1 + r, n) + v.monthly * (Math.pow(1 + r, n) - 1) / r
      const totalContrib = v.current + v.monthly * n
      const growth = fv - totalContrib
      return {
        primary: { value: fv, label: 'Projected Retirement Balance', fmt: 'usd' },
        details: [
          { l: 'Total Contributions', v: totalContrib, fmt: 'usd' },
          { l: 'Investment Growth', v: growth, fmt: 'usd' },
          { l: 'Monthly Contribution', v: v.monthly, fmt: 'usd' },
          { l: 'Years Invested', v: v.years, fmt: 'num' },
        ],
      }
    },
    about: 'A 30-year-old saving $500/month at 7% annual return with $50,000 already saved will accumulate roughly $1.2 million by age 60. Starting early is the most powerful lever — the same contributions begun at 40 yield only about $530,000. Employer 401(k) matches can supercharge this figure by tens of thousands of dollars.',
    related: ['401k-calculator', 'roth-ira-calculator', 'fire-calculator'],
  },
  {
    slug: 'retirement-income-calculator',
    title: 'Retirement Income Calculator',
    desc: 'Estimate how much monthly income your retirement nest egg can generate.',
    cat: 'retirement', icon: '💵',
    fields: [
      { k: 'balance', l: 'Retirement Balance ($)', t: 'num', p: '1000000', min: 0 },
      { k: 'rate', l: 'Annual Return in Retirement (%)', t: 'pct', p: '5', min: 0, max: 20 },
      { k: 'years', l: 'Years in Retirement', t: 'num', p: '25', min: 1, max: 50 },
      { k: 'inflation', l: 'Inflation Rate (%)', t: 'pct', p: '3', min: 0, max: 10 },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const monthly = v.balance * r / (1 - Math.pow(1 + r, -n))
      const realRate = (v.rate - v.inflation) / 100 / 12
      const realMonthly = realRate > 0 ? v.balance * realRate / (1 - Math.pow(1 + realRate, -n)) : v.balance / n
      const annual = monthly * 12
      return {
        primary: { value: monthly, label: 'Monthly Income', fmt: 'usd' },
        details: [
          { l: 'Annual Income', v: annual, fmt: 'usd' },
          { l: 'Inflation-Adjusted Monthly', v: realMonthly, fmt: 'usd' },
          { l: 'Withdrawal Rate', v: (annual / v.balance) * 100, fmt: 'pct' },
          { l: 'Years Covered', v: v.years, fmt: 'num' },
        ],
      }
    },
    about: 'A $1 million portfolio at 5% annual return sustains roughly $5,846/month for 25 years. After adjusting for 3% inflation, the real purchasing power equates to about $4,200 in today\'s dollars. Retirees who keep a portion in equities historically extend portfolio longevity versus holding cash.',
    related: ['4-percent-rule-calculator', 'retirement-withdrawal-calculator', 'safe-withdrawal-rate-calculator'],
  },
  {
    slug: 'ira-calculator',
    title: 'IRA Calculator',
    desc: 'Calculate how much your IRA contributions will grow over time.',
    cat: 'retirement', icon: '📊',
    fields: [
      { k: 'annual', l: 'Annual Contribution ($)', t: 'num', p: '7000', min: 0, max: 7000 },
      { k: 'current', l: 'Current IRA Balance ($)', t: 'num', p: '0', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
      { k: 'years', l: 'Years to Retirement', t: 'num', p: '30', min: 1, max: 50 },
    ],
    fn: (v) => {
      const r = v.rate / 100
      const fvCurrent = v.current * Math.pow(1 + r, v.years)
      const fvContribs = v.annual * (Math.pow(1 + r, v.years) - 1) / r * (1 + r)
      const total = fvCurrent + fvContribs
      const totalContrib = v.current + v.annual * v.years
      return {
        primary: { value: total, label: 'Projected IRA Balance', fmt: 'usd' },
        details: [
          { l: 'Total Contributions', v: totalContrib, fmt: 'usd' },
          { l: 'Investment Earnings', v: total - totalContrib, fmt: 'usd' },
          { l: '2024 Contribution Limit', v: 7000, fmt: 'usd' },
          { l: 'Catch-Up Limit (age 50+)', v: 8000, fmt: 'usd' },
        ],
      }
    },
    about: 'The 2024 IRA contribution limit is $7,000 ($8,000 if age 50 or older). Contributing the full $7,000 annually for 30 years at 7% return grows to approximately $694,000 — all sheltered from taxes until withdrawal. Traditional IRA contributions may be deductible depending on income and workplace plan participation.',
    related: ['roth-ira-calculator', 'traditional-vs-roth-ira-calculator', '401k-calculator'],
  },
  {
    slug: 'roth-ira-calculator',
    title: 'Roth IRA Calculator',
    desc: 'See how tax-free Roth IRA growth compounds over your career.',
    cat: 'retirement', icon: '🌱',
    fields: [
      { k: 'annual', l: 'Annual Contribution ($)', t: 'num', p: '7000', min: 0 },
      { k: 'current', l: 'Current Roth Balance ($)', t: 'num', p: '0', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '8', min: 0, max: 20 },
      { k: 'years', l: 'Years to Retirement', t: 'num', p: '30', min: 1, max: 50 },
      { k: 'taxRate', l: 'Current Tax Rate (%)', t: 'pct', p: '22', min: 0, max: 50 },
    ],
    fn: (v) => {
      const r = v.rate / 100
      const fv = v.current * Math.pow(1 + r, v.years) + v.annual * (Math.pow(1 + r, v.years) - 1) / r * (1 + r)
      const taxEquivalent = fv / (1 - v.taxRate / 100)
      const totalContrib = v.current + v.annual * v.years
      return {
        primary: { value: fv, label: 'Tax-Free Roth Balance', fmt: 'usd' },
        details: [
          { l: 'Traditional IRA Equivalent (pre-tax)', v: taxEquivalent, fmt: 'usd' },
          { l: 'Total Contributions', v: totalContrib, fmt: 'usd' },
          { l: 'Tax-Free Earnings', v: fv - totalContrib, fmt: 'usd' },
          { l: 'Tax Savings at Withdrawal', v: fv * (v.taxRate / 100), fmt: 'usd' },
        ],
      }
    },
    about: 'Roth IRA withdrawals in retirement are 100% tax-free, making them especially valuable when you expect your tax rate to be higher later. A 25-year-old contributing $7,000/year for 40 years at 8% accumulates over $1.9 million — all available tax-free after age 59½. Income limits apply: $161,000 for single filers and $240,000 for married filers in 2024.',
    related: ['traditional-vs-roth-ira-calculator', 'ira-calculator', 'roth-conversion-tax-calculator'],
  },
  {
    slug: 'traditional-vs-roth-ira-calculator',
    title: 'Traditional vs Roth IRA Calculator',
    desc: 'Compare after-tax outcomes between Traditional and Roth IRA strategies.',
    cat: 'retirement', icon: '⚖️',
    fields: [
      { k: 'annual', l: 'Annual Contribution ($)', t: 'num', p: '7000', min: 0 },
      { k: 'years', l: 'Years to Retirement', t: 'num', p: '30', min: 1, max: 50 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
      { k: 'taxNow', l: 'Current Tax Rate (%)', t: 'pct', p: '22', min: 0, max: 50 },
      { k: 'taxRetire', l: 'Retirement Tax Rate (%)', t: 'pct', p: '18', min: 0, max: 50 },
    ],
    fn: (v) => {
      const r = v.rate / 100
      const fv = v.annual * (Math.pow(1 + r, v.years) - 1) / r * (1 + r)
      const rothAfterTax = fv
      const tradAfterTax = fv * (1 - v.taxRetire / 100)
      const tradDeduction = v.annual * v.years * (v.taxNow / 100)
      const advantage = rothAfterTax - tradAfterTax
      return {
        primary: { value: advantage, label: 'Roth IRA Advantage', fmt: 'usd' },
        details: [
          { l: 'Roth IRA After-Tax Value', v: rothAfterTax, fmt: 'usd' },
          { l: 'Traditional IRA After-Tax Value', v: tradAfterTax, fmt: 'usd' },
          { l: 'Traditional Upfront Tax Savings', v: tradDeduction, fmt: 'usd' },
          { l: 'Projected Gross Balance', v: fv, fmt: 'usd' },
        ],
      }
    },
    about: 'Roth wins when your future tax rate exceeds your current rate; Traditional wins when the reverse is true. A person in the 22% bracket today who drops to 12% in retirement typically benefits from the Traditional deduction now. Most financial planners recommend hedging by using both account types to create tax diversification in retirement.',
    related: ['roth-ira-calculator', 'ira-calculator', 'roth-conversion-tax-calculator'],
  },
  {
    slug: '401k-calculator',
    title: '401(k) Calculator',
    desc: 'Project your 401(k) balance at retirement with employer match included.',
    cat: 'retirement', icon: '🏛️',
    fields: [
      { k: 'salary', l: 'Annual Salary ($)', t: 'num', p: '80000', min: 0 },
      { k: 'contrib', l: 'Your Contribution (%)', t: 'pct', p: '10', min: 0, max: 100 },
      { k: 'match', l: 'Employer Match (%)', t: 'pct', p: '50', min: 0, max: 100 },
      { k: 'matchCap', l: 'Match Cap (% of salary)', t: 'pct', p: '6', min: 0, max: 20 },
      { k: 'current', l: 'Current 401(k) Balance ($)', t: 'num', p: '25000', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
      { k: 'years', l: 'Years to Retirement', t: 'num', p: '25', min: 1, max: 50 },
    ],
    fn: (v) => {
      const yourAnnual = Math.min(v.salary * v.contrib / 100, 23000)
      const matchAnnual = v.salary * Math.min(v.contrib, v.matchCap) / 100 * (v.match / 100)
      const totalAnnual = yourAnnual + matchAnnual
      const r = v.rate / 100
      const fv = v.current * Math.pow(1 + r, v.years) + totalAnnual * (Math.pow(1 + r, v.years) - 1) / r
      return {
        primary: { value: fv, label: 'Projected 401(k) Balance', fmt: 'usd' },
        details: [
          { l: 'Your Annual Contribution', v: yourAnnual, fmt: 'usd' },
          { l: 'Employer Match (annual)', v: matchAnnual, fmt: 'usd' },
          { l: 'Total Annual Investment', v: totalAnnual, fmt: 'usd' },
          { l: '2024 Contribution Limit', v: 23000, fmt: 'usd' },
        ],
      }
    },
    about: 'The 2024 401(k) elective deferral limit is $23,000 ($30,500 with catch-up at age 50+). An employer that matches 50% up to 6% of salary on an $80,000 income adds $2,400/year — essentially a 3% guaranteed return before any market gains. Contributing at least enough to capture the full match is widely considered the highest-return financial move available to workers.',
    related: ['401k-employer-match-calculator', 'retirement-savings-calculator', '401k-contribution-calculator'],
  },
  {
    slug: 'pension-income-calculator',
    title: 'Pension Income Calculator',
    desc: 'Estimate your defined-benefit pension monthly payment at retirement.',
    cat: 'retirement', icon: '📜',
    fields: [
      { k: 'years', l: 'Years of Service', t: 'num', p: '25', min: 1, max: 50 },
      { k: 'salary', l: 'Final Average Salary ($)', t: 'num', p: '75000', min: 0 },
      { k: 'multiplier', l: 'Benefit Multiplier (%)', t: 'pct', p: '1.5', min: 0.5, max: 3 },
      { k: 'early', l: 'Early Retirement Reduction (%)', t: 'pct', p: '0', min: 0, max: 50 },
    ],
    fn: (v) => {
      const grossAnnual = v.years * v.salary * (v.multiplier / 100)
      const reduced = grossAnnual * (1 - v.early / 100)
      const monthly = reduced / 12
      const lifetime = monthly * 12 * 20
      return {
        primary: { value: monthly, label: 'Monthly Pension Payment', fmt: 'usd' },
        details: [
          { l: 'Annual Pension', v: reduced, fmt: 'usd' },
          { l: 'Replacement Rate', v: (reduced / v.salary) * 100, fmt: 'pct' },
          { l: 'Estimated 20-Year Lifetime Value', v: lifetime, fmt: 'usd' },
          { l: 'Early Retirement Reduction', v: v.early, fmt: 'pct' },
        ],
      }
    },
    about: 'Most public-sector pensions use a formula of years × final salary × multiplier (typically 1.5%–2.5%). A teacher with 30 years at a $65,000 final salary and 2% multiplier earns $39,000/year — replacing 60% of pre-retirement income. Taking early retirement at 55 vs 60 can permanently reduce benefits by 25%–35% depending on the plan rules.',
    related: ['social-security-benefits-calculator', 'retirement-income-calculator', 'retirement-savings-calculator'],
  },
  {
    slug: 'social-security-age-calculator',
    title: 'Social Security Age Calculator',
    desc: 'Compare Social Security benefits by claiming age from 62 to 70.',
    cat: 'retirement', icon: '🏛️',
    fields: [
      { k: 'pia', l: 'Full Retirement Benefit / PIA ($)', t: 'num', p: '2000', min: 0 },
      { k: 'fra', l: 'Full Retirement Age', t: 'sel', op: [['66','Age 66'],['66.5','Age 66 + 6 months'],['67','Age 67']] },
      { k: 'claimAge', l: 'Planned Claiming Age', t: 'num', p: '67', min: 62, max: 70 },
    ],
    fn: (v) => {
      const fra = v.fra
      const diff = v.claimAge - fra
      let factor: number
      if (diff < 0) {
        const monthsEarly = Math.abs(diff) * 12
        const reduce1 = Math.min(monthsEarly, 36) * (5 / 9 / 100)
        const reduce2 = Math.max(0, monthsEarly - 36) * (5 / 12 / 100)
        factor = 1 - reduce1 - reduce2
      } else {
        factor = 1 + diff * 0.08
      }
      const monthly = v.pia * factor
      const annual = monthly * 12
      return {
        primary: { value: monthly, label: 'Monthly Benefit at Claiming Age', fmt: 'usd' },
        details: [
          { l: 'Annual Benefit', v: annual, fmt: 'usd' },
          { l: 'Adjustment Factor', v: factor * 100, fmt: 'pct' },
          { l: 'PIA at Full Retirement Age', v: v.pia, fmt: 'usd' },
          { l: 'Benefit Change vs FRA', v: (factor - 1) * 100, fmt: 'pct' },
        ],
      }
    },
    about: 'Claiming Social Security at 62 permanently reduces benefits by up to 30% compared to full retirement age (67 for those born after 1960). Delaying to 70 increases benefits by 8% per year beyond FRA — a total 24% boost. The break-even point for delayed claiming is typically around age 80, making longevity the key variable in this decision.',
    related: ['social-security-break-even-calculator', 'social-security-benefits-calculator', 'retirement-income-calculator'],
  },
  {
    slug: 'social-security-break-even-calculator',
    title: 'Social Security Break-Even Calculator',
    desc: 'Find the age at which delaying Social Security benefits pays off.',
    cat: 'retirement', icon: '⚖️',
    fields: [
      { k: 'early', l: 'Benefit at Age 62 ($/month)', t: 'num', p: '1400', min: 0 },
      { k: 'late', l: 'Benefit at Age 70 ($/month)', t: 'num', p: '2480', min: 0 },
    ],
    fn: (v) => {
      const monthlyDiff = v.late - v.early
      const missedMonths = (70 - 62) * 12
      const missed = v.early * missedMonths
      const breakEvenMonths = monthlyDiff > 0 ? missed / monthlyDiff : 9999
      const breakEvenAge = 70 + breakEvenMonths / 12
      const lifetimeAt80early = v.early * (80 - 62) * 12
      const lifetimeAt80late = v.late * (80 - 70) * 12
      return {
        primary: { value: breakEvenAge, label: 'Break-Even Age', fmt: 'num' },
        details: [
          { l: 'Months to Break Even After Age 70', v: breakEvenMonths, fmt: 'num' },
          { l: 'Total at 80 (claim at 62)', v: lifetimeAt80early, fmt: 'usd' },
          { l: 'Total at 80 (claim at 70)', v: lifetimeAt80late, fmt: 'usd' },
          { l: 'Monthly Gain from Delay', v: monthlyDiff, fmt: 'usd' },
        ],
      }
    },
    about: 'The break-even age for claiming Social Security at 70 versus 62 typically falls between ages 78 and 82. If you live past your break-even age, delaying was mathematically advantageous. Americans reaching 65 have a 50% chance of living past 85, tilting the odds in favor of delay for many people — especially those in good health.',
    related: ['social-security-age-calculator', 'social-security-benefits-calculator', 'longevity-calculator'],
  },
  {
    slug: 'retirement-withdrawal-calculator',
    title: 'Retirement Withdrawal Calculator',
    desc: 'Determine how long your retirement savings will last at a given spending rate.',
    cat: 'retirement', icon: '💸',
    fields: [
      { k: 'balance', l: 'Starting Balance ($)', t: 'num', p: '800000', min: 0 },
      { k: 'monthly', l: 'Monthly Withdrawal ($)', t: 'num', p: '4000', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '5', min: 0, max: 20 },
      { k: 'inflation', l: 'Annual Inflation (%)', t: 'pct', p: '3', min: 0, max: 10 },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      let balance = v.balance
      let months = 0
      let withdrawal = v.monthly
      while (balance > 0 && months < 600) {
        balance = balance * (1 + r) - withdrawal
        if (balance < 0) balance = 0
        months++
        if (months % 12 === 0) withdrawal *= (1 + v.inflation / 100)
      }
      const years = months / 12
      const withdrawalRate = (v.monthly * 12 / v.balance) * 100
      return {
        primary: { value: years >= 50 ? 50 : years, label: years >= 50 ? 'Lasts 50+ Years' : 'Years Money Lasts', fmt: 'num' },
        details: [
          { l: 'Annual Withdrawal', v: v.monthly * 12, fmt: 'usd' },
          { l: 'Withdrawal Rate', v: withdrawalRate, fmt: 'pct' },
          { l: 'Monthly Withdrawal', v: v.monthly, fmt: 'usd' },
          { l: 'Starting Balance', v: v.balance, fmt: 'usd' },
        ],
      }
    },
    about: 'A $800,000 portfolio withdrawing $4,000/month ($48,000/year) depletes in roughly 24 years at 5% return with 3% inflation adjustments. Reducing withdrawals by just $500/month extends the portfolio to 35+ years. The 4% rule — spending 4% of the initial balance annually — has historically sustained a 30-year retirement in most market conditions.',
    related: ['4-percent-rule-calculator', 'retirement-income-calculator', 'safe-withdrawal-rate-calculator'],
  },
  {
    slug: '4-percent-rule-calculator',
    title: '4% Rule Calculator',
    desc: 'Calculate how much you need to retire safely using the classic 4% withdrawal rule.',
    cat: 'retirement', icon: '📐',
    fields: [
      { k: 'spending', l: 'Annual Retirement Spending ($)', t: 'num', p: '60000', min: 0 },
      { k: 'ss', l: 'Annual Social Security Income ($)', t: 'num', p: '20000', min: 0 },
      { k: 'pension', l: 'Annual Pension Income ($)', t: 'num', p: '0', min: 0 },
    ],
    fn: (v) => {
      const portfolioSpending = Math.max(v.spending - v.ss - v.pension, 0)
      const needed = portfolioSpending > 0 ? portfolioSpending / 0.04 : 0
      const conservative = portfolioSpending > 0 ? portfolioSpending / 0.033 : 0
      const aggressive = portfolioSpending > 0 ? portfolioSpending / 0.05 : 0
      return {
        primary: { value: needed, label: 'Portfolio Needed (4% Rule)', fmt: 'usd' },
        details: [
          { l: 'Spending Gap (from portfolio)', v: portfolioSpending, fmt: 'usd' },
          { l: 'Conservative Target (3.3%)', v: conservative, fmt: 'usd' },
          { l: 'Flexible Target (5%)', v: aggressive, fmt: 'usd' },
          { l: 'Monthly Portfolio Draw', v: portfolioSpending / 12, fmt: 'usd' },
        ],
      }
    },
    about: 'The 4% rule originated from the 1994 Trinity Study — researchers found that withdrawing 4% of a portfolio annually (inflation-adjusted) survived 30 years in virtually all historical US market scenarios. Retiring before 60 or planning a 40+ year retirement warrants a lower rate, around 3.3%. Social Security and pension income reduce the portfolio required dollar-for-dollar.',
    related: ['retirement-withdrawal-calculator', 'fire-calculator', 'safe-withdrawal-rate-calculator'],
  },
  {
    slug: 'required-minimum-distribution-calculator',
    title: 'Required Minimum Distribution (RMD) Calculator',
    desc: 'Calculate your annual RMD from traditional IRAs and 401(k)s.',
    cat: 'retirement', icon: '📅',
    fields: [
      { k: 'balance', l: 'Account Balance Dec 31 Prior Year ($)', t: 'num', p: '500000', min: 0 },
      { k: 'age', l: 'Your Age', t: 'num', p: '73', min: 72, max: 115 },
    ],
    fn: (v) => {
      // IRS Uniform Lifetime Table (key values)
      const table: Record<number, number> = {
        72: 27.4, 73: 26.5, 74: 25.5, 75: 24.6, 76: 23.7, 77: 22.9, 78: 22.0,
        79: 21.1, 80: 20.2, 81: 19.4, 82: 18.5, 83: 17.7, 84: 16.8, 85: 16.0,
        86: 15.2, 87: 14.4, 88: 13.7, 89: 12.9, 90: 12.2, 91: 11.5, 92: 10.8,
        93: 10.1, 94: 9.5, 95: 8.9, 96: 8.4, 97: 7.8, 98: 7.3, 99: 6.8, 100: 6.4,
      }
      const age = Math.round(v.age)
      const clampedAge = Math.min(Math.max(age, 72), 100)
      const divisor = table[clampedAge] ?? 6.4
      const rmd = v.balance / divisor
      const monthly = rmd / 12
      return {
        primary: { value: rmd, label: 'Annual RMD Amount', fmt: 'usd' },
        details: [
          { l: 'Monthly Distribution', v: monthly, fmt: 'usd' },
          { l: 'IRS Life Expectancy Factor', v: divisor, fmt: 'num' },
          { l: 'Withdrawal Rate', v: (rmd / v.balance) * 100, fmt: 'pct' },
          { l: 'RMD Start Age (SECURE 2.0)', v: 73, fmt: 'num' },
        ],
      }
    },
    about: 'SECURE 2.0 (2022) raised the RMD start age to 73 for those born between 1951 and 1959, and to 75 for those born in 1960 or later. Missing an RMD triggers a 25% penalty on the undistributed amount (reduced from 50% by SECURE 2.0). A $500,000 IRA at age 73 requires a $18,868 distribution — which counts as ordinary taxable income.',
    related: ['inherited-ira-calculator', '72t-distribution-calculator', 'ira-calculator'],
  },
  {
    slug: 'inherited-ira-calculator',
    title: 'Inherited IRA Calculator',
    desc: 'Calculate required distributions from an inherited IRA under the 10-year rule.',
    cat: 'retirement', icon: '📋',
    fields: [
      { k: 'balance', l: 'Inherited IRA Balance ($)', t: 'num', p: '200000', min: 0 },
      { k: 'rate', l: 'Expected Annual Return (%)', t: 'pct', p: '6', min: 0, max: 20 },
      { k: 'years', l: 'Years Remaining (max 10)', t: 'num', p: '10', min: 1, max: 10 },
      { k: 'taxRate', l: 'Your Tax Rate (%)', t: 'pct', p: '24', min: 0, max: 50 },
    ],
    fn: (v) => {
      const r = v.rate / 100
      let balance = v.balance
      let totalWithdrawn = 0
      const yrs = Math.round(v.years)
      for (let i = 0; i < yrs; i++) {
        balance *= (1 + r)
        const withdraw = balance / (yrs - i)
        totalWithdrawn += withdraw
        balance -= withdraw
      }
      const annualAvg = totalWithdrawn / yrs
      const taxCost = totalWithdrawn * (v.taxRate / 100)
      return {
        primary: { value: annualAvg, label: 'Average Annual Distribution', fmt: 'usd' },
        details: [
          { l: 'Total Distributed Over Period', v: totalWithdrawn, fmt: 'usd' },
          { l: 'Estimated Tax Cost', v: taxCost, fmt: 'usd' },
          { l: 'Annual Tax on Average Distribution', v: annualAvg * (v.taxRate / 100), fmt: 'usd' },
          { l: 'Distribution Rule', v: 10, fmt: 'num' },
        ],
      }
    },
    about: 'The SECURE Act (2020) eliminated the "stretch IRA" for most non-spouse beneficiaries, replacing it with a 10-year rule requiring full distribution by December 31 of the 10th year after the owner\'s death. Spreading withdrawals evenly minimizes tax bracket creep. Spouses, minor children, and disabled individuals are exempt from the 10-year rule.',
    related: ['required-minimum-distribution-calculator', 'ira-calculator', 'roth-ira-calculator'],
  },
  {
    slug: '72t-distribution-calculator',
    title: '72(t) Distribution Calculator',
    desc: 'Calculate penalty-free early IRA distributions using the 72(t) SEPP method.',
    cat: 'retirement', icon: '🔓',
    fields: [
      { k: 'balance', l: 'IRA Balance ($)', t: 'num', p: '400000', min: 0 },
      { k: 'age', l: 'Your Current Age', t: 'num', p: '50', min: 18, max: 59 },
      { k: 'rate', l: 'IRS Interest Rate % (120% AFR)', t: 'pct', p: '5', min: 0, max: 15 },
    ],
    fn: (v) => {
      const yearsTo59half = 59.5 - v.age
      const r = v.rate / 100 / 12
      const n = yearsTo59half * 12
      const monthly = v.balance * r / (1 - Math.pow(1 + r, -n))
      const annual = monthly * 12
      const totalDistributed = annual * yearsTo59half
      return {
        primary: { value: annual, label: 'Annual 72(t) Distribution', fmt: 'usd' },
        details: [
          { l: 'Monthly Distribution', v: monthly, fmt: 'usd' },
          { l: 'Years Until 59½', v: yearsTo59half, fmt: 'num' },
          { l: 'Total Distributions', v: totalDistributed, fmt: 'usd' },
          { l: 'No-Penalty Age', v: 59.5, fmt: 'num' },
        ],
      }
    },
    about: 'IRS Section 72(t) allows penalty-free withdrawals from IRAs before age 59½ using Substantially Equal Periodic Payments (SEPP). Payments must continue for the longer of 5 years or until age 59½ — stopping early triggers a 10% penalty on all prior distributions plus interest. The amortization method typically yields the highest annual payment and is calculated using an IRS-approved interest rate.',
    related: ['required-minimum-distribution-calculator', 'ira-calculator', 'retirement-withdrawal-calculator'],
  },
  {
    slug: 'annuity-income-calculator',
    title: 'Annuity Income Calculator',
    desc: 'Calculate monthly income from a fixed annuity purchase.',
    cat: 'retirement', icon: '📈',
    fields: [
      { k: 'premium', l: 'Annuity Premium ($)', t: 'num', p: '200000', min: 0 },
      { k: 'rate', l: 'Annuity Rate (%)', t: 'pct', p: '5.5', min: 0, max: 15 },
      { k: 'years', l: 'Payment Period (years)', t: 'num', p: '20', min: 1, max: 40 },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const monthly = v.premium * r / (1 - Math.pow(1 + r, -n))
      const totalPaid = monthly * n
      const interest = totalPaid - v.premium
      return {
        primary: { value: monthly, label: 'Monthly Annuity Payment', fmt: 'usd' },
        details: [
          { l: 'Annual Income', v: monthly * 12, fmt: 'usd' },
          { l: 'Total Payments', v: totalPaid, fmt: 'usd' },
          { l: 'Total Interest Earned', v: interest, fmt: 'usd' },
          { l: 'Payout Rate', v: (monthly * 12 / v.premium) * 100, fmt: 'pct' },
        ],
      }
    },
    about: 'Fixed annuities offer guaranteed income regardless of market performance — a $200,000 premium at 5.5% for 20 years pays about $1,368/month. Single-premium immediate annuities (SPIAs) typically pay 5%–7% annually for lifetime income, making them attractive for retirees concerned about longevity risk. However, annuities sacrifice flexibility — most have surrender charges for early cancellation.',
    related: ['retirement-income-calculator', 'pension-income-calculator', '4-percent-rule-calculator'],
  },
  {
    slug: 'longevity-calculator',
    title: 'Longevity Calculator',
    desc: 'Estimate life expectancy to better plan retirement income needs.',
    cat: 'retirement', icon: '⏳',
    fields: [
      { k: 'age', l: 'Current Age', t: 'num', p: '60', min: 18, max: 100 },
      { k: 'sex', l: 'Biological Sex', t: 'sel', op: [['0','Male'],['1','Female']] },
      { k: 'health', l: 'Health Status', t: 'sel', op: [['3','Excellent'],['1','Good'],['0','Fair'],[ '-3','Poor']] },
      { k: 'smoke', l: 'Smoker?', t: 'sel', op: [['0','No'],[ '-5','Yes']] },
      { k: 'exercise', l: 'Exercise Frequency', t: 'sel', op: [['2','Regularly (3+ days/wk)'],['0','Sometimes'],['-2','Rarely']] },
    ],
    fn: (v) => {
      const baseLE = v.sex === 1 ? 84.2 : 81.0
      const adjustment = v.health + v.smoke + v.exercise
      const estimatedLE = baseLE + adjustment
      const remainingYears = Math.max(estimatedLE - v.age, 1)
      return {
        primary: { value: estimatedLE, label: 'Estimated Life Expectancy', fmt: 'num' },
        details: [
          { l: 'Remaining Years', v: remainingYears, fmt: 'num' },
          { l: 'Plan Retirement Income For (years)', v: Math.max(remainingYears - 2, 1), fmt: 'num' },
          { l: 'SSA Average Life Expectancy', v: baseLE, fmt: 'num' },
          { l: 'Health & Lifestyle Adjustment (years)', v: adjustment, fmt: 'num' },
        ],
      }
    },
    about: 'The Social Security Administration\'s 2023 period life tables show average life expectancy of 81 years for men and 84 years for women at birth — but those who reach 65 can expect to live to 83 (men) or 85 (women). Non-smokers, regular exercisers, and those with excellent health can reasonably add 5–8 years to the average, making planning for 25–30 years of retirement income prudent.',
    related: ['social-security-break-even-calculator', 'retirement-withdrawal-calculator', 'retirement-income-calculator'],
  },
  {
    slug: 'retirement-budget-calculator',
    title: 'Retirement Budget Calculator',
    desc: 'Build a monthly retirement budget and estimate your income needs.',
    cat: 'retirement', icon: '🧮',
    fields: [
      { k: 'housing', l: 'Housing (rent/mortgage) ($)', t: 'num', p: '1500', min: 0 },
      { k: 'food', l: 'Food & Groceries ($)', t: 'num', p: '600', min: 0 },
      { k: 'healthcare', l: 'Healthcare & Insurance ($)', t: 'num', p: '800', min: 0 },
      { k: 'transport', l: 'Transportation ($)', t: 'num', p: '400', min: 0 },
      { k: 'leisure', l: 'Travel & Entertainment ($)', t: 'num', p: '500', min: 0 },
      { k: 'other', l: 'Other Expenses ($)', t: 'num', p: '300', min: 0 },
    ],
    fn: (v) => {
      const monthly = v.housing + v.food + v.healthcare + v.transport + v.leisure + v.other
      const annual = monthly * 12
      const neededPortfolio = monthly > 0 ? annual / 0.04 : 0
      const healthcarePct = monthly > 0 ? (v.healthcare / monthly) * 100 : 0
      return {
        primary: { value: monthly, label: 'Monthly Budget', fmt: 'usd' },
        details: [
          { l: 'Annual Expenses', v: annual, fmt: 'usd' },
          { l: 'Portfolio Needed (4% rule)', v: neededPortfolio, fmt: 'usd' },
          { l: 'Healthcare % of Budget', v: healthcarePct, fmt: 'pct' },
          { l: 'Housing % of Budget', v: monthly > 0 ? (v.housing / monthly) * 100 : 0, fmt: 'pct' },
        ],
      }
    },
    about: 'Fidelity estimates retirees need 55%–80% of pre-retirement income, but individual budgets vary widely. Healthcare is the fastest-growing expense in retirement — Fidelity projects the average 65-year-old couple will spend $315,000 on healthcare costs throughout retirement (2023). Retirees who pay off mortgages before retiring and eliminate commuting costs often find 60%–65% replacement sufficient.',
    related: ['retirement-income-calculator', '4-percent-rule-calculator', 'healthcare-in-retirement-calculator'],
  },
  {
    slug: 'healthcare-in-retirement-calculator',
    title: 'Healthcare in Retirement Calculator',
    desc: 'Estimate lifetime healthcare costs in retirement for planning purposes.',
    cat: 'retirement', icon: '🏥',
    fields: [
      { k: 'age', l: 'Retirement Age', t: 'num', p: '65', min: 50, max: 75 },
      { k: 'sex', l: 'Biological Sex', t: 'sel', op: [['0','Male'],['1','Female']] },
      { k: 'health', l: 'Health Status', t: 'sel', op: [['0.8','Excellent'],['1.0','Good'],['1.25','Fair/Poor']] },
    ],
    fn: (v) => {
      const lifeExpect = v.sex === 1 ? 85 : 83
      const years = Math.max(lifeExpect - v.age, 1)
      const baseCost = 157500
      const preMediacare = v.age < 65 ? (65 - v.age) * 12 * 800 : 0
      const totalEstimate = (baseCost * v.health) + preMediacare
      const annual = totalEstimate / years
      return {
        primary: { value: totalEstimate, label: 'Estimated Lifetime Healthcare Cost', fmt: 'usd' },
        details: [
          { l: 'Annual Average', v: annual, fmt: 'usd' },
          { l: 'Years in Retirement', v: years, fmt: 'num' },
          { l: 'Pre-Medicare Bridge Coverage Cost', v: preMediacare, fmt: 'usd' },
          { l: 'Fidelity 2023 Baseline (per person)', v: 157500, fmt: 'usd' },
        ],
      }
    },
    about: 'Fidelity\'s 2023 Retiree Healthcare Cost Estimate places average healthcare costs at $157,500 per person retiring at 65. Retiring before 65 adds the burden of bridge coverage — marketplace plans often cost $600–$1,000+/month depending on income and location. Long-term care insurance, dental, and vision costs are often overlooked and can add tens of thousands more over a multi-decade retirement.',
    related: ['retirement-budget-calculator', 'medicare-calculator', 'retirement-income-calculator'],
  },
  {
    slug: 'retirement-age-calculator',
    title: 'Retirement Age Calculator',
    desc: 'Find the earliest age you can retire given your savings rate and target.',
    cat: 'retirement', icon: '🎯',
    fields: [
      { k: 'income', l: 'Annual Income ($)', t: 'num', p: '100000', min: 0 },
      { k: 'savings', l: 'Annual Savings ($)', t: 'num', p: '20000', min: 0 },
      { k: 'current', l: 'Current Savings ($)', t: 'num', p: '100000', min: 0 },
      { k: 'target', l: 'Retirement Target ($)', t: 'num', p: '1500000', min: 0 },
      { k: 'currentAge', l: 'Current Age', t: 'num', p: '35', min: 18, max: 80 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const r = v.rate / 100
      let balance = v.current
      let years = 0
      while (balance < v.target && years < 80) {
        balance = balance * (1 + r) + v.savings
        years++
      }
      const retireAge = v.currentAge + years
      const savingsRate = v.income > 0 ? (v.savings / v.income) * 100 : 0
      return {
        primary: { value: retireAge, label: 'Estimated Retirement Age', fmt: 'num' },
        details: [
          { l: 'Years Until Retirement', v: years, fmt: 'num' },
          { l: 'Savings Rate', v: savingsRate, fmt: 'pct' },
          { l: 'Monthly Savings', v: v.savings / 12, fmt: 'usd' },
          { l: 'Target Portfolio', v: v.target, fmt: 'usd' },
        ],
      }
    },
    about: 'Mr. Money Mustache\'s seminal 2012 analysis showed that a 50% savings rate leads to retirement in about 17 years from zero savings. At a 25% rate, that extends to around 32 years. The relationship is nonlinear — each additional percentage point of savings rate reduces working years more when you\'re already saving 40%+ than when starting at 10%.',
    related: ['fire-calculator', 'retirement-savings-calculator', 'coast-fire-calculator'],
  },
  {
    slug: 'fire-calculator',
    title: 'FIRE Calculator',
    desc: 'Calculate your Financial Independence Retire Early number and timeline.',
    cat: 'retirement', icon: '🔥',
    fields: [
      { k: 'expenses', l: 'Annual Expenses in Retirement ($)', t: 'num', p: '50000', min: 0 },
      { k: 'current', l: 'Current Net Worth ($)', t: 'num', p: '100000', min: 0 },
      { k: 'savings', l: 'Annual Savings ($)', t: 'num', p: '40000', min: 0 },
      { k: 'rate', l: 'Expected Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const fireNumber = v.expenses * 25
      const r = v.rate / 100
      let balance = v.current
      let years = 0
      while (balance < fireNumber && years < 80) {
        balance = balance * (1 + r) + v.savings
        years++
      }
      const savingsRate = (v.savings + v.expenses) > 0 ? v.savings / (v.savings + v.expenses) * 100 : 0
      return {
        primary: { value: fireNumber, label: 'Your FIRE Number', fmt: 'usd' },
        details: [
          { l: 'Years to FIRE', v: years, fmt: 'num' },
          { l: 'Remaining to Save', v: Math.max(fireNumber - v.current, 0), fmt: 'usd' },
          { l: 'Savings Rate', v: savingsRate, fmt: 'pct' },
          { l: 'Current Progress', v: v.current / fireNumber * 100, fmt: 'pct' },
        ],
      }
    },
    about: 'The FIRE movement\'s core equation is simple: accumulate 25× your annual expenses (the inverse of the 4% withdrawal rule). Someone spending $50,000/year needs $1.25 million. A couple saving $40,000/year with $100,000 already invested at 7% can reach $1.25 million in roughly 14 years. FIRE practitioners often pursue lean or fat variants depending on lifestyle preferences.',
    related: ['coast-fire-calculator', 'lean-fire-calculator', '4-percent-rule-calculator'],
  },
  {
    slug: 'coast-fire-calculator',
    title: 'Coast FIRE Calculator',
    desc: 'Find how much you need now so your portfolio can grow to FIRE without more contributions.',
    cat: 'retirement', icon: '🏄',
    fields: [
      { k: 'fireNumber', l: 'Target FIRE Number ($)', t: 'num', p: '1250000', min: 0 },
      { k: 'retireAge', l: 'Target Retirement Age', t: 'num', p: '60', min: 30, max: 80 },
      { k: 'currentAge', l: 'Current Age', t: 'num', p: '35', min: 18, max: 60 },
      { k: 'rate', l: 'Expected Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const years = v.retireAge - v.currentAge
      const r = v.rate / 100
      const coastNumber = years > 0 ? v.fireNumber / Math.pow(1 + r, years) : v.fireNumber
      const growthMultiplier = years > 0 ? Math.pow(1 + r, years) : 1
      return {
        primary: { value: coastNumber, label: 'Coast FIRE Number', fmt: 'usd' },
        details: [
          { l: 'Years Until Retirement', v: years, fmt: 'num' },
          { l: 'Target FIRE Number', v: v.fireNumber, fmt: 'usd' },
          { l: 'Growth Multiplier', v: growthMultiplier, fmt: 'num' },
          { l: 'Annual Return Assumed', v: v.rate, fmt: 'pct' },
        ],
      }
    },
    about: 'Coast FIRE means accumulating enough today that — without adding another dollar — compound growth carries you to your full FIRE number by retirement. A 35-year-old targeting $1.25 million at 60 needs only $232,000 invested now at 7% to coast there. Once coasting, you only need income to cover current expenses, eliminating pressure to maximize savings.',
    related: ['fire-calculator', 'lean-fire-calculator', 'retirement-age-calculator'],
  },
  {
    slug: 'lean-fire-calculator',
    title: 'Lean FIRE Calculator',
    desc: 'Plan an early retirement on a frugal budget using the FIRE framework.',
    cat: 'retirement', icon: '🥗',
    fields: [
      { k: 'expenses', l: 'Lean Annual Expenses ($)', t: 'num', p: '30000', min: 0 },
      { k: 'current', l: 'Current Savings ($)', t: 'num', p: '80000', min: 0 },
      { k: 'savings', l: 'Annual Savings ($)', t: 'num', p: '30000', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const leanFireNumber = v.expenses * 25
      const r = v.rate / 100
      let balance = v.current
      let years = 0
      while (balance < leanFireNumber && years < 80) {
        balance = balance * (1 + r) + v.savings
        years++
      }
      return {
        primary: { value: leanFireNumber, label: 'Lean FIRE Number', fmt: 'usd' },
        details: [
          { l: 'Years to Lean FIRE', v: years, fmt: 'num' },
          { l: 'Monthly Budget', v: v.expenses / 12, fmt: 'usd' },
          { l: 'Annual 4% Withdrawal', v: v.expenses, fmt: 'usd' },
          { l: 'Current Progress', v: leanFireNumber > 0 ? (v.current / leanFireNumber) * 100 : 0, fmt: 'pct' },
        ],
      }
    },
    about: 'Lean FIRE targets a frugal retirement below $40,000/year, typically requiring a $750,000–$1,000,000 portfolio. It\'s popular among single people and those living in low cost-of-living areas or countries. Living on $30,000/year requires only a $750,000 nest egg — achievable in 10–15 years for high earners willing to make aggressive trade-offs.',
    related: ['fire-calculator', 'fat-fire-calculator', 'barista-fire-calculator'],
  },
  {
    slug: 'fat-fire-calculator',
    title: 'Fat FIRE Calculator',
    desc: 'Plan a comfortable early retirement with generous lifestyle spending.',
    cat: 'retirement', icon: '🥩',
    fields: [
      { k: 'expenses', l: 'Annual Lifestyle Expenses ($)', t: 'num', p: '120000', min: 0 },
      { k: 'current', l: 'Current Net Worth ($)', t: 'num', p: '500000', min: 0 },
      { k: 'savings', l: 'Annual Savings ($)', t: 'num', p: '100000', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const fatFireNumber = v.expenses * 25
      const r = v.rate / 100
      let balance = v.current
      let years = 0
      while (balance < fatFireNumber && years < 80) {
        balance = balance * (1 + r) + v.savings
        years++
      }
      const savingsRate = (v.savings + v.expenses) > 0 ? (v.savings / (v.savings + v.expenses)) * 100 : 0
      return {
        primary: { value: fatFireNumber, label: 'Fat FIRE Number', fmt: 'usd' },
        details: [
          { l: 'Years to Fat FIRE', v: years, fmt: 'num' },
          { l: 'Monthly Budget', v: v.expenses / 12, fmt: 'usd' },
          { l: 'Current Progress', v: fatFireNumber > 0 ? (v.current / fatFireNumber) * 100 : 0, fmt: 'pct' },
          { l: 'Annual Savings Rate', v: savingsRate, fmt: 'pct' },
        ],
      }
    },
    about: 'Fat FIRE targets $100,000+ in annual retirement spending, typically requiring $2.5 million or more. It allows for international travel, private schooling, and premium healthcare without financial stress. High earners in technology and finance often achieve fat FIRE in their 40s by combining a $150,000–$200,000 savings rate with equity compensation like RSUs and ISOs.',
    related: ['lean-fire-calculator', 'fire-calculator', 'barista-fire-calculator'],
  },
  {
    slug: 'barista-fire-calculator',
    title: 'Barista FIRE Calculator',
    desc: 'Find your target portfolio when working part-time covers some expenses.',
    cat: 'retirement', icon: '☕',
    fields: [
      { k: 'expenses', l: 'Total Annual Expenses ($)', t: 'num', p: '60000', min: 0 },
      { k: 'partTimeIncome', l: 'Annual Part-Time Income ($)', t: 'num', p: '20000', min: 0 },
      { k: 'rate', l: 'Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
      { k: 'current', l: 'Current Savings ($)', t: 'num', p: '200000', min: 0 },
      { k: 'savings', l: 'Annual Savings ($)', t: 'num', p: '30000', min: 0 },
    ],
    fn: (v) => {
      const portfolioNeeded = Math.max(v.expenses - v.partTimeIncome, 0) * 25
      const r = v.rate / 100
      let balance = v.current
      let years = 0
      while (balance < portfolioNeeded && years < 80) {
        balance = balance * (1 + r) + v.savings
        years++
      }
      const fullFireNumber = v.expenses * 25
      const reduction = fullFireNumber > 0 ? ((fullFireNumber - portfolioNeeded) / fullFireNumber) * 100 : 0
      return {
        primary: { value: portfolioNeeded, label: 'Barista FIRE Number', fmt: 'usd' },
        details: [
          { l: 'Years to Barista FIRE', v: years, fmt: 'num' },
          { l: 'Full FIRE Number', v: fullFireNumber, fmt: 'usd' },
          { l: 'Portfolio Reduction from Part-Time', v: reduction, fmt: 'pct' },
          { l: 'Monthly Part-Time Income Needed', v: v.partTimeIncome / 12, fmt: 'usd' },
        ],
      }
    },
    about: 'Barista FIRE (coined by The Fioneers) involves reaching partial financial independence while covering remaining expenses through part-time, low-stress work — often with benefits. Working 20 hours/week at $20/hour adds $20,800/year, potentially cutting your required portfolio from $1.5 million to $975,000 — a 35% reduction. Many Barista FIRE adherents continue investing even in semi-retirement, achieving full FIRE ahead of plan.',
    related: ['fire-calculator', 'lean-fire-calculator', 'retirement-age-calculator'],
  },
  {
    slug: 'sequence-of-returns-calculator',
    title: 'Sequence of Returns Risk Calculator',
    desc: 'See how poor early returns devastate a retirement portfolio versus good early returns.',
    cat: 'retirement', icon: '📉',
    fields: [
      { k: 'balance', l: 'Starting Balance ($)', t: 'num', p: '1000000', min: 0 },
      { k: 'withdrawal', l: 'Annual Withdrawal ($)', t: 'num', p: '40000', min: 0 },
      { k: 'avgReturn', l: 'Average Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
    ],
    fn: (v) => {
      const badYearReturn = (v.avgReturn - 15) / 100
      const goodYearReturn = (v.avgReturn + 5) / 100
      const normalReturn = v.avgReturn / 100
      const simulate = (badFirst: boolean) => {
        let bal = v.balance
        for (let i = 0; i < 30; i++) {
          let ret: number
          if (i < 5) ret = badFirst ? badYearReturn : goodYearReturn
          else if (i < 10) ret = badFirst ? goodYearReturn : badYearReturn
          else ret = normalReturn
          bal = bal * (1 + ret) - v.withdrawal
          if (bal <= 0) return 0
        }
        return Math.max(bal, 0)
      }
      const badSeq = simulate(true)
      const goodSeq = simulate(false)
      return {
        primary: { value: goodSeq - badSeq, label: 'Sequence Risk Difference (30 yr)', fmt: 'usd' },
        details: [
          { l: 'Balance at 30 Years (Bad Sequence)', v: badSeq, fmt: 'usd' },
          { l: 'Balance at 30 Years (Good Sequence)', v: goodSeq, fmt: 'usd' },
          { l: 'Annual Withdrawal', v: v.withdrawal, fmt: 'usd' },
          { l: 'Withdrawal Rate', v: v.balance > 0 ? (v.withdrawal / v.balance) * 100 : 0, fmt: 'pct' },
        ],
      }
    },
    about: 'Two portfolios with identical average returns but different timing can have radically different outcomes. Wade Pfau\'s research shows that retiring in 1966 (poor sequence) with a 4% withdrawal rate depleted portfolios by 1997, while retiring in 1975 (good sequence) with the same withdrawal left massive surpluses. The first decade of retirement largely determines success — leading retirees to reduce equity exposure early.',
    related: ['retirement-withdrawal-calculator', 'safe-withdrawal-rate-calculator', 'monte-carlo-retirement-calculator'],
  },
  {
    slug: 'monte-carlo-retirement-calculator',
    title: 'Monte Carlo Retirement Calculator',
    desc: 'Run simplified probability analysis on your retirement portfolio survival.',
    cat: 'retirement', icon: '🎲',
    fields: [
      { k: 'balance', l: 'Starting Balance ($)', t: 'num', p: '1000000', min: 0 },
      { k: 'withdrawal', l: 'Annual Withdrawal ($)', t: 'num', p: '40000', min: 0 },
      { k: 'avgReturn', l: 'Average Annual Return (%)', t: 'pct', p: '7', min: 0, max: 20 },
      { k: 'stdDev', l: 'Return Std Deviation (%)', t: 'pct', p: '12', min: 0, max: 30 },
      { k: 'years', l: 'Retirement Duration (years)', t: 'num', p: '30', min: 10, max: 50 },
    ],
    fn: (v) => {
      const simulations = 500
      let successes = 0
      for (let s = 0; s < simulations; s++) {
        let bal = v.balance
        let survived = true
        for (let y = 0; y < v.years; y++) {
          const u1 = Math.random()
          const u2 = Math.random()
          const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2)
          const annualReturn = (v.avgReturn + z * v.stdDev) / 100
          bal = bal * (1 + annualReturn) - v.withdrawal
          if (bal <= 0) { survived = false; break }
        }
        if (survived) successes++
      }
      const successRate = (successes / simulations) * 100
      const withdrawalRate = v.balance > 0 ? (v.withdrawal / v.balance) * 100 : 0
      return {
        primary: { value: successRate, label: 'Portfolio Survival Probability', fmt: 'pct' },
        details: [
          { l: 'Successful Simulations', v: successes, fmt: 'num' },
          { l: 'Total Simulations', v: simulations, fmt: 'num' },
          { l: 'Withdrawal Rate', v: withdrawalRate, fmt: 'pct' },
          { l: 'Considered Safe (>85% success)', v: successRate >= 85 ? 1 : 0, fmt: 'num' },
        ],
      }
    },
    about: 'Monte Carlo simulation runs thousands of random return sequences to estimate the probability a portfolio survives retirement. Vanguard and Fidelity both use similar methods internally — a 90%+ success rate at a given withdrawal rate is typically considered comfortable. The 4% rule shows roughly 87%–95% success in most Monte Carlo models using historical equity/bond return parameters.',
    related: ['sequence-of-returns-calculator', 'safe-withdrawal-rate-calculator', 'retirement-withdrawal-calculator'],
  },
  {
    slug: 'withdrawal-rate-calculator',
    title: 'Withdrawal Rate Calculator',
    desc: 'Calculate the percentage of your portfolio you\'ll withdraw annually in retirement.',
    cat: 'retirement', icon: '📊',
    fields: [
      { k: 'balance', l: 'Portfolio Balance ($)', t: 'num', p: '1200000', min: 0 },
      { k: 'annual', l: 'Annual Spending Need ($)', t: 'num', p: '48000', min: 0 },
      { k: 'ss', l: 'Annual Social Security ($)', t: 'num', p: '18000', min: 0 },
      { k: 'other', l: 'Other Annual Income ($)', t: 'num', p: '0', min: 0 },
    ],
    fn: (v) => {
      const portfolioNeeded = Math.max(v.annual - v.ss - v.other, 0)
      const rate = v.balance > 0 ? (portfolioNeeded / v.balance) * 100 : 0
      const yearsAtRate = portfolioNeeded > 0 ? v.balance / portfolioNeeded : 999
      return {
        primary: { value: rate, label: 'Withdrawal Rate', fmt: 'pct' },
        details: [
          { l: 'Portfolio Annual Draw', v: portfolioNeeded, fmt: 'usd' },
          { l: 'Simple Years of Funding (no growth)', v: Math.min(yearsAtRate, 999), fmt: 'num' },
          { l: 'Income from Non-Portfolio Sources', v: v.ss + v.other, fmt: 'usd' },
          { l: 'Safe Benchmark', v: 4, fmt: 'pct' },
        ],
      }
    },
    about: 'Financial researchers generally consider withdrawal rates below 4% safe for 30-year retirements based on historical US market data. Rates above 5% carry meaningful depletion risk, especially if a market downturn hits in the first five years. Incorporating Social Security income dramatically reduces the required portfolio withdrawal rate — an $18,000/year benefit cuts needed portfolio draws by $450,000 using the 4% rule.',
    related: ['safe-withdrawal-rate-calculator', '4-percent-rule-calculator', 'retirement-income-calculator'],
  },
  {
    slug: 'safe-withdrawal-rate-calculator',
    title: 'Safe Withdrawal Rate Calculator',
    desc: 'Find the withdrawal rate that historically survives your target retirement period.',
    cat: 'retirement', icon: '🛡️',
    fields: [
      { k: 'years', l: 'Retirement Duration (years)', t: 'num', p: '30', min: 10, max: 50 },
      { k: 'stocks', l: 'Stock Allocation (%)', t: 'pct', p: '60', min: 0, max: 100 },
      { k: 'balance', l: 'Portfolio Balance ($)', t: 'num', p: '1000000', min: 0 },
    ],
    fn: (v) => {
      // Based on Bengen/Trinity study historical safe withdrawal rates
      const baseRate = 4.5
      const durationAdj = (v.years - 30) * -0.05
      const stockAdj = (v.stocks - 60) * 0.01
      const swr = Math.min(Math.max(baseRate + durationAdj + stockAdj, 2.5), 6)
      const maxAnnual = v.balance * (swr / 100)
      const maxMonthly = maxAnnual / 12
      return {
        primary: { value: swr, label: 'Safe Withdrawal Rate', fmt: 'pct' },
        details: [
          { l: 'Maximum Annual Withdrawal', v: maxAnnual, fmt: 'usd' },
          { l: 'Maximum Monthly Withdrawal', v: maxMonthly, fmt: 'usd' },
          { l: 'Retirement Duration', v: v.years, fmt: 'num' },
          { l: 'Stock Allocation', v: v.stocks, fmt: 'pct' },
        ],
      }
    },
    about: 'William Bengen\'s 1994 SAFEMAX research established 4.1% as the highest withdrawal rate that survived all 30-year US market periods going back to 1926. Higher stock allocations (60%–75%) slightly improve outcomes, while very conservative portfolios (20% stocks) reduce the safe rate below 3.5%. For 40-year retirements, researchers like Michael Kitces suggest 3.5% as a more appropriate anchor.',
    related: ['4-percent-rule-calculator', 'monte-carlo-retirement-calculator', 'withdrawal-rate-calculator'],
  },
  {
    slug: 'medicare-calculator',
    title: 'Medicare Cost Calculator',
    desc: 'Estimate your Medicare Part B and Part D premiums based on income.',
    cat: 'retirement', icon: '🏥',
    fields: [
      { k: 'magi', l: 'Modified AGI 2 Years Prior ($)', t: 'num', p: '100000', min: 0 },
      { k: 'status', l: 'Filing Status', t: 'sel', op: [['0','Single / MFS'],['1','Married Filing Jointly']] },
    ],
    fn: (v) => {
      // 2024 Medicare Part B IRMAA brackets
      type Bracket = { limit: number; partB: number; partD: number }
      const brackets: Bracket[] = v.status === 1
        ? [
          { limit: 206000, partB: 174.70, partD: 0 },
          { limit: 258000, partB: 244.60, partD: 12.90 },
          { limit: 334000, partB: 349.40, partD: 33.30 },
          { limit: 750000, partB: 454.20, partD: 53.80 },
          { limit: Infinity, partB: 559.00, partD: 74.20 },
        ]
        : [
          { limit: 103000, partB: 174.70, partD: 0 },
          { limit: 129000, partB: 244.60, partD: 12.90 },
          { limit: 161000, partB: 349.40, partD: 33.30 },
          { limit: 500000, partB: 454.20, partD: 53.80 },
          { limit: Infinity, partB: 559.00, partD: 74.20 },
        ]
      const bracket = brackets.find(b => v.magi <= b.limit) ?? brackets[brackets.length - 1]
      const monthlyTotal = bracket.partB + bracket.partD
      const annual = monthlyTotal * 12
      return {
        primary: { value: monthlyTotal, label: 'Monthly Medicare Premium', fmt: 'usd' },
        details: [
          { l: 'Part B Monthly', v: bracket.partB, fmt: 'usd' },
          { l: 'Part D IRMAA Surcharge', v: bracket.partD, fmt: 'usd' },
          { l: 'Annual Medicare Cost', v: annual, fmt: 'usd' },
          { l: 'Standard Part B (2024)', v: 174.70, fmt: 'usd' },
        ],
      }
    },
    about: 'Medicare Part B standard premium for 2024 is $174.70/month, but higher earners pay Income-Related Monthly Adjustment Amounts (IRMAA). Single filers earning over $103,000 in 2022 (used for 2024 premiums) pay up to $559/month — a $4,610 annual difference. Two-year lookback surprises many retirees who earned high incomes before retirement but expect standard premiums.',
    related: ['healthcare-in-retirement-calculator', 'retirement-budget-calculator', 'medicare-supplement-calculator'],
  },
  {
    slug: 'medicare-supplement-calculator',
    title: 'Medicare Supplement Calculator',
    desc: 'Compare Medigap plan costs and coverage to find your best option.',
    cat: 'retirement', icon: '📋',
    fields: [
      { k: 'age', l: 'Age at Medicare Enrollment', t: 'num', p: '65', min: 65, max: 90 },
      { k: 'health', l: 'Health Status for Rating', t: 'sel', op: [['0.85','Excellent'],['1.0','Good'],['1.3','Fair/Poor']] },
      { k: 'plan', l: 'Medigap Plan', t: 'sel', op: [['150','Plan G (most popular)'],['110','Plan N'],['180','Plan F (pre-2020)']] },
    ],
    fn: (v) => {
      const ageAdj = 1 + Math.max(0, v.age - 65) * 0.03
      const monthlyPremium = v.plan * v.health * ageAdj
      const annual = monthlyPremium * 12
      const deductible = v.plan === 110 ? 240 : 0
      const annualWithDeductible = annual + deductible
      return {
        primary: { value: monthlyPremium, label: 'Estimated Monthly Medigap Premium', fmt: 'usd' },
        details: [
          { l: 'Annual Premium', v: annual, fmt: 'usd' },
          { l: 'Annual Deductible (Plan N only)', v: deductible, fmt: 'usd' },
          { l: 'Total Annual Cost', v: annualWithDeductible, fmt: 'usd' },
          { l: 'Part B Deductible 2024', v: 240, fmt: 'usd' },
        ],
      }
    },
    about: 'Plan G is the most popular Medigap plan in 2024, covering all Medicare cost-sharing except the Part B deductible ($240 in 2024). Monthly premiums range from roughly $100–$300 depending on age, location, and insurer. Plan N costs 20–30% less than Plan G but has copays and excludes Part B excess charges — ideal for healthy retirees who rarely see specialists.',
    related: ['medicare-calculator', 'healthcare-in-retirement-calculator', 'retirement-budget-calculator'],
  },
]
