/**
 * Loads the 23 plants and the site settings from the static data files into
 * Supabase. Run once, after schema.sql.
 *
 *   node scripts/seed-supabase.mjs
 *
 * Needs two values from Supabase → Project Settings → API:
 *
 *   VITE_SUPABASE_URL          the project URL
 *   SUPABASE_SERVICE_ROLE_KEY  the service_role secret (NOT the anon key)
 *
 * The service_role key bypasses row-level security, which is what lets this
 * script write without signing in. It must never appear in the front-end or
 * in git — it is read from the environment here and nowhere else.
 *
 * Re-running is safe: rows are matched on `slug` and updated in place, so
 * existing edits to a plant that is still in plants.js get overwritten, and
 * anything added through the admin panel that is NOT in plants.js is left
 * alone.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error(`
Missing credentials.

  PowerShell:
    $env:VITE_SUPABASE_URL="https://xxxx.supabase.co"
    $env:SUPABASE_SERVICE_ROLE_KEY="eyJ..."
    node scripts/seed-supabase.mjs

  Mac / Linux:
    VITE_SUPABASE_URL="https://xxxx.supabase.co" \\
    SUPABASE_SERVICE_ROLE_KEY="eyJ..." \\
    node scripts/seed-supabase.mjs

Both are in Supabase → Project Settings → API.
Use the service_role key, not the anon key.
`);
  process.exit(1);
}

// The data files import from each other and use Vite-only syntax
// (import.meta.env), so they are loaded as text with those bits stubbed out
// rather than imported directly.
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

const db = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

// ─── plants ─────────────────────────────────────────────────────────────────
const rows = plantsMod.plants.map((p, i) => ({
  slug: p.slug,
  name: p.name,
  tamil: p.tamil ?? null,
  botanical: p.botanical ?? null,
  category: p.category,
  seed_source: p.seedSource ?? null,
  mother_tree: p.motherTree ?? null,
  light: p.light ?? null,
  water: p.water ?? null,
  soil: p.soil ?? null,
  popular: !!p.popular,
  description: p.description ?? null,
  highlights: p.highlights ?? [],
  planting: p.planting ?? null,
  care: p.care ?? null,
  uses: p.uses ?? null,
  notice: p.notice ?? null,
  images: p.images ?? [],
  // Strip the derived fields — only the authored shape belongs in the row.
  variants: (p.variants ?? []).map(v => ({
    size: v.size ?? '',
    age: v.age ?? null,
    bag: v.bag ?? null,
    cost: v.cost ?? null,
    offer: v.offer ?? null,
    note: v.note ?? null,
    images: v.images ?? []
  })),
  sort_order: i
}));

console.log(`Seeding ${rows.length} plants…`);
const { error: plantErr, count } = await db
  .from('plants')
  .upsert(rows, { onConflict: 'slug', count: 'exact' });

if (plantErr) {
  console.error('  ✗ plants failed:', plantErr.message);
  process.exit(1);
}
console.log(`  ✓ ${count ?? rows.length} plants written`);

// ─── site settings ─────────────────────────────────────────────────────────
// contactEndpoint is deliberately dropped: it comes from the build-time env
// var, not the database, so storing it here would just create a second source
// of truth that silently disagrees.
const { contactEndpoint, ...siteData } = siteMod.site;

const { error: siteErr } = await db
  .from('site_settings')
  .upsert({ id: 1, data: siteData }, { onConflict: 'id' });

if (siteErr) {
  console.error('  ✗ site settings failed:', siteErr.message);
  process.exit(1);
}
console.log('  ✓ site settings written');

// ─── report ────────────────────────────────────────────────────────────────
const localPhotos = rows.flatMap(r => [
  ...r.images,
  ...r.variants.flatMap(v => v.images)
]).filter(src => src.startsWith('/'));

console.log(`
Done.

  ${rows.length} plants, ${rows.reduce((n, r) => n + r.variants.length, 0)} sizes
  ${localPhotos.length} photo paths point at files in /public. Those keep working
  exactly as they do now and cost nothing. Only photos uploaded through the
  admin panel go to Cloudinary.

Next: sign in at /admin with the user you created and change a price. It should
be on the live site straight away — that is the whole point of this.
`);
