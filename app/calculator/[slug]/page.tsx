import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CalcEngineWrapper from '@/components/CalcEngineWrapper'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { ALL_CALCULATORS, getCalcBySlug } from '@/lib/calculators'
import Breadcrumb from '@/components/Breadcrumb'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return ALL_CALCULATORS.slice(0, 80).map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const calc = getCalcBySlug(slug)
  if (!calc) return { title: 'Calculator Not Found' }

  return {
    title: calc.title,
    description: calc.desc,
    openGraph: {
      title: `${calc.title} | Calchive`,
      description: calc.desc,
      type: 'website',
    },
    alternates: {
      canonical: `/calculator/${slug}`,
    },
  }
}

export default async function CalcPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const calc = getCalcBySlug(slug)

  if (!calc) notFound()

  // Build related links from related slugs (only serializable data)
  const relatedLinks = (calc.related ?? [])
    .map((relSlug) => {
      const rel = getCalcBySlug(relSlug)
      if (!rel) return null
      return { title: rel.title, href: `/calculator/${rel.slug}`, icon: rel.icon }
    })
    .filter((x): x is { title: string; href: string; icon: string } => x !== null)

  // Get other calcs in same category for extra related
  const sameCat = ALL_CALCULATORS.filter(
    (c) => c.cat === calc.cat && c.slug !== calc.slug,
  ).slice(0, 4)

  const extraLinks = sameCat
    .filter((c) => !relatedLinks.some((r) => r.href === `/calculator/${c.slug}`))
    .map((c) => ({ title: c.title, href: `/calculator/${c.slug}`, icon: c.icon }))

  const allRelated = [...relatedLinks, ...extraLinks].slice(0, 6)

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Calculators', href: '/calculator' }, { label: calc.title }]} />

      {/* Header */}
      <header style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '2rem' }}>{calc.icon}</span>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800 }}>
            {calc.title}
          </h1>
        </div>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.6 }}>
          {calc.desc}
        </p>
      </header>

      {/* Top ad */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AdSlot slot="2345678901" format="leaderboard" />
      </div>

      {/* Calculator engine — uses slug to avoid passing fn to client */}
      <CalcEngineWrapper slug={slug} />

      {/* About section */}
      {calc.about && (
        <section
          aria-label="About this calculator"
          style={{
            marginTop: '2rem',
            padding: '1.25rem 1.5rem',
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
          }}
        >
          <h2 style={{ margin: '0 0 0.6rem', fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            About This Calculator
          </h2>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            {calc.about}
          </p>
        </section>
      )}

      {/* Mid ad */}
      <div style={{ margin: '2rem 0' }}>
        <AdSlot slot="3456789012" format="rectangle" />
      </div>

      {/* Related calculators */}
      {allRelated.length > 0 && (
        <RelatedLinks links={allRelated} title="Related Calculators" />
      )}

      {/* Bottom ad */}
      <div style={{ marginTop: '2.5rem' }}>
        <AdSlot slot="4567890123" format="leaderboard" />
      </div>

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: calc.title,
            description: calc.desc,
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'Web',
            url: `https://calchive.com/calculator/${calc.slug}`,
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
