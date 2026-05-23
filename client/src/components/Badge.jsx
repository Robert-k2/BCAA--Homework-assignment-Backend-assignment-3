import React from 'react'

function stockStatus(qty, thr) {
  if (qty === 0) return 'out'
  if (qty <= thr) return 'low'
  return 'ok'
}

const STYLES = {
  ok:  { background: 'var(--green-bg)', color: 'var(--green)', label: 'In stock'     },
  low: { background: 'var(--amber-bg)', color: 'var(--amber)', label: 'Low stock'    },
  out: { background: 'var(--red-bg)',   color: 'var(--red)',   label: 'Out of stock' },
}

export default function Badge({ qty, threshold = 5 }) {
  const s = STYLES[stockStatus(qty, threshold)]
  return (
    <span style={{
      display: 'inline-block', fontSize: 11, fontWeight: 600,
      padding: '3px 9px', borderRadius: 20,
      background: s.background, color: s.color,
    }}>{s.label}</span>
  )
}