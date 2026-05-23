import { useState, useEffect, useCallback } from 'react'
import { fetchAllProducts, adjustStock as apiAdjustStock, createProduct as apiCreateProduct } from '../api/products.js'

export function useProducts() {
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [connected, setConnected] = useState(true)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllProducts()
      setProducts(data)
      setConnected(true)
    } catch (e) {
      setError(e.message)
      setConnected(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  // Adjust stock — updates locally then syncs backend
  const adjustStock = useCallback(async (productId, action, amount) => {
    // Optimistic update — update UI instantly
    setProducts(prev => prev.map(p => {
      if (p._id !== productId) return p
      const currentQty = p.inventory?.quantity ?? 0
      const newQty = action === 'ADD' ? currentQty + amount : currentQty - amount
      return {
        ...p,
        inventory: { ...p.inventory, quantity: Math.max(0, newQty) }
      }
    }))
    // Sync with backend
    await apiAdjustStock(productId, action, amount)
  }, [])

  // Add new product
  const addProduct = useCallback(async (body) => {
    const newProduct = await apiCreateProduct(body)
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }, [])

  return { products, loading, error, connected, loadProducts, adjustStock, addProduct }
}