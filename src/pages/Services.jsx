import React from 'react';
import { services, process } from '../data/content.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Services() {
  return (
    <main>
      <PageHero eyebrow="OUR SERVICES" title="Plan, plant and maintain with confidence" copy="From small home gardens to large landscapes, our team supports design, planting, maintenance and green-wall solutions." image="/brand/community-banner.jpg" />
      <section className="services-page container">
        <div className="service-grid large">{services.map((s, i) => <Reveal as="div" delay={i * 80} key={s.title}><ServiceCard service={s} large /></Reveal>)}</div>
        <div className="process">
          <span className="eyebrow">HOW WE WORK</span>
          <h2>Simple steps. Clear communication.</h2>
          <div className="process-grid">
            {process.map(([n, t, c], i) => (
              <Reveal as="div" delay={i * 70} className="process-card" key={n}>
                <span>{n}</span><h3>{t}</h3><p>{c}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
