import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { plants as defaultPlants, categories as defaultCategories } from '../data/plants.js';
import { site as defaultSite } from '../data/site.js';
import committedOverrideRaw from '../data/content-override.json';

// ============================================================================
// CONTENT STORE
//
// Everything the admin panel can edit lives here. The files in /src/data are
// the shipped defaults; this layer holds an override saved in the browser and
// merges the two, so the site always renders even if the override is empty or
// corrupt.
//
// ⚠️  IMPORTANT — WHAT THIS IS AND IS NOT
//
// This site has no backend. Edits made in the admin panel are saved to
// localStorage in the browser that made them. That means:
//
//   • YOU see your changes immediately.
//   • VISITORS DO NOT. Their browsers still have the shipped defaults.
//
// To make an edit public you export the JSON from the admin panel and commit
// it as /src/data/content-override.json (the build picks it up automatically),
// or paste it into the data files. The panel makes this a two-click job.
//
// To get true live editing you need a backend — see README "Going further".
// ============================================================================

const ContentContext = createContext(null);
const STORAGE_KEY = 'ganesh-content-override-v1';

// The committed override ships as the baseline for every visitor. It starts
// as {} — paste an export from the admin panel into it (or replace the file)
// and rebuild to publish your edits to everyone.
const committedOverride = committedOverrideRaw && typeof committedOverrideRaw === 'object'
  ? committedOverrideRaw
  : {};

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Recomputes the fields the site derives from a plant's size variants, so a
// price edited in the admin panel flows through to the card, the schema and
// the enquiry list without anything being updated by hand.
function derive(plant) {
  const variants = Array.isArray(plant.variants) ? plant.variants : [];
  const prices = variants.map(v => v.offer ?? v.cost).filter(n => Number.isFinite(n));
  const lowest = prices.length ? Math.min(...prices) : null;
  const cheapest = variants.find(v => (v.offer ?? v.cost) === lowest);
  return {
    ...plant,
    variants,
    price: lowest,
    mrp: cheapest && cheapest.offer && cheapest.cost > cheapest.offer ? cheapest.cost : null,
    size: variants.length
      ? (variants.length === 1 ? variants[0].size : `${variants[0].size} – ${variants[variants.length - 1].size}`)
      : '',
    bag: variants.length === 1 ? variants[0].bag : undefined,
    age: variants.length === 1 ? variants[0].age : undefined,
    sizeCount: variants.length,
    gallery: plant.gallery?.length ? plant.gallery : (plant.image ? [plant.image] : [])
  };
}

function mergeOverride(override) {
  const site = { ...defaultSite, ...(override.site || {}) };
  if (override.site?.address) site.address = { ...defaultSite.address, ...override.site.address };
  if (override.site?.social) site.social = { ...defaultSite.social, ...override.site.social };

  // A plants array in the override replaces the defaults wholesale — that is
  // what lets the admin delete a species and have it stay deleted.
  const plants = (Array.isArray(override.plants) ? override.plants : defaultPlants).map(derive);

  return { site, plants };
}

export function ContentProvider({ children }) {
  const [override, setOverride] = useState(() => ({ ...committedOverride, ...readLocal() }));

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(override)); } catch { /* private mode */ }
  }, [override]);

  const { site, plants } = useMemo(() => mergeOverride(override), [override]);

  const saveSite = useCallback(patch => {
    setOverride(prev => ({
      ...prev,
      site: { ...(prev.site || {}), ...patch }
    }));
  }, []);

  const savePlants = useCallback(next => {
    setOverride(prev => ({ ...prev, plants: next }));
  }, []);

  const upsertPlant = useCallback(plant => {
    setOverride(prev => {
      const list = Array.isArray(prev.plants) ? [...prev.plants] : defaultPlants.map(p => ({ ...p }));
      const i = list.findIndex(p => String(p.id) === String(plant.id));
      if (i >= 0) list[i] = plant; else list.push(plant);
      return { ...prev, plants: list };
    });
  }, []);

  const deletePlant = useCallback(id => {
    setOverride(prev => {
      const list = Array.isArray(prev.plants) ? prev.plants : defaultPlants;
      return { ...prev, plants: list.filter(p => String(p.id) !== String(id)) };
    });
  }, []);

  // Throws away every local edit and returns to what is committed in the repo.
  const resetAll = useCallback(() => {
    setOverride({ ...committedOverride });
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  const exportJson = useCallback(() => JSON.stringify(override, null, 2), [override]);

  const importJson = useCallback(text => {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null) throw new Error('Not a JSON object');
    if (parsed.plants && !Array.isArray(parsed.plants)) throw new Error('"plants" must be a list');
    setOverride(parsed);
  }, []);

  const hasLocalEdits = useMemo(
    () => JSON.stringify(override) !== JSON.stringify(committedOverride),
    [override]
  );

  // Bound to the live settings, so editing the WhatsApp number or address in
  // admin updates every link and every printed address at once.
  const fullAddress = useMemo(() => [
    site.address.line1,
    site.address.line2,
    `${site.address.city}, ${site.address.state} ${site.address.postalCode}`
  ].filter(Boolean), [site]);

  const waLink = useCallback(
    text => `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`,
    [site.whatsapp]
  );

  const mapsLink = useMemo(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`,
    [site.mapsQuery]
  );

  const yearsInBusiness = useMemo(
    () => new Date().getFullYear() - site.foundedYear,
    [site.foundedYear]
  );

  const value = useMemo(() => ({
    site,
    plants,
    fullAddress,
    waLink,
    mapsLink,
    yearsInBusiness,
    categories: defaultCategories,
    saveSite,
    savePlants,
    upsertPlant,
    deletePlant,
    resetAll,
    exportJson,
    importJson,
    hasLocalEdits
  }), [site, plants, fullAddress, waLink, mapsLink, yearsInBusiness,
    saveSite, savePlants, upsertPlant, deletePlant, resetAll, exportJson, importJson, hasLocalEdits]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside ContentProvider');
  return ctx;
}
