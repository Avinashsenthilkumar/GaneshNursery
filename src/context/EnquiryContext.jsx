import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { site, waLink } from '../data/site.js';

const EnquiryContext = createContext(null);
// Bumped to v3: list rows are now keyed per size, not per plant, so a v2 list
// read back would have merged two different grades into one line.
const STORAGE_KEY = 'ganesh-nursery-enquiry-v3';
const MAX_QTY = 9999;

// A plant is sold in several heights at several prices, so the unit of the
// enquiry is a plant *at a size*, not a plant. `uid` carries that: two rows of
// Khaya at 1 ft and at 7-8 ft are two separate lines with two separate rates,
// which is what the nursery needs in order to quote without ringing back.
const makeUid = (plantId, variantKey) => `${plantId}::${variantKey || 'base'}`;

const str = (v, fallback = '') => (typeof v === 'string' ? v : fallback);

// The old version trusted whatever was in localStorage. A single corrupted or
// hand-edited entry (a NaN quantity, a missing price) silently poisoned the
// totals and the outgoing WhatsApp message. Everything read back is validated.
function sanitise(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(i => i && typeof i === 'object' && Number.isFinite(Number(i.id)))
    .map(i => {
      const id = Number(i.id);
      const variantKey = str(i.variantKey) || null;
      return {
        uid: str(i.uid) || makeUid(id, variantKey),
        id,
        variantKey,
        // What the customer picked, already formatted: "4 ft · 1-1.5 years".
        variantLabel: str(i.variantLabel) || null,
        slug: str(i.slug),
        name: str(i.name, 'Plant'),
        botanical: str(i.botanical),
        price: Number.isFinite(Number(i.price)) ? Number(i.price) : null,
        image: str(i.image),
        qty: Math.min(MAX_QTY, Math.max(1, Math.round(Number(i.qty)) || 1))
      };
    })
    .slice(0, 100);
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitise(JSON.parse(raw)) : [];
  } catch {
    return [];
  }
}

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* private mode */ }
  }, [items]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const flash = useCallback(message => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, id: Date.now() });
    toastTimer.current = window.setTimeout(() => setToast(null), 4000);
  }, []);

  // Adding a plant used to force the drawer open every single time, making
  // "add five plants" a five-times-interrupted task. It now confirms with a
  // small toast that has a "View list" action, and leaves you where you were.
  // `variant` is optional. Passing none falls back to the plant's cheapest
  // grade, which is the one the card advertises as "from Rs x" — so the card's
  // + button can never quietly add a different price to the list.
  const addItem = useCallback((plant, qty = 1, variant = null) => {
    const amount = Math.min(MAX_QTY, Math.max(1, Math.round(qty) || 1));
    const chosen = variant || plant.defaultVariant || null;
    const uid = makeUid(plant.id, chosen && chosen.key);
    const variantLabel = chosen
      ? [chosen.label, chosen.size, chosen.age].filter(Boolean).join(' · ')
      : null;

    setItems(prev => {
      const existing = prev.find(i => i.uid === uid);
      if (existing) {
        return prev.map(i =>
          i.uid === uid ? { ...i, qty: Math.min(MAX_QTY, i.qty + amount) } : i
        );
      }
      return [...prev, {
        uid,
        id: plant.id,
        variantKey: (chosen && chosen.key) || null,
        variantLabel,
        slug: plant.slug,
        name: plant.name,
        botanical: plant.botanical,
        // The rate for the size picked, not the plant's starting rate.
        price: (chosen && chosen.price != null ? chosen.price : plant.price) ?? null,
        image: plant.image,
        qty: amount
      }];
    });
    // Confirming a tap with a short buzz is what makes an action feel like it
    // landed. Ignored on browsers that do not support it (including iOS).
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    flash(`${plant.name}${variantLabel ? ` (${variantLabel})` : ''} added to your enquiry`);
  }, [flash]);

  const removeItem = useCallback(uid => setItems(prev => prev.filter(i => i.uid !== uid)), []);

  // Stepping down from 1 now removes the item rather than doing nothing.
  const setQty = useCallback((uid, qty) => {
    const next = Math.round(qty);
    setItems(prev => (next < 1
      ? prev.filter(i => i.uid !== uid)
      : prev.map(i => (i.uid === uid ? { ...i, qty: Math.min(MAX_QTY, next) } : i))));
  }, []);

  const clear = useCallback(() => { setItems([]); setNotes(''); }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  // Items with no published price are simply left out of the estimate rather
  // than counted as zero, which would understate the total.
  const estimatedTotal = useMemo(
    () => items.reduce((sum, i) => sum + (i.price ? i.qty * i.price : 0), 0),
    [items]
  );
  const hasUnpricedItems = useMemo(() => items.some(i => !i.price), [items]);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return waLink();
    // Each line now states the exact grade, so the reply can be a real quote
    // rather than "which size did you mean?".
    const lines = items.map(i => {
      const size = i.variantLabel ? ` — ${i.variantLabel}` : '';
      const rate = i.price ? ` — ₹${i.price} each` : ' — price on request';
      return `• ${i.name} (${i.botanical})${size} × ${i.qty}${rate}`;
    });
    let message =
      `Hi ${site.name}, I would like to enquire about:\n\n${lines.join('\n')}\n\n` +
      `Estimated total: ₹${estimatedTotal.toLocaleString('en-IN')}`;
    if (notes.trim()) message += `\n\nNotes: ${notes.trim()}`;
    return waLink(message);
  }, [items, notes, estimatedTotal]);

  const value = useMemo(() => ({
    items, addItem, removeItem, setQty, clear,
    count, estimatedTotal, hasUnpricedItems,
    drawerOpen, openDrawer, closeDrawer, setDrawerOpen,
    notes, setNotes, whatsappUrl,
    toast, dismissToast
  }), [items, addItem, removeItem, setQty, clear, count, estimatedTotal, hasUnpricedItems,
    drawerOpen, openDrawer, closeDrawer, notes, whatsappUrl, toast, dismissToast]);

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return ctx;
}
