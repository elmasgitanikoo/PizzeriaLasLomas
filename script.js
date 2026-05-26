/* script.js - Pizzería La Vaguada (Las Lomas, Cartagena) */

// --- Menu Database ---
const MENU_DATA = [
  {
    id: "pizza-lomas",
    name: "Pizza Las Lomas",
    category: "specials",
    price: 12.50,
    img: "assets/images/pizza_lomas.png",
    desc: "Nuestra obra de arte vegetariana. Salsa de tomate artesanal, mozzarella 100% natural, queso azul de alta calidad que aporta cremosidad, orégano silvestre y aceitunas negras deshuesadas de primera calidad sobre una masa madre crujiente.",
    ingredients: "Tomate, Mozzarella, Queso Azul, Olivas",
    tags: ["special", "veg"]
  },
  {
    id: "pizza-vaguada",
    name: "Pizza La Vaguada",
    category: "specials",
    price: 13.20,
    img: "assets/images/pizza_vaguada.png",
    desc: "La favorita de los amantes de la buena carne. Base de tomate italiano y mozzarella fundida, cubierta con jugosa carne picada de ternera sazonada, champiñones frescos laminados, cebolla caramelizada casera y aceitunas negras.",
    ingredients: "Tomate, Mozzarella, Carne, Champiñones, Cebolla",
    tags: ["special"]
  },
  {
    id: "pizza-margarita",
    name: "Pizza Margarita Tradicional",
    category: "classics",
    price: 9.50,
    img: "assets/images/pizza_lomas.png", // Fallback to same premium base
    desc: "La reina de la sencillez napolitana. Salsa de tomate San Marzano, mozzarella di bufala fresca fundida, hojas de albahaca fresca del huerto y un chorrito de aceite de oliva virgen extra de la región.",
    ingredients: "Tomate, Mozzarella di Bufala, Albahaca, AOVE",
    tags: ["veg"]
  },
  {
    id: "pizza-4quesos",
    name: "Pizza Cuatro Quesos",
    category: "classics",
    price: 11.90,
    img: "assets/images/pizza_lomas.png",
    desc: "Una combinación celestial para queseros. Mozzarella fundida, gorgonzola cremoso con carácter, queso de cabra suave y lascas de Grana Padano curado sobre una base blanca sin tomate.",
    ingredients: "Mozzarella, Gorgonzola, Cabra, Grana Padano",
    tags: ["veg", "special"]
  },
  {
    id: "pizza-diavola",
    name: "Pizza Diavola",
    category: "classics",
    price: 12.00,
    img: "assets/images/pizza_vaguada.png",
    desc: "Para los amantes de las emociones fuertes. Salsa de tomate artesanal, mozzarella hilada, salami picante italiano Spianata y un toque de crema de Nduja calabresa con aceite picante aromático.",
    ingredients: "Tomate, Mozzarella, Salami Picante, Nduja",
    tags: ["spicy"]
  },
  {
    id: "pizza-iberica",
    name: "Pizza Ibérica Especial",
    category: "specials",
    price: 13.50,
    img: "assets/images/pizza_vaguada.png",
    desc: "Sabor nacional con base italiana. Salsa de tomate, mozzarella y, una vez horneada, añadimos finas lonchas de jamón ibérico de bellota, hojas frescas de rúcula silvestre y lascas de queso manchego semicurado.",
    ingredients: "Tomate, Mozzarella, Jamón Ibérico, Rúcula, Manchego",
    tags: ["special"]
  },
  {
    id: "tiramisu",
    name: "Tiramisú Casero della Nonna",
    category: "drinks",
    price: 5.50,
    img: "assets/images/tiramisu.png",
    desc: "El postre italiano por excelencia elaborado diariamente por nosotros. Capas de bizcocho Savoiardi empapadas en café espresso italiano y licor Amaretto, crema rica de mascarpone y cacao en polvo.",
    ingredients: "Mascarpone, Café, Bizcochos, Cacao",
    tags: ["veg", "special"]
  },
  {
    id: "estrella-levante",
    name: "Cerveza Estrella de Levante",
    category: "drinks",
    price: 2.50,
    img: "assets/images/beer.png",
    desc: "La cerveza de nuestra tierra de Murcia. Una lager rubia clásica, refrescante, con el equilibrio perfecto entre maltas y un suave amargor de lúpulo. Servida bien fría.",
    ingredients: "Cerveza Local Murciana, 33cl",
    tags: []
  },
  {
    id: "agua",
    name: "Agua Mineral Solán de Cabras",
    category: "drinks",
    price: 1.80,
    img: "assets/images/pizza_lomas.png",
    desc: "Agua mineral natural de manantial en botella de vidrio azul. Fresca, ligera y pura.",
    ingredients: "Agua Mineral, 50cl",
    tags: ["veg"]
  }
];

// --- State Management ---
let cart = [];
let currentCategory = "all";
let activeTags = [];
let deliveryType = "recoger"; // 'recoger' or 'domicilio'
const DELIVERY_FEE = 1.50;

// --- DOM Elements ---
const header = document.getElementById("main-header");
const navbar = document.getElementById("navbar");
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const cartBtn = document.getElementById("cart-btn");
const cartCount = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer-panel");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartOverlayBg = document.getElementById("cart-overlay-bg");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartFooterDetails = document.getElementById("cart-footer-details");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotal = document.getElementById("cart-total");
const deliveryFeeRow = document.getElementById("delivery-fee-row");
const cartDeliveryFee = document.getElementById("cart-delivery-fee");
const checkoutBtn = document.getElementById("cart-checkout-btn");
const deliveryPickupBtn = document.getElementById("delivery-pickup-btn");
const deliveryHomeBtn = document.getElementById("delivery-home-btn");
const menuGrid = document.getElementById("menu-items-grid");
const menuTabs = document.querySelectorAll(".menu-tab-btn");
const tagFilters = document.querySelectorAll(".filter-tag-btn");
const bookingForm = document.getElementById("booking-form");
const bookingModal = document.getElementById("booking-modal");
const bookingModalCloseBtn = document.getElementById("booking-modal-close-btn");
const bookingModalMessage = document.getElementById("booking-modal-message");
const orderModal = document.getElementById("order-modal");
const orderModalCloseBtn = document.getElementById("order-modal-close-btn");

// --- Initialize App ---
document.addEventListener("DOMContentLoaded", () => {
  // Load cart from localStorage
  const savedCart = localStorage.getItem("pizzeria_vaguada_cart");
  if (savedCart) {
    try {
      cart = JSON.parse(savedCart);
      updateCartBadge();
    } catch (e) {
      cart = [];
    }
  }

  // Render initial menu (combining pre-rendered with dynamic ones)
  renderMenu();

  // Set minimum date for booking form to today
  const bookingDateInput = document.getElementById("booking-date");
  if (bookingDateInput) {
    const today = new Date().toISOString().split("T")[0];
    bookingDateInput.min = today;
  }

  // Run dynamic open/close indicator
  checkBusinessHours();
  // Check every minute
  setInterval(checkBusinessHours, 60000);

  // Setup Event Listeners
  setupEventListeners();
});

// --- Event Listeners ---
function setupEventListeners() {
  // Sticky header on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    highlightNavLinkOnScroll();
  });

  // Mobile Menu Toggle
  menuToggleBtn.addEventListener("click", () => {
    navbar.classList.toggle("mobile-active");
  });

  // Close mobile menu when clicking a link
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navbar.classList.remove("mobile-active");
      
      // Update active state manually
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Cart Drawer open/close
  cartBtn.addEventListener("click", openCart);
  cartCloseBtn.addEventListener("click", closeCart);
  cartOverlayBg.addEventListener("click", closeCart);

  // Menu Category Filter Tabs
  menuTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      menuTabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      e.target.classList.add("active");
      e.target.setAttribute("aria-selected", "true");
      
      currentCategory = e.target.getAttribute("data-category");
      renderMenu();
    });
  });

  // Tag Quick Filters
  tagFilters.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tag = e.target.getAttribute("data-tag");
      e.target.classList.toggle("active");
      
      if (activeTags.includes(tag)) {
        activeTags = activeTags.filter(t => t !== tag);
      } else {
        activeTags.push(tag);
      }
      renderMenu();
    });
  });

  // Delivery type switch
  deliveryPickupBtn.addEventListener("click", () => setDeliveryType("recoger"));
  deliveryHomeBtn.addEventListener("click", () => setDeliveryType("domicilio"));

  // Checkout process
  checkoutBtn.addEventListener("click", handleCheckout);

  // Booking Form Submit
  bookingForm.addEventListener("submit", handleBookingSubmit);

  // Close Modals
  bookingModalCloseBtn.addEventListener("click", () => {
    bookingModal.classList.remove("open");
  });
  orderModalCloseBtn.addEventListener("click", () => {
    orderModal.classList.remove("open");
  });

  // Delegate cart quantity/remove button clicks inside the container
  cartItemsContainer.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const itemId = target.getAttribute("data-id");
    
    if (target.classList.contains("qty-minus")) {
      updateCartItemQty(itemId, -1);
    } else if (target.classList.contains("qty-plus")) {
      updateCartItemQty(itemId, 1);
    } else if (target.classList.contains("remove-cart-item") || target.closest(".remove-cart-item")) {
      const confirmId = target.getAttribute("data-id") || target.closest(".remove-cart-item").getAttribute("data-id");
      removeCartItem(confirmId);
    }
  });

  // Delegate add-to-cart clicks in menu grid
  menuGrid.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const btn = e.target;
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const img = btn.getAttribute("data-img");
      
      addToCart(id, name, price, img);
      
      // Visual feedback on add button
      const originalText = btn.innerText;
      btn.innerText = "Añadido ✓";
      btn.style.backgroundColor = "var(--color-success)";
      
      setTimeout(() => {
        btn.innerText = originalText;
        btn.style.backgroundColor = "";
      }, 1000);
    }
  });
}

// --- Menu Rendering Logic ---
function renderMenu() {
  // Filter the database based on category and tags
  const filteredData = MENU_DATA.filter(item => {
    // 1. Filter by category
    if (currentCategory !== "all" && item.category !== currentCategory) {
      return false;
    }
    
    // 2. Filter by active tags
    if (activeTags.length > 0) {
      const hasAllTags = activeTags.every(tag => item.tags && item.tags.includes(tag));
      if (!hasAllTags) return false;
    }
    
    return true;
  });

  // Clear grid
  menuGrid.innerHTML = "";

  if (filteredData.length === 0) {
    menuGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
        <p>No se encontraron productos que coincidan con los filtros seleccionados.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="resetFilters()">Limpiar Filtros</button>
      </div>
    `;
    return;
  }

  // Populate grid
  filteredData.forEach(item => {
    const isLomas = item.id === "pizza-lomas";
    const isVaguada = item.id === "pizza-vaguada";
    
    // Check if item has specific badges
    let badgesHTML = "";
    if (item.tags.includes("special")) {
      badgesHTML += `<span class="badge badge-special">Destacada</span>`;
    }
    if (item.tags.includes("veg")) {
      badgesHTML += `<span class="badge badge-veg">Vegetariana</span>`;
    }
    if (item.tags.includes("spicy")) {
      badgesHTML += `<span class="badge badge-spicy">Picante</span>`;
    }

    const itemHTML = `
      <div class="menu-item-wrapper" data-category="${item.category}" data-tags="${item.tags.join(" ")}">
        <article class="menu-card" id="pizza-card-${item.id}">
          <div class="menu-img-container">
            <img src="${item.img}" alt="${item.name}" class="menu-card-img" onerror="this.src='assets/images/pizza_lomas.png'">
            <div class="menu-badges">
              ${badgesHTML}
            </div>
          </div>
          <div class="menu-info">
            <div class="menu-title-row">
              <h3>${item.name}</h3>
              <span class="menu-price">${item.price.toFixed(2)}€</span>
            </div>
            <p class="menu-desc">${item.desc}</p>
            <div class="menu-footer">
              <span class="menu-ingredients-tag">${item.ingredients}</span>
              <button class="btn btn-primary btn-sm add-to-cart-btn" 
                      data-id="${item.id}" 
                      data-name="${item.name}" 
                      data-price="${item.price}" 
                      data-img="${item.img}" 
                      id="btn-add-${item.id}">Añadir</button>
            </div>
          </div>
        </article>
      </div>
    `;
    menuGrid.insertAdjacentHTML("beforeend", itemHTML);
  });
}

function resetFilters() {
  currentCategory = "all";
  activeTags = [];
  
  // Update category buttons UI
  menuTabs.forEach(t => {
    t.classList.remove("active");
    if (t.getAttribute("data-category") === "all") {
      t.classList.add("active");
      t.setAttribute("aria-selected", "true");
    }
  });

  // Update tag filter buttons UI
  tagFilters.forEach(btn => btn.classList.remove("active"));

  renderMenu();
}

// --- Cart Logic ---
function openCart() {
  cartDrawer.classList.add("open");
  cartOverlayBg.classList.add("open");
  document.body.style.overflow = "hidden"; // Prevent scrolling main body
  renderCart();
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartOverlayBg.classList.remove("open");
  document.body.style.overflow = ""; // Re-enable scrolling
}

function addToCart(id, name, price, img) {
  const existingItem = cart.find(item => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, name, price, img, quantity: 1 });
  }

  saveCart();
  updateCartBadge();
  if (cartDrawer.classList.contains("open")) {
    renderCart();
  }
}

function updateCartItemQty(id, change) {
  const item = cart.find(item => item.id === id);
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeCartItem(id);
  } else {
    saveCart();
    updateCartBadge();
    renderCart();
  }
}

function removeCartItem(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
  
  if (count === 0) {
    cartCount.style.display = "none";
  } else {
    cartCount.style.display = "flex";
  }
}

function setDeliveryType(type) {
  deliveryType = type;
  
  if (type === "domicilio") {
    deliveryPickupBtn.classList.remove("active");
    deliveryHomeBtn.classList.add("active");
    deliveryFeeRow.style.display = "flex";
  } else {
    deliveryPickupBtn.classList.add("active");
    deliveryHomeBtn.classList.remove("active");
    deliveryFeeRow.style.display = "none";
  }
  
  renderCart();
}

function renderCart() {
  // Clear list
  cartItemsContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty" id="cart-empty-view">
        <svg class="cart-empty-svg" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Tu carrito está vacío.</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">¡Añade alguna de nuestras deliciosas pizzas artesanales!</p>
      </div>
    `;
    cartFooterDetails.style.display = "none";
    return;
  }

  cartFooterDetails.style.display = "block";

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  let total = subtotal;
  
  if (deliveryType === "domicilio") {
    total += DELIVERY_FEE;
  }

  // Populate list
  cart.forEach(item => {
    const itemHTML = `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" class="cart-item-img" onerror="this.src='assets/images/pizza_lomas.png'">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <span class="cart-item-price">${(item.price * item.quantity).toFixed(2)}€</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
          <button class="remove-cart-item" data-id="${item.id}" aria-label="Eliminar producto">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></line></svg>
          </button>
          <div class="cart-item-qty">
            <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Render prices
  cartSubtotal.textContent = `${subtotal.toFixed(2)}€`;
  cartDeliveryFee.textContent = `${DELIVERY_FEE.toFixed(2)}€`;
  cartTotal.textContent = `${total.toFixed(2)}€`;
}

function saveCart() {
  localStorage.setItem("pizzeria_vaguada_cart", JSON.stringify(cart));
}

function handleCheckout() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (deliveryType === "domicilio" ? DELIVERY_FEE : 0);
  
  // Close the cart
  closeCart();

  // Customize message in modal
  const textMsg = document.getElementById("order-modal-message");
  if (deliveryType === "domicilio") {
    textMsg.innerHTML = `Tu pedido de pizzas artesanales de <strong>${total.toFixed(2)}€</strong> ha sido enviado a la cocina. Te lo entregaremos en tu domicilio en Las Lomas / La Vaguada en aproximadamente 35-45 minutos. ¡Gracias por confiar en nosotros!`;
  } else {
    textMsg.innerHTML = `Tu pedido de <strong>${total.toFixed(2)}€</strong> está siendo preparado. Estará listo para recoger en nuestro local de la Avenida del Descubrimiento de América en unos 15-20 minutos. ¡Te esperamos!`;
  }

  // Show order confirmation modal
  orderModal.classList.add("open");

  // Clear state
  cart = [];
  saveCart();
  updateCartBadge();
}

// --- Reservation Handling ---
function handleBookingSubmit(e) {
  e.preventDefault();
  
  const submitBtn = document.getElementById("submit-booking-btn");
  const originalText = submitBtn.innerText;
  
  // Disable button and show spinner
  submitBtn.disabled = true;
  submitBtn.innerText = "Procesando Reserva...";

  // Collect form values
  const name = document.getElementById("booking-name").value;
  const phone = document.getElementById("booking-phone").value;
  const date = document.getElementById("booking-date").value;
  const time = document.getElementById("booking-time").value;
  const guests = document.getElementById("booking-guests").value;
  const space = document.getElementById("booking-space").value;
  
  // Format space translation
  let spaceText = "Cualquier zona disponible";
  if (space === "salon") spaceText = "Salón Interior";
  if (space === "terraza") spaceText = "Terraza al Aire Libre";

  // Simulate network request (1.2 seconds)
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = originalText;
    
    // Clear form
    bookingForm.reset();
    
    // Set minimum date again
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("booking-date").min = today;

    // Open confirmation modal
    bookingModalMessage.innerHTML = `
      ¡Hola <strong>${name}</strong>! Hemos registrado tu reserva para <strong>${guests} ${guests === '1' ? 'persona' : 'personas'}</strong> el día <strong>${formatDate(date)}</strong> a las <strong>${time}h</strong>.<br>
      Te hemos asignado una mesa en: <strong>${spaceText}</strong>.<br><br>
      Te enviaremos un SMS recordatorio al teléfono <strong>${phone}</strong>. ¡Nos vemos pronto!
    `;
    bookingModal.classList.add("open");
  }, 1200);
}

function formatDate(dateStr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-ES', options);
}

// --- Dynamic Business Hours Indicator ---
function checkBusinessHours() {
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");
  
  if (!statusDot || !statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, 2 = Tuesday, ...
  const hour = now.getHours();
  const min = now.getMinutes();
  const currentTime = hour * 60 + min; // current minutes since midnight

  let isOpen = false;
  let nextOpening = "";

  // Monday = Closed
  if (day === 1) {
    isOpen = false;
    nextOpening = "Abrimos mañana martes a las 19:30h";
  } 
  // Tuesday, Wednesday, Thursday: Cenas 19:30 a 23:30 (1170 to 1410 min)
  else if (day >= 2 && day <= 4) {
    const dinnerStart = 19 * 60 + 30; // 1170
    const dinnerEnd = 23 * 60 + 30;   // 1410
    
    if (currentTime >= dinnerStart && currentTime <= dinnerEnd) {
      isOpen = true;
    } else if (currentTime < dinnerStart) {
      nextOpening = `Cerrado ahora · Abrimos hoy a las 19:30h`;
    } else {
      nextOpening = `Cerrado por hoy · Abrimos mañana a las 19:30h`;
    }
  } 
  // Friday, Saturday, Sunday: Comidas 13:00 a 16:00 (780 to 960 min) & Cenas 19:30 a 00:00 (1170 to 1440 min)
  else if (day === 5 || day === 6 || day === 0) {
    const lunchStart = 13 * 60; // 780
    const lunchEnd = 16 * 60;   // 960
    const dinnerStart = 19 * 60 + 30; // 1170
    const dinnerEnd = 24 * 60;   // 1440 (midnight)
    
    if ((currentTime >= lunchStart && currentTime <= lunchEnd) || (currentTime >= dinnerStart && currentTime <= dinnerEnd)) {
      isOpen = true;
    } else if (currentTime < lunchStart) {
      nextOpening = `Cerrado ahora · Abrimos hoy a las 13:00h`;
    } else if (currentTime >= lunchEnd && currentTime < dinnerStart) {
      nextOpening = `Cerrado ahora · Abrimos esta noche a las 19:30h`;
    } else {
      const nextDayLabel = day === 0 ? "el martes (mañana lunes cerramos)" : "mañana a las 13:00h";
      nextOpening = `Cerrado por hoy · Abrimos ${nextDayLabel}`;
    }
  }

  if (isOpen) {
    statusDot.className = "status-dot open";
    statusText.textContent = "Abierto ahora · Horno encendido";
  } else {
    statusDot.className = "status-dot closed";
    statusText.textContent = nextOpening;
  }
}

// --- Navigation Highlighting based on scroll position ---
function highlightNavLinkOnScroll() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");
  
  let currentActiveSectionId = "inicio";
  const scrollPosition = window.scrollY + 200; // Offset to trigger early

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      currentActiveSectionId = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentActiveSectionId}`) {
      link.classList.add("active");
    }
  });
}
