import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { plants, categories } from '../data/plants.js';
import PlantCard from '../components/PlantCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import { IconSearch, IconClose } from '../components/Icons.jsx';
import { site } from '../data/site.js';

const SORTS = [
  ['featured', 'Featured'],
  ['low', 'Price: low to high'],
  ['high', 'Price: high to low'],
  ['name', 'Name: A–Z']
];

export default function Plants() {
  // Filters now live in the URL. Previously they were component state only, so
  // a filtered view could not be bookmarked, shared on WhatsApp, or returned
  // to with the Back button — all of which matter on a sales site.
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const sort = params.get('sort') || 'featured';
  const urlQuery = params.get('q') || '';

  const [query, setQuery] = useState(urlQuery);

  // Debounced so the URL is not rewritten on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setParams(prev => {
        const next = new URLSearchParams(prev);
        if (query) next.set('q', query); else next.delete('q');
        return next;
      }, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [query, setParams]);

  const update = (key, value) => {
    setParams(prev => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'All' && value !== 'featured') next.set(key, value);
      else next.delete(key);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = plants.filter(p => {
      const matchesCategory = category === 'All' || p.category === category;
      const haystack = `${p.name} ${p.botanical} ${p.category}`.toLowerCase();
      return matchesCategory && (!q || haystack.includes(q));
    });
    // Items quoted on request have no number to sort by, so they go last in
    // both directions rather than being treated as ₹0.
    const lo = p => (p.price == null ? Number.POSITIVE_INFINITY : p.price);
    const hi = p => (p.price == null ? Number.NEGATIVE_INFINITY : p.price);
    if (sort === 'low') data = [...data].sort((a, b) => lo(a) - lo(b));
    if (sort === 'high') data = [...data].sort((a, b) => hi(b) - hi(a));
    if (sort === 'name') data = [...data].sort((a, b) => a.name.localeCompare(b.name));
    return data;
  }, [category, query, sort]);

  const clearAll = () => { setQuery(''); setParams({}); };
  const isFiltered = category !== 'All' || Boolean(query) || sort !== 'featured';

  return (
    <main>
      <Seo
        title="All Plants & Timber Saplings in Thanjavur"
        description={`Buy sandalwood, red sandal, karungali, rosewood, khaya and guava saplings in Thanjavur. Every listing shows the age, height and bag size we supply. Affordable prices, wholesale rates on bulk.`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Plant catalogue',
          numberOfItems: plants.length,
          itemListElement: plants.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `${site.url}/plants/${p.slug}`
          }))
        }}
      />

      <PageHero
        image="/brand/banner-plants.jpg"
        eyebrow="The plant house"
        title="Plants for every purpose"
        copy="Sandalwood, red sandal, karungali, rosewood, khaya and guava. Every listing shows the age, height and bag size we actually supply. Prices are starting prices and vary with quantity — tell us what you need and we will quote it properly."
      />

      <section className="catalog-page container">
        <div className="catalog-toolbar">
          <div className="chips" role="group" aria-label="Filter by category">
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => update('category', c)}
                className={category === c ? 'chip active' : 'chip'}
                aria-pressed={category === c}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="catalog-tools">
            <div className="search-field">
              <IconSearch size={15} />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search sandalwood, karungali, guava…"
                aria-label="Search plants by name or botanical name"
              />
              {query && (
                <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
                  <IconClose size={14} />
                </button>
              )}
            </div>
            <select value={sort} onChange={e => update('sort', e.target.value)} aria-label="Sort plants">
              {SORTS.map(([v, label]) => <option key={v} value={v}>{label}</option>)}
            </select>
          </div>
        </div>

        <div className="catalog-meta">
          <span role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? 'plant' : 'plants'}
            {category !== 'All' ? ` in ${category}` : ''}
          </span>
          {isFiltered
            ? <button type="button" className="text-link" onClick={clearAll}>Clear filters</button>
            : <span>Bulk &amp; institutional orders available</span>}
        </div>

        {filtered.length === 0 ? (
          <div className="catalog-empty">
            <p>
              Nothing matches {query ? <strong>“{query}”</strong> : 'those filters'}
              {category !== 'All' ? <> in <strong>{category}</strong></> : null}.
            </p>
            <p className="catalog-empty-sub">
              We stock far more than is listed here. Ask us directly — we very likely have it.
            </p>
            <button type="button" className="btn ghost" onClick={clearAll}>Clear filters</button>
          </div>
        ) : (
          <div className="plant-grid">
            {filtered.map((p, i) => (
              <Reveal as="div" delay={Math.min(i % 6, 5) * 45} key={p.id}>
                <PlantCard plant={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
