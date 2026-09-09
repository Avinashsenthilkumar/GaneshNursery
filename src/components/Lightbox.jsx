import React, { useCallback, useEffect, useRef } from 'react';
import { IconClose, IconChevronLeft, IconChevronRight } from './Icons.jsx';

export default function Lightbox({ images, index, name, onClose, onNav }) {
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const go = useCallback(dir => {
    onNav((index + dir + images.length) % images.length);
  }, [index, images.length, onNav]);

  useEffect(() => {
    lastFocused.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      // Focus previously fell back to the top of the document on close.
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    };
  }, [go, onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${name} photo gallery`} onClick={onClose}>
      <button type="button" ref={closeRef} className="lightbox-close" onClick={onClose} aria-label="Close gallery">
        <IconClose size={20} />
      </button>
      <div className="lightbox-stage" onClick={e => e.stopPropagation()}>
        {images.length > 1 && (
          <button type="button" className="lightbox-nav prev" onClick={() => go(-1)} aria-label="Previous photo">
            <IconChevronLeft size={22} />
          </button>
        )}
        <img src={images[index]} alt={`${name} — photo ${index + 1} of ${images.length}`} />
        {images.length > 1 && (
          <button type="button" className="lightbox-nav next" onClick={() => go(1)} aria-label="Next photo">
            <IconChevronRight size={22} />
          </button>
        )}
      </div>
      {images.length > 1 && (
        <div className="lightbox-thumbs" onClick={e => e.stopPropagation()}>
          {images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className={i === index ? 'thumb active' : 'thumb'}
              onClick={() => onNav(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
