'use client'

import { useState, useCallback, useEffect } from 'react'
import type { ToolConfig, ToolResult } from '@/lib/tools/types'

interface ToolEngineProps {
  config: ToolConfig
}

export default function ToolEngine({ config }: ToolEngineProps) {
  const initialValues: Record<string, string> = {}
  if (config.fields) {
    config.fields.forEach((f) => {
      initialValues[f.k] = f.placeholder ?? ''
    })
  }

  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [results, setResults] = useState<ToolResult[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [staticResults, setStaticResults] = useState<ToolResult[] | null>(null)

  // Load static content immediately
  useEffect(() => {
    if (config.staticContent) {
      try {
        setStaticResults(config.staticContent())
      } catch {
        setStaticResults(null)
      }
    }
  }, [config])

  const handleChange = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setResults(null)
    setError(null)
  }, [])

  const handleRun = useCallback(() => {
    if (!config.fn) return
    try {
      const res = config.fn(values)
      setResults(res)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please check your inputs.')
    }
  }, [config, values])

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--line)',
    borderRadius: 10,
    color: 'var(--text)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--muted)',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  const displayResults = results ?? staticResults

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card-lg, 20px)',
        padding: '32px',
        maxWidth: 720,
        width: '100%',
      }}
    >
      {/* Fields */}
      {config.fields && config.fields.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
            marginBottom: 24,
          }}
        >
          {config.fields.map((field) => (
            <div key={field.k}>
              <label htmlFor={`tf-${field.k}`} style={labelStyle}>
                {field.l}
                {field.unit && (
                  <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: 4 }}>
                    ({field.unit})
                  </span>
                )}
              </label>
              {field.type === 'select' && field.options ? (
                <select
                  id={`tf-${field.k}`}
                  value={values[field.k] ?? ''}
                  onChange={(e) => handleChange(field.k, e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="" style={{ background: 'var(--card)' }}>Select…</option>
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value} style={{ background: 'var(--card)' }}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={`tf-${field.k}`}
                  placeholder={field.placeholder ?? ''}
                  value={values[field.k] ?? ''}
                  rows={4}
                  onChange={(e) => handleChange(field.k, e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)' }}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }}
                />
              ) : (
                <input
                  id={`tf-${field.k}`}
                  type={field.type === 'number' ? 'number' : 'text'}
                  inputMode={field.type === 'number' ? 'decimal' : 'text'}
                  placeholder={field.placeholder ?? ''}
                  value={values[field.k] ?? ''}
                  step="any"
                  onChange={(e) => handleChange(field.k, e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--line)' }}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 10,
            padding: '10px 14px',
            color: '#f87171',
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Run button (only for interactive tools) */}
      {config.fn && (
        <button
          onClick={handleRun}
          style={{
            width: '100%',
            padding: '13px 24px',
            background: 'var(--brand)',
            border: 'none',
            borderRadius: 'var(--radius-btn, 12px)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            transition: 'opacity 0.15s, transform 0.1s',
            marginBottom: displayResults ? 0 : undefined,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          {config.toolType === 'generator' ? 'Generate' :
           config.toolType === 'checker' ? 'Check' :
           config.toolType === 'converter' ? 'Convert' :
           'Calculate'}
        </button>
      )}

      {/* Results */}
      {displayResults && displayResults.length > 0 && (
        <div style={{ marginTop: config.fn ? 28 : 0 }}>
          {config.fn && (
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: 24, marginBottom: 20 }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {displayResults.map((result, idx) => (
              <ResultBlock key={idx} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ResultBlock({ result }: { result: ToolResult }) {
  if (result.type === 'value') {
    const content = result.content as string
    return (
      <div style={{ textAlign: 'center' }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 8,
            margin: '0 0 8px',
          }}
        >
          {result.label}
        </p>
        <p
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: result.color ?? 'var(--green)',
            letterSpacing: '-0.5px',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {content}
        </p>
      </div>
    )
  }

  if (result.type === 'text') {
    const content = result.content as string
    return (
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '0 0 10px',
          }}
        >
          {result.label}
        </p>
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: '14px 16px',
            fontSize: 15,
            color: result.color ?? 'var(--text)',
            lineHeight: 1.6,
            wordBreak: 'break-all',
            fontFamily: content.length < 200 ? 'monospace' : 'inherit',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  if (result.type === 'list') {
    const items = result.content as string[]
    return (
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '0 0 10px',
          }}
        >
          {result.label}
        </p>
        <ul
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            padding: '8px 0',
            margin: 0,
            listStyle: 'none',
          }}
        >
          {items.map((item, i) => (
            <li
              key={i}
              style={{
                padding: '9px 16px',
                fontSize: 14,
                color: result.color ?? 'var(--text)',
                lineHeight: 1.5,
                borderBottom: i < items.length - 1 ? '1px solid var(--line)' : 'none',
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (result.type === 'table') {
    const rows = result.content as { label: string; value: string }[]
    return (
      <div>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            margin: '0 0 10px',
          }}
        >
          {result.label}
        </p>
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          {rows.map((row, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '11px 16px',
                borderBottom: i < rows.length - 1 ? '1px solid var(--line)' : 'none',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: 'var(--muted)', flexShrink: 0 }}>{row.label}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: result.color ?? 'var(--text)',
                  textAlign: 'right',
                }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}
