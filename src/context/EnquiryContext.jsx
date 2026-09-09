import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { site, waLink } from '../data/site.js';

const EnquiryContext = createContext(null);
const STORAGE_KEY = 'ganesh-nursery-enquiry-v2';
const MAX_QTY = 9999;

// The old version trusted whatever was in localStorage. A single corrupted or
// hand-edited entry (a NaN quantity, a missing price) silently poisoned the
// totals and the outgoing WhatsApp message. Everything read back is validated.
function sanitise(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(i => i && typeof i === 'object' && Number.isFinite(Number(i.id)))
    .map(i => ({
      id: Number(i.id),
      slug: typeof i.slug === 'string' ? i.slug : '',
      name: typeof i.name === 'string' ? i.name : 'Plant',
      botanical: typeof i.botanical === 'string' ? i.botanical : '',
      price: Number.isFinite(Number(i.price)) ? Number(i.price) : 0,
      image: typeof i.image === 'string' ? i.image : '',
      qty: Math.min(MAX_QTY, Math.max(1, Math.round(Number(i.qty)) || 1))
    }))
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
  const addItem = useCallback((plant, qty = 1) => {
    const amount = Math.min(MAX_QTY, Math.max(1, Math.round(qty) || 1));
    setItems(prev => {
      const existing = prev.find(i => i.id === plant.id);
      if (existing) {
        return prev.map(i =>
          i.id === plant.id ? { ...i, qty: Math.min(MAX_QTY, i.qty + amount) } : i
        );
      }
      return [...prev, {
        id: plant.id,
        slug: plant.slug,
        name: plant.name,
        botanical: plant.botanical,
        price: plant.price,
        image: plant.image,
        qty: amount
      }];
    });
    flash(`${plant.name} added to your enquiry`);
  }, [flash]);

  const removeItem = useCallback(id => setItems(prev => prev.filter(i => i.id !== id)), []);

  // Stepping down from 1 now removes the item rather than doing nothing.
  const setQty = useCallback((id, qty) => {
    const next = Math.round(qty);
    setItems(prev => (next < 1
      ? prev.filter(i => i.id !== id)
      : prev.map(i => (i.id === id ? { ...i, qty: Math.min(MAX_QTY, next) } : i))));
  }, []);

  const clear = useCallback(() => { setItems([]); setNotes(''); }, []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const estimatedTotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return waLink();
    const lines = items.map(i => `• ${i.name} (${i.botanical}) × ${i.qty} — from ₹${i.price} each`);
    let message =
      `Hi ${site.name}, I would like to enquire about:\n\n${lines.join('\n')}\n\n` +
      `Estimated starting total: ₹${estimatedTotal.toLocaleString('en-IN')}`;
    if (notes.trim()) message += `\n\nNotes: ${notes.trim()}`;
    return waLink(message);
  }, [items, notes, estimatedTotal]);

  const value = useMemo(() => ({
    items, addItem, removeItem, setQty, clear,
    count, estimatedTotal,
    drawerOpen, openDrawer, closeDrawer, setDrawerOpen,
    notes, setNotes, whatsappUrl,
    toast, dismissToast
  }), [items, addItem, removeItem, setQty, clear, count, estimatedTotal,
    drawerOpen, openDrawer, closeDrawer, notes, whatsappUrl, toast, dismissToast]);

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return ctx;
}
