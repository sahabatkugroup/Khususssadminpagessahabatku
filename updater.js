/* Versi web (PWA): pengganti updater APK. Pembaruan diambil otomatis lewat service worker. */
const D = document, BUILD = 107;
const cur = () => { const e = D.getElementById('app-version-label'); return e ? e.textContent.trim() : ''; };
const css = D.createElement('style');
css.textContent = `.up-ov{position:fixed;inset:0;z-index:9996;background:rgba(15,23,42,.6);display:flex;align-items:flex-end;justify-content:center}
.up-box{width:100%;max-width:480px;max-height:90vh;overflow:auto;background:#fff;color:#0f172a;border-radius:24px 24px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));box-shadow:0 -10px 40px rgba(0,0,0,.3)}
@media (min-width:1024px){.up-ov{align-items:center}.up-box{border-radius:24px;padding-bottom:16px}}
.dark .up-box{background:#1e293b;color:#f1f5f9}
.up-box h4{font-size:15px;font-weight:900;margin:0}.up-box small{color:#94a3b8;font-size:11px}
.up-card{margin-top:12px;padding:12px;border-radius:16px;background:rgba(148,163,184,.12)}
.up-card.new{background:linear-gradient(135deg,rgba(16,185,129,.16),rgba(37,99,235,.12));border:1px solid rgba(16,185,129,.35)}
.up-btn{width:100%;margin-top:10px;padding:12px;border-radius:14px;border:0;font-weight:900;font-size:12.5px;color:#fff;background:linear-gradient(135deg,#2563eb,#0ea5e9);cursor:pointer}
.up-btn.g{background:linear-gradient(135deg,#059669,#10b981)}.up-btn:disabled{opacity:.55}`;
D.head.appendChild(css);

function draw(o, st) {
  const P = window.sdPwa, baru = P && P.hasUpdate();
  o.innerHTML = `<div class="up-box"><div style="display:flex;align-items:center;gap:8px"><div style="flex:1"><h4>Versi Aplikasi</h4><small>Terpasang: <b>${cur()}</b> (UPDATE${BUILD}) · ${window.__isStandalone ? 'Mode aplikasi' : 'Mode browser'}</small></div><button type="button" data-a="x" style="border:0;background:rgba(148,163,184,.2);width:32px;height:32px;border-radius:99px;font-size:16px;color:inherit;cursor:pointer">✕</button></div>
  ${baru ? `<div class="up-card new"><b style="font-size:13px">Pembaruan tersedia</b><div style="font-size:11px;color:#64748b;margin-top:2px">Versi terbaru sudah diunduh di latar belakang.</div><button class="up-btn g" data-a="apply" type="button">Perbarui Sekarang</button></div>`
  : `<div class="up-card"><b style="font-size:13px">${st && st.t ? st.t : 'Aplikasi Anda sudah yang terbaru ✓'}</b><div style="font-size:11px;color:#64748b;margin-top:2px">Pembaruan diunduh otomatis saat ada koneksi internet.</div><button class="up-btn" data-a="cek" type="button" ${st && st.busy ? 'disabled' : ''}>Periksa Pembaruan</button></div>`}
  ${!window.__isStandalone ? '<button class="up-btn" data-a="pasang" type="button" style="background:linear-gradient(135deg,#0f766e,#14b8a6)">Pasang di Layar Utama</button>' : ''}</div>`;
  o.querySelector('.up-box').onclick = async (e) => {
    const b = e.target.closest('[data-a]'); if (!b) return; const a = b.dataset.a;
    if (a === 'x') o.remove();
    if (a === 'apply') P.apply();
    if (a === 'pasang') { o.remove(); window.sdPasangApp && window.sdPasangApp(); }
    if (a === 'cek') { draw(o, { t: 'Memeriksa pembaruan…', busy: 1 }); const r = P ? await P.check() : false; draw(o, r ? null : { t: 'Aplikasi Anda sudah yang terbaru ✓' }); }
  };
}
function buka() {
  const old = D.getElementById('up-ov'); if (old) old.remove();
  const o = D.createElement('div'); o.id = 'up-ov'; o.className = 'up-ov'; D.body.appendChild(o);
  o.addEventListener('click', (e) => { if (e.target === o) o.remove(); });
  draw(o);
}
function banner() {
  const lbl = D.getElementById('app-version-label'), row = lbl && lbl.parentElement; if (!row) return;
  if (!row.__up) { row.__up = 1; row.style.cursor = 'pointer'; row.addEventListener('click', buka); }
  const baru = window.sdPwa && window.sdPwa.hasUpdate(), pill = row.querySelector('.up-pill');
  if (baru && !pill) lbl.insertAdjacentHTML('beforebegin', '<span class="up-pill" style="display:inline-block;margin-right:6px;padding:2px 8px;border-radius:99px;background:#10b981;color:#fff;font-size:9px;font-weight:900">UPDATE</span>');
  if (!baru && pill) pill.remove();
}
const oldNav = window.navigateTo;
if (typeof oldNav === 'function' && !oldNav.__up) {
  const w = function (id) { const r = oldNav.apply(this, arguments); if (id === 'screen-pengaturan') setTimeout(banner, 150); return r; };
  w.__up = 1; window.navigateTo = w;
}
window.addEventListener('sd-update-ready', banner);
setTimeout(banner, 2500);
window.sdUpdateBuka = buka;
