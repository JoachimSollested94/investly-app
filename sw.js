/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v202';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-mint-glass-icon-32.png",
  "./nyvestor-mint-glass-icon-180.png",
  "./nyvestor-mint-glass-icon-192.png",
  "./nyvestor-mint-glass-icon-512.png",
  "./nyvestor-mint-glass-maskable-512.png",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/AccountBackdrop-Mt-sXJNA.js",
  "./assets/Button-BO5hgjGI.js",
  "./assets/CommercialDisclosure-DXXWisd0.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-Cv0h3YiU.js",
  "./assets/GuideBackControl-B0vfVaDk.css",
  "./assets/GuideBackControl-DLgSqwnw.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideInstructions-DO4LoSWH.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/GuideLink-DlNUOVjv.js",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-right-B7JmrYjK.js",
  "./assets/arrow-right-VlFUCzNN.css",
  "./assets/arrow-up-right-2DVshfpy.js",
  "./assets/calendar-days-Iks9HZbL.js",
  "./assets/chevron-down-CBZU3r8G.js",
  "./assets/chevron-up-697OFJ64.js",
  "./assets/choice-CXSQaswe.css",
  "./assets/cinematic-plan-DHk4jlFr.css",
  "./assets/earth-HT5Cb29q.js",
  "./assets/index-CiICu9xi.css",
  "./assets/index-wn7TJPTZ.js",
  "./assets/inter-italic-latin-ext-variable-0pjOp8NU.woff2",
  "./assets/inter-italic-latin-variable-DpCbqKDY.woff2",
  "./assets/inter-latin-ext-variable-DO1Apj_S.woff2",
  "./assets/inter-latin-variable-Dx4kXJAl.woff2",
  "./assets/layers-B-pAsuY3.js",
  "./assets/opening-heading-Bj-cRRPi.css",
  "./assets/opening-heading-C5F_9aAv.js",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-8l01fQ5F.js",
  "./assets/page-B5Ijql9u.js",
  "./assets/page-BX0vg5Pr.js",
  "./assets/page-Bk4V23OC.js",
  "./assets/page-Bt04PO14.css",
  "./assets/page-C-mUQW9d.js",
  "./assets/page-C0eQltA1.js",
  "./assets/page-CC7fljdM.css",
  "./assets/page-CDQFpU7_.css",
  "./assets/page-CRz16OFs.js",
  "./assets/page-CTDekG8-.js",
  "./assets/page-CVaZ-cHL.js",
  "./assets/page-D3lueeuh.css",
  "./assets/page-PA9HcXYc.js",
  "./assets/page-XOR-RjHu.js",
  "./assets/page-mv_bNIug.css",
  "./assets/platform-CP4vmoZw.css",
  "./assets/plus-vVR6HOaH.js",
  "./assets/transfer-B6HlA2IF.css",
  "./assets/trending-up-h4EagiIo.js"
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
