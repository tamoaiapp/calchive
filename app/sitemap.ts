import type { MetadataRoute } from 'next'
import { ALL_CALCULATORS } from '@/lib/calculators'
import { ALL_TOOLS } from '@/lib/tools'
import { TAX_PAGE_SLUGS } from '@/lib/tax/pages-manifest'
import { MORTGAGE_PAGE_SLUGS } from '@/lib/mortgage/pages-manifest'
import { LOAN_PAGE_SLUGS } from '@/lib/loan/pages-manifest'
import { HEALTH_PAGE_SLUGS } from '@/lib/health/pages-manifest'
import { CAREER_PAGE_SLUGS } from '@/lib/career/pages-manifest'
import { INSURANCE_PAGE_SLUGS } from '@/lib/insurance/pages-manifest'
import { CREDIT_PAGE_SLUGS } from '@/lib/credit/pages-manifest'
import { RETIREMENT_PAGE_SLUGS } from '@/lib/retirement/pages-manifest'
import { GUIDE_SLUGS } from '@/lib/guides/manifest'
import { PROFESSIONS } from '@/lib/salary/professions'
import { STATES_ALL } from '@/lib/salary/states'

const BASE_URL = 'https://www.usa-calc.com'

// Salary state+amount combinations
const SALARY_AMOUNTS = [
  30000, 40000, 50000, 60000, 75000, 100000, 125000, 150000, 200000, 250000,
]

function entry(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] = 'monthly',
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Homepage
  entries.push(entry('/', 1.0, 'daily'))

  // Section roots
  const sectionRoots = [
    '/calculator', '/tool', '/salary', '/tax',
    '/mortgage', '/loan', '/health', '/career',
    '/insurance', '/credit', '/retirement', '/guide',
  ]
  for (const route of sectionRoots) {
    entries.push(entry(route, 0.9, 'weekly'))
  }

  // Individual calculators
  for (const calc of ALL_CALCULATORS) {
    entries.push(entry(`/calculator/${calc.slug}`, 0.8))
  }

  // Individual tools
  for (const tool of ALL_TOOLS) {
    entries.push(entry(`/tool/${tool.slug}`, 0.8))
  }

  // Salary: state + amount pages
  for (const state of STATES_ALL) {
    for (const amount of SALARY_AMOUNTS) {
      entries.push(entry(`/salary/${state.slug}/${amount}`, 0.8))
    }
  }

  // Salary: career/profession pages
  for (const profession of PROFESSIONS) {
    entries.push(entry(`/salary/career/${profession.slug}`, 0.7))
  }

  // Tax pages
  for (const slug of TAX_PAGE_SLUGS) {
    entries.push(entry(`/tax/${slug}`, 0.8))
  }

  // Mortgage pages
  for (const slug of MORTGAGE_PAGE_SLUGS) {
    entries.push(entry(`/mortgage/${slug}`, 0.8))
  }

  // Loan pages
  for (const slug of LOAN_PAGE_SLUGS) {
    entries.push(entry(`/loan/${slug}`, 0.8))
  }

  // Health pages
  for (const slug of HEALTH_PAGE_SLUGS) {
    entries.push(entry(`/health/${slug}`, 0.6))
  }

  // Career pages
  for (const slug of CAREER_PAGE_SLUGS) {
    entries.push(entry(`/career/${slug}`, 0.6))
  }

  // Insurance pages
  for (const slug of INSURANCE_PAGE_SLUGS) {
    entries.push(entry(`/insurance/${slug}`, 0.8))
  }

  // Credit pages
  for (const slug of CREDIT_PAGE_SLUGS) {
    entries.push(entry(`/credit/${slug}`, 0.8))
  }

  // Retirement pages
  for (const slug of RETIREMENT_PAGE_SLUGS) {
    entries.push(entry(`/retirement/${slug}`, 0.8))
  }

  // Guide pages
  for (const slug of GUIDE_SLUGS) {
    entries.push(entry(`/guide/${slug}`, 0.7))
  }

  return entries
}
