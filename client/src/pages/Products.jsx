import React, { useState } from 'react'
import Badge from '../components/Badge.jsx'
import StockModal from '../components/StockModal.jsx'
import AddProductModal from '../components/AddProductModal.jsx'

const IMG_URL = name => `https://source.unsplash.com/72x72/?${encodeURIComponent((name || 'product').split(' ').slice(0,3).join(' '))}`

export default function Products({ products, loading, error, onAdjust, onAdd }) {
  const [view,   setView]   = useState('grid')
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [adjusting, setAdjusting] = useState(null)
  const [showAdd,   setShowAdd]   = useState(false)

  const filtered = products.filter(p => {
    const q   = search.toLowerCase()
    const match = !q ||
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.productId ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.categoryList ?? []).some(c => c.toLowerCase().includes(q))
    if (!match) return false
    const qty = p.inventory?.quantity ?? 0
    const thr = p.inventory?.minimumThreshold ?? 5
    if (filter === 'low') return qty > 0 && qty <= thr
    if (filter === 'out') return qty === 0
    return true
  })

  if (loading) return <Spinner />
  if (error)   return <ErrorBox msg={error} />

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'var(--navy)', fontFamily:'Syne,sans-serif' }}>Products</h2>
          <p style={{ fontSize:13, color:'var(--mid)', marginTop:3 }}>{products.length} total products</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding:'10px 20px', background:'var(--blue)', color:'#fff', border:'none', borderRadius:10, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:18, lineHeight:1 }}>+</span> Add product
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', gap:10, marginBottom:'1.25rem', flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:15, color:'var(--light)', pointerEvents:'none' }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, category…"
            style={{ width:'100%', padding:'9px 34px', borderRadius:10, border:'1.5px solid var(--border)', fontSize:13, outline:'none', background:'#fff' }} />
          {search && <button onClick={() => setSearch('')} style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--light)', fontSize:16 }}>×</button>}
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {[['all','All'],['low','Low stock'],['out','Out of stock']].map(([v,l]) => (
            <button key={v} onClick={() => setFilter(v)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, border: filter===v ? '2px solid var(--blue)' : '1.5px solid var(--border)', background: filter===v ? 'var(--blue)' : '#fff', color: filter===v ? '#fff' : 'var(--mid)', transition:'all 0.15s' }}>{l}</button>
          ))}
        </div>
        <div style={{ display:'flex', border:'1.5px solid var(--border)', borderRadius:9, overflow:'hidden' }}>
          {[['grid','⊞'],['list','☰']].map(([m,ic]) => (
            <button key={m} onClick={() => setView(m)} style={{ padding:'7px 13px', fontSize:17, border:'none', background: view===m ? 'var(--blue)' : '#fff', color: view===m ? '#fff' : 'var(--mid)', transition:'background 0.15s' }}>{ic}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      {!filtered.length ? (
        <EmptyState title="No products found" sub={search ? `No results for "${search}"` : 'Add your first product above.'} />
      ) : view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))', gap:14 }}>
          {filtered.map((p,i) => <ProductCard key={p._id} product={p} index={i} onAdjust={setAdjusting} />)}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'grid', gridTemplateColumns:'56px 2fr 90px 70px 110px 200px 1fr', gap:10, padding:'4px 12px', fontSize:11, fontWeight:700, color:'var(--light)', textTransform:'uppercase', letterSpacing:0.5 }}>
            <div/><div>Product</div><div>Price</div><div>Qty</div><div>Status</div><div>Adjust</div><div>Supplier</div>
          </div>
          {filtered.map((p,i) => <ProductRow key={p._id} product={p} index={i} onAdjust={setAdjusting} />)}
        </div>
      )}

      {adjusting && <StockModal product={adjusting} onClose={() => setAdjusting(null)} onConfirm={onAdjust} />}
      {showAdd   && <AddProductModal onClose={() => setShowAdd(false)} onAdd={onAdd} />}
    </div>
  )
}

function ProductCard({ product: p, index: i, onAdjust }) {
  const qty = p.inventory?.quantity ?? 0
  const thr = p.inventory?.minimumThreshold ?? 5
  return (
    <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'1rem', display:'flex', flexDirection:'column', gap:10, transition:'box-shadow 0.18s,transform 0.18s', animation:`fadeUp 0.25s ease ${i*0.03}s both` }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='var(--shadow)'; e.currentTarget.style.transform='translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none'; }}>
      <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
        <img src={IMG_URL(p.name)} alt={p.name} style={{ width:54, height:54, borderRadius:10, objectFit:'cover', border:'1.5px solid var(--pale)', flexShrink:0 }}
          onError={e => { e.target.src=`https://placehold.co/54x54/e6f1fb/185fa5?text=${(p.name||'P')[0]}` }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:14, color:'var(--navy)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
          <div style={{ fontSize:11, color:'var(--light)', marginTop:1 }}>{p.productId ?? '—'}</div>
          <div style={{ marginTop:5 }}><Badge qty={qty} threshold={thr} /></div>
        </div>
      </div>
      {p.description && <div style={{ fontSize:12, color:'var(--mid)', lineHeight:1.5, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{p.description}</div>}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:19, fontWeight:800, color:'var(--blue)' }}>${Number(p.price??0).toFixed(2)}</span>
        <span style={{ fontSize:13, color:'var(--navy)' }}><strong>{qty}</strong> units</span>
      </div>
      {p.categoryList?.length > 0 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
          {p.categoryList.map((c,j) => <span key={j} style={{ background:'#e6f1fb', color:'var(--blue)', fontSize:11, padding:'2px 8px', borderRadius:20 }}>{c}</span>)}
        </div>
      )}
      <div style={{ display:'flex', gap:8 }}>
        <button onClick={() => onAdjust({ ...p, _defaultAction:'ADD' })} style={{ flex:1, padding:'9px 0', background:'var(--blue)', color:'#fff', border:'none', borderRadius:9, fontSize:13, fontWeight:700, transition:'background 0.15s' }}
          onMouseEnter={e=>e.currentTarget.style.background='#0c447c'} onMouseLeave={e=>e.currentTarget.style.background='var(--blue)'}>＋ Add stock</button>
        <button onClick={() => qty > 0 && onAdjust({ ...p, _defaultAction:'REMOVE' })} disabled={qty===0} style={{ flex:1, padding:'9px 0', background:qty===0?'#f5f5f5':'var(--red-bg)', color:qty===0?'#bbb':'var(--red)', border:'none', borderRadius:9, fontSize:13, fontWeight:700 }}>－ Remove stock</button>
      </div>
      {p.supplier?.name && (
        <div style={{ fontSize:11, color:'var(--light)', borderTop:'1px solid var(--border)', paddingTop:8 }}>
          📦 <strong style={{ color:'var(--mid)' }}>{p.supplier.name}</strong>
          {p.supplier.contactEmail && <span style={{ marginLeft:6 }}>{p.supplier.contactEmail}</span>}
        </div>
      )}
    </div>
  )
}

function ProductRow({ product: p, onAdjust }) {
  const qty = p.inventory?.quantity ?? 0
  const thr = p.inventory?.minimumThreshold ?? 5
  return (
    <div style={{ display:'grid', gridTemplateColumns:'56px 2fr 90px 70px 110px 200px 1fr', gap:10, alignItems:'center', background:'#fff', border:'1.5px solid var(--border)', borderRadius:10, padding:'10px 12px', transition:'box-shadow 0.15s', animation:'fadeUp 0.2s ease both' }}
      onMouseEnter={e=>e.currentTarget.style.boxShadow='0 2px 14px rgba(24,95,165,0.09)'}
      onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
      <img src={IMG_URL(p.name)} alt={p.name} style={{ width:44, height:44, borderRadius:8, objectFit:'cover', border:'1.5px solid var(--pale)' }}
        onError={e=>{e.target.src=`https://placehold.co/44x44/e6f1fb/185fa5?text=${(p.name||'P')[0]}`}} />
      <div><div style={{ fontWeight:700, fontSize:13, color:'var(--navy)' }}>{p.name}</div><div style={{ fontSize:11, color:'var(--light)' }}>{p.productId??'—'}</div></div>
      <div style={{ fontWeight:800, color:'var(--blue)', fontSize:14 }}>${Number(p.price??0).toFixed(2)}</div>
      <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{qty}</div>
      <Badge qty={qty} threshold={thr} />
      <div style={{ display:'flex', gap:5 }}>
        <button onClick={()=>onAdjust({...p,_defaultAction:'ADD'})} style={{ flex:1, padding:'6px 0', background:'var(--blue)', color:'#fff', border:'none', borderRadius:7, fontSize:13, fontWeight:700 }}>＋ Add</button>
        <button onClick={()=>qty>0&&onAdjust({...p,_defaultAction:'REMOVE'})} disabled={qty===0} style={{ flex:1, padding:'6px 0', background:qty===0?'#f5f5f5':'var(--red-bg)', color:qty===0?'#bbb':'var(--red)', border:'none', borderRadius:7, fontSize:13, fontWeight:700 }}>－ Remove</button>
      </div>
      <div style={{ fontSize:11, color:'var(--mid)' }}>{p.supplier?.name??'—'}</div>
    </div>
  )
}

function Spinner() {
  return <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'5rem', gap:14 }}><div style={{ width:36, height:36, border:'3px solid var(--border)', borderTopColor:'var(--blue)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/><p style={{ fontSize:13, color:'var(--mid)' }}>Loading…</p></div>
}
function ErrorBox({ msg }) {
  return <div style={{ background:'var(--red-bg)', border:'1.5px solid #fca5a5', borderRadius:12, padding:'1.5rem', textAlign:'center', color:'var(--red)' }}><div style={{ fontSize:28, marginBottom:8 }}>⚠️</div><div style={{ fontWeight:700 }}>Backend unreachable</div><div style={{ fontSize:13, marginTop:4 }}>{msg}</div></div>
}
function EmptyState({ title, sub }) {
  return <div style={{ textAlign:'center', padding:'4rem', color:'var(--mid)' }}><div style={{ fontSize:42, marginBottom:10 }}>📭</div><h3 style={{ fontSize:15, fontWeight:700, color:'var(--navy)', marginBottom:4 }}>{title}</h3><p style={{ fontSize:13 }}>{sub}</p></div>
}