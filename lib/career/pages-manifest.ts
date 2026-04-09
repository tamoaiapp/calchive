import { CAREERS_EXTENDED, type CareerExtended } from './professions-extended'
import { CAREER_TOPICS, type CareerTopic } from './topics'

export type CareerPageType =
  | 'career-guide'
  | 'how-to-become'
  | 'interview-questions'
  | 'skills'
  | 'resume-tips'
  | 'career-comparison'
  | 'topic-guide'

export interface CareerPageConfig {
  slug: string
  type: CareerPageType
  // For profession-based pages
  profession?: CareerExtended
  // For comparison pages
  professionA?: CareerExtended
  professionB?: CareerExtended
  // For topic guide pages
  topic?: CareerTopic
}

// Professions that have interview question and skills pages (higher-traffic subset)
const INTERVIEW_PROFESSIONS = [
  'software-engineer', 'data-scientist', 'machine-learning-engineer', 'devops-engineer',
  'cybersecurity-analyst', 'product-manager', 'data-engineer', 'cloud-architect',
  'financial-advisor', 'accountant', 'investment-banker', 'financial-analyst',
  'lawyer', 'paralegal', 'civil-engineer', 'mechanical-engineer', 'electrical-engineer',
  'marketing-manager', 'human-resources-manager', 'registered-nurse', 'nurse-practitioner',
  'physician-assistant', 'graphic-designer',
]

// Career comparison pairs
const COMPARISON_PAIRS: [string, string][] = [
  ['software-engineer', 'data-scientist'],
  ['software-engineer', 'machine-learning-engineer'],
  ['devops-engineer', 'cloud-architect'],
  ['data-scientist', 'data-engineer'],
  ['lawyer', 'paralegal'],
  ['registered-nurse', 'nurse-practitioner'],
  ['nurse-practitioner', 'physician-assistant'],
  ['accountant', 'financial-analyst'],
  ['financial-advisor', 'investment-banker'],
  ['civil-engineer', 'mechanical-engineer'],
  ['mechanical-engineer', 'electrical-engineer'],
  ['marketing-manager', 'product-manager'],
  ['software-engineer', 'product-manager'],
  ['software-engineer', 'devops-engineer'],
  ['data-scientist', 'machine-learning-engineer'],
  ['accountant', 'financial-advisor'],
  ['lawyer', 'financial-analyst'],
  ['cybersecurity-analyst', 'software-engineer'],
  ['ux-designer', 'product-manager'],
  ['registered-nurse', 'physician-assistant'],
  ['investment-banker', 'financial-analyst'],
  ['civil-engineer', 'electrical-engineer'],
  ['human-resources-manager', 'marketing-manager'],
  ['data-engineer', 'machine-learning-engineer'],
  ['cloud-architect', 'devops-engineer'],
]

function getCareerBySlug(slug: string): CareerExtended | undefined {
  return CAREERS_EXTENDED.find(c => c.slug === slug)
}

export function parseCareerSlug(slug: string): CareerPageConfig | null {
  // Check career-guide pattern: [profession]-career-guide
  for (const career of CAREERS_EXTENDED) {
    if (slug === `${career.slug}-career-guide`) {
      return { slug, type: 'career-guide', profession: career }
    }
  }

  // Check how-to-become pattern: how-to-become-[profession]
  for (const career of CAREERS_EXTENDED) {
    if (slug === `how-to-become-${career.slug}`) {
      return { slug, type: 'how-to-become', profession: career }
    }
  }

  // Check interview-questions pattern: [profession]-job-interview-questions
  for (const profSlug of INTERVIEW_PROFESSIONS) {
    if (slug === `${profSlug}-job-interview-questions`) {
      const profession = getCareerBySlug(profSlug)
      if (profession) return { slug, type: 'interview-questions', profession }
    }
  }

  // Check skills pattern: [profession]-skills
  for (const profSlug of INTERVIEW_PROFESSIONS) {
    if (slug === `${profSlug}-skills`) {
      const profession = getCareerBySlug(profSlug)
      if (profession) return { slug, type: 'skills', profession }
    }
  }

  // Check resume-tips pattern: [profession]-resume-tips
  for (const profSlug of INTERVIEW_PROFESSIONS) {
    if (slug === `${profSlug}-resume-tips`) {
      const profession = getCareerBySlug(profSlug)
      if (profession) return { slug, type: 'resume-tips', profession }
    }
  }

  // Check career comparison pattern: [professionA]-vs-[professionB]
  for (const [slugA, slugB] of COMPARISON_PAIRS) {
    if (slug === `${slugA}-vs-${slugB}`) {
      const professionA = getCareerBySlug(slugA)
      const professionB = getCareerBySlug(slugB)
      if (professionA && professionB) {
        return { slug, type: 'career-comparison', professionA, professionB }
      }
    }
  }

  // Check topic guide
  const topic = CAREER_TOPICS.find(t => t.slug === slug)
  if (topic) {
    return { slug, type: 'topic-guide', topic }
  }

  return null
}

// Generate all career page slugs
function generateAllSlugs(): string[] {
  const slugs: string[] = []

  // Career guides for all professions
  for (const career of CAREERS_EXTENDED) {
    slugs.push(`${career.slug}-career-guide`)
    slugs.push(`how-to-become-${career.slug}`)
  }

  // Interview questions, skills, resume tips for subset
  for (const profSlug of INTERVIEW_PROFESSIONS) {
    slugs.push(`${profSlug}-job-interview-questions`)
    slugs.push(`${profSlug}-skills`)
    slugs.push(`${profSlug}-resume-tips`)
  }

  // Comparison pages
  for (const [slugA, slugB] of COMPARISON_PAIRS) {
    slugs.push(`${slugA}-vs-${slugB}`)
  }

  // Topic guides
  for (const topic of CAREER_TOPICS) {
    slugs.push(topic.slug)
  }

  return slugs
}

export const CAREER_PAGE_SLUGS: string[] = generateAllSlugs()
