import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SUPABASE CLIENT
//
// Both values are safe to ship in the browser bundle. The anon key is designed
// to be public — what it can actually do is decided by the row-level security
// policies in supabase/schema.sql, which allow reads to anyone and writes only
// to a signed-in user. The key on its own grants nothing.
//
// The service_role key is a different thing entirely and must NEVER appear
// here. It bypasses RLS. It belongs only in scripts/seed-supabase.mjs, read
// from the environment.
//
// Photos do not live here at all — they are on Cloudinary, and the database
// stores only their URLs. See src/lib/cloudinary.js for why.
// ============================================================================

const url = import.meta.env?.VITE_SUPABASE_URL || '';
const anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

/** True when both env vars are set, so the app can decide whether to use the
 *  database or fall back to the files it shipped with. */
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // The admin panel is the only thing that signs in, and it is not
      // reached through an email link, so there is no callback URL to parse.
      detectSessionInUrl: false
    }
  })
  : null;

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

/** Plant shape → a database row. Derived fields (price, size, gallery…) are
 *  deliberately dropped: they are computed on read, and storing them would
 *  leave two versions of the same fact to disagree with each other. */
export function plantToRow(plant) {
  return {
    ...(Number.isFinite(Number(plant.id)) ? { id: Number(plant.id) } : {}),
    slug: plant.slug,
    name: plant.name,
    tamil: plant.tamil || null,
    botanical: plant.botanical || null,
    category: plant.category || 'Timber',
    seed_source: plant.seedSource || null,
    mother_tree: plant.motherTree || null,
    light: plant.light || null,
    water: plant.water || null,
    soil: plant.soil || null,
    popular: !!plant.popular,
    description: plant.description || null,
    highlights: plant.highlights || [],
    planting: plant.planting || null,
    care: plant.care || null,
    uses: plant.uses || null,
    notice: plant.notice || null,
    images: plant.images || [],
    variants: (plant.variants || []).map(v => ({
      size: v.size ?? '',
      age: v.age ?? null,
      bag: v.bag ?? null,
      cost: v.cost ?? null,
      offer: v.offer ?? null,
      note: v.note ?? null,
      images: v.images ?? []
    })),
    sort_order: plant.sortOrder ?? 0
  };
}
