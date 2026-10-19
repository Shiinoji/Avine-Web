// Shop-page behavior: catalog filtering, sorting, pagination, and mobile filters.
const shopState = {
  category: [],
  min: 0,
  max: 250000,
  query: "",
  sort: "featured",
  page: 1,
  perPage: 6,
};

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

function initShop() {
  const grid = document.querySelector('[data-products="shop"]');
  if (!grid) return;
  const params = new URLSearchParams(window.location.search);
  shopState.query = params.get("q") || "";
  const initialCategory = params.get("category");
  if (
    initialCategory &&
    ["Accessories", "Graphics Cards", "Laptops", "Monitors", "Phones"].includes(
      initialCategory,
    )
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

document.addEventListener("DOMContentLoaded", initShop);
