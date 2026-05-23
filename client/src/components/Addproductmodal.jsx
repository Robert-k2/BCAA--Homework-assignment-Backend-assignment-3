import React, { useState } from 'react'

const FIELDS = { productId:'', name:'', price:'', description:'', quantity:'', threshold:'', category:'', supplierName:'', supplierEmail:'', supplierPhone:'' }

export default function AddProductModal({ onClose, onAdd }) {
  const [form, setForm]   = useState(FIELDS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async () => {
    if (!form.name || !form.price) { setError('Name and price are required.'); return }
    setLoading(true); setError('')
    try {
      const qty = parseInt(form.quantity) || 0
      const thr = parseInt(form.threshold) || 5
      await onAdd({
        productId:    form.productId || undefined,
        name:         form.name,
        price:        parseFloat(form.price),
        description:  form.description || undefined,
        quantity:     qty,
        categoryList: form.category ? form.category.split(',').map(s => s.trim()).filter(Boolean) : [],
        inventory:    { quantity: qty, minimumThreshold: thr },
        supplier:     (form.supplierName || form.supplierEmail || form.supplierPhone)
                        ? { name: form.supplierName, contactEmail: form.supplierEmail, phone: form.supplierPhone }
                        : undefined,
      })
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '8px 11px', borderRadius: 8, border: '1.5px solid var(--border)', fontSize: 13, color: 'var(--navy)', outline: 'none', background: '#f8fbff' }
  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--blue)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.4 }
  const Field = ({ label, k, type = 'text', placeholder = '' }) => (
    <div style={{ marginBottom: 12, flex: 1 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={form[k]} onChange={set(k)} placeholder={placeholder} style={inputStyle} />
    </div>
  )

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: 'fixed', inset: 0, background: 'rgba(4,44,83,0.45)',
      zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#fff', borderRadius: 18, padding: '2rem', width: 480, maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--pale)', boxShadow: 'var(--shadow-lg)', animation: 'fadeUp 0.2s ease' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--navy)', fontFamily: 'Syne, sans-serif' }}>Add new product</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, color: 'var(--light)' }}>×</button>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Product details</div>
        <div style={{ display: 'flex', gap: 12 }}><Field label="Product ID" k="productId" placeholder="PRD-001" /><Field label="Price *" k="price" type="number" placeholder="0.00" /></div>
        <Field label="Name *" k="name" placeholder="Product name" />
        <div style={{ display: 'flex', gap: 12 }}><Field label="Initial qty" k="quantity" type="number" placeholder="0" /><Field label="Min threshold" k="threshold" type="number" placeholder="5" /></div>
        <Field label="Categories (comma-separated)" k="category" placeholder="Electronics, Sale" />
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Description</label>
          <textarea value={form.description} onChange={set('description')} rows={2} placeholder="Optional…"
            style={{ ...inputStyle, resize: 'vertical' }} />
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--light)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginTop: 8 }}>Supplier (optional)</div>
        <Field label="Supplier name" k="supplierName" placeholder="Acme Corp" />
        <div style={{ display: 'flex', gap: 12 }}><Field label="Email" k="supplierEmail" type="email" placeholder="contact@acme.com" /><Field label="Phone" k="supplierPhone" placeholder="+1 555 0100" /></div>

        {error && <div style={{ background: 'var(--red-bg)', color: 'var(--red)', borderRadius: 8, padding: '8px 12px', fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '9px 18px', borderRadius: 9, border: '1px solid var(--border)', background: '#f0f7ff', color: 'var(--blue)', fontSize: 13, fontWeight: 500 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: loading ? 'var(--light)' : 'var(--blue)', color: '#fff', fontSize: 13, fontWeight: 700 }}>
            {loading ? 'Saving…' : 'Add product'}
          </button>
        </div>
      </div>
    </div>
  )
}