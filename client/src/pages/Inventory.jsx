import React, { useState } from 'react'
import Badge from '../components/Badge.jsx'
import StockModal from '../components/StockModal.jsx'

const IMG_URL = () =>
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=72&h=72&fit=crop&auto=format";

export default function Inventory({ products, onAdjust }) {
  const [filter, setFilter]     = useState('all')
  const [adjusting, setAdjusting] = useState(null)

  const totalUnits = products.reduce((s,p) => s+(p.inventory?.quantity??0), 0)
  const lowCount   = products.filter(p => { const q=p.inventory?.quantity??0; return q>0&&q<=(p.inventory?.minimumThreshold??5); }).length
  const outCount   = products.filter(p => (p.inventory?.quantity??0)===0).length
  const totalVal   = products.reduce((s,p) => s+(p.price??0)*(p.inventory?.quantity??0), 0)

  const sorted   = [...products].sort((a,b) => (a.inventory?.quantity??0)-(b.inventory?.quantity??0))
  const filtered = sorted.filter(p => {
    const qty=p.inventory?.quantity??0, thr=p.inventory?.minimumThreshold??5
    if (filter==='low') return qty>0&&qty<=thr
    if (filter==='out') return qty===0
    if (filter==='ok')  return qty>thr
    return true
  })

  const stats = [
    { label:'Total units',  value: totalUnits.toLocaleString(), cls:'' },
    { label:'Low stock',    value: lowCount,  cls:'warn'   },
    { label:'Out of stock', value: outCount,  cls:'danger' },
    { label:'Stock value',  value: '$'+totalVal.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}), cls:'' },
  ]

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div>
          <h2 style={{ fontSize:22, fontWeight:800, color:'var(--navy)', fontFamily:'Syne,sans-serif' }}>Inventory</h2>
          <p style={{ fontSize:13, color:'var(--mid)', marginTop:3 }}>Live stock levels — sorted lowest first</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'1.5rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:12, padding:'1rem 1.25rem' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--light)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:800, color: s.cls==='warn'?'var(--amber)':s.cls==='danger'?'var(--red)':'var(--navy)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:6, marginBottom:'1.25rem' }}>
        {[['all','All'],['ok','Healthy'],['low','Low stock'],['out','Out of stock']].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, border: filter===v?'2px solid var(--blue)':'1.5px solid var(--border)', background: filter===v?'var(--blue)':'#fff', color: filter===v?'#fff':'var(--mid)', transition:'all 0.15s' }}>{l}</button>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map((p,i) => {
          const qty=p.inventory?.quantity??0
          const thr=p.inventory?.minimumThreshold??5
          const pct=Math.min(100,thr>0?Math.round((qty/(thr*4))*100):qty>0?100:0)
          const barColor=qty===0?'#e53e3e':qty<=thr?'#d97706':'#185fa5'
          return (
            <div key={p._id} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:12, padding:'1rem 1.25rem', display:'grid', gridTemplateColumns:'54px 2fr 150px 150px 200px', gap:14, alignItems:'center', transition:'box-shadow 0.15s', animation:`fadeUp 0.2s ease ${i*0.025}s both` }}
              onMouseEnter={e=>e.currentTarget.style.boxShadow='0 3px 16px rgba(24,95,165,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
              <img src={IMG_URL(p.name)} alt={p.name} style={{ width:46, height:46, borderRadius:9, objectFit:'cover', border:'1.5px solid var(--pale)' }}
                onError={e=>{e.target.src=`https://placehold.co/46x46/e6f1fb/185fa5?text=${(p.name||'P')[0]}`}} />
              <div>
                <div style={{ fontWeight:700, color:'var(--navy)', fontSize:14 }}>{p.name}</div>
                <div style={{ marginTop:8, height:6, background:'#e6f1fb', borderRadius:99 }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:barColor, borderRadius:99, transition:'width 0.6s ease' }} />
                </div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:barColor }}>{qty}</div>
                <div style={{ fontSize:11, color:'var(--light)' }}>units in stock</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <Badge qty={qty} threshold={thr} />
                <div style={{ fontSize:11, color:'var(--light)', marginTop:4 }}>threshold: {thr}</div>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>setAdjusting({...p,_defaultAction:'ADD'})} style={{ flex:1, padding:'8px 0', background:'var(--blue)', color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:700 }}>＋ Add</button>
                <button onClick={()=>qty>0&&setAdjusting({...p,_defaultAction:'REMOVE'})} disabled={qty===0} style={{ flex:1, padding:'8px 0', background:qty===0?'#f5f5f5':'var(--red-bg)', color:qty===0?'#bbb':'var(--red)', border:'none', borderRadius:8, fontSize:12, fontWeight:700 }}>－ Remove</button>
              </div>
            </div>
          )
        })}
      </div>

      {adjusting && <StockModal product={adjusting} onClose={()=>setAdjusting(null)} onConfirm={onAdjust} />}
    </div>
  )
}