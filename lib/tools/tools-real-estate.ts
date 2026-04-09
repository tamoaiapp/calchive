import type { ToolConfig } from './types'

export const realEstateTools: ToolConfig[] = [
  {
    slug: 'home-affordability-quick-check',
    title: 'Home Affordability Quick Check',
    desc: 'Estimate how much home you can afford based on income, debt, and down payment.',
    cat: 'real-estate',
    icon: '🏠',
    toolType: 'estimator',
    fields: [
      { k: 'income', l: 'Annual Household Income', type: 'number', placeholder: '100000', unit: '$' },
      { k: 'monthly_debt', l: 'Monthly Debt Payments (car, student loans)', type: 'number', placeholder: '500', unit: '$' },
      { k: 'down_payment', l: 'Down Payment Available', type: 'number', placeholder: '60000', unit: '$' },
      { k: 'rate', l: 'Mortgage Rate (%)', type: 'number', placeholder: '6.8', unit: '%' },
    ],
    fn: (inputs) => {
      const income = parseFloat(inputs.income) || 0, debt = parseFloat(inputs.monthly_debt) || 0, down = parseFloat(inputs.down_payment) || 0, rate = (parseFloat(inputs.rate) || 6.8) / 100 / 12
      const monthlyIncome = income / 12
      const maxPITI = monthlyIncome * 0.28 // 28% housing ratio
      const maxDTI = monthlyIncome * 0.36 - debt // 36% total DTI
      const maxPayment = Math.min(maxPITI, maxDTI)
      // Loan amount from payment (P&I only, ignoring tax/insurance)
      const paymentForCalc = maxPayment * 0.75 // assume ~75% of PITI is P&I
      const n = 360
      const loanAmount = rate > 0 ? paymentForCalc * (1 - (1 + rate) ** -n) / rate : paymentForCalc * n
      const homePrice = loanAmount + down
      return [{
        type: 'table', label: 'Affordability Estimate', content: [
          { label: 'Max monthly housing payment', value: `$${maxPayment.toFixed(0)}` },
          { label: 'Max loan amount', value: `$${loanAmount.toFixed(0)}` },
          { label: 'Home price you can afford', value: `$${homePrice.toFixed(0)}` },
          { label: 'Down payment', value: `$${down.toLocaleString()} (${(down / homePrice * 100).toFixed(1)}%)` },
          { label: '28% rule limit', value: `$${maxPITI.toFixed(0)}/month` },
          { label: '36% DTI limit', value: `$${maxDTI.toFixed(0)}/month` },
        ]
      }]
    },
    about: 'Lenders use two key ratios: the 28% rule (housing costs ≤28% of gross income) and the 36% DTI rule (all debt ≤36% of gross income). FHA loans allow up to 43% DTI; VA and USDA loans are more flexible. These are estimates — actual approval depends on credit score and reserves.',
    related: ['mortgage-rate-comparison', 'down-payment-assistance-guide', 'property-tax-rate-by-state'],
  },
  {
    slug: 'mortgage-rate-comparison',
    title: 'Mortgage Rate Comparison',
    desc: 'Compare monthly payments and total interest at different mortgage rates.',
    cat: 'real-estate',
    icon: '📊',
    toolType: 'estimator',
    fields: [
      { k: 'loan', l: 'Loan Amount', type: 'number', placeholder: '350000', unit: '$' },
      { k: 'years', l: 'Loan Term (years)', type: 'number', placeholder: '30' },
    ],
    fn: (inputs) => {
      const loan = parseFloat(inputs.loan) || 350000, years = parseFloat(inputs.years) || 30
      const n = years * 12
      const rates = [5.5, 6.0, 6.5, 6.8, 7.0, 7.5, 8.0]
      const rows = rates.map(r => {
        const mr = r / 100 / 12
        const payment = loan * mr * (1 + mr) ** n / ((1 + mr) ** n - 1)
        const total = payment * n
        const interest = total - loan
        return { label: `${r}%`, value: `$${payment.toFixed(0)}/mo — $${Math.round(interest / 1000)}K total interest` }
      })
      return [{ type: 'table', label: `${years}-Year Mortgage on $${loan.toLocaleString()}`, content: rows }]
    },
    about: 'Each 1% difference in mortgage rate on a $350,000 loan changes the monthly payment by about $200 and total interest by ~$70,000 over 30 years. Shopping multiple lenders typically finds rates 0.25–0.5% lower than the first offer. Compare APR (not just rate) for accurate cost comparison.',
    related: ['home-affordability-quick-check', 'mortgage-rate-history', 'closing-cost-guide'],
  },
  {
    slug: 'loan-type-comparison',
    title: 'Mortgage Loan Type Comparison',
    desc: 'Compare FHA, VA, USDA, and Conventional loan programs side by side.',
    cat: 'real-estate',
    icon: '📋',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Loan Type Comparison (2025)', content: [
        { label: 'Conventional — Min Down Payment', value: '3% (97% LTV with FHFA programs)' },
        { label: 'Conventional — Credit Score Min', value: '620 (680+ for best rates)' },
        { label: 'Conventional — PMI Required', value: 'Yes, until 20% equity' },
        { label: 'Conventional — Loan Limit (2025)', value: '$806,500 (standard); $1,209,750 (high-cost)' },
        { label: 'FHA — Min Down Payment', value: '3.5% (10% if FICO 500–579)' },
        { label: 'FHA — Credit Score Min', value: '500 (580 for 3.5% down)' },
        { label: 'FHA — MIP (mortgage insurance)', value: '0.55%–0.85% annual + 1.75% upfront' },
        { label: 'FHA — Loan Limit (2025)', value: '$524,225 (standard); $1,209,750 (high-cost)' },
        { label: 'VA — Min Down Payment', value: '0% (no down payment required)' },
        { label: 'VA — Credit Score Min', value: 'No VA minimum (lenders typically require 580–620)' },
        { label: 'VA — Funding Fee', value: '1.25%–3.3% (waived for disabled veterans)' },
        { label: 'VA — Eligibility', value: 'Active duty, veterans, surviving spouses' },
        { label: 'USDA — Min Down Payment', value: '0% (rural areas only)' },
        { label: 'USDA — Income Limit', value: '115% of area median income' },
        { label: 'USDA — Guarantee Fee', value: '1% upfront + 0.35% annual' },
      ]
    }],
    about: 'VA loans offer the best terms for eligible veterans — no down payment, no PMI, and competitive rates. FHA loans are the most accessible for buyers with lower credit. Conventional loans become cheaper than FHA once you have 20% equity, as PMI drops off while FHA MIP lasts the life of the loan (if down payment < 10%).',
    related: ['home-affordability-quick-check', 'down-payment-assistance-guide', 'first-time-homebuyer-programs'],
  },
  {
    slug: 'property-tax-rate-by-state',
    title: 'Property Tax Rates by State 2025',
    desc: 'Average effective property tax rates for all 50 states and key exemptions.',
    cat: 'real-estate',
    icon: '🏛️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Effective Property Tax Rates by State', content: [
        { label: 'New Jersey', value: '2.21% — highest in US' },
        { label: 'Illinois', value: '2.05%' },
        { label: 'Connecticut', value: '1.92%' },
        { label: 'New Hampshire', value: '1.89%' },
        { label: 'Vermont', value: '1.78%' },
        { label: 'Wisconsin', value: '1.63%' },
        { label: 'New York', value: '1.54%' },
        { label: 'Michigan', value: '1.48%' },
        { label: 'Ohio', value: '1.41%' },
        { label: 'Nebraska', value: '1.40%' },
        { label: 'Pennsylvania', value: '1.36%' },
        { label: 'Iowa', value: '1.35%' },
        { label: 'Texas', value: '1.25% (no state income tax)' },
        { label: 'Florida', value: '0.83%' },
        { label: 'Colorado', value: '0.52%' },
        { label: 'California', value: '0.76% (Prop 13 caps increases)' },
        { label: 'Nevada', value: '0.50%' },
        { label: 'Arizona', value: '0.51%' },
        { label: 'Hawaii', value: '0.29% — lowest in US' },
        { label: 'Alabama', value: '0.38%' },
        { label: 'Louisiana', value: '0.55%' },
        { label: 'Wyoming', value: '0.57%' },
      ]
    }],
    about: 'Property tax is a county/municipal tax on assessed value. New Jersey\'s high rate (2.21%) funds excellent public schools. California\'s Proposition 13 (1978) caps annual assessment increases at 2%, creating a massive gap between market value and taxable value for long-time homeowners.',
    related: ['homestead-exemption-guide', 'home-affordability-quick-check', 'closing-cost-guide'],
  },
  {
    slug: 'down-payment-assistance-guide',
    title: 'Down Payment Assistance Programs',
    desc: 'State and federal down payment assistance programs for first-time and low-income buyers.',
    cat: 'real-estate',
    icon: '💰',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Down Payment Assistance Programs', content: [
        { label: 'FHA Loans (Federal)', value: '3.5% min down; low credit OK' },
        { label: 'VA Loans (Federal)', value: '0% down for eligible veterans' },
        { label: 'USDA Loans (Federal)', value: '0% down for rural areas, income limits' },
        { label: 'Fannie Mae HomeReady', value: '3% down, 80% AMI income limit' },
        { label: 'Freddie Mac Home Possible', value: '3% down, 80% AMI income limit' },
        { label: 'HUD-approved programs', value: 'Search HUD.gov by state for local DPA grants' },
        { label: 'California CALHFA', value: 'MyHome Assistance: 3.5% silent second loan' },
        { label: 'Texas TSAHC', value: 'Grants up to 5% for income-qualifying buyers' },
        { label: 'New York SONYMA', value: 'Down payment assistance loans and low-rate mortgages' },
        { label: 'IDA programs', value: 'Individual Development Accounts: 2:1 to 4:1 match' },
        { label: 'Gift funds', value: 'Allowed for FHA (with letter); 20%+ down for conventional' },
        { label: 'Income limits (typical)', value: '80%–120% of Area Median Income' },
      ]
    }],
    about: 'Down payment assistance programs (DPAs) can provide 3–5% of the purchase price as a grant or forgivable loan. Many require completing a HUD-approved homebuyer education course. Income limits prevent assistance from going to high earners. Programs change annually — always check current availability with a HUD-approved counselor.',
    related: ['first-time-homebuyer-programs', 'loan-type-comparison', 'home-affordability-quick-check'],
  },
  {
    slug: 'first-time-homebuyer-programs',
    title: 'First-Time Homebuyer Programs Guide',
    desc: 'Overview of first-time homebuyer credits, programs, and requirements for 2025.',
    cat: 'real-estate',
    icon: '🗝️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'First-Time Homebuyer Benefits 2025', content: [
        { label: 'First-time buyer definition', value: 'No ownership in primary residence in past 3 years' },
        { label: 'IRA early withdrawal penalty exemption', value: 'Up to $10,000 lifetime (Traditional IRA; no exception for Roth principal)' },
        { label: 'Mortgage interest deduction', value: 'Up to $750K loan; deductible if itemizing' },
        { label: 'Property tax deduction (SALT cap)', value: '$10,000 limit (single/MFJ) — may change in 2025' },
        { label: 'Points deduction', value: 'Mortgage points deductible in year paid (purchase loans)' },
        { label: 'State credits (varies)', value: 'Many states offer MCC (Mortgage Credit Certificate)' },
        { label: 'FHA loan advantage', value: '3.5% down; 580 credit score minimum' },
        { label: 'HomeReady / Home Possible', value: '3% down; reduced MI for qualifying buyers' },
        { label: 'HUD counseling', value: 'Free or low-cost housing counselors available nationwide' },
        { label: 'FHFA First Gen program', value: 'Proposed: $2,500 grant for first-generation buyers (pending)' },
      ]
    }],
    about: 'The "first-time homebuyer" definition is broader than most realize — you qualify if you haven\'t owned a home in the past 3 years. Most programs stack: FHA loan + state DPA grant + HUD counseling is a common combination. A Mortgage Credit Certificate (MCC) converts 20–25% of mortgage interest into a direct tax credit.',
    related: ['down-payment-assistance-guide', 'loan-type-comparison', 'home-affordability-quick-check'],
  },
  {
    slug: 'homestead-exemption-guide',
    title: 'Homestead Exemption Guide',
    desc: 'Homestead exemption amounts and eligibility by state for property tax reduction.',
    cat: 'real-estate',
    icon: '📋',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Homestead Exemptions by State', content: [
        { label: 'Texas', value: '$100,000 school district exemption + no cap on appraisal increase for homesteads' },
        { label: 'Florida', value: '$50,000 exemption; Save Our Homes caps assessment increases at 3%' },
        { label: 'California', value: '$300,000–$600,000 (based on median home value)' },
        { label: 'New York', value: '$30,000 for school taxes (STAR exemption); additional senior STAR' },
        { label: 'Georgia', value: '$2,000 exemption + additional county/city exemptions' },
        { label: 'Illinois', value: '$10,000 equalized assessed value reduction' },
        { label: 'Michigan', value: '100% exemption from operating millage for primary residence' },
        { label: 'Pennsylvania', value: 'Varies by school district; Homestead Exclusion available' },
        { label: 'Virginia', value: '$5,000 exemption for eligible homeowners' },
        { label: 'Massachusetts', value: '$500,000 estate exemption (protection from creditors)' },
        { label: 'Most states require', value: 'Primary residence, owner-occupied, filed annually or once' },
        { label: 'Senior/disabled additional', value: 'All 50 states offer additional exemptions for seniors 65+' },
      ]
    }],
    about: 'Homestead exemptions reduce the assessed value used to calculate property taxes. They must typically be applied for annually or upon first purchase. Many states offer enhanced exemptions for seniors, veterans, and disabled homeowners. Filing is often required by April 1–June 1 for the current tax year.',
    related: ['property-tax-rate-by-state', 'home-affordability-quick-check', 'first-time-homebuyer-programs'],
  },
  {
    slug: 'closing-cost-guide',
    title: 'Closing Cost Guide by State',
    desc: 'Average closing costs by state for buyers and sellers in 2025.',
    cat: 'real-estate',
    icon: '📄',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Average Closing Costs (2025)', content: [
        { label: 'National average (buyer)', value: '$6,000–$10,000 (2–5% of loan amount)' },
        { label: 'Washington DC (highest)', value: '$29,888 average (per ClosingCorp)' },
        { label: 'Delaware', value: '$17,500 average' },
        { label: 'New York', value: '$16,800 average' },
        { label: 'Maryland', value: '$14,700 average' },
        { label: 'Vermont', value: '$14,200 average' },
        { label: 'Pennsylvania', value: '$9,100 average' },
        { label: 'Missouri (lowest)', value: '$2,000 average' },
        { label: 'Indiana', value: '$2,200 average' },
        { label: 'Kentucky', value: '$2,100 average' },
        { label: 'Common buyer costs', value: 'Origination, appraisal, title insurance, prepaids, escrow' },
        { label: 'Common seller costs', value: 'Agent commission (3–6%), transfer taxes, title, attorney' },
        { label: 'Seller concessions', value: 'Up to 6% (FHA/USDA), 4% (VA), 3% conventional' },
      ]
    }],
    about: 'Closing costs are the fees paid when transferring property ownership. Real estate transfer taxes vary wildly by state — Pennsylvania charges 2% (1% state + 1% local); Nevada charges $1.95/$500 of value. Buyers can negotiate seller concessions to cover some closing costs, particularly in slower markets.',
    related: ['moving-cost-estimator', 'mortgage-rate-comparison', 'home-affordability-quick-check'],
  },
  {
    slug: 'moving-cost-estimator',
    title: 'Moving Cost Estimator',
    desc: 'Estimate total moving costs based on distance and home size.',
    cat: 'real-estate',
    icon: '🚛',
    toolType: 'estimator',
    fields: [
      { k: 'distance', l: 'Moving Distance (miles)', type: 'number', placeholder: '500' },
      {
        k: 'home_size',
        l: 'Home Size',
        type: 'select',
        options: [
          { value: 'studio', label: 'Studio / 1BR' },
          { value: '2br', label: '2 Bedroom' },
          { value: '3br', label: '3 Bedroom' },
          { value: '4br', label: '4+ Bedroom' },
        ],
      },
      {
        k: 'move_type',
        l: 'Move Type',
        type: 'select',
        options: [
          { value: 'full', label: 'Full service (movers pack + move)' },
          { value: 'labor', label: 'Labor only (you rent truck)' },
          { value: 'pod', label: 'POD / portable container' },
        ],
      },
    ],
    fn: (inputs) => {
      const dist = parseFloat(inputs.distance) || 0
      const sizeMultiplier: Record<string, number> = { studio: 1, '2br': 1.5, '3br': 2, '4br': 3 }
      const sizeMult = sizeMultiplier[inputs.home_size] || 1
      let baseCost: number
      if (inputs.move_type === 'full') baseCost = (800 + dist * 0.8) * sizeMult
      else if (inputs.move_type === 'labor') baseCost = (200 + dist * 0.2) * sizeMult + 200 // truck rental
      else baseCost = (400 + dist * 0.5) * sizeMult
      const low = baseCost * 0.8, high = baseCost * 1.4
      return [{
        type: 'table', label: 'Moving Cost Estimate', content: [
          { label: 'Estimated range', value: `$${Math.round(low).toLocaleString()} – $${Math.round(high).toLocaleString()}` },
          { label: 'Move type', value: inputs.move_type === 'full' ? 'Full service movers' : inputs.move_type === 'labor' ? 'Labor + truck rental' : 'POD container' },
          { label: 'Tips', value: 'Book 6–8 weeks ahead; avoid month-end peak pricing' },
          { label: 'Tax deduction', value: 'Moving expenses deductible only for active military (post-2018)' },
          { label: 'Hidden costs', value: 'Packing materials, storage, utility setup, cleaning' },
        ]
      }]
    },
    about: 'Local moves (under 100 miles) average $1,400–$1,700; long-distance moves average $4,800–$7,500 for a 3-bedroom home (AMSA data). Peak moving season (May–September) costs 10–25% more. Get at least 3 binding quotes from AMSA-member carriers.',
    related: ['closing-cost-guide', 'home-buying-checklist', 'home-maintenance-budget-calculator'],
  },
  {
    slug: 'home-maintenance-budget-calculator',
    title: 'Home Maintenance Budget Calculator',
    desc: 'Calculate annual home maintenance budget based on home value and age.',
    cat: 'real-estate',
    icon: '🔧',
    toolType: 'estimator',
    fields: [
      { k: 'home_value', l: 'Home Value', type: 'number', placeholder: '400000', unit: '$' },
      { k: 'home_age', l: 'Home Age (years)', type: 'number', placeholder: '15' },
      { k: 'sq_ft', l: 'Square Footage', type: 'number', placeholder: '1800' },
    ],
    fn: (inputs) => {
      const value = parseFloat(inputs.home_value) || 0, age = parseFloat(inputs.home_age) || 0, sqft = parseFloat(inputs.sq_ft) || 0
      const rule1pct = value * 0.01 // 1% rule
      const sqftRule = sqft * 1.50 // $1.50/sq ft rule
      const ageFactor = 1 + Math.max(0, age - 10) * 0.02 // older homes cost more
      const recommended = ((rule1pct + sqftRule) / 2) * ageFactor
      const major = { roof: '20–30 years ($10,000–$20,000)', hvac: '15–25 years ($5,000–$12,000)', waterHeater: '8–12 years ($800–$2,500)', appliances: '10–15 years ($500–$2,000 each)' }
      return [{
        type: 'table', label: 'Annual Maintenance Budget', content: [
          { label: '1% rule estimate', value: `$${rule1pct.toFixed(0)}/year` },
          { label: '$1.50/sq ft estimate', value: `$${sqftRule.toFixed(0)}/year` },
          { label: 'Recommended budget (age-adjusted)', value: `$${recommended.toFixed(0)}/year` },
          { label: 'Monthly set-aside', value: `$${(recommended / 12).toFixed(0)}/month` },
          { label: 'Roof replacement (next 25 yr)', value: '$10,000–$20,000' },
          { label: 'HVAC replacement', value: '$5,000–$12,000' },
          { label: 'Emergency fund for home', value: `$${(value * 0.02).toFixed(0)} recommended` },
        ]
      }]
    },
    about: 'The 1% rule suggests budgeting 1% of home value annually for maintenance. Older and larger homes often need more. Major systems (HVAC, roof, water heater) have predictable lifespans — plan for these capital expenditures separately from routine maintenance.',
    related: ['home-inspection-checklist', 'home-buying-checklist', 'renovation-roi-guide'],
  },
  {
    slug: 'renovation-roi-guide',
    title: 'Home Renovation ROI Guide',
    desc: 'Average return on investment for common home renovation projects at resale.',
    cat: 'real-estate',
    icon: '🏗️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Renovation ROI at Resale (2025, Remodeling Magazine)', content: [
        { label: 'Garage door replacement', value: '194% ROI — highest nationally' },
        { label: 'HVAC electrification upgrade', value: '103% ROI' },
        { label: 'Entry door (steel) replacement', value: '188% ROI' },
        { label: 'Wood deck addition', value: '82% ROI' },
        { label: 'Minor kitchen remodel (midrange)', value: '85% ROI' },
        { label: 'Siding replacement (fiber cement)', value: '88% ROI' },
        { label: 'Window replacement (vinyl)', value: '67% ROI' },
        { label: 'Major kitchen remodel (midrange)', value: '49% ROI' },
        { label: 'Bathroom addition', value: '53% ROI' },
        { label: 'Master suite addition', value: '36% ROI' },
        { label: 'Primary bath remodel (upscale)', value: '41% ROI' },
        { label: 'Backup power generator', value: '82% ROI' },
        { label: 'Landscape curb appeal', value: '100%+ ROI (highest impact per dollar)' },
      ]
    }],
    about: 'ROI varies significantly by region, neighborhood, and market conditions. Renovations in high-value markets (Manhattan, San Francisco) often return less than 50 cents on the dollar. Cosmetic improvements (paint, landscaping, staging) consistently offer the best returns. Never over-improve relative to comparable homes.',
    related: ['home-maintenance-budget-calculator', 'home-inspection-checklist', 'home-staging-cost-estimator'],
  },
  {
    slug: 'home-insurance-estimator',
    title: 'Home Insurance Cost Estimator',
    desc: 'Estimate annual home insurance premium based on location, value, and risk factors.',
    cat: 'real-estate',
    icon: '🛡️',
    toolType: 'estimator',
    fields: [
      { k: 'home_value', l: 'Home Replacement Value', type: 'number', placeholder: '400000', unit: '$' },
      {
        k: 'state_risk',
        l: 'Risk Region',
        type: 'select',
        options: [
          { value: '0.7', label: 'Low risk (ND, SD, MT)' },
          { value: '1.0', label: 'Average (national average)' },
          { value: '1.5', label: 'Moderate risk (CO, IL, MN)' },
          { value: '2.2', label: 'High risk (TX, KS, OK tornado belt)' },
          { value: '3.0', label: 'Very high risk (FL, LA, MS hurricane/storm)' },
        ],
      },
    ],
    fn: (inputs) => {
      const value = parseFloat(inputs.home_value) || 0, riskFactor = parseFloat(inputs.state_risk) || 1
      const baseRate = 0.0035 // national average ~$1,400/$400K
      const premium = value * baseRate * riskFactor
      const liability = 100 // add liability component
      const total = premium + liability
      return [{
        type: 'table', label: 'Annual Insurance Estimate', content: [
          { label: 'Estimated annual premium', value: `$${total.toFixed(0)}` },
          { label: 'Monthly cost', value: `$${(total / 12).toFixed(0)}` },
          { label: 'Standard liability coverage', value: '$100,000–$300,000' },
          { label: 'Typical deductible', value: '$1,000–$2,500 (higher deductible = lower premium)' },
          { label: 'Florida surcharge note', value: 'FL rates 2–4× national average; many insurers exiting' },
          { label: 'Bundling discount', value: '5–15% with auto insurance from same carrier' },
        ]
      }]
    },
    about: 'The national average home insurance premium was $2,151/year in 2024 — up 21% from 2022. Florida, California (wildfire zones), and Louisiana face the highest rates and insurer exits. Standard policies (HO-3) cover the structure (dwelling), personal property, and liability but exclude floods and earthquakes.',
    related: ['flood-zone-checker-guide', 'property-tax-rate-by-state', 'home-affordability-quick-check'],
  },
  {
    slug: 'home-inspection-checklist',
    title: 'Home Inspection Checklist',
    desc: 'Essential items to check during a home inspection before purchasing.',
    cat: 'real-estate',
    icon: '🔎',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Home Inspection Priority Items', content: [
        { label: 'Roof condition', value: 'Age, missing shingles, flashing, gutters, drainage' },
        { label: 'Foundation', value: 'Cracks, settling, moisture intrusion, bowing walls' },
        { label: 'HVAC systems', value: 'Age, last service, BTU sizing, ductwork condition' },
        { label: 'Plumbing', value: 'Water pressure, drain speed, water heater age, visible leaks' },
        { label: 'Electrical', value: 'Panel age/capacity, GFCI outlets, aluminum wiring (pre-1974)' },
        { label: 'Attic / insulation', value: 'R-value, vapor barrier, ventilation, signs of pests' },
        { label: 'Windows & doors', value: 'Seals, operation, weatherstripping, egress compliance' },
        { label: 'Basement / crawlspace', value: 'Water intrusion, mold, insulation, sump pump' },
        { label: 'Exterior', value: 'Grading (water drains away), siding condition, deck safety' },
        { label: 'Appliances', value: 'Age, function, gas connections, ventilation' },
        { label: 'Radon test', value: 'EPA recommends testing all homes; mitigated easily' },
        { label: 'Sewer scope', value: 'Recommended for homes 20+ years old' },
      ]
    }],
    about: 'A standard home inspection costs $300–$600 and covers visible and accessible components. Always hire an ASHI or NACHI-certified inspector. Request a thermal imaging option for detecting moisture and insulation gaps. The inspection contingency allows you to negotiate repairs or withdraw from the contract.',
    related: ['home-buying-checklist', 'renovation-roi-guide', 'home-maintenance-budget-calculator'],
  },
  {
    slug: 'home-buying-checklist',
    title: 'Home Buying Checklist',
    desc: 'Step-by-step checklist from pre-approval to closing day.',
    cat: 'real-estate',
    icon: '✅',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Home Buying Process Checklist', content: [
        { label: '1. Check credit score', value: 'Pull free report at AnnualCreditReport.com; fix errors' },
        { label: '2. Calculate budget', value: 'Down payment, closing costs, reserve fund (2–3 months PITI)' },
        { label: '3. Get pre-approved', value: 'Compare 3+ lenders; pre-approval = commitment letter' },
        { label: '4. Choose a buyer\'s agent', value: 'Interview 2–3; commission now negotiable post-NAR settlement' },
        { label: '5. Search homes', value: 'Define must-haves vs nice-to-haves; visit in person' },
        { label: '6. Make an offer', value: 'Review comps; include contingencies (inspection, financing, appraisal)' },
        { label: '7. Negotiate', value: 'Counter-offers, seller concessions, repair requests' },
        { label: '8. Schedule inspection', value: 'Within 5–10 days of accepted offer (due diligence period)' },
        { label: '9. Complete appraisal', value: 'Ordered by lender; must meet or exceed purchase price' },
        { label: '10. Clear contingencies', value: 'Inspection, appraisal, financing; title search' },
        { label: '11. Final walkthrough', value: '24–48 hours before closing' },
        { label: '12. Close and get keys', value: 'Bring ID, wire funds; sign documents' },
      ]
    }],
    about: 'The NAR settlement (2024) changed how buyer agent commissions work — buyers now negotiate and pay their agent separately, though sellers can still offer concessions. The average home purchase takes 30–60 days from offer to close. Cash offers close faster (2–3 weeks).',
    related: ['home-inspection-checklist', 'closing-cost-guide', 'home-affordability-quick-check'],
  },
  {
    slug: 'flood-zone-checker-guide',
    title: 'Flood Zone Reference Guide',
    desc: 'FEMA flood zone categories, flood insurance requirements, and where to check your zone.',
    cat: 'real-estate',
    icon: '🌊',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'FEMA Flood Zone Reference', content: [
        { label: 'Zone A / AE / AH / AO', value: 'High risk — flood insurance required by lenders' },
        { label: 'Zone V / VE', value: 'Coastal high risk — flood insurance required; highest rates' },
        { label: 'Zone X (shaded)', value: 'Moderate risk — flood insurance recommended' },
        { label: 'Zone X (unshaded)', value: 'Minimal risk — flood insurance optional' },
        { label: 'Zone D', value: 'Undetermined risk' },
        { label: 'NFIP average premium', value: '~$1,000–$1,500/year for moderate zone' },
        { label: 'High-risk zone premiums', value: '$2,000–$10,000+/year' },
        { label: 'Check your zone', value: 'msc.fema.gov/portal (FEMA Flood Map Service Center)' },
        { label: 'LOMA request', value: 'Letter of Map Amendment: apply if property is incorrectly zoned' },
        { label: 'Elevation certificate', value: 'Required for accurate flood insurance quote in high-risk areas' },
        { label: 'Private flood insurance', value: 'Often cheaper than NFIP for newer homes' },
      ]
    }],
    about: 'About 25% of flood insurance claims come from properties outside high-risk flood zones. FEMA\'s Risk Rating 2.0 (2021) now prices flood insurance based on individual property risk rather than just flood zone. Many properties saw premium increases; some saw decreases.',
    related: ['home-insurance-estimator', 'hurricane-risk-by-state', 'earthquake-risk-by-state'],
  },
  {
    slug: 'earthquake-risk-by-state',
    title: 'Earthquake Risk by State',
    desc: 'Seismic hazard levels by state and earthquake insurance considerations.',
    cat: 'real-estate',
    icon: '🌍',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Earthquake Risk by State', content: [
        { label: 'Alaska', value: 'Extreme — most seismically active state' },
        { label: 'California', value: 'Very High — San Andreas, Hayward, other major faults' },
        { label: 'Oregon / Washington', value: 'High — Cascadia subduction zone (M9.0+ risk)' },
        { label: 'Nevada', value: 'High — multiple active fault zones' },
        { label: 'Utah', value: 'Moderate-High — Wasatch Front fault' },
        { label: 'Idaho / Montana', value: 'Moderate — intermountain seismic belt' },
        { label: 'Missouri / Illinois (New Madrid)', value: 'Moderate — New Madrid Seismic Zone (historic M8.0)' },
        { label: 'South Carolina', value: 'Moderate — Charleston 1886 M7.0 event' },
        { label: 'Texas', value: 'Low-Moderate (increased due to injection wells)' },
        { label: 'Most of eastern US', value: 'Low' },
        { label: 'Earthquake insurance', value: 'Not covered by standard HO-3; separate policy required' },
        { label: 'California EQ insurance', value: 'CEA offers policies; deductibles 10–25% of dwelling' },
      ]
    }],
    about: 'Standard homeowner\'s insurance does not cover earthquake damage. The USGS National Seismic Hazard Maps are updated periodically. Cascadia subduction zone earthquakes could reach M9.0, capable of significant damage across the Pacific Northwest. Earthquake insurance deductibles are typically 10–25% of dwelling value.',
    related: ['hurricane-risk-by-state', 'flood-zone-checker-guide', 'home-insurance-estimator'],
  },
  {
    slug: 'hurricane-risk-by-state',
    title: 'Hurricane Risk by State',
    desc: 'Historical hurricane frequency and impact by coastal state.',
    cat: 'real-estate',
    icon: '🌀',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Hurricane Risk by State', content: [
        { label: 'Florida', value: 'Extreme — most hurricane landfalls in US history' },
        { label: 'Texas', value: 'Very High — Gulf Coast exposure; Harvey (2017), Ike (2008)' },
        { label: 'Louisiana', value: 'Very High — Katrina (2005), Ida (2021)' },
        { label: 'North Carolina', value: 'High — Outer Banks exposure; Florence (2018)' },
        { label: 'South Carolina', value: 'High — Hugo (1989), Dorian (2019)' },
        { label: 'Georgia', value: 'Moderate — Inland from coast, still at risk' },
        { label: 'Alabama / Mississippi', value: 'High — Gulf Coast; regular tropical storm impacts' },
        { label: 'Virginia / Maryland', value: 'Moderate — strengthening storms reaching further north' },
        { label: 'New York / New Jersey', value: 'Low-Moderate — Sandy (2012) showed Northeast vulnerability' },
        { label: 'New England', value: 'Low — but weakening storms still cause damage' },
        { label: 'Hurricane insurance', value: 'Separate windstorm policy often required in high-risk areas' },
        { label: 'Post-storm claims tip', value: 'Document all damage before cleanup; file promptly' },
      ]
    }],
    about: 'Florida has been struck by more hurricanes (120+) than any other US state. The 2024 Atlantic hurricane season was the second-most active on record. Climate change is intensifying hurricane rainfall rates and rapid intensification. Wind and storm surge are typically the most damaging components.',
    related: ['flood-zone-checker-guide', 'earthquake-risk-by-state', 'home-insurance-estimator'],
  },
  {
    slug: 'hoa-red-flags-checklist',
    title: 'HOA Red Flags Checklist',
    desc: 'Warning signs to investigate before buying in an HOA community.',
    cat: 'real-estate',
    icon: '⚠️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'HOA Red Flags to Check', content: [
        { label: 'Low reserve fund', value: 'Under 10% fully funded = likely special assessment risk' },
        { label: 'Frequent special assessments', value: 'Indicates poor financial planning or deferred maintenance' },
        { label: 'High delinquency rate', value: 'Over 5% units not paying = financial instability' },
        { label: 'Pending litigation', value: 'Ask board; undisclosed lawsuits can affect mortgage approval' },
        { label: 'Recent large assessment', value: 'May have resolved a problem OR signal systemic issues' },
        { label: 'No professional management', value: 'Self-managed HOAs are higher risk without expertise' },
        { label: 'Overly restrictive rules', value: 'Review CC&Rs before offer — you must comply with all rules' },
        { label: 'High monthly HOA fee', value: 'Over $500/month adds $60K to effective 30-year cost' },
        { label: 'No recent meeting minutes', value: 'Unresponsive board is a management red flag' },
        { label: 'FHA or VA approval', value: 'Condo buildings must be FHA/VA approved for financing' },
        { label: 'Capital reserve study', value: 'Request the most recent study; see projected expenses' },
        { label: 'Rental restrictions', value: 'Many HOAs limit rentals; check if investment is allowed' },
      ]
    }],
    about: 'The Florida condo collapse (2021) focused national attention on HOA reserve funds. Florida passed SB 4-D (2022) requiring structural inspections and funded reserves for condo buildings 3+ stories. Always request 2+ years of HOA meeting minutes, financials, and the reserve study before closing.',
    related: ['condo-vs-house-comparison', 'home-buying-checklist', 'home-inspection-checklist'],
  },
  {
    slug: 'condo-vs-house-comparison',
    title: 'Condo vs House Comparison',
    desc: 'Compare the financial and lifestyle differences between buying a condo and a house.',
    cat: 'real-estate',
    icon: '🏢',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Condo vs House Comparison', content: [
        { label: 'Purchase price (same location)', value: 'Condos typically 10–30% less than comparable house' },
        { label: 'HOA fees', value: 'Condos: $200–$1,000+/month; Houses: often $0 or $50–$300/month' },
        { label: 'Maintenance responsibility', value: 'Condo: exterior handled by HOA; House: owner responsible' },
        { label: 'Property tax', value: 'Condos often lower (land value split); varies by market' },
        { label: 'Insurance (HO-6 vs HO-3)', value: 'Condo HO-6 covers interior only; typically cheaper' },
        { label: 'Privacy / noise', value: 'Houses offer more privacy; condos have shared walls' },
        { label: 'Amenities', value: 'Condos often include gym, pool, concierge' },
        { label: 'Investment control', value: 'Houses: full control; Condos: HOA decisions affect value' },
        { label: 'Resale liquidity', value: 'Houses often easier to sell; condos depend on HOA health' },
        { label: 'Pet restrictions', value: 'Many condos restrict pet size/breed' },
        { label: 'Financing', value: 'Condo requires FHA/VA approval for those loans' },
        { label: 'Best for', value: 'Condo: urban lifestyle, low maintenance; House: family, pets, customization' },
      ]
    }],
    about: 'HOA fees can significantly impact affordability — a $500/month HOA fee costs $180,000 over 30 years. However, it covers exterior maintenance you\'d otherwise pay out of pocket. In high-cost markets (Manhattan, Miami Beach, San Francisco), condos are often the only viable ownership option.',
    related: ['hoa-red-flags-checklist', 'home-buying-checklist', 'closing-cost-guide'],
  },
  {
    slug: 'landlord-tenant-laws-by-state',
    title: 'Landlord-Tenant Laws by State',
    desc: 'Key landlord-tenant law provisions by state — notice periods, security deposits, and entry rules.',
    cat: 'real-estate',
    icon: '📜',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Landlord-Tenant Law Reference (2025)', content: [
        { label: 'California — security deposit max', value: '1 month (AB 12, 2024)' },
        { label: 'New York — security deposit max', value: '1 month (2019 Housing Stability Act)' },
        { label: 'Texas — security deposit max', value: 'No statutory limit' },
        { label: 'Florida — security deposit return deadline', value: '15 days (no deductions) or 30 days (with deductions)' },
        { label: 'California — entry notice', value: '24 hours except emergency' },
        { label: 'New York — entry notice', value: 'Reasonable notice (24 hours customary)' },
        { label: 'Texas — notice to terminate month-to-month', value: '30 days (either party)' },
        { label: 'California — rent increase notice', value: '10% or less: 30 days; over 10%: 90 days' },
        { label: 'Oregon — rent increase limits', value: '10% cap per year (with exceptions)' },
        { label: 'Rent control states', value: 'CA, NY, NJ, OR, MD, DC + some cities' },
        { label: 'Source of income discrimination', value: 'Illegal in 20+ states (prohibits rejecting housing vouchers)' },
      ]
    }],
    about: 'Landlord-tenant law is primarily state and local. New York City\'s Rent Stabilization Law covers ~1 million apartments. Oregon was the first state to enact statewide rent control (2019). California\'s AB 1482 (2020) caps rent increases at CPI + 5% for qualifying buildings.',
    related: ['security-deposit-limits-by-state', 'rent-increase-limits-by-state', 'eviction-process-by-state'],
  },
  {
    slug: 'security-deposit-limits-by-state',
    title: 'Security Deposit Limits by State',
    desc: 'Maximum security deposit limits and return deadlines for all 50 states.',
    cat: 'real-estate',
    icon: '🔒',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Security Deposit Limits (2025)', content: [
        { label: 'California', value: '1 month (1 month limit as of 2024)' },
        { label: 'New York', value: '1 month' },
        { label: 'Massachusetts', value: '1 month' },
        { label: 'Connecticut', value: '2 months (1 month if 62+)' },
        { label: 'Maryland', value: '2 months (1 month if 60+)' },
        { label: 'New Jersey', value: '1.5 months' },
        { label: 'Florida', value: 'No statutory limit' },
        { label: 'Texas', value: 'No statutory limit' },
        { label: 'Nevada', value: '3 months (unfurnished)' },
        { label: 'Pennsylvania', value: '2 months (1 month after 1st year)' },
        { label: 'Return deadline (CA)', value: '21 days with itemized statement' },
        { label: 'Return deadline (TX)', value: '30 days' },
        { label: 'Return deadline (FL)', value: '15 days (no deductions) / 30 days (with deductions)' },
        { label: 'Penalty for late return', value: 'Typically 2× or 3× deposit + attorney fees' },
      ]
    }],
    about: 'California reduced its security deposit limit from 2 months to 1 month in 2024 (AB 12). Landlords must return deposits with an itemized statement within the state deadline. Normal wear and tear cannot be deducted; only damage beyond normal use.',
    related: ['landlord-tenant-laws-by-state', 'rent-increase-limits-by-state', 'tenant-rights-guide'],
  },
  {
    slug: 'rent-increase-limits-by-state',
    title: 'Rent Increase Limits by State 2025',
    desc: 'States with rent control or rent stabilization laws and applicable limits.',
    cat: 'real-estate',
    icon: '📈',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Rent Increase Laws (2025)', content: [
        { label: 'California (AB 1482)', value: 'CPI + 5% per year max; units 15+ years old, exempt single-family' },
        { label: 'Oregon (state-wide)', value: '10% max per year (buildings 15+ years old)' },
        { label: 'New York City (stabilized)', value: 'RGBO sets annual limits (1% for 1-year renewal, 2024)' },
        { label: 'New Jersey', value: 'Local ordinance; many cities cap at 4–7%' },
        { label: 'Maryland (Montgomery Co.)', value: 'CPI cap' },
        { label: 'District of Columbia', value: 'CPI + 2% for most units; 10% for exempt' },
        { label: 'Washington (state)', value: 'No statewide rent control (preempted by statute)' },
        { label: 'Texas', value: 'Rent control prohibited by state law' },
        { label: 'Florida', value: 'Rent control preempted by state law (since 2023)' },
        { label: 'Most other states', value: 'No rent control; market rate increases allowed' },
        { label: 'Notice required (most states)', value: '30–90 days for rent increases (30+ days common)' },
      ]
    }],
    about: 'Rent control is a politically contentious housing policy. Proponents argue it protects tenant stability; economists generally find it reduces housing supply by discouraging new construction and encouraging landlords to convert to condos or short-term rentals.',
    related: ['landlord-tenant-laws-by-state', 'security-deposit-limits-by-state', 'eviction-process-by-state'],
  },
  {
    slug: 'eviction-process-by-state',
    title: 'Eviction Process by State',
    desc: 'Key eviction notice periods, court timelines, and tenant rights by state.',
    cat: 'real-estate',
    icon: '⚖️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Eviction Timeline Reference', content: [
        { label: 'Non-payment notice (most states)', value: '3–14 days to pay or quit' },
        { label: 'California — non-payment', value: '3-day pay or quit notice' },
        { label: 'New York — non-payment', value: '14-day notice (Rent Stabilization Act 2019)' },
        { label: 'Texas — non-payment', value: '3-day notice' },
        { label: 'Florida — non-payment', value: '3-day notice' },
        { label: 'No-fault eviction (CA)', value: '60-day notice (tenant lived 1+ year)' },
        { label: 'No-fault eviction (NYC)', value: 'Very limited under 2019 law' },
        { label: 'Court hearing (varies)', value: '1–6 weeks after filing' },
        { label: 'Lock change after court order', value: 'Sheriff enforces; typically 1–4 weeks post-judgment' },
        { label: 'Total eviction timeline', value: '30 days (TX/FL) to 18+ months (NYC with appeals)' },
        { label: 'Illegal eviction (self-help)', value: 'Changing locks/shutting utilities without court order — illegal everywhere' },
      ]
    }],
    about: 'New York City eviction proceedings can take 12–18 months due to court backlogs and tenant protection laws. Texas and Florida have among the fastest processes — 30–45 days from notice to possession. The CDC eviction moratorium during COVID highlighted how local eviction laws varied dramatically.',
    related: ['landlord-tenant-laws-by-state', 'tenant-rights-guide', 'rent-increase-limits-by-state'],
  },
  {
    slug: 'tenant-rights-guide',
    title: 'Tenant Rights Guide',
    desc: 'Core tenant rights all renters should know — repairs, privacy, discrimination, and more.',
    cat: 'real-estate',
    icon: '🏠',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Universal Tenant Rights', content: [
        { label: 'Implied warranty of habitability', value: 'Landlord must maintain livable conditions (all 50 states)' },
        { label: 'Repair and deduct', value: 'Available in ~35 states if landlord fails to make essential repairs' },
        { label: 'Rent withholding', value: 'Available in some states for uninhabitable conditions' },
        { label: 'Fair Housing Act', value: 'Prohibits discrimination: race, color, religion, sex, national origin, familial status, disability' },
        { label: 'Reasonable accommodation', value: 'Landlords must allow modifications for disabled tenants (FHA)' },
        { label: 'Privacy / entry notice', value: '24–48 hours advance notice required (most states)' },
        { label: 'Retaliation protection', value: 'Illegal to evict or raise rent after tenant complains about conditions' },
        { label: 'Security deposit accounting', value: 'Itemized deductions required; normal wear and tear exempt' },
        { label: 'Lease renewal rights', value: 'Varies by state; rent-stabilized units have stronger renewal rights' },
        { label: 'Domestic violence protections', value: 'Many states allow lease termination without penalty' },
      ]
    }],
    about: 'Tenants have strong federal protections under the Fair Housing Act. Many states and cities add additional protections. The "warranty of habitability" — a doctrine requiring landlords to maintain habitable conditions — is implied in residential leases in all 50 states.',
    related: ['landlord-tenant-laws-by-state', 'security-deposit-limits-by-state', 'eviction-process-by-state'],
  },
  {
    slug: 'airbnb-profitability-estimator',
    title: 'Airbnb Profitability Estimator',
    desc: 'Estimate short-term rental income, expenses, and net profit for a property.',
    cat: 'real-estate',
    icon: '🏡',
    toolType: 'estimator',
    fields: [
      { k: 'nightly_rate', l: 'Average Nightly Rate', type: 'number', placeholder: '150', unit: '$' },
      { k: 'occupancy', l: 'Occupancy Rate (%)', type: 'number', placeholder: '65', unit: '%' },
      { k: 'mortgage', l: 'Monthly Mortgage/Rent', type: 'number', placeholder: '2000', unit: '$' },
      { k: 'other_expenses', l: 'Monthly Operating Expenses', type: 'number', placeholder: '400', unit: '$' },
    ],
    fn: (inputs) => {
      const rate = parseFloat(inputs.nightly_rate) || 0, occ = (parseFloat(inputs.occupancy) || 65) / 100, mortgage = parseFloat(inputs.mortgage) || 0, expenses = parseFloat(inputs.other_expenses) || 0
      const monthlyRevenue = rate * occ * 30.44
      const airbnbFee = monthlyRevenue * 0.03 // Airbnb host fee ~3%
      const cleaningEst = (occ * 30.44) / 3 * 80 // assume 3-day stays, $80 clean
      const totalExpenses = mortgage + expenses + airbnbFee + cleaningEst
      const netProfit = monthlyRevenue - totalExpenses
      const annualNet = netProfit * 12
      return [{
        type: 'table', label: 'Monthly STR Analysis', content: [
          { label: 'Gross monthly revenue', value: `$${monthlyRevenue.toFixed(0)}` },
          { label: 'Airbnb host fee (~3%)', value: `-$${airbnbFee.toFixed(0)}` },
          { label: 'Cleaning costs (est.)', value: `-$${cleaningEst.toFixed(0)}` },
          { label: 'Mortgage / rent', value: `-$${mortgage.toFixed(0)}` },
          { label: 'Other expenses', value: `-$${expenses.toFixed(0)}` },
          { label: 'Monthly net profit', value: `$${netProfit.toFixed(0)}` },
          { label: 'Annual net profit', value: `$${annualNet.toFixed(0)}` },
        ]
      }]
    },
    about: 'Short-term rentals earn 2–3× long-term rental income in most markets but have higher operating costs and more management burden. AirDNA and Mashvisor provide market-level occupancy and rate data by ZIP code. Many cities restrict STRs — always verify local regulations.',
    related: ['short-term-rental-regulations-guide', 'landlord-checklist', 'rental-application-checklist'],
  },
  {
    slug: 'short-term-rental-regulations-guide',
    title: 'Short-Term Rental Regulations Guide',
    desc: 'Overview of STR restrictions in major US cities.',
    cat: 'real-estate',
    icon: '📋',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Short-Term Rental Regulations by City', content: [
        { label: 'New York City', value: 'Primary residence only; host must be present; max 2 guests' },
        { label: 'Los Angeles', value: 'Primary residence only; registration required; 120-day cap for non-hosted' },
        { label: 'San Francisco', value: 'Primary residence only; registration required; 90-day annual cap' },
        { label: 'Nashville', value: 'Owner-occupied: unlimited; non-owner: banned in residential zones' },
        { label: 'New Orleans', value: 'Strict licensing; banned in many neighborhoods' },
        { label: 'Miami', value: 'Local ordinances; unincorporated Miami-Dade allows with permit' },
        { label: 'Denver', value: 'Primary residence only; registration required' },
        { label: 'Austin', value: 'Registration required; Type 2 (investment property) limited to 3% of lots' },
        { label: 'Phoenix / Scottsdale', value: 'Arizona preempts local bans; state-level regulations only' },
        { label: 'Florida statewide', value: 'STRs generally allowed; state preempts stricter local rules' },
        { label: 'HOA restrictions', value: 'Many HOAs ban STRs regardless of city rules — check CC&Rs' },
      ]
    }],
    about: 'New York City\'s Local Law 18 (2023) effectively banned most Airbnb rentals by requiring hosts to be present. Occupancy dropped 80%+ in NYC after enforcement began. Several states (Arizona, Florida, Texas) preempt localities from banning STRs, creating favorable environments for investors.',
    related: ['airbnb-profitability-estimator', 'landlord-checklist', 'hoa-red-flags-checklist'],
  },
  {
    slug: 'realtor-commission-calculator',
    title: 'Realtor Commission Calculator',
    desc: 'Calculate estimated real estate agent commissions at various rates.',
    cat: 'real-estate',
    icon: '🤝',
    toolType: 'estimator',
    fields: [
      { k: 'home_price', l: 'Sale Price', type: 'number', placeholder: '400000', unit: '$' },
      { k: 'commission', l: 'Total Commission Rate (%)', type: 'number', placeholder: '5', unit: '%' },
    ],
    fn: (inputs) => {
      const price = parseFloat(inputs.home_price) || 0, rate = (parseFloat(inputs.commission) || 5) / 100
      const totalComm = price * rate
      const sellerComm = totalComm / 2
      const buyerComm = totalComm / 2
      const netProceeds = price - totalComm
      return [{
        type: 'table', label: 'Commission Breakdown', content: [
          { label: 'Sale price', value: `$${price.toLocaleString()}` },
          { label: 'Total commission', value: `$${totalComm.toFixed(0)} (${(rate * 100).toFixed(1)}%)` },
          { label: 'Listing agent portion', value: `$${sellerComm.toFixed(0)}` },
          { label: 'Buyer agent portion', value: `$${buyerComm.toFixed(0)} (now negotiable post-NAR)` },
          { label: 'Net to seller', value: `$${netProceeds.toFixed(0)}` },
          { label: 'Average rate post-NAR (2025)', value: '4.5%–5.5% (down from 5–6%)' },
        ]
      }]
    },
    about: 'The NAR settlement (August 2024) requires buyer agent commissions to be negotiated separately and not offered on MLS. This decoupled commissions — sellers no longer must offer buyer agent compensation, though most still do to attract buyers. Average total commissions fell from 5.7% to approximately 4.5–5.5%.',
    related: ['home-sale-net-proceeds-calculator', 'closing-cost-guide', 'capital-gains-exclusion-calculator'],
  },
  {
    slug: 'capital-gains-exclusion-calculator',
    title: 'Home Sale Capital Gains Exclusion Calculator',
    desc: 'Calculate tax owed on home sale profit after the $250K/$500K primary residence exclusion.',
    cat: 'real-estate',
    icon: '💰',
    toolType: 'estimator',
    fields: [
      { k: 'purchase_price', l: 'Purchase Price', type: 'number', placeholder: '300000', unit: '$' },
      { k: 'improvements', l: 'Capital Improvements Made', type: 'number', placeholder: '30000', unit: '$' },
      { k: 'sale_price', l: 'Sale Price', type: 'number', placeholder: '550000', unit: '$' },
      { k: 'selling_costs', l: 'Selling Costs (commissions, closing)', type: 'number', placeholder: '25000', unit: '$' },
      {
        k: 'filing',
        l: 'Filing Status',
        type: 'select',
        options: [{ value: '250000', label: 'Single ($250K exclusion)' }, { value: '500000', label: 'Married Filing Jointly ($500K exclusion)' }],
      },
    ],
    fn: (inputs) => {
      const purchase = parseFloat(inputs.purchase_price) || 0, improvements = parseFloat(inputs.improvements) || 0, sale = parseFloat(inputs.sale_price) || 0, costs = parseFloat(inputs.selling_costs) || 0, exclusion = parseFloat(inputs.filing) || 250000
      const adjustedBasis = purchase + improvements
      const netProceeds = sale - costs
      const gain = netProceeds - adjustedBasis
      const taxableGain = Math.max(0, gain - exclusion)
      const taxOwed = taxableGain * 0.15 // assume 15% LTCG rate
      return [{
        type: 'table', label: 'Home Sale Tax Analysis', content: [
          { label: 'Adjusted basis', value: `$${adjustedBasis.toLocaleString()}` },
          { label: 'Net sale proceeds', value: `$${netProceeds.toLocaleString()}` },
          { label: 'Total gain', value: `$${gain.toLocaleString()}` },
          { label: 'Section 121 exclusion', value: `$${exclusion.toLocaleString()}` },
          { label: 'Taxable gain', value: `$${taxableGain.toLocaleString()}` },
          { label: 'Estimated capital gains tax (15%)', value: `$${taxOwed.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Requires 2yr primary residence in last 5yr', value: 'Yes (Section 121 requirement)' },
        ]
      }]
    },
    about: 'Section 121 excludes up to $250,000 (single) or $500,000 (MFJ) of gain on primary residence sales, if lived in the home 2 of the past 5 years. Capital improvements (kitchen remodel, roof replacement) increase your cost basis and reduce taxable gain. Keep all receipts.',
    related: ['home-sale-net-proceeds-calculator', 'capital-gains-rates-2025', 'realtor-commission-calculator'],
  },
  {
    slug: 'home-sale-net-proceeds-calculator',
    title: 'Home Sale Net Proceeds Calculator',
    desc: 'Calculate how much you\'ll actually receive after selling your home.',
    cat: 'real-estate',
    icon: '🏷️',
    toolType: 'estimator',
    fields: [
      { k: 'sale_price', l: 'Expected Sale Price', type: 'number', placeholder: '550000', unit: '$' },
      { k: 'mortgage_balance', l: 'Outstanding Mortgage Balance', type: 'number', placeholder: '280000', unit: '$' },
      { k: 'commission_rate', l: 'Realtor Commission Rate (%)', type: 'number', placeholder: '5', unit: '%' },
      { k: 'closing_costs', l: 'Seller Closing Costs (taxes, title, etc.)', type: 'number', placeholder: '8000', unit: '$' },
    ],
    fn: (inputs) => {
      const sale = parseFloat(inputs.sale_price) || 0, mortgage = parseFloat(inputs.mortgage_balance) || 0, commRate = (parseFloat(inputs.commission_rate) || 5) / 100, closing = parseFloat(inputs.closing_costs) || 0
      const commission = sale * commRate
      const netBeforePayoff = sale - commission - closing
      const netProceeds = netBeforePayoff - mortgage
      return [{
        type: 'table', label: 'Net Proceeds', content: [
          { label: 'Sale price', value: `$${sale.toLocaleString()}` },
          { label: 'Realtor commission', value: `-$${commission.toFixed(0)}` },
          { label: 'Closing costs', value: `-$${closing.toLocaleString()}` },
          { label: 'Mortgage payoff', value: `-$${mortgage.toLocaleString()}` },
          { label: 'Net proceeds', value: `$${netProceeds.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
          { label: 'Effective seller cost', value: `${((commission + closing) / sale * 100).toFixed(1)}% of sale price` },
        ]
      }]
    },
    about: 'Sellers typically net 8–10% less than the sale price after commissions and closing costs. States with transfer taxes (NY, PA, MD) add to seller costs. Title insurance, attorney fees, and prorated property taxes make closing costs vary. Request a seller\'s net sheet from your agent before listing.',
    related: ['realtor-commission-calculator', 'capital-gains-exclusion-calculator', 'closing-cost-guide'],
  },
  {
    slug: 'fsbo-guide',
    title: 'For Sale By Owner (FSBO) Guide',
    desc: 'Pros, cons, costs, and process for selling your home without a realtor.',
    cat: 'real-estate',
    icon: '📣',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'FSBO Reference Guide', content: [
        { label: 'Potential commission saved', value: '2.5–3% (listing agent share; may still pay buyer agent)' },
        { label: 'FSBO average sale price vs MLS', value: '~6–16% less (NAR data, disputed by proponents)' },
        { label: 'MLS access options', value: 'Flat-fee MLS services ($200–$1,000) to list without full agent' },
        { label: 'Required disclosures', value: 'Vary by state; seller property disclosure typically required' },
        { label: 'Contract', value: 'Use state-approved contracts; real estate attorney recommended' },
        { label: 'Pricing', value: 'Zillow Zestimate is a starting point; use recent comps (CMA)' },
        { label: 'Photos', value: 'Professional photos increase online views 61% (Redfin)' },
        { label: 'Negotiation', value: 'Buyers know you\'re saving commission; expect lower offers' },
        { label: 'Attorney states', value: 'Some states (NY, MA, CT) require attorney at closing' },
        { label: 'FSBO success rate', value: '77% of FSBOs who try ultimately use an agent' },
        { label: 'Best for', value: 'Pre-found buyer, very hot market, experienced sellers' },
      ]
    }],
    about: 'FSBO sales account for about 7% of home sales (NAR). The financial benefit depends heavily on whether you can sell at full market value without professional marketing. Flat-fee MLS listing services are a middle ground — you get MLS exposure for a few hundred dollars while managing the sale yourself.',
    related: ['realtor-commission-calculator', 'home-sale-net-proceeds-calculator', 'closing-cost-guide'],
  },
  {
    slug: 'home-staging-cost-estimator',
    title: 'Home Staging Cost Estimator',
    desc: 'Estimate professional home staging costs and potential ROI impact.',
    cat: 'real-estate',
    icon: '🪑',
    toolType: 'estimator',
    fields: [
      { k: 'sq_ft', l: 'Square Footage', type: 'number', placeholder: '2000' },
      { k: 'empty', l: 'Is Home Empty (unfurnished)?', type: 'select', options: [{ value: '1', label: 'Yes — fully empty' }, { value: '0', label: 'No — occupied / partially furnished' }] },
      { k: 'list_price', l: 'Expected List Price', type: 'number', placeholder: '450000', unit: '$' },
    ],
    fn: (inputs) => {
      const sqft = parseFloat(inputs.sq_ft) || 0, empty = inputs.empty === '1', listPrice = parseFloat(inputs.list_price) || 0
      const stagingCost = empty ? sqft * 1.5 + 2000 : sqft * 0.4 + 500 // full vs partial
      const roi = listPrice * 0.015 // NAR 2023: staged homes sold for 1-5% more
      const faster = '71% of staged homes sell faster than non-staged (RESA)';
      return [{
        type: 'table', label: 'Staging Cost Analysis', content: [
          { label: 'Estimated staging cost', value: `$${stagingCost.toFixed(0)}` },
          { label: 'Type', value: empty ? 'Full staging (furniture rental)' : 'Occupied/partial staging' },
          { label: 'Expected sale price increase (1.5%)', value: `$${roi.toFixed(0)}` },
          { label: 'Net staging ROI', value: `$${(roi - stagingCost).toFixed(0)}` },
          { label: 'Time on market impact', value: faster },
          { label: 'Occupied home tip', value: 'Declutter, deep clean, neutralize decor = biggest impact' },
        ]
      }]
    },
    about: 'NAR\'s 2023 Profile of Home Staging found that staged homes sell for 1–5% more on average. The median staging investment is $1,500 for occupied homes. Virtual staging ($50–$200/image) is a lower-cost option that works well for online marketing but doesn\'t help in-person showings.',
    related: ['renovation-roi-guide', 'realtor-commission-calculator', 'home-sale-net-proceeds-calculator'],
  },
  {
    slug: 'landlord-checklist',
    title: 'Landlord Checklist',
    desc: 'Essential tasks and documents every landlord needs to manage a rental property.',
    cat: 'real-estate',
    icon: '🏠',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Landlord Essential Checklist', content: [
        { label: 'Lease agreement', value: 'State-specific; include all required disclosures' },
        { label: 'Security deposit accounting', value: 'Separate bank account; document condition at move-in' },
        { label: 'Move-in inspection report', value: 'Photos + written; signed by tenant' },
        { label: 'Lead paint disclosure', value: 'Required federally for pre-1978 homes' },
        { label: 'Property insurance', value: 'Landlord policy (DP3); not homeowner\'s insurance' },
        { label: 'Liability umbrella', value: '$1M+ umbrella policy recommended' },
        { label: 'Business entity', value: 'LLC or LP for liability protection (consult attorney)' },
        { label: 'Rent collection system', value: 'ACH or property management software preferred' },
        { label: 'Maintenance log', value: 'Document all repairs with dates, costs, receipts' },
        { label: 'Annual inspection', value: 'Smoke/CO detectors, HVAC filters, lease renewal' },
        { label: 'Tax records', value: 'Schedule E; depreciation, repairs vs capital improvements' },
        { label: 'Fair housing training', value: 'Avoid advertising language that could violate FHA' },
      ]
    }],
    about: 'Landlord insurance (DP3 policy) covers the structure and lost rental income; it does not cover tenant belongings. LLCs separate personal assets from rental liability but add cost and administrative burden. Many landlords use property management software (Buildium, AppFolio, Rentec) to automate rent collection and maintenance tracking.',
    related: ['rental-application-checklist', 'landlord-tenant-laws-by-state', 'airbnb-profitability-estimator'],
  },
  {
    slug: 'rental-application-checklist',
    title: 'Rental Application Checklist',
    desc: 'What landlords and tenants need for a rental application.',
    cat: 'real-estate',
    icon: '📝',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Rental Application Requirements', content: [
        { label: 'Photo ID', value: 'Government-issued (driver\'s license, passport)' },
        { label: 'Proof of income', value: 'Last 2–3 pay stubs; 2x–3x monthly rent standard' },
        { label: 'Bank statements', value: 'Last 2–3 months (shows reserves)' },
        { label: 'Credit check authorization', value: 'Signed consent form; credit score typically 620+ required' },
        { label: 'Background check', value: 'Criminal history; landlord must follow FCRA and state laws' },
        { label: 'Rental history / references', value: '2+ years preferred; prior landlord contact info' },
        { label: 'Employment verification', value: 'Offer letter, employer contact, or W-2s' },
        { label: 'Pet information', value: 'Breed, weight, vaccination records if pets allowed' },
        { label: 'Social Security Number', value: 'For credit check; tenants can provide ITIN instead' },
        { label: 'Application fee', value: '$30–$75 typically; varies by state (CA caps at $65.58 in 2025)' },
        { label: 'Self-employed documentation', value: 'Tax returns (Schedule C), bank statements, CPA letter' },
      ]
    }],
    about: 'Fair housing laws prohibit denying applications based on protected classes. Legitimate reasons for denial include insufficient income, poor credit, eviction history, or negative references. Application fees must reflect actual screening costs; California caps the fee and requires itemized receipts.',
    related: ['landlord-checklist', 'tenant-rights-guide', 'credit-score-range-guide'],
  },
  {
    slug: '1031-exchange-guide',
    title: '1031 Exchange Guide',
    desc: 'How 1031 tax-deferred exchanges work for real estate investors.',
    cat: 'real-estate',
    icon: '🔄',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: '1031 Exchange Key Rules', content: [
        { label: 'Purpose', value: 'Defer capital gains tax by reinvesting in like-kind property' },
        { label: 'Like-kind requirement', value: 'Any real property held for investment or business use' },
        { label: 'Identification period', value: '45 days from closing to identify replacement property' },
        { label: 'Exchange period', value: '180 days from closing to complete purchase' },
        { label: 'Qualified intermediary', value: 'Required — you cannot receive the sale proceeds' },
        { label: 'Boot (taxable portion)', value: 'Cash or unlike property received; taxable in year of exchange' },
        { label: 'Equal or greater value', value: 'Must buy replacement at equal or greater price to defer all tax' },
        { label: 'Debt replacement', value: 'Must assume equal or greater debt on replacement' },
        { label: 'Depreciation recapture', value: 'Deferred (not eliminated) — taxed when final sale occurs' },
        { label: 'Primary residence', value: 'Does NOT qualify (use Section 121 instead)' },
        { label: 'Delaware Statutory Trust', value: 'Allows exchange into fractional property interest' },
        { label: 'Step-up basis at death', value: 'Heirs receive stepped-up basis, eliminating deferred gain' },
      ]
    }],
    about: 'A 1031 exchange defers — but does not eliminate — capital gains taxes. The deferred tax becomes a future liability when you eventually sell without exchanging. Many investors exchange indefinitely and use the stepped-up basis at death to permanently eliminate the deferred gain.',
    related: ['capital-gains-exclusion-calculator', 'capital-gains-rates-2025', 'depreciation-schedule-tool'],
  },
  {
    slug: 'depreciation-schedule-tool',
    title: 'Rental Property Depreciation Calculator',
    desc: 'Calculate annual depreciation deduction for residential and commercial rental properties.',
    cat: 'real-estate',
    icon: '📉',
    toolType: 'estimator',
    fields: [
      { k: 'purchase_price', l: 'Purchase Price', type: 'number', placeholder: '400000', unit: '$' },
      { k: 'land_value', l: 'Land Value (not depreciable)', type: 'number', placeholder: '80000', unit: '$' },
      {
        k: 'property_type',
        l: 'Property Type',
        type: 'select',
        options: [{ value: '27.5', label: 'Residential rental (27.5 years)' }, { value: '39', label: 'Commercial property (39 years)' }],
      },
    ],
    fn: (inputs) => {
      const purchase = parseFloat(inputs.purchase_price) || 0, land = parseFloat(inputs.land_value) || 0, life = parseFloat(inputs.property_type) || 27.5
      const depreciableBase = purchase - land
      const annualDepr = depreciableBase / life
      const taxSavings24 = annualDepr * 0.24 // at 24% marginal rate
      return [{
        type: 'table', label: 'Depreciation Schedule', content: [
          { label: 'Purchase price', value: `$${purchase.toLocaleString()}` },
          { label: 'Land value (excluded)', value: `$${land.toLocaleString()}` },
          { label: 'Depreciable basis', value: `$${depreciableBase.toLocaleString()}` },
          { label: 'Annual depreciation', value: `$${annualDepr.toFixed(0)}` },
          { label: 'Tax savings at 24% rate', value: `$${taxSavings24.toFixed(0)}/year` },
          { label: 'Recovery period', value: `${life} years` },
          { label: 'Method', value: 'MACRS straight-line (mid-month convention)' },
          { label: 'Recapture rate when sold', value: '25% (Section 1250)' },
        ]
      }]
    },
    about: 'Depreciation is a non-cash deduction that reduces rental income on your tax return. Residential property is depreciated over 27.5 years; commercial over 39. Cost segregation studies can accelerate depreciation for certain building components (equipment, land improvements) into 5, 7, or 15-year categories.',
    related: ['1031-exchange-guide', 'real-estate-tax-deductions-guide', 'capital-gains-rates-2025'],
  },
  {
    slug: 'real-estate-tax-deductions-guide',
    title: 'Real Estate Tax Deductions Guide',
    desc: 'Deductions available to homeowners and rental property owners.',
    cat: 'real-estate',
    icon: '📋',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Real Estate Tax Deductions', content: [
        { label: 'Mortgage interest (homeowner)', value: 'Up to $750K loan balance; primary + 1 second home' },
        { label: 'Property taxes (SALT)', value: '$10,000 cap for state + local taxes (may change 2025)' },
        { label: 'Points paid at purchase', value: 'Deductible in year paid for purchase loans' },
        { label: 'PMI (mortgage insurance)', value: 'Deductible if AGI ≤ $100K (expired; check current law)' },
        { label: 'Home office (self-employed)', value: 'Exclusive business use only; simplified = $5/sq ft up to 300' },
        { label: 'Rental income expenses', value: 'ALL expenses deductible: mortgage interest, taxes, insurance, repairs' },
        { label: 'Rental depreciation', value: '27.5 years residential; powerful non-cash deduction' },
        { label: 'Rental travel', value: 'Mileage and travel to inspect/manage rental property' },
        { label: 'Property management fees', value: 'Deductible for rental properties (typically 8–12% of rent)' },
        { label: 'Capital improvements', value: 'Add to basis (not deducted immediately); reduces future gain' },
        { label: 'Repairs vs improvements', value: 'Repairs: deductible immediately; Improvements: capitalized' },
        { label: 'Section 199A QBI deduction', value: '20% of rental income (if qualifies as trade or business)' },
      ]
    }],
    about: 'The Tax Cuts and Jobs Act (2017) limited the mortgage interest deduction to $750K and capped SALT deductions at $10,000. These provisions expire after 2025. Rental property owners have more expansive deductions than homeowners — all ordinary and necessary expenses are deductible.',
    related: ['depreciation-schedule-tool', '1031-exchange-guide', 'capital-gains-exclusion-calculator'],
  },
  {
    slug: 'home-warranty-cost-guide',
    title: 'Home Warranty Cost Guide',
    desc: 'What home warranties cover, typical costs, and whether they\'re worth buying.',
    cat: 'real-estate',
    icon: '🛡️',
    toolType: 'table',
    staticContent: () => [{
      type: 'table', label: 'Home Warranty Reference', content: [
        { label: 'Annual premium range', value: '$300–$700/year' },
        { label: 'Service call fee', value: '$75–$125 per claim' },
        { label: 'Typically covered', value: 'HVAC, plumbing, electrical, major appliances' },
        { label: 'Typically excluded', value: 'Pre-existing conditions, code upgrades, cosmetic issues' },
        { label: 'HVAC claim example', value: 'Repair covered; full system replacement: $1,500 cap typical' },
        { label: 'Major companies', value: 'American Home Shield, First American, Choice Home Warranty' },
        { label: 'BBB ratings', value: 'Research individual companies — many complaints about denials' },
        { label: 'Best value scenario', value: 'Older home, aging HVAC/appliances nearing end of life' },
        { label: 'Worst value scenario', value: 'New construction; new appliances with manufacturer warranties' },
        { label: 'Seller-paid warranties', value: 'Often offered for 1 year as marketing incentive' },
      ]
    }],
    about: 'Home warranties are controversial. Consumer Reports finds they pay out on only about 40% of claims and often cap replacement costs well below actual market prices. They may make sense for buyers purchasing older homes with aging systems, but are generally poor value for new construction.',
    related: ['home-maintenance-budget-calculator', 'home-inspection-checklist', 'home-buying-checklist'],
  },
]
