(() => {
  "use strict";

  const body = document.body;
  const menuBtn = document.getElementById("menuBtn");
  const drawer = document.getElementById("mobileDrawer");
  const drawerClose = document.getElementById("drawerClose");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const themeToggle = document.getElementById("themeToggle");
  const drawerThemeToggle = document.getElementById("drawerThemeToggle");
  const header = document.querySelector(".header");
  const dropdownButtons = document.querySelectorAll(".dropdown-btn");
  const drawerLinks = document.querySelectorAll(
    ".drawer-link, .dropdown-content a",
  );
  const mobileBreakpoint = window.matchMedia("(max-width: 768px)");
  const drawerBreakpoint = window.matchMedia("(max-width: 1024px)");

  let servicesSwiper = null;
  let drawerOpener = null;
  let lastScrollY = window.scrollY;

  function readStoredTheme() {
    try {
      return localStorage.getItem("theme");
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Theme switching remains available when storage is unavailable.
    }
  }

  function updateThemeUI() {
    const isDark = body.classList.contains("dark-theme");

    if (themeToggle) {
      themeToggle.textContent = isDark ? "🌙" : "☀️";
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme",
      );
    }

    if (drawerThemeToggle) {
      drawerThemeToggle.checked = !isDark;
    }
  }

  function setTheme(theme) {
    body.classList.remove("dark-theme", "light-theme");
    body.classList.add(theme);
    storeTheme(theme);
    updateThemeUI();
  }

  function openDrawer() {
    if (!drawer || !drawerOverlay) {
      return;
    }

    drawerOpener = document.activeElement;
    drawer.classList.add("active");
    drawerOverlay.classList.add("active");
    drawer.setAttribute("aria-hidden", "false");
    menuBtn?.setAttribute("aria-expanded", "true");
    body.classList.add("drawer-open");
    drawerClose?.focus({ preventScroll: true });
  }

  function closeDrawer({ restoreFocus = true } = {}) {
    if (!drawer || !drawerOverlay) {
      return;
    }

    drawer.classList.remove("active");
    drawerOverlay.classList.remove("active");
    drawer.setAttribute("aria-hidden", "true");
    menuBtn?.setAttribute("aria-expanded", "false");
    body.classList.remove("drawer-open");

    if (restoreFocus && drawerOpener instanceof HTMLElement) {
      drawerOpener.focus({ preventScroll: true });
    }
  }

  function updateDropdown(button, isOpen) {
    const content = button.nextElementSibling;

    if (!(content instanceof HTMLElement)) {
      return;
    }

    button.classList.toggle("active", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
    content.classList.toggle("open", isOpen);
  }

  function initialiseSwiper() {
    const swiperElement = document.querySelector(".servicesSwiper");

    if (!swiperElement) {
      return;
    }

    if (mobileBreakpoint.matches && typeof window.Swiper === "function") {
      if (!servicesSwiper) {
        servicesSwiper = new window.Swiper(swiperElement, {
          slidesPerView: 1.45, //
          spaceBetween: 16,
          loop: true,
          speed: 800,

          // autoplay: {
          //   delay: 3000,
          //   disableOnInteraction: false,
          // },
          grabCursor: true,
          allowTouchMove: true,
          watchOverflow: false,
        });
      }

      return;
    }

    if (servicesSwiper) {
      servicesSwiper.destroy(true, true);
      servicesSwiper = null;
    }
  }

    function updateHeaderState() {
    if (!header) return;

    const currentScrollY = window.scrollY;

    
    header.classList.toggle("is-scrolled", currentScrollY > 30);

    
    if (currentScrollY > lastScrollY && currentScrollY > 320) {
      
      header.classList.add("header-hidden");
    } else {
  
      header.classList.remove("header-hidden");
    }

    
    lastScrollY = currentScrollY;
  }


  function initialise() {
    const storedTheme = readStoredTheme();
    setTheme(storedTheme === "light-theme" ? "light-theme" : "dark-theme");

    menuBtn?.addEventListener("click", openDrawer);
    drawerClose?.addEventListener("click", closeDrawer);
    drawerOverlay?.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer?.classList.contains("active")) {
        closeDrawer();
      }
    });

    dropdownButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        const isOpen = content?.classList.contains("open") ?? false;
        updateDropdown(button, !isOpen);
      });
    });

    themeToggle?.addEventListener("click", () => {
      setTheme(
        body.classList.contains("dark-theme") ? "light-theme" : "dark-theme",
      );
    });

    drawerThemeToggle?.addEventListener("change", () => {
      setTheme(drawerThemeToggle.checked ? "light-theme" : "dark-theme");
    });

    drawerLinks.forEach((link) => {
      link.addEventListener("click", () =>
        closeDrawer({ restoreFocus: false }),
      );
    });

    mobileBreakpoint.addEventListener("change", initialiseSwiper);
    drawerBreakpoint.addEventListener("change", (event) => {
      if (!event.matches) {
        closeDrawer({ restoreFocus: false });
      }
    });

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    updateHeaderState();
    initialiseSwiper();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
