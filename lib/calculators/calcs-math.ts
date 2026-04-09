import type { CalcConfig } from './types'

export const mathCalcs: CalcConfig[] = [
  {
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    desc: 'Calculate percentages — find what percent of a number is, or what a number is X% of.',
    cat: 'math', icon: '📊',
    fields: [
      { k: 'value', l: 'Value', p: '75', min: 0 },
      { k: 'total', l: 'Total', p: '200', min: 0.001 },
    ],
    fn: (v) => {
      const pct = (v.value / v.total) * 100
      const reverse = v.total * (v.value / 100)
      return {
        primary: { value: parseFloat(pct.toFixed(4)), label: `${v.value} is what % of ${v.total}`, fmt: 'pct' },
        details: [
          { l: `${v.value}% of ${v.total} =`, v: parseFloat(reverse.toFixed(4)), fmt: 'num' },
          { l: 'Ratio (as fraction)', v: parseFloat((v.value / v.total).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'Percentage calculations underpin finance, statistics, and everyday shopping. The word "percent" comes from Latin "per centum" — by the hundred. A percentage is simply a ratio expressed as parts per 100.',
    related: ['percentage-change-calculator', 'ratio-calculator', 'average-calculator'],
  },
  {
    slug: 'percentage-change-calculator',
    title: 'Percentage Change Calculator',
    desc: 'Calculate the percentage increase or decrease between two values.',
    cat: 'math', icon: '📈',
    fields: [
      { k: 'old_value', l: 'Original Value', p: '120', min: 0 },
      { k: 'new_value', l: 'New Value', p: '150', min: 0 },
    ],
    fn: (v) => {
      if (v.old_value === 0) throw new Error('Original value cannot be zero.')
      const change = v.new_value - v.old_value
      const pct = (change / v.old_value) * 100
      return {
        primary: { value: parseFloat(pct.toFixed(4)), label: 'Percentage Change', fmt: 'pct' },
        details: [
          { l: 'Absolute Change', v: parseFloat(change.toFixed(4)), fmt: 'num', color: change >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'Direction', v: change >= 0 ? 'Increase' : 'Decrease', fmt: 'txt', color: change >= 0 ? 'var(--green)' : '#f87171' },
          { l: 'New Value as % of Original', v: parseFloat(((v.new_value / v.old_value) * 100).toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Percentage change is used universally in finance, science, and policy. A 50% increase followed by a 33.3% decrease returns to the original — these are not symmetric, which confuses most people. A 100% increase doubles a value; a 100% decrease eliminates it.',
    related: ['percentage-calculator', 'inflation-calculator', 'roi-calculator'],
  },
  {
    slug: 'average-calculator',
    title: 'Average (Mean) Calculator',
    desc: 'Calculate the arithmetic mean, sum, and count of a set of numbers.',
    cat: 'math', icon: '➗',
    fields: [
      { k: 'n1', l: 'Value 1', p: '10', u: '' },
      { k: 'n2', l: 'Value 2', p: '20', u: '' },
      { k: 'n3', l: 'Value 3', p: '30', u: '' },
      { k: 'n4', l: 'Value 4', p: '40', u: '' },
      { k: 'n5', l: 'Value 5', p: '50', u: '' },
    ],
    fn: (v) => {
      const values = [v.n1, v.n2, v.n3, v.n4, v.n5].filter(x => x !== 0 || true)
      const sum = values.reduce((a, b) => a + b, 0)
      const mean = sum / values.length
      const min = Math.min(...values)
      const max = Math.max(...values)
      return {
        primary: { value: parseFloat(mean.toFixed(4)), label: 'Average (Mean)', fmt: 'num' },
        details: [
          { l: 'Sum', v: parseFloat(sum.toFixed(4)), fmt: 'num' },
          { l: 'Count', v: values.length, fmt: 'num' },
          { l: 'Min', v: min, fmt: 'num' },
          { l: 'Max', v: max, fmt: 'num' },
          { l: 'Range', v: max - min, fmt: 'num' },
        ],
      }
    },
    about: 'The arithmetic mean is the sum of all values divided by the count. It\'s sensitive to outliers — a billionaire moving to a neighborhood raises the average income dramatically. The median (middle value) is more robust for skewed distributions like income data.',
    related: ['median-calculator', 'standard-deviation-calculator', 'percentage-calculator'],
  },
  {
    slug: 'standard-deviation-calculator',
    title: 'Standard Deviation Calculator',
    desc: 'Calculate the standard deviation and variance of a data set.',
    cat: 'math', icon: '📉',
    fields: [
      { k: 'n1', l: 'Value 1', p: '10' },
      { k: 'n2', l: 'Value 2', p: '20' },
      { k: 'n3', l: 'Value 3', p: '30' },
      { k: 'n4', l: 'Value 4', p: '40' },
      { k: 'n5', l: 'Value 5', p: '50' },
    ],
    fn: (v) => {
      const values = [v.n1, v.n2, v.n3, v.n4, v.n5]
      const n = values.length
      const mean = values.reduce((a, b) => a + b, 0) / n
      const variance_pop = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / n
      const variance_sample = values.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1)
      const std_pop = Math.sqrt(variance_pop)
      const std_sample = Math.sqrt(variance_sample)
      return {
        primary: { value: parseFloat(std_sample.toFixed(4)), label: 'Sample Standard Deviation', fmt: 'num' },
        details: [
          { l: 'Population Std Dev (σ)', v: parseFloat(std_pop.toFixed(4)), fmt: 'num' },
          { l: 'Sample Variance', v: parseFloat(variance_sample.toFixed(4)), fmt: 'num' },
          { l: 'Mean', v: parseFloat(mean.toFixed(4)), fmt: 'num' },
          { l: 'Coefficient of Variation', v: parseFloat((std_sample / Math.abs(mean) * 100).toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Standard deviation measures the spread of data around the mean. In a normal distribution, ~68% of values fall within 1 standard deviation, ~95% within 2, and ~99.7% within 3. Investment volatility, quality control, and academic testing all use standard deviation extensively.',
    related: ['average-calculator', 'variance-calculator', 'probability-calculator'],
  },
  {
    slug: 'probability-calculator',
    title: 'Probability Calculator',
    desc: 'Calculate basic probability and combined event probabilities.',
    cat: 'math', icon: '🎲',
    fields: [
      { k: 'favorable', l: 'Favorable Outcomes', p: '3', min: 0 },
      { k: 'total', l: 'Total Possible Outcomes', p: '10', min: 1 },
    ],
    fn: (v) => {
      if (v.favorable > v.total) throw new Error('Favorable outcomes cannot exceed total outcomes.')
      const prob = v.favorable / v.total
      const notProb = 1 - prob
      const odds_for = `${v.favorable} : ${v.total - v.favorable}`
      const pct = prob * 100
      return {
        primary: { value: parseFloat(pct.toFixed(4)), label: 'Probability (%)', fmt: 'pct' },
        details: [
          { l: 'As Fraction', v: `${v.favorable}/${v.total}`, fmt: 'txt' },
          { l: 'As Decimal', v: parseFloat(prob.toFixed(6)), fmt: 'num' },
          { l: 'Odds For', v: odds_for, fmt: 'txt' },
          { l: 'Probability of NOT occurring', v: parseFloat((notProb * 100).toFixed(4)), fmt: 'pct' },
        ],
      }
    },
    about: 'Probability ranges from 0 (impossible) to 1 (certain). A coin flip is 50% probability; rolling a 6 on a die is 16.67%. The gambler\'s fallacy — believing past outcomes affect future independent events — is one of the most common reasoning errors in human cognition.',
    related: ['combinations-calculator', 'permutations-calculator', 'standard-deviation-calculator'],
  },
  {
    slug: 'combinations-calculator',
    title: 'Combinations Calculator (nCr)',
    desc: 'Calculate the number of combinations when selecting r items from n items.',
    cat: 'math', icon: '🃏',
    fields: [
      { k: 'n', l: 'Total Items (n)', p: '10', min: 0, max: 30 },
      { k: 'r', l: 'Items to Select (r)', p: '3', min: 0, max: 30 },
    ],
    fn: (v) => {
      if (v.r > v.n) throw new Error('r cannot exceed n.')
      const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1)
      const nCr = factorial(v.n) / (factorial(v.r) * factorial(v.n - v.r))
      const nPr = factorial(v.n) / factorial(v.n - v.r)
      return {
        primary: { value: nCr, label: `C(${v.n}, ${v.r}) — Combinations`, fmt: 'num' },
        details: [
          { l: 'Permutations P(n,r)', v: nPr, fmt: 'num' },
          { l: 'Ratio (Perm/Comb)', v: parseFloat((nPr / nCr).toFixed(0)), fmt: 'num' },
        ],
        note: 'Combinations: order does NOT matter. Permutations: order matters.',
      }
    },
    about: 'Combinations (nCr) count the number of ways to select r items from n when order doesn\'t matter. Choosing a 3-person committee from 10 candidates has C(10,3) = 120 possibilities. The binomial coefficient nCr appears in Pascal\'s Triangle and the binomial theorem.',
    related: ['permutations-calculator', 'factorial-calculator', 'probability-calculator'],
  },
  {
    slug: 'permutations-calculator',
    title: 'Permutations Calculator (nPr)',
    desc: 'Calculate the number of ordered arrangements of r items from n items.',
    cat: 'math', icon: '🔢',
    fields: [
      { k: 'n', l: 'Total Items (n)', p: '8', min: 0, max: 20 },
      { k: 'r', l: 'Items to Arrange (r)', p: '3', min: 0, max: 20 },
    ],
    fn: (v) => {
      if (v.r > v.n) throw new Error('r cannot exceed n.')
      const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1)
      const nPr = factorial(v.n) / factorial(v.n - v.r)
      const nCr = factorial(v.n) / (factorial(v.r) * factorial(v.n - v.r))
      return {
        primary: { value: nPr, label: `P(${v.n}, ${v.r}) — Permutations`, fmt: 'num' },
        details: [
          { l: 'Combinations C(n,r)', v: nCr, fmt: 'num' },
          { l: 'r! (overcounting factor)', v: parseFloat(factorial(v.r).toFixed(0)), fmt: 'num' },
        ],
        note: 'Permutations: order DOES matter. The number of ways to arrange 3 people in 3 seats from 8 candidates.',
      }
    },
    about: 'Permutations count ordered arrangements — the number of ways to win gold, silver, and bronze from 8 runners is P(8,3) = 336. Combinations divide this by r! to remove order. Password cracking time estimates use permutations: a 6-character alphanumeric password has 62^6 = 56.8 billion permutations.',
    related: ['combinations-calculator', 'factorial-calculator', 'probability-calculator'],
  },
  {
    slug: 'factorial-calculator',
    title: 'Factorial Calculator',
    desc: 'Calculate the factorial of any non-negative integer (n!).',
    cat: 'math', icon: '❗',
    fields: [
      { k: 'n', l: 'n (non-negative integer)', p: '10', min: 0, max: 20 },
    ],
    fn: (v) => {
      const factorial = (num: number): number => num <= 1 ? 1 : num * factorial(num - 1)
      const result = factorial(v.n)
      const digits = result.toString().length
      return {
        primary: { value: result, label: `${v.n}! =`, fmt: 'num' },
        details: [
          { l: 'Number of Digits', v: digits, fmt: 'num' },
          { l: 'Applied: Permutations of n items', v: result, fmt: 'num' },
          { l: 'Applied: Deck combinations (52!)', v: '8.07 × 10^67', fmt: 'txt' },
        ],
      }
    },
    about: 'Factorial growth is explosive — 10! = 3,628,800 and 20! = 2.4 quintillion. A standard 52-card deck has 52! unique arrangements — more than the number of atoms on Earth — yet every shuffled deck you\'ve ever held had a unique order never seen before in human history.',
    related: ['combinations-calculator', 'permutations-calculator', 'probability-calculator'],
  },
  {
    slug: 'prime-number-checker',
    title: 'Prime Number Checker',
    desc: 'Check if a number is prime and find its factors.',
    cat: 'math', icon: '🔍',
    fields: [
      { k: 'num', l: 'Number to Check', p: '97', min: 2, max: 1000000 },
    ],
    fn: (v) => {
      const n = Math.floor(v.num)
      if (n < 2) throw new Error('Prime numbers must be greater than 1.')
      const factors: number[] = []
      for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          factors.push(i)
          if (i !== n / i) factors.push(n / i)
        }
      }
      factors.sort((a, b) => a - b)
      const isPrime = factors.length === 0
      return {
        primary: { value: isPrime ? 1 : 0, label: isPrime ? `${n} IS a prime number` : `${n} is NOT prime`, fmt: 'txt' },
        details: [
          { l: 'Prime?', v: isPrime ? 'Yes' : 'No', fmt: 'txt', color: isPrime ? 'var(--green)' : '#f87171' },
          { l: 'Factors (excluding 1 and n)', v: isPrime ? 'None' : factors.slice(0, 8).join(', '), fmt: 'txt' },
          { l: 'Number of Divisors', v: isPrime ? 2 : factors.length + 2, fmt: 'num' },
        ],
      }
    },
    about: 'Prime numbers are the building blocks of all integers — every positive integer has a unique prime factorization (Fundamental Theorem of Arithmetic). The largest known prime as of 2024 has over 41 million digits. Primes underpin modern cryptography, including RSA encryption that secures the internet.',
    related: ['gcf-calculator', 'lcm-calculator', 'factorial-calculator'],
  },
  {
    slug: 'gcf-calculator',
    title: 'Greatest Common Factor (GCF) Calculator',
    desc: 'Find the greatest common factor (GCD) of two numbers using the Euclidean algorithm.',
    cat: 'math', icon: '🔗',
    fields: [
      { k: 'a', l: 'First Number', p: '48', min: 1 },
      { k: 'b', l: 'Second Number', p: '18', min: 1 },
    ],
    fn: (v) => {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
      const a = Math.floor(v.a), b = Math.floor(v.b)
      const result = gcd(a, b)
      const lcm = (a * b) / result
      return {
        primary: { value: result, label: 'Greatest Common Factor', fmt: 'num' },
        details: [
          { l: 'LCM', v: lcm, fmt: 'num' },
          { l: `${a} / GCF`, v: a / result, fmt: 'num' },
          { l: `${b} / GCF`, v: b / result, fmt: 'num' },
        ],
        note: 'The GCF × LCM = a × b for any two positive integers.',
      }
    },
    about: 'The Euclidean algorithm (circa 300 BCE) finds the GCD by repeated division — one of the oldest algorithms in mathematics. GCF is used to simplify fractions: 48/18 simplifies to 8/3 (dividing both by GCF of 6). Cryptography uses extended Euclidean algorithm for modular inverse calculations.',
    related: ['lcm-calculator', 'prime-number-checker', 'fraction-calculator'],
  },
  {
    slug: 'lcm-calculator',
    title: 'Least Common Multiple (LCM) Calculator',
    desc: 'Find the least common multiple of two numbers.',
    cat: 'math', icon: '🔀',
    fields: [
      { k: 'a', l: 'First Number', p: '12', min: 1 },
      { k: 'b', l: 'Second Number', p: '8', min: 1 },
    ],
    fn: (v) => {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
      const a = Math.floor(v.a), b = Math.floor(v.b)
      const gcf = gcd(a, b)
      const lcm = (a * b) / gcf
      return {
        primary: { value: lcm, label: 'Least Common Multiple', fmt: 'num' },
        details: [
          { l: 'GCF', v: gcf, fmt: 'num' },
          { l: 'Verification: LCM × GCF = a × b', v: lcm * gcf, fmt: 'num' },
        ],
      }
    },
    about: 'LCM is used to add fractions with different denominators and to find the period of repeating events. If event A repeats every 12 days and event B every 8 days, they next coincide in LCM(12,8) = 24 days. LCM has applications in gear ratios, music rhythm, and scheduling problems.',
    related: ['gcf-calculator', 'fraction-calculator', 'ratio-calculator'],
  },
  {
    slug: 'fraction-calculator',
    title: 'Fraction Calculator',
    desc: 'Add, subtract, multiply, or divide two fractions with simplified results.',
    cat: 'math', icon: '½',
    fields: [
      { k: 'n1', l: 'Numerator 1', p: '3' },
      { k: 'd1', l: 'Denominator 1', p: '4', min: 1 },
      { k: 'op', l: 'Operation', t: 'sel', p: '0', op: [['0','Add (+)'],['1','Subtract (−)'],['2','Multiply (×)'],['3','Divide (÷)']] },
      { k: 'n2', l: 'Numerator 2', p: '1' },
      { k: 'd2', l: 'Denominator 2', p: '3', min: 1 },
    ],
    fn: (v) => {
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
      let rn: number, rd: number
      if (v.op === 0) { rn = v.n1 * v.d2 + v.n2 * v.d1; rd = v.d1 * v.d2 }
      else if (v.op === 1) { rn = v.n1 * v.d2 - v.n2 * v.d1; rd = v.d1 * v.d2 }
      else if (v.op === 2) { rn = v.n1 * v.n2; rd = v.d1 * v.d2 }
      else {
        if (v.n2 === 0) throw new Error('Cannot divide by zero.')
        rn = v.n1 * v.d2; rd = v.d1 * v.n2
      }
      const g = gcd(Math.abs(rn), Math.abs(rd))
      const fn = rn / g, fd = rd / g
      const decimal = fn / fd
      return {
        primary: { value: parseFloat(decimal.toFixed(6)), label: `${fn}/${fd}`, fmt: 'num' },
        details: [
          { l: 'Result Fraction', v: `${fn} / ${fd}`, fmt: 'txt' },
          { l: 'Decimal', v: parseFloat(decimal.toFixed(6)), fmt: 'num' },
          { l: 'Mixed Number', v: fd === 1 ? `${fn}` : `${Math.floor(Math.abs(fn) / fd)} and ${Math.abs(fn) % fd}/${fd}`, fmt: 'txt' },
        ],
      }
    },
    about: 'Fraction arithmetic follows precise rules: addition requires finding a common denominator, multiplication simply multiplies numerators and denominators. Ancient Egyptians used only unit fractions (1/n) in the Rhind Mathematical Papyrus from 1650 BCE.',
    related: ['decimal-to-fraction-calculator', 'ratio-calculator', 'percentage-calculator'],
  },
  {
    slug: 'ratio-calculator',
    title: 'Ratio Calculator',
    desc: 'Calculate and simplify ratios, find equivalent ratios, or solve ratio proportions.',
    cat: 'math', icon: '⚖️',
    fields: [
      { k: 'a', l: 'A', p: '15', min: 0 },
      { k: 'b', l: 'B', p: '25', min: 0.001 },
    ],
    fn: (v) => {
      const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
      const scale = 100
      const an = Math.round(v.a * scale), bn = Math.round(v.b * scale)
      const g = gcd(an, bn)
      const sn = an / g, sd = bn / g
      const pct = (v.a / v.b) * 100
      const perUnit = v.a / v.b
      return {
        primary: { value: parseFloat(perUnit.toFixed(4)), label: 'Ratio (A:B)', fmt: 'num' },
        details: [
          { l: 'Simplified Ratio', v: `${sn} : ${sd}`, fmt: 'txt' },
          { l: 'A as % of B', v: parseFloat(pct.toFixed(2)), fmt: 'pct' },
          { l: 'B as % of A', v: parseFloat((100 / perUnit).toFixed(2)), fmt: 'pct' },
        ],
      }
    },
    about: 'Ratios express the relative size of two quantities. The golden ratio (φ ≈ 1.618) appears in art, architecture, and nature. The S&P 500\'s price-to-earnings ratio is one of the most widely watched ratios in finance. Map scales, cooking recipes, and pharmacological dilutions all use ratio math.',
    related: ['fraction-calculator', 'proportion-calculator', 'percentage-calculator'],
  },
  {
    slug: 'proportion-calculator',
    title: 'Proportion Calculator',
    desc: 'Solve proportions and find missing values in equivalent ratios.',
    cat: 'math', icon: '🔢',
    fields: [
      { k: 'a', l: 'A', p: '3', min: 0 },
      { k: 'b', l: 'B', p: '4', min: 0.001 },
      { k: 'c', l: 'C', p: '9', min: 0 },
    ],
    fn: (v) => {
      // Solve: A/B = C/X → X = B*C/A
      if (v.a === 0) throw new Error('A cannot be zero.')
      const x = (v.b * v.c) / v.a
      const ratio = v.a / v.b
      return {
        primary: { value: parseFloat(x.toFixed(4)), label: 'X (missing value in A/B = C/X)', fmt: 'num' },
        details: [
          { l: 'Proportion', v: `${v.a}/${v.b} = ${v.c}/${x.toFixed(4)}`, fmt: 'txt' },
          { l: 'Base Ratio (A:B)', v: parseFloat(ratio.toFixed(4)), fmt: 'num' },
          { l: 'Verification: Cross Product', v: parseFloat((v.a * x).toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'Proportions are equations stating two ratios are equal. Cross-multiplication (ad = bc) is the universal solution method. Recipe scaling, map reading, exchange rates, and speed problems all involve proportion. If 3 workers complete a job in 4 days, 9 workers finish in X = 4×3/9 = 1.33 days.',
    related: ['ratio-calculator', 'fraction-calculator', 'percentage-calculator'],
  },
  {
    slug: 'area-calculator',
    title: 'Area Calculator',
    desc: 'Calculate the area of common geometric shapes — rectangles, circles, triangles.',
    cat: 'math', icon: '📐',
    fields: [
      { k: 'shape', l: 'Shape', t: 'sel', p: '0', op: [['0','Rectangle'],['1','Circle'],['2','Triangle'],['3','Trapezoid']] },
      { k: 'dim1', l: 'Length / Radius / Base', p: '10', min: 0, u: 'units' },
      { k: 'dim2', l: 'Width / Height', p: '5', min: 0, u: 'units' },
    ],
    fn: (v) => {
      let area: number
      let formula: string
      if (v.shape === 0) { area = v.dim1 * v.dim2; formula = 'L × W' }
      else if (v.shape === 1) { area = Math.PI * v.dim1 * v.dim1; formula = 'π × r²' }
      else if (v.shape === 2) { area = 0.5 * v.dim1 * v.dim2; formula = '½ × b × h' }
      else { area = 0.5 * (v.dim1 + v.dim2) * 5; formula = '½ × (b₁+b₂) × h (h=5)' }
      return {
        primary: { value: parseFloat(area.toFixed(4)), label: `Area (${formula})`, fmt: 'num' },
        details: [
          { l: 'Formula', v: formula, fmt: 'txt' },
          { l: 'Perimeter (rect.)', v: v.shape === 0 ? 2 * (v.dim1 + v.dim2) : v.shape === 1 ? parseFloat((2 * Math.PI * v.dim1).toFixed(4)) : 0, fmt: 'num' },
        ],
      }
    },
    about: 'Area formulas are foundational in architecture, construction, agriculture, and design. The circle area formula (πr²) was first proven by Archimedes around 250 BCE. A hectare (100m × 100m) = 10,000 m²; an acre = 4,047 m². Commercial real estate pricing by price per square foot uses area calculation constantly.',
    related: ['volume-calculator', 'perimeter-calculator', 'pythagorean-theorem-calculator'],
  },
  {
    slug: 'volume-calculator',
    title: 'Volume Calculator',
    desc: 'Calculate the volume of common 3D shapes.',
    cat: 'math', icon: '📦',
    fields: [
      { k: 'shape', l: 'Shape', t: 'sel', p: '0', op: [['0','Rectangular Box'],['1','Sphere'],['2','Cylinder'],['3','Cone']] },
      { k: 'dim1', l: 'Length / Radius', p: '10', min: 0, u: 'units' },
      { k: 'dim2', l: 'Width / Height', p: '5', min: 0, u: 'units' },
      { k: 'dim3', l: 'Height (box/cylinder)', p: '3', min: 0, u: 'units' },
    ],
    fn: (v) => {
      let vol: number, formula: string
      if (v.shape === 0) { vol = v.dim1 * v.dim2 * v.dim3; formula = 'L × W × H' }
      else if (v.shape === 1) { vol = (4 / 3) * Math.PI * Math.pow(v.dim1, 3); formula = '(4/3)πr³' }
      else if (v.shape === 2) { vol = Math.PI * v.dim1 * v.dim1 * v.dim2; formula = 'πr²h' }
      else { vol = (1 / 3) * Math.PI * v.dim1 * v.dim1 * v.dim2; formula = '(1/3)πr²h' }
      return {
        primary: { value: parseFloat(vol.toFixed(4)), label: `Volume (${formula})`, fmt: 'num' },
        details: [{ l: 'Formula', v: formula, fmt: 'txt' }, { l: 'In Liters (if cm)', v: parseFloat((vol / 1000).toFixed(4)), fmt: 'num' }],
      }
    },
    about: 'Archimedes discovered that a sphere\'s volume is exactly 2/3 of its circumscribed cylinder — a result he considered his greatest achievement. Volume calculations underpin shipping logistics, storage design, pharmaceutical dosing, and fluid dynamics.',
    related: ['area-calculator', 'perimeter-calculator', 'unit-converter'],
  },
  {
    slug: 'pythagorean-theorem-calculator',
    title: 'Pythagorean Theorem Calculator',
    desc: 'Find any side of a right triangle using the Pythagorean theorem (a² + b² = c²).',
    cat: 'math', icon: '📐',
    fields: [
      { k: 'known', l: 'Find', t: 'sel', p: '2', op: [['0','Side a (given b and c)'],['1','Side b (given a and c)'],['2','Hypotenuse c (given a and b)']] },
      { k: 'val1', l: 'First Known Side', p: '3', min: 0 },
      { k: 'val2', l: 'Second Known Side', p: '4', min: 0 },
    ],
    fn: (v) => {
      let result: number, label: string
      if (v.known === 2) { result = Math.sqrt(v.val1 * v.val1 + v.val2 * v.val2); label = 'Hypotenuse c' }
      else if (v.known === 0) { result = Math.sqrt(v.val2 * v.val2 - v.val1 * v.val1); label = 'Side a' }
      else { result = Math.sqrt(v.val2 * v.val2 - v.val1 * v.val1); label = 'Side b' }
      if (isNaN(result) || result < 0) throw new Error('Invalid triangle: hypotenuse must be the longest side.')
      const area = 0.5 * (v.known === 2 ? v.val1 * v.val2 : v.val1 * result)
      return {
        primary: { value: parseFloat(result.toFixed(6)), label, fmt: 'num' },
        details: [
          { l: 'Triangle Area', v: parseFloat(area.toFixed(4)), fmt: 'num' },
          { l: 'Perimeter', v: parseFloat((v.val1 + v.val2 + result).toFixed(4)), fmt: 'num' },
        ],
        note: 'Classic Pythagorean triples: (3,4,5), (5,12,13), (8,15,17), (7,24,25).',
      }
    },
    about: 'The Pythagorean theorem (a² + b² = c²) was known to Babylonian mathematicians 1,000 years before Pythagoras. The 3-4-5 right triangle has been used in construction for millennia to create perfect right angles. GPS positioning uses the 3D extension: a² + b² + c² = d².',
    related: ['area-calculator', 'triangle-calculator', 'distance-formula-calculator'],
  },
  {
    slug: 'square-root-calculator',
    title: 'Square Root Calculator',
    desc: 'Calculate the square root and cube root of any number.',
    cat: 'math', icon: '√',
    fields: [
      { k: 'num', l: 'Number', p: '144', min: 0 },
    ],
    fn: (v) => {
      const sqrt = Math.sqrt(v.num)
      const cbrt = Math.cbrt(v.num)
      return {
        primary: { value: parseFloat(sqrt.toFixed(8)), label: '√ Square Root', fmt: 'num' },
        details: [
          { l: '∛ Cube Root', v: parseFloat(cbrt.toFixed(8)), fmt: 'num' },
          { l: 'Square (n²)', v: v.num * v.num, fmt: 'num' },
          { l: 'Cube (n³)', v: v.num * v.num * v.num, fmt: 'num' },
          { l: 'Is Perfect Square?', v: Number.isInteger(sqrt) ? 'Yes' : 'No', fmt: 'txt' },
        ],
      }
    },
    about: 'The square root of 2 (√2 ≈ 1.41421...) was the first known irrational number — its discovery allegedly caused a crisis in Pythagorean philosophy, which held that all numbers are rational. The Newton-Raphson method is the most efficient algorithm for computing square roots numerically.',
    related: ['exponent-calculator', 'logarithm-calculator', 'pythagorean-theorem-calculator'],
  },
  {
    slug: 'exponent-calculator',
    title: 'Exponent Calculator',
    desc: 'Calculate any base raised to any exponent, including negative and decimal powers.',
    cat: 'math', icon: '🔢',
    fields: [
      { k: 'base', l: 'Base (b)', p: '2', min: 0 },
      { k: 'exp', l: 'Exponent (n)', p: '10', min: -100, max: 100 },
    ],
    fn: (v) => {
      const result = Math.pow(v.base, v.exp)
      const log = v.base > 0 ? Math.log(result) : 0
      return {
        primary: { value: parseFloat(result.toFixed(8)), label: `${v.base}^${v.exp}`, fmt: 'num' },
        details: [
          { l: 'Scientific Notation', v: result.toExponential(4), fmt: 'txt' },
          { l: 'Natural Log of Result', v: parseFloat(log.toFixed(6)), fmt: 'num' },
          { l: 'Log₁₀ of Result', v: parseFloat(Math.log10(result).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'Exponential functions appear in compound interest, population growth, radioactive decay, and Moore\'s Law (computing power doubling roughly every 2 years). The number e (≈ 2.71828) is the natural base of exponential growth, appearing in probability, statistics, and physics.',
    related: ['logarithm-calculator', 'square-root-calculator', 'compound-interest-calculator'],
  },
  {
    slug: 'logarithm-calculator',
    title: 'Logarithm Calculator',
    desc: 'Calculate logarithms in any base — natural log (ln), log base 10, or custom base.',
    cat: 'math', icon: 'ln',
    fields: [
      { k: 'num', l: 'Number (x)', p: '1000', min: 0.0001 },
      { k: 'base_sel', l: 'Log Base', t: 'sel', p: '10', op: [['10','Log base 10 (common)'],['2.718281828','Natural Log (ln, base e)'],['2','Log base 2 (binary)']] },
    ],
    fn: (v) => {
      const logResult = Math.log(v.num) / Math.log(v.base_sel)
      const ln = Math.log(v.num)
      const log10 = Math.log10(v.num)
      const log2 = Math.log2(v.num)
      return {
        primary: { value: parseFloat(logResult.toFixed(8)), label: `log(${v.num})`, fmt: 'num' },
        details: [
          { l: 'log₁₀', v: parseFloat(log10.toFixed(8)), fmt: 'num' },
          { l: 'ln (natural log)', v: parseFloat(ln.toFixed(8)), fmt: 'num' },
          { l: 'log₂ (binary)', v: parseFloat(log2.toFixed(8)), fmt: 'num' },
        ],
      }
    },
    about: 'Logarithms convert multiplication into addition — the mechanical advantage that made slide rules the primary calculating tool before computers. The Richter scale, pH scale, decibels, and musical intervals are all logarithmic. The natural logarithm appears in the formula for continuous compound interest: A = Pe^(rt).',
    related: ['exponent-calculator', 'square-root-calculator', 'scientific-notation-calculator'],
  },
  {
    slug: 'scientific-notation-calculator',
    title: 'Scientific Notation Calculator',
    desc: 'Convert numbers to and from scientific notation.',
    cat: 'math', icon: '🔬',
    fields: [
      { k: 'num', l: 'Number', p: '0.000045', min: -1e15, max: 1e15 },
    ],
    fn: (v) => {
      const abs = Math.abs(v.num)
      const exp = Math.floor(Math.log10(abs))
      const coeff = v.num / Math.pow(10, exp)
      return {
        primary: { value: v.num, label: 'Standard Form', fmt: 'num' },
        details: [
          { l: 'Scientific Notation', v: `${coeff.toFixed(6)} × 10^${exp}`, fmt: 'txt' },
          { l: 'Coefficient', v: parseFloat(coeff.toFixed(6)), fmt: 'num' },
          { l: 'Exponent', v: exp, fmt: 'num' },
          { l: 'Engineering Notation', v: v.num.toExponential(3), fmt: 'txt' },
        ],
      }
    },
    about: 'Scientific notation expresses very large or small numbers compactly. The speed of light is 3 × 10⁸ m/s; an electron\'s mass is 9.11 × 10⁻³¹ kg. The prefix system (kilo-, mega-, giga-) corresponds to powers of 10³.',
    related: ['exponent-calculator', 'logarithm-calculator', 'unit-converter'],
  },
  {
    slug: 'slope-calculator',
    title: 'Slope Calculator',
    desc: 'Calculate the slope, distance, and midpoint between two coordinate points.',
    cat: 'math', icon: '📈',
    fields: [
      { k: 'x1', l: 'x₁', p: '2' },
      { k: 'y1', l: 'y₁', p: '3' },
      { k: 'x2', l: 'x₂', p: '6' },
      { k: 'y2', l: 'y₂', p: '11' },
    ],
    fn: (v) => {
      if (v.x2 === v.x1) throw new Error('Vertical line — slope is undefined (x₁ = x₂).')
      const slope = (v.y2 - v.y1) / (v.x2 - v.x1)
      const distance = Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2))
      const midX = (v.x1 + v.x2) / 2
      const midY = (v.y1 + v.y2) / 2
      const intercept = v.y1 - slope * v.x1
      return {
        primary: { value: parseFloat(slope.toFixed(6)), label: 'Slope (m)', fmt: 'num' },
        details: [
          { l: 'y-intercept (b)', v: parseFloat(intercept.toFixed(6)), fmt: 'num' },
          { l: 'Line Equation', v: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`, fmt: 'txt' },
          { l: 'Distance', v: parseFloat(distance.toFixed(6)), fmt: 'num' },
          { l: 'Midpoint', v: `(${midX.toFixed(4)}, ${midY.toFixed(4)})`, fmt: 'txt' },
        ],
      }
    },
    about: 'Slope (rise over run) measures steepness and direction. In economics, it appears as marginal cost (cost per additional unit). Roads grade in percent (3% = 3 ft rise per 100 ft horizontal). A horizontal line has slope 0; a 45° line has slope 1; perpendicular lines have slopes that multiply to −1.',
    related: ['distance-formula-calculator', 'midpoint-calculator', 'area-calculator'],
  },
  {
    slug: 'distance-formula-calculator',
    title: 'Distance Formula Calculator',
    desc: 'Calculate the straight-line (Euclidean) distance between two points.',
    cat: 'math', icon: '📏',
    fields: [
      { k: 'x1', l: 'x₁', p: '0' },
      { k: 'y1', l: 'y₁', p: '0' },
      { k: 'x2', l: 'x₂', p: '3' },
      { k: 'y2', l: 'y₂', p: '4' },
    ],
    fn: (v) => {
      const dx = v.x2 - v.x1, dy = v.y2 - v.y1
      const distance = Math.sqrt(dx * dx + dy * dy)
      return {
        primary: { value: parseFloat(distance.toFixed(8)), label: 'Distance', fmt: 'num' },
        details: [
          { l: 'Δx (horizontal)', v: parseFloat(dx.toFixed(4)), fmt: 'num' },
          { l: 'Δy (vertical)', v: parseFloat(dy.toFixed(4)), fmt: 'num' },
          { l: 'Slope between points', v: dx !== 0 ? parseFloat((dy / dx).toFixed(4)) : 0, fmt: 'num' },
        ],
      }
    },
    about: 'The distance formula is the Pythagorean theorem applied to coordinate geometry: d = √((x₂-x₁)² + (y₂-y₁)²). GPS systems calculate distances using the haversine formula — the spherical extension for Earth\'s curved surface. Machine learning K-nearest neighbor algorithms use Euclidean distance for classification.',
    related: ['midpoint-calculator', 'slope-calculator', 'pythagorean-theorem-calculator'],
  },
  {
    slug: 'midpoint-calculator',
    title: 'Midpoint Calculator',
    desc: 'Find the midpoint between two coordinate points.',
    cat: 'math', icon: '⊕',
    fields: [
      { k: 'x1', l: 'x₁', p: '2' },
      { k: 'y1', l: 'y₁', p: '4' },
      { k: 'x2', l: 'x₂', p: '8' },
      { k: 'y2', l: 'y₂', p: '10' },
    ],
    fn: (v) => {
      const mx = (v.x1 + v.x2) / 2
      const my = (v.y1 + v.y2) / 2
      const distance = Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2))
      return {
        primary: { value: parseFloat(mx.toFixed(4)), label: `Midpoint: (${mx.toFixed(4)}, ${my.toFixed(4)})`, fmt: 'num' },
        details: [
          { l: 'Midpoint x', v: parseFloat(mx.toFixed(6)), fmt: 'num' },
          { l: 'Midpoint y', v: parseFloat(my.toFixed(6)), fmt: 'num' },
          { l: 'Distance Between Points', v: parseFloat(distance.toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'The midpoint formula takes the average of the x and y coordinates: M = ((x₁+x₂)/2, (y₁+y₂)/2). In statistics, the midpoint of a class interval is used for frequency distribution calculations. In binary search algorithms, the midpoint determines which half of the array to search next.',
    related: ['slope-calculator', 'distance-formula-calculator', 'area-calculator'],
  },
  {
    slug: 'temperature-converter',
    title: 'Temperature Converter',
    desc: 'Convert temperatures between Fahrenheit, Celsius, and Kelvin.',
    cat: 'math', icon: '🌡️',
    fields: [
      { k: 'value', l: 'Temperature', p: '72' },
      { k: 'from', l: 'From', t: 'sel', p: '0', op: [['0','Fahrenheit (°F)'],['1','Celsius (°C)'],['2','Kelvin (K)']] },
    ],
    fn: (v) => {
      let celsius: number
      if (v.from === 0) celsius = (v.value - 32) * 5 / 9
      else if (v.from === 1) celsius = v.value
      else celsius = v.value - 273.15
      const fahrenheit = celsius * 9 / 5 + 32
      const kelvin = celsius + 273.15
      return {
        primary: { value: parseFloat(fahrenheit.toFixed(2)), label: 'Fahrenheit (°F)', fmt: 'num' },
        details: [
          { l: 'Celsius (°C)', v: parseFloat(celsius.toFixed(2)), fmt: 'num' },
          { l: 'Kelvin (K)', v: parseFloat(kelvin.toFixed(2)), fmt: 'num' },
          { l: 'Rankine (°R)', v: parseFloat((fahrenheit + 459.67).toFixed(2)), fmt: 'num' },
        ],
      }
    },
    about: 'Fahrenheit was defined with 0° at a cold brine solution and 96° at human body temperature (later adjusted). Celsius is decimal-based: 0°C = freezing, 100°C = boiling at sea level. Kelvin (absolute zero = 0 K = −273.15°C) is the SI unit used in physics and thermodynamics.',
    related: ['unit-converter', 'length-converter', 'weight-converter'],
  },
  {
    slug: 'unit-converter',
    title: 'Unit Converter',
    desc: 'Convert between common metric and imperial units of length, weight, and volume.',
    cat: 'math', icon: '🔄',
    fields: [
      { k: 'value', l: 'Value', p: '100' },
      { k: 'type', l: 'Conversion', t: 'sel', p: '0', op: [['0','Miles to Kilometers'],['1','Kilometers to Miles'],['2','Pounds to Kilograms'],['3','Kilograms to Pounds'],['4','Gallons to Liters'],['5','Liters to Gallons'],['6','Inches to Centimeters'],['7','Feet to Meters']] },
    ],
    fn: (v) => {
      const conversions: Record<number, [number, string, string]> = {
        0: [1.60934, 'miles', 'kilometers'],
        1: [0.621371, 'km', 'miles'],
        2: [0.453592, 'lbs', 'kg'],
        3: [2.20462, 'kg', 'lbs'],
        4: [3.78541, 'gallons', 'liters'],
        5: [0.264172, 'liters', 'gallons'],
        6: [2.54, 'inches', 'cm'],
        7: [0.3048, 'feet', 'meters'],
      }
      const [factor, fromUnit, toUnit] = conversions[v.type]
      const result = v.value * factor
      return {
        primary: { value: parseFloat(result.toFixed(6)), label: `${v.value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}`, fmt: 'num' },
        details: [
          { l: `${fromUnit} → ${toUnit} factor`, v: factor, fmt: 'num' },
          { l: `Reverse: ${toUnit} → ${fromUnit} factor`, v: parseFloat((1 / factor).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'The metric system, adopted by most of the world, uses powers of 10 for all unit conversions. The US is one of only three countries still primarily using imperial units (with Myanmar and Liberia). The Mars Climate Orbiter crashed in 1999 due to a metric/imperial unit confusion in navigation software.',
    related: ['temperature-converter', 'length-converter', 'weight-converter'],
  },
  {
    slug: 'length-converter',
    title: 'Length Converter',
    desc: 'Convert between metric and imperial length units.',
    cat: 'math', icon: '📏',
    fields: [
      { k: 'value', l: 'Length', p: '1', min: 0 },
      { k: 'from', l: 'From Unit', t: 'sel', p: '6', op: [['0.001','Millimeter (mm)'],['0.01','Centimeter (cm)'],['1','Meter (m)'],['1000','Kilometer (km)'],['0.0254','Inch (in)'],['0.3048','Foot (ft)'],['0.9144','Yard (yd)'],['1609.344','Mile (mi)']] },
    ],
    fn: (v) => {
      const meters = v.value * v.from
      return {
        primary: { value: parseFloat(meters.toFixed(6)), label: 'Meters', fmt: 'num' },
        details: [
          { l: 'Millimeters', v: parseFloat((meters * 1000).toFixed(3)), fmt: 'num' },
          { l: 'Centimeters', v: parseFloat((meters * 100).toFixed(4)), fmt: 'num' },
          { l: 'Inches', v: parseFloat((meters / 0.0254).toFixed(4)), fmt: 'num' },
          { l: 'Feet', v: parseFloat((meters / 0.3048).toFixed(4)), fmt: 'num' },
          { l: 'Kilometers', v: parseFloat((meters / 1000).toFixed(6)), fmt: 'num' },
          { l: 'Miles', v: parseFloat((meters / 1609.344).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'The meter was originally defined as one ten-millionth of the distance from the equator to the North Pole. Since 1983, it\'s defined by the speed of light: 1/299,792,458 of the distance light travels in a second. The US foot is defined as exactly 0.3048 meters.',
    related: ['unit-converter', 'temperature-converter', 'weight-converter'],
  },
  {
    slug: 'weight-converter',
    title: 'Weight Converter',
    desc: 'Convert between kilograms, pounds, ounces, grams, and other mass units.',
    cat: 'math', icon: '⚖️',
    fields: [
      { k: 'value', l: 'Weight', p: '1', min: 0 },
      { k: 'from', l: 'From Unit', t: 'sel', p: '1', op: [['0.001','Gram (g)'],['1','Kilogram (kg)'],['1000','Metric Ton (t)'],['0.0283495','Ounce (oz)'],['0.453592','Pound (lb)'],['907.185','Short Ton (US ton)']] },
    ],
    fn: (v) => {
      const kg = v.value * v.from
      return {
        primary: { value: parseFloat(kg.toFixed(6)), label: 'Kilograms', fmt: 'num' },
        details: [
          { l: 'Grams', v: parseFloat((kg * 1000).toFixed(3)), fmt: 'num' },
          { l: 'Pounds (lb)', v: parseFloat((kg / 0.453592).toFixed(4)), fmt: 'num' },
          { l: 'Ounces (oz)', v: parseFloat((kg / 0.0283495).toFixed(4)), fmt: 'num' },
          { l: 'Metric Tons', v: parseFloat((kg / 1000).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'The kilogram was the last SI unit defined by a physical artifact — the International Prototype of the Kilogram (a platinum-iridium cylinder in Paris). In 2019, the kilogram was redefined in terms of Planck\'s constant, permanently fixing its value without reference to any physical object.',
    related: ['unit-converter', 'length-converter', 'temperature-converter'],
  },
  {
    slug: 'speed-converter',
    title: 'Speed Converter',
    desc: 'Convert between mph, km/h, m/s, knots, and Mach number.',
    cat: 'math', icon: '💨',
    fields: [
      { k: 'value', l: 'Speed', p: '60', min: 0 },
      { k: 'from', l: 'From Unit', t: 'sel', p: '1', op: [['0.44704','mph'],['0.277778','km/h'],['1','m/s'],['0.514444','knots'],['340.3','Mach (at sea level)']] },
    ],
    fn: (v) => {
      const ms = v.value * v.from
      return {
        primary: { value: parseFloat(ms.toFixed(4)), label: 'Meters per Second (m/s)', fmt: 'num' },
        details: [
          { l: 'Miles per Hour (mph)', v: parseFloat((ms / 0.44704).toFixed(4)), fmt: 'num' },
          { l: 'Km/h', v: parseFloat((ms / 0.277778).toFixed(4)), fmt: 'num' },
          { l: 'Knots', v: parseFloat((ms / 0.514444).toFixed(4)), fmt: 'num' },
          { l: 'Mach Number (sea level)', v: parseFloat((ms / 340.3).toFixed(6)), fmt: 'num' },
        ],
      }
    },
    about: 'A knot (nautical mile per hour) dates to sailors measuring ship speed with a knotted rope thrown overboard. The speed of sound (Mach 1) at sea level is 340.3 m/s (761 mph) — temperature-dependent. Chuck Yeager first broke the sound barrier at 807 mph on October 14, 1947.',
    related: ['unit-converter', 'running-pace-calculator', 'length-converter'],
  },
  {
    slug: 'median-calculator',
    title: 'Median Calculator',
    desc: 'Calculate the median (middle value) of a data set.',
    cat: 'math', icon: '📊',
    fields: [
      { k: 'n1', l: 'Value 1', p: '3' },
      { k: 'n2', l: 'Value 2', p: '7' },
      { k: 'n3', l: 'Value 3', p: '12' },
      { k: 'n4', l: 'Value 4', p: '15' },
      { k: 'n5', l: 'Value 5', p: '100' },
    ],
    fn: (v) => {
      const vals = [v.n1, v.n2, v.n3, v.n4, v.n5].sort((a, b) => a - b)
      const n = vals.length
      const median = n % 2 === 1 ? vals[Math.floor(n / 2)] : (vals[n / 2 - 1] + vals[n / 2]) / 2
      const mean = vals.reduce((a, b) => a + b, 0) / n
      return {
        primary: { value: parseFloat(median.toFixed(4)), label: 'Median', fmt: 'num' },
        details: [
          { l: 'Mean (Average)', v: parseFloat(mean.toFixed(4)), fmt: 'num' },
          { l: 'Min', v: vals[0], fmt: 'num' },
          { l: 'Max', v: vals[n - 1], fmt: 'num' },
          { l: 'Mean vs Median Difference', v: parseFloat(Math.abs(mean - median).toFixed(4)), fmt: 'num' },
        ],
        note: 'Large mean-median gaps indicate skewed data (outliers). US household income: mean ~$108k, median ~$75k.',
      }
    },
    about: 'The median splits a data set in half — 50% of values are above, 50% below. For income and housing prices, the median is preferred over the mean because a few billionaires or mansions can dramatically inflate the average. The 2024 US median household income is approximately $75,000.',
    related: ['average-calculator', 'standard-deviation-calculator', 'percentage-calculator'],
  },
  {
    slug: 'quadratic-formula-calculator',
    title: 'Quadratic Formula Calculator',
    desc: 'Solve quadratic equations ax² + bx + c = 0 using the quadratic formula.',
    cat: 'math', icon: '📐',
    fields: [
      { k: 'a', l: 'Coefficient a', p: '1', min: -1000, max: 1000 },
      { k: 'b', l: 'Coefficient b', p: '-5', min: -1000, max: 1000 },
      { k: 'c', l: 'Coefficient c', p: '6', min: -1000, max: 1000 },
    ],
    fn: (v) => {
      if (v.a === 0) throw new Error('Coefficient a cannot be zero (would not be quadratic).')
      const discriminant = v.b * v.b - 4 * v.a * v.c
      if (discriminant < 0) throw new Error(`No real solutions (discriminant = ${discriminant.toFixed(2)} < 0).`)
      const x1 = (-v.b + Math.sqrt(discriminant)) / (2 * v.a)
      const x2 = (-v.b - Math.sqrt(discriminant)) / (2 * v.a)
      const vertex_x = -v.b / (2 * v.a)
      const vertex_y = v.a * vertex_x * vertex_x + v.b * vertex_x + v.c
      return {
        primary: { value: parseFloat(x1.toFixed(6)), label: `x₁ = ${x1.toFixed(4)}`, fmt: 'num' },
        details: [
          { l: 'x₂', v: parseFloat(x2.toFixed(6)), fmt: 'num' },
          { l: 'Discriminant (b²-4ac)', v: parseFloat(discriminant.toFixed(4)), fmt: 'num' },
          { l: 'Vertex x', v: parseFloat(vertex_x.toFixed(4)), fmt: 'num' },
          { l: 'Vertex y (min/max)', v: parseFloat(vertex_y.toFixed(4)), fmt: 'num' },
        ],
      }
    },
    about: 'The quadratic formula x = (−b ± √(b²−4ac)) / 2a solves all quadratic equations. The discriminant (b²−4ac) determines solutions: positive = 2 real roots, zero = 1 real root (double), negative = 2 complex roots. Parabolas model projectile trajectories, satellite dishes, and suspension cables.',
    related: ['slope-calculator', 'distance-formula-calculator', 'area-calculator'],
  },
  {
    slug: 'variance-calculator',
    title: 'Variance Calculator',
    desc: 'Calculate the variance (spread) of a data set.',
    cat: 'math', icon: '📊',
    fields: [
      { k: 'n1', l: 'Value 1', p: '2' },
      { k: 'n2', l: 'Value 2', p: '4' },
      { k: 'n3', l: 'Value 3', p: '4' },
      { k: 'n4', l: 'Value 4', p: '4' },
      { k: 'n5', l: 'Value 5', p: '5' },
      { k: 'n6', l: 'Value 6', p: '5' },
      { k: 'n7', l: 'Value 7', p: '7' },
      { k: 'n8', l: 'Value 8', p: '9' },
    ],
    fn: (v) => {
      const vals = [v.n1, v.n2, v.n3, v.n4, v.n5, v.n6, v.n7, v.n8]
      const n = vals.length
      const mean = vals.reduce((a, b) => a + b, 0) / n
      const variance = vals.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / (n - 1)
      const std = Math.sqrt(variance)
      return {
        primary: { value: parseFloat(variance.toFixed(4)), label: 'Sample Variance', fmt: 'num' },
        details: [
          { l: 'Standard Deviation', v: parseFloat(std.toFixed(4)), fmt: 'num' },
          { l: 'Mean', v: parseFloat(mean.toFixed(4)), fmt: 'num' },
          { l: 'Count', v: n, fmt: 'num' },
        ],
      }
    },
    about: 'Variance (σ²) is the squared average deviation from the mean. Stock portfolios use variance to measure risk — a high-variance portfolio has more volatility. Modern Portfolio Theory shows that combining assets with low correlation reduces portfolio variance without proportionally reducing expected returns.',
    related: ['standard-deviation-calculator', 'average-calculator', 'probability-calculator'],
  },
]
