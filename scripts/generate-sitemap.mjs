// Generates dist/sitemap.xml from the real route list after every build, so it
// never drifts out of date. The old site had no sitemap at all.
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const BASE = 'https://ganeshnursery.co.in';

// Read slugs straight out of the data files rather than importing them, so this
// stays a plain Node script with no build-tool dependency.
const plantsSrc = readFileSync(resolve(root, 'src/data/plants.js'), 'utf8');
const contentSrc = readFileSync(resolve(root, 'src/data/content.js'), 'utf8');

const grabSlugs = src => [...src.matchAll(/slug:\s*'([^']+)'/g)].map(m => m[1]);

const SERVICE_SLUGS = ['garden-landscape-design', 'landscape-planning', 'vertical-gardens'];
const plantSlugs = grabSlugs(plantsSrc);
const blogSlugs = grabSlugs(contentSrc).filter(s => !SERVICE_SLUGS.includes(s));

const staticRoutes = [
  ['/', '1.0', 'weekly'],
  ['/plants', '0.9', 'weekly'],
  ['/services', '0.8', 'monthly'],
  ['/about', '0.7', 'monthly'],
  ['/blogs', '0.7', 'monthly'],
  ['/contact', '0.8', 'monthly'],
  ['/privacy-policy', '0.3', 'yearly'],
  ['/terms', '0.3', 'yearly'],
  ['/shipping-policy', '0.3', 'yearly'],
  ['/refund-policy', '0.3', 'yearly']
];

const today = new Date().toISOString().slice(0, 10);

const urls = [
  ...staticRoutes.map(([loc, priority, freq]) => ({ loc, priority, freq })),
  ...plantSlugs.map(slug => ({ loc: `/plants/${slug}`, priority: '0.7', freq: 'monthly' })),
  ...blogSlugs.map(slug => ({ loc: `/blogs/${slug}`, priority: '0.6', freq: 'monthly' }))
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${BASE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(resolve(root, 'dist/sitemap.xml'), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
