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
      title = `${slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} | Calchive`
      description = `Retirement planning guide: ${slug.replace(/-/g, ' ')}.`
  }

  return {
    title: `${title} | Calchive`,
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
    'when-to-claim-social-security': 'The break-even analysis: claiming at 62 vs 67 requires living past ~79 for the later claim to win in total lifetime dollars. Claiming at 62 vs 70 break-even: ~81–82. Most financial planners now recommend delaying to 70 for the higher earner in a couple, because Social Security becomes the survivor benefit — the higher-earning spouse\'s benefit is what the surviving spouse collects for life. The key variable isn\'t life expectancy, it\'s health at the time of decision. If you have a serious illness at 62, claiming early likely maximizes lifetime income.',
    'backdoor-roth-ira-guide': 'High earners above the Roth IRA income limit ($165,000 single, $246,000 married in 2025) can still fund a Roth via the backdoor. Step 1: Make a non-deductible traditional IRA contribution ($7,000 for 2025). Step 2: Convert the traditional IRA to Roth immediately. Tax owed: $0 on the conversion if the traditional IRA had no other pre-tax funds (the pro-rata rule). If you have other traditional IRA money, the pro-rata rule applies and you owe taxes on the conversion proportional to pre-tax vs after-tax funds across all your IRAs.',
    'required-minimum-distributions-guide': 'RMDs begin at age 73 (SECURE 2.0 Act change from 72). The RMD amount = account balance on December 31 of the prior year ÷ IRS life expectancy factor for your age. At 73, the factor is 26.5, meaning you withdraw ~3.77% of the balance. RMDs are required from traditional IRAs, 401ks, and most retirement accounts — not Roth IRAs (though Roth 401ks now also exempt from RMDs after 2024). Missing an RMD triggers a 25% excise tax on the shortfall (reduced to 10% if corrected quickly).',
  }
  const defaultBody = `This is one of the most consequential retirement decisions you can make — the numbers involved often total hundreds of thousands of dollars over a lifetime. Understanding the rules, timelines, and strategies specific to your situation makes a significant difference.`

  return (
    <>
      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {bodyMap[slug] ?? defaultBody}
      </p>
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
            '@type': 'WebApplication',
            name: getTitle(),
            url: `https://calchive.com/retirement/${slug}`,
            description: 'Free retirement planning calculator — 401k benchmarks, Social Security, and FIRE projections.',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
    </div>
  )
}
