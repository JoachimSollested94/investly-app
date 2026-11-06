/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v178';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-DIoBifJk.js",
  "./assets/AccountBackdrop-cdAwfQdW.css",
  "./assets/Button-DmX9a9s5.js",
  "./assets/CommercialDisclosure-yNrD18aw.js",
  "./assets/DiscoveryBackdrop-BAcOYr8G.css",
  "./assets/DiscoveryBackdrop-BvaSfRHL.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-oy0DEI3F.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/GuideLink-DSf-__4o.js",
  "./assets/StageProgressButton-O1Qwr_4H.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-B7_i0O8c.js",
  "./assets/calendar-days-BdQUkcJl.js",
  "./assets/chevron-up-EKrOqQXC.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-DSfa6nrs.css",
  "./assets/earth-DLPl8mxt.js",
  "./assets/index-BoC1vEJ7.js",
  "./assets/index-BtdtC6jR.css",
  "./assets/layers-BsjL22G_.js",
  "./assets/opening-heading-BVxh9UMO.css",
  "./assets/opening-heading-DfCOjay6.js",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-BVS63t-u.js",
  "./assets/page-BthMeQ6E.js",
  "./assets/page-By4WXdWH.js",
  "./assets/page-Bz3qDYu6.css",
  "./assets/page-C3I63p5V.js",
  "./assets/page-C8UyQTnf.js",
  "./assets/page-CANLYEV9.css",
  "./assets/page-D1hCtqf6.css",
  "./assets/page-DDMqhsAv.js",
  "./assets/page-DhXICEhB.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-J4Z5dAJZ.js",
  "./assets/page-LQi3e-uk.js",
  "./assets/page-ieyjL-cp.js",
  "./assets/page-nGwoWvut.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/rotate-ccw-MOjowvtQ.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-OzZe16pI.js",
  "./assets/wallet-cards-Dgc6zHFZ.js"
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
