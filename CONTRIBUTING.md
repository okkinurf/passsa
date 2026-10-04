# Contributing

Issue dan pull request dipersilakan. Untuk perubahan lintas modul, baca [peta arsitektur](docs/ARCHITECTURE.md) serta [batas keamanan](docs/SECURITY_FEATURES.md) terlebih dahulu.

## Setup

Gunakan Node.js 22, npm, Rust stable, dan prasyarat native Tauri untuk OS Anda. Untuk menjalankan versi terbaru:

```bash
npm ci
npm run tauri:dev
```

Jangan gunakan `npm start` untuk menguji Tauri; perintah tersebut menjalankan runtime Electron kompatibilitas lama.

## Sebelum mengirim perubahan

Jalankan QA yang tersedia dan jelaskan hasil yang tidak dapat dijalankan:

```bash
npm test
npm run qa:full
npm run tauri:build   # bila mengubah shell, capability, atau packaging Tauri
git diff --check
```

Jika aplikasi development masih berjalan dan mengunci `.tauri/runtime`, tutup aplikasi tersebut sebelum menjalankan ulang tahap persiapan Tauri.

## Pull request

- Buat branch terpisah dengan awalan `feat/`, `fix/`, `docs/`, atau `chore/`.
- Satu PR sebaiknya membahas satu perubahan yang dapat ditinjau.
- Sertakan langkah reproduksi untuk bug, ringkasan perubahan, dan tes yang dijalankan.
- Perbarui README, changelog, atau [known limits](KNOWN-LIMITS.md) bila perilaku pengguna atau dukungan platform berubah.
- Pastikan vault, dummy profile, `.env`, OAuth token, cloud credential, dan material signing tidak ikut dalam diff.
- Perubahan rilis harus membangun source Tauri terbaru dan mempertahankan audit paket serta verifikasi tanda tangan.

Belum ada lisensi yang diterbitkan untuk PassSa. Mengirim kontribusi tidak mengubah status lisensi repository; maintainer perlu menetapkan kebijakan lisensi terpisah.
