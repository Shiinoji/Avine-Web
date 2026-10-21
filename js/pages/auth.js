/*
 * AVINE E-Commerce Website
 * Developed by: Avegail Golpe, Neil Peladra, Vince Tipones
 * IT ELEC 3 - Web Systems and Technologies
 *
 * This JavaScript file is part of the AVINE academic project.
 * External libraries and resources belong to their respective owners.
 */

// Authentication-page behavior: sign-in, sign-up, validation, and redirects.
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

// Derives a salted PBKDF2 hash before a demo account is stored in local storage.
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

// Allows only same-origin redirects and prevents redirecting back to the auth page.
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

document.addEventListener("DOMContentLoaded", initAuth);
