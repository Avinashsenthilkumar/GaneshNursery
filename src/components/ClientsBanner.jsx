import React from 'react';
import { clients } from '../data/content.js';
import Reveal from './Reveal.jsx';

export default function ClientsBanner() {
  return (
    <section className="trust-section"><div className="container">
      <Reveal as="div" className="trust-head">
        <span className="section-kicker">TRUSTED BY</span>
        <h2>Our Clients</h2>
      </Reveal>
      <div className="client-grid">{clients.map((c, i) => (
        <Reveal as="div" delay={i * 40} className="client-logo" key={c.name}>
          <img src={c.logo} alt={c.name} loading="lazy" />
        </Reveal>
      ))}</div>
    </div></section>
  );
}
