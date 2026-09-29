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

## Database and photo hosting

The catalogue lives in **Neon** (serverless Postgres) and the photographs in
**Cloudinary**, so the admin panel edits the live site. Both have free tiers
that comfortably cover a nursery this size, and neither needs a card.

The browser never holds a database credential. Pages call this project's own
`/api` routes, which run as serverless functions and keep the connection string
server-side.

**[`NEON-SETUP.md`](NEON-SETUP.md) walks through it end to end** — about twenty
minutes, once, and four values in total.

The site runs without any of it, serving the catalogue compiled into the bundle.
That keeps local development and preview builds working with no credentials, and
it is what visitors fall back to if the database is ever unreachable.

## Deploying

**Vercel** — `vercel.json` handles SPA rewrites, caching and security headers,
and the `api/` folder becomes serverless functions automatically. Add the four
environment variables from `.env.example` under Settings → Environment
Variables, then **redeploy** — Vercel bakes them in at build time, so a variable
added after a deploy does nothing until you rebuild.

**Bluehost / Apache** — upload the contents of `dist/` to `public_html`. The
`.htaccess` in `public/` is copied into the build and handles HTTPS forcing, the
www redirect, SPA routing, compression and caching.

⚠️ **The admin panel will not work on plain Apache hosting.** It needs the
`api/` folder running as functions, which static hosting cannot do. The public
site works perfectly — it falls back to the catalogue compiled into the bundle —
but nothing can be edited. Use Vercel, Netlify or Cloudflare Pages for the
editable version.

Either way, submit `https://ganeshnursery.co.in/sitemap.xml` in Google Search Console
once it's live.

## Project structure

```
src/
  data/
    site.js         business details — the fallback the site ships with
    plants.js       catalogue — the fallback, and what the seed script loads
    content.js      services, blog posts, clients, testimonials
  lib/
    api.js          the browser's whole view of the backend: four fetch calls
    cloudinary.js   photo delivery URLs (resize, format) and uploads
    photos.js       browser-side resizing, then upload; one call for the panel
  context/
    ContentContext  every page's plants and business details come from here
    AuthContext     the admin login
    ThemeContext    light / dark / match-device
    EnquiryContext  the multi-plant enquiry list (localStorage-backed)
  components/       Header, Footer, cards, Seo, SmartImage, drawer, lightbox…
  pages/            one file per route
  App.jsx           routes, scroll behaviour, route announcements
  styles.css        full design system, tokens at the top
api/                serverless functions — the only code that sees the database
  _lib/db.js        Neon client, and row <-> app shape conversion
  _lib/auth.js      password check, signed httpOnly session cookie
  plants.js         GET public, POST/DELETE signed in
  site.js           GET public, PUT signed in
  auth.js           sign in, sign out, am-I-signed-in
scripts/
  generate-sitemap.mjs   runs automatically after every build
  init-neon.mjs          creates the tables and loads the 23 plants (npm run db:init)
reference/          design mockups (NOT deployed — outside public/)
```

## Notes for whoever works on this next

- All spacing, colour and type values are CSS custom properties at the top of
  `styles.css`. Change tokens, not individual rules.
- Colour contrast was checked against WCAG AA. `--gold` is the accessible gold for
  small text; `--gold-bright` is for icons and large display text only.
- `SmartImage` should be used for any content photo — it reserves layout space,
  falls back gracefully when an image fails to load, and builds the responsive
  `srcset` itself (Cloudinary widths for uploaded photos, the `-sm` pair for
  files in `/public`). Callers pass a plain `src` and nothing else.
- `ContentContext` and `src/lib/api.js` are the only files that know where
  content comes from. The backend has now changed twice without a single
  component being touched, which is the point of the arrangement.
- Nothing in `api/` may ever be imported by `src/`. That folder runs on the
  server and reads `DATABASE_URL`; importing it into a component would compile
  the connection string into the browser bundle.
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

Go to **`/admin`** and sign in with your `ADMIN_PASSWORD`.
Full setup: **[`NEON-SETUP.md`](NEON-SETUP.md)**.

### What you can edit

| Section | Covers |
|---|---|
| **Plants** | Add, edit and delete any plant — name, Tamil name, botanical name, category, description, key points, growing guide, seed source, mother tree, growing conditions, photos, and every size row (height, age, bag weight, price, offer price, note, and that size's own photos) |
| **Details** | Business name, tagline, proprietor, founded year, both phone numbers, WhatsApp number, email, opening hours, full address, Maps search, price-validity note |
| **Theme** | Light, dark or match-device |
| **Database** | Connection status, what is stored, refresh, backup guidance |

Years of experience is **calculated** from the founded year, so "46+ years"
never goes stale.

### Saving is live

Press Save and every visitor sees it on their next page load. There is no file
to download, nothing to commit, no deploy. A change made on a phone in the
nursery is on the office laptop straight away.

Two services carry it, and they do different jobs:

- **Neon** (serverless Postgres) holds the text, prices and sizes.
- **Cloudinary** holds the photographs and serves them from a CDN, resized per
  device — one upload answers a 320px phone card and a 1400px desktop gallery.

Photos are resized in the browser *before* upload, so posting a picture from
the nursery costs about 300 KB of mobile data rather than 5 MB.

### About the login

This is a real login now. One password, held as an environment variable on the
server, checked there and never sent back to the browser. What the browser gets
is a signed `httpOnly` cookie it can neither read nor forge, and every write is
re-checked against it server-side — so getting past the login screen is not, on
its own, enough to change anything.

To change the password: Vercel → Settings → Environment Variables →
`ADMIN_PASSWORD` → redeploy. That signs everyone out, because the cookie's
signing key is derived from the password.

One password rather than per-person accounts is a deliberate choice: one person
edits this site, and a users table with hashing, resets and invites is a lot of
machinery to record which of the one people made a change. If the nursery takes
on staff who edit prices, `api/_lib/auth.js` is where that would go.

### If the database goes down

The site keeps working. Every page starts from the catalogue compiled into the
bundle, then swaps in live data once it arrives; if that fetch fails, the
bundled copy simply stays. Visitors see slightly stale prices rather than an
empty shop, and the Database tab says what happened.

### Local development

`npm run dev` serves the `/api` functions too, through a small Vite plugin in
`vite.config.js`. One command, and the admin panel works locally against the
real Neon database — no `vercel dev` alongside it.

## Plant photos

Each plant carries up to **5 photos** (the first is the main one shown on the
catalogue card), and **each size carries up to 3 of its own**. When a customer
picks "4 ft" on the product page, that size's photos lead the gallery, so they
see the tree they are actually buying rather than a generic shot of the species.

Add them in the admin panel under a plant, or by putting files in
`/public/plants/` and referencing them by path.

**Prefer the path option for photos you intend to keep.** Uploaded photos are
stored inline in the content file as base64. They are compressed in the browser
first (resized to 1200px), but five of them still weigh far more than five file
paths, and that file ships to every visitor. The Publish tab shows the current
size and warns past 2 MB.

Small variants for responsive loading are generated with:

```bash
node -e "
const sharp=require('sharp'), fs=require('fs');
for (const f of fs.readdirSync('public/plants')) {
  if (!/\.jpe?g$/i.test(f) || f.includes('-sm.')) continue;
  sharp('public/plants/'+f).resize({width:600,withoutEnlargement:true})
    .jpeg({quality:78,mozjpeg:true}).toFile('public/plants/'+f.replace(/\.jpe?g$/i,'-sm.jpg'));
}"
```
