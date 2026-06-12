const menuData = {
  Breakfast: [
    ["Media/breakfast.png", "Stonehaven Breakfast", "Eggs, bacon, sausage, waffle, fruit, juice, tea or coffee", "Daily"],
    ["Media/morebreakfast2.png", "Waffle Stack", "Waffles, savoury topping, house sauce, fresh garnish", "Morning"],
    ["Media/pancake.png", "Pancake Plate", "Pancakes with berries, chocolate crumble, cream, and syrup", "Sweet"],
    ["Media/enchancedBreakfast.jpeg", "Coffee Breakfast", "Roasted plantain, sausage, eggs, bacon, milk, and brewed coffee", "Classic"]
  ],
  Mains: [
    ["Media/Lunch .png", "Slow Braised Beef", "Mash, greens, rich pan sauce, and crisp garnish", "Lunch"],
    ["Media/stake.png", "Steak Pasta", "Charred steak, penne, peas, herb butter, and cream sauce", "Dinner"],
    ["Media/More_meat.png", "Stonehaven Meat Plate", "Grilled cuts, vegetables, house sauce, and crisp potatoes", "Grill"],
    ["Media/Chicken.png", "Chicken & Plantain", "Sauced chicken, greens, plantain, cucumber, and garden garnish", "House"]
  ],
  Drinks: [
    ["Media/Fresh_juices.png", "Fresh Juice Duo", "Bright seasonal fruit juices served chilled", "Fresh"],
    ["Media/cocktail .png", "Berry Cocktail", "Red fruit, ice, mint, and a crisp finish", "Cocktail"],
    ["Media/orange cocktails.png", "Citrus Coupe", "Orange cocktail with a clean citrus edge", "Bar"],
    ["Media/wine.png", "Pineapple Cocktail", "A tropical glass with mint and pineapple", "Signature"]
  ],
  Desserts: [
    ["Media/Banana split.png", "Banana Split", "Ice cream, banana, fruit, chocolate, and playful toppings", "Dessert"],
    ["Media/RedCake.png", "Red Velvet Roll", "A vibrant cake plate made for sharing", "Cake"],
    ["Media/tiramusi.png", "Celebration Cake", "Soft, elegant cakes for sweet endings", "Bakery"],
    ["Media/treats.png", "Chocolate Plate", "Rich chocolate, cream, fruit, and crunch", "Treat"]
  ]
};

const heroSlides = document.querySelectorAll(".hero__slide");
if (heroSlides.length) {
  let activeSlide = 0;
  setInterval(() => {
    heroSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add("is-active");
  }, 5200);
}

const menuTabs = document.querySelector("[data-menu-tabs]");
const menuGrid = document.querySelector("[data-menu-grid]");

function renderMenu(category) {
  if (!menuGrid) return;
  menuGrid.innerHTML = "";
  menuData[category].forEach(([image, title, description, price]) => {
    const item = document.createElement("article");
    item.className = "menu-item";
    item.innerHTML = `
      <img src="${image}" alt="${title}">
      <div>
        <h3>${title}</h3>
        <p>${description}</p>
      </div>
      <span class="menu-item__price">${price}</span>
    `;
    menuGrid.appendChild(item);
  });
}

if (menuTabs) {
  Object.keys(menuData).forEach((category, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category;
    button.className = index === 0 ? "is-active" : "";
    button.addEventListener("click", () => {
      document.querySelectorAll(".menu-tabs button").forEach((tab) => tab.classList.remove("is-active"));
      button.classList.add("is-active");
      renderMenu(category);
    });
    menuTabs.appendChild(button);
  });
  renderMenu(Object.keys(menuData)[0]);
}

const panels = document.querySelectorAll("[data-panel]");
const backdrop = document.querySelector("[data-backdrop]");
const panelTriggers = document.querySelectorAll("[data-open-panel]");

function closePanels() {
  panels.forEach((panel) => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
  });
  panelTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
  if (backdrop) backdrop.classList.remove("is-visible");
  document.body.classList.remove("panel-open");
}

panelTriggers.forEach((button) => {
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    closePanels();
    const panel = document.querySelector(`[data-panel="${button.dataset.openPanel}"]`);
    if (!panel) return;
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
    if (backdrop) backdrop.classList.add("is-visible");
    document.body.classList.add("panel-open");
  });
});

document.querySelectorAll("[data-close-panel], .side-panel__nav a").forEach((item) => {
  item.addEventListener("click", closePanels);
});
if (backdrop) backdrop.addEventListener("click", closePanels);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanels();
});

document.querySelectorAll(".search-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = form.querySelector("input")?.value?.trim().toLowerCase();
    if (!term) return;
    const target = term.includes("gallery") ? "gallery.html" : term.includes("menu") || term.includes("food") ? "menu.html" : "index.html#reserve";
    window.location.href = target;
  });
});

document.querySelectorAll(".reservation-form").forEach((form) => {
  const note = form.querySelector("[data-form-note]");
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date();
    dateInput.min = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      if (note) note.textContent = "Please complete the required fields.";
      form.reportValidity();
      return;
    }
    if (note) note.textContent = "Thank you. The Stonehaven team will confirm your request shortly.";
    form.reset();
  });
});

// WhatsApp booking
function sendWhatsAppBooking() {
  const name = document.getElementById("wb-name")?.value.trim();
  const phone = document.getElementById("wb-phone")?.value.trim();
  const guests = document.getElementById("wb-guests")?.value;
  const date = document.getElementById("wb-date")?.value;
  const time = document.getElementById("wb-time")?.value;
  const message = document.getElementById("wb-message")?.value.trim();
  const note = document.getElementById("wb-note");

  if (!name || !phone || !guests || !date || !time) {
    if (note) note.textContent = "Please fill in all required fields before booking.";
    return;
  }

  // Format the date nicely
  const dateObj = new Date(date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const bookingMsg = [
    "Hello, I would like to book a table at Stonehaven.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Date: ${formattedDate}`,
    `Time: ${time}`,
    `Guests: ${guests}`,
    message ? `Message: ${message}` : "",
    "",
    "Thank you."
  ].filter(line => line !== undefined).join("\n");

  const encodedMsg = encodeURIComponent(bookingMsg);
  const whatsappNumber = "256709342064"; // Stonehaven WhatsApp number
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

  if (note) note.textContent = "Opening WhatsApp with your booking details...";
  window.open(whatsappURL, "_blank");
}

// Set min date on WhatsApp booking date input
(function() {
  const wbDate = document.getElementById("wb-date");
  if (wbDate) {
    const today = new Date();
    wbDate.min = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");
  }
})();

const header = document.querySelector("[data-header]");
const toTop = document.querySelector("[data-to-top]");
window.addEventListener("scroll", () => {
  const compact = window.scrollY > 90;
  if (header) header.classList.toggle("is-compact", compact);
  if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 500);
}, { passive: true });

if (toTop) {
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -50px 0px" });
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const filterRoot = document.querySelector("[data-gallery-filter]");
const galleryGrid = document.querySelector("[data-gallery-grid]");
if (filterRoot && galleryGrid) {
  filterRoot.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      filterRoot.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      button.classList.add("is-active");
      const filter = button.dataset.filter;
      galleryGrid.querySelectorAll("button").forEach((item) => {
        const categories = item.dataset.category || "";
        item.classList.toggle("is-hidden", filter !== "all" && !categories.includes(filter));
      });
    });
  });
}

const lightbox = document.querySelector("[data-lightbox]");
if (lightbox && galleryGrid) {
  const lightboxImage = lightbox.querySelector("[data-lightbox-image]");
  galleryGrid.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("panel-open");
    });
  });
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("panel-open");
  }
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePanels();
      closeLightbox();
    }
  });
}
