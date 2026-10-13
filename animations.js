/*!
 * animations.js — Maa Sharda Cyber
 * GSAP + ScrollTrigger scroll animations (mobile-first)
 *
 * - Neeche scroll karo  -> elements neeche se upar aate hain
 * - Upar scroll karo    -> elements upar se neeche aate hain (animation dobara chalta hai)
 * - Sirf transform + opacity animate hota hai (GPU friendly, no layout lag)
 * - Mobile par chhoti distance + kam duration, desktop par thodi badi
 * - prefers-reduced-motion ON ho to koi animation nahi (content seedha dikhega)
 *
 * Kaise lagayein (har HTML page me </body> se pehle, apni baaki JS files ke baad):
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
 *   <script src="animations.js"></script>
 *
 * Kisi bhi element ko manually animate karna ho to HTML me likho:
 *   data-anim="up | down | left | right | zoom | fade"
 * Kisi element ko animation se bahar rakhna ho:
 *   data-no-anim
 */
(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('[animations.js] GSAP ya ScrollTrigger load nahi hua. CDN script tags check karo.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  // Mobile par address bar hide/show hone se refresh na ho (jitter / lag se bachata hai)
  ScrollTrigger.config({ ignoreMobileResize: true });

  var mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: '(max-width: 767px)',
      isDesktop: '(min-width: 768px)',
      reduceMotion: '(prefers-reduced-motion: reduce)'
    },
    function (context) {
      var c = context.conditions;
      if (c.reduceMotion) return;
      return init(c.isMobile);
    }
  );

  function init(isMobile) {
    /* ---------- Settings ---------- */
    var DIST = isMobile ? 28 : 48;          // kitna door se aayega (px)
    var DUR = isMobile ? 0.6 : 0.85;        // animation ka time (sec)
    var STAGGER = isMobile ? 0.07 : 0.1;    // cards ke beech gap
    var EASE = 'power3.out';

    var used = []; // jo elements pehle se animate ho rahe hain (double animation se bachne ke liye)

    /* Mobile par side se aane wale elements horizontal scrollbar na banayein */
    var prevOverflow = document.body.style.overflowX;
    document.body.style.overflowX = 'clip';

    /* ---------- Helpers ---------- */
    function isUsable(el) {
      var cs = getComputedStyle(el);
      return cs.display !== 'none' && cs.position !== 'fixed' && cs.position !== 'sticky';
    }

    function isBlocked(el, allowNested) {
      var p = el.parentElement;
      // Swiper ke andar ke slides ko mat chhedo (Swiper apna transform khud use karta hai)
      if (p && p.closest('.swiper, .success-flash, [data-no-anim]')) return true;
      if (el.closest('[data-no-anim]')) return true;
      if (!isUsable(el)) return true;
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
     * Core: ScrollTrigger.batch (bahut saare cards ke liye fast aur smooth)
     *  onEnter      -> neeche scroll karte hue aaya   : neeche se upar animate
     *  onLeave      -> upar nikal gaya                : hide (screen ke bahar hai)
     *  onEnterBack  -> upar scroll karte hue wapas aaya: upar se neeche animate
     *  onLeaveBack  -> neeche chala gaya              : hide (screen ke bahar hai)
     */
    function reveal(els, o) {
      if (!els.length) return;
      o = o || {};
      var x = o.x || 0;
      var y = o.y === undefined ? DIST : o.y;
      var scale = o.scale || 1;
      var stagger = o.stagger === undefined ? STAGGER : o.stagger;

      gsap.set(els, { opacity: 0, x: x, y: y, scale: scale });

      function play(batch) {
        gsap.to(batch, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: DUR,
          ease: EASE,
          stagger: stagger,
          delay: o.delay || 0,
          overwrite: true,
          onStart: function () {
            gsap.set(batch, { willChange: 'transform, opacity' });
          },
          // Animation ke baad inline transform hata do, taaki CSS hover effects kaam karein
          clearProps: 'transform,willChange'
        });
      }

      ScrollTrigger.batch(els, {
        start: o.start || 'top 90%',
        end: 'bottom top',
        interval: 0.1,
        batchMax: 6,
        onEnter: play,
        onEnterBack: play,
        onLeave: function (batch) {
          gsap.set(batch, { opacity: 0, x: -x, y: -y, scale: scale });
        },
        onLeaveBack: function (batch) {
          gsap.set(batch, { opacity: 0, x: x, y: y, scale: scale });
        }
      });
    }

    /* ---------- 1) Manual: data-anim="..." ---------- */
    var presets = {
      up: { y: DIST },
      down: { y: -DIST },
      left: { x: -DIST, y: 0 },
      right: { x: DIST, y: 0 },
      zoom: { scale: 0.9, y: 0 },
      fade: { y: 0 }
    };
    Object.keys(presets).forEach(function (key) {
      reveal(pick('[data-anim="' + key + '"]'), presets[key]);
    });

    /* ---------- 2) Header (sirf page load par ek baar) ---------- */
    var header = document.querySelector('.site-header');
    if (header && !header.hasAttribute('data-no-anim')) {
      gsap.from(header, {
        opacity: 0,
        y: -16,
        duration: 0.6,
        ease: EASE,
        clearProps: 'transform,opacity'
      });
    }

    /* ---------- 3) Repo ke exact classes (about.html) ---------- */

    // Hero
    reveal(
      pick(
        '.hero-copy .eyebrow, .hero-copy h1, .hero-copy .hero-description, ' +
        '.hero-copy .primary-button, .hero-copy .trust-row'
      ),
      { stagger: STAGGER * 1.4 }
    );
    reveal(pick('.logo-scene'), { scale: 0.92, y: DIST * 0.6, delay: 0.15 });
    reveal(pick('.logo-caption', true), { y: 12, delay: 0.4 });
    reveal(pick('.scene-tag', true), { y: 12, scale: 0.85, delay: 0.55, stagger: 0.15 });

    // Section headings
    reveal(pick('.section-intro, .reviews-head'));

    // Why choose us
    reveal(pick('.reason-card'));
    reveal(pick('.working-days'), { y: DIST * 0.7, scale: 0.96 });

    // Reviews
    reveal(pick('.feedback-swiper'));
    reveal(pick('.carousel-controls'), { y: DIST * 0.5 });

    // Feedback form
    reveal(pick('.feedback-prompt'), isMobile ? { y: DIST } : { x: -DIST, y: 0 });
    reveal(pick('.feedback-form .form-field, .feedback-form .submit-button'), {
      y: DIST * 0.7,
      stagger: STAGGER * 0.8
    });

    // Footer
    reveal(pick('.site-footer'), { y: DIST * 0.5 });

    /* ---------- 4) Baaki pages ke liye auto-detect (index, pricing, categories, contact...) ---------- */
    reveal(pick('main section h1, main section h2, main section h3, .section-title, .section-heading, .section-head, .section-header'));
    reveal(pick('main [class*="grid"] > *, main [class*="cards"] > *'));
    reveal(pick('main [class*="card"], main [class*="plan"], main [class*="category"], main article'));
    reveal(pick('main form, main table'));

    /* ---------- 5) Desktop par halka parallax (mobile par band, lag na ho) ---------- */
    if (!isMobile) {
      var orbOne = document.querySelector('.hero-orb.orb-one');
      var orbTwo = document.querySelector('.hero-orb.orb-two');
      if (orbOne) {
        gsap.to(orbOne, {
          y: -90,
          ease: 'none',
          scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
        });
      }
      if (orbTwo) {
        gsap.to(orbTwo, {
          y: 70,
          ease: 'none',
          scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: 0.6 }
        });
      }
    }

    // Breakpoint badalne par (rotate / resize) GSAP khud sab revert karega
    return function () {
      document.body.style.overflowX = prevOverflow;
    };
  }

  /* ---------- Layout badalne par positions dobara calculate karo ---------- */
  function refresh() {
    ScrollTrigger.refresh();
  }

  window.addEventListener('load', refresh);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

  // Dynamic content (jaise feedback cards jo JS se aate hain) aane par height badalti hai
  if ('ResizeObserver' in window) {
    var timer;
    new ResizeObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(refresh, 250);
    }).observe(document.body);
  }
})();
