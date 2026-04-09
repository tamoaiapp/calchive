import {
  BMI_CATEGORIES,
  ACTIVITY_MULTIPLIERS,
  HR_ZONES,
  type BMICategory,
  type ActivityLevel,
} from './data'

export function calcBMI(weightLbs: number, heightInches: number): number {
  return (weightLbs / (heightInches * heightInches)) * 703
}

export function getBMICategory(bmi: number): BMICategory {
  for (const cat of BMI_CATEGORIES) {
    if (bmi < cat.max) return cat
  }
  return BMI_CATEGORIES[BMI_CATEGORIES.length - 1]
}

/**
 * Mifflin-St Jeor equation
 * Returns BMR in calories/day
 */
export function calcBMR(
  weightLbs: number,
  heightInches: number,
  age: number,
  sex: 'male' | 'female',
): number {
  const weightKg = weightLbs * 0.453592
  const heightCm = heightInches * 2.54
  if (sex === 'male') {
    return 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  }
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161
}

export function calcTDEE(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activity].mult
}

export interface IdealWeightResult {
  devine: number
  hamwi: number
  robinson: number
  miller: number
}

/**
 * Four formulas for ideal weight in lbs
 * Heights relative to 60 inches (5'0")
 */
export function calcIdealWeight(
  heightInches: number,
  sex: 'male' | 'female',
): IdealWeightResult {
  const over60 = Math.max(0, heightInches - 60)
  if (sex === 'male') {
    return {
      devine: 110 + 5 * over60,
      hamwi: 106 + 6 * over60,
      robinson: 114 + 4 * over60,
      miller: 124 + 4 * over60,
    }
  }
  return {
    devine: 100 + 5 * over60,
    hamwi: 100 + 5 * over60,
    robinson: 108 + 3.7 * over60,
    miller: 117 + 3.5 * over60,
  }
}

export interface WeightLossResult {
  weeks: number
  calsPerDay: number
  deficitPerDay: number
}

/**
 * 3,500 calories = 1 lb of fat
 * weeklyRate in lbs/week (e.g., 1.0)
 */
export function calcWeightLoss(
  currentWeight: number,
  goalWeight: number,
  weeklyRate: number,
): WeightLossResult {
  const lbsToLose = currentWeight - goalWeight
  const deficitPerDay = (weeklyRate * 3500) / 7
  const weeks = lbsToLose / weeklyRate
  // Assume 2,000 cal maintenance (generic; caller should override with TDEE)
  const calsPerDay = 2000 - deficitPerDay
  return { weeks, calsPerDay, deficitPerDay }
}

export interface HeartRateZone {
  zone: number
  name: string
  minBPM: number
  maxBPM: number
  benefit: string
}

/**
 * Standard 220-age max HR formula with 5-zone breakdown
 * restingHR used for context only (zones based on % of maxHR)
 */
export function calcHeartRateZones(age: number, restingHR: number): HeartRateZone[] {
  const maxHR = 220 - age
  void restingHR // available for Karvonen method if needed
  return HR_ZONES.map((zone) => ({
    zone: zone.zone,
    name: zone.name,
    minBPM: Math.round(maxHR * zone.pct[0]),
    maxBPM: Math.round(maxHR * zone.pct[1]),
    benefit: zone.benefit,
  }))
}
