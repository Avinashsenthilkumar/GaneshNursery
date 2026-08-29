import React from 'react';
import { Link } from 'react-router-dom';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { IconClose, IconMinus, IconPlus, IconBasket, IconWhatsapp } from './Icons.jsx';

export default function EnquiryDrawer() {
  const { items, removeItem, setQty, clear, estimatedTotal, drawerOpen, setDrawerOpen, notes, setNotes, whatsappUrl } = useEnquiry();
  if (!drawerOpen) return null;

  return (
    <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
      <aside className="drawer" onClick={e => e.stopPropagation()} aria-label="Your enquiry list">
        <div className="drawer-head">
          <h2><IconBasket size={19} /> Your enquiry</h2>
          <button type="button" className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Close"><IconClose size={19} /></button>
        </div>

        {items.length === 0 ? (
          <div className="drawer-empty">
            <p>No plants added yet. Browse the collection and tap the leaf icon to add plants you'd like to ask about.</p>
            <Link to="/plants" className="btn primary" onClick={() => setDrawerOpen(false)}>Browse plants</Link>
          </div>
        ) : (
          <>
            <div className="drawer-list">
              {items.map(i => (
                <div className="drawer-item" key={i.id}>
                  <img src={i.image} alt={i.name} />
                  <div className="drawer-item-body">
                    <strong>{i.name}</strong>
                    <small>₹{i.price} starting</small>
                    <div className="qty-stepper">
                      <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease quantity"><IconMinus size={13} /></button>
                      <span>{i.qty}</span>
                      <button type="button" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase quantity"><IconPlus size={13} /></button>
                    </div>
                  </div>
                  <button type="button" className="drawer-remove" onClick={() => removeItem(i.id)} aria-label={`Remove ${i.name}`}><IconClose size={15} /></button>
                </div>
              ))}
            </div>

            <label className="drawer-notes">
              Notes for the nursery team (optional)
              <textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Delivery city, quantity needed, planting timeline…" />
            </label>

            <div className="drawer-total"><span>Estimated starting total</span><strong>₹{estimatedTotal}</strong></div>
            <p className="drawer-fineprint">Final pricing depends on size, season and quantity — the team will confirm on WhatsApp.</p>

            <a className="btn primary drawer-send" href={whatsappUrl} target="_blank" rel="noreferrer" onClick={() => setDrawerOpen(false)}>
              <IconWhatsapp size={17} /> Send enquiry on WhatsApp
            </a>
            <button type="button" className="drawer-clear" onClick={clear}>Clear all</button>
          </>
        )}
      </aside>
    </div>
  );
}
