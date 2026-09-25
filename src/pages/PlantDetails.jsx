import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { plantUrl, variantPrice } from '../data/plants.js';

import { useContent } from '../context/ContentContext.jsx';
import PlantCard from '../components/PlantCard.jsx';
import Lightbox from '../components/Lightbox.jsx';
import Reveal from '../components/Reveal.jsx';
import Seo from '../components/Seo.jsx';
import SmartImage from '../components/SmartImage.jsx';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import NotFound from './NotFound.jsx';
import {
  IconSun, IconRuler, IconLeaf, IconDrop, IconSoil, IconPin,
  IconMinus, IconPlus, IconWhatsapp
} from '../components/Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function PlantDetails() {
  const { id } = useParams();
  const { plants, site, waLink } = useContent();
  // Resolved from live content so an admin edit shows immediately.
  const plant = plants.find(p => p.slug === String(id).toLowerCase())
    || plants.find(p => String(p.id) === String(id));
  const { addItem } = useEnquiry();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);
  // Which size the customer is buying. Most species here sell at several
  // heights at very different prices — a single "from ₹X" hid that, and an
  // enquiry that never named a size meant the team had to ask every time.
  const [variantIdx, setVariantIdx] = useState(0);

  if (!plant) return <NotFound />;

  // Old numeric links (/plants/3) redirect to the readable slug, so there is
  // one canonical URL per plant instead of two competing ones.
  if (String(id) !== plant.slug) return <Navigate to={plantUrl(plant)} replace />;

  const variants = plant.variants || [];
  const variant = variants[Math.min(variantIdx, Math.max(variants.length - 1, 0))];
  const unitPrice = variant ? variantPrice(variant) : plant.price;

  const sizeLabel = variant
    ? `${variant.size}${variant.age ? `, ${variant.age}` : ''}${variant.bag ? `, ${variant.bag} bag` : ''}`
    : '';

  const waMessage = waLink(
    `Hi ${site.name}, I am interested in ${plant.name} (${plant.botanical})`
    + (variant ? ` — ${sizeLabel} at ₹${unitPrice} each` : '')
    + ` × ${qty}. Please confirm availability and bulk price.`
  );

  // Each size enters the enquiry list as its own line, so a customer can ask
  // for three 3 ft and two 6 ft of one species and have both survive.
  const addSelected = () => addItem({
    ...plant,
    id: variants.length > 1 ? `${plant.id}-${variantIdx}` : plant.id,
    name: variants.length > 1 ? `${plant.name} — ${variant.size}` : plant.name,
    price: unitPrice
  }, qty);

  const related = plants
    .filter(p => p.category === plant.category && p.id !== plant.id)
    .slice(0, 4);

  const gallery = plant.gallery && plant.gallery.length ? plant.gallery : [null];

  const lowPrice = variants.length ? Math.min(...variants.map(variantPrice)) : plant.price;
  const highPrice = variants.length ? Math.max(...variants.map(variantPrice)) : plant.price;

  return (
    <main>
      <Seo
        title={`${plant.name} (${plant.botanical})`}
        description={`${plant.description} ${variants.length > 1 ? `Available in ${variants.length} sizes from ₹${lowPrice}.` : `₹${lowPrice}.`} From ${site.name}, ${site.address.city}.`}
        type="product"
        image={plant.image || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: plant.name,
          alternateName: plant.botanical,
          description: plant.description,
          ...(plant.image ? { image: `${site.url}${plant.image}` } : {}),
          category: plant.category,
          brand: { '@type': 'Brand', name: site.name },
          // A price range is the honest shape for something sold at eight
          // heights — a single figure would misrepresent seven of them.
          offers: variants.length > 1
            ? {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice,
              highPrice,
              offerCount: variants.length,
              availability: 'https://schema.org/InStock',
              url: `${site.url}${plantUrl(plant)}`,
              seller: { '@type': 'Organization', name: site.name }
            }
            : {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: lowPrice,
              priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
              availability: 'https://schema.org/InStock',
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
              onClick={() => plant.image && setLightboxOpen(true)}
              disabled={!plant.image}
              aria-label={plant.image ? `Open larger photo of ${plant.name}` : `No photograph available for ${plant.name} yet`}
            >
              <SmartImage
                src={gallery[activeImg]}
                alt={plant.name}
                ratio="1 / 1"
                fit="contain"
                loading="eager"
                fetchPriority="high"
              />
            </button>
            {gallery.length > 1 && (
              <div className="detail-thumbs">
                {gallery.map((src, i) => (
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
              ₹{unitPrice.toLocaleString('en-IN')}
              {variant && variant.offer && variant.cost > variant.offer && (
                <s className="detail-mrp">₹{variant.cost.toLocaleString('en-IN')}</s>
              )}
              <span>per plant{sizeLabel ? ` · ${sizeLabel}` : ''}</span>
            </p>

            <p className="detail-intro">{plant.description}</p>

            {variants.length > 0 && (
              <div className="size-table" role="radiogroup" aria-label={`Choose a size for ${plant.name}`}>
                <div className="size-table-head">
                  <h2>{variants.length === 1 ? 'Size and price' : `Available in ${variants.length} sizes`}</h2>
                  {variants.length > 1 && <span>Tap a row to choose</span>}
                </div>

                <ul className="size-rows">
                  {variants.map((v, i) => {
                    const active = i === variantIdx;
                    const unit = variantPrice(v);
                    return (
                      <li key={`${v.size}-${i}`}>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={active}
                          className={active ? 'size-row is-active' : 'size-row'}
                          onClick={() => setVariantIdx(i)}
                        >
                          <span className="size-row-main">
                            <strong>{v.size}</strong>
                            <small>{[v.age, v.bag ? `${v.bag} bag` : null].filter(Boolean).join(' · ')}</small>
                            {v.note && <small className="size-row-note">{v.note}</small>}
                          </span>
                          <span className="size-row-price">
                            <strong>₹{unit.toLocaleString('en-IN')}</strong>
                            {v.offer && v.cost > v.offer && <s>₹{v.cost.toLocaleString('en-IN')}</s>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <p className="size-table-note">{site.priceValidityNote}</p>
              </div>
            )}

            <dl className="detail-points">
              <div><dt><IconSun size={18} /> Light</dt><dd>{plant.light}</dd></div>
              <div><dt><IconDrop size={18} /> Water</dt><dd>{plant.water}</dd></div>
              <div><dt><IconSoil size={18} /> Soil</dt><dd>{plant.soil}</dd></div>
              <div><dt><IconRuler size={18} /> Heights</dt><dd>{plant.size || '—'}</dd></div>
              {/* Provenance is this nursery's strongest argument and was not
                  shown anywhere before. */}
              {plant.seedSource && <div><dt><IconPin size={18} /> Seed source</dt><dd>{plant.seedSource}</dd></div>}
              {plant.motherTree && <div><dt><IconLeaf size={18} /> Mother tree</dt><dd>{plant.motherTree}</dd></div>}
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
              <span className="qty-hint">
                {unitPrice ? `≈ ₹${(unitPrice * qty).toLocaleString('en-IN')}` : 'Bulk pricing available'}
              </span>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn primary" onClick={addSelected}>
                Add to enquiry
              </button>
              <a className="btn ghost" href={waMessage} target="_blank" rel="noreferrer">
                <IconWhatsapp size={16} /> Ask on WhatsApp
              </a>
            </div>

            <p className="detail-note">
              Availability changes with the season. We will confirm the exact size and
              price before anything is committed.
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

      {lightboxOpen && plant.image && (
        <Lightbox
          images={gallery}
          index={activeImg}
          name={plant.name}
          onClose={() => setLightboxOpen(false)}
          onNav={setActiveImg}
        />
      )}
    </main>
  );
}
