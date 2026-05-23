import React from 'react'

const NAV = [
  { id: 'products',  icon: '📦', label: 'Products'  },
  { id: 'inventory', icon: '🗃️', label: 'Inventory' },
  { id: 'analytics', icon: '📊', label: 'Analytics' },
]

export default function Sidebar({ page, setPage, connected }) {
  return (
    <aside style={{
      width: 220, background: 'var(--navy)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
    }}>
      <div style={{ padding: '1.75rem 1.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 9, letterSpacing: 3, fontWeight: 700, color: 'var(--mid)', textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>Inventory</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.5, fontFamily: 'Syne, sans-serif' }}>SalesLog</h1>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0' }}>
        {NAV.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{
            width: '100%', padding: '11px 1.5rem',
            display: 'flex', alignItems: 'center', gap: 10,
            background: page === n.id ? 'rgba(55,138,221,0.15)' : 'transparent',
            borderLeft: page === n.id ? '3px solid var(--mid)' : '3px solid transparent',
            border: 'none', color: page === n.id ? '#b5d4f4' : 'var(--light)',
            fontSize: 13, fontWeight: page === n.id ? 700 : 400,
            textAlign: 'left', transition: 'background 0.15s',
            fontFamily: 'DM Sans, sans-serif',
          }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: 10, color: 'var(--mid)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Backend</div>
        <div style={{ fontSize: 12, color: 'var(--light)', marginTop: 2 }}>localhost:5000</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            background: connected ? '#22c55e' : '#e53e3e',
            animation: connected ? 'pulse 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{ fontSize: 11, color: connected ? '#86efac' : '#fc8181' }}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  )
}