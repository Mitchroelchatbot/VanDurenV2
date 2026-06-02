/* ============================================================
   Van Duren Padel Academy — motion-laag
   GSAP + ScrollTrigger (subtiele reveals) + Lenis (smooth scroll).
   Eén centrale plek; werkt op elke pagina via site-chrome.js.

   Filosofie: terughoudend, in de geest van stripe.com. Weinig beweging,
   maar precies goed. Fade + lichte translateY, korte stagger, één keer.

   Beweging draait ALLEEN wanneer html.motion gezet is (zie <head>-flag):
   JS aan én geen prefers-reduced-motion. Dit bestand wordt door
   site-chrome.js ook alléén dan ingeladen — reduced-motion/no-JS krijgen
   dus geen smooth scroll en geen animaties (harde eis).
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;

  /* Dubbele veiligheid: stop direct als motion niet gewenst is. */
  if (!root.classList.contains("motion")) return;
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.remove("motion");
    return;
  }

  /* Vaste versies — geen "latest", zodat een library-update de site niet breekt. */
  var CDN = {
    gsap:          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
    scrollTrigger: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
    lenis:         "https://cdnjs.cloudflare.com/ajax/libs/lenis/1.1.14/lenis.min.js"
  };

  /* Failsafe: laadt de CDN niet (offline/geblokkeerd/traag), dan tonen we
     gewoon de statische site. We halen html.motion weg → de pre-hide-CSS
     vervalt → alle content wordt direct zichtbaar. */
  var settled = false;
  function bail() {
    if (settled) return;
    settled = true;
    root.classList.remove("motion");
  }
  var failTimer = setTimeout(bail, 3000);

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = false; // volgorde bewaren (gsap vóór ScrollTrigger)
      s.onload = resolve;
      s.onerror = function () { reject(new Error("kon niet laden: " + src)); };
      document.head.appendChild(s);
    });
  }

  /* GSAP eerst, dan ScrollTrigger (afhankelijk van GSAP); Lenis parallel. */
  Promise.all([
    loadScript(CDN.gsap).then(function () { return loadScript(CDN.scrollTrigger); }),
    loadScript(CDN.lenis)
  ])
    .then(function () {
      clearTimeout(failTimer);
      if (settled) return;            // timeout was al getriggerd
      if (!window.gsap || !window.ScrollTrigger || !window.Lenis) { bail(); return; }
      settled = true;
      init();
    })
    .catch(function () {
      clearTimeout(failTimer);
      bail();
    });

  function init() {
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Lenis: lichte, gedempte smooth scroll ----------
       lerp 0.1  = zachte demping, niet zwaar/traag.
       smoothWheel: muiswiel op desktop wordt smooth.
       syncTouch:false = op mobiel gewoon native scrollen → niet sloom.
       Lenis' eigen raf koppelen we aan gsap.ticker zodat alles synchroon
       loopt met ScrollTrigger. */
    var lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    /* In-page ankers (bijv. de skip-link naar #main) netjes via Lenis. */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -70 });
      });
    });

    var EASE = "power2.out";

    /* ---------- Hero: subtiele fade-up bij laden (geen scroll nodig) ---------- */
    var heroItems = gsap.utils.toArray(".hero__inner > *");
    if (heroItems.length) {
      gsap.to(heroItems, { opacity: 1, y: 0, duration: 0.7, ease: EASE, stagger: 0.08, delay: 0.05 });
    }

    /* ---------- Grids: kaarten met korte stagger bij in-scroll ---------- */
    gsap.utils.toArray(".stats, .grid").forEach(function (grid) {
      gsap.to(Array.prototype.slice.call(grid.children), {
        opacity: 1, y: 0, duration: 0.6, ease: EASE, stagger: 0.06,
        scrollTrigger: { trigger: grid, start: "top 85%", once: true }
      });
    });

    /* ---------- Losse blokken: eenvoudige fade-up bij in-scroll ---------- */
    gsap.utils.toArray(".section__head, .split > div, .media-placeholder").forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.7, ease: EASE,
        scrollTrigger: { trigger: el, start: "top 85%", once: true }
      });
    });

    /* Lay-out kan na font-load/injectie verschuiven → triggers herberekenen. */
    ScrollTrigger.refresh();
  }
})();
