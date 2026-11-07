/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v180';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-BXkzWpvd.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-ClPj68xs.js",
  "./assets/CommercialDisclosure-oVCARBud.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-C7dayAXD.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-DtKdL7iL.js",
  "./assets/GuideLink-BMRYbEJ3.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/StageProgressButton-vfzunGCW.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-DYNa6pWM.js",
  "./assets/calendar-days-DEjSEQHK.js",
  "./assets/chevron-up-BcaTlAGX.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-DI73TOkY.js",
  "./assets/index-BJFBnnZb.js",
  "./assets/index-fdCfNXz_.css",
  "./assets/layers-Bhv1ZNyS.js",
  "./assets/opening-heading-BVxh9UMO.css",
  "./assets/opening-heading-DFSo1PNW.js",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-Bg-JrYMI.js",
  "./assets/page-C2-glCkO.js",
  "./assets/page-CHrhhKNk.js",
  "./assets/page-CK02oa44.js",
  "./assets/page-CZyeHVjH.js",
  "./assets/page-Ci0CrKAw.js",
  "./assets/page-ClLrCmCu.js",
  "./assets/page-CmXcNjpg.js",
  "./assets/page-D1hCtqf6.css",
  "./assets/page-DkBusWfb.css",
  "./assets/page-Dv2u6JTw.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-f43zHU0v.css",
  "./assets/page-fZ2pHDHp.js",
  "./assets/page-wnkHqfhR.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/rotate-ccw-BY2H2JfM.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-TjdSvAKG.js",
  "./assets/wallet-cards-C-zBsZEZ.js"
];
const ROOT = new URL('./', self.registration.scope);
const SHELL = new URL('index.html', ROOT).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Bypass the browser's ten-minute HTTP cache. Activate only once the new
    // shell and its compiled assets are ready, so offline users keep a working app.
    await cache.addAll(CORE.map(path => new Request(new URL(path, ROOT), { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const old = (await caches.keys()).filter(key => /^investly-v\d+$/.test(key) && key !== CACHE);
    await self.clients.claim();
    const windows = await self.clients.matchAll({ type: 'window' });
    const hasOpenStep = windows.some(client => {
      const url = new URL(client.url);
      return url.origin === ROOT.origin && url.pathname.startsWith(ROOT.pathname) && url.pathname !== ROOT.pathname;
    });
    // An open guide may still import chunks from its previous release. Keep
    // those caches until a later activation with no guide steps left open.
    if (!hasOpenStep) await Promise.all(old.map(key => caches.delete(key)));
    if (!old.length) return;
    windows.forEach(client => {
      const url = new URL(client.url);
      // Refresh old clients too, including versions without an update listener.
      // Leave forms and guide steps open so unfinished input is not interrupted.
      if (url.origin !== ROOT.origin || url.pathname !== ROOT.pathname) return;
      // Do not await navigation from activate: its fetch waits for activation
      // to finish. Waiting for each other would leave the window loading.
      client.navigate(client.url).catch(() => {});
    });
  })());
});

async function navigation(request) {
  const cache = await caches.open(CACHE);
  try {
    let response = await fetch(request, { cache: 'no-store' });
    // GitHub Pages returns 404 for app routes. Fetch the current shell explicitly
    // rather than preferring a shell left over from an earlier release.
    if (!response.ok) response = await fetch(SHELL, { cache: 'no-store' });
    if (!response.ok) throw new Error('App shell unavailable');
    try { await cache.put(SHELL, response.clone()); } catch { /* Storage may be full. */ }
    return response;
  } catch {
    return (await cache.match(SHELL)) || Response.error();
  }
}

async function resource(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (!response.ok) throw new Error('Resource unavailable');
    try { await cache.put(request, response.clone()); } catch { /* Storage may be full. */ }
    return response;
  } catch {
    // Returning HTML for a missing script would break the app during an update.
    const current = await cache.match(request);
    if (current) return current;
    for (const key of await caches.keys()) {
      if (key === CACHE || !/^investly-v\d+$/.test(key)) continue;
      const previous = await (await caches.open(key)).match(request);
      if (previous) return previous;
    }
    return Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== ROOT.origin) return;
  event.respondWith(request.mode === 'navigate' ? navigation(request) : resource(request));
});
