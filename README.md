# Ganesh Nursery — Luxury React Redesign

A premium, componentised React/Vite rebuild of the Ganesh Nursery site: ivory,
sage and antique-gold palette, Fraunces + Manrope type, botanical line-art
accents, and a set of functional upgrades layered onto the original page set.

## What's new in this pass

- **Visual redesign** — new ivory/sage/gold luxury palette, Fraunces (display)
  + Manrope (body) type pairing, refined buttons, cards, icons (custom SVG set
  replacing emoji) and a botanical line-art signature motif used in the hero,
  page headers and dividers.
- **Testimonials** — a reusable `Testimonials` component with star ratings,
  shown on Home (3) and About (3 more). Content lives in `src/data/content.js`
  — **replace with real, verified client quotes before launch.**
- **Photo gallery + lightbox** — every plant now has a 3-photo gallery (built
  from the existing verified photo pool) with a click-to-zoom lightbox with
  keyboard (Esc / ←/→) and thumbnail navigation. See `src/data/plants.js` and
  `src/components/Lightbox.jsx`.
- **Scroll animations & micro-interactions** — sections and cards fade/rise
  into view on scroll (`src/components/Reveal.jsx`), respecting
  `prefers-reduced-motion`. Hover states on cards, buttons and nav links.
- **Multi-plant enquiry cart** — tap the leaf/plus icon on any plant to add it
  to a persistent enquiry list (top-right basket icon, badge count). The
  slide-in drawer lets you adjust quantities, add notes, and send everything
  as one formatted WhatsApp message. State persists in `localStorage` between
  visits (`src/context/EnquiryContext.jsx`).

## Project structure

```
src/
  data/           plant, service, blog, client & testimonial content
  context/        EnquiryContext (the enquiry cart)
  components/     shared UI: Header, Footer, cards, icons, drawer, lightbox…
  pages/          one file per route
  App.jsx         routes + providers
  main.jsx        entry point
  styles.css      full design system (tokens at the top)
```

## Brand assets (real, provided by the nursery)

- `public/brand/logo.png` — the real Ganesh Nursery logo, used in the header,
  footer and favicon.
- `public/brand/team-photo.jpg` — a real photo of nursery staff, used in the
  Home hero.
- `public/brand/community-banner.jpg` — a real photo banner of growers with
  saplings, shown on the About page.
- `public/clients/*.png` — real client logos (BHEL, Madhucon, Bharathidasan
  University, A2B, NHAI, Annamalai University, Baashyaam, ISRO), cropped from
  the supplied client sheet and shown in the "Our Clients" section on Home.

## Content to double-check before going live

- **Plant pricing & inventory** — starter dataset in `src/data/plants.js`;
  replace with the nursery's live inventory and current starting prices.
- **Testimonials** — placeholder quotes in `src/data/content.js`; swap in
  real, permissioned client testimonials.
- **Plant gallery photos** — the 2nd/3rd photo per plant is reused from the
  existing photo pool (not a literal photo of that plant); swap in real
  product photography when available.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Reference screenshots used for the original content/brand are kept in
`public/reference/`.
