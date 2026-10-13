// 한 번 열면 학교 인터넷이 끊겨도 놀 수 있도록 파일을 저장해 둬요.
const CACHE = 'jjikjjik-v3';
const FILES = ["./","index.html","manifest.webmanifest","icon.svg","img/circle.jpg","img/craft.jpg","img/doll.jpg","img/explore.jpg","img/gacha.jpg","img/gift.jpg","img/jump.jpg","img/keys.jpg","img/mascot.jpg","img/maze.jpg","img/piano.jpg","img/pick.jpg","img/pop.jpg","img/rain.jpg","img/robot.jpg","img/sea.jpg","img/secret.jpg","img/shop.jpg","img/skyup.jpg","img/sort.jpg","img/words.jpg"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isFont = url.hostname.endsWith('googleapis.com') || url.hostname.endsWith('gstatic.com');
  if (url.origin !== location.origin && !isFont) return;
  // 페이지는 새 버전을 먼저, 그림·글꼴은 저장해 둔 것을 먼저 써요.
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return r; }).catch(() => caches.match('index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque') { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })));
});
