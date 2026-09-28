import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { plants as defaultPlants, categories as defaultCategories, MAX_IMAGES } from '../data/plants.js';
import { site as defaultSite } from '../data/site.js';
import { supabase, isSupabaseConfigured, rowToPlant, plantToRow } from '../lib/supabase.js';

// ============================================================================
// CONTENT STORE
//
// Every page reads its plants and business details through this one file, so
// it is the only place that needs to know where the content actually comes
// from.
//
// HOW IT LOADS
//
// 1. It starts with the data compiled into the bundle (src/data/*.js). The
//    first paint therefore has real content — no spinner, no layout shift,
//    and the site still works with JavaScript-only rendering.
// 2. If Supabase is configured it then fetches the live rows and swaps them
//    in. Usually within a few hundred milliseconds.
// 3. If that fetch fails — no network, project paused, key rotated — the
//    static data simply stays. The visitor sees a slightly stale catalogue
//    rather than a broken page. This matters: a nursery site that goes blank
//    because a database hiccuped is worse than one showing last week's prices.
//
// WITHOUT SUPABASE CONFIGURED
//
// Everything still runs off the static files, exactly as before. That keeps
// local development and preview builds working with no credentials.
// ============================================================================

const ContentContext = createContext(null);

/** Recomputes the fields the site derives from a plant's sizes, so a price or
 *  photo changed in the admin panel flows through to the card, the schema and
 *  the enquiry list with nothing updated by hand. */
function derive(plant) {
  const variants = (Array.isArray(plant.variants) ? plant.variants : [])
    .map(v => ({ ...v, images: Array.isArray(v.images) ? v.images : [] }));

  // Accept an older shape that stored a single `image` string.
  const images = (Array.isArray(plant.images) && plant.images.length
    ? plant.images
    : (plant.image ? [plant.image] : [])
  ).slice(0, MAX_IMAGES);

  const prices = variants.map(v => v.offer ?? v.cost).filter(n => Number.isFinite(n));
  const lowest = prices.length ? Math.min(...prices) : null;
  const highest = prices.length ? Math.max(...prices) : null;
  const cheapest = variants.find(v => (v.offer ?? v.cost) === lowest);

  return {
    ...plant,
    images,
    variants,
    price: lowest,
    priceHigh: highest,
    mrp: cheapest && cheapest.offer && cheapest.cost > cheapest.offer ? cheapest.cost : null,
    size: variants.length
      ? (variants.length === 1 ? variants[0].size : `${variants[0].size} – ${variants[variants.length - 1].size}`)
      : '',
    bag: variants.length === 1 ? variants[0].bag : undefined,
    age: variants.length === 1 ? variants[0].age : undefined,
    sizeCount: variants.length,
    image: images[0] ?? null,
    gallery: images
  };
}

const SEED_PLANTS = defaultPlants.map(derive);

export function ContentProvider({ children }) {
  const [plants, setPlants] = useState(SEED_PLANTS);
  const [siteData, setSiteData] = useState(defaultSite);

  // 'static'  — running from the bundled files (Supabase not configured)
  // 'loading' — configured, first fetch in flight
  // 'live'    — reading from the database
  // 'offline' — configured but unreachable; showing bundled data instead
  const [source, setSource] = useState(isSupabaseConfigured ? 'loading' : 'static');
  const [lastError, setLastError] = useState('');

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [plantRes, siteRes] = await Promise.all([
        supabase.from('plants').select('*').order('sort_order', { ascending: true }).order('id', { ascending: true }),
        supabase.from('site_settings').select('data').eq('id', 1).maybeSingle()
      ]);

      if (plantRes.error) throw plantRes.error;

      // An empty table means the seed script has not been run. Keep showing
      // the bundled catalogue rather than an empty shop.
      if (Array.isArray(plantRes.data) && plantRes.data.length > 0) {
        setPlants(plantRes.data.map(row => derive(rowToPlant(row))));
      }

      if (!siteRes.error && siteRes.data?.data && Object.keys(siteRes.data.data).length) {
        const remote = siteRes.data.data;
        setSiteData({
          ...defaultSite,
          ...remote,
          address: { ...defaultSite.address, ...(remote.address || {}) },
          social: { ...defaultSite.social, ...(remote.social || {}) },
          // Always the build-time value: it is a deploy setting, not content.
          contactEndpoint: defaultSite.contactEndpoint
        });
      }

      setSource('live');
      setLastError('');
    } catch (err) {
      // Deliberately non-fatal. The bundled data is already on screen.
      setSource('offline');
      setLastError(err?.message || 'Could not reach the database.');
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // ─── writes ──────────────────────────────────────────────────────────────
  // These are only reachable from the admin panel, and row-level security
  // rejects them unless a real session is attached.

  const requireDb = () => {
    if (!isSupabaseConfigured) {
      throw new Error('The database is not connected. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then reload.');
    }
  };

  const saveSite = useCallback(async patch => {
    requireDb();
    const next = { ...siteData, ...patch };
    const { contactEndpoint, ...storable } = next;
    const { error } = await supabase
      .from('site_settings')
      .upsert({ id: 1, data: storable }, { onConflict: 'id' });
    if (error) throw error;
    setSiteData(next);
  }, [siteData]);

  const upsertPlant = useCallback(async plant => {
    requireDb();
    const row = plantToRow(plant);
    // New plants have a temporary client-side id; let Postgres assign the real
    // one rather than fighting the identity sequence.
    const isNew = !plants.some(p => String(p.id) === String(plant.id));
    if (isNew) delete row.id;

    const { data, error } = await supabase
      .from('plants')
      .upsert(row, { onConflict: 'slug' })
      .select()
      .single();
    if (error) throw error;

    const saved = derive(rowToPlant(data));
    setPlants(prev => {
      const i = prev.findIndex(p => p.slug === saved.slug);
      if (i === -1) return [...prev, saved];
      const next = [...prev];
      next[i] = saved;
      return next;
    });
    return saved;
  }, [plants]);

  const deletePlant = useCallback(async id => {
    requireDb();
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) throw error;
    setPlants(prev => prev.filter(p => String(p.id) !== String(id)));
  }, []);

  // ─── live helpers ────────────────────────────────────────────────────────
  // Bound to the current settings, so changing the WhatsApp number or address
  // updates every link and printed address at once.
  const fullAddress = useMemo(() => [
    siteData.address.line1,
    siteData.address.line2,
    `${siteData.address.city}, ${siteData.address.state} ${siteData.address.postalCode}`
  ].filter(Boolean), [siteData]);

  const waLink = useCallback(
    text => `https://wa.me/${siteData.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
    [siteData.whatsapp]
  );

  const mapsLink = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteData.mapsQuery)}`,
    [siteData.mapsQuery]
  );

  const yearsInBusiness = useMemo(
    () => new Date().getFullYear() - siteData.foundedYear,
    [siteData.foundedYear]
  );

  const value = useMemo(() => ({
    site: siteData,
    plants,
    categories: defaultCategories,
    fullAddress,
    waLink,
    mapsLink,
    yearsInBusiness,

    source,
    isLive: source === 'live',
    lastError,
    refresh,

    saveSite,
    upsertPlant,
    deletePlant
  }), [siteData, plants, fullAddress, waLink, mapsLink, yearsInBusiness,
    source, lastError, refresh, saveSite, upsertPlant, deletePlant]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
