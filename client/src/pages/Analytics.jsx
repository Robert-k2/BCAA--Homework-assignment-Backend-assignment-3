import React from 'react'//Imports react libary , allows us to use JSX and React features

const IMG_URL = () =>
  "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=72&h=72&fit=crop&auto=format";

const BAR_COLORS = ['#185fa5','#378add','#85b7eb','#b5d4f4','#0c447c','#042c53']

export default function Analytics({ products }) {
  const total   = products.length
  const units   = products.reduce((s,p) => s+(p.inventory?.quantity??0), 0)
  const value   = products.reduce((s,p) => s+(p.price??0)*(p.inventory?.quantity??0), 0)
  const avgP    = total > 0 ? products.reduce((s,p) => s+(p.price??0), 0) / total : 0
  const out     = products.filter(p => (p.inventory?.quantity??0) === 0).length
  const low     = products.filter(p => { const q=p.inventory?.quantity??0; return q>0&&q<=(p.inventory?.minimumThreshold??5); }).length
  const healthy = total - out - low

  const byCat = {}
  products.forEach(p => (p.categoryList?.length ? p.categoryList : ['Uncategorised'])
    .forEach(c => { byCat[c] = (byCat[c]??0)+1 }))
  const cats = Object.entries(byCat).sort((a,b)=>b[1]-a[1]).slice(0,6)

  const topV = [...products].sort((a,b)=>(b.price??0)*(b.inventory?.quantity??0)-(a.price??0)*(a.inventory?.quantity??0)).slice(0,5)
  const maxV = topV[0] ? (topV[0].price??0)*(topV[0].inventory?.quantity??0) : 1

  const kpis = [
    { label:'Total products', value: total,         sub:'SKUs tracked' },
    { label:'Total units',    value: units.toLocaleString(), sub:'across all products' },
    { label:'Stock value',    value: '$'+value.toLocaleString(undefined,{maximumFractionDigits:0}), sub:'at current price' },
    { label:'Avg. price',     value: '$'+avgP.toFixed(2), sub:'per product' },
  ]

  const healthTiles = [
    { label:'Healthy',      count: healthy, color:'#185fa5', bg:'#e6f1fb' },
    { label:'Low stock',    count: low,     color:'#d97706', bg:'#fff3cd' },
    { label:'Out of stock', count: out,     color:'#e53e3e', bg:'#fde8e8' },
  ]

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:'var(--navy)', fontFamily:'Syne,sans-serif' }}>Analytics</h2>
        <p style={{ fontSize:13, color:'var(--mid)', marginTop:3 }}>Inventory performance overview</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:'1.5rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'1.2rem 1.25rem' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'var(--light)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:6 }}>{k.label}</div>
            <div style={{ fontSize:26, fontWeight:900, color:'var(--navy)', marginBottom:2 }}>{k.value}</div>
            <div style={{ fontSize:11, color:'var(--mid)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
        {/* Stock health */}
        <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'1.25rem' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>Stock health</h3>
          {!total ? <p style={{ color:'var(--light)', fontSize:13 }}>No products yet.</p> : (
            <>
              <div style={{ display:'flex', gap:8, marginBottom:18 }}>
                {healthTiles.map(t => (
                  <div key={t.label} style={{ flex: Math.max(t.count,0.3)/total*10, background:t.bg, borderRadius:8, padding:10 }}>
                    <div style={{ fontSize:20, fontWeight:900, color:t.color }}>{t.count}</div>
                    <div style={{ fontSize:11, fontWeight:600, color:t.color, marginTop:2 }}>{t.label}</div>
                  </div>
                ))}
              </div>
              {healthTiles.map(t => (
                <div key={t.label} style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:12, color:'var(--mid)', fontWeight:600 }}>{t.label}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:t.color }}>{Math.round((t.count/total)*100)}%</span>
                  </div>
                  <div style={{ height:7, background:'#f0f7ff', borderRadius:99 }}>
                    <div style={{ width:`${(t.count/total)*100}%`, height:'100%', background:t.color, borderRadius:99, transition:'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* By category */}
        <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'1.25rem' }}>
          <h3 style={{ fontSize:14, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>Products by category</h3>
          {!cats.length ? <p style={{ color:'var(--light)', fontSize:13 }}>No category data yet.</p> : (
            cats.map(([cat,count],idx) => (
              <div key={cat} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:12, color:'var(--mid)', fontWeight:600 }}>{cat}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:BAR_COLORS[idx%6] }}>{count}</span>
                </div>
                <div style={{ height:7, background:'#f0f7ff', borderRadius:99 }}>
                  <div style={{ width:`${(count/(cats[0]?.[1]||1))*100}%`, height:'100%', background:BAR_COLORS[idx%6], borderRadius:99, transition:'width 0.6s ease' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top by value */}
      <div style={{ background:'#fff', border:'1.5px solid var(--border)', borderRadius:14, padding:'1.25rem' }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--navy)', marginBottom:16 }}>Top products by stock value</h3>
        {!topV.length ? <p style={{ color:'var(--light)', fontSize:13 }}>No products yet.</p> : (
          topV.map((p,i) => {
            const val = (p.price??0)*(p.inventory?.quantity??0)
            return (
              <div key={p._id} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--pale)', width:18, flexShrink:0 }}>#{i+1}</span>
                <img src={IMG_URL(p.name)} alt={p.name} style={{ width:36, height:36, borderRadius:7, objectFit:'cover', border:'1.5px solid var(--pale)', flexShrink:0 }}
                  onError={e=>{e.target.src=`https://placehold.co/36x36/e6f1fb/185fa5?text=${(p.name||'P')[0]}`}} />
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--navy)' }}>{p.name}</span>
                    <span style={{ fontSize:13, fontWeight:800, color:'var(--blue)' }}>${val.toLocaleString(undefined,{maximumFractionDigits:2})}</span>
                  </div>
                  <div style={{ height:7, background:'#f0f7ff', borderRadius:99 }}>
                    <div style={{ width:`${(val/maxV)*100}%`, height:'100%', background:'#185fa5', borderRadius:99, opacity:0.9-i*0.12 }} />
                  </div>
                  <div style={{ fontSize:11, color:'var(--light)', marginTop:3 }}>{p.inventory?.quantity??0} units × ${Number(p.price??0).toFixed(2)}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}