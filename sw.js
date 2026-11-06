/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v179';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-Cqsouhc8.js",
  "./assets/AccountBackdrop-D27MIR5e.css",
  "./assets/Button-BJkw_ljz.js",
  "./assets/CommercialDisclosure-B1t29Zmx.js",
  "./assets/DiscoveryBackdrop-DEQQyr-q.js",
  "./assets/DiscoveryBackdrop-DZthyC22.css",
  "./assets/GuideInstructions-C4Se2jqL.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideLink-Cv805r5d.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/StageProgressButton-CveU3k7E.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-Ch40unjh.js",
  "./assets/calendar-days-BxtLj7eC.js",
  "./assets/chevron-up-B8WpCnLw.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-CfuHT8P9.js",
  "./assets/index-Ddu-gFHQ.css",
  "./assets/index-DxZhP81x.js",
  "./assets/layers-DWmBNAHg.js",
  "./assets/opening-heading-BVxh9UMO.css",
  "./assets/opening-heading-UD8H9Ziz.js",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-1mpI6iI0.js",
  "./assets/page-9tc8dFCZ.js",
  "./assets/page-BF-9JYs0.js",
  "./assets/page-BoRf2Qjp.js",
  "./assets/page-Bz3qDYu6.css",
  "./assets/page-C7fargLb.css",
  "./assets/page-CsAW02WP.js",
  "./assets/page-D1hCtqf6.css",
  "./assets/page-DbDHYs6I.js",
  "./assets/page-Do_pIt0n.js",
  "./assets/page-DtXno8vS.js",
  "./assets/page-DzMdy-hl.js",
  "./assets/page-F_ezG58F.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-Nmuccz0l.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/rotate-ccw-C4JMzsn4.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-BWqwsmcY.js",
  "./assets/wallet-cards-PbQhw0Oc.js"
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
