import { site } from './site.js';

export const WA_NUMBER = site.whatsapp;

// ============================================================================
// PLANT CATALOGUE
//
// NOTE ON PHOTOGRAPHY: the images below are generic Unsplash stock hot-linked
// from images.unsplash.com. Two problems, both worth fixing before you push
// traffic at this site:
//   1. Several are not photos of the species they are labelled as. Anyone who
//      knows teak will notice, and it costs you credibility.
//   2. They load from a third-party CDN on every page view. If it is slow,
//      blocked or rate-limited, your catalogue looks broken.
// Replace `image` with your own photos in /public/plants/<slug>.webp. Every
// card falls back to a branded panel if an image fails, so the layout will
// never collapse in the meantime.
// ============================================================================

const rawPlants = [
  {
    id: 1, slug: 'african-blackwood', name: 'African Blackwood',
    botanical: 'Dalbergia melanoxylon', category: 'Timber', price: 650,
    size: '2–3 ft', light: 'Full sun', water: 'Low once established',
    soil: 'Well-drained sandy loam', popular: true,
    description: 'A slow-growing, exceptionally dense hardwood prized for woodwind instruments, fine furniture and carving. Tolerates dry conditions well and suits long-horizon plantation investment rather than quick returns.',
    image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2, slug: 'teak', name: 'Teak',
    botanical: 'Tectona grandis', category: 'Timber', price: 480,
    size: '2–3 ft', light: 'Full sun', water: 'Moderate in first 2 years',
    soil: 'Deep, well-drained alluvial soil', popular: true,
    description: 'The benchmark commercial timber of South India. Naturally resistant to termites and weather, teak performs best on deep soils with good drainage and rewards disciplined early-stage weeding and pruning.',
    image: 'https://images.unsplash.com/photo-1599685315640-9d7f42c4d3d0?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3, slug: 'mahogany', name: 'Mahogany',
    botanical: 'Swietenia macrophylla', category: 'Timber', price: 420,
    size: '2–3 ft', light: 'Full sun', water: 'Moderate',
    soil: 'Loamy, well-drained',
    description: 'Straight-stemmed timber tree with a faster early growth rate than teak, valued for furniture and plywood. Grows well as a boundary or block plantation across most of Tamil Nadu.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4, slug: 'neem', name: 'Neem',
    botanical: 'Azadirachta indica', category: 'Native', price: 180,
    size: '2–4 ft', light: 'Full sun', water: 'Very low once established',
    soil: 'Tolerates poor and saline soils',
    description: 'A hardy native that thrives where little else will. Widely planted for shade, avenue greening and its seed and leaf yield. Extremely drought tolerant after the first season.',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5, slug: 'rain-tree', name: 'Rain Tree',
    botanical: 'Samanea saman', category: 'Shade', price: 260,
    size: '3–4 ft', light: 'Full sun', water: 'Moderate',
    soil: 'Adaptable',
    description: 'A fast, broad-canopied shade tree used on campuses, highways and large compounds. Needs generous spacing — the crown spreads far wider than the height suggests.',
    image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6, slug: 'indian-rosewood', name: 'Indian Rosewood',
    botanical: 'Dalbergia latifolia', category: 'Timber', price: 560,
    size: '2–3 ft', light: 'Full sun', water: 'Moderate',
    soil: 'Deep, well-drained',
    description: 'Also called Beeti or Blackwood. A premium furniture timber with dark, richly figured heartwood. A long rotation crop that pairs well with intercropping in the early years.',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7, slug: 'mango', name: 'Mango',
    botanical: 'Mangifera indica', category: 'Fruit', price: 350,
    size: '3–4 ft', light: 'Full sun', water: 'Regular until established',
    soil: 'Well-drained loam', popular: true,
    description: 'Grafted mango saplings that begin bearing far sooner than seedling stock. Tell us your district and preferred variety and we will match rootstock to your soil and water availability.',
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8, slug: 'guava', name: 'Guava',
    botanical: 'Psidium guajava', category: 'Fruit', price: 240,
    size: '2–3 ft', light: 'Full sun', water: 'Moderate',
    soil: 'Tolerates a wide range',
    description: 'One of the quickest fruit trees to return a yield and forgiving of imperfect soil. A reliable choice for home gardens and small orchards alike.',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 9, slug: 'coconut', name: 'Coconut',
    botanical: 'Cocos nucifera', category: 'Fruit', price: 300,
    size: '3–5 ft', light: 'Full sun', water: 'High, consistent',
    soil: 'Sandy loam with good drainage',
    description: 'Tall and dwarf varieties available. Coconut needs dependable water through the establishment years but then delivers decades of steady income from a single planting.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 10, slug: 'areca-palm', name: 'Areca Palm',
    botanical: 'Dypsis lutescens', category: 'Indoor', price: 280,
    size: '2–4 ft', light: 'Bright indirect', water: 'Keep lightly moist',
    soil: 'Free-draining potting mix', popular: true,
    description: 'The dependable indoor palm for lobbies, offices and living rooms. Prefers bright indirect light and hates sitting in water — let the top inch of soil dry between waterings.',
    image: 'https://images.unsplash.com/photo-1523430118692-5f5dfc6f1ff8?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 11, slug: 'bougainvillea', name: 'Bougainvillea',
    botanical: 'Bougainvillea glabra', category: 'Flowering', price: 220,
    size: '2–3 ft', light: 'Full sun', water: 'Low — flowers better when dry',
    soil: 'Poor to average, well-drained',
    description: 'Prolific colour on compound walls, gates and pergolas with very little care. Counter-intuitively, it flowers hardest when kept slightly dry and unfertilised.',
    image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdcce?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 12, slug: 'hibiscus', name: 'Hibiscus',
    botanical: 'Hibiscus rosa-sinensis', category: 'Flowering', price: 160,
    size: '1.5–2 ft', light: 'Full sun', water: 'Regular',
    soil: 'Rich, well-drained',
    description: 'Continuous flowering through most of the year in Tamil Nadu conditions. Available in single and double forms across a range of colours.',
    image: 'https://images.unsplash.com/photo-1596438459194-f275f413d6ff?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 13, slug: 'jade-plant', name: 'Jade Plant',
    botanical: 'Crassula ovata', category: 'Indoor', price: 190,
    size: '1–1.5 ft', light: 'Bright indirect', water: 'Sparse — succulent',
    soil: 'Cactus / succulent mix',
    description: 'A near-indestructible succulent for desks and windowsills. The commonest way to kill one is overwatering, so err on the side of neglect.',
    image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 14, slug: 'money-plant', name: 'Money Plant',
    botanical: 'Epipremnum aureum', category: 'Indoor', price: 140,
    size: 'Trailing', light: 'Medium to low light', water: 'Moderate',
    soil: 'Any potting mix, or water',
    description: 'Grows happily in soil or in a plain bottle of water, and tolerates low light better than almost any other indoor plant. A good starting point for first-time plant owners.',
    image: 'https://images.unsplash.com/photo-1614594576068-98b03b6a5b20?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 15, slug: 'ficus', name: 'Ficus',
    botanical: 'Ficus benjamina', category: 'Indoor', price: 320,
    size: '2–4 ft', light: 'Bright indirect', water: 'Moderate',
    soil: 'Well-drained potting mix',
    description: 'A sculptural indoor tree for corners and entrances. Dislikes being moved — settle it in one spot with steady light and it will hold its leaves.',
    image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 16, slug: 'lemon', name: 'Lemon',
    botanical: 'Citrus limon', category: 'Fruit', price: 250,
    size: '2–3 ft', light: 'Full sun', water: 'Regular, never waterlogged',
    soil: 'Well-drained, slightly acidic',
    description: 'Grafted lemon suited to both large pots and open ground. Needs full sun and sharp drainage; standing water at the collar is the usual cause of failure.',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 17, slug: 'pongamia', name: 'Pongamia',
    botanical: 'Millettia pinnata', category: 'Native', price: 210,
    size: '2–3 ft', light: 'Full sun', water: 'Low once established',
    soil: 'Tolerates poor and saline soils',
    description: 'Known locally as Pungai. A nitrogen-fixing native used for avenue shade, land reclamation and oilseed. Handles drought and difficult soils with very little input.',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 19, slug: 'macadamia', name: 'Macadamia',
    botanical: 'Macadamia integrifolia', category: 'Fruit', price: 750,
    size: '2–3 ft', light: 'Full sun to partial shade', water: 'Regular, well spaced',
    soil: 'Deep, well-drained, slightly acidic', popular: true,
    description: 'Grafted macadamia nut saplings — a high-value orchard crop with strong and growing demand in India. Macadamia needs deep, free-draining soil, protection from strong wind, and patience: grafted trees typically begin bearing in their fourth to sixth year and keep producing for decades. We supply grafted stock rather than seedlings, because seedling macadamia is slow and unpredictable in nut quality.',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 18, slug: 'bamboo', name: 'Bamboo',
    botanical: 'Bambusa vulgaris', category: 'Shade', price: 275,
    size: '4–6 ft', light: 'Partial to full sun', water: 'Moderate to high',
    soil: 'Moist, well-drained',
    description: 'Fast-growing clumping bamboo for screens, windbreaks and riverbank stabilisation. Reaches usable height quickly and can be harvested on a short cycle.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80'
  }
];

// The previous build generated a fake three-photo "gallery" for every plant by
// borrowing photos of OTHER species. A customer opening the Mango gallery saw
// a coconut. Removed — a plant now shows only its own photo. When you have real
// photography, add a `gallery: [...]` array to any entry above.
export const plants = rawPlants.map(p => ({
  ...p,
  gallery: p.gallery && p.gallery.length ? p.gallery : [p.image]
}));

export const categories = ['All', 'Timber', 'Native', 'Shade', 'Fruit', 'Indoor', 'Flowering'];

// Accepts the numeric id (so old /plants/3 links keep working) or the slug
// (the new SEO-friendly /plants/teak links).
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
