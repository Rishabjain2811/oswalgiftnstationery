// Cart page functionality

// Shared cart functions
function getCart() {
  return JSON.parse(localStorage.getItem('oswal_cart') || '[]');
}

function setCart(cart) {
  localStorage.setItem('oswal_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  setCart(cart);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cart-items');
  
  if (!cartItems) {
    console.error('Cart items container not found!');
    return;
  }
  
  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>🛒 Your cart is empty</p>
        <p>Add some products to get started!</p>
        <a href="index.html#featured" class="cta-btn">Browse Products</a>
      </div>
    `;
    return;
  }
  
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name || 'Product'}</h4>
        <p>Quantity: ${item.quantity || 1}</p>
        <p class="cart-item-category">Category: ${item.category || 'General'}</p>
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
  const message = `Hello! I'm interested in the following products from OSWAL GIFT N STATIONERY:\n\n${cart.map(item => `• ${item.name} - Quantity: ${item.quantity}`).join('\n')}\n\nPlease provide pricing and availability.`;
  const whatsappUrl = `https://wa.me/919841137922?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

// Test function to add sample items to cart
function addSampleItems() {
  const sampleItems = [
    { id: 1, name: "Ring Binder A4", quantity: 2, category: "Ring Binders" },
    { id: 2, name: "Display File Clear", quantity: 1, category: "Display Files" },
    { id: 3, name: "Conference Folder", quantity: 3, category: "Conference Folders" }
  ];
  
  setCart(sampleItems);
  console.log('Sample items added to cart');
  renderCart();
  updateCartCount();
}

// Initialize cart page
document.addEventListener('DOMContentLoaded', function() {
  console.log('Cart page loaded');
  
  const sendWhatsAppBtn = document.getElementById('send-whatsapp');
  
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', sendWhatsApp);
  }
  
  // Initialize cart
  renderCart();
  updateCartCount();
  
  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
  
  // Add sample items if cart is empty (for testing)
  const cart = getCart();
  if (cart.length === 0) {
    console.log('Cart is empty, adding sample items for testing');
    addSampleItems();
  }
});

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

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); 
