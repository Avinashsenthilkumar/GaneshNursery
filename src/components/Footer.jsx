import React from 'react';
import { Link } from 'react-router-dom';
import { site, waLink, fullAddress } from '../data/site.js';
import { IconWhatsapp, IconPhone, IconMail, IconPin } from './Icons.jsx';

// Social links now come from site.js. If a handle is empty the icon is simply
// not rendered — the old footer shipped href="#" placeholders that looked like
// working links and went nowhere.
const socialLabels = { facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube' };
const socialShort = { facebook: 'FB', instagram: 'IG', youtube: 'YT' };

export default function Footer() {
  const activeSocial = Object.entries(site.social).filter(([, url]) => Boolean(url));

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col-brand">
          <div className="brand footer-brand">
            <img className="brand-mark" src="/brand/logo.png" alt="" width="48" height="48" />
            <span className="brand-text"><strong>{site.name}</strong><small>{site.tagline}</small></span>
          </div>
          <p>
            Wholesale plant nursery specialising in timber seedlings, fruit trees,
            native species and landscaping support, supplying farms, institutions
            and homes across India since {site.foundedYear}.
          </p>
          <div className="footer-social">
            <a href={waLink()} target="_blank" rel="noreferrer" aria-label="WhatsApp"><IconWhatsapp size={15} /></a>
            {activeSocial.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={socialLabels[key]}>
                {socialShort[key]}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer-col" aria-label="Key links">
          <h4>Key Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/plants">Plants</Link>
          <Link to="/services">Services</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <nav className="footer-col" aria-label="Customer care">
          <h4>Customer Care</h4>
          <Link to="/terms">Terms &amp; Conditions</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/shipping-policy">Shipping Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </nav>

        <div className="footer-col footer-col-contact">
          <h4>Reach Us</h4>
          <a href={`tel:${site.phoneE164}`}><IconPhone size={14} /> {site.phoneDisplay}</a>
          <a href={`mailto:${site.email}`}><IconMail size={14} /> {site.email}</a>
          <address>
            <IconPin size={14} />
            <span>{fullAddress.join(', ')}</span>
          </address>
          <small className="footer-hours">{site.openingHours}</small>
        </div>
      </div>

      <div className="footer-bottom container">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>Quality saplings from {site.address.city}, {site.address.state}</span>
      </div>
    </footer>
  );
}
