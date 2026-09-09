import React from 'react';

// Icons previously dropped every prop except `size` and `className`, so
// aria-hidden, titles and event handlers passed to them silently vanished.
// They are now proper forwarding components, decorative by default.
const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

function Svg({ size = 18, viewBox = '0 0 24 24', filled, children, ...rest }) {
  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      {...(filled ? { fill: 'currentColor' } : stroke)}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const IconSun = p => <Svg {...p}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></Svg>;
export const IconRuler = p => <Svg {...p}><path d="M4 15.5 15.5 4l4.5 4.5L8.5 20 4 15.5Z" /><path d="M11 8l2 2M8 11l2 2M14 5l2 2" /></Svg>;
export const IconLeaf = p => <Svg {...p}><path d="M5 19c8-.5 13-5.5 14-14C10 6 5 11 5 19Z" /><path d="M5 19c3-4 6-6.5 10.5-10" /></Svg>;
export const IconPin = p => <Svg {...p}><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.3" /></Svg>;
export const IconPhone = p => <Svg {...p}><path d="M6.5 3.5h3L11 8l-2 1.4a12 12 0 0 0 5.6 5.6L16 13l4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" /></Svg>;
export const IconMail = p => <Svg {...p}><rect x="3.5" y="5.5" width="17" height="13" rx="2" /><path d="m4.5 7 7.5 6 7.5-6" /></Svg>;
export const IconClock = p => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></Svg>;
export const IconDrop = p => <Svg {...p}><path d="M12 3.5c3.2 3.6 5.5 6.4 5.5 9.2a5.5 5.5 0 0 1-11 0c0-2.8 2.3-5.6 5.5-9.2Z" /></Svg>;
export const IconSoil = p => <Svg {...p}><path d="M3.5 15.5h17M5.5 19h13" /><path d="M12 12.5c0-3 1.8-5 4.5-5.5-.2 3-2 5-4.5 5.5Z" /><path d="M12 12.5C12 9.8 10.3 8 7.8 7.5c.2 2.8 1.8 4.6 4.2 5Z" /></Svg>;
export const IconStar = p => <Svg viewBox="0 0 24 24" size={p.size || 16} className={p.className} filled strokeWidth={1.2}><path d="M12 3.5l2.6 5.4 5.9.7-4.3 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9-4.3-4.1 5.9-.7L12 3.5Z" /></Svg>;
export const IconWhatsapp = p => <Svg {...p} filled><path d="M12 2.4a9.6 9.6 0 0 0-8.2 14.6L2.4 21.6l4.8-1.3A9.6 9.6 0 1 0 12 2.4Zm0 1.8a7.8 7.8 0 0 1 6.6 12 7.75 7.75 0 0 1-9.9 3l-.4-.2-2.8.7.75-2.7-.2-.4A7.8 7.8 0 0 1 12 4.2Zm-2.9 4.1c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.2.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.6.5 0 1.6-.6 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.4-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5-.1-.1-.6-1.6-.9-2.1-.2-.5-.4-.5-.6-.5Z" /></Svg>;
export const IconBasket = p => <Svg {...p}><path d="M4.5 9h15l-1.4 9.4a2 2 0 0 1-2 1.6H7.9a2 2 0 0 1-2-1.6L4.5 9Z" /><path d="M8 9V7a4 4 0 0 1 8 0v2" /><path d="M9.5 12.5v4M14.5 12.5v4" /></Svg>;
export const IconClose = p => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
export const IconChevronLeft = p => <Svg {...p}><path d="M14.5 5.5 8 12l6.5 6.5" /></Svg>;
export const IconChevronRight = p => <Svg {...p}><path d="M9.5 5.5 16 12l-6.5 6.5" /></Svg>;
export const IconSearch = p => <Svg {...p}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m19.5 19.5-4.3-4.3" /></Svg>;
export const IconMenu = p => <Svg size={22} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Svg>;
export const IconPlus = p => <Svg size={16} {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const IconMinus = p => <Svg size={16} {...p}><path d="M5 12h14" /></Svg>;
export const IconCheck = p => <Svg size={16} {...p}><path d="m5 12.5 4.5 4.5L19 7" /></Svg>;
export const IconArrowRight = p => <Svg size={16} {...p}><path d="M4.5 12h15M13.5 5.5 20 12l-6.5 6.5" /></Svg>;
export const IconQuote = p => <Svg viewBox="0 0 32 24" size={p.size || 28} className={p.className} filled><path d="M0 24V14.6C0 6 5 .9 13.6 0l1 4C9 5.4 6.6 8.4 6.3 12.6H14V24H0Zm18 0V14.6C18 6 23 .9 31.6 0l1 4C27 5.4 24.6 8.4 24.3 12.6H32V24H18Z" /></Svg>;
export const IconDesign = p => <Svg size={22} {...p}><path d="M4 20 14 4l6 6L10 20H4v-6Z" /><path d="M12.5 7.5 16.5 11.5" /></Svg>;
export const IconPlan = p => <Svg size={22} {...p}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M4 10h16M10 20V10" /></Svg>;
export const IconWall = p => <Svg size={22} {...p}><rect x="4" y="4" width="7" height="7" rx="1.3" /><rect x="13" y="4" width="7" height="7" rx="1.3" /><rect x="4" y="13" width="7" height="7" rx="1.3" /><rect x="13" y="13" width="7" height="7" rx="1.3" /></Svg>;

export const serviceIcons = { design: IconDesign, plan: IconPlan, wall: IconWall };
