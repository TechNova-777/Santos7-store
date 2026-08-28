const products = [
  {
    id: 1,
    name: "Santos R1 / Solar",
    category: "calle",
    categoryLabel: "Calle · Unisex",
    price: 349,
    oldPrice: 399,
    tag: "Nuevo",
    tone: "#e97a55",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 2,
    name: "Santos Air / Cloud",
    category: "correr",
    categoryLabel: "Run · Unisex",
    price: 289,
    oldPrice: null,
    tag: "Favorito",
    tone: "#a9caff",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 3,
    name: "Santos Court / Ink",
    category: "basquet",
    categoryLabel: "Cancha · Unisex",
    price: 429,
    oldPrice: null,
    tag: "Drop 01",
    tone: "#aaa0ec",
    image: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 4,
    name: "Santos Mono / Moss",
    category: "calle",
    categoryLabel: "Calle · Unisex",
    price: 319,
    oldPrice: null,
    tag: "Esencial",
    tone: "#cee480",
    image: "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 5,
    name: "Santos Pace / Red",
    category: "correr",
    categoryLabel: "Run · Unisex",
    price: 379,
    oldPrice: 449,
    tag: "-15%",
    tone: "#f0a08b",
    image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: 6,
    name: "Santos High / Bone",
    category: "basquet",
    categoryLabel: "Cancha · Unisex",
    price: 459,
    oldPrice: null,
    tag: "Nuevo",
    tone: "#ded3bf",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=900&q=85"
  }
];

const state = {
  filter: "todos",
  search: "",
  cart: loadCart(),
  favorites: new Set()
};

const productGrid = document.querySelector("#productGrid");
const productTotal = document.querySelector("#productTotal");
const searchInput = document.querySelector("#catalogSearch");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartHeadCount = document.querySelector("#cartHeadCount");
const cartSubtotal = document.querySelector("#cartSubtotal");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("santos_store_cart") || "[]");
    return Array.isArray(saved) ? saved.filter(item => products.some(product => product.id === item.id) && item.qty > 0) : [];
  } catch {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("santos_store_cart", JSON.stringify(state.cart));
  } catch {
    // La tienda sigue funcionando aunque el navegador bloquee el almacenamiento.
  }
}

function money(value) {
  return `S/ ${value.toLocaleString("es-PE")}`;
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function filteredProducts() {
  return products.filter(product => {
    const matchesFilter = state.filter === "todos" || product.category === state.filter;
    const query = state.search.trim().toLowerCase();
    const matchesSearch = !query || `${product.name} ${product.categoryLabel}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  productTotal.textContent = `${String(visibleProducts.length).padStart(2, "0")} modelos`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="no-results">No encontramos ese par. Prueba con otra búsqueda.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product, index) => `
    <article class="product-card" style="animation-delay:${index * 45}ms">
      <div class="product-image" style="--product-bg:${product.tone}">
        <span class="product-tag ${product.oldPrice ? "tag-sale" : ""}">${product.tag}</span>
        <button class="favorite-button ${state.favorites.has(product.id) ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${state.favorites.has(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}">${state.favorites.has(product.id) ? "♥" : "♡"}</button>
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-info">
        <div class="product-line">
          <div><h3>${product.name}</h3><p class="product-category">${product.categoryLabel}</p></div>
          <p class="product-price">${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}${money(product.price)}</p>
        </div>
        <button class="add-button" type="button" data-add="${product.id}">Añadir al carrito <span>＋</span></button>
      </div>
    </article>
  `).join("");
}

function cartQuantity() {
  return state.cart.reduce((total, item) => total + item.qty, 0);
}

function renderCart() {
  const quantity = cartQuantity();
  const subtotal = state.cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);

  cartCount.textContent = quantity;
  cartCount.classList.toggle("is-empty", quantity === 0);
  cartHeadCount.textContent = `(${quantity})`;
  cartSubtotal.textContent = money(subtotal);

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="cart-empty"><strong>Tu carrito está vacío</strong>Agrega un par y empieza tu próximo recorrido.</div>';
    return;
  }

  cartItems.innerHTML = state.cart.map(item => {
    const product = getProduct(item.id);
    return `
      <div class="cart-item">
        <div class="cart-item-image" style="--product-bg:${product.tone}"><img src="${product.image}" alt="${product.name}"></div>
        <div>
          <h3>${product.name}</h3>
          <p>${product.categoryLabel}</p>
          <div class="quantity-control">
            <button type="button" data-quantity="${product.id}" data-change="-1" aria-label="Quitar una unidad">−</button>
            <span>${item.qty}</span>
            <button type="button" data-quantity="${product.id}" data-change="1" aria-label="Añadir una unidad">＋</button>
          </div>
          <button class="remove-item" type="button" data-remove="${product.id}">Eliminar</button>
        </div>
        <span class="cart-item-price">${money(product.price * item.qty)}</span>
      </div>
    `;
  }).join("");
}

function addToCart(id) {
  const item = state.cart.find(entry => entry.id === id);
  if (item) item.qty += 1;
  else state.cart.push({ id, qty: 1 });
  saveCart();
  renderCart();
  openCart();
  showToast(`${getProduct(id).name} se añadió al carrito`);
}

function changeQuantity(id, change) {
  const item = state.cart.find(entry => entry.id === id);
  if (!item) return;
  item.qty += change;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry.id !== id);
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  saveCart();
  renderCart();
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("is-visible");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-visible");
  document.body.style.overflow = "";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("is-active", item === button));
    renderProducts();
    document.querySelector("#zapatillas").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-category-link]").forEach(link => {
  link.addEventListener("click", () => {
    const filter = link.dataset.categoryLink;
    state.filter = filter;
    document.querySelectorAll(".filter-button").forEach(button => button.classList.toggle("is-active", button.dataset.filter === filter));
    renderProducts();
  });
});

searchInput.addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector(".search-trigger").addEventListener("click", () => {
  document.querySelector("#zapatillas").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => searchInput.focus(), 500);
});

productGrid.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");
  const favoriteButton = event.target.closest("[data-favorite]");
  if (addButton) addToCart(Number(addButton.dataset.add));
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    renderProducts();
  }
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity]");
  const removeButton = event.target.closest("[data-remove]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(Number(removeButton.dataset.remove));
});

document.querySelector("#cartTrigger").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Agrega un par antes de continuar");
    return;
  }
  showToast("Tu selección está lista. Pronto podrás coordinar el delivery.");
});

const menuTrigger = document.querySelector("#menuTrigger");
const mainNav = document.querySelector("#mainNav");
menuTrigger.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuTrigger.setAttribute("aria-expanded", String(isOpen));
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuTrigger.setAttribute("aria-expanded", "false");
}));

document.querySelector("#clubForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.querySelector("#clubEmail");
  if (!email.value.trim()) return;
  showToast("Bienvenido al Santos Club");
  email.value = "";
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
    mainNav.classList.remove("is-open");
    menuTrigger.setAttribute("aria-expanded", "false");
  }
});

renderProducts();
renderCart();
