# Panduan Kontribusi PassSa

Terima kasih telah mempertimbangkan kontribusi untuk PassSa. Issue dan pull request untuk laporan bug, perbaikan, dokumentasi, maupun usulan fitur dipersilakan. Untuk perubahan lintas modul, baca [peta arsitektur](docs/ARCHITECTURE.md) dan [fitur keamanan](docs/SECURITY_FEATURES.md) terlebih dahulu.

## Menyiapkan lingkungan

Siapkan Node.js 22.12 atau lebih baru, npm, Rust stable, serta dependensi native [Tauri v2](https://v2.tauri.app/start/prerequisites/) untuk sistem operasi Anda. Dari root repository, instal dependensi dan jalankan aplikasi Tauri:

```bash
npm ci
npm run tauri:dev
```

`npm start` dan `npm run dev:skip-login` menjalankan runtime Electron kompatibilitas lama, bukan aplikasi desktop Tauri terbaru. Untuk pengembangan Tauri, gunakan `npm run tauri:dev`.

## Menjalankan pemeriksaan

Sebelum mengirim pull request, jalankan pemeriksaan berikut bila lingkungan Anda mendukungnya. Jelaskan di PR jika ada pemeriksaan yang tidak dapat dijalankan:

```bash
npm run qa:full
git diff --check
```

`npm run qa:full` menjalankan test, smoke test, pemeriksaan Tauri, dan pemeriksaan sintaks. Jika perubahan menyentuh proses packaging atau Anda ingin mencoba build lokal, jalankan:

```bash
npm run tauri:build
```

Jika PassSa yang sedang berjalan mengunci folder `.tauri/runtime`, tutup instance development tersebut sebelum mengulangi pemeriksaan Tauri.

## Membuat pull request

- Buat branch terpisah dengan awalan `feat/`, `fix/`, `docs/`, atau `chore/`.
- Batasi satu pull request pada satu tujuan agar perubahan mudah ditinjau.
- Jelaskan masalah dan perubahan yang dibuat. Untuk bug, sertakan langkah reproduksi; untuk perubahan UI, tambahkan tangkapan layar bila membantu.
- Cantumkan pemeriksaan yang dijalankan beserta hasilnya.
- Perbarui README, changelog, atau [batas yang diketahui](KNOWN-LIMITS.md) jika perilaku, fitur, atau dukungan platform berubah.
- Jangan sertakan vault, profil dummy, file `.env`, token OAuth, credential cloud, private key, atau materi signing.
- Perubahan pada fitur atau packaging Tauri harus tetap lulus audit paket dan pemeriksaan CI lintas platform.
- Perubahan release harus dibangun dari source Tauri terbaru serta mempertahankan audit paket dan verifikasi signature.

## Keamanan dan lisensi

Jangan melaporkan kerentanan melalui issue atau pull request publik. Ikuti [kebijakan keamanan](SECURITY.md) untuk mengirim laporan secara privat.

Repository ini belum menetapkan lisensi open-source. Mengirim kontribusi tidak dengan sendirinya menetapkan lisensi repository; ketentuan kontribusi dan lisensi perlu ditetapkan oleh maintainer.
