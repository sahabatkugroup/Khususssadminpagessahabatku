/* Pemasangan aplikasi (PWA), pembaruan otomatis, dan status online/offline. */
(function () {
  'use strict';
  var W = window, D = document, LS = 'sd_pwa_tunda', reg = null, deferred = null, hasUpdate = false, reloading = false;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function toast(m) { try { (W.showToast || W.toast || (W.Native && W.Native.toast))(m); } catch (e) {} }
  var isStandalone = !!W.__isStandalone, isIOS = !!W.__isIOS;

  var css = D.createElement('style');
  css.textContent =
    '.pwa-card{position:fixed;left:12px;right:12px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:9990;max-width:460px;margin:0 auto;background:#fff;color:#0f172a;border-radius:18px;padding:14px;box-shadow:0 12px 40px rgba(2,12,40,.28);border:1px solid rgba(148,163,184,.3);font:500 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}' +
    '.dark .pwa-card{background:#1e293b;color:#f1f5f9;border-color:#334155}' +
    '.pwa-card .r{display:flex;gap:12px;align-items:center}.pwa-card img{width:44px;height:44px;border-radius:12px;flex:none}' +
    '.pwa-card b{font-size:14px;display:block}.pwa-card small{color:#64748b;font-size:12px}.dark .pwa-card small{color:#94a3b8}' +
    '.pwa-card .b{display:flex;gap:8px;margin-top:12px}.pwa-card button{flex:1;border:0;border-radius:12px;padding:11px;font-weight:800;font-size:13px;cursor:pointer}' +
    '.pwa-card .p{background:linear-gradient(135deg,#0180F7,#0ea5e9);color:#fff}.pwa-card .s{background:rgba(148,163,184,.2);color:inherit}' +
    '.pwa-card ol{margin:10px 0 0;padding-left:20px;font-size:12.5px}.pwa-card ol li{margin:4px 0}' +
    '#pwa-off{position:fixed;top:env(safe-area-inset-top,0px);left:0;right:0;z-index:99998;background:#f59e0b;color:#fff;text-align:center;font:700 12px system-ui,sans-serif;padding:5px 8px;display:none}' +
    '@media (min-width:1024px) and (hover:hover){.pwa-card{left:auto;right:24px;bottom:24px;margin:0;max-width:380px}}';
  D.head.appendChild(css);

  function rm(id) { var e = D.getElementById(id); if (e) e.remove(); }
  function card(id, html) {
    rm(id); var d = D.createElement('div'); d.id = id; d.className = 'pwa-card'; d.innerHTML = html; D.body.appendChild(d); return d;
  }
  var ICON = '<img src="icon-192.png" alt="" width="44" height="44">';

  function tawarkanPasang() {
    if (isStandalone || get(LS) > Date.now()) return;
    if (deferred) {
      var c = card('pwa-install', '<div class="r">' + ICON + '<div><b>Pasang Aplikasi Sahabatku</b><small>Buka lebih cepat dari layar utama, layar penuh, hemat data.</small></div></div><div class="b"><button class="s" data-x>Nanti</button><button class="p" data-ok>Pasang</button></div>');
      c.onclick = function (e) {
        if (e.target.hasAttribute('data-x')) { set(LS, Date.now() + 7 * 864e5); rm('pwa-install'); }
        if (e.target.hasAttribute('data-ok')) { rm('pwa-install'); sdPasang(); }
      };
    } else if (isIOS && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|Instagram|FBAN|FBAV|Line\//.test(navigator.userAgent)) {
      var c2 = card('pwa-install', '<div class="r">' + ICON + '<div><b>Pasang di iPhone</b><small>Jadikan seperti aplikasi biasa.</small></div></div><ol><li>Ketuk tombol <b style="display:inline">Bagikan</b> (kotak berpanah ↑) di Safari</li><li>Pilih <b style="display:inline">Tambah ke Layar Utama</b></li><li>Ketuk <b style="display:inline">Tambah</b></li></ol><div class="b"><button class="s" data-x>Mengerti</button></div>');
      c2.onclick = function (e) { if (e.target.hasAttribute('data-x')) { set(LS, Date.now() + 14 * 864e5); rm('pwa-install'); } };
    }
  }
  function sdPasang() {
    if (deferred) {
      deferred.prompt(); deferred.userChoice.then(function (r) { if (r.outcome !== 'accepted') set(LS, Date.now() + 3 * 864e5); deferred = null; }).catch(function () {});
    } else if (isIOS) { set(LS, 0); tawarkanPasang(); }
    else toast('Gunakan menu browser › Instal aplikasi / Tambahkan ke layar utama');
  }
  W.sdPasangApp = sdPasang;
  W.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; setTimeout(tawarkanPasang, 3500); });
  W.addEventListener('appinstalled', function () { rm('pwa-install'); deferred = null; toast('Aplikasi terpasang ✓'); });
  if (isIOS && !isStandalone) setTimeout(tawarkanPasang, 6000);

  // ---- Pembaruan ----
  function tampilBanner() {
    hasUpdate = true; if (D.getElementById('pwa-update')) return;
    var c = card('pwa-update', '<div class="r">' + ICON + '<div><b>Pembaruan tersedia</b><small>Versi terbaru siap dipakai.</small></div></div><div class="b"><button class="s" data-x>Nanti</button><button class="p" data-ok>Muat ulang</button></div>');
    c.style.bottom = 'calc(' + (D.getElementById('global-nav') && !D.getElementById('global-nav').classList.contains('hidden') ? '76px' : '16px') + ' + env(safe-area-inset-bottom,0px))';
    c.onclick = function (e) { if (e.target.hasAttribute('data-x')) rm('pwa-update'); if (e.target.hasAttribute('data-ok')) terapkan(); };
    try { W.dispatchEvent(new Event('sd-update-ready')); } catch (e) {}
  }
  function terapkan() {
    if (reg && reg.waiting) { reg.waiting.postMessage({ type: 'SKIP_WAITING' }); setTimeout(function () { location.reload(); }, 1500); }
    else location.reload();
  }
  function periksa() {
    if (!reg) return Promise.resolve(false);
    return reg.update().then(function () { return new Promise(function (r) { setTimeout(function () { r(hasUpdate || !!reg.waiting); }, 1200); }); }).catch(function () { return false; });
  }
  W.sdPwa = { check: periksa, apply: terapkan, hasUpdate: function () { return hasUpdate; }, install: sdPasang, standalone: isStandalone };

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    var had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', function () { if (had && !reloading) { reloading = true; location.reload(); } had = true; });
    navigator.serviceWorker.addEventListener('message', function (e) { if (e.data && e.data.type === 'CONTENT_UPDATED') tampilBanner(); });
    W.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').then(function (r) {
        reg = r;
        if (r.waiting && navigator.serviceWorker.controller) tampilBanner();
        r.addEventListener('updatefound', function () {
          var n = r.installing; if (!n) return;
          n.addEventListener('statechange', function () { if (n.state === 'installed' && navigator.serviceWorker.controller) tampilBanner(); });
        });
        setInterval(function () { r.update().catch(function () {}); }, 30 * 60 * 1000);
        D.addEventListener('visibilitychange', function () { if (!D.hidden) r.update().catch(function () {}); });
      }).catch(function (e) { console.warn('SW gagal', e); });
    });
  }

  // ---- Status koneksi ----
  var bar = null;
  function net() {
    if (!bar) { bar = D.createElement('div'); bar.id = 'pwa-off'; bar.textContent = 'Tidak ada koneksi internet — data belum bisa disinkronkan'; D.body.appendChild(bar); }
    bar.style.display = navigator.onLine ? 'none' : 'block';
  }
  W.addEventListener('online', function () { net(); toast('Kembali online'); });
  W.addEventListener('offline', net);
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', net); else net();
})();
