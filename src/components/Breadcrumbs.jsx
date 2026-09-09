import React from 'react';
import { Link } from 'react-router-dom';

// New. Breadcrumbs help orientation on deep pages and give Google a clean
// hierarchy signal — the old site had no way back up from a plant detail page
// except the browser's back button.
export default function Breadcrumbs({ trail }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((step, i) => (
          <li key={step.label}>
            {step.to && i < trail.length - 1
              ? <Link to={step.to}>{step.label}</Link>
              : <span aria-current="page">{step.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
