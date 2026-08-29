import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ blog, large = false }) {
  return (
    <article className={large ? 'blog-card large' : 'blog-card'}>
      <img src={blog.image} alt="" loading="lazy" />
      <div className="blog-body">
        <span className="eyebrow">{blog.subtitle}</span>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt}</p>
        <Link className="text-link" to="/blogs">Read more <span aria-hidden>→</span></Link>
      </div>
    </article>
  );
}
