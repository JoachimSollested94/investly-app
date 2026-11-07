/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v183';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-C_ZMzmyx.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-DHb8hPTd.js",
  "./assets/CommercialDisclosure-y6YTClIs.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-dNDWenQQ.js",
  "./assets/GuideInstructions-C3dwUgLv.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/GuideLink-DFX1etPh.js",
  "./assets/StageProgressButton-DrR3ii2E.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-DHHAhhdP.js",
  "./assets/calendar-days-CLBAQZq-.js",
  "./assets/chevron-up-CjMl3T1b.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-CYhwDlFn.js",
  "./assets/index-BODGVdU8.js",
  "./assets/index-BUuZjY6c.css",
  "./assets/layers-DZIW15nr.js",
  "./assets/opening-heading-BipSzu_8.js",
  "./assets/opening-heading-rRauBh_J.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-4ASK8zQE.js",
  "./assets/page-BRzD5prw.js",
  "./assets/page-Bfrc2pX1.js",
  "./assets/page-BrPzXkuF.js",
  "./assets/page-BxPqdgpA.css",
  "./assets/page-C3uZHZxY.js",
  "./assets/page-CA0RTUTd.js",
  "./assets/page-CPqVa3ju.css",
  "./assets/page-CSL9m0i_.js",
  "./assets/page-ChtLgu8O.js",
  "./assets/page-D_hSwBPB.js",
  "./assets/page-DhzImLMv.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-f43zHU0v.css",
  "./assets/page-iH5fRhYb.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/plus-BiPDwL6a.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-B6OLixZQ.js"
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
