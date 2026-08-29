import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="not-found">
      <div>
        <span className="eyebrow">404</span>
        <h1>That page went out to grow.</h1>
        <p>The page you tried to visit does not exist.</p>
        <Link className="btn primary" to="/">Return home</Link>
      </div>
    </main>
  );
}
