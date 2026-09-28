# v8 — the site edits itself

The problem this version exists to solve, in your words:

> *"if i do change in another device i mean images the change not happening"*

You were right that it was a database problem. Here is what changed.

---

## What was actually wrong

Every edit made in the admin panel was written to **localStorage** — a box of
notes kept inside the one browser that made them. Your phone had its notes, the
office laptop had its own, and neither could see the other's. Uploaded photos
were worse: each one was converted into a several-hundred-kilobyte block of text
and stuffed into that same box, so the file you had to download and commit grew
every time you added a picture.

Nothing was ever shared, because there was nowhere shared to put it.

## What it is now

| | Holds | Why this one |
|---|---|---|
| **Supabase** | Plants, prices, sizes, descriptions, business details, the admin login | Postgres with authentication and per-row permissions built in. Free tier covers this catalogue many times over. |
| **Cloudinary** | The photographs | A CDN that resizes on request. One upload answers a 320px phone card and a 1400px desktop gallery. |

Keeping them apart is deliberate. Photos are large and requested by everyone;
text is small and changes rarely. Putting the photos in the database would make
it slow and expensive for no benefit at all.

**Press Save and it is live.** No download, no commit, no deploy. A price
changed on your phone in the nursery is on the office laptop and on every
customer's screen on their next page load.

---

## The seven changes

### 1. A real login

The old passphrase was compared *inside the downloaded JavaScript*. Anyone who
opened developer tools could read it. That was tolerable only because the panel
could not change what the public saw.

Now it can — so the lock had to become real. Supabase verifies the password on
its servers, and Postgres rejects any write that does not carry a valid session.
Getting past the login screen is no longer enough on its own.

There is also a working *Forgot the password?* link, which the passphrase
version could not have had.

### 2. Photos go to Cloudinary, and get smaller on the way

Adding a photo now: the browser resizes it to 1600px and re-encodes it, then
uploads. A 5 MB phone photo leaves as roughly 300 KB. That matters because you
will be uploading over mobile data, standing in the nursery.

Cloudinary then serves each visitor a version suited to their screen — five
widths, and AVIF or WebP instead of JPEG where the browser supports it.
Typically 30–50% fewer bytes than before, with no visible difference.

If an upload fails, the photo is **not lost**. It is kept in the browser and
marked with a red `!` so you know it has not reached anyone else yet.

### 3. The site cannot be taken down by the database

Every page starts from the catalogue compiled into the bundle, then swaps in
live data when it arrives. If that fetch fails — project paused, network out,
key rotated — the bundled copy simply stays.

Visitors see slightly stale prices instead of an empty shop. A nursery site that
goes blank because a database hiccuped is worse than one showing last week's
prices.

### 4. The Publish tab became the Database tab

There is nothing left to publish. What is useful instead is an honest answer to
*is this connected, and where did my photo go* — connection status, how many
plants, sizes and photos exist, how many photos failed to upload, how many
plants still have no photo at all, and who is signed in.

### 5. The panel tells you when a save fails

Every save is now a real network request, so it can fail. Saving shows *Saving…*,
then either *live now* or the actual reason it did not work. It never claims
success it did not have.

### 6. The catalogue card and the gallery got faster

`SmartImage` builds the responsive `srcset` itself — Cloudinary widths for
uploaded photos, the existing `-sm` pair for files in `/public`. Callers pass a
plain `src` and nothing else. Admin thumbnails request a 320px version rather
than the full-size photo, so the plant list on a phone loads a fraction of what
it used to.

### 7. Everything else it touched

- `ContentContext` is still the only file that knows where content comes from,
  so a future backend change is confined to it.
- The seed script loads the existing 23 plants and 41 sizes into a fresh
  database, and is safe to re-run.
- `.env.example`, the README and a new `supabase/SETUP.md` describe the whole
  thing.

---

## What you have to do

**[`supabase/SETUP.md`](supabase/SETUP.md)** — about thirty minutes, once.

The short version:

1. Create a Supabase project (**Mumbai** region — customers are in Tamil Nadu).
2. Run `supabase/schema.sql` in its SQL editor.
3. Create your admin user, and **turn off public sign-ups**. Supabase allows
   them by default; left on, anyone could register and edit the catalogue. This
   is the one step with real consequences if skipped.
4. Create a Cloudinary account and an **unsigned** upload preset.
5. Put four values in `.env` locally and in Vercel, then **redeploy** — Vercel
   bakes them in at build time.
6. `npm install && npm run seed` to load the plants.

Then sign in at `/admin`, change a price on your phone, and check the laptop.

---

## What was verified

- Every source file parses; every import resolves to a real export.
- All 23 plants and 41 sizes survive the app → database → app round-trip with
  no loss, including per-size photos, offer prices, and Magilam's "price on
  request" staying `null` rather than becoming `0`.
- 24 unit tests on the Cloudinary URL logic, including the one that matters:
  re-requesting a size replaces the transform instead of stacking `w_1400/w_320`.
- The panel rendered and driven at 320, 390, 430, 768 and 1280px in both light
  and dark: login, failed sign-in, plant list, plant editor, an expanded
  per-size photo strip, details and database. No sideways scroll anywhere, no
  console errors.
- The fixed bottom navigation clears the page content at every width from 320px
  to the 861px breakpoint.

## Two things still open

- **Eight plants have no photograph** — Indian Mahogany, Kili Mooku Mango,
  Rumani Mango, Balaji Lemon, Saathukudi, Naattu Naval, Chikoo, Panruti Pala.
  They show a leaf placeholder, which sells considerably less than a picture of
  the tree. Now that uploading works from a phone, this is ten minutes in the
  nursery.
- **Magilam has no prices** and shows "Price on request".

## One honest caveat

The Cloudinary upload preset name ships in the JavaScript and is therefore
public. Someone who digs it out could upload images to the account. They cannot
delete anything, read anything, or touch the database, and SETUP.md explains how
to restrict the preset to one folder with a size cap.

The alternative — signed uploads — needs a server to generate signatures, which
is more to run and pay for than this problem is worth here. If it ever does
become a problem, the fix is confined to `src/lib/cloudinary.js`.
