// Average interest rates by loan type (2025 market data)
export const LOAN_RATES_2025 = {
  personal: { excellent: 10.5, good: 14.5, fair: 21.0, bad: 28.0 },
  auto_new: { excellent: 5.2, good: 6.8, fair: 10.5, bad: 15.8 },
  auto_used: { excellent: 6.8, good: 9.2, fair: 13.5, bad: 20.0 },
  student_federal_undergrad: 6.53,
  student_federal_grad: 8.08,
  student_federal_plus: 9.08,
  student_private: { excellent: 4.5, good: 7.0, fair: 11.0, bad: 15.0 },
  business_sba: { min: 11.5, max: 16.5 },
}

// Typical loan terms by type
export const LOAN_TERMS = {
  personal: [24, 36, 48, 60, 72],
  auto: [24, 36, 48, 60, 72, 84],
  student: [120], // 10 years standard
}

// Credit score ranges
export const CREDIT_TIERS = {
  excellent: { min: 750, label: 'Excellent (750+)' },
  good: { min: 700, label: 'Good (700–749)' },
  fair: { min: 640, label: 'Fair (640–699)' },
  bad: { min: 0, label: 'Poor (below 640)' },
} as const

export type CreditTier = keyof typeof CREDIT_TIERS
