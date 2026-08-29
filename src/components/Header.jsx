import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { WA_NUMBER } from '../data/plants.js';
import { IconMenu, IconClose, IconBasket, IconPin, IconLeaf } from './Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setDrawerOpen } = useEnquiry();
  const links = [
    ['/', 'Home'],
    ['/plants', 'Plants'],
    ['/about', 'About Us'],
    ['/services', 'Services'],
    ['/blogs', 'Blogs'],
    ['/contact', 'Contact Us']
  ];

  return (
    <header className="site-header">
      <div className="top-strip">
        <span><IconLeaf size={12} /> 45+ years of nursery excellence</span>
        <span><IconPin size={12} /> Thanjavur, Tamil Nadu</span>
      </div>
      <div className="nav-wrap container">
        <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <img className="brand-mark" src="/brand/logo.png" alt="Ganesh Nursery logo" />
          <div><strong>Ganesh Nursery</strong><small>Greenery for Every Home</small></div>
        </Link>

        <nav className={menuOpen ? 'nav open' : 'nav'}>
          {links.map(([href, label]) => (
            <NavLink key={href} to={href} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive || (href === '/' && location.pathname === '/') ? 'active' : ''}>{label}</NavLink>
          ))}
          <a className="nav-cta" href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Ganesh Nursery, I would like to enquire about your plants.')}`} target="_blank" rel="noreferrer">WhatsApp</a>
        </nav>

        <div className="header-actions">
          <button type="button" className="cart-btn" onClick={() => setDrawerOpen(true)} aria-label="Open enquiry list">
            <IconBasket size={19} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
            {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
