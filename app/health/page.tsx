import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Health Calculators & Tools — BMI, Calories, Fitness | USA-Calc',
  description:
    'Free health calculators for BMI, calories, ideal weight, heart rate zones, TDEE, and more. Based on WHO, CDC, and Mifflin-St Jeor standards.',
  alternates: { canonical: '/health' },
}

const categories = [
  {
    icon: '⚖️',
    label: 'Weight & BMI',
    desc: 'Calculate BMI, ideal weight, and body fat. WHO-standard categories.',
    links: [
      { title: 'BMI Calculator', href: '/calculator/bmi-calculator' },
      { title: 'BMI 25 — Overweight threshold', href: '/health/bmi-25' },
      { title: 'BMI 30 — Obese threshold', href: '/health/bmi-30' },
      { title: 'BMI 27.5 explained', href: '/health/bmi-27-5' },
      { title: 'Ideal Weight 5\'10"', href: '/health/ideal-weight-5ft10' },
      { title: 'Ideal Weight 5\'6"', href: '/health/ideal-weight-5ft6' },
    ],
  },
  {
    icon: '🔥',
    label: 'Nutrition & Calories',
    desc: 'Calorie deficits, TDEE, weight loss timelines. Based on Mifflin-St Jeor.',
    links: [
      { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator' },
      { title: 'How to Lose 20 lbs', href: '/health/calories-to-lose-20-lbs' },
      { title: 'How to Lose 30 lbs', href: '/health/calories-to-lose-30-lbs' },
      { title: 'TDEE 2,000 calories', href: '/health/tdee-2000' },
      { title: 'TDEE 2,500 calories', href: '/health/tdee-2500' },
      { title: '500 Calorie Deficit', href: '/health/calorie-deficit-500' },
    ],
  },
  {
    icon: '❤️',
    label: 'Heart & Fitness',
    desc: 'Heart rate training zones, resting HR, and cardiovascular health.',
    links: [
      { title: 'Heart Rate Zones Age 30', href: '/health/heart-rate-zone-30' },
      { title: 'Heart Rate Zones Age 40', href: '/health/heart-rate-zone-40' },
      { title: 'Heart Rate Zones Age 50', href: '/health/heart-rate-zone-50' },
      { title: 'Resting Heart Rate 60 BPM', href: '/health/resting-heart-rate-60' },
      { title: 'Resting Heart Rate 70 BPM', href: '/health/resting-heart-rate-70' },
      { title: 'BMR Calculator', href: '/calculator/bmr-calculator' },
    ],
  },
  {
    icon: '📖',
    label: 'Health Guides',
    desc: 'Evidence-based guides on diet, exercise, and metabolic health.',
    links: [
      { title: 'Intermittent Fasting Guide', href: '/health/intermittent-fasting-guide' },
      { title: 'How to Lose Belly Fat', href: '/health/how-to-lose-belly-fat' },
      { title: 'Macros Explained', href: '/health/macros-explained' },
      { title: 'How to Gain Muscle', href: '/health/how-to-gain-muscle' },
      { title: 'Keto Diet Guide', href: '/health/keto-diet-guide' },
      { title: 'Protein Intake Guide', href: '/health/protein-intake-guide' },
    ],
  },
]

const popularCalcs = [
  { label: 'BMI Calculator', href: '/calculator/bmi-calculator', icon: '⚖️', sub: 'WHO standard categories' },
  { label: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥', sub: 'Mifflin-St Jeor equation' },
  { label: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡', sub: 'Maintenance calories' },
  { label: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗', sub: 'Weight loss planning' },
  { label: 'Protein Intake Calculator', href: '/calculator/protein-intake-calculator', icon: '🥩', sub: 'Daily protein goals' },
  { label: 'Ideal Weight Calculator', href: '/calculator/ideal-weight-calculator', icon: '📏', sub: 'Four formula average' },
]

export default function HealthPage() {
  return (
    <>
      <style>{`
        .health-cat-card {
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 20px;
          padding: 28px;
          transition: border-color 0.15s, transform 0.15s;
        }
        .health-cat-card:hover { border-color: rgba(16,185,129,0.35); transform: translateY(-2px); }
        .health-link {
          display: block;
          padding: 6px 0;
          color: var(--muted);
          font-size: 14px;
          transition: color 0.12s;
          text-decoration: none;
        }
        .health-link:hover { color: var(--text); }
        .popular-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 20px;
          background: var(--card);
          border: 1px solid var(--line);
          border-radius: 16px;
          transition: border-color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .popular-card:hover { border-color: rgba(16,185,129,0.35); background: rgba(16,185,129,0.06); }
      `}</style>

      {/* Hero */}
      <section
        style={{
          background: 'var(--bg)',
          padding: '64px 24px 48px',
          borderBottom: '1px solid var(--line)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '5px 14px',
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              color: '#10b981',
              marginBottom: 20,
            }}
          >
            Evidence-Based Health Tools
          </span>
          <h1
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: 16,
              color: 'var(--text)',
            }}
          >
            Health Calculators &amp; Tools
          </h1>
          <p style={{ fontSize: 17, color: 'var(--muted)', lineHeight: 1.7, margin: 0 }}>
            BMI by WHO standards, calorie math via Mifflin-St Jeor, heart rate zones, ideal weight,
            and 800+ health reference pages.
          </p>
        </div>
      </section>

      {/* Popular calculators */}
      <section style={{ background: 'var(--bg2)', padding: '56px 24px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.3px' }}>
            Most-Used Health Calculators
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28 }}>
            Interactive tools with real formulas
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {popularCalcs.map((item) => (
              <Link key={item.href} href={item.href} className="popular-card">
                <span
                  style={{
                    fontSize: 22,
                    width: 44,
                    height: 44,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(16,185,129,0.1)',
                    borderRadius: 12,
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </span>
                <div>
                  <p style={{ fontWeight: 600, color: 'var(--text)', fontSize: 14, marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--muted)' }}>{item.sub}</p>
                </div>
                <span style={{ marginLeft: 'auto', color: 'var(--dim)', fontSize: 18, flexShrink: 0 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section style={{ background: 'var(--bg)', padding: '56px 24px 72px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.3px' }}>
            Browse by Category
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 32 }}>
            800+ health reference pages
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {categories.map((cat) => (
              <div key={cat.label} className="health-cat-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 24 }}>{cat.icon}</span>
                  <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>{cat.label}</p>
                </div>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {cat.desc}
                </p>
                <div>
                  {cat.links.map((link) => (
                    <Link key={link.href} href={link.href} className="health-link">
                      → {link.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
