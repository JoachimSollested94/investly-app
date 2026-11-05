/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v173';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/AccountBackdrop-DNoyD96O.css",
  "./assets/AccountBackdrop-ScUv48S-.js",
  "./assets/Button-DkEvjaaU.js",
  "./assets/DiscoveryBackdrop-BQk4EPRt.css",
  "./assets/DiscoveryBackdrop-DP1aS6RR.js",
  "./assets/GuideInstructions-M8X9Jouo.js",
  "./assets/GuideInstructions-yZ8eB8CJ.css",
  "./assets/GuideLink-DIHeZgZa.js",
  "./assets/Image-D7GkTARY.js",
  "./assets/account-C8QYNHzo.css",
  "./assets/arrow-right-BThxkQCE.css",
  "./assets/arrow-right-rsr3hQME.js",
  "./assets/arrow-up-right-Dsa5y3i_.js",
  "./assets/calendar-days-Dwx_xc3E.js",
  "./assets/chevron-up-B6KFunuS.js",
  "./assets/choice-CGO7bO6Y.css",
  "./assets/cinematic-plan-VYuxJwva.css",
  "./assets/index-BUVOW9W1.css",
  "./assets/index-SfKH63P5.js",
  "./assets/layers-U4xwUONr.js",
  "./assets/opening-heading-CPC8_gdw.css",
  "./assets/opening-heading-nFW4wFf1.js",
  "./assets/page-BBpmRm1U.js",
  "./assets/page-BNfL9vr_.js",
  "./assets/page-BRP8hPYK.js",
  "./assets/page-BkIWK-4k.js",
  "./assets/page-BmwKa7d_.js",
  "./assets/page-Bp_yL35h.css",
  "./assets/page-Bw6Xgo8y.js",
  "./assets/page-C2gTW6x2.js",
  "./assets/page-C5Yi31y6.css",
  "./assets/page-CVTjpJb1.js",
  "./assets/page-Cr5S6K5_.js",
  "./assets/page-DYk6Bhsb.css",
  "./assets/page-DgITe6eO.js",
  "./assets/page-H1fGfltQ.js",
  "./assets/page-N4AamT_z.css",
  "./assets/page-Q4IJAm44.css",
  "./assets/page-xasZLZks.css",
  "./assets/platform-CRJCRrdH.css",
  "./assets/rotate-ccw-BtitKbrw.js",
  "./assets/routes-Cs4Xayrn.js",
  "./assets/transfer-HIFP86BT.css",
  "./assets/trending-up-D5RM4VS7.js",
  "./assets/wallet-cards-DmVmGpXI.js"
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
