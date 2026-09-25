# Ganesh Nursery — Website

React + Vite site for Ganesh Nursery, Thanjavur.

**Read [`AUDIT.md`](./AUDIT.md) first** — it lists what was broken in the previous
version, what changed, and the ten things that still need your input before launch.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/  (also regenerates sitemap.xml)
npm run preview  # serve the production build locally
```

Node 18.18 or newer.

## Change business details

Everything — phone, WhatsApp number, address, email, hours, social links — lives in
one file:

```
src/data/site.js
```

Change it there and it updates the header, footer, contact page, About page, every
WhatsApp link, and the schema.org markup Google reads. **Two values in there are
marked CONFIRM** because the old code contained two conflicting phone numbers and
two conflicting addresses. Sort those out first.

## Change the catalogue

`src/data/plants.js` — one object per plant. Fields:

```js
{
  id, slug, name, botanical, category, price,
  size, light, water, soil,
  popular: true,           // optional — shows a "Popular" badge
  description,             // shown on the detail page and used as the meta description
  image,                   // '/plants/teak.webp' once you have real photos
  gallery: ['/a.webp', '/b.webp']   // optional extra photos for the lightbox
}
```

`slug` becomes the URL (`/plants/teak`). Old numeric links still redirect correctly.

## Change services, blog posts, clients

`src/data/content.js`. Blog posts need a `slug`, `date`, `lang` (`en` or `ta`) and a
`body` array of paragraphs — each becomes a real page at `/blogs/<slug>`.

`testimonials` is deliberately empty; the sections stay hidden until you add real ones.

## Contact form

By default the form hands the enquiry to WhatsApp with everything pre-filled.

To receive leads by email instead, copy `.env.example` to `.env` and set:

```
VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Any endpoint that accepts a JSON POST works. If the request fails, the form falls
back to WhatsApp so a lead is never lost.

## Deploying

**Vercel** — `vercel.json` handles SPA rewrites, caching and security headers. Nothing else to do.

**Bluehost / Apache** — upload the contents of `dist/` to `public_html`. The
`.htaccess` in `public/` is copied into the build and handles HTTPS forcing, the
www redirect, SPA routing, compression and caching.

Either way, submit `https://ganeshnursery.co.in/sitemap.xml` in Google Search Console
once it's live.

## Project structure

```
src/
  data/
    site.js         business details — one source of truth
    plants.js       catalogue
    content.js      services, blog posts, clients, testimonials
  context/
    EnquiryContext  the multi-plant enquiry list (localStorage-backed)
  components/       Header, Footer, cards, Seo, SmartImage, drawer, lightbox…
  pages/            one file per route
  App.jsx           routes, scroll behaviour, route announcements
  styles.css        full design system, tokens at the top
scripts/
  generate-sitemap.mjs   runs automatically after every build
reference/          design mockups (NOT deployed — outside public/)
```

## Notes for whoever works on this next

- All spacing, colour and type values are CSS custom properties at the top of
  `styles.css`. Change tokens, not individual rules.
- Colour contrast was checked against WCAG AA. `--gold` is the accessible gold for
  small text; `--gold-bright` is for icons and large display text only.
- `SmartImage` should be used for any content photo — it reserves layout space and
  falls back gracefully when an image fails to load.
- Anything in `/public` is deployed publicly. Don't put working files there.

---

## Mobile app experience (PWA)

The site installs to a phone home screen and opens full-screen with its own
icon — no Play Store, no app review, no separate codebase.

What makes it feel like an app:

- **Bottom tab bar** on phones — Home, Plants, Chat, Enquiry, Visit — always in
  thumb reach instead of behind a hamburger menu
- **Installable** via `manifest.webmanifest`; an install banner appears after a
  few seconds on supported browsers, and can be dismissed permanently
- **Works offline** — a conservative service worker caches build assets and
  images. HTML is always fetched fresh so prices and stock never go stale
- **Bottom-sheet enquiry drawer** with a grab handle, instead of a desktop-style
  side panel
- **Sticky action bar** on plant pages so "Add to enquiry" stays reachable
- Safe-area insets for notches and the iPhone home indicator, no tap-highlight
  flash, no rubber-band white gap, no iOS zoom-on-input, 16px form fields,
  press feedback on every control, horizontally scrolling category chips, and a
  two-up product grid

### Testing it locally

`npm run dev` will **not** register the service worker — that is deliberate, so
you never debug against a stale cache. To test the real app behaviour:

```bash
npm run build
npm run preview
```

Then open the preview URL on your phone (same Wi-Fi, use your machine's LAN IP,
e.g. `http://192.168.1.5:4173`). In Chrome use **⋮ → Add to home screen**.

Install prompts only appear over **HTTPS**, so on a live domain it works
automatically; on localhost Chrome treats it as secure for testing.

### One asset still needed

`public/brand/icon-maskable.png` — 512×512, with the logo inside the middle 80%
and the brand green filling the rest. Android crops icons to different shapes,
and without a maskable version yours will get clipped. Everything works without
it; it just looks better with it.

## SEO targets

The site is written around these search terms:

- best nursery in Thanjavur
- nursery in Thanjavur
- affordable plants in Thanjavur
- macadamia nuts in Thanjavur
- all plants and timber nursery

They are set in `site.js` (`keywords`), used in page titles and descriptions,
and answered properly in the FAQ block on the homepage — which also emits
FAQPage schema, so Google can show the questions directly in search results.

**Ranking is not just on-page.** Two things matter more than anything in this
codebase: claim and complete your **Google Business Profile** for the nursery
(name, address, phone, hours and photos matching this site exactly), and
collect **real Google reviews**. Those drive local map results far more than
page copy does.

## Media assets

| File | Used by | Notes |
|---|---|---|
| `public/brand/nursery-worker.jpg` | FAQ section, homepage | 377 KB, resized from a 9.2 MB original |
| `public/brand/cpt-seeds.jpg` | CPT Seeds section, homepage | 63 KB |
| `public/brand/macadamia-handover.jpg` | About page banner | 191 KB |
| `public/media/cpt-seeds-story.mp4` | CPT Seeds section | 6.7 MB, compressed from 21 MB |
| `public/media/cpt-seeds-story-poster.jpg` | Video poster frame | 24 KB |
| `public/brand/home-banner.jpg` | Hero banner, homepage | 122 KB |
| `public/gallery/*.jpg` | About page carousel (6 photos) | 1.4 MB total |

The video does **not** autoplay and does **not** preload. A poster frame stands
in until the play button is pressed, so nobody on mobile data downloads 6.7 MB
they did not ask for. It is also excluded from the service worker cache for the
same reason.

If you replace the video, re-compress it first — a raw phone recording will be
20 MB or more and will make the homepage feel broken on a slow connection:

```bash
ffmpeg -i input.mp4 -vf "scale=432:-2,fps=24" -c:v libx264 -preset veryslow \
  -crf 32 -pix_fmt yuv420p -c:a aac -b:a 48k -ac 1 -movflags +faststart output.mp4
```

---

## Admin panel

Go to **`/admin`** and enter the passphrase from `.env`
(`VITE_ADMIN_PASSPHRASE`). Change it from the default before you deploy.

### What you can edit

| Section | Covers |
|---|---|
| **Plants** | Add, edit and delete any plant — name, Tamil name, botanical name, category, description, seed source, mother tree, growing conditions, photo, and every size row (height, age, bag weight, price, offer price, note) |
| **Nursery details** | Business name, tagline, proprietor, founded year, both phone numbers, WhatsApp number, email, opening hours, full address, Maps search, price-validity note |
| **Appearance** | Light, dark or match-device theme |
| **Publish** | Export, import and reset your content |

Years of experience is **calculated** from the founded year, so "46+ years"
never goes stale.

### How publishing works — read this

This is a static site with no server. Edits you make in the panel are saved to
**localStorage in the browser you made them in**. That means:

- **You** see the changes straight away.
- **Visitors do not.** Their browsers still have the published version.

To publish: **Publish → Download content file**, drop it in as
`src/data/content-override.json`, then commit and push. Your host rebuilds and
everyone sees it. The panel shows an amber banner whenever you have edits that
have not been published yet, and warns you before closing the tab.

### About the login

The passphrase check runs in the visitor's browser, so the value is inside the
JavaScript bundle. Anyone who opens developer tools can find it. That is a
latch, not a lock.

It is acceptable here **because the panel cannot change what the public sees** —
publishing requires commit access to the repository. Nobody can deface the live
site through this screen. Still: don't reuse a password from anywhere else.

### Going further — real accounts and live editing

When you want changes to go live without a deploy, and real per-user logins,
you need a backend. The smallest sensible step from here:

1. Put the catalogue in a hosted database (Supabase and Firebase both have free
   tiers that suit a site this size).
2. Use that provider's auth for the login, so passwords are verified on their
   server, not in the browser.
3. Change `ContentContext` to read from that database instead of
   `content-override.json`. Every page already reads through this one file, so
   nothing else in the site needs to change.

Photos uploaded in the panel are stored inline as data URLs, which keeps the
export file self-contained but grows it quickly. For anything you intend to
keep, put the file in `/public/plants/` and type the path instead — the photo
field accepts either.
