/* ============================================================
   Penanda "Unduh Aplikasi Android" — muncul HANYA setelah login.
   Ganti nama file APK di bawah jika kamu upload APK versi baru.
   ============================================================ */
(function () {
  'use strict';
  var APK_FILE = 'SahabatkuDriverManajemen-UPDATE66.apk';
  var APK_VERSI = 'UPDATE 66';
  var APK_UKURAN = '± 8,7 MB';
  var SESSION_KEY = 'sahabatku_session';
  var SEEN_KEY = 'sahabatku_apk_seen';
  var MIN_KEY = 'sahabatku_apk_min';
  function sudahMin() { try { return localStorage.getItem(MIN_KEY) === '1'; } catch (e) { return false; } }

  // Di dalam aplikasi Android (APK) tombol ini tidak perlu
  try {
    var C = window.Capacitor;
    if (C && C.isNativePlatform && C.isNativePlatform()) return;
  } catch (e) {}

  var deferredInstall = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredInstall = e;
    var b = document.getElementById('apkPwaBtn');
    if (b) b.style.display = 'flex';
  });

  function sudahLogin() {
    try {
      var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
      return !!(s && (s.username || s.id));
    } catch (e) { return false; }
  }
  function sudahDilihat() { try { return localStorage.getItem(SEEN_KEY) === '1'; } catch (e) { return false; } }
  function tandaiDilihat() { try { localStorage.setItem(SEEN_KEY, '1'); } catch (e) {} }

  var css = [
    '#apkFab{position:fixed;right:12px;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:9000;display:flex;align-items:center;gap:8px;',
    'padding:10px 14px 10px 12px;border:0;border-radius:999px;color:#fff;font:700 12px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;',
    'background:linear-gradient(135deg,#0066FF,#00A3FF);box-shadow:0 8px 22px rgba(0,102,255,.38);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s}',
    '#apkFab:active{transform:scale(.95)}',
    '#apkWrap{position:fixed;right:0;bottom:calc(86px + env(safe-area-inset-bottom,0px));z-index:9000;display:none;align-items:center;gap:6px;padding-right:12px;transition:transform .28s ease}',
    '#apkWrap.min{transform:translateX(calc(100% - 34px));padding-right:0}',
    '#apkWrap #apkFab{position:relative;right:auto;bottom:auto;display:flex}',
    '#apkWrap.min #apkFab{display:none}',
    '#apkHide{width:26px;height:26px;border-radius:50%;border:0;background:rgba(15,23,42,.62);color:#fff;font-size:15px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent}',
    '#apkWrap.min #apkHide{display:none}',
    '#apkTab{display:none;width:34px;height:46px;border:0;border-radius:14px 0 0 14px;background:linear-gradient(135deg,#0066FF,#00A3FF);color:#fff;cursor:pointer;box-shadow:0 6px 16px rgba(0,102,255,.35);align-items:center;justify-content:center;padding:0;position:relative;-webkit-tap-highlight-color:transparent}',
    '#apkTab svg{width:18px!important;height:18px!important;max-width:none!important}',
    '#apkTab .dot{position:absolute;top:4px;left:4px;width:10px;height:10px;border-radius:50%;background:#ff3b30;border:2px solid #fff;animation:apkPulse 1.6s infinite}',
    '#apkWrap.min #apkTab{display:flex}',
    '#apkFab svg,#apkSheet svg{width:18px!important;height:18px!important;max-width:none!important;flex:none}',
    '#apkFab .dot{position:absolute;top:-3px;right:-2px;width:13px;height:13px;border-radius:50%;background:#ff3b30;border:2px solid #fff;animation:apkPulse 1.6s infinite}',
    '@keyframes apkPulse{0%{box-shadow:0 0 0 0 rgba(255,59,48,.6)}70%{box-shadow:0 0 0 9px rgba(255,59,48,0)}100%{box-shadow:0 0 0 0 rgba(255,59,48,0)}}',
    '#apkOv{position:fixed;inset:0;z-index:9500;display:none;align-items:flex-end;justify-content:center;background:rgba(15,23,42,.55)}',
    '#apkOv.on{display:flex}',
    '#apkSheet{width:100%;max-width:460px;background:#fff;color:#0f172a;border-radius:24px 24px 0 0;padding:20px 20px calc(20px + env(safe-area-inset-bottom,0px));',
    'font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;box-shadow:0 -10px 40px rgba(0,0,0,.25);animation:apkUp .25s ease}',
    '@keyframes apkUp{from{transform:translateY(40px);opacity:0}to{transform:none;opacity:1}}',
    'html.dark #apkSheet{background:#1e293b;color:#f1f5f9}',
    '#apkSheet .hd{display:flex;gap:12px;align-items:center;margin-bottom:14px}',
    '#apkSheet .hd img{width:54px;height:54px;border-radius:14px;box-shadow:0 4px 12px rgba(0,0,0,.18)}',
    '#apkSheet h3{margin:0;font-size:16px;font-weight:800}',
    '#apkSheet .sub{font-size:12px;opacity:.65;margin-top:2px}',
    '#apkSheet .x{margin-left:auto;border:0;background:rgba(148,163,184,.2);color:inherit;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer}',
    '#apkSheet .meta{display:flex;gap:8px;margin-bottom:14px}',
    '#apkSheet li{display:list-item;list-style:decimal outside}','#apkSheet .meta span{white-space:nowrap;flex:1;text-align:center;font-size:11px;padding:8px 6px;border-radius:12px;background:rgba(0,102,255,.09);color:#0066FF;font-weight:700}',
    'html.dark #apkSheet .meta span{background:rgba(0,163,255,.15);color:#7cc4ff}',
    '#apkSheet ol{list-style:decimal outside;margin:0 0 16px;padding-left:20px;font-size:12.5px;line-height:1.65;opacity:.85}',
    '#apkSheet a.go,#apkSheet button.alt{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;box-sizing:border-box;padding:14px;border-radius:14px;',
    'font:800 13px system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;text-decoration:none;cursor:pointer;letter-spacing:.3px}',
    '#apkSheet a.go{background:linear-gradient(135deg,#0066FF,#00A3FF);color:#fff;box-shadow:0 8px 20px rgba(0,102,255,.32)}',
    '#apkSheet button.alt{margin-top:10px;border:1.5px solid rgba(0,102,255,.35);background:transparent;color:#0066FF;display:none}',
    'html.dark #apkSheet button.alt{color:#7cc4ff;border-color:rgba(124,196,255,.4)}',
    '#apkSheet .note{margin-top:12px;font-size:11px;opacity:.55;text-align:center}'
  ].join('');

  var icoDl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M5 21h14"/></svg>';

  function bangun() {
    if (document.getElementById('apkFab')) return;
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var fab = document.createElement('button');
    fab.id = 'apkFab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Unduh aplikasi Android');
    fab.innerHTML = icoDl + '<span>Unduh Aplikasi</span>' + (sudahDilihat() ? '' : '<i class="dot"></i>');
    var wrap = document.createElement('div'); wrap.id = 'apkWrap';
    var hide = document.createElement('button'); hide.id = 'apkHide'; hide.type = 'button';
    hide.setAttribute('aria-label', 'Sembunyikan tombol unduh'); hide.innerHTML = '&rsaquo;';
    var tab = document.createElement('button'); tab.id = 'apkTab'; tab.type = 'button';
    tab.setAttribute('aria-label', 'Tampilkan tombol unduh');
    tab.innerHTML = icoDl + (sudahDilihat() ? '' : '<i class="dot"></i>');
    wrap.appendChild(hide); wrap.appendChild(fab); wrap.appendChild(tab);
    document.body.appendChild(wrap);
    function setMin(v) { wrap.classList.toggle('min', v); try { localStorage.setItem(MIN_KEY, v ? '1' : '0'); } catch (e) {} }
    setMin(sudahMin());
    hide.addEventListener('click', function () { setMin(true); });
    tab.addEventListener('click', function () { setMin(false); });
    window.apkToggle = function () { setMin(!wrap.classList.contains('min')); };

    var ov = document.createElement('div'); ov.id = 'apkOv';
    ov.innerHTML =
      '<div id="apkSheet" role="dialog" aria-modal="true">' +
        '<div class="hd"><img src="icon-192.png" alt="Sahabatku">' +
          '<div><h3>Sahabatku Driver Manajemen</h3><div class="sub">Aplikasi Android resmi (APK)</div></div>' +
          '<button class="x" type="button" id="apkClose" aria-label="Tutup">&times;</button></div>' +
        '<div class="meta"><span>' + APK_VERSI + '</span><span>' + APK_UKURAN + '</span><span>Android</span></div>' +
        '<ol><li>Tekan tombol <b>Unduh APK</b> di bawah.</li>' +
        '<li>Buka file hasil unduhan, lalu izinkan <b>Instal dari sumber ini</b> jika diminta.</li>' +
        '<li>Tekan <b>Instal</b>, lalu buka aplikasinya dan login seperti biasa.</li></ol>' +
        '<a class="go" id="apkGo" href="' + APK_FILE + '">' + icoDl + ' Unduh APK</a>' +
        '<button class="alt" type="button" id="apkPwaBtn">Atau pasang versi web di layar utama</button>' +
        '<button class="alt" type="button" id="apkMinBtn" style="display:flex">Sembunyikan tombol ini</button>' +
        '<div class="note">Khusus HP Android. Pengguna iPhone cukup gunakan versi web ini.</div>' +
      '</div>';
    document.body.appendChild(ov);

    function buka() { ov.classList.add('on'); tandaiDilihat(); document.querySelectorAll('#apkFab .dot,#apkTab .dot').forEach(function (d) { d.remove(); }); }
    function tutup() { ov.classList.remove('on'); }
    fab.addEventListener('click', buka);
    document.getElementById('apkClose').addEventListener('click', tutup);
    ov.addEventListener('click', function (e) { if (e.target === ov) tutup(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') tutup(); });

    document.getElementById('apkMinBtn').addEventListener('click', function () { tutup(); setMin(true); });
    var pwa = document.getElementById('apkPwaBtn');
    if (deferredInstall) pwa.style.display = 'flex';
    pwa.addEventListener('click', function () {
      if (!deferredInstall) return;
      deferredInstall.prompt();
      deferredInstall.userChoice.finally(function () { deferredInstall = null; pwa.style.display = 'none'; });
    });
  }

  function sinkron() {
    bangun();
    var wrap = document.getElementById('apkWrap');
    if (!wrap) return;
    var tampil = sudahLogin();
    wrap.style.display = tampil ? 'flex' : 'none';
    if (!tampil) { var ov = document.getElementById('apkOv'); if (ov) ov.classList.remove('on'); }
  }

  function mulai() {
    sinkron();
    setInterval(sinkron, 800);                       // deteksi login / logout
    window.addEventListener('storage', sinkron);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai);
  else mulai();
})();
