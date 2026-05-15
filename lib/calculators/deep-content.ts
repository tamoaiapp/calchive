/**
 * Deep content for top-ranking calculators.
 * Each entry adds 800-1500 words, FAQ, worked examples, sources, methodology —
 * everything Google's E-E-A-T review expects on YMYL pages.
 *
 * If a slug has no entry here, the page falls back to the short About blurb.
 */

import type { Author } from '../authors'
import { AUTHORS } from '../authors'

export interface FaqItem {
  q: string
  a: string
}

export interface WorkedExample {
  title: string
  inputs: { label: string; value: string }[]
  result: string
  explanation: string
}

export interface ComparisonRow {
  [key: string]: string | number
}

export interface ComparisonTable {
  title: string
  headers: string[]
  rows: ComparisonRow[]
  /** Cell key order in each row, matches headers */
  cols: string[]
  caption?: string
}

export interface Source {
  label: string
  url: string
  /** What this source supports — used inline ("according to X, ...") */
  supports?: string
}

export interface DeepContent {
  /** Author persona key, drives byline & Person schema */
  author: keyof typeof AUTHORS
  /** Published date (ISO yyyy-mm-dd) — used in schema datePublished */
  datePublished: string
  /** Last reviewed date — used in schema dateModified */
  dateModified: string
  /** Lead paragraph rendered above the calculator (extra context) */
  intro?: string
  /** Long-form content rendered after the calculator, before related links */
  sections: { heading: string; body: string }[]
  /** Worked examples — fixed scenarios with all inputs filled in */
  examples?: WorkedExample[]
  /** Comparison tables — competitors, alternatives, scenarios */
  tables?: ComparisonTable[]
  /** Frequently asked questions — feeds FAQPage schema */
  faq: FaqItem[]
  /** Authoritative sources cited inline and in footer */
  sources: Source[]
}

export const DEEP_CONTENT: Record<string, DeepContent> = {
  // ─── 1. student-loan-refinance-calculator (57 impressions) ───────────────────
  'student-loan-refinance-calculator': {
    author: 'finance',
    datePublished: '2025-09-12',
    dateModified: '2026-05-14',
    intro:
      'Refinancing federal student loans into a private loan can lower your interest rate by 1.5–3 percentage points if your credit score is above 720 — but it permanently strips federal protections like income-driven repayment and Public Service Loan Forgiveness. This calculator shows the monthly and lifetime dollar impact before you decide.',
    sections: [
      {
        heading: 'What student loan refinancing actually does',
        body:
          'Refinancing pays off one or more existing student loans with a new private loan from a bank, credit union, or fintech lender. ' +
          'The new loan replaces every loan you bring in — meaning if you refinance any federal loan into a private one, that balance is no longer federal. ' +
          'You lose access to income-driven repayment plans (SAVE, PAYE, IBR), federal forbearance, and forgiveness programs including PSLF and Teacher Loan Forgiveness. ' +
          'In exchange, you potentially get a lower rate and the option to change your term length.',
      },
      {
        heading: 'When refinancing makes sense',
        body:
          'Three conditions usually need to be true simultaneously for refinancing to be a clear win: ' +
          '(1) your current weighted-average interest rate is above 6%, (2) your credit score is at least 700 with stable income, and (3) you have no plans to use federal income-driven plans or pursue forgiveness. ' +
          'If any of these is off, run the numbers carefully — the calculator above strips the math down to total interest saved vs. monthly payment change. ' +
          'Borrowers with mostly federal loans below 5% rarely save enough to justify giving up federal options.',
      },
      {
        heading: 'How refinance rates are set in 2026',
        body:
          'Private student loan refi rates follow the 10-year Treasury yield plus a credit-risk spread. ' +
          'As of mid-2026, qualified borrowers with 740+ FICO scores see fixed rates between 5.2% and 7.1% APR for 5–10 year terms. ' +
          'Variable rates start lower (around 4.8%) but reset monthly to SOFR + margin and can move 100–200 basis points per year. ' +
          'Co-signers can shave 0.5–1.5 percentage points off your offered rate; many lenders also offer a 0.25% autopay discount.',
      },
      {
        heading: 'How we calculate savings',
        body:
          'The calculator computes the standard amortizing-loan formula for both your current loan and the proposed refinanced loan, then subtracts. ' +
          'Monthly payment is P × r / (1 − (1 + r)^−n), where P is principal, r is the monthly rate (APR ÷ 12), and n is the number of payments. ' +
          'Total interest is monthly payment × n − P. Lifetime savings = current total interest − new total interest. ' +
          'We do not adjust for any potential federal forgiveness you might be giving up — that decision is qualitative and beyond what a number can show.',
      },
    ],
    examples: [
      {
        title: '$45K balance, 7.5% → 5.2%, 10 years',
        inputs: [
          { label: 'Loan balance', value: '$45,000' },
          { label: 'Current rate', value: '7.5% APR' },
          { label: 'New rate', value: '5.2% APR' },
          { label: 'New term', value: '10 years' },
        ],
        result: 'Saves about $6,300 in total interest. Monthly payment drops $53.',
        explanation:
          'This is the typical "good refi candidate" scenario — a graduate-school borrower with one large balance and a credit profile strong enough to qualify for top-tier private rates. The breakeven on origination costs (most refi lenders charge $0) is immediate.',
      },
      {
        title: '$28K balance, 5.5% → 4.8%, 7 years',
        inputs: [
          { label: 'Loan balance', value: '$28,000' },
          { label: 'Current rate', value: '5.5% APR' },
          { label: 'New rate', value: '4.8% APR' },
          { label: 'New term', value: '7 years' },
        ],
        result: 'Saves about $720 in total interest. Monthly payment rises $42.',
        explanation:
          'Borderline case. The savings exist but are small relative to the federal benefits being surrendered. If this borrower works for a non-profit or government employer, the lost PSLF eligibility alone could exceed the entire $720 savings.',
      },
      {
        title: '$120K balance, 6.8% → 5.5%, 15 years',
        inputs: [
          { label: 'Loan balance', value: '$120,000' },
          { label: 'Current rate', value: '6.8% APR' },
          { label: 'New rate', value: '5.5% APR' },
          { label: 'New term', value: '15 years' },
        ],
        result: 'Saves about $14,400 in total interest. Monthly payment drops $84.',
        explanation:
          'Medical, law, or MBA debt territory. With six-figure balances, even modest rate cuts compound into five-figure savings. The 15-year term keeps the monthly payment manageable while the borrower\'s income grows.',
      },
    ],
    faq: [
      {
        q: 'Can I refinance federal student loans without losing them?',
        a: 'No. Once you refinance a federal loan into a private loan, it is permanently private. The federal Direct Consolidation Loan combines federal loans into a single federal loan and preserves federal benefits, but it does not lower your rate — it averages your existing rates rounded up to the nearest 1/8 of a percent.',
      },
      {
        q: 'What credit score do I need to refinance student loans?',
        a: 'Most lenders set a hard floor at 670 FICO. The advertised lowest rates require 740+ with two years of stable income above $40,000, or a creditworthy co-signer. Borrowers below 700 typically see rates within 1–2 points of their current federal rate, which often makes refinancing not worth it.',
      },
      {
        q: 'Does refinancing affect my credit score?',
        a: 'Yes, in two ways. The hard inquiry from the loan application typically costs 5–10 FICO points and recovers in 3–6 months. The new account also lowers the average age of your credit accounts. Both effects are minor compared to consistently paying the new loan on time.',
      },
      {
        q: 'Should I pick a shorter or longer refinance term?',
        a: 'Shorter terms (5–7 years) get the lowest rates and minimize total interest, but raise the monthly payment. Longer terms (15–20 years) cut the payment but cost much more in total interest. A common middle path is matching your original federal loan\'s remaining term and using the rate cut as pure savings.',
      },
      {
        q: 'Is variable or fixed rate better for student loan refinancing?',
        a: 'Fixed for most borrowers. Variable rates start 50–100 basis points lower but reset monthly, and over a 10-year payback they almost always end up costing more in total. Variable can make sense only if you plan to aggressively pay off the loan in under 3 years.',
      },
      {
        q: 'Can I refinance student loans more than once?',
        a: 'Yes, and many borrowers do. There is no limit. If your credit score improves significantly after your first refi or if rates drop more than 0.75 percentage points, refinancing again can save additional money. There are no prepayment penalties on private student loans.',
      },
      {
        q: 'What is the difference between consolidation and refinancing?',
        a: 'Federal consolidation (through the Department of Education) combines federal loans into one federal loan at the weighted-average rate, with no credit check. Private refinancing replaces federal and/or private loans with a new private loan at a market rate, requiring a credit check. Only refinancing can lower your rate.',
      },
    ],
    sources: [
      { label: 'CFPB Student Loan Refinancing Guide', url: 'https://www.consumerfinance.gov/ask-cfpb/should-i-refinance-or-consolidate-my-federal-student-loans-en-619/' },
      { label: 'Federal Student Aid — Loan Consolidation', url: 'https://studentaid.gov/manage-loans/consolidation' },
      { label: 'Federal Reserve Consumer Credit Data', url: 'https://www.federalreserve.gov/releases/g19/current/' },
    ],
  },

  // ─── 2. per-diem-calculator (24 impressions) ─────────────────────────────────
  'per-diem-calculator': {
    author: 'finance',
    datePublished: '2025-10-04',
    dateModified: '2026-05-14',
    intro:
      'Per diem rates compensate employees for lodging, meals, and incidentals while traveling for work. The IRS and GSA publish updated rates every October 1 for the federal fiscal year. This calculator turns trip days × location rate into the total reimbursement an employer owes you — or that a self-employed traveler can deduct.',
    sections: [
      {
        heading: 'What per diem covers',
        body:
          'Federal per diem rates have two components: lodging (hotel) and M&IE (meals and incidental expenses). ' +
          'The lodging portion changes by city and time of year — peak-season rates in places like NYC or San Francisco can exceed $300/night while remote locations stay near the standard $107 floor. ' +
          'M&IE is bracketed into six tiers nationwide ($59–$92/day) and covers food plus tips to porters, hotel staff, and the like. ' +
          'On the first and last day of travel, the IRS requires only 75% of the daily M&IE.',
      },
      {
        heading: 'GSA, IRS, and DoD rates — which one applies',
        body:
          'GSA rates apply to federal civilian employees traveling within the continental US (CONUS). ' +
          'DoD-issued JTR rates apply to military and Department of Defense civilian travel, including OCONUS (Alaska, Hawaii, territories, foreign). ' +
          'Private employers and self-employed individuals can use the GSA rates voluntarily under the IRS "high-low" substantiation method, which avoids needing receipts for amounts at or below the published rate. ' +
          'Anything above the federal rate is taxable income to the traveler.',
      },
      {
        heading: 'How we calculate the total',
        body:
          'Total per diem = (lodging rate × nights) + (M&IE rate × full travel days) + (M&IE × 0.75 × first and last day). ' +
          'Most calculators including ours simplify by treating every day as a full day; you should manually reduce the first and last day to 75% if you need IRS-exact substantiation. ' +
          'For partial-day departures and returns, the simplified method usually overstates the total by 12–18%.',
      },
    ],
    examples: [
      {
        title: '4-day conference in Chicago (peak)',
        inputs: [
          { label: 'Lodging rate', value: '$229/night' },
          { label: 'M&IE rate', value: '$79/day' },
          { label: 'Trip days', value: '4' },
        ],
        result: '$1,232 total ($916 lodging for 4 nights + $316 M&IE for 4 days).',
        explanation:
          'A typical work-trip calculation. The IRS-exact figure with first/last-day 75% adjustment would be about $1,193 — $39 less than the simplified daily total.',
      },
      {
        title: 'Week-long site visit, standard CONUS',
        inputs: [
          { label: 'Lodging rate', value: '$107/night (standard)' },
          { label: 'M&IE rate', value: '$59/day (standard)' },
          { label: 'Trip days', value: '7' },
        ],
        result: '$1,162 total ($749 lodging for 7 nights + $413 M&IE for 7 days).',
        explanation:
          'Most rural and small-city US travel falls into the standard rate buckets. This is the floor — you cannot reimburse below standard CONUS for federal travel.',
      },
    ],
    faq: [
      {
        q: 'How often do per diem rates change?',
        a: 'GSA publishes updated CONUS rates every October 1 (the start of the federal fiscal year). Rates can change mid-year for "non-standard areas" if local lodging costs spike, but this is rare. State Department rates for foreign travel update monthly.',
      },
      {
        q: 'Is per diem taxable income?',
        a: 'Per diem at or below the federal published rate is non-taxable when used under an "accountable plan" — meaning the employee submitted travel dates and a business purpose, even without itemized receipts. Amounts above the federal rate are taxable wages and appear on the W-2.',
      },
      {
        q: 'Can a 1099 contractor claim per diem?',
        a: 'A self-employed traveler can deduct the GSA M&IE rate on Schedule C without keeping meal receipts — only travel dates and destinations are required. Lodging always requires receipts for self-employed deductions; the GSA lodging rate cannot be claimed without proof of payment.',
      },
      {
        q: 'What if my hotel costs more than the per diem rate?',
        a: 'For federal employees the lodging rate is a ceiling — exceptions require written justification. Private employers can choose to reimburse actual lodging costs above per diem; the excess is taxable wages unless the employer adopts an "actual expense" plan with full receipts.',
      },
      {
        q: 'Are weekends included in per diem?',
        a: 'Yes, if you remain at the travel location for legitimate business reasons (e.g., a Friday meeting and Monday meeting with cheaper Saturday-night airfare). The IRS allows the full M&IE for non-travel days during a continuing business trip.',
      },
    ],
    sources: [
      { label: 'GSA Per Diem Rate Lookup', url: 'https://www.gsa.gov/travel/plan-book/per-diem-rates' },
      { label: 'IRS Publication 463 — Travel, Gift, and Car Expenses', url: 'https://www.irs.gov/publications/p463' },
      { label: 'DoD Joint Travel Regulations', url: 'https://www.travel.dod.mil/Travel-Regulations/' },
    ],
  },

  // ─── 3. car-depreciation-calculator (21 impressions) ─────────────────────────
  'car-depreciation-calculator': {
    author: 'finance',
    datePublished: '2025-08-19',
    dateModified: '2026-05-14',
    intro:
      'A new car loses 20–30% of its value the moment you drive it off the lot and roughly 60% of its value over the first 5 years. Knowing your specific depreciation curve matters when deciding whether to lease vs. buy, when to sell, and whether gap insurance is worth the premium.',
    sections: [
      {
        heading: 'How car depreciation actually works',
        body:
          'Depreciation is the gap between what you paid and what the car is worth on the resale market. ' +
          'It is not linear: year one alone accounts for 20–30% of the original price, year two adds another 10–15%, and after year five most non-luxury cars stabilize at around 35–40% of MSRP. ' +
          'Trucks and SUVs depreciate slowest (Toyota Tacoma, 4Runner, Honda Pilot retain 60%+ at year five). ' +
          'Luxury sedans and EVs depreciate fastest — a Mercedes S-Class or pre-2024 Tesla Model S often loses 65%+ in five years.',
      },
      {
        heading: 'What drives the curve',
        body:
          'Five factors set the slope: brand reliability reputation (Toyota and Honda hold value, European luxury does not), ' +
          'mileage (each 1,000 miles above the 12,000/year baseline knocks roughly $200–$400 off resale), ' +
          'maintenance history (one full set of dealer records can add $1,000–$2,500), ' +
          'accident reports on Carfax (a single reported accident permanently caps resale 10–20% lower), ' +
          'and powertrain trend (gas trucks holding value as EV adoption shifts demand patterns).',
      },
      {
        heading: 'How we calculate',
        body:
          'The calculator applies a configurable annual depreciation rate compounded over the holding period: ' +
          'value at year n = original price × (1 − rate)^n. ' +
          'The default 15%/year is the median for mainstream sedans and crossovers across 2020–2025 data. ' +
          'For luxury cars use 20–25%, for full-size pickups use 10–12%, and for EVs use 20–25% to account for battery-replacement concerns at year 7+.',
      },
    ],
    examples: [
      {
        title: 'Honda Civic, $28,000 new, kept 5 years',
        inputs: [
          { label: 'Original price', value: '$28,000' },
          { label: 'Depreciation rate', value: '12% per year' },
          { label: 'Years', value: '5' },
        ],
        result: 'Estimated value at year 5: $14,776. Total lost to depreciation: $13,224.',
        explanation: 'Civics consistently outperform their MSRP-based depreciation curve due to strong demand and reliability — real Kelley Blue Book values for 5-year-old Civics typically come in slightly above this estimate.',
      },
      {
        title: 'Mercedes E-Class, $62,000 new, kept 3 years',
        inputs: [
          { label: 'Original price', value: '$62,000' },
          { label: 'Depreciation rate', value: '22% per year' },
          { label: 'Years', value: '3' },
        ],
        result: 'Estimated value at year 3: $29,449. Total lost to depreciation: $32,551.',
        explanation: 'Luxury sedans are the worst depreciation category. The 3-year mark is often the sweet spot to buy used — someone else absorbed $32K of decline for you.',
      },
    ],
    faq: [
      {
        q: 'Why do new cars lose so much value immediately?',
        a: 'The moment a car is titled to a buyer, it becomes "used" and loses access to new-car incentives, MSRP-protected lease residuals, and first-owner warranty terms. Dealers know any car they take in on trade competes with used inventory, so initial trade-in offers typically run 15–25% below sticker even on cars driven less than 1,000 miles.',
      },
      {
        q: 'Which cars depreciate the slowest?',
        a: 'Toyota Tacoma, Toyota 4Runner, Honda Pilot, Chevrolet Corvette, Subaru WRX, and Jeep Wrangler consistently top retention charts — many retain 60%+ of MSRP at year five. Full-size pickups (F-150, Silverado, Ram) hold 55–60%. The pattern: capability, scarcity, or cult-following.',
      },
      {
        q: 'Should I buy or lease based on depreciation?',
        a: 'Leasing makes financial sense when you plan to own a car under 4 years AND it depreciates faster than the lease implies. For fast-depreciating luxury cars, leasing usually wins. For slow-depreciating Toyotas and trucks, buying and holding 7+ years wins because you skip the high-depreciation early years.',
      },
      {
        q: 'Does depreciation slow down after year five?',
        a: 'Yes. Most cars enter a "plateau" between year 5 and year 10 where annual depreciation drops to 5–8%. This is why used cars in the 5–7 year age range often have the best ratio of price to remaining useful life.',
      },
      {
        q: 'Do EVs depreciate faster than gas cars?',
        a: 'Through 2024 yes — early EVs lost 50–60% over three years due to battery range improvements making older models feel obsolete. The 2025–2026 trend is reversing as the technology stabilizes, but EVs from before 2022 still depreciate at 20–25%/year vs. 12–15% for comparable gas cars.',
      },
    ],
    sources: [
      { label: 'Kelley Blue Book Best Resale Value Awards', url: 'https://www.kbb.com/best-resale-value-awards/' },
      { label: 'iSeeCars 5-Year Depreciation Study', url: 'https://www.iseecars.com/cars-that-depreciate-the-most-study' },
      { label: 'NADA Used Car Guide', url: 'https://www.nadaguides.com/' },
    ],
  },

  // ─── 4. roas-calculator (23 impressions) ─────────────────────────────────────
  'roas-calculator': {
    author: 'business',
    datePublished: '2025-07-08',
    dateModified: '2026-05-14',
    intro:
      'Return on ad spend (ROAS) is the single number every paid-media buyer optimizes against. A 4:1 ROAS means every $1 of ad spend returns $4 in revenue — but whether that\'s good depends entirely on your gross margin, customer lifetime value, and the channel mix behind the average.',
    sections: [
      {
        heading: 'ROAS vs. ROI — what marketers actually mean',
        body:
          'ROAS measures revenue divided by ad spend. ROI measures profit divided by ad spend. ' +
          'They diverge significantly: a brand selling $100 hand soap with 80% gross margin can hit profit at 2:1 ROAS. ' +
          'A drop-shipper selling $100 electronics at 12% margin needs 9:1 ROAS just to break even on the ad before fulfillment costs. ' +
          'When agencies and tools say "ROAS" they almost always mean revenue-to-spend, not profit-to-spend.',
      },
      {
        heading: 'Target ROAS by channel and stage',
        body:
          'Prospecting (cold audience): 1.5–2.5x for most consumer brands, 2.5–4x for SaaS subscription. ' +
          'Retargeting (warm): 4–8x is normal — the audience already knows you. ' +
          'Branded search: 8–25x and frequently meaningless because much of the revenue would have happened organically. ' +
          'The blended ROAS your CFO sees is a weighted average; high branded-search ROAS hides poor prospecting performance unless you break it down by channel.',
      },
      {
        heading: 'Why "break-even ROAS" is the real KPI',
        body:
          'Break-even ROAS = 1 / gross margin %. A brand with 40% gross margin breaks even at 2.5x ROAS. ' +
          'Anything above that line generates contribution dollars. Anything below burns cash to acquire revenue. ' +
          'For subscription products, calculate break-even against LTV rather than first-purchase revenue — many DTC brands target 1.0x ROAS on first purchase and rely on the second-order rate to make the unit economics work.',
      },
    ],
    examples: [
      {
        title: 'Shopify brand running Meta ads',
        inputs: [
          { label: 'Ad spend', value: '$12,000' },
          { label: 'Revenue from ads', value: '$48,000' },
        ],
        result: 'ROAS = 4.0x. Each ad dollar returned $4 in revenue.',
        explanation:
          'Healthy by surface number. But at 35% gross margin, contribution is $48K × 0.35 − $12K = $4,800 of actual profit. At 20% margin (typical apparel), this campaign loses $2,400.',
      },
      {
        title: 'B2B SaaS Google Ads campaign',
        inputs: [
          { label: 'Ad spend', value: '$25,000' },
          { label: 'Revenue from ads (year-1 ACV)', value: '$87,500' },
        ],
        result: 'ROAS = 3.5x on year-1 ACV.',
        explanation:
          'Strong if customers stay 3+ years. The same campaign on year-1 ACV alone looks fine but the real LTV-to-CAC ratio is what determines whether this scales — at 80% gross retention and 110% net retention, this customer cohort is worth roughly 4x the year-1 ACV over a 5-year horizon.',
      },
    ],
    faq: [
      {
        q: 'What\'s a good ROAS?',
        a: 'Anything above your break-even ROAS (1 / gross margin). A 4:1 ROAS is excellent at 40% margin, mediocre at 25% margin, and catastrophic at 10% margin. Always compare ROAS to your specific break-even, not to industry averages.',
      },
      {
        q: 'How is ROAS different from ACOS?',
        a: 'ACOS (Advertising Cost of Sale) is the inverse of ROAS expressed as a percentage: ACOS = ad spend ÷ revenue × 100. A 4x ROAS is a 25% ACOS. Amazon Ads uses ACOS by default; everyone else uses ROAS.',
      },
      {
        q: 'Does ROAS account for organic lift?',
        a: 'No. Reported ROAS includes only revenue attributed to the ad platform, which usually claims everything in its attribution window (7-day click, 1-day view on Meta). The true incremental ROAS is typically 30–60% lower than reported because some of those customers would have purchased anyway. Geo holdout tests measure incrementality.',
      },
      {
        q: 'Should I use first-purchase or LTV-based ROAS?',
        a: 'LTV-based for any subscription, repeat-purchase, or marketplace business. First-purchase ROAS for true one-time products. Most DTC brands sit in between and use a "predicted LTV at day 30" multiple — typically 1.4–1.8x first-purchase revenue.',
      },
      {
        q: 'Why is my ROAS dropping as I scale?',
        a: 'Diminishing returns. The most efficient audiences and placements get exhausted first. Each additional dollar of spend reaches lower-intent users. A 5x ROAS at $5K/day commonly becomes 3x at $20K/day. The optimization question is whether the incremental volume is still above break-even.',
      },
    ],
    sources: [
      { label: 'Meta Business — ROAS Definition', url: 'https://www.facebook.com/business/help/833875377662727' },
      { label: 'Google Ads — Target ROAS bidding', url: 'https://support.google.com/google-ads/answer/6268637' },
    ],
  },

  // ─── 5. ltv-cac-ratio-calculator (16 impressions) ────────────────────────────
  'ltv-cac-ratio-calculator': {
    author: 'business',
    datePublished: '2025-06-22',
    dateModified: '2026-05-14',
    intro:
      'LTV/CAC is the single ratio investors use to decide whether a company is building a business or burning money. 3:1 is the rule-of-thumb floor for venture-backed SaaS. Below 1:1, every customer makes you poorer. This calculator pulls the math out of the spreadsheet and shows what your inputs actually imply about runway and payback.',
    sections: [
      {
        heading: 'What LTV and CAC actually measure',
        body:
          'Customer lifetime value (LTV) is the gross profit a customer generates over their entire relationship with you. ' +
          'Customer acquisition cost (CAC) is the fully-loaded sales and marketing cost to acquire that customer — ad spend, agency fees, sales rep salary, commission, SDR cost, marketing salaries — divided by net new customers in the same period. ' +
          'LTV/CAC is the ratio between the two. The metric exists because you can\'t evaluate a business on revenue alone — only on whether the revenue costs more or less than the customer generates.',
      },
      {
        heading: 'The 3:1 benchmark and why it exists',
        body:
          'A 3:1 LTV/CAC means every dollar spent acquiring a customer returns $3 in lifetime gross profit. ' +
          'The ratio leaves room for R&D, G&A, and a target operating margin while still funding growth. ' +
          'Above 4:1 you\'re probably under-investing in growth — you could be acquiring more customers. ' +
          'Below 2:1 you\'re either acquiring the wrong customers, charging too little, or your retention is broken. ' +
          'Below 1:1 every new customer destroys enterprise value.',
      },
      {
        heading: 'CAC payback — the other half of the equation',
        body:
          'LTV/CAC alone misses cash flow. A SaaS company with 5:1 LTV/CAC but 36-month payback is a great long-term business that can starve to death waiting for the cash to return. ' +
          'Payback period = CAC ÷ (ARPU × gross margin). Best-in-class SMB SaaS hits 12-month payback. Mid-market sits at 18 months. Enterprise can be 24–30 months and still be healthy because of multi-year contract value. ' +
          'Track both: ratio for unit economics, payback for cash discipline.',
      },
    ],
    examples: [
      {
        title: 'Mid-market SaaS, $1,200 ARPU, 80% gross margin',
        inputs: [
          { label: 'ARPU (annual)', value: '$1,200' },
          { label: 'Gross margin', value: '80%' },
          { label: 'Monthly churn', value: '2.5%' },
          { label: 'CAC', value: '$2,400' },
        ],
        result: 'LTV ≈ $3,840. LTV/CAC = 1.6x. Payback ≈ 30 months.',
        explanation:
          'Below benchmark on both axes. Options: raise prices (most leveraged input), reduce churn (longest lever), or cut CAC (hardest without hurting growth). A 1.6x ratio is a "fix-the-engine" situation, not a "step on the gas" one.',
      },
      {
        title: 'Healthy SMB SaaS',
        inputs: [
          { label: 'ARPU (annual)', value: '$600' },
          { label: 'Gross margin', value: '85%' },
          { label: 'Monthly churn', value: '1.2%' },
          { label: 'CAC', value: '$450' },
        ],
        result: 'LTV ≈ $3,542. LTV/CAC = 7.9x. Payback ≈ 11 months.',
        explanation:
          'This is the profile that gets venture funding. Strong margin, low churn, sub-12-month payback. The strategic move is to push CAC up (spend more) to capture more market while the ratio is high.',
      },
    ],
    faq: [
      {
        q: 'How do I calculate LTV for SaaS?',
        a: 'The standard formula is LTV = ARPU × gross margin % ÷ churn rate. For monthly churn of 2% and $100 monthly ARPU at 80% gross margin: LTV = ($100 × 12) × 0.80 ÷ 0.24 (annualized churn) = $4,000. The formula assumes a steady-state customer base and ignores expansion revenue.',
      },
      {
        q: 'Should CAC include salaries?',
        a: 'Yes. Fully-loaded CAC includes ad spend, marketing tool subscriptions, marketing team salaries, sales team salaries (including base + commission), SDR costs, and any agency fees. Excluding salaries gives "marketing-only CAC" — useful for channel analysis but not for board-level reporting.',
      },
      {
        q: 'Is LTV/CAC the same as payback period?',
        a: 'No. Ratio measures lifetime value relative to cost. Payback measures how many months until you recoup CAC. A 5:1 ratio with a 24-month payback can starve a company of cash. Track both.',
      },
      {
        q: 'How do I improve LTV/CAC?',
        a: 'Four levers, ordered by typical impact: (1) reduce churn — even 0.5 percentage points compounds enormously over years; (2) raise prices — direct LTV lift with no CAC change; (3) increase ACV through expansion features; (4) cut CAC through better targeting and conversion-rate work. Salespeople usually push lever 4; the math says lever 1 wins.',
      },
      {
        q: 'Does LTV/CAC apply to consumer brands?',
        a: 'Yes, but the inputs differ. Replace ARPU with average order value, replace churn with repeat-purchase rate, and replace gross margin with contribution margin (gross margin minus variable fulfillment costs). The 3:1 benchmark still roughly holds for healthy DTC brands.',
      },
    ],
    sources: [
      { label: 'OpenView SaaS Benchmarks Report', url: 'https://openviewpartners.com/expansion-saas-benchmarks/' },
      { label: 'Andreessen Horowitz — 16 SaaS Metrics', url: 'https://a16z.com/the-saas-metrics-that-matter/' },
      { label: 'David Skok — SaaS Metrics 2.0', url: 'https://www.forentrepreneurs.com/saas-metrics-2/' },
    ],
  },
}

export function getDeepContent(slug: string): DeepContent | null {
  return DEEP_CONTENT[slug] ?? null
}

export function hasDeepContent(slug: string): boolean {
  return slug in DEEP_CONTENT
}
