import type { CalcConfig } from './types'

export const mortgageCalcs: CalcConfig[] = [
  {
    slug: 'mortgage-payment-calculator',
    title: 'Mortgage Payment Calculator',
    desc: 'Calculate your monthly mortgage payment including principal and interest.',
    cat: 'mortgage', icon: '🏠',
    fields: [
      { k: 'price', l: 'Home Price', p: '400000', min: 0, u: 'USD' },
      { k: 'down', l: 'Down Payment', p: '80000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7.2', min: 0, max: 30, u: '%' },
      { k: 'years', l: 'Loan Term', t: 'sel', p: '30', op: [['10','10 years'],['15','15 years'],['20','20 years'],['25','25 years'],['30','30 years']] },
    ],
    fn: (v) => {
      const loan = v.price - v.down
      if (loan <= 0) throw new Error('Down payment cannot exceed home price.')
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      const totalPaid = payment * n
      const totalInterest = totalPaid - loan
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment (P&I)', fmt: 'usd' },
        details: [
          { l: 'Loan Amount', v: parseFloat(loan.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Cost of Loan', v: parseFloat(totalPaid.toFixed(2)), fmt: 'usd' },
          { l: 'Down Payment %', v: parseFloat(((v.down / v.price) * 100).toFixed(1)), fmt: 'pct' },
        ],
        note: 'Does not include property tax, homeowners insurance, or PMI. Add ~$400–$600/month for these.',
      }
    },
    about: 'At 7.2% on a $320,000 loan with a 30-year term, monthly P&I is about $2,178 — and you\'ll pay $464,000 in interest over the life of the loan. Choosing a 15-year term roughly doubles the monthly payment but cuts total interest by over 60%.',
    related: ['mortgage-affordability-calculator', 'amortization-calculator', 'refinance-calculator'],
  },
  {
    slug: 'mortgage-affordability-calculator',
    title: 'Mortgage Affordability Calculator',
    desc: 'Find out how much home you can afford based on income and debt.',
    cat: 'mortgage', icon: '🏡',
    fields: [
      { k: 'gross_income', l: 'Annual Gross Income', p: '100000', min: 0.01, u: 'USD' },
      { k: 'monthly_debt', l: 'Monthly Debt Payments', p: '500', min: 0, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '7.2', min: 0, max: 30, u: '%' },
      { k: 'down', l: 'Down Payment Available', p: '60000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const monthlyIncome = v.gross_income / 12
      // 28% front-end and 43% back-end rules
      const maxHousing = monthlyIncome * 0.28
      const maxTotal = monthlyIncome * 0.43
      const maxFromDTI = maxTotal - v.monthly_debt
      const maxPayment = Math.min(maxHousing, maxFromDTI)
      const r = v.rate / 100 / 12
      const n = 360
      const maxLoan = r === 0 ? maxPayment * n : maxPayment * (1 - Math.pow(1 + r, -n)) / r
      const maxHome = maxLoan + v.down
      return {
        primary: { value: parseFloat(maxHome.toFixed(0)), label: 'Maximum Home Price', fmt: 'usd' },
        details: [
          { l: 'Max Loan Amount', v: parseFloat(maxLoan.toFixed(0)), fmt: 'usd' },
          { l: 'Max Monthly Payment', v: parseFloat(maxPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Down Payment', v: v.down, fmt: 'usd' },
          { l: 'Front-End Ratio Target', v: 28, fmt: 'pct' },
        ],
        note: 'Based on 28% front-end and 43% back-end DTI limits used by conventional lenders.',
      }
    },
    about: 'Conventional lenders typically require housing costs below 28% of gross income and total debt below 43%. At the median US household income of $75,000, this yields a home price of roughly $280,000–$320,000 at current rates — far below median home prices in coastal metros.',
    related: ['mortgage-payment-calculator', 'debt-to-income-calculator', 'down-payment-calculator'],
  },
  {
    slug: 'down-payment-calculator',
    title: 'Down Payment Calculator',
    desc: 'Calculate required down payment and monthly savings needed to reach your goal.',
    cat: 'mortgage', icon: '💰',
    fields: [
      { k: 'home_price', l: 'Target Home Price', p: '400000', min: 0, u: 'USD' },
      { k: 'pct', l: 'Down Payment Percentage', p: '20', min: 0, max: 100, u: '%' },
      { k: 'current', l: 'Current Savings', p: '25000', min: 0, u: 'USD' },
      { k: 'months', l: 'Months to Save', p: '36', min: 1, u: 'months' },
    ],
    fn: (v) => {
      const needed = v.home_price * (v.pct / 100)
      const gap = Math.max(0, needed - v.current)
      const monthly = gap / v.months
      const avoidsPMI = v.pct >= 20
      return {
        primary: { value: parseFloat(needed.toFixed(0)), label: 'Down Payment Needed', fmt: 'usd' },
        details: [
          { l: 'Current Savings', v: v.current, fmt: 'usd' },
          { l: 'Remaining to Save', v: parseFloat(gap.toFixed(0)), fmt: 'usd', color: gap > 0 ? '#fbbf24' : 'var(--green)' },
          { l: 'Monthly Savings Required', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'PMI Required?', v: avoidsPMI ? 'No — 20%+ down avoids PMI' : 'Yes — below 20%', fmt: 'txt', color: avoidsPMI ? 'var(--green)' : '#fbbf24' },
        ],
      }
    },
    about: 'A 20% down payment eliminates PMI (private mortgage insurance), which runs 0.5–1.5% of the loan annually. On a $400,000 home, 20% down saves $100–$300/month in PMI. First-time buyers can access FHA loans with 3.5% down or conventional loans at 3–5% with PMI.',
    related: ['mortgage-payment-calculator', 'pmi-calculator', 'mortgage-affordability-calculator'],
  },
  {
    slug: 'pmi-calculator',
    title: 'PMI Calculator',
    desc: 'Calculate private mortgage insurance cost and when you can cancel it.',
    cat: 'mortgage', icon: '🛡️',
    fields: [
      { k: 'loan', l: 'Loan Amount', p: '320000', min: 0, u: 'USD' },
      { k: 'home_value', l: 'Home Value', p: '400000', min: 0.01, u: 'USD' },
      { k: 'rate', l: 'PMI Rate', p: '0.8', min: 0.1, max: 3, u: '%' },
    ],
    fn: (v) => {
      const ltv = (v.loan / v.home_value) * 100
      const annualPMI = v.loan * (v.rate / 100)
      const monthly = annualPMI / 12
      const loanFor80 = v.home_value * 0.80
      const pmiCancels = v.loan <= loanFor80
      return {
        primary: { value: parseFloat(monthly.toFixed(2)), label: 'Monthly PMI Cost', fmt: 'usd' },
        details: [
          { l: 'Annual PMI Cost', v: parseFloat(annualPMI.toFixed(2)), fmt: 'usd' },
          { l: 'Current LTV Ratio', v: parseFloat(ltv.toFixed(1)), fmt: 'pct' },
          { l: 'Loan Balance for PMI Cancellation', v: parseFloat(loanFor80.toFixed(0)), fmt: 'usd' },
          { l: 'PMI Status', v: pmiCancels ? 'Not Required (LTV ≤ 80%)' : 'Required (LTV > 80%)', fmt: 'txt', color: pmiCancels ? 'var(--green)' : '#fbbf24' },
        ],
        note: 'Request PMI cancellation in writing when LTV reaches 80%. Lenders must auto-cancel at 78% LTV.',
      }
    },
    about: 'PMI protects the lender — not you — and costs 0.5–1.5% of the loan annually. On a $320,000 loan at 0.8%, that\'s $2,560/year or $213/month. Under the Homeowners Protection Act (1998), lenders must cancel PMI automatically when the loan reaches 78% LTV based on the original amortization schedule.',
    related: ['mortgage-payment-calculator', 'down-payment-calculator', 'home-equity-calculator'],
  },
  {
    slug: 'amortization-calculator',
    title: 'Amortization Calculator',
    desc: 'See your full mortgage amortization schedule showing principal and interest each month.',
    cat: 'mortgage', icon: '📊',
    fields: [
      { k: 'loan', l: 'Loan Amount', p: '350000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7.0', min: 0, max: 30, u: '%' },
      { k: 'years', l: 'Loan Term', t: 'sel', p: '30', op: [['10','10 years'],['15','15 years'],['20','20 years'],['30','30 years']] },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.loan / n : (v.loan * r) / (1 - Math.pow(1 + r, -n))
      const totalPaid = payment * n
      const totalInterest = totalPaid - v.loan
      // Interest in first payment
      const firstInterest = v.loan * r
      const firstPrincipal = payment - firstInterest
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'First Month: Interest', v: parseFloat(firstInterest.toFixed(2)), fmt: 'usd' },
          { l: 'First Month: Principal', v: parseFloat(firstPrincipal.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest (Life of Loan)', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Paid', v: parseFloat(totalPaid.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Early payments are mostly interest. On a 30-year loan, you spend 10+ years before each payment is 50% principal.',
      }
    },
    about: 'Mortgage amortization front-loads interest — on a $350,000 loan at 7%, the first payment is about $2,041 but only $375 goes to principal. This is why extra payments in early years dramatically reduce total interest and payoff time.',
    related: ['mortgage-payment-calculator', 'extra-payment-calculator', 'biweekly-mortgage-calculator'],
  },
  {
    slug: 'refinance-calculator',
    title: 'Mortgage Refinance Calculator',
    desc: 'Determine if refinancing saves money and calculate your break-even point.',
    cat: 'mortgage', icon: '🔄',
    fields: [
      { k: 'balance', l: 'Current Loan Balance', p: '290000', min: 0, u: 'USD' },
      { k: 'current_rate', l: 'Current Interest Rate', p: '7.5', min: 0, max: 30, u: '%' },
      { k: 'new_rate', l: 'New Interest Rate', p: '6.5', min: 0, max: 30, u: '%' },
      { k: 'years', l: 'New Loan Term', t: 'sel', p: '30', op: [['10','10 years'],['15','15 years'],['20','20 years'],['30','30 years']] },
      { k: 'closing_costs', l: 'Closing Costs', p: '6000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const calcPayment = (loan: number, rate: number, years: number) => {
        const r = rate / 100 / 12
        const n = years * 12
        return r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      }
      const currentPayment = calcPayment(v.balance, v.current_rate, 30) // assume 30yr remaining
      const newPayment = calcPayment(v.balance, v.new_rate, v.years)
      const monthlySavings = currentPayment - newPayment
      const breakEven = monthlySavings > 0 ? Math.ceil(v.closing_costs / monthlySavings) : Infinity
      return {
        primary: { value: parseFloat(monthlySavings.toFixed(2)), label: 'Monthly Savings', fmt: 'usd' },
        details: [
          { l: 'New Monthly Payment', v: parseFloat(newPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Closing Costs', v: v.closing_costs, fmt: 'usd' },
          { l: 'Break-Even (months)', v: breakEven === Infinity ? 999 : breakEven, fmt: 'num' },
          { l: 'Break-Even (years)', v: parseFloat((breakEven === Infinity ? 999 : breakEven / 12).toFixed(1)), fmt: 'num' },
        ],
        note: 'Refinancing makes sense if you plan to stay in the home past the break-even date.',
      }
    },
    about: 'The 2020–2021 refinance boom saw $4.5 trillion in mortgage originations — the largest two-year total in history — as rates fell below 3%. Now with 7%+ rates, the "rate lock-in" effect has frozen existing homeowners in place. A general rule: refinancing saves money when you can drop the rate by at least 0.75–1%.',
    related: ['mortgage-payment-calculator', 'break-even-calculator', 'extra-payment-calculator'],
  },
  {
    slug: 'home-equity-calculator',
    title: 'Home Equity Calculator',
    desc: 'Calculate your current home equity and available home equity loan amount.',
    cat: 'mortgage', icon: '🏦',
    fields: [
      { k: 'home_value', l: 'Current Home Value', p: '500000', min: 0, u: 'USD' },
      { k: 'mortgage_balance', l: 'Outstanding Mortgage Balance', p: '280000', min: 0, u: 'USD' },
      { k: 'max_ltv', l: 'Max LTV for HELOC/HEL', p: '85', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const equity = v.home_value - v.mortgage_balance
      const equityPct = (equity / v.home_value) * 100
      const maxLoan = v.home_value * (v.max_ltv / 100) - v.mortgage_balance
      return {
        primary: { value: parseFloat(equity.toFixed(0)), label: 'Home Equity', fmt: 'usd' },
        details: [
          { l: 'Equity Percentage', v: parseFloat(equityPct.toFixed(1)), fmt: 'pct' },
          { l: 'Max Available to Borrow', v: parseFloat(Math.max(0, maxLoan).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'LTV Ratio', v: parseFloat(((v.mortgage_balance / v.home_value) * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'US homeowners held a record $31.8 trillion in equity in 2023 — an average of $299,000 per mortgage-holding homeowner. Lenders typically allow borrowing against up to 80–85% of home value (combined LTV). HELOC rates in 2024 average 9–10%, tied to the prime rate.',
    related: ['heloc-calculator', 'mortgage-payment-calculator', 'cash-out-refinance-calculator'],
  },
  {
    slug: 'heloc-calculator',
    title: 'HELOC Calculator',
    desc: 'Calculate interest-only payments during the HELOC draw period and repayment.',
    cat: 'mortgage', icon: '💳',
    fields: [
      { k: 'amount', l: 'HELOC Draw Amount', p: '60000', min: 0, u: 'USD' },
      { k: 'rate', l: 'HELOC Interest Rate', p: '9.5', min: 0, max: 30, u: '%' },
      { k: 'draw_years', l: 'Draw Period', t: 'sel', p: '10', op: [['5','5 years'],['10','10 years']] },
      { k: 'repay_years', l: 'Repayment Period', t: 'sel', p: '20', op: [['10','10 years'],['15','15 years'],['20','20 years']] },
    ],
    fn: (v) => {
      const monthlyInterest = v.amount * (v.rate / 100 / 12)
      const r = v.rate / 100 / 12
      const n = v.repay_years * 12
      const repayment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      return {
        primary: { value: parseFloat(monthlyInterest.toFixed(2)), label: 'Draw Period Monthly Payment (Interest Only)', fmt: 'usd' },
        details: [
          { l: 'Repayment Period Payment', v: parseFloat(repayment.toFixed(2)), fmt: 'usd' },
          { l: 'Payment Increase at Repayment', v: parseFloat((repayment - monthlyInterest).toFixed(2)), fmt: 'usd', color: '#fbbf24' },
          { l: 'Total Interest (Draw Only)', v: parseFloat((monthlyInterest * v.draw_years * 12).toFixed(2)), fmt: 'usd' },
        ],
        note: 'HELOCs have variable rates tied to the prime rate, which can increase payments significantly.',
      }
    },
    about: 'HELOCs work like credit cards secured by your home — draw what you need during the 5–10 year draw period, paying interest only. The repayment period (10–20 years) fully amortizes the balance. Many borrowers underestimate the payment shock when the draw period ends.',
    related: ['home-equity-calculator', 'second-mortgage-calculator', 'cash-out-refinance-calculator'],
  },
  {
    slug: 'closing-costs-calculator',
    title: 'Closing Costs Calculator',
    desc: 'Estimate total closing costs when buying or refinancing a home.',
    cat: 'mortgage', icon: '📋',
    fields: [
      { k: 'price', l: 'Home Price', p: '400000', min: 0, u: 'USD' },
      { k: 'loan', l: 'Loan Amount', p: '320000', min: 0, u: 'USD' },
      { k: 'transaction', l: 'Transaction Type', t: 'sel', p: '0', op: [['0','Purchase'],['1','Refinance']] },
    ],
    fn: (v) => {
      const originationFee = v.loan * 0.01
      const appraisal = 500
      const title = v.loan * 0.005
      const escrow = 1200
      const recording = 200
      const transferTax = v.transaction === 0 ? v.price * 0.01 : 0
      const prepaid = 2500 // prepaid interest, insurance, etc.
      const total = originationFee + appraisal + title + escrow + recording + transferTax + prepaid
      const pct = (total / v.price) * 100
      return {
        primary: { value: parseFloat(total.toFixed(0)), label: 'Estimated Closing Costs', fmt: 'usd' },
        details: [
          { l: 'Origination Fee (~1%)', v: parseFloat(originationFee.toFixed(0)), fmt: 'usd' },
          { l: 'Appraisal', v: appraisal, fmt: 'usd' },
          { l: 'Title & Title Insurance', v: parseFloat(title.toFixed(0)), fmt: 'usd' },
          { l: 'Transfer Tax (purchase)', v: parseFloat(transferTax.toFixed(0)), fmt: 'usd' },
          { l: 'Prepaid Items', v: prepaid, fmt: 'usd' },
          { l: 'As % of Home Price', v: parseFloat(pct.toFixed(2)), fmt: 'pct' },
        ],
        note: 'Closing costs vary significantly by state and lender. Always request a Loan Estimate (LE) form.',
      }
    },
    about: 'Closing costs average 2–5% of the loan amount, ranging from under $3,000 in some states to over $10,000 in New York and Delaware. Lenders are required to provide a Loan Estimate within 3 business days of application, with all closing costs itemized. Some costs (origination fees, points) are negotiable.',
    related: ['mortgage-payment-calculator', 'title-insurance-calculator', 'mortgage-points-calculator'],
  },
  {
    slug: 'extra-payment-calculator',
    title: 'Extra Mortgage Payment Calculator',
    desc: 'Calculate how much extra payments reduce your loan payoff time and total interest.',
    cat: 'mortgage', icon: '💨',
    fields: [
      { k: 'balance', l: 'Current Loan Balance', p: '300000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '7.0', min: 0, max: 30, u: '%' },
      { k: 'years_remaining', l: 'Years Remaining', p: '27', min: 1 },
      { k: 'extra', l: 'Extra Monthly Payment', p: '200', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years_remaining * 12
      const normalPayment = r === 0 ? v.balance / n : (v.balance * r) / (1 - Math.pow(1 + r, -n))
      const totalPayment = normalPayment + v.extra
      // Find new payoff time
      let balance = v.balance
      let months = 0
      while (balance > 0 && months < 600) {
        const interest = balance * r
        const principal = totalPayment - interest
        balance = Math.max(0, balance - principal)
        months++
      }
      const interestWithout = normalPayment * n - v.balance
      const interestWith = totalPayment * months - v.balance
      const savedInterest = interestWithout - interestWith
      const savedMonths = n - months
      return {
        primary: { value: parseFloat(savedInterest.toFixed(0)), label: 'Total Interest Saved', fmt: 'usd' },
        details: [
          { l: 'Original Payoff', v: parseFloat((n / 12).toFixed(1)), fmt: 'num' },
          { l: 'New Payoff (years)', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
          { l: 'Months Saved', v: saveMonths(savedMonths), fmt: 'num' },
          { l: 'Extra Monthly Payment', v: v.extra, fmt: 'usd' },
        ],
        note: 'Always confirm with your lender that extra payments are applied to principal.',
      }
      function saveMonths(m: number) { return parseFloat(m.toFixed(0)) }
    },
    about: 'An extra $200/month on a $300,000 mortgage at 7% saves about $67,000 in interest and cuts 4+ years off the loan. For maximum impact, apply extra payments in the early years when the amortization schedule is most interest-heavy.',
    related: ['amortization-calculator', 'biweekly-mortgage-calculator', 'payoff-calculator'],
  },
  {
    slug: 'biweekly-mortgage-calculator',
    title: 'Biweekly Mortgage Calculator',
    desc: 'Calculate how biweekly payments (every 2 weeks) reduce your mortgage.',
    cat: 'mortgage', icon: '📅',
    fields: [
      { k: 'loan', l: 'Loan Amount', p: '350000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7.0', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = 360
      const monthlyPayment = r === 0 ? v.loan / n : (v.loan * r) / (1 - Math.pow(1 + r, -n))
      const biweeklyPayment = monthlyPayment / 2
      // Biweekly = 26 payments/year = 13 monthly equivalents
      const extraMonthly = monthlyPayment / 12
      const r2 = v.rate / 100 / 12
      let balance = v.loan, months = 0
      while (balance > 0 && months < 600) {
        const interest = balance * r2
        const principal = monthlyPayment + extraMonthly - interest
        balance = Math.max(0, balance - principal)
        months++
      }
      const totalInterestMonthly = monthlyPayment * 360 - v.loan
      const totalInterestBiweekly = (monthlyPayment + extraMonthly) * months - v.loan
      const savedInterest = totalInterestMonthly - totalInterestBiweekly
      const savedYears = (360 - months) / 12
      return {
        primary: { value: parseFloat(savedInterest.toFixed(0)), label: 'Interest Saved vs Monthly', fmt: 'usd' },
        details: [
          { l: 'Biweekly Payment Amount', v: parseFloat(biweeklyPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Equivalent', v: parseFloat(monthlyPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Years Saved', v: parseFloat(savedYears.toFixed(1)), fmt: 'num' },
          { l: 'New Payoff (years)', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
        ],
        note: 'Biweekly payments result in 13 monthly payments per year instead of 12, saving years off the loan.',
      }
    },
    about: 'Switching to biweekly payments saves approximately $40,000–$60,000 in interest on a $350,000 mortgage at 7% and shortens the loan by 4–5 years — simply by making 26 half-payments (equivalent to 13 full payments) instead of 12.',
    related: ['extra-payment-calculator', 'amortization-calculator', 'payoff-calculator'],
  },
  {
    slug: 'rent-vs-buy-calculator',
    title: 'Rent vs. Buy Calculator',
    desc: 'Compare the true cost of renting versus buying a home over time.',
    cat: 'mortgage', icon: '🏘️',
    fields: [
      { k: 'home_price', l: 'Home Price', p: '400000', min: 0, u: 'USD' },
      { k: 'down_pct', l: 'Down Payment', p: '20', min: 0, max: 100, u: '%' },
      { k: 'rate', l: 'Mortgage Rate', p: '7.0', min: 0, max: 30, u: '%' },
      { k: 'monthly_rent', l: 'Monthly Rent', p: '2200', min: 0, u: 'USD' },
      { k: 'years', l: 'Comparison Period', p: '7', min: 1, u: 'years' },
    ],
    fn: (v) => {
      const down = v.home_price * (v.down_pct / 100)
      const loan = v.home_price - down
      const r = v.rate / 100 / 12
      const n = 360
      const payment = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      const months = v.years * 12
      const totalMortgage = payment * months
      const taxes = v.home_price * 0.012 * v.years
      const insurance = v.home_price * 0.005 * v.years
      const maintenance = v.home_price * 0.01 * v.years
      const appreciation = v.home_price * Math.pow(1.04, v.years) - v.home_price
      const equityBuilt = down + (totalMortgage - loan * (1 - Math.pow(1 + r, -months)) / (1 - Math.pow(1 + r, -n))) + appreciation
      const totalBuy = totalMortgage + taxes + insurance + maintenance + down
      const totalRent = v.monthly_rent * months
      const rentInvestment = down * Math.pow(1.07, v.years) - down
      const advantage = totalRent + rentInvestment - totalBuy + equityBuilt
      return {
        primary: { value: parseFloat(Math.abs(advantage).toFixed(0)), label: advantage > 0 ? 'Buying Advantage' : 'Renting Advantage', fmt: 'usd' },
        details: [
          { l: 'Total Cost: Buying', v: parseFloat(totalBuy.toFixed(0)), fmt: 'usd' },
          { l: 'Total Cost: Renting', v: parseFloat(totalRent.toFixed(0)), fmt: 'usd' },
          { l: 'Estimated Equity Built', v: parseFloat(equityBuilt.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Winner', v: advantage > 0 ? 'Buying' : 'Renting', fmt: 'txt', color: advantage > 0 ? 'var(--green)' : '#fbbf24' },
        ],
        note: 'Assumes 4% home appreciation, 7% investment return on down payment, 1% maintenance, and 1.2% property tax.',
      }
    },
    about: 'The rent vs. buy decision hinges on how long you stay, not just costs. Studies show break-even is typically 4–7 years in most markets. The 2020s distorted this math — rents surged 26% nationally while buying costs nearly doubled on rate increases, making renting economical in many cities for shorter time horizons.',
    related: ['mortgage-payment-calculator', 'home-equity-calculator', 'rental-income-calculator'],
  },
  {
    slug: 'rental-income-calculator',
    title: 'Rental Income Calculator',
    desc: 'Calculate rental property net income, cash flow, and ROI.',
    cat: 'mortgage', icon: '🏘️',
    fields: [
      { k: 'purchase_price', l: 'Purchase Price', p: '350000', min: 0, u: 'USD' },
      { k: 'down_pct', l: 'Down Payment', p: '25', min: 0, max: 100, u: '%' },
      { k: 'rate', l: 'Mortgage Rate', p: '7.5', min: 0, max: 30, u: '%' },
      { k: 'monthly_rent', l: 'Monthly Rent', p: '2400', min: 0, u: 'USD' },
      { k: 'vacancy_rate', l: 'Vacancy Rate', p: '8', min: 0, max: 100, u: '%' },
      { k: 'monthly_expenses', l: 'Monthly Expenses (tax, insurance, mgmt)', p: '700', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const down = v.purchase_price * (v.down_pct / 100)
      const loan = v.purchase_price - down
      const r = v.rate / 100 / 12
      const n = 360
      const mortgage = r === 0 ? loan / n : (loan * r) / (1 - Math.pow(1 + r, -n))
      const effectiveRent = v.monthly_rent * (1 - v.vacancy_rate / 100)
      const cashFlow = effectiveRent - mortgage - v.monthly_expenses
      const annualCashFlow = cashFlow * 12
      const cashOnCash = (annualCashFlow / down) * 100
      return {
        primary: { value: parseFloat(cashFlow.toFixed(2)), label: 'Monthly Cash Flow', fmt: 'usd' },
        details: [
          { l: 'Monthly Rent (adj. for vacancy)', v: parseFloat(effectiveRent.toFixed(2)), fmt: 'usd' },
          { l: 'Mortgage Payment', v: parseFloat(mortgage.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Expenses', v: v.monthly_expenses, fmt: 'usd' },
          { l: 'Annual Cash Flow', v: parseFloat(annualCashFlow.toFixed(0)), fmt: 'usd', color: annualCashFlow >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Cash-on-Cash Return', v: parseFloat(cashOnCash.toFixed(2)), fmt: 'pct', color: cashOnCash >= 6 ? 'var(--green)' : '#fbbf24' },
        ],
      }
    },
    about: 'Real estate investors target 6–10% cash-on-cash return as a baseline. The 1% rule (monthly rent ≥ 1% of purchase price) has become nearly impossible in most US markets at 2024 prices. Cap rates — a metric ignoring financing — average 4.5–6.5% for residential properties nationally.',
    related: ['cap-rate-calculator', 'rental-yield-calculator', 'gross-rent-multiplier-calculator'],
  },
  {
    slug: 'cap-rate-calculator',
    title: 'Cap Rate Calculator',
    desc: 'Calculate the capitalization rate to compare rental property investments.',
    cat: 'mortgage', icon: '📈',
    fields: [
      { k: 'noi', l: 'Net Operating Income (Annual)', p: '24000', min: 0, u: 'USD' },
      { k: 'value', l: 'Property Value', p: '400000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const capRate = (v.noi / v.value) * 100
      const impliedValue = v.noi / (capRate / 100)
      const yearsToRecoup = v.value / v.noi
      return {
        primary: { value: parseFloat(capRate.toFixed(2)), label: 'Cap Rate', fmt: 'pct' },
        details: [
          { l: 'Net Operating Income', v: v.noi, fmt: 'usd' },
          { l: 'Years to Recoup Investment', v: parseFloat(yearsToRecoup.toFixed(1)), fmt: 'num' },
          { l: 'Property Value', v: v.value, fmt: 'usd' },
        ],
        note: 'Cap rate ignores financing — use cash-on-cash return for leveraged deals.',
      }
    },
    about: 'Cap rates are the real estate equivalent of the earnings yield — higher cap rates indicate more income per dollar invested, but often reflect higher risk or lower-growth markets. Class A urban multifamily trades at 4–5% caps; class C suburban properties 7–9%. Industrial and data center cap rates compressed to 5–6% at the 2022 peak.',
    related: ['rental-income-calculator', 'gross-rent-multiplier-calculator', 'cash-on-cash-return-calculator'],
  },
  {
    slug: 'rental-yield-calculator',
    title: 'Rental Yield Calculator',
    desc: 'Calculate gross and net rental yield for a buy-to-let property.',
    cat: 'mortgage', icon: '🏘️',
    fields: [
      { k: 'annual_rent', l: 'Annual Rental Income', p: '28800', min: 0, u: 'USD' },
      { k: 'annual_expenses', l: 'Annual Expenses (taxes, insurance, mgmt)', p: '8000', min: 0, u: 'USD' },
      { k: 'property_value', l: 'Property Purchase Price', p: '400000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const gross = (v.annual_rent / v.property_value) * 100
      const net = ((v.annual_rent - v.annual_expenses) / v.property_value) * 100
      return {
        primary: { value: parseFloat(gross.toFixed(2)), label: 'Gross Rental Yield', fmt: 'pct' },
        details: [
          { l: 'Net Rental Yield', v: parseFloat(net.toFixed(2)), fmt: 'pct' },
          { l: 'Annual Expenses', v: v.annual_expenses, fmt: 'usd' },
          { l: 'Net Annual Income', v: parseFloat((v.annual_rent - v.annual_expenses).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Net yield of 4–6% is generally considered good for residential rental properties.',
      }
    },
    about: 'Gross rental yields average 4–8% in the US, but net yields after expenses, vacancies, and management fees run 2–4% lower. Sun Belt markets (Phoenix, Tampa, Dallas) showed gross yields of 6–8% in 2023, while coastal markets (NYC, SF, LA) often came in below 4%.',
    related: ['cap-rate-calculator', 'cash-on-cash-return-calculator', 'rental-income-calculator'],
  },
  {
    slug: 'gross-rent-multiplier-calculator',
    title: 'Gross Rent Multiplier Calculator',
    desc: 'Calculate the GRM to quickly compare rental property valuations.',
    cat: 'mortgage', icon: '✖️',
    fields: [
      { k: 'price', l: 'Property Price', p: '450000', min: 0, u: 'USD' },
      { k: 'annual_rent', l: 'Annual Gross Rent', p: '30000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const grm = v.price / v.annual_rent
      const impliedRent = v.price / 12
      return {
        primary: { value: parseFloat(grm.toFixed(2)), label: 'Gross Rent Multiplier', fmt: 'num' },
        details: [
          { l: 'Property Price', v: v.price, fmt: 'usd' },
          { l: 'Annual Rent', v: v.annual_rent, fmt: 'usd' },
          { l: 'Monthly Rent for 1% Rule', v: parseFloat(impliedRent.toFixed(0)), fmt: 'usd' },
        ],
        note: 'Lower GRM is better — GRM of 8–12 is typical for residential investment properties.',
      }
    },
    about: 'The Gross Rent Multiplier is a quick screening tool: GRM of 10 means you\'re paying 10x annual gross rent. Most investors screen for GRM under 10–12 for residential properties. The "1% rule" (monthly rent ≥ 1% of price) equates to a GRM of about 8.3.',
    related: ['cap-rate-calculator', 'rental-yield-calculator', 'cash-on-cash-return-calculator'],
  },
  {
    slug: 'cash-on-cash-return-calculator',
    title: 'Cash-on-Cash Return Calculator',
    desc: 'Calculate the annual cash-on-cash return for a leveraged real estate investment.',
    cat: 'mortgage', icon: '💵',
    fields: [
      { k: 'annual_cash_flow', l: 'Annual Pre-Tax Cash Flow', p: '7200', min: 0, u: 'USD' },
      { k: 'total_cash_invested', l: 'Total Cash Invested (down + costs)', p: '95000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const coc = (v.annual_cash_flow / v.total_cash_invested) * 100
      const monthly = v.annual_cash_flow / 12
      return {
        primary: { value: parseFloat(coc.toFixed(2)), label: 'Cash-on-Cash Return', fmt: 'pct' },
        details: [
          { l: 'Annual Cash Flow', v: v.annual_cash_flow, fmt: 'usd' },
          { l: 'Monthly Cash Flow', v: parseFloat(monthly.toFixed(2)), fmt: 'usd' },
          { l: 'Cash Invested', v: v.total_cash_invested, fmt: 'usd' },
        ],
        note: 'Most investors target 6–10%+ cash-on-cash. Below 4–5% often means risk-adjusted returns favor other assets.',
      }
    },
    about: 'Cash-on-cash return measures the annual return on actual cash deployed, incorporating financing. A 10% CoC on a rental means your $95,000 investment generates $9,500/year in actual cash. This differs from ROE or cap rate by factoring in the mortgage payment.',
    related: ['cap-rate-calculator', 'rental-income-calculator', 'real-estate-roi-calculator'],
  },
  {
    slug: 'real-estate-roi-calculator',
    title: 'Real Estate ROI Calculator',
    desc: 'Calculate total ROI on a real estate investment including appreciation, cash flow, and equity.',
    cat: 'mortgage', icon: '📈',
    fields: [
      { k: 'purchase_price', l: 'Purchase Price', p: '350000', min: 0, u: 'USD' },
      { k: 'down', l: 'Down Payment', p: '70000', min: 0, u: 'USD' },
      { k: 'annual_cash_flow', l: 'Annual Net Cash Flow', p: '4800', min: 0, u: 'USD' },
      { k: 'appreciation_rate', l: 'Annual Appreciation Rate', p: '4', min: 0, max: 20, u: '%' },
      { k: 'years', l: 'Holding Period', p: '5', min: 1, u: 'years' },
    ],
    fn: (v) => {
      const future_value = v.purchase_price * Math.pow(1 + v.appreciation_rate / 100, v.years)
      const appreciation_gain = future_value - v.purchase_price
      const total_cash_flow = v.annual_cash_flow * v.years
      const total_return = appreciation_gain + total_cash_flow
      const roi = (total_return / v.down) * 100
      const annualized = (Math.pow(1 + roi / 100, 1 / v.years) - 1) * 100
      return {
        primary: { value: parseFloat(roi.toFixed(2)), label: 'Total ROI', fmt: 'pct' },
        details: [
          { l: 'Appreciation Gain', v: parseFloat(appreciation_gain.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Cash Flow', v: parseFloat(total_cash_flow.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Return', v: parseFloat(total_return.toFixed(0)), fmt: 'usd' },
          { l: 'Annualized ROI', v: parseFloat(annualized.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Real estate\'s leverage multiplies returns — a $70,000 down payment on a property that appreciates $50,000 represents a 71% return on cash invested, not 14%. Nationally, home prices have appreciated at about 4.4% annually since 1991, with significant local variation.',
    related: ['cash-on-cash-return-calculator', 'rental-income-calculator', 'flip-profit-calculator'],
  },
  {
    slug: 'flip-profit-calculator',
    title: 'House Flip Profit Calculator',
    desc: 'Calculate profit margin and ROI for a fix-and-flip real estate investment.',
    cat: 'mortgage', icon: '🏚️',
    fields: [
      { k: 'purchase', l: 'Purchase Price', p: '180000', min: 0, u: 'USD' },
      { k: 'renovation', l: 'Renovation Cost', p: '45000', min: 0, u: 'USD' },
      { k: 'holding_costs', l: 'Monthly Holding Costs', p: '2000', min: 0, u: 'USD' },
      { k: 'months', l: 'Months Held', p: '5', min: 0, u: 'months' },
      { k: 'arv', l: 'After Repair Value (Sale Price)', p: '295000', min: 0, u: 'USD' },
      { k: 'selling_costs_pct', l: 'Selling Costs (agent, closing)', p: '6', min: 0, max: 20, u: '%' },
    ],
    fn: (v) => {
      const holding = v.holding_costs * v.months
      const selling_costs = v.arv * (v.selling_costs_pct / 100)
      const total_invested = v.purchase + v.renovation + holding
      const net_proceeds = v.arv - selling_costs
      const profit = net_proceeds - total_invested
      const roi = (profit / total_invested) * 100
      return {
        primary: { value: parseFloat(profit.toFixed(0)), label: 'Flip Profit', fmt: 'usd' },
        details: [
          { l: 'Total Invested', v: parseFloat(total_invested.toFixed(0)), fmt: 'usd' },
          { l: 'Net Proceeds (after selling)', v: parseFloat(net_proceeds.toFixed(0)), fmt: 'usd' },
          { l: 'ROI', v: parseFloat(roi.toFixed(2)), fmt: 'pct', color: roi > 0 ? 'var(--green)' : '#f87171' },
          { l: 'Max Purchase (70% ARV Rule)', v: parseFloat((v.arv * 0.70 - v.renovation).toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'Experienced flippers use the 70% rule: purchase price ≤ 70% of ARV minus renovation costs. ATTOM data shows average gross flip profits of $67,900 in 2023, but actual returns after financing and soft costs are significantly lower. Flips held as short-term capital gains face up to 37% federal tax.',
    related: ['real-estate-roi-calculator', 'capital-gains-tax-calculator', 'renovation-cost-calculator'],
  },
  {
    slug: 'fha-loan-calculator',
    title: 'FHA Loan Calculator',
    desc: 'Calculate FHA loan payments including the mandatory mortgage insurance premium.',
    cat: 'mortgage', icon: '🏠',
    fields: [
      { k: 'price', l: 'Home Price', p: '300000', min: 0, u: 'USD' },
      { k: 'down', l: 'Down Payment', p: '10500', min: 0, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '6.8', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const loan = v.price - v.down
      const downPct = v.down / v.price
      const ufmip = loan * 0.0175 // upfront MIP
      const totalLoan = loan + ufmip
      const r = v.rate / 100 / 12
      const n = 360
      const payment = r === 0 ? totalLoan / n : (totalLoan * r) / (1 - Math.pow(1 + r, -n))
      const annualMIP = downPct < 0.1 ? loan * 0.0085 : loan * 0.0080
      const monthlyMIP = annualMIP / 12
      const total = payment + monthlyMIP
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Monthly Payment (P&I + MIP)', fmt: 'usd' },
        details: [
          { l: 'Loan Amount (with UFMIP)', v: parseFloat(totalLoan.toFixed(2)), fmt: 'usd' },
          { l: 'P&I Payment', v: parseFloat(payment.toFixed(2)), fmt: 'usd' },
          { l: 'Annual MIP (monthly)', v: parseFloat(monthlyMIP.toFixed(2)), fmt: 'usd' },
          { l: 'Upfront MIP (1.75%)', v: parseFloat(ufmip.toFixed(2)), fmt: 'usd' },
        ],
        note: 'FHA loans require a minimum 3.5% down payment with credit score ≥580. MIP lasts the life of the loan if down < 10%.',
      }
    },
    about: 'FHA loans allow 3.5% down with a 580+ credit score, making them the most accessible path to homeownership. The trade-off is permanent mortgage insurance: an upfront fee of 1.75% plus 0.8–0.85% annually. Unlike conventional PMI, FHA MIP never cancels if you put down less than 10%.',
    related: ['mortgage-payment-calculator', 'pmi-calculator', 'va-loan-calculator'],
  },
  {
    slug: 'va-loan-calculator',
    title: 'VA Loan Calculator',
    desc: 'Calculate VA loan payments with zero down payment and the VA funding fee.',
    cat: 'mortgage', icon: '🎖️',
    fields: [
      { k: 'price', l: 'Home Price', p: '400000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '6.6', min: 0, max: 30, u: '%' },
      { k: 'usage', l: 'Loan Usage', t: 'sel', p: '0', op: [['0','First Use (2.15% fee)'],['1','Subsequent Use (3.3% fee)'],['2','Exempt (disabled vet)']]}
    ],
    fn: (v) => {
      const feeRates = [0.0215, 0.033, 0]
      const fundingFee = v.price * feeRates[v.usage]
      const totalLoan = v.price + fundingFee
      const r = v.rate / 100 / 12
      const n = 360
      const payment = r === 0 ? totalLoan / n : (totalLoan * r) / (1 - Math.pow(1 + r, -n))
      const totalInterest = payment * n - totalLoan
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment (P&I)', fmt: 'usd' },
        details: [
          { l: 'Home Price', v: v.price, fmt: 'usd' },
          { l: 'VA Funding Fee', v: parseFloat(fundingFee.toFixed(2)), fmt: 'usd' },
          { l: 'Total Loan Amount', v: parseFloat(totalLoan.toFixed(2)), fmt: 'usd' },
          { l: 'Savings vs FHA (no PMI)', v: parseFloat((totalLoan * 0.0085 / 12).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'VA loans require no down payment and no monthly PMI. Eligibility requires active duty, veteran, or surviving spouse status.',
      }
    },
    about: 'VA loans are arguably the best mortgage product available — no down payment, no PMI, competitive rates, and a government backing that makes lenders comfortable with zero equity. Over 28 million eligible veterans haven\'t used their VA benefit. Disabled veterans are exempt from the funding fee.',
    related: ['mortgage-payment-calculator', 'fha-loan-calculator', 'pmi-calculator'],
  },
  {
    slug: 'reverse-mortgage-calculator',
    title: 'Reverse Mortgage Calculator',
    desc: 'Estimate the maximum loan amount available from a HECM reverse mortgage.',
    cat: 'mortgage', icon: '🔁',
    fields: [
      { k: 'home_value', l: 'Home Value', p: '500000', min: 0, u: 'USD' },
      { k: 'mortgage_balance', l: 'Existing Mortgage Balance', p: '80000', min: 0, u: 'USD' },
      { k: 'age', l: 'Age of Youngest Borrower', p: '72', min: 62, max: 100 },
    ],
    fn: (v) => {
      // Simplified PLF calculation
      const hecmLimit = 1149825
      const claimedValue = Math.min(v.home_value, hecmLimit)
      const plf = Math.min(0.75, 0.30 + (v.age - 62) * 0.01)
      const principalLimit = claimedValue * plf
      const netProceeds = Math.max(0, principalLimit - v.mortgage_balance)
      const monthlyPayment = netProceeds / 120 // 10-year tenure estimate
      return {
        primary: { value: parseFloat(principalLimit.toFixed(0)), label: 'Estimated Principal Limit', fmt: 'usd' },
        details: [
          { l: 'Net Available (after payoff)', v: parseFloat(netProceeds.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Monthly Payment (10-yr tenure)', v: parseFloat(monthlyPayment.toFixed(0)), fmt: 'usd' },
          { l: 'PLF Factor (approx)', v: parseFloat((plf * 100).toFixed(1)), fmt: 'pct' },
        ],
        note: 'This is an estimate. Actual proceeds depend on current HUD rates and mandatory counseling session.',
      }
    },
    about: 'HECM (Home Equity Conversion Mortgage) reverse mortgages are FHA-insured and available to homeowners 62+. The loan grows over time as interest accrues — the home must be sold or refinanced when the last borrower dies or permanently leaves. The 2024 HECM loan limit is $1,149,825.',
    related: ['home-equity-calculator', 'retirement-income-calculator', 'net-worth-calculator'],
  },
  {
    slug: 'mortgage-points-calculator',
    title: 'Mortgage Points Calculator',
    desc: 'Determine whether to buy discount points to lower your mortgage rate.',
    cat: 'mortgage', icon: '🎯',
    fields: [
      { k: 'loan', l: 'Loan Amount', p: '350000', min: 0, u: 'USD' },
      { k: 'rate_no_points', l: 'Rate Without Points', p: '7.25', min: 0, max: 30, u: '%' },
      { k: 'rate_with_points', l: 'Rate With Points', p: '6.75', min: 0, max: 30, u: '%' },
      { k: 'points', l: 'Number of Points', p: '2', min: 0, max: 10 },
    ],
    fn: (v) => {
      const pointsCost = v.loan * (v.points / 100)
      const calcPayment = (rate: number) => {
        const r = rate / 100 / 12
        const n = 360
        return r === 0 ? v.loan / n : (v.loan * r) / (1 - Math.pow(1 + r, -n))
      }
      const paymentWithout = calcPayment(v.rate_no_points)
      const paymentWith = calcPayment(v.rate_with_points)
      const monthlySavings = paymentWithout - paymentWith
      const breakEven = monthlySavings > 0 ? Math.ceil(pointsCost / monthlySavings) : 999
      return {
        primary: { value: breakEven, label: 'Break-Even (months)', fmt: 'num' },
        details: [
          { l: 'Points Cost', v: parseFloat(pointsCost.toFixed(0)), fmt: 'usd' },
          { l: 'Monthly Savings', v: parseFloat(monthlySavings.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Break-Even (years)', v: parseFloat((breakEven / 12).toFixed(1)), fmt: 'num' },
          { l: 'Total Savings at 30 Years', v: parseFloat((monthlySavings * 360 - pointsCost).toFixed(0)), fmt: 'usd' },
        ],
        note: 'Each point costs 1% of the loan amount and typically reduces the rate by 0.25%.',
      }
    },
    about: 'Buying points makes sense only if you keep the loan past the break-even date — typically 3–7 years for a 0.5% rate reduction. With Americans moving or refinancing every 5–7 years on average, points often cost more than they save.',
    related: ['mortgage-payment-calculator', 'refinance-calculator', 'closing-costs-calculator'],
  },
  {
    slug: 'property-appreciation-calculator',
    title: 'Property Appreciation Calculator',
    desc: 'Calculate future home value based on historical appreciation rates.',
    cat: 'mortgage', icon: '📈',
    fields: [
      { k: 'current_value', l: 'Current Home Value', p: '400000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Appreciation Rate', p: '4', min: 0, max: 30, u: '%' },
      { k: 'years', l: 'Years', p: '10', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const future = v.current_value * Math.pow(1 + v.rate / 100, v.years)
      const gain = future - v.current_value
      return {
        primary: { value: parseFloat(future.toFixed(0)), label: 'Projected Home Value', fmt: 'usd' },
        details: [
          { l: 'Appreciation Gain', v: parseFloat(gain.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Appreciation %', v: parseFloat(((gain / v.current_value) * 100).toFixed(1)), fmt: 'pct' },
          { l: 'Annual Growth Rate', v: v.rate, fmt: 'pct' },
        ],
        note: 'US home prices have averaged ~4.4% annual appreciation since 1991 (FHFA HPI). Local rates vary dramatically.',
      }
    },
    about: 'US home prices have appreciated at roughly 4.4% annually since 1991, though 2020–2022 saw a record 40%+ surge driven by low rates and pandemic demand shifts. Markets like Austin and Phoenix doubled before correcting 10–20% in 2023. Long-run appreciation barely exceeds inflation after transaction costs.',
    related: ['home-equity-calculator', 'real-estate-roi-calculator', 'rent-vs-buy-calculator'],
  },
]
