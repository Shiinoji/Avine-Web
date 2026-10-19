// Home-page behavior: featured products and the hero carousel.
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

document.addEventListener("DOMContentLoaded", initHome);
