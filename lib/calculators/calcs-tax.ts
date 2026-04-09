import type { CalcConfig } from './types'

export const taxCalcs: CalcConfig[] = [
  {
    slug: 'federal-income-tax-calculator',
    title: 'Federal Income Tax Calculator',
    desc: 'Calculate your 2024 federal income tax liability based on filing status and income.',
    cat: 'tax', icon: '🏛️',
    fields: [
      { k: 'income', l: 'Gross Annual Income', p: '75000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly'],['2','Head of Household']] },
      { k: 'deductions', l: 'Deductions (standard or itemized)', p: '14600', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const brackets = v.filing === 1
        ? [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
        : v.filing === 2
        ? [[16550,0.10],[63100,0.12],[100500,0.22],[191950,0.24],[243700,0.32],[609350,0.35],[Infinity,0.37]]
        : [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      const taxable = Math.max(0, v.income - v.deductions)
      let tax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        if (taxable <= prev) break
        tax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
      }
      const effective = taxable > 0 ? (tax / v.income) * 100 : 0
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Federal Tax Owed', fmt: 'usd' },
        details: [
          { l: 'Taxable Income', v: parseFloat(taxable.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Rate', v: parseFloat(effective.toFixed(2)), fmt: 'pct' },
          { l: 'After-Tax Income', v: parseFloat((v.income - tax).toFixed(2)), fmt: 'usd' },
        ],
        note: '2024 tax brackets. Actual liability may differ based on credits, AMT, and other factors.',
      }
    },
    about: 'Federal income taxes use a progressive bracket system — only income above each threshold is taxed at the higher rate. For 2024, the top bracket of 37% applies only to taxable income above $609,350 for single filers. The standard deduction is $14,600 for single filers and $29,200 for married filing jointly.',
    related: ['effective-tax-rate-calculator', 'marginal-tax-rate-calculator', 'paycheck-calculator'],
  },
  {
    slug: 'effective-tax-rate-calculator',
    title: 'Effective Tax Rate Calculator',
    desc: 'Calculate your effective tax rate — the actual percentage of income paid in taxes.',
    cat: 'tax', icon: '📊',
    fields: [
      { k: 'income', l: 'Gross Income', p: '90000', min: 0.01, u: 'USD' },
      { k: 'tax_paid', l: 'Total Tax Paid', p: '15000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const rate = (v.tax_paid / v.income) * 100
      return {
        primary: { value: parseFloat(rate.toFixed(2)), label: 'Effective Tax Rate', fmt: 'pct' },
        details: [
          { l: 'Tax Paid', v: v.tax_paid, fmt: 'usd' },
          { l: 'Take-Home Income', v: v.income - v.tax_paid, fmt: 'usd' },
          { l: 'After-Tax Income', v: parseFloat(((v.income - v.tax_paid) / v.income * 100).toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Effective tax rate is almost always lower than the marginal rate because only a portion of income is taxed at each bracket. A single filer earning $90,000 in 2024 faces a 22% marginal rate but only a 13–16% effective federal rate after the standard deduction.',
    related: ['marginal-tax-rate-calculator', 'federal-income-tax-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'marginal-tax-rate-calculator',
    title: 'Marginal Tax Rate Calculator',
    desc: 'Find your federal marginal tax bracket for 2024 by income and filing status.',
    cat: 'tax', icon: '📋',
    fields: [
      { k: 'taxable_income', l: 'Taxable Income', p: '85000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly'],['2','Head of Household']] },
    ],
    fn: (v) => {
      type Bracket = [number, number, string]
      const brackets: Bracket[] = v.filing === 1
        ? [[23200,0.10,'10%'],[94300,0.12,'12%'],[201050,0.22,'22%'],[383900,0.24,'24%'],[487450,0.32,'32%'],[731200,0.35,'35%'],[Infinity,0.37,'37%']]
        : v.filing === 2
        ? [[16550,0.10,'10%'],[63100,0.12,'12%'],[100500,0.22,'22%'],[191950,0.24,'24%'],[243700,0.32,'32%'],[609350,0.35,'35%'],[Infinity,0.37,'37%']]
        : [[11600,0.10,'10%'],[47150,0.12,'12%'],[100525,0.22,'22%'],[191950,0.24,'24%'],[243725,0.32,'32%'],[609350,0.35,'35%'],[Infinity,0.37,'37%']]
      let margRate = 0.10, margLabel = '10%', prev = 0
      let tax = 0
      for (const [cap, rate, label] of brackets) {
        if (v.taxable_income > prev) { margRate = rate; margLabel = label }
        tax += (Math.min(v.taxable_income, cap) - prev) * rate
        prev = cap
        if (v.taxable_income <= prev) break
      }
      const effective = v.taxable_income > 0 ? (tax / v.taxable_income) * 100 : 0
      return {
        primary: { value: margRate * 100, label: `Marginal Rate (${margLabel} bracket)`, fmt: 'pct' },
        details: [
          { l: 'Taxable Income', v: v.taxable_income, fmt: 'usd' },
          { l: 'Estimated Federal Tax', v: parseFloat(tax.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Rate', v: parseFloat(effective.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'The marginal rate is what you pay on each additional dollar of income — relevant for deciding whether a Roth or traditional IRA makes sense. Earning a $1,000 bonus while in the 22% bracket costs $220 in federal taxes, not counting state and FICA.',
    related: ['effective-tax-rate-calculator', 'federal-income-tax-calculator', 'w4-calculator'],
  },
  {
    slug: 'capital-gains-tax-calculator',
    title: 'Capital Gains Tax Calculator',
    desc: 'Calculate your federal capital gains tax on investment profits.',
    cat: 'tax', icon: '📈',
    fields: [
      { k: 'gain', l: 'Capital Gain Amount', p: '25000', min: 0, u: 'USD' },
      { k: 'income', l: 'Other Taxable Income', p: '60000', min: 0, u: 'USD' },
      { k: 'holding', l: 'Holding Period', t: 'sel', p: '1', op: [['0','Short-term (< 1 year)'],['1','Long-term (≥ 1 year)']] },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly']] },
    ],
    fn: (v) => {
      let tax: number
      if (v.holding === 0) {
        // Short-term: ordinary income rates (simplified)
        const total = v.income + v.gain
        const brackets = v.filing === 1
          ? [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
          : [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
        let totalTax = 0, incomeTax = 0, prev = 0
        for (const [cap, rate] of brackets) {
          totalTax += (Math.min(total, cap) - Math.min(prev, total)) * rate
          incomeTax += (Math.min(v.income, cap) - Math.min(prev, v.income)) * rate
          prev = cap
          if (total <= prev) break
        }
        tax = totalTax - incomeTax
      } else {
        // Long-term rates
        const totalIncome = v.income + v.gain
        let ltRate = 0.20
        if (v.filing === 1) {
          if (totalIncome <= 94050) ltRate = 0
          else if (totalIncome <= 583750) ltRate = 0.15
        } else {
          if (totalIncome <= 47025) ltRate = 0
          else if (totalIncome <= 518900) ltRate = 0.15
        }
        tax = v.gain * ltRate
      }
      const rate = v.gain > 0 ? (tax / v.gain) * 100 : 0
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Capital Gains Tax', fmt: 'usd' },
        details: [
          { l: 'Tax Rate Applied', v: parseFloat(rate.toFixed(1)), fmt: 'pct' },
          { l: 'Net After Tax', v: parseFloat((v.gain - tax).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Type', v: v.holding === 0 ? 'Short-Term (ordinary rates)' : 'Long-Term (preferential rates)', fmt: 'txt' },
        ],
        note: 'Does not include Net Investment Income Tax (3.8%) for high earners or state taxes.',
      }
    },
    about: 'Long-term capital gains rates (0%, 15%, or 20%) are one of the most significant tax advantages available to investors. A taxpayer in the 22% bracket pays just 15% on long-term gains — holding for just one day past 12 months can save thousands on large positions.',
    related: ['short-term-capital-gains-calculator', 'long-term-capital-gains-calculator', 'cryptocurrency-tax-calculator'],
  },
  {
    slug: 'short-term-capital-gains-calculator',
    title: 'Short-Term Capital Gains Tax Calculator',
    desc: 'Calculate taxes on assets sold within one year, taxed as ordinary income.',
    cat: 'tax', icon: '⏱️',
    fields: [
      { k: 'gain', l: 'Short-Term Gain', p: '10000', min: 0, u: 'USD' },
      { k: 'income', l: 'Other Ordinary Income', p: '70000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly']] },
    ],
    fn: (v) => {
      const brackets = v.filing === 1
        ? [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
        : [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      const total = v.income + v.gain
      let totalTax = 0, incomeTax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        totalTax += (Math.min(total, cap) - Math.min(prev, total)) * rate
        incomeTax += (Math.min(v.income, cap) - Math.min(prev, v.income)) * rate
        prev = cap
        if (total <= prev) break
      }
      const tax = totalTax - incomeTax
      const rate = v.gain > 0 ? (tax / v.gain) * 100 : 0
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Short-Term Capital Gains Tax', fmt: 'usd' },
        details: [
          { l: 'Effective Rate on Gain', v: parseFloat(rate.toFixed(1)), fmt: 'pct' },
          { l: 'After-Tax Gain', v: parseFloat((v.gain - tax).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'Short-term gains are taxed as ordinary income — holding 12+ months accesses preferential long-term rates.',
      }
    },
    about: 'Short-term capital gains taxed as ordinary income at up to 37% federal rate represent one of the highest avoidable tax costs in investing. Active traders who turn portfolios frequently sacrifice 7–22 percentage points of returns compared to buy-and-hold investors in the same bracket.',
    related: ['long-term-capital-gains-calculator', 'capital-gains-tax-calculator', 'cryptocurrency-tax-calculator'],
  },
  {
    slug: 'long-term-capital-gains-calculator',
    title: 'Long-Term Capital Gains Tax Calculator',
    desc: 'Calculate preferential 0%, 15%, or 20% tax rates on assets held over 12 months.',
    cat: 'tax', icon: '📅',
    fields: [
      { k: 'gain', l: 'Long-Term Capital Gain', p: '50000', min: 0, u: 'USD' },
      { k: 'income', l: 'Other Taxable Income', p: '80000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly']] },
    ],
    fn: (v) => {
      const totalIncome = v.income + v.gain
      let ltRate = 0.20
      const thresholds = v.filing === 1
        ? [94050, 583750]
        : [47025, 518900]
      if (totalIncome <= thresholds[0]) ltRate = 0
      else if (totalIncome <= thresholds[1]) ltRate = 0.15
      const tax = v.gain * ltRate
      const niit = totalIncome > (v.filing === 1 ? 250000 : 200000) ? v.gain * 0.038 : 0
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Long-Term Capital Gains Tax', fmt: 'usd' },
        details: [
          { l: 'LT Capital Gains Rate', v: ltRate * 100, fmt: 'pct' },
          { l: 'Net Investment Income Tax (3.8%)', v: parseFloat(niit.toFixed(2)), fmt: 'usd' },
          { l: 'Total Tax', v: parseFloat((tax + niit).toFixed(2)), fmt: 'usd' },
          { l: 'After-Tax Gain', v: parseFloat((v.gain - tax - niit).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
      }
    },
    about: 'The 0% long-term capital gains rate applies to 2024 taxable income up to $47,025 for single filers — meaning a retiree drawing down investments in a low-income year could pay zero federal tax on gains. The 3.8% Net Investment Income Tax stacks on top for incomes above $200,000 ($250,000 joint).',
    related: ['short-term-capital-gains-calculator', 'capital-gains-tax-calculator', 'net-investment-income-tax-calculator'],
  },
  {
    slug: 'self-employment-tax-calculator',
    title: 'Self-Employment Tax Calculator',
    desc: 'Calculate self-employment tax (SE tax) for freelancers and independent contractors.',
    cat: 'tax', icon: '💼',
    fields: [
      { k: 'net_profit', l: 'Net Self-Employment Profit', p: '80000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const seIncome = v.net_profit * 0.9235
      const seBase = Math.min(seIncome, 168600)
      const ssTax = seBase * 0.124
      const medTax = seIncome * 0.029
      const additionalMed = seIncome > 200000 ? (seIncome - 200000) * 0.009 : 0
      const totalSE = ssTax + medTax + additionalMed
      const deductible = totalSE * 0.5
      return {
        primary: { value: parseFloat(totalSE.toFixed(2)), label: 'Total SE Tax', fmt: 'usd' },
        details: [
          { l: 'Social Security Tax (12.4%)', v: parseFloat(ssTax.toFixed(2)), fmt: 'usd' },
          { l: 'Medicare Tax (2.9%)', v: parseFloat(medTax.toFixed(2)), fmt: 'usd' },
          { l: 'Additional Medicare (0.9%)', v: parseFloat(additionalMed.toFixed(2)), fmt: 'usd' },
          { l: 'Deductible Portion (50%)', v: parseFloat(deductible.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'Self-employed individuals can deduct the employer-equivalent half of SE tax on Schedule 1.',
      }
    },
    about: 'Self-employment tax is 15.3% on net earnings — covering Social Security (12.4%) and Medicare (2.9%) that W-2 employees split with their employer. At $80,000 in profit, SE tax runs roughly $11,300. The 50% deductible portion reduces taxable income, softening the blow.',
    related: ['quarterly-estimated-tax-calculator', 'freelancer-tax-calculator', '1099-tax-calculator'],
  },
  {
    slug: 'quarterly-estimated-tax-calculator',
    title: 'Quarterly Estimated Tax Calculator',
    desc: 'Calculate quarterly estimated tax payments to avoid IRS underpayment penalties.',
    cat: 'tax', icon: '📅',
    fields: [
      { k: 'annual_income', l: 'Expected Annual Income', p: '100000', min: 0, u: 'USD' },
      { k: 'last_year_tax', l: "Prior Year's Tax Liability", p: '18000', min: 0, u: 'USD' },
      { k: 'withholding', l: 'Expected W-2 Withholding', p: '5000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      // Estimated tax using simplified brackets
      const deduction = 14600
      const taxable = Math.max(0, v.annual_income - deduction)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let fedTax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        fedTax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
        if (taxable <= prev) break
      }
      const seTax = v.annual_income * 0.9235 * 0.153 * 0.5 // simplified SE
      const totalEstimated = Math.max(0, fedTax + seTax - v.withholding)
      const safeHarbor = Math.max(0, v.last_year_tax - v.withholding)
      const quarterly = Math.min(totalEstimated, safeHarbor) / 4
      return {
        primary: { value: parseFloat(quarterly.toFixed(2)), label: 'Quarterly Payment (Safe Harbor)', fmt: 'usd' },
        details: [
          { l: 'Estimated Annual Tax', v: parseFloat((fedTax + seTax).toFixed(2)), fmt: 'usd' },
          { l: 'Minus Withholding', v: v.withholding, fmt: 'usd' },
          { l: 'Total to Pay Quarterly', v: parseFloat(totalEstimated.toFixed(2)), fmt: 'usd' },
          { l: 'Due Dates', v: 'Apr 15, Jun 17, Sep 15, Jan 15', fmt: 'txt' },
        ],
        note: 'Use the lesser of 90% of current-year tax or 100% of prior-year tax (110% if prior AGI > $150k).',
      }
    },
    about: 'The IRS charges underpayment penalties when less than 90% of the current year\'s tax or 100% of the prior year\'s tax is paid via withholding and estimated payments. Freelancers earning over $1,000 in self-employment income typically need to make quarterly payments.',
    related: ['self-employment-tax-calculator', 'freelancer-tax-calculator', '1099-tax-calculator'],
  },
  {
    slug: 'fica-tax-calculator',
    title: 'FICA Tax Calculator',
    desc: 'Calculate FICA taxes — Social Security and Medicare — for employees and employers.',
    cat: 'tax', icon: '🏥',
    fields: [
      { k: 'wages', l: 'Annual W-2 Wages', p: '85000', min: 0, u: 'USD' },
      { k: 'view', l: 'View as', t: 'sel', p: '0', op: [['0','Employee'],['1','Employer'],['2','Both (Self-Employed)']] },
    ],
    fn: (v) => {
      const ssCap = 168600
      const ssWages = Math.min(v.wages, ssCap)
      const ssRate = v.view === 2 ? 0.124 : 0.062
      const medRate = v.view === 2 ? 0.029 : 0.0145
      const ssTax = ssWages * ssRate
      const medTax = v.wages * medRate
      const addlMed = v.wages > 200000 && v.view === 0 ? (v.wages - 200000) * 0.009 : 0
      const total = ssTax + medTax + addlMed
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: `Total FICA Tax (${v.view === 2 ? 'SE' : v.view === 1 ? 'Employer' : 'Employee'})`, fmt: 'usd' },
        details: [
          { l: `Social Security (${ssRate * 100}%)`, v: parseFloat(ssTax.toFixed(2)), fmt: 'usd' },
          { l: `Medicare (${medRate * 100}%)`, v: parseFloat(medTax.toFixed(2)), fmt: 'usd' },
          { l: 'Additional Medicare (0.9%)', v: parseFloat(addlMed.toFixed(2)), fmt: 'usd' },
        ],
        note: 'SS wage base for 2024: $168,600. Additional Medicare tax applies to employees earning over $200,000.',
      }
    },
    about: 'FICA taxes fund Social Security and Medicare — 7.65% each for employee and employer (15.3% total for the self-employed). The 2024 Social Security wage base is $168,600, so high earners stop paying the 6.2% SS portion after hitting that threshold mid-year.',
    related: ['self-employment-tax-calculator', 'paycheck-calculator', 'social-security-tax-calculator'],
  },
  {
    slug: 'social-security-tax-calculator',
    title: 'Social Security Tax Calculator',
    desc: 'Calculate Social Security tax withheld based on 2024 wage base limits.',
    cat: 'tax', icon: '🔐',
    fields: [
      { k: 'wages', l: 'Annual Wages', p: '120000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const wageBase = 168600
      const taxable = Math.min(v.wages, wageBase)
      const employeeTax = taxable * 0.062
      const employerTax = taxable * 0.062
      const stopMonth = v.wages > wageBase ? Math.ceil((wageBase / v.wages) * 12) : 12
      return {
        primary: { value: parseFloat(employeeTax.toFixed(2)), label: 'Employee SS Tax', fmt: 'usd' },
        details: [
          { l: 'Taxable Wages', v: parseFloat(taxable.toFixed(2)), fmt: 'usd' },
          { l: 'Employer SS Tax', v: parseFloat(employerTax.toFixed(2)), fmt: 'usd' },
          { l: 'Combined Total', v: parseFloat((employeeTax + employerTax).toFixed(2)), fmt: 'usd' },
          { l: 'Month SS Withholding Stops', v: stopMonth <= 12 ? `Month ${stopMonth}` : 'Does not stop', fmt: 'txt' },
        ],
      }
    },
    about: 'Social Security tax is 6.2% for both employees and employers on wages up to $168,600 in 2024. Earners above the wage base effectively get a mid-year "raise" when withholding stops. The wage base has risen from $106,800 in 2010, tracking national average wage growth.',
    related: ['fica-tax-calculator', 'medicare-tax-calculator', 'paycheck-calculator'],
  },
  {
    slug: 'medicare-tax-calculator',
    title: 'Medicare Tax Calculator',
    desc: 'Calculate Medicare taxes including the 0.9% additional Medicare surtax.',
    cat: 'tax', icon: '🏥',
    fields: [
      { k: 'wages', l: 'Annual W-2 Wages', p: '250000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single / MFS ($200k threshold)'],['1','Married Filing Jointly ($250k threshold)']] },
    ],
    fn: (v) => {
      const baseTax = v.wages * 0.0145
      const threshold = v.filing === 1 ? 250000 : 200000
      const addl = v.wages > threshold ? (v.wages - threshold) * 0.009 : 0
      const total = baseTax + addl
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Medicare Tax (Employee)', fmt: 'usd' },
        details: [
          { l: 'Base Medicare (1.45%)', v: parseFloat(baseTax.toFixed(2)), fmt: 'usd' },
          { l: 'Additional Medicare (0.9%)', v: parseFloat(addl.toFixed(2)), fmt: 'usd' },
          { l: 'Employer Match (1.45%)', v: parseFloat(baseTax.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Medicare Rate', v: parseFloat((total / v.wages * 100).toFixed(3)), fmt: 'pct' },
        ],
      }
    },
    about: 'Unlike Social Security, Medicare has no wage cap — 1.45% applies to all earned income. The Affordable Care Act added a 0.9% surtax on wages above $200,000 (single) or $250,000 (joint), which the employer is not required to match. High-earning couples may owe additional Medicare tax not withheld from paychecks.',
    related: ['fica-tax-calculator', 'social-security-tax-calculator', 'net-investment-income-tax-calculator'],
  },
  {
    slug: 'net-investment-income-tax-calculator',
    title: 'Net Investment Income Tax Calculator',
    desc: 'Calculate the 3.8% NIIT surtax on investment income for high earners.',
    cat: 'tax', icon: '💹',
    fields: [
      { k: 'investment_income', l: 'Net Investment Income', p: '30000', min: 0, u: 'USD' },
      { k: 'magi', l: 'Modified AGI', p: '230000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single ($200k threshold)'],['1','Married Filing Jointly ($250k threshold)']] },
    ],
    fn: (v) => {
      const threshold = v.filing === 1 ? 250000 : 200000
      const excessMAGI = Math.max(0, v.magi - threshold)
      const taxableNII = Math.min(v.investment_income, excessMAGI)
      const niit = taxableNII * 0.038
      return {
        primary: { value: parseFloat(niit.toFixed(2)), label: 'Net Investment Income Tax (3.8%)', fmt: 'usd' },
        details: [
          { l: 'MAGI', v: v.magi, fmt: 'usd' },
          { l: 'Threshold', v: threshold, fmt: 'usd' },
          { l: 'MAGI Excess Over Threshold', v: parseFloat(excessMAGI.toFixed(2)), fmt: 'usd' },
          { l: 'Taxable NII Amount', v: parseFloat(taxableNII.toFixed(2)), fmt: 'usd' },
        ],
        note: 'NIIT applies to the lesser of net investment income or the amount MAGI exceeds the threshold.',
      }
    },
    about: 'The 3.8% Net Investment Income Tax (NIIT) was enacted as part of the ACA to help fund Medicare expansion. It applies to dividends, interest, capital gains, rental income, and passive business income for single filers with MAGI above $200,000. Roth IRA distributions are excluded.',
    related: ['long-term-capital-gains-calculator', 'medicare-tax-calculator', 'capital-gains-tax-calculator'],
  },
  {
    slug: 'property-tax-calculator',
    title: 'Property Tax Calculator',
    desc: 'Estimate annual property tax based on assessed value and local mill rate.',
    cat: 'tax', icon: '🏠',
    fields: [
      { k: 'value', l: 'Assessed Value', p: '350000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Property Tax Rate', p: '1.2', min: 0, max: 10, u: '%' },
      { k: 'exemption', l: 'Homestead Exemption', p: '25000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const taxable = Math.max(0, v.value - v.exemption)
      const annual = taxable * (v.rate / 100)
      const monthly = annual / 12
      return {
        primary: { value: parseFloat(annual.toFixed(2)), label: 'Annual Property Tax', fmt: 'usd' },
        details: [
          { l: 'Taxable Assessed Value', v: parseFloat(taxable.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Escrow Payment', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Rate on Full Value', v: parseFloat((annual / v.value * 100).toFixed(3)), fmt: 'pct' },
        ],
      }
    },
    about: 'US property tax rates average 1.1% nationally, ranging from 0.28% in Hawaii to 2.23% in New Jersey. A $350,000 home in New Jersey pays roughly $7,800/year; the same home in Alabama pays under $1,500. Most homeowners pay property taxes through monthly mortgage escrow.',
    related: ['mortgage-payment-calculator', 'homeowners-insurance-calculator', 'itemized-deduction-calculator'],
  },
  {
    slug: 'sales-tax-by-state-calculator',
    title: 'Sales Tax by State Calculator',
    desc: 'Calculate sales tax and total purchase price for any US state rate.',
    cat: 'tax', icon: '🗺️',
    fields: [
      { k: 'price', l: 'Purchase Price', p: '500', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State Tax Rate', p: '6', min: 0, max: 15, u: '%' },
      { k: 'local_rate', l: 'Local Tax Rate', p: '2', min: 0, max: 10, u: '%' },
    ],
    fn: (v) => {
      const combined = v.state_rate + v.local_rate
      const tax = v.price * (combined / 100)
      const total = v.price + tax
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total with Sales Tax', fmt: 'usd' },
        details: [
          { l: 'Combined Tax Rate', v: parseFloat(combined.toFixed(2)), fmt: 'pct' },
          { l: 'Tax Amount', v: parseFloat(tax.toFixed(2)), fmt: 'usd' },
          { l: 'Pre-Tax Price', v: v.price, fmt: 'usd' },
        ],
        note: '5 states have no statewide sales tax: Oregon, Montana, New Hampshire, Delaware, Alaska.',
      }
    },
    about: 'US combined state and local sales tax rates range from 0% in Oregon and New Hampshire to 11.45% in parts of Louisiana. Tennessee has the highest average combined rate at 9.55%. Online retailers collect sales tax in all 50 states following the 2018 South Dakota v. Wayfair Supreme Court ruling.',
    related: ['vat-calculator', 'sales-tax-calculator', 'discount-calculator'],
  },
  {
    slug: 'standard-deduction-calculator',
    title: 'Standard Deduction Calculator',
    desc: 'Find your 2024 standard deduction amount by filing status and age.',
    cat: 'tax', icon: '📋',
    fields: [
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly'],['2','Married Filing Separately'],['3','Head of Household'],['4','Qualifying Surviving Spouse']] },
      { k: 'age65', l: 'Age 65 or Older?', t: 'sel', p: '0', op: [['0','No'],['1','Yes']] },
      { k: 'blind', l: 'Legally Blind?', t: 'sel', p: '0', op: [['0','No'],['1','Yes']] },
    ],
    fn: (v) => {
      const base = [14600, 29200, 14600, 21900, 29200][v.filing] ?? 14600
      const addlSingle = (v.age65 + v.blind) * 1950
      const addlJoint = (v.age65 + v.blind) * 1550
      const extra = (v.filing === 1 || v.filing === 4) ? addlJoint : addlSingle
      const total = base + extra
      return {
        primary: { value: total, label: '2024 Standard Deduction', fmt: 'usd' },
        details: [
          { l: 'Base Deduction', v: base, fmt: 'usd' },
          { l: 'Additional (Age/Blind)', v: extra, fmt: 'usd', color: extra > 0 ? 'var(--green)' : 'var(--muted)' },
        ],
        note: 'Itemize deductions only if they exceed this amount (mortgage interest, state taxes, charitable donations).',
      }
    },
    about: 'About 87% of taxpayers take the standard deduction after the 2017 Tax Cuts and Jobs Act nearly doubled it. For 2024, single filers get $14,600 and married couples get $29,200. Taxpayers 65+ or blind receive an additional $1,550–$1,950 per qualifying condition.',
    related: ['itemized-deduction-calculator', 'federal-income-tax-calculator', 'effective-tax-rate-calculator'],
  },
  {
    slug: 'itemized-deduction-calculator',
    title: 'Itemized Deduction Calculator',
    desc: 'Calculate total itemized deductions to determine if you should itemize or take the standard deduction.',
    cat: 'tax', icon: '📝',
    fields: [
      { k: 'mortgage_interest', l: 'Mortgage Interest', p: '12000', min: 0, u: 'USD' },
      { k: 'state_taxes', l: 'State & Local Taxes (SALT, max $10k)', p: '8000', min: 0, u: 'USD' },
      { k: 'charity', l: 'Charitable Contributions', p: '3000', min: 0, u: 'USD' },
      { k: 'medical', l: 'Medical Expenses (above 7.5% AGI)', p: '0', min: 0, u: 'USD' },
      { k: 'other', l: 'Other Deductions', p: '500', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single ($14,600 std)'],['1','Married ($29,200 std)']] },
    ],
    fn: (v) => {
      const salt = Math.min(v.state_taxes, 10000)
      const total = v.mortgage_interest + salt + v.charity + v.medical + v.other
      const stdDed = v.filing === 1 ? 29200 : 14600
      const benefit = total - stdDed
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Itemized Deductions', fmt: 'usd' },
        details: [
          { l: 'Standard Deduction', v: stdDed, fmt: 'usd' },
          { l: 'Benefit of Itemizing', v: parseFloat(benefit.toFixed(2)), fmt: 'usd', color: benefit > 0 ? 'var(--green)' : '#f87171' },
          { l: 'SALT Deduction (capped)', v: parseFloat(salt.toFixed(2)), fmt: 'usd' },
          { l: 'Recommendation', v: benefit > 0 ? 'Itemize' : 'Take Standard Deduction', fmt: 'txt', color: benefit > 0 ? 'var(--green)' : '#fbbf24' },
        ],
      }
    },
    about: 'Itemizing makes sense when deductions exceed the standard threshold — most common for homeowners with large mortgage interest and high state taxes. The SALT deduction cap of $10,000 (enacted 2017) hit high-tax states hardest: New York, California, and New Jersey saw the biggest impact.',
    related: ['standard-deduction-calculator', 'property-tax-calculator', 'home-office-deduction-calculator'],
  },
  {
    slug: 'bonus-tax-calculator',
    title: 'Bonus Tax Calculator',
    desc: 'Calculate the after-tax amount of a bonus check using the IRS supplemental rate.',
    cat: 'tax', icon: '🎁',
    fields: [
      { k: 'bonus', l: 'Gross Bonus Amount', p: '10000', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State Income Tax Rate', p: '5', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const federal = v.bonus * 0.22 // IRS supplemental flat rate
      const ss = Math.min(v.bonus, 168600) * 0.062
      const medicare = v.bonus * 0.0145
      const state = v.bonus * (v.state_rate / 100)
      const total = federal + ss + medicare + state
      const net = v.bonus - total
      return {
        primary: { value: parseFloat(net.toFixed(2)), label: 'Net Bonus (After Tax)', fmt: 'usd' },
        details: [
          { l: 'Federal Withholding (22%)', v: parseFloat(federal.toFixed(2)), fmt: 'usd' },
          { l: 'Social Security (6.2%)', v: parseFloat(ss.toFixed(2)), fmt: 'usd' },
          { l: 'Medicare (1.45%)', v: parseFloat(medicare.toFixed(2)), fmt: 'usd' },
          { l: 'State Tax', v: parseFloat(state.toFixed(2)), fmt: 'usd' },
          { l: 'Total Taxes', v: parseFloat(total.toFixed(2)), fmt: 'usd', color: '#f87171' },
        ],
      }
    },
    about: 'The IRS requires employers to withhold 22% federal income tax on supplemental wages (bonuses, commissions) up to $1 million. The "bonus tax" isn\'t higher than regular income — it\'s just that bonuses are withheld at the flat 22% supplemental rate regardless of your actual marginal bracket.',
    related: ['paycheck-calculator', 'signing-bonus-after-tax-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'cryptocurrency-tax-calculator',
    title: 'Cryptocurrency Tax Calculator',
    desc: 'Calculate capital gains tax on crypto sales, trades, and conversions.',
    cat: 'tax', icon: '🪙',
    fields: [
      { k: 'proceeds', l: 'Sale Proceeds', p: '15000', min: 0, u: 'USD' },
      { k: 'cost_basis', l: 'Cost Basis', p: '8000', min: 0, u: 'USD' },
      { k: 'holding', l: 'Holding Period', t: 'sel', p: '1', op: [['0','Short-Term (< 1 year)'],['1','Long-Term (≥ 1 year)']] },
      { k: 'tax_bracket', l: 'Your Tax Bracket', t: 'sel', p: '22', op: [['10','10%'],['12','12%'],['22','22%'],['24','24%'],['32','32%'],['35','35%'],['37','37%']] },
    ],
    fn: (v) => {
      const gain = v.proceeds - v.cost_basis
      let rate: number
      if (v.holding === 0) {
        rate = v.tax_bracket / 100
      } else {
        if (v.tax_bracket <= 12) rate = 0
        else if (v.tax_bracket <= 35) rate = 0.15
        else rate = 0.20
      }
      const tax = Math.max(0, gain * rate)
      const net = v.proceeds - v.cost_basis - tax
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Estimated Crypto Tax', fmt: 'usd' },
        details: [
          { l: 'Capital Gain / Loss', v: parseFloat(gain.toFixed(2)), fmt: 'usd', color: gain >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Tax Rate Applied', v: rate * 100, fmt: 'pct' },
          { l: 'Net After Tax', v: parseFloat(net.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Every crypto transaction — sale, trade, spend — is a taxable event per IRS Notice 2014-21.',
      }
    },
    about: 'The IRS has treated cryptocurrency as property since 2014, meaning each trade triggers a taxable event. Crypto-to-crypto swaps are taxable even without converting to USD. The agency has added a crypto question to Form 1040 since 2019, and exchanges now file 1099-DA forms for users.',
    related: ['capital-gains-tax-calculator', 'cost-basis-calculator', 'wash-sale-calculator'],
  },
  {
    slug: 'cost-basis-calculator',
    title: 'Cost Basis Calculator',
    desc: 'Calculate cost basis using FIFO, LIFO, or average cost methods.',
    cat: 'tax', icon: '📊',
    fields: [
      { k: 'shares_bought', l: 'Shares Purchased', p: '100', min: 0 },
      { k: 'avg_buy_price', l: 'Average Purchase Price', p: '50', min: 0, u: 'USD' },
      { k: 'commissions', l: 'Total Commissions Paid', p: '10', min: 0, u: 'USD' },
      { k: 'shares_sold', l: 'Shares Sold', p: '40', min: 0 },
    ],
    fn: (v) => {
      const totalCost = v.shares_bought * v.avg_buy_price + v.commissions
      const costPerShare = totalCost / v.shares_bought
      const basisSold = costPerShare * v.shares_sold
      const remainingBasis = totalCost - basisSold
      return {
        primary: { value: parseFloat(costPerShare.toFixed(4)), label: 'Cost Per Share', fmt: 'usd' },
        details: [
          { l: 'Total Cost Basis', v: parseFloat(totalCost.toFixed(2)), fmt: 'usd' },
          { l: 'Basis for Shares Sold', v: parseFloat(basisSold.toFixed(2)), fmt: 'usd' },
          { l: 'Remaining Basis', v: parseFloat(remainingBasis.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Average cost method shown. FIFO/LIFO requires lot-specific tracking.',
      }
    },
    about: 'Cost basis is the original value of an asset for tax purposes — critical for calculating capital gains. Inheritances receive a step-up in basis to fair market value at date of death, eliminating built-in gains. Gifts retain the donor\'s original basis, which can create a tax surprise for recipients.',
    related: ['capital-gains-tax-calculator', 'cryptocurrency-tax-calculator', 'wash-sale-calculator'],
  },
  {
    slug: 'wash-sale-calculator',
    title: 'Wash Sale Calculator',
    desc: 'Calculate how wash sale rules affect your capital loss deductions.',
    cat: 'tax', icon: '🔄',
    fields: [
      { k: 'sale_price', l: 'Sale Price', p: '8000', min: 0, u: 'USD' },
      { k: 'cost_basis', l: 'Original Cost Basis', p: '12000', min: 0, u: 'USD' },
      { k: 'repurchase', l: 'Repurchase Price (if repurchased)', p: '8500', min: 0, u: 'USD' },
      { k: 'wash', l: 'Was it a Wash Sale?', t: 'sel', p: '1', op: [['0','No (30+ day gap)'],['1','Yes (within 30 days)']] },
    ],
    fn: (v) => {
      const loss = v.cost_basis - v.sale_price
      const disallowed = v.wash === 1 ? loss : 0
      const deductible = loss - disallowed
      const newBasis = v.wash === 1 ? v.repurchase + disallowed : v.repurchase
      return {
        primary: { value: parseFloat(deductible.toFixed(2)), label: 'Deductible Capital Loss', fmt: 'usd' },
        details: [
          { l: 'Total Loss', v: parseFloat(loss.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Disallowed (Wash Sale)', v: parseFloat(disallowed.toFixed(2)), fmt: 'usd', color: disallowed > 0 ? '#f87171' : 'var(--muted)' },
          { l: 'Adjusted Basis of Repurchase', v: parseFloat(newBasis.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Wash sale rules apply if you buy the same or substantially identical security within 30 days before or after the sale.',
      }
    },
    about: 'The wash sale rule disallows capital loss deductions when the same or substantially identical security is repurchased within 30 days before or after the sale. The disallowed loss is not gone — it\'s added to the cost basis of the new shares, deferring the tax benefit.',
    related: ['cost-basis-calculator', 'capital-gains-tax-calculator', 'cryptocurrency-tax-calculator'],
  },
  {
    slug: 'tax-refund-calculator',
    title: 'Tax Refund Calculator',
    desc: 'Estimate your federal tax refund or balance due for the year.',
    cat: 'tax', icon: '💰',
    fields: [
      { k: 'income', l: 'Gross Annual Income', p: '65000', min: 0, u: 'USD' },
      { k: 'withheld', l: 'Federal Tax Withheld (W-2 Box 2)', p: '9000', min: 0, u: 'USD' },
      { k: 'deduction', l: 'Standard/Itemized Deduction', p: '14600', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const taxable = Math.max(0, v.income - v.deduction)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let tax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        tax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
        if (taxable <= prev) break
      }
      const refund = v.withheld - tax
      return {
        primary: { value: parseFloat(Math.abs(refund).toFixed(2)), label: refund >= 0 ? 'Expected Refund' : 'Amount Owed', fmt: 'usd' },
        details: [
          { l: 'Estimated Tax Liability', v: parseFloat(tax.toFixed(2)), fmt: 'usd' },
          { l: 'Tax Withheld', v: v.withheld, fmt: 'usd' },
          { l: 'Status', v: refund >= 0 ? 'Refund Expected' : 'Additional Tax Owed', fmt: 'txt', color: refund >= 0 ? 'var(--green)' : '#f87171' },
        ],
        note: 'This is an estimate. Actual refund may vary based on credits, other income, and alternative minimum tax.',
      }
    },
    about: 'The IRS issued 105 million refunds totaling $334 billion for tax year 2023, averaging $3,170 per refund. A large refund isn\'t a windfall — it means you gave the government an interest-free loan all year. Adjusting your W-4 withholding to break even is typically the smarter financial move.',
    related: ['federal-income-tax-calculator', 'w4-calculator', 'tax-withholding-calculator'],
  },
  {
    slug: 'w4-calculator',
    title: 'W-4 Withholding Calculator',
    desc: 'Calculate the right withholding allowances to owe nothing or get a small refund.',
    cat: 'tax', icon: '📋',
    fields: [
      { k: 'income', l: 'Annual Gross Income', p: '75000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married Filing Jointly']] },
      { k: 'other_income', l: 'Other Income (side jobs, investments)', p: '0', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const totalIncome = v.income + v.other_income
      const deduction = v.filing === 1 ? 29200 : 14600
      const taxable = Math.max(0, totalIncome - deduction)
      const brackets = v.filing === 1
        ? [[23200,0.10],[94300,0.12],[201050,0.22],[383900,0.24],[487450,0.32],[731200,0.35],[Infinity,0.37]]
        : [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let tax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        tax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
        if (taxable <= prev) break
      }
      const monthly = tax / 12
      const biweekly = tax / 26
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Target Annual Withholding', fmt: 'usd' },
        details: [
          { l: 'Monthly Withholding Target', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'Per-Paycheck (Bi-Weekly)', v: parseFloat(biweekly.toFixed(2)), fmt: 'usd' },
          { l: 'Taxable Income', v: parseFloat(taxable.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Compare to current withholding on your most recent pay stub to determine if you need to update your W-4.',
      }
    },
    about: 'The IRS redesigned the W-4 in 2020, eliminating allowances in favor of direct dollar amounts. To withhold accurately, employees need to estimate total household income, deductions, and credits. Underwithholding by more than $1,000 may result in an underpayment penalty.',
    related: ['tax-withholding-calculator', 'federal-income-tax-calculator', 'tax-refund-calculator'],
  },
  {
    slug: 'freelancer-tax-calculator',
    title: 'Freelancer Tax Calculator',
    desc: 'Calculate total tax burden for freelancers including SE tax and estimated payments.',
    cat: 'tax', icon: '💻',
    fields: [
      { k: 'revenue', l: 'Gross Freelance Revenue', p: '100000', min: 0, u: 'USD' },
      { k: 'expenses', l: 'Business Expenses', p: '20000', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State Tax Rate', p: '5', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const netProfit = Math.max(0, v.revenue - v.expenses)
      const seBase = netProfit * 0.9235
      const seTax = seBase * 0.153
      const seDeduction = seTax * 0.5
      const qbiDeduction = netProfit * 0.20
      const taxable = Math.max(0, netProfit - seDeduction - qbiDeduction - 14600)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let fedTax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        fedTax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
        if (taxable <= prev) break
      }
      const stateTax = netProfit * (v.state_rate / 100)
      const totalTax = fedTax + seTax + stateTax
      const effectiveRate = netProfit > 0 ? (totalTax / netProfit) * 100 : 0
      return {
        primary: { value: parseFloat(totalTax.toFixed(2)), label: 'Total Estimated Tax', fmt: 'usd' },
        details: [
          { l: 'Net Profit', v: parseFloat(netProfit.toFixed(2)), fmt: 'usd' },
          { l: 'Self-Employment Tax', v: parseFloat(seTax.toFixed(2)), fmt: 'usd' },
          { l: 'Federal Income Tax', v: parseFloat(fedTax.toFixed(2)), fmt: 'usd' },
          { l: 'State Tax (est.)', v: parseFloat(stateTax.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Total Rate', v: parseFloat(effectiveRate.toFixed(2)), fmt: 'pct' },
          { l: 'Quarterly Payment', v: parseFloat((totalTax / 4).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Includes 20% QBI deduction for pass-through income (may not apply to all service businesses).',
      }
    },
    about: 'Freelancers face a double tax burden: self-employment tax (15.3%) plus income tax. The QBI deduction (Section 199A) allows many self-employed people to deduct 20% of qualified business income, significantly reducing the effective rate. Tracking business expenses is critical — the IRS allows deductions for home office, equipment, software, and professional development.',
    related: ['self-employment-tax-calculator', 'quarterly-estimated-tax-calculator', '1099-tax-calculator'],
  },
  {
    slug: '1099-tax-calculator',
    title: '1099 Tax Calculator',
    desc: 'Estimate taxes owed on 1099 income from gig work, consulting, or contract work.',
    cat: 'tax', icon: '📄',
    fields: [
      { k: 'income_1099', l: '1099 Income', p: '50000', min: 0, u: 'USD' },
      { k: 'expenses', l: 'Deductible Business Expenses', p: '8000', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State Tax Rate', p: '4', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const net = Math.max(0, v.income_1099 - v.expenses)
      const seBase = net * 0.9235
      const seTax = seBase * 0.153
      const taxable = Math.max(0, net - seTax * 0.5 - 14600)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let fedTax = 0, prev = 0
      for (const [cap, rate] of brackets) {
        fedTax += (Math.min(taxable, cap) - prev) * rate
        prev = cap
        if (taxable <= prev) break
      }
      const stateTax = net * (v.state_rate / 100)
      const total = fedTax + seTax + stateTax
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Tax on 1099 Income', fmt: 'usd' },
        details: [
          { l: 'Net Self-Employment Income', v: parseFloat(net.toFixed(2)), fmt: 'usd' },
          { l: 'SE Tax (15.3%)', v: parseFloat(seTax.toFixed(2)), fmt: 'usd' },
          { l: 'Federal Income Tax', v: parseFloat(fedTax.toFixed(2)), fmt: 'usd' },
          { l: 'State Tax', v: parseFloat(stateTax.toFixed(2)), fmt: 'usd' },
          { l: 'Quarterly Payment Estimate', v: parseFloat((total / 4).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'Workers receiving 1099-NEC or 1099-MISC forms have no taxes withheld and must make quarterly estimated payments. The IRS issues CP2000 notices when 1099 income isn\'t reported — gig platforms like Uber, Airbnb, and Etsy now issue 1099-K forms for payments above $5,000 in 2024.',
    related: ['self-employment-tax-calculator', 'freelancer-tax-calculator', 'quarterly-estimated-tax-calculator'],
  },
  {
    slug: 'home-office-deduction-calculator',
    title: 'Home Office Deduction Calculator',
    desc: 'Calculate the home office deduction using the simplified or regular method.',
    cat: 'tax', icon: '🏠',
    fields: [
      { k: 'office_sqft', l: 'Home Office Square Footage', p: '200', min: 1 },
      { k: 'home_sqft', l: 'Total Home Square Footage', p: '1800', min: 1 },
      { k: 'home_expenses', l: 'Annual Home Expenses (rent/mortgage, utilities)', p: '24000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const simplified = Math.min(v.office_sqft, 300) * 5
      const percentage = v.office_sqft / v.home_sqft
      const regular = v.home_expenses * percentage
      const recommendation = simplified >= regular ? 'Simplified Method' : 'Regular Method'
      const recommended = Math.max(simplified, regular)
      return {
        primary: { value: parseFloat(recommended.toFixed(2)), label: 'Recommended Deduction', fmt: 'usd' },
        details: [
          { l: 'Simplified Method ($5/sq ft, max 300)', v: parseFloat(simplified.toFixed(2)), fmt: 'usd' },
          { l: 'Regular Method', v: parseFloat(regular.toFixed(2)), fmt: 'usd' },
          { l: 'Business Use Percentage', v: parseFloat((percentage * 100).toFixed(2)), fmt: 'pct' },
          { l: 'Use', v: recommendation, fmt: 'txt', color: 'var(--green)' },
        ],
        note: 'Home office must be used regularly and exclusively for business. W-2 employees cannot claim this deduction.',
      }
    },
    about: 'Home office deduction is available only to self-employed taxpayers since 2018 — W-2 employees cannot deduct it under the TCJA. The IRS simplified method ($5 per square foot up to 300 sq ft, max $1,500) is easier but often yields less than the regular method using actual expenses.',
    related: ['freelancer-tax-calculator', 'itemized-deduction-calculator', 'self-employment-tax-calculator'],
  },
  {
    slug: 'depreciation-calculator',
    title: 'Depreciation Calculator',
    desc: 'Calculate annual depreciation using straight-line, declining balance, or MACRS.',
    cat: 'tax', icon: '📉',
    fields: [
      { k: 'cost', l: 'Asset Cost', p: '50000', min: 0, u: 'USD' },
      { k: 'salvage', l: 'Salvage Value', p: '5000', min: 0, u: 'USD' },
      { k: 'life', l: 'Useful Life', p: '5', min: 1, u: 'years' },
      { k: 'method', l: 'Method', t: 'sel', p: '0', op: [['0','Straight-Line'],['1','Double Declining Balance']] },
    ],
    fn: (v) => {
      const depreciable = v.cost - v.salvage
      let annual: number
      if (v.method === 0) {
        annual = depreciable / v.life
      } else {
        annual = (2 / v.life) * v.cost
      }
      return {
        primary: { value: parseFloat(annual.toFixed(2)), label: 'First Year Depreciation', fmt: 'usd' },
        details: [
          { l: 'Depreciable Amount', v: parseFloat(depreciable.toFixed(2)), fmt: 'usd' },
          { l: 'Annual Rate', v: parseFloat((v.method === 0 ? 100 / v.life : 200 / v.life).toFixed(2)), fmt: 'pct' },
          { l: 'Method', v: v.method === 0 ? 'Straight-Line' : 'Double Declining Balance', fmt: 'txt' },
        ],
        note: 'Section 179 and bonus depreciation allow immediate expensing of many assets for tax purposes.',
      }
    },
    about: 'Section 179 lets businesses immediately deduct up to $1.16 million in equipment purchases for 2023. Bonus depreciation phases down from 100% (2022) to 60% (2024) to 40% (2025). IRS MACRS tables assign recovery periods: 5 years for vehicles and computers, 7 years for office furniture, 39 years for commercial real estate.',
    related: ['home-office-deduction-calculator', 'small-business-tax-calculator', 'freelancer-tax-calculator'],
  },
  {
    slug: 'child-tax-credit-calculator',
    title: 'Child Tax Credit Calculator',
    desc: 'Calculate your 2024 Child Tax Credit based on number of children and income.',
    cat: 'tax', icon: '👶',
    fields: [
      { k: 'children', l: 'Number of Qualifying Children (under 17)', p: '2', min: 0, max: 10 },
      { k: 'magi', l: 'Modified Adjusted Gross Income', p: '90000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single / HOH ($200k threshold)'],['1','Married Filing Jointly ($400k threshold)']] },
    ],
    fn: (v) => {
      const maxCredit = v.children * 2000
      const threshold = v.filing === 1 ? 400000 : 200000
      const phaseoutAmount = Math.max(0, v.magi - threshold)
      const phaseout = Math.ceil(phaseoutAmount / 2500) * 50
      const credit = Math.max(0, maxCredit - phaseout)
      const refundable = Math.min(credit, v.children * 1700)
      return {
        primary: { value: parseFloat(credit.toFixed(2)), label: 'Child Tax Credit', fmt: 'usd' },
        details: [
          { l: 'Maximum Credit', v: parseFloat(maxCredit.toFixed(2)), fmt: 'usd' },
          { l: 'Phase-Out Reduction', v: parseFloat(phaseout.toFixed(2)), fmt: 'usd', color: phaseout > 0 ? '#f87171' : 'var(--muted)' },
          { l: 'Refundable Portion (ACTC)', v: parseFloat(refundable.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
      }
    },
    about: 'The Child Tax Credit is $2,000 per qualifying child under 17 in 2024, with $1,700 potentially refundable as the Additional Child Tax Credit. Phase-out begins at $200,000 (single) and $400,000 (married). The American Rescue Plan temporarily expanded it to $3,600 per young child in 2021.',
    related: ['earned-income-tax-credit-calculator', 'federal-income-tax-calculator', 'dependent-care-fsa-calculator'],
  },
  {
    slug: 'earned-income-tax-credit-calculator',
    title: 'Earned Income Tax Credit (EITC) Calculator',
    desc: 'Estimate your EITC — a refundable credit for working low-to-moderate income taxpayers.',
    cat: 'tax', icon: '💚',
    fields: [
      { k: 'earned_income', l: 'Earned Income', p: '30000', min: 0, u: 'USD' },
      { k: 'children', l: 'Qualifying Children', t: 'sel', p: '1', op: [['0','0'],['1','1'],['2','2'],['3','3 or more']] },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single / HOH'],['1','Married Filing Jointly']] },
    ],
    fn: (v) => {
      // 2024 EITC approximate limits and amounts
      const maxCredits = [632, 4213, 6960, 7830]
      const incomePhaseoutStart = v.filing === 1 ? [16810, 26260, 26260, 26260] : [10330, 22720, 22720, 22720]
      const incomeLimit = v.filing === 1 ? [24884, 53120, 59478, 63398] : [18591, 49084, 55529, 59187]
      const idx = Math.min(v.children, 3)
      const limit = incomeLimit[idx]
      const phaseStart = incomePhaseoutStart[idx]
      const max = maxCredits[idx]
      if (v.earned_income > limit) {
        return { primary: { value: 0, label: 'EITC (Income Too High)', fmt: 'usd' }, details: [{ l: 'Income Limit', v: limit, fmt: 'usd' }] }
      }
      const credit = v.earned_income <= phaseStart ? Math.min(max, v.earned_income * 0.3) : Math.max(0, max - (v.earned_income - phaseStart) * 0.15)
      return {
        primary: { value: parseFloat(credit.toFixed(2)), label: 'Estimated EITC', fmt: 'usd' },
        details: [
          { l: 'Maximum Credit (your situation)', v: max, fmt: 'usd' },
          { l: 'Credit is Fully Refundable', v: 'Yes — reduces tax below zero', fmt: 'txt', color: 'var(--green)' },
        ],
        note: 'Use IRS EITC Assistant for exact calculation. Investment income limit is $11,600 for 2024.',
      }
    },
    about: 'The EITC is the largest anti-poverty program in the US tax code, lifting about 5 million people out of poverty annually. For 2024, maximum credits range from $632 (no children) to $7,830 (three or more children). The IRS reports an improper payment rate of roughly 30% due to complex eligibility rules.',
    related: ['child-tax-credit-calculator', 'federal-income-tax-calculator', 'tax-refund-calculator'],
  },
  {
    slug: 'payroll-tax-calculator',
    title: 'Payroll Tax Calculator',
    desc: 'Calculate employer payroll tax costs per employee including FUTA and SUTA.',
    cat: 'tax', icon: '💼',
    fields: [
      { k: 'wages', l: 'Annual Employee Wages', p: '60000', min: 0, u: 'USD' },
      { k: 'suta_rate', l: 'State Unemployment (SUTA) Rate', p: '3', min: 0, max: 15, u: '%' },
      { k: 'suta_wage_base', l: 'SUTA Wage Base', p: '7000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const ss = Math.min(v.wages, 168600) * 0.062
      const medicare = v.wages * 0.0145
      const futa = Math.min(v.wages, 7000) * 0.006 // 0.6% net FUTA after credit
      const suta = Math.min(v.wages, v.suta_wage_base) * (v.suta_rate / 100)
      const total = ss + medicare + futa + suta
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: "Total Employer Payroll Tax Cost", fmt: 'usd' },
        details: [
          { l: 'Social Security (6.2%)', v: parseFloat(ss.toFixed(2)), fmt: 'usd' },
          { l: 'Medicare (1.45%)', v: parseFloat(medicare.toFixed(2)), fmt: 'usd' },
          { l: 'FUTA (0.6% on $7k)', v: parseFloat(futa.toFixed(2)), fmt: 'usd' },
          { l: 'SUTA', v: parseFloat(suta.toFixed(2)), fmt: 'usd' },
          { l: 'Total Cost on Top of Wages', v: parseFloat(total.toFixed(2)), fmt: 'usd', color: '#f87171' },
        ],
      }
    },
    about: 'Employer payroll taxes add roughly 10–15% to base wages. A $60,000 salary costs the employer about $65,600 in payroll taxes alone — before benefits, overhead, or equipment. SUTA rates vary by state and employer history; new employers typically start at 2–4%.',
    related: ['fica-tax-calculator', 'employee-cost-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'estate-tax-calculator',
    title: 'Estate Tax Calculator',
    desc: 'Calculate federal estate tax liability based on 2024 exemptions.',
    cat: 'tax', icon: '🏛️',
    fields: [
      { k: 'estate_value', l: 'Gross Estate Value', p: '15000000', min: 0, u: 'USD' },
      { k: 'debts', l: 'Debts & Expenses', p: '500000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Exemption Used', t: 'sel', p: '0', op: [['0','Single ($13.61M exemption)'],['1','Married ($27.22M combined)']] },
    ],
    fn: (v) => {
      const exemption = v.filing === 1 ? 27220000 : 13610000
      const taxableEstate = Math.max(0, v.estate_value - v.debts - exemption)
      const tax = taxableEstate * 0.40
      const effectiveRate = v.estate_value > 0 ? (tax / v.estate_value) * 100 : 0
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Federal Estate Tax', fmt: 'usd' },
        details: [
          { l: 'Taxable Estate', v: parseFloat(taxableEstate.toFixed(2)), fmt: 'usd' },
          { l: 'Exemption Used', v: parseFloat(exemption.toFixed(2)), fmt: 'usd' },
          { l: 'Effective Rate', v: parseFloat(effectiveRate.toFixed(2)), fmt: 'pct' },
        ],
        note: 'The 2025 exemption is $13.99M per person. After 2025, exemptions may revert to ~$7M unless Congress acts.',
      }
    },
    about: 'Only about 0.1% of estates pay federal estate tax — the 2024 exemption of $13.61 million per person ($27.22M married) shields the vast majority. The flat 40% rate applies above the exemption. Estates primarily avoid tax through the unlimited marital deduction, charitable bequests, and trust structures.',
    related: ['gift-tax-calculator', 'net-worth-calculator', 'roth-conversion-tax-calculator'],
  },
  {
    slug: 'gift-tax-calculator',
    title: 'Gift Tax Calculator',
    desc: 'Determine gift tax liability and lifetime exemption usage for 2024.',
    cat: 'tax', icon: '🎁',
    fields: [
      { k: 'gift', l: 'Gift Amount', p: '50000', min: 0, u: 'USD' },
      { k: 'prior_taxable', l: 'Prior Taxable Gifts (lifetime)', p: '0', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const annual_exclusion = 18000
      const lifetime = 13610000
      const taxable_gift = Math.max(0, v.gift - annual_exclusion)
      const remaining_exemption = Math.max(0, lifetime - v.prior_taxable)
      const exemption_used = Math.min(taxable_gift, remaining_exemption)
      const taxable = Math.max(0, taxable_gift - exemption_used)
      const tax = taxable * 0.40
      return {
        primary: { value: parseFloat(tax.toFixed(2)), label: 'Gift Tax Owed', fmt: 'usd' },
        details: [
          { l: 'Annual Exclusion Used', v: parseFloat(Math.min(v.gift, annual_exclusion).toFixed(2)), fmt: 'usd' },
          { l: 'Lifetime Exemption Applied', v: parseFloat(exemption_used.toFixed(2)), fmt: 'usd' },
          { l: 'Remaining Lifetime Exemption', v: parseFloat((remaining_exemption - exemption_used).toFixed(2)), fmt: 'usd' },
        ],
        note: '2024 annual exclusion: $18,000 per recipient. Gifts to spouses are unlimited (unlimited marital deduction).',
      }
    },
    about: 'In 2024, you can give up to $18,000 per person per year tax-free. Above that, gifts use your lifetime exemption of $13.61 million before gift tax is triggered. 529 plan contributions allow "superfunding" — 5 years of annual exclusion at once ($90,000) — without using lifetime exemption.',
    related: ['estate-tax-calculator', 'net-worth-calculator', '529-plan-calculator'],
  },
  {
    slug: 'roth-conversion-tax-calculator',
    title: 'Roth Conversion Tax Calculator',
    desc: 'Calculate the tax cost and long-term benefit of converting traditional IRA funds to Roth.',
    cat: 'tax', icon: '🔄',
    fields: [
      { k: 'convert_amount', l: 'Amount to Convert', p: '50000', min: 0, u: 'USD' },
      { k: 'current_income', l: 'Other Taxable Income', p: '70000', min: 0, u: 'USD' },
      { k: 'deduction', l: 'Standard/Itemized Deduction', p: '14600', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const calcTax = (taxable: number) => {
        const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
        let tax = 0, prev = 0
        for (const [cap, rate] of brackets) {
          tax += (Math.min(taxable, cap) - prev) * rate
          prev = cap
          if (taxable <= prev) break
        }
        return tax
      }
      const taxableBefore = Math.max(0, v.current_income - v.deduction)
      const taxableAfter = Math.max(0, v.current_income + v.convert_amount - v.deduction)
      const taxBefore = calcTax(taxableBefore)
      const taxAfter = calcTax(taxableAfter)
      const conversionTax = taxAfter - taxBefore
      const margRate = v.convert_amount > 0 ? (conversionTax / v.convert_amount) * 100 : 0
      return {
        primary: { value: parseFloat(conversionTax.toFixed(2)), label: 'Tax Cost of Conversion', fmt: 'usd' },
        details: [
          { l: 'Effective Rate on Conversion', v: parseFloat(margRate.toFixed(2)), fmt: 'pct' },
          { l: 'Amount Converted', v: v.convert_amount, fmt: 'usd' },
          { l: 'Roth Value (Tax-Free Growth)', v: v.convert_amount, fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'Conversions are most valuable when done in low-income years or before tax rates rise.',
      }
    },
    about: 'Roth conversions make sense when current marginal rates are lower than expected future rates — particularly in early retirement years before Social Security or RMDs begin. The "break-even" point typically ranges from 5–15 years depending on investment returns and tax bracket differential.',
    related: ['traditional-vs-roth-ira-calculator', 'roth-ira-calculator', 'required-minimum-distribution-calculator'],
  },
]
