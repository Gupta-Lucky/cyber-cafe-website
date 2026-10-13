(() => {
  "use strict";

  /*
    Privacy Policy + Terms & Conditions pages:
    1. Business की जानकारी (पता, email, तारीख) नीचे एक ही जगह भरें,
       दोनों pages में हर जगह अपने-आप आ जाएगी।
    2. विषय सूची: mobile पर बंद रहती है, desktop पर हमेशा खुली और
       जिस हिस्से को पढ़ रहे हैं वह उसमें चमकता है।
  */

  /* ==== यहाँ अपनी असली जानकारी भरें ==== */
  const BUSINESS = {
    name: "Maa Sharda Cyber",
    address: "Main Road Bhagwanpur, Rajnagar",
    phone: "+91 92410 62900",
    email: "lakkiguptaa0816@gmail.com",
    updated: "[13/10/2026]", // "Last Updated" की तारीख, जैसे "15/10/2026"
  };
  /* ==================================== */

  const isPlaceholder = (value) => /^\s*\[.*\]\s*$/.test(value);

  function fillBusinessDetails() {
    document.querySelectorAll("[data-biz]").forEach((node) => {
      const value = BUSINESS[node.dataset.biz];

      if (typeof value !== "string") {
        return;
      }

      node.textContent = value;
      node.classList.toggle("lg-todo", isPlaceholder(value));
    });

    // phone / email के clickable links
    document.querySelectorAll("[data-biz-link]").forEach((link) => {
      const kind = link.dataset.bizLink;
      const value = BUSINESS[kind];

      if (typeof value !== "string" || isPlaceholder(value)) {
        link.removeAttribute("href"); // जब तक असली email नहीं भरा, link बंद
        return;
      }

      link.setAttribute(
        "href",
        kind === "phone"
          ? `tel:${value.replace(/[^\d+]/g, "")}`
          : `mailto:${value}`,
      );
    });
  }

  function initContents() {
    const box = document.querySelector(".lg-toc-box");
    const links = document.querySelectorAll(".lg-toc-list a");

    if (!box || !links.length) {
      return;
    }

    const desktop = window.matchMedia("(min-width: 1025px)");

    function syncOpenState() {
      box.open = desktop.matches; // desktop पर खुली, mobile पर बंद
    }

    syncOpenState();
    desktop.addEventListener("change", syncOpenState);

    // Mobile पर किसी हिस्से पर tap करने के बाद सूची बंद हो जाए
    links.forEach((link) => {
      link.addEventListener("click", () => {
        if (!desktop.matches) {
          box.open = false;
        }
      });
    });

    // जो हिस्सा पढ़ रहे हैं, उसे सूची में चिह्नित करो
    if (!("IntersectionObserver" in window)) {
      return;
    }

    const byId = new Map();

    links.forEach((link) => byId.set(link.getAttribute("href").slice(1), link));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          links.forEach((link) => link.classList.remove("is-active"));
          byId.get(entry.target.id)?.classList.add("is-active");
        });
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );

    document.querySelectorAll(".lg-sec").forEach((section) => {
      observer.observe(section);
    });
  }

  function initialise() {
    fillBusinessDetails();
    initContents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
