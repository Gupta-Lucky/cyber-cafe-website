(() => {
  "use strict";

  /*
    Pricing section:
    pricing-data.js की list से cards अपने-आप बनाती है (React की तरह, पर सादी JS में)।
    Data में जितने cards होंगे, उतने ही दिखेंगे: list बढ़ाओ, cards बढ़ जाएँगे।

    शुरू में सिर्फ़ कुछ rows दिखती हैं (mobile: 4 rows, desktop: 2 rows),
    बाकी "Show all pricing" दबाने पर खुलती हैं।

    ज़रूरी: pricing-data.js इस file से पहले load होनी चाहिए।
  */

  const SVG_NS = "http://www.w3.org/2000/svg";

  /* Icons (24x24, stroke वाले)। नाम pricing-data.js में `icon` में लिखे जाते हैं */
  const ICONS = {
    "id-card":
      '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="11" r="2.2"/><path d="M5.5 17c.6-1.8 2-2.7 3.5-2.7s2.9.9 3.5 2.7M15 9.5h3M15 13h3"/>',
    "user-check":
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    "graduation-cap":
      '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    landmark:
      '<path d="M2 10 12 4l10 6z"/><path d="M5 10v9M9.5 10v9M14.5 10v9M19 10v9M3 21h18"/>',
    vote: '<path d="m9 12 2 2 4-4"/><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7z"/><path d="M22 19H2"/>',
    "shopping-bag":
      '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    award:
      '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    train:
      '<rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M12 3v8M8 19l-2 3M18 22l-2-3M8 15h.01M16 15h.01"/>',
    briefcase:
      '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    calculator:
      '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M16 14v4M16 10h.01M12 10h.01M8 10h.01M12 14h.01M8 14h.01M12 18h.01M8 18h.01"/>',
    building:
      '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
    book: '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    map: '<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    heart:
      '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    plane:
      '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    "file-text":
      '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8M16 17H8M10 9H8"/>',
    image:
      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/>',
    table:
      '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>',
    globe:
      '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3.2 3 3.2 15 0 18M12 3c-3.2 3-3.2 15 0 18"/>',
    video:
      '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m16 10 6-3v10l-6-3z"/>',
    megaphone:
      '<path d="M3 11v2a1 1 0 0 0 1 1h3l8 4V6L7 10H4a1 1 0 0 0-1 1z"/><path d="M18.5 9a4 4 0 0 1 0 6"/>',
    phone:
      '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  };

  // Screen में कितने columns हैं, उसके हिसाब से शुरू में कितनी rows दिखें
  const ROWS_BY_COLUMNS = { 2: 4, 3: 3, 4: 2, 5: 2 };

  function el(tag, className, text) {
    const node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (text !== undefined) {
      node.textContent = text; // textContent: data कभी HTML नहीं बनता
    }

    return node;
  }

  function icon(name) {
    const svg = document.createElementNS(SVG_NS, "svg");

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    // ICONS ऊपर इसी file में लिखे हुए fixed text हैं (बाहर से कुछ नहीं आता)
    svg.innerHTML = ICONS[name] || ICONS["file-text"];
    return svg;
  }

  // संख्या -> ₹200 ; text -> जैसा है वैसा ; खाली -> "Call"
  function formatPrice(price) {
    if (typeof price === "number") {
      return `₹${price.toLocaleString("en-IN")}`;
    }

    return price ? String(price) : "Call";
  }

  function isValidCategory(category) {
    return (
      category &&
      typeof category.title === "string" &&
      Array.isArray(category.items) &&
      category.items.length > 0
    );
  }

  function initialise() {
    const grid = document.getElementById("pricingGrid");

    if (!grid) {
      return;
    }

    const data = window.MSC_PRICING;

    if (!data || !Array.isArray(data.categories)) {
      console.warn(
        "pricing.js: pricing-data.js load नहीं हुई। उसे pricing.js से पहले जोड़ें।",
      );
      return;
    }

    const section = document.getElementById("pricing");
    const moreBtn = document.getElementById("pricingMore");
    const moreText = document.getElementById("pricingMoreText");
    const sampleEl = document.getElementById("pricingSample");
    const noteEl = document.getElementById("pricingNote");
    const config = data.config || {};
    const callNumber = config.callNumber || "";

    let cards = [];
    let expanded = false;

    function buildCard(category) {
      const card = el("li", "pr-card");

      const iconWrap = el("span", "pr-icon");
      iconWrap.append(icon(category.icon));

      const list = el("ul", "pr-list");

      category.items.forEach((item) => {
        const row = el("li", "pr-row");
        row.append(
          el("span", "pr-name", item.name),
          el("span", "pr-price", formatPrice(item.price)),
        );
        list.append(row);
      });

      card.append(iconWrap, el("h3", "pr-title", category.title), list);

      if (callNumber) {
        const call = el("a", "pr-call");

        call.href = `tel:${callNumber}`;
        call.setAttribute("aria-label", `Call now for ${category.title}`);
        call.append(icon("phone"), "Call Now");
        card.append(call);
      }

      return card;
    }

    function columnCount() {
      const columns = getComputedStyle(grid).gridTemplateColumns;

      return columns && columns !== "none" ? columns.split(" ").length : 2;
    }

    function visibleLimit() {
      const columns = columnCount();

      return columns * (ROWS_BY_COLUMNS[columns] || 2);
    }

    function applyVisibility() {
      const total = cards.length;
      const limit = visibleLimit();
      const needsToggle = total > limit;

      cards.forEach((card, index) => {
        card.hidden = !expanded && index >= limit;
      });

      moreBtn.hidden = !needsToggle;
      moreBtn.setAttribute("aria-expanded", String(expanded));
      moreText.textContent = expanded
        ? "Show less"
        : `Show all pricing (${total})`;
    }

    function render() {
      const categories = data.categories.filter(isValidCategory);

      cards = categories.map(buildCard);
      grid.replaceChildren(...cards);

      if (sampleEl) {
        sampleEl.textContent = config.sampleNotice || "";
        sampleEl.hidden = !(config.showSampleNotice && config.sampleNotice);
      }

      if (noteEl) {
        noteEl.textContent = config.note || "";
        noteEl.hidden = !config.note;
      }

      applyVisibility();
    }

    moreBtn.addEventListener("click", () => {
      expanded = !expanded;
      applyVisibility();

      // "Show less" दबाने पर section के ऊपर लौटो, ताकि user खो न जाए
      if (!expanded && section) {
        const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches;

        section.scrollIntoView({
          behavior: smooth ? "smooth" : "auto",
          block: "start",
        });
      }
    });

    // Screen का size बदले (columns बदलें) तो दिखने वाले cards भी बदलें
    ["(min-width: 768px)", "(min-width: 1100px)", "(min-width: 1360px)"].forEach(
      (query) => {
        window.matchMedia(query).addEventListener("change", applyVisibility);
      },
    );

    render();

    // नया card बाद में code से भी जोड़ सकते हैं: MSCPricing.add({ icon, title, items })
    window.MSCPricing = Object.freeze({
      render,
      add(category) {
        if (!isValidCategory(category)) {
          console.warn("MSCPricing.add: card में title और items चाहिए।");
          return;
        }

        data.categories.push(category);
        render();
      },
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
