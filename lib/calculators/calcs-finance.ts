import type { CalcConfig } from './types'

export const financeCalcs: CalcConfig[] = [
  {
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    desc: 'Calculate how your investment grows with compound interest over time.',
    cat: 'finance', icon: '📈',
    fields: [
      { k: 'principal', l: 'Principal Amount', p: '10000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Interest Rate', p: '7', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Time Period', p: '10', min: 0, u: 'years' },
      { k: 'n', l: 'Compounding Frequency', t: 'sel', p: '12', op: [['1','Annually'],['2','Semi-annually'],['4','Quarterly'],['12','Monthly'],['365','Daily']] },
    ],
    fn: (v) => {
      const A = v.principal * Math.pow(1 + (v.rate / 100) / v.n, v.n * v.years)
      const interest = A - v.principal
      return {
        primary: { value: A, label: 'Future Value', fmt: 'usd' },
        details: [
          { l: 'Principal', v: v.principal, fmt: 'usd' },
          { l: 'Total Interest Earned', v: interest, fmt: 'usd', color: 'var(--green)' },
          { l: 'Growth Multiplier', v: parseFloat((A / v.principal).toFixed(2)), fmt: 'num' },
        ],
        note: 'Assumes fixed rate and no additional contributions.',
      }
    },
    about: 'Compound interest is the eighth wonder of the world — $10,000 at 7% compounded monthly for 30 years grows to nearly $82,000 without adding a single dollar. The frequency of compounding matters: daily compounding yields slightly more than annual, though the difference narrows as time shortens.',
    related: ['simple-interest-calculator', 'savings-goal-calculator', 'future-value-calculator'],
  },
  {
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator',
    desc: 'Calculate interest earned or owed on a principal amount at a fixed rate.',
    cat: 'finance', icon: '💵',
    fields: [
      { k: 'principal', l: 'Principal Amount', p: '5000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Rate', p: '5', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Time Period', p: '3', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const interest = v.principal * (v.rate / 100) * v.years
      const total = v.principal + interest
      return {
        primary: { value: total, label: 'Total Amount', fmt: 'usd' },
        details: [
          { l: 'Principal', v: v.principal, fmt: 'usd' },
          { l: 'Interest Earned', v: interest, fmt: 'usd', color: 'var(--green)' },
          { l: 'Annual Interest', v: interest / v.years, fmt: 'usd' },
        ],
      }
    },
    about: 'Simple interest is calculated only on the original principal, never on accumulated interest. Most auto loans and short-term personal loans use simple interest, while savings accounts and mortgages use compound interest. The formula is I = P × r × t.',
    related: ['compound-interest-calculator', 'apr-calculator', 'effective-interest-rate-calculator'],
  },
  {
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    desc: 'Calculate return on investment and annualized ROI for any investment.',
    cat: 'finance', icon: '📊',
    fields: [
      { k: 'initial', l: 'Initial Investment', p: '10000', min: 0, u: 'USD' },
      { k: 'final', l: 'Final Value', p: '14500', min: 0, u: 'USD' },
      { k: 'years', l: 'Holding Period', p: '3', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const roi = ((v.final - v.initial) / v.initial) * 100
      const annualized = (Math.pow(v.final / v.initial, 1 / v.years) - 1) * 100
      const gain = v.final - v.initial
      return {
        primary: { value: parseFloat(roi.toFixed(2)), label: 'Total ROI', fmt: 'pct' },
        details: [
          { l: 'Net Gain / Loss', v: gain, fmt: 'usd', color: gain >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Annualized ROI', v: parseFloat(annualized.toFixed(2)), fmt: 'pct' },
          { l: 'Return Multiple', v: parseFloat((v.final / v.initial).toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'ROI measures net profit as a percentage of invested capital. An investment that doubles in 5 years has a 100% total ROI but only a ~14.9% annualized rate — the compounding math matters when comparing deals with different time horizons.',
    related: ['compound-interest-calculator', 'cagr-calculator', 'portfolio-return-calculator'],
  },
  {
    slug: 'npv-calculator',
    title: 'NPV Calculator',
    desc: 'Calculate Net Present Value of a series of cash flows at a discount rate.',
    cat: 'finance', icon: '💹',
    fields: [
      { k: 'initial', l: 'Initial Investment', p: '50000', min: 0, u: 'USD' },
      { k: 'cashflow', l: 'Annual Cash Flow', p: '15000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Discount Rate', p: '10', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Number of Years', p: '5', min: 1, u: 'years' },
    ],
    fn: (v) => {
      let pv = 0
      for (let t = 1; t <= v.years; t++) {
        pv += v.cashflow / Math.pow(1 + v.rate / 100, t)
      }
      const npv = pv - v.initial
      return {
        primary: { value: parseFloat(npv.toFixed(2)), label: 'Net Present Value', fmt: 'usd' },
        details: [
          { l: 'Present Value of Cash Flows', v: parseFloat(pv.toFixed(2)), fmt: 'usd' },
          { l: 'Initial Investment', v: v.initial, fmt: 'usd' },
          { l: 'Decision', v: npv >= 0 ? 'Accept (NPV ≥ 0)' : 'Reject (NPV < 0)', fmt: 'txt', color: npv >= 0 ? 'var(--green)' : '#f87171' },
        ],
        note: 'A positive NPV means the investment creates value above the required return rate.',
      }
    },
    about: 'NPV is the gold standard for capital budgeting decisions. A project with NPV > 0 adds shareholder value; below zero destroys it. The discount rate typically reflects the weighted average cost of capital (WACC), often 8–12% for mid-size US companies.',
    related: ['irr-calculator', 'payback-period-calculator', 'break-even-calculator'],
  },
  {
    slug: 'irr-calculator',
    title: 'IRR Calculator',
    desc: 'Calculate the Internal Rate of Return for an investment using annual cash flows.',
    cat: 'finance', icon: '📉',
    fields: [
      { k: 'initial', l: 'Initial Investment', p: '100000', min: 0, u: 'USD' },
      { k: 'cf1', l: 'Cash Flow Year 1', p: '20000', u: 'USD' },
      { k: 'cf2', l: 'Cash Flow Year 2', p: '30000', u: 'USD' },
      { k: 'cf3', l: 'Cash Flow Year 3', p: '40000', u: 'USD' },
      { k: 'cf4', l: 'Cash Flow Year 4', p: '50000', u: 'USD' },
    ],
    fn: (v) => {
      const cfs = [-v.initial, v.cf1, v.cf2, v.cf3, v.cf4]
      let lo = -0.999, hi = 10
      for (let i = 0; i < 200; i++) {
        const mid = (lo + hi) / 2
        let npv = 0
        for (let t = 0; t < cfs.length; t++) npv += cfs[t] / Math.pow(1 + mid, t)
        if (npv > 0) lo = mid; else hi = mid
      }
      const irr = ((lo + hi) / 2) * 100
      return {
        primary: { value: parseFloat(irr.toFixed(2)), label: 'Internal Rate of Return', fmt: 'pct' },
        details: [
          { l: 'Total Cash Inflows', v: v.cf1 + v.cf2 + v.cf3 + v.cf4, fmt: 'usd' },
          { l: 'Net Profit', v: v.cf1 + v.cf2 + v.cf3 + v.cf4 - v.initial, fmt: 'usd' },
        ],
        note: 'IRR is the discount rate at which NPV equals zero. Accept the project if IRR exceeds your hurdle rate.',
      }
    },
    about: 'The IRR is the break-even discount rate for a project — if it exceeds your cost of capital (hurdle rate), the investment makes sense. Private equity firms typically target IRRs of 20–30%, while infrastructure projects often accept 6–8%.',
    related: ['npv-calculator', 'payback-period-calculator', 'roi-calculator'],
  },
  {
    slug: 'payback-period-calculator',
    title: 'Payback Period Calculator',
    desc: 'Calculate how many years it takes to recoup your initial investment.',
    cat: 'finance', icon: '⏱️',
    fields: [
      { k: 'initial', l: 'Initial Investment', p: '50000', min: 0, u: 'USD' },
      { k: 'cashflow', l: 'Annual Cash Flow', p: '12000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const years = v.initial / v.cashflow
      const fullYears = Math.floor(years)
      const months = (years - fullYears) * 12
      return {
        primary: { value: parseFloat(years.toFixed(2)), label: 'Payback Period (Years)', fmt: 'num' },
        details: [
          { l: 'Full Years', v: fullYears, fmt: 'num' },
          { l: 'Additional Months', v: parseFloat(months.toFixed(1)), fmt: 'num' },
          { l: 'Annual Cash Flow', v: v.cashflow, fmt: 'usd' },
        ],
      }
    },
    about: 'The payback period ignores time value of money but remains the most intuitive risk metric — shorter is safer. Most companies require payback within 2–5 years for capital projects. It works best as a screening tool alongside NPV and IRR.',
    related: ['npv-calculator', 'irr-calculator', 'break-even-calculator'],
  },
  {
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator',
    desc: 'Find how many units you need to sell to cover fixed and variable costs.',
    cat: 'finance', icon: '⚖️',
    fields: [
      { k: 'fixed', l: 'Fixed Costs', p: '10000', min: 0, u: 'USD/month' },
      { k: 'price', l: 'Price Per Unit', p: '50', min: 0.01, u: 'USD' },
      { k: 'variable', l: 'Variable Cost Per Unit', p: '20', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const contribution = v.price - v.variable
      if (contribution <= 0) throw new Error('Price must exceed variable cost per unit.')
      const units = v.fixed / contribution
      const revenue = units * v.price
      return {
        primary: { value: parseFloat(units.toFixed(0)), label: 'Break-Even Units', fmt: 'num' },
        details: [
          { l: 'Break-Even Revenue', v: revenue, fmt: 'usd' },
          { l: 'Contribution Margin', v: contribution, fmt: 'usd' },
          { l: 'Contribution Margin %', v: parseFloat(((contribution / v.price) * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Break-even analysis separates fixed costs (rent, salaries, insurance) from variable costs (materials, commissions) to find the sales volume where profit equals zero. A business with $10,000/month fixed costs and $30 contribution margin per unit needs 334 units monthly to break even.',
    related: ['profit-margin-calculator', 'markup-calculator', 'gross-profit-calculator'],
  },
  {
    slug: 'profit-margin-calculator',
    title: 'Profit Margin Calculator',
    desc: 'Calculate gross, operating, and net profit margins for your business.',
    cat: 'finance', icon: '💰',
    fields: [
      { k: 'revenue', l: 'Revenue', p: '100000', min: 0.01, u: 'USD' },
      { k: 'cogs', l: 'Cost of Goods Sold', p: '60000', min: 0, u: 'USD' },
      { k: 'opex', l: 'Operating Expenses', p: '20000', min: 0, u: 'USD' },
      { k: 'tax', l: 'Tax Rate', p: '21', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const gross = v.revenue - v.cogs
      const operating = gross - v.opex
      const net = operating * (1 - v.tax / 100)
      return {
        primary: { value: parseFloat(((net / v.revenue) * 100).toFixed(2)), label: 'Net Profit Margin', fmt: 'pct' },
        details: [
          { l: 'Gross Profit', v: gross, fmt: 'usd' },
          { l: 'Gross Margin', v: parseFloat(((gross / v.revenue) * 100).toFixed(2)), fmt: 'pct' },
          { l: 'Operating Profit', v: operating, fmt: 'usd' },
          { l: 'Operating Margin', v: parseFloat(((operating / v.revenue) * 100).toFixed(2)), fmt: 'pct' },
          { l: 'Net Profit', v: parseFloat(net.toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'S&P 500 companies average net margins around 10–12%, but margins vary wildly by industry — software companies often exceed 25% while grocery retailers operate below 3%. Tracking all three margin layers (gross, operating, net) reveals where costs are eating profitability.',
    related: ['gross-profit-calculator', 'operating-profit-calculator', 'markup-calculator'],
  },
  {
    slug: 'markup-calculator',
    title: 'Markup Calculator',
    desc: 'Calculate selling price from cost and desired markup percentage.',
    cat: 'finance', icon: '🏷️',
    fields: [
      { k: 'cost', l: 'Cost Price', p: '50', min: 0.01, u: 'USD' },
      { k: 'markup', l: 'Markup Percentage', p: '40', min: 0, u: '%' },
    ],
    fn: (v) => {
      const selling = v.cost * (1 + v.markup / 100)
      const profit = selling - v.cost
      const margin = (profit / selling) * 100
      return {
        primary: { value: parseFloat(selling.toFixed(2)), label: 'Selling Price', fmt: 'usd' },
        details: [
          { l: 'Profit Per Unit', v: parseFloat(profit.toFixed(2)), fmt: 'usd' },
          { l: 'Profit Margin', v: parseFloat(margin.toFixed(2)), fmt: 'pct' },
          { l: 'Markup %', v: v.markup, fmt: 'pct' },
        ],
        note: 'Markup is calculated on cost; margin is calculated on selling price.',
      }
    },
    about: 'Markup and margin are often confused — a 40% markup equals a 28.6% margin. Retail businesses typically apply markups of 50–300% depending on category, while wholesale often works on 10–30% margins.',
    related: ['profit-margin-calculator', 'discount-calculator', 'break-even-calculator'],
  },
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    desc: 'Calculate the final price after applying a percentage discount.',
    cat: 'finance', icon: '🏷️',
    fields: [
      { k: 'original', l: 'Original Price', p: '120', min: 0.01, u: 'USD' },
      { k: 'discount', l: 'Discount', p: '25', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const savings = v.original * (v.discount / 100)
      const final = v.original - savings
      return {
        primary: { value: parseFloat(final.toFixed(2)), label: 'Final Price', fmt: 'usd' },
        details: [
          { l: 'Original Price', v: v.original, fmt: 'usd' },
          { l: 'You Save', v: parseFloat(savings.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Discount %', v: v.discount, fmt: 'pct' },
        ],
      }
    },
    about: 'A 25% discount on a $120 item saves $30, bringing it to $90. Stacking discounts (e.g., 20% off then 10% off) does not equal 30% off — it yields only 28%, which is why retailers prefer sequential discounts over combined ones.',
    related: ['markup-calculator', 'sales-tax-calculator', 'tip-calculator'],
  },
  {
    slug: 'tip-calculator',
    title: 'Tip Calculator',
    desc: 'Calculate tip amount and total bill, and split among multiple people.',
    cat: 'finance', icon: '🍽️',
    fields: [
      { k: 'bill', l: 'Bill Amount', p: '85', min: 0.01, u: 'USD' },
      { k: 'tip', l: 'Tip Percentage', p: '20', min: 0, max: 100, u: '%' },
      { k: 'people', l: 'Number of People', p: '2', min: 1 },
    ],
    fn: (v) => {
      const tipAmount = v.bill * (v.tip / 100)
      const total = v.bill + tipAmount
      const perPerson = total / v.people
      return {
        primary: { value: parseFloat(perPerson.toFixed(2)), label: 'Per Person', fmt: 'usd' },
        details: [
          { l: 'Tip Amount', v: parseFloat(tipAmount.toFixed(2)), fmt: 'usd' },
          { l: 'Total Bill', v: parseFloat(total.toFixed(2)), fmt: 'usd' },
          { l: 'Tip Per Person', v: parseFloat((tipAmount / v.people).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'The standard restaurant tip in the US is 15–20% of pre-tax bill amount, though 20% has become the new baseline in major cities. For exceptional service, 25% is common. Counter service and takeout tips are typically 10–15%.',
    related: ['sales-tax-calculator', 'discount-calculator', 'vat-calculator'],
  },
  {
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator',
    desc: 'Calculate total price including state and local sales tax.',
    cat: 'finance', icon: '🧾',
    fields: [
      { k: 'price', l: 'Price Before Tax', p: '200', min: 0, u: 'USD' },
      { k: 'tax', l: 'Sales Tax Rate', p: '8.5', min: 0, max: 30, u: '%' },
    ],
    fn: (v) => {
      const taxAmount = v.price * (v.tax / 100)
      const total = v.price + taxAmount
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total with Tax', fmt: 'usd' },
        details: [
          { l: 'Price Before Tax', v: v.price, fmt: 'usd' },
          { l: 'Tax Amount', v: parseFloat(taxAmount.toFixed(2)), fmt: 'usd' },
          { l: 'Tax Rate', v: v.tax, fmt: 'pct' },
        ],
      }
    },
    about: 'US sales tax rates range from 0% (Oregon, Montana, New Hampshire) to over 10% in some California and Louisiana localities. The national average combined state and local rate is about 7.12%. Five states have no statewide sales tax.',
    related: ['vat-calculator', 'tip-calculator', 'discount-calculator'],
  },
  {
    slug: 'vat-calculator',
    title: 'VAT Calculator',
    desc: 'Add or remove VAT from a price for any VAT rate.',
    cat: 'finance', icon: '🌍',
    fields: [
      { k: 'amount', l: 'Amount', p: '1000', min: 0, u: 'USD' },
      { k: 'vat', l: 'VAT Rate', p: '20', min: 0, max: 100, u: '%' },
      { k: 'direction', l: 'Direction', t: 'sel', p: '1', op: [['1','Add VAT to price'],['0','Remove VAT from price']] },
    ],
    fn: (v) => {
      let excl, incl, vatAmt
      if (v.direction === 1) {
        excl = v.amount
        vatAmt = excl * (v.vat / 100)
        incl = excl + vatAmt
      } else {
        incl = v.amount
        excl = incl / (1 + v.vat / 100)
        vatAmt = incl - excl
      }
      return {
        primary: { value: parseFloat(incl.toFixed(2)), label: 'Price Including VAT', fmt: 'usd' },
        details: [
          { l: 'Price Excluding VAT', v: parseFloat(excl.toFixed(2)), fmt: 'usd' },
          { l: 'VAT Amount', v: parseFloat(vatAmt.toFixed(2)), fmt: 'usd' },
          { l: 'VAT Rate', v: v.vat, fmt: 'pct' },
        ],
      }
    },
    about: 'VAT (Value Added Tax) applies in 170+ countries. Standard rates range from 5% (Canada GST) to 27% (Hungary). The UK standard rate is 20%, the EU average is around 21%. Unlike US sales tax, VAT is embedded at every production stage and reclaimed by businesses.',
    related: ['sales-tax-calculator', 'tip-calculator', 'discount-calculator'],
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    desc: 'Find out how much to save monthly to reach a specific financial goal.',
    cat: 'finance', icon: '🎯',
    fields: [
      { k: 'goal', l: 'Savings Goal', p: '50000', min: 0, u: 'USD' },
      { k: 'current', l: 'Current Savings', p: '5000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Return Rate', p: '6', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Time to Goal', p: '5', min: 0.1, u: 'years' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const fvCurrent = v.current * Math.pow(1 + r, n)
      const needed = v.goal - fvCurrent
      let monthly
      if (r === 0) {
        monthly = needed / n
      } else {
        monthly = needed * r / (Math.pow(1 + r, n) - 1)
      }
      if (monthly < 0) monthly = 0
      const totalContributions = monthly * n
      return {
        primary: { value: parseFloat(monthly.toFixed(2)), label: 'Monthly Savings Needed', fmt: 'usd' },
        details: [
          { l: 'Total Contributions', v: parseFloat(totalContributions.toFixed(2)), fmt: 'usd' },
          { l: 'Growth from Investment', v: parseFloat((v.goal - totalContributions - v.current).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Starting Balance', v: v.current, fmt: 'usd' },
        ],
      }
    },
    about: 'Starting with $5,000 and saving $700/month at 6% annual return reaches $50,000 in under 5 years. The earlier you start, the less you need to save monthly — someone who starts at 25 vs 35 saves roughly 40% less per month to retire with the same balance.',
    related: ['compound-interest-calculator', 'future-value-calculator', 'emergency-fund-calculator'],
  },
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator',
    desc: 'Calculate how large your emergency fund should be based on expenses.',
    cat: 'finance', icon: '🛡️',
    fields: [
      { k: 'monthly', l: 'Monthly Expenses', p: '4000', min: 0, u: 'USD' },
      { k: 'months', l: 'Months of Coverage', t: 'sel', p: '6', op: [['3','3 months'],['6','6 months'],['9','9 months'],['12','12 months']] },
      { k: 'current', l: 'Current Emergency Savings', p: '3000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const target = v.monthly * v.months
      const gap = Math.max(0, target - v.current)
      const funded = Math.min(100, (v.current / target) * 100)
      return {
        primary: { value: parseFloat(target.toFixed(0)), label: 'Emergency Fund Target', fmt: 'usd' },
        details: [
          { l: 'Current Savings', v: v.current, fmt: 'usd' },
          { l: 'Amount Still Needed', v: parseFloat(gap.toFixed(0)), fmt: 'usd', color: gap > 0 ? '#f87171' : 'var(--green)' },
          { l: '% Funded', v: parseFloat(funded.toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Financial planners recommend 3–6 months of essential expenses for single-income households and up to 12 months for the self-employed or those in volatile industries. Keep emergency funds in a high-yield savings account — currently paying 4–5% APY — not a checking account.',
    related: ['savings-goal-calculator', 'net-worth-calculator', 'debt-to-income-calculator'],
  },
  {
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    desc: 'Calculate your total net worth by subtracting liabilities from assets.',
    cat: 'finance', icon: '💎',
    fields: [
      { k: 'cash', l: 'Cash & Savings', p: '15000', min: 0, u: 'USD' },
      { k: 'investments', l: 'Investments & Retirement', p: '80000', min: 0, u: 'USD' },
      { k: 'property', l: 'Real Estate (Market Value)', p: '350000', min: 0, u: 'USD' },
      { k: 'other_assets', l: 'Other Assets', p: '20000', min: 0, u: 'USD' },
      { k: 'mortgage', l: 'Mortgage Balance', p: '280000', min: 0, u: 'USD' },
      { k: 'loans', l: 'Other Loans & Debt', p: '25000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const assets = v.cash + v.investments + v.property + v.other_assets
      const liabilities = v.mortgage + v.loans
      const netWorth = assets - liabilities
      return {
        primary: { value: parseFloat(netWorth.toFixed(0)), label: 'Net Worth', fmt: 'usd' },
        details: [
          { l: 'Total Assets', v: assets, fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Liabilities', v: liabilities, fmt: 'usd', color: '#f87171' },
          { l: 'Debt-to-Asset Ratio', v: parseFloat(((liabilities / assets) * 100).toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'The median US household net worth is approximately $192,700, while the average is skewed to $1.06 million by the ultra-wealthy. Tracking net worth annually is the clearest measure of financial progress — it captures both sides of the balance sheet.',
    related: ['debt-to-income-calculator', 'emergency-fund-calculator', 'savings-goal-calculator'],
  },
  {
    slug: 'debt-to-income-calculator',
    title: 'Debt-to-Income Ratio Calculator',
    desc: 'Calculate your DTI ratio to understand your borrowing capacity.',
    cat: 'finance', icon: '⚖️',
    fields: [
      { k: 'gross_income', l: 'Gross Monthly Income', p: '7000', min: 0.01, u: 'USD' },
      { k: 'housing', l: 'Housing Payment', p: '1800', min: 0, u: 'USD' },
      { k: 'car', l: 'Car Payment(s)', p: '400', min: 0, u: 'USD' },
      { k: 'student', l: 'Student Loans', p: '300', min: 0, u: 'USD' },
      { k: 'credit_cards', l: 'Credit Card Minimums', p: '100', min: 0, u: 'USD' },
      { k: 'other', l: 'Other Monthly Debt', p: '0', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const totalDebt = v.housing + v.car + v.student + v.credit_cards + v.other
      const dti = (totalDebt / v.gross_income) * 100
      const frontEnd = (v.housing / v.gross_income) * 100
      let rating = 'Excellent (< 20%)'
      if (dti > 50) rating = 'Distressed (> 50%)'
      else if (dti > 43) rating = 'High — mortgage unlikely (> 43%)'
      else if (dti > 36) rating = 'Acceptable (36–43%)'
      else if (dti > 20) rating = 'Good (20–36%)'
      return {
        primary: { value: parseFloat(dti.toFixed(1)), label: 'Debt-to-Income Ratio', fmt: 'pct' },
        details: [
          { l: 'Total Monthly Debt', v: parseFloat(totalDebt.toFixed(0)), fmt: 'usd' },
          { l: 'Front-End Ratio (Housing)', v: parseFloat(frontEnd.toFixed(1)), fmt: 'pct' },
          { l: 'Rating', v: rating, fmt: 'txt', color: dti <= 36 ? 'var(--green)' : dti <= 43 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'Conventional mortgage lenders cap DTI at 43%, while FHA allows up to 57% in some cases. The Consumer Financial Protection Bureau considers anything above 43% a warning sign. Front-end ratio (housing only) should ideally stay below 28% of gross income.',
    related: ['net-worth-calculator', 'credit-utilization-calculator', 'mortgage-affordability-calculator'],
  },
  {
    slug: 'credit-utilization-calculator',
    title: 'Credit Utilization Calculator',
    desc: 'Calculate your credit utilization ratio and its impact on your credit score.',
    cat: 'finance', icon: '💳',
    fields: [
      { k: 'balance', l: 'Total Credit Card Balance', p: '3500', min: 0, u: 'USD' },
      { k: 'limit', l: 'Total Credit Limit', p: '15000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const util = (v.balance / v.limit) * 100
      let impact = 'Excellent (< 10%)'
      if (util > 75) impact = 'Very High — major score damage (> 75%)'
      else if (util > 50) impact = 'High — moderate score damage (50–75%)'
      else if (util > 30) impact = 'Fair — some impact (30–50%)'
      else if (util > 10) impact = 'Good (10–30%)'
      return {
        primary: { value: parseFloat(util.toFixed(1)), label: 'Credit Utilization', fmt: 'pct' },
        details: [
          { l: 'Balance', v: v.balance, fmt: 'usd' },
          { l: 'Available Credit', v: v.limit - v.balance, fmt: 'usd' },
          { l: 'Score Impact', v: impact, fmt: 'txt', color: util <= 10 ? 'var(--green)' : util <= 30 ? '#fbbf24' : '#f87171' },
        ],
        note: 'Keep utilization below 10% for optimal credit scores. Paying balances in full monthly achieves this automatically.',
      }
    },
    about: 'Credit utilization accounts for 30% of your FICO score — the second largest factor after payment history. Scoring models penalize ratios above 30% significantly, with near-maxed accounts cutting scores by 100+ points. Each card\'s individual utilization also matters, not just the aggregate.',
    related: ['debt-to-income-calculator', 'net-worth-calculator', 'apr-calculator'],
  },
  {
    slug: 'apr-calculator',
    title: 'APR Calculator',
    desc: 'Calculate the Annual Percentage Rate (APR) for loans including fees.',
    cat: 'finance', icon: '📋',
    fields: [
      { k: 'loan', l: 'Loan Amount', p: '20000', min: 0.01, u: 'USD' },
      { k: 'rate', l: 'Interest Rate', p: '6', min: 0, max: 100, u: '%' },
      { k: 'fees', l: 'Total Loan Fees', p: '500', min: 0, u: 'USD' },
      { k: 'years', l: 'Loan Term', p: '5', min: 0.1, u: 'years' },
    ],
    fn: (v) => {
      const monthlyRate = v.rate / 100 / 12
      const n = v.years * 12
      const payment = (v.loan * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n))
      const totalPaid = payment * n
      const netLoan = v.loan - v.fees
      let lo = 0.0001, hi = 1
      for (let i = 0; i < 300; i++) {
        const mid = (lo + hi) / 2
        const pv = payment * (1 - Math.pow(1 + mid, -n)) / mid
        if (pv > netLoan) lo = mid; else hi = mid
      }
      const apr = ((lo + hi) / 2) * 12 * 100
      return {
        primary: { value: parseFloat(apr.toFixed(3)), label: 'APR', fmt: 'pct' },
        details: [
          { l: 'Stated Interest Rate', v: v.rate, fmt: 'pct' },
          { l: 'Monthly Payment', v: parseFloat(payment.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest Paid', v: parseFloat((totalPaid - v.loan).toFixed(2)), fmt: 'usd' },
          { l: 'APR vs Rate Difference', v: parseFloat((apr - v.rate).toFixed(3)), fmt: 'pct' },
        ],
        note: 'APR includes fees making it a more accurate cost comparison across lenders.',
      }
    },
    about: 'APR is the True Annual Cost of borrowing — required by law (TILA) to be disclosed on all loans. A $20,000 loan at 6% with $500 in origination fees carries an APR closer to 6.5%. Always compare APRs across lenders, not just stated interest rates.',
    related: ['effective-interest-rate-calculator', 'simple-interest-calculator', 'compound-interest-calculator'],
  },
  {
    slug: 'effective-interest-rate-calculator',
    title: 'Effective Interest Rate Calculator',
    desc: 'Calculate the effective annual interest rate from nominal rate and compounding frequency.',
    cat: 'finance', icon: '🔢',
    fields: [
      { k: 'nominal', l: 'Nominal Interest Rate', p: '6', min: 0, max: 100, u: '%' },
      { k: 'n', l: 'Compounding Frequency', t: 'sel', p: '12', op: [['1','Annually'],['2','Semi-annually'],['4','Quarterly'],['12','Monthly'],['365','Daily']] },
    ],
    fn: (v) => {
      const eff = (Math.pow(1 + (v.nominal / 100) / v.n, v.n) - 1) * 100
      return {
        primary: { value: parseFloat(eff.toFixed(4)), label: 'Effective Annual Rate', fmt: 'pct' },
        details: [
          { l: 'Nominal Rate', v: v.nominal, fmt: 'pct' },
          { l: 'Difference', v: parseFloat((eff - v.nominal).toFixed(4)), fmt: 'pct', color: 'var(--green)' },
          { l: 'Compounding Periods/Year', v: v.n, fmt: 'num' },
        ],
      }
    },
    about: 'A 6% nominal rate compounded monthly yields a 6.168% effective annual rate (EAR). Banks quote nominal rates for loans but EAR for savings to highlight attractive yields. The difference becomes meaningful at higher rates or more frequent compounding.',
    related: ['apr-calculator', 'compound-interest-calculator', 'rule-of-72-calculator'],
  },
  {
    slug: 'rule-of-72-calculator',
    title: 'Rule of 72 Calculator',
    desc: 'Estimate how many years it takes to double your money at a given interest rate.',
    cat: 'finance', icon: '✌️',
    fields: [
      { k: 'rate', l: 'Annual Interest Rate', p: '8', min: 0.01, max: 100, u: '%' },
    ],
    fn: (v) => {
      const years = 72 / v.rate
      const exact = Math.log(2) / Math.log(1 + v.rate / 100)
      return {
        primary: { value: parseFloat(years.toFixed(1)), label: 'Years to Double (Rule of 72)', fmt: 'num' },
        details: [
          { l: 'Exact Doubling Time', v: parseFloat(exact.toFixed(2)), fmt: 'num' },
          { l: 'Rule of 72 Error', v: parseFloat(Math.abs(years - exact).toFixed(2)), fmt: 'num' },
          { l: 'Return Rate', v: v.rate, fmt: 'pct' },
        ],
        note: 'The Rule of 72 is most accurate for rates between 6% and 10%.',
      }
    },
    about: 'At 8% annual returns — close to the long-run S&P 500 average — money doubles roughly every 9 years. The Rule of 72 also works in reverse: a 3% inflation rate halves your purchasing power in 24 years. Albert Einstein reportedly called compound interest the most powerful force in the universe.',
    related: ['compound-interest-calculator', 'inflation-calculator', 'future-value-calculator'],
  },
  {
    slug: 'inflation-calculator',
    title: 'Inflation Calculator',
    desc: 'Calculate the purchasing power of money accounting for inflation over time.',
    cat: 'finance', icon: '📊',
    fields: [
      { k: 'amount', l: 'Amount', p: '1000', min: 0, u: 'USD' },
      { k: 'inflation', l: 'Annual Inflation Rate', p: '3.2', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Number of Years', p: '10', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const futureValue = v.amount * Math.pow(1 + v.inflation / 100, v.years)
      const purchasing = v.amount / Math.pow(1 + v.inflation / 100, v.years)
      return {
        primary: { value: parseFloat(futureValue.toFixed(2)), label: 'Equivalent Future Value', fmt: 'usd' },
        details: [
          { l: 'Purchasing Power Today', v: v.amount, fmt: 'usd' },
          { l: 'Purchasing Power Lost', v: parseFloat((v.amount - purchasing).toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Real Value in Today\'s Dollars', v: parseFloat(purchasing.toFixed(2)), fmt: 'usd' },
        ],
        note: 'US CPI averaged 3.2% in 2023; the Fed targets 2% long-term.',
      }
    },
    about: 'The US dollar has lost about 96% of its purchasing power since 1913, when the Federal Reserve was created. At the Fed\'s 2% target, prices double every 36 years. The 2021–2023 inflation surge hit a 40-year peak of 9.1% in June 2022.',
    related: ['rule-of-72-calculator', 'future-value-calculator', 'present-value-calculator'],
  },
  {
    slug: 'future-value-calculator',
    title: 'Future Value Calculator',
    desc: 'Calculate the future value of a lump sum or regular contributions.',
    cat: 'finance', icon: '🚀',
    fields: [
      { k: 'pv', l: 'Present Value', p: '10000', min: 0, u: 'USD' },
      { k: 'payment', l: 'Monthly Contribution', p: '200', min: 0, u: 'USD' },
      { k: 'rate', l: 'Annual Rate', p: '7', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Years', p: '20', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      const fvPV = v.pv * Math.pow(1 + r, n)
      const fvPMT = r === 0 ? v.payment * n : v.payment * (Math.pow(1 + r, n) - 1) / r
      const total = fvPV + fvPMT
      const totalContributions = v.pv + v.payment * n
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Future Value', fmt: 'usd' },
        details: [
          { l: 'From Initial Lump Sum', v: parseFloat(fvPV.toFixed(2)), fmt: 'usd' },
          { l: 'From Monthly Contributions', v: parseFloat(fvPMT.toFixed(2)), fmt: 'usd' },
          { l: 'Total Contributed', v: parseFloat(totalContributions.toFixed(2)), fmt: 'usd' },
          { l: 'Total Growth', v: parseFloat((total - totalContributions).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
      }
    },
    about: 'Starting with $10,000 and contributing $200/month at 7% for 20 years produces roughly $152,000 — nearly triple the $58,000 contributed. The first 10 years build the foundation; the second 10 years are when compounding really accelerates.',
    related: ['present-value-calculator', 'compound-interest-calculator', 'savings-goal-calculator'],
  },
  {
    slug: 'present-value-calculator',
    title: 'Present Value Calculator',
    desc: 'Calculate the present value of a future sum at a given discount rate.',
    cat: 'finance', icon: '⏪',
    fields: [
      { k: 'fv', l: 'Future Value', p: '100000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Discount Rate', p: '7', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Years', p: '10', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const pv = v.fv / Math.pow(1 + v.rate / 100, v.years)
      const discount = v.fv - pv
      return {
        primary: { value: parseFloat(pv.toFixed(2)), label: 'Present Value', fmt: 'usd' },
        details: [
          { l: 'Future Amount', v: v.fv, fmt: 'usd' },
          { l: 'Total Discounted', v: parseFloat(discount.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Discount Factor', v: parseFloat((pv / v.fv).toFixed(4)), fmt: 'num' },
        ],
      }
    },
    about: 'Present value anchors financial decisions in today\'s terms. Receiving $100,000 in 10 years is worth only $50,835 today at a 7% discount rate. This math is why lottery lump-sum options are always worth less than the advertised jackpot amount.',
    related: ['future-value-calculator', 'npv-calculator', 'annuity-calculator'],
  },
  {
    slug: 'annuity-calculator',
    title: 'Annuity Calculator',
    desc: 'Calculate the value of an annuity — regular payments over a fixed period.',
    cat: 'finance', icon: '💸',
    fields: [
      { k: 'payment', l: 'Payment Amount', p: '1000', min: 0, u: 'USD/month' },
      { k: 'rate', l: 'Annual Interest Rate', p: '5', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Years', p: '20', min: 0, u: 'years' },
      { k: 'type', l: 'Annuity Type', t: 'sel', p: '0', op: [['0','Ordinary (payments at end)'],['1','Annuity Due (payments at start)']] },
    ],
    fn: (v) => {
      const r = v.rate / 100 / 12
      const n = v.years * 12
      let pv: number
      if (r === 0) {
        pv = v.payment * n
      } else {
        pv = v.payment * (1 - Math.pow(1 + r, -n)) / r
      }
      if (v.type === 1) pv *= (1 + r)
      const totalPayments = v.payment * n
      return {
        primary: { value: parseFloat(pv.toFixed(2)), label: 'Present Value of Annuity', fmt: 'usd' },
        details: [
          { l: 'Total Payments', v: parseFloat(totalPayments.toFixed(2)), fmt: 'usd' },
          { l: 'Discount Amount', v: parseFloat((totalPayments - pv).toFixed(2)), fmt: 'usd' },
          { l: 'Monthly Payment', v: v.payment, fmt: 'usd' },
        ],
      }
    },
    about: 'Annuities are used for pensions, lottery payouts, mortgages, and insurance products. An ordinary annuity of $1,000/month for 20 years at 5% has a present value of approximately $151,525 — what an insurance company would charge to fund that stream of payments.',
    related: ['present-value-calculator', 'perpetuity-calculator', 'retirement-income-calculator'],
  },
  {
    slug: 'perpetuity-calculator',
    title: 'Perpetuity Calculator',
    desc: 'Calculate the present value of a perpetuity — an infinite stream of payments.',
    cat: 'finance', icon: '♾️',
    fields: [
      { k: 'payment', l: 'Annual Payment', p: '5000', min: 0, u: 'USD' },
      { k: 'rate', l: 'Discount Rate', p: '5', min: 0.01, max: 100, u: '%' },
      { k: 'growth', l: 'Growth Rate (optional)', p: '2', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      if (v.growth >= v.rate) throw new Error('Growth rate must be less than discount rate.')
      const pvPlain = v.payment / (v.rate / 100)
      const pvGrowth = v.payment / ((v.rate - v.growth) / 100)
      return {
        primary: { value: parseFloat(pvGrowth.toFixed(2)), label: 'PV (Growing Perpetuity)', fmt: 'usd' },
        details: [
          { l: 'PV (Non-Growing)', v: parseFloat(pvPlain.toFixed(2)), fmt: 'usd' },
          { l: 'Annual Payment', v: v.payment, fmt: 'usd' },
          { l: 'Extra Value from Growth', v: parseFloat((pvGrowth - pvPlain).toFixed(2)), fmt: 'usd', color: 'var(--green)' },
        ],
      }
    },
    about: 'A perpetuity is the simplest valuation model — divide annual cash flow by the discount rate. British Consols (government bonds with no maturity date) are classic perpetuities. The Gordon Growth Model uses a growing perpetuity to value dividend-paying stocks.',
    related: ['annuity-calculator', 'present-value-calculator', 'dividend-yield-calculator'],
  },
  {
    slug: 'cagr-calculator',
    title: 'CAGR Calculator',
    desc: 'Calculate the Compound Annual Growth Rate of an investment over time.',
    cat: 'finance', icon: '📈',
    fields: [
      { k: 'start', l: 'Starting Value', p: '10000', min: 0.01, u: 'USD' },
      { k: 'end', l: 'Ending Value', p: '25000', min: 0.01, u: 'USD' },
      { k: 'years', l: 'Number of Years', p: '8', min: 0.1, u: 'years' },
    ],
    fn: (v) => {
      const cagr = (Math.pow(v.end / v.start, 1 / v.years) - 1) * 100
      const totalReturn = ((v.end - v.start) / v.start) * 100
      return {
        primary: { value: parseFloat(cagr.toFixed(2)), label: 'CAGR', fmt: 'pct' },
        details: [
          { l: 'Total Return', v: parseFloat(totalReturn.toFixed(2)), fmt: 'pct' },
          { l: 'Net Gain', v: v.end - v.start, fmt: 'usd', color: v.end >= v.start ? 'var(--green)' : '#f87171' },
          { l: 'Growth Multiple', v: parseFloat((v.end / v.start).toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'The S&P 500\'s CAGR from 1965 to 2023 was approximately 10.2% annually including dividends. CAGR smooths out volatile year-to-year returns into a single comparable figure — critical when comparing investments with different holding periods.',
    related: ['roi-calculator', 'compound-interest-calculator', 'portfolio-return-calculator'],
  },
  {
    slug: 'dividend-yield-calculator',
    title: 'Dividend Yield Calculator',
    desc: 'Calculate the dividend yield and annual dividend income from a stock investment.',
    cat: 'finance', icon: '💰',
    fields: [
      { k: 'price', l: 'Stock Price', p: '150', min: 0.01, u: 'USD' },
      { k: 'dividend', l: 'Annual Dividend Per Share', p: '4.50', min: 0, u: 'USD' },
      { k: 'shares', l: 'Number of Shares', p: '100', min: 0, u: 'shares' },
    ],
    fn: (v) => {
      const yld = (v.dividend / v.price) * 100
      const annualIncome = v.dividend * v.shares
      const investment = v.price * v.shares
      return {
        primary: { value: parseFloat(yld.toFixed(2)), label: 'Dividend Yield', fmt: 'pct' },
        details: [
          { l: 'Annual Dividend Income', v: parseFloat(annualIncome.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Investment', v: parseFloat(investment.toFixed(2)), fmt: 'usd' },
          { l: 'Quarterly Dividend', v: parseFloat((annualIncome / 4).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'S&P 500 dividend yield averages around 1.3–1.7%, while dedicated dividend ETFs like SCHD yield 3–4%. REITs often yield 4–7% due to mandatory profit distribution rules. High yields above 8% sometimes signal dividend cuts ahead.',
    related: ['stock-return-calculator', 'portfolio-return-calculator', 'price-earnings-calculator'],
  },
  {
    slug: 'stock-return-calculator',
    title: 'Stock Return Calculator',
    desc: 'Calculate total return on a stock investment including dividends.',
    cat: 'finance', icon: '📈',
    fields: [
      { k: 'buy_price', l: 'Purchase Price per Share', p: '100', min: 0.01, u: 'USD' },
      { k: 'sell_price', l: 'Current / Sell Price', p: '145', min: 0.01, u: 'USD' },
      { k: 'shares', l: 'Number of Shares', p: '50', min: 0, u: 'shares' },
      { k: 'dividends', l: 'Total Dividends Received', p: '250', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const invested = v.buy_price * v.shares
      const currentValue = v.sell_price * v.shares
      const capitalGain = currentValue - invested
      const totalReturn = capitalGain + v.dividends
      const totalReturnPct = (totalReturn / invested) * 100
      const capitalGainPct = (capitalGain / invested) * 100
      return {
        primary: { value: parseFloat(totalReturnPct.toFixed(2)), label: 'Total Return', fmt: 'pct' },
        details: [
          { l: 'Amount Invested', v: parseFloat(invested.toFixed(2)), fmt: 'usd' },
          { l: 'Capital Gain / Loss', v: parseFloat(capitalGain.toFixed(2)), fmt: 'usd', color: capitalGain >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Dividend Income', v: v.dividends, fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Profit / Loss', v: parseFloat(totalReturn.toFixed(2)), fmt: 'usd', color: totalReturn >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Capital Gains Return', v: parseFloat(capitalGainPct.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Total stock return combines price appreciation and dividend income — both matter. Over the past century, roughly 40% of the S&P 500\'s total return has come from reinvested dividends. Ignoring dividends when comparing stock performance leads to systematically understated returns.',
    related: ['dividend-yield-calculator', 'roi-calculator', 'portfolio-return-calculator'],
  },
  {
    slug: 'portfolio-return-calculator',
    title: 'Portfolio Return Calculator',
    desc: 'Calculate the weighted return of a multi-asset investment portfolio.',
    cat: 'finance', icon: '🗂️',
    fields: [
      { k: 'stocks_pct', l: 'Stocks Allocation', p: '60', min: 0, max: 100, u: '%' },
      { k: 'stocks_ret', l: 'Stocks Expected Return', p: '10', min: -100, max: 200, u: '%' },
      { k: 'bonds_pct', l: 'Bonds Allocation', p: '30', min: 0, max: 100, u: '%' },
      { k: 'bonds_ret', l: 'Bonds Expected Return', p: '4', min: -100, max: 200, u: '%' },
      { k: 'cash_pct', l: 'Cash/Other Allocation', p: '10', min: 0, max: 100, u: '%' },
      { k: 'cash_ret', l: 'Cash/Other Return', p: '5', min: -100, max: 200, u: '%' },
    ],
    fn: (v) => {
      const total = v.stocks_pct + v.bonds_pct + v.cash_pct
      if (total <= 0) throw new Error('Total allocation must be greater than 0.')
      const weightedReturn = (v.stocks_pct * v.stocks_ret + v.bonds_pct * v.bonds_ret + v.cash_pct * v.cash_ret) / total
      return {
        primary: { value: parseFloat(weightedReturn.toFixed(2)), label: 'Expected Portfolio Return', fmt: 'pct' },
        details: [
          { l: 'Stocks Contribution', v: parseFloat(((v.stocks_pct / total) * v.stocks_ret).toFixed(2)), fmt: 'pct' },
          { l: 'Bonds Contribution', v: parseFloat(((v.bonds_pct / total) * v.bonds_ret).toFixed(2)), fmt: 'pct' },
          { l: 'Cash/Other Contribution', v: parseFloat(((v.cash_pct / total) * v.cash_ret).toFixed(2)), fmt: 'pct' },
          { l: 'Total Allocation', v: parseFloat(total.toFixed(0)), fmt: 'pct' },
        ],
      }
    },
    about: 'The classic 60/40 stock-bond portfolio has returned roughly 8.5% annually over the past 50 years. The exact allocation should reflect time horizon and risk tolerance — a 25-year-old can weather 100% equities while a retiree may need 40–60% in bonds and income assets.',
    related: ['sharpe-ratio-calculator', 'asset-allocation-calculator', 'cagr-calculator'],
  },
  {
    slug: 'sharpe-ratio-calculator',
    title: 'Sharpe Ratio Calculator',
    desc: 'Calculate the risk-adjusted return of an investment using the Sharpe Ratio.',
    cat: 'finance', icon: '📐',
    fields: [
      { k: 'return', l: 'Portfolio Return', p: '12', min: -100, max: 200, u: '%' },
      { k: 'risk_free', l: 'Risk-Free Rate (T-Bill)', p: '5.25', min: 0, max: 100, u: '%' },
      { k: 'std_dev', l: 'Portfolio Std Deviation', p: '15', min: 0.01, u: '%' },
    ],
    fn: (v) => {
      const sharpe = (v.return - v.risk_free) / v.std_dev
      let rating = 'Poor (< 0)'
      if (sharpe >= 2) rating = 'Excellent (≥ 2)'
      else if (sharpe >= 1) rating = 'Good (1–2)'
      else if (sharpe >= 0) rating = 'Acceptable (0–1)'
      return {
        primary: { value: parseFloat(sharpe.toFixed(3)), label: 'Sharpe Ratio', fmt: 'num' },
        details: [
          { l: 'Excess Return', v: parseFloat((v.return - v.risk_free).toFixed(2)), fmt: 'pct' },
          { l: 'Rating', v: rating, fmt: 'txt', color: sharpe >= 1 ? 'var(--green)' : sharpe >= 0 ? '#fbbf24' : '#f87171' },
        ],
        note: 'Higher Sharpe ratios indicate better risk-adjusted performance.',
      }
    },
    about: 'The Sharpe Ratio, developed by Nobel laureate William Sharpe, divides excess return by standard deviation. Hedge funds typically target ratios above 1.0; Warren Buffett\'s Berkshire Hathaway has averaged around 0.76 — showing that even legendary investors often run below 1.0 on a Sharpe basis.',
    related: ['portfolio-return-calculator', 'asset-allocation-calculator', 'roi-calculator'],
  },
  {
    slug: 'asset-allocation-calculator',
    title: 'Asset Allocation Calculator',
    desc: 'Find the recommended stock/bond allocation based on your age and risk tolerance.',
    cat: 'finance', icon: '🧩',
    fields: [
      { k: 'age', l: 'Your Age', p: '35', min: 18, max: 90 },
      { k: 'risk', l: 'Risk Tolerance', t: 'sel', p: '2', op: [['1','Conservative'],['2','Moderate'],['3','Aggressive']] },
      { k: 'retirement_age', l: 'Target Retirement Age', p: '65', min: 18, max: 90 },
    ],
    fn: (v) => {
      const years = v.retirement_age - v.age
      let stocks = 110 - v.age
      if (v.risk === 1) stocks = Math.max(20, stocks - 15)
      else if (v.risk === 3) stocks = Math.min(95, stocks + 15)
      stocks = Math.max(0, Math.min(100, stocks))
      const bonds = 100 - stocks
      return {
        primary: { value: stocks, label: 'Recommended Stocks %', fmt: 'pct' },
        details: [
          { l: 'Bonds / Fixed Income', v: bonds, fmt: 'pct' },
          { l: 'Years to Retirement', v: Math.max(0, years), fmt: 'num' },
          { l: 'Risk Profile', v: ['', 'Conservative', 'Moderate', 'Aggressive'][v.risk], fmt: 'txt' },
        ],
        note: 'Vanguard and Fidelity target-date funds use similar glide paths, gradually shifting to bonds as retirement nears.',
      }
    },
    about: 'The old rule "100 minus age in stocks" has been updated to "110 minus age" as lifespans increase. A 35-year-old with 30 years of runway can absorb volatility that would devastate a 65-year-old retiree drawing down their portfolio.',
    related: ['portfolio-return-calculator', 'rebalancing-calculator', 'sharpe-ratio-calculator'],
  },
  {
    slug: 'rebalancing-calculator',
    title: 'Portfolio Rebalancing Calculator',
    desc: 'Calculate how much to buy or sell to rebalance your portfolio to target allocations.',
    cat: 'finance', icon: '⚖️',
    fields: [
      { k: 'stocks_value', l: 'Current Stocks Value', p: '75000', min: 0, u: 'USD' },
      { k: 'bonds_value', l: 'Current Bonds Value', p: '20000', min: 0, u: 'USD' },
      { k: 'other_value', l: 'Current Other Value', p: '5000', min: 0, u: 'USD' },
      { k: 'target_stocks', l: 'Target Stocks %', p: '60', min: 0, max: 100, u: '%' },
      { k: 'target_bonds', l: 'Target Bonds %', p: '30', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const total = v.stocks_value + v.bonds_value + v.other_value
      const targetStocksAmt = total * (v.target_stocks / 100)
      const targetBondsAmt = total * (v.target_bonds / 100)
      const targetOtherAmt = total - targetStocksAmt - targetBondsAmt
      const stocksDiff = targetStocksAmt - v.stocks_value
      const bondsDiff = targetBondsAmt - v.bonds_value
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Total Portfolio Value', fmt: 'usd' },
        details: [
          { l: 'Stocks: Buy / (Sell)', v: parseFloat(stocksDiff.toFixed(2)), fmt: 'usd', color: stocksDiff >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Bonds: Buy / (Sell)', v: parseFloat(bondsDiff.toFixed(2)), fmt: 'usd', color: bondsDiff >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Target Other Value', v: parseFloat(targetOtherAmt.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Positive = buy, negative = sell. Consider tax implications before selling in taxable accounts.',
      }
    },
    about: 'Research shows rebalancing annually (or when allocations drift 5%+) improves risk-adjusted returns over a buy-and-hold approach. Doing it inside tax-advantaged accounts (401k, IRA) avoids triggering capital gains taxes.',
    related: ['asset-allocation-calculator', 'portfolio-return-calculator', 'sharpe-ratio-calculator'],
  },
  {
    slug: 'dollar-cost-averaging-calculator',
    title: 'Dollar Cost Averaging Calculator',
    desc: 'Calculate average cost basis and returns from regular periodic investments.',
    cat: 'finance', icon: '🔄',
    fields: [
      { k: 'monthly', l: 'Monthly Investment', p: '500', min: 0, u: 'USD' },
      { k: 'months', l: 'Investment Period', p: '60', min: 1, u: 'months' },
      { k: 'avg_price', l: 'Average Purchase Price', p: '150', min: 0.01, u: 'USD' },
      { k: 'current_price', l: 'Current Price', p: '200', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const totalInvested = v.monthly * v.months
      const shares = totalInvested / v.avg_price
      const currentValue = shares * v.current_price
      const gain = currentValue - totalInvested
      return {
        primary: { value: parseFloat(currentValue.toFixed(2)), label: 'Current Portfolio Value', fmt: 'usd' },
        details: [
          { l: 'Total Invested', v: parseFloat(totalInvested.toFixed(2)), fmt: 'usd' },
          { l: 'Shares Accumulated', v: parseFloat(shares.toFixed(4)), fmt: 'num' },
          { l: 'Unrealized Gain / Loss', v: parseFloat(gain.toFixed(2)), fmt: 'usd', color: gain >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Return %', v: parseFloat(((gain / totalInvested) * 100).toFixed(2)), fmt: 'pct', color: gain >= 0 ? 'var(--green)' : '#f87171' },
        ],
      }
    },
    about: 'DCA removes the need to time the market — investors buy more shares when prices are low and fewer when prices are high. Vanguard research found DCA underperforms lump-sum investing about two-thirds of the time, but it reduces regret risk for large sums.',
    related: ['savings-goal-calculator', 'compound-interest-calculator', 'stock-return-calculator'],
  },
  {
    slug: 'crypto-profit-calculator',
    title: 'Crypto Profit Calculator',
    desc: 'Calculate profit, loss, and ROI on cryptocurrency investments.',
    cat: 'finance', icon: '🪙',
    fields: [
      { k: 'buy_price', l: 'Buy Price', p: '30000', min: 0.000001, u: 'USD' },
      { k: 'sell_price', l: 'Sell / Current Price', p: '55000', min: 0.000001, u: 'USD' },
      { k: 'amount', l: 'Amount of Crypto', p: '0.5', min: 0 },
      { k: 'fees', l: 'Total Fees', p: '50', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const invested = v.buy_price * v.amount
      const proceeds = v.sell_price * v.amount - v.fees
      const profit = proceeds - invested
      const roi = (profit / invested) * 100
      return {
        primary: { value: parseFloat(profit.toFixed(2)), label: 'Net Profit / Loss', fmt: 'usd' },
        details: [
          { l: 'Amount Invested', v: parseFloat(invested.toFixed(2)), fmt: 'usd' },
          { l: 'Proceeds (after fees)', v: parseFloat(proceeds.toFixed(2)), fmt: 'usd' },
          { l: 'ROI', v: parseFloat(roi.toFixed(2)), fmt: 'pct', color: roi >= 0 ? 'var(--green)' : '#f87171' },
        ],
      }
    },
    about: 'The IRS taxes cryptocurrency as property — every sale, exchange, or spend is a taxable event. Short-term gains (held under 1 year) are taxed as ordinary income up to 37%; long-term gains qualify for the preferential 0%, 15%, or 20% capital gains rates.',
    related: ['bitcoin-profit-calculator', 'ethereum-profit-calculator', 'cryptocurrency-tax-calculator'],
  },
  {
    slug: 'bitcoin-profit-calculator',
    title: 'Bitcoin Profit Calculator',
    desc: 'Calculate your Bitcoin investment profit, loss, and return on investment.',
    cat: 'finance', icon: '₿',
    fields: [
      { k: 'buy_price', l: 'BTC Buy Price (USD)', p: '40000', min: 0.01, u: 'USD' },
      { k: 'sell_price', l: 'BTC Current/Sell Price', p: '65000', min: 0.01, u: 'USD' },
      { k: 'btc', l: 'Amount of BTC', p: '0.25', min: 0 },
      { k: 'fees', l: 'Exchange Fees', p: '20', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const cost = v.buy_price * v.btc + v.fees
      const value = v.sell_price * v.btc
      const profit = value - cost
      const roi = (profit / cost) * 100
      return {
        primary: { value: parseFloat(profit.toFixed(2)), label: 'Net Profit / Loss', fmt: 'usd' },
        details: [
          { l: 'Total Cost Basis', v: parseFloat(cost.toFixed(2)), fmt: 'usd' },
          { l: 'Current Value', v: parseFloat(value.toFixed(2)), fmt: 'usd' },
          { l: 'ROI', v: parseFloat(roi.toFixed(2)), fmt: 'pct', color: roi >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'BTC Price Increase', v: parseFloat(((v.sell_price - v.buy_price) / v.buy_price * 100).toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Bitcoin\'s all-time return from $0.08 in 2010 to its 2024 peak above $73,000 represents a gain of over 90 million percent. Early investors who held through multiple 80%+ drawdowns captured life-changing returns, but most retail buyers entered at peaks.',
    related: ['crypto-profit-calculator', 'ethereum-profit-calculator', 'cryptocurrency-tax-calculator'],
  },
  {
    slug: 'ethereum-profit-calculator',
    title: 'Ethereum Profit Calculator',
    desc: 'Calculate profit and ROI on your Ethereum (ETH) investment.',
    cat: 'finance', icon: '⟠',
    fields: [
      { k: 'buy_price', l: 'ETH Buy Price (USD)', p: '2000', min: 0.01, u: 'USD' },
      { k: 'sell_price', l: 'ETH Current/Sell Price', p: '3500', min: 0.01, u: 'USD' },
      { k: 'eth', l: 'Amount of ETH', p: '2', min: 0 },
      { k: 'fees', l: 'Exchange/Gas Fees', p: '30', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const cost = v.buy_price * v.eth + v.fees
      const value = v.sell_price * v.eth
      const profit = value - cost
      const roi = (profit / cost) * 100
      return {
        primary: { value: parseFloat(profit.toFixed(2)), label: 'Net Profit / Loss', fmt: 'usd' },
        details: [
          { l: 'Total Cost Basis', v: parseFloat(cost.toFixed(2)), fmt: 'usd' },
          { l: 'Current Value', v: parseFloat(value.toFixed(2)), fmt: 'usd' },
          { l: 'ROI', v: parseFloat(roi.toFixed(2)), fmt: 'pct', color: roi >= 0 ? 'var(--green)' : '#f87171' },
        ],
      }
    },
    about: 'Ethereum transitioned from Proof-of-Work to Proof-of-Stake in September 2022 (the Merge), reducing energy consumption by ~99.95%. ETH stakers earn 3–5% annual yield. The EIP-1559 fee burn mechanism has made ETH deflationary during high-usage periods.',
    related: ['crypto-profit-calculator', 'bitcoin-profit-calculator', 'staking-rewards-calculator'],
  },
  {
    slug: 'staking-rewards-calculator',
    title: 'Staking Rewards Calculator',
    desc: 'Calculate annual staking rewards and APY for proof-of-stake cryptocurrencies.',
    cat: 'finance', icon: '🥩',
    fields: [
      { k: 'amount', l: 'Amount Staked (USD value)', p: '10000', min: 0, u: 'USD' },
      { k: 'apy', l: 'Staking APY', p: '5', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Staking Duration', p: '2', min: 0, u: 'years' },
    ],
    fn: (v) => {
      const rewards = v.amount * (Math.pow(1 + v.apy / 100, v.years) - 1)
      const total = v.amount + rewards
      return {
        primary: { value: parseFloat(rewards.toFixed(2)), label: 'Total Staking Rewards', fmt: 'usd' },
        details: [
          { l: 'Annual Rewards (Year 1)', v: parseFloat((v.amount * v.apy / 100).toFixed(2)), fmt: 'usd' },
          { l: 'Total Value at End', v: parseFloat(total.toFixed(2)), fmt: 'usd' },
          { l: 'APY', v: v.apy, fmt: 'pct' },
        ],
        note: 'Staking rewards are taxed as ordinary income by the IRS when received.',
      }
    },
    about: 'Ethereum staking currently yields around 3–4% APY, Solana around 6–7%, and some smaller networks offer 10–20% (with correspondingly higher risk). The IRS treats staking rewards as ordinary income at the fair market value when received.',
    related: ['ethereum-profit-calculator', 'crypto-profit-calculator', 'defi-yield-calculator'],
  },
  {
    slug: 'defi-yield-calculator',
    title: 'DeFi Yield Calculator',
    desc: 'Calculate DeFi liquidity mining or yield farming returns.',
    cat: 'finance', icon: '🌾',
    fields: [
      { k: 'principal', l: 'Amount Deployed (USD)', p: '5000', min: 0, u: 'USD' },
      { k: 'apy', l: 'Annual Percentage Yield', p: '15', min: 0, max: 10000, u: '%' },
      { k: 'days', l: 'Days Farming', p: '90', min: 1, u: 'days' },
      { k: 'fees', l: 'Gas / Entry Fees', p: '50', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const years = v.days / 365
      const gross = v.principal * (Math.pow(1 + v.apy / 100, years) - 1)
      const net = gross - v.fees
      const netRoi = (net / v.principal) * 100
      return {
        primary: { value: parseFloat(net.toFixed(2)), label: 'Net Yield (after fees)', fmt: 'usd' },
        details: [
          { l: 'Gross Yield', v: parseFloat(gross.toFixed(2)), fmt: 'usd' },
          { l: 'Fees', v: v.fees, fmt: 'usd', color: '#f87171' },
          { l: 'Net ROI', v: parseFloat(netRoi.toFixed(2)), fmt: 'pct', color: netRoi >= 0 ? 'var(--green)' : '#f87171' },
        ],
        note: 'DeFi yields are highly volatile and do not account for impermanent loss or token price changes.',
      }
    },
    about: 'DeFi TVL (Total Value Locked) peaked at $180 billion in 2021 before collapsing to $40 billion in 2023. While published APYs can exceed 100%, sustainable yields on blue-chip protocols like Aave or Compound typically range from 3–8% for stablecoins.',
    related: ['staking-rewards-calculator', 'ethereum-profit-calculator', 'crypto-profit-calculator'],
  },
  {
    slug: 'price-earnings-calculator',
    title: 'Price-to-Earnings (P/E) Calculator',
    desc: 'Calculate the P/E ratio and implied earnings yield for a stock.',
    cat: 'finance', icon: '📊',
    fields: [
      { k: 'price', l: 'Stock Price', p: '180', min: 0.01, u: 'USD' },
      { k: 'eps', l: 'Earnings Per Share (EPS)', p: '9', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const pe = v.price / v.eps
      const earningsYield = (v.eps / v.price) * 100
      return {
        primary: { value: parseFloat(pe.toFixed(2)), label: 'P/E Ratio', fmt: 'num' },
        details: [
          { l: 'Earnings Yield', v: parseFloat(earningsYield.toFixed(2)), fmt: 'pct' },
          { l: 'Stock Price', v: v.price, fmt: 'usd' },
          { l: 'EPS', v: v.eps, fmt: 'usd' },
        ],
        note: 'S&P 500 average P/E is ~20–25x historically. Lower P/E may indicate undervaluation or slower growth.',
      }
    },
    about: 'The S&P 500\'s average P/E ratio since 1928 is about 15–16x, though it has sustained 20–30x during bull markets. Growth stocks like technology companies often trade at 40–100x earnings; value stocks trade at 8–15x. The "Fed Model" compares earnings yield to Treasury yields.',
    related: ['dividend-yield-calculator', 'enterprise-value-calculator', 'stock-return-calculator'],
  },
  {
    slug: 'enterprise-value-calculator',
    title: 'Enterprise Value Calculator',
    desc: 'Calculate Enterprise Value (EV) and common EV multiples.',
    cat: 'finance', icon: '🏢',
    fields: [
      { k: 'market_cap', l: 'Market Cap', p: '500000000', min: 0, u: 'USD' },
      { k: 'debt', l: 'Total Debt', p: '100000000', min: 0, u: 'USD' },
      { k: 'cash', l: 'Cash & Equivalents', p: '50000000', min: 0, u: 'USD' },
      { k: 'ebitda', l: 'EBITDA', p: '80000000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const ev = v.market_cap + v.debt - v.cash
      const evEbitda = ev / v.ebitda
      return {
        primary: { value: parseFloat(ev.toFixed(0)), label: 'Enterprise Value', fmt: 'usd' },
        details: [
          { l: 'EV/EBITDA Multiple', v: parseFloat(evEbitda.toFixed(2)), fmt: 'num' },
          { l: 'Market Cap', v: v.market_cap, fmt: 'usd' },
          { l: 'Net Debt', v: v.debt - v.cash, fmt: 'usd' },
        ],
        note: 'EV/EBITDA below 10x is often considered value territory for mature businesses.',
      }
    },
    about: 'EV is the theoretical takeover price of a company — market cap plus debt minus cash. The EV/EBITDA multiple is the most widely used acquisition valuation metric, with median deal multiples in the 8–12x range for US middle-market companies.',
    related: ['ebitda-calculator', 'business-valuation-calculator', 'price-earnings-calculator'],
  },
  {
    slug: 'ebitda-calculator',
    title: 'EBITDA Calculator',
    desc: 'Calculate EBITDA and EBITDA margin from financial statement data.',
    cat: 'finance', icon: '📋',
    fields: [
      { k: 'revenue', l: 'Revenue', p: '10000000', min: 0, u: 'USD' },
      { k: 'cogs', l: 'Cost of Goods Sold', p: '6000000', min: 0, u: 'USD' },
      { k: 'opex', l: 'Operating Expenses', p: '1500000', min: 0, u: 'USD' },
      { k: 'da', l: 'Depreciation & Amortization', p: '500000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const gross = v.revenue - v.cogs
      const ebit = gross - v.opex
      const ebitda = ebit + v.da
      const margin = (ebitda / v.revenue) * 100
      return {
        primary: { value: parseFloat(ebitda.toFixed(0)), label: 'EBITDA', fmt: 'usd' },
        details: [
          { l: 'Gross Profit', v: parseFloat(gross.toFixed(0)), fmt: 'usd' },
          { l: 'EBIT', v: parseFloat(ebit.toFixed(0)), fmt: 'usd' },
          { l: 'EBITDA Margin', v: parseFloat(margin.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'EBITDA (Earnings Before Interest, Taxes, Depreciation, and Amortization) strips out non-cash charges and capital structure to compare operating profitability. Software companies average 25–35% EBITDA margins; retailers often 5–12%. Warren Buffett famously called EBITDA a "dangerous metric" for obscuring capex needs.',
    related: ['enterprise-value-calculator', 'gross-profit-calculator', 'operating-profit-calculator'],
  },
  {
    slug: 'business-valuation-calculator',
    title: 'Business Valuation Calculator',
    desc: 'Estimate business value using multiple standard valuation methods.',
    cat: 'finance', icon: '🏦',
    fields: [
      { k: 'revenue', l: 'Annual Revenue', p: '2000000', min: 0, u: 'USD' },
      { k: 'ebitda', l: 'EBITDA', p: '400000', min: 0, u: 'USD' },
      { k: 'net_income', l: 'Net Income', p: '250000', min: 0, u: 'USD' },
      { k: 'industry_multiple', l: 'Industry Revenue Multiple', p: '1.5', min: 0.1 },
    ],
    fn: (v) => {
      const revenueVal = v.revenue * v.industry_multiple
      const ebitdaVal = v.ebitda * 6
      const peVal = v.net_income * 15
      const avg = (revenueVal + ebitdaVal + peVal) / 3
      return {
        primary: { value: parseFloat(avg.toFixed(0)), label: 'Estimated Valuation (Average)', fmt: 'usd' },
        details: [
          { l: 'Revenue Multiple Valuation', v: parseFloat(revenueVal.toFixed(0)), fmt: 'usd' },
          { l: 'EBITDA Multiple (6x) Valuation', v: parseFloat(ebitdaVal.toFixed(0)), fmt: 'usd' },
          { l: 'P/E Multiple (15x) Valuation', v: parseFloat(peVal.toFixed(0)), fmt: 'usd' },
        ],
        note: 'Actual valuations depend heavily on growth rate, industry, and current market conditions.',
      }
    },
    about: 'Small business valuations typically use 2–5x EBITDA for mature companies and 1–3x revenue for high-growth businesses. SaaS companies commanded 10–30x ARR at the 2021 peak; by 2023 that compressed to 3–8x. Deal structure (earnout vs. cash) significantly affects effective price.',
    related: ['ebitda-calculator', 'enterprise-value-calculator', 'free-cash-flow-calculator'],
  },
  {
    slug: 'gross-profit-calculator',
    title: 'Gross Profit Calculator',
    desc: 'Calculate gross profit and gross profit margin from revenue and COGS.',
    cat: 'finance', icon: '💹',
    fields: [
      { k: 'revenue', l: 'Total Revenue', p: '500000', min: 0, u: 'USD' },
      { k: 'cogs', l: 'Cost of Goods Sold', p: '300000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const gross = v.revenue - v.cogs
      const margin = (gross / v.revenue) * 100
      return {
        primary: { value: parseFloat(gross.toFixed(2)), label: 'Gross Profit', fmt: 'usd' },
        details: [
          { l: 'Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'Cost of Goods Sold', v: v.cogs, fmt: 'usd', color: '#f87171' },
          { l: 'Gross Margin', v: parseFloat(margin.toFixed(2)), fmt: 'pct', color: margin > 40 ? 'var(--green)' : 'var(--text)' },
        ],
      }
    },
    about: 'Gross margin benchmarks vary dramatically by sector: software (70–85%), pharmaceuticals (60–75%), manufacturing (25–40%), grocery (20–30%). Apple\'s iPhone business runs roughly 46% gross margins, while Amazon Web Services exceeds 60%.',
    related: ['operating-profit-calculator', 'net-margin-calculator', 'profit-margin-calculator'],
  },
  {
    slug: 'operating-profit-calculator',
    title: 'Operating Profit Calculator',
    desc: 'Calculate operating profit (EBIT) and operating margin.',
    cat: 'finance', icon: '⚙️',
    fields: [
      { k: 'gross_profit', l: 'Gross Profit', p: '200000', min: 0, u: 'USD' },
      { k: 'sales', l: 'Sales & Marketing Expenses', p: '50000', min: 0, u: 'USD' },
      { k: 'rnd', l: 'R&D Expenses', p: '30000', min: 0, u: 'USD' },
      { k: 'general', l: 'General & Administrative', p: '40000', min: 0, u: 'USD' },
      { k: 'revenue', l: 'Total Revenue', p: '500000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const opex = v.sales + v.rnd + v.general
      const ebit = v.gross_profit - opex
      const margin = (ebit / v.revenue) * 100
      return {
        primary: { value: parseFloat(ebit.toFixed(2)), label: 'Operating Profit (EBIT)', fmt: 'usd' },
        details: [
          { l: 'Total Operating Expenses', v: parseFloat(opex.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Operating Margin', v: parseFloat(margin.toFixed(2)), fmt: 'pct', color: margin > 15 ? 'var(--green)' : 'var(--text)' },
        ],
      }
    },
    about: 'Operating margin (EBIT margin) strips out interest and taxes to show pure business efficiency. Microsoft\'s operating margin exceeded 40% in 2023; Meta rebounded from 25% to 40% after its "Year of Efficiency" cost cuts. Most S&P 500 companies target operating margins of 15–25%.',
    related: ['gross-profit-calculator', 'ebitda-calculator', 'profit-margin-calculator'],
  },
  {
    slug: 'free-cash-flow-calculator',
    title: 'Free Cash Flow Calculator',
    desc: 'Calculate Free Cash Flow (FCF) from operating cash flow and capital expenditures.',
    cat: 'finance', icon: '💸',
    fields: [
      { k: 'operating', l: 'Operating Cash Flow', p: '5000000', min: 0, u: 'USD' },
      { k: 'capex', l: 'Capital Expenditures', p: '1200000', min: 0, u: 'USD' },
      { k: 'revenue', l: 'Revenue', p: '20000000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const fcf = v.operating - v.capex
      const fcfMargin = (fcf / v.revenue) * 100
      const capexIntensity = (v.capex / v.revenue) * 100
      return {
        primary: { value: parseFloat(fcf.toFixed(0)), label: 'Free Cash Flow', fmt: 'usd' },
        details: [
          { l: 'FCF Margin', v: parseFloat(fcfMargin.toFixed(2)), fmt: 'pct', color: fcfMargin > 10 ? 'var(--green)' : 'var(--text)' },
          { l: 'Capex Intensity', v: parseFloat(capexIntensity.toFixed(2)), fmt: 'pct' },
          { l: 'Operating Cash Flow', v: v.operating, fmt: 'usd' },
        ],
      }
    },
    about: 'Warren Buffett considers FCF the most important financial metric — "owner earnings" that can be returned to shareholders via dividends, buybacks, or acquisitions. Apple generated over $100 billion in FCF in 2023, using most of it to buy back stock.',
    related: ['ebitda-calculator', 'operating-profit-calculator', 'business-valuation-calculator'],
  },
  {
    slug: 'working-capital-calculator',
    title: 'Working Capital Calculator',
    desc: 'Calculate working capital and current ratio from balance sheet data.',
    cat: 'finance', icon: '🔄',
    fields: [
      { k: 'current_assets', l: 'Current Assets', p: '500000', min: 0, u: 'USD' },
      { k: 'current_liabilities', l: 'Current Liabilities', p: '300000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const wc = v.current_assets - v.current_liabilities
      const cr = v.current_assets / v.current_liabilities
      let health = 'Healthy (> 1.5x)'
      if (cr < 1) health = 'Distressed — potential liquidity crisis (< 1.0x)'
      else if (cr < 1.5) health = 'Tight — monitor closely (1.0–1.5x)'
      return {
        primary: { value: parseFloat(wc.toFixed(0)), label: 'Working Capital', fmt: 'usd' },
        details: [
          { l: 'Current Ratio', v: parseFloat(cr.toFixed(2)), fmt: 'num' },
          { l: 'Health Assessment', v: health, fmt: 'txt', color: cr >= 1.5 ? 'var(--green)' : cr >= 1 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'Working capital is the lifeblood of operations — positive working capital means a company can pay near-term bills. Retail companies often run negative working capital (like Walmart) because they collect cash before paying suppliers. Current ratio above 2.0x may indicate inefficient use of capital.',
    related: ['current-ratio-calculator', 'quick-ratio-calculator', 'debt-ratio-calculator'],
  },
  {
    slug: 'current-ratio-calculator',
    title: 'Current Ratio Calculator',
    desc: 'Calculate the current ratio to assess short-term liquidity.',
    cat: 'finance', icon: '💧',
    fields: [
      { k: 'current_assets', l: 'Current Assets', p: '800000', min: 0, u: 'USD' },
      { k: 'current_liabilities', l: 'Current Liabilities', p: '400000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const cr = v.current_assets / v.current_liabilities
      return {
        primary: { value: parseFloat(cr.toFixed(2)), label: 'Current Ratio', fmt: 'num' },
        details: [
          { l: 'Working Capital', v: v.current_assets - v.current_liabilities, fmt: 'usd' },
          { l: 'Interpretation', v: cr >= 2 ? 'Strong' : cr >= 1.5 ? 'Good' : cr >= 1 ? 'Fair' : 'Weak', fmt: 'txt' },
        ],
      }
    },
    about: 'A current ratio above 1.0 means current assets cover current liabilities. The sweet spot is 1.5–3.0; below 1.0 signals potential short-term payment problems. Lenders typically require a current ratio above 1.2 in loan covenants.',
    related: ['quick-ratio-calculator', 'working-capital-calculator', 'debt-ratio-calculator'],
  },
  {
    slug: 'quick-ratio-calculator',
    title: 'Quick Ratio Calculator',
    desc: 'Calculate the quick ratio (acid-test) excluding inventory from current assets.',
    cat: 'finance', icon: '⚡',
    fields: [
      { k: 'cash', l: 'Cash & Equivalents', p: '200000', min: 0, u: 'USD' },
      { k: 'receivables', l: 'Accounts Receivable', p: '150000', min: 0, u: 'USD' },
      { k: 'current_liabilities', l: 'Current Liabilities', p: '300000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const quick = (v.cash + v.receivables) / v.current_liabilities
      return {
        primary: { value: parseFloat(quick.toFixed(2)), label: 'Quick Ratio', fmt: 'num' },
        details: [
          { l: 'Quick Assets', v: v.cash + v.receivables, fmt: 'usd' },
          { l: 'Current Liabilities', v: v.current_liabilities, fmt: 'usd' },
          { l: 'Rating', v: quick >= 1 ? 'Adequate' : 'Below Threshold', fmt: 'txt', color: quick >= 1 ? 'var(--green)' : '#f87171' },
        ],
        note: 'Quick ratio excludes inventory, which may be slow to liquidate in a crisis.',
      }
    },
    about: 'The quick ratio (or acid-test) is stricter than the current ratio because it excludes inventory — which can take months to convert to cash. Manufacturers should target quick ratios above 0.5; service companies with little inventory above 1.0.',
    related: ['current-ratio-calculator', 'working-capital-calculator', 'debt-ratio-calculator'],
  },
  {
    slug: 'debt-ratio-calculator',
    title: 'Debt Ratio Calculator',
    desc: 'Calculate the debt ratio and debt-to-equity ratio from balance sheet data.',
    cat: 'finance', icon: '⚖️',
    fields: [
      { k: 'total_debt', l: 'Total Debt', p: '500000', min: 0, u: 'USD' },
      { k: 'total_assets', l: 'Total Assets', p: '1200000', min: 0.01, u: 'USD' },
      { k: 'equity', l: 'Total Equity', p: '700000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const debtRatio = v.total_debt / v.total_assets
      const dte = v.total_debt / v.equity
      return {
        primary: { value: parseFloat((debtRatio * 100).toFixed(2)), label: 'Debt Ratio', fmt: 'pct' },
        details: [
          { l: 'Debt-to-Equity Ratio', v: parseFloat(dte.toFixed(2)), fmt: 'num' },
          { l: 'Total Leverage', v: parseFloat((v.total_assets / v.equity).toFixed(2)), fmt: 'num' },
        ],
        note: 'Debt ratio below 40% is generally considered conservative.',
      }
    },
    about: 'The S&P 500 median debt-to-equity ratio is roughly 1.0–1.5x. Capital-intensive industries like utilities and telecom often run 2–4x D/E; tech companies frequently have D/E below 0.5x. Investment-grade credit ratings generally require D/E below 3x.',
    related: ['current-ratio-calculator', 'quick-ratio-calculator', 'working-capital-calculator'],
  },
  {
    slug: 'return-on-equity-calculator',
    title: 'Return on Equity (ROE) Calculator',
    desc: 'Calculate Return on Equity and use DuPont decomposition to diagnose drivers.',
    cat: 'finance', icon: '📈',
    fields: [
      { k: 'net_income', l: 'Net Income', p: '500000', min: 0, u: 'USD' },
      { k: 'equity', l: "Average Shareholders' Equity", p: '2000000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const roe = (v.net_income / v.equity) * 100
      let rating = 'Excellent (> 20%)'
      if (roe < 5) rating = 'Poor (< 5%)'
      else if (roe < 10) rating = 'Below Average (5–10%)'
      else if (roe < 15) rating = 'Average (10–15%)'
      else if (roe < 20) rating = 'Good (15–20%)'
      return {
        primary: { value: parseFloat(roe.toFixed(2)), label: 'Return on Equity', fmt: 'pct' },
        details: [
          { l: 'Net Income', v: v.net_income, fmt: 'usd' },
          { l: 'Shareholders\' Equity', v: v.equity, fmt: 'usd' },
          { l: 'Rating', v: rating, fmt: 'txt', color: roe >= 15 ? 'var(--green)' : roe >= 10 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'Warren Buffett uses ROE consistently above 15% as a key criterion for great businesses. Apple\'s ROE regularly exceeds 100% due to share buybacks reducing equity. The DuPont framework decomposes ROE into profit margin × asset turnover × financial leverage.',
    related: ['return-on-assets-calculator', 'gross-profit-calculator', 'free-cash-flow-calculator'],
  },
  {
    slug: 'return-on-assets-calculator',
    title: 'Return on Assets (ROA) Calculator',
    desc: 'Calculate Return on Assets to measure how efficiently a company uses its asset base.',
    cat: 'finance', icon: '🏗️',
    fields: [
      { k: 'net_income', l: 'Net Income', p: '400000', min: 0, u: 'USD' },
      { k: 'total_assets', l: 'Average Total Assets', p: '5000000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const roa = (v.net_income / v.total_assets) * 100
      return {
        primary: { value: parseFloat(roa.toFixed(2)), label: 'Return on Assets', fmt: 'pct' },
        details: [
          { l: 'Net Income', v: v.net_income, fmt: 'usd' },
          { l: 'Total Assets', v: v.total_assets, fmt: 'usd' },
          { l: 'Asset Turnover (approx)', v: parseFloat((1 / (v.total_assets / (v.net_income / 0.1))).toFixed(3)), fmt: 'num' },
        ],
        note: 'ROA above 5% is generally considered good; banks average 1–2% due to high leverage.',
      }
    },
    about: 'ROA differs from ROE in that it measures returns across all financing — debt and equity. Asset-light businesses like software companies achieve ROA of 20–30%; capital-intensive manufacturers may only reach 3–5%. Banks and financial institutions typically run 0.5–2% ROA with heavy leverage.',
    related: ['return-on-equity-calculator', 'gross-profit-calculator', 'ebitda-calculator'],
  },
  {
    slug: 'inventory-turnover-calculator',
    title: 'Inventory Turnover Calculator',
    desc: 'Calculate inventory turnover ratio and days inventory outstanding.',
    cat: 'finance', icon: '📦',
    fields: [
      { k: 'cogs', l: 'Cost of Goods Sold', p: '3000000', min: 0, u: 'USD' },
      { k: 'avg_inventory', l: 'Average Inventory', p: '600000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const turnover = v.cogs / v.avg_inventory
      const dio = 365 / turnover
      return {
        primary: { value: parseFloat(turnover.toFixed(2)), label: 'Inventory Turnover', fmt: 'num' },
        details: [
          { l: 'Days Inventory Outstanding', v: parseFloat(dio.toFixed(1)), fmt: 'num' },
          { l: 'COGS', v: v.cogs, fmt: 'usd' },
          { l: 'Average Inventory', v: v.avg_inventory, fmt: 'usd' },
        ],
        note: 'Higher turnover generally means better efficiency, but depends heavily on industry.',
      }
    },
    about: 'Walmart turns inventory roughly 8–9 times per year (45 days). Apple turns it 60+ times. Luxury retailers may turn inventory only 2–4 times annually. Extremely high turnover can indicate stockouts; extremely low can signal obsolete inventory.',
    related: ['working-capital-calculator', 'days-sales-outstanding-calculator', 'accounts-receivable-calculator'],
  },
  {
    slug: 'accounts-receivable-calculator',
    title: 'Accounts Receivable Calculator',
    desc: 'Calculate days sales outstanding (DSO) and accounts receivable turnover.',
    cat: 'finance', icon: '📄',
    fields: [
      { k: 'revenue', l: 'Annual Revenue', p: '5000000', min: 0, u: 'USD' },
      { k: 'ar', l: 'Average Accounts Receivable', p: '600000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const arTurnover = v.revenue / v.ar
      const dso = 365 / arTurnover
      return {
        primary: { value: parseFloat(dso.toFixed(1)), label: 'Days Sales Outstanding (DSO)', fmt: 'num' },
        details: [
          { l: 'AR Turnover', v: parseFloat(arTurnover.toFixed(2)), fmt: 'num' },
          { l: 'Annual Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'Average AR', v: v.ar, fmt: 'usd' },
        ],
        note: 'DSO under 30 days is excellent; above 60 days warrants investigation.',
      }
    },
    about: 'DSO measures how quickly a business collects its receivables. B2B companies typically run 30–60 day DSO; SaaS companies with annual prepayments can have negative DSO (deferred revenue). Rising DSO often signals collection problems or customer financial stress before it hits the income statement.',
    related: ['inventory-turnover-calculator', 'days-sales-outstanding-calculator', 'working-capital-calculator'],
  },
  {
    slug: 'days-sales-outstanding-calculator',
    title: 'Days Sales Outstanding Calculator',
    desc: 'Calculate DSO — the average number of days to collect payment after a sale.',
    cat: 'finance', icon: '📅',
    fields: [
      { k: 'ar', l: 'Accounts Receivable', p: '250000', min: 0, u: 'USD' },
      { k: 'revenue', l: 'Revenue (period)', p: '1500000', min: 0.01, u: 'USD' },
      { k: 'days', l: 'Days in Period', t: 'sel', p: '90', op: [['30','Monthly (30)'],['90','Quarterly (90)'],['365','Annual (365)']] },
    ],
    fn: (v) => {
      const dso = (v.ar / v.revenue) * v.days
      return {
        primary: { value: parseFloat(dso.toFixed(1)), label: 'Days Sales Outstanding', fmt: 'num' },
        details: [
          { l: 'Accounts Receivable', v: v.ar, fmt: 'usd' },
          { l: 'Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'Period (days)', v: v.days, fmt: 'num' },
        ],
      }
    },
    about: 'DSO is a critical cash flow metric — each day of DSO ties up capital equal to average daily revenue. A company with $10M in annual revenue at 45-day DSO has $1.23M locked in receivables. Reducing DSO from 60 to 30 days can free up six figures in working capital for mid-size businesses.',
    related: ['accounts-receivable-calculator', 'inventory-turnover-calculator', 'working-capital-calculator'],
  },
  {
    slug: 'bond-yield-calculator',
    title: 'Bond Yield Calculator',
    desc: 'Calculate current yield and yield to maturity for a bond.',
    cat: 'finance', icon: '📜',
    fields: [
      { k: 'face', l: 'Face Value', p: '1000', min: 0.01, u: 'USD' },
      { k: 'price', l: 'Market Price', p: '950', min: 0.01, u: 'USD' },
      { k: 'coupon', l: 'Annual Coupon Rate', p: '5', min: 0, max: 100, u: '%' },
      { k: 'years', l: 'Years to Maturity', p: '10', min: 0.1, u: 'years' },
    ],
    fn: (v) => {
      const couponPayment = v.face * (v.coupon / 100)
      const currentYield = (couponPayment / v.price) * 100
      const ytm_approx = (couponPayment + (v.face - v.price) / v.years) / ((v.face + v.price) / 2) * 100
      return {
        primary: { value: parseFloat(ytm_approx.toFixed(3)), label: 'Yield to Maturity (approx.)', fmt: 'pct' },
        details: [
          { l: 'Annual Coupon Payment', v: parseFloat(couponPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Current Yield', v: parseFloat(currentYield.toFixed(3)), fmt: 'pct' },
          { l: 'Premium / Discount', v: parseFloat((v.price - v.face).toFixed(2)), fmt: 'usd', color: v.price >= v.face ? 'var(--green)' : '#f87171' },
        ],
      }
    },
    about: 'Bond prices and yields move inversely — a 1% rise in rates drops a 10-year bond\'s price by roughly 8–9% (its "duration"). The 10-year Treasury yield hit 5% in October 2023 for the first time since 2007, repricing trillions in fixed-income assets.',
    related: ['dividend-yield-calculator', 'present-value-calculator', 'annuity-calculator'],
  },,
  {
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Calculator',
    desc: 'Calculate how much you need in your emergency fund based on monthly expenses and risk tolerance.',
    cat: 'finance', icon: '🛡️',
    fields: [
      { k: 'monthly_expenses', l: 'Monthly Essential Expenses', p: '4500', min: 0, u: 'USD' },
      { k: 'months', l: 'Months of Coverage', p: '6', min: 1, max: 24 },
      { k: 'current_savings', l: 'Current Emergency Savings', p: '5000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const target = v.monthly_expenses * v.months
      const gap = Math.max(0, target - v.current_savings)
      const pctComplete = target > 0 ? Math.min(100, (v.current_savings / target) * 100) : 100
      return {
        primary: { value: parseFloat(target.toFixed(2)), label: 'Emergency Fund Target', fmt: 'usd' },
        details: [
          { l: 'Amount Still Needed', v: parseFloat(gap.toFixed(2)), fmt: 'usd', color: gap > 0 ? '#f87171' : 'var(--green)' },
          { l: 'Progress', v: parseFloat(pctComplete.toFixed(1)), fmt: 'pct' },
          { l: 'Monthly Savings Needed (12 months)', v: parseFloat((gap / 12).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'Most financial planners recommend 3–6 months of essential expenses for salaried employees, and 6–12 months for self-employed or variable-income workers. Keep your emergency fund in a high-yield savings account (HYSA) — rates averaged 4.5–5.0% in 2024.',
    related: ['compound-interest-calculator', 'savings-goal-calculator', 'budget-calculator'],
  },
  {
    slug: 'college-529-savings-calculator',
    title: '529 College Savings Calculator',
    desc: 'Project how much you'll have in a 529 plan for college by the time your child turns 18.',
    cat: 'finance', icon: '🎓',
    fields: [
      { k: 'current_balance', l: 'Current 529 Balance', p: '5000', min: 0, u: 'USD' },
      { k: 'monthly_contribution', l: 'Monthly Contribution', p: '300', min: 0, u: 'USD' },
      { k: 'child_age', l: 'Child's Current Age', p: '5', min: 0, max: 17 },
      { k: 'annual_return', l: 'Expected Annual Return', p: '7', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const years = 18 - v.child_age
      const months = years * 12
      const r = v.annual_return / 100 / 12
      const futureBalance = v.current_balance * Math.pow(1 + r, months)
      const futureContribs = r > 0 ? v.monthly_contribution * ((Math.pow(1 + r, months) - 1) / r) : v.monthly_contribution * months
      const total = futureBalance + futureContribs
      return {
        primary: { value: parseFloat(total.toFixed(2)), label: 'Projected 529 Balance at Age 18', fmt: 'usd' },
        details: [
          { l: 'Years to Invest', v: years, fmt: 'num' },
          { l: 'Total Contributions', v: parseFloat((v.current_balance + v.monthly_contribution * months).toFixed(2)), fmt: 'usd' },
          { l: 'Investment Growth', v: parseFloat((total - v.current_balance - v.monthly_contribution * months).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'Average 4-year public college cost in 2024: $108,000 total. Private: $240,000. Starting at birth with $300/month at 7% return accumulates ~$105,000 by age 18. 529 earnings are tax-free when used for qualified education expenses.',
    related: ['compound-interest-calculator', 'roth-ira-calculator', 'savings-goal-calculator'],
  },
  {
    slug: 'debt-avalanche-calculator',
    title: 'Debt Avalanche Calculator',
    desc: 'Calculate total interest saved using the debt avalanche method (highest interest rate first).',
    cat: 'finance', icon: '🌋',
    fields: [
      { k: 'debt1', l: 'Debt 1 Balance', p: '8000', min: 0, u: 'USD' },
      { k: 'rate1', l: 'Debt 1 Interest Rate', p: '24', min: 0, max: 100, u: '%' },
      { k: 'debt2', l: 'Debt 2 Balance', p: '15000', min: 0, u: 'USD' },
      { k: 'rate2', l: 'Debt 2 Interest Rate', p: '8', min: 0, max: 100, u: '%' },
      { k: 'monthly_payment', l: 'Total Monthly Payment Available', p: '800', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const totalDebt = v.debt1 + v.debt2
      const minPmt = totalDebt * 0.02
      const avgRate = totalDebt > 0 ? (v.debt1 * v.rate1 + v.debt2 * v.rate2) / totalDebt : 0
      const interestIfMinimum = totalDebt * (avgRate / 100) * 3
      const interestAvalanche = totalDebt * (avgRate / 100) * 1.5
      const saved = interestIfMinimum - interestAvalanche
      const months = v.monthly_payment > 0 ? Math.ceil(totalDebt / v.monthly_payment * 1.3) : 999
      return {
        primary: { value: parseFloat(saved.toFixed(2)), label: 'Estimated Interest Saved vs Minimums', fmt: 'usd' },
        details: [
          { l: 'Total Debt', v: parseFloat(totalDebt.toFixed(2)), fmt: 'usd' },
          { l: 'Strategy', v: 'Pay highest rate (Debt 1) first', fmt: 'txt', color: 'var(--green)' },
          { l: 'Est. Payoff Time', v: months, fmt: 'num' },
        ],
        note: 'Avalanche saves the most interest mathematically. Snowball (lowest balance first) provides faster psychological wins.',
      }
    },
    about: 'The debt avalanche pays mathematically optimal results — directing extra payments to the highest-rate debt first. A $23,000 combined debt at 16% average rate costs $11,000 in interest at minimums. Avalanche with $800/month saves ~$4,000 vs minimums.',
    related: ['credit-card-interest-calculator', 'loan-payoff-calculator', 'debt-to-income-calculator'],
  },
  {
    slug: 'home-equity-loan-calculator',
    title: 'Home Equity Loan Calculator',
    desc: 'Calculate how much you can borrow against your home equity and what the monthly payments will be.',
    cat: 'finance', icon: '🏡',
    fields: [
      { k: 'home_value', l: 'Current Home Value', p: '450000', min: 0, u: 'USD' },
      { k: 'mortgage_balance', l: 'Remaining Mortgage Balance', p: '280000', min: 0, u: 'USD' },
      { k: 'loan_rate', l: 'Home Equity Loan Rate', p: '8.5', min: 0, u: '%' },
      { k: 'loan_term', l: 'Loan Term (years)', p: '10', min: 1, max: 30 },
    ],
    fn: (v) => {
      const equity = v.home_value - v.mortgage_balance
      const maxBorrow = equity * 0.85
      const r = v.loan_rate / 100 / 12
      const n = v.loan_term * 12
      const monthlyPayment = r > 0 ? maxBorrow * r / (1 - Math.pow(1 + r, -n)) : maxBorrow / n
      const totalPaid = monthlyPayment * n
      const totalInterest = totalPaid - maxBorrow
      return {
        primary: { value: parseFloat(maxBorrow.toFixed(2)), label: 'Maximum You Can Borrow (85% LTV)', fmt: 'usd' },
        details: [
          { l: 'Available Equity', v: parseFloat(equity.toFixed(2)), fmt: 'usd' },
          { l: 'Est. Monthly Payment', v: parseFloat(monthlyPayment.toFixed(2)), fmt: 'usd' },
          { l: 'Total Interest Paid', v: parseFloat(totalInterest.toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'Most lenders allow borrowing up to 85% of your home's value minus any mortgage balance. Home equity loan rates in 2025 average 8–9.5%. Interest may be tax-deductible if used for home improvements — consult a tax advisor.',
    related: ['mortgage-calculator', 'refinance-break-even-calculator', 'heloc-calculator'],
  },
  {
    slug: 'hsa-contribution-calculator',
    title: 'HSA Contribution & Tax Savings Calculator',
    desc: 'Calculate your HSA tax savings based on your contribution and tax bracket.',
    cat: 'finance', icon: '🏥',
    fields: [
      { k: 'contribution', l: 'Annual HSA Contribution', p: '3850', min: 0, u: 'USD' },
      { k: 'federal_rate', l: 'Federal Tax Bracket', p: '22', min: 0, max: 37, u: '%' },
      { k: 'state_rate', l: 'State Income Tax Rate', p: '5', min: 0, max: 15, u: '%' },
      { k: 'fica_rate', l: 'FICA Rate', p: '7.65', min: 0, max: 15, u: '%' },
    ],
    fn: (v) => {
      const totalTaxRate = (v.federal_rate + v.state_rate + v.fica_rate) / 100
      const taxSavings = v.contribution * totalTaxRate
      const effectiveCost = v.contribution - taxSavings
      return {
        primary: { value: parseFloat(taxSavings.toFixed(2)), label: 'Total Tax Savings', fmt: 'usd' },
        details: [
          { l: 'Effective Cost After Tax Savings', v: parseFloat(effectiveCost.toFixed(2)), fmt: 'usd' },
          { l: '2025 Self-Only Limit', v: 4300, fmt: 'usd' },
          { l: '2025 Family Limit', v: 8550, fmt: 'usd' },
        ],
        note: 'HSA triple tax advantage: contributions pre-tax, growth tax-free, withdrawals tax-free for medical expenses.',
      }
    },
    about: 'The HSA is considered by many financial planners as the best tax-advantaged account in the US — it's the only one with a triple tax benefit. Unused funds roll over forever and can be invested in stocks after age 65.',
    related: ['tax-bracket-calculator', 'roth-ira-calculator', 'retirement-savings-calculator'],
  },
  {
    slug: 'freelance-hourly-rate-calculator',
    title: 'Freelance Hourly Rate Calculator',
    desc: 'Calculate the minimum hourly rate you need to charge as a freelancer to match your income goals.',
    cat: 'finance', icon: '💼',
    fields: [
      { k: 'annual_income', l: 'Desired Annual Income', p: '100000', min: 0, u: 'USD' },
      { k: 'work_weeks', l: 'Billable Weeks per Year', p: '46', min: 1, max: 52 },
      { k: 'hours_per_week', l: 'Billable Hours per Week', p: '30', min: 1, max: 60 },
      { k: 'expenses', l: 'Annual Business Expenses', p: '8000', min: 0, u: 'USD' },
      { k: 'se_tax', l: 'Self-Employment Tax Rate', p: '15.3', min: 0, u: '%' },
    ],
    fn: (v) => {
      const grossNeeded = (v.annual_income + v.expenses) / (1 - v.se_tax / 100)
      const billableHours = v.work_weeks * v.hours_per_week
      const rateNeeded = billableHours > 0 ? grossNeeded / billableHours : 0
      return {
        primary: { value: parseFloat(rateNeeded.toFixed(2)), label: 'Minimum Hourly Rate Needed', fmt: 'usd' },
        details: [
          { l: 'Gross Revenue Needed', v: parseFloat(grossNeeded.toFixed(2)), fmt: 'usd' },
          { l: 'Annual Billable Hours', v: billableHours, fmt: 'num' },
          { l: 'SE Tax Owed (est.)', v: parseFloat((grossNeeded * v.se_tax / 100).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Add 20–30% buffer to account for unbillable time, client delays, and finding new work.',
      }
    },
    about: 'Freelancers pay 15.3% self-employment tax on top of income tax — equivalent to paying both the employee and employer share of Social Security and Medicare. A $100K target as a freelancer requires roughly $130–140K in gross revenue.',
    related: ['self-employment-tax-calculator', 'quarterly-tax-calculator', 'take-home-pay-calculator'],
  },
  {
    slug: 'gift-tax-annual-exclusion-calculator',
    title: 'Gift Tax Annual Exclusion Calculator',
    desc: 'Calculate how much you can gift tax-free per year under IRS annual exclusion rules.',
    cat: 'finance', icon: '🎁',
    fields: [
      { k: 'gift_amount', l: 'Total Gift Amount', p: '50000', min: 0, u: 'USD' },
      { k: 'recipients', l: 'Number of Recipients', p: '3', min: 1, max: 50 },
      { k: 'is_married', l: 'Gift-Splitting (Married Couple)', p: '0', min: 0, max: 1 },
    ],
    fn: (v) => {
      const exclusion2025 = 19000
      const multiplier = v.is_married >= 0.5 ? 2 : 1
      const totalExclusion = exclusion2025 * v.recipients * multiplier
      const taxableGift = Math.max(0, v.gift_amount - totalExclusion)
      return {
        primary: { value: parseFloat(totalExclusion.toFixed(0)), label: 'Total Tax-Free Gift Allowance', fmt: 'usd' },
        details: [
          { l: '2025 Annual Exclusion per Person', v: exclusion2025, fmt: 'usd' },
          { l: 'Taxable Gift Amount', v: parseFloat(taxableGift.toFixed(2)), fmt: 'usd', color: taxableGift > 0 ? '#f87171' : 'var(--green)' },
          { l: 'Remaining Lifetime Exemption', v: 13610000, fmt: 'usd' },
        ],
        note: 'Taxable gifts above the annual exclusion count against your $13.61M lifetime exemption — most people never owe gift tax.',
      }
    },
    about: 'The 2025 annual gift tax exclusion is $19,000 per recipient (up from $18,000 in 2024). Married couples can combine exclusions to give $38,000 per recipient. Direct payments to educational institutions and medical providers are completely unlimited.',
    related: ['estate-tax-calculator', 'roth-ira-calculator', 'financial-independence-calculator'],
  },
  {
    slug: 'side-hustle-tax-calculator',
    title: 'Side Hustle Tax Calculator',
    desc: 'Estimate taxes owed on side hustle income including self-employment tax and quarterly payments.',
    cat: 'finance', icon: '⚡',
    fields: [
      { k: 'side_income', l: 'Annual Side Hustle Income', p: '25000', min: 0, u: 'USD' },
      { k: 'expenses', l: 'Deductible Business Expenses', p: '4000', min: 0, u: 'USD' },
      { k: 'w2_income', l: 'W-2 Salary (primary job)', p: '75000', min: 0, u: 'USD' },
      { k: 'filing_status', l: 'Filing Status (0=Single, 1=MFJ)', p: '0', min: 0, max: 1 },
    ],
    fn: (v) => {
      const netSideIncome = Math.max(0, v.side_income - v.expenses)
      const seTax = netSideIncome * 0.153
      const seDeduction = seTax / 2
      const totalIncome = v.w2_income + netSideIncome - seDeduction
      const stdDeduction = v.filing_status >= 0.5 ? 30000 : 15000
      const taxableIncome = Math.max(0, totalIncome - stdDeduction)
      const marginalRate = taxableIncome > 89075 ? 0.22 : taxableIncome > 44725 ? 0.12 : 0.10
      const additionalIT = netSideIncome * marginalRate
      const totalTax = seTax + additionalIT
      const quarterly = totalTax / 4
      return {
        primary: { value: parseFloat(totalTax.toFixed(2)), label: 'Estimated Annual Tax on Side Income', fmt: 'usd' },
        details: [
          { l: 'Self-Employment Tax (15.3%)', v: parseFloat(seTax.toFixed(2)), fmt: 'usd' },
          { l: 'Additional Income Tax', v: parseFloat(additionalIT.toFixed(2)), fmt: 'usd' },
          { l: 'Quarterly Payment (est.)', v: parseFloat(quarterly.toFixed(2)), fmt: 'usd' },
        ],
        note: 'Pay quarterly taxes by April 15, June 15, Sept 15, and Jan 15 to avoid underpayment penalties.',
      }
    },
    about: 'Side hustle income over $400 triggers self-employment tax on top of regular income tax. The IRS requires quarterly estimated payments if you expect to owe $1,000+ for the year. Common deductions: home office, equipment, subscriptions, mileage at $0.67/mile (2024).',
    related: ['self-employment-tax-calculator', 'freelance-hourly-rate-calculator', 'quarterly-tax-calculator'],
  },
  {
    slug: 'net-worth-tracker-calculator',
    title: 'Net Worth Calculator',
    desc: 'Calculate your complete net worth by entering your assets and liabilities.',
    cat: 'finance', icon: '💎',
    fields: [
      { k: 'home_value', l: 'Home / Real Estate Value', p: '400000', min: 0, u: 'USD' },
      { k: 'investments', l: 'Investment Accounts (401k, IRA, brokerage)', p: '150000', min: 0, u: 'USD' },
      { k: 'cash', l: 'Cash & Savings', p: '25000', min: 0, u: 'USD' },
      { k: 'mortgage', l: 'Mortgage Balance', p: '280000', min: 0, u: 'USD' },
      { k: 'other_debt', l: 'Other Debts (car, student, credit)', p: '35000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const totalAssets = v.home_value + v.investments + v.cash
      const totalLiabilities = v.mortgage + v.other_debt
      const netWorth = totalAssets - totalLiabilities
      const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0
      return {
        primary: { value: parseFloat(netWorth.toFixed(2)), label: 'Net Worth', fmt: 'usd' },
        details: [
          { l: 'Total Assets', v: parseFloat(totalAssets.toFixed(2)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Total Liabilities', v: parseFloat(totalLiabilities.toFixed(2)), fmt: 'usd', color: '#f87171' },
          { l: 'Debt-to-Asset Ratio', v: parseFloat(debtRatio.toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Median US net worth in 2025: $192,700 (Federal Reserve). For those under 35: $39,000. For 35–44: $135,600. For 45–54: $247,200. Real estate often makes up 60–70% of net worth for middle-class households — meaning it's often illiquid.',
    related: ['financial-independence-calculator', 'retirement-savings-calculator', 'budget-calculator'],
  },
  {
    slug: 'rental-property-roi-calculator',
    title: 'Rental Property ROI Calculator',
    desc: 'Calculate the return on investment, cash-on-cash return, and cap rate for a rental property.',
    cat: 'finance', icon: '🏘️',
    fields: [
      { k: 'purchase_price', l: 'Purchase Price', p: '350000', min: 0, u: 'USD' },
      { k: 'down_payment', l: 'Down Payment', p: '70000', min: 0, u: 'USD' },
      { k: 'monthly_rent', l: 'Monthly Rent Collected', p: '2200', min: 0, u: 'USD' },
      { k: 'monthly_expenses', l: 'Monthly Expenses (mortgage, taxes, insurance, maintenance)', p: '1800', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const annualCashFlow = (v.monthly_rent - v.monthly_expenses) * 12
      const cashOnCash = v.down_payment > 0 ? (annualCashFlow / v.down_payment) * 100 : 0
      const noi = v.monthly_rent * 12 * 0.92 - (v.monthly_expenses - (v.purchase_price * 0.04) / 12) * 12
      const capRate = v.purchase_price > 0 ? (noi / v.purchase_price) * 100 : 0
      return {
        primary: { value: parseFloat(cashOnCash.toFixed(2)), label: 'Cash-on-Cash Return', fmt: 'pct' },
        details: [
          { l: 'Annual Cash Flow', v: parseFloat(annualCashFlow.toFixed(2)), fmt: 'usd', color: annualCashFlow >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Cap Rate', v: parseFloat(capRate.toFixed(2)), fmt: 'pct' },
          { l: 'Monthly Cash Flow', v: parseFloat((annualCashFlow / 12).toFixed(2)), fmt: 'usd' },
        ],
        note: 'Target: 1% Rule (monthly rent ≥ 1% of purchase price). A cash-on-cash of 6–10% is generally considered good.',
      }
    },
    about: 'The 1% rule (monthly rent ≥ 1% of purchase price) is a quick screening tool — a $350K property should rent for $3,500+/month. Average gross rental yield in the US is 6–8%. Cap rates above 5% in major metros are increasingly rare post-2020.',
    related: ['mortgage-calculator', 'home-equity-loan-calculator', 'investment-calculator'],
  },

]
