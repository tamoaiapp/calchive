import type { CalcConfig } from './types'

export const salaryCalcs: CalcConfig[] = [
  {
    slug: 'salary-to-hourly-calculator',
    title: 'Salary to Hourly Calculator',
    desc: 'Convert annual salary to equivalent hourly, weekly, and monthly pay.',
    cat: 'salary', icon: '💼',
    fields: [
      { k: 'salary', l: 'Annual Salary', p: '65000', min: 0, u: 'USD' },
      { k: 'hours', l: 'Hours per Week', p: '40', min: 1, max: 80 },
      { k: 'weeks', l: 'Weeks Worked per Year', p: '52', min: 1, max: 52 },
    ],
    fn: (v) => {
      const annual = v.salary
      const hourly = annual / (v.hours * v.weeks)
      const weekly = annual / v.weeks
      const biweekly = weekly * 2
      const monthly = annual / 12
      return {
        primary: { value: parseFloat(hourly.toFixed(2)), label: 'Hourly Rate', fmt: 'usd' },
        details: [
          { l: 'Weekly Pay', v: parseFloat(weekly.toFixed(2)), fmt: 'usd' },
          { l: 'Bi-Weekly Pay', v: parseFloat(biweekly.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Pay', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'Annual Salary', v: annual, fmt: 'usd' },
        ],
      }
    },
    about: 'A $65,000 salary works out to $31.25/hour assuming 40 hours/week and 52 weeks. Salaried employees who work more than 40 hours effectively earn less per hour — tracking actual hours reveals your true hourly rate.',
    related: ['hourly-to-salary-calculator', 'paycheck-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'hourly-to-salary-calculator',
    title: 'Hourly to Salary Calculator',
    desc: 'Convert an hourly rate to equivalent annual, monthly, and weekly salary.',
    cat: 'salary', icon: '⏰',
    fields: [
      { k: 'hourly', l: 'Hourly Rate', p: '28', min: 0, u: 'USD' },
      { k: 'hours', l: 'Hours per Week', p: '40', min: 1, max: 80 },
      { k: 'weeks', l: 'Weeks Worked per Year', p: '52', min: 1, max: 52 },
    ],
    fn: (v) => {
      const weekly = v.hourly * v.hours
      const annual = weekly * v.weeks
      const monthly = annual / 12
      return {
        primary: { value: parseFloat(annual.toFixed(0)), label: 'Annual Equivalent Salary', fmt: 'usd' },
        details: [
          { l: 'Weekly Pay', v: parseFloat(weekly.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Pay', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'Daily Pay (8 hrs)', v: parseFloat((v.hourly * 8).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'A $28/hour full-time rate equals $58,240/year. The federal minimum wage of $7.25/hour has been unchanged since 2009 — the longest such period in US history. 29 states plus DC have higher minimum wages, with California at $16/hour and Washington state at $16.28/hour in 2024.',
    related: ['salary-to-hourly-calculator', 'paycheck-calculator', 'overtime-calculator'],
  },
  {
    slug: 'paycheck-calculator',
    title: 'Paycheck Calculator',
    desc: 'Calculate your net paycheck after federal taxes, Social Security, and Medicare.',
    cat: 'salary', icon: '💵',
    fields: [
      { k: 'gross', l: 'Gross Pay Per Paycheck', p: '3000', min: 0, u: 'USD' },
      { k: 'filing', l: 'Filing Status', t: 'sel', p: '0', op: [['0','Single'],['1','Married'],['2','Head of Household']] },
      { k: 'state_rate', l: 'State Income Tax Rate', p: '5', min: 0, max: 15, u: '%' },
      { k: 'pre_tax_deductions', l: 'Pre-Tax Deductions (401k, HSA, etc.)', p: '300', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const taxable = Math.max(0, v.gross - v.pre_tax_deductions)
      // Simplified federal withholding: annualize, apply brackets, divide by pay periods
      const annualized = taxable * 26 // biweekly
      const exemptions = [4600, 9200, 6850][v.filing]
      const taxableAnnual = Math.max(0, annualized - exemptions)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let fedAnnual = 0, prev = 0
      for (const [cap, rate] of brackets) {
        fedAnnual += (Math.min(taxableAnnual, cap) - prev) * rate
        prev = cap
        if (taxableAnnual <= prev) break
      }
      const fedWithholding = fedAnnual / 26
      const ss = Math.min(taxable, 168600 / 26) * 0.062
      const medicare = taxable * 0.0145
      const stateTax = taxable * (v.state_rate / 100)
      const totalDeductions = fedWithholding + ss + medicare + stateTax + v.pre_tax_deductions
      const net = v.gross - totalDeductions
      return {
        primary: { value: parseFloat(net.toFixed(2)), label: 'Net Take-Home Pay', fmt: 'usd' },
        details: [
          { l: 'Federal Income Tax', v: parseFloat(fedWithholding.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Social Security (6.2%)', v: parseFloat(ss.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Medicare (1.45%)', v: parseFloat(medicare.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'State Tax', v: parseFloat(stateTax.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Pre-Tax Deductions', v: v.pre_tax_deductions, fmt: 'usd', color: '#fbbf24' },
        ],
        note: 'Assumes bi-weekly pay schedule. Actual withholding depends on W-4 elections and year-to-date earnings.',
      }
    },
    about: 'The average American worker takes home about 70–75% of gross pay after federal, state, and FICA taxes. High earners in California or New York can see effective combined marginal rates above 50%. Pre-tax 401k and HSA contributions reduce taxable income, increasing take-home pay relative to gross.',
    related: ['take-home-pay-calculator', 'salary-to-hourly-calculator', 'federal-income-tax-calculator'],
  },
  {
    slug: 'take-home-pay-calculator',
    title: 'Take-Home Pay Calculator',
    desc: 'Calculate annual take-home pay after all taxes and deductions.',
    cat: 'salary', icon: '🏠',
    fields: [
      { k: 'salary', l: 'Annual Gross Salary', p: '80000', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State + Local Tax Rate', p: '5', min: 0, max: 15, u: '%' },
      { k: '401k', l: '401(k) Contribution', p: '6000', min: 0, u: 'USD' },
      { k: 'health', l: 'Health Insurance Premium (annual)', p: '3600', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const preTax = v['401k'] + v.health
      const taxable = Math.max(0, v.salary - preTax)
      const brackets = [[11600,0.10],[47150,0.12],[100525,0.22],[191950,0.24],[243725,0.32],[609350,0.35],[Infinity,0.37]]
      let fedTax = 0, prev = 0
      const taxableForBrackets = Math.max(0, taxable - 14600)
      for (const [cap, rate] of brackets) {
        fedTax += (Math.min(taxableForBrackets, cap) - prev) * rate
        prev = cap
        if (taxableForBrackets <= prev) break
      }
      const ss = Math.min(taxable, 168600) * 0.062
      const medicare = taxable * 0.0145
      const stateTax = taxable * (v.state_rate / 100)
      const totalTax = fedTax + ss + medicare + stateTax
      const takeHome = v.salary - totalTax - preTax
      return {
        primary: { value: parseFloat(takeHome.toFixed(0)), label: 'Annual Take-Home Pay', fmt: 'usd' },
        details: [
          { l: 'Federal Income Tax', v: parseFloat(fedTax.toFixed(0)), fmt: 'usd', color: '#f87171' },
          { l: 'FICA Taxes', v: parseFloat((ss + medicare).toFixed(0)), fmt: 'usd', color: '#f87171' },
          { l: 'State/Local Tax', v: parseFloat(stateTax.toFixed(0)), fmt: 'usd', color: '#f87171' },
          { l: '401(k) & Benefits', v: parseFloat(preTax.toFixed(0)), fmt: 'usd', color: '#fbbf24' },
          { l: 'Monthly Take-Home', v: parseFloat((takeHome / 12).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
        ],
      }
    },
    about: 'An $80,000 salary in a state with 5% income tax leaves approximately $58,000–$62,000 in take-home pay after all taxes. The effective combined federal + state + FICA rate for this income level runs about 25–28%. Pre-tax deductions directly reduce this tax burden.',
    related: ['paycheck-calculator', 'salary-to-hourly-calculator', 'federal-income-tax-calculator'],
  },
  {
    slug: 'overtime-calculator',
    title: 'Overtime Pay Calculator',
    desc: 'Calculate overtime pay and total earnings including regular and overtime hours.',
    cat: 'salary', icon: '⏱️',
    fields: [
      { k: 'hourly', l: 'Regular Hourly Rate', p: '22', min: 0, u: 'USD' },
      { k: 'regular_hours', l: 'Regular Hours (per week)', p: '40', min: 0 },
      { k: 'ot_hours', l: 'Overtime Hours', p: '8', min: 0 },
      { k: 'ot_multiplier', l: 'Overtime Multiplier', t: 'sel', p: '1.5', op: [['1.5','1.5x (standard)'],['2','2x (double time)']] },
    ],
    fn: (v) => {
      const regularPay = v.hourly * v.regular_hours
      const otRate = v.hourly * v.ot_multiplier
      const otPay = otRate * v.ot_hours
      const total = regularPay + otPay
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Weekly Pay', fmt: 'usd' },
        details: [
          { l: 'Regular Pay', v: parseFloat(regularPay.toFixed(2)), fmt: 'usd' },
          { l: 'Overtime Rate', v: parseFloat(otRate.toFixed(2)), fmt: 'usd' },
          { l: 'Overtime Pay', v: parseFloat(otPay.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Annual Equivalent', v: parseFloat((total * 52).toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'The Fair Labor Standards Act (FLSA) requires overtime pay of 1.5x for hours over 40/week for non-exempt employees. Salaried employees earning under $684/week ($35,568/year) are automatically entitled to overtime. Exempt status classifications have been challenged by the DOL — proposed 2024 rules would raise the threshold to $55,068.',
    related: ['hourly-to-salary-calculator', 'paycheck-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'raise-calculator',
    title: 'Raise Calculator',
    desc: 'Calculate new salary, additional earnings, and the real impact of a pay raise.',
    cat: 'salary', icon: '📈',
    fields: [
      { k: 'current_salary', l: 'Current Annual Salary', p: '60000', min: 0, u: 'USD' },
      { k: 'raise_pct', l: 'Raise Percentage', p: '5', min: 0, max: 200, u: '%' },
      { k: 'tax_rate', l: 'Marginal Tax Rate', p: '22', min: 0, max: 50, u: '%' },
    ],
    fn: (v) => {
      const new_salary = v.current_salary * (1 + v.raise_pct / 100)
      const gross_increase = new_salary - v.current_salary
      const after_tax_increase = gross_increase * (1 - v.tax_rate / 100)
      const monthly_extra = after_tax_increase / 12
      return {
        primary: { value: parseFloat(new_salary.toFixed(0)), label: 'New Annual Salary', fmt: 'usd' },
        details: [
          { l: 'Gross Annual Increase', v: parseFloat(gross_increase.toFixed(0)), fmt: 'usd' },
          { l: 'After-Tax Annual Increase', v: parseFloat(after_tax_increase.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Extra Monthly (After Tax)', v: parseFloat(monthly_extra.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'A raise that matches inflation (3.2% in 2023) provides zero real purchasing power increase.',
      }
    },
    about: 'Average annual salary increases for US workers ran 4–5% in 2023, though high-inflation years 2021–2022 saw many workers fall behind in real terms despite nominal raises. Switching jobs typically yields 10–20% pay increases versus 3–5% for staying at the same employer.',
    related: ['salary-to-hourly-calculator', 'cost-of-living-calculator', 'job-offer-comparison-calculator'],
  },
  {
    slug: 'bonus-calculator',
    title: 'Bonus Calculator',
    desc: 'Calculate bonus amount, after-tax bonus, and impact on total compensation.',
    cat: 'salary', icon: '🎯',
    fields: [
      { k: 'base_salary', l: 'Base Annual Salary', p: '85000', min: 0, u: 'USD' },
      { k: 'bonus_pct', l: 'Bonus Percentage of Salary', p: '15', min: 0, max: 200, u: '%' },
      { k: 'state_rate', l: 'State Tax Rate', p: '5', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const bonus = v.base_salary * (v.bonus_pct / 100)
      const federal = bonus * 0.22 // supplemental rate
      const ss = Math.min(bonus, 168600) * 0.062
      const medicare = bonus * 0.0145
      const state = bonus * (v.state_rate / 100)
      const total_tax = federal + ss + medicare + state
      const net_bonus = bonus - total_tax
      return {
        primary: { value: parseFloat(net_bonus.toFixed(0)), label: 'Net Bonus (After Tax)', fmt: 'usd' },
        details: [
          { l: 'Gross Bonus', v: parseFloat(bonus.toFixed(0)), fmt: 'usd' },
          { l: 'Total Tax (est.)', v: parseFloat(total_tax.toFixed(0)), fmt: 'usd', color: '#f87171' },
          { l: 'Effective Bonus Tax Rate', v: parseFloat((total_tax / bonus * 100).toFixed(1)), fmt: 'pct' },
          { l: 'Total Compensation', v: parseFloat((v.base_salary + bonus).toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'The IRS withholds a flat 22% federal tax on bonus payments up to $1 million (37% above that). Total withholding including FICA and state taxes typically runs 35–45% on bonuses. Finance and tech industries often offer bonuses of 15–30% of base, while broad-based corporate plans average 5–10%.',
    related: ['paycheck-calculator', 'bonus-tax-calculator', 'total-compensation-calculator'],
  },
  {
    slug: 'commission-calculator',
    title: 'Commission Calculator',
    desc: 'Calculate commission earnings and total pay from sales performance.',
    cat: 'salary', icon: '🏆',
    fields: [
      { k: 'sales', l: 'Total Sales Revenue', p: '200000', min: 0, u: 'USD' },
      { k: 'commission_rate', l: 'Commission Rate', p: '5', min: 0, max: 100, u: '%' },
      { k: 'base_salary', l: 'Base Salary', p: '40000', min: 0, u: 'USD' },
      { k: 'quota', l: 'Sales Quota', p: '180000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const commission = v.sales * (v.commission_rate / 100)
      const total = v.base_salary + commission
      const quotaAttainment = v.quota > 0 ? (v.sales / v.quota) * 100 : 0
      const overQuota = Math.max(0, v.sales - v.quota)
      return {
        primary: { value: parseFloat(commission.toFixed(2)), label: 'Commission Earnings', fmt: 'usd' },
        details: [
          { l: 'Total Compensation', v: parseFloat(total.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Quota Attainment', v: parseFloat(quotaAttainment.toFixed(1)), fmt: 'pct', color: quotaAttainment >= 100 ? 'var(--green)' : '#fbbf24' },
          { l: 'Over-Quota Sales', v: parseFloat(overQuota.toFixed(0)), fmt: 'usd' },
          { l: 'Commission as % of Total Pay', v: parseFloat((commission / total * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Sales commission structures vary widely: 5–10% for B2B software, 1–3% for financial services, 25–40% for real estate agents (split with broker), and up to 100% commission in some pure-commission roles. Most effective structures include accelerators for over-quota performance.',
    related: ['bonus-calculator', 'total-compensation-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'freelance-rate-calculator',
    title: 'Freelance Rate Calculator',
    desc: 'Calculate the hourly rate you need to charge as a freelancer to meet your income goal.',
    cat: 'salary', icon: '💻',
    fields: [
      { k: 'annual_target', l: 'Target Annual Income', p: '80000', min: 0, u: 'USD' },
      { k: 'billable_hours', l: 'Billable Hours per Year', p: '1200', min: 1 },
      { k: 'expenses', l: 'Annual Business Expenses', p: '10000', min: 0, u: 'USD' },
      { k: 'tax_rate', l: 'Effective Tax Rate (est.)', p: '28', min: 0, max: 60, u: '%' },
    ],
    fn: (v) => {
      const pre_tax_needed = v.annual_target / (1 - v.tax_rate / 100)
      const total_needed = pre_tax_needed + v.expenses
      const hourly = total_needed / v.billable_hours
      return {
        primary: { value: parseFloat(hourly.toFixed(2)), label: 'Minimum Hourly Rate', fmt: 'usd' },
        details: [
          { l: 'Pre-Tax Revenue Needed', v: parseFloat(total_needed.toFixed(0)), fmt: 'usd' },
          { l: 'Billable Hours', v: v.billable_hours, fmt: 'num' },
          { l: 'Take-Home Per Hour Worked', v: parseFloat((v.annual_target / v.billable_hours).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Most freelancers are productive for only 50–60% of work hours. Non-billable time for admin, marketing, and proposals must be factored in.',
      }
    },
    about: 'Freelancers need to cover self-employment tax (15.3%), income tax, benefits (health insurance, retirement), and unpaid vacation time. A freelancer needing $80,000 after tax must typically charge $130,000–$150,000 gross before expenses — meaning an hourly rate of $65–$80+ for 1,500 billable hours.',
    related: ['self-employment-tax-calculator', 'consulting-fee-calculator', '1099-tax-calculator'],
  },
  {
    slug: 'consulting-fee-calculator',
    title: 'Consulting Fee Calculator',
    desc: 'Calculate consulting fees for projects or retainers based on your expertise and market.',
    cat: 'salary', icon: '🧠',
    fields: [
      { k: 'hourly_rate', l: 'Target Hourly Rate', p: '150', min: 0, u: 'USD' },
      { k: 'project_hours', l: 'Estimated Project Hours', p: '80', min: 0 },
      { k: 'overhead', l: 'Overhead & Expenses', p: '500', min: 0, u: 'USD' },
      { k: 'markup', l: 'Profit Margin', p: '20', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const base_cost = v.hourly_rate * v.project_hours + v.overhead
      const project_fee = base_cost * (1 + v.markup / 100)
      const monthly_retainer = project_fee / 2 // approximate 2-month project
      return {
        primary: { value: parseFloat(project_fee.toFixed(0)), label: 'Project Fee', fmt: 'usd' },
        details: [
          { l: 'Base Labor Cost', v: parseFloat((v.hourly_rate * v.project_hours).toFixed(0)), fmt: 'usd' },
          { l: 'Overhead & Expenses', v: v.overhead, fmt: 'usd' },
          { l: 'Profit Margin Applied', v: v.markup, fmt: 'pct' },
          { l: 'Equivalent Monthly Retainer', v: parseFloat(monthly_retainer.toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'Management consultants at McKinsey or BCG charge $300–$500/hour per consultant. Independent consultants with specialized expertise typically charge $100–$300/hour. Project-based fees provide predictability for clients; hourly billing protects consultants from scope creep.',
    related: ['freelance-rate-calculator', '1099-tax-calculator', 'self-employment-tax-calculator'],
  },
  {
    slug: 'mileage-reimbursement-calculator',
    title: 'Mileage Reimbursement Calculator',
    desc: 'Calculate IRS mileage reimbursement at the 2024 standard rate.',
    cat: 'salary', icon: '🚗',
    fields: [
      { k: 'miles', l: 'Total Business Miles', p: '5000', min: 0 },
      { k: 'rate', l: 'Reimbursement Rate', t: 'sel', p: '0.67', op: [['0.67','2024 Business ($0.67/mi)'],['0.21','2024 Medical ($0.21/mi)'],['0.14','2024 Charitable ($0.14/mi)']] },
    ],
    fn: (v) => {
      const reimbursement = v.miles * v.rate
      const annual = reimbursement
      const monthly = annual / 12
      return {
        primary: { value: parseFloat(reimbursement.toFixed(2)), label: 'Total Reimbursement', fmt: 'usd' },
        details: [
          { l: 'Rate per Mile', v: v.rate, fmt: 'usd' },
          { l: 'Total Miles', v: v.miles, fmt: 'num' },
          { l: 'Monthly Average', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
        ],
        note: 'The IRS business mileage rate is $0.67/mile in 2024, up from $0.585 in 2022.',
      }
    },
    about: 'The IRS adjusts the standard mileage rate annually based on fixed and variable vehicle costs. For 2024, the business rate is 67 cents per mile — the same as mid-2023. Using the IRS standard rate instead of actual expense tracking is simpler and often comparable in reimbursement value.',
    related: ['per-diem-calculator', 'freelance-rate-calculator', 'employee-benefits-value-calculator'],
  },
  {
    slug: 'per-diem-calculator',
    title: 'Per Diem Calculator',
    desc: 'Calculate GSA per diem allowances for business travel by location.',
    cat: 'salary', icon: '✈️',
    fields: [
      { k: 'daily_rate', l: 'Daily Per Diem Rate', p: '199', min: 0, u: 'USD' },
      { k: 'days', l: 'Travel Days', p: '5', min: 0 },
      { k: 'meals_only', l: 'Meals & Incidentals Only (M&IE)', t: 'sel', p: '0', op: [['0','Full per diem (lodging + M&IE)'],['1','M&IE only ($68 standard)']] },
    ],
    fn: (v) => {
      const daily = v.meals_only === 1 ? 68 : v.daily_rate
      const total = daily * v.days
      const taxable = 0 // per diem within limits is tax-free
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Per Diem Allowance', fmt: 'usd' },
        details: [
          { l: 'Daily Rate', v: parseFloat(daily.toFixed(2)), fmt: 'usd' },
          { l: 'Travel Days', v: v.days, fmt: 'num' },
          { l: 'Taxable Amount', v: taxable, fmt: 'usd' },
        ],
        note: 'Per diem paid within GSA rates is not taxable income. Standard M&IE rate is $68/day; lodging rates vary by city.',
      }
    },
    about: 'GSA per diem rates range from $199–$350+/day in high-cost cities like New York, San Francisco, and Washington DC. Employees spending less than the per diem keep the difference tax-free; spending more comes out of their own pocket. Partial travel days are calculated at 75% of the full rate.',
    related: ['mileage-reimbursement-calculator', 'employee-benefits-value-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'employee-benefits-value-calculator',
    title: 'Employee Benefits Value Calculator',
    desc: 'Calculate the total dollar value of your employee benefits package.',
    cat: 'salary', icon: '🎁',
    fields: [
      { k: 'base_salary', l: 'Base Salary', p: '75000', min: 0, u: 'USD' },
      { k: 'health_employer', l: 'Employer Health Insurance Premium (annual)', p: '7000', min: 0, u: 'USD' },
      { k: '401k_match', l: 'Employer 401(k) Match', p: '3750', min: 0, u: 'USD' },
      { k: 'pto_days', l: 'PTO Days per Year', p: '15', min: 0 },
      { k: 'other_benefits', l: 'Other Benefits (gym, tuition, stock, etc.)', p: '2000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const daily_rate = v.base_salary / 260
      const pto_value = v.pto_days * daily_rate
      const total_benefits = v.health_employer + v['401k_match'] + pto_value + v.other_benefits
      const total_comp = v.base_salary + total_benefits
      return {
        primary: { value: parseFloat(total_comp.toFixed(0)), label: 'Total Compensation Value', fmt: 'usd' },
        details: [
          { l: 'Base Salary', v: v.base_salary, fmt: 'usd' },
          { l: 'Health Insurance (employer)', v: v.health_employer, fmt: 'usd' },
          { l: '401(k) Match', v: v['401k_match'], fmt: 'usd' },
          { l: 'PTO Value', v: parseFloat(pto_value.toFixed(0)), fmt: 'usd' },
          { l: 'Other Benefits', v: v.other_benefits, fmt: 'usd' },
          { l: 'Benefits % of Base', v: parseFloat((total_benefits / v.base_salary * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Benefits typically add 25–40% to base salary in total compensation cost. A $75,000 salary with employer-paid health insurance ($7,000), 401k match ($3,750), and 15 PTO days worth $4,326 represents $90,000+ in real value — critical for comparing job offers across different benefit structures.',
    related: ['total-compensation-calculator', 'job-offer-comparison-calculator', '401k-contribution-calculator'],
  },
  {
    slug: 'job-offer-comparison-calculator',
    title: 'Job Offer Comparison Calculator',
    desc: 'Compare two job offers on total compensation, cost of living, and after-tax pay.',
    cat: 'salary', icon: '⚖️',
    fields: [
      { k: 'salary1', l: 'Job 1: Base Salary', p: '90000', min: 0, u: 'USD' },
      { k: 'bonus1', l: 'Job 1: Annual Bonus', p: '10000', min: 0, u: 'USD' },
      { k: 'benefits1', l: 'Job 1: Benefits Value', p: '15000', min: 0, u: 'USD' },
      { k: 'salary2', l: 'Job 2: Base Salary', p: '105000', min: 0, u: 'USD' },
      { k: 'bonus2', l: 'Job 2: Annual Bonus', p: '5000', min: 0, u: 'USD' },
      { k: 'benefits2', l: 'Job 2: Benefits Value', p: '8000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const total1 = v.salary1 + v.bonus1 + v.benefits1
      const total2 = v.salary2 + v.bonus2 + v.benefits2
      const diff = total2 - total1
      return {
        primary: { value: parseFloat(Math.abs(diff).toFixed(0)), label: `Job ${diff > 0 ? 2 : 1} Pays More By`, fmt: 'usd' },
        details: [
          { l: 'Job 1 Total Compensation', v: parseFloat(total1.toFixed(0)), fmt: 'usd' },
          { l: 'Job 2 Total Compensation', v: parseFloat(total2.toFixed(0)), fmt: 'usd' },
          { l: 'Better Offer', v: `Job ${diff > 0 ? 2 : 1}`, fmt: 'txt', color: 'var(--green)' },
          { l: 'Annual Difference', v: parseFloat(Math.abs(diff).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'Also consider growth potential, location cost of living, commute, remote work, and culture fit.',
      }
    },
    about: 'Total compensation comparisons should factor in: base pay, bonus, equity vesting, health insurance quality, 401k match, remote flexibility (worth $10,000+ annually if commute is eliminated), and career trajectory. A higher base at a slow-growth company can trail a lower base at a rocket ship over 5 years.',
    related: ['total-compensation-calculator', 'cost-of-living-calculator', 'employee-benefits-value-calculator'],
  },
  {
    slug: 'total-compensation-calculator',
    title: 'Total Compensation Calculator',
    desc: 'Calculate your complete compensation package including equity and all benefits.',
    cat: 'salary', icon: '💎',
    fields: [
      { k: 'base', l: 'Base Salary', p: '130000', min: 0, u: 'USD' },
      { k: 'bonus_target', l: 'Target Bonus', p: '20000', min: 0, u: 'USD' },
      { k: 'equity_annual', l: 'Annual Equity Value (RSU/options)', p: '25000', min: 0, u: 'USD' },
      { k: 'employer_benefits', l: 'Employer-Paid Benefits', p: '18000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const total = v.base + v.bonus_target + v.equity_annual + v.employer_benefits
      return {
        primary: { value: parseFloat(total.toFixed(0)), label: 'Total Compensation', fmt: 'usd' },
        details: [
          { l: 'Base Salary', v: v.base, fmt: 'usd' },
          { l: 'Target Bonus', v: v.bonus_target, fmt: 'usd' },
          { l: 'Equity (annualized)', v: v.equity_annual, fmt: 'usd' },
          { l: 'Benefits', v: v.employer_benefits, fmt: 'usd' },
          { l: 'Equity as % of TC', v: parseFloat((v.equity_annual / total * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'FAANG (Meta, Apple, Amazon, Netflix, Google) total compensation for senior software engineers runs $400,000–$800,000+ annually, with equity comprising 30–50% of the package. RSUs vest over 4 years typically, creating significant cliff risk if you leave before the 1-year mark.',
    related: ['job-offer-comparison-calculator', 'employee-benefits-value-calculator', 'equity-vesting-calculator'],
  },
  {
    slug: '401k-contribution-calculator',
    title: '401(k) Contribution Calculator',
    desc: 'Calculate your 401(k) contributions, employer match, and projected balance.',
    cat: 'salary', icon: '🏦',
    fields: [
      { k: 'salary', l: 'Annual Salary', p: '85000', min: 0, u: 'USD' },
      { k: 'contrib_pct', l: 'Your Contribution %', p: '8', min: 0, max: 100, u: '%' },
      { k: 'match_pct', l: 'Employer Match %', p: '4', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Years to Retirement', p: '25', min: 0, u: 'years' },
      { k: 'return', l: 'Expected Annual Return', p: '7', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const limit = 23000 // 2024 401k limit
      const yourContrib = Math.min(v.salary * v.contrib_pct / 100, limit)
      const match = v.salary * v.match_pct / 100
      const totalAnnual = yourContrib + match
      const monthlyTotal = totalAnnual / 12
      const r = v.return / 100 / 12
      const n = v.years * 12
      const fv = r === 0 ? monthlyTotal * n : monthlyTotal * (Math.pow(1 + r, n) - 1) / r
      return {
        primary: { value: parseFloat(fv.toFixed(0)), label: 'Projected 401(k) Balance', fmt: 'usd' },
        details: [
          { l: 'Your Annual Contribution', v: parseFloat(yourContrib.toFixed(0)), fmt: 'usd' },
          { l: 'Employer Match', v: parseFloat(match.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Annual', v: parseFloat(totalAnnual.toFixed(0)), fmt: 'usd' },
          { l: 'Total Contributions (lifetime)', v: parseFloat((totalAnnual * v.years).toFixed(0)), fmt: 'usd' },
          { l: 'Growth', v: parseFloat((fv - totalAnnual * v.years).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: '2024 401(k) employee limit: $23,000 ($30,500 if age 50+). Always contribute at least enough to get the full employer match.',
      }
    },
    about: 'The employer 401k match is the closest thing to free money in personal finance — a 4% match on an $85,000 salary is $3,400 in free compensation annually. Only 57% of eligible workers contribute enough to capture the full match. The 2024 employee contribution limit is $23,000 ($30,500 age 50+).',
    related: ['roth-401k-vs-traditional-calculator', 'retirement-savings-calculator', 'employee-benefits-value-calculator'],
  },
  {
    slug: '401k-employer-match-calculator',
    title: '401(k) Employer Match Calculator',
    desc: 'Calculate how much free money your employer contributes through 401(k) matching.',
    cat: 'salary', icon: '🎁',
    fields: [
      { k: 'salary', l: 'Annual Salary', p: '75000', min: 0, u: 'USD' },
      { k: 'your_pct', l: 'Your Contribution %', p: '6', min: 0, max: 100, u: '%' },
      { k: 'match_pct', l: 'Employer Match % of Your Contribution', p: '50', min: 0, max: 200, u: '%' },
      { k: 'match_cap', l: 'Match Cap (% of salary)', p: '6', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const your_contrib = v.salary * (v.your_pct / 100)
      const eligible = Math.min(your_contrib, v.salary * (v.match_cap / 100))
      const match = eligible * (v.match_pct / 100)
      const total = your_contrib + match
      const matchRoi = your_contrib > 0 ? (match / your_contrib) * 100 : 0
      return {
        primary: { value: parseFloat(match.toFixed(0)), label: 'Annual Employer Match', fmt: 'usd' },
        details: [
          { l: 'Your Contribution', v: parseFloat(your_contrib.toFixed(0)), fmt: 'usd' },
          { l: 'Total Annual 401(k)', v: parseFloat(total.toFixed(0)), fmt: 'usd' },
          { l: 'Instant ROI on Your Contribution', v: parseFloat(matchRoi.toFixed(1)), fmt: 'pct', color: 'var(--green)' },
        ],
        note: 'A 50% match on 6% is equivalent to a 3% pay raise in the form of retirement savings.',
      }
    },
    about: 'The most common 401k match formula is 50 cents per dollar up to 6% of pay — a $75,000 earner contributing 6% gets $2,250 in free employer money annually. Not capturing the full match is leaving guaranteed 50–100% returns on the table.',
    related: ['401k-contribution-calculator', 'employee-benefits-value-calculator', 'retirement-savings-calculator'],
  },
  {
    slug: 'roth-401k-vs-traditional-calculator',
    title: 'Roth 401(k) vs Traditional 401(k) Calculator',
    desc: 'Compare Roth and traditional 401(k) contributions to maximize after-tax retirement wealth.',
    cat: 'salary', icon: '🔄',
    fields: [
      { k: 'annual_contrib', l: 'Annual Contribution', p: '15000', min: 0, u: 'USD' },
      { k: 'current_rate', l: 'Current Tax Bracket', p: '22', min: 0, max: 40, u: '%' },
      { k: 'retirement_rate', l: 'Expected Retirement Tax Rate', p: '18', min: 0, max: 40, u: '%' },
      { k: 'years', l: 'Years to Retirement', p: '25', min: 0, u: 'years' },
      { k: 'return', l: 'Annual Return', p: '7', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const r = v.return / 100 / 12
      const n = v.years * 12
      const monthly = v.annual_contrib / 12
      const fv = r === 0 ? monthly * n : monthly * (Math.pow(1 + r, n) - 1) / r
      const traditionalAfterTax = fv * (1 - v.retirement_rate / 100)
      const rothAfterTax = fv // already paid taxes
      const advantage = rothAfterTax - traditionalAfterTax
      const better = v.retirement_rate < v.current_rate ? 'Traditional' : 'Roth'
      return {
        primary: { value: parseFloat(fv.toFixed(0)), label: 'Projected Balance (Both)', fmt: 'usd' },
        details: [
          { l: 'Roth (After-Tax Value)', v: parseFloat(rothAfterTax.toFixed(0)), fmt: 'usd' },
          { l: 'Traditional (After-Tax Value)', v: parseFloat(traditionalAfterTax.toFixed(0)), fmt: 'usd' },
          { l: 'Advantage', v: parseFloat(Math.abs(advantage).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Recommended', v: better, fmt: 'txt', color: 'var(--green)' },
        ],
        note: 'Roth wins if your tax rate will be HIGHER in retirement. Traditional wins if your rate will be LOWER.',
      }
    },
    about: 'The Roth vs Traditional decision hinges on whether your tax rate will be higher now or in retirement. Young workers in the 12–22% bracket typically benefit more from Roth contributions. High earners in the 32–37% bracket generally prefer traditional for the immediate deduction.',
    related: ['401k-contribution-calculator', 'roth-ira-calculator', 'roth-conversion-tax-calculator'],
  },
  {
    slug: 'hsa-contribution-calculator',
    title: 'HSA Contribution Calculator',
    desc: 'Calculate HSA tax savings and long-term investment growth for healthcare costs.',
    cat: 'salary', icon: '🏥',
    fields: [
      { k: 'annual_contrib', l: 'Annual HSA Contribution', p: '4150', min: 0, u: 'USD' },
      { k: 'coverage', l: 'Coverage Type', t: 'sel', p: '0', op: [['0','Self-Only ($4,150 max)'],['1','Family ($8,300 max)']] },
      { k: 'tax_rate', l: 'Marginal Tax Rate', p: '22', min: 0, max: 50, u: '%' },
      { k: 'years', l: 'Investment Horizon', p: '20', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const maxContrib = v.coverage === 1 ? 8300 : 4150
      const contrib = Math.min(v.annual_contrib, maxContrib)
      const taxSavings = contrib * (v.tax_rate / 100)
      const r = 0.07 / 12
      const n = v.years * 12
      const fv = (contrib / 12) * (Math.pow(1 + r, n) - 1) / r
      return {
        primary: { value: parseFloat(taxSavings.toFixed(2)), label: 'Annual Tax Savings', fmt: 'usd' },
        details: [
          { l: 'Annual Contribution', v: parseFloat(contrib.toFixed(0)), fmt: 'usd' },
          { l: 'HSA Balance in ' + v.years + ' Years (7% return)', v: parseFloat(fv.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Tax Savings Over Period', v: parseFloat((taxSavings * v.years).toFixed(0)), fmt: 'usd' },
        ],
        note: 'HSA is the only account with triple tax advantage: tax-deductible contributions, tax-free growth, and tax-free withdrawals for medical expenses.',
      }
    },
    about: 'The HSA is uniquely triple tax-advantaged: contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. After age 65, non-medical withdrawals are taxed like traditional IRA distributions. With 2024 limits of $4,150 (self) and $8,300 (family), maxing the HSA beats a traditional IRA for many savers.',
    related: ['401k-contribution-calculator', 'roth-ira-calculator', 'employee-benefits-value-calculator'],
  },
  {
    slug: 'cost-of-living-calculator',
    title: 'Cost of Living Calculator',
    desc: 'Calculate the salary you need in a new city to maintain your current standard of living.',
    cat: 'salary', icon: '🗺️',
    fields: [
      { k: 'current_salary', l: 'Current Salary', p: '75000', min: 0, u: 'USD' },
      { k: 'current_col', l: 'Current City Cost Index', p: '100', min: 1, u: 'index' },
      { k: 'new_col', l: 'New City Cost Index', p: '145', min: 1, u: 'index' },
    ],
    fn: (v) => {
      const equivalent = v.current_salary * (v.new_col / v.current_col)
      const difference = equivalent - v.current_salary
      const pct_change = ((equivalent - v.current_salary) / v.current_salary) * 100
      return {
        primary: { value: parseFloat(equivalent.toFixed(0)), label: 'Equivalent Salary Needed', fmt: 'usd' },
        details: [
          { l: 'Additional Pay Required', v: parseFloat(difference.toFixed(0)), fmt: 'usd', color: difference > 0 ? '#f87171' : 'var(--green)' },
          { l: 'Change %', v: parseFloat(pct_change.toFixed(1)), fmt: 'pct' },
          { l: 'Current City Index', v: v.current_col, fmt: 'num' },
          { l: 'New City Index', v: v.new_col, fmt: 'num' },
        ],
        note: 'Typical COL indices: SF ~180, NYC ~170, Austin ~115, Pittsburgh ~85, Memphis ~75.',
      }
    },
    about: 'San Francisco\'s cost of living runs roughly 80% above the national average, meaning a $75,000 salary elsewhere requires $135,000 in San Francisco to maintain the same lifestyle. Remote work has enabled many workers to earn coastal salaries while living in lower cost-of-living markets.',
    related: ['salary-to-hourly-calculator', 'job-offer-comparison-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'social-security-benefits-calculator',
    title: 'Social Security Benefits Estimator',
    desc: 'Estimate your monthly Social Security retirement benefit based on earnings.',
    cat: 'salary', icon: '🔐',
    fields: [
      { k: 'avg_income', l: 'Average Annual Earned Income', p: '70000', min: 0, u: 'USD' },
      { k: 'claim_age', l: 'Age to Claim Benefits', t: 'sel', p: '67', op: [['62','62 (early — 70% of FRA)'],['65','65 (93% of FRA)'],['67','67 (Full Retirement Age)'],['70','70 (124% of FRA)']] },
      { k: 'work_years', l: 'Years of Work History', p: '35', min: 0, max: 40 },
    ],
    fn: (v) => {
      // Simplified SSA calculation
      const aime = v.avg_income / 12
      const bend1 = 1174, bend2 = 7078
      let pia = 0
      if (aime <= bend1) pia = aime * 0.90
      else if (aime <= bend2) pia = bend1 * 0.90 + (aime - bend1) * 0.32
      else pia = bend1 * 0.90 + (bend2 - bend1) * 0.32 + (aime - bend2) * 0.15
      const multiplier = v.claim_age === 62 ? 0.70 : v.claim_age === 65 ? 0.93 : v.claim_age === 67 ? 1.0 : 1.24
      const monthly = pia * multiplier * (v.work_years / 35)
      const annual = monthly * 12
      return {
        primary: { value: parseFloat(monthly.toFixed(0)), label: 'Estimated Monthly Benefit', fmt: 'usd' },
        details: [
          { l: 'Annual Benefit', v: parseFloat(annual.toFixed(0)), fmt: 'usd' },
          { l: 'Claim Age Adjustment', v: parseFloat((multiplier * 100).toFixed(0)), fmt: 'pct' },
          { l: 'Max Monthly Benefit (2024, age 70)', v: 4873, fmt: 'usd' },
        ],
        note: 'This is an estimate. Create an SSA.gov account for your actual earnings record and benefit projection.',
      }
    },
    about: 'Social Security replaces about 40% of the average pre-retirement income. Delaying from 62 to 70 increases monthly benefits by 77%. The 2024 maximum monthly benefit at full retirement age (67) is $3,822; at age 70 it\'s $4,873. About 70 million Americans receive Social Security benefits.',
    related: ['social-security-age-calculator', 'retirement-income-calculator', 'pension-calculator'],
  },
  {
    slug: 'equity-vesting-calculator',
    title: 'Equity Vesting Calculator',
    desc: 'Calculate when your stock options or RSUs vest and their potential value.',
    cat: 'salary', icon: '📈',
    fields: [
      { k: 'grant_value', l: 'Total Grant Value', p: '200000', min: 0, u: 'USD' },
      { k: 'cliff_months', l: 'Cliff Period', t: 'sel', p: '12', op: [['0','No cliff'],['6','6 months'],['12','12 months (standard)']] },
      { k: 'vest_years', l: 'Total Vesting Period', p: '4', min: 1, max: 10, u: 'years' },
      { k: 'months_completed', l: 'Months Already Completed', p: '8', min: 0, max: 120 },
    ],
    fn: (v) => {
      const totalMonths = v.vest_years * 12
      const monthlyVest = v.grant_value / totalMonths
      const cliff_value = v.cliff_months > 0 ? monthlyVest * v.cliff_months : 0
      const vested = v.months_completed >= v.cliff_months
        ? cliff_value + Math.max(0, v.months_completed - v.cliff_months) * monthlyVest
        : 0
      const remaining = v.grant_value - vested
      return {
        primary: { value: parseFloat(vested.toFixed(0)), label: 'Vested Value So Far', fmt: 'usd' },
        details: [
          { l: 'Remaining to Vest', v: parseFloat(remaining.toFixed(0)), fmt: 'usd' },
          { l: 'Cliff Vesting Event', v: parseFloat(cliff_value.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Vesting Rate', v: parseFloat((v.grant_value / v.vest_years).toFixed(0)), fmt: 'usd' },
          { l: 'Next Month Value', v: parseFloat(monthlyVest.toFixed(0)), fmt: 'usd' },
        ],
        note: '4-year vesting with 1-year cliff is the Silicon Valley standard. Leaving before the cliff forfeits 100% of unvested shares.',
      }
    },
    about: 'The standard Silicon Valley equity package vests 25% after a 12-month cliff, then monthly for 36 more months (4-year total). Leaving before the cliff means forfeiting the entire grant. Double-trigger acceleration (change of control + termination) protects employees in acquisitions.',
    related: ['total-compensation-calculator', 'stock-options-value-calculator', 'job-offer-comparison-calculator'],
  },
  {
    slug: 'signing-bonus-after-tax-calculator',
    title: 'Signing Bonus After-Tax Calculator',
    desc: 'Calculate your net signing bonus after IRS supplemental withholding and state taxes.',
    cat: 'salary', icon: '✍️',
    fields: [
      { k: 'signing_bonus', l: 'Gross Signing Bonus', p: '25000', min: 0, u: 'USD' },
      { k: 'state_rate', l: 'State Tax Rate', p: '6', min: 0, max: 15, u: '%' },
      { k: 'repayment_months', l: 'Repayment Period (if you leave)', p: '12', min: 0, u: 'months' },
    ],
    fn: (v) => {
      const federal = v.signing_bonus * 0.22
      const ss = Math.min(v.signing_bonus, 168600) * 0.062
      const medicare = v.signing_bonus * 0.0145
      const state = v.signing_bonus * (v.state_rate / 100)
      const totalTax = federal + ss + medicare + state
      const net = v.signing_bonus - totalTax
      const effectiveRate = (totalTax / v.signing_bonus) * 100
      return {
        primary: { value: parseFloat(net.toFixed(0)), label: 'Net Signing Bonus', fmt: 'usd' },
        details: [
          { l: 'Federal (22% supplemental)', v: parseFloat(federal.toFixed(0)), fmt: 'usd' },
          { l: 'FICA', v: parseFloat((ss + medicare).toFixed(0)), fmt: 'usd' },
          { l: 'State Tax', v: parseFloat(state.toFixed(0)), fmt: 'usd' },
          { l: 'Effective Tax Rate', v: parseFloat(effectiveRate.toFixed(1)), fmt: 'pct' },
        ],
        note: 'Many signing bonuses require repayment (prorated) if you leave within 12–24 months.',
      }
    },
    about: 'Signing bonuses are taxed as ordinary income with federal withholding at the 22% supplemental rate. Be aware of clawback provisions — many employers require full repayment if you leave within 1–2 years. When negotiating, gross up the signing bonus by your effective tax rate to understand what you actually need.',
    related: ['bonus-calculator', 'bonus-tax-calculator', 'job-offer-comparison-calculator'],
  },
  {
    slug: 'living-wage-calculator',
    title: 'Living Wage Calculator',
    desc: 'Calculate the living wage needed to cover basic expenses by family size and location.',
    cat: 'salary', icon: '🏠',
    fields: [
      { k: 'housing', l: 'Monthly Housing Cost', p: '1500', min: 0, u: 'USD' },
      { k: 'food', l: 'Monthly Food Cost', p: '600', min: 0, u: 'USD' },
      { k: 'transport', l: 'Monthly Transportation', p: '500', min: 0, u: 'USD' },
      { k: 'healthcare', l: 'Monthly Healthcare', p: '400', min: 0, u: 'USD' },
      { k: 'other', l: 'Other Monthly Expenses', p: '500', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const monthly = v.housing + v.food + v.transport + v.healthcare + v.other
      const annual = monthly * 12
      const grossNeeded = annual / 0.72 // assume ~28% in taxes/benefits
      const hourly = grossNeeded / 2080
      return {
        primary: { value: parseFloat(grossNeeded.toFixed(0)), label: 'Living Wage (Annual Gross)', fmt: 'usd' },
        details: [
          { l: 'Monthly Expenses', v: parseFloat(monthly.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Expenses', v: parseFloat(annual.toFixed(0)), fmt: 'usd' },
          { l: 'Hourly Equivalent (40 hrs)', v: parseFloat(hourly.toFixed(2)), fmt: 'usd' },
          { l: 'Federal Minimum Wage', v: 7.25, fmt: 'usd' },
        ],
        note: 'MIT\'s Living Wage Calculator estimates basic living wages range from $17–$30+/hour depending on location and family size.',
      }
    },
    about: 'MIT\'s Living Wage Calculator estimates a single adult needs $22.33/hour in the US (2024 average) — three times the federal minimum wage of $7.25. For a family of four with two working adults, the living wage averages $24.16/hour each. 38 states have minimum wages above $7.25.',
    related: ['salary-to-hourly-calculator', 'take-home-pay-calculator', 'cost-of-living-calculator'],
  },
]
