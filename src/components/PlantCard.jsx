import React from 'react';
import { Link } from 'react-router-dom';
import { IconRuler, IconArrowRight } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import { plantUrl } from '../data/plants.js';

export default function PlantCard({ plant }) {
  const href = plantUrl(plant);
  const multi = plant.sizeCount > 1;
  const hasPrice = Number.isFinite(plant.price);
  const photoCount = plant.images?.length || 0;

  return (
    <article className="plant-card">
      <div className="plant-image">
        <Link to={href} className="plant-image-link" tabIndex={-1} aria-hidden="true">
          {/* "contain", not "cover": the product photos carry printed height
              arrows and bag weights, and cropping would cut that off. */}
          <SmartImage src={plant.images?.[0] || null} alt="" ratio="1 / 1" fit="contain" />
        </Link>
        <span className="plant-tag">{plant.category}</span>
        {plant.popular && <span className="plant-badge">Popular</span>}
        <div className="plant-flags">
          {multi && <span className="plant-sizes">{plant.sizeCount} sizes</span>}
          {photoCount > 1 && <span className="plant-photos">{photoCount} photos</span>}
        </div>
      </div>

      <div className="plant-body">
        <h3><Link to={href}>{plant.name}</Link></h3>
        {plant.tamil && <span className="plant-tamil" lang="ta">{plant.tamil}</span>}
        <span className="botanical">{plant.botanical}</span>

        <div className="plant-meta">
          <span><IconRuler size={13} />{plant.size || 'Grown to order'}</span>
          {plant.bag && <span>{plant.bag} bag</span>}
        </div>

        <div className="plant-footer">
          <div className="plant-price">
            {hasPrice ? (
              <>
                <small>{multi ? 'From' : 'Price'}</small>
                <span className="price-row">
                  <strong>₹{plant.price.toLocaleString('en-IN')}</strong>
                  {plant.mrp && <s aria-label={`Usual price ${plant.mrp} rupees`}>₹{plant.mrp}</s>}
                </span>
              </>
            ) : (
              // Magilam and anything else without a published price. Rendering
              // ₹0 or crashing on null would both be worse than saying so.
              <strong className="on-request">Price on request</strong>
            )}
          </div>
          <Link to={href} className="small-btn">
            {multi ? 'Sizes' : 'Details'} <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
