/**
 * Creates the tables and loads the catalogue. One command, run once:
 *
 *   npm run db:init
 *
 * It needs one thing — DATABASE_URL, the connection string from your Neon
 * dashboard. Put it in `.env` at the project root and this script reads it
 * itself; there is nothing to paste into a SQL editor.
 *
 * Re-running is safe. Tables are created only if missing, and plants are
 * matched on their slug and updated in place, so anything you have added
 * through the admin panel that is not in plants.js is left alone.
 */
import { neon } from '@neondatabase/serverless';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// ─── find the connection string ────────────────────────────────────────────
// Read .env ourselves rather than adding a dependency for four lines of work.
function loadEnvFile() {
  const path = resolve(root, '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const value = m[2].replace(/^["']|["']$/g, '');
    if (!process.env[m[1]]) process.env[m[1]] = value;
  }
}
loadEnvFile();

const URL = process.env.DATABASE_URL;

if (!URL) {
  console.error(`
Missing DATABASE_URL.

  Create a file called  .env  in the project root containing:

    DATABASE_URL=postgresql://user:password@ep-xxxx.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

  Neon shows this on your project dashboard under "Connection string"
  (pick the "Pooled connection" one). Then run  npm run db:init  again.
`);
  process.exit(1);
}

const sql = neon(URL);

// ─── tables ────────────────────────────────────────────────────────────────
// Photos are NOT stored here. They live on Cloudinary and these rows keep only
// their URLs, which is what keeps this database small enough to stay free for
// years and keeps image delivery off the database's critical path.

console.log('Creating tables…');

await sql`
  create table if not exists plants (
    id           bigint generated always as identity primary key,
    slug         text not null unique,
    name         text not null,
    tamil        text,
    botanical    text,
    category     text not null default 'Timber',

    seed_source  text,
    mother_tree  text,
    light        text,
    water        text,
    soil         text,

    popular      boolean not null default false,
    description  text,
    highlights   jsonb   not null default '[]'::jsonb,
    planting     text,
    care         text,
    uses         text,
    notice       text,

    -- Up to 5 image URLs, and one object per height in variants. JSON rather
    -- than join tables because they are always read and written together with
    -- the parent row, and their order matters.
    images       jsonb   not null default '[]'::jsonb,
    variants     jsonb   not null default '[]'::jsonb,

    sort_order   integer not null default 0,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
  )
`;

await sql`create index if not exists plants_sort_order_idx on plants (sort_order, id)`;
await sql`create index if not exists plants_category_idx   on plants (category)`;

// A single row. The check constraint makes a second one impossible, so the API
// can always read id = 1 without wondering which it got.
await sql`
  create table if not exists site_settings (
    id         integer primary key default 1,
    data       jsonb not null default '{}'::jsonb,
    updated_at timestamptz not null default now(),
    constraint site_settings_single_row check (id = 1)
  )
`;

console.log('  ✓ plants, site_settings');

// ─── load the catalogue ────────────────────────────────────────────────────
// The data files use Vite-only syntax (import.meta.env), so they are read as
// text with those bits stubbed out rather than imported directly.
async function loadModule(relPath, replacements = []) {
  let src = readFileSync(resolve(root, relPath), 'utf8');
  for (const [from, to] of replacements) src = src.split(from).join(to);
  return import('data:text/javascript,' + encodeURIComponent(src));
}

const siteMod = await loadModule('src/data/site.js', [
  ["import.meta.env?.VITE_CONTACT_ENDPOINT || ''", "''"]
]);
const plantsMod = await loadModule('src/data/plants.js', [
  ["import { site } from './site.js';", `const site = ${JSON.stringify({ whatsapp: siteMod.site.whatsapp })};`]
]);

const plants = plantsMod.plants;
console.log(`\nLoading ${plants.length} plants…`);

let written = 0;
for (const [i, p] of plants.entries()) {
  // Only the authored shape belongs in the row — price, size and gallery are
  // derived on read.
  const variants = (p.variants ?? []).map(v => ({
    size: v.size ?? '',
    age: v.age ?? null,
    bag: v.bag ?? null,
    cost: v.cost ?? null,
    offer: v.offer ?? null,
    note: v.note ?? null,
    images: v.images ?? []
  }));

  await sql`
    insert into plants (
      slug, name, tamil, botanical, category, seed_source, mother_tree,
      light, water, soil, popular, description, highlights, planting,
      care, uses, notice, images, variants, sort_order
    ) values (
      ${p.slug}, ${p.name}, ${p.tamil ?? null}, ${p.botanical ?? null}, ${p.category},
      ${p.seedSource ?? null}, ${p.motherTree ?? null}, ${p.light ?? null},
      ${p.water ?? null}, ${p.soil ?? null}, ${!!p.popular}, ${p.description ?? null},
      ${JSON.stringify(p.highlights ?? [])}, ${p.planting ?? null}, ${p.care ?? null},
      ${p.uses ?? null}, ${p.notice ?? null}, ${JSON.stringify(p.images ?? [])},
      ${JSON.stringify(variants)}, ${i}
    )
    on conflict (slug) do update set
      name = excluded.name, tamil = excluded.tamil, botanical = excluded.botanical,
      category = excluded.category, seed_source = excluded.seed_source,
      mother_tree = excluded.mother_tree, light = excluded.light,
      water = excluded.water, soil = excluded.soil, popular = excluded.popular,
      description = excluded.description, highlights = excluded.highlights,
      planting = excluded.planting, care = excluded.care, uses = excluded.uses,
      notice = excluded.notice, images = excluded.images,
      variants = excluded.variants, sort_order = excluded.sort_order,
      updated_at = now()
  `;
  written += 1;
}
console.log(`  ✓ ${written} plants, ${plants.reduce((n, p) => n + (p.variants?.length || 0), 0)} sizes`);

// ─── business details ──────────────────────────────────────────────────────
const { contactEndpoint, ...siteData } = siteMod.site;

await sql`
  insert into site_settings (id, data) values (1, ${JSON.stringify(siteData)})
  on conflict (id) do update set data = excluded.data, updated_at = now()
`;
console.log('  ✓ business details');

// ─── report ────────────────────────────────────────────────────────────────
const localPhotos = plants.flatMap(p => [
  ...(p.images ?? []),
  ...(p.variants ?? []).flatMap(v => v.images ?? [])
]).filter(src => String(src).startsWith('/'));

console.log(`
Done.

  ${localPhotos.length} photo paths point at files in /public. Those keep working
  exactly as they do now and cost nothing. Only photos uploaded through the
  admin panel go to Cloudinary.

Next: run  npm run dev  , open /admin , sign in with your ADMIN_PASSWORD and
change a price. It should be live straight away — that is the whole point.
`);
