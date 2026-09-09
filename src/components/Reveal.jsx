import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades and lifts children into view on scroll.
 *
 * Two robustness fixes over the previous version:
 *  1. A safety timeout forces content visible after 1.2s. Previously `.reveal`
 *     started at opacity:0, so if IntersectionObserver ever failed to fire —
 *     an element already past the viewport on load, an unsupported browser, a
 *     mid-scroll route change — that content stayed permanently invisible.
 *  2. Reduced-motion and no-IntersectionObserver cases render visible at once.
 */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    io.observe(el);
    const failsafe = window.setTimeout(() => setVisible(true), 1200);

    return () => { io.disconnect(); window.clearTimeout(failsafe); };
  }, []);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag ref={ref} className={`reveal${visible ? ' in-view' : ''}${className ? ` ${className}` : ''}`} style={style} {...rest}>
      {children}
    </Tag>
  );
}
