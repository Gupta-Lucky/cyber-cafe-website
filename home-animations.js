/*!
 * home-animations.js — Maa Sharda Cyber (index.html)
 * Header -> Hero -> Popular Services -> Categories -> About (Reviews + Feedback)
 *        -> Contact -> Pricing -> Footer
 *
 * GSAP + ScrollTrigger | Mobile-first
 *
 * - Neeche scroll karo -> element neeche se upar aata hai
 * - Upar scroll karo   -> element upar se neeche aata hai (animation dono taraf chalta hai)
 * - Sirf transform + opacity animate hota hai, isliye lag nahi hota
 * - Mobile par chhoti distance + kam time, desktop par thodi badi
 * - prefers-reduced-motion ON ho to koi animation nahi
 *
 * index.html me </body> se pehle ye 3 lines rakho (purani animations.js hata do):
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
 *   <script src="home-animations.js"></script>
 *
 * Kisi element ko animation se bahar rakhna ho: data-no-anim
 */
(function () {
  'use strict';

  var root = document.documentElement;

  // Optional anti-flash class (README me bataya hai). Hamesha hata do taaki content kabhi chhup na jaye.
  function unlock() {
    root.classList.remove('anim-on');
  }

  if (!window.gsap || !window.ScrollTrigger) {
    unlock();
    console.warn('[home-animations.js] GSAP ya ScrollTrigger load nahi hua. CDN script tags check karo.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Mobile par address bar hide/show hone se refresh na ho (jitter se bachata hai)
  ScrollTrigger.config({ ignoreMobileResize: true });

  var mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    function (ctx) {
      var c = ctx.conditions;
      unlock();
      if (c.reduceMotion) return;
      return init(!!c.isMobile, ctx);
    }
  );

  function init(isMobile, ctx) {
    /* ---------- Settings ---------- */
    var DIST = isMobile ? 26 : 44;         // kitni door se aayega (px)
    var DUR = isMobile ? 0.6 : 0.85;       // animation time (sec)
    var STAGGER = isMobile ? 0.07 : 0.1;   // cards ke beech gap
    var EASE = 'power3.out';
    var POP = 'back.out(1.8)';             // icons ke liye halka bounce

    var used = [];
    var baseOpacity = new WeakMap();
    var disposers = [];

    // Side se aane wale elements se horizontal scrollbar na bane
    var prevOverflow = document.body.style.overflowX;
    document.body.style.overflowX = 'clip';

    /* ---------- Helpers ---------- */
    function isShown(el) {
      if (!el.getClientRects().length) return false; // display:none (khud ya parent)
      var pos = getComputedStyle(el).position;
      return pos !== 'fixed' && pos !== 'sticky';
    }

    function isBlocked(el, allowNested) {
      var p = el.parentElement;
      // Swiper / dialog / [hidden] ke andar ka kuch mat chhedo
      if (p && p.closest('.swiper, dialog, [hidden], [data-no-anim]')) return true;
      if (el.closest('[data-no-anim]') || el.hidden) return true;
      if (!isShown(el)) return true;
      for (var i = 0; i < used.length; i++) {
        var u = used[i];
        if (u === el) return true;
        if (!allowNested && (u.contains(el) || el.contains(u))) return true;
      }
      return false;
    }

    function pick(selector, allowNested) {
      var out = [];
      document.querySelectorAll(selector).forEach(function (el) {
        if (!isBlocked(el, allowNested)) {
          used.push(el);
          out.push(el);
        }
      });
      return out;
    }

    /*
     * Core animation (ScrollTrigger.batch = bahut saare cards ke liye fast)
     *  onEnter      : neeche scroll karke aaya    -> neeche se upar animate
     *  onLeave      : upar nikal gaya              -> hide (screen ke bahar)
     *  onEnterBack  : upar scroll karke wapas aaya -> upar se neeche animate
     *  onLeaveBack  : neeche chala gaya            -> hide (screen ke bahar)
     *
     * o.from : shuruaati state, jaise {y:40} ya {scale:.8} ya {scaleX:0}
     */
    function reveal(els, o) {
      if (!els.length) return;
      o = o || {};
      var from = o.from || { y: DIST };
      var to = {};
      var out = {};

      Object.keys(from).forEach(function (k) {
        to[k] = k.indexOf('scale') === 0 ? 1 : 0;
        out[k] = k === 'x' || k === 'y' ? -from[k] : from[k];
      });

      var hideIn = Object.assign({ opacity: 0, transition: 'none' }, from);
      var hideOut = Object.assign({ opacity: 0, transition: 'none' }, out);
      var stagger = o.stagger === undefined ? STAGGER : o.stagger;

      if (o.keepOpacity) {
        els.forEach(function (el) {
          baseOpacity.set(el, parseFloat(getComputedStyle(el).opacity) || 1);
        });
      }

      // transition:none -> CSS "transition: all" animation ko jelly/laggy na kare
      gsap.set(els, hideIn);

      function play(batch) {
        gsap.to(
          batch,
          Object.assign({}, to, {
            opacity: function (i, t) {
              return baseOpacity.has(t) ? baseOpacity.get(t) : 1;
            },
            duration: o.duration || DUR,
            ease: o.ease || EASE,
            stagger: stagger,
            delay: o.delay || 0,
            overwrite: true,
            onStart: function () {
              gsap.set(batch, { willChange: 'transform, opacity', transition: 'none' });
            },
            // Animation ke baad inline styles hata do, taaki CSS hover effects wapas kaam karein
            clearProps: 'transform,willChange,transition'
          })
        );
      }

      ScrollTrigger.batch(els, {
        start: o.start || 'top 90%',
        end: 'bottom top',
        interval: 0.1,
        batchMax: 6,
        onEnter: play,
        onEnterBack: play,
        onLeave: function (b) { gsap.set(b, hideOut); },
        onLeaveBack: function (b) { gsap.set(b, hideIn); }
      });
    }

    /*
     * JS se baad me bharne wale cards (jaise #pricingGrid) ke liye.
     * Jaise hi card aate hain (ya "Show all pricing" dabane par dikhte hain), unko animate kar deta hai.
     */
    function watchDynamic(containerSel, childSel, opts) {
      var container = document.querySelector(containerSel);
      if (!container) return;
      var seen = new WeakSet();
      var raf = 0;

      function scan() {
        raf = 0;
        var fresh = [];
        document.querySelectorAll(childSel).forEach(function (el) {
          if (seen.has(el) || isBlocked(el)) return; // chhupa hai to baad me dobara try hoga
          seen.add(el);
          used.push(el);
          fresh.push(el);
        });
        if (!fresh.length) return;
        var run = function () { reveal(fresh, opts); };
        if (ctx && ctx.add) ctx.add(run); else run();
      }

      function queue() {
        if (!raf) raf = requestAnimationFrame(scan);
      }

      var mo = new MutationObserver(queue);
      mo.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['hidden', 'class']
      });
      queue();

      disposers.push(function () {
        mo.disconnect();
        if (raf) cancelAnimationFrame(raf);
      });
    }

    /* =========================================================
       0) HEADER  (sirf page load par ek baar)
    ========================================================= */
    var header = document.querySelector('.header');
    if (header && !header.hasAttribute('data-no-anim')) {
      gsap.from(header, {
        opacity: 0, y: -18, duration: 0.6, ease: EASE, clearProps: 'transform,opacity'
      });
    }
    if (!isMobile) {
      gsap.from('.logo-wrapper, .desktop-nav a, .desktop-actions > *', {
        opacity: 0, y: -12, duration: 0.5, ease: EASE, stagger: 0.06, delay: 0.15,
        clearProps: 'transform,opacity'
      });
    }

    /* =========================================================
       1) HERO  (.hero)
    ========================================================= */
    reveal(pick('.hero-pill'), { from: { scaleX: 0 }, duration: 0.6, delay: 0.05 });
    reveal(pick('.hero-content h1, .hero-content p, .hero-btn'), {
      stagger: STAGGER * 1.6,
      delay: 0.1
    });
    reveal(pick('.hero-visual'), { from: { scale: 0.88 }, delay: 0.25, duration: DUR * 1.2 });

    /* =========================================================
       2) POPULAR SERVICES  (.popular-services)
    ========================================================= */
    reveal(pick('.popular-services .section-heading'), { from: { y: DIST * 0.8 } });
    reveal(pick('.servicesSwiper'));

    /* =========================================================
       3) CATEGORIES  (.category-section)
    ========================================================= */
    reveal(pick('.cat-head'), {
      from: isMobile ? { y: DIST * 0.8 } : { x: -DIST }
    });
    reveal(pick('.cat-card'));
    reveal(pick('.cat-icon', true), { from: { scale: 0.5 }, ease: POP, delay: 0.2 });

    /* =========================================================
       4) ABOUT US  (.about-section)
    ========================================================= */
    reveal(pick('.ab-bg, .ct-bg, .pr-bg'), {
      from: {}, keepOpacity: true, duration: DUR * 1.6, stagger: 0
    });

    reveal(pick('.ab-pill'), { from: { scaleX: 0 }, duration: 0.6 });
    reveal(pick('.ab-head h2'));
    reveal(pick('.ab-brand'), { from: { y: DIST * 0.6, scale: 0.9 } });
    reveal(pick('.ab-why h3'), { from: { y: DIST * 0.7 } });
    reveal(pick('.ab-reason'));
    reveal(pick('.ab-reason-icon', true), { from: { scale: 0.4 }, ease: POP, delay: 0.15 });
    reveal(pick('.ab-days'), { from: { y: DIST * 0.7, scale: 0.96 } });

    // Customer reviews (cards Swiper ke andar hain, isliye poora slider ek saath)
    reveal(pick('.rv-head'));
    reveal(pick('.reviewsSwiper'));

    // Feedback form
    reveal(pick('.fb-intro'), { from: isMobile ? { y: DIST } : { x: -DIST } });
    reveal(pick('.fb-form .fb-field, .fb-form .fb-submit'), {
      from: { y: DIST * 0.7 },
      stagger: STAGGER * 0.8
    });

    /* =========================================================
       5) CONTACT  (.contact-section)
    ========================================================= */
    reveal(pick('.ct-head h2'));
    reveal(pick('.ct-divider'), { from: { scaleX: 0 }, duration: 0.6 });
    reveal(pick('.ct-block > h3'), { from: { y: DIST * 0.7 } });
    reveal(pick('.ct-map'), { from: { y: DIST, scale: 0.96 } });
    reveal(pick('.ct-q'), { from: { y: DIST * 0.7, scale: 0.92 } });
    reveal(pick('.ct-channel-row'), { from: { y: DIST * 0.8 } });
    reveal(pick('.ct-social-grid > li'), { from: { y: DIST * 0.6, scale: 0.8 }, ease: POP });

    /* =========================================================
       6) PRICING  (.pricing-section)
    ========================================================= */
    reveal(pick('.pr-head h2'));
    reveal(pick('.pr-divider'), { from: { scaleX: 0 }, duration: 0.6 });
    reveal(pick('.pr-head p'), { from: { y: DIST * 0.7 } });
    // Pricing cards JS (pricing.js) baad me bharti hai, isliye watcher
    watchDynamic('#pricingGrid', '#pricingGrid > *', { from: { y: DIST, scale: 0.96 } });
    reveal(pick('.pr-foot'), { from: { y: DIST * 0.6 } });

    /* =========================================================
       7) FOOTER  (.site-footer)
    ========================================================= */
    reveal(pick('.ft-cta'), { from: { y: DIST, scale: 0.97 } });
    reveal(pick('.ft-cta-actions .ft-btn', true), {
      from: { y: DIST * 0.6, scale: 0.9 }, delay: 0.2
    });
    reveal(pick('.ft-brand, .ft-links, .ft-contact'));
    reveal(pick('.ft-social li', true), { from: { scale: 0.5 }, ease: POP, delay: 0.2 });
    reveal(pick('.ft-bottom'), { from: { y: DIST * 0.5 } });

    // Breakpoint badalne par GSAP khud sab revert karta hai; hum apni cheezein saaf karte hain
    return function () {
      disposers.forEach(function (d) { d(); });
      document.body.style.overflowX = prevOverflow;
    };
  }

  /* ---------- Layout badalne par positions dobara calculate karo ---------- */
  function refresh() {
    ScrollTrigger.refresh();
  }

  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  // Dynamic content (feedback cards, pricing cards, Swiper) aane par page ki height badalti hai
  if ('ResizeObserver' in window) {
    var timer;
    new ResizeObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(refresh, 250);
    }).observe(document.body);
  }
})();
