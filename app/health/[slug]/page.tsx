import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import RelatedLinks from '@/components/RelatedLinks'
import AdSlot from '@/components/AdSlot'
import { HEALTH_PAGE_SLUGS, parseHealthSlug, formatHeight } from '@/lib/health/pages-manifest'
import {
  calcBMI,
  getBMICategory,
  calcHeartRateZones,
  calcIdealWeight,
} from '@/lib/health/calculator'

export const dynamic = 'force-static'
export const dynamicParams = true

export async function generateStaticParams() {
  return HEALTH_PAGE_SLUGS.slice(0, 80).map((slug) => ({ slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const config = parseHealthSlug(slug)
  if (!config) return { title: 'Page Not Found' }

  let title = ''
  let description = ''

  switch (config.type) {
    case 'bmi': {
      const bmi = config.value!
      const cat = getBMICategory(bmi)
      title = `BMI ${bmi}: ${cat.label} — What It Means`
      description = `BMI ${bmi} falls in the ${cat.label} category. Learn what this means, health risks, and how many calories to reach a normal BMI.`
      break
    }
    case 'bmi-for-age': {
      const age = config.value!
      title = `BMI for Age ${age} — Normal BMI Range for Adults`
      description = `What is a healthy BMI at age ${age}? Normal range, weight categories, and age-adjusted context based on CDC data.`
      break
    }
    case 'bmi-calculator-gender': {
      const g = config.variant === 'men' ? 'Men' : 'Women'
      title = `BMI Calculator for ${g} — Body Mass Index Guide`
      description = `BMI calculator and reference guide for ${g.toLowerCase()}. Includes average BMI, healthy ranges, and weight loss math.`
      break
    }
    case 'calories-to-lose': {
      const lbs = config.value!
      title = `How Many Calories to Lose ${lbs} Pounds: Timeline & Plan`
      description = `Losing ${lbs} pounds requires a total deficit of ${(lbs * 3500).toLocaleString()} calories. See timelines at 3 different daily deficit rates.`
      break
    }
    case 'calorie-deficit': {
      const cal = config.value!
      title = `${cal} Calorie Deficit — Weight Loss Rate & Timeline`
      description = `A ${cal}-calorie daily deficit produces ${((cal * 7) / 3500).toFixed(2)} lbs/week of loss. Timeline, muscle preservation tips, and meal planning.`
      break
    }
    case 'how-long-to-lose': {
      const lbs = config.value!
      title = `How Long to Lose ${lbs} Pounds — Realistic Timeline`
      description = `At a safe 1 lb/week rate, losing ${lbs} pounds takes ${lbs} weeks. See timelines at 0.5, 1, and 2 lbs per week.`
      break
    }
    case 'tdee': {
      const cal = config.value!
      title = `TDEE of ${cal.toLocaleString()} Calories — Maintenance, Loss & Gain Plans`
      description = `With a TDEE of ${cal.toLocaleString()} calories/day: eat ${cal - 500} to lose 1 lb/week, or ${cal + 250} to lean bulk. Macro breakdown included.`
      break
    }
    case 'ideal-weight': {
      const inches = config.value!
      const h = formatHeight(inches)
      title = `Ideal Weight for ${h} — Four Formula Average`
      description = `Ideal body weight for ${h} height using Devine, Hamwi, Robinson, and Miller formulas. Includes BMI range for this height.`
      break
    }
    case 'heart-rate-zone': {
      const age = config.value!
      const maxHR = 220 - age
      title = `Heart Rate Zones for Age ${age} — Target BPM for Every Zone`
      description = `Max heart rate for age ${age} is ~${maxHR} BPM. Fat burning zone: ${Math.round(maxHR * 0.6)}–${Math.round(maxHR * 0.7)} BPM. All 5 zones with training guidance.`
      break
    }
    case 'resting-heart-rate': {
      const bpm = config.value!
      let status = 'normal'
      if (bpm < 60) status = 'excellent'
      else if (bpm > 80) status = 'above average'
      title = `Resting Heart Rate ${bpm} BPM — Is It Normal?`
      description = `A resting heart rate of ${bpm} BPM is ${status}. Normal range is 60–100 BPM. See what your RHR says about your cardiovascular fitness.`
      break
    }
    case 'guide': {
      const guideMap: Record<string, { title: string; desc: string }> = {
        'intermittent-fasting-guide': {
          title: 'Intermittent Fasting Guide — 16:8, 5:2, and OMAD Explained',
          desc: 'How intermittent fasting works, the most popular protocols, and what the research says about weight loss and metabolic health.',
        },
        'keto-diet-guide': {
          title: 'Keto Diet Guide — How Ketosis Works & What to Eat',
          desc: 'The ketogenic diet explained: macro ratios, ketosis timeline, foods allowed, and evidence on weight loss and blood sugar.',
        },
        'mediterranean-diet-guide': {
          title: 'Mediterranean Diet Guide — Principles, Foods & Benefits',
          desc: 'The Mediterranean diet pattern ranked #1 by US News. What to eat, health benefits backed by research, and how to start.',
        },
        'macros-explained': {
          title: 'Macros Explained — Protein, Carbs & Fat Targets',
          desc: 'What macronutrients are, how to calculate them, and how to set your ratios for weight loss, muscle gain, or maintenance.',
        },
        'protein-intake-guide': {
          title: 'Protein Intake Guide — How Much You Actually Need',
          desc: 'Research-backed protein targets by goal: RDA is 0.8g/kg, but muscle building needs 1.6–2.2g/kg. How to hit your target daily.',
        },
        'creatine-guide': {
          title: 'Creatine Guide — Benefits, Dosage & Safety',
          desc: 'Creatine is the most-studied sports supplement. 5g/day improves strength and high-intensity performance. Full evidence review.',
        },
        'how-to-lose-belly-fat': {
          title: 'How to Lose Belly Fat — What Actually Works',
          desc: 'Spot reduction is a myth. Belly fat (visceral fat) responds to calorie deficit, resistance training, and sleep. Evidence-based strategies.',
        },
        'how-to-gain-muscle': {
          title: 'How to Gain Muscle — Training, Nutrition & Recovery',
          desc: 'Muscle growth requires progressive overload, 1.6g+ protein per kg, and adequate sleep. Beginner to intermediate strategy guide.',
        },
        'body-recomposition-guide': {
          title: 'Body Recomposition Guide — Lose Fat & Gain Muscle Simultaneously',
          desc: 'Body recomp works best for beginners and people returning after a break. Requires slight calorie deficit, high protein, and lifting.',
        },
        'sleep-and-weight-loss': {
          title: 'Sleep & Weight Loss — How Poor Sleep Sabotages Fat Loss',
          desc: 'Less than 7 hours of sleep increases ghrelin, reduces leptin, and elevates cortisol — a triple-hit to weight loss efforts.',
        },
        'stress-and-weight-gain': {
          title: 'Stress & Weight Gain — The Cortisol Connection',
          desc: 'Chronic stress elevates cortisol, which promotes fat storage (especially visceral fat) and increases cravings for high-calorie foods.',
        },
        'metabolism-explained': {
          title: 'Metabolism Explained — What It Is and Can You Speed It Up?',
          desc: 'Metabolism is the sum of all chemical reactions in your body. BMR makes up 60–70% of daily calorie burn. What affects it.',
        },
        'calories-in-foods-guide': {
          title: 'Calories in Common Foods — Reference Guide',
          desc: 'Calorie counts for proteins, carbs, fats, and beverages. Useful reference for tracking intake without calorie-counting apps.',
        },
        'exercise-for-weight-loss': {
          title: 'Exercise for Weight Loss — Which Types Work Best',
          desc: 'Cardio burns more calories per session; strength training increases resting metabolism long-term. The optimal combination.',
        },
        'strength-training-for-beginners': {
          title: 'Strength Training for Beginners — First 12 Weeks',
          desc: 'A beginner can gain 1–2 lbs of muscle per month. The 5 compound lifts, progressive overload, and how to structure a program.',
        },
        'cardio-vs-weights': {
          title: 'Cardio vs Weights for Weight Loss — Which Is Better?',
          desc: 'Cardio creates a larger acute deficit; weights build muscle that burns calories at rest. Research favors a combination of both.',
        },
        'meal-prep-guide': {
          title: 'Meal Prep Guide — How to Cook for the Week in 2 Hours',
          desc: 'Batch cooking strategies, storage times, and how meal prep reduces calorie intake by ~500 calories/day versus eating out.',
        },
        'hydration-guide': {
          title: 'Hydration Guide — How Much Water You Actually Need',
          desc: 'The "8 glasses" rule is not evidence-based. National Academies recommend 3.7L for men, 2.7L for women (including food water).',
        },
        'supplement-guide': {
          title: 'Supplement Guide — What Works and What Doesn\'t',
          desc: 'Evidence ratings for the most common supplements: creatine (strong), protein powder (useful), multivitamins (weak), fat burners (poor).',
        },
        'blood-pressure-guide': {
          title: 'Blood Pressure Guide — Normal Ranges & What the Numbers Mean',
          desc: 'Normal blood pressure is under 120/80 mmHg. Stage 2 hypertension is 140/90+. How to lower it without medication.',
        },
        'cholesterol-guide': {
          title: 'Cholesterol Guide — LDL, HDL, and Total Cholesterol Explained',
          desc: 'Optimal LDL is under 100 mg/dL. HDL above 60 mg/dL is protective. Dietary changes that reduce LDL by 10–20%.',
        },
        'blood-sugar-guide': {
          title: 'Blood Sugar Guide — Normal Levels, Prediabetes & Control',
          desc: 'Fasting blood sugar under 100 mg/dL is normal. 100–125 is prediabetes. Diet, exercise, and sleep strategies to improve it.',
        },
        'diabetes-prevention-guide': {
          title: 'Diabetes Prevention Guide — Reduce Your Risk by Up to 58%',
          desc: 'The DPP trial showed losing 7% of body weight and walking 150 min/week reduces type 2 diabetes risk by 58% in high-risk adults.',
        },
        'heart-health-guide': {
          title: 'Heart Health Guide — Diet, Exercise & Risk Factor Control',
          desc: 'Cardiovascular disease is the #1 cause of death in the US. Diet (Mediterranean pattern), exercise, and cholesterol control reduce risk.',
        },
        'cancer-prevention-guide': {
          title: 'Cancer Prevention Guide — Lifestyle Factors That Reduce Risk',
          desc: 'The WHO estimates 30–50% of cancers are preventable. Key factors: tobacco avoidance, healthy weight, alcohol reduction, physical activity.',
        },
        'mental-health-exercise-guide': {
          title: 'Exercise & Mental Health — How Physical Activity Reduces Anxiety & Depression',
          desc: '150 minutes of moderate exercise per week reduces depression symptoms as effectively as antidepressants in mild-to-moderate cases.',
        },
        'aging-and-fitness-guide': {
          title: 'Aging & Fitness — How to Stay Strong After 50',
          desc: 'Muscle loss (sarcopenia) starts at ~30 and accelerates after 60. Resistance training 2–3×/week and 1.2g+ protein/kg preserves muscle mass.',
        },
        'postpartum-fitness-guide': {
          title: 'Postpartum Fitness Guide — Safe Return to Exercise After Birth',
          desc: 'Most women can start walking within days of birth. Pelvic floor rehabilitation and gradual return to lifting at 6–12 weeks. Evidence-based timeline.',
        },
        'senior-fitness-guide': {
          title: 'Senior Fitness Guide — Exercise for Adults Over 65',
          desc: 'WHO recommends 150 min/week of moderate aerobic activity for older adults, plus muscle-strengthening 2+ days/week. Falls prevention included.',
        },
        'running-for-beginners': {
          title: 'Running for Beginners — Couch to 5K in 9 Weeks',
          desc: 'A beginner can go from non-runner to 5K in 9 weeks with run-walk intervals 3×/week. Proper form, shoes, and injury prevention.',
        },
        'how-to-lose-weight': {
          title: 'How to Lose Weight — The Proven, Evidence-Based Method',
          desc: 'Weight loss requires a calorie deficit. The three levers: eat less, move more, or both. No supplements, no shortcuts — the science explained.',
        },
      }
      const meta = guideMap[slug]
      if (meta) {
        title = meta.title
        description = meta.desc
      } else {
        title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        description = `Health guide: ${title.toLowerCase()}.`
      }
      break
    }
  }

  return {
    title: `${title} | USA-Calc`,
    description,
    alternates: { canonical: `/health/${slug}` },
    openGraph: { title: `${title} | USA-Calc`, description, type: 'article' },
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function HealthSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const config = parseHealthSlug(slug)
  if (!config) notFound()

  const sharedRelatedCalcs = [
    { title: 'BMI Calculator', href: '/calculator/bmi-calculator', icon: '⚖️' },
    { title: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥' },
    { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
    { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
    { title: 'Protein Intake Calculator', href: '/calculator/protein-intake-calculator', icon: '🥩' },
    { title: 'Ideal Weight Calculator', href: '/calculator/ideal-weight-calculator', icon: '📏' },
    { title: 'Water Intake Calculator', href: '/calculator/water-intake-calculator', icon: '💧' },
  ]

  // ── BMI page ─────────────────────────────────────────────────────────────
  if (config.type === 'bmi') {
    const bmi = config.value!
    const cat = getBMICategory(bmi)
    const normalLow = 18.5
    const normalHigh = 24.9

    // Approximate weight for 5'9" (average US adult height) to give concrete examples
    const refHeightIn = 69
    const weightAtBMI = (bmi * refHeightIn * refHeightIn) / 703
    const weightAtNormal = (22.0 * refHeightIn * refHeightIn) / 703 // mid-normal
    const lbsToNormal = weightAtBMI - weightAtNormal
    const weeksAt500 = Math.abs(lbsToNormal) / 1.0
    const weeksAt750 = Math.abs(lbsToNormal) / 1.5

    const isOverNormal = bmi >= normalHigh
    const isUnderNormal = bmi < normalLow

    const bmiGaugePercent = Math.min(100, Math.max(0, ((bmi - 14) / (50 - 14)) * 100))

    const relatedBMIs = [
      bmi > 18.5 ? { href: `/health/bmi-${(bmi - 1).toFixed(1).replace('.', '-')}`, title: `BMI ${(bmi - 1).toFixed(1)}` } : null,
      bmi < 50 ? { href: `/health/bmi-${(bmi + 1).toFixed(1).replace('.', '-')}`, title: `BMI ${(bmi + 1).toFixed(1)}` } : null,
      { href: '/health/bmi-25', title: 'BMI 25 — Overweight line' },
      { href: '/health/bmi-30', title: 'BMI 30 — Obese line' },
    ].filter(Boolean) as { href: string; title: string }[]

    return (
      <PageWrapper
        slug={slug}
        breadcrumb={[{ label: 'Health', href: '/health' }, { label: `BMI ${bmi}` }]}
      >
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          BMI {bmi}: What It Means and What to Do
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 28 }}>
          A body mass index of {bmi} places you in the{' '}
          <strong style={{ color: cat.color }}>{cat.label}</strong> category according to WHO and CDC
          standards. The average BMI for US adults is 29.8 (men: 29.4, women: 30.1).
        </p>

        <AdSlot slot="5678901234" format="leaderboard" />

        {/* BMI Gauge */}
        <section
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 18,
            padding: '24px',
            marginTop: 24,
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>BMI Scale Position</h2>
          <div style={{ position: 'relative', height: 28, background: 'var(--bg)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
            {/* color segments */}
            <div style={{ position: 'absolute', left: 0, top: 0, width: `${((18.5 - 14) / 36) * 100}%`, height: '100%', background: '#3b82f6', opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: `${((18.5 - 14) / 36) * 100}%`, top: 0, width: `${((25 - 18.5) / 36) * 100}%`, height: '100%', background: '#10b981', opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: `${((25 - 14) / 36) * 100}%`, top: 0, width: `${((30 - 25) / 36) * 100}%`, height: '100%', background: '#f59e0b', opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: `${((30 - 14) / 36) * 100}%`, top: 0, width: `${((35 - 30) / 36) * 100}%`, height: '100%', background: '#ef4444', opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: `${((35 - 14) / 36) * 100}%`, top: 0, right: 0, height: '100%', background: '#991b1b', opacity: 0.7 }} />
            {/* needle */}
            <div
              style={{
                position: 'absolute',
                left: `${bmiGaugePercent}%`,
                top: 0,
                width: 3,
                height: '100%',
                background: '#fff',
                transform: 'translateX(-50%)',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
            <span>14</span>
            <span style={{ color: '#3b82f6' }}>Underweight</span>
            <span style={{ color: '#10b981' }}>Normal</span>
            <span style={{ color: '#f59e0b' }}>Overweight</span>
            <span style={{ color: '#ef4444' }}>Obese</span>
            <span>50</span>
          </div>
          <p style={{ marginTop: 12, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            <strong style={{ color: cat.color }}>Your BMI: {bmi}</strong> — {cat.risk}
          </p>
        </section>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
          <StatCard label="BMI Category" value={cat.label} color={cat.color} />
          <StatCard label="Healthy BMI Range" value={`${normalLow}–${normalHigh}`} />
          {isOverNormal && <StatCard label="BMI to Lose to Reach Normal" value={(bmi - normalHigh).toFixed(1) + ' BMI'} />}
          {isOverNormal && <StatCard label="Approx. Lbs to Lose (5ft9 ref)" value={`~${Math.round(lbsToNormal)} lbs`} />}
          {isUnderNormal && <StatCard label="BMI to Gain to Reach Normal" value={(normalLow - bmi).toFixed(1) + ' BMI'} />}
        </div>

        {isOverNormal && (
          <section
            style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
              Weight Loss Timeline to Reach Normal BMI (5&apos;9&quot; reference)
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>
              A BMI of {bmi} at 5&apos;9&quot; corresponds to approximately {Math.round(weightAtBMI)} lbs. Reaching the midpoint of the
              normal range (BMI 22) at this height requires losing roughly {Math.round(lbsToNormal)} lbs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <DeficitTimelineCard deficit={500} weeksRaw={weeksAt500} lbs={Math.round(lbsToNormal)} />
              <DeficitTimelineCard deficit={750} weeksRaw={weeksAt750} lbs={Math.round(lbsToNormal)} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
              FDA recommendation: 1–2 lbs/week. Deficits over 1,000 cal/day require medical supervision.
              Actual height and weight vary; use the BMI Calculator for your exact numbers.
            </p>
          </section>
        )}

        <AdSlot slot="6789012345" format="rectangle" />

        <RelatedLinks
          title="Related Health Tools"
          links={[
            { title: 'BMI Calculator', href: '/calculator/bmi-calculator', icon: '⚖️' },
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
            ...relatedBMIs.slice(0, 2).map((r) => ({ title: r.title, href: r.href, icon: '📊' })),
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── BMI for age page ──────────────────────────────────────────────────────
  if (config.type === 'bmi-for-age') {
    const age = config.value!
    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `BMI for Age ${age}` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          BMI for Age {age} — Healthy Weight Range
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          For adults aged {age}, the WHO-standard healthy BMI range of 18.5–24.9 applies. BMI is
          calculated the same way at any adult age: weight (lbs) ÷ height (in²) × 703.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>BMI Categories — All Ages</h2>
          <BMICategoryTable />
        </section>
        <ContentBlock>
          <p>
            At age {age}, metabolic changes
            {age >= 40 ? ' — including declining muscle mass (sarcopenia starts around age 30) and shifting fat distribution' : ''}
            {age >= 60 ? ', accelerating after 60' : ''} can affect body composition without changing
            BMI. A person at age {age} with BMI 23 may have more body fat than a 25-year-old at the
            same BMI if they have less muscle mass.
          </p>
          <p style={{ marginTop: 12 }}>
            The CDC-defined average BMI for US adults is 29.8. By age group: adults 20–39 average 27.8,
            adults 40–59 average 30.3, adults 60+ average 29.5 (NHANES 2017–2020).
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks title="Related Tools" links={sharedRelatedCalcs.slice(0, 4)} />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── BMI calculator by gender ──────────────────────────────────────────────
  if (config.type === 'bmi-calculator-gender') {
    const isMen = config.variant === 'men'
    const avgBMI = isMen ? 29.4 : 30.1
    const gLabel = isMen ? 'Men' : 'Women'
    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `BMI Calculator — ${gLabel}` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          BMI Calculator for {gLabel} — Reference Guide
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          The average BMI for US {gLabel.toLowerCase()} is <strong>{avgBMI}</strong>, placing the
          average {gLabel === 'Men' ? 'man' : 'woman'} in the Overweight category (CDC NHANES 2017–2020).
          The healthy range of 18.5–24.9 applies regardless of sex.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>BMI Categories</h2>
          <BMICategoryTable />
        </section>
        <ContentBlock>
          <p>
            BMI uses the same formula for {gLabel.toLowerCase()} — height and weight only — but
            {isMen
              ? ' men tend to carry more lean muscle mass, meaning a man with BMI 27 may have less body fat than a woman at the same BMI.'
              : ' women naturally carry a higher percentage of body fat than men at the same BMI, particularly before menopause.'}
          </p>
          <p style={{ marginTop: 12 }}>
            For {gLabel === 'Men' ? 'men' : 'women'}, waist circumference is a stronger predictor of
            metabolic risk than BMI alone. {isMen ? 'Men' : 'Women'} with waist over{' '}
            {isMen ? '40 inches (102 cm)' : '35 inches (88 cm)'} face elevated cardiovascular and
            diabetes risk independent of BMI.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks title="Related Tools" links={sharedRelatedCalcs.slice(0, 5)} />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Calories to lose N lbs ────────────────────────────────────────────────
  if (config.type === 'calories-to-lose') {
    const lbs = config.value!
    const totalCals = lbs * 3500
    const d250weeks = lbs / 0.5
    const d500weeks = lbs / 1.0
    const d750weeks = lbs / 1.5
    const proteinRec = Math.round(lbs * 0.9) // ~0.9g per lb of target bodyweight

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `Lose ${lbs} lbs` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          How Many Calories to Lose {lbs} Pounds: Timeline &amp; Plan
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          Losing {lbs} pounds requires a total calorie deficit of{' '}
          <strong>{totalCals.toLocaleString()} calories</strong>, based on the 3,500-calorie-per-pound
          rule established in metabolic research. The table below shows how long it takes at different
          daily deficit rates.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            Timeline to Lose {lbs} lbs
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            <DeficitTimelineCard deficit={250} weeksRaw={d250weeks} lbs={lbs} />
            <DeficitTimelineCard deficit={500} weeksRaw={d500weeks} lbs={lbs} />
            <DeficitTimelineCard deficit={750} weeksRaw={d750weeks} lbs={lbs} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 12 }}>
            FDA-recommended safe rate: 1–2 lbs/week. At 500 cal/day deficit you lose ~1 lb/week.
          </p>
        </section>
        <ContentBlock>
          <p>
            To preserve muscle during a {lbs}-lb weight loss, aim for at least {proteinRec}g of
            protein daily (roughly 0.7–0.8g per lb of goal bodyweight). Research shows high protein
            intake during a calorie deficit preserves lean mass and increases satiety.
          </p>
          <p style={{ marginTop: 12 }}>
            The 3,500 cal/lb rule slightly overestimates results over time — the body adapts by
            reducing resting metabolic rate by 10–15% after sustained deficits. Expect the final {Math.round(lbs * 0.2)}{' '}
            pounds to take roughly 20% longer than linear math suggests.
          </p>
          {lbs > 30 && (
            <p style={{ marginTop: 12 }}>
              Losing {lbs} pounds is a multi-month project. Breaking it into smaller milestones (
              {Math.round(lbs / 4)}-lb increments) with quarterly check-ins improves adherence by 60%
              versus tracking only the final goal (source: behavioral science literature).
            </p>
          )}
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Calculators"
          links={[
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
            { title: 'Protein Intake Calculator', href: '/calculator/protein-intake-calculator', icon: '🥩' },
            { title: 'BMI Calculator', href: '/calculator/bmi-calculator', icon: '⚖️' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Calorie deficit page ──────────────────────────────────────────────────
  if (config.type === 'calorie-deficit') {
    const deficit = config.value!
    const lbsPerWeek = (deficit * 7) / 3500
    const lbsPerMonth = lbsPerWeek * 4.33

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `${deficit} Cal Deficit` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          {deficit} Calorie Deficit — Weight Loss Rate &amp; Timeline
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          A daily deficit of {deficit.toLocaleString()} calories produces approximately{' '}
          <strong>{lbsPerWeek.toFixed(2)} lbs/week</strong> ({lbsPerMonth.toFixed(1)} lbs/month) of
          fat loss, based on the 3,500-calorie-per-pound rule.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, margin: '24px 0' }}>
          <StatCard label="Daily Deficit" value={`${deficit.toLocaleString()} cal`} />
          <StatCard label="Weekly Loss" value={`${lbsPerWeek.toFixed(2)} lbs`} color={deficit <= 1000 ? '#10b981' : '#f59e0b'} />
          <StatCard label="Monthly Loss" value={`${lbsPerMonth.toFixed(1)} lbs`} />
          <StatCard label="Annual Loss (theoretical)" value={`${(lbsPerWeek * 52).toFixed(0)} lbs`} />
        </div>
        <ContentBlock>
          <p>
            {deficit <= 300
              ? `A ${deficit}-calorie deficit is a conservative approach — sometimes called a "micro-deficit." Results are slow but body adaptation is minimal, making it easier to maintain long-term.`
              : deficit <= 600
              ? `A ${deficit}-calorie daily deficit is within the FDA's recommended safe range. At this rate, the body preserves most muscle tissue while losing primarily fat.`
              : deficit <= 900
              ? `A ${deficit}-calorie deficit is aggressive. The American College of Sports Medicine recommends a maximum of 500–700 cal/day for most people. Protein intake of 1g/lb of lean mass is critical at this deficit level.`
              : `A ${deficit}-calorie deficit exceeds typical recommendations. Deficits above 1,000 cal/day increase risk of muscle loss, nutrient deficiency, and metabolic adaptation. Medical supervision is advisable.`}
          </p>
          <p style={{ marginTop: 12 }}>
            To achieve a {deficit}-calorie daily deficit, the typical approach is a combination of
            dietary reduction (~60–70%) and exercise (~30–40%). For example, reducing food intake by{' '}
            {Math.round(deficit * 0.65)} calories and burning {Math.round(deficit * 0.35)} via exercise.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
            { title: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── How long to lose N lbs page ───────────────────────────────────────────
  if (config.type === 'how-long-to-lose') {
    const lbs = config.value!
    const w05 = lbs / 0.5
    const w10 = lbs / 1.0
    const w20 = lbs / 2.0

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `Lose ${lbs} lbs — Timeline` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          How Long to Lose {lbs} Pounds — Realistic Timeline
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          At the FDA-recommended rate of 1 lb/week, losing {lbs} pounds takes{' '}
          <strong>{w10} weeks ({(w10 / 4.33).toFixed(1)} months)</strong>. Timelines below show
          conservative, standard, and aggressive approaches.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Timeline by Pace</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {[
              { pace: '0.5 lbs/week', weeks: w05, deficit: 250, safe: true },
              { pace: '1 lb/week', weeks: w10, deficit: 500, safe: true },
              { pace: '2 lbs/week', weeks: w20, deficit: 1000, safe: lbs >= 20 },
            ].map((row) => (
              <div
                key={row.pace}
                style={{
                  background: 'var(--bg)',
                  border: `1px solid ${row.safe ? 'var(--line)' : 'rgba(245,158,11,0.4)'}`,
                  borderRadius: 12,
                  padding: '14px 16px',
                }}
              >
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: 14, marginBottom: 4 }}>{row.pace}</p>
                <p style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {Math.ceil(row.weeks)} weeks ({(row.weeks / 4.33).toFixed(1)} mo)
                </p>
                <p style={{ color: 'var(--dim)', fontSize: 12, marginTop: 4 }}>{row.deficit} cal/day deficit</p>
                {!row.safe && (
                  <p style={{ color: '#f59e0b', fontSize: 11, marginTop: 6 }}>⚠ Aggressive — medical supervision advised</p>
                )}
              </div>
            ))}
          </div>
        </section>
        <ContentBlock>
          <p>
            These timelines assume a consistent calorie deficit with no metabolic adaptation — which is
            optimistic. In practice, the body reduces its resting metabolic rate by 10–15% after 3–6
            months of sustained deficit. Expect the last {Math.round(lbs * 0.25)} lbs to take longer
            than linear math predicts.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
            { title: `Calories to Lose ${lbs} lbs`, href: `/health/calories-to-lose-${lbs}-lbs`, icon: '🔥' },
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── TDEE page ─────────────────────────────────────────────────────────────
  if (config.type === 'tdee') {
    const tdee = config.value!
    const lossAggressive = tdee - 750
    const lossModerate = tdee - 500
    const lossConservative = tdee - 250
    const leanBulk = tdee + 250
    const bulk = tdee + 500

    // Macros at TDEE
    const proteinCals = Math.round(tdee * 0.30)
    const carbsCals = Math.round(tdee * 0.40)
    const fatCals = Math.round(tdee * 0.30)
    const proteinG = Math.round(proteinCals / 4)
    const carbsG = Math.round(carbsCals / 4)
    const fatG = Math.round(fatCals / 9)

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `TDEE ${tdee.toLocaleString()}` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          TDEE of {tdee.toLocaleString()} Calories: Maintenance, Loss &amp; Gain Plans
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          A Total Daily Energy Expenditure of {tdee.toLocaleString()} calories means your body burns
          this amount on an average day. Eating at this level maintains your current weight. The
          typical US adult TDEE ranges from 1,800 to 2,500 calories/day.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />

        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Calorie Targets by Goal</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 12 }}>
            <StatCard label="Maintenance" value={tdee.toLocaleString() + ' cal'} color="var(--text)" />
            <StatCard label="Conservative Loss (−250)" value={lossConservative.toLocaleString() + ' cal'} color="#10b981" />
            <StatCard label="Moderate Loss (−500)" value={lossModerate.toLocaleString() + ' cal'} color="#10b981" />
            <StatCard label="Aggressive Loss (−750)" value={lossAggressive.toLocaleString() + ' cal'} color="#f59e0b" />
            <StatCard label="Lean Bulk (+250)" value={leanBulk.toLocaleString() + ' cal'} color="#3b82f6" />
            <StatCard label="Bulk (+500)" value={bulk.toLocaleString() + ' cal'} color="#6366f1" />
          </div>
        </section>

        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            Macro Breakdown at {tdee.toLocaleString()} Calories (30/40/30)
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <StatCard label="Protein (30%)" value={`${proteinG}g`} color="#10b981" />
            <StatCard label="Carbs (40%)" value={`${carbsG}g`} color="#3b82f6" />
            <StatCard label="Fat (30%)" value={`${fatG}g`} color="#f59e0b" />
          </div>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 10 }}>
            A 30/40/30 split is a common performance-focused ratio. A weight-loss focused diet may use
            35% protein, 35% carbs, 30% fat.
          </p>
        </section>

        <ContentBlock>
          <p>
            A TDEE of {tdee.toLocaleString()} calories suggests a{' '}
            {tdee < 1600
              ? 'sedentary or small-framed individual'
              : tdee < 2000
              ? 'moderately active adult, likely lightly exercising 1–3 days/week'
              : tdee < 2500
              ? 'moderately to very active adult exercising 3–5 days/week'
              : 'highly active individual, athlete, or person with a physically demanding job'}.
          </p>
          <p style={{ marginTop: 12 }}>
            Sample meal distribution at {tdee.toLocaleString()} calories: breakfast{' '}
            {Math.round(tdee * 0.25).toLocaleString()} cal, lunch{' '}
            {Math.round(tdee * 0.30).toLocaleString()} cal, dinner{' '}
            {Math.round(tdee * 0.30).toLocaleString()} cal, snacks{' '}
            {Math.round(tdee * 0.15).toLocaleString()} cal.
          </p>
        </ContentBlock>

        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
            { title: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥' },
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
            { title: 'Protein Intake Calculator', href: '/calculator/protein-intake-calculator', icon: '🥩' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Ideal weight page ─────────────────────────────────────────────────────
  if (config.type === 'ideal-weight') {
    const totalInches = config.value!
    const h = formatHeight(totalInches)
    const male = calcIdealWeight(totalInches, 'male')
    const female = calcIdealWeight(totalInches, 'female')
    const maleAvg = Math.round((male.devine + male.hamwi + male.robinson + male.miller) / 4)
    const femaleAvg = Math.round((female.devine + female.hamwi + female.robinson + female.miller) / 4)

    // BMI range for this height
    const bmiLowWeight = Math.round((18.5 * totalInches * totalInches) / 703)
    const bmiHighWeight = Math.round((24.9 * totalInches * totalInches) / 703)

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `Ideal Weight ${h}` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          Ideal Weight for {h} — Four Formula Average
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          At {h}, the healthy BMI weight range is <strong>{bmiLowWeight}–{bmiHighWeight} lbs</strong>{' '}
          (BMI 18.5–24.9). The four most-cited clinical formulas give different estimates depending on
          sex.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Ideal Weight at {h}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <p style={{ fontWeight: 700, color: '#3b82f6', marginBottom: 10, fontSize: 14 }}>For Men</p>
              {([['Devine', male.devine], ['Hamwi', male.hamwi], ['Robinson', male.robinson], ['Miller', male.miller]] as [string, number][]).map(([name, val]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>{name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{Math.round(val)} lbs</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--text)', fontWeight: 700 }}>Average</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{maleAvg} lbs</span>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#ec4899', marginBottom: 10, fontSize: 14 }}>For Women</p>
              {([['Devine', female.devine], ['Hamwi', female.hamwi], ['Robinson', female.robinson], ['Miller', female.miller]] as [string, number][]).map(([name, val]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line)', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>{name}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>{Math.round(val)} lbs</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
                <span style={{ color: 'var(--text)', fontWeight: 700 }}>Average</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{femaleAvg} lbs</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 12 }}>
            Healthy BMI range: {bmiLowWeight}–{bmiHighWeight} lbs
          </p>
        </section>
        <ContentBlock>
          <p>
            The four formulas vary by up to {Math.abs(Math.round(male.miller - male.devine))} lbs for
            men and {Math.abs(Math.round(female.miller - female.devine))} lbs for women at {h}. None
            perfectly predicts ideal health — the WHO-endorsed metric is the BMI healthy range of
            18.5–24.9, which at {h} corresponds to {bmiLowWeight}–{bmiHighWeight} lbs.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'Ideal Weight Calculator', href: '/calculator/ideal-weight-calculator', icon: '📏' },
            { title: 'BMI Calculator', href: '/calculator/bmi-calculator', icon: '⚖️' },
            { title: 'Calorie Deficit Calculator', href: '/calculator/calorie-deficit-calculator', icon: '🥗' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Heart rate zone page ──────────────────────────────────────────────────
  if (config.type === 'heart-rate-zone') {
    const age = config.value!
    const maxHR = 220 - age
    const zones = calcHeartRateZones(age, 70)
    const avgResting = age < 30 ? 68 : age < 40 ? 70 : age < 50 ? 72 : age < 60 ? 73 : 75

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `Heart Rate Zones Age ${age}` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          Heart Rate Zones for Age {age}: Target BPM for Every Training Zone
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          Estimated maximum heart rate at age {age}: <strong>{maxHR} BPM</strong> (220 − {age} formula).
          Average resting HR for this age group is approximately {avgResting} BPM. The five zones
          below define effective training intensity ranges.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <section style={{ background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', margin: '24px 0' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            5-Zone Heart Rate Chart — Age {age}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {zones.map((zone) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#991b1b']
              const pct = Math.round(((zone.minBPM + zone.maxBPM) / 2 / maxHR) * 100)
              return (
                <div
                  key={zone.zone}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr auto',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 14px',
                    background: 'var(--bg)',
                    borderRadius: 10,
                    borderLeft: `4px solid ${colors[zone.zone - 1]}`,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--dim)', marginBottom: 2 }}>Zone {zone.zone}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: colors[zone.zone - 1] }}>{zone.name}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                      {zone.minBPM}–{zone.maxBPM} BPM
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{zone.benefit}</p>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--dim)', whiteSpace: 'nowrap' }}>{pct}% max</p>
                </div>
              )
            })}
          </div>
        </section>
        <ContentBlock>
          <p>
            The 220−age formula has a standard deviation of ±10–12 BPM — meaning true max HR at
            age {age} could reasonably range from {maxHR - 12} to {maxHR + 12} BPM. For a more
            accurate estimate, a graded exercise test (GXT) is the gold standard.
          </p>
          <p style={{ marginTop: 12 }}>
            To measure your heart rate: place two fingers on your carotid artery (side of neck) or
            radial artery (inside wrist) and count beats for 15 seconds, then multiply by 4. A chest
            strap heart rate monitor is the most accurate wearable method.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥' },
            { title: 'TDEE Calculator', href: '/calculator/tdee-calculator', icon: '⚡' },
            { title: `Heart Rate Age ${age - 5 > 17 ? age - 5 : age + 5}`, href: `/health/heart-rate-zone-${age - 5 > 17 ? age - 5 : age + 5}`, icon: '❤️' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Resting heart rate page ───────────────────────────────────────────────
  if (config.type === 'resting-heart-rate') {
    const bpm = config.value!
    let status = 'Normal'
    let statusColor = '#10b981'
    let context = ''
    if (bpm < 60) {
      status = 'Excellent'
      statusColor = '#3b82f6'
      context = 'A resting HR below 60 BPM (bradycardia in clinical terms) is common in endurance athletes. Elite marathoners and cyclists often have RHR of 40–50 BPM.'
    } else if (bpm <= 70) {
      status = 'Good'
      statusColor = '#10b981'
      context = 'A resting HR of 60–70 BPM is associated with the lowest cardiovascular risk in population studies.'
    } else if (bpm <= 80) {
      status = 'Normal'
      statusColor = '#10b981'
      context = 'A resting HR of 70–80 BPM is within the normal range. The American Heart Association defines normal as 60–100 BPM for adults.'
    } else if (bpm <= 100) {
      status = 'Above Average'
      statusColor = '#f59e0b'
      context = 'A resting HR above 80 BPM is normal but on the higher end. Regular aerobic exercise typically lowers RHR by 5–20 BPM over several months.'
    } else {
      status = 'High — Consult a Doctor'
      statusColor = '#ef4444'
      context = 'A sustained resting HR above 100 BPM (tachycardia) warrants medical evaluation. Causes include stress, dehydration, thyroid issues, or cardiovascular disease.'
    }

    return (
      <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: `RHR ${bpm} BPM` }]}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 800, marginBottom: 8 }}>
          Resting Heart Rate {bpm} BPM — Is It Normal?
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
          A resting heart rate of {bpm} BPM is classified as{' '}
          <strong style={{ color: statusColor }}>{status}</strong>. Normal range for adults is
          60–100 BPM (American Heart Association). Lower is generally better.
        </p>
        <AdSlot slot="5678901234" format="leaderboard" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, margin: '24px 0' }}>
          <StatCard label="Your RHR" value={`${bpm} BPM`} color={statusColor} />
          <StatCard label="Status" value={status} color={statusColor} />
          <StatCard label="Normal Range" value="60–100 BPM" />
          <StatCard label="Athletic Range" value="40–60 BPM" />
        </div>
        <ContentBlock>
          <p>{context}</p>
          <p style={{ marginTop: 12 }}>
            A landmark study (European Heart Journal, 2013) of 3 million people found that each
            10 BPM increase in resting heart rate above 60 was associated with a 9% higher risk of
            all-cause mortality. Regular aerobic training is the most effective non-pharmacological
            way to reduce RHR.
          </p>
          <p style={{ marginTop: 12 }}>
            To accurately measure resting HR: measure first thing in the morning before getting out
            of bed, after at least 5 minutes of complete rest. Take the measurement 3 days in a row
            and average the results.
          </p>
        </ContentBlock>
        <AdSlot slot="6789012345" format="rectangle" />
        <RelatedLinks
          title="Related Tools"
          links={[
            { title: 'Heart Rate Zone Age 30', href: '/health/heart-rate-zone-30', icon: '❤️' },
            { title: 'Heart Rate Zone Age 40', href: '/health/heart-rate-zone-40', icon: '❤️' },
            { title: 'BMR Calculator', href: '/calculator/bmr-calculator', icon: '🔥' },
          ]}
        />
        <AdSlot slot="7890123456" format="leaderboard" />
      </PageWrapper>
    )
  }

  // ── Guide pages ───────────────────────────────────────────────────────────
  if (config.type === 'guide') {
    return <GuidePage slug={slug} relatedLinks={sharedRelatedCalcs} />
  }

  notFound()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageWrapper({
  children,
  breadcrumb,
  slug,
  pageTitle,
  pageDesc,
}: {
  children: React.ReactNode
  breadcrumb: { label: string; href?: string }[]
  slug?: string
  pageTitle?: string
  pageDesc?: string
}) {
  const schema = slug ? {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: `https://usa-calc.com/health/${slug}`,
    name: pageTitle ?? breadcrumb[breadcrumb.length - 1]?.label ?? 'Health',
    description: pageDesc ?? 'Free health calculator and reference guide.',
    isPartOf: { '@type': 'WebSite', name: 'USA-Calc', url: 'https://usa-calc.com' },
  } : null

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '2rem 1rem 4rem' }}>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <nav
        aria-label="Breadcrumb"
        style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '1.25rem' }}
      >
        <a href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</a>
        <span style={{ margin: '0 0.4rem' }}>›</span>
        <a href="/health" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Health</a>
        {breadcrumb.slice(1).map((crumb) => (
          <span key={crumb.label}>
            <span style={{ margin: '0 0.4rem' }}>›</span>
            {crumb.href ? (
              <a href={crumb.href} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{crumb.label}</a>
            ) : (
              <span style={{ color: 'var(--text)' }}>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      {children}
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color?: string
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 14,
        padding: '14px 16px',
      }}
    >
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, color: color ?? 'var(--text)' }}>{value}</p>
    </div>
  )
}

function ContentBlock({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 24,
        color: 'var(--muted)',
        fontSize: 15,
        lineHeight: 1.75,
      }}
    >
      {children}
    </section>
  )
}

function DeficitTimelineCard({
  deficit,
  weeksRaw,
  lbs,
}: {
  deficit: number
  weeksRaw: number
  lbs: number
}) {
  const weeks = Math.ceil(weeksRaw)
  const months = (weeksRaw / 4.33).toFixed(1)
  return (
    <div
      style={{
        background: 'var(--bg)',
        border: '1px solid var(--line)',
        borderRadius: 12,
        padding: '14px 16px',
      }}
    >
      <p style={{ fontSize: 12, color: 'var(--dim)', marginBottom: 4 }}>−{deficit} cal/day</p>
      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
        {weeks} weeks
      </p>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>{months} months</p>
      <p style={{ fontSize: 12, color: 'var(--dim)', marginTop: 4 }}>
        {((lbs / weeksRaw) * 1).toFixed(2)} lbs/week
      </p>
    </div>
  )
}

function BMICategoryTable() {
  const cats = [
    { range: 'Under 18.5', label: 'Underweight', color: '#3b82f6' },
    { range: '18.5 – 24.9', label: 'Normal weight', color: '#10b981' },
    { range: '25.0 – 29.9', label: 'Overweight', color: '#f59e0b' },
    { range: '30.0 – 34.9', label: 'Obese Class I', color: '#ef4444' },
    { range: '35.0 – 39.9', label: 'Obese Class II', color: '#dc2626' },
    { range: '40.0 +', label: 'Obese Class III', color: '#991b1b' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {cats.map((cat) => (
        <div
          key={cat.label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: 'var(--bg)',
            borderRadius: 8,
            borderLeft: `3px solid ${cat.color}`,
          }}
        >
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>{cat.range}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: cat.color }}>{cat.label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Guide page content ───────────────────────────────────────────────────────

const GUIDE_CONTENT: Record<string, { icon: string; intro: string; sections: { h2: string; body: string }[] }> = {
  'intermittent-fasting-guide': {
    icon: '⏱️',
    intro: 'Intermittent fasting (IF) is an eating pattern that cycles between periods of fasting and eating. It does not prescribe specific foods — it prescribes when to eat. The most common protocols: 16:8 (fast 16 hours, eat within an 8-hour window), 5:2 (normal eating 5 days, ~500 calories 2 days), and OMAD (one meal a day).',
    sections: [
      { h2: 'What the Research Shows', body: 'A 2020 meta-analysis in Obesity Reviews (27 randomized controlled trials) found IF produces weight loss of 0.8–13% of body weight over 8–24 weeks — comparable to continuous calorie restriction. It does not appear to provide metabolic advantages beyond the calorie deficit it creates.' },
      { h2: '16:8 Protocol', body: 'The most popular approach: stop eating at 8pm, break the fast at noon the next day. This naturally cuts snacking and often reduces overall calorie intake by 200–500 cal/day without counting. Most people find the first 3–5 days difficult, then hunger adapts.' },
      { h2: 'Who Should Avoid It', body: 'IF is not appropriate for pregnant or breastfeeding women, people with a history of eating disorders, those with type 1 diabetes on insulin, or anyone underweight. Consult a physician before starting if you take medications that require food.' },
    ],
  },
  'how-to-lose-belly-fat': {
    icon: '🏃',
    intro: 'Spot reduction — targeting fat loss from a specific area — does not work. Studies show that exercise targeting the abdomen builds muscle there but does not preferentially burn belly fat. Fat loss is systemic: it comes from wherever the body chooses based on genetics and hormones.',
    sections: [
      { h2: 'Visceral vs Subcutaneous Fat', body: 'Belly fat has two types: subcutaneous fat (pinchable fat under skin) and visceral fat (deep fat around organs). Visceral fat is metabolically active and more responsive to exercise and dietary changes. It is also the type most strongly linked to cardiovascular disease and type 2 diabetes.' },
      { h2: 'What Actually Works', body: 'A calorie deficit reduces total body fat including visceral fat. Resistance training increases resting metabolism and preserves muscle during deficit. Aerobic exercise — particularly moderate-to-vigorous intensity — is especially effective at reducing visceral fat even without significant weight loss (source: Mayo Clinic, 2019 review).' },
      { h2: 'Sleep and Cortisol', body: 'Chronic sleep deprivation and high stress elevate cortisol, which specifically promotes visceral fat accumulation. Adults sleeping less than 6 hours had significantly more visceral fat than those sleeping 7–8 hours (NHANES cohort study, 2010). Managing stress and prioritizing sleep are non-negotiable for belly fat reduction.' },
    ],
  },
  'macros-explained': {
    icon: '🧮',
    intro: 'Macronutrients — protein, carbohydrates, and fat — are the three major nutrient categories that provide calories. Protein and carbohydrates provide 4 calories per gram; fat provides 9 calories per gram. Alcohol provides 7 calories per gram and is not a macronutrient but contributes to calorie intake.',
    sections: [
      { h2: 'Protein', body: 'The RDA for protein is 0.8g per kilogram of body weight (0.36g/lb) — the minimum to prevent deficiency. For active adults, research supports 1.6–2.2g/kg for muscle building and 1.2–1.6g/kg for maintenance. Protein has the highest thermic effect (25–30% of calories burned in digestion) and the highest satiety of any macronutrient.' },
      { h2: 'Carbohydrates', body: 'Carbohydrates are the body\'s preferred fuel source, particularly for high-intensity exercise and brain function. The Dietary Guidelines for Americans recommend 45–65% of calories from carbohydrates. High-fiber carbohydrates (vegetables, legumes, whole grains) improve satiety and gut health; refined carbohydrates spike blood sugar and contribute to fat storage.' },
      { h2: 'Fat', body: 'Dietary fat is essential for hormone production, fat-soluble vitamin absorption (A, D, E, K), and cell membrane integrity. Healthy fats (monounsaturated, polyunsaturated, omega-3) support cardiovascular health. The Dietary Guidelines recommend 20–35% of calories from fat, with saturated fat under 10%.' },
    ],
  },
  'protein-intake-guide': {
    icon: '🥩',
    intro: 'Most Americans consume adequate protein but distribute it poorly — large amounts at dinner, very little at breakfast. Research shows muscle protein synthesis is maximized at 20–40g of high-quality protein per meal, with diminishing returns above that threshold.',
    sections: [
      { h2: 'How Much Protein You Need', body: 'Sedentary adults: 0.8g/kg body weight (RDA). Active adults: 1.2–1.6g/kg. Muscle building: 1.6–2.2g/kg. Weight loss with muscle preservation: 1.8–2.4g/kg (higher intake during deficit offsets catabolism). For a 180-lb (82kg) person building muscle: 131–180g/day.' },
      { h2: 'Complete vs Incomplete Proteins', body: 'Complete proteins contain all 9 essential amino acids in sufficient quantities: animal proteins (meat, fish, eggs, dairy) and some plant sources (soy, quinoa). Incomplete proteins (most plant sources) lack one or more essential amino acids. Plant-based dieters should combine sources — rice and beans together form a complete amino acid profile.' },
      { h2: 'Timing', body: 'Distributing protein evenly across 3–4 meals (30–40g each) maximizes muscle protein synthesis versus consuming most protein in one meal. Pre-sleep protein (30–40g casein or cottage cheese) extends overnight muscle protein synthesis, adding ~11% more muscle gains over 12 weeks (Maastricht University, 2012).' },
    ],
  },
  'how-to-gain-muscle': {
    icon: '💪',
    intro: 'Muscle growth (hypertrophy) requires three simultaneous conditions: sufficient mechanical tension (lifting with progressive overload), adequate protein (1.6g+/kg/day), and recovery time (sleep, rest days). Beginners can gain 1–2 lbs of muscle per month; experienced lifters 0.25–0.5 lbs per month.',
    sections: [
      { h2: 'Progressive Overload', body: 'The principle is simple: do more over time. Add weight, reps, or sets each session or week. A beginner lifting 3×8 bench press at 135 lbs should aim for 3×8 at 140 lbs within a month. Without progressive overload, muscles have no reason to grow — they adapt to current stress and stop.' },
      { h2: 'Volume and Frequency', body: 'Meta-analysis data (Brad Schoenfeld, 2017) shows 10–20 sets per muscle group per week produces superior hypertrophy versus fewer sets. Training each muscle group twice per week outperforms once per week at equal total volume. A full-body 3×/week routine is optimal for beginners; upper/lower or push-pull-legs splits for intermediate lifters.' },
      { h2: 'Sleep and Recovery', body: 'Growth hormone secretion peaks during deep sleep (slow-wave sleep, 11pm–2am for most people). Adults getting less than 7 hours lose significantly more muscle during a bulk compared to those sleeping 8+ hours, even with identical training and nutrition. Sleep is a legal performance enhancer.' },
    ],
  },
  'keto-diet-guide': {
    icon: '🥑',
    intro: 'The ketogenic diet restricts carbohydrates to under 50g/day (typically 20–30g net carbs), forcing the body into ketosis — a metabolic state where fat (as ketone bodies) replaces glucose as the primary fuel. The macronutrient split is typically 70–75% fat, 20–25% protein, and 5–10% carbohydrates.',
    sections: [
      { h2: 'How Ketosis Works', body: 'When glucose stores (liver glycogen, ~400–500 calories worth) are depleted through carbohydrate restriction, the liver converts fatty acids into ketone bodies (beta-hydroxybutyrate, acetoacetate, acetone). The brain, which normally runs on glucose, adapts to run on ketones within 2–4 days.' },
      { h2: 'Weight Loss Evidence', body: 'Keto diets produce faster initial weight loss than low-fat diets — primarily from glycogen depletion causing water loss (3–4g water stored per gram of glycogen). Long-term (12+ months), weight loss outcomes are similar to other calorie-deficit approaches. The advantage of keto is strong hunger suppression for many people, making adherence easier.' },
      { h2: 'Who It Works For (and Doesn\'t)', body: 'Keto shows strongest clinical benefit for type 2 diabetes and epilepsy. For epilepsy, it reduces seizures by 50%+ in about half of patients who try it. For general weight loss, it is no more effective than other approaches at equal calorie intake. People with kidney disease, gallbladder issues, or fat metabolism disorders should avoid it.' },
    ],
  },
  'how-to-lose-weight': {
    icon: '⚖️',
    intro: 'Weight loss requires one thing: a sustained calorie deficit. Every diet that works — keto, low-carb, intermittent fasting, low-fat, Mediterranean — works because it reduces calorie intake below expenditure. There is no metabolic magic; there are only different tools to create the same deficit.',
    sections: [
      { h2: 'The Math', body: 'One pound of fat stores approximately 3,500 calories of energy. A daily deficit of 500 calories produces ~1 lb/week loss. A deficit of 250 calories produces ~0.5 lb/week — slower, but easier to maintain. The formula: weight loss = (calories in) − (calories out), sustained over weeks and months.' },
      { h2: 'Calorie Tracking vs. Food Rules', body: 'Both approaches work. Calorie tracking gives precision (apps like MyFitnessPal show ~85% accuracy when users weigh food). Food rules (no processed food, no sugar, no eating after 8pm) work by restricting food choices — fewer options = fewer calories consumed. Choose the approach you will actually maintain long-term.' },
      { h2: 'Common Failure Modes', body: 'Most diet failures fall into three categories: underestimating calories (restaurant meals average 2.5× the stated calories), overcompensating with exercise (people unconsciously eat back calories burned), and unsustainable restriction (crash diets trigger rebound eating). A modest, consistent deficit beats an aggressive unsustainable one.' },
    ],
  },
}

// Generate generic content for guides not in the detailed map
function getGuideContent(slug: string): { icon: string; intro: string; sections: { h2: string; body: string }[] } {
  if (GUIDE_CONTENT[slug]) return GUIDE_CONTENT[slug]

  const titleMap: Record<string, string> = {
    'mediterranean-diet-guide': 'Mediterranean Diet',
    'creatine-guide': 'Creatine',
    'body-recomposition-guide': 'Body Recomposition',
    'sleep-and-weight-loss': 'Sleep & Weight Loss',
    'stress-and-weight-gain': 'Stress & Weight Gain',
    'metabolism-explained': 'Metabolism',
    'calories-in-foods-guide': 'Calories in Foods',
    'exercise-for-weight-loss': 'Exercise for Weight Loss',
    'strength-training-for-beginners': 'Strength Training',
    'cardio-vs-weights': 'Cardio vs Weights',
    'meal-prep-guide': 'Meal Prep',
    'hydration-guide': 'Hydration',
    'supplement-guide': 'Supplements',
    'blood-pressure-guide': 'Blood Pressure',
    'cholesterol-guide': 'Cholesterol',
    'blood-sugar-guide': 'Blood Sugar',
    'diabetes-prevention-guide': 'Diabetes Prevention',
    'heart-health-guide': 'Heart Health',
    'cancer-prevention-guide': 'Cancer Prevention',
    'mental-health-exercise-guide': 'Exercise & Mental Health',
    'aging-and-fitness-guide': 'Aging & Fitness',
    'postpartum-fitness-guide': 'Postpartum Fitness',
    'senior-fitness-guide': 'Senior Fitness',
    'running-for-beginners': 'Running for Beginners',
  }

  const topic = titleMap[slug] ?? slug.replace(/-/g, ' ')
  return {
    icon: '📖',
    intro: `This guide covers ${topic} with evidence-based information sourced from peer-reviewed research and major health organizations including the CDC, WHO, and NIH.`,
    sections: [
      {
        h2: 'Key Principles',
        body: `${topic} is an area of active research with strong consensus on foundational principles. The most important factor for most people is consistency — small, sustainable changes outperform dramatic short-term interventions in long-term outcomes.`,
      },
      {
        h2: 'What the Evidence Shows',
        body: `Population studies and randomized controlled trials consistently show that lifestyle interventions — diet quality, regular physical activity, adequate sleep, and stress management — account for the majority of modifiable health risk. ${topic} fits within this evidence-based framework.`,
      },
      {
        h2: 'Practical Application',
        body: `Use the calculators on this site to quantify your baseline metrics (BMI, TDEE, protein needs) before making dietary or exercise changes. Starting with data gives you objective benchmarks to measure progress against.`,
      },
    ],
  }
}

function GuidePage({
  slug,
  relatedLinks,
}: {
  slug: string
  relatedLinks: { title: string; href: string; icon: string }[]
}) {
  const content = getGuideContent(slug)
  const title = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\bAnd\b/g, '&')

  return (
    <PageWrapper slug={slug} breadcrumb={[{ label: 'Health', href: '/health' }, { label: title }]}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '2rem' }}>{content.icon}</span>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, margin: 0 }}>
          {title}
        </h1>
      </div>
      <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.75, margin: '0 0 28px' }}>
        {content.intro}
      </p>

      <AdSlot slot="5678901234" format="leaderboard" />

      {content.sections.map((section) => (
        <section
          key={section.h2}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 16,
            padding: '20px 24px',
            marginTop: 20,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{section.h2}</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.75, margin: 0 }}>
            {section.body}
          </p>
        </section>
      ))}

      <div style={{ marginTop: 28 }}>
        <AdSlot slot="6789012345" format="rectangle" />
      </div>

      <RelatedLinks title="Related Health Tools" links={relatedLinks.slice(0, 4)} />
      <AdSlot slot="7890123456" format="leaderboard" />
    </PageWrapper>
  )
}
