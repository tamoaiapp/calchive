import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | USA-Calc',
  description: 'Contact USA-Calc with questions, corrections, or feedback about our financial calculators.',
  alternates: { canonical: '/contact' },
}

const s: React.CSSProperties = { maxWidth: 680, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.5rem' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1.25rem' }
const card: React.CSSProperties = { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '2rem', marginTop: '2rem' }
const row: React.CSSProperties = { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: '1.5rem' }
const icon: React.CSSProperties = { fontSize: 28, flexShrink: 0, marginTop: 2 }
const label: React.CSSProperties = { fontWeight: 700, marginBottom: 4 }

export default function ContactPage() {
  return (
    <div style={s}>
      <h1 style={h1s}>Contact USA-Calc</h1>
      <p style={ps}>
        Found an error in a calculation? Have a suggestion for a new calculator or tool? We read every message.
      </p>

      <div style={card}>
        <div style={row}>
          <div style={icon}>✉️</div>
          <div>
            <div style={label}>General Inquiries</div>
            <a href="mailto:hello@usa-calc.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              hello@usa-calc.com
            </a>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              Questions, feedback, and feature requests
            </div>
          </div>
        </div>

        <div style={row}>
          <div style={icon}>🔒</div>
          <div>
            <div style={label}>Privacy & Data</div>
            <a href="mailto:privacy@usa-calc.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              privacy@usa-calc.com
            </a>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              GDPR, CCPA, and data requests
            </div>
          </div>
        </div>

        <div style={row}>
          <div style={icon}>⚠️</div>
          <div>
            <div style={label}>Report a Calculation Error</div>
            <a href="mailto:corrections@usa-calc.com" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              corrections@usa-calc.com
            </a>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>
              Include the page URL and the value you believe is incorrect
            </div>
          </div>
        </div>
      </div>

      <p style={{ ...ps, marginTop: '2rem', fontSize: 14 }}>
        We typically respond within 2 business days. USA-Calc is a small independent site — we appreciate your patience.
      </p>
    </div>
  )
}
