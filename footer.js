(() => {
  "use strict";

  /*
    Footer:
    "© 2026" वाला साल हर साल अपने-आप बदलता रहे, इसके लिए।
    (Back to top, links वगैरह बिना JS के चलते हैं।)
  */

  function initialise() {
    const year = document.getElementById("ftYear");

    if (year) {
      year.textContent = String(new Date().getFullYear());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
