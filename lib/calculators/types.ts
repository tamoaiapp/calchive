export interface CalcField {
  k: string
  l: string
  t?: 'num' | 'sel' | 'pct'
  p?: string
  min?: number
  max?: number
  op?: [string, string][]
  u?: string
}

export interface CalcResult {
  primary: { value: number | string; label: string; fmt?: 'usd' | 'num' | 'pct' | 'txt' }
  details?: { l: string; v: number | string; fmt?: string; color?: string }[]
  note?: string
}

export interface CalcConfig {
  slug: string
  title: string
  desc: string
  cat: string
  icon: string
  fields: CalcField[]
  fn: (v: Record<string, number>) => CalcResult
  about?: string
  related?: string[]
}
