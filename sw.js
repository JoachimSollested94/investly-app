/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v188';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-mint-glass-icon-32.png",
  "./nyvestor-mint-glass-icon-180.png",
  "./nyvestor-mint-glass-icon-192.png",
  "./nyvestor-mint-glass-icon-512.png",
  "./nyvestor-mint-glass-maskable-512.png",
  "./assets/AccountBackdrop-D4n8j4DI.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-sN5Ln46d.js",
  "./assets/CommercialDisclosure-sK4WT8AL.js",
  "./assets/DiscoveryBackdrop-BJu0XBwW.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/GuideInstructions-BO9HP9hZ.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/GuideLink-Dc4TEBzl.js",
  "./assets/StageProgressButton-dqUeOeLX.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-DOhKYBaY.js",
  "./assets/calendar-days-CNJsNktR.js",
  "./assets/chevron-up-1Drstr5c.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-sgb8UM17.js",
  "./assets/index--K_EzmMG.css",
  "./assets/index-B_Yk18D0.js",
  "./assets/layers-DAX1hd8d.js",
  "./assets/opening-heading-DWuB5Ehi.js",
  "./assets/opening-heading-rRauBh_J.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-B1wpXr30.js",
  "./assets/page-BMUK25Ih.js",
  "./assets/page-BgWPKPA2.js",
  "./assets/page-BxPqdgpA.css",
  "./assets/page-C1glffn-.js",
  "./assets/page-CJKQMHru.js",
  "./assets/page-CWMib8HA.js",
  "./assets/page-CWbFGfsH.js",
  "./assets/page-CgRcOEsA.css",
  "./assets/page-D1M9quOT.js",
  "./assets/page-DDTpLyGY.js",
  "./assets/page-DJwApcTO.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-IGf1N4vp.js",
  "./assets/page-f43zHU0v.css",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/plus-B0mHPX8r.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-_lxph-w5.js"
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
