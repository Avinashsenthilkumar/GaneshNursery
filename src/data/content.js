// ============================================================================
// SITE CONTENT — clients, services, process, blog posts, testimonials.
// ============================================================================

// LOGO PERMISSION CHECK
// Displaying the marks of ISRO, BHEL, NHAI and named universities implies an
// endorsement. Make sure each is a genuine customer and that you are entitled
// to show their mark — several are government bodies with their own rules on
// logo use. Anything you cannot evidence should be removed, or reworded to
// "We have supplied saplings to" with names in plain text rather than logos.
export const clients = [
  { name: 'BHEL', logo: '/clients/bhel.png' },
  { name: 'Madhucon', logo: '/clients/madhucon.png' },
  { name: 'Bharathidasan University', logo: '/clients/bharathidasan-university.png' },
  { name: 'A2B Restaurants', logo: '/clients/a2b.png' },
  { name: 'NHAI', logo: '/clients/nhai.png' },
  { name: 'Annamalai University', logo: '/clients/annamalai-university.png' },
  { name: 'Baashyaam', logo: '/clients/baashyaam.png' },
  { name: 'ISRO', logo: '/clients/isro.png' }
];

export const services = [
  {
    slug: 'garden-landscape-design',
    title: 'Garden & Landscape Design',
    copy: 'Custom maintenance for all zones, seasonal pruning and fertilisation, pest and disease control, on weekly or monthly care plans.',
    image: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1000&q=80',
    icon: 'design',
    points: ['Site survey and soil assessment', 'Planting plan with species list', 'Ongoing seasonal maintenance']
  },
  {
    slug: 'landscape-planning',
    title: 'Modern Landscape Planning',
    copy: 'Advanced garden layouts, seasonal planting plans, complete landscape renovation and eco-friendly maintenance.',
    image: 'https://images.unsplash.com/photo-1558521958-0a228e77e984?auto=format&fit=crop&w=1000&q=80',
    icon: 'plan',
    points: ['Layouts for campuses and large plots', 'Phased renovation of existing gardens', 'Low-water, native-first planting']
  },
  {
    slug: 'vertical-gardens',
    title: 'Vertical Gardens & Green Walls',
    copy: 'Custom wall design, smart irrigation systems, and soil and water integration for tight urban spaces.',
    image: 'https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1000&q=80',
    icon: 'wall',
    points: ['Indoor and outdoor green walls', 'Drip and automated irrigation', 'Maintenance contracts available']
  }
];

export const process = [
  ['01', 'Tell us what you need', 'Share your site, quantity and timeline'],
  ['02', 'We get back to you', 'Usually the same working day on WhatsApp'],
  ['03', 'Site visit or species plan', 'We match species to your soil and water'],
  ['04', 'Supply and follow-up', 'Delivery, planting guidance and aftercare']
];

// ---------------------------------------------------------------------------
// BLOG — posts now have slugs and full bodies so /blogs/<slug> is a real page.
// Previously every "Read more" pointed back at the blog index, which is a dead
// end for readers and gives search engines nothing to index.
// ---------------------------------------------------------------------------
export const blogs = [
  {
    slug: 'african-blackwood',
    lang: 'en',
    title: 'African Blackwood',
    subtitle: 'Features of African Blackwood',
    date: '2026-02-10',
    // Was a hot-linked Unsplash photograph of a leopard, served from a
    // third-party CDN on every page load. Now a real cut face of the timber —
    // which is the whole argument of the article, since blackwood is bought for
    // the colour and density of that heartwood and nothing else.
    image: '/blogs/african-blackwood.jpg',
    excerpt: 'Dalbergia melanoxylon is an important timber species used for fine furniture, musical instruments, sculptures and specialty woodwork, valued for its dense, durable timber and slow-growing nature.',
    body: [
      'Dalbergia melanoxylon, known in the trade as African Blackwood, produces one of the densest and most durable timbers available anywhere. Its heartwood is close to black, takes a fine polish, and machines cleanly enough to be the standard choice for clarinets, oboes and bagpipe chanters.',
      'It is a slow grower, and that is the whole point. The density that makes the timber valuable is a direct result of the tree laying down wood slowly over many years. Anyone planting it should be thinking in decades rather than seasons, and planning intercropping or a companion species for the early years.',
      'In Tamil Nadu conditions it does best in full sun on free-draining soil. It is drought tolerant once the root system is away, but the first two seasons need protection from grazing and from weed competition. This is where most plantation failures actually happen — not later.',
      'If you are considering blackwood as a long-horizon planting, talk to us about spacing, companion species and realistic timelines before you commit land to it. We would rather give you an honest picture than sell you saplings that do not suit your site.'
    ]
  },
  {
    slug: 'karungali-marathin-mukkiyathuvam',
    lang: 'ta',
    title: 'கருங்காலி மரத்தின் முக்கியத்துவம்',
    subtitle: 'நீடித்த பசுமைக்கான மரத் தேர்வு',
    date: '2026-01-22',
    // Was a hot-linked stock photo of ferns. Now the cut face of real karungali:
    // the jet-black heartwood ringed by pale sapwood, which is what buyers are
    // actually paying for and what a photograph of foliage can never show.
    image: '/blogs/karungali.jpg',
    excerpt: 'கருங்காலி போன்ற விலைமதிப்புள்ள மர வகைகள், நீண்டகால நிழல், சுற்றுச்சூழல் பாதுகாப்பு மற்றும் எதிர்கால பொருளாதார மதிப்பை உருவாக்க உதவுகின்றன.',
    body: [
      'கருங்காலி போன்ற விலைமதிப்புள்ள மர வகைகள், நீண்டகால நிழல், சுற்றுச்சூழல் பாதுகாப்பு மற்றும் எதிர்கால பொருளாதார மதிப்பை உருவாக்க உதவுகின்றன.',
      'நல்ல நாற்று, நல்ல பராமரிப்பு, நல்ல வளர்ச்சி — இந்த மூன்றும் ஒன்றாக இருந்தால் மட்டுமே ஒரு மரத் தோட்டம் வெற்றி பெறும். நாற்று தேர்வில் செய்யும் சிறு தவறு, பத்து ஆண்டுகளுக்குப் பிறகு பெரிய இழப்பாக மாறும்.',
      'உங்கள் நிலத்தின் மண் வகை, நீர் வசதி மற்றும் காலநிலைக்கு ஏற்ற மர வகைகளைத் தேர்ந்தெடுக்க எங்கள் குழு உதவும். WhatsApp மூலம் தொடர்பு கொள்ளுங்கள்.'
    ]
  }
];

export const findBlog = slug => blogs.find(b => b.slug === slug);

// ---------------------------------------------------------------------------
// TESTIMONIALS — deliberately empty.
//
// The previous build shipped six invented quotes with invented names,
// attributed to real, identifiable organisations (NHAI, Annamalai University).
// Publishing fabricated endorsements from named bodies is a genuine legal and
// reputational risk, not just a to-do note — and the homepage was computing a
// "4.8 / 5 rated" badge from them and showing it as if it were real.
//
// Collect real ones instead. Fastest route: after each delivery, WhatsApp the
// customer asking for two lines plus permission to use their name. Paste them
// in below and every testimonial section on the site switches itself back on:
//
//   { name: 'R. Elangovan', role: 'Site Manager, XYZ', rating: 5,
//     quote: 'Their words, not ours.' }
// ---------------------------------------------------------------------------
export const testimonials = [];
