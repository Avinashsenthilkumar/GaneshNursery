import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site, waLink, yearsInBusiness } from '../data/site.js';
import { IconMenu, IconClose, IconBasket, IconPin, IconLeaf, IconPhone } from './Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

const links = [
  ['/', 'Home'],
  ['/plants', 'Plants'],
  ['/services', 'Services'],
  ['/about', 'About Us'],
  ['/blogs', 'Blogs'],
  ['/contact', 'Contact Us']
];

export default function Header() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count, openDrawer } = useEnquiry();
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  // Close the mobile menu on route change. The old version relied on an
  // onClick on each NavLink, which missed browser back/forward navigation.
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Escape and outside-click both close the menu — neither worked before.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = e => {
      if (e.key === 'Escape') { setMenuOpen(false); toggleRef.current?.focus(); }
    };
    const onPointer = e => {
      if (navRef.current?.contains(e.target) || toggleRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <div className="top-strip">
        <span><IconLeaf size={12} /> {yearsInBusiness}+ years of nursery excellence</span>
        <span><IconPin size={12} /> {site.address.city}, {site.address.state}</span>
        <a className="top-strip-phone" href={`tel:${site.phoneE164}`}>
          <IconPhone size={12} /> {site.phoneDisplay}
        </a>
      </div>

      <div className="nav-wrap container">
        <Link className="brand" to="/" aria-label={`${site.name} — home`}>
          <img className="brand-mark" src="/brand/logo.png" alt="" width="48" height="48" />
          <span className="brand-text">
            <strong>{site.name}</strong>
            <small>{site.tagline}</small>
          </span>
        </Link>

        <nav
          id="primary-navigation"
          ref={navRef}
          className={menuOpen ? 'nav open' : 'nav'}
          aria-label="Primary"
        >
          {links.map(([href, label]) => (
            <NavLink key={href} to={href} end={href === '/'}>{label}</NavLink>
          ))}
          <a
            className="nav-cta"
            href={waLink(`Hi ${site.name}, I would like to enquire about your plants.`)}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="cart-btn"
            onClick={openDrawer}
            aria-label={count > 0 ? `Open enquiry list, ${count} item${count === 1 ? '' : 's'}` : 'Open enquiry list'}
          >
            <IconBasket size={19} />
            {count > 0 && <span className="cart-badge" aria-hidden="true">{count}</span>}
          </button>
          <button
            type="button"
            ref={toggleRef}
            className="menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
          >
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
