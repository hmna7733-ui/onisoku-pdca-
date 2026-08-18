// sw.js — キャッシュを全削除して自身も無効化
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});
// フェッチは全てネットワーク直接（キャッシュしない）
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
});
