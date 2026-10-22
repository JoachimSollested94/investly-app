/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v152';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/Button-DXBmChT8.js",
  "./assets/GuideLink-LNLhaH5Z.js",
  "./assets/Image-j0xDCLS9.js",
  "./assets/NextStepAction-CbIsyRmr.js",
  "./assets/NextStepAction-DXOCEoEX.css",
  "./assets/account-D9nr034k.css",
  "./assets/building-2-DnrNDp3V.js",
  "./assets/calendar-days-CUG0Qwop.js",
  "./assets/choice-C3mwJFU5.css",
  "./assets/cinematic-plan-DIaxZoOC.css",
  "./assets/cinematic-plan-Dv5PtiiX.js",
  "./assets/index-4U1ib_LQ.js",
  "./assets/index-CsAhb5nP.css",
  "./assets/layers-CdvU7ISZ.js",
  "./assets/page-B-AVJY-n.js",
  "./assets/page-BVOhywrP.js",
  "./assets/page-C9aWwGRe.js",
  "./assets/page-C_F-y6fL.css",
  "./assets/page-D1uZ3rug.js",
  "./assets/page-DHHm7ISO.js",
  "./assets/page-DITfSZ4G.css",
  "./assets/page-DTpnQb7N.js",
  "./assets/page-DupNqyzL.js",
  "./assets/page-FNFxrq7c.js",
  "./assets/page-FwDTDah2.css",
  "./assets/page-wJ1RLht7.css",
  "./assets/page-wo2wJUmM.js",
  "./assets/page-yZkRlyOj.css",
  "./assets/page-zfVU-BSG.js",
  "./assets/platform-C27jXcu0.css",
  "./assets/routes-CKTl4Rzm.js",
  "./assets/transfer-By6ziku8.css",
  "./assets/trending-up-Hp1Mpvo0.js"
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
