import { site } from './site.js';

export const WA_NUMBER = site.whatsapp;

// ============================================================================
// PLANT CATALOGUE — Ganesh Nursery 2026 price list
//
// SHAPE OF THE DATA
//
// Each plant carries:
//   images[]   1 primary photo plus up to 4 supporting shots (MAX_IMAGES).
//   variants[] one row per height sold, each with its own price AND its own
//              optional images[] — so choosing "4 ft" shows the 4 ft tree
//              rather than a generic photo of the species.
//
// That second point is the whole reason this file is structured the way it is.
// Nearly every species here sells at several heights at very different prices
// (Khaya runs ₹75 to ₹585 across eight sizes), and a customer buying a 7 ft
// tree should not be looking at a photo of a seedling.
//
// `cost` is the list price; `offer` is the discounted price where the printed
// list shows one. The lowest effective price becomes the "from ₹X" on a card,
// so that figure always matches a real row in the table beneath it.
//
// ⚠️  VARIANT PHOTO MAPPING follows the filenames already in /public/plants
//     (khaya-4ft.jpg → the 4 ft row, and so on). Worth spot-checking once in
//     the admin panel that each really is the height its name claims.
//
// ⚠️  MAGILAM is in the photo folder but NOT on the 2026 price list, so it is
//     published with no price and reads "Price on request". Add its heights
//     and prices in the admin panel when you have them.
//
// The printed list states prices are valid for 10 days — surfaced on the site
// from site.priceValidityNote.
// ============================================================================

export const MAX_IMAGES = 5;

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
    highlights: [
      'Fastest height gain of any timber we grow',
      'Eight sizes in stock — start small or plant tall',
      'Seed from 70-year Candidate Plus Trees'
    ],
    planting: 'Space 8 to 10 ft apart for a timber block, or 12 ft as an avenue. Dig a 2 ft pit, mix in well-rotted manure and plant with the collar level with the soil. The taller grades in 14–17 kg bags carry enough root to go straight into open ground at the start of the monsoon.',
    care: 'Water twice weekly through the first summer, then monthly once away. Keep a 3 ft weed-free circle for the first two years — competition at that stage costs more growth than anything you do later. Single-stem prune in year two to keep the bole straight and clear.',
    uses: 'Furniture, plywood, joinery and boat building. The timber is stable, works cleanly and takes a polish well, which is why it is increasingly planted as a teak alternative on a shorter rotation.',
    images: [
      '/plants/khaya-senegalensis.jpg',
      '/plants/khaya-5-6ft.jpg',
      '/plants/khaya-4ft.jpg',
      '/plants/khaya-2ft.jpg',
      '/plants/khaya-1ft.jpg'
    ],
    variants: [
      { size: '1 ft', age: '8 months', bag: '3 kg', cost: 100, offer: 75, images: ['/plants/khaya-1ft.jpg'] },
      { size: '2–2.5 ft', age: '1 year', bag: '4 kg', cost: 165, offer: 110, images: ['/plants/khaya-2ft.jpg'] },
      { size: '2.5–3 ft', age: '1 year', bag: '2 kg', cost: 225, offer: 168, images: ['/plants/khaya-2-5ft.jpg'] },
      { size: '4 ft', age: '1–1.5 years', bag: '4 kg', cost: 325, offer: 243, images: ['/plants/khaya-4ft.jpg'] },
      { size: '5 ft', age: '1.5–2 years', bag: '4 kg', cost: 375, offer: 280 },
      { size: '6 ft', age: '1.5–2 years', bag: '4 kg', cost: 450, offer: 337 },
      { size: '5–6 ft', age: '2 years', bag: '14–17 kg', cost: 650, offer: 488, images: ['/plants/khaya-5-6ft.jpg'] },
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
    description: 'Red sanders — a high-value, slow-growing timber native to the Eastern Ghats and well suited to dry, gravelly ground. Seed sourced from Kadapa, Chittoor and Thirumala.',
    highlights: [
      'Among the highest-value timbers grown in India',
      'Thrives on dry, poor, gravelly ground',
      'Seed from the Kadapa–Chittoor–Thirumala belt'
    ],
    planting: 'Plant 10 ft apart on red or gravelly soil that drains sharply. Red sandal resents waterlogging more than drought — a low spot that holds water through the monsoon will kill it. Plant at the start of the rains and stake the taller grades against wind.',
    care: 'Water through the first two summers only; after that it wants to be left alone. No heavy fertiliser — rich soil produces fast, pale, low-value wood. The colour and density that make this timber valuable come from slow growth on hard ground.',
    uses: 'Carving, musical instruments, furniture and traditional dye. A long-horizon crop measured in decades, not years.',
    notice: 'Red sandal is a protected species. Harvest, transport and sale are regulated — check the rules that apply in your state before planting at scale. We can talk you through what is involved.',
    images: ['/plants/red-sandal.jpg', '/plants/red-sandal-3ft.jpg'],
    variants: [
      { size: '3 ft', age: '1 year', bag: '4 kg', cost: 150, images: ['/plants/red-sandal-3ft.jpg'] },
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
    description: 'Straight-stemmed timber valued for furniture and plywood, and the most affordable way into a timber plantation on this list — a 3–4 ft sapling starts at ₹75. Grows well as a boundary or block planting across most of Tamil Nadu.',
    highlights: [
      'Lowest entry price of any timber we sell',
      'Naturally straight stem, little pruning needed',
      'Seed from 35-year Shimoga mother trees'
    ],
    planting: 'Space 10 ft apart in a block, or 8 ft along a boundary. Adaptable to most soils that do not hold water. Plant with the first good rain and firm the soil well around the root ball.',
    care: 'Regular water for the first year, then only through dry spells. Remove side shoots below chest height in year two so the bole runs clean and straight for the first log.',
    uses: 'Furniture, plywood, cabinet work and panelling. Reliable demand and easy to sell locally, which makes it a sensible first plantation crop.',
    images: [],
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
    highlights: [
      'True Ceylon ebony, not a substitute species',
      'Jet-black heartwood, exceptionally dense',
      'Strong traditional and ritual demand'
    ],
    planting: 'Space 10 to 12 ft apart on ground that drains well. Karungali is slow from the start, so give it a clean, weed-free circle and protect it from grazing for the first three years — losses almost always happen early.',
    care: 'Water through the first two summers, then sparingly. Very little pruning needed. Patience is the main input: this is a tree you plant for the next generation as much as your own.',
    uses: 'Carving, walking sticks, musical instruments, temple and ritual articles. Karungali holds a cultural value beyond its timber price, and demand consistently outruns supply.',
    images: ['/plants/karungali.jpg', '/plants/karungali-4ft.jpg', '/plants/karungali-2ft.jpg', '/plants/karungali-2.jpg'],
    variants: [
      { size: '2 ft', age: '1 year', bag: '5–7 kg', cost: 300, images: ['/plants/karungali-2ft.jpg'] },
      { size: '4 ft', bag: '5–7 kg', cost: 700, images: ['/plants/karungali-4ft.jpg'] }
    ]
  },
  {
    id: 5, slug: 'african-blackwood',
    name: 'African Blackwood', tamil: 'ஆப்பிரிக்க கருங்காலி',
    botanical: 'Dalbergia melanoxylon', category: 'Timber',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained sandy loam',
    description: 'One of the densest and most durable timbers available anywhere, and the standard choice for clarinets, oboes and fine carving. A slow grower by nature — that slowness is exactly what builds the density.',
    highlights: [
      'Among the densest timbers in the world',
      'The standard wood for woodwind instruments',
      'Tolerates dry, sandy ground well'
    ],
    planting: 'Space 10 ft apart on free-draining sandy loam. Plant at the start of the monsoon. Slow to establish, so keep the planting circle clean and guard against grazing in the early years.',
    care: 'Minimal water once away, and minimal fertiliser. Like Karungali, forcing growth with rich soil works against the density that gives the timber its value.',
    uses: 'Clarinets, oboes, bagpipe chanters, fine carving and inlay. A specialist timber with a small but consistently high-paying market.',
    images: ['/plants/african-blackwood.jpg', '/plants/african-blackwood-3ft.jpg'],
    variants: [
      { size: '1 ft', bag: '1 kg', cost: 250 },
      { size: '2 ft', bag: '1 kg', cost: 350 },
      { size: '3 ft', bag: '2 kg', cost: 400, images: ['/plants/african-blackwood-3ft.jpg'] }
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
    highlights: [
      'KFRI seed — the benchmark Indian teak provenance',
      'Stem age 1.5 years, so it establishes fast',
      'Naturally termite and weather resistant'
    ],
    planting: 'Space 8 to 10 ft apart on deep soil that drains well. Teak wants depth more than richness — a shallow or rocky site will stunt it however well you feed it. Plant with the first reliable rain.',
    care: 'Water through the first two summers. Weed the circle religiously for two years. Prune the lower branches in years two and three to build a clean, knot-free bole, which is where most of the eventual value sits.',
    uses: 'The benchmark furniture and construction timber of South India. Doors, windows, boat building and joinery, with demand that has held for generations.',
    images: ['/plants/nilambur-teak.jpg'],
    variants: [
      { size: '1 ft', age: '1 year, stem age 1.5 years', bag: '4 kg', cost: 100, note: 'Seed from 70-year mother tree', images: ['/plants/nilambur-teak.jpg'] },
      { size: '1.5–2 ft', age: '1 year, stem age 1.5 years', bag: 'Cocopeat bag', cost: 200, note: 'Seed from 80–90 year mother tree' }
    ]
  },
  {
    id: 7, slug: 'burma-teak',
    name: 'Burma Teak', tamil: 'பர்மா தேக்கு',
    botanical: 'Tectona grandis', category: 'Timber',
    light: 'Full sun', water: 'Moderate in first 2 years', soil: 'Deep, well-drained',
    description: 'Burma teak provenance, prized for tight, even grain and colour. Supplied at 1 ft in a 4 kg bag.',
    highlights: [
      'Burma provenance — tighter, more even grain',
      'Deeper, more uniform colour than local teak',
      'Same hardiness as any good teak'
    ],
    planting: 'As Nilambur teak: 8 to 10 ft spacing on deep, free-draining soil, planted with the first reliable rain of the season.',
    care: 'Water through the first two summers, keep the circle weed-free for two years, and prune the lower branches early to build a clean bole.',
    uses: 'Premium furniture, panelling and joinery where grain and colour matter as much as strength.',
    images: ['/plants/burma-teak.jpg'],
    variants: [
      { size: '1 ft', age: '1 year', bag: '4 kg', cost: 198, images: ['/plants/burma-teak.jpg'] }
    ]
  },
  {
    id: 8, slug: 'venghai',
    name: 'Venghai', tamil: 'வேங்கை',
    botanical: 'Pterocarpus marsupium', category: 'Timber',
    seedSource: 'Topslip', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Low once established', soil: 'Well-drained',
    description: 'Indian Kino tree — a strong, durable native timber also valued in traditional medicine. Seed from Topslip. Supplied as a large 7–8 ft tree in a 10–12 kg bag, so it is well past the vulnerable establishment stage on arrival.',
    highlights: [
      'Supplied large at 7–8 ft — past the risky stage',
      'Hardy native, very low maintenance',
      'Timber and traditional medicine value both'
    ],
    planting: 'Space 12 ft apart. At 7–8 ft the tree is already substantial, so dig a generous pit, stake it against wind for the first season and water it in thoroughly.',
    care: 'Regular water for the first season while the roots take, then very little. A genuinely tough native once established.',
    uses: 'Furniture, cabinet work and agricultural implements. The heartwood and bark are also used in traditional medicine, notably for Kino gum.',
    images: ['/plants/venghai.jpg'],
    variants: [
      { size: '7–8 ft', bag: '10–12 kg', cost: 650, images: ['/plants/venghai.jpg'] }
    ]
  },
  {
    id: 9, slug: 'rosewood',
    name: 'Rosewood', tamil: 'ஈட்டி / ரோஸ்வுட்',
    botanical: 'Dalbergia sissoo', category: 'Timber',
    seedSource: 'Shimoga', motherTree: '35-year CPT trees',
    light: 'Full sun', water: 'Moderate', soil: 'Deep, well-drained',
    description: 'A premium furniture timber with dark, richly figured heartwood. A long rotation crop that intercrops well in the early years while the canopy is still open.',
    highlights: [
      'Dark, richly figured premium furniture timber',
      'Intercrops well while the canopy is still open',
      'Nitrogen-fixing — improves the soil it grows in'
    ],
    planting: 'Space 10 ft apart on deep soil. The open early canopy means you can crop between the rows for the first three or four years, which offsets the wait.',
    care: 'Moderate water through the first two years. Prune lower branches in year two. Being a legume it fixes its own nitrogen, so go easy on fertiliser.',
    uses: 'High-end furniture, musical instruments, carving and veneer. One of the most consistently sought-after timbers in the Indian market.',
    images: ['/plants/rosewood.jpg'],
    variants: [
      { size: '3–4 ft', age: '1–1.5 years', bag: '4 kg', cost: 100, images: ['/plants/rosewood.jpg'] },
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
    highlights: [
      'Marayur provenance — the most sought-after in India',
      'Needs a host plant: we advise on the pairing',
      'Among the highest-value crops per acre'
    ],
    planting: 'Sandalwood is a hemi-parasite: it draws nutrients through the roots of a host and will not thrive alone. Plant a long-term host such as red sandal, pongamia or casuarina within 3 to 5 ft of each sapling, and a short-term host like pigeon pea at planting. Space sandal 10 ft apart on free-draining ground.',
    care: 'Light, regular water in the first two years but never waterlogged. Keep the host healthy — if the host fails the sandal follows. Plantations need to be registered and protected; talk to us about both before committing land.',
    uses: 'Heartwood oil for perfumery, carving and religious use. Heartwood forms slowly and the value is concentrated in it, so this is a 15-year-plus crop, not a quick return.',
    notice: 'Most failed sandalwood plantings fail for one reason: no host plant, or the wrong one. Ask us before you buy — it costs nothing and it is the difference between a crop and a loss.',
    images: [
      '/plants/sandalwood.jpg',
      '/plants/sandalwood-2ft.jpg',
      '/plants/sandalwood-1ft.jpg',
      '/plants/sandalwood-sapling.jpg'
    ],
    variants: [
      { size: '1–1.5 ft', age: '8 months', bag: '1 kg', cost: 100, images: ['/plants/sandalwood-1ft.jpg'] },
      { size: '3 ft', age: '1.5–2 years', bag: '7 kg', cost: 325, offer: 275, images: ['/plants/sandalwood-2ft.jpg'] }
    ]
  },
  {
    id: 23, slug: 'magilam',
    name: 'Magilam', tamil: 'மகிழம்',
    botanical: 'Mimusops elengi', category: 'Timber',
    light: 'Full sun to partial shade', water: 'Moderate', soil: 'Adaptable, well-drained',
    description: 'Magilam — the Spanish cherry, grown as much for its intensely fragrant cream flowers as for its hard, durable timber. A dense evergreen that makes an excellent avenue and temple tree, and one of the few that tolerates coastal conditions well.',
    highlights: [
      'Intensely fragrant flowers, used in garlands',
      'Dense evergreen shade, holds leaf year round',
      'Tolerates coastal and urban conditions'
    ],
    planting: 'Space 15 to 20 ft apart as an avenue tree — the crown spreads wide and dense. Adaptable to most soils that drain. Plant with the monsoon and water in well.',
    care: 'Moderate water for the first two years, then little. Slow growing but very long lived, and needs almost no attention once established.',
    uses: 'Flowers for garlands and perfumery; the hard, close-grained timber for construction and cabinet work. Widely planted around temples and in avenues.',
    images: ['/plants/magilam.jpg'],
    // No price on the 2026 list — published as "price on request" rather than
    // with an invented figure. Add heights and prices in the admin panel.
    variants: []
  },

  // ─── FRUIT ───────────────────────────────────────────────────────────────
  {
    id: 11, slug: 'macadamia',
    name: 'Macadamia', tamil: 'மக்கடாமியா',
    botanical: 'Macadamia integrifolia', category: 'Fruit',
    light: 'Full sun to partial shade', water: 'Regular, well spaced',
    soil: 'Deep, well-drained, slightly acidic',
    popular: true,
    description: 'A high-value orchard crop with strong and growing demand in India. Macadamia needs deep, free-draining soil and protection from strong wind, and generally begins bearing in its fourth to sixth year.',
    highlights: [
      'One of the highest-value nut crops in the world',
      'Growing Indian demand, very little local supply',
      'Bears from year four to six'
    ],
    planting: 'Space 20 to 25 ft apart on deep, free-draining, slightly acidic soil. Shelter from strong wind matters — the branches are brittle and a young tree can be broken open by a single storm. Plant in a pit enriched with compost.',
    care: 'Regular, well-spaced water; macadamia dislikes both drought and waterlogging. Mulch heavily, as the roots run shallow. Feed lightly and often rather than heavily and rarely.',
    uses: 'Dessert nuts, confectionery and cold-pressed oil. A long-term orchard crop that rewards a site chosen carefully.',
    notice: 'Macadamia is site-sensitive. Talk to us about your soil, water and wind exposure before committing land to it — it is not a crop to plant hopefully.',
    images: ['/plants/macadamia.jpg'],
    variants: [
      { size: '1 ft', bag: '4 kg', cost: 750, offer: 600, images: ['/plants/macadamia.jpg'] }
    ]
  },
  {
    id: 12, slug: 'imampasand-mango',
    name: 'Imampasand Mango', tamil: 'இமாம்பசந்து மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    popular: true,
    description: 'Imampasand — a premium South Indian table mango with a thin skin, almost no fibre and an intense aroma. Supplied as a large grafted plant at 5–6 ft in a 15 kg bag, so it fruits years earlier than seedling stock.',
    highlights: [
      'Premium table mango — thin skin, no fibre',
      'Grafted, so it fruits years earlier',
      'Supplied large at 5–6 ft in a 15 kg bag'
    ],
    planting: 'Space 25 to 30 ft apart. Dig a 3 ft pit and fill with topsoil mixed with well-rotted manure. Keep the graft union above soil level — burying it is the commonest planting mistake and it undoes the whole point of grafted stock.',
    care: 'Regular water until established, then deep watering at flowering and fruit set. Prune after harvest to keep the canopy open. Watch for hoppers at flowering.',
    uses: 'A dessert mango grown for the table, not the pulp factory. Commands a premium in local markets where it is known.',
    images: ['/plants/mango.jpg'],
    variants: [
      { size: '5–6 ft', bag: '15 kg', cost: 350, images: ['/plants/mango.jpg'] }
    ]
  },
  {
    id: 13, slug: 'panganapalli-mango',
    name: 'Panganapalli Mango', tamil: 'பங்கனப்பள்ளி மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    description: 'Banganapalli — the big, golden, mildly sweet mango that anchors most commercial orchards in the south. Reliable bearer and an easy seller. Grafted, supplied at 5–6 ft.',
    highlights: [
      'The commercial workhorse of South Indian orchards',
      'Large, golden fruit with reliable market demand',
      'Grafted and supplied at 5–6 ft'
    ],
    planting: 'Space 25 to 30 ft apart on well-drained loam. Dig a generous pit, enrich with manure, and keep the graft union clear of the soil.',
    care: 'Regular water until established, then deep irrigation at flowering and fruit set. Prune after harvest. Reliable and forgiving compared to most table varieties.',
    uses: 'Table fruit and the mainstay of commercial mango marketing in the south. Easy to sell in volume.',
    images: ['/plants/mango-panganapalli.jpg'],
    variants: [
      { size: '5–6 ft', cost: 350, images: ['/plants/mango-panganapalli.jpg'] }
    ]
  },
  {
    id: 14, slug: 'kili-mooku-mango',
    name: 'Kili Mooku Mango', tamil: 'கிளிமூக்கு மாம்பழம்',
    botanical: 'Mangifera indica', category: 'Fruit',
    light: 'Full sun', water: 'Regular until established', soil: 'Well-drained loam',
    description: 'Kili Mooku — named for the parrot-beak curve of the fruit. A firm, aromatic traditional Tamil Nadu variety that holds its shape well when cut. Grafted, supplied at 5–6 ft.',
    highlights: [
      'Traditional Tamil Nadu variety, parrot-beak shaped',
      'Firm flesh that holds its shape when cut',
      'Grafted and supplied at 5–6 ft'
    ],
    planting: 'Space 25 to 30 ft apart. Generous pit, well-rotted manure, graft union kept above the soil line.',
    care: 'Regular water until established, deep irrigation at flowering and fruit set, and a light prune after harvest to keep the canopy open.',
    uses: 'Table fruit with a loyal regional following. Firm flesh makes it a good choice for pickling as well as eating fresh.',
    images: [],
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
    highlights: [
      'Round, apple-shaped fruit with firm flesh',
      'A good size for a home garden',
      'Grafted, supplied at 3 ft'
    ],
    planting: 'Space 25 ft apart, or give a single garden tree plenty of open room. Keep the graft union above soil level.',
    care: 'Regular water until established, then deep watering at flowering and fruit set. Prune after harvest.',
    uses: 'Table fruit, particularly popular as a home-garden variety where its compact fruit and reliable bearing suit a single tree.',
    images: [],
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
    highlights: [
      'Bears heavily and nearly year round',
      'Works in a large pot or in open ground',
      'Quick to start — fruit within two to three years'
    ],
    planting: 'Space 12 to 15 ft apart in open ground, or use a 24-inch pot with free-draining mix. Plant slightly proud of the surrounding soil so water never sits at the collar.',
    care: 'Regular water but never waterlogged — collar rot from standing water kills more lemons than anything else. Feed every two months through the growing season. Prune out dead and crossing wood to keep the centre open.',
    uses: 'Juice, pickling and daily kitchen use. Steady local demand and a quick return compared to most tree crops.',
    images: [],
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
    highlights: [
      'The standard juice citrus of Tamil Nadu',
      'Steady commercial demand from juice vendors',
      'Bears within three to four years'
    ],
    planting: 'Space 15 to 18 ft apart on well-drained loam. Plant slightly raised so water drains away from the collar.',
    care: 'Steady water through flowering and fruiting, easing off afterwards. Feed every two months in the growing season and keep the canopy centre open.',
    uses: 'Juice, overwhelmingly. Reliable demand wherever there are juice vendors, which is most of Tamil Nadu.',
    images: [],
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
    highlights: [
      'Hardy native — thrives with almost no care',
      'Shade tree and fruit crop in one',
      'Among the cheapest trees on the list'
    ],
    planting: 'Space 25 to 30 ft apart; the crown gets large. Adaptable to most soils including heavy ones, and tolerates seasonal waterlogging better than most fruit trees.',
    care: 'Water through the first summer, then leave it alone. Genuinely low-maintenance and very long lived.',
    uses: 'Seasonal fruit, valued in traditional medicine for its seed. Also planted widely for shade along field bunds and avenues.',
    images: [],
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
    highlights: [
      'Grafted — bears sooner and true to type',
      'Dependable, low-maintenance orchard tree',
      'Fruits over a long season'
    ],
    planting: 'Space 20 to 25 ft apart on well-drained ground. Keep the graft union above soil level.',
    care: 'Moderate, regular water. Very little pruning needed beyond removing dead wood. One of the easier orchard trees to keep.',
    uses: 'Table fruit with a long bearing season and steady local demand. A good choice where reliability matters more than a premium price.',
    images: [],
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
    highlights: [
      'The Panruti belt variety — firm, sweet bulbs',
      'Produces for decades from one planting',
      'Supplied large at 5–6 ft'
    ],
    planting: 'Space 30 ft apart — jackfruit gets very large. Deep, well-drained soil and a generous pit. Water in thoroughly at planting.',
    care: 'Moderate water for the first two years, then little. Remove dead wood; otherwise leave it be. Fruit is borne on the trunk and main branches, so do not over-prune them.',
    uses: 'Ripe fruit for the table, unripe for cooking, seeds roasted. Timber from old trees is valuable in its own right.',
    images: [],
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
    highlights: [
      'The standard commercial guava variety',
      'Quick to fruit — a yield within two years',
      'Forgiving of poor soil'
    ],
    planting: 'Space 12 to 15 ft apart. Tolerates a wide range of soils, which makes it a good choice for ground that will not carry a fussier crop.',
    care: 'Moderate water. Prune after each harvest to keep the tree low and productive — guava fruits on new growth, so regular pruning directly raises the yield.',
    uses: 'Table fruit and processing. Fast to return, heavy bearing, and easy to sell.',
    images: ['/plants/koyya-l49.jpg'],
    variants: [
      { size: '5 ft', bag: '7 kg', cost: 150, images: ['/plants/koyya-l49.jpg'] }
    ]
  },
  {
    id: 22, slug: 'sevvilaneer-coconut',
    name: 'Sevvilaneer Coconut', tamil: 'செவ்விளநீர்',
    botanical: 'Cocos nucifera', category: 'Fruit',
    light: 'Full sun', water: 'High, consistent', soil: 'Sandy loam with good drainage',
    description: 'Orange dwarf tender coconut — the sweet, orange-husked variety grown for drinking rather than copra. Starts bearing much earlier and much lower than a tall, which makes harvesting far easier.',
    highlights: [
      'Orange dwarf — grown for tender water, not copra',
      'Bears early and low, so harvesting is easy',
      'Strong roadside and urban demand'
    ],
    planting: 'Space 20 ft apart on sandy loam that drains. Dig a 3 ft pit, part-fill with topsoil and compost, and plant so the collar sits just above ground level.',
    care: 'Needs dependable water through the establishment years — this is not a crop for land without irrigation. Feed with organic manure and common salt twice a year.',
    uses: 'Tender coconut water, sold fresh. Higher and steadier margins than copra, especially near a road or a town.',
    images: ['/plants/sevvilaneer.jpg'],
    variants: [
      { size: '1.5 ft', bag: '10 kg', cost: 350, images: ['/plants/sevvilaneer.jpg'] }
    ]
  }
];

// ---------------------------------------------------------------------------
// Derived fields.
//
// `price` is the cheapest a customer can actually pay, so the "from ₹X" on a
// card always matches a real row in the table below it. A plant with no priced
// variant (Magilam) ends up with price === null and reads "Price on request"
// everywhere, rather than crashing or showing ₹0.
// ---------------------------------------------------------------------------
function effective(v) {
  return v.offer ?? v.cost;
}

/** Images to show for a plant when a particular size is selected.
 *  The size's own photos come first, then the plant's general ones, deduped
 *  and capped — so choosing "4 ft" leads with the 4 ft tree but you can still
 *  swipe to the other angles. */
export function galleryFor(plant, variant) {
  const out = [];
  const push = src => {
    if (src && !out.includes(src) && out.length < MAX_IMAGES) out.push(src);
  };
  (variant?.images || []).forEach(push);
  (plant?.images || []).forEach(push);
  return out;
}

export const plants = rawPlants.map(p => {
  const variants = (p.variants ?? []).map(v => ({ ...v, images: v.images ?? [] }));
  const images = (p.images ?? []).slice(0, MAX_IMAGES);
  const prices = variants.map(effective).filter(n => Number.isFinite(n));
  const lowest = prices.length ? Math.min(...prices) : null;
  const highest = prices.length ? Math.max(...prices) : null;
  const cheapest = variants.find(v => effective(v) === lowest);

  return {
    ...p,
    images,
    variants,
    price: lowest,
    priceHigh: highest,
    // Shown struck through beside the price, but only when the cheapest option
    // is genuinely discounted — never invent a "was" figure.
    mrp: cheapest && cheapest.offer && cheapest.cost > cheapest.offer ? cheapest.cost : null,
    size: variants.length
      ? (variants.length === 1 ? variants[0].size : `${variants[0].size} – ${variants[variants.length - 1].size}`)
      : '',
    bag: variants.length === 1 ? variants[0].bag : undefined,
    age: variants.length === 1 ? variants[0].age : undefined,
    sizeCount: variants.length,
    // Kept for anything still reading the old single-image field.
    image: images[0] ?? null,
    gallery: images
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
