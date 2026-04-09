import type { ToolConfig } from './types'

export const careerTools: ToolConfig[] = [
  {
    slug: 'salary-comparison-tool',
    title: 'Salary Comparison Tool',
    desc: 'Compare two job offers side by side with salary, benefits, and perks.',
    cat: 'career',
    icon: '💼',
    toolType: 'estimator',
    fields: [
      { k: 'salary_a', l: 'Job A — Annual Salary', type: 'number', placeholder: '95000', unit: '$' },
      { k: 'bonus_a', l: 'Job A — Annual Bonus', type: 'number', placeholder: '10000', unit: '$' },
      { k: '401k_a', l: 'Job A — 401(k) Match (%)', type: 'number', placeholder: '4', unit: '%' },
      { k: 'salary_b', l: 'Job B — Annual Salary', type: 'number', placeholder: '110000', unit: '$' },
      { k: 'bonus_b', l: 'Job B — Annual Bonus', type: 'number', placeholder: '5000', unit: '$' },
      { k: '401k_b', l: 'Job B — 401(k) Match (%)', type: 'number', placeholder: '3', unit: '%' },
    ],
    fn: (inputs) => {
      const sA = parseFloat(inputs.salary_a) || 0, bonA = parseFloat(inputs.bonus_a) || 0, matchA = (parseFloat(inputs['401k_a']) || 0) / 100
      const sB = parseFloat(inputs.salary_b) || 0, bonB = parseFloat(inputs.bonus_b) || 0, matchB = (parseFloat(inputs['401k_b']) || 0) / 100
      const totalA = sA + bonA + sA * matchA, totalB = sB + bonB + sB * matchB
      const diff = totalA - totalB
      return [{
        type: 'table', label: 'Job Offer Comparison', content: [
          { label: 'Job A — Total Compensation', value: `$${totalA.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Job B — Total Compensation', value: `$${totalB.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: '401(k) match value — A', value: `$${(sA * matchA).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: '401(k) match value — B', value: `$${(sB * matchB).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Difference', value: `$${Math.abs(diff).toLocaleString(undefined, { maximumFractionDigits: 0 })} in favor of ${diff >= 0 ? 'Job A' : 'Job B'}` },
          { label: '5-year difference', value: `$${(Math.abs(diff) * 5).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ]
      }]
    },
    about: 'Total compensation includes salary, bonus, 401(k) match, equity, health insurance, PTO, and perks. A 4% 401(k) match on a $100K salary is worth $4,000 — equivalent to a 4% raise. Health insurance premiums can vary $5,000–$15,000 annually between employers.',
    related: ['job-offer-calculator', 'benefits-value-calculator', 'hourly-to-annual-converter'],
  },
  {
    slug: 'job-offer-calculator',
    title: 'Job Offer Net Pay Calculator',
    desc: 'Calculate take-home pay from a job offer, accounting for taxes and benefits.',
    cat: 'career',
    icon: '🤝',
    toolType: 'estimator',
    fields: [
      { k: 'salary', l: 'Annual Salary', type: 'number', placeholder: '85000', unit: '$' },
      { k: 'state_tax', l: 'State Tax Rate (approx)', type: 'number', placeholder: '5', unit: '%' },
      { k: '401k', l: '401(k) Contribution (%)', type: 'number', placeholder: '6', unit: '%' },
      { k: 'health', l: 'Monthly Health Premium (employee share)', type: 'number', placeholder: '200', unit: '$' },
    ],
    fn: (inputs) => {
      const salary = parseFloat(inputs.salary) || 0, stateTax = (parseFloat(inputs.state_tax) || 0) / 100, k401 = (parseFloat(inputs['401k']) || 0) / 100, healthMonthly = parseFloat(inputs.health) || 0
      const federalTax = salary < 48476 ? salary * 0.22 : salary < 103350 ? salary * 0.24 : salary * 0.32 // rough estimate
      const fica = Math.min(salary, 176100) * 0.0765
      const stateT = salary * stateTax
      const k401Amount = salary * k401
      const healthAnnual = healthMonthly * 12
      const takeHome = salary - federalTax - fica - stateT - k401Amount - healthAnnual
      return [{
        type: 'table', label: 'Estimated Annual Take-Home', content: [
          { label: 'Gross salary', value: `$${salary.toLocaleString()}` },
          { label: 'Federal income tax (est.)', value: `-$${federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'FICA (Social Security + Medicare)', value: `-$${fica.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'State income tax (est.)', value: `-$${stateT.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: '401(k) contribution', value: `-$${k401Amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Health premiums', value: `-$${healthAnnual.toLocaleString()}` },
          { label: 'Estimated net take-home', value: `$${Math.max(0, takeHome).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Monthly take-home', value: `$${Math.max(0, takeHome / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ]
      }]
    },
    about: 'This is an estimate using simplified tax brackets. Your actual tax will depend on deductions, filing status, and other income. Use the IRS Withholding Estimator tool for precise calculations. 401(k) contributions reduce your taxable income.',
    related: ['salary-comparison-tool', 'benefits-value-calculator', 'federal-tax-brackets-2025'],
  },
  {
    slug: 'hourly-to-annual-converter',
    title: 'Hourly to Annual Salary Converter',
    desc: 'Convert hourly wage to annual salary, or salary to hourly rate.',
    cat: 'career',
    icon: '⏰',
    toolType: 'converter',
    fields: [
      { k: 'amount', l: 'Amount', type: 'number', placeholder: '25' },
      {
        k: 'from',
        l: 'From',
        type: 'select',
        options: [
          { value: 'hourly', label: 'Hourly wage' },
          { value: 'annual', label: 'Annual salary' },
          { value: 'monthly', label: 'Monthly salary' },
          { value: 'weekly', label: 'Weekly pay' },
          { value: 'biweekly', label: 'Biweekly pay' },
        ],
      },
      { k: 'hours', l: 'Hours per Week', type: 'number', placeholder: '40' },
    ],
    fn: (inputs) => {
      const amt = parseFloat(inputs.amount) || 0, hrs = parseFloat(inputs.hours) || 40
      const annualWork = hrs * 52
      let annual: number
      if (inputs.from === 'hourly') annual = amt * annualWork
      else if (inputs.from === 'annual') annual = amt
      else if (inputs.from === 'monthly') annual = amt * 12
      else if (inputs.from === 'weekly') annual = amt * 52
      else annual = amt * 26 // biweekly
      const hourly = annual / annualWork
      return [{
        type: 'table', label: 'Salary Conversions', content: [
          { label: 'Hourly', value: `$${hourly.toFixed(2)}/hr` },
          { label: 'Weekly (40 hrs)', value: `$${(hourly * hrs).toFixed(2)}` },
          { label: 'Biweekly (26 checks)', value: `$${(annual / 26).toFixed(2)}` },
          { label: 'Semimonthly (24 checks)', value: `$${(annual / 24).toFixed(2)}` },
          { label: 'Monthly', value: `$${(annual / 12).toFixed(2)}` },
          { label: 'Annual', value: `$${annual.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
        ]
      }]
    },
    about: 'A full-time work year is typically 2,080 hours (52 weeks × 40 hours). The federal minimum wage of $7.25/hr equals $15,080/year. $15/hr equals $31,200/year; $25/hr equals $52,000/year. Overtime at 1.5× rate changes these calculations significantly.',
    related: ['minimum-wage-by-state-2025', 'salary-comparison-tool', 'commute-cost-calculator'],
  },
  {
    slug: 'commute-cost-calculator',
    title: 'Commute Cost Calculator',
    desc: 'Calculate the true annual cost of your daily commute by car, transit, or both.',
    cat: 'career',
    icon: '🚗',
    toolType: 'estimator',
    fields: [
      { k: 'miles', l: 'One-Way Commute Distance (miles)', type: 'number', placeholder: '15' },
      { k: 'mpg', l: 'Car MPG', type: 'number', placeholder: '30' },
      { k: 'gas', l: 'Gas Price ($/gallon)', type: 'number', placeholder: '3.50', unit: '$' },
      { k: 'parking', l: 'Monthly Parking Cost', type: 'number', placeholder: '100', unit: '$' },
      { k: 'days', l: 'Commute Days per Year', type: 'number', placeholder: '250' },
    ],
    fn: (inputs) => {
      const miles = parseFloat(inputs.miles) || 0, mpg = parseFloat(inputs.mpg) || 30, gas = parseFloat(inputs.gas) || 3.50, parking = parseFloat(inputs.parking) || 0, days = parseFloat(inputs.days) || 250
      const roundTripMiles = miles * 2 * days
      const fuelCost = (roundTripMiles / mpg) * gas
      const wearTear = roundTripMiles * 0.063 // IRS mileage rate minus gas portion ~$0.063/mile
      const parkingAnnual = parking * 12
      const totalCost = fuelCost + wearTear + parkingAnnual
      const hoursPerYear = (miles * 2 / 30) * days // assuming 30 mph avg
      return [{
        type: 'table', label: 'Annual Commute Costs', content: [
          { label: 'Annual commute miles', value: roundTripMiles.toLocaleString() },
          { label: 'Fuel cost', value: `$${fuelCost.toFixed(0)}` },
          { label: 'Wear & tear (~$0.063/mi)', value: `$${wearTear.toFixed(0)}` },
          { label: 'Parking', value: `$${parkingAnnual.toFixed(0)}` },
          { label: 'Total annual cost', value: `$${totalCost.toFixed(0)}` },
          { label: 'Hours commuting per year', value: `${hoursPerYear.toFixed(0)} hours` },
          { label: 'Equivalent hourly pay lost', value: `$${(totalCost / hoursPerYear).toFixed(2)}/hr` },
        ]
      }]
    },
    about: 'The 2025 IRS standard mileage rate is 70 cents/mile for business driving. The true cost of vehicle ownership (including depreciation) is about $0.40–$0.60/mile for the average American car. A 30-mile round trip commute costs $4,000–$8,000+ per year.',
    related: ['remote-work-savings-calculator', 'gas-vs-electric-car-calculator', 'fuel-efficiency-converter'],
  },
  {
    slug: 'remote-work-savings-calculator',
    title: 'Remote Work Savings Calculator',
    desc: 'Calculate money and time saved by working from home instead of commuting.',
    cat: 'career',
    icon: '🏠',
    toolType: 'estimator',
    fields: [
      { k: 'commute_cost', l: 'Daily Commute Cost (gas + parking)', type: 'number', placeholder: '15', unit: '$' },
      { k: 'lunch_savings', l: 'Daily Lunch Savings (vs eating out)', type: 'number', placeholder: '10', unit: '$' },
      { k: 'wardrobe', l: 'Annual Wardrobe/Dry Cleaning Savings', type: 'number', placeholder: '800', unit: '$' },
      { k: 'commute_hrs', l: 'Daily Commute Hours Saved', type: 'number', placeholder: '1.5' },
      { k: 'days', l: 'Remote Days per Year', type: 'number', placeholder: '250' },
    ],
    fn: (inputs) => {
      const commuteDay = parseFloat(inputs.commute_cost) || 0, lunchDay = parseFloat(inputs.lunch_savings) || 0, wardrobe = parseFloat(inputs.wardrobe) || 0, commuteHrs = parseFloat(inputs.commute_hrs) || 0, days = parseFloat(inputs.days) || 250
      const commuteSavings = commuteDay * days
      const lunchSavings = lunchDay * days
      const total = commuteSavings + lunchSavings + wardrobe
      const timeSaved = commuteHrs * days
      return [{
        type: 'table', label: 'Annual Remote Work Savings', content: [
          { label: 'Commute savings', value: `$${commuteSavings.toLocaleString()}` },
          { label: 'Lunch savings', value: `$${lunchSavings.toLocaleString()}` },
          { label: 'Wardrobe savings', value: `$${wardrobe.toLocaleString()}` },
          { label: 'Total annual savings', value: `$${total.toLocaleString()}` },
          { label: 'Time reclaimed per year', value: `${timeSaved.toFixed(0)} hours` },
          { label: 'Time saved in work weeks', value: `${(timeSaved / 40).toFixed(1)} work weeks` },
        ]
      }]
    },
    about: 'Stanford researcher Nicholas Bloom found fully remote workers save on average $4,000–$11,000 per year on commuting, clothing, and food. However, remote work can increase home energy costs by $100–$200/month. Hybrid workers (3 days remote) save proportionally.',
    related: ['commute-cost-calculator', 'energy-usage-estimator', 'salary-comparison-tool'],
  },
  {
    slug: 'freelance-rate-finder',
    title: 'Freelance Rate Calculator',
    desc: 'Calculate the hourly rate needed as a freelancer to match or beat a salaried position.',
    cat: 'career',
    icon: '💻',
    toolType: 'estimator',
    fields: [
      { k: 'target_income', l: 'Target Annual Income', type: 'number', placeholder: '80000', unit: '$' },
      { k: 'billable_hrs', l: 'Billable Hours per Week', type: 'number', placeholder: '25' },
      { k: 'weeks', l: 'Billable Weeks per Year', type: 'number', placeholder: '48' },
      { k: 'expenses', l: 'Annual Business Expenses', type: 'number', placeholder: '5000', unit: '$' },
    ],
    fn: (inputs) => {
      const target = parseFloat(inputs.target_income) || 0, billableHrs = parseFloat(inputs.billable_hrs) || 25, weeks = parseFloat(inputs.weeks) || 48, expenses = parseFloat(inputs.expenses) || 0
      const selfEmploymentTax = target * 0.1413 // ~14.13% SE tax (after deduction)
      const totalNeeded = target + selfEmploymentTax + expenses
      const totalBillableHrs = billableHrs * weeks
      const hourlyRate = totalNeeded / totalBillableHrs
      const equivalentSalary = totalNeeded // approximate
      return [{
        type: 'table', label: 'Freelance Rate Analysis', content: [
          { label: 'Target net income', value: `$${target.toLocaleString()}` },
          { label: 'Self-employment tax (~15.3%)', value: `$${selfEmploymentTax.toFixed(0)}` },
          { label: 'Business expenses', value: `$${expenses.toLocaleString()}` },
          { label: 'Total gross needed', value: `$${totalNeeded.toFixed(0)}` },
          { label: 'Billable hours per year', value: totalBillableHrs.toString() },
          { label: 'Minimum hourly rate', value: `$${hourlyRate.toFixed(2)}/hr` },
          { label: 'Monthly billing target', value: `$${(totalNeeded / 12).toFixed(0)}` },
        ]
      }]
    },
    about: 'Freelancers pay 15.3% self-employment tax on top of income tax (they can deduct half the SE tax). Health insurance, retirement contributions, equipment, and software are deductible business expenses. Industry benchmarks: freelance devs charge $75–$200/hr; designers $50–$150/hr.',
    related: ['contractor-vs-employee-calculator', 'gig-economy-tax-guide', 'side-hustle-income-calculator'],
  },
  {
    slug: 'benefits-value-calculator',
    title: 'Employee Benefits Value Calculator',
    desc: 'Estimate the dollar value of benefits like health insurance, 401(k) match, and PTO.',
    cat: 'career',
    icon: '🎁',
    toolType: 'estimator',
    fields: [
      { k: 'health', l: 'Employer Health Insurance Contribution (monthly)', type: 'number', placeholder: '600', unit: '$' },
      { k: 'salary', l: 'Annual Salary', type: 'number', placeholder: '80000', unit: '$' },
      { k: 'match', l: '401(k) Match (%)', type: 'number', placeholder: '4', unit: '%' },
      { k: 'pto', l: 'PTO Days per Year', type: 'number', placeholder: '20' },
    ],
    fn: (inputs) => {
      const health = parseFloat(inputs.health) || 0, salary = parseFloat(inputs.salary) || 0, matchPct = (parseFloat(inputs.match) || 0) / 100, pto = parseFloat(inputs.pto) || 0
      const healthAnnual = health * 12
      const matchValue = salary * matchPct
      const ptoValue = (salary / 260) * pto
      const lifeDentalVision = 2400 // industry average for life + dental + vision
      const total = healthAnnual + matchValue + ptoValue + lifeDentalVision
      return [{
        type: 'table', label: 'Benefits Value', content: [
          { label: 'Health insurance (employer pays)', value: `$${healthAnnual.toLocaleString()}` },
          { label: '401(k) employer match', value: `$${matchValue.toLocaleString()}` },
          { label: `PTO (${pto} days)`, value: `$${ptoValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Life/Dental/Vision (est.)', value: `$${lifeDentalVision.toLocaleString()}` },
          { label: 'Total benefits value', value: `$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Total comp (salary + benefits)', value: `$${(salary + total).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Benefits as % of salary', value: `${(total / salary * 100).toFixed(1)}%` },
        ]
      }]
    },
    about: 'Employer health insurance contributions average $7,000–$15,000 per year per employee. Total benefits typically add 25–40% on top of base salary. The COBRA cost (what you\'d pay without employer subsidy) reveals the true value of employer-provided health coverage.',
    related: ['job-offer-calculator', 'salary-comparison-tool', 'cobra-cost-calculator'],
  },
  {
    slug: 'cobra-cost-calculator',
    title: 'COBRA Insurance Cost Calculator',
    desc: 'Estimate monthly COBRA continuation health insurance costs after leaving a job.',
    cat: 'career',
    icon: '🏥',
    toolType: 'estimator',
    fields: [
      { k: 'employer_pays', l: 'Employer Monthly Premium (total plan cost)', type: 'number', placeholder: '800', unit: '$' },
      { k: 'employee_pays', l: 'Your Current Monthly Premium', type: 'number', placeholder: '200', unit: '$' },
      {
        k: 'coverage',
        l: 'Coverage Type',
        type: 'select',
        options: [{ value: '1', label: 'Individual' }, { value: '2.75', label: 'Employee + Spouse' }, { value: '3.0', label: 'Family' }],
      },
    ],
    fn: (inputs) => {
      const totalPremium = parseFloat(inputs.employer_pays) || 0, employeePays = parseFloat(inputs.employee_pays) || 0
      const cobraRate = totalPremium + totalPremium * 0.02 // 2% admin fee
      const cobraFamily = cobraRate * (parseFloat(inputs.coverage) || 1)
      const savings6mo = (cobraFamily - employeePays) * 6
      return [{
        type: 'table', label: 'COBRA Cost Estimate', content: [
          { label: 'Your current premium', value: `$${employeePays.toFixed(0)}/month` },
          { label: 'Full plan premium (est.)', value: `$${totalPremium.toFixed(0)}/month` },
          { label: 'COBRA cost (+ 2% admin)', value: `$${cobraRate.toFixed(0)}/month` },
          { label: 'Increase over current pay', value: `+$${(cobraRate - employeePays).toFixed(0)}/month` },
          { label: 'COBRA duration allowed', value: '18 months (36 for disability/divorce)' },
          { label: '6-month COBRA cost', value: `$${(cobraFamily * 6).toFixed(0)}` },
          { label: 'Tip', value: 'Compare to ACA marketplace plans — often cheaper' },
        ]
      }]
    },
    about: 'COBRA requires you to pay the full premium your employer was paying, plus a 2% administrative fee. Average family COBRA costs $1,700–$2,200/month (2025). ACA marketplace plans with subsidies are often less expensive; apply within 60 days of job loss to avoid gaps.',
    related: ['benefits-value-calculator', 'hsa-contribution-limits-2025', 'job-offer-calculator'],
  },
  {
    slug: 'equity-offer-evaluator',
    title: 'Equity Offer Evaluator',
    desc: 'Estimate the potential value of startup stock options or equity grants.',
    cat: 'career',
    icon: '📈',
    toolType: 'estimator',
    fields: [
      { k: 'options', l: 'Number of Options/Shares', type: 'number', placeholder: '10000' },
      { k: 'strike', l: 'Strike Price ($)', type: 'number', placeholder: '2.50', unit: '$' },
      { k: 'current_val', l: 'Current Share Price / Valuation ($/share)', type: 'number', placeholder: '5.00', unit: '$' },
      { k: 'exit_multiple', l: 'Expected Exit Multiple (e.g., 5 = 5×)', type: 'number', placeholder: '5' },
      { k: 'dilution', l: 'Expected Dilution (%)', type: 'number', placeholder: '30', unit: '%' },
    ],
    fn: (inputs) => {
      const options = parseFloat(inputs.options) || 0, strike = parseFloat(inputs.strike) || 0, current = parseFloat(inputs.current_val) || 0, multiple = parseFloat(inputs.exit_multiple) || 1, dilution = (parseFloat(inputs.dilution) || 0) / 100
      const exitPrice = current * multiple
      const postDilutionOptions = options * (1 - dilution)
      const grossValue = postDilutionOptions * (exitPrice - strike)
      const taxRate = 0.37 // assume top rate for simplicity; ISOs taxed differently
      const netValue = Math.max(0, grossValue * (1 - taxRate))
      return [{
        type: 'table', label: 'Equity Estimate', content: [
          { label: 'Options (post-dilution)', value: postDilutionOptions.toLocaleString(undefined, { maximumFractionDigits: 0 }) },
          { label: 'Expected exit price', value: `$${exitPrice.toFixed(2)}/share` },
          { label: 'Gross value at exit', value: `$${Math.max(0, grossValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'After tax (est. 37%)', value: `$${netValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Current intrinsic value', value: `$${Math.max(0, options * (current - strike)).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Note', value: 'ISOs have different tax treatment; consult a tax advisor' },
        ]
      }]
    },
    about: 'Employee stock options have a strike price (what you pay to buy the stock). ISOs (Incentive Stock Options) have favorable tax treatment; NQSOs (Non-Qualified) are taxed as ordinary income on exercise. Dilution from future funding rounds reduces your percentage ownership.',
    related: ['rsu-value-calculator', 'signing-bonus-net-calculator', 'capital-gains-rates-2025'],
  },
  {
    slug: 'rsu-value-calculator',
    title: 'RSU Value Calculator',
    desc: 'Calculate the after-tax value of Restricted Stock Unit grants at vesting.',
    cat: 'career',
    icon: '🏦',
    toolType: 'estimator',
    fields: [
      { k: 'shares', l: 'Total RSU Shares', type: 'number', placeholder: '2000' },
      { k: 'price', l: 'Current Share Price', type: 'number', placeholder: '150', unit: '$' },
      { k: 'vest_years', l: 'Vesting Period (years)', type: 'number', placeholder: '4' },
      { k: 'income_rate', l: 'Your Marginal Tax Rate (%)', type: 'number', placeholder: '32', unit: '%' },
    ],
    fn: (inputs) => {
      const shares = parseFloat(inputs.shares) || 0, price = parseFloat(inputs.price) || 0, years = parseFloat(inputs.vest_years) || 4, taxRate = (parseFloat(inputs.income_rate) || 32) / 100
      const totalValue = shares * price
      const perYear = totalValue / years
      const afterTaxTotal = totalValue * (1 - taxRate)
      const afterTaxPerYear = perYear * (1 - taxRate)
      const ficaOnFirst = Math.min(176100, perYear) * 0.0765
      return [{
        type: 'table', label: 'RSU Value', content: [
          { label: 'Total grant value', value: `$${totalValue.toLocaleString()}` },
          { label: 'Annual vest value', value: `$${perYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'After income tax (est.)', value: `$${afterTaxTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'After-tax annual vest', value: `$${afterTaxPerYear.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'FICA on first year vest', value: `~$${ficaOnFirst.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Note', value: 'RSUs are taxed as ordinary income at vesting, not capital gains' },
        ]
      }]
    },
    about: 'RSUs are taxed as ordinary income at vesting — the FMV on vesting date is your cost basis. If you hold shares after vesting, any subsequent gain is taxed at capital gains rates (long-term if held 1+ year). Many employees sell shares at vesting to cover the immediate tax bill.',
    related: ['equity-offer-evaluator', 'capital-gains-rates-2025', 'salary-comparison-tool'],
  },
  {
    slug: 'signing-bonus-net-calculator',
    title: 'Signing Bonus Net Calculator',
    desc: 'Calculate the net after-tax value of a signing bonus.',
    cat: 'career',
    icon: '✍️',
    toolType: 'estimator',
    fields: [
      { k: 'bonus', l: 'Gross Signing Bonus', type: 'number', placeholder: '20000', unit: '$' },
      { k: 'marginal', l: 'Marginal Tax Rate (%)', type: 'number', placeholder: '32', unit: '%' },
      { k: 'state_rate', l: 'State Tax Rate (%)', type: 'number', placeholder: '5', unit: '%' },
    ],
    fn: (inputs) => {
      const bonus = parseFloat(inputs.bonus) || 0, federal = (parseFloat(inputs.marginal) || 32) / 100, state = (parseFloat(inputs.state_rate) || 0) / 100
      const fica = Math.min(bonus, 176100) * 0.0765
      const federalTax = bonus * federal
      const stateTax = bonus * state
      const total = federalTax + stateTax + fica
      const net = bonus - total
      return [{
        type: 'table', label: 'Signing Bonus Breakdown', content: [
          { label: 'Gross signing bonus', value: `$${bonus.toLocaleString()}` },
          { label: 'Federal income tax', value: `-$${federalTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'State income tax', value: `-$${stateTax.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'FICA (~7.65%)', value: `-$${fica.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Net after tax', value: `$${net.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Effective tax rate', value: `${(total / bonus * 100).toFixed(1)}%` },
          { label: 'Clawback note', value: 'Most bonuses require repayment if you leave within 1–2 years' },
        ]
      }]
    },
    about: 'Signing bonuses are taxed as supplemental wages at a flat 22% federal rate for amounts under $1M (37% above $1M), plus state taxes and FICA. This is often higher than your effective rate, which may result in a refund when you file taxes. Most include clawback provisions.',
    related: ['salary-comparison-tool', 'raise-request-calculator', 'rsu-value-calculator'],
  },
  {
    slug: 'raise-request-calculator',
    title: 'Raise Request Calculator',
    desc: 'Calculate the monthly and annual impact of a salary raise and build your ask.',
    cat: 'career',
    icon: '📈',
    toolType: 'estimator',
    fields: [
      { k: 'current', l: 'Current Annual Salary', type: 'number', placeholder: '75000', unit: '$' },
      { k: 'pct', l: 'Raise Percentage Requested', type: 'number', placeholder: '10', unit: '%' },
    ],
    fn: (inputs) => {
      const current = parseFloat(inputs.current) || 0, pct = (parseFloat(inputs.pct) || 10) / 100
      const raise = current * pct
      const newSalary = current + raise
      const monthly = raise / 12
      const inflation2024 = 0.029
      const realRaise = pct - inflation2024
      return [{
        type: 'table', label: 'Raise Impact', content: [
          { label: 'Current salary', value: `$${current.toLocaleString()}` },
          { label: 'Raise amount', value: `$${raise.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'New salary', value: `$${newSalary.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Monthly increase', value: `$${monthly.toFixed(2)}` },
          { label: '5-year cumulative impact', value: `$${(raise * 5).toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Real raise after 2.9% inflation', value: `${(realRaise * 100).toFixed(1)}%` },
          { label: 'Average 2025 raise (US workers)', value: '~4%' },
        ]
      }]
    },
    about: 'Average US salary increases in 2025 are projected at 3.5–4.5% (WorldatWork). High performers typically receive 5–8%; COLA adjustments 2–3%. Annual compounding makes early raises significant — a $5K raise today grows to $27K more over 10 years at 3% annual increases.',
    related: ['salary-comparison-tool', 'signing-bonus-net-calculator', 'promotion-readiness-checklist'],
  },
  {
    slug: 'unemployment-benefits-estimator',
    title: 'Unemployment Benefits Estimator',
    desc: 'Estimate weekly unemployment benefit amounts based on your recent wages.',
    cat: 'career',
    icon: '📋',
    toolType: 'estimator',
    fields: [
      { k: 'quarterly_wages', l: 'Highest Quarterly Wages (past 18 months)', type: 'number', placeholder: '20000', unit: '$' },
      {
        k: 'state',
        l: 'State',
        type: 'select',
        options: [
          { value: 'CA', label: 'California (max $450/wk)' },
          { value: 'TX', label: 'Texas (max $563/wk)' },
          { value: 'NY', label: 'New York (max $504/wk)' },
          { value: 'FL', label: 'Florida (max $275/wk)' },
          { value: 'WA', label: 'Washington (max $1,019/wk)' },
          { value: 'MA', label: 'Massachusetts (max $1,033/wk)' },
          { value: 'IL', label: 'Illinois (max $742/wk)' },
          { value: 'OTHER', label: 'Other state' },
        ],
      },
    ],
    fn: (inputs) => {
      const wages = parseFloat(inputs.quarterly_wages) || 0
      const maxBenefits: Record<string, number> = { CA: 450, TX: 563, NY: 504, FL: 275, WA: 1019, MA: 1033, IL: 742, OTHER: 500 }
      const max = maxBenefits[inputs.state] || 500
      const weekly = Math.min(max, wages / 26 * 0.47) // rough formula: ~47% of avg weekly wage
      const maxWeeks = inputs.state === 'MA' ? 30 : inputs.state === 'WA' ? 26 : inputs.state === 'CA' ? 26 : 26
      return [{
        type: 'table', label: 'Unemployment Estimate', content: [
          { label: 'Estimated weekly benefit', value: `$${weekly.toFixed(2)}` },
          { label: 'State max weekly benefit', value: `$${max}` },
          { label: 'Estimated weekly (before max cap)', value: `$${(wages / 26 * 0.47).toFixed(2)}` },
          { label: 'Max weeks available', value: `${maxWeeks} weeks` },
          { label: 'Estimated total benefits', value: `$${(weekly * maxWeeks).toFixed(0)}` },
          { label: 'Note', value: 'Actual benefits require state agency determination' },
        ]
      }]
    },
    about: 'Unemployment insurance is administered by states and funded by employer payroll taxes (FUTA/SUTA). Benefits replace approximately 45–50% of prior wages, capped at the state maximum. Benefits are taxable income — federal and state income taxes apply.',
    related: ['cobra-cost-calculator', 'emergency-fund-checker', 'severance-package-evaluator'],
  },
  {
    slug: 'severance-package-evaluator',
    title: 'Severance Package Evaluator',
    desc: 'Evaluate a severance package and compare it to what you might be entitled to.',
    cat: 'career',
    icon: '📃',
    toolType: 'estimator',
    fields: [
      { k: 'years', l: 'Years of Service', type: 'number', placeholder: '5' },
      { k: 'salary', l: 'Annual Salary', type: 'number', placeholder: '85000', unit: '$' },
      { k: 'offered_weeks', l: 'Weeks of Severance Offered', type: 'number', placeholder: '8' },
    ],
    fn: (inputs) => {
      const years = parseFloat(inputs.years) || 0, salary = parseFloat(inputs.salary) || 0, offeredWeeks = parseFloat(inputs.offered_weeks) || 0
      const weeklyPay = salary / 52
      const standardWeeks = years * 2 // industry standard: 2 weeks per year
      const offeredAmount = offeredWeeks * weeklyPay
      const standardAmount = standardWeeks * weeklyPay
      const diff = offeredAmount - standardAmount
      return [{
        type: 'table', label: 'Severance Analysis', content: [
          { label: 'Weekly pay', value: `$${weeklyPay.toFixed(2)}` },
          { label: 'Offered severance', value: `${offeredWeeks} weeks = $${offeredAmount.toFixed(0)}` },
          { label: 'Industry standard (2 wks/yr)', value: `${standardWeeks} weeks = $${standardAmount.toFixed(0)}` },
          { label: 'vs Standard', value: diff >= 0 ? `Above standard by $${diff.toFixed(0)}` : `Below standard by $${Math.abs(diff).toFixed(0)}` },
          { label: 'After 22% federal withholding', value: `$${(offeredAmount * 0.78).toFixed(0)}` },
          { label: 'Note', value: 'Negotiate! Severance is not legally required in most states' },
        ]
      }]
    },
    about: 'No federal law requires severance pay. Industry standard is 1–2 weeks per year of service for mid-level employees; more for executives. Severance agreements typically include a release of claims waiver — you give up the right to sue. Review with an employment attorney for amounts over $20,000.',
    related: ['unemployment-benefits-estimator', 'cobra-cost-calculator', 'emergency-fund-checker'],
  },
  {
    slug: 'contractor-vs-employee-calculator',
    title: 'Contractor vs Employee Calculator',
    desc: 'Compare net income as a W-2 employee vs 1099 contractor at the same gross pay.',
    cat: 'career',
    icon: '⚖️',
    toolType: 'estimator',
    fields: [
      { k: 'income', l: 'Annual Gross Income', type: 'number', placeholder: '100000', unit: '$' },
      { k: 'state_tax', l: 'State Income Tax Rate (%)', type: 'number', placeholder: '5', unit: '%' },
      { k: 'employer_benefits', l: 'Value of W-2 Benefits (health, 401k match etc.)', type: 'number', placeholder: '12000', unit: '$' },
    ],
    fn: (inputs) => {
      const income = parseFloat(inputs.income) || 0, stateTax = (parseFloat(inputs.state_tax) || 0) / 100, benefits = parseFloat(inputs.employer_benefits) || 0
      // W-2 employee
      const w2Fica = Math.min(income, 176100) * 0.0765
      const w2Federal = income * 0.24
      const w2State = income * stateTax
      const w2Net = income - w2Fica - w2Federal - w2State + benefits
      // 1099 contractor
      const seTax = income * 0.9235 * 0.153
      const seDeduction = seTax / 2
      const taxableIncome1099 = income - seDeduction
      const federal1099 = taxableIncome1099 * 0.24
      const state1099 = income * stateTax
      const c1099Net = income - seTax - federal1099 - state1099
      return [{
        type: 'table', label: 'W-2 vs 1099 Comparison', content: [
          { label: 'W-2 Net (with benefits)', value: `$${w2Net.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: '1099 Net', value: `$${c1099Net.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'W-2 FICA (employee portion)', value: `$${w2Fica.toFixed(0)}` },
          { label: '1099 Self-employment tax', value: `$${seTax.toFixed(0)}` },
          { label: 'Breakeven contractor rate', value: `$${((income + seTax + benefits) / income * income).toFixed(0)} (to match W-2)` },
        ]
      }]
    },
    about: 'A 1099 contractor pays both sides of FICA (15.3%) vs the W-2 employee who pays only 7.65% (employer pays the other half). To match W-2 compensation, contractors typically need to charge 25–40% more than the equivalent employee salary to cover taxes and self-funded benefits.',
    related: ['freelance-rate-finder', 'gig-economy-tax-guide', 'benefits-value-calculator'],
  },
  {
    slug: 'overtime-eligibility-checker',
    title: 'Overtime Eligibility Checker',
    desc: 'Check if you qualify for overtime pay under FLSA rules.',
    cat: 'career',
    icon: '⏰',
    toolType: 'checker',
    fields: [
      { k: 'salary', l: 'Annual Salary', type: 'number', placeholder: '50000', unit: '$' },
      {
        k: 'classification',
        l: 'Job Classification',
        type: 'select',
        options: [
          { value: 'hourly', label: 'Hourly employee' },
          { value: 'salaried_non_exempt', label: 'Salaried non-exempt' },
          { value: 'salaried_exempt', label: 'Salaried exempt (claimed by employer)' },
          { value: 'manager', label: 'Manager / Supervisor' },
          { value: 'professional', label: 'Professional (lawyer, doctor, engineer)' },
        ],
      },
    ],
    fn: (inputs) => {
      const salary = parseFloat(inputs.salary) || 0
      const weeklyRate = salary / 52
      const flsaThreshold2025 = 44000 // Updated 2025 DOL rule (pending litigation)
      const isExempt = inputs.classification === 'salaried_exempt' || inputs.classification === 'professional' || (inputs.classification === 'manager' && salary > flsaThreshold2025)
      const isLikelyExempt = salary > flsaThreshold2025 && inputs.classification !== 'hourly'
      return [{
        type: 'table', label: 'Overtime Eligibility', content: [
          { label: 'FLSA exempt salary threshold (2025)', value: '$684/week ($35,568/year)' },
          { label: 'Your weekly rate', value: `$${weeklyRate.toFixed(2)}` },
          { label: 'Likely classification', value: isExempt ? 'Exempt (likely no OT)' : salary < 35568 ? 'Non-exempt — entitled to 1.5× OT' : 'Depends on job duties' },
          { label: 'Overtime rate (if non-exempt)', value: `$${(salary / 2080 * 1.5).toFixed(2)}/hr` },
          { label: 'Note', value: 'Many states have higher thresholds — check your state law' },
        ]
      }]
    },
    about: 'The FLSA requires overtime (1.5× regular rate) for non-exempt employees working over 40 hours/week. Exemptions require both a salary test ($684+/week) AND a duties test. California, New York, and other states have stricter overtime rules that override federal law.',
    related: ['minimum-wage-by-state-2025', 'overtime-rules-by-state', 'hourly-to-annual-converter'],
  },
  {
    slug: 'gig-economy-tax-guide',
    title: 'Gig Economy Tax Guide',
    desc: 'Key tax rules and estimated quarterly payments for Uber, DoorDash, and freelance income.',
    cat: 'career',
    icon: '🚴',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Gig Economy Tax Reference', content: [
        { label: 'Self-employment tax rate', value: '15.3% on net earnings (SS + Medicare)' },
        { label: 'SE tax deduction', value: 'Deduct 50% of SE tax from taxable income' },
        { label: '1099-NEC threshold', value: '$600+ from a single payer' },
        { label: '1099-K threshold (2025)', value: '$2,500 (phasing down to $600 by 2026)' },
        { label: 'Quarterly estimated tax due', value: 'April 15, June 15, Sept 15, Jan 15' },
        { label: 'Safe harbor rule (to avoid penalty)', value: 'Pay 100% of prior year tax OR 90% of current year' },
        { label: 'Mileage deduction (2025)', value: '70 cents/mile (business miles)' },
        { label: 'Vehicle actual expense deduction', value: 'Gas, insurance, depreciation (% business use)' },
        { label: 'Home office deduction', value: '$5/sq ft up to 300 sq ft (simplified method)' },
        { label: 'Health insurance deduction', value: '100% of premiums if self-employed' },
        { label: 'Solo 401(k) contribution limit', value: '$70,000 total (2025)' },
        { label: 'QBI deduction (Section 199A)', value: '20% of qualified business income (income limits apply)' },
      ]
    }],
    about: 'Gig workers must pay self-employment tax and make quarterly estimated payments. The failure-to-pay penalty is 0.5% per month on unpaid tax. Keep receipts for all business expenses — platform expenses, phone bills, supplies, and mileage are deductible.',
    related: ['freelance-rate-finder', 'contractor-vs-employee-calculator', 'side-hustle-income-calculator'],
  },
  {
    slug: 'side-hustle-income-calculator',
    title: 'Side Hustle Income Calculator',
    desc: 'Calculate net income and taxes from side hustle earnings alongside a W-2 job.',
    cat: 'career',
    icon: '💡',
    toolType: 'estimator',
    fields: [
      { k: 'w2_salary', l: 'W-2 Salary (annual)', type: 'number', placeholder: '70000', unit: '$' },
      { k: 'side_income', l: 'Annual Side Hustle Revenue', type: 'number', placeholder: '20000', unit: '$' },
      { k: 'side_expenses', l: 'Side Hustle Business Expenses', type: 'number', placeholder: '3000', unit: '$' },
    ],
    fn: (inputs) => {
      const w2 = parseFloat(inputs.w2_salary) || 0, sideRev = parseFloat(inputs.side_income) || 0, sideExp = parseFloat(inputs.side_expenses) || 0
      const sideNet = sideRev - sideExp
      const seTax = sideNet > 0 ? sideNet * 0.9235 * 0.153 : 0
      const seDeduction = seTax / 2
      const totalTaxable = w2 + sideNet - seDeduction
      const marginalRate = totalTaxable > 250525 ? 0.35 : totalTaxable > 197300 ? 0.32 : totalTaxable > 103350 ? 0.24 : 0.22
      const sideIncomeTax = sideNet * marginalRate
      const totalTax = seTax + sideIncomeTax
      const netSideIncome = sideNet - totalTax
      return [{
        type: 'table', label: 'Side Hustle After-Tax', content: [
          { label: 'Side hustle revenue', value: `$${sideRev.toLocaleString()}` },
          { label: 'Business expenses', value: `-$${sideExp.toLocaleString()}` },
          { label: 'Net side hustle income', value: `$${sideNet.toLocaleString()}` },
          { label: 'Self-employment tax', value: `-$${seTax.toFixed(0)}` },
          { label: 'Income tax on side hustle', value: `-$${sideIncomeTax.toFixed(0)}` },
          { label: 'Net after-tax side income', value: `$${netSideIncome.toFixed(0)}` },
          { label: 'Effective tax on side income', value: `${((totalTax / sideNet) * 100).toFixed(1)}%` },
        ]
      }]
    },
    about: 'Side hustle income is taxed at your marginal rate — the rate on your last dollar of W-2 income plus the self-employment tax. Reducing this rate requires business expense deductions. Even a $10,000 side hustle can generate $2,000+ in deductible business expenses.',
    related: ['gig-economy-tax-guide', 'freelance-rate-finder', 'contractor-vs-employee-calculator'],
  },
  {
    slug: 'labor-law-by-state-guide',
    title: 'Labor Law by State Guide',
    desc: 'Quick reference for state-specific labor laws on overtime, breaks, and termination.',
    cat: 'career',
    icon: '⚖️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'State Labor Law Highlights', content: [
        { label: 'California — rest breaks', value: '10 min paid per 4 hrs worked (required by law)' },
        { label: 'California — meal breaks', value: '30 min unpaid for shifts 5+ hrs' },
        { label: 'California — overtime', value: 'Daily OT (8+ hrs/day) + weekly 40+ hrs' },
        { label: 'New York — meal break', value: '30 min for shifts 6+ hrs' },
        { label: 'Texas — breaks', value: 'No state requirement (federal FLSA only)' },
        { label: 'Florida — breaks', value: 'No state requirement for adults' },
        { label: 'Most states — at-will employment', value: 'Employer can fire without cause (49 states)' },
        { label: 'Montana — exception', value: 'Good cause required after probationary period' },
        { label: 'Federal — FMLA eligibility', value: '12 months employed, 1,250 hrs, 50-employee workplace' },
        { label: 'Federal — FMLA duration', value: '12 weeks unpaid protected leave (26 for military caregiver)' },
        { label: 'Federal — WARN Act notice', value: '60-day notice for mass layoffs (100+ employees)' },
        { label: 'California — WARN Act', value: '60 days; triggers at 75+ employees' },
      ]
    }],
    about: 'Employment law varies significantly by state. California and New York offer the strongest worker protections; Texas and Florida follow federal minimums more closely. Always check your state\'s labor department website for current rules — many changed in 2023–2025.',
    related: ['overtime-rules-by-state', 'minimum-wage-by-state-2025', 'fmla-eligibility-checker'],
  },
  {
    slug: 'overtime-rules-by-state',
    title: 'Overtime Rules by State',
    desc: 'State overtime laws that exceed federal FLSA requirements.',
    cat: 'career',
    icon: '⏱️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'State Overtime Rules (vs Federal 40hr/week)', content: [
        { label: 'California', value: 'Daily OT: 1.5× after 8hrs; 2× after 12hrs; 2× on 7th consecutive day' },
        { label: 'Alaska', value: 'Daily OT: 1.5× after 8 hours worked' },
        { label: 'Nevada', value: 'Daily OT if earning ≤1.5× minimum wage (daily 8+ hr)' },
        { label: 'Colorado', value: 'Daily OT after 12 hours; 40-hr weekly (same as FLSA)' },
        { label: 'All other states (40+ states)', value: 'Follow FLSA: OT only after 40 hrs/week' },
        { label: 'Federal FLSA rate', value: '1.5× regular rate for all hours over 40/week' },
        { label: 'FLSA exempt salary threshold', value: '$684/week ($35,568/year) — 2025' },
        { label: 'California exempt threshold', value: '$1,320/week ($68,640/year) — 2025' },
        { label: 'New York exempt threshold', value: 'Varies by employer size and region ($1,161/week for NYC)' },
      ]
    }],
    about: 'Federal FLSA overtime kicks in at 40 hours per week. California is unique in also requiring overtime for any single day over 8 hours, meaning a 10-hour single day triggers OT even if the workweek total is under 40 hours. Alaska has similar daily OT provisions.',
    related: ['overtime-eligibility-checker', 'minimum-wage-by-state-2025', 'labor-law-by-state-guide'],
  },
  {
    slug: 'fmla-eligibility-checker',
    title: 'FMLA Eligibility Checker',
    desc: 'Check if you qualify for unpaid Family and Medical Leave Act protection.',
    cat: 'career',
    icon: '🏥',
    toolType: 'checker',
    fields: [
      { k: 'months_employed', l: 'Months at Current Employer', type: 'number', placeholder: '15' },
      { k: 'hours_worked', l: 'Hours Worked in Past 12 Months', type: 'number', placeholder: '1400' },
      { k: 'employer_size', l: 'Approximate Employer Headcount', type: 'number', placeholder: '75' },
    ],
    fn: (inputs) => {
      const months = parseFloat(inputs.months_employed) || 0, hrs = parseFloat(inputs.hours_worked) || 0, size = parseFloat(inputs.employer_size) || 0
      const eligible = months >= 12 && hrs >= 1250 && size >= 50
      const issues: string[] = []
      if (months < 12) issues.push(`Need ${12 - months} more months of service`)
      if (hrs < 1250) issues.push(`Need ${1250 - hrs} more hours worked in past year`)
      if (size < 50) issues.push('Employer must have 50+ employees (within 75 miles)')
      return [{
        type: 'table', label: 'FMLA Eligibility', content: [
          { label: 'Eligible for FMLA?', value: eligible ? 'Yes ✓' : 'No — see requirements below' },
          { label: 'Service requirement (12 months)', value: months >= 12 ? '✓ Met' : `✗ Only ${months} months` },
          { label: 'Hours requirement (1,250/year)', value: hrs >= 1250 ? '✓ Met' : `✗ Only ${hrs} hours` },
          { label: 'Employer size (50+ employees)', value: size >= 50 ? '✓ Met' : `✗ Only ${size} employees` },
          { label: 'FMLA leave duration', value: '12 weeks unpaid, job-protected' },
          { label: 'Note', value: 'Many states have broader paid family leave laws' },
        ]
      }]
    },
    about: 'FMLA protects your job (or an equivalent position) while you take up to 12 weeks of unpaid leave for qualifying reasons: childbirth, serious health condition, or care for a family member. Thirteen states plus DC have their own paid family leave programs extending these protections.',
    related: ['labor-law-by-state-guide', 'cobra-cost-calculator', 'unemployment-benefits-estimator'],
  },
  {
    slug: 'promotion-readiness-checklist',
    title: 'Promotion Readiness Checklist',
    desc: 'Assess your readiness for a promotion with key criteria managers evaluate.',
    cat: 'career',
    icon: '🏆',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Promotion Readiness Criteria', content: [
        { label: 'Performing at next-level responsibilities', value: 'Are you already doing the higher role\'s work?' },
        { label: 'Consistent above-average performance', value: 'Last 2+ review cycles at "exceeds expectations"' },
        { label: 'Managing or mentoring others', value: 'Even informally — shows leadership capacity' },
        { label: 'Visible to decision-makers', value: 'Have you presented to senior leadership?' },
        { label: 'Solving problems independently', value: 'No hand-holding required for major deliverables' },
        { label: 'Driving revenue or cost savings', value: 'Quantifiable impact documented' },
        { label: 'Strong relationships cross-functionally', value: 'Stakeholders vouch for your work' },
        { label: 'Expressed interest explicitly', value: 'Have you told your manager you want to be promoted?' },
        { label: 'Timing is right (headcount, budget)', value: 'Company\'s financial health and open roles matter' },
        { label: 'Your replacement is ready', value: 'Have you helped develop your backfill?' },
      ]
    }],
    about: 'Research by Korn Ferry found that 73% of managers promote employees who are already performing at the next level, not those ready to "grow into" the role. The most common mistake is assuming good performance alone leads to promotion without visibility and explicit advocacy.',
    related: ['raise-request-calculator', 'salary-comparison-tool', 'performance-review-self-assessment-guide'],
  },
  {
    slug: 'performance-review-self-assessment-guide',
    title: 'Performance Review Self-Assessment Guide',
    desc: 'Framework and prompts for writing an effective annual self-assessment.',
    cat: 'career',
    icon: '📋',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Self-Assessment Framework', content: [
        { label: 'Accomplishments (use metrics)', value: '"Reduced support tickets by 34% through documentation rewrite"' },
        { label: 'Quantify impact wherever possible', value: '$, %, time saved, users affected, tickets closed' },
        { label: 'Goals met vs. set', value: 'Reference goals set in last review — check off each one' },
        { label: 'Skills developed', value: 'List certifications, courses, new responsibilities taken on' },
        { label: 'Leadership / mentoring', value: 'Whom did you help? What projects did you lead?' },
        { label: 'Cross-functional collaboration', value: 'Name teams and projects you supported beyond your role' },
        { label: 'Challenges faced and overcome', value: 'Show resilience and problem-solving' },
        { label: 'Areas for growth (be strategic)', value: 'Acknowledge one area; frame as active development' },
        { label: 'Goals for next review period', value: 'Make them SMART and tie them to business objectives' },
        { label: 'Career development ask', value: 'Raise, promotion, stretch assignments, training budget' },
      ]
    }],
    about: 'Most companies use self-assessments to inform manager ratings. Be specific and quantitative — vague praise without numbers is forgettable. Collect data throughout the year (email compliments, metrics reports, project outcomes) rather than trying to recall them in December.',
    related: ['promotion-readiness-checklist', 'raise-request-calculator', 'salary-comparison-tool'],
  },
  {
    slug: 'salary-negotiation-guide',
    title: 'Salary Negotiation Reference',
    desc: 'Salary negotiation tactics, market percentile benchmarks, and scripts.',
    cat: 'career',
    icon: '🗣️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Salary Negotiation Reference', content: [
        { label: 'Research benchmarks', value: 'BLS OES, LinkedIn Salary, Glassdoor, Levels.fyi (tech)' },
        { label: 'Target ask range', value: 'Start 10–20% above your floor; they\'ll negotiate down' },
        { label: 'Never give first number (if possible)', value: '"What is the budgeted range for this role?"' },
        { label: 'Counter after initial offer', value: '85% of offers are negotiable; fewer than half of candidates try' },
        { label: 'Anchor high but not ridiculous', value: 'First offer anchors the negotiation — ask more than you expect' },
        { label: 'Use "I" not "we" language', value: '"I was hoping for..." not "We were thinking..."' },
        { label: 'Silence is powerful', value: 'State your number, then stop talking' },
        { label: 'Non-salary negotiables', value: 'Sign-on bonus, remote days, PTO, equity, start date' },
        { label: 'Get it in writing', value: 'Verbal offers are not binding' },
        { label: '10% raise = lifetime $500K+ impact', value: 'Compounding: every raise builds on all future salaries' },
      ]
    }],
    about: 'A Salary.com study found that 73% of employers expect candidates to negotiate, yet only 37% of workers always negotiate their salary. Negotiating a $5,000 higher starting salary can compound to $800,000+ in additional lifetime earnings when accounting for all raises, bonuses, and retirement contributions built on top of it.',
    related: ['raise-request-calculator', 'salary-comparison-tool', 'benefits-value-calculator'],
  },
  {
    slug: 'mba-roi-calculator',
    title: 'MBA ROI Calculator',
    desc: 'Calculate the return on investment for an MBA program over 10 years.',
    cat: 'career',
    icon: '🎓',
    toolType: 'estimator',
    fields: [
      { k: 'tuition', l: 'Total Tuition & Fees', type: 'number', placeholder: '150000', unit: '$' },
      { k: 'current_salary', l: 'Current Salary', type: 'number', placeholder: '80000', unit: '$' },
      { k: 'post_mba', l: 'Expected Post-MBA Salary', type: 'number', placeholder: '130000', unit: '$' },
      { k: 'years_school', l: 'Years in School (no full-time income)', type: 'number', placeholder: '2' },
    ],
    fn: (inputs) => {
      const tuition = parseFloat(inputs.tuition) || 0, current = parseFloat(inputs.current_salary) || 0, postMba = parseFloat(inputs.post_mba) || 0, years = parseFloat(inputs.years_school) || 2
      const opportunityCost = current * years
      const totalCost = tuition + opportunityCost
      const annualGain = postMba - current
      const paybackYears = totalCost / annualGain
      const tenYearROI = (annualGain * 10 - totalCost) / totalCost * 100
      return [{
        type: 'table', label: 'MBA ROI Analysis', content: [
          { label: 'Total investment (tuition + opportunity cost)', value: `$${totalCost.toLocaleString()}` },
          { label: 'Annual salary increase', value: `$${annualGain.toLocaleString()}` },
          { label: 'Payback period', value: `${paybackYears.toFixed(1)} years` },
          { label: '10-year net ROI', value: `${tenYearROI.toFixed(0)}%` },
          { label: '10-year cumulative gain', value: `$${(annualGain * 10).toLocaleString()}` },
          { label: 'Note', value: 'Excludes network value, career optionality, and geographic flexibility' },
        ]
      }]
    },
    about: 'Top MBA programs (Harvard, Wharton, Stanford) cost $200,000+ total with living expenses. Average post-MBA salary at top-10 schools is $170,000–$200,000 (class of 2024). Payback period averages 3–5 years. Part-time and online MBA programs have a better ROI profile for mid-career professionals.',
    related: ['certification-roi-calculator', 'salary-comparison-tool', 'raise-request-calculator'],
  },
  {
    slug: 'certification-roi-calculator',
    title: 'Certification ROI Calculator',
    desc: 'Calculate the return on investment for a professional certification.',
    cat: 'career',
    icon: '📜',
    toolType: 'estimator',
    fields: [
      { k: 'cert_cost', l: 'Certification Cost (exam + prep)', type: 'number', placeholder: '2000', unit: '$' },
      { k: 'study_hours', l: 'Study Hours Required', type: 'number', placeholder: '200' },
      { k: 'salary_increase', l: 'Expected Annual Salary Increase', type: 'number', placeholder: '8000', unit: '$' },
    ],
    fn: (inputs) => {
      const cost = parseFloat(inputs.cert_cost) || 0, hours = parseFloat(inputs.study_hours) || 0, increase = parseFloat(inputs.salary_increase) || 0
      const totalInvestment = cost + hours * 30 // $30/hr opportunity cost
      const payback = totalInvestment / increase * 12
      const roi5yr = (increase * 5 - totalInvestment) / totalInvestment * 100
      return [{
        type: 'table', label: 'Certification ROI', content: [
          { label: 'Exam/prep cost', value: `$${cost.toLocaleString()}` },
          { label: 'Study time value (200hrs × $30)', value: `$${(hours * 30).toLocaleString()}` },
          { label: 'Total investment', value: `$${totalInvestment.toLocaleString()}` },
          { label: 'Expected annual increase', value: `$${increase.toLocaleString()}` },
          { label: 'Payback period', value: `${payback.toFixed(1)} months` },
          { label: '5-year ROI', value: `${roi5yr.toFixed(0)}%` },
        ]
      }]
    },
    about: 'High-value certifications include AWS (avg +$28K/yr), PMP (avg +$23K/yr), and CPA (significant salary premium). CISSP holders earn ~35% more than uncertified IT security peers. Google certifications in Cloud and Data Analytics show strong market demand. Salary impact varies by geography and employer.',
    related: ['mba-roi-calculator', 'salary-comparison-tool', 'skill-gap-analyzer'],
  },
  {
    slug: 'skill-gap-analyzer',
    title: 'Skill Gap Analyzer',
    desc: 'Compare your current skills to the requirements of a target role.',
    cat: 'career',
    icon: '🎯',
    toolType: 'estimator',
    fields: [
      { k: 'target_role', l: 'Target Role', type: 'text', placeholder: 'Senior Data Engineer' },
      { k: 'have_skills', l: 'Skills You Have (comma-separated)', type: 'text', placeholder: 'Python, SQL, pandas, Excel' },
      { k: 'need_skills', l: 'Skills Role Requires (comma-separated)', type: 'text', placeholder: 'Python, SQL, Spark, Airflow, dbt, AWS, Kafka' },
    ],
    fn: (inputs) => {
      const have = new Set((inputs.have_skills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean))
      const need = (inputs.need_skills || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
      const missing = need.filter(s => !have.has(s))
      const matched = need.filter(s => have.has(s))
      const coverage = need.length > 0 ? (matched.length / need.length * 100) : 0
      return [{
        type: 'table', label: `Skill Gap — ${inputs.target_role || 'Target Role'}`, content: [
          { label: 'Skills you have', value: matched.length.toString() },
          { label: 'Skills needed', value: need.length.toString() },
          { label: 'Coverage', value: `${coverage.toFixed(0)}%` },
          { label: 'Matched skills', value: matched.join(', ') || 'None' },
          { label: 'Missing skills', value: missing.join(', ') || 'None — you qualify!' },
          { label: 'Priority to learn', value: missing.slice(0, 3).join(', ') || 'N/A' },
        ]
      }]
    },
    about: 'LinkedIn data shows candidates with 50–60% skill match are successfully hired — employers value potential and learnability over 100% qualification. Focus on the top 3 missing skills most frequently listed in job postings. Projects demonstrating skills often outweigh certifications.',
    related: ['certification-roi-calculator', 'mba-roi-calculator', 'career-change-roi-calculator'],
  },
  {
    slug: 'career-change-roi-calculator',
    title: 'Career Change ROI Calculator',
    desc: 'Calculate the financial impact of changing careers over a 10-year horizon.',
    cat: 'career',
    icon: '🔄',
    toolType: 'estimator',
    fields: [
      { k: 'current_salary', l: 'Current Salary', type: 'number', placeholder: '65000', unit: '$' },
      { k: 'new_starting', l: 'New Career Starting Salary', type: 'number', placeholder: '55000', unit: '$' },
      { k: 'new_10yr', l: 'New Career Salary After 10 Years', type: 'number', placeholder: '120000', unit: '$' },
      { k: 'transition_cost', l: 'Training/Education Cost', type: 'number', placeholder: '10000', unit: '$' },
    ],
    fn: (inputs) => {
      const current = parseFloat(inputs.current_salary) || 0, newStart = parseFloat(inputs.new_starting) || 0, new10yr = parseFloat(inputs.new_10yr) || 0, cost = parseFloat(inputs.transition_cost) || 0
      const currentGrowth = current * 1.03 // 3% annual raise
      const newAvg10yr = (newStart + new10yr) / 2
      const currentTotal10yr = current * ((1.03 ** 10 - 1) / 0.03)
      const newTotal10yr = newStart * ((((new10yr / newStart) ** (1 / 9)) ** 10 - 1) / ((new10yr / newStart) ** (1 / 9) - 1))
      const difference = newTotal10yr - currentTotal10yr - cost
      return [{
        type: 'table', label: '10-Year Career Change Analysis', content: [
          { label: 'Current path 10-year earnings', value: `$${currentTotal10yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'New career 10-year earnings', value: `$${newTotal10yr.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Training cost', value: `-$${cost.toLocaleString()}` },
          { label: 'Net 10-year difference', value: `$${difference.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${difference > 0 ? 'gain' : 'loss'})` },
          { label: 'Annual salary in year 10', value: `$${new10yr.toLocaleString()} vs $${Math.round(current * 1.03 ** 10).toLocaleString()}` },
        ]
      }]
    },
    about: 'A pay cut when changing careers is common but can be an investment. Tech careers often pay 50–100% more than comparable seniority in education or nonprofit sectors after 5–10 years. Consider the full compensation picture including equity, benefits, and lifestyle factors.',
    related: ['skill-gap-analyzer', 'mba-roi-calculator', 'salary-comparison-tool'],
  },
  {
    slug: 'workers-comp-guide',
    title: 'Workers\' Compensation Guide',
    desc: 'Overview of workers\' comp benefits, filing deadlines, and what to expect.',
    cat: 'career',
    icon: '🩹',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Workers\' Compensation Reference', content: [
        { label: 'Who is covered', value: 'Most W-2 employees; not independent contractors' },
        { label: 'Wage replacement rate', value: 'Typically 66.7% of average weekly wage' },
        { label: 'Maximum weekly benefit', value: 'Varies by state ($300–$2,000+)' },
        { label: 'Medical coverage', value: '100% of approved medical costs, no deductible' },
        { label: 'Report injury deadline', value: 'Typically 30 days (some states 7–90 days)' },
        { label: 'File claim deadline', value: '1–3 years from injury (statute of limitations)' },
        { label: 'TTD (Temporary Total Disability)', value: 'While unable to work during treatment' },
        { label: 'Permanent disability', value: 'Rated by medical exam; lump sum or ongoing payments' },
        { label: 'Employer retaliation', value: 'Illegal in all 50 states; file complaint with state labor board' },
        { label: 'Attorneys', value: 'Most work on contingency (15–25% of settlement)' },
      ]
    }],
    about: 'Workers\' compensation insurance is mandatory in all US states for most employers. Benefits replace a portion of lost wages and cover all medical expenses. Independent contractors are generally not covered — misclassification is a major issue in the gig economy. Claims must be reported promptly; delays can jeopardize eligibility.',
    related: ['fmla-eligibility-checker', 'labor-law-by-state-guide', 'overtime-eligibility-checker'],
  },
  {
    slug: 'background-check-guide',
    title: 'Background Check Guide',
    desc: 'What employers typically check, how far back records go, and your rights.',
    cat: 'career',
    icon: '🔍',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Employment Background Check Reference', content: [
        { label: 'Criminal records (most states)', value: '7 years (FCRA limit for jobs paying <$75K)' },
        { label: 'Criminal records (jobs >$75K)', value: 'No FCRA time limit' },
        { label: 'Credit check states allowed', value: '10 states only; must be job-relevant' },
        { label: 'Employment history verification', value: 'All jobs you listed; typically 7–10 years' },
        { label: 'Education verification', value: 'Degrees claimed; year and institution confirmed' },
        { label: 'Social Security trace', value: 'Verifies all addresses associated with your SSN' },
        { label: 'Drug testing', value: 'Pre-employment common; usually urine test (5-panel)' },
        { label: 'Professional license check', value: 'For regulated professions (medical, legal, financial)' },
        { label: 'Adverse action notice required', value: 'Yes — employer must notify and give 5 days if rejecting based on report' },
        { label: 'Dispute inaccurate records', value: 'Contact reporting agency; they have 30 days to investigate' },
      ]
    }],
    about: 'The Fair Credit Reporting Act (FCRA) governs employment background checks by third-party agencies. Employers must get written consent before running checks. Eleven states (including California and New York) have "ban the box" laws restricting when criminal history can be considered.',
    related: ['credit-check-for-employment-guide', 'drug-test-timeline-guide', 'labor-law-by-state-guide'],
  },
  {
    slug: 'credit-check-for-employment-guide',
    title: 'Credit Check for Employment Guide',
    desc: 'Which states allow employer credit checks and what rights you have.',
    cat: 'career',
    icon: '💳',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Employment Credit Check Laws', content: [
        { label: 'States prohibiting most employer credit checks', value: 'CA, CT, CO, DE, HI, IL, MD, NV, OR, VT, WA' },
        { label: 'Exemptions even in protected states', value: 'Financial roles, positions with access to money/data' },
        { label: 'Federal law requirement', value: 'No federal prohibition; FCRA consent required' },
        { label: 'What they see', value: 'Credit history, balances, payment history — NOT credit score' },
        { label: 'Collections / bankruptcies', value: 'Visible on credit report for 7–10 years' },
        { label: 'Score impact', value: 'Employment checks are "soft inquiries" — no score impact' },
        { label: 'Your right to dispute', value: 'Request free copy; dispute with bureau if inaccurate' },
        { label: 'Adverse action notice', value: 'Must be given before rejection based on credit' },
      ]
    }],
    about: 'Credit checks for employment are controversial. Research shows little correlation between credit history and job performance except in roles directly managing money. 11 states restrict employer credit checks, but most allow exceptions for positions requiring financial responsibility or security clearances.',
    related: ['background-check-guide', 'credit-score-range-guide', 'labor-law-by-state-guide'],
  },
  {
    slug: 'drug-test-timeline-guide',
    title: 'Drug Test Detection Timeline Guide',
    desc: 'Approximate detection windows for common substances in urine, hair, and blood tests.',
    cat: 'career',
    icon: '🧪',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Drug Detection Windows (Urine)', content: [
        { label: 'Alcohol', value: '7–12 hours (80 hours with EtG test)' },
        { label: 'Cannabis (occasional user)', value: '1–3 days' },
        { label: 'Cannabis (daily user)', value: '10–30 days (fat-soluble)' },
        { label: 'Cocaine', value: '2–4 days' },
        { label: 'Amphetamines', value: '2–4 days' },
        { label: 'Methamphetamine', value: '3–5 days' },
        { label: 'Opiates (heroin, codeine)', value: '2–4 days' },
        { label: 'Oxycodone / Prescription opioids', value: '2–4 days' },
        { label: 'Benzodiazepines (short-acting)', value: '3 days' },
        { label: 'Benzodiazepines (long-acting, e.g., Valium)', value: '4–6 weeks' },
        { label: 'Hair follicle test', value: '90 days for most substances' },
        { label: 'Blood test', value: 'Shortest windows — typically hours to days' },
      ]
    }],
    about: 'Detection times are approximate and vary significantly by metabolism, body fat, frequency of use, and hydration. Hair follicle tests are the most comprehensive, covering 90 days of history. Standard pre-employment tests are 5-panel urine tests. Prescription medications are generally exempted with documentation.',
    related: ['background-check-guide', 'labor-law-by-state-guide'],
  },
]
