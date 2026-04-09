// BMI categories (WHO/CDC standard)
export const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: '#3b82f6', risk: 'Low BMI may indicate malnutrition or other health issues' },
  { max: 25.0, label: 'Normal weight', color: '#10b981', risk: 'Associated with lowest health risk for most adults' },
  { max: 30.0, label: 'Overweight', color: '#f59e0b', risk: 'Modestly increased risk for type 2 diabetes and cardiovascular disease' },
  { max: 35.0, label: 'Obese Class I', color: '#ef4444', risk: 'Increased risk for multiple chronic conditions' },
  { max: 40.0, label: 'Obese Class II', color: '#dc2626', risk: 'High risk for serious health complications' },
  { max: Infinity, label: 'Obese Class III', color: '#991b1b', risk: 'Very high risk; associated with significantly reduced life expectancy' },
] as const

export type BMICategory = typeof BMI_CATEGORIES[number]

// Calorie needs by activity level (Mifflin-St Jeor base)
export const ACTIVITY_MULTIPLIERS = {
  sedentary: { mult: 1.2, desc: 'Little to no exercise' },
  light: { mult: 1.375, desc: 'Light exercise 1-3 days/week' },
  moderate: { mult: 1.55, desc: 'Moderate exercise 3-5 days/week' },
  active: { mult: 1.725, desc: 'Hard exercise 6-7 days/week' },
  very_active: { mult: 1.9, desc: 'Very hard exercise, physical job' },
} as const

export type ActivityLevel = keyof typeof ACTIVITY_MULTIPLIERS

// Heart rate zones (Karvonen method)
export const HR_ZONES = [
  { zone: 1, name: 'Recovery', pct: [0.50, 0.60] as [number, number], benefit: 'Active recovery, fat burning' },
  { zone: 2, name: 'Fat Burning', pct: [0.60, 0.70] as [number, number], benefit: 'Aerobic base, fat oxidation' },
  { zone: 3, name: 'Aerobic', pct: [0.70, 0.80] as [number, number], benefit: 'Cardiovascular fitness' },
  { zone: 4, name: 'Anaerobic', pct: [0.80, 0.90] as [number, number], benefit: 'Speed and performance' },
  { zone: 5, name: 'Maximum', pct: [0.90, 1.00] as [number, number], benefit: 'Elite training only' },
] as const

// Macronutrient guidelines
export const MACRO_GUIDELINES = {
  protein: { min: 0.8, optimal: 1.6, unit: 'g/kg bodyweight' },
  fat: { min: 0.20, max: 0.35, unit: '% of calories' },
  carbs: { min: 0.45, max: 0.65, unit: '% of calories' },
} as const

// CDC average BMI data (NHANES 2017-2020)
export const CDC_AVG_BMI = {
  men: 29.4,
  women: 30.1,
  overall: 29.8,
}

// Ideal weight formulas reference weights at 5'0" (60 inches) and per-inch adjustments
export const IDEAL_WEIGHT_BASE = {
  devine: { male: 110, femaleBase: 100, inchMale: 5, inchFemale: 5 }, // lbs
  hamwi: { male: 106, femaleBase: 100, inchMale: 6, inchFemale: 5 },
  robinson: { male: 114, femaleBase: 108, inchMale: 4, inchFemale: 3.7 },
  miller: { male: 124, femaleBase: 117, inchMale: 4, inchFemale: 3.5 },
} as const
