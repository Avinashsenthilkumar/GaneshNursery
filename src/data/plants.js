import { site } from './site.js';

export const WA_NUMBER = site.whatsapp;

// ============================================================================
// PLANT CATALOGUE — real Ganesh Nursery stock
//
// Replaces the Unsplash stock photos with your own product photography, and
// the invented prices with the ones from your live store.
//
// ─── PLEASE CHECK THESE BEFORE LAUNCH ──────────────────────────────────────
//
// 1. PRICES. Two entries on the live store look like data errors rather than
//    real prices: Karungali at ₹15 and Rosewood at ₹15. A two-year-old, 2–3 ft
//    Karungali in a 5 kg bag selling for ₹15 does not match the ₹150–₹325 you
//    charge for comparable stock. Confirm each `price` and `mrp` below.
//
// 2. DUPLICATE ROSEWOOD. The live store lists Rosewood twice with the same
//    name and the same photo but at ₹150 and ₹15. I have kept both and
//    distinguished them by bag size — correct or delete one.
//
// 3. MISSING PRICES. Sandalwood (3 ft sapling), Red Sandal and Khaya
//    Senegalensis show no price on the live store. I have marked them
//    `price: null`, which renders "Price on request" rather than a made-up
//    number. Add real figures when you have them.
//
// 4. TAMIL SPELLING. The live store writes guava as "காயா" and rosewood as
//    "சட்டி". The usual spellings are "கொய்யா" and "ஈட்டி", so I have used
//    those. Change them back if the store version is deliberate.
//
// 5. MACADAMIA has no photo yet — it falls back to a branded panel. Add
//    /public/plants/macadamia.jpg when you have one.
// ============================================================================

const rawPlants = [
  {
    id: 1, slug: 'koyya-l49',
    name: 'Koyya L49 (Guava)', tamil: 'கொய்யா எல்49',
    botanical: 'Psidium guajava', category: 'Fruit',
    price: 150, mrp: 239,
    age: '1.5 years', size: '3 ft', bag: '2 kg bag',
    light: 'Full sun', water: 'Moderate', soil: 'Tolerates a wide range',
    popular: true,
    description: 'Lucknow-49 guava, the standard commercial variety — heavy bearing, quick to fruit and forgiving of imperfect soil. Supplied at roughly 3 ft in a 2 kg bag at about 1.5 years old, so it establishes fast and starts returning a yield sooner than seedling stock.',
    image: '/plants/koyya-l49.jpg'
  },
  {
    id: 2, slug: 'karungali',
    name: 'Karungali (Ceylon Ebony)', tamil: 'கருங்காலி',
    botanical: 'Diospyros ebenum', category: 'Timber',
    price: 15, mrp: 30,     // CONFIRM — see note 1 above
    age: '2 years', size: '2–3 ft', bag: '5 kg bag',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    popular: true,
    description: 'Ceylon ebony, the true Karungali. Exceptionally dense, jet-black heartwood used for carving, instruments and ritual items. A slow, long-horizon tree — the density that makes it valuable is exactly what takes decades to build. Supplied at 2 years old, 2–3 ft, in a 5 kg bag.',
    image: '/plants/karungali.jpg'
  },
  {
    id: 3, slug: 'rosewood',
    name: 'Rosewood', tamil: 'ஈட்டி / ரோஸ்வுட்',
    botanical: 'Dalbergia latifolia', category: 'Timber',
    price: 150, mrp: 239,
    age: 'Seedling', size: '1–1.5 ft', bag: '5 kg bag',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'Indian rosewood — a premium furniture timber with dark, richly figured heartwood. A long rotation crop that intercrops well in the early years while the canopy is still open.',
    image: '/plants/rosewood.jpg'
  },
  {
    id: 4, slug: 'rosewood-small-bag',
    name: 'Rosewood (small bag)', tamil: 'ஈட்டி / ரோஸ்வுட்',
    botanical: 'Dalbergia latifolia', category: 'Timber',
    price: 15, mrp: 30,     // CONFIRM — duplicate listing, see note 2 above
    age: 'Seedling', size: '1–1.5 ft', bag: 'Small bag',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'The same Indian rosewood seedling supplied in a smaller bag — the economical option when you are planting in volume and can water reliably through the first season.',
    image: '/plants/rosewood.jpg'
  },
  {
    id: 5, slug: 'sandalwood',
    name: 'Sandalwood', tamil: 'சந்தன மரம்',
    botanical: 'Santalum album', category: 'Timber',
    price: 325, mrp: 499,
    age: '2 years', size: '3–4 ft', bag: '18 kg bag',
    light: 'Full sun', water: 'Low to moderate', soil: 'Well-drained, needs a host plant',
    popular: true,
    description: 'Two-year-old sandalwood at 3–4 ft in an 18 kg bag — our largest sandal grade, already well established. Sandalwood is a root parasite and needs a compatible host plant growing alongside it; talk to us about host selection before you plant, because this is where most sandal plantations go wrong.',
    image: '/plants/sandalwood.jpg'
  },
  {
    id: 6, slug: 'sandalwood-sapling',
    name: 'Sandalwood (3 ft sapling)', tamil: 'சந்தன மரம்',
    botanical: 'Santalum album', category: 'Timber',
    price: null, mrp: null,  // ADD PRICE — see note 3 above
    age: '2 years', size: '2–3 ft', bag: '18 kg bag',
    light: 'Full sun', water: 'Low to moderate', soil: 'Well-drained, needs a host plant',
    description: 'Sandalwood sapling at 2–3 ft in an 18 kg bag. Same stock and same host requirement as our larger grade, at a smaller starting height.',
    image: '/plants/sandalwood-sapling.jpg'
  },
  {
    id: 7, slug: 'red-sandal',
    name: 'Red Sandal', tamil: 'செம்மரம் / செஞ்சந்தனம்',
    botanical: 'Pterocarpus santalinus', category: 'Timber',
    price: null, mrp: null,  // ADD PRICE — see note 3 above
    age: 'Sapling', size: '3–5 ft', bag: 'Large bag',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained red or gravelly soil',
    popular: true,
    description: 'Red sanders — a high-value, slow-growing timber native to the Eastern Ghats and well suited to dry, gravelly ground. Note that red sandal is a protected species: harvest, transport and sale are regulated, so check the rules that apply in your state before planting at scale. We supply saplings in truck-load quantities for plantation projects.',
    image: '/plants/red-sandal.jpg'
  },
  {
    id: 8, slug: 'khaya-senegalensis',
    name: 'Khaya Senegalensis', tamil: 'கயா செனகலென்சிஸ்',
    botanical: 'Khaya senegalensis', category: 'Timber',
    price: null, mrp: null,  // ADD PRICE — see note 3 above
    age: 'Sapling', size: '3–4 ft', bag: '4 kg bag',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'African mahogany — a fast, straight-stemmed timber tree that puts on height noticeably quicker than teak or rosewood, which makes it a good fit when you want a shorter rotation. Supplied at 3–4 ft in a 4 kg bag.',
    image: '/plants/khaya-senegalensis.jpg'
  },
  {
    id: 9, slug: 'macadamia',
    name: 'Macadamia', tamil: 'மக்கடாமியா',
    botanical: 'Macadamia integrifolia', category: 'Fruit',
    price: 750, mrp: null,   // CONFIRM
    age: 'Grafted', size: '2–3 ft', bag: 'Poly bag',
    light: 'Full sun to partial shade', water: 'Regular, well spaced',
    soil: 'Deep, well-drained, slightly acidic',
    description: 'Grafted macadamia nut saplings — a high-value orchard crop with strong and growing demand in India. Macadamia needs deep, free-draining soil and protection from strong wind, and grafted trees typically begin bearing in their fourth to sixth year. We supply grafted stock rather than seedlings, because seedling macadamia is slow and unpredictable in nut quality.',
    image: '/plants/macadamia.jpg'   // photo still needed
  }
];

export const plants = rawPlants.map(p => ({
  ...p,
  gallery: p.gallery && p.gallery.length ? p.gallery : [p.image]
}));

export const categories = ['All', 'Timber', 'Fruit'];

// Accepts the numeric id or the slug, so old links keep working.
export const findPlant = key => {
  if (key == null) return undefined;
  const asNum = Number(key);
  if (!Number.isNaN(asNum)) {
    const byId = plants.find(p => p.id === asNum);
    if (byId) return byId;
  }
  return plants.find(p => p.slug === String(key).toLowerCase());
};

export const plantUrl = p => `/plants/${p.slug}`;

// One place that decides how a price is shown, so "Price on request" never
// gets rendered as "₹null" anywhere.
export const priceLabel = p =>
  p.price == null ? 'Price on request' : `₹${p.price.toLocaleString('en-IN')}`;
