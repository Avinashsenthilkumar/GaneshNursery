import { neon } from '@neondatabase/serverless';

// ============================================================================
// DATABASE — Neon Postgres
//
// This file only ever runs on the server. That is the whole point of the
// change: DATABASE_URL contains a username and password with full access to
// the database, and it never goes anywhere near the browser. The website asks
// this API for plants; the API asks Postgres. The visitor's browser has no
// database credential to leak, so there is no key to publish, rotate or
// explain.
//
// Neon's serverless driver talks to Postgres over HTTP rather than holding a
// TCP connection open, which is what makes it work inside a serverless
// function that may only live for 200 milliseconds.
// ============================================================================

const url = process.env.DATABASE_URL || '';

export const isConfigured = Boolean(url);

/** Tagged-template query. Values interpolated into it are sent as bound
 *  parameters, never spliced into the SQL string, so a plant named
 *  `Robert'); drop table plants;--` is just an oddly named plant. */
export const sql = isConfigured ? neon(url) : null;

export function requireDb() {
  if (!isConfigured) {
    const err = new Error('DATABASE_URL is not set on the server.');
    err.status = 503;
    throw err;
  }
}

// ─── shape conversion ──────────────────────────────────────────────────────
// Postgres columns are snake_case; the app has always used camelCase. Doing
// the translation in one place means neither side has to know about the other.

/** Database row → the plant shape every component already expects. */
export function rowToPlant(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tamil: row.tamil || '',
    botanical: row.botanical || '',
    category: row.category || 'Timber',
    seedSource: row.seed_source || '',
    motherTree: row.mother_tree || '',
    light: row.light || '',
    water: row.water || '',
    soil: row.soil || '',
    popular: !!row.popular,
    description: row.description || '',
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    planting: row.planting || '',
    care: row.care || '',
    uses: row.uses || '',
    notice: row.notice || '',
    images: Array.isArray(row.images) ? row.images : [],
    variants: (Array.isArray(row.variants) ? row.variants : []).map(v => ({
      ...v,
      images: Array.isArray(v.images) ? v.images : []
    })),
    sortOrder: row.sort_order ?? 0
  };
}

const str = v => {
  const s = typeof v === 'string' ? v.trim() : v == null ? '' : String(v);
  return s === '' ? null : s;
};

/** Empty means "no price", not zero.
 *
 *  `Number(null)` and `Number('')` are both 0, and 0 is a perfectly finite
 *  number — so the obvious one-line version of this quietly turns a cleared
 *  offer field into an offer of ₹0, and the catalogue advertises free trees.
 *  The empty cases are therefore ruled out before the conversion, not after. */
const num = v => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Plant shape → the values a row needs.
 *
 * Everything arriving here came from a browser, so nothing is trusted: types
 * are coerced, strings trimmed, arrays capped. Derived fields (price, size,
 * gallery) are deliberately dropped — they are computed on read, and storing
 * them would leave two versions of the same fact free to disagree.
 */
export function plantToRow(plant) {
  const variants = (Array.isArray(plant.variants) ? plant.variants : [])
    .slice(0, 24)
    .map(v => ({
      size: String(v.size ?? '').trim(),
      age: str(v.age),
      bag: str(v.bag),
      cost: num(v.cost),
      offer: num(v.offer),
      note: str(v.note),
      images: (Array.isArray(v.images) ? v.images : []).slice(0, 3).map(String)
    }));

  return {
    slug: String(plant.slug || '').trim(),
    name: String(plant.name || '').trim(),
    tamil: str(plant.tamil),
    botanical: str(plant.botanical),
    category: plant.category === 'Fruit' ? 'Fruit' : 'Timber',
    seed_source: str(plant.seedSource),
    mother_tree: str(plant.motherTree),
    light: str(plant.light),
    water: str(plant.water),
    soil: str(plant.soil),
    popular: !!plant.popular,
    description: str(plant.description),
    highlights: (Array.isArray(plant.highlights) ? plant.highlights : [])
      .slice(0, 12).map(h => String(h).trim()).filter(Boolean),
    planting: str(plant.planting),
    care: str(plant.care),
    uses: str(plant.uses),
    notice: str(plant.notice),
    images: (Array.isArray(plant.images) ? plant.images : []).slice(0, 5).map(String),
    variants,
    sort_order: Number.isFinite(Number(plant.sortOrder)) ? Number(plant.sortOrder) : 0
  };
}
