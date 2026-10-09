// ==========================================
// WenzZTools — Service Worker v1.0
// ==========================================

const CACHE_NAME = 'wenzztools-v1';

// File yang di-cache pas install (biar bisa offline)
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/tools.html',
  '/login.html',
  '/loading.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/icon-48.png',
  '/icon-72.png',
  '/icon-96.png',
  '/icon-144.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png'
];

// ============================
// INSTALL — cache file utama
// ============================
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache satu-satu biar kalau ada 1 file gagal, yang lain tetep ke-cache
      return Promise.all(
        URLS_TO_CACHE.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.log('Gagal cache:', url, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// ============================
// ACTIVATE — hapus cache lama
// ============================
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          console.log('Hapus cache lama:', name);
          return caches.delete(name);
        })
      );
    })
  );
  self.clients.claim();
});

// ============================
// FETCH — cache first, network fallback
// ============================
self.addEventListener('fetch', function(event) {
  // Skip non-GET
  if (event.request.method !== 'GET') return;

  // Skip API calls (jangan di-cache)
  if (event.request.url.includes('/api/')) return;

  // Skip eksternal (CDN, dll)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      // Kalau ada di cache — pakai
      if (cached) return cached;

      // Kalau nggak ada — fetch dari network
      return fetch(event.request).then(function(response) {
        // Cuma cache response yang valid
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone response (karena stream cuma bisa dibaca sekali)
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      }).catch(function() {
        // Kalau offline & file nggak ada di cache
        // Fallback ke index.html
        return caches.match('/index.html');
      });
    })
  );
});

// ============================
// MESSAGE — handle command dari client
// ============================
self.addEventListener('message', function(event) {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
