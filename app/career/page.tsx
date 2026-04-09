import type { Metadata } from 'next'
import Link from 'next/link'
import { CAREERS_EXTENDED } from '@/lib/career/professions-extended'
import { CAREER_TOPICS } from '@/lib/career/topics'
import AdSlot from '@/components/AdSlot'

export const metadata: Metadata = {
  title: 'Career Guides, Interview Tips & Salary Negotiation | USA-Calc',
  description:
    'Career guides for 20+ professions, interview question banks, salary negotiation scripts, resume tips, and personal finance guides for working professionals.',
  alternates: { canonical: '/career' },
}

const categoryIcons: Record<string, string> = {
  Technology: '💻',
  Healthcare: '🏥',
  Finance: '💰',
  Legal: '⚖️',
  Engineering: '⚙️',
  Business: '📊',
  Creative: '🎨',
}

function groupByCategory(careers: typeof CAREERS_EXTENDED) {
  const groups: Record<string, typeof CAREERS_EXTENDED> = {}
  for (const c of careers) {
    if (!groups[c.category]) groups[c.category] = []
    groups[c.category].push(c)
  }
  return groups
}

const topicCategories = [
  {
    title: 'Negotiation Guides',
    icon: '🤝',
    slugs: [
      'how-to-negotiate-salary',
      'how-to-ask-for-a-raise',
      'how-to-counter-an-offer',
      'how-to-negotiate-equity',
      'job-offer-evaluation-guide',
      'how-to-negotiate-remote-work',
    ],
  },
  {
    title: 'Job Search & Interviews',
    icon: '🔍',
    slugs: [
      'how-to-write-a-resume',
      'how-to-write-a-cover-letter',
      'how-to-prepare-for-a-job-interview',
      'behavioral-interview-questions',
      'star-method-interview',
      'how-to-follow-up-after-interview',
      'linkedin-profile-tips',
      'how-to-find-a-job-fast',
      'how-to-work-with-a-recruiter',
    ],
  },
  {
    title: 'Career Development',
    icon: '📈',
    slugs: [
      'how-to-get-promoted',
      'how-to-change-careers',
      'how-to-network-professionally',
      'how-to-resign-from-a-job',
      'work-life-balance-guide',
      'burnout-recovery-guide',
    ],
  },
  {
    title: 'Self-Employment & Freelancing',
    icon: '🚀',
    slugs: [
      'how-to-freelance-full-time',
      'side-hustle-ideas',
      'llc-vs-sole-proprietorship',
      'how-to-build-business-credit',
      'digital-nomad-guide',
    ],
  },
  {
    title: 'Taxes & Accounting',
    icon: '📋',
    slugs: [
      'how-to-file-taxes-self-employed',
      'quarterly-taxes-for-freelancers',
      'home-office-deduction-guide',
      'understanding-your-pay-stub',
      'understanding-w2-form',
      'understanding-1099-form',
      'remote-work-tax-implications',
    ],
  },
  {
    title: 'Personal Finance',
    icon: '💵',
    slugs: [
      'financial-planning-in-your-20s',
      'financial-planning-in-your-30s',
      'financial-planning-in-your-40s',
      'how-to-build-an-emergency-fund',
      'how-to-max-out-401k',
      'roth-vs-traditional-401k-guide',
      'hsa-vs-fsa-guide',
      'employee-stock-options-guide',
      'passive-income-guide',
      'retirement-planning-for-millennials',
    ],
  },
]

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--line)',
  borderRadius: 16,
  padding: '1.25rem',
  transition: 'border-color 0.15s, transform 0.15s',
  textDecoration: 'none',
  display: 'block',
}

export default function CareerPage() {
  const grouped = groupByCategory(CAREERS_EXTENDED)

  return (
    <>
      <style>{`
        .career-card:hover {
          border-color: rgba(59,130,246,0.4);
          transform: translateY(-2px);
        }
        .career-topic-card:hover {
          border-color: rgba(99,102,241,0.4);
          background: rgba(99,102,241,0.04);
        }
        .career-link:hover {
          color: var(--text) !important;
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: 'var(--bg)',
          padding: '72px 24px 56px',
          textAlign: 'center',
          borderBottom: '1px solid var(--line)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 14px',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.22)',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              color: '#818cf8',
              marginBottom: 20,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Career Resources
          </span>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: 16,
              color: 'var(--text)',
            }}
          >
            Career Guides, Interview Prep<br />& Salary Negotiation
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.65, maxWidth: 540, margin: '0 auto' }}>
            Profession-specific career guides, 400+ interview questions with hints, and practical negotiation scripts — built on real BLS data, not career advice clichés.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Ad slot */}
        <div style={{ padding: '32px 0 8px' }}>
          <AdSlot slot="career-top" format="leaderboard" />
        </div>

        {/* Career Professions by Category */}
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Career Guides by Profession
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: 15 }}>
            {CAREERS_EXTENDED.length} professions covered — salary benchmarks, career paths, and interview prep
          </p>

          {Object.entries(grouped).map(([category, careers]) => (
            <div key={category} style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <span style={{ fontSize: 22 }}>{categoryIcons[category] ?? '📁'}</span>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                  {category} Careers
                </h3>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: 12,
                }}
              >
                {careers.map((career) => (
                  <Link
                    key={career.slug}
                    href={`/career/${career.slug}-career-guide`}
                    className="career-card"
                    style={card}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>
                      {career.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                      {career.careerPath.length}-level path · {career.interviewQuestions.length} questions
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 500 }}>
                        Interview Qs →
                      </span>
                      <span style={{ color: 'var(--dim)', fontSize: 11 }}>·</span>
                      <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 500 }}>
                        Skills →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Ad slot mid */}
        <div style={{ padding: '16px 0 32px' }}>
          <AdSlot slot="career-mid" format="rectangle" />
        </div>

        {/* Topic guides */}
        <section style={{ marginTop: 16 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Career & Finance Guides
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: 15 }}>
            {CAREER_TOPICS.length} practical guides — negotiation, job search, taxes, and personal finance for professionals
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 24,
            }}
          >
            {topicCategories.map((tcat) => {
              const topics = tcat.slugs
                .map((s) => CAREER_TOPICS.find((t) => t.slug === s))
                .filter(Boolean) as typeof CAREER_TOPICS
              return (
                <div
                  key={tcat.title}
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--line)',
                    borderRadius: 20,
                    padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                    <span style={{ fontSize: 22 }}>{tcat.icon}</span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
                      {tcat.title}
                    </h3>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {topics.map((topic) => (
                      <li key={topic.slug}>
                        <Link
                          href={`/career/${topic.slug}`}
                          className="career-link"
                          style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none', transition: 'color 0.1s' }}
                        >
                          → {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        {/* Popular comparisons */}
        <section style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Career Comparisons
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15 }}>
            Side-by-side salary, skills, and career path comparisons
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {[
              ['software-engineer', 'data-scientist'],
              ['software-engineer', 'product-manager'],
              ['lawyer', 'paralegal'],
              ['registered-nurse', 'nurse-practitioner'],
              ['accountant', 'financial-advisor'],
              ['civil-engineer', 'mechanical-engineer'],
              ['devops-engineer', 'cloud-architect'],
              ['investment-banker', 'financial-analyst'],
            ].map(([a, b]) => {
              const profA = CAREERS_EXTENDED.find(c => c.slug === a)
              const profB = CAREERS_EXTENDED.find(c => c.slug === b)
              if (!profA || !profB) return null
              return (
                <Link
                  key={`${a}-vs-${b}`}
                  href={`/career/${a}-vs-${b}`}
                  className="career-card"
                  style={{ ...card, display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {profA.title}
                  </span>
                  <span style={{ color: 'var(--dim)', fontWeight: 700, flexShrink: 0 }}>vs</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                    {profB.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Popular searches */}
        <section
          style={{
            marginTop: 56,
            background: 'var(--bg2)',
            borderRadius: 20,
            border: '1px solid var(--line)',
            padding: '2rem',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Popular Searches</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { label: 'Software Engineer Salary', href: '/salary/career/software-engineer' },
              { label: 'How to Negotiate Salary', href: '/career/how-to-negotiate-salary' },
              { label: 'How to Write a Resume', href: '/career/how-to-write-a-resume' },
              { label: 'Behavioral Interview Questions', href: '/career/behavioral-interview-questions' },
              { label: 'Nurse Practitioner Career Guide', href: '/career/nurse-practitioner-career-guide' },
              { label: 'How to Get Promoted', href: '/career/how-to-get-promoted' },
              { label: 'Data Scientist Interview Questions', href: '/career/data-scientist-job-interview-questions' },
              { label: 'Roth vs Traditional 401k', href: '/career/roth-vs-traditional-401k-guide' },
              { label: 'How to Freelance Full Time', href: '/career/how-to-freelance-full-time' },
              { label: 'Lawyer Career Guide', href: '/career/lawyer-career-guide' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '6px 14px',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 20,
                  fontSize: 13,
                  color: 'var(--muted)',
                  textDecoration: 'none',
                  transition: 'border-color 0.15s, color 0.15s',
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
