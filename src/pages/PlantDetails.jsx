import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { plants, findPlant, WA_NUMBER } from '../data/plants.js';
import PlantCard from '../components/PlantCard.jsx';
import Lightbox from '../components/Lightbox.jsx';
import NotFound from './NotFound.jsx';
import Reveal from '../components/Reveal.jsx';
import { IconSun, IconRuler, IconLeaf, IconMinus, IconPlus, IconWhatsapp, IconChevronLeft } from '../components/Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function PlantDetails() {
  const { id } = useParams();
  const plant = findPlant(id);
  const navigate = useNavigate();
  const { addItem } = useEnquiry();
  const [activeImg, setActiveImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [qty, setQty] = useState(1);

  if (!plant) return <NotFound />;

  const message = encodeURIComponent(`Hi Ganesh Nursery, I am interested in ${plant.name} (${plant.botanical}) × ${qty}. Please share availability, sizes and bulk price.`);

  return (
    <main>
      <section className="detail-page container">
        <button className="back-link" onClick={() => navigate(-1)}><IconChevronLeft size={15} /> Back to plants</button>
        <div className="detail-grid">
          <Reveal as="div" className="detail-gallery">
            <button type="button" className="detail-image" onClick={() => setLightboxOpen(true)} aria-label="Open photo gallery">
              <img src={plant.images[activeImg]} alt={plant.name} />
            </button>
            <div className="detail-thumbs">
              {plant.images.map((src, i) => (
                <button key={src + i} type="button" className={i === activeImg ? 'thumb active' : 'thumb'} onClick={() => setActiveImg(i)} aria-label={`View photo ${i + 1}`}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal as="div" delay={100} className="detail-copy">
            <span className="eyebrow">{plant.category}</span>
            <h1>{plant.name}</h1>
            <p className="botanical big">{plant.botanical}</p>
            <p className="detail-price">₹{plant.price} <span>starting price</span></p>
            <p>Healthy nursery-grown planting material available in multiple sizes. Availability can change seasonally; contact the team for current stock and quantity pricing.</p>
            <div className="detail-points">
              <div><IconSun size={19} /><b>Light</b><small>{plant.light}</small></div>
              <div><IconRuler size={19} /><b>Typical size</b><small>{plant.size}</small></div>
              <div><IconLeaf size={19} /><b>Use</b><small>{plant.category}</small></div>
            </div>
            <div className="qty-row">
              <span>Quantity</span>
              <div className="qty-stepper large">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease quantity"><IconMinus size={14} /></button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty(q => q + 1)} aria-label="Increase quantity"><IconPlus size={14} /></button>
              </div>
            </div>
            <div className="hero-actions">
              <button type="button" className="btn primary" onClick={() => addItem(plant, qty)}>Add to enquiry</button>
              <a className="btn ghost" href={`https://wa.me/${WA_NUMBER}?text=${message}`} target="_blank" rel="noreferrer"><IconWhatsapp size={16} /> Enquire on WhatsApp</a>
            </div>
            <Link className="text-link detail-quote-link" to="/contact">Or request a written quote <span aria-hidden>→</span></Link>
          </Reveal>
        </div>
      </section>

      <section className="related-section"><div className="container">
        <div className="section-head"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More plants to explore</h2></div></div>
        <div className="plant-grid">{plants.filter(p => p.category === plant.category && p.id !== plant.id).slice(0, 4).map(p => <PlantCard key={p.id} plant={p} />)}</div>
      </div></section>

      {lightboxOpen && (
        <Lightbox images={plant.images} index={activeImg} name={plant.name} onClose={() => setLightboxOpen(false)} onNav={setActiveImg} />
      )}
    </main>
  );
}
