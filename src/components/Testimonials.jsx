import React from 'react';
import { IconStar, IconQuote } from './Icons.jsx';
import Reveal from './Reveal.jsx';

function initials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function StarRow({ rating }) {
  return (
    <div className="star-row" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar key={i} size={14} className={i < rating ? 'star-on' : 'star-off'} />
      ))}
    </div>
  );
}

export function hasTestimonials(items) {
  return Array.isArray(items) && items.length > 0;
}

export default function Testimonials({ items = [] }) {
  // Renders nothing when there is no real content, so a page never shows an
  // empty "What clients say" heading sitting over blank space.
  if (!hasTestimonials(items)) return null;

  return (
    <div className="testimonial-grid">
      {items.map((t, i) => (
        <Reveal key={`${t.name}-${i}`} delay={i * 70} className="testimonial-card">
          <IconQuote className="testimonial-quote-mark" />
          <StarRow rating={t.rating} />
          <p className="testimonial-text">{t.quote}</p>
          <div className="testimonial-person">
            <span className="testimonial-avatar" aria-hidden="true">{initials(t.name)}</span>
            <div><strong>{t.name}</strong><small>{t.role}</small></div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
