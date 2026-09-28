import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { plantUrl, variantPrice, galleryFor } from '../data/plants.js';

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
  IconMinus, IconPlus, IconWhatsapp, IconCheck, IconChevronLeft, IconChevronRight
} from '../components/Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

// A sentinel index for the "any other height" row, kept out of the numeric
// range so it can never collide with a real variant index.
const CUSTOM = -1;

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
  const variants = plant?.variants || [];
  // A plant with no published sizes (Magilam) opens straight in custom-height
  // mode, otherwise its only action would be a disabled button.
  const [variantIdx, setVariantIdx] = useState(() => (variants.length ? 0 : CUSTOM));
  const [customHeight, setCustomHeight] = useState('');

  const isCustom = variantIdx === CUSTOM;
  const variant = isCustom ? null : variants[Math.min(variantIdx, Math.max(variants.length - 1, 0))];

  // Photos follow the chosen size: the size's own shots lead, then the
  // plant's general ones. Recomputed whenever the selection changes so the
  // thumbnail strip always leads with the height being bought.
  const gallery = useMemo(
    () => (plant ? galleryFor(plant, variant) : []),
    [plant, variant]
  );

  if (!plant) return <NotFound />;

  // Old numeric links (/plants/3) redirect to the readable slug, so there is
  // one canonical URL per plant instead of two competing ones.
  if (String(id) !== plant.slug) return <Navigate to={plantUrl(plant)} replace />;

  const unitPrice = variant ? variantPrice(variant) : null;
  const hasPrice = Number.isFinite(unitPrice);

  const sizeLabel = variant
    ? `${variant.size}${variant.age ? `, ${variant.age}` : ''}${variant.bag ? `, ${variant.bag} bag` : ''}`
    : (customHeight.trim() ? `${customHeight.trim()} (custom height)` : 'custom height');

  const waMessage = waLink(
    `Hi ${site.name}, I am interested in ${plant.name} (${plant.botanical})`
    + ` — ${sizeLabel}`
    + (hasPrice ? ` at ₹${unitPrice} each` : '')
    + ` × ${qty}. Please confirm availability and price.`
  );

  // Each size enters the enquiry list as its own line, so a customer can ask
  // for three 3 ft and two 6 ft of one species and have both survive.
  const addSelected = () => addItem({
    ...plant,
    id: isCustom
      ? `${plant.id}-custom-${customHeight.trim() || 'any'}`
      : (variants.length > 1 ? `${plant.id}-${variantIdx}` : plant.id),
    name: isCustom
      ? `${plant.name} — ${customHeight.trim() || 'custom height'}`
      : (variants.length > 1 ? `${plant.name} — ${variant.size}` : plant.name),
    price: hasPrice ? unitPrice : null
  }, qty);

  const canAdd = isCustom ? customHeight.trim().length > 0 : variants.length > 0;

  const related = plants
    .filter(p => p.category === plant.category && p.id !== plant.id)
    .slice(0, 4);

  const prices = variants.map(variantPrice).filter(Number.isFinite);
  const lowPrice = prices.length ? Math.min(...prices) : null;
  const highPrice = prices.length ? Math.max(...prices) : null;

  const hasDetailCopy = plant.planting || plant.care || plant.uses
    || (plant.highlights && plant.highlights.length);

  const step = dir => setActiveImg(i => (i + dir + gallery.length) % gallery.length);

  return (
    <main>
      <Seo
        title={`${plant.name} (${plant.botanical})`}
        description={`${plant.description} ${variants.length > 1
          ? `Available in ${variants.length} sizes from ₹${lowPrice}.`
          : (lowPrice != null ? `₹${lowPrice}.` : 'Price on request.')} From ${site.name}, ${site.address.city}.`}
        type="product"
        image={plant.images?.[0] || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: plant.name,
          alternateName: plant.botanical,
          description: plant.description,
          ...(plant.images?.length
            ? { image: plant.images.map(src => `${site.url}${src}`) }
            : {}),
          category: plant.category,
          brand: { '@type': 'Brand', name: site.name },
          // A price range is the honest shape for something sold at eight
          // heights — a single figure would misrepresent seven of them. With
          // no priced variant at all we publish availability without a price
          // rather than inventing one, which Google rejects anyway.
          offers: lowPrice == null
            ? {
              '@type': 'Offer',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: `${site.url}${plantUrl(plant)}`,
              seller: { '@type': 'Organization', name: site.name }
            }
            : variants.length > 1
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
            <div className="detail-stage">
              <button
                type="button"
                className="detail-image"
                onClick={() => gallery.length && setLightboxOpen(true)}
                disabled={!gallery.length}
                aria-label={gallery.length
                  ? `Open larger photo of ${plant.name}`
                  : `No photograph available for ${plant.name} yet`}
              >
                <SmartImage
                  src={gallery[Math.min(activeImg, Math.max(gallery.length - 1, 0))] || null}
                  alt={plant.name}
                  ratio="1 / 1"
                  fit="contain"
                  loading="eager"
                  fetchPriority="high"
                  /* The stage is roughly half the page on desktop and the full
                     width on a phone — the card default would under-serve it. */
                  sizes="(max-width: 980px) 92vw, 560px"
                />
              </button>

              {/* Swiping is the natural gesture on a phone, but on a desktop
                  there is nothing to swipe — hence real arrows too. */}
              {gallery.length > 1 && (
                <>
                  <button type="button" className="detail-nav prev" onClick={() => step(-1)} aria-label="Previous photo">
                    <IconChevronLeft size={20} />
                  </button>
                  <button type="button" className="detail-nav next" onClick={() => step(1)} aria-label="Next photo">
                    <IconChevronRight size={20} />
                  </button>
                  <span className="detail-count" aria-hidden="true">
                    {Math.min(activeImg, gallery.length - 1) + 1} / {gallery.length}
                  </span>
                </>
              )}

              {variant?.images?.length > 0 && (
                <span className="detail-size-flag">Photo of the {variant.size} plant</span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="detail-thumbs" role="tablist" aria-label={`${plant.name} photos`}>
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    role="tab"
                    className={i === activeImg ? 'thumb active' : 'thumb'}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View photo ${i + 1}`}
                    aria-selected={i === activeImg}
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
              {hasPrice ? `₹${unitPrice.toLocaleString('en-IN')}` : 'Price on request'}
              {variant && variant.offer && variant.cost > variant.offer && (
                <s className="detail-mrp">₹{variant.cost.toLocaleString('en-IN')}</s>
              )}
              <span>
                {hasPrice
                  ? `per plant${sizeLabel ? ` · ${sizeLabel}` : ''}`
                  : 'tell us the height you need and we will quote'}
              </span>
            </p>

            <p className="detail-intro">{plant.description}</p>

            {plant.highlights?.length > 0 && (
              <ul className="detail-highlights">
                {plant.highlights.map(h => (
                  <li key={h}><IconCheck size={14} /> {h}</li>
                ))}
              </ul>
            )}

            <div className="size-table" role="radiogroup" aria-label={`Choose a size for ${plant.name}`}>
              <div className="size-table-head">
                <h2>
                  {variants.length === 0
                    ? 'Sizes'
                    : variants.length === 1 ? 'Size and price' : `Available in ${variants.length} sizes`}
                </h2>
                {variants.length > 1 && <span>Tap a row to choose</span>}
              </div>

              {variants.length > 0 && (
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
                          onClick={() => { setVariantIdx(i); setActiveImg(0); }}
                        >
                          {/* A thumbnail per row makes the height difference
                              obvious at a glance — the whole point of stocking
                              eight of them. */}
                          {v.images?.[0] && (
                            <span className="size-row-thumb">
                              <img src={v.images[0]} alt="" loading="lazy" />
                            </span>
                          )}
                          <span className="size-row-main">
                            <strong>{v.size}</strong>
                            <small>{[v.age, v.bag ? `${v.bag} bag` : null].filter(Boolean).join(' · ')}</small>
                            {v.note && <small className="size-row-note">{v.note}</small>}
                          </span>
                          <span className="size-row-price">
                            <strong>{Number.isFinite(unit) ? `₹${unit.toLocaleString('en-IN')}` : 'On request'}</strong>
                            {v.offer && v.cost > v.offer && <s>₹{v.cost.toLocaleString('en-IN')}</s>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Customers regularly want a height between the listed grades,
                  or larger than anything on the list. Previously they had no
                  way to say so without abandoning the page for WhatsApp. */}
              <div className={isCustom ? 'size-custom is-active' : 'size-custom'}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isCustom}
                  className="size-custom-toggle"
                  onClick={() => { setVariantIdx(isCustom ? 0 : CUSTOM); setActiveImg(0); }}
                >
                  <span className="size-row-main">
                    <strong>{variants.length ? 'Need a different height?' : 'Tell us the height you need'}</strong>
                    <small>We grow to order — tell us the size and we will quote</small>
                  </span>
                  <span className="size-custom-mark" aria-hidden="true">
                    {isCustom ? <IconCheck size={15} /> : <IconPlus size={15} />}
                  </span>
                </button>

                {isCustom && (
                  <label className="size-custom-field">
                    Height you want
                    <input
                      type="text"
                      value={customHeight}
                      onChange={e => setCustomHeight(e.target.value)}
                      placeholder="e.g. 9 ft, or 10–12 ft for an avenue"
                      autoFocus
                    />
                    <small>
                      Availability and price depend on the season and the quantity.
                      We will come back to you with both.
                    </small>
                  </label>
                )}
              </div>

              <p className="size-table-note">{site.priceValidityNote}</p>
            </div>

            <dl className="detail-points">
              <div><dt><IconSun size={18} /> Light</dt><dd>{plant.light}</dd></div>
              <div><dt><IconDrop size={18} /> Water</dt><dd>{plant.water}</dd></div>
              <div><dt><IconSoil size={18} /> Soil</dt><dd>{plant.soil}</dd></div>
              <div><dt><IconRuler size={18} /> Heights</dt><dd>{plant.size || 'To order'}</dd></div>
              {/* Provenance is this nursery's strongest argument. */}
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
                {hasPrice ? `≈ ₹${(unitPrice * qty).toLocaleString('en-IN')}` : 'Bulk pricing available'}
              </span>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn primary" onClick={addSelected} disabled={!canAdd}>
                Add to enquiry
              </button>
              <a className="btn ghost" href={waMessage} target="_blank" rel="noreferrer">
                <IconWhatsapp size={16} /> Ask on WhatsApp
              </a>
            </div>

            {isCustom && !customHeight.trim() && (
              <p className="detail-note">Type the height you want above to add it to your enquiry.</p>
            )}

            {plant.notice && <p className="detail-notice">{plant.notice}</p>}

            <p className="detail-note">
              Availability changes with the season. We will confirm the exact size and
              price before anything is committed.
            </p>
            <Link className="text-link" to="/contact">Request a written quote<span aria-hidden="true"> →</span></Link>
          </Reveal>
        </div>
      </section>

      {/* Growing guidance is what turns a price list into a reason to buy from
          us rather than whoever is cheapest. */}
      {hasDetailCopy && (
        <section className="grow-guide" aria-labelledby="grow-heading">
          <div className="container">
            <div className="section-head">
              <div>
                <span className="eyebrow">Growing {plant.name}</span>
                <h2 id="grow-heading">What to know before you plant</h2>
              </div>
            </div>
            <div className="grow-grid">
              {plant.planting && (
                <Reveal as="article" className="grow-card">
                  <h3><IconSoil size={18} /> Planting</h3>
                  <p>{plant.planting}</p>
                </Reveal>
              )}
              {plant.care && (
                <Reveal as="article" delay={70} className="grow-card">
                  <h3><IconDrop size={18} /> Care</h3>
                  <p>{plant.care}</p>
                </Reveal>
              )}
              {plant.uses && (
                <Reveal as="article" delay={140} className="grow-card">
                  <h3><IconLeaf size={18} /> Uses and market</h3>
                  <p>{plant.uses}</p>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

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

      {lightboxOpen && gallery.length > 0 && (
        <Lightbox
          images={gallery}
          index={Math.min(activeImg, gallery.length - 1)}
          name={plant.name}
          onClose={() => setLightboxOpen(false)}
          onNav={setActiveImg}
        />
      )}
    </main>
  );
}
