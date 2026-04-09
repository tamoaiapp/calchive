'use client'

import Link from 'next/link'

interface RelatedLink {
  title: string
  href: string
  icon?: string
}

interface RelatedLinksProps {
  links: RelatedLink[]
  title?: string
}

export default function RelatedLinks({
  links,
  title = 'Related Calculators & Tools',
}: RelatedLinksProps) {
  if (!links || links.length === 0) return null

  return (
    <section
      aria-label={title}
      style={{
        marginTop: 48,
      }}
    >
      <h2
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: 'var(--text)',
          marginBottom: 16,
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 12,
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: 'var(--card)',
              border: '1px solid var(--line)',
              borderRadius: 'var(--radius-card)',
              color: 'var(--muted)',
              fontSize: 14,
              fontWeight: 500,
              transition: 'border-color 0.15s, color 0.15s, background 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'
              e.currentTarget.style.color = 'var(--text)'
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.06)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)'
              e.currentTarget.style.color = 'var(--muted)'
              e.currentTarget.style.background = 'var(--card)'
            }}
          >
            {link.icon && (
              <span style={{ fontSize: 18, flexShrink: 0 }}>{link.icon}</span>
            )}
            <span>{link.title}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
