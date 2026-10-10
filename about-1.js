(() => {
  "use strict";

  /*
    About section:
    1. आज का दिन working days में highlight
    2. Customer reviews के cards बनाना + Swiper (autoplay + manual swipe)
    3. Feedback form (validation, 150 words limit, rating chips)
    4. Submit के बाद thank-you screen, फिर नया review सबसे पहले (1 नंबर पर)

    ज़रूरी: feedback-data.js इस file से पहले load होनी चाहिए।
  */

  const SVG_NS = "http://www.w3.org/2000/svg";

  function $(selector, root = document) {
    return root.querySelector(selector);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);

    if (className) {
      node.className = className;
    }

    if (text !== undefined) {
      node.textContent = text; // textContent: user का लिखा text कभी HTML नहीं बनता
    }

    return node;
  }

  /* ---------- SVG helpers ---------- */

  function svgUse(symbolId, className) {
    const svg = document.createElementNS(SVG_NS, "svg");
    const use = document.createElementNS(SVG_NS, "use");

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    if (className) {
      svg.setAttribute("class", className);
    }

    use.setAttribute("href", `#${symbolId}`);
    svg.append(use);
    return svg;
  }

  function chevron() {
    const svg = document.createElementNS(SVG_NS, "svg");
    const path = document.createElementNS(SVG_NS, "path");

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    path.setAttribute("d", "m9 6 6 6-6 6");
    svg.append(path);
    return svg;
  }

  function starRow(className) {
    const row = el("span", className);

    for (let i = 0; i < 5; i += 1) {
      row.append(svgUse("ab-star"));
    }

    return row;
  }

  // 4.5 जैसी rating: ऊपर वाली पीली row की चौड़ाई rating/5 होती है
  function buildStars(rating) {
    const wrap = el("span", "stars");

    wrap.style.setProperty("--rating", String(rating));
    wrap.setAttribute("role", "img");
    wrap.setAttribute("aria-label", `Rated ${rating.toFixed(1)} out of 5`);
    wrap.append(starRow("stars-base"), starRow("stars-fill"));
    return wrap;
  }

  /* ---------- 1. Working days ---------- */

  function markToday() {
    const today = String(new Date().getDay());
    const chip = document.querySelector(`.ab-day-chips [data-day="${today}"]`);

    if (!chip) {
      return;
    }

    chip.classList.add("is-today");
    chip.setAttribute("aria-current", "date");

    const note = el("span", "sr-only", " (today)");
    chip.append(note);
  }

  /* ---------- 2. Reviews ---------- */

  function initReviews(api) {
    const swiperEl = $("#reviewsSwiper");
    const wrapper = $("#reviewsWrapper");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let swiper = null;
    let visibilityObserver = null;

    const pageUrl = api.config.FEEDBACK_PAGE_URL;

    function buildCard(entry) {
      const card = el("article", "rv-card");

      const top = el("div", "rv-top");
      const avatar = el("span", "rv-avatar");
      avatar.append(svgUse("ab-user"));

      const who = el("div", "rv-who");
      const rate = el("div", "rv-rate");
      rate.append(
        buildStars(entry.rating),
        el("span", "rv-score", entry.rating.toFixed(1)),
      );
      who.append(el("h4", "rv-name", entry.name), rate);
      top.append(avatar, who);

      const text = el("p", "rv-text", entry.text);

      const more = el("a", "rv-more");
      more.href = `${pageUrl}#${encodeURIComponent(entry.id)}`;
      more.setAttribute("aria-label", `Read full review by ${entry.name}`);
      more.append("Read more", chevron());

      card.append(top, text, more);
      return card;
    }

    function buildMoreCard(remaining) {
      const card = el("article", "rv-card rv-card-more");
      const link = el("a", "rv-more");

      link.href = pageUrl;
      link.append("See more reviews", chevron());

      card.append(
        el("span", "rv-more-count", `+${remaining}`),
        el("p", "rv-more-label", "more reviews"),
        link,
      );
      return card;
    }

    function buildEmptyCard() {
      const card = el("article", "rv-card rv-empty");
      const link = el("a", "rv-more");

      link.href = "#feedback";
      link.append("Write a review", chevron());

      card.append(
        el("h4", "", "No reviews yet"),
        el("p", "", "Be the first to share your experience."),
        link,
      );
      return card;
    }

    function slide(content) {
      const node = el("div", "swiper-slide");
      node.append(content);
      return node;
    }

    function destroySwiper() {
      visibilityObserver?.disconnect();
      visibilityObserver = null;

      if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
      }
    }

    function buildSwiper() {
      destroySwiper();

      // Swiper load न हो सका तो CSS से सादा swipe-scroll चलेगा
      if (typeof window.Swiper !== "function") {
        swiperEl.classList.add("rv-fallback");
        return;
      }

      swiperEl.classList.remove("rv-fallback");

      const canLoop = wrapper.children.length >= 8;

      swiper = new window.Swiper(swiperEl, {
        slidesPerView: 1.33, // mobile: 1 card + अगले card का 1/3 हिस्सा
        spaceBetween: 14,
        speed: 700,
        loop: canLoop,
        rewind: !canLoop,
        grabCursor: true,
        autoplay: reduceMotion
          ? false
          : {
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
        navigation: {
          prevEl: ".rv-prev",
          nextEl: ".rv-next",
        },
        breakpoints: {
          600: { slidesPerView: 2.15, spaceBetween: 16 },
          1025: { slidesPerView: 3.25, spaceBetween: 20 },
        },
      });

      // Section screen से बाहर हो तो autoplay रुके (battery बचती है)
      if (swiper.autoplay && "IntersectionObserver" in window) {
        visibilityObserver = new IntersectionObserver(([entry]) => {
          if (!swiper?.autoplay) {
            return;
          }

          if (entry.isIntersecting) {
            swiper.autoplay.start();
          } else {
            swiper.autoplay.stop();
          }
        });
        visibilityObserver.observe(swiperEl);
      }
    }

    function render() {
      const entries = api.getForHome();
      const remaining = api.getRemainingCount();

      wrapper.replaceChildren();

      if (entries.length === 0) {
        wrapper.append(slide(buildEmptyCard()));
      } else {
        entries.forEach((entry) => wrapper.append(slide(buildCard(entry))));

        if (remaining > 0) {
          wrapper.append(slide(buildMoreCard(remaining)));
        }
      }

      buildSwiper();
    }

    function showNewest() {
      swiper?.slideToLoop?.(0, 0);

      if (swiper && !swiper.params.loop) {
        swiper.slideTo(0, 0);
      }
    }

    render();

    // दूसरे tab में feedback जुड़े तो यहाँ भी दिख जाए
    window.addEventListener("storage", (event) => {
      if (event.key === api.config.STORAGE_KEY) {
        render();
      }
    });

    return { render, showNewest };
  }

  /* ---------- 3. Feedback form ---------- */

  function initForm(api, reviews) {
    const form = $("#feedbackForm");

    if (!form) {
      return;
    }

    const { MAX_WORDS, MIN_WORDS } = api.config;

    const nameInput = $("#fbName");
    const textInput = $("#fbText");
    const countEl = $("#fbCount");
    const submitBtn = $(".fb-submit", form);
    const honeypot = $(".fb-hp", form);
    const chips = $("#rateChips");
    const summary = $(".rate-summary", form);
    const summaryStars = $("#fbStars");
    const summaryText = $("#fbRateText");
    const reviewsTitle = $("#rvTitle");
    const reviewsBlock = $("#reviews");

    const errors = {
      name: $("#fbNameError"),
      rating: $("#fbRatingError"),
      text: $("#fbTextError"),
      form: $("#fbFormError"),
    };

    const thanks = $("#fbThanks");
    const thanksTitle = $("#fbThanksTitle");
    let thanksTimer = 0;

    /* -- errors -- */

    function showError(key, message, input) {
      const node = errors[key];

      if (!node) {
        return;
      }

      node.textContent = message;
      node.hidden = false;
      input?.setAttribute("aria-invalid", "true");
    }

    function clearError(key, input) {
      const node = errors[key];

      if (node) {
        node.hidden = true;
        node.textContent = "";
      }

      input?.removeAttribute("aria-invalid");
    }

    function clearAllErrors() {
      clearError("name", nameInput);
      clearError("rating");
      clearError("text", textInput);
      clearError("form");
    }

    /* -- rating chips -- */

    function ratingLabel(value) {
      if (value < 2) return "Poor";
      if (value < 3) return "Fair";
      if (value < 4) return "Good";
      if (value < 5) return "Very good";
      return "Excellent";
    }

    function updateRating(value) {
      summaryStars.style.setProperty("--rating", String(value));
      summaryText.textContent = `${value.toFixed(1)} out of 5 · ${ratingLabel(value)}`;
      summary.classList.add("is-set");
    }

    function resetRating() {
      summaryStars.style.setProperty("--rating", "0");
      summaryText.textContent = "Choose a rating";
      summary.classList.remove("is-set");
    }

    chips.addEventListener("change", (event) => {
      if (event.target instanceof HTMLInputElement && event.target.checked) {
        updateRating(Number(event.target.value));
        clearError("rating");
      }
    });

    /* -- 150 words limit -- */

    function updateCount() {
      const words = api.countWords(textInput.value);

      countEl.textContent =
        words >= MAX_WORDS
          ? `${words} / ${MAX_WORDS} words · limit reached`
          : `${words} / ${MAX_WORDS} words`;
      countEl.classList.toggle("is-near", words >= MAX_WORDS - 10);
    }

    textInput.addEventListener("input", () => {
      const limited = api.truncateWords(textInput.value, MAX_WORDS);

      // paste करने पर भी 150 शब्दों से आगे का text कट जाता है
      if (limited !== textInput.value) {
        textInput.value = limited;
      }

      updateCount();
      clearError("text", textInput);
    });

    nameInput.addEventListener("input", () => clearError("name", nameInput));

    /* -- thank-you screen -- */

    function hideThanks() {
      if (thanks.hidden) {
        return;
      }

      window.clearTimeout(thanksTimer);
      thanks.hidden = true;
      submitBtn.disabled = false;

      // नया review देखने के लिए reviews तक ले चलो
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;

      reviewsTitle?.focus({ preventScroll: true });
      reviewsBlock?.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
    }

    function showThanks(name) {
      const firstName = name.split(" ")[0];

      thanksTitle.textContent = `Thank you, ${firstName}!`;
      thanks.hidden = false;
      window.clearTimeout(thanksTimer);
      thanksTimer = window.setTimeout(hideThanks, 2600);
    }

    thanks.addEventListener("click", hideThanks);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideThanks();
      }
    });

    /* -- submit -- */

    function resetForm() {
      form.reset();
      resetRating();
      updateCount();
      clearAllErrors();
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearAllErrors();

      // Bot ने छुपा field भर दिया: चुपचाप ignore
      if (honeypot.value) {
        resetForm();
        return;
      }

      const name = nameInput.value.trim();
      const rating = form.elements.rating.value;
      const text = textInput.value;
      let firstInvalid = null;

      if (name.length < 2) {
        showError("name", "Please enter your name.", nameInput);
        firstInvalid = firstInvalid || nameInput;
      }

      if (!rating) {
        showError("rating", "Please choose a rating.");
        firstInvalid = firstInvalid || $("input[name='rating']", form);
      }

      if (api.countWords(text) < MIN_WORDS) {
        showError(
          "text",
          `Please write at least ${MIN_WORDS} words.`,
          textInput,
        );
        firstInvalid = firstInvalid || textInput;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const waitMs = api.getCooldownLeftMs();

      if (waitMs > 0) {
        showError(
          "form",
          `Please wait ${Math.ceil(waitMs / 1000)} seconds before sending another feedback.`,
        );
        return;
      }

      const result = api.add({ name, rating, text });

      if (!result.ok) {
        showError("form", result.message);
        return;
      }

      submitBtn.disabled = true;
      resetForm();

      // नया review पीछे तैयार हो जाए, thank-you screen उसे ढके रहेगी
      reviews.render();
      reviews.showNewest();
      showThanks(result.entry.name);
    });

    updateCount();
  }

  /* ---------- Start ---------- */

  function initialise() {
    if (!$("#about")) {
      return;
    }

    markToday();

    const api = window.MSCFeedback;

    if (!api) {
      console.warn(
        "about.js: feedback-data.js load नहीं हुई। उसे about.js से पहले जोड़ें।",
      );
      return;
    }

    document.querySelectorAll("[data-feedback-link]").forEach((link) => {
      link.setAttribute("href", api.config.FEEDBACK_PAGE_URL);
    });

    const reviews = initReviews(api);
    initForm(api, reviews);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
