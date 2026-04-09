'use client'

import { useState, useCallback } from 'react'
import type { CalcConfig, CalcResult } from '@/lib/calculators/types'

interface CalcEngineProps {
  config: CalcConfig
}

function formatValue(value: number | string, fmt?: string): string {
  if (fmt === 'usd') {
    const n = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n)
  }
  if (fmt === 'pct') {
    const n = typeof value === 'string' ? parseFloat(value) : value
    return `${n.toFixed(2)}%`
  }
  if (fmt === 'num') {
    const n = typeof value === 'string' ? parseFloat(value) : value
    return new Intl.NumberFormat('en-US').format(n)
  }
  return String(value)
}

export default function CalcEngine({ config }: CalcEngineProps) {
  const initialValues: Record<string, string> = {}
  config.fields.forEach((f) => {
    initialValues[f.k] = f.p ?? ''
  })

  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [result, setResult] = useState<CalcResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }))
    setResult(null)
    setError(null)
  }, [])

  const handleCalculate = useCallback(() => {
    const numValues: Record<string, number> = {}
    for (const field of config.fields) {
      if (field.t === 'sel') {
        numValues[field.k] = parseFloat(values[field.k] ?? '0') || 0
        continue
      }
      const raw = values[field.k]
      if (raw === '' || raw === undefined) {
        setError(`Please fill in "${field.l}".`)
        return
      }
      const n = parseFloat(raw)
      if (isNaN(n)) {
        setError(`"${field.l}" must be a valid number.`)
        return
      }
      if (field.min !== undefined && n < field.min) {
        setError(`"${field.l}" must be at least ${field.min}.`)
        return
      }
      if (field.max !== undefined && n > field.max) {
        setError(`"${field.l}" must be at most ${field.max}.`)
        return
      }
      numValues[field.k] = n
    }
    try {
      const res = config.fn(numValues)
      setResult(res)
      setError(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Calculation error. Please check your inputs.')
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

  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius-card-lg)',
        padding: '32px',
        maxWidth: 680,
        width: '100%',
      }}
    >
      {/* Fields */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginBottom: 24,
        }}
      >
        {config.fields.map((field) => (
          <div key={field.k}>
            <label htmlFor={`field-${field.k}`} style={labelStyle}>
              {field.l}
              {field.u && (
                <span style={{ fontWeight: 400, textTransform: 'none', marginLeft: 4 }}>
                  ({field.u})
                </span>
              )}
            </label>
            {field.t === 'sel' && field.op ? (
              <select
                id={`field-${field.k}`}
                value={values[field.k] ?? ''}
                onChange={(e) => handleChange(field.k, e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                {field.op.map(([val, lbl]) => (
                  <option key={val} value={val} style={{ background: 'var(--card)' }}>
                    {lbl}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`field-${field.k}`}
                type="number"
                inputMode="decimal"
                placeholder={field.p ?? '0'}
                value={values[field.k] ?? ''}
                min={field.min}
                max={field.max}
                step="any"
                onChange={(e) => handleChange(field.k, e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--line)'
                }}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>

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

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        style={{
          width: '100%',
          padding: '13px 24px',
          background: 'var(--brand)',
          border: 'none',
          borderRadius: 'var(--radius-btn)',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'opacity 0.15s, transform 0.1s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.98)'
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        Calculate
      </button>

      {/* Result */}
      {result && (
        <div
          style={{
            marginTop: 28,
            borderTop: '1px solid var(--line)',
            paddingTop: 24,
          }}
        >
          {/* Primary result */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: result.details && result.details.length > 0 ? 24 : 0,
            }}
          >
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 8,
              }}
            >
              {result.primary.label}
            </p>
            <p
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: 'var(--green)',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              {formatValue(result.primary.value, result.primary.fmt)}
            </p>
          </div>

          {/* Details table */}
          {result.details && result.details.length > 0 && (
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--line)',
                borderRadius: 12,
                overflow: 'hidden',
              }}
            >
              {result.details.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '11px 16px',
                    borderBottom:
                      i < (result.details?.length ?? 0) - 1 ? '1px solid var(--line)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 14, color: 'var(--muted)' }}>{d.l}</span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: d.color ?? 'var(--text)',
                    }}
                  >
                    {formatValue(d.v, d.fmt)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Note */}
          {result.note && (
            <p
              style={{
                marginTop: 16,
                fontSize: 13,
                color: 'var(--dim)',
                lineHeight: 1.6,
                textAlign: 'center',
              }}
            >
              {result.note}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
