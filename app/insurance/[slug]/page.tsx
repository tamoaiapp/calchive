import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { INSURANCE_PAGE_SLUGS, parseInsuranceSlug } from '@/lib/insurance/pages-manifest'
import { NATIONAL_AUTO_AVG, NATIONAL_HOME_AVG, LIFE_INSURANCE_RATES, HEALTH_INSURANCE_PREMIUMS_2025 } from '@/lib/insurance/data'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return INSURANCE_PAGE_SLUGS.slice(0, 80).map((slug) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cfg = parseInsuranceSlug(slug)
  if (!cfg) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  switch (cfg.type) {
    case 'auto-state':
      title = `${cfg.stateName} Auto Insurance: Average Cost & Requirements (2025)`
      description = `The average auto insurance cost in ${cfg.stateName} is $${cfg.annualPremium?.toLocaleString()}/year — ${cfg.annualPremium! > NATIONAL_AUTO_AVG ? 'above' : 'below'} the $${NATIONAL_AUTO_AVG.toLocaleString()} national average. State minimums, top insurers, and saving strategies.`
      break
    case 'auto-driver':
      title = `Auto Insurance for ${cfg.driverType?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}: Rates & Tips (2025)`
      description = `Special auto insurance considerations and rates for ${cfg.driverType?.replace(/-/g, ' ')} drivers. How to find coverage and reduce costs.`
      break
    case 'home-state':
      title = `${cfg.stateName} Homeowners Insurance: Average Cost (2025)`
      description = `Homeowners insurance in ${cfg.stateName} averages $${cfg.homePremium?.toLocaleString()}/year — ${cfg.homePremium! > NATIONAL_HOME_AVG ? 'above' : 'below'} the $${NATIONAL_HOME_AVG.toLocaleString()} national average. Coverage factors and how to save.`
      break
    case 'life-age':
      title = `Life Insurance at Age ${cfg.age}: Monthly Rates & Coverage Guide`
      description = `A healthy ${cfg.age}-year-old male pays $${cfg.lifeMale}/month for $500k 20-year term life insurance. Women pay $${cfg.lifeFemale}/month. Compare options and coverage amounts.`
      break
    case 'life-coverage': {
      const displayAmount = cfg.coverage?.replace('-', '.').replace(/^(\d+)m$/, '$$$1 million').replace(/^(\d+)k$/, '$$${1}k')
      title = `${cfg.coverage?.toUpperCase()} Life Insurance: Monthly Cost by Age`
      description = `How much does ${displayAmount} in life insurance cost? Rates by age and gender for term vs whole life.`
      break
    }
    default:
      title = `${slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Calchive`
      description = `Complete guide to ${slug.replace(/-/g, ' ')} — facts, costs, and strategies for 2025.`
  }

  return {
    title: `${title} | Calchive`,
    description,
    alternates: { canonical: `/insurance/${slug}` },
    openGraph: { title, description, type: 'article' },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

function pctVsNational(rate: number, nat: number): string {
  const pct = Math.round(((rate - nat) / nat) * 100)
  return pct > 0 ? `${pct}% above` : `${Math.abs(pct)}% below`
}

const sectionHeading: React.CSSProperties = {
  fontSize: '1.2rem',
  fontWeight: 800,
  margin: '2rem 0 0.75rem',
  color: 'var(--text)',
}

const statCard: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.5rem',
  marginBottom: '1.5rem',
}

// ─── Section renderers ────────────────────────────────────────────────────────

function AutoStatePage({ cfg }: { cfg: ReturnType<typeof parseInsuranceSlug> }) {
  if (!cfg || cfg.type !== 'auto-state') return null
  const rate = cfg.annualPremium!
  const vsNat = pctVsNational(rate, NATIONAL_AUTO_AVG)
  const monthly = Math.round(rate / 12)

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Annual Average</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>${fmt(rate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Monthly</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }}>${fmt(monthly)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>vs National Avg</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: rate > NATIONAL_AUTO_AVG ? '#f87171' : '#34d399' }}>
              {vsNat}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Nat. avg: ${fmt(NATIONAL_AUTO_AVG)}/yr</div>
          </div>
        </div>
      </div>

      <h2 style={sectionHeading}>Why {cfg.stateName} Rates Are {rate > NATIONAL_AUTO_AVG ? 'High' : 'Low'}</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        {cfg.stateName}&apos;s average full-coverage auto insurance rate of ${fmt(rate)}/year is {vsNat} the
        ${ fmt(NATIONAL_AUTO_AVG)} national average. Rates are driven by population density, uninsured
        driver rates, local litigation costs, weather events, and state-mandated coverage requirements.
        {rate >= 2500 ? ' High urban density, frequent accidents, and above-average fraud rates contribute to the elevated costs.' : rate <= 1300 ? ' Lower population density, fewer severe weather events, and competitive local insurance markets keep rates down.' : ' The state sits near the national middle, with a mix of urban and rural driving environments.'}
      </p>

      {cfg.stateMin && (
        <>
          <h2 style={sectionHeading}>Minimum Coverage Requirements</h2>
          <div style={{ ...statCard, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Bodily Injury Liability</div>
              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{cfg.stateMin.bodily}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>Property Damage Liability</div>
              <div style={{ fontWeight: 700, color: 'var(--text)' }}>{cfg.stateMin.property}</div>
            </div>
            {cfg.stateMin.notes && (
              <div style={{ gridColumn: '1/-1', fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
                Note: {cfg.stateMin.notes}
              </div>
            )}
          </div>
        </>
      )}

      <h2 style={sectionHeading}>How to Lower Your Rate in {cfg.stateName}</h2>
      <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: '1.25rem' }}>
        <li>Bundle home and auto with the same insurer — average saving: 15–20%</li>
        <li>Raise your deductible from $500 to $1,000 — saves $200–400/year on average</li>
        <li>Ask about low-mileage discounts if you drive under 7,500 miles/year</li>
        <li>Take a defensive driving course — qualifies for 5–15% discount with most carriers</li>
        <li>Pay annually instead of monthly — eliminates installment fees ($50–120/year)</li>
        <li>Compare at least 3 quotes — rates for the same driver can vary 40–60% across insurers</li>
      </ul>

      <RelatedLinks
        title="Related Insurance Tools"
        links={[
          { title: 'Auto Insurance — Florida', href: '/insurance/auto-insurance-florida', icon: '🚗' },
          { title: 'Auto Insurance — Texas', href: '/insurance/auto-insurance-texas', icon: '🚗' },
          { title: 'Renters Insurance Guide', href: '/insurance/renters-insurance-guide', icon: '🏠' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
        ]}
      />
    </>
  )
}

function HomeStatePage({ cfg }: { cfg: ReturnType<typeof parseInsuranceSlug> }) {
  if (!cfg || cfg.type !== 'home-state') return null
  const rate = cfg.homePremium!
  const monthly = Math.round(rate / 12)
  const vsNat = pctVsNational(rate, NATIONAL_HOME_AVG)

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Annual Average</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>${fmt(rate)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Monthly</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'var(--text)' }}>${fmt(monthly)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>vs National Avg</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: rate > NATIONAL_HOME_AVG ? '#f87171' : '#34d399' }}>
              {vsNat}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Nat. avg: ${fmt(NATIONAL_HOME_AVG)}/yr</div>
          </div>
        </div>
      </div>

      <h2 style={sectionHeading}>Risk Factors in {cfg.stateName}</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        Homeowners insurance in {cfg.stateName} costs ${fmt(rate)}/year on average — {vsNat} the national
        average of ${fmt(NATIONAL_HOME_AVG)}. Insurers weigh wildfire risk, hurricane and tornado exposure,
        flood frequency, construction costs, and litigation environment when pricing policies.
      </p>

      <h2 style={sectionHeading}>Coverage Recommendations</h2>
      <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: '1.25rem' }}>
        <li>Dwelling coverage: 100% of replacement cost (not market value)</li>
        <li>Personal property: 50–70% of dwelling coverage</li>
        <li>Liability: $300,000 minimum; $500,000 if you have significant assets</li>
        <li>Additional living expenses: minimum 20% of dwelling coverage</li>
        <li>Consider flood insurance separately — standard policies exclude flood damage</li>
      </ul>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Mortgage Calculator', href: `/mortgage/${cfg.state}-350000`, icon: '🏠' },
          { title: 'Auto Insurance Guide', href: `/insurance/auto-insurance-${cfg.state}`, icon: '🚗' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
        ]}
      />
    </>
  )
}

function LifeAgePage({ cfg }: { cfg: ReturnType<typeof parseInsuranceSlug> }) {
  if (!cfg || cfg.type !== 'life-age') return null
  const male = cfg.lifeMale!
  const female = cfg.lifeFemale!

  return (
    <>
      <div style={statCard}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
          Monthly premium for $500,000 20-year term life policy — healthy non-smoker, 2025
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Male</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--accent)' }}>${male}<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>${(male * 12).toLocaleString()}/year</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Female</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#8b5cf6' }}>${female}<span style={{ fontSize: 16, fontWeight: 400 }}>/mo</span></div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>${(female * 12).toLocaleString()}/year</div>
          </div>
        </div>
      </div>

      <h2 style={sectionHeading}>How Age Affects Life Insurance Rates</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        At age {cfg.age}, life insurance is
        {cfg.age! <= 35 ? ' still relatively affordable' : cfg.age! <= 50 ? ' moderately priced, but rising' : ' significantly more expensive than in younger years'}.
        Each decade of delay roughly doubles the cost: a 40-year-old male pays 57% more than a 30-year-old for
        the same $500k policy. Women pay 13–22% less than men at every age due to longer life expectancy data.
      </p>

      <h2 style={sectionHeading}>Rate Comparison by Age</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
        {Object.entries(LIFE_INSURANCE_RATES.male).map(([age, rate]) => (
          <Link
            key={age}
            href={`/insurance/life-insurance-age-${age}`}
            style={{
              padding: '12px 16px',
              background: age === String(cfg.age) ? 'rgba(59,130,246,0.12)' : 'var(--card)',
              border: `1px solid ${age === String(cfg.age) ? 'rgba(59,130,246,0.4)' : 'var(--line)'}`,
              borderRadius: 12,
              textDecoration: 'none',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Age {age}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text)' }}>${rate}/mo</div>
            <div style={{ fontSize: 11, color: 'var(--dim)' }}>male, $500k 20yr</div>
          </Link>
        ))}
      </div>

      <RelatedLinks
        title="Related Calculators"
        links={[
          { title: 'Life Insurance Calculator', href: '/calculator/life-insurance-calculator', icon: '🛡️' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
          { title: '$500k Life Insurance', href: '/insurance/life-insurance-500k', icon: '📋' },
        ]}
      />
    </>
  )
}

function GuidePage({ cfg }: { cfg: ReturnType<typeof parseInsuranceSlug> }) {
  if (!cfg) return null
  const titleMap: Record<string, string> = {
    'homeowners-insurance-guide': 'Homeowners Insurance: Complete 2025 Guide',
    'flood-insurance-guide': 'Flood Insurance: What It Covers and What It Costs',
    'earthquake-insurance-guide': 'Earthquake Insurance: Is It Worth It?',
    'renters-insurance-guide': "Renters Insurance: What You're Missing Without It",
    'term-vs-whole-life-insurance': 'Term vs Whole Life Insurance: Which Is Right for You?',
    'how-much-life-insurance-do-i-need': 'How Much Life Insurance Do You Actually Need?',
    'life-insurance-for-seniors': 'Life Insurance for Seniors: Options After 60',
    'life-insurance-for-smokers': 'Life Insurance for Smokers: Rates and Alternatives',
    'life-insurance-with-pre-existing-conditions': 'Life Insurance With Pre-Existing Conditions',
    'life-insurance-for-small-business': 'Life Insurance for Small Business Owners',
    'group-life-insurance-guide': 'Group Life Insurance: What Your Employer Provides',
    'burial-insurance-guide': 'Burial Insurance: Final Expense Coverage Explained',
    'aca-marketplace-guide': 'ACA Marketplace Guide: How to Enroll and Save',
    'cobra-insurance-guide': 'COBRA Insurance: Costs, Rules, and Alternatives',
    'medicare-guide': 'Medicare Guide: Parts A, B, C, D Explained',
    'medicaid-guide': 'Medicaid Guide: Who Qualifies and What\'s Covered',
    'hmo-vs-ppo-vs-epo': 'HMO vs PPO vs EPO: Which Health Plan Is Best?',
    'health-insurance-for-self-employed': 'Health Insurance for Self-Employed: All Your Options',
    'short-term-health-insurance': 'Short-Term Health Insurance: Gaps, Costs, and Risks',
    'health-insurance-deductible-explained': 'Health Insurance Deductible: How It Actually Works',
    'short-term-disability-guide': 'Short-Term Disability Insurance: Benefits and Coverage',
    'long-term-disability-guide': 'Long-Term Disability: The Insurance Most People Skip',
    'umbrella-insurance-guide': 'Umbrella Insurance: Extra Liability for $150–$300/Year',
    'pet-insurance-guide': 'Pet Insurance: Is It Worth the Cost?',
    'travel-insurance-guide': 'Travel Insurance: What\'s Covered and What\'s Not',
    'motorcycle-insurance-guide': 'Motorcycle Insurance: Rates and Required Coverage',
    'boat-insurance-guide': 'Boat Insurance: What Watercraft Coverage Costs',
    'rv-insurance-guide': 'RV Insurance: Full-Timer vs Occasional Use Coverage',
    'business-insurance-guide': 'Business Insurance: Coverage Every Company Needs',
    'workers-comp-insurance-guide': "Workers' Comp Insurance: Employer Requirements by State",
  }

  const title = titleMap[cfg.slug] ?? cfg.slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const bodyMap: Record<string, string> = {
    'term-vs-whole-life-insurance': 'Term life insurance is pure protection: you pay a fixed premium for 10, 20, or 30 years. If you die during the term, beneficiaries get the death benefit. Whole life is permanent coverage with a cash value component — premiums are 5–15x higher. For most families, term life wins: buy 20-year term for the child-rearing years, invest the premium difference in index funds. The cash value in whole life grows at 2–4% — index funds historically return 10%. The exceptions: high-net-worth individuals using whole life for estate planning, or business owners needing permanent coverage for buy-sell agreements.',
    'how-much-life-insurance-do-i-need': 'The DIME formula covers the bases: Debt (all outstanding debts), Income (10x annual income to replace earnings for dependents), Mortgage (remaining balance), Education (cost of college for children). A 35-year-old with a $400k mortgage, $60k income, two kids, and $50k in other debts needs roughly $1.1–1.4 million in coverage. At age 35, a 20-year $1.25 million term policy costs about $55–70/month for a male — less than a car payment. Many people carry only employer-provided group life (usually 1–2x salary) and are massively underinsured.',
    'renters-insurance-guide': "Renters insurance costs $15–$30/month and covers three things: personal property (laptop, furniture, clothes), liability (if someone is injured in your apartment), and additional living expenses if your unit becomes uninhabitable. Your landlord's insurance covers the building — not your stuff. The average claim is $3,000–$5,000. A standard $30,000 personal property policy with $100,000 liability costs about $180/year. The one coverage gap: flood. Renters policies exclude it. If you're in a flood zone, add NFIP or private flood coverage.",
    'aca-marketplace-guide': 'The ACA marketplace runs annually from November 1 to January 15. You can enroll outside open enrollment if you have a qualifying life event: job loss, marriage, having a child, moving. Premium tax credits are available to households earning 100–400% of the federal poverty level — and since the American Rescue Plan, there\'s no upper income cap for subsidy eligibility through 2025. A single adult earning $40,000 ($3,333/month) qualifies for subsidies that reduce the benchmark silver plan to roughly 8.5% of income. Use healthcare.gov to compare plans — filter by your doctors and prescriptions first, then compare total costs including premiums and out-of-pocket maximums.',
    'medicare-guide': 'Medicare has four parts. Part A covers hospital stays — most people pay $0 premium (paid through payroll taxes). Part B covers outpatient care: $185/month in 2025, income-adjusted above $103,000 income. Part C (Medicare Advantage) bundles A+B through private insurers, often with vision/dental. Part D covers prescriptions. The coverage gap: Medicare doesn\'t cover long-term care (nursing homes) — that requires Medicaid or separate long-term care insurance. Enroll in Part B within 3 months of turning 65 or face a 10% premium penalty for each year you delay.',
  }

  const defaultBody = `Understanding ${title.toLowerCase()} can save you thousands of dollars and prevent coverage gaps. The key is knowing exactly what your policy covers and what it excludes before you need to file a claim. Insurance contracts are written to benefit the insurer — reading the exclusions section is as important as reading the coverage section.`

  return (
    <>
      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {bodyMap[cfg.slug] ?? defaultBody}
      </p>

      {cfg.type === 'health-state' && (
        <>
          <h2 style={sectionHeading}>2025 ACA Marketplace Premiums (Before Subsidies)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
            {Object.entries(HEALTH_INSURANCE_PREMIUMS_2025.individual).map(([tier, premium]) => (
              <div key={tier} style={statCard}>
                <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'capitalize', marginBottom: 4 }}>{tier} Plan</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)' }}>${premium}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>individual/mo</div>
              </div>
            ))}
          </div>
        </>
      )}

      <RelatedLinks
        title="Related Calculators & Guides"
        links={[
          { title: 'Auto Insurance Guide', href: '/insurance/auto-insurance-texas', icon: '🚗' },
          { title: 'Life Insurance at 35', href: '/insurance/life-insurance-age-35', icon: '🛡️' },
          { title: 'Net Worth Calculator', href: '/calculator/net-worth-calculator', icon: '💰' },
          { title: 'Budget Calculator', href: '/calculator/budget-calculator', icon: '📊' },
        ]}
      />
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default async function InsuranceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cfg = parseInsuranceSlug(slug)
  if (!cfg) notFound()

  const getTitle = (): string => {
    switch (cfg.type) {
      case 'auto-state':
        return `${cfg.stateName} Auto Insurance: Average Cost & Requirements (2025)`
      case 'auto-driver':
        return `Auto Insurance for ${cfg.driverType?.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} (2025)`
      case 'home-state':
        return `${cfg.stateName} Homeowners Insurance: Average Cost (2025)`
      case 'life-age':
        return `Life Insurance at Age ${cfg.age}: Rates & Guide (2025)`
      case 'life-coverage':
        return `${cfg.coverage?.toUpperCase()} Life Insurance: Cost by Age (2025)`
      default: {
        const titleMap: Record<string, string> = {
          'homeowners-insurance-guide': 'Homeowners Insurance: Complete 2025 Guide',
          'flood-insurance-guide': 'Flood Insurance Guide 2025',
          'earthquake-insurance-guide': 'Earthquake Insurance Guide 2025',
          'renters-insurance-guide': 'Renters Insurance Guide 2025',
          'term-vs-whole-life-insurance': 'Term vs Whole Life Insurance (2025)',
          'how-much-life-insurance-do-i-need': 'How Much Life Insurance Do You Need?',
          'aca-marketplace-guide': 'ACA Marketplace Guide 2025',
          'cobra-insurance-guide': 'COBRA Insurance Guide 2025',
          'medicare-guide': 'Medicare Guide: Parts A, B, C, D',
          'medicaid-guide': 'Medicaid Guide 2025',
          'hmo-vs-ppo-vs-epo': 'HMO vs PPO vs EPO: Which Health Plan?',
        }
        return titleMap[slug] ?? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/insurance" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Insurance
        </Link>
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.2 }}>
        {getTitle()}
      </h1>

      <AdSlot slot="1122334455" format="leaderboard" />

      {cfg.type === 'auto-state' && <AutoStatePage cfg={cfg} />}
      {cfg.type === 'home-state' && <HomeStatePage cfg={cfg} />}
      {cfg.type === 'life-age' && <LifeAgePage cfg={cfg} />}
      {(cfg.type === 'auto-driver' || cfg.type === 'home-guide' || cfg.type === 'life-guide' ||
        cfg.type === 'life-coverage' || cfg.type === 'health-state' || cfg.type === 'health-guide' ||
        cfg.type === 'other-guide') && <GuidePage cfg={cfg} />}

      <AdSlot slot="2233445566" format="rectangle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: `https://calchive.com/insurance/${slug}`,
            name: getTitle(),
            description: 'Insurance cost estimates, rates by state, and guides for US consumers.',
            isPartOf: { '@type': 'WebSite', name: 'Calchive', url: 'https://calchive.com' },
          }),
        }}
      />
    </div>
  )
}
