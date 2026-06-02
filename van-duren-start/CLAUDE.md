# CLAUDE.md — Van Duren Padel Academy

## Wat dit is
Je herbouwt de website voor **Van Duren Padel Academy** (indoor padel, Son en Breugel),
gemaakt door bureau **Mr. Hostly**. Alle echte teksten, prijzen, openingstijden, adres,
namen en de boekingslink staan in **CONTENT.md** — gebruik dat als enige bron van waarheid.
Verzin geen feiten. Wat niet in CONTENT.md staat, laat je weg of markeer je als TODO.

## Doel
Een **snelle, eenvoudige, onderhoudbare** statische website. Liever saai-en-degelijk
dan slim-en-fragiel. De vorige versie ging mis door onnodige complexiteit (zie hieronder).

## Hard te vermijden (dit ging eerder fout)
1. **GEEN alles-in-één bundel.** De vorige site was één 3,8 MB HTML-bestand met een
   in-browser compiler (Babel) die bij elke paginalading draaide. Nooit meer doen.
2. **GEEN in-browser build-tools.** Geen `cdn.tailwindcss.com` dat in de browser compileert,
   geen Babel-in-de-browser. Als je Tailwind gebruikt: genereer vooraf één statisch CSS-bestand.
3. **GEEN externe/tijdelijke afbeeldings-URL's.** De vorige achtergrond verwees naar een
   tijdelijke Google-URL (lh3.googleusercontent.com) die kan verdwijnen. Alle afbeeldingen
   lokaal in `assets/`.
4. **GEEN base64-assets in de HTML.** Afbeeldingen en fonts als losse, cachebare bestanden.
5. **GEEN ongebruikte zware assets.** Het oude icoonfont was 1,1 MB voor ~19 iconen; de foto
   was 1,35 MB PNG. Houd assets klein (foto is al geoptimaliseerd: assets/martin-van-duren.webp, 45 KB).

## Voorkeursaanpak (tenzij anders gevraagd)
- **Losse, statische HTML-pagina's** — één bestand per pagina, geen verplichte buildstap.
- **Eén gedeelde header/footer** via een klein vanilla-JS-bestand dat ze injecteert
  (zoals de oude `site-chrome.js` deed) OF via server-side includes als je toch een build doet.
  Doel: niet dezelfde header in tien bestanden kopiëren.
- **CSS:** één statisch `assets/site.css`. Mag Tailwind zijn, maar dan vooraf gecompileerd
  naar een statisch bestand — niet de browser-CDN.
- **Fonts lokaal** in `assets/` (Lexend, Inter), gesubset. Niet via CDN als "alles in eigen
  beheer" het doel is.
- **Iconen:** losse inline SVG's of een klein gesubset icoonbestand — geen volledig icoonfont.

## Pagina's te bouwen
index (home) · Baanhuur · Trainingen · Clinics · Evenementen · Contact ·
Team · Sponsoren · FAQ · Nieuwsbrief · Regels (padelregels).
Inhoud per pagina staat in CONTENT.md. Home moet `index.html` heten (Vercel serveert die als root).

## Externe koppelingen die moeten blijven
- Boekingen → Playtomic-link (in CONTENT.md). Niet vervangen, niet lokaal namaken.
- Google Maps route-link naar het adres.
- Nieuwsbrief/contactformulier: de oude versie deed alleen een client-side "Bedankt!"
  (geen echte verzending). Als er echte mail/opslag moet komen, vraag dat na — verzin geen backend.

## Deploy
Statische hosting op Vercel (repo gekoppeld aan GitHub). Geen SPA-rewrite: elke pagina is een
echt bestand. Een simpele `vercel.json` met `cleanUrls` volstaat.

## Beschikbaar in deze map
- `CONTENT.md` — alle feiten en teksten
- `assets/martin-van-duren.webp` — geoptimaliseerde coach-foto (klaar voor gebruik)
- (achtergrondfoto banenhal ontbreekt — de oude was een tijdelijke externe URL; vraag de klant
  om een echte foto en zet die als `assets/court-bg.jpg`, of gebruik een donkere gradient)
