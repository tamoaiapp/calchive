export type ToolType = 'converter' | 'checker' | 'generator' | 'table' | 'estimator'

export interface ToolOption {
  value: string
  label: string
}

export interface ToolField {
  k: string
  l: string
  type: 'text' | 'number' | 'select' | 'textarea'
  placeholder?: string
  options?: ToolOption[]
  unit?: string
}

export interface ToolResult {
  type: 'text' | 'table' | 'list' | 'value'
  label: string
  content: string | string[] | { label: string; value: string }[]
  color?: string
}

export interface ToolConfig {
  slug: string
  title: string
  desc: string
  cat: string
  icon: string
  toolType: ToolType
  fields?: ToolField[]
  fn?: (inputs: Record<string, string>) => ToolResult[]
  staticContent?: () => ToolResult[]
  about?: string
  related?: string[]
}
