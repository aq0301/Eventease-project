const CACHE_NAME = 'eventease-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/directory.html',
  '/updates.html',
  '/offline.html',
  '/style.css',
  '/script.js',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/speaker-placeholder-1.png',
  '/images/speaker-placeholder-2.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // For navigation requests -> network-first, fallback to cache, then offline page
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, resClone));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('/offline.html')))
    );
    return;
  }

  // For other requests -> cache-first
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(networkRes => {
        if (req.method === 'GET' && networkRes && networkRes.status === 200) {
          caches.open(CACHE_NAME).then(cache => cache.put(req, networkRes.clone()));
        }
        return networkRes;
      }).catch(() => caches.match('/offline.html'));
    })
  );
});
