
    const products = [
      {
        id: 1,
        name: "Sandalia Kappa",
        category: "calzado",
        categoryLabel: "Sandalias · Kappa",
        details: "Tallas 43 · 44 · 45",
        sizes: ["43", "44", "45"],
        price: 40,
        oldPrice: null,
        tag: "Solo por hoy",
        tagClass: "tag-sale",
        note: "Pago completo",
        tone: "#c7c9c8",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalia-kappa.jpeg"
      },
      {
        id: 2,
        name: "Polo Jordan",
        category: "ropa",
        categoryLabel: "Polo · Jordan",
        details: "Talla M",
        sizes: ["M"],
        price: 130,
        oldPrice: null,
        tag: "Original",
        note: "Separa con S/ 40 · llega en 10 días",
        tone: "#b8d0e9",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-jordan.jpeg"
      },
      {
        id: 3,
        name: "Gorra BMW",
        category: "accesorios",
        categoryLabel: "Gorra · BMW",
        details: "Talla unica",
        sizes: [],
        price: 65,
        oldPrice: null,
        tag: "Original",
        tone: "#ded3bf",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/gorra-1.jpeg"
      },
      {
        id: 4,
        name: "Gorra Guess",
        category: "accesorios",
        categoryLabel: "Gorra · Guess",
        details: "",
        sizes: [],
        price: 135,
        oldPrice: null,
        tag: "Original",
        tone: "#aaa0ec",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/gorra-guess.jpeg"
      },
      {
        id: 5,
        name: "Polo Nike",
        category: "ropa",
        categoryLabel: "Polo · Nike",
        details: "Tallas M · L",
        sizes: ["M", "L"],
        price: 89,
        oldPrice: null,
        tag: "Original",
        tone: "#f0a08b",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-nike.jpeg"
      },
      {
        id: 6,
        name: "Puma Suede XL",
        category: "calzado",
        categoryLabel: "Zapatillas · Puma",
        details: "Tallas 40.5 · 41 · 42 · 42.5 · 44.5",
        sizes: ["40.5", "41", "42", "42.5", "44.5"],
        price: 235,
        oldPrice: null,
        tag: "Original",
        tone: "#cee480",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/puma-suede-xl.jpeg"
      },
      {
        id: 7,
        name: "Puma Ferrari CA Match",
        category: "calzado",
        categoryLabel: "Zapatillas · Puma Ferrari",
        details: "Tallas 42 · 42.5 · 44.5",
        sizes: ["42", "42.5", "44.5"],
        price: 175,
        oldPrice: null,
        tag: "Original",
        tone: "#efb09c",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/puma-ferrari-ca-match.jpeg"
      },
      {
        id: 8,
        name: "Polo Puma",
        category: "ropa",
        categoryLabel: "Polo · Puma",
        details: "Tallas S · M · L · XL",
        sizes: ["S", "M", "L", "XL"],
        price: 59,
        oldPrice: null,
        tag: "Original",
        tone: "#a9caff",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-puma-nuevo.jpeg"
      },
      {
        id: 9,
        name: "Camisero Puma BMW",
        category: "ropa",
        categoryLabel: "Camisero · Puma BMW",
        details: "Talla M",
        sizes: ["M"],
        price: 100,
        oldPrice: null,
        tag: "Solo quedan 2",
        tagClass: "tag-sale",
        note: "Stock limitado",
        tone: "#b8b9bd",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/camisero-puma-bmw.jpeg"
      },
      {
        id: 10,
        name: "Nike Air Max SC",
        category: "calzado",
        categoryLabel: "Zapatillas · Nike",
        details: "Tallas 40.5 · 41 · 42 · 42.5 · 43 · 44 · 44.5",
        sizes: ["40.5", "41", "42", "42.5", "43", "44", "44.5"],
        price: 239,
        oldPrice: null,
        tag: "Original",
        tone: "#f0a08b",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/nike-air-max-sc.jpeg"
      },
      {
        id: 11,
        name: "Sandalia Victori One",
        category: "calzado",
        categoryLabel: "Sandalias · Victori One",
        details: "Talla 39",
        sizes: ["39"],
        price: 85,
        oldPrice: null,
        tag: "Original",
        tone: "#d7d7d2",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalias-1.jpeg"
      },
      {
        id: 12,
        name: "Nike Ebernon Low",
        category: "calzado",
        categoryLabel: "Zapatillas · Nike",
        details: "Tallas 41 · 42 · 42.5 · 43 · 44 · 44.5 · 45",
        sizes: ["41", "42", "42.5", "43", "44", "44.5", "45"],
        price: 189,
        oldPrice: null,
        tag: "Original",
        tone: "#ded3bf",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/nike-ebernon-low.jpeg"
      },
      {
        id: 13,
        name: "Polo Guess",
        category: "ropa",
        categoryLabel: "Polo · Guess",
        details: "Talla S",
        sizes: ["S"],
        price: 100,
        oldPrice: null,
        tag: "Original",
        tone: "#d0b5d8",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-guess-nuevo.jpeg"
      },
      {
        id: 14,
        name: "Cartera Guess",
        category: "accesorios",
        categoryLabel: "Cartera - Guess",
        details: "Talla unica",
        sizes: [],
        price: 259,
        oldPrice: null,
        tag: "Original",
        tone: "#d5c3a7",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/cartera-guess.jpeg"
      },
      {
        id: 15,
        name: "Sandalia Calvin Klein",
        category: "calzado",
        categoryLabel: "Sandalias - Calvin Klein",
        details: "Talla 40",
        sizes: ["40"],
        price: 115,
        oldPrice: null,
        tag: "Sin box",
        tagClass: "tag-sale",
        note: "Sin caja",
        tone: "#d6d2ca",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalias-calvin-klein.jpeg"
      },
      {
        id: 16,
        name: "Polera Puma",
        category: "ropa",
        categoryLabel: "Polera - Puma",
        details: "Tallas S - M",
        sizes: ["S", "M"],
        price: 99,
        oldPrice: null,
        tag: "Original",
        tone: "#b8c6b5",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polera-puma.jpeg"
      },
      {
        id: 17,
        name: "Polo Tommy Hilfiger",
        category: "ropa",
        categoryLabel: "Polo - Tommy Hilfiger",
        details: "Talla M",
        sizes: ["M"],
        price: 125,
        oldPrice: null,
        tag: "Original",
        tone: "#d9c7b2",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-tommy-hilfiger-nuevo.jpeg"
      },
      {
        id: 18,
        name: "Sandalia Nike Kobe Offcourt",
        category: "calzado",
        categoryLabel: "Sandalias - Nike",
        details: "Talla 42.5",
        sizes: ["42.5"],
        price: 149,
        oldPrice: null,
        tag: "Original",
        tone: "#d5d8dc",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalias-nike.jpeg"
      },
      {
        id: 19,
        name: "Sandalia Puma",
        category: "calzado",
        categoryLabel: "Sandalias - Puma",
        details: "Talla 40.5",
        sizes: ["40.5"],
        price: 69,
        oldPrice: null,
        tag: "Preciazoo",
        tagClass: "tag-sale",
        tone: "#c5c2ba",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalia-puma.jpeg"
      },
      {
        id: 20,
        name: "Polo",
        category: "ropa",
        categoryLabel: "Polo",
        details: "Talla S",
        sizes: ["S"],
        price: 69,
        oldPrice: null,
        tag: "Original",
        tone: "#c9c9c9",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-4.jpeg"
      },
      {
        id: 21,
        name: "Polo Nike",
        category: "ropa",
        categoryLabel: "Polo · Nike",
        details: "Tallas S · M · XL",
        sizes: ["S", "M", "XL"],
        price: 90,
        oldPrice: null,
        tag: "Original",
        tone: "#bfc3c4",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/polo-nike-negro.jpeg"
      },
      {
        id: 22,
        name: "Sandalia",
        category: "calzado",
        categoryLabel: "Sandalias",
        details: "Talla 40",
        sizes: ["40"],
        price: 85,
        oldPrice: null,
        tag: "Original",
        tone: "#b9c0c6",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalias-2.jpeg"
      },
      {
        id: 23,
        name: "Zapatillas Nike",
        category: "calzado",
        categoryLabel: "Zapatillas · Nike",
        details: "Talla 40",
        sizes: ["40"],
        price: 415,
        oldPrice: null,
        tag: "Caja cortada",
        tagClass: "tag-sale",
        note: "Caja cortada",
        tone: "#d7dbe0",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/zapatillas-nike.jpeg"
      },
      {
        id: 24,
        name: "Zapatillas Nike Air",
        category: "calzado",
        categoryLabel: "Zapatillas · Nike",
        details: "Tallas 39 · 40 · 41",
        sizes: ["39", "40", "41"],
        price: 215,
        oldPrice: null,
        tag: "Original",
        tone: "#e0ddd5",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/zapatillas-nike-air.jpeg"
      },
      {
        id: 25,
        name: "Gorra Nike",
        category: "accesorios",
        categoryLabel: "Gorra · Nike",
        details: "Talla unica",
        sizes: [],
        price: 90,
        oldPrice: null,
        tag: "Original",
        tone: "#ded3bf",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/gorra-nike-nueva.jpeg"
      },
      {
        id: 26,
        name: "Sandalia Nike Victori One",
        category: "calzado",
        categoryLabel: "Sandalias · Nike",
        details: "Tallas 35.5 · 36.5 · 38 · 39",
        sizes: ["35.5", "36.5", "38", "39"],
        price: 115,
        oldPrice: null,
        tag: "Original",
        tone: "#d7d7d2",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/assets/sandalia-nike-victori-one.jpeg"
      },
      {
        id: 27,
        name: "Nike Sabrina Lonescu",
        category: "ropa",
        categoryLabel: "Camiseta · Nike",
        details: "Tallas M · L",
        sizes: ["M", "L"],
        price: 89,
        oldPrice: 159,
        tag: "Descuento",
        tagClass: "tag-sale",
        note: "Retail S/ 159",
        tone: "#2d4e3b",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/nike%20sabrina.jpeg"
      },
      {
        id: 28,
        name: "Polo Calvin Klein",
        category: "ropa",
        categoryLabel: "Polo · Calvin Klein",
        details: "Talla M",
        sizes: ["M"],
        price: 130,
        oldPrice: null,
        tag: "Original",
        tone: "#e8e5e0",
        image: "https://raw.githubusercontent.com/TechNova-777/Santos7-store/main/polo%20calvin%20klein.jpeg"
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
    const productModal = document.querySelector("#productModal");
    const productModalBody = document.querySelector("#productModalBody");
    let toastTimer;
    let activeProductId = null;
    let activeProductSize = "";
    let activeProductQuantity = 1;
     
    function loadCart() {
      try {
        const saved = JSON.parse(localStorage.getItem("santos_store_cart") || "[]");
        return Array.isArray(saved)
          ? saved
            .filter(item => products.some(product => product.id === item.id) && Number(item.qty) > 0)
            .map(item => ({ id: item.id, size: item.size || "", qty: Number(item.qty) }))
          : [];
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
        const searchable = `${product.name} ${product.categoryLabel} ${product.details || ""} ${product.note || ""}`.toLowerCase();
        return matchesFilter && (!query || searchable.includes(query));
      });
    }
     
    function renderProducts() {
      const visibleProducts = filteredProducts();
      productTotal.textContent = `${String(visibleProducts.length).padStart(2, "0")} modelos`;
     
      if (!visibleProducts.length) {
        productGrid.innerHTML = '<p class="no-results">No encontramos ese producto. Prueba con otra búsqueda.</p>';
        return;
      }
     
      productGrid.innerHTML = visibleProducts.map((product, index) => `
        <article class="product-card" style="animation-delay:${index * 45}ms">
          <div class="product-image" style="--product-bg:${product.tone}" data-product="${product.id}">
            <span class="product-tag ${product.oldPrice || product.tagClass ? (product.tagClass || "tag-sale") : ""}">${product.tag}</span>
            <button class="favorite-button ${state.favorites.has(product.id) ? "is-favorite" : ""}" type="button" data-favorite="${product.id}" aria-label="${state.favorites.has(product.id) ? "Quitar de favoritos" : "Añadir a favoritos"}">${state.favorites.has(product.id) ? "♥" : "♡"}</button>
            <img src="${product.image}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-info">
            <div class="product-line">
              <div><p class="product-category">${product.categoryLabel}</p><h3>${product.name}</h3>${product.details ? `<p class="product-details">${product.details}</p>` : ""}${product.note ? `<p class="product-note">${product.note}</p>` : ""}</div>
              <p class="product-price">${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}${money(product.price)}</p>
            </div>
            <button class="add-button" type="button" data-product="${product.id}">Ver producto <span>↗</span></button>
          </div>
        </article>
      `).join("");
    }
     
    function cartQuantity() {
      return state.cart.reduce((total, item) => total + item.qty, 0);
    }
     
    function findCartItem(id, size) {
      return state.cart.find(item => item.id === id && item.size === size);
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
        cartItems.innerHTML = '<div class="cart-empty"><strong>Tu bolsa está vacía</strong>Elige un producto y coordina tu pedido por WhatsApp.</div>';
        return;
      }
     
      cartItems.innerHTML = state.cart.map(item => {
        const product = getProduct(item.id);
        const size = item.size ? `Talla ${item.size}` : "Talla por confirmar";
        return `
          <div class="cart-item">
            <div class="cart-item-image" style="--product-bg:${product.tone}"><img src="${product.image}" alt="${product.name}"></div>
            <div><h3>${product.name}</h3><p>${size}</p><div class="quantity-control"><button type="button" data-quantity-id="${product.id}" data-quantity-size="${item.size}" data-change="-1" aria-label="Quitar una unidad">−</button><span>${item.qty}</span><button type="button" data-quantity-id="${product.id}" data-quantity-size="${item.size}" data-change="1" aria-label="Añadir una unidad">＋</button></div><button class="remove-item" type="button" data-remove-id="${product.id}" data-remove-size="${item.size}">Eliminar</button></div>
            <span class="cart-item-price">${money(product.price * item.qty)}</span>
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
      if (item) item.qty += quantity;
      else state.cart.push({ id, size: cartSize, qty: quantity });
      saveCart();
      renderCart();
      showToast(`${product.name} se añadió a tu bolsa`);
    }
     
    function changeQuantity(id, size, change) {
      const item = findCartItem(id, size);
      if (!item) return;
      item.qty += change;
      if (item.qty <= 0) state.cart = state.cart.filter(entry => entry !== item);
      saveCart();
      renderCart();
    }
     
    function removeFromCart(id, size) {
      state.cart = state.cart.filter(item => !(item.id === id && item.size === size));
      saveCart();
      renderCart();
    }
     
    function openCart() {
      closeProduct();
      cartDrawer.classList.add("is-open");
      cartDrawer.setAttribute("aria-hidden", "false");
      document.querySelector("#cartTrigger").setAttribute("aria-expanded", "true");
      overlay.classList.add("is-visible");
      document.body.style.overflow = "hidden";
    }
     
    function closeCart() {
      cartDrawer.classList.remove("is-open");
      cartDrawer.setAttribute("aria-hidden", "true");
      document.querySelector("#cartTrigger").setAttribute("aria-expanded", "false");
      overlay.classList.remove("is-visible");
      if (!productModal.classList.contains("is-open")) document.body.style.overflow = "";
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
      return [
        "Hola Santos7 Store, quiero comprar:",
        `Producto: ${product.name}`,
        `Talla: ${size || "Por confirmar"}`,
        `Cantidad: ${quantity}`,
        `Precio: ${money(product.price * quantity)}`
      ].join("\n");
    }
     
    function cartMessage() {
      const lines = ["Hola Santos7 Store, quiero confirmar este pedido:"];
      state.cart.forEach(item => {
        const product = getProduct(item.id);
        lines.push(`- ${product.name} | Talla: ${item.size || "Por confirmar"} | Cantidad: ${item.qty} | ${money(product.price * item.qty)}`);
      });
      lines.push(`Subtotal: ${money(state.cart.reduce((total, item) => total + getProduct(item.id).price * item.qty, 0))}`);
      lines.push("Quiero coordinar la entrega.");
      return lines.join("\n");
    }
     
    function updateModalLinks() {
      const product = getProduct(activeProductId);
      if (!product) return;
      const modalWhatsapp = document.querySelector("#modalWhatsapp");
      const modalQuantity = document.querySelector("#modalQuantityValue");
      if (modalWhatsapp) modalWhatsapp.href = whatsappUrl(productMessage(product, activeProductSize, activeProductQuantity));
      if (modalQuantity) modalQuantity.textContent = activeProductQuantity;
    }
     
    function openProduct(id) {
      const product = getProduct(id);
      if (!product) return;
      closeCart();
      activeProductId = id;
      activeProductSize = product.sizes[0] || "";
      activeProductQuantity = 1;
      const sizeMarkup = product.sizes.length
        ? `<div class="modal-field"><div class="modal-field-label"><span>Elige tu talla</span><small>Selecciona una opción</small></div><div class="size-options" id="modalSizeList">${product.sizes.map((size, index) => `<button class="size-button ${index === 0 ? "is-selected" : ""}" type="button" data-modal-size="${size}">${size}</button>`).join("")}</div></div>`
        : `<div class="modal-field"><div class="modal-field-label"><span>Talla</span><small>Confirma disponibilidad por WhatsApp</small></div></div>`;
     
      productModalBody.innerHTML = `
        <div class="modal-product">
          <div class="modal-product-image" style="--product-bg:${product.tone}"><img src="${product.image}" alt="${product.name}"><span>${product.tag}</span></div>
          <div class="modal-product-copy"><p class="eyebrow">${product.categoryLabel}</p><h2 id="modalProductName">${product.name}</h2><div class="modal-price">${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}<strong>${money(product.price)}</strong></div><p class="modal-details">${product.details || "Producto original Santos7."}</p>${product.note ? `<p class="modal-note">${product.note}</p>` : ""}${sizeMarkup}<div class="modal-quantity"><span>Cantidad</span><div class="quantity-control"><button type="button" data-modal-quantity="-1" aria-label="Disminuir cantidad">−</button><b id="modalQuantityValue">1</b><button type="button" data-modal-quantity="1" aria-label="Aumentar cantidad">＋</button></div></div><div class="modal-actions"><button class="button button-dark" id="modalAdd" type="button">Agregar a bolsa <span>＋</span></button><a class="button button-whatsapp" id="modalWhatsapp" href="#" target="_blank" rel="noopener">Comprar por WhatsApp <span>↗</span></a></div><small class="modal-footnote">El stock y la entrega se confirman directamente contigo.</small></div>
        </div>
      `;
      updateModalLinks();
      productModal.classList.add("is-open");
      productModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
     
    function closeProduct() {
      productModal.classList.remove("is-open");
      productModal.setAttribute("aria-hidden", "true");
      if (!cartDrawer.classList.contains("is-open")) document.body.style.overflow = "";
    }
     
    document.querySelectorAll("[data-filter]").forEach(button => {
      button.addEventListener("click", () => {
        state.filter = button.dataset.filter;
        document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("is-active", item === button));
        renderProducts();
        document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
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
      document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth" });
      setTimeout(() => searchInput.focus(), 500);
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
      const addButton = event.target.closest("#modalAdd");
      if (sizeButton) {
        activeProductSize = sizeButton.dataset.modalSize;
        productModalBody.querySelectorAll("[data-modal-size]").forEach(button => button.classList.toggle("is-selected", button === sizeButton));
        updateModalLinks();
      }
      if (quantityButton) {
        activeProductQuantity = Math.max(1, activeProductQuantity + Number(quantityButton.dataset.modalQuantity));
        updateModalLinks();
      }
      if (addButton) {
        addToCart(activeProductId, activeProductSize, activeProductQuantity);
        if (!getProduct(activeProductId).sizes.length || activeProductSize) {
          closeProduct();
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
     
    document.querySelector("#checkoutButton").addEventListener("click", () => {
      if (!state.cart.length) {
        showToast("Agrega un producto antes de continuar");
        return;
      }
      window.open(whatsappUrl(cartMessage()), "_blank", "noopener,noreferrer");
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
     
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeProduct();
        closeCart();
        mainNav.classList.remove("is-open");
        menuTrigger.setAttribute("aria-expanded", "false");
      }
    });
     
    renderProducts();
    renderCart();
     
