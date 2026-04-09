import type { ToolConfig } from './types'
import { converterTools } from './tools-converters'
import { financeReferenceTools } from './tools-finance-reference'
import { lifestyleTools } from './tools-lifestyle'
import { techTools } from './tools-tech'
import { careerTools } from './tools-career'
import { realEstateTools } from './tools-real-estate'

export const ALL_TOOLS: ToolConfig[] = [
  ...converterTools,
  ...financeReferenceTools,
  ...lifestyleTools,
  ...techTools,
  ...careerTools,
  ...realEstateTools,
]

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug)
}

export interface ToolCategory {
  slug: string
  name: string
  icon: string
  desc: string
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    slug: 'converter',
    name: 'Converters',
    icon: '🔄',
    desc: 'Unit, format, and measurement converters for length, weight, temperature, data, and more.',
  },
  {
    slug: 'finance',
    name: 'Finance & Tax Reference',
    icon: '💰',
    desc: 'IRS tax brackets, contribution limits, state tax rates, and financial reference tables.',
  },
  {
    slug: 'lifestyle',
    name: 'Lifestyle & Everyday',
    icon: '🌟',
    desc: 'Date calculators, recipe tools, budgeting, wellness, and daily life utilities.',
  },
  {
    slug: 'tech',
    name: 'Tech & Developer',
    icon: '💻',
    desc: 'Password tools, network calculators, SEO checkers, and statistical tools.',
  },
  {
    slug: 'career',
    name: 'Career & Jobs',
    icon: '💼',
    desc: 'Salary comparisons, benefits calculators, tax guides, and job offer tools.',
  },
  {
    slug: 'real-estate',
    name: 'Real Estate',
    icon: '🏠',
    desc: 'Home affordability, mortgage tools, property taxes, landlord/tenant guides, and more.',
  },
]
