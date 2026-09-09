// Minimal service worker. Its job is to make the site installable and to keep
// it usable on a bad connection — which matters a lot for customers browsing
// on mobile data in rural districts.
//
// Deliberately conservative: HTML is always fetched fresh (so price and stock
// changes appear immediately), and only build assets and images are cached.
const VERSION = 'gn-v2';
const SHELL = `${VERSION}-shell`;
const ASSETS = `${VERSION}-assets`;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(['/', '/brand/logo.png']))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // never touch Google Maps, fonts, etc.

  // Navigations: network first, fall back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(SHELL).then(c => c.put('/', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('/').then(r => r || Response.error()))
    );
    return;
  }

  // Hashed build assets and images: cache first, they never change in place.
  if (/\.(js|css|png|jpg|jpeg|webp|svg|woff2)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request).then(res => {
        const copy = res.clone();
        caches.open(ASSETS).then(c => c.put(request, copy)).catch(() => {});
        return res;
      }).catch(() => hit))
    );
  }
});
