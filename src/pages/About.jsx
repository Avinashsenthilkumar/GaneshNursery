import React from 'react';
import { Link } from 'react-router-dom';
import { PageHero, ValueCard } from '../components/PageHero.jsx';
import Testimonials, { hasTestimonials } from '../components/Testimonials.jsx';
import { testimonials } from '../data/content.js';
import { site, yearsInBusiness, fullAddress, mapsLink } from '../data/site.js';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import { IconPin, IconLeaf, IconClock } from '../components/Icons.jsx';

export default function About() {
  return (
    <main>
      <Seo
        title="About Our Thanjavur Nursery"
        description={`${site.name} has raised timber, fruit and native saplings in ${site.address.city}, Tamil Nadu since ${site.foundedYear} — supplying farms, the Forest Department of Tamil Nadu, universities and other nurseries across the state.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: `About ${site.name}`,
          url: `${site.url}/about`
        }}
      />

      <PageHero
        eyebrow="Our story"
        title="Deep roots. Better plants. Bigger impact."
        copy="A wholesale nursery specialising in hard-to-find and everyday species alike, with a focus on seeds, saplings and live roots."
        image="/brand/community-banner.jpg"
      />

      <section className="about-content container">
        <Reveal as="div" className="about-story">
          <span className="eyebrow">Company profile</span>
          <h2>{yearsInBusiness} years of raising trees in Tamil Nadu</h2>
          <p className="quote">“The quality of the seed is determined by the quality of the mother trees.”</p>
          <p>
            Since {site.foundedYear} we have promoted silviculture throughout Tamil Nadu.
            We have raised crores of tree saplings across hundreds of varieties, and we
            supply major farms, the Forest Department of Tamil Nadu, Central Government
            institutions and other nurseries.
          </p>
          <p>
            With strong roots we are extending our branches — we have begun exporting to
            Africa. We nurse plants, and we nurse your profits.
          </p>
          <p>
            {site.name} is headquartered in {site.address.city}, {site.address.state}, with a
            delivery network serving customers across India.
          </p>
          <Link className="btn primary" to="/contact">Work with us</Link>
        </Reveal>

        <Reveal as="div" delay={100} className="values-grid">
          <ValueCard icon={yearsInBusiness} title={`${yearsInBusiness} years`} copy="A long-standing nursery journey built around quality planting material." />
          <ValueCard icon={<IconLeaf size={20} />} title="Who we are" copy="A practical team supporting farms, institutions, landscapers and home growers." />
          <ValueCard icon={<IconPin size={20} />} title="Where we are" copy={`Headquartered in ${site.address.city}, ${site.address.state}, delivering across India.`} />
          <ValueCard icon={<IconClock size={20} />} title="How we work" copy="Honest species advice first, then supply — we would rather turn down a sale than sell you the wrong tree." />
        </Reveal>
      </section>

      {hasTestimonials(testimonials) && (
        <section className="testimonials-section container" aria-labelledby="about-testimonials">
          <div className="section-head">
            <div><span className="eyebrow">What clients say</span><h2 id="about-testimonials">Voices from the field</h2></div>
          </div>
          <Testimonials items={testimonials.slice(0, 3)} />
        </section>
      )}

      <section className="map-section" id="visit">
        <div className="container">
          <Reveal as="div" className="map-card">
            <div className="map-copy">
              <span className="eyebrow">Visit us</span>
              <h2>{site.name}</h2>
              <address>{fullAddress.map(l => <React.Fragment key={l}>{l}<br /></React.Fragment>)}</address>
              <p className="map-hours"><IconClock size={15} /> {site.openingHours}</p>
              <a className="btn primary" href={mapsLink} target="_blank" rel="noreferrer">Get directions</a>
            </div>
            <div className="map-embed">
              <iframe
                title={`Map showing ${site.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapsQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
