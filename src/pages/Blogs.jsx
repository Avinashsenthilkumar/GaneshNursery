import React from 'react';
import { Link } from 'react-router-dom';
import { blogs } from '../data/content.js';
import BlogCard from '../components/BlogCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';

export default function Blogs() {
  return (
    <main>
      <PageHero eyebrow="LATEST BLOGS" title="Plant knowledge that grows with you" copy="Practical stories, timber insights and ideas to help you choose, plant and care for better greenery." image="/brand/community-banner.jpg" />
      <section className="blogs-page container">
        <div className="blog-grid large">{blogs.map((b, i) => <Reveal as="div" delay={i * 80} key={b.title}><BlogCard blog={b} large /></Reveal>)}</div>
        <Reveal as="div" className="blog-note">
          <span className="eyebrow light">YOUR PLANT HOUSE</span>
          <h2>Learn before you plant.</h2>
          <p>Explore species, planting basics, maintenance ideas and ways greenery can become a long-term asset for your home or farm.</p>
          <Link className="btn primary" to="/plants">Browse plants</Link>
        </Reveal>
      </section>
    </main>
  );
}
