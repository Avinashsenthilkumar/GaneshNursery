import React from 'react';
import { Link } from 'react-router-dom';
import { WA_NUMBER } from '../data/plants.js';
import { IconWhatsapp } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">
            <img className="brand-mark" src="/brand/logo.png" alt="Ganesh Nursery logo" />
            <div><strong>Ganesh Nursery</strong><small>Greenery for Every Home</small></div>
          </div>
          <p>Wholesale plant nursery specialising in hard-to-find and common plants, timber seedlings, fruit trees and landscaping support.</p>
          <div className="footer-social">
            <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><IconWhatsapp size={15} /></a>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Instagram">IG</a>
          </div>
        </div>
        <div>
          <h4>Key Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/plants">Products / Plants</Link>
          <Link to="/services">Services</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
        <div>
          <h4>Customer Care</h4>
          <Link to="/contact">Terms and Conditions</Link>
          <Link to="/contact">Refund Policy</Link>
          <Link to="/contact">Shipping Policy</Link>
          <Link to="/contact">Privacy Policy</Link>
        </div>
      </div>
      <div className="footer-bottom container">
        <span>Powered by Ganesh Nursery © 2026</span>
        <span>India's Number 1 Choice for Trees | Ganesh Nursery</span>
      </div>
    </footer>
  );
}
