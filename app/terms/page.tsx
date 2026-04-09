import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | USA-Calc',
  description: 'Terms of use for USA-Calc — conditions governing your use of our free online calculators and tools.',
  alternates: { canonical: '/terms' },
}

const s: React.CSSProperties = { maxWidth: 760, margin: '0 auto', padding: '3rem 1.25rem 5rem', color: 'var(--text)', lineHeight: 1.75 }
const h1s: React.CSSProperties = { fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 900, marginBottom: '0.5rem' }
const h2s: React.CSSProperties = { fontSize: '1.15rem', fontWeight: 800, marginTop: '2rem', marginBottom: '0.4rem' }
const ps: React.CSSProperties = { color: 'var(--muted)', marginBottom: '1rem' }

export default function TermsPage() {
  return (
    <div style={s}>
      <h1 style={h1s}>Terms of Use</h1>
      <p style={{ ...ps, fontSize: 13 }}>Last updated: April 9, 2026</p>

      <p style={ps}>
        By accessing or using <strong>www.usa-calc.com</strong> ("USA-Calc", "the site", "we", "us"), you agree to
        be bound by these Terms of Use. If you do not agree, please discontinue use of the site.
      </p>

      <h2 style={h2s}>1. Informational Purpose Only</h2>
      <p style={ps}>
        All calculators, tools, and content on USA-Calc are provided for informational and educational purposes
        only. Results are estimates based on general rules and publicly available data. They do not constitute
        financial, tax, legal, or investment advice. Always consult a qualified professional before making
        financial decisions.
      </p>

      <h2 style={h2s}>2. No Guarantee of Accuracy</h2>
      <p style={ps}>
        We strive to keep calculations accurate and up to date with current IRS rules, BLS data, and other
        sources. However, tax laws change frequently, and individual circumstances vary. USA-Calc makes no
        warranty, express or implied, as to the accuracy, completeness, or fitness for a particular purpose of
        any calculation or content on this site.
      </p>

      <h2 style={h2s}>3. Permitted Use</h2>
      <p style={ps}>
        You may use USA-Calc for personal, non-commercial purposes. You may not scrape, reproduce, redistribute,
        or republish any content from this site without prior written permission. Automated access (bots,
        crawlers) beyond normal search engine indexing is prohibited.
      </p>

      <h2 style={h2s}>4. Intellectual Property</h2>
      <p style={ps}>
        All content on USA-Calc — including text, calculator logic, design, and data compilations — is owned by
        USA-Calc or its licensors and is protected by applicable copyright and intellectual property laws.
      </p>

      <h2 style={h2s}>5. Third-Party Advertising</h2>
      <p style={ps}>
        USA-Calc displays advertisements served by Google AdSense and potentially other ad networks. We are not
        responsible for the content of third-party advertisements. Clicking on ads is subject to the advertiser's
        own terms and privacy policies.
      </p>

      <h2 style={h2s}>6. Limitation of Liability</h2>
      <p style={ps}>
        To the maximum extent permitted by law, USA-Calc and its operators shall not be liable for any direct,
        indirect, incidental, or consequential damages arising from your use of, or inability to use, the site or
        its calculators — including any financial decisions made based on results displayed.
      </p>

      <h2 style={h2s}>7. External Links</h2>
      <p style={ps}>
        The site may contain links to third-party websites. These links are provided for convenience only.
        USA-Calc does not endorse and is not responsible for the content, accuracy, or practices of any
        linked site.
      </p>

      <h2 style={h2s}>8. Changes to Terms</h2>
      <p style={ps}>
        We may update these Terms of Use at any time. Changes will be posted on this page with an updated date.
        Continued use of the site after changes are posted constitutes your acceptance of the revised terms.
      </p>

      <h2 style={h2s}>9. Governing Law</h2>
      <p style={ps}>
        These Terms are governed by the laws of the United States. Any disputes shall be resolved in the
        applicable courts of the United States.
      </p>

      <h2 style={h2s}>10. Contact</h2>
      <p style={ps}>
        Questions about these Terms?{' '}
        <a href="mailto:hello@usa-calc.com" style={{ color: 'var(--accent)' }}>
          hello@usa-calc.com
        </a>
      </p>
    </div>
  )
}
