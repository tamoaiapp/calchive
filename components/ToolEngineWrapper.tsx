'use client'

import { getToolBySlug } from '@/lib/tools'
import ToolEngine from './ToolEngine'

interface ToolEngineWrapperProps {
  slug: string
}

export default function ToolEngineWrapper({ slug }: ToolEngineWrapperProps) {
  const tool = getToolBySlug(slug)
  if (!tool) return null
  return <ToolEngine config={tool} />
}
