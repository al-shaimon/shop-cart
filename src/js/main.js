// Cart state
let cart = {
  items: [],
  subtotal: 0,
  shipping: 0,
  discount: 0,
  total: 0,
};

// Products state
let products = [];

// DOM Elements
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const closeMenu = document.getElementById('closeMenu');
const productsContainer = document.getElementById('products');
const heroSlider = document.getElementById('heroSlider');
const sliderDots = document.getElementById('sliderDots');
const prevSlideBtn = document.getElementById('prevSlide');
const nextSlideBtn = document.getElementById('nextSlide');

// Event Listeners
menuBtn.addEventListener('click', toggleMenu);
closeMenu.addEventListener('click', toggleMenu);
document.addEventListener('DOMContentLoaded', initApp);

// Hero slider event listeners
if (heroSlider) {
  prevSlideBtn.addEventListener('click', () => changeSlide(-1));
  nextSlideBtn.addEventListener('click', () => changeSlide(1));
  initSlider();
}

// Initialize
function initApp() {
  loadProducts();
  loadCart();
}

// Functions
async function loadProducts() {
  try {
    // Fetch products from products.json
    const response = await fetch('https://al-shaimon.github.io/shop-cart-api/products.json');
    const data = await response.json();
    products = data.products;

    // Render products
    renderProducts(products);
  } catch (error) {
    console.error('Error loading products:', error);
    productsContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12">
        <i class="fas fa-exclamation-triangle text-5xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700">Error loading products</h3>
        <p class="text-gray-500 mt-2">Please try again later</p>
      </div>
    `;
  }
}

function renderProducts(productsToRender) {
  if (!productsContainer) return;

  if (productsToRender.length === 0) {
    productsContainer.innerHTML = `
      <div class="col-span-full flex flex-col items-center justify-center py-12">
        <i class="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
        <h3 class="text-xl font-semibold text-gray-700">No products found</h3>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = productsToRender
    .map(
      (product) => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div class="relative overflow-hidden group">
              <img src="${product.image}" alt="${
        product.name
      }" class="w-full h-60 object-cover group-hover:scale-105 transition-transform">
              <div class="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onclick="quickView(${product.id})"
                  class="bg-white text-gray-800 rounded-full h-10 w-10 flex items-center justify-center mr-2 hover:bg-primary hover:text-white transition-colors"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                  class="bg-white text-gray-800 rounded-full h-10 w-10 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <i class="fas fa-shopping-cart"></i>
                </button>
              </div>
            </div>
            <div class="p-4">
                <div class="text-xs text-gray-500 mb-1">${product.category}</div>
                <h3 class="text-lg font-semibold">${product.name}</h3>
                <p class="text-gray-600 text-sm mt-1 h-12 overflow-hidden">${
                  product.description
                }</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xl font-bold">$${product.price.toFixed(2)}</span>
                    <button 
                        onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})"
                        class="btn btn-primary"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join('');
}

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCartCount();
  }
}

function updateCartCount() {
  // Count unique products in cart instead of total quantity
  const count = cart.items.length;
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

// Mobile menu toggle
function toggleMenu() {
  mobileMenu.classList.toggle('hidden');
  const menuContent = mobileMenu.querySelector('.bg-white');
  if (!mobileMenu.classList.contains('hidden')) {
    setTimeout(() => menuContent.classList.remove('-translate-x-full'), 10);
  } else {
    menuContent.classList.add('-translate-x-full');
  }
}

// Hero slider functionality
function initSlider() {
  let currentSlide = 0;
  const slides = heroSlider.querySelectorAll('.slide');
  const totalSlides = slides.length;

  // Setup initial state
  slides[0].classList.add('active');

  // Create dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'mx-1');
    if (i === 0) dot.classList.add('bg-primary');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
  }

  // Auto-rotate slides
  setInterval(() => {
    changeSlide(1);
  }, 5000);

  // Move to specific slide
  window.goToSlide = function (index) {
    const dots = sliderDots.querySelectorAll('button');

    slides.forEach((slide) => slide.classList.remove('active'));
    dots.forEach((dot) => dot.classList.remove('bg-primary'));

    slides[index].classList.add('active');
    dots[index].classList.add('bg-primary');

    currentSlide = index;
  };

  // Move slider prev/next
  window.changeSlide = function (direction) {
    let newIndex = currentSlide + direction;

    if (newIndex < 0) newIndex = totalSlides - 1;
    if (newIndex >= totalSlides) newIndex = 0;

    goToSlide(newIndex);
  };
}

// Quick view functionality
window.quickView = function (productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  // Create modal element
  const modal = document.createElement('div');
  modal.id = 'productModal';
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center';
  modal.innerHTML = `
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
      <div class="flex justify-end p-2">
        <button id="closeModal" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div class="flex items-center justify-center">
          <img src="${product.image}" alt="${product.name}" class="max-h-80 object-contain">
        </div>
        <div>
          <span class="text-sm text-gray-500">${product.category}</span>
          <h2 class="text-2xl font-bold mt-1">${product.name}</h2>
          <div class="mt-4">
            <p class="text-gray-600">${product.description}</p>
          </div>
          <div class="mt-6">
            <span class="text-3xl font-bold">$${product.price.toFixed(2)}</span>
          </div>
          <div class="mt-6">
            <button 
              class="btn btn-primary w-full"
              onclick="addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')}); closeModal();"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Add event listeners
  const closeModalBtn = modal.querySelector('#closeModal');
  closeModalBtn.addEventListener('click', closeModal);
};

// Function to close the modal
window.closeModal = function () {
  const modal = document.getElementById('productModal');
  if (modal) {
    document.body.removeChild(modal);
    document.body.style.overflow = '';
  }
};

window.addToCart = function (product) {
  const existingItem = cart.items.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.items.push({
      ...product,
      quantity: 1,
    });
  }

  // Save to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));

  // Update UI
  updateCartCount();

  // Show confirmation toast
  showToast(`Added ${product.name} to cart`);
};

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
