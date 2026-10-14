/* Maa Sharda Cyber — Services page
   Cards are informational only. This file intentionally adds no card click handlers. */
(() => {
  "use strict";

  const root = document.querySelector(".msc-services");
  if (!root) return;

  // Give section links from the Home page predictable targets:
  // #for-students, #common-services, #gov-services, #print-document
  // The existing site's theme toggle remains in control; CSS reads its theme classes/attributes.
  const sectionIds = ["for-students", "common-services", "gov-services", "print-document"];
  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.dataset.serviceSection = id;
  });

  // If this page is opened directly with a section hash, account for sticky navbars.
  const scrollToHashTarget = () => {
    if (!window.location.hash) return;
    const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    if (target && target.classList.contains("service-section")) {
      target.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
  };

  window.addEventListener("load", scrollToHashTarget, { once: true });
})();
