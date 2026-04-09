// ─── Credit Score Ranges (FICO) ───────────────────────────────────────────────
export const CREDIT_SCORE_RANGES = [
  {
    min: 800, max: 850,
    label: 'Exceptional',
    description: 'Qualifies for best rates on all products',
    color: '#10b981',
  },
  {
    min: 740, max: 799,
    label: 'Very Good',
    description: 'Near-best rates on most products',
    color: '#34d399',
  },
  {
    min: 670, max: 739,
    label: 'Good',
    description: 'Most loans available; not best rates',
    color: '#f59e0b',
  },
  {
    min: 580, max: 669,
    label: 'Fair',
    description: 'Limited options; higher rates',
    color: '#f97316',
  },
  {
    min: 300, max: 579,
    label: 'Poor',
    description: 'Difficulty getting approved; secured cards only',
    color: '#ef4444',
  },
]

// ─── Average Credit Card APRs by Score Tier (2025) ───────────────────────────
export const CC_RATES_BY_SCORE: Record<string, number> = {
  exceptional: 17.5,
  very_good: 19.8,
  good: 22.4,
  fair: 26.8,
  poor: 29.9,
}

// ─── Mortgage Rate Adjustments by Credit Score ────────────────────────────────
// Basis points above best available (760+ score) for a 30-year fixed
export const MORTGAGE_RATE_ADJUSTMENT_BPS: Record<string, number> = {
  '760-850': 0,
  '740-759': 25,
  '720-739': 50,
  '700-719': 75,
  '680-699': 100,
  '660-679': 150,
  '640-659': 200,
  '620-639': 275,
  '580-619': 375,
}

// ─── Auto Loan Rates by Credit Score (2025) ───────────────────────────────────
export const AUTO_LOAN_RATES_BY_SCORE: Record<string, { new: number; used: number }> = {
  exceptional: { new: 5.18, used: 6.79 },
  very_good: { new: 6.05, used: 8.33 },
  good: { new: 7.12, used: 10.48 },
  fair: { new: 11.17, used: 15.06 },
  poor: { new: 14.77, used: 19.26 },
}

export function getScoreCategory(score: number): string {
  if (score >= 800) return 'exceptional'
  if (score >= 740) return 'very_good'
  if (score >= 670) return 'good'
  if (score >= 580) return 'fair'
  return 'poor'
}

export function getScoreLabel(score: number): string {
  if (score >= 800) return 'Exceptional'
  if (score >= 740) return 'Very Good'
  if (score >= 670) return 'Good'
  if (score >= 580) return 'Fair'
  return 'Poor'
}

export function getScoreColor(score: number): string {
  if (score >= 800) return '#10b981'
  if (score >= 740) return '#34d399'
  if (score >= 670) return '#f59e0b'
  if (score >= 580) return '#f97316'
  return '#ef4444'
}
