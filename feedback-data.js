(() => {
  "use strict";

  /*
    FEEDBACK DATA + STORAGE
    -----------------------
    सारे feedback का data यहीं संभलता है। about.js सिर्फ़ इसे पढ़ता/लिखता है,
    और आगे बनने वाला "Feedback page" भी यही file use कर सकता है:

        MSCFeedback.getAll()       -> सारे feedback (नया सबसे पहले)
        MSCFeedback.getForHome()   -> सिर्फ़ पहले 8 (home page के लिए)
        MSCFeedback.add({...})     -> नया feedback जोड़ना

    ज़रूरी बात: browser की JS file अपने-आप को बदल नहीं सकती, इसलिए नए feedback
    browser की localStorage में रखे जाते हैं। यानी वो सिर्फ़ उसी phone/computer
    पर दिखेंगे जिससे भरे गए। सबको दिखाने के लिए आगे backend लगेगा; तब सिर्फ़
    readStored() और writeStored() को बदलना होगा, बाकी कोड वैसा ही रहेगा।
  */

  const CONFIG = Object.freeze({
    STORAGE_KEY: "msc_feedback_v1",
    LAST_SUBMIT_KEY: "msc_feedback_last_submit",
    MAX_WORDS: 150, // feedback में ज़्यादा से ज़्यादा इतने शब्द
    MIN_WORDS: 3, // कम से कम इतने शब्द
    MAX_NAME_LENGTH: 40,
    HOME_LIMIT: 8, // home page पर कितने cards
    COOLDOWN_MS: 30000, // एक के बाद दूसरा feedback कम से कम 30 सेकंड बाद
    MAX_STORED: 300,
    FEEDBACK_PAGE_URL: "feedback.html", // demo link: असली page बनने पर यहीं बदलें

    // false करते ही नीचे के DEMO feedback हट जाएँगे (website live करने से पहले false करें)
    SHOW_DEMO_FEEDBACK: true,
  });

  /* ---------- DEMO feedback: सिर्फ़ design देखने के लिए ----------
     ये असली customers के नहीं हैं। Live करने से पहले SHOW_DEMO_FEEDBACK = false करें। */

  const DEMO_FEEDBACKS = [
    {
      id: "demo-1",
      name: "Lakki Kumar",
      rating: 5,
      text: "Maa Sharda Cyber is a trustworthy place where I got my admission form filled without any mistake. The staff explained every step and the work was done on the same day. Highly recommended for students.",
      createdAt: "2026-10-05T10:20:00.000Z",
      demo: true,
    },
    {
      id: "demo-2",
      name: "Ranjan Kumar",
      rating: 4.5,
      text: "आय प्रमाण पत्र का फॉर्म यहाँ से भरवाया। सारे कागज़ात ठीक से जाँचे गए और दाम भी वाजिब थे। अगली बार भी यहीं आऊँगा।",
      createdAt: "2026-10-04T12:05:00.000Z",
      demo: true,
    },
    {
      id: "demo-3",
      name: "Priya Kumari",
      rating: 4,
      text: "Printout and scanning quality is very good. Shop is clean and the service is quick.",
      createdAt: "2026-10-02T09:40:00.000Z",
      demo: true,
    },
    {
      id: "demo-4",
      name: "Sumit Raj",
      rating: 5,
      text: "Railway aur SSC ka form bahut aaram se bhar diya gaya. Admit card download karne mein bhi poori madad mili. Bahut achha anubhav raha, dost aur bhai ko bhi yahin bhejunga.",
      createdAt: "2026-09-29T15:30:00.000Z",
      demo: true,
    },
    {
      id: "demo-5",
      name: "Neha Sinha",
      rating: 4.5,
      text: "Passport photo aur Aadhaar update ka kaam ek hi jagah ho gaya. Time bhi bahut kam laga.",
      createdAt: "2026-09-25T11:10:00.000Z",
      demo: true,
    },
  ];

  /* ---------- Text helpers (form भी यही use करता है) ---------- */

  function countWords(text) {
    const matches = String(text).match(/\S+/g);
    return matches ? matches.length : 0;
  }

  // max शब्दों के बाद का text काट देता है (spaces/लाइनें वैसी ही रहती हैं)
  function truncateWords(text, max = CONFIG.MAX_WORDS) {
    const value = String(text);
    const tokens = [...value.matchAll(/\S+/g)];

    if (tokens.length <= max) {
      return value;
    }

    const last = tokens[max - 1];
    return value.slice(0, last.index + last[0].length);
  }

  function cleanText(text) {
    return String(text).replace(/\s+/g, " ").trim();
  }

  function normaliseRating(value) {
    const number = Number(value);

    if (!Number.isFinite(number)) {
      return null;
    }

    const stepped = Math.round(number * 2) / 2; // 0.5 के steps
    return stepped >= 1 && stepped <= 5 ? stepped : null;
  }

  function isValidEntry(entry) {
    return (
      entry &&
      typeof entry === "object" &&
      typeof entry.id === "string" &&
      typeof entry.name === "string" &&
      typeof entry.text === "string" &&
      normaliseRating(entry.rating) !== null &&
      !Number.isNaN(Date.parse(entry.createdAt))
    );
  }

  /* ---------- Storage (backend आने पर सिर्फ़ ये दो functions बदलें) ---------- */

  function readStored() {
    try {
      const parsed = JSON.parse(
        localStorage.getItem(CONFIG.STORAGE_KEY) || "[]",
      );
      return Array.isArray(parsed) ? parsed.filter(isValidEntry) : [];
    } catch {
      return [];
    }
  }

  function writeStored(list) {
    try {
      localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify(list.slice(0, CONFIG.MAX_STORED)),
      );
      return true;
    } catch {
      return false;
    }
  }

  /* ---------- Public API ---------- */

  function getAll() {
    const demo = CONFIG.SHOW_DEMO_FEEDBACK ? DEMO_FEEDBACKS : [];

    // नया feedback हमेशा सबसे पहले (1 नंबर पर)
    return [...readStored(), ...demo].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }

  function getForHome() {
    return getAll().slice(0, CONFIG.HOME_LIMIT);
  }

  function getRemainingCount() {
    return Math.max(0, getAll().length - CONFIG.HOME_LIMIT);
  }

  function getCooldownLeftMs() {
    try {
      const last = Number(localStorage.getItem(CONFIG.LAST_SUBMIT_KEY)) || 0;
      return Math.max(0, CONFIG.COOLDOWN_MS - (Date.now() - last));
    } catch {
      return 0;
    }
  }

  function add({ name, rating, text }) {
    const cleanName = cleanText(name).slice(0, CONFIG.MAX_NAME_LENGTH);
    const cleanFeedback = cleanText(truncateWords(text));
    const cleanRating = normaliseRating(rating);

    if (cleanName.length < 2) {
      return { ok: false, field: "name", message: "Please enter your name." };
    }

    if (cleanRating === null) {
      return {
        ok: false,
        field: "rating",
        message: "Please choose a rating.",
      };
    }

    if (countWords(cleanFeedback) < CONFIG.MIN_WORDS) {
      return {
        ok: false,
        field: "text",
        message: `Please write at least ${CONFIG.MIN_WORDS} words.`,
      };
    }

    const entry = {
      id: `u-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: cleanName,
      rating: cleanRating,
      text: cleanFeedback,
      createdAt: new Date().toISOString(),
    };

    if (!writeStored([entry, ...readStored()])) {
      return {
        ok: false,
        field: "form",
        message: "Could not save your feedback. Please try again.",
      };
    }

    try {
      localStorage.setItem(CONFIG.LAST_SUBMIT_KEY, String(Date.now()));
    } catch {
      // cooldown सिर्फ़ एक सुरक्षा है, न मिले तो भी चलेगा
    }

    window.dispatchEvent(
      new CustomEvent("msc:feedback-added", { detail: entry }),
    );

    return { ok: true, entry };
  }

  window.MSCFeedback = Object.freeze({
    config: CONFIG,
    getAll,
    getForHome,
    getRemainingCount,
    getCooldownLeftMs,
    add,
    countWords,
    truncateWords,
  });
})();
