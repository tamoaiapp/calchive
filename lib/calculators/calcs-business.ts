import type { CalcConfig } from './types'

export const businessCalcs: CalcConfig[] = [
  {
    slug: 'cac-calculator',
    title: 'Customer Acquisition Cost (CAC) Calculator',
    desc: 'Calculate how much it costs to acquire each new customer.',
    cat: 'business', icon: '💼',
    fields: [
      { k: 'marketing', l: 'Total Marketing Spend', p: '50000', min: 0, u: 'USD' },
      { k: 'sales', l: 'Total Sales Costs', p: '30000', min: 0, u: 'USD' },
      { k: 'new_customers', l: 'New Customers Acquired', p: '200', min: 1 },
    ],
    fn: (v) => {
      const total = v.marketing + v.sales
      const cac = total / v.new_customers
      return {
        primary: { value: parseFloat(cac.toFixed(2)), label: 'Customer Acquisition Cost (CAC)', fmt: 'usd' },
        details: [
          { l: 'Total Sales & Marketing Spend', v: total, fmt: 'usd' },
          { l: 'New Customers', v: v.new_customers, fmt: 'num' },
          { l: 'Marketing CAC Only', v: parseFloat((v.marketing / v.new_customers).toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'CAC benchmarks vary widely: B2C SaaS averages $100–$300, B2B SaaS $500–$5,000+. A healthy LTV:CAC ratio is 3:1 — meaning each customer generates at least 3x what it cost to acquire them. High CAC alone doesn\'t indicate a problem; the ratio to LTV is what matters.',
    related: ['ltv-calculator', 'ltv-cac-ratio-calculator', 'mrr-calculator'],
  },
  {
    slug: 'ltv-calculator',
    title: 'Customer Lifetime Value (LTV) Calculator',
    desc: 'Calculate the average lifetime value of a customer for your business.',
    cat: 'business', icon: '💎',
    fields: [
      { k: 'avg_order', l: 'Average Order Value', p: '80', min: 0, u: 'USD' },
      { k: 'orders_per_year', l: 'Purchase Frequency (per year)', p: '4', min: 0 },
      { k: 'avg_years', l: 'Average Customer Lifespan', p: '3', min: 0, u: 'years' },
      { k: 'gross_margin', l: 'Gross Margin %', p: '65', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const annual_revenue = v.avg_order * v.orders_per_year
      const ltv_revenue = annual_revenue * v.avg_years
      const ltv = ltv_revenue * (v.gross_margin / 100)
      return {
        primary: { value: parseFloat(ltv.toFixed(2)), label: 'Customer Lifetime Value (LTV)', fmt: 'usd' },
        details: [
          { l: 'Annual Revenue per Customer', v: parseFloat(annual_revenue.toFixed(2)), fmt: 'usd' },
          { l: 'Total Revenue (lifetime)', v: parseFloat(ltv_revenue.toFixed(2)), fmt: 'usd' },
          { l: 'Gross Margin Applied', v: v.gross_margin, fmt: 'pct' },
        ],
      }
    },
    about: 'LTV is the total profit attributable to a customer over their entire relationship with your business. Amazon Prime members have an LTV roughly 4x non-Prime customers. Subscription businesses with high LTV can justify spending more on acquisition — which is why growth-stage SaaS companies often run at a loss.',
    related: ['cac-calculator', 'ltv-cac-ratio-calculator', 'churn-rate-calculator'],
  },
  {
    slug: 'ltv-cac-ratio-calculator',
    title: 'LTV:CAC Ratio Calculator',
    desc: 'Calculate the LTV to CAC ratio to assess customer acquisition efficiency.',
    cat: 'business', icon: '📊',
    fields: [
      { k: 'ltv', l: 'Customer Lifetime Value (LTV)', p: '900', min: 0, u: 'USD' },
      { k: 'cac', l: 'Customer Acquisition Cost (CAC)', p: '300', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const ratio = v.ltv / v.cac
      let health = 'Excellent (> 3:1)'
      if (ratio < 1) health = 'Critical — losing money on each customer'
      else if (ratio < 2) health = 'Poor — unsustainable growth economics'
      else if (ratio < 3) health = 'Fair — needs improvement'
      return {
        primary: { value: parseFloat(ratio.toFixed(2)), label: 'LTV:CAC Ratio', fmt: 'num' },
        details: [
          { l: 'Health Status', v: health, fmt: 'txt', color: ratio >= 3 ? 'var(--green)' : ratio >= 2 ? '#fbbf24' : '#f87171' },
          { l: 'LTV', v: v.ltv, fmt: 'usd' },
          { l: 'CAC', v: v.cac, fmt: 'usd' },
        ],
        note: 'The SaaS benchmark: LTV:CAC of 3:1 is healthy; above 5:1 may signal underinvestment in growth.',
      }
    },
    about: 'The 3:1 LTV:CAC ratio is the SaaS industry benchmark, coined by Bessemer Venture Partners. Below 3:1, the business destroys value as it grows. Above 5:1, it may be leaving growth capital on the table by underinvesting in sales and marketing.',
    related: ['ltv-calculator', 'cac-calculator', 'churn-rate-calculator'],
  },
  {
    slug: 'churn-rate-calculator',
    title: 'Churn Rate Calculator',
    desc: 'Calculate monthly and annual customer churn rate.',
    cat: 'business', icon: '🌊',
    fields: [
      { k: 'customers_start', l: 'Customers at Start of Period', p: '1000', min: 1 },
      { k: 'customers_lost', l: 'Customers Lost During Period', p: '45', min: 0 },
      { k: 'period', l: 'Period Type', t: 'sel', p: '0', op: [['0','Monthly'],['1','Annual']] },
    ],
    fn: (v) => {
      const churn = (v.customers_lost / v.customers_start) * 100
      const annual = v.period === 0 ? (1 - Math.pow(1 - churn / 100, 12)) * 100 : churn
      const retention = 100 - churn
      const avg_customer_life = 100 / churn // in periods
      return {
        primary: { value: parseFloat(churn.toFixed(2)), label: `${v.period === 0 ? 'Monthly' : 'Annual'} Churn Rate`, fmt: 'pct' },
        details: [
          { l: 'Annual Churn (projected)', v: parseFloat(annual.toFixed(2)), fmt: 'pct', color: annual > 20 ? '#f87171' : annual > 10 ? '#fbbf24' : 'var(--green)' },
          { l: 'Retention Rate', v: parseFloat(retention.toFixed(2)), fmt: 'pct' },
          { l: 'Avg Customer Lifespan', v: `${parseFloat(avg_customer_life.toFixed(1))} ${v.period === 0 ? 'months' : 'years'}`, fmt: 'txt' },
        ],
      }
    },
    about: 'World-class B2B SaaS churn rates run below 5% annually; consumer apps may accept 2–3% monthly. Netflix\'s monthly churn is about 2–3%; Spotify under 3%. High churn is a product-market fit indicator — the best growth lever is often fixing retention before scaling acquisition.',
    related: ['nrr-calculator', 'mrr-calculator', 'ltv-calculator'],
  },
  {
    slug: 'mrr-calculator',
    title: 'Monthly Recurring Revenue (MRR) Calculator',
    desc: 'Calculate MRR from subscriber count, expansion, and churn.',
    cat: 'business', icon: '📈',
    fields: [
      { k: 'new_customers', l: 'New Customers This Month', p: '50', min: 0 },
      { k: 'avg_plan', l: 'Average Monthly Plan Value', p: '99', min: 0, u: 'USD' },
      { k: 'existing_mrr', l: 'Existing MRR (start of month)', p: '50000', min: 0, u: 'USD' },
      { k: 'churned_mrr', l: 'Churned MRR', p: '1500', min: 0, u: 'USD' },
      { k: 'expansion_mrr', l: 'Expansion MRR (upgrades)', p: '2000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const new_mrr = v.new_customers * v.avg_plan
      const end_mrr = v.existing_mrr + new_mrr + v.expansion_mrr - v.churned_mrr
      const net_new_mrr = new_mrr + v.expansion_mrr - v.churned_mrr
      const arr = end_mrr * 12
      const growth_rate = v.existing_mrr > 0 ? (net_new_mrr / v.existing_mrr) * 100 : 0
      return {
        primary: { value: parseFloat(end_mrr.toFixed(0)), label: 'End-of-Month MRR', fmt: 'usd' },
        details: [
          { l: 'New MRR', v: parseFloat(new_mrr.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'Expansion MRR', v: v.expansion_mrr, fmt: 'usd', color: 'var(--green)' },
          { l: 'Churned MRR', v: v.churned_mrr, fmt: 'usd', color: '#f87171' },
          { l: 'Net New MRR', v: parseFloat(net_new_mrr.toFixed(0)), fmt: 'usd', color: net_new_mrr >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'ARR (×12)', v: parseFloat(arr.toFixed(0)), fmt: 'usd' },
          { l: 'MoM Growth', v: parseFloat(growth_rate.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'MRR is the lifeblood metric of subscription businesses — it shows predictable, recurring revenue normalized monthly. Top-performing SaaS companies grow MRR 15–20%+ monthly in early stages. Decomposing MRR into New/Expansion/Churned/Contracted components (MRR movements) reveals the health of each growth lever.',
    related: ['arr-calculator', 'churn-rate-calculator', 'nrr-calculator'],
  },
  {
    slug: 'arr-calculator',
    title: 'Annual Recurring Revenue (ARR) Calculator',
    desc: 'Calculate Annual Recurring Revenue and its growth rate.',
    cat: 'business', icon: '📊',
    fields: [
      { k: 'mrr', l: 'Current Monthly Recurring Revenue', p: '85000', min: 0, u: 'USD' },
      { k: 'prior_arr', l: 'ARR One Year Ago', p: '700000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const current_arr = v.mrr * 12
      const growth = v.prior_arr > 0 ? ((current_arr - v.prior_arr) / v.prior_arr) * 100 : 0
      const rule_of_40 = growth // simplified; assume same % profitability
      return {
        primary: { value: parseFloat(current_arr.toFixed(0)), label: 'Annual Recurring Revenue (ARR)', fmt: 'usd' },
        details: [
          { l: 'Prior Year ARR', v: v.prior_arr, fmt: 'usd' },
          { l: 'YoY ARR Growth', v: parseFloat(growth.toFixed(2)), fmt: 'pct', color: growth > 50 ? 'var(--green)' : growth > 20 ? '#fbbf24' : '#f87171' },
          { l: 'Monthly MRR', v: v.mrr, fmt: 'usd' },
        ],
        note: 'ARR = MRR × 12 for pure subscription businesses. Investors often value SaaS at 5–15× ARR depending on growth rate.',
      }
    },
    about: 'ARR is the primary valuation metric for subscription businesses. SaaS companies trading publicly received 10–30× ARR multiples at the 2021 peak; by 2023 that compressed to 4–8×. The "T2D3" benchmark (triple ARR twice, then double three times) describes a path from $2M to $100M ARR in ~5 years.',
    related: ['mrr-calculator', 'churn-rate-calculator', 'saas-quick-ratio-calculator'],
  },
  {
    slug: 'cpm-calculator',
    title: 'CPM Calculator',
    desc: 'Calculate Cost Per Mille (CPM) — the cost per 1,000 ad impressions.',
    cat: 'business', icon: '📺',
    fields: [
      { k: 'spend', l: 'Total Ad Spend', p: '5000', min: 0, u: 'USD' },
      { k: 'impressions', l: 'Total Impressions', p: '500000', min: 1 },
    ],
    fn: (v) => {
      const cpm = (v.spend / v.impressions) * 1000
      const cost_per_impression = v.spend / v.impressions
      return {
        primary: { value: parseFloat(cpm.toFixed(2)), label: 'CPM (Cost per 1,000 Impressions)', fmt: 'usd' },
        details: [
          { l: 'Cost per Impression', v: parseFloat(cost_per_impression.toFixed(6)), fmt: 'usd' },
          { l: 'Total Spend', v: v.spend, fmt: 'usd' },
          { l: 'Total Impressions', v: v.impressions, fmt: 'num' },
        ],
      }
    },
    about: 'CPM rates vary dramatically by platform: Facebook averages $6–$10, Google Display Network $2–$5, LinkedIn $25–$50, and connected TV $15–$30. YouTube non-skippable ads average $9–$10 CPM. Higher CPMs on LinkedIn reflect better audience targeting for B2B campaigns.',
    related: ['cpc-calculator', 'roas-calculator', 'ctr-calculator'],
  },
  {
    slug: 'cpc-calculator',
    title: 'CPC Calculator',
    desc: 'Calculate Cost Per Click and total campaign cost from clicks and budget.',
    cat: 'business', icon: '👆',
    fields: [
      { k: 'spend', l: 'Total Ad Spend', p: '3000', min: 0, u: 'USD' },
      { k: 'clicks', l: 'Total Clicks', p: '1200', min: 1 },
    ],
    fn: (v) => {
      const cpc = v.spend / v.clicks
      const budget_for_1000 = cpc * 1000
      return {
        primary: { value: parseFloat(cpc.toFixed(2)), label: 'Cost Per Click (CPC)', fmt: 'usd' },
        details: [
          { l: 'Budget for 1,000 Clicks', v: parseFloat(budget_for_1000.toFixed(2)), fmt: 'usd' },
          { l: 'Total Clicks', v: v.clicks, fmt: 'num' },
          { l: 'Total Spend', v: v.spend, fmt: 'usd' },
        ],
      }
    },
    about: 'Google Ads average CPC ranges from $1–$2 for broad terms to $50–$100+ for high-intent legal, finance, and insurance keywords. The most expensive keyword categories include "insurance" ($55 avg), "loans" ($45), and "mortgage" ($40). Quality Score affects CPC — better relevance means lower costs.',
    related: ['cpm-calculator', 'roas-calculator', 'ctr-calculator'],
  },
  {
    slug: 'ctr-calculator',
    title: 'Click-Through Rate (CTR) Calculator',
    desc: 'Calculate click-through rate for ads, emails, and organic search results.',
    cat: 'business', icon: '🖱️',
    fields: [
      { k: 'clicks', l: 'Total Clicks', p: '350', min: 0 },
      { k: 'impressions', l: 'Total Impressions / Opens', p: '15000', min: 1 },
    ],
    fn: (v) => {
      const ctr = (v.clicks / v.impressions) * 100
      const non_clicks = v.impressions - v.clicks
      return {
        primary: { value: parseFloat(ctr.toFixed(3)), label: 'Click-Through Rate (CTR)', fmt: 'pct' },
        details: [
          { l: 'Clicks', v: v.clicks, fmt: 'num' },
          { l: 'Non-Clicks', v: non_clicks, fmt: 'num' },
          { l: 'Impressions', v: v.impressions, fmt: 'num' },
        ],
        note: 'Average CTRs: Google Search ~5%, Google Display 0.1%, Email 2–3%, Facebook ~0.9%.',
      }
    },
    about: 'Google Search ads average CTR of about 5–6% for top positions; organic position 1 averages 28% CTR. Email marketing averages 2.3% CTR across all industries, with financial services at 3.5% and retail at 1.5%. CTR is a proxy for relevance and ad quality.',
    related: ['cpc-calculator', 'cpm-calculator', 'conversion-rate-calculator'],
  },
  {
    slug: 'roas-calculator',
    title: 'ROAS Calculator',
    desc: 'Calculate Return on Ad Spend and determine if campaigns are profitable.',
    cat: 'business', icon: '🎯',
    fields: [
      { k: 'revenue', l: 'Revenue from Ads', p: '25000', min: 0, u: 'USD' },
      { k: 'spend', l: 'Ad Spend', p: '5000', min: 0.01, u: 'USD' },
      { k: 'margin', l: 'Gross Margin %', p: '50', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const roas = v.revenue / v.spend
      const gross_profit = v.revenue * (v.margin / 100)
      const roi = ((gross_profit - v.spend) / v.spend) * 100
      const break_even_roas = 1 / (v.margin / 100)
      return {
        primary: { value: parseFloat(roas.toFixed(2)), label: 'ROAS (Return on Ad Spend)', fmt: 'num' },
        details: [
          { l: 'Gross Profit', v: parseFloat(gross_profit.toFixed(0)), fmt: 'usd' },
          { l: 'Net ROI after Ad Spend', v: parseFloat(roi.toFixed(2)), fmt: 'pct', color: roi >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Break-Even ROAS', v: parseFloat(break_even_roas.toFixed(2)), fmt: 'num' },
        ],
        note: 'ROAS of 4:1 means $4 revenue per $1 spent. With 50% margin, you need ROAS of 2:1 to break even.',
      }
    },
    about: 'A 4:1 ROAS (400%) is considered the benchmark for profitable paid advertising, but break-even ROAS depends on margins — a 30% margin business needs 3.3:1 ROAS minimum. Google\'s Target ROAS bidding strategy automatically adjusts bids to hit your ROAS target.',
    related: ['cpc-calculator', 'marketing-roi-calculator', 'conversion-rate-calculator'],
  },
  {
    slug: 'conversion-rate-calculator',
    title: 'Conversion Rate Calculator',
    desc: 'Calculate website or campaign conversion rate and potential revenue impact.',
    cat: 'business', icon: '🎯',
    fields: [
      { k: 'conversions', l: 'Number of Conversions', p: '120', min: 0 },
      { k: 'visitors', l: 'Total Visitors / Leads', p: '5000', min: 1 },
      { k: 'avg_value', l: 'Average Order Value', p: '150', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const cvr = (v.conversions / v.visitors) * 100
      const revenue = v.conversions * v.avg_value
      const revenue_per_visitor = revenue / v.visitors
      return {
        primary: { value: parseFloat(cvr.toFixed(3)), label: 'Conversion Rate', fmt: 'pct' },
        details: [
          { l: 'Total Revenue', v: parseFloat(revenue.toFixed(0)), fmt: 'usd' },
          { l: 'Revenue per Visitor', v: parseFloat(revenue_per_visitor.toFixed(2)), fmt: 'usd' },
          { l: 'Industry Benchmarks', v: 'Ecom: 1–4%, SaaS: 2–5%, Lead gen: 5–10%', fmt: 'txt' },
        ],
      }
    },
    about: 'The average e-commerce conversion rate is 2–4%. A 1% improvement in CVR on a site with 10,000 monthly visitors and $100 AOV generates $10,000 more monthly revenue — often more valuable than doubling traffic. CRO (Conversion Rate Optimization) is one of the highest-ROI marketing investments.',
    related: ['roas-calculator', 'cpc-calculator', 'average-order-value-calculator'],
  },
  {
    slug: 'average-order-value-calculator',
    title: 'Average Order Value (AOV) Calculator',
    desc: 'Calculate average order value and revenue impact of AOV improvements.',
    cat: 'business', icon: '🛒',
    fields: [
      { k: 'revenue', l: 'Total Revenue', p: '250000', min: 0, u: 'USD' },
      { k: 'orders', l: 'Total Number of Orders', p: '1250', min: 1 },
      { k: 'aov_increase', l: 'AOV Increase Target %', p: '10', min: 0, max: 200, u: '%' },
    ],
    fn: (v) => {
      const aov = v.revenue / v.orders
      const new_aov = aov * (1 + v.aov_increase / 100)
      const new_revenue = new_aov * v.orders
      const revenue_gain = new_revenue - v.revenue
      return {
        primary: { value: parseFloat(aov.toFixed(2)), label: 'Average Order Value', fmt: 'usd' },
        details: [
          { l: 'Revenue with Target AOV', v: parseFloat(new_revenue.toFixed(0)), fmt: 'usd' },
          { l: 'Additional Revenue from Increase', v: parseFloat(revenue_gain.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'New AOV Target', v: parseFloat(new_aov.toFixed(2)), fmt: 'usd' },
        ],
      }
    },
    about: 'AOV strategies include product bundling, cross-sells ("frequently bought together"), free shipping thresholds, and volume discounts. Amazon\'s "Frequently Bought Together" feature reportedly increased AOV by 20%+. A 10% AOV increase with flat traffic and conversion rates directly increases revenue by 10%.',
    related: ['conversion-rate-calculator', 'roas-calculator', 'gross-margin-calculator'],
  },
  {
    slug: 'burn-rate-calculator',
    title: 'Burn Rate Calculator',
    desc: 'Calculate monthly burn rate and runway for startups.',
    cat: 'business', icon: '🔥',
    fields: [
      { k: 'cash', l: 'Cash on Hand', p: '2000000', min: 0, u: 'USD' },
      { k: 'monthly_revenue', l: 'Monthly Revenue', p: '80000', min: 0, u: 'USD' },
      { k: 'monthly_expenses', l: 'Monthly Total Expenses', p: '200000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const net_burn = v.monthly_expenses - v.monthly_revenue
      const gross_burn = v.monthly_expenses
      const runway_months = net_burn > 0 ? v.cash / net_burn : 999
      return {
        primary: { value: net_burn <= 0 ? 0 : parseFloat(net_burn.toFixed(0)), label: 'Net Monthly Burn Rate', fmt: 'usd' },
        details: [
          { l: 'Gross Burn Rate', v: parseFloat(gross_burn.toFixed(0)), fmt: 'usd' },
          { l: 'Monthly Revenue', v: v.monthly_revenue, fmt: 'usd', color: 'var(--green)' },
          { l: 'Runway', v: runway_months >= 999 ? 'Profitable / Infinite' : `${parseFloat(runway_months.toFixed(1))} months`, fmt: 'txt', color: runway_months > 18 ? 'var(--green)' : runway_months > 9 ? '#fbbf24' : '#f87171' },
        ],
        note: 'VCs recommend 18+ months of runway before raising. Below 9 months triggers emergency mode.',
      }
    },
    about: 'Most VCs expect startups to maintain 18–24 months of runway. Y Combinator\'s advice is to "raise enough to be profitable" or at least extend runway to the next milestone. The 2022–2023 "winter" saw many startups with only 9–12 months of runway forced into emergency cost-cutting or down rounds.',
    related: ['runway-calculator', 'mrr-calculator', 'cac-calculator'],
  },
  {
    slug: 'runway-calculator',
    title: 'Startup Runway Calculator',
    desc: 'Calculate how many months of runway you have and what you need to extend it.',
    cat: 'business', icon: '✈️',
    fields: [
      { k: 'cash', l: 'Cash in Bank', p: '1500000', min: 0, u: 'USD' },
      { k: 'monthly_burn', l: 'Net Monthly Burn', p: '95000', min: 0.01, u: 'USD' },
    ],
    fn: (v) => {
      const months = v.cash / v.monthly_burn
      const to_18mo = v.monthly_burn * 18 - v.cash
      const to_24mo = v.monthly_burn * 24 - v.cash
      return {
        primary: { value: parseFloat(months.toFixed(1)), label: 'Months of Runway', fmt: 'num' },
        details: [
          { l: 'Additional Funding for 18 Months', v: parseFloat(Math.max(0, to_18mo).toFixed(0)), fmt: 'usd' },
          { l: 'Additional Funding for 24 Months', v: parseFloat(Math.max(0, to_24mo).toFixed(0)), fmt: 'usd' },
          { l: 'Annual Burn Rate', v: parseFloat((v.monthly_burn * 12).toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'Fundraising takes 3–6 months on average — so a company needs to start raising when they have at least 6 months remaining. The best time to raise is from a position of strength: 12–18 months of runway left. Attempting to raise with less than 3 months gives investors too much leverage.',
    related: ['burn-rate-calculator', 'mrr-calculator', 'arr-calculator'],
  },
  {
    slug: 'gross-margin-calculator',
    title: 'Gross Margin Calculator',
    desc: 'Calculate gross margin percentage for your business or product line.',
    cat: 'business', icon: '📊',
    fields: [
      { k: 'revenue', l: 'Revenue', p: '500000', min: 0.01, u: 'USD' },
      { k: 'cogs', l: 'Cost of Goods Sold', p: '200000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const gross_profit = v.revenue - v.cogs
      const margin = (gross_profit / v.revenue) * 100
      return {
        primary: { value: parseFloat(margin.toFixed(2)), label: 'Gross Margin', fmt: 'pct' },
        details: [
          { l: 'Gross Profit', v: parseFloat(gross_profit.toFixed(0)), fmt: 'usd' },
          { l: 'Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'COGS', v: v.cogs, fmt: 'usd' },
        ],
        note: 'SaaS median: 70–75%. E-commerce: 40–50%. Restaurants: 60–70%. Manufacturing: 25–40%.',
      }
    },
    about: 'Gross margin is the most fundamental profitability indicator — it shows how much of each revenue dollar remains after production costs. SaaS businesses achieve 70–80% margins because software has near-zero marginal delivery costs; physical product businesses face 30–50% typical margins.',
    related: ['net-margin-calculator', 'operating-margin-calculator', 'cogs-calculator'],
  },
  {
    slug: 'net-margin-calculator',
    title: 'Net Profit Margin Calculator',
    desc: 'Calculate net profit margin after all expenses and taxes.',
    cat: 'business', icon: '💹',
    fields: [
      { k: 'revenue', l: 'Total Revenue', p: '1000000', min: 0.01, u: 'USD' },
      { k: 'net_income', l: 'Net Income', p: '85000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const margin = (v.net_income / v.revenue) * 100
      let industry = 'Average (5–10%)'
      if (margin > 20) industry = 'Excellent (> 20%)'
      else if (margin > 15) industry = 'Strong (15–20%)'
      else if (margin < 5) industry = 'Thin (< 5%) — monitor expenses'
      return {
        primary: { value: parseFloat(margin.toFixed(2)), label: 'Net Profit Margin', fmt: 'pct' },
        details: [
          { l: 'Net Income', v: v.net_income, fmt: 'usd' },
          { l: 'Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'Assessment', v: industry, fmt: 'txt', color: margin > 15 ? 'var(--green)' : margin > 5 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'S&P 500 average net margin is 10–12%, but technology companies frequently exceed 25–30%. Apple\'s services segment runs 30%+ margins. Grocery chains like Kroger operate on 1–2% net margins. Net margin below 5% is common in capital-intensive and competitive industries.',
    related: ['gross-margin-calculator', 'operating-margin-calculator', 'ebitda-calculator'],
  },
  {
    slug: 'operating-margin-calculator',
    title: 'Operating Margin Calculator',
    desc: 'Calculate operating profit margin before interest and taxes.',
    cat: 'business', icon: '⚙️',
    fields: [
      { k: 'revenue', l: 'Revenue', p: '2000000', min: 0.01, u: 'USD' },
      { k: 'operating_income', l: 'Operating Income (EBIT)', p: '300000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const margin = (v.operating_income / v.revenue) * 100
      return {
        primary: { value: parseFloat(margin.toFixed(2)), label: 'Operating Margin', fmt: 'pct' },
        details: [
          { l: 'Operating Income', v: v.operating_income, fmt: 'usd' },
          { l: 'Revenue', v: v.revenue, fmt: 'usd' },
          { l: 'S&P 500 Median', v: '~15%', fmt: 'txt' },
        ],
      }
    },
    about: 'Operating margin measures core business profitability excluding financing decisions and taxes. Microsoft\'s operating margin exceeded 43% in 2023 after headcount reductions. Meta\'s operating margin rebounded from 20% to 40% after the 2023 "Year of Efficiency" that cut 20,000+ jobs.',
    related: ['gross-margin-calculator', 'net-margin-calculator', 'ebitda-calculator'],
  },
  {
    slug: 'cogs-calculator',
    title: 'COGS Calculator',
    desc: 'Calculate Cost of Goods Sold using beginning inventory, purchases, and ending inventory.',
    cat: 'business', icon: '📦',
    fields: [
      { k: 'beginning_inv', l: 'Beginning Inventory', p: '150000', min: 0, u: 'USD' },
      { k: 'purchases', l: 'Inventory Purchases', p: '600000', min: 0, u: 'USD' },
      { k: 'ending_inv', l: 'Ending Inventory', p: '180000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const cogs = v.beginning_inv + v.purchases - v.ending_inv
      return {
        primary: { value: parseFloat(cogs.toFixed(0)), label: 'Cost of Goods Sold', fmt: 'usd' },
        details: [
          { l: 'Beginning Inventory', v: v.beginning_inv, fmt: 'usd' },
          { l: 'Purchases', v: v.purchases, fmt: 'usd' },
          { l: 'Ending Inventory', v: v.ending_inv, fmt: 'usd' },
          { l: 'Inventory Turnover (approx)', v: parseFloat((cogs / ((v.beginning_inv + v.ending_inv) / 2)).toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'COGS = Beginning Inventory + Purchases − Ending Inventory. The accounting method (FIFO, LIFO, weighted average) affects the result — LIFO tends to produce higher COGS in inflationary periods, reducing taxable income but also reported profit. FIFO better reflects current inventory replacement cost.',
    related: ['gross-margin-calculator', 'inventory-cost-calculator', 'net-margin-calculator'],
  },
  {
    slug: 'inventory-cost-calculator',
    title: 'Inventory Cost Calculator',
    desc: 'Calculate total inventory cost including holding costs, ordering costs, and EOQ.',
    cat: 'business', icon: '📦',
    fields: [
      { k: 'annual_demand', l: 'Annual Demand (units)', p: '5000', min: 1 },
      { k: 'unit_cost', l: 'Unit Cost', p: '25', min: 0, u: 'USD' },
      { k: 'holding_pct', l: 'Annual Holding Cost % of Unit Cost', p: '20', min: 0, max: 100, u: '%' },
      { k: 'order_cost', l: 'Cost per Order', p: '100', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      // Economic Order Quantity
      const eoq = Math.sqrt((2 * v.annual_demand * v.order_cost) / (v.unit_cost * v.holding_pct / 100))
      const orders_per_year = v.annual_demand / eoq
      const total_holding = (eoq / 2) * v.unit_cost * (v.holding_pct / 100)
      const total_ordering = orders_per_year * v.order_cost
      const total_cost = total_holding + total_ordering
      return {
        primary: { value: parseFloat(eoq.toFixed(0)), label: 'Economic Order Quantity (units)', fmt: 'num' },
        details: [
          { l: 'Orders per Year', v: parseFloat(orders_per_year.toFixed(1)), fmt: 'num' },
          { l: 'Annual Holding Cost', v: parseFloat(total_holding.toFixed(0)), fmt: 'usd' },
          { l: 'Annual Ordering Cost', v: parseFloat(total_ordering.toFixed(0)), fmt: 'usd' },
          { l: 'Total Inventory Cost', v: parseFloat(total_cost.toFixed(0)), fmt: 'usd' },
        ],
      }
    },
    about: 'The Economic Order Quantity (EOQ) formula minimizes total inventory costs by balancing ordering costs (lower with fewer, larger orders) against holding costs (lower with more frequent, smaller orders). Toyota\'s Just-In-Time system pushed EOQ logic to its limit, effectively ordering one unit at a time.',
    related: ['cogs-calculator', 'inventory-turnover-calculator', 'gross-margin-calculator'],
  },
  {
    slug: 'marketing-roi-calculator',
    title: 'Marketing ROI Calculator',
    desc: 'Calculate the return on investment of your marketing campaigns.',
    cat: 'business', icon: '📣',
    fields: [
      { k: 'revenue', l: 'Revenue Attributed to Marketing', p: '200000', min: 0, u: 'USD' },
      { k: 'cost', l: 'Marketing Spend', p: '30000', min: 0.01, u: 'USD' },
      { k: 'cogs_pct', l: 'COGS % of Revenue', p: '40', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const gross_profit = v.revenue * (1 - v.cogs_pct / 100)
      const roi = ((gross_profit - v.cost) / v.cost) * 100
      const simple_roi = ((v.revenue - v.cost) / v.cost) * 100
      return {
        primary: { value: parseFloat(roi.toFixed(2)), label: 'Marketing ROI (on gross profit)', fmt: 'pct' },
        details: [
          { l: 'Gross Profit', v: parseFloat(gross_profit.toFixed(0)), fmt: 'usd' },
          { l: 'Net Profit from Marketing', v: parseFloat((gross_profit - v.cost).toFixed(0)), fmt: 'usd', color: gross_profit > v.cost ? 'var(--green)' : '#f87171' },
          { l: 'Revenue ROI (simple)', v: parseFloat(simple_roi.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Marketing ROI should always use gross profit, not revenue — a 5:1 revenue ROI with 30% margins is actually a 2:1 gross profit ROI, barely profitable. The Content Marketing Institute reports content marketing average ROI of 6:1 for established programs.',
    related: ['roas-calculator', 'cac-calculator', 'conversion-rate-calculator'],
  },
  {
    slug: 'employee-cost-calculator',
    title: 'Total Employee Cost Calculator',
    desc: 'Calculate the true total cost of an employee beyond base salary.',
    cat: 'business', icon: '👤',
    fields: [
      { k: 'salary', l: 'Annual Salary', p: '75000', min: 0, u: 'USD' },
      { k: 'benefits_pct', l: 'Benefits as % of Salary', p: '25', min: 0, max: 100, u: '%' },
      { k: 'overhead_pct', l: 'Overhead & Tools %', p: '15', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const fica = v.salary * 0.0765 // employer FICA
      const benefits = v.salary * (v.benefits_pct / 100)
      const overhead = v.salary * (v.overhead_pct / 100)
      const total = v.salary + fica + benefits + overhead
      const multiplier = total / v.salary
      return {
        primary: { value: parseFloat(total.toFixed(0)), label: 'Total Annual Employee Cost', fmt: 'usd' },
        details: [
          { l: 'Base Salary', v: v.salary, fmt: 'usd' },
          { l: 'Employer FICA (7.65%)', v: parseFloat(fica.toFixed(0)), fmt: 'usd' },
          { l: 'Benefits', v: parseFloat(benefits.toFixed(0)), fmt: 'usd' },
          { l: 'Overhead & Tools', v: parseFloat(overhead.toFixed(0)), fmt: 'usd' },
          { l: 'Cost Multiplier', v: parseFloat(multiplier.toFixed(2)), fmt: 'num' },
        ],
        note: 'The "1.25–1.4x salary" rule of thumb underestimates true cost for companies with strong benefits.',
      }
    },
    about: 'Total employee cost typically runs 1.25–1.5× base salary including taxes, benefits, and overhead. A $75,000 employee costs $95,000–$112,000 all-in. Contractors cost more per hour but avoid benefits and employment taxes — the break-even depends on hours worked and project duration.',
    related: ['payroll-tax-calculator', 'cost-per-hire-calculator', 'revenue-per-employee-calculator'],
  },
  {
    slug: 'cost-per-hire-calculator',
    title: 'Cost Per Hire Calculator',
    desc: 'Calculate the total cost to recruit and onboard a new employee.',
    cat: 'business', icon: '🤝',
    fields: [
      { k: 'internal_costs', l: 'Internal Recruiting Costs (HR time, etc.)', p: '3000', min: 0, u: 'USD' },
      { k: 'external_costs', l: 'External Costs (job boards, agencies)', p: '5000', min: 0, u: 'USD' },
      { k: 'onboarding', l: 'Onboarding & Training Costs', p: '4000', min: 0, u: 'USD' },
      { k: 'hires', l: 'Number of Hires', p: '5', min: 1 },
    ],
    fn: (v) => {
      const total = v.internal_costs + v.external_costs + v.onboarding
      const per_hire = total / v.hires
      return {
        primary: { value: parseFloat(per_hire.toFixed(0)), label: 'Cost Per Hire', fmt: 'usd' },
        details: [
          { l: 'Total Recruiting Cost', v: parseFloat(total.toFixed(0)), fmt: 'usd' },
          { l: 'SHRM Average (all industries)', v: 4683, fmt: 'usd' },
          { l: 'Enterprise Average', v: 28000, fmt: 'usd' },
        ],
        note: 'SHRM reports average cost per hire is $4,683. Leadership positions average $14,936+.',
      }
    },
    about: 'SHRM data shows average cost per hire of $4,683, but the real cost when including lost productivity during vacancies and ramp-up time can be 1–2× annual salary for senior roles. Companies with strong employer brands (Google, Apple) spend significantly less per hire due to lower sourcing costs.',
    related: ['employee-cost-calculator', 'revenue-per-employee-calculator', 'productivity-calculator'],
  },
  {
    slug: 'revenue-per-employee-calculator',
    title: 'Revenue Per Employee Calculator',
    desc: 'Calculate revenue per employee to benchmark organizational productivity.',
    cat: 'business', icon: '👥',
    fields: [
      { k: 'annual_revenue', l: 'Annual Revenue', p: '5000000', min: 0, u: 'USD' },
      { k: 'employees', l: 'Full-Time Equivalent Employees', p: '25', min: 1 },
    ],
    fn: (v) => {
      const rpe = v.annual_revenue / v.employees
      return {
        primary: { value: parseFloat(rpe.toFixed(0)), label: 'Revenue per Employee', fmt: 'usd' },
        details: [
          { l: 'Total Revenue', v: v.annual_revenue, fmt: 'usd' },
          { l: 'Employee Count', v: v.employees, fmt: 'num' },
          { l: 'Apple benchmark', v: 2100000, fmt: 'usd' },
          { l: 'S&P 500 Median', v: 450000, fmt: 'usd' },
        ],
        note: 'Tech companies lead: Apple ~$2.1M/employee, Google ~$1.4M. Retail and manufacturing are lower ($150–$300k).',
      }
    },
    about: 'Revenue per employee is a productivity metric that reveals operational efficiency. Apple consistently generates over $2 million revenue per employee — exceptional even among tech. High-margin SaaS companies can exceed $500,000/employee with small teams. Manufacturing averages $150,000–$250,000.',
    related: ['employee-cost-calculator', 'cost-per-hire-calculator', 'gross-margin-calculator'],
  },
  {
    slug: 'break-even-units-calculator',
    title: 'Break-Even Units Calculator',
    desc: 'Calculate units needed to sell to cover all fixed and variable costs.',
    cat: 'business', icon: '📊',
    fields: [
      { k: 'fixed_costs', l: 'Total Fixed Costs', p: '50000', min: 0, u: 'USD' },
      { k: 'price', l: 'Selling Price per Unit', p: '80', min: 0.01, u: 'USD' },
      { k: 'variable_cost', l: 'Variable Cost per Unit', p: '35', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const contribution = v.price - v.variable_cost
      if (contribution <= 0) throw new Error('Price must exceed variable cost.')
      const units = v.fixed_costs / contribution
      const revenue = units * v.price
      const margin_pct = (contribution / v.price) * 100
      return {
        primary: { value: parseFloat(units.toFixed(0)), label: 'Break-Even Units', fmt: 'num' },
        details: [
          { l: 'Break-Even Revenue', v: parseFloat(revenue.toFixed(0)), fmt: 'usd' },
          { l: 'Contribution Margin', v: parseFloat(contribution.toFixed(2)), fmt: 'usd' },
          { l: 'Contribution Margin %', v: parseFloat(margin_pct.toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Break-even analysis is the first step in pricing and business viability assessment. A business with $50,000 monthly fixed costs and $45 contribution margin per unit needs 1,112 units to break even — and every unit above that generates $45 in profit.',
    related: ['gross-margin-calculator', 'cogs-calculator', 'burn-rate-calculator'],
  },
  {
    slug: 'nrr-calculator',
    title: 'Net Revenue Retention (NRR) Calculator',
    desc: 'Calculate NRR to measure expansion and contraction in your existing customer base.',
    cat: 'business', icon: '📈',
    fields: [
      { k: 'starting_mrr', l: 'Starting MRR (from existing customers)', p: '100000', min: 0, u: 'USD' },
      { k: 'expansion_mrr', l: 'Expansion MRR (upsells/cross-sells)', p: '15000', min: 0, u: 'USD' },
      { k: 'contraction_mrr', l: 'Contraction MRR (downgrades)', p: '3000', min: 0, u: 'USD' },
      { k: 'churned_mrr', l: 'Churned MRR', p: '5000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const ending_mrr = v.starting_mrr + v.expansion_mrr - v.contraction_mrr - v.churned_mrr
      const nrr = (ending_mrr / v.starting_mrr) * 100
      return {
        primary: { value: parseFloat(nrr.toFixed(2)), label: 'Net Revenue Retention (NRR)', fmt: 'pct' },
        details: [
          { l: 'Ending MRR', v: parseFloat(ending_mrr.toFixed(0)), fmt: 'usd' },
          { l: 'Expansion MRR', v: v.expansion_mrr, fmt: 'usd', color: 'var(--green)' },
          { l: 'Churned + Contracted MRR', v: v.churned_mrr + v.contraction_mrr, fmt: 'usd', color: '#f87171' },
          { l: 'Status', v: nrr >= 110 ? 'Best-in-Class (≥ 110%)' : nrr >= 100 ? 'Healthy (100–110%)' : 'Needs Improvement (< 100%)', fmt: 'txt', color: nrr >= 110 ? 'var(--green)' : nrr >= 100 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'NRR above 100% means existing customers alone drive growth — a business with 120% NRR would grow 20% even with zero new customers. Best-in-class SaaS companies like Snowflake, Twilio, and Datadog achieved 130%+ NRR during hyper-growth periods. Below 100% means the business is leaking revenue faster than it can retain it.',
    related: ['churn-rate-calculator', 'mrr-calculator', 'ltv-calculator'],
  },
  {
    slug: 'saas-quick-ratio-calculator',
    title: 'SaaS Quick Ratio Calculator',
    desc: 'Calculate the SaaS Quick Ratio to measure growth efficiency.',
    cat: 'business', icon: '⚡',
    fields: [
      { k: 'new_mrr', l: 'New MRR', p: '40000', min: 0, u: 'USD' },
      { k: 'expansion_mrr', l: 'Expansion MRR', p: '15000', min: 0, u: 'USD' },
      { k: 'contraction_mrr', l: 'Contraction MRR', p: '5000', min: 0, u: 'USD' },
      { k: 'churned_mrr', l: 'Churned MRR', p: '10000', min: 0, u: 'USD' },
    ],
    fn: (v) => {
      const gains = v.new_mrr + v.expansion_mrr
      const losses = v.contraction_mrr + v.churned_mrr
      if (losses === 0) throw new Error('Losses cannot be zero.')
      const quick_ratio = gains / losses
      let assessment = 'Excellent (> 4)'
      if (quick_ratio < 1) assessment = 'Declining — losing more than gaining'
      else if (quick_ratio < 2) assessment = 'Poor (< 2)'
      else if (quick_ratio < 4) assessment = 'Acceptable (2–4)'
      return {
        primary: { value: parseFloat(quick_ratio.toFixed(2)), label: 'SaaS Quick Ratio', fmt: 'num' },
        details: [
          { l: 'New + Expansion MRR', v: gains, fmt: 'usd', color: 'var(--green)' },
          { l: 'Churned + Contracted MRR', v: losses, fmt: 'usd', color: '#f87171' },
          { l: 'Assessment', v: assessment, fmt: 'txt', color: quick_ratio >= 4 ? 'var(--green)' : quick_ratio >= 2 ? '#fbbf24' : '#f87171' },
        ],
        note: 'Mamoon Hamid popularized the SaaS Quick Ratio. A ratio > 4 signals efficient, sustainable growth.',
      }
    },
    about: 'The SaaS Quick Ratio divides revenue gains (new + expansion MRR) by revenue losses (churn + contraction). A ratio above 4 indicates healthy growth efficiency. Below 2 suggests the business is burning growth capital to offset leaky retention. Stripe\'s early growth reportedly showed ratios above 5.',
    related: ['nrr-calculator', 'churn-rate-calculator', 'mrr-calculator'],
  },
  {
    slug: 'email-list-growth-calculator',
    title: 'Email List Growth Calculator',
    desc: 'Project your email list size based on current growth and churn rates.',
    cat: 'business', icon: '📧',
    fields: [
      { k: 'current_size', l: 'Current List Size', p: '5000', min: 0 },
      { k: 'monthly_adds', l: 'Monthly New Subscribers', p: '300', min: 0 },
      { k: 'monthly_unsub', l: 'Monthly Unsubscribes', p: '75', min: 0 },
      { k: 'months', l: 'Projection Period', p: '12', min: 1, u: 'months' },
    ],
    fn: (v) => {
      const net_growth = v.monthly_adds - v.monthly_unsub
      const final_size = v.current_size + net_growth * v.months
      const growth_rate = v.current_size > 0 ? (net_growth / v.current_size) * 100 : 0
      const unsub_rate = v.monthly_adds > 0 ? (v.monthly_unsub / v.monthly_adds) * 100 : 0
      return {
        primary: { value: parseFloat(final_size.toFixed(0)), label: `List Size in ${v.months} Months`, fmt: 'num' },
        details: [
          { l: 'Net Monthly Growth', v: net_growth, fmt: 'num', color: net_growth >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Monthly Growth Rate', v: parseFloat(growth_rate.toFixed(2)), fmt: 'pct' },
          { l: 'Unsubscribe Rate (of new)', v: parseFloat(unsub_rate.toFixed(1)), fmt: 'pct' },
        ],
      }
    },
    about: 'Email lists decay at roughly 22% annually due to unsubscribes, bounces, and list fatigue. A 25,000-person list decays to about 19,500 after a year without adding new subscribers. Average email marketing ROI is $36 per dollar spent — one of the highest in digital marketing.',
    related: ['conversion-rate-calculator', 'ctr-calculator', 'marketing-roi-calculator'],
  },
  {
    slug: 'nps-score-calculator',
    title: 'Net Promoter Score (NPS) Calculator',
    desc: 'Calculate your Net Promoter Score from survey responses.',
    cat: 'business', icon: '😊',
    fields: [
      { k: 'promoters', l: 'Promoters (scored 9–10)', p: '65', min: 0 },
      { k: 'passives', l: 'Passives (scored 7–8)', p: '25', min: 0 },
      { k: 'detractors', l: 'Detractors (scored 0–6)', p: '10', min: 0 },
    ],
    fn: (v) => {
      const total = v.promoters + v.passives + v.detractors
      if (total === 0) throw new Error('Total respondents cannot be zero.')
      const promoter_pct = (v.promoters / total) * 100
      const detractor_pct = (v.detractors / total) * 100
      const nps = promoter_pct - detractor_pct
      let rating = 'Excellent (> 50)'
      if (nps < 0) rating = 'Poor — more detractors than promoters'
      else if (nps < 20) rating = 'Fair (0–20)'
      else if (nps < 50) rating = 'Good (20–50)'
      return {
        primary: { value: parseFloat(nps.toFixed(1)), label: 'Net Promoter Score (NPS)', fmt: 'num' },
        details: [
          { l: 'Promoters %', v: parseFloat(promoter_pct.toFixed(1)), fmt: 'pct', color: 'var(--green)' },
          { l: 'Passives %', v: parseFloat(((v.passives / total) * 100).toFixed(1)), fmt: 'pct' },
          { l: 'Detractors %', v: parseFloat(detractor_pct.toFixed(1)), fmt: 'pct', color: '#f87171' },
          { l: 'Rating', v: rating, fmt: 'txt', color: nps >= 50 ? 'var(--green)' : nps >= 0 ? '#fbbf24' : '#f87171' },
        ],
      }
    },
    about: 'NPS was developed by Bain\'s Fred Reichheld and published in a 2003 Harvard Business Review article. Apple\'s NPS consistently exceeds 70; Tesla topped 90 in 2021. Industry averages: Software 40–50, Financial Services 35–40, Airlines 25–30. Below 0 means your detractors outnumber promoters.',
    related: ['churn-rate-calculator', 'ltv-calculator', 'conversion-rate-calculator'],
  },
  {
    slug: 'total-addressable-market-calculator',
    title: 'Total Addressable Market (TAM) Calculator',
    desc: 'Calculate TAM, SAM, and SOM for your business opportunity.',
    cat: 'business', icon: '🌍',
    fields: [
      { k: 'total_market', l: 'Total Market Revenue', p: '50000000000', min: 0, u: 'USD' },
      { k: 'addressable_pct', l: 'Serviceable Addressable % (SAM)', p: '15', min: 0, max: 100, u: '%' },
      { k: 'obtainable_pct', l: 'Serviceable Obtainable % (SOM)', p: '5', min: 0, max: 100, u: '%' },
    ],
    fn: (v) => {
      const tam = v.total_market
      const sam = tam * (v.addressable_pct / 100)
      const som = sam * (v.obtainable_pct / 100)
      return {
        primary: { value: parseFloat(tam.toFixed(0)), label: 'Total Addressable Market (TAM)', fmt: 'usd' },
        details: [
          { l: 'Serviceable Addressable Market (SAM)', v: parseFloat(sam.toFixed(0)), fmt: 'usd' },
          { l: 'Serviceable Obtainable Market (SOM)', v: parseFloat(som.toFixed(0)), fmt: 'usd', color: 'var(--green)' },
          { l: 'SOM as % of TAM', v: parseFloat(((som / tam) * 100).toFixed(3)), fmt: 'pct' },
        ],
        note: 'Investors focus on SAM and SOM — TAM alone is meaningless without a realistic capture strategy.',
      }
    },
    about: 'TAM, SAM, and SOM are the market sizing framework taught in every MBA program. Airbnb\'s original pitch deck estimated the US hotel TAM at $20 billion. Investors look for $1B+ TAM markets for venture investment — but a realistic SOM of $50–$100M in 5 years is what actually matters.',
    related: ['burn-rate-calculator', 'revenue-per-employee-calculator', 'ltv-calculator'],
  },
]
