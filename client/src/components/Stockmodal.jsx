import React, { useState } from 'react'

export default function StockModal({ product, onClose, onConfirm }) {
  const [action, setAction]   = useState('ADD')
  const [amount, setAmount]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const qty     = product?.inventory?.quantity ?? 0
  const preview = action === 'ADD' ? qty + (parseInt(amount) || 0) : qty - (parseInt(amount) || 0)

  const handleConfirm = async () => {
    const num = parseInt(amount)
    if (!num || num <= 0)                          { setError('Enter a valid amount greater than 0.'); return }
    if (action === 'REMOVE' && num > qty)          { setError(`Cannot remove more than current stock (${qty}).`); return }
    setLoading(true); setError('')
    try {
      await onConfirm(product._id, action, num)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(4,44,83,0.45)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 18, padding: '2rem', width: 380,
        border: '1px solid var(--pale)', boxShadow: 'var(--shadow-lg)',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', fontFamily: 'Syne, sans-serif' }}>Adjust stock</h3>
            <p style={{ fontSize: 12, color: 'var(--mid)', marginTop: 2 }}>{product?.name}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: 'var(--light)', lineHeight: 1 }}>×</button>
        </div>

        {/* Action tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          {['ADD', 'REMOVE'].map(a => (
            <button key={a} onClick={() => { setAction(a); setError('') }} style={{
              flex: 1, padding: '10px 0', borderRadius: 10,
              fontWeight: 700, fontSize: 13, border: 'none',
              background: action === a ? (a === 'ADD' ? 'var(--blue)' : 'var(--red)') : '#f0f7ff',
              color: action === a ? '#fff' : 'var(--mid)',
              transition: 'all 0.15s',
            }}>
              {a === 'ADD' ? '＋ Add stock' : '－ Remove stock'}
            </button>
          ))}
        </div>

        {/* Current stock */}
        <div style={{ background: '#f0f7ff', borderRadius: 10, padding: '12px 14px', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: 'var(--mid)' }}>Current stock</span>
          <span style={{ fontWeight: 700, color: 'var(--navy)', fontSize: 15 }}>{qty} units</span>
        </div>

        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--blue)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>
          Amount to {action === 'ADD' ? 'add' : 'remove'}
        </label>
        <input
          type="number" min="1" value={amount}
          onChange={e => { setAmount(e.target.value); setError('') }}
          placeholder="e.g. 10"
          style={{ width: '100%', padding: '9px 12px', borderRadius: 9, border: '1.5px solid var(--border)', fontSize: 14, outline: 'none' }}
        />

        {amount && parseInt(amount) > 0 && (
          <div style={{
            marginTop: 10, borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 500,
            background: action === 'ADD' ? 'var(--green-bg)' : 'var(--red-bg)',
            color: action === 'ADD' ? 'var(--green)' : 'var(--red)',
          }}>
            New stock will be: <strong>{Math.max(0, preview)} units</strong>
          </div>
        )}

        {error && <div style={{ marginTop: 10, background: 'var(--red-bg)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--red)' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 18 }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 9, border: '1px solid var(--border)', background: '#f0f7ff', color: 'var(--blue)', fontSize: 13, fontWeight: 500 }}>Cancel</button>
          <button onClick={handleConfirm} disabled={loading} style={{
            padding: '9px 22px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700, color: '#fff',
            background: loading ? 'var(--light)' : action === 'ADD' ? 'var(--blue)' : 'var(--red)',
          }}>
            {loading ? 'Saving…' : `Confirm ${action === 'ADD' ? 'Add' : 'Remove'}`}
          </button>
        </div>
      </div>
    </div>
  )
}