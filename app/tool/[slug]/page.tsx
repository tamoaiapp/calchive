import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ToolEngineWrapper from '@/components/ToolEngineWrapper'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { ALL_TOOLS, getToolBySlug, TOOL_CATEGORIES } from '@/lib/tools'
import Breadcrumb from '@/components/Breadcrumb'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return ALL_TOOLS.slice(0, 80).map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: 'Tool Not Found' }

  return {
    title: `${tool.title} — Free Online Tool`,
    description: tool.desc,
    openGraph: {
      title: `${tool.title} | Calchive`,
      description: tool.desc,
      type: 'website',
    },
    alternates: {
      canonical: `/tool/${slug}`,
    },
  }
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) notFound()

  const catMeta = TOOL_CATEGORIES.find((c) => c.slug === tool.cat)

  // Build related links from related slugs
  const relatedLinks = (tool.related ?? [])
    .map((relSlug) => {
      const rel = getToolBySlug(relSlug)
      if (!rel) return null
      return { title: rel.title, href: `/tool/${rel.slug}`, icon: rel.icon }
    })
    .filter((x): x is { title: string; href: string; icon: string } => x !== null)

  // Fill with same-category tools
  const sameCat = ALL_TOOLS.filter(
    (t) => t.cat === tool.cat && t.slug !== tool.slug,
  ).slice(0, 4)

  const extraLinks = sameCat
    .filter((t) => !relatedLinks.some((r) => r.href === `/tool/${t.slug}`))
    .map((t) => ({ title: t.title, href: `/tool/${t.slug}`, icon: t.icon }))

  const allRelated = [...relatedLinks, ...extraLinks].slice(0, 6)

  const toolTypeLabel: Record<string, string> = {
    converter: 'Converter',
    checker: 'Checker',
    generator: 'Generator',
    table: 'Reference Table',
    estimator: 'Estimator',
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Tools', href: '/tool' },
          ...(catMeta ? [{ label: catMeta.name, href: `/tool#${catMeta.slug}` }] : []),
          { label: tool.title },
        ]}
      />

      {/* Header */}
      <header style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>{tool.icon}</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800 }}>
              {tool.title}
            </h1>
            <span
              style={{
                display: 'inline-block',
                marginTop: 4,
                padding: '2px 10px',
                borderRadius: 99,
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.25)',
                color: 'var(--accent)',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              {toolTypeLabel[tool.toolType] ?? tool.toolType}
            </span>
          </div>
        </div>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          {tool.desc}
        </p>
      </header>

      {/* Top ad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot slot="5678901234" format="leaderboard" />
      </div>

      {/* Tool engine */}
      <ToolEngineWrapper slug={slug} />

      {/* About section */}
      {tool.about && (
        <section
          aria-label="About this tool"
          style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
          }}
        >
          <h2 style={{ margin: '0 0 0.6rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            About This Tool
          </h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            {tool.about}
          </p>
        </section>
      )}

      {/* Mid ad */}
      <div style={{ margin: '2rem 0' }}>
        <AdSlot slot="6789012345" format="rectangle" />
      </div>

      {/* Related tools */}
      {allRelated.length > 0 && (
        <RelatedLinks links={allRelated} title="Related Tools" />
      )}

      {/* Bottom ad */}
      <div style={{ marginTop: '2.5rem' }}>
        <AdSlot slot="7890123456" format="leaderboard" />
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.title,
            description: tool.desc,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            url: `https://calchive.com/tool/${tool.slug}`,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
          }),
        }}
      />
    </div>
  )
}
