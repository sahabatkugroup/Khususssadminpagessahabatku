/* Sahabatku Driver Manajemen — Service Worker
   Setiap kali Anda mengganti file di GitHub, naikkan VERSION di bawah ini
   (contoh 'v104.2') supaya semua pengguna otomatis dapat pembaruan. */
const VERSION = 'v107.1';
const CACHE = 'sahabatku-' + VERSION;
const RUNTIME = 'sahabatku-runtime';

const SHELL = [
  './', 'index.html', 'manifest.json', 'compat.js', 'pwa.js', 'native.js', 'web.css',
  'styles.css', 'tailwind-built.css', 'ui-modern.css', 'sd.css', 'reward.css',
  'dm-sans-latin-400-normal.woff2', 'dm-sans-latin-500-normal.woff2', 'dm-sans-latin-700-normal.woff2',
  'lucide-lite.js', 'rolegate.js', 'jamfmt.js', 'bubble.js',
  'fb.js', 'fb8-app.js', 'fb8-database.js', 'fb8-storage.js', 'drive.js',
  'datawin.js', 'script.js', 'sd.js', 'layanan.js', 'adminux.js', 'jelajah.js', 'feed.js', 'updater.js',
  'fotokurir.js', 'menumitra.js', 'menuajuan.js', 'absensi.js', 'kehadiran.js', 'profilkurir.js',
  'petugasmitra.js', 'korlap.js', 'leader.js', 'trainer.js', 'kas.js', 'aktivitas.js',
  'admincalonkurir.js', 'rekapharian.js', 'statuspengajuan.js', 'mitramonitor.js', 'mitraout.js',
  'piketkurir.js', 'reward.js', 'sdform.js', 'logaktivitas.js', 'anfilter.js', 'notaket.js',
  'targetpribadi.js', 'saving.js', 'savingadmin.js', 'sop.js', 'qr.js',
  'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png'
];

const LIB_HOSTS = ['cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com'];
const IMG_HOSTS = ['uploads.onecompiler.io', 'lh3.googleusercontent.com', 'drive.usercontent.google.com'];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(async (u) => {
      try {
        const r = await fetch(new Request(u, { cache: 'reload' }));
        if (r && r.ok) await c.put(u === './' ? 'index.html' : u, r.clone());
        else if (u === 'index.html') throw new Error('index gagal');
      } catch (err) { if (u === 'index.html') throw err; }
    }));
    // Pasang langsung hanya jika belum ada versi lama (pemasangan pertama).
    const lama = (await caches.keys()).some(k => k.startsWith('sahabatku-v') && k !== CACHE);
    if (!lama) self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('sahabatku-v') && k !== CACHE).map(k => caches.delete(k)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.disable(); } catch (_) {} }
    await self.clients.claim();
  })());
});

self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'SKIP_WAITING') self.skipWaiting();
  if (d.type === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'VERSION', version: VERSION });
});

let notified = false;
async function tellClients() {
  if (notified) return; notified = true;
  const cs = await self.clients.matchAll({ type: 'window' });
  cs.forEach(c => c.postMessage({ type: 'CONTENT_UPDATED' }));
}
function berubah(a, b) {
  if (!a || !b) return false;
  const h = (r, k) => r.headers.get(k) || '';
  const e1 = h(a, 'etag'), e2 = h(b, 'etag');
  if (e1 || e2) return e1 !== e2;
  const l1 = h(a, 'last-modified'), l2 = h(b, 'last-modified');
  if (l1 || l2) return l1 !== l2;
  return h(a, 'content-length') !== h(b, 'content-length');
}

// Stale-while-revalidate: tampil instan dari cache, diperbarui diam-diam di belakang.
async function swr(req, cacheName, key, notify) {
  const c = await caches.open(cacheName);
  const hit = await c.match(key || req, { ignoreSearch: false });
  const net = fetch(req, { cache: 'no-cache' }).then(async (r) => {
    if (r && (r.ok || r.type === 'opaque')) {
      if (notify && hit && r.ok && berubah(hit, r)) tellClients();
      try { await c.put(key || req, r.clone()); } catch (_) {}
    }
    return r;
  }).catch(() => null);
  if (hit) { net.catch(() => {}); return hit; }
  const r = await net;
  return r || new Response('Offline', { status: 503, statusText: 'Offline' });
}

async function cacheFirst(req, cacheName) {
  const c = await caches.open(cacheName);
  const hit = await c.match(req);
  if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r && (r.ok || r.type === 'opaque')) { try { await c.put(req, r.clone()); } catch (_) {} }
    return r;
  } catch (e) { return new Response('', { status: 504 }); }
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    if (url.pathname.endsWith('/service-worker.js')) return;
    if (req.mode === 'navigate') {
      e.respondWith((async () => {
        const c = await caches.open(CACHE);
        const hit = await c.match('index.html');
        const net = fetch('index.html', { cache: 'no-cache' }).then(async (r) => {
          if (r && r.ok) { if (hit && berubah(hit, r)) tellClients(); try { await c.put('index.html', r.clone()); } catch (_) {} }
          return r;
        }).catch(() => null);
        if (hit) { net.catch(() => {}); return hit; }
        return (await net) || new Response('Offline', { status: 503 });
      })());
      return;
    }
    const inShell = SHELL.includes(url.pathname.split('/').pop());
    e.respondWith(inShell ? swr(req, CACHE, null, true) : swr(req, RUNTIME, null, false));
    return;
  }
  if (LIB_HOSTS.includes(url.hostname)) { e.respondWith(cacheFirst(req, RUNTIME)); return; }
  if (IMG_HOSTS.includes(url.hostname) && req.destination === 'image') { e.respondWith(swr(req, RUNTIME, null, false)); return; }
  // Firebase, Google Apps Script, dll: langsung ke jaringan (data selalu terbaru).
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil((async () => {
    const cs = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cs.length) { try { await cs[0].focus(); } catch (_) {} }
    else await self.clients.openWindow('./');
  })());
});
