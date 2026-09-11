import { products } from "./products.js?v=20260910-5";

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
const initialUrlParams = new URLSearchParams(window.location.search);
const initialSearch = initialUrlParams.get("q") || "";
const initialFilter = initialUrlParams.get("filter") === "agotados" ? "agotados" : "todos";

const state = {
  filter: initialFilter,
  search: initialSearch,
  cart: loadCart(),
  favorites: new Set()
};

const productGrid = document.querySelector("#productGrid");
const productTotal = document.querySelector("#productTotal");
const catalogSection = document.querySelector("#catalogo");
const soldOutSection = document.querySelector("#soldOutSection");
const soldOutGrid = document.querySelector("#soldOutGrid");
const soldOutTotal = document.querySelector("#soldOutTotal");
const soldOutQuickCount = document.querySelector("#soldOutQuickCount");
const searchInput = document.querySelector("#catalogSearch");
const headerSearch = document.querySelector("#headerSearch");
const catalogHeading = document.querySelector(".shop-heading");
const catalogToolbar = document.querySelector(".catalog-toolbar");
const catalogSummaryText = document.querySelector("#catalogSummaryText");
const catalogStructuredData = document.querySelector("#catalogStructuredData");
const defaultPageTitle = document.title;
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
const campaignVideo = document.querySelector("#campaignVideo");
const campaignVideoToggle = document.querySelector("#campaignVideoToggle");
const campaignVideoToggleIcon = campaignVideoToggle?.querySelector(".campaign-video-toggle-icon");
const campaignVideoToggleLabel = campaignVideoToggle?.querySelector(".campaign-video-toggle-label");

if (searchInput) searchInput.value = state.search;
if (headerSearch) headerSearch.value = state.search;
if (state.search.trim()) document.title = `${state.search.trim().slice(0, 70)} | Santos7 Store`;

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
  const currentPrice = Number(product.price);
  const isDiscounted = referencePrice && Number.isFinite(currentPrice) && currentPrice < referencePrice;
  const discount = product.referenceOnly ? "" : formatDiscount(product);
  const referenceLabel = product.referenceOnly ? "" : formatReferenceLabel(product);
  const saving = !product.referenceOnly && isDiscounted
    ? referencePrice - Number(product.price)
    : null;
  const currentPriceClass = Number.isFinite(Number(product.price)) ? "" : "price-pending";
  const referenceMarkup = referenceLabel && referencePrice
    ? `<small class="sale-reference">${escapeHtml(referenceLabel)}${isDiscounted ? "" : `: ${escapeHtml(money(referencePrice))}`}</small>`
    : "";

  return `
    <span class="sale-price ${className}">
      ${isDiscounted ? `<del>${money(referencePrice)}</del>` : ""}
      <strong class="${currentPriceClass}">${escapeHtml(formatProductPrice(product))}</strong>
      ${discount ? `<small class="sale-discount">${escapeHtml(discount)} · ${escapeHtml(product.saleLabel || "Oferta Santos7")}</small>` : ""}
      ${saving ? `<small class="sale-saving">Ahorra ${money(saving)}</small>` : ""}
      ${referenceMarkup}
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
  const showReferencePrice = referencePrice && Number(product.price) < referencePrice;
  return `${showReferencePrice ? `<del>${money(referencePrice * quantity)}</del>` : ""}<strong>${money(product.price * quantity)}</strong>`;
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
    || (state.filter === "ofertas" && hasProductSale(product))
    || (state.filter === "agotados" && isProductSoldOut(product))
    || product.category === state.filter
    || product.subCategory === state.filter;
}

function productToneBrightness(product) {
  const tone = String(product.tone || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(tone)) return 0;
  const red = parseInt(tone.slice(0, 2), 16);
  const green = parseInt(tone.slice(2, 4), 16);
  const blue = parseInt(tone.slice(4, 6), 16);
  return (red + green + blue) / 3;
}

function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim();
}

function isProductSoldOut(product) {
  return product.availability === "out_of_stock" || product.stock === 0;
}

function isInquiryProduct(product) {
  return product.availability === "inquiry" || !Number.isFinite(product.price);
}

function hasProductSale(product) {
  return Boolean(!product.referenceOnly && getReferencePrice(product) && formatDiscount(product));
}

function sortCatalogProducts(first, second) {
  const saleDifference = Number(hasProductSale(second)) - Number(hasProductSale(first));
  if (saleDifference) return saleDifference;

  const discountDifference = (getDiscountPercent(second) || 0) - (getDiscountPercent(first) || 0);
  if (discountDifference) return discountDifference;

  return productToneBrightness(second) - productToneBrightness(first);
}

function filteredProducts() {
  const query = normalizeSearchText(state.search);
  return catalog.filter(product => {
    if (!matchesProductFilter(product)) return false;
    if (!query) return true;

    const searchable = normalizeSearchText([
      product.name,
      product.brand,
      product.model,
      product.styleCode,
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
    ].join(" "));

    return searchable.includes(query);
  }).sort(sortCatalogProducts);
}

function renderMedia(product, className = "", imageIndex = 0) {
  const image = product.images[imageIndex];
  if (!image) {
    return `<span class="media-placeholder ${className}" aria-hidden="true"></span>`;
  }

  return `<img class="${className}" src="${productImagePath(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="700" height="795" style="object-fit:${product.imageFit}">`;
}

function renderProductCard(product, index) {
    const isFavorite = state.favorites.has(product.id);
    const isPending = !Number.isFinite(product.price);
    const isInquiry = isInquiryProduct(product);
    const priceClass = isPending ? "price-pending" : "";
    const availability = availabilityLabel(product);
    const isSoldOut = isProductSoldOut(product);
    const hasSale = hasProductSale(product);
    const tagClass = hasSale || product.tagClass ? (product.tagClass || "tag-sale") : "";
    const productTag = isSoldOut ? "Agotado" : (hasSale ? (product.saleLabel || "Oferta Santos7") : (product.tag || (isPending ? "Consultar" : "Original")));
    const cardClasses = ["product-card", isSoldOut ? "is-sold-out" : "", hasSale ? "product-card-sale" : ""].filter(Boolean).join(" ");

    return `
      <article class="${cardClasses}" style="animation-delay:${index * 45}ms">
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
              ${availability ? `<p class="product-stock ${isInquiry ? "stock-pending" : ""}"><span class="stock-dot"></span>${escapeHtml(availability)}</p>` : ""}
              ${product.note ? `<p class="product-note">${escapeHtml(product.note)}</p>` : ""}
            </div>
            ${renderSalePrice(product, `product-price ${priceClass}`)}
          </div>
          <button class="add-button ${isSoldOut ? "is-disabled" : ""}" type="button" data-product="${product.id}">${isSoldOut ? "Ver detalles · agotado" : (isInquiry ? "Consultar pieza" : "Comprar ahora")}<span>↗</span></button>
        </div>
      </article>
    `;
}

function renderProducts() {
  const visibleProducts = filteredProducts();
  const showingSoldOutOnly = state.filter === "agotados";
  const availableProducts = visibleProducts.filter(product => !isProductSoldOut(product));
  const soldOutProducts = visibleProducts.filter(isProductSoldOut);
  const displayedProducts = showingSoldOutOnly ? soldOutProducts : availableProducts;
  const availableLabel = availableProducts.length === 1 ? "disponible" : "disponibles";
  const soldOutLabel = soldOutProducts.length === 1 ? "referencia agotada" : "referencias agotadas";

  productTotal.textContent = showingSoldOutOnly
    ? `${soldOutProducts.length} ${soldOutLabel}`
    : `${availableProducts.length} ${availableLabel}`;
  if (soldOutQuickCount) soldOutQuickCount.textContent = String(catalog.filter(isProductSoldOut).length);
  if (catalogSummaryText) {
    const filterButton = document.querySelector(`.filter-button[data-filter="${state.filter}"]`);
    const filterLabel = filterButton?.textContent.trim();
    catalogSummaryText.textContent = state.search.trim()
      ? `${displayedProducts.length} resultado${displayedProducts.length === 1 ? "" : "s"} para “${state.search.trim()}”`
      : state.filter === "agotados"
        ? `${filterLabel || "Agotados"} · ${soldOutProducts.length} referencia${soldOutProducts.length === 1 ? "" : "s"}`
        : state.filter === "todos"
        ? "Ofertas y stock disponible primero"
        : `${filterLabel || "Catálogo"} · ${availableProducts.length} disponible${availableProducts.length === 1 ? "" : "s"}`;
  }
  productGrid.innerHTML = displayedProducts.length
    ? displayedProducts.map(renderProductCard).join("")
    : '<p class="no-results">No encontramos una pieza disponible con esa búsqueda.</p>';

  if (soldOutSection && soldOutGrid && soldOutTotal) {
    soldOutSection.hidden = showingSoldOutOnly || soldOutProducts.length === 0;
    soldOutTotal.textContent = `${soldOutProducts.length} ${soldOutLabel}`;
    soldOutGrid.innerHTML = showingSoldOutOnly ? "" : soldOutProducts.map(renderProductCard).join("");
  }
}

function syncStructuredData() {
  if (!catalogStructuredData) return;

  const siteUrl = "https://santos7store.vercel.app";
  const itemListElement = catalog
    .filter(product => !isProductSoldOut(product) && product.images.length)
    .map((product, index) => {
      const item = {
        "@type": "Product",
        name: product.name,
        image: product.images.map(image => `${siteUrl}/${productImagePath(image)}`),
        description: [product.categoryLabel, product.details, product.note].filter(Boolean).join(" · ")
      };

      if (product.brand) item.brand = { "@type": "Brand", name: product.brand };
      if (Number.isFinite(product.price)) {
        item.offers = {
          "@type": "Offer",
          url: `${siteUrl}/?q=${encodeURIComponent(product.name)}#catalogo`,
          priceCurrency: "PEN",
          price: product.price,
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition"
        };
      }

      return { "@type": "ListItem", position: index + 1, item };
    });

  catalogStructuredData.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de zapatillas, ropa y accesorios Santos7 Store",
    numberOfItems: itemListElement.length,
    itemListElement
  });
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
          ${image ? `<img src="${productImagePath(image)}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" width="76" height="76" style="object-fit:${product.imageFit}">` : '<span class="media-placeholder" aria-hidden="true"></span>'}
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
  showToast(isInquiryProduct(product) ? `${product.name} se añadió para confirmar` : `${product.name} se añadió a tu bolsa`);
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
  let inquiryCount = 0;
  let confirmedSubtotal = 0;

  state.cart.forEach(item => {
    const product = getProduct(item.id);
    if (!product) return;
    const pending = !Number.isFinite(product.price);
    if (pending) pendingCount += item.qty;
    if (isInquiryProduct(product)) inquiryCount += item.qty;
    else confirmedSubtotal += product.price * item.qty;
    const discount = formatDiscount(product);
    lines.push(`- ${product.name} | Talla: ${sizeLabel(product, item.size)} | Cantidad: ${item.qty} | Precio Santos7: ${formatPriceForMessage(product, item.qty)}${discount ? ` | ${discount} Oferta Santos7` : ""}`);
  });

  lines.push(`Subtotal confirmado: ${money(confirmedSubtotal)}`);
  if (pendingCount) lines.push(`Piezas con precio por confirmar: ${pendingCount}`);
  if (inquiryCount) lines.push(`Piezas con disponibilidad por confirmar: ${inquiryCount}`);
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
          : '<span class="media-placeholder media-placeholder-large" aria-hidden="true"></span>'}
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
  const inquiry = isInquiryProduct(product);

  if (Number.isFinite(available)) {
    activeProductQuantity = Math.min(activeProductQuantity, Math.max(1, available));
  }
  if (modalWhatsapp) modalWhatsapp.href = whatsappUrl(productMessage(product, activeProductSize, activeProductQuantity));
  if (modalWhatsappText) modalWhatsappText.textContent = isSoldOut || inquiry ? "Consultar por WhatsApp" : "Comprar por WhatsApp";
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
  const inquiry = isInquiryProduct(product);
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
  if (inquiry && !isSoldOut) {
    productModalBody.querySelector("#modalAddText").textContent = "Añadir a consulta";
    productModalBody.querySelector("#modalWhatsappText").textContent = "Consultar por WhatsApp";
  }
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
    const url = new URL(window.location.href);
    if (state.filter === "todos") url.searchParams.delete("filter");
    else url.searchParams.set("filter", state.filter);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
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

function updateSearch(value, source) {
  state.search = value;
  [searchInput, headerSearch].forEach(field => {
    if (field && field !== source) field.value = value;
  });

  const url = new URL(window.location.href);
  if (value.trim()) url.searchParams.set("q", value.trim());
  else url.searchParams.delete("q");
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  document.title = value.trim() ? `${value.trim().slice(0, 70)} | Santos7 Store` : defaultPageTitle;
  renderProducts();
}

searchInput?.addEventListener("input", event => updateSearch(event.target.value, event.target));
headerSearch?.addEventListener("input", event => {
  updateSearch(event.target.value, event.target);
});
headerSearch?.addEventListener("focus", () => catalogSection?.scrollIntoView({ behavior: "smooth", block: "start" }));

document.querySelector(".search-trigger")?.addEventListener("click", () => {
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => searchInput?.focus(), 500);
});

document.querySelectorAll("[data-header-filter]").forEach(link => link.addEventListener("click", () => {
  state.filter = link.dataset.headerFilter;
  updateFilterButtons(state.filter);
  renderProducts();
}));

catalogSection.addEventListener("click", event => {
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

if (catalogToolbar && catalogHeading && "IntersectionObserver" in window) {
  const catalogHeadingObserver = new IntersectionObserver(([entry]) => {
    catalogToolbar.classList.toggle("is-condensed", !entry.isIntersecting);
  }, { rootMargin: "-82px 0px 0px", threshold: 0 });
  catalogHeadingObserver.observe(catalogHeading);
}

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

function updateCampaignVideoControl() {
  if (!campaignVideo || !campaignVideoToggle) return;
  const isPaused = campaignVideo.paused;
  campaignVideoToggle.classList.toggle("is-paused", isPaused);
  campaignVideoToggle.setAttribute("aria-pressed", String(!isPaused));
  campaignVideoToggle.setAttribute("aria-label", isPaused ? "Reproducir video" : "Pausar video");
  if (campaignVideoToggleIcon) campaignVideoToggleIcon.textContent = isPaused ? "▶" : "Ⅱ";
  if (campaignVideoToggleLabel) campaignVideoToggleLabel.textContent = isPaused ? "Reproducir video" : "Pausar video";
}

function setupCampaignVideo() {
  if (!campaignVideo) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reducedMotion.matches) {
    campaignVideo.pause();
    if (campaignVideoToggle) campaignVideoToggle.disabled = true;
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      campaignVideo.play().catch(() => {});
      observer.disconnect();
    }, { rootMargin: "160px 0px", threshold: 0.15 });
    observer.observe(campaignVideo);
  } else {
    campaignVideo.play().catch(() => {});
  }

  campaignVideo.addEventListener("play", updateCampaignVideoControl);
  campaignVideo.addEventListener("pause", updateCampaignVideoControl);
  campaignVideo.addEventListener("ended", updateCampaignVideoControl);
  campaignVideo.addEventListener("error", () => {
    campaignVideo.closest(".campaign-video-shell")?.classList.add("is-unavailable");
    if (campaignVideoToggle) campaignVideoToggle.disabled = true;
    updateCampaignVideoControl();
  });
  campaignVideoToggle?.addEventListener("click", () => {
    if (campaignVideo.paused) campaignVideo.play().catch(() => {});
    else campaignVideo.pause();
  });
  updateCampaignVideoControl();
}

setupCampaignVideo();
syncStructuredData();
updateFilterButtons(state.filter);
renderProducts();
renderCart();
