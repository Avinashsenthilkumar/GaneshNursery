import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { site } from '../data/site.js';

// Every page in the old build shared one <title> and one meta description. For
// a business that wants to be found for "timber saplings Tamil Nadu" that is
// the single most expensive thing on the site. This gives each route its own
// title, description, canonical URL, social preview card and structured data —
// with no extra dependency to install.

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({
  title,
  // 'append' (default) renders "Page | Ganesh Nursery". 'replace' uses the
  // title verbatim — used on the homepage, where the brand name is already in
  // the title and repeating it wastes characters Google will truncate.
  titleMode = 'append',
  description,
  image = `${site.url}/brand/og-image.jpg`,
  type = 'website',
  jsonLd,
  extraJsonLd,
  noindex = false
}) {
  const { pathname } = useLocation();
  const fullTitle = title
    ? (titleMode === 'replace' ? title : `${title} | ${site.name}`)
    : `${site.name} — ${site.tagline}`;
  const canonical = `${site.url}${pathname === '/' ? '' : pathname}`;

  useEffect(() => {
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex,follow' : 'index,follow');
    setLink('canonical', canonical);

    setMeta('property', 'og:site_name', site.name);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:locale', 'en_IN');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);
  }, [fullTitle, description, canonical, image, type, noindex]);

  useEffect(() => {
    const blocks = [jsonLd, extraJsonLd].filter(Boolean);
    if (blocks.length === 0) return undefined;
    const els = blocks.map(block => {
      const el = document.createElement('script');
      el.type = 'application/ld+json';
      el.textContent = JSON.stringify(block);
      document.head.appendChild(el);
      return el;
    });
    return () => { els.forEach(el => el.remove()); };
  }, [jsonLd, extraJsonLd]);

  return null;
}
