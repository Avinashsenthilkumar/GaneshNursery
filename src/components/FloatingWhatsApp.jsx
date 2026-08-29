import React from 'react';
import { WA_NUMBER } from '../data/plants.js';
import { IconWhatsapp } from './Icons.jsx';

export default function FloatingWhatsApp() {
  return (
    <a
      className="floating-wa"
      href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Ganesh Nursery, I want to enquire about your plants.')}`}
      target="_blank"
      rel="noreferrer"
    >
      <IconWhatsapp size={19} /> <span>Chat on WhatsApp</span>
    </a>
  );
}
