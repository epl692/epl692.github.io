const CACHE_NAME = 'hole-depth-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Network-first for navigation and app shell files, cache-first elsewhere
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Always try network for navigation (index.html) and core assets
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/app.js') || url.pathname.endsWith('/style.css')) {
    event.respondWith(
      fetch(req).then(res => {
        // Update cache with latest
        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Default cache-first
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
