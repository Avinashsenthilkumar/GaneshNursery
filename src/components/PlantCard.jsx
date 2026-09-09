import React from 'react';
import { Link } from 'react-router-dom';
import { IconSun, IconRuler, IconPlus, IconCheck } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { plantUrl } from '../data/plants.js';

export default function PlantCard({ plant }) {
  const { items, addItem } = useEnquiry();
  const inList = items.some(i => i.id === plant.id);
  const href = plantUrl(plant);

  return (
    <article className="plant-card">
      {/*
        The old markup nested a <button> inside the <Link>, which is invalid
        HTML (interactive content inside an anchor) and confused keyboard and
        screen-reader users — the add button was announced as part of the link.
        The button is now a sibling, positioned over the image.
      */}
      <div className="plant-image">
        <Link to={href} className="plant-image-link" tabIndex={-1} aria-hidden="true">
          <SmartImage src={plant.image} alt="" ratio="4 / 3" />
        </Link>
        <span className="plant-tag">{plant.category}</span>
        {plant.popular && <span className="plant-badge">Popular</span>}
        <button
          type="button"
          className={inList ? 'plant-add is-added' : 'plant-add'}
          onClick={() => addItem(plant)}
          aria-label={inList ? `${plant.name} is in your enquiry — add another` : `Add ${plant.name} to your enquiry`}
          title={inList ? 'Add another' : 'Add to enquiry'}
        >
          {inList ? <IconCheck size={16} /> : <IconPlus size={16} />}
        </button>
      </div>

      <div className="plant-body">
        <span className="botanical">{plant.botanical}</span>
        <h3><Link to={href}>{plant.name}</Link></h3>
        <div className="plant-meta">
          <span><IconSun size={13} />{plant.light}</span>
          <span><IconRuler size={13} />{plant.size}</span>
        </div>
        <div className="plant-footer">
          <div>
            <small>Starting from</small>
            <strong>₹{plant.price.toLocaleString('en-IN')}</strong>
          </div>
          <Link to={href} className="small-btn">Details</Link>
        </div>
      </div>
    </article>
  );
}
