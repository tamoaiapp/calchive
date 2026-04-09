import type { CalcConfig } from './types'

export const healthCalcs: CalcConfig[] = [
  {
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    desc: 'Calculate your Body Mass Index and weight status category.',
    cat: 'health', icon: '⚖️',
    fields: [
      { k: 'weight', l: 'Weight', p: '170', min: 1, u: 'lbs' },
      { k: 'height_ft', l: 'Height (feet)', p: '5', min: 1, max: 8 },
      { k: 'height_in', l: 'Height (inches)', p: '10', min: 0, max: 11 },
    ],
    fn: (v) => {
      const heightIn = v.height_ft * 12 + v.height_in
      const bmi = (v.weight / (heightIn * heightIn)) * 703
      let cat = 'Normal weight'
      if (bmi < 18.5) cat = 'Underweight'
      else if (bmi >= 30) cat = 'Obese'
      else if (bmi >= 25) cat = 'Overweight'
      const idealLow = 18.5 * (heightIn * heightIn) / 703
      const idealHigh = 24.9 * (heightIn * heightIn) / 703
      return {
        primary: { value: parseFloat(bmi.toFixed(1)), label: 'BMI', fmt: 'num' },
        details: [
          { l: 'Category', v: cat, fmt: 'txt', color: bmi >= 18.5 && bmi < 25 ? 'var(--green)' : bmi < 30 ? '#fbbf24' : '#f87171' },
          { l: 'Healthy Weight Range', v: `${idealLow.toFixed(0)}–${idealHigh.toFixed(0)} lbs`, fmt: 'txt' },
        ],
        note: 'BMI does not measure body fat directly and may be misleading for athletes, elderly, or different ethnicities.',
      }
    },
    about: 'BMI was developed by Belgian statistician Adolphe Quetelet in the 1830s and is widely used for population-level health screening. At an individual level, it cannot distinguish between muscle and fat — a NFL linebacker might have the same BMI as someone with obesity. The WHO uses 18.5–24.9 as the healthy range.',
    related: ['bmr-calculator', 'body-fat-percentage-calculator', 'ideal-weight-calculator'],
  },
  {
    slug: 'bmr-calculator',
    title: 'BMR Calculator',
    desc: 'Calculate your Basal Metabolic Rate — calories burned at rest.',
    cat: 'health', icon: '🔥',
    fields: [
      { k: 'weight', l: 'Weight', p: '170', min: 1, u: 'lbs' },
      { k: 'height', l: 'Height', p: '70', min: 1, u: 'inches' },
      { k: 'age', l: 'Age', p: '30', min: 1, max: 120, u: 'years' },
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male'],['0','Female']] },
    ],
    fn: (v) => {
      const weightKg = v.weight * 0.453592
      const heightCm = v.height * 2.54
      // Mifflin-St Jeor equation
      const bmr = v.sex === 1
        ? 10 * weightKg + 6.25 * heightCm - 5 * v.age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * v.age - 161
      return {
        primary: { value: parseFloat(bmr.toFixed(0)), label: 'Basal Metabolic Rate (calories/day)', fmt: 'num' },
        details: [
          { l: 'If Sedentary (×1.2)', v: parseFloat((bmr * 1.2).toFixed(0)), fmt: 'num' },
          { l: 'If Lightly Active (×1.375)', v: parseFloat((bmr * 1.375).toFixed(0)), fmt: 'num' },
          { l: 'If Moderately Active (×1.55)', v: parseFloat((bmr * 1.55).toFixed(0)), fmt: 'num' },
          { l: 'If Very Active (×1.725)', v: parseFloat((bmr * 1.725).toFixed(0)), fmt: 'num' },
        ],
        note: 'Mifflin-St Jeor equation is the most accurate for most adults (±10% accuracy).',
      }
    },
    about: 'BMR represents the calories needed to sustain basic bodily functions at rest — breathing, circulation, and temperature regulation. The brain alone consumes about 20% of BMR. The Mifflin-St Jeor equation, developed in 1990, is 5% more accurate than the older Harris-Benedict equation.',
    related: ['tdee-calculator', 'calorie-deficit-calculator', 'bmi-calculator'],
  },
  {
    slug: 'tdee-calculator',
    title: 'TDEE Calculator',
    desc: 'Calculate Total Daily Energy Expenditure — your maintenance calories.',
    cat: 'health', icon: '⚡',
    fields: [
      { k: 'bmr', l: 'BMR (use BMR calculator)', p: '1800', min: 0, u: 'cal/day' },
      { k: 'activity', l: 'Activity Level', t: 'sel', p: '1.375', op: [['1.2','Sedentary (desk job, little exercise)'],['1.375','Lightly Active (1–3 days/week)'],['1.55','Moderately Active (3–5 days/week)'],['1.725','Very Active (6–7 days/week)'],['1.9','Extremely Active (athlete/physical job)']] },
    ],
    fn: (v) => {
      const tdee = v.bmr * v.activity
      const deficit500 = tdee - 500 // ~1 lb/week loss
      const surplus250 = tdee + 250 // lean bulk
      return {
        primary: { value: parseFloat(tdee.toFixed(0)), label: 'Maintenance Calories (TDEE)', fmt: 'num' },
        details: [
          { l: 'Weight Loss (-500 cal/day)', v: parseFloat(deficit500.toFixed(0)), fmt: 'num' },
          { l: 'Lean Bulk (+250 cal/day)', v: parseFloat(surplus250.toFixed(0)), fmt: 'num' },
          { l: 'Activity Multiplier', v: v.activity, fmt: 'num' },
        ],
        note: '500 calorie deficit = ~1 pound/week loss. Do not go below 1,200 (women) or 1,500 (men) without medical supervision.',
      }
    },
    about: 'TDEE is the actual number of calories you burn in a day with your current activity level. A 500-calorie daily deficit (3,500/week) theoretically produces 1 pound of fat loss per week — though the body adapts by reducing metabolic rate, slowing progress over time.',
    related: ['bmr-calculator', 'calorie-deficit-calculator', 'weight-loss-calculator'],
  },
  {
    slug: 'calorie-deficit-calculator',
    title: 'Calorie Deficit Calculator',
    desc: 'Calculate the calorie deficit needed to reach your weight loss goal.',
    cat: 'health', icon: '🥗',
    fields: [
      { k: 'current_weight', l: 'Current Weight', p: '185', min: 0, u: 'lbs' },
      { k: 'goal_weight', l: 'Goal Weight', p: '165', min: 0, u: 'lbs' },
      { k: 'tdee', l: 'Daily TDEE', p: '2400', min: 0, u: 'cal/day' },
      { k: 'weeks', l: 'Weeks to Reach Goal', p: '20', min: 1, u: 'weeks' },
    ],
    fn: (v) => {
      const lbs_to_lose = v.current_weight - v.goal_weight
      if (lbs_to_lose <= 0) throw new Error('Goal weight must be less than current weight for weight loss.')
      const total_deficit = lbs_to_lose * 3500
      const daily_deficit = total_deficit / (v.weeks * 7)
      const daily_calories = v.tdee - daily_deficit
      return {
        primary: { value: parseFloat(daily_deficit.toFixed(0)), label: 'Daily Calorie Deficit Needed', fmt: 'num' },
        details: [
          { l: 'Daily Calorie Target', v: parseFloat(daily_calories.toFixed(0)), fmt: 'num' },
          { l: 'Pounds to Lose', v: parseFloat(lbs_to_lose.toFixed(1)), fmt: 'num' },
          { l: 'Rate (lbs/week)', v: parseFloat((lbs_to_lose / v.weeks).toFixed(2)), fmt: 'num' },
        ],
        note: 'Safe weight loss is generally 0.5–2 lbs/week. Deficits exceeding 1,000 cal/day are not recommended without medical supervision.',
      }
    },
    about: 'The 3,500-calorie-per-pound rule is a reliable guideline, though the body adapts to caloric restriction by reducing metabolic rate — actual results often require 10–20% larger deficits over time. A 500 cal/day deficit (0.5 kg/week loss) is considered optimal for preserving muscle mass.',
    related: ['tdee-calculator', 'bmr-calculator', 'weight-loss-calculator'],
  },
  {
    slug: 'protein-intake-calculator',
    title: 'Protein Intake Calculator',
    desc: 'Calculate your daily protein needs based on weight and activity level.',
    cat: 'health', icon: '🥩',
    fields: [
      { k: 'weight', l: 'Body Weight', p: '175', min: 0, u: 'lbs' },
      { k: 'goal', l: 'Primary Goal', t: 'sel', p: '1', op: [['0','Maintain Weight (0.7g/lb)'],['1','Build Muscle (1.0g/lb)'],['2','Maximize Muscle (1.2g/lb)'],['3','Weight Loss (0.8g/lb)']] },
    ],
    fn: (v) => {
      const rates = [0.7, 1.0, 1.2, 0.8]
      const rate = rates[v.goal]
      const grams = v.weight * rate
      const calories = grams * 4
      const meals4 = grams / 4
      return {
        primary: { value: parseFloat(grams.toFixed(0)), label: 'Daily Protein Target (grams)', fmt: 'num' },
        details: [
          { l: 'Per Meal (4 meals)', v: parseFloat(meals4.toFixed(0)), fmt: 'num' },
          { l: 'Protein Calories', v: parseFloat(calories.toFixed(0)), fmt: 'num' },
          { l: 'Rate', v: parseFloat(rate.toFixed(1)), fmt: 'num' },
        ],
        note: 'Research supports 1.6–2.2g protein per kg body weight for muscle building.',
      }
    },
    about: 'Research from the International Society of Sports Nutrition recommends 1.4–2.0g of protein per kilogram (0.64–0.91g per lb) for exercising adults. Beyond 2.2g/kg, there\'s no additional muscle protein synthesis benefit. High protein diets increase satiety and thermogenesis, supporting fat loss.',
    related: ['calorie-deficit-calculator', 'bmr-calculator', 'lean-body-mass-calculator'],
  },
  {
    slug: 'water-intake-calculator',
    title: 'Water Intake Calculator',
    desc: 'Calculate your recommended daily water intake based on weight and activity.',
    cat: 'health', icon: '💧',
    fields: [
      { k: 'weight', l: 'Body Weight', p: '160', min: 0, u: 'lbs' },
      { k: 'activity', l: 'Activity Level', t: 'sel', p: '1', op: [['0','Sedentary'],['1','Moderate Exercise'],['2','Intense Exercise / Hot Climate']] },
    ],
    fn: (v) => {
      const base_oz = v.weight * 0.5
      const extra = [0, 12, 24][v.activity]
      const total_oz = base_oz + extra
      const liters = total_oz * 0.0296
      const cups = total_oz / 8
      return {
        primary: { value: parseFloat(total_oz.toFixed(0)), label: 'Daily Water Intake (oz)', fmt: 'num' },
        details: [
          { l: 'In Liters', v: parseFloat(liters.toFixed(1)), fmt: 'num' },
          { l: 'In Cups (8 oz each)', v: parseFloat(cups.toFixed(1)), fmt: 'num' },
          { l: 'In 16.9 oz Water Bottles', v: parseFloat((total_oz / 16.9).toFixed(1)), fmt: 'num' },
        ],
        note: 'The "8×8 rule" (eight 8-oz glasses) is not evidence-based. Actual needs depend on sweat rate, climate, and diet.',
      }
    },
    about: 'The National Academies recommend about 3.7 liters (125 oz) daily for men and 2.7 liters (91 oz) for women — including water in food (which accounts for 20% of intake). Hydration needs increase significantly with exercise and hot weather. Urine color (pale yellow = well-hydrated) is a reliable gauge.',
    related: ['bmr-calculator', 'calorie-deficit-calculator', 'tdee-calculator'],
  },
  {
    slug: 'body-fat-percentage-calculator',
    title: 'Body Fat Percentage Calculator',
    desc: 'Estimate body fat percentage using the US Navy circumference method.',
    cat: 'health', icon: '📏',
    fields: [
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male'],['0','Female']] },
      { k: 'height', l: 'Height', p: '70', min: 1, u: 'inches' },
      { k: 'waist', l: 'Waist Circumference', p: '34', min: 1, u: 'inches' },
      { k: 'neck', l: 'Neck Circumference', p: '15', min: 1, u: 'inches' },
      { k: 'hips', l: 'Hip Circumference (women)', p: '37', min: 1, u: 'inches' },
    ],
    fn: (v) => {
      let bf: number
      if (v.sex === 1) {
        bf = 86.010 * Math.log10(v.waist - v.neck) - 70.041 * Math.log10(v.height) + 36.76
      } else {
        bf = 163.205 * Math.log10(v.waist + v.hips - v.neck) - 97.684 * Math.log10(v.height) - 78.387
      }
      const weight = 170
      const category = bf < 10 ? 'Essential fat' : bf < 20 ? 'Athlete' : bf < 25 ? 'Fitness' : bf < 31 ? 'Average' : 'Obese'
      return {
        primary: { value: parseFloat(Math.max(3, bf).toFixed(1)), label: 'Estimated Body Fat %', fmt: 'pct' },
        details: [
          { l: 'Category', v: category, fmt: 'txt', color: bf < 25 ? 'var(--green)' : bf < 32 ? '#fbbf24' : '#f87171' },
          { l: 'Lean Body Mass (170 lb est.)', v: parseFloat((weight * (1 - bf / 100)).toFixed(1)), fmt: 'num' },
        ],
        note: 'US Navy method accuracy is ±3–4%. DEXA scan is the gold standard for body composition.',
      }
    },
    about: 'Essential fat (for organ function) is 2–5% for men and 10–13% for women. Athletes typically carry 6–13% (men) and 14–20% (women). The American Council on Exercise classifies 18–24% as "fitness" range for men. Excess visceral fat (around organs) is more metabolically dangerous than subcutaneous fat.',
    related: ['bmi-calculator', 'lean-body-mass-calculator', 'ideal-weight-calculator'],
  },
  {
    slug: 'lean-body-mass-calculator',
    title: 'Lean Body Mass Calculator',
    desc: 'Calculate your lean body mass (total mass minus body fat).',
    cat: 'health', icon: '💪',
    fields: [
      { k: 'weight', l: 'Total Body Weight', p: '180', min: 0, u: 'lbs' },
      { k: 'body_fat', l: 'Body Fat Percentage', p: '18', min: 1, max: 70, u: '%' },
    ],
    fn: (v) => {
      const fat_mass = v.weight * (v.body_fat / 100)
      const lbm = v.weight - fat_mass
      return {
        primary: { value: parseFloat(lbm.toFixed(1)), label: 'Lean Body Mass', fmt: 'num' },
        details: [
          { l: 'Fat Mass', v: parseFloat(fat_mass.toFixed(1)), fmt: 'num' },
          { l: 'Body Fat %', v: v.body_fat, fmt: 'pct' },
          { l: 'Protein Target (1g/lb LBM)', v: parseFloat(lbm.toFixed(0)), fmt: 'num' },
        ],
        note: 'LBM includes muscle, bone, organs, and water. Accurate measurement requires DEXA or hydrostatic weighing.',
      }
    },
    about: 'Lean body mass (LBM) is the foundation for calculating protein needs, BMR, and strength ratios. Using LBM for protein intake (1g per lb of LBM) rather than total weight is more accurate for athletes and those with higher body fat percentages.',
    related: ['body-fat-percentage-calculator', 'protein-intake-calculator', 'bmi-calculator'],
  },
  {
    slug: 'ideal-weight-calculator',
    title: 'Ideal Weight Calculator',
    desc: 'Calculate your ideal body weight using multiple medical formulas.',
    cat: 'health', icon: '🎯',
    fields: [
      { k: 'height_in', l: 'Height (inches)', p: '69', min: 48, max: 96 },
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male'],['0','Female']] },
    ],
    fn: (v) => {
      const over5 = v.height_in - 60
      // Devine formula
      const devine = v.sex === 1 ? 110.2 + 5.06 * over5 : 100.3 + 5.06 * over5
      // Robinson formula
      const robinson = v.sex === 1 ? 113.4 + 4.41 * over5 : 108.3 + 3.74 * over5
      // Miller formula
      const miller = v.sex === 1 ? 117.5 + 3.89 * over5 : 115.5 + 2.86 * over5
      const avg = (devine + robinson + miller) / 3
      return {
        primary: { value: parseFloat(avg.toFixed(1)), label: 'Average Ideal Weight (lbs)', fmt: 'num' },
        details: [
          { l: 'Devine Formula', v: parseFloat(devine.toFixed(1)), fmt: 'num' },
          { l: 'Robinson Formula', v: parseFloat(robinson.toFixed(1)), fmt: 'num' },
          { l: 'Miller Formula', v: parseFloat(miller.toFixed(1)), fmt: 'num' },
        ],
        note: 'Ideal weight formulas are population averages and may not reflect your individual build, muscle mass, or ethnicity.',
      }
    },
    about: 'Medical ideal body weight formulas were developed for drug dosing, not fitness goals. The Devine formula (1974) is still widely used in clinical settings. Modern research suggests there is no single ideal weight — health outcomes depend far more on fitness level, metabolic health, and body composition than weight alone.',
    related: ['bmi-calculator', 'body-fat-percentage-calculator', 'lean-body-mass-calculator'],
  },
  {
    slug: 'weight-loss-calculator',
    title: 'Weight Loss Calculator',
    desc: 'Calculate how long it will take to reach your goal weight at a given calorie deficit.',
    cat: 'health', icon: '📉',
    fields: [
      { k: 'current', l: 'Current Weight', p: '200', min: 0, u: 'lbs' },
      { k: 'goal', l: 'Goal Weight', p: '175', min: 0, u: 'lbs' },
      { k: 'weekly_loss', l: 'Target Loss Rate', t: 'sel', p: '1', op: [['0.5','0.5 lbs/week (mild, −250 cal/day)'],['1','1 lb/week (moderate, −500 cal/day)'],['1.5','1.5 lbs/week (aggressive, −750 cal/day)'],['2','2 lbs/week (maximum, −1000 cal/day)']] },
    ],
    fn: (v) => {
      const lbs_to_lose = Math.max(0, v.current - v.goal)
      const weeks = lbs_to_lose / v.weekly_loss
      const daily_deficit = v.weekly_loss * 500
      return {
        primary: { value: parseFloat(weeks.toFixed(1)), label: 'Weeks to Goal', fmt: 'num' },
        details: [
          { l: 'Weight to Lose', v: parseFloat(lbs_to_lose.toFixed(1)), fmt: 'num' },
          { l: 'Daily Calorie Deficit', v: parseFloat(daily_deficit.toFixed(0)), fmt: 'num' },
          { l: 'Months to Goal', v: parseFloat((weeks / 4.33).toFixed(1)), fmt: 'num' },
        ],
        note: 'Weight loss slows as you lose weight due to metabolic adaptation. Recalculate every 4–8 weeks.',
      }
    },
    about: 'A sustained 500 calorie daily deficit produces approximately 1 pound per week. The body adapts to caloric restriction — metabolism slows by 5–15% with significant weight loss, which is why diet breaks and refeeds are common strategies for breaking plateaus.',
    related: ['calorie-deficit-calculator', 'tdee-calculator', 'bmr-calculator'],
  },
  {
    slug: 'running-pace-calculator',
    title: 'Running Pace Calculator',
    desc: 'Calculate running pace, finish time, or total distance for any run.',
    cat: 'health', icon: '🏃',
    fields: [
      { k: 'distance', l: 'Distance', p: '5', min: 0, u: 'miles' },
      { k: 'time_min', l: 'Time (minutes)', p: '45', min: 0 },
      { k: 'time_sec', l: 'Time (seconds)', p: '0', min: 0, max: 59 },
    ],
    fn: (v) => {
      const total_sec = v.time_min * 60 + v.time_sec
      const pace_sec = total_sec / v.distance
      const pace_min = Math.floor(pace_sec / 60)
      const pace_remaining = Math.round(pace_sec % 60)
      const kmPace_sec = pace_sec / 1.60934
      const kmMin = Math.floor(kmPace_sec / 60)
      const kmSec = Math.round(kmPace_sec % 60)
      const marathon_finish = (pace_sec * 26.2) / 60
      return {
        primary: { value: parseFloat(pace_sec.toFixed(0)), label: `Pace: ${pace_min}:${pace_remaining.toString().padStart(2, '0')} per mile`, fmt: 'txt' },
        details: [
          { l: `Pace (min/mi)`, v: `${pace_min}:${pace_remaining.toString().padStart(2, '0')}`, fmt: 'txt' },
          { l: `Pace (min/km)`, v: `${kmMin}:${kmSec.toString().padStart(2, '0')}`, fmt: 'txt' },
          { l: 'Speed (mph)', v: parseFloat((v.distance / (total_sec / 3600)).toFixed(2)), fmt: 'num' },
          { l: 'Marathon Finish at This Pace', v: `${Math.floor(marathon_finish / 60)}h ${Math.round(marathon_finish % 60)}min`, fmt: 'txt' },
        ],
      }
    },
    about: 'An average recreational runner runs at a 10–12 minute per mile pace. Elite marathon runners average under 4:45/mile for 26.2 miles. The current world marathon record (Kelvin Kiptum, 2023) is 2:00:35 — an astonishing 4:35/mile pace across 26.2 miles.',
    related: ['calories-burned-running-calculator', 'vo2-max-calculator', 'heart-rate-zone-calculator'],
  },
  {
    slug: 'calories-burned-running-calculator',
    title: 'Calories Burned Running Calculator',
    desc: 'Calculate calories burned during a run based on weight, distance, and pace.',
    cat: 'health', icon: '🏃‍♂️',
    fields: [
      { k: 'weight', l: 'Body Weight', p: '160', min: 0, u: 'lbs' },
      { k: 'distance', l: 'Distance', p: '3', min: 0, u: 'miles' },
      { k: 'speed', l: 'Running Speed', t: 'sel', p: '6', op: [['4','4 mph (15:00/mi)'],['5','5 mph (12:00/mi)'],['6','6 mph (10:00/mi)'],['7','7 mph (8:34/mi)'],['8','8 mph (7:30/mi)'],['10','10 mph (6:00/mi)']] },
    ],
    fn: (v) => {
      // MET values for running
      const mets: Record<number, number> = { 4: 6.0, 5: 8.3, 6: 9.8, 7: 11.0, 8: 11.8, 10: 14.5 }
      const met = mets[v.speed] ?? 9.8
      const weightKg = v.weight * 0.453592
      const hours = v.distance / v.speed
      const calories = met * weightKg * hours
      return {
        primary: { value: parseFloat(calories.toFixed(0)), label: 'Calories Burned', fmt: 'num' },
        details: [
          { l: 'Duration', v: parseFloat((hours * 60).toFixed(1)), fmt: 'num' },
          { l: 'Per Mile', v: parseFloat((calories / v.distance).toFixed(0)), fmt: 'num' },
          { l: 'MET Value', v: parseFloat(met.toFixed(1)), fmt: 'num' },
        ],
        note: 'Calorie burn is approximately 100 calories per mile for a 150-lb person, regardless of pace.',
      }
    },
    about: 'Running burns approximately 80–140 calories per mile depending on weight and terrain — heavier runners and hilly routes burn more. The rule of thumb "100 calories per mile" works surprisingly well across different weights and speeds. Running is 2–3x more calorie-efficient than walking the same distance.',
    related: ['calories-burned-walking-calculator', 'tdee-calculator', 'weight-loss-calculator'],
  },
  {
    slug: 'calories-burned-walking-calculator',
    title: 'Calories Burned Walking Calculator',
    desc: 'Calculate calories burned during a walk based on weight and distance.',
    cat: 'health', icon: '🚶',
    fields: [
      { k: 'weight', l: 'Body Weight', p: '160', min: 0, u: 'lbs' },
      { k: 'distance', l: 'Distance Walked', p: '2', min: 0, u: 'miles' },
      { k: 'speed', l: 'Walking Speed', t: 'sel', p: '3', op: [['2','2 mph (slow)'],['3','3 mph (average)'],['3.5','3.5 mph (brisk)'],['4','4 mph (power walk)']] },
    ],
    fn: (v) => {
      const mets: Record<number, number> = { 2: 2.8, 3: 3.5, 3.5: 4.3, 4: 5.0 }
      const met = mets[v.speed] ?? 3.5
      const weightKg = v.weight * 0.453592
      const hours = v.distance / v.speed
      const calories = met * weightKg * hours
      const steps = v.distance * 2000
      return {
        primary: { value: parseFloat(calories.toFixed(0)), label: 'Calories Burned', fmt: 'num' },
        details: [
          { l: 'Duration (minutes)', v: parseFloat((hours * 60).toFixed(0)), fmt: 'num' },
          { l: 'Approximate Steps', v: parseFloat(steps.toFixed(0)), fmt: 'num' },
          { l: 'Per Mile', v: parseFloat((calories / v.distance).toFixed(0)), fmt: 'num' },
        ],
      }
    },
    about: 'Walking at 3 mph burns about 100 calories per mile for a 150-lb person — similar to running, just over more time. The 10,000-step goal (about 5 miles) burns roughly 400–500 calories. Brisk walking has been shown to reduce all-cause mortality as effectively as vigorous exercise.',
    related: ['calories-burned-running-calculator', 'tdee-calculator', 'weight-loss-calculator'],
  },
  {
    slug: 'heart-rate-zone-calculator',
    title: 'Heart Rate Zone Calculator',
    desc: 'Calculate your cardio training zones based on maximum heart rate.',
    cat: 'health', icon: '❤️',
    fields: [
      { k: 'age', l: 'Age', p: '35', min: 15, max: 90, u: 'years' },
      { k: 'resting_hr', l: 'Resting Heart Rate', p: '65', min: 30, max: 100, u: 'bpm' },
    ],
    fn: (v) => {
      const max_hr = 220 - v.age
      const hrr = max_hr - v.resting_hr
      const zone1 = Math.round(v.resting_hr + hrr * 0.50)
      const zone2 = Math.round(v.resting_hr + hrr * 0.60)
      const zone3 = Math.round(v.resting_hr + hrr * 0.70)
      const zone4 = Math.round(v.resting_hr + hrr * 0.80)
      const zone5 = Math.round(v.resting_hr + hrr * 0.90)
      return {
        primary: { value: max_hr, label: 'Estimated Max Heart Rate (220 - age)', fmt: 'num' },
        details: [
          { l: 'Zone 1: Warmup (50–60%)', v: `${zone1}–${zone2} bpm`, fmt: 'txt' },
          { l: 'Zone 2: Fat Burn (60–70%)', v: `${zone2}–${zone3} bpm`, fmt: 'txt' },
          { l: 'Zone 3: Aerobic (70–80%)', v: `${zone3}–${zone4} bpm`, fmt: 'txt' },
          { l: 'Zone 4: Threshold (80–90%)', v: `${zone4}–${zone5} bpm`, fmt: 'txt' },
          { l: 'Zone 5: VO2 Max (90–100%)', v: `${zone5}–${max_hr} bpm`, fmt: 'txt' },
        ],
      }
    },
    about: 'Heart rate zones using the Karvonen method (Heart Rate Reserve) are more accurate than simple percentage of max HR. Zone 2 training (60–70% of HRR) is the foundation of endurance training and longevity — researchers like Dr. Peter Attia and Dr. Phil Maffetone recommend spending 80% of training time here.',
    related: ['vo2-max-calculator', 'running-pace-calculator', 'calories-burned-running-calculator'],
  },
  {
    slug: 'vo2-max-calculator',
    title: 'VO2 Max Calculator',
    desc: 'Estimate your VO2 max from a submaximal exercise test or fitness markers.',
    cat: 'health', icon: '🫁',
    fields: [
      { k: 'resting_hr', l: 'Resting Heart Rate', p: '65', min: 30, max: 120, u: 'bpm' },
      { k: 'age', l: 'Age', p: '35', min: 15, max: 90, u: 'years' },
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male'],['0','Female']] },
    ],
    fn: (v) => {
      // Cooper estimate based on resting HR and age
      const max_hr = 220 - v.age
      const vo2max = 15 * (max_hr / v.resting_hr)
      const vo2_adj = v.sex === 0 ? vo2max * 0.85 : vo2max
      let category = 'Superior'
      if (v.sex === 1) {
        if (vo2_adj < 38) category = 'Very Poor'
        else if (vo2_adj < 44) category = 'Poor'
        else if (vo2_adj < 51) category = 'Fair'
        else if (vo2_adj < 57) category = 'Good'
        else if (vo2_adj < 63) category = 'Excellent'
      } else {
        if (vo2_adj < 31) category = 'Very Poor'
        else if (vo2_adj < 37) category = 'Poor'
        else if (vo2_adj < 42) category = 'Fair'
        else if (vo2_adj < 48) category = 'Good'
        else if (vo2_adj < 53) category = 'Excellent'
      }
      return {
        primary: { value: parseFloat(vo2_adj.toFixed(1)), label: 'Estimated VO2 Max (mL/kg/min)', fmt: 'num' },
        details: [
          { l: 'Fitness Category', v: category, fmt: 'txt', color: ['Very Poor','Poor'].includes(category) ? '#f87171' : ['Excellent','Superior'].includes(category) ? 'var(--green)' : '#fbbf24' },
          { l: 'Elite Marathoners', v: '70–85+ mL/kg/min', fmt: 'txt' },
        ],
        note: 'This estimate (Cooper protocol) can vary ±10–15%. Lab testing with a metabolic cart is the gold standard.',
      }
    },
    about: 'VO2 max is the gold standard measure of cardiovascular fitness — the maximum rate at which your body can consume oxygen during intense exercise. It\'s a strong predictor of all-cause mortality: each 1-unit increase in VO2 max is associated with a 9% reduction in mortality risk. Elite cyclists like Tour de France winners exceed 85 mL/kg/min.',
    related: ['heart-rate-zone-calculator', 'running-pace-calculator', 'bmr-calculator'],
  },
  {
    slug: 'one-rep-max-calculator',
    title: 'One Rep Max (1RM) Calculator',
    desc: 'Calculate your estimated one-rep max for any strength exercise.',
    cat: 'health', icon: '🏋️',
    fields: [
      { k: 'weight_lifted', l: 'Weight Lifted', p: '185', min: 0, u: 'lbs' },
      { k: 'reps', l: 'Reps Completed', p: '5', min: 1, max: 20 },
      { k: 'formula', l: 'Formula', t: 'sel', p: '0', op: [['0','Brzycki (most accurate)'],['1','Epley'],['2','Lander']] },
    ],
    fn: (v) => {
      let one_rm: number
      if (v.formula === 0) one_rm = v.weight_lifted / (1.0278 - 0.0278 * v.reps) // Brzycki
      else if (v.formula === 1) one_rm = v.weight_lifted * (1 + 0.0333 * v.reps) // Epley
      else one_rm = (100 * v.weight_lifted) / (101.3 - 2.67123 * v.reps) // Lander
      const pcts = [100, 95, 90, 85, 80, 75, 70]
      return {
        primary: { value: parseFloat(one_rm.toFixed(0)), label: 'Estimated 1 Rep Max', fmt: 'num' },
        details: pcts.map(p => ({ l: `${p}% (${Math.round(p * one_rm / 100)} lbs) — est. ${p <= 75 ? '8–12' : p <= 85 ? '5–6' : '2–3'} reps`, v: parseFloat((p / 100 * one_rm).toFixed(0)), fmt: 'num' })),
      }
    },
    about: 'The Brzycki formula is most accurate for sets of 1–10 reps; accuracy declines for higher rep ranges. A beginner bench press 1RM of 135 lbs is average for a 170-lb man; intermediate is 175–200 lbs; advanced 250+ lbs. World record raw bench press is 739 lbs (Julius Maddox, 2020).',
    related: ['calories-burned-running-calculator', 'protein-intake-calculator', 'lean-body-mass-calculator'],
  },
  {
    slug: 'due-date-calculator',
    title: 'Pregnancy Due Date Calculator',
    desc: 'Calculate your estimated due date from the first day of your last period.',
    cat: 'health', icon: '🤰',
    fields: [
      { k: 'lmp_days', l: 'Days since Last Menstrual Period', p: '30', min: 0, max: 280 },
    ],
    fn: (v) => {
      const total_days = 280 - v.lmp_days
      const weeks = Math.floor(total_days / 7)
      const days = total_days % 7
      const current_weeks = Math.floor(v.lmp_days / 7)
      const current_days_rem = v.lmp_days % 7
      return {
        primary: { value: total_days, label: 'Days Until Due Date', fmt: 'num' },
        details: [
          { l: 'Remaining (weeks + days)', v: `${weeks}w ${days}d`, fmt: 'txt' },
          { l: 'Current Gestational Age', v: `${current_weeks}w ${current_days_rem}d`, fmt: 'txt' },
          { l: 'Trimester', v: v.lmp_days < 91 ? '1st Trimester' : v.lmp_days < 182 ? '2nd Trimester' : '3rd Trimester', fmt: 'txt' },
        ],
        note: 'Naegele\'s rule: add 280 days (40 weeks) to the first day of LMP. Only 4% of babies are born on their due date.',
      }
    },
    about: 'Naegele\'s rule calculates due date as 280 days (40 weeks) from the last menstrual period — established in 1812. Studies show the average gestation is actually 40 weeks 5 days for first-time mothers. Ultrasound dating in the first trimester is more accurate than LMP dating alone.',
    related: ['ovulation-calculator', 'pregnancy-weight-gain-calculator', 'newborn-feeding-calculator'],
  },
  {
    slug: 'blood-alcohol-content-calculator',
    title: 'Blood Alcohol Content (BAC) Calculator',
    desc: 'Estimate your blood alcohol content based on drinks consumed, weight, and time.',
    cat: 'health', icon: '🍺',
    fields: [
      { k: 'drinks', l: 'Number of Standard Drinks', p: '3', min: 0 },
      { k: 'weight', l: 'Body Weight', p: '160', min: 1, u: 'lbs' },
      { k: 'hours', l: 'Hours Since First Drink', p: '2', min: 0 },
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male (r=0.73)'],['0','Female (r=0.66)']] },
    ],
    fn: (v) => {
      const r = v.sex === 1 ? 0.73 : 0.66
      const weightGrams = v.weight * 453.592
      const alcohol = v.drinks * 14 // 14g per standard drink
      const bac = (alcohol / (weightGrams * r)) * 100 - (0.015 * v.hours)
      const bac_final = Math.max(0, bac)
      let status = 'Sober (< 0.02%)'
      if (bac_final >= 0.08) status = 'Legally Impaired (≥ 0.08% in all US states)'
      else if (bac_final >= 0.05) status = 'Impaired — zero tolerance states'
      else if (bac_final >= 0.02) status = 'Mild effects'
      return {
        primary: { value: parseFloat(bac_final.toFixed(3)), label: 'Estimated BAC', fmt: 'pct' },
        details: [
          { l: 'Legal Limit (US)', v: '0.080%', fmt: 'txt' },
          { l: 'Status', v: status, fmt: 'txt', color: bac_final >= 0.08 ? '#f87171' : bac_final >= 0.02 ? '#fbbf24' : 'var(--green)' },
          { l: 'Time to Sober (hours)', v: parseFloat((bac_final / 0.015).toFixed(1)), fmt: 'num' },
        ],
        note: 'This is an estimate only. Do not drive if you have consumed any alcohol. Individual metabolism varies significantly.',
      }
    },
    about: 'The Widmark formula estimates BAC based on weight, sex, drinks, and elimination rate. The liver metabolizes alcohol at roughly 0.015% BAC per hour for most people — coffee, water, and food do not speed this up. At 0.08% BAC, reaction time is 50% slower and crash risk is 7x higher.',
    related: ['bmi-calculator', 'water-intake-calculator', 'sleep-calculator'],
  },
  {
    slug: 'sleep-calculator',
    title: 'Sleep Calculator',
    desc: 'Calculate the best bedtime or wake-up time based on 90-minute sleep cycles.',
    cat: 'health', icon: '😴',
    fields: [
      { k: 'wake_hour', l: 'Wake-Up Time (hour)', p: '7', min: 0, max: 23 },
      { k: 'wake_min', l: 'Wake-Up Time (minute)', p: '0', min: 0, max: 59 },
      { k: 'cycles', l: 'Sleep Cycles Desired', t: 'sel', p: '5', op: [['4','4 cycles (6 hours)'],['5','5 cycles (7.5 hours)'],['6','6 cycles (9 hours)']] },
    ],
    fn: (v) => {
      const wakeMinutes = v.wake_hour * 60 + v.wake_min
      const fallAsleepBuffer = 15 // minutes to fall asleep
      const sleepDuration = v.cycles * 90 + fallAsleepBuffer
      const bedtimeMinutes = wakeMinutes - sleepDuration
      const adjustedBedtime = ((bedtimeMinutes % 1440) + 1440) % 1440
      const bedHour = Math.floor(adjustedBedtime / 60)
      const bedMin = adjustedBedtime % 60
      const totalSleep = v.cycles * 90
      return {
        primary: { value: parseFloat((totalSleep / 60).toFixed(1)), label: 'Total Sleep (hours)', fmt: 'num' },
        details: [
          { l: 'Bedtime', v: `${bedHour}:${bedMin.toString().padStart(2, '0')}`, fmt: 'txt' },
          { l: 'Sleep Cycles', v: v.cycles, fmt: 'num' },
          { l: 'Total Sleep Minutes', v: totalSleep, fmt: 'num' },
        ],
        note: 'Waking mid-cycle causes grogginess. The 15-minute fall-asleep buffer is average — adjust if you fall asleep faster or slower.',
      }
    },
    about: 'Human sleep architecture progresses through 90-minute cycles of light sleep, deep sleep, and REM sleep. Waking at the end of a cycle (rather than mid-cycle) reduces sleep inertia. The CDC recommends 7–9 hours for adults; chronic short sleep (< 6 hours) is linked to metabolic disease, immune dysfunction, and cognitive decline.',
    related: ['bmr-calculator', 'blood-alcohol-content-calculator', 'heart-rate-zone-calculator'],
  },
  {
    slug: 'ovulation-calculator',
    title: 'Ovulation Calculator',
    desc: 'Estimate ovulation date and fertile window based on cycle length.',
    cat: 'health', icon: '🌸',
    fields: [
      { k: 'cycle_length', l: 'Average Cycle Length', p: '28', min: 21, max: 45, u: 'days' },
      { k: 'lmp_days_ago', l: 'Days Since Last Period Started', p: '5', min: 0, max: 45 },
    ],
    fn: (v) => {
      const ovulation_day = v.cycle_length - 14
      const days_since_lmp = v.lmp_days_ago
      const days_to_ovulation = ovulation_day - days_since_lmp
      const fertile_start = days_to_ovulation - 5
      const fertile_end = days_to_ovulation + 1
      return {
        primary: { value: Math.max(0, days_to_ovulation), label: 'Days Until Ovulation', fmt: 'num' },
        details: [
          { l: 'Fertile Window Start', v: Math.max(0, fertile_start), fmt: 'num' },
          { l: 'Fertile Window End', v: Math.max(0, fertile_end), fmt: 'num' },
          { l: 'Ovulation Day of Cycle', v: ovulation_day, fmt: 'num' },
        ],
        note: 'Most fertile 5 days before and 1 day after ovulation. Cycles vary — this is an estimate based on average luteal phase of 14 days.',
      }
    },
    about: 'Ovulation typically occurs 14 days before the next period — not 14 days after the last, as commonly misunderstood. The fertile window spans 5–6 days (sperm survive 3–5 days; egg is viable 12–24 hours). Cycle tracking apps like Clue and Flo use basal body temperature and LH surge data for more accuracy.',
    related: ['due-date-calculator', 'pregnancy-weight-gain-calculator', 'bmi-calculator'],
  },
  {
    slug: 'medication-dosage-calculator',
    title: 'Medication Dosage Calculator',
    desc: 'Calculate medication dose based on body weight (mg/kg dosing).',
    cat: 'health', icon: '💊',
    fields: [
      { k: 'weight', l: 'Patient Weight', p: '154', min: 1, u: 'lbs' },
      { k: 'dose_per_kg', l: 'Dose (mg per kg)', p: '10', min: 0, u: 'mg/kg' },
      { k: 'frequency', l: 'Doses per Day', p: '2', min: 1, max: 24 },
    ],
    fn: (v) => {
      const weightKg = v.weight * 0.453592
      const single_dose = weightKg * v.dose_per_kg
      const daily_dose = single_dose * v.frequency
      return {
        primary: { value: parseFloat(single_dose.toFixed(1)), label: 'Single Dose (mg)', fmt: 'num' },
        details: [
          { l: 'Daily Total Dose', v: parseFloat(daily_dose.toFixed(1)), fmt: 'num' },
          { l: 'Weight in kg', v: parseFloat(weightKg.toFixed(1)), fmt: 'num' },
          { l: 'Doses per Day', v: v.frequency, fmt: 'num' },
        ],
        note: 'Always verify dosing with a licensed pharmacist or physician. This calculator is for educational purposes only.',
      }
    },
    about: 'Weight-based dosing (mg/kg) is standard for pediatric medications and many antibiotics, anticoagulants, and chemotherapy agents. Common examples: amoxicillin 25–45 mg/kg/day, ibuprofen 5–10 mg/kg per dose, and enoxaparin 1 mg/kg per dose for DVT treatment.',
    related: ['bmi-calculator', 'lean-body-mass-calculator', 'bsa-calculator'],
  },
  {
    slug: 'bsa-calculator',
    title: 'Body Surface Area (BSA) Calculator',
    desc: 'Calculate body surface area for medication dosing using multiple formulas.',
    cat: 'health', icon: '📐',
    fields: [
      { k: 'weight', l: 'Weight', p: '154', min: 1, u: 'lbs' },
      { k: 'height', l: 'Height', p: '68', min: 1, u: 'inches' },
    ],
    fn: (v) => {
      const weightKg = v.weight * 0.453592
      const heightCm = v.height * 2.54
      // DuBois formula
      const dubois = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(weightKg, 0.425)
      // Mosteller formula (simpler)
      const mosteller = Math.sqrt((heightCm * weightKg) / 3600)
      return {
        primary: { value: parseFloat(mosteller.toFixed(3)), label: 'BSA — Mosteller Formula (m²)', fmt: 'num' },
        details: [
          { l: 'BSA — DuBois Formula', v: parseFloat(dubois.toFixed(3)), fmt: 'num' },
          { l: 'Average Adult BSA', v: '1.7 m²', fmt: 'txt' },
          { l: 'Weight (kg)', v: parseFloat(weightKg.toFixed(1)), fmt: 'num' },
        ],
        note: 'BSA is used to dose chemotherapy, cardiac index calculations, and burn area assessments.',
      }
    },
    about: 'BSA is used in oncology for chemotherapy dosing — using BSA rather than body weight is thought to reduce inter-patient variability. The Mosteller formula (√[height×weight/3600]) is preferred for simplicity and accuracy. Average adult BSA is about 1.7 m².',
    related: ['medication-dosage-calculator', 'bmi-calculator', 'lean-body-mass-calculator'],
  },
  {
    slug: 'pregnancy-weight-gain-calculator',
    title: 'Pregnancy Weight Gain Calculator',
    desc: 'Calculate recommended weight gain during pregnancy based on pre-pregnancy BMI.',
    cat: 'health', icon: '🤰',
    fields: [
      { k: 'pre_bmi', l: 'Pre-Pregnancy BMI', p: '22', min: 10, max: 60 },
      { k: 'weeks', l: 'Current Gestational Week', p: '20', min: 1, max: 42 },
    ],
    fn: (v) => {
      let rec_min: number, rec_max: number, rate_min: number, rate_max: number
      if (v.pre_bmi < 18.5) { rec_min = 28; rec_max = 40; rate_min = 0.51; rate_max = 0.59 }
      else if (v.pre_bmi < 25) { rec_min = 25; rec_max = 35; rate_min = 0.36; rate_max = 0.45 }
      else if (v.pre_bmi < 30) { rec_min = 15; rec_max = 25; rate_min = 0.23; rate_max = 0.32 }
      else { rec_min = 11; rec_max = 20; rate_min = 0.17; rate_max = 0.27 }
      const expected_min = v.weeks <= 13 ? 2 : 2 + (v.weeks - 13) * rate_min
      const expected_max = v.weeks <= 13 ? 4 : 4 + (v.weeks - 13) * rate_max
      return {
        primary: { value: rec_min, label: `Total Recommended Gain: ${rec_min}–${rec_max} lbs`, fmt: 'num' },
        details: [
          { l: `Expected Gain by Week ${v.weeks}`, v: `${expected_min.toFixed(1)}–${expected_max.toFixed(1)} lbs`, fmt: 'txt' },
          { l: 'Pre-Pregnancy BMI Category', v: v.pre_bmi < 18.5 ? 'Underweight' : v.pre_bmi < 25 ? 'Normal' : v.pre_bmi < 30 ? 'Overweight' : 'Obese', fmt: 'txt' },
        ],
        note: 'Guidelines from American College of Obstetricians and Gynecologists (ACOG). Consult your OB-GYN for personalized guidance.',
      }
    },
    about: 'IOM/ACOG guidelines recommend 25–35 lbs total gain for normal-weight women (BMI 18.5–24.9), 28–40 lbs for underweight women, and 11–20 lbs for obese women. Most gain should occur in the second and third trimesters (1–2 lbs/month in the first trimester).',
    related: ['due-date-calculator', 'bmi-calculator', 'ovulation-calculator'],
  },
  {
    slug: 'newborn-feeding-calculator',
    title: 'Newborn Feeding Calculator',
    desc: 'Calculate breast milk or formula needs for a newborn by age and weight.',
    cat: 'health', icon: '👶',
    fields: [
      { k: 'weight_lbs', l: 'Baby Weight', p: '8', min: 1, max: 25, u: 'lbs' },
      { k: 'age_weeks', l: 'Baby Age', p: '4', min: 0, max: 52, u: 'weeks' },
    ],
    fn: (v) => {
      const weightOz = v.weight_lbs * 16
      const dailyOz = v.age_weeks <= 1 ? weightOz * 0.07 : Math.min(weightOz * 0.10, 32)
      const feeds = v.age_weeks <= 1 ? 10 : v.age_weeks <= 4 ? 8 : v.age_weeks <= 12 ? 6 : 5
      const perFeed = dailyOz / feeds
      return {
        primary: { value: parseFloat(dailyOz.toFixed(1)), label: 'Daily Milk/Formula Need (oz)', fmt: 'num' },
        details: [
          { l: 'Feedings per Day', v: feeds, fmt: 'num' },
          { l: 'Per Feeding', v: parseFloat(perFeed.toFixed(1)), fmt: 'num' },
          { l: 'In mL per feeding', v: parseFloat((perFeed * 29.57).toFixed(0)), fmt: 'num' },
        ],
        note: 'AAP recommends exclusive breastfeeding for first 6 months. Watch for hunger cues — feed on demand, not by schedule.',
      }
    },
    about: 'Newborns typically need 2–3 oz of formula or breast milk per feeding every 3–4 hours. The AAP recommends about 2.5 oz per pound of body weight daily (up to 32 oz). By 6 months, when solid foods begin, milk intake stabilizes at about 24–32 oz/day.',
    related: ['due-date-calculator', 'pregnancy-weight-gain-calculator', 'bmi-calculator'],
  },
  {
    slug: 'waist-to-hip-ratio-calculator',
    title: 'Waist-to-Hip Ratio Calculator',
    desc: 'Calculate waist-to-hip ratio and cardiovascular disease risk.',
    cat: 'health', icon: '📏',
    fields: [
      { k: 'waist', l: 'Waist Circumference', p: '34', min: 1, u: 'inches' },
      { k: 'hip', l: 'Hip Circumference', p: '40', min: 1, u: 'inches' },
      { k: 'sex', l: 'Sex', t: 'sel', p: '1', op: [['1','Male'],['0','Female']] },
    ],
    fn: (v) => {
      const whr = v.waist / v.hip
      let risk: string
      if (v.sex === 1) {
        risk = whr < 0.90 ? 'Low Risk' : whr < 0.95 ? 'Moderate Risk' : 'High Risk'
      } else {
        risk = whr < 0.80 ? 'Low Risk' : whr < 0.85 ? 'Moderate Risk' : 'High Risk'
      }
      return {
        primary: { value: parseFloat(whr.toFixed(2)), label: 'Waist-to-Hip Ratio', fmt: 'num' },
        details: [
          { l: 'Cardiovascular Risk', v: risk, fmt: 'txt', color: risk === 'Low Risk' ? 'var(--green)' : risk === 'Moderate Risk' ? '#fbbf24' : '#f87171' },
          { l: 'WHO Low-Risk Threshold', v: v.sex === 1 ? '< 0.90 (men)' : '< 0.80 (women)', fmt: 'txt' },
        ],
      }
    },
    about: 'WHR is a better predictor of cardiovascular risk than BMI because it measures central adiposity (visceral fat). The WHO considers WHR above 0.90 for men and 0.85 for women as "substantially increased" cardiovascular risk. Apple-shaped fat distribution (waist-heavy) is more dangerous than pear-shaped (hip-heavy).',
    related: ['bmi-calculator', 'body-fat-percentage-calculator', 'ideal-weight-calculator'],
  },
  {
    slug: 'calories-burned-cycling-calculator',
    title: 'Calories Burned Cycling Calculator',
    desc: 'Calculate calories burned during cycling based on weight, speed, and duration.',
    cat: 'health', icon: '🚴',
    fields: [
      { k: 'weight', l: 'Body Weight', p: '160', min: 0, u: 'lbs' },
      { k: 'duration', l: 'Duration', p: '45', min: 0, u: 'minutes' },
      { k: 'intensity', l: 'Cycling Intensity', t: 'sel', p: '1', op: [['0','Light (< 12 mph) — MET 6'],['1','Moderate (12–14 mph) — MET 8'],['2','Vigorous (14–16 mph) — MET 10'],['3','Racing (> 16 mph) — MET 12']] },
    ],
    fn: (v) => {
      const mets = [6, 8, 10, 12]
      const met = mets[v.intensity]
      const weightKg = v.weight * 0.453592
      const hours = v.duration / 60
      const calories = met * weightKg * hours
      return {
        primary: { value: parseFloat(calories.toFixed(0)), label: 'Calories Burned', fmt: 'num' },
        details: [
          { l: 'Per Hour', v: parseFloat((calories / hours).toFixed(0)), fmt: 'num' },
          { l: 'MET Value', v: met, fmt: 'num' },
          { l: 'Duration (hours)', v: parseFloat(hours.toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'Moderate cycling (12–14 mph) burns 400–600 calories/hour for a 160-lb rider. Indoor cycling classes often cite "600–1,000 calories" — these figures are significantly inflated. Research shows actual burns average 350–600 calories/hour for spin classes at typical intensities.',
    related: ['calories-burned-running-calculator', 'calories-burned-walking-calculator', 'tdee-calculator'],
  },
]
