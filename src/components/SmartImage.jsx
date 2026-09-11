import React, { useState } from 'react';

// Every product photo on the old site was hot-linked from a third-party CDN
// with no width/height and no error handling. Two consequences: the page
// jumped around while images loaded (poor Core Web Vitals, feels cheap), and a
// single failed request left a broken-image icon inside a finished card.
// This reserves the space up front, fades the photo in, and falls back to a
// branded leaf panel instead of a broken icon.

export default function SmartImage({
  src,
  alt = '',
  ratio,
  fit,
  className = '',
  loading = 'lazy',
  fetchPriority,
  sizes,
  ...rest
}) {
  const [state, setState] = useState('loading');

  return (
    <span
      className={`smart-img ${state}${fit === 'contain' ? ' is-contain' : ''} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {state !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          fetchpriority={fetchPriority}
          sizes={sizes}
          onLoad={() => setState('loaded')}
          onError={() => setState('error')}
          {...rest}
        />
      )}
      {state === 'error' && (
        <span className="smart-img-fallback" role="img" aria-label={alt || 'Photograph unavailable'}>
          <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 19c8-.5 13-5.5 14-14C10 6 5 11 5 19Z" />
            <path d="M5 19c3-4 6-6.5 10.5-10" />
          </svg>
        </span>
      )}
    </span>
  );
}
