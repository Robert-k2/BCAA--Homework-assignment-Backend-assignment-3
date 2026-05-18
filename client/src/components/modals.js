// stores the currently selected product when adjusting stock
// it allows other functions to access the product being modified
var stockModalProduct = null;

// stores the current stock action type (either 'ADD' or 'REMOVE')
// this determines whether stock will increase or decrease
var stockModalAction  = 'ADD';

function openStockModal(product, action) {
  // saves the selected product into a global variable
  stockModalProduct = product;

  // displays the product name inside the modal
  document.getElementById('stock-modal-name').textContent = product.name;

  // shows the current stock quantity
  document.getElementById('stock-current').textContent =
    (product.inventory?.quantity ?? 0) + ' units';

  // clears the input field
  document.getElementById('stock-amount').value = '';

  // hides any previous stock preview
  document.getElementById('stock-preview').style.display = 'none';

  // clears previous error messages
  hideModalErr('stock-err');

  // sets the action type (add or remove)
  setStockAction(action);

  // opens the modal
  document.getElementById('stock-modal').classList.add('open');

  // focuses on the amount input field for better user experience
  setTimeout(function() {
    document.getElementById('stock-amount').focus();
  }, 50);
}

function setStockAction(action) {
  // updates the current action type
  stockModalAction = action;

  // toggles the active tab styling
  document.getElementById('tab-add')
    .classList.toggle('active', action === 'ADD');
  document.getElementById('tab-rem')
    .classList.toggle('active', action === 'REMOVE');

  // updates the label text based on action
  document.getElementById('stock-amount-label').textContent =
    action === 'ADD' ? 'Amount to add' : 'Amount to remove';

  // updates confirm button text and style
  var btn = document.getElementById('btn-confirm-stock');
  btn.textContent =
    action === 'ADD' ? 'Confirm Add' : 'Confirm Remove';
  btn.className =
    'btn-confirm' + (action === 'REMOVE' ? ' rem' : '');

  // updates stock preview dynamically
  updateStockPreview();
}

function updateStockPreview() {
  // retrieves current stock quantity safely
  var qty = stockModalProduct
    ? (stockModalProduct.inventory
        ? stockModalProduct.inventory.quantity || 0
        : 0)
    : 0;

  // gets the entered amount
  var amt = parseInt(
    document.getElementById('stock-amount').value
  );

  // gets the preview element
  var preview = document.getElementById('stock-preview');

  // hides preview if amount is invalid
  if (!amt || amt <= 0) {
    preview.style.display = 'none';
    return;
  }

  // calculates new stock quantity
  var newQty =
    stockModalAction === 'ADD'
      ? qty + amt
      : qty - amt;

  // shows preview section
  preview.style.display = 'block';

  // applies style depending on action
  preview.className =
    stockModalAction === 'ADD' ? 'add' : 'rem';

  // displays updated stock without allowing negative values
  preview.innerHTML =
    'New stock will be: <strong>' +
    Math.max(0, newQty) +
    ' units</strong>';
}

async function submitStock() {
  // retrieves entered amount
  var amt = parseInt(
    document.getElementById('stock-amount').value
  );

  // retrieves current stock quantity
  var qty = stockModalProduct
    ? (stockModalProduct.inventory
        ? stockModalProduct.inventory.quantity || 0
        : 0)
    : 0;

  // clears previous errors
  hideModalErr('stock-err');

  // validates amount input
  if (!amt || amt <= 0) {
    showModalErr(
      'stock-err',
      'Enter a valid amount greater than 0.'
    );
    return;
  }

  // prevents removing more stock than available
  if (
    stockModalAction === 'REMOVE' &&
    amt > qty
  ) {
    showModalErr(
      'stock-err',
      'Cannot remove more than current stock (' +
        qty +
        ').'
    );
    return;
  }

  // disables confirm button while saving
  var btn =
    document.getElementById('btn-confirm-stock');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    // sends stock update request to backend
    await apiAdjustStock(
      stockModalProduct._id,
      stockModalAction,
      amt
    );

    // closes modal after success
    closeModal('stock-modal');

    // refreshes product list
    await fetchProducts();
  } catch (e) {
    // displays error if request fails
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

function openAddModal() {
  // clears all input fields in add product form
  [
    'f-productId','f-price','f-name','f-image',
    'f-quantity','f-threshold','f-category',
    'f-description','f-supplierName',
    'f-supplierEmail','f-supplierPhone'
  ].forEach(function(id) {
    document.getElementById(id).value = '';
  });

  // clears previous error messages
  hideModalErr('add-err');

  // opens the add product modal
  document.getElementById('add-modal')
    .classList.add('open');
}

async function submitAddProduct() {
  // retrieves required inputs
  var name =
    document.getElementById('f-name')
      .value.trim();
  var price =
    parseFloat(
      document.getElementById('f-price').value
    );

  // validates required fields
  if (!name || isNaN(price)) {
    showModalErr(
      'add-err',
      'Name and price are required.'
    );
    return;
  }

  // retrieves optional fields
  var qty =
    parseInt(
      document.getElementById('f-quantity')
        .value
    ) || 0;
  var thr =
    parseInt(
      document.getElementById('f-threshold')
        .value
    ) || 5;

  // converts category string into array
  var cats =
    document.getElementById('f-category')
      .value.split(',')
      .map(function(s) {
        return s.trim();
      })
      .filter(Boolean);

  var sName =
    document.getElementById('f-supplierName')
      .value.trim();
  var sEmail =
    document.getElementById('f-supplierEmail')
      .value.trim();
  var sPhone =
    document.getElementById('f-supplierPhone')
      .value.trim();
  var image =
    document.getElementById('f-image')
      .value.trim();

  // prepares product object to send to backend
  var body = {
    productId:
      document.getElementById('f-productId')
        .value.trim() || undefined,
    name: name,
    price: price,
    description:
      document.getElementById('f-description')
        .value.trim() || undefined,
    image: image || undefined,
    quantity: qty,
    categoryList: cats,
    inventory: {
      quantity: qty,
      minimumThreshold: thr
    },
    supplier:
      (sName || sEmail || sPhone)
        ? {
            name: sName,
            contactEmail: sEmail,
            phone: sPhone
          }
        : undefined,
  };

  // disables add button while saving
  var btn =
    document.getElementById('btn-confirm-add');
  btn.disabled = true;
  btn.textContent = 'Saving...';

  try {
    // sends product creation request
    await apiCreateProduct(body);

    // closes modal after success
    closeModal('add-modal');

    // refreshes product list
    await fetchProducts();
  } catch (e) {
    // displays error if request fails
    showModalErr('add-err', e.message);
  } finally {
    // restores button state
    btn.disabled = false;
    btn.textContent = 'Add product';
  }
}