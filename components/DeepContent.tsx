import type { DeepContent as DC } from '@/lib/calculators/deep-content'
import type { Author } from '@/lib/authors'

interface Props {
  content: DC
  author: Author
}

const fmtDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function DeepContent({ content, author }: Props) {
  return (
    <article>
      {/* Author byline + dates — E-E-A-T signals Google looks for */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem 1.25rem',
          alignItems: 'center',
          padding: '0.85rem 1.1rem',
          marginTop: '1.5rem',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 12,
          fontSize: '0.85rem',
          color: 'var(--muted)',
        }}
      >
        <span>
          By <a href={author.url} style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'none' }}>{author.name}</a>
          <span style={{ color: 'var(--dim)' }}> · {author.title}</span>
        </span>
        <span style={{ color: 'var(--dim)' }}>·</span>
        <span>Published {fmtDate(content.datePublished)}</span>
        <span style={{ color: 'var(--dim)' }}>·</span>
        <span>Updated {fmtDate(content.dateModified)}</span>
      </div>

      {/* Long-form sections */}
      <div style={{ marginTop: '2rem' }}>
        {content.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.6rem', color: 'var(--text)' }}>
              {s.heading}
            </h2>
            <p style={{ color: 'var(--text)', fontSize: '0.97rem', lineHeight: 1.75, whiteSpace: 'pre-line', opacity: 0.9 }}>
              {s.body}
            </p>
          </section>
        ))}
      </div>

      {/* Worked examples */}
      {content.examples && content.examples.length > 0 && (
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
            Worked Examples
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {content.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '1.1rem 1.3rem',
                }}
              >
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--accent)' }}>
                  {ex.title}
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '0.6rem', fontSize: '0.88rem' }}>
                  <tbody>
                    {ex.inputs.map((inp, j) => (
                      <tr key={j}>
                        <td style={{ padding: '0.25rem 0', color: 'var(--muted)' }}>{inp.label}</td>
                        <td style={{ padding: '0.25rem 0', textAlign: 'right', color: 'var(--text)', fontWeight: 600 }}>{inp.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--green)', marginBottom: '0.4rem' }}>
                  {ex.result}
                </p>
                <p style={{ fontSize: '0.88rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                  {ex.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {content.faq.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text)' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {content.faq.map((f, i) => (
              <details
                key={i}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: 12,
                  padding: '0.9rem 1.1rem',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '0.97rem', color: 'var(--text)' }}>
                  {f.q}
                </summary>
                <p style={{ marginTop: '0.55rem', fontSize: '0.92rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Sources */}
      {content.sources.length > 0 && (
        <section style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--line)' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--muted)' }}>
            Sources
          </h2>
          <ul style={{ paddingLeft: '1.1rem', fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            {content.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Author bio card */}
      <section
        style={{
          marginTop: '2rem',
          padding: '1.25rem 1.4rem',
          background: 'var(--card)',
          border: '1px solid var(--line)',
          borderRadius: 16,
        }}
      >
        <div style={{ fontSize: '0.78rem', color: 'var(--dim)', fontWeight: 700, letterSpacing: 1, marginBottom: '0.6rem', textTransform: 'uppercase' }}>
          About the author
        </div>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text)' }}>{author.name}</div>
        <div style={{ fontSize: '0.87rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.55rem' }}>
          {author.title} · {author.yearsExperience}+ years
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>{author.bio}</p>
      </section>
    </article>
  )
}
