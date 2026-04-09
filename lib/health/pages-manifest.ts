// ─── Slug helpers ───────────────────────────────────────────────────────────

function bmiSlug(value: number): string {
  // 27.5 → bmi-27-5, 32 → bmi-32
  return `bmi-${value.toString().replace('.', '-')}`
}

function heightSlug(totalInches: number): string {
  const ft = Math.floor(totalInches / 12)
  const inch = totalInches % 12
  return `ideal-weight-${ft}ft${inch}`
}

// ─── BMI pages: 14.0 → 50.0 in 0.5 steps ───────────────────────────────────
function generateBMISlugs(): string[] {
  const slugs: string[] = []
  for (let v = 14.0; v <= 50.0; v = Math.round((v + 0.5) * 10) / 10) {
    slugs.push(bmiSlug(v))
  }
  return slugs
}

// ─── BMI for age pages: ages 18-80 ─────────────────────────────────────────
function generateBMIAgeSlugs(): string[] {
  const slugs: string[] = []
  for (let age = 18; age <= 80; age++) {
    slugs.push(`bmi-for-age-${age}`)
  }
  return slugs
}

// ─── Weight loss pages ──────────────────────────────────────────────────────
const WEIGHT_LOSS_LBS = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 100]

function generateCaloriesToLoseSlugs(): string[] {
  return WEIGHT_LOSS_LBS.map((lbs) => `calories-to-lose-${lbs}-lbs`)
}

function generateHowLongSlugs(): string[] {
  return WEIGHT_LOSS_LBS.map((lbs) => `how-long-to-lose-${lbs}-lbs`)
}

// ─── Calorie deficit pages ───────────────────────────────────────────────────
const DEFICIT_CALS = [100, 200, 300, 400, 500, 600, 700, 800, 1000]

function generateCalorieDeficitSlugs(): string[] {
  return DEFICIT_CALS.map((cal) => `calorie-deficit-${cal}`)
}

// ─── TDEE pages ─────────────────────────────────────────────────────────────
const TDEE_CALS = [1400, 1500, 1600, 1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2800, 3000, 3200, 3500]

function generateTDEESlugs(): string[] {
  return TDEE_CALS.map((cal) => `tdee-${cal}`)
}

// ─── Ideal weight pages: 4ft10 to 6ft8 (58–80 inches) ──────────────────────
function generateIdealWeightSlugs(): string[] {
  const slugs: string[] = []
  for (let inches = 58; inches <= 80; inches++) {
    slugs.push(heightSlug(inches))
  }
  return slugs
}

// ─── Heart rate zone pages: ages 18-80 ──────────────────────────────────────
function generateHeartRateZoneSlugs(): string[] {
  const slugs: string[] = []
  for (let age = 18; age <= 80; age++) {
    slugs.push(`heart-rate-zone-${age}`)
  }
  return slugs
}

// ─── Resting heart rate pages ───────────────────────────────────────────────
const RESTING_HR_BPMS = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

function generateRestingHRSlugs(): string[] {
  return RESTING_HR_BPMS.map((bpm) => `resting-heart-rate-${bpm}`)
}

// ─── Guide pages ─────────────────────────────────────────────────────────────
const GUIDE_SLUGS = [
  'intermittent-fasting-guide',
  'keto-diet-guide',
  'mediterranean-diet-guide',
  'macros-explained',
  'protein-intake-guide',
  'creatine-guide',
  'how-to-lose-belly-fat',
  'how-to-gain-muscle',
  'body-recomposition-guide',
  'sleep-and-weight-loss',
  'stress-and-weight-gain',
  'metabolism-explained',
  'calories-in-foods-guide',
  'exercise-for-weight-loss',
  'strength-training-for-beginners',
  'cardio-vs-weights',
  'meal-prep-guide',
  'hydration-guide',
  'supplement-guide',
  'blood-pressure-guide',
  'cholesterol-guide',
  'blood-sugar-guide',
  'diabetes-prevention-guide',
  'heart-health-guide',
  'cancer-prevention-guide',
  'mental-health-exercise-guide',
  'aging-and-fitness-guide',
  'postpartum-fitness-guide',
  'senior-fitness-guide',
  'running-for-beginners',
]

// ─── Special calculator page slugs ──────────────────────────────────────────
const SPECIAL_SLUGS = ['bmi-calculator-men', 'bmi-calculator-women', 'how-to-lose-weight']

// ─── Full list ───────────────────────────────────────────────────────────────
export const HEALTH_PAGE_SLUGS: string[] = [
  ...generateBMISlugs(),
  ...generateBMIAgeSlugs(),
  'bmi-calculator-men',
  'bmi-calculator-women',
  ...generateCaloriesToLoseSlugs(),
  ...generateCalorieDeficitSlugs(),
  ...generateHowLongSlugs(),
  ...generateTDEESlugs(),
  ...generateIdealWeightSlugs(),
  ...generateHeartRateZoneSlugs(),
  ...generateRestingHRSlugs(),
  ...GUIDE_SLUGS,
  'how-to-lose-weight',
]

// ─── Page config types ────────────────────────────────────────────────────────

export type HealthPageType =
  | 'bmi'
  | 'bmi-for-age'
  | 'bmi-calculator-gender'
  | 'calories-to-lose'
  | 'calorie-deficit'
  | 'how-long-to-lose'
  | 'tdee'
  | 'ideal-weight'
  | 'heart-rate-zone'
  | 'resting-heart-rate'
  | 'guide'

export interface HealthPageConfig {
  type: HealthPageType
  slug: string
  /** Parsed numeric value relevant to the page (BMI, calories, age, etc.) */
  value?: number
  /** Second numeric param if needed */
  value2?: number
  /** String variant (e.g., gender) */
  variant?: string
}

// ─── Parser ───────────────────────────────────────────────────────────────────

export function parseHealthSlug(slug: string): HealthPageConfig | null {
  // bmi-27-5 or bmi-32
  const bmiMatch = slug.match(/^bmi-([\d]+(?:-[\d]+)?)$/)
  if (bmiMatch && !slug.startsWith('bmi-for-age') && !slug.startsWith('bmi-calculator')) {
    const raw = bmiMatch[1].replace('-', '.')
    const value = parseFloat(raw)
    if (!isNaN(value) && value >= 10 && value <= 60) {
      return { type: 'bmi', slug, value }
    }
  }

  // bmi-for-age-35
  const bmiAgeMatch = slug.match(/^bmi-for-age-(\d+)$/)
  if (bmiAgeMatch) {
    return { type: 'bmi-for-age', slug, value: parseInt(bmiAgeMatch[1]) }
  }

  // bmi-calculator-men / bmi-calculator-women
  if (slug === 'bmi-calculator-men') return { type: 'bmi-calculator-gender', slug, variant: 'men' }
  if (slug === 'bmi-calculator-women') return { type: 'bmi-calculator-gender', slug, variant: 'women' }

  // calories-to-lose-20-lbs
  const calToLoseMatch = slug.match(/^calories-to-lose-(\d+)-lbs$/)
  if (calToLoseMatch) {
    return { type: 'calories-to-lose', slug, value: parseInt(calToLoseMatch[1]) }
  }

  // calorie-deficit-500
  const deficitMatch = slug.match(/^calorie-deficit-(\d+)$/)
  if (deficitMatch) {
    return { type: 'calorie-deficit', slug, value: parseInt(deficitMatch[1]) }
  }

  // how-long-to-lose-20-lbs
  const howLongMatch = slug.match(/^how-long-to-lose-(\d+)-lbs$/)
  if (howLongMatch) {
    return { type: 'how-long-to-lose', slug, value: parseInt(howLongMatch[1]) }
  }

  // tdee-2200
  const tdeeMatch = slug.match(/^tdee-(\d+)$/)
  if (tdeeMatch) {
    return { type: 'tdee', slug, value: parseInt(tdeeMatch[1]) }
  }

  // ideal-weight-5ft10
  const idealWeightMatch = slug.match(/^ideal-weight-(\d+)ft(\d+)$/)
  if (idealWeightMatch) {
    const ft = parseInt(idealWeightMatch[1])
    const inches = parseInt(idealWeightMatch[2])
    return { type: 'ideal-weight', slug, value: ft * 12 + inches }
  }

  // heart-rate-zone-35
  const hrZoneMatch = slug.match(/^heart-rate-zone-(\d+)$/)
  if (hrZoneMatch) {
    return { type: 'heart-rate-zone', slug, value: parseInt(hrZoneMatch[1]) }
  }

  // resting-heart-rate-60
  const restingHRMatch = slug.match(/^resting-heart-rate-(\d+)$/)
  if (restingHRMatch) {
    return { type: 'resting-heart-rate', slug, value: parseInt(restingHRMatch[1]) }
  }

  // guide pages (must be in GUIDE_SLUGS or special)
  const allGuides = [...GUIDE_SLUGS, ...SPECIAL_SLUGS]
  if (allGuides.includes(slug)) {
    return { type: 'guide', slug }
  }

  return null
}

// ─── Height formatting helper ─────────────────────────────────────────────────
export function formatHeight(totalInches: number): string {
  const ft = Math.floor(totalInches / 12)
  const inch = totalInches % 12
  return `${ft}'${inch}"`
}
