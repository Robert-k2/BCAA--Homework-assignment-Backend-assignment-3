

// stores the currently selected product for stock adjustment
let stockModalProduct = null;

// stores current stock action type (add or remove)
let stockModalAction  = 'ADD';


// opens the stock adjustment modal
function openStockModal(product, action) {

  stockModalProduct = product; // set active product

  // displays product name in modal
  document.getElementById('stock-modal-name').textContent = product.name;

  // shows current stock quantity
  document.getElementById('stock-current').textContent =
    (product.inventory?.quantity ?? 0) + ' units';

  // resets input field and preview
  document.getElementById('stock-amount').value = '';
  document.getElementById('stock-preview').style.display = 'none';

  hideModalErr('stock-err'); // clears previous errors

  setStockAction(action); // set add or remove mode

  // opens modal
  document.getElementById('stock-modal').classList.add('open');

  // focuses amount input after slight delay
  setTimeout(() => document.getElementById('stock-amount').focus(), 50);
}


// sets stock modal action and updates ui
function setStockAction(action) {

  stockModalAction = action; // update action

  // toggles active tab styles
  document.getElementById('tab-add')
    .classList.toggle('active', action === 'ADD');

  document.getElementById('tab-rem')
    .classList.toggle('active', action === 'REMOVE');

  // updates label text
  document.getElementById('stock-amount-label').textContent =
    action === 'ADD' ? 'Amount to add' : 'Amount to remove';

  // updates confirm button text and style
  const btn = document.getElementById('btn-confirm-stock');
  btn.textContent = action === 'ADD'
    ? 'Confirm Add'
    : 'Confirm Remove';

  btn.className = 'btn-confirm' +
    (action === 'REMOVE' ? ' rem' : '');

  updateStockPreview(); // refresh preview
}


// updates live stock preview based on input
function updateStockPreview() {

  const qty = stockModalProduct?.inventory?.quantity ?? 0;
  const amt = parseInt(document.getElementById('stock-amount').value);
  const preview = document.getElementById('stock-preview');

  // hides preview if invalid amount
  if (!amt || amt <= 0) {
    preview.style.display = 'none';
    return;
  }

  // calculates new stock value
  const newQty = stockModalAction === 'ADD'
    ? qty + amt
    : qty - amt;

  // shows preview with updated value
  preview.style.display = 'block';
  preview.className = stockModalAction === 'ADD' ? 'add' : 'rem';
  preview.innerHTML =
    `New stock will be: <strong>${Math.max(0, newQty)} units</strong>`;
}


// submits stock adjustment to backend
async function submitStock() {

  const amt = parseInt(document.getElementById('stock-amount').value);
  const qty = stockModalProduct?.inventory?.quantity ?? 0;

  hideModalErr('stock-err'); // clear errors

  // validates input amount
  if (!amt || amt <= 0) {
    showModalErr('stock-err', 'Enter a valid amount greater than 0.');
    return;
  }

  // prevents removing more than available stock
  if (stockModalAction === 'REMOVE' && amt > qty) {
    showModalErr('stock-err',
      `Cannot remove more than current stock (${qty}).`);
    return;
  }

  const btn = document.getElementById('btn-confirm-stock');

  // disables button while saving
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    // calls api to adjust stock
    await apiAdjustStock(
      stockModalProduct._id,
      stockModalAction,
      amt
    );

    closeModal('stock-modal'); // closes modal
    await fetchProducts();     // refreshes product list

  } catch (e) {

    // shows backend error message
    showModalErr('stock-err', e.message);

  } finally {

    // restores button state
    btn.disabled = false;
    btn.textContent =
      stockModalAction === 'ADD'
        ? 'Confirm Add'
        : 'Confirm Remove';
  }
}


// opens modal for adding a new product
function openAddModal() {

  // clears all form input fields
  [
    'f-productId','f-price','f-name','f-quantity','f-threshold','f-imageUrl',
    'f-category','f-description','f-supplierName','f-supplierEmail','f-supplierPhone'
  ].forEach(id => {
    document.getElementById(id).value = '';
  });

  hideModalErr('add-err'); // clears errors

  document.getElementById('add-modal')
    .classList.add('open'); // opens add modal
}


// submits new product to backend
async function submitAddProduct() {

  const name  = document.getElementById('f-name').value.trim();
  const price = parseFloat(document.getElementById('f-price').value);

  // validates required fields
  if (!name || isNaN(price)) {
    showModalErr('add-err', 'Name and price are required.');
    return;
  }

  // reads and formats optional fields
  const qty  = parseInt(document.getElementById('f-quantity').value) || 0;
  const thr  = parseInt(document.getElementById('f-threshold').value) || 5;

  const cats = document.getElementById('f-category').value
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const sName  = document.getElementById('f-supplierName').value.trim();
  const sEmail = document.getElementById('f-supplierEmail').value.trim();
  const sPhone = document.getElementById('f-supplierPhone').value.trim();

  // builds request body for api
  const body = {
    productId: document.getElementById('f-productId').value.trim() || undefined,
    name,
    price,
    description: document.getElementById('f-description').value.trim() || undefined,
    imageUrl: document.getElementById('f-imageUrl').value.trim() || undefined,
    quantity: qty,
    categoryList: cats,
    inventory: { quantity: qty, minimumThreshold: thr },
    supplier: (sName || sEmail || sPhone)
      ? { name: sName, contactEmail: sEmail, phone: sPhone }
      : undefined,
  };

  const btn = document.getElementById('btn-confirm-add');

  // disables button during save
  btn.disabled = true;
  btn.textContent = 'Saving…';

  try {
    await apiCreateProduct(body); // sends create request

    closeModal('add-modal'); // closes modal
    await fetchProducts();   // refreshes product list

  } catch (e) {

    showModalErr('add-err', e.message); // shows error

  } finally {

    btn.disabled = false;
    btn.textContent = 'Add product'; // restores button
  }
}