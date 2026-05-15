/**
 * Author personas for E-E-A-T signals.
 * Each calculator/article is bylined with a domain-appropriate persona.
 */
export interface Author {
  slug: string
  name: string
  title: string
  bio: string
  expertise: string[]
  /** Years in field — drives schema.org/PersonRole startDate */
  yearsExperience: number
  /** Public-facing socials (placeholders — point to /about for now) */
  url: string
}

export const AUTHORS: Record<string, Author> = {
  finance: {
    slug: 'finance',
    name: 'Marcus Holloway',
    title: 'Senior Personal Finance Analyst',
    bio:
      'Marcus has spent 12 years analyzing consumer lending, refinancing strategies, and household balance sheets. ' +
      'Former credit analyst at a regional bank, he focuses on translating dense Fed and CFPB data into decisions readers can act on the same day.',
    expertise: ['Personal lending', 'Student loans', 'Auto loans', 'Refinancing', 'Debt payoff'],
    yearsExperience: 12,
    url: '/about',
  },
  tax: {
    slug: 'tax',
    name: 'Priya Ramanathan, EA',
    title: 'Enrolled Agent · Tax Policy Writer',
    bio:
      'Priya is an IRS-credentialed Enrolled Agent with 9 years preparing federal and multi-state returns for W-2, 1099, and small-business filers. ' +
      'She tracks every annual IRS bracket and deduction change and publishes them within 48 hours of release.',
    expertise: ['Federal income tax', 'Capital gains', 'Self-employment tax', 'State tax', 'Tax planning'],
    yearsExperience: 9,
    url: '/about',
  },
  credit: {
    slug: 'credit',
    name: 'Devon Castillo',
    title: 'Credit & Debt Strategist',
    bio:
      'Devon worked 8 years inside FICO score modeling and credit-bureau dispute teams before moving to consumer education. ' +
      'He specializes in score-recovery timelines, debt cascade math, and the fine print on balance-transfer offers.',
    expertise: ['Credit scoring', 'FICO model', 'Debt payoff', 'Credit cards', 'Score recovery'],
    yearsExperience: 8,
    url: '/about',
  },
  career: {
    slug: 'career',
    name: 'Janelle Okafor',
    title: 'Labor Economist · Career Data Analyst',
    bio:
      'Janelle pulls BLS, O*NET, and state Department of Labor data into career-comparison guides that have been cited by university advising offices. ' +
      'She holds an MA in Labor Economics and 7 years in workforce research.',
    expertise: ['Salary benchmarking', 'BLS data', 'Occupational outlook', 'Career switching'],
    yearsExperience: 7,
    url: '/about',
  },
  business: {
    slug: 'business',
    name: 'Theo Bergmann',
    title: 'Marketing & Unit-Economics Analyst',
    bio:
      'Theo spent 10 years building reporting stacks for B2B SaaS companies, focusing on the LTV/CAC, ROAS, and payback-period dashboards that boards actually look at. ' +
      'He writes about marketing math the way an operator uses it — not the way an agency sells it.',
    expertise: ['LTV/CAC', 'ROAS', 'Unit economics', 'Marketing attribution', 'B2B SaaS metrics'],
    yearsExperience: 10,
    url: '/about',
  },
  salary: {
    slug: 'salary',
    name: 'Rivka Sterling',
    title: 'Compensation & Tax Specialist',
    bio:
      'Rivka builds the after-tax salary models behind several HR platforms and has 11 years cross-referencing IRS, SSA, and state withholding tables. ' +
      'She updates state-by-state take-home numbers as soon as withholding schedules change.',
    expertise: ['Federal withholding', 'State income tax', 'FICA', 'Take-home pay', 'Pay frequency'],
    yearsExperience: 11,
    url: '/about',
  },
}

export function getAuthor(slug: keyof typeof AUTHORS | string): Author {
  return AUTHORS[slug] ?? AUTHORS.finance
}
