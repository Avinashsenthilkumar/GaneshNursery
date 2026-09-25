import React from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';

export default function BlogCard({ blog, large = false }) {
  // "Read more" used to point back at the blog index — a dead end. Each post
  // now has its own page at /blogs/<slug>.
  const href = `/blogs/${blog.slug}`;
  return (
    <article className={large ? 'blog-card large' : 'blog-card'} lang={blog.lang}>
      <Link to={href} className="blog-image" tabIndex={-1} aria-hidden="true">
        <SmartImage src={blog.image} alt="" ratio={large ? '16 / 9' : '4 / 3'} />
      </Link>
      <div className="blog-body">
        <span className="eyebrow">{blog.subtitle}</span>
        <h3><Link to={href}>{blog.title}</Link></h3>
        <p>{blog.excerpt}</p>
        <Link className="text-link" to={href}>
          Read more<span aria-hidden="true"> →</span>
        </Link>
      </div>
    </article>
  );
}
