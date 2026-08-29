import React from 'react';
import { Link } from 'react-router-dom';
import { plants } from '../data/plants.js';
import { clients, services, blogs, testimonials } from '../data/content.js';
import PlantCard from '../components/PlantCard.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import BlogCard from '../components/BlogCard.jsx';
import Testimonials, { StarRow } from '../components/Testimonials.jsx';
import ClientsBanner from '../components/ClientsBanner.jsx';
import Reveal from '../components/Reveal.jsx';

const avgRating = (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1);

export default function Home() {
  return (
    <main>
      <section className="hero container">
        <Reveal as="div" className="hero-copy">
          <span className="eyebrow">GANESH NURSERY · EST. 1980</span>
          <h1>Grow a greener home.<br /><em>Grow a stronger future.</em></h1>
          <p>Quality seedlings, timber plants, fruit trees, flowering plants and complete landscape solutions from a nursery built on 45+ years of experience.</p>
          <div className="hero-actions">
            <Link className="btn primary" to="/plants">Explore Plants</Link>
            <Link className="btn ghost" to="/contact">Talk to Our Team</Link>
          </div>
          <div className="hero-stats">
            <div><b>45+</b><span>Years of excellence</span></div>
            <div><b>100+</b><span>Plant varieties</span></div>
            <div><b>18+</b><span>Institutional clients</span></div>
          </div>
        </Reveal>
        <Reveal as="div" delay={120} className="hero-art">
          <div className="hero-photo" style={{ backgroundImage: `url(/brand/team-photo.jpg)` }}></div>
          <div className="hero-card">
            <StarRow rating={5} />
            <strong>{avgRating} / 5 rated</strong>
            <span>by farms, institutions & homes</span>
          </div>
          <svg className="hero-branch" viewBox="0 0 200 200" aria-hidden="true"><path d="M10 190C60 150 70 90 40 20M40 20c10 20 5 35-10 40M40 20c15 8 30 4 38-12M75 110c18 4 32-4 38-20M75 110c4 20-6 34-22 40" /></svg>
        </Reveal>
      </section>

      <ClientsBanner />

      <section className="split-section container">
        <Reveal as="div" className="image-stack">
          <div className="big-image" style={{ backgroundImage: `url(${plants[4].image})` }}></div>
          <div className="experience-badge"><b>45+</b><span>years of<br />experience</span></div>
        </Reveal>
        <Reveal as="div" delay={100} className="content-col">
          <span className="eyebrow">OUR ROOTS</span>
          <h2>Welcome to 45+ year old Ganesh Nursery</h2>
          <p className="quote">"As the quality of the seed is determined by the quality of mother trees."</p>
          <h4>COMPANY PROFILE</h4>
          <p>Since its inception in 1980 we have been the pioneer of providing and promoting silviculture throughout Tamil Nadu. Being the oldest and biggest timber nursery in India, we have produced crores of tree saplings in hundreds of varieties till date. As the forerunners of this industry we supply saplings for major farms, the Forest Department of Tamil Nadu, Central Government institutions and other nurseries. With strong roots we are expanding our branches all over the world and starting exports to Africa. We nurse plants, we nurse your profits.</p>
          <Link className="text-link" to="/about">Read our story <span aria-hidden>→</span></Link>
        </Reveal>
      </section>

      <section className="catalog-teaser"><div className="container">
        <Reveal as="div" className="section-head">
          <div><span className="eyebrow">PLANT COLLECTION</span><h2>Pick your next green companion</h2><p>Browse timber, fruit, flowering, indoor and native plants with simple starting prices.</p></div>
          <Link className="btn primary" to="/plants">View all plants</Link>
        </Reveal>
        <div className="plant-grid home-plants">{plants.slice(0, 6).map((p, i) => <Reveal as="div" delay={i * 60} key={p.id}><PlantCard plant={p} /></Reveal>)}</div>
      </div></section>

      <section className="services-teaser container">
        <Reveal as="div" className="section-head"><div><span className="eyebrow">WHAT WE DO</span><h2>From seedling to full landscape</h2></div><Link className="text-link" to="/services">View all services <span aria-hidden>→</span></Link></Reveal>
        <div className="service-grid">{services.map((s, i) => <Reveal as="div" delay={i * 70} key={s.title}><ServiceCard service={s} /></Reveal>)}</div>
      </section>

      <section className="story-banner"><div className="container story-grid">
        <Reveal as="div"><span className="eyebrow light">OUR PROMISE</span><h2>We nurse plants.<br /><em>We nurse your profits.</em></h2></Reveal>
        <Reveal as="p" delay={90}>Strong roots, healthy planting material and practical guidance for farms, institutions, homes and green spaces.</Reveal>
      </div></section>

      <section className="testimonials-section container">
        <Reveal as="div" className="section-head"><div><span className="eyebrow">WHAT CLIENTS SAY</span><h2>Trusted across farms, campuses & homes</h2></div></Reveal>
        <Testimonials items={testimonials.slice(0, 3)} />
      </section>

      <section className="blog-teaser container">
        <Reveal as="div" className="section-head"><div><span className="eyebrow">LATEST BLOGS</span><h2>Ideas for a greener tomorrow</h2></div><Link className="text-link" to="/blogs">Read all blogs <span aria-hidden>→</span></Link></Reveal>
        <div className="blog-grid">{blogs.map((b, i) => <Reveal as="div" delay={i * 80} key={b.title}><BlogCard blog={b} /></Reveal>)}</div>
      </section>
    </main>
  );
}
