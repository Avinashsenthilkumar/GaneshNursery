import { site } from './site.js';

export const WA_NUMBER = site.whatsapp;

// ============================================================================
// PLANT CATALOGUE — from the Ganesh Nursery 2026 price list
//
// Most species are sold at several heights and ages, each at its own price.
// That is the whole shape of this business, and a single "from ₹X" figure hid
// it — a customer could not tell whether ₹150 bought a 3 ft Red Sandal or an
// 8 ft one. Every product now carries a `variants` array, rendered as a proper
// size-and-price table on the product page.
//
// `offer` is the discounted price where the list shows one; `cost` is the
// usual price and is struck through next to it.
//
// The printed list states that prices are valid for 10 days — that note is
// surfaced on the site from site.priceValidityNote.
//
// Photos exist for six species. The rest declare `image: null` and render a
// branded panel rather than requesting a file that is not there. Drop a photo
// into /public/plants/<slug>.jpg and set the path to switch it on.
// ============================================================================

const rawPlants = [
  // ─── TIMBER ──────────────────────────────────────────────────────────────
  {
    id: 1, slug: 'khaya-mahogany',
    name: 'Khaya Mahogany', tamil: 'கயா மகோகனி',
    botanical: 'Khaya senegalensis', category: 'Timber',
    seedSource: 'Confidential', motherTree: '70-year CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    popular: true,
    description: 'African mahogany — a fast, straight-stemmed timber that puts on height noticeably quicker than teak or rosewood, which makes it a good fit when you want a shorter rotation. Our seed comes from 70-year-old Candidate Plus Trees, and we stock it across eight sizes from an 8-month seedling up to a 7–8 ft, two-and-a-half year tree.',
    image: '/plants/khaya-senegalensis.jpg',
    variants: [
      { size: '1 ft', age: '8 months', bag: '3 kg', cost: 100, offer: 75 },
      { size: '2–2.5 ft', age: '1 year', bag: '4 kg', cost: 165, offer: 110 },
      { size: '2.5–3 ft', age: '1 year', bag: '2 kg', cost: 225, offer: 168 },
      { size: '4 ft', age: '1–1.5 years', bag: '4 kg', cost: 325, offer: 243 },
      { size: '5 ft', age: '1.5–2 years', bag: '4 kg', cost: 375, offer: 280 },
      { size: '6 ft', age: '1.5–2 years', bag: '4 kg', cost: 450, offer: 337 },
      { size: '5–6 ft', age: '2 years', bag: '14–17 kg', cost: 650, offer: 488 },
      { size: '7–8 ft', age: '2.5 years', bag: '14–17 kg', cost: 780, offer: 585 }
    ]
  },
  {
    id: 2, slug: 'red-sandal',
    name: 'Red Sandal', tamil: 'செம்மரம் / செஞ்சந்தனம்',
    botanical: 'Pterocarpus santalinus', category: 'Timber',
    seedSource: 'Kadapa, Chittoor, Thirumala', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained red or gravelly soil',
    popular: true,
    description: 'Red sanders — a high-value, slow-growing timber native to the Eastern Ghats and well suited to dry, gravelly ground. Seed sourced from Kadapa, Chittoor and Thirumala. Note that red sandal is a protected species: harvest, transport and sale are regulated, so check the rules that apply in your state before planting at scale.',
    image: '/plants/red-sandal.jpg',
    variants: [
      { size: '3 ft', age: '1 year', bag: '4 kg', cost: 150 },
      { size: '4 ft', age: '1.5 years', bag: '4 kg', cost: 250 },
      { size: '5 ft', age: '2 years completed', bag: '4 kg', cost: 385, note: 'Strong stem' },
      { size: '6 ft', age: '2 years', bag: '4 kg', cost: 550 },
      { size: '8–10 ft', age: '3 years', bag: '14–17 kg', cost: 2200 }
    ]
  },
  {
    id: 3, slug: 'indian-mahogany',
    name: 'Indian Mahogany', tamil: 'மகோகனி',
    botanical: 'Swietenia macrophylla', category: 'Timber',
    seedSource: 'Shimoga', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Loamy, well-drained',
    description: 'Straight-stemmed timber valued for furniture and plywood, and one of the most affordable ways into a timber plantation — a 3–4 ft sapling starts at ₹75. Grows well as a boundary or block planting across most of Tamil Nadu.',
    image: null,
    variants: [
      { size: '3–4 ft', age: '1–1.5 years', bag: '4 kg', cost: 75 },
      { size: '5 ft', age: '1.5 years', bag: '4 kg', cost: 115 },
      { size: '6–7 ft', age: '2 years', bag: '4 kg', cost: 200 }
    ]
  },
  {
    id: 4, slug: 'karungali',
    name: 'Karungali (Ceylon Ebony)', tamil: 'கருங்காலி',
    botanical: 'Diospyros ebenum', category: 'Timber',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    popular: true,
    description: 'Ceylon ebony, the true Karungali. Exceptionally dense, jet-black heartwood used for carving, instruments and ritual items. A slow, long-horizon tree — the density that makes it valuable is exactly what takes decades to build.',
    image: '/plants/karungali.jpg',
    variants: [
      { size: '2 ft', age: '1 year', bag: '5–7 kg', cost: 300 },
      { size: '4 ft', bag: '5–7 kg', cost: 700 }
    ]
  },
  {
    id: 5, slug: 'african-blackwood',
    name: 'African Blackwood', tamil: 'ஆப்பிரிக்க கருங்காலி',
    botanical: 'Dalbergia melanoxylon', category: 'Timber',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained sandy loam',
    description: 'One of the densest and most durable timbers available anywhere, and the standard choice for clarinets, oboes and fine carving. A slow grower by nature — that slowness is exactly what builds the density.',
    image: null,
    variants: [
      { size: '1 ft', bag: '1 kg', cost: 250 },
      { size: '2 ft', bag: '1 kg', cost: 350 },
      { size: '3 ft', bag: '2 kg', cost: 400 }
    ]
  },
  {
    id: 6, slug: 'nilambur-teak',
    name: 'Nilambur Teak', tamil: 'நிலம்பூர் தேக்கு',
    botanical: 'Tectona grandis', category: 'Timber',
    seedSource: 'KFRI', motherTree: '70 to 90-year-old trees',
    light: 'Full sun', water: 'Moderate in first 2 years', soil: 'Deep, well-drained alluvial soil',
    popular: true,
    description: 'Nilambur teak from KFRI seed — the benchmark provenance for Indian teak. Naturally resistant to termites and weather. Supplied as stump-raised stock with a 1.5-year stem age, so it establishes faster than its height suggests.',
    image: null,
    variants: [
      { size: '1 ft', age: '1 year, stem age 1.5 years', bag: '4 kg', cost: 100, note: 'Seed from 70-year mother tree' },
      { size: '1.5–2 ft', age: '1 year, stem age 1.5 years', bag: 'Cocopeat bag', cost: 200, note: 'Seed from 80–90 year mother tree' }
    ]
  },
  {
    id: 7, slug: 'burma-teak',
    name: 'Burma Teak', tamil: 'பர்மா தேக்கு',
    botanical: 'Tectona grandis', category: 'Timber',
    light: 'Full sun', water: 'Moderate in first 2 years', soil: 'Deep, well-drained',
    description: 'Burma teak provenance, prized for tight, even grain and colour. Supplied at 1 ft in a 4 kg bag.',
    image: null,
    variants: [
      { size: '1 ft', age: '1 year', bag: '4 kg', cost: 198 }
    ]
  },
  {
    id: 8, slug: 'venghai',
    name: 'Venghai', tamil: 'வேங்கை',
    botanical: 'Pterocarpus marsupium', category: 'Timber',
    seedSource: 'Topslip', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    description: 'Indian Kino tree — a strong, durable native timber also valued in traditional medicine. Seed from Topslip. Supplied as a large 7–8 ft tree in a 10–12 kg bag, so it is well past the vulnerable establishment stage on arrival.',
    image: null,
    variants: [
      { size: '7–8 ft', bag: '10–12 kg', cost: 650 }
    ]
  },
  {
    id: 9, slug: 'rosewood',
    name: 'Rosewood', tamil: 'ஈட்டி / ரோஸ்வுட்',
    botanical: 'Dalbergia sissoo', category: 'Timber',
    seedSource: 'Shimoga', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'A premium furniture timber with dark, richly figured heartwood. A long rotation crop that intercrops well in the early years while the canopy is still open.',
    image: '/plants/rosewood.jpg',
    variants: [
      { size: '3–4 ft', age: '1–1.5 years', bag: '4 kg', cost: 100 },
      { size: '5–6 ft', age: '2 years', bag: '4 kg', cost: 180 }
    ]
  },
  {
    id: 10, slug: 'sandalwood',
    name: 'Sandalwood', tamil: 'சந்தன மரம்',
    botanical: 'Santalum album', category: 'Timber',
    seedSource: 'Marayur', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Low to moderate', soil: 'Well-drained — needs a host plant',
    popular: true,
    description: 'Marayur-sourced sandalwood, the most sought-after provenance in India. Sandalwood is a root parasite and needs a compatible host plant growing alongside it — talk to us about host selection before you plant, because this is where most sandal plantations go wrong.',
    image: '/plants/sandalwood.jpg',
    gallery: ['/plants/sandalwood.jpg', '/plants/sandalwood-sapling.jpg'],
    variants: [
      { size: '1–1.5 ft', age: '8 months', bag: '1 kg', cost: 100 },
      { size: '3 ft', age: '1.5–2 years', bag: '7 kg', cost: 325, offer: 275 }
    ]
  },

  // ─── FRUIT ───────────────────────────────────────────────────────────────
  {
    id: 11, slug: 'macadamia',
    name: 'Macadamia', tamil: 'மக்கடாமியா',
    botanical: 'Macadamia integrifolia', category: 'Fruit',
    light: 'Full sun to partial shade', water: 'Regular, well spaced',
    soil: 'Deep, well-drained, slightly acidic',
    popular: true,
    description: 'A high-value orchard crop with strong and growing demand in India. Macadamia needs deep, free-draining soil and protection from strong wind, and generally begins bearing in its fourth to sixth year. Talk to us about your site before committing land to it.',
    image: null,
    variants: [
      { size: '1 ft', bag: '4 kg', cost: 750, offer: 600 }
    ]
  },
  {
    id: 12, slug: 'imampasand-mango',
    name: 'Imampasand Mango', tamil: 'இமாம்பசந்து மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    popular: true,
    description: 'Imampasand — a premium South Indian table mango with a thin skin, almost no fibre and an intense aroma. Supplied as a large grafted plant at 5–6 ft in a 15 kg bag, so it fruits years earlier than seedling stock.',
    image: null,
    variants: [
      { size: '5–6 ft', bag: '15 kg', cost: 350 }
    ]
  },
  {
    id: 13, slug: 'panganapalli-mango',
    name: 'Panganapalli Mango', tamil: 'பங்கனப்பள்ளி மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    description: 'Banganapalli — the big, golden, mildly sweet mango that anchors most commercial orchards in the south. Reliable bearer and an easy seller. Grafted, supplied at 5–6 ft.',
    image: null,
    variants: [
      { size: '5–6 ft', cost: 350 }
    ]
  },
  {
    id: 14, slug: 'kili-mooku-mango',
    name: 'Kili Mooku Mango', tamil: 'கிளிமூக்கு மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    description: 'Kili Mooku — named for the parrot-beak curve of the fruit. A firm, aromatic traditional Tamil Nadu variety that holds its shape well when cut. Grafted, supplied at 5–6 ft.',
    image: null,
    variants: [
      { size: '5–6 ft', cost: 350 }
    ]
  },
  {
    id: 15, slug: 'rumani-mango',
    name: 'Rumani Mango', tamil: 'ருமானி மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    description: 'Rumani — a round, apple-shaped mango with firm flesh, popular for home gardens. Supplied grafted at 3 ft.',
    image: null,
    variants: [
      { size: '3 ft', cost: 200 }
    ]
  },
  {
    id: 16, slug: 'balaji-lemon',
    name: 'Balaji Lemon', tamil: 'பாலாஜி எலுமிச்சை',
    botanical: 'Citrus limon', category: 'Fruit',
    light: 'Full sun', water: 'Regular, never waterlogged', soil: 'Well-drained, slightly acidic',
    popular: true,
    description: 'Balaji lemon — a heavy, near year-round bearer that suits both large pots and open ground. Needs full sun and sharp drainage; standing water at the collar is the usual cause of failure.',
    image: null,
    variants: [
      { size: '3 ft', cost: 150 }
    ]
  },
  {
    id: 17, slug: 'saathukudi',
    name: 'Saathukudi (Sweet Lime)', tamil: 'சாத்துக்குடி',
    botanical: 'Citrus limetta', category: 'Fruit',
    light: 'Full sun', water: 'Regular, never waterlogged', soil: 'Well-drained loam',
    description: 'Mosambi — the sweet lime grown across Tamil Nadu for juice. Wants full sun and good drainage, and rewards steady watering through the fruiting season.',
    image: null,
    variants: [
      { size: '3 ft', cost: 200 }
    ]
  },
  {
    id: 18, slug: 'naattu-naval',
    name: 'Naattu Naval (Java Plum)', tamil: 'நாட்டு நாவல்',
    botanical: 'Syzygium cumini', category: 'Fruit',
    light: 'Full sun', water: 'Low once established', soil: 'Adaptable',
    description: 'The native jamun — a hardy, long-lived shade tree that also carries a valued seasonal fruit. Very little care needed once away, and one of the most affordable trees on this list at ₹100 for a 4–5 ft plant.',
    image: null,
    variants: [
      { size: '4–5 ft', cost: 100 }
    ]
  },
  {
    id: 19, slug: 'chikoo-sapota',
    name: 'Chikoo / Sapota (Grafted)', tamil: 'சப்போட்டா',
    botanical: 'Manilkara zapota', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Well-drained',
    description: 'Grafted sapota, which begins bearing far sooner than seedling stock and stays true to the parent fruit. A dependable, low-maintenance orchard tree in Tamil Nadu conditions.',
    image: null,
    variants: [
      { size: '3 ft', cost: 150 }
    ]
  },
  {
    id: 20, slug: 'panruti-pala',
    name: 'Panruti Pala (Jackfruit)', tamil: 'பண்ருட்டி பலா',
    botanical: 'Artocarpus heterophyllus', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'Jackfruit from the Panruti belt, the variety Tamil Nadu is known for. Large, firm, sweet bulbs and a tree that keeps producing for decades. Supplied at 5–6 ft.',
    image: null,
    variants: [
      { size: '5–6 ft', cost: 200 }
    ]
  },
  {
    id: 21, slug: 'l49-guava',
    name: 'L-49 Guava', tamil: 'கொய்யா எல்-49',
    botanical: 'Psidium guajava', category: 'Fruit',
    light: 'Full sun', water: 'Moderate', soil: 'Tolerates a wide range',
    popular: true,
    description: 'Lucknow-49, the standard commercial guava — heavy bearing, quick to fruit and forgiving of imperfect soil. Supplied at 5 ft in a 7 kg bag, so it establishes fast and starts returning a yield sooner.',
    image: '/plants/koyya-l49.jpg',
    variants: [
      { size: '5 ft', bag: '7 kg', cost: 150 }
    ]
  },
  {
    id: 22, slug: 'sevvilaneer-coconut',
    name: 'Sevvilaneer Coconut', tamil: 'செவ்விளநீர்',
    botanical: 'Cocos nucifera', category: 'Fruit',
    light: 'Full sun', water: 'High, consistent', soil: 'Sandy loam with good drainage',
    description: 'Orange dwarf tender coconut — the sweet, orange-husked variety grown for drinking rather than copra. Starts bearing much earlier and much lower than a tall, which makes harvesting far easier. Needs dependable water through the establishment years.',
    image: null,
    variants: [
      { size: '1.5 ft', bag: '10 kg', cost: 350 }
    ]
  }
];

// ---------------------------------------------------------------------------
// Derived fields. `price` is the cheapest a customer can actually pay, so the
// "from ₹X" on a card always matches something real in the table below it.
// ---------------------------------------------------------------------------
function effective(v) {
  return v.offer ?? v.cost;
}

export const plants = rawPlants.map(p => {
  const variants = p.variants ?? [];
  const prices = variants.map(effective).filter(n => Number.isFinite(n));
  const lowest = prices.length ? Math.min(...prices) : null;
  const cheapest = variants.find(v => effective(v) === lowest);
  return {
    ...p,
    variants,
    price: lowest,
    // Shown struck through beside the price, but only when the cheapest option
    // is genuinely discounted — never invent a "was" figure.
    mrp: cheapest && cheapest.offer && cheapest.cost > cheapest.offer ? cheapest.cost : null,
    size: variants.length
      ? (variants.length === 1 ? variants[0].size : `${variants[0].size} – ${variants[variants.length - 1].size}`)
      : '',
    bag: variants.length === 1 ? variants[0].bag : undefined,
    age: variants.length === 1 ? variants[0].age : undefined,
    sizeCount: variants.length,
    gallery: p.gallery?.length ? p.gallery : (p.image ? [p.image] : [])
  };
});

export const categories = ['All', 'Timber', 'Fruit'];

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

export const priceLabel = p =>
  p.price == null ? 'Price on request' : `₹${p.price.toLocaleString('en-IN')}`;

export const variantPrice = v => effective(v);
