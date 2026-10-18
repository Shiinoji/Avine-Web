// Avine storefront data and client-side interactions.
// This file creates the product catalog, cart behavior, and page-level UI flows for the static storefront.

const products = [
  {
    id: "phone-poco-f9",
    name: "Xiaomi POCO F9",
    category: "Phones",
    price: 39990,
    tag: "Est. price",
    image: "assets/Xiaomi Poco F9.jpg",
    description:
      "Model: POCO F9 (unverified). Exact chipset, display, camera, battery and storage specs need confirmation.",
  },
  {
    id: "phone-samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "Phones",
    price: 84990,
    tag: "Reference price",
    image: "assets/Samsung Galaxy S24 Ultra.jpg",
    description:
      "6.8-inch QHD+ 120Hz AMOLED · Snapdragon 8 Gen 3 for Galaxy · 200MP main camera · 5,000mAh battery · 256GB base storage.",
  },
  {
    id: "phone-iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "Phones",
    price: 86990,
    tag: "From ₱86,990",
    image: "assets/iPhone 17 Pro Max.jpg",
    description:
      "6.9-inch Super Retina XDR with ProMotion · A19 Pro · 48MP Pro Fusion camera system · up to 8x optical-quality zoom · 256GB base storage.",
  },
  {
    id: "phone-iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "Phones",
    price: 69990,
    tag: "Launch price",
    image: "assets/iPhone 15 Pro.jpg",
    description:
      "6.1-inch Super Retina XDR with ProMotion · A17 Pro · 48MP Main camera · titanium design · 128GB base storage.",
  },
  {
    id: "gpu-rtx-5090",
    name: "GeForce RTX 5090",
    category: "Graphics Cards",
    price: 189990,
    tag: "Est. price",
    image: "assets/Arus GeForce RTX 5090.jpg",
    description:
      "NVIDIA Blackwell · 21,760 CUDA cores · 32GB GDDR7 · 512-bit memory bus. Exact AORUS board model and clock speeds unverified.",
  },
];

// Uses the Philippine peso format consistently across the storefront.
const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(price);

// Reads browser-stored data with a safe fallback when the key is missing or malformed.
const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    console.error(`Unable to read ${key} from local storage.`, error);
    return fallback;
  }
};

const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to save ${key} to local storage.`, error);
    showToast("Your browser couldn't save this change.");
    return false;
  }
};

let toastTimer;
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.append(toast);
  }
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3000);
}

const normalizeEmail = (email) => email.trim().toLowerCase();
const accountKey = "avine-accounts";

function getAccounts() {
  const accounts = readStorage(accountKey, []);
  return Array.isArray(accounts) ? accounts : [];
}

function getCurrentUser() {
  const session = readStorage("avine-session", null);
  if (!session || !session.email) return null;
  return (
    getAccounts().find((account) => account.email === session.email) || null
  );
}

function isLoggedIn() {
  return Boolean(getCurrentUser());
}

function cartStorageKey() {
  const user = getCurrentUser();
  return user
    ? `avine-cart:${encodeURIComponent(user.email)}`
    : "avine-cart:guest";
}

function getCart() {
  const saved = readStorage(cartStorageKey(), []);
  if (!Array.isArray(saved)) return [];
  return saved.reduce((cart, item) => {
    const product = item && products.find((entry) => entry.id === item.id);
    if (product && Number.isInteger(item.quantity) && item.quantity > 0) {
      cart.push({ ...product, quantity: item.quantity });
    }
    return cart;
  }, []);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = count;
  });
  const profileCount = document.querySelector("[data-profile-cart-count]");
  if (profileCount) profileCount.textContent = String(count);
}

function addToCart(productId, quantity = 1) {
  if (!isLoggedIn()) {
    requireLogin();
    return;
  }
  const product = products.find((item) => item.id === productId);
  if (!product || !Number.isInteger(quantity) || quantity < 1) {
    showToast("That product or quantity isn't available.");
    return;
  }
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);
  if (existing) existing.quantity += quantity;
  else
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  if (!writeStorage(cartStorageKey(), cart)) return;
  updateCartCount();
  showToast("Added to your bag. Good choice.");
}

function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  if (!writeStorage(cartStorageKey(), cart)) return;
  updateCartCount();
  renderCart();
  showToast("Item removed from your bag.");
}

function saveCart(cart) {
  if (!writeStorage(cartStorageKey(), cart)) return false;
  updateCartCount();
  renderCart();
  return true;
}

function buyNow(productId, quantity = 1) {
  const product = products.find((item) => item.id === productId);
  if (
    !product ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 99
  ) {
    showToast("That product is no longer available.");
    return;
  }
  const checkoutUrl = `checkout.html?mode=buy-now&productId=${encodeURIComponent(product.id)}&quantity=${quantity}`;
  if (!isLoggedIn()) {
    requireLogin(checkoutUrl);
    return;
  }
  window.location.href = checkoutUrl;
}

function requireLogin(returnTo) {
  const target =
    returnTo ||
    `${window.location.pathname}${window.location.search}${window.location.hash}`;
  window.location.href = `auth.html?redirect=${encodeURIComponent(target)}`;
}

function mergeGuestCart() {
  const guestCart = readStorage("avine-cart:guest", []);
  if (!Array.isArray(guestCart) || guestCart.length === 0) return;
  const userKey = cartStorageKey();
  const userCart = readStorage(userKey, []);
  const merged = Array.isArray(userCart)
    ? userCart.reduce((cart, item) => {
        const product = item && products.find((entry) => entry.id === item.id);
        if (product && Number.isInteger(item.quantity) && item.quantity > 0) {
          cart.push({ ...product, quantity: item.quantity });
        }
        return cart;
      }, [])
    : [];
  guestCart.forEach((guestItem) => {
    const product = products.find((item) => item.id === guestItem.id);
    if (
      !product ||
      !Number.isInteger(guestItem.quantity) ||
      guestItem.quantity < 1
    )
      return;
    const existing = merged.find((item) => item.id === product.id);
    if (existing) existing.quantity += guestItem.quantity;
    else merged.push({ ...product, quantity: guestItem.quantity });
  });
  if (writeStorage(userKey, merged)) {
    try {
      localStorage.removeItem("avine-cart:guest");
    } catch (error) {
      console.error("Unable to clear the guest cart after merging.", error);
      showToast(
        "Your bag was copied to your account, but the guest copy couldn't be cleared.",
      );
    }
  }
}

function updateNavbar() {
  const user = getCurrentUser();
  document.querySelectorAll(".site-header").forEach((header) => {
    const actions = header.querySelector(".header-actions");
    if (!actions) return;
    let login = actions.querySelector(".login-link");
    let signup = actions.querySelector(".signup-link");
    const cartLink = actions.querySelector(".cart-link");
    let profile = actions.querySelector(".profile-link");
    let logout = actions.querySelector(".logout-link");

    if (!login) {
      login = document.createElement("a");
      login.className = "login-link text-[11px]";
      login.href = "auth.html";
      login.textContent = "Log in";
      if (cartLink) actions.insertBefore(login, cartLink);
      else actions.append(login);
    }
    if (!signup) {
      signup = document.createElement("a");
      signup.className = "signup-link";
      signup.href = "auth.html?mode=signup";
      signup.textContent = "Sign up";
      if (cartLink) actions.insertBefore(signup, cartLink);
      else actions.append(signup);
    }
    if (!profile) {
      profile = document.createElement("a");
      profile.className = "profile-link";
      profile.href = "account.html";
      profile.setAttribute("aria-label", "Your account");
      profile.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg>';
      if (cartLink) actions.insertBefore(profile, cartLink);
      else actions.append(profile);
    }
    if (!logout) {
      logout = document.createElement("button");
      logout.type = "button";
      logout.className = "logout-link";
      logout.textContent = "Log out";
      actions.append(logout);
      logout.addEventListener("click", logoutUser);
    }

    login.hidden = Boolean(user);
    signup.hidden = Boolean(user);
    profile.hidden = !user;
    logout.hidden = !user;
    if (cartLink) {
      cartLink.href = "cart.html";
      cartLink.hidden = !user;
    }
    const navigation = header.querySelector(".main-nav");
    if (navigation) {
      for (const [label, href] of [
        ["Log in", "auth.html"],
        ["Sign up", "auth.html?mode=signup"],
      ]) {
        if (navigation.querySelector(`.mobile-auth-link[href="${href}"]`))
          continue;
        const link = document.createElement("a");
        link.className = "mobile-auth-link";
        link.href = href;
        link.textContent = label;
        navigation.append(link);
      }
      navigation.querySelectorAll(".mobile-auth-link").forEach((link) => {
        link.hidden = Boolean(user);
      });
      let accountLink = navigation.querySelector(".mobile-account-link");
      if (!accountLink) {
        accountLink = document.createElement("a");
        accountLink.className = "mobile-account-link";
        accountLink.href = "account.html";
        accountLink.textContent = "My account";
        navigation.append(accountLink);
      }
      accountLink.hidden = !user;
      let mobileLogout = navigation.querySelector(".mobile-logout-link");
      if (!mobileLogout) {
        mobileLogout = document.createElement("button");
        mobileLogout.type = "button";
        mobileLogout.className = "mobile-logout-link";
        mobileLogout.textContent = "Log out";
        mobileLogout.addEventListener("click", logoutUser);
        navigation.append(mobileLogout);
      }
      mobileLogout.hidden = !user;
    }
  });
  document
    .querySelectorAll(".site-footer a[href='auth.html']")
    .forEach((link) => {
      if (link.textContent.trim().toLowerCase() === "my account") {
        link.href = user ? "account.html" : "auth.html";
      }
    });
  updateCartCount();
}

function logoutUser() {
  try {
    localStorage.removeItem("avine-session");
  } catch (error) {
    console.error("Unable to clear the current session.", error);
    showToast("We couldn't log you out. Please try again.");
    return;
  }
  window.location.href = "index.html";
}

function renderCart() {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  const cart = getCart();
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCount = document.querySelector("[data-cart-total-quantity]");
  const totalPrice = document.querySelector("[data-cart-total-price]");
  const checkoutButton = document.querySelector("[data-cart-checkout]");
  if (totalCount) totalCount.textContent = String(count);
  if (totalPrice) totalPrice.textContent = formatPrice(subtotal);
  if (checkoutButton) checkoutButton.hidden = cart.length === 0;
  container.innerHTML = cart.length
    ? cart
        .map(
          (item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details"><h2>${item.name}</h2><p>${formatPrice(item.price)} each</p>
        <div class="quantity-control"><button data-cart-action="decrease" data-product-id="${item.id}" aria-label="Decrease ${item.name} quantity">−</button><span>${item.quantity}</span><button data-cart-action="increase" data-product-id="${item.id}" aria-label="Increase ${item.name} quantity">+</button></div>
      </div>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
      <button class="cart-remove" data-cart-action="remove" data-product-id="${item.id}">Remove</button>
    </article>`,
        )
        .join("")
    : '<div class="empty-state"><h2>Your bag is taking a little breather.</h2><p>Find something thoughtful for your everyday.</p><a class="button button-dark" href="shop.html">Explore the shop ↗</a></div>';
}

function initCart() {
  const container = document.querySelector("[data-cart-items]");
  if (!container) return;
  if (!isLoggedIn()) {
    requireLogin("cart.html");
    return;
  }
  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const productId = button.dataset.productId;
    const cart = getCart();
    const item = cart.find((entry) => entry.id === productId);
    if (!item) return;
    if (button.dataset.cartAction === "remove") {
      removeFromCart(productId);
      return;
    }
    item.quantity += button.dataset.cartAction === "increase" ? 1 : -1;
    saveCart(cart.filter((entry) => entry.quantity > 0));
  });
  document.querySelector("[data-cart-clear]").addEventListener("click", () => {
    if (saveCart([])) showToast("Your bag is now empty.");
  });
  document
    .querySelector("[data-cart-checkout]")
    .addEventListener("click", () => {
      if (getCart().length) window.location.href = "checkout.html?mode=cart";
    });
  renderCart();
}

// Generates each product card markup from the storefront data array.
function productCard(product) {
  const description =
    product.description.length > 105
      ? `${product.description.slice(0, 105).trim()}…`
      : product.description;
  return `<article class="product-card min-w-0" data-product-id="${product.id}">
    <div class="product-image-wrap">
      <button class="product-image-trigger" type="button" data-product-image="${product.id}" aria-label="View ${product.name} details">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
      </button>
      ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
    </div>
    <div class="product-info flex items-start justify-between gap-2 pt-[13px]">
      <div class="min-w-0 flex-1">
        <h3>${product.name}</h3>
        <p class="product-category">${product.category}</p>
      </div>
      <span class="product-price shrink-0">${formatPrice(product.price)}</span>
    </div>
    <p class="product-description">${description}</p>
    <div class="product-actions mx-[14px] mt-2 flex gap-2 max-[760px]:mx-[10px] max-[760px]:mt-[7px]">
      <button class="product-add flex h-[35px] min-w-0 flex-1 cursor-pointer items-center justify-center border border-[var(--line)] bg-transparent px-1 text-center text-[10px] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-white dark:hover:border-[var(--ink)] dark:hover:bg-[var(--ink)] max-[760px]:text-[9px]" data-add-cart="${product.id}">Add to cart</button>
      <button class="product-add buy-now flex h-[35px] min-w-0 flex-1 cursor-pointer items-center justify-center border border-[var(--accent-dark)] bg-[var(--accent-dark)] px-1 text-center text-[10px] text-white transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] dark:hover:border-[var(--ink)] dark:hover:bg-[var(--ink)] max-[760px]:text-[9px]" data-buy-now="${product.id}">Buy now</button>
    </div>
  </article>`;
}

// Tracks the current state of the product catalog filters and pagination.
const shopState = {
  category: [],
  min: 0,
  max: 250000,
  query: "",
  sort: "featured",
  page: 1,
  perPage: 6,
};

// Filters the master catalog based on search, price, category, and sort options.
function getFilteredProducts() {
  let filtered = products.filter((product) => {
    const matchesCategory =
      shopState.category.length === 0 ||
      shopState.category.includes(product.category);
    const matchesPrice =
      product.price >= shopState.min && product.price <= shopState.max;
    const search = shopState.query.toLowerCase();
    const matchesQuery =
      !search ||
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(search);
    return matchesCategory && matchesPrice && matchesQuery;
  });
  if (shopState.sort === "price-asc")
    filtered.sort((a, b) => a.price - b.price);
  if (shopState.sort === "price-desc")
    filtered.sort((a, b) => b.price - a.price);
  if (shopState.sort === "name")
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  return filtered;
}

// Renders the filtered catalog and updates the count and page controls for the shop view.
function renderShop() {
  const grid = document.querySelector('[data-products="shop"]');
  if (!grid) return;
  const filtered = getFilteredProducts();
  const pageCount = Math.max(1, Math.ceil(filtered.length / shopState.perPage));
  shopState.page = Math.min(shopState.page, pageCount);
  const pageProducts = filtered.slice(
    (shopState.page - 1) * shopState.perPage,
    shopState.page * shopState.perPage,
  );
  grid.innerHTML = pageProducts.length
    ? pageProducts.map(productCard).join("")
    : `<div class="empty-state"><h3>Nothing on this shelf just yet.</h3><p>Try adjusting your filters, or clear them to see everything.</p></div>`;
  const count = document.querySelector("[data-results-count]");
  if (count)
    count.textContent =
      shopState.query || shopState.category.length
        ? `Showing ${filtered.length}`
        : `Showing all ${filtered.length}`;
  renderPagination(pageCount);
}

function renderPagination(pageCount) {
  const pagination = document.querySelector(".pagination");
  if (!pagination) return;
  const buttons = [
    `<button data-page-number="${shopState.page - 1}" ${shopState.page === 1 ? "disabled" : ""}>Prev</button>`,
  ];
  for (let page = 1; page <= pageCount; page += 1) {
    buttons.push(
      `<button data-page-number="${page}" class="${shopState.page === page ? "active" : ""}" aria-current="${shopState.page === page ? "page" : "false"}">${page}</button>`,
    );
  }
  buttons.push(
    `<button data-page-number="${shopState.page + 1}" ${shopState.page === pageCount ? "disabled" : ""}>Next</button>`,
  );
  pagination.innerHTML = buttons.join("");
}

// Initializes the shop page: filters, sorting, search, pagination, and mobile controls.
function initShop() {
  const grid = document.querySelector('[data-products="shop"]');
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  shopState.query = params.get("q") || "";
  const initialCategory = params.get("category");
  if (
    initialCategory &&
    ["Phones", "Graphics Cards"].includes(initialCategory)
  ) {
    shopState.category = [initialCategory];
    const checkbox = document.querySelector(
      `input[name="category"][value="${initialCategory}"]`,
    );
    if (checkbox) checkbox.checked = true;
  }
  const searchInput = document.querySelector('.search-form input[name="q"]');
  if (searchInput && shopState.query) searchInput.value = shopState.query;

  const refresh = () => {
    grid.innerHTML = Array.from(
      { length: 6 },
      () =>
        '<div class="skeleton-card"><div class="skeleton-image"></div><div class="skeleton-line"></div><div class="skeleton-line short"></div></div>',
    ).join("");
    window.setTimeout(renderShop, 260);
  };
  document.querySelectorAll('input[name="category"]').forEach((checkbox) =>
    checkbox.addEventListener("change", () => {
      shopState.category = [
        ...document.querySelectorAll('input[name="category"]:checked'),
      ].map((item) => item.value);
      shopState.page = 1;
      refresh();
    }),
  );
  const minInput = document.querySelector("[data-min-price]");
  const maxInput = document.querySelector("[data-max-price]");
  const range = document.querySelector("[data-price-range]");
  const updatePrice = () => {
    shopState.min = Math.max(0, Number(minInput.value) || 0);
    shopState.max = Math.max(shopState.min, Number(maxInput.value) || 0);
    maxInput.value = String(shopState.max);
    range.value = String(Math.min(250000, shopState.max));
    shopState.page = 1;
    refresh();
  };
  minInput.addEventListener("change", updatePrice);
  maxInput.addEventListener("change", updatePrice);
  range.addEventListener("input", () => {
    maxInput.value = range.value;
    shopState.max = Number(range.value);
    shopState.page = 1;
    refresh();
  });
  document.querySelector("[data-sort]").addEventListener("change", (event) => {
    shopState.sort = event.target.value;
    shopState.page = 1;
    refresh();
  });
  document.querySelector(".clear-filters").addEventListener("click", () => {
    shopState.category = [];
    shopState.min = 0;
    shopState.max = 250000;
    shopState.query = "";
    shopState.sort = "featured";
    shopState.page = 1;
    document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
      checkbox.checked = false;
    });
    minInput.value = "0";
    maxInput.value = "250000";
    range.value = "250000";
    document.querySelector("[data-sort]").value = "featured";
    const input = document.querySelector('.search-form input[name="q"]');
    if (input) input.value = "";
    refresh();
  });
  document.querySelector(".pagination").addEventListener("click", (event) => {
    const button = event.target.closest("[data-page-number]");
    if (!button || button.disabled) return;
    shopState.page = Number(button.dataset.pageNumber);
    renderShop();
    document
      .querySelector(".shop-products")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  });
  document
    .querySelector(".mobile-filter-toggle")
    .addEventListener("click", () => {
      const panel = document.querySelector(".filters-panel");
      const open = panel.classList.toggle("mobile-open");
      document.querySelector(".mobile-filter-toggle").textContent = open
        ? "Filters −"
        : "Filters +";
    });
  refresh();
}

// Home page hero slides used by the rotating banner on the landing page.
const slides = [
  {
    title: "Latest<br><span>Gadget.</span>",
    description:
      "Thoughtful technology. Beautifully made. Meet the little things that make a big difference.",
    image: "assets/iPhone 17 Pro Max.jpg",
  },
  {
    title: "Made to<br><span>Move.</span>",
    description:
      "Find your everyday phone among our thoughtfully selected devices.",
    image: "assets/Xiaomi Poco F9.jpg",
  },
  {
    title: "Power<br><span>Play.</span>",
    description:
      "Bring your next build to life with powerful graphics hardware.",
    image: "assets/Arus GeForce RTX 5090.jpg",
  },
];
// Builds the featured products block and configures the hero carousel behavior.
function initHome() {
  const featured = document.querySelector('[data-products="featured"]');
  if (featured)
    featured.innerHTML = products.slice(0, 4).map(productCard).join("");
  const title = document.querySelector("#hero-title");
  if (!title) return;
  let current = 0;
  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    title.innerHTML = slides[current].title;
    document.querySelector("#hero-description").textContent =
      slides[current].description;
    document.querySelector("#hero-image").style.backgroundImage =
      `url("${slides[current].image}")`;
    document.querySelector(".slide-count").innerHTML =
      `${String(current + 1).padStart(2, "0")} <i>/</i> 03`;
    document
      .querySelectorAll("[data-slide-to]")
      .forEach((dot, dotIndex) =>
        dot.classList.toggle("selected", dotIndex === current),
      );
  };
  document
    .querySelector('[data-slide="prev"]')
    .addEventListener("click", () => showSlide(current - 1));
  document
    .querySelector('[data-slide="next"]')
    .addEventListener("click", () => showSlide(current + 1));
  document
    .querySelectorAll("[data-slide-to]")
    .forEach((dot) =>
      dot.addEventListener("click", () =>
        showSlide(Number(dot.dataset.slideTo)),
      ),
    );
}

// Adds shared site interactions: theme toggle, mobile menu, quick-view modal, and cart updates.
function initGlobalInteractions() {
  document.querySelectorAll(".theme-toggle").forEach((button) =>
    button.addEventListener("click", () => {
      const dark = document.documentElement.classList.toggle("dark");
      try {
        localStorage.setItem("avine-theme", dark ? "dark" : "light");
      } catch (error) {
        console.error("Unable to save the selected theme.", error);
        showToast("Your browser couldn't save the theme preference.");
      }
    }),
  );
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle)
    menuToggle.addEventListener("click", () => {
      const open = document
        .querySelector(".site-header")
        .classList.toggle("menu-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  const modal = document.querySelector("#quick-view-modal");
  let selectedProduct = null;
  if (modal && !modal.querySelector("[data-modal-buy-now]")) {
    const actions = document.createElement("div");
    actions.className = "quick-modal-actions";
    const addButton = modal.querySelector(".quick-add");
    const exploreLink = modal.querySelector(".quick-shop-link");
    addButton.parentNode.insertBefore(actions, addButton);
    actions.append(addButton);
    const buyButton = document.createElement("button");
    buyButton.type = "button";
    buyButton.className = "button quick-modal-buy";
    buyButton.dataset.modalBuyNow = "";
    buyButton.textContent = "Buy now";
    actions.append(buyButton);
    if (exploreLink) exploreLink.remove();
  }
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };
  document.addEventListener("click", (event) => {
    const imageTrigger = event.target.closest("[data-product-image]");
    if (imageTrigger && modal) {
      selectedProduct = products.find(
        (product) => product.id === imageTrigger.dataset.productImage,
      );
      if (!selectedProduct) return;
      modal.querySelector(".quick-image").style.backgroundImage =
        `url("${selectedProduct.image}")`;
      modal.querySelector("#quick-title").textContent = selectedProduct.name;
      modal.querySelector(".quick-price").textContent = formatPrice(
        selectedProduct.price,
      );
      modal.querySelector(".quick-description").textContent =
        selectedProduct.description;
      modal.querySelector("[data-quantity-value]").textContent = "1";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    }
    const addButton = event.target.closest("[data-add-cart], [data-buy-now]");
    if (addButton) {
      if (addButton.dataset.buyNow) buyNow(addButton.dataset.buyNow);
      else addToCart(addButton.dataset.addCart);
    }
    if (event.target.closest("[data-close-modal]") || event.target === modal)
      closeModal();
    const quantityButton = event.target.closest("[data-quantity]");
    if (quantityButton) {
      const value = modal.querySelector("[data-quantity-value]");
      const next =
        Number(value.textContent) +
        (quantityButton.dataset.quantity === "plus" ? 1 : -1);
      value.textContent = Math.max(1, Math.min(99, next));
    }
    if (event.target.closest(".quick-add") && selectedProduct) {
      addToCart(
        selectedProduct.id,
        Number(modal.querySelector("[data-quantity-value]").textContent),
      );
      if (isLoggedIn()) closeModal();
    }
    if (event.target.closest("[data-modal-buy-now]") && selectedProduct) {
      buyNow(
        selectedProduct.id,
        Number(modal.querySelector("[data-quantity-value]").textContent),
      );
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && modal.classList.contains("open"))
      closeModal();
  });
  document.querySelectorAll(".newsletter-form").forEach((form) =>
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.reset();
      showToast("You're on the list. Look out for a little good news.");
    }),
  );
  updateNavbar();
}

// Handles the contact form submission UX and success state messaging.
function initContact() {
  const form = document.querySelector(".contact-form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    form.reset();
    const success = form.querySelector(".form-success");
    success.classList.add("show");
    showToast("Submitted successfully! We will get back to you soon.");
    window.setTimeout(() => success.classList.remove("show"), 5000);
  });
}

// Handles the demo auth flow, validation, and redirect behavior for sign-in and sign-up forms.
function initAuth() {
  const forms = document.querySelectorAll(".auth-form");
  if (!forms.length) return;
  const params = new URLSearchParams(window.location.search);
  if (isLoggedIn()) {
    window.location.replace(
      safeLocalRedirect(params.get("redirect")) || "account.html",
    );
    return;
  }
  const switchForm = (name) => {
    forms.forEach((form) =>
      form.classList.toggle("active", form.classList.contains(`${name}-form`)),
    );
    const headerPrompt = document.querySelector(".auth-header-prompt");
    const headerSwitch = document.querySelector(".auth-header-switch");
    if (headerPrompt && headerSwitch) {
      headerPrompt.textContent =
        name === "signup" ? "Already have an account?" : "New around here?";
      headerSwitch.textContent =
        name === "signup" ? "Log in" : "Create an account ↗";
      headerSwitch.dataset.authSwitch = name === "signup" ? "login" : "signup";
    }
  };
  document
    .querySelectorAll("[data-auth-switch]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        switchForm(button.dataset.authSwitch),
      ),
    );
  document.querySelectorAll("[data-password-toggle]").forEach((button) =>
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector(
        'input[type="password"], input[type="text"]',
      );
      if (!input) return;
      const visible = input.type === "password";
      input.type = visible ? "text" : "password";
      button.textContent = visible ? "Hide" : "Show";
      button.setAttribute(
        "aria-label",
        `${visible ? "Hide" : "Show"} password`,
      );
      button.setAttribute("aria-pressed", String(visible));
    }),
  );
  if (params.get("mode") === "signup") switchForm("signup");
  const forgot = document.querySelector("[data-forgot-password]");
  if (forgot)
    forgot.addEventListener("click", (event) => {
      event.preventDefault();
      showToast("Password reset help: email hello@avine.ph.");
    });
  const googleButton = document.querySelector(".google-button");
  if (googleButton)
    googleButton.addEventListener("click", () =>
      showToast("Google sign-in isn't connected in this demo."),
    );
  document.querySelectorAll("[data-auth-form]").forEach((form) =>
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const submitButton = form.querySelector('[type="submit"]');
      if (submitButton.disabled) return;
      submitButton.disabled = true;
      const error = form.querySelector(".auth-error");
      error.classList.remove("show");
      const data = new FormData(form);
      const email = normalizeEmail(String(data.get("email") || ""));
      const password = String(data.get("password") || "");
      const accounts = getAccounts();
      try {
        if (form.dataset.authForm === "signup") {
          const firstName = String(data.get("firstName") || "").trim();
          const lastName = String(data.get("lastName") || "").trim();
          if (!firstName || !lastName)
            throw new Error("Enter your first and last name.");
          if (password !== data.get("confirmPassword"))
            throw new Error(
              "Those passwords don't match. Give it another try.",
            );
          if (accounts.some((account) => account.email === email))
            throw new Error(
              "An account with that email already exists. Log in instead.",
            );
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const saltHex = Array.from(salt, (byte) =>
            byte.toString(16).padStart(2, "0"),
          ).join("");
          const passwordHash = await hashPassword(password, salt);
          const created = {
            firstName,
            lastName,
            email,
            passwordSalt: saltHex,
            passwordHash,
          };
          if (!writeStorage(accountKey, [...accounts, created]))
            throw new Error("We couldn't save your account in this browser.");
          if (!writeStorage("avine-session", { email }))
            throw new Error(
              "Your account was created, but we couldn't start your session.",
            );
          mergeGuestCart();
          showToast("Your account is ready. Welcome to Avine!");
        } else {
          const account = accounts.find((item) => item.email === email);
          if (!account)
            throw new Error(
              "We couldn't find an account for that email. Check it or sign up.",
            );
          const salt = Uint8Array.from(
            account.passwordSalt.match(/.{2}/g) || [],
            (byte) => parseInt(byte, 16),
          );
          const passwordHash = await hashPassword(password, salt);
          if (passwordHash !== account.passwordHash)
            throw new Error("That password doesn't match this account.");
          if (!writeStorage("avine-session", { email }))
            throw new Error(
              "We couldn't start your session. Please try again.",
            );
          mergeGuestCart();
          showToast("You're signed in. Welcome back!");
        }
      } catch (caught) {
        error.textContent =
          caught instanceof Error
            ? caught.message
            : "We couldn't complete that request. Please try again.";
        error.classList.add("show");
        submitButton.disabled = false;
        return;
      }
      window.setTimeout(() => {
        const redirect = params.get("redirect");
        window.location.href = safeLocalRedirect(redirect) || "index.html";
      }, 900);
    }),
  );
}

async function hashPassword(password, salt) {
  if (!crypto.subtle)
    throw new Error(
      "Secure password storage isn't available in this browser. Try a modern browser over HTTPS.",
    );
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const digest = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    material,
    256,
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function safeLocalRedirect(value) {
  if (!value) return null;
  try {
    const target = new URL(value, window.location.href);
    if (
      target.origin !== window.location.origin ||
      target.pathname.endsWith("/auth.html")
    )
      return null;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch (error) {
    console.error("Invalid post-login redirect.", error);
    return null;
  }
}

function initProfile() {
  const form = document.querySelector("[data-profile-form]");
  if (!form) return;
  const user = getCurrentUser();
  if (!user) {
    requireLogin("account.html");
    return;
  }
  form.elements.firstName.value = user.firstName;
  form.elements.lastName.value = user.lastName;
  form.elements.email.value = user.email;
  const cartCount = document.querySelector("[data-profile-cart-count]");
  if (cartCount)
    cartCount.textContent = String(
      getCart().reduce((sum, item) => sum + item.quantity, 0),
    );
  const orderList = document.querySelector("[data-order-list]");
  const orders = readStorage(
    `avine-orders:${encodeURIComponent(user.email)}`,
    [],
  );
  if (orderList) {
    orderList.innerHTML =
      Array.isArray(orders) && orders.length
        ? orders
            .map(
              (order) =>
                `<article class="order-row"><div><strong>Order ${order.id}</strong><span>${new Date(order.createdAt).toLocaleDateString()}</span></div><strong>${formatPrice(order.total)}</strong></article>`,
            )
            .join("")
        : '<p class="muted-copy">Your confirmed orders will appear here.</p>';
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submitButton = form.querySelector('[type="submit"]');
    if (submitButton.disabled) return;
    submitButton.disabled = true;
    const accounts = getAccounts();
    const index = accounts.findIndex((account) => account.email === user.email);
    if (index < 0) {
      showToast("We couldn't find your account details. Please log in again.");
      return;
    }
    accounts[index] = {
      ...accounts[index],
      firstName: form.elements.firstName.value.trim(),
      lastName: form.elements.lastName.value.trim(),
    };
    if (!writeStorage(accountKey, accounts)) return;
    showToast("Your profile has been updated.");
  });
  document
    .querySelectorAll("[data-logout]")
    .forEach((button) => button.addEventListener("click", logoutUser));
}

function initCheckout() {
  const form = document.querySelector("[data-checkout-form]");
  if (!form) return;
  const user = getCurrentUser();
  if (!user) {
    requireLogin(`${window.location.pathname}${window.location.search}`);
    return;
  }
  const params = new URLSearchParams(window.location.search);
  const isBuyNow = params.get("mode") === "buy-now";
  let items;
  if (isBuyNow) {
    const product = products.find(
      (item) => item.id === params.get("productId"),
    );
    const quantity = Number(params.get("quantity") || 1);
    if (
      !product ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      window.location.href = "shop.html";
      return;
    }
    items = [{ ...product, quantity }];
  } else {
    items = getCart();
    if (!items.length) {
      window.location.href = "cart.html";
      return;
    }
  }
  const summary = document.querySelector("[data-checkout-summary]");
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  summary.innerHTML =
    items
      .map(
        (item) =>
          `<div class="checkout-item"><span>${item.name} × ${item.quantity}</span><strong>${formatPrice(item.price * item.quantity)}</strong></div>`,
      )
      .join("") +
    `<div class="checkout-total"><span>Total</span><strong>${formatPrice(total)}</strong></div>`;
  form.elements.email.value = user.email;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const order = {
      id: `AV-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: items.map(({ id, name, price, image, quantity }) => ({
        id,
        name,
        price,
        image,
        quantity,
      })),
      total,
      shipping: {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        address: form.elements.address.value.trim(),
        city: form.elements.city.value.trim(),
        postalCode: form.elements.postalCode.value.trim(),
      },
    };
    const ordersKey = `avine-orders:${encodeURIComponent(user.email)}`;
    const orders = readStorage(ordersKey, []);
    if (
      !writeStorage(ordersKey, [
        ...(Array.isArray(orders) ? orders : []),
        order,
      ]) ||
      (!isBuyNow && !writeStorage(cartStorageKey(), []))
    ) {
      submitButton.disabled = false;
      return;
    }
    updateCartCount();
    document.querySelector("[data-checkout-panel]").hidden = true;
    const success = document.querySelector("[data-order-success]");
    success.hidden = false;
    success.querySelector("[data-order-number]").textContent = order.id;
    showToast("Order confirmed. Thank you!");
  });
}

// Initializes all page-specific behavior once the DOM is ready.
document.addEventListener("DOMContentLoaded", () => {
  initGlobalInteractions();
  initHome();
  initShop();
  initContact();
  initAuth();
  initCart();
  initProfile();
  initCheckout();
});

window.addEventListener("pageshow", () => {
  updateNavbar();
  if (!isLoggedIn()) {
    if (document.querySelector("[data-cart-items]")) requireLogin("cart.html");
    else if (document.querySelector("[data-checkout-form]"))
      requireLogin(`${window.location.pathname}${window.location.search}`);
    else if (document.querySelector("[data-profile-form]"))
      requireLogin("account.html");
  }
});

window.addEventListener("storage", (event) => {
  if (["avine-session", accountKey].includes(event.key)) {
    updateNavbar();
    if (!isLoggedIn()) {
      if (document.querySelector("[data-cart-items]"))
        requireLogin("cart.html");
      else if (document.querySelector("[data-checkout-form]"))
        requireLogin(`${window.location.pathname}${window.location.search}`);
      else if (document.querySelector("[data-profile-form]"))
        requireLogin("account.html");
    }
  }
  if (event.key === cartStorageKey()) {
    updateCartCount();
    renderCart();
  }
});
