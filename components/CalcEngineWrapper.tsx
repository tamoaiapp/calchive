'use client'

import { getCalcBySlug } from '@/lib/calculators'
import CalcEngine from './CalcEngine'

interface CalcEngineWrapperProps {
  slug: string
}

export default function CalcEngineWrapper({ slug }: CalcEngineWrapperProps) {
  const calc = getCalcBySlug(slug)
  if (!calc) return null
  return <CalcEngine config={calc} />
}
