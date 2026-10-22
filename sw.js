/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v159';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/Button-DeRin6PJ.js",
  "./assets/GuideLink-B1449FDz.js",
  "./assets/Image-5XG9IoV1.js",
  "./assets/NextStepAction-CnPaK6Ri.js",
  "./assets/NextStepAction-DXOCEoEX.css",
  "./assets/account-BQrVuy2v.css",
  "./assets/arrow-up-right-wDITDKXM.js",
  "./assets/building-2-yKZfPSzD.js",
  "./assets/calendar-days-BDI8ZcHG.js",
  "./assets/choice-C3mwJFU5.css",
  "./assets/cinematic-plan-DIaxZoOC.css",
  "./assets/cinematic-plan-Dv5PtiiX.js",
  "./assets/index-BRYoF_w2.css",
  "./assets/index-Bu1Gq9WK.js",
  "./assets/layers-EMRlthj2.js",
  "./assets/page-5lyYSQK1.js",
  "./assets/page-CEwHDBAe.js",
  "./assets/page-CGBc_M9S.js",
  "./assets/page-CWTv8cUS.js",
  "./assets/page-C_F-y6fL.css",
  "./assets/page-DVJapY0P.js",
  "./assets/page-D_i8bZjm.css",
  "./assets/page-Ds-nyBpe.js",
  "./assets/page-FwDTDah2.css",
  "./assets/page-TGUxsdkv.js",
  "./assets/page-U0fxdFs-.js",
  "./assets/page-oysQ5q7T.js",
  "./assets/page-qIlB223i.js",
  "./assets/page-wJ1RLht7.css",
  "./assets/page-yZkRlyOj.css",
  "./assets/platform-CNANitYA.css",
  "./assets/routes-CiqIL4Ci.js",
  "./assets/transfer-3-oSk7qx.css",
  "./assets/trending-up-Br7N9olg.js"
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
