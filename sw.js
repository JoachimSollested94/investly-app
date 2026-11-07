/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v186';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-nature-icon-32.png",
  "./nyvestor-nature-icon-180.png",
  "./nyvestor-nature-icon-192.png",
  "./nyvestor-nature-icon-512.png",
  "./nyvestor-nature-maskable-512.png",
  "./assets/AccountBackdrop-BYhyJISl.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-PXLYiF3q.js",
  "./assets/CommercialDisclosure-QuL7uCui.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-usaip2Xj.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-CeypHQ_K.js",
  "./assets/GuideLink-DBOcGERr.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/StageProgressButton-DODfb8YT.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-up-right-CLdPBiXj.js",
  "./assets/calendar-days-tk_Xwlke.js",
  "./assets/chevron-up-CcSirCtw.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-BvwTnQ5P.css",
  "./assets/earth-B9pnO-Gj.js",
  "./assets/index--K_EzmMG.css",
  "./assets/index-Bif_AN8a.js",
  "./assets/layers-qawZ_OFO.js",
  "./assets/nyvestor-nature-avatar-DGkQ7hCm.webp",
  "./assets/opening-heading-Dij-Ovol.js",
  "./assets/opening-heading-rRauBh_J.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-6UmKD4xI.js",
  "./assets/page-BGOF16Gz.js",
  "./assets/page-BOTBC5rI.js",
  "./assets/page-BblrsaJz.js",
  "./assets/page-BxPqdgpA.css",
  "./assets/page-C0XS5CPF.js",
  "./assets/page-CgRcOEsA.css",
  "./assets/page-CqYB7LaV.js",
  "./assets/page-CtB1uJfd.js",
  "./assets/page-Dsn5X4Px.js",
  "./assets/page-FivX_gWo.css",
  "./assets/page-ZTsYwtqG.js",
  "./assets/page-f43zHU0v.css",
  "./assets/page-gKAqpoEt.js",
  "./assets/page-v7FdjVSm.js",
  "./assets/page-xasZLZks.css",
  "./assets/platform-DAEKmpA1.css",
  "./assets/plus-DJoaVGcg.js",
  "./assets/transfer-CWaE5wRC.css",
  "./assets/trending-up-D264pmJp.js"
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
