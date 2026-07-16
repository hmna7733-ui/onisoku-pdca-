// sw.js — 鬼速PDCA Service Worker
// 戦略: index.html は常にネットワーク優先（キャッシュしない）
//        アイコン等の静的ファイルのみキャッシュ

const CACHE_NAME = 'onisoku-pdca-v4.3.0';
const STATIC_CACHE = [
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
];

// インストール時: 静的ファイルだけキャッシュ
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_CACHE).catch(() => {});
    })
  );
  // 即座にアクティブ化（待機しない）
  self.skipWaiting();
});

// アクティベート時: 古いキャッシュを全削除
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  // 即座にクライアントを制御
  self.clients.claim();
});

// フェッチ: index.html と Firebase 関連は常にネットワーク
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // index.html / Firebase / API 系は常にネットワーク（キャッシュしない）
  if (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('version.json') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('google') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('firestore')
  ) {
    e.respondWith(
      fetch(e.request, { cache: 'no-store' }).catch(() => caches.match(e.request))
    );
    return;
  }

  // 静的ファイル: キャッシュ優先、なければネットワーク
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});

// メッセージ受信: skipWaiting
self.addEventListener('message', e => {
  if (e.data === 'skipWaiting' || (e.data && e.data.type === 'SKIP_WAITING')) {
    self.skipWaiting();
  }
});
