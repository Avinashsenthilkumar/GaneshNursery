import React, { useState } from 'react';
import { cdn, cdnSrcSet } from '../lib/cloudinary.js';

// Every product photo on the old site was hot-linked from a third-party CDN
// with no width/height and no error handling. Two consequences: the page
// jumped around while images loaded (poor Core Web Vitals, feels cheap), and a
// single failed request left a broken-image icon inside a finished card.
// This reserves the space up front, fades the photo in, and falls back to a
// branded leaf panel instead of a broken icon.

// A phone showing cards two-up needs about 180 CSS pixels of image. Serving it
// the 1400px original wastes roughly 4x the bytes on a mobile connection for no
// visible gain, so every photo here offers the browser a choice of widths and
// lets it pick. Two sources of photo, two ways of getting there:
//
//   Cloudinary  five widths generated on demand from the one upload, plus
//               f_auto so a modern phone gets AVIF instead of JPEG. Nothing
//               was pre-generated; the URL itself asks for the size.
//   /public     the two widths built at deploy time (600px and full).
//
// Either way the caller passes a plain src and never has to think about it.
function buildSrcSet(src) {
  const cdnSet = cdnSrcSet(src);
  if (cdnSet) return cdnSet;
  if (!src || !/^\/(plants|gallery)\//.test(src) || src.includes('-sm')) return undefined;
  const small = src.replace(/\.jpe?g$/i, '-sm.jpg');
  return `${small} 600w, ${src} 1400w`;
}

export default function SmartImage({
  src,
  alt = '',
  ratio,
  fit,
  className = '',
  loading = 'lazy',
  fetchPriority,
  sizes = '(max-width: 760px) 50vw, (max-width: 1180px) 33vw, 380px',
  ...rest
}) {
  const [state, setState] = useState(src ? 'loading' : 'error');
  // The load state has to reset when the src changes, or a component that
  // stays mounted keeps the old result. On the product page the gallery swaps
  // src every time a size or thumbnail is picked, so without this a single
  // failed image left the fallback panel showing for every photo after it.
  const [seenSrc, setSeenSrc] = useState(src);
  if (src !== seenSrc) {
    setSeenSrc(src);
    setState(src ? 'loading' : 'error');
  }

  const srcSet = buildSrcSet(src);
  // The `src` is the fallback for a browser that ignores srcset, and the base
  // any relative width in `sizes` resolves against. Passing it through the CDN
  // caps it at a sane width and picks up f_auto/q_auto; a /public path or a
  // data URL comes back unchanged.
  const displaySrc = cdn(src, 1400);

  return (
    <span
      className={`smart-img ${state}${fit === 'contain' ? ' is-contain' : ''} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {state !== 'error' && src && (
        <img
          src={displaySrc}
          srcSet={srcSet}
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
