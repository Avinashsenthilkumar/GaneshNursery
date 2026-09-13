import React from 'react';
import { Link } from 'react-router-dom';
import { IconRuler, IconPlus, IconCheck } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';
import { useEnquiry } from '../context/EnquiryContext.jsx';
import { plantUrl, priceLabel } from '../data/plants.js';

export default function PlantCard({ plant }) {
  const { items, addItem } = useEnquiry();
  const inList = items.some(i => i.id === plant.id);
  const href = plantUrl(plant);
  const sizeCount = plant.variants.length;
  const multi = sizeCount > 1;

  return (
    <article className="plant-card">
      {/*
        The add button sits as a sibling of the link, not inside it. Nesting a
        <button> in an <a> is invalid HTML and made screen readers announce the
        two as one control.
      */}
      <div className="plant-image">
        <Link to={href} className="plant-image-link" tabIndex={-1} aria-hidden="true">
          {/* "contain", not "cover": these photos carry height arrows and bag
              sizes printed on them, and cropping would cut that information off. */}
          <SmartImage src={plant.image} alt="" ratio="1 / 1" fit="contain" />
        </Link>
        <span className="plant-tag">{plant.category}</span>
        {plant.popular && <span className="plant-badge">Popular</span>}

        {/*
          A plant sold in eight grades from ₹75 to ₹585 has no single "add this"
          — quietly adding the cheapest would put the wrong rate in the customer's
          list and the wrong expectation in their head. Multi-size plants send you
          to the size table instead; single-size plants still add in one tap.
        */}
        {multi ? (
          <Link to={`${href}#sizes`} className="plant-add is-choose" title="Choose a size" aria-label={`Choose a size for ${plant.name}`}>
            <IconPlus size={16} />
          </Link>
        ) : (
          <button
            type="button"
            className={inList ? 'plant-add is-added' : 'plant-add'}
            onClick={() => addItem(plant)}
            aria-label={inList ? `${plant.name} is in your enquiry — add another` : `Add ${plant.name} to your enquiry`}
            title={inList ? 'Add another' : 'Add to enquiry'}
          >
            {inList ? <IconCheck size={16} /> : <IconPlus size={16} />}
          </button>
        )}
      </div>

      <div className="plant-body">
        <h3><Link to={href}>{plant.name}</Link></h3>
        {plant.tamil && <span className="plant-tamil" lang="ta">{plant.tamil}</span>}
        <span className="botanical">{plant.botanical}</span>

        <div className="plant-meta">
          <span><IconRuler size={13} />{plant.size}</span>
          {/* Bag and age are only printed when every grade shares them —
              otherwise the card would advertise one variant's bag as the plant's. */}
          {plant.bag && <span>{plant.bag}</span>}
          {plant.age && <span>{plant.age}</span>}
          {multi && <span className="plant-sizes">{sizeCount} sizes</span>}
        </div>

        <div className="plant-footer">
          <div className="plant-price">
            {plant.price == null ? (
              <strong className="on-request">Price on request</strong>
            ) : (
              <>
                <small>{plant.hasPriceRange ? `From · up to ₹${plant.priceTo.toLocaleString('en-IN')}` : 'Price'}</small>
                <span className="price-row">
                  <strong>{priceLabel(plant)}</strong>
                  {plant.mrp && plant.mrp > plant.price && (
                    <s aria-label={`Usual price ${plant.mrp} rupees`}>₹{plant.mrp}</s>
                  )}
                </span>
              </>
            )}
          </div>
          <Link to={href} className="small-btn">{multi ? 'Sizes' : 'Details'}</Link>
        </div>
      </div>
    </article>
  );
}
