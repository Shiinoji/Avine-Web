/*
 * AVINE E-Commerce Website
 * Developed by: Avegail Golpe, Neil Peladra, Vince Tipones
 * IT ELEC 3 - Web Systems and Technologies
 *
 * This JavaScript file is part of the AVINE academic project.
 * External libraries and resources belong to their respective owners.
 */

// Contact-page behavior: validate the form and show its confirmation state.
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

document.addEventListener("DOMContentLoaded", initContact);
