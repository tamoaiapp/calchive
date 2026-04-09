export interface GuideContent {
  slug: string
  title: string
  description: string
  category: string
  keyFact: string
  sections: Array<{ heading: string; body: string }>
  relatedLinks: Array<{ title: string; href: string; icon?: string }>
}

export const GUIDE_SLUGS: string[] = [
  // Budgeting
  '50-30-20-rule',
  'zero-based-budgeting',
  'envelope-budgeting',
  'how-to-make-a-budget',
  'how-to-track-spending',
  'how-to-save-money-fast',
  // Banking
  'best-high-yield-savings-accounts',
  'how-cd-ladders-work',
  'money-market-vs-savings',
  'checking-account-fees-guide',
  'how-wire-transfers-work',
  'how-ach-transfers-work',
  // Investing
  'index-funds-guide',
  'etf-vs-mutual-fund',
  'dollar-cost-averaging-guide',
  'dividend-investing-guide',
  'value-investing-guide',
  'growth-investing-guide',
  'rebalancing-portfolio-guide',
  'how-to-open-brokerage-account',
  'how-stock-market-works',
  'bonds-explained',
  'real-estate-investing-guide',
  'reits-explained',
  // Crypto
  'bitcoin-investing-guide',
  'crypto-taxes-guide',
  'defi-explained',
  'nft-guide',
  'crypto-staking-guide',
  'cold-wallet-guide',
  // Small Business
  'how-to-start-llc',
  'llc-vs-corporation',
  'how-to-pay-yourself-llc',
  'small-business-banking-guide',
  'business-credit-card-guide',
  'invoicing-guide',
  'accounts-receivable-guide',
  'small-business-bookkeeping-guide',
  'payroll-guide-small-business',
  'small-business-retirement-plan-guide',
  // Real Estate
  'how-to-invest-in-real-estate',
  'rental-property-guide',
  'airbnb-guide',
  'house-hacking-guide',
  'real-estate-syndication-guide',
  // Legal/Estate
  'how-to-write-a-will',
  'trust-vs-will',
  'power-of-attorney-guide',
  'estate-planning-basics',
  'inheritance-tax-guide',
  'beneficiary-designation-guide',
  // Insurance (general)
  'how-insurance-works',
  'insurance-deductible-vs-premium',
  'liability-insurance-guide',
  // Kids/Family
  '529-plan-guide',
  'custodial-account-guide',
  'teaching-kids-about-money',
  'college-savings-strategies',
  'fafsa-guide',
  // Side Hustles
  'freelancing-taxes-guide',
  'dropshipping-guide',
  'affiliate-marketing-guide',
  'youtube-monetization-guide',
  'selling-on-amazon-guide',
  'etsy-shop-guide',
  'online-tutoring-guide',
  'virtual-assistant-guide',
]

// ─── Categories ───────────────────────────────────────────────────────────────
export const GUIDE_CATEGORIES: Record<string, string[]> = {
  Budgeting: ['50-30-20-rule', 'zero-based-budgeting', 'envelope-budgeting', 'how-to-make-a-budget', 'how-to-track-spending', 'how-to-save-money-fast'],
  Banking: ['best-high-yield-savings-accounts', 'how-cd-ladders-work', 'money-market-vs-savings', 'checking-account-fees-guide', 'how-wire-transfers-work', 'how-ach-transfers-work'],
  Investing: ['index-funds-guide', 'etf-vs-mutual-fund', 'dollar-cost-averaging-guide', 'dividend-investing-guide', 'value-investing-guide', 'growth-investing-guide', 'rebalancing-portfolio-guide', 'how-to-open-brokerage-account', 'how-stock-market-works', 'bonds-explained', 'real-estate-investing-guide', 'reits-explained'],
  Crypto: ['bitcoin-investing-guide', 'crypto-taxes-guide', 'defi-explained', 'nft-guide', 'crypto-staking-guide', 'cold-wallet-guide'],
  'Small Business': ['how-to-start-llc', 'llc-vs-corporation', 'how-to-pay-yourself-llc', 'small-business-banking-guide', 'business-credit-card-guide', 'invoicing-guide', 'accounts-receivable-guide', 'small-business-bookkeeping-guide', 'payroll-guide-small-business', 'small-business-retirement-plan-guide'],
  'Real Estate': ['how-to-invest-in-real-estate', 'rental-property-guide', 'airbnb-guide', 'house-hacking-guide', 'real-estate-syndication-guide'],
  'Legal & Estate': ['how-to-write-a-will', 'trust-vs-will', 'power-of-attorney-guide', 'estate-planning-basics', 'inheritance-tax-guide', 'beneficiary-designation-guide'],
  Insurance: ['how-insurance-works', 'insurance-deductible-vs-premium', 'liability-insurance-guide'],
  'Kids & Family': ['529-plan-guide', 'custodial-account-guide', 'teaching-kids-about-money', 'college-savings-strategies', 'fafsa-guide'],
  'Side Hustles': ['freelancing-taxes-guide', 'dropshipping-guide', 'affiliate-marketing-guide', 'youtube-monetization-guide', 'selling-on-amazon-guide', 'etsy-shop-guide', 'online-tutoring-guide', 'virtual-assistant-guide'],
}

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/\bVs\b/g, 'vs')
    .replace(/\bLlc\b/g, 'LLC')
    .replace(/\bEtf\b/g, 'ETF')
    .replace(/\bCd\b/g, 'CD')
    .replace(/\bAch\b/g, 'ACH')
    .replace(/\bIra\b/g, 'IRA')
    .replace(/\bNft\b/g, 'NFT')
    .replace(/\bDefi\b/g, 'DeFi')
    .replace(/\b529\b/, '529')
    .replace(/\bFafsa\b/g, 'FAFSA')
    .replace(/\bPmi\b/g, 'PMI')
    .replace(/\bAirbnb\b/g, 'Airbnb')
}

// ─── Content database ─────────────────────────────────────────────────────────
const GUIDE_CONTENT_MAP: Record<string, GuideContent> = {
  '50-30-20-rule': {
    slug: '50-30-20-rule',
    title: '50/30/20 Rule: The Simplest Budget That Actually Works',
    description: 'The 50/30/20 rule splits your after-tax income into needs (50%), wants (30%), and savings (20%). Here\'s how to apply it to any income.',
    category: 'Budgeting',
    keyFact: 'On a $60,000 after-tax income: $30,000 for needs, $18,000 for wants, $12,000 for savings and debt',
    sections: [
      {
        heading: 'What the 50/30/20 Rule Is',
        body: 'Popularized by Senator Elizabeth Warren in "All Your Worth" (2005), the 50/30/20 rule divides take-home pay into three buckets. Needs are non-negotiable: rent, utilities, groceries, minimum debt payments, insurance. Wants are discretionary: restaurants, streaming, vacations, hobbies. The 20% goes to savings, emergency fund, and extra debt payments.',
      },
      {
        heading: 'The Math by Income Level',
        body: 'At $40,000 take-home: $20,000 needs / $12,000 wants / $8,000 savings. At $75,000: $37,500 / $22,500 / $15,000. At $100,000: $50,000 / $30,000 / $20,000. High cost-of-living cities often push needs above 50% — in that case, shrink wants first, not savings.',
      },
      {
        heading: 'When 50/30/20 Falls Short',
        body: 'High-debt households should redirect the wants category toward debt payoff until high-interest debt is eliminated. Single-income earners in expensive metros often can\'t hit 20% savings without a side income or relocating. The rule works best as a starting framework, not an ironclad rule.',
      },
      {
        heading: 'How to Track It',
        body: 'Link bank and credit card accounts to a budgeting app. Review weekly for the first 3 months. Most people discover they spend 35–40% on wants, not 30% — the exercise of measuring is half the value.',
      },
    ],
    relatedLinks: [
      { title: 'Budget Calculator', href: '/calculator/budget-calculator', icon: '💰' },
      { title: 'Savings Rate Calculator', href: '/calculator/savings-rate-calculator', icon: '📊' },
      { title: 'Emergency Fund Calculator', href: '/calculator/emergency-fund-calculator', icon: '🏦' },
    ],
  },
  'index-funds-guide': {
    slug: 'index-funds-guide',
    title: 'Index Funds: The Evidence-Based Way to Build Wealth',
    description: 'Index funds track a market index like the S&P 500, giving instant diversification at minimal cost. Over 20 years, 90%+ of actively managed funds underperform a simple index fund.',
    category: 'Investing',
    keyFact: 'The S&P 500 has returned an average of 10.7% annually since 1957, before inflation',
    sections: [
      {
        heading: 'What Index Funds Actually Do',
        body: 'An index fund buys every stock in an index — the S&P 500 index fund owns all 500 companies, weighted by market cap. When Apple is 7% of the S&P 500, 7 cents of every dollar you invest goes to Apple. No stock picking, no manager discretion, just the market.',
      },
      {
        heading: 'The Cost Advantage',
        body: 'Vanguard\'s VTSAX charges 0.04% annually. A typical actively managed fund charges 0.65–1.0%. On $100,000 over 30 years at 8% returns, that expense ratio gap costs $84,000 in lost compounding. The math explains why Warren Buffett has repeatedly told his estate to put 90% in a low-cost S&P 500 index fund.',
      },
      {
        heading: 'Which Index Fund to Choose',
        body: 'For US exposure: VTSAX (Vanguard Total Stock Market), FSKAX (Fidelity), or SWTSX (Schwab). For the S&P 500 specifically: VOO, IVV, or SPY. For global diversification: VT (Vanguard Total World). For bonds: BND. For most investors, VTSAX + a target-date fund does the job.',
      },
      {
        heading: 'The Real Risk',
        body: 'Index funds drop when markets drop — 2022 saw the S&P 500 fall 19.4%. The risk is behavioral: investors who panic-sell lock in losses. The S&P 500 has recovered from every crash in history. Time horizon matters: index funds are for 10+ year money, not next year\'s car purchase.',
      },
    ],
    relatedLinks: [
      { title: 'Investment Returns Calculator', href: '/calculator/investment-return-calculator', icon: '📈' },
      { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '💹' },
      { title: 'Retirement Savings Calculator', href: '/calculator/retirement-savings-calculator', icon: '🏦' },
    ],
  },
  'how-to-start-llc': {
    slug: 'how-to-start-llc',
    title: 'How to Start an LLC in 2025: Step-by-Step (All 50 States)',
    description: 'Forming an LLC costs $50–$500 depending on state, takes 1–4 weeks, and protects personal assets from business debts. Here\'s the exact process.',
    category: 'Small Business',
    keyFact: 'Wyoming and Delaware are the most popular states for LLC formation: Wyoming charges just $102/year, Delaware $300',
    sections: [
      {
        heading: 'Choose a State to Form In',
        body: 'Most small businesses should form in their home state — despite what you\'ve heard about Delaware and Wyoming. Out-of-state LLCs still pay "foreign registration" fees in the state where they do business. Delaware makes sense for venture-backed companies expecting investors. Wyoming is worth it for holding companies or privacy.',
      },
      {
        heading: 'Pick a Name and Check Availability',
        body: 'Your name must include "LLC," "L.L.C.," or "Limited Liability Company." Check availability on your state\'s Secretary of State website — most have free search tools. Also search the USPTO trademark database if you plan to go national. Reserve the domain and social handles before filing.',
      },
      {
        heading: 'File Articles of Organization',
        body: 'File with your state\'s Secretary of State (sometimes called "Certificate of Organization"). Cost: $50 (Kentucky) to $500 (Massachusetts). Most states process in 1–2 weeks; expedite for $50–$200. Provide: LLC name, registered agent name/address, member names (some states), and business purpose.',
      },
      {
        heading: 'Get a Registered Agent',
        body: 'Every LLC needs a registered agent — someone available during business hours to receive legal documents. You can be your own registered agent (free), or hire a service like Northwest Registered Agent ($125/year) or ZenBusiness ($199/year). Services keep your home address off public records.',
      },
      {
        heading: 'Get Your EIN and Open a Business Account',
        body: 'Apply for an EIN at IRS.gov — free, takes 5 minutes, issued immediately. Then open a dedicated business checking account. Mixing personal and business funds is the #1 way to lose LLC liability protection ("piercing the corporate veil").',
      },
    ],
    relatedLinks: [
      { title: 'Self-Employment Tax Calculator', href: '/calculator/self-employment-tax-calculator', icon: '🧾' },
      { title: 'Business Profit Calculator', href: '/calculator/profit-margin-calculator', icon: '💰' },
      { title: 'Salary vs Dividend Calculator', href: '/calculator/salary-vs-dividend', icon: '📊' },
    ],
  },
  '529-plan-guide': {
    slug: '529-plan-guide',
    title: '529 Plan Guide: Tax-Free College Savings Explained',
    description: 'A 529 plan grows tax-free and withdrawals are tax-free for education expenses. In 2025, you can contribute up to $18,000/year per beneficiary without gift tax.',
    category: 'Kids & Family',
    keyFact: 'Investing $200/month from birth to 18 in a 529 at 7% growth = ~$82,000 for college',
    sections: [
      {
        heading: 'How 529 Plans Work',
        body: 'A 529 is a state-sponsored investment account for education. Contributions are after-tax, but growth and withdrawals for qualifying expenses are federal tax-free. Most states also offer a state tax deduction: 34 states give a deduction or credit for contributions. Qualifying expenses include tuition, books, housing, and as of 2024, K-12 tuition up to $10,000/year.',
      },
      {
        heading: 'Contribution Limits and Gift Tax',
        body: '529s have no annual contribution limit, but contributions above $18,000 (2025 gift tax annual exclusion) per person/per beneficiary count against your lifetime gift exclusion. "Superfunding" lets you front-load 5 years of gifts at once ($90,000) in a single year without gift tax. Total account balances above $550,000+ may trigger issues in some states.',
      },
      {
        heading: 'Choosing a Plan',
        body: 'You can use any state\'s 529, not just your home state\'s. Compare on investment options, fees, and tax benefits. Utah, New York, and Nevada consistently rank as top plans for non-residents. If your state offers a generous deduction, use your state\'s plan first — then consider opening a second account in a higher-rated plan.',
      },
      {
        heading: 'What If the Child Doesn\'t Go to College?',
        body: 'Since 2024 (SECURE 2.0), unused 529 funds can roll into a Roth IRA for the beneficiary (up to $35,000 lifetime, subject to annual Roth limits). You can also change the beneficiary to a sibling, cousin, or even yourself. Non-qualified withdrawals pay income tax + 10% penalty on earnings only — not contributions.',
      },
    ],
    relatedLinks: [
      { title: 'College Savings Calculator', href: '/calculator/college-savings-calculator', icon: '🎓' },
      { title: 'Investment Returns Calculator', href: '/calculator/investment-return-calculator', icon: '📈' },
      { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '💹' },
    ],
  },
  'how-insurance-works': {
    slug: 'how-insurance-works',
    title: 'How Insurance Works: Premiums, Deductibles, and Claims Explained',
    description: 'Insurance transfers financial risk from individuals to a large pool. Understanding the core mechanics — premium, deductible, copay, out-of-pocket max — prevents costly surprises.',
    category: 'Insurance',
    keyFact: 'Americans spend an average of $22,000/year on all insurance combined (auto, home, health, life)',
    sections: [
      {
        heading: 'The Core Mechanics',
        body: 'You pay a premium (monthly or annually) to transfer risk to an insurer. When a covered loss occurs, you file a claim. The deductible is the amount you pay first before insurance kicks in. After the deductible, you may pay a coinsurance percentage until you hit the out-of-pocket maximum — after which insurance covers 100%.',
      },
      {
        heading: 'Deductible vs Premium Tradeoff',
        body: 'Higher deductibles lower your premium, lower deductibles raise it. A $1,000 auto deductible vs $500 typically saves $200–400/year in premiums. If you go 3+ years without a claim, the higher deductible wins mathematically. The right choice depends on your emergency fund — if you can\'t absorb a $2,000 deductible, don\'t choose one.',
      },
      {
        heading: 'How Claims Affect Your Rate',
        body: 'Filing a claim typically raises your premium 20–40% for 3–5 years. For small claims ($500–$1,500), often better to pay out of pocket than file — the premium increase exceeds the claim value. Always check your chargeable threshold before filing.',
      },
      {
        heading: 'The Coverage Gap Trap',
        body: 'Most uninsured losses happen at the edges: a home policy excludes floods (separate NFIP policy required), auto policy doesn\'t cover personal items in the car (home policy does), or a $1M auto liability limit gets exceeded in a serious accident (umbrella fills the gap). Read your declarations page annually.',
      },
    ],
    relatedLinks: [
      { title: 'Auto Insurance Estimator', href: '/insurance/auto-insurance-california', icon: '🚗' },
      { title: 'Life Insurance Calculator', href: '/calculator/life-insurance-calculator', icon: '🛡️' },
      { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
    ],
  },
}

// ─── Fallback generator for slugs without full content ────────────────────────
function generateFallbackContent(slug: string): GuideContent {
  const title = slugToTitle(slug)
  let category = 'Finance'
  for (const [cat, slugs] of Object.entries(GUIDE_CATEGORIES)) {
    if (slugs.includes(slug)) { category = cat; break }
  }

  return {
    slug,
    title: `${title}: Complete Guide for 2025`,
    description: `Everything you need to know about ${title.toLowerCase()} in 2025 — key facts, strategies, and tools.`,
    category,
    keyFact: `Understanding ${title.toLowerCase()} is essential for financial health`,
    sections: [
      {
        heading: `What Is ${title}?`,
        body: `${title} is a key personal finance concept that affects millions of Americans. This guide covers the essential facts, common mistakes, and strategies that make a meaningful difference.`,
      },
      {
        heading: 'Key Numbers to Know',
        body: 'The specifics vary by situation, but the principles apply broadly. Knowing the benchmarks and thresholds helps you make decisions based on data rather than guesswork.',
      },
      {
        heading: 'Common Mistakes to Avoid',
        body: 'Most people get this wrong in predictable ways. Understanding the pitfalls in advance reduces costly errors and puts you ahead of the majority of people in similar situations.',
      },
      {
        heading: 'Next Steps',
        body: 'Use the calculators below to model your specific situation. Small changes in inputs often produce large differences in outcomes — run the numbers before deciding.',
      },
    ],
    relatedLinks: [
      { title: 'Budget Calculator', href: '/calculator/budget-calculator', icon: '💰' },
      { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '📊' },
    ],
  }
}

export function getGuideContent(slug: string): GuideContent | null {
  if (!GUIDE_SLUGS.includes(slug)) return null
  return GUIDE_CONTENT_MAP[slug] ?? generateFallbackContent(slug)
}
