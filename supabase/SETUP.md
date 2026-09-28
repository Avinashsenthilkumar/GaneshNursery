# Setting up the database and photo hosting

Thirty to forty minutes, once. After this, Selva Ganesh edits the site from his
phone and every visitor sees the change immediately — no file to download, no
commit, no deploy.

Two free services do the work, and they do different jobs:

| | What it holds | Why this one |
|---|---|---|
| **Supabase** | Plant names, prices, sizes, descriptions, business details, the admin login | Postgres with a login system and per-row permissions built in. The free tier is far beyond what a nursery catalogue needs. |
| **Cloudinary** | The photographs | Serves images from a CDN and resizes them per device. One upload answers a 320px phone card and a 1400px desktop gallery. |

Keeping them apart matters. Photos are big and requested constantly; text is
small and changes rarely. Putting the photos in the database would make it slow
and expensive for no benefit.

Neither needs a credit card.

---

## Part 1 — Supabase (the database)

### 1. Create the project

1. Go to **supabase.com** → *Start your project* → sign in with GitHub.
2. **New project**.
   - Name: `ganesh-nursery`
   - Database password: let it generate one and **save it in your password
     manager**. This is not the admin login — it is the master key to the
     database, and it cannot be shown to you again.
   - Region: **Mumbai (ap-south-1)**. Customers are in Tamil Nadu; a Singapore
     region adds latency to every single page load for no reason.
3. Wait about two minutes while it provisions.

### 2. Create the tables

1. Left sidebar → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy all of it, paste it in.
3. **Run**.

You should see *Success. No rows returned*. That is correct — it created
structure, not data.

This also switched on row-level security, which is the part that matters: from
now on Postgres itself refuses any write that does not carry a valid login. The
key in the website's JavaScript can read the catalogue and nothing more.

### 3. Create the admin user

1. Sidebar → **Authentication** → **Users** → **Add user** → *Create new user*.
2. Email: Selva Ganesh's, or yours.
3. Password: a real one, not `admin123`. Anyone with it can change the prices
   the public sees.
4. Tick **Auto Confirm User**, otherwise the account waits on an email that
   will not arrive until SMTP is configured.

### 4. Close the door behind you

**Do this. It is the one step that has real consequences if skipped.**

Sidebar → **Authentication** → **Sign In / Providers** → **Email** → turn
**Allow new users to sign up** *off*, and Save.

Supabase allows public sign-ups by default. Combined with the write policy in
`schema.sql`, leaving it on means anyone who finds the site could register an
account and edit the catalogue. With it off, accounts exist only when you create
them on this screen.

### 5. Get the two keys

Sidebar → **Project Settings** → **API**. Copy:

- **Project URL** → `VITE_SUPABASE_URL`
- **anon / public** key → `VITE_SUPABASE_ANON_KEY`

Ignore the **service_role** key for now. It bypasses every security rule, so it
belongs only in a terminal, never in this project's code, and never in a
screenshot.

---

## Part 2 — Cloudinary (the photographs)

### 1. Create the account

1. **cloudinary.com** → *Sign up for free* → choose **Programmable Media**.
2. The dashboard shows your **Cloud name** — a short string like `dxk2p9qzr`.
   That is `VITE_CLOUDINARY_CLOUD_NAME`.

### 2. Create the upload preset

This is what lets the admin panel upload directly from a phone with no server
in between.

1. **Settings** (gear icon) → **Upload** → scroll to **Upload presets** →
   **Add upload preset**.
2. Set:
   - **Preset name**: `ganesh-nursery` — this is
     `VITE_CLOUDINARY_UPLOAD_PRESET`
   - **Signing mode**: **Unsigned** ← the panel cannot upload without this
   - **Folder**: `ganesh-nursery`
3. Under the same preset, worth setting while you are here:
   - **Max file size**: `10000000` (10 MB). The panel compresses to roughly
     300 KB before uploading, so anything near this is not coming from the
     admin panel.
   - **Allowed formats**: `jpg, png, webp`
4. **Save**.

### 3. The honest caveat

The preset name ships inside the website's JavaScript, so it is public. Someone
who digs it out could upload images to your Cloudinary account.

What they **cannot** do: delete your photos, see your account, or touch the
database. The folder and size limits above keep any mischief contained to one
folder you can empty in a click.

The alternative — signed uploads — needs a small server to generate signatures,
which is more to run and pay for than this problem is worth for a nursery
catalogue. If it ever does become a problem, the fix is confined to
`src/lib/cloudinary.js`; nothing else changes.

---

## Part 3 — Connect it up

### Locally

Create a `.env` file in the project root (copy `.env.example`):

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_CLOUDINARY_CLOUD_NAME=dxk2p9qzr
VITE_CLOUDINARY_UPLOAD_PRESET=ganesh-nursery
```

Then:

```bash
npm install
npm run dev
```

### On Vercel

**Project → Settings → Environment Variables.** Add the same four, ticking
Production, Preview and Development for each.

Then **Deployments → ⋯ → Redeploy**. Vercel bakes these in at build time, so a
variable added after a deploy does nothing until you redeploy. If the site
still behaves as though nothing is configured, this is almost always why.

---

## Part 4 — Load the existing plants

The database is empty. This copies the 23 plants and 41 sizes into it.

Run from the project folder, with the **service_role** key — the one step that
uses it, because seeding has to bypass the rules that require a login:

**Windows PowerShell**

```powershell
$env:VITE_SUPABASE_URL="https://xxxxxxxx.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
npm run seed
```

**Mac / Linux**

```bash
VITE_SUPABASE_URL="https://xxxxxxxx.supabase.co" \
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..." \
npm run seed
```

Expected:

```
Seeding 23 plants…
  ✓ 23 plants written
  ✓ site settings written
```

Close that terminal afterwards. The key was never written to a file, and it
should not end up in one.

Re-running later is safe: rows are matched on their slug and updated in place,
and anything added through the admin panel that is not in `plants.js` is left
alone.

---

## Part 5 — Check it works

1. Open **/admin** and sign in with the email and password from Part 1 step 3.
2. The **Database** tab should say *Connected*.
3. Open a plant, change a price, save. It should say *live now*.
4. Open the site on a different device. The new price is there.
5. Add a photo to a plant from your phone. It should appear on the laptop
   after a refresh, with no warning marker on it.

Step 5 is the one worth doing properly — it is the problem that started all
this.

---

## When something is wrong

**"The database is not connected"** — the two `VITE_SUPABASE_*` values are
missing or the site was not redeployed after adding them.

**"That email and password do not match an account"** — the user was not
created, or *Auto Confirm* was left unticked in Part 1 step 3. Supabase gives
the same message either way, deliberately: telling an attacker which addresses
exist would be a gift.

**"The upload preset was not found"** — the preset name does not match
`VITE_CLOUDINARY_UPLOAD_PRESET`, or its signing mode is still *Signed*.

**A photo shows a red `!` marker** — it did not reach Cloudinary and exists only
in that browser. Remove it and add it again once the preset is fixed.

**Saving fails with a row-level-security error** — the session expired. Sign
out and back in.

**Nothing loads, but the catalogue is still there** — that is the design. If the
database is unreachable the site falls back to the copy it was built with, so
visitors see slightly stale prices rather than an empty shop. The Database tab
will say so.

---

## What it costs

At this nursery's scale, nothing. Supabase's free tier covers 500 MB of
database — this catalogue is a fraction of one megabyte — and Cloudinary's
covers 25 GB of monthly delivery, which is tens of thousands of visitors.

The one thing to watch: **Supabase pauses a free project after a week with no
activity.** A live site with visitors is activity, so this only bites during a
quiet patch before launch. Unpausing is one click in the dashboard. If the site
ever looks stale, check there first.

## Housekeeping

Removing a photo in the admin panel unlinks it from the plant but leaves the
file in Cloudinary — deleting needs an API secret, which has no business being
in a browser. Every few months, open Cloudinary → **Media Library** →
`ganesh-nursery` and delete anything no longer used. It is a minute of work and
the folder view makes orphans obvious.
