import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { plants as defaultPlants, categories as defaultCategories, MAX_IMAGES } from '../data/plants.js';
import { site as defaultSite } from '../data/site.js';
import { fetchPlants, fetchSite, savePlant, removePlant, saveSiteSettings } from '../lib/api.js';

// ============================================================================
// CONTENT STORE
//
// Every page reads its plants and business details through this one file, so
// it is the only place that needs to know where the content actually comes
// from. That has now changed twice without a single component being touched,
// which is the point of the arrangement.
//
// HOW IT LOADS
//
// 1. It starts with the data compiled into the bundle (src/data/*.js). The
//    first paint therefore has real content — no spinner, no layout shift,
//    and the catalogue is on screen before any request has finished.
// 2. It then fetches the live rows from /api and swaps them in, usually within
//    a few hundred milliseconds.
// 3. If that fetch fails — database asleep, network out, functions not
//    deployed — the static data simply stays. The visitor sees a slightly
//    stale catalogue rather than a broken page.
//
// Step 3 is deliberate and worth defending: a nursery site that goes blank
// because a database hiccuped is considerably worse than one showing last
// week's prices.
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

  // 'loading' — first fetch in flight, bundled data on screen
  // 'live'    — reading from the database
  // 'offline' — the fetch failed; showing bundled data instead
  const [source, setSource] = useState('loading');
  const [lastError, setLastError] = useState('');

  const refresh = useCallback(async signal => {
    try {
      const [plantRes, siteRes] = await Promise.all([
        fetchPlants(signal),
        fetchSite(signal).catch(() => null)   // settings are optional; plants are not
      ]);

      // An empty table means db:init has not been run. Keep showing the
      // bundled catalogue rather than an empty shop.
      if (Array.isArray(plantRes.plants) && plantRes.plants.length > 0) {
        setPlants(plantRes.plants.map(derive));
      }

      const remote = siteRes?.site;
      if (remote && Object.keys(remote).length) {
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
      if (err.name === 'AbortError') return;
      // Deliberately non-fatal. The bundled data is already on screen.
      setSource('offline');
      setLastError(err.message || 'Could not reach the database.');
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    refresh(ac.signal);
    return () => ac.abort();
  }, [refresh]);

  // ─── writes ──────────────────────────────────────────────────────────────
  // Only reachable from the admin panel, and the server rejects them unless a
  // valid session cookie is attached. The check here is for the interface's
  // benefit; the one that matters is the one in api/_lib/auth.js.

  const saveSite = useCallback(async patch => {
    const next = { ...siteData, ...patch };
    const { contactEndpoint, ...storable } = next;
    await saveSiteSettings(storable);
    setSiteData(next);
  }, [siteData]);

  const upsertPlant = useCallback(async plant => {
    const { plant: saved } = await savePlant(plant);
    const derived = derive(saved);
    setPlants(prev => {
      const i = prev.findIndex(p => p.slug === derived.slug);
      if (i === -1) return [...prev, derived];
      const next = [...prev];
      next[i] = derived;
      return next;
    });
    return derived;
  }, []);

  const deletePlant = useCallback(async id => {
    await removePlant(id);
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
    refresh: () => refresh(),

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
