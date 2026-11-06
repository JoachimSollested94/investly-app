/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v176';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-DbzZiMA0.js",
  "./assets/AccountBackdrop-feS7e6L9.css",
  "./assets/Button-Pj-hdSxW.js",
  "./assets/CommercialDisclosure-5b9UdEC8.js",
  "./assets/DiscoveryBackdrop-9Mxv4Vbn.js",
  "./assets/DiscoveryBackdrop-BPNjrPA7.css",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-xIOXTZ0X.js",
  "./assets/GuideLink-D4YKh9Rf.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/StageProgressButton-y5rKSyNH.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-Bo2WhFif.js",
  "./assets/calendar-days-Bsmh9YJk.js",
  "./assets/chevron-up-PJMnhR5d.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-DSfa6nrs.css",
  "./assets/earth-yTm6JIxp.js",
  "./assets/index-DFYyqhpf.css",
  "./assets/index-Oyfr7j-U.js",
  "./assets/layers-BiHdOzKN.js",
  "./assets/opening-heading-BLSXqCnI.js",
  "./assets/opening-heading-BVxh9UMO.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-ByPGVtn-.js",
  "./assets/page-Bz3qDYu6.css",
  "./assets/page-CQJMCPER.js",
  "./assets/page-CRPn6xUX.js",
  "./assets/page-D1hCtqf6.css",
  "./assets/page-D6NAyWgX.css",
  "./assets/page-D9ngmDIY.js",
  "./assets/page-DXNq6fdU.js",
  "./assets/page-DkA7jOzD.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-JVeQaHsP.js",
  "./assets/page-LdubsOVm.js",
  "./assets/page-VOVmsxBy.js",
  "./assets/page-Ywl69mEr.js",
  "./assets/page-uJcKyCxd.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/rotate-ccw-owgULzAR.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-l7p6xQYg.js",
  "./assets/wallet-cards-DbooJmx0.js"
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
