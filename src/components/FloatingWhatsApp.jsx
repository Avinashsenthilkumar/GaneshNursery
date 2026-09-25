import { useContent } from '../context/ContentContext.jsx';
import React from 'react';

import { IconWhatsapp } from './Icons.jsx';

export default function FloatingWhatsApp() {
  const { site, waLink } = useContent();
  return (
    <a
      className="floating-wa"
      href={waLink(`Hi ${site.name}, I want to enquire about your plants.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with us on WhatsApp"
    >
      <IconWhatsapp size={19} />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
