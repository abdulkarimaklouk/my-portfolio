(function () {
  "use strict";

  document.documentElement.classList.add("js-ready");

  const CONTACT = {
    email: "abdulkarim.aklouk@gmail.com",
  };

  /* =============== DYNAMIC FOOTER YEAR =============== */
  const footerYear = document.getElementById("footer-year");
  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }

  /* =============== THEME TOGGLE (Safe localStorage) =============== */
  const themeButton = document.getElementById("theme-button");
  const metaThemeColor = document.getElementById("meta-theme-color");

  function syncThemeUI(isLight) {
    if (themeButton) {
      themeButton.setAttribute("aria-pressed", String(isLight));
      themeButton.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    }
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isLight ? "#F4EDE0" : "#0B132B");
    }
  }

  syncThemeUI(document.documentElement.classList.contains("light-theme"));

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const isLight = document.documentElement.classList.toggle("light-theme");
      syncThemeUI(isLight);
      try {
        localStorage.setItem("portfolio-proto-theme", isLight ? "light" : "dark");
      } catch (err) {
        // Ignore storage restrictions
      }
    });
  }

  /* =============== SCROLL HEADER & THROTTLED SCROLL-SPY =============== */
  const header = document.getElementById("header");
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navLinks = Array.from(document.querySelectorAll(".nav__menu a[href^='#']"));

  // Map sections without dedicated dock icons (#services -> #skills, #focus -> #experience)
  const dockAnchorFallback = {
    services: "skills",
    focus: "experience",
  };

  let scrollTicking = false;

  function updateScrollState() {
    scrollTicking = false;

    if (header) {
      header.classList.toggle("scroll-header", window.scrollY > 32);
    }

    const scrollProbe = window.scrollY + window.innerHeight * 0.35;
    let activeId = sections.length ? sections[0].id : "";

    for (const section of sections) {
      if (section.offsetTop <= scrollProbe) {
        activeId = section.id;
      }
    }

    const mappedId = dockAnchorFallback[activeId] || activeId;

    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href").slice(1);
      const isActive = targetId === mappedId;
      link.classList.toggle("active-link", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScrollState);
      }
    },
    { passive: true }
  );
  updateScrollState();

  /* =============== SERVICE MODALS (Accessible + Focus Restoration) =============== */
  const modalTriggers = Array.from(document.querySelectorAll("[data-modal-target]"));
  const modals = Array.from(document.querySelectorAll(".services__modal"));
  const landmarkRegions = [
    document.getElementById("header"),
    document.getElementById("main"),
    document.getElementById("footer"),
  ].filter(Boolean);

  let activeModal = null;
  let activeTrigger = null;

  function setBackgroundInert(isInert) {
    landmarkRegions.forEach((el) => {
      if (isInert) {
        el.setAttribute("inert", "");
        el.setAttribute("aria-hidden", "true");
      } else {
        el.removeAttribute("inert");
        el.removeAttribute("aria-hidden");
      }
    });
  }

  function getFocusableElements(container) {
    return Array.from(
      container.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function openModal(modal, trigger) {
    if (!modal) return;
    activeModal = modal;
    activeTrigger = trigger || null;
    if (activeTrigger) {
      activeTrigger.setAttribute("aria-expanded", "true");
    }

    modal.hidden = false;
    document.body.classList.add("modal-open");
    setBackgroundInert(true);

    requestAnimationFrame(() => {
      modal.classList.add("active-modal");
      const closeBtn = modal.querySelector(".services__modal-close");
      if (closeBtn) {
        closeBtn.focus();
      }
    });
  }

  function closeModal() {
    if (!activeModal) return;
    const modalToClose = activeModal;
    const triggerToRestore = activeTrigger;

    modalToClose.classList.remove("active-modal");
    document.body.classList.remove("modal-open");
    setBackgroundInert(false);

    if (triggerToRestore) {
      triggerToRestore.setAttribute("aria-expanded", "false");
    }

    activeModal = null;
    activeTrigger = null;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finishHide = () => {
      if (!modalToClose.classList.contains("active-modal")) {
        modalToClose.hidden = true;
      }
      if (triggerToRestore) {
        triggerToRestore.focus();
      }
    };

    if (reducedMotion) {
      finishHide();
    } else {
      window.setTimeout(finishHide, 220);
    }
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.getAttribute("data-modal-target");
      const modal = targetId ? document.getElementById(targetId) : null;
      openModal(modal, trigger);
    });
  });

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".services__modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (!activeModal) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key === "Tab") {
      const focusables = getFocusableElements(activeModal);
      if (!focusables.length) {
        event.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && (document.activeElement === first || !activeModal.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !activeModal.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* =============== DEFERRED PROJECTS FILTERING (MixItUp + Live Status) =============== */
  const workContainer = document.querySelector(".work__container");
  const filterButtons = Array.from(document.querySelectorAll(".work__item"));
  const filterStatus = document.getElementById("work-filter-status");

  if (typeof window.mixitup !== "undefined" && workContainer) {
    window.mixitup(workContainer, {
      selectors: { target: ".work__card" },
      animation: { duration: 240 },
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active-work");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active-work");
      button.setAttribute("aria-pressed", "true");

      if (filterStatus) {
        const filter = button.getAttribute("data-filter");
        const count =
          filter === "all"
            ? workContainer.querySelectorAll(".work__card").length
            : workContainer.querySelectorAll(filter).length;
        filterStatus.textContent = `Showing ${count} ${button.textContent.trim()} projects.`;
      }
    });
  });

  /* =============== CONTACT: COPY EMAIL FALLBACK & GMAIL COMPOSE =============== */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const copyEmailStatus = document.getElementById("copy-email-status");
  let copyTimer = null;

  if (copyEmailBtn && copyEmailStatus) {
    copyEmailBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(CONTACT.email);
          copyEmailStatus.textContent = "Email copied to clipboard.";
        } else {
          copyEmailStatus.textContent = `Copy manually: ${CONTACT.email}`;
        }
      } catch (err) {
        copyEmailStatus.textContent = `Copy manually: ${CONTACT.email}`;
      }
      window.clearTimeout(copyTimer);
      copyTimer = window.setTimeout(() => {
        copyEmailStatus.textContent = "";
      }, 2600);
    });
  }

  const contactForm = document.getElementById("contact-form");
  const submitFeedback = document.getElementById("contact-submit-feedback");

  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
    }
  }

  if (contactForm) {
    const nameInput = document.getElementById("contact-name");
    const mailInput = document.getElementById("contact-mail");
    const messageInput = document.getElementById("contact-message");
    const errName = document.getElementById("error-name");
    const errMail = document.getElementById("error-mail");
    const errMessage = document.getElementById("error-message");

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameVal = nameInput ? nameInput.value.trim() : "";
      const mailVal = mailInput ? mailInput.value.trim() : "";
      const msgVal = messageInput ? messageInput.value.trim() : "";

      let valid = true;
      setFieldError(nameInput, errName, nameVal ? "" : "Please enter your name.");
      if (!nameVal) valid = false;

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mailVal);
      setFieldError(mailInput, errMail, emailValid ? "" : "Please enter a valid email address.");
      if (!emailValid) valid = false;

      setFieldError(messageInput, errMessage, msgVal ? "" : "Please enter a short message.");
      if (!msgVal) valid = false;

      if (!valid) {
        if (submitFeedback) submitFeedback.textContent = "";
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const params = new URLSearchParams({
        view: "cm",
        fs: "1",
        to: CONTACT.email,
        su: `Portfolio message from ${nameVal}`,
        body: `${msgVal}\n\n— ${nameVal} (${mailVal})`,
      });
      const url = `https://mail.google.com/mail/?${params.toString()}`;
      window.open(url, "_blank", "noopener,noreferrer");

      if (submitFeedback) {
        submitFeedback.textContent = "Gmail compose opened in a new tab.";
      }
    });
  }

  /* =============== ONCE-ONLY INTERSECTION REVEALS =============== */
  const revealNodes = Array.from(document.querySelectorAll("[data-reveal]"));
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function revealAllImmediately() {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  if (motionQuery.matches || typeof IntersectionObserver === "undefined") {
    revealAllImmediately();
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );
    revealNodes.forEach((node) => observer.observe(node));
  }

  if (motionQuery.matches) {
    revealAllImmediately();
  }
})();
