// Avine storefront data and client-side interactions.
// Shared catalog, storage, account, cart, and site-wide UI helpers for each page script.

const products = [
  {
    id: "phone-poco-f9",
    name: "Xiaomi POCO F7",
    category: "Phones",
    price: 39990,
    image: "assets/Xiaomi Poco F9.jpg",
    description:
      "Snapdragon 8s Gen 4 processor · 6.83-inch 1.5K AMOLED display with a 120Hz refresh rate · 50MP Sony IMX882 main camera · 6,500mAh battery with 90W HyperCharge · 12GB RAM with 256GB or 512GB storage options.",
  },
  {
    id: "phone-samsung-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    category: "Phones",
    price: 84990,
    image: "assets/Samsung Galaxy S24 Ultra.jpg",
    description:
      "6.8-inch QHD+ Dynamic AMOLED 2X display with a 120Hz refresh rate · Snapdragon 8 Gen 3 for Galaxy · 200MP main camera with a quad-camera system · 5,000mAh battery · Titanium frame with IP68 water and dust resistance.",
  },
  {
    id: "phone-iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    category: "Phones",
    price: 86990,
    image: "assets/iPhone 17 Pro Max.jpg",
    description:
      "6.9-inch Super Retina XDR display with ProMotion · A19 Pro chip · 48MP Pro Fusion camera system · up to 8x optical-quality zoom · Ceramic Shield 2 front cover.",
  },
  {
    id: "phone-iphone-15-pro",
    name: "iPhone 15 Pro",
    category: "Phones",
    price: 69990,
    image: "assets/iPhone 15 Pro.jpg",
    description:
      "6.1-inch Super Retina XDR display with ProMotion · A17 Pro chip · 48MP Main camera with a Pro camera system · lightweight titanium design · USB-C connector.",
  },
  {
    id: "gpu-rtx-5090",
    name: "GeForce RTX 5090",
    category: "Graphics Cards",
    price: 189990,
    image: "assets/Arus GeForce RTX 5090.jpg",
    description:
      "NVIDIA Blackwell architecture · 21,760 CUDA cores · 32GB GDDR7 memory · 512-bit memory interface · DLSS 4 support. AORUS graphics card.",
  },
  {
    id: "gpu-rtx-5060",
    name: "Gigabyte GeForce RTX 5060",
    category: "Graphics Cards",
    price: 159990,
    image: "assets/Gigabyte RTX 5060.jpg",
    description:
      "NVIDIA Blackwell architecture · 4,608 CUDA cores · 16GB GDDR7 memory · 128-bit memory interface · WINDFORCE dual-fan cooling · DLSS 4 support.",
  },
  {
    id: "aula-sc900-pro-mouse",
    name: "AULA SC900 Pro Mouse",
    category: "Accessories",
    price: 699,
    image: "assets/AULA SC900 Pro Mouse.jpg",
    description:
      "PAW3395 optical sensor · Adjustable sensitivity up to 26,000 DPI · Dual 8,000Hz polling · TTC optical switches · Hot-swappable battery.",
  },
  {
    id: "Benq-Led-Monitor",
    name: "BenQ GW2490T Monitor",
    category: "Monitors",
    price: 13000,
    image: "assets/Benq LED Monitor.jpg",
    description:
      "23.8-inch Full HD IPS display · 100Hz refresh rate · BenQ Eye-Care technologies · Ergonomic stand for flexible positioning.",
  },
  {
    id: "monitor-n-vision",
    name: "N-VISION Monitor",
    category: "Monitors",
    price: 5990,
    image: "assets/N-VISION Monitor.jpg",
    description:
      "N-VISION desktop monitor with a slim, widescreen design for everyday work, study, and entertainment.",
  },
  {
    id: "laptop-lenovo-loq",
    name: "Lenovo LOQ 15IRX9 (83DV00E8PH)",
    category: "Laptops",
    price: 65995,
    tag: "₱65,995",
    image: "assets/Lenovo LOQ.jpg",
    description:
      "LOQ 15IRX9 (83DV00E8PH) · Intel Core i5 processor · NVIDIA GeForce RTX 4050 graphics · Luna Grey. Listed at ₱65,995.",
  },
  {
    id: "laptop-hp-victus-15",
    name: "HP Victus Gaming Laptop 15-fb3269AX",
    category: "Laptops",
    price: 64999,
    tag: "₱64,999",
    image: "assets/HP VICTUS 15.jpg",
    description:
      "15-fb3269AX · AMD Ryzen 7 7445HS processor · 8GB DDR5-5600 memory · 512GB PCIe Gen4 NVMe SSD · NVIDIA GeForce RTX 3050 Laptop GPU with 6GB GDDR6 · 15.6-inch FHD 144Hz IPS display · Windows 11 Home Single Language · Backlit keyboard and HP Wide Vision 720p camera. Includes an HP slingbag and Microsoft Office Home and Student. Seven-day replacement for factory defects and a two-year manufacturer warranty. ₱64,999, reduced from ₱74,999.",
  },
  {
    id: "keyboard-ajazz-ak860",
    name: "Ajazz AK860 Mechanical Keyboard",
    category: "Accessories",
    price: 3290,
    image: "assets/Ajazz AK860 Mechanical Keyboard.jpg",
    description:
      "Ajazz AK860 mechanical keyboard with a compact key layout and rotary control, shown in a clean gray-and-white finish.",
  },
  {
  id: "headphones-encalife-over-ear",
  name: "Encalife Bluetooth Headphones",
  category: "Accessories",
  price: 1255,
  image: "assets/encalife headphones.jpg",
  description: "Over-ear Bluetooth headphones with deep bass, microphone included, designed for gaming and everyday use.",
},
{
  id: "laptop-ryzen5-3500u-15-6",
  name: "DREAMFYRE Laptop Ryzen 5 3500U",
  category: "Laptops",
  price: 36873,
  image: "assets/dreamfyre laptop.jpg",
  description: "15.6-inch laptop with AMD Ryzen 5 3500U quad-core processor, 16GB DDR4 RAM, 512GB SSD, fingerprint reader, Full HD display, WiFi 2.45G, Bluetooth, HDMI port, and backlit keyboard.",
  },
{
    id: "keyboard-Logitech-G512",
    name: "Logitech G512 Carbon RGB Mechanical Gaming Keyboard ",
    category: "Accessories",
    price: 5600,
    image: "assets/Logitech G512.jpg",
    description:
      "G512 is a high-performance gaming keyboard featuring your choice of advanced Romer-G Tactile, Romer-G Linear and GX Blue mechanical switches.",
  },
  {
    id: "phone-Nothing-3A-pro",
    name: "Nothing Phone 3A Pro",
    category: "Phones",
    price: 20999,
    image: "assets/Nothing Phone 3A Pro.jpg",
    description:
      "Nothing Phone (3a) Pro Android smartphone. Announced Mar 2025. Features 6.77″ display, Snapdragon 7s Gen 3 chipset, 5000 mAh battery, 256 GB storage, 12 GB RAM, Panda Glass.",
  },
  {
    id: "laptop-lenovo-Legion-Pro-7i",
    name: "Lenovo Legion Pro 7i",
    category: "Laptops",
    price: 440713,
    image: "assets/Lenovo Legion Pro 7i.jpg",
    description:
      "Experience next-level gaming and productivity with Intel® Core™ Ultra processors. Enjoy ultra-smooth gameplay, seamless multitasking, and AI-accelerated creative tasks.",
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

function normalizeCart(items) {
  if (!Array.isArray(items)) return [];
  return items.reduce((cart, item) => {
    const product = item && products.find((entry) => entry.id === item.id);
    if (product && Number.isInteger(item.quantity) && item.quantity > 0) {
      cart.push({ ...product, quantity: item.quantity });
    }
    return cart;
  }, []);
}

function getCart() {
  return normalizeCart(readStorage(cartStorageKey(), []));
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
  const guestCart = normalizeCart(readStorage("avine-cart:guest", []));
  if (guestCart.length === 0) return;
  const userKey = cartStorageKey();
  const merged = normalizeCart(readStorage(userKey, []));
  guestCart.forEach((guestItem) => {
    const existing = merged.find((item) => item.id === guestItem.id);
    if (existing) existing.quantity += guestItem.quantity;
    else merged.push(guestItem);
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

function enforcePrivatePageAccess() {
  if (isLoggedIn()) return;
  if (document.querySelector("[data-cart-items]")) {
    requireLogin("cart.html");
  } else if (document.querySelector("[data-checkout-form]")) {
    requireLogin(`${window.location.pathname}${window.location.search}`);
  } else if (document.querySelector("[data-profile-form]")) {
    requireLogin("account.html");
  }
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

function initProductSearch() {
  document.querySelectorAll(".search-form").forEach((form, index) => {
    const input = form.querySelector('input[name="q"]');
    if (!input) return;

    const listId = `product-search-suggestions-${index}`;
    const list = document.createElement("div");
    list.className = "search-suggestions";
    list.id = listId;
    list.setAttribute("role", "listbox");
    list.hidden = true;
    form.append(list);

    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", listId);
    input.setAttribute("aria-expanded", "false");

    let activeIndex = -1;
    let matches = [];

    const closeSuggestions = () => {
      list.hidden = true;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
      activeIndex = -1;
    };

    const selectProduct = (product) => {
      const destination = new URL(form.action, window.location.href);
      destination.searchParams.set("q", product.name);
      window.location.href = destination.href;
    };

    const updateActiveOption = () => {
      const options = list.querySelectorAll('[role="option"]');
      options.forEach((option, optionIndex) => {
        option.setAttribute(
          "aria-selected",
          String(optionIndex === activeIndex),
        );
      });
      if (activeIndex >= 0) {
        input.setAttribute(
          "aria-activedescendant",
          `${listId}-option-${activeIndex}`,
        );
      } else {
        input.removeAttribute("aria-activedescendant");
      }
    };

    const renderSuggestions = () => {
      const query = input.value.trim().toLowerCase();
      activeIndex = -1;
      list.replaceChildren();
      if (!query) {
        closeSuggestions();
        return;
      }

      matches = products
        .filter((product) =>
          `${product.name} ${product.category} ${product.description}`
            .toLowerCase()
            .includes(query),
        )
        .slice(0, 5);
      if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.className = "search-suggestions-empty";
        empty.textContent = "No matching products";
        list.append(empty);
      } else {
        matches.forEach((product, productIndex) => {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "search-suggestion";
          option.id = `${listId}-option-${productIndex}`;
          option.dataset.productIndex = String(productIndex);
          option.setAttribute("role", "option");
          option.setAttribute("aria-selected", "false");

          const details = document.createElement("span");
          details.className = "search-suggestion-details";
          const name = document.createElement("strong");
          name.textContent = product.name;
          const category = document.createElement("small");
          category.textContent = product.category;
          details.append(name, category);

          const price = document.createElement("span");
          price.className = "search-suggestion-price";
          price.textContent = formatPrice(product.price);
          option.append(details, price);
          list.append(option);
        });
      }
      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
    };

    input.addEventListener("input", renderSuggestions);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeSuggestions();
      } else if (event.key === "ArrowDown" && !list.hidden && matches.length) {
        event.preventDefault();
        activeIndex = (activeIndex + 1) % matches.length;
        updateActiveOption();
      } else if (
        event.key === "ArrowUp" &&
        !list.hidden &&
        matches.length
      ) {
        event.preventDefault();
        activeIndex = (activeIndex - 1 + matches.length) % matches.length;
        updateActiveOption();
      } else if (event.key === "Enter" && activeIndex >= 0) {
        event.preventDefault();
        selectProduct(matches[activeIndex]);
      }
    });
    list.addEventListener("click", (event) => {
      const option = event.target.closest('[role="option"]');
      if (!option) return;
      const selectedIndex = Number(option.dataset.productIndex);
      const product = matches[selectedIndex];
      if (product) selectProduct(product);
    });
    document.addEventListener("click", (event) => {
      if (!form.contains(event.target)) closeSuggestions();
    });
  });
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

// Shared setup is loaded on every page; page-only behavior lives in js/pages/.
document.addEventListener("DOMContentLoaded", () => {
  initProductSearch();
  initGlobalInteractions();
});

window.addEventListener("pageshow", () => {
  updateNavbar();
  enforcePrivatePageAccess();
});

window.addEventListener("storage", (event) => {
  if (["avine-session", accountKey].includes(event.key)) {
    updateNavbar();
    enforcePrivatePageAccess();
  }
  if (event.key === cartStorageKey()) {
    updateCartCount();
    if (typeof renderCart === "function") renderCart();
  }
});
