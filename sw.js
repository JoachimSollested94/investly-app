/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v113';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-dark-icon-32.png",
  "./nyvestor-dark-icon-180.png",
  "./nyvestor-dark-icon-192.png",
  "./nyvestor-dark-icon-512.png",
  "./nyvestor-dark-maskable-512.png",
  "./assets/Button-DmsWeqjq.js",
  "./assets/DiscoveryShell-CDp_lEbk.js",
  "./assets/DiscoveryShell-tbmqwFCE.css",
  "./assets/GuideLink-BKpLcPfn.js",
  "./assets/Image-wJeSldxQ.js",
  "./assets/account-D9nr034k.css",
  "./assets/arrow-up-right-Duwqe2pR.js",
  "./assets/check-DA323P1L.js",
  "./assets/choice-BStd48ml.css",
  "./assets/cinematic-plan-BigzWJBm.css",
  "./assets/cinematic-plan-CcEK2CuF.js",
  "./assets/index-CO-GHpLK.css",
  "./assets/index-DHBN4EAU.js",
  "./assets/landmark-DBRln8lM.js",
  "./assets/layers-CpNXAakr.js",
  "./assets/page-B2_cM4AD.js",
  "./assets/page-BAJKsViJ.css",
  "./assets/page-BSqY6mwy.js",
  "./assets/page-BUhEbefS.css",
  "./assets/page-CBmlUNmi.js",
  "./assets/page-CCuNIlsj.js",
  "./assets/page-CINVIJRt.js",
  "./assets/page-CftwbM3l.js",
  "./assets/page-CnrpP2Qh.js",
  "./assets/page-DAWYyLMC.js",
  "./assets/page-DVHYmzd4.js",
  "./assets/page-FwDTDah2.css",
  "./assets/page-JRlj4-aT.js",
  "./assets/page-wJ1RLht7.css",
  "./assets/page-yA3DN2Nw.js",
  "./assets/platform-aDInZ_pp.css",
  "./assets/routes-DBDhNJFb.js",
  "./assets/transfer-hZqVbrMp.css",
  "./assets/trending-up-BpH-6Xpn.js"
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
