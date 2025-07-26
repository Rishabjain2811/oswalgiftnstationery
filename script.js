
// Minimalist product data grouped by category
const productCategories = [
  {
    name: 'Button Files',
    products: [
      {
        id: 1,
        name: 'A4 Plastic File',
        desc: 'Durable, transparent A4 file for documents.',
        image: 'CL1027F.jpg',
        featured: true,
      },
      {
        id: 2,
        name: 'Button Folder',
        desc: 'Secure button closure, assorted colors.',
        image: 'CL1034F.jpg',
        featured: true,
      },
      {
        id: 3,
        name: 'Document Envelope',
        desc: 'Snap closure, fits A4 and legal size.',
        image: 'CL2029F.jpg',
        featured: false,
      },
    ],
  },
  {
    name: 'Clip Files',
    products: [
      {
        id: 4,
        name: 'Clip File',
        desc: 'Strong clip, easy to use.',
        image: 'CL212F.jpg',
        featured: false,
      },
      {
        id: 5,
        name: 'Report File',
        desc: 'For presentations and reports.',
        image: 'CL804F.jpg',
        featured: true,
      },
    ],
  },
  {
    name: 'Display Books',
    products: [
      {
        id: 6,
        name: 'Display Book',
        desc: '20 pockets, clear view.',
        image: 'CL3022F.jpg',
        featured: false,
      },
      {
        id: 7,
        name: 'Expanding File',
        desc: 'Multi-pocket, for organizing paperwork.',
        image: 'CL1043F.jpg',
        featured: false,
      },
    ],
  },
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
function addToCart(productId, category) {
  const product = findProduct(productId, category);
  const quantityInput = document.querySelector(`input[data-id="${productId}"][data-cat="${category}"]`);
  const quantity = parseInt(quantityInput.value);
  let cart = getCart();
  const existingItem = cart.find(item => item.id === productId && item.category === category);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: product.id, name: product.name, quantity, category });
  }
  setCart(cart);
  updateCartCount();
  quantityInput.value = 1;
}
function findProduct(productId, category) {
  for (const cat of productCategories) {
    if (cat.name === category) {
      return cat.products.find(p => p.id === productId);
    }
  }
  return null;
}

function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  setCart(updatedCart);
  updateCartCount();
  renderCart();
}

function changeCartQty(productId, newQty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.quantity = Math.max(1, newQty);
    setCart(cart);
    renderCart();
    updateCartCount();
  }
}

function animateCartCount() {
  const el = document.getElementById('cart-count');
  const icon = document.querySelector('.cart-icon');
  el.style.transform = 'scale(1.3)';
  if (icon) {
    icon.classList.add('animated');
    setTimeout(() => icon.classList.remove('animated'), 400);
  }
  setTimeout(() => { el.style.transform = 'scale(1)'; }, 200);
}

function renderFeaturedProducts() {
  const featured = [];
  productCategories.forEach(cat => {
    cat.products.forEach(p => { if (p.featured) featured.push({ ...p, category: cat.name }); });
  });
  // Add more featured products for demo if needed
  while (featured.length < 8) {
    featured.push(...featured.slice(0, 8 - featured.length));
  }
  const container = document.getElementById('featured-products');
  container.innerHTML = `<div class="featured-scroll">${
    featured.map(product => `
      <div class="product-card">
        <img src="${product.image}" alt="${product.name}" class="product-image" />
        <div class="product-title">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="quantity-group">
          <button class="quantity-btn" data-action="decrease" data-id="${product.id}" data-cat="${product.category}">-</button>
          <input type="number" class="quantity-input" min="1" value="1" data-id="${product.id}" data-cat="${product.category}" />
          <button class="quantity-btn" data-action="increase" data-id="${product.id}" data-cat="${product.category}">+</button>
        </div>
        <button class="add-to-cart" data-id="${product.id}" data-cat="${product.category}">Add to Cart</button>
      </div>
    `).join('')
  }</div>`;
  addProductCardListeners(container.querySelector('.featured-scroll'), featured);
}

function renderProductCategories() {
  const categoriesContainer = document.getElementById('product-categories');
  categoriesContainer.innerHTML = '';
  productCategories.forEach(cat => {
    const section = document.createElement('div');
    section.className = 'product-category';
    section.innerHTML = `
      <h3 class="category-title">${cat.name}</h3>
      <div class="products">
        ${cat.products.map(product => `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" />
            <div class="product-title">${product.name}</div>
            <div class="product-desc">${product.desc}</div>
            <div class="quantity-group">
              <button class="quantity-btn" data-action="decrease" data-id="${product.id}" data-cat="${cat.name}">-</button>
              <input type="number" class="quantity-input" min="1" value="1" data-id="${product.id}" data-cat="${cat.name}" />
              <button class="quantity-btn" data-action="increase" data-id="${product.id}" data-cat="${cat.name}">+</button>
            </div>
            <button class="add-to-cart" data-id="${product.id}" data-cat="${cat.name}">Add to Cart</button>
          </div>
        `).join('')}
      </div>
    `;
    categoriesContainer.appendChild(section);
    addProductCardListeners(section, cat.products.map(p => ({ ...p, category: cat.name })));
  });
}

function addProductCardListeners(container, products) {
  // Quantity buttons
  container.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      const catName = this.getAttribute('data-cat');
      const input = container.querySelector(`.quantity-input[data-id="${id}"][data-cat="${catName}"]`);
      let val = parseInt(input.value) || 1;
      if (this.getAttribute('data-action') === 'increase') val++;
      else if (val > 1) val--;
      input.value = val;
    });
  });
  // Quantity input validation
  container.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('input', function() {
      if (parseInt(this.value) < 1 || isNaN(parseInt(this.value))) this.value = 1;
    });
  });
  // Add to cart
  container.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      const catName = this.getAttribute('data-cat');
      const product = products.find(p => p.id === id);
      const input = container.querySelector(`.quantity-input[data-id="${id}"][data-cat="${catName}"]`);
      const qty = parseInt(input.value) || 1;
      addToCart(product.id, product.category);
    });
  });
}

function renderCart() {
  const cartSection = document.querySelector('.cart-section');
  const cartItemsDiv = document.getElementById('cart-items');
  const cart = getCart();
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartSection.classList.add('active');
    return;
  }
  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-title">${item.name}</span>
      <span class="cart-item-qty">x${item.quantity}</span>
      <button class="cart-item-remove" data-id="${item.id}">&times;</button>
    </div>
  `).join('');
  cartSection.classList.add('active');
  // Remove item
  cartItemsDiv.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

// Cart nav link
const cartLink = document.querySelector('.cart-link');
cartLink.addEventListener('click', function(e) {
  e.preventDefault();
  window.location.href = 'cart.html'; // Redirect to cart.html
});
// Hide cart section on outside click
window.addEventListener('click', function(e) {
  const cartSection = document.querySelector('.cart-section');
  if (cartSection.classList.contains('active') && !cartSection.contains(e.target) && !cartLink.contains(e.target)) {
    cartSection.classList.remove('active');
  }
});

// WhatsApp send
const sendBtn = document.getElementById('send-whatsapp');
sendBtn.addEventListener('click', function() {
  const cart = getCart();
  if (cart.length === 0) return;
  const business = 'OSWAL GIFT N STATIONERY';
  let message = `Hello, I would like to order the following products from ${business}:%0A%0A`;
  cart.forEach(item => {
    message += `*${item.name}* (x${item.quantity})%0A`;
  });
  const url = `https://wa.me/919841137922?text=${message}`;
  window.open(url, '_blank');
});

// Smooth scroll for nav links
const navLinkElements = document.querySelectorAll('.nav-links a');
navLinkElements.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Active nav link highlighting
function setActiveNavLink() {
  const links = document.querySelectorAll('.nav-links a');
  const fromTop = window.scrollY + 80;
  links.forEach(link => {
    const section = document.querySelector(link.hash);
    if (section && section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
window.addEventListener('scroll', setActiveNavLink);
window.addEventListener('load', setActiveNavLink);

// Optionally, animate sections/cards on scroll
function revealOnScroll() {
  const reveals = document.querySelectorAll('section, .product-card, .testimonial-card, .cart-section, .about-section, .contact-section');
  const windowHeight = window.innerHeight;
  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 60) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Render all
renderFeaturedProducts();
renderProductCategories();
updateCartCount();

// Contact form (no backend, just show thank you)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', function(e) {
  e.preventDefault();
  contactForm.innerHTML = '<p style="color:var(--cta-olive);font-weight:600;font-size:1.1rem;">Thank you for reaching out! We will get back to you soon.</p>';
});

// Mobile Navigation - Initialize first
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const dropdowns = document.querySelectorAll('.dropdown');

  console.log('Mobile menu elements:', { mobileMenuToggle, navLinks, dropdowns });

  // Toggle mobile menu
  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Hamburger clicked');
      mobileMenuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
      console.log('Menu classes:', {
        toggle: mobileMenuToggle.classList.contains('active'),
        nav: navLinks.classList.contains('active')
      });
    });
  }

  // Handle dropdown toggles on mobile
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      });
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileMenuToggle && navLinks && 
        !mobileMenuToggle.contains(e.target) && 
        !navLinks.contains(e.target)) {
      mobileMenuToggle.classList.remove('active');
      navLinks.classList.remove('active');
    }
  });

  // Close mobile menu when clicking on a link
  if (navLinks) {
    navLinks.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && !e.target.classList.contains('dropdown-toggle')) {
        mobileMenuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }
});
