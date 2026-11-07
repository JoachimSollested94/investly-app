/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v185';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-waymark-icon-32.png",
  "./nyvestor-waymark-icon-180.png",
  "./nyvestor-waymark-icon-192.png",
  "./nyvestor-waymark-icon-512.png",
  "./nyvestor-waymark-maskable-512.png",
  "./assets/AccountBackdrop-C5_MJXiW.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-8YsPNQKG.js",
  "./assets/CommercialDisclosure-CilLys1y.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-ESjSExPu.js",
  "./assets/GuideInstructions-BojV7LmG.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/GuideLink-DXiHzuS5.js",
  "./assets/StageProgressButton-7rpDkBuV.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-DOpKiUDA.js",
  "./assets/calendar-days-BU8h1vRh.js",
  "./assets/chevron-up-CYjt-bXx.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-BRG0wnAd.js",
  "./assets/index-BvBaFb0u.js",
  "./assets/index-Fw5mvQLY.css",
  "./assets/layers-Bz58lKm4.js",
  "./assets/opening-heading-D7hPL1em.js",
  "./assets/opening-heading-rRauBh_J.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-B4pD5Bjb.js",
  "./assets/page-BI9GwN_c.js",
  "./assets/page-B_Q32EDh.js",
  "./assets/page-BefjG1Lj.js",
  "./assets/page-BxPqdgpA.css",
  "./assets/page-CgRcOEsA.css",
  "./assets/page-Cwz_GxMk.js",
  "./assets/page-DNQVamhP.js",
  "./assets/page-DR6hk19v.js",
  "./assets/page-Dd3-wmT8.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-OnSrgD_t.js",
  "./assets/page-cQw_xnvg.js",
  "./assets/page-f43zHU0v.css",
  "./assets/page-mSU8FeUn.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/plus-xRBGalXf.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-wrITJyMs.js"
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
