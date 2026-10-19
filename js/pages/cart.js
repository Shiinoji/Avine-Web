// Cart-page behavior: render account cart items and handle quantity changes.
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

document.addEventListener("DOMContentLoaded", initCart);
