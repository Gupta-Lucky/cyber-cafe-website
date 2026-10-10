(() => {
  "use strict";

  /*
    Services-by-category section:
    जब cards screen में आते हैं, तो एक बार हल्के से एक-के-बाद-एक दिखते हैं।
    JS बंद हो या animation पसंद न हो, तब भी cards पूरे दिखते हैं।
  */

  function initialise() {
    const section = document.querySelector(".category-section");

    if (!section) {
      return;
    }

    const grids = section.querySelectorAll(".cat-grid");

    // हर card को उसका क्रम नंबर दो (CSS इसी से stagger delay निकालता है)
    grids.forEach((grid) => {
      grid.querySelectorAll(".cat-card").forEach((card, index) => {
        card.style.setProperty("--i", index);
      });
    });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      grids.forEach((grid) => grid.classList.add("is-visible"));
      return;
    }

    // इस class के बाद ही CSS cards को पहले छुपाता है
    section.classList.add("js-reveal");

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    grids.forEach((grid) => observer.observe(grid));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
