// Ring Binders Products Data
const ringBinders = [
  { id: 1, name: 'A4 2-Ring Binder', desc: 'Classic 2-ring binder, A4 size, assorted colors.', image: 'CL1027F.jpg' },
  { id: 2, name: 'A4 3-Ring Binder', desc: 'Standard 3-ring binder, perfect for documents.', image: 'CL1034F.jpg' },
  { id: 3, name: 'A4 4-Ring Binder', desc: '4-ring binder for extra secure document holding.', image: 'CL212F.jpg' },
  { id: 4, name: 'A5 2-Ring Binder', desc: 'Compact A5 size, ideal for smaller documents.', image: 'CL3022F.jpg' },
  { id: 5, name: 'A5 3-Ring Binder', desc: 'A5 3-ring binder, great for notebooks.', image: 'CL1027F.jpg' },
  { id: 6, name: 'A4 D-Ring Binder', desc: 'D-ring design for better document access.', image: 'CL1034F.jpg' },
  { id: 7, name: 'A4 O-Ring Binder', desc: 'O-ring binder with smooth opening mechanism.', image: 'CL212F.jpg' },
  { id: 8, name: 'A4 Slant Ring Binder', desc: 'Slant ring design for easy page turning.', image: 'CL3022F.jpg' },
  { id: 9, name: 'A4 Round Ring Binder', desc: 'Round ring binder with classic design.', image: 'CL1027F.jpg' },
  { id: 10, name: 'A4 Lever Arch Binder', desc: 'Lever arch mechanism for secure closure.', image: 'CL1034F.jpg' }
];

// Use localStorage for cart persistence
function getCart() {
  return JSON.parse(localStorage.getItem('oswal_cart') || '[]');
}
function setCart(cart) {
  localStorage.setItem('oswal_cart', JSON.stringify(cart));
}
function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById('cart-count');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  animateCartCount();
}

function animateCartCount() {
  const cartCount = document.getElementById('cart-count');
  cartCount.style.transform = 'scale(1.2)';
  setTimeout(() => {
    cartCount.style.transform = 'scale(1)';
  }, 200);
}

function addToCart(productId) {
  const product = ringBinders.find(p => p.id === productId);
  const quantityInput = document.querySelector(`input[data-id="${productId}"]`);
  const quantity = parseInt(quantityInput.value);
  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId && item.category === 'Ring Binders');
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, quantity, category: 'Ring Binders' });
  }
  setCart(cart);
  updateCartCount();
  quantityInput.value = 1;
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  setCart(updatedCart);
  updateCartCount();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Quantity: ${item.quantity}</p>
      </div>
      <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
    </div>
  `).join('');
}

function sendWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const message = `Hello! I'm interested in the following Ring Binders products from OSWAL GIFT N STATIONERY:\n\n${cart.map(item => `• ${item.name} - Quantity: ${item.quantity}`).join('\n')}\n\nPlease provide pricing and availability.`;
  
  const whatsappUrl = `https://wa.me/919841137922?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function renderRingBinders() {
  const container = document.getElementById('ring-binders-products');
  container.innerHTML = ringBinders.map(product => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" class="product-image" />
      <div class="product-title">${product.name}</div>
      <div class="product-desc">${product.desc}</div>
      <div class="quantity-group">
        <button class="quantity-btn" data-action="decrease" data-id="${product.id}">-</button>
        <input type="number" class="quantity-input" min="1" value="1" data-id="${product.id}" />
        <button class="quantity-btn" data-action="increase" data-id="${product.id}">+</button>
      </div>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    </div>
  `).join('');
  
  // Add event listeners for quantity buttons
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentNode.querySelector('.quantity-input');
      const currentValue = parseInt(input.value);
      
      if (this.dataset.action === 'increase') {
        input.value = currentValue + 1;
      } else if (this.dataset.action === 'decrease' && currentValue > 1) {
        input.value = currentValue - 1;
      }
    });
  });
  
  // Add event listeners for add to cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.dataset.id);
      addToCart(productId);
    });
  });
}

// Cart link functionality
document.querySelector('.cart-link').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
});

// WhatsApp button
document.getElementById('send-whatsapp').addEventListener('click', sendWhatsApp);

// Set active nav link
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Reveal on scroll animation
function revealOnScroll() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (sectionTop < windowHeight * 0.8) {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }
  });
}

// Initialize
renderRingBinders();
updateCartCount();
setActiveNavLink();

// Event listeners
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 