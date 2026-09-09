import React from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo.jsx';

export default function NotFound() {
  return (
    <main className="not-found">
      <Seo title="Page not found" description="That page does not exist." noindex />
      <div>
        <span className="eyebrow">404</span>
        <h1>That page went out to grow.</h1>
        <p>The page you tried to visit does not exist — it may have moved, or the link may be old.</p>
        <div className="hero-actions">
          <Link className="btn primary" to="/">Return home</Link>
          <Link className="btn ghost" to="/plants">Browse plants</Link>
        </div>
      </div>
    </main>
  );
}
