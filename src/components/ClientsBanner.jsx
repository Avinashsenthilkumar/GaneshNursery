import React from 'react';
import { clients } from '../data/content.js';
import Reveal from './Reveal.jsx';

export default function ClientsBanner() {
  return (
    <section className="trust-section" aria-labelledby="clients-heading">
      <div className="container">
        <Reveal as="div" className="trust-head">
          <span className="section-kicker">Trusted by</span>
          <h2 id="clients-heading">Supplying farms, campuses and public projects</h2>
        </Reveal>
        <ul className="client-grid">
          {clients.map((c, i) => (
            <Reveal as="li" delay={Math.min(i, 4) * 40} className="client-logo" key={c.name}>
              <img src={c.logo} alt={c.name} loading="lazy" decoding="async" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
