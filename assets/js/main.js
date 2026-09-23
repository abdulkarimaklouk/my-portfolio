const CONTACT = {
  email: "abdulkarim.aklouk@gmail.com",
  github: "https://github.com/abdulkarimaklouk",
  phoneDisplay: "01158250466",
  phoneE164: "+201158250466",
};

const gmailComposeUrl = (subject = "", body = "") => {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT.email,
  });
  if (subject) params.set("su", subject);
  if (body) params.set("body", body);
  return `https://mail.google.com/mail/?${params.toString()}`;
};

const footerYear = document.getElementById("footer-year");
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  if (window.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);

/*=============== SERVICES MODAL ===============*/
const modalViews = document.querySelectorAll(".services__modal");
const modalBtns = document.querySelectorAll(".services__button");
const modalCloses = document.querySelectorAll(".services__modal-close");

function openModal(index) {
  if (!modalViews[index]) return;
  modalViews[index].classList.add("active-modal");
  document.body.classList.add("modal-open");
}

function closeAllModals() {
  modalViews.forEach((modal) => modal.classList.remove("active-modal"));
  document.body.classList.remove("modal-open");
}

modalBtns.forEach((button, index) => {
  button.addEventListener("click", () => openModal(index));
});

modalCloses.forEach((button) => {
  button.addEventListener("click", closeAllModals);
});

modalViews.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeAllModals();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAllModals();
});

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
if (typeof mixitup !== "undefined" && document.querySelector(".work__container")) {
  mixitup(".work__container", {
    selectors: {
      target: ".work__card",
    },
    animation: {
      duration: 300,
    },
  });
}

const workLinks = document.querySelectorAll(".work__item");

function activeWork(workLink) {
  workLinks.forEach((link) => link.classList.remove("active-work"));
  workLink.classList.add("active-work");
}

workLinks.forEach((link) => {
  link.addEventListener("click", () => activeWork(link));
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll("section[id]");

function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach((current) => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 58;
    const sectionId = current.getAttribute("id");
    const navLink = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!navLink) return;

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLink.classList.add("active-link");
    } else {
      navLink.classList.remove("active-link");
    }
  });
}
window.addEventListener("scroll", scrollActive);

/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById("theme-button");
const themeIcon = themeButton ? themeButton.querySelector("i") : null;
const lightTheme = "light-theme";

const getCurrentTheme = () =>
  document.body.classList.contains(lightTheme) ? "light" : "dark";

const applyThemeIcon = (theme) => {
  if (!themeIcon) return;
  themeIcon.classList.remove("bx-moon", "bx-sun");
  themeIcon.classList.add(theme === "light" ? "bx-sun" : "bx-moon");
};

const storedTheme = localStorage.getItem("selected-theme");
if (storedTheme === "light" || storedTheme === "dark") {
  document.body.classList.toggle(lightTheme, storedTheme === "light");
  applyThemeIcon(storedTheme);
} else {
  applyThemeIcon(getCurrentTheme());
}

if (themeButton) {
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(lightTheme);
    const theme = getCurrentTheme();
    applyThemeIcon(theme);
    localStorage.setItem("selected-theme", theme);
  });
}

/*=============== CONTACT FORM (Gmail compose) ===============*/
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-mail").value.trim();
    const message = document.getElementById("contact-message").value.trim();
    window.open(
      gmailComposeUrl(`Portfolio message from ${name}`, `${message}\n\n— ${name} (${email})`),
      "_blank",
      "noopener,noreferrer"
    );
  });
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 400,
    reset: true,
  });

  sr.reveal(`.nav__menu`, {
    delay: 100,
    scale: 0.1,
    origin: "bottom",
    distance: "300px",
  });

  sr.reveal(`.home__data`);
  sr.reveal(`.home__social, .home__scroll`, { delay: 100, origin: "bottom" });
  sr.reveal(`.about__data, .about__description, .about__button-contact`, {
    delay: 100,
    scale: 0.9,
    origin: "bottom",
    distance: "30px",
  });
  sr.reveal(`.skills__content`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });
  sr.reveal(`.services__title, .services__button`, {
    delay: 100,
    scale: 0.9,
    origin: "top",
    distance: "30px",
  });
  sr.reveal(`.work__card`, { delay: 100, scale: 0.9, origin: "bottom", distance: "30px" });
  sr.reveal(`.experience__card, .focus__card, .focus__intro`, {
    delay: 100,
    scale: 0.9,
    origin: "bottom",
    distance: "30px",
  });
  sr.reveal(`.contact__info, .contact__title-info`, {
    delay: 100,
    scale: 0.9,
    origin: "left",
    distance: "30px",
  });
  sr.reveal(`.contact__form, .contact__title-form`, {
    delay: 100,
    scale: 0.9,
    origin: "right",
    distance: "30px",
  });
  sr.reveal(`.footer, .footer__container`, {
    delay: 100,
    scale: 0.9,
    origin: "bottom",
    distance: "30px",
  });
}
