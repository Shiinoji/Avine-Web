// Checkout-page behavior: validate the cart and record a confirmed demo order.
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
    )
      return;
    updateCartCount();
    document.querySelector("[data-checkout-panel]").hidden = true;
    const success = document.querySelector("[data-order-success]");
    success.hidden = false;
    success.querySelector("[data-order-number]").textContent = order.id;
    showToast("Order confirmed. Thank you!");
  });
}

document.addEventListener("DOMContentLoaded", initCheckout);
