import { products } from "./products.js";

const currencyFormatter = new Intl.NumberFormat("es-PE", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
});

const categoryFallbacks = {
  calzado: "zapatillas",
  ropa: "polos",
  accesorios: "otros"
};

function normalizeProduct(product) {
  const categoryLabel = product.categoryLabel || product.category || "";
  const categoryLabelLower = categoryLabel.toLowerCase();
  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : product.image
      ? [product.image]
      : [];
  const inferredBrand = categoryLabel.split(/[·-]/)[1]?.trim() || "";
  const inferredSubCategory = product.category === "calzado"
    ? categoryLabelLower.includes("sandalia") ? "sandalias" : "zapatillas"
    : product.category === "ropa"
      ? categoryLabelLower.includes("polera") ? "poleras" : "polos"
      : categoryLabelLower.includes("gorra")
        ? "gorras"
        : categoryLabelLower.includes("cartera")
          ? "carteras"
          : categoryFallbacks[product.category] || "otros";

  return {
    ...product,
    brand: product.brand || inferredBrand,
    model: product.model ?? product.name,
    subCategory: product.subCategory || inferredSubCategory,
    sizeSystem: product.sizeSystem || "",
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    stock: Number.isFinite(product.stock) ? product.stock : null,
    stockBySize: product.stockBySize || null,
    priceKind: product.priceKind || (Number.isFinite(product.price) ? "store" : "pending"),
    availability: product.availability || (Number.isFinite(product.price) ? "in_stock" : "inquiry"),
    images,
    image: product.image || images[0] || null,
    imageFit: product.imageFit || "cover"
  };
}

const catalog = products.map(normalizeProduct);

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
const cartSubtotalLabel = document.querySelector("#cartSubtotalLabel");
const cartSubtotal = document.querySelector("#cartSubtotal");
const cartPendingPrices = document.querySelector("#cartPendingPrices");
const overlay = document.querySelector("#overlay");
const toast = document.querySelector("#toast");
const productModal = document.querySelector("#productModal");
const productModalBody = document.querySelector("#productModalBody");
const imageLightbox = document.querySelector("#imageLightbox");
const imageLightboxImage = document.querySelector("#imageLightboxImage");
const imageLightboxCounter = document.querySelector("#imageLightboxCounter");
const lightboxClose = document.querySelector("#imageLightboxClose");
const lightboxPrevious = document.querySelector("#imageLightboxPrevious");
const lightboxNext = document.querySelector("#imageLightboxNext");
let toastTimer;
let activeProductId = null;
let activeProductSize = "";
let activeProductQuantity = 1;
let activeProductImageIndex = 0;
let lastFocusedElement = null;
let lastProductTrigger = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  })[character]);
}

function productImagePath(path) {
  return path ? encodeURI(path) : "";
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("santos_store_cart") || "[]");
    if (!Array.isArray(saved)) return [];

    return saved
      .map(item => {
        const product = catalog.find(entry => entry.id === Number(item.id));
        const size = item.size || "";
        const quantity = Number(item.qty);
        if (!product || !Number.isFinite(quantity) || quantity <= 0) return null;
        const available = availableUnits(product, size);
        return {
          id: product.id,
          size,
          qty: Number.isFinite(available) ? Math.min(quantity, available) : quantity
        };
      })
      .filter(item => item && item.qty > 0);
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
  const number = Number(value);
  if (!Number.isFinite(number)) return "Precio por confirmar";
  const hasDecimals = !Number.isInteger(number);
  const formatter = hasDecimals
    ? new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : currencyFormatter;
  return `S/ ${formatter.format(number)}`;
}

function getProduct(id) {
  return catalog.find(product => product.id === id);
}

function formatProductPrice(product) {
  if (product.priceLabel) return product.priceLabel;
  if (!Number.isFinite(product.price)) return "Precio por confirmar";
  const qualifier = product.priceKind === "official-approx" ? " · oficial aprox." : "";
  return `${money(product.price)}${qualifier}`;
}

function formatPriceForMessage(product, quantity = 1) {
  if (product.availability === "out_of_stock" || product.stock === 0) return "Agotado";
  if (!Number.isFinite(product.price)) return "Precio por confirmar";
  const total = product.price * quantity;
  const qualifier = product.priceKind === "official-approx" ? " (oficial aprox.)" : "";
  const deposit = Number(product.depositPrice);
  const depositLabel = Number.isFinite(deposit) ? ` · separa con ${money(deposit)}` : "";
  return `${money(total)}${qualifier}${depositLabel}`;
}

function getReferencePrice(product) {
  const referencePrice = Number(product.referencePrice ?? product.oldPrice);
  const currentPrice = Number(product.price);
  return Number.isFinite(product.price)
    && Number.isFinite(referencePrice)
    && referencePrice > currentPrice
    ? referencePrice
    : null;
}

function getDiscountPercent(product) {
  const referencePrice = getReferencePrice(product);
  const currentPrice = Number(product.price);
  if (!referencePrice || !Number.isFinite(product.price)) return null;
  return Math.round(((referencePrice - currentPrice) / referencePrice) * 100);
}

function formatDiscount(product) {
  const discount = getDiscountPercent(product);
  return Number.isFinite(discount) && discount > 0 ? `-${discount}%` : "";
}

function formatReferenceLabel(product) {
  if (product.referenceLabel) return product.referenceLabel;
  if (product.referenceType === "official") return "Precio oficial";
  if (product.referenceType === "retail") return "Precio retail";
  if (product.referenceType === "market-reference") return "Precio referencial";
  return "";
}

function renderSalePrice(product, className = "") {
  const referencePrice = getReferencePrice(product);
  const discount = formatDiscount(product);
  const referenceLabel = formatReferenceLabel(product);
  const saving = referencePrice && Number.isFinite(Number(product.price))
    ? referencePrice - Number(product.price)
    : null;
  const currentPriceClass = Number.isFinite(Number(product.price)) ? "" : "price-pending";

  return `
    <span class="sale-price ${className}">
      ${referencePrice ? `<del>${money(referencePrice)}</del>` : ""}
      <strong class="${currentPriceClass}">${escapeHtml(formatProductPrice(product))}</strong>
      ${discount ? `<small class="sale-discount">${escapeHtml(discount)} · ${escapeHtml(product.saleLabel || "Oferta Santos7")}</small>` : ""}
      ${saving ? `<small class="sale-saving">Ahorra ${money(saving)}</small>` : ""}
      ${referenceLabel && referencePrice ? `<small class="sale-reference">${escapeHtml(referenceLabel)}</small>` : ""}
    </span>
  `;
}

function renderCartPrice(product, quantity = 1) {
  if (!Number.isFinite(product.price)) return "Precio por confirmar";
  const deposit = Number(product.depositPrice);
  if (Number.isFinite(deposit)) {
    return `<strong>${money(deposit)} para separar</strong><small class="cart-total">Total ${money(product.price * quantity)}</small>`;
  }
  const referencePrice = getReferencePrice(product);
  return `${referencePrice ? `<del>${money(referencePrice * quantity)}</del>` : ""}<strong>${money(product.price * quantity)}</strong>`;
}

function sizeLabel(product, size) {
  if (!size) return "Por confirmar";
  return `${product.sizeSystem ? `${product.sizeSystem} ` : ""}${size}`;
}

function availableUnits(product, size) {
  if (product.stockBySize && size && Number.isFinite(product.stockBySize[size])) {
    return product.stockBySize[size];
  }
  return Number.isFinite(product.stock) ? product.stock : Infinity;
}

function availabilityLabel(product) {
  if (product.availability === "out_of_stock" || product.stock === 0) return "Agotado";
  if (Number.isFinite(product.stock)) {
    return `${product.stock} ${product.stock === 1 ? "unidad" : "unidades"} disponibles`;
  }
  return product.availability === "inquiry" ? "Disponibilidad por confirmar" : "";
}

function matchesProductFilter(product) {
  return state.filter === "todos"
    || product.category === state.filter
    || product.subCategory === state.filter;
}

function filteredProducts() {
  const query = state.search.trim().toLowerCase();
  return catalog.filter(product => {
    if (!matchesProductFilter(product)) return false;
    if (!query) return true;

    const searchable = [
      product.name,
      product.brand,
      product.model,
      product.category,
      product.categoryLabel,
      product.subCategory,
      product.sizeSystem,
      product.sizes.join(" "),
      product.details,
      product.note,
      product.tag,
      product.saleLabel,
      formatReferenceLabel(product),
      formatDiscount(product),
      product.priceKind,
      availabilityLabel(product)
    ].join(" ").toLowerCase();

    return searchable.includes(query);
  });
}

function renderMedia(product, className = "", imageIndex = 0) {
  const image = product.images[imageIndex];
  if (!image) {
    return `<span class="media-placeholder ${className}"><span>Foto por confirmar</span></span>`;
  }

  return `<img class="${className}" src="${productImagePath(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="700" height="795" style="object-fit:${product.imageFit}">`;
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  const countLabel = visibleProducts.length === 1 ? "referencia" : "referencias";
  productTotal.textContent = `${visibleProducts.length} ${countLabel}`;

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="no-results">No encontramos ese producto. Prueba con otra búsqueda.</p>';
    return;
  }

  productGrid.innerHTML = visibleProducts.map((product, index) => {
    const isFavorite = state.favorites.has(product.id);
    const isPending = !Number.isFinite(product.price);
    const priceClass = isPending ? "price-pending" : "";
    const availability = availabilityLabel(product);
    const isSoldOut = product.availability === "out_of_stock" || product.stock === 0;
    const hasSale = Boolean(getReferencePrice(product) && formatDiscount(product));
    const tagClass = hasSale || product.tagClass ? (product.tagClass || "tag-sale") : "";
    const productTag = isSoldOut ? "Agotado" : (hasSale ? (product.saleLabel || "Oferta Santos7") : (product.tag || (isPending ? "Consultar" : "Original")));

    return `
      <article class="product-card ${isSoldOut ? "is-sold-out" : ""}" style="animation-delay:${index * 45}ms">
        <div class="product-image ${isSoldOut ? "product-is-sold-out" : ""}" style="--product-bg:${product.tone || "var(--gray)"}">
          <button class="product-image-trigger" type="button" data-product="${product.id}" aria-label="Ver detalles de ${escapeHtml(product.name)}">
            ${renderMedia(product, "product-image-media")}
          </button>
          <span class="product-tag ${tagClass}">${escapeHtml(productTag)}</span>
          <button class="favorite-button ${isFavorite ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="product-info">
          <div class="product-line">
            <div>
              <p class="product-category">${escapeHtml(product.categoryLabel)}</p>
              <h3>${escapeHtml(product.name)}</h3>
              ${product.details ? `<p class="product-details">${escapeHtml(product.details)}</p>` : ""}
              ${availability ? `<p class="product-stock ${isPending ? "stock-pending" : ""}"><span class="stock-dot"></span>${escapeHtml(availability)}</p>` : ""}
              ${product.note ? `<p class="product-note">${escapeHtml(product.note)}</p>` : ""}
            </div>
            ${renderSalePrice(product, `product-price ${priceClass}`)}
          </div>
          <button class="add-button ${isSoldOut ? "is-disabled" : ""}" type="button" data-product="${product.id}">${isSoldOut ? "Ver detalles · agotado" : (isPending ? "Consultar pieza" : "Ver producto")}<span>↗</span></button>
        </div>
      </article>
    `;
  }).join("");
}

function cartQuantity() {
  return state.cart.reduce((total, item) => total + item.qty, 0);
}

function findCartItem(id, size) {
  return state.cart.find(item => item.id === id && item.size === size);
}

function renderCart() {
  const quantity = cartQuantity();
  const pendingItems = state.cart.filter(item => {
    const product = getProduct(item.id);
    return product && !Number.isFinite(product.price);
  });
  const subtotal = state.cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return product && Number.isFinite(product.price) ? total + product.price * item.qty : total;
  }, 0);

  cartCount.textContent = quantity;
  cartCount.classList.toggle("is-empty", quantity === 0);
  cartHeadCount.textContent = `(${quantity})`;
  cartSubtotal.textContent = money(subtotal);
  if (cartSubtotalLabel) cartSubtotalLabel.textContent = pendingItems.length ? "Subtotal confirmado" : "Subtotal";
  if (cartPendingPrices) {
    cartPendingPrices.hidden = pendingItems.length === 0;
    cartPendingPrices.textContent = pendingItems.length
      ? `${pendingItems.length} ${pendingItems.length === 1 ? "pieza tiene" : "piezas tienen"} precio por confirmar.`
      : "";
  }

  if (!state.cart.length) {
    cartItems.innerHTML = '<div class="cart-empty"><strong>Tu bolsa está vacía</strong>Elige un producto y coordina tu pedido por WhatsApp.</div>';
    return;
  }

  cartItems.innerHTML = state.cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";
    const maxUnits = availableUnits(product, item.size);
    const plusDisabled = Number.isFinite(maxUnits) && item.qty >= maxUnits ? "disabled" : "";
    const pending = !Number.isFinite(product.price);
    const image = product.images[0];

    return `
      <div class="cart-item">
        <div class="cart-item-image" style="--product-bg:${product.tone || "var(--gray)"}">
          ${image ? `<img src="${productImagePath(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="76" height="76" style="object-fit:${product.imageFit}">` : '<span class="media-placeholder"><span>Foto por confirmar</span></span>'}
        </div>
        <div>
          <h3>${escapeHtml(product.name)}</h3>
          <p>${escapeHtml(sizeLabel(product, item.size))}</p>
          <div class="quantity-control">
            <button type="button" data-quantity-id="${product.id}" data-quantity-size="${escapeHtml(item.size)}" data-change="-1" aria-label="Quitar una unidad">−</button>
            <span>${item.qty}</span>
            <button type="button" data-quantity-id="${product.id}" data-quantity-size="${escapeHtml(item.size)}" data-change="1" aria-label="Añadir una unidad" ${plusDisabled}>＋</button>
          </div>
          <button class="remove-item" type="button" data-remove-id="${product.id}" data-remove-size="${escapeHtml(item.size)}">Eliminar</button>
        </div>
        <span class="cart-item-price ${pending ? "cart-pending" : ""}">${pending ? "Precio por confirmar" : renderCartPrice(product, item.qty)}</span>
      </div>
    `;
  }).join("");
}

function addToCart(id, size, quantity = 1) {
  const product = getProduct(id);
  if (!product) return;
  if (product.sizes.length && !size) {
    showToast("Elige una talla primero");
    return;
  }

  const cartSize = size || "";
  const item = findCartItem(id, cartSize);
  const available = availableUnits(product, cartSize);
  const nextQuantity = (item?.qty || 0) + quantity;
  if (Number.isFinite(available) && nextQuantity > available) {
    showToast(`Solo hay ${available} ${available === 1 ? "unidad" : "unidades"} disponibles`);
    return;
  }

  if (item) item.qty = nextQuantity;
  else state.cart.push({ id, size: cartSize, qty: quantity });
  saveCart();
  renderCart();
  showToast(Number.isFinite(product.price) ? `${product.name} se añadió a tu bolsa` : `${product.name} se añadió para consultar`);
}

function changeQuantity(id, size, change) {
  const item = findCartItem(id, size);
  const product = getProduct(id);
  if (!item || !product) return;

  const nextQuantity = item.qty + change;
  const available = availableUnits(product, size);
  if (change > 0 && Number.isFinite(available) && nextQuantity > available) {
    showToast(`Solo hay ${available} ${available === 1 ? "unidad" : "unidades"} disponibles`);
    return;
  }

  item.qty = nextQuantity;
  if (item.qty <= 0) state.cart = state.cart.filter(entry => entry !== item);
  saveCart();
  renderCart();
}

function removeFromCart(id, size) {
  state.cart = state.cart.filter(item => !(item.id === id && item.size === size));
  saveCart();
  renderCart();
}

function syncBodyLock() {
  const isLocked = cartDrawer.classList.contains("is-open")
    || productModal.classList.contains("is-open")
    || imageLightbox.classList.contains("is-open");
  document.body.style.overflow = isLocked ? "hidden" : "";
}

function openCart() {
  closeProduct({ restoreFocus: false });
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.querySelector("#cartTrigger").setAttribute("aria-expanded", "true");
  overlay.classList.add("is-visible");
  syncBodyLock();
  document.querySelector("#cartClose")?.focus();
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.querySelector("#cartTrigger").setAttribute("aria-expanded", "false");
  overlay.classList.remove("is-visible");
  syncBodyLock();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function whatsappUrl(message) {
  return `https://wa.me/51906470711?text=${encodeURIComponent(message)}`;
}

function productMessage(product, size, quantity) {
  const discount = formatDiscount(product);
  return [
    "Hola Santos7 Store, quiero comprar:",
    `Producto: ${product.brand ? `${product.brand} · ` : ""}${product.model || product.name}`,
    `Talla: ${sizeLabel(product, size)}`,
    `Cantidad: ${quantity}`,
    `Precio Santos7: ${formatPriceForMessage(product, quantity)}`,
    ...(discount ? [`Oferta Santos7: ${discount}`] : [])
  ].join("\n");
}

function cartMessage() {
  const lines = ["Hola Santos7 Store, quiero confirmar este pedido:"];
  let pendingCount = 0;
  let confirmedSubtotal = 0;

  state.cart.forEach(item => {
    const product = getProduct(item.id);
    if (!product) return;
    const pending = !Number.isFinite(product.price);
    if (pending) pendingCount += item.qty;
    else confirmedSubtotal += product.price * item.qty;
    const discount = formatDiscount(product);
    lines.push(`- ${product.name} | Talla: ${sizeLabel(product, item.size)} | Cantidad: ${item.qty} | Precio Santos7: ${formatPriceForMessage(product, item.qty)}${discount ? ` | ${discount} Oferta Santos7` : ""}`);
  });

  lines.push(`Subtotal confirmado: ${money(confirmedSubtotal)}`);
  if (pendingCount) lines.push(`Piezas con precio por confirmar: ${pendingCount}`);
  lines.push("Quiero coordinar la entrega.");
  return lines.join("\n");
}

function renderProductGallery(product) {
  const hasImages = product.images.length > 0;
  const thumbnails = product.images.length > 1
    ? `<div class="modal-gallery-thumbs" role="list" aria-label="Más fotos de ${escapeHtml(product.name)}">${product.images.map((image, index) => `
        <button class="modal-gallery-thumb ${index === 0 ? "is-active" : ""}" type="button" data-modal-image="${index}" aria-label="Ver foto ${index + 1} de ${product.images.length}" aria-pressed="${index === 0}">
          <img src="${productImagePath(image)}" alt="" loading="lazy" decoding="async" width="68" height="68" style="object-fit:${product.imageFit}">
        </button>
      `).join("")}</div>`
    : "";

  return `
    <div class="modal-gallery">
      <div class="modal-gallery-main" style="--product-bg:${product.tone || "var(--gray)"}">
        ${hasImages
          ? `<img id="modalMainImage" src="${productImagePath(product.images[0])}" alt="${escapeHtml(product.name)}" style="object-fit:${product.imageFit}"><button class="modal-zoom-button" id="modalZoom" type="button" aria-label="Ampliar imagen">Ampliar <span>↗</span></button>`
          : '<span class="media-placeholder media-placeholder-large"><span>Foto por confirmar</span></span>'}
        <span class="modal-product-tag">${escapeHtml(product.tag || (hasImages ? "Original" : "Consultar"))}</span>
      </div>
      ${thumbnails}
    </div>
  `;
}

function updateModalLinks() {
  const product = getProduct(activeProductId);
  if (!product) return;

  const modalWhatsapp = document.querySelector("#modalWhatsapp");
  const modalWhatsappText = document.querySelector("#modalWhatsappText");
  const modalQuantity = document.querySelector("#modalQuantityValue");
  const modalStock = document.querySelector("#modalStockStatus");
  const quantityMinus = productModalBody.querySelector('[data-modal-quantity="-1"]');
  const quantityPlus = productModalBody.querySelector('[data-modal-quantity="1"]');
  const available = availableUnits(product, activeProductSize);
  const isSoldOut = product.availability === "out_of_stock" || product.stock === 0;

  if (Number.isFinite(available)) {
    activeProductQuantity = Math.min(activeProductQuantity, Math.max(1, available));
  }
  if (modalWhatsapp) modalWhatsapp.href = whatsappUrl(productMessage(product, activeProductSize, activeProductQuantity));
  if (modalWhatsappText) modalWhatsappText.textContent = isSoldOut ? "Consultar disponibilidad" : (Number.isFinite(product.price) ? "Comprar por WhatsApp" : "Consultar por WhatsApp");
  if (modalQuantity) modalQuantity.textContent = activeProductQuantity;
  if (modalStock) {
    modalStock.textContent = isSoldOut
      ? "Agotado"
      : Number.isFinite(available)
      ? `${available} ${available === 1 ? "unidad" : "unidades"} disponibles${activeProductSize ? ` en ${sizeLabel(product, activeProductSize)}` : ""}`
      : availabilityLabel(product);
  }
  if (quantityMinus) quantityMinus.disabled = activeProductQuantity <= 1;
  if (quantityPlus) quantityPlus.disabled = Number.isFinite(available) && activeProductQuantity >= available;
}

function setActiveProductImage(index) {
  const product = getProduct(activeProductId);
  if (!product || !product.images.length) return;

  activeProductImageIndex = (index + product.images.length) % product.images.length;
  const image = product.images[activeProductImageIndex];
  const mainImage = document.querySelector("#modalMainImage");
  if (mainImage) {
    mainImage.src = productImagePath(image);
    mainImage.alt = product.name;
    mainImage.style.objectFit = product.imageFit;
  }
  productModalBody.querySelectorAll("[data-modal-image]").forEach(button => {
    const isActive = Number(button.dataset.modalImage) === activeProductImageIndex;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  if (imageLightbox.classList.contains("is-open")) setLightboxImage();
}

function setLightboxImage() {
  const product = getProduct(activeProductId);
  if (!product || !product.images.length) return;
  const image = product.images[activeProductImageIndex];
  imageLightboxImage.src = productImagePath(image);
  imageLightboxImage.alt = `${product.name} · foto ${activeProductImageIndex + 1}`;
  imageLightboxImage.style.objectFit = product.imageFit;
  imageLightboxCounter.textContent = `${activeProductImageIndex + 1} / ${product.images.length}`;
  const multipleImages = product.images.length > 1;
  lightboxPrevious.hidden = !multipleImages;
  lightboxNext.hidden = !multipleImages;
}

function openImageLightbox() {
  const product = getProduct(activeProductId);
  if (!product?.images.length) {
    showToast("Las fotos de esta pieza están por confirmar");
    return;
  }

  lastFocusedElement = document.activeElement;
  setLightboxImage();
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  syncBodyLock();
  lightboxClose.focus();
}

function closeImageLightbox({ restoreFocus = true } = {}) {
  imageLightbox.classList.remove("is-open");
  imageLightbox.setAttribute("aria-hidden", "true");
  syncBodyLock();
  if (restoreFocus && lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
  lastFocusedElement = null;
}

function moveLightboxImage(direction) {
  const product = getProduct(activeProductId);
  if (!product?.images.length) return;
  setActiveProductImage(activeProductImageIndex + direction);
}

function openProduct(id) {
  const product = getProduct(id);
  if (!product) return;
  lastProductTrigger = document.activeElement;
  closeCart();
  activeProductId = id;
  activeProductSize = product.sizes[0] || "";
  activeProductQuantity = 1;
  activeProductImageIndex = 0;
  const sizeMarkup = product.sizes.length
    ? `<div class="modal-field"><div class="modal-field-label"><span>Elige tu talla</span><small>${product.sizeSystem ? `Tallas ${escapeHtml(product.sizeSystem)}` : "Selecciona una opción"}</small></div><div class="size-options" id="modalSizeList">${product.sizes.map((size, index) => `<button class="size-button ${index === 0 ? "is-selected" : ""}" type="button" data-modal-size="${escapeHtml(size)}" aria-pressed="${index === 0}">${escapeHtml(size)}</button>`).join("")}</div></div>`
    : `<div class="modal-field"><div class="modal-field-label"><span>Talla</span><small>Confirma disponibilidad por WhatsApp</small></div></div>`;
  const pending = !Number.isFinite(product.price);
  const isSoldOut = product.availability === "out_of_stock" || product.stock === 0;

  productModalBody.innerHTML = `
    <div class="modal-product">
      ${renderProductGallery(product)}
      <div class="modal-product-copy">
        <p class="eyebrow">${escapeHtml(product.categoryLabel)}</p>
        <h2 id="modalProductName">${escapeHtml(product.name)}</h2>
        <div class="modal-price">${renderSalePrice(product)}</div>
        <p class="modal-details">${escapeHtml(product.details || "Producto original Santos7.")}</p>
        ${product.note ? `<p class="modal-note">${escapeHtml(product.note)}</p>` : ""}
        ${sizeMarkup}
        <p class="modal-stock-status" id="modalStockStatus"></p>
        <div class="modal-quantity"><span>Cantidad</span><div class="quantity-control"><button type="button" data-modal-quantity="-1" aria-label="Disminuir cantidad">−</button><b id="modalQuantityValue">1</b><button type="button" data-modal-quantity="1" aria-label="Aumentar cantidad">＋</button></div></div>
        <div class="modal-actions"><button class="button button-dark" id="modalAdd" type="button" ${isSoldOut ? "disabled" : ""}><span id="modalAddText">${isSoldOut ? "Agotado" : (pending ? "Añadir a consultas" : "Añadir a bolsa")}</span> <span>${isSoldOut ? "—" : "＋"}</span></button><a class="button button-whatsapp" id="modalWhatsapp" href="#" target="_blank" rel="noopener"><span id="modalWhatsappText">${isSoldOut ? "Consultar disponibilidad" : (pending ? "Consultar por WhatsApp" : "Comprar por WhatsApp")}</span> <span>↗</span></a></div>
        <small class="modal-footnote">El stock y la entrega se confirman directamente contigo.</small>
      </div>
    </div>
  `;
  updateModalLinks();
  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  syncBodyLock();
  productModal.querySelector(".product-modal-close")?.focus();
}

function closeProduct({ restoreFocus = true } = {}) {
  if (imageLightbox.classList.contains("is-open")) closeImageLightbox({ restoreFocus: false });
  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  syncBodyLock();
  if (restoreFocus && lastProductTrigger && document.contains(lastProductTrigger)) lastProductTrigger.focus();
  lastProductTrigger = null;
}

function updateFilterButtons(filter) {
  document.querySelectorAll(".filter-button").forEach(button => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

document.querySelectorAll("[data-filter]").forEach(button => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
  button.addEventListener("click", () => {
    state.filter = button.dataset.filter;
    updateFilterButtons(state.filter);
    renderProducts();
    document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll("[data-category-link]").forEach(link => link.addEventListener("click", () => {
  state.filter = link.dataset.categoryLink;
  updateFilterButtons(state.filter);
  renderProducts();
}));

searchInput?.addEventListener("input", event => {
  state.search = event.target.value;
  renderProducts();
});

document.querySelector(".search-trigger")?.addEventListener("click", () => {
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => searchInput?.focus(), 500);
});

productGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    renderProducts();
    return;
  }

  const productTrigger = event.target.closest("[data-product]");
  if (productTrigger) openProduct(Number(productTrigger.dataset.product));
});

productModalBody.addEventListener("click", event => {
  const sizeButton = event.target.closest("[data-modal-size]");
  const quantityButton = event.target.closest("[data-modal-quantity]");
  const imageButton = event.target.closest("[data-modal-image]");
  const addButton = event.target.closest("#modalAdd");
  const zoomButton = event.target.closest("#modalZoom");

  if (sizeButton) {
    activeProductSize = sizeButton.dataset.modalSize;
    productModalBody.querySelectorAll("[data-modal-size]").forEach(button => {
      const isSelected = button === sizeButton;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
    updateModalLinks();
  }
  if (quantityButton) {
    const product = getProduct(activeProductId);
    const available = product ? availableUnits(product, activeProductSize) : Infinity;
    const nextQuantity = activeProductQuantity + Number(quantityButton.dataset.modalQuantity);
    if (nextQuantity >= 1 && (!Number.isFinite(available) || nextQuantity <= available)) {
      activeProductQuantity = nextQuantity;
      updateModalLinks();
    }
  }
  if (imageButton) setActiveProductImage(Number(imageButton.dataset.modalImage));
  if (zoomButton) openImageLightbox();
  if (addButton) {
    addToCart(activeProductId, activeProductSize, activeProductQuantity);
    const product = getProduct(activeProductId);
    if (product && (!product.sizes.length || activeProductSize)) {
      closeProduct({ restoreFocus: false });
      openCart();
    }
  }
});

cartItems.addEventListener("click", event => {
  const quantityButton = event.target.closest("[data-quantity-id]");
  const removeButton = event.target.closest("[data-remove-id]");
  if (quantityButton) changeQuantity(Number(quantityButton.dataset.quantityId), quantityButton.dataset.quantitySize, Number(quantityButton.dataset.change));
  if (removeButton) removeFromCart(Number(removeButton.dataset.removeId), removeButton.dataset.removeSize);
});

document.querySelector("#cartTrigger").addEventListener("click", openCart);
document.querySelector("#cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);
document.querySelector("#productModalClose")?.addEventListener("click", closeProduct);
document.querySelector("#productModalBackdrop")?.addEventListener("click", closeProduct);
lightboxClose?.addEventListener("click", () => closeImageLightbox());
document.querySelector("#imageLightboxBackdrop")?.addEventListener("click", () => closeImageLightbox());
lightboxPrevious?.addEventListener("click", () => moveLightboxImage(-1));
lightboxNext?.addEventListener("click", () => moveLightboxImage(1));

document.querySelector("#checkoutButton").addEventListener("click", () => {
  if (!state.cart.length) {
    showToast("Agrega un producto antes de continuar");
    return;
  }
  window.open(whatsappUrl(cartMessage()), "_blank", "noopener,noreferrer");
});

const menuTrigger = document.querySelector("#menuTrigger");
const mainNav = document.querySelector("#mainNav");
menuTrigger?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuTrigger.setAttribute("aria-expanded", String(isOpen));
});
mainNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("is-open");
  menuTrigger.setAttribute("aria-expanded", "false");
}));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if (imageLightbox.classList.contains("is-open")) {
      closeImageLightbox();
      return;
    }
    closeProduct();
    closeCart();
    mainNav?.classList.remove("is-open");
    menuTrigger?.setAttribute("aria-expanded", "false");
  }
  if (imageLightbox.classList.contains("is-open") && event.key === "ArrowLeft") moveLightboxImage(-1);
  if (imageLightbox.classList.contains("is-open") && event.key === "ArrowRight") moveLightboxImage(1);
});

renderProducts();
renderCart();
