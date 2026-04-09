import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { GUIDE_SLUGS, getGuideContent } from '@/lib/guides/manifest'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return GUIDE_SLUGS.slice(0, 80).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideContent(slug)
  if (!guide) return { title: 'Page Not Found' }

  return {
    title: `${guide.title} | USA-Calc`,
    description: guide.description,
    alternates: { canonical: `/guide/${slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
    },
  }
}

export default async function GuideSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const guide = getGuideContent(slug)
  if (!guide) notFound()

  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem 5rem' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}>
        <Link href="/guide" style={{ color: 'var(--muted)', textDecoration: 'none' }}>
          ← Guides
        </Link>
        <span style={{ color: 'var(--dim)' }}>·</span>
        <span style={{ color: 'var(--dim)' }}>{guide.category}</span>
      </div>

      {/* Key Fact */}
      <div style={{
        background: 'rgba(59,130,246,0.07)',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 12,
        padding: '12px 16px',
        fontSize: 14,
        color: 'var(--muted)',
        marginBottom: '1.5rem',
        lineHeight: 1.5,
      }}>
        <strong style={{ color: 'var(--accent)' }}>Key fact: </strong>
        {guide.keyFact}
      </div>

      <h1 style={{
        fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
        fontWeight: 900,
        margin: '0 0 1.5rem',
        lineHeight: 1.2,
        color: 'var(--text)',
      }}>
        {guide.title}
      </h1>

      <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
        {guide.description}
      </p>

      <AdSlot slot="7788990011" format="leaderboard" />

      {/* Sections */}
      {guide.sections.map((section) => (
        <section key={section.heading} style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            margin: '0 0 0.75rem',
            color: 'var(--text)',
          }}>
            {section.heading}
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.75, margin: 0 }}>
            {section.body}
          </p>
        </section>
      ))}

      <RelatedLinks
        title="Related Calculators & Tools"
        links={guide.relatedLinks}
      />

      {/* See more guides in category */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--muted)' }}>
          More {guide.category} Guides
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <Link href="/guide" style={{
            padding: '8px 16px',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            color: 'var(--muted)',
            fontSize: 13,
            textDecoration: 'none',
          }}>
            All Guides →
          </Link>
          <Link href="/calculator" style={{
            padding: '8px 16px',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 20,
            color: 'var(--muted)',
            fontSize: 13,
            textDecoration: 'none',
          }}>
            Calculators →
          </Link>
        </div>
      </section>

      <AdSlot slot="8899001122" format="rectangle" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            url: `https://usa-calc.com/guide/${slug}`,
            publisher: { '@type': 'Organization', name: 'USA-Calc', url: 'https://usa-calc.com' },
            isPartOf: { '@type': 'WebSite', name: 'USA-Calc', url: 'https://usa-calc.com' },
          }),
        }}
      />
    </div>
  )
}
