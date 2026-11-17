const CACHE = 'majo-pinball-v14';
const ASSETS = ['./', 'index.html', 'app.js', 'mp-utils.js', 'style.css', 'data/games.js', 'data/part-1.js', 'data/part-2.js', 'data/part-3.js', 'data/part-4.js', 'data/part-5.js', 'data/part-6.js', 'data/part-7.js', 'data/pinside.js', 'data/pro-tips.js', 'data/merge.js', 'manifest.webmanifest'];

self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS))));
self.addEventListener('activate', (e) => e.waitUntil(
  caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))));
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) return; // live data: never cached
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone();
    caches.open(CACHE).then((c) => c.put(e.request, copy));
    return r;
  }).catch(() => caches.match(e.request)));
});
