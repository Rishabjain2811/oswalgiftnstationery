const displayBooks = [
  { id: 1, name: 'A4 Display Book', desc: 'Classic A4, 20 pockets.', image: 'CL3022F.jpg' },
  { id: 2, name: 'A5 Display Book', desc: 'Compact A5, 10 pockets.', image: 'CL1043F.jpg' },
  { id: 3, name: 'Transparent Display Book', desc: 'Crystal clear, 30 pockets.', image: 'CL804F.jpg' },
  { id: 4, name: 'Pastel Display Book', desc: 'Soft pastel, 40 pockets.', image: 'CL2029F.jpg' },
  { id: 5, name: 'Heavy Duty Display Book', desc: 'Extra thick, 60 pockets.', image: 'CL212F.jpg' },
  { id: 6, name: 'Frosted Display Book', desc: 'Frosted, 20 pockets.', image: 'CL1034F.jpg' },
  { id: 7, name: 'Display Book with Index', desc: 'Includes index, 20 pockets.', image: 'CL1027F.jpg' },
  { id: 8, name: 'Display Book XL', desc: 'Extra large, 80 pockets.', image: 'CL3022F.jpg' },
  { id: 9, name: 'Display Book - Blue', desc: 'Vibrant blue, 20 pockets.', image: 'CL1043F.jpg' },
  { id: 10, name: 'Display Book - Green', desc: 'Fresh green, 20 pockets.', image: 'CL804F.jpg' },
  { id: 11, name: 'Display Book - Pink', desc: 'Chic pink, 20 pockets.', image: 'CL2029F.jpg' },
];

let cart = [];

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById('cart-count').textContent = count;
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

function addToCart(product, qty = 1) {
  if (qty < 1) return;
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  updateCartCount();
  animateCartCount();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  updateCartCount();
  renderCart();
}

function renderCart() {
  const cartSection = document.querySelector('.cart-section');
  const cartItemsDiv = document.getElementById('cart-items');
  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    cartSection.classList.add('active');
    return;
  }
  cartItemsDiv.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span class="cart-item-title">${item.name}</span>
      <span class="cart-item-qty">x${item.qty}</span>
      <button class="cart-item-remove" data-id="${item.id}">&times;</button>
    </div>
  `).join('');
  cartSection.classList.add('active');
  cartItemsDiv.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = parseInt(this.getAttribute('data-id'));
      removeFromCart(id);
    });
  });
}

const sendBtn = document.getElementById('send-whatsapp');
sendBtn.addEventListener('click', function() {
  if (cart.length === 0) return;
  const business = 'OSWAL GIFT N STATIONERY';
  let message = `Hello, I would like to order the following Display Books from ${business}:%0A%0A`;
  cart.forEach(item => {
    message += `*${item.name}* (x${item.qty})%0A`;
  });
  const url = `https://wa.me/919841137922?text=${message}`;
  window.open(url, '_blank');
});

function renderDisplayBooks() {
  const container = document.getElementById('display-books-products');
  container.innerHTML = displayBooks.map(product => `
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
  displayBooks.forEach(product => {
    const id = product.id;
    const input = container.querySelector(`.quantity-input[data-id="${id}"]`);
    container.querySelector(`.quantity-btn[data-action="decrease"][data-id="${id}"]`).addEventListener('click', () => {
      let val = parseInt(input.value) || 1;
      if (val > 1) val--;
      input.value = val;
    });
    container.querySelector(`.quantity-btn[data-action="increase"][data-id="${id}"]`).addEventListener('click', () => {
      let val = parseInt(input.value) || 1;
      val++;
      input.value = val;
    });
    input.addEventListener('input', function() {
      if (parseInt(this.value) < 1 || isNaN(parseInt(this.value))) this.value = 1;
    });
    container.querySelector(`.add-to-cart[data-id="${id}"]`).addEventListener('click', () => {
      const qty = parseInt(input.value) || 1;
      addToCart(product, qty);
    });
  });
}

const cartLink = document.querySelector('.cart-link');
cartLink.addEventListener('click', function(e) {
  e.preventDefault();
  document.querySelector('.cart-section').classList.add('active');
  renderCart();
  document.getElementById('cart').scrollIntoView({ behavior: 'smooth' });
});
window.addEventListener('click', function(e) {
  const cartSection = document.querySelector('.cart-section');
  if (cartSection.classList.contains('active') && !cartSection.contains(e.target) && !cartLink.contains(e.target)) {
    cartSection.classList.remove('active');
  }
});

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

function revealOnScroll() {
  const reveals = document.querySelectorAll('section, .product-card, .cart-section');
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

renderDisplayBooks();
updateCartCount(); 