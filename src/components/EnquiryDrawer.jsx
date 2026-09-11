import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { IconClose, IconMinus, IconPlus, IconBasket, IconWhatsapp } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import useBackToClose from '../hooks/useBackToClose.js';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function EnquiryDrawer() {
  const {
    items, removeItem, setQty, clear, estimatedTotal, hasUnpricedItems,
    drawerOpen, closeDrawer, notes, setNotes, whatsappUrl
  } = useEnquiry();

  const panelRef = useRef(null);
  const lastFocused = useRef(null);

  // Android Back / back-swipe closes the sheet instead of leaving the page.
  useBackToClose(drawerOpen, closeDrawer);

  // The old drawer had none of this: no Escape key, no focus trap, no scroll
  // lock (the page scrolled behind it), and focus was dumped at the top of the
  // document on close. All four are baseline modal requirements.
  useEffect(() => {
    if (!drawerOpen) return undefined;

    lastFocused.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    panel?.querySelector(FOCUSABLE)?.focus();

    const onKey = e => {
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Tab' || !panel) return;
      const nodes = Array.from(panel.querySelectorAll(FOCUSABLE)).filter(n => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="drawer-overlay" onClick={closeDrawer}>
      <aside
        ref={panelRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        onClick={e => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2 id="drawer-title"><IconBasket size={19} /> Your enquiry</h2>
          <button type="button" className="icon-btn" onClick={closeDrawer} aria-label="Close enquiry list">
            <IconClose size={19} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>Nothing here yet. Browse the collection and tap <strong>+</strong> on any plant to build a list, then send the whole thing to us in one WhatsApp message.</p>
            <Link to="/plants" className="btn primary" onClick={closeDrawer}>Browse plants</Link>
          </div>
        ) : (
          <>
            <ul className="drawer-list">
              {items.map(i => (
                <li className="drawer-item" key={i.id}>
                  <SmartImage src={i.image} alt="" ratio="1 / 1" className="drawer-item-img" />
                  <div className="drawer-item-body">
                    <strong>{i.name}</strong>
                    <small>{i.price ? `from ₹${i.price.toLocaleString('en-IN')} each` : 'Price on request'}</small>
                    <div className="qty-stepper">
                      <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label={`Decrease ${i.name} quantity`}>
                        <IconMinus size={13} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={i.qty}
                        onChange={e => setQty(i.id, Number(e.target.value))}
                        aria-label={`${i.name} quantity`}
                      />
                      <button type="button" onClick={() => setQty(i.id, i.qty + 1)} aria-label={`Increase ${i.name} quantity`}>
                        <IconPlus size={13} />
                      </button>
                    </div>
                  </div>
                  <button type="button" className="drawer-remove" onClick={() => removeItem(i.id)} aria-label={`Remove ${i.name}`}>
                    <IconClose size={15} />
                  </button>
                </li>
              ))}
            </ul>

            <label className="drawer-notes" htmlFor="drawer-notes-field">
              Notes for the nursery team (optional)
              <textarea
                id="drawer-notes-field"
                rows="2"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Delivery city, quantity needed, planting timeline…"
              />
            </label>

            <div className="drawer-total">
              <span>Estimated starting total</span>
              <strong>₹{estimatedTotal.toLocaleString('en-IN')}</strong>
            </div>
            <p className="drawer-fineprint">
              Indicative only. Final pricing depends on size, season and quantity — the team will confirm on WhatsApp.
              {hasUnpricedItems && ' Some items in your list are quoted on request and are not counted in this total.'}
            </p>

            <a className="btn primary drawer-send" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={closeDrawer}>
              <IconWhatsapp size={17} /> Send enquiry on WhatsApp
            </a>
            <button type="button" className="drawer-clear" onClick={clear}>Clear list</button>
          </>
        )}
      </aside>
    </div>
  );
}
