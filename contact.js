(() => {
  "use strict";

  /*
    Contact section:
    - "Scan WhatsApp code" और "DM on Instagram" पर tap करने से QR card खुलता है
    - "Call on Mobile number" सिर्फ़ एक tel: link है (HTML में), उसके लिए JS नहीं चाहिए
    - Card बाहर tap करने, Esc दबाने या ✕ से बंद होता है
  */

  function initialise() {
    const triggers = document.querySelectorAll("[data-dialog]");

    if (!triggers.length) {
      return;
    }

    const openers = new WeakMap();

    function openDialog(dialog, trigger) {
      if (!dialog || dialog.open) {
        return;
      }

      openers.set(dialog, trigger);

      if (typeof dialog.showModal === "function") {
        dialog.showModal();
      } else {
        dialog.setAttribute("open", ""); // बहुत पुराने browsers के लिए
      }
    }

    function restoreFocus(dialog) {
      const opener = openers.get(dialog);
      openers.delete(dialog);
      opener?.focus({ preventScroll: true });
    }

    function closeDialog(dialog) {
      if (typeof dialog.close === "function" && dialog.open) {
        dialog.close();
      } else {
        dialog.removeAttribute("open");
        restoreFocus(dialog);
      }
    }

    triggers.forEach((trigger) => {
      const dialog = document.getElementById(trigger.dataset.dialog);

      trigger.addEventListener("click", () => openDialog(dialog, trigger));
    });

    document.querySelectorAll(".ct-dialog").forEach((dialog) => {
      dialog.addEventListener("close", () => restoreFocus(dialog));

      // Card के बाहर (अँधेरे हिस्से पर) tap करने से बंद
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
          closeDialog(dialog);
        }
      });

      dialog
        .querySelector("[data-close]")
        ?.addEventListener("click", () => closeDialog(dialog));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
