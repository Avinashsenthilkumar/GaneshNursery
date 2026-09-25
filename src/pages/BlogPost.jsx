import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { findBlog, blogs } from '../data/content.js';
import { site } from '../data/site.js';
import Seo from '../components/Seo.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import BlogCard from '../components/BlogCard.jsx';
import NotFound from './NotFound.jsx';

// New page. Every "Read more" on the old site looped back to the blog index,
// so there was no article for readers or for search engines to index.
export default function BlogPost() {
  const { slug } = useParams();
  const post = findBlog(slug);
  if (!post) return <NotFound />;

  const others = blogs.filter(b => b.slug !== post.slug);
  const readable = new Date(post.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <main className="article-page">
      <Seo
        title={post.title}
        description={post.excerpt}
        type="article"
        image={post.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: post.image,
          datePublished: post.date,
          inLanguage: post.lang === 'ta' ? 'ta-IN' : 'en-IN',
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name }
        }}
      />

      <article className="container article" lang={post.lang}>
        <Breadcrumbs trail={[
          { label: 'Home', to: '/' },
          { label: 'Blog', to: '/blogs' },
          { label: post.title }
        ]} />

        <header className="article-head">
          <span className="eyebrow">{post.subtitle}</span>
          <h1>{post.title}</h1>
          <p className="article-meta"><time dateTime={post.date}>{readable}</time> · {site.name}</p>
        </header>

        <div className="article-hero">
          <SmartImage src={post.image} alt="" ratio="16 / 9" loading="eager" fetchPriority="high" />
        </div>

        <div className="article-body">
          {post.body.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        <div className="article-cta">
          <p>Planning a plantation and want an honest opinion on species selection?</p>
          <Link className="btn primary" to="/contact">Talk to our team</Link>
        </div>
      </article>

      {others.length > 0 && (
        <section className="related-section">
          <div className="container">
            <div className="section-head"><div><span className="eyebrow">Keep reading</span><h2>More from the nursery</h2></div></div>
            <div className="blog-grid">
              {others.map(b => <BlogCard key={b.slug} blog={b} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
