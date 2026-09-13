import { site } from './site.js';

export const WA_NUMBER = site.whatsapp;

// ============================================================================
// PLANT CATALOGUE — Ganesh Nursery 2026 rate card
//
// WHAT CHANGED IN THIS VERSION
// Every plant now carries a `variants` array instead of one flat price. One
// plant, many heights, and each height has its own bag size, age and rate —
// which is how the printed list actually works. The site derives everything
// else from it: the "from ₹x" on the card, the price table on the detail page,
// the price range used by the sort, and the schema.org AggregateOffer.
//
// ─── HOW TO ADD OR EDIT A PLANT ────────────────────────────────────────────
// Add one object to `rawPlants`. The only required fields are id, slug, name,
// category and variants. A variant looks like:
//
//     { size: '4 ft', age: '1–1.5 years', bag: '4 kg bag', price: 243, mrp: 325 }
//
//   price = what the customer pays today (the Offer column, when there is one)
//   mrp   = the struck-through original (the Cost column). Leave it out when
//           there is no offer on that size.
//   label = optional, for varieties rather than heights (see Mango).
//   note  = optional, for anything else printed against that row.
//
// Nothing else needs touching — no component reads a hard-coded plant.
//
// ─── PLEASE CONFIRM BEFORE LAUNCH ──────────────────────────────────────────
//
// 1. KHAYA 2.5–3 ft is listed at a 2 kg bag while both the smaller (2–2.5 ft,
//    4 kg) and the larger (4 ft, 4 kg) sizes are 4 kg. Likely a typo.
//
// 2. ROSEWOOD species. The sheet says Dalbergia sissoo, which is Shisham /
//    North Indian rosewood. Indian rosewood — ஈட்டி — is Dalbergia latifolia.
//    Two different trees at two different values. Confirm which is in stock.
//
// 3. INDIAN MAHOGANY. The sheet gives the genus only ("Swietenia"). I have
//    put Swietenia macrophylla, the one normally traded in India.
//
// 4. ADDRESS. The rate card header says Vellalavidudhi, Gandharvakkottai,
//    PUDUKOTTAI. site.js says Thanjavur 613301. Same taluk, different district
//    on paper — fix site.js so Google sees one consistent address.
//
// 5. PHOTOS. Eleven plants here have no photograph yet and fall back to a
//    branded leaf panel. Drop a file into /public/plants/<slug>.jpg and set
//    `image` — the -sm.jpg thumbnail is optional, SmartImage copes without it.
// ============================================================================

// Shown on the catalogue and detail pages so a stale rate is never presented
// as a promise.
export const PRICE_LIST = {
  season: '2026',
  note: 'Rates are from the 2026 printed list, which the nursery revises roughly every 10 days. We confirm the current rate on WhatsApp before anything is committed.'
};

const rawPlants = [
  // ───────────────────────────── TIMBER ─────────────────────────────────
  {
    id: 1, slug: 'khaya-mahogany',
    name: 'Khaya Mahogany', tamil: 'கயா மகோகனி',
    botanical: 'Khaya senegalensis', category: 'Timber',
    seedSource: 'Confidential', motherTree: '70-year-old CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    popular: true,
    description: 'African mahogany, and the fastest-growing timber on this list. It puts on height noticeably quicker than teak or rosewood, which makes it the practical choice when you want a shorter rotation without dropping to a low-value species. Grown from 70-year-old CPT mother trees, and stocked in eight grades from an eight-month seedling right up to a 7–8 ft, two-and-a-half-year tree — so you can match the grade to how much establishment work you want to take on yourself.',
    image: '/plants/khaya-2-5ft.jpg',
    // The studio shot leads because nothing in it competes with the plant. The
    // field photos follow in height order — 1 ft to 5-6 ft is the clearest
    // possible answer to "what does the bigger grade actually look like?".
    gallery: [
      '/plants/khaya-2-5ft.jpg', '/plants/khaya-1ft.jpg', '/plants/khaya-2ft.jpg',
      '/plants/khaya-4ft.jpg', '/plants/khaya-5-6ft.jpg', '/plants/khaya-senegalensis.jpg'
    ],
    variants: [
      { size: '1 ft', age: '8 months', bag: '3 kg bag', price: 75, mrp: 100 },
      { size: '2–2.5 ft', age: '1 year', bag: '4 kg bag', price: 110, mrp: 165 },
      { size: '2.5–3 ft', age: '1 year', bag: '2 kg bag', price: 168, mrp: 225 },
      { size: '4 ft', age: '1–1.5 years', bag: '4 kg bag', price: 243, mrp: 325 },
      { size: '5 ft', age: '1.5–2 years', bag: '4 kg bag', price: 280, mrp: 375 },
      { size: '6 ft', age: '1.5–2 years', bag: '4 kg bag', price: 337, mrp: 450 },
      { size: '5–6 ft', age: '2 years', bag: '14–17 kg bag', price: 488, mrp: 650 },
      { size: '7–8 ft', age: '2.5 years', bag: '14–17 kg bag', price: 585, mrp: 780 }
    ]
  },
  {
    id: 2, slug: 'red-sandal',
    name: 'Red Sandal', tamil: 'செம்மரம் / செஞ்சந்தனம்',
    botanical: 'Pterocarpus santalinus', category: 'Timber',
    seedSource: 'Kadapa, Chittoor & Thirumala', motherTree: '35-year-old CPT trees',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained red or gravelly soil',
    popular: true,
    description: 'Red sanders — the highest-value timber we grow, native to the Eastern Ghats and genuinely happy on dry, gravelly ground that will not carry much else. Seed comes from the Kadapa, Chittoor and Thirumala belt, which is the natural range of the species rather than a plantation source. Red sandal is a protected species: felling, transport and sale are regulated, so check the rules in your state before planting at scale. We supply in truck-load quantities for plantation projects.',
    image: '/plants/red-sandal.jpg',
    gallery: ['/plants/red-sandal.jpg', '/plants/red-sandal-3ft.jpg'],
    variants: [
      { size: '3 ft', age: '1 year', bag: '4 kg bag', price: 150 },
      { size: '4 ft', age: '1.5 years', bag: '4 kg bag', price: 250 },
      { size: '5 ft', age: '2 years completed', bag: '4 kg bag', price: 385, note: 'Strong stem grade' },
      { size: '6 ft', age: '2 years', bag: '4 kg bag', price: 550 },
      { size: '8–10 ft', age: '3 years', bag: '14–17 kg bag', price: 2200 }
    ]
  },
  {
    id: 3, slug: 'sandalwood',
    name: 'Sandalwood', tamil: 'சந்தன மரம்',
    botanical: 'Santalum album', category: 'Timber',
    seedSource: 'Marayur', motherTree: '35-year-old CPT trees',
    light: 'Full sun', water: 'Low to moderate', soil: 'Well-drained — needs a living host plant',
    popular: true,
    description: 'Marayur-source sandalwood, from the belt that produces the highest oil content in the country. The one thing to understand before you buy: sandalwood is a root parasite and will not survive alone. It needs a compatible host growing alongside it from the start, and host selection is where most sandal plantations quietly fail in year two. Talk to us about it before you plant — the advice costs nothing and it decides the outcome.',
    image: '/plants/sandalwood-2ft.jpg',
    gallery: ['/plants/sandalwood-2ft.jpg', '/plants/sandalwood-1ft.jpg', '/plants/sandalwood.jpg'],
    variants: [
      { size: '1–1.5 ft', age: '8 months', bag: '1 kg bag', price: 100 },
      { size: '3 ft', age: '1.5–2 years', bag: '7 kg bag', price: 275, mrp: 325 }
    ]
  },
  {
    id: 4, slug: 'indian-mahogany',
    name: 'Indian Mahogany', tamil: 'மகோகனி',
    botanical: 'Swietenia macrophylla', category: 'Timber',
    seedSource: 'Shimoga', motherTree: '35-year-old CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'True mahogany, and the best value per foot in the whole catalogue — a 6–7 ft, two-year tree costs less than a 4 ft Khaya. Straight-stemmed, reliable in Tamil Nadu conditions and a steady performer for avenue planting, farm boundaries and block plantations alike. Seed from Shimoga, off 35-year-old CPT mother trees.',
    image: null,
    variants: [
      { size: '3–4 ft', age: '1–1.5 years', bag: '4 kg bag', price: 75 },
      { size: '5 ft', age: '1.5 years', bag: '4 kg bag', price: 115 },
      { size: '6–7 ft', age: '2 years', bag: '4 kg bag', price: 200 }
    ]
  },
  {
    id: 5, slug: 'karungali',
    name: 'Karungali (Ceylon Ebony)', tamil: 'கருங்காலி',
    botanical: 'Diospyros ebenum', category: 'Timber',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    popular: true,
    description: 'Ceylon ebony — the true Karungali, not one of the lookalikes sold under the name. Exceptionally dense jet-black heartwood, used for carving, instruments and ritual items, and valued well beyond ordinary timber rates. It is a slow, long-horizon tree by nature: the density that makes it worth growing is exactly what takes decades to build. Plant it as an inheritance, not as a crop.',
    image: '/plants/karungali-4ft.jpg',
    // Studio shot first, then the plant in hand and in the yard. Karungali has
    // several lookalikes sold under the same name, so showing the leaf and the
    // habit from more than one angle is doing real work here.
    gallery: [
      '/plants/karungali-4ft.jpg', '/plants/karungali-2ft.jpg',
      '/plants/karungali-2.jpg', '/plants/karungali.jpg'
    ],
    variants: [
      { size: '2 ft', age: '1 year', bag: '5–7 kg bag', price: 300 },
      { size: '4 ft', bag: '5–7 kg bag', price: 700 }
    ]
  },
  {
    id: 6, slug: 'african-blackwood',
    name: 'African Blackwood', tamil: 'ஆப்பிரிக்க கருங்காலி',
    botanical: 'Dalbergia melanoxylon', category: 'Timber',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained, tolerates poor ground',
    description: 'One of the most expensive timbers traded anywhere in the world, cut almost entirely for clarinets, oboes and fine inlay work. Extremely dense, extremely slow, and almost never available as nursery stock in India — we grow it because a handful of growers are willing to plant on a fifty-year view. Small stock only, in 1–3 ft grades.',
    image: '/plants/african-blackwood.jpg',
    gallery: ['/plants/african-blackwood.jpg', '/plants/african-blackwood-3ft.jpg'],
    variants: [
      { size: '1 ft', bag: '1 kg bag', price: 250 },
      { size: '2 ft', bag: '1 kg bag', price: 350 },
      { size: '3 ft', bag: '2 kg bag', price: 400 }
    ]
  },
  {
    id: 7, slug: 'nilambur-teak',
    name: 'Nilambur Teak', tamil: 'நிலம்பூர் தேக்கு',
    botanical: 'Tectona grandis', category: 'Timber',
    seedSource: 'KFRI (Kerala Forest Research Institute)',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, free-draining, not waterlogged',
    description: 'Nilambur is the teak standard the rest of the world is measured against, and this is KFRI-sourced seed rather than unverified local collection — which matters, because teak from poor seed looks identical in the bag and only shows the difference twenty years later. Two grades, separated by the age of the mother tree the seed came off.',
    image: '/plants/nilambur-teak.jpg',
    variants: [
      { size: '1 ft', age: '1 year (stem age 1.5 years)', bag: '4 kg bag', price: 100, note: 'Seed from 70-year-old mother tree' },
      { size: '1.5–2 ft', age: '1 year (stem age 1.5 years)', bag: 'Cocopeat bag', price: 200, note: 'Seed from 80–90-year-old mother tree' }
    ]
  },
  {
    id: 8, slug: 'burma-teak',
    name: 'Burma Teak', tamil: 'பர்மா தேக்கு',
    botanical: 'Tectona grandis', category: 'Timber',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, free-draining, not waterlogged',
    description: 'The Burma strain of teak, prized for tight, even grain and high natural oil content — the reason it holds up outdoors and on boat decks better than almost any other timber. Currently stocked as one-year, 1 ft plants in a 4 kg bag.',
    image: '/plants/burma-teak.jpg',
    variants: [
      { size: '1 ft', age: '1 year', bag: '4 kg bag', price: 198 }
    ]
  },
  {
    id: 9, slug: 'venghai',
    name: 'Venghai', tamil: 'வேங்கை',
    botanical: 'Pterocarpus marsupium', category: 'Timber',
    seedSource: 'Topslip', motherTree: '35-year-old CPT trees',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    description: 'Indian kino — a strong, hard-wearing furniture timber that is also one of the best-known medicinal trees in Siddha practice, where the heartwood is used for the traditional wooden water tumbler. Seed from Topslip. Supplied large, at 7–8 ft in a 10–12 kg bag, so it goes into the ground already ahead of the weeds.',
    image: '/plants/venghai.jpg',
    variants: [
      { size: '7–8 ft', bag: '10–12 kg bag', price: 650 }
    ]
  },
  {
    id: 10, slug: 'rosewood',
    name: 'Rosewood', tamil: 'ஈட்டி / ரோஸ்வுட்',
    botanical: 'Dalbergia sissoo', category: 'Timber',
    seedSource: 'Shimoga', motherTree: '35-year-old CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'A premium furniture timber with dark, richly figured heartwood and a long, patient rotation. It intercrops well in the early years while the canopy is still open, so the land keeps earning while the trees put on girth. Seed from Shimoga, off 35-year-old CPT mother trees.',
    image: '/plants/rosewood.jpg',
    variants: [
      { size: '3–4 ft', age: '1–1.5 years', bag: '4 kg bag', price: 100 },
      { size: '5–6 ft', age: '2 years', bag: '4 kg bag', price: 180 }
    ]
  },

  // ──────────────────────────── FRUIT & NUT ─────────────────────────────
  {
    id: 11, slug: 'mango',
    name: 'Mango', tamil: 'மாமரம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Moderate, ease off at flowering', soil: 'Deep, well-drained',
    popular: true,
    description: 'Four varieties in stock, each true to type. Imam Pasand and Kili Mooku are the eating mangoes people drive out of their way for; Panganapalli is the dependable commercial variety that sells anywhere; Rumani is the soft, sweet home-garden favourite. The three larger varieties go out at 5–6 ft, so they are well past the fragile stage and will usually fruit years ahead of a seedling tree.',
    image: '/plants/mango.jpg',
    // Imam Pasand first, Panganapalli second — same order as the size table.
    gallery: ['/plants/mango.jpg', '/plants/mango-panganapalli.jpg'],
    variants: [
      { label: 'Imam Pasand', size: '5–6 ft', bag: '15 kg bag', price: 350 },
      { label: 'Panganapalli', size: '5–6 ft', price: 350 },
      { label: 'Kili Mooku', size: '5–6 ft', price: 350 },
      { label: 'Rumani', size: '3 ft', price: 200 }
    ]
  },
  {
    id: 12, slug: 'koyya-l49',
    name: 'Guava L-49', tamil: 'கொய்யா எல்-49',
    botanical: 'Psidium guajava', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Tolerates a wide range',
    popular: true,
    description: 'Lucknow-49, the standard commercial guava — heavy bearing, quick to come into fruit and forgiving of imperfect soil. Supplied tall at 5 ft in a 7 kg bag, which means it establishes fast and starts returning a yield sooner than small seedling stock.',
    image: '/plants/koyya-l49.jpg',
    variants: [
      { size: '5 ft', bag: '7 kg bag', price: 150 }
    ]
  },
  {
    id: 13, slug: 'balaji-lemon',
    name: 'Balaji Lemon', tamil: 'பாலாஜி எலுமிச்சை',
    botanical: 'Citrus limon', category: 'Fruit',
    light: 'Full sun', water: 'Regular, well spaced', soil: 'Well-drained, never waterlogged',
    description: 'A high-yielding lemon selection that bears through most of the year rather than in one short flush — which is what makes it worth planting near the house as much as in a block. Thin-skinned, heavy juice. Supplied at 3 ft.',
    image: null,
    variants: [
      { size: '3 ft', price: 150 }
    ]
  },
  {
    id: 14, slug: 'saathukudi',
    name: 'Saathukudi (Sweet Lime)', tamil: 'சாத்துக்குடி',
    botanical: 'Citrus limetta', category: 'Fruit',
    light: 'Full sun', water: 'Regular, well spaced', soil: 'Well-drained loam',
    description: 'Sweet lime — the juice-stall standard, and a steady seller at any roadside. Likes free-draining ground and a proper basin; the one thing it will not tolerate is standing water at the collar. Supplied at 3 ft.',
    image: null,
    variants: [
      { size: '3 ft', price: 200 }
    ]
  },
  {
    id: 15, slug: 'naattu-naaval',
    name: 'Naattu Naaval (Java Plum)', tamil: 'நாட்டு நாவல்',
    botanical: 'Syzygium cumini', category: 'Fruit',
    light: 'Full sun', water: 'Low once established', soil: 'Adapts to most soils, takes heavy ground',
    description: 'The native naaval — tough, long-lived, and one of the few fruit trees that will take heavy soil and neglect and still crop. A strong shade tree in its own right, and the fruit has a well-known place in traditional diabetic diets. Supplied large, at 4–5 ft.',
    image: null,
    variants: [
      { size: '4–5 ft', price: 100 }
    ]
  },
  {
    id: 16, slug: 'chikoo-sapota',
    name: 'Chikoo / Sapota (Grafted)', tamil: 'சப்போட்டா',
    botanical: 'Manilkara zapota', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'Grafted sapota, not seedling — which is the difference between fruiting in three years and waiting six for something that may not come true to type. Crops twice a year once established and keeps producing for decades. Supplied at 3 ft.',
    image: null,
    variants: [
      { size: '3 ft', price: 150, note: 'Grafted' }
    ]
  },
  {
    id: 17, slug: 'panruti-pala',
    name: 'Panruti Pala (Jackfruit)', tamil: 'பண்ருட்டி பலா',
    botanical: 'Artocarpus heterophyllus', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'The Panruti jack, the variety that made the town\'s name — firm, sweet, well-separated bulbs and a fruit that travels without turning to pulp. Supplied at 5–6 ft, well past the stage where goats and a dry spell get to decide its future.',
    image: null,
    variants: [
      { size: '5–6 ft', price: 200 }
    ]
  },
  {
    id: 18, slug: 'sevvilaneer',
    name: 'Sevvilaneer (Orange Dwarf Coconut)', tamil: 'செவ்விளநீர்',
    botanical: 'Cocos nucifera', category: 'Fruit',
    light: 'Full sun', water: 'Regular', soil: 'Sandy loam, well-drained',
    description: 'The orange tender-coconut dwarf — short enough to harvest without a climber, which is the whole reason people plant it now. Sweet water, early bearing, and a reliable seller at the gate. Supplied at 1.5 ft in a 10 kg bag.',
    image: '/plants/sevvilaneer.jpg',
    variants: [
      { size: '1.5 ft', bag: '10 kg bag', price: 350 }
    ]
  },
  {
    id: 19, slug: 'macadamia',
    name: 'Macadamia', tamil: 'மக்கடாமியா',
    botanical: 'Macadamia integrifolia', category: 'Fruit',
    light: 'Full sun to partial shade', water: 'Regular, well spaced',
    soil: 'Deep, well-drained, slightly acidic',
    popular: true,
    description: 'A high-value orchard nut with demand in India growing faster than domestic supply. Macadamia wants deep, free-draining soil and shelter from strong wind, and typically begins bearing in its fourth to sixth year. Worth knowing: we supply grafted stock rather than seedlings, because seedling macadamia is slow and unpredictable in nut quality — the saving up front costs you the crop.',
    image: '/plants/macadamia.jpg',
    variants: [
      { size: '1 ft', bag: '4 kg bag', price: 600, mrp: 750 }
    ]
  }
];

// ============================================================================
// Derived data. Nothing below needs editing when you add a plant.
// ============================================================================

// Pulls every number out of a size string ("5–6 ft" → [5, 6]) so a plant whose
// variants are listed by variety rather than by height still gets an honest
// height range on its card.
const feet = s => (String(s || '').match(/\d+(?:\.\d+)?/g) || []).map(Number);

// Exported so the size picker can draw each grade's height to scale against
// the tallest one the plant is sold in.
export const sizeFeet = size => {
  const found = feet(size);
  return found.length ? Math.max(...found) : 0;
};

const rangeLabel = (min, max, unit) =>
  min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`;

// Only report a shared attribute on the card when every size really does share
// it — otherwise the card advertises one variant's bag as the whole plant's.
const uniform = (list, field) => {
  const values = list.map(v => v[field]).filter(Boolean);
  if (values.length !== list.length || values.length === 0) return null;
  return values.every(v => v === values[0]) ? values[0] : null;
};

export const variantTitle = v =>
  [v.label, v.size, v.age].filter(Boolean).join(' · ');

function prepare(p) {
  const variants = (p.variants || []).map((v, i) => {
    const price = Number.isFinite(v.price) ? v.price : null;
    return {
      key: `${p.slug}-${i + 1}`,
      label: v.label || null,
      size: v.size || null,
      age: v.age || null,
      bag: v.bag || null,
      note: v.note || null,
      price,
      // A struck-through price only means something if it is higher than what
      // is being charged, so an equal or lower "mrp" is dropped rather than
      // rendered as a fake discount.
      mrp: Number.isFinite(v.mrp) && price != null && v.mrp > price ? v.mrp : null
    };
  });

  const priced = variants.filter(v => v.price != null);
  const prices = priced.map(v => v.price);
  const priceFrom = prices.length ? Math.min(...prices) : null;
  const priceTo = prices.length ? Math.max(...prices) : null;
  const cheapest = priced.find(v => v.price === priceFrom) || variants[0] || null;

  const heights = variants.flatMap(v => feet(v.size));
  const sizeLabel = heights.length
    ? rangeLabel(Math.min(...heights), Math.max(...heights), 'ft')
    : (variants[0] && variants[0].size) || '';

  return {
    ...p,
    variants,
    // Back-compatible flat fields — the enquiry list, the sort and the older
    // components all still read plant.price, and it now means "from".
    price: priceFrom,
    mrp: cheapest && cheapest.price === priceFrom ? cheapest.mrp : null,
    priceFrom,
    priceTo,
    hasPriceRange: priceFrom != null && priceTo != null && priceTo > priceFrom,
    defaultVariant: cheapest,
    size: sizeLabel,
    bag: uniform(variants, 'bag'),
    age: uniform(variants, 'age'),
    gallery: p.gallery && p.gallery.length ? p.gallery : [p.image]
  };
}

export const plants = rawPlants.map(prepare);

export const categories = ['All', ...Array.from(new Set(plants.map(p => p.category)))];

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

export const findVariant = (plant, key) =>
  (plant && plant.variants.find(v => v.key === key)) || (plant && plant.defaultVariant) || null;

export const plantUrl = p => `/plants/${p.slug}`;

export const rupees = n => `₹${Number(n).toLocaleString('en-IN')}`;

// One place that decides how a price is shown, so "Price on request" never
// gets rendered as "₹null" anywhere.
export const priceLabel = p =>
  p.price == null ? 'Price on request' : rupees(p.price);

// "₹75 – ₹585" for a plant sold in eight grades, plain "₹150" for one grade.
export const priceRangeLabel = p => {
  if (p.priceFrom == null) return 'Price on request';
  return p.hasPriceRange ? `${rupees(p.priceFrom)} – ${rupees(p.priceTo)}` : rupees(p.priceFrom);
};

// Everything a visitor might plausibly type: name, Tamil name, botanical name,
// category, seed source, and every variety and height listed under the plant.
export const searchText = p =>
  [
    p.name, p.tamil, p.botanical, p.category, p.seedSource,
    ...p.variants.map(v => [v.label, v.size].filter(Boolean).join(' '))
  ].filter(Boolean).join(' ').toLowerCase();
