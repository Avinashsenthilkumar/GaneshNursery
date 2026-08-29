import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { WA_NUMBER } from '../data/plants.js';

const EnquiryContext = createContext(null);
const STORAGE_KEY = 'ganesh-nursery-enquiry';

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
  }, [items]);

  const addItem = (plant, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === plant.id);
      if (existing) {
        return prev.map(i => i.id === plant.id ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { id: plant.id, name: plant.name, botanical: plant.botanical, price: plant.price, image: plant.image, qty }];
    });
    setDrawerOpen(true);
  };

  const removeItem = id => setItems(prev => prev.filter(i => i.id !== id));
  const setQty = (id, qty) => setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clear = () => setItems([]);

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const estimatedTotal = useMemo(() => items.reduce((sum, i) => sum + i.qty * i.price, 0), [items]);

  const whatsappUrl = useMemo(() => {
    if (items.length === 0) return `https://wa.me/${WA_NUMBER}`;
    const lines = items.map(i => `• ${i.name} × ${i.qty} (₹${i.price} starting each)`);
    let message = `Hi Ganesh Nursery, I would like to enquire about:\n\n${lines.join('\n')}\n\nEstimated starting total: ₹${items.reduce((s, i) => s + i.qty * i.price, 0)}`;
    if (notes.trim()) message += `\n\nAdditional notes: ${notes.trim()}`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
  }, [items, notes]);

  const value = { items, addItem, removeItem, setQty, clear, count, estimatedTotal, drawerOpen, setDrawerOpen, notes, setNotes, whatsappUrl };
  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return ctx;
}
