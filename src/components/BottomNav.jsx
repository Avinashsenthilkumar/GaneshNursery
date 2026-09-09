import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IconLeaf, IconSearch, IconBasket, IconWhatsapp, IconPin } from './Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { site, waLink } from '../data/site.js';

// Mobile-only bottom tab bar. This is the single biggest thing that makes a
// website feel like an app: thumb-reachable navigation that stays put while
// the content scrolls, instead of a hamburger menu you have to open every time.
// Hidden entirely on desktop, where the top nav is the right pattern.
export default function BottomNav() {
  const { count, openDrawer } = useEnquiry();
  const { pathname } = useLocation();

  // Don't cover the content on the contact page, which already has its own
  // large action buttons.
  const hidden = pathname === '/contact';

  return (
    <nav className={hidden ? 'bottom-nav is-hidden' : 'bottom-nav'} aria-label="Main">
      <NavLink to="/" end className="bottom-nav-item">
        <IconLeaf size={21} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/plants" className="bottom-nav-item">
        <IconSearch size={21} />
        <span>Plants</span>
      </NavLink>

      <a
        className="bottom-nav-item bottom-nav-cta"
        href={waLink(`Hi ${site.name}, I would like to enquire about your plants.`)}
        target="_blank"
        rel="noreferrer"
      >
        <span className="bottom-nav-cta-ring"><IconWhatsapp size={22} /></span>
        <span>Chat</span>
      </a>

      <button type="button" className="bottom-nav-item" onClick={openDrawer}>
        <span className="bottom-nav-badge-wrap">
          <IconBasket size={21} />
          {count > 0 && <span className="bottom-nav-badge">{count > 99 ? '99+' : count}</span>}
        </span>
        <span>Enquiry</span>
      </button>

      <NavLink to="/contact" className="bottom-nav-item">
        <IconPin size={21} />
        <span>Visit</span>
      </NavLink>
    </nav>
  );
}
