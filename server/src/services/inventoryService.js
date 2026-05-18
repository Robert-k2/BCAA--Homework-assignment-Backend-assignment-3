import Product from "../models/Product.js";
 
// ── Get total stock value ─────────────────────────────────
export const getTotalStockValue = async () => {
  const products = await Product.find();
  return products.reduce((sum, p) => sum + (p.price ?? 0) * (p.inventory?.quantity ?? 0), 0);
};
 
// ── Get low stock products ────────────────────────────────
export const getLowStockProducts = async () => {
  const products = await Product.find();
  return products.filter(p => {
    const qty = p.inventory?.quantity ?? 0;
    const thr = p.inventory?.minimumThreshold ?? 5;
    return qty > 0 && qty <= thr;
  });
};
 
// ── Get out of stock products ─────────────────────────────
export const getOutOfStockProducts = async () => {
  const products = await Product.find({ "inventory.quantity": 0 });
  return products;
};
 
// ── Get inventory summary ─────────────────────────────────
export const getInventorySummary = async () => {
  const products = await Product.find();
  const totalProducts  = products.length;
  const totalUnits     = products.reduce((s, p) => s + (p.inventory?.quantity ?? 0), 0);
  const totalValue     = products.reduce((s, p) => s + (p.price ?? 0) * (p.inventory?.quantity ?? 0), 0);
  const lowStock       = products.filter(p => { const q = p.inventory?.quantity ?? 0; return q > 0 && q <= (p.inventory?.minimumThreshold ?? 5); }).length;
  const outOfStock     = products.filter(p => (p.inventory?.quantity ?? 0) === 0).length;
 
  return { totalProducts, totalUnits, totalValue, lowStock, outOfStock }; 
