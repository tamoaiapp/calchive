/**
 * Calchive Warmup Script
 *
 * Visits all ISR pages to pre-render and cache them on Vercel's CDN.
 * Run after every deploy: node scripts/warmup.mjs https://yoursite.com
 *
 * Usage:
 *   node scripts/warmup.mjs https://calchive.com
 *   node scripts/warmup.mjs https://calchive.com --concurrency=5
 *   node scripts/warmup.mjs https://calchive.com --dry-run
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000'
const CONCURRENCY = parseInt(process.argv.find(a => a.startsWith('--concurrency='))?.split('=')[1] || '3')
const DRY_RUN = process.argv.includes('--dry-run')
const DELAY_MS = 150  // ms between requests per worker

// ─── All ISR slugs ────────────────────────────────────────────────────────────

// Salary: all states × all amounts (no 'dc' — not in states data)
const SALARY_STATES = [
  'alabama','alaska','arizona','arkansas','california','colorado','connecticut',
  'delaware','florida','georgia','hawaii','idaho','illinois','indiana','iowa',
  'kansas','kentucky','louisiana','maine','maryland','massachusetts','michigan',
  'minnesota','mississippi','missouri','montana','nebraska','nevada',
  'new-hampshire','new-jersey','new-mexico','new-york','north-carolina',
  'north-dakota','ohio','oklahoma','oregon','pennsylvania','rhode-island',
  'south-carolina','south-dakota','tennessee','texas','utah','vermont',
  'virginia','washington','west-virginia','wisconsin','wyoming'
]
const SALARY_AMOUNTS = [
  25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
  75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 130000, 140000,
  150000, 175000, 200000, 250000, 300000
]
const salaryStatePages = SALARY_STATES.flatMap(state =>
  SALARY_AMOUNTS.map(amount => `/salary/${state}/${amount}`)
)

// Salary career (professions — exact slugs from professions.ts)
const PROFESSIONS = [
  'software-engineer','data-scientist','machine-learning-engineer','devops-engineer',
  'cloud-architect','cybersecurity-analyst','product-manager','ux-designer',
  'frontend-developer','backend-developer','full-stack-developer','database-administrator',
  'systems-administrator','network-engineer','it-manager','ai-engineer','data-engineer',
  'mobile-developer','qa-engineer',
  'physician','surgeon','dentist','registered-nurse','nurse-practitioner',
  'physician-assistant','pharmacist','physical-therapist','occupational-therapist',
  'radiologist','anesthesiologist','psychiatrist','psychologist','dental-hygienist',
  'paramedic','veterinarian','healthcare-administrator',
  'financial-advisor','investment-banker','accountant','cpa','financial-analyst',
  'actuary','cfo','loan-officer','portfolio-manager','economist',
  'lawyer','paralegal','corporate-attorney','patent-attorney','immigration-attorney',
  'teacher','high-school-teacher','college-professor','school-principal','school-counselor',
  'civil-engineer','mechanical-engineer','electrical-engineer','aerospace-engineer',
  'petroleum-engineer','chemical-engineer','biomedical-engineer',
  'ceo','marketing-manager','project-manager','hr-manager','management-consultant',
  'operations-manager','business-analyst','sales-manager',
  'electrician','plumber','hvac-technician','carpenter','welder','auto-mechanic',
  'construction-manager','elevator-technician',
  'graphic-designer','copywriter','journalist','social-media-manager','web-designer',
  'game-developer',
  'pilot','real-estate-agent','social-worker','chef',
  'police-officer','firefighter','truck-driver','personal-trainer',
  'event-planner','nutritionist',
]
const salaryCareerPages = PROFESSIONS.map(p => `/salary/career/${p}`)

// Tax pages
const TAX_AMOUNTS_SINGLE = [25000,30000,35000,40000,45000,50000,55000,60000,65000,70000,75000,80000,85000,90000,95000,100000,110000,120000,130000,140000,150000,175000,200000,250000,300000,400000,500000,750000,1000000,1500000]
const TAX_FILINGS = ['single','married-jointly','married-separately','head-of-household']
const taxFederalPages = TAX_AMOUNTS_SINGLE.flatMap(a => TAX_FILINGS.map(f => `/tax/federal-tax-${a}-${f}`))

const CG_AMOUNTS = [5000,10000,15000,20000,25000,30000,40000,50000,75000,100000,150000,200000,250000,300000,500000,750000,1000000,1500000,2000000,5000000]
const taxCapGainsPages = CG_AMOUNTS.flatMap(a => [`/tax/capital-gains-tax-${a}-long-term`, `/tax/capital-gains-tax-${a}-short-term`])

const SE_AMOUNTS = [10000,15000,20000,25000,30000,40000,50000,60000,70000,80000,90000,100000,120000,150000,200000,250000,300000,400000,500000,750000]
const taxSEPages = SE_AMOUNTS.map(a => `/tax/self-employment-tax-${a}`)

const TAX_STATES = ['california','new-york','texas','florida','new-jersey','illinois','pennsylvania','ohio','washington','arizona','massachusetts','virginia','north-carolina','georgia','michigan']
const STATE_TAX_AMOUNTS = [50000,60000,75000,100000,125000,150000,200000,250000,300000,500000]
const taxStatePages = TAX_STATES.flatMap(s => STATE_TAX_AMOUNTS.map(a => `/tax/${s}-income-tax-${a}`))

const taxGuides = ['tax-brackets-2025','standard-deduction-2025','capital-gains-rates-2025','fica-tax-2025','self-employment-tax-guide','tax-filing-deadlines-2025','w2-vs-1099-guide','quarterly-estimated-taxes-guide','tax-deductions-guide','tax-credits-guide','backdoor-roth-guide','401k-tax-benefits-guide','hsa-tax-benefits-guide','llc-tax-guide','s-corp-vs-llc-taxes']
const taxGuidePages = taxGuides.map(s => `/tax/${s}`)

// Mortgage pages
const MORTGAGE_PRICES = [150000,175000,200000,225000,250000,275000,300000,325000,350000,375000,400000,425000,450000,475000,500000,550000,600000,650000,700000,750000,800000,900000,1000000,1200000,1500000]
const mortgageStatePages = SALARY_STATES.flatMap(state =>
  MORTGAGE_PRICES.map(price => `/mortgage/${state}-${price}`)
)

// Loan pages
const PERSONAL_AMOUNTS = [1000,2000,3000,5000,7500,10000,12500,15000,20000,25000,30000,40000,50000,75000,100000]
const PERSONAL_TERMS = [24,36,48,60,72]
const loanPersonalPages = PERSONAL_AMOUNTS.flatMap(a => PERSONAL_TERMS.map(t => `/loan/personal-loan-${a}-${t}-months`))

const AUTO_AMOUNTS = [10000,15000,20000,25000,30000,35000,40000,45000,50000,60000,70000,80000]
const AUTO_TERMS = [36,48,60,72,84]
const loanAutoPages = AUTO_AMOUNTS.flatMap(a => AUTO_TERMS.map(t => `/loan/auto-loan-${a}-${t}-months`))

const STUDENT_AMOUNTS = [10000,20000,30000,40000,50000,60000,75000,100000,125000,150000,200000]
const loanStudentPages = STUDENT_AMOUNTS.map(a => `/loan/student-loan-${a}`)

const CC_BALANCES = [1000,2000,3000,5000,7500,10000,15000,20000,25000,30000,50000]
const CC_APRS = [15.99,19.99,24.99,29.99]
// APR uses dot→hyphen: 15.99 → 15-99
const loanCCPages = CC_BALANCES.flatMap(b =>
  CC_APRS.map(r => `/loan/credit-card-payoff-${b}-${r.toFixed(2).replace('.', '-')}`)
)

// Health pages
const bmiPages = []
for (let v = 140; v <= 500; v += 5) {
  bmiPages.push(`/health/bmi-${(v/10).toString().replace('.', '-')}`)
}
const bmiAgePages = Array.from({length: 63}, (_, i) => `/health/bmi-for-age-${i + 18}`)
const calorieLosePages = [5,10,15,20,25,30,35,40,50,60,70,80,100].map(n => `/health/calories-to-lose-${n}-lbs`)
const howLongPages = [5,10,15,20,25,30,35,40,50,60,70,80,100].map(n => `/health/how-long-to-lose-${n}-lbs`)
const calorieDeficitPages = [100,200,300,400,500,600,700,800,1000].map(n => `/health/calorie-deficit-${n}`)
const tdeePages = [1400,1500,1600,1700,1800,1900,2000,2100,2200,2300,2400,2500,2600,2800,3000,3200,3500].map(n => `/health/tdee-${n}`)
const hrZonePages = Array.from({length: 63}, (_, i) => `/health/heart-rate-zone-${i + 18}`)
const restingHRPages = [40,45,50,55,60,65,70,75,80,85,90,95,100].map(n => `/health/resting-heart-rate-${n}`)

// Insurance pages
const insuranceAutoStatePages = SALARY_STATES.map(s => `/insurance/auto-insurance-${s}`)
const insuranceHomeStatePages = SALARY_STATES.map(s => `/insurance/homeowners-insurance-${s}`)
const lifeAges = [25,30,35,40,45,50,55,60,65,70]
const lifeCoverages = ['250k','500k','750k','1m','1-5m','2m']
const insuranceLifePages = [
  ...lifeAges.map(a => `/insurance/life-insurance-age-${a}`),
  ...lifeCoverages.map(c => `/insurance/life-insurance-${c}`),
]
const healthInsStates = ['california','new-york','texas','florida','pennsylvania','illinois','ohio','georgia','north-carolina','michigan','new-jersey','virginia','washington','arizona','massachusetts','tennessee','indiana','maryland','missouri','colorado']
const insuranceHealthPages = healthInsStates.map(s => `/insurance/health-insurance-${s}`)

// Credit pages
const creditScorePages = Array.from({length: 36}, (_, i) => `/credit/credit-score-${500 + i * 10}`)
// APR uses dot→hyphen: 15.99 → 15-99
const creditCardPages = [15.99,19.99,22.99,24.99,29.99].flatMap(apr =>
  [1000,2000,5000,10000].map(bal => `/credit/credit-card-interest-${apr.toFixed(2).replace('.', '-')}-${bal}`)
)
// debt-payoff includes both balance AND months in slug
const debtPayoffPages = [5000,10000,15000,20000,30000,50000].flatMap(bal =>
  [12,24,36,48,60].map(mo => `/credit/debt-payoff-${bal}-${mo}-months`)
)

// Retirement pages — amounts use k/m format: 250000→250k, 1000000→1m, 1500000→1-5m
function formatRetireAmt(n) {
  if (n >= 1000000) {
    const m = n / 1000000
    return m === Math.floor(m) ? `${m}m` : `${m.toFixed(1).replace('.', '-')}m`
  }
  return `${n / 1000}k`
}
const retireAges = [55,60,62,65,67,70]
const retireAmounts = [250000,500000,750000,1000000,1500000,2000000,2500000,3000000,4000000,5000000]
const retirementPages = retireAges.flatMap(age =>
  retireAmounts.map(amt => `/retirement/retire-at-${age}-with-${formatRetireAmt(amt)}`)
)
const k401Ages = [30,35,40,45,50,55,60].map(a => `/retirement/401k-at-age-${a}`)
const rothAges = [30,35,40,45,50,55,60].map(a => `/retirement/roth-ira-age-${a}`)
const ssAges = [62,63,64,65,66,67,68,69,70].map(a => `/retirement/social-security-at-age-${a}`)
const ssIncomes = [30000,40000,50000,60000,75000,100000,125000,150000,200000].map(i => `/retirement/social-security-for-income-${i}`)

// ─── Compile all URLs ──────────────────────────────────────────────────────────

const ALL_URLS = [
  '/',
  '/calculator',
  '/tool',
  '/salary',
  '/salary/career',
  '/tax',
  '/mortgage',
  '/loan',
  '/health',
  '/career',
  '/insurance',
  '/credit',
  '/retirement',
  '/guide',
  ...salaryStatePages,
  ...salaryCareerPages,
  ...taxFederalPages,
  ...taxCapGainsPages,
  ...taxSEPages,
  ...taxStatePages,
  ...taxGuidePages,
  ...mortgageStatePages,
  ...loanPersonalPages,
  ...loanAutoPages,
  ...loanStudentPages,
  ...loanCCPages,
  ...bmiPages,
  ...bmiAgePages,
  ...calorieLosePages,
  ...howLongPages,
  ...calorieDeficitPages,
  ...tdeePages,
  ...hrZonePages,
  ...restingHRPages,
  ...insuranceAutoStatePages,
  ...insuranceHomeStatePages,
  ...insuranceLifePages,
  ...insuranceHealthPages,
  ...creditScorePages,
  ...creditCardPages,
  ...debtPayoffPages,
  ...retirementPages,
  ...k401Ages,
  ...rothAges,
  ...ssAges,
  ...ssIncomes,
]

// ─── Runner ────────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchUrl(url, index, total) {
  const fullUrl = `${BASE_URL}${url}`
  if (DRY_RUN) {
    console.log(`[dry-run] ${index + 1}/${total} ${url}`)
    return { url, status: 0, ms: 0 }
  }

  const start = Date.now()
  try {
    const res = await fetch(fullUrl, {
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Calchive-Warmup/1.0' }
    })
    const ms = Date.now() - start
    const ok = res.status < 400
    if (!ok || ms > 5000) {
      console.log(`[${ok ? '⚠️ slow' : '❌ error'}] ${index + 1}/${total} ${url} → ${res.status} (${ms}ms)`)
    } else if ((index + 1) % 100 === 0) {
      console.log(`[✓] ${index + 1}/${total} done — last: ${url} (${ms}ms)`)
    }
    return { url, status: res.status, ms }
  } catch (err) {
    const ms = Date.now() - start
    console.log(`[❌ fail] ${index + 1}/${total} ${url} → ${err.message} (${ms}ms)`)
    return { url, status: 0, ms, error: err.message }
  }
}

async function worker(queue, workerId) {
  while (queue.length > 0) {
    const { url, index, total } = queue.shift()
    await fetchUrl(url, index, total)
    await sleep(DELAY_MS)
  }
}

async function main() {
  const total = ALL_URLS.length
  const eta = Math.ceil((total * DELAY_MS) / CONCURRENCY / 1000 / 60)

  console.log(`\n🚀 Calchive Warmup`)
  console.log(`   Base URL:    ${BASE_URL}`)
  console.log(`   Total URLs:  ${total.toLocaleString()}`)
  console.log(`   Concurrency: ${CONCURRENCY} workers`)
  console.log(`   Delay:       ${DELAY_MS}ms per worker`)
  console.log(`   ETA:         ~${eta} minutes`)
  if (DRY_RUN) console.log(`   Mode:        DRY RUN (no requests)`)
  console.log()

  const queue = ALL_URLS.map((url, index) => ({ url, index, total }))

  const start = Date.now()
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(queue, i)))
  const elapsed = Math.round((Date.now() - start) / 1000)

  console.log(`\n✅ Warmup complete — ${total.toLocaleString()} URLs in ${elapsed}s`)
}

main().catch(console.error)
