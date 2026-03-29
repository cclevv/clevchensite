const CACHE_NAME = 'coins-game-v1';
const URLS_TO_CACHE = [
  '/',
  '/learn',
  '/play/pay',
  '/play/change',
  '/backgroungnew.png',
  '/learn.png',
  '/shop.png',
  '/change.png',
  '/favicon.svg',
  '/coins/tena.png',
  '/coins/fiftya.png',
  '/coins/oneshekel.png',
  '/coins/twoshekel.png',
  '/coins/fiveshekel.png',
  '/coins/tenshekel.png',
  '/coins/10ag.jpg',
  '/coins/50ag.jpg',
  '/coins/1nis.jpg',
  '/coins/2nis.jpg',
  '/coins/5nis.jpg',
  '/coins/10nis.jpg',
  '/mascot/mascotidle.png',
  '/mascot/mascothappy.png',
  '/mascot/mascotthink.png',
  '/mascot/mascotpoints.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation requests (HTML pages): network-first, fall back to cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }
  // Static assets: cache-first, fall back to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
