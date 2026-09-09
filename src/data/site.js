// ============================================================================
// SINGLE SOURCE OF TRUTH for every business detail on the site.
//
// The old build hard-coded contact details in three different files and they
// did not agree with each other. Everything now reads from here, so a change
// made once is correct everywhere (header, footer, contact page, WhatsApp
// links, schema.org markup, sitemap).
//
// ACTION REQUIRED — the old code contained two different phone numbers:
//        WhatsApp link used  +91 99431 99955
//        Contact page showed +91 99431 19955
//     They cannot both be right. Confirm the correct one and set it below.
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
  phoneDisplay: '+91 99431 99955',   // CONFIRM
  phoneE164: '+919943199955',        // CONFIRM — used by tel: links
  whatsapp: '919943199955',          // CONFIRM — used by wa.me links
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
