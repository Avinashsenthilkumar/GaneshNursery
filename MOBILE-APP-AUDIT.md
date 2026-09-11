# End-to-end app audit — round two

Everything below was found by reading the shipped code, not by guessing. Each
item is a real difference between "a website that works on a phone" and
"something that behaves like an app".

---

## Critical — install was broken

**The PWA could not install properly.** The manifest declared a 192×192 and a
512×512 icon, but both pointed at `logo.png`, which is **519×481 and not
square**. It also referenced `/brand/icon-maskable.png`, **which did not
exist** — a 404 on every install attempt. Chrome needs a valid 192 and 512 icon
before it will offer "Add to home screen" at all, so the install banner you
built may never have appeared on a real device.

Fixed: four purpose-built icons generated from your logo.

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 | Android install requirement |
| `icon-512.png` | 512×512 | Splash screen and app drawer |
| `icon-maskable.png` | 512×512 | Logo inside the safe 80%, brand green filling the rest so Android's circle crop doesn't clip it |
| `apple-touch-icon.png` | 180×180 | Alpha flattened onto ivory — iOS composites transparency onto **black**, which would have looked broken |

---

## Critical — Android Back threw you off the page

With the enquiry sheet, the photo viewer or the mobile menu open, pressing Back
(or using the back-swipe gesture) **navigated to the previous page** instead of
closing the sheet. A customer building an enquiry list who does the natural
thing to dismiss a sheet lost their place in the catalogue.

Every native app closes the overlay. Fixed with `useBackToClose`: opening an
overlay pushes a throwaway history entry, Back pops that entry and closes the
overlay, and closing it any other way removes the entry so Back never needs
pressing twice.

Applied to the enquiry drawer, the lightbox and the mobile menu.

---

## Major — Back lost your reading position

`navType === 'POP'` was skipped so the page wouldn't jump to the top, but
nothing restored the position either. Routes are lazily loaded, so on Back the
page hadn't painted yet and there was nothing to scroll to — you landed at the
top of a half-drawn page.

Fixed: scroll position is recorded continuously per URL, and on Back it retries
across animation frames until the document is tall enough to scroll to.

---

## Major — phones downloaded desktop-size photos

Product photos are up to 1400px. On a phone showing cards two-up, each one
occupies about **180 CSS pixels**. Nine products meant roughly **2.5 MB** of
imagery for something that needed a fraction of it.

Fixed: a 600px variant of every product and gallery photo, wired into
`srcset`/`sizes` automatically inside `SmartImage`. Phones now pull **0.63 MB
instead of 2.46 MB** — about a quarter of the bytes, with no visible difference.

---

## Moderate

- **Offline showed Chrome's dinosaur.** The service worker returned
  `Response.error()` when it had nothing cached — the clearest possible signal
  that this is a web page. Now serves a branded offline screen with a Call Us
  button.
- **The tab bar vanished on /contact.** A tab bar that disappears on one route
  is the opposite of how apps work; the point is that it's always under your
  thumb in the same place. Now persistent.
- **"Loading…" text flashed between routes.** Replaced with a skeleton that
  matches the shape of the content about to appear.
- **No tap feedback.** Adding to the enquiry list now fires a 12 ms vibration
  on Android. Silently ignored on iOS.
- **Overlays ignored the notch.** The drawer handled safe areas; the lightbox
  and install banner did not, so the close button sat under the status bar on
  a notched phone.
- **Theme colour was fixed dark** regardless of the user's light/dark setting.
  Now responds to `prefers-color-scheme`.
- **Macadamia requested a 404** on every catalogue view. Now declares no photo
  and renders the branded panel immediately.
- **Long-press selected text** in the installed app — a web tell. Disabled on
  chrome and product cards, kept where copying is useful (address, articles).
- **Sheets handed scroll to the page behind them.** Now contained.

---

## Verified clean

Every source file parses; every import resolves to a real export; no unused
imports; every CSS class used exists; every referenced asset is present; all
JSON configs are valid; the manifest meets the installability rules; the
sitemap generates 21 URLs.

I could not run `npm install` or a real browser here, so run `npm run build`
locally before pushing.

---

## Still outstanding — needs you, not code

1. **Confirm the two flagged prices.** Karungali at ₹15 and Rosewood at ₹15
   still look like data errors next to your ₹150–₹325 stock.
2. **Add prices** for Sandalwood sapling, Red Sandal and Khaya — they currently
   read "Price on request".
3. **Delete or correct the duplicate Rosewood listing.**
4. **Add a macadamia photo** at `/public/plants/macadamia.jpg`.
5. **Collect real testimonials** — those sections stay hidden until you do.
6. **Point ganeshnursery.co.in at Vercel.** The SEO work only counts on the
   real domain, not the `.vercel.app` one.
7. **Claim your Google Business Profile.** For "nursery in Thanjavur" this
   outweighs everything in this codebase.
