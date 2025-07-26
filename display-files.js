// Display Files Products Data
const displayFiles = [
  { id: 1, name: 'A4 Display File', desc: 'Clear display file for A4 documents, assorted colors.', image: 'CL1027F.jpg' },
  { id: 2, name: 'A5 Display File', desc: 'Compact A5 display file, perfect for smaller documents.', image: 'CL1034F.jpg' },
  { id: 3, name: 'Transparent Display File', desc: 'Crystal clear display file with sturdy construction.', image: 'CL212F.jpg' },
  { id: 4, name: 'Frosted Display File', desc: 'Frosted texture display file for elegant presentation.', image: 'CL3022F.jpg' },
  { id: 5, name: 'Display File with Index', desc: 'Display file with index tabs for easy organization.', image: 'CL1027F.jpg' },
  { id: 6, name: 'Heavy Duty Display File', desc: 'Extra thick display file for frequent use.', image: 'CL1034F.jpg' },
  { id: 7, name: 'Display File - Blue', desc: 'Vibrant blue display file with modern design.', image: 'CL212F.jpg' },
  { id: 8, name: 'Display File - Green', desc: 'Fresh green display file for nature-inspired workspace.', image: 'CL3022F.jpg' },
  { id: 9, name: 'Display File - Red', desc: 'Bold red display file for attention-grabbing documents.', image: 'CL1027F.jpg' },
  { id: 10, name: 'Display File - Yellow', desc: 'Bright yellow display file for cheerful organization.', image: 'CL1034F.jpg' }
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
  const product = displayFiles.find(p => p.id === productId);
  const quantityInput = document.querySelector(`input[data-id="${productId}"]`);
  const quantity = parseInt(quantityInput.value);
  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId && item.category === 'Display Files');
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, quantity, category: 'Display Files' });
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
  const cart = getCart();
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
  const cart = getCart();
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  const message = `Hello! I'm interested in the following Display Files products from OSWAL GIFT N STATIONERY:\n\n${cart.map(item => `• ${item.name} - Quantity: ${item.quantity}`).join('\n')}\n\nPlease provide pricing and availability.`;
  
  const whatsappUrl = `https://wa.me/919841137922?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function renderDisplayFiles() {
  const container = document.getElementById('display-files-products');
  container.innerHTML = displayFiles.map(product => `
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
renderDisplayFiles();
updateCartCount();
setActiveNavLink();

// Event listeners
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 