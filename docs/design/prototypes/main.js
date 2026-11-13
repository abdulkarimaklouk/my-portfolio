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

  /* =============== 3D FLOWING WIREFRAME WAVES (HERO SECTION) =============== */
  function initHeroWaves() {
    const canvas = document.getElementById("hero-waves-canvas");
    const heroSection = document.getElementById("home");
    if (!canvas || !heroSection) return;

    const gl =
      canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        depth: false,
        powerPreference: "high-performance",
      }) || canvas.getContext("experimental-webgl");

    if (!gl) {
      console.warn("WebGL unavailable for hero wireframe waves; retaining ambient bloom fallback.");
      return;
    }

    // Matrix helpers
    function mat4Perspective(out, fovY, aspect, near, far) {
      const f = 1.0 / Math.tan(fovY / 2);
      const nf = 1 / (near - far);
      out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
      out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
      out[8] = 0; out[9] = 0; out[10] = (far + near) * nf; out[11] = -1;
      out[12] = 0; out[13] = 0; out[14] = (2 * far * near) * nf; out[15] = 0;
      return out;
    }

    function mat4LookAt(out, eye, target, up) {
      let z0 = eye[0] - target[0], z1 = eye[1] - target[1], z2 = eye[2] - target[2];
      let len = Math.hypot(z0, z1, z2);
      if (len > 0.00001) { z0 /= len; z1 /= len; z2 /= len; }

      let x0 = up[1] * z2 - up[2] * z1;
      let x1 = up[2] * z0 - up[0] * z2;
      let x2 = up[0] * z1 - up[1] * z0;
      len = Math.hypot(x0, x1, x2);
      if (len > 0.00001) { x0 /= len; x1 /= len; x2 /= len; }

      let y0 = z1 * x2 - z2 * x1;
      let y1 = z2 * x0 - z0 * x2;
      let y2 = z0 * x1 - z1 * x0;

      out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
      out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
      out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
      out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
      out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
      out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
      out[15] = 1;
      return out;
    }

    function mat4Multiply(out, a, b) {
      const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
      const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
      const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
      const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

      let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
      return out;
    }

    // Shader sources
    const vsSource = `
      precision highp float;
      attribute vec2 a_basePos;
      attribute vec2 a_uv;
      attribute float a_ribbon;

      uniform mat4 u_mvp;
      uniform float u_time;
      uniform vec2 u_mouse;

      varying float v_elevation;
      varying float v_depth;
      varying vec2 v_uv;
      varying float v_ribbon;
      varying float v_worldX;

      void main() {
        v_uv = a_uv;
        v_ribbon = a_ribbon;

        float x = a_basePos.x;
        float z = a_basePos.y;

        // Subtle mouse parallax influence
        float mouseAtten = 1.0 - a_ribbon * 0.28;
        x += u_mouse.x * 0.22 * mouseAtten;

        // Spatial curvature along Z
        float curve = sin(z * 0.48 + a_ribbon * 1.30) * 0.45;
        float xc = x + curve;

        // Multi-harmonic traveling wave
        float t = u_time * (0.34 + a_ribbon * 0.08);
        float w1 = sin(xc * 0.72 - z * 0.38 + t * 0.58);
        float w2 = cos(xc * 1.25 + z * 0.62 - t * 0.44 + a_ribbon * 1.85);
        float w3 = sin(xc * 2.18 - z * 1.12 + t * 0.72 + a_ribbon * 0.88) * 0.35;
        float w4 = cos(length(vec2(xc - 1.15, z + 0.35)) * 0.82 - u_time * 0.22) * 0.45;

        // Non-linear crest sharpening
        float rawWave = w1 * 0.62 + w2 * 0.42 + w3 * 0.22 + w4 * 0.28;
        float crest = sign(rawWave) * pow(abs(rawWave), 1.42);

        // Boundary envelope falloff
        float envU = smoothstep(0.0, 0.15, a_uv.x) * smoothstep(1.0, 0.85, a_uv.x);
        float envV = smoothstep(0.0, 0.16, a_uv.y) * smoothstep(1.0, 0.84, a_uv.y);
        float envelope = envU * envV;

        float baseAmp = (a_ribbon == 0.0) ? 0.95 : (a_ribbon == 1.0 ? 0.72 : 0.52);
        float altitude = (a_ribbon == 0.0) ? -0.16 : (a_ribbon == 1.0 ? 0.26 : 0.66);

        float y = altitude + crest * baseAmp * envelope;

        v_elevation = y;
        v_worldX = x;

        vec4 worldPos = vec4(x, y, z, 1.0);
        vec4 clipPos = u_mvp * worldPos;
        v_depth = clipPos.w;
        gl_Position = clipPos;
      }
    `;

    const fsSource = `
      precision highp float;
      varying float v_elevation;
      varying float v_depth;
      varying vec2 v_uv;
      varying float v_ribbon;
      varying float v_worldX;

      uniform float u_lineType; // 0.0 = longitudinal flow, 1.0 = transverse rib
      uniform float u_theme;    // 0.0 = dark (#0B0B0C), 1.0 = light (#F5F5F5)

      void main() {
        // 1. Boundary & edge falloff
        float edgeFade = smoothstep(0.0, 0.12, v_uv.x) * smoothstep(1.0, 0.88, v_uv.x) *
                         smoothstep(0.0, 0.14, v_uv.y) * smoothstep(1.0, 0.86, v_uv.y);

        // 2. Depth attenuation
        float depthFade = smoothstep(8.5, 2.2, v_depth);

        // 3. Text area soft protection (left of center X < -0.2)
        float textFade = smoothstep(-2.2, -0.2, v_worldX);

        // 4. Luminous Ridge Lighting:
        // Elevation mapped across [-0.25, 1.10]
        float ridgeFactor = clamp((v_elevation + 0.25) / 1.35, 0.0, 1.0);

        // Color Palette:
        // Trough: Deep Obsidian Emerald (#091C11)
        vec3 colTrough = vec3(0.035, 0.110, 0.067);
        // Mid Slope: Rich Forest Emerald (#19542E)
        vec3 colMid    = vec3(0.098, 0.329, 0.180);
        // Crest Ridge: Luminous Lime Green (#C6F432)
        vec3 colCrest  = vec3(0.776, 0.957, 0.196);
        // Apex Highlight: Pure Electric Lime (#D9FF4A)
        vec3 colApex   = vec3(0.851, 1.000, 0.290);

        vec3 color;
        if (ridgeFactor < 0.48) {
          color = mix(colTrough, colMid, ridgeFactor * 2.083);
        } else {
          color = mix(colMid, colCrest, (ridgeFactor - 0.48) * 1.923);
        }

        float apexGlow = smoothstep(0.70, 1.0, ridgeFactor);
        color = mix(color, colApex, apexGlow * 0.75);

        // 5. Alpha calculation:
        float baseAlpha = mix(0.03, 0.90, pow(ridgeFactor, 1.35));
        float lineWeight = (u_lineType > 0.5) ? 0.38 : 1.0;
        float ribbonAtten = (v_ribbon == 0.0) ? 1.0 : (v_ribbon == 1.0 ? 0.84 : 0.64);

        float alpha = baseAlpha * edgeFade * depthFade * textFade * lineWeight * ribbonAtten;

        // 6. Light Theme Adaptability
        if (u_theme > 0.5) {
          vec3 lightColor = mix(vec3(0.50, 0.55, 0.45), vec3(0.22, 0.32, 0.02), ridgeFactor);
          gl_FragColor = vec4(lightColor, alpha * 0.25);
          return;
        }

        if (alpha < 0.012) discard;
        gl_FragColor = vec4(color, alpha);
      }
    `;

    function createShader(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }

    gl.useProgram(prog);

    // Uniform locations
    const uMvpLoc = gl.getUniformLocation(prog, "u_mvp");
    const uTimeLoc = gl.getUniformLocation(prog, "u_time");
    const uMouseLoc = gl.getUniformLocation(prog, "u_mouse");
    const uLineTypeLoc = gl.getUniformLocation(prog, "u_lineType");
    const uThemeLoc = gl.getUniformLocation(prog, "u_theme");

    // Attribute locations
    const aBasePosLoc = gl.getAttribLocation(prog, "a_basePos");
    const aUvLoc = gl.getAttribLocation(prog, "a_uv");
    const aRibbonLoc = gl.getAttribLocation(prog, "a_ribbon");

    // Ribbon mesh generation
    let vertexBuffer = gl.createBuffer();
    let indexBuffer = gl.createBuffer();
    let totalLongIndices = 0;
    let totalTransIndices = 0;

    function buildMesh(isMobile) {
      const ribbons = [
        {
          id: 0.0,
          uCount: isMobile ? 50 : 80,
          vCount: isMobile ? 32 : 50,
          minX: -1.2, maxX: 3.4,
          minZ: -0.8, maxZ: 2.2,
        },
        {
          id: 1.0,
          uCount: isMobile ? 44 : 70,
          vCount: isMobile ? 28 : 45,
          minX: -0.8, maxX: 3.8,
          minZ: -1.8, maxZ: 1.2,
        },
        {
          id: 2.0,
          uCount: isMobile ? 38 : 60,
          vCount: isMobile ? 24 : 38,
          minX: -1.6, maxX: 2.8,
          minZ: -3.0, maxZ: 0.2,
        },
      ];

      const vertexList = [];
      const longIndicesList = [];
      const transIndicesList = [];
      let vertexOffset = 0;

      ribbons.forEach((rib) => {
        const { id, uCount, vCount, minX, maxX, minZ, maxZ } = rib;

        for (let j = 0; j < vCount; j++) {
          const v = j / (vCount - 1);
          const z = minZ + v * (maxZ - minZ);

          for (let i = 0; i < uCount; i++) {
            const u = i / (uCount - 1);
            const x = minX + u * (maxX - minX);

            // [x, z, u, v, id]
            vertexList.push(x, z, u, v, id);
          }
        }

        // Longitudinal line segments (connect along u: (i, j) -> (i+1, j))
        for (let j = 0; j < vCount; j++) {
          for (let i = 0; i < uCount - 1; i++) {
            const idx0 = vertexOffset + j * uCount + i;
            const idx1 = idx0 + 1;
            longIndicesList.push(idx0, idx1);
          }
        }

        // Transverse line segments (connect along v: (i, j) -> (i, j+1))
        for (let j = 0; j < vCount - 1; j++) {
          for (let i = 0; i < uCount; i++) {
            const idx0 = vertexOffset + j * uCount + i;
            const idx1 = idx0 + uCount;
            transIndicesList.push(idx0, idx1);
          }
        }

        vertexOffset += uCount * vCount;
      });

      totalLongIndices = longIndicesList.length;
      totalTransIndices = transIndicesList.length;

      const vertexData = new Float32Array(vertexList);
      const allIndices = new Uint16Array(longIndicesList.concat(transIndicesList));

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, allIndices, gl.STATIC_DRAW);

      // Stride = 5 floats * 4 = 20 bytes
      const stride = 20;
      gl.enableVertexAttribArray(aBasePosLoc);
      gl.vertexAttribPointer(aBasePosLoc, 2, gl.FLOAT, false, stride, 0);

      gl.enableVertexAttribArray(aUvLoc);
      gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, stride, 8);

      gl.enableVertexAttribArray(aRibbonLoc);
      gl.vertexAttribPointer(aRibbonLoc, 1, gl.FLOAT, false, stride, 16);
    }

    // Viewport & Matrix state
    let width = 0;
    let height = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isVisible = true;
    let animId = null;
    const urlParams = new URLSearchParams(window.location.search);
    const timeOffsetSec = parseFloat(urlParams.get("timeOffset") || "0");
    let startTime = performance.now() - timeOffsetSec * 1000;

    const projMatrix = new Float32Array(16);
    const viewMatrix = new Float32Array(16);
    const mvpMatrix = new Float32Array(16);

    function resize() {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width || window.innerWidth;
      height = rect.height || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);

      buildMesh(width < 768);

      mat4Perspective(projMatrix, 48 * (Math.PI / 180), width / height, 0.1, 50.0);

      if (motionQuery.matches) {
        renderFrame(1.0);
      }
    }

    function renderFrame(time) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      // Mouse lerping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Camera view calculation with subtle tilt
      const eye = [currentMouseX * 0.40, 2.9 - currentMouseY * 0.25, 4.3];
      const target = [0.4, 0.05, -0.4];
      const up = [0, 1, 0];

      mat4LookAt(viewMatrix, eye, target, up);
      mat4Multiply(mvpMatrix, projMatrix, viewMatrix);

      gl.uniformMatrix4fv(uMvpLoc, false, mvpMatrix);
      gl.uniform1f(uTimeLoc, time);
      gl.uniform2f(uMouseLoc, currentMouseX, currentMouseY);

      const isLight = document.documentElement.classList.contains("light-theme");
      gl.uniform1f(uThemeLoc, isLight ? 1.0 : 0.0);

      // Draw longitudinal lines
      gl.uniform1f(uLineTypeLoc, 0.0);
      gl.drawElements(gl.LINES, totalLongIndices, gl.UNSIGNED_SHORT, 0);

      // Draw transverse lines
      gl.uniform1f(uLineTypeLoc, 1.0);
      gl.drawElements(gl.LINES, totalTransIndices, gl.UNSIGNED_SHORT, totalLongIndices * 2);
    }

    function loop(now) {
      if (!isVisible || motionQuery.matches) return;
      const elapsed = (now - startTime) * 0.001;
      renderFrame(elapsed);
      animId = requestAnimationFrame(loop);
    }

    // Mouse tracking across Hero
    if (window.matchMedia("(pointer: fine)").matches) {
      heroSection.addEventListener("pointermove", (e) => {
        const rect = heroSection.getBoundingClientRect();
        targetMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        targetMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      }, { passive: true });

      heroSection.addEventListener("pointerleave", () => {
        targetMouseX = 0;
        targetMouseY = 0;
      }, { passive: true });
    }

    // Visibility & Lifecycle
    if (typeof IntersectionObserver !== "undefined") {
      const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animId && !motionQuery.matches && !document.hidden) {
            animId = requestAnimationFrame(loop);
          } else if (!isVisible && animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      }, { threshold: 0.05 });
      heroObserver.observe(heroSection);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      } else {
        if (isVisible && !animId && !motionQuery.matches) {
          animId = requestAnimationFrame(loop);
        }
      }
    });

    let resizeTimer = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    }, { passive: true });

    motionQuery.addEventListener("change", (e) => {
      if (e.matches) {
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
        renderFrame(1.0);
      } else {
        if (isVisible && !animId && !document.hidden) {
          animId = requestAnimationFrame(loop);
        }
      }
    });

    // Initialize
    resize();
    if (!motionQuery.matches) {
      animId = requestAnimationFrame(loop);
    }
  }

  initHeroWaves();

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
