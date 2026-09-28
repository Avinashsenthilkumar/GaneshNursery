import React from 'react';
import { Link } from 'react-router-dom';
import { services, process } from '../data/content.js';
import { site } from '../data/site.js';
import ServiceCard from '../components/ServiceCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';

export default function Services() {
  return (
    <main>
      <Seo
        title="Landscaping & Green Wall Services in Thanjavur"
        description={`Garden and landscape design, planting plans, vertical gardens and green walls from ${site.name}, ${site.address.city}. Serving homes, farms and campuses across Tamil Nadu with maintenance contracts available.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Services',
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem', position: i + 1, name: s.title
          }))
        }}
      />

      <PageHero
        eyebrow="Our services"
        title="Plan, plant and maintain with confidence"
        copy="From small home gardens to campus-scale landscapes — design, planting, maintenance and green-wall solutions."
        image="/brand/community-banner.jpg"
      />

      <section className="services-page container">
        <div className="service-grid large">
          {services.map((s, i) => (
            <Reveal as="div" delay={i * 80} key={s.slug}><ServiceCard service={s} large /></Reveal>
          ))}
        </div>

        <div className="process">
          <span className="eyebrow">How we work</span>
          <h2>Simple steps. Clear communication.</h2>
          <ol className="process-grid">
            {process.map(([n, t, c], i) => (
              <Reveal as="li" delay={i * 70} className="process-card" key={n}>
                <span aria-hidden="true">{n}</span>
                <h3>{t}</h3>
                <p>{c}</p>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal as="div" className="cta-panel">
          <div>
            <h2>Have a site in mind?</h2>
            <p>Send us the location, area and what you want it to look like. We will come back with a species plan and a realistic budget.</p>
          </div>
          <Link className="btn primary" to="/contact">Start an enquiry</Link>
        </Reveal>
      </section>
    </main>
  );
}
