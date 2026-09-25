import React from 'react';
import { Link } from 'react-router-dom';
import { IconRuler, IconArrowRight } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import { plantUrl } from '../data/plants.js';

export default function PlantCard({ plant }) {
  const href = plantUrl(plant);
  const multi = plant.sizeCount > 1;

  return (
    <article className="plant-card">
      <div className="plant-image">
        <Link to={href} className="plant-image-link" tabIndex={-1} aria-hidden="true">
          {/* "contain", not "cover": the product photos carry printed height
              arrows and bag weights, and cropping would cut that off. */}
          <SmartImage src={plant.image} alt="" ratio="1 / 1" fit="contain" />
        </Link>
        <span className="plant-tag">{plant.category}</span>
        {plant.popular && <span className="plant-badge">Popular</span>}
        {/* Quick-add is gone from the card. With most species sold at several
            heights and prices, adding "a Khaya" without saying which of the
            eight sizes is meaningless to whoever picks the order. The card
            now sends you to the size table instead. */}
        {multi && <span className="plant-sizes">{plant.sizeCount} sizes</span>}
      </div>

      <div className="plant-body">
        <h3><Link to={href}>{plant.name}</Link></h3>
        {plant.tamil && <span className="plant-tamil" lang="ta">{plant.tamil}</span>}
        <span className="botanical">{plant.botanical}</span>

        <div className="plant-meta">
          <span><IconRuler size={13} />{plant.size}</span>
          {plant.bag && <span>{plant.bag} bag</span>}
        </div>

        <div className="plant-footer">
          <div className="plant-price">
            <small>{multi ? 'From' : 'Price'}</small>
            <span className="price-row">
              <strong>₹{plant.price.toLocaleString('en-IN')}</strong>
              {plant.mrp && <s aria-label={`Usual price ${plant.mrp} rupees`}>₹{plant.mrp}</s>}
            </span>
          </div>
          <Link to={href} className="small-btn">
            {multi ? 'Sizes' : 'Details'} <IconArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
