import React from 'react';
import { PageHero, ValueCard } from '../components/PageHero.jsx';
import Testimonials from '../components/Testimonials.jsx';
import { testimonials } from '../data/content.js';
import Reveal from '../components/Reveal.jsx';
import { IconPin } from '../components/Icons.jsx';

export default function About() {
  return (
    <main>
      <PageHero eyebrow="OUR STORY" title="Deep roots. Better plants. Bigger impact." copy="Ganesh Nursery is a wholesale plant nursery specialising in hard-to-find and common plants alike, with a strong focus on seeds, plants and live roots." image="/brand/community-banner.jpg" />
      <section className="about-content container">
        <Reveal as="div" className="about-story">
          <span className="eyebrow">COMPANY PROFILE</span>
          <h2>Welcome to 45+ year old Ganesh Nursery</h2>
          <p className="quote">As the quality of the seed is determined by the quality of mother trees.</p>
          <p>Since its inception in 1980 we have been the pioneer of providing and promoting silviculture throughout Tamil Nadu. Being the oldest and biggest timber nursery in India we have produced crores of tree saplings in hundreds of varieties till date. As the forerunners of this industry we supply saplings for major farms, the Forest Department of Tamil Nadu, Central Government institutions and other nurseries.</p>
          <p>With strong roots we are expanding our branches all over the world as we start exports to Africa. We nurse plants, we nurse your profits.</p>
          <p>Ganesh Nursery is headquartered in Thanjavur, Tamil Nadu, with a delivery network serving customers across India.</p>
        </Reveal>
        <Reveal as="div" delay={100} className="values-grid">
          <ValueCard icon="45" title="45 Years" copy="A long-standing nursery journey built around quality planting material." />
          <ValueCard icon="G" title="Who We Are" copy="A practical team supporting farms, institutions, landscapers and home growers." />
          <ValueCard icon={<IconPin size={20} />} title="Location" copy="Headquartered in Thanjavur, Tamil Nadu with a growing delivery network." />
          <ValueCard icon="♥" title="Customer Service" copy="Dedicated support, expert knowledge and quick turnarounds." />
          <ValueCard icon="＋" title="Innovation" copy="Modern growing, planting and landscape approaches that keep us improving." />
          <ValueCard icon="◎" title="Generations" copy="Generations of horticultural business experience and sector knowledge." />
        </Reveal>
      </section>


      <section className="testimonials-section container">
        <div className="section-head"><div><span className="eyebrow">WHAT CLIENTS SAY</span><h2>Voices from the field</h2></div></div>
        <Testimonials items={testimonials.slice(3, 6)} />
      </section>

      <section className="map-placeholder"><div className="container">
        <Reveal as="div" className="map-card">
          <div className="map-copy">
            <span className="eyebrow">VISIT US</span>
            <h2>Ganesh Nursery</h2>
            <p>First Block, Veilailaividu, Taluk, Gandarvakottai,<br />Tamil Nadu 613301</p>
            <a className="btn primary" href="https://www.google.com/maps/search/?api=1&query=Ganesh+Nursery+Thanjavur+Tamil+Nadu" target="_blank" rel="noreferrer">Get Directions</a>
          </div>
          <div className="map-art">
            <IconPin size={40} className="map-pin" />
            <span>Thanjavur</span>
            <small>Tamil Nadu</small>
          </div>
        </Reveal>
      </div></section>
    </main>
  );
}
