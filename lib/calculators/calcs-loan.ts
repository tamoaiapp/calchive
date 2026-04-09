import type { CalcConfig } from './types'

export const loanCalcs: CalcConfig[] = [
  {
    slug: 'personal-loan-calculator',
    title: 'Personal Loan Calculator',
    desc: 'Calculate monthly payments, total cost, and interest on a personal loan.',
    cat: 'loan', icon: '💳',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '15000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '12', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Loan Term', t: 'sel', p: '3', op: [['1','1 year'],['2','2 years'],['3','3 years'],['4','4 years'],['5','5 years'],['7','7 years']] },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      const totalPaid = payment * n
      const totalInterest = totalPaid - v.amount
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Total Interest', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Amount Paid', v: parseFloat(totalPaid.toFixed(2)), fmt: 'usd' },
          { l: 'Loan Amount', v: v.amount, fmt: 'usd' },
        ],
      }
    },
    about: 'Personal loan rates averaged 12.17% APR in Q4 2023 according to the Federal Reserve, ranging from 6% for excellent credit to 36% for subprime borrowers. Unsecured personal loans typically carry higher rates than secured alternatives since lenders have no collateral to seize.',
    related: ['debt-consolidation-calculator', 'loan-comparison-calculator', 'apr-calculator'],
  },
  {
    slug: 'auto-loan-calculator',
    title: 'Auto Loan Calculator',
    desc: 'Calculate monthly car payment and total cost for your auto loan.',
    cat: 'loan', icon: '🚗',
    fields: [
      { k: 'price', l: 'Vehicle Price', p: '35000', min: 0, u: 'USD' },
      { k: 'down', l: 'Down Payment', p: '5000', min: 0, u: 'USD' },
      { k: 'trade_in', l: 'Trade-In Value', p: '3000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7', min: 0, max: 50, u: '%' },
      { k: 'months', l: 'Loan Term', t: 'sel', p: '60', op: [['24','24 months'],['36','36 months'],['48','48 months'],['60','60 months'],['72','72 months'],['84','84 months']] },
    ],
    fn: (v) => {
      const financed = v.price - v.down - v.trade_in
      if (financed <= 0) throw new Error('Down payment and trade-in exceed vehicle price.')
      const r = v.rate / 100 / 12
      const n = v.months
      const payment = r === 0 ? financed / n : (financed * r) / (1 - Math.pow(1 + r, -n))
      const totalPaid = payment * n
      const totalInterest = totalPaid - financed
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Amount Financed', v: parseFloat(financed.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Cost of Vehicle', v: parseFloat((totalPaid + v.down + v.trade_in).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Does not include taxes, registration, or dealer fees, which can add $2,000–$5,000.',
      }
    },
    about: 'New car loan rates averaged about 7.1% in Q4 2023, up from 4.5% two years prior. The average new vehicle transaction price hit $48,759 in 2023. Stretching to 84 months is increasingly common but means paying interest for 7 years while the car depreciates 50% in value.',
    related: ['car-payment-calculator', 'car-depreciation-calculator', 'lease-vs-buy-car-calculator'],
  },
  {
    slug: 'student-loan-calculator',
    title: 'Student Loan Calculator',
    desc: 'Calculate monthly student loan payments and total repayment cost.',
    cat: 'loan', icon: '🎓',
    fields: [
      { k: 'balance', l: 'Loan Balance', p: '35000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '6.5', min: 0, max: 20, u: '%' },
      { k: 'years', l: 'Repayment Term', t: 'sel', p: '10', op: [['5','5 years'],['10','10 years (Standard)'],['20','20 years (Extended)'],['25','25 years']] },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.balance / n : (v.balance * r) / (1 - Math.pow(1 + r, -n))
      const totalPaid = payment * n
      const totalInterest = totalPaid - v.balance
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Repaid', v: parseFloat(totalPaid.toFixed(2)), fmt: 'usd' },
          { l: 'Payoff Date (approx.)', v: `${v.years} years`, fmt: 'txt' },
        ],
      }
    },
    about: 'The average federal student loan rate for 2024–25 is 6.53% for undergraduates and 8.08% for graduate students. The Department of Education\'s SAVE plan caps payments at 5% of discretionary income for undergrad loans, with forgiveness after 10–25 years depending on balance.',
    related: ['income-based-repayment-calculator', 'student-loan-refinance-calculator', 'public-service-loan-forgiveness-calculator'],
  },
  {
    slug: 'debt-consolidation-calculator',
    title: 'Debt Consolidation Calculator',
    desc: 'See how much you can save by consolidating multiple debts into one loan.',
    cat: 'loan', icon: '🔀',
    fields: [
      { k: 'debt1', l: 'Debt 1 Balance', p: '8000', min: 0, u: 'USD' },
      { k: 'rate1', l: 'Debt 1 Interest Rate', p: '22', min: 0, max: 100, u: '%' },
      { k: 'debt2', l: 'Debt 2 Balance', p: '5000', min: 0, u: 'USD' },
      { k: 'rate2', l: 'Debt 2 Interest Rate', p: '18', min: 0, max: 100, u: '%' },
      { k: 'new_rate', l: 'Consolidation Loan Rate', p: '11', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Repayment Term', p: '3', min: 0.5, u: 'years' },
    ],
    fn: (v) => {
      const totalDebt = v.debt1 + v.debt2
      const weightedRate = (v.debt1 * v.rate1 + v.debt2 * v.rate2) / totalDebt
      const calcInterest = (amount: number, rate: number, years: number) => {
        const r = rate / 100 / 12
        const n = years * 12
        const pmt = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n))
        return pmt * n - amount
      }
      const interestBefore = calcInterest(totalDebt, weightedRate, v.years)
      const interestAfter = calcInterest(totalDebt, v.new_rate, v.years)
      const savings = interestBefore - interestAfter
      const r = v.new_rate / 100 / 12
      const n = v.years * 12
      const newPayment = r === 0 ? totalDebt / n : (totalDebt * r) / (1 - Math.pow(1 + r, -n))
      return {
        primary: { value: parseFloat(savings.toFixed(2)), label: 'Interest Saved', fmt: 'usd' },
        details: [
          { l: 'Total Debt', v: parseFloat(totalDebt.toFixed(2)), fmt: 'usd' },
          { l: 'New Monthly Payment', v: parseFloat(newPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Weighted Rate Before', v: parseFloat(weightedRate.toFixed(2)), fmt: 'pct' },
          { l: 'New Consolidation Rate', v: v.new_rate, fmt: 'pct' },
        ],
        note: 'Savings assume you do not accumulate new debt on cleared cards or accounts.',
      }
    },
    about: 'Debt consolidation works best when the new rate meaningfully undercuts existing rates. Moving $13,000 of credit card debt at 20%+ to an 11% personal loan saves roughly $2,000–$3,000 over 3 years — but only if you close or freeze the cleared credit lines to prevent re-accumulation.',
    related: ['credit-card-payoff-calculator', 'debt-avalanche-calculator', 'personal-loan-calculator'],
  },
  {
    slug: 'credit-card-payoff-calculator',
    title: 'Credit Card Payoff Calculator',
    desc: 'Calculate how long to pay off credit card debt and total interest paid.',
    cat: 'loan', icon: '💳',
    fields: [
      { k: 'balance', l: 'Current Balance', p: '8500', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate (APR)', p: '22', min: 0, max: 100, u: '%' },
      { k: 'payment', l: 'Monthly Payment', p: '300', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const minPayment = Math.max(v.balance * 0.02, 25)
      if (v.payment <= v.balance * r) throw new Error('Payment must exceed monthly interest charge to pay down balance.')
      let balance = v.balance, months = 0, totalInterest = 0
      while (balance > 0 && months < 600) {
        const interest = balance * r
        totalInterest += interest
        balance = Math.max(0, balance + interest - v.payment)
        months++
      }
      return {
        primary: { value: months, label: 'Months to Pay Off', fmt: 'num' },
        details: [
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Paid', v: parseFloat((v.balance + totalInterest).toFixed(2)), fmt: 'usd' },
          { l: 'Years to Payoff', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
          { l: 'Minimum Payment (est.)', v: parseFloat(minPayment.toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'At 22% APR, making minimum payments on an $8,500 balance extends payoff to 35+ years and costs over $12,000 in interest — more than the original balance. Even $100 extra per month can save years and thousands of dollars. Average US credit card APR hit 21.47% in 2023, the highest since records began.',
    related: ['debt-avalanche-calculator', 'debt-snowball-calculator', 'debt-consolidation-calculator'],
  },
  {
    slug: 'debt-avalanche-calculator',
    title: 'Debt Avalanche Calculator',
    desc: 'Calculate savings from the debt avalanche method (highest interest first).',
    cat: 'loan', icon: '🏔️',
    fields: [
      { k: 'debt1', l: 'Debt 1 Balance', p: '5000', min: 0, u: 'USD' },
      { k: 'rate1', l: 'Debt 1 Rate', p: '24', min: 0, max: 100, u: '%' },
      { k: 'debt2', l: 'Debt 2 Balance', p: '8000', min: 0, u: 'USD' },
      { k: 'rate2', l: 'Debt 2 Rate', p: '18', min: 0, max: 100, u: '%' },
      { k: 'monthly_budget', l: 'Total Monthly Payment Budget', p: '600', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const minPmt1 = Math.max(v.debt1 * 0.02, 25)
      const minPmt2 = Math.max(v.debt2 * 0.02, 25)
      const extra = v.monthly_budget - minPmt1 - minPmt2
      if (extra < 0) throw new Error('Monthly budget too low to cover minimum payments.')
      const r1 = v.rate1 / 100 / 12
      const r2 = v.rate2 / 100 / 12
      // Avalanche: pay extra on highest rate (debt1 in this case)
      let b1 = v.debt1, b2 = v.debt2, months = 0, totalInterest = 0
      while ((b1 > 0 || b2 > 0) && months < 600) {
        const int1 = b1 * r1, int2 = b2 * r2
        totalInterest += int1 + int2
        const pmt1 = b1 > 0 ? minPmt1 + extra : 0
        const pmt2 = minPmt2
        b1 = Math.max(0, b1 + int1 - pmt1)
        const leftover = pmt1 > b1 + int1 ? pmt1 - b1 - int1 : 0
        b2 = Math.max(0, b2 + int2 - pmt2 - leftover)
        months++
      }
      return {
        primary: { value: months, label: 'Months to Debt-Free (Avalanche)', fmt: 'num' },
        details: [
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Years to Payoff', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
          { l: 'Total Debt', v: v.debt1 + v.debt2, fmt: 'usd' },
        ],
        note: 'Avalanche method minimizes total interest; snowball method (lowest balance first) boosts motivation.',
      }
    },
    about: 'The debt avalanche pays the highest-interest debt first while maintaining minimums on others. Studies show it saves the most money — often thousands compared to other methods. The behavioral challenge is that high-rate debts are often large, so victories feel distant.',
    related: ['debt-snowball-calculator', 'credit-card-payoff-calculator', 'debt-consolidation-calculator'],
  },
  {
    slug: 'debt-snowball-calculator',
    title: 'Debt Snowball Calculator',
    desc: 'Calculate payoff timeline using the debt snowball method (smallest balance first).',
    cat: 'loan', icon: '⛄',
    fields: [
      { k: 'debt1', l: 'Smallest Debt Balance', p: '2000', min: 0, u: 'USD' },
      { k: 'rate1', l: 'Smallest Debt Rate', p: '16', min: 0, max: 100, u: '%' },
      { k: 'debt2', l: 'Larger Debt Balance', p: '9000', min: 0, u: 'USD' },
      { k: 'rate2', l: 'Larger Debt Rate', p: '22', min: 0, max: 100, u: '%' },
      { k: 'monthly_budget', l: 'Total Monthly Payment', p: '550', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const minPmt1 = Math.max(v.debt1 * 0.02, 25)
      const minPmt2 = Math.max(v.debt2 * 0.02, 25)
      const extra = v.monthly_budget - minPmt1 - minPmt2
      if (extra < 0) throw new Error('Monthly budget too low to cover minimum payments.')
      const r1 = v.rate1 / 100 / 12
      const r2 = v.rate2 / 100 / 12
      let b1 = v.debt1, b2 = v.debt2, months = 0, totalInterest = 0
      while ((b1 > 0 || b2 > 0) && months < 600) {
        const int1 = b1 * r1, int2 = b2 * r2
        totalInterest += int1 + int2
        // Snowball: attack smallest first
        const pmt1 = b1 > 0 ? minPmt1 + extra : 0
        const pmt2 = minPmt2
        b1 = Math.max(0, b1 + int1 - pmt1)
        const leftover = pmt1 - (b1 + int1) > 0 ? pmt1 - (b1 + int1 + Math.max(0, b1)) : 0
        b2 = Math.max(0, b2 + int2 - pmt2 - leftover)
        months++
      }
      return {
        primary: { value: months, label: 'Months to Debt-Free (Snowball)', fmt: 'num' },
        details: [
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Years to Payoff', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
          { l: 'Total Debt', v: v.debt1 + v.debt2, fmt: 'usd' },
        ],
        note: 'Snowball builds psychological momentum by eliminating smaller debts first. Works well for motivation.',
      }
    },
    about: 'Dave Ramsey popularized the debt snowball, arguing that behavioral wins matter as much as math. Research from Kellogg School of Management supports this — people who tackle the smallest balance first actually pay off more debt. The cost vs. avalanche is usually a few hundred to a few thousand dollars in extra interest.',
    related: ['debt-avalanche-calculator', 'credit-card-payoff-calculator', 'debt-consolidation-calculator'],
  },
  {
    slug: 'loan-comparison-calculator',
    title: 'Loan Comparison Calculator',
    desc: 'Compare two loan offers side-by-side to find the true best deal.',
    cat: 'loan', icon: '⚖️',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '25000', min: 0, u: 'USD' },
      { k: 'rate1', l: 'Loan 1 Rate', p: '8.5', min: 0, max: 100, u: '%' },
      { k: 'years1', l: 'Loan 1 Term', p: '5', min: 0.5, u: 'years' },
      { k: 'rate2', l: 'Loan 2 Rate', p: '7.2', min: 0, max: 100, u: '%' },
      { k: 'years2', l: 'Loan 2 Term', p: '7', min: 0.5, u: 'years' },
    ],
    fn: (v) => {
      const calcLoan = (rate: number, years: number) => {
        const r = rate / 100 / 12
        const n = years * 12
        const pmt = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
        return { pmt, interest: pmt * n - v.amount, total: pmt * n }
      }
      const l1 = calcLoan(v.rate1, v.years1)
      const l2 = calcLoan(v.rate2, v.years2)
      const better = l1.total <= l2.total ? 'Loan 1' : 'Loan 2'
      return {
        primary: { value: parseFloat(Math.abs(l1.total - l2.total).toFixed(2)), label: `Loan ${l1.total <= l2.total ? 1 : 2} saves (total cost)`, fmt: 'usd' },
        details: [
          { l: 'Loan 1 Monthly Payment', v: parseFloat(l1.pmt.toFixed(2)), fmt: 'usd' },
          { l: 'Loan 1 Total Interest', v: parseFloat(l1.interest.toFixed(2)), fmt: 'usd' },
          { l: 'Loan 2 Monthly Payment', v: parseFloat(l2.pmt.toFixed(2)), fmt: 'usd' },
          { l: 'Loan 2 Total Interest', v: parseFloat(l2.interest.toFixed(2)), fmt: 'usd' },
          { l: 'Best Overall', v: better, fmt: 'txt', color: 'var(--green)' },
        ],
        note: 'Compare total interest paid, not just monthly payment. Longer terms mean lower payments but more total interest.',
      }
    },
    about: 'A shorter-term loan at a higher rate often costs less than a longer-term loan at a lower rate. A 5-year loan at 8.5% on $25,000 costs $5,500 in interest; a 7-year loan at 7.2% costs $7,100 — 29% more despite the lower rate.',
    related: ['personal-loan-calculator', 'auto-loan-calculator', 'apr-calculator'],
  },
  {
    slug: 'car-payment-calculator',
    title: 'Car Payment Calculator',
    desc: 'Calculate your monthly car payment and total vehicle cost.',
    cat: 'loan', icon: '🚙',
    fields: [
      { k: 'price', l: 'Vehicle Price', p: '38000', min: 0, u: 'USD' },
      { k: 'down', l: 'Down Payment', p: '6000', min: 0, u: 'USD' },
      { k: 'rate', l: 'APR', p: '7.5', min: 0, max: 50, u: '%' },
      { k: 'months', l: 'Loan Term (months)', t: 'sel', p: '60', op: [['36','36'],['48','48'],['60','60'],['72','72'],['84','84']] },
    ],
    fn: (v) => {
      const financed = v.price - v.down
      const r = v.rate / 100 / 12
      const n = v.months
      const payment = r === 0 ? financed / n : (financed * r) / (1 - Math.pow(1 + r, -n))
      const totalInterest = payment * n - financed
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Amount Financed', v: parseFloat(financed.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Cost', v: parseFloat((payment * n + v.down).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Add estimated sales tax (5–9%), registration fees, and insurance to get the true cost of ownership.',
      }
    },
    about: 'The typical American spends $700–$750/month on car payments in 2024, with the average new vehicle transaction near $49,000. The 20/4/10 rule suggests 20% down, no more than 4-year term, and total car expenses below 10% of gross income.',
    related: ['auto-loan-calculator', 'car-depreciation-calculator', 'lease-vs-buy-car-calculator'],
  },
  {
    slug: 'car-depreciation-calculator',
    title: 'Car Depreciation Calculator',
    desc: 'Calculate how much your vehicle loses in value over time.',
    cat: 'loan', icon: '📉',
    fields: [
      { k: 'price', l: 'New Vehicle Price', p: '45000', min: 0, u: 'USD' },
      { k: 'years', l: 'Years of Ownership', p: '5', min: 0, u: 'years' },
    ],
    fn: (v) => {
      // Industry average: 20% year 1, 15% years 2-5
      let value = v.price * 0.80 // after year 1
      for (let y = 1; y < v.years; y++) value *= 0.85
      const totalLoss = v.price - value
      const annualLoss = totalLoss / v.years
      const remainingPct = (value / v.price) * 100
      return {
        primary: { value: parseFloat(value.toFixed(0)), label: 'Vehicle Value After Depreciation', fmt: 'usd' },
        details: [
          { l: 'Original Price', v: v.price, fmt: 'usd' },
          { l: 'Total Value Lost', v: parseFloat(totalLoss.toFixed(0)), fmt: 'usd', color: '#f87171' },
          { l: 'Average Annual Loss', v: parseFloat(annualLoss.toFixed(0)), fmt: 'usd' },
          { l: 'Remaining Value %', v: parseFloat(remainingPct.toFixed(1)), fmt: 'pct' },
        ],
        note: 'New cars lose ~20% in the first year and ~15% per year after. Electric vehicles may depreciate faster in some markets.',
      }
    },
    about: 'A new car loses about 20% of its value in the first year — a $45,000 vehicle is worth $36,000 the day you drive it off the lot. After 5 years, it\'s worth roughly $24,000. Buying 2–3 year old certified pre-owned vehicles lets someone else absorb the steepest depreciation curve.',
    related: ['auto-loan-calculator', 'car-payment-calculator', 'lease-vs-buy-car-calculator'],
  },
  {
    slug: 'lease-vs-buy-car-calculator',
    title: 'Lease vs. Buy Car Calculator',
    desc: 'Compare the true cost of leasing versus buying a vehicle.',
    cat: 'loan', icon: '🔄',
    fields: [
      { k: 'price', l: 'Vehicle Price', p: '40000', min: 0, u: 'USD' },
      { k: 'lease_payment', l: 'Monthly Lease Payment', p: '450', min: 0, u: 'USD' },
      { k: 'lease_down', l: 'Lease Down (cap cost reduction)', p: '2000', min: 0, u: 'USD' },
      { k: 'loan_rate', l: 'Auto Loan Rate', p: '7.5', min: 0, max: 50, u: '%' },
      { k: 'down_buy', l: 'Down Payment to Buy', p: '8000', min: 0, u: 'USD' },
      { k: 'years', l: 'Comparison Period', p: '3', min: 1, u: 'years' },
    ],
    fn: (v) => {
      const months = v.years * 12
      const totalLease = v.lease_payment * months + v.lease_down
      const financed = v.price - v.down_buy
      const r = v.loan_rate / 100 / 12
      const n = months
      const payment = r === 0 ? financed / n : (financed * r) / (1 - Math.pow(1 + r, -n))
      const totalBuy = payment * n + v.down_buy
      const remainingBalance = r === 0 ? financed - payment * n : financed * Math.pow(1 + r, n) - payment * (Math.pow(1 + r, n) - 1) / r
      const carValue = v.price * Math.pow(0.85, v.years) * 0.80
      const buyNetCost = totalBuy - Math.max(0, carValue - Math.max(0, remainingBalance))
      const advantage = totalLease - buyNetCost
      return {
        primary: { value: parseFloat(Math.abs(advantage).toFixed(0)), label: advantage > 0 ? 'Buying Advantage' : 'Leasing Advantage', fmt: 'usd' },
        details: [
          { l: 'Total Lease Cost', v: parseFloat(totalLease.toFixed(0)), fmt: 'usd' },
          { l: 'Total Buy Cost (net of vehicle value)', v: parseFloat(buyNetCost.toFixed(0)), fmt: 'usd' },
          { l: 'Est. Vehicle Value at End', v: parseFloat(carValue.toFixed(0)), fmt: 'usd' },
          { l: 'Winner', v: advantage > 0 ? 'Buying' : 'Leasing', fmt: 'txt', color: 'var(--green)' },
        ],
        note: 'Leasing suits drivers who want a new car every 3 years and stay within mileage limits. Buying builds equity.',
      }
    },
    about: 'Leasing\'s appeal is lower monthly payments, but you build zero equity. Buying costs more monthly but ends with an asset. Research from Consumer Reports finds buying almost always cheaper over a 5-year horizon — the break-even for leasing typically requires keeping the car less than 2–3 years.',
    related: ['auto-loan-calculator', 'car-payment-calculator', 'car-depreciation-calculator'],
  },
  {
    slug: 'income-based-repayment-calculator',
    title: 'Income-Based Repayment Calculator',
    desc: 'Estimate your monthly payment under federal income-driven repayment (IDR) plans.',
    cat: 'loan', icon: '🎓',
    fields: [
      { k: 'agi', l: 'Adjusted Gross Income', p: '55000', min: 0, u: 'USD' },
      { k: 'family_size', l: 'Family Size', p: '1', min: 1, max: 10 },
      { k: 'plan', l: 'IDR Plan', t: 'sel', p: '0', op: [['0','SAVE (5% discretionary)'],['1','IBR (10%)'],['2','PAYE (10%)'],['3','ICR (20%)']]}
    ],
    fn: (v) => {
      const povertyLine = 15060 + (v.family_size - 1) * 5380
      const discretionaryRates = [0.05, 0.10, 0.10, 0.20]
      const discretionaryMultipliers = [1.0, 1.5, 1.0, 1.0]
      const rate = discretionaryRates[v.plan]
      const mult = discretionaryMultipliers[v.plan]
      const discretionary = Math.max(0, v.agi - povertyLine * mult * 2.25)
      const annual = discretionary * rate
      const monthly = annual / 12
      return {
        primary: { value: parseFloat(monthly.toFixed(2)), label: 'Estimated Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Discretionary Income', v: parseFloat(discretionary.toFixed(0)), fmt: 'usd' },
          { l: 'Poverty Line (family size)', v: parseFloat(povertyLine.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Payment', v: parseFloat(annual.toFixed(0)), fmt: 'usd' },
          { l: 'Forgiveness After', v: `${v.plan === 0 ? 10 : 20}–25 years (taxable)`, fmt: 'txt' },
        ],
        note: 'SAVE plan provides $0 payments when income falls below 225% of poverty line.',
      }
    },
    about: 'The SAVE plan (Saving on a Valuable Education), introduced in 2023, is the most generous IDR plan — undergraduate loan payments capped at 5% of discretionary income with forgiveness after 10 years for borrowers under $12,000 in original debt. Approximately 8 million borrowers enrolled in the plan.',
    related: ['student-loan-calculator', 'public-service-loan-forgiveness-calculator', 'student-loan-refinance-calculator'],
  },
  {
    slug: 'public-service-loan-forgiveness-calculator',
    title: 'PSLF Calculator',
    desc: 'Estimate how much student loan debt is forgiven under PSLF after 10 years.',
    cat: 'loan', icon: '🏛️',
    fields: [
      { k: 'balance', l: 'Federal Loan Balance', p: '60000', min: 0, u: 'USD' },
      { k: 'agi', l: 'Annual Income (AGI)', p: '55000', min: 0, u: 'USD' },
      { k: 'months_completed', l: 'Qualifying Payments Completed', p: '36', min: 0, max: 120, u: 'months' },
    ],
    fn: (v) => {
      const monthsRemaining = Math.max(0, 120 - v.months_completed)
      const povertyLine = 15060
      const discretionary = Math.max(0, v.agi - povertyLine * 2.25)
      const monthlyPayment = (discretionary * 0.05) / 12
      const totalPaid = monthlyPayment * monthsRemaining
      const amountForgiven = Math.max(0, v.balance - totalPaid * 0.3) // simplified estimate
      return {
        primary: { value: parseFloat(amountForgiven.toFixed(0)), label: 'Estimated Amount Forgiven (Tax-Free)', fmt: 'usd' },
        details: [
          { l: 'Remaining Qualifying Payments', v: monthsRemaining, fmt: 'num' },
          { l: 'Estimated Monthly Payment (SAVE)', v: parseFloat(monthlyPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Forgiveness Timeline', v: `${Math.ceil(monthsRemaining / 12)} more years`, fmt: 'txt' },
        ],
        note: 'PSLF forgiveness is tax-free. Requires 120 qualifying payments at a qualifying employer (government, non-profit).',
      }
    },
    about: 'PSLF forgives remaining federal student loan balances tax-free after 120 qualifying monthly payments while working full-time for government or eligible non-profit employers. As of 2024, over 800,000 borrowers have received forgiveness averaging $80,000 per person.',
    related: ['student-loan-calculator', 'income-based-repayment-calculator', 'student-loan-refinance-calculator'],
  },
  {
    slug: 'student-loan-refinance-calculator',
    title: 'Student Loan Refinance Calculator',
    desc: 'Calculate how much refinancing your student loans could save.',
    cat: 'loan', icon: '🔄',
    fields: [
      { k: 'balance', l: 'Loan Balance', p: '45000', min: 0, u: 'USD' },
      { k: 'current_rate', l: 'Current Interest Rate', p: '7.5', min: 0, max: 30, u: '%' },
      { k: 'new_rate', l: 'New Rate (private refi)', p: '5.2', min: 0, max: 30, u: '%' },
      { k: 'years', l: 'New Repayment Term', t: 'sel', p: '10', op: [['5','5 years'],['7','7 years'],['10','10 years'],['15','15 years'],['20','20 years']] },
    ],
    fn: (v) => {
      const calc = (amount: number, rate: number, years: number) => {
        const r = rate / 100 / 12
        const n = years * 12
        const pmt = r === 0 ? amount / n : (amount * r) / (1 - Math.pow(1 + r, -n))
        return { pmt, total: pmt * n, interest: pmt * n - amount }
      }
      const current = calc(v.balance, v.current_rate, v.years)
      const refi = calc(v.balance, v.new_rate, v.years)
      const savings = current.interest - refi.interest
      return {
        primary: { value: parseFloat(savings.toFixed(2)), label: 'Total Interest Saved', fmt: 'usd' },
        details: [
          { l: 'New Monthly Payment', v: parseFloat(refi.pmt.toFixed(2)), fmt: 'usd' },
          { l: 'Current Monthly Payment', v: parseFloat(current.pmt.toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Savings', v: parseFloat((current.pmt - refi.pmt).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
        note: 'WARNING: Refinancing federal loans into private loans permanently loses IDR plans, PSLF, and federal forbearance options.',
      }
    },
    about: 'Private student loan refinancing rates run 4–8% for borrowers with strong credit, versus 6.5–8%+ for most federal loans. The savings can be substantial — but refinancing federal loans is irreversible and eliminates income-driven repayment, PSLF eligibility, and federal hardship programs.',
    related: ['student-loan-calculator', 'income-based-repayment-calculator', 'public-service-loan-forgiveness-calculator'],
  },
  {
    slug: 'minimum-payment-calculator',
    title: 'Minimum Payment Calculator',
    desc: 'See how long it takes to pay off debt making only minimum payments.',
    cat: 'loan', icon: '⚠️',
    fields: [
      { k: 'balance', l: 'Credit Card Balance', p: '6000', min: 0, u: 'USD' },
      { k: 'rate', l: 'APR', p: '22', min: 0, max: 100, u: '%' },
      { k: 'min_pct', l: 'Minimum Payment %', p: '2', min: 0.5, max: 10, u: '%' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      let balance = v.balance, months = 0, totalInterest = 0
      while (balance > 0.99 && months < 1200) {
        const interest = balance * r
        const payment = Math.max(balance * (v.min_pct / 100), 25)
        totalInterest += interest
        balance = balance + interest - payment
        months++
      }
      return {
        primary: { value: months, label: 'Months to Pay Off (Minimum Payments)', fmt: 'num' },
        details: [
          { l: 'Years to Payoff', v: parseFloat((months / 12).toFixed(1)), fmt: 'num' },
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Paid', v: parseFloat((v.balance + totalInterest).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Minimum payments are designed to maximize interest revenue for lenders. Even $50 extra/month dramatically reduces payoff time.',
      }
    },
    about: 'Making only minimum payments on a $6,000 credit card balance at 22% APR can take 20+ years and cost twice the original balance in interest. Issuers typically set minimums at 1–2% of the balance — low enough to ensure maximum interest extraction.',
    related: ['credit-card-payoff-calculator', 'debt-avalanche-calculator', 'debt-consolidation-calculator'],
  },
  {
    slug: 'business-loan-calculator',
    title: 'Business Loan Calculator',
    desc: 'Calculate monthly payments and total cost for a small business loan.',
    cat: 'loan', icon: '🏢',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '150000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '8.5', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Loan Term', t: 'sel', p: '5', op: [['1','1 year'],['2','2 years'],['3','3 years'],['5','5 years'],['7','7 years'],['10','10 years']] },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      const totalInterest = payment * n - v.amount
      const annualCost = payment * 12
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Annual Loan Cost', v: parseFloat(annualCost.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Repaid', v: parseFloat((payment * n).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'SBA 7(a) loans offer the best rates for small business financing — prime + 2.25–4.75% depending on term. Conventional bank loans for established businesses run 7–12% while online lenders charge 15–50%+ for newer or riskier businesses. The SBA guaranteed $43.6 billion in loans in fiscal year 2023.',
    related: ['sba-loan-calculator', 'equipment-loan-calculator', 'line-of-credit-calculator'],
  },
  {
    slug: 'sba-loan-calculator',
    title: 'SBA Loan Calculator',
    desc: 'Calculate payments for SBA 7(a) and SBA 504 loan programs.',
    cat: 'loan', icon: '🇺🇸',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '500000', min: 0, u: 'USD' },
      { k: 'sba_type', l: 'SBA Program', t: 'sel', p: '0', op: [['0','SBA 7(a) — up to $5M'],['1','SBA 504 — real estate/equipment']] },
      { k: 'years', l: 'Loan Term', t: 'sel', p: '10', op: [['7','7 years (working capital)'],['10','10 years'],['25','25 years (real estate)']] },
    ],
    fn: (v) => {
      const primeRate = 8.5
      const spread = v.years <= 7 ? 2.25 : 2.75
      const rate = v.sba_type === 0 ? primeRate + spread : 6.5
      const r = rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      const totalInterest = payment * n - v.amount
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Estimated Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Estimated Rate', v: parseFloat(rate.toFixed(2)), fmt: 'pct' },
          { l: 'Total Interest', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Repaid', v: parseFloat((payment * n).toFixed(2)), fmt: 'usd' },
        ],
        note: 'SBA loans require 10–30% down and personal guarantees. Rate shown is approximate based on current prime rate.',
      }
    },
    about: 'SBA 7(a) loans are the most flexible, funding equipment, working capital, or acquisitions. SBA 504 loans specifically finance commercial real estate and heavy equipment with fixed 20–25 year terms. Processing typically takes 60–90 days — faster via SBA Preferred Lenders.',
    related: ['business-loan-calculator', 'equipment-loan-calculator', 'line-of-credit-calculator'],
  },
  {
    slug: 'loan-amortization-calculator',
    title: 'Loan Amortization Calculator',
    desc: 'Calculate the full amortization schedule for any loan.',
    cat: 'loan', icon: '📅',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '20000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '8', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Loan Term', p: '5', min: 0.5, u: 'years' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const payment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      const totalInterest = payment * n - v.amount
      const firstMonthInterest = v.amount * r
      const firstMonthPrincipal = payment - firstMonthInterest
      const lastMonthInterest = (v.amount - (v.amount / n) * (n - 1)) * r
      return {
        primary: { value: parseFloat(payment.toFixed(2)), label: 'Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Month 1 Interest', v: parseFloat(firstMonthInterest.toFixed(2)), fmt: 'usd' },
          { l: 'Month 1 Principal', v: parseFloat(firstMonthPrincipal.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest Over Life', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Total Paid', v: parseFloat((payment * n).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'Amortization schedules reveal how loans are structured to maximize early interest collection. On a 5-year $20,000 loan at 8%, the first payment is only 33% principal — it passes 50% around month 30. This front-loading is why extra early payments have such an outsized impact on total interest paid.',
    related: ['personal-loan-calculator', 'extra-payment-calculator', 'amortization-calculator'],
  },
  {
    slug: '529-plan-calculator',
    title: '529 College Savings Plan Calculator',
    desc: 'Calculate how much your 529 plan will grow and what it can cover.',
    cat: 'loan', icon: '🎓',
    fields: [
      { k: 'current_balance', l: 'Current 529 Balance', p: '10000', min: 0, u: 'USD' },
      { k: 'monthly_contribution', l: 'Monthly Contribution', p: '300', min: 0, u: 'USD' },
      { k: 'years', l: 'Years Until College', p: '12', min: 0, u: 'years' },
      { k: 'rate', l: 'Expected Annual Return', p: '7', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const fvCurrent = v.current_balance * Math.pow(1 + r, n)
      const fvContributions = r === 0 ? v.monthly_contribution * n : v.monthly_contribution * (Math.pow(1 + r, n) - 1) / r
      const total = fvCurrent + fvContributions
      const totalContributed = v.current_balance + v.monthly_contribution * n
      return {
        primary: { value: parseFloat(total.toFixed(0)), label: 'Projected 529 Balance', fmt: 'usd' },
        details: [
          { l: 'Total Contributed', v: parseFloat(totalContributed.toFixed(0)), fmt: 'usd' },
          { l: 'Tax-Free Growth', v: parseFloat((total - totalContributed).toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Avg 4-Year Public College Cost (2024)', v: 111060, fmt: 'usd' },
        ],
        note: '529 withdrawals for qualified education expenses are federally tax-free. Many states offer income tax deductions for contributions.',
      }
    },
    about: 'Average 4-year public university total cost (tuition, room, board) is about $111,000 in 2024; private universities average $230,000+. Starting a $300/month 529 contribution at birth produces roughly $160,000 by age 18 at 7% returns — enough to cover most public university costs.',
    related: ['college-savings-calculator', 'college-cost-calculator', 'student-loan-calculator'],
  },
  {
    slug: 'college-savings-calculator',
    title: 'College Savings Calculator',
    desc: 'Calculate how much to save monthly to cover college costs for your child.',
    cat: 'loan', icon: '📚',
    fields: [
      { k: 'current_age', l: "Child's Current Age", p: '5', min: 0, max: 17 },
      { k: 'college_cost', l: 'Annual College Cost (today)', p: '30000', min: 0, u: 'USD' },
      { k: 'current_savings', l: 'Current College Savings', p: '8000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Expected Investment Return', p: '6', min: 0, max: 20, u: '%' },
    ],
    fn: (v) => {
      const yearsToCollege = 18 - v.current_age
      const inflationRate = 0.05 // college inflation
      const futureCost = v.college_cost * Math.pow(1 + inflationRate, yearsToCollege) * 4
      const r = v.rate / 100 / 12
      const n = yearsToCollege * 12
      const fvCurrent = v.current_savings * Math.pow(1 + r, n)
      const needed = Math.max(0, futureCost - fvCurrent)
      const monthly = r === 0 ? needed / n : needed * r / (Math.pow(1 + r, n) - 1)
      return {
        primary: { value: parseFloat(monthly.toFixed(2)), label: 'Monthly Savings Needed', fmt: 'usd' },
        details: [
          { l: 'Projected 4-Year Cost', v: parseFloat(futureCost.toFixed(0)), fmt: 'usd' },
          { l: 'Current Savings Growth', v: parseFloat(fvCurrent.toFixed(0)), fmt: 'usd' },
          { l: 'Additional Needed', v: parseFloat(needed.toFixed(0)), fmt: 'usd' },
          { l: 'Years to Save', v: yearsToCollege, fmt: 'num' },
        ],
        note: 'College costs have risen 5%+ annually historically. 529 plans offer tax-free growth for education expenses.',
      }
    },
    about: 'College tuition has increased at roughly 5–6% annually for 30 years, far outpacing general inflation. A child born today faces potential 4-year costs of $250,000–$500,000 at private universities. Financial aid, scholarships, and community college starting points can significantly reduce the actual out-of-pocket burden.',
    related: ['529-plan-calculator', 'college-cost-calculator', 'student-loan-calculator'],
  },
  {
    slug: 'college-cost-calculator',
    title: 'College Cost Calculator',
    desc: 'Estimate total 4-year college cost including tuition, room, board, and fees.',
    cat: 'loan', icon: '🏛️',
    fields: [
      { k: 'annual_tuition', l: 'Annual Tuition & Fees', p: '15000', min: 0, u: 'USD' },
      { k: 'room_board', l: 'Room & Board (annual)', p: '12000', min: 0, u: 'USD' },
      { k: 'books_misc', l: 'Books, Supplies & Misc (annual)', p: '3000', min: 0, u: 'USD' },
      { k: 'aid', l: 'Annual Financial Aid / Scholarships', p: '5000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const annualTotal = v.annual_tuition + v.room_board + v.books_misc
      const annualNet = annualTotal - v.aid
      const fourYear = annualNet * 4
      const withInflation = annualNet * (1 + 1.05 * 2) * 4 / 2 // simple avg with 5% inflation over 4 years
      return {
        primary: { value: parseFloat(fourYear.toFixed(0)), label: '4-Year Net Cost', fmt: 'usd' },
        details: [
          { l: 'Annual Total Cost', v: parseFloat(annualTotal.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Net After Aid', v: parseFloat(annualNet.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Financial Aid', v: v.aid, fmt: 'usd', color: 'var(--green)' },
          { l: 'Monthly Savings Needed (now)', v: parseFloat((fourYear / (12 * 5)).toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'For 2023–24, average published in-state tuition at public 4-year universities is $11,260; out-of-state is $29,150; private nonprofit is $41,540. Net prices after aid are significantly lower: $15,030 public in-state and $27,290 private on average.',
    related: ['college-savings-calculator', '529-plan-calculator', 'student-loan-calculator'],
  },
  {
    slug: 'payday-loan-calculator',
    title: 'Payday Loan Calculator',
    desc: 'Calculate the true annual APR and total cost of a payday loan.',
    cat: 'loan', icon: '⚠️',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '400', min: 0, u: 'USD' },
      { k: 'fee', l: 'Finance Charge / Fee', p: '60', min: 0, u: 'USD' },
      { k: 'days', l: 'Loan Duration', p: '14', min: 1, u: 'days' },
    ],
    fn: (v) => {
      const apr = (v.fee / v.amount) * (365 / v.days) * 100
      const totalRepay = v.amount + v.fee
      return {
        primary: { value: parseFloat(apr.toFixed(1)), label: 'Effective APR', fmt: 'pct' },
        details: [
          { l: 'Total Repayment', v: parseFloat(totalRepay.toFixed(2)), fmt: 'usd' },
          { l: 'Fee Amount', v: v.fee, fmt: 'usd', color: '#f87171' },
          { l: 'Cost Per $100 Borrowed', v: parseFloat(((v.fee / v.amount) * 100).toFixed(2)), fmt: 'usd' },
        ],
        note: 'CFPB data shows 80% of payday loans are rolled over within 14 days. Seek credit unions or employer advances instead.',
      }
    },
    about: 'Payday loans carry APRs of 300–700% on average — a $60 fee on a $400, 14-day loan equals 391% APR. The CFPB found 75% of payday loan fees come from borrowers stuck in 10+ loan cycles. Credit union payday alternative loans (PALs) charge maximum 28% APR and are a far superior option.',
    related: ['personal-loan-calculator', 'credit-card-payoff-calculator', 'debt-avalanche-calculator'],
  },
  {
    slug: 'debt-to-income-ratio-calculator',
    title: 'Debt-to-Income Ratio Calculator (Loans)',
    desc: 'Calculate your DTI to determine your qualification for new loans.',
    cat: 'loan', icon: '📊',
    fields: [
      { k: 'monthly_income', l: 'Gross Monthly Income', p: '6500', min: 0.01, u: 'USD' },
      { k: 'mortgage', l: 'Mortgage / Rent', p: '1600', min: 0, u: 'USD' },
      { k: 'car', l: 'Auto Loan(s)', p: '450', min: 0, u: 'USD' },
      { k: 'student', l: 'Student Loans', p: '250', min: 0, u: 'USD' },
      { k: 'credit', l: 'Credit Card Minimums', p: '100', min: 0, u: 'USD' },
      { k: 'other', l: 'Other Monthly Debt', p: '0', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const totalDebt = v.mortgage + v.car + v.student + v.credit + v.other
      const dti = (totalDebt / v.monthly_income) * 100
      const frontEnd = (v.mortgage / v.monthly_income) * 100
      let qualification = 'Excellent — qualify for best rates'
      if (dti > 50) qualification = 'High risk — most lenders will decline'
      else if (dti > 43) qualification = 'Borderline — FHA only, higher rates'
      else if (dti > 36) qualification = 'Acceptable — may face higher rates'
      return {
        primary: { value: parseFloat(dti.toFixed(1)), label: 'Debt-to-Income Ratio', fmt: 'pct' },
        details: [
          { l: 'Total Monthly Debt', v: parseFloat(totalDebt.toFixed(2)), fmt: 'usd' },
          { l: 'Front-End DTI', v: parseFloat(frontEnd.toFixed(1)), fmt: 'pct' },
          { l: 'Qualification Assessment', v: qualification, fmt: 'txt', color: dti <= 36 ? 'var(--green)' : dti <= 43 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'DTI is the primary metric lenders use to evaluate loan repayment capacity. Fannie Mae\'s conventional loan DTI limit is 45–50% with compensating factors; FHA allows up to 57% in some cases. Lower DTI correlates strongly with on-time payment history and lower default rates.',
    related: ['personal-loan-calculator', 'mortgage-affordability-calculator', 'debt-to-income-calculator'],
  },
  {
    slug: 'maximum-loan-calculator',
    title: 'Maximum Loan Calculator',
    desc: 'Calculate the maximum loan you qualify for based on income and DTI limits.',
    cat: 'loan', icon: '🔝',
    fields: [
      { k: 'monthly_income', l: 'Gross Monthly Income', p: '7000', min: 0.01, u: 'USD' },
      { k: 'existing_debt', l: 'Existing Monthly Debt Payments', p: '400', min: 0, u: 'USD' },
      { k: 'rate', l: 'Expected Interest Rate', p: '7.5', min: 0, max: 50, u: '%' },
      { k: 'years', l: 'Loan Term', p: '30', min: 0.5, u: 'years' },
      { k: 'max_dti', l: 'Max DTI Allowed', p: '43', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const maxPayment = v.monthly_income * (v.max_dti / 100) - v.existing_debt
      if (maxPayment <= 0) throw new Error('Existing debt exceeds maximum DTI limit.')
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const maxLoan = r === 0 ? maxPayment * n : maxPayment * (1 - Math.pow(1 + r, -n)) / r
      return {
        primary: { value: parseFloat(maxLoan.toFixed(0)), label: 'Maximum Loan Amount', fmt: 'usd' },
        details: [
          { l: 'Maximum Monthly Payment', v: parseFloat(maxPayment.toFixed(2)), fmt: 'usd' },
          { l: 'At Interest Rate', v: v.rate, fmt: 'pct' },
          { l: 'DTI Limit Applied', v: v.max_dti, fmt: 'pct' },
        ],
      }
    },
    about: 'Lenders calculate maximum loan amounts by working backward from DTI limits — setting a maximum payment, then calculating the loan size that payment can support. The exact maximum varies by loan type, credit score, and compensating factors like cash reserves.',
    related: ['personal-loan-calculator', 'mortgage-affordability-calculator', 'debt-to-income-ratio-calculator'],
  },
  {
    slug: 'balloon-payment-calculator',
    title: 'Balloon Payment Calculator',
    desc: 'Calculate payments and final balloon payment for a balloon loan.',
    cat: 'loan', icon: '🎈',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '200000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '6.5', min: 0, max: 50, u: '%' },
      { k: 'payment_years', l: 'Payment Period', p: '7', min: 0.5, u: 'years' },
      { k: 'balloon_years', l: 'Amortization Period', p: '30', min: 0.5, u: 'years' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.balloon_years * 12
      const payment = r === 0 ? v.amount / n : (v.amount * r) / (1 - Math.pow(1 + r, -n))
      const paymentMonths = v.payment_years * 12
      const balloon = r === 0 ? v.amount - payment * paymentMonths : v.amount * Math.pow(1 + r, paymentMonths) - payment * (Math.pow(1 + r, paymentMonths) - 1) / r
      const totalPaid = payment * paymentMonths + balloon
      return {
        primary: { value: parseFloat(balloon.toFixed(2)), label: 'Balloon Payment Due', fmt: 'usd' },
        details: [
          { l: 'Monthly Payment', v: parseFloat(payment.toFixed(2)), fmt: 'usd' },
          { l: 'Total Regular Payments', v: parseFloat((payment * paymentMonths).toFixed(2)), fmt: 'usd' },
          { l: 'Total Cost', v: parseFloat(totalPaid.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Balloon loans carry refinancing risk — if rates rise or credit tightens, you may not be able to refinance.',
      }
    },
    about: 'Balloon mortgages were common before the 2008 crisis, offering lower initial rates at the cost of a large lump-sum payment at term end. Commercial real estate loans commonly use 5–7 year balloons amortized over 25–30 years. The risk is substantial if refinancing conditions worsen.',
    related: ['mortgage-payment-calculator', 'interest-only-loan-calculator', 'refinance-calculator'],
  },
  {
    slug: 'interest-only-loan-calculator',
    title: 'Interest-Only Loan Calculator',
    desc: 'Calculate interest-only payments and the payment jump when amortization begins.',
    cat: 'loan', icon: '💲',
    fields: [
      { k: 'amount', l: 'Loan Amount', p: '400000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7', min: 0, max: 50, u: '%' },
      { k: 'io_years', l: 'Interest-Only Period', p: '10', min: 0, u: 'years' },
      { k: 'total_years', l: 'Total Loan Term', p: '30', min: 0.5, u: 'years' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const ioPayment = v.amount * r
      const amorMonths = (v.total_years - v.io_years) * 12
      const amorPayment = r === 0 ? v.amount / amorMonths : (v.amount * r) / (1 - Math.pow(1 + r, -amorMonths))
      const jump = amorPayment - ioPayment
      return {
        primary: { value: parseFloat(ioPayment.toFixed(2)), label: 'Interest-Only Monthly Payment', fmt: 'usd' },
        details: [
          { l: 'Amortizing Payment (after IO period)', v: parseFloat(amorPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Payment Increase at Year ' + v.io_years, v: parseFloat(jump.toFixed(2)), fmt: 'usd', color: '#fbbf24' },
          { l: 'Interest-Only Period Interest Total', v: parseFloat((ioPayment * v.io_years * 12).toFixed(2)), fmt: 'usd', color: '#f87171' },
        ],
        note: 'During the IO period, you build zero equity. Principal does not decline.',
      }
    },
    about: 'Interest-only loans were widely blamed for the 2008 housing crisis — borrowers could afford payments only because they weren\'t building equity. They still exist for HELOCs, bridge loans, and commercial real estate. The payment shock when amortization begins can be 20–40% higher.',
    related: ['mortgage-payment-calculator', 'heloc-calculator', 'balloon-payment-calculator'],
  },
]
