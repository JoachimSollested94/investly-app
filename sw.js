/* Nyvestor: fresh navigation, offline support and safe landing-page updates. */
const CACHE = 'investly-v195';
const CORE = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./nyvestor-mint-glass-icon-32.png",
  "./nyvestor-mint-glass-icon-180.png",
  "./nyvestor-mint-glass-icon-192.png",
  "./nyvestor-mint-glass-icon-512.png",
  "./nyvestor-mint-glass-maskable-512.png",
  "./assets/AccountBackdrop-COmyx3fK.js",
  "./assets/AccountBackdrop-DyaXHARU.css",
  "./assets/Button-AFZy1Vfz.js",
  "./assets/CommercialDisclosure-Ca4smu17.js",
  "./assets/DiscoveryBackdrop-C-dkOfGl.css",
  "./assets/DiscoveryBackdrop-ChRkQybc.js",
  "./assets/GuideBackControl-B0vfVaDk.css",
  "./assets/GuideBackControl-TgVx95zy.js",
  "./assets/GuideInstructions-BCQ1EZIr.js",
  "./assets/GuideInstructions-CJNTz1OA.css",
  "./assets/GuideLink-CEfUSxl9.js",
  "./assets/GuideLink-DD8TTsEi.css",
  "./assets/account-0klwcfY7.css",
  "./assets/arrow-right-BZFSfhoa.js",
  "./assets/arrow-right-leaqhc5F.css",
  "./assets/arrow-up-right-BNABQqd1.js",
  "./assets/calendar-days-CekRMrha.js",
  "./assets/chevron-down-CiiR6rzK.js",
  "./assets/chevron-up-CGt9WsKq.js",
  "./assets/choice-XiqEE68n.css",
  "./assets/cinematic-plan-B5pmAZhl.css",
  "./assets/earth-RfshHTGb.js",
  "./assets/index-BTydYIm1.css",
  "./assets/index-BkeYztmI.js",
  "./assets/layers-T6kC_J8T.js",
  "./assets/opening-heading-QQXKNuPu.js",
  "./assets/opening-heading-njTS55QA.css",
  "./assets/page--ukwmJ5-.css",
  "./assets/page-1Aw1qh1w.js",
  "./assets/page-6TUETg6A.js",
  "./assets/page-B4_Q6g45.js",
  "./assets/page-BgJbHHkk.js",
  "./assets/page-BxPqdgpA.css",
  "./assets/page-CBzjDqIT.js",
  "./assets/page-CEf0QUZP.js",
  "./assets/page-CZCBgflR.css",
  "./assets/page-CekAGYp1.css",
  "./assets/page-CgiKE-Ki.js",
  "./assets/page-D3lueeuh.css",
  "./assets/page-DZtXE8tL.js",
  "./assets/page-DeuLGX6n.css",
  "./assets/page-Dm7QeZeQ.js",
  "./assets/page-PsuMI7bO.js",
  "./assets/page-RVV4fyfI.js",
  "./assets/platform-BgC8zqJc.css",
  "./assets/plus-C2s7H5JY.js",
  "./assets/transfer-B6HlA2IF.css",
  "./assets/trending-up-DexKyHdG.js"
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
