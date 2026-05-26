/**
 * Radial Menu — script.js
 */

(function () {
  "use strict";

  const RADIUS = 185;
  const OFFSET = -90;

  const centerBtn = document.getElementById("centerBtn");
  const menuWrapper = document.getElementById("menuWrapper");
  const svg = document.getElementById("connectorSvg");
  const navBtns = Array.from(document.querySelectorAll(".nav-btn"));

  let isOpen = false;
  let lines = [];

  const toRad = (deg) => (deg * Math.PI) / 180;

  /**
   * Get center of an element in coordinates RELATIVE to the SVG element.
   * This works correctly regardless of where the SVG is positioned on the page.
   */
  function getCenterRelToSvg(el) {
    const elRect = el.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    return {
      x: elRect.left + elRect.width / 2 - svgRect.left,
      y: elRect.top + elRect.height / 2 - svgRect.top,
    };
  }

  function getTranslation(index, total) {
    const angle = OFFSET + (360 / total) * index;
    return {
      tx: Math.cos(toRad(angle)) * RADIUS,
      ty: Math.sin(toRad(angle)) * RADIUS,
    };
  }

  /* ── SVG lines ───────────────────────────────────────────── */

  function createLines() {
    lines.forEach((l) => l.remove());
    lines = navBtns.map(() => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.classList.add("connector-line");
      svg.appendChild(line);
      return line;
    });
  }

  function updateLines() {
    const c = getCenterRelToSvg(centerBtn);
    navBtns.forEach((btn, i) => {
      const b = getCenterRelToSvg(btn);
      lines[i].setAttribute("x1", c.x);
      lines[i].setAttribute("y1", c.y);
      lines[i].setAttribute("x2", b.x);
      lines[i].setAttribute("y2", b.y);
    });
  }

  function showLines() {
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add("visible"), 250 + i * 60);
    });
  }

  function hideLines() {
    lines.forEach((l) => l.classList.remove("visible"));
  }

  /* ── Button positioning ──────────────────────────────────── */

  function positionButtons() {
    navBtns.forEach((btn, i) => {
      const { tx, ty } = getTranslation(i, navBtns.length);
      btn.style.setProperty("--tx", `${tx}px`);
      btn.style.setProperty("--ty", `${ty}px`);
    });
  }

  /* ── Open / Close ────────────────────────────────────────── */

  function openMenu() {
    isOpen = true;
    centerBtn.classList.add("active");
    centerBtn.setAttribute("aria-expanded", "true");

    navBtns.forEach((btn) => {
      btn.classList.remove("closing");
      btn.classList.add("visible");
    });

    // Wait for buttons to finish animating out, then draw lines
    setTimeout(() => {
      updateLines();
      showLines();
    }, 300);
  }

  function closeMenu() {
    isOpen = false;
    centerBtn.classList.remove("active");
    centerBtn.setAttribute("aria-expanded", "false");

    hideLines();

    navBtns.forEach((btn) => {
      btn.classList.add("closing");
      btn.classList.remove("visible");
    });

    setTimeout(
      () => {
        navBtns.forEach((btn) => btn.classList.remove("closing"));
      },
      (0.24 + 0.55) * 1000 + 100,
    );
  }

  function toggleMenu() {
    isOpen ? closeMenu() : openMenu();
  }

  /* ── Resize ──────────────────────────────────────────────── */

  function onResize() {
    if (isOpen) requestAnimationFrame(updateLines);
  }

  /* ── Navigation ──────────────────────────────────────────── */

  const PAGE_MAP = {
    Home: "pages/home.html",
    About: "pages/about.html",
    Contact: "pages/contact.html",
    Services: "pages/services.html",
    Products: "pages/products.html",
  };

  navBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const label = btn.getAttribute("data-label");
      btn.style.borderColor = "var(--accent)";
      btn.style.boxShadow = "0 0 30px rgba(232,255,71,.5)";
      setTimeout(() => {
        const dest = PAGE_MAP[label];
        if (dest) {
          window.location.href = dest;
        } else {
          btn.style.borderColor = "";
          btn.style.boxShadow = "";
          closeMenu();
        }
      }, 320);
    });
  });

  /* ── Keyboard ────────────────────────────────────────────── */

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) closeMenu();
  });

  /* ── Init ────────────────────────────────────────────────── */

  function init() {
    positionButtons();
    createLines();
    centerBtn.addEventListener("click", toggleMenu);
    window.addEventListener("resize", onResize);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
