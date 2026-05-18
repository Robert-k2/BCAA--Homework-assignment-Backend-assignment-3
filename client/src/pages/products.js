// no imports needed — vanilla js global scope

// stores current view type (grid or list)
let productView   = 'grid';

// stores current stock filter (all, low, out)
let productFilter = 'all';

// stores current search text
let productSearch = '';


// changes between grid and list view
function setView(v) {
  productView = v; // update view mode

  // toggles active button styles
  document.getElementById('view-grid').classList.toggle('active', v === 'grid');
  document.getElementById('view-list').classList.toggle('active', v === 'list');

  renderProducts(); // re-render products
}


// sets stock filter and refreshes product display
function setProductFilter(f, el) {
  productFilter = f; // update filter

  // removes active class from all filter pills
  document.querySelectorAll('#products-filter-pills .pill')
    .forEach(p => p.classList.remove('active'));

  el.classList.add('active'); // activate selected pill
  renderProducts(); // refresh products
}


// handles typing in search input
function onProductSearch() {
  productSearch = document.getElementById('products-search').value;

  // shows or hides clear button
  document.getElementById('products-search-clear').style.display =
    productSearch ? 'block' : 'none';

  renderProducts(); // update results
}


// clears search field and refreshes view
function clearProductSearch() {
  document.getElementById('products-search').value = '';
  productSearch = '';
  document.getElementById('products-search-clear').style.display = 'none';

  renderProducts();
}


// returns products filtered by search and stock status
function getFilteredProducts() {
  const q = productSearch.toLowerCase();

  return (window.products ?? []).filter(p => {

    // checks if search matches name, id, description, or category
    const match = !q ||
      (p.name ?? '').toLowerCase().includes(q) ||
      (p.productId ?? '').toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.categoryList ?? []).some(c => c.toLowerCase().includes(q));

    if (!match) return false;

    const qty = p.inventory?.quantity ?? 0;
    const thr = p.inventory?.minimumThreshold ?? 5;

    // applies stock filters
    if (productFilter === 'low') return qty > 0 && qty <= thr;
    if (productFilter === 'out') return qty === 0;

    return true; // default = all
  });
}


// renders products in grid or list layout
function renderProducts() {
  const list = getFilteredProducts();
  const wrap = document.getElementById('products-content');

  // updates subtitle with total product count
  document.getElementById('products-subtitle').textContent =
    `${(window.products ?? []).length} total products`;

  // shows empty state if no results
  if (!list.length) {
    wrap.innerHTML = emptyState(
      'No products found',
      productSearch ? `No results for "${productSearch}"` : 'Add your first product above.'
    );
    return;
  }

  // renders grid layout
  if (productView === 'grid') {
    wrap.innerHTML =
      `<div id="products-grid">${list.map((p, i) => cardHTML(p, i)).join('')}</div>`;
  }
  // renders list layout
  else {
    wrap.innerHTML = `
      <div id="products-list">
        <div class="list-header">
          <div></div>
          <div>Product</div>
          <div>Price</div>
          <div>Qty</div>
          <div>Status</div>
          <div>Adjust stock</div>
          <div>Supplier</div>
        </div>
        ${list.map((p, i) => rowHTML(p, i)).join('')}
      </div>`;
  }

  attachStockButtons(); // reattach stock button listeners
}


// builds html for grid card view
function cardHTML(p, i) {
  const qty  = p.inventory?.quantity ?? 0;
  const thr  = p.inventory?.minimumThreshold ?? 5;

  // builds category tags
  const cats = (p.categoryList ?? [])
    .map(c => `<span class="cat-tag">${esc(c)}</span>`)
    .join('');

  // optional description section
  const desc = p.description
    ? `<div class="card-desc">${esc(p.description)}</div>`
    : '';

  // optional supplier section
  const sup  = p.supplier?.name
    ? `<div class="card-supplier">📦 <strong>${esc(p.supplier.name)}</strong></div>`
    : '';

  return `
    <div class="product-card" style="animation-delay:${i * 0.03}s">
      <div class="card-top">
        <img class="card-img" src="${getImg(p)}" alt="${esc(p.name)}" />
        <div class="card-meta">
          <div class="card-name">${esc(p.name)}</div>
          <div class="card-id">${esc(p.productId ?? '—')}</div>
          <div style="margin-top:5px">${badge(qty, thr)}</div>
        </div>
      </div>
      ${desc}
      <div class="card-price-row">
        <span class="card-price">${fmtPrice(p.price)}</span>
        <span class="card-units"><strong>${qty}</strong> units</span>
      </div>
      ${cats ? `<div class="card-cats">${cats}</div>` : ''}
      <div class="card-actions">
        <button data-id="${esc(p._id)}" data-action="ADD">＋ Add stock</button>
        <button data-id="${esc(p._id)}" data-action="REMOVE" ${qty === 0 ? 'disabled' : ''}>－ Remove stock</button>
      </div>
      ${sup}
    </div>`;
}


// builds html for list row view
function rowHTML(p, i) {
  const qty = p.inventory?.quantity ?? 0;
  const thr = p.inventory?.minimumThreshold ?? 5;

  return `
    <div class="list-row" style="animation-delay:${i * 0.025}s">
      <img class="list-img" src="${getImg(p)}" alt="${esc(p.name)}" />
      <div>
        <div class="list-name">${esc(p.name)}</div>
        <div class="list-id">${esc(p.productId ?? '—')}</div>
      </div>
      <div class="list-price">${fmtPrice(p.price)}</div>
      <div class="list-qty">${qty}</div>
      <div>${badge(qty, thr)}</div>
      <div class="list-btns">
        <button data-id="${esc(p._id)}" data-action="ADD">＋ Add</button>
        <button data-id="${esc(p._id)}" data-action="REMOVE" ${qty === 0 ? 'disabled' : ''}>－ Remove</button>
      </div>
      <div class="list-supplier">${esc(p.supplier?.name ?? '—')}</div>
    </div>`;
}


// attaches click events to stock adjustment buttons
function attachStockButtons() {
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const p = (window.products ?? [])
        .find(x => x._id === btn.dataset.id);

      if (p) openStockModal(p, btn.dataset.action);
    });
  });
}