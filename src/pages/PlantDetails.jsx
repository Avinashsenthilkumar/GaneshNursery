import React, { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  plants, findPlant, plantUrl, rupees, priceRangeLabel, sizeFeet, PRICE_LIST
} from '../data/plants.js';
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

const variantText = v => [v.label, v.size, v.age].filter(Boolean).join(' · ');

export default function PlantDetails() {
  const { id } = useParams();
  const plant = findPlant(id);
  const { addItem } = useEnquiry();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // The description is the longest thing on the page and the only part a buyer
  // can skip, so it is clamped by default. That is what buys the room for the
  // photo, the specs and the size picker to share one screen.
  const [descOpen, setDescOpen] = useState(false);

  // One grade is always open, so there is never a state where the page shows a
  // price without saying which size it belongs to.
  const [openKey, setOpenKey] = useState(
    () => (plant && plant.defaultVariant ? plant.defaultVariant.key : null)
  );

  // Quantity is per size, not per plant: wanting 200 one-foot seedlings and 5
  // seven-foot trees is a completely normal order, and one shared counter
  // silently overwrote the first number with the second.
  const [qtyByKey, setQtyByKey] = useState({});

  if (!plant) return <NotFound />;

  // Old numeric links (/plants/3) redirect to the readable slug, so there is
  // one canonical URL per plant instead of two competing ones.
  if (String(id) !== plant.slug) return <Navigate to={plantUrl(plant)} replace />;

  const variants = plant.variants;
  const multi = variants.length > 1;
  const selected = variants.find(v => v.key === openKey) || plant.defaultVariant || variants[0];
  const pricedVariants = variants.filter(v => v.price != null);

  // The tallest grade sets the scale for the little height gauge on each row.
  const tallest = Math.max(...variants.map(v => sizeFeet(v.size)), 1);

  const qtyOf = key => qtyByKey[key] || 1;
  const setQtyOf = (key, next) =>
    setQtyByKey(prev => ({ ...prev, [key]: Math.max(1, Math.round(next) || 1) }));

  // Everything the nursery needs in order to answer with a real quote instead
  // of "which size did you mean?" — variety, height, age, bag weight, rate and
  // the line total, all resolved before the message is sent.
  const waFor = (v, qty) => {
    const spec = [v.label, v.size, v.age, v.bag].filter(Boolean).join(', ');
    const rate = v.price != null
      ? ` at ${rupees(v.price)} each (total ${rupees(v.price * qty)})`
      : '';
    return waLink(
      `Hi ${site.name}, I would like to enquire about ${plant.name} (${plant.botanical}).\n\n` +
      `Size: ${spec}\nQuantity: ${qty}${rate ? `\nRate: ${rupees(v.price)} each\nTotal: ${rupees(v.price * qty)}` : ''}\n\n` +
      'Please confirm availability and the current rate.'
    );
  };

  const related = plants
    .filter(p => p.category === plant.category && p.id !== plant.id)
    .slice(0, 4);

  return (
    <main>
      <Seo
        title={`${plant.name} (${plant.botanical})`}
        description={`${plant.description} ${plant.priceFrom == null ? 'Price on request.' : `${priceRangeLabel(plant)} depending on height.`} Available in ${variants.length} ${variants.length === 1 ? 'size' : 'sizes'} from ${site.name}, ${site.address.city}.`}
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
          // A plant sold in eight grades is one product with a price range, not
          // one product at one price. Publishing it as an AggregateOffer is what
          // lets Google show "₹75 – ₹585" instead of a single misleading figure.
          offers: pricedVariants.length === 0
            ? {
              '@type': 'Offer',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: `${site.url}${plantUrl(plant)}`,
              seller: { '@type': 'Organization', name: site.name }
            }
            : {
              '@type': 'AggregateOffer',
              priceCurrency: 'INR',
              lowPrice: plant.priceFrom,
              highPrice: plant.priceTo,
              offerCount: pricedVariants.length,
              availability: 'https://schema.org/InStock',
              url: `${site.url}${plantUrl(plant)}`,
              seller: { '@type': 'Organization', name: site.name }
            }
        }}
      />

      <section className="detail-page container detail-container">
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
                ratio="4 / 5"
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

            {/* The headline price follows the open size rather than sitting
                frozen at the starting rate — someone looking at the 7–8 ft
                grade should see what the 7–8 ft grade costs. */}
            <p className="detail-price">
              {selected && selected.price != null ? rupees(selected.price) : 'Price on request'}
              {selected && selected.mrp && <s className="detail-mrp">{rupees(selected.mrp)}</s>}
              <span>
                {selected && selected.price == null
                  ? 'message us for current rates'
                  : `per sapling${selected ? ` · ${variantText(selected)}` : ''}`}
              </span>
            </p>

            <p className={descOpen ? 'detail-intro' : 'detail-intro is-clamped'}>
              {plant.description}
            </p>
            <button type="button" className="detail-more" onClick={() => setDescOpen(o => !o)}>
              {descOpen ? 'Show less' : 'Read more'}
            </button>

            {/* The care tiles describe the grade that is open, so bag size and
                age change with it instead of contradicting the panel above. */}
            <dl className="detail-points">
              <div><dt><IconSun size={18} /> Light</dt><dd>{plant.light}</dd></div>
              <div><dt><IconDrop size={18} /> Water</dt><dd>{plant.water}</dd></div>
              {selected && selected.size && (
                <div><dt><IconRuler size={18} /> Supplied at</dt><dd>{selected.size}</dd></div>
              )}
              {selected && selected.bag && (
                <div><dt><IconLeaf size={18} /> Bag size</dt><dd>{selected.bag}</dd></div>
              )}
              {selected && selected.age && (
                <div><dt><IconClock size={18} /> Age</dt><dd>{selected.age}</dd></div>
              )}
              <div><dt><IconSoil size={18} /> Soil</dt><dd>{plant.soil}</dd></div>
              {plant.seedSource && (
                <div><dt><IconLeaf size={18} /> Seed source</dt><dd>{plant.seedSource}</dd></div>
              )}
              {plant.motherTree && (
                <div><dt><IconClock size={18} /> Mother tree</dt><dd>{plant.motherTree}</dd></div>
              )}
              <div><dt><IconLeaf size={18} /> Type</dt><dd>{plant.category}</dd></div>
            </dl>

            {/* Single-size plants have nothing to choose, so they keep the
                straightforward quantity-and-buy row rather than being given a
                picker with one option in it. */}
            {!multi && selected && (
              <>
                <div className="qty-row">
                  <span id="qty-label">Quantity</span>
                  <div className="qty-stepper large">
                    <button type="button" onClick={() => setQtyOf(selected.key, qtyOf(selected.key) - 1)} aria-label="Decrease quantity">
                      <IconMinus size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={qtyOf(selected.key)}
                      onChange={e => setQtyOf(selected.key, Number(e.target.value))}
                      aria-labelledby="qty-label"
                    />
                    <button type="button" onClick={() => setQtyOf(selected.key, qtyOf(selected.key) + 1)} aria-label="Increase quantity">
                      <IconPlus size={14} />
                    </button>
                  </div>
                  <span className="qty-hint">Bulk pricing from 100+</span>
                </div>

                {selected.price != null && qtyOf(selected.key) > 1 && (
                  <p className="detail-subtotal">
                    {qtyOf(selected.key)} × {rupees(selected.price)} ={' '}
                    <strong>{rupees(selected.price * qtyOf(selected.key))}</strong>
                  </p>
                )}

                <div className="detail-actions">
                  <button type="button" className="btn primary" onClick={() => addItem(plant, qtyOf(selected.key), selected)}>
                    Add to enquiry
                  </button>
                  <a className="btn ghost" href={waFor(selected, qtyOf(selected.key))} target="_blank" rel="noreferrer">
                    <IconWhatsapp size={16} /> Ask on WhatsApp
                  </a>
                </div>
              </>
            )}

            <p className="detail-note">
              Availability changes with the season. Rates are from the {PRICE_LIST.season} list and
              depend on size and quantity — we will confirm before anything is committed.
            </p>
            <Link className="text-link" to="/contact">Request a written quote<span aria-hidden="true"> →</span></Link>
          </Reveal>
        </div>

        {/* ── SIZE PICKER ─────────────────────────────────────────────
            The heart of the page, and the reason it sits full width below the
            photo rather than squeezed into the right-hand column: eight grades
            in a half-width stack pushed the buy button below the fold and made
            "how much more is the 6 ft?" a scroll instead of a glance.
            One panel underneath belongs to whichever size is selected, and
            carries its own quantity and its own WhatsApp button, so the
            message that reaches the nursery already names the exact grade,
            bag weight, quantity and rate. */}
        {multi && selected && (
          <section className="size-picker" id="sizes" aria-labelledby="sizes-heading">
            <header className="size-picker-head">
              <div>
                <span className="eyebrow">Choose your size</span>
                <h2 id="sizes-heading">{variants.length} sizes available</h2>
              </div>
              <span className="size-picker-range">{priceRangeLabel(plant)}</span>
            </header>

            <div className="size-rail-wrap">
              <ul className="size-rail" role="radiogroup" aria-label={`Choose a size of ${plant.name}`}>
                {variants.map(v => {
                  const active = v.key === selected.key;
                  const save = v.mrp && v.price != null
                    ? Math.round(((v.mrp - v.price) / v.mrp) * 100)
                    : null;
                  return (
                    <li key={v.key}>
                      <button
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={active ? 'size-tile is-active' : 'size-tile'}
                        onClick={() => setOpenKey(v.key)}
                      >
                        {/* Each grade drawn to scale against the tallest one
                            we sell, so the jump from 1 ft to 7–8 ft reads at
                            a glance instead of having to be worked out. */}
                        <span
                          className="size-gauge"
                          aria-hidden="true"
                          style={{ '--fill': `${Math.max(14, (sizeFeet(v.size) / tallest) * 100)}%` }}
                        >
                          <i />
                        </span>
                        <strong className="size-tile-name">{v.label || v.size}</strong>
                        <small className="size-tile-meta">
                          {[v.label ? v.size : null, v.age, v.bag].filter(Boolean).join(' · ')}
                        </small>
                        <span className="size-tile-rate">
                          {v.price == null
                            ? <strong className="on-request">On request</strong>
                            : <strong>{rupees(v.price)}</strong>}
                          {v.mrp && <s>{rupees(v.mrp)}</s>}
                        </span>
                        {save ? <em className="size-save">{save}% off</em> : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* One panel, belonging to whichever tile is selected. */}
            <div className="size-panel">
              <p className="size-panel-title">
                <span>Selected</span>
                <strong>{variantText(selected)}{selected.bag ? ` · ${selected.bag}` : ''}</strong>
              </p>

              <dl className="size-specs">
                <div><dt>Height</dt><dd>{selected.size || '—'}</dd></div>
                {selected.age && <div><dt>Age</dt><dd>{selected.age}</dd></div>}
                {selected.bag && <div><dt>Bag weight</dt><dd>{selected.bag}</dd></div>}
                <div>
                  <dt>Rate</dt>
                  <dd>{selected.price == null ? 'On request' : `${rupees(selected.price)} each`}</dd>
                </div>
                {selected.note && <div><dt>Grade</dt><dd>{selected.note}</dd></div>}
              </dl>

              <div className="size-order">
                <div className="qty-stepper large">
                  <button
                    type="button"
                    onClick={() => setQtyOf(selected.key, qtyOf(selected.key) - 1)}
                    aria-label={`Decrease quantity of ${variantText(selected)}`}
                  >
                    <IconMinus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={qtyOf(selected.key)}
                    onChange={e => setQtyOf(selected.key, Number(e.target.value))}
                    aria-label={`Quantity of ${plant.name} ${variantText(selected)}`}
                  />
                  <button
                    type="button"
                    onClick={() => setQtyOf(selected.key, qtyOf(selected.key) + 1)}
                    aria-label={`Increase quantity of ${variantText(selected)}`}
                  >
                    <IconPlus size={14} />
                  </button>
                </div>

                {selected.price != null && (
                  <p className="size-total">
                    {qtyOf(selected.key)} × {rupees(selected.price)}
                    <strong>{rupees(selected.price * qtyOf(selected.key))}</strong>
                  </p>
                )}
              </div>

              <div className="size-actions">
                <a
                  className="btn primary"
                  href={waFor(selected, qtyOf(selected.key))}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconWhatsapp size={16} /> Enquire this size
                </a>
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => addItem(plant, qtyOf(selected.key), selected)}
                >
                  Add to list
                </button>
              </div>

              <p className="size-panel-hint">
                The WhatsApp message is filled in for you — {selected.size}
                {selected.bag ? `, ${selected.bag}` : ''}, quantity {qtyOf(selected.key)}. Add
                several sizes to the list instead if you want to send them all in one message.
              </p>
            </div>

            <p className="size-fineprint">{PRICE_LIST.note}</p>
          </section>
        )}
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
