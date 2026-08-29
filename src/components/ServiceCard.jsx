import React from 'react';
import { Link } from 'react-router-dom';
import { serviceIcons } from './Icons.jsx';

export default function ServiceCard({ service, large = false }) {
  const Icon = serviceIcons[service.icon];
  return (
    <article className={large ? 'service-card large' : 'service-card'}>
      <div className="service-image"><img src={service.image} alt={service.title} loading="lazy" />{Icon && <span className="service-icon"><Icon size={20} /></span>}</div>
      <div className="service-body">
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        <Link className="small-btn" to="/contact">Learn more</Link>
      </div>
    </article>
  );
}
