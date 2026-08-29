import React, { useMemo, useState } from 'react';
import { plants, categories } from '../data/plants.js';
import PlantCard from '../components/PlantCard.jsx';
import { PageHero } from '../components/PageHero.jsx';
import Reveal from '../components/Reveal.jsx';
import { IconSearch } from '../components/Icons.jsx';

export default function Plants() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');

  const filtered = useMemo(() => {
    let data = plants.filter(p => (category === 'All' || p.category === category) && `${p.name} ${p.botanical}`.toLowerCase().includes(query.toLowerCase()));
    if (sort === 'low') data = [...data].sort((a, b) => a.price - b.price);
    if (sort === 'high') data = [...data].sort((a, b) => b.price - a.price);
    return data;
  }, [category, query, sort]);

  return (
    <main>
      <PageHero eyebrow="THE PLANT HOUSE" title="Plants for every purpose" copy="Explore our curated selection of timber, fruit, native, flowering and indoor plants. Prices shown are starting prices and may vary by size, season and quantity." />
      <section className="catalog-page container">
        <div className="catalog-toolbar">
          <div className="chips">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={category === c ? 'chip active' : 'chip'}>{c}</button>)}</div>
          <div className="catalog-tools">
            <div className="search-field">
              <IconSearch size={15} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search plants…" aria-label="Search plants" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort plants">
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
            </select>
          </div>
        </div>
        <div className="catalog-meta"><span>{filtered.length} plants</span><span>Bulk & institutional orders available</span></div>
        {filtered.length === 0 ? (
          <div className="catalog-empty">
            <p>No plants match "{query}" in {category === 'All' ? 'the catalog' : category}. Try a different search or category.</p>
          </div>
        ) : (
          <div className="plant-grid">{filtered.map((p, i) => <Reveal as="div" delay={(i % 6) * 50} key={p.id}><PlantCard plant={p} /></Reveal>)}</div>
        )}
      </section>
    </main>
  );
}
