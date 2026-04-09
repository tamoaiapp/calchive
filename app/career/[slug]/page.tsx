import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import RelatedLinks from '@/components/RelatedLinks'
import { CAREER_PAGE_SLUGS, parseCareerSlug, type CareerPageConfig } from '@/lib/career/pages-manifest'
import { type CareerExtended } from '@/lib/career/professions-extended'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return CAREER_PAGE_SLUGS.slice(0, 80).map(slug => ({ slug }))
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US')
}

function titleCase(s: string) {
  return s.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
}

const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 14 }
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', color: 'var(--muted)', fontWeight: 600,
  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--line)',
}
const tdStyle: React.CSSProperties = { padding: '11px 14px', color: 'var(--text)', borderBottom: '1px solid var(--line)' }
const tdNum: React.CSSProperties = { ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--green)' }
const card: React.CSSProperties = {
  background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16,
  padding: '1.5rem', marginBottom: '1.5rem', overflowX: 'auto',
}
const badge: React.CSSProperties = {
  display: 'inline-block', padding: '3px 10px', borderRadius: 16, fontSize: 12, fontWeight: 700,
  background: 'rgba(59,130,246,0.13)', color: '#60a5fa',
}
const chip: React.CSSProperties = {
  display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
  background: 'var(--bg2)', border: '1px solid var(--line)', color: 'var(--muted)',
}

// ─────────────────────────────────────────────
// Metadata
// ─────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = parseCareerSlug(slug)
  if (!config) return { title: 'Career Guide Not Found' }

  let title = ''
  let desc = ''
  const canonical = `/career/${slug}`

  // Rotate meta descriptions within each career page type.
  // Variant index is deterministic: based on profession slug's first char.
  if (config.type === 'career-guide' && config.profession) {
    const vi = config.profession.slug.charCodeAt(0) % 4
    title = [
      `${config.profession.title} Career Guide: Salary, Path & Interview Tips`,
      `${config.profession.title} Career: How to Break In, Advance & Earn More`,
      `${config.profession.title} Careers — Salary, Skills & Outlook (2025)`,
      `Becoming a ${config.profession.title}: Complete Career & Salary Guide`,
    ][vi]
    desc = [
      `Complete ${config.profession.title} career guide — career path from entry to executive, required skills, certifications, interview questions, and industry outlook.`,
      `Everything you need to know about a ${config.profession.title} career: entry paths, salary progression, must-have skills, certifications, and where the industry is heading.`,
      `${config.profession.title} career overview: median salary, levels from junior to senior, top skills employers want, and a realistic look at industry demand.`,
      `How ${config.profession.title}s advance their careers — salary by experience level, critical certifications, interview prep, and the tools hiring managers actually care about.`,
    ][vi]
  } else if (config.type === 'how-to-become' && config.profession) {
    const vi = config.profession.slug.charCodeAt(0) % 3
    title = [
      `How to Become a ${config.profession.title}: Roadmap & Timeline`,
      `${config.profession.title} Career Path: Step-by-Step Guide to Getting Started`,
      `Breaking Into ${config.profession.title} Roles — Requirements & Timeline`,
    ][vi]
    desc = [
      `Step-by-step guide to becoming a ${config.profession.title} — education requirements, skills to build, where to find jobs, and a realistic timeline.`,
      `What it takes to become a ${config.profession.title}: required education, key skills, entry-level job search strategy, and how long it realistically takes.`,
      `The practical roadmap to landing your first ${config.profession.title} job — what to study, which skills matter most, and how to stand out to recruiters.`,
    ][vi]
  } else if (config.type === 'interview-questions' && config.profession) {
    const vi = config.profession.slug.charCodeAt(0) % 3
    title = [
      `${config.profession.title} Interview Questions (With Hints)`,
      `${config.profession.title} Job Interview: Questions & How to Answer Them`,
      `Ace Your ${config.profession.title} Interview — Top Questions & Guidance`,
    ][vi]
    desc = [
      `${config.profession.interviewQuestions.length} ${config.profession.title} interview questions with what interviewers are looking for in each answer — behavioral, technical, and situational.`,
      `The most common ${config.profession.title} interview questions with guidance on what strong answers look like — behavioral, technical, and situational formats.`,
      `Prepare for your ${config.profession.title} interview: ${config.profession.interviewQuestions.length} real questions, what hiring managers expect, and how to structure each response.`,
    ][vi]
  } else if (config.type === 'skills' && config.profession) {
    const vi = config.profession.slug.charCodeAt(0) % 3
    title = [
      `${config.profession.title} Skills: What You Need to Get Hired`,
      `Top Skills for ${config.profession.title}s — Technical & Soft Skills Ranked`,
      `${config.profession.title} Skill Requirements: What Employers Actually Want`,
    ][vi]
    desc = [
      `The top skills employers want from ${config.profession.title}s — technical skills, certifications that matter, and how to develop them.`,
      `Which ${config.profession.title} skills matter most in hiring? Ranked list of technical competencies, tools, and certifications backed by job posting data.`,
      `${config.profession.title} skill breakdown: core technical requirements, valued certifications, and soft skills that separate candidates who get offers from those who don't.`,
    ][vi]
  } else if (config.type === 'resume-tips' && config.profession) {
    const vi = config.profession.slug.charCodeAt(0) % 3
    title = [
      `${config.profession.title} Resume Tips: What Hiring Managers Look For`,
      `How to Write a ${config.profession.title} Resume That Gets Interviews`,
      `${config.profession.title} Resume Guide: Keywords, Format & What to Quantify`,
    ][vi]
    desc = [
      `Resume writing advice specific to ${config.profession.title} roles — what to quantify, which keywords matter, and how to stand out in applicant tracking systems.`,
      `Write a ${config.profession.title} resume that passes ATS and impresses hiring managers — what to emphasize, what to cut, and how to frame your experience.`,
      `${config.profession.title} resume tips from the recruiter's perspective: which accomplishments to highlight, ATS keywords that open doors, and format mistakes to avoid.`,
    ][vi]
  } else if (config.type === 'career-comparison' && config.professionA && config.professionB) {
    title = `${config.professionA.title} vs ${config.professionB.title}: Salary, Skills & Career Path`
    desc = `${config.professionA.title} vs ${config.professionB.title} compared — salary, education, skills, job growth, and which career path is right for you.`
  } else if (config.type === 'topic-guide' && config.topic) {
    title = config.topic.content.metaTitle
    desc = config.topic.content.metaDesc
  }

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: { title, description: desc, type: 'article' },
  }
}

// ─────────────────────────────────────────────
// Page Layouts
// ─────────────────────────────────────────────

function CareerGuidePage({ profession }: { profession: CareerExtended }) {
  const salaryLinks = [
    { title: `${profession.title} Salary`, href: `/salary/career/${profession.slug}`, icon: '💵' },
    { title: 'Salary Calculator', href: '/salary/salary-calculator', icon: '🧮' },
    { title: 'Job Offer Comparison', href: '/career/job-offer-evaluation-guide', icon: '📋' },
    { title: 'Raise Calculator', href: '/calculator/raise-calculator', icon: '📈' },
    { title: `How to Become a ${profession.title}`, href: `/career/how-to-become-${profession.slug}`, icon: '🎯' },
    { title: `${profession.title} Interview Questions`, href: `/career/${profession.slug}-job-interview-questions`, icon: '💬' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{profession.title}</span>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={badge}>{profession.category}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {profession.title} Career Guide: How to Get In, Move Up & Earn More
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        {profession.dayInLife}
      </p>

      <AdSlot slot="career-guide-top" format="leaderboard" />

      {/* Career Path Table */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: '1rem', margin: '0 0 1rem' }}>Career Path & Salary Progression</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Level</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Years Exp</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Salary</th>
            </tr>
          </thead>
          <tbody>
            {profession.careerPath.map((step) => (
              <tr key={step.level}>
                <td style={tdStyle}><span style={{ ...badge, background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>{step.level}</span></td>
                <td style={tdStyle}>{step.title}</td>
                <td style={tdStyle}>{step.yearsExp} yrs</td>
                <td style={tdNum}>{fmt(step.salary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
          Median base salary estimates. Total compensation at tech companies may include equity and bonuses worth 20–80% above base.
          <Link href={`/salary/career/${profession.slug}`} style={{ color: '#60a5fa', marginLeft: 4 }}>Full salary breakdown →</Link>
        </p>
      </div>

      {/* Top Skills */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Top Skills for {profession.title}s</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profession.topSkills.map((skill) => (
            <span key={skill} style={chip}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Entry Requirements */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>How to Get Started</h2>
        <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.8 }}>
          {profession.entryRequirements.map((req, i) => (
            <li key={i} style={{ color: 'var(--muted)', marginBottom: 4 }}>{req}</li>
          ))}
        </ul>
      </div>

      {/* Certifications */}
      {profession.certifications.length > 0 && (
        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Certifications Worth Getting</h2>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.8 }}>
            {profession.certifications.map((cert, i) => (
              <li key={i} style={{ color: 'var(--muted)', marginBottom: 4 }}>{cert}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Industry Outlook */}
      <div style={{ ...card, background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--green)' }}>Industry Outlook</h2>
        <p style={{ color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>{profession.industryOutlook}</p>
      </div>

      {/* Where to Find Jobs */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Where {profession.title}s Find Jobs</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profession.jobBoards.map((board) => (
            <span key={board} style={chip}>{board}</span>
          ))}
        </div>
      </div>

      <AdSlot slot="career-guide-mid" format="rectangle" />

      <RelatedLinks links={salaryLinks} title="Related Salary & Career Tools" />
    </div>
  )
}

function HowToBecomePage({ profession }: { profession: CareerExtended }) {
  const links = [
    { title: `${profession.title} Career Guide`, href: `/career/${profession.slug}-career-guide`, icon: '📖' },
    { title: `${profession.title} Interview Questions`, href: `/career/${profession.slug}-job-interview-questions`, icon: '💬' },
    { title: `${profession.title} Salary`, href: `/salary/career/${profession.slug}`, icon: '💵' },
    { title: 'How to Write a Resume', href: '/career/how-to-write-a-resume', icon: '📝' },
    { title: 'How to Find a Job Fast', href: '/career/how-to-find-a-job-fast', icon: '🔍' },
    { title: 'Salary Negotiation Guide', href: '/career/how-to-negotiate-salary', icon: '🤝' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>How to Become a {profession.title}</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        How to Become a {profession.title} in 2025: Roadmap & Timeline
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        {profession.dayInLife}
      </p>

      <AdSlot slot="how-to-become-top" format="leaderboard" />

      {/* Entry Requirements Steps */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Step-by-Step Requirements</h2>
        <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
          {profession.entryRequirements.map((req, i) => (
            <li key={i} style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 10 }}>
              <strong style={{ color: 'var(--text)' }}>Step {i + 1}:</strong> {req}
            </li>
          ))}
        </ol>
      </div>

      {/* Career Path Timeline */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Career Path Timeline</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profession.careerPath.map((step, i) => (
            <div
              key={step.level}
              style={{
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                paddingBottom: i < profession.careerPath.length - 1 ? 12 : 0,
                borderBottom: i < profession.careerPath.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 13, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14 }}>{step.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                  {step.yearsExp} years experience · {fmt(step.salary)}/year
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14, flexShrink: 0 }}>
                {fmt(step.salary)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills to Build */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Skills to Build First</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profession.topSkills.map((skill) => (
            <span key={skill} style={chip}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Where to Find Jobs */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Where to Find {profession.title} Jobs</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profession.jobBoards.map((board) => (
            <span key={board} style={chip}>{board}</span>
          ))}
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>{profession.industryOutlook}</p>
      </div>

      <AdSlot slot="how-to-become-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Career Resources" />
    </div>
  )
}

function InterviewQuestionsPage({ profession }: { profession: CareerExtended }) {
  const behavioral = profession.interviewQuestions.filter(q => q.type === 'behavioral')
  const technical = profession.interviewQuestions.filter(q => q.type === 'technical')
  const situational = profession.interviewQuestions.filter(q => q.type === 'situational')

  const links = [
    { title: 'STAR Method Interview Guide', href: '/career/star-method-interview', icon: '⭐' },
    { title: 'Behavioral Interview Questions', href: '/career/behavioral-interview-questions', icon: '💬' },
    { title: `${profession.title} Career Guide`, href: `/career/${profession.slug}-career-guide`, icon: '📖' },
    { title: `${profession.title} Salary`, href: `/salary/career/${profession.slug}`, icon: '💵' },
    { title: 'How to Prepare for an Interview', href: '/career/how-to-prepare-for-a-job-interview', icon: '📝' },
    { title: 'How to Follow Up After Interview', href: '/career/how-to-follow-up-after-interview', icon: '✉️' },
  ]

  const QuestionGroup = ({ title, questions, color }: { title: string; questions: typeof profession.interviewQuestions; color: string }) => {
    if (questions.length === 0) return null
    return (
      <div style={{ ...card }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1.25rem', color }}>{title}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {questions.map((q, i) => (
            <div key={i} style={{ paddingBottom: i < questions.length - 1 ? 16 : 0, borderBottom: i < questions.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <p style={{ fontWeight: 600, color: 'var(--text)', margin: '0 0 8px', lineHeight: 1.55 }}>
                Q: {q.question}
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, lineHeight: 1.65 }}>
                <strong style={{ color: 'var(--dim)' }}>What they're looking for:</strong> {q.hint}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{profession.title} Interview Questions</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {profession.title} Interview Questions (With Hints)
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        {profession.interviewQuestions.length} questions covering behavioral, technical, and situational scenarios. Each answer hint reflects what interviewers at top companies are actually evaluating.
      </p>

      <AdSlot slot="interview-q-top" format="leaderboard" />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Questions', value: profession.interviewQuestions.length, color: '#60a5fa' },
          { label: 'Behavioral', value: behavioral.length, color: '#a78bfa' },
          { label: 'Technical', value: technical.length, color: '#34d399' },
          { label: 'Situational', value: situational.length, color: '#fbbf24' },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 12, padding: '12px 20px', flexGrow: 1 }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <QuestionGroup title="Behavioral Questions" questions={behavioral} color="#a78bfa" />
      <QuestionGroup title="Technical Questions" questions={technical} color="#34d399" />
      <QuestionGroup title="Situational Questions" questions={situational} color="#fbbf24" />

      {/* Prep tip */}
      <div style={{ ...card, background: 'rgba(59,130,246,0.06)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 0.75rem' }}>How to Prepare</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
          For behavioral questions, prepare 6–8 specific stories from your experience using the STAR format (Situation, Task, Action, Result).
          Practice answers out loud — not in your head — at least three times per question. Technical questions for {profession.title} roles require
          domain-specific preparation; review the skills list and be prepared to demonstrate hands-on knowledge, not just conceptual understanding.
        </p>
      </div>

      <AdSlot slot="interview-q-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Interview Resources" />
    </div>
  )
}

function SkillsPage({ profession }: { profession: CareerExtended }) {
  const links = [
    { title: `${profession.title} Career Guide`, href: `/career/${profession.slug}-career-guide`, icon: '📖' },
    { title: `${profession.title} Interview Questions`, href: `/career/${profession.slug}-job-interview-questions`, icon: '💬' },
    { title: `${profession.title} Resume Tips`, href: `/career/${profession.slug}-resume-tips`, icon: '📝' },
    { title: `${profession.title} Salary`, href: `/salary/career/${profession.slug}`, icon: '💵' },
    { title: 'Salary Negotiation', href: '/career/how-to-negotiate-salary', icon: '🤝' },
    { title: 'LinkedIn Profile Tips', href: '/career/linkedin-profile-tips', icon: '💼' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{profession.title} Skills</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {profession.title} Skills: What Employers Actually Look For
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        {profession.industryOutlook}
      </p>

      <AdSlot slot="skills-top" format="leaderboard" />

      {/* Top Skills */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Top {profession.title} Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {profession.topSkills.map((skill, i) => (
            <span
              key={skill}
              style={{
                ...chip,
                background: i < 5 ? 'rgba(59,130,246,0.1)' : 'var(--bg2)',
                borderColor: i < 5 ? 'rgba(59,130,246,0.25)' : 'var(--line)',
                color: i < 5 ? '#60a5fa' : 'var(--muted)',
              }}
            >
              {i < 5 && <span style={{ marginRight: 4 }}>★</span>}
              {skill}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--dim)', margin: 0 }}>
          ★ marks the most in-demand skills according to job posting frequency analysis
        </p>
      </div>

      {/* Certifications */}
      {profession.certifications.length > 0 && (
        <div style={card}>
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Certifications That Accelerate Hiring</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profession.certifications.map((cert, i) => (
              <div
                key={cert}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  background: 'var(--bg2)',
                  borderRadius: 10,
                  border: '1px solid var(--line)',
                }}
              >
                <span style={{ fontSize: 16 }}>🏆</span>
                <span style={{ color: 'var(--text)', fontSize: 14 }}>{cert}</span>
                {i === 0 && (
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#34d399', fontWeight: 600 }}>Most Recognized</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entry Requirements */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Education & Experience Requirements</h2>
        <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.8 }}>
          {profession.entryRequirements.map((req, i) => (
            <li key={i} style={{ color: 'var(--muted)', marginBottom: 8 }}>{req}</li>
          ))}
        </ul>
      </div>

      <AdSlot slot="skills-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Career Resources" />
    </div>
  )
}

function ResumeTipsPage({ profession }: { profession: CareerExtended }) {
  const links = [
    { title: 'How to Write a Resume', href: '/career/how-to-write-a-resume', icon: '📝' },
    { title: `${profession.title} Interview Questions`, href: `/career/${profession.slug}-job-interview-questions`, icon: '💬' },
    { title: `${profession.title} Skills`, href: `/career/${profession.slug}-skills`, icon: '⚡' },
    { title: 'LinkedIn Profile Tips', href: '/career/linkedin-profile-tips', icon: '💼' },
    { title: `${profession.title} Salary`, href: `/salary/career/${profession.slug}`, icon: '💵' },
    { title: 'Salary Negotiation Guide', href: '/career/how-to-negotiate-salary', icon: '🤝' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{profession.title} Resume Tips</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {profession.title} Resume Tips: What Hiring Managers Look For
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        Resume advice specific to {profession.title} roles — which metrics to include, which keywords pass ATS screening, and how to stand out in a competitive applicant pool.
      </p>

      <AdSlot slot="resume-tips-top" format="leaderboard" />

      {/* Resume Tips */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>
          {profession.resumeTips.length} Resume Tips for {profession.title}s
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {profession.resumeTips.map((tip, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                paddingBottom: i < profession.resumeTips.length - 1 ? 14 : 0,
                borderBottom: i < profession.resumeTips.length - 1 ? '1px solid var(--line)' : 'none',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 12, flexShrink: 0, marginTop: 1,
              }}>
                {i + 1}
              </div>
              <p style={{ color: 'var(--muted)', margin: 0, lineHeight: 1.65 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Keywords */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>ATS Keywords to Include</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12, lineHeight: 1.6 }}>
          Use these exact terms from your skills and experience — ATS systems scan for specific keyword matches, not paraphrases.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {profession.topSkills.map((skill) => (
            <span key={skill} style={chip}>{skill}</span>
          ))}
        </div>
      </div>

      {/* Universal tips */}
      <div style={{ ...card, background: 'rgba(99,102,241,0.04)', borderColor: 'rgba(99,102,241,0.18)' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 0.75rem' }}>Universal Resume Rules</h2>
        <ul style={{ paddingLeft: '1.25rem', margin: 0, lineHeight: 1.8, color: 'var(--muted)' }}>
          <li>One page for under 5 years of experience; two pages for senior roles</li>
          <li>PDF format unless the posting specifically requests Word (.docx)</li>
          <li>Quantify every achievement possible — numbers create credibility</li>
          <li>Standard section headers (Experience, Education, Skills) for ATS compatibility</li>
          <li>Tailor keywords from each specific job description before applying</li>
        </ul>
      </div>

      <AdSlot slot="resume-tips-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Career Resources" />
    </div>
  )
}

function ComparisonPage({ professionA, professionB }: { professionA: CareerExtended; professionB: CareerExtended }) {
  const links = [
    { title: `${professionA.title} Career Guide`, href: `/career/${professionA.slug}-career-guide`, icon: '📖' },
    { title: `${professionB.title} Career Guide`, href: `/career/${professionB.slug}-career-guide`, icon: '📖' },
    { title: `${professionA.title} Salary`, href: `/salary/career/${professionA.slug}`, icon: '💵' },
    { title: `${professionB.title} Salary`, href: `/salary/career/${professionB.slug}`, icon: '💵' },
    { title: 'Job Offer Comparison', href: '/career/job-offer-evaluation-guide', icon: '📋' },
    { title: 'Salary Negotiation', href: '/career/how-to-negotiate-salary', icon: '🤝' },
  ]

  const entrySalaryA = professionA.careerPath[0]?.salary ?? 0
  const entrySalaryB = professionB.careerPath[0]?.salary ?? 0
  const seniorSalaryA = professionA.careerPath[professionA.careerPath.length - 1]?.salary ?? 0
  const seniorSalaryB = professionB.careerPath[professionB.careerPath.length - 1]?.salary ?? 0

  const compRows = [
    { label: 'Entry Salary', a: fmt(entrySalaryA), b: fmt(entrySalaryB) },
    { label: 'Senior Salary', a: fmt(seniorSalaryA), b: fmt(seniorSalaryB) },
    { label: 'Category', a: professionA.category, b: professionB.category },
    { label: 'Key Skills', a: professionA.topSkills.slice(0, 3).join(', '), b: professionB.topSkills.slice(0, 3).join(', ') },
    { label: 'Education', a: professionA.entryRequirements[0] ?? '—', b: professionB.entryRequirements[0] ?? '—' },
    { label: 'Top Certification', a: professionA.certifications[0] ?? 'None required', b: professionB.certifications[0] ?? 'None required' },
  ]

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{professionA.title} vs {professionB.title}</span>
      </nav>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {professionA.title} vs {professionB.title}: Salary, Skills & Career Path Compared
      </h1>

      <AdSlot slot="comparison-top" format="leaderboard" />

      {/* Comparison table */}
      <div style={card}>
        <h2 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 1rem' }}>Side-by-Side Comparison</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Factor</th>
              <th style={{ ...thStyle, color: '#60a5fa' }}>{professionA.title}</th>
              <th style={{ ...thStyle, color: '#a78bfa' }}>{professionB.title}</th>
            </tr>
          </thead>
          <tbody>
            {compRows.map((row) => (
              <tr key={row.label}>
                <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--muted)' }}>{row.label}</td>
                <td style={tdStyle}>{row.a}</td>
                <td style={tdStyle}>{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Career paths */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>
        {[professionA, professionB].map((prof, idx) => (
          <div key={prof.slug} style={{ ...card, marginBottom: 0 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 1rem', color: idx === 0 ? '#60a5fa' : '#a78bfa' }}>
              {prof.title} Path
            </h3>
            {prof.careerPath.map((step) => (
              <div key={step.level} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>{step.title}</span>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 13 }}>{fmt(step.salary)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Day in life comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>
        {[professionA, professionB].map((prof, idx) => (
          <div key={prof.slug} style={{ ...card, marginBottom: 0, background: idx === 0 ? 'rgba(59,130,246,0.04)' : 'rgba(99,102,241,0.04)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 0.75rem', color: idx === 0 ? '#60a5fa' : '#a78bfa' }}>
              Day in the Life: {prof.title}
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{prof.dayInLife}</p>
          </div>
        ))}
      </div>

      {/* Outlook */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: '1.5rem' }}>
        {[professionA, professionB].map((prof, idx) => (
          <div key={prof.slug} style={{ ...card, marginBottom: 0 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 0.75rem', color: 'var(--green)' }}>
              {prof.title} Outlook
            </h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }}>{prof.industryOutlook}</p>
          </div>
        ))}
      </div>

      <AdSlot slot="comparison-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Career Resources" />
    </div>
  )
}

function TopicGuidePage({ config }: { config: CareerPageConfig }) {
  const topic = config.topic!
  const { content } = topic

  const links = content.relatedLinks.map((href) => {
    const parts = href.split('/')
    const rawSlug = parts[parts.length - 1]
    const label = rawSlug
      .split('-')
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ')
      .replace('Calculator', 'Calculator')
    return { title: label, href, icon: '🔗' }
  })

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      <nav aria-label="Breadcrumb" style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <Link href="/career" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Careers</Link>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <span style={{ color: 'var(--text)' }}>{topic.title}</span>
      </nav>

      <div style={{ marginBottom: 10 }}>
        <span style={{ ...badge, background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>{topic.category}</span>
      </div>

      <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, margin: '0 0 0.75rem', lineHeight: 1.15 }}>
        {content.h1}
      </h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
        {content.intro}
      </p>

      <AdSlot slot="topic-guide-top" format="leaderboard" />

      {/* Key stats */}
      {content.keyStats.length > 0 && (
        <div style={{ ...card, background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.18)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 1rem', color: 'var(--green)' }}>Key Statistics</h2>
          <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
            {content.keyStats.map((stat, i) => (
              <li key={i} style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 4, fontSize: 14 }}>
                {stat}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sections */}
      {content.sections.map((section, i) => (
        <div key={i} style={card}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 0.75rem' }}>{section.h2}</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: section.bullets ? '0 0 1rem' : '0' }}>
            {section.body}
          </p>
          {section.bullets && (
            <ul style={{ paddingLeft: '1.25rem', margin: 0 }}>
              {section.bullets.map((b, j) => (
                <li key={j} style={{ color: 'var(--muted)', lineHeight: 1.75, marginBottom: 4, fontSize: 14 }}>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <AdSlot slot="topic-guide-mid" format="rectangle" />

      <RelatedLinks links={links} title="Related Calculators & Guides" />
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export default async function CareerSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = parseCareerSlug(slug)
  if (!config) notFound()

  const professionName = config.profession?.title ?? config.topic?.title ?? 'Career Guide'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How do I become a ${professionName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Becoming a ${professionName} typically requires relevant education, building practical skills, and gaining experience through entry-level roles or internships. See our full guide for step-by-step details.`,
        },
      },
      {
        '@type': 'Question',
        name: `What does a ${professionName} earn?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: config.profession
            ? `The median salary for a ${professionName} varies by experience, location, and employer. Entry-level roles typically start around $50,000–$70,000/year. See our salary breakdown for detailed figures.`
            : `Salaries vary widely by experience, location, and employer. See our salary breakdown for detailed figures.`,
        },
      },
    ],
  }

  const jsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )

  switch (config.type) {
    case 'career-guide':
      if (!config.profession) notFound()
      return <>{jsonLd}<CareerGuidePage profession={config.profession} /></>

    case 'how-to-become':
      if (!config.profession) notFound()
      return <>{jsonLd}<HowToBecomePage profession={config.profession} /></>

    case 'interview-questions':
      if (!config.profession) notFound()
      return <>{jsonLd}<InterviewQuestionsPage profession={config.profession} /></>

    case 'skills':
      if (!config.profession) notFound()
      return <>{jsonLd}<SkillsPage profession={config.profession} /></>

    case 'resume-tips':
      if (!config.profession) notFound()
      return <>{jsonLd}<ResumeTipsPage profession={config.profession} /></>

    case 'career-comparison':
      if (!config.professionA || !config.professionB) notFound()
      return <>{jsonLd}<ComparisonPage professionA={config.professionA} professionB={config.professionB} /></>

    case 'topic-guide':
      if (!config.topic) notFound()
      return <>{jsonLd}<TopicGuidePage config={config} /></>

    default:
      notFound()
  }
}
