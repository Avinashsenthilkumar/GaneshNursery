# v8 — the site edits itself

The problem this version exists to solve, in your words:

> *"if i do change in another device i mean images the change not happening"*

You were right that it was a database problem. Here is what changed, and why
the architecture is not the one we first discussed.

---

## What was actually wrong

Every edit made in the admin panel was written to **localStorage** — a box of
notes kept inside the one browser that made them. Your phone had its notes, the
office laptop had its own, and neither could see the other's. Uploaded photos
were worse: each one became a several-hundred-kilobyte block of text stuffed
into that same box, so the file you had to download and commit grew every time
you added a picture.

Nothing was ever shared, because there was nowhere shared to put it.

## What it is now

| | Holds | Why this one |
|---|---|---|
| **Neon** | Plants, prices, sizes, descriptions, business details | Serverless Postgres. Sleeps when idle, wakes in under a second, free tier far beyond a nursery catalogue. |
| **Cloudinary** | The photographs | A CDN that resizes on request. One upload answers a 320px phone card and a 1400px desktop gallery. |
| **Vercel functions** | The code between them | Holds the database password server-side so the browser never has one. |

**Press Save and it is live.** No download, no commit, no deploy. A price
changed on your phone in the nursery is on the office laptop and on every
customer's screen on their next page load.

---

## Why Neon and not Supabase

You asked for the change, and it turned out to be the better design anyway.

Supabase works by publishing a key in the website's JavaScript and then
defending the database with row-level security rules. That is a legitimate
approach, but it means the browser holds a credential, and everything then
depends on getting the rules right. It is also where the confusion came from:
publishable key, secret key, legacy anon key, legacy service_role key, four
names for two ideas.

Neon is just Postgres, so it needed something in front of it — and that
something is five small functions in `api/`. The connection string lives there,
on the server. **The browser has no database credential at all.** There is no
key to publish, no key to rotate, and no rules to get right, because nothing
untrusted is ever talking to the database.

Setup went from *create project → run SQL → create user → disable sign-ups →
find the right key → seed* down to **one connection string, one password, one
command**.

---

## The eight changes

### 1. A real login, and a simpler one

The old passphrase was compared *inside the downloaded JavaScript*. Anyone who
opened developer tools could read it. That was tolerable only because the panel
could not change what the public saw.

Now: you type a password, the server checks it, and you get back a signed
`httpOnly` cookie the browser cannot read or forge. Every save is re-checked
against that cookie before anything is written.

Details worth knowing:
- A wrong guess is deliberately slowed by a second, which turns thousands of
  attempts a minute into sixty.
- The password comparison is constant-time, so failures cannot be timed to
  learn the answer one character at a time.
- Changing `ADMIN_PASSWORD` signs everyone out, because the cookie's signing
  key is derived from it.

### 2. Photos go to Cloudinary, and get smaller on the way

The browser resizes to 1600px and re-encodes before uploading, so a 5 MB phone
photo leaves as roughly 300 KB. That matters because you will be uploading over
mobile data, standing in the nursery.

Cloudinary then serves each visitor a version suited to their screen — five
widths, and AVIF or WebP instead of JPEG where supported. Typically 30–50%
fewer bytes, no visible difference.

If an upload fails the photo is **not lost**: it stays in the browser, marked
with a red `!` so you know it has not reached anyone else yet.

### 3. The site cannot be taken down by the database

Every page starts from the catalogue compiled into the bundle, then swaps in
live data when it arrives. If that fetch fails — database asleep, network out,
functions not deployed — the bundled copy simply stays.

Visitors see slightly stale prices instead of an empty shop. A nursery site that
goes blank because a database hiccuped is worse than one showing last week's
prices.

### 4. Every write is validated on the server

Anything arriving from a browser is treated as hostile: types coerced, strings
trimmed, arrays capped at 5 photos and 24 sizes, category forced to Timber or
Fruit, and unknown fields dropped rather than stored. Queries use bound
parameters, so a plant named `Robert'); drop table plants;--` is just an oddly
named plant. There is a test for that.

### 5. The Publish tab became the Database tab

There is nothing left to publish. What is useful instead: connection status, how
many plants, sizes and photos exist, how many photos failed to upload, how many
plants still have no photo at all.

### 6. Failures say what actually went wrong

Every save is a real network request, so it can fail. The panel shows *Saving…*
then either *live now* or the real reason — *the plants table has not been
created yet*, *another plant already uses that URL slug*, *the database may be
waking up*. It never claims a success it did not have.

### 7. `npm run dev` runs the backend too

A small Vite plugin runs the `api/` handlers inside the dev server, so one
command gives you the site *and* a working admin panel against the real
database. No second terminal, no `vercel dev`.

### 8. The catalogue got faster

`SmartImage` builds the responsive `srcset` itself — Cloudinary widths for
uploaded photos, the existing `-sm` pair for files in `/public`. Admin
thumbnails request a 320px version rather than the full photo. `/api/plants` is
cached at Vercel's edge for a minute, so most visitors never wait on the
database at all.

---

## A bug this caught

Testing turned up something that would have been embarrassing in front of
customers: clearing an offer price stored it as **₹0** rather than as "no
offer", because `Number(null)` is `0` and `0` is a perfectly valid number. The
catalogue would have advertised free trees.

Fixed, and there are now four tests specifically for empty-versus-zero.

---

## What you have to do

**[`NEON-SETUP.md`](NEON-SETUP.md)** — about twenty minutes, once.

1. Create a Neon project (**Singapore or Mumbai** region) and copy the
   **pooled** connection string.
2. Create a Cloudinary account and an **unsigned** upload preset.
3. Put four values in `.env`:
   `DATABASE_URL`, `ADMIN_PASSWORD`, `VITE_CLOUDINARY_CLOUD_NAME`,
   `VITE_CLOUDINARY_UPLOAD_PRESET`
4. `npm install && npm run db:init && npm run dev`
5. Same four values in Vercel, then **redeploy**.

Then sign in at `/admin`, change a price on your phone, and check the laptop.

### One thing to check before you start

This needs a host that runs serverless functions — Vercel, Netlify or
Cloudflare Pages. **Plain Bluehost static hosting will not work**: the public
site would look perfect, but the admin panel would report *"The API is not
running."* If the site has to live on Bluehost, say so and I will move the API
to something that host can run.

---

## What was verified

Not by reading the code — by running it.

- **A real Postgres database, real HTTP handlers: 52 tests, all passing.**
  Wrong password rejected; tampered session cookie rejected; anonymous writes
  and deletes blocked with 401 while reads stay public; save and update by slug
  reusing the same row; SQL injection stored as plain text with the table
  intact; unknown fields dropped; photo arrays capped; empty prices becoming
  null rather than zero while a genuine 0 survives; deleting twice giving 404;
  wrong HTTP methods giving 405.
- **The setup script run against an empty database**, then read back through
  the API: 23 plants, 41 sizes, Tamil text intact, per-size photos intact,
  Magilam's "price on request" still null, business details stored without
  `contactEndpoint` leaking in.
- **The panel rendered and driven** at 320, 390, 430, 768 and 1280px in both
  light and dark: sign-in with a wrong password then a right one, all four
  tabs, the plant editor, an expanded per-size photo strip. No sideways scroll
  anywhere, no console errors.
- **The three ways this can fail in production**, each shown to produce a
  message naming the actual cause: functions not deployed, database error,
  no network.
- Every source file parses; every import resolves to a real export; every CSS
  class used by a component exists.

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
delete anything, read anything, or touch the database, and NEON-SETUP.md
explains how to restrict the preset to one folder with a size cap.

Signed uploads would close that gap, and unlike before you now have a server
that could sign them — it would be one more function in `api/`. Worth doing if
it ever becomes a problem; not worth doing before.
