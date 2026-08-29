import React, { useEffect, useRef, useState } from 'react';

/**
 * Wraps children and adds an `in-view` class once the element scrolls into
 * the viewport, powering the CSS fade/rise transitions in styles.css.
 * Respects prefers-reduced-motion by rendering as already visible.
 */
export default function Reveal({ children, as: Tag = 'div', delay = 0, className = '', stagger }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;
  return (
    <Tag ref={ref} className={`reveal ${visible ? 'in-view' : ''} ${className}`} style={style} data-stagger={stagger}>
      {children}
    </Tag>
  );
}
