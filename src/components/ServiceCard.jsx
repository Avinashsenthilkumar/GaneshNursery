import React from 'react';
import { Link } from 'react-router-dom';
import { serviceIcons } from './Icons.jsx';
import SmartImage from './SmartImage.jsx';

export default function ServiceCard({ service, large = false }) {
  const Icon = serviceIcons[service.icon];
  return (
    <article className={large ? 'service-card large' : 'service-card'}>
      <div className="service-image">
        <SmartImage src={service.image} alt="" ratio="16 / 10" />
        {Icon && <span className="service-icon"><Icon size={20} /></span>}
      </div>
      <div className="service-body">
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        {large && service.points && (
          <ul className="service-points">
            {service.points.map(pt => <li key={pt}>{pt}</li>)}
          </ul>
        )}
        <Link className="small-btn" to="/contact">Enquire about this</Link>
      </div>
    </article>
  );
}
