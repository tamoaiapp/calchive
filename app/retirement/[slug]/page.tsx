import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import {
  RETIREMENT_PAGE_SLUGS,
  parseRetirementSlug,
  SS_CLAIMING_BENEFIT,
  K401_BENCHMARK_MULTIPLIER,
} from '@/lib/retirement/pages-manifest'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return RETIREMENT_PAGE_SLUGS.slice(0, 80).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const cfg = parseRetirementSlug(slug)
  if (!cfg) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  switch (cfg.type) {
    case 'retire-at': {
      const annual = Math.round(cfg.amount! * 0.04)
      title = `Can I Retire at ${cfg.age} with $${(cfg.amount! / 1000000).toFixed(cfg.amount! >= 1000000 ? 1 : 0).replace('.0', '')}${cfg.amount! >= 1000000 ? 'M' : 'k'}?`
      description = `Retiring at ${cfg.age} with $${cfg.amount!.toLocaleString()} produces $${annual.toLocaleString()}/year via the 4% rule. Is it enough? Expense breakdown, Social Security timing, and longevity analysis.`
      break
    }
    case '401k-age': {
      const mult = K401_BENCHMARK_MULTIPLIER[cfg.age!]
      title = `How Much Should You Have in Your 401k at ${cfg.age}?`
      description = `Fidelity recommends ${mult}x your annual salary in your 401k by age ${cfg.age}. On a $75,000 salary, that's $${(75000 * mult).toLocaleString()}. Are you on track?`
      break
    }
    case 'roth-ira':
      title = `Roth IRA at ${cfg.age}: Contribution Limits and Growth Projections`
      description = `At age ${cfg.age}, you can contribute $7,000/year to a Roth IRA ($8,000 if 50+). See 20-year and 30-year growth projections at different contribution levels.`
      break
    case 'ss-age': {
      const pct = SS_CLAIMING_BENEFIT[cfg.age!]
      title = `Social Security at ${cfg.age}: ${pct}% of Full Benefit Explained`
      description = `Claiming Social Security at ${cfg.age} gives you ${pct}% of your full retirement benefit. On a $2,000 full benefit, that's $${Math.round(2000 * pct / 100)}/month. How this decision plays out over a lifetime.`
      break
    }
    case 'ss-income':
      title = `Social Security Benefit for $${cfg.income!.toLocaleString()} Earners`
      description = `Workers earning $${cfg.income!.toLocaleString()}/year can estimate their Social Security benefit. See how years of earnings, claiming age, and AIME calculations determine your monthly check.`
      break
    default:
      title = `${slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | USA-Calc`
      description = `Retirement planning guide: ${slug.replace(/-/g, ' ')}.`
  }

  return {
    title: `${title} | USA-Calc`,
    description,
    alternates: { canonical: `/retirement/${slug}` },
    openGraph: { title, description, type: 'article' },
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sh: React.CSSProperties = {
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

function fmt(n: number): string {
  return n.toLocaleString('en-US')
}

function fmtAmount(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000 % 1 === 0 ? (n / 1000000).toFixed(0) : (n / 1000000).toFixed(1))}M`
  return `$${(n / 1000).toFixed(0)}k`
}

// ─── Retire-At Page ────────────────────────────────────────────────────────────
function RetireAtPage({ age, amount }: { age: number; amount: number }) {
  const annual4pct = Math.round(amount * 0.04)
  const annual3pct = Math.round(amount * 0.03)
  const annual5pct = Math.round(amount * 0.05)
  const monthly4pct = Math.round(annual4pct / 12)

  // Average US monthly expenses for a retired couple (2025 BLS)
  const avgRetiredMonthly = 4065
  const surplus = monthly4pct - avgRetiredMonthly

  const lifeExpectancy = 85
  const retirementYears = lifeExpectancy - age
  const totalNeeded = avgRetiredMonthly * 12 * retirementYears

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Nest Egg</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>{fmtAmount(amount)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>4% Rule Annual Income</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>${fmt(annual4pct)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Monthly</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>${fmt(monthly4pct)}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>vs Avg Retired Couple</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: surplus >= 0 ? '#10b981' : '#f87171' }}>
              {surplus >= 0 ? '+' : ''}{fmt(surplus)}/mo
            </div>
          </div>
        </div>
      </div>

      <h2 style={sh}>Is {fmtAmount(amount)} Enough to Retire at {age}?</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        The 4% rule — pioneered by financial planner William Bengen in 1994 and validated by the Trinity Study —
        suggests withdrawing 4% of your portfolio in Year 1, then adjusting for inflation annually. With ${fmt(amount)},
        that&apos;s ${fmt(annual4pct)}/year or ${fmt(monthly4pct)}/month. The average retired household spends
        $4,065/month (2022 BLS Consumer Expenditure Survey).
        {surplus >= 0
          ? ` At this portfolio size, you have a ${fmt(surplus)}/month cushion above average expenses.`
          : ` This is ${fmt(Math.abs(surplus))}/month below average retired household spending — Social Security income, part-time work, or reduced expenses would bridge the gap.`
        }
      </p>

      <h2 style={sh}>Withdrawal Rate Comparison</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: '3% (Very Conservative)', annual: annual3pct, color: '#10b981' },
          { label: '4% (Standard)', annual: annual4pct, color: 'var(--accent)' },
          { label: '5% (Aggressive)', annual: annual5pct, color: '#f87171' },
        ].map(r => (
          <div key={r.label} style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{r.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: r.color }}>${fmt(r.annual)}/yr</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>${fmt(Math.round(r.annual / 12))}/mo</div>
          </div>
        ))}
      </div>

      <h2 style={sh}>How Long Will It Last?</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        Retiring at {age} means a {retirementYears}-year retirement to age 85 (average life expectancy for
        a {age}-year-old is actually higher — about 87 for women, 84 for men). At 4% withdrawals with 7% average
        investment returns and 3% inflation, a {fmtAmount(amount)} portfolio historically lasts 30+ years in
        90%+ of historical market scenarios. The risk: early retirement (pre-60) spans more market cycles.
      </p>

      {age < 65 && (
        <>
          <h2 style={sh}>Social Security Consideration</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
            If you retire at {age}, you can claim Social Security as early as 62 (at 70% of full benefit) or
            delay to 70 (at 124% of full benefit). Delaying to 70 increases your monthly check by 77% vs claiming
            at 62. For most healthy individuals, delaying maximizes lifetime income — but only if you can fund
            the gap years from portfolio or other income.
          </p>
        </>
      )}

      <RelatedLinks
        title="Related Calculators"
        links={[
          { title: 'Retirement Savings Calculator', href: '/calculator/retirement-savings-calculator', icon: '🏦' },
          { title: 'Social Security at 67', href: '/retirement/social-security-at-age-67', icon: '💰' },
          { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '📈' },
          { title: '401k at 50', href: '/retirement/401k-at-age-50', icon: '📊' },
        ]}
      />
    </>
  )
}

// ─── 401k Age Page ─────────────────────────────────────────────────────────────
function K401AgePage({ age, multiplier }: { age: number; multiplier: number }) {
  const SAMPLE_SALARIES = [50000, 75000, 100000, 125000, 150000]

  return (
    <>
      <div style={statCard}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>
          Fidelity benchmark: save {multiplier}x your annual salary by age {age}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SAMPLE_SALARIES.map(sal => (
            <div key={sal}>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>${(sal / 1000).toFixed(0)}k salary</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>
                ${fmt(sal * multiplier)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>target balance</div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={sh}>Why {multiplier}x at Age {age}?</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        Fidelity&apos;s benchmarks assume you start saving at 25 at a 15% savings rate (including employer match),
        retire at 67, and replace 45% of pre-retirement income from savings (Social Security covers the rest).
        Hitting {multiplier}x your salary at {age} keeps you on this track. The benchmark assumes a target-date fund
        allocation appropriate for your age — roughly {Math.max(10, 100 - age)}% stocks.
      </p>

      <h2 style={sh}>2025 401k Contribution Limits</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: '1.5rem' }}>
        {[
          { label: 'Employee Limit (under 50)', amount: 23500 },
          { label: 'Catch-Up Contribution (50–59)', amount: 7500 },
          { label: 'Catch-Up Contribution (60–63)', amount: 11250 },
          { label: 'Total with Employer Match', amount: 70000 },
        ].map(item => (
          <div key={item.label} style={statCard}>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>${fmt(item.amount)}</div>
          </div>
        ))}
      </div>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Retirement Savings Calculator', href: '/calculator/retirement-savings-calculator', icon: '🏦' },
          { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '📈' },
          { title: 'Retire at 65 with $1M', href: '/retirement/retire-at-65-with-1m', icon: '💰' },
        ]}
      />
    </>
  )
}

// ─── Social Security Age Page ─────────────────────────────────────────────────
function SSAgePage({ age, ssPercent }: { age: number; ssPercent: number }) {
  const SAMPLE_BENEFITS = [1200, 1600, 2000, 2500, 3000]
  const BREAKEVEN_VS_67: Record<number, string> = {
    62: '~79 years old',
    63: '~80 years old',
    64: '~81 years old',
    65: '~82 years old',
    66: '~83 years old',
    67: 'N/A (full benefit)',
    68: '~78 years old',
    69: '~80 years old',
    70: '~82 years old',
  }

  return (
    <>
      <div style={statCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: age < 67 ? '#f87171' : '#10b981' }}>
            {ssPercent}%
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
              of Full Retirement Benefit
            </div>
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>
              {age < 67 ? `${67 - age} years before FRA — permanently reduced` : age > 67 ? 'Delayed credits applied' : 'Full Retirement Age'}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
          {SAMPLE_BENEFITS.map(full => {
            const atAge = Math.round(full * ssPercent / 100)
            return (
              <div key={full}>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 2 }}>
                  If full benefit = ${fmt(full)}/mo
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: age >= 67 ? '#10b981' : 'var(--text)' }}>
                  ${fmt(atAge)}/mo
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <h2 style={sh}>The Claiming Age Decision</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        Claiming at {age} gives you {ssPercent}% of your Primary Insurance Amount (PIA).
        {age < 67
          ? ` This reduction is permanent — it applies for every month you receive benefits. The breakeven point vs waiting until 67: ${BREAKEVEN_VS_67[age] ?? 'varies by benefit amount'}. If you live past the breakeven, waiting would have produced more lifetime income.`
          : age > 67
            ? ` Delayed Retirement Credits add 8%/year from 67 to 70 — the highest guaranteed return available to retirees. Breakeven vs claiming at 67: ${BREAKEVEN_VS_67[age] ?? 'varies'}.`
            : ' This is the Full Retirement Age (FRA) for people born in 1960 or later — you receive 100% of your calculated benefit.'
        }
      </p>

      <h2 style={sh}>All Claiming Ages Compared</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
        {Object.entries(SS_CLAIMING_BENEFIT).map(([a, pct]) => (
          <Link
            key={a}
            href={`/retirement/social-security-at-age-${a}`}
            style={{
              padding: '12px 16px',
              background: a === String(age) ? 'rgba(59,130,246,0.12)' : 'var(--card)',
              border: `1px solid ${a === String(age) ? 'rgba(59,130,246,0.4)' : 'var(--line)'}`,
              borderRadius: 12,
              textDecoration: 'none',
              display: 'block',
            }}
          >
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Age {a}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: Number(a) >= 67 ? '#10b981' : 'var(--text)' }}>{pct}%</div>
          </Link>
        ))}
      </div>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Retirement Savings Calculator', href: '/calculator/retirement-savings-calculator', icon: '🏦' },
          { title: 'When to Claim Social Security', href: '/retirement/when-to-claim-social-security', icon: '📋' },
          { title: 'Retire at 65 with $1M', href: '/retirement/retire-at-65-with-1m', icon: '💰' },
        ]}
      />
    </>
  )
}

// ─── SS Income Page ─────────────────────────────────────────────────────────────
function SSIncomePage({ income }: { income: number }) {
  // Simplified AIME-based benefit estimate
  // SSA bend points 2025: first $1,226 → 90%, next $6,160 → 32%, above → 15%
  const aime = Math.round(income / 12)
  let pia = 0
  const bp1 = 1226, bp2 = 7391
  if (aime <= bp1) {
    pia = aime * 0.9
  } else if (aime <= bp2) {
    pia = bp1 * 0.9 + (aime - bp1) * 0.32
  } else {
    pia = bp1 * 0.9 + (bp2 - bp1) * 0.32 + (aime - bp2) * 0.15
  }
  pia = Math.round(pia)

  return (
    <>
      <div style={statCard}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
          Estimated Social Security benefit for ${fmt(income)}/year earner (35-year work history at this income)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Full Benefit (age 67)</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#10b981' }}>${fmt(pia)}/mo</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Claim at 62 (70%)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#f87171' }}>${fmt(Math.round(pia * 0.7))}/mo</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Claim at 70 (124%)</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>${fmt(Math.round(pia * 1.24))}/mo</div>
          </div>
        </div>
      </div>

      <h2 style={sh}>How Social Security Calculates Your Benefit</h2>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
        The SSA takes your highest 35 years of earnings, adjusts for wage inflation (AIME), then applies a
        progressive formula using bend points. For 2025, you earn 90 cents of benefit per dollar of AIME up
        to $1,226, then 32 cents per dollar from $1,226–$7,391, then 15 cents above that. This makes Social
        Security more generous relative to earnings for lower earners.
      </p>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Social Security at 62', href: '/retirement/social-security-at-age-62', icon: '📋' },
          { title: 'Retire at 67 with $1M', href: '/retirement/retire-at-67-with-1m', icon: '💰' },
          { title: 'When to Claim Social Security', href: '/retirement/when-to-claim-social-security', icon: '📊' },
        ]}
      />
    </>
  )
}

// ─── Roth IRA Page ─────────────────────────────────────────────────────────────
function RothIRAPage({ age }: { age: number }) {
  const yearsTo67 = 67 - age
  const annualContrib = 7000
  const calcFV = (annual: number, years: number, rate: number): number => {
    return Math.round(annual * ((Math.pow(1 + rate, years) - 1) / rate))
  }
  const fv7 = calcFV(annualContrib, yearsTo67, 0.07)
  const fv10 = calcFV(annualContrib, yearsTo67, 0.10)

  return (
    <>
      <div style={statCard}>
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 12 }}>
          Contributing $7,000/year from age {age} to 67 ({yearsTo67} years)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>At 7% avg return</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>${(fv7 / 1000).toFixed(0)}k</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>At 10% avg return</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)' }}>${(fv10 / 1000).toFixed(0)}k</div>
          </div>
          <div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Total contributions</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--text)' }}>${(annualContrib * yearsTo67 / 1000).toFixed(0)}k</div>
          </div>
        </div>
      </div>

      <h2 style={sh}>Roth IRA Rules at a Glance (2025)</h2>
      <ul style={{ color: 'var(--muted)', lineHeight: 2, paddingLeft: '1.25rem' }}>
        <li>Contribution limit: $7,000/year ($8,000 if age 50+)</li>
        <li>Income limit (single): phase out $150,000–$165,000; above $165,000 = no direct contribution</li>
        <li>Income limit (married): phase out $236,000–$246,000</li>
        <li>Withdrawals in retirement: 100% tax-free (contributions + growth)</li>
        <li>No required minimum distributions (unlike traditional 401k/IRA)</li>
        <li>Contributions (not earnings) can be withdrawn any time without penalty</li>
      </ul>

      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '📈' },
          { title: 'Backdoor Roth IRA Guide', href: '/retirement/backdoor-roth-ira-guide', icon: '📋' },
          { title: '401k at 40', href: '/retirement/401k-at-age-40', icon: '🏦' },
        ]}
      />
    </>
  )
}

// ─── SS Guide Page ─────────────────────────────────────────────────────────────
function SSGuidePage({ slug }: { slug: string }) {
  const titleMap: Record<string, string> = {
    'when-to-claim-social-security': 'When to Claim Social Security: The Complete Decision Guide',
    'social-security-for-married-couples': 'Social Security for Married Couples: Maximizing Combined Benefits',
    'social-security-for-divorced-spouses': 'Social Security for Divorced Spouses: Spousal Benefits Explained',
    'social-security-survivor-benefits': 'Social Security Survivor Benefits: What Widows/Widowers Receive',
    'social-security-disability-guide': 'Social Security Disability (SSDI): Qualification and Benefits',
    'medicare-enrollment-guide': 'Medicare Enrollment: Deadlines, Penalties, and Part Selection',
    'required-minimum-distributions-guide': 'Required Minimum Distributions (RMDs): Rules and Calculations',
    'inherited-ira-guide': 'Inherited IRA: 10-Year Rule and Distribution Strategies',
    'spousal-ira-guide': 'Spousal IRA: Contributing for a Non-Working Spouse',
    'backdoor-roth-ira-guide': 'Backdoor Roth IRA: The Legal Workaround for High Earners',
  }
  const title = titleMap[slug] ?? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  const bodyMap: Record<string, string> = {
    'when-to-claim-social-security': 'The break-even analysis: claiming at 62 vs 67 requires living past ~79 for the later claim to win in total lifetime dollars. Claiming at 62 vs 70 break-even: ~81–82. Most financial planners recommend delaying to 70 for the higher earner in a couple, because Social Security becomes the survivor benefit — the higher-earning spouse\'s check is what the surviving spouse collects for life. The key variable isn\'t life expectancy, it\'s health at the time of decision. If you have a serious illness at 62, claiming early likely maximizes lifetime income.',
    'backdoor-roth-ira-guide': 'High earners above the Roth IRA income limit ($165,000 single, $246,000 married in 2025) can still fund a Roth via the backdoor. Step 1: Make a non-deductible traditional IRA contribution ($7,000 for 2025). Step 2: Convert the traditional IRA to Roth immediately. Tax owed: $0 on the conversion if the traditional IRA had no other pre-tax funds (the pro-rata rule). If you have other traditional IRA money, the pro-rata rule applies and you owe taxes on the conversion proportional to pre-tax vs after-tax funds across all your IRAs.',
    'required-minimum-distributions-guide': 'RMDs begin at age 73 (SECURE 2.0 Act change from 72). The RMD amount = account balance on December 31 of the prior year ÷ IRS life expectancy factor for your age. At 73, the factor is 26.5, meaning you withdraw ~3.77% of the balance. RMDs apply to traditional IRAs, 401ks, and most retirement accounts — not Roth IRAs (Roth 401ks are also exempt from RMDs after 2024). Missing an RMD triggers a 25% excise tax on the shortfall, reduced to 10% if corrected quickly.',
    'social-security-for-married-couples': 'Married couples get two bites at the Social Security apple — each spouse has their own benefit based on earnings history, plus a spousal benefit worth up to 50% of the higher earner\'s full retirement benefit. The optimal strategy for most couples: the lower earner claims at 62 to bring in income, while the higher earner delays to 70 to maximize the survivor benefit. When one spouse dies, the survivor collects only one check — whichever is larger. That makes the higher earner\'s delayed benefit the couple\'s single most impactful financial decision.',
    'social-security-for-divorced-spouses': 'If your marriage lasted at least 10 years and you are currently unmarried, you can claim a spousal benefit worth up to 50% of your ex-spouse\'s full retirement benefit — without affecting their payment at all. You can claim as early as 62, or wait until your own full retirement age for the full 50%. If your own earned benefit exceeds the spousal benefit, SSA pays your own amount. The ex-spouse does not need to have filed yet, as long as both of you are at least 62.',
    'social-security-survivor-benefits': 'Survivor benefits pay up to 100% of the deceased spouse\'s benefit — higher than the 50% spousal benefit available while both spouses are alive. Widows and widowers can claim as early as age 60 (50 if disabled), but the benefit is permanently reduced if claimed before full retirement age. A key strategy: claim the survivor benefit early while letting your own earned benefit grow to 70, then switch if your own benefit ends up larger. Children under 18 and dependent parents may also qualify for survivor benefits.',
    'social-security-disability-guide': 'SSDI pays workers who have contributed to Social Security and can no longer work due to a qualifying medical condition expected to last at least 12 months or result in death. The benefit amount equals your full retirement benefit — there is no reduction for claiming early. In 2025, the average SSDI payment is $1,580/month. To qualify, you typically need 40 work credits (10 years of work), with 20 earned in the last 10 years. SSI is separate — it\'s need-based and covers people with limited work history.',
    'medicare-enrollment-guide': 'Medicare Part A (hospital) is free for most people with 40+ work credits. Part B (outpatient) costs $185/month in 2025. The Initial Enrollment Period is 7 months centered on your 65th birthday month. Missing it triggers a 10% permanent penalty per 12-month period for Part B, and 1% per month for Part D (drug coverage). If you have employer coverage at 65, you can delay without penalty — but COBRA and marketplace plans do not count as creditable coverage for this purpose.',
    'inherited-ira-guide': 'Under the SECURE Act 10-Year Rule, most non-spouse beneficiaries must empty an inherited IRA within 10 years of the owner\'s death. There are no annual RMD requirements within those 10 years — you can take any amount in any year, or wait until year 10. Exception: "eligible designated beneficiaries" (surviving spouses, minor children, disabled individuals, and beneficiaries within 10 years of age) can use the old stretch rules. Inherited Roth IRAs also follow the 10-year rule but distributions are tax-free.',
    'spousal-ira-guide': 'A non-working spouse can contribute to a Spousal IRA based on the working spouse\'s earned income. The limit is $7,000/year ($8,000 if 50+) for 2025, as long as the couple files jointly and the working spouse earns at least that amount. The contribution can go into a traditional IRA (deductible if income qualifies) or a Roth IRA (subject to income limits: phase-out at $236,000–$246,000 for married filing jointly). This effectively doubles the couple\'s annual IRA contribution capacity.',
  }

  const faqMap: Record<string, { q: string; a: string }[]> = {
    'when-to-claim-social-security': [
      { q: 'At what age should I claim Social Security?', a: 'For most people in good health, delaying to age 70 maximizes lifetime income — especially for the higher earner in a couple, since that benefit becomes the survivor check. The break-even vs claiming at 62 is roughly age 81–82.' },
      { q: 'What happens if I claim Social Security at 62?', a: 'Claiming at 62 permanently reduces your benefit to 70% of your full retirement amount. You receive more checks over your lifetime, but each one is smaller. The reduction never reverses, even if you reach full retirement age.' },
    ],
    'backdoor-roth-ira-guide': [
      { q: 'Who can use the backdoor Roth IRA strategy?', a: 'Anyone whose income exceeds the Roth IRA phase-out limit ($165,000 single, $246,000 married in 2025) can use the backdoor Roth. You make a non-deductible traditional IRA contribution, then immediately convert it to Roth.' },
      { q: 'Do I owe taxes on a backdoor Roth conversion?', a: 'If your traditional IRA contains only non-deductible (after-tax) contributions and no pre-tax funds, the conversion is tax-free. If you have pre-tax IRA money, the pro-rata rule applies and a portion of the conversion is taxable.' },
    ],
    'required-minimum-distributions-guide': [
      { q: 'When do RMDs start?', a: 'Required Minimum Distributions start at age 73 under the SECURE 2.0 Act (passed in 2022, effective 2023). The age rises to 75 for people born in 1960 or later.' },
      { q: 'How is the RMD amount calculated?', a: 'RMD = prior December 31 account balance ÷ IRS Uniform Lifetime Table factor for your age. At age 73 the factor is 26.5, so you withdraw about 3.77% of the balance. The factor decreases each year, increasing the withdrawal percentage.' },
    ],
  }

  const body = bodyMap[slug]
  const faqs = faqMap[slug]

  // Fallback body for slugs without a specific entry — data-driven, not generic
  const fallbackBody = `See the key rules, deadlines, and dollar amounts below. All figures reflect 2025 SSA and IRS data.`

  return (
    <>
      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {body ?? fallbackBody}
      </p>
      {faqs && faqs.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          {faqs.map((item, i) => (
            <div key={i} style={{ marginBottom: '1.25rem', padding: '1rem 1.25rem', background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14 }}>
              <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.4rem', fontSize: '0.95rem' }}>{item.q}</div>
              <div style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>{item.a}</div>
            </div>
          ))}
        </div>
      )}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(item => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }),
          }}
        />
      )}
      <RelatedLinks
        title="Related Tools"
        links={[
          { title: 'Retirement Savings Calculator', href: '/calculator/retirement-savings-calculator', icon: '🏦' },
          { title: 'Social Security at 67', href: '/retirement/social-security-at-age-67', icon: '💰' },
          { title: 'Compound Interest Calculator', href: '/calculator/compound-interest', icon: '📈' },
        ]}
      />
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default async function RetirementSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const cfg = parseRetirementSlug(slug)
  if (!cfg) notFound()

  const getTitle = (): string => {
    switch (cfg.type) {
      case 'retire-at':
        return `Can I Retire at ${cfg.age} With ${cfg.amount! >= 1000000 ? `$${(cfg.amount! / 1000000).toFixed(cfg.amount! % 1000000 === 0 ? 0 : 1)}M` : `$${cfg.amount! / 1000}k`}?`
      case '401k-age':
        return `How Much Should I Have in My 401k at ${cfg.age}?`
      case 'roth-ira':
        return `Roth IRA at Age ${cfg.age}: Limits, Growth & Strategy`
      case 'ss-age':
        return `Social Security at ${cfg.age}: ${SS_CLAIMING_BENEFIT[cfg.age!]}% of Full Benefit`
      case 'ss-income':
        return `Social Security Benefit for $${cfg.income!.toLocaleString()}/Year Earners`
      default: {
        const t: Record<string, string> = {
          'when-to-claim-social-security': 'When to Claim Social Security',
          'backdoor-roth-ira-guide': 'Backdoor Roth IRA Guide 2025',
          'required-minimum-distributions-guide': 'Required Minimum Distributions Guide',
        }
        return t[slug] ?? slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      }
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link href="/retirement" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
          ← Retirement
        </Link>
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 1rem', lineHeight: 1.2 }}>
        {getTitle()}
      </h1>

      <AdSlot slot="5566778899" format="leaderboard" />

      {cfg.type === 'retire-at' && <RetireAtPage age={cfg.age!} amount={cfg.amount!} />}
      {cfg.type === '401k-age' && <K401AgePage age={cfg.age!} multiplier={cfg.k401Multiplier!} />}
      {cfg.type === 'roth-ira' && <RothIRAPage age={cfg.age!} />}
      {cfg.type === 'ss-age' && <SSAgePage age={cfg.age!} ssPercent={cfg.ssPercent!} />}
      {cfg.type === 'ss-income' && <SSIncomePage income={cfg.income!} />}
      {cfg.type === 'ss-guide' && <SSGuidePage slug={slug} />}

      <AdSlot slot="6677889900" format="rectangle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            url: `https://usa-calc.com/retirement/${slug}`,
            name: getTitle(),
            description: 'Free retirement planning calculator — 401k benchmarks, Social Security, and FIRE projections.',
            dateModified: new Date().toISOString().split('T')[0],
            isPartOf: { '@type': 'WebSite', name: 'USA-Calc', url: 'https://usa-calc.com' },
          }),
        }}
      />

      {cfg.type === 'retire-at' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `Can I retire at ${cfg.age} with $${cfg.amount!.toLocaleString()}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Using the 4% rule, $${cfg.amount!.toLocaleString()} produces $${Math.round(cfg.amount! * 0.04).toLocaleString()}/year in retirement income — $${Math.round(cfg.amount! * 0.04 / 12).toLocaleString()}/month. The average retired household spends $4,065/month (2022 BLS data). Whether this is enough depends on your expenses, Social Security income, and investment returns.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `How long will $${cfg.amount!.toLocaleString()} last in retirement at age ${cfg.age}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `At 4% annual withdrawals with 7% average investment returns and 3% inflation, $${cfg.amount!.toLocaleString()} historically lasts 30+ years in over 90% of historical market scenarios. Retiring at ${cfg.age} means planning for a ${85 - cfg.age!}-year retirement to age 85 at minimum.`,
                  },
                },
              ],
            }),
          }}
        />
      )}

      {cfg.type === '401k-age' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `How much should I have in my 401k at ${cfg.age}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Fidelity recommends ${cfg.k401Multiplier}x your annual salary in your 401k by age ${cfg.age}. On a $75,000 salary, that target is $${(75000 * cfg.k401Multiplier!).toLocaleString()}. On a $100,000 salary, the target is $${(100000 * cfg.k401Multiplier!).toLocaleString()}.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `What is the 401k contribution limit at ${cfg.age}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `In 2025, the 401k employee contribution limit is $23,500. Workers aged 50–59 can add a $7,500 catch-up contribution for a total of $31,000. Workers aged 60–63 have an enhanced catch-up of $11,250 — bringing their total to $34,750.`,
                  },
                },
              ],
            }),
          }}
        />
      )}

      {cfg.type === 'ss-age' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: `What percentage of Social Security do I get at age ${cfg.age}?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Claiming Social Security at age ${cfg.age} gives you ${cfg.ssPercent}% of your full retirement benefit (Primary Insurance Amount). On a $2,000 full monthly benefit, that equals $${Math.round(2000 * cfg.ssPercent! / 100)}/month at age ${cfg.age}.`,
                  },
                },
                {
                  '@type': 'Question',
                  name: `Is it better to claim Social Security at ${cfg.age} or wait?`,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: `${cfg.age! < 67 ? `Claiming at ${cfg.age} permanently reduces your benefit to ${cfg.ssPercent}% of your full amount. Waiting until 67 gives you 100%, and waiting until 70 gives you 124%. The break-even vs waiting to 67 is roughly age ${cfg.age! <= 63 ? 79 : 81}.` : cfg.age! > 67 ? `Delaying past 67 adds 8%/year in Delayed Retirement Credits. At ${cfg.age}, you receive ${cfg.ssPercent}% of your full benefit. The break-even vs claiming at 67 is approximately age ${cfg.age! === 68 ? 78 : cfg.age! === 69 ? 80 : 82}.` : 'Age 67 is the Full Retirement Age for those born in 1960 or later — you receive 100% of your calculated benefit with no reduction or enhancement.'}`,
                  },
                },
              ],
            }),
          }}
        />
      )}
    </div>
  )
}
