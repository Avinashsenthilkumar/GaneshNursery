import React from 'react';
import { Link } from 'react-router-dom';

import { services, blogs, testimonials } from '../data/content.js';

import { useContent } from '../context/ContentContext.jsx';
import PlantCard from '../components/PlantCard.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import BlogCard from '../components/BlogCard.jsx';
import Testimonials, { hasTestimonials } from '../components/Testimonials.jsx';
import ClientsBanner from '../components/ClientsBanner.jsx';
import Faq, { buildFaqs } from '../components/Faq.jsx';
import CptSeeds from '../components/CptSeeds.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { IconPin, IconCheck, IconPhone } from '../components/Icons.jsx';

// Structured data so Google can present the nursery as a local business with
// address, hours and phone. The old site had none, which is a large part of
// why it would never surface in a "plant nursery near Thanjavur" map result.
const buildLocalBusiness = site => ({
  '@context': 'https://schema.org',
  '@type': 'GardenStore',
  name: site.name,
  description: `Wholesale plant nursery in ${site.address.city} supplying timber seedlings, fruit trees, native species and landscaping services since ${site.foundedYear}.`,
  url: site.url,
  telephone: site.phoneE164,
  email: site.email,
  foundingDate: String(site.foundedYear),
  image: `${site.url}/brand/logo.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country
  },
  geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
  areaServed: site.areasServed || ['Tamil Nadu', 'IN'],
  knowsAbout: site.keywords,
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '18:00'
  }],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Plants and saplings',
    itemListElement: ['Timber saplings', 'Fruit trees', 'Macadamia saplings', 'Native species', 'Indoor plants', 'Flowering plants']
      .map(name => ({ '@type': 'OfferCatalog', name }))
  }
});

// Emitted as a second block so a search result can show the questions inline.
// Built from the same list the component renders, so edits cannot drift apart.
function buildFaqSchema(site, years) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: buildFaqs(site, years).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

export default function Home() {
  const { plants, site, fullAddress, yearsInBusiness } = useContent();
  const featured = [
    ...plants.filter(p => p.popular).slice(0, 3),
    ...plants.filter(p => !p.popular).slice(0, 3)
  ];

  return (
    <main>
      <Seo
        title="Best Nursery near Thanjavur — Sandalwood, Teak &amp; Fruit Saplings"
        titleMode="replace"
        description={`Looking for a nursery near Thanjavur? Ganesh Nursery has raised timber and fruit saplings since ${site.foundedYear} — sandalwood, red sandal, teak, karungali, rosewood, khaya mahogany, mango, guava and coconut, from elite mother trees. Serving Thanjavur, Pudukottai and Trichy. Call ${site.phoneDisplay}.`}
        jsonLd={buildLocalBusiness(site)}
        extraJsonLd={buildFaqSchema(site, yearsInBusiness)}
      />

      {/* Full-bleed banner hero, matching the layout of the live site: the
          grower artwork runs edge to edge with the message sitting over it.
          A gradient scrim keeps the white text readable over the yellow — the
          artwork alone does not give enough contrast to read against. */}
      <section className="hero-banner">
        <img
          className="hero-banner-img"
          src="/brand/home-banner.jpg"
          alt={`${site.name} growers holding tree saplings`}
          width="1600"
          height="571"
          fetchpriority="high"
          decoding="async"
        />
        <div className="hero-banner-scrim" aria-hidden="true" />

        <div className="container hero-banner-inner">
          <Reveal as="div" className="hero-banner-copy">
            <span className="eyebrow light">A garden like never before</span>
            <h1>
              Our {yearsInBusiness}+ years of experience
              <br />
              will be a strong support to you
            </h1>
            <p>
              Quality nursery plants nurtured with care, experience and sustainable
              practices — sandalwood, red sandal, teak, karungali, rosewood, khaya,
              mango, guava and coconut, raised from elite mother trees.
            </p>

            <div className="hero-banner-phones">
              <a href={`tel:${site.phoneE164}`}>
                <IconPhone size={16} /> {site.phoneDisplay}
              </a>
              <a href={`tel:${site.phoneAltE164}`}>
                <IconPhone size={16} /> {site.phoneAltDisplay}
              </a>
            </div>

            <div className="hero-actions">
              <Link className="btn primary" to="/plants">Explore plants</Link>
              <Link className="btn light" to="/contact">Talk to our team</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The proof points and numbers that used to sit inside the split hero
          now form their own strip, so the banner stays uncluttered. */}
      <section className="hero-strip">
        <div className="container hero-strip-inner">
          <ul className="hero-proof">
            <li><IconCheck size={14} /> Bulk &amp; institutional supply</li>
            <li><IconCheck size={14} /> Species matched to your soil</li>
            <li><IconCheck size={14} /> Delivery across India</li>
          </ul>
          <div className="hero-stats">
            <div><b>{yearsInBusiness}+</b><span>Years growing</span></div>
            <div><b>100+</b><span>Plant varieties</span></div>
            <div><b>Crores</b><span>Of saplings raised</span></div>
          </div>
        </div>
      </section>

      <ClientsBanner />

      <section className="split-section container">
        <Reveal as="div" className="image-stack">
          <div className="big-image">
            <SmartImage src="/brand/team-photo.jpg" alt={`A ${site.name} grower in the sapling beds`} ratio="4 / 5" />
          </div>
          <div className="experience-badge"><b>{yearsInBusiness}+</b><span>years of<br />experience</span></div>
        </Reveal>
        <Reveal as="div" delay={100} className="content-col">
          <span className="eyebrow">Our roots</span>
          <h2>A nursery built on {yearsInBusiness} years of silviculture</h2>
          <p className="quote">“The quality of the seed is determined by the quality of the mother trees.”</p>
          <p>
            Since {site.foundedYear} we have promoted silviculture across Tamil Nadu, raising
            crores of tree saplings in hundreds of varieties. We supply farms, the Forest
            Department of Tamil Nadu, Central Government institutions and other nurseries —
            and we are now beginning to export.
          </p>
          <p>
            We nurse plants, and we nurse your profits. Tell us your soil, water and timeline
            and we will tell you honestly what will work on your land.
          </p>
          <Link className="text-link" to="/about">Read our story<span aria-hidden="true"> →</span></Link>
        </Reveal>
      </section>

      <CptSeeds />

      <section className="catalog-teaser" aria-labelledby="collection-heading">
        <div className="container">
          <Reveal as="div" className="section-head">
            <div>
              <span className="eyebrow">Plant collection</span>
              <h2 id="collection-heading">Pick your next green companion</h2>
              <p>Timber and fruit saplings, each listed with its real heights, ages, bag weights and prices.</p>
            </div>
            <Link className="btn primary" to="/plants">View all plants</Link>
          </Reveal>
          <div className="plant-grid">
            {featured.map((p, i) => (
              <Reveal as="div" delay={Math.min(i, 3) * 60} key={p.id}><PlantCard plant={p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="services-teaser container" aria-labelledby="services-heading">
        <Reveal as="div" className="section-head">
          <div><span className="eyebrow">What we do</span><h2 id="services-heading">From seedling to full landscape</h2></div>
          <Link className="text-link" to="/services">View all services<span aria-hidden="true"> →</span></Link>
        </Reveal>
        <div className="service-grid">
          {services.map((s, i) => (
            <Reveal as="div" delay={i * 70} key={s.slug}><ServiceCard service={s} /></Reveal>
          ))}
        </div>
      </section>

      <section className="story-banner">
        <div className="container story-grid">
          <Reveal as="div">
            <span className="eyebrow light">Our promise</span>
            <h2>We nurse plants.<br /><em>We nurse your profits.</em></h2>
          </Reveal>
          <Reveal as="div" delay={90} className="story-copy">
            <p>
              Strong roots, healthy planting material and practical guidance for farms,
              institutions, homes and green spaces.
            </p>
            <p className="story-address"><IconPin size={15} /> {fullAddress.join(', ')}</p>
            <Link className="btn primary" to="/contact">Start an enquiry</Link>
          </Reveal>
        </div>
      </section>

      {hasTestimonials(testimonials) && (
        <section className="testimonials-section container" aria-labelledby="testimonials-heading">
          <Reveal as="div" className="section-head">
            <div><span className="eyebrow">What clients say</span><h2 id="testimonials-heading">Trusted across farms, campuses &amp; homes</h2></div>
          </Reveal>
          <Testimonials items={testimonials.slice(0, 3)} />
        </section>
      )}

      <Faq />

      <section className="blog-teaser container" aria-labelledby="blog-heading">
        <Reveal as="div" className="section-head">
          <div><span className="eyebrow">From the nursery</span><h2 id="blog-heading">Ideas for a greener tomorrow</h2></div>
          <Link className="text-link" to="/blogs">Read all posts<span aria-hidden="true"> →</span></Link>
        </Reveal>
        <div className="blog-grid">
          {blogs.map((b, i) => (
            <Reveal as="div" delay={i * 80} key={b.slug}><BlogCard blog={b} /></Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
