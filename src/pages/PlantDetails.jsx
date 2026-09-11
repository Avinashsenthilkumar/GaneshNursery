import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { plants, findPlant, plantUrl, priceLabel } from '../data/plants.js';
import { site, waLink } from '../data/site.js';
import PlantCard from '../components/PlantCard.jsx';
import Lightbox from '../components/Lightbox.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import NotFound from './NotFound.jsx';
import {
  IconSun, IconRuler, IconLeaf, IconDrop, IconSoil, IconClock,
  IconMinus, IconPlus, IconWhatsapp
} from '../components/Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function PlantDetails() {
  const { id } = useParams();
  const plant = findPlant(id);
  const { addItem } = useEnquiry();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);

  if (!plant) return <NotFound />;

  // Old numeric links (/plants/3) redirect to the readable slug, so there is
  // one canonical URL per plant instead of two competing ones.
  if (String(id) !== plant.slug) return <Navigate to={plantUrl(plant)} replace />;

  const waMessage = waLink(
    `Hi ${site.name}, I am interested in ${plant.name} (${plant.botanical}) × ${qty}. ` +
    'Please share availability, sizes and bulk price.'
  );

  const related = plants
    .filter(p => p.category === plant.category && p.id !== plant.id)
    .slice(0, 4);

  return (
    <main>
      <Seo
        title={`${plant.name} (${plant.botanical})`}
        description={`${plant.description} ${plant.price == null ? 'Price on request.' : `Starting from ₹${plant.price}.`} Supplied at ${plant.size}${plant.bag ? ` in a ${plant.bag}` : ''}. Available from ${site.name}, ${site.address.city}.`}
        type="product"
        image={plant.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: plant.name,
          alternateName: plant.botanical,
          description: plant.description,
          image: plant.image,
          category: plant.category,
          brand: { '@type': 'Brand', name: site.name },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'INR',
            // Google rejects a null price, so items without one are published
            // as "ask for a quote" rather than with an invented number.
            ...(plant.price == null
              ? { availability: 'https://schema.org/InStock' }
              : { price: plant.price, priceValidUntil: `${new Date().getFullYear() + 1}-12-31`, availability: 'https://schema.org/InStock' }),
            url: `${site.url}${plantUrl(plant)}`,
            seller: { '@type': 'Organization', name: site.name }
          }
        }}
      />

      <section className="detail-page container">
        <Breadcrumbs trail={[
          { label: 'Home', to: '/' },
          { label: 'Plants', to: '/plants' },
          { label: plant.name }
        ]} />

        <div className="detail-grid">
          <Reveal as="div" className="detail-gallery">
            <button
              type="button"
              className="detail-image"
              onClick={() => setLightboxOpen(true)}
              aria-label={`Open larger photo of ${plant.name}`}
            >
              <SmartImage
                src={plant.gallery[activeImg]}
                alt={plant.name}
                ratio="1 / 1"
                fit="contain"
                loading="eager"
                fetchPriority="high"
              />
            </button>
            {plant.gallery.length > 1 && (
              <div className="detail-thumbs">
                {plant.gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={i === activeImg ? 'thumb active' : 'thumb'}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View photo ${i + 1}`}
                    aria-current={i === activeImg}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal as="div" delay={100} className="detail-copy">
            <span className="eyebrow">{plant.category}</span>
            <h1>{plant.name}</h1>
            {plant.tamil && <p className="detail-tamil" lang="ta">{plant.tamil}</p>}
            <p className="botanical big">{plant.botanical}</p>

            <p className="detail-price">
              {priceLabel(plant)}
              {plant.mrp && plant.price && plant.mrp > plant.price && (
                <s className="detail-mrp">₹{plant.mrp.toLocaleString('en-IN')}</s>
              )}
              <span>{plant.price == null ? 'message us for current rates' : 'starting price, per sapling'}</span>
            </p>

            <p className="detail-intro">{plant.description}</p>

            {/* The care tiles were three near-empty boxes repeating the
                category. They now carry information a buyer actually needs. */}
            <dl className="detail-points">
              <div><dt><IconSun size={18} /> Light</dt><dd>{plant.light}</dd></div>
              <div><dt><IconDrop size={18} /> Water</dt><dd>{plant.water}</dd></div>
              <div><dt><IconRuler size={18} /> Supplied at</dt><dd>{plant.size}</dd></div>
              {plant.bag && <div><dt><IconLeaf size={18} /> Bag size</dt><dd>{plant.bag}</dd></div>}
              {plant.age && <div><dt><IconClock size={18} /> Age</dt><dd>{plant.age}</dd></div>}
              <div><dt><IconSoil size={18} /> Soil</dt><dd>{plant.soil}</dd></div>
              <div><dt><IconLeaf size={18} /> Type</dt><dd>{plant.category}</dd></div>
            </dl>

            <div className="qty-row">
              <span id="qty-label">Quantity</span>
              <div className="qty-stepper large">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <IconMinus size={14} />
                </button>
                <input
                  type="number"
                  min="1"
                  value={qty}
                  onChange={e => setQty(Math.max(1, Math.round(Number(e.target.value)) || 1))}
                  aria-labelledby="qty-label"
                />
                <button type="button" onClick={() => setQty(q => q + 1)} aria-label="Increase quantity">
                  <IconPlus size={14} />
                </button>
              </div>
              <span className="qty-hint">Bulk pricing from 100+</span>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn primary" onClick={() => addItem(plant, qty)}>
                Add to enquiry
              </button>
              <a className="btn ghost" href={waMessage} target="_blank" rel="noreferrer">
                <IconWhatsapp size={16} /> Ask on WhatsApp
              </a>
            </div>

            <p className="detail-note">
              Availability changes with the season. Prices are indicative and depend on size
              and quantity — we will confirm before anything is committed.
            </p>
            <Link className="text-link" to="/contact">Request a written quote<span aria-hidden="true"> →</span></Link>
          </Reveal>
        </div>
      </section>

      {related.length > 0 && (
        <section className="related-section" aria-labelledby="related-heading">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">You may also like</span>
                <h2 id="related-heading">More {plant.category.toLowerCase()} plants</h2>
              </div>
              <Link className="text-link" to={`/plants?category=${plant.category}`}>
                See all {plant.category}<span aria-hidden="true"> →</span>
              </Link>
            </div>
            <div className="plant-grid">
              {related.map(p => <PlantCard key={p.id} plant={p} />)}
            </div>
          </div>
        </section>
      )}

      {lightboxOpen && (
        <Lightbox
          images={plant.gallery}
          index={activeImg}
          name={plant.name}
          onClose={() => setLightboxOpen(false)}
          onNav={setActiveImg}
        />
      )}
    </main>
  );
}
