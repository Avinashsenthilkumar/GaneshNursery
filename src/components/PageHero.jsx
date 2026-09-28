import React from 'react';
import Reveal from './Reveal.jsx';

export function PageHero({ eyebrow, title, copy, image }) {
  // The old scrim was a flat, heavy wash across the whole banner, which turned
  // these photographs into mud. It is now weighted to the left, where the text
  // actually sits, so the headline stays readable while the right-hand side of
  // the photograph is still clearly visible.
  const style = image ? {
    backgroundImage:
      `linear-gradient(100deg, rgba(12,22,15,.88) 0%, rgba(14,26,17,.74) 38%, rgba(16,30,20,.34) 72%, rgba(16,30,20,.2) 100%), url(${image})`
  } : undefined;

  return (
    <section className={image ? 'page-hero has-image' : 'page-hero'} style={style}>
      <div className="container">
        <Reveal>
          {eyebrow && <span className="eyebrow light">{eyebrow}</span>}
          <h1>{title}</h1>
          {copy && <p>{copy}</p>}
        </Reveal>
      </div>
      {!image && <div className="page-hero-motif" aria-hidden="true" />}
    </section>
  );
}

export function ValueCard({ icon, title, copy }) {
  return (
    <div className="value-card">
      <span className="value-icon" aria-hidden="true">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}
