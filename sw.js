// Tusome KCSE — Service Worker v2
const CACHE = 'tusome-v2';
const ASSETS = [
  "/",
  "/index.html",
  "/02-dashboard.html",
  "/03-scout.html",
  "/04-guardian.html",
  "/05-hunter.html",
  "/06-quiz.html",
  "/07-profile.html",
  "/app.js",
  "/style.css",
  "/favicon.svg",
  "/manifest.json",
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600&display=swap"
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — cache first, network fallback
self.addEventListener('fetch', e => {
  // Skip non-GET and cross-origin API calls
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('api.anthropic.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if(cached) return cached;
      return fetch(e.request).then(res => {
        if(res && res.status === 200 && res.type !== 'opaque'){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // Offline fallback for HTML pages
        if(e.request.destination === 'document'){
          return caches.match('/02-dashboard.html');
        }
      });
    })
  );
});
