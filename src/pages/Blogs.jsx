import React from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/content.js';
import { site } from '../data/site.js';
import BlogCard from '../components/BlogCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';

export default function Blogs() {
  return (
    <main>
      <Seo
        title="Plant & Timber Growing Guides"
        description={`Species guides, timber insights and planting advice from ${site.name}, Thanjavur — practical knowledge for farms, institutions and home growers in Tamil Nadu.`}
      />

      <PageHero
        eyebrow="From the nursery"
        title="Plant knowledge that grows with you"
        copy="Practical stories, timber insights and ideas to help you choose, plant and care for better greenery."
        image="/brand/community-banner.jpg"
      />

      <section className="blogs-page container">
        <div className="blog-grid large">
          {blogs.map((b, i) => (
            <Reveal as="div" delay={i * 80} key={b.slug}><BlogCard blog={b} large /></Reveal>
          ))}
        </div>

        <Reveal as="div" className="cta-panel dark">
          <div>
            <span className="eyebrow light">Your plant house</span>
            <h2>Learn before you plant.</h2>
            <p>Species, planting basics, maintenance and the ways greenery becomes a long-term asset for your home or farm.</p>
          </div>
          <Link className="btn primary" to="/plants">Browse plants</Link>
        </Reveal>
      </section>
    </main>
  );
}
