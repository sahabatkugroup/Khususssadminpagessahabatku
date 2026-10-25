/* Penjaga Reward Kurir: kalau data tidak kunjung termuat (koneksi ke server Firebase terblokir / lambat),
   tampilkan pesan yang jelas + tombol "Coba Lagi" supaya tidak macet di "Memuat reward...". */
(function () {
  'use strict';
  var TUNGGU_MS = 9000, timer = null;

  function root() { return document.getElementById('rw-kurir-root'); }
  function aktif() { var s = document.getElementById('screen-kurir-reward'); return !!(s && s.classList.contains('active')); }
  function masihMemuat() { var r = root(); return !!(r && /Memuat reward/i.test(r.textContent || '')); }

  function tampilkanGagal() {
    var r = root(); if (!r || !masihMemuat()) return;
    var box = r.querySelector('.rw-empty'); if (!box) return;
    box.innerHTML =
      '<div style="font-size:34px;margin-bottom:6px">📡</div>' +
      '<p style="margin:0 0 4px;font-weight:700">Reward belum bisa dimuat</p>' +
      '<p style="margin:0 0 14px;font-size:12px;opacity:.7;line-height:1.5">Sambungan ke server lambat atau terputus.<br>Periksa internet / matikan VPN atau pemblokir iklan, lalu coba lagi.</p>' +
      '<button type="button" id="rwRetry" style="border:0;border-radius:12px;padding:11px 22px;font:700 13px system-ui,sans-serif;color:#fff;background:linear-gradient(135deg,#0066FF,#00A3FF);cursor:pointer">Coba Lagi</button>';
    var b = document.getElementById('rwRetry');
    if (b) b.addEventListener('click', function () {
      b.textContent = 'Memuat...'; b.disabled = true;
      try { if (typeof window.muatRewardKurir === 'function') window.muatRewardKurir(); } catch (e) {}
      pantau();
    });
  }

  function pantau() {
    clearTimeout(timer);
    timer = setTimeout(function () { if (aktif()) tampilkanGagal(); }, TUNGGU_MS);
  }

  function mulai() {
    var s = document.getElementById('screen-kurir-reward');
    if (!s || !window.MutationObserver) { setTimeout(mulai, 600); return; }
    new MutationObserver(function () { if (aktif()) pantau(); else clearTimeout(timer); })
      .observe(s, { attributes: true, attributeFilter: ['class'] });
    if (aktif()) pantau();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulai); else mulai();
  /* ---- Admin: layar "Memuat..." yang tidak kunjung selesai ---- */
  var timerA = null;
  function aktifA() { var s = document.getElementById('screen-admin-reward'); return !!(s && s.classList.contains('active')); }
  function gagalA() {
    var b = document.getElementById('rw-a-body');
    if (!b || !/^\s*Memuat\.\.\.\s*$/.test(b.textContent || '')) return;
    b.innerHTML = '<div class="rw-empty"><div style="font-size:34px;margin-bottom:6px">📡</div>' +
      '<p style="margin:0 0 4px;font-weight:700">Data reward belum bisa dimuat</p>' +
      '<p style="margin:0 0 14px;font-size:12px;opacity:.7;line-height:1.5">Sambungan ke server lambat atau terputus.<br>Periksa internet / matikan VPN atau pemblokir iklan.</p>' +
      '<button type="button" class="rw-btn" onclick="muatRewardAdmin()">Coba Lagi</button></div>';
  }
  function pantauA() { clearTimeout(timerA); timerA = setTimeout(function () { if (aktifA()) gagalA(); }, TUNGGU_MS); }
  function mulaiA() {
    var s = document.getElementById('screen-admin-reward');
    if (!s || !window.MutationObserver) { setTimeout(mulaiA, 600); return; }
    new MutationObserver(function () { if (aktifA()) pantauA(); else clearTimeout(timerA); })
      .observe(s, { attributes: true, attributeFilter: ['class'] });
    if (aktifA()) pantauA();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mulaiA); else mulaiA();
})();
