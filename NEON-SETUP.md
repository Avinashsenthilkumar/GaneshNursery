# Setting up the database and photo hosting

About twenty minutes, once. After this, Selva Ganesh edits the site from his
phone and every visitor sees the change immediately — no file to download, no
commit, no deploy.

Two free services, doing different jobs:

| | Holds | Why this one |
|---|---|---|
| **Neon** | Plant names, prices, sizes, descriptions, business details | Serverless Postgres. Sleeps when nobody is using it, wakes in under a second, and the free tier is far beyond what a nursery catalogue needs. |
| **Cloudinary** | The photographs | Serves images from a CDN and resizes them per device. One upload answers a 320px phone card and a 1400px desktop gallery. |

Keeping them apart matters. Photos are large and requested constantly; text is
small and changes rarely. Putting the photos in the database would make it slow
and expensive for no benefit.

Neither needs a credit card.

**You need four values in total.** Two from Neon and Cloudinary, one you invent
(the admin password), one optional. That is the whole configuration.

---

## How this works, in one paragraph

The website has no database credential in it. When a page needs plants it asks
`/api/plants`, which is a small function running on Vercel's servers; that
function holds the connection string and talks to Neon. Signing in posts your
password to `/api/auth`, which checks it server-side and hands back a cookie
the browser cannot read or forge. Every save is re-checked against that cookie
before anything is written.

That is why there is no publishable key, no secret key, and no row-level
security to configure. The browser is never trusted with anything, so there is
nothing to lock down.

---

## Part 1 — Neon (the database)

1. Go to **neon.com** → *Sign up* (GitHub is quickest).
2. **Create a project**.
   - Name: `ganesh-nursery`
   - Region: **Asia Pacific (Singapore)** or **Mumbai** if offered. Customers
     are in Tamil Nadu; a US region adds a quarter of a second to every page.
3. The dashboard shows a **Connection string** immediately. Click **Connect**,
   choose **Pooled connection**, and copy it. It looks like:

   ```
   postgresql://neondb_owner:npg_XXXX@ep-cool-name-123456-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```

That is `DATABASE_URL`. It contains a password, so treat it like one: it goes
in `.env` and in Vercel, and nowhere else. Never in a screenshot.

**Pooled, not direct.** The pooled string is built for serverless functions
that open and close constantly. The direct one will run out of connections
under real traffic.

That is all of Neon. No SQL editor, no users to create, no policies.

---

## Part 2 — Cloudinary (the photographs)

1. **cloudinary.com** → *Sign up for free* → choose **Programmable Media**.
2. The dashboard shows your **Cloud name** — a short string like `dxk2p9qzr`.
   That is `VITE_CLOUDINARY_CLOUD_NAME`.
3. **Settings** (gear icon) → **Upload** → scroll to **Upload presets** →
   **Add upload preset**:
   - **Preset name**: `ganesh-nursery` — that is `VITE_CLOUDINARY_UPLOAD_PRESET`
   - **Signing mode**: **Unsigned** ← the panel cannot upload without this
   - **Folder**: `ganesh-nursery`
4. While you are there: set **Max file size** to `10000000` (10 MB) and
   **Allowed formats** to `jpg, png, webp`. The panel compresses to roughly
   300 KB before uploading, so anything near that limit did not come from the
   admin panel.
5. **Save**.

### The honest caveat

The preset name ships inside the website's JavaScript, so it is public. Someone
who digs it out could upload images to your Cloudinary account.

What they **cannot** do: delete your photos, see your account, or touch the
database. The folder and size limits keep any mischief to one folder you can
empty in a click.

The alternative — signed uploads — needs the server to generate a signature per
upload. You now have a server, so this is a genuine option later; it would be
one more function in `/api` and a change confined to `src/lib/cloudinary.js`.
It is not worth doing before there is a problem.

---

## Part 3 — Run it locally

Create a file called `.env` in the project root (copy `.env.example`):

```
DATABASE_URL=postgresql://neondb_owner:npg_XXXX@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=pick-something-long-here
VITE_CLOUDINARY_CLOUD_NAME=dxk2p9qzr
VITE_CLOUDINARY_UPLOAD_PRESET=ganesh-nursery
```

Then:

```bash
npm install
npm run db:init     # creates the tables and loads the 23 plants
npm run dev
```

`npm run db:init` reads `.env` itself. Expected output:

```
Creating tables…
  ✓ plants, site_settings

Loading 23 plants…
  ✓ 23 plants, 41 sizes
  ✓ business details
```

Re-running it later is safe: plants are matched on their slug and updated in
place, and anything you added through the admin panel that is not in
`plants.js` is left alone.

Open `http://localhost:5173/admin`, sign in with your `ADMIN_PASSWORD`, change
a price. **The local dev server runs the `/api` functions too**, so this is the
real thing, not a mock — you are editing the same Neon database the live site
will use.

---

## Part 4 — Deploy

**Vercel → Settings → Environment Variables.** Add all four, ticking
Production, Preview and Development for each:

| Name | Value |
|---|---|
| `DATABASE_URL` | the Neon pooled connection string |
| `ADMIN_PASSWORD` | your password |
| `VITE_CLOUDINARY_CLOUD_NAME` | from the Cloudinary dashboard |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | `ganesh-nursery` |

Then **Deployments → ⋯ → Redeploy**.

Vercel bakes these in at build time, so a variable added after a deploy does
nothing until you redeploy. If the site behaves as though nothing is
configured, this is almost always why.

You do not need to run `db:init` again — it is the same database.

### This needs a host that runs functions

Vercel, Netlify and Cloudflare Pages all do. **Plain Bluehost or Apache static
hosting will not** — the site would load and look perfect, but `/api/...` would
return the homepage instead of data and the admin panel would say *"The API is
not running."* If the site has to live on Bluehost, tell me and I will move the
API to something that host can run.

---

## Part 5 — Check it works

1. Open **/admin** and sign in.
2. The **Database** tab should say *Connected*.
3. Change a price and save. It should say *live now*.
4. Open the site on a different device. The new price is there.
5. Add a photo to a plant from your phone. It should appear on the laptop
   after a refresh, with no warning marker on it.

Step 5 is the one worth doing properly — it is the problem that started all
this.

---

## When something is wrong

**"The API is not running"** — the deploy did not include the `api/` folder, or
the host cannot run functions. On Vercel check the Functions tab of the latest
deployment; `plants`, `site` and `auth` should be listed.

**"That password is not right"** — `ADMIN_PASSWORD` is unset or differs from
what you typed. After changing it in Vercel you must redeploy. A wrong attempt
is deliberately slowed by a second, so it will never feel instant.

**"The plants table has not been created yet"** — run `npm run db:init`.

**"Could not reach the database. It may be waking up"** — Neon sleeps an idle
project. The first request wakes it, which takes under a second; try again.

**"The database refused the connection"** — `DATABASE_URL` is wrong, or it was
pasted with the surrounding quotes. It must start `postgresql://`.

**"Another plant already uses that URL slug"** — two plants cannot share a slug,
because the slug is the public web address. Change one.

**A photo shows a red `!` marker** — it did not reach Cloudinary and exists only
in that browser. Remove it and add it again once the preset is fixed.

**Nothing loads, but the catalogue is still there** — that is the design. If the
database is unreachable the site falls back to the copy it was built with, so
visitors see slightly stale prices rather than an empty shop. The Database tab
will say so.

---

## What it costs

At this nursery's scale, nothing. Neon's free tier covers far more storage and
compute than this catalogue uses, and Cloudinary's covers 25 GB of monthly
delivery — tens of thousands of visitors. Vercel's free tier covers the
functions.

Neon **sleeps an idle project** rather than pausing it permanently, so unlike
some free tiers there is nothing to un-pause and no weekly deadline. The first
visitor after a quiet spell waits an extra moment; everyone else does not.

## Backups

Neon keeps a rolling history and can restore the database to any moment in the
last few days — dashboard → **Branches** → **Restore**. Worth knowing before
you need it.

Cloudinary holds the photos separately and neither backup covers the other, so
keep the original shots on a phone or hard disk as well.

## Housekeeping

Removing a photo in the admin panel unlinks it from the plant but leaves the
file in Cloudinary — deleting needs an API secret, which has no business being
in a browser. Every few months, open Cloudinary → **Media Library** →
`ganesh-nursery` and delete anything no longer used. The folder view makes
orphans obvious.
