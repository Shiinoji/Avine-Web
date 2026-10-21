/*
 * AVINE E-Commerce Website
 * Developed by: Avegail Golpe, Neil Peladra, Vince Tipones
 * IT ELEC 3 - Web Systems and Technologies
 *
 * This JavaScript file is part of the AVINE academic project.
 * External libraries and resources belong to their respective owners.
 */

// Account-page behavior: populate profile details, order history, and save edits.
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

document.addEventListener("DOMContentLoaded", initProfile);
