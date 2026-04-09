import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | USA-Calc',
  description: 'USA-Calc privacy policy — how we collect, use, and protect your data.',
  alternates: { canonical: '/privacy' },
}

const s: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.5rem' }
const h2s: React.CSSProperties = { fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem', marginBottom: '0.4rem' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1rem' }

export default function PrivacyPage() {
  const updated = 'April 9, 2026'
  return (
    <div style={s}>
      <h1 style={h1s}>Privacy Policy</h1>
      <p style={{ ...ps, fontSize: 13 }}>Last updated: {updated}</p>

      <p style={ps}>
        USA-Calc ("we", "us", or "our") operates <strong>www.usa-calc.com</strong>. This Privacy Policy explains what
        information we collect, how we use it, and your rights regarding that information.
      </p>

      <h2 style={h2s}>Information We Collect</h2>
      <p style={ps}>
        <strong>Usage data:</strong> When you visit USA-Calc, our servers and analytics tools automatically log
        standard data such as your IP address, browser type, pages visited, and time on site. This data is
        aggregated and cannot identify you individually.
      </p>
      <p style={ps}>
        <strong>Calculator inputs:</strong> All calculations on USA-Calc run entirely in your browser. We do not
        transmit, store, or log any numbers you enter into our calculators.
      </p>
      <p style={ps}>
        <strong>Cookies:</strong> We use cookies for site functionality and analytics (Google Analytics). You can
        disable cookies in your browser settings at any time.
      </p>

      <h2 style={h2s}>Google AdSense</h2>
      <p style={ps}>
        We use Google AdSense to display advertisements. Google may use cookies and web beacons to serve ads based
        on your prior visits to this site or other sites. Google's use of advertising cookies enables it and its
        partners to serve ads based on your visit to USA-Calc and other sites on the internet. You may opt out of
        personalized advertising by visiting{' '}
        <a href="https://www.google.com/settings/ads" style={{ color: 'var(--accent)' }}>
          Google Ads Settings
        </a>
        .
      </p>

      <h2 style={h2s}>Google Analytics</h2>
      <p style={ps}>
        We use Google Analytics to understand how visitors use our site. Google Analytics collects data such as
        session duration, pages visited, and geographic region. This data is anonymized and used only to improve
        site content and performance. You can opt out using the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout" style={{ color: 'var(--accent)' }}>
          Google Analytics Opt-out Browser Add-on
        </a>
        .
      </p>

      <h2 style={h2s}>How We Use Your Information</h2>
      <p style={ps}>
        We use collected data to: operate and improve the site, analyze usage patterns, display relevant
        advertising, and comply with legal obligations. We do not sell personal data to third parties.
      </p>

      <h2 style={h2s}>Data Retention</h2>
      <p style={ps}>
        Aggregated analytics data is retained for up to 26 months. We do not retain any personally identifiable
        information beyond what is required to operate the site.
      </p>

      <h2 style={h2s}>Your Rights</h2>
      <p style={ps}>
        Depending on your location, you may have rights under GDPR, CCPA, or other applicable law to access,
        correct, or delete your personal data. To exercise these rights, contact us at the address below.
      </p>

      <h2 style={h2s}>Third-Party Links</h2>
      <p style={ps}>
        USA-Calc may contain links to external websites. We are not responsible for the privacy practices of those
        sites and encourage you to review their privacy policies.
      </p>

      <h2 style={h2s}>Changes to This Policy</h2>
      <p style={ps}>
        We may update this Privacy Policy periodically. Changes will be posted on this page with an updated date.
        Continued use of the site after changes constitutes acceptance of the updated policy.
      </p>

      <h2 style={h2s}>Contact</h2>
      <p style={ps}>
        Questions about this Privacy Policy? Email us at:{' '}
        <a href="mailto:privacy@usa-calc.com" style={{ color: 'var(--accent)' }}>
          privacy@usa-calc.com
        </a>
      </p>
    </div>
  )
}
