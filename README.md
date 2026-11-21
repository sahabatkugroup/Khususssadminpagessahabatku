# Sahabatku Driver Manajemen (Web / PWA)

Semua file ada di folder utama (tanpa subfolder). Siap untuk GitHub Pages.

## Pasang di GitHub Pages
1. Buat repository baru, upload **semua isi ZIP** ke root repository (termasuk `.nojekyll`).
2. Settings → Pages → Source: *Deploy from a branch* → branch `main` / folder `/ (root)`.
3. Buka `https://USERNAME.github.io/NAMA-REPO/` (harus HTTPS agar kamera, GPS, dan instal aplikasi berfungsi).

## Memasang seperti aplikasi
- Android (Chrome): muncul tombol **Pasang**, atau menu ⋮ → Instal aplikasi.
- iPhone (Safari): Bagikan → **Tambah ke Layar Utama**.
- PC/Laptop (Chrome/Edge): ikon instal di address bar.

## Update aplikasi
Ganti file yang berubah di GitHub, lalu **naikkan `VERSION`** di baris 4 `service-worker.js` (mis. `v105.2`).
Pengguna otomatis dapat pemberitahuan "Pembaruan tersedia" → Muat ulang.
