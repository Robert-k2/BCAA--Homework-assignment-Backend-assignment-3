import React, { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Products from './pages/Products.jsx'
import Inventory from './pages/Inventory.jsx'
import Analytics from './pages/Analytics.jsx'
import { useProducts } from './hooks/useProducts.js'

export default function App() {
  const [page, setPage] = useState('products')
  const { products, loading, error, connected, loadProducts, adjustStock, addProduct } = useProducts()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar page={page} setPage={setPage} connected={connected} />

      <main style={{ marginLeft: 220, flex: 1, padding: '2rem 2.5rem' }}>

        {/* Error banner */}
        {error && (
          <div style={{
            background: 'var(--red-bg)', border: '1.5px solid #fca5a5',
            borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <span style={{ fontSize: 13, color: 'var(--red)' }}>
              ⚠️ <strong>Backend unreachable</strong> — make sure your server is running on port 5000.
            </span>
            <button onClick={loadProducts} style={{
              padding: '6px 14px', background: 'var(--red)', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600,
            }}>Retry</button>
          </div>
        )}

        {/* Pages */}
        {page === 'products'  && (
          <Products
            products={products}
            loading={loading}
            error={error}
            onAdjust={adjustStock}
            onAdd={addProduct}
          />
        )}
        {page === 'inventory' && (
          <Inventory
            products={products}
            onAdjust={adjustStock}
          />
        )}
        {page === 'analytics' && (
          <Analytics products={products} />
        )}
      </main>
    </div>
  )
}