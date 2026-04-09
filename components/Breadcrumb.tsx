interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const allItems = [{ label: 'Home', href: '/' }, ...items]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: allItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `https://calchive.com${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}
      >
        {allItems.map((item, index) => (
          <span key={item.label}>
            {index > 0 && <span style={{ margin: '0 0.4rem' }}>›</span>}
            {item.href && index < allItems.length - 1 ? (
              <a href={item.href} style={{ color: 'var(--muted)', textDecoration: 'none' }}>
                {item.label}
              </a>
            ) : (
              <span style={{ color: index === allItems.length - 1 ? 'var(--text)' : 'var(--muted)' }}>
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  )
}
