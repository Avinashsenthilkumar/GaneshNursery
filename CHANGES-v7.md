# v7 — catalogue, galleries, per-size photos, responsive

## 1. Every plant now has a real gallery, and photos follow the height

**The data model changed.** Each plant carries `images[]` — one main photo plus
up to four more — and **each size carries its own `images[]`**.

That second part is the substantive change. Khaya sells at eight heights from
₹75 to ₹585. Someone buying a 7 ft tree was being shown a photo of a seedling.
Now choosing a size leads the gallery with that size's own photograph, with the
plant's general shots behind it, and the stage carries a **"Photo of the 4 ft
plant"** flag so there is no ambiguity about what is being shown.

**The photos were already in the repo and unused.** `khaya-1ft.jpg`,
`khaya-2ft.jpg`, `khaya-4ft.jpg`, `red-sandal-3ft.jpg`, `karungali-2ft.jpg`,
`sandalwood-1ft.jpg` and others were sitting in `/public/plants` with nothing
referencing them. All 28 are now wired up — 20 variants have their own photo.

⚠️ The mapping follows the filenames. Worth spot-checking in the admin panel
that each really is the height its name claims.

## 2. Catalogue

23 products, 41 sizes, checked against the 2026 PDF.

**Magilam was added** — its photo was in the repo but the species was in
neither the catalogue nor the price list. It publishes with **no price**, reads
"Price on request", and opens straight in custom-height mode. Add its heights
and prices in the admin panel.

Each plant also gained **Key points**, **Planting**, **Care** and **Uses and
market**, which render as a "What to know before you plant" section. That is
the difference between a price list and a reason to buy from you rather than
whoever is cheapest.

## 3. Custom height ("ft customization")

Every product page now has a **"Need a different height?"** row. The customer
types the height they want; it flows into the enquiry list and the WhatsApp
message as a custom request. Previously anyone wanting 9 ft had to abandon the
page.

## 4. Admin

- **Per-size photos.** Each size row has a collapsible "Photos of the 4 ft
  plant" panel — the feature you asked for. Up to 3 per size.
- **Plant gallery**: up to 5 photos, reorderable, with the first marked *Main*.
- **Photos are compressed in the browser** before saving — resized to 1200px
  and re-encoded. A raw phone photo is 3–6 MB, which would have made the
  content file unusable.
- **Add by path** as well as upload, for photos already in `/public`.
- All the new description fields are editable.
- The Publish tab shows the **content file size and inline photo count**, and
  warns past 2 MB.
- The plant list shows each plant's photo count, so gaps are obvious.

## 5. Responsive

Tested by rendering the real stylesheet in headless Chromium at **ten widths
from 320 to 1440**, in both themes, and measuring — not by eye.

**The significant find: a grid blowout in the 381–560px band.** `1fr` is
shorthand for `minmax(auto, 1fr)`, and `auto` will not shrink below a column's
min-content width. An `<input>` reports roughly 20 characters, so the two-column
size editor stayed ~480px wide no matter how narrow the screen got — pushing it
off the right edge of **every iPhone 14, 15 and Pro Max**. Fixed with
`minmax(0, 1fr)` and `min-width: 0`.

Also fixed:
- Touch targets under 44px (quantity stepper 28px, image controls 28px, size
  buttons 38px).
- The 760–980px tablet gap, where three-column grids collapsed straight to one.
- 320px phones, which nothing below 380 had been tested against.
- Landscape phones, where full-height panels became unscrollable.
- Screens above 1600px, where content was stranded mid-page.

Result: **no horizontal overflow, no clipping and no undersized tap target at
any of the ten widths, in either theme.**

## 6. Bugs found and fixed along the way

- **`SmartImage` kept a stale error state when `src` changed.** One failed
  image left the fallback panel showing for every photo after it. The new
  size-switching gallery changes `src` constantly, so this would have shown up
  immediately.
- **`PlantCard` crashed on a plant with no price** — `plant.price.toLocaleString()`
  on null. Magilam would have taken the catalogue page down.
- **The blog posts were showing Unsplash stock** while the nursery's own
  `african-blackwood.jpg` and `karungali.jpg` sat unused in `/public/blogs`.
  The README in that folder claimed they were "referenced from content.js".
  They never were. Now they are.
- **`SeedExpedition` was dead code**: a 17 MB video deployed to every visitor,
  in a component that was never imported and had no CSS at all. Now styled and
  live on the About page.
- **Dark theme gaps**: the sticky buy bar, admin editor and several panels were
  written with a literal cream background before dark mode existed and stayed
  cream on a dark page.
- The admin path placeholder pointed at `/plants/teak.jpg`, which does not
  exist.
- Product photos were re-encoded — 20 files were oversized for what the page
  displays. Full-size set down from 8.03 MB to 6.71 MB, with 600px variants
  regenerated for every one (2.21 MB total for the mobile set).

## Verified

Every file parses · every import resolves · every CSS class defined · all 58
referenced assets present · JSON valid · sitemap 35 URLs including all 23
plants · all 23 plants render across every size and the custom branch without
error · admin save/publish round-trip preserves prices and per-size photos ·
legacy single-`image` overrides migrate · WCAG AA contrast on every new element
in both themes.

`npm install` could not run here (the registry is blocked in this environment),
so **run `npm run build` locally before pushing.**

## Still needs you

1. **Spot-check the per-size photo mapping** — it follows filenames.
2. **Magilam has no prices.** Add them in the admin panel.
3. **Eight plants still have no photo**: Indian Mahogany, Kili Mooku Mango,
   Rumani Mango, Balaji Lemon, Saathukudi, Naattu Naval, Chikoo, Panruti Pala.
   They render a branded panel rather than a broken image, but photos convert.
4. **The three Services images are still Unsplash stock.** Your own photos of a
   garden design, a landscape job and a green wall would replace the last
   generic images on the site.
5. `VITE_ADMIN_PASSPHRASE` still needs setting in Vercel — the live panel is
   otherwise on the default that is printed in your public README.
