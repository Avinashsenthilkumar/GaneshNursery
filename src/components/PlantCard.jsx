import React from 'react';
import { Link } from 'react-router-dom';
import { IconSun, IconRuler, IconPlus, IconCheck } from './Icons.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';

export default function PlantCard({ plant }) {
  const { items, addItem } = useEnquiry();
  const inCart = items.some(i => i.id === plant.id);

  return (
    <article className="plant-card">
      <Link to={`/plants/${plant.id}`} className="plant-image">
        <img src={plant.image} alt={plant.name} loading="lazy" />
        <span className="plant-tag">{plant.category}</span>
        {plant.popular && <span className="plant-badge">Popular pick</span>}
        <button
          type="button"
          className={inCart ? 'plant-add is-added' : 'plant-add'}
          onClick={e => { e.preventDefault(); e.stopPropagation(); addItem(plant); }}
          aria-label={`Add ${plant.name} to enquiry`}
          title="Add to enquiry"
        >
          {inCart ? <IconCheck size={16} /> : <IconPlus size={16} />}
        </button>
      </Link>
      <div className="plant-body">
        <span className="botanical">{plant.botanical}</span>
        <h3>{plant.name}</h3>
        <div className="plant-meta"><span><IconSun size={13} />{plant.light}</span><span><IconRuler size={13} />{plant.size}</span></div>
        <div className="plant-footer">
          <div><small>Starting from</small><strong>₹{plant.price}</strong></div>
          <Link to={`/plants/${plant.id}`} className="small-btn">View</Link>
        </div>
      </div>
    </article>
  );
}
