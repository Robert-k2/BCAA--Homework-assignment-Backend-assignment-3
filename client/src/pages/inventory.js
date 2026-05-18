// no imports needed — vanilla js global scope

// keeps track of the current inventory filter (all, low, out, ok)
let invFilter = 'all';

// updates the active filter and re-renders the inventory list
function setInvFilter(f, el) {
  invFilter = f;

  // removes active class from all filter pills
  document.querySelectorAll('#inv-filter-pills .pill')
    .forEach(p => p.classList.remove('active'));

  // adds active class to the clicked pill
  el.classList.add('active');

  // re-renders inventory based on new filter
  renderInventory();
}

// main function that renders the full inventory section
function renderInventory() {

  // safely reads products from global scope
  const prods = window.products ?? [];

  // calculates total quantity across all products
  const totalUnits = prods.reduce(
    (s, p) => s + (p.inventory?.quantity ?? 0),
    0
  );

  // counts products that are low stock (above 0 but below or equal to threshold)
  const lowCount = prods.filter(p => {
    const q = p.inventory?.quantity ?? 0;
    return q > 0 && q <= (p.inventory?.minimumThreshold ?? 5);
  }).length;

  // counts products that are completely out of stock
  const outCount = prods.filter(
    p => (p.inventory?.quantity ?? 0) === 0
  ).length;

  // calculates total stock value (price × quantity)
  const totalVal = prods.reduce(
    (s, p) => s + (p.price ?? 0) * (p.inventory?.quantity ?? 0),
    0
  );

  // renders summary statistic cards
  document.getElementById('inv-stats').innerHTML = [
    { label: 'Total units',  value: fmtBig(totalUnits), cls: '' },
    { label: 'Low stock',    value: lowCount,           cls: 'warn' },
    { label: 'Out of stock', value: outCount,           cls: 'danger' },
    { label: 'Stock value',  value: '$' + totalVal.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }),
      cls: ''
    },
  ].map(c => `
    <div class="stat-card">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value ${c.cls}">${c.value}</div>
    </div>
  `).join('');

  // sorts products by quantity (lowest first)
  const sorted = [...prods].sort(
    (a, b) => (a.inventory?.quantity ?? 0) - (b.inventory?.quantity ?? 0)
  );

  // filters products based on selected filter
  const filtered = sorted.filter(p => {
    const qty = p.inventory?.quantity ?? 0;
    const thr = p.inventory?.minimumThreshold ?? 5;

    if (invFilter === 'low') return qty > 0 && qty <= thr;
    if (invFilter === 'out') return qty === 0;
    if (invFilter === 'ok')  return qty > thr;

    return true; // default = show all
  });

  const list = document.getElementById('inventory-list');

  // shows empty state if no products match filter
  if (!filtered.length) {
    list.innerHTML = emptyState(
      'No products match this filter',
      'Try a different filter above.'
    );
    return;
  }

  // renders each product row
  list.innerHTML = filtered.map((p, i) => {

    const qty = p.inventory?.quantity ?? 0;
    const thr = p.inventory?.minimumThreshold ?? 5;

    // calculates percentage for visual stock bar
    const pct = thr > 0
      ? Math.min(100, Math.round((qty / (thr * 4)) * 100))
      : qty > 0 ? 100 : 0;

    // determines bar color based on stock level
    const barColor =
      qty === 0 ? '#e53e3e' :
      qty <= thr ? '#d97706' :
      '#185fa5';

    // gets status config from global status map
    const s = STATUS[stockStatus(qty, thr)];

    return `
      <div class="inv-row" style="animation-delay:${i * 0.025}s">

        <!-- product image -->
        <img class="inv-img"
          src="${getImg(p)}"
          alt="${esc(p.name)}"
          onerror="this.src='https://placehold.co/46x46/e6f1fb/185fa5?text=${esc(p.name?.[0] ?? 'P')}'" />

        <!-- product name and stock bar -->
        <div>
          <div class="inv-name">${esc(p.name)}</div>
          <div class="inv-bar-wrap">
            <div class="inv-bar"
              style="width:${pct}%;background:${barColor}">
            </div>
          </div>
        </div>

        <!-- quantity display -->
        <div>
          <div class="inv-qty-val"
            style="color:${barColor}">
            ${qty}
          </div>
          <div class="inv-qty-lbl">units in stock</div>
        </div>

        <!-- stock status badge and threshold -->
        <div>
          <span class="badge ${s.cls}">${s.label}</span>
          <div class="inv-threshold">threshold: ${thr}</div>
        </div>

        <!-- stock action buttons -->
        <div class="inv-btns">
          <button class="inv-btn-add"
            data-id="${esc(p._id)}"
            data-action="ADD">
            ＋ Add
          </button>

          <button class="inv-btn-rem"
            data-id="${esc(p._id)}"
            data-action="REMOVE"
            ${qty === 0 ? 'disabled' : ''}>
            － Remove
          </button>
        </div>

      </div>
    `;
  }).join('');

  // attaches click listeners to add/remove buttons
  document.querySelectorAll('.inv-btn-add, .inv-btn-rem')
    .forEach(btn => {
      btn.addEventListener('click', () => {

        // finds selected product by id
        const p = (window.products ?? [])
          .find(x => x._id === btn.dataset.id);

        // opens stock modal if product exists
        if (p) openStockModal(p, btn.dataset.action);
      });
    });
}