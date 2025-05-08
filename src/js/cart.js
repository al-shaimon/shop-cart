// Cart state
let cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

// Store coupons globally after fetching
let coupons = [];

// DOM Elements
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const couponInput = document.getElementById('couponCode');
const applyCouponBtn = document.getElementById('applyCoupon');
const checkoutBtn = document.getElementById('checkoutBtn');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const shippingSelect = document.getElementById('shippingSelect');
const activeDiscount = document.getElementById('activeDiscount');
const discountText = document.getElementById('discountText');
const discountAmount = document.getElementById('discountAmount');

// Event Listeners
menuBtn.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
applyCouponBtn.addEventListener('click', applyCoupon);
if (shippingSelect) {
  shippingSelect.addEventListener('change', updateShippingMethod);
}
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', processCheckout);
}

// Initialize
document.addEventListener('DOMContentLoaded', initCart);

async function initCart() {
  await loadCoupons();
  loadCart();
  updateCartDisplay();
}

// Load coupons from products.json
async function loadCoupons() {
  try {
    const response = await fetch('https://al-shaimon.github.io/shop-cart-api/products.json');
    const data = await response.json();
    coupons = data.coupons;
  } catch (error) {
    console.error('Error loading coupons:', error);
  }
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function resetOrderSummary() {
  cart.subtotal = 0;
  cart.shipping = 0;
  cart.discount = 0;
  cart.total = 0;

  subtotalEl.textContent = '$0.00';
  shippingEl.textContent = '$0.00';
  totalEl.textContent = '$0.00';

  if (activeDiscount) {
    activeDiscount.classList.add('hidden');
    discountText.textContent = '';
    discountAmount.textContent = '-$0.00';
  }
}

function updateCartCount() {
  const count = cart.items.reduce((total, item) => total + item.quantity, 0);
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function updateCartDisplay() {
  if (!cartItems) return;

  if (cart.items.length === 0) {
    cartItems.innerHTML = `
      <div class="flex flex-col items-center justify-center h-40">
        <i class="fas fa-shopping-cart text-4xl text-gray-300 mb-2"></i>
        <p class="text-gray-500">Your cart is empty</p>
        <a href="/" class="btn btn-primary mt-4">Continue Shopping</a>
      </div>
    `;

    // Disable checkout button and reset order summary
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
      checkoutBtn.classList.remove('bg-primary', 'hover:bg-primary-dark');
    }

    resetOrderSummary();
    return;
  }

  // Enable checkout button
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
    checkoutBtn.classList.add('bg-primary', 'hover:bg-primary-dark');
  }

  cartItems.innerHTML = `
    <table class="w-full">
      <thead class="border-b">
        <tr>
          <th class="text-left pb-4">Product</th>
          <th class="text-center pb-4">Quantity</th>
          <th class="text-right pb-4">Price</th>
          <th class="text-right pb-4">Total</th>
          <th class="pb-4"></th>
        </tr>
      </thead>
      <tbody>
        ${cart.items
          .map(
            (item) => `
          <tr class="border-b">
            <td class="py-4">
              <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-contain mr-4">
                <div>
                  <h4 class="font-semibold">${item.name}</h4>
                  <p class="text-sm text-gray-500">${item.category}</p>
                </div>
              </div>
            </td>
            <td class="py-4">
              <div class="flex items-center justify-center">
                <button onclick="updateQuantity(${item.id}, ${
              item.quantity - 1
            })" class="btn btn-secondary px-2 py-1">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${
              item.quantity + 1
            })" class="btn btn-secondary px-2 py-1">+</button>
              </div>
            </td>
            <td class="py-4 text-right">$${item.price.toFixed(2)}</td>
            <td class="py-4 text-right font-semibold">$${(item.price * item.quantity).toFixed(
              2
            )}</td>
            <td class="py-4 text-right">
              <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;

  calculateTotals();
}

function toggleMenu() {
  mobileMenu.classList.toggle('hidden');
  const menuContent = mobileMenu.querySelector('.bg-white');
  if (!mobileMenu.classList.contains('hidden')) {
    setTimeout(() => menuContent.classList.remove('-translate-x-full'), 10);
  } else {
    menuContent.classList.add('-translate-x-full');
  }
}

window.updateQuantity = function (productId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(productId);
    return;
  }

  const item = cart.items.find((item) => item.id === productId);
  if (item) {
    item.quantity = newQuantity;
    updateCart();
  }
};

window.removeFromCart = function (productId) {
  cart.items = cart.items.filter((item) => item.id !== productId);
  updateCart();

  if (cart.items.length === 0) {
    resetOrderSummary();
  }

  showToast('Item removed from cart');
};

function updateCart() {
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update the UI
  updateCartCount();
  updateCartDisplay();
}

function calculateTotals() {
  // Calculate subtotal
  cart.subtotal = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Set shipping cost based on cart items
  cart.shipping = cart.items.length > 0 ? 10 : 0; // Only apply $10 shipping if cart has items

  // Apply discount if any
  const discountValue = cart.subtotal * (cart.discount / 100);

  // Calculate final total
  cart.total = cart.subtotal + cart.shipping - discountValue;

  // Update DOM
  subtotalEl.textContent = `$${cart.subtotal.toFixed(2)}`;
  shippingEl.textContent = `$${cart.shipping.toFixed(2)}`;
  totalEl.textContent = `$${cart.total.toFixed(2)}`;

  // Update discount display
  if (cart.discount > 0 && activeDiscount) {
    discountText.textContent = `${cart.discount}% discount applied`;
    discountAmount.textContent = `-$${discountValue.toFixed(2)}`;
    activeDiscount.classList.remove('hidden');
  } else if (activeDiscount) {
    activeDiscount.classList.add('hidden');
  }

  // Update cart in localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  if (!code) return;

  const coupon = coupons.find((c) => c.code === code);

  if (coupon) {
    if (coupon.type === 'percentage') {
      cart.discount = coupon.discount;
      const savedAmount = cart.subtotal * (coupon.discount / 100);
      showToast(`Coupon applied! You saved $${savedAmount.toFixed(2)}`, 'success');
    } else if (coupon.type === 'fixed' && coupon.applies_to === 'shipping') {
      const originalShipping = cart.shipping;
      cart.shipping = Math.max(0, cart.shipping - coupon.discount);
      const savedAmount = originalShipping - cart.shipping;
      showToast(`Shipping discount of $${savedAmount.toFixed(2)} applied!`, 'success');
    }

    calculateTotals();
    couponInput.value = '';
  } else {
    showToast('Invalid coupon code', 'error');
  }
}

function processCheckout() {
  // Typically this would redirect to a checkout page or call a payment API
  showToast('Processing your order...', 'success');

  // Simulate a checkout process
  setTimeout(() => {
    showToast('Order placed successfully!', 'success');

    // Clear cart after successful checkout
    cart = {
      items: [],
      subtotal: 0,
      shipping: 0,
      discount: 0,
      total: 0,
    };

    // Update UI and localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    resetOrderSummary(); // Ensure order summary is reset

    // Reset coupon input
    if (couponInput) {
      couponInput.value = '';
    }
  }, 2000);
}

// Toast notification
function showToast(message, type = 'success') {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transform transition-transform duration-500 translate-y-20 z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.classList.remove('translate-y-20');
  }, 10);

  // Remove after delay
  setTimeout(() => {
    toast.classList.add('translate-y-20');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}
