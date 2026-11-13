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
      metaThemeColor.setAttribute("content", isLight ? "#F5F5F5" : "#0B0B0C");
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

  /* =============== SUBTLE 3D LIME PARTICLE BACKGROUND =============== */
  function initParticleField() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationFrameId = null;
    let isPaused = false;

    // Mouse / Pointer Parallax State
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let pointerActive = false;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function getParticleCount(w) {
      if (w >= 1024) return 60;
      if (w >= 640) return 40;
      return 22;
    }

    function createParticle(w, h, randomY = true) {
      const z = 0.05 + Math.random() * 0.95; // 0.05 (near) to 1.0 (far)
      const scale = 1 - z * 0.65;
      const halfW = (w * 0.55) / scale;
      const halfH = (h * 0.55) / scale;

      return {
        x: (Math.random() * 2 - 1) * halfW,
        y: randomY ? (Math.random() * 2 - 1) * halfH : halfH + Math.random() * 20,
        z: z,
        vx: (Math.random() - 0.5) * 0.12 * (1 - z * 0.4),
        vy: -(0.06 + Math.random() * 0.14) * (1 - z * 0.45),
        baseRadius: 0.8 + Math.random() * 1.3,
        baseAlpha: 0.16 + Math.random() * 0.26,
        phase: Math.random() * Math.PI * 2,
        fadeSpeed: 0.008 + Math.random() * 0.012,
      };
    }

    function initParticles() {
      const count = getParticleCount(width);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(width, height, true));
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      initParticles();

      if (motionQuery.matches) {
        renderFrame();
      }
    }

    function onPointerMove(e) {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
      pointerX = e.clientX;
      pointerY = e.clientY;
      pointerActive = true;
    }

    function onPointerLeave() {
      targetMouseX = 0;
      targetMouseY = 0;
      pointerActive = false;
    }

    function renderFrame() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const centerX = width * 0.5;
      const centerY = height * 0.5;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion update (unless reduced motion)
        if (!motionQuery.matches) {
          p.x += p.vx;
          p.y += p.vy;
          p.phase += p.fadeSpeed;
        }

        const scale = 1 - p.z * 0.65;
        const parallaxX = currentMouseX * 36 * (1 - p.z);
        const parallaxY = currentMouseY * 36 * (1 - p.z);

        let projX = centerX + (p.x + parallaxX) * scale;
        let projY = centerY + (p.y + parallaxY) * scale;

        // Boundary wrapping
        const halfW = width * 0.5;
        const halfH = height * 0.5;

        if (projY < -15) {
          p.y = (halfH + 15) / scale - parallaxY;
          p.x = (Math.random() - 0.5) * width;
          projY = height + 15;
        } else if (projY > height + 20) {
          p.y = (-halfH - 15) / scale - parallaxY;
          projY = -15;
        }

        if (projX < -20) {
          p.x = (halfW + 15) / scale - parallaxX;
          projX = width + 15;
        } else if (projX > width + 20) {
          p.x = (-halfW - 15) / scale - parallaxX;
          projX = -15;
        }

        // Soft pointer proximity displacement
        if (pointerActive && !motionQuery.matches) {
          const dx = projX - pointerX;
          const dy = projY - pointerY;
          const dist = Math.hypot(dx, dy);
          const maxDist = 95;
          if (dist < maxDist && dist > 0.1) {
            const force = (1 - dist / maxDist) * 12 * (1 - p.z);
            projX += (dx / dist) * force;
            projY += (dy / dist) * force;
          }
        }

        // Pulsing / breathing alpha
        const pulse = 0.72 + 0.28 * Math.sin(p.phase);
        const alpha = Math.max(0.04, Math.min(0.52, p.baseAlpha * Math.pow(scale, 1.25) * pulse));
        const radius = Math.max(0.45, p.baseRadius * scale);

        ctx.beginPath();
        ctx.arc(projX, projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198, 244, 50, ${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    function animate() {
      if (isPaused || motionQuery.matches) return;
      renderFrame();
      animationFrameId = requestAnimationFrame(animate);
    }

    // Window events
    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }, { passive: true });

    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        isPaused = true;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        isPaused = false;
        if (!motionQuery.matches && !animationFrameId) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    });

    motionQuery.addEventListener("change", (e) => {
      if (e.matches) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
        renderFrame();
      } else {
        if (!animationFrameId && !document.hidden) {
          animationFrameId = requestAnimationFrame(animate);
        }
      }
    });

    // Initialize
    resize();
    if (!motionQuery.matches) {
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  initParticleField();
})();
