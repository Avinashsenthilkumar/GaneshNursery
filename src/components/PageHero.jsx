import React from 'react';
import Reveal from './Reveal.jsx';

export function PageHero({ eyebrow, title, copy, image }) {
  const style = image ? {
    backgroundImage: `linear-gradient(125deg, rgba(14,24,16,.78), rgba(30,54,38,.6)), url(${image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  } : undefined;
  return (
    <section className={image ? 'page-hero has-image' : 'page-hero'} style={style}>
      <div className="container">
        <Reveal>
          <span className="eyebrow light">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{copy}</p>
        </Reveal>
      </div>
      {!image && <div className="page-hero-motif" aria-hidden="true" />}
    </section>
  );
}

export function ValueCard({ icon, title, copy }) {
  return (
    <div className="value-card">
      <span className="value-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </div>
  );
}
