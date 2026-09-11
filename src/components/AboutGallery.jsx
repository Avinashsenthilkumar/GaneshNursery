import React, { useCallback, useEffect, useRef, useState } from 'react';
import SmartImage from './SmartImage.jsx';
import { IconChevronLeft, IconChevronRight } from './Icons.jsx';

// Photo strip from the nursery and from customer sites abroad.
//
// Built on native scroll-snap rather than a carousel library: it swipes with a
// finger on a phone, drags with a trackpad, works with the keyboard, and adds
// nothing to the bundle. The arrows just scroll the same container, so there
// is only one source of truth for position.
const photos = [
  { src: '/gallery/child-saplings.jpg', alt: 'A child beside a tray of nursery saplings' },
  { src: '/gallery/macadamia-handover.jpg', alt: 'Handing over a grafted macadamia sapling to a grower' },
  { src: '/gallery/team-africa.jpg', alt: 'The Ganesh Nursery team with partners on site' },
  { src: '/gallery/field-visit.jpg', alt: 'Visiting a crop field with local growers' },
  { src: '/gallery/processing-unit.jpg', alt: 'Inside a macadamia processing unit' },
  { src: '/gallery/coconut-handover.jpg', alt: 'Presenting a coconut seedling at a nursery' }
];

export default function AboutGallery() {
  const railRef = useRef(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const slide = rail.firstElementChild;
    if (!slide) return;
    const step = slide.getBoundingClientRect().width + 14;
    setActive(Math.round(rail.scrollLeft / step));
    setAtStart(rail.scrollLeft <= 4);
    setAtEnd(rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    sync();
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      rail.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const scrollBy = dir => {
    const rail = railRef.current;
    const slide = rail?.firstElementChild;
    if (!rail || !slide) return;
    rail.scrollBy({ left: dir * (slide.getBoundingClientRect().width + 14), behavior: 'smooth' });
  };

  const goTo = i => {
    const rail = railRef.current;
    const slide = rail?.firstElementChild;
    if (!rail || !slide) return;
    rail.scrollTo({ left: i * (slide.getBoundingClientRect().width + 14), behavior: 'smooth' });
  };

  return (
    <section className="gallery-section" aria-labelledby="gallery-heading">
      <div className="container gallery-head">
        <div>
          <span className="eyebrow">From the nursery</span>
          <h2 id="gallery-heading">Our work, our people</h2>
        </div>
        <div className="gallery-arrows">
          <button type="button" onClick={() => scrollBy(-1)} disabled={atStart} aria-label="Previous photos">
            <IconChevronLeft size={20} />
          </button>
          <button type="button" onClick={() => scrollBy(1)} disabled={atEnd} aria-label="Next photos">
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className="gallery-rail"
        ref={railRef}
        tabIndex={0}
        role="group"
        aria-label="Photo gallery — scroll or use the arrow keys"
      >
        {photos.map(photo => (
          <figure className="gallery-item" key={photo.src}>
            <SmartImage src={photo.src} alt={photo.alt} ratio="4 / 5" />
          </figure>
        ))}
      </div>

      <div className="gallery-dots" role="tablist" aria-label="Gallery position">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to photo ${i + 1}`}
            className={i === active ? 'gallery-dot active' : 'gallery-dot'}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
