# Ganesh Nursery — Code Audit & Rebuild Notes

Review of `ganesh-nursery-luxury.zip` (50 files, ~1,500 lines) and what was changed.

Issues are ranked by what they cost the business, not by how hard they were to fix.

---

## 1. Critical — these lose you money or create liability

### 1.1 The contact form threw every enquiry away

`src/pages/Contact.jsx` validated the input, showed **"Thanks! Your enquiry is ready for the nursery team"**, cleared the fields — and did nothing else. No fetch, no mailto, no endpoint. Every lead submitted through the website was silently discarded, and the customer believed it had been sent.

This is the single most expensive bug in the project.

**Fixed:** the form now POSTs to a configurable endpoint (`VITE_CONTACT_ENDPOINT` — works with Formspree, Web3Forms, a Google Apps Script, or your own API). If no endpoint is set, or the request fails, it falls back to opening WhatsApp with the message pre-filled, so a lead can never vanish. Added a honeypot field, a sending state, and an error state that tells the customer how else to reach you.

### 1.2 Two different phone numbers

- WhatsApp links used `919943199955` → +91 99431 **99955**
- The contact page displayed +91 99431 **19955**

They differ by one digit. One of them is wrong, and if it's the WhatsApp one, your primary sales channel has been pointing at the wrong number.

**Fixed:** all contact details now live in one file, `src/data/site.js`. Confirm the correct number and set it once.

### 1.3 Two different addresses

- About page: *First Block, Veilailaividu, Taluk, Gandarvakottai, Tamil Nadu 613301*
- Contact page: *Natchathira Nagar, Thanjavur, Tamil Nadu 613007*

Inconsistent name/address/phone data actively suppresses local search rankings, and it confuses customers trying to visit. The email domain was also wrong — `care@ganeshnursery.com` when you own `ganeshnursery.co.in`.

**Fixed:** single canonical address in `site.js`, used by the header, footer, contact page, About page and the schema.org markup. Pick the real one.

### 1.4 Fabricated testimonials attributed to real organisations

Six invented quotes with invented names — "R. Elangovan, Site Manager, NHAI Highway Afforestation", "Dr. S. Kannan, Estate Officer, Annamalai University" — were in the shipping code, not in a draft. The homepage then computed **"4.8 / 5 rated"** from them and displayed it as a real rating.

Publishing fabricated endorsements from named public institutions is a real legal and reputational exposure, and under India's consumer protection rules a misleading endorsement is actionable.

**Fixed:** removed entirely. The testimonial array is empty and the sections hide themselves automatically until you add real, permissioned quotes. Instructions and the exact data shape are in `src/data/content.js`.

### 1.5 Plant galleries showed the wrong plants

`plants.js` built a three-photo "gallery" for every species by borrowing photos of *other* species from the same pool:

```js
images: [p.image, pool[(i + 3) % pool.length], pool[(i + 7) % pool.length]]
```

A customer opening the Mango gallery saw a coconut. On a site selling living plants, that is a credibility problem, not a cosmetic one.

**Fixed:** each plant shows only its own photo. Add real extra photos via a `gallery: [...]` array when you have them.

### 1.6 Unverifiable superlative claims

"India's Number 1 Choice for Trees" in the footer, "the oldest and biggest timber nursery in India" in the body copy. India's CCPA guidelines on misleading advertisements treat unsubstantiated superlatives as a violation.

**Fixed:** removed the footer superlative. The "oldest and biggest" line is left in place because it's your claim to make — but be ready to evidence it, or soften it.

### 1.7 Client logos may not be usable

ISRO, BHEL, NHAI and two universities are displayed as logos, which implies endorsement. Several are government bodies with their own rules on mark usage.

**Not changed** — I don't know which are genuine customers. Flagged with a comment in `content.js`. If you can't evidence a relationship, either remove the logo or reword the section to plain text names.

---

## 2. Broken and dead functionality

| Issue | Fix |
|---|---|
| Every "Read more" on a blog card linked back to `/blogs` — the list you were already on. No article content existed. | Added real `/blogs/:slug` article pages with full bodies, dates, breadcrumbs and BlogPosting schema. |
| Footer links for Terms, Refund Policy, Shipping Policy and Privacy Policy **all pointed at `/contact`**. | Four real policy pages at `/terms`, `/refund-policy`, `/shipping-policy`, `/privacy-policy`. See §6 — they are templates that need your details. |
| Footer Facebook and Instagram links were `href="#"` — dead links that look real. | Social links now come from `site.js`; an empty handle means the icon isn't rendered at all. |
| `@vitejs/plugin-react` was a dependency but there was **no `vite.config.js`**, so it was never registered. Fast Refresh never ran — every edit did a full page reload. | Added `vite.config.js` with the plugin, build targets and vendor chunk splitting. |
| Every dependency was pinned to `"latest"`. Two installs a week apart could produce different React majors. No lockfile. | Pinned to exact versions: React 18.3.1, react-router-dom 6.30.0, Vite 5.4.11. |
| `.htaccess` handled the Apache SPA fallback but there was no Vercel config, so `/plants/3` 404'd on Vercel refresh. | Added `vercel.json` with rewrites plus cache and security headers. Hardened `.htaccess` with HTTPS forcing, www canonicalisation, compression and cache rules. |
| `ScrollToTop` used `'instant' in window` — a condition that is never true, so the flag was meaningless. It also scrolled to top on Back, losing your reading position, and swallowed `#anchor` links. | Rewrote: honours anchors, skips scroll on POP navigation, announces route changes to screen readers. |
| The mobile menu closed only via `onClick` on links — browser Back left it open. No outside-click, no Escape. | Closes on route change, outside click and Escape; focus returns to the toggle. |
| The mobile nav was positioned at a hard-coded `top: 104px`, which detached from the header as soon as the top strip wrapped. | Anchored to the header with `top: 100%`. |
| `.reveal` started at `opacity: 0`. If IntersectionObserver didn't fire — element already past the viewport, mid-scroll route change — that content stayed permanently invisible. | Added a 1.2s failsafe plus immediate-visible fallbacks for reduced-motion and unsupported browsers. |
| `EnquiryContext` trusted whatever was in localStorage. One corrupted entry (NaN quantity, missing price) poisoned the totals and the WhatsApp message. | Every stored item is validated and clamped on read. |
| Decreasing quantity at 1 did nothing, with no way to tell why. | Stepping below 1 removes the item. Also added typed quantity entry. |
| Adding a plant force-opened the drawer every time — adding five plants meant five interruptions. | Replaced with a toast confirmation that has a "View list" action. |
| Contact page background photo was `plants[7].image` — a hard-coded array index. Reorder the catalogue and the page changes. | Replaced with a real embedded Google Map. |
| The About page "map" was two dashed CSS circles with the word "Thanjavur" in them. | Real embedded map. |

---

## 3. Accessibility

- **Invalid HTML in `PlantCard`** — a `<button>` was nested inside a `<Link>`. Interactive content inside an anchor is invalid, and screen readers announced the add button as part of the link. Restructured as siblings.
- **No skip-to-content link** — keyboard users tabbed through six nav items on every page. Added.
- **No route announcement** — SPA navigation was completely silent for screen reader users. Added a live region.
- **Enquiry drawer wasn't a dialog** — no `role="dialog"`, no focus trap, no Escape key, and no body scroll lock, so the page scrolled behind it. All four added, plus focus return on close.
- **Lightbox** dumped focus at the top of the document on close. Now returns it to the trigger.
- **Menu button** had no `aria-expanded` or `aria-controls`. Added.
- **Icons dropped every prop** except `size` and `className` — any `aria-hidden` or handler passed to them silently vanished. Rewritten as forwarding components.
- **Touch targets** — the add-to-enquiry button was 32px and the quantity steppers 28px, both under the 44px minimum. Enlarged.
- **Top strip was 9px** on mobile, below any readable minimum. Now 0.68rem.

### Colour contrast

Four text colours failed WCAG AA:

| Element | Was | Ratio | Now | Ratio |
|---|---|---|---|---|
| Botanical names | `#93998A` on white | 2.6:1 ✗ | `#6C7364` | 4.91:1 ✓ |
| "Starting from" labels | `#8C9182` | 3.1:1 ✗ | `--muted` | 6.0:1 ✓ |
| Gold eyebrow text | `#A9822F` on ivory | 4.0:1 ✗ | `#8A6A22` | 4.72:1 ✓ |
| Body muted text | `#6E7568` | 4.1:1 ✗ | `#5A6154` | 6.0:1 ✓ |

The brighter gold is kept as `--gold-bright` for icons and large display text, where 3:1 is the requirement.

---

## 4. Performance

- **4.9 MB of reference screenshots shipped to production.** `public/reference/` contained eight design mockups that Vite copied straight into the build and deployed publicly. Moved to `/reference` outside `public/`.
- **Hero image loaded as a lazy CSS background.** It's the Largest Contentful Paint element — the thing Google measures. Now an eager, high-priority `<img>`.
- **No image dimensions anywhere**, so the page jumped around as photos arrived (cumulative layout shift). Every image now reserves its space via `aspect-ratio`.
- **No error handling on images.** All product photos are hot-linked from `images.unsplash.com`; one failed request left a broken-image icon inside a finished card. Added `SmartImage` with a shimmer placeholder and a branded fallback panel.
- **Single bundle.** The homepage shipped the JavaScript for the blog, contact and policy pages. Added route-level code splitting and a vendor chunk.
- **Font request trimmed** from 6 Fraunces axes + 5 Manrope weights to what the design actually uses, and made non-render-blocking.
- **Logo is a 135 KB PNG** displayed at 48×48px. Not changed — needs re-exporting. See §6.

---

## 5. SEO

The old site had **one title and one meta description for all eight pages**, no canonical URLs, no Open Graph tags, no structured data, no sitemap and no robots.txt. For a business that wants to rank for "timber saplings Tamil Nadu", this was the most expensive gap after the broken form.

Added:

- Per-page title, description and canonical URL via a zero-dependency `Seo` component
- Open Graph and Twitter cards — previously every WhatsApp share showed a blank grey card, which matters when WhatsApp is how your customers pass links around
- `GardenStore` schema with address, geo, phone and hours (this is what feeds the Google map pack)
- `Product` schema with price and currency on every plant page
- `BlogPosting`, `ItemList`, `ContactPage`, `AboutPage` schema
- `robots.txt` and a `sitemap.xml` regenerated from the real route list on every build
- Readable slugs — `/plants/teak` instead of `/plants/2`, with old numeric URLs 301-ing to the slug so nothing breaks
- Breadcrumbs with a proper hierarchy
- `lang="ta"` on the Tamil blog post, which was previously served as English

---

## 6. What still needs you

I can't do these — they need decisions or assets from your side.

1. **Confirm the phone number and address**, then set them in `src/data/site.js`. Everything else follows automatically.
2. **Real plant photography.** The current images are generic Unsplash stock, and several are not the species they're labelled as. Drop your own photos into `/public/plants/` and update the `image` field. This is the highest-value remaining task — it's a nursery site.
3. **Collect real testimonials.** After each delivery, WhatsApp the customer asking for two lines plus permission to use their name. Paste them into `content.js` and the sections turn back on.
4. **Confirm the client logos** you're entitled to display.
5. **Fill in the policy templates.** Every `[BRACKET]` in `src/pages/Policy.jsx` needs a real value, and the refund and shipping terms should be reviewed by someone qualified — those are the ones customers hold you to.
6. **Create `/public/brand/og-image.jpg`** at 1200×630 for social previews.
7. **Re-export the logo** — 135 KB for a 48px mark. A trimmed PNG or SVG should be under 10 KB.
8. **Set `VITE_CONTACT_ENDPOINT`** if you want form leads by email rather than through WhatsApp. Formspree's free tier is enough to start.
9. **Verify the geo coordinates** in `site.js` against your Google Business Profile.
10. **Add analytics.** There's currently no way to know what's working.

---

## Verification done

- Every `.js` / `.jsx` file parses cleanly (esbuild)
- Every relative import resolves, and every named and default import matches a real export
- Every CSS class referenced in JSX exists in the stylesheet
- Colour contrast ratios computed and confirmed against WCAG AA

I could not run `npm install` or a real build in this environment (no network access), so please run `npm install && npm run build` locally before deploying.
