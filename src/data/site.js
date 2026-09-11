// ============================================================================
// SINGLE SOURCE OF TRUTH for every business detail on the site.
//
// The old build hard-coded contact details in three different files and they
// did not agree with each other. Everything now reads from here, so a change
// made once is correct everywhere (header, footer, contact page, WhatsApp
// links, schema.org markup, sitemap).
//
// RESOLVED — the old code had two conflicting phone numbers. The live site
//     confirms 9943119955 is correct; the WhatsApp links were wrong.
// ACTION REQUIRED — it also had two different addresses (Gandarvakottai
//     613301 on About, Natchathira Nagar Thanjavur 613007 on Contact). Google
//     penalises inconsistent name/address/phone data, so pick the real one.
// ============================================================================

export const site = {
  name: 'Ganesh Nursery',
  legalName: 'Ganesh Nursery',
  tagline: 'Greenery for Every Home',
  foundedYear: 1980,
  url: 'https://ganeshnursery.co.in',

  // --- Contact -------------------------------------------------------------
  // RESOLVED: the live WordPress site shows 9943119955, which matches what the
  // old contact page said. The number in the previous build's WhatsApp links
  // was a typo, so every WhatsApp click was going to a wrong number.
  phoneDisplay: '+91 99431 19955',
  phoneE164: '+919943119955',        // used by tel: links
  whatsapp: '919943119955',          // used by wa.me links

  // Second line, as listed on the live site.
  phoneAltDisplay: '+91 86808 88018',
  phoneAltE164: '+918680888018',
  email: 'care@ganeshnursery.co.in', // was @ganeshnursery.com (wrong TLD)

  // --- Address (one canonical address, used everywhere + in schema) --------
  address: {
    line1: 'First Block, Veilailaividu',
    line2: 'Gandarvakottai Taluk',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    postalCode: '613301',
    country: 'IN'
  },
  // Replace with the exact lat/long from your Google Business Profile.
  geo: { lat: 10.4413, lng: 79.0261 },
  mapsQuery: 'Ganesh Nursery Gandarvakottai Thanjavur Tamil Nadu',

  openingHours: 'Mon–Sat, 9:00 am – 6:00 pm',

  // --- Search terms we want to be found for -------------------------------
  // These drive page titles, descriptions and the FAQ block on the homepage.
  // Keep the list short and honest: pages that promise a term and then don't
  // deliver content about it get demoted, not promoted.
  keywords: [
    'best nursery in Thanjavur',
    'nursery in Thanjavur',
    'affordable plants in Thanjavur',
    'macadamia nuts in Thanjavur',
    'timber nursery Tamil Nadu',
    'teak saplings Thanjavur'
  ],

  // --- Social (empty value = icon hidden, not linked to a dead "#") --------
  social: {
    facebook: '',
    instagram: '',
    youtube: ''
  },

  // --- Lead capture --------------------------------------------------------
  contactEndpoint: import.meta.env?.VITE_CONTACT_ENDPOINT || ''
};

export const fullAddress = [
  site.address.line1,
  site.address.line2,
  `${site.address.city}, ${site.address.state} ${site.address.postalCode}`
].filter(Boolean);

export const yearsInBusiness = new Date().getFullYear() - site.foundedYear;

export const waLink = (text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const mapsLink =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapsQuery)}`;
