// no imports needed because this file runs in vanilla js global scope

function renderAnalytics() {

  // retrieves products from global window object
  const prods = window.products ?? [];

  // calculates total number of products
  const total = prods.length;

  // calculates total units across all products
  const units = prods.reduce(
    (s, p) => s + (p.inventory?.quantity ?? 0),
    0
  );

  // calculates total stock value (price × quantity)
  const value = prods.reduce(
    (s, p) =>
      s + (p.price ?? 0) *
      (p.inventory?.quantity ?? 0),
    0
  );

  // calculates average price per product
  const avgP = total > 0
    ? prods.reduce((s, p) => s + (p.price ?? 0), 0) / total
    : 0;

  // counts products that are out of stock
  const out = prods.filter(
    p => (p.inventory?.quantity ?? 0) === 0
  ).length;

  // counts products that are low in stock
  const low = prods.filter(p => {
    const q = p.inventory?.quantity ?? 0;
    return q > 0 &&
           q <= (p.inventory?.minimumThreshold ?? 5);
  }).length;

  // calculates healthy products
  const healthy = total - out - low;

  // renders top analytics summary cards
  document.getElementById('analytics-kpis').innerHTML = [
    { label: 'Total products', value: total, sub: 'SKUs tracked' },
    { label: 'Total units', value: fmtBig(units), sub: 'across all products' },
    { label: 'Stock value', value: '$' + value.toLocaleString(undefined, { maximumFractionDigits: 0 }), sub: 'at current price' },
    { label: 'Avg. price', value: '$' + avgP.toFixed(2), sub: 'per product' },
  ].map(k => `
    <div class="stat-card">
      <div class="stat-label">${k.label}</div>
      <div class="stat-value">${k.value}</div>
      <div class="stat-sub">${k.sub}</div>
    </div>`).join('');

  // renders stock health section
  const healthEl = document.getElementById('health-content');

  if (!total) {
    // displays message if no products exist
    healthEl.innerHTML =
      '<p style="color:#85b7eb;font-size:13px">No products yet.</p>';
  } else {

    // defines stock health categories
    const tiles = [
      { label: 'Healthy', count: healthy, color: '#185fa5', bg: '#e6f1fb' },
      { label: 'Low stock', count: low, color: '#d97706', bg: '#fff3cd' },
      { label: 'Out of stock', count: out, color: '#e53e3e', bg: '#fde8e8' },
    ];

    // renders health tiles and percentage bars
    healthEl.innerHTML = `
      <div class="health-tiles">
        ${tiles.map(t => `
          <div class="health-tile"
               style="background:${t.bg};
               flex:${Math.max(t.count, 0.3) / total * 10}">
            <div class="ht-val"
                 style="color:${t.color}">
                 ${t.count}
            </div>
            <div class="ht-label"
                 style="color:${t.color}">
                 ${t.label}
            </div>
          </div>`).join('')}
      </div>

      ${tiles.map(t => `
        <div class="bar-row">
          <div class="bar-row-top">
            <span class="br-label">${t.label}</span>
            <span class="br-val"
                  style="color:${t.color}">
              ${Math.round((t.count / total) * 100)}%
            </span>
          </div>
          <div class="bar-track">
            <div class="bar-fill"
                 style="width:${(t.count / total) * 100}%;
                        background:${t.color}">
            </div>
          </div>
        </div>`).join('')}
    `;
  }

  // groups products by category
  const byCat = {};

  prods.forEach(p =>
    (p.categoryList?.length
      ? p.categoryList
      : ['Uncategorised'])
    .forEach(c => {
      byCat[c] = (byCat[c] ?? 0) + 1;
    })
  );

  // sorts categories by highest count
  const cats = Object.entries(byCat)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const barColors = [
    '#185fa5','#378add','#85b7eb',
    '#b5d4f4','#0c447c','#042c53'
  ];

  const catEl =
    document.getElementById('categories-content');

  if (!cats.length) {
    // displays message if no categories exist
    catEl.innerHTML =
      '<p style="color:#85b7eb;font-size:13px">No category data yet.</p>';
  } else {

    // renders category bar chart
    catEl.innerHTML =
      cats.map(([cat, count], idx) => `
        <div class="bar-row">
          <div class="bar-row-top">
            <span class="br-label">${esc(cat)}</span>
            <span class="br-val"
                  style="color:${barColors[idx % 6]}">
              ${count}
            </span>
          </div>
          <div class="bar-track">
            <div class="bar-fill"
                 style="width:${(count / (cats[0]?.[1] || 1)) * 100}%;
                        background:${barColors[idx % 6]}">
            </div>
          </div>
        </div>`).join('');
  }

  // calculates top 5 products by stock value
  const topV = [...prods]
    .sort((a, b) =>
      (b.price ?? 0) *
      (b.inventory?.quantity ?? 0)
      -
      (a.price ?? 0) *
      (a.inventory?.quantity ?? 0)
    )
    .slice(0, 5);

  // determines maximum value for scaling bars
  const maxV = topV[0]
    ? (topV[0].price ?? 0) *
      (topV[0].inventory?.quantity ?? 0)
    : 1;

  const topEl =
    document.getElementById('top-value-content');

  if (!topV.length) {
    // displays message if no products exist
    topEl.innerHTML =
      '<p style="color:#85b7eb;font-size:13px">No products yet.</p>';
  } else {

    // renders ranked list of top value products
    topEl.innerHTML =
      topV.map((p, i) => {

        const val =
          (p.price ?? 0) *
          (p.inventory?.quantity ?? 0);

        return `
        <div class="tp-row">
          <span class="tp-rank">#${i + 1}</span>

          <img class="tp-img"
               src="${getImg(p)}"
               alt="${esc(p.name)}"
               onerror="this.src='https://placehold.co/36x36/e6f1fb/185fa5?text=${esc(p.name?.[0] ?? 'P')}'" />

          <div class="tp-info">
            <div class="tp-top">
              <span class="tp-name">
                ${esc(p.name)}
              </span>
              <span class="tp-val">
                $${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div class="bar-track">
              <div class="bar-fill"
                   style="width:${(val / maxV) * 100}%;
                          background:#185fa5;
                          opacity:${0.9 - i * 0.12}">
              </div>
            </div>

            <div class="tp-sub">
              ${p.inventory?.quantity ?? 0}
              units × ${fmtPrice(p.price)}
            </div>
          </div>
        </div>`;
      }).join('');
  }
}