// No imports needed — vanilla JS global scope

// ── Product image — uses imageUrl from DB, falls back to placeholder ──
function getImg(product) {
  if (product?.imageUrl) return product.imageUrl;
  const letter = encodeURIComponent(product?.name?.[0] ?? 'P');
  return `https://placehold.co/72x72/e6f1fb/185fa5?text=${letter}`;
}

// ── Stock status ──────────────────────────────────────────
function stockStatus(qty, thr) {
  if (qty === 0) return 'out';
  if (qty <= thr) return 'low';
  return 'ok';
}

const STATUS = {
  ok:  { cls: 'ok',  label: 'In stock'     },
  low: { cls: 'low', label: 'Low stock'    },
  out: { cls: 'out', label: 'Out of stock' },
};

function badge(qty, thr) {
  const s = STATUS[stockStatus(qty, thr ?? 5)];
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// ── String helpers ────────────────────────────────────────
function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function fmtPrice(p) { return '$' + Number(p ?? 0).toFixed(2); }
function fmtBig(n)   { return Number(n ?? 0).toLocaleString(); }

// ── UI helpers ────────────────────────────────────────────
function spinner() {
  return `<div class="spinner-wrap"><div class="spinner"></div><p>Loading…</p></div>`;
}
function emptyState(title, sub) {
  return `<div class="empty"><div class="emoji">📭</div><h3>${title}</h3><p>${sub}</p></div>`;
}

// ── Modal helpers ─────────────────────────────────────────
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function onOverlayClick(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }
function showModalErr(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.style.display = 'block';
}
function hideModalErr(id) {
  document.getElementById(id).style.display = 'none';
}









