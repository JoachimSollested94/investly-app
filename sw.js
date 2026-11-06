/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v177';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-BHslCK2W.js",
  "./assets/AccountBackdrop-feS7e6L9.css",
  "./assets/Button-BYVi30Lt.js",
  "./assets/CommercialDisclosure-DL18us8h.js",
  "./assets/DiscoveryBackdrop-B24TfUl5.js",
  "./assets/DiscoveryBackdrop-BPNjrPA7.css",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-_W8uerFg.js",
  "./assets/GuideLink-DBSTRaL7.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/StageProgressButton-Cj24U4mq.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-D5DnzBKN.js",
  "./assets/calendar-days-CfH5W11L.js",
  "./assets/chevron-up-1im8HRDk.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-DSfa6nrs.css",
  "./assets/earth-BGtVNLyE.js",
  "./assets/index-Bbll_4Pi.css",
  "./assets/index-DpzLNwgY.js",
  "./assets/layers-DqupXYvb.js",
  "./assets/opening-heading-BVxh9UMO.css",
  "./assets/opening-heading-DJB6VqLb.js",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-78RIH_y2.js",
  "./assets/page-Bz3qDYu6.css",
  "./assets/page-CDG3rOh3.js",
  "./assets/page-CEiuR2Zz.js",
  "./assets/page-CMBKB-pr.js",
  "./assets/page-CMr62ZXk.js",
  "./assets/page-CnyNVAZ_.js",
  "./assets/page-D1hCtqf6.css",
  "./assets/page-D6NAyWgX.css",
  "./assets/page-DK7U-uSa.js",
  "./assets/page-DP9xIbpt.js",
  "./assets/page-DqIHu95i.js",
  "./assets/page-DxrBlbit.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-UuUv5JZv.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/rotate-ccw-Ctl7PgXV.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-CNpaCwii.js",
  "./assets/wallet-cards-16ltLG2i.js"
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
