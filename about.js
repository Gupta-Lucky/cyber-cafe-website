(() => {
  "use strict";

  const STORAGE_KEY = "maa-sharda-cyber-feedback";
  const MAX_HOME_REVIEWS = 8;
  const MAX_WORDS = 150;

  const sampleFeedback = [
    {
      name: "Lakki Kumar",
      rating: 5,
      text: "Maa Sharda Cyber is a trusted place where I can get my work done without confusion. The process was explained very clearly.",
      date: "Recently",
    },
    {
      name: "Ranjan Kumar",
      rating: 4.5,
      text: "Helpful service and a very smooth experience. My online form work was completed quickly and carefully.",
      date: "Recently",
    },
    {
      name: "Priya Singh",
      rating: 5,
      text: "They guided me patiently through every document needed for my application. I felt supported from start to finish.",
      date: "This month",
    },
    {
      name: "Aman Jha",
      rating: 4,
      text: "Good place for printing and online forms. The instructions were easy to understand and the work was done on time.",
      date: "This month",
    },
    {
      name: "Neha Kumari",
      rating: 5,
      text: "Very cooperative and professional. I will definitely return whenever I need any digital service or document support.",
      date: "This month",
    },
    {
      name: "Vikash Rai",
      rating: 4.5,
      text: "The team made a difficult online process feel straightforward. I especially appreciated the attention to details.",
      date: "This month",
    },
    {
      name: "Soni Devi",
      rating: 5,
      text: "Fast service with respectful behaviour. Everything was handled neatly and I got the help I needed.",
      date: "This month",
    },
    {
      name: "Sajan Kumar",
      rating: 4,
      text: "A reliable cyber cafe for everyday work. The staff explains things clearly and the service is affordable.",
      date: "This month",
    },
  ];

  const escapeHtml = (value) =>
    String(value).replace(/[&<>'"]/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      };
      return entities[character];
    });

  const getStoredFeedback = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  };

  const saveFeedback = (feedback) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedback));
      return true;
    } catch (error) {
      return false;
    }
  };

  const starIcon = (fill) => `
    <span class="star" style="--fill:${fill}" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d="m12 2.4 2.94 5.96 6.58.96-4.76 4.64 1.12 6.56L12 17.44l-5.88 3.08 1.12-6.56-4.76-4.64 6.58-.96L12 2.4Z"/></svg>
      <svg class="star-fill" viewBox="0 0 24 24"><path d="m12 2.4 2.94 5.96 6.58.96-4.76 4.64 1.12 6.56L12 17.44l-5.88 3.08 1.12-6.56-4.76-4.64 6.58-.96L12 2.4Z"/></svg>
    </span>`;

  const ratingMarkup = (rating) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
      const portion = Math.max(0, Math.min(1, rating - index));
      return starIcon(portion);
    }).join("");

    return `<span class="star-rating" aria-label="${rating.toFixed(1)} out of 5 stars">${stars}</span><span class="rating-value">${rating.toFixed(1)}</span>`;
  };

  const initials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

  const avatarColor = (name) => {
    const colors = ["#0c70d4", "#0a918d", "#375b9d", "#8c6b2c", "#47726e"];
    const total = [...name].reduce((sum, character) => sum + character.charCodeAt(0), 0);
    return colors[total % colors.length];
  };

  const feedbackCard = (review) => `
    <article class="swiper-slide feedback-card">
      <div class="feedback-card-header">
        <span class="avatar" style="--avatar:${avatarColor(review.name)}" aria-hidden="true">${escapeHtml(initials(review.name))}</span>
        <div class="reviewer-meta">
          <p class="reviewer-name">${escapeHtml(review.name)}</p>
          <div class="review-rating">${ratingMarkup(Number(review.rating))}</div>
        </div>
      </div>
      <p class="review-text">${escapeHtml(review.text)}</p>
      <div class="review-footer">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-16 0C4 7.1 7.6 3 12 3s8 4.1 8 8.5Z"/><path d="M8.5 12.2 10.7 14l4.8-4.8"/></svg>
        <span>${escapeHtml(review.date || "Recently")}</span>
      </div>
    </article>`;

  let feedbackSwiper;

  const renderFeedback = () => {
    const feedbackCards = document.querySelector("#feedbackCards");
    const feedbackCount = document.querySelector("#feedbackCount");
    if (!feedbackCards) return;

    if (feedbackSwiper) feedbackSwiper.destroy(true, true);

    const submitted = getStoredFeedback();
    const visibleFeedback = [...submitted, ...sampleFeedback].slice(0, MAX_HOME_REVIEWS);
    feedbackCards.innerHTML = visibleFeedback.map(feedbackCard).join("");
    feedbackCount.textContent = visibleFeedback.length;

    if (typeof window.Swiper !== "function") {
      return;
    }

    feedbackSwiper = new window.Swiper(".feedback-swiper", {
      slidesPerView: 1.16,
      spaceBetween: 12,
      speed: 650,
      grabCursor: true,
      loop: visibleFeedback.length > 3,
      autoplay: {
        delay: 3600,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      navigation: {
        nextEl: ".feedback-next",
        prevEl: ".feedback-prev",
      },
      breakpoints: {
        600: { slidesPerView: 2.12, spaceBetween: 16 },
        900: { slidesPerView: 3.12, spaceBetween: 18 },
      },
    });
  };

  const wordCount = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const showSuccess = () => {
    const flash = document.querySelector("#successFlash");
    flash.classList.add("is-visible");
    flash.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      flash.classList.remove("is-visible");
      flash.setAttribute("aria-hidden", "true");
    }, 1900);
  };

  const setupForm = () => {
    const form = document.querySelector("#reviewForm");
    const text = document.querySelector("#reviewText");
    const wordCounter = document.querySelector("#wordCount");
    const message = document.querySelector("#formMessage");
    if (!form || !text) return;

    const updateWordCount = () => {
      const count = wordCount(text.value);
      wordCounter.textContent = `${count} / ${MAX_WORDS} words`;
      wordCounter.style.color = count > MAX_WORDS ? "#ffdf9a" : "";
    };

    text.addEventListener("input", updateWordCount);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      message.textContent = "";

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const review = String(formData.get("review") || "").trim();
      const rating = Number(formData.get("rating"));

      if (!name || !rating || !review) {
        message.textContent = "Please add your name, rating and review.";
        return;
      }

      if (wordCount(review) > MAX_WORDS) {
        message.textContent = "Please keep your review within 150 words.";
        text.focus();
        return;
      }

      const submitted = getStoredFeedback();
      const currentFeedback = {
        name,
        rating,
        text: review,
        date: "Just now",
        createdAt: Date.now(),
      };

      if (!saveFeedback([currentFeedback, ...submitted])) {
        message.textContent = "Your browser could not save this feedback. Please try again.";
        return;
      }

      form.reset();
      updateWordCount();
      renderFeedback();
      showSuccess();
    });
  };

  const initialise = () => {
    renderFeedback();
    setupForm();
    document.querySelector("#currentYear").textContent = new Date().getFullYear();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialise, { once: true });
  } else {
    initialise();
  }
})();
