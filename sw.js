/* Investly service worker — enkel network-first med offline-fallback.
   Gør appen installerbar (PWA) og lader den åbne uden net efter første besøg. */
const CACHE = 'investly-v53';
const CORE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Sidenavigation (adressefeltet, genindlæsning, delt link) skal altid ende
  // i app-skallen. Appen bruger rigtige stier som /account-choice, men GitHub
  // Pages er statisk og svarer 404 på dem. Et 404 ER et gyldigt svar, så det
  // udløser ikke .catch() — derfor tjekkes res.ok eksplicit her.
  const erNavigation = req.mode === 'navigate';

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (erNavigation && !res.ok) {
          return caches.match('./index.html').then((skal) => skal || res);
        }
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((cached) => cached || caches.match('./index.html')))
  );
});
