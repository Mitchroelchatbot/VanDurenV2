/* ============================================================
   Van Duren Padel Academy — gedeelde header + footer
   Eén plek om de navigatie te onderhouden. Vanilla JS, geen build.
   Injecteert <header> aan de top van <body> en <footer> onderaan.
   ============================================================ */
(function () {
  "use strict";

  /* Externe links die moeten blijven (zie CONTENT.md) */
  var PLAYTOMIC =
    "https://playtomic.io/van-duren-indoor-padel-centrum/a52205f6-6954-4d82-bda0-b2040fc82dc4";
  var FACEBOOK =
    "https://www.facebook.com/Van-Duren-indoor-padelcentrum-1100566347259945/";
  var MAPS =
    "https://www.google.com/maps/search/?api=1&query=Wolverstraat+2+5691+PV+Son+en+Breugel";

  /* Hoofdnavigatie (CONTENT.md: Banen · Lessen · Bedrijven · Evenementen · Contact) */
  var MAIN = [
    { label: "Banen",       href: "/baanhuur" },
    { label: "Lessen",      href: "/trainingen" },
    { label: "Bedrijven",   href: "/clinics" },
    { label: "Evenementen", href: "/evenementen" },
    { label: "Contact",     href: "/contact" }
  ];

  /* Dropdown "Meer": Team · Sponsoren · FAQ · Nieuwsbrief · Padelregels */
  var MORE = [
    { label: "Team",        href: "/team" },
    { label: "Sponsoren",   href: "/sponsoren" },
    { label: "FAQ",         href: "/faq" },
    { label: "Nieuwsbrief", href: "/nieuwsbrief" },
    { label: "Padelregels", href: "/regels" }
  ];

  /* Favicon één keer centraal zetten (geen <link> in elke pagina nodig) */
  if (!document.querySelector('link[rel="icon"]')) {
    var icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/svg+xml";
    icon.href = "/assets/favicon.svg";
    document.head.appendChild(icon);
  }

  /* Hero-watermerk centraal injecteren: enorme laag-contrast "VAN DUREN"
     achter de content. Eerste kind van .hero, achter .hero__inner, aria-hidden
     en pointer-events:none zodat het puur decoratief is. */
  var hero = document.querySelector(".hero");
  if (hero && !hero.querySelector(".hero__watermark")) {
    var wm = document.createElement("span");
    wm.className = "hero__watermark";
    wm.setAttribute("aria-hidden", "true");
    wm.textContent = "Van Duren";
    hero.insertBefore(wm, hero.firstChild);
  }

  /* Motion-laag centraal laden (GSAP + ScrollTrigger + Lenis).
     Alleen wanneer html.motion gezet is — d.w.z. JS aan én geen reduced-motion.
     Reduced-motion/no-JS laden dit bestand nooit: geen smooth scroll, geen animaties. */
  if (document.documentElement.classList.contains("motion")) {
    var motion = document.createElement("script");
    motion.src = "/assets/site-motion.js";
    motion.defer = true;
    document.head.appendChild(motion);
  }

  /* Huidige pad normaliseren (cleanUrls: /baanhuur, root = /) */
  var path = location.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  if (path === "" || path === "/index") path = "/";

  function isActive(href) {
    return href === path || (href !== "/" && path.indexOf(href) === 0);
  }
  function links(items) {
    return items
      .map(function (i) {
        return (
          '<a href="' + i.href + '"' +
          (isActive(i.href) ? ' class="is-active" aria-current="page"' : "") +
          ">" + i.label + "</a>"
        );
      })
      .join("");
  }

  /* ---------- Header ---------- */
  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<a class="skip-link" href="#main">Direct naar inhoud</a>' +
    '<div class="container nav">' +
      '<a class="nav__brand" href="/">' +
        '<span class="dot"></span>' +
        '<span>Van Duren<small>Padel Academy</small></span>' +
      "</a>" +
      '<button class="nav__toggle" aria-label="Menu" aria-expanded="false">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>' +
      "</button>" +
      '<ul class="nav__links">' +
        links(MAIN).replace(/<a /g, "<li><a ").replace(/<\/a>/g, "</a></li>") +
        '<li class="nav__more">' +
          '<button aria-expanded="false">Meer</button>' +
          '<div class="nav__dropdown">' + links(MORE) + "</div>" +
        "</li>" +
        '<li class="nav__cta"><a class="btn btn--primary" href="' + PLAYTOMIC + '" target="_blank" rel="noopener">Reserveer baan</a></li>' +
      "</ul>" +
    "</div>";
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- Footer ---------- */
  var footer = document.createElement("footer");
  footer.className = "site-footer footer";
  footer.innerHTML =
    '<div class="container">' +
      '<div class="footer-grid">' +
        '<div class="footer-brand">' +
          "<p><span class=\"dot\"></span><strong>Van Duren Padel Academy</strong></p>" +
          "<address>" +
            "Wolverstraat 2<br>5691 PV Son en Breugel<br>" +
            '<a href="mailto:vanduren@indoorpadelcentrum.nl">vanduren@indoorpadelcentrum.nl</a><br>' +
            '<a href="' + FACEBOOK + '" target="_blank" rel="noopener">Facebook</a>' +
          "</address>" +
        "</div>" +
        '<div><h4>Sport</h4><ul>' +
          '<li><a href="/baanhuur">Baanhuur</a></li>' +
          '<li><a href="/trainingen">Trainingen</a></li>' +
          '<li><a href="/clinics">Clinics</a></li>' +
          '<li><a href="/evenementen">Evenementen</a></li>' +
          '<li><a href="/regels">Padelregels</a></li>' +
        "</ul></div>" +
        '<div><h4>Over ons</h4><ul>' +
          '<li><a href="/team">Team</a></li>' +
          '<li><a href="/sponsoren">Sponsoren</a></li>' +
          '<li><a href="/faq">FAQ</a></li>' +
          '<li><a href="/contact">Contact</a></li>' +
        "</ul></div>" +
        '<div><h4>Nieuwsbrief</h4>' +
          "<p>Blijf op de hoogte van clinics, toernooien en daluur-acties.</p>" +
          '<form class="inline-form" data-newsletter novalidate>' +
            '<input type="email" name="email" placeholder="Jouw e-mailadres" required aria-label="E-mailadres">' +
            '<button class="btn btn--primary" type="submit">Aanmelden</button>' +
          "</form>" +
          '<p class="form-status" data-newsletter-status></p>' +
        "</div>" +
      "</div>" +
      '<div class="footer-bottom">' +
        "<span>© " + new Date().getFullYear() + " Van Duren Padel Academy · Son en Breugel</span>" +
        "<span>Website door Mr. Hostly</span>" +
      "</div>" +
    "</div>";
  document.body.appendChild(footer);

  /* ---------- Gedrag: mobiel menu + dropdown ---------- */
  var toggle = header.querySelector(".nav__toggle");
  toggle.addEventListener("click", function () {
    var open = header.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  var more = header.querySelector(".nav__more");
  var moreBtn = more.querySelector("button");
  moreBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = more.classList.toggle("open");
    moreBtn.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", function (e) {
    if (!more.contains(e.target)) more.classList.remove("open");
  });

  /* ---------- Nieuwsbrief: client-side bevestiging ----------
     LET OP: dit verstuurt niets (net als de oude site). Vraag de klant
     of er een echte mail/opslag-backend moet komen voordat je dit koppelt. */
  document.querySelectorAll("form[data-newsletter]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.parentNode.querySelector("[data-newsletter-status]") ||
                   document.querySelector("[data-newsletter-status]");
      var email = form.querySelector('input[type="email"]');
      if (!email.value || email.value.indexOf("@") === -1) {
        if (status) status.textContent = "Vul een geldig e-mailadres in.";
        return;
      }
      form.reset();
      if (status) status.textContent = "Bedankt! Je staat op de lijst. (Demo — nog geen echte verzending.)";
    });
  });

  /* ---------- Contactformulier: client-side bevestiging ----------
     Net als de oude site verstuurt dit (nog) niets. Vraag de klant of er
     een echte mail/opslag-backend moet komen voordat je dit koppelt. */
  document.querySelectorAll("form[data-contact]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-contact-status]");
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.reset();
      if (status) status.textContent =
        "Bedankt voor je bericht! We reageren doorgaans binnen één werkdag. " +
        "(Demo — dit formulier verstuurt nog geen e-mail.)";
    });
  });
})();
