
// global array that stores all products fetched from backend
window.products = [];


// renders all main sections of the application
function renderAll() {

  renderProducts();   // renders products page content
  renderInventory();  // renders inventory page content
  renderAnalytics();  // renders analytics page content
}


// sets up sidebar navigation button click behavior
document.querySelectorAll('.nav-btn').forEach(btn => {

  btn.addEventListener('click', () => {

    // removes active class from all nav buttons
    document.querySelectorAll('.nav-btn')
      .forEach(b => b.classList.remove('active'));

    // hides all pages
    document.querySelectorAll('.page')
      .forEach(p => p.classList.remove('active'));

    // activates the clicked nav button
    btn.classList.add('active');

    // shows the corresponding page section
    document.getElementById('page-' + btn.dataset.page)
      .classList.add('active');

    // conditionally re-renders the selected page
    if (btn.dataset.page === 'inventory')  renderInventory();
    if (btn.dataset.page === 'analytics')  renderAnalytics();
    if (btn.dataset.page === 'products')   renderProducts();
  });

});


// fetches products from backend when app loads
fetchProducts();